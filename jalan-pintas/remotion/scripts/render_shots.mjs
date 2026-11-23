// Render an episode shot by shot, re-rendering only shots whose spec (or the shared code) changed.
// usage: node scripts/render_shots.mjs ep01 [--force] [--only S05,S06]   env: CONC (default 2), SCALE (default 1)
// Output: ../<ep>/render/shots/<id>.mp4 + manifest.json. Concat + audio happens in tools/render.sh.
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import crypto from 'node:crypto'; import fs from 'node:fs'; import path from 'node:path';

const ep = process.argv[2] || 'ep01';
const force = process.argv.includes('--force');
const onlyArg = process.argv.indexOf('--only'); const only = onlyArg > 0 ? process.argv[onlyArg + 1].split(',') : null;
const conc = Number(process.env.CONC || 2); const scale = Number(process.env.SCALE || 1);
const outDir = path.resolve(`../${ep}/render/shots${scale !== 1 ? '-draft' : ''}`); fs.mkdirSync(outDir, { recursive: true });
const shotsData = JSON.parse(fs.readFileSync(`../${ep}/shots.json`, 'utf8'));
const compSrc = fs.readFileSync(`src/ep/${ep.toUpperCase()}.tsx`, 'utf8');

// global hash = every source file, with the per-shot SPECS lines blanked out (those are hashed per shot)
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const specLine = (id) => (compSrc.split('\n').find((l) => l.trimStart().startsWith(`${id}: {`)) ?? '');
const g = crypto.createHash('sha1');
for (const f of walk('src').sort()) g.update(f + fs.readFileSync(f, 'utf8').split('\n').filter((l) => !/^\s*S\d\d: \{/.test(l)).join('\n'));
g.update(fs.readFileSync(`../${ep}/vo_timing.json`)); g.update(String(scale));
const globalHash = g.digest('hex');

const manPath = path.join(outDir, 'manifest.json');
const man = fs.existsSync(manPath) ? JSON.parse(fs.readFileSync(manPath, 'utf8')) : {};
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
const shell = '/opt/pw-browsers/chromium_headless_shell';
const opts = { serveUrl, chromiumOptions: { gl: 'swangle' }, browserExecutable: fs.existsSync(shell) ? shell : undefined };
const comp = await selectComposition({ ...opts, id: ep.toUpperCase() });
const fps = comp.fps; const shots = shotsData.shots;
const f0 = (s) => Math.ceil(s.start * fps - 1e-6);

const t0 = Date.now(); let n = 0, frames = 0;
for (let i = 0; i < shots.length; i++) {
  const s = shots[i]; const a = f0(s); const b = i + 1 < shots.length ? f0(shots[i + 1]) - 1 : comp.durationInFrames - 1;
  const hash = crypto.createHash('sha1').update(globalHash + specLine(s.id) + JSON.stringify(s) + `${a}-${b}`).digest('hex');
  const out = path.join(outDir, `${s.id}.mp4`);
  const dirty = force || (only ? only.includes(s.id) : man[s.id]?.hash !== hash || !fs.existsSync(out));
  if (!dirty) continue;
  const ts = Date.now();
  await renderMedia({ ...opts, composition: comp, codec: 'h264', crf: 16, frameRange: [a, b], outputLocation: out, concurrency: conc, scale, logLevel: 'error' });
  const sec = (Date.now() - ts) / 1000; n++; frames += b - a + 1;
  man[s.id] = { hash, frames: [a, b], sec }; fs.writeFileSync(manPath, JSON.stringify(man, null, 1));
  console.log(`${s.id} frames ${a}-${b} (${b - a + 1}) ${sec.toFixed(1)}s  ${(sec / (b - a + 1)).toFixed(2)} s/frame`);
}
console.log(`rendered ${n} shots, ${frames} frames in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
fs.writeFileSync(path.join(outDir, 'list.txt'), shots.map((s) => `file '${s.id}.mp4'`).join('\n') + '\n');
