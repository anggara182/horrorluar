import React from 'react';
import { AbsoluteFill } from 'remotion';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { loadFont as loadCorm } from '@remotion/google-fonts/CormorantGaramond';
import { useShot, ramp, EIO, EOUT, BandImg, Live, Cam } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { GREEN } from '../comp/Overlays';
import { HuldraSil } from '../art/graphic_huldra';

const { fontFamily: cinzel } = loadCinzel('normal', { weights: ['700'], subsets: ['latin'] });
const { fontFamily: corm } = loadCorm('italic', { weights: ['500'], subsets: ['latin'] });
const GOLD = '#e8c873';
const FULL: React.CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%' };

const Glow: React.FC<{ id: string; cx: number; cy: number; rx: number; ry: number; c: string; o: number }> = ({ id, cx, cy, rx, ry, c, o }) => (
  <>
    <defs><radialGradient id={id} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={c} stopOpacity={o} /><stop offset="1" stopColor={c} stopOpacity={0} /></radialGradient></defs>
    <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#${id})`} />
  </>
);

/** shot 2 — title card: HULDRA over a back-lit woman with long hair between the pines, slow push. */
export const S02: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const cam: Cam = { zoom: 1 + 0.07 * z, dx: 0, dy: -10 * z, oy: 900 };
  const a = ramp(p, 0.02, 0.3, EOUT);
  const tH = wordAt(2, /huldra/i, 0.5);
  const { sec } = useShot();
  const b = ramp(t, tH - 0.1, tH + 0.5, EOUT);
  return (
    <AbsoluteFill style={{ backgroundColor: '#2a2436' }}>
      <BandImg id="graphic/sky" k={0.3} cam={cam} />
      <BandImg id="graphic/pines" k={0.6} cam={cam} />
      <Live k={0.8} cam={cam}>
        <Glow id="g2-halo" cx={648} cy={1150} rx={330} ry={480} c="#fff1cc" o={0.55} />
        <HuldraSil x={648} y={1560} s={0.92} sway={t * 1.2} />
      </Live>
      <BandImg id="graphic/fg" k={1.1} cam={cam} />
      <svg viewBox="0 0 1080 1920" style={FULL}>
        <defs><linearGradient id="g2-top" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1e1828" stopOpacity={0.7} /><stop offset="1" stopColor="#1e1828" stopOpacity={0} /></linearGradient></defs>
        <rect x={0} y={0} width={1080} height={620} fill="url(#g2-top)" />
        <g opacity={a} transform={`translate(0 ${20 * (1 - a)})`}>
          <text x={540} y={330} textAnchor="middle" fontFamily={cinzel} fontSize={168} letterSpacing={18} fill="#2a1f14" opacity={0.35} dy={6}>HULDRA</text>
          <text x={540} y={330} textAnchor="middle" fontFamily={cinzel} fontSize={168} letterSpacing={18} fill="#fff4d8">HULDRA</text>
        </g>
        <g opacity={b}>
          <rect x={390} y={372} width={300} height={3} fill={GOLD} opacity={0.8} />
          <text x={540} y={440} textAnchor="middle" fontFamily={corm} fontStyle="italic" fontSize={58} fill="#fff1d0">Hulder · Norway</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/** shot 3 — lore insert: a pine trunk split open, hollow and dark inside, golden hair caught on the bark. */
export const S03: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const cam: Cam = { zoom: 1.12 + 0.08 * z, dx: 0, dy: 0, oy: 820 };
  const tH = wordAt(3, /hollow/i, 0.45);
  const h = ramp(t, tH - 0.2, tH + 1.2, EOUT);
  const sway = Math.sin(t * 1.4);
  const hairs = [0, 1, 2, 3, 4, 5, 6];
  return (
    <AbsoluteFill style={{ backgroundColor: '#2a2436' }}>
      <BandImg id="graphic/sky" k={0.3} cam={cam} />
      <BandImg id="graphic/pines" k={0.6} cam={cam} />
      <svg viewBox="0 0 1080 1920" style={{ ...FULL, transform: `scale(${1 + 0.06 * z})`, transformOrigin: '540px 820px' }}>
        <defs>
          <linearGradient id="g3-bark" x1="0" x2="1">
            <stop offset="0" stopColor="#2a2018" /><stop offset="0.25" stopColor="#4a3626" /><stop offset="0.7" stopColor="#3b2a1e" /><stop offset="1" stopColor="#1a130d" />
          </linearGradient>
          <radialGradient id="g3-void" cx="0.5" cy="0.45" r="0.55">
            <stop offset="0" stopColor="#030203" /><stop offset="0.7" stopColor="#0d0907" /><stop offset="1" stopColor="#241a12" />
          </radialGradient>
        </defs>
        <Glow id="g3-back" cx={540} cy={760} rx={520} ry={700} c="#fff1cc" o={0.45} />
        {/* trunk */}
        <path d="M380 -20 L700 -20 Q690 400 712 800 Q730 1150 790 1360 Q860 1440 940 1470 L140 1470 Q230 1430 290 1350 Q350 1150 368 800 Q392 400 380 -20Z" fill="url(#g3-bark)" />
        {/* rim on the right edge */}
        <path d="M700 -20 Q690 400 712 800 Q730 1150 790 1360" stroke="#f3d9a4" strokeWidth={6} fill="none" opacity={0.7} />
        <path d="M380 -20 Q392 400 368 800 Q350 1150 290 1350" stroke="#f3d9a4" strokeWidth={3} fill="none" opacity={0.35} />
        {/* bark ridges */}
        {[430, 470, 610, 650].map((x, i) => <path key={i} d={`M${x} 0 Q${x + (i % 2 ? 10 : -10)} 300 ${x + (i < 2 ? -6 : 8)} 520`} stroke="#22180f" strokeWidth={7} fill="none" opacity={0.7} />)}
        <ellipse cx={440} cy={300} rx={18} ry={30} fill="#22180f" />
        {/* split / hollow */}
        <path d={`M540 ${420 - 40 * h} Q${590 + 30 * h} 650 ${610 + 40 * h} 900 Q${600 + 30 * h} 1130 545 1280 Q${470 - 30 * h} 1120 ${462 - 40 * h} 900 Q${478 - 25 * h} 650 540 ${420 - 40 * h}Z`} fill="url(#g3-void)" />
        <path d={`M540 ${420 - 40 * h} Q${590 + 30 * h} 650 ${610 + 40 * h} 900 Q${600 + 30 * h} 1130 545 1280`} stroke="#6b4f36" strokeWidth={5} fill="none" />
        {/* splinters on the lips */}
        {[560, 700, 860, 1020].map((y, i) => <path key={i} d={`M${i % 2 ? 600 + 30 * h : 475 - 25 * h} ${y} l${i % 2 ? -26 : 26} 14 l${i % 2 ? 22 : -22} 10Z`} fill="#5a4230" />)}
        {/* golden hair caught on the bark */}
        {hairs.map((i) => {
          const x0 = 598 + 26 * h + (i % 3) * 5, y0 = 600 + i * 34;
          const s = sway * (5 + i * 3), k = (i % 2 ? 1 : -1) * (20 + i * 8);
          return <path key={i} d={`M${x0} ${y0} C${x0 + 60 + k} ${y0 + 90} ${x0 - 10 + s} ${y0 + 180} ${x0 + 30 + k * 0.6 + s} ${y0 + 260 + i * 20} S${x0 + 90 + s * 2} ${y0 + 380} ${x0 + 50 + k + s * 2.4} ${y0 + 440 + i * 14}`} stroke={i % 3 === 0 ? '#fff0b8' : '#e8c873'} strokeWidth={i % 3 === 0 ? 2.5 : 4.5} fill="none" strokeLinecap="round" opacity={0.95} />;
        })}
        <path d="M605 640 q-14 6 -20 22" stroke="#e8c873" strokeWidth={4} fill="none" />
        {/* ground + ferns */}
        <path d="M0 1440 Q300 1400 540 1420 Q800 1440 1080 1400 L1080 1920 L0 1920Z" fill="#16241c" />
        {[120, 230, 860, 960].map((x, i) => <path key={i} d={`M${x} 1440 q${i % 2 ? 40 : -40} -120 ${i % 2 ? 110 : -110} -150 M${x} 1440 q${i % 2 ? -10 : 10} -140 ${i % 2 ? 30 : -30} -200`} stroke="#22331f" strokeWidth={12} fill="none" strokeLinecap="round" />)}
      </svg>
      <BandImg id="graphic/fg" k={1.1} cam={{ zoom: 1.25, dx: 0, dy: 0 }} />
    </AbsoluteFill>
  );
};

