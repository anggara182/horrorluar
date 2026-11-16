import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, handheld, ramp, EIO, EOUT } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { Lantern, FireBin, Walker, LANTERNS, gx, gy, COL } from '../art/street_figs';

const BG = '#0c0a12';
const CAM0: Cam = { zoom: 1, dx: 0, dy: 0 };

const Defs: React.FC = () => (
  <defs>
    <radialGradient id="lanGlow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ff8a5c" stopOpacity="0.55" /><stop offset="0.4" stopColor="#e0402f" stopOpacity="0.18" /><stop offset="1" stopColor="#e0402f" stopOpacity="0" /></radialGradient>
    <radialGradient id="fireGlow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffb057" stopOpacity="0.55" /><stop offset="0.5" stopColor="#ff8a5c" stopOpacity="0.15" /><stop offset="1" stopColor="#ff8a5c" stopOpacity="0" /></radialGradient>
  </defs>
);

/** all lanterns along the facades, swaying gently (amp in degrees) */
const Lanterns: React.FC<{ t: number; amp?: number }> = ({ t, amp = 3 }) => (
  <>
    {LANTERNS.map(([bx, s, up], i) => (
      <Lantern key={i} x={gx(bx < 650 ? 40 : 1260, s)} y={gy(s) - up * s} s={s * 1.4} sway={amp * Math.sin(t * 1.4 + i * 0.9)} />
    ))}
  </>
);

/** the wide street: bg band, live lanterns + offering fire, optional walker, fg framing */
const Street: React.FC<{ cam: Cam; t: number; amp?: number; bin?: { x: number; y: number; s: number }; children?: React.ReactNode }> = ({ cam, t, amp, bin, children }) => (
  <AbsoluteFill style={{ backgroundColor: BG }}>
    <BandImg id="street/bg" k={0.9} cam={cam} />
    <Live k={0.9} cam={cam}><Defs /><Lanterns t={t} amp={amp} />{bin && <FireBin {...bin} t={t} />}</Live>
    {children}
    <BandImg id="street/fg" k={1.2} cam={cam} />
  </AbsoluteFill>
);

/** shot 1 — wide lantern-lit street at night, an offering fire on the kerb. Slow push-in toward the glowing end. */
export const S01: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1 + 0.18 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: 540, oy: 860 };
  return <Street cam={cam} t={t} bin={{ x: gx(1150, 0.36), y: gy(0.36), s: 0.62 }} />;
};

/** shot 5 — tracking from behind: she walks home, an offering bin burns at the right kerb and slides past. */
export const S05: React.FC = () => {
  const { p, t } = useShot();
  const hh = handheld(t, 0.4);
  const cam: Cam = { zoom: 1.08, dx: 0, dy: 0, ox: 540, oy: 900, tx: hh.hx, ty: hh.hy };
  const bs = 0.3 + 0.32 * p; // bin approaches as we walk
  return (
    <Street cam={cam} t={t} bin={{ x: gx(1320, bs), y: gy(bs), s: bs * 1.6 }}>
      <Live k={1} cam={CAM0}>
        <ellipse cx={560} cy={1520} rx={150} ry={26} fill="#000" opacity={0.45} />
        <Walker x={560} y={1520} h={860} phase={t * 0.95} amp={0.9} />
      </Live>
    </Street>
  );
};

/** shot 6 — locked: the empty wet street behind her, lanterns swaying, nobody there. */
export const S06: React.FC = () => {
  const { t, p } = useShot();
  const cam: Cam = { zoom: 1.12, dx: 0, dy: -30, ox: 540, oy: 900 };
  const amp = 2 + 5 * ramp(p, 0.3, 0.9);
  return <Street cam={cam} t={t} amp={amp} bin={{ x: gx(160, 0.42), y: gy(0.42), s: 0.7 }} />;
};

