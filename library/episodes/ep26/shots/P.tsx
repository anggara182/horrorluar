import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, ramp, EIO } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { HZ, FAR, NEAR, ROAD_Y } from '../sets/fields';

const BG = '#e9ecd8';
const fx = (x: number) => x - 108; // world -> frame
const fy = (y: number) => y - 192;

/** The kunekune: a thin white figure, twisting unnaturally. Feet at (x,y), height h. No face, ever. */
const Kunekune: React.FC<{ x: number; y: number; h: number; t: number; speed?: number; amp?: number; glow?: number }> = ({ x, y, h, t, speed = 1, amp = 1, glow = 1 }) => {
  const ph = t * 3.1 * speed;
  const n = 14;
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const s = i / n;
    const off = (Math.sin(ph + s * 5.2) * 0.13 + Math.sin(ph * 1.7 - s * 9) * 0.05) * h * amp * (0.25 + s);
    pts.push(`${(x + off).toFixed(1)},${(y - s * h).toFixed(1)}`);
  }
  const top = pts[n].split(',').map(Number);
  const sh = pts[Math.round(n * 0.76)].split(',').map(Number);
  const arm = (dir: number, k: number) => {
    const a1 = Math.sin(ph * 1.3 + k) * 0.5 * amp, a2 = Math.sin(ph * 2.1 + k * 2) * 0.9 * amp;
    const l = h * 0.32;
    const ex = sh[0] + dir * Math.cos(a1) * l * 0.55, ey = sh[1] - Math.sin(a1 + 0.6) * l * 0.55;
    const hx = ex + dir * Math.cos(a2) * l * 0.5, hy = ey - Math.sin(a2 + 0.3) * l * 0.5;
    return `M${sh[0]} ${sh[1]} Q${ex} ${ey} ${hx} ${hy}`;
  };
  const sw = Math.max(1.6, h * 0.075);
  return (
    <g>
      <defs>
        <radialGradient id="kkGlow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fbfbe9" stopOpacity={0.55 * glow} /><stop offset="1" stopColor="#fbfbe9" stopOpacity="0" /></radialGradient>
      </defs>
      <ellipse cx={x} cy={y - h * 0.5} rx={h * 0.9} ry={h * 0.95} fill="url(#kkGlow)" />
      <ellipse cx={x} cy={y} rx={h * 0.22} ry={h * 0.04} fill="#1c3313" opacity={0.5} />
      <polyline points={pts.join(' ')} fill="none" stroke="#f5f5ef" strokeWidth={sw * 1.25} strokeLinecap="round" strokeLinejoin="round" />
      <path d={arm(-1, 0)} stroke="#f5f5ef" strokeWidth={sw * 0.8} fill="none" strokeLinecap="round" />
      <path d={arm(1, 2.3)} stroke="#f5f5ef" strokeWidth={sw * 0.8} fill="none" strokeLinecap="round" />
      <ellipse cx={top[0]} cy={top[1] + sw * 0.2} rx={sw * 1.05} ry={sw * 1.3} fill="#f5f5ef" />
    </g>
  );
};

/** heat haze: pale shimmering strips over the horizon (opacity/offset only) */
const Haze: React.FC<{ t: number; o?: number }> = ({ t, o = 1 }) => (
  <g opacity={o}>
    <defs>
      <linearGradient id="hzG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f6f3e2" stopOpacity="0" /><stop offset="0.5" stopColor="#f6f3e2" stopOpacity="0.55" /><stop offset="1" stopColor="#f6f3e2" stopOpacity="0" /></linearGradient>
    </defs>
    <rect x={0} y={HZ - 90} width={1296} height={170} fill="url(#hzG)" />
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={-40 + Math.sin(t * 1.4 + i * 1.7) * 30} y={HZ - 30 + i * 18 + Math.sin(t * 2 + i) * 4} width={1380} height={3} fill="#ffffff" opacity={0.18 + 0.1 * Math.sin(t * 2.6 + i * 2)} />
    ))}
  </g>
);

const Fields: React.FC<{ cam: Cam; t: number; children?: React.ReactNode; fg?: boolean; haze?: number }> = ({ cam, t, children, fg = true, haze = 1 }) => (
  <AbsoluteFill style={{ backgroundColor: BG }}>
    <BandImg id="fields/sky" k={0.6} cam={cam} />
    <BandImg id="fields/paddies" k={1} cam={cam} />
    <Live k={1} cam={cam}><Haze t={t} o={haze} /></Live>
    {children}
    {fg && <BandImg id="fields/fg" k={1.3} cam={cam} />}
  </AbsoluteFill>
);

/** shot 1 — endless paddies under a hot pale sky, a tiny white twisting shape far away. Slow push-in. */
export const S01: React.FC = () => {
  const { p, t, sec } = useShot();
  const tw = wordAt(1, /white/i, 0.35) / sec;
  const z = 1 + 0.22 * ramp(p, 0, 1, EIO);
  const cam: Cam = { zoom: z, dx: 0, dy: 0, ox: fx(FAR.x), oy: fy(FAR.y) };
  return (
    <Fields cam={cam} t={t}>
      <Live k={1} cam={cam}><Kunekune x={FAR.x} y={FAR.y} h={52} t={t} amp={0.5 + 0.6 * ramp(p, tw - 0.05, tw + 0.1)} /></Live>
    </Fields>
  );
};

