"""Generate VO (2 takes/line) for EP04-06 and the shared SFX additions via ai33. Max 4 concurrent requests."""
import json, os, re, sys, difflib, concurrent.futures as cf
sys.path.insert(0, '/home/user/ep03/scripts'); sys.path.insert(0, '/home/user')
import ai33
from episodes import EPISODES as _ALL, VOICES
KEYS = sys.argv[1:] or list(_ALL)
EPISODES = {k: _ALL[k] for k in KEYS}
SFX = {
 "snow_forest": ("Winter forest at night, cold wind through birch trees, snow creaking softly, very quiet", 20, True),
 "hut_legs": ("A huge wooden hut creaking and groaning as it turns on giant legs, heavy scraping steps in deep snow", 4, False),
 "oven_fire": ("Old clay oven fire crackling with a bubbling iron pot", 15, True),
 "forest_summer": ("Pine forest on a bright summer night, soft breeze, distant birds, a faint creek", 20, True),
 "goat_bells": ("Goats with small bells grazing on a mountain pasture", 8, True),
 "singing_far": ("A woman singing a wordless haunting folk melody far away in a forest, echoing", 7, False),
 "pig_grunt": ("A pig grunting and sniffing at a wooden door at night", 4, False),
 "pig_squeal": ("A pig squealing loudly and running away into the night", 3, False),
 "wall_knock": ("Knuckles knocking twice hard on a thin plaster wall", 2, False),
 "china_street": ("Old Chinese city street at night, distant traffic, paper offerings crackling in metal bins, faint wind chimes", 20, True),
 "whistle_tune": ("A person whistling a short simple melody once in an empty street at night", 4, False),
 "footsteps_follow": ("Two sets of footsteps on wet pavement at night, the second following close behind and speeding up", 5, False),
 "door_steps": ("Slow footsteps in a corridor stopping right outside an apartment door", 5, False),
 "africa_night": ("Rural African night, crickets and frogs, a distant dog barking, soft wind in dry grass", 20, True),
 "scratch_floor": ("Tiny claws scratching and tapping across a floor in the dark", 4, False),
 "imp_giggle": ("A small mischievous creature giggling softly, very close, playful and eerie", 3, False),
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
json.dump(res["sfx"], open("/home/user/sfxlib/manifest_new5.json", "w"), indent=1)
print("DONE")
