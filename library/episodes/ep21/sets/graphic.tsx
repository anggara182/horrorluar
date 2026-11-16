import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H, rng } from '../art/world';
import { ChickenHut, Spruce } from '../art/graphic_hut';

/** Set "graphic" (title, lore, CTA). Static bands baked ONCE to public/baked/graphic/<band>.png. Ids "graphic/<band>". */
export const MOON = { x: 648, y: 860, r: 150 };

const Sky: React.FC = () => {
  const r = rng(21);
  const stars = Array.from({ length: 70 }, () => ({ x: r() * W, y: 200 + r() * 1100, s: 1 + r() * 2.2, o: 0.3 + r() * 0.6 }));
  return (
    <g>
      <defs>
        <linearGradient id="gs-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#05070f" />
          <stop offset="0.35" stopColor="#111a33" />
          <stop offset="0.62" stopColor="#2b3a5c" />
          <stop offset="1" stopColor="#5d6f85" />
        </linearGradient>
        <radialGradient id="gs-halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#e9eef5" stopOpacity={0.55} />
          <stop offset="0.35" stopColor="#a9bdd6" stopOpacity={0.2} />
          <stop offset="1" stopColor="#a9bdd6" stopOpacity={0} />
        </radialGradient>
        <radialGradient id="gs-moon" cx="0.42" cy="0.4" r="0.6">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#d6dfea" />
        </radialGradient>
        <linearGradient id="gs-snow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fa2b8" />
          <stop offset="1" stopColor="#2a3446" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#gs-sky)" />
      {stars.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.s} fill="#e9eef5" opacity={s.o} />)}
      <circle cx={MOON.x} cy={MOON.y} r={MOON.r * 3.6} fill="url(#gs-halo)" />
      <circle cx={MOON.x} cy={MOON.y} r={MOON.r} fill="url(#gs-moon)" />
      <circle cx={MOON.x - 40} cy={MOON.y + 30} r={34} fill="#c3cddb" opacity={0.5} />
      <circle cx={MOON.x + 52} cy={MOON.y - 40} r={20} fill="#c3cddb" opacity={0.45} />
      {Array.from({ length: 22 }, (_, i) => <Spruce key={i} x={i * 62 + 10} y={1560} h={150 + ((i * 53) % 90)} fill="#1a2436" />)}
      <path d={`M0,1540 Q${W / 2},1500 ${W},1540 L${W},${H} L0,${H} Z`} fill="url(#gs-snow)" />
    </g>
  );
};

const Hut: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="gh-fg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#5d6f85" />
        <stop offset="1" stopColor="#1a2230" />
      </linearGradient>
    </defs>
    <Spruce x={250} y={1640} h={520} fill="#0d1715" />
    <Spruce x={1050} y={1650} h={560} fill="#0d1715" />
    <path d={`M0,1600 Q420,1560 648,1580 Q900,1600 ${W},1570 L${W},${H} L0,${H} Z`} fill="url(#gh-fg)" />
    <ChickenHut cx={648} base={1600} s={0.95} />
    <Spruce x={60} y={2000} h={1150} />
    <Spruce x={1260} y={2050} h={1250} />
    <path d={`M0,1880 Q500,1800 ${W},1900 L${W},${H} L0,${H} Z`} fill="#0a1210" opacity={0.85} />
  </g>
);

export const GRAPHIC: Record<string, BandSpec> = {
  'graphic/sky': { node: () => <Sky /> },
  'graphic/hut': { node: () => <Hut /> },
};
