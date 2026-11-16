import React from 'react';

/** Back-lit huldra silhouette (front view), feet at (x,y), height ~ 820*s. sway = hair motion phase. */
export const HuldraSil: React.FC<{ x: number; y: number; s?: number; sway?: number; fill?: string; rim?: string; tail?: number }> = ({ x, y, s = 1, sway = 0, fill = '#1c1a1e', rim = '#ffe6a8', tail = 0 }) => {
  const sw = Math.sin(sway) * 14, sw2 = Math.sin(sway * 1.3 + 1) * 10;
  // local coords: feet at 0, head top at -820
  const dress = `M-70 -600 Q-92 -560 -96 -470 L-110 -320 Q-150 -150 -190 -10 Q-100 12 0 8 Q100 12 190 -10 Q150 -150 110 -320 L96 -470 Q92 -560 70 -600 Q40 -628 0 -630 Q-40 -628 -70 -600Z`;
  const hair = `M-46 -770 Q-80 -740 -84 -680 Q-96 -560 ${-110 + sw} -440 Q${-118 + sw} -370 ${-96 + sw2} -330 L-60 -420 Q-58 -560 -40 -690 Q0 -730 40 -690 Q58 -560 60 -420 L${96 + sw2} -330 Q${118 + sw} -370 ${110 + sw} -440 Q96 -560 84 -680 Q80 -740 46 -770 Q0 -800 -46 -770Z`;
  const armL = 'M-82 -590 Q-118 -480 -122 -380 Q-120 -350 -108 -352 Q-100 -440 -76 -520Z';
  const armR = 'M82 -590 Q118 -480 122 -380 Q120 -350 108 -352 Q100 -440 76 -520Z';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {tail > 0 && (() => {
        const ex = 250 + 50 * tail, ey = -120 - 140 * tail;
        return (
          <>
            <path d={`M40 -30 Q${200 + 30 * Math.sin(sway)} 10 ${ex - 20} ${ey + 90} Q${ex - 10} ${ey + 40} ${ex} ${ey}`} stroke={fill} strokeWidth={22} fill="none" strokeLinecap="round" />
            <path d={`M${ex - 20} ${ey + 90} Q${ex - 10} ${ey + 40} ${ex} ${ey}`} stroke={rim} strokeWidth={4} fill="none" opacity={0.7} transform="translate(9 0)" />
            <path d={`M${ex} ${ey + 10} q-30 -50 -6 -90 q20 30 26 0 q22 40 -2 90Z`} fill={fill} />
          </>
        );
      })()}
      <path d={armL} fill={fill} /><path d={armR} fill={fill} />
      <path d={dress} fill={fill} />
      <rect x={-17} y={-680} width={34} height={60} fill={fill} />
      <ellipse cx={0} cy={-715} rx={42} ry={54} fill={fill} />
      <path d={hair} fill={fill} />
      {/* rim light: hair outline + shoulders */}
      <path d={`M-46 -770 Q-80 -740 -84 -680 Q-96 -560 ${-110 + sw} -440`} stroke={rim} strokeWidth={5} fill="none" opacity={0.9} strokeLinecap="round" />
      <path d={`M46 -770 Q80 -740 84 -680 Q96 -560 ${110 + sw} -440`} stroke={rim} strokeWidth={5} fill="none" opacity={0.9} strokeLinecap="round" />
      <path d="M-30 -785 Q0 -800 30 -785" stroke={rim} strokeWidth={4} fill="none" opacity={0.8} />
      {[-70, -50, 50, 70].map((hx, i) => (
        <path key={i} d={`M${hx * 0.6} -760 Q${hx} -600 ${hx * 1.45 + (i % 2 ? sw2 : sw)} -400`} stroke="#e8c873" strokeWidth={2.5} fill="none" opacity={0.45} />
      ))}
      <path d="M-96 -470 L-110 -320 Q-150 -150 -190 -10" stroke={rim} strokeWidth={3} fill="none" opacity={0.5} />
      <path d="M96 -470 L110 -320 Q150 -150 190 -10" stroke={rim} strokeWidth={3} fill="none" opacity={0.5} />
    </g>
  );
};
