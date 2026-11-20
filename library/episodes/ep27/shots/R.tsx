import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, handheld, ramp, EIO } from '../comp/Camera';
import { wordAt, spanOf, FPS } from "../data/ep";
const wf = (id: number, re: RegExp, fb: number) => Math.min(0.97, Math.max(0.03, wordAt(id, re, fb) / (spanOf(id).dur / FPS)));
import { W, H } from '../art/world';
import { Chudail, Uncle, Truck, Foot, HlDefs, RC, HY, VPX } from '../art/road_figs';

const BG: React.FC<{ cam: Cam; fg?: boolean; sky?: React.ReactNode; mid?: React.ReactNode }> = ({ cam, fg = true, sky, mid }) => (
  <>
    <BandImg id="road/sky" k={0.4} cam={cam} />
    {sky}
    <BandImg id="road/mid" k={0.8} cam={cam} />
    {mid}
    {fg && <BandImg id="road/fg" k={1.3} cam={cam} />}
  </>
);

/** 1: wide, banyan, small red figure under it; slow push-in */
export const S01: React.FC = () => {
  const { p, t } = useShot();
  const h = handheld(t, 0.4);
  const cam: Cam = { zoom: 1 + 0.18 * EIO(p), dx: 0, dy: 0, ox: 300, oy: 900, tx: h.hx, ty: h.hy };
  const back = ramp(p, wf(1, /backwards/, 0.85) - 0.05, wf(1, /backwards/, 0.85) + 0.05);
  return (
    <AbsoluteFill style={{ backgroundColor: '#05060a' }}>
      <BG cam={cam} mid={
        <Live k={0.8} cam={cam}>
          <HlDefs />
          <ellipse cx={340} cy={HY + 100} rx={120} ry={160} fill="url(#moonGlow)" opacity={0.5} />
          <Chudail x={340} y={HY + 150} s={0.36} sway={Math.sin(t * 0.8) * 1.5} />
          <ellipse cx={340} cy={HY + 150} rx={30} ry={5} fill="#000" opacity={0.5} />
          <g opacity={back}>{[0, 1, 2].map((i) => <Foot key={i} x={350 + i * 30} y={HY + 200 + i * 60} s={0.16 + i * 0.03} rot={160} fill="#3a2c20" />)}</g>
        </Live>
      } />
    </AbsoluteFill>
  );
};

/** 4: truck stalled, hood up, uncle with torch */
export const S04: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1.25 + 0.12 * EIO(p), dx: -60, dy: -120, ox: 600, oy: 1000 };
  const fl = 0.85 + 0.15 * Math.sin(t * 13) * Math.sin(t * 3.1);
  return (
    <AbsoluteFill style={{ backgroundColor: '#05060a' }}>
      <BG cam={cam} mid={
        <Live k={0.8} cam={cam}>
          <HlDefs />
          <defs><radialGradient id="torch"><stop offset="0" stopColor={RC.head} stopOpacity={0.7} /><stop offset="1" stopColor={RC.head} stopOpacity={0} /></radialGradient></defs>
          <Truck x={800} y={1440} s={0.62} hood />
          <polygon points="525,1185 560,1170 700,1120 700,1290" fill="url(#torch)" opacity={0.6 * fl} />
          <ellipse cx={600} cy={1240} rx={110} ry={70} fill="url(#torch)" opacity={0.8 * fl} />
          <Uncle x={430} y={1450} s={0.5} torch rim={RC.head} />
        </Live>
      } />
    </AbsoluteFill>
  );
};

/** 5: medium, woman in red sari by the road */
export const S05: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1.5 + 0.1 * p, dx: -200, dy: 120, ox: 540, oy: 700 };
  const cl: Cam = { zoom: 1 + 0.08 * p, dx: 0, dy: 0, ox: 540, oy: 700 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#05060a' }}>
      <BG cam={cam} fg={false} />
      <Live cam={cl}>
        <HlDefs />
        <ellipse cx={720} cy={720} rx={420} ry={520} fill="url(#moonGlow)" opacity={0.6} />
        <Chudail x={720} y={1540} s={1.48} sway={Math.sin(t * 0.7) * 0.8} />
      </Live>
      <BandImg id="road/fg" k={1.3} cam={{ zoom: 1.2, dx: 0, dy: 100 }} />
    </AbsoluteFill>
  );
};

/** 6: walking side by side away from camera */
export const S06: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1.2 + 0.08 * p, dx: -120, dy: -40, ox: 640, oy: 1000 };
  const s = 0.5 - 0.1 * p, y = 1480 - 160 * p;
  return (
    <AbsoluteFill style={{ backgroundColor: '#05060a' }}>
      <BG cam={cam} mid={
        <Live k={0.8} cam={cam}>
          <Uncle x={610} y={y} s={s} step={t * 0.9} />
          <Chudail x={610 + 200 * s} y={y} s={s * 0.92} back sway={Math.sin(t * 2) * 1} />
        </Live>
      } />
    </AbsoluteFill>
  );
};

