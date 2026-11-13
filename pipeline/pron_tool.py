import sys, json, subprocess, os, concurrent.futures as cf
sys.path.insert(0, '/home/user/ep03/scripts'); import ai33
NARR = "elevenlabs_nDJIICjR9zfJExIFeSCN"; OUT = "/home/user/pron"
def stt(path, lang):
    args = ["curl", "-sS", "-m", "120", "-X", "POST", "https://api.ai33.pro/v1/task/speech-to-text", "-H", f"xi-api-key: {os.environ['AI33_API_KEY']}", "-F", f"file=@{path}"]
    if lang: args += ["-F", f"language_code={lang}"]
    r = subprocess.run(args, capture_output=True, text=True); d = json.loads(r.stdout)
    if "task_id" not in d: return "STT-ERR " + r.stdout[:120], None
    t = ai33.wait(d["task_id"]); m = t["metadata"]; p = path + f".{lang}.stt.json"; ai33.download(m["json_url"], p)
    j = json.load(open(p)); j = j[0] if isinstance(j, list) else j; return j.get("text", ""), j.get("language_code")
def job(key, text, take, model="eleven_v3", lang=None):
    r = ai33.create_tts(text, NARR, model_id=model); t = ai33.wait(r["task_id"]); m = t["metadata"]
    p = f"{OUT}/{key}_t{take}.mp3"; ai33.download(m["audio_url"], p)
    try: ai33.download(m["json_url"], p + ".tts.json")
    except Exception: pass
    return (key, take, text) + stt(p, lang)
J = [("ng_g", "They call her [Indonesian accent] Suster Ngesot. [normal voice] The crawling nurse.", 1, "eleven_v3", None),
     ("ng_g", "They call her [Indonesian accent] Suster Ngesot. [normal voice] The crawling nurse.", 2, "eleven_v3", None),
     ("ng_h", "[speaking Indonesian] Suster Ngesot.", 1, "eleven_v3", "ind"),
     ("ng_i", "Suster Ngesot.", 1, "eleven_multilingual_v2", "ind"),
     ("ng_i", "Suster Ngesot.", 2, "eleven_multilingual_v2", "ind"),
     ("ng_j", "Namanya Suster Ngesot.", 1, "eleven_multilingual_v2", "ind")]
with cf.ThreadPoolExecutor(3) as ex:
    for f in cf.as_completed([ex.submit(job, *j) for j in J]):
        try: print(*f.result(), sep=" | ", flush=True)
        except Exception as e: print("ERR", e, flush=True)
