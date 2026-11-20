import React from 'react';
import { AbsoluteFill, Easing } from 'remotion';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { loadFont as loadOswald } from '@remotion/google-fonts/Oswald';
import { loadFont as loadDeva } from '@remotion/google-fonts/NotoSerifDevanagari';
import { useShot, ramp, EIO, EOUT } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { Footprint, SideFoot } from '../art/graphic_feet';

const { fontFamily: cinzel } = loadCinzel('normal', { weights: ['700'], subsets: ['latin'] });
const { fontFamily: oswald } = loadOswald('normal', { weights: ['400', '600', '700'], subsets: ['latin'] });
const { fontFamily: deva } = loadDeva('normal', { weights: ['600'], subsets: ['devanagari', 'latin'] });

const RED = '#a3162a';
const GOLD = '#d9a441';
const MOON = '#cfd6e6';
const ACC = '#ff6a3d';
const DUST = '#6e5a44';
const TREE = '#141310';
const EBACK = Easing.out(Easing.back(1.6));
const FULL: React.CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%' };

const Glint: React.FC = () => (
  <radialGradient id="gf-glint" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stopColor="#ffffff" stopOpacity={0.9} />
    <stop offset="0.3" stopColor={MOON} stopOpacity={0.35} />
    <stop offset="1" stopColor={MOON} stopOpacity={0} />
  </radialGradient>
);

/** hanging aerial roots of the banyan (deterministic). */
const ROOTS = [[60, 300, 1120], [130, 330, 980], [215, 360, 1260], [300, 380, 900], [790, 380, 860], [870, 350, 1040], [950, 320, 1180], [1030, 300, 960], [455, 400, 700], [700, 400, 640]];
const Roots: React.FC<{ t: number; col?: string; w?: number }> = ({ t, col = TREE, w = 1 }) => (
  <g>
    {ROOTS.map(([x, y0, y1], i) => {
      const sw = Math.sin(t * 0.7 + i * 1.3) * 10;
      return <path key={i} d={`M ${x} ${y0} Q ${x + 8 + sw * 0.5} ${(y0 + y1) / 2} ${x + sw} ${y1}`} stroke={col} strokeWidth={(i % 3 === 0 ? 9 : 5) * w} fill="none" strokeLinecap="round" />;
    })}
  </g>
);

/** Woman in red sari, seen from behind, pallu over the head, long black hair. Origin at feet centre; height ~ 560*s. */
const SariWoman: React.FC<{ x: number; y: number; s: number; t: number }> = ({ x, y, s, t }) => {
  const sway = Math.sin(t * 0.9) * 6;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {/* moon rim halo behind */}
      <ellipse cx={0} cy={-300} rx={170} ry={330} fill="url(#g2-rim)" />
      {/* hair falling down the back from under the pallu */}
      <path d={`M -34 -470 C -50 -380 -44 -260 ${-30 + sway} -170 L ${30 + sway} -170 C 44 -260 48 -380 34 -470 Z`} fill="#0b0909" />
      {/* sari body column: shoulders wider than waist, flares to hem */}
      <path d={`M -62 -455 C -78 -430 -84 -380 -74 -320 C -64 -260 -70 -170 -86 -80 C -96 -30 -104 -8 -110 0 L 112 0 C 104 -10 ${98 + sway} -40 88 -90 C 74 -170 70 -260 78 -320 C 86 -380 80 -430 64 -455 Z`} fill={RED} />
      {/* pallu over head and down the back */}
      <path d={`M -36 -548 C -40 -596 38 -596 38 -548 C 40 -515 34 -500 30 -488 C 56 -480 72 -466 76 -440 C 60 -360 ${40 + sway} -280 ${50 + sway} -210 L ${-6 + sway} -230 C -30 -330 -58 -420 -66 -452 C -56 -470 -38 -482 -32 -492 C -38 -510 -38 -530 -36 -548 Z`} fill="#7d0f1f" />
      {/* loose black hair spilling from under the pallu */}
      <path d={`M -40 -470 C -70 -420 -80 -340 ${-70 + sway} -250 C ${-64 + sway} -300 -60 -380 -30 -460 Z`} fill="#0b0909" />
      {[0, 1, 2].map((i) => <path key={i} d={`M ${-44 + i * 4} -460 C ${-74 - i * 6} -400 ${-82 - i * 4} -320 ${-74 - i * 8 + sway} ${-230 + i * 20}`} stroke="#0b0909" strokeWidth={3} fill="none" />)}
      {/* pleats */}
      {[-40, -8, 24, 56].map((px, i) => <path key={i} d={`M ${px * 0.6} -250 Q ${px * 0.9 + sway * 0.3} -120 ${px * 1.4} -4`} stroke="#6e0c19" strokeWidth={5} fill="none" opacity={0.7} />)}
      {/* gold borders: hem + pallu edge */}
      <path d={`M -110 -4 Q 0 12 112 -4`} stroke={GOLD} strokeWidth={10} fill="none" />
      <path d={`M 42 -540 C 56 -500 70 -470 74 -440 C 60 -360 ${40 + sway} -280 ${50 + sway} -210`} stroke={GOLD} strokeWidth={7} fill="none" />
      {/* moon rim on left edge */}
      <path d="M -36 -548 C -38 -520 -38 -505 -32 -492 C -40 -478 -56 -468 -66 -452 C -78 -430 -84 -380 -74 -320 C -64 -260 -70 -170 -86 -80" stroke="#ffd9d0" strokeWidth={4} fill="none" opacity={0.55} />
      {/* hint of hem shadow */}
      <ellipse cx={0} cy={4} rx={140} ry={14} fill="#000" opacity={0.45} />
    </g>
  );
};

