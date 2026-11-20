import React from 'react';

export const RC = {
  moon: '#cfd6e6', dust: '#6e5a44', tree: '#141310', truckB: '#2f6f8f', truckY: '#d9a21b', head: '#fff1c2',
  sari: '#a3162a', sariD: '#5e0b18', gold: '#d9a441', hair: '#0b0a0a', skin: '#8a5a40', kurta: '#c9c2b0', kurtaD: '#6d675c', accent: '#ff6a3d',
};
export const HY = 1080; // horizon (world y)
export const VPX = 648;

/** Woman in red sari, standing; origin at feet centre, height ~ 620*s. facing: 1 = toward camera-ish, -1 = back. */
export const Chudail: React.FC<{ x: number; y: number; s: number; back?: boolean; sway?: number; rim?: string }> = ({ x, y, s, back, sway = 0, rim = RC.moon }) => (
  <g transform={`translate(${x},${y}) scale(${s}) rotate(${sway})`}>
    {/* long hair down the back */}
    <path d="M -34 -560 C -60 -480 -66 -380 -50 -250 L 40 -250 C 52 -380 50 -480 30 -560 Z" fill={RC.hair} />
    {/* skirt of sari: flares to the hem */}
    <path d="M -46 -330 C -60 -220 -80 -100 -92 0 L 92 0 C 82 -100 62 -220 50 -330 Z" fill={RC.sari} />
    <path d="M -92 0 L 92 0 L 90 -16 L -90 -16 Z" fill={RC.gold} />
    {/* pleats */}
    <path d="M 0 -300 L -12 -4 M 18 -280 L 26 -4" stroke={RC.sariD} strokeWidth={6} opacity={0.7} />
    {/* torso */}
    <path d="M -52 -470 C -60 -420 -52 -370 -46 -330 L 50 -330 C 56 -370 62 -420 54 -470 Z" fill={RC.sari} />
    {/* arm */}
    <path d="M 52 -462 C 66 -410 66 -360 54 -300 L 40 -300 C 46 -360 46 -410 40 -455 Z" fill={back ? RC.sariD : RC.skin} />
    {/* head */}
    <ellipse cx={0} cy={-520} rx={30} ry={38} fill={back ? RC.hair : RC.skin} />
    {/* pallu over head and shoulder, diagonal across body */}
    <path d={back ? 'M -40 -548 C -30 -580 32 -582 40 -548 L 58 -470 C 40 -400 -20 -330 -60 -250 L -64 -470 Z' : 'M -38 -540 C -30 -585 34 -585 40 -540 L 18 -515 C 12 -540 -10 -545 -16 -520 L -20 -470 L 58 -470 C 50 -420 -10 -350 -56 -320 L -62 -470 Z'} fill={RC.sari} />
    <path d={back ? 'M -60 -250 C -20 -330 40 -400 58 -470' : 'M -56 -320 C -10 -350 50 -420 58 -470'} stroke={RC.gold} strokeWidth={9} fill="none" />
    {!back && <path d="M -38 -540 C -30 -585 34 -585 40 -540" stroke={RC.gold} strokeWidth={7} fill="none" />}
    {!back && <path d="M -36 -548 C -10 -556 14 -548 6 -528 C -4 -510 -2 -494 -10 -480 L -36 -480 Z" fill={RC.sari} />}
    {!back && <path d="M -36 -548 C -10 -556 14 -548 6 -528 C -4 -510 -2 -494 -10 -480" stroke={RC.gold} strokeWidth={5} fill="none" />}
    {!back && <path d="M -8 -502 Q 2 -496 12 -503" stroke="#3a1a14" strokeWidth={3} fill="none" />}
    {/* rim light on the left edge */}
    <path d="M -38 -540 C -48 -500 -62 -470 -60 -420 C -56 -380 -50 -350 -46 -330 C -60 -220 -80 -100 -92 -18" stroke={rim} strokeWidth={5} fill="none" opacity={0.55} />
  </g>
);

/** Uncle: kurta, side/back. origin feet; height ~ 640*s. step 0..1 animates walk. dir 1 faces right. */
export const Uncle: React.FC<{ x: number; y: number; s: number; step?: number; front?: boolean; torch?: boolean; rim?: string }> = ({ x, y, s, step = 0, front, torch, rim = RC.head }) => {
  const a = Math.sin(step * Math.PI * 2) * 14;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {/* legs */}
      <path d={`M -30 -250 L ${-34 + a} 0 L ${-8 + a} 0 L -6 -250 Z`} fill="#2a2620" />
      <path d={`M 6 -250 L ${10 - a} 0 L ${34 - a} 0 L 30 -250 Z`} fill="#2a2620" />
      {/* kurta */}
      <path d="M -62 -500 C -72 -420 -70 -330 -66 -230 L 66 -230 C 70 -330 72 -420 62 -500 C 30 -520 -30 -520 -62 -500 Z" fill={RC.kurta} />
      <path d="M 10 -500 C 40 -420 50 -320 66 -230 L 66 -230 C 70 -330 72 -420 62 -500 Z" fill={RC.kurtaD} opacity={0.6} />
      {/* arms */}
      <path d={`M -60 -495 C -80 -430 -${80 - a / 2} -360 -${74 - a} -300 L -${56 - a} -300 C -56 -360 -50 -430 -44 -480 Z`} fill={RC.kurta} />
      <path d={torch ? 'M 58 -490 C 90 -450 120 -420 150 -420 L 150 -398 C 112 -398 80 -420 46 -460 Z' : `M 60 -495 C 80 -430 ${80 + a / 2} -360 ${74 + a} -300 L ${56 + a} -300 C 56 -360 50 -430 44 -480 Z`} fill={RC.kurta} />
      {torch && <rect x={146} y={-424} width={36} height={22} rx={6} fill="#222" />}
      {/* neck + head */}
      <rect x={-14} y={-540} width={28} height={40} fill={RC.skin} />
      <ellipse cx={0} cy={-578} rx={38} ry={44} fill={front ? RC.skin : '#1a1412'} />
      <path d="M -38 -590 C -36 -630 36 -630 38 -590 C 30 -604 -30 -604 -38 -590 Z" fill="#1a1412" />
      {front && <path d="M -20 -556 Q 0 -566 20 -556 Q 10 -548 0 -552 Q -10 -548 -20 -556 Z" fill="#1a1412" />}
      <path d="M -38 -590 C -44 -560 -40 -540 -20 -528 M -62 -500 C -72 -420 -70 -330 -66 -230" stroke={rim} strokeWidth={5} fill="none" opacity={0.6} />
    </g>
  );
};