/** her feet, sneakers + jeans cuffs. lift 0..1 per foot */
const Foot: React.FC<{ x: number; y: number; lift: number; s?: number }> = ({ x, y, lift, s = 1 }) => {
  const yy = y - lift * 70;
  return (
    <g transform={`translate(${x},${yy}) scale(${s}) rotate(${-lift * 10})`}>
      <path d="M -60 -420 L 60 -420 L 66 -90 L -66 -90 Z" fill={COL.jeans} />
      <path d="M 60 -420 L 66 -90" stroke={COL.glow} strokeWidth={6} opacity={0.6} />
      <path d="M -70 -100 L 70 -100 L 82 -30 Q 90 10 60 14 L -60 14 Q -96 10 -90 -30 Z" fill="#d8d2c8" />
      <path d="M -92 -6 L 86 -6 L 82 14 L -90 14 Z" fill="#8a837a" />
      <path d="M -60 -100 Q 0 -120 60 -100" stroke={COL.glow} strokeWidth={5} fill="none" opacity={0.7} />
    </g>
  );
};

/** shot 7 — low angle on wet pavement: her feet walking faster; on "footsteps" a second shadow joins hers. */
export const S07: React.FC = () => {
  const { t, p } = useShot();
  const tF = wordAt(7, /^footsteps/i, 0.5);
  const sec = t;
  const speed = 1.3 + 0.9 * ramp(p, 0.1, 0.4);
  const ph = sec * speed;
  const l1 = Math.max(0, Math.sin(ph * Math.PI * 2)), l2 = Math.max(0, -Math.sin(ph * Math.PI * 2));
  const shadow2 = ramp(sec, tF - 0.2, tF + 0.6, EOUT);
  const scroll = (sec * 260 * speed) % 240;
  return (
    <AbsoluteFill style={{ backgroundColor: '#0e0b0d' }}>
      <Live k={1} cam={CAM0}>
        <defs>
          <linearGradient id="t7pave" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5a322a" /><stop offset="0.35" stopColor="#2a1c1c" /><stop offset="1" stopColor="#0e0b0d" /></linearGradient>
          <radialGradient id="t7lamp" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffb07a" stopOpacity="0.9" /><stop offset="0.4" stopColor="#ff8a5c" stopOpacity="0.35" /><stop offset="1" stopColor="#e0402f" stopOpacity="0" /></radialGradient>
          <linearGradient id="t7sh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#050304" stopOpacity="0.85" /><stop offset="1" stopColor="#050304" stopOpacity="0.2" /></linearGradient>
        </defs>
        {/* far wall + shutters at top, lantern light behind */}
        <rect x={0} y={0} width={1296} height={760} fill="#1e1616" />
        {[0, 1, 2, 3].map((i) => <rect key={i} x={150 + i * 260} y={300} width={220} height={460} fill={COL.shutter} opacity={0.7} />)}
        <ellipse cx={560} cy={640} rx={700} ry={420} fill="url(#t7lamp)" />
        <rect x={0} y={740} width={1296} height={1564} fill="url(#t7pave)" />
        {/* paving joints scrolling toward camera */}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => { const y = 760 + ((i * 240 + scroll) % 1680); const k = (y - 740) / 1560; return <line key={i} x1={0} y1={y} x2={1296} y2={y} stroke="#0a0708" strokeWidth={3 + 6 * k} opacity={0.6} />; })}
        {/* reflected lantern streak */}
        <rect x={520} y={760} width={80} height={600} fill="#ff8a5c" opacity={0.18} />
        {/* her shadow (towards camera) */}
        <path d="M 520 1330 L 700 1330 L 860 2304 L 380 2304 Z" fill="url(#t7sh)" />
        {/* the second shadow: nobody casts it */}
        <g opacity={shadow2}>
          <path d="M 300 1220 L 400 1220 L 430 1900 L 120 1900 Z" fill="#050304" opacity={0.8} />
          <ellipse cx={270} cy={2020} rx={150} ry={170} fill="#050304" opacity={0.8} />
        </g>
        <Foot x={530} y={1330} lift={l1} />
        <Foot x={720} y={1350} lift={l2} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 8 — close over her shoulder: a thin pale grey hand comes to rest on the hoodie and taps on "tapped". */
