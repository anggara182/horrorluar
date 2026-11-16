import React from 'react';

/** Grandmother in profile facing right, origin = top of head. h = height of the visible figure scale (~head 130). */
export const Grandma: React.FC<{ x: number; y: number; s?: number; arm?: number; bob?: number }> = ({ x, y, s = 1, arm = 0, bob = 0 }) => {
  const rim = '#ffb067', body = '#141012', skin = '#2a1a16';
  // arm raise: hand goes from (210,330) to (240,250)
  const hx = 230 + 20 * arm, hy = 340 - 90 * arm;
  return (
    <g transform={`translate(${x},${y + bob}) scale(${s})`}>
      {/* torso: slightly stooped */}
      <path d={`M -40 120 Q -120 150 -140 260 Q -160 520 -150 900 L 170 900 Q 190 600 150 330 Q 120 180 60 140 Z`} fill={body} />
      <path d={`M 60 140 Q 120 180 150 330 Q 190 600 170 900`} stroke={rim} strokeWidth={6} fill="none" opacity={0.85} />
      {/* neck */}
      <path d="M 0 90 L 50 90 L 60 150 L -10 150 Z" fill={skin} />
      {/* head (profile, nose to the right) */}
      <path d="M -50 40 Q -55 -40 10 -50 Q 70 -52 82 0 L 92 30 L 82 38 Q 84 70 66 92 Q 30 110 0 100 Q -45 90 -50 40 Z" fill={skin} />
      <path d="M 70 -20 Q 84 0 92 30 L 82 38 Q 84 70 66 92" stroke={rim} strokeWidth={5} fill="none" />
      {/* hair cap + bun */}
      <path d="M -54 50 Q -64 -46 14 -56 Q 66 -58 74 -10 Q 30 -30 -10 -10 Q -30 20 -30 60 Z" fill="#8d8a88" />
      <circle cx={-62} cy={-6} r={36} fill="#9e9a96" />
      <path d="M -90 -20 Q -70 -48 -40 -36" stroke="#d8d2cc" strokeWidth={4} fill="none" />
      <path d="M 10 -56 Q 60 -56 74 -10" stroke="#e8d8c8" strokeWidth={4} fill="none" />
      {/* arm: upper arm down, forearm forward/up */}
      <path d={`M 80 170 Q 130 260 120 330 L ${hx} ${hy + 10} L ${hx - 4} ${hy - 30} L 100 300 Q 100 230 60 170 Z`} fill={body} />
      <path d={`M 120 330 L ${hx} ${hy + 10}`} stroke={rim} strokeWidth={5} opacity={0.8} />
      {/* hand (mitten) */}
      <ellipse cx={hx + 18} cy={hy - 8} rx={30} ry={24} fill={skin} />
      <path d={`M ${hx + 30} ${hy - 30} q 18 6 16 26`} stroke={rim} strokeWidth={4} fill="none" />
    </g>
  );
};
/** grandma hand position in world coords (for incense) */
export const gHand = (x: number, y: number, s: number, arm: number) => ({ x: x + s * (248 + 20 * arm), y: y + s * (332 - 90 * arm) });

/** curling smoke from (x,y) upward; t seconds. */
export const Smoke: React.FC<{ x: number; y: number; t: number; o?: number; len?: number; seed?: number }> = ({ x, y, t, o = 1, len = 520, seed = 0 }) => {
  const pts: string[] = [];
  const n = 18;
  for (let i = 0; i <= n; i++) {
    const f = i / n;
    const px = x + Math.sin(f * 7 + t * 1.3 + seed) * (6 + 60 * f * f) + 30 * f * Math.sin(t * 0.4 + seed);
    const py = y - f * len;
    pts.push(`${i ? 'L' : 'M'} ${px.toFixed(1)} ${py.toFixed(1)}`);
  }
  return (
    <g opacity={o} fill="none" strokeLinecap="round">
      <path d={pts.join(' ')} stroke="#bdb6ae" strokeWidth={10} opacity={0.18} />
      <path d={pts.join(' ')} stroke="#d8d0c6" strokeWidth={3} opacity={0.5} />
    </g>
  );
};

export const Ember: React.FC<{ x: number; y: number; o?: number }> = ({ x, y, o = 1 }) => (
  <g opacity={o}>
    <circle cx={x} cy={y} r={22} fill="#ff8a3a" opacity={0.25} />
    <circle cx={x} cy={y} r={6} fill="#ffcf86" />
  </g>
);

/** young hand in hoodie sleeve: sleeve from (sx,sy) to wrist (wx,wy), mitten hand pointing at angle a (deg). */
export const SleeveHand: React.FC<{ sx: number; sy: number; wx: number; wy: number; a: number; flip?: boolean }> = ({ sx, sy, wx, wy, a, flip }) => {
  const dx = wx - sx, dy = wy - sy, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
  const w0 = 150, w1 = 80;
  const sleeve = `M ${sx + nx * w0} ${sy + ny * w0} L ${wx + nx * w1} ${wy + ny * w1} Q ${wx + dx / L * 30} ${wy + dy / L * 30} ${wx - nx * w1} ${wy - ny * w1} L ${sx - nx * w0} ${sy - ny * w0} Z`;
  return (
    <g>
      <path d={sleeve} fill="#2a2f3e" />
      <path d={`M ${sx + nx * w0} ${sy + ny * w0} L ${wx + nx * w1} ${wy + ny * w1}`} stroke="#ffb067" strokeWidth={6} opacity={0.6} />
      <rect x={wx - nx * w1 - 6} y={wy - ny * w1 - 6} width={0} height={0} />
      <g transform={`translate(${wx},${wy}) rotate(${a}) scale(${flip ? -1 : 1},1)`}>
        <path d="M -10 -58 Q 60 -70 110 -40 Q 140 -10 120 30 Q 90 62 20 58 Q -20 50 -10 -58 Z" fill="#b8806a" />
        <path d="M 30 -50 Q 70 -90 100 -70 Q 108 -56 84 -40" fill="#c99078" />
        <path d="M 40 10 L 112 8 M 40 34 L 104 32" stroke="#7a4c3c" strokeWidth={4} />
        <path d="M -10 -58 Q 60 -70 110 -40" stroke="#ffcfa0" strokeWidth={4} fill="none" />
      </g>
    </g>
  );
};

/** head-and-shoulders silhouette (reflection). origin = top of head. */
export const Bust: React.FC<{ x: number; y: number; s?: number; fill: string; hood?: boolean; hair?: boolean }> = ({ x, y, s = 1, fill, hood, hair }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} fill={fill}>
    {!hair && <ellipse cx={0} cy={110} rx={88} ry={110} />}
    {hair && <><ellipse cx={0} cy={100} rx={66} ry={92} /><path d="M -74 90 Q -80 -14 0 -14 Q 80 -14 74 90 L 96 470 L 40 430 L 0 480 L -40 430 L -96 470 Z" /></>}
    {hood && <path d="M -120 120 Q -130 -20 0 -20 Q 130 -20 120 120 Q 110 230 60 250 L -60 250 Q -110 230 -120 120 Z" />}
    {hair ? <path d="M -40 200 L 40 200 L 60 260 Q 170 290 200 420 L 220 640 L -220 640 L -200 420 Q -170 290 -60 260 Z" />
      : <path d="M -60 210 L 60 210 L 80 280 Q 220 300 260 420 L 290 640 L -290 640 L -260 420 Q -220 300 -80 280 Z" />}
  </g>
);
