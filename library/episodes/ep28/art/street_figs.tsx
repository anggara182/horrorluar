import React from 'react';

/** Figures for set "street". All drawn with feet at (0,0), ~1000 units tall; place via transform. */

export const FigDefs: React.FC = () => (
  <defs>
    <linearGradient id="sfDress" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#9a98a0" />
      <stop offset="0.55" stopColor="#e8e4dc" />
      <stop offset="1" stopColor="#f6f1e6" />
    </linearGradient>
    <radialGradient id="sfVoid" cx="0.5" cy="0.45" r="0.5">
      <stop offset="0" stopColor="#000000" />
      <stop offset="0.7" stopColor="#050506" />
      <stop offset="1" stopColor="#1a1a1e" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="sfAura" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#dfe6f2" stopOpacity="0.28" />
      <stop offset="1" stopColor="#dfe6f2" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="sfFire" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#ffb070" stopOpacity="0.85" />
      <stop offset="0.35" stopColor="#ff7a2f" stopOpacity="0.35" />
      <stop offset="1" stopColor="#ff7a2f" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="sfKero" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#fff0c8" stopOpacity="0.9" />
      <stop offset="0.3" stopColor="#ffd9a0" stopOpacity="0.3" />
      <stop offset="1" stopColor="#ffd9a0" stopOpacity="0" />
    </radialGradient>
  </defs>
);

/** The sundel bolong. view back|side(facing left). lift 0..1 = hair lifting to reveal the dark hollow. sway = hair wind. */
export const Woman: React.FC<{ x: number; y: number; h: number; view?: 'back' | 'side'; lift?: number; sway?: number; aura?: boolean }> = ({ x, y, h, view = 'back', lift = 0, sway = 0, aura = true }) => {
  const s = h / 1000;
  const L = lift;
  const hb = -280 - L * 360; // hair bottom
  const hw = 92 + L * 110;
  const sw = sway * 30;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {aura && <ellipse cx={0} cy={-520} rx={420} ry={620} fill="url(#sfAura)" />}
      <ellipse cx={20} cy={0} rx={190} ry={22} fill="#000" opacity={0.45} />
      {/* dress */}
      <path d="M -72 -830 C -100 -700 -112 -400 -160 -10 Q 0 10 160 -10 C 112 -400 100 -700 72 -830 Q 0 -850 -72 -830 Z" fill="url(#sfDress)" />
      <path d="M -40 -600 C -50 -400 -60 -200 -70 -10" stroke="#b8b4ae" strokeWidth={6} fill="none" opacity={0.6} />
      <path d="M 40 -560 C 50 -380 60 -200 80 -10" stroke="#c8c4bc" strokeWidth={5} fill="none" opacity={0.5} />
      {view === 'back' ? (
        <>
          {L > 0.01 && <ellipse cx={0} cy={-560} rx={62} ry={150 * Math.min(1, L * 1.3)} fill="url(#sfVoid)" opacity={Math.min(1, L * 1.6)} />}
          <path d={`M -48 -985 C -100 -940 -104 -720 -108 -520 C ${-110 - L * 60 + sw} ${hb + 120} ${-hw + sw} ${hb + 20} ${-hw + 10 + sw} ${hb} Q ${sw} ${hb + 30 - L * 60} ${hw - 10 + sw} ${hb} C ${hw + sw} ${hb + 20} ${110 + L * 60 + sw} ${hb + 120} 108 -520 C 104 -720 100 -940 48 -985 Q 0 -1005 -48 -985 Z`} fill="#060606" />
          {[-60, -30, 0, 30, 60].map((dx, i) => (
            <path key={i} d={`M ${dx * 0.6} -940 C ${dx} -700 ${dx * 1.1 + sw * 0.6} -500 ${dx * (1 + L) + sw} ${hb + 15}`} stroke="#1d1d22" strokeWidth={4} fill="none" />
          ))}
          <path d={`M 50 -980 C 100 -920 104 -720 106 -520 C 108 -420 ${hw + sw} ${hb + 30} ${hw - 10 + sw} ${hb}`} stroke="#cfd6e6" strokeWidth={5} fill="none" opacity={0.55} />
        </>
      ) : (
        <>
          {/* side, facing left: hair falls down her back */}
          <path d={`M -20 -1000 C 40 -1010 80 -960 82 -880 C 95 -700 110 -500 ${100 + sw} -300 L ${30 + sw} -290 C 50 -500 40 -700 30 -860 L -30 -900 Z`} fill="#060606" />
          <ellipse cx={-14} cy={-925} rx={36} ry={50} fill="#e2dbd0" />
          <path d="M -44 -930 Q -52 -918 -46 -905" stroke="#b9b0a4" strokeWidth={4} fill="none" />
          <path d="M -50 -960 C -40 -1000 10 -1012 50 -990 C 20 -985 -10 -980 -36 -950 Z" fill="#060606" />
          <path d="M -36 -880 L 20 -880 L 20 -840 L -30 -840 Z" fill="#d8d1c6" />
          <path d={`M 84 -880 C 98 -700 110 -500 ${100 + sw} -300`} stroke="#cfd6e6" strokeWidth={4} fill="none" opacity={0.5} />
          {/* arm */}
          <path d="M -40 -800 C -70 -700 -80 -620 -60 -540 L -40 -540 C -50 -620 -40 -700 -20 -790 Z" fill="#d6d1c8" />
        </>
      )}
    </g>
  );
};

