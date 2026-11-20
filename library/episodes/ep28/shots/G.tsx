import React from 'react';
import { AbsoluteFill, Easing } from 'remotion';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { loadFont as loadCormorant } from '@remotion/google-fonts/CormorantGaramond';
import { loadFont as loadOswald } from '@remotion/google-fonts/Oswald';
import { useShot, ramp, EIO, EOUT } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { GREEN } from '../comp/Overlays';
import { WomanBack, Frangi, Petal, Skewer } from '../art/graphic_woman';

const { fontFamily: cinzel } = loadCinzel('normal', { weights: ['700'], subsets: ['latin'] });
const { fontFamily: corm } = loadCormorant('italic', { weights: ['500'], subsets: ['latin'] });
const { fontFamily: oswald } = loadOswald('normal', { weights: ['400', '600', '700'], subsets: ['latin'] });

const PALE = '#e8e4dc';
const MOON = '#cfe0f0';
const EBACK = Easing.out(Easing.back(1.6));
const FULL: React.CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%' };

/** Shared moonlit night backdrop: moon glow, banana-leaf silhouettes framing the edges. */
const Ground: React.FC<{ y: number }> = ({ y }) => (
  <g>
    <path d={`M -20 ${y} Q 540 ${y - 30} 1100 ${y} L 1100 1940 L -20 1940 Z`} fill="#16181d" />
    <ellipse cx={540} cy={y + 6} rx={260} ry={26} fill="#07080a" opacity={0.8} />
  </g>
);

