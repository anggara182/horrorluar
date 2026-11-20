import React from 'react';
import { AbsoluteFill, Easing } from 'remotion';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { loadFont as loadCormorant } from '@remotion/google-fonts/Cormorant';
import { loadFont as loadOswald } from '@remotion/google-fonts/Oswald';
import { useShot, ramp, EIO, EOUT, BandImg, Live, Cam } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { G_GROUND } from '../sets/graphic';
import { CatEye, CatHeadFront, YuleCatSide, TurfHouse, Sock, EYE } from '../art/graphic_cat';

// latin subset covers Latin-1 (Ó, Ö) for JÓLAKÖTTURINN
const { fontFamily: cinzel } = loadCinzel('normal', { weights: ['700'], subsets: ['latin', 'latin-ext'] });
const { fontFamily: corm } = loadCormorant('italic', { weights: ['500'], subsets: ['latin'] });
const { fontFamily: oswald } = loadOswald('normal', { weights: ['400', '600', '700'], subsets: ['latin'] });

const PALE = '#eef2ea';
const SOCK = '#b33a3a';
const EBACK = Easing.out(Easing.back(1.6));
const FULL: React.CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%' };

/* ---------------- shot 2: title over two huge yellow eyes ---------------- */
export const S02: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const cam: Cam = { zoom: 1.12 + 0.08 * z, dx: 0, dy: 40, oy: 700 };
  const a = ramp(p, 0.03, 0.3, EOUT);
  const b = ramp(p, 0.18, 0.45, EOUT);
  const eyeAt = wordAt(2, /^Yule/, 0.35);
  const open = ramp(t, eyeAt - 0.35, eyeAt + 0.15, EOUT);
  const glow = 0.85 + 0.15 * Math.sin(t * 3);
  const hs = 1 + 0.06 * z;
  return (
    <AbsoluteFill style={{ backgroundColor: '#03050a' }}>
      <BandImg id="graphic/sky" k={0.4} cam={cam} />
      <BandImg id="graphic/aurora" k={0.6} cam={cam} />
      <svg viewBox="0 0 1080 1920" style={{ ...FULL, transform: `scale(${hs})`, transformOrigin: '540px 1100px' }}>
        <defs>
          <linearGradient id="g2-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#03050a" stopOpacity={0} />
            <stop offset="1" stopColor="#03050a" stopOpacity={1} />
          </linearGradient>
        </defs>
        <CatHeadFront x={540} y={1120} r={330} />
        <CatEye x={410} y={1080} w={190} open={open} id="g2l" tilt={14} glow={glow} />
        <CatEye x={670} y={1080} w={190} open={open} id="g2r" tilt={-14} glow={glow} />
        <rect x={0} y={1500} width={1080} height={420} fill="url(#g2-fade)" />
      </svg>
      <AbsoluteFill style={{ alignItems: 'center', top: 250 }}>
        <div style={{ width: 920, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            fontFamily: cinzel, fontWeight: 700, fontSize: 92, lineHeight: 1.15, letterSpacing: '0.02em',
            color: PALE, opacity: a, transform: `translateY(${(1 - a) * 18}px)`, whiteSpace: 'nowrap',
          }}>JÓLAKÖTTURINN</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 14, opacity: b }}>
            <div style={{ width: 110 * b, height: 3, background: `linear-gradient(90deg, rgba(255,210,63,0), ${EYE})` }} />
            <div style={{ fontFamily: corm, fontStyle: 'italic', fontWeight: 500, fontSize: 52, letterSpacing: '0.06em', color: '#cfe8dc', whiteSpace: 'nowrap' }}>The Yule Cat · Iceland</div>
            <div style={{ width: 110 * b, height: 3, background: `linear-gradient(90deg, ${EYE}, rgba(255,210,63,0))` }} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------------- shot 3: giant cat stepping over a turf house ---------------- */
