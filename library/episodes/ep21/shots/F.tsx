import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, handheld, ramp, EIO } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { W, H } from '../art/world';
import { Hut, GirlBack, GirlProfile, Print, Snowfall, Spill, P } from '../art/forest_art';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const BG = '#0a1020';

/** Shared forest stack: sky, birches, live middle, fg spruces, snow. */
const Forest: React.FC<{ cam: Cam; t: number; mid?: React.ReactNode; front?: React.ReactNode; fg?: boolean; snow?: number }> = ({ cam, t, mid, front, fg = true, snow = 0.8 }) => (
  <AbsoluteFill style={{ backgroundColor: BG }}>
    <BandImg id="forest/sky" k={0.4} cam={cam} />
    {mid && <Live k={0.75} cam={cam}>{mid}</Live>}
    <BandImg id="forest/birch" k={1} cam={cam} />
    {front && <Live k={1} cam={cam}>{front}</Live>}
    {fg && <BandImg id="forest/fg" k={1.35} cam={cam} />}
    <Live k={1.1} cam={cam}><Snowfall t={t} o={snow} /></Live>
  </AbsoluteFill>
);

/** 1 — wide birch forest under the moon, a lit window far between the trees. */
export const S01: React.FC = () => {
  const { p, t } = useShot();
  const h = handheld(t, 0.3);
  const cam: Cam = { zoom: lerp(1, 1.14, EIO(p)), dx: 0, dy: 0, tx: h.hx, ty: h.hy, oy: 1000 };
  return <Forest cam={cam} t={t} mid={<Hut x={660} y={1330} s={0.32} t={t} glow={1.4} sil />} />;
};

/** 4 — girl in red coat wading through deep snow, tracked from behind. */
export const S04: React.FC = () => {
  const { p, t } = useShot();
  const h = handheld(t, 0.8);
  const cam: Cam = { zoom: 1.25 + 0.06 * p, dx: -40, dy: -120, tx: h.hx, ty: h.hy };
  return (
    <AbsoluteFill>
      <Forest cam={cam} t={t} front={<GirlBack x={640} y={1560} h={360} phase={t * 3.2} />} />
      <AbsoluteFill style={{ background: 'linear-gradient(#1a3a6a33, #0a1a3a55)' }} />
    </AbsoluteFill>
  );
};

/** 5 — the hut on chicken legs in a clearing; slow tilt up. */
export const S05: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1.05, dx: 0, dy: 0, ty: lerp(-160, 120, EIO(p)) };
  return <Forest cam={cam} t={t} fg front={<Hut x={650} y={1520} s={0.95} t={t} />} snow={0.6} />;
};

/** 6 — the hut turning on its legs, the girl small in the foreground. */
export const S06: React.FC = () => {
  const { p, t } = useShot();
  const tt = ramp(t, 0.3, wordAt(6, /trees/i, 0.5, 'end'));
  return (
    <Forest cam={{ zoom: 1.1, dx: 0, dy: -60 }} t={t}
      front={<g><Hut x={720} y={1400} s={0.62} t={t} turn={tt * 0.55} />
        <GirlBack x={330} y={1640} h={260} phase={0} /></g>} />
  );
};

/** 7 — close profile of the girl whispering, breath steaming, the hut glowing far off. */
export const S07: React.FC = () => {
  const { p, t, sec } = useShot();
  const b1 = wordAt(7, /hut/i, 0.15), b2 = wordAt(7, /forest/i, 0.5), b3 = wordAt(7, /front/i, 0.8);
  const breath = Math.max(...[b1, b2, b3].map((b) => ramp(t, b, b + 1.6, (x) => x)).map((k) => (k > 0 && k < 1 ? k : 0)));
  const cam: Cam = { zoom: lerp(1.0, 1.08, p), dx: 0, dy: 0 };
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="forest/sky" k={1} cam={{ zoom: 1.4, dx: -200, dy: 120 }} />
      <Live k={1} cam={{ zoom: 1.4, dx: -200, dy: 120 }}><Hut x={1000} y={1320} s={0.28} t={t} turn={0.55} /></Live>
      <BandImg id="forest/birch" k={1} cam={{ zoom: 1.4, dx: -200, dy: 120 }} style={{ opacity: 0.8 }} />
      <Live k={1} cam={cam}><GirlProfile x={600} y={1000} s={1.05} breath={breath} t={t} /></Live>
      <Live k={1.2} cam={cam}><Snowfall t={t} o={0.6} n={40} size={6} /></Live>
    </AbsoluteFill>
  );
};

