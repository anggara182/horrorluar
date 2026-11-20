import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H, rng } from '../art/world';

/** Set "fields" (rice paddies in summer heat and at dusk: the far white figure, the path, mountains). Static bands baked ONCE to public/baked/fields/<band>.png. Ids "fields/<band>". */

export const HZ = 905; // world horizon (frame y ~713)
export const PATH_X = 560; // vanishing point of the dirt path
export const FAR = { x: 860, y: HZ + 26 }; // far kunekune foot position
export const NEAR = { x: 820, y: HZ + 150 }; // nearer position (shot 12)
export const ROAD_Y = HZ + 8; // far road along the mountains' foot

const F = {
  skyTop: '#c9d6d2', sky: '#e9ecd8', skyLow: '#f4f1df',
  mtnFar: '#a7b6bd', mtn: '#7d93a3', mtnNear: '#62788a',
  tree: '#3f5a3a', g1: '#5f9a3c', g2: '#6fa947', g3: '#4c8231', g4: '#3a6a27', water: '#cfe0cf',
  path: '#b89f78', pathDark: '#8f7a5a', pole: '#2f2a24', ink: '#16200f',
};

/** perspective helper: depth t 0 (horizon) .. 1 (bottom) -> world y */
const yAt = (t: number) => HZ + (H - HZ) * Math.pow(t, 1.9);

const Sky = () => (
  <g>
    <defs>
      <linearGradient id="fSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={F.skyTop} /><stop offset="0.7" stopColor={F.sky} /><stop offset="1" stopColor={F.skyLow} />
      </linearGradient>
      <radialGradient id="fSun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffffff" stopOpacity="0.9" /><stop offset="1" stopColor="#fffbe8" stopOpacity="0" /></radialGradient>
    </defs>
    <rect x={0} y={0} width={W} height={HZ + 40} fill="url(#fSky)" />
    <ellipse cx={330} cy={360} rx={360} ry={360} fill="url(#fSun)" />
    <path d={`M0 ${HZ - 170} L180 ${HZ - 260} L330 ${HZ - 190} L520 ${HZ - 300} L700 ${HZ - 210} L900 ${HZ - 320} L1100 ${HZ - 220} L1296 ${HZ - 280} L1296 ${HZ + 10} L0 ${HZ + 10} Z`} fill={F.mtnFar} />
    <path d={`M0 ${HZ - 90} L140 ${HZ - 150} L300 ${HZ - 110} L460 ${HZ - 175} L640 ${HZ - 100} L820 ${HZ - 140} L1000 ${HZ - 95} L1180 ${HZ - 160} L1296 ${HZ - 120} L1296 ${HZ + 10} L0 ${HZ + 10} Z`} fill={F.mtn} />
    <path d={`M0 ${HZ - 30} Q200 ${HZ - 70} 380 ${HZ - 36} T760 ${HZ - 40} T1296 ${HZ - 46} L1296 ${HZ + 10} L0 ${HZ + 10} Z`} fill={F.mtnNear} opacity={0.9} />
    <path d={`M0 ${HZ - 8} Q60 ${HZ - 30} 120 ${HZ - 10} Q170 ${HZ - 26} 230 ${HZ - 6} L1000 ${HZ - 4} Q1060 ${HZ - 34} 1120 ${HZ - 12} Q1200 ${HZ - 40} 1296 ${HZ - 14} L1296 ${HZ + 12} L0 ${HZ + 12} Z`} fill={F.tree} />
  </g>
);

