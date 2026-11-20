import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H, rng } from '../art/world';
import { HY, VPX, RC } from '../art/road_figs';

const roots = () => {
  const r = rng(27);
  return Array.from({ length: 16 }, (_, i) => {
    const x = 150 + i * 34 + r() * 20, y0 = 640 + r() * 80, len = 220 + r() * 300;
    return <path key={i} d={`M ${x} ${y0} q ${(r() - 0.5) * 20} ${len / 2} ${(r() - 0.5) * 16} ${len}`} stroke={RC.tree} strokeWidth={4 + r() * 5} fill="none" />;
  });
};

/** Set "road" (lonely village road at night: banyan tree, truck, the woman, footprints, dawn). Static bands baked ONCE to public/baked/road/<band>.png. Ids "road/<band>". */
export const ROAD: Record<string, BandSpec> = {
  /** moonlit sky, moon, far fields, far village light */
  'road/sky': {
    node: () => (
      <g>
        <defs>
          <linearGradient id="rdSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#070a16" /><stop offset="0.6" stopColor="#1c2440" /><stop offset="1" stopColor="#56607e" /></linearGradient>
          <radialGradient id="rdMoon"><stop offset="0" stopColor="#cfd6e6" stopOpacity={0.55} /><stop offset="1" stopColor="#cfd6e6" stopOpacity={0} /></radialGradient>
          <radialGradient id="rdVil"><stop offset="0" stopColor="#ffb860" stopOpacity={0.7} /><stop offset="1" stopColor="#ffb860" stopOpacity={0} /></radialGradient>
          <linearGradient id="rdField" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#262a32" /><stop offset="1" stopColor="#0e0f12" /></linearGradient>
        </defs>
        <rect x={0} y={0} width={W} height={HY + 10} fill="url(#rdSky)" />
        <circle cx={900} cy={470} r={300} fill="url(#rdMoon)" />
        <circle cx={900} cy={470} r={62} fill="#e9edf5" />
        <path d={`M 0 ${HY - 20} Q 300 ${HY - 50} 600 ${HY - 18} T 1296 ${HY - 30} L 1296 ${HY + 10} L 0 ${HY + 10} Z`} fill="#1a1d26" />
        <ellipse cx={1010} cy={HY - 12} rx={90} ry={34} fill="url(#rdVil)" />
        <rect x={998} y={HY - 22} width={8} height={8} fill="#ffd28a" /><rect x={1024} y={HY - 20} width={6} height={6} fill="#ffd28a" />
        <rect x={0} y={HY} width={W} height={H - HY} fill="url(#rdField)" />
      </g>
    ),
  },
  /** road + banyan tree */
  'road/mid': {
    node: () => (
      <g>
        <defs>
          <linearGradient id="rdRoad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8a8a8c" /><stop offset="0.25" stopColor={RC.dust} /><stop offset="1" stopColor="#2a2219" /></linearGradient>
        </defs>
        <polygon points={`${VPX - 8},${HY} ${VPX + 8},${HY} ${W + 300},${H} ${-300},${H}`} fill="url(#rdRoad)" />
        <polygon points={`${VPX - 8},${HY} ${VPX - 2},${HY} ${360},${H} ${-300},${H}`} fill="#000" opacity={0.18} />
        {/* banyan: trunk + crown on the left */}
        <path d={`M 250 ${HY + 140} C 280 900 270 760 220 640 L 420 640 C 380 760 380 900 420 ${HY + 140} Z`} fill={RC.tree} />
        <path d="M -200 700 C -240 520 -60 380 120 420 C 220 300 480 300 560 400 C 700 360 820 460 760 580 C 820 660 700 720 600 690 C 480 740 300 700 220 690 C 80 740 -120 760 -200 700 Z" fill={RC.tree} />
        <path d="M 120 420 C 220 300 480 300 560 400 C 700 360 820 460 760 580" stroke="#4a5068" strokeWidth={6} fill="none" opacity={0.7} />
        {roots()}
        <path d={`M 250 ${HY + 140} L 220 ${HY + 170} M 420 ${HY + 140} L 470 ${HY + 160}`} stroke={RC.tree} strokeWidth={22} />
      </g>
    ),
  },
  /** foreground grass framing, blurred */
  'road/fg': {
    blur: 6,
    node: () => {
      const r = rng(9);
      const blade = (x: number, side: number, i: number) => { const h = 260 + r() * 380; return <path key={i} d={`M ${x - 14} ${H} Q ${x + side * 40} ${H - h / 2} ${x + side * (60 + r() * 60)} ${H - h} Q ${x + side * 20} ${H - h / 2} ${x + 14} ${H} Z`} fill="#07070a" />; };
      return <g>{Array.from({ length: 14 }, (_, i) => blade(80 + i * 22, i % 2 ? 1 : -1, i))}{Array.from({ length: 14 }, (_, i) => blade(1060 + i * 18, i % 2 ? 1 : -1, 100 + i))}</g>;
    },
  },
};
