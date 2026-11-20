"""Generate VO (2 takes/line) for EP04-06 and the shared SFX additions via ai33. Max 4 concurrent requests."""
import json, os, re, sys, difflib, concurrent.futures as cf
sys.path.insert(0, '/home/user/ep03/scripts'); sys.path.insert(0, '/home/user')
import ai33
from episodes import EPISODES as _ALL, VOICES
KEYS = sys.argv[1:] or list(_ALL)
EPISODES = {k: _ALL[k] for k in KEYS}
SFX = {
 "cicadas": ("Japanese summer afternoon, loud cicadas, hot still air over rice fields", 20, True),
 "wind_chime": ("A small Japanese glass wind chime tinkling softly on a veranda", 6, True),
 "boy_laugh": ("A teenage boy laughing quietly and strangely, slow, uncanny, close", 4, False),
 "india_night": ("Indian village road at night, crickets, distant dogs, wind in a huge banyan tree", 20, True),
 "anklets": ("Silver anklet bells jingling softly with slow barefoot steps on a dirt road", 5, False),
 "truck_start": ("Old diesel truck engine starting on the first try and idling", 4, False),
 "satay_grill": ("Charcoal satay grill sizzling and crackling at night, a hand fan waving", 15, True),
 "hair_wind": ("Soft night wind rising, rustling leaves and long hair", 4, False),
 "snow_wind": ("Icelandic winter night, wind over deep snow, very cold and empty", 20, True),
 "spinning_wheel": ("Old wooden spinning wheel whirring steadily in a quiet room", 8, True),
 "big_purr": ("An enormous cat's deep rumbling purr, very low and slow", 4, False),
 "heavy_paws": ("Huge soft heavy footsteps crunching deep snow, slow, a giant animal walking away", 5, False),
 "outback_night": ("Australian outback at night, dry wind, crickets, a distant dingo howl", 20, True),
 "light_hum": ("A faint eerie electric hum rising and falling, otherworldly", 5, False),
}
def norm(t): return re.sub(r"[^a-z0-9' ]", "", t.lower()).split()
def tts(ep, sid, voice, text, clean, take):
    out = f"/home/user/{ep}/public/audio/vo"; os.makedirs(out, exist_ok=True)
    r = ai33.create_tts(text, VOICES[voice], model_id="eleven_v3"); t = ai33.wait(r["task_id"])
    if t["status"] != "done": return {"error": t.get("error_message")}
    m = t["metadata"]; base = f"{out}/vo{sid:02d}_t{take}"
    ai33.download(m["audio_url"], base + ".mp3"); words = []
    if m.get("json_url"):
        ai33.download(m["json_url"], base + ".json"); j = json.load(open(base + ".json")); j = j[0] if isinstance(j, list) else j
        words = [w for w in j.get("words", []) if w.get("type") == "word"]
    got = " ".join(w["text"] for w in words)
    return {"file": f"vo/vo{sid:02d}_t{take}.mp3", "words": words, "score": round(difflib.SequenceMatcher(None, norm(clean), norm(got)).ratio(), 3), "transcript": got}
def sfx(name, p, s, loop):
    r = ai33.create_sfx(p, duration=s, loop=loop); t = ai33.wait(r["task_id"])
    if t["status"] != "done": return {"error": t.get("error_message")}
    url = t["metadata"].get("audio_url") or t.get("output_uri"); ai33.download(url, f"/home/user/sfxlib/{name}.mp3"); return {"file": name}
jobs = {}; res = {k: {} for k in EPISODES}; res["sfx"] = {}
with cf.ThreadPoolExecutor(4) as ex:
    for name, (p, s, l) in SFX.items(): jobs[ex.submit(sfx, name, p, s, l)] = ("sfx", name, 0)
    for ep, d in EPISODES.items():
        for sid, st, fr, cam, voice, vo, text, hero, notes in d["shots"]:
            if voice:
                clean = re.sub(r"\[[^\]]*\]", "", text)
                for take in (1, 2): jobs[ex.submit(tts, ep, sid, voice, text, clean, take)] = (ep, sid, take)
    for f in cf.as_completed(jobs):
        k, sid, take = jobs[f]
        try: o = f.result()
        except Exception as e: o = {"error": str(e)}
        if k == "sfx": res["sfx"][sid] = o
        else: res[k].setdefault(str(sid), {})[str(take)] = o
        print(k, sid, take, ("ERR " + str(o["error"])[:80]) if "error" in o else ("ok " + str(o.get("score", ""))), flush=True)
for ep in EPISODES: json.dump({"vo": res[ep]}, open(f"/home/user/{ep}/public/audio/manifest_raw.json", "w"), indent=1)
json.dump(res["sfx"], open("/home/user/sfxlib/manifest_new6.json", "w"), indent=1)
print("DONE")
