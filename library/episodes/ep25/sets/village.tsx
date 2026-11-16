import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H, rng } from '../art/world';

/** Set "village" (homestead at night and dawn: rondavels, yard, starry sky, the city at the end). Static bands baked ONCE to public/baked/village/<band>.png. Ids "village/<band>". */

export const VC = {
  sky0: '#060b16', sky1: '#0d1626', sky2: '#1b2a45', skyLow: '#2d3d5c',
  thatch: '#5a4a33', thatchN: '#2a241b', thatchD: '#15120e',
  wallN: '#4a4f63', wallD: '#2b2f3d', ink: '#07090a', yard: '#1a1814', yardD: '#0e0d0b',
  candle: '#ffc76b', accent: '#7cc6fe',
};
export const GROUND = 1460; // hut bases, world y (frame y 1268 = 66%)
export const HUT_WIN = { x: 560, y: 1352 }; // glowing window of the main hut

const Stars: React.FC<{ seed: number; n: number; y1: number }> = ({ seed, n, y1 }) => {
  const r = rng(seed);
  return <g>{Array.from({ length: n }, (_, i) => {
    const x = r() * W, y = r() * y1 * (0.35 + 0.65 * r()), s = r();
    return <circle key={i} cx={x} cy={y} r={s > 0.96 ? 3.2 : s > 0.8 ? 2 : 1.1} fill="#e8f0ff" opacity={0.35 + 0.6 * r()} />;
  })}</g>;
};

/** Rondavel: round hut, cylindrical wall + conical thatch. x = centre, b = base y. */
export const Rondavel: React.FC<{ x: number; b: number; w: number; h: number; roof: number; wall?: string; wallD?: string; thatch?: string; thatchD?: string; win?: boolean; door?: boolean }> = ({ x, b, w, h, roof, wall = VC.wallN, wallD = VC.wallD, thatch = VC.thatchN, thatchD = VC.thatchD, win, door }) => {
  const id = `rd${Math.round(x)}${Math.round(b)}`;
  const top = b - h, ov = w * 0.1;
  return <g>
    <defs>
      <linearGradient id={`${id}w`} x1="0" x2="1"><stop offset="0" stopColor={wallD} /><stop offset="0.45" stopColor={wall} /><stop offset="1" stopColor={wallD} /></linearGradient>
      <linearGradient id={`${id}t`} x1="0" x2="1"><stop offset="0" stopColor={thatchD} /><stop offset="0.4" stopColor={thatch} /><stop offset="1" stopColor={thatchD} /></linearGradient>
    </defs>
    <path d={`M${x - w / 2} ${top} L${x - w / 2} ${b} Q${x} ${b + w * 0.09} ${x + w / 2} ${b} L${x + w / 2} ${top} Z`} fill={`url(#${id}w)`} />
    {door && <path d={`M${x + w * 0.08} ${b + w * 0.04} L${x + w * 0.08} ${b - h * 0.62} Q${x + w * 0.17} ${b - h * 0.7} ${x + w * 0.26} ${b - h * 0.62} L${x + w * 0.26} ${b + w * 0.03} Z`} fill="#0b0c10" />}
    {win && <rect x={HUT_WIN.x - 26} y={HUT_WIN.y - 34} width={52} height={62} rx={6} fill="#120c06" />}
    <path d={`M${x - w / 2 - ov} ${top + 14} L${x - 6} ${top - roof} L${x + 6} ${top - roof} L${x + w / 2 + ov} ${top + 14} Q${x} ${top + 14 + w * 0.12} ${x - w / 2 - ov} ${top + 14} Z`} fill={`url(#${id}t)`} />
    <path d={`M${x - 6} ${top - roof} L${x} ${top - roof - 26} L${x + 6} ${top - roof}`} fill={thatchD} />
  </g>;
};

const Acacia: React.FC<{ x: number; b: number; s: number; fill?: string }> = ({ x, b, s, fill = VC.ink }) => (
  <g transform={`translate(${x} ${b}) scale(${s})`} fill={fill}>
    <path d="M-8 0 L-6 -150 Q-40 -210 -110 -240 L-104 -248 Q-30 -222 0 -180 Q20 -230 90 -262 L96 -254 Q30 -215 10 -150 L12 0 Z" />
    <path d="M-250 -250 Q-200 -300 -60 -300 Q60 -320 200 -290 Q270 -270 250 -240 Q120 -228 0 -236 Q-150 -226 -250 -250 Z" />
    <path d="M-170 -292 Q-90 -330 20 -322 Q120 -330 170 -300 Q60 -296 -170 -292 Z" />
  </g>
);

const Aloe: React.FC<{ x: number; b: number; s: number; fill?: string }> = ({ x, b, s, fill = VC.ink }) => (
  <g transform={`translate(${x} ${b}) scale(${s})`} fill={fill}>
    {[-70, -45, -22, 0, 22, 45, 70].map((a, i) => <path key={i} transform={`rotate(${a})`} d={`M-9 0 Q-6 ${-90 - (i % 2) * 30} 0 ${-150 - (i % 3) * 25} Q6 ${-90 - (i % 2) * 30} 9 0 Z`} />)}
    <path d="M-3 -40 L-2 -260 L2 -260 L3 -40 Z" />
    <path d="M-7 -260 Q0 -310 7 -260 Z" />
  </g>
);

