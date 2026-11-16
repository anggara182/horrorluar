import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, handheld, ramp, EIO, clamp01 } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { ALT, DOOR, WIN } from '../sets/home';
import { Grandma, gHand, Smoke, Ember, SleeveHand, Bust } from '../art/home_figs';

const CAM0: Cam = { zoom: 1, dx: 0, dy: 0 };

/** shot 4 — grandmother in profile lighting incense at the altar, smoke curling. Slow push. Warm. */
export const S04: React.FC = () => {
  const { p, t, sec } = useShot();
  const tr = wordAt(4, /around/i, 0.9) / sec;
  const cam: Cam = { zoom: 1 + 0.14 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: 470, oy: 820 };
  const gx = 250, gy = 690, s = 1.4;
  const camA: Cam = { ...cam, dx: 190 };
  const arm = 0.55 + 0.25 * ramp(p, 0.05, 0.45, EIO);
  const bob = 14 * ramp(p, Math.max(0.5, tr - 0.2), Math.min(1, tr + 0.05), EIO);
  const hnd = gHand(gx, gy + bob, s, arm);
  const sticks = [-14, 0, 14].map((d, i) => ({ x0: hnd.x + 10 + d * 0.4, y0: hnd.y - 10, x1: hnd.x + 70 + d, y1: hnd.y - 250 - i * 6 }));
  return (
    <AbsoluteFill style={{ backgroundColor: '#140b0a' }}>
      <BandImg id="home/altar" k={0.9} cam={camA} />
      <Live k={0.9} cam={camA}>
        {[-40, 25].map((d, i) => <Smoke key={i} x={ALT.potX + d * 1.2} y={ALT.potY - 110 - i * 6} t={t} o={0.45} len={380} seed={i * 2} />)}
      </Live>
      <Live k={1} cam={cam}>
        <Grandma x={gx} y={gy} s={s} arm={arm} bob={bob} />
        {sticks.map((k, i) => <line key={i} x1={k.x0} y1={k.y0} x2={k.x1} y2={k.y1} stroke="#a8402a" strokeWidth={5} />)}
        {sticks.map((k, i) => <Smoke key={'s' + i} x={k.x1} y={k.y1} t={t + i} o={0.8} len={560} seed={i * 1.7} />)}
        {sticks.map((k, i) => <Ember key={'e' + i} x={k.x1} y={k.y1} o={0.75 + 0.25 * Math.sin(t * 5 + i)} />)}
      </Live>
      <BandImg id="home/fg" k={1.2} cam={cam} />
    </AbsoluteFill>
  );
};

