"""Build /home/user/library: reusable SVG art, sets, shots, pipeline, SFX, voices, thumbnails + catalog.json + LIBRARY.md.
Re-run after new episodes: python3 -I build_library.py"""
import json, os, re, shutil, subprocess, glob, sys
sys.path.insert(0, '/home/user')
from episodes import EPISODES, VOICES

H = '/home/user'; L = f'{H}/library'
EPS = [  # key, project dir, title, country, video
    ('ep01', 'kuntilanak', 'Kuntilanak', 'Indonesia', 'out/ep01-final.mp4'),
    ('ep02', 'roro-kidul', 'Nyi Roro Kidul', 'Indonesia', 'out/ep02-final.mp4'),
    ('ep03', 'ep03', 'Wewe Gombel', 'Indonesia', 'out/ep03-v4.mp4'),
]
COUNTRY = {'ep04': 'Indonesia', 'ep05': 'Indonesia', 'ep06': 'Indonesia', 'ep07': 'Japan', 'ep08': 'Mexico', 'ep09': 'Korea',
           'ep10': 'USA', 'ep11': 'Indonesia', 'ep12': 'Thailand', 'ep13': 'Ireland', 'ep14': 'Korea', 'ep15': 'Indonesia (Java)', 'ep16': 'Japan', 'ep17': 'Venezuela', 'ep18': 'Philippines', 'ep19': 'Indonesia', 'ep20': 'Scotland', 'ep21': 'Russia', 'ep22': 'Norway', 'ep23': 'Indonesia', 'ep24': 'China', 'ep25': 'South Africa', 'ep26': 'Japan', 'ep27': 'India', 'ep28': 'Indonesia', 'ep29': 'Iceland', 'ep30': 'Australia'}
for k in sorted(EPISODES):
    vids = sorted(glob.glob(f'{H}/{k}/out/EP*.mp4'))
    EPS.append((k, k, EPISODES[k]['title'], COUNTRY.get(k, ''), os.path.relpath(vids[-1], f'{H}/{k}') if vids else ''))

CATS = [  # first match wins (order matters)
    ('set', r'Band$|Bg$|^Sky|Backdrop|Wall$|Floor$|Room$|Exterior|Interior|Street$|Lane$|Hall$|Corridor|Scene$|Layer$'),
    ('environment', r'Sea$|Shore|Headland|Surf|Pandan|Pine|Reeds|Gulls|Twinkles|Tree|Palm$|Hill|Mountain|Cloud|Grass|Bush|Kitchen|Outside|NightWorld|Tiles|Road|MegaMendung|Ribbon'),
    ('hand', r'Hand|Arm|Finger|Palm(?!Tree)|Claw'),
    ('face', r'Face|Eye|Mouth|Mask|Head$|Profile|Smile|Lips'),
    ('character', r'Girl|Woman|Man$|Men$|Wife|Husband|Mother|Mom|Kid|Child|Boy|Fig|Silhouette|Ghost|Banshee|Tuyul|Pocong|Nurse|Tiger|Mary|Gran|Dad$|Driver|Guard|Uncle|Father|Narrator|Runner|Walker|Person|People|Body|Spirit|Creature|Kuntil|Wewe|Llorona|Onna|Genderuwo|Nak$|Lady|Bride|Monk|Passenger|Crowd|Hair'),
    ('fx', r'Glow|Rain|Fog|Mist|Smoke|Flame|Fire|Ripple|Drip|Spark|Light|Beam|Rim|Shadow|Puddle|Foot|Steps|Track|Trail|Halo|Haze|Dust|Splash|Steam|Moon|Stars|Snow|Wave|Water|Flicker|Bokeh|Vignette|Grad'),
    ('prop', r'.'),
]
def cat_of(name):
    for c, p in CATS:
        if re.search(p, name): return c
EXP = re.compile(r'^export (?:const|function) ([A-Z][A-Za-z0-9_]*)(.*)$')

def doc_before(lines, i):
    j = i - 1
    if j >= 0 and lines[j].strip().startswith('//'): return lines[j].strip().lstrip('/ ').strip()
    if j >= 0 and lines[j].strip().endswith('*/'):
        k = j
        while k >= 0 and '/**' not in lines[k] and '/*' not in lines[k]: k -= 1
        return ' '.join(l.strip(' /*') for l in lines[k:j + 1]).strip()
    return ''