/** Painted truck, 3/4 front view facing camera-left. origin ground centre, width ~760*s. */
export const Truck: React.FC<{ x: number; y: number; s: number; lights?: number; hood?: boolean }> = ({ x, y, s, lights = 0, hood }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={60} cy={6} rx={460} ry={34} fill="#000" opacity={0.45} />
    {/* cargo box (side) */}
    <path d="M -40 -560 L 420 -500 L 420 -110 L -40 -110 Z" fill={RC.truckY} />
    <path d="M -40 -560 L 420 -500 L 420 -470 L -40 -520 Z" fill="#8a5a12" />
    <path d="M 0 -440 L 380 -410 L 380 -330 L 0 -350 Z" fill={RC.truckB} />
    <path d="M 0 -300 L 380 -290 L 380 -180 L 0 -180 Z" fill="#a3162a" opacity={0.8} />
    <circle cx={190} cy={-240} r={36} fill={RC.truckY} />
    {/* cab front */}
    <path d="M -340 -470 L -40 -500 L -40 -110 L -340 -110 Z" fill={RC.truckB} />
    <path d="M -320 -450 L -60 -472 L -60 -330 L -320 -320 Z" fill="#0c1a24" />
    <path d="M -340 -500 L -40 -530 L -40 -500 L -340 -470 Z" fill={RC.truckY} />
    {/* hood */}
    {hood ? <path d="M -360 -300 L -20 -310 L 10 -470 L -330 -460 Z" fill="#24586f" /> : <path d="M -360 -300 L -20 -300 L -20 -250 L -360 -250 Z" fill="#24586f" />}
    <rect x={-360} y={-250} width={340} height={120} fill="#1d4a5d" />
    <rect x={-300} y={-236} width={220} height={60} fill="#0c1a24" />
    <rect x={-370} y={-140} width={360} height={30} fill="#3a3a3a" />
    {/* wheels */}
    <circle cx={-260} cy={-60} r={66} fill="#0c0c0c" /><circle cx={-260} cy={-60} r={24} fill="#3a3a3a" />
    <circle cx={300} cy={-60} r={66} fill="#0c0c0c" /><circle cx={300} cy={-60} r={24} fill="#3a3a3a" />
    {/* headlights */}
    <circle cx={-330} cy={-200} r={22} fill={lights > 0.05 ? RC.head : '#5a5648'} />
    <circle cx={-50} cy={-200} r={22} fill={lights > 0.05 ? RC.head : '#5a5648'} />
    {lights > 0.05 && <g opacity={lights}><circle cx={-330} cy={-200} r={90} fill="url(#hlGlow)" /><circle cx={-50} cy={-200} r={90} fill="url(#hlGlow)" /></g>}
  </g>
);

export const HlDefs = () => (
  <defs>
    <radialGradient id="hlGlow"><stop offset="0" stopColor={RC.head} stopOpacity={0.9} /><stop offset="1" stopColor={RC.head} stopOpacity={0} /></radialGradient>
    <linearGradient id="beam" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor={RC.head} stopOpacity={0.8} /><stop offset="1" stopColor={RC.head} stopOpacity={0} /></linearGradient>
    <radialGradient id="moonGlow"><stop offset="0" stopColor={RC.moon} stopOpacity={0.5} /><stop offset="1" stopColor={RC.moon} stopOpacity={0} /></radialGradient>
  </defs>
);

/** Footprint: toes toward -y when rot=0. */
export const Foot: React.FC<{ x: number; y: number; s: number; rot: number; o?: number; fill?: string }> = ({ x, y, s, rot, o = 1, fill = '#3b2e22' }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`} opacity={o}>
    <path d="M -20 -30 C -26 -60 -14 -86 6 -84 C 24 -82 26 -50 20 -20 C 16 10 18 40 6 60 C -6 76 -24 66 -22 40 C -20 20 -16 0 -20 -30 Z" fill={fill} />
    {[[-14, -104, 9], [0, -110, 8], [12, -106, 7], [22, -98, 6], [28, -86, 5]].map(([a, b, r], i) => <circle key={i} cx={a} cy={b} r={r} fill={fill} />)}
  </g>
);
