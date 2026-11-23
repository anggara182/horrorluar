"""Mix VO + SFX (ep/sfx.json) to the house loudness: voice -16 LUFS, master -14 LUFS, TP < -1 dBTP.
Beds marked duck=true are side-chained under the VO. Everything stops at `end` (cut to black).
usage: python3 -I tools/mix.py ep01  ->  ep01/mix.wav"""
import json, os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(HERE, "..")
LIB = os.path.join(ROOT, "..", "library", "sfx")
ep = os.path.join(ROOT, sys.argv[1]); cfg = json.load(open(os.path.join(ep, "sfx.json"))); END = cfg["end"]
tmp = os.path.join(ep, "vo", "_tmp"); os.makedirs(tmp, exist_ok=True)

def synth(name):
    out = os.path.join(tmp, name[1:] + ".wav")
    if name == "@notif":  # two-tone chime, same sound for every message
        f = "sine=f=1318:d=0.12[a];sine=f=1760:d=0.22[b];[a]afade=t=out:st=0.05:d=0.07[a2];[b]adelay=110|110,afade=t=out:st=0.18:d=0.14[b2];[a2][b2]amix=inputs=2:normalize=0"
    else:  # @pop: short blip for the choice labels
        f = "sine=f=880:d=0.09,afade=t=out:st=0.02:d=0.07"
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-filter_complex", f, "-ar", "48000", "-ac", "1", out], check=True)
    return out

inputs = ["-i", os.path.join(ep, "vo.wav")]; chains = []; duck = []; plain = []; n = 1
for b in cfg["beds"]:
    src = os.path.join(LIB, b["f"] + ".mp3"); dur = b["to"] - b["from"]
    inputs += ["-stream_loop", "-1", "-i", src]
    lab = f"b{n}"
    chains.append(f"[{n}:a]aformat=sample_rates=48000:channel_layouts=mono,atrim=0:{dur:.3f},afade=t=in:d=0.3,afade=t=out:st={max(0, dur - 0.25):.3f}:d=0.25,volume={b['db']}dB,adelay={int(b['from'] * 1000)}|{int(b['from'] * 1000)}[{lab}]")
    (duck if b.get("duck") else plain).append(f"[{lab}]"); n += 1
for h in cfg["hits"]:
    src = synth(h["f"]) if h["f"].startswith("@") else os.path.join(LIB, h["f"] + ".mp3")
    inputs += ["-i", src]; lab = f"h{n}"
    chains.append(f"[{n}:a]aformat=sample_rates=48000:channel_layouts=mono,volume={h['db']}dB,adelay={int(h['t'] * 1000)}|{int(h['t'] * 1000)}[{lab}]")
    plain.append(f"[{lab}]"); n += 1
g = ";".join(chains)
g += f";[0:a]aformat=sample_rates=48000:channel_layouts=mono,asplit=2[vo][sc]"
g += f";{''.join(duck)}amix=inputs={len(duck)}:normalize=0[dk];[dk][sc]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=350[dkd]"
g += f";[vo][dkd]{''.join(plain)}amix=inputs={2 + len(plain)}:normalize=0,atrim=0:{END},afade=t=out:st={END - 0.03:.3f}:d=0.03,loudnorm=I=-14.6:TP=-1.5:LRA=11,alimiter=limit=0.85,aresample=48000[out]"
out = os.path.join(ep, "mix.wav")
subprocess.run(["ffmpeg", "-y", "-v", "error", *inputs, "-filter_complex", g, "-map", "[out]", "-ac", "2", out], check=True)
r = subprocess.run(["ffmpeg", "-hide_banner", "-i", out, "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
print("\n".join(l for l in r.splitlines()[-12:] if "I:" in l or "Peak:" in l))
