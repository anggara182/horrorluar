import React from 'react';

/** Glow defs used by live layers (radial gradients only). */
export const KDefs: React.FC = () => (
  <defs>
    <radialGradient id="kLamp"><stop offset="0" stopColor="#ffe2a8" stopOpacity="0.95" /><stop offset="0.25" stopColor="#ffbf66" stopOpacity="0.55" /><stop offset="1" stopColor="#ffbf66" stopOpacity="0" /></radialGradient>
    <radialGradient id="kDim"><stop offset="0" stopColor="#ffbf66" stopOpacity="0.35" /><stop offset="1" stopColor="#ffbf66" stopOpacity="0" /></radialGradient>
  </defs>
);

/** Villager silhouette (feet at x,y, ~380 tall at s=1) with sarong + peci; lamp held at side. flicker 0..1. */
export const Villager: React.FC<{ x: number; y: number; s?: number; lamp?: boolean; flick?: number; flip?: boolean; lean?: number; fill?: string; rim?: string; peci?: boolean }> = ({ x, y, s = 1, lamp = true, flick = 0, flip, lean = 0, fill = '#050608', rim = '#ffbf66', peci = true }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    {lamp && <circle cx={58} cy={-170} r={150 + 12 * flick} fill="url(#kLamp)" />}
    <g transform={`rotate(${lean} 0 0)`} fill={fill}>
      {/* sarong (trapezoid) + feet */}
      <path d="M -34 -170 L 34 -170 L 40 -8 L -40 -8 Z" />
      <ellipse cx={-16} cy={-4} rx={18} ry={6} /><ellipse cx={18} cy={-4} rx={18} ry={6} />
      {/* torso */}
      <path d="M -46 -300 Q -48 -318 -24 -322 L 24 -322 Q 48 -318 46 -300 L 36 -165 L -36 -165 Z" />
      {/* neck + head */}
      <rect x={-9} y={-338} width={18} height={20} />
      <ellipse cx={0} cy={-358} rx={20} ry={25} />
      {peci && <path d="M -21 -366 L -19 -390 Q 0 -396 19 -390 L 21 -366 Z" />}
      {/* back arm hanging */}
      <path d="M -44 -308 Q -58 -240 -50 -180 L -36 -180 Q -40 -240 -30 -300 Z" />
      {/* lamp arm: bent elbow, hand out front */}
      <path d="M 40 -310 Q 56 -260 50 -220 L 60 -200 L 70 -206 L 64 -226 Q 66 -262 50 -306 Z" />
      {lamp && <g>
        <path d="M 60 -206 L 60 -196" stroke={fill} strokeWidth={3} />
        <path d="M 48 -196 L 72 -196 L 68 -160 L 52 -160 Z" fill="#2a1d12" />
        <ellipse cx={60} cy={-176} rx={7} ry={12 + 2 * flick} fill="#ffd9a0" />
      </g>}
    </g>
    {lamp && <path d="M 40 -300 Q 52 -250 48 -214 M 36 -170 L 40 -12 M 24 -322 Q 44 -318 46 -300" stroke={rim} strokeWidth={3} fill="none" opacity={0.55} />}
  </g>
);

/** Black pig, facing RIGHT (flip for left), feet at x,y, ~260 long at s=1. ph = walk phase, sniff 0..1 lowers snout. */
export const Pig: React.FC<{ x: number; y: number; s?: number; ph?: number; sniff?: number; flip?: boolean; eye?: number; sheen?: string }> = ({ x, y, s = 1, ph = 0, sniff = 0, flip, eye = 1, sheen = '#55606b' }) => {
  const a = Math.sin(ph) * 14, b = -a;
  const leg = (lx: number, ang: number, k: string) => <path key={k} d="M -9 0 L 9 0 L 7 52 L -7 52 Z" transform={`translate(${lx} -56) rotate(${ang})`} />;
  const hd = 10 * sniff;
  return (
    <g transform={`translate(${x} ${y - Math.abs(Math.sin(ph)) * 3 * s}) scale(${flip ? -s : s} ${s})`}>
      <g fill="#0b0b0c">
        {leg(-80, a, 'l1')}{leg(-56, b, 'l2')}{leg(70, b, 'l3')}{leg(92, a, 'l4')}
        {/* body */}
        <path d="M -128 -96 Q -146 -186 -50 -192 Q 50 -198 104 -150 Q 130 -128 124 -84 Q 118 -48 70 -44 L -90 -44 Q -134 -52 -128 -96 Z" />
        {/* bristle ridge */}
        <path d="M -90 -184 L -84 -198 L -76 -188 L -66 -202 L -58 -190 L -46 -204 L -38 -192 L -26 -204 L -18 -192 L -6 -202 L 4 -190 Z" />
        {/* tail */}
        <path d="M -132 -110 Q -156 -118 -150 -98 Q -146 -88 -158 -84" stroke="#0b0b0c" strokeWidth={5} fill="none" />
        {/* head + snout, lowered by sniff */}
        <g transform={`rotate(${hd} 110 -110)`}>
          <path d="M 96 -146 Q 150 -150 176 -104 L 196 -90 Q 202 -72 190 -66 L 150 -66 Q 112 -70 98 -84 Z" />
          <ellipse cx={194} cy={-80} rx={9} ry={14} fill="#1b1b1e" />
          <path d="M 116 -140 L 104 -186 L 150 -150 Z" />
          <circle cx={156} cy={-112} r={4} fill="#ffcf7a" opacity={eye} />
        </g>
      </g>
      {/* wet sheen */}
      <path d="M -112 -150 Q -40 -186 92 -146" stroke={sheen} strokeWidth={5} fill="none" opacity={0.75} strokeLinecap="round" />
      <path d={`M 100 -144 Q 150 -146 172 -110`} stroke={sheen} strokeWidth={4} fill="none" opacity={0.6} strokeLinecap="round" transform={`rotate(${hd} 110 -110)`} />
    </g>
  );
};
