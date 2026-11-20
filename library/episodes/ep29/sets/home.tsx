import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H } from '../art/world';

/** Room layout (world space). Window on the right, table + lamp centre, spinning wheel left. */
export const ROOM = { win: { x: 780, y: 500, w: 330, h: 470 }, table: 1330, lamp: { x: 600, y: 1250 }, wheel: { x: 300, y: 1120, r: 180 } };

const stars = Array.from({ length: 22 }, (_, i) => ({ x: ROOM.win.x + ((i * 97) % ROOM.win.w), y: ROOM.win.y + ((i * 53) % 190), r: 1.5 + (i % 3) }));

/** Set "home" (inside the turf house). Ids "home/<band>". */
export const HOME: Record<string, BandSpec> = {
  'home/room': {
    node: () => {
      const { win, wheel } = ROOM;
      return (
        <g>
          <defs>
            <linearGradient id="hmWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#120c09" /><stop offset="0.55" stopColor="#2e1e14" /><stop offset="1" stopColor="#140d09" /></linearGradient>
            <radialGradient id="hmLampWall" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffc76b" stopOpacity="0.45" /><stop offset="0.5" stopColor="#c8803a" stopOpacity="0.16" /><stop offset="1" stopColor="#c8803a" stopOpacity="0" /></radialGradient>
            <linearGradient id="hmSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#081226" /><stop offset="0.6" stopColor="#123a4a" /><stop offset="1" stopColor="#2b5a5a" /></linearGradient>
            <linearGradient id="hmAur" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6fe3a6" stopOpacity="0" /><stop offset="0.6" stopColor="#6fe3a6" stopOpacity="0.75" /><stop offset="1" stopColor="#6fe3a6" stopOpacity="0.1" /></linearGradient>
            <linearGradient id="hmFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a1b12" /><stop offset="1" stopColor="#0c0806" /></linearGradient>
          </defs>
          <rect x={0} y={0} width={W} height={H} fill="url(#hmWall)" />
          <ellipse cx={ROOM.lamp.x} cy={ROOM.lamp.y - 120} rx={720} ry={620} fill="url(#hmLampWall)" />
          {/* window: sky, aurora, mountains, snow */}
          <rect x={win.x} y={win.y} width={win.w} height={win.h} fill="url(#hmSky)" />
          {stars.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#e8f4ff" opacity={0.7} />)}
          <path d={`M ${win.x} ${win.y + 220} Q ${win.x + 120} ${win.y + 90} ${win.x + 200} ${win.y + 180} T ${win.x + win.w} ${win.y + 110} L ${win.x + win.w} ${win.y + 260} Q ${win.x + 180} ${win.y + 300} ${win.x} ${win.y + 330} Z`} fill="url(#hmAur)" />
          <path d={`M ${win.x} ${win.y + 380} L ${win.x + 90} ${win.y + 320} L ${win.x + 170} ${win.y + 360} L ${win.x + 260} ${win.y + 300} L ${win.x + win.w} ${win.y + 350} L ${win.x + win.w} ${win.y + win.h} L ${win.x} ${win.y + win.h} Z`} fill="#16181c" />
          <path d={`M ${win.x} ${win.y + 420} Q ${win.x + 160} ${win.y + 395} ${win.x + win.w} ${win.y + 415} L ${win.x + win.w} ${win.y + win.h} L ${win.x} ${win.y + win.h} Z`} fill="#5c6f86" />
          {/* deep window recess in turf wall + frame */}
          <path d={`M ${win.x - 60} ${win.y - 50} L ${win.x + win.w + 60} ${win.y - 50} L ${win.x + win.w + 60} ${win.y + win.h + 60} L ${win.x - 60} ${win.y + win.h + 60} Z M ${win.x} ${win.y} L ${win.x} ${win.y + win.h} L ${win.x + win.w} ${win.y + win.h} L ${win.x + win.w} ${win.y} Z`} fill="#4b3a2c" fillRule="evenodd" />
          <rect x={win.x + win.w / 2 - 9} y={win.y} width={18} height={win.h} fill="#1c130d" />
          <rect x={win.x} y={win.y + win.h * 0.45} width={win.w} height={16} fill="#1c130d" />
          <rect x={win.x - 70} y={win.y + win.h + 50} width={win.w + 140} height={26} fill="#5a432f" />
          {/* rafters + posts */}
          <path d={`M -20 420 L ${W / 2} 120 L ${W + 20} 420 L ${W + 20} 470 L ${W / 2} 170 L -20 470 Z`} fill="#0d0806" />
          <rect x={70} y={300} width={46} height={1400} fill="#120b07" />
          <rect x={1180} y={300} width={46} height={1400} fill="#120b07" />
          {/* shelf with wool skeins */}
          <rect x={150} y={700} width={420} height={18} fill="#3a281b" />
          {[0, 1, 2, 3].map((i) => <ellipse key={i} cx={200 + i * 100} cy={672} rx={44} ry={30} fill={i === 2 ? '#b33a3a' : '#d8cbb4'} opacity={0.75} />)}
          {/* spinning wheel silhouette */}
          <g stroke="#0e0906" strokeWidth={14} fill="none">
            <circle cx={wheel.x} cy={wheel.y} r={wheel.r} />
            {[0, 30, 60, 90, 120, 150].map((a) => <line key={a} x1={wheel.x + Math.cos((a * Math.PI) / 180) * wheel.r} y1={wheel.y + Math.sin((a * Math.PI) / 180) * wheel.r} x2={wheel.x - Math.cos((a * Math.PI) / 180) * wheel.r} y2={wheel.y - Math.sin((a * Math.PI) / 180) * wheel.r} strokeWidth={6} />)}
            <line x1={wheel.x} y1={wheel.y} x2={wheel.x - 120} y2={1560} strokeWidth={16} />
            <line x1={wheel.x} y1={wheel.y} x2={wheel.x + 120} y2={1560} strokeWidth={16} />
            <line x1={wheel.x - 160} y1={1500} x2={wheel.x + 220} y2={1440} strokeWidth={22} />
          </g>
          {/* floor */}
          <rect x={0} y={1540} width={W} height={H - 1540} fill="url(#hmFloor)" />
          {/* table */}
          <rect x={420} y={ROOM.table} width={560} height={34} fill="#5a3d28" />
          <rect x={420} y={ROOM.table} width={560} height={6} fill="#c89060" opacity={0.6} />
          <rect x={450} y={ROOM.table + 34} width={26} height={220} fill="#1a110b" />
          <rect x={925} y={ROOM.table + 34} width={26} height={220} fill="#1a110b" />
        </g>
      );
    },
  },
  /** dark foreground framing: beam + bench edge (blurred) */
  'home/fg': {
    blur: 6,
    node: () => (
      <g>
        <path d={`M -40 0 L 150 0 L 120 ${H} L -40 ${H} Z`} fill="#070504" />
        <path d={`M ${W + 40} 1900 Q 900 1830 520 1960 L ${W + 40} 2060 Z`} fill="#0a0705" />
        <path d={`M -40 2000 Q 300 1900 700 2010 L 700 ${H} L -40 ${H} Z`} fill="#060403" />
      </g>
    ),
  },
};
