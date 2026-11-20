import React from 'react';
import { AbsoluteFill, Easing } from 'remotion';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { loadFont as loadOswald } from '@remotion/google-fonts/Oswald';
import { useShot, ramp, EIO, EOUT } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { GREEN } from '../comp/Overlays';

const { fontFamily: cinzel } = loadCinzel('normal', { weights: ['700'], subsets: ['latin'] });
const { fontFamily: oswald } = loadOswald('normal', { weights: ['400', '600', '700'], subsets: ['latin'] });

const ORB = '#e9fbff';
const CYAN = GREEN; // #7fe3ff
const PALE = '#e8eef2';
const FIRE = '#ff9b4a';
const EBACK = Easing.out(Easing.back(1.6));
const FULL: React.CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%' };

/* deterministic star field */
const STARS = (() => {
  let s = 30;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  return Array.from({ length: 140 }, () => ({ x: r() * 1080, y: r() * 1300, r: 0.8 + r() * 2.2, o: 0.25 + r() * 0.65, ph: r() * 6.28 }));
})();

const Defs: React.FC<{ id: string }> = ({ id }) => (
  <defs>
    <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#05070f" />
      <stop offset="0.45" stopColor="#0b1020" />
      <stop offset="0.68" stopColor="#1d2238" />
      <stop offset="0.74" stopColor="#3a2a2e" />
    </linearGradient>
    <linearGradient id={`${id}-ground`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#3a2a2e" />
      <stop offset="0.35" stopColor="#24191c" />
      <stop offset="1" stopColor="#0c0809" />
    </linearGradient>
    <radialGradient id={`${id}-milky`} cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#a9b6e0" stopOpacity={0.2} />
      <stop offset="0.5" stopColor="#7f8fbf" stopOpacity={0.08} />
      <stop offset="1" stopColor="#7f8fbf" stopOpacity={0} />
    </radialGradient>
    <radialGradient id={`${id}-halo`} cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor={ORB} stopOpacity={0.95} />
      <stop offset="0.12" stopColor={CYAN} stopOpacity={0.55} />
      <stop offset="0.45" stopColor={CYAN} stopOpacity={0.14} />
      <stop offset="1" stopColor={CYAN} stopOpacity={0} />
    </radialGradient>
    <radialGradient id={`${id}-core`} cx="0.42" cy="0.4" r="0.6">
      <stop offset="0" stopColor="#ffffff" />
      <stop offset="0.6" stopColor={ORB} />
      <stop offset="1" stopColor={CYAN} />
    </radialGradient>
    <radialGradient id={`${id}-fire`} cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor={FIRE} stopOpacity={0.7} />
      <stop offset="0.4" stopColor={FIRE} stopOpacity={0.18} />
      <stop offset="1" stopColor={FIRE} stopOpacity={0} />
    </radialGradient>
    <radialGradient id={`${id}-text`} cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#05070f" stopOpacity={0.7} />
      <stop offset="1" stopColor="#05070f" stopOpacity={0} />
    </radialGradient>
  </defs>
);

const Sky: React.FC<{ id: string; t: number; hz: number }> = ({ id, t, hz }) => (
  <g>
    <rect width={1080} height={1920} fill={`url(#${id}-sky)`} />
    <g transform={`rotate(-28 540 ${hz - 820})`}>
      <ellipse cx={540} cy={hz - 820} rx={900} ry={170} fill={`url(#${id}-milky)`} />
      <ellipse cx={420} cy={hz - 830} rx={420} ry={80} fill={`url(#${id}-milky)`} />
    </g>
    {STARS.filter((s) => s.y < hz - 40).map((s, i) => (
      <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#dfe8ff" opacity={s.o * (0.8 + 0.2 * Math.sin(t * 1.5 + s.ph))} />
    ))}
  </g>
);

/** distant low ridge + ground plane */
const Ground: React.FC<{ id: string; hz: number }> = ({ id, hz }) => (
  <g>
    <path d={`M 0 ${hz} L 0 ${hz - 34} Q 160 ${hz - 60} 300 ${hz - 30} Q 420 ${hz - 8} 560 ${hz - 22} Q 760 ${hz - 70} 900 ${hz - 40} Q 1000 ${hz - 22} 1080 ${hz - 36} L 1080 ${hz} Z`} fill="#2a1f27" />
    <rect x={0} y={hz} width={1080} height={1920 - hz} fill={`url(#${id}-ground)`} />
  </g>
);

/** spinifex clump: domed tuft of spiky blades */
const Spinifex: React.FC<{ x: number; y: number; s: number; fill: string; rim?: string }> = ({ x, y, s, fill, rim }) => {
  const blades = [-1, -0.7, -0.4, -0.15, 0.1, 0.35, 0.6, 0.85, 1.05];
  const d = blades.map((b, i) => {
    const bx = x + b * 70 * s, h = (60 + (i % 3) * 22 - Math.abs(b) * 20) * s;
    return `M ${bx - 10 * s} ${y} L ${bx + b * 26 * s} ${y - h} L ${bx + 10 * s} ${y}`;
  }).join(' ');
  return (
    <g>
      <path d={`M ${x - 95 * s} ${y + 2} Q ${x} ${y - 70 * s} ${x + 95 * s} ${y + 2} Z`} fill={fill} />
      <path d={d} fill={fill} />
      {rim && <path d={`M ${x - 60 * s} ${y - 36 * s} Q ${x} ${y - 72 * s} ${x + 60 * s} ${y - 36 * s}`} fill="none" stroke={rim} strokeWidth={3 * s} opacity={0.5} />}
    </g>
  );
};

/** lone dead gum tree silhouette */
const DeadGum: React.FC<{ x: number; y: number; s: number; fill?: string; flip?: boolean }> = ({ x, y, s, fill = '#1a1512', flip }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <path d="M -40 0 Q -22 -200 -18 -420 Q -60 -520 -150 -600 L -138 -612 Q -50 -545 -8 -470 Q 0 -600 -30 -720 L -16 -724 Q 18 -600 14 -480 Q 60 -560 140 -620 L 150 -606 Q 70 -540 24 -420 Q 22 -200 44 0 Z" fill={fill} />
    <path d="M -150 -600 Q -200 -640 -230 -700 M -150 -600 Q -170 -560 -230 -540 M 140 -620 Q 170 -690 210 -720 M 140 -620 Q 200 -615 250 -650 M -30 -720 Q -50 -780 -40 -820" stroke={fill} strokeWidth={10} fill="none" strokeLinecap="round" />
  </g>
);

const Orb: React.FC<{ id: string; x: number; y: number; r: number; o?: number }> = ({ id, x, y, r, o = 1 }) => (
  <g>
    <circle cx={x} cy={y} r={r * 9} fill={`url(#${id}-halo)`} opacity={o} />
    <circle cx={x} cy={y} r={r * 1.8} fill={CYAN} opacity={0.18 * o} />
    <circle cx={x} cy={y} r={r} fill={`url(#${id}-core)`} opacity={Math.min(1, 0.35 + o)} />
  </g>
);

/* ---------------- shot 2: title card ---------------- */
export const S02: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const a = ramp(p, 0.03, 0.3, EOUT);
  const b = ramp(p, 0.18, 0.45, EOUT);
  const lit = ramp(t, wordAt(2, /^Min/, 0.55) - 0.2, wordAt(2, /^Min/, 0.55) + 0.4, EOUT);
  const hz = 1250;
  const ox = 600 + Math.sin(t * 0.9) * 10, oy = 980 + Math.sin(t * 1.3) * 12 - 20 * z;
  const pulse = 0.85 + 0.15 * Math.sin(t * 2.4);
  const track = 0.12 - 0.04 * a;
  return (
    <AbsoluteFill style={{ backgroundColor: '#05070f' }}>
      <svg viewBox="0 0 1080 1920" style={{ ...FULL, transform: `scale(${1 + 0.06 * z})`, transformOrigin: '600px 1000px' }}>
        <Defs id="g2" />
        <Sky id="g2" t={t} hz={hz} />
        <Ground id="g2" hz={hz} />
        {/* ground glow under the orb */}
        <ellipse cx={ox} cy={hz + 40} rx={460} ry={90} fill="url(#g2-halo)" opacity={0.35 * pulse * (0.6 + 0.4 * lit)} />
        {/* mid scrub line */}
        {[[120, 1.0], [330, 0.7], [820, 0.9], [990, 0.65]].map(([x, s], i) => <Spinifex key={i} x={x} y={hz + 30} s={s} fill="#1e1518" />)}
        <Orb id="g2" x={ox} y={oy} r={28 + 6 * lit} o={(0.75 + 0.25 * lit) * (0.7 + 0.3 * pulse)} />
        {/* fg: dead gum framing left, big spinifex bottom */}
        <DeadGum x={150} y={1700} s={1.35} fill="#0d0a0b" />
        <path d="M 0 1560 Q 300 1500 560 1580 Q 820 1650 1080 1540 L 1080 1920 L 0 1920 Z" fill="#0d0a0b" />
        <Spinifex x={880} y={1580} s={2.1} fill="#0d0a0b" />
        <Spinifex x={420} y={1600} s={1.6} fill="#0d0a0b" />
      </svg>
      <AbsoluteFill style={{ alignItems: 'center', top: 300 }}>
        <svg viewBox="0 0 1080 500" style={{ position: 'absolute', top: -140, width: 1080, height: 500 }}>
          <Defs id="g2t" />
          <ellipse cx={540} cy={250} rx={520} ry={220} fill="url(#g2t-text)" opacity={a} />
        </svg>
        <div style={{
          fontFamily: cinzel, fontWeight: 700, fontSize: 116, lineHeight: 1, letterSpacing: `${track}em`, marginRight: `-${track}em`,
          color: '#f2fbff', opacity: a, transform: `translateY(${(1 - a) * 24}px)`, whiteSpace: 'nowrap',
        }}>MIN MIN</div>
        <div style={{
          fontFamily: cinzel, fontWeight: 700, fontSize: 116, lineHeight: 1.1, letterSpacing: `${track}em`, marginRight: `-${track}em`,
          color: CYAN, opacity: a, transform: `translateY(${(1 - a) * 24}px)`, whiteSpace: 'nowrap',
        }}>LIGHTS</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 30, opacity: b }}>
          <div style={{ width: 110 * b, height: 3, background: `linear-gradient(90deg, rgba(127,227,255,0), ${CYAN})` }} />
          <div style={{ fontFamily: oswald, fontWeight: 400, fontSize: 44, letterSpacing: '0.22em', color: '#b9cbe0', whiteSpace: 'nowrap' }}>OUTBACK · AUSTRALIA</div>
          <div style={{ width: 110 * b, height: 3, background: `linear-gradient(90deg, ${CYAN}, rgba(127,227,255,0))` }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** small back-view walker silhouette with a cold rim on the side facing the lights */
const Traveller: React.FC<{ x: number; y: number; s: number; t: number }> = ({ x, y, s, t }) => {
  const sw = Math.sin(t * 5) * 14;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={4} rx={60} ry={8} fill="#000" opacity={0.35} />
      <path d={`M -14 -92 L ${-16 - sw * 0.5} 0 L ${-4 - sw * 0.5} 0 L -2 -80 L 4 -80 L ${8 + sw * 0.5} 0 L ${20 + sw * 0.5} 0 L 16 -92 Z`} fill="#0d0a0b" />
      <path d="M -28 -168 Q -30 -176 -18 -180 L 18 -180 Q 30 -176 28 -168 L 20 -90 L -20 -90 Z" fill="#0d0a0b" />
      <path d={`M -26 -166 L ${-36 + sw * 0.3} -104 L ${-28 + sw * 0.3} -102 L -18 -150 Z M 26 -166 L ${36 - sw * 0.3} -104 L ${28 - sw * 0.3} -102 L 18 -150 Z`} fill="#0d0a0b" />
      <rect x={-6} y={-190} width={12} height={14} fill="#0d0a0b" />
      <ellipse cx={0} cy={-202} rx={14} ry={16} fill="#0d0a0b" />
      <ellipse cx={0} cy={-212} rx={30} ry={5} fill="#0d0a0b" />
      <path d="M -10 -224 Q 0 -232 10 -224 L 12 -212 L -12 -212 Z" fill="#0d0a0b" />
      <path d="M 26 -166 L 20 -92 M 14 -214 Q 16 -200 12 -190" stroke={CYAN} strokeWidth={3} fill="none" opacity={0.55} />
    </g>
  );
};

