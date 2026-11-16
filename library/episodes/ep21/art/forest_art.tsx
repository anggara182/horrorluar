import React from 'react';
import { rng } from './world';

export const P = {
  birch: '#cfd3d6', spruce: '#0a1210', snow: '#d8e2ea', snowSh: '#5d6f85', moon: '#e9eef5',
  log: '#3a2b20', logD: '#22180f', moss: '#3d4a2a', win: '#ffb35c', leg: '#8a7a62', legD: '#4e4434',
  coat: '#9b2d2d', coatD: '#5e1a1c', scarf: '#5a2a2a', boot: '#2a2220', skin: '#c9a08a', oven: '#ff8a3d',
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** One scaly chicken leg from hip (hx,hy) to foot (fx,0); knee pushed outward by `out`. */
const Leg: React.FC<{ hx: number; hy: number; fx: number; out: number; flip: number }> = ({ hx, hy, fx, out, flip }) => {
  const kx = lerp(hx, fx, 0.5) + out * flip, ky = hy * 0.48;
  const ax = fx - 10 * flip, ay = -26;
  const scales = [0.2, 0.35, 0.5, 0.65, 0.8].map((t) => ({ x: lerp(kx, ax, t), y: lerp(ky, ay, t) }));
  return (
    <g>
      <path d={`M${hx - 34} ${hy} Q${kx - 40} ${ky - 30} ${kx - 22} ${ky} L${kx + 22} ${ky} Q${kx + 40} ${ky - 30} ${hx + 34} ${hy} Z`} fill={P.legD} />
      <path d={`M${kx - 16} ${ky} L${ax - 9} ${ay} L${ax + 9} ${ay} L${kx + 16} ${ky} Z`} fill={P.leg} />
      {scales.map((s, i) => <path key={i} d={`M${s.x - 12} ${s.y} q12 9 24 0`} stroke={P.legD} strokeWidth={3} fill="none" />)}
      <path d={`M${kx + 16 * flip} ${ky} L${ax + 9 * flip} ${ay}`} stroke="#d9c9a8" strokeWidth={3} opacity={0.6} />
      {/* talons */}
      <path d={`M${ax - 6} ${ay} L${ax - 70} ${-2} L${ax - 78} ${6} L${ax - 60} 4 L${ax} ${ay + 14}
        L${ax + 66} 2 L${ax + 76} 8 L${ax + 60} -4 L${ax + 6} ${ay} Z`} fill={P.leg} />
      <path d={`M${ax - 4} ${ay + 6} L${ax - 4} 10 L${ax + 2} 16 L${ax + 6} ${ay + 6} Z`} fill={P.legD} />
    </g>
  );
};

/** Hut on chicken legs, origin = ground centre between the feet. turn 0 = side (window), 1 = front (door). bend 0..1, door 0..1 open. */
export const Hut: React.FC<{ x: number; y: number; s?: number; turn?: number; bend?: number; door?: number; t?: number; glow?: number; sil?: boolean }> = ({ x, y, s = 1, turn = 0, bend = 0, door = 0, t = 0, glow = 1, sil = false }) => {
  const L = lerp(430, 230, bend);
  const top = -L - 250;
  const bw = lerp(400, 340, turn);
  const winX = lerp(-50, -110, turn), doorX = lerp(175, 20, turn), doorW = lerp(10, 90, turn);
  const logs = [0, 1, 2, 3, 4, 5].map((i) => -L - 20 - i * 40);
  const c = (col: string) => (sil ? '#0d1218' : col);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <radialGradient id="hutWin"><stop offset="0" stopColor={P.win} stopOpacity={0.75 * glow} /><stop offset="1" stopColor={P.win} stopOpacity={0} /></radialGradient>
        <linearGradient id="hutSpill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={P.oven} stopOpacity={0.75} /><stop offset="1" stopColor={P.oven} stopOpacity={0} /></linearGradient>
      </defs>
      <ellipse cx={0} cy={6} rx={260} ry={26} fill={P.snowSh} opacity={0.6} />
      <Leg hx={-70} hy={-L + 10} fx={-110} out={-60 - bend * 70} flip={-1} />
      <Leg hx={70} hy={-L + 10} fx={110} out={60 + bend * 70} flip={1} />
      {/* body */}
      <rect x={-bw / 2} y={top} width={bw} height={250} fill={c(P.log)} />
      {!sil && logs.map((ly, i) => <g key={i}><line x1={-bw / 2} x2={bw / 2} y1={ly} y2={ly} stroke={P.logD} strokeWidth={6} />
        <circle cx={-bw / 2 - 6} cy={ly - 18} r={18} fill="#4a3828" /><circle cx={bw / 2 + 6} cy={ly - 18} r={18} fill="#4a3828" /></g>)}
      <path d={`M${-bw / 2 - 50} ${top + 10} L0 ${top - 170} L${bw / 2 + 50} ${top + 10} Z`} fill={c(P.moss)} />
      <path d={`M${-bw / 2 - 50} ${top + 10} L0 ${top - 170} L${bw / 2 + 50} ${top + 10} L${bw / 2 + 20} ${top - 8} L0 ${top - 140} L${-bw / 2 - 20} ${top - 8} Z`} fill={c('#d8e2ea')} opacity={0.85} />
      <rect x={90} y={top - 150} width={40} height={90} fill={c(P.logD)} />
      {!sil && [0, 1, 2].map((i) => { const k = ((t * 0.25 + i / 3) % 1); return <circle key={i} cx={110 + k * 60 + Math.sin(k * 6 + i) * 14} cy={top - 170 - k * 220} r={20 + k * 40} fill="#9aa7b6" opacity={0.35 * (1 - k)} />; })}
      {/* window */}
      <circle cx={winX} cy={top + 110} r={140} fill="url(#hutWin)" />
      <rect x={winX - 38} y={top + 80} width={76} height={64} fill={P.win} />
      <path d={`M${winX} ${top + 80} V${top + 144} M${winX - 38} ${top + 112} H${winX + 38}`} stroke={P.logD} strokeWidth={6} />
      {/* door */}
      {turn > 0.15 && <g>
        <rect x={doorX - doorW / 2} y={top + 60} width={doorW} height={190} fill={door > 0 ? P.oven : P.logD} />
        {door > 0 && <rect x={doorX - doorW / 2} y={top + 60} width={doorW} height={190} fill="#ffd08a" opacity={0.5 * door} />}
        <rect x={doorX - doorW / 2} y={top + 60} width={doorW * (1 - 0.85 * door)} height={190} fill="#2b1f15" stroke={P.logD} strokeWidth={4} />
      </g>}
    </g>
  );
};

