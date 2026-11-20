import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H, rng } from '../art/world';

/** Set "close" (close-ups: grill and skewers, damp money, the hair, frangipani petals in the money box). Static bands baked ONCE to public/baked/close/<band>.png. Ids "close/<band>". */

/** Night bokeh: warm lamp + grill glow, dark banana leaves. Shared by shots 6, 7, 9 (cropped differently). */
const Night: React.FC = () => {
  const r = rng(28);
  const dots = Array.from({ length: 14 }, () => ({ x: r() * W, y: 300 + r() * 1300, s: 30 + r() * 70, o: 0.15 + r() * 0.35 }));
  return (
    <>
      <defs>
        <linearGradient id="cnSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b0d14" /><stop offset="0.55" stopColor="#1d1820" /><stop offset="1" stopColor="#0d0b0c" />
        </linearGradient>
        <radialGradient id="cnLamp" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffd9a0" stopOpacity={0.95} /><stop offset="0.25" stopColor="#e9a868" stopOpacity={0.45} /><stop offset="1" stopColor="#3a2418" stopOpacity={0} />
        </radialGradient>
        <radialGradient id="cnDot" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffcf96" stopOpacity={1} /><stop offset="1" stopColor="#ffcf96" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#cnSky)" />
      <circle cx={880} cy={640} r={760} fill="url(#cnLamp)" />
      {dots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.s} fill="url(#cnDot)" opacity={d.o} />)}
      <path d="M-50,200 C150,500 120,900 60,1300 L-50,1300 Z" fill="#060a0c" />
      <path d="M1346,100 C1080,400 1150,800 1240,1200 L1346,1200 Z" fill="#060a0c" />
      <path d="M0,1500 L1296,1450 L1296,2304 L0,2304 Z" fill="#100c0b" />
    </>
  );
};

/** Blurred white dress standing behind the cart (shot 6). */
const Dress: React.FC = () => (
  <>
    <path d="M770,520 C700,560 690,700 700,800 C660,1000 640,1300 620,1700 L1000,1700 C980,1300 950,1000 910,800 C920,700 900,560 840,520 Z" fill="#e8e4dc" opacity={0.75} />
    <path d="M760,360 C700,420 700,800 690,1200 L720,1200 C740,800 760,560 805,500 C850,560 870,800 890,1200 L920,1200 C910,800 910,420 850,360 Z" fill="#060606" />
    <ellipse cx={805} cy={420} rx={52} ry={66} fill="#060606" />
  </>
);

export const CLOSE: Record<string, BandSpec> = {
  'close/night': { blur: 26, node: () => <Night /> },
  'close/dress': { blur: 18, node: () => <Dress /> },
};
