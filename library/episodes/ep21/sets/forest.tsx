import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H, rng } from '../art/world';
import { P } from '../art/forest_art';

/** Set "forest" (snowy birch forest at night and dawn, the hut on chicken legs outside, the village far away). Static bands baked ONCE to public/baked/forest/<band>.png. Ids "forest/<band>". */
const spruce = (x: number, base: number, h: number, w: number, fill: string, key: string | number) => {
  const tiers = 5; let d = `M${x} ${base - h}`;
  for (let i = 1; i <= tiers; i++) { const y = base - h + (h * i) / tiers, ww = (w * i) / tiers; d += ` L${x + ww / 2} ${y} L${x + ww / 5} ${y - h / tiers * 0.25}`; }
  for (let i = tiers; i >= 1; i--) { const y = base - h + (h * i) / tiers, ww = (w * i) / tiers; d += ` L${x - ww / 5} ${y - h / tiers * 0.25} L${x - ww / 2} ${y}`; }
  return <path key={key} d={d + ' Z'} fill={fill} />;
};
const birch = (x: number, top: number, base: number, w: number, k: number, lit: number) => {
  const r = rng(k * 13 + 3);
  return (
    <g key={k}>
      <path d={`M${x - w / 2} ${base} L${x - w * 0.38} ${top} L${x + w * 0.38} ${top} L${x + w / 2} ${base} Z`} fill={P.birch} opacity={lit} />
      <path d={`M${x + w * 0.1} ${base} L${x + w * 0.18} ${top} L${x + w * 0.38} ${top} L${x + w / 2} ${base} Z`} fill="#7d8a99" opacity={lit} />
      {Array.from({ length: 6 }, (_, i) => { const y = top + (base - top) * (0.1 + r() * 0.85); return <rect key={i} x={x - w / 2 + r() * w * 0.3} y={y} width={w * (0.3 + r() * 0.4)} height={4 + r() * 6} fill="#1c2026" opacity={lit} />; })}
    </g>
  );
};

export const FOREST: Record<string, BandSpec> = {
  'forest/sky': {
    node: () => (
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
        <defs>
          <linearGradient id="fsky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#060a18" /><stop offset="0.35" stopColor="#14213d" /><stop offset="0.55" stopColor="#2c4366" /><stop offset="1" stopColor="#2c4366" />
          </linearGradient>
          <radialGradient id="fmoon"><stop offset="0" stopColor="#dfe8f5" stopOpacity={0.55} /><stop offset="1" stopColor="#dfe8f5" stopOpacity={0} /></radialGradient>
          <linearGradient id="fsnowfar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8fa3bd" /><stop offset="1" stopColor="#5d6f85" /></linearGradient>
        </defs>
        <rect width={W} height={H} fill="url(#fsky)" />
        <circle cx={880} cy={560} r={360} fill="url(#fmoon)" />
        <circle cx={880} cy={560} r={70} fill={P.moon} />
        {Array.from({ length: 16 }, (_, i) => spruce(i * 90 - 20 + (i % 3) * 20, 1300, 260 + ((i * 37) % 120), 120, '#1b2a40', i))}
        <rect x={0} y={1290} width={W} height={H - 1290} fill="url(#fsnowfar)" />
      </svg>
    ),
  },
  'forest/birch': {
    node: () => (
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
        <defs><linearGradient id="fsnow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a9bbd0" /><stop offset="0.4" stopColor={P.snow} /><stop offset="1" stopColor="#8fa2ba" /></linearGradient></defs>
        {[[150, 70, 1440], [310, 46, 1400], [1000, 52, 1410], [1150, 80, 1460], [470, 30, 1350], [860, 32, 1355]].map(([x, w, b], i) => birch(x, -50, b, w, i, i > 3 ? 0.55 : 0.9))}
        {spruce(560, 1340, 340, 170, '#13202e', 'a')}{spruce(760, 1350, 300, 150, '#13202e', 'b')}
        <path d={`M0 1380 Q300 1330 650 1370 Q980 1400 ${W} 1360 L${W} ${H} L0 ${H} Z`} fill="url(#fsnow)" />
        <path d={`M0 1700 Q400 1640 800 1690 Q1100 1720 ${W} 1680 L${W} ${H} L0 ${H} Z`} fill={P.snowSh} opacity={0.45} />
      </svg>
    ),
  },
  'forest/fg': {
    blur: 6,
    node: () => (
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
        {spruce(40, 2000, 1500, 520, P.spruce, 'l')}
        {spruce(1290, 2050, 1600, 560, P.spruce, 'r')}
        <path d={`M0 2000 Q300 1900 650 1960 Q1000 2010 ${W} 1930 L${W} ${H} L0 ${H} Z`} fill="#3d4c63" />
      </svg>
    ),
  },
};
