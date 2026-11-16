import React from 'react';

/** Hut on chicken legs, silhouette-first, centred at (cx, base). base = ground line under the talons. s = scale. */
export const ChickenHut: React.FC<{ cx: number; base: number; s?: number; window?: number }> = ({ cx, base, s = 1, window = 1 }) => {
  const LEG = '#8a7a62', LEGD = '#4a3f33', LOG = '#3a2b20', LOGD = '#21170f', MOSS = '#2f3a24';
  const leg = (x0: number, dir: number) => {
    // knee (forward), ankle
    const kx = x0 - 34 * dir, ky = -190, ax = x0 - 2, ay = -52;
    const scales = Array.from({ length: 7 }, (_, i) => {
      const u = (i + 0.5) / 7;
      return { x: kx + (ax - kx) * u, y: ky + (ay - ky) * u };
    });
    return (
      <g>
        {/* drumstick thigh: bulbous feathered top tapering to the knee */}
        <path d={`M${x0 - 52},-305 Q${x0 - 66},-250 ${kx - 14},${ky} Q${kx},${ky + 12} ${kx + 16},${ky - 4} Q${x0 + 62},-250 ${x0 + 52},-305 Z`} fill="#5a4a38" />
        <path d={`M${x0 - 52},-305 Q${x0 - 66},-250 ${kx - 14},${ky} L${kx - 4},${ky - 8} Q${x0 - 44},-250 ${x0 - 30},-305 Z`} fill="#b5a385" opacity={0.45} />
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${x0 - 40 + i * 26},-${290 - i * 4} q${8 * dir},30 ${-4 * dir + (kx - x0) * 0.4},62`} stroke="#3a2f24" strokeWidth={4} fill="none" strokeLinecap="round" />
        ))}
        {/* scaled shin */}
        <path d={`M${kx},${ky} L${ax},${ay}`} stroke={LEG} strokeWidth={30} strokeLinecap="round" />
        {scales.map((p, i) => (
          <path key={i} d={`M${p.x - 14},${p.y - 4} q14,10 28,0`} stroke={LEGD} strokeWidth={4} fill="none" strokeLinecap="round" />
        ))}
        <path d={`M${kx + 12 * dir},${ky + 6} L${ax + 12 * dir},${ay}`} stroke="#b5a385" strokeWidth={5} opacity={0.5} strokeLinecap="round" />
        {/* three forward toes with dark talons + back spur */}
        {[-1, 0, 1].map((a2, i) => {
          const tx = ax + a2 * 62, ty = -6;
          return (
            <g key={i}>
              <path d={`M${ax},${ay} Q${ax + a2 * 34},${-36} ${tx},${ty}`} stroke={LEG} strokeWidth={17} fill="none" strokeLinecap="round" />
              <path d={`M${tx},${ty} q${a2 * 12 + 2},4 ${a2 * 14 + 4},16`} stroke="#1a140e" strokeWidth={8} fill="none" strokeLinecap="round" />
            </g>
          );
        })}
        <path d={`M${ax},${ay} q${26 * dir},10 ${40 * dir},30`} stroke={LEG} strokeWidth={11} fill="none" strokeLinecap="round" />
      </g>
    );
  };
  return (
    <g transform={`translate(${cx},${base}) scale(${s})`}>
      <ellipse cx={0} cy={4} rx={190} ry={18} fill="#0b1018" opacity={0.55} />
      {leg(-70, 1)}
      {leg(78, -1)}
      {/* cabin */}
      <path d="M-170,-300 L170,-300 L176,-520 L-176,-520 Z" fill={LOG} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line key={i} x1={-176} x2={176} y1={-330 - i * 36} y2={-330 - i * 36} stroke={LOGD} strokeWidth={5} />
      ))}
      {/* log ends */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i}>
          <circle cx={-182} cy={-316 - i * 36} r={15} fill="#5a4330" />
          <circle cx={182} cy={-316 - i * 36} r={15} fill="#5a4330" />
        </g>
      ))}
      {/* roof */}
      <path d="M-230,-505 L0,-700 L230,-505 L210,-490 L0,-668 L-210,-490 Z" fill={MOSS} />
      <path d="M-210,-490 L0,-668 L210,-490 Z" fill={LOGD} />
      <path d="M-230,-505 L0,-700 L0,-690 L-222,-498 Z" fill="#5d6f4a" opacity={0.7} />
      {/* chimney */}
      <rect x={70} y={-690} width={42} height={110} fill={LOGD} />
      {/* door */}
      <path d="M-120,-300 L-120,-430 Q-90,-460 -60,-430 L-60,-300 Z" fill={LOGD} />
      {/* warm window */}
      <rect x={20} y={-450} width={92} height={80} fill="#ffb35c" opacity={window} />
      <rect x={20} y={-450} width={92} height={80} fill="none" stroke={LOGD} strokeWidth={9} />
      <line x1={66} x2={66} y1={-450} y2={-370} stroke={LOGD} strokeWidth={7} />
      <line x1={20} x2={112} y1={-410} y2={-410} stroke={LOGD} strokeWidth={7} />
    </g>
  );
};

/** Simple spruce silhouette. */
export const Spruce: React.FC<{ x: number; y: number; h: number; fill?: string }> = ({ x, y, h, fill = '#0a1210' }) => {
  const w = h * 0.36;
  const tiers = 5;
  let d = '';
  for (let i = 0; i < tiers; i++) {
    const t0 = y - h + (h * i) / tiers - (i ? h * 0.06 : 0);
    const t1 = y - h + (h * (i + 1)) / tiers + h * 0.04;
    const ww = (w * (i + 1)) / tiers;
    d += `M${x},${t0} L${x + ww},${t1} L${x - ww},${t1} Z `;
  }
  return <path d={d + `M${x - h * 0.03},${y - h * 0.06} h${h * 0.06} v${h * 0.08} h${-h * 0.06} Z`} fill={fill} />;
};
