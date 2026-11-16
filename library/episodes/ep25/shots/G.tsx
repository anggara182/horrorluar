import React from 'react';
import { AbsoluteFill } from 'remotion';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { loadFont as loadOswald } from '@remotion/google-fonts/Oswald';
import { useShot, BandImg, Live, Cam, handheld, ramp, EIO, EOUT } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { GREEN } from '../comp/Overlays';
import { G_FLOOR, G_BED, G_CANDLE } from '../sets/graphic';
import { Footprint, TinyFingers } from '../art/graphic_bed';

const { fontFamily: cinzel } = loadCinzel('normal', { weights: ['700'], subsets: ['latin'] });
const { fontFamily: oswald } = loadOswald('normal', { weights: ['400', '700'], subsets: ['latin'] });

const FLAME = '#ffc76b';
const BEDCX = (G_BED.x0 + G_BED.x1) / 2;

/** Candle flame + warm glow (radial gradient, live flicker). */
const Flame: React.FC<{ t: number; id: string; glow?: number }> = ({ t, id, glow = 1 }) => {
  const fl = 0.85 + 0.1 * Math.sin(t * 11) + 0.05 * Math.sin(t * 23 + 1);
  const x = G_CANDLE.x, y = G_CANDLE.y;
  return (
    <g>
      <defs>
        <radialGradient id={`${id}-h`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={FLAME} stopOpacity={0.55} />
          <stop offset="0.4" stopColor="#e0873a" stopOpacity={0.18} />
          <stop offset="1" stopColor="#e0873a" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={x} cy={y - 20} rx={260 * fl * glow} ry={240 * fl * glow} fill={`url(#${id}-h)`} />
      <path d={`M ${x} ${y - 8} Q ${x - 13} ${y - 30} ${x + Math.sin(t * 7) * 3} ${y - 30 - 34 * fl} Q ${x + 13} ${y - 30} ${x} ${y - 8} Z`} fill={FLAME} />
      <ellipse cx={x} cy={y - 18} rx={4} ry={8} fill="#fff4d6" />
    </g>
  );
};

/** Two tiny glints of eyes in the dark (radial glow + pupils). */
const Eyes: React.FC<{ x: number; y: number; o: number; blink: number; id: string; s?: number }> = ({ x, y, o, blink, id, s = 1 }) => (
  <g opacity={o} transform={`translate(${x} ${y}) scale(${s})`}>
    <defs>
      <radialGradient id={`${id}-e`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#ffe9a8" stopOpacity={0.6} />
        <stop offset="1" stopColor="#ffe9a8" stopOpacity={0} />
      </radialGradient>
    </defs>
    {[-15, 15].map((dx) => (
      <g key={dx}>
        <ellipse cx={dx} cy={0} rx={22} ry={16} fill={`url(#${id}-e)`} />
        <ellipse cx={dx} cy={0} rx={6.5} ry={4.5 * blink} fill="#fff1c2" />
        <ellipse cx={dx + 1} cy={0} rx={2} ry={3.6 * blink} fill="#2a1a08" />
      </g>
    ))}
  </g>
);

/** shot 2 — title card: bed on bricks in moon + candle light, slow push. */
export const S02: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const a = ramp(p, 0.03, 0.28, EOUT);
  const b = ramp(p, 0.18, 0.42, EOUT);
  const tok = wordAt(2, /^tokoloshe/i, 0.4);
  const hh = handheld(t, 0.3);
  const cam: Cam = { zoom: 1.2 + 0.08 * z, dx: 0, dy: 0, tx: 70 + hh.hx, ty: -60 + hh.hy, oy: 1150 };
  const track = 0.16 - 0.06 * a;
  const eo = ramp(t, tok + 0.6, tok + 1.2) * 0.8;
  return (
    <AbsoluteFill style={{ backgroundColor: '#0b1120' }}>
      <BandImg id="graphic/room" cam={cam} />
      <Live cam={cam}>
        <Flame t={t} id="g2f" />
        <Eyes x={BEDCX + 60} y={G_FLOOR - 70} o={eo} blink={1} id="g2e" s={0.8} />
      </Live>
      <BandImg id="graphic/fg" k={1.3} cam={cam} />
      <AbsoluteFill style={{ alignItems: 'center', top: 230 }}>
        <div style={{ fontFamily: cinzel, fontWeight: 700, fontSize: 132, lineHeight: 1, color: '#f1ece2', letterSpacing: `${track}em`, marginRight: `-${track}em`, opacity: a, transform: `translateY(${(1 - a) * 24}px)`, whiteSpace: 'nowrap' }}>TOKOLOSHE</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 26, opacity: b }}>
          <div style={{ width: 120 * b, height: 3, background: `linear-gradient(90deg, rgba(124,198,254,0), ${GREEN})` }} />
          <div style={{ fontFamily: oswald, fontWeight: 400, fontSize: 44, letterSpacing: '0.3em', marginRight: '-0.3em', color: '#b9c6d8', whiteSpace: 'nowrap' }}>SOUTH AFRICA</div>
          <div style={{ width: 120 * b, height: 3, background: `linear-gradient(90deg, ${GREEN}, rgba(124,198,254,0))` }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** shot 3 — lore: push into the dark gap under the bed; two tiny eyes, small grey fingers, then they vanish. */
export const S03: React.FC = () => {
  const { p, t, sec } = useShot();
  const z = EIO(p);
  const tShort = wordAt(3, /^short/i, 0.25);
  const tHides = wordAt(3, /^hides/i, 0.5);
  const tInv = wordAt(3, /^invisible/i, 0.88);
  const hh = handheld(t, 0.35);
  // gap centre world (650,1460) -> frame (542,1268); push in and lift it to frame ~ 820
  const cam: Cam = { zoom: 1.9 + 0.35 * z, dx: 0, dy: 0, tx: hh.hx, ty: -440 + hh.hy, ox: 542, oy: 1268 };
  const eyesIn = ramp(t, 0.25, 0.9);
  const eyesOut = 1 - ramp(t, tInv + 0.05, tInv + 0.45);
  const blinkPh = (t * 1.0) % 3.1;
  const blink = blinkPh > 2.95 ? 0.15 : 1;
  const fing = ramp(t, tHides, tHides + 0.5) * eyesOut;
  const shadow = ramp(t, tShort, tShort + 0.6) * eyesOut;
  const ex = BEDCX + 40 + 30 * ramp(t, 0, sec, EIO);
  return (
    <AbsoluteFill style={{ backgroundColor: '#0b1120' }}>
      <BandImg id="graphic/room" cam={cam} />
      <Live cam={cam}>
        <Flame t={t} id="g3f" />
        <defs>
          <radialGradient id="g3-pool" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#9fc4ea" stopOpacity={0.16} />
            <stop offset="1" stopColor="#9fc4ea" stopOpacity={0} />
          </radialGradient>
        </defs>
        <ellipse cx={BEDCX + 60} cy={G_FLOOR + 50} rx={300} ry={70} fill="url(#g3-pool)" />
        {/* short shadow: child-high silhouette, a shade lighter than the black gap */}
        <g opacity={0.9 * shadow}>
          <ellipse cx={ex - 4} cy={G_FLOOR - 80} rx={34} ry={30} fill="#171b27" />
          <path d={`M ${ex - 44} ${G_FLOOR} Q ${ex - 46} ${G_FLOOR - 50} ${ex - 18} ${G_FLOOR - 56} L ${ex + 18} ${G_FLOOR - 56} Q ${ex + 46} ${G_FLOOR - 50} ${ex + 44} ${G_FLOOR} Z`} fill="#171b27" />
        </g>
        <Eyes x={ex} y={G_FLOOR - 86} o={eyesIn * eyesOut} blink={blink} id="g3e" s={0.55} />
        <TinyFingers x={BEDCX + 150} y={G_FLOOR - 12} s={1.0} o={fing} />
      </Live>
      <BandImg id="graphic/fg" k={1.2} cam={{ ...cam, zoom: 1.3 + 0.1 * z, ty: hh.hy }} />
    </AbsoluteFill>
  );
};

/** shot 13 — CTA: bed on bricks, tiny muddy footprints leaving the dark, question + YES / NO. */
export const S13: React.FC = () => {
  const { p, t, sec } = useShot();
  const cap = Math.max(0.2, sec - 0.7);
  const tq = Math.min(wordAt(13, /^Would/i, 0.06), cap);
  const tc = Math.min(wordAt(13, /^Comment/i, 0.6), cap);
  const ty = Math.min(wordAt(13, /^YES/i, 0.68), cap);
  const tn = Math.min(wordAt(13, /^NO/, 0.84), cap);
  const cam: Cam = { zoom: 1.16, dx: 0, dy: 0, tx: 60, ty: -10, oy: 1150 };
  const q = ramp(t, tq, tq + 0.4, EOUT);
  const c = ramp(t, tc, tc + 0.35, EOUT);
  const y = ramp(t, ty, ty + 0.3, EOUT);
  const n = ramp(t, tn, tn + 0.3, EOUT);
  const steps = 7;
  return (
    <AbsoluteFill style={{ backgroundColor: '#0b1120' }}>
      <BandImg id="graphic/room" cam={cam} />
      <Live cam={cam}>
        <Flame t={t} id="g13f" />
        {Array.from({ length: steps }, (_, i) => {
          const at = 0.08 + i * 0.07;
          const o = ramp(p, at, at + 0.04);
          const fx = BEDCX + 60 + i * 66;
          const fy = G_FLOOR + 40 + i * 16 + (i % 2 ? 20 : -6);
          return <Footprint key={i} x={fx} y={fy} s={1.7} rot={70} o={o} fill="#9a7650" />;
        })}
      </Live>
      <BandImg id="graphic/fg" k={1.2} cam={cam} />
      <AbsoluteFill style={{ alignItems: 'center', top: 210 }}>
        <div style={{ width: 920, textAlign: 'center', fontFamily: oswald, fontWeight: 700, fontSize: 92, lineHeight: 1.08, color: '#f1ece2', opacity: q, transform: `translateY(${(1 - q) * 20}px)` }}>
          WOULD YOU SLEEP<br />ON THE <span style={{ color: GREEN }}>FLOOR?</span>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: 'center', top: 1540 }}>
        <div style={{ fontFamily: oswald, fontWeight: 400, fontSize: 50, letterSpacing: '0.24em', marginRight: '-0.24em', color: '#c9d3e2', opacity: c }}>COMMENT</div>
        <div style={{ display: 'flex', gap: 46, marginTop: 26, alignItems: 'center' }}>
          {[['YES', y], ['NO', n]].map(([s, v]) => (
            <div key={s as string} style={{ opacity: v as number, transform: `scale(${0.8 + 0.2 * (v as number)})`, fontFamily: oswald, fontWeight: 700, fontSize: 96, lineHeight: 1, padding: '18px 54px', borderRadius: 26, border: `5px solid ${GREEN}`, color: s === 'YES' ? '#0b1120' : GREEN, background: s === 'YES' ? GREEN : 'rgba(11,17,32,0.7)' }}>{s as string}</div>
          ))}
          <div style={{ display: 'none' }}>{p}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
