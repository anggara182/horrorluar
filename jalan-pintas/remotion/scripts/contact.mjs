// One still per shot (at 60% of the shot) -> out/contact/*.png + out/contact-sheet.jpg. usage: node scripts/contact.mjs [ep01] [scale]
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import fs from 'node:fs'; import path from 'node:path'; import { execFileSync } from 'node:child_process';
const ep = process.argv[2] || 'ep01'; const scale = Number(process.argv[3] || 0.5);
const shots = JSON.parse(fs.readFileSync(`../${ep}/shots.json`, 'utf8')).shots;
const only = process.env.ONLY ? process.env.ONLY.split(',') : null;
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
const shell = '/opt/pw-browsers/chromium_headless_shell';
const opts = { serveUrl, chromiumOptions: { gl: 'swangle' }, browserExecutable: fs.existsSync(shell) ? shell : undefined };
const comp = await selectComposition({ ...opts, id: ep.toUpperCase() });
fs.mkdirSync('out/contact', { recursive: true });
for (const s of shots) {
  if (only && !only.includes(s.id)) continue;
  const t = s.start + (s.end - s.start) * (Number(process.env.AT || 0.6));
  const frame = Math.min(comp.durationInFrames - 1, Math.round(t * comp.fps));
  await renderStill({ ...opts, composition: comp, frame, output: `out/contact/${s.id}.png`, imageFormat: 'png', scale });
  console.log(s.id, frame);
}
const files = shots.map((s) => `out/contact/${s.id}.png`).filter((f) => fs.existsSync(f));
const args = []; files.forEach((f) => args.push('-i', f));
const n = files.length, cols = 7, rows = Math.ceil(n / cols);
const lay = files.map((_, i) => `${(i % cols)}*w0_${Math.floor(i / cols)}*h0`.replace('*w0_', '*w0|').replace(/^(\d+)\*w0\|(\d+)\*h0$/, (m, a, b) => `${a === '0' ? '0' : Array(Number(a)).fill('w0').join('+')}_${b === '0' ? '0' : Array(Number(b)).fill('h0').join('+')}`)).join('|');
execFileSync('ffmpeg', ['-v', 'error', '-y', ...args, '-filter_complex', `${files.map((_, i) => `[${i}]scale=270:480,drawtext=text='${shots[i].id}':x=8:y=8:fontsize=22:fontcolor=white:box=1:boxcolor=black@0.6[v${i}]`).join(';')};${files.map((_, i) => `[v${i}]`).join('')}xstack=inputs=${n}:layout=${lay}:fill=black`, '-q:v', '3', 'out/contact-sheet.jpg']);
console.log('sheet', n, 'shots', rows, 'rows');
