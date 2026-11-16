import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, handheld, ramp, EIO, Cam } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { Goat, Boy, Huldra } from '../art/farm_figs';
import { FP, PINE_EDGE } from '../sets/farm';

const Bands: React.FC<{ cam: Cam; children?: React.ReactNode; fg?: boolean }> = ({ cam, children, fg = true }) => (
  <AbsoluteFill style={{ backgroundColor: '#f3d9a4', overflow: 'hidden' }}>
    <BandImg id="farm/sky" k={0.25} cam={cam} />
    <BandImg id="farm/mid" k={1} cam={cam} />
    {children}
    {fg && <BandImg id="farm/fg" k={1.5} cam={cam} />}
  </AbsoluteFill>
);

/** shot 4 — wide mountain farm, slow lateral track. Goats graze, the boy with his stick. */
export const S04: React.FC = () => {
  const { p, t } = useShot();
  const tr = ramp(p, 0, 1, (x) => x);
  const cam: Cam = { zoom: 1.22, dx: 70 - 140 * tr, dy: -60, oy: 1100 };
  const sunT = wordAt(4, /midnight/, 0.85);
  const glow = ramp(t, sunT - 0.3, sunT + 1.2);
  const goats = [
    { x: 300, y: 1470, s: 0.9, d: 1, ph: 0 }, { x: 470, y: 1500, s: 1, d: -1, ph: 1.3 },
    { x: 640, y: 1520, s: 1.05, d: 1, ph: 2.1 }, { x: 180, y: 1520, s: 1.1, d: 1, ph: 0.6 }, { x: 820, y: 1430, s: 0.8, d: -1, ph: 2.8 },
  ];
  return (
    <Bands cam={cam}>
      <Live k={1} cam={cam}>
        {goats.map((g, i) => <Goat key={i} x={g.x + Math.sin(t * 0.3 + g.ph) * 6} y={g.y} s={g.s} dir={g.d} graze={0.5 + 0.5 * Math.sin(t * 0.9 + g.ph)} />)}
        <Boy x={700} y={1440} h={210} dir={-1} phase={0} />
        <circle cx={880} cy={930} r={60 + glow * 20} fill="#fff8e4" opacity={0.25 * glow} />
      </Live>
    </Bands>
  );
};

/** shot 11 — handheld: the tiny boy runs down the path past the cabin, goats scatter. */
export const S11: React.FC = () => {
  const { p, t } = useShot();
  const h = handheld(t, 2.2);
  const run = ramp(p, 0.05, 1, (x) => x);
  const cam: Cam = { zoom: 1.3, dx: -90 * run, dy: -40 - 60 * run, tx: h.hx, ty: h.hy, rot: h.hr, oy: 1100 };
  const bx = 540 + run * 220, by = 1300 + run * 170;
  const sc = ramp(p, 0.1, 0.7, EIO);
  const goats = [
    { x: 300, y: 1470, vx: -160, vy: 30, s: 0.9 }, { x: 470, y: 1500, vx: -120, vy: 60, s: 1 },
    { x: 640, y: 1520, vx: 260, vy: 10, s: 1.05 }, { x: 820, y: 1430, vx: 180, vy: -20, s: 0.8 },
  ];
  return (
    <Bands cam={cam}>
      <Live k={1} cam={cam}>
        {goats.map((g, i) => <Goat key={i} x={g.x + g.vx * sc} y={g.y + g.vy * sc} s={g.s} dir={g.vx > 0 ? 1 : -1} leg={t * 14 + i} />)}
        <Boy x={bx} y={by} h={170} dir={1} run={1} phase={t * 16} />
      </Live>
    </Bands>
  );
};

/** shot 12 — slow push-in: our house at the forest edge, a pale woman just inside the trees. Cold. */
export const S12: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1.1 + 0.15 * ramp(p, 0, 1, EIO), dx: -20, dy: -50, ox: 640, oy: 1100 };
  const wT = wordAt(12, /woman/, 0.45), cT = wordAt(12, /closer/, 0.8);
  const o = ramp(t, wT - 0.2, wT + 1.2);
  const step = ramp(t, cT - 0.2, cT + 1.4);
  const hx = PINE_EDGE + 70 - step * 50;
  return (
    <Bands cam={cam}>
      <Live k={1} cam={cam}>
        <rect x={0} y={0} width={1296} height={2304} fill="#5a6890" opacity={0.28} />
        <Huldra x={hx} y={1352} h={230} o={o * 0.9} sway={Math.sin(t * 1.4) * 4} />
        <rect x={PINE_EDGE + 150} y={1060} width={22} height={300} fill={FP.pine} />
        <path d={`M${PINE_EDGE + 161},960 L${PINE_EDGE + 215},1080 L${PINE_EDGE + 107},1080 Z M${PINE_EDGE + 161},1020 L${PINE_EDGE + 245},1180 L${PINE_EDGE + 77},1180 Z M${PINE_EDGE + 161},1100 L${PINE_EDGE + 270},1280 L${PINE_EDGE + 52},1280 Z`} fill={FP.pine} />
      </Live>
    </Bands>
  );
};
