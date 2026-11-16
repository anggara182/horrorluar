import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, CAM0, ramp, EIO, clamp01 } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { RM } from '../sets/room';

const BG = '#0b0806';
const CX = RM.candle.x, CY = RM.candle.y;

/** Flame + glow. sway: lateral lean (world units), s: scale (0 = out). */
const Flame: React.FC<{ t: number; sway?: number; s?: number; big?: boolean }> = ({ t, sway = 0, s = 1, big = false }) => {
  if (s <= 0.01) return null;
  const wx = CX, wy = CY - 64; // wick top
  const h = 30 * s * (1 + 0.06 * Math.sin(t * 17) + 0.04 * Math.sin(t * 29));
  const w = 7 * s;
  const lean = sway + 1.2 * Math.sin(t * 11);
  const flicker = 0.85 + 0.15 * Math.sin(t * 23) * Math.sin(t * 7);
  return (
    <g>
      <defs>
        <radialGradient id="rFlameGlow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffd27a" stopOpacity="0.7" /><stop offset="0.3" stopColor="#ffbf66" stopOpacity="0.22" /><stop offset="1" stopColor="#ffbf66" stopOpacity="0" /></radialGradient>
        <linearGradient id="rFlame" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#ff9a3c" /><stop offset="0.35" stopColor="#ffd27a" /><stop offset="1" stopColor="#fff4d8" /></linearGradient>
      </defs>
      <ellipse cx={wx + lean * 0.4} cy={wy - h * 0.4} rx={(big ? 110 : 200) * s} ry={(big ? 110 : 200) * s} fill="url(#rFlameGlow)" opacity={flicker} />
      <path d={`M ${wx} ${wy + 2} C ${wx - w * 1.3} ${wy - h * 0.2}, ${wx - w * 0.8 + lean * 0.5} ${wy - h * 0.7}, ${wx + lean} ${wy - h} C ${wx + w * 0.8 + lean * 0.5} ${wy - h * 0.7}, ${wx + w * 1.3} ${wy - h * 0.2}, ${wx} ${wy + 2} Z`} fill="url(#rFlame)" />
      <ellipse cx={wx} cy={wy - h * 0.12} rx={w * 0.45} ry={h * 0.16} fill="#4a6aa8" opacity={0.6} />
    </g>
  );
};

/** Candle on a tray of water. ripple: 0..1 phase sets (array of ages 0..1). lit: warm light on wax/water. */
const Candle: React.FC<{ t: number; ripples?: number[]; lit?: number; sway?: number; s?: number; big?: boolean }> = ({ t, ripples = [], lit = 1, sway = 0, s = 1, big }) => (
  <g>
    <defs>
      <linearGradient id="rWax" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#8a7a5c" /><stop offset="0.45" stopColor="#efe2bf" /><stop offset="1" stopColor="#6b5c44" /></linearGradient>
      <radialGradient id="rWater" cx="0.5" cy="0.4" r="0.6"><stop offset="0" stopColor="#3a2a18" /><stop offset="1" stopColor="#0d0906" /></radialGradient>
    </defs>
    {/* tray: brass rim + water */}
    <ellipse cx={CX} cy={CY + 6} rx={92} ry={22} fill="#1a120a" />
    <ellipse cx={CX} cy={CY} rx={90} ry={20} fill="#5a4322" />
    <ellipse cx={CX} cy={CY + 1} rx={82} ry={16} fill="url(#rWater)" />
    <ellipse cx={CX} cy={CY + 3} rx={93} ry={23} fill="#050403" opacity={0.7 * (1 - lit)} />
    {/* flame reflection in water */}
    <ellipse cx={CX + sway * 0.3} cy={CY + 6} rx={6 * s} ry={9 * s} fill="#ffd27a" opacity={0.55 * lit * s} />
    <ellipse cx={CX} cy={CY + 2} rx={40} ry={7} fill="#ffbf66" opacity={0.12 * lit} />
    {ripples.map((a, i) => a > 0 && a < 1 ? (
      <ellipse key={i} cx={CX} cy={CY + 1} rx={10 + 70 * a} ry={2.4 + 13 * a} fill="none" stroke="#ffd9a0" strokeWidth={1.4} opacity={(1 - a) * 0.7 * Math.max(0.25, lit)} />
    ) : null)}
    {/* candle */}
    <rect x={CX - 9} y={CY - 62} width={18} height={60} fill="url(#rWax)" />
    <ellipse cx={CX} cy={CY - 62} rx={9} ry={3} fill="#f6ead0" opacity={0.6 + 0.4 * lit} />
    <path d={`M ${CX + 4} ${CY - 62} q 3 8 1 16 q -2 4 1 6`} stroke="#f6ead0" strokeWidth={2.4} fill="none" opacity={0.7} />
    <rect x={CX - 9} y={CY - 62} width={18} height={60} fill="#000" opacity={0.75 * (1 - lit)} />
    {/* wick */}
    <path d={`M ${CX} ${CY - 62} q 1 -3 0 -5`} stroke="#140c06" strokeWidth={2} fill="none" />
    <Flame t={t} sway={sway} s={s} big={big} />
  </g>
);

