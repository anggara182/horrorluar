import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H, rng } from '../art/world';

/** camp world layout */
export const KH = 1150; // horizon (world y)
export const FIRE = { x: 600, y: 1520 };

const stars = (seed: number, n: number, ymax: number, op = 1) => {
  const r = rng(seed);
  return Array.from({ length: n }, (_, i) => {
    const x = r() * W, y = r() * ymax, s = r();
    return <circle key={i} cx={x} cy={y} r={s > 0.96 ? 3.2 : s > 0.8 ? 2 : 1.2} fill="#e8ecff" opacity={(0.35 + r() * 0.6) * op} />;
  });
};

const Ute: React.FC<{ x: number; y: number; body: string; shade: string; rim: string }> = ({ x, y, body, shade, rim }) => (
  <g transform={`translate(${x},${y})`}>
    {/* tray (rear, left toward fire) + cab (right) */}
    <path d="M -300 -60 L -300 -170 L -40 -170 L -40 -60 Z" fill={shade} />
    <path d="M -300 -170 L -40 -170 L -40 -150 L -300 -150 Z" fill={body} />
    <path d="M -40 -60 L -40 -250 Q -36 -280 0 -282 L 120 -282 Q 150 -280 172 -200 L 250 -186 Q 290 -178 292 -130 L 292 -60 Z" fill={body} />
    <path d="M -20 -200 L -20 -262 L 100 -262 L 140 -200 Z" fill="#1a1d27" />
    <path d="M -40 -110 L 292 -110 L 292 -60 L -40 -60 Z" fill={shade} />
    <circle cx={-200} cy={-56} r={56} fill="#0c0a0b" /><circle cx={-200} cy={-56} r={22} fill="#3a3436" />
    <circle cx={190} cy={-56} r={56} fill="#0c0a0b" /><circle cx={190} cy={-56} r={22} fill="#3a3436" />
    <path d="M -302 -168 L -302 -62" stroke={rim} strokeWidth={6} opacity={0.8} />
    <path d="M -40 -250 Q -36 -280 0 -282" stroke={rim} strokeWidth={5} fill="none" opacity={0.7} />
    <ellipse cx={0} cy={0} rx={340} ry={18} fill="#000" opacity={0.35} />
  </g>
);

