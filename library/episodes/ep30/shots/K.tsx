import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, handheld, ramp, EIO } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { FIRE, KH } from '../sets/camp';
import { DadStand, Sitter, Fire, KDefs, Orb } from '../art/camp_figs';

const BG = '#05070f';

/** shot 4 — wide camp: fire, ute, swags, dad and son sitting. Slow lateral track. */
export const S04: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1.4, dx: 60 - 120 * EIO(p), dy: -170, ox: 540, oy: 1250 };
  const fgCam: Cam = { ...cam, dx: cam.dx * 1.6 };
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="camp/night" cam={cam} />
      <Live cam={cam}>
        <KDefs />
        <Fire x={FIRE.x} y={FIRE.y} t={t} s={0.9} />
        <Sitter x={430} y={1560} s={0.8} dir={1} />
        <Sitter x={790} y={1570} s={0.62} dir={-1} child />
      </Live>
      <BandImg id="camp/fg" cam={fgCam} />
    </AbsoluteFill>
  );
};

/** shot 6 — dad standing by the fire, staring at a cold dot far out. Locked. */
export const S06: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1.45, dx: 0, dy: 0, ox: 540, oy: 1500 };
  const dot = ramp(p, 0.0, 0.25);
  const blink = 0.85 + 0.15 * Math.sin(t * 2.3);
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="camp/night" cam={cam} />
      <Live cam={cam}>
        <KDefs />
        <Orb x={380} y={KH - 30} r={16} op={dot * blink} />
        <Fire x={FIRE.x} y={FIRE.y} t={t} s={0.9} />
        <DadStand x={800} y={1560} s={0.95} side={-1} face="#3a5868" />
      </Live>
      <BandImg id="camp/fg" cam={cam} />
    </AbsoluteFill>
  );
};

/** shot 8 — from behind: dad walking away from camp toward the light. */
export const S08: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1.8 + 0.15 * p, dx: 0, dy: 0, tx: 200, ox: 100, oy: 900 };
  const walk = ramp(p, 0.08, 1, (x) => x);
  const fy = 1360 - 110 * walk, s = 0.56 - 0.14 * walk;
  const step = Math.sin(t * 3.2) * Math.min(1, walk * 6);
  const pulse = 0.9 + 0.1 * Math.sin(t * 1.7);
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="camp/night" cam={cam} />
      <Live cam={cam}>
        <KDefs />
        <Orb x={540} y={930 - 10 * Math.sin(t * 0.9)} r={30} op={pulse} />
        <ellipse cx={440} cy={KH + 40} rx={260} ry={30} fill="url(#kCold)" />
        <Fire x={160} y={1580} t={t} s={0.8} />
        <DadStand x={430} y={fy} s={s} side={1} rim="#7fe3ff" step={step} />
        <DadStand x={430} y={fy} s={s} side={-1} rim="#ff9b4a" step={step} fill="none" />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 9 — close: the boy's hand grabs dad's big cold hand. Handheld. */
