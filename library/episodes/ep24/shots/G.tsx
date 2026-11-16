import React from 'react';
import { AbsoluteFill, Easing } from 'remotion';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { loadFont as loadOswald } from '@remotion/google-fonts/Oswald';
import { loadFont as loadNotoSC } from '@remotion/google-fonts/NotoSerifSC';
import { useShot, ramp, EIO, EOUT } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { PaleHand } from '../art/graphic_hand';

const { fontFamily: cinzel } = loadCinzel('normal', { weights: ['700'], subsets: ['latin'] });
const { fontFamily: oswald } = loadOswald('normal', { weights: ['400', '600', '700'], subsets: ['latin'] });
// 鬼 (U+9B3C) lives in subset [112], 月 (U+6708) in [119]
const { fontFamily: notoSC } = loadNotoSC('normal', { weights: ['700'], subsets: ['[112]', '[119]'] as never });

const RED = '#ff4d4d';
const LANTERN = '#e0402f';
const GLOW = '#ff8a5c';
const FIRE = '#ffb057';
const SMOKE = '#8f8a84';
const PALE = '#f1e6dc';
const INK = '#0b0708';
const EBACK = Easing.out(Easing.back(1.6));
const FULL: React.CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%' };

/* ---------------- shared art ---------------- */
const Defs: React.FC<{ p: string }> = ({ p }) => (
  <defs>
    <radialGradient id={`${p}-glow`} cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor={GLOW} stopOpacity={0.7} />
      <stop offset="0.35" stopColor={LANTERN} stopOpacity={0.28} />
      <stop offset="1" stopColor={LANTERN} stopOpacity={0} />
    </radialGradient>
    <radialGradient id={`${p}-paper`} cx="0.42" cy="0.4" r="0.65">
      <stop offset="0" stopColor="#ffd0a0" />
      <stop offset="0.35" stopColor={GLOW} />
      <stop offset="0.75" stopColor={LANTERN} />
      <stop offset="1" stopColor="#7a1a14" />
    </radialGradient>
    <radialGradient id={`${p}-fire`} cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#ffe2a8" stopOpacity={0.9} />
      <stop offset="0.3" stopColor={FIRE} stopOpacity={0.45} />
      <stop offset="1" stopColor={FIRE} stopOpacity={0} />
    </radialGradient>
    <linearGradient id={`${p}-sky`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#080506" />
      <stop offset="0.55" stopColor="#1f0d0c" />
      <stop offset="1" stopColor="#120808" />
    </linearGradient>
    <linearGradient id={`${p}-smoke`} x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stopColor={SMOKE} stopOpacity={0.35} />
      <stop offset="1" stopColor={SMOKE} stopOpacity={0} />
    </linearGradient>
    <linearGradient id={`${p}-gate`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={LANTERN} stopOpacity={0.15} />
      <stop offset="0.7" stopColor={GLOW} stopOpacity={0.45} />
      <stop offset="1" stopColor="#ffd0a0" stopOpacity={0.55} />
    </linearGradient>
  </defs>
);

/** Red paper lantern centred at (x,y), body radius r. */
const Lantern: React.FC<{ x: number; y: number; r: number; p: string; sway?: number; glow?: number; tassel?: boolean; hang?: number }> = ({ x, y, r, p, sway = 0, glow = 1, tassel = true, hang = 4 }) => (
  <g transform={`rotate(${sway} ${x} ${y - r * 2.2})`}>
    <ellipse cx={x} cy={y} rx={r * 3.2} ry={r * 3.2} fill={`url(#${p}-glow)`} opacity={glow} />
    <line x1={x} y1={y - r * hang} x2={x} y2={y - r * 0.9} stroke={INK} strokeWidth={Math.max(2, r * 0.05)} />
    <rect x={x - r * 0.42} y={y - r * 0.98} width={r * 0.84} height={r * 0.18} rx={r * 0.04} fill="#2a1410" />
    <ellipse cx={x} cy={y} rx={r * 1.08} ry={r * 0.86} fill={`url(#${p}-paper)`} />
    {[-0.62, -0.25, 0.25, 0.62].map((k) => (
      <path key={k} d={`M ${x + k * r * 0.5} ${y - r * 0.82} Q ${x + k * r * 1.55} ${y} ${x + k * r * 0.5} ${y + r * 0.82}`} fill="none" stroke="#8a2318" strokeWidth={r * 0.035} opacity={0.6} />
    ))}
    <rect x={x - r * 0.42} y={y + r * 0.8} width={r * 0.84} height={r * 0.18} rx={r * 0.04} fill="#2a1410" />
    {tassel && <path d={`M ${x} ${y + r * 0.98} L ${x} ${y + r * 1.2} M ${x - r * 0.1} ${y + r * 1.2} L ${x - r * 0.06} ${y + r * 1.75} L ${x + r * 0.06} ${y + r * 1.75} L ${x + r * 0.1} ${y + r * 1.2} Z`} stroke="#b02a1e" strokeWidth={r * 0.04} fill="#b02a1e" />}
    <path d={`M ${x - r * 0.95} ${y - r * 0.3} Q ${x - r * 0.9} ${y - r * 0.75} ${x - r * 0.4} ${y - r * 0.82}`} fill="none" stroke="#ffd9b0" strokeWidth={r * 0.05} opacity={0.6} />
  </g>
);

/** Soft rising smoke ribbons above (x,y). */
const Smoke: React.FC<{ x: number; y: number; t: number; p: string; h?: number; w?: number }> = ({ x, y, t, p, h = 700, w = 1 }) => (
  <g>
    {[0, 1, 2].map((i) => {
      const ph = t * 0.6 + i * 2.1;
      const a = Math.sin(ph) * 40 * w, b = Math.cos(ph * 0.8) * 60 * w;
      const x0 = x + (i - 1) * 20 * w;
      return (
        <path key={i} d={`M ${x0 - 14 * w} ${y} C ${x0 + a - 60 * w} ${y - h * 0.35} ${x0 + b + 70 * w} ${y - h * 0.6} ${x0 + a} ${y - h} L ${x0 + a + 50 * w} ${y - h} C ${x0 + b + 130 * w} ${y - h * 0.6} ${x0 + a} ${y - h * 0.35} ${x0 + 14 * w} ${y} Z`}
          fill={`url(#${p}-smoke)`} opacity={0.75 - i * 0.15} />
      );
    })}
  </g>
);

/** Deterministic embers rising from (x,y). */
const Embers: React.FC<{ x: number; y: number; t: number; n?: number; spread?: number; h?: number }> = ({ x, y, t, n = 18, spread = 160, h = 900 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const sp = 0.12 + ((i * 37) % 11) / 60;
      const k = (t * sp + (i * 0.618) % 1) % 1;
      const ex = x + Math.sin(i * 12.9) * spread * (0.3 + k) + Math.sin(t * 2 + i) * 18;
      const ey = y - k * h;
      const r = 2.5 + ((i * 7) % 4);
      return <circle key={i} cx={ex} cy={ey} r={r * (1 - k * 0.6)} fill={i % 3 ? FIRE : '#ffe2a8'} opacity={(1 - k) * 0.95} />;
    })}
  </g>
);

