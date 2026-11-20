import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, handheld, ramp, EIO } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { ROOM } from '../sets/home';
import { Kid } from '../art/home_kid';

const BG = '#0c0806';
const SOCK = '#b33a3a';
const GIRL = '#8a5a3a';
const BOY = '#4d5a6a';
const EYE = '#ffd23f';

/** oil lamp on the table + its glow; flicker = opacity only */
const Lamp: React.FC<{ t: number; x?: number; y?: number; s?: number }> = ({ t, x = ROOM.lamp.x, y = ROOM.table, s = 1 }) => {
  const fl = 0.85 + 0.08 * Math.sin(t * 7.3) + 0.05 * Math.sin(t * 13.1);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <defs><radialGradient id="hLampG" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fff1c4" stopOpacity="0.9" /><stop offset="0.2" stopColor="#ffc76b" stopOpacity="0.45" /><stop offset="1" stopColor="#ffc76b" stopOpacity="0" /></radialGradient></defs>
      <ellipse cx={0} cy={-90} rx={260} ry={260} fill="url(#hLampG)" opacity={fl} />
      <path d="M -34 0 Q -40 -30 -20 -44 L 20 -44 Q 40 -30 34 0 Z" fill="#3a2414" />
      <path d="M -18 -44 Q -26 -100 0 -130 Q 26 -100 18 -44 Z" fill="#ffe6a6" opacity={0.35} />
      <path d={`M -6 -60 Q 0 ${-96 - 4 * Math.sin(t * 9)} 6 -60 Z`} fill="#fff1c4" />
    </g>
  );
};

/** wool skeins + spindle on the table */
const Wool: React.FC<{ y?: number }> = ({ y = ROOM.table }) => (
  <g>
    <ellipse cx={780} cy={y - 26} rx={70} ry={32} fill="#d8cbb4" />
    <ellipse cx={860} cy={y - 20} rx={50} ry={24} fill="#bfb19a" />
    <path d={`M 740 ${y - 40} Q 780 ${y - 56} 820 ${y - 40}`} stroke="#fff3dc" strokeWidth={5} fill="none" opacity={0.7} />
  </g>
);

/** big black cat face filling the window: head silhouette + two yellow eyes. g = gaze offset, o = eye opacity */
const CatAtWindow: React.FC<{ o: number; g?: number; blink?: number; head?: number }> = ({ o, g = 0, blink = 1, head = 1 }) => {
  const { win } = ROOM;
  const cx = win.x + win.w / 2, cy = win.y + win.h * 0.74;
  return (
    <g>
      <defs>
        <clipPath id="hWinClip"><rect x={win.x} y={win.y} width={win.w} height={win.h} /></clipPath>
        <radialGradient id="hEyeG" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={EYE} stopOpacity="0.7" /><stop offset="1" stopColor={EYE} stopOpacity="0" /></radialGradient>
      </defs>
      <g clipPath="url(#hWinClip)">
        <path d={`M ${cx - 165} ${win.y + win.h + 40} Q ${cx - 160} ${cy - 60} ${cx - 120} ${cy - 150} L ${cx - 110} ${cy - 260} L ${cx - 45} ${cy - 175} Q ${cx} ${cy - 190} ${cx + 45} ${cy - 175} L ${cx + 110} ${cy - 260} L ${cx + 120} ${cy - 150} Q ${cx + 160} ${cy - 60} ${cx + 165} ${win.y + win.h + 40} Z`} fill="#08080a" opacity={head} />
        <path d={`M ${cx - 120} ${cy - 150} L ${cx - 110} ${cy - 260} L ${cx - 45} ${cy - 175}`} stroke="#6fe3a6" strokeWidth={4} fill="none" opacity={0.5 * head} />
        <path d={`M ${cx + 45} ${cy - 175} L ${cx + 110} ${cy - 260} L ${cx + 120} ${cy - 150}`} stroke="#6fe3a6" strokeWidth={4} fill="none" opacity={0.5 * head} />
        {[-1, 1].map((sd) => (
          <g key={sd} opacity={o}>
            <ellipse cx={cx + sd * 58} cy={cy - 70} rx={60} ry={50} fill="url(#hEyeG)" />
            <ellipse cx={cx + sd * 58} cy={cy - 70} rx={26} ry={19 * blink} fill={EYE} />
            <ellipse cx={cx + sd * 58 + g * 11} cy={cy - 70} rx={5} ry={16 * blink} fill="#08080a" />
          </g>
        ))}
      </g>
    </g>
  );
};