const Night: React.FC<{ id: string; mx?: number; my?: number; disc?: [number, number, number] }> = ({ id, mx = 540, my = 760, disc }) => (
  <g>
    <defs>
      <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#070a12" />
        <stop offset="0.45" stopColor="#141c2a" />
        <stop offset="1" stopColor="#06080c" />
      </linearGradient>
      <radialGradient id={`${id}-moon`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#dfe9f4" stopOpacity={0.55} />
        <stop offset="0.35" stopColor="#7d93ad" stopOpacity={0.28} />
        <stop offset="1" stopColor="#2a3446" stopOpacity={0} />
      </radialGradient>
    </defs>
    <rect width={1080} height={1920} fill={`url(#${id}-sky)`} />
    <ellipse cx={mx} cy={my} rx={620} ry={760} fill={`url(#${id}-moon)`} />
    {disc && <circle cx={disc[0]} cy={disc[1]} r={disc[2] * 1.6} fill={`url(#${id}-moon)`} />}
    {disc && <circle cx={disc[0]} cy={disc[1]} r={disc[2]} fill="#dfe6ee" opacity={0.9} />}
    {disc && <circle cx={disc[0] - disc[2] * 0.3} cy={disc[1] + disc[2] * 0.2} r={disc[2] * 0.18} fill="#c3ccd6" opacity={0.6} />}
    {/* distant banana trees, mid-dark */}
    <path d="M 0 1180 C 60 1100 120 1150 170 1080 C 220 1130 260 1060 320 1120 L 320 1920 L 0 1920 Z" fill="#0b1016" />
    <path d="M 1080 1150 C 1020 1080 960 1130 900 1060 C 850 1120 800 1070 760 1130 L 760 1920 L 1080 1920 Z" fill="#0b1016" />
  </g>
);

/** Foreground banana leaves (darkest layer). */
const Leaves: React.FC<{ sway: number }> = ({ sway }) => (
  <g fill="#060a0c">
    <path d={`M -40 -40 C 160 40 300 160 ${380 + sway * 12} 330 C 260 300 140 240 -40 260 Z`} />
    <path d={`M -40 200 C 100 260 180 360 ${220 + sway * 8} 480 C 120 440 40 420 -40 440 Z`} />
    <path d={`M 1120 1380 C 960 1420 850 1520 ${800 - sway * 10} 1660 C 920 1620 1020 1610 1120 1640 Z`} />
    <path d={`M 1120 -20 C 1000 60 930 140 ${900 - sway * 10} 240 C 980 210 1050 200 1120 220 Z`} />
  </g>
);

/** shot 2 — title card: woman in white from behind, knee-long hair, moonlight, slow push. */
export const S02: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const at = wordAt(2, /^Sundel/, 0.45);
  const a = ramp(t, at - 0.9, at + 0.1, EOUT);
  const b = ramp(t, at + 0.1, at + 0.8, EOUT);
  const sway = Math.sin(t * 1.3) * 0.6;
  return (
    <AbsoluteFill style={{ backgroundColor: '#06080c' }}>
      <svg viewBox="0 0 1080 1920" style={{ ...FULL, transform: `scale(${1 + 0.06 * z})`, transformOrigin: '540px 820px' }}>
        <Night id="g2" my={700} disc={[540, 610, 175]} />
        <Ground y={1590} />
        <WomanBack id="g2w" x={540} y={540} s={0.8} sway={sway} />
        {[0, 1, 2].map((i) => {
          const q = (t * 0.07 + i * 0.33) % 1;
          return <Petal key={i} x={180 + i * 330 + Math.sin(t + i) * 30} y={300 + q * 1100} s={0.8} rot={t * 40 + i * 90} op={0.8} />;
        })}
        <Leaves sway={Math.sin(t * 0.9)} />
      </svg>
      <AbsoluteFill style={{ alignItems: 'center', top: 200 }}>
        <div style={{ fontFamily: cinzel, fontWeight: 700, fontSize: 86, lineHeight: 1, letterSpacing: '0.05em', color: PALE, opacity: a, transform: `translateY(${(1 - a) * 18}px)`, whiteSpace: 'nowrap', width: 920, textAlign: 'center' }}>SUNDEL BOLONG</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 26, opacity: b }}>
          <div style={{ width: 110 * b, height: 3, background: `linear-gradient(90deg, rgba(247,168,196,0), ${GREEN})` }} />
          <div style={{ fontFamily: corm, fontStyle: 'italic', fontWeight: 500, fontSize: 52, letterSpacing: '0.06em', color: '#c9d4e2', whiteSpace: 'nowrap' }}>An Indonesian legend</div>
          <div style={{ width: 110 * b, height: 3, background: `linear-gradient(90deg, ${GREEN}, rgba(247,168,196,0))` }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** shot 3 — lore: closer on her back, hair sways; on "hides a hole" the hair parts on only darkness. Petals drift. */
export const S03: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const h0 = wordAt(3, /^hides/, 0.65);
  const h1 = wordAt(3, /^back/, 0.92);
  const part = ramp(t, h0, h1, EIO) * 0.85;
  const sway = Math.sin(t * 1.1) * (1 - part) * 0.8;
  return (
    <AbsoluteFill style={{ backgroundColor: '#06080c' }}>
      <svg viewBox="0 0 1080 1920" style={{ ...FULL, transform: `scale(${1.0 + 0.1 * z})`, transformOrigin: '540px 760px' }}>
        <Night id="g3" my={500} disc={[570, 330, 215]} />
        <Ground y={1760} />
        <WomanBack id="g3w" x={540} y={110} s={1.25} sway={sway} part={part} />
        {[0, 1, 2, 3, 4].map((i) => {
          const q = (t * 0.06 + i * 0.21) % 1;
          return <Petal key={i} x={120 + i * 210 + Math.sin(t * 0.8 + i * 2) * 50} y={120 + q * 1200} s={0.9 + (i % 2) * 0.4} rot={t * 50 + i * 70} op={0.85} />;
        })}
        <Leaves sway={Math.sin(t * 0.9)} />
      </svg>
    </AbsoluteFill>
  );
};

