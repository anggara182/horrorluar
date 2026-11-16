import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H, rng } from '../art/world';

/** Set "farm" (mountain summer farm: turf-roof cabin, goats, fence, the path down the mountain). Static bands baked ONCE to public/baked/farm/<band>.png. Ids "farm/<band>". */
export const FP = {
  skyTop: '#9c8fb3', skyMid: '#d8b8a8', skyLow: '#f3d9a4', sun: '#fff4d6',
  mtnFar: '#a796b4', mtnNear: '#7c6f8e', pine: '#16241c', pineFar: '#3a4a46',
  meadow: '#5d6b3c', meadowDark: '#33402a', rock: '#4b5b3e', path: '#b39a72',
  cabin: '#4a3626', cabinDark: '#2e2118', turf: '#6b7a3a', window: '#ffd98a', ink: '#0e1510',
};
export const CABIN = { x: 430, y: 1265 }; // base centre of cabin front
export const PINE_EDGE = 930;

const Pine: React.FC<{ x: number; y: number; h: number; c: string; w?: number }> = ({ x, y, h, c, w = 0.34 }) => {
  const tiers = 5, hw = h * w;
  const pts: string[] = [];
  for (let i = 0; i < tiers; i++) {
    const ty = y - h + (h * 0.9 * i) / tiers, by = y - h + (h * 0.9 * (i + 1.4)) / tiers;
    const ww = hw * (0.35 + (0.65 * (i + 1)) / tiers);
    pts.push(`M${x},${ty} L${x + ww},${by} L${x - ww},${by} Z`);
  }
  return <g fill={c}><path d={pts.join(' ')} /><rect x={x - h * 0.02} y={y - h * 0.12} width={h * 0.04} height={h * 0.12} /></g>;
};

const Sky = () => (
  <g>
    <defs>
      <linearGradient id="fsky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={FP.skyTop} /><stop offset="0.3" stopColor={FP.skyMid} /><stop offset="0.48" stopColor={FP.skyLow} /><stop offset="1" stopColor={FP.skyLow} />
      </linearGradient>
      <radialGradient id="fsun"><stop offset="0" stopColor="#fff8e4" stopOpacity="1" /><stop offset="0.25" stopColor="#ffe6b0" stopOpacity="0.7" /><stop offset="1" stopColor="#f3d9a4" stopOpacity="0" /></radialGradient>
      <linearGradient id="fmtn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={FP.mtnFar} /><stop offset="1" stopColor="#c9b0aa" /></linearGradient>
    </defs>
    <rect width={W} height={H} fill="url(#fsky)" />
    <circle cx={880} cy={930} r={420} fill="url(#fsun)" />
    <circle cx={880} cy={930} r={46} fill={FP.sun} />
    <path d={`M0,1020 L140,900 L260,960 L400,820 L520,930 L640,880 L760,990 L900,960 L1040,860 L1180,940 L1296,900 L1296,1300 L0,1300 Z`} fill="url(#fmtn)" />
    <path d={`M0,1080 L180,990 L330,1050 L470,980 L620,1060 L800,1030 L1000,1080 L1150,1020 L1296,1060 L1296,1300 L0,1300 Z`} fill={FP.mtnNear} opacity={0.85} />
    <path d="M560,1095 Q760,1080 960,1100 Q760,1112 560,1095 Z" fill="#fff0c8" opacity={0.75} />
  </g>
);