/** shot 13 — end card / CTA: pines, a cow-tail silhouette motif, YES / NO on their words. */
export const S13: React.FC = () => {
  const { t, sec } = useShot();
  const cam: Cam = { zoom: 1, dx: 0, dy: 0 };
  const latest = sec - 0.5 - 0.3; // fully visible >= 0.5 s before the end (fade 0.3 s)
  const at = (re: RegExp, fb: number) => Math.min(wordAt(13, re, fb), latest);
  const q = ramp(t, at(/would/i, 0.05), at(/would/i, 0.05) + 0.3, EOUT);
  const c = ramp(t, at(/comment/i, 0.45), at(/comment/i, 0.45) + 0.3, EOUT);
  const y = ramp(t, at(/yes/i, 0.6), at(/yes/i, 0.6) + 0.3, EOUT);
  const n = ramp(t, at(/^no/i, 0.8), at(/^no/i, 0.8) + 0.3, EOUT);
  const tl = Math.sin(t * 2.2);
  return (
    <AbsoluteFill style={{ backgroundColor: '#2a2436' }}>
      <BandImg id="graphic/sky" k={0.3} cam={cam} />
      <BandImg id="graphic/pines" k={0.6} cam={cam} />
      <BandImg id="graphic/fg" k={1} cam={cam} />
      <svg viewBox="0 0 1080 1920" style={FULL}>
        <rect x={0} y={0} width={1080} height={1920} fill="#100c14" opacity={0.35} />
        {/* tail motif: the huldra seen from behind, far between the pines, her cow tail swaying */}
        <Glow id="g13-halo" cx={540} cy={1340} rx={260} ry={340} c="#fff1cc" o={0.4} />
        <HuldraSil x={520} y={1560} s={0.6} sway={t * 1.4} fill="#120f12" rim="#f3d9a4" tail={0.75 + 0.25 * tl} />
        <g opacity={q} transform={`translate(0 ${16 * (1 - q)})`}>
          <text x={540} y={560} textAnchor="middle" fontFamily={cinzel} fontSize={96} fill="#fff4d8" letterSpacing={4}>WOULD YOU</text>
          <text x={540} y={680} textAnchor="middle" fontFamily={cinzel} fontSize={96} fill="#fff4d8" letterSpacing={4}>FOLLOW HER?</text>
        </g>
        <g opacity={c}>
          <text x={540} y={860} textAnchor="middle" fontFamily={corm} fontStyle="italic" fontSize={80} fill="#f3d9a4">Comment</text>
        </g>
        <g opacity={y} transform={`translate(${330} ${1010}) scale(${0.9 + 0.1 * y})`}>
          <text x={0} y={0} textAnchor="middle" fontFamily={cinzel} fontSize={124} fill={GREEN}>YES</text>
        </g>
        <g opacity={c}><text x={540} y={1000} textAnchor="middle" fontFamily={corm} fontStyle="italic" fontSize={72} fill="#f3d9a4">or</text></g>
        <g opacity={n} transform={`translate(${750} ${1010}) scale(${0.9 + 0.1 * n})`}>
          <text x={0} y={0} textAnchor="middle" fontFamily={cinzel} fontSize={124} fill={GREEN}>NO</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
