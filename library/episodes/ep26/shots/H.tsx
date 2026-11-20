import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, handheld, ramp, EIO } from '../comp/Camera';
import { wordAt, spanOf, FPS } from '../data/ep';

/** word time as 0..1 progress of the shot */
const wp = (id: number, re: RegExp, fb: number) => Math.min(0.97, Math.max(0, (wordAt(id, re, fb) * FPS) / spanOf(id).dur));
import { HY } from '../sets/house';
import { Chime, Kune, KidBack, BrotherSide, MouthClose, Grandpa, GrandpaClose } from '../art/house_figs';

const BG = '#1a120c';
const Z: Cam = { zoom: 1, dx: 0, dy: 0 };

/** Cool/dim overlay (flat, opacity only). */
const Tint: React.FC<{ c: string; o: number }> = ({ c, o }) => <AbsoluteFill style={{ backgroundColor: c, opacity: o }} />;

/** shot 4 — wide veranda, two kids eating watermelon, paddies beyond, wind chime. Slow lateral track. */
export const S04: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1.04, dx: 50 - 100 * ramp(p, 0, 1, EIO), dy: 0 };
  const bite = 0.5 + 0.5 * Math.sin(t * 2.2);
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="house/bg" k={0.4} cam={cam} />
      <BandImg id="house/veranda" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <KidBack x={470} y={HY + 4} h={400} shirt="#e9e3d6" melon={bite} />
        <KidBack x={790} y={HY + 4} h={470} shirt="#5d7fa0" melon={1 - bite} lean={2} />
        <Chime x={900} y={560} s={1.1} sw={Math.sin(t * 1.6) * 6} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 7 — brother standing on the veranda raising binoculars toward the field. Slow push. */
export const S07: React.FC = () => {
  const { p, t } = useShot();
  const g = wp(7, /grabbed/, 0.2), s = wp(7, /see/, 0.6);
  const raise = ramp(p, g, s, EIO);
  const cam: Cam = { zoom: 1.3 + 0.15 * ramp(p, 0, 1, EIO), dx: 80, dy: 0, ox: 520, oy: 1000 };
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="house/bg" k={0.5} cam={cam} />
      <Live k={0.5} cam={cam}><Kune x={1000} y={1150} h={34} t={t} o={0.9} /></Live>
      <BandImg id="house/veranda" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <BrotherSide x={500} y={HY + 20} h={640} raise={raise} />
        <Chime x={900} y={560} s={1.1} sw={Math.sin(t * 1.6) * 6} />
      </Live>
      <Tint c="#2a1a10" o={0.06 + 0.1 * p} />
    </AbsoluteFill>
  );
};

/** shot 8 — close on the brother's mouth below the binoculars; corners slowly lifting. Locked. */
export const S08: React.FC = () => {
  const { p } = useShot();
  const smile = ramp(p, wp(8, /Then/, 0.5), 1, EIO);
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="house/bg" k={1} cam={{ zoom: 1.6, dx: 0, dy: 0, oy: 900 }} />
      <Live k={1} cam={Z} w={1080} h={1920} viewBox="0 0 1080 1920"><MouthClose smile={smile} /></Live>
      <Tint c="#1a0f08" o={0.08 + 0.12 * smile} />
    </AbsoluteFill>
  );
};

/** shot 9 — Grandpa runs in, grabs the binoculars (they fall), covers the brother's eyes. Handheld. */
export const S09: React.FC = () => {
  const { p, t } = useShot();
  const hh = handheld(t, 1.4);
  const run = ramp(p, 0, wp(9, /tore/, 0.25), EIO);
  const drop = ramp(p, wp(9, /away/, 0.5), wp(9, /covered/, 0.65), (x) => x * x);
  const cover = ramp(p, wp(9, /covered/, 0.65), wp(9, /eyes/, 0.85), EIO);
  const cam: Cam = { zoom: 1.3, dx: -40, dy: 60, ox: 600, oy: 1000, tx: hh.hx, ty: hh.hy, rot: hh.hr };
  const gx = 1150 - 380 * run + 20 * cover;
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="house/bg" k={0.5} cam={cam} />
      <BandImg id="house/veranda" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <BrotherSide x={500} y={HY + 20} h={620} raise={1 - drop} smile={1} bino={drop === 0} />
        {drop > 0 && <g transform={`translate(${560 + 60 * drop} ${HY - 300 + 320 * drop}) rotate(${90 * drop})`}>
          <rect x={-24} y={-20} width={48} height={18} rx={4} fill="#2b2b2b" /><rect x={-24} y={2} width={48} height={18} rx={4} fill="#1f1f1f" />
        </g>}
        <Grandpa x={gx} y={HY + 30} h={700} reach={0.5 + 0.5 * cover} worry={1} />
      </Live>
      <Tint c="#1c2430" o={0.1 + 0.15 * p} />
    </AbsoluteFill>
  );
};

/** shot 10 — Grandpa's worried profile, whispering; behind him the brother still smiling. Very slow push, cold. */
export const S10: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1.0 + 0.06 * p, dx: 0, dy: 0, ox: 540, oy: 800 };
  const talk = p < wp(10, /My/, 0.5) ? 0.5 + 0.5 * Math.sin(t * 14) : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="house/bg" k={0.3} cam={{ zoom: 1.5, dx: 0, dy: 0, oy: 900 }} />
      <BandImg id="house/veranda" k={0.6} cam={{ zoom: 1.5, dx: 0, dy: 60, oy: 900 }} />
      <Tint c="#1c2836" o={0.45} />
      <Live k={0.6} cam={{ ...cam, zoom: 1.5 + 0.03 * p }}><BrotherSide x={760} y={HY + 40} h={700} raise={0} smile={1} bino={false} /></Live>
      <Live k={1} cam={cam} w={1080} h={1920} viewBox="0 0 1080 1920"><GrandpaClose open={talk} /></Live>
    </AbsoluteFill>
  );
};