/** Shophouse eave silhouette (left edge), mirrored with flip. */
const Eave: React.FC<{ flip?: boolean; y?: number; fill?: string }> = ({ flip, y = 0, fill = INK }) => (
  <g transform={flip ? 'translate(1080 0) scale(-1 1)' : undefined}>
    <path d={`M -20 ${y - 20} L 300 ${y + 60} Q 360 ${y + 70} 400 ${y + 40} L 410 ${y + 70} Q 360 ${y + 120} 260 ${y + 110} L 150 ${y + 100} L 150 1920 L -20 1920 Z`} fill={fill} />
  </g>
);

/* ---------------- shot 2: title card ---------------- */
export const S02: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const a = ramp(t, wordAt(2, /^Ghost/, 0.25) - 0.25, wordAt(2, /^Ghost/, 0.25) + 0.35, EOUT);
  const b = ramp(t, wordAt(2, /^Month/, 0.5) - 0.1, wordAt(2, /^Month/, 0.5) + 0.45, EOUT);
  const flick = 0.88 + 0.08 * Math.sin(t * 7.3) + 0.04 * Math.sin(t * 17.1);
  const track = 0.1 - 0.04 * a;
  return (
    <AbsoluteFill style={{ backgroundColor: INK }}>
      <svg viewBox="0 0 1080 1920" style={{ ...FULL, transform: `scale(${1 + 0.06 * z})`, transformOrigin: '540px 1000px' }}>
        <Defs p="g2" />
        <rect width={1080} height={1920} fill="url(#g2-sky)" />
        {/* distant lantern string, dim */}
        <path d="M -20 760 Q 540 900 1100 760" fill="none" stroke="#2a1410" strokeWidth={4} />
        {[150, 330, 750, 930].map((x, i) => (
          <Lantern key={x} x={x} y={880 - Math.abs(x - 540) * 0.25} r={34} p="g2" hang={(880 - Math.abs(x - 540) * 0.25 - (760 + 140 * (1 - ((x - 540) / 560) ** 2) * 0.5)) / 34} glow={0.5} sway={Math.sin(t * 1.3 + i) * 2} tassel={false} />
        ))}
        {/* hero lantern with rising smoke */}
        <Smoke x={540} y={940} t={t} p="g2" h={720} w={1.6} />
        <Lantern x={540} y={1120} r={150} p="g2" sway={Math.sin(t * 1.1) * 1.5} glow={flick} />
        {/* foreground eaves */}
        <Eave y={1260} />
        <Eave flip y={1240} />
        {/* wet pavement: soft lantern reflection streaks below the eaves */}
        <ellipse cx={540} cy={1500} rx={300} ry={90} fill="url(#g2-glow)" opacity={0.45 * flick} />
        {[-1, 0, 1].map((k) => <rect key={k} x={540 + k * 46 - 10} y={1420} width={20} height={200 - Math.abs(k) * 70} rx={10} fill={GLOW} opacity={0.14 - Math.abs(k) * 0.05} />)}
        <rect x={0} y={1600} width={1080} height={320} fill={INK} opacity={0.6} />
      </svg>
      <AbsoluteFill style={{ alignItems: 'center', top: 250 }}>
        <div style={{
          fontFamily: cinzel, fontWeight: 700, fontSize: 98, lineHeight: 1, letterSpacing: `${track}em`, marginRight: `-${track}em`,
          color: PALE, opacity: a, transform: `translateY(${(1 - a) * 24}px)`, whiteSpace: 'nowrap',
        }}>GHOST MONTH</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 34, opacity: b }}>
          <div style={{ width: 120 * b, height: 3, background: `linear-gradient(90deg, rgba(255,77,77,0), ${RED})` }} />
          <div style={{ fontFamily: notoSC, fontWeight: 700, fontSize: 64, color: RED, whiteSpace: 'nowrap', letterSpacing: '0.1em' }}>鬼月</div>
          <div style={{ fontFamily: cinzel, fontWeight: 700, fontSize: 44, color: '#d8c3b4', whiteSpace: 'nowrap', letterSpacing: '0.14em' }}>· CHINA</div>
          <div style={{ width: 120 * b, height: 3, background: `linear-gradient(90deg, ${RED}, rgba(255,77,77,0))` }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------------- shot 3: lore, offerings burning under a gate that opens ---------------- */
export const S03: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const open = ramp(t, wordAt(3, /^gates/, 0.25), wordAt(3, /^open/, 0.45, 'end') + 0.3, EIO);
  const dead = ramp(t, wordAt(3, /^hungry/, 0.62), wordAt(3, /^living/, 0.9), EIO);
  const flick = 0.85 + 0.1 * Math.sin(t * 9.1) + 0.05 * Math.sin(t * 23);
  const gx = 540, gy = 420; // gate lintel
  const dw = 170 * (1 - 0.85 * open);
  return (
    <AbsoluteFill style={{ backgroundColor: INK }}>
      <svg viewBox="0 0 1080 1920" style={{ ...FULL, transform: `scale(${1.02 + 0.07 * z})`, transformOrigin: '540px 1100px' }}>
        <Defs p="g3" />
        <rect width={1080} height={1920} fill="url(#g3-sky)" />
        {/* underworld gate: light spills between pillars as it opens */}
        <ellipse cx={gx} cy={820} rx={200 + 260 * open} ry={420 + 120 * open} fill="url(#g3-glow)" opacity={0.25 + 0.75 * open} />
        <rect x={gx - 170} y={gy + 80} width={340} height={760} fill="url(#g3-gate)" opacity={0.15 + 0.85 * open} />
        <rect x={gx - 170} y={gy + 80} width={dw} height={760} fill="#1a0c0b" />
        <rect x={gx + 170 - dw} y={gy + 80} width={dw} height={760} fill="#1a0c0b" />
        {/* paifang pillars + roofs */}
        <rect x={gx - 230} y={gy + 40} width={60} height={820} fill="#140a09" />
        <rect x={gx + 170} y={gy + 40} width={60} height={820} fill="#140a09" />
        <path d={`M ${gx - 330} ${gy + 30} Q ${gx} ${gy - 20} ${gx + 330} ${gy + 30} L ${gx + 360} ${gy - 10} L ${gx + 280} ${gy + 70} L ${gx - 280} ${gy + 70} L ${gx - 360} ${gy - 10} Z`} fill="#140a09" />
        <path d={`M ${gx - 260} ${gy - 60} Q ${gx} ${gy - 100} ${gx + 260} ${gy - 60} L ${gx + 290} ${gy - 95} L ${gx + 220} ${gy - 20} L ${gx - 220} ${gy - 20} L ${gx - 290} ${gy - 95} Z`} fill="#140a09" />
        <rect x={gx - 230} y={gy - 25} width={460} height={30} fill="#140a09" />
        <path d={`M ${gx - 328} ${gy + 28} Q ${gx} ${gy - 22} ${gx + 328} ${gy + 28}`} fill="none" stroke={GLOW} strokeWidth={3} opacity={0.3 + 0.5 * open} />
        {/* shadow figures (hungry dead), implied, inside the gate light */}
        {[-90, 0, 80].map((dx, i) => {
          const s = 0.8 + i * 0.1;
          const fx = gx + dx + (1 - dead) * 20 * (i - 1), fy = 1240;
          return (
            <path key={i} opacity={dead * (0.75 - i * 0.12)} fill="#1a0c0b"
              d={`M ${fx} ${fy - 300 * s} c ${18 * s} 0 ${26 * s} ${14 * s} ${26 * s} ${30 * s} c 0 ${18 * s} ${-8 * s} ${30 * s} ${-14 * s} ${34 * s} c ${30 * s} ${8 * s} ${42 * s} ${30 * s} ${44 * s} ${80 * s} l ${4 * s} ${170 * s} l ${-30 * s} 0 l ${-2 * s} ${-60 * s} l ${-50 * s} 0 l ${-2 * s} ${60 * s} l ${-30 * s} 0 l ${4 * s} ${-170 * s} c ${2 * s} ${-50 * s} ${14 * s} ${-72 * s} ${44 * s} ${-80 * s} c ${-6 * s} ${-4 * s} ${-14 * s} ${-16 * s} ${-14 * s} ${-34 * s} c 0 ${-16 * s} ${8 * s} ${-30 * s} ${26 * s} ${-30 * s} Z`} />
          );
        })}
        {/* lantern row across the street */}
        <path d="M -20 230 Q 540 340 1100 230" fill="none" stroke="#2a1410" strokeWidth={4} />
        {[110, 300, 780, 970].map((x, i) => (
          <Lantern key={x} x={x} y={300 + (1 - ((x - 540) / 560) ** 2) * 70} r={44} p="g3" glow={0.7} sway={Math.sin(t * 1.2 + i) * 2.5} tassel={false} />
        ))}
        {/* ground */}
        <path d="M 0 1260 L 1080 1260 L 1080 1920 L 0 1920 Z" fill="#120908" />
        <ellipse cx={540} cy={1300} rx={420} ry={40} fill={GLOW} opacity={0.12 + 0.12 * open} />
        {/* offering fire bin (hero), slightly right of center */}
        <ellipse cx={690} cy={1060} rx={300} ry={300} fill="url(#g3-fire)" opacity={flick} />
        <Smoke x={690} y={1080} t={t} p="g3" h={760} w={1.3} />
        <Embers x={690} y={1110} t={t} n={22} spread={120} h={900} />
        <path d={`M 600 1150 Q 620 ${1040 - 30 * flick} 650 1100 Q 670 ${1000 - 40 * flick} 700 1090 Q 735 ${1020 - 30 * flick} 750 1110 Q 770 ${1060 - 20 * flick} 785 1150 Z`} fill={FIRE} />
        <path d="M 630 1150 Q 660 1080 690 1120 Q 720 1070 750 1150 Z" fill="#ffe2a8" />
        <rect x={650} y={1118} width={34} height={24} fill="#e8c27a" transform={`rotate(${-20 + Math.sin(t * 3) * 6} 667 1130)`} />
        <path d="M 590 1150 L 790 1150 L 770 1330 L 610 1330 Z" fill="#241a18" />
        <path d="M 586 1146 L 794 1146 L 794 1162 L 586 1162 Z" fill="#3b3330" />
        <path d="M 586 1146 L 794 1146" stroke={FIRE} strokeWidth={3} opacity={0.9} />
        {[1200, 1260].map((y) => <path key={y} d={`M ${596 + (y - 1150) * 0.11} ${y} L ${784 - (y - 1150) * 0.11} ${y}`} stroke="#120908" strokeWidth={6} />)}
        <path d="M 790 1160 L 772 1320" stroke={GLOW} strokeWidth={4} opacity={0.5} />
        {/* incense sticks left of the bin */}
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <line x1={400 + i * 16} y1={1300} x2={396 + i * 22} y2={1150 - i * 6} stroke="#6e2a1e" strokeWidth={4} />
            <circle cx={396 + i * 22} cy={1150 - i * 6} r={5} fill="#ff6a3a" opacity={0.7 + 0.3 * Math.sin(t * 4 + i)} />
          </g>
        ))}
        <rect x={380} y={1290} width={80} height={46} rx={8} fill="#2a1a16" />
        {/* foreground framing shophouses */}
        <Eave y={560} />
        <Eave flip y={600} />
        <path d="M 0 1820 Q 540 1760 1080 1820 L 1080 1920 L 0 1920 Z" fill={INK} />
      </svg>
    </AbsoluteFill>
  );
};

