import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H } from '../art/world';
import { VP, gy, gx, COL } from '../art/street_figs';

const P = (bx: number, s: number, up = 0) => `${gx(bx, s)},${gy(s) - up * s}`;

/** one shophouse facade slab on a side wall between depths s0 (far) and s1 (near) */
const facade = (bx: number, s0: number, s1: number, top: number, fill: string, key: string) => {
  const m0 = s0 * 0.94 + s1 * 0.06, m1 = s1 * 0.94 + s0 * 0.06;
  const w0 = s1 * 0.3 + s0 * 0.7, w1 = s1 * 0.7 + s0 * 0.3;
  return (
    <g key={key}>
      <polygon points={`${P(bx, s1)} ${P(bx, s1, top)} ${P(bx, s0, top)} ${P(bx, s0)}`} fill={fill} />
      <polygon points={`${P(bx, m1, 560)} ${P(bx, m0, 560)} ${P(bx, m0)} ${P(bx, m1)}`} fill={COL.shutter} />
      <polygon points={`${P(bx, m1, 560)} ${P(bx, m0, 560)} ${P(bx, m0, 520)} ${P(bx, m1, 520)}`} fill="#1a1414" />
      <polygon points={`${P(bx, w1, 960)} ${P(bx, w0, 960)} ${P(bx, w0, 760)} ${P(bx, w1, 760)}`} fill="#ffb27a" opacity={0.22} />
      <polygon points={`${P(bx, w1, 1700)} ${P(bx, w0, 1700)} ${P(bx, w0, 1480)} ${P(bx, w1, 1480)}`} fill="#ffb27a" opacity={0.12} />
      <polygon points={`${P(bx, s1, 1300)} ${P(bx, s0, 1300)} ${P(bx, s0, 1250)} ${P(bx, s1, 1250)}`} fill={COL.houseDark} />
      <polygon points={`${P(bx, s1, top + 30)} ${P(bx, s0, top + 30)} ${P(bx, s0, top - 30)} ${P(bx, s1, top - 30)}`} fill={COL.houseDark} />
    </g>
  );
};