/** Light spill from an open door down to the snow (world coords). */
export const Spill: React.FC<{ x: number; y: number; w: number; h: number; o: number }> = ({ x, y, w, h, o }) => (
  <g opacity={o}>
    <defs><radialGradient id="spillR" cx="0.5" cy="0" r="1"><stop offset="0" stopColor="#ffb35c" stopOpacity={1} /><stop offset="1" stopColor="#ff8a3d" stopOpacity={0} /></radialGradient></defs>
    <path d={`M${x - w * 0.15} ${y} L${x + w * 0.15} ${y} L${x + w / 2} ${y + h} L${x - w / 2} ${y + h} Z`} fill="url(#spillR)" />
  </g>
);

/** Small girl, back view (wading). Origin at feet. h = full height. */
export const GirlBack: React.FC<{ x: number; y: number; h: number; phase?: number; rim?: string }> = ({ x, y, h, phase = 0, rim = '#bcd2ee' }) => {
  const s = h / 300, sw = Math.sin(phase) * 6, bob = Math.abs(Math.sin(phase)) * 4;
  return (
    <g transform={`translate(${x} ${y - bob}) scale(${s})`}>
      <ellipse cx={0} cy={0} rx={70} ry={12} fill={P.snowSh} opacity={0.6} />
      <path d={`M-28 -60 L-26 ${-4 + sw} L-6 ${-4 + sw} L-6 -60 Z`} fill={P.boot} />
      <path d={`M6 -60 L6 ${-4 - sw} L26 ${-4 - sw} L28 -60 Z`} fill={P.boot} />
      <path d="M-62 -70 Q-56 -170 -34 -205 L34 -205 Q56 -170 62 -70 Q0 -58 -62 -70 Z" fill={P.coat} />
      <path d="M-62 -70 Q-56 -170 -34 -205 L-20 -205 Q-34 -150 -36 -68 Z" fill={P.coatD} opacity={0.7} />
      <path d={`M-36 -195 Q-60 -150 ${-58 + sw} -112`} stroke={P.coat} strokeWidth={22} strokeLinecap="round" fill="none" />
      <path d={`M36 -195 Q60 -150 ${58 - sw} -112`} stroke={P.coat} strokeWidth={22} strokeLinecap="round" fill="none" />
      <circle cx={-58 + sw} cy={-106} r={11} fill={P.coatD} /><circle cx={58 - sw} cy={-106} r={11} fill={P.coatD} />
      <path d="M-40 -205 Q-46 -268 0 -272 Q46 -268 40 -205 Q0 -196 -40 -205 Z" fill={P.scarf} />
      <path d="M-6 -206 L-22 -168 L4 -172 Z" fill={P.scarf} />
      <path d="M40 -205 Q46 -268 0 -272" stroke={rim} strokeWidth={4} fill="none" opacity={0.7} />
      <path d="M60 -72 Q56 -170 34 -205" stroke={rim} strokeWidth={4} fill="none" opacity={0.55} />
      <path d="M-62 -70 Q0 -58 62 -70 L62 -40 Q0 -28 -62 -40 Z" fill={P.snow} />
    </g>
  );
};

