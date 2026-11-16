import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, handheld, ramp, EIO } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { WC, GROUND, fern } from '../sets/woods';
import { Huldra, BoyBack, BoyProfile } from '../art/woods_figs';

const Glow: React.FC<{ x: number; y: number; r: number; o?: number; id: string; c?: string }> = ({ x, y, r, o = 1, id, c = WC.sun }) => (
  <g>
    <defs><radialGradient id={id} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={c} stopOpacity={0.8 * o} /><stop offset="1" stopColor={c} stopOpacity={0} /></radialGradient></defs>
    <circle cx={x} cy={y} r={r} fill={`url(#${id})`} />
  </g>
);

const Bg: React.FC<{ cam: Cam; fg?: boolean }> = ({ cam, fg = true }) => (
  <>
    <BandImg id="woods/sky" k={0.3} cam={cam} />
    <BandImg id="woods/far" k={0.55} cam={cam} />
    <BandImg id="woods/mid" k={0.8} cam={cam} />
    {fg && <BandImg id="woods/fg" k={1.25} cam={cam} />}
  </>
);

/** 1: wide pines, pale woman far between trunks */
export const S01: React.FC = () => {
  const { p, t } = useShot();
  const z = 1 + 0.12 * EIO(p), hh = handheld(t, 0.3);
  const cam: Cam = { zoom: z, dx: 0, dy: 0, tx: hh.hx, ty: hh.hy, oy: 1000 };
  const show = ramp(p, 0.2, 0.45);
  return (
    <AbsoluteFill style={{ backgroundColor: WC.skyLow }}>
      <BandImg id="woods/sky" k={0.3} cam={cam} />
      <BandImg id="woods/far" k={0.55} cam={cam} />
      <Live k={0.6} cam={cam}><g opacity={show}><Glow id="w1g" x={700} y={1300} r={120} /><Huldra id="w1h" x={700} y={1420} h={190} view="front" sway={Math.sin(t)} /></g></Live>
      <BandImg id="woods/mid" k={0.8} cam={cam} />
      <BandImg id="woods/fg" k={1.25} cam={cam} />
    </AbsoluteFill>
  );
};

/** 5: boy from behind at the forest edge, listening */
export const S05: React.FC = () => {
  const { p, t } = useShot();
  const z = 1.05 + 0.1 * EIO(p), hh = handheld(t, 0.4);
  const cam: Cam = { zoom: z, dx: 0, dy: 0, tx: hh.hx, ty: hh.hy, oy: 1100 };
  const call = ramp(t, wordAt(5, /calling/, 0.75) - 0.3, wordAt(5, /name/, 0.9));
  return (
    <AbsoluteFill style={{ backgroundColor: WC.skyLow }}>
      <Bg cam={cam} fg={false} />
      <Live k={0.8} cam={cam}><Glow id="w5g" x={700} y={1250} r={260} o={0.4 + 0.6 * call + 0.1 * Math.sin(t * 3)} /></Live>
      <Live k={1} cam={cam}><BoyBack x={470} y={1520} h={720} step={0.1} /></Live>
      <BandImg id="woods/fg" k={1.25} cam={cam} />
    </AbsoluteFill>
  );
};

/** 6: the beautiful woman between the pines */
export const S06: React.FC = () => {
  const { p, t } = useShot();
  const z = 1.25 + 0.06 * EIO(p), hh = handheld(t, 0.2);
  const cam: Cam = { zoom: z, dx: -60, dy: 0, tx: hh.hx, ty: hh.hy, oy: 1000 };
  const smile = ramp(t, wordAt(6, /smile/, 0.75) - 0.2, wordAt(6, /sunlight/, 0.9));
  return (
    <AbsoluteFill style={{ backgroundColor: WC.skyLow }}>
      <Bg cam={cam} fg={false} />
      <Live k={0.9} cam={cam}>
        <Glow id="w6g" x={700} y={1000} r={480} o={0.8} />
        <Huldra id="w6h" x={700} y={1440} h={860} view="front" sway={Math.sin(t * 1.3)} smile={0.4 + 0.6 * smile} />
      </Live>
      <BandImg id="woods/fg" k={1.25} cam={cam} />
    </AbsoluteFill>
  );
};

