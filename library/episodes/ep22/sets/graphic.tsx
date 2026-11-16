import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H, rng } from '../art/world';

/** Set "graphic" (title, lore, CTA). Static bands baked ONCE to public/baked/graphic/<band>.png. Ids "graphic/<band>". */
const pine = (x: number, base: number, h: number, w: number, fill: string, key: string) => {
  const tiers = 6; let d = `M${x} ${base - h}`;
  for (let i = 1; i <= tiers; i++) { const y = base - h + (h * i) / tiers; const ww = (w * (0.35 + 0.65 * i / tiers)) / 2; d += ` L${x + ww} ${y} L${x + ww * 0.45} ${y - h / tiers * 0.25}`; }
  for (let i = tiers; i >= 1; i--) { const y = base - h + (h * i) / tiers; const ww = (w * (0.35 + 0.65 * i / tiers)) / 2; d += ` L${x - ww * 0.45} ${y - h / tiers * 0.25} L${x - ww} ${y}`; }
  return <path key={key} d={d + 'Z'} fill={fill} />;
};

export const GRAPHIC: Record<string, BandSpec> = {
  'graphic/sky': {
    node: () => (
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
        <defs>
          <linearGradient id="gs-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5d5478" /><stop offset="0.42" stopColor="#9c8fb3" /><stop offset="0.7" stopColor="#f3d9a4" /><stop offset="1" stopColor="#c9a46a" />
          </linearGradient>
          <radialGradient id="gs-sun" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#fff3d2" stopOpacity={0.95} /><stop offset="0.35" stopColor="#f3d9a4" stopOpacity={0.5} /><stop offset="1" stopColor="#f3d9a4" stopOpacity={0} />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill="url(#gs-sky)" />
        <ellipse cx={W / 2} cy={1380} rx={760} ry={620} fill="url(#gs-sun)" />
        <path d={`M0 1480 L220 1230 L380 1340 L620 1120 L820 1300 L1010 1190 L${W} 1400 L${W} ${H} L0 ${H}Z`} fill="#8a7f9e" opacity={0.75} />
        <rect x={0} y={1560} width={W} height={60} fill="#fbe7bb" opacity={0.35} />
      </svg>
    ),
  },
  'graphic/pines': {
    blur: 2,
    node: () => {
      const r = rng(22); const out: React.ReactNode[] = [];
      for (let i = 0; i < 9; i++) { const x = 60 + i * 145 + (r() - 0.5) * 60; if (Math.abs(x - W / 2) < 170) continue; out.push(pine(x, 1700, 620 + r() * 380, 230 + r() * 80, '#3a4a42', 'b' + i)); }
      return (
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
          {out}
          <rect x={0} y={1640} width={W} height={H - 1640} fill="#2c3a2f" />
        </svg>
      );
    },
  },
  'graphic/fg': {
    node: () => (
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
        {pine(90, 2050, 1700, 520, '#16241c', 'l')}
        {pine(1220, 2080, 1850, 560, '#16241c', 'r')}
        <path d={`M0 1960 Q300 1860 648 1900 Q1000 1940 ${W} 1850 L${W} ${H} L0 ${H}Z`} fill="#121c16" />
        <path d="M380 1930 q-40 -90 -10 -150 M420 1925 q10 -80 60 -120 M860 1915 q-20 -100 20 -150 M900 1920 q30 -60 80 -80" stroke="#1d2b20" strokeWidth={14} fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
};
