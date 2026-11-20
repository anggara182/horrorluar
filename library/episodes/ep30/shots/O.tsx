import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, ramp, EIO } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { OB, clump } from '../sets/outback';

const BG = '#060914';

/** The Min Min light: white core, cold cyan halo. Glow = radial gradients only. */
const Orb: React.FC<{ x: number; y: number; r: number; o?: number; pulse?: number; id: string }> = ({ x, y, r, o = 1, pulse = 1, id }) => (
  <g opacity={o}>
    <defs>
      <radialGradient id={`${id}H`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#7fe3ff" stopOpacity="0.55" />
        <stop offset="0.35" stopColor="#7fe3ff" stopOpacity="0.2" />
        <stop offset="1" stopColor="#7fe3ff" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${id}C`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#ffffff" stopOpacity="1" />
        <stop offset="0.45" stopColor="#e9fbff" stopOpacity="0.95" />
        <stop offset="1" stopColor="#bff3ff" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx={x} cy={y} r={r * 9 * pulse} fill={`url(#${id}H)`} />
    <circle cx={x} cy={y} r={r * 3.2 * (0.9 + 0.1 * pulse)} fill={`url(#${id}H)`} />
    <circle cx={x} cy={y} r={r * 1.6} fill={`url(#${id}C)`} />
    <circle cx={x} cy={y} r={r * 0.62} fill="#ffffff" />
  </g>
);

/** faint cold light the orb throws on the ground below it */
const GroundGlow: React.FC<{ x: number; y: number; rx: number; o: number; id: string }> = ({ x, y, rx, o, id }) => (
  <g opacity={o}>
    <defs>
      <radialGradient id={id} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#7fe3ff" stopOpacity="0.35" />
        <stop offset="1" stopColor="#7fe3ff" stopOpacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx={x} cy={y} rx={rx} ry={rx * 0.22} fill={`url(#${id})`} />
  </g>
);

/** cold sky glow around the orb, drawn BEHIND the land band so silhouettes read against it */
const SkyGlow: React.FC<{ x: number; y: number; r: number; o: number; id: string }> = ({ x, y, r, o, id }) => (
  <g opacity={o}>
    <defs><radialGradient id={id} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#3f6f96" stopOpacity="0.45" /><stop offset="0.6" stopColor="#24405e" stopOpacity="0.15" /><stop offset="1" stopColor="#1a2a44" stopOpacity="0" /></radialGradient></defs>
    <ellipse cx={x} cy={y} rx={r} ry={r * 0.85} fill={`url(#${id})`} />
  </g>
);

const Outback: React.FC<{ cam: Cam; children?: React.ReactNode; fg?: boolean; behind?: React.ReactNode }> = ({ cam, children, fg = true, behind }) => (
  <AbsoluteFill style={{ backgroundColor: BG }}>
    <BandImg id="outback/sky" k={0.6} cam={cam} />
    {behind}
    <BandImg id="outback/land" k={0.9} cam={cam} />
    {children}
    {fg && <BandImg id="outback/fg" k={1.2} cam={cam} />}
  </AbsoluteFill>
);

/** shot 1 — vast outback under the stars, one tiny cold light far away. Slow push-in. */
export const S01: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1 + 0.14 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: 440, oy: 1000 };
  const ox = 430 + 6 * Math.sin(t * 0.7), oy = OB.horizon - 70 + 8 * Math.sin(t * 1.1);
  return (
    <Outback cam={cam} behind={<Live k={0.9} cam={cam}><SkyGlow x={ox} y={oy} r={220} o={0.6} id="sg1" /></Live>}>
      <Live k={0.9} cam={cam}>
        <GroundGlow x={ox} y={OB.horizon + 18} rx={160} o={0.7} id="g1" />
        <Orb x={ox} y={oy} r={8} pulse={1 + 0.08 * Math.sin(t * 2.2)} id="o1" />
      </Live>
    </Outback>
  );
};