/** 7: headlights flicker on behind them, lighting the dust and her prints */
export const S07: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1.2, dx: -120, dy: -40, ox: 640, oy: 1000 };
  const on = wf(7, /flicker/, 0.25);
  const fl = p < on ? 0 : p < on + 0.08 ? (Math.sin(t * 40) > 0 ? 1 : 0.2) : 1;
  const prints = ramp(p, wf(7, /footprints/, 0.8) - 0.12, wf(7, /footprints/, 0.8));
  const y = 1300, s = 0.34;
  return (
    <AbsoluteFill style={{ backgroundColor: '#05060a' }}>
      <BG cam={cam} mid={
        <Live k={0.8} cam={cam}>
          <HlDefs />
          <g opacity={fl}>
            <polygon points={`200,${H} 520,${y - 80} 760,${y - 80} 1100,${H}`} fill="url(#beam)" opacity={1} /><rect x={0} y={y - 60} width={W} height={H} fill="#fff1c2" opacity={0.1} />
            <polygon points={`380,${H} 600,${y - 40} 700,${y - 40} 900,${H}`} fill="url(#beam)" />
          </g>
          <g opacity={prints * fl}>
            {[0, 1, 2, 3].map((i) => <Foot key={'u' + i} x={640 - i * 8} y={y + 40 + i * 70} s={0.18 + i * 0.05} rot={0} fill="#2a2016" />)}
            {[0, 1, 2, 3].map((i) => <Foot key={'w' + i} x={700 + i * 16} y={y + 70 + i * 70} s={0.17 + i * 0.05} rot={180} fill="#5a0e18" />)}
          </g>
          <Uncle x={620} y={y} s={s} step={t * 0.9} rim={fl ? RC.head : RC.moon} />
          <Chudail x={700} y={y} s={s * 0.92} back rim={fl ? RC.head : RC.moon} />
        </Live>
      } />
    </AbsoluteFill>
  );
};

/** 8: close, two lines of prints: his forward, hers reversed toward the tree */
export const S08: React.FC = () => {
  const { p } = useShot();
  const cl: Cam = { zoom: 1 + 0.15 * EIO(p), dx: 0, dy: 120 * EIO(p), ox: 540, oy: 900 };
  const tree = ramp(p, wf(8, /Toward/, 0.6), wf(8, /tree/, 0.85));
  const row = (n: number) => Array.from({ length: n }, (_, i) => i);
  return (
    <AbsoluteFill style={{ backgroundColor: '#05060a' }}>
      <Live cam={cl}>
        <HlDefs />
        <defs>
          <linearGradient id="dust8" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1a1611" /><stop offset="0.35" stopColor={RC.dust} /><stop offset="1" stopColor="#d8bf94" /></linearGradient>
        </defs>
        <rect x={-200} y={-400} width={W + 400} height={H + 800} fill="url(#dust8)" />
        {/* banyan roots looming at the far end */}
        <g opacity={0.4 + 0.6 * tree}>{[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={i} d={`M ${300 + i * 110} -400 q ${i % 2 ? 20 : -20} 300 ${i * 6} 720`} stroke={RC.tree} strokeWidth={16} fill="none" />)}</g>
        <rect x={-200} y={-400} width={W + 400} height={540} fill={RC.tree} />
        {row(6).map((i) => { const y = 1500 - i * 180 + i * i * 10, s = 1.0 - i * 0.12; return <Foot key={'u' + i} x={460 - (i % 2) * 70 * s} y={y} s={s * 1.25} rot={-4} fill="#2a1d12" />; })}
        {row(6).map((i) => { const y = 1560 - i * 180 + i * i * 10, s = 1.0 - i * 0.12; return <Foot key={'w' + i} x={820 + (i % 2) * 70 * s} y={y} s={s * 1.25} rot={184} fill="#5e0f1a" />; })}
        <rect x={-200} y={1700} width={W + 400} height={1000} fill="#fff1c2" opacity={0.08} />
      </Live>
    </AbsoluteFill>
  );
};

