import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, ramp, EIO } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { YuleCat, PawPrint } from '../art/farm_cat';

/** deterministic live snowfall in world space */
const Snow: React.FC<{ t: number; n?: number; seed?: number; size?: number; speed?: number; o?: number }> = ({ t, n = 90, seed = 1, size = 4, speed = 120, o = 1 }) => {
  let s = seed * 9301 + 49297;
  const r = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  return (
    <g fill="#e8eff7" opacity={o}>
      {Array.from({ length: n }, (_, i) => {
        const x0 = r() * 1296, y0 = r() * 2304, k = 0.5 + r(), ph = r() * 6.28;
        const y = (y0 + t * speed * k) % 2304;
        const x = x0 + Math.sin(t * 0.9 + ph) * 22 * k;
        return <circle key={i} cx={x} cy={y} r={size * k} opacity={0.3 + 0.5 * (k - 0.5)} />;
      })}
    </g>
  );
};

/** slow aurora breathing: extra glow ribbon on top of the baked sky */
const AuroraLive: React.FC<{ t: number; o: number }> = ({ t, o }) => (
  <g opacity={o * (0.55 + 0.25 * Math.sin(t * 0.8))}>
    <defs>
      <linearGradient id="faL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6fe3a6" stopOpacity="0" /><stop offset="0.8" stopColor="#9effc8" stopOpacity="0.45" /><stop offset="1" stopColor="#6fe3a6" stopOpacity="0" /></linearGradient>
    </defs>
    <path d={`M -100 ${600 + 20 * Math.sin(t * 0.5)} C 250 ${420 + 30 * Math.sin(t * 0.7)} 500 760 760 600 C 1000 450 1150 620 1400 520 L 1400 700 C 1150 820 1000 640 760 800 C 500 960 250 700 -100 820 Z`} fill="url(#faL)" />
  </g>
);

/** shot 1 — wide snowy farm under the aurora, slow push-in */
export const S01: React.FC = () => {
  const { p, t } = useShot();
  const z = 1 + 0.16 * EIO(p);
  const cam: Cam = { zoom: z, dx: 0, dy: 0, oy: 1220 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#050812' }}>
      <BandImg id="farm/sky" k={0.3} cam={cam} />
      <Live k={0.3} cam={cam}><AuroraLive t={t} o={1} /></Live>
      <BandImg id="farm/mtn" k={0.55} cam={cam} />
      <BandImg id="farm/land" k={1} cam={cam} />
      <Live k={1.1} cam={cam}><Snow t={t} n={50} seed={3} size={3} speed={60} /></Live>
      <BandImg id="farm/fg" k={1.3} cam={cam} />
    </AbsoluteFill>
  );
};

/** shot 7 — locked wide, snow falls, aurora fades, silence */
export const S07: React.FC = () => {
  const { t } = useShot();
  const cam: Cam = { zoom: 1.06, dx: 0, dy: 0, oy: 1220 };
  const q = ramp(t, wordAt(7, /^And/, 0.45), wordAt(7, /quiet/, 0.85, 'end'));
  return (
    <AbsoluteFill style={{ backgroundColor: '#050812' }}>
      <BandImg id="farm/sky" k={0.3} cam={cam} />
      <Live k={0.3} cam={cam}>
        <AuroraLive t={t} o={1 - q} />
        <rect x={0} y={0} width={1296} height={2304} fill="#070a12" opacity={0.25 + 0.4 * q} />
      </Live>
      <BandImg id="farm/mtn" k={0.55} cam={cam} />
      <Live k={0.55} cam={cam}><Snow t={t} n={60} seed={11} size={2.2} speed={50} o={0.7} /></Live>
      <BandImg id="farm/land" k={1} cam={cam} />
      <Live k={1.1} cam={cam}><Snow t={t} n={90} seed={7} size={4} speed={90} /></Live>
      <BandImg id="farm/fg" k={1.3} cam={cam} />
      <Live k={1.3} cam={cam}><Snow t={t} n={14} seed={5} size={9} speed={150} o={0.6} /></Live>
    </AbsoluteFill>
  );
};

