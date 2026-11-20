import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H, rng } from '../art/world';

/** Set "graphic" (title, lore, CTA). Static bands baked ONCE to public/baked/graphic/<band>.png. Ids "graphic/<band>". */
export const GHZ = 1150; // horizon (world y) → frame y 958

const Sky = () => (
  <>
    <defs>
      <linearGradient id="gs-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#bfcfc9" />
        <stop offset="0.55" stopColor="#e9ecd8" />
        <stop offset="1" stopColor="#f6f3df" />
      </linearGradient>
      <radialGradient id="gs-sun" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#fffbea" stopOpacity={1} />
        <stop offset="0.4" stopColor="#fff6d6" stopOpacity={0.6} />
        <stop offset="1" stopColor="#fff6d6" stopOpacity={0} />
      </radialGradient>
    </defs>
    <rect width={W} height={GHZ + 40} fill="url(#gs-sky)" />
    <ellipse cx={760} cy={GHZ - 60} rx={520} ry={300} fill="url(#gs-sun)" />
    <path d={`M 0 ${GHZ - 120} C 180 ${GHZ - 210} 300 ${GHZ - 230} 430 ${GHZ - 150} C 560 ${GHZ - 90} 640 ${GHZ - 170} 800 ${GHZ - 200} C 960 ${GHZ - 230} 1120 ${GHZ - 130} ${W} ${GHZ - 150} L ${W} ${GHZ + 10} L 0 ${GHZ + 10} Z`} fill="#a9b8bf" opacity={0.85} />
    <path d={`M 0 ${GHZ - 50} C 220 ${GHZ - 110} 380 ${GHZ - 70} 520 ${GHZ - 90} C 700 ${GHZ - 120} 900 ${GHZ - 60} ${W} ${GHZ - 90} L ${W} ${GHZ + 10} L 0 ${GHZ + 10} Z`} fill="#7d93a3" />
  </>
);

const Field = () => {
  const r = rng(26);
  const rows = Array.from({ length: 11 }, (_, i) => i);
  return (
    <>
      <defs>
        <linearGradient id="gf-field" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9cbf6e" />
          <stop offset="0.25" stopColor="#6fa645" />
          <stop offset="1" stopColor="#2f5a20" />
        </linearGradient>
      </defs>
      {/* far tree line */}
      <path d={`M 0 ${GHZ + 4} C 120 ${GHZ - 26} 260 ${GHZ - 12} 380 ${GHZ - 20} C 520 ${GHZ - 30} 600 ${GHZ - 8} 700 ${GHZ - 6} L 1000 ${GHZ - 4} C 1100 ${GHZ - 28} 1200 ${GHZ - 22} ${W} ${GHZ - 10} L ${W} ${GHZ + 20} L 0 ${GHZ + 20} Z`} fill="#4f6f4a" />
      <rect y={GHZ} width={W} height={H - GHZ} fill="url(#gf-field)" />
      {/* paddy dikes converging to vanishing point */}
      {rows.map((i) => {
        const y = GHZ + 12 + Math.pow(i / 10, 2.2) * (H - GHZ);
        return <path key={i} d={`M 0 ${y} L ${W} ${y + (i % 2 ? 6 : -4)}`} stroke="#3e6a2b" strokeWidth={2 + i * 2.2} opacity={0.55} />;
      })}
      {/* water glints */}
      {Array.from({ length: 22 }, (_, i) => {
        const yy = GHZ + 20 + Math.pow(r(), 2) * 700, xx = r() * W, ww = 20 + (yy - GHZ) * 0.25;
        return <rect key={i} x={xx} y={yy} width={ww} height={2 + (yy - GHZ) * 0.006} fill="#f3f6e4" opacity={0.55} />;
      })}
      {/* dirt path */}
      <path d={`M 640 ${GHZ + 6} L 660 ${GHZ + 6} C 700 ${GHZ + 300} 900 ${GHZ + 700} 1080 ${H} L 760 ${H} C 700 ${GHZ + 700} 650 ${GHZ + 300} 640 ${GHZ + 6} Z`} fill="#b59a6c" opacity={0.75} />
      {/* telephone poles */}
      {[[300, 150, 7], [170, 330, 12], [-10, 760, 22]].map(([x, hgt, w], i) => (
        <g key={i} fill="#2e3a2c">
          <rect x={x} y={GHZ + hgt * 0.15 - hgt * 1.6} width={w} height={hgt * 1.6 + hgt * 0.15} />
          <rect x={x - w * 3} y={GHZ + hgt * 0.15 - hgt * 1.5} width={w * 7} height={w * 0.8} />
        </g>
      ))}
      <path d={`M 0 ${GHZ - 900} Q 120 ${GHZ - 340} 185 ${GHZ - 300} Q 260 ${GHZ - 120} 304 ${GHZ - 200} Q 500 ${GHZ - 120} ${W} ${GHZ - 60}`} fill="none" stroke="#2e3a2c" strokeWidth={3} opacity={0.8} />
    </>
  );
};

const Fg = () => {
  const r = rng(7);
  const blades = (x0: number, n: number, dir: number) => Array.from({ length: n }, (_, i) => {
    const x = x0 + dir * (i * 26 + r() * 20), hgt = 380 + r() * 420, lean = dir * (40 + r() * 140);
    return <path key={`${x0}-${i}`} d={`M ${x - 9} ${H} Q ${x + lean * 0.3} ${H - hgt * 0.6} ${x + lean} ${H - hgt} Q ${x + lean * 0.3 + 6} ${H - hgt * 0.55} ${x + 11} ${H} Z`} fill={i % 3 ? '#14240f' : '#1d3315'} />;
  });
  return <>{blades(90, 12, 1)}{blades(1220, 12, -1)}</>;
};

export const GRAPHIC: Record<string, BandSpec> = {
  'graphic/sky': { node: () => <Sky /> },
  'graphic/field': { node: () => <Field /> },
  'graphic/fg': { blur: 3, node: () => <Fg /> },
};