/** Seated woman, side profile facing the candle (right). Silhouette with warm rim on her front edge. */
const Woman: React.FC<{ rim?: number; breathe?: number }> = ({ rim = 1, breathe = 0 }) => {
  const x = RM.woman.x, f = RM.floor;
  const by = breathe * 2;
  return (
    <g>
      {/* body: hair bun, head, neck, hunched back, knees folded forward */}
      <path
        d={`M ${x - 10} ${f - 330 + by}
          C ${x - 70} ${f - 330}, ${x - 95} ${f - 260}, ${x - 90} ${f - 180}
          C ${x - 88} ${f - 110}, ${x - 110} ${f - 40}, ${x - 120} ${f}
          L ${x + 175} ${f}
          C ${x + 185} ${f - 20}, ${x + 170} ${f - 52}, ${x + 140} ${f - 58}
          L ${x + 60} ${f - 66}
          C ${x + 52} ${f - 110}, ${x + 40} ${f - 160}, ${x + 38} ${f - 210}
          C ${x + 36} ${f - 240}, ${x + 30} ${f - 262}, ${x + 22} ${f - 275 + by}
          L ${x + 24} ${f - 300 + by}
          C ${x + 40} ${f - 312}, ${x + 46} ${f - 340}, ${x + 40} ${f - 362}
          C ${x + 32} ${f - 410}, ${x - 30} ${f - 420}, ${x - 46} ${f - 380}
          C ${x - 56} ${f - 355}, ${x - 40} ${f - 330}, ${x - 10} ${f - 330 + by} Z`}
        fill="#070504"
      />
      {/* hair bun + loose strands down the back */}
      <ellipse cx={x - 52} cy={f - 372} rx={30} ry={26} fill="#070504" />
      <path d={`M ${x - 60} ${f - 360} C ${x - 100} ${f - 300}, ${x - 96} ${f - 220}, ${x - 112} ${f - 150}`} stroke="#070504" strokeWidth={8} fill="none" />
      {/* hands resting in lap */}
      <path d={`M ${x + 40} ${f - 140} C ${x + 70} ${f - 110}, ${x + 100} ${f - 90}, ${x + 120} ${f - 82} L ${x + 112} ${f - 70} C ${x + 80} ${f - 80}, ${x + 50} ${f - 100}, ${x + 30} ${f - 120} Z`} fill="#070504" />
      {/* warm rim on profile (face, chest, knees) */}
      <g opacity={rim} stroke="#ffbf66" fill="none" strokeLinecap="round">
        <path d={`M ${x + 30} ${f - 395} C ${x + 44} ${f - 370}, ${x + 46} ${f - 335}, ${x + 32} ${f - 310}`} strokeWidth={3.5} opacity={0.9} />
        <path d={`M ${x + 26} ${f - 270} C ${x + 36} ${f - 240}, ${x + 40} ${f - 190}, ${x + 46} ${f - 150}`} strokeWidth={2.5} opacity={0.6} />
        <path d={`M ${x + 118} ${f - 84} C ${x + 150} ${f - 60}, ${x + 172} ${f - 50}, ${x + 178} ${f - 20}`} strokeWidth={2.5} opacity={0.7} />
      </g>
    </g>
  );
};

/** shot 8 — through the window: woman sitting still before the candle. Very slow push. */
export const S08: React.FC = () => {
  const { p, t, sec } = useShot();
  const z = 1.3 + 0.16 * ramp(p, 0, 1, EIO);
  const cam: Cam = { zoom: z, dx: 0, dy: 0, ox: 690, oy: 1060 };
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="room/inside" k={0.9} cam={cam} />
      <Live k={0.9} cam={cam}>
        <Woman breathe={0} />
        <Candle t={t} />
      </Live>
      <BandImg id="room/wall" k={1.0} cam={cam} />
    </AbsoluteFill>
  );
};