def props_of(rest):
    m = re.search(r'React\.FC<\{([^}]*)\}>', rest)
    return re.sub(r'\s+', ' ', m.group(1)).strip() if m else ''

def shots_of(d):
    out = []
    for s in d.get('shots', []):
        r = {k: s.get(k) for k in ('id', 'set', 'framing', 'camera', 'hero', 'vo', 'start', 'end') if s.get(k) is not None}
        if r.get('set') and ' ' in r['set']: r['set'] = r['set'].split()[-1].lower()  # ep02 style 'A Beach' -> 'beach'
        out.append(r)
    return out

if os.path.exists(L):
    for sub in ('episodes', 'thumbs', 'pipeline', 'template', 'sfx'): shutil.rmtree(f'{L}/{sub}', ignore_errors=True)
os.makedirs(L, exist_ok=True)

catalog = {'episodes': [], 'components': [], 'sfx': [], 'voices': {}}
for key, proj, title, country, vid in EPS:
    P = f'{H}/{proj}'; E = f'{L}/episodes/{key}'; os.makedirs(E, exist_ok=True)
    for sub in ('art', 'sets', 'shots'):
        if os.path.isdir(f'{P}/src/{sub}'): shutil.copytree(f'{P}/src/{sub}', f'{E}/{sub}')
    for f in ('STYLE.md',):
        if os.path.exists(f'{P}/{f}'): shutil.copy(f'{P}/{f}', E)
    dj = (glob.glob(f'{P}/src/data/episode.json') + glob.glob(f'{P}/src/data/ep0*.json'))[:1]
    data = json.load(open(dj[0])) if dj else {}
    if dj: shutil.copy(dj[0], f'{E}/episode.json')
    # thumbnails
    T = f'{L}/thumbs/{key}'; os.makedirs(T, exist_ok=True); thumbs = {}
    stills = sorted(glob.glob(f'{P}/out/stills/s[0-9]*.jpg') + glob.glob(f'{P}/out/stills/shot[0-9]*.png'))
    for st in stills:
        n = int(re.search(r'(\d+)', os.path.basename(st)).group(1))
        dst = f'{T}/s{n:02d}.jpg'
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', st, '-vf', 'scale=270:-2', '-q:v', '5', dst], check=True)
        thumbs[n] = os.path.relpath(dst, L)
    shots = shots_of(data)
    for s in shots: s['thumb'] = thumbs.get(s['id'])
    accent = data.get('accent') or (EPISODES.get(key, {}).get('accent') if key in EPISODES else None)
    catalog['episodes'].append({'key': key, 'title': title, 'country': country, 'project': P, 'video': f'{P}/{vid}' if vid else '',
                                'accent': accent, 'duration': data.get('durationSec'), 'shots': shots,
                                'kit': 'svg' if os.path.isdir(f'{P}/src/art') else '3d-legacy'})
    # components
    for f in sorted(glob.glob(f'{E}/art/*.tsx') + glob.glob(f'{E}/sets/*.tsx')):
        lines = open(f).read().split('\n'); rel = os.path.relpath(f, L)
        imports = sorted(set(re.findall(r"from '(\.[^']+)'", '\n'.join(lines))))
        for i, ln in enumerate(lines):
            m = EXP.match(ln)
            if not m: continue
            name, rest = m.groups()
            if name.isupper() or re.fullmatch(r'[A-Z0-9_]+', name): continue  # constants
            if 'React.FC' not in rest and '=> (' not in rest and 'function' not in ln and '=>' not in rest: continue
            if key == 'ep03' and any(c['name'] == name and c['ep'] == 'ep02' for c in catalog['components']): continue  # ep03 kit copy of ep02
            catalog['components'].append({'name': name, 'cat': cat_of(name), 'ep': key, 'file': rel, 'line': i + 1,
                                          'props': props_of(rest), 'doc': doc_before(lines, i), 'imports': imports})

    for f in sorted(glob.glob(f'{E}/sets/*.tsx')):
        src = open(f).read(); bands = sorted(set(re.findall(r"['\"]([a-z]+/[a-z0-9_]+)['\"]\s*:", src)))
        set_name = os.path.basename(f)[:-4]
        if set_name == 'graphic' and not bands: continue
        used = [s['id'] for s in shots if s.get('set') == set_name]
        catalog['components'].append({'name': f'{set_name} set', 'cat': 'set', 'ep': key, 'file': os.path.relpath(f, L), 'line': 1,
                                      'props': 'bands: ' + ', '.join(bands), 'doc': f'shots {used}', 'imports': [], 'thumb': next((s['thumb'] for s in shots if s.get('set') == set_name and s.get('thumb')), None)})

