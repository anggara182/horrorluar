import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, Live, Cam, BandImg, handheld, ramp, EIO } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { Frangi, Petal } from '../art/close_bits';
import { rng } from '../art/world';

const FW = 1080, FH = 1920;
const L: React.FC<{ cam: Cam; k?: number; children: React.ReactNode }> = ({ cam, k = 1, children }) => (
  <Live cam={cam} k={k} w={FW} h={FH}>{children}</Live>
);
const wp = (id: number, re: RegExp, fb: number, sec: number) => Math.min(1, Math.max(0, wordAt(id, re, fb) / sec));

/** shot 6 — rows of satay on glowing charcoal, smoke, the white dress blurred behind. */
export const S06: React.FC = () => {
  const { p, t } = useShot();
  const h = handheld(t, 0.06);
  const cam: Cam = { zoom: 1.28 + 0.03 * p, dx: 0, dy: 0, tx: h.hx, ty: h.hy - 60, ox: 540, oy: 1120 };
  const flick = 0.85 + 0.15 * Math.sin(t * 7.3) * Math.sin(t * 3.1 + 1);
  const r = rng(6);
  const sparks = Array.from({ length: 10 }, () => ({ x: 120 + r() * 840, ph: r(), sp: 0.25 + r() * 0.3 }));
  return (
    <AbsoluteFill style={{ backgroundColor: '#0d0b0c' }}>
      <BandImg id="close/night" k={0.3} cam={cam} />
      <BandImg id="close/dress" k={0.5} cam={cam} style={{ opacity: 0.7 }} />
      <L cam={cam} k={1}>
        <defs>
          <radialGradient id="c6coal" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffd27a" /><stop offset="0.35" stopColor="#ff7a2f" /><stop offset="1" stopColor="#5a1a0a" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="c6smoke" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#d8cfc4" stopOpacity={0.4} /><stop offset="1" stopColor="#d8cfc4" stopOpacity={0} />
          </radialGradient>
          <linearGradient id="c6tray" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3a2a20" /><stop offset="1" stopColor="#0c0907" />
          </linearGradient>
        </defs>
        {/* smoke rising behind skewers */}
        {[0, 1, 2, 3, 4].map((i) => {
          const q = (t * 0.12 + i / 5) % 1;
          return <ellipse key={i} cx={260 + i * 150 + Math.sin(t * 0.8 + i) * 40 + q * 60} cy={1000 - q * 720} rx={110 + q * 160} ry={90 + q * 120} fill="url(#c6smoke)" opacity={(1 - q) * 0.9} />;
        })}
        {/* grill trough */}
        <path d="M-60,1060 L1140,1040 L1100,1330 L-20,1350 Z" fill="url(#c6tray)" />
        <ellipse cx={540} cy={1062} rx={640} ry={70} fill="url(#c6coal)" opacity={flick} />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <ellipse key={i} cx={80 + i * 150} cy={1066 + (i % 2) * 8} rx={58} ry={18} fill={i % 2 ? '#ff9a45' : '#d8501e'} opacity={0.8 * flick} />
        ))}
        {/* skewers: sticks + meat chunks, underside lit by coals */}
        {Array.from({ length: 9 }, (_, i) => {
          const x = 20 + i * 112, y0 = 1110 - (i % 3) * 6;
          return (
            <g key={i} transform={`rotate(-34 ${x} ${y0})`}>
              <line x1={x - 40} y1={y0} x2={x + 330} y2={y0} stroke="#c9a77a" strokeWidth={6} strokeLinecap="round" />
              {[0, 1, 2, 3].map((j) => (
                <g key={j}>
                  <rect x={x + j * 46} y={y0 - 20} width={40} height={40} rx={13} fill="#4a2515" />
                  <path d={`M${x + j * 46 + 4},${y0 + 14} Q${x + j * 46 + 20},${y0 + 24} ${x + j * 46 + 36},${y0 + 14}`} stroke="#ff9a45" strokeWidth={5} fill="none" opacity={0.75 * flick} />
                  <ellipse cx={x + j * 46 + 14} cy={y0 - 8} rx={8} ry={4} fill="#9a5a2e" opacity={0.6} />
                </g>
              ))}
            </g>
          );
        })}
        {/* sparks */}
        {sparks.map((s, i) => {
          const q = (t * s.sp + s.ph) % 1;
          return <circle key={i} cx={s.x + Math.sin(q * 6 + i) * 20} cy={1040 - q * 420} r={3.5} fill="#ffc070" opacity={(1 - q) * 0.9} />;
        })}
        {/* fg cart edge + rim */}
        <path d="M-60,1330 L1140,1310 L1140,2000 L-60,2000 Z" fill="#1e140d" />
        <path d="M-60,1330 L1140,1310" stroke="#ff9a45" strokeWidth={4} opacity={0.5} />
        <path d="M-60,1380 L1140,1360 L1140,2000 L-60,2000 Z" fill="#6b4a2f" opacity={0.25} />
      </L>
    </AbsoluteFill>
  );
};

