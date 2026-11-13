"""Generate EP01 VO (ai33 TTS v3, eleven_v3) and SFX (sound effect v3). Output: public/audio/{vo,sfx} + manifest."""
import json, os, re, sys, difflib, concurrent.futures as cf
sys.path.insert(0, os.path.dirname(__file__))
import ai33

ROOT = os.path.join(os.path.dirname(__file__), "..")
OUT = os.path.join(ROOT, "public", "audio")
NARR = "elevenlabs_nDJIICjR9zfJExIFeSCN"
VO = [
 (1, NARR, "[whispers] On Java's southern coast... there's one rule.", "On Java's southern coast there's one rule"),
 (2, NARR, "[firm, hushed] Never wear green.", "Never wear green"),
 (3, NARR, "[hushed, reverent] The sea belongs to Nyi Roro Kidul... Queen of the Southern Sea.", "The sea belongs to Nyi Roro Kidul Queen of the Southern Sea"),
 (4, NARR, "[softly] Green is her color. Wear it... and she thinks you're calling her.", "Green is her color Wear it and she thinks you're calling her"),
 (5, NARR, "A hotel by that beach still keeps one room for her.", "A hotel by that beach still keeps one room for her"),
 (6, NARR, "[whispers] Room three-oh-eight.", "Room three oh eight"),
 (7, NARR, "My mother packed my bag herself.", "My mother packed my bag herself"),
 (8, NARR, "No green. She checked twice.", "No green She checked twice"),
 (9, NARR, "[uneasy] At sunset, the sea pulled back. Far back.", "At sunset the sea pulled back Far back"),
 (10, NARR, "Everyone took photos.", "Everyone took photos"),
 (11, NARR, "I walked closer.", "I walked closer"),
 (12, NARR, "[relaxed] A wave touched my feet. Just foam.", "A wave touched my feet Just foam"),
 (13, NARR, "[laughs softly] I laughed.", "I laughed"),
 (14, NARR, "[uneasy] Then I looked down. My white dress... was turning green. [whispers] From the hem up.", "Then I looked down My white dress was turning green From the hem up"),
 (15, NARR, "[whispers] She doesn't wait for you to wear it.", "She doesn't wait for you to wear it"),
 (16, NARR, "[whispers] Look at what you're wearing... right now.", "Look at what you're wearing right now"),
]
LAUGHS = []
SFX = {
 "amb_beach": ("Calm sunset beach ambience, gentle waves on sand, soft wind, distant seagulls", 30, True),
 "drone_sea": ("Deep ominous oceanic drone, low rumble, slowly evolving, mysterious", 30, True),
 "underwater": ("Underwater ambience, muffled, slow bubbles, deep pressure", 10, True),
 "corridor": ("Quiet old hotel corridor room tone, faint hum, waves heard faintly behind a door", 8, True),
 "gong": ("Single large Javanese gamelan gong strike with long shimmering resonance", 6, False),
 "choir": ("Ethereal distant female voices humming, mystical, slow, reverb, no words", 8, False),
 "silk_whoosh": ("Fast silk fabric whoosh sweeping past", 1.5, False),
 "boom": ("Deep sub boom layered with a heavy wave crashing", 3, False),
 "zipper": ("Suitcase zipper closing", 2, False),
 "fabric": ("Folding soft clothes, fabric rustle, close", 3, False),
 "clock": ("Wall clock ticking in a quiet room", 6, False),
 "scarf": ("Soft silk scarf pulled out of a bag", 1.5, False),
 "drain": ("Sea water draining back over wet sand, receding, eerie quiet hiss", 6, False),
 "shutter": ("Several phone camera shutter clicks", 3, False),
 "murmur": ("Small crowd murmuring on a beach, excited, distant", 6, False),
 "steps_sand": ("Bare footsteps walking on wet sand", 4, False),
 "foam": ("Gentle sea foam washing over feet, close up, fizzing", 4, False),
 "laugh": ("Young woman short relieved laugh, soft", 2, False),
 "riser": ("Tension riser, rising dissonant strings and breath", 5, False),
 "heartbeat": ("Slow heavy heartbeat thumps, muffled", 6, False),
 "dye": ("Water soaking into cloth, fizzing hiss spreading", 5, False),
 "wave_crash": ("Big wave crashing on the shore, close", 4, False),
}

