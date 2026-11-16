import React from 'react';

/** Bed raised high on stacked red bricks (side view). World coords; floor at y=fy. */
export const BRICK = '#8a3b2a';
export const BedOnBricks: React.FC<{ x0: number; x1: number; fy: number; id: string }> = ({ x0, x1, fy, id }) => {
  const legH = 120, brickN = 5, bh = 28, bw = 74;
  const stackTop = fy - brickN * bh;
  const railY = stackTop - legH;
  const matY = railY - 90;
  const legs = [x0 + 40, x1 - 40];
  const pat = Array.from({ length: 9 }, (_, i) => x0 + 30 + i * ((x1 - x0 - 60) / 8));
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-blk`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#d9c39a" />
          <stop offset="0.45" stopColor="#8f8a92" />
          <stop offset="1" stopColor="#3c4256" />
        </linearGradient>
        <linearGradient id={`${id}-gap`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#020203" />
          <stop offset="1" stopColor="#07080b" />
        </linearGradient>
      </defs>
      {/* the darkness beneath */}
      <rect x={x0 + 20} y={railY + 20} width={x1 - x0 - 40} height={fy - railY - 14} fill={`url(#${id}-gap)`} />
      <ellipse cx={(x0 + x1) / 2} cy={fy} rx={(x1 - x0) / 2 + 40} ry={26} fill="#020203" opacity={0.8} />
      {/* headboard + footboard */}
      <path d={`M ${x0 - 6} ${fy - brickN * bh - 6} L ${x0 - 6} ${matY - 190} Q ${x0 + 30} ${matY - 230} ${x0 + 66} ${matY - 190} L ${x0 + 66} ${railY + 30} Z`} fill="#2a1a12" />
      <path d={`M ${x1 + 6} ${fy - brickN * bh - 6} L ${x1 + 6} ${matY - 70} Q ${x1 - 26} ${matY - 100} ${x1 - 58} ${matY - 70} L ${x1 - 58} ${railY + 30} Z`} fill="#24160f" />
      {/* legs */}
      {legs.map((lx, i) => <rect key={i} x={lx - 14} y={railY} width={28} height={legH + 4} fill="#1d130d" />)}
      {/* brick stacks */}
      {legs.map((lx, i) => (
        <g key={i}>
          {Array.from({ length: brickN }, (_, b) => {
            const off = (b % 2 ? 8 : -6);
            return <rect key={b} x={lx - bw / 2 + off} y={fy - (b + 1) * bh} width={bw} height={bh - 3} rx={3} fill={b % 2 ? '#7a3324' : BRICK} />;
          })}
          <rect x={lx - bw / 2 - 6} y={stackTop} width={bw + 14} height={brickN * bh} fill="#000" opacity={0.18} />
        </g>
      ))}
      {/* rail */}
      <rect x={x0} y={railY} width={x1 - x0} height={30} rx={4} fill="#2e1d13" />
      <path d={`M ${x0} ${railY + 2} L ${x1} ${railY + 2}`} stroke="#c9905a" strokeWidth={3} opacity={0.5} />
      {/* mattress + blanket */}
      <rect x={x0 + 20} y={matY} width={x1 - x0 - 40} height={70} rx={24} fill="#c9c2b8" />
      <path d={`M ${x0 + 10} ${matY + 30} Q ${(x0 + x1) / 2} ${matY + 6} ${x1 - 10} ${matY + 34} L ${x1 - 4} ${railY + 46} Q ${(x0 + x1) / 2} ${railY + 30} ${x0 + 4} ${railY + 52} Z`} fill="#8a3b2a" />
      <path d={`M ${x0 + 8} ${matY + 62} Q ${(x0 + x1) / 2} ${matY + 40} ${x1 - 8} ${matY + 66}`} stroke="#e0a24a" strokeWidth={10} fill="none" />
      <path d={`M ${x0 + 6} ${railY + 28} Q ${(x0 + x1) / 2} ${railY + 10} ${x1 - 6} ${railY + 30}`} stroke="#e0a24a" strokeWidth={8} fill="none" />
      {pat.map((px, i) => <path key={i} d={`M ${px - 18} ${matY + 96} L ${px} ${matY + 74} L ${px + 18} ${matY + 96} L ${px} ${matY + 118} Z`} fill={i % 2 ? '#1f2a44' : '#e8dcc4'} opacity={0.85} />)}
      {/* pillow */}
      <ellipse cx={x0 + 120} cy={matY - 8} rx={80} ry={32} fill="#ddd6cb" />
      {/* rim light: candle warm left, moon cool right */}
      <path d={`M ${x0 + 30} ${matY + 2} Q ${(x0 + x1) / 2} ${matY - 18} ${x1 - 30} ${matY + 4}`} stroke={`url(#${id}-blk)`} strokeWidth={5} fill="none" />
    </g>
  );
};

/** Tiny muddy footprint (child-small, 3-toed). */
export const Footprint: React.FC<{ x: number; y: number; s?: number; rot?: number; o?: number; fill?: string }> = ({ x, y, s = 1, rot = 0, o = 1, fill = '#4a3826' }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={o}>
    <ellipse cx={0} cy={6} rx={9} ry={14} fill={fill} />
    {[-9, 0, 9].map((tx, i) => <circle key={i} cx={tx} cy={-14 - (i === 1 ? 4 : 0)} r={4.2} fill={fill} />)}
  </g>
);

/** Small grey fingers reaching out of the dark (back of hand up, fingers pointing down toward viewer). */
export const TinyFingers: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <path d="M -22 -10 Q 0 -22 26 -12 Q 34 0 26 8 L -20 8 Q -28 0 -22 -10 Z" fill="#6f6b65" />
    {[[-16, 16], [-5, 22], [7, 20], [18, 14]].map(([fx, len], i) => (
      <g key={i}>
        <path d={`M ${fx - 4.5} 2 Q ${fx - 5} ${len * 0.6} ${fx - 2} ${len} Q ${fx + 2} ${len + 3} ${fx + 4} ${len - 1} Q ${fx + 5} ${len * 0.6} ${fx + 4.5} 2 Z`} fill="#8e8a83" />
        <path d={`M ${fx - 3} ${len * 0.45} L ${fx + 3} ${len * 0.45}`} stroke="#5d5a55" strokeWidth={1.2} />
      </g>
    ))}
    <path d="M -22 -10 Q 0 -20 26 -12" stroke="#b9b4ab" strokeWidth={2} fill="none" />
  </g>
);
