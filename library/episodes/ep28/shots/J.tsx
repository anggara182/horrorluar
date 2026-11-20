import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, handheld, ramp, EIO } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { ST } from '../sets/street';
import { FigDefs, Woman, Father, Cart } from '../art/street_figs';

const BG = '#07080f';

/** shot 1 — wide village road at midnight: cart glowing by the frangipani, white figure far down the road. */
export const S01: React.FC = () => {
  const { p, t } = useShot();
  const z = 1 + 0.14 * EIO(p);
  const cam: Cam = { zoom: z, dx: 0, dy: 0, ox: 560, oy: 1100 };
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="street/sky" k={0.4} cam={cam} />
      <BandImg id="street/road" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <FigDefs />
        <Woman x={ST.vx + 10} y={ST.hz + 70} h={120} view="back" sway={Math.sin(t * 0.8)} />
        <Cart x={830} y={1520} s={0.3} t={t} />
        <Father x={740} y={1520} h={250} push={false} walk={0} />
      </Live>
      <BandImg id="street/fg" k={1.3} cam={cam} />
    </AbsoluteFill>
  );
};

/** shot 4 — tracking: father pushing the glowing cart along the road. */
export const S04: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1.5, dx: 180 - 360 * p, dy: 0, ox: 540, oy: 1050 };
  const fix: Cam = { zoom: 1, dx: 0, dy: 0 };
  const walk = t * 5;
  const bob = Math.abs(Math.sin(walk)) * 6;
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="street/sky" k={0.3} cam={cam} />
      <BandImg id="street/road" k={1} cam={cam} />
      <Live k={1} cam={fix}>
        <FigDefs />
        <g transform={`translate(0 ${-bob})`}>
          <Father x={360} y={1560} h={560} walk={walk} push />
        </g>
        <Cart x={550} y={1560} s={0.62} t={t} />
      </Live>
      <BandImg id="street/fg" k={1.6} cam={cam} />
    </AbsoluteFill>
  );
};

/** shot 5 — the woman in white under the frangipani tree, hair to her knees. Very slow push. */
export const S05: React.FC = () => {
  const { p, t } = useShot();
  const z = 1.65 + 0.12 * EIO(p);
  const cam: Cam = { zoom: z, dx: 0, dy: 0, ox: 860, oy: 1300 };
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="street/sky" k={0.5} cam={cam} />
      <BandImg id="street/road" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <FigDefs />
        <Woman x={920} y={1495} h={430} view="side" sway={Math.sin(t * 0.7) * 0.4} />
      </Live>
      <BandImg id="street/fg" k={1.3} cam={cam} />
    </AbsoluteFill>
  );
};

/** shot 8 — the woman walking away; wind lifts her hair (only darkness beneath). Locked. */
export const S08: React.FC = () => {
  const { p, t, sec } = useShot();
  const cam: Cam = { zoom: 1.35, dx: 0, dy: 0, ox: 540, oy: 1050 };
  const fix: Cam = { zoom: 1, dx: 0, dy: 0 };
  const w = Math.min(0.8, wordAt(8, /lifted/i, 0.55) / sec);
  const lift = ramp(p, w, Math.min(1, w + 0.35));
  const walkAway = 1 - 0.06 * p;
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="street/sky" k={0.5} cam={cam} />
      <BandImg id="street/road" k={1} cam={cam} />
      <Live k={1} cam={fix}>
        <FigDefs />
        <g transform={`translate(${700} ${1540 - 30 * p}) scale(${walkAway}) translate(${-700} ${-1540})`}>
          <Woman x={700} y={1540} h={700} view="back" lift={lift} sway={Math.sin(t * 1.6) * (0.3 + lift)} />
        </g>
      </Live>
      <BandImg id="street/fg" k={1.3} cam={cam} />
    </AbsoluteFill>
  );
};

/** shot 10 — the cart abandoned on the road, still smoking; father running far away. Handheld. */
export const S10: React.FC = () => {
  const { p, t } = useShot();
  const { hx, hy, hr } = handheld(t, 2.2);
  const cam: Cam = { zoom: 1.3, dx: 0, dy: 0, tx: hx, ty: hy, rot: hr, ox: 540, oy: 1100 };
  const run = EIO(p);
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="street/sky" k={0.4} cam={cam} />
      <BandImg id="street/road" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <FigDefs />
        <Father x={ST.vx + 60 + 20 * run} y={ST.hz + 150 - 90 * run} h={300 - 150 * run} walk={t * 14} push={false} run flip />
        <Cart x={160} y={1580} s={0.42} t={t} fire={0.8} />
      </Live>
      <BandImg id="street/fg" k={1.3} cam={cam} />
    </AbsoluteFill>
  );
};

/** shot 12 — our house at night; a white figure with very long hair just outside the gate. Cold. Slow push-in. */
export const S12: React.FC = () => {
  const { p, t } = useShot();
  const z = 1 + 0.16 * EIO(p);
  const cam: Cam = { zoom: z, dx: 0, dy: 0, ox: 560, oy: 1200 };
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="street/sky" k={0.4} cam={cam} />
      <BandImg id="street/house" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <FigDefs />
        <Woman x={665} y={1560} h={560} view="back" sway={Math.sin(t * 0.6) * 0.3} />
      </Live>
      <BandImg id="street/fg" k={1.3} cam={cam} />
      <AbsoluteFill style={{ backgroundColor: '#3a5a8a', opacity: 0.12 }} />
    </AbsoluteFill>
  );
};