/** 7: tracking behind the boy walking toward her; hem stirs */
export const S07: React.FC = () => {
  const { p, t } = useShot();
  const hh = handheld(t, 0.7);
  const cam: Cam = { zoom: 1.08 + 0.12 * p, dx: 0, dy: 0, tx: hh.hx, ty: hh.hy + Math.sin(t * 6) * 4, oy: 1200 };
  const wind = ramp(t, wordAt(7, /wind/, 0.65), wordAt(7, /dress/, 0.95, 'end'));
  return (
    <AbsoluteFill style={{ backgroundColor: WC.skyLow }}>
      <Bg cam={cam} fg={false} />
      <Live k={0.85} cam={cam}>
        <Glow id="w7g" x={760} y={1150} r={300} o={0.7} />
        <Huldra id="w7h" x={760} y={1420} h={520} view="front" sway={Math.sin(t * 2) + wind} hem={wind * (0.6 + 0.4 * Math.sin(t * 5))} />
      </Live>
      <Live k={1.1} cam={cam}>
        <BoyBack x={380} y={1880} h={820} step={p * 2.5} />
        {[0, 1, 2, 3].map((i) => fern(250 + i * 180, 1950, 2, WC.ink, i))}
      </Live>
    </AbsoluteFill>
  );
};

/** 8: low angle at the hem: the cow's tail swishing in the ferns */
export const S08: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1, dx: 0, dy: 0 };
  const reveal = ramp(t, wordAt(8, /long/, 0.3) - 0.4, wordAt(8, /tail/, 0.8));
  const swish = 0.4 + 0.6 * Math.sin(t * 2.4) * reveal;
  return (
    <AbsoluteFill style={{ backgroundColor: WC.skyLow }}>
      <Live cam={cam}>
        <defs><linearGradient id="w8s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={WC.skyMid} /><stop offset="0.55" stopColor={WC.skyLow} /><stop offset="0.75" stopColor="#4f5a3e" /><stop offset="1" stopColor="#0f1711" /></linearGradient></defs>
        <rect x={0} y={0} width={1296} height={2304} fill="url(#w8s)" />
        <Glow id="w8g" x={420} y={1300} r={500} o={0.9} />
        <Huldra id="w8h" x={1050} y={1430 - 20 * p} h={3400} view="back" hem={0.3 + 0.2 * Math.sin(t * 2)} tail={reveal} swish={swish} sway={0} />
        {[0, 1, 2, 3, 4, 5].map((i) => fern(120 + i * 220, 1980 + (i % 2) * 80, 2.2, i % 2 ? WC.ink : WC.fern, i))}
      </Live>
    </AbsoluteFill>
  );
};

/** 9: boy's profile in golden light, swallowing */
export const S09: React.FC = () => {
  const { t } = useShot();
  const cam: Cam = { zoom: 1, dx: 0, dy: 0 };
  const g0 = wordAt(9, /Don't/, 0.35);
  const gulp = ramp(t, g0, g0 + 0.25) - ramp(t, g0 + 0.35, g0 + 0.6);
  const bl = (t % 3.1) > 2.95 ? 1 : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: WC.skyLow }}>
      <BandImg id="woods/sky" k={0.3} cam={{ zoom: 1.4, dx: 0, dy: 0, oy: 900 }} />
      <BandImg id="woods/far" k={0.5} cam={{ zoom: 1.6, dx: 0, dy: 0, oy: 900 }} />
      <Live cam={cam}>
        <Glow id="w9g" x={1000} y={900} r={600} o={0.9} />
        <BoyProfile x={500} y={1050} s={2.4} gulp={gulp} blink={bl} />
      </Live>
    </AbsoluteFill>
  );
};

/** 10: smile drops, she turns: hollow bark back */
export const S10: React.FC = () => {
  const { t } = useShot();
  const cam: Cam = { zoom: 1.2, dx: -40, dy: 0, oy: 1000 };
  const drop = ramp(t, wordAt(10, /dropped/, 0.15), wordAt(10, /dropped/, 0.2, 'end'));
  const t0 = wordAt(10, /turned/, 0.3), t1 = wordAt(10, /around/, 0.38, 'end');
  const turn = ramp(t, t0, t1);
  const sx = Math.max(0.04, Math.abs(Math.cos(turn * Math.PI)));
  const view = turn < 0.5 ? 'front' : 'back';
  return (
    <AbsoluteFill style={{ backgroundColor: WC.skyLow }}>
      <Bg cam={cam} fg={false} />
      <Live k={0.9} cam={cam}>
        <Glow id="w10g" x={700} y={1000} r={460} o={0.7} />
        <g transform={`translate(700 0) scale(${sx} 1) translate(-700 0)`}>
          <Huldra id="w10h" x={700} y={1440} h={880} view={view} sway={Math.sin(t)} smile={1 - drop} tail={view === 'back' ? 1 : 0} swish={Math.sin(t * 2)} />
        </g>
      </Live>
      <BandImg id="woods/fg" k={1.25} cam={cam} />
    </AbsoluteFill>
  );
};
