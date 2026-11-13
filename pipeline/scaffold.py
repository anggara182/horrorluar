import json, os, re, shutil, subprocess, sys
sys.path.insert(0, '/home/user'); from episodes import EPISODES
SRC = '/home/user/ep03'
style = open(f'{SRC}/STYLE.md').read()
KEYS = sys.argv[1:] or list(EPISODES)
for key, ep in [(k, EPISODES[k]) for k in KEYS]:
    d = f'/home/user/{key}'
    if os.path.exists(d): shutil.rmtree(d)
    shutil.copytree(SRC, d, symlinks=True, ignore=shutil.ignore_patterns('out', 'baked', '.git', 'node_modules', 'audio', '__pycache__'))
    os.symlink('/home/user/roro-kidul/node_modules', f'{d}/node_modules')
    for f in os.listdir(f'{d}/src/art'):
        if f != 'world.ts': os.remove(f'{d}/src/art/{f}')
    shutil.rmtree(f'{d}/src/sets'); shutil.rmtree(f'{d}/src/shots'); os.makedirs(f'{d}/src/sets'); os.makedirs(f'{d}/src/shots')
    os.remove(f'{d}/src/data/ep03.json')
    for p, a, b in [('src/data/ep.ts', "./ep03.json", "./episode.json"), ('scripts/preview.mjs', 'src/data/ep03.json', 'src/data/episode.json'),
                    ('scripts/contact.mjs', 'src/data/ep03.json', 'src/data/episode.json'), ('scripts/contact.mjs', 'out/ep03-contact.jpg', 'out/contact.jpg')]:
        s = open(f'{d}/{p}').read(); assert a in s, (p, a); open(f'{d}/{p}', 'w').write(s.replace(a, b))
    # shot data (estimated timing; replaced by VO timing later)
    t = 0.0; shots = []
    for sid, st, fr, cam, voice, vo, tts, hero, notes in ep['shots']:
        toks = vo.split(' '); n = len(toks); dur = round(max(2.2, n / 2.6 + 0.9), 2)
        words = [{"text": w.replace('*', ''), "highlight": '*' in w, "start": round(t + .3 + (dur - .6) * i / n, 3), "end": round(t + .3 + (dur - .6) * (i + 1) / n, 3)} for i, w in enumerate(toks)]
        owner = next(o for s_, o, _ in ep['sets'] if s_ == st)
        shots.append({"id": sid, "start": round(t, 3), "end": round(t + dur, 3), "act": 1, "set": st, "owner": owner, "framing": fr, "camera": cam,
                      "vo": vo.replace('*', ''), "voKind": "narration" if voice else "onscreen", "speaker": voice, "words": words, "trans": "cut",
                      "caption": voice is not None, "cool": False, "hero": hero, "notes": notes})
        t += dur
    data = {"id": ep['id'], "title": ep['title'], "fps": 30, "width": 1080, "height": 1920, "durationSec": round(t, 3), "accent": ep['accent'], "timingSource": "estimate", "shots": shots}
    json.dump(data, open(f'{d}/src/data/episode.json', 'w'), indent=1, ensure_ascii=False)
    # sets / shots stubs + registries
    reg_imp, reg_spread, idx_imp, idx_map = [], [], [], []
    for st, owner, desc in ep['sets']:
        C = st.upper(); ids = [s[0] for s in ep['shots'] if s[1] == st]
        open(f'{d}/src/sets/{st}.tsx', 'w').write(f"import React from 'react';\nimport type {{ BandSpec }} from '../comp/Bands';\nimport {{ W, H, rng }} from '../art/world';\n\n/** Set \"{st}\" ({desc}). Static bands baked ONCE to public/baked/{st}/<band>.png. Ids \"{st}/<band>\". */\nexport const {C}: Record<string, BandSpec> = {{}};\n")
        open(f'{d}/src/shots/{owner}.tsx', 'w').write("import React from 'react';\nimport { AbsoluteFill } from 'remotion';\nimport { useShot } from '../comp/Camera';\n\n" + "\n".join(
            f"/** shot {i} — placeholder, replace. */\nexport const S{i:02d}: React.FC = () => {{ const {{ p }} = useShot(); return <AbsoluteFill style={{{{ backgroundColor: '#14161c', opacity: 0.6 + 0.4 * p }}}} />; }};" for i in ids) + "\n")
        reg_imp.append(f"import {{ {C} }} from '../sets/{st}';"); reg_spread.append(f"...{C}")
        idx_imp.append(f"import {{ {', '.join(f'S{i:02d}' for i in ids)} }} from './{owner}';"); idx_map += [f"{i}: S{i:02d}" for i in ids]
    open(f'{d}/src/shots/index.ts', 'w').write("import React from 'react';\n" + "\n".join(idx_imp) + "\n\n/** shot id -> scene (owned by the coordinator). */\nexport const SCENES: Record<number, React.FC> = {\n  " + ", ".join(sorted(idx_map, key=lambda x: int(x.split(':')[0]))) + ",\n};\n")
    b = open(f'{d}/src/comp/Bands.tsx').read()
    b = re.sub(r"import \{ VILLAGE \}.*?\n\n", "\n".join(reg_imp) + "\n\n", b, flags=re.S)
    b = b.replace("{ ...VILLAGE, ...BAMBOO, ...HOME, ...GRAPHIC }", "{ " + ", ".join(reg_spread) + " }")
    assert 'BAMBOO' not in b and 'HOME }' not in b; open(f'{d}/src/comp/Bands.tsx', 'w').write(b)
    # style guide: generic rules + episode palette/characters
    s = style.replace('# EP03 Wewe Gombel — style guide', f"# {ep['id']} {ep['title']} — style guide")
    s = re.sub(r"## Palette.*?\n## Characters.*?\n(?=## Tech rules)", f"## Palette\n{ep['palette']}\n\n## Characters (no detailed faces)\n{ep['characters']}\n\n", s, flags=re.S)
    s = re.sub(r"- Woman from behind \(mom\).*?\n", "", s); s = re.sub(r"- Wewe Gombel crouched.*?\n", "", s)
    s = s.replace("Wewe Gombel ≈ 1/10 (elongated, very long limbs); ", "")
    s += "\n## Sets in this episode\n" + "\n".join(f"- `{st}` (owner {o}, file src/shots/{o}.tsx): {desc}" for st, o, desc in ep['sets']) + "\n"
    open(f'{d}/STYLE.md', 'w').write(s)
    subprocess.run('git init -q && git add -A && git -c user.email=noreply@anthropic.com -c user.name=Claude commit -qm "scaffold"', shell=True, cwd=d, check=True)
    r = subprocess.run('npx tsc -p . 2>&1 | tail -3', shell=True, cwd=d, capture_output=True, text=True)
    print(key, ep['title'], f"{len(shots)} shots, est {round(t,1)}s", "tsc:", r.stdout.strip() or "ok")
