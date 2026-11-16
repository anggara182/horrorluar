import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H, rng } from '../art/world';

/** Set "hut" (inside the hut: oven, pot, Baba Yaga, close-ups, the yarn). Static bands baked ONCE to public/baked/hut/<band>.png. Ids "hut/<band>". */

// Oven mouth centre (world): Baba Yaga's head sits against this glow.
export const OVEN = { x: 690, y: 1010 };

const Back: React.FC = () => {
  const r = rng(21);
  const logs = Array.from({ length: 16 }, (_, i) => 120 + i * 140);
  return (
    <g>
      <defs>
        <radialGradient id="hb-room" cx={OVEN.x} cy={OVEN.y} r="1300" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#5a3420" />
          <stop offset="0.35" stopColor="#2e1d15" />
          <stop offset="1" stopColor="#0c0907" />
        </radialGradient>
        <linearGradient id="hb-oven" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6b4a36" />
          <stop offset="0.6" stopColor="#8a6248" />
          <stop offset="1" stopColor="#4a3326" />
        </linearGradient>
        <radialGradient id="hb-mouth" cx="0.5" cy="0.7" r="0.7">
          <stop offset="0" stopColor="#ffe2a8" />
          <stop offset="0.4" stopColor="#ffa24a" />
          <stop offset="1" stopColor="#a8401a" />
        </radialGradient>
        <radialGradient id="hb-glow" cx={OVEN.x} cy={OVEN.y} r="620" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ff9a48" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ff8a3d" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#hb-room)" />
      {logs.map((y, i) => (
        <path key={i} d={`M0 ${y} Q${W / 2} ${y + 10 + r() * 8} ${W} ${y}`} stroke="#0a0705" strokeOpacity="0.5" strokeWidth="7" fill="none" />
      ))}
      {/* shelf with dim skulls + jars, upper left */}
      <rect x="60" y="640" width="440" height="20" fill="#120c09" />
      {[120, 210, 300].map((x, i) => (
        <g key={i} fill="#3b2a20" opacity="0.85">
          <ellipse cx={x} cy={600} rx="34" ry="38" />
          <rect x={x - 20} y={620} width="40" height="20" rx="6" />
          <ellipse cx={x - 12} cy={600} rx="8" ry="10" fill="#140d09" />
          <ellipse cx={x + 12} cy={600} rx="8" ry="10" fill="#140d09" />
        </g>
      ))}
      <rect x="370" y="570" width="50" height="70" rx="10" fill="#2a1e17" />
      <rect x="430" y="595" width="40" height="45" rx="8" fill="#33251c" />
      {/* drying herbs hanging from a beam */}
      <rect x="0" y="330" width={W} height="46" fill="#140e0a" />
      {[160, 330, 520, 900, 1080, 1220].map((x, i) => (
        <g key={i} fill="#1f2a18" opacity="0.9">
          <path d={`M${x} 376 L${x - 30} ${500 + (i % 2) * 60} Q${x} ${540 + (i % 3) * 40} ${x + 30} ${500 + (i % 2) * 60} Z`} />
        </g>
      ))}
      {/* clay oven (pech) */}
      <path d="M380 1640 L380 860 Q380 690 560 670 L1020 660 Q1180 680 1190 860 L1200 1640 Z" fill="url(#hb-oven)" />
      <path d="M840 660 L840 300 L960 300 L960 660 Z" fill="#5b3f2e" />
      <ellipse cx={OVEN.x} cy={OVEN.y - 170} rx="200" ry="90" fill="#1c120c" opacity="0.6" />
      {/* oven mouth */}
      <path d={`M${OVEN.x - 170} 1180 L${OVEN.x - 170} ${OVEN.y - 20} Q${OVEN.x} ${OVEN.y - 200} ${OVEN.x + 170} ${OVEN.y - 20} L${OVEN.x + 170} 1180 Z`} fill="#2a130a" />
      <path d={`M${OVEN.x - 140} 1180 L${OVEN.x - 140} ${OVEN.y} Q${OVEN.x} ${OVEN.y - 160} ${OVEN.x + 140} ${OVEN.y} L${OVEN.x + 140} 1180 Z`} fill="url(#hb-mouth)" />
      <path d={`M${OVEN.x - 140} 1180 Q${OVEN.x - 60} 1120 ${OVEN.x} 1150 Q${OVEN.x + 80} 1110 ${OVEN.x + 140} 1180 Z`} fill="#7a2a10" />
      <rect x="360" y="1180" width="860" height="40" fill="#3e2a1e" />
      <rect width={W} height={H} fill="url(#hb-glow)" />
      {/* floor */}
      <rect x="0" y="1640" width={W} height={H - 1640} fill="#120c09" />
      <path d={`M0 1640 L${W} 1640`} stroke="#4a2c1a" strokeWidth="6" />
    </g>
  );
};

const Fg: React.FC = () => (
  <g fill="#070504">
    <rect x="0" y="0" width="150" height={H} />
    <path d="M150 0 L420 0 L360 160 Q300 230 250 180 L150 260 Z" />
    <path d={`M${W} 0 L${W - 90} 0 L${W - 90} ${H} L${W} ${H} Z`} />
    <path d={`M${W - 90} 0 L${W - 330} 0 Q${W - 280} 140 ${W - 200} 300 Q${W - 150} 200 ${W - 90} 260 Z`} />
    <path d={`M0 ${H} L0 2000 Q300 1940 640 2010 Q980 2080 ${W} 1960 L${W} ${H} Z`} />
  </g>
);

export const HUT: Record<string, BandSpec> = {
  'hut/back': { node: () => <Back /> },
  'hut/backsoft': { blur: 10, node: () => <Back /> },
  'hut/fg': { blur: 12, node: () => <Fg /> },
};
