"""Generate the VO of one episode via ai33 (eleven_v3), 2 takes per speaker block, pick the take whose
transcript matches the script best, then assemble one vo.wav + word timestamps.

usage: python3 -I tools/vo.py ep01            (generate missing takes, then assemble)
       python3 -I tools/vo.py ep01 --assemble (assemble only, from existing takes)

Studio queue rules (_shared/ATURAN-PARALEL.md §3): wait while >=4 tasks on the shared key are not done,
>=15 s + 0-10 s jitter between submits, exponential backoff on 429/queue_limit_exceeded, poll >=3 s.
"""
import difflib, json, os, random, re, subprocess, sys, time
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "..", "pipeline"))
import ai33  # noqa: E402

VOICES = {
    "NARATOR": "elevenlabs_Aw7qttNp8aSAczVs9nwb",     # Angga - Authentic Indonesian
    "PENGENDARA": "elevenlabs_gQQvBatMocMgEreeSqHb",  # Baron - Calm & Mature
    "JUNED": "elevenlabs_tqu2FgJzLu4PdJziSqSq",       # Kurnia - Character (chat read out, phone EQ)
    "JUNED_LIVE": "elevenlabs_tqu2FgJzLu4PdJziSqSq",  # Kurnia, in person (no EQ)
}
SPEED = "1.08"
TAKES = 2
GAP_S = 0.30          # silence between speaker blocks (pauses inside a block are kept as generated)
PHONE = {"JUNED"}     # thin phone EQ


def blocks(ep):
    txt = open(os.path.join(ep, "naskah.md"), encoding="utf-8").read()
    body = txt.split("## Naskah VO", 1)[1].split("\n## ", 1)[0]
    out, who = [], None
    for line in body.splitlines()[1:]:
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        j = re.match(r"^\(jeda ([0-9.]+)", line)
        if j:  # silent gap (e.g. GAGAL + rewind), no TTS
            out.append(["PAUSE", j.group(1)]); who = None
            continue
        if line.startswith("("):
            continue
        m = re.match(r"^([A-Z_]+):\s*(.*)$", line)
        if m:
            who, line = m.group(1), m.group(2)
            out.append([who, line])
        else:
            out[-1][1] += " " + line
    return out


def clean(t):
    return re.sub(r"\s+", " ", re.sub(r"\[[^\]]*\]", "", t)).strip()


def norm(t):
    return re.sub(r"[^a-z0-9 ]", "", t.lower()).split()


def pending():
    try:
        d = ai33._req("GET", "/v3/tasks?page=1&limit=20")
        return sum(1 for t in d.get("data", []) if t.get("status") not in ("done", "error", "failed"))
    except Exception:
        return 0


def submit(text, voice):
    delay = 30
    for attempt in range(5):
        while pending() >= 4:
            print("  queue >=4, waiting", flush=True); time.sleep(15)
        try:
            return ai33.create_tts(text, voice, model_id="eleven_v3", speed=SPEED)["task_id"]
        except RuntimeError as e:
            if any(c in str(e) for c in ("429", "queue_limit", "-> 502", "-> 503", "-> 504", "-> 500")):
                w = min(delay, 300) + random.uniform(0, 10); print(f"  backoff {w:.0f}s", flush=True)
                time.sleep(w); delay *= 2; continue
            raise
    raise SystemExit("5 failed submits in a row, stopping")


def generate(ep):
    vo = os.path.join(ep, "vo"); os.makedirs(vo, exist_ok=True)
    log_p = os.path.join(vo, "tasks.json")
    log = json.load(open(log_p)) if os.path.exists(log_p) else {}
    last = 0.0
    for i, (who, text) in enumerate(blocks(ep), 1):
        if who == "PAUSE":
            continue
        for take in range(1, TAKES + 1):
            key = f"b{i:02d}_t{take}"
            if os.path.exists(os.path.join(vo, key + ".mp3")):
                continue
            wait = 15 + random.uniform(0, 10) - (time.time() - last)
            if wait > 0:
                time.sleep(wait)
            tid = submit(text, VOICES[who]); last = time.time()
            log[key] = {"task_id": tid, "who": who, "text": text}
            json.dump(log, open(log_p, "w"), indent=1, ensure_ascii=False)
            t = ai33.wait(tid, every=3)
            if t.get("status") != "done":
                print(key, "ERROR", t.get("error_message")); continue
            m = t["metadata"]
            ai33.download(m["audio_url"], os.path.join(vo, key + ".mp3"))
            if m.get("json_url"):
                ai33.download(m["json_url"], os.path.join(vo, key + ".json"))
            log[key]["credit"] = t.get("credit_cost")
            json.dump(log, open(log_p, "w"), indent=1, ensure_ascii=False)
            print(key, who, "ok", t.get("credit_cost"), flush=True)