export const S08: React.FC = () => {
  const { t } = useShot();
  const tH = wordAt(8, /^hand/i, 0.45);
  const tT = wordAt(8, /^tapped/i, 0.6);
  const reach = ramp(t, tH - 1.2, tH + 0.2, EOUT);
  const tap = Math.max(0, Math.sin(Math.min(1, Math.max(0, (t - tT) / 0.5)) * Math.PI * 2)) * 18;
  const hx = -260 * (1 - reach), hy = -320 * (1 - reach) - tap;
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="street/close" k={0.7} cam={{ zoom: 1.05 + 0.03 * t / 4, dx: 0, dy: 0 }} />
      <Live k={1} cam={CAM0}>
        <defs>
          <linearGradient id="t8hood" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3a4352" /><stop offset="1" stopColor="#151a22" /></linearGradient>
          <linearGradient id="t8arm" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8d9096" stopOpacity="0" /><stop offset="0.45" stopColor="#9a9ea6" stopOpacity="0.7" /><stop offset="1" stopColor="#c9ccd1" /></linearGradient>
        </defs>
        {/* back of her head + ponytail (right) */}
        <ellipse cx={1000} cy={760} rx={250} ry={290} fill="#0d0a0b" />
        <path d="M 1060 900 Q 1120 1100 1060 1240 L 980 1230 Q 1020 1080 980 920 Z" fill="#0d0a0b" />
        <path d="M 790 640 Q 820 500 960 470" stroke={COL.glow} strokeWidth={8} fill="none" opacity={0.8} />
        {/* hoodie shoulder */}
        <path d="M 1400 2400 L 1400 1060 Q 1150 960 900 1000 Q 640 1040 380 1180 Q 220 1270 160 1500 L 120 2400 Z" fill="url(#t8hood)" />
        <path d="M 900 1000 Q 640 1040 380 1180 Q 220 1270 160 1500" stroke={COL.hoodieRim} strokeWidth={9} fill="none" opacity={0.75} />
        {/* bunched hood */}
        <path d="M 760 1010 Q 920 1150 1200 1080 Q 1260 1020 1180 960 Q 960 1040 800 960 Z" fill="#232a36" />
        {/* the pale hand from top-left */}
        <g transform={`translate(${hx},${hy})`}>
          <path d="M -120 180 L 20 120 L 470 1010 L 380 1060 Z" fill="url(#t8arm)" />
          <path d="M 20 120 L 470 1010" stroke="#eef0f3" strokeWidth={5} opacity={0.6} />
          {/* palm + long fingers draped over the shoulder */}
          <path d="M 360 1000 Q 430 960 520 1010 Q 560 1060 540 1110 L 390 1120 Q 350 1060 360 1000 Z" fill={COL.pale} />
          {[[400, 1110, 380, 1250], [440, 1112, 440, 1270], [480, 1108, 500, 1255], [520, 1100, 560, 1220]].map(([x1, y1, x2, y2], i) => (
            <path key={i} d={`M ${x1} ${y1} Q ${x1 + (x2 - x1) * 0.3 - 6} ${(y1 + y2) / 2} ${x2} ${y2}`} stroke={COL.pale} strokeWidth={26 - i * 2} strokeLinecap="round" fill="none" />
          ))}
          <path d="M 370 1040 Q 330 1080 320 1150" stroke={COL.pale} strokeWidth={24} strokeLinecap="round" fill="none" />
          {[[380, 1250], [440, 1270], [500, 1255], [560, 1220]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={6} fill="#9a9ea6" />)}
          <path d="M 520 1010 Q 560 1060 540 1110" stroke="#ffffff" strokeWidth={4} fill="none" opacity={0.6} />
        </g>
      </Live>
    </AbsoluteFill>
  );
};

