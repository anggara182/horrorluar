import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H } from '../art/world';

/** shared geometry (world px). Lane vanishing point at VP; ground at GY; door of house R at DOOR. */
export const KG = { GY: 1460, VP: { x: 660, y: 1240 }, DOOR: { x: 860, y: 1180, w: 110, h: 270 } };

const banana = (x: number, y: number, s: number, fill: string, key: string) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s})`} fill={fill}>
    <rect x={-10} y={-420} width={20} height={420} />
    <path d="M 0 -420 Q -160 -470 -260 -360 Q -150 -400 0 -400 Z" />
    <path d="M 0 -420 Q 150 -500 270 -400 Q 140 -420 0 -400 Z" />
    <path d="M 0 -415 Q -60 -600 -10 -680 Q -20 -560 6 -420 Z" />
    <path d="M 0 -415 Q 110 -580 220 -600 Q 100 -540 6 -410 Z" />
    <path d="M 0 -410 Q -140 -560 -230 -560 Q -110 -520 -4 -404 Z" />
  </g>
);

const house = (x: number, w: number, top: number, wall: string, roof: string, shutter: string, win: string, key: string, door?: boolean) => (
  <g key={key}>
    <rect x={x} y={top} width={w} height={KG.GY - top} fill={wall} />
    <polygon points={`${x - 50},${top + 6} ${x + w + 50},${top + 6} ${x + w - 40},${top - 150} ${x + 40},${top - 150}`} fill={roof} />
    <rect x={x + w * 0.16} y={top + 70} width={w * 0.24} height={110} fill={win} />
    <rect x={x + w * 0.16} y={top + 70} width={w * 0.12} height={110} fill={shutter} />
    {door && <rect x={KG.DOOR.x} y={KG.DOOR.y} width={KG.DOOR.w} height={KG.DOOR.h} fill={shutter} />}
  </g>
);

const scene = (dawn: boolean) => {
  const sky = dawn ? ['#2f3a52', '#7a7f8e', '#d8b08a'] : ['#05070d', '#0f1524', '#27324a'];
  const sil = dawn ? '#1f242c' : '#060a0c';
  const wall = dawn ? '#8d8576' : '#3e4655';
  const wall2 = dawn ? '#6e695f' : '#2b313d';
  const roof = dawn ? '#3a2e2a' : '#101318';
  const sh = dawn ? '#4a3424' : '#1e160f';
  const win = dawn ? '#2a2826' : '#0b0c10';
  const mud = dawn ? ['#6a5a48', '#3a3127'] : ['#1d1914', '#0c0a08'];
  return (
    <g>
      <defs>
        <linearGradient id={`kSky${dawn}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={sky[0]} /><stop offset="0.55" stopColor={sky[1]} /><stop offset="1" stopColor={sky[2]} /></linearGradient>
        <linearGradient id={`kMud${dawn}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={mud[0]} /><stop offset="1" stopColor={mud[1]} /></linearGradient>
        <radialGradient id={`kMoon${dawn}`}><stop offset="0" stopColor={dawn ? '#ffe2b8' : '#b9c6dc'} stopOpacity={dawn ? 0.8 : 0.45} /><stop offset="1" stopColor={dawn ? '#ffe2b8' : '#b9c6dc'} stopOpacity="0" /></radialGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill={`url(#kSky${dawn})`} />
      <circle cx={KG.VP.x} cy={KG.VP.y - 60} r={520} fill={`url(#kMoon${dawn})`} />
      {!dawn && <circle cx={840} cy={600} r={34} fill="#d7dde8" opacity={0.85} />}
      {/* far trees */}
      <path d={`M 0 1300 Q 160 1150 300 1240 Q 420 1120 560 1220 Q 660 1180 760 1220 Q 900 1110 1040 1230 Q 1180 1150 ${W} 1250 L ${W} ${KG.GY} L 0 ${KG.GY} Z`} fill={sil} opacity={0.7} />
      {/* lane ground */}
      <rect x={0} y={KG.GY - 40} width={W} height={H - KG.GY + 40} fill={`url(#kMud${dawn})`} />
      <path d={`M ${KG.VP.x - 40} ${KG.GY - 30} L ${KG.VP.x + 40} ${KG.GY - 30} L ${W + 200} ${H} L -200 ${H} Z`} fill={dawn ? '#7a6a55' : '#2a241c'} opacity={0.55} />
      {/* puddles */}
      <ellipse cx={560} cy={1760} rx={160} ry={22} fill={dawn ? '#b8a690' : '#3a4458'} opacity={0.5} />
      <ellipse cx={820} cy={1980} rx={220} ry={30} fill={dawn ? '#b8a690' : '#3a4458'} opacity={0.4} />
      {/* houses: left row and right row */}
      {house(-80, 420, 1150, wall2, roof, sh, win, 'hl1')}
      {house(380, 200, 1260, wall2, roof, sh, win, 'hl2')}
      {house(760, 420, 1150, wall, roof, sh, win, 'hr1', true)}
      {house(1140, 300, 1080, wall2, roof, sh, win, 'hr2')}
      {banana(330, KG.GY, 1.0, sil, 'b1')}
      {banana(1190, KG.GY + 20, 1.2, sil, 'b2')}
    </g>
  );
};

const fg = () => (
  <g fill="#030405">
    <path d={`M 0 0 L 0 ${H} L 120 ${H} Q 60 1600 150 1100 Q 70 900 180 600 Q 100 400 0 0 Z`} />
    <path d="M 0 500 Q 260 560 380 760 Q 220 660 0 680 Z" />
    <path d="M 0 900 Q 300 940 420 1180 Q 240 1020 0 1060 Z" />
    <path d={`M ${W} 300 Q 1040 360 960 560 Q 1100 460 ${W} 480 Z`} />
    <path d={`M ${W} ${H} L ${W} 1700 Q 1150 1900 1100 ${H} Z`} />
  </g>
);

/** Set "kampung". Static bands baked ONCE to public/baked/kampung/<band>.png. */
export const KAMPUNG: Record<string, BandSpec> = {
  'kampung/night': { node: () => scene(false) },
  'kampung/dawn': { node: () => scene(true) },
  'kampung/fg': { blur: 4, node: fg },
};
