"""Build the EP01 soundtrack and retime ep01.json from the real VO.

Steps:
1. Pick a VO take per shot, trim to speech, speed up slightly, loudness-normalise.
2. Lay shots out back to back: lead silence + VO + tail (fixed lengths for no-VO shots).
3. Map caption words onto TTS transcript word timestamps -> absolute times in ep01.json.
4. Premix VO + ambience beds (ducked under VO) + SFX cues into public/audio/mix.wav.
Run from the project root: python3 -I scripts/build_audio.py
"""
import json, os, re, subprocess, difflib

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
A = os.path.join(ROOT, "public", "audio")
FIN = os.path.join(A, "final")
DATA = os.path.join(ROOT, "src", "data", "ep02.json")
TEMPO = 1.03
SR = 48000

TAKE = {1: 2, 2: 2, 3: 1, 4: 2, 5: 2, 6: 1, 7: 1, 8: 2, 9: 1, 10: 1, 11: 2, 12: 2, 13: 1, 14: 2, 15: 2, 16: 2}
PAD = {  # lead, tail (seconds, after tempo)
    1: (.6, .35), 2: (.15, .55), 3: (.5, .4), 4: (.3, .35), 5: (.3, .3), 6: (.25, .6), 7: (.4, .3), 8: (.25, .5),
    9: (.35, .4), 10: (.2, .3), 11: (.15, .35), 12: (.3, .35), 13: (.1, .6), 14: (.4, .6), 15: (.4, .35), 16: (.35, .6),
}
FIXED = {17: 2.6}
VO_FX = {16: "aecho=0.8:0.5:60|120:0.2|0.12,"}