/** shot 10 — her shaking hands lighting incense at the altar. Handheld, fast to calm. */
export const S10: React.FC = () => {
  const { p, t, sec } = useShot();
  const tl = wordAt(10, /^lit/i, 0.45) / sec;
  const lit = ramp(p, tl, tl + 0.1, EIO);
  const calm = ramp(p, tl - 0.1, 0.95, EIO);
  const hh = handheld(t * (1.8 - calm), 1.6 - 1.4 * calm);
  const cam: Cam = { zoom: 1.55, dx: 0, dy: 40, tx: hh.hx, ty: hh.hy, rot: hh.hr, ox: 582, oy: 900 };
  const sh = (1 - calm) * 7;
  const tx = Math.sin(t * 31) * sh, ty = Math.cos(t * 27) * sh;
  // left hand holds sticks; tips toward the lighter
  const lw = { x: 500 + tx, y: 1380 + ty };
  const tips = [0, 1, 2].map((i) => ({ x: lw.x + 230 + i * 34, y: lw.y - 340 + i * 10 }));
  const away = ramp(p, tl + 0.05, tl + 0.35, EIO);
  const rw = { x: 940 + 300 * away - tx, y: 1200 + 300 * away + ty };
  const flame = { x: rw.x - 125, y: rw.y - 140 };
  const camH: Cam = { zoom: 1, dx: 0, dy: 0, tx: hh.hx * 1.3, ty: hh.hy * 1.3, rot: hh.hr };
  return (
    <AbsoluteFill style={{ backgroundColor: '#140b0a' }}>
      <BandImg id="home/altar" k={1} cam={cam} />
      <Live k={1} cam={camH}>
        {/* lighter in right hand */}
        <g opacity={1 - away}>
          <ellipse cx={flame.x} cy={flame.y} rx={90} ry={110} fill="#ffb057" opacity={0.18} />
          <rect x={rw.x - 150} y={rw.y - 110} width={56} height={120} rx={10} fill="#c8302a" transform={`rotate(-25 ${rw.x - 122} ${rw.y - 50})`} />
          <path d={`M ${flame.x} ${flame.y - 50 + Math.sin(t * 20) * 4} Q ${flame.x + 18} ${flame.y - 10} ${flame.x} ${flame.y + 10} Q ${flame.x - 18} ${flame.y - 10} ${flame.x} ${flame.y - 50 + Math.sin(t * 20) * 4} Z`} fill="#ffe2a0" />
        </g>
        <SleeveHand sx={1350 - tx} sy={2250} wx={rw.x} wy={rw.y} a={200} flip />
        {tips.map((k, i) => <line key={i} x1={lw.x + 40} y1={lw.y - 30} x2={k.x} y2={k.y} stroke="#c4583a" strokeWidth={9} />)}
        {tips.map((k, i) => <Smoke key={'s' + i} x={k.x} y={k.y} t={t + i} o={lit * 0.9} len={500} seed={i} />)}
        {tips.map((k, i) => <Ember key={'e' + i} x={k.x} y={k.y} o={lit * (0.8 + 0.2 * Math.sin(t * 6 + i))} />)}
        <SleeveHand sx={150 + tx} sy={2250} wx={lw.x} wy={lw.y} a={-40} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 11 — the front door from inside; corridor light under it; slow footsteps stop: a shadow standing still. Locked. */
export const S11: React.FC = () => {
  const { p, sec } = useShot();
  const tf0 = wordAt(11, /slow/i, 0.3) / sec, tn = wordAt(11, /nothing/i, 0.6) / sec, td = wordAt(11, /dawn/i, 0.9) / sec;
  // stepwise approach from the right, stops centred
  const steps = 4;
  const raw = clamp01((p - tf0 + 0.05) / Math.max(0.1, tn - tf0));
  const st = Math.floor(raw * steps) + EIO(clamp01((raw * steps) % 1 * 1.6));
  const pos = Math.min(1, st / steps);
  const fx = 1000 - 360 * pos; // feet centre x
  const on = raw > 0 ? 1 : 0;
  const cam: Cam = { zoom: 1.04, dx: 0, dy: -110, ox: 540, oy: 860 };
  const ly = DOOR.bot - 14;
  const dawn = ramp(p, td - 0.05, 1, EIO);
  const feet = [fx - 70, fx + 30].map((x, i) => ({ x, w: 46 + i * 4 }));
  return (
    <AbsoluteFill style={{ backgroundColor: '#0b0b10' }}>
      <BandImg id="home/door" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <defs>
          <radialGradient id="hSpill" cx="0.5" cy="0" r="0.6"><stop offset="0" stopColor="#ffd9a0" stopOpacity="0.55" /><stop offset="1" stopColor="#ffd9a0" stopOpacity="0" /></radialGradient>
          <clipPath id="hGap"><rect x={DOOR.x0 - 200} y={ly - 6} width={DOOR.x1 - DOOR.x0 + 400} height={400} /></clipPath>
          <radialGradient id="hPeep" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffd9a0" stopOpacity="0.9" /><stop offset="1" stopColor="#ffd9a0" stopOpacity="0" /></radialGradient>
        </defs>
        <clipPath id="hFloor"><rect x={0} y={ly + 6} width={1296} height={900} /></clipPath>
        <ellipse cx={(DOOR.x0 + DOOR.x1) / 2} cy={ly + 8} rx={360} ry={260} fill="url(#hSpill)" clipPath="url(#hFloor)" />
        <rect x={DOOR.x0} y={ly - 4} width={DOOR.x1 - DOOR.x0} height={18} fill="#ffe6b8" />
        <g clipPath="url(#hGap)" opacity={on}>
          {feet.map((f, i) => <rect key={i} x={f.x - f.w / 2} y={ly - 6} width={f.w} height={22} fill="#0a0808" opacity={f.x > DOOR.x1 ? 0 : 1} />)}
          {feet.map((f, i) => <path key={'w' + i} d={`M ${f.x - f.w / 2} ${ly + 12} L ${f.x + f.w / 2} ${ly + 12} L ${f.x + f.w * 2.2} ${ly + 300} L ${f.x - f.w * 1.2} ${ly + 300} Z`} fill="#050405" opacity={f.x > DOOR.x1 ? 0 : 0.8} />)}
        </g>
        {/* peephole: light, dark when someone stands in front */}
        <circle cx={DOOR.peepX} cy={DOOR.peepY} r={34} fill="url(#hPeep)" opacity={1 - 0.85 * pos * on} />
        <circle cx={DOOR.peepX} cy={DOOR.peepY} r={8} fill="#ffe6b8" opacity={1 - 0.9 * pos * on} />
        {/* cold dawn creeping on the wall */}
        <rect x={0} y={0} width={1296} height={2304} fill="#8aa0c8" opacity={0.08 * dawn} />
      </Live>
      <BandImg id="home/fg" k={1.15} cam={cam} />
    </AbsoluteFill>
  );
};

/** shot 12 — her window at night, lantern street below, her reflection; something whistles back behind her. Slow push-in. Cold. */
export const S12: React.FC = () => {
  const { p, t, sec } = useShot();
  const ts = wordAt(12, /someone/i, 0.7) / sec;
  const g = ramp(p, ts - 0.05, Math.min(1, ts + 0.25), EIO);
  const cam: Cam = { zoom: 1 + 0.16 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: 560, oy: 800 };
  const cx = (WIN.x0 + WIN.x1) / 2;
  return (
    <AbsoluteFill style={{ backgroundColor: '#0b0d14' }}>
      <BandImg id="home/window" k={0.95} cam={cam} />
      <Live k={1} cam={cam}>
        <defs>
          <clipPath id="hGlass"><rect x={WIN.x0} y={WIN.top} width={WIN.x1 - WIN.x0} height={WIN.bot - WIN.top} /></clipPath>
          <linearGradient id="hSheen" x1="0" y1="0" x2="1" y2="1"><stop offset="0.3" stopColor="#c9d6ea" stopOpacity="0" /><stop offset="0.45" stopColor="#c9d6ea" stopOpacity="0.08" /><stop offset="0.6" stopColor="#c9d6ea" stopOpacity="0" /></linearGradient>
        </defs>
        <g clipPath="url(#hGlass)">
          <g opacity={0.15}><Bust x={cx - 80} y={720 + Math.sin(t * 0.8) * 4} s={1.15} fill="#a9bcd8" hood /><ellipse cx={cx - 70} cy={850 + Math.sin(t * 0.8) * 4} rx={80} ry={100} fill="#0b0d14" opacity={0.35} /></g>
          <g opacity={0.2 * g}><Bust x={cx + 200} y={700} s={0.82} fill="#c9ccd1" hair /><ellipse cx={cx + 200} cy={800} rx={24} ry={62} fill="#0b0d14" opacity={0.3} /></g>
          <rect x={WIN.x0} y={WIN.top} width={WIN.x1 - WIN.x0} height={WIN.bot - WIN.top} fill="url(#hSheen)" />
        </g>
      </Live>
      <BandImg id="home/fg" k={1.2} cam={cam} />
    </AbsoluteFill>
  );
};
