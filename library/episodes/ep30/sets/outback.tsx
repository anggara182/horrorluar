import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H, rng } from '../art/world';

/** outback layout (world space) */
export const OB = {
  horizon: 1230, // frame y ~1038
  tree: { x: 905, y: 1395 }, // dead gum base
};

export const clump = (x: number, y: number, s: number, fill: string, key: string | number, rim?: string) => {
  // spinifex: low dome + many thin spiky blades fanning up
  const blades: string[] = [];
  const n = 15;
  for (let i = 0; i < n; i++) {
    const f = (i + 0.5) / n;
    const a = -Math.PI * (0.9 - 0.8 * f);
    const bx = x + (f - 0.5) * s * 1.3;
    const len = (0.55 + 0.45 * Math.abs(Math.sin(i * 2.7 + x))) * s;
    const tx = bx + Math.cos(a) * len * 0.9, ty = y - s * 0.15 + Math.sin(a) * len;
    blades.push(`M ${bx - s * 0.035} ${y - s * 0.1} L ${tx} ${ty} L ${bx + s * 0.035} ${y - s * 0.1} Z`);
  }
  return (
    <g key={key}>
      <path d={`M ${x - s * 0.8} ${y} Q ${x - s * 0.6} ${y - s * 0.42} ${x} ${y - s * 0.42} Q ${x + s * 0.6} ${y - s * 0.42} ${x + s * 0.8} ${y} Z`} fill={fill} />
      <path d={blades.join(' ')} fill={fill} />
      {rim && <path d={`M ${x - s * 0.62} ${y - s * 0.2} Q ${x} ${y - s * 0.55} ${x + s * 0.62} ${y - s * 0.2}`} stroke={rim} strokeWidth={Math.max(1, s * 0.025)} fill="none" opacity={0.3} />}
    </g>
  );
};

/** dead gum: tapered limbs (stroked paths) */
const DeadGum: React.FC<{ x: number; y: number; s?: number; fill: string }> = ({ x, y, s = 1, fill }) => {
  const L = (d: string, w: number, k: string) => <path key={k} d={d} stroke={fill} strokeWidth={w * s} strokeLinecap="round" strokeLinejoin="round" fill="none" />;
  const P = (pts: number[][]) => 'M ' + pts.map(([a, b]) => `${x + a * s} ${y + b * s}`).join(' L ');
  return (
    <g>
      <path d={`M ${x - 34 * s} ${y} Q ${x - 18 * s} ${y - 160 * s} ${x - 14 * s} ${y - 330 * s} L ${x + 16 * s} ${y - 330 * s} Q ${x + 22 * s} ${y - 160 * s} ${x + 40 * s} ${y} Z`} fill={fill} />
      {L(P([[0, -320], [-40, -420], [-120, -520], [-150, -620]]), 22, 'a')}
      {L(P([[-120, -520], [-210, -560], [-260, -540]]), 10, 'a2')}
      {L(P([[-150, -620], [-140, -700]]), 7, 'a3')}
      {L(P([[0, -320], [30, -450], [20, -560], [60, -680], [50, -760]]), 20, 'b')}
      {L(P([[20, -560], [-30, -640]]), 8, 'b2')}
      {L(P([[60, -680], [110, -730]]), 6, 'b3')}
      {L(P([[4, -360], [110, -430], [190, -470], [270, -450]]), 16, 'c')}
      {L(P([[190, -470], [230, -560], [215, -610]]), 8, 'c2')}
      {L(P([[270, -450], [320, -490]]), 5, 'c3')}
      {L(P([[-10, -220], [-90, -270], [-130, -330]]), 9, 'd')}
    </g>
  );
};

