// Micro-expressions: Kamu's eyes/brows/mouth redrawn every frame from a few parameters.
// Everything is deterministic in time (seeded), so a re-render of the same frame gives the same face.
import { rng } from '../look2/sets2';

export type FaceP = {
  blink: number;            // 0 open .. 1 closed
  look: [number, number];   // pupil offset, -1..1 (x right, y down)
  wide: number;             // 0..1 eyes widen + pupils shrink
  brow: number;             // -1 knit/down .. 1 raised
  worry: number;            // 0..1 inner brow ends up
  mouth: number;            // 0 closed/tight .. 1 open
  tight: number;            // 0..1 lips pressed
};

export type FaceView = {
  kind: 'front' | 'side';
  /** canvas px per sprite px */
  k: number;
  /** region origin in sprite px (top-left) and size */
  x0: number; y0: number; w: number; h: number;
  eyes: [number, number][]; eyeS: number;     // eye centres (sprite px) and size scale (1 = rx 30)
  brows?: { a: [number, number]; b: [number, number] }[]; browW: number;
  mouth: [number, number]; mouthS: number;
  skin: string;
};

const ease = (u: number) => u * u * (3 - 2 * u);

/** Seeded schedules shared by every view of Kamu (so the face stays continuous across cuts). */
const R = rng(424242);
const BLINKS: number[] = []; for (let t = 0.6; t < 90; t += 1.9 + R() * 2.1) BLINKS.push(t);
const SACC: { t: number; d: [number, number] }[] = []; for (let t = 0; t < 90; t += 0.55 + R() * 0.9) SACC.push({ t, d: [(R() - 0.5) * 0.5, (R() - 0.5) * 0.35] });
const SWALLOW: number[] = []; for (let t = 4; t < 90; t += 5 + R() * 4) SWALLOW.push(t);

export const blinkAt = (gt: number) => {
  for (const b of BLINKS) { const u = (gt - b) / 0.16; if (u >= 0 && u <= 1) return u < 0.4 ? ease(u / 0.4) : 1 - ease((u - 0.4) / 0.6); }
  return 0;
};
const saccadeAt = (gt: number): [number, number] => {
  let i = 0; while (i + 1 < SACC.length && SACC[i + 1].t <= gt) i++;
  const cur = SACC[i], prev = SACC[Math.max(0, i - 1)]; const u = Math.min(1, (gt - cur.t) / 0.06);
  return [prev.d[0] + (cur.d[0] - prev.d[0]) * u, prev.d[1] + (cur.d[1] - prev.d[1]) * u];
};
/** Small head motion: breathing + an occasional swallow dip (metres). */
export const headBobAt = (gt: number) => {
  let y = Math.sin(gt * 2 * Math.PI / 3.4) * 0.0025;
  for (const s of SWALLOW) { const u = (gt - s) / 0.5; if (u >= 0 && u <= 1) y -= Math.sin(u * Math.PI) * 0.004; }
  return y;
};

/** bump(t0) → 0..1 envelope rising fast, decaying over `dur`. */
const bump = (gt: number, t0: number, dur = 0.7) => { const u = (gt - t0) / dur; return u < 0 || u > 1 ? 0 : u < 0.15 ? ease(u / 0.15) : 1 - ease((u - 0.15) / 0.85); };

export type Beat = { t: number; kind: 'brow' | 'scare' | 'part' };
/** Scary windows [start, end]: eyes wide, pupils small, mouth open. */
export type Mood = { base: 'worried' | 'scared'; look: [number, number]; beats: Beat[]; scary: [number, number][] };

export const faceAt = (gt: number, m: Mood): FaceP => {
  const sc = m.base === 'scared';
  let wide = sc ? 0.55 : 0, brow = sc ? 0.45 : 0.1, mouth = sc ? 0.45 : 0.05, tight = sc ? 0 : 0.55;
  for (const [a, b] of m.scary) if (gt >= a && gt <= b) { const k = Math.min(1, (gt - a) / 0.12) * Math.min(1, (b - gt) / 0.3 + 0.4); wide = Math.max(wide, k); brow = Math.max(brow, 0.7 * k); mouth = Math.max(mouth, 0.7 * k); tight = 0; }
  for (const bt of m.beats) {
    const e = bump(gt, bt.t, bt.kind === 'scare' ? 1.0 : 0.7);
    if (bt.kind === 'brow') { brow += 0.5 * e; wide += 0.25 * e; }
    if (bt.kind === 'scare') { wide += e; brow += 0.6 * e; mouth += 0.5 * e; tight -= e; }
    if (bt.kind === 'part') { mouth += 0.3 * e; tight -= 0.5 * e; }
  }
  const s = saccadeAt(gt);
  const blink = wide > 0.8 ? blinkAt(gt) * 0.3 : blinkAt(gt);   // a scared stare hardly blinks
  return { blink, look: [m.look[0] + s[0] * (1 - wide * 0.6), m.look[1] + s[1] * (1 - wide * 0.6)], wide: Math.min(1, wide), brow: Math.max(-1, Math.min(1, brow)), worry: sc ? 0.8 : 0.6, mouth: Math.max(0, Math.min(1, mouth)), tight: Math.max(0, Math.min(1, tight)) };
};

