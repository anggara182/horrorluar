import React from 'react';

/** One bare footprint (origin centre, toes up). Copied from library ep08 close_art Footprint, restyled for dust. */
export const Footprint: React.FC<{ wet: number; fill?: string; rim?: string }> = ({ wet, fill = '#3a2e22', rim = '#cfd6e6' }) => (
  <g opacity={wet}>
    <path d="M-30,-60 C-44,-20 -40,40 -24,80 C-10,104 18,104 26,78 C34,40 30,10 34,-30 C38,-60 20,-80 0,-80 C-14,-80 -26,-74 -30,-60 Z" fill={fill} opacity={0.8} />
    {[[-26, -104, 13], [-4, -112, 10], [14, -108, 9], [28, -98, 8], [38, -84, 7]].map(([x, y, r], i) => (
      <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 1.15} fill={fill} opacity={0.8} />
    ))}
    <path d="M30,-50 C38,0 32,50 20,80" stroke={rim} strokeWidth={4} fill="none" opacity={0.45} />
  </g>
);

/** Side-view bare foot, origin at the sole under the ankle. dir=-1: toes point left. Silver anklet at the ankle. */
export const SideFoot: React.FC<{ x: number; y: number; s?: number; dir?: number; lift?: number; glint?: number }> = ({ x, y, s = 1, dir = -1, lift = 0, glint = 0.6 }) => (
  <g transform={`translate(${x},${y - lift}) scale(${s * -dir * -1},${s})`}>
    {/* leg */}
    <path d="M-30,-260 C-32,-180 -28,-120 -26,-84 L26,-84 C28,-130 32,-190 30,-260 Z" fill="#7a5848" />
    {/* foot: heel at left (-x), toes at right (+x) in local space */}
    <path d="M-26,-92 C-38,-62 -44,-26 -38,-10 C-32,0 -18,2 -2,0 C22,-4 42,-8 62,-4 L102,2 C120,4 132,-2 130,-12 C128,-22 110,-26 88,-30 C56,-38 32,-60 24,-92 Z" fill="#8f6a56" />
    {/* moon rim along top of foot & shin */}
    <path d="M26,-92 C30,-62 56,-42 90,-34 C112,-30 128,-26 131,-16" stroke="#e6d6c6" strokeWidth={4} fill="none" opacity={0.7} />
    <path d="M30,-80 C32,-130 36,-190 34,-260" stroke="#e6d6c6" strokeWidth={4} fill="none" opacity={0.55} />
    {/* toe separations */}
    {[104, 116].map((tx) => <path key={tx} d={`M${tx},-24 L${tx + 3},0`} stroke="#5e4234" strokeWidth={3} />)}
    {/* sole shadow */}
    <path d="M-38,-8 C-30,2 -10,2 0,0 C22,-4 42,-8 62,-4 L102,2 C120,4 130,-2 130,-12" stroke="#3d2b20" strokeWidth={5} fill="none" opacity={0.6} />
    {/* silver anklet: back chain, beads */}
    <path d="M-36,-104 Q0,-90 36,-104" stroke="#9aa3b4" strokeWidth={5} fill="none" />
    {Array.from({ length: 9 }, (_, i) => {
      const u = -1 + (2 * i) / 8; const cx = u * 36, cy = -104 + 14 * (1 - u * u);
      return <circle key={i} cx={cx} cy={cy} r={6} fill={i === 5 ? '#ffffff' : '#c8d0de'} />;
    })}
    {/* bells */}
    {[-22, 0, 22].map((bx, i) => <circle key={i} cx={bx} cy={-104 + 14 * (1 - (bx / 36) ** 2) + 12} r={5} fill="#aab3c2" />)}
    <circle cx={10} cy={-92} r={28} fill="url(#gf-glint)" opacity={glint} />
  </g>
);
