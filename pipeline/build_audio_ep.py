"""Build soundtrack + retime episode.json for EP04-06.  usage: python3 -I build_audio_ep.py ep04
Takes are picked automatically (best transcript match, flat-noise takes rejected). Stems are loudness-normalised,
beds ducked under VO, SFX lightly ducked, overlaps reported, VO-over-background verified per word."""
import json, os, re, subprocess, difflib, sys, statistics
KEY = sys.argv[1]
ROOT = f"/home/user/{KEY}"; A = f"{ROOT}/public/audio"; FIN = f"{A}/final"; DATA = f"{ROOT}/src/data/episode.json"
LIB = "/home/user/sfxlib"; TEMPO = 1.05; SR = 48000; CTA_LEN = 2.8
VO_FX = {"ghost": "lowpass=f=6500,aecho=0.8:0.5:60|120:0.2|0.12,", "man": "highpass=f=300,lowpass=f=3400,acompressor=threshold=0.1:ratio=3,"}
TEMPO_EP = {"ep11": 1.12, "ep12": 1.13, "ep14": 1.12, "ep16": 1.10, "ep17": 1.12, "ep18": 1.10, "ep19": 1.10, "ep20": 1.05, "ep21": 1.10, "ep22": 1.10, "ep23": 1.10, "ep24": 1.05, "ep25": 1.08}
TEMPO = TEMPO_EP.get(KEY, TEMPO)
PAUSE_EP = {"ep16": .45, "ep17": .45, "ep18": .45, "ep19": .45, "ep20": .45, "ep21": .45, "ep22": .45, "ep23": .45, "ep24": .45, "ep25": .45}  # max silence kept between words (source seconds); longer gaps are shortened
MAXGAP = PAUSE_EP.get(KEY)

