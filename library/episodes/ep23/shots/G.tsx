import React from 'react';
import { AbsoluteFill } from 'remotion';
import { loadFont as loadOswald } from '@remotion/google-fonts/Oswald';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { useShot, ramp, EIO, EOUT, clamp01 } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { CandleTray, PigSil, CoinG } from '../art/graphic_candle';

const { fontFamily: oswald } = loadOswald('normal', { weights: ['400', '600', '700'], subsets: ['latin'] });
const { fontFamily: cinzel } = loadCinzel('normal', { weights: ['700'], subsets: ['latin'] });

const GOLD = '#ffd166';
const FULL: React.CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%' };

/** Shared dark room backdrop: warm-black wall with a shutter window silhouette and a table edge. */
const Room: React.FC<{ id: string; glowY: number; wy?: number; wall?: string }> = ({ id, glowY, wy = 260, wall = '#4a3424' }) => (
  <>
    <defs>
      <radialGradient id={`${id}-wall`} cx="0.5" cy={glowY / 1920} r="0.65">
        <stop offset="0" stopColor={wall} />
        <stop offset="0.45" stopColor="#1e1712" />
        <stop offset="1" stopColor="#07060a" />
      </radialGradient>
      <linearGradient id={`${id}-table`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2a1d13" />
        <stop offset="1" stopColor="#050405" />
      </linearGradient>
    </defs>
    <rect width={1080} height={1920} fill={`url(#${id}-wall)`} />
    <rect x={740} y={wy} width={280} height={480} fill="#141a26" />
    <rect x={740} y={wy} width={280} height={480} fill="none" stroke="#0a0806" strokeWidth={26} />
    <path d={`M 880 ${wy} L 880 ${wy + 480}`} stroke="#0a0806" strokeWidth={18} />
    <path d="M -20 1300 L 1100 1300 L 1100 1920 L -20 1920 Z" fill={`url(#${id}-table)`} />
    <path d="M -20 1300 L 1100 1300" stroke="#6a4a2c" strokeWidth={4} opacity={0.6} />
  </>
);

/** shot 2 — title card over a candle flame on a tray of water, slow push. */
export const S02: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const a = ramp(p, 0.04, 0.3, EOUT);
  const b = ramp(p, 0.2, 0.45, EOUT);
  const track = 0.12 - 0.04 * a;
  return (
    <AbsoluteFill style={{ backgroundColor: '#07060a' }}>
      <svg viewBox="0 0 1080 1920" style={{ ...FULL, transform: `scale(${1 + 0.06 * z})`, transformOrigin: '540px 1000px' }}>
        <Room id="g2" glowY={1000} wy={560} />
        <CandleTray x={540} y={1290} s={1.05} t={t} id="g2c" />
        <path d="M 0 0 L 90 0 Q 70 960 110 1920 L 0 1920 Z" fill="#030304" />
        <path d="M 1080 0 L 1010 0 Q 1040 900 990 1920 L 1080 1920 Z" fill="#030304" />
      </svg>
      <AbsoluteFill style={{ alignItems: 'center', top: 260 }}>
        <div style={{
          fontFamily: cinzel, fontWeight: 700, fontSize: 116, lineHeight: 1, letterSpacing: `${track}em`, marginRight: `-${track}em`,
          color: '#f6e7c6', opacity: a, transform: `translateY(${(1 - a) * 20}px)`, whiteSpace: 'nowrap',
        }}>BABI NGEPET</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 30, opacity: b }}>
          <div style={{ width: 110 * b, height: 3, background: `linear-gradient(90deg, rgba(255,209,102,0), ${GOLD})` }} />
          <div style={{ fontFamily: oswald, fontWeight: 400, fontSize: 44, letterSpacing: '0.2em', color: '#d8c49a', whiteSpace: 'nowrap' }}>AN INDONESIAN LEGEND</div>
          <div style={{ width: 110 * b, height: 3, background: `linear-gradient(90deg, ${GOLD}, rgba(255,209,102,0))` }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** shot 3 — lore: candle on water, coins beside it; a pig shadow rises on the wall; flame shakes on "shakes". */
export const S03: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const tPig = wordAt(3, /^pig/, 0.2);
  const tCoin = wordAt(3, /^money/, 0.35);
  const tPartner = wordAt(3, /^partner/, 0.45);
  const tShake = wordAt(3, /^shakes/, 0.7);
  const pig = clamp01((t - tPig + 0.2) / 0.9);
  const coins = clamp01((t - tCoin + 0.3) / 0.6);
  const woman = clamp01((t - tPartner + 0.2) / 0.9);
  const shake = clamp01((t - tShake + 0.4) / 0.6);
  return (
    <AbsoluteFill style={{ backgroundColor: '#07060a' }}>
      <svg viewBox="0 0 1080 1920" style={{ ...FULL, transform: `scale(${1.04 + 0.08 * z})`, transformOrigin: '520px 1000px' }}>
        <Room id="g3" glowY={880} wall="#6a4a30" />
        <g opacity={pig * (0.92 - 0.3 * shake * Math.abs(Math.sin(t * 15)))}>
          <PigSil x={600 + 10 * Math.sin(t * 9) * shake} y={960} s={1.25} fill="#120c08" eye={pig} />
        </g>
        <g opacity={woman} transform="translate(150 1300)">
          <path d="M -120 0 Q -130 -200 -80 -300 Q -60 -340 -20 -350 Q 20 -340 40 -300 Q 90 -200 110 0 Z" fill="#050405" />
          <ellipse cx={-20} cy={-400} rx={48} ry={58} fill="#050405" />
          <path d="M -68 -410 Q -90 -300 -70 -250 L 30 -260 Q 40 -330 28 -420 Z" fill="#050405" />
          <path d="M 28 -440 Q 58 -400 40 -320" stroke="#ffbf66" strokeWidth={4} fill="none" opacity={0.6} />
        </g>
        <CandleTray x={540} y={1250} s={1.1} t={t} shake={shake} id="g3c" />
        <g opacity={coins} transform={`translate(0 ${(1 - coins) * -30})`}>
          <CoinG x={830} y={1360} r={54} />
          <CoinG x={910} y={1338} r={48} />
          <CoinG x={862} y={1316} r={50} />
          <CoinG x={880} y={1294} r={46} />
          <CoinG x={290} y={1330} r={44} />
        </g>
        <path d="M 1080 0 L 1000 0 Q 1030 900 980 1920 L 1080 1920 Z" fill="#030304" />
      </svg>
    </AbsoluteFill>
  );
};

