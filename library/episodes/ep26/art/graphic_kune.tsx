import React from 'react';

/** Tiny white twisting figure (kunekune). Feet at (x,y), height h. t = seconds (drives the wriggle). */
export const Kune: React.FC<{ x: number; y: number; h: number; t: number; color?: string; glow?: boolean; id?: string }> = ({ x, y, h, t, color = '#f5f5ef', glow = true, id = 'kn' }) => {
  const N = 9;
  const pts: [number, number][] = [];
  for (let i = 0; i <= N; i++) {
    const u = i / N; // 0 feet .. 1 head
    const off = Math.sin(u * 5.2 - t * 3.1) * 0.11 * h * (0.35 + u) + Math.sin(t * 1.7 + u * 2) * 0.04 * h * u;
    pts.push([x + off, y - u * h]);
  }
  const spine = pts.map((p, i) => `${i ? 'L' : 'M'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const sh = pts[7];
  const a1 = Math.sin(t * 2.3) , a2 = Math.sin(t * 2.9 + 1.4);
  const arm = (s: number, a: number) => {
    const ex = sh[0] + s * h * 0.16, ey = sh[1] - h * 0.02 + a * h * 0.1;
    const hx = ex + s * h * 0.05 * Math.cos(a * 2), hy = ey - h * (0.14 + 0.08 * a);
    return `M ${sh[0].toFixed(1)} ${sh[1].toFixed(1)} Q ${ex.toFixed(1)} ${ey.toFixed(1)} ${hx.toFixed(1)} ${hy.toFixed(1)}`;
  };
  const hd = pts[N];
  const leg2 = `M ${pts[2][0].toFixed(1)} ${pts[2][1].toFixed(1)} Q ${(x + h * 0.06 * Math.sin(t * 2)).toFixed(1)} ${(y - h * 0.08).toFixed(1)} ${(x + h * 0.07).toFixed(1)} ${y.toFixed(1)}`;
  return (
    <g>
      {glow && (
        <>
          <defs>
            <radialGradient id={`${id}-g`} cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#ffffff" stopOpacity={0.5} />
              <stop offset="1" stopColor="#ffffff" stopOpacity={0} />
            </radialGradient>
          </defs>
          <ellipse cx={x} cy={y - h * 0.5} rx={h * 0.55} ry={h * 0.75} fill={`url(#${id}-g)`} />
        </>
      )}
      <path d={spine} fill="none" stroke={color} strokeWidth={h * 0.075} strokeLinecap="round" strokeLinejoin="round" />
      <path d={leg2} fill="none" stroke={color} strokeWidth={h * 0.05} strokeLinecap="round" />
      <path d={arm(-1, a1)} fill="none" stroke={color} strokeWidth={h * 0.045} strokeLinecap="round" />
      <path d={arm(1, a2)} fill="none" stroke={color} strokeWidth={h * 0.045} strokeLinecap="round" />
      <ellipse cx={hd[0]} cy={hd[1]} rx={h * 0.055} ry={h * 0.07} fill={color} />
    </g>
  );
};

/** Old binoculars, side-by-side barrels, front view slightly from above. Centre (x,y), scale s (≈1 → 520 px wide). */
export const Binoculars: React.FC<{ x: number; y: number; s: number; lens?: (cx: number, cy: number, r: number, i: number) => React.ReactNode; rim?: string }> = ({ x, y, s, lens, rim = '#e9ecd8' }) => {
  const R = 118;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* strap */}
      <path d="M -250 30 C -330 180 -200 300 0 300 C 200 300 330 180 250 30" fill="none" stroke="#1a1410" strokeWidth={18} />
      {/* barrels (bodies) */}
      {[-1, 1].map((d) => (
        <g key={d}>
          <path d={`M ${d * 140 - 128} -70 L ${d * 140 + 128} -70 L ${d * 140 + 118} 150 Q ${d * 140} 175 ${d * 140 - 118} 150 Z`} fill="#2b2b2b" />
          <rect x={d * 140 - 132} y={-40} width={264} height={70} fill="#1d1d1d" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => <rect key={k} x={d * 140 - 128 + k * 33} y={-38} width={12} height={66} fill="#262626" />)}
        </g>
      ))}
      {/* bridge + focus wheel */}
      <rect x={-40} y={-50} width={80} height={110} rx={14} fill="#1f1f1f" />
      <rect x={-26} y={-80} width={52} height={40} rx={8} fill="#333" />
      {/* objective rims + lenses */}
      {[-1, 1].map((d, i) => (
        <g key={d}>
          <ellipse cx={d * 140} cy={-70} rx={R + 16} ry={(R + 16) * 0.95} fill="#151515" />
          <ellipse cx={d * 140} cy={-70} rx={R + 16} ry={(R + 16) * 0.95} fill="none" stroke={rim} strokeOpacity={0.35} strokeWidth={4} strokeDasharray="0 0" />
          <ellipse cx={d * 140} cy={-70} rx={R} ry={R * 0.95} fill="#0b1210" />
          {lens && lens(d * 140, -70, R, i)}
          <path d={`M ${d * 140 - R * 0.7} ${-70 - R * 0.45} A ${R * 0.85} ${R * 0.8} 0 0 1 ${d * 140 + R * 0.2} ${-70 - R * 0.85}`} fill="none" stroke="#ffffff" strokeOpacity={0.35} strokeWidth={10} strokeLinecap="round" />
        </g>
      ))}
    </g>
  );
};