/** Satay seller (father), side view facing right. walk = phase in radians, fan = fanning amount (0 none). */
export const Father: React.FC<{ x: number; y: number; h: number; walk?: number; push?: boolean; flip?: boolean; run?: boolean }> = ({ x, y, h, walk = 0, push = true, flip = false, run = false }) => {
  const s = h / 1000;
  const a = Math.sin(walk) * (run ? 40 : 22);
  const lean = run ? 14 : 6;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <ellipse cx={0} cy={0} rx={150} ry={18} fill="#000" opacity={0.4} />
      {/* legs */}
      <path d={`M -20 -300 L ${-30 + a * 3} -20 L ${-2 + a * 3} -20 L 10 -300 Z`} fill="#140f0c" />
      <path d={`M 0 -300 L ${10 - a * 3} -20 L ${38 - a * 3} -20 L 30 -300 Z`} fill="#1c1510" />
      <g transform={`rotate(${lean} 0 -300)`}>
        {/* sarong */}
        <path d="M -60 -600 L 64 -600 L 72 -270 L -58 -270 Z" fill="#3a4258" />
        <path d="M -58 -520 L 66 -520 M -56 -440 L 68 -440 M -54 -360 L 70 -360" stroke="#262c3c" strokeWidth={14} />
        {/* torso */}
        <path d="M -56 -880 Q 0 -900 58 -880 L 68 -590 L -58 -590 Z" fill="#8c7a62" />
        <path d="M 40 -870 L 60 -590 L 68 -590 L 58 -880 Z" fill="#ffb070" opacity={0.6} />
        {/* back arm */}
        <path d={push ? 'M 30 -850 C 90 -790 150 -720 210 -690 L 216 -706 C 160 -740 100 -810 52 -870 Z' : `M 20 -850 L ${40 - a * 4} -620 L ${60 - a * 4} -620 L 44 -850 Z`} fill="#3a2a20" />
        {/* head + peci */}
        <rect x={-14} y={-920} width={30} height={50} fill="#3a2a22" />
        <ellipse cx={6} cy={-950} rx={46} ry={54} fill="#3a2a22" />
        <path d="M 46 -955 L 58 -935 L 44 -930 Z" fill="#3a2a22" />
        <ellipse cx={30} cy={-955} rx={10} ry={30} fill="#ff9a5a" opacity={0.5} />
        <path d="M -40 -985 L -38 -1030 Q 6 -1040 50 -1030 L 50 -985 Z" fill="#050505" />
        {/* front arm */}
        <path d={push ? 'M 10 -850 C 70 -780 140 -700 200 -670 L 206 -688 C 150 -720 80 -800 34 -870 Z' : `M 0 -850 L ${-20 + a * 4} -620 L ${0 + a * 4} -620 L 24 -850 Z`} fill="#4a3628" />
      </g>
    </g>
  );
};