/** shot 9 — close on the candle: knock on the wall, ripples, then the flame shakes wildly. */
export const S09: React.FC = () => {
  const { p, t, sec } = useShot();
  const knock = (wordAt(9, /knock/, 0.25) / sec);
  const shook = (wordAt(9, /shook/, 0.75) / sec);
  // ripples: three knocks
  const ripples = [0, 0.06, 0.12].map((d) => (p - knock - d) / 0.35);
  const ripples2 = [0, 0.05].map((d) => (p - shook - d) / 0.3);
  const shake = ramp(p, knock, knock + 0.04) * (1 - ramp(p, knock + 0.12, knock + 0.25)) * 0.5 + ramp(p, shook - 0.08, shook);
  const sway = shake * (9 * Math.sin(t * 31) + 6 * Math.sin(t * 13));
  const lit = 0.85 + 0.15 * shake * Math.sin(t * 40);
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="room/close" cam={CAM0} />
      <Live cam={CAM0} viewBox={RM.close}>
        <Candle t={t} ripples={[...ripples, ...ripples2]} sway={sway} lit={lit} s={1 - 0.15 * shake * Math.abs(Math.sin(t * 19))} big />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 11 — the candle is blown out: flame bends and dies, smoke curls from the wick. Dark. */
export const S11: React.FC = () => {
  const { p, t, sec } = useShot();
  const blew = (wordAt(11, /blew/, 0.25) / sec);
  const late = (wordAt(11, /late/, 0.8) / sec);
  const out = ramp(p, blew, blew + 0.08);
  const s = 1 - out;
  const sway = 14 * ramp(p, blew - 0.04, blew + 0.06);
  const lit = Math.max(0, 1 - out * 1.2);
  const ember = out > 0 ? clamp01(1 - (p - blew - 0.08) / 0.35) : 0;
  const sm = clamp01((p - blew - 0.04) / 0.6);
  const wx = CX, wy = CY - 67;
  const smoke = [0, 1, 2].map((i) => {
    const ph = t * 1.4 + i * 1.7;
    const len = 20 + 120 * sm;
    const a = 6 + 10 * sm;
    const d = `M ${wx} ${wy} C ${wx + a * Math.sin(ph)} ${wy - len * 0.25}, ${wx - a * 1.6 * Math.sin(ph + 1)} ${wy - len * 0.45}, ${wx + a * Math.sin(ph * 0.8 + i)} ${wy - len * 0.65} S ${wx - a * 1.4 * Math.sin(ph * 0.6 + i)} ${wy - len * 0.85}, ${wx + a * 0.9 * Math.sin(ph * 0.5 + i * 2)} ${wy - len}`;
    return <path key={i} d={d} stroke="#9aa3ad" strokeWidth={1.6 + i * 1.6} fill="none" strokeLinecap="round" opacity={sm > 0 ? (0.34 - i * 0.09) * (1 - 0.4 * ramp(p, 0.85, 1)) : 0} />;
  });
  const eyes = ramp(p, late - 0.02, late + 0.08);
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="room/close" cam={CAM0} />
      <Live cam={CAM0} viewBox={RM.close}>
        {/* darkness falls as the flame dies; faint cool moonlight from the window */}
        <rect x={600} y={1000} width={400} height={560} fill="#030304" opacity={0.85 * out} />
        <defs><radialGradient id="rMoon" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#7d8aa3" stopOpacity="0.22" /><stop offset="1" stopColor="#7d8aa3" stopOpacity="0" /></radialGradient></defs>
        <ellipse cx={CX + 60} cy={CY - 120} rx={200} ry={260} fill="url(#rMoon)" opacity={out} />
        <Candle t={t} sway={sway} s={s} lit={lit} big ripples={[(p - blew) / 0.4]} />
        {/* cool rim on wax after dark */}
        <rect x={CX + 6} y={CY - 62} width={3} height={58} fill="#9fb0c8" opacity={0.45 * out} />
        {/* glowing wick ember */}
        <circle cx={wx} cy={wy} r={2.2} fill="#ff7a2a" opacity={ember} />
        <circle cx={wx} cy={wy} r={7} fill="#ff7a2a" opacity={ember * 0.25} />
        {smoke}
        {/* too late: two small glints appear in the black water */}
        <g opacity={eyes * 0.8}>
          <ellipse cx={CX - 30} cy={CY + 4} rx={2.6} ry={1.3} fill="#e9d6a8" />
          <ellipse cx={CX - 16} cy={CY + 4} rx={2.6} ry={1.3} fill="#e9d6a8" />
        </g>
      </Live>
    </AbsoluteFill>
  );
};