const Room: React.FC<{ cam: Cam; t: number; children?: React.ReactNode; fg?: boolean; mid?: React.ReactNode }> = ({ cam, t, children, fg = true, mid }) => (
  <AbsoluteFill style={{ backgroundColor: BG }}>
    <BandImg id="home/room" k={1} cam={cam} />
    <Live k={1} cam={cam}>{mid}<Lamp t={t} />{children}</Live>
    {fg && <BandImg id="home/fg" k={1.2} cam={cam} />}
  </AbsoluteFill>
);

/** shot 4 — the family spinning wool: girl at the wheel, boy at the table, lamp light. Slow push. */
export const S04: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1.18 + 0.1 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: 520, oy: 1100 };
  return (
    <Room cam={cam} t={t} mid={<CatAtWindow o={0} head={0} />}>
      <Wool />
      <Kid x={430} y={1580} h={620} jumper={GIRL} hair="long" reach={0.35 + 0.08 * Math.sin(t * 2.2)} />
      <Kid x={760} y={1580} h={470} jumper={BOY} hair="short" phase={0} reach={0.2} />
    </Room>
  );
};

/** sleeping boy: arms folded on the table, head down on the wool. breath 0..1 */
const SleepingBoy: React.FC<{ breath: number }> = ({ breath }) => {
  const y = ROOM.table, b = breath * 5;
  return (
    <g transform="translate(0,0)">
      {/* hunched back seen from the side (he faces right, head on folded arms) */}
      <path d={`M 470 ${y + 240} Q 450 ${y + 40} 520 ${y - 70 - b} Q 600 ${y - 130 - b} 690 ${y - 60} L 700 ${y + 240} Z`} fill={BOY} />
      {/* folded arms on the table */}
      <path d={`M 600 ${y} Q 600 ${y - 56} 680 ${y - 58} L 860 ${y - 50} Q 890 ${y - 26} 860 ${y} Z`} fill={BOY} />
      <ellipse cx={866} cy={y - 26} rx={26} ry={22} fill="#c4906c" />
      {/* unfinished wool under his hand: loose skein + spindle */}
      <ellipse cx={880} cy={y - 12} rx={70} ry={20} fill="#d8cbb4" />
      <path d={`M 820 ${y - 20} Q 880 ${y - 36} 944 ${y - 18}`} stroke="#fff3dc" strokeWidth={4} fill="none" opacity={0.8} />
      <line x1={930} y1={y - 70} x2={960} y2={y + 4} stroke="#6a4a30" strokeWidth={7} strokeLinecap="round" />
      <path d={`M 940 ${y} Q 960 ${y + 90} 930 ${y + 200}`} stroke="#d8cbb4" strokeWidth={4} fill="none" />
      {/* head lying on the arms, face down/right */}
      <ellipse cx={740} cy={y - 96 - b * 0.5} rx={60} ry={50} fill="#1a1416" />
      <path d={`M 682 ${y - 100} Q 700 ${y - 156 - b} 770 ${y - 148 - b} Q 806 ${y - 130} 800 ${y - 100} Q 740 ${y - 120} 690 ${y - 80} Z`} fill="#120d0c" />
      {/* lamp rim from the left */}
      <path d={`M 690 ${y - 136 - b} Q 720 ${y - 156 - b} 770 ${y - 150 - b}`} stroke="#ffc76b" strokeWidth={5} fill="none" opacity={0.8} />
      <path d={`M 470 ${y + 200} Q 450 ${y + 40} 520 ${y - 70 - b} Q 580 ${y - 116 - b} 650 ${y - 100}`} stroke="#ffc76b" strokeWidth={5} fill="none" opacity={0.7} />
    </g>
  );
};

/** shot 5 — the little brother asleep over unfinished wool. Locked. */
export const S05: React.FC = () => {
  const { t } = useShot();
  const cam: Cam = { zoom: 1.75, dx: 0, dy: 0, ox: 600, oy: 1060 };
  return (
    <Room cam={cam} t={t} fg={false}>
      <SleepingBoy breath={0.5 + 0.5 * Math.sin(t * 1.6)} />
    </Room>
  );
};

