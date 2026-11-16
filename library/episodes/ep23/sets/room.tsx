import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H } from '../art/world';

/** Shared room geometry (world space). */
export const RM = {
  win: { x0: 330, x1: 1000, y0: 640, y1: 1420 },
  floor: 1340,
  candle: { x: 790, y: 1322 }, // tray centre
  woman: { x: 560 },
  close: '670 1050 240 427', // 9:16 crop around the candle
};

/** Dark interior: back wall with warm candle bloom, floor. */
const Inside: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="rmWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0c0907" /><stop offset="0.7" stopColor="#1e140c" /><stop offset="1" stopColor="#140d08" /></linearGradient>
      <radialGradient id="rmBloom" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffbf66" stopOpacity="0.55" /><stop offset="0.35" stopColor="#c87a32" stopOpacity="0.25" /><stop offset="1" stopColor="#c87a32" stopOpacity="0" /></radialGradient>
      <linearGradient id="rmFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a1c10" /><stop offset="1" stopColor="#090604" /></linearGradient>
    </defs>
    <rect x={0} y={0} width={W} height={H} fill="url(#rmWall)" />
    <ellipse cx={RM.candle.x - 40} cy={1180} rx={620} ry={560} fill="url(#rmBloom)" />
    {/* a plank seam and a hanging cloth, low detail */}
    <rect x={0} y={760} width={W} height={10} fill="#0a0705" opacity={0.6} />
    <path d="M 960 640 L 1080 640 L 1070 1100 Q 1020 1130 975 1090 Z" fill="#100a06" opacity={0.85} />
    <rect x={0} y={RM.floor} width={W} height={H - RM.floor} fill="url(#rmFloor)" />
    <ellipse cx={RM.candle.x - 20} cy={RM.floor + 30} rx={420} ry={70} fill="url(#rmBloom)" opacity={0.7} />
  </g>
);

/** Exterior plaster wall with the window hole, open wooden shutters, bars, sill, banana leaves fg. */
const Wall: React.FC = () => {
  const { x0, x1, y0, y1 } = RM.win;
  const hole = `M 0 0 H ${W} V ${H} H 0 Z M ${x0} ${y0} V ${y1} H ${x1} V ${y0} Z`;
  return (
    <g>
      <defs>
        <linearGradient id="rmPlaster" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#262c37" /><stop offset="0.5" stopColor="#3e4655" /><stop offset="1" stopColor="#1a1e26" /></linearGradient>
        <radialGradient id="rmSpill" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffbf66" stopOpacity="0.28" /><stop offset="1" stopColor="#ffbf66" stopOpacity="0" /></radialGradient>
        <linearGradient id="rmShut" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#2a1d13" /><stop offset="1" stopColor="#4a3424" /></linearGradient>
      </defs>
      <path d={hole} fill="url(#rmPlaster)" fillRule="evenodd" />
      {/* warm spill on plaster around the opening */}
      <ellipse cx={(x0 + x1) / 2} cy={y1 + 40} rx={520} ry={260} fill="url(#rmSpill)" />
      {/* frame */}
      <path d={`M ${x0 - 34} ${y0 - 34} H ${x1 + 34} V ${y1 + 20} H ${x0 - 34} Z M ${x0} ${y0} V ${y1} H ${x1} V ${y0} Z`} fill="#2b1e14" fillRule="evenodd" />
      {/* sill */}
      <rect x={x0 - 70} y={y1 + 14} width={x1 - x0 + 140} height={36} fill="#3a2a1c" />
      <rect x={x0 - 70} y={y1 + 14} width={x1 - x0 + 140} height={6} fill="#ffbf66" opacity={0.35} />
      {/* open shutters, seen at an angle */}
      <path d={`M ${x0 - 34} ${y0 - 34} L ${x0 - 200} ${y0 - 70} L ${x0 - 200} ${y1 + 60} L ${x0 - 34} ${y1 + 20} Z`} fill="url(#rmShut)" />
      <path d={`M ${x1 + 34} ${y0 - 34} L ${x1 + 190} ${y0 - 70} L ${x1 + 190} ${y1 + 60} L ${x1 + 34} ${y1 + 20} Z`} fill="#22170f" />
      {[0.25, 0.5, 0.75].map((f) => (
        <g key={f}>
          <line x1={x0 - 34} y1={y0 - 34 + f * (y1 - y0 + 54)} x2={x0 - 200} y2={y0 - 70 + f * (y1 - y0 + 130)} stroke="#1a110a" strokeWidth={6} />
          <line x1={x1 + 34} y1={y0 - 34 + f * (y1 - y0 + 54)} x2={x1 + 190} y2={y0 - 70 + f * (y1 - y0 + 130)} stroke="#120c07" strokeWidth={6} />
        </g>
      ))}
      {/* three bars */}
      {[0.1, 0.9].map((f) => (
        <rect key={f} x={x0 + f * (x1 - x0) - 9} y={y0} width={18} height={y1 - y0} fill="#140e09" />
      ))}
      <rect x={x0 + (x1 - x0) * 0.1 + 9} y={y0} width={3} height={y1 - y0} fill="#ffbf66" opacity={0.3} />
      {/* eave shadow top */}
      <rect x={0} y={0} width={W} height={300} fill="#0c0f15" opacity={0.85} />
      <path d={`M 0 300 L ${W} 330 L ${W} 380 L 0 350 Z`} fill="#0a0c10" />
      {/* banana leaves fg */}
      <path d="M -40 2304 Q 120 1700 520 1500 Q 360 1760 300 2304 Z" fill="#060a0c" />
      <path d="M 180 1660 L 470 1530 M 160 1760 L 420 1600 M 150 1880 L 380 1690" stroke="#0d1418" strokeWidth={5} />
      <path d="M 1340 900 Q 1150 1050 1110 1500 Q 1200 1300 1340 1260 Z" fill="#060a0c" />
      <path d="M 1340 2304 Q 1180 1950 900 1880 Q 1150 2000 1180 2304 Z" fill="#060a0c" />
    </g>
  );
};

/** Close-up background: same interior + tray rim cast shadow. Baked at a tight crop. */
const Close: React.FC = () => (
  <g>
    <Inside />
  </g>
);

export const ROOM: Record<string, BandSpec> = {
  'room/inside': { blur: 2, node: () => <Inside /> },
  'room/wall': { node: () => <Wall /> },
  'room/close': { blur: 3, viewBox: RM.close, node: () => <Close /> },
};
