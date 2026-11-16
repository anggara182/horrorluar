import React from 'react';

/** Shared street geometry: one-point perspective. s = depth scale (1 = world bottom). */
export const VP = { x: 650, y: 1060 };
export const gy = (s: number) => VP.y + (2304 - VP.y) * s;
export const gx = (bx: number, s: number) => VP.x + (bx - VP.x) * s;

export const COL = {
  house: '#3b3330', houseDark: '#221c1b', shutter: '#4a403b', lantern: '#e0402f', glow: '#ff8a5c',
  neon: '#6fd1c4', fire: '#ffb057', smoke: '#8f8a84', pale: '#c9ccd1', ink: '#0d0a0b',
  hoodie: '#2c3442', hoodieRim: '#ff9a6a', jeans: '#1d2230', skin: '#b98a74',
};

/** lanterns hanging along both facades: [bx, s, upHeight] */
export const LANTERNS: [number, number, number][] = [
  [-150, 0.9, 1550], [-150, 0.55, 1550], [-150, 0.34, 1550], [-150, 0.2, 1550], [-150, 0.12, 1550],
  [1450, 0.8, 1550], [1450, 0.48, 1550], [1450, 0.3, 1550], [1450, 0.18, 1550], [1450, 0.11, 1550],
];

/** One red paper lantern with radial glow. sway = degrees. */
export const Lantern: React.FC<{ x: number; y: number; s: number; sway?: number; glow?: number }> = ({ x, y, s, sway = 0, glow = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${sway}) scale(${s})`}>
    <ellipse cx={0} cy={120} rx={260} ry={260} fill="url(#lanGlow)" opacity={glow} />
    <line x1={0} y1={0} x2={0} y2={40} stroke="#140e0e" strokeWidth={5} />
    <rect x={-34} y={36} width={68} height={16} fill="#2a1a12" />
    <ellipse cx={0} cy={120} rx={78} ry={74} fill={COL.lantern} />
    <ellipse cx={-14} cy={110} rx={44} ry={52} fill={COL.glow} opacity={0.7} />
    <path d="M -60 80 Q 0 70 60 80 M -76 120 L 76 120 M -60 160 Q 0 170 60 160" stroke="#a5281e" strokeWidth={4} fill="none" />
    <rect x={-34} y={188} width={68} height={16} fill="#2a1a12" />
    <path d="M -8 204 L -12 250 M 0 204 L 0 258 M 8 204 L 12 250" stroke="#c23a2a" strokeWidth={4} />
  </g>
);

/** Metal offering bin with burning paper. t = seconds for flicker. */
export const FireBin: React.FC<{ x: number; y: number; s: number; t: number }> = ({ x, y, s, t }) => {
  const f = (a: number, b: number) => Math.sin(t * a + b);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx={0} cy={-150} rx={420 + 20 * f(7, 0)} ry={380} fill="url(#fireGlow)" />
      <ellipse cx={0} cy={6} rx={170} ry={30} fill="#000" opacity={0.5} />
      {/* smoke */}
      <path d={`M -30 -260 Q ${-80 + 30 * f(1.3, 0)} -420 ${-10 + 40 * f(0.9, 1)} -560 Q ${40 + 40 * f(1.1, 2)} -700 ${-20 + 50 * f(0.7, 3)} -860`} stroke={COL.smoke} strokeWidth={70} strokeLinecap="round" fill="none" opacity={0.18} />
      <path d={`M 30 -280 Q ${60 + 30 * f(1.1, 1)} -440 ${20 + 40 * f(1.2, 2)} -620`} stroke={COL.smoke} strokeWidth={50} strokeLinecap="round" fill="none" opacity={0.14} />
      {/* flames */}
      <path d={`M -100 -190 Q -110 ${-300 - 20 * f(9, 0)} ${-50 + 10 * f(6, 1)} ${-380 - 30 * f(8, 2)} Q -30 -300 0 ${-420 - 40 * f(7, 3)} Q 30 -310 ${60 + 10 * f(5, 4)} ${-360 - 30 * f(9, 5)} Q 110 -290 100 -190 Z`} fill={COL.fire} />
      <path d={`M -60 -190 Q -50 -270 ${-10 + 6 * f(8, 1)} ${-310 - 25 * f(10, 2)} Q 40 -260 60 -190 Z`} fill="#fff1c7" />
      {/* embers */}
      {[0, 1, 2, 3].map((i) => { const ph = (t * 0.5 + i * 0.27) % 1; return <circle key={i} cx={-50 + i * 35 + 30 * Math.sin(ph * 6 + i)} cy={-300 - ph * 420} r={6} fill={COL.fire} opacity={1 - ph} />; })}
      {/* bin */}
      <path d="M -130 -200 L 130 -200 L 112 0 L -112 0 Z" fill="#1c1615" />
      <path d="M -134 -206 L 134 -206 L 134 -186 L -134 -186 Z" fill="#2c2321" />
      <path d="M -130 -186 L 130 -186" stroke={COL.fire} strokeWidth={5} opacity={0.8} />
      {[-70, -20, 30, 80].map((hx) => <circle key={hx} cx={hx} cy={-110} r={10} fill={COL.fire} opacity={0.55} />)}
      <path d="M 110 -186 L 96 -10" stroke={COL.fire} strokeWidth={6} opacity={0.4} />
    </g>
  );
};

/** Narrator, seen from behind: hoodie (hood down), tote bag, jeans. feet at (x,y), height h. phase = gait 0..1. rim = side light colour. */
export const Walker: React.FC<{ x: number; y: number; h: number; phase?: number; amp?: number; rim?: string }> = ({ x, y, h, phase = 0, amp = 1, rim = COL.hoodieRim }) => {
  const k = h / 1000;
  const a = Math.sin(phase * Math.PI * 2) * amp;
  const bob = -Math.abs(Math.cos(phase * Math.PI * 2)) * 14 * amp;
  const leg = (sg: number) => {
    const sw = sg * a, fy = -sw * 46;
    const fx = sg * 32 + sw * 20;
    return <g key={sg}>
      <path d={`M ${sg * 44 - 34} -470 L ${sg * 44 + 34} -470 L ${fx + 24} ${-40 + Math.min(0, fy)} L ${fx - 26} ${-40 + Math.min(0, fy)} Z`} fill={COL.jeans} />
      <path d={`M ${fx - 32} ${-46 + Math.min(0, fy)} L ${fx + 30} ${-46 + Math.min(0, fy)} L ${fx + 34} ${Math.min(0, fy)} L ${fx - 34} ${Math.min(0, fy)} Z`} fill="#d9d4cc" />
    </g>;
  };
  const arm = (sg: number) => {
    const sw = -sg * a * 22;
    return <g key={`a${sg}`}>
      <path d={`M ${sg * 100} -800 Q ${sg * 140} -700 ${sg * 128 + sw} -520 L ${sg * 92 + sw} -510 Q ${sg * 98} -660 ${sg * 70} -760 Z`} fill={COL.hoodie} />
      <ellipse cx={sg * 112 + sw} cy={-498} rx={22} ry={28} fill="#7a5a4c" />
    </g>;
  };
  return (
    <g transform={`translate(${x},${y + bob * k}) scale(${k})`}>
      {leg(-1)}{leg(1)}
      {arm(-1)}{arm(1)}
      {/* hoodie body */}
      <path d="M -110 -810 Q -60 -850 0 -850 Q 60 -850 110 -810 L 122 -470 Q 0 -450 -122 -470 Z" fill={COL.hoodie} />
      {/* hood down, bunched at the neck */}
      <path d="M -82 -840 Q 0 -760 82 -840 Q 70 -880 0 -880 Q -70 -880 -82 -840 Z" fill="#232a36" />
      {/* tote strap + bag on right hip */}
      <path d="M -70 -832 L 104 -560" stroke="#c9b79a" strokeWidth={14} />
      <path d="M 70 -620 L 196 -620 L 210 -420 L 62 -420 Z" fill="#cbb999" />
      <path d="M 70 -620 L 196 -620" stroke="#8d7c62" strokeWidth={4} />
      {/* neck, head, hair (ponytail) */}
      <rect x={-20} y={-900} width={40} height={50} fill="#7a5a4c" />
      <ellipse cx={0} cy={-950} rx={64} ry={72} fill="#0f0b0c" />
      <path d={`M -10 -960 Q ${-30 + a * 10} -870 ${-14 + a * 14} -800 L ${14 + a * 14} -800 Q ${20} -880 20 -960 Z`} fill="#0f0b0c" />
      {/* rim light (lanterns are on her right side) */}
      <path d="M 40 -1012 Q 70 -990 64 -930" stroke={rim} strokeWidth={6} fill="none" opacity={0.9} />
      <path d="M 110 -810 L 122 -470" stroke={rim} strokeWidth={6} fill="none" opacity={0.7} />
      <path d="M 0 -850 Q 60 -850 110 -810" stroke={rim} strokeWidth={5} fill="none" opacity={0.6} />
    </g>
  );
};