/** shot 10 — the giant cat turns away and walks over the ridge; slow pull-back */
export const S10: React.FC = () => {
  const { p, t } = useShot();
  const z = 1.22 - 0.2 * EIO(p);
  const cam: Cam = { zoom: z, dx: 0, dy: 0, oy: 1000 };
  const turn = ramp(t, wordAt(10, /turned/, 0.15), wordAt(10, /away/, 0.3, 'end'));
  const walk = ramp(t, wordAt(10, /^And/, 0.35), wordAt(10, /sound/, 0.95, 'end'), (x) => x);
  const cx = 530 + 190 * walk, cy = 1215 - 20 * walk, cs = 0.82 - 0.18 * walk;
  return (
    <AbsoluteFill style={{ backgroundColor: '#050812' }}>
      <BandImg id="farm/sky" k={0.3} cam={cam} />
      <Live k={0.3} cam={cam}><AuroraLive t={t} o={1} /></Live>
      <Live k={0.5} cam={cam}><YuleCat id="fc10" x={cx} y={cy} s={cs} walk={walk * 9} look={1 - turn} eyes={1 - 0.85 * turn} /></Live>
      <BandImg id="farm/mtn" k={0.55} cam={cam} />
      <BandImg id="farm/land" k={1} cam={cam} />
      <Live k={1.1} cam={cam}><Snow t={t} n={30} seed={9} size={3} speed={40} o={0.7} /></Live>
      <BandImg id="farm/fg" k={1.3} cam={cam} />
    </AbsoluteFill>
  );
};

const PRINTS: [number, number, number, number][] = [
  [560, 1590, 1.55, -8], [370, 1530, 1.22, 10], [300, 1478, 0.95, -6], [210, 1432, 0.74, 8], [300, 1398, 0.56, -4], [235, 1370, 0.42, 5],
];

/** shot 11 — dawn, giant paw prints in the snow; slow pull-back */
export const S11: React.FC = () => {
  const { p, t } = useShot();
  const z = 1.25 - 0.22 * EIO(p);
  const cam: Cam = { zoom: z, dx: 0, dy: 0, ox: 430, oy: 1150 };
  const door = ramp(t, wordAt(11, /door/, 0.85) - 0.6, wordAt(11, /door/, 0.9, 'end'));
  return (
    <AbsoluteFill style={{ backgroundColor: '#1a2030' }}>
      <BandImg id="farm/sky" k={0.3} cam={cam} />
      <Live k={0.3} cam={cam}>
        <defs>
          <linearGradient id="fdawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2b3a5c" stopOpacity="0.88" /><stop offset="0.25" stopColor="#6a6f9a" stopOpacity="0.85" /><stop offset="0.38" stopColor="#e8a58c" stopOpacity="0.85" /><stop offset="0.43" stopColor="#ffd6a0" stopOpacity="0.6" /><stop offset="0.5" stopColor="#ffd6a0" stopOpacity="0.15" /><stop offset="0.6" stopColor="#ffd6a0" stopOpacity="0" /></linearGradient>
        </defs>
        <radialGradient id="fsun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fff1d6" stopOpacity="0.75" /><stop offset="0.4" stopColor="#ffc98f" stopOpacity="0.35" /><stop offset="1" stopColor="#ffc98f" stopOpacity="0" /></radialGradient>
        <rect x={0} y={0} width={1296} height={2304} fill="url(#fdawn)" />
        <ellipse cx={420} cy={1070} rx={520} ry={240} fill="url(#fsun)" />
      </Live>
      <BandImg id="farm/mtn" k={0.55} cam={cam} />
      <BandImg id="farm/land" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <defs><linearGradient id="fdSnow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff0e0" stopOpacity="0.45" /><stop offset="0.5" stopColor="#f3e6e0" stopOpacity="0.3" /><stop offset="1" stopColor="#f3e6e0" stopOpacity="0.08" /></linearGradient></defs>
        <rect x={0} y={1478} width={1296} height={826} fill="url(#fdSnow)" />
        {PRINTS.map(([x, y, s, r], i) => <PawPrint key={i} x={x} y={y} s={s} rot={r} dark="#5f7396" lip="#fffaf2" />)}
        {/* human-size door reference beside the nearest print */}
        <g opacity={0.0 + 0.0 * door} />
      </Live>
      <BandImg id="farm/fg" k={1.3} cam={cam} />
    </AbsoluteFill>
  );
};