/** shot 7 — father's palm holding damp banknotes, a frangipani on top. */
export const S07: React.FC = () => {
  const { p, t, sec } = useShot();
  const fl = ramp(p, wp(7, /smelled/, 0.6, sec) - 0.08, wp(7, /flowers/, 0.85, sec), EIO);
  const h = handheld(t, 0.05);
  const cam: Cam = { zoom: 1.02 + 0.03 * p, dx: 0, dy: 0, tx: h.hx, ty: h.hy, ox: 540, oy: 900 };
  const drip = (t * 0.45) % 1;
  const SK = '#a8725a', SKD = '#6e4a44', RIM = '#ffb070';
  return (
    <AbsoluteFill style={{ backgroundColor: '#0d0b0c' }}>
      <BandImg id="close/night" k={0.3} cam={{ ...cam, zoom: cam.zoom * 1.15 }} />
      <L cam={cam}>
        <defs>
          <radialGradient id="c7glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffd9a0" stopOpacity={0.35} /><stop offset="1" stopColor="#ffd9a0" stopOpacity={0} />
          </radialGradient>
          <linearGradient id="c7skin" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={SKD} /><stop offset="0.6" stopColor={SK} /><stop offset="1" stopColor="#c48a68" />
          </linearGradient>
        </defs>
        <ellipse cx={560} cy={880} rx={520} ry={520} fill="url(#c7glow)" />
        {/* forearm + sleeve from lower right */}
        <path d="M640,1060 C760,1200 900,1420 1000,1760 L1240,1640 C1100,1360 920,1120 800,980 Z" fill={SKD} />
        <path d="M940,1560 L1180,1440 L1300,1700 L1060,1860 Z" fill="#2a2e3a" />
        {/* fingers (up-left) */}
        {[[300, 600, -18], [400, 540, -8], [510, 530, 2], [610, 570, 12]].map(([x, y, a], i) => (
          <g key={i} transform={`rotate(${a} ${x} ${y + 200})`}>
            <rect x={x - 40} y={y} width={80} height={280} rx={40} fill="url(#c7skin)" />
            <path d={`M${x + 34},${y + 40} L${x + 34},${y + 240}`} stroke={RIM} strokeWidth={4} opacity={0.5} />
            <path d={`M${x - 24},${y + 120} Q${x},${y + 128} ${x + 24},${y + 120}`} stroke={SKD} strokeWidth={3} fill="none" opacity={0.6} />
          </g>
        ))}
        {/* palm */}
        <path d="M260,780 C250,700 320,690 420,700 L660,720 C730,760 760,860 740,980 C720,1100 640,1150 540,1150 C400,1150 290,1080 270,960 Z" fill="url(#c7skin)" />
        <path d="M740,860 C760,960 720,1100 620,1145" stroke={RIM} strokeWidth={5} fill="none" opacity={0.55} />
        {/* banknotes, damp */}
        <g transform="rotate(-14 500 880)">
          <rect x={330} y={770} width={360} height={190} rx={6} fill="#6a8a8c" />
          <rect x={350} y={790} width={320} height={150} fill="none" stroke="#4a6466" strokeWidth={4} />
        </g>
        <g transform="rotate(6 520 900)">
          <rect x={320} y={800} width={380} height={200} rx={6} fill="#b3656a" />
          <rect x={340} y={820} width={340} height={160} fill="none" stroke="#7e4048" strokeWidth={4} />
          <circle cx={430} cy={900} r={44} fill="none" stroke="#7e4048" strokeWidth={4} />
          <text x={600} y={870} fontSize={44} fill="#7e4048" fontFamily="serif" fontWeight={700}>100</text>
          <path d="M360,960 C420,930 520,990 600,950 C640,930 670,960 690,940 L690,1000 L320,1000 Z" fill="#5a2a30" opacity={0.45} />
          <ellipse cx={560} cy={850} rx={60} ry={24} fill="#5a2a30" opacity={0.3} />
          {/* droplets */}
          {[[420, 840, 7], [520, 930, 9], [650, 960, 6], [360, 880, 5], [600, 820, 6]].map(([x, y, s], i) => (
            <g key={i}><ellipse cx={x} cy={y} rx={s} ry={s * 1.25} fill="#c9d8e0" opacity={0.55} /><circle cx={x - s * 0.3} cy={y - s * 0.4} r={s * 0.35} fill="#fff" opacity={0.9} /></g>
          ))}
        </g>
        {/* thumb over notes */}
        <path d="M280,960 C220,900 190,820 200,760 C210,720 250,720 268,760 C290,820 320,880 360,920 Z" fill="url(#c7skin)" />
        <path d="M206,760 C200,820 230,890 280,955" stroke={SKD} strokeWidth={3} fill="none" opacity={0.5} />
        {/* falling drip */}
        <ellipse cx={330} cy={1010 + drip * 340} rx={6} ry={9} fill="#c9d8e0" opacity={0.8 * (1 - drip)} />
        {/* frangipani blossom on top */}
        <g>
          <ellipse cx={540} cy={905} rx={110} ry={30} fill="#2a1410" opacity={0.35} />
          <Frangi x={530} y={870} s={1.25 + 0.05 * fl} rot={10 + 6 * Math.sin(t * 0.5)} />
        </g>
      </L>
    </AbsoluteFill>
  );
};