/** red knitted sock, toe pointing right. (x,y) = cuff top-left */
const Sock: React.FC<{ x: number; y: number; s?: number; r?: number }> = ({ x, y, s = 1, r = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${r}) scale(${s})`}>
    <path d="M 0 0 L 110 0 L 110 230 Q 110 260 150 262 L 260 262 Q 300 270 296 320 Q 292 360 250 360 L 70 360 Q 0 360 0 290 Z" fill={SOCK} />
    {[20, 44, 68].map((yy) => <rect key={yy} x={0} y={yy} width={110} height={10} fill="#f0e4cc" opacity={0.85} />)}
    <path d="M 4 300 Q 20 352 70 356" stroke="#ff8a6a" strokeWidth={6} fill="none" opacity={0.6} />
    <path d="M 108 10 L 108 230" stroke="#ff8a6a" strokeWidth={5} opacity={0.5} />
  </g>
);

/** mitten hand + sleeve, pointing right; flip with dir=-1 */
const Arm: React.FC<{ x: number; y: number; dir: 1 | -1; sleeve: string; r?: number }> = ({ x, y, dir, sleeve, r = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${dir},1) rotate(${r})`}>
    <path d="M -700 -90 L -40 -70 L -40 70 L -700 110 Z" fill={sleeve} />
    <rect x={-60} y={-74} width={40} height={148} fill="#d8cbb4" opacity={0.8} />
    <path d="M -24 -58 Q 60 -70 110 -30 Q 130 0 110 30 Q 60 66 -24 56 Z" fill="#c4906c" />
    <path d="M 10 -58 Q 50 -100 80 -70 Q 70 -50 40 -40 Z" fill="#b5805e" />
    <path d="M -20 -60 Q 60 -74 108 -32" stroke="#ffd79a" strokeWidth={5} fill="none" opacity={0.8} />
  </g>
);

/** shot 6 — close: grandma's new red socks passed into his hands. Slow push-in. */
export const S06: React.FC = () => {
  const { p, t } = useShot();
  const give = ramp(t, wordAt(6, /^gave/i, 0.3) - 0.3, wordAt(6, /^socks/i, 0.6), EIO);
  const cam: Cam = { zoom: 1.05 + 0.12 * p, dx: 0, dy: 140, ox: 540, oy: 760 };
  const sx = 200 + 300 * give;
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <Live k={1} cam={cam}>
        <defs><radialGradient id="h6glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffc76b" stopOpacity="0.55" /><stop offset="0.6" stopColor="#8a4a22" stopOpacity="0.2" /><stop offset="1" stopColor="#8a4a22" stopOpacity="0" /></radialGradient></defs>
        <rect x={0} y={0} width={1296} height={2304} fill="#120c08" />
        <ellipse cx={640} cy={900} rx={760} ry={760} fill="url(#h6glow)" />
        <Lamp t={t} x={1000} y={760} s={1.1} />
        <rect x={0} y={1300} width={1296} height={1004} fill="#1a110b" />
        <rect x={0} y={1300} width={1296} height={8} fill="#c89060" opacity={0.4} />
        <Arm x={1000 - 60 * give} y={1180 - 30 * give} dir={-1} sleeve={BOY} r={-6} />
        <Arm x={sx + 150} y={1150} dir={1} sleeve={GIRL} r={-4} />
        <Sock x={sx} y={760} s={1} r={-6} />
        <Sock x={sx + 50} y={800} s={1} r={0} />
      </Live>
      <BandImg id="home/fg" k={1.2} cam={cam} />
    </AbsoluteFill>
  );
};

/** shot 8 — two huge yellow eyes outside the window, as high as the roof. Very slow push toward the window. */
export const S08: React.FC = () => {
  const { p, t } = useShot();
  const eyes = ramp(t, wordAt(8, /^eyes/i, 0.4) - 1.2, wordAt(8, /^eyes/i, 0.4) - 0.2, EIO);
  const cam: Cam = { zoom: 1.25 + 0.14 * ramp(p, 0, 1, EIO), dx: -120, dy: 0, ox: 820, oy: 600 };
  return (
    <Room cam={cam} t={t} mid={<CatAtWindow o={eyes} head={0.3 + 0.7 * eyes} />}>
      <Kid x={640} y={1560} h={560} jumper={GIRL} hair="long" />
      <Kid x={860} y={1560} h={420} jumper={BOY} hair="short" boot={SOCK} />
    </Room>
  );
};

/** shot 9 — close: the children frozen in the lamp light; the cat's eyes move over them. Locked. */
export const S09: React.FC = () => {
  const { t } = useShot();
  const a = wordAt(9, /^each/i, 0.25), b = wordAt(9, /^clothes/i, 0.55), c = wordAt(9, /^socks/i, 0.85);
  const g = -1 + 1.4 * ramp(t, a - 0.3, a + 0.4) + 0.4 * ramp(t, b - 0.3, b + 0.3) - 0.6 * ramp(t, c - 0.4, c + 0.2);
  const hh = handheld(t, 0.15);
  const cam: Cam = { zoom: 1.7, dx: -150, dy: 0, ox: 760, oy: 560, tx: hh.hx, ty: hh.hy };
  return (
    <Room cam={cam} t={t} fg={false} mid={<CatAtWindow o={1} g={g} />}>
      <Kid x={700} y={1400} h={620} jumper={GIRL} hair="long" />
      <Kid x={930} y={1400} h={470} jumper={BOY} hair="short" boot={SOCK} />
    </Room>
  );
};

