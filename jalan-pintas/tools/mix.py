"""Mix VO + SFX (ep/sfx.json) to the house loudness: voice -16 LUFS, master -14 LUFS, TP < -1 dBTP.
Items:  beds  {f, from, to, db, duck?, af?, pitch?, fin?, fout?, ss?}   (looped, trimmed to from..to)
        hits  {f, t, db, af?, pitch?, ss?, dur?}                        (one-shot at t)
f = library/sfx/<f>.mp3 or a synth '@name' (see SYNTH). Beds with duck=true are side-chained under the VO.
Everything stops at `end` (cut to black). usage: python3 -I tools/mix.py ep01 -> ep01/mix.wav"""
import json, os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(HERE, "..")
LIB = os.path.join(ROOT, "..", "library", "sfx")
ep = os.path.join(ROOT, sys.argv[1]); cfg = json.load(open(os.path.join(ep, "sfx.json"))); END = cfg["end"]
tmp = os.path.join(ep, "vo", "_tmp"); os.makedirs(tmp, exist_ok=True)
L = lambda n: os.path.join(LIB, n + ".mp3")

# lavfi graphs; '{ride}' / '{idle}' are replaced by library inputs
SYNTH = {
    # two-tone app chime, same for every message
    "@notif": ("sine=f=1318:d=0.12[a];sine=f=1760:d=0.22[b];[a]afade=t=out:st=0.05:d=0.07[a2];[b]adelay=110,afade=t=out:st=0.18:d=0.14[b2];[a2][b2]amix=inputs=2:normalize=0", []),
    # phone vibration: 3 short 170 Hz buzzes
    "@buzz": ("sine=f=170:d=0.9,volume=0.9,tremolo=f=28:d=1,volume='if(lt(mod(t,0.3),0.18),1,0)':eval=frame,afade=t=out:st=0.8:d=0.1", []),
    "@pop": ("sine=f=880:d=0.09,afade=t=out:st=0.02:d=0.07", []),
    "@tap": ("anoisesrc=d=0.03:c=white:a=0.6,highpass=f=2500,afade=t=out:st=0.005:d=0.025", []),
    # map ping (sonar-ish)
    "@ping": ("sine=f=1560:d=0.9,afade=t=out:st=0.02:d=0.85,aecho=0.6:0.5:180:0.3", []),
    # minimarket door chime 'ding-dong'
    "@dingdong": ("sine=f=1046:d=0.9[a];sine=f=784:d=1.4[b];[a]afade=t=out:st=0.05:d=0.85[a2];[b]adelay=420,afade=t=out:st=0.5:d=1.2[b2];[a2][b2]amix=inputs=2:normalize=0", []),
    # brake squeal
    "@brake": ("sine=f=2900:d=0.7,vibrato=f=9:d=0.3,afade=t=in:d=0.08,afade=t=out:st=0.45:d=0.25,volume=0.5", []),
    # road / tyre rumble bed (brown noise)
    "@rumble": ("anoisesrc=d=30:c=brown:a=0.8,lowpass=f=140,highpass=f=35", []),
    # doppler pass-by: engine pitched up and closing, then pitched down and leaving
    "@passby": ("[0:a]atrim=0:0.7,asetrate=48000*1.18,aresample=48000,afade=t=in:d=0.5[a];[0:a]atrim=1:2.2,asetrate=48000*0.86,aresample=48000,afade=t=out:st=0.2:d=1.0[b];[a][b]concat=n=2:v=0:a=1", ["moto_ride"]),
    # engine sputter and die: three chunks dropping in pitch, chopped, then nothing
    # tape rewind whir: rising squeal + hiss
    "@tape": ("sine=f=600:d=2,vibrato=f=14:d=0.6,asetrate=48000*1.6,aresample=48000,volume=0.25[a];anoisesrc=d=2:c=pink:a=0.5,highpass=f=1500[b];[a][b]amix=inputs=2:normalize=0,afade=t=in:d=0.1,afade=t=out:st=1.7:d=0.3", []),
    "@die": ("[0:a]atrim=0:0.35,asetrate=48000*0.95,aresample=48000[a];[0:a]atrim=1:1.25,asetrate=48000*0.78,aresample=48000,volume=0.8[b];[0:a]atrim=2:2.45,asetrate=48000*0.6,aresample=48000,volume=0.6,tremolo=f=9:d=0.9,afade=t=out:st=0.2:d=0.25[c];[a][b][c]concat=n=3:v=0:a=1,lowpass=f=4000", ["moto_ride"]),
}

