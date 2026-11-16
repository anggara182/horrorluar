import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H } from '../art/world';

/** Set "room" (inside the rondavel: bed on bricks, mattress on the floor, candle, close-ups). Ids "room/<band>". */
export const RM = {
  wall: '#4a4f63', wallWarm: '#b8805a', thatch: '#5a4a33', brick: '#8a3b2a', brickDk: '#5a2419',
  candle: '#ffc76b', ink: '#07090a', floor: '#2a2420', floorWarm: '#6b4a34', blanket: '#7a2f3a', blanket2: '#d9a14a',
};
export const FLOOR_Y = 1640; // world y where wall meets floor
export const BED = { x: 230, y: 1180, w: 640, top: 1180 };

const Bricks: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    {[0, 1, 2, 3].map((i) => (
      <g key={i}>
        <rect x={x + (i % 2 ? 6 : 0)} y={y + i * 58} width={96} height={52} rx={4} fill={RM.brick} />
        <rect x={x + (i % 2 ? 6 : 0)} y={y + i * 58 + 38} width={96} height={14} fill={RM.brickDk} />
        <rect x={x + (i % 2 ? 6 : 0) + 4} y={y + i * 58 + 4} width={30} height={8} fill="#c2604a" opacity={0.7} />
      </g>
    ))}
  </g>
);

export const ROOM: Record<string, BandSpec> = {
  'room/bg': {
    node: () => (
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
        <defs>
          <radialGradient id="rbgGlow" cx="0.42" cy="0.55" r="0.6">
            <stop offset="0" stopColor={RM.wallWarm} />
            <stop offset="0.45" stopColor="#6e5550" />
            <stop offset="1" stopColor={RM.wall} />
          </radialGradient>
          <linearGradient id="rbgFloor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={RM.floorWarm} />
            <stop offset="1" stopColor={RM.floor} />
          </linearGradient>
          <linearGradient id="rbgThatch" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1a140d" />
            <stop offset="1" stopColor={RM.thatch} />
          </linearGradient>
          <linearGradient id="rbgDoor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1b2236" />
            <stop offset="1" stopColor="#0f1422" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill="url(#rbgGlow)" />
        {/* curved wall shading at the sides (round hut) */}
        <path d={`M0 0 H220 Q120 900 200 ${FLOOR_Y} H0Z`} fill="#2b2e3c" opacity={0.7} />
        <path d={`M${W} 0 H${W - 220} Q${W - 120} 900 ${W - 200} ${FLOOR_Y} H${W}Z`} fill="#2b2e3c" opacity={0.7} />
        {/* thatch ceiling cone + rafters */}
        <path d={`M0 0 H${W} V560 Q${W / 2} 760 0 560Z`} fill="url(#rbgThatch)" />
        {[-500, -250, 0, 250, 500].map((d, i) => (
          <path key={i} d={`M${W / 2 + d * 0.15} 0 L${W / 2 + d * 1.4} ${640 - Math.abs(d) * 0.18}`} stroke="#120d08" strokeWidth={16} />
        ))}
        {/* door on the right */}
        <path d={`M940 ${FLOOR_Y} V1090 Q1020 1030 1100 1090 V${FLOOR_Y}Z`} fill="url(#rbgDoor)" />
        <path d={`M940 ${FLOOR_Y} V1090 Q1020 1030 1100 1090 V${FLOOR_Y}`} fill="none" stroke="#2a1c12" strokeWidth={18} />
        <rect x={948} y={FLOOR_Y - 10} width={144} height={10} fill="#9fb4d9" opacity={0.85} />
        {/* small window (moon) on the left */}
        <ellipse cx={300} cy={900} rx={60} ry={72} fill="#1d2a45" />
        <ellipse cx={300} cy={900} rx={60} ry={72} fill="none" stroke="#2a1c12" strokeWidth={12} />
        <circle cx={318} cy={880} r={16} fill="#cfe0ff" opacity={0.8} />
        {/* floor */}
        <path d={`M0 ${FLOOR_Y} Q${W / 2} ${FLOOR_Y - 40} ${W} ${FLOOR_Y} V${H} H0Z`} fill="url(#rbgFloor)" />
        <ellipse cx={560} cy={FLOOR_Y + 260} rx={520} ry={150} fill="#8a6244" opacity={0.25} />
      </svg>
    ),
  },
  'room/bed': {
    node: () => (
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
        <defs>
          <pattern id="rbedPat" width={80} height={80} patternUnits="userSpaceOnUse">
            <rect width={80} height={80} fill={RM.blanket} />
            <path d="M0 40 L40 10 L80 40 L40 70Z" fill={RM.blanket2} opacity={0.85} />
            <path d="M20 40 L40 25 L60 40 L40 55Z" fill="#2a1a2a" />
          </pattern>
          <radialGradient id="rbedShadow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#000" stopOpacity={0.6} />
            <stop offset="1" stopColor="#000" stopOpacity={0} />
          </radialGradient>
        </defs>
        <ellipse cx={560} cy={FLOOR_Y + 40} rx={430} ry={70} fill="url(#rbedShadow)" />
        {/* dark gap under the bed */}
        <rect x={250} y={1390} width={620} height={FLOOR_Y - 1390} fill="#0d0b0c" opacity={0.75} />
        <Bricks x={250} y={1400} />
        <Bricks x={770} y={1400} />
        {/* frame */}
        <rect x={230} y={1330} width={660} height={70} rx={8} fill="#3a2414" />
        <rect x={230} y={1330} width={660} height={12} fill="#7a5030" />
        {/* headboard */}
        <path d="M200 1400 V1050 Q260 1000 320 1050 V1330 H200Z" fill="#2c1b10" />
        <rect x={208} y={1060} width={10} height={300} fill="#8a5a34" opacity={0.6} />
        {/* mattress + blanket */}
        <rect x={250} y={1250} width={640} height={90} rx={30} fill="#e3d6bf" />
        <path d="M420 1210 Q640 1190 900 1230 L910 1360 Q660 1380 420 1350Z" fill="url(#rbedPat)" />
        <path d="M420 1210 Q640 1190 900 1230" fill="none" stroke="#ffcf8a" strokeWidth={6} opacity={0.8} />
        {/* pillow */}
        <ellipse cx={330} cy={1240} rx={95} ry={42} fill="#efe4cf" />
        <path d="M245 1235 Q330 1205 420 1232" fill="none" stroke="#fff3d9" strokeWidth={6} />
      </svg>
    ),
  },
  'room/fg': {
    node: () => (
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
        <path d={`M0 0 H200 Q150 700 170 1400 Q140 1900 0 2100Z`} fill={RM.ink} />
        <path d={`M${W} 2304 V1950 Q1100 2000 980 2304Z`} fill={RM.ink} />
        <path d={`M0 2304 V2050 Q200 2060 360 2304Z`} fill={RM.ink} />
      </svg>
    ),
  },
};