// ---------- drawing ----------
const INK = '#1a1010';
export const drawFace = (g: CanvasRenderingContext2D, v: FaceView, p: FaceP) => {
  const W = g.canvas.width, H = g.canvas.height; g.clearRect(0, 0, W, H);
  const X = (x: number) => (x - v.x0) * v.k, Y = (y: number) => (y - v.y0) * v.k, S = v.k;
  g.lineCap = 'round'; g.lineJoin = 'round';
  const side = v.kind === 'side';
  for (const [ex, ey] of v.eyes) {
    const rx = (side ? 17 : 30) * v.eyeS * S * (1 + p.wide * 0.08), ry = (side ? 21 : 34) * v.eyeS * S * (1 + p.wide * 0.22);
    const cx = X(ex), cy = Y(ey);
    if (p.blink > 0.85) {
      g.strokeStyle = INK; g.lineWidth = 5 * v.eyeS * S; g.beginPath(); g.moveTo(cx - rx, cy + ry * 0.15); g.quadraticCurveTo(cx, cy + ry * 0.55, cx + rx, cy + ry * 0.15); g.stroke();
      continue;
    }
    g.save(); g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); g.clip();
    g.fillStyle = '#fbf7f2'; g.fillRect(cx - rx, cy - ry, rx * 2, ry * 2);
    const pr = (side ? 9 : 14) * v.eyeS * S * (1 - p.wide * 0.4);
    const px = cx + p.look[0] * rx * 0.45 + (side ? rx * 0.25 : 0), py = cy + p.look[1] * ry * 0.4 + ry * 0.12;
    g.fillStyle = INK; g.beginPath(); g.arc(px, py, pr, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#fff'; g.beginPath(); g.arc(px - pr * 0.35, py - pr * 0.4, Math.max(1.5, pr * 0.32), 0, Math.PI * 2); g.fill();
    // upper lid: rests a little lower when tense/tired, drops fully on a blink
    const lid = Math.max(p.blink, 0.12 * (1 - p.wide));
    if (lid > 0.01) { g.fillStyle = v.skin; g.fillRect(cx - rx, cy - ry, rx * 2, ry * 2 * lid); g.strokeStyle = '#3a1f14'; g.lineWidth = 3 * S; g.beginPath(); g.moveTo(cx - rx, cy - ry + ry * 2 * lid); g.lineTo(cx + rx, cy - ry + ry * 2 * lid); g.stroke(); }
    g.restore();
    g.strokeStyle = INK; g.lineWidth = (side ? 4 : 6) * v.eyeS * S; g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); g.stroke();
  }
  if (v.brows) for (const br of v.brows) {
    const up = -p.brow * 10 * v.eyeS * S;
    const inner = br.a, outer = br.b; // inner end first
    const iw = -p.worry * 8 * v.eyeS * S + (p.brow < 0 ? -p.brow * 6 * S : 0);
    g.strokeStyle = '#2a170f'; g.lineWidth = v.browW * S;
    g.beginPath(); g.moveTo(X(inner[0]), Y(inner[1]) + up + iw); g.quadraticCurveTo((X(inner[0]) + X(outer[0])) / 2, Math.min(Y(inner[1]), Y(outer[1])) + up - 4 * S, X(outer[0]), Y(outer[1]) + up); g.stroke();
  }
  // mouth
  const mx = X(v.mouth[0]), my = Y(v.mouth[1]), ms = v.mouthS * S;
  if (p.mouth > 0.3) {
    const oh = (10 + 34 * p.mouth) * ms, ow = (side ? 12 : 22 + 10 * p.mouth) * ms;
    g.fillStyle = '#3a1712'; g.beginPath(); g.ellipse(mx, my, ow, oh / 2, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#7a2a22'; g.beginPath(); g.ellipse(mx, my + oh * 0.18, ow * 0.6, oh * 0.22, 0, 0, Math.PI * 2); g.fill();
  } else {
    const w = (side ? 14 : 34) * ms * (1 - p.tight * 0.2), wav = (1 - p.tight) * 6 * ms;
    g.strokeStyle = '#3a1712'; g.lineWidth = (side ? 5 : 9) * ms;
    g.beginPath(); g.moveTo(mx - w, my); g.quadraticCurveTo(mx - w / 2, my - wav, mx, my + p.mouth * 6 * ms); g.quadraticCurveTo(mx + w / 2, my + wav, mx + w, my - 2 * ms); g.stroke();
  }
};

// ---------- view configs (sprite px; see svg.ts / svg2.ts) ----------
export const VIEW_SIDE: FaceView = { kind: 'side', k: 2.2, x0: 470, y0: 432, w: 120, h: 130, eyes: [[522, 472]], eyeS: 1, brows: [{ a: [548, 446], b: [498, 438] }], browW: 8, mouth: [542, 528], mouthS: 0.55, skin: '#a86f4b' };
export const VIEW_STAND: FaceView = { kind: 'front', k: 2, x0: 270, y0: 280, w: 180, h: 170, eyes: [[318, 348], [404, 348]], eyeS: 0.8, brows: [{ a: [340, 308], b: [290, 300] }, { a: [374, 308], b: [424, 300] }], browW: 9, mouth: [358, 428], mouthS: 0.8, skin: '#b07450' };
export const VIEW_CU: FaceView = { kind: 'front', k: 1.1, x0: 300, y0: 405, w: 420, h: 420, eyes: [[410, 560], [600, 560]], eyeS: 1.6, brows: [{ a: [454, 458], b: [342, 462] }, { a: [552, 458], b: [662, 462] }], browW: 18, mouth: [510, 744], mouthS: 1.5, skin: '#b07450' };
export const VIEW_PEEK: FaceView = { kind: 'front', k: 2, x0: 690, y0: 444, w: 150, h: 112, eyes: [[730, 474], [800, 474]], eyeS: 0.75, mouth: [768, 530], mouthS: 0.7, skin: '#b07450' };