/** Set "outback" (outback at night: scrub, dead tree, starry sky, the floating light). Static bands baked ONCE to public/baked/outback/<band>.png. Ids "outback/<band>". */
export const OUTBACK: Record<string, BandSpec> = {
  /** sky: gradient, milky way, stars */
  'outback/sky': {
    node: () => {
      const r = rng(30);
      const stars = Array.from({ length: 420 }, (_, i) => {
        const x = r() * W, y = r() * (OB.horizon + 40);
        const big = r() < 0.06;
        return <circle key={i} cx={x} cy={y} r={big ? 2.6 + r() * 1.4 : 0.8 + r() * 1.2} fill={r() < 0.15 ? '#ffe9c8' : '#e6f0ff'} opacity={(0.35 + r() * 0.65) * (0.35 + 0.65 * (1 - y / OB.horizon))} />;
      });
      const r2 = rng(77);
      const mw = Array.from({ length: 260 }, (_, i) => {
        const t = r2();
        const cx = 1150 - t * 1100 + (r2() - 0.5) * 220, cy = 80 + t * 1000 + (r2() - 0.5) * 220;
        return <circle key={i} cx={cx} cy={cy} r={0.7 + r2() * 1.1} fill="#f2f4ff" opacity={0.4 + r2() * 0.5} />;
      });
      return (
        <g>
          <defs>
            <linearGradient id="obSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#060914" />
              <stop offset="0.35" stopColor="#0b1020" />
              <stop offset="0.5" stopColor="#141a33" />
              <stop offset="0.56" stopColor="#2a2440" />
              <stop offset="0.6" stopColor="#3a2a3a" />
            </linearGradient>
            <radialGradient id="obMw" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#9aa6d6" stopOpacity="0.32" />
              <stop offset="0.5" stopColor="#6e6aa8" stopOpacity="0.14" />
              <stop offset="1" stopColor="#3a3870" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="obHz" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#6a4058" stopOpacity="0.4" />
              <stop offset="1" stopColor="#6a4058" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="obMwCore" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#e9e4ff" stopOpacity="0.22" />
              <stop offset="1" stopColor="#e9e4ff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect x={0} y={0} width={W} height={H} fill="url(#obSky)" />
          <g transform="rotate(-42 650 600)">
            <ellipse cx={650} cy={600} rx={950} ry={230} fill="url(#obMw)" />
            <ellipse cx={600} cy={610} rx={560} ry={90} fill="url(#obMwCore)" />
            
          </g>
          <ellipse cx={W / 2} cy={OB.horizon} rx={W * 0.9} ry={220} fill="url(#obHz)" />
          {mw}
          {stars}
        </g>
      );
    },
  },
  /** land: distant range, red plain, scattered spinifex, the dead gum */
  'outback/land': {
    node: () => {
      const r = rng(12);
      const far = Array.from({ length: 30 }, (_, i) => {
        const y = OB.horizon + 24 + Math.pow(r(), 1.3) * 640;
        const s = 18 + (y - OB.horizon) * 0.2;
        const x = r() * W;
        if (Math.abs(x - OB.tree.x) < 120 && y > OB.tree.y - 40) return null;
        return clump(x, y, s, y > OB.horizon + 300 ? '#1c1216' : '#2a1a1e', i, '#c98a6a');
      });
      return (
        <g>
          <defs>
            <linearGradient id="obPlain" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#4a2e30" />
              <stop offset="0.12" stopColor="#3a2a2e" />
              <stop offset="0.5" stopColor="#2a1d22" />
              <stop offset="1" stopColor="#140e12" />
            </linearGradient>
          </defs>
          <path d={`M -20 ${OB.horizon + 4} L 60 ${OB.horizon - 18} L 210 ${OB.horizon - 26} L 260 ${OB.horizon - 8} L 520 ${OB.horizon - 4} L 980 ${OB.horizon - 10} L 1040 ${OB.horizon - 34} L 1190 ${OB.horizon - 38} L 1240 ${OB.horizon - 12} L 1320 ${OB.horizon - 6} L 1320 ${OB.horizon + 20} L -20 ${OB.horizon + 20} Z`} fill="#221a26" />
          <rect x={0} y={OB.horizon} width={W} height={H - OB.horizon} fill="url(#obPlain)" />
          <path d={`M 560 ${OB.horizon + 6} Q 520 ${OB.horizon + 300} 300 ${H} L 520 ${H} Q 600 ${OB.horizon + 300} 580 ${OB.horizon + 6} Z`} fill="#5a3529" opacity={0.28} />
          {far}
          <DeadGum x={OB.tree.x} y={OB.tree.y} s={1} fill="#1a1512" />
          <ellipse cx={OB.tree.x} cy={OB.tree.y} rx={90} ry={12} fill="#120d0f" opacity={0.7} />
        </g>
      );
    },
  },
  /** foreground spinifex clumps framing the bottom & sides (dark) */
  'outback/fg': {
    blur: 3,
    node: () => (
      <g>
        <rect x={0} y={2010} width={W} height={H - 2010} fill="#0c080a" />
        {clump(120, 2060, 260, '#07050a', 'a', '#7fe3ff')}
        {clump(420, 2120, 200, '#07050a', 'b')}
        {clump(1160, 2040, 300, '#07050a', 'c', '#7fe3ff')}
        {clump(820, 2150, 220, '#07050a', 'd')}
        {clump(20, 1880, 170, '#100b0d', 'e')}
        {clump(1290, 1860, 160, '#100b0d', 'f')}
      </g>
    ),
  },
};
