"""Minimal ai33.pro client (ElevenLabs-compatible async tasks). Reads AI33_API_KEY from env."""
import json, os, sys, time, urllib.request, urllib.parse, uuid

BASE = "https://api.ai33.pro"
KEY = os.environ["AI33_API_KEY"]

def _req(method, path, data=None, files=None, timeout=180):
    headers = {"xi-api-key": KEY}
    body = None
    if files is not None or (data is not None and method == "POST" and path.startswith("/v3")):
        boundary = uuid.uuid4().hex
        parts = []
        for k, v in (data or {}).items():
            parts.append(f'--{boundary}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{v}\r\n'.encode())
        parts.append(f"--{boundary}--\r\n".encode())
        body = b"".join(parts)
        headers["Content-Type"] = f"multipart/form-data; boundary={boundary}"
    elif data is not None:
        body = json.dumps(data).encode()
        headers["Content-Type"] = "application/json"
    for attempt in range(8):
        r = urllib.request.Request(BASE + path, data=body, headers=headers, method=method)
        try:
            with urllib.request.urlopen(r, timeout=timeout) as resp:
                return json.loads(resp.read())
        except urllib.error.HTTPError as e:
            msg = e.read().decode(errors="replace")
            if e.code in (429, 503) or (e.code == 400 and "Failed query" in msg):
                time.sleep(max(float(e.headers.get("Retry-After") or 0), 2 ** attempt) + 1); continue
            raise RuntimeError(f"{method} {path} -> {e.code}: {msg}")
        except Exception:
            if attempt == 7: raise
            time.sleep(2 ** attempt)
    raise RuntimeError(f"{method} {path}: retries exhausted (rate limited)")

def create_tts(text, voice_id, **extra):
    d = {"text": text, "voice_id": voice_id, "with_transcript": "true", **{k: str(v) for k, v in extra.items()}}
    return _req("POST", "/v3/text-to-speech", d)

def create_sfx(text, duration=None, loop=False, influence=0.4):
    d = {"text": text, "prompt_influence": influence, "loop": loop, "model_id": "eleven_text_to_sound_v3"}
    if duration: d["duration_seconds"] = duration
    return _req("POST", "/v1/task/sound-effect", d)

def task(tid):
    return _req("GET", f"/v1/task/{tid}")

def wait(tid, every=4, limit=600):
    t0 = time.time()
    while time.time() - t0 < limit:
        try:
            t = task(tid)
        except RuntimeError:
            time.sleep(every); continue
        if t.get("status") in ("done", "error"):
            return t
        time.sleep(every)
    raise TimeoutError(tid)

def download(url, path):
    r = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"})
    with urllib.request.urlopen(r, timeout=180) as resp, open(path, "wb") as f:
        f.write(resp.read())

def list_tasks(page=1, limit=100, type_=None):
    q = f"/v1/tasks?page={page}&limit={limit}" + (f"&type={type_}" if type_ else "")
    return _req("GET", q)

if __name__ == "__main__":
    print(json.dumps(task(sys.argv[1]), indent=1))