/** shot 5 — telephoto on the far field: the thin white figure bending and twisting. Very slow push. */
export const S05: React.FC = () => {
  const { p, t, sec } = useShot();
  const tt = wordAt(5, /Twisting/i, 0.63) / sec;
  const z = 1.9 + 0.25 * ramp(p, 0, 1, EIO);
  const cam: Cam = { zoom: z, dx: 0, dy: -60, ox: fx(FAR.x), oy: fy(FAR.y) };
  const amp = 0.55 + 0.6 * ramp(p, tt - 0.04, tt + 0.08);
  return (
    <Fields cam={cam} t={t} fg={false} haze={0.8}>
      <Live k={1} cam={cam}><Kunekune x={FAR.x} y={FAR.y} h={42} t={t} speed={0.8 + 0.5 * amp} amp={amp} /></Live>
    </Fields>
  );
};

/** shot 6 — close, perfectly still rice; the white shape still twisting far behind. Locked. */
export const S06: React.FC = () => {
  const { t } = useShot();
  const cam: Cam = { zoom: 1.55, dx: 0, dy: 0, ox: fx(FAR.x), oy: fy(FAR.y) };
  const still: Cam = { zoom: 1, dx: 0, dy: 0 };
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="fields/sky" k={1} cam={cam} />
      <BandImg id="fields/paddies" k={1} cam={cam} />
      <Live k={1} cam={cam}><Haze t={t} o={0.7} /><Kunekune x={FAR.x} y={FAR.y} h={42} t={t} amp={1.1} speed={1.2} /></Live>
      <BandImg id="fields/close" k={1} cam={still} />
    </AbsoluteFill>
  );
};

/** dusk grade drawn as gradient shapes (no filters) */
const Dusk: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="dkG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#5a2f55" stopOpacity="0.75" />
        <stop offset="0.3" stopColor="#d9714a" stopOpacity="0.6" />
        <stop offset="0.39" stopColor="#ffb46a" stopOpacity="0.55" />
        <stop offset="0.42" stopColor="#3a2232" stopOpacity="0.55" />
        <stop offset="1" stopColor="#140c16" stopOpacity="0.85" />
      </linearGradient>
      <radialGradient id="dkSun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffe2a6" stopOpacity="0.95" /><stop offset="0.2" stopColor="#ffb46a" stopOpacity="0.6" /><stop offset="1" stopColor="#ff9a5a" stopOpacity="0" /></radialGradient>
    </defs>
    <rect x={-200} y={-200} width={1700} height={2700} fill="url(#dkG)" />
    <ellipse cx={360} cy={HZ - 70} rx={420} ry={300} fill="url(#dkSun)" />
  </g>
);

/** tiny car on the far road, driving toward the mountains (right) */
const Car: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-14 0 L-14 -6 L-8 -6 L-5 -11 L6 -11 L9 -6 L14 -6 L14 0 Z" fill="#120a12" />
    <circle cx={-14} cy={-3} r={2} fill="#ff4a3a" />
    <ellipse cx={-14} cy={-3} rx={7} ry={4} fill="#ff4a3a" opacity={0.25} />
  </g>
);

/** shot 11 — orange dusk over the paddies, a small car on the far road toward the mountains. Slow pull-back. */
export const S11: React.FC = () => {
  const { p, t } = useShot();
  const z = 1.45 - 0.4 * ramp(p, 0, 1, EIO);
  const cx = 520 + 420 * ramp(p, 0, 1, (n) => n);
  const cam: Cam = { zoom: z, dx: 0, dy: 0, ox: fx(700), oy: fy(ROAD_Y) };
  return (
    <Fields cam={cam} t={t} fg={false} haze={0}>
      <Live k={1} cam={cam}><Dusk /><Car x={cx} y={ROAD_Y + 2} s={1.6} /></Live>
      <BandImg id="fields/fg" k={1.3} cam={cam} style={{ opacity: 0.95 }} />
      <Live k={1.3} cam={cam}><defs><linearGradient id="dkFg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#140c16" stopOpacity="0" /><stop offset="1" stopColor="#140c16" stopOpacity="0.7" /></linearGradient></defs><rect x={-400} y={1500} width={2100} height={1300} fill="url(#dkFg)" /></Live>
    </Fields>
  );
};

/** shot 12 — the paddies in heat haze again; the white figure noticeably nearer, and creeping closer. Slow push-in. */
export const S12: React.FC = () => {
  const { p, t, sec } = useShot();
  const tc = wordAt(12, /closer/i, 0.88) / sec;
  const tw = wordAt(12, /white/i, 0.65) / sec;
  const step = ramp(p, tc - 0.06, tc + 0.04);
  const y = NEAR.y + 40 * step, h = 120 + 30 * step;
  const z = 1.05 + 0.2 * ramp(p, 0, 1, EIO);
  const cam: Cam = { zoom: z, dx: 0, dy: 0, ox: fx(NEAR.x), oy: fy(NEAR.y - 60) };
  const appear = ramp(p, tw - 0.12, tw - 0.02);
  return (
    <Fields cam={cam} t={t}>
      <Live k={1} cam={cam}><g opacity={0.55 + 0.45 * appear}><Kunekune x={NEAR.x} y={y} h={h} t={t} amp={0.9} speed={0.9} /></g></Live>
    </Fields>
  );
};