/** shot 9 — close profile in red lantern light, eyes wide forward, refusing to turn. Very slow push. */
export const S09: React.FC = () => {
  const { p, t } = useShot();
  const tL = wordAt(9, /^look/i, 0.85);
  const glance = ramp(t, tL - 0.3, tL + 0.2) * 10; // iris strains toward the back
  const cam: Cam = { zoom: 1 + 0.08 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: 520, oy: 820 };
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="street/close" k={0.6} cam={{ ...cam, dx: 40 }} />
      <Live k={1} cam={cam}>
        <defs>
          <linearGradient id="t9face" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#d06a4c" /><stop offset="0.35" stopColor="#8a4436" /><stop offset="1" stopColor="#2a1717" /></linearGradient>
          <radialGradient id="t9lan" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ff8a5c" stopOpacity="0.8" /><stop offset="0.5" stopColor="#e0402f" stopOpacity="0.25" /><stop offset="1" stopColor="#e0402f" stopOpacity="0" /></radialGradient>
        </defs>
        <ellipse cx={180} cy={700} rx={420} ry={420} fill="url(#t9lan)" />
        <g transform="translate(700,900) scale(1.25)">
          {/* hoodie at the neck */}
          <path d="M -260 640 Q -200 380 -90 330 L 230 330 Q 380 420 420 640 Z" fill="#1c222c" />
          <path d="M -260 640 Q -200 380 -90 330" stroke={COL.hoodieRim} strokeWidth={6} fill="none" opacity={0.7} />
          {/* neck */}
          <path d="M -80 220 L -90 360 L 200 360 L 190 220 Z" fill="#3a2220" />
          {/* face profile looking left */}
          <path d="M 40 -300 Q -120 -290 -150 -170 Q -168 -90 -172 -40 Q -205 10 -222 44 Q -214 64 -182 70 Q -186 92 -184 104 Q -170 114 -174 124 Q -184 140 -176 158 Q -168 196 -132 230 Q -96 252 -40 250 L 200 250 L 270 -120 Q 220 -300 40 -300 Z" fill="url(#t9face)" />
          {/* lantern rim on the profile */}
          <path d="M -150 -170 Q -168 -90 -172 -40 Q -205 10 -222 44 Q -214 64 -182 70 Q -186 92 -184 104 Q -170 114 -174 124 Q -184 140 -176 158 Q -168 196 -132 230" stroke="#ffb07a" strokeWidth={6} fill="none" />
          {/* wide eye */}
          <path d="M -150 -52 Q -122 -76 -92 -54 Q -120 -30 -150 -52 Z" fill="#efe2d6" />
          <circle cx={-136 + glance * 0.6} cy={-53} r={11} fill="#140c0c" />
          <path d="M -156 -56 Q -122 -86 -86 -58" stroke="#140c0c" strokeWidth={6} fill="none" />
          <path d="M -160 -96 Q -124 -112 -84 -98" stroke="#1a0f0f" strokeWidth={9} strokeLinecap="round" fill="none" />
          {/* hair: big mass + strands + ponytail */}
          <path d="M -150 -170 Q -120 -330 60 -330 Q 260 -320 300 -120 Q 310 60 260 230 L 150 260 Q 200 80 150 -60 Q 60 -180 -60 -200 Q -110 -195 -150 -170 Z" fill="#0d0a0b" />
          <path d="M 280 -60 Q 400 40 360 300 Q 340 380 300 400 Q 320 260 250 120 Z" fill="#0d0a0b" />
          <path d="M -140 -180 Q -100 -310 60 -322" stroke="#ff8a5c" strokeWidth={6} fill="none" opacity={0.8} />
          <path d="M -60 -200 Q 40 -170 140 -40 M 0 -260 Q 120 -220 200 -60" stroke="#2a1d1d" strokeWidth={5} fill="none" />
          {/* ear peeking under hair */}
          <ellipse cx={130} cy={20} rx={30} ry={46} fill="#5a2c26" />
        </g>
      </Live>
    </AbsoluteFill>
  );
};