export const S03: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const cam: Cam = { zoom: 1 + 0.07 * z, dx: 0, dy: 0, oy: 1100 };
  const step = ramp(p, 0.1, 0.85, EIO);
  const hunt = wordAt(3, /^hunts/, 0.45);
  const eye = 0.55 + 0.45 * ramp(t, hunt - 0.2, hunt + 0.3, EOUT);
  return (
    <AbsoluteFill style={{ backgroundColor: '#03050a' }}>
      <BandImg id="graphic/sky" k={0.3} cam={cam} />
      <BandImg id="graphic/aurora" k={0.5} cam={cam} />
      <Live k={1} cam={cam}>
        <YuleCatSide x={625 - 40 * step} y={G_GROUND - 18} s={0.66} step={step} tail={t * 0.9} eye={eye} id="g3c" />
        <TurfHouse x={700} y={G_GROUND + 16} s={0.86} lit={1} />
        {/* paw prints in the snow, foreground */}
        {[[560, 1640, 0.8], [400, 1700, 1], [620, 1780, 1.2]].map(([x, y, k], i) => (
          <g key={i} transform={`translate(${x} ${y}) scale(${k} ${k * 0.42})`} opacity={0.8}>
            <ellipse cx={0} cy={0} rx={60} ry={50} fill="#2a3444" />
            {[-55, -20, 20, 55].map((dx, j) => <ellipse key={j} cx={dx} cy={-70 - (Math.abs(dx) < 30 ? 14 : 0)} rx={22} ry={26} fill="#2a3444" />)}
          </g>
        ))}
      </Live>
      {/* foreground snow drift framing */}
      <svg viewBox="0 0 1080 1920" style={FULL}>
        <path d="M -20 1700 Q 160 1660 300 1720 Q 420 1780 480 1920 L -20 1920 Z" fill="#232c3a" />
        <path d="M 1100 1660 Q 900 1640 760 1760 Q 700 1820 720 1920 L 1100 1920 Z" fill="#1a212c" />
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
  const sway = Math.sin(t * 1.6) * 3;
  const blinkT = (t * 0.6) % 1;
  const open = intro * (blinkT > 0.9 ? Math.abs(blinkT - 0.95) * 20 : 1);
  return (
    <AbsoluteFill style={{ backgroundColor: '#04060b' }}>
      <svg viewBox="0 0 1080 1920" style={FULL}>
        <defs>
          <linearGradient id="g13-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0a1a20" />
            <stop offset="0.45" stopColor="#06090f" />
            <stop offset="1" stopColor="#030406" />
          </linearGradient>
          <radialGradient id="g13-warm" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffc76b" stopOpacity={0.35} />
            <stop offset="1" stopColor="#ffc76b" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="g13-aur" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#6fe3a6" stopOpacity={0.22} />
            <stop offset="1" stopColor="#6fe3a6" stopOpacity={0} />
          </radialGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#g13-bg)" />
        <ellipse cx={540} cy={120} rx={700} ry={360} fill="url(#g13-aur)" />
        <ellipse cx={540} cy={380} rx={460} ry={300} fill="url(#g13-warm)" opacity={intro} />
        {/* line with a pair of new red socks */}
        <path d="M -20 230 Q 540 300 1100 230" fill="none" stroke="#2c2620" strokeWidth={5} />
        <Sock x={430} y={262} s={0.95} rot={sway} flip />
        <Sock x={650} y={262} s={0.95} rot={-sway * 0.8} />
        {/* the cat in the dark below: only eyes */}
        <CatEye x={430} y={1600} w={150} open={open} id="g13l" tilt={12} glow={0.9} />
        <CatEye x={650} y={1600} w={150} open={open} id="g13r" tilt={-12} glow={0.9} />
      </svg>
      <AbsoluteFill style={{ alignItems: 'center', top: 760 }}>
        <div style={{ width: 920, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ ...row, fontFamily: oswald, fontWeight: 600, fontSize: 86, color: PALE, letterSpacing: '0.04em', lineHeight: 1.08 }}>
            <span style={pop(/^Would/, 0.06)}>WOULD</span>
            <span style={pop(/^you/, 0.14)}>YOU</span>
            <span style={pop(/^go$/, 0.22)}>GO</span>
            <span style={pop(/^out/, 0.3)}>OUT</span>
          </div>
          <div style={{ ...row, fontFamily: oswald, fontWeight: 700, fontSize: 90, color: EYE, letterSpacing: '0.03em', lineHeight: 1.08 }}>
            <span style={pop(/^on$/, 0.38)}>ON</span>
            <span style={pop(/^Christmas/, 0.46)}>CHRISTMAS</span>
            <span style={pop(/^night/, 0.54)}>NIGHT?</span>
          </div>
          <div style={{ width: 520 * intro, height: 3, margin: '50px 0 46px', background: `linear-gradient(90deg, rgba(238,242,234,0), ${PALE}, rgba(238,242,234,0))`, opacity: 0.45 }} />
          <div style={{ ...row, fontFamily: oswald, fontWeight: 400, fontSize: 76, color: PALE, letterSpacing: '0.06em', alignItems: 'baseline' }}>
            <span style={pop(/^Comment/, 0.62)}>COMMENT</span>
            <span style={{ ...pop(/^YES/, 0.7), color: SOCK, fontWeight: 700, background: 'none' }}><span style={{ color: '#e0524f' }}>YES</span></span>
            <span style={pop(/^or$/, 0.78)}>OR</span>
            <span style={{ ...pop(/^NO/, 0.86), fontWeight: 700 }}><span style={{ color: '#e0524f' }}>NO</span></span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