/* ---------------- shot 3: lore — trail of orbs drifting away into darkness ---------------- */
export const S03: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const hz = 900;
  const away = ramp(t, wordAt(3, /^Most/, 0.6), wordAt(3, /^away/, 0.95) + 0.4, EIO);
  const home = ramp(t, wordAt(3, /^Some/, 0.3), wordAt(3, /^home/, 0.58), EIO);
  // trail recedes along a winding path toward the horizon
  const N = 7;
  const drift = (t * 0.06 + away * 0.25) % 1;
  const orbs = Array.from({ length: N }, (_, i) => {
    const u = Math.min(1, (i + drift) / N); // 0 = near, 1 = far
    const depth = 1 - u;
    const x = 706 - 220 * depth + Math.sin(u * 7 + t * 0.6) * 70 * depth;
    const y = hz - 30 + depth * 420 - Math.sin(t * 1.3 + i) * 10 * depth;
    const r = 5 + 26 * depth * depth;
    const o = (0.25 + 0.75 * depth) * (1 - 0.55 * away * depth) * Math.min(1, depth * 6);
    return { x, y, r, o };
  });
  const step = 0.4 + 0.25 * home;
  return (
    <AbsoluteFill style={{ backgroundColor: '#05070f' }}>
      <svg viewBox="0 0 1080 1920" style={{ ...FULL, transform: `scale(${1.02 + 0.07 * z})`, transformOrigin: '700px 1000px' }}>
        <Defs id="g3" />
        <Sky id="g3" t={t} hz={hz} />
        <Ground id="g3" hz={hz} />
        {/* faint dirt track winding toward the horizon */}
        <path d={`M 120 1920 Q 380 1500 520 1180 Q 640 980 700 ${hz + 4} L 712 ${hz + 4} Q 690 1000 610 1190 Q 520 1500 620 1920 Z`} fill="#4a3434" opacity={0.55} />
        {/* small distant scrub */}
        {[[90, 0.4], [260, 0.32], [930, 0.42], [1010, 0.3], [470, 0.28]].map(([x, s], i) => <Spinifex key={i} x={x} y={hz + 30 + i * 8} s={s} fill="#1e1518" />)}
        <ellipse cx={orbs[0].x} cy={hz + 470} rx={300} ry={60} fill="url(#g3-halo)" opacity={0.4 * orbs[0].o} />
        {orbs.slice().reverse().map((o, i) => <Orb key={i} id="g3" x={o.x} y={o.y} r={o.r} o={Math.min(1, o.o * step * 2.2)} />)}
        {/* lone traveller walking toward the lights (back view, small) */}
        <Traveller x={250 + 40 * z} y={1370 - 20 * z} s={1.15 - 0.1 * z} t={t} />
        {/* fg silhouettes: dead gum right, scrub edge bottom */}
        <DeadGum x={990} y={1480} s={1.25} fill="#0d0a0b" flip />
        <path d="M 0 1420 Q 260 1380 480 1450 Q 700 1520 1080 1420 L 1080 1920 L 0 1920 Z" fill="#0d0a0b" />
        <Spinifex x={140} y={1450} s={1.9} fill="#0d0a0b" />
        <Spinifex x={880} y={1450} s={1.3} fill="#0d0a0b" />
      </svg>
    </AbsoluteFill>
  );
};