def norm(t): return re.sub(r"[^a-z' ]", "", t.lower()).split()

def existing_tasks(since="2026-11-10T07:20"):
    out = {}
    for page in (1, 2, 3, 4):
        d = ai33.list_tasks(page=page, limit=50)
        rows = d.get("data", [])
        for t in rows:
            if t["created_at"] >= since and t["status"] == "done":
                out.setdefault(t.get("text") or "", []).append(t)
        if not rows or rows[-1]["created_at"] < since: break
    return out

EXIST = {}

def _task_for(text, take):
    lst = EXIST.get(text, [])
    if len(lst) >= take: return lst[take - 1]
    r = ai33.create_tts(text, VOICE_OF[text], model_id="eleven_v3")
    return ai33.wait(r["task_id"])

VOICE_OF = {}

def run_tts(key, voice, text, clean, take):
    VOICE_OF[text] = voice
    t = _task_for(text, take)
    if t["status"] != "done": return {"error": t.get("error_message")}
    m = t["metadata"]; base = f"{key}_t{take}"
    ai33.download(m["audio_url"], os.path.join(OUT, "vo", base + ".mp3"))
    words = []
    if m.get("json_url"):
        ai33.download(m["json_url"], os.path.join(OUT, "vo", base + ".json"))
        j = json.load(open(os.path.join(OUT, "vo", base + ".json")))
        j = j[0] if isinstance(j, list) else j
        words = [w for w in j.get("words", []) if w.get("type") == "word"]
    got = " ".join(w["text"] for w in words)
    score = difflib.SequenceMatcher(None, norm(clean), norm(got)).ratio() if clean else 1
    return {"file": f"vo/{base}.mp3", "words": words, "score": round(score, 3), "transcript": got}

def run_sfx(name, prompt, sec, loop):
    lst = EXIST.get(prompt, [])
    if lst: t = lst[0]
    else:
        r = ai33.create_sfx(prompt, duration=sec, loop=loop)
        t = ai33.wait(r["task_id"])
    if t["status"] != "done": return name, {"error": t.get("error_message")}
    m = t["metadata"]; url = m.get("audio_url") or (m.get("audio_urls") or [None])[0] or t.get("output_uri")
    if not url: return name, {"error": "no url", "meta": m}
    ai33.download(url, os.path.join(OUT, "sfx", name + ".mp3"))
    return name, {"file": f"sfx/{name}.mp3"}

if __name__ == "__main__":
    os.makedirs(os.path.join(OUT, "vo"), exist_ok=True); os.makedirs(os.path.join(OUT, "sfx"), exist_ok=True)
    EXIST.update(existing_tasks())
    print("reusable tasks:", sum(len(v) for v in EXIST.values()), flush=True)
    jobs = {}
    with cf.ThreadPoolExecutor(4) as ex:
        for sid, v, text, clean in VO:
            for take in (1, 2): jobs[ex.submit(run_tts, f"vo{sid:02d}", v, text, clean, take)] = ("vo", sid, take)
        for name, v, text in LAUGHS:
            jobs[ex.submit(run_tts, name, v, text, "", 1)] = ("laugh", name, 1)
        for name, (p, s, l) in SFX.items():
            jobs[ex.submit(run_sfx, name, p, s, l)] = ("sfx", name, 0)
        res = {"vo": {}, "laugh": {}, "sfx": {}}
        for fut in cf.as_completed(jobs):
            kind, key, take = jobs[fut]
            try: out = fut.result()
            except Exception as e: out = {"error": str(e)}
            if kind == "sfx": out = out[1] if isinstance(out, tuple) else out; res["sfx"][key] = out
            else: res[kind].setdefault(str(key), {})[str(take)] = out
            print(kind, key, take, "ERR " + str(out.get("error")) if "error" in out else "ok " + str(out.get("score", "")), flush=True)
    json.dump(res, open(os.path.join(OUT, "manifest_raw.json"), "w"), indent=1)
