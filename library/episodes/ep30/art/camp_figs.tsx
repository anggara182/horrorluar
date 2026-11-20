import React from 'react';

/** Standing dad silhouette (bush hat, flannel), feet at (x,y), height ~ 560*s. rim = rim light colour on side `side`. */
export const DadStand: React.FC<{ x: number; y: number; s?: number; rim?: string; side?: 1 | -1; step?: number; fill?: string; face?: string; rimOp?: number }> = ({ x, y, s = 1, rim = '#ff9b4a', side = 1, step = 0, fill = '#0e0a0c', face, rimOp = 1 }) => {
  const a = step * 22;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {/* legs */}
      <path d={`M -34 -270 L ${-40 - a} -10 L ${-14 - a} 0 L -2 -250 L 6 -250 L ${16 + a} 0 L ${42 + a} -10 L 36 -270 Z`} fill={fill} />
      {/* torso */}
      <path d="M -62 -470 Q -70 -400 -46 -270 L 46 -270 Q 70 -400 62 -470 Q 40 -490 0 -492 Q -40 -490 -62 -470 Z" fill={fill} />
      {/* arms */}
      <path d={`M -60 -462 Q -86 -380 ${-78 + a * 0.5} -280 L ${-58 + a * 0.5} -276 Q -60 -380 -44 -440 Z`} fill={fill} />
      <path d={`M 60 -462 Q 86 -380 ${78 - a * 0.5} -280 L ${58 - a * 0.5} -276 Q 60 -380 44 -440 Z`} fill={fill} />
      {/* neck + head */}
      <rect x={-12} y={-512} width={24} height={26} fill={fill} />
      <ellipse cx={0} cy={-540} rx={30} ry={36} fill={face ?? fill} />
      {/* bush hat */}
      <ellipse cx={0} cy={-562} rx={68} ry={11} fill={fill} />
      <path d="M -34 -562 Q -32 -604 0 -606 Q 32 -604 34 -562 Z" fill={fill} />
      {/* rim light */}
      <g opacity={rimOp}>
      <path d={`M ${62 * side} -468 Q ${70 * side} -400 ${46 * side} -272`} stroke={rim} strokeWidth={5} fill="none" opacity={0.85} />
      <path d={`M ${60 * side} -460 Q ${86 * side} -380 ${78 * side} -282`} stroke={rim} strokeWidth={4} fill="none" opacity={0.7} />
      <path d={`M ${30 * side} -560 Q ${36 * side} -540 ${26 * side} -514`} stroke={rim} strokeWidth={4} fill="none" opacity={0.8} />
      <path d={`M ${36 * side} -266 L ${42 * side} -12`} stroke={rim} strokeWidth={4} fill="none" opacity={0.6} />
      <path d={`M ${20 * side} -563 L ${66 * side} -563`} stroke={rim} strokeWidth={3} opacity={0.5} />
      </g>
    </g>
  );
};

/** Sitting figure (side view facing +x when dir=1), seat at (x,y). child = smaller, no hat. */
export const Sitter: React.FC<{ x: number; y: number; s?: number; dir?: 1 | -1; child?: boolean; rim?: string; fill?: string }> = ({ x, y, s = 1, dir = 1, child = false, rim = '#ff9b4a', fill = '#0e0a0c' }) => (
  <g transform={`translate(${x},${y}) scale(${s * dir},${s})`}>
    {/* thighs + shins */}
    <path d="M -30 -20 L 110 -40 L 120 60 L 150 64 L 152 82 L 96 84 L 88 0 L -30 20 Z" fill={fill} />
    {/* torso leaning forward */}
    <path d="M -46 10 Q -60 -140 -10 -250 L 50 -240 Q 60 -140 40 0 Z" fill={fill} />
    {/* arm to knee */}
    <path d="M 20 -230 Q 70 -160 104 -60 L 118 -70 Q 80 -170 46 -236 Z" fill={fill} />
    <ellipse cx={30} cy={-290} rx={child ? 34 : 30} ry={child ? 38 : 36} fill={fill} />
    {child ? (
      <path d="M -6 -300 Q 10 -336 50 -322 Q 66 -312 62 -296 Q 30 -312 -6 -290 Z" fill={fill} />
    ) : (
      <g>
        <ellipse cx={32} cy={-310} rx={66} ry={10} fill={fill} />
        <path d="M 0 -310 Q 2 -350 32 -352 Q 62 -350 64 -310 Z" fill={fill} />
      </g>
    )}
    {/* firelit front rim */}
    <path d="M 60 -290 Q 62 -264 48 -252" stroke={rim} strokeWidth={4} fill="none" opacity={0.9} />
    <path d="M 50 -238 Q 60 -140 42 -10" stroke={rim} strokeWidth={4} fill="none" opacity={0.6} />
    <path d="M 46 -236 Q 82 -166 116 -68" stroke={rim} strokeWidth={4} fill="none" opacity={0.75} />
    <path d="M 110 -40 L 120 58" stroke={rim} strokeWidth={4} fill="none" opacity={0.7} />
  </g>
);

