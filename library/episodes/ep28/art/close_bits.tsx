import React from 'react';

/** Frangipani blossom: 5 overlapping petals, pink-yellow centre. Centred at x,y. */
export const Frangi: React.FC<{ x: number; y: number; s?: number; rot?: number; tint?: string; shade?: string; op?: number }> = ({ x, y, s = 1, rot = 0, tint = '#f7e7c9', shade = '#c9b8a0', op = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`} opacity={op}>
    {[0, 72, 144, 216, 288].map((a) => (
      <g key={a} transform={`rotate(${a})`}>
        <path d="M0,0 C-14,-22 -30,-58 -12,-74 C6,-86 30,-70 22,-44 C16,-24 8,-10 0,0 Z" fill={tint} />
        <path d="M0,0 C6,-14 14,-30 18,-46" stroke={shade} strokeWidth={2.5} fill="none" opacity={0.6} />
      </g>
    ))}
    <circle r={16} fill="#f5c84a" />
    <circle r={8} fill="#f0a0b4" />
  </g>
);

/** A single loose petal (teardrop). */
export const Petal: React.FC<{ x: number; y: number; s?: number; rot?: number; fill?: string; op?: number }> = ({ x, y, s = 1, rot = 0, fill = '#f7e7c9', op = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`} opacity={op}>
    <path d="M0,0 C-16,-20 -26,-52 -8,-66 C8,-76 28,-58 18,-34 C12,-18 6,-8 0,0 Z" fill={fill} />
    <path d="M0,0 C-2,-10 -1,-20 2,-28" stroke="#f5c84a" strokeWidth={6} fill="none" opacity={0.7} />
  </g>
);
