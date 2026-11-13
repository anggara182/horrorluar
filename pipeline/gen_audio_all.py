"""Generate VO (2 takes/line) for EP04-06 and the shared SFX additions via ai33. Max 4 concurrent requests."""
import json, os, re, sys, difflib, concurrent.futures as cf
sys.path.insert(0, '/home/user/ep03/scripts'); sys.path.insert(0, '/home/user')
import ai33
from episodes import EPISODES as _ALL, VOICES
KEYS = sys.argv[1:] or list(_ALL)
EPISODES = {k: _ALL[k] for k in KEYS}
SFX = {
 "school_amb": ("Empty Japanese school corridor after hours, distant cicadas fading, faint wind through an open window, quiet hum", 20, True),
 "bathroom_amb": ("Empty tiled school bathroom at night, a slowly dripping tap, faint buzzing fluorescent light, echoey", 20, True),
 "knock3": ("Three slow knuckle knocks on a thin wooden toilet stall door in an echoey tiled room", 3, False),
 "stall_creak": ("Thin toilet stall door slowly creaking open, small squeaky hinge", 3, False),
 "plains_night": ("Open grassland plains at night, wind through tall grass, crickets, distant cattle lowing", 20, True),
 "whistle": ("Eerie lone human whistling, seven slow rising notes, distant and echoing over open plains at night", 7, False),
 "bones": ("Dry bones rattling inside a cloth sack, taken out one by one", 5, False),
 "dogs_whine": ("Two dogs whining and whimpering in fear at night", 4, False),
 "rooster": ("A rooster crowing at dawn far away in the countryside", 4, False),
 "barrio_night": ("Philippine village at night, crickets, geckos, palm leaves rustling, a distant dog bark", 20, True),
 "roof_land": ("Something heavy landing on a thatched roof, rustling straw, big wings folding", 3, False),
 "wings": ("Huge bird wings flapping heavily and taking off into the night", 3, False),
 "sniff": ("Slow heavy creature sniffing through a gap, close and breathy", 4, False),
 "pencil": ("Pencil scribbling fast on paper, scratchy", 4, False),
 "candles_out": ("Several candles blown out by a sudden gust, a soft whoosh then silence", 2, False),
 "clock_tick": ("Old wall clock ticking loudly in a quiet room at night", 10, True),
 "loch_amb": ("Scottish loch at dusk, gentle water lapping on stones, cold wind, a distant curlew call", 20, True),
 "horse_snort": ("A horse snorting and blowing softly while standing in shallow water", 3, False),
 "horse_water": ("A horse walking slowly into a lake, heavy hooves splashing in shallow water", 5, False),
 "horse_shriek": ("An unnatural shrill horse scream echoing over water, eerie", 3, False),
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
json.dump(res["sfx"], open("/home/user/sfxlib/manifest_new4.json", "w"), indent=1)
print("DONE")