/* ---------------- shot 13: CTA end card ---------------- */
export const S13: React.FC = () => {
  const { t, sec } = useShot();
  const pop = (re: RegExp, fb: number) => {
    const at = Math.min(wordAt(13, re, fb), sec - 0.85);
    const k = ramp(t, at - 0.03, at + 0.25, EBACK);
    return { opacity: ramp(t, at - 0.03, at + 0.1, EOUT), transform: `scale(${0.6 + 0.4 * k})`, display: 'inline-block' } as React.CSSProperties;
  };
  const row: React.CSSProperties = { display: 'flex', gap: '0.28em', justifyContent: 'center', whiteSpace: 'nowrap' };
  const intro = ramp(t, 0, 0.5, EOUT);
  const pulse = 0.85 + 0.15 * Math.sin(t * 3);
  const flick = 0.85 + 0.1 * Math.sin(t * 11) + 0.05 * Math.sin(t * 23);
  const hz = 1560;
  return (
    <AbsoluteFill style={{ backgroundColor: '#05070f' }}>
      <svg viewBox="0 0 1080 1920" style={FULL}>
        <Defs id="g13" />
        <Sky id="g13" t={t} hz={hz} />
        <Ground id="g13" hz={hz} />
        {/* the orb, high and cold */}
        <Orb id="g13" x={540 + Math.sin(t * 0.8) * 8} y={430 + Math.sin(t * 1.2) * 10} r={36} o={intro * (0.6 + 0.4 * pulse)} />
        {/* campfire glow, warm, bottom */}
        <ellipse cx={540} cy={1650} rx={520} ry={260} fill="url(#g13-fire)" opacity={intro * flick} />
        <path d="M 0 1640 Q 300 1600 540 1660 Q 800 1610 1080 1650 L 1080 1920 L 0 1920 Z" fill="#0d0a0b" />
        {/* fire: logs + flames */}
        <g transform="translate(540 1700) scale(1.6) translate(-540 -1700)">
        <path d="M 460 1700 L 620 1660 L 626 1676 L 466 1716 Z M 460 1660 L 620 1700 L 614 1716 L 454 1676 Z" fill="#1a1210" />
        <path d={`M 500 1690 Q 495 1630 ${530 + Math.sin(t * 9) * 6} ${1560 - 10 * flick} Q 548 1620 560 1600 Q 590 1650 580 1690 Z`} fill={FIRE} opacity={0.95} />
        <path d={`M 520 1690 Q 520 1650 ${540 + Math.sin(t * 13) * 4} 1615 Q 562 1655 556 1690 Z`} fill="#ffd9a0" />
        </g>
        <DeadGum x={110} y={1700} s={0.95} fill="#0d0a0b" />
        <Spinifex x={930} y={1660} s={1.4} fill="#0d0a0b" />
      </svg>
      <AbsoluteFill style={{ alignItems: 'center', top: 720 }}>
        <div style={{ width: 920, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ ...row, fontFamily: oswald, fontWeight: 600, fontSize: 96, color: PALE, letterSpacing: '0.04em', lineHeight: 1.05 }}>
            <span style={pop(/^Would/, 0.07)}>WOULD</span>
            <span style={pop(/^you/, 0.17)}>YOU</span>
            <span style={pop(/^follow/, 0.25)}>FOLLOW</span>
          </div>
          <div style={{ ...row, fontFamily: cinzel, fontWeight: 700, fontSize: 132, color: CYAN, letterSpacing: '0.03em', lineHeight: 1.1 }}>
            <span style={pop(/^the$/, 0.33)}>THE</span>
            <span style={pop(/^light/, 0.42)}>LIGHT?</span>
          </div>
          <div style={{ width: 520 * intro, height: 3, margin: '48px 0 44px', background: `linear-gradient(90deg, rgba(232,238,242,0), ${PALE}, rgba(232,238,242,0))`, opacity: 0.45 }} />
          <div style={{ ...row, fontFamily: oswald, fontWeight: 400, fontSize: 76, color: PALE, letterSpacing: '0.06em', alignItems: 'baseline' }}>
            <span style={pop(/^Comment/, 0.52)}>COMMENT</span>
            <span style={{ ...pop(/^YES/, 0.62), color: CYAN, fontWeight: 700 }}>YES</span>
            <span style={pop(/^or$/, 0.72)}>OR</span>
            <span style={{ ...pop(/^NO/, 0.8), color: FIRE, fontWeight: 700 }}>NO</span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