# SFX
os.makedirs(f'{L}/sfx', exist_ok=True)
prompts = json.load(open('/tmp/claude-0/-home-user/4e3d45b6-73d5-5a09-a639-c80e13ee78bf/scratchpad/sfx_prompts.json'))
for f in sorted(glob.glob(f'{H}/sfxlib/*.mp3')):
    n = os.path.basename(f)[:-4]; shutil.copy(f, f'{L}/sfx/')
    dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], capture_output=True, text=True).stdout or 0)
    p = prompts.get(n)
    note = 'TTS ghost laugh take: noisy, do not use (use laugh_sfx)' if n.startswith('laugh_ghost') else ''
    catalog['sfx'].append({'name': n, 'file': f'sfx/{n}.mp3', 'dur': round(dur, 2), 'prompt': p[0] if p else '', 'loop': p[2] if p else False, 'note': note})

# voices
VNOTE = {'narr': 'Narrator (Emmaline). Default storyteller.', 'ghost': 'Ghost (Anjura). Never use for laughs: TTS laughs come out as noise.',
         'guard': 'Older man / guard.', 'gran': 'Grandmother.', 'mom': 'Mother.', 'man': 'Man on the phone (telephone EQ applied in mix).'}
catalog['voices'] = {k: {'id': v, 'note': VNOTE.get(k, '')} for k, v in VOICES.items()}

# pipeline + template
os.makedirs(f'{L}/pipeline', exist_ok=True)
for f in ('episodes.py', 'scaffold.py', 'gen_audio_all.py', 'build_audio_ep.py', 'qc.sh', 'render_q.sh', 'AGENT_BRIEF.md', 'pron_test2.py', 'build_library.py', 'gallery_template.html'):
    shutil.copy(f'{H}/{f}', f'{L}/pipeline/{"pron_tool.py" if f == "pron_test2.py" else f}')
shutil.copy(f'{H}/ep03/scripts/ai33.py', f'{L}/pipeline/')
os.makedirs(f'{L}/template/src', exist_ok=True)
for f in ('package.json', 'tsconfig.json', 'remotion.config.ts'): shutil.copy(f'{H}/ep15/{f}', f'{L}/template/')
shutil.copytree(f'{H}/ep15/scripts', f'{L}/template/scripts', ignore=shutil.ignore_patterns('__pycache__'))
shutil.copytree(f'{H}/ep15/src/comp', f'{L}/template/src/comp')
for f in ('Root.tsx', 'index.ts'): shutil.copy(f'{H}/ep15/src/{f}', f'{L}/template/src/')
os.makedirs(f'{L}/template/src/data', exist_ok=True); shutil.copy(f'{H}/ep15/src/data/ep.ts', f'{L}/template/src/data/')
if os.path.exists(f'{H}/ep15/src/art/world.tsx'): os.makedirs(f'{L}/template/src/art', exist_ok=True); shutil.copy(f'{H}/ep15/src/art/world.tsx', f'{L}/template/src/art/')

# which shots use each component (direct JSX use in shots files, else via the set file that uses it)
def shot_segments(ep):
    seg = {}
    for f in glob.glob(f'{L}/episodes/{ep}/shots/*.tsx'):
        parts = re.split(r'^export const S(\d+)\b', open(f).read(), flags=re.M)
        for i in range(1, len(parts), 2): seg[int(parts[i])] = parts[i + 1]
    return seg
SEG = {e['key']: shot_segments(e['key']) for e in catalog['episodes']}
SETSRC = {e['key']: {os.path.basename(f)[:-4]: open(f).read() for f in glob.glob(f'{L}/episodes/{e["key"]}/sets/*.tsx')} for e in catalog['episodes']}
EPD = {e['key']: e for e in catalog['episodes']}
for c in catalog['components']:
    if c['name'].endswith(' set'):
        c['shots'] = [s['id'] for s in EPD[c['ep']]['shots'] if s.get('set') == c['name'][:-4]]; continue
    pat = re.compile(r'<' + re.escape(c['name']) + r'[\s/>]')
    ids = sorted(i for i, t in SEG[c['ep']].items() if pat.search(t))
    if not ids:
        sets = [n for n, t in SETSRC[c['ep']].items() if pat.search(t)]
        ids = [s['id'] for s in EPD[c['ep']]['shots'] if s.get('set') in sets]
    c['shots'] = ids

