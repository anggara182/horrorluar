import React from 'react';

/** Candle standing in a round tray of water. (x,y) = tray centre. flick = flame sway (-1..1), shake = 0..1 extra wobble. */
export const CandleTray: React.FC<{ x: number; y: number; s?: number; t: number; shake?: number; id: string }> = ({ x, y, s = 1, t, shake = 0, id }) => {
  const sway = Math.sin(t * 7.3) * 0.25 + Math.sin(t * 13.1 + 1) * 0.12 + shake * (Math.sin(t * 23) * 0.9 + Math.sin(t * 37 + 2) * 0.5);
  const fh = 120 * (1 + 0.06 * Math.sin(t * 11) - 0.18 * shake * Math.abs(Math.sin(t * 19)));
  const tipX = sway * 34;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <radialGradient id={`${id}-halo`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffd27a" stopOpacity={0.55} />
          <stop offset="0.4" stopColor="#ffbf66" stopOpacity={0.18} />
          <stop offset="1" stopColor="#ffbf66" stopOpacity={0} />
        </radialGradient>
        <linearGradient id={`${id}-wax`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7a5a3a" />
          <stop offset="0.45" stopColor="#f3e2bf" />
          <stop offset="1" stopColor="#8a6a46" />
        </linearGradient>
        <linearGradient id={`${id}-water`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b2a2a" />
          <stop offset="1" stopColor="#0d0e10" />
        </linearGradient>
        <radialGradient id={`${id}-flame`} cx="0.5" cy="0.75" r="0.6">
          <stop offset="0" stopColor="#fffaf0" />
          <stop offset="0.45" stopColor="#ffd27a" />
          <stop offset="1" stopColor="#ff9a3c" />
        </radialGradient>
      </defs>
      <ellipse cx={0} cy={-260} rx={520} ry={520} fill={`url(#${id}-halo)`} opacity={0.9 - 0.25 * shake * Math.abs(Math.sin(t * 17))} />
      {/* tray */}
      <ellipse cx={0} cy={14} rx={300} ry={74} fill="#3a2a1a" />
      <ellipse cx={0} cy={0} rx={300} ry={70} fill="#8a6a40" />
      <ellipse cx={0} cy={4} rx={272} ry={58} fill={`url(#${id}-water)`} />
      {/* flame reflection in water */}
      <ellipse cx={-tipX * 0.4} cy={28} rx={22} ry={34} fill="#ffd27a" opacity={0.45} />
      <ellipse cx={0} cy={22} rx={120 + 12 * Math.sin(t * 2)} ry={14} fill="none" stroke="#ffd27a" strokeOpacity={0.18} strokeWidth={3} />
      {/* candle */}
      <path d="M -42 4 L -42 -230 Q 0 -246 42 -230 L 42 4 Q 0 16 -42 4 Z" fill={`url(#${id}-wax)`} />
      <path d="M -42 -230 Q 0 -246 42 -230 Q 0 -216 -42 -230 Z" fill="#fff4dc" />
      <path d="M 18 -228 Q 24 -190 20 -160" stroke="#fff4dc" strokeWidth={8} strokeLinecap="round" fill="none" />
      <path d="M 0 -232 L 0 -250" stroke="#1a1410" strokeWidth={5} />
      {/* flame */}
      <path d={`M -16 -246 Q -20 ${-246 - fh * 0.45} ${tipX} ${-246 - fh} Q 20 ${-246 - fh * 0.45} 16 -246 Q 0 -232 -16 -246 Z`} fill={`url(#${id}-flame)`} />
      <ellipse cx={0} cy={-254} rx={6} ry={12} fill="#5a7aa8" opacity={0.6} />
    </g>
  );
};

/** Black pig silhouette, side view facing right. (x,y) = feet line centre. */
export const PigSil: React.FC<{ x: number; y: number; s?: number; fill?: string; eye?: number; rim?: string }> = ({ x, y, s = 1, fill = '#0b0b0c', eye = 0, rim }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -230 -40 Q -250 -150 -150 -190 Q -40 -225 90 -200 Q 150 -190 180 -160 L 200 -175 L 214 -150 Q 250 -140 268 -110 L 300 -104 Q 312 -86 300 -70 L 268 -66 Q 250 -40 200 -36 L 180 0 L 150 0 L 140 -36 Q 40 -24 -40 -30 L -60 0 L -92 0 L -100 -36 Q -170 -40 -200 -60 L -214 0 L -244 0 L -238 -60 Q -246 -50 -230 -40 Z" fill={fill} />
    <path d="M -236 -120 Q -270 -126 -262 -96 Q -256 -82 -270 -76" stroke={fill} strokeWidth={8} fill="none" strokeLinecap="round" />
    {rim && <path d="M -150 -190 Q -40 -225 90 -200 Q 150 -190 180 -160 L 200 -175" stroke={rim} strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.8} />}
    {eye > 0 && <circle cx={232} cy={-118} r={7} fill="#ffd166" opacity={eye} />}
  </g>
);

/** Simple gold coin, slightly tilted. */
export const CoinG: React.FC<{ x: number; y: number; r?: number; tilt?: number }> = ({ x, y, r = 40, tilt = 0.45 }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={0} cy={6} rx={r} ry={r * tilt} fill="#5a4214" />
    <ellipse cx={0} cy={0} rx={r} ry={r * tilt} fill="#d9a83c" />
    <ellipse cx={0} cy={0} rx={r * 0.72} ry={r * tilt * 0.72} fill="none" stroke="#8a6420" strokeWidth={3} />
    <ellipse cx={-r * 0.3} cy={-r * tilt * 0.35} rx={r * 0.25} ry={r * tilt * 0.15} fill="#fff1c0" opacity={0.7} />
  </g>
);