/* ---------------- shot 2: title card ---------------- */
export const S02: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const a = ramp(p, 0.02, 0.28, EOUT);
  const b = ramp(t, wordAt(2, /^chudail/i, 0.7) - 0.35, wordAt(2, /^chudail/i, 0.7) + 0.2, EOUT);
  const track = 0.16 - 0.04 * a;
  return (
    <AbsoluteFill style={{ backgroundColor: '#070a12' }}>
      <svg viewBox="0 0 1080 1920" style={{ ...FULL, transform: `scale(${1 + 0.06 * z})`, transformOrigin: '620px 1050px' }}>
        <defs>
          <linearGradient id="g2-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#070a12" />
            <stop offset="0.5" stopColor="#1d2638" />
            <stop offset="0.68" stopColor="#3a4560" />
            <stop offset="1" stopColor="#0d0e12" />
          </linearGradient>
          <radialGradient id="g2-moon" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={MOON} stopOpacity={0.75} />
            <stop offset="0.4" stopColor="#8592ad" stopOpacity={0.3} />
            <stop offset="1" stopColor="#3a4560" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="g2-rim" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={MOON} stopOpacity={0.35} />
            <stop offset="1" stopColor={MOON} stopOpacity={0} />
          </radialGradient>
          <linearGradient id="g2-road" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8c7a64" />
            <stop offset="1" stopColor="#2a2219" />
          </linearGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#g2-sky)" />
        {/* moon glow behind the figure */}
        <ellipse cx={640} cy={900} rx={520} ry={520} fill="url(#g2-moon)" />
        <circle cx={720} cy={760} r={78} fill="#e8ecf4" opacity={0.92} />
        {/* far fields + village light */}
        <path d="M 0 1180 Q 300 1150 540 1170 Q 800 1190 1080 1160 L 1080 1320 L 0 1320 Z" fill="#1a1d22" />
        <circle cx={180} cy={1172} r={5} fill="#ffcf7a" />
        <circle cx={180} cy={1172} r={22} fill="url(#g2-rim)" />
        {/* dusty road receding */}
        <path d="M 560 1180 L 720 1180 L 1080 1920 L 140 1920 Z" fill="url(#g2-road)" />
        <path d="M 0 1300 L 1080 1300 L 1080 1920 L 0 1920 Z" fill="#0d0c0a" opacity={0.55} />
        {/* banyan: trunk at left, canopy across top */}
        <path d="M -40 1500 C 60 1300 120 1000 150 700 C 170 520 150 420 120 330 L 330 330 C 290 460 280 600 300 760 C 320 1000 330 1300 380 1500 Z" fill={TREE} />
        <path d="M 0 0 L 1080 0 L 1080 330 C 980 380 880 350 800 390 C 700 420 600 380 520 410 C 420 440 300 400 200 380 C 120 370 60 340 0 360 Z" fill={TREE} />
        <Roots t={t} />
        <SariWoman x={640} y={1290} s={1.12} t={t} />
        {/* foreground: dark ground lip + nearest roots */}
        <path d="M 0 1500 Q 540 1440 1080 1520 L 1080 1920 L 0 1920 Z" fill="#090807" />
        <path d="M 1000 0 Q 1010 500 990 1080" stroke="#050504" strokeWidth={22} fill="none" />
        <path d="M 1050 0 Q 1060 400 1040 1240" stroke="#050504" strokeWidth={30} fill="none" />
      </svg>
      <AbsoluteFill style={{ alignItems: 'center', top: 120 }}>
        <div style={{
          fontFamily: cinzel, fontWeight: 700, fontSize: 150, lineHeight: 1, letterSpacing: `${track}em`, marginRight: `-${track}em`,
          color: '#f3ece0', opacity: a, transform: `translateY(${(1 - a) * 20}px)`, whiteSpace: 'nowrap',
        }}>CHUDAIL</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 26, opacity: b }}>
          <div style={{ width: 100 * b, height: 3, background: `linear-gradient(90deg, rgba(255,106,61,0), ${ACC})` }} />
          <div style={{ fontFamily: deva, fontWeight: 600, fontSize: 84, lineHeight: 1.3, color: GOLD, whiteSpace: 'nowrap' }}>चुड़ैल</div>
          <div style={{ fontFamily: cinzel, fontWeight: 700, fontSize: 50, letterSpacing: '0.14em', color: '#c3cadb', whiteSpace: 'nowrap' }}>· India</div>
          <div style={{ width: 100 * b, height: 3, background: `linear-gradient(90deg, ${ACC}, rgba(255,106,61,0))` }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------------- shot 3: lore — backwards feet with anklets ---------------- */
export const S03: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const feetAt = wordAt(3, /^feet/, 0.68);
  const wrongAt = wordAt(3, /^wrong/, 0.85);
  const reveal = ramp(t, feetAt - 0.4, wrongAt, EIO); // camera drops to the feet
  const glint = 0.35 + 0.5 * ramp(t, wrongAt - 0.2, wrongAt + 0.3, EOUT) + 0.15 * Math.sin(t * 5);
  const walk = p; // she drifts right while toes point left
  const step = Math.sin(t * 3.2);
  const sc = 1 + 0.18 * reveal;
  return (
    <AbsoluteFill style={{ backgroundColor: '#0b0c10' }}>
      <svg viewBox="0 0 1080 1920" style={{ ...FULL, transform: `scale(${sc * (1 + 0.03 * z)})`, transformOrigin: '600px 1080px' }}>
        <defs>
          <Glint />
          <linearGradient id="g3-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0b0e16" />
            <stop offset="0.85" stopColor="#3a4560" />
            <stop offset="1" stopColor="#8592ad" />
          </linearGradient>
          <linearGradient id="g3-dust" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#a8957a" />
            <stop offset="0.4" stopColor={DUST} />
            <stop offset="1" stopColor="#241d15" />
          </linearGradient>
          <linearGradient id="g3-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0a0908" stopOpacity={0} />
            <stop offset="0.5" stopColor="#0a0908" stopOpacity={0.85} />
            <stop offset="1" stopColor="#0a0908" stopOpacity={1} />
          </linearGradient>
          <radialGradient id="g3-pool" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={MOON} stopOpacity={0.4} />
            <stop offset="1" stopColor={MOON} stopOpacity={0} />
          </radialGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#g3-sky)" />
        {/* far field line + banyan silhouette far right */}
        <path d="M 0 760 Q 540 740 1080 770 L 1080 820 L 0 820 Z" fill="#15171c" />
        <path d="M 760 770 C 770 640 790 560 800 500 L 840 500 C 850 580 860 660 880 770 Z" fill={TREE} />
        <path d="M 580 520 C 600 430 700 390 820 400 C 940 390 1060 430 1090 520 C 1000 500 900 540 820 510 C 740 540 660 500 580 520 Z" fill={TREE} />
        {[700, 760, 880, 950].map((x, i) => <path key={i} d={`M ${x} 480 L ${x + 4} ${620 + i * 40}`} stroke={TREE} strokeWidth={4} />)}
        {/* dust ground */}
        <rect x={0} y={800} width={1080} height={1120} fill="url(#g3-dust)" />
        <ellipse cx={560} cy={1130} rx={520} ry={180} fill="url(#g3-pool)" />
        {/* trail of footprints: toes point LEFT, but trail leads in from the left (she walks right) */}
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(${300 - i * 190 + walk * 90},${1200 + (i % 2) * 50 - i * 25}) rotate(-90) scale(${1.0 - i * 0.1},${0.55 - i * 0.05})`}>
            <Footprint wet={0.9 - i * 0.15} fill="#2e241a" />
          </g>
        ))}
        {/* sari hem + feet group, drifting right */}
        <g transform={`translate(${520 + walk * 90},0)`}>
          <ellipse cx={20} cy={1130} rx={300} ry={26} fill="#000" opacity={0.45} />
          <SideFoot x={-10} y={1124} s={1.5} dir={-1} lift={Math.max(0, step) * 12} glint={glint} />
          <SideFoot x={150} y={1140} s={1.56} dir={-1} lift={Math.max(0, -step) * 12} glint={glint * 0.8} />
          <g transform="translate(0,-130)">
          {/* sari hem trailing left (motion to the right) */}
          <path d={`M -230 -100 L 260 -100 C 250 300 236 600 236 880 C 220 920 200 960 170 990 C 120 1000 60 980 10 1000 C -50 1010 -120 990 -170 1010 C -210 1000 -240 980 -260 960 Z`} fill={RED} />
          {[-120, -40, 40, 120].map((px, i) => <path key={i} d={`M ${px + 20} -100 Q ${px - 20 + step * 4} 600 ${px - 40 + i * 4 + step * 8} 1000`} stroke="#6e0c19" strokeWidth={8} fill="none" opacity={0.7} />)}
          <path d="M -260 960 C -240 980 -210 1000 -170 1010 C -120 990 -50 1010 10 1000 C 60 980 120 1000 170 990 C 200 960 220 920 236 880" stroke={GOLD} strokeWidth={16} fill="none" />
          <path d="M -250 930 C -200 970 -120 960 -60 972 C 20 960 120 970 200 940" stroke={GOLD} strokeWidth={4} fill="none" opacity={0.6} />
          {/* moon rim on hem's right edge */}
          <path d="M 260 -100 C 250 300 236 600 236 880" fill="none" stroke="#ffd9d0" strokeWidth={5} opacity={0.5} />
          </g>
        </g>
        {/* foreground: dark grass tufts framing the bottom */}
        <rect x={0} y={1300} width={1080} height={620} fill="url(#g3-fade)" />
        {/* foreground: low dark dust ridge across the bottom (caption zone) */}
        <path d="M -40 1420 Q 300 1360 620 1400 Q 900 1430 1120 1380 L 1120 1920 L -40 1920 Z" fill="#0a0908" opacity={0.85} />
        {/* near hanging roots framing right */}
        <path d="M 1040 -20 Q 1050 500 1030 1000" stroke="#070605" strokeWidth={18} fill="none" />
        <path d="M 990 -20 Q 1000 300 985 700" stroke="#070605" strokeWidth={8} fill="none" />
      </svg>
    </AbsoluteFill>
  );
};

/* ---------------- shot 13: CTA end card ---------------- */
export const S13: React.FC = () => {
  const { t, sec, p } = useShot();
  const pop = (re: RegExp, fb: number) => {
    const at = Math.min(wordAt(13, re, fb), sec - 0.85);
    const k = ramp(t, at - 0.03, at + 0.25, EBACK);
    return { opacity: ramp(t, at - 0.03, at + 0.1, EOUT), transform: `scale(${0.6 + 0.4 * k})`, display: 'inline-block' } as React.CSSProperties;
  };
  const row: React.CSSProperties = { display: 'flex', gap: '0.28em', justifyContent: 'center', whiteSpace: 'nowrap' };
  const intro = ramp(t, 0, 0.5, EOUT);
  const z = EIO(p);
  const glint = 0.5 + 0.3 * Math.sin(t * 4);
  return (
    <AbsoluteFill style={{ backgroundColor: '#070a12' }}>
      <svg viewBox="0 0 1080 1920" style={{ ...FULL, transform: `scale(${1 + 0.04 * z})`, transformOrigin: '540px 1500px' }}>
        <defs>
          <Glint />
          <linearGradient id="g13-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#070a12" />
            <stop offset="0.55" stopColor="#161c2a" />
            <stop offset="1" stopColor="#2a2219" />
          </linearGradient>
          <linearGradient id="g13-road" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3a3024" />
            <stop offset="1" stopColor={DUST} />
          </linearGradient>
          <radialGradient id="g2-rim" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={MOON} stopOpacity={0.35} />
            <stop offset="1" stopColor={MOON} stopOpacity={0} />
          </radialGradient>
          <radialGradient id="g13-red" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={ACC} stopOpacity={0.35} />
            <stop offset="1" stopColor={ACC} stopOpacity={0} />
          </radialGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#g13-sky)" />
        <ellipse cx={540} cy={820} rx={560} ry={460} fill="url(#g13-red)" opacity={intro} />
        {/* road receding up the middle */}
        <path d="M 470 1180 L 610 1180 L 1080 1920 L 0 1920 Z" fill="url(#g13-road)" />
        {/* she waits at the end of the road */}
        <SariWoman x={540} y={1196} s={0.3} t={t} />
        {/* reversed footprints walking toward camera, toes pointing away */}
        {[0, 1, 2, 3, 4].map((i) => {
          const k = (i + 1) / 5;
          const y = 1220 + 680 * k * k;
          const x = 540 + (i % 2 ? 34 : -34) * (0.4 + k);
          const o = ramp(t, 0.15 + i * 0.25, 0.45 + i * 0.25, EOUT);
          return <g key={i} transform={`translate(${x},${y}) scale(${0.25 + 0.75 * k},${(0.25 + 0.75 * k) * 0.55})`}><Footprint wet={o} fill="#2a2018" /></g>;
        })}
        {/* banyan roots framing */}
        <path d="M 0 0 L 1080 0 L 1080 180 C 900 230 700 200 540 230 C 380 200 180 230 0 180 Z" fill={TREE} />
        <Roots t={t} col="#0b0a08" w={1.2} />
        {/* silver anklet hanging in the light */}
        <g transform="translate(540,400)">
          <ellipse cx={0} cy={0} rx={150} ry={46} stroke="#6c7484" strokeWidth={6} fill="none" />
          {Array.from({ length: 20 }, (_, i) => {
            const a = (i / 20) * Math.PI * 2; const cx = Math.cos(a) * 150, cy = Math.sin(a) * 46; const front = Math.sin(a) > 0;
            return <g key={i} opacity={front ? 1 : 0.55}><circle cx={cx} cy={cy} r={front ? 11 : 8} fill={front ? '#d4dae6' : '#8a93a4'} />{i % 2 === 0 && <path d={`M ${cx} ${cy} L ${cx} ${cy + 20}`} stroke="#8a93a4" strokeWidth={2} />}{i % 2 === 0 && <circle cx={cx} cy={cy + 26} r={front ? 8 : 6} fill={front ? '#b8c0ce' : '#7a8394'} />}</g>;
          })}
          <circle cx={40} cy={36} r={70} fill="url(#gf-glint)" opacity={glint} />
        </g>
      </svg>
      <AbsoluteFill style={{ alignItems: 'center', top: 560 }}>
        <div style={{ width: 920, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ ...row, fontFamily: oswald, fontWeight: 600, fontSize: 96, color: '#efe8dc', letterSpacing: '0.04em', lineHeight: 1.08 }}>
            <span style={pop(/^Would/, 0.06)}>WOULD</span>
            <span style={pop(/^you/, 0.13)}>YOU</span>
            <span style={pop(/^walk/, 0.2)}>WALK</span>
          </div>
          <div style={{ ...row, fontFamily: cinzel, fontWeight: 700, fontSize: 132, color: ACC, letterSpacing: '0.04em', lineHeight: 1.08 }}>
            <span style={pop(/^with/, 0.28)}>WITH</span>
            <span style={pop(/^her/, 0.36)}>HER?</span>
          </div>
          <div style={{ width: 520 * intro, height: 3, margin: '46px 0 42px', background: `linear-gradient(90deg, rgba(217,164,65,0), ${GOLD}, rgba(217,164,65,0))`, opacity: 0.7 }} />
          <div style={{ ...row, fontFamily: oswald, fontWeight: 400, fontSize: 72, color: '#efe8dc', letterSpacing: '0.06em', alignItems: 'baseline' }}>
            <span style={pop(/^Comment/, 0.5)}>COMMENT</span>
            <span style={{ ...pop(/^YES/, 0.6), color: ACC, fontWeight: 700 }}>YES</span>
            <span style={pop(/^or$/, 0.7)}>OR</span>
            <span style={{ ...pop(/^NO/, 0.8), color: ACC, fontWeight: 700 }}>NO</span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