/** 9: close, uncle's profile in the headlight glow */
export const S09: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 2.4, dx: 300, dy: 200, ox: 540, oy: 900 };
  const drop = ramp(p, 0.2, 0.9);
  const blink = (t % 3.3) < 0.12 ? 0.2 : 1;
  return (
    <AbsoluteFill style={{ backgroundColor: '#05060a' }}>
      <BandImg id="road/sky" k={1} cam={cam} />
      <Live cam={{ zoom: 1, dx: 0, dy: 0 }}>
        <defs>
          <radialGradient id="hl9" cx="1" cy="0.45" r="0.8"><stop offset="0" stopColor={RC.head} stopOpacity={0.7} /><stop offset="1" stopColor={RC.head} stopOpacity={0} /></radialGradient>
        </defs>
        <rect x={0} y={0} width={W} height={H} fill="url(#hl9)" />
        <g transform="translate(560 1020)">
          {/* neck + shoulder */}
          <path d="M -120 160 C -110 260 -140 360 -360 460 L -400 900 L 520 900 C 500 640 320 520 120 420 C 60 360 40 280 60 200 Z" fill="#191310" />
          {/* head profile facing right */}
          <path d="M -230 -120 C -250 -330 -80 -440 80 -400 C 220 -370 280 -280 290 -170 C 296 -130 300 -100 340 -40 C 350 -20 330 -8 306 -4 C 310 20 300 30 290 40 C 298 60 290 80 270 86 C 260 140 230 180 170 200 C 110 216 70 240 60 260 C -40 260 -120 220 -160 160 C -220 80 -220 -20 -230 -120 Z" fill="#3a2418" />
          {/* hair */}
          <path d="M -230 -120 C -260 -330 -80 -460 90 -410 C 180 -390 250 -330 270 -260 C 200 -300 120 -310 60 -290 C 0 -260 -40 -200 -80 -120 C -120 -60 -190 -30 -230 -120 Z" fill="#0b0806" />
          {/* ear */}
          <ellipse cx={-80} cy={-60} rx={34} ry={56} fill="#2a190f" />
          {/* moustache */}
          <path d="M 300 30 C 270 50 210 60 170 44 C 200 80 270 80 304 50 Z" fill="#0b0806" />
          {/* eye */}
          <path d="M 200 -150 Q 230 -164 252 -146 Q 230 -140 200 -150 Z" fill="#e8dcc4" opacity={blink} />
          <circle cx={238} cy={-150} r={6} fill="#120a06" opacity={blink} />
          <path d="M 190 -186 Q 230 -200 262 -182" stroke="#0b0806" strokeWidth={10} fill="none" />
          {/* rim light from the headlights (right) */}
          <path d="M 80 -400 C 220 -370 280 -280 290 -170 C 296 -130 300 -100 340 -40 C 350 -20 330 -8 306 -4 C 310 20 300 30 290 40 C 298 60 290 80 270 86 C 260 140 230 180 170 200" stroke={RC.head} strokeWidth={9} fill="none" opacity={0.85} />
          {/* sweat */}
          <path d={`M 120 ${-260 + drop * 200} q -10 18 0 26 q 10 -8 0 -26 Z`} fill={RC.head} opacity={0.9 * (1 - drop * 0.3)} />
        </g>
      </Live>
    </AbsoluteFill>
  );
};

/** 10: uncle walking back toward the lights, red shape following far behind */
export const S10: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1.2 + 0.05 * p, dx: -120, dy: -40, ox: 640, oy: 1000 };
  const ank = wf(10, /anklets/, 0.75);
  const near = ramp(p, ank - 0.2, 1);
  return (
    <AbsoluteFill style={{ backgroundColor: '#05060a' }}>
      <BG cam={cam} mid={
        <Live k={0.8} cam={cam}>
          <HlDefs />
          <polygon points={`150,${H} 560,${HY + 40} 760,${HY + 40} 1150,${H}`} fill="url(#beam)" opacity={0.7} />
          <Chudail x={790} y={HY + 110 + 50 * near} s={0.13 + 0.05 * near} back={false} rim={RC.head} />
          <Uncle x={600} y={1480 + 20 * p} s={0.6 + 0.05 * p} step={t * 0.9} front rim={RC.head} />
        </Live>
      } />
    </AbsoluteFill>
  );
};

/** 11: dawn, truck with headlights on, banyan behind, no woman; slow pull-back */
export const S11: React.FC = () => {
  const { p } = useShot();
  const cam: Cam = { zoom: 1.3 - 0.2 * EIO(p), dx: -40, dy: -80, ox: 600, oy: 1000 };
  const start = ramp(p, wf(11, /started/, 0.6) - 0.03, wf(11, /started/, 0.6) + 0.03);
  return (
    <AbsoluteFill style={{ backgroundColor: '#05060a' }}>
      <BG cam={cam} sky={
        <Live k={0.4} cam={cam}>
          <defs>
            <linearGradient id="dawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a4a72" /><stop offset="0.6" stopColor="#c98a7a" /><stop offset="1" stopColor="#ffd2a0" /></linearGradient>
            <radialGradient id="sun11"><stop offset="0" stopColor="#fff1c2" stopOpacity={0.9} /><stop offset="1" stopColor="#ffb070" stopOpacity={0} /></radialGradient>
          </defs>
          <rect x={0} y={0} width={W} height={HY - 18} fill="url(#dawn)" opacity={0.85} />
          <ellipse cx={980} cy={HY - 30} rx={340} ry={200} fill="url(#sun11)" />
        </Live>
      } mid={
        <Live k={0.8} cam={cam}>
          <HlDefs />
          <rect x={0} y={HY} width={W} height={H - HY} fill="#ffcf9a" opacity={0.12} />
          <Truck x={760} y={1450} s={0.62} lights={0.5 + 0.5 * start} />
        </Live>
      } />
    </AbsoluteFill>
  );
};
