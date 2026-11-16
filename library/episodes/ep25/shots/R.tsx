import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, handheld, ramp, EIO } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { RM, FLOOR_Y } from '../sets/room';

const at = (id: number, re: RegExp, fb: number, sec: number) => Math.min(0.95, wordAt(id, re, fb) / sec);
const fl = (t: number, s = 0) => 1 + Math.sin(t * 13 + s) * 0.04 + Math.sin(t * 7.3 + s * 2) * 0.05;

/** Candle with radial-gradient glow. */
const Candle: React.FC<{ x: number; y: number; t: number; id: string; s?: number; glow?: number }> = ({ x, y, t, id, s = 1, glow = 1 }) => {
  const f = fl(t);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <radialGradient id={`cg${id}`}>
          <stop offset="0" stopColor={RM.candle} stopOpacity={0.55 * glow} />
          <stop offset="0.4" stopColor="#ff9a3c" stopOpacity={0.18 * glow} />
          <stop offset="1" stopColor="#ff9a3c" stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={0} cy={-70} r={330 * f} fill={`url(#cg${id})`} />
      <rect x={-16} y={-60} width={32} height={70} rx={4} fill="#f1e2c4" />
      <rect x={-16} y={-60} width={10} height={70} fill="#fff6e2" opacity={0.7} />
      <ellipse cx={0} cy={10} rx={34} ry={9} fill="#8b6a46" />
      <path d={`M0 ${-62} Q${-10} ${-82} 0 ${-62 - 36 * f} Q${10} ${-82} 0 ${-62}Z`} fill={RM.candle} />
      <ellipse cx={0} cy={-72} rx={4} ry={8} fill="#fffbe8" />
    </g>
  );
};

/** Girl lying on her side under a blanket (world coords, head at x,y). */
const GirlLying: React.FC<{ x: number; y: number; breath: number }> = ({ x, y, breath }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-70} y={10} width={620} height={70} rx={24} fill="#d9ccb4" />
    <ellipse cx={-10} cy={6} rx={80} ry={30} fill="#efe4cf" />
    <ellipse cx={20} cy={-14} rx={40} ry={34} fill="#3a2418" />
    <path d={`M-20 -38 Q30 -60 66 -20 Q50 -10 30 -28 Q0 -20 -20 -38Z`} fill="#120c0a" />
    <path d={`M50 ${-6 - breath} Q260 ${-50 - breath} 520 ${-10} L540 60 Q280 70 60 50Z`} fill={RM.blanket} />
    <path d={`M50 ${-6 - breath} Q260 ${-50 - breath} 520 ${-10}`} fill="none" stroke="#ffcf8a" strokeWidth={5} opacity={0.75} />
    {[150, 260, 370].map((dx) => <path key={dx} d={`M${dx} ${-24 - breath} l30 20 l-30 20 l-30 -20Z`} fill={RM.blanket2} opacity={0.8} />)}
  </g>
);

const Night: React.FC<{ o: number }> = ({ o }) => <AbsoluteFill style={{ backgroundColor: '#0a1022', opacity: o }} />;

/** shot 4 — bed raised on bricks, slow push. */
export const S04: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1.18 + 0.12 * EIO(p), dx: 0, dy: -110 - 30 * p, ox: 520, oy: 1150 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#14161c' }}>
      <BandImg id="room/bg" k={0.6} cam={cam} />
      <Live k={0.8} cam={cam}><Candle x={990} y={1560} t={t} id="a" s={1.6} glow={1.3} /></Live>
      <BandImg id="room/bed" k={1} cam={cam} />
      <BandImg id="room/fg" k={1.3} cam={cam} />
    </AbsoluteFill>
  );
};

/** shot 5 — girl on the mattress on the floor beside the empty bed. */
export const S05: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1.25, dx: 0, dy: -380, ox: 500, oy: 1350 };
  const pull = ramp(p, at(5, /pulled/, 0.3, 6) - 0.05, at(5, /floor/, 0.65, 6), EIO);
  return (
    <AbsoluteFill style={{ backgroundColor: '#14161c' }}>
      <BandImg id="room/bg" k={0.6} cam={cam} />
      <Live k={0.8} cam={cam}><Candle x={1000} y={1580} t={t} id="b" s={1.5} glow={1.1} /></Live>
      <BandImg id="room/bed" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <g transform={`translate(${-120 * (1 - pull)} ${-60 * (1 - pull)})`} opacity={0.4 + 0.6 * pull}>
          <ellipse cx={560} cy={FLOOR_Y + 210} rx={360} ry={46} fill="#000" opacity={0.35} />
          <GirlLying x={300} y={FLOOR_Y + 120} breath={Math.sin(t * 2.2) * 4} />
        </g>
      </Live>
      <BandImg id="room/fg" k={1.3} cam={cam} />
    </AbsoluteFill>
  );
};

