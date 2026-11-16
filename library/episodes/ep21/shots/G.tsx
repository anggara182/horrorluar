import React from 'react';
import { AbsoluteFill } from 'remotion';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { loadFont as loadCormorant } from '@remotion/google-fonts/Cormorant';
import { useShot, ramp, EIO, EOUT, BandImg, Live, Cam } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { GREEN } from '../comp/Overlays';
import { MOON } from '../sets/graphic';

const { fontFamily: cinzel } = loadCinzel('normal', { weights: ['700'], subsets: ['latin'] });
const { fontFamily: corm } = loadCormorant('normal', { weights: ['600', '700'], subsets: ['latin', 'cyrillic'] });

const PALE = '#e9eef5';
const YARN = '#c23a32';

/** Chimney smoke wisps (world space, live). */
const Smoke: React.FC<{ t: number; x: number; y: number; rise?: number }> = ({ t, x, y, rise = 330 }) => (
  <g>
    {[0, 1, 2, 3].map((i) => {
      const ph = (t * 0.25 + i / 4) % 1;
      return (
        <ellipse key={i} cx={x + Math.sin(ph * 5 + i) * 26 + ph * 60} cy={y - ph * rise} rx={22 + ph * 50} ry={16 + ph * 30}
          fill="#b8c3d0" opacity={0.32 * (1 - ph) * Math.min(1, ph * 6)} />
      );
    })}
  </g>
);

/** Window glow (radial gradient, live flicker). */
const WinGlow: React.FC<{ t: number; id: string }> = ({ t, id }) => (
  <g>
    <defs>
      <radialGradient id={id} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#ffb35c" stopOpacity={0.5} />
        <stop offset="1" stopColor="#ff8a3d" stopOpacity={0} />
      </radialGradient>
    </defs>
    <circle cx={648 + 63} cy={1600 - 390} r={150 + 8 * Math.sin(t * 7) + 5 * Math.sin(t * 13)} fill={`url(#${id})`} />
  </g>
);