const Mid = () => {
  const r = rng(22);
  const far = Array.from({ length: 14 }, (_, i) => ({ x: 20 + i * 92 + r() * 40, h: 120 + r() * 70 }));
  const edge = Array.from({ length: 9 }, (_, i) => ({ x: PINE_EDGE + i * 48 + r() * 30, h: 380 + r() * 260, y: 1360 + r() * 60 - i * 6 }));
  const cx = CABIN.x, cy = CABIN.y;
  return (
    <g>
      <defs>
        <linearGradient id="fmead" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8a8a4a" /><stop offset="0.25" stopColor={FP.meadow} /><stop offset="1" stopColor={FP.meadowDark} /></linearGradient>
        <linearGradient id="fpath" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e3c58e" /><stop offset="1" stopColor="#7d6a4e" /></linearGradient>
      </defs>
      {far.map((t, i) => <Pine key={i} x={t.x} y={1150} h={t.h} c={FP.pineFar} />)}
      {/* meadow slope: higher on the left, falling toward lower right */}
      <path d="M0,1130 C300,1120 600,1170 900,1230 C1080,1270 1200,1300 1296,1320 L1296,2304 L0,2304 Z" fill="url(#fmead)" />
      {/* path winding down */}
      <path d="M520,1290 C600,1340 560,1400 680,1460 C820,1530 760,1620 900,1700 C1000,1760 960,1900 1080,2304 L1180,2304 C1060,1900 1100,1760 960,1690 C830,1620 890,1520 740,1450 C620,1395 650,1335 548,1288 Z" fill="url(#fpath)" opacity={0.85} />
      {/* rocks */}
      <ellipse cx={230} cy={1420} rx={70} ry={34} fill={FP.rock} /><ellipse cx={260} cy={1408} rx={40} ry={18} fill="#6b7a56" />
      <ellipse cx={760} cy={1340} rx={44} ry={20} fill={FP.rock} />
      {/* fence */}
      <g stroke="#3a2a1e" strokeWidth={7} strokeLinecap="round">
        {Array.from({ length: 9 }, (_, i) => { const x = 60 + i * 64, y = 1360 + i * 6; return <line key={i} x1={x} y1={y} x2={x} y2={y - 70} />; })}
        <path d="M60,1310 L572,1358" fill="none" /><path d="M60,1335 L572,1383" fill="none" strokeWidth={5} />
      </g>
      {/* cabin: log walls, turf roof */}
      <g>
        <rect x={cx - 170} y={cy - 150} width={340} height={150} fill={FP.cabin} />
        {Array.from({ length: 5 }, (_, i) => <line key={i} x1={cx - 170} x2={cx + 170} y1={cy - 120 + i * 28} y2={cy - 120 + i * 28} stroke={FP.cabinDark} strokeWidth={5} />)}
        <path d={`M${cx - 205},${cy - 140} L${cx},${cy - 280} L${cx + 205},${cy - 140} Z`} fill={FP.cabinDark} />
        <path d={`M${cx - 215},${cy - 138} L${cx},${cy - 292} L${cx + 215},${cy - 138} L${cx + 200},${cy - 128} L${cx},${cy - 270} L${cx - 200},${cy - 128} Z`} fill={FP.turf} />
        <path d={`M${cx - 30},${cy - 292} L${cx},${cy - 300} L${cx + 30},${cy - 284}`} stroke="#9aa858" strokeWidth={8} fill="none" />
        <path d={`M${cx},${cy - 292} L${cx + 215},${cy - 138}`} stroke="#ffd98a" strokeWidth={4} opacity={0.8} />
        <rect x={cx - 120} y={cy - 105} width={60} height={50} fill={FP.window} />
        <rect x={cx + 40} y={cy - 115} width={60} height={115} fill={FP.ink} />
        <rect x={cx + 120} y={cy - 360} width={26} height={90} fill={FP.cabinDark} />
      </g>
      {/* forest edge on the right */}
      {edge.map((t, i) => <Pine key={`e${i}`} x={t.x} y={t.y} h={t.h} c={i % 2 ? FP.pine : '#1d2e24'} />)}
      <rect x={PINE_EDGE + 10} y={1300} width={400} height={1004} fill={FP.pine} />
    </g>
  );
};

const Fg = () => {
  const r = rng(7);
  const blades = Array.from({ length: 60 }, (_, i) => { const x = i * 22 + r() * 14; const h = 60 + r() * 120; return `M${x - 8},2304 Q${x + r() * 30 - 15},${2304 - h * 1.4 - 300} ${x + 6},2304 Z`; });
  return (
    <g fill={FP.ink}>
      <path d="M0,2000 C300,1960 700,2040 1296,1990 L1296,2304 L0,2304 Z" />
      <path d={blades.join(' ')} transform="translate(0,-170)" />
      <Pine x={60} y={2100} h={1350} c={FP.ink} w={0.3} />
    </g>
  );
};

export const FARM: Record<string, BandSpec> = {
  'farm/sky': { node: () => <Sky /> },
  'farm/mid': { node: () => <Mid /> },
  'farm/fg': { blur: 4, node: () => <Fg /> },
};