/** shot 6 — floor level in the dark, the gap under the high bed. */
export const S06: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1.9 + 0.12 * p, dx: 0, dy: -420, ox: 540, oy: 1300 };
  const run = ramp(p, at(6, /footsteps/, 0.4, 4.75) - 0.1, at(6, /Scratching/, 0.55, 4.75) + 0.05);
  const scr = ramp(p, at(6, /Scratching/, 0.55, 4.75), Math.min(1, at(6, /floor/, 0.8, 4.75) + 0.1));
  const sx = 900 - 520 * run;
  return (
    <AbsoluteFill style={{ backgroundColor: '#05070d' }}>
      <BandImg id="room/bg" k={0.7} cam={cam} />
      <BandImg id="room/bed" k={1} cam={cam} />
      <Night o={0.62} />
      <Live k={1} cam={cam}>
        <defs>
          <linearGradient id="r6moon" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#9fb8e8" stopOpacity={0.35} />
            <stop offset="1" stopColor="#9fb8e8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <path d={`M250 900 L380 880 L760 ${FLOOR_Y + 120} L420 ${FLOOR_Y + 140}Z`} fill="url(#r6moon)" />
        <rect x={360} y={FLOOR_Y - 6} width={420} height={4} fill="#9fb8e8" opacity={0.25} />
        {/* tiny shadow scurrying under the bed */}
        {run > 0 && run < 1 && (
          <g transform={`translate(${sx} ${FLOOR_Y - 4})`} opacity={Math.sin(run * Math.PI)}>
            <ellipse cx={0} cy={-26} rx={22} ry={26} fill="#020203" />
            <circle cx={-14} cy={-58} r={15} fill="#020203" />
            <path d={`M-6 -6 l${-10 + Math.sin(t * 30) * 8} 10 M8 -6 l${6 - Math.sin(t * 30) * 8} 10`} stroke="#020203" strokeWidth={6} />
          </g>
        )}
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M${520 + i * 16} ${FLOOR_Y + 20 + i * 4} l${60 * scr} ${-6 * scr}`} stroke="#c9d6f0" strokeWidth={3} opacity={0.55 * scr} />
        ))}
      </Live>
      <BandImg id="room/fg" k={1.3} cam={{ ...cam, zoom: 1.2 }} />
    </AbsoluteFill>
  );
};

/** shot 7 — close: the girl's face on the pillow, eyes wide open. */
export const S07: React.FC = () => {
  const { p, t } = useShot();
  const g = ramp(p, at(7, /giggled/, 0.25, 3.98), at(7, /giggled/, 0.25, 3.98) + 0.12);
  const ear = ramp(p, at(7, /ear/, 0.75, 3.98) - 0.15, at(7, /ear/, 0.75, 3.98));
  const cam: Cam = { zoom: 1, dx: 0, dy: 0 };
  const eyeR = 22 + 8 * g;
  return (
    <AbsoluteFill style={{ backgroundColor: '#070a14' }}>
      <Live cam={cam}>
        <defs>
          <radialGradient id="r7moon" cx="0.65" cy="0.35" r="0.6">
            <stop offset="0" stopColor="#2b3a5e" />
            <stop offset="1" stopColor="#070a14" />
          </radialGradient>
          <radialGradient id="r7skin" cx="0.6" cy="0.35" r="0.7">
            <stop offset="0" stopColor="#7a5440" />
            <stop offset="1" stopColor="#3a241a" />
          </radialGradient>
        </defs>
        <rect width={1296} height={2304} fill="url(#r7moon)" />
        {/* pillow */}
        <path d="M60 1250 Q200 1000 700 1020 Q1240 1040 1300 1300 L1300 1700 Q700 1640 60 1700Z" fill="#5d6680" />
        <path d="M60 1250 Q200 1000 700 1020 Q1240 1040 1300 1300" fill="none" stroke="#b9c8ea" strokeWidth={8} opacity={0.6} />
        {/* blanket at bottom */}
        <path d="M0 1560 Q600 1480 1296 1560 V2304 H0Z" fill="#3a1820" />
        <path d="M0 1560 Q600 1480 1296 1560" fill="none" stroke="#8fa0c8" strokeWidth={6} opacity={0.5} />
        {/* hair mass */}
        <path d="M300 1250 Q260 820 640 760 Q1020 760 1060 1100 Q1080 1300 980 1420 Q760 1300 620 1400 Q420 1420 300 1250Z" fill="#0d0908" />
        {/* face (lying on its side, profile turned to camera 3/4) */}
        <g transform="rotate(-12 680 1150)">
          <ellipse cx={680} cy={1150} rx={210} ry={250} fill="url(#r7skin)" />
          <path d="M470 1100 Q520 940 700 900 Q620 1000 560 1140Z" fill="#0d0908" />
          {/* eyes */}
          {[600, 780].map((ex, i) => (
            <g key={i}>
              <ellipse cx={ex} cy={1110} rx={44} ry={eyeR} fill="#e9e6df" />
              <circle cx={ex + 10 * (i ? 1 : 1) * g + 4} cy={1110} r={15} fill="#140d0a" />
              <circle cx={ex + 10 * g + 9} cy={1104} r={4} fill="#fff" />
              <path d={`M${ex - 50} ${1110 - eyeR - 4} Q${ex} ${1110 - eyeR - 22} ${ex + 50} ${1110 - eyeR - 4}`} fill="none" stroke="#1a100c" strokeWidth={8} />
            </g>
          ))}
          <path d="M690 1170 Q700 1230 680 1250" fill="none" stroke="#2a1812" strokeWidth={8} />
          <ellipse cx={690} cy={1320} rx={30 + 6 * g} ry={8 + 10 * g} fill="#2a1410" />
          <path d="M880 1000 Q905 1150 870 1300" fill="none" stroke="#a8bde6" strokeWidth={6} opacity={0.5} />
        </g>
        {/* small grey shape at her ear */}
        <g opacity={ear} transform={`translate(${1010 + 20 * (1 - ear)} 1060)`}>
          <ellipse cx={60} cy={0} rx={70} ry={90} fill="#030406" />
          {[0, 1, 2].map((i) => <path key={i} d={`M${10} ${-20 + i * 22} q-30 -4 -44 ${8 + i * 3}`} stroke="#8e8a83" strokeWidth={9} strokeLinecap="round" fill="none" />)}
        </g>
      </Live>
    </AbsoluteFill>
  );
};

/** Tapered segment (quad) from P to Q with widths w1 -> w2. */
const segD = (x1: number, y1: number, x2: number, y2: number, w1: number, w2: number) => {
  const dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
  return `M${x1 + nx * w1 / 2} ${y1 + ny * w1 / 2} L${x2 + nx * w2 / 2} ${y2 + ny * w2 / 2} L${x2 - nx * w2 / 2} ${y2 - ny * w2 / 2} L${x1 - nx * w1 / 2} ${y1 - ny * w1 / 2}Z`;
};

const HAND = '#857a6f', HAND_DK = '#4e463f', NAIL = '#2e2620', MOON = '#b8c8e6';

/** Bony finger: 3 phalanges, 2 visible knuckles, pointed nail. Grows up from (x,y), curls forward. */
const BonyFinger: React.FC<{ x: number; y: number; len: number; ang: number; curl: number }> = ({ x, y, len, ang, curl }) => {
  const L = [len * 0.46, len * 0.32 * (1 - 0.25 * curl), len * 0.24 * (1 - 0.4 * curl)];
  const W = [22, 18, 15, 11];
  const bend = [0, 22 * curl, 30 * curl];
  const pts: [number, number][] = [[x, y]];
  let a = ang;
  for (let i = 0; i < 3; i++) {
    a += bend[i] * Math.sign(ang + 90 || 1) * -0.4 + (i ? 4 * curl : 0);
    const r = (a * Math.PI) / 180, [px, py] = pts[i];
    pts.push([px + Math.cos(r) * L[i], py + Math.sin(r) * L[i]]);
  }
  const [tx, ty] = pts[3];
  const r = (a * Math.PI) / 180;
  return (
    <g>
      {[0, 1, 2].map((i) => <path key={i} d={segD(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], W[i], W[i + 1])} fill={HAND} />)}
      {[1, 2].map((i) => (
        <g key={i}>
          <ellipse cx={pts[i][0]} cy={pts[i][1]} rx={W[i] * 0.62} ry={W[i] * 0.5} fill={HAND} />
          <path d={`M${pts[i][0] - W[i] * 0.4} ${pts[i][1] + 2} q${W[i] * 0.4} -4 ${W[i] * 0.8} 0`} stroke={HAND_DK} strokeWidth={2.5} fill="none" />
        </g>
      ))}
      {/* pointed nail */}
      <path d={`M${tx - Math.sin(r) * 5 - Math.cos(r) * 10} ${ty + Math.cos(r) * 5 - Math.sin(r) * 10} L${tx + Math.cos(r) * 9} ${ty + Math.sin(r) * 9} L${tx + Math.sin(r) * 5 - Math.cos(r) * 10} ${ty - Math.cos(r) * 5 - Math.sin(r) * 10}Z`} fill={NAIL} />
      {/* moon rim on the left side */}
      <path d={`M${pts[0][0] - 10} ${pts[0][1]} L${pts[1][0] - 8} ${pts[1][1]} L${pts[2][0] - 7} ${pts[2][1]} L${tx - 4} ${ty}`} stroke={MOON} strokeWidth={2.5} fill="none" opacity={0.55} strokeLinejoin="round" />
    </g>
  );
};

/** shot 8 — a small bony grey-brown hand reaching up from the dark, curling over the blanket edge. */
export const S08: React.FC = () => {
  const { p, t } = useShot();
  const s = at(8, /fingers/, 0.4, 3.59);
  const rise = ramp(p, s - 0.3, s + 0.05);
  const curl = ramp(p, s, Math.min(1, s + 0.35));
  const cam: Cam = { zoom: 1 + 0.04 * p, dx: 0, dy: 0 };
  const EDGE = 1210, SIDE = 1300;
  const tap = Math.sin(t * 5) * 0.08 * curl;
  const hy = 330 * (1 - rise) - 55 * curl;
  return (
    <AbsoluteFill style={{ backgroundColor: '#05070d' }}>
      <Live cam={cam}>
        <defs>
          <pattern id="r8pat" width={220} height={160} patternUnits="userSpaceOnUse">
            <rect width={220} height={160} fill={RM.blanket} />
            <path d="M0 80 L110 15 L220 80 L110 145Z" fill={RM.blanket2} />
            <path d="M55 80 L110 48 L165 80 L110 112Z" fill="#2a1a2a" />
          </pattern>
          <radialGradient id="r8light" cx="0.5" cy="0.5" r="0.45">
            <stop offset="0" stopColor="#000" stopOpacity={0.15} />
            <stop offset="1" stopColor="#000" stopOpacity={0.85} />
          </radialGradient>
          <linearGradient id="r8side" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#a89c88" />
            <stop offset="1" stopColor="#6e6458" />
          </linearGradient>
          <linearGradient id="r8dark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#05070d" stopOpacity={0} />
            <stop offset="0.35" stopColor="#05070d" stopOpacity={0.85} />
            <stop offset="1" stopColor="#05070d" />
          </linearGradient>
          <linearGradient id="r8wrist" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={HAND} />
            <stop offset="1" stopColor={HAND_DK} stopOpacity={0} />
          </linearGradient>
        </defs>
        <rect width={1296} height={2304} fill="#07080e" />
        {/* blanket top surface + mattress side */}
        <path d={`M0 300 H1296 V${EDGE} Q648 ${EDGE - 20} 0 ${EDGE}Z`} fill="url(#r8pat)" />
        <path d={`M0 300 H1296 V${EDGE} Q648 ${EDGE - 20} 0 ${EDGE}Z`} fill="url(#r8light)" />
        <path d={`M0 ${EDGE} Q648 ${EDGE - 20} 1296 ${EDGE} V${SIDE} Q648 ${SIDE - 14} 0 ${SIDE}Z`} fill="url(#r8side)" />
        <path d={`M0 ${EDGE} Q648 ${EDGE - 20} 1296 ${EDGE}`} stroke="#ffcf8a" strokeWidth={5} fill="none" opacity={0.7} />
        <path d="M0 520 Q500 470 1296 560" fill="none" stroke="#000" strokeWidth={50} opacity={0.25} />
        {/* fingertip shadows on the blanket */}
        <ellipse cx={650} cy={EDGE - 30} rx={150} ry={30} fill="#000" opacity={0.4 * curl} />
        {/* the hand */}
        <g transform={`translate(0 ${hy})`} opacity={Math.min(1, rise * 1.5)}>
          <path d="M600 1640 Q590 1520 585 1440 L715 1440 Q705 1520 700 1640 Z" fill="url(#r8wrist)" />
          <path d="M572 1450 Q560 1350 590 1305 L720 1300 Q745 1360 722 1455 Q650 1475 572 1450Z" fill={HAND} />
          <path d="M600 1330 L640 1420 M650 1320 L660 1420 M700 1320 L685 1415" stroke={HAND_DK} strokeWidth={4} opacity={0.6} />
          <path d="M572 1450 Q560 1350 590 1305" stroke={MOON} strokeWidth={3} fill="none" opacity={0.5} />
          {[[598, -100, 165], [638, -93, 190], [678, -86, 180], [716, -78, 140]].map(([fx, fa, fl2], i) => (
            <BonyFinger key={i} x={fx} y={1312} len={fl2} ang={fa} curl={Math.min(1, curl + (i % 2 ? tap : -tap))} />
          ))}
        </g>
        {/* darkness below the mattress swallows the wrist */}
        <rect x={0} y={1480} width={1296} height={824} fill="url(#r8dark)" />
      </Live>
    </AbsoluteFill>
  );
};

/** Grandmother silhouette with headwrap and shawl, holding a candle (feet at x,y). */
const Grandma: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M-80 0 Q-90 -200 -70 -300 L70 -300 Q90 -200 90 0Z" fill="#1c1a24" />
    <path d="M-95 -280 Q-110 -380 -40 -420 L40 -420 Q110 -380 100 -270 Q0 -240 -95 -280Z" fill="#3a2e4a" />
    <ellipse cx={0} cy={-450} rx={38} ry={44} fill="#4a2e22" />
    <path d="M-46 -470 Q-50 -540 0 -548 Q56 -546 52 -470 Q30 -490 0 -488 Q-26 -490 -46 -470Z" fill="#8a3b2a" />
    <path d="M30 -520 q34 -20 26 20" fill="#8a3b2a" />
    <path d="M-60 -360 Q-130 -300 -120 -250" fill="none" stroke="#3a2e4a" strokeWidth={34} strokeLinecap="round" />
    <path d="M-38 -440 Q-46 -420 -30 -404" fill="none" stroke="#ffc76b" strokeWidth={5} opacity={0.8} />
    <path d="M-95 -280 Q-110 -380 -40 -420" fill="none" stroke="#ffc76b" strokeWidth={5} opacity={0.7} />
    <Candle x={-125} y={-215} t={t} id="g" s={0.8} glow={1.4} />
  </g>
);

/** shot 9 — grandmother with a candle, the girl sitting up; handheld. */
export const S09: React.FC = () => {
  const { p, t } = useShot();
  const h = handheld(t, 1.2);
  const run = ramp(p, at(9, /Grandma/, 0.2, 5.52), at(9, /candle/, 0.5, 5.52));
  const cam: Cam = { zoom: 1.35, dx: 0, dy: -330, tx: h.hx, ty: h.hy, rot: h.hr, ox: 700, oy: 1300 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#05070d' }}>
      <BandImg id="room/bg" k={0.7} cam={cam} />
      <BandImg id="room/bed" k={1} cam={cam} />
      <Night o={0.55 - 0.25 * run} />
      <Live k={1} cam={cam}>
        {/* girl sitting up on the floor mattress */}
        <rect x={250} y={FLOOR_Y + 130} width={520} height={60} rx={22} fill="#b9ab94" />
        <path d={`M300 ${FLOOR_Y + 140} Q500 ${FLOOR_Y + 90} 720 ${FLOOR_Y + 140} V${FLOOR_Y + 190} H300Z`} fill={RM.blanket} />
        <g transform={`translate(380 ${FLOOR_Y + 140})`}>
          <path d="M-50 0 Q-60 -110 -30 -160 L40 -160 Q60 -110 50 0Z" fill="#d8c9b6" />
          <path d="M40 -150 Q70 -110 90 -80" stroke="#d8c9b6" strokeWidth={24} strokeLinecap="round" fill="none" />
          <ellipse cx={8} cy={-200} rx={34} ry={38} fill="#4a2e22" />
          <path d="M-30 -210 Q-20 -250 20 -246 Q48 -236 40 -200 Q20 -225 -30 -210Z" fill="#120c0a" />
          <path d="M40 -230 Q46 -200 36 -176" fill="none" stroke="#ffc76b" strokeWidth={5} opacity={run} />
        </g>
        <g transform={`translate(${960 + 140 * (1 - run)} ${FLOOR_Y + 30})`} opacity={Math.min(1, run * 2)}>
          <Grandma x={0} y={0} t={t} />
        </g>
      </Live>
      <BandImg id="room/fg" k={1.3} cam={cam} />
    </AbsoluteFill>
  );
};

/** One tiny muddy footprint. */
const Print: React.FC<{ x: number; y: number; r: number; o: number; s?: number; left?: boolean }> = ({ x, y, r, o, s = 1, left }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s * (left ? -1 : 1)} ${s})`} opacity={o}>
    <path d="M-13 24 Q-22 0 -14 -16 Q0 -30 14 -16 Q20 0 12 24 Q0 34 -13 24Z" fill="#1e140c" />
    {[[-14, -30, 8], [-2, -37, 8], [10, -35, 7], [19, -27, 6]].map(([cx, cy, rr], i) => <circle key={i} cx={cx} cy={cy} r={rr} fill="#1e140c" />)}
    <path d="M-11 20 Q-17 0 -9 -14" fill="none" stroke="#c79a62" strokeWidth={4} opacity={0.8} />
  </g>
);