/** 8 — low angle: the giant legs bend, the hut has turned, the door opens with oven light. */
export const S08: React.FC = () => {
  const { p, t } = useShot();
  const tb = wordAt(8, /creaked/i, 0.2), tt = wordAt(8, /turned/i, 0.45), to = wordAt(8, /opened/i, 0.8);
  const bend = ramp(t, tb, tb + 1.4);
  const turn = 0.55 + 0.45 * ramp(t, tt, tt + 1.2);
  const door = ramp(t, to - 0.3, to + 0.5);
  const cam: Cam = { zoom: 1.0, dx: 0, dy: 140 };
  return (
    <Forest cam={cam} t={t} fg={false} snow={0.5}
      front={<g><Hut x={660} y={1600} s={1.2} t={t} bend={bend} turn={turn} door={door} />
        <Spill x={684} y={lerp(1600 - 1.2 * 430, 1600 - 1.2 * 230, bend)} w={760} h={300} o={door * 0.8} /></g>} />
  );
};

/** 11 — dawn, a red yarn line across the snow, the girl following toward distant roofs. */
export const S11: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: lerp(1.25, 1.0, EIO(p)), dx: 0, dy: 0, oy: 1000 };
  const draw = 0.3 + 0.7 * EIO(p);
  const yarn = 'M590 1530 Q450 1500 620 1480 Q820 1460 700 1420 Q560 1380 700 1350 Q780 1330 740 1300';
  const gp = 0.25 + 0.4 * p;
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="forest/sky" k={0.4} cam={cam} />
      <AbsoluteFill style={{ background: 'linear-gradient(#1c2a5200 0%, #e0907066 45%, #ffc08a88 55%, #00000000 62%)' }} />
      <Live k={0.6} cam={cam}>
        {[[560, 30], [620, 40], [690, 34], [740, 28]].map(([x, w], i) => <g key={i}><rect x={x} y={1268} width={w} height={22} fill="#2a2a3a" /><path d={`M${x - 6} 1270 L${x + w / 2} 1250 L${x + w + 6} 1270 Z`} fill="#3a3040" /><rect x={x + w / 3} y={1274} width={6} height={6} fill="#ffb35c" /></g>)}
      </Live>
      <BandImg id="forest/birch" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <path d={yarn} stroke="#c02828" strokeWidth={10} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} />
        <GirlBack x={lerp(560, 600, gp)} y={lerp(1545, 1530, gp)} h={lerp(200, 185, gp)} phase={t * 3} rim="#ffc08a" />
      </Live>
      <BandImg id="forest/fg" k={1.35} cam={cam} />
    </AbsoluteFill>
  );
};

/** 12 — a cottage window at night; in the snow outside, huge three-toed bird prints. */
export const S12: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: lerp(1, 1.15, EIO(p)), dx: 0, dy: 0, oy: 900 };
  const show = ramp(t, wordAt(12, /chicken/i, 0.6) - 0.3, wordAt(12, /chicken/i, 0.6) + 1.0);
  return (
    <AbsoluteFill style={{ backgroundColor: '#080a10' }}>
      <BandImg id="forest/sky" k={0.5} cam={cam} />
      <Live k={0.8} cam={cam}>
        <rect x={0} y={1180} width={W} height={H} fill="#b8c8da" />
        <rect x={0} y={1180} width={W} height={H} fill="#5d6f85" opacity={0.35} />
        <g opacity={0.4 + 0.6 * show}>
          {[[560, 1300, 0.5], [700, 1360, 0.6], [520, 1440, 0.75], [720, 1530, 0.9]].map(([x, y, s], i) => <Print key={i} x={x} y={y} s={s} r={-10 + (i % 2) * 18} />)}
        </g>
        <Snowfall t={t} o={0.7} n={50} />
      </Live>
      <Live k={1} cam={cam}>
        <path fillRule="evenodd" fill="#1a120d" d={`M-200 -200 H${W + 200} V${H + 200} H-200 Z M300 640 H996 V1640 H300 Z`} />
        <path d="M300 640 H996 V1640 H300 Z M648 640 V1640 M300 1140 H996" stroke="#3a2b20" strokeWidth={30} fill="none" />
        <rect x={270} y={1640} width={756} height={50} fill="#4a3828" />
        <rect x={270} y={1640} width={756} height={8} fill="#c0b8a8" opacity={0.4} />
        <path d="M300 1620 Q450 1590 640 1612 Q820 1630 996 1600 V1640 H300 Z" fill="#e5ecf2" />
      </Live>
    </AbsoluteFill>
  );
};
