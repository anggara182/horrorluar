import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, handheld, ramp, EIO } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { KG } from '../sets/kampung';
import { KDefs, Villager, Pig } from '../art/kampung_figs';

const BG = '#05070d';
const fl = (t: number, s = 0) => 0.5 + 0.5 * Math.sin(t * 9 + s) * Math.sin(t * 5.3 + s * 2);

/** Window with a faint candle glow (the hint of the candle). */
const CandleWin: React.FC<{ on: number }> = ({ on }) => (
  <g opacity={on}>
    <circle cx={892} cy={1280} r={90} fill="url(#kDim)" />
    <rect x={867} y={1225} width={50} height={110} fill="#ffd27a" opacity={0.35} />
  </g>
);

/** shot 1 — the village lane at night, a black pig crossing far down the lane, one window faintly lit. Slow push-in. */
export const S01: React.FC = () => {
  const { p, t, sec } = useShot();
  const cam: Cam = { zoom: 1.0 + 0.22 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: 560, oy: 1150 };
  const tPig = (wordAt(1, /pig/i, 0.3) / sec);
  const tCan = (wordAt(1, /candle/i, 0.6) / sec);
  const px = 360 + 460 * ramp(p, tPig - 0.15, 1, (n) => n);
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="kampung/night" cam={cam} />
      <Live cam={cam}>
        <KDefs />
        <CandleWin on={ramp(p, tCan - 0.05, tCan + 0.08)} />
        <ellipse cx={px} cy={1560} rx={190} ry={20} fill="#000" opacity={0.5} />
        <Pig x={px} y={1560} s={1.05} ph={t * 7} eye={0.9} />
      </Live>
      <BandImg id="kampung/fg" k={1.3} cam={cam} />
    </AbsoluteFill>
  );
};

/** shot 4 — villagers whispering in a lamp-lit cluster. Slow push. */
export const S04: React.FC = () => {
  const { p, t, sec } = useShot();
  const cam: Cam = { zoom: 1.35 + 0.15 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ty: 60, ox: 560, oy: 1200 };
  const tPig = (wordAt(4, /pig/i, 0.85) / sec);
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="kampung/night" k={0.8} cam={cam} />
      <Live cam={cam}>
        <KDefs />
        <Villager x={460} y={1600} s={1.15} flick={fl(t)} lean={4 + 2 * Math.sin(t * 1.3)} />
        <Villager x={690} y={1610} s={1.2} flip lamp={false} lean={-6 - 2 * Math.sin(t * 1.1)} />
        <Villager x={590} y={1640} s={1.0} lamp={false} peci={false} lean={3} />
        <g opacity={ramp(p, tPig - 0.05, tPig + 0.1)}><Pig x={980} y={1500} s={0.45} flip ph={0} eye={1} /></g>
      </Live>
      <BandImg id="kampung/fg" k={1.3} cam={cam} />
    </AbsoluteFill>
  );
};

/** shot 5 — the lane at midnight, men with lamps waiting on both sides; the pig appears far down the lane. Locked. */
export const S05: React.FC = () => {
  const { p, t, sec } = useShot();
  const cam: Cam = { zoom: 1.12, dx: 0, dy: 0, ox: 560, oy: 1150 };
  const tCame = (wordAt(5, /came/i, 0.85) / sec);
  const on = ramp(p, tCame - 0.08, tCame + 0.05);
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="kampung/night" cam={cam} />
      <Live cam={cam}>
        <KDefs />
        <Villager x={300} y={1600} s={1.0} flick={fl(t)} />
        <Villager x={460} y={1520} s={0.7} flick={fl(t, 1)} />
        <Villager x={900} y={1590} s={0.95} flip flick={fl(t, 2)} />
        <Villager x={1040} y={1640} s={1.1} flip flick={fl(t, 3)} />
        <g opacity={on}><Pig x={600} y={1500} s={0.7} ph={t * 5} eye={1} /></g>
      </Live>
      <BandImg id="kampung/fg" k={1.3} cam={cam} />
    </AbsoluteFill>
  );
};