export const S09: React.FC = () => {
  const { t, sec } = useShot();
  const g = ramp(t, wordAt(9, /grabbed/i, 0.1) - 0.2, wordAt(9, /hand/i, 0.35) + 0.1);
  const cold = ramp(t, wordAt(9, /ice/i, 0.7) - 0.3, Math.min(sec, wordAt(9, /cold/i, 0.85) + 0.4));
  const { hx, hy, hr } = handheld(t, 1.4);
  const cam: Cam = { zoom: 1, dx: 0, dy: 0, tx: hx, ty: hy, rot: hr };
  const bx = -160 * (1 - g);
  return (
    <AbsoluteFill style={{ backgroundColor: '#07080f' }}>
      <Live cam={cam}>
        <defs>
          <radialGradient id="k9Cold" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#7fe3ff" stopOpacity="0.5" /><stop offset="1" stopColor="#7fe3ff" stopOpacity="0" /></radialGradient>
          <radialGradient id="k9Warm" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ff9b4a" stopOpacity="0.4" /><stop offset="1" stopColor="#ff9b4a" stopOpacity="0" /></radialGradient>
          <linearGradient id="k9Skin" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#4a3a44" /><stop offset="1" stopColor="#9fb8c8" /></linearGradient>
          <linearGradient id="k9Boy" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#5a3628" /><stop offset="1" stopColor="#b07a5c" /></linearGradient>
        </defs>
        {/* background: cold glow top-right, warm fire bokeh bottom-left */}
        <circle cx={1000} cy={600} r={700} fill="url(#k9Cold)" />
        <circle cx={250} cy={1900} r={500} fill="url(#k9Warm)" />
        {[[200, 1700, 60], [360, 1820, 40], [120, 1980, 50]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#ff9b4a" opacity={0.18} />)}
        {/* dad: flannel sleeve from top right, big hand hanging down */}
        <g transform="translate(700,700) rotate(14)">
          <path d="M -120 -700 L 120 -700 L 110 -30 L -110 -30 Z" fill="#3a1e22" />
          {[-80, -20, 40].map((x) => <rect key={x} x={x} y={-700} width={22} height={670} fill="#5a2a2c" opacity={0.6} />)}
          <rect x={-120} y={-260} width={240} height={20} fill="#5a2a2c" opacity={0.6} />
          <rect x={-115} y={-40} width={230} height={36} rx={10} fill="#2a1418" />
          {/* palm + fingers pointing down */}
          <path d="M -90 -10 Q -100 120 -86 230 L 96 230 Q 104 120 90 -10 Z" fill="url(#k9Skin)" />
          {[-70, -24, 22, 66].map((x, i) => <rect key={x} x={x - 20} y={200} width={42} height={[170, 200, 190, 150][i]} rx={21} fill="url(#k9Skin)" />)}
          <path d="M -88 30 Q -150 100 -140 190 Q -128 214 -104 196 Q -100 130 -70 90 Z" fill="url(#k9Skin)" />
          <path d="M 92 -6 Q 104 120 96 230 M 88 210 L 88 350" stroke="#e9fbff" strokeWidth={6} fill="none" opacity={0.7 + 0.3 * cold} />
        </g>
        {/* boy: small sleeve from bottom left, hand wrapping dad's palm */}
        <g transform={`translate(${bx},0)`}>
          <path d="M -100 1500 Q 200 1300 470 1060 L 560 1150 Q 300 1420 40 1640 Z" fill="#2d3550" />
          <rect x={470} y={1030} width={40} height={140} rx={14} transform="rotate(42 490 1100)" fill="#20283c" />
          <path d="M 520 950 Q 560 920 640 930 L 720 960 L 720 1060 Q 640 1110 560 1100 Q 500 1060 520 950 Z" fill="url(#k9Boy)" />
          {[0, 1, 2, 3].map((i) => <rect key={i} x={640 + i * 4} y={930 + i * 44 - 6} width={170 - i * 16 - 70 * (1 - g)} height={38} rx={19} fill="url(#k9Boy)" />)}
          {[0, 1, 2, 3].map((i) => <path key={'r' + i} d={`M ${650 + i * 4} ${928 + i * 44 - 6} L ${800 - i * 16 - 70 * (1 - g)} ${928 + i * 44 - 6}`} stroke="#7fe3ff" strokeWidth={3} opacity={0.6} />)}
        </g>
        {/* frost: cold creeping light + crystals on "ice cold" */}
        <circle cx={720} cy={1000} r={340} fill="url(#k9Cold)" opacity={0.4 + 0.6 * cold} />
        {[[640, 900], [790, 1000], [700, 1120], [850, 880], [600, 1060], [760, 820]].map(([x, y], i) => {
          const o = ramp(cold, i * 0.1, i * 0.1 + 0.4);
          return <path key={i} d={`M ${x - 12} ${y} L ${x + 12} ${y} M ${x} ${y - 12} L ${x} ${y + 12} M ${x - 8} ${y - 8} L ${x + 8} ${y + 8} M ${x - 8} ${y + 8} L ${x + 8} ${y - 8}`} stroke="#e9fbff" strokeWidth={2.5} opacity={o} />;
        })}
      </Live>
    </AbsoluteFill>
  );
};

/** shot 11 — sunrise over the camp, father and son by the dead fire. Slow pull-back. */
export const S11: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1.3 - 0.25 * EIO(p), dx: 0, dy: -260, ox: 560, oy: 1250 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#1e2550' }}>
      <BandImg id="camp/dawn" cam={cam} />
      <Live cam={cam}>
        <KDefs />
        <Fire x={FIRE.x} y={FIRE.y} t={t} s={0.9} lit={0} />
        <path d={`M ${FIRE.x - 8} ${FIRE.y - 30} Q ${FIRE.x + 20 * Math.sin(t)} ${FIRE.y - 160} ${FIRE.x - 10} ${FIRE.y - 300}`} stroke="#c9c2b2" strokeWidth={10} opacity={0.18} fill="none" />
        <Sitter x={430} y={1560} s={0.8} dir={1} rim="#ffd08a" fill="#1a0f10" />
        <Sitter x={790} y={1570} s={0.62} dir={-1} child rim="#ffd08a" fill="#1a0f10" />
      </Live>
      <BandImg id="camp/fg" cam={cam} />
    </AbsoluteFill>
  );
};

/** shot 12 — dad from behind at the house window at night, a tiny cold light far out. Slow push-in. */
export const S12: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1 + 0.16 * EIO(p), dx: 0, dy: 0, ox: 470, oy: 850 };
  const lightOn = ramp(t, wordAt(12, /light/i, 0.85) - 0.6, wordAt(12, /light/i, 0.85) + 0.4);
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="camp/house" cam={cam} />
      <Live cam={cam}>
        <KDefs />
        <Orb x={470} y={1018} r={12} op={(0.35 + 0.65 * lightOn) * (0.85 + 0.15 * Math.sin(t * 2))} />
        <circle cx={760} cy={800} r={330} fill="url(#kCold)" opacity={0.9} />
        <circle cx={470} cy={1018} r={220} fill="url(#kCold)" opacity={0.25 + 0.4 * lightOn} />
        <DadStand x={780} y={2200} s={2.6} side={-1} rim="#7fe3ff" fill="#06060a" rimOp={0.4} />
      </Live>
    </AbsoluteFill>
  );
};