/** shot 12 — close: knitting needles at night, a new red sock growing. Slow push-in. */
export const S12: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1 + 0.14 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: 540, oy: 820 };
  const k = Math.sin(t * 3.2) * 4;
  const eyes = ramp(t, wordAt(12, /^case/i, 0.85) - 0.2, wordAt(12, /^case/i, 0.85) + 0.5, EIO);
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <Live k={1} cam={cam}>
        <defs><radialGradient id="h12g" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffc76b" stopOpacity="0.5" /><stop offset="1" stopColor="#ffc76b" stopOpacity="0" /></radialGradient></defs>
        <rect x={0} y={0} width={1296} height={2304} fill="#0e0a08" />
        <ellipse cx={660} cy={1000} rx={700} ry={700} fill="url(#h12g)" />
        {/* window with aurora far behind */}
        <rect x={140} y={300} width={300} height={380} fill="#0b1d2e" />
        <path d="M 140 520 Q 260 400 440 460 L 440 560 Q 300 520 140 600 Z" fill="#6fe3a6" opacity={0.35} />
        <rect x={282} y={300} width={16} height={380} fill="#1c130d" />
        {/* far in the window: two small yellow eyes open on "case" */}
        <g opacity={eyes}>
          <path d="M 160 680 Q 165 590 195 560 L 200 505 L 245 545 Q 290 535 335 545 L 380 505 L 385 560 Q 415 590 420 680 Z" fill="#08080a" />
          <ellipse cx={240} cy={600} rx={13} ry={9} fill={EYE} />
          <ellipse cx={340} cy={600} rx={13} ry={9} fill={EYE} />
          <ellipse cx={240} cy={600} rx={3} ry={8} fill="#08080a" />
          <ellipse cx={340} cy={600} rx={3} ry={8} fill="#08080a" />
        </g>
        {/* candle */}
        <rect x={1000} y={760} width={50} height={200} fill="#efe2c6" />
        <path d={`M 1025 760 Q ${1012 + k} 720 1025 ${690 - k} Q ${1038 + k} 720 1025 760 Z`} fill="#ffc76b" />
        {/* yarn ball */}
        <circle cx={940} cy={1260} r={110} fill={SOCK} />
        <path d="M 850 1220 Q 940 1180 1030 1240 M 860 1290 Q 950 1250 1040 1300" stroke="#7a2222" strokeWidth={8} fill="none" />
        <path d="M 860 1210 Q 700 1120 640 1000" stroke={SOCK} strokeWidth={6} fill="none" />
        {/* sock in progress hanging from needles */}
        <g transform={`translate(560,900) rotate(${k * 0.3})`}>
          <path d="M -110 0 L 110 0 L 104 220 Q 60 300 -40 300 L -104 220 Z" fill={SOCK} />
          {[30, 70, 110, 150, 190].map((yy) => <path key={yy} d={`M -106 ${yy} Q 0 ${yy + 14} 106 ${yy}`} stroke="#7a2222" strokeWidth={5} fill="none" />)}
          <path d="M -108 6 L -104 220" stroke="#ff8a6a" strokeWidth={5} opacity={0.6} />
        </g>
        {/* needles */}
        <g strokeLinecap="round">
          <line x1={260} y1={780 + k} x2={900} y2={960 - k} stroke="#cfd6dc" strokeWidth={14} />
          <line x1={250} y1={1000 - k} x2={880} y2={820 + k} stroke="#b9c2c8" strokeWidth={14} />
          <line x1={300} y1={790 + k} x2={880} y2={954 - k} stroke="#ffffff" strokeWidth={3} opacity={0.7} />
        </g>
        {/* grandma's hands (old, simple mittens) */}
        <path d={`M -20 1040 L 260 ${960 - k} Q 330 ${950 - k} 330 ${1010 - k} Q 320 1070 250 1080 L -20 1180 Z`} fill="#a87a5c" />
        <path d={`M 1316 1000 L 920 ${930 + k} Q 850 ${920 + k} 850 ${980 + k} Q 860 1040 930 1050 L 1316 1150 Z`} fill="#a87a5c" />
        <path d={`M 260 ${960 - k} Q 330 ${950 - k} 330 ${1010 - k}`} stroke="#ffd79a" strokeWidth={5} fill="none" />
        <path d={`M 920 ${930 + k} Q 850 ${920 + k} 850 ${980 + k}`} stroke="#ffd79a" strokeWidth={5} fill="none" />
        <path d="M -20 1036 L 170 995 L 180 1125 L -20 1185 Z" fill="#2b3a4a" />
        <path d="M 1316 996 L 1110 955 L 1100 1085 L 1316 1155 Z" fill="#2b3a4a" />
      </Live>
      <BandImg id="home/fg" k={1.2} cam={cam} />
    </AbsoluteFill>
  );
};