/** shot 10 — trail of tiny muddy footprints to the gap under the door. */
export const S10: React.FC = () => {
  const { p } = useShot();
  const cam: Cam = { zoom: 1 + 0.15 * EIO(p), dx: 0, dy: -40 * EIO(p), ox: 600, oy: 600 };
  const show = ramp(p, at(10, /footprints/, 0.35, 5.13) - 0.25, at(10, /door/, 0.8, 5.13) - 0.05, (x) => x);
  const N = 9;
  const path = (u: number) => ({ x: 380 + 440 * u + 110 * Math.sin(u * Math.PI * 2.2), y: 1400 - 590 * u });
  const pts = Array.from({ length: N }, (_, i) => {
    const u = i / (N - 1), a = path(u), b = path(Math.min(1, u + 0.02)), c = path(Math.max(0, u - 0.02));
    const dx = b.x - c.x, dy = b.y - c.y, l = Math.hypot(dx, dy), side = i % 2 ? 1 : -1;
    const r = (Math.atan2(dx, -dy) * 180) / Math.PI;
    return { x: a.x + (-dy / l) * 16 * side, y: a.y + (dx / l) * 16 * side, r, s: 0.95 - 0.35 * u, left: i % 2 === 0 };
  });
  return (
    <AbsoluteFill style={{ backgroundColor: '#05070d' }}>
      <Live cam={cam}>
        <defs>
          <linearGradient id="r10floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1a1c26" />
            <stop offset="0.5" stopColor="#4a3a2c" />
            <stop offset="1" stopColor="#6b4a34" />
          </linearGradient>
          <radialGradient id="r10gap" cx="0.5" cy="1" r="0.8">
            <stop offset="0" stopColor="#bcd0f5" stopOpacity={0.55} />
            <stop offset="1" stopColor="#bcd0f5" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="r10candle" cx="0.3" cy="1" r="0.7">
            <stop offset="0" stopColor="#ffc76b" stopOpacity={0.35} />
            <stop offset="1" stopColor="#ffc76b" stopOpacity={0} />
          </radialGradient>
        </defs>
        <rect width={1296} height={2304} fill="url(#r10floor)" />
        {/* door at the top */}
        <rect x={560} y={260} width={520} height={520} fill="#141826" />
        <rect x={540} y={240} width={20} height={560} fill="#2a1c12" />
        <rect x={1080} y={240} width={20} height={560} fill="#2a1c12" />
        <rect x={560} y={770} width={520} height={14} fill="#cfe0ff" />
        <ellipse cx={820} cy={800} rx={340} ry={110} fill="url(#r10gap)" />
        <rect x={0} y={1400} width={1296} height={904} fill="url(#r10candle)" />
        {/* floor cracks */}
        <path d="M100 1300 Q300 1250 420 1320 M900 1100 Q1050 1080 1200 1140" stroke="#20160f" strokeWidth={6} fill="none" opacity={0.6} />
        {pts.map((q, i) => (
          <Print key={i} x={q.x} y={q.y} r={q.r} s={q.s} left={q.left} o={ramp(show, i / N, (i + 1) / N, (x) => x)} />
        ))}
        {/* foreground dark edge (bed post / shadow) */}
        <path d="M0 2304 V1500 Q120 1700 200 2304Z" fill="#07090a" />
        <path d="M1296 300 V2304 H1220 Q1180 1300 1240 300Z" fill="#07090a" />
      </Live>
    </AbsoluteFill>
  );
};