/** shot 13 — CTA: candle + black pig motif; words appear on their VO times, capped so all is visible >= 0.5 s before the end. */
export const S13: React.FC = () => {
  const { t, sec } = useShot();
  const cap = Math.max(0, sec - 0.9);
  const at = (re: RegExp, fb: number) => Math.min(wordAt(13, re, fb), cap);
  const fade = (t0: number) => clamp01((t - t0) / 0.3);
  const q1 = fade(at(/^Would/, 0.05));
  const q2 = fade(at(/^candle/, 0.45));
  const c1 = fade(at(/^Comment/, 0.6));
  const yes = fade(at(/^YES/, 0.68));
  const no = fade(at(/^NO/, 0.8));
  return (
    <AbsoluteFill style={{ backgroundColor: '#07060a' }}>
      <svg viewBox="0 0 1080 1920" style={FULL}>
        <Room id="g13" glowY={1150} wy={480} />
        <PigSil x={540} y={1300} s={1.3} fill="#050405" eye={0.9} rim="#ffbf66" />
        <CandleTray x={540} y={1420} s={0.8} t={t} id="g13c" />
      </svg>
      <AbsoluteFill style={{ alignItems: 'center', top: 220 }}>
        <div style={{ width: 920, textAlign: 'center', fontFamily: cinzel, fontWeight: 700, fontSize: 78, lineHeight: 1.2, whiteSpace: 'nowrap', color: '#f6e7c6' }}>
          <div style={{ opacity: q1 }}>Would you blow out</div>
          <div style={{ opacity: q2, color: GOLD }}>the candle?</div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: 'center', top: 1560 }}>
        <div style={{ fontFamily: oswald, fontWeight: 400, fontSize: 52, letterSpacing: '0.16em', color: '#d8c49a', opacity: c1 }}>COMMENT</div>
        <div style={{ display: 'flex', gap: 40, marginTop: 14, fontFamily: oswald, fontWeight: 700, fontSize: 140, lineHeight: 1 }}>
          <span style={{ color: GOLD, opacity: yes, transform: `scale(${0.85 + 0.15 * yes})` }}>YES</span>
          <span style={{ color: '#a89a80', opacity: no }}>or</span>
          <span style={{ color: GOLD, opacity: no, transform: `scale(${0.85 + 0.15 * no})` }}>NO</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