# per-episode thumbnail sprite (180x320 cells, one row) for the gallery page
os.makedirs(f'{L}/thumbs/sprites', exist_ok=True)
from PIL import Image
for e in catalog['episodes']:
    ts = [s for s in e['shots'] if s.get('thumb')]
    if not ts: e['sprite'] = None; continue
    im = Image.new('RGB', (180 * len(ts), 320), (8, 8, 10))
    for i, s in enumerate(ts):
        t = Image.open(f"{L}/{s['thumb']}").convert('RGB').resize((180, 320)); im.paste(t, (180 * i, 0)); s['cell'] = i
    im.save(f"{L}/thumbs/sprites/{e['key']}.jpg", quality=72); e['sprite'] = f"thumbs/sprites/{e['key']}.jpg"

json.dump(catalog, open(f'{L}/catalog.json', 'w'), indent=1)

# LIBRARY.md
C = catalog['components']; cats = ['character', 'face', 'hand', 'prop', 'fx', 'environment', 'set']
md = ['# Horror Legends: asset library', '',
      f"{len(catalog['episodes'])} episodes · {len(C)} SVG components · {len(catalog['sfx'])} SFX · {len(catalog['voices'])} voices. Generated by `pipeline/build_library.py` (re-run after new episodes).", '',
      '## How to reuse', '',
      '- Components are React SVG (Remotion 4.0.542), world space 1296x2304 unless noted. Copy the whole source file from `episodes/<ep>/art|sets/` into the new project `src/art/` (keep its relative imports: most only use `react` and `../comp/Camera`). Restyle via props/palette; do not import across projects.',
      '- Find assets by category below or in `catalog.json` (name, props, file:line, episode). Shot thumbnails in `thumbs/<ep>/sNN.jpg` show components in context.',
      '- SFX: `sfx/<name>.mp3` (same files as /home/user/sfxlib). Loudness is normalised at mix time, so any can be reused.',
      '- New episode: `pipeline/episodes.py` (entry) → `scaffold.py` → `gen_audio_all.py` → agents per `AGENT_BRIEF.md` → `build_audio_ep.py` → bake/contact → `render_q.sh`.', '',
      '## Voices', '', '| key | voice id | note |', '|---|---|---|']
md += [f"| {k} | `{v['id']}` | {v['note']} |" for k, v in catalog['voices'].items()]
md += ['', '## Episodes', '', '| ep | title | country | shots | video |', '|---|---|---|---|---|']
md += [f"| {e['key']} | {e['title']} | {e['country']} | {len(e['shots'])} | `{e['video']}` |" for e in catalog['episodes']]
for c in cats:
    items = [x for x in C if x['cat'] == c]
    md += ['', f'## {c.capitalize()} ({len(items)})', '', '| component | ep | file | props |', '|---|---|---|---|']
    md += [f"| {x['name']} | {x['ep']} | `{x['file']}:{x['line']}` | {x['props'][:110].replace('|', '/')} |" for x in items]
md += ['', f"## SFX ({len(catalog['sfx'])})", '', '| name | sec | loop | prompt |', '|---|---|---|---|']
md += [f"| {s['name']} | {s['dur']} | {'yes' if s['loop'] else ''} | {(s['note'] or s['prompt'])[:120]} |" for s in catalog['sfx']]
open(f'{L}/LIBRARY.md', 'w').write('\n'.join(md) + '\n')
print(json.dumps({'episodes': len(catalog['episodes']), 'components': len(C), 'by_cat': {c: sum(x['cat'] == c for x in C) for c in cats}, 'sfx': len(catalog['sfx'])}))

# gallery page (published as an artifact; catalog inlined so it renders complete at rest)
slim = json.loads(json.dumps(catalog))
for c in slim['components']: c.pop('imports', None)
page = open(f'{H}/gallery_template.html').read().replace('__CATALOG__', json.dumps(slim, separators=(',', ':')).replace('</', '<\\/'))
open(f'{L}/index.html', 'w').write(page)