/** Close profile of the girl facing right; (x,y) = nose tip-ish, s scale. */
export const GirlProfile: React.FC<{ x: number; y: number; s?: number; breath?: number; t?: number }> = ({ x, y, s = 1, breath = 0, t = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <defs><radialGradient id="faceLit" cx="0.8" cy="0.4"><stop offset="0" stopColor="#f0c3a0" /><stop offset="1" stopColor="#7a5a58" /></radialGradient></defs>
    {/* coat shoulders */}
    <path d="M-520 520 Q-500 260 -330 210 L-120 200 Q40 250 80 520 Z" fill={P.coat} />
    <path d="M-520 520 Q-500 260 -330 210 L-260 210 Q-400 300 -400 520 Z" fill={P.coatD} />
    {/* face */}
    <path d="M-220 -230 Q-60 -260 -20 -120 Q-8 -70 4 -40 Q20 -10 -2 -2 Q-6 30 -24 40 Q-10 70 -40 90 Q-60 140 -120 160 L-120 210 L-300 210 L-300 -100 Z" fill="url(#faceLit)" />
    <path d="M-20 -120 Q-8 -70 4 -40 Q20 -10 -2 -2 Q-6 30 -24 40 Q-10 70 -40 90 Q-60 140 -120 160" stroke="#ffd2a8" strokeWidth={5} fill="none" opacity={0.8} />
    <path d="M-70 -70 Q-48 -80 -30 -66" stroke="#2a1a1a" strokeWidth={8} strokeLinecap="round" fill="none" />
    <circle cx={-48} cy={-56} r={9} fill="#1a1010" /><circle cx={-45} cy={-59} r={3} fill="#ffe0b0" />
    <ellipse cx={-120} cy={30} rx={40} ry={26} fill="#d06a6a" opacity={0.35} />
    {/* headscarf */}
    <path d="M-60 -170 Q-120 -300 -280 -290 Q-430 -270 -470 -120 Q-500 40 -420 170 Q-360 230 -260 220 Q-190 160 -180 60 Q-170 -60 -110 -110 Q-80 -140 -60 -170 Z" fill={P.scarf} />
    <path d="M-60 -170 Q-120 -300 -280 -290" stroke="#c98a6a" strokeWidth={6} fill="none" opacity={0.6} />
    <path d="M-300 210 L-250 330 L-200 320 L-230 210 Z" fill={P.scarf} />
    {/* breath */}
    {[0, 1, 2].map((i) => { const k = Math.min(1, Math.max(0, breath * 1.4 - i * 0.2)); return k > 0 ? <circle key={i} cx={30 + k * 200 + i * 30} cy={20 - k * 60} r={30 + k * 70} fill="#e9eef5" opacity={0.28 * (1 - k)} /> : null; })}
  </g>
);

/** Three-toed bird print. */
export const Print: React.FC<{ x: number; y: number; s?: number; r?: number }> = ({ x, y, s = 1, r = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s} ${s * 0.45})`} fill="#3c4a60" opacity={0.85}>
    <path d="M0 0 L-60 -90 L-48 -96 L4 -14 Z" /><path d="M-6 0 L0 -120 L12 -120 L8 0 Z" /><path d="M2 -12 L60 -92 L70 -84 L10 6 Z" /><path d="M-4 0 L-2 50 L8 50 L6 0 Z" />
  </g>
);

/** Falling snow (deterministic). */
export const Snowfall: React.FC<{ t: number; n?: number; seed?: number; o?: number; size?: number }> = ({ t, n = 70, seed = 7, o = 0.8, size = 4 }) => {
  const r = rng(seed);
  return <g fill="#eef3f8" opacity={o}>{Array.from({ length: n }, (_, i) => {
    const x0 = r() * 1296, y0 = r() * 2304, sp = 60 + r() * 90, sz = size * (0.5 + r());
    const y = (y0 + t * sp) % 2304, x = x0 + Math.sin(t * 0.8 + i) * 20;
    return <circle key={i} cx={x} cy={y} r={sz} />;
  })}</g>;
};