def words_of(path):
    if not os.path.exists(path):
        return []
    j = json.load(open(path)); j = j[0] if isinstance(j, list) else j
    return [w for w in j.get("words", []) if w.get("type", "word") == "word"]


def dur(p):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p],
                                capture_output=True, text=True).stdout)


def assemble(ep):
    vo = os.path.join(ep, "vo"); tmp = os.path.join(vo, "_tmp"); os.makedirs(tmp, exist_ok=True)
    picks, parts, all_words, t0 = [], [], [], 0.0
    for i, (who, text) in enumerate(blocks(ep), 1):
        if who == "PAUSE":
            out = os.path.join(tmp, f"b{i:02d}.wav"); d = float(text)
            subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "lavfi", "-i", "anullsrc=r=48000:cl=mono", "-t", str(d), out], check=True)
            picks.append({"block": i, "who": "PAUSE", "start": round(t0, 3), "dur": d}); parts.append(out); t0 += d + GAP_S
            continue
        best = None
        for take in range(1, TAKES + 1):
            key = f"b{i:02d}_t{take}"
            if not os.path.exists(os.path.join(vo, key + ".mp3")):
                continue
            ws = words_of(os.path.join(vo, key + ".json"))
            score = difflib.SequenceMatcher(None, norm(clean(text)), norm(" ".join(w["text"] for w in ws))).ratio()
            if best is None or score > best[1]:
                best = (key, score, ws)
        if best is None:
            raise SystemExit(f"block {i} has no take")
        key, score, ws = best
        src = os.path.join(vo, key + ".mp3")
        # trim leading/trailing silence only (inner pauses are the tension: keep them), EQ, -16 LUFS
        af = ["silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.05",
              "areverse", "silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.08", "areverse"]
        if who in PHONE:
            af += ["highpass=f=280", "lowpass=f=3800", "equalizer=f=1500:t=q:w=1:g=3"]
        af += ["loudnorm=I=-16:TP=-1.5:LRA=7"]
        out = os.path.join(tmp, f"b{i:02d}.wav")
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", src, "-af", ",".join(af), "-ar", "48000", "-ac", "1", out], check=True)
        # shift word times by the trimmed lead-in
        lead = ws[0]["start"] if ws else 0.0
        lead = max(0.0, lead - 0.05)
        for w in ws:
            all_words.append({"w": w["text"], "s": round(t0 + w["start"] - lead, 3), "e": round(t0 + w["end"] - lead, 3), "who": who, "block": i})
        d = dur(out)
        picks.append({"block": i, "who": who, "take": key, "score": round(score, 3), "start": round(t0, 3), "dur": round(d, 3)})
        parts.append(out)
        t0 += d + GAP_S
    lst = os.path.join(tmp, "list.txt")
    sil = os.path.join(tmp, "gap.wav")
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "lavfi", "-i", "anullsrc=r=48000:cl=mono", "-t", str(GAP_S), sil], check=True)
    with open(lst, "w") as f:
        for k, p in enumerate(parts):
            f.write(f"file '{os.path.abspath(p)}'\n")
            if k < len(parts) - 1:
                f.write(f"file '{os.path.abspath(sil)}'\n")
    raw = os.path.join(tmp, "concat.wav")
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", raw], check=True)
    final = os.path.join(ep, "vo.wav")
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", raw, "-af", "loudnorm=I=-16:TP=-1.5:LRA=9", "-ar", "48000", final], check=True)
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", final, "-b:a", "192k", os.path.join(ep, "vo.mp3")], check=True)
    json.dump({"picks": picks, "words": all_words, "duration": round(dur(final), 3)},
              open(os.path.join(ep, "vo_timing.json"), "w"), indent=1, ensure_ascii=False)
    for p in picks:
        print(p)
    print("duration", round(dur(final), 2), "s")


if __name__ == "__main__":
    ep = os.path.join(HERE, "..", sys.argv[1])
    if "--assemble" not in sys.argv:
        generate(ep)
    assemble(ep)