/** shot 2 — title card: hut on chicken legs against the moon, slow push. */
export const S02: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const cam: Cam = { zoom: 1.22 + 0.08 * z, dx: 0, dy: -170, oy: 1150 };
  const a = ramp(p, 0.02, 0.25, EOUT);
  const bt = wordAt(2, /^Baba/, 0.5);
  const sec = useShot().sec;
  const b = ramp(t, Math.min(bt, sec - 1.2) - 0.3, Math.min(bt, sec - 1.2) + 0.4, EOUT);
  return (
    <AbsoluteFill style={{ backgroundColor: '#05070f' }}>
      <BandImg id="graphic/sky" k={0.35} cam={cam} />
      <BandImg id="graphic/hut" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <WinGlow t={t} id="g2-win" />
        <Smoke t={t} x={648 + 87} y={1600 - 655} rise={130} />
      </Live>
      <div style={{ position: 'absolute', left: 80, right: 80, top: 150, textAlign: 'center' }}>
        <div style={{ fontFamily: cinzel, fontWeight: 700, fontSize: 124, letterSpacing: 8, whiteSpace: 'nowrap', color: PALE, opacity: a, transform: `translateY(${(1 - a) * 30}px)`, lineHeight: 1 }}>
          BABA YAGA
        </div>
        <div style={{ margin: '28px auto 0', width: 520 * b, height: 3, background: GREEN, opacity: 0.8 }} />
        <div style={{ fontFamily: corm, fontWeight: 700, fontSize: 64, color: GREEN, marginTop: 18, opacity: b, letterSpacing: 4 }}>
          Баба-Яга · Russia
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Mortar with Baba Yaga silhouette + pestle, local coords centred on the mortar rim. */
const Mortar: React.FC<{ t: number }> = ({ t }) => (
  <g>
    {/* witch silhouette: hunched, scarf, hooked nose, wild hair */}
    <path d="M-40,-60 Q-60,-130 -20,-170 Q10,-200 50,-180 Q70,-160 64,-130 L110,-100 L60,-108 Q58,-90 40,-60 Z" fill="#0a0d14" />
    {[0, 1, 2, 3, 4].map((i) => (
      <path key={i} d={`M-30,${-160 + i * 14} q${-30 - i * 6},${10 + Math.sin(t * 6 + i) * 6} ${-62 - i * 8},${20 + i * 4}`} stroke="#b9b4aa" strokeWidth={4} fill="none" opacity={0.7} strokeLinecap="round" />
    ))}
    {/* pestle held up */}
    <line x1={40} y1={-120} x2={150} y2={-250} stroke="#2a1d14" strokeWidth={14} strokeLinecap="round" />
    <ellipse cx={154} cy={-256} rx={16} ry={22} fill="#2a1d14" transform="rotate(40 154 -256)" />
    {/* mortar */}
    <path d="M-95,-62 L95,-62 L70,90 Q0,110 -70,90 Z" fill="#3a2b20" />
    <ellipse cx={0} cy={-62} rx={95} ry={18} fill="#21170f" />
    <path d="M-88,-20 Q0,-6 88,-20 M-80,30 Q0,44 80,30" stroke="#21170f" strokeWidth={5} fill="none" />
    <path d="M-95,-62 L-70,90" stroke="#e9eef5" strokeWidth={3} opacity={0.35} />
  </g>
);

/** shot 3 — lore: mortar flies across the moon, a broom sweeping its trail. */
export const S03: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const cam: Cam = { zoom: 1.18 + 0.06 * z, dx: 0, dy: 140, oy: 760 };
  const fx = 300 + 700 * p;
  const fy = MOON.y + 170 - 220 * p + Math.sin(t * 2.2) * 18;
  const tail = Array.from({ length: 9 }, (_, i) => i);
  return (
    <AbsoluteFill style={{ backgroundColor: '#05070f' }}>
      <BandImg id="graphic/sky" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        {tail.map((i) => (
          <path key={i} d={`M${fx - 120 - i * 70},${fy + 40 + i * 16 + Math.sin(t * 4 + i) * 6} q-40,${8 + i} -90,${4 + i * 2}`} stroke="#d8e2ea" strokeWidth={6 - i * 0.5} opacity={0.5 - i * 0.05} fill="none" strokeLinecap="round" />
        ))}
        {/* broom sweeping behind */}
        <g transform={`translate(${fx - 150},${fy + 60}) rotate(${-20 + Math.sin(t * 5) * 14})`}>
          <line x1={0} y1={0} x2={150} y2={-30} stroke="#2a1d14" strokeWidth={8} strokeLinecap="round" />
          <path d="M0,0 L-80,-30 L-90,0 L-80,30 Z" fill="#4a3a26" />
        </g>
        <g transform={`translate(${fx},${fy}) rotate(${-8 + Math.sin(t * 2.2) * 3})`}>
          <Mortar t={t} />
        </g>
        {/* fg spruce tips */}
        <path d="M0,2304 L0,1650 L60,1720 L30,1720 L110,1820 L60,1820 L160,1950 L90,1950 L220,2100 L0,2304 Z" fill="#0a1210" />
        <path d="M1296,2304 L1296,1600 L1230,1690 L1265,1690 L1180,1800 L1230,1800 L1120,1940 L1200,1940 L1060,2120 Z" fill="#0a1210" />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 13 — CTA: hut on chicken legs, red yarn line, question + Comment YES / NO. */
export const S13: React.FC = () => {
  const { t, sec } = useShot();
  const cap = sec - 0.6;
  const at = (re: RegExp, fb: number) => Math.min(wordAt(13, re, fb), cap - 0.3);
  const q = ramp(t, at(/^Would/, 0.05) - 0.1, at(/^Would/, 0.05) + 0.4, EOUT);
  const q2 = ramp(t, at(/^knock/, 0.2), at(/^knock/, 0.2) + 0.4, EOUT);
  const c = ramp(t, at(/^Comment/, 0.55), at(/^Comment/, 0.55) + 0.3, EOUT);
  const y = ramp(t, at(/^YES/, 0.68), at(/^YES/, 0.68) + 0.25, EOUT);
  const n = ramp(t, at(/^NO/, 0.88), at(/^NO/, 0.88) + 0.25, EOUT);
  const yarn = ramp(t, 0, Math.max(0.5, cap), EIO);
  const cam: Cam = { zoom: 1.1, dx: 0, dy: 40, oy: 1000 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#05070f' }}>
      <BandImg id="graphic/sky" k={0.35} cam={cam} />
      <BandImg id="graphic/hut" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <WinGlow t={t} id="g13-win" />
        <Smoke t={t} x={648 + 87} y={1600 - 655} />
        {/* red yarn running from the door out of frame */}
        <path d="M575,1490 C540,1600 330,1560 260,1660 S170,1900 230,2050 S200,2250 170,2330" stroke={YARN} strokeWidth={9} fill="none"
          strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - yarn} />
      </Live>
      <div style={{ position: 'absolute', left: 80, right: 80, top: 170, textAlign: 'center', fontFamily: corm, fontWeight: 700, color: PALE }}>
        <div style={{ fontSize: 96, lineHeight: 1.05, opacity: q }}>Would you</div>
        <div style={{ fontSize: 96, lineHeight: 1.05, opacity: q2 }}>knock on the door?</div>
      </div>
      <div style={{ position: 'absolute', left: 80, right: 80, top: 1520, textAlign: 'center', fontFamily: cinzel, fontWeight: 700, color: PALE }}>
        <div style={{ fontSize: 64, letterSpacing: 6, opacity: c }}>COMMENT</div>
        <div style={{ fontSize: 120, marginTop: 10 }}>
          <span style={{ color: GREEN, opacity: y, display: 'inline-block', transform: `scale(${0.8 + 0.2 * y})` }}>YES</span>
          <span style={{ fontSize: 64, opacity: y, margin: '0 30px' }}>or</span>
          <span style={{ color: '#ff6b5a', opacity: n, display: 'inline-block', transform: `scale(${0.8 + 0.2 * n})` }}>NO</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
