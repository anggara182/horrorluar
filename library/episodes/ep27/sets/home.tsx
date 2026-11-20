import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H } from '../art/world';

/** Set "home" (uncle's courtyard house: door, grandmother, dawn, close-ups). Static bands baked ONCE to public/baked/home/<band>.png. Ids "home/<band>". */
// Door geometry (world space), shared with the live layer in shots/H.tsx
export const DOOR = { x0: 392, x1: 904, top: 500, bot: 1390, sill: 1500, floor: 1528 };

const Bg: React.FC = () => (
  <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
    <defs>
      <linearGradient id="hWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0a0d16" /><stop offset="0.55" stopColor="#1a2030" /><stop offset="1" stopColor="#10131c" /></linearGradient>
      <radialGradient id="hWallLit" cx="0.5" cy="0.62" r="0.5"><stop offset="0" stopColor="#3a4660" stopOpacity="0.55" /><stop offset="1" stopColor="#3a4660" stopOpacity="0" /></radialGradient>
      <linearGradient id="hFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1b1f29" /><stop offset="1" stopColor="#07080c" /></linearGradient>
      <linearGradient id="hFrame" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#0c0b0a" /><stop offset="0.5" stopColor="#1d1a17" /><stop offset="1" stopColor="#0c0b0a" /></linearGradient>
    </defs>
    <rect width={W} height={H} fill="url(#hWall)" />
    <ellipse cx={648} cy={1100} rx={720} ry={900} fill="url(#hWallLit)" />
    {/* lime-wash plaster patches, low contrast */}
    <path d="M 120 760 Q 220 700 300 780 L 290 980 Q 190 1010 130 940 Z" fill="#232a3a" opacity="0.5" />
    <path d="M 1010 1180 Q 1110 1120 1190 1200 L 1170 1330 Q 1080 1360 1020 1300 Z" fill="#232a3a" opacity="0.45" />
    {/* niche with unlit diya at left */}
    <path d="M 168 1180 L 168 1080 Q 216 1020 264 1080 L 264 1180 Z" fill="#07080c" />
    <path d="M 196 1180 Q 216 1160 236 1180 Z" fill="#2a2420" />
    {/* floor */}
    <rect x={0} y={DOOR.floor} width={W} height={H - DOOR.floor} fill="url(#hFloor)" />
    {/* door frame (chaukhat) with heavy lintel */}
    <rect x={DOOR.x0 - 70} y={DOOR.top - 90} width={DOOR.x1 - DOOR.x0 + 140} height={DOOR.sill - DOOR.top + 90} fill="url(#hFrame)" />
    <rect x={DOOR.x0 - 100} y={DOOR.top - 130} width={DOOR.x1 - DOOR.x0 + 200} height={56} fill="#0e0c0a" />
    <rect x={DOOR.x0 - 100} y={DOOR.top - 132} width={DOOR.x1 - DOOR.x0 + 200} height={4} fill="#4a5a78" opacity="0.5" />
    {/* opening (filled by live door + gap) */}
    <rect x={DOOR.x0} y={DOOR.top} width={DOOR.x1 - DOOR.x0} height={DOOR.sill - DOOR.top} fill="#05060a" />
    {/* stone sill */}
    <path d={`M ${DOOR.x0 - 90} ${DOOR.sill} L ${DOOR.x1 + 90} ${DOOR.sill} L ${DOOR.x1 + 120} ${DOOR.floor + 8} L ${DOOR.x0 - 120} ${DOOR.floor + 8} Z`} fill="#2a2e38" />
    <rect x={DOOR.x0 - 90} y={DOOR.sill} width={DOOR.x1 - DOOR.x0 + 180} height={3} fill="#8a97b4" opacity="0.6" />
  </svg>
);

const Fg: React.FC = () => (
  <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
    {/* left: wooden pillar of the verandah */}
    <path d="M 0 0 L 196 0 L 186 2304 L 0 2304 Z" fill="#050507" />
    <rect x={150} y={0} width={4} height={2304} fill="#3b4a66" opacity="0.35" />
    {/* right: hanging cloth / curtain edge */}
    <path d="M 1296 0 L 1120 0 Q 1150 500 1100 900 Q 1080 1200 1140 1560 Q 1170 1900 1130 2304 L 1296 2304 Z" fill="#060608" />
    <path d="M 1120 0 Q 1150 500 1100 900 Q 1080 1200 1140 1560" fill="none" stroke="#33405a" strokeWidth={3} opacity="0.4" />
    {/* top: roof beam */}
    <rect x={0} y={0} width={W} height={300} fill="#040406" />
    <path d="M 0 300 L 1296 300 L 1296 330 L 0 330 Z" fill="#08080b" />
    {/* bottom: a brass lota on the floor, near, dark */}
    <path d="M 210 2304 L 220 2150 Q 200 2090 250 2060 L 330 2060 Q 380 2090 360 2150 L 370 2304 Z" fill="#050506" />
    <path d="M 262 2062 Q 290 2040 318 2062" fill="none" stroke="#4a5670" strokeWidth={3} opacity="0.5" />
  </svg>
);

export const HOME: Record<string, BandSpec> = {
  'home/bg': { node: () => <Bg /> },
  'home/fg': { node: () => <Fg />, blur: 3 },
};
