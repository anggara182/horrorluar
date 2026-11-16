import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, ramp, EIO, handheld, Cam } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { Yaga, YagaClose } from '../art/hut_yaga';
import { OVEN } from '../sets/hut';

const Flames: React.FC<{ x: number; y: number; s: number; t: number }> = ({ x, y, s, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <defs>
      <radialGradient id="fl-g" cx="0.5" cy="0.8" r="0.8">
        <stop offset="0" stopColor="#fff0c0" />
        <stop offset="0.4" stopColor="#ffa040" />
        <stop offset="1" stopColor="#ff6a20" stopOpacity="0" />
      </radialGradient>
    </defs>
    {[-50, -15, 20, 55].map((dx, i) => {
      const h = 70 + 30 * Math.sin(t * (5 + i) + i * 2);
      return <path key={i} d={`M${dx - 22} 0 Q${dx - 10 + Math.sin(t * 7 + i) * 8} ${-h * 0.6} ${dx + Math.sin(t * 6 + i) * 10} ${-h} Q${dx + 12} ${-h * 0.5} ${dx + 22} 0 Z`} fill="url(#fl-g)" />;
    })}
  </g>
);

const Pot: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => (
  <g transform={`translate(${x} ${y})`}>
    <defs>
      <linearGradient id="pot-g" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#0c0a0a" />
        <stop offset="0.6" stopColor="#24201e" />
        <stop offset="1" stopColor="#5a3a28" />
      </linearGradient>
      <radialGradient id="steam-g">
        <stop offset="0" stopColor="#e6d6c4" stopOpacity="0.35" />
        <stop offset="1" stopColor="#e6d6c4" stopOpacity="0" />
      </radialGradient>
    </defs>
    {[0, 1, 2].map((i) => {
      const ph = (t * 0.25 + i / 3) % 1;
      return <ellipse key={i} cx={Math.sin(ph * 6 + i) * 30} cy={-80 - ph * 360} rx={60 + ph * 80} ry={40 + ph * 50} fill="url(#steam-g)" opacity={Math.sin(ph * Math.PI)} />;
    })}
    <path d="M-120 -60 Q-140 60 -60 90 L60 90 Q140 60 120 -60 Z" fill="url(#pot-g)" />
    <ellipse cx="0" cy="-60" rx="124" ry="22" fill="#0a0808" />
    <ellipse cx="0" cy="-58" rx="108" ry="15" fill="#3a2a10" />
    <path d="M120 -60 Q140 60 60 90" stroke="#ffae66" strokeWidth="4" fill="none" />
    <path d="M-124 -60 Q0 -84 124 -60" stroke="#ffbe80" strokeWidth="3" fill="none" />
  </g>
);

/** shot 9 — medium: Baba Yaga stirs the pot by the glowing oven; slow push, smile at "smiled". */
export const S09: React.FC = () => {
  const { p, t, sec } = useShot();
  const smileAt = Math.min(0.9, wordAt(9, /smiled/i, 0.88) / sec);
  const teethAt = Math.min(0.7, wordAt(9, /teeth/i, 0.5) / sec);
  const smile = ramp(p, smileAt - 0.04, smileAt + 0.06);
  const glint = Math.max(ramp(p, teethAt, teethAt + 0.05) * (1 - ramp(p, teethAt + 0.1, teethAt + 0.2)), smile);
  const h = handheld(t, 0.5);
  const cam: Cam = { zoom: 1 + 0.12 * EIO(p), dx: 0, dy: 0, tx: h.hx, ty: h.hy, ox: 560, oy: 820 };
  const fl = 0.85 + 0.15 * Math.sin(t * 9) * Math.sin(t * 3.3);
  return (
    <AbsoluteFill style={{ backgroundColor: '#0c0907' }}>
      <BandImg id="hut/backsoft" k={0.8} cam={cam} />
      <Live k={0.8} cam={cam}>
        <defs>
          <radialGradient id="s9-fl" cx={OVEN.x} cy={OVEN.y + 60} r="360" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ffc070" stopOpacity="0.5" />
            <stop offset="1" stopColor="#ff8a3d" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={OVEN.x} cy={OVEN.y + 60} r="360" fill="url(#s9-fl)" opacity={fl} />
        <Flames x={OVEN.x} y={1170} s={1.2} t={t} />
      </Live>
      <Live k={1} cam={cam}>
        <defs>
          <radialGradient id="s9-halo">
            <stop offset="0" stopColor="#ffb866" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ff8a3d" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={700} cy={920} r={240} fill="url(#s9-halo)" opacity={fl} />
        <Yaga x={590} y={1570} s={1.75} stir={t * 2.4} smile={smile} glint={glint} id="y9" />
        {/* hearth fire under pot + pot */}
        <Flames x={890} y={1560} s={0.9} t={t + 1} />
        <Pot x={890} y={1470} t={t} />
        <rect x={700} y={1560} width={400} height={30} fill="#1a110c" />
      </Live>
      <BandImg id="hut/fg" k={1.25} cam={cam} />
    </AbsoluteFill>
  );
};

/** shot 10 — close profile in firelight; very slow push, smile grows on "way home". */
export const S10: React.FC = () => {
  const { p, t, sec } = useShot();
  const nicely = Math.min(0.5, wordAt(10, /nicely/i, 0.2) / sec);
  const home = Math.min(0.88, wordAt(10, /home/i, 0.85) / sec);
  const smile = 0.25 + 0.35 * ramp(p, nicely, nicely + 0.1) + 0.4 * ramp(p, home - 0.08, home + 0.04);
  const glint = ramp(p, home - 0.02, home + 0.06) * (1 - 0.5 * ramp(p, home + 0.08, 1));
  const bp = (p * 3.3) % 1;
  const blink = bp > 0.6 && bp < 0.66 ? Math.sin(((bp - 0.6) / 0.06) * Math.PI) : 0;
  const h = handheld(t, 0.35);
  const cam: Cam = { zoom: 1.9 + 0.1 * EIO(p), dx: 0, dy: 0, tx: h.hx, ty: h.hy, ox: 600, oy: 760 };
  const camFace: Cam = { zoom: 1 + 0.06 * EIO(p), dx: 0, dy: 0, tx: h.hx, ty: h.hy, ox: 540, oy: 760 };
  const fl = 0.8 + 0.2 * Math.sin(t * 8) * Math.sin(t * 2.9 + 1);
  return (
    <AbsoluteFill style={{ backgroundColor: '#0c0907' }}>
      <BandImg id="hut/backsoft" k={1} cam={cam} />
      <Live k={1} cam={camFace}>
        <defs>
          <radialGradient id="s10-warm" cx="1000" cy="900" r="700" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ff9a48" stopOpacity="0.45" />
            <stop offset="1" stopColor="#ff8a3d" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1296" height="2304" fill="url(#s10-warm)" opacity={fl} />
        <YagaClose x={560} y={980} s={1.45} smile={smile} glint={glint} blink={blink} hairT={t * 1.3} />
      </Live>
      <BandImg id="hut/fg" k={1.4} cam={camFace} />
    </AbsoluteFill>
  );
};