def sh(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: raise RuntimeError(" ".join(cmd) + "\n" + r.stderr[-2000:])
    return r
def dur(f): return float(sh(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).stdout)
def norm(t): return re.sub(r"[^a-z0-9']", "", t.lower())
def rms_series(f, step=0.25):
    o = subprocess.run(["ffmpeg", "-i", f, "-af", f"asetnsamples={int(44100*step)},astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level", "-f", "null", "-"], capture_output=True, text=True).stderr
    return [float(x) for x in re.findall(r"RMS_level=(-?[\d.]+)", o)]
def is_flat_noise(f):
    s = [x for x in rms_series(f) if x > -60]
    return len(s) > 8 and statistics.pstdev(s) < 2.0
def align(cw, tw):
    a = [norm(w["text"]) for w in cw]; b = [norm(w["text"]) for w in tw]; out = [None] * len(a)
    for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes():
        if tag == "equal" or (tag == "replace" and i2 - i1 == j2 - j1):
            for k in range(i2 - i1): out[i1 + k] = (tw[j1 + k]["start"], tw[j1 + k]["end"])
        elif tag == "replace" and j2 > j1:
            s, e = tw[j1]["start"], tw[j2 - 1]["end"]; n = i2 - i1
            for k in range(n): out[i1 + k] = (s + (e - s) * k / n, s + (e - s) * (k + 1) / n)
    for i in range(len(out)):
        if out[i] is None:
            prev = next((out[j][1] for j in range(i - 1, -1, -1) if out[j]), tw[0]["start"])
            nxt = next((out[j][0] for j in range(i + 1, len(out)) if out[j]), tw[-1]["end"])
            out[i] = (prev, max(prev + .05, nxt))
    return out

def cue_sheet(S, at, end_of, word_t, total):
    L = lambda n: f"{LIB}/{n}.mp3"
    far = "highpass=f=300,lowpass=f=3000,aecho=0.8:0.7:200|420:0.3|0.2,"
    if KEY == "ep04":
        beds = [(L("amb_night"), 0, dict(dur=at(6), fin=1.0, fout=.4, loop=True)),
                (L("moto_ride"), at(6), dict(dur=end_of(6) - at(6), fin=.3, fout=.3, loop=True)),
                (L("moto_idle"), at(7), dict(dur=at(11) - at(7), vol=-3, fin=.3, fout=.6, loop=True)),
                (L("dawn"), at(11), dict(dur=end_of(11) - at(11), fin=.8, fout=.5, loop=True)),
                (L("amb_night"), at(12), dict(dur=total - at(12), fin=.5, fout=1.0, loop=True)),
                (L("drone"), at(2), dict(dur=at(5) - at(2), vol=-6, fin=1.0, fout=.6, loop=True)),
                (L("drone"), at(7), dict(dur=at(11) - at(7), vol=-4, fin=1.5, fout=.4, loop=True)),
                (L("drone"), at(12), dict(dur=total - at(12), vol=-6, fin=1.0, fout=1.5, loop=True))]
        cues = [(L("low_note"), at(2), dict(dur=2.8, vol=-4, fout=1.4)),
                (L("cloth"), at(4, .3), dict(dur=1.4, vol=-6, fout=.4)),
                (L("whoosh"), at(6) - .25, dict(dur=.5, vol=-8, fout=.15)),
                (L("riser"), at(8, .2), dict(dur=max(.6, word_t(8, "knot") - at(8, .2)), vol=-10, fin=.8, fout=.1)),
                (L("hit"), word_t(8, "knot"), dict(dur=min(1.6, at(9) - word_t(8, "knot")), vol=-4, fout=.6)),
                (L("heartbeat"), at(9), dict(dur=end_of(9) - at(9), vol=-8, fin=.2, fout=.2)),
                (L("breath"), at(10), dict(dur=end_of(10) - at(10), vol=0, fin=.2, fout=.3)),
                (L("creak"), at(12, .4), dict(dur=1.8, vol=-12, fout=.6)),
                (L("low_note"), at(13), dict(dur=2.6, vol=0, fout=1.4))]
    elif KEY == "ep05":
        beds = [(L("station_amb"), 0, dict(dur=at(4), fin=1.0, fout=.3, loop=True)),
                (L("station_amb"), at(5), dict(dur=at(13) - at(5), fin=.3, fout=.5, loop=True)),
                (L("fluor_buzz"), at(5), dict(dur=at(6) - at(5), vol=-8, fin=.3, fout=.3, loop=True)),
                (L("fluor_buzz"), at(12), dict(dur=end_of(12) - at(12), vol=-6, fin=.3, fout=.4, loop=True)),
                (L("drone"), at(2), dict(dur=at(5) - at(2), vol=-6, fin=1.0, fout=.6, loop=True)),
                (L("drone"), at(6), dict(dur=end_of(11) - at(6), vol=-5, fin=1.5, fout=1.0, loop=True)),
                (L("drone"), at(13), dict(dur=total - at(13), vol=-8, fin=.5, fout=1.0, loop=True))]
        cues = [(L("low_note"), at(2), dict(dur=2.8, vol=-4, fout=1.4)),
                (L("flicker"), word_t(3, "schedule"), dict(dur=1.4, vol=-8, fout=.4)),
                (L("train_glide"), at(6) - .3, dict(dur=min(7, end_of(6) - at(6) + .3), vol=-2, fin=.4, fout=.6)),
                (L("door_open"), at(7, .1), dict(dur=2.2, vol=-4, fout=.5)),
                (L("sting"), word_t(8, "blinked"), dict(dur=min(1.6, at(9) - word_t(8, "blinked")), vol=-8, fout=.5)),
                (L("grab"), at(9, .02), dict(dur=.3, vol=-3, fout=.1)),
                (L("door_close"), at(11), dict(dur=1.2, vol=-4, fout=.3)),
                (L("train_glide"), at(11, 1.2), dict(dur=max(.8, end_of(11) - at(11, 1.2)), vol=-10, fout=1.2)),
                (L("low_note"), at(13), dict(dur=2.6, vol=0, fout=1.4))]
    elif KEY == "ep07":
        beds = [(L("tokyo_night"), 0, dict(dur=at(2), fin=1.0, fout=.4, loop=True)),
                (L("tokyo_night"), at(4), dict(dur=at(13) - at(4), fin=.4, fout=.6, loop=True)),
                (L("fluor_buzz"), at(5), dict(dur=at(10) - at(5), vol=-10, fin=.3, fout=.3, loop=True)),
                (L("drone"), at(2), dict(dur=at(4) - at(2), vol=-6, fin=1.0, fout=.5, loop=True)),
                (L("drone"), at(6), dict(dur=end_of(9) - at(6), vol=-4, fin=1.0, fout=.4, loop=True)),
                (L("drone"), at(12), dict(dur=total - at(12), vol=-6, fin=1.0, fout=1.2, loop=True))]
        cues = [(L("low_note"), at(2), dict(dur=2.8, vol=-4, fout=1.4)),
                (L("cloth"), at(3, .4), dict(dur=1.2, vol=-8, fout=.4)),
                (L("steps_walk"), at(4), dict(dur=min(5, end_of(4) - at(4)), vol=-6, fout=.4)),
                (L("breath"), at(7), dict(dur=end_of(7) - at(7), vol=-2, fin=.2, fout=.3)),
                (L("heartbeat"), at(8), dict(dur=end_of(8) - at(8), vol=-8, fin=.2, fout=.3)),
                (L("running"), at(10, .3), dict(dur=min(5, end_of(10) - at(10, .3)), vol=-2, fout=.4)),
                (L("sting"), word_t(12, "house"), dict(dur=min(1.6, at(13) - word_t(12, "house")), vol=-6, fout=.5)),
                (L("low_note"), at(13), dict(dur=2.6, vol=0, fout=1.4))]
    elif KEY == "ep08":
        beds = [(L("river_amb"), 0, dict(dur=at(2), fin=1.0, fout=.4, loop=True)),
                (L("river_amb"), at(4), dict(dur=at(10) - at(4), fin=.4, fout=.5, loop=True)),
                (L("dawn"), at(10), dict(dur=at(12) - at(10), vol=-6, fin=.6, fout=.5, loop=True)),
                (L("river_amb"), at(12), dict(dur=total - at(12), fin=.5, fout=1.0, loop=True)),
                (L("drone"), at(2), dict(dur=at(4) - at(2), vol=-6, fin=1.0, fout=.5, loop=True)),
                (L("drone"), at(7), dict(dur=end_of(9) - at(7), vol=-4, fin=1.0, fout=.5, loop=True)),
                (L("drone"), at(12), dict(dur=total - at(12), vol=-6, fin=1.0, fout=1.2, loop=True))]
        cues = [(L("sob_far"), at(1, .3), dict(dur=min(4, end_of(1) - at(1, .3)), vol=-12, fx=far, fout=.6)),
                (L("low_note"), at(2), dict(dur=2.8, vol=-4, fout=1.4)),
                (L("splash"), at(3, .5), dict(dur=1.6, vol=-10, fout=.5)),
                (L("sob_far"), at(5, .2), dict(dur=min(6, end_of(5) - at(5, .2)), vol=-8, fout=.5)),
                (L("splash"), at(6, .1), dict(dur=min(4, end_of(6) - at(6, .1)), vol=-6, fout=.5)),
                (L("sting"), word_t(8, "stopped"), dict(dur=min(1.2, at(9) - word_t(8, "stopped")), vol=-10, fout=.4)),
                (L("running"), at(9), dict(dur=min(5, end_of(9) - at(9)), vol=-2, fout=.4)),
                (L("wet_steps"), at(10, .2), dict(dur=min(4, end_of(10) - at(10, .2)), vol=-6, fout=.4)),
                (L("low_note"), at(13), dict(dur=2.6, vol=0, fout=1.4))]
    elif KEY == "ep09":
        beds = [(L("pine_wind"), 0, dict(dur=at(5), fin=1.0, fout=.4, loop=True)),
                (L("apt_hum"), at(5), dict(dur=at(10) - at(5), vol=-4, fin=.3, fout=.4, loop=True)),
                (L("pine_wind"), at(10), dict(dur=total - at(10), vol=-2, fin=.4, fout=1.0, loop=True)),
                (L("dawn"), at(11), dict(dur=at(12) - at(11), vol=-8, fin=.6, fout=.5, loop=True)),
                (L("drone"), at(2), dict(dur=at(4) - at(2), vol=-6, fin=1.0, fout=.5, loop=True)),
                (L("drone"), at(5), dict(dur=end_of(9) - at(5), vol=-5, fin=1.0, fout=.5, loop=True)),
                (L("drone"), at(12), dict(dur=total - at(12), vol=-6, fin=1.0, fout=1.2, loop=True))]
        cues = [(L("voice_far"), at(1, .6), dict(dur=min(3, end_of(1) - at(1, .6)), vol=-12, fx=far, fout=.6)),
                (L("low_note"), at(2), dict(dur=2.8, vol=-4, fout=1.4)),
                (L("voice_far"), word_t(5, "calling"), dict(dur=min(2.6, end_of(5) - word_t(5, "calling")), vol=-10, fx=far, fout=.6)),
                (L("heartbeat"), at(6, .3), dict(dur=end_of(6) - at(6, .3), vol=-8, fin=.2, fout=.3)),
                (L("voice_far"), word_t(9, "own"), dict(dur=min(2.2, end_of(9) - word_t(9, "own")), vol=-8, fx=far, fout=.5)),
                (L("window_shut"), at(10, .3), dict(dur=1.2, vol=-4, fout=.3)),
                (L("low_note"), at(13), dict(dur=2.6, vol=0, fout=1.4))]
    elif KEY == "ep10":
        beds = [(L("suburb_night"), 0, dict(dur=at(4), fin=1.0, fout=.4, loop=True)),
                (L("suburb_night"), at(5), dict(dur=at(12) - at(5), vol=-2, fin=.4, fout=.5, loop=True)),
                (L("candle"), at(5), dict(dur=at(11) - at(5), vol=-8, fin=.3, fout=.4, loop=True)),
                (L("dawn"), at(12), dict(dur=at(13) - at(12), vol=-10, fin=.6, fout=.5, loop=True)),
                (L("drone"), at(2), dict(dur=at(4) - at(2), vol=-6, fin=1.0, fout=.5, loop=True)),
                (L("drone"), at(8), dict(dur=end_of(10) - at(8), vol=-4, fin=1.0, fout=.5, loop=True)),
                (L("drone"), at(13), dict(dur=total - at(13), vol=-8, fin=.5, fout=1.0, loop=True))]
        cues = [(L("low_note"), at(2), dict(dur=2.8, vol=-4, fout=1.4)),
                (L("giggles"), at(4, .3), dict(dur=min(4, end_of(4) - at(4, .3)), vol=-8, fout=.5)),
                (L("steps_walk"), at(5), dict(dur=min(5, end_of(5) - at(5)), vol=-8, fout=.4)),
                (L("heartbeat"), at(9), dict(dur=end_of(9) - at(9), vol=-8, fin=.2, fout=.3)),
                (L("sting"), word_t(10, "smiled"), dict(dur=min(1.6, at(11) - word_t(10, "smiled")), vol=-6, fout=.5)),
                (L("running"), at(11), dict(dur=min(4, end_of(11) - at(11)), vol=-6, fout=.4)),
                (L("low_note"), at(13), dict(dur=2.6, vol=0, fout=1.4))]
    elif KEY == "ep11":
        t8, s8 = word_t(8, "tiny"), word_t(8, "splashing")
        beds = [(L("kampung_night"), 0, dict(dur=at(2), fin=1.0, fout=.4, loop=True)),
                (L("kampung_night"), at(4), dict(dur=at(10) - at(4), fin=.4, fout=.5, loop=True)),
                (L("dawn"), at(10), dict(dur=at(12) - at(10), vol=-6, fin=.6, fout=.5, loop=True)),
                (L("kampung_night"), at(12), dict(dur=total - at(12), fin=.5, fout=1.0, loop=True)),
                (L("drone"), at(2), dict(dur=at(4) - at(2), vol=-6, fin=1.0, fout=.5, loop=True)),
                (L("drone"), at(7), dict(dur=end_of(9) - at(7), vol=-5, fin=1.0, fout=.5, loop=True))]
        cues = [(L("tiny_steps"), at(1, .5), dict(dur=min(3, end_of(1) - at(1, .5)), vol=-10, fout=.4)),
                (L("low_note"), at(2), dict(dur=2.8, vol=-4, fout=1.4)),
                (L("coins"), at(3, .4), dict(dur=2.0, vol=-8, fout=.4)),
                (L("coins"), at(4, .6), dict(dur=2.5, vol=-8, fout=.5)),
                (L("tiny_steps"), t8, dict(dur=max(.4, min(2, s8 - t8 - .05)), vol=-6, fout=.2)),
                (L("splash"), s8, dict(dur=min(3, end_of(8) - s8), vol=-6, fout=.5)),
                (L("giggles"), at(9, .3), dict(dur=min(3, end_of(9) - at(9, .3)), vol=-12, fout=.5)),
                (L("sting"), word_t(12, "gone"), dict(dur=min(1.4, at(13) - word_t(12, "gone")), vol=-6, fout=.4)),
                (L("low_note"), at(13), dict(dur=2.6, vol=0, fout=1.4))]
    elif KEY == "ep12":
        beds = [(L("canal_night"), 0, dict(dur=at(2), fin=1.0, fout=.4, loop=True)),
                (L("canal_night"), at(4), dict(dur=at(12) - at(4), fin=.4, fout=.5, loop=True)),
                (L("lamp"), at(5), dict(dur=at(8) - at(5), vol=-8, fin=.3, fout=.4, loop=True)),
                (L("drone"), at(2), dict(dur=at(4) - at(2), vol=-6, fin=1.0, fout=.5, loop=True)),
                (L("drone"), at(8), dict(dur=end_of(11) - at(8), vol=-4, fin=1.0, fout=.5, loop=True)),
                (L("drone"), at(12), dict(dur=total - at(12), vol=-6, fin=1.0, fout=1.2, loop=True))]
        cues = [(L("low_note"), at(2), dict(dur=2.8, vol=-4, fout=1.4)),
                (L("lime_drop"), at(6, .3), dict(dur=min(3, at(8) - at(6, .3)), vol=-4, fout=.4)),
                (L("creak"), at(9, .2), dict(dur=min(2, end_of(9) - at(9, .2)), vol=-8, fout=.5)),
                (L("heartbeat"), at(10), dict(dur=end_of(10) - at(10), vol=-8, fin=.2, fout=.3)),
                (L("running"), at(11, .5), dict(dur=min(4, end_of(11) - at(11, .5)), vol=-4, fout=.4)),
                (L("low_note"), at(13), dict(dur=2.6, vol=0, fout=1.4))]
    elif KEY == "ep13":
        beds = [(L("rain_wind"), 0, dict(dur=at(5), fin=1.0, fout=.4, loop=True)),
                (L("fire"), at(5), dict(dur=at(7) - at(5), vol=-6, fin=.3, fout=.4, loop=True)),
                (L("rain_wind"), at(7), dict(dur=at(9) - at(7), fin=.3, fout=.4, loop=True)),
                (L("fire"), at(9), dict(dur=at(11) - at(9), vol=-6, fin=.3, fout=.4, loop=True)),
                (L("wind"), at(11), dict(dur=at(12) - at(11), vol=-2, fin=.4, fout=.4, loop=True)),
                (L("rain_wind"), at(12), dict(dur=total - at(12), vol=-2, fin=.4, fout=1.0, loop=True)),
                (L("drone"), at(2), dict(dur=at(4) - at(2), vol=-6, fin=1.0, fout=.5, loop=True)),
                (L("drone"), at(7), dict(dur=end_of(8) - at(7), vol=-4, fin=1.0, fout=.5, loop=True))]
        cues = [(L("low_note"), at(2), dict(dur=2.8, vol=-4, fout=1.4)),
                (L("wail"), word_t(7, "wailing"), dict(dur=min(4, end_of(7) - word_t(7, "wailing")), vol=-6, fout=.6)),
                (L("sting"), word_t(8, "window"), dict(dur=min(1.4, at(9) - word_t(8, "window")), vol=-8, fout=.4)),
                (L("wail"), word_t(11, "wail"), dict(dur=min(3, end_of(11) - word_t(11, "wail")), vol=-12, fx=far, fout=.6)),
                (L("low_note"), at(13), dict(dur=2.6, vol=0, fout=1.4))]
    elif KEY == "ep14":
        f6, d6 = word_t(6, "five"), word_t(6, "doors")
        beds = [(L("elev_hum"), 0, dict(dur=at(2), fin=1.0, fout=.4, loop=True)),
                (L("fluor_buzz"), at(4), dict(dur=at(5) - at(4), vol=-8, fin=.3, fout=.3, loop=True)),
                (L("elev_hum"), at(5), dict(dur=at(11) - at(5), fin=.3, fout=.4, loop=True)),
                (L("fluor_buzz"), at(11), dict(dur=at(13) - at(11), vol=-8, fin=.3, fout=.5, loop=True)),
                (L("drone"), at(2), dict(dur=at(4) - at(2), vol=-6, fin=1.0, fout=.5, loop=True)),
                (L("drone"), at(6), dict(dur=end_of(10) - at(6), vol=-4, fin=1.0, fout=.5, loop=True)),
                (L("drone"), at(13), dict(dur=total - at(13), vol=-8, fin=.5, fout=1.0, loop=True))]
        cues = [(L("low_note"), at(2), dict(dur=2.8, vol=-4, fout=1.4)),
                (L("elev_ding"), f6, dict(dur=max(.3, min(1.5, d6 - f6 - .05)), vol=-6, fout=.2)),
                (L("elev_doors"), d6, dict(dur=min(2, end_of(6) - d6), vol=-6, fout=.4)),
                (L("sting"), word_t(9, "head"), dict(dur=min(1.4, at(10) - word_t(9, "head")), vol=-8, fout=.4)),
                (L("elev_doors"), word_t(10, "doors"), dict(dur=min(1.5, end_of(10) - word_t(10, "doors")), vol=-6, fout=.3)),
                (L("stairs_run"), at(11), dict(dur=min(4, end_of(11) - at(11)), vol=-4, fout=.4)),
                (L("elev_ding"), word_t(12, "five"), dict(dur=min(1.5, end_of(12) - word_t(12, "five")), vol=-8, fout=.4)),
                (L("low_note"), at(13), dict(dur=2.6, vol=0, fout=1.4))]
    elif KEY == "ep15":
        r7 = word_t(7, "rang")
        beds = [(L("rain_roof"), 0, dict(dur=at(2), fin=1.0, fout=.4, loop=True)),
                (L("rain_roof"), at(4), dict(dur=at(11) - at(4), vol=-4, fin=.4, fout=.3, loop=True)),
                (L("rain_roof"), at(11), dict(dur=at(12) - at(11), fin=.2, fout=.4, loop=True)),
                (L("dawn"), at(12), dict(dur=at(13) - at(12), vol=-6, fin=.6, fout=.5, loop=True)),
                (L("drone"), at(2), dict(dur=at(4) - at(2), vol=-6, fin=1.0, fout=.5, loop=True)),
                (L("drone"), at(5), dict(dur=end_of(10) - at(5), vol=-5, fin=1.0, fout=.5, loop=True)),
                (L("drone"), at(13), dict(dur=total - at(13), vol=-8, fin=.5, fout=1.0, loop=True))]
        cues = [(L("low_note"), at(2), dict(dur=2.8, vol=-4, fout=1.4)),
                (L("door_creak"), word_t(5, "opened"), dict(dur=min(3, end_of(5) - word_t(5, "opened")), vol=-6, fout=.4)),
                (L("wet_steps"), at(6, .3), dict(dur=min(4, end_of(6) - at(6, .3)), vol=-6, fout=.4)),
                (L("phone_ring"), r7, dict(dur=min(4, end_of(8) - r7), vol=-6, fout=.3)),
                (L("door_creak"), word_t(10, "opening"), dict(dur=min(3, end_of(10) - word_t(10, "opening")), vol=-4, fout=.4)),
                (L("running"), at(11), dict(dur=min(4, end_of(11) - at(11)), vol=-4, fout=.4)),
                (L("low_note"), at(13), dict(dur=2.6, vol=0, fout=1.4))]
    elif KEY == "ep16":
        k6 = word_t(6, "one")
        beds = [(L("school_amb"), 0, dict(dur=at(5), fin=1.0, fout=.4, loop=True)),
                (L("bathroom_amb"), at(5), dict(dur=at(10) - at(5), fin=.3, fout=.3, loop=True)),
                (L("fluor_buzz"), at(5), dict(dur=at(10) - at(5), vol=-10, fin=.3, fout=.3, loop=True)),
                (L("school_amb"), at(10), dict(dur=at(12) - at(10), vol=-2, fin=.3, fout=.4, loop=True)),
                (L("bathroom_amb"), at(12), dict(dur=at(13) - at(12), fin=.4, fout=.5, loop=True)),
                (L("drone"), at(2), dict(dur=at(4) - at(2), vol=-6, fin=1.0, fout=.5, loop=True)),
                (L("drone"), at(7), dict(dur=end_of(9) - at(7), vol=-4, fin=1.0, fout=.5, loop=True)),
                (L("drone"), at(13), dict(dur=total - at(13), vol=-8, fin=.5, fout=1.0, loop=True))]
        cues = [(L("low_note"), at(2), dict(dur=2.8, vol=-4, fout=1.4)),
                (L("knock3"), k6, dict(dur=min(3, end_of(6) - k6), vol=-4, fout=.3)),
                (L("stall_creak"), word_t(9, "open"), dict(dur=min(3, word_t(9, "shoe") - word_t(9, "open")), vol=-6, fout=.3)),
                (L("sting"), word_t(9, "shoe"), dict(dur=min(1.4, at(10) - word_t(9, "shoe")), vol=-8, fout=.4)),
                (L("running"), at(10), dict(dur=min(4, end_of(10) - at(10)), vol=-6, fout=.4)),
                (L("knock3"), word_t(12, "knocks"), dict(dur=min(3, end_of(12) - word_t(12, "knocks")), vol=-10, fx=far, fout=.3)),
                (L("low_note"), at(13), dict(dur=2.6, vol=0, fout=1.4))]
    elif KEY == "ep17":
        w5 = word_t(5, "whistling")
        beds = [(L("plains_night"), 0, dict(dur=at(10), fin=1.0, fout=.4, loop=True)),
                (L("lamp"), at(4), dict(dur=at(5) - at(4), vol=-10, fin=.3, fout=.3, loop=True)),
                (L("dawn"), at(10), dict(dur=at(12) - at(10), vol=-6, fin=.6, fout=.5, loop=True)),
                (L("city_night"), at(12), dict(dur=at(13) - at(12), vol=-4, fin=.4, fout=.5, loop=True)),
                (L("drone"), at(2), dict(dur=at(4) - at(2), vol=-6, fin=1.0, fout=.5, loop=True)),
                (L("drone"), at(7), dict(dur=end_of(9) - at(7), vol=-4, fin=1.0, fout=.5, loop=True)),
                (L("drone"), at(13), dict(dur=total - at(13), vol=-8, fin=.5, fout=1.0, loop=True))]
        cues = [(L("low_note"), at(2), dict(dur=2.8, vol=-4, fout=1.4)),
                (L("dogs_whine"), word_t(4, "dogs"), dict(dur=min(4, end_of(4) - word_t(4, "dogs")), vol=-8, fout=.4)),
                (L("whistle"), w5, dict(dur=min(7, end_of(5) - w5), vol=-4, fout=.5)),
                (L("whistle"), at(6), dict(dur=min(4, end_of(6) - at(6)), vol=-14, fx=far, fout=.6)),
                (L("hit"), word_t(8, "dropped"), dict(dur=min(1.4, at(9) - word_t(8, "dropped")), vol=-12, fout=.5)),
                (L("bones"), at(9, .2), dict(dur=min(5, end_of(9) - at(9, .2)), vol=-6, fout=.4)),
                (L("rooster"), word_t(10, "rooster"), dict(dur=min(3, end_of(10) - word_t(10, "rooster")), vol=-10, fout=.5)),
                (L("whistle"), word_t(12, "whistle"), dict(dur=min(4, end_of(12) - word_t(12, "whistle")), vol=-14, fx=far, fout=.6)),
                (L("low_note"), at(13), dict(dur=2.6, vol=0, fout=1.4))]
    elif KEY == "ep18":
        beds = [(L("barrio_night"), 0, dict(dur=at(11), fin=1.0, fout=.4, loop=True)),
                (L("lamp"), at(4), dict(dur=at(8) - at(4), vol=-10, fin=.3, fout=.3, loop=True)),
                (L("dawn"), at(11), dict(dur=at(12) - at(11), vol=-6, fin=.6, fout=.5, loop=True)),
                (L("barrio_night"), at(12), dict(dur=at(13) - at(12), vol=-4, fin=.4, fout=.5, loop=True)),
                (L("drone"), at(2), dict(dur=at(4) - at(2), vol=-6, fin=1.0, fout=.5, loop=True)),
                (L("drone"), at(6), dict(dur=end_of(7) - at(6), vol=-5, fin=1.0, fout=.5, loop=True)),
                (L("drone"), at(8), dict(dur=end_of(10) - at(8), vol=-4, fin=1.0, fout=.5, loop=True)),
                (L("drone"), at(13), dict(dur=total - at(13), vol=-8, fin=.5, fout=1.0, loop=True))]
        cues = [(L("low_note"), at(2), dict(dur=2.8, vol=-4, fout=1.4)),
                (L("wings"), word_t(3, "hungry"), dict(dur=min(3, end_of(3) - word_t(3, "hungry")), vol=-12, fx=far, fout=.5)),
                (L("sting"), word_t(7, "upside"), dict(dur=min(1.4, at(8) - word_t(7, "upside")), vol=-6, fout=.4)),
                (L("roof_land"), word_t(8, "landed"), dict(dur=min(3, end_of(8) - word_t(8, "landed")), vol=-4, fout=.4)),
                (L("creak"), word_t(9, "creaked"), dict(dur=min(2, at(10) - word_t(9, "creaked")), vol=-8, fout=.4)),
                (L("sniff"), at(10, .2), dict(dur=min(4, end_of(10) - at(10, .2)), vol=-6, fout=.4)),
                (L("wings"), at(11), dict(dur=min(2.5, end_of(11) - at(11)), vol=-14, fx=far, fout=.5)),
                (L("sting"), word_t(12, "upside"), dict(dur=min(1.4, at(13) - word_t(12, "upside")), vol=-8, fout=.4)),
                (L("low_note"), at(13), dict(dur=2.6, vol=0, fout=1.4))]
    elif KEY == "ep19":
        p5 = word_t(5, "pencil")
        beds = [(L("kampung_night"), 0, dict(dur=at(11), vol=-4, fin=1.0, fout=.4, loop=True)),
                (L("candle"), at(4), dict(dur=word_t(10, "candle") - at(4), vol=-8, fin=.3, fout=.2, loop=True)),
                (L("clock_tick"), at(7), dict(dur=at(10) - at(7), vol=-10, fin=.3, fout=.3, loop=True)),
                (L("dawn"), at(11), dict(dur=at(12) - at(11), vol=-6, fin=.6, fout=.5, loop=True)),
                (L("clock_tick"), at(12), dict(dur=at(13) - at(12), vol=-10, fin=.3, fout=.5, loop=True)),
                (L("drone"), at(2), dict(dur=at(4) - at(2), vol=-6, fin=1.0, fout=.5, loop=True)),
                (L("drone"), at(8), dict(dur=end_of(10) - at(8), vol=-4, fin=1.0, fout=.5, loop=True)),
                (L("drone"), at(13), dict(dur=total - at(13), vol=-8, fin=.5, fout=1.0, loop=True))]
        cues = [(L("low_note"), at(2), dict(dur=2.8, vol=-4, fout=1.4)),
                (L("pencil"), p5, dict(dur=min(4, end_of(6) - p5), vol=-8, fout=.4)),
                (L("sting"), word_t(8, "midnight"), dict(dur=min(1.4, at(9) - word_t(8, "midnight")), vol=-8, fout=.4)),
                (L("pencil"), word_t(9, "wrote"), dict(dur=min(2, end_of(9) - word_t(9, "wrote")), vol=-4, fout=.3)),
                (L("candles_out"), word_t(10, "candle"), dict(dur=max(.4, min(2, word_t(10, "laughed") - word_t(10, "candle") - .05)), vol=-6, fout=.3)),
                (L("laugh_sfx"), word_t(10, "laughed"), dict(dur=min(3, end_of(10) - word_t(10, "laughed")), vol=-12, fx=far, fout=.5)),
                (L("pencil"), word_t(12, "pencil"), dict(dur=min(2, end_of(12) - word_t(12, "pencil")), vol=-10, fout=.3)),
                (L("low_note"), at(13), dict(dur=2.6, vol=0, fout=1.4))]
    elif KEY == "ep20":
        beds = [(L("loch_amb"), 0, dict(dur=at(12), fin=1.0, fout=.4, loop=True)),
                (L("loch_amb"), at(12), dict(dur=at(13) - at(12), vol=-4, fin=.4, fout=.5, loop=True)),
                (L("drone"), at(2), dict(dur=at(4) - at(2), vol=-6, fin=1.0, fout=.5, loop=True)),
                (L("drone"), at(7), dict(dur=end_of(11) - at(7), vol=-4, fin=1.0, fout=.5, loop=True)),
                (L("drone"), at(13), dict(dur=total - at(13), vol=-8, fin=.5, fout=1.0, loop=True))]
        cues = [(L("horse_snort"), at(1, .4), dict(dur=min(3, end_of(1) - at(1, .4)), vol=-12, fx=far, fout=.4)),
                (L("low_note"), at(2), dict(dur=2.8, vol=-9, fout=1.4)),
                (L("drip"), max(at(3), at(2) + 2.85), dict(dur=max(.5, min(4, end_of(3) - max(at(3), at(2) + 2.85))), vol=-10, fin=.2, fout=.4)),
                (L("horse_snort"), word_t(5, "waiting"), dict(dur=min(3, end_of(5) - word_t(5, "waiting")), vol=-8, fout=.4)),
                (L("sting"), word_t(7, "stuck"), dict(dur=min(1.4, at(8) - word_t(7, "stuck")), vol=-6, fout=.4)),
                (L("horse_water"), word_t(8, "walking"), dict(dur=min(5, end_of(8) - word_t(8, "walking")), vol=-6, fout=.4)),
                (L("heartbeat"), at(9), dict(dur=end_of(10) - at(9), vol=-10, fin=.2, fout=.3)),
                (L("horse_shriek"), at(11), dict(dur=min(3, end_of(11) - at(11)), vol=-6, fout=.5)),
                (L("horse_snort"), word_t(12, "horse"), dict(dur=min(3, end_of(12) - word_t(12, "horse")), vol=-12, fx=far, fout=.4)),
                (L("low_note"), at(13), dict(dur=2.6, vol=0, fout=1.4))]
    elif KEY == "ep21":
        beds = [(L("snow_forest"), 0, dict(dur=at(9), fin=1.0, fout=.4, loop=True)),
                (L("oven_fire"), at(9), dict(dur=at(11) - at(9), vol=-4, fin=.3, fout=.4, loop=True)),
                (L("dawn"), at(11), dict(dur=at(12) - at(11), vol=-6, fin=.6, fout=.5, loop=True)),
                (L("snow_forest"), at(12), dict(dur=at(13) - at(12), vol=-2, fin=.4, fout=.5, loop=True)),
                (L("drone"), at(2), dict(dur=at(4) - at(2), vol=-6, fin=1.0, fout=.5, loop=True)),
                (L("drone"), at(5), dict(dur=end_of(8) - at(5), vol=-5, fin=1.0, fout=.5, loop=True)),
                (L("drone"), at(13), dict(dur=total - at(13), vol=-8, fin=.5, fout=1.0, loop=True))]
        c8, o8 = word_t(8, "creaked"), word_t(8, "opened")
        cues = [(L("low_note"), at(2), dict(dur=2.8, vol=-4, fout=1.4)),
                (L("snow_steps"), at(4, .2), dict(dur=min(4, end_of(4) - at(4, .2)), vol=-8, fout=.4)),
                (L("hut_legs"), word_t(6, "turned"), dict(dur=min(4, end_of(6) - word_t(6, "turned")), vol=-6, fout=.5)),
                (L("hut_legs"), c8, dict(dur=max(.5, min(4, o8 - c8 - .05)), vol=-4, fout=.3)),
                (L("door_creak"), o8, dict(dur=min(2.5, end_of(8) - o8), vol=-6, fout=.4)),
                (L("sting"), word_t(9, "smiled"), dict(dur=min(1.4, at(10) - word_t(9, "smiled")), vol=-8, fout=.4)),
                (L("hut_legs"), word_t(12, "feet"), dict(dur=min(3, end_of(12) - word_t(12, "feet")), vol=-14, fx=far, fout=.5)),
                (L("low_note"), at(13), dict(dur=2.6, vol=0, fout=1.4))]
    elif KEY == "ep22":
        beds = [(L("forest_summer"), 0, dict(dur=at(12), fin=1.0, fout=.4, loop=True)),
                (L("goat_bells"), at(4), dict(dur=at(5) - at(4), vol=-8, fin=.3, fout=.4, loop=True)),
                (L("forest_summer"), at(12), dict(dur=at(13) - at(12), vol=-2, fin=.4, fout=.5, loop=True)),
                (L("drone"), at(2), dict(dur=at(4) - at(2), vol=-6, fin=1.0, fout=.5, loop=True)),
                (L("drone"), at(7), dict(dur=end_of(10) - at(7), vol=-4, fin=1.0, fout=.5, loop=True)),
                (L("drone"), at(13), dict(dur=total - at(13), vol=-8, fin=.5, fout=1.0, loop=True))]
        cues = [(L("low_note"), at(2), dict(dur=2.8, vol=-4, fout=1.4)),
                (L("singing_far"), word_t(5, "singing"), dict(dur=min(7, end_of(5) - word_t(5, "singing")), vol=-8, fx=far, fout=.6)),
                (L("sting"), word_t(8, "tail"), dict(dur=min(1.4, at(9) - word_t(8, "tail")), vol=-6, fout=.4)),
                (L("heartbeat"), at(9), dict(dur=end_of(9) - at(9), vol=-10, fin=.2, fout=.3)),
                (L("running"), at(11), dict(dur=min(4, end_of(11) - at(11)), vol=-6, fout=.4)),
                (L("singing_far"), word_t(12, "sings"), dict(dur=min(5, end_of(12) - word_t(12, "sings")), vol=-14, fx=far, fout=.6)),
                (L("low_note"), at(13), dict(dur=2.6, vol=0, fout=1.4))]
    elif KEY == "ep23":
        k9, b11 = word_t(9, "knocked"), word_t(11, "blew")
        beds = [(L("kampung_night"), 0, dict(dur=at(12), fin=1.0, fout=.4, loop=True)),
                (L("candle"), at(8), dict(dur=at(10) - at(8), vol=-8, fin=.3, fout=.3, loop=True)),
                (L("candle"), at(11), dict(dur=max(.5, b11 - at(11)), vol=-8, fin=.2, fout=.2, loop=True)),
                (L("dawn"), at(12), dict(dur=at(13) - at(12), vol=-6, fin=.6, fout=.5, loop=True)),
                (L("drone"), at(2), dict(dur=at(4) - at(2), vol=-6, fin=1.0, fout=.5, loop=True)),
                (L("drone"), at(5), dict(dur=end_of(11) - at(5), vol=-5, fin=1.0, fout=.5, loop=True)),
                (L("drone"), at(13), dict(dur=total - at(13), vol=-8, fin=.5, fout=1.0, loop=True))]
        cues = [(L("pig_grunt"), word_t(1, "pig"), dict(dur=min(3, end_of(1) - word_t(1, "pig")), vol=-14, fx=far, fout=.4)),
                (L("low_note"), at(2), dict(dur=2.8, vol=-4, fout=1.4)),
                (L("pig_grunt"), at(6), dict(dur=min(4, end_of(6) - at(6)), vol=-6, fout=.4)),
                (L("wall_knock"), k9, dict(dur=max(.4, min(2, word_t(9, "flame") - k9 - .05)), vol=-4, fout=.2)),
                (L("sting"), word_t(9, "shook"), dict(dur=min(1.4, at(10) - word_t(9, "shook")), vol=-8, fout=.4)),
                (L("pig_squeal"), word_t(10, "squealed"), dict(dur=min(3, end_of(10) - word_t(10, "squealed")), vol=-6, fout=.5)),
                (L("candles_out"), b11, dict(dur=min(1.5, end_of(11) - b11), vol=-8, fout=.3)),
                (L("low_note"), at(13), dict(dur=2.6, vol=0, fout=1.4))]
    elif KEY == "ep24":
        beds = [(L("china_street"), 0, dict(dur=at(4), fin=1.0, fout=.4, loop=True)),
                (L("apt_hum"), at(4), dict(dur=at(5) - at(4), vol=-6, fin=.3, fout=.3, loop=True)),
                (L("china_street"), at(5), dict(dur=at(10) - at(5), fin=.3, fout=.4, loop=True)),
                (L("apt_hum"), at(10), dict(dur=at(13) - at(10), vol=-4, fin=.3, fout=.5, loop=True)),
                (L("drone"), at(2), dict(dur=at(4) - at(2), vol=-6, fin=1.0, fout=.5, loop=True)),
                (L("drone"), at(6), dict(dur=end_of(9) - at(6), vol=-4, fin=1.0, fout=.5, loop=True)),
                (L("drone"), at(13), dict(dur=total - at(13), vol=-8, fin=.5, fout=1.0, loop=True))]
        cues = [(L("low_note"), at(2), dict(dur=2.8, vol=-4, fout=1.4)),
                (L("whistle_tune"), word_t(5, "whistled"), dict(dur=min(3, end_of(5) - word_t(5, "whistled")), vol=-8, fout=.4)),
                (L("whistle_tune"), word_t(6, "whistled"), dict(dur=min(3, end_of(6) - word_t(6, "whistled")), vol=-14, fx=far, fout=.5)),
                (L("footsteps_follow"), at(7), dict(dur=min(5, end_of(7) - at(7)), vol=-6, fout=.4)),
                (L("sting"), word_t(8, "tapped"), dict(dur=min(1.4, at(9) - word_t(8, "tapped")), vol=-6, fout=.4)),
                (L("heartbeat"), at(9), dict(dur=end_of(9) - at(9), vol=-8, fin=.2, fout=.3)),
                (L("door_steps"), at(11), dict(dur=max(.6, min(5, word_t(11, "nothing") - at(11) - .05)), vol=-6, fout=.3)),
                (L("whistle_tune"), word_t(12, "whistles"), dict(dur=min(3, end_of(12) - word_t(12, "whistles")), vol=-16, fx=far, fout=.5)),
                (L("low_note"), at(13), dict(dur=2.6, vol=0, fout=1.4))]
    elif KEY == "ep25":
        beds = [(L("africa_night"), 0, dict(dur=at(4), fin=1.0, fout=.4, loop=True)),
                (L("africa_night"), at(4), dict(dur=at(11) - at(4), vol=-6, fin=.3, fout=.4, loop=True)),
                (L("candle"), at(9), dict(dur=at(11) - at(9), vol=-8, fin=.2, fout=.3, loop=True)),
                (L("dawn"), at(11), dict(dur=at(12) - at(11), vol=-6, fin=.6, fout=.5, loop=True)),
                (L("city_night"), at(12), dict(dur=at(13) - at(12), vol=-6, fin=.4, fout=.5, loop=True)),
                (L("drone"), at(2), dict(dur=at(4) - at(2), vol=-6, fin=1.0, fout=.5, loop=True)),
                (L("drone"), at(6), dict(dur=end_of(10) - at(6), vol=-4, fin=1.0, fout=.5, loop=True)),
                (L("drone"), at(13), dict(dur=total - at(13), vol=-8, fin=.5, fout=1.0, loop=True))]
        cues = [(L("low_note"), at(2), dict(dur=2.8, vol=-4, fout=1.4)),
                (L("scratch_floor"), word_t(6, "tiny"), dict(dur=min(4, end_of(6) - word_t(6, "tiny")), vol=-6, fout=.4)),
                (L("imp_giggle"), word_t(7, "giggled"), dict(dur=min(3, end_of(7) - word_t(7, "giggled")), vol=-6, fout=.4)),
                (L("sting"), word_t(8, "fingers"), dict(dur=min(1.4, at(9) - word_t(8, "fingers")), vol=-8, fout=.4)),
                (L("tiny_steps"), word_t(10, "tiny"), dict(dur=min(3, end_of(10) - word_t(10, "tiny")), vol=-10, fout=.4)),
                (L("tiny_steps"), word_t(12, "tiny"), dict(dur=min(3, end_of(12) - word_t(12, "tiny")), vol=-14, fx=far, fout=.4)),
                (L("low_note"), at(13), dict(dur=2.6, vol=0, fout=1.4))]
    else:  # ep06
        beds = [(L("ward_amb"), 0, dict(dur=at(10), fin=1.0, fout=.4, loop=True)),
                (L("ward_amb"), at(10), dict(dur=at(13) - at(10), vol=-6, fin=.4, fout=.6, loop=True)),
                (L("fluor_buzz"), 0, dict(dur=at(2), vol=-8, fin=.6, fout=.3, loop=True)),
                (L("dawn"), at(10), dict(dur=at(11) - at(10), vol=-10, fin=.8, fout=.5, loop=True)),
                (L("drone"), at(2), dict(dur=at(4) - at(2), vol=-6, fin=1.0, fout=.5, loop=True)),
                (L("drone"), at(6), dict(dur=at(10) - at(6), vol=-5, fin=1.2, fout=1.0, loop=True)),
                (L("drone"), at(13), dict(dur=total - at(13), vol=-8, fin=.5, fout=1.0, loop=True))]
        cues = [(L("low_note"), at(2), dict(dur=2.8, vol=-4, fout=1.4)),
                (L("drag"), at(4, .6), dict(dur=2.0, vol=-14, fx=far, fout=.6)),
                (L("flicker"), at(6), dict(dur=1.2, vol=-6, fout=.3)),
                (L("drag"), word_t(6, "dragging"), dict(dur=max(.8, end_of(6) - word_t(6, "dragging")), vol=-4, fin=.2, fout=.5)),
                (L("heartbeat"), at(7), dict(dur=end_of(7) - at(7), vol=-8, fin=.2, fout=.3)),
                (L("drip"), at(11), dict(dur=end_of(11) - at(11), vol=-8, fin=.2, fout=.4)),
                (L("low_note"), at(13), dict(dur=2.6, vol=0, fout=1.4))]
    return beds, cues

def main():
    os.makedirs(FIN, exist_ok=True)
    raw = json.load(open(f"{A}/manifest_raw.json"))["vo"]; ep = json.load(open(DATA)); shots = ep["shots"]
    t = 0.0; vo_cues = []; picks = {}
    voiced = [s for s in shots if s.get("speaker")]
    for s in shots:
        sid = s["id"]
        if s.get("speaker"):
            takes = [(k, v) for k, v in raw.get(str(sid), {}).items() if "error" not in v and v.get("words")]
            good = [(k, v) for k, v in takes if not is_flat_noise(f"{A}/{v['file']}")]
            if not good: raise SystemExit(f"shot {sid}: no usable take")
            k, take = max(good, key=lambda kv: (kv[1]["score"], -(kv[1]["words"][-1]["end"] - kv[1]["words"][0]["start"])))
            picks[sid] = (k, take["score"], take["transcript"])
            words = take["words"]; a, b = max(0, words[0]["start"] - .06), words[-1]["end"] + .14
            out = f"{FIN}/vo{sid:02d}.wav"
            segs, cuts, st = [], [], a
            if MAXGAP:
                for w0, w1 in zip(words, words[1:]):
                    if w1["start"] - w0["end"] > MAXGAP:
                        c0, c1 = w0["end"] + MAXGAP / 2, w1["start"] - MAXGAP / 2
                        segs.append((st, c0)); cuts.append((c0, c1)); st = c1
            segs.append((st, b))
            chain = (f"highpass=f=80,{VO_FX.get(s['speaker'], '')}atempo={TEMPO},"
                     f"loudnorm=I=-17:TP=-2:LRA=9,afade=t=in:d=0.02,areverse,afade=t=in:d=0.06,areverse")
            fc = "".join(f"[0:a]atrim={x:.3f}:{y:.3f},asetpts=N/SR/TB[s{i}];" for i, (x, y) in enumerate(segs))
            fc += "".join(f"[s{i}]" for i in range(len(segs))) + f"concat=n={len(segs)}:v=0:a=1[c];[c]{chain}[o]"
            sh(["ffmpeg", "-v", "error", "-y", "-i", f"{A}/{take['file']}", "-filter_complex", fc, "-map", "[o]", "-ar", str(SR), "-ac", "2", out])
            src = lambda x: x - a - sum(c1 - c0 for c0, c1 in cuts if c1 <= x + 1e-6)
            lead = (.4 if s is shots[0] else .2) if MAXGAP else (.5 if s is shots[0] else .3)
            tail = (.45 if s is voiced[-1] else .25) if MAXGAP else (.55 if s is voiced[-1] else .35)
            vlen = dur(out); s["start"], s["end"] = round(t, 3), round(t + lead + vlen + tail, 3); vs = t + lead
            for w, (ws, we) in zip(s["words"], align(s["words"], words)):
                w["start"] = round(vs + src(ws) / TEMPO, 3); w["end"] = round(vs + src(we) / TEMPO, 3)
            vo_cues.append((out, vs)); t = s["end"]
        else:
            s["start"], s["end"] = round(t, 3), round(t + CTA_LEN, 3)
            for k, w in enumerate(s.get("words") or []):
                w["start"] = round(t + .25 + k * .22, 3); w["end"] = round(w["start"] + .3, 3)
            t = s["end"]
    total = round(t, 3); ep["durationSec"] = total; ep["timingSource"] = f"ai33 eleven_v3 transcript, tempo x{TEMPO}"
    S = {s["id"]: s for s in shots}
    at = lambda sid, off=0.0: S[sid]["start"] + off
    end_of = lambda sid: S[sid]["end"]
    def word_t(sid, text):
        for w in S[sid]["words"]:
            if norm(w["text"]).startswith(norm(text)): return w["start"]
        raise SystemExit(f"cue word '{text}' not found in shot {sid}")
    beds, cues = cue_sheet(S, at, end_of, word_t, total)
    inputs, chains, labels = [], [], {"vo": [], "bed": [], "sfx": []}; _l = {}
    def lufs(p):
        if p not in _l:
            o = subprocess.run(["ffmpeg", "-i", p, "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
            m = re.findall(r"I:\s+(-?[\d.]+) LUFS", o); _l[p] = float(m[-1]) if m else -30.0
        return _l[p]
    TARGET = {"vo": None, "bed": -30.0, "sfx": -24.0}
    def add(path, start, o, bus):
        if not os.path.exists(path): raise SystemExit(f"missing sfx {path}")
        i = sum(1 for x in inputs if x == "-i")
        if TARGET[bus] is not None: o = dict(o, vol=o.get("vol", 0) + max(-30.0, min(30.0, TARGET[bus] - lufs(path))))
        inputs.extend((["-stream_loop", "-1"] if o.get("loop") else []) + ["-i", path])
        f = f"[{i}:a]aformat=sample_fmts=fltp:sample_rates={SR}:channel_layouts=stereo,"
        if o.get("dur"): f += f"atrim=0:{o['dur']:.3f},asetpts=N/SR/TB,"
        f += o.get("fx", "")
        if o.get("fin"): f += f"afade=t=in:d={o['fin']:.3f},"
        if o.get("fout"):
            f += (f"afade=t=out:st={max(0, o['dur'] - o['fout']):.3f}:d={o['fout']:.3f}," if o.get("dur") else f"areverse,afade=t=in:d={o['fout']:.3f},areverse,")
        ms = int(round(max(0, start) * 1000))
        chains.append(f + f"volume={o.get('vol', 0):.2f}dB,adelay={ms}|{ms}[c{i}]"); labels[bus].append(f"[c{i}]")
    for p, st in vo_cues: add(p, st, {}, "vo")
    for p, st, o in beds: add(p, st, o, "bed")
    for p, st, o in cues: add(p, st, o, "sfx")
    iv = sorted((st, st + (o.get("dur") or dur(p)), os.path.basename(p)) for p, st, o in cues)
    overlaps = [f"{a_[2]}->{b_[2]} {a_[1] - b_[0]:.2f}s" for a_, b_ in zip(iv, iv[1:]) if b_[0] < a_[1] - 0.15]
    g = ";".join(chains)
    g += f";{''.join(labels['vo'])}amix=inputs={len(labels['vo'])}:normalize=0,equalizer=f=3000:t=q:w=1.2:g=2,apad=whole_dur={total},asplit=3[vo][key][key2]"
    g += f";{''.join(labels['bed'])}amix=inputs={len(labels['bed'])}:normalize=0,highpass=f=50,equalizer=f=2500:t=q:w=1.4:g=-6[beds]"
    g += ";[beds][key]sidechaincompress=threshold=0.012:ratio=10:attack=25:release=450:knee=4[bedsd]"
    g += f";{''.join(labels['sfx'])}amix=inputs={len(labels['sfx'])}:normalize=0[fx]"
    g += ";[fx][key2]sidechaincompress=threshold=0.02:ratio=4:attack=15:release=300[fxd]"
    g += ";[bedsd][fxd]amix=inputs=2:normalize=0,asplit[bg][bgs]"
    g += f";[vo]asplit[vom][vos];[vom][bg]amix=inputs=2:normalize=0,atrim=0:{total},afade=t=out:st={total - .6:.3f}:d=0.6[pre]"
    open(f"{FIN}/graph.txt", "w").write(g); pre = f"{FIN}/premaster.wav"
    sh(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex_script", f"{FIN}/graph.txt", "-map", "[pre]", "-ar", str(SR), pre,
        "-map", "[vos]", "-ar", str(SR), f"{FIN}/stem_vo.wav", "-map", "[bgs]", "-ar", str(SR), f"{FIN}/stem_bg.wav"])
    out = f"{A}/mix.wav"
    sh(["ffmpeg", "-v", "error", "-y", "-i", pre, "-af", f"volume={-14.0 - lufs(pre):.2f}dB,alimiter=limit=0.84:attack=3:release=60:level=disabled", "-ar", str(SR), out])
    def rms_db(p, a_, b_):
        o = subprocess.run(["ffmpeg", "-ss", f"{a_:.3f}", "-t", f"{max(.05, b_ - a_):.3f}", "-i", p, "-af", "astats=measure_overall=RMS_level:measure_perchannel=none", "-f", "null", "-"], capture_output=True, text=True).stderr
        m = re.findall(r"RMS level dB:\s+(-?[\d.inf]+)", o); return float(m[-1]) if m and m[-1] not in ("-inf", "inf") else -90.0
    diffs = sorted((rms_db(f"{FIN}/stem_vo.wav", w["start"], w["end"]) - rms_db(f"{FIN}/stem_bg.wav", w["start"], w["end"]), s_["id"], w["text"]) for s_ in voiced for w in s_["words"])
    o = subprocess.run(["ffmpeg", "-i", out, "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
    master = " ".join(re.findall(r"(I:\s+-?[\d.]+ LUFS|Peak:\s+-?[\d.]+ dBFS)", o)[-2:])
    ep["audio"] = True; json.dump(ep, open(DATA, "w"), indent=1, ensure_ascii=False)
    low = [p for p in picks.values() if p[1] < 0.9]
    print(json.dumps({"ep": KEY, "total": total, "mix_len": round(dur(out), 3), "master": re.sub(r"\s+", " ", master),
                      "vo_over_bg_min": [round(diffs[0][0], 1), diffs[0][1], diffs[0][2]], "vo_over_bg_median": round(diffs[len(diffs) // 2][0], 1),
                      "overlaps": overlaps, "low_score_takes": low, "picks": {k: v[:2] for k, v in picks.items()}}, indent=0))
main()