def synth(name):
    out = os.path.join(tmp, name[1:] + ".wav")
    graph, srcs = SYNTH[name]
    ins = []
    for s in srcs: ins += ["-i", L(s)]
    if srcs:
        cmd = ["ffmpeg", "-y", "-v", "error", *ins, "-filter_complex", graph + ",aformat=sample_rates=48000:channel_layouts=mono", "-ar", "48000", out]
    else:
        cmd = ["ffmpeg", "-y", "-v", "error", "-filter_complex", graph + ",aformat=sample_rates=48000:channel_layouts=mono", "-ar", "48000", out]
    subprocess.run(cmd, check=True)
    return out

made = {}
def src_of(f):
    if f.startswith("@"):
        if f not in made: made[f] = synth(f)
        return made[f]
    return L(f)

def pre(it):
    s = "aformat=sample_rates=48000:channel_layouts=mono"
    if it.get("pitch"): s += f",asetrate=48000*{it['pitch']},aresample=48000"
    if it.get("af"): s += "," + it["af"]
    return s

inputs = ["-i", os.path.join(ep, "vo.wav")]; chains = []; duck = []; plain = []; n = 1
for b in cfg["beds"]:
    dur = b["to"] - b["from"]; fin = b.get("fin", 0.3); fout = b.get("fout", 0.25)
    inputs += ["-stream_loop", "-1"] + (["-ss", str(b["ss"])] if b.get("ss") else []) + ["-i", src_of(b["f"])]
    lab = f"b{n}"
    chains.append(f"[{n}:a]{pre(b)},atrim=0:{dur:.3f},afade=t=in:d={fin},afade=t=out:st={max(0, dur - fout):.3f}:d={fout},volume={b['db'] + cfg.get('bed_gain', 0)}dB,adelay={int(b['from'] * 1000)}:all=1[{lab}]")
    (duck if b.get("duck") else plain).append(f"[{lab}]"); n += 1
for h in cfg["hits"]:
    inputs += (["-ss", str(h["ss"])] if h.get("ss") else []) + ["-i", src_of(h["f"])]; lab = f"h{n}"
    trim = f",atrim=0:{h['dur']},afade=t=out:st={max(0, h['dur'] - 0.2)}:d=0.2" if h.get("dur") else ""
    chains.append(f"[{n}:a]{pre(h)}{trim},volume={h['db'] + cfg.get('hit_gain', 0)}dB,adelay={int(h['t'] * 1000)}:all=1[{lab}]")
    plain.append(f"[{lab}]"); n += 1
g = ";".join(chains)
g += ";[0:a]aformat=sample_rates=48000:channel_layouts=mono,asplit=2[vo][sc]"
g += f";{''.join(duck)}amix=inputs={len(duck)}:normalize=0[dk];[dk][sc]sidechaincompress=threshold=0.05:ratio=2.5:attack=20:release=300[dkd]"
if os.environ.get("STEM") == "sfx":  # check: SFX only, same gains, no loudnorm (compare against the -16 LUFS VO)
    g += f";[vo]anullsink;[dkd]{''.join(plain)}amix=inputs={1 + len(plain)}:normalize=0,atrim=0:{END}[out]"
else:
    rw = cfg.get("rewind")
    if rw:  # GAGAL -> rewind: the wrong branch (VO + SFX) reversed and sped up, everything else muted in the window
        a0, a1 = rw["src"]; at, d = rw["at"], rw["dur"]; k = (a1 - a0) / d
        g += f";[vo][dkd]{''.join(plain)}amix=inputs={2 + len(plain)}:normalize=0,asplit=2[pre][cp]"
        g += f";[cp]atrim={a0}:{a1},asetpts=PTS-STARTPTS,areverse,asetrate=48000*{k:.3f},aresample=48000,atrim=0:{d},afade=t=in:d=0.05,afade=t=out:st={d - 0.15:.3f}:d=0.15,volume={rw.get('db', -6)}dB,adelay={int(at * 1000)}:all=1[rv]"
        g += f";[pre]volume=0:enable='between(t,{at},{at + d})'[pm];[pm][rv]amix=inputs=2:normalize=0"
    else:
        g += f";[vo][dkd]{''.join(plain)}amix=inputs={2 + len(plain)}:normalize=0"
    g += f",atrim=0:{END},afade=t=out:st={END - 0.03:.3f}:d=0.03,loudnorm=I=-14.6:TP=-1.5:LRA=11,alimiter=limit=0.85,aresample=48000[out]"
out = os.path.join(ep, "mix.wav" if os.environ.get("STEM") != "sfx" else "vo/_tmp/sfx_stem.wav")
subprocess.run(["ffmpeg", "-y", "-v", "error", *inputs, "-filter_complex", g, "-map", "[out]", "-ac", "2", out], check=True)
r = subprocess.run(["ffmpeg", "-hide_banner", "-i", out, "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
print("\n".join(l for l in r.splitlines()[-12:] if "I:" in l or "Peak:" in l))