/** shot 13 — CTA: crossed satay skewers + frangipani over grill glow; words pop on their VO times. */
export const S13: React.FC = () => {
  const { t, sec } = useShot();
  const pop = (re: RegExp, fb: number) => {
    const at = Math.min(wordAt(13, re, fb), sec - 0.85);
    const k = ramp(t, at - 0.03, at + 0.25, EBACK);
    return { opacity: ramp(t, at - 0.03, at + 0.1, EOUT), transform: `scale(${0.6 + 0.4 * k})`, display: 'inline-block' } as React.CSSProperties;
  };
  const row: React.CSSProperties = { display: 'flex', gap: '0.28em', justifyContent: 'center', whiteSpace: 'nowrap' };
  const intro = ramp(t, 0, 0.5, EOUT);
  const flick = 0.85 + 0.15 * Math.sin(t * 5) * Math.sin(t * 2.3);
  return (
    <AbsoluteFill style={{ backgroundColor: '#07080b' }}>
      <svg viewBox="0 0 1080 1920" style={FULL}>
        <defs>
          <linearGradient id="g13-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#07080b" />
            <stop offset="0.6" stopColor="#120c0c" />
            <stop offset="1" stopColor="#2a130a" />
          </linearGradient>
          <radialGradient id="g13-ember" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ff7a2f" stopOpacity={0.75} />
            <stop offset="0.4" stopColor="#ff7a2f" stopOpacity={0.22} />
            <stop offset="1" stopColor="#ff7a2f" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="g13-pink" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={GREEN} stopOpacity={0.35} />
            <stop offset="1" stopColor={GREEN} stopOpacity={0} />
          </radialGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#g13-bg)" />
        <ellipse cx={540} cy={1640} rx={720} ry={420} fill="url(#g13-ember)" opacity={intro * flick} />
        <ellipse cx={540} cy={470} rx={380} ry={380} fill="url(#g13-pink)" opacity={intro} />
        {/* crossed skewers */}
        <Skewer x={170} y={800} s={1.6} rot={-40} />
        <Skewer x={910} y={800} s={1.6} rot={220} />
        {/* frangipani cluster at the crossing */}
        <Frangi x={540} y={400} s={1.9} rot={10} op={intro} />
        <Frangi x={400} y={500} s={1.25} rot={-30} op={intro} />
        <Frangi x={685} y={505} s={1.3} rot={40} op={intro} />
        {/* grill smoke wisps (gradient-free soft strokes) */}
        {[0, 1, 2].map((i) => { const q = (t * 0.12 + i * 0.33) % 1; return <path key={i} d={`M ${300 + i * 240} ${1640 - q * 380} q 40 -60 0 -120 q -40 -60 0 -120`} stroke="#8a8f99" strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.18 * Math.sin(q * Math.PI)} />; })}
        {[0, 1, 2, 3].map((i) => {
          const q = (t * 0.09 + i * 0.27) % 1;
          return <Petal key={i} x={[110, 230, 860, 975][i] + Math.sin(t * 0.7 + i * 1.7) * 30} y={140 + q * 1400} s={1.1} rot={t * 45 + i * 80} op={0.9 * Math.sin(q * Math.PI)} />;
        })}
        {/* grill bars + coals at the bottom */}
        <rect x={60} y={1640} width={960} height={280} rx={12} fill="#1a0e08" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => <ellipse key={i} cx={130 + i * 137} cy={1700} rx={56} ry={18} fill="#ff7a2f" opacity={0.35 + 0.3 * ((i * 37) % 3) / 2 * flick} />)}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => <rect key={i} x={80 + i * 110} y={1660} width={10} height={70} fill="#0c0705" />)}
        {/* edge darkness */}
        <rect x={-10} y={0} width={50} height={1920} fill="#040506" />
        <rect x={1040} y={0} width={50} height={1920} fill="#040506" />
      </svg>
      <AbsoluteFill style={{ alignItems: 'center', top: 860 }}>
        <div style={{ width: 920, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ ...row, fontFamily: oswald, fontWeight: 600, fontSize: 112, color: PALE, letterSpacing: '0.04em', lineHeight: 1.05 }}>
            <span style={pop(/^Would/, 0.07)}>WOULD</span>
            <span style={pop(/^you/, 0.15)}>YOU</span>
            <span style={pop(/^sell/, 0.24)}>SELL</span>
          </div>
          <div style={{ ...row, fontFamily: oswald, fontWeight: 700, fontSize: 150, color: GREEN, letterSpacing: '0.03em', lineHeight: 1.05 }}>
            <span style={pop(/^to$/, 0.33)}>TO</span>
            <span style={pop(/^her/, 0.42)}>HER?</span>
          </div>
          <div style={{ width: 520 * intro, height: 3, margin: '48px 0 44px', background: `linear-gradient(90deg, rgba(232,228,220,0), ${PALE}, rgba(232,228,220,0))`, opacity: 0.45 }} />
          <div style={{ ...row, fontFamily: oswald, fontWeight: 400, fontSize: 80, color: PALE, letterSpacing: '0.06em', alignItems: 'baseline' }}>
            <span style={pop(/^Comment/, 0.52)}>COMMENT</span>
            <span style={{ ...pop(/^YES/, 0.62), color: GREEN, fontWeight: 700 }}>YES</span>
            <span style={pop(/^or$/, 0.72)}>OR</span>
            <span style={{ ...pop(/^NO/, 0.82), color: GREEN, fontWeight: 700 }}>NO</span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
