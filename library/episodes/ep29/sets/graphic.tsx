import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H, rng } from '../art/world';

/** Ground line of the graphic set in world px (frame y ~1368). */
export const G_GROUND = 1560;

const Sky: React.FC = () => {
  const r = rng(29);
  const stars = Array.from({ length: 140 }, () => ({ x: r() * W, y: r() * 1250, s: 0.8 + r() * 2.2, o: 0.3 + r() * 0.7 }));
  const peaks = 'M 0 1380 L 120 1290 L 210 1330 L 330 1180 L 420 1250 L 520 1210 L 610 1300 L 760 1150 L 880 1240 L 980 1200 L 1100 1290 L 1200 1230 L 1296 1280 L 1296 1580 L 0 1580 Z';
  return (
    <g>
      <defs>
        <linearGradient id="gs-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#03050a" />
          <stop offset="0.35" stopColor="#081420" />
          <stop offset="0.55" stopColor="#0f2a30" />
          <stop offset="0.66" stopColor="#1f4f48" />
        </linearGradient>
        <linearGradient id="gs-snow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fa6b8" />
          <stop offset="0.25" stopColor="#5c6f86" />
          <stop offset="1" stopColor="#1a2230" />
        </linearGradient>
        <linearGradient id="gs-mtn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1e2328" />
          <stop offset="1" stopColor="#16181c" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#gs-sky)" />
      {stars.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.s} fill="#e8f0ff" opacity={s.o} />)}
      <path d={peaks} fill="url(#gs-mtn)" />
      <path d="M 330 1180 L 300 1215 L 345 1205 L 370 1225 Z M 760 1150 L 725 1190 L 770 1180 L 800 1200 Z" fill="#8fa3b8" opacity={0.7} />
      <path d={`M 0 1540 Q 400 1500 700 1530 Q 1000 1555 1296 1520 L 1296 ${H} L 0 ${H} Z`} fill="url(#gs-snow)" />
    </g>
  );
};

const Aurora: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="ga-cur" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#6fe3a6" stopOpacity={0} />
        <stop offset="0.6" stopColor="#6fe3a6" stopOpacity={0.45} />
        <stop offset="0.92" stopColor="#b8ffd8" stopOpacity={0.85} />
        <stop offset="1" stopColor="#6fe3a6" stopOpacity={0} />
      </linearGradient>
      <radialGradient id="ga-glow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#6fe3a6" stopOpacity={0.5} />
        <stop offset="1" stopColor="#6fe3a6" stopOpacity={0} />
      </radialGradient>
    </defs>
    <ellipse cx={680} cy={900} rx={760} ry={520} fill="url(#ga-glow)" />
    <path d="M -50 300 Q 300 180 620 330 Q 950 470 1350 260 L 1350 860 Q 950 1080 620 900 Q 300 760 -50 920 Z" fill="url(#ga-cur)" />
    <path d="M -50 560 Q 350 430 700 600 Q 1000 740 1350 560 L 1350 1000 Q 1000 1160 700 1050 Q 350 930 -50 1100 Z" fill="url(#ga-cur)" opacity={0.75} />
    <path d="M 200 120 Q 500 60 760 180 L 760 640 Q 500 520 200 600 Z" fill="url(#ga-cur)" opacity={0.4} />
  </g>
);

/** Set "graphic" (title, lore, CTA). Static bands baked ONCE to public/baked/graphic/<band>.png. Ids "graphic/<band>". */
export const GRAPHIC: Record<string, BandSpec> = {
  'graphic/sky': { node: () => <Sky /> },
  'graphic/aurora': { blur: 18, node: () => <Aurora /> },
};