/** Set "street" (old shophouse street at night: lanterns, offering fires, the walk home). Static bands baked ONCE to public/baked/street/<band>.png. Ids "street/<band>". */
export const STREET: Record<string, BandSpec> = {
  /** sky, far glow, shophouse facades, wet pavement with reflections */
  'street/bg': {
    node: () => (
      <g>
        <defs>
          <linearGradient id="tSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0c0a12" /><stop offset="0.35" stopColor="#2a1622" /><stop offset="0.47" stopColor="#6a2e2a" /><stop offset="1" stopColor="#2a1622" /></linearGradient>
          <linearGradient id="tRoad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4a2c28" /><stop offset="0.3" stopColor="#21181a" /><stop offset="1" stopColor="#0e0b0d" /></linearGradient>
          <radialGradient id="tEnd" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffb07a" stopOpacity="0.85" /><stop offset="0.5" stopColor="#ff8a5c" stopOpacity="0.35" /><stop offset="1" stopColor="#ff8a5c" stopOpacity="0" /></radialGradient>
          <linearGradient id="tRefl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ff8a5c" stopOpacity="0.5" /><stop offset="1" stopColor="#ff8a5c" stopOpacity="0" /></linearGradient>
          <linearGradient id="tReflN" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6fd1c4" stopOpacity="0.4" /><stop offset="1" stopColor="#6fd1c4" stopOpacity="0" /></linearGradient>
        </defs>
        <rect x={0} y={0} width={W} height={H} fill="url(#tSky)" />
        <ellipse cx={VP.x} cy={VP.y - 60} rx={420} ry={300} fill="url(#tEnd)" />
        <path d={`M ${VP.x - 170} ${VP.y + 10} L ${VP.x - 170} ${VP.y - 120} L ${VP.x - 80} ${VP.y - 175} L ${VP.x + 10} ${VP.y - 120} L ${VP.x + 40} ${VP.y - 150} L ${VP.x + 170} ${VP.y - 105} L ${VP.x + 170} ${VP.y + 10} Z`} fill="#2a1a1c" />
        <polygon points={`${VP.x},${VP.y} ${-700},${H} ${W + 700},${H}`} fill="url(#tRoad)" />
        {[[-150, 0.55], [-150, 0.34], [-150, 0.2], [1450, 0.48], [1450, 0.3], [1450, 0.18], [-150, 0.9], [1450, 0.8]].map(([bx, s], i) => (
          <rect key={i} x={gx(bx < VP.x ? 40 : 1260, s) - 22 * s - 8} y={gy(s) + 6} width={20 * s + 6} height={420 * s + 40} fill="url(#tRefl)" opacity={0.7} />
        ))}
        <rect x={gx(1300, 0.58) - 18} y={gy(0.58) + 10} width={36} height={340} fill="url(#tReflN)" />
        {facade(-150, 0.04, 0.12, 2400, '#2a2221', 'l0')}
        {facade(-150, 0.12, 0.22, 2200, '#302725', 'l1')}
        {facade(-150, 0.22, 0.4, 2600, COL.house, 'l2')}
        {facade(-150, 0.4, 0.7, 2300, '#352d2a', 'l3')}
        {facade(-150, 0.7, 1.5, 2500, '#2e2725', 'l4')}
        {facade(1450, 0.04, 0.11, 2300, '#271f1f', 'r0')}
        {facade(1450, 0.11, 0.2, 2600, '#2e2624', 'r1')}
        {facade(1450, 0.2, 0.36, 2200, '#342c29', 'r2')}
        {facade(1450, 0.36, 0.62, 2500, COL.house, 'r3')}
        {facade(1450, 0.62, 1.5, 2400, '#2c2523', 'r4')}
        <polygon points={`${P(1440, 0.6, 1180)} ${P(1440, 0.6, 640)} ${P(1440, 0.55, 640)} ${P(1440, 0.55, 1180)}`} fill="#16302d" />
        <polygon points={`${P(1440, 0.595, 1150)} ${P(1440, 0.595, 670)} ${P(1440, 0.555, 670)} ${P(1440, 0.555, 1150)}`} fill="none" stroke={COL.neon} strokeWidth={6} opacity={0.75} />
        {[0, 1, 2].map((i) => <rect key={i} x={gx(1440, 0.575) - 12} y={gy(0.575) - (1080 - i * 140) * 0.575} width={24} height={44} fill={COL.neon} opacity={0.6} />)}
        {[0.12, 0.2, 0.34, 0.55].map((s) => <path key={s} d={`M ${gx(-150, s)} ${gy(s) - 1650 * s} Q ${VP.x} ${gy(s) - 1450 * s} ${gx(1450, s)} ${gy(s) - 1650 * s}`} stroke="#0d0909" strokeWidth={2 + 3 * s} fill="none" />)}
        <line x1={VP.x} y1={VP.y} x2={gx(-150, 1.5)} y2={gy(1.5)} stroke="#120d0e" strokeWidth={8} />
        <line x1={VP.x} y1={VP.y} x2={gx(1450, 1.5)} y2={gy(1.5)} stroke="#120d0e" strokeWidth={8} />
      </g>
    ),
  },
  /** dark foreground framing: eave corner top-left, shop pillar right. */
  'street/fg': {
    blur: 6,
    node: () => (
      <g>
        <path d="M -20 -20 L 560 -20 L 500 150 L 320 190 L 140 270 L -20 300 Z" fill="#070506" />
        <path d="M 70 260 L 70 560 L 150 540 L 160 240 Z" fill="#1a0c0c" />
        <rect x={1170} y={-20} width={160} height={H + 40} fill="#080607" />
        <rect x={1170} y={-20} width={8} height={H + 40} fill="#ff8a5c" opacity={0.25} />
      </g>
    ),
  },
  /** soft bokeh background for close-ups (8, 9) */
  'street/close': {
    blur: 18,
    node: () => (
      <g>
        <defs>
          <linearGradient id="tcBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1a0f13" /><stop offset="0.55" stopColor="#3e1d1c" /><stop offset="1" stopColor="#120c0e" /></linearGradient>
          <radialGradient id="tcB" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ff9a6c" stopOpacity="0.9" /><stop offset="0.6" stopColor="#e0402f" stopOpacity="0.5" /><stop offset="1" stopColor="#e0402f" stopOpacity="0" /></radialGradient>
          <radialGradient id="tcN" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#6fd1c4" stopOpacity="0.6" /><stop offset="1" stopColor="#6fd1c4" stopOpacity="0" /></radialGradient>
        </defs>
        <rect x={0} y={0} width={W} height={H} fill="url(#tcBg)" />
        <rect x={0} y={1400} width={W} height={904} fill="#140d0e" opacity={0.7} />
        {[[220, 560, 150], [520, 400, 110], [880, 600, 170], [1120, 360, 100], [330, 940, 120], [1050, 1020, 140], [700, 800, 80]].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="url(#tcB)" />
        ))}
        <circle cx={160} cy={1220} r={120} fill="url(#tcN)" />
        <rect x={980} y={1160} width={240} height={140} fill="#ffb057" opacity={0.25} />
      </g>
    ),
  },
};