def sh(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        raise RuntimeError(" ".join(cmd) + "\n" + r.stderr[-2000:])
    return r


def dur(f):
    return float(sh(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).stdout)


def norm(t):
    return re.sub(r"[^a-z0-9']", "", t.lower())


def align(caption_words, tts_words):
    """Return [(start,end)] per caption word, from TTS words (seconds, relative to trimmed clip)."""
    a = [norm(w["text"]) for w in caption_words]
    b = [norm(w["text"]) for w in tts_words]
    out = [None] * len(a)
    sm = difflib.SequenceMatcher(None, a, b, autojunk=False)
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == "equal" or (tag == "replace" and i2 - i1 == j2 - j1):
            for k in range(i2 - i1):
                out[i1 + k] = (tts_words[j1 + k]["start"], tts_words[j1 + k]["end"])
        elif tag == "replace" and j2 > j1:
            s, e = tts_words[j1]["start"], tts_words[j2 - 1]["end"]
            n = i2 - i1
            for k in range(n):
                out[i1 + k] = (s + (e - s) * k / n, s + (e - s) * (k + 1) / n)
    # fill gaps by interpolation between neighbours
    for i in range(len(out)):
        if out[i] is None:
            prev = next((out[j][1] for j in range(i - 1, -1, -1) if out[j]), tts_words[0]["start"])
            nxt = next((out[j][0] for j in range(i + 1, len(out)) if out[j]), tts_words[-1]["end"])
            out[i] = (prev, max(prev + .05, nxt))
    return out


def main():
    os.makedirs(FIN, exist_ok=True)
    raw = json.load(open(os.path.join(A, "manifest_raw.json")))
    ep = json.load(open(DATA))
    shots = ep["shots"]

    # 1-2. process VO and lay out the timeline
    t = 0.0
    vo_cues = []
    for s in shots:
        sid = s["id"]
        if sid in TAKE:
            take = raw["vo"][str(sid)][str(TAKE[sid])]
            words = take["words"]
            a, b = max(0, words[0]["start"] - .06), words[-1]["end"] + .14
            out = os.path.join(FIN, f"vo{sid:02d}.wav")
            sh(["ffmpeg", "-v", "error", "-y", "-i", os.path.join(A, take["file"]), "-af",
                f"atrim={a}:{b},asetpts=N/SR/TB,highpass=f=80,{VO_FX.get(sid, '')}atempo={TEMPO},"
                f"loudnorm=I=-17:TP=-2:LRA=9,afade=t=in:d=0.02,areverse,afade=t=in:d=0.06,areverse",
                "-ar", str(SR), "-ac", "2", out])
            vlen = dur(out)
            lead, tail = PAD[sid]
            s["start"], s["end"] = round(t, 3), round(t + lead + vlen + tail, 3)
            vo_start = t + lead
            spans = align(s["words"], words)
            for w, (ws, we) in zip(s["words"], spans):
                w["start"] = round(vo_start + (ws - a) / TEMPO, 3)
                w["end"] = round(vo_start + (we - a) / TEMPO, 3)
            vo_cues.append((out, vo_start))
            t = s["end"]
        else:
            s["start"], s["end"] = round(t, 3), round(t + FIXED[sid], 3)
            for k, w in enumerate(s.get("words") or []):  # on-screen only (CTA): pop words in over ~1.2s
                w["start"] = round(t + .25 + k * .3, 3)
                w["end"] = round(w["start"] + .3, 3)
            t = s["end"]
    total = round(t, 3)
    ep["durationSec"] = total
    ep["timingSource"] = "ai33 eleven_v3 TTS transcript, tempo x%.2f" % TEMPO
    S = {s["id"]: s for s in shots}

    def at(sid, off=0.0):
        return S[sid]["start"] + off

    def word_t(sid, text):
        for w in S[sid]["words"]:
            if norm(w["text"]) == norm(text):
                return w["start"]
        return S[sid]["start"]

    # 3. cue sheet. (file, start, opts)  opts: dur, vol(dB), fin, fout, loop, fx, ss
    sfx = lambda n: os.path.join(A, "sfx", n + ".mp3")
    end_of = lambda sid: S[sid]["end"]
    beds = [
        (sfx("amb_beach"), 0, dict(dur=at(7), vol=0, fin=1.0, fout=.4, loop=True)),
        (sfx("amb_beach"), at(9), dict(dur=at(16) - at(9) + .5, vol=0, fin=.6, fout=.6, loop=True)),
        (sfx("corridor"), at(6), dict(dur=at(7) - at(6), vol=-2, fin=.2, fout=.3, loop=True)),
        (sfx("clock"), at(7), dict(dur=at(9) - at(7), vol=-8, fin=.2, fout=.3, loop=True)),
        (sfx("underwater"), at(4), dict(dur=at(5) - at(4), vol=-2, fin=.3, fout=.3, loop=True)),
        (sfx("underwater"), at(16), dict(dur=end_of(16) - at(16), vol=0, fin=.3, fout=.4, loop=True)),
        (sfx("drone_sea"), at(3), dict(dur=at(7) - at(3), vol=-6, fin=1.5, fout=.6, loop=True)),
        (sfx("drone_sea"), at(9), dict(dur=total - at(9), vol=-4, fin=2.5, fout=1.5, loop=True)),
    ]
    far = "highpass=f=300,lowpass=f=3000,aecho=0.8:0.7:200|420:0.3|0.2,"
    cues = [  # vol is relative to -24 LUFS; one prominent sound at a time
        (sfx("silk_whoosh"), at(2) - .3, dict(dur=.42, vol=-2, fout=.12)),
        (sfx("boom"), at(2), dict(dur=1.7, vol=2, fout=.8)),
        (sfx("gong"), at(3, .1), dict(dur=2.4, vol=-2, fout=1.2)),
        (sfx("choir"), at(3, 2.5), dict(dur=at(5) - at(3, 2.5) - .3, vol=-10, fin=1.0, fout=1.0, fx=far)),
        (sfx("fabric"), at(7, .1), dict(dur=1.2, vol=-6, fout=.3)),
        (sfx("zipper"), at(7, 1.4), dict(dur=1.0, vol=-6, fout=.2)),
        (sfx("scarf"), at(8, .15), dict(vol=-4)),
        (sfx("drain"), at(9), dict(dur=end_of(9) - at(9), vol=-4, fin=.3, fout=.6)),
        (sfx("murmur"), at(10), dict(dur=end_of(10) - at(10), vol=-10, fin=.2, fout=.4)),
        (sfx("shutter"), at(10, .3), dict(dur=1.2, vol=-8, fout=.2)),  # layered inside the murmur on purpose
        (sfx("steps_sand"), at(11), dict(dur=end_of(11) - at(11), vol=-6, fout=.3)),
        (sfx("foam"), at(12, .1), dict(dur=end_of(12) - at(12, .1), vol=-4, fout=.5)),
        (sfx("laugh"), at(13, .9), dict(dur=.9, vol=-12, fout=.3)),
        (sfx("riser"), at(14, .8), dict(dur=word_t(14, "turning") - at(14, .8), vol=-8, fin=1.5, fout=.3)),
        (sfx("dye"), word_t(14, "turning"), dict(dur=2.2, vol=-8, fout=.8)),
        (sfx("gong"), at(15, .2), dict(dur=1.7, vol=-12, fx=far, fout=1.0)),
        (sfx("wave_crash"), at(16) - .25, dict(dur=1.6, vol=-4, fout=.8)),
        (sfx("heartbeat"), at(16, 1.4), dict(dur=end_of(16) - at(16, 1.4), vol=-8, fin=.4, fout=.4)),
        (sfx("gong"), at(17), dict(vol=0, fout=1.5)),
    ]

    # 4. build ffmpeg graph
    inputs, chains, labels = [], [], {"vo": [], "bed": [], "sfx": []}

    _lufs = {}

    def lufs(path):
        if path not in _lufs:
            o = subprocess.run(["ffmpeg", "-i", path, "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
            m = re.findall(r"I:\s+(-?[\d.]+) LUFS", o)
            _lufs[path] = float(m[-1]) if m else -30.0
        return _lufs[path]

    TARGET = {"vo": None, "bed": -30.0, "sfx": -24.0}  # stem loudness before the relative 'vol' offset

    def add(path, start, o, bus):
        i = sum(1 for x in inputs if x == "-i")
        if TARGET[bus] is not None:
            o = dict(o, vol=o.get("vol", 0) + max(-30.0, min(30.0, TARGET[bus] - lufs(path))))
        if o.get("loop"):
            inputs.extend(["-stream_loop", "-1", "-i", path])
        else:
            inputs.extend(["-i", path])
        f = f"[{i}:a]aformat=sample_fmts=fltp:sample_rates={SR}:channel_layouts=stereo,"
        if o.get("dur"):
            f += f"atrim=0:{o['dur']:.3f},asetpts=N/SR/TB,"
        f += o.get("fx", "")
        if o.get("fin"):
            f += f"afade=t=in:d={o['fin']:.3f},"
        if o.get("fout"):
            if o.get("dur"):
                f += f"afade=t=out:st={max(0, o['dur'] - o['fout']):.3f}:d={o['fout']:.3f},"
            else:
                f += f"areverse,afade=t=in:d={o['fout']:.3f},areverse,"
        f += f"volume={o.get('vol', 0):.2f}dB"
        lab = f"c{i}"
        if o.get("sweep"):
            d = o.get("dur", 2)
            f += (f",asplit[{lab}a][{lab}b];[{lab}a]volume=eval=frame:volume='max(0,1-t/{d})',pan=stereo|c0=c0+c1|c1=0*c0[{lab}l];"
                  f"[{lab}b]volume=eval=frame:volume='min(1,t/{d})',pan=stereo|c0=0*c0|c1=c0+c1[{lab}r];"
                  f"[{lab}l][{lab}r]amix=inputs=2:normalize=0")
        ms = int(round(max(0, start) * 1000))
        f += f",adelay={ms}|{ms}[{lab}]"
        chains.append(f)
        labels[bus].append(f"[{lab}]")

    for path, st in vo_cues:
        add(path, st, {}, "vo")
    for p, st, o in beds:
        add(p, st, o, "bed")
    for p, st, o in cues:
        add(p, st, o, "sfx")

    # overlap report for SFX cues (same-time cues should be intentional layers, not collisions)
    iv = []
    for p, st, o in cues:
        d = o.get("dur") or dur(p)
        iv.append((st, st + d, os.path.basename(p)))
    iv.sort()
    for a_, b_ in zip(iv, iv[1:]):
        if b_[0] < a_[1] - 0.15 and not (a_[2] == "murmur.mp3" and b_[2] == "shutter.mp3"):
            print(f"overlap: {a_[2]} {a_[0]:.2f}-{a_[1]:.2f} with {b_[2]} {b_[0]:.2f}-{b_[1]:.2f}")

    g = ";".join(chains)
    g += f";{''.join(labels['vo'])}amix=inputs={len(labels['vo'])}:normalize=0,equalizer=f=3000:t=q:w=1.2:g=2,apad=whole_dur={total},asplit=3[vo][key][key2]"
    # beds: cut the voice band so words sit in a pocket, then duck hard under VO
    g += f";{''.join(labels['bed'])}amix=inputs={len(labels['bed'])}:normalize=0,highpass=f=50,equalizer=f=2500:t=q:w=1.4:g=-6[beds]"
    g += ";[beds][key]sidechaincompress=threshold=0.012:ratio=10:attack=25:release=450:knee=4[bedsd]"
    # sfx: lighter ducking so hits stay punchy between words but never sit on top of a word
    g += f";{''.join(labels['sfx'])}amix=inputs={len(labels['sfx'])}:normalize=0[fx]"
    g += ";[fx][key2]sidechaincompress=threshold=0.02:ratio=4:attack=15:release=300[fxd]"
    g += ";[bedsd][fxd]amix=inputs=2:normalize=0,asplit[bg][bgs]"
    g += f";[vo]asplit[vom][vos];[vom][bg]amix=inputs=2:normalize=0,atrim=0:{total},afade=t=out:st={total - .6:.3f}:d=0.6[pre]"
    pre = os.path.join(FIN, "premaster.wav")
    gpath = os.path.join(FIN, "graph.txt")
    open(gpath, "w").write(g)
    sh(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex_script", gpath,
        "-map", "[pre]", "-ar", str(SR), pre,
        "-map", "[vos]", "-ar", str(SR), os.path.join(FIN, "stem_vo.wav"),
        "-map", "[bgs]", "-ar", str(SR), os.path.join(FIN, "stem_bg.wav")])
    # master: one linear gain to -14 LUFS + true-peak limiter (no dynamic loudnorm, so the balance is kept)
    gain = -14.0 - lufs(pre)
    out = os.path.join(A, "mix.wav")
    sh(["ffmpeg", "-v", "error", "-y", "-i", pre, "-af", f"volume={gain:.2f}dB,alimiter=limit=0.84:attack=3:release=60:level=disabled", "-ar", str(SR), out])

    # verification: VO vs background level during every spoken word
    def rms_db(path, a_, b_):
        o = subprocess.run(["ffmpeg", "-ss", f"{a_:.3f}", "-t", f"{max(.05, b_ - a_):.3f}", "-i", path, "-af", "astats=measure_overall=RMS_level:measure_perchannel=none", "-f", "null", "-"], capture_output=True, text=True).stderr
        m = re.findall(r"RMS level dB:\s+(-?[\d.inf]+)", o)
        return float(m[-1]) if m and m[-1] not in ("-inf", "inf") else -90.0
    diffs = []
    for s_ in shots:
        if s_["id"] in TAKE:
            for w in s_["words"]:
                diffs.append((rms_db(os.path.join(FIN, "stem_vo.wav"), w["start"], w["end"]) - rms_db(os.path.join(FIN, "stem_bg.wav"), w["start"], w["end"]), s_["id"], w["text"]))
    diffs.sort()
    print("VO-over-background dB: min %.1f (%s, shot %d), median %.1f" % (diffs[0][0], diffs[0][2], diffs[0][1], diffs[len(diffs) // 2][0]))
    print("lowest 5:", [(round(d, 1), sid, t) for d, sid, t in diffs[:5]])
    o = subprocess.run(["ffmpeg", "-i", out, "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
    print("master:", " ".join(re.findall(r"(I:\s+-?[\d.]+ LUFS|LRA:\s+[\d.]+ LU|Peak:\s+-?[\d.]+ dBFS)", o)[-3:]))

    ep["audio"] = True
    json.dump(ep, open(DATA, "w"), indent=1, ensure_ascii=False)
    print("total", total, "s | shots:", [(s["id"], s["start"], s["end"]) for s in shots])
    print("mix", out, dur(out))


if __name__ == "__main__":
    main()
