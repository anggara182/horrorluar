import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H } from '../art/world';
import { BedOnBricks } from '../art/graphic_bed';

/** Shared geometry (world space 1296x2304; frame = world - (108,192)). */
export const G_FLOOR = 1580;
export const G_BED = { x0: 340, x1: 960 };
export const G_MOON = { x: 890, y: 930 };
export const G_CANDLE = { x: 212, y: 1500 };

/** Set "graphic" (title, lore, CTA). Static bands baked ONCE to public/baked/graphic/<band>.png. Ids "graphic/<band>". */
export const GRAPHIC: Record<string, BandSpec> = {
  'graphic/room': {
    node: () => (
      <g>
        <defs>
          <linearGradient id="gr-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0b1120" />
            <stop offset="0.6" stopColor="#262b3c" />
            <stop offset="1" stopColor="#151925" />
          </linearGradient>
          <radialGradient id="gr-warm" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#b8805a" stopOpacity={0.55} />
            <stop offset="1" stopColor="#4a4f63" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="gr-moonglow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#9fc4ea" stopOpacity={0.45} />
            <stop offset="1" stopColor="#4a4f63" stopOpacity={0} />
          </radialGradient>
          <linearGradient id="gr-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2a2219" />
            <stop offset="1" stopColor="#07080a" />
          </linearGradient>
          <linearGradient id="gr-shaft" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#9fc4ea" stopOpacity={0.18} />
            <stop offset="1" stopColor="#9fc4ea" stopOpacity={0} />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill="url(#gr-wall)" />
        <ellipse cx={1000} cy={700} rx={420} ry={420} fill="url(#gr-moonglow)" />
        <ellipse cx={240} cy={1360} rx={560} ry={480} fill="url(#gr-warm)" />
        {/* thatch roof underside, top */}
        <path d={`M 0 0 L ${W} 0 L ${W} 330 Q 648 200 0 330 Z`} fill="#16110b" />
        {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M ${i * 260 - 60} 0 L ${i * 230 + 60} 300`} stroke="#5a4a33" strokeWidth={6} opacity={0.35} />)}
        {/* small window with moon */}
        <rect x={G_MOON.x - 120} y={G_MOON.y - 150} width={240} height={290} rx={110} fill="#0d1626" />
        <circle cx={G_MOON.x + 10} cy={G_MOON.y - 30} r={52} fill="#e6eef8" />
        <circle cx={G_MOON.x + 30} cy={G_MOON.y - 42} r={46} fill="#0d1626" opacity={0.0} />
        {[[-80, -110], [70, 80], [-60, 60], [90, -120]].map(([dx, dy], i) => <circle key={i} cx={G_MOON.x + dx} cy={G_MOON.y + dy} r={3} fill="#cfe2f7" />)}
        <rect x={G_MOON.x - 132} y={G_MOON.y - 162} width={264} height={314} rx={120} fill="none" stroke="#1a140e" strokeWidth={24} />
        <path d={`M ${G_MOON.x} ${G_MOON.y - 150} L ${G_MOON.x} ${G_MOON.y + 140} M ${G_MOON.x - 120} ${G_MOON.y} L ${G_MOON.x + 120} ${G_MOON.y}`} stroke="#1a140e" strokeWidth={14} />
        {/* moonlight shaft to the bed */}
        <path d={`M ${G_MOON.x - 110} ${G_MOON.y + 140} L ${G_MOON.x + 110} ${G_MOON.y + 140} L 820 ${G_FLOOR + 160} L 380 ${G_FLOOR + 160} Z`} fill="url(#gr-shaft)" />
        {/* floor */}
        <rect x={0} y={G_FLOOR} width={W} height={H - G_FLOOR} fill="url(#gr-floor)" />
        <path d={`M 0 ${G_FLOOR} L ${W} ${G_FLOOR}`} stroke="#3a2f22" strokeWidth={4} />
        {/* floor mattress hint (right, low) */}
        <rect x={960} y={G_FLOOR + 150} width={340} height={56} rx={20} fill="#4a4f63" />
        <rect x={960} y={G_FLOOR + 150} width={340} height={14} rx={7} fill="#8fa3bf" opacity={0.5} />
        <ellipse cx={1030} cy={G_FLOOR + 146} rx={52} ry={18} fill="#9aa3b4" />
        <BedOnBricks x0={G_BED.x0} x1={G_BED.x1} fy={G_FLOOR} id="gb" />
        {/* candle on a saucer */}
        <ellipse cx={G_CANDLE.x} cy={G_FLOOR - 4} rx={46} ry={10} fill="#3a2f22" />
        <rect x={G_CANDLE.x - 14} y={G_CANDLE.y} width={28} height={G_FLOOR - G_CANDLE.y - 8} rx={4} fill="#efe2c4" />
        <rect x={G_CANDLE.x - 14} y={G_CANDLE.y} width={10} height={G_FLOOR - G_CANDLE.y - 8} fill="#fff6dc" opacity={0.6} />
        {/* aloe in a pot, dark mid-left silhouette */}
        <g fill="#07090a">
          <path d={`M 40 ${G_FLOOR} L 60 ${G_FLOOR - 70} L 130 ${G_FLOOR - 70} L 150 ${G_FLOOR} Z`} />
          {[-40, -20, 0, 20, 40].map((a, i) => <path key={i} d={`M 95 ${G_FLOOR - 70} Q ${95 + a * 2} ${G_FLOOR - 170} ${95 + a * 4.5} ${G_FLOOR - 260 + Math.abs(a) * 2} Q ${95 + a * 1.2} ${G_FLOOR - 150} ${88} ${G_FLOOR - 70} Z`} />)}
        </g>
      </g>
    ),
  },
  'graphic/fg': {
    blur: 6,
    node: () => (
      <g fill="#030405">
        <path d={`M 0 0 L 170 0 Q 120 900 150 ${H} L 0 ${H} Z`} />
        <path d={`M ${W} 0 L ${W - 150} 0 Q ${W - 100} 1000 ${W - 130} ${H} L ${W} ${H} Z`} />
        <path d={`M 0 ${H - 260} Q 648 ${H - 360} ${W} ${H - 240} L ${W} ${H} L 0 ${H} Z`} />
      </g>
    ),
  },
};
