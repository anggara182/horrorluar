import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H } from '../art/world';

/** Set "house": farmhouse veranda looking out over the paddies. Ids "house/<band>". */
export const HY = 1500; // veranda floor edge (world y)

const Bg: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="hSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#cfdcc8" /><stop offset="0.6" stopColor="#e9ecd8" /><stop offset="1" stopColor="#f4f1dc" /></linearGradient>
      <linearGradient id="hPad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8fb862" /><stop offset="0.5" stopColor="#5f9a3c" /><stop offset="1" stopColor="#3f7428" /></linearGradient>
      <radialGradient id="hSun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fffbe8" stopOpacity="0.9" /><stop offset="1" stopColor="#fffbe8" stopOpacity="0" /></radialGradient>
    </defs>
    <rect width={W} height={H} fill="url(#hSky)" />
    <ellipse cx={820} cy={760} rx={520} ry={360} fill="url(#hSun)" />
    <path d={`M0 1000 L180 900 L360 960 L560 860 L780 950 L980 880 L1296 970 L1296 1080 L0 1080 Z`} fill="#7d93a3" opacity={0.75} />
    <path d={`M0 1040 L260 990 L520 1030 L800 985 L1060 1025 L1296 1000 L1296 1090 L0 1090 Z`} fill="#6c8794" opacity={0.6} />
    <rect y={1070} width={W} height={H - 1070} fill="url(#hPad)" />
    {[1110, 1160, 1230, 1320, 1440, 1590].map((y, i) => <rect key={i} x={0} y={y} width={W} height={4 + i * 2} fill="#c9dcb0" opacity={0.45} />)}
    {[[300, 1135, 160], [900, 1190, 220], [560, 1270, 260]].map(([x, y, w], i) => <rect key={i} x={x} y={y} width={w} height={5} fill="#ffffff" opacity={0.6} />)}
    {[180, 1040].map((x, i) => <g key={i} fill="#4a4a40"><rect x={x} y={930 + i * 40} width={8} height={160 - i * 30} /><rect x={x - 26} y={944 + i * 40} width={60} height={5} /></g>)}
    <path d="M190 940 Q 620 990 1048 980" stroke="#4a4a40" strokeWidth={2} fill="none" />
  </g>
);

const Veranda: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="hFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5a4130" /><stop offset="1" stopColor="#24180f" /></linearGradient>
      <linearGradient id="hEave" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1a120c" /><stop offset="1" stopColor="#3d2c20" /></linearGradient>
    </defs>
    <path d={`M0 0 L${W} 0 L${W} 470 L0 560 Z`} fill="url(#hEave)" />
    <rect x={0} y={540} width={W} height={26} fill="#2a1d14" transform="rotate(-4 648 550)" />
    <rect x={130} y={500} width={58} height={H} fill="#2e2118" />
    <rect x={1150} y={460} width={52} height={H} fill="#2e2118" />
    <rect x={0} y={HY} width={W} height={H - HY} fill="url(#hFloor)" />
    <rect x={0} y={HY} width={W} height={10} fill="#8a6a4c" />
    {[1600, 1730, 1890, 2080].map((y, i) => <rect key={i} x={0} y={y} width={W} height={3} fill="#1a120c" opacity={0.6} />)}
    <rect x={0} y={0} width={120} height={H} fill="#efe6cf" opacity={0.18} />
  </g>
);

export const HOUSE: Record<string, BandSpec> = {
  'house/bg': { node: () => <Bg />, blur: 2 },
  'house/veranda': { node: () => <Veranda /> },
};