const Paddies = () => {
  const rows: React.ReactNode[] = [];
  const n = 18;
  for (let i = 0; i < n; i++) {
    const t0 = i / n, t1 = (i + 1) / n;
    const y0 = yAt(t0), y1 = yAt(t1);
    const fill = [F.g1, F.g2, F.g3, F.g1, F.g4][i % 5];
    rows.push(<rect key={`r${i}`} x={0} y={y0} width={W} height={y1 - y0 + 1} fill={fill} />);
    if (i % 3 === 1) rows.push(<rect key={`w${i}`} x={0} y={y1 - (y1 - y0) * 0.16} width={W} height={Math.max(1.5, (y1 - y0) * 0.1)} fill={F.water} opacity={0.5} />);
  }
  const lev: React.ReactNode[] = [];
  for (let k = -3; k <= 4; k += 1) {
    if (k % 2 === 0 && k !== 0) continue;
    if (k === 0) continue;
    const xb = PATH_X + k * 700;
    lev.push(<line key={`l${k}`} x1={PATH_X + k * 18} y1={HZ} x2={xb} y2={H} stroke={F.g4} strokeWidth={4} opacity={0.4} />);
  }
  const poles: React.ReactNode[] = [];
  const pts: [number, number][] = [];
  for (let j = 0; j < 7; j++) {
    const t = 0.08 + j * j * 0.022 + j * 0.03;
    if (t > 1) break;
    const y = yAt(t), x = PATH_X + 30 + t * 950, h = 30 + t * 1500, w = 2 + t * 26;
    pts.push([x, y - h]);
    poles.push(<g key={`p${j}`}><rect x={x - w / 2} y={y - h} width={w} height={h} fill={F.pole} /><rect x={x - w * 2.6} y={y - h + h * 0.06} width={w * 5.2} height={Math.max(1.5, w * 0.35)} fill={F.pole} /></g>);
  }
  const wires = pts.slice(1).map(([x, y], i) => {
    const [px, py] = pts[i];
    return <path key={`wi${i}`} d={`M${px} ${py + 6} Q${(px + x) / 2} ${(py + y) / 2 + 30 + i * 20} ${x} ${y + 6}`} stroke={F.pole} strokeWidth={1.5 + i * 0.6} fill="none" opacity={0.85} />;
  });
  return (
    <g>
      {rows}
      {lev}
      <path d={`M${PATH_X - 6} ${HZ} L${PATH_X + 6} ${HZ} L${PATH_X + 120} ${H} L${PATH_X - 300} ${H} Z`} fill={F.path} />
      <path d={`M${PATH_X - 6} ${HZ} L${PATH_X - 2} ${HZ} L${PATH_X - 230} ${H} L${PATH_X - 300} ${H} Z`} fill={F.pathDark} opacity={0.6} />
      <rect x={0} y={ROAD_Y - 3} width={W} height={7} fill={F.path} opacity={0.85} />
      {poles}{wires}
    </g>
  );
};

const Stalks: React.FC<{ seed: number; base: number; hMin: number; hMax: number; n: number; col: string; wMax: number }> = ({ seed, base, hMin, hMax, n, col, wMax }) => {
  const r = rng(seed);
  const out: React.ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const x = r() * W, h = hMin + r() * (hMax - hMin), lean = (r() - 0.5) * h * 0.35, w = 4 + r() * wMax;
    out.push(<path key={i} d={`M${x - w} ${base} Q${x + lean * 0.3} ${base - h * 0.6} ${x + lean} ${base - h} Q${x + lean * 0.4 + w * 0.3} ${base - h * 0.55} ${x + w} ${base} Z`} fill={col} />);
  }
  return <g>{out}</g>;
};

const Fg = () => (
  <g>
    <defs><linearGradient id="fFg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#24401a" stopOpacity="0" /><stop offset="0.4" stopColor="#1c3313" /><stop offset="1" stopColor="#0f1d0a" /></linearGradient></defs>
    <Stalks seed={3} base={H} hMin={300} hMax={760} n={60} col="#2a4a1d" wMax={14} />
    <Stalks seed={7} base={H} hMin={160} hMax={380} n={80} col="#16290f" wMax={18} />
    <rect x={0} y={H - 260} width={W} height={260} fill="url(#fFg)" />
  </g>
);

/** close rice stalks for the "no wind" shot: tall stems + drooping grain heads */
const Close = () => {
  const r = rng(11);
  const out: React.ReactNode[] = [];
  for (let i = 0; i < 30; i++) {
    const x = 40 + r() * (W - 80), top = 1150 + r() * 500, lean = (r() - 0.5) * 120, w = 9 + r() * 12;
    const dark = r() < 0.5;
    const col = dark ? '#1f3a15' : '#33602a';
    out.push(
      <g key={i}>
        <path d={`M${x - w} ${H} Q${x} ${(top + H) / 2} ${x + lean} ${top} L${x + lean + 3} ${top} Q${x + w * 0.4} ${(top + H) / 2} ${x + w} ${H} Z`} fill={col} />
        <path d={`M${x + lean} ${top} q${30 + r() * 30} ${-40} ${70 + r() * 40} ${50 + r() * 50}`} stroke={dark ? '#3c5a1f' : '#9aa64a'} strokeWidth={10} strokeLinecap="round" fill="none" />
        <path d={`M${x} ${top + 300} q${-90 - r() * 80} ${-120} ${-160 - r() * 100} ${-260}`} stroke={col} strokeWidth={14} strokeLinecap="round" fill="none" />
      </g>,
    );
  }
  return <g>{out}</g>;
};

export const FIELDS: Record<string, BandSpec> = {
  'fields/sky': { node: () => <Sky /> },
  'fields/paddies': { node: () => <Paddies /> },
  'fields/fg': { node: () => <Fg /> },
  'fields/close': { node: () => <Close /> },
};
