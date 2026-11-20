import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H } from '../art/world';

/** Set "street": village road at night. Shared layout (world px). */
export const ST = {
  hz: 1180, // horizon
  vx: 700, // vanishing point x
  lamp: { x: 300, top: 760, base: 1560 },
  tree: { x: 1010, base: 1500 },
};

export const banana = (x: number, y: number, s: number, flip = 1, fill = '#060a0c') => (
  <g transform={`translate(${x} ${y}) scale(${s * flip} ${s})`} fill={fill}>
    <path d="M -10 0 L -6 -260 L 6 -260 L 10 0 Z" />
    <path d="M 0 -250 C 60 -330 160 -330 230 -270 C 150 -280 80 -260 0 -235 Z" />
    <path d="M 0 -255 C -50 -350 -150 -370 -220 -330 C -140 -320 -70 -290 0 -240 Z" />
    <path d="M 0 -262 C 20 -380 80 -440 150 -460 C 90 -400 50 -330 6 -250 Z" />
    <path d="M 0 -258 C -30 -380 -90 -430 -150 -440 C -90 -380 -40 -320 -4 -250 Z" />
    <path d="M 0 -240 C 70 -230 130 -190 170 -120 C 110 -170 60 -200 0 -225 Z" />
  </g>
);

export const STREET: Record<string, BandSpec> = {
  'street/sky': {
    node: () => (
      <>
        <defs>
          <linearGradient id="stSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#07080f" />
            <stop offset="0.35" stopColor="#141a2e" />
            <stop offset="0.52" stopColor="#2d3550" />
            <stop offset="0.56" stopColor="#3a3c52" />
          </linearGradient>
          <radialGradient id="stMoon" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#dfe6f2" stopOpacity="0.55" />
            <stop offset="0.3" stopColor="#8a9ac0" stopOpacity="0.18" />
            <stop offset="1" stopColor="#8a9ac0" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill="url(#stSky)" />
        <circle cx={ST.vx} cy={ST.hz - 120} r={520} fill="url(#stMoon)" />
        <circle cx={ST.vx + 40} cy={ST.hz - 330} r={34} fill="#eef1f6" opacity={0.85} />
        <path d={`M 0 ${ST.hz} L 0 ${ST.hz - 150} C 80 ${ST.hz - 230} 160 ${ST.hz - 170} 230 ${ST.hz - 220} C 320 ${ST.hz - 280} 420 ${ST.hz - 160} 520 ${ST.hz - 120} L 620 ${ST.hz - 70} L 790 ${ST.hz - 80} C 880 ${ST.hz - 190} 980 ${ST.hz - 260} 1080 ${ST.hz - 200} C 1170 ${ST.hz - 250} 1240 ${ST.hz - 190} ${W} ${ST.hz - 220} L ${W} ${ST.hz} Z`} fill="#121522" />
        <rect y={ST.hz} width={W} height={H - ST.hz} fill="#15171d" />
      </>
    ),
  },
  'street/road': {
    node: () => (
      <>
        <defs>
          <linearGradient id="stRoad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3a3d47" />
            <stop offset="0.4" stopColor="#24262b" />
            <stop offset="1" stopColor="#141518" />
          </linearGradient>
          <linearGradient id="stVerge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#151a1a" />
            <stop offset="1" stopColor="#07090a" />
          </linearGradient>
          <radialGradient id="stLampPool" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffd9a0" stopOpacity="0.4" />
            <stop offset="0.6" stopColor="#ffd9a0" stopOpacity="0.1" />
            <stop offset="1" stopColor="#ffd9a0" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="stLampGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#fff3d8" stopOpacity="0.9" />
            <stop offset="0.25" stopColor="#ffd9a0" stopOpacity="0.35" />
            <stop offset="1" stopColor="#ffd9a0" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect y={ST.hz} width={W} height={H - ST.hz} fill="url(#stVerge)" />
        <polygon points={`${ST.vx - 18},${ST.hz} ${ST.vx + 18},${ST.hz} ${W + 300},${H} ${-300},${H}`} fill="url(#stRoad)" />
        {[0, 1, 2, 3, 4].map((i) => {
          const a = Math.pow((i + 0.5) / 5, 1.8), b = Math.pow((i + 0.8) / 5, 1.8);
          const y1 = ST.hz + a * (H - ST.hz), y2 = ST.hz + b * (H - ST.hz);
          const w1 = 2 + a * 16, w2 = 2 + b * 16;
          return <polygon key={i} points={`${ST.vx - w1},${y1} ${ST.vx + w1},${y1} ${ST.vx + w2},${y2} ${ST.vx - w2},${y2}`} fill="#6a6a66" opacity={0.35} />;
        })}
        <polygon points={`0,${ST.hz + 150} ${ST.vx - 120},${ST.hz + 6} ${ST.vx - 120},${ST.hz - 20} 0,${ST.hz + 40}`} fill="#2a2a2e" />
        <polygon points={`0,${ST.hz + 40} ${ST.vx - 120},${ST.hz - 20} ${ST.vx - 120},${ST.hz - 26} 0,${ST.hz + 24}`} fill="#4a4740" />
        <polygon points={`${W},${ST.hz + 170} ${ST.vx + 110},${ST.hz + 6} ${ST.vx + 110},${ST.hz - 16} ${W},${ST.hz + 60}`} fill="#222327" />
        {banana(140, ST.hz + 60, 1.25, 1)}
        {banana(420, ST.hz + 10, 0.7, -1)}
        {banana(560, ST.hz - 4, 0.45, 1)}
        {banana(840, ST.hz, 0.5, -1)}
        {banana(1240, ST.hz + 80, 1.3, -1)}
        <ellipse cx={ST.lamp.x + 60} cy={ST.lamp.base + 10} rx={360} ry={90} fill="url(#stLampPool)" />
        <rect x={ST.lamp.x - 9} y={ST.lamp.top} width={18} height={ST.lamp.base - ST.lamp.top} fill="#0a0b0e" />
        <path d={`M ${ST.lamp.x} ${ST.lamp.top + 10} Q ${ST.lamp.x + 40} ${ST.lamp.top - 30} ${ST.lamp.x + 90} ${ST.lamp.top - 10}`} stroke="#0a0b0e" strokeWidth={10} fill="none" />
        <circle cx={ST.lamp.x + 92} cy={ST.lamp.top + 8} r={200} fill="url(#stLampGlow)" />
        <rect x={ST.lamp.x + 72} y={ST.lamp.top - 8} width={40} height={18} rx={6} fill="#fff1d2" />
        <g fill="#0b0c0e">
          <path d={`M ${ST.tree.x - 30} ${ST.tree.base} C ${ST.tree.x - 20} ${ST.tree.base - 200} ${ST.tree.x - 10} ${ST.tree.base - 330} ${ST.tree.x} ${ST.tree.base - 400} L ${ST.tree.x + 28} ${ST.tree.base - 400} C ${ST.tree.x + 30} ${ST.tree.base - 300} ${ST.tree.x + 40} ${ST.tree.base - 200} ${ST.tree.x + 40} ${ST.tree.base} Z`} />
          <path d={`M ${ST.tree.x + 5} ${ST.tree.base - 390} C ${ST.tree.x - 60} ${ST.tree.base - 480} ${ST.tree.x - 160} ${ST.tree.base - 520} ${ST.tree.x - 230} ${ST.tree.base - 600}`} stroke="#0b0c0e" strokeWidth={22} fill="none" />
          <path d={`M ${ST.tree.x + 15} ${ST.tree.base - 395} C ${ST.tree.x + 40} ${ST.tree.base - 520} ${ST.tree.x + 20} ${ST.tree.base - 600} ${ST.tree.x + 40} ${ST.tree.base - 700}`} stroke="#0b0c0e" strokeWidth={20} fill="none" />
          <path d={`M ${ST.tree.x + 22} ${ST.tree.base - 395} C ${ST.tree.x + 110} ${ST.tree.base - 460} ${ST.tree.x + 170} ${ST.tree.base - 520} ${ST.tree.x + 230} ${ST.tree.base - 560}`} stroke="#0b0c0e" strokeWidth={18} fill="none" />
          {[[-230, -600], [40, -700], [230, -560], [-120, -520], [130, -500]].map(([dx, dy], i) => (
            <ellipse key={i} cx={ST.tree.x + dx} cy={ST.tree.base + dy - 30} rx={120} ry={70} />
          ))}
        </g>
        {[[-260, -640], [-200, -610], [-150, -560], [10, -740], [70, -720], [40, -680], [200, -600], [260, -580], [150, -530], [-90, -560], [110, -540]].map(([dx, dy], i) => (
          <g key={i} transform={`translate(${ST.tree.x + dx} ${ST.tree.base + dy})`}>
            {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={0} cy={-9} rx={6} ry={10} fill="#f2e9dc" transform={`rotate(${a + i * 13})`} />)}
            <circle r={4} fill="#f4c46a" />
          </g>
        ))}
      </>
    ),
  },
  'street/house': {
    node: () => (
      <>
        <defs>
          <radialGradient id="stWin" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffcf86" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ffcf86" stopOpacity="0" />
          </radialGradient>
        </defs>
        <polygon points="300,1180 650,960 1000,1180" fill="#0d0e12" />
        <rect x={340} y={1170} width={620} height={330} fill="#16171c" />
        <circle cx={475} cy={1305} r={220} fill="url(#stWin)" />
        <rect x={420} y={1240} width={110} height={130} fill="#ffcf86" opacity={0.85} />
        <line x1={475} y1={1240} x2={475} y2={1370} stroke="#2a2218" strokeWidth={8} />
        <rect x={720} y={1260} width={110} height={240} fill="#0a0a0d" />
        <rect x={0} y={1420} width={430} height={170} fill="#25252a" />
        <rect x={0} y={1410} width={430} height={18} fill="#3e3c38" />
        <rect x={900} y={1420} width={W - 900} height={170} fill="#25252a" />
        <rect x={900} y={1410} width={W - 900} height={18} fill="#3e3c38" />
        <rect x={430} y={1340} width={40} height={250} fill="#2e2d30" />
        <rect x={860} y={1340} width={40} height={250} fill="#2e2d30" />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => <rect key={i} x={490 + i * 42} y={1420} width={10} height={160} fill="#101114" />)}
        <rect x={470} y={1440} width={390} height={10} fill="#101114" />
        <rect x={470} y={1540} width={390} height={10} fill="#101114" />
        <rect x={0} y={1590} width={W} height={H - 1590} fill="#1b1c20" />
        {banana(100, 1440, 1.3, 1)}
        {banana(1180, 1430, 1.2, -1)}
      </>
    ),
  },
  'street/fg': {
    blur: 3,
    node: () => (
      <>
        {banana(-60, 2350, 2.3, 1, '#030405')}
        {banana(1360, 2380, 2.2, -1, '#030405')}
      </>
    ),
  },
};
