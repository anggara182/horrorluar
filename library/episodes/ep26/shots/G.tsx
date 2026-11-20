import React from 'react';
import { AbsoluteFill } from 'remotion';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { loadFont as loadOswald } from '@remotion/google-fonts/Oswald';
import { loadFont as loadJP } from '@remotion/google-fonts/NotoSerifJP';
import { useShot, ramp, EIO, EOUT, BandImg, Live, handheld, type Cam } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { GREEN } from '../comp/Overlays';
import { GHZ } from '../sets/graphic';
import { Kune, Binoculars } from '../art/graphic_kune';

const { fontFamily: cinzel } = loadCinzel('normal', { weights: ['700'], subsets: ['latin'] });
const { fontFamily: oswald } = loadOswald('normal', { weights: ['500', '700'], subsets: ['latin'] });
const { fontFamily: jp } = loadJP('normal', { weights: ['600'] });

const FULL: React.CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%' };
const KX = 860, KY = GHZ + 30; // kunekune spot in world space (frame ≈ 752, 988)

/** shot 2 — title card: hot pale field, tiny white twisting figure at the horizon, slow push toward it. */
export const S02: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const cam: Cam = { zoom: 1 + 0.12 * z, dx: 0, dy: 0, ox: KX - 108, oy: KY - 192 - 40 };
  const a = ramp(p, 0.03, 0.3, EOUT);
  const b = ramp(p, 0.18, 0.45, EOUT);
  const kw = wordAt(2, /^kunekune/i, 0.7);
  const hz = ramp(t, kw - 0.3, kw + 0.4);
  return (
    <AbsoluteFill style={{ backgroundColor: '#e9ecd8' }}>
      <BandImg id="graphic/sky" k={0.4} cam={cam} />
      <BandImg id="graphic/field" k={0.8} cam={cam} />
      <Live k={0.8} cam={cam}>
        {/* heat haze shimmer bands (cheap translucent strips) */}
        {[0, 1, 2].map((i) => (
          <rect key={i} x={0} y={GHZ - 60 + i * 34 + Math.sin(t * 2 + i) * 6} width={1296} height={10} fill="#f6f3df" opacity={0.18} />
        ))}
        <Kune x={KX} y={KY} h={74 + 6 * hz} t={t * (1 + hz * 0.8)} id="k2" />
      </Live>
      <BandImg id="graphic/fg" k={1.15} cam={cam} />
      <AbsoluteFill style={{ alignItems: 'center', top: 230 }}>
        <div style={{ fontFamily: cinzel, fontWeight: 700, fontSize: 138, lineHeight: 1, letterSpacing: '0.08em', marginRight: '-0.08em', color: '#1c2617', opacity: a, transform: `translateY(${(1 - a) * 18}px)`, whiteSpace: 'nowrap' }}>KUNEKUNE</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 26, opacity: b }}>
          <div style={{ width: 100 * b, height: 3, background: `linear-gradient(90deg, rgba(155,225,93,0), #4f8a2a)` }} />
          <div style={{ fontFamily: jp, fontWeight: 600, fontSize: 58, letterSpacing: '0.12em', color: '#2b3a22', whiteSpace: 'nowrap' }}>くねくね · Japan</div>
          <div style={{ width: 100 * b, height: 3, background: `linear-gradient(90deg, #4f8a2a, rgba(155,225,93,0))` }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Field reflection inside one lens (frame coords). grow = how close the figure has come. */
const LensView: React.FC<{ cx: number; cy: number; r: number; i: number; t: number; grow: number }> = ({ cx, cy, r, i, t, grow }) => (
  <g>
    <defs>
      <clipPath id={`l3-${i}`}><ellipse cx={cx} cy={cy} rx={r} ry={r * 0.95} /></clipPath>
      <linearGradient id={`l3s-${i}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#c9d6cf" />
        <stop offset="0.5" stopColor="#e9ecd8" />
        <stop offset="0.52" stopColor="#6f9a52" />
        <stop offset="1" stopColor="#2a4a1f" />
      </linearGradient>
    </defs>
    <g clipPath={`url(#l3-${i})`}>
      <rect x={cx - r} y={cy - r} width={2 * r} height={2 * r} fill={`url(#l3s-${i})`} opacity={0.9} />
      <path d={`M ${cx - r} ${cy - 4} Q ${cx - r * 0.3} ${cy - 22} ${cx} ${cy - 10} Q ${cx + r * 0.5} ${cy - 2} ${cx + r} ${cy - 14} L ${cx + r} ${cy + 2} L ${cx - r} ${cy + 2} Z`} fill="#7d93a3" />
      <Kune x={cx + (i ? -10 : 12)} y={cy + 10 + 14 * grow} h={22 + 46 * grow} t={t * (1 + grow)} glow={false} />
      {/* lens curvature darkening */}
      <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.95} fill="none" stroke="#050806" strokeWidth={r * 0.5} opacity={0.55} />
    </g>
  </g>
);

/** shot 3 — lore insert: old binoculars on the dark veranda, the bright field reflected in the lenses. */
export const S03: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const und = wordAt(3, /^understand/i, 0.6);
  const sm = wordAt(3, /^smiling/i, 0.9);
  const grow = ramp(t, und, sm + 0.3);
  const s = 1.4 + 0.12 * z;
  const bg: Cam = { zoom: 1.5, dx: 0, dy: 0, ty: -250, tx: -60, ox: 640, oy: 900 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#1a120c' }}>
      {/* bright field beyond the veranda, seen through the open side */}
      <BandImg id="graphic/sky" k={1} cam={bg} />
      <BandImg id="graphic/field" k={1} cam={bg} />
      <svg viewBox="0 0 1080 1920" style={{ ...FULL, transform: `scale(${1 + 0.05 * z})`, transformOrigin: '540px 900px' }}>
        <defs>
          <linearGradient id="g3-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4a3526" />
            <stop offset="0.4" stopColor="#3d2c20" />
            <stop offset="1" stopColor="#140d08" />
          </linearGradient>
          <radialGradient id="g3-pool" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#f6f0d0" stopOpacity={0.28} />
            <stop offset="1" stopColor="#f6f0d0" stopOpacity={0} />
          </radialGradient>
        </defs>
        {/* eave + posts (dark framing) */}
        <rect x={0} y={0} width={1080} height={240} fill="#120c08" />
        <rect x={0} y={232} width={1080} height={26} fill="#24180f" />
        <rect x={0} y={0} width={70} height={1920} fill="#0f0a06" />
        <rect x={980} y={0} width={100} height={1920} fill="#120c08" />
        {/* veranda floor (engawa planks) */}
        <path d="M 0 860 L 1080 820 L 1080 1920 L 0 1920 Z" fill="url(#g3-floor)" />
        {[0, 1, 2, 3, 4, 5, 6].map((k) => { const y = 860 + Math.pow(k / 6, 1.6) * 1060; return <path key={k} d={`M 0 ${y} L 1080 ${y - 40 * (1 - k / 7)}`} stroke="#22170f" strokeWidth={3 + k} />; })}
        <path d="M 0 860 L 1080 820" stroke="#c9b48a" strokeWidth={4} opacity={0.5} />
        {/* light pool on the boards */}
        <ellipse cx={540} cy={1080} rx={520} ry={220} fill="url(#g3-pool)" />
        <Binoculars x={540} y={1090} s={s} lens={(cx, cy, r, i) => <LensView cx={cx} cy={cy} r={r} i={i} t={t} grow={grow} />} />
      </svg>
    </AbsoluteFill>
  );
};

/** shot 13 — end card: dusk field, binoculars silhouette, white twisting motif, YES / NO. */
export const S13: React.FC = () => {
  const { p, t, sec } = useShot();
  const cap = sec - 0.5 - 0.3;
  const at = (re: RegExp, fb: number) => Math.min(wordAt(13, re, fb), cap);
  const on = (x: number) => ramp(t, x, x + 0.3, EOUT);
  const q = on(Math.min(0.1, cap));
  const c = on(at(/^Comment/i, 0.5));
  const y = on(at(/^YES/i, 0.62));
  const n = on(at(/^NO/i, 0.82));
  const { hx, hy } = handheld(t, 0.2);
  const cam: Cam = { zoom: 1.04, dx: 0, dy: 0, tx: hx * 0, ty: hy * 0, ox: KX - 108, oy: KY - 192 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#0e130c' }}>
      <BandImg id="graphic/sky" k={0.4} cam={cam} />
      <BandImg id="graphic/field" k={0.8} cam={cam} />
      <svg viewBox="0 0 1080 1920" style={FULL}>
        <defs>
          <linearGradient id="g13-dusk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0b1009" stopOpacity={0.95} />
            <stop offset="0.38" stopColor="#1b2416" stopOpacity={0.55} />
            <stop offset="0.5" stopColor="#3a2a1a" stopOpacity={0.25} />
            <stop offset="0.62" stopColor="#0b1009" stopOpacity={0.7} />
            <stop offset="1" stopColor="#050704" stopOpacity={0.97} />
          </linearGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#g13-dusk)" />
      </svg>
      <Live k={0.8} cam={cam}>
        <Kune x={KX} y={KY} h={90} t={t} id="k13" />
      </Live>
      <BandImg id="graphic/fg" k={1.1} cam={cam} />
      <svg viewBox="0 0 1080 1920" style={FULL}>
        <Binoculars x={540} y={1590} s={0.9} rim="#9be15d" lens={(cx, cy, r) => <ellipse cx={cx} cy={cy} rx={r * 0.5} ry={r * 0.45} fill="#9be15d" opacity={0.16 + 0.06 * Math.sin(t * 3)} />} />
      </svg>
      <AbsoluteFill style={{ alignItems: 'center' }}>
        <div style={{ position: 'absolute', top: 250, width: 920, textAlign: 'center', fontFamily: oswald, fontWeight: 700, fontSize: 104, lineHeight: 1.05, color: '#f5f5ef', opacity: q, transform: `translateY(${(1 - q) * 16}px)` }}>
          WOULD YOU<br />HAVE LOOKED?
        </div>
        <div style={{ position: 'absolute', top: 1100, width: 920, textAlign: 'center', fontFamily: oswald, fontWeight: 500, fontSize: 60, letterSpacing: '0.16em', color: '#e9ecd8', opacity: c }}>COMMENT</div>
        <div style={{ position: 'absolute', top: 1175, width: 920, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 40, fontFamily: oswald, fontWeight: 700 }}>
          <span style={{ fontSize: 150, color: GREEN, opacity: y, transform: `scale(${0.85 + 0.15 * y})`, display: 'inline-block' }}>YES</span>
          <span style={{ fontSize: 56, color: '#e9ecd8', opacity: Math.min(y, n > 0 ? 1 : y) * 0.8 }}>or</span>
          <span style={{ fontSize: 150, color: GREEN, opacity: n, transform: `scale(${0.85 + 0.15 * n})`, display: 'inline-block' }}>NO</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