/** shot 6 — the black pig sniffing under a closed door, lamp light from the left. Very slow push. */
export const S06: React.FC = () => {
  const { p, t, sec } = useShot();
  const cam: Cam = { zoom: 1.5 + 0.1 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, tx: -40, ty: -60, ox: 720, oy: 1240 };
  const sn = 0.5 + 0.5 * Math.sin(t * 6);
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="kampung/night" cam={cam} />
      <Live cam={cam}>
        <KDefs />
        <circle cx={430} cy={1350} r={420} fill="url(#kDim)" />
        <rect x={KG.DOOR.x} y={KG.DOOR.y + KG.DOOR.h - 6} width={KG.DOOR.w} height={6} fill="#ffd27a" opacity={0.5} />
        <ellipse cx={720} cy={1470} rx={210} ry={18} fill="#000" opacity={0.55} />
        <Pig x={640} y={1470} s={1.15} sniff={0.6 + 0.4 * sn} ph={0.3 * Math.sin(t * 2)} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 7 — close on the father holding his oil lamp, whispering. Locked. */
export const S07: React.FC = () => {
  const { t } = useShot();
  const cam: Cam = { zoom: 1.0, dx: 0, dy: 0, ox: 540, oy: 900 };
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="kampung/night" k={0.6} cam={{ zoom: 1.6, dx: 0, dy: 0, ox: 540, oy: 1000 }} />
      <Live cam={cam}>
        <KDefs />
        <Villager x={520} y={2140} s={3.2} flick={fl(t)} lean={2 + Math.sin(t * 0.8)} />
      </Live>
      <BandImg id="kampung/fg" k={1.2} cam={cam} />
    </AbsoluteFill>
  );
};

/** shot 10 — the pig fleeing down the dark lane, lamps behind. Handheld. */
export const S10: React.FC = () => {
  const { p, t, sec } = useShot();
  const hh = handheld(t, 1.4);
  const cam: Cam = { zoom: 1.25, dx: 0, dy: 0, tx: hh.hx, ty: hh.hy, rot: hh.hr, ox: 560, oy: 1150 };
  const tRun = (wordAt(10, /ran/i, 0.55) / sec);
  const r = ramp(p, 0.05, 1, (n) => n);
  const px = 760 - 460 * r, ps = 1.35 - 0.7 * r;
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="kampung/night" cam={cam} />
      <Live cam={cam}>
        <KDefs />
        <Villager x={1040} y={1640} s={1.15} flip flick={fl(t)} lean={-6} />
        <Villager x={880} y={1580} s={0.9} flip flick={fl(t, 2)} />
        <g opacity={1 - ramp(p, tRun + 0.2, 1)}><Pig x={px} y={1570 - 80 * r} s={ps} flip ph={t * 16} /></g>
      </Live>
      <BandImg id="kampung/fg" k={1.3} cam={cam} />
    </AbsoluteFill>
  );
};

/** shot 12 — the lane at dawn, the neighbour coming home limping. Slow pull-back. */
export const S12: React.FC = () => {
  const { p, t, sec } = useShot();
  const cam: Cam = { zoom: 1.4 - 0.25 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: 560, oy: 1200 };
  const w = ramp(p, 0, 1, (n) => n);
  const limp = Math.max(0, Math.sin(t * 3.2));
  return (
    <AbsoluteFill style={{ backgroundColor: '#2f3a52' }}>
      <BandImg id="kampung/dawn" cam={cam} />
      <Live cam={cam}>
        <KDefs />
        <ellipse cx={620 + 20 * w} cy={1560 + 30 * w} rx={70} ry={10} fill="#000" opacity={0.35} />
        <Villager x={620 + 20 * w} y={1560 + 30 * w - 6 * limp} s={0.95 + 0.15 * w} lamp={false} lean={-5 * limp} fill="#14161a" rim="#ffd8a8" />
      </Live>
      <BandImg id="kampung/fg" k={1.3} cam={cam} style={{ opacity: 0.8 }} />
    </AbsoluteFill>
  );
};
