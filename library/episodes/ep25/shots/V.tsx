import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, handheld, ramp, EIO } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { W, H } from '../art/world';
import { HUT_WIN, GROUND, VC } from '../sets/village';

const Glow: React.FC<{ id: string; x: number; y: number; r: number; c: string; o: number }> = ({ id, x, y, r, c, o }) => (
  <g>
    <defs><radialGradient id={id}><stop offset="0" stopColor={c} stopOpacity={o} /><stop offset="0.4" stopColor={c} stopOpacity={o * 0.35} /><stop offset="1" stopColor={c} stopOpacity="0" /></radialGradient></defs>
    <circle cx={x} cy={y} r={r} fill={`url(#${id})`} />
  </g>
);

/** shot 1 — homestead under the stars, one window glowing; slow push-in toward the window. */
export const S01: React.FC = () => {
  const { p, t, fps } = useShot();
  const tf = wordAt(1, /footsteps/, 0.45);
  const fl = 0.85 + 0.1 * Math.sin(t * 7.3) + 0.05 * Math.sin(t * 13.1);
  const z = 1.05 + 0.25 * EIO(p);
  const { hx, hy } = handheld(t, 0.25);
  const cam: Cam = { zoom: z, dx: 0, dy: 0, tx: hx, ty: hy, ox: HUT_WIN.x - 108, oy: HUT_WIN.y - 192 };
  // tiny shadow scurrying along the yard after "footsteps"
  const sp = ramp(t, tf, tf + 1.6);
  return <AbsoluteFill style={{ backgroundColor: VC.sky0 }}>
    <BandImg id="village/sky" k={0.35} cam={cam} />
    <BandImg id="village/huts" k={1} cam={cam} />
    <Live k={1} cam={cam}>
      <defs><linearGradient id="v1d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0a1124" stopOpacity="0" /><stop offset="0.3" stopColor="#0a1124" stopOpacity="0.68" /><stop offset="1" stopColor="#0a1124" stopOpacity="0.7" /></linearGradient></defs>
      <rect x={-200} y={1100} width={W + 400} height={600} fill="url(#v1d)" />
      <rect x={HUT_WIN.x - 22} y={HUT_WIN.y - 30} width={44} height={54} rx={4} fill={VC.candle} opacity={0.9 * fl} />
      <rect x={HUT_WIN.x - 2} y={HUT_WIN.y - 30} width={4} height={54} fill="#3a2410" opacity={0.8} />
      <Glow id="v1w" x={HUT_WIN.x} y={HUT_WIN.y} r={220} c={VC.candle} o={0.5 * fl} />
      <Glow id="v1y" x={HUT_WIN.x + 20} y={GROUND + 60} r={200} c={VC.candle} o={0.3 * fl} />
      <path d="M568 1034 L770 1256" stroke="#9fb6e0" strokeWidth={3} opacity={0.4} />
      <path d="M968 1128 L1100 1288" stroke="#9fb6e0" strokeWidth={2.5} opacity={0.3} />
      {sp > 0 && sp < 1 && <ellipse cx={440 + 240 * sp} cy={GROUND + 48 + 5 * Math.sin(sp * 30)} rx={30} ry={10} fill="#050505" opacity={0.95 * Math.sin(sp * Math.PI)} />}
    </Live>
    <BandImg id="village/fg" k={1.25} cam={cam} />
  </AbsoluteFill>;
};

/** Grandmother silhouette carrying a stack of bricks. (x,b) = feet centre. ph = walk phase. */
const Gran: React.FC<{ x: number; b: number; s: number; ph: number; rim: string }> = ({ x, b, s, ph, rim }) => {
  const sw = Math.sin(ph) * 9, bob = Math.abs(Math.cos(ph)) * 4;
  const body = '#141218', cloth = '#2a1e22';
  return <g transform={`translate(${x} ${b - bob}) scale(${s})`}>
    {/* legs (long skirt hides most of them) */}
    <path d={`M-14 -70 L${-14 + sw} 0 L${-2 + sw} 0 L-2 -70 Z`} fill={body} />
    <path d={`M4 -70 L${4 - sw} 0 L${16 - sw} 0 L16 -70 Z`} fill={body} />
    {/* skirt */}
    <path d="M-34 -150 Q-46 -80 -44 -22 Q0 -14 44 -22 Q46 -80 32 -150 Z" fill={cloth} />
    {/* torso + shawl */}
    <path d="M-30 -230 Q-44 -200 -40 -150 L36 -150 Q42 -200 28 -230 Q0 -240 -30 -230 Z" fill={body} />
    <path d="M-36 -228 Q-48 -180 -40 -150 Q-10 -168 6 -190 Q-12 -210 -36 -228 Z" fill={cloth} />
    {/* arms forward holding bricks */}
    <path d="M-26 -222 Q-12 -190 26 -178 L30 -166 Q-20 -176 -36 -210 Z" fill={body} />
    <path d="M22 -224 Q40 -196 48 -178 L38 -172 Q28 -192 14 -214 Z" fill={body} />
    {/* bricks stack */}
    {[0, 1, 2, 3].map((i) => <rect key={i} x={20 + (i % 2) * 4} y={-216 + i * 14} width={56} height={13} rx={1.5} fill="#8a3b2a" stroke="#3d1a12" strokeWidth={1.5} />)}
    {/* neck + head + headwrap */}
    <rect x={-6} y={-246} width={12} height={16} fill={body} />
    <ellipse cx={2} cy={-262} rx={15} ry={18} fill={body} />
    <path d="M-16 -268 Q-20 -296 4 -300 Q30 -298 22 -268 Q4 -276 -16 -268 Z" fill={cloth} />
    <path d="M18 -284 Q32 -290 30 -276 Q24 -276 18 -280 Z" fill={cloth} />
    {/* rim light (left side, toward the dawn) */}
    <path d="M-16 -268 Q-20 -296 4 -300" stroke={rim} strokeWidth={3} fill="none" />
    <path d="M-14 -258 Q-16 -248 -8 -244" stroke={rim} strokeWidth={2.5} fill="none" />
    <path d="M-36 -228 Q-48 -180 -40 -150 Q-46 -80 -44 -22" stroke={rim} strokeWidth={3} fill="none" />
    <path d="M22 -206 L72 -206" stroke="#ffb59a" strokeWidth={2.5} />
  </g>;
};

