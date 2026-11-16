import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H, rng } from '../art/world';

/** woods palette */
export const WC = {
  skyTop: '#9c8fb3', skyMid: '#d9b9a6', skyLow: '#f3d9a4', sun: '#fff4d6',
  far: '#6f6f80', mid: '#2f3d33', pine: '#16241c', rock: '#4b5b3e', fern: '#22331f', ground: '#1c2a1d',
  hair: '#e8c873', hairD: '#b8954a', dress: '#d9d1bf', dressD: '#a59c88', skin: '#e6c3a0', skinD: '#b98f72',
  bark: '#3b2a1e', barkD: '#1e140d', rim: '#ffe2a0', sweater: '#5a3b2c', cap: '#2e3b4e', ink: '#0d1410',
};
export const GROUND = 1460;

/** one pine silhouette: trunk + stacked tiers */
export const pine = (x: number, base: number, h: number, w: number, fill: string, key: string | number) => {
  const tiers = 6, pts: string[] = [];
  for (let i = 0; i < tiers; i++) {
    const y0 = base - h * 0.12 - (h * 0.88 * i) / tiers;
    const ww = (w * (tiers - i)) / tiers;
    pts.push(`M ${x - ww / 2} ${y0} L ${x} ${y0 - ((h * 0.88) / tiers) * 1.7} L ${x + ww / 2} ${y0} Z`);
  }
  return <g key={key}><rect x={x - w * 0.04} y={base - h * 0.2} width={w * 0.08} height={h * 0.2 + 20} fill={fill} /><path d={pts.join(' ')} fill={fill} /></g>;
};

export const fern = (x: number, y: number, s: number, fill: string, key: string | number) => (
  <path key={key} fill={fill} d={`M ${x} ${y} Q ${x - 60 * s} ${y - 70 * s} ${x - 130 * s} ${y - 60 * s} Q ${x - 50 * s} ${y - 40 * s} ${x} ${y} Q ${x - 10 * s} ${y - 110 * s} ${x - 40 * s} ${y - 150 * s} Q ${x + 20 * s} ${y - 100 * s} ${x} ${y} Q ${x + 50 * s} ${y - 100 * s} ${x + 110 * s} ${y - 120 * s} Q ${x + 60 * s} ${y - 50 * s} ${x} ${y} Z`} />
);

/** Set "woods" (pine forest under the midnight sun). Ids "woods/<band>". */
export const WOODS: Record<string, BandSpec> = {
  'woods/sky': {
    node: () => (
      <g>
        <defs>
          <linearGradient id="wSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={WC.skyTop} /><stop offset="0.35" stopColor={WC.skyMid} /><stop offset="0.6" stopColor={WC.skyLow} /></linearGradient>
          <radialGradient id="wSun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={WC.sun} stopOpacity="1" /><stop offset="0.25" stopColor={WC.sun} stopOpacity="0.7" /><stop offset="1" stopColor={WC.skyLow} stopOpacity="0" /></radialGradient>
        </defs>
        <rect x={0} y={0} width={W} height={H} fill="url(#wSky)" />
        <circle cx={700} cy={1240} r={520} fill="url(#wSun)" />
        <path d={`M -50 1330 L 180 1150 L 360 1260 L 560 1080 L 820 1250 L 1020 1120 L 1350 1300 L 1350 1500 L -50 1500 Z`} fill="#b7a6b4" />
        <rect x={0} y={1330} width={W} height={60} fill="#f6e3b8" opacity={0.7} />
      </g>
    ),
  },
  'woods/far': {
    blur: 3,
    node: () => {
      const r = rng(7), out: React.ReactNode[] = [];
      for (let i = 0; i < 26; i++) { const x = -40 + i * 54 + r() * 30; if (x > 560 && x < 840 && r() < 0.85) continue; out.push(pine(x, 1420, 380 + r() * 260, 120 + r() * 40, '#7b7486', i)); }
      return <g>{out}<rect x={0} y={1400} width={W} height={H} fill="#5e5a5c" /></g>;
    },
  },
  'woods/mid': {
    node: () => {
      const r = rng(11), out: React.ReactNode[] = [];
      [40, 190, 330, 450, 960, 1090, 1240].forEach((x, i) => out.push(pine(x + r() * 30, GROUND + 20, 1000 + r() * 300, 300 + r() * 80, WC.mid, i)));
      return (
        <g>
          <defs><linearGradient id="wGr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4f5a3e" /><stop offset="0.25" stopColor={WC.ground} /><stop offset="1" stopColor="#0f1711" /></linearGradient></defs>
          {out}
          <path d={`M -20 ${GROUND - 10} Q 640 ${GROUND - 40} 1320 ${GROUND - 5} L 1320 ${H} L -20 ${H} Z`} fill="url(#wGr)" />
          <path d={`M 120 ${GROUND + 30} q 80 -90 200 -40 q 40 30 20 60 Z`} fill={WC.rock} />
          <path d={`M 960 ${GROUND + 40} q 70 -110 230 -50 q 30 40 0 70 Z`} fill={WC.rock} />
          {[...Array(14)].map((_, i) => fern(60 + i * 95 + r() * 40, GROUND + 140 + r() * 120, 0.9 + r() * 0.5, WC.fern, `f${i}`))}
        </g>
      );
    },
  },
  'woods/fg': {
    blur: 4,
    node: () => (
      <g>
        <rect x={40} y={0} width={150} height={H} fill={WC.ink} />
        <rect x={1150} y={0} width={130} height={H} fill={WC.ink} />
        <path d="M 190 300 L 420 360 L 190 420 Z M 190 700 L 470 770 L 190 830 Z" fill={WC.ink} />
        <path d="M 1150 520 L 900 600 L 1150 660 Z" fill={WC.ink} />
        {[...Array(9)].map((_, i) => fern(80 + i * 150, H - 120 + (i % 2) * 60, 2.4, WC.ink, i))}
      </g>
    ),
  },
};