/** Satay cart. x,y = rear wheel ground point; w ≈ 1000 units long at scale 1. */
export const Cart: React.FC<{ x: number; y: number; s: number; t: number; smoke?: number; fire?: number }> = ({ x, y, s, t, smoke = 1, fire = 1 }) => {
  const fl = 0.85 + 0.15 * Math.sin(t * 7) * Math.sin(t * 3.1 + 1);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={500} cy={0} rx={560} ry={40} fill="#000" opacity={0.45} />
      <ellipse cx={220} cy={-480} rx={600 * fire} ry={420 * fire} fill="url(#sfFire)" opacity={fl} />
      {/* roof + posts */}
      <rect x={60} y={-1080} width={18} height={500} fill="#3a281a" />
      <rect x={900} y={-1080} width={18} height={500} fill="#3a281a" />
      <path d="M 20 -1080 L 960 -1080 L 930 -1130 L 50 -1130 Z" fill="#4a321f" />
      {/* kerosene lamp */}
      <line x1={480} y1={-1080} x2={480} y2={-1020} stroke="#222" strokeWidth={6} />
      <circle cx={480} cy={-995} r={160} fill="url(#sfKero)" opacity={fl} />
      <path d="M 462 -1020 L 498 -1020 L 506 -970 L 454 -970 Z" fill="#fff0c8" />
      {/* body */}
      <rect x={20} y={-600} width={940} height={360} fill="#6b4a2f" />
      <rect x={20} y={-600} width={940} height={30} fill="#8a6440" />
      <rect x={60} y={-540} width={400} height={240} fill="#5a3d26" />
      <rect x={520} y={-540} width={400} height={240} fill="#5a3d26" />
      {/* glass box with skewers */}
      <rect x={540} y={-800} width={380} height={200} fill="#2a1d14" stroke="#8a6440" strokeWidth={10} />
      {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={570 + i * 55} y1={-640} x2={600 + i * 55} y2={-760} stroke="#c9a070" strokeWidth={5} />)}
      {/* grill */}
      <rect x={60} y={-660} width={400} height={60} fill="#1a1414" />
      <rect x={70} y={-660} width={380} height={14} fill="#ff7a2f" opacity={fl} />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => <rect key={i} x={90 + i * 52} y={-676} width={40} height={14} rx={6} fill="#5a2a14" />)}
      {/* wheels + handle */}
      <circle cx={220} cy={-110} r={110} fill="none" stroke="#120d0a" strokeWidth={22} />
      <circle cx={760} cy={-110} r={110} fill="none" stroke="#120d0a" strokeWidth={22} />
      <line x1={20} y1={-420} x2={-200} y2={-520} stroke="#3a281a" strokeWidth={18} />
      {/* smoke */}
      {smoke > 0 && [0, 1, 2].map((i) => {
        const ph = (t * 0.25 + i / 3) % 1;
        const sx = 200 + i * 90 + Math.sin(t * 1.3 + i) * 40;
        return (
          <path key={i} d={`M ${sx} -680 C ${sx - 60} ${-800 - ph * 200} ${sx + 80} ${-950 - ph * 300} ${sx + 20 + ph * 80} ${-1150 - ph * 500}`} stroke="#b8b2ae" strokeWidth={50 + ph * 70} strokeLinecap="round" fill="none" opacity={smoke * 0.22 * (1 - ph)} />
        );
      })}
    </g>
  );
};