/** shot 5 — the light rises above the spinifex, lighting it faintly blue. Very slow push. */
export const S05: React.FC = () => {
  const { p, t, sec } = useShot();
  const ta = wordAt(5, /appeared/i, 0.45);
  const rise = ramp(t, ta - 1.4, ta + 1.2, EIO);
  const cam: Cam = { zoom: 1.25 + 0.08 * p, dx: 0, dy: 0, ox: 480, oy: 1150 };
  const ox = 470 + 10 * Math.sin(t * 0.6);
  const oy = OB.horizon + 60 - 260 * rise + 6 * Math.sin(t * 1.3);
  void sec;
  return (
    <Outback cam={cam} behind={<Live k={0.9} cam={cam}><SkyGlow x={ox} y={oy} r={420} o={0.3 + 0.6 * rise} id="sg5" /></Live>}>
      <Live k={0.9} cam={cam}>
        <GroundGlow x={ox} y={OB.horizon + 90} rx={300} o={0.3 + 0.7 * rise} id="g5" />
        <Orb x={ox} y={oy} r={14} o={0.35 + 0.65 * ramp(t, ta - 1.6, ta - 0.4)} pulse={1 + 0.07 * Math.sin(t * 2)} id="o5" />
        {clump(450, OB.horizon + 150, 130, '#160e12', 'm1', '#7fe3ff')}
        {clump(620, OB.horizon + 175, 95, '#140d10', 'm2', '#7fe3ff')}
      </Live>
    </Outback>
  );
};

/** shot 7 — medium: the orb comes closer, stops above the dead gum, halo pulsing. Locked. */
export const S07: React.FC = () => {
  const { t } = useShot();
  const ts = wordAt(7, /stopped/i, 0.45);
  const come = ramp(t, 0, ts, EIO);
  const cam: Cam = { zoom: 1.55, dx: 0, dy: 0, ox: 905, oy: 900 };
  const ox = 1020 - 90 * come, oy = 640 + 40 * (1 - come) + (t > ts ? 3 * Math.sin((t - ts) * 1.2) : 0);
  const r = 9 + 7 * come;
  const pulse = 1 + (t > ts ? 0.14 * Math.sin((t - ts) * 3) : 0.05 * Math.sin(t * 2));
  return (
    <Outback cam={cam} fg={false} behind={<Live k={0.9} cam={cam}>
        <defs><radialGradient id="sk7" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#3f6f96" stopOpacity="0.5" /><stop offset="0.6" stopColor="#24405e" stopOpacity="0.18" /><stop offset="1" stopColor="#1a2a44" stopOpacity="0" /></radialGradient></defs>
        <ellipse cx={ox} cy={oy + 60} rx={520 * (0.6 + 0.4 * come)} ry={460 * (0.6 + 0.4 * come)} fill="url(#sk7)" opacity={0.6 + 0.3 * come} />
      </Live>}>
      <Live k={0.9} cam={cam}>
        <GroundGlow x={OB.tree.x} y={OB.tree.y + 10} rx={260} o={0.4 + 0.5 * come} id="g7" />
        <Orb x={ox} y={oy} r={r} pulse={pulse} id="o7" />
        {clump(240, 1600, 230, '#0d090b', 'f1', '#7fe3ff')}
        {clump(1200, 1640, 260, '#0d090b', 'f2', '#7fe3ff')}
      </Live>
    </Outback>
  );
};

/** shot 10 — wide: the orb drifts backwards over the scrub, leaving a faint trail. Locked. */
export const S10: React.FC = () => {
  const { t } = useShot();
  const tp = wordAt(10, /pulled/i, 0.2);
  const back = ramp(t, tp - 0.4, tp + 2.6, EIO);
  const cam: Cam = { zoom: 1.08, dx: 0, dy: 0, ox: 600, oy: 1000 };
  const pos = (b: number) => ({ x: 560 + 160 * b, y: 1090 + 90 * b, r: 13 - 7 * b });
  const cur = pos(back);
  const trail = [0.04, 0.08, 0.12, 0.17, 0.22, 0.28, 0.35, 0.43].map((d, i) => ({ ...pos(Math.max(0, back - d)), i }));
  return (
    <Outback cam={cam} behind={<Live k={0.9} cam={cam}><SkyGlow x={cur.x} y={cur.y} r={460 - 200 * back} o={0.7} id="sg10" /></Live>}>
      <Live k={0.9} cam={cam}>
        <GroundGlow x={cur.x} y={OB.horizon + 40 + 40 * (1 - back)} rx={240 - 120 * back} o={0.8} id="g10" />
        {back > 0.02 && trail.map((q) => <circle key={q.i} cx={q.x} cy={q.y} r={q.r * (1.6 - q.i * 0.13)} fill="#7fe3ff" opacity={(0.26 - q.i * 0.03) * Math.min(1, back * 6)} />)}
        <Orb x={cur.x} y={cur.y + 5 * Math.sin(t * 1.2)} r={cur.r} pulse={1 + 0.06 * Math.sin(t * 2)} id="o10" />
      </Live>
    </Outback>
  );
};
