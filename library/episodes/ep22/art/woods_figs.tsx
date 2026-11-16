import React from 'react';
import { WC } from '../sets/woods';

/** Huldra, feet at (x,y), height h. view front/back. sway -1..1, hem 0..1 (wind), tail 0..1 visible, swish -1..1 */
export const Huldra: React.FC<{ x: number; y: number; h: number; view: 'front' | 'back'; sway?: number; hem?: number; tail?: number; swish?: number; smile?: number; id: string }> = ({ x, y, h, view, sway = 0, hem = 0, tail = 0, swish = 0, smile = 1, id }) => {
  const s = h / 1000; // design in 1000-unit height, feet at 0
  const hw = hem * 40;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <linearGradient id={`${id}d`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={WC.dressD} /><stop offset="0.6" stopColor={WC.dress} /><stop offset="1" stopColor="#f4ecd8" /></linearGradient>
        <linearGradient id={`${id}h`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f6dc93" /><stop offset="1" stopColor={WC.hairD} /></linearGradient>
      </defs>
      {/* tail (behind dress in front view, drawn first) */}
      {tail > 0 && view === 'front' && (
        <g opacity={tail}>
          <path d={`M -10 -120 C ${-60 + swish * 30} -40 ${-150 + swish * 70} -30 ${-170 + swish * 90} -10`} stroke={WC.bark} strokeWidth={16} fill="none" strokeLinecap="round" />
          <path d={`M ${-170 + swish * 90} -10 q -30 -10 -40 20 q 25 0 40 10 q 10 -20 0 -30 Z`} fill={WC.barkD} />
        </g>
      )}
      {tail > 0 && view === 'back' && <CowTail o={tail} swish={swish} />}
      {/* legs hint */}
      <rect x={-34} y={-60} width={22} height={60} fill={WC.skinD} /><rect x={12} y={-60} width={22} height={60} fill={WC.skinD} />
      {/* dress */}
      <path d={`M -70 -800 Q -90 -600 -95 -500 Q -140 -250 ${-170 - hw} -70 Q -60 ${-50 + hem * 30} 0 -60 Q 80 ${-50 - hem * 20} ${170 + hw * 1.5} -80 Q 140 -250 95 -500 Q 90 -600 70 -800 Z`} fill={`url(#${id}d)`} />
      <path d="M -95 -500 Q 0 -480 95 -500" stroke={WC.dressD} strokeWidth={10} fill="none" />
      {/* arms */}
      <path d="M -70 -790 Q -110 -650 -105 -480 L -80 -480 Q -85 -640 -55 -760 Z" fill={view === 'front' ? WC.skin : WC.dress} />
      <path d="M 70 -790 Q 110 -650 105 -480 L 80 -480 Q 85 -640 55 -760 Z" fill={view === 'front' ? WC.skin : WC.dress} />
      {/* neck */}
      <rect x={-18} y={-850} width={36} height={60} fill={WC.skinD} />
      {/* head */}
      <ellipse cx={0} cy={-905} rx={52} ry={66} fill={view === 'front' ? WC.skin : WC.hairD} />
      {/* hair: big shape */}
      {view === 'front' ? (
        <g>
          <path d={`M -58 -930 Q -60 -985 0 -985 Q 60 -985 58 -930 Q 70 -800 ${95 + sway * 20} -560 L ${60 + sway * 20} -600 Q 52 -760 44 -900 Q 0 -950 -44 -900 Q -52 -760 ${-60 + sway * 20} -600 L ${-95 + sway * 20} -560 Q -70 -800 -58 -930 Z`} fill={`url(#${id}h)`} />
          <path d={`M -10 -860 Q 0 ${-852 + 6 * smile} 10 -860`} stroke={WC.skinD} strokeWidth={4} fill="none" strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <path d={`M -58 -930 Q -60 -985 0 -985 Q 60 -985 58 -930 Q 80 -800 ${100 + sway * 20} -520 Q 70 -540 52 -560 Q 60 -700 40 -800 Q 0 -830 -40 -800 Q -60 -700 -52 -560 Q -70 -540 ${-100 + sway * 20} -520 Q -80 -800 -58 -930 Z`} fill={`url(#${id}h)`} />
        </g>
      )}
      {view === 'back' && (
        <g>
          {/* hollow bark back between the parted hair */}
          <path d="M -50 -790 Q -70 -620 -40 -470 Q 0 -440 40 -470 Q 70 -620 50 -790 Q 0 -810 -50 -790 Z" fill={WC.bark} />
          <path d="M -32 -760 Q -45 -620 -25 -500 Q 0 -485 25 -500 Q 45 -620 32 -760 Q 0 -775 -32 -760 Z" fill={WC.barkD} />
          <path d="M -20 -730 Q -28 -620 -12 -530 M 14 -740 Q 24 -640 8 -520 M -38 -700 Q -48 -600 -30 -520" stroke="#5a4130" strokeWidth={6} fill="none" />
        </g>
      )}
      {/* tail (behind dress in front view, drawn first) */}
      {/* strands + rim */}
      <path d={`M 40 -920 Q 70 -760 ${80 + sway * 20} -580 M -40 -920 Q -66 -760 ${-78 + sway * 20} -580`} stroke="#fff0bf" strokeWidth={5} fill="none" opacity={0.8} />
      <path d={`M 58 -940 Q 82 -800 ${98 + sway * 20} -560`} stroke={WC.rim} strokeWidth={8} fill="none" />
      <path d={`M 70 -790 Q 100 -500 ${165 + hw * 1.5} -85`} stroke={WC.rim} strokeWidth={6} fill="none" opacity={0.7} />
    </g>
  );
};

/** tapered cow tail emerging under the hem (local huldra units), dark tuft at the tip */
const CowTail: React.FC<{ o: number; swish: number }> = ({ o, swish }) => {
  const P0 = [-5, -80], P1 = [-40 + swish * 20, 0], P2 = [-150 + swish * 30, -5], P3 = [-205 + swish * 40, -55 - Math.abs(swish) * 15];
  const pt = (t: number) => { const u = 1 - t; return [0, 1].map((i) => u * u * u * P0[i] + 3 * u * u * t * P1[i] + 3 * u * t * t * P2[i] + t * t * t * P3[i]); };
  const L: number[][] = [], R: number[][] = [];
  for (let i = 0; i <= 16; i++) {
    const t = i / 16, [x, y] = pt(t), [x2, y2] = pt(Math.min(1, t + 0.02)), [x1, y1] = pt(Math.max(0, t - 0.02));
    const dx = x2 - x1, dy = y2 - y1, n = Math.hypot(dx, dy) || 1, w = 16 * (1 - t) + 4;
    L.push([x - (dy / n) * w, y + (dx / n) * w]); R.push([x + (dy / n) * w, y - (dx / n) * w]);
  }
  const d = 'M ' + L.map((q) => q.join(' ')).join(' L ') + ' L ' + R.reverse().map((q) => q.join(' ')).join(' L ') + ' Z';
  const [tx, ty] = pt(1), [px, py] = pt(0.94), ang = (Math.atan2(ty - py, tx - px) * 180) / Math.PI;
  return (
    <g opacity={o}>
      <path d={d} fill={WC.bark} />
      <g transform={`translate(${tx} ${ty}) rotate(${ang + swish * 15})`}>
        <path d="M -6 0 Q 24 -34 76 -24 Q 98 -6 86 6 Q 102 20 78 28 Q 28 38 -6 0 Z" fill={WC.barkD} />
        <path d="M 10 -6 L 60 -14 M 14 4 L 70 6 M 10 10 L 58 20" stroke="#4a3526" strokeWidth={3} />
      </g>
      <path d={`M -5 -80 Q ${-25 + swish * 25} -20 ${-70 + swish * 40} -30`} stroke={WC.rim} strokeWidth={3} fill="none" opacity={0.6} />
    </g>
  );
};

/** Boy (~16) from behind, feet at (x,y), height h. step 0..1 walking phase. */
export const BoyBack: React.FC<{ x: number; y: number; h: number; step?: number }> = ({ x, y, h, step = 0 }) => {
  const s = h / 1000, a = Math.sin(step * Math.PI * 2) * 40 + 25, sw = Math.sin(step * Math.PI * 2) * 12;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* legs with stride: thigh -> knee -> shin -> boot */}
      <path d={`M -62 -470 Q ${-60 - a * 0.4} -250 ${-55 - a * 0.6} -230 L ${-60 - a} -20 L ${-20 - a} -20 L ${-25 - a * 0.6} -230 Q -15 -300 -4 -460 Z`} fill="#1b2230" />
      <path d={`M 62 -470 Q ${58 + a * 0.3} -250 ${52 + a * 0.4} -230 L ${58 + a * 0.6} -20 L ${18 + a * 0.6} -20 L ${22 + a * 0.4} -230 Q 15 -300 4 -460 Z`} fill="#222a3a" />
      <path d={`M ${-68 - a} -30 h 52 q 8 30 -4 30 h -52 Z M ${12 + a * 0.6} -30 h 52 q 8 30 -4 30 h -52 Z`} fill="#140f0b" />
      {/* torso: broad shoulders, slimmer waist, ribbed hem */}
      <path d="M -125 -790 Q -140 -770 -128 -700 Q -100 -580 -78 -470 L 78 -470 Q 100 -580 128 -700 Q 140 -770 125 -790 Q 70 -830 0 -828 Q -70 -830 -125 -790 Z" fill={WC.sweater} />
      <rect x={-80} y={-482} width={160} height={30} rx={8} fill="#4a2f23" />
      {/* arms: upper + forearm with elbow bend, mitten hands */}
      <path d={`M -120 -785 Q -165 -700 -158 -620 Q ${-160 + sw} -540 ${-145 + sw} -470 L ${-115 + sw} -472 Q ${-125 + sw} -545 -122 -620 Q -118 -700 -100 -760 Z`} fill="#4a2f23" />
      <ellipse cx={-130 + sw} cy={-450} rx={20} ry={26} fill="#9a7058" />
      <path d={`M 120 -785 Q 165 -700 160 -620 Q 165 -560 150 -520 L 122 -530 Q 132 -580 124 -620 Q 118 -700 100 -760 Z`} fill="#4a2f23" />
      <ellipse cx={138} cy={-515} rx={22} ry={24} fill="#9a7058" />
      <line x1={140} y1={-600} x2={200} y2={-20} stroke="#3d2b1c" strokeWidth={14} strokeLinecap="round" />
      {/* neck, head, blond hair under cap */}
      <rect x={-22} y={-850} width={44} height={50} fill="#9a7058" />
      <ellipse cx={0} cy={-905} rx={58} ry={64} fill="#7f6232" />
      <path d="M -40 -930 Q -44 -880 -30 -850 M 0 -930 Q 2 -880 -4 -846 M 38 -930 Q 44 -880 30 -852" stroke="#7d5f2c" strokeWidth={6} fill="none" />
      <path d="M -66 -910 Q -66 -990 0 -992 Q 66 -990 66 -910 Q 0 -930 -66 -910 Z" fill={WC.cap} />
      {/* rim */}
      <path d="M 125 -790 Q 150 -720 160 -620" stroke={WC.rim} strokeWidth={6} fill="none" opacity={0.85} />
      <path d="M 60 -950 Q 70 -900 56 -862" stroke={WC.rim} strokeWidth={5} fill="none" opacity={0.85} />
      <path d="M 120 -720 Q 105 -600 80 -480" stroke={WC.rim} strokeWidth={4} fill="none" opacity={0.5} />
    </g>
  );
};

