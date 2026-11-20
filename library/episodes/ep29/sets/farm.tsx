import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H, rng } from '../art/world';

/** shared geometry for the farm set (world space) */
export const FG = { ridgeY: 1180, groundY: 1330, houseX: 720, houseY: 1460 };

const stars = () => {
  const r = rng(29);
  return Array.from({ length: 140 }, (_, i) => {
    const x = r() * W, y = r() * 1150, s = 0.8 + r() * 2.2;
    return <circle key={i} cx={x} cy={y} r={s} fill="#eaf2ff" opacity={0.25 + r() * 0.6} />;
  });
};

/** Turf-roof farmhouse with snow on the grass roof, one lit window. */
export const TurfHouse: React.FC<{ x: number; y: number; s: number; lit?: number }> = ({ x, y, s, lit = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <defs>
      <radialGradient id="fhWin" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffc76b" stopOpacity="0.7" /><stop offset="1" stopColor="#ffc76b" stopOpacity="0" /></radialGradient>
      <linearGradient id="fhRoof" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#eef4fa" /><stop offset="1" stopColor="#8a9bb2" /></linearGradient>
    </defs>
    {/* side gable house (second) */}
    <path d="M -300 0 L -300 -120 L -210 -200 L -120 -120 L -120 0 Z" fill="#3a2d22" />
    <path d="M -320 -110 L -210 -215 L -100 -110 L -120 -100 L -210 -185 L -300 -100 Z" fill="url(#fhRoof)" />
    {/* main gable: wooden front */}
    <path d="M -120 0 L -120 -150 L 0 -270 L 120 -150 L 120 0 Z" fill="#4b3a2c" />
    {/* plank lines */}
    <path d="M -60 -210 L -60 0 M 0 -270 L 0 0 M 60 -210 L 60 0" stroke="#2f241b" strokeWidth={5} />
    {/* turf roof long body going back (right) */}
    <path d="M 120 -150 L 0 -270 L 300 -250 L 420 -130 L 420 0 L 120 0 Z" fill="#33281f" />
    <path d="M -12 -282 L 310 -262 L 440 -128 L 410 -118 L 300 -232 L 0 -255 Z" fill="url(#fhRoof)" />
    <path d="M -140 -150 L 0 -290 L 140 -150 L 118 -140 L 0 -258 L -118 -140 Z" fill="#f2f6fb" />
    {/* door + window */}
    <rect x={-28} y={-95} width={56} height={95} fill="#22190f" />
    <ellipse cx={0} cy={-170} rx={130} ry={110} fill="url(#fhWin)" opacity={lit} />
    <rect x={-30} y={-200} width={60} height={50} fill="#ffc76b" opacity={0.25 + 0.75 * lit} />
    <path d="M 0 -200 L 0 -150 M -30 -175 L 30 -175" stroke="#4b3a2c" strokeWidth={6} />
    <rect x={220} y={-110} width={50} height={40} fill="#ffc76b" opacity={0.2 + 0.7 * lit} />
    {/* snow drift against house */}
    <path d="M -340 10 C -300 -30 -200 -20 -120 -10 C 0 -30 200 -25 460 -15 L 460 20 L -340 20 Z" fill="#dfe7ef" />
  </g>
);

/** Set "farm" (snowy farmhouse at night and dawn: aurora, mountains, the giant cat, paw prints). Static bands baked ONCE to public/baked/farm/<band>.png. Ids "farm/<band>". */
export const FARM: Record<string, BandSpec> = {
  /** night sky, stars, aurora, far mountain range */
  'farm/sky': {
    node: () => (
      <g>
        <defs>
          <linearGradient id="fsSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#050812" /><stop offset="0.45" stopColor="#0c1a2a" /><stop offset="0.75" stopColor="#173a44" /><stop offset="1" stopColor="#1d4a4a" /></linearGradient>
          <linearGradient id="fsAur" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6fe3a6" stopOpacity="0" /><stop offset="0.6" stopColor="#6fe3a6" stopOpacity="0.55" /><stop offset="0.85" stopColor="#b8ffd8" stopOpacity="0.8" /><stop offset="1" stopColor="#6fe3a6" stopOpacity="0" /></linearGradient>
          <linearGradient id="fsAur2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7a5ad8" stopOpacity="0" /><stop offset="0.7" stopColor="#6fe3a6" stopOpacity="0.35" /><stop offset="1" stopColor="#6fe3a6" stopOpacity="0" /></linearGradient>
          <linearGradient id="fmFar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a3644" /><stop offset="1" stopColor="#16181c" /></linearGradient>
          <radialGradient id="fsHz" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#6fe3a6" stopOpacity="0.35" /><stop offset="1" stopColor="#6fe3a6" stopOpacity="0" /></radialGradient>
        </defs>
        <rect x={0} y={0} width={W} height={H} fill="url(#fsSky)" />
        {stars()}
        <ellipse cx={650} cy={1000} rx={800} ry={360} fill="url(#fsHz)" />
        {/* aurora curtains: S-shaped ribbons */}
        <path d="M -100 520 C 200 300 420 700 700 520 C 950 360 1150 560 1400 420 L 1400 760 C 1150 900 950 700 700 860 C 420 1040 200 640 -100 860 Z" fill="url(#fsAur)" />
                <path d="M -100 260 C 250 120 500 420 800 300 C 1050 200 1200 330 1400 260 L 1400 520 C 1200 600 1050 460 800 560 C 500 680 250 380 -100 520 Z" fill="url(#fsAur2)" />
        {/* far range */}
        <path d="M -50 1150 L 80 980 L 190 1030 L 300 900 L 420 1010 L 560 1080 L 760 1060 L 900 930 L 1020 990 L 1130 880 L 1350 1040 L 1350 1400 L -50 1400 Z" fill="url(#fmFar)" />
        <path d="M 300 900 L 270 950 L 300 935 L 320 975 L 340 925 Z M 1130 880 L 1100 930 L 1135 915 L 1160 950 L 1170 905 Z M 900 930 L 880 965 L 905 955 L 920 980 L 935 955 Z" fill="#9fb0c4" opacity={0.8} />
      </g>
    ),
  },
  /** black volcanic mountains with snow streaks; saddle in the middle for the cat */
  'farm/mtn': {
    node: () => (
      <g>
        <defs>
                    <linearGradient id="fmNear" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1c2028" /><stop offset="1" stopColor="#0c0d10" /></linearGradient>
        </defs>
        {/* near ridge, saddle around x 560..900 */}
        <path d="M -50 1100 L 120 1060 L 300 1130 L 480 1200 L 700 1195 L 900 1180 L 1040 1110 L 1200 1060 L 1350 1100 L 1350 1420 L -50 1420 Z" fill="url(#fmNear)" />
        <path d="M 120 1060 L 180 1085 L 150 1100 L 230 1110 L 300 1130 M 1200 1060 L 1150 1080 L 1180 1092 L 1110 1100" stroke="#6f8199" strokeWidth={5} fill="none" opacity={0.7} />
      </g>
    ),
  },
  /** snow field + farmhouse */
  'farm/land': {
    node: () => (
      <g>
        <defs>
          <linearGradient id="flSnow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9fb2c8" /><stop offset="0.3" stopColor="#8296b0" /><stop offset="1" stopColor="#46566c" /></linearGradient>
          <linearGradient id="flRim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#dfe7ef" /><stop offset="1" stopColor="#dfe7ef" stopOpacity="0" /></linearGradient>
        </defs>
        <path d={`M -50 1340 C 250 1300 500 1330 700 1320 C 950 1305 1150 1290 1350 1320 L 1350 ${H} L -50 ${H} Z`} fill="url(#flSnow)" />
        <path d={`M -50 1340 C 250 1300 500 1330 700 1320 C 950 1305 1150 1290 1350 1320 L 1350 1360 C 1150 1330 950 1345 700 1360 C 500 1370 250 1340 -50 1380 Z`} fill="url(#flRim)" opacity={0.6} />
        {/* fence posts */}
        {[180, 260, 340, 420, 500].map((x, i) => <rect key={i} x={x} y={1400 + i * 6} width={10} height={60} fill="#2a2119" />)}
        <path d="M 180 1420 L 510 1445" stroke="#2a2119" strokeWidth={6} />
        <defs><radialGradient id="flSpill" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffc76b" stopOpacity="0.32" /><stop offset="1" stopColor="#ffc76b" stopOpacity="0" /></radialGradient></defs>
        <ellipse cx={FG.houseX + 20} cy={FG.houseY + 70} rx={320} ry={90} fill="url(#flSpill)" />
        <TurfHouse x={FG.houseX} y={FG.houseY} s={1} />
      </g>
    ),
  },
  /** dark foreground snowdrifts framing the bottom and sides */
  'farm/fg': {
    blur: 3,
    node: () => (
      <g>
        <path d={`M -50 1900 C 150 1800 350 1830 520 1900 C 700 1960 900 1860 1350 1880 L 1350 ${H} L -50 ${H} Z`} fill="#2c3646" />
        <path d={`M -50 1900 C 150 1800 350 1830 520 1900 C 450 1880 300 1840 -50 1930 Z`} fill="#8fa3bb" opacity={0.6} />
        <path d="M -50 900 C 40 1100 60 1400 30 1700 L -50 1760 Z" fill="#0b0d12" />
        <path d="M 1350 1000 C 1250 1150 1240 1400 1270 1650 L 1350 1700 Z" fill="#0b0d12" />
      </g>
    ),
  },
};