export const VILLAGE: Record<string, BandSpec> = {
  /** night sky: gradient + stars + moon glow */
  'village/sky': {
    node: () => <g>
      <defs>
        <linearGradient id="vsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={VC.sky0} /><stop offset="0.35" stopColor={VC.sky1} /><stop offset="0.58" stopColor={VC.sky2} /><stop offset="0.66" stopColor={VC.skyLow} /><stop offset="1" stopColor={VC.skyLow} />
        </linearGradient>
        <radialGradient id="vmoon"><stop offset="0" stopColor="#cfe2ff" stopOpacity="0.45" /><stop offset="1" stopColor="#cfe2ff" stopOpacity="0" /></radialGradient>
        <linearGradient id="vmw" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3a5683" stopOpacity="0" /><stop offset="0.5" stopColor="#6d86b5" stopOpacity="0.1" /><stop offset="1" stopColor="#3a5683" stopOpacity="0" /></linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#vsky)" />
      <path d={`M-100 900 Q500 420 ${W + 100} 120 L${W + 100} 330 Q560 620 -100 1080 Z`} fill="url(#vmw)" />
      <Stars seed={7} n={260} y1={1300} />
      <circle cx={960} cy={560} r={260} fill="url(#vmoon)" />
      <circle cx={960} cy={560} r={46} fill="#eef3ff" />
      <circle cx={978} cy={548} r={44} fill="#c9d6ef" opacity={0.25} />
    </g>,
  },
  /** homestead: distant hills, three rondavels, yard */
  'village/huts': {
    node: () => <g>
      <defs>
        <linearGradient id="vyard" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a2a2c" /><stop offset="0.25" stopColor={VC.yard} /><stop offset="1" stopColor={VC.yardD} /></linearGradient>
        <linearGradient id="vhill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1a2235" /><stop offset="1" stopColor="#10141e" /></linearGradient>
      </defs>
      <path d={`M0 1300 Q200 1230 420 1270 Q700 1200 940 1260 Q1120 1230 ${W} 1270 L${W} 1500 L0 1500 Z`} fill="url(#vhill)" />
      <Acacia x={1080} b={1330} s={0.55} fill="#0c1018" />
      <rect y={1420} width={W} height={H - 1420} fill="url(#vyard)" />
      <path d={`M0 1440 Q600 1400 ${W} 1435 L${W} 1460 Q600 1430 0 1470 Z`} fill="#33302b" opacity={0.6} />
      <Rondavel x={210} b={GROUND - 10} w={230} h={140} roof={150} />
      <Rondavel x={960} b={GROUND - 20} w={260} h={150} roof={165} door />
      <Rondavel x={560} b={GROUND + 10} w={380} h={210} roof={230} win door={false} />
    </g>,
  },
  /** foreground framing: acacia + aloes, dark ground lip */
  'village/fg': {
    blur: 3,
    node: () => <g>
      <Acacia x={1240} b={1900} s={1.5} />
      <Aloe x={70} b={1800} s={1.6} />
      <Aloe x={330} b={1880} s={0.9} />
      <path d={`M0 1760 Q300 1700 700 1770 Q1000 1820 ${W} 1760 L${W} ${H} L0 ${H} Z`} fill={VC.ink} />
    </g>,
  },
  /** the city: cold sky, skyline, apartment block with a dark window grid */
  'village/city': {
    node: () => {
      const r = rng(31);
      const sky = <g>
        <defs>
          <linearGradient id="vcs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#05080f" /><stop offset="0.55" stopColor="#0f1a2c" /><stop offset="0.8" stopColor="#1f3550" /><stop offset="1" stopColor="#13202f" /></linearGradient>
          <linearGradient id="vblk" x1="0" x2="1"><stop offset="0" stopColor="#1c2433" /><stop offset="0.6" stopColor="#252f42" /><stop offset="1" stopColor="#141a25" /></linearGradient>
        </defs>
        <rect width={W} height={H} fill="url(#vcs)" />
        <Stars seed={3} n={40} y1={900} />
      </g>;
      const sky2 = Array.from({ length: 14 }, (_, i) => {
        const x = i * 100 - 30 + r() * 30, w = 70 + r() * 60, h = 300 + r() * 500;
        return <g key={i}>
          <rect x={x} y={1700 - h} width={w} height={h + 700} fill="#0b111c" />
          {r() > 0.4 && <rect x={x + w * 0.3} y={1700 - h + 40 + r() * 100} width={8} height={10} fill="#e0b56a" opacity={0.6} />}
        </g>;
      });
      const bx = 280, by = 520, bw = 760, rows = 9, cols = 5;
      const grid = [];
      for (let ry = 0; ry < rows; ry++) for (let c = 0; c < cols; c++) {
        const x = bx + 50 + c * 140, y = by + 70 + ry * 170;
        grid.push(<rect key={`${ry}-${c}`} x={x} y={y} width={100} height={110} fill="#0d121b" />);
        grid.push(<rect key={`b${ry}-${c}`} x={x - 6} y={y + 112} width={112} height={10} fill="#33405a" />);
      }
      return <g>
        {sky}{sky2}
        <rect x={bx} y={by} width={bw} height={H - by} fill="url(#vblk)" />
        <rect x={bx - 14} y={by - 24} width={bw + 28} height={30} fill="#10151f" />
        <rect x={bx} y={by} width={6} height={H - by} fill="#4d6a96" opacity={0.5} />
        {grid}
        <rect y={2050} width={W} height={260} fill="#06080c" />
      </g>;
    },
  },
};