/** shot 11 — the homestead at dawn; grandmother crosses the yard with bricks; slow pull-back. */
export const S11: React.FC = () => {
  const { p, t } = useShot();
  const z = 1.14 - 0.14 * EIO(p);
  const cam: Cam = { zoom: z, dx: 0, dy: 0, ox: 560, oy: 1100 };
  const gx = 860 - 220 * p;
  return <AbsoluteFill style={{ backgroundColor: '#2b2340' }}>
    <Live k={0.35} cam={cam}>
      <defs>
        <linearGradient id="v11s" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b2a52" /><stop offset="0.3" stopColor="#6d4c7a" /><stop offset="0.5" stopColor="#d98a8a" /><stop offset="0.6" stopColor="#ffc59a" /><stop offset="1" stopColor="#ffd9b0" />
        </linearGradient>
      </defs>
      <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="url(#v11s)" />
      <Glow id="v11g" x={300} y={1300} r={600} c="#fff0d8" o={0.7} />
      <circle cx={300} cy={1270} r={40} fill="#fff4e2" opacity={0.9} />
    </Live>
    <BandImg id="village/huts" k={1} cam={cam} />
    <Live k={1} cam={cam}>
      {/* warm dawn wash over the night-blue homestead (plain alpha, no blend) */}
      <rect x={-200} y={1150} width={W + 400} height={H} fill="#c97a6a" opacity={0.3} />
      <Glow id="v11y" x={gx - 40} y={GROUND + 60} r={420} c="#ffd2a8" o={0.55} />
      <Gran x={gx} b={GROUND + 90} s={1.35} ph={t * 5.5} rim="#ffd0a8" />
    </Live>
    <BandImg id="village/fg" k={1.2} cam={cam} />
  </AbsoluteFill>;
};

/** shot 12 — a city apartment block at night, one window lit with a low bed inside; slow push-in. */
export const S12: React.FC = () => {
  const { p, t } = useShot();
  const tf = wordAt(12, /footsteps/, 0.85);
  const wx = 610, wy = 1270;
  const z = 1.15 + 0.85 * EIO(p);
  const cam: Cam = { zoom: z, dx: 0, dy: 0, ox: wx + 50 - 108, oy: wy + 55 - 192 };
  const sh = ramp(t, tf - 0.3, tf + 0.9);
  return <AbsoluteFill style={{ backgroundColor: '#05080f' }}>
    <BandImg id="village/city" k={1} cam={cam} />
    <Live k={1} cam={cam}>
      <defs>
        <linearGradient id="v12w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffd28a" /><stop offset="1" stopColor="#c98a4a" /></linearGradient>
      </defs>
      <Glow id="v12g" x={wx + 50} y={wy + 55} r={210} c="#ffcf86" o={0.35} />
      <rect x={wx} y={wy} width={100} height={110} fill="url(#v12w)" />
      {/* low bed on the floor */}
      <rect x={wx + 8} y={wy + 82} width={84} height={14} rx={3} fill="#5b4a6a" />
      <rect x={wx + 8} y={wy + 94} width={84} height={6} fill="#2a2030" />
      <ellipse cx={wx + 20} cy={wy + 82} rx={10} ry={5} fill="#e9e1d6" />
      {/* a tiny shadow at the bed's foot, on "footsteps" */}
      <ellipse cx={wx + 92 - 18 * sh} cy={wy + 102} rx={6} ry={3.5} fill="#1a1010" opacity={0.85 * sh} />
      <path d={`M${wx + 88 - 18 * sh} ${wy + 102} q2 -10 4 -12 q2 2 4 12 Z`} fill="#1a1010" opacity={0.85 * sh} />
      {/* frame + curtain */}
      <rect x={wx + 48} y={wy} width={4} height={110} fill="#1a1410" />
      <path d={`M${wx} ${wy} L${wx + 22} ${wy} Q${wx + 16} ${wy + 60} ${wx + 26} ${wy + 110} L${wx} ${wy + 110} Z`} fill="#6a4a3a" opacity={0.9} />
    </Live>
    <Live k={1.35} cam={cam}>
      <path d="M-200 300 L190 300 L190 2600 L-200 2600 Z" fill="#04060a" />
      <path d="M190 300 L190 2600" stroke="#2c3b55" strokeWidth={3} />
      <path d="M190 760 Q700 860 1500 700" stroke="#04060a" strokeWidth={4} fill="none" />
    </Live>
  </AbsoluteFill>;
};