/** Campfire flames (live). t = seconds, lit 0..1 (0 = dead embers). */
export const Fire: React.FC<{ x: number; y: number; s?: number; t: number; lit?: number }> = ({ x, y, s = 1, t, lit = 1 }) => {
  const f = (k: number) => Math.sin(t * (7 + k) + k * 1.7) * 0.5 + Math.sin(t * (13 + k * 2) + k) * 0.25;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx={0} cy={0} rx={420} ry={150} fill="url(#kGlowGround)" opacity={0.8 * lit + 0.1} />
      <circle cx={0} cy={-80} r={360} fill="url(#kGlowAir)" opacity={(0.85 + f(9) * 0.1) * lit} />
      {/* logs + stones */}
      <path d="M -80 -6 L 70 -30 L 76 -14 L -76 12 Z" fill="#21140f" />
      <path d="M -70 -28 L 82 4 L 76 18 L -76 -12 Z" fill="#2b1a12" />
      {[-96, -60, -20, 24, 64, 98].map((sx, i) => <ellipse key={i} cx={sx} cy={10 + (i % 2) * 4} rx={20} ry={11} fill="#3a2a2e" />)}
      <ellipse cx={0} cy={-8} rx={56} ry={12} fill="#ff6a2a" opacity={0.6 + 0.3 * (1 - lit)} />
      {lit > 0.02 && (
        <g opacity={lit}>
          <path d={`M -54 -10 Q ${-60 + f(1) * 10} -90 ${-10 + f(2) * 14} ${-190 + f(3) * 20} Q 0 -110 18 -96 Q ${30 + f(4) * 8} -150 ${28 + f(5) * 12} ${-170 + f(6) * 16} Q 70 -80 54 -10 Z`} fill="#ff7a2e" />
          <path d={`M -32 -10 Q -36 -70 ${-4 + f(7) * 8} ${-130 + f(8) * 14} Q 30 -70 32 -10 Z`} fill="#ffb760" />
          <path d={`M -14 -10 Q -14 -44 ${2 + f(2) * 4} ${-74 + f(4) * 8} Q 16 -44 14 -10 Z`} fill="#fff0c2" />
          {[0, 1, 2].map((k) => {
            const ph = (t * 0.6 + k / 3) % 1;
            return <circle key={k} cx={Math.sin(k * 2 + t * 2) * 30 + k * 10 - 10} cy={-120 - ph * 260} r={4 * (1 - ph)} fill="#ffc47a" opacity={1 - ph} />;
          })}
        </g>
      )}
    </g>
  );
};

/** Gradients used by Fire / Orb; place once inside each Live svg that uses them. */
export const KDefs: React.FC = () => (
  <defs>
    <radialGradient id="kGlowGround" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ff9b4a" stopOpacity="0.55" /><stop offset="0.5" stopColor="#c2552a" stopOpacity="0.2" /><stop offset="1" stopColor="#7a3a22" stopOpacity="0" /></radialGradient>
    <radialGradient id="kGlowAir" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffb064" stopOpacity="0.45" /><stop offset="0.4" stopColor="#ff8a3c" stopOpacity="0.14" /><stop offset="1" stopColor="#ff8a3c" stopOpacity="0" /></radialGradient>
    <radialGradient id="kOrb" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffffff" stopOpacity="1" /><stop offset="0.12" stopColor="#e9fbff" stopOpacity="0.95" /><stop offset="0.35" stopColor="#7fe3ff" stopOpacity="0.35" /><stop offset="1" stopColor="#7fe3ff" stopOpacity="0" /></radialGradient>
    <radialGradient id="kCold" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#7fe3ff" stopOpacity="0.35" /><stop offset="1" stopColor="#7fe3ff" stopOpacity="0" /></radialGradient>
  </defs>
);

export const Orb: React.FC<{ x: number; y: number; r?: number; op?: number }> = ({ x, y, r = 60, op = 1 }) => (
  <g opacity={op}>
    <circle cx={x} cy={y} r={r * 3} fill="url(#kCold)" />
    <circle cx={x} cy={y} r={r} fill="url(#kOrb)" />
    <circle cx={x} cy={y} r={r * 0.12} fill="#ffffff" />
  </g>
);