/* ---------------- shot 13: CTA end card ---------------- */
export const S13: React.FC = () => {
  const { t, sec } = useShot();
  const pop = (re: RegExp, fb: number) => {
    const at = Math.min(wordAt(13, re, fb), sec - 0.85);
    const k = ramp(t, at - 0.03, at + 0.25, EBACK);
    return { opacity: ramp(t, at - 0.03, at + 0.1, EOUT), transform: `scale(${0.6 + 0.4 * k})`, display: 'inline-block' } as React.CSSProperties;
  };
  const row: React.CSSProperties = { display: 'flex', gap: '0.28em', justifyContent: 'center', whiteSpace: 'nowrap' };
  const intro = ramp(t, 0, 0.5, EOUT);
  const reach = ramp(t, 0, Math.min(sec * 0.6, 2.2), EIO);
  const flick = 0.85 + 0.1 * Math.sin(t * 6.2);
  return (
    <AbsoluteFill style={{ backgroundColor: INK }}>
      <svg viewBox="0 0 1080 1920" style={FULL}>
        <Defs p="g13" />
        <rect width={1080} height={1920} fill="url(#g13-sky)" />
        <Smoke x={540} y={300} t={t} p="g13" h={340} w={1} />
        <Lantern x={540} y={470} r={130} p="g13" glow={flick * (0.4 + 0.6 * intro)} sway={Math.sin(t * 1.2) * 1.5} />
        {/* pale hand reaching in from the lower right toward the text */}
        <Eave y={1500} />
        <rect x={-10} y={0} width={60} height={1920} fill={INK} />
        <rect x={1030} y={0} width={60} height={1920} fill={INK} />
        <ellipse cx={720} cy={1560} rx={320} ry={200} fill="url(#g13-glow)" opacity={0.35 * reach} />
        <g transform={`translate(${700 + (1 - reach) * 360} ${1520 + (1 - reach) * 160}) rotate(-18) scale(1.5)`} opacity={0.62 + 0.1 * Math.sin(t * 1.7)}>
          <PaleHand id="g13h" />
        </g>
      </svg>
      <AbsoluteFill style={{ alignItems: 'center', top: 800 }}>
        <div style={{ width: 920, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ ...row, fontFamily: oswald, fontWeight: 600, fontSize: 100, color: PALE, letterSpacing: '0.04em', lineHeight: 1.05 }}>
            <span style={pop(/^Would/, 0.07)}>WOULD</span>
            <span style={pop(/^you/, 0.17)}>YOU</span>
          </div>
          <div style={{ ...row, fontFamily: oswald, fontWeight: 700, fontSize: 132, color: RED, letterSpacing: '0.03em', lineHeight: 1.05 }}>
            <span style={pop(/^turn/, 0.27)}>TURN</span>
            <span style={pop(/^around/, 0.37)}>AROUND?</span>
          </div>
          <div style={{ width: 520 * intro, height: 3, margin: '50px 0 46px', background: `linear-gradient(90deg, rgba(241,230,220,0), ${PALE}, rgba(241,230,220,0))`, opacity: 0.45 }} />
          <div style={{ ...row, fontFamily: oswald, fontWeight: 400, fontSize: 76, color: PALE, letterSpacing: '0.06em', alignItems: 'baseline' }}>
            <span style={pop(/^Comment/, 0.5)}>COMMENT</span>
            <span style={{ ...pop(/^YES/, 0.6), color: RED, fontWeight: 700 }}>YES</span>
            <span style={pop(/^or$/, 0.7)}>OR</span>
            <span style={{ ...pop(/^NO/, 0.8), color: RED, fontWeight: 700 }}>NO</span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
