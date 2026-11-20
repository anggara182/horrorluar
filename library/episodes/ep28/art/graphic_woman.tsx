import React from 'react';

/** Back view of the woman in white with knee-long black hair. Frame coords: x = centre, y = top of head, s = scale (1 => ~1500 px tall).
 *  sway: -1..1 lower-hair sway, part: 0..1 hair parting on the back (reveals only darkness). */
export const WomanBack: React.FC<{ x: number; y: number; s?: number; sway?: number; part?: number; rim?: string; id: string }> = ({ x, y, s = 1, sway = 0, part = 0, rim = '#cfe0f0', id }) => {
  const w = sway * 40;
  const g = part * 78; // half-gap of the parting
  // hair half (left side, mirrored for right). Coordinates relative to head-top centre.
  const half = (dir: 1 | -1) => {
    const k = dir;
    const sw = w;
    return `M ${k * 4} 0 C ${k * 60} -4 ${k * 82} 40 ${k * 84} 100
      C ${k * 88} 160 ${k * 120} 190 ${k * 140} 240
      C ${k * 150} 380 ${k * 132} 560 ${k * 120 + sw * 0.4} 720
      C ${k * 110 + sw * 0.7} 820 ${k * 86 + sw} 900 ${k * 50 + sw} 960
      L ${k * (-8 + g * 0.4) + sw} 940
      C ${k * (-8 + g) + sw * 0.6} 760 ${k * (-8 + g)} 520 ${k * (-8 + g * 0.6)} 300
      L ${k * -8} 140 Z`;
  };
  const strands = [-100, -70, -40, -14, 14, 40, 70, 100];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <linearGradient id={`${id}-dress`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2efe8" />
          <stop offset="0.55" stopColor="#d9d5cc" />
          <stop offset="1" stopColor="#8f9aa6" />
        </linearGradient>
        <linearGradient id={`${id}-dside`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5d6672" stopOpacity={0.55} />
          <stop offset="0.3" stopColor="#5d6672" stopOpacity={0} />
          <stop offset="0.75" stopColor="#5d6672" stopOpacity={0} />
          <stop offset="1" stopColor="#3a414c" stopOpacity={0.6} />
        </linearGradient>
        <radialGradient id={`${id}-hole`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000000" />
          <stop offset="0.7" stopColor="#050506" />
          <stop offset="1" stopColor="#2a2c30" />
        </radialGradient>
      </defs>
      {/* arms hanging (behind dress edges) */}
      <path d="M -150 230 C -175 330 -185 450 -178 560 L -150 600 C -146 500 -140 380 -122 280 Z" fill="#a9a59d" />
      <path d="M 150 230 C 175 330 185 450 178 560 L 150 600 C 146 500 140 380 122 280 Z" fill="#a9a59d" />
      <ellipse cx={-166} cy={612} rx={20} ry={34} fill="#b8b2a7" />
      <ellipse cx={166} cy={612} rx={20} ry={34} fill="#b8b2a7" />
      {/* dress: shoulders, waist, long flared skirt */}
      <path d="M -60 170 C -120 180 -152 205 -158 250 C -150 330 -112 380 -100 470 C -130 700 -190 1000 -230 1330 Q 0 1352 230 1330 C 190 1000 130 700 100 470 C 112 380 150 330 158 250 C 152 205 120 180 60 170 Z" fill={`url(#${id}-dress)`} />
      <path d="M -60 170 C -120 180 -152 205 -158 250 C -150 330 -112 380 -100 470 C -130 700 -190 1000 -230 1330 Q 0 1352 230 1330 C 190 1000 130 700 100 470 C 112 380 150 330 158 250 C 152 205 120 180 60 170 Z" fill={`url(#${id}-dside)`} />
      {/* skirt folds */}
      {[-120, -50, 30, 110].map((fx, i) => <path key={i} d={`M ${fx * 0.4} 560 Q ${fx * 0.8} 900 ${fx * 1.2} 1320`} stroke="#9aa3ad" strokeWidth={6} fill="none" opacity={0.45} />)}
      {/* the hole: only darkness, revealed when hair parts */}
      {part > 0.01 && (
        <g opacity={Math.min(1, part * 2.5)}>
          {/* pale back seen through the parting */}
          <path d={`M 0 ${200} C ${-g * 1.1} 380 ${-g * 1.1} 760 0 ${930} C ${g * 1.1} 760 ${g * 1.1} 380 0 ${200} Z`} fill="#d6d2c9" />
          {/* the hollow: only a deep shadow */}
          <path d={`M 0 ${200} C ${-g * 1.1} 380 ${-g * 1.1} 760 0 ${930}`} stroke={rim} strokeWidth={4} fill="none" opacity={0.5} />
          <path d={`M 0 ${330} C ${-g * 0.75} 450 ${-g * 0.75} 680 0 ${800} C ${g * 0.75} 680 ${g * 0.75} 450 0 ${330} Z`} fill={`url(#${id}-hole)`} />
        </g>
      )}
      {/* neck */}
      <rect x={-26} y={120} width={52} height={70} fill="#2a2522" />
      {/* hair mass */}
      <ellipse cx={0} cy={86} rx={74} ry={92} fill="#060606" />
      <path d={half(-1)} fill="#060606" />
      <path d={half(1)} fill="#060606" />
      {/* strand strokes trailing below */}
      {strands.map((sx, i) => (
        <path key={i} d={`M ${sx * 0.9} 700 C ${sx + w * 0.5} 820 ${sx * 0.7 + w} 900 ${sx * 0.5 + w * 1.3 + (i % 2 ? 6 : -6)} ${1000 + (i % 3) * 30}`} stroke="#060606" strokeWidth={10 - (i % 3) * 2} fill="none" strokeLinecap="round" />
      ))}
      {/* moon rim on hair: crown + outer edges */}
      <path d="M -60 30 C -30 -6 30 -6 60 30" stroke={rim} strokeWidth={5} fill="none" opacity={0.85} strokeLinecap="round" />
      <path d={`M -86 110 C -100 170 -130 200 -142 250 C -152 390 -134 560 ${-122 + w * 0.4} 720`} stroke={rim} strokeWidth={4} fill="none" opacity={0.55} strokeLinecap="round" />
      <path d={`M 86 110 C 100 170 130 200 142 250 C 152 390 134 560 ${122 + w * 0.4} 720`} stroke={rim} strokeWidth={4} fill="none" opacity={0.7} strokeLinecap="round" />
      {[-36, 22, 58].map((sx, i) => <path key={i} d={`M ${sx} 160 C ${sx * 1.1} 360 ${sx * 1.05 + w * 0.4} 600 ${sx * 0.9 + w * 0.8} 820`} stroke={rim} strokeWidth={2} fill="none" opacity={0.18} />)}
    </g>
  );
};

/** Frangipani blossom: 5 cream petals, pink-yellow centre. */
export const Frangi: React.FC<{ x: number; y: number; s?: number; rot?: number; op?: number }> = ({ x, y, s = 1, rot = 0, op = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={op}>
    {[0, 72, 144, 216, 288].map((a) => (
      <path key={a} transform={`rotate(${a})`} d="M 0 0 C -16 -12 -18 -40 -4 -52 C 12 -56 20 -36 8 -6 Z" fill="#f7e7c9" />
    ))}
    <circle r={11} fill="#f5c24a" />
    <circle r={6} fill="#f7a8c4" />
  </g>
);

/** Single drifting petal. */
export const Petal: React.FC<{ x: number; y: number; s?: number; rot?: number; op?: number }> = ({ x, y, s = 1, rot = 0, op = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={op}>
    <path d="M 0 0 C -14 -10 -16 -36 -3 -46 C 11 -49 18 -32 7 -5 Z" fill="#f7e7c9" />
    <path d="M 0 0 C -4 -10 -3 -20 0 -28" stroke="#f5c24a" strokeWidth={4} fill="none" opacity={0.7} />
  </g>
);

/** Satay skewer: stick with 4 glazed meat chunks. Origin = handle end, points along +x. */
export const Skewer: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={0} y={-5} width={420} height={10} rx={5} fill="#c9a06a" />
    {[150, 210, 270, 330].map((cx, i) => (
      <g key={i}>
        <rect x={cx - 26} y={-26} width={52} height={52} rx={14} fill="#6e2f14" />
        <rect x={cx - 22} y={-24} width={44} height={18} rx={9} fill="#b5571f" opacity={0.85} />
        <rect x={cx - 26} y={14} width={52} height={10} rx={5} fill="#2a0f06" opacity={0.7} />
      </g>
    ))}
  </g>
);