/** Boy profile close-up (facing right), anchor (x,y), scale s. gulp 0..1 */
export const BoyProfile: React.FC<{ x: number; y: number; s: number; gulp?: number; blink?: number }> = ({ x, y, s, gulp = 0, blink = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <defs>
      <linearGradient id="bpSk" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#6e4a3a" /><stop offset="0.6" stopColor="#b98a68" /><stop offset="1" stopColor="#f0c99a" /></linearGradient>
      <linearGradient id="bpSw" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#3a2519" /><stop offset="1" stopColor={WC.sweater} /></linearGradient>
    </defs>
    {/* shoulders + sweater */}
    <path d="M -280 520 L -260 250 Q -200 170 -70 165 Q 90 165 170 240 L 230 520 Z" fill="url(#bpSw)" />
    {/* neck */}
    <path d="M -45 30 Q -55 120 -60 190 L 85 190 Q 70 140 75 95 Z" fill="url(#bpSk)" />
    <path d={`M 62 ${120 - gulp * 16} q 10 6 0 14`} stroke="#8a6248" strokeWidth={5} fill="none" />
    {/* ribbed collar */}
    <path d="M -75 175 Q 10 205 95 180 L 100 215 Q 10 245 -80 210 Z" fill="#6a4433" />
    <path d="M -50 190 l 0 30 M -20 196 l 0 32 M 10 199 l 0 32 M 40 197 l 0 30 M 70 190 l 0 28" stroke="#4a2f23" strokeWidth={4} />
    {/* head: back of skull, forehead, brow, nose, lips, chin, jaw */}
    <path d="M -115 -40 Q -125 -170 0 -185 Q 120 -190 145 -110 Q 150 -85 158 -72 Q 150 -58 152 -48 Q 168 -25 188 2 Q 190 12 172 14 Q 166 18 162 22 Q 172 30 166 38 Q 158 42 160 48 Q 168 56 160 66 Q 150 72 150 78 Q 160 92 150 108 Q 120 125 85 112 Q 60 100 45 75 Q -90 70 -115 -40 Z" fill="url(#bpSk)" />
    {/* gold front light along the profile */}
    <path d="M 145 -110 Q 150 -85 158 -72 Q 150 -58 152 -48 Q 168 -25 188 2 Q 190 12 172 14 M 162 22 Q 172 30 166 38 Q 158 42 160 48 Q 168 56 160 66 M 150 78 Q 160 92 150 108" stroke={WC.rim} strokeWidth={5} fill="none" strokeLinecap="round" />
    {/* lips line, nostril */}
    <path d="M 166 39 Q 150 42 140 40" stroke="#8a5a48" strokeWidth={3} fill="none" />
    <path d="M 160 4 Q 152 0 150 8" stroke="#8a5a48" strokeWidth={3} fill="none" />
    {/* eye + brow */}
    <path d={`M 118 -50 Q 132 ${-58 + blink * 8} 144 -52 Q 132 -44 118 -50 Z`} fill="#1a1210" />
    <path d="M 108 -74 Q 128 -84 150 -76" stroke="#b08844" strokeWidth={7} fill="none" strokeLinecap="round" />
    {/* blond hair under the cap: nape + sideburn + strands */}
    <path d="M -125 -70 Q -140 20 -95 60 Q -60 40 -50 0 Q -20 -40 40 -40 Q 70 -60 80 -95 L -120 -110 Z" fill="#d9b15e" />
    <path d="M -110 -40 Q -100 10 -80 40 M -80 -50 Q -70 -10 -55 20 M 20 -60 Q 50 -60 70 -90" stroke="#f3d48a" strokeWidth={5} fill="none" />
    <path d="M -130 -60 Q -145 10 -100 62" stroke={WC.rim} strokeWidth={4} fill="none" opacity={0.6} />
    {/* cap */}
    <path d="M -135 -70 Q -145 -225 20 -228 Q 150 -222 162 -112 L 232 -100 Q 234 -78 150 -84 Q 20 -110 -135 -70 Z" fill={WC.cap} />
    <path d="M 20 -228 Q 150 -222 162 -112 L 232 -100" stroke={WC.rim} strokeWidth={5} fill="none" opacity={0.7} />
  </g>
);