const Swag: React.FC<{ x: number; y: number; c: string; rim: string; rot?: number }> = ({ x, y, c, rim, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot})`}>
    <path d="M -150 0 Q -160 -46 -120 -52 L 120 -44 Q 160 -40 150 0 Z" fill={c} />
    <path d="M 70 -46 Q 110 -70 140 -44 L 130 -30 Z" fill="#2a2228" />
    <path d="M -120 -52 L 120 -44" stroke={rim} strokeWidth={4} opacity={0.7} />
  </g>
);

const spin = (x: number, y: number, s: number, fill: string, key?: React.Key) => (
  <path key={key} transform={`translate(${x},${y}) scale(${s})`} fill={fill}
    d="M -70 0 Q -80 -40 -110 -70 Q -60 -50 -40 -20 Q -40 -80 -20 -110 Q -10 -60 0 -30 Q 20 -100 50 -120 Q 30 -60 30 -24 Q 60 -70 100 -80 Q 70 -40 70 0 Z" />
);

const DeadTree: React.FC<{ x: number; y: number; s: number; fill: string }> = ({ x, y, s, fill }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} fill="none" stroke={fill} strokeLinecap="round">
    <path d="M 0 0 Q -6 -120 10 -220 Q 30 -300 80 -360" strokeWidth={22} />
    <path d="M 6 -180 Q -50 -240 -90 -330" strokeWidth={13} />
    <path d="M 40 -300 Q 30 -360 50 -420" strokeWidth={9} />
    <path d="M -60 -280 Q -110 -300 -140 -290" strokeWidth={7} />
  </g>
);

const ground = (night: boolean) => {
  const rim = night ? '#ff9b4a' : '#ffb36a';
  return (
    <g>
      <rect x={0} y={KH} width={W} height={H - KH} fill={night ? 'url(#kGround)' : 'url(#kGroundDawn)'} />
      {/* distant ridge line */}
      <path d={`M 0 ${KH} L 0 ${KH - 18} Q 200 ${KH - 30} 380 ${KH - 14} Q 620 ${KH - 40} 820 ${KH - 16} Q 1050 ${KH - 30} ${W} ${KH - 10} L ${W} ${KH} Z`} fill={night ? '#140f17' : '#5a3036'} />
      <DeadTree x={180} y={KH + 30} s={0.9} fill={night ? '#120d10' : '#2a1716'} />
      {/* dirt road track off to the right */}
      <path d={`M 1296 ${KH + 120} Q 1100 ${KH + 200} 1000 ${KH + 400} L 1060 ${KH + 400} Q 1150 ${KH + 230} 1296 ${KH + 160} Z`} fill={night ? '#241a20' : '#a8573a'} opacity={0.7} />
      {[[80, KH + 90, 0.6], [420, KH + 60, 0.45], [760, KH + 80, 0.5], [1180, KH + 70, 0.5], [60, 1700, 1.1], [1150, 1760, 1.0]].map(([x, y, s], i) => spin(x, y, s, night ? '#150f13' : '#3b2220', i))}
      <Ute x={980} y={1500} body={night ? '#5d544c' : '#c9c2b2'} shade={night ? '#2c2624' : '#8a7d70'} rim={rim} />
      <Swag x={300} y={1600} c={night ? '#3a3036' : '#6b5a52'} rim={rim} rot={-4} />
      <Swag x={360} y={1700} c={night ? '#2f2a3a' : '#5c4f5a'} rim={rim} rot={3} />
      {/* billy can */}
      <g transform={`translate(${FIRE.x + 150},${FIRE.y + 30})`}><rect x={-18} y={-44} width={36} height={44} fill="#2a2428" /><path d="M -18 -44 Q 0 -74 18 -44" stroke="#2a2428" strokeWidth={4} fill="none" /><rect x={-19} y={-44} width={5} height={44} fill={rim} opacity={0.7} /></g>
    </g>
  );
};

/** Set "camp" (campsite: campfire, ute, swags, dad and son, close-ups, dawn). Static bands baked ONCE to public/baked/camp/<band>.png. Ids "camp/<band>". */
export const CAMP: Record<string, BandSpec> = {
  'camp/night': {
    node: () => (
      <g>
        <defs>
          <linearGradient id="kSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#05070f" /><stop offset="0.6" stopColor="#0b1020" /><stop offset="1" stopColor="#1c1a30" /></linearGradient>
          <linearGradient id="kGround" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a1f28" /><stop offset="0.3" stopColor="#3a2a2e" /><stop offset="1" stopColor="#120c0f" /></linearGradient>
          <radialGradient id="kMilky" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#b4b8e8" stopOpacity="0.42" /><stop offset="0.5" stopColor="#8a8fc8" stopOpacity="0.18" /><stop offset="1" stopColor="#8a8fc8" stopOpacity="0" /></radialGradient>
        </defs>
        <rect x={0} y={0} width={W} height={KH + 10} fill="url(#kSky)" />
        <ellipse cx={650} cy={560} rx={900} ry={200} transform="rotate(-32 650 560)" fill="url(#kMilky)" />
        <ellipse cx={720} cy={520} rx={520} ry={70} transform="rotate(-32 720 520)" fill="url(#kMilky)" />
        {stars(7, 320, KH - 30)}
        {ground(true)}
      </g>
    ),
  },
  'camp/fg': {
    blur: 3,
    node: () => (
      <g>
        {[[40, 2180, 2.4], [260, 2240, 1.8], [1100, 2200, 2.6], [1290, 2120, 1.8]].map(([x, y, s], i) => spin(x, y, s, '#07050a', i))}
        <rect x={0} y={2180} width={W} height={130} fill="#07050a" />
      </g>
    ),
  },
  'camp/dawn': {
    node: () => (
      <g>
        <defs>
          <linearGradient id="kSkyDawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1e2550" /><stop offset="0.45" stopColor="#6a4a78" /><stop offset="0.8" stopColor="#e0785a" /><stop offset="1" stopColor="#ffc078" /></linearGradient>
          <linearGradient id="kGroundDawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b0603e" /><stop offset="0.35" stopColor="#7a3a22" /><stop offset="1" stopColor="#2a1618" /></linearGradient>
          <radialGradient id="kSun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fff2c8" stopOpacity="1" /><stop offset="0.15" stopColor="#ffd08a" stopOpacity="0.8" /><stop offset="1" stopColor="#ff9b4a" stopOpacity="0" /></radialGradient>
        </defs>
        <rect x={0} y={0} width={W} height={KH + 10} fill="url(#kSkyDawn)" />
        {stars(11, 80, 500, 0.5)}
        <circle cx={760} cy={KH - 10} r={420} fill="url(#kSun)" />
        <circle cx={760} cy={KH - 4} r={54} fill="#fff4d6" />
        {ground(false)}
      </g>
    ),
  },
  'camp/house': {
    node: () => (
      <g>
        <defs>
          <linearGradient id="kWin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#05070f" /><stop offset="0.7" stopColor="#0f1428" /><stop offset="1" stopColor="#1a1830" /></linearGradient>
          <radialGradient id="kRoom" cx="0.5" cy="0.4" r="0.7"><stop offset="0" stopColor="#1a1c2a" /><stop offset="1" stopColor="#07070c" /></radialGradient>
        </defs>
        {/* night plain through the window */}
        <rect x={300} y={500} width={700} height={1000} fill="url(#kWin)" />
        <g clipPath="url(#kWinClip)">{stars(21, 90, 1040, 0.9)}</g>
        <clipPath id="kWinClip"><rect x={300} y={500} width={700} height={540} /></clipPath>
        <rect x={300} y={1040} width={700} height={460} fill="#120d14" />
        <path d="M 300 1040 Q 500 1030 700 1042 Q 850 1034 1000 1040 L 1000 1050 L 300 1050 Z" fill="#1c1520" />
        {/* room wall with window opening */}
        <path d={`M 0 0 L ${W} 0 L ${W} ${H} L 0 ${H} Z M 300 500 L 300 1500 L 1000 1500 L 1000 500 Z`} fill="url(#kRoom)" fillRule="evenodd" />
        {/* frame + mullions */}
        <rect x={280} y={480} width={740} height={20} fill="#2a2a38" /><rect x={280} y={1500} width={740} height={40} fill="#2a2a38" />
        <rect x={280} y={480} width={20} height={1040} fill="#22222e" /><rect x={1000} y={480} width={20} height={1040} fill="#22222e" />
        <rect x={640} y={500} width={18} height={1000} fill="#22222e" /><rect x={300} y={1000} width={700} height={14} fill="#22222e" />
        <path d="M 302 500 L 302 1500 M 1018 500 L 1018 1500" stroke="#7fe3ff" strokeWidth={3} opacity={0.25} />
        {/* curtain edges */}
        <path d="M 160 440 Q 230 1000 190 1640 L 0 1640 L 0 440 Z" fill="#0c0b12" />
        <path d="M 1140 440 Q 1070 1000 1110 1640 L 1296 1640 L 1296 440 Z" fill="#0c0b12" />
      </g>
    ),
  },
};
