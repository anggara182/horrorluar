import React from 'react';

/** Goat seen side-on, feet at (x,y). s = scale, dir 1 faces right. graze 0..1 lowers head. */
export const Goat: React.FC<{ x: number; y: number; s?: number; dir?: number; graze?: number; leg?: number; c?: string }> = ({ x, y, s = 1, dir = 1, graze = 0, leg = 0, c = '#e7e2d6' }) => {
  const hy = -62 + graze * 34;
  const l = Math.sin(leg) * 8;
  return (
    <g transform={`translate(${x},${y}) scale(${s * dir},${s})`}>
      <ellipse cx={0} cy={-46} rx={38} ry={20} fill={c} />
      <g stroke={c} strokeWidth={7} strokeLinecap="round">
        <line x1={-26} y1={-34} x2={-28 + l} y2={0} /><line x1={-16} y1={-34} x2={-14 - l} y2={0} />
        <line x1={20} y1={-34} x2={22 - l} y2={0} /><line x1={28} y1={-34} x2={30 + l} y2={0} />
      </g>
      <path d={`M28,-58 L44,${hy + 6} L52,${hy + 2} L58,${hy + 16} L46,${hy + 22} L30,-40 Z`} fill={c} />
      <path d={`M48,${hy + 2} Q44,${hy - 16} 34,${hy - 18}`} stroke="#6b5a44" strokeWidth={4} fill="none" />
      <path d={`M-36,-56 L-46,-66`} stroke={c} strokeWidth={6} strokeLinecap="round" />
      <circle cx={40} cy={-34 + graze * 10} r={4} fill="#c9a24a" />
      <path d="M-30,-30 Q0,-24 30,-30" stroke="#a69f90" strokeWidth={4} fill="none" opacity={0.6} />
    </g>
  );
};

/** Boy (~16) from the side: cap, wool sweater, herding stick. Feet at (x,y), height h. run 0..1 = running pose with phase. */
export const Boy: React.FC<{ x: number; y: number; h: number; dir?: number; run?: number; phase?: number; rim?: string }> = ({ x, y, h, dir = 1, run = 0, phase = 0, rim = '#ffd98a' }) => {
  const s = h / 200;
  const sw = Math.sin(phase) * (6 + run * 30);
  const lean = run * 12;
  const ink = '#141a16', sweater = '#3d3b52';
  return (
    <g transform={`translate(${x},${y}) scale(${s * dir},${s})`}>
      <g transform={`rotate(${lean},0,-100)`}>
        {/* legs */}
        <path d={`M-6,-92 L${-8 - sw},-46 L${-6 - sw * 1.4},0`} stroke={ink} strokeWidth={15} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M6,-92 L${8 + sw},-46 L${10 + sw * 1.2},0`} stroke={ink} strokeWidth={15} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {/* torso */}
        <path d="M-20,-160 Q-24,-120 -16,-88 L16,-88 Q22,-120 18,-160 Q0,-168 -20,-160 Z" fill={sweater} />
        {/* arm + stick */}
        <path d={`M8,-150 L${16 + sw * 0.5},-118 L${30 + run * 14},-108`} stroke={sweater} strokeWidth={13} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <line x1={34 - run * 40} y1={-180 + run * 60} x2={26 + run * 40} y2={-6 - run * 60} stroke="#5a4028" strokeWidth={5} strokeLinecap="round" />
        <path d={`M-10,-150 L${-16 - sw * 0.5},-118 L${-12 - sw * 0.6},-96`} stroke={sweater} strokeWidth={12} fill="none" strokeLinecap="round" />
        {/* head + cap */}
        <rect x={-6} y={-174} width={12} height={14} fill="#c79a7a" />
        <ellipse cx={2} cy={-186} rx={14} ry={16} fill="#c79a7a" />
        <path d="M-14,-190 Q0,-210 16,-192 L28,-188 L16,-186 Z" fill="#6b2e2a" />
        <path d="M-12,-184 Q-16,-176 -10,-170" stroke="#5a3a24" strokeWidth={6} fill="none" />
        {/* rim on the sun side */}
        <path d="M18,-160 Q22,-120 16,-88" stroke={rim} strokeWidth={4} fill="none" />
        <path d="M14,-196 Q18,-186 15,-176" stroke={rim} strokeWidth={3} fill="none" />
      </g>
    </g>
  );
};

/** The huldra, pale, partly hidden between pines. Feet at (x,y), height h. */
export const Huldra: React.FC<{ x: number; y: number; h: number; o?: number; sway?: number }> = ({ x, y, h, o = 1, sway = 0 }) => {
  const s = h / 300;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} opacity={o}>
      <defs><radialGradient id="hglow"><stop offset="0" stopColor="#fff2cf" stopOpacity="0.45" /><stop offset="1" stopColor="#fff2cf" stopOpacity="0" /></radialGradient></defs>
      <ellipse cx={0} cy={-170} rx={120} ry={200} fill="url(#hglow)" />
      <path d={`M-20,-232 Q-34,-150 -50,0 L50,0 Q34,-150 20,-232 Z`} fill="#d9d1bf" />
      <path d="M-20,-232 Q-26,-180 -30,-120" stroke="#b9b09c" strokeWidth={6} fill="none" />
      <ellipse cx={0} cy={-256} rx={17} ry={21} fill="#e6d4be" />
      <path d={`M-22,-262 Q0,-292 22,-262 Q30,-200 ${26 + sway},-140 L${14 + sway},-150 Q14,-220 0,-240 Q-14,-220 ${-14 + sway},-150 L${-26 + sway},-140 Q-30,-200 -22,-262 Z`} fill="#e8c873" />
      <path d={`M24,-250 Q30,-200 ${26 + sway},-142`} stroke="#fff0b8" strokeWidth={3} fill="none" />
    </g>
  );
};
