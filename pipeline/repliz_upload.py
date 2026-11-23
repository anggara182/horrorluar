"""Upload videos to Repliz Storage and schedule Instagram Reels. usage: python3 -I repliz_upload.py plan.json"""
import json, os, subprocess, sys, base64
AUTH = base64.b64encode(f"{os.environ['REPLIZ_ACCESS_KEY']}:{os.environ['REPLIZ_SECRET_KEY']}".encode()).decode()
API = "https://api.repliz.com/public"
def call(method, path, body=None):
    cmd = ["curl", "-sS", "-m", "60", "-X", method, f"{API}{path}", "-H", f"Authorization: Basic {AUTH}", "-H", "Content-Type: application/json", "-w", "\n%{http_code}"]
    if body is not None: cmd += ["--data-binary", json.dumps(body)]
    out = subprocess.run(cmd, capture_output=True, text=True).stdout.rsplit("\n", 1)
    code = int(out[1]) if len(out) > 1 and out[1].isdigit() else 0
    try: data = json.loads(out[0]) if out[0].strip() else {}
    except Exception: data = {"raw": out[0][:300]}
    if code >= 300: raise SystemExit(f"{method} {path} -> {code} {json.dumps(data)[:300]}")
    return data
plan = json.load(open(sys.argv[1])); done = []
for it in plan["items"]:
    f = it["file"]; size = os.path.getsize(f); name = os.path.basename(f)
    init = call("POST", "/storage/file/init", {"filename": name, "size": size, "mimetype": "video/mp4"})
    r = subprocess.run(["curl", "-sS", "-m", "900", "-X", "PUT", "-T", f, "-H", "Content-Type: video/mp4", init["upload"], "-w", "%{http_code}", "-o", "/dev/null"], capture_output=True, text=True)
    if not r.stdout.strip().startswith("2"): raise SystemExit(f"PUT {name} failed: {r.stdout} {r.stderr[-200:]}")
    call("POST", f"/storage/file/{init['id']}/complete")
    body = {"title": "", "description": it["caption"], "topic": "", "type": "video",
            "medias": [{"alt": "", "type": "video", "thumbnail": "", "url": init["url"]}],
            "additionalInfo": {"isShareToFeed": True}, "replies": [],
            "accountId": plan["accountId"], "scheduleAt": it["at"]}
    s = call("POST", "/schedule", body)
    done.append({"ep": it["ep"], "at": it["at"], "scheduleId": s.get("scheduleId"), "fileId": init["id"]})
    print(it["ep"], it["at"], "scheduled", s.get("scheduleId"), flush=True)
json.dump(done, open(sys.argv[1].replace(".json", "_result.json"), "w"), indent=1)