/** shot 9 — behind the hair: it parts in the wind to reveal only deep shadow. Eerie, never gory. */
export const S09: React.FC = () => {
  const { p, t, sec } = useShot();
  const open = ramp(p, Math.max(0, wp(9, /nothing/, 0.3, sec) - 0.2), wp(9, /darkness/, 0.5, sec) + 0.05, EIO);
  const cam: Cam = { zoom: 1 + 0.12 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: 540, oy: 980 };
  const w = 125 * open, y0 = 640, y1 = 1330, cx = 540;
  const voidD = `M${cx + 6},${y0 - 10} C${cx - w * 1.1},${y0 + 120} ${cx - w * 1.5},${y0 + 380} ${cx - w * 1.25},${y1 - 200} C${cx - w * 1.1},${y1 - 60} ${cx - w * 0.5},${y1 + 30} ${cx - 10},${y1 + 40} C${cx + w * 0.7},${y1 - 10} ${cx + w * 1.3},${y1 - 120} ${cx + w * 1.4},${y1 - 320} C${cx + w * 1.45},${y0 + 300} ${cx + w * 1.0},${y0 + 90} ${cx + 6},${y0 - 10} Z`;
  const lens = (ww: number, a = 0) => `M${cx},${y0 - a} C${cx - ww * 1.35},${y0 + 160} ${cx - ww * 1.35},${y1 - 160} ${cx},${y1 + a} C${cx + ww * 1.35},${y1 - 160} ${cx + ww * 1.35},${y0 + 160} ${cx},${y0 - a} Z`;
  const RIM = '#ffd9a0';
  const sw = (i: number) => Math.sin(t * 1.3 + i * 0.9) * 14;
  return (
    <AbsoluteFill style={{ backgroundColor: '#0d0b0c' }}>
      <BandImg id="close/night" k={0.3} cam={{ ...cam, dx: -300, dy: 200 }} />
      <L cam={cam}>
        <defs>
          <radialGradient id="c9halo" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffe6c0" stopOpacity={0.7} /><stop offset="0.4" stopColor="#c08a60" stopOpacity={0.3} /><stop offset="1" stopColor="#2a1a14" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="c9void" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#000" /><stop offset="0.7" stopColor="#020204" /><stop offset="1" stopColor="#14131c" />
          </radialGradient>
          <linearGradient id="c9dress" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#8e877c" /><stop offset="0.5" stopColor="#d9d4ca" /><stop offset="1" stopColor="#8e877c" />
          </linearGradient>
        </defs>
        <ellipse cx={540} cy={820} rx={640} ry={760} fill="url(#c9halo)" />
        {/* white dress: shoulders and back */}
        <path d="M200,2000 C200,1500 210,900 250,720 C280,610 380,560 540,555 C700,560 800,610 830,720 C870,900 880,1500 880,2000 Z" fill="url(#c9dress)" />
        <path d="M250,720 C280,610 380,560 540,555 C700,560 800,610 830,720" stroke="#fff3e0" strokeWidth={6} fill="none" opacity={0.6} />
        {/* hair: one big curtain from the head past the frame bottom */}
        <path d={`M410,250 C420,150 660,150 670,250 C700,420 720,560 740,760 C770,1100 790,1500 ${810 + sw(1)},2000 L${270 + sw(2)},2000 C290,1500 310,1100 340,760 C360,560 380,420 410,250 Z`} fill="#16110f" />
        <ellipse cx={540} cy={300} rx={140} ry={160} fill="#16110f" />
        {/* the parting: hair pulled apart, behind it only darkness */}
        {open > 0.01 && <path d={voidD} fill="#221e1b" opacity={0.85} />}
        {open > 0.01 && <path d={voidD} fill="url(#c9void)" transform={`translate(${cx} ${(y0 + y1) / 2}) scale(0.9 0.94) translate(${-cx} ${-(y0 + y1) / 2})`} />}
        {/* a few strands still drifting across the gap */}
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${cx - w * 1.3 - 20},${y0 + 140 + i * 170} C${cx - 40},${y0 + 200 + i * 170 + sw(i) * 3} ${cx + 30},${y0 + 120 + i * 190 - sw(i + 2) * 3} ${cx + w * 1.3 + 20},${y0 + 230 + i * 160}`} stroke="#16110f" strokeWidth={5 - i} fill="none" opacity={0.9 * open} />
        ))}
        {[0, 1, 2, 3].map((i) => {
          const d = Math.min(150, w * (0.85 + i * 0.12) + 6);
          return (
            <g key={i}>
              <path d={`M${cx - 20},${y0 - 120} C${cx - d * 1.2 - 10},${y0 + 220} ${cx - d * 1.4 + sw(i)},${y1 - 160} ${cx - d * 0.7 + sw(i + 3)},${y1 + 300}`} stroke="#16110f" strokeWidth={14 - i * 2} fill="none" />
              <path d={`M${cx + 20},${y0 - 120} C${cx + d * 1.25 + 10},${y0 + 180} ${cx + d * 1.3 + sw(i + 1)},${y1 - 100} ${cx + d * 0.6 + sw(i + 5)},${y1 + 300}`} stroke="#16110f" strokeWidth={14 - i * 2} fill="none" />
            </g>
          );
        })}
        {/* rim light on the hair's outer edges + head */}
        <path d="M418,240 C430,170 650,170 662,240" stroke={RIM} strokeWidth={5} fill="none" opacity={0.7} />
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i} opacity={0.5 - i * 0.08}>
            <path d={`M${400 - i * 8},${300 + i * 30} C${360 - i * 10},700 ${320 - i * 8 + sw(i)},1300 ${290 - i * 6 + sw(i + 2)},2000`} stroke={RIM} strokeWidth={3} fill="none" />
            <path d={`M${680 + i * 8},${300 + i * 30} C${720 + i * 10},700 ${760 + i * 8 + sw(i + 1)},1300 ${790 + i * 6 + sw(i + 4)},2000`} stroke={RIM} strokeWidth={3} fill="none" />
          </g>
        ))}
        {/* fg dark leaf framing */}
        <path d="M-80,-60 C180,120 260,420 120,820 C60,600 -20,400 -80,300 Z" fill="#060a0c" />
        <path d="M1160,1100 C960,1200 900,1500 960,1900 L1160,1900 Z" fill="#060a0c" />
      </L>
    </AbsoluteFill>
  );
};

/** shot 11 — the open money box at dawn, full of frangipani petals. */
export const S11: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1 + 0.1 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: 540, oy: 940 };
  const r = rng(11);
  const petals = Array.from({ length: 70 }, (_, i) => ({ x: 270 + r() * 540, y: i < 46 ? 900 + r() * 100 : 870 + r() * 70 - 40 * Math.sin(Math.PI * Math.min(1, i / 70)), rot: r() * 360, s: 0.7 + r() * 0.5, f: r() > 0.7 ? '#efd7b8' : '#f7e7c9' }));
  const lift = (t * 0.18) % 1;
  return (
    <AbsoluteFill style={{ backgroundColor: '#c9b4b8' }}>
      <L cam={cam} k={0.3}>
        <defs>
          <linearGradient id="c11sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8a8fb0" /><stop offset="0.5" stopColor="#e3c3bc" /><stop offset="1" stopColor="#f6dcc0" />
          </linearGradient>
          <radialGradient id="c11sun" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#fff4dc" stopOpacity={0.95} /><stop offset="1" stopColor="#ffd9b0" stopOpacity={0} />
          </radialGradient>
        </defs>
        <rect x={-200} y={-200} width={1480} height={2320} fill="url(#c11sky)" />
        <circle cx={720} cy={620} r={560} fill="url(#c11sun)" />
        <path d="M-200,300 C150,420 120,700 40,900 L-200,900 Z" fill="#3a3640" opacity={0.6} />
      </L>
      <L cam={cam}>
        <defs>
          <linearGradient id="c11table" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6b4a2f" /><stop offset="1" stopColor="#24160e" />
          </linearGradient>
          <linearGradient id="c11box" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7d5636" /><stop offset="1" stopColor="#3e2818" />
          </linearGradient>
        </defs>
        {/* table */}
        <path d="M-100,1180 L1180,1160 L1180,2100 L-100,2100 Z" fill="url(#c11table)" />
        <path d="M-100,1180 L1180,1160" stroke="#ffd9b0" strokeWidth={3} opacity={0.5} />
        <ellipse cx={540} cy={1290} rx={380} ry={40} fill="#140b06" opacity={0.5} />
        {/* lid open, leaning back */}
        <path d="M240,900 L840,900 L800,520 L280,520 Z" fill="#4a3220" />
        <path d="M270,880 L810,880 L776,550 L304,550 Z" fill="#5d3f28" />
        <path d="M800,520 L840,900" stroke="#ffd9b0" strokeWidth={4} opacity={0.6} />
        {/* inside back wall */}
        <path d="M240,900 L840,900 L820,960 L260,960 Z" fill="#2a1a10" />
        {/* petals heaped inside */}
        {petals.map((q, i) => <Petal key={i} x={q.x} y={q.y} rot={q.rot} s={q.s} fill={q.f} />)}
        <Frangi x={470} y={930} s={0.9} rot={20} />
        <Frangi x={640} y={950} s={0.8} rot={-30} />
        {/* front + rim */}
        <path d="M210,980 L870,980 L850,1280 L230,1280 Z" fill="url(#c11box)" />
        <path d="M210,980 L870,980" stroke="#ffd9b0" strokeWidth={5} opacity={0.7} />
        <rect x={510} y={1060} width={60} height={70} rx={8} fill="#c9a060" opacity={0.8} />
        {/* petals spilling over */}
        <Petal x={250} y={1000} rot={-120} s={1} />
        <Petal x={830} y={1010} rot={110} s={0.9} />
        <Petal x={940} y={1250} rot={40} s={1} op={0.9} />
        <Petal x={160} y={1300} rot={-60} s={1.1} op={0.9} />
        {/* one petal lifting in the morning breeze */}
        <Petal x={600 + lift * 200} y={890 - lift * 360} rot={lift * 200} s={0.9} op={Math.sin(lift * Math.PI)} />
      </L>
    </AbsoluteFill>
  );
};
