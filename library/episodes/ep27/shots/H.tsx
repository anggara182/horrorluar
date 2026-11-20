import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, handheld, ramp, EIO, EOUT } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { DOOR } from '../sets/home';

const MOON = '#cfd6e6';
const SARI = '#a3162a';
const GOLD = '#d9a441';

/** Outside, seen through the gap under the door: moonlit dusty ground + the woman's hem and feet. */
const UnderGap: React.FC<{ feet: number; sway: number; lift: number }> = ({ feet, sway, lift }) => {
  const { x0, x1, bot, sill } = DOOR;
  const cx = 640 + (1 - feet) * 260; // she steps in from the right
  const g = sill - 6; // ground contact line seen through gap
  const Foot: React.FC<{ x: number; flip?: boolean }> = ({ x, flip }) => {
    const s = flip ? -1 : 1;
    return (
      <g transform={`translate(${x} ${g}) scale(${s * 1.45} 1.45)`}>
        {/* backwards foot: heel faces the camera, toes point away from the door */}
        <path d="M -20 -78 L -22 -40 Q -34 -14 -30 -4 Q -18 6 0 6 Q 22 6 30 -4 Q 32 -16 22 -40 L 20 -78 Z" fill="#8f6a58" />
        <path d="M -22 -40 Q -34 -14 -30 -4 Q -18 6 0 6" fill="none" stroke="#7a5446" strokeWidth={3} />
        {/* rim of moonlight on heel */}
        <path d="M 4 5 Q 24 4 30 -4 Q 32 -16 22 -40" fill="none" stroke="#f2f4fa" strokeWidth={3.5} opacity="0.95" />
        {/* achilles crease */}
        <path d="M -3 -70 Q 0 -40 -2 -18" fill="none" stroke="#8a5f4e" strokeWidth={2.5} opacity="0.7" />
        {/* silver anklet */}
        <path d="M -23 -44 Q 0 -34 23 -44" fill="none" stroke="#e8ecf4" strokeWidth={5} />
        <circle cx={-10} cy={-37} r={3.5} fill="#f6f8fc" /><circle cx={4} cy={-36} r={3.5} fill="#f6f8fc" /><circle cx={16} cy={-40} r={3.5} fill="#f6f8fc" />
      </g>
    );
  };
  return (
    <g>
      <defs>
        <linearGradient id="hOut" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8d98b0" /><stop offset="0.6" stopColor={MOON} /><stop offset="1" stopColor="#e9edf6" /></linearGradient>
        <clipPath id="hGapClip"><rect x={x0} y={bot} width={x1 - x0} height={sill - bot} /></clipPath>
        <linearGradient id="hHem" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#5a0a16" /><stop offset="0.45" stopColor={SARI} /><stop offset="1" stopColor="#4a0812" /></linearGradient>
      </defs>
      <g clipPath="url(#hGapClip)">
        <rect x={x0} y={bot} width={x1 - x0} height={sill - bot} fill="url(#hOut)" />
        {/* dust ripples / old footprints outside */}
        <ellipse cx={470} cy={sill - 10} rx={30} ry={6} fill="#9aa3b8" opacity="0.6" />
        <ellipse cx={820} cy={sill - 14} rx={26} ry={5} fill="#9aa3b8" opacity="0.5" />
        {feet > 0 && (
          <g opacity={Math.min(1, feet * 1.4)}>
            {/* her shadow on the ground toward the door */}
            <ellipse cx={cx} cy={g + 2} rx={120} ry={10} fill="#3a4258" opacity="0.6" />
            {/* she leans in to the door on "name": heels rise a little */}
            <g transform={`translate(0 ${-7 * lift})`}><Foot x={cx - 50} flip /><Foot x={cx + 50} /></g>
            {/* sari hem with gold border, swaying */}
            <g transform={`translate(${cx} -4) skewX(${sway * 3})`}>
              <path d={`M -150 ${bot - 40} L 150 ${bot - 40} L 160 ${bot + 26} Q 120 ${bot + 34} 80 ${bot + 24} Q 40 ${bot + 36} 0 ${bot + 26} Q -40 ${bot + 38} -80 ${bot + 24} Q -120 ${bot + 34} -160 ${bot + 26} Z`} fill="url(#hHem)" />
              <path d={`M -160 ${bot + 26} Q -120 ${bot + 34} -80 ${bot + 24} Q -40 ${bot + 36} 0 ${bot + 26} Q 40 ${bot + 36} 80 ${bot + 24} Q 120 ${bot + 34} 160 ${bot + 26}`} fill="none" stroke={GOLD} strokeWidth={8} />
              <path d={`M -60 ${bot - 40} Q -56 ${bot} -66 ${bot + 26} M 30 ${bot - 40} Q 36 ${bot} 28 ${bot + 28}`} fill="none" stroke="#3a0610" strokeWidth={4} opacity="0.8" />
            </g>
          </g>
        )}
      </g>
    </g>
  );
};

/** The two door leaves (kiwad) with iron studs and a ring chain; jolts on each knock. */
const Door: React.FC<{ jolt: number; block: number }> = ({ jolt, block }) => {
  const { x0, x1, top, bot } = DOOR;
  const mid = (x0 + x1) / 2;
  const Leaf: React.FC<{ a: number; b: number; d: number }> = ({ a, b, d }) => (
    <g transform={`translate(${d} 0)`}>
      <rect x={a} y={top} width={b - a} height={bot - top} fill="url(#hLeaf)" />
      {[0.12, 0.5, 0.88].map((f) => (
        <rect key={f} x={a + 10} y={top + (bot - top) * f - 16} width={b - a - 20} height={32} fill="#14110e" />
      ))}
      {[0.12, 0.5, 0.88].map((f) => [0.2, 0.5, 0.8].map((h) => (
        <circle key={`${f}-${h}`} cx={a + (b - a) * h} cy={top + (bot - top) * f} r={7} fill="#2a2a2e" />
      )))}
      {[0.12, 0.5, 0.88].map((f) => (
        <rect key={`r${f}`} x={a + 10} y={top + (bot - top) * f - 17} width={b - a - 20} height={2} fill="#56637e" opacity="0.5" />
      ))}
    </g>
  );
  return (
    <g>
      <defs>
        <linearGradient id="hLeaf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#15110e" /><stop offset="0.7" stopColor="#2a221b" /><stop offset="1" stopColor="#1c1713" /></linearGradient>
        <linearGradient id="hBounce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={MOON} stopOpacity="0" /><stop offset="1" stopColor={MOON} stopOpacity="0.16" /></linearGradient>
        <linearGradient id="hCrack" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={MOON} stopOpacity="0.15" /><stop offset="1" stopColor={MOON} stopOpacity="0.9" /></linearGradient>
      </defs>
      {/* moonlight through the crack between leaves */}
      <rect x={mid - 3} y={top} width={6} height={bot - top} fill="url(#hCrack)" />
      {/* her body standing right behind the door blocks the crack */}
      <rect x={mid - 3} y={top + 150} width={6} height={bot - top - 150} fill="#0b0a0c" opacity={block} />
      <Leaf a={x0} b={mid - 3} d={-jolt * 0.4} />
      <Leaf a={mid + 3} b={x1} d={jolt} />
      <rect x={x0} y={bot - 160} width={x1 - x0} height={160} fill="url(#hBounce)" />
      {/* iron ring knocker + chain on the right leaf */}
      <g transform={`translate(${jolt} 0)`}>
        <circle cx={mid + 48} cy={top + (bot - top) * 0.42} r={9} fill="#2e2e33" />
        <g transform={`rotate(${jolt * 4} ${mid + 48} ${top + (bot - top) * 0.42})`}>
          <circle cx={mid + 48} cy={top + (bot - top) * 0.42 + 40} r={30} fill="none" stroke="#33343a" strokeWidth={8} />
          <path d={`M ${mid + 30} ${top + (bot - top) * 0.42 + 60} A 30 30 0 0 0 ${mid + 72} ${top + (bot - top) * 0.42 + 54}`} fill="none" stroke="#8a97b4" strokeWidth={3} opacity="0.7" />
        </g>
      </g>
    </g>
  );
};

/** Light spilling under the door onto the floor, with the two feet-shadows cutting through it. */
const Spill: React.FC<{ feet: number; cx: number; o: number }> = ({ feet, cx, o }) => {
  const { x0, x1, sill } = DOOR;
  return (
    <g opacity={o}>
      <defs>
        <linearGradient id="hSpill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={MOON} stopOpacity="0.55" /><stop offset="1" stopColor={MOON} stopOpacity="0" /></linearGradient>
        <radialGradient id="hGlow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={MOON} stopOpacity="0.35" /><stop offset="1" stopColor={MOON} stopOpacity="0" /></radialGradient>
      </defs>
      <ellipse cx={(x0 + x1) / 2} cy={sill} rx={420} ry={90} fill="url(#hGlow)" />
      <path d={`M ${x0} ${sill + 6} L ${x1} ${sill + 6} L ${x1 + 260} ${sill + 520} L ${x0 - 260} ${sill + 520} Z`} fill="url(#hSpill)" />
      {feet > 0 && [-50, 50].map((d) => {
        const fx = cx + d;
        const sx = 648 + (fx - 648) * 1.5;
        return <path key={d} d={`M ${fx - 32} ${sill + 6} L ${fx + 32} ${sill + 6} L ${sx + 60} ${sill + 520} L ${sx - 60} ${sill + 520} Z`} fill="#0a0c12" opacity={0.75 * Math.min(1, feet * 1.4)} />;
      })}
    </g>
  );
};

/** shot 12 — the loop: back home, a knock at the courtyard door; under the gap, a red hem and backwards feet. Slow push-in. */
export const S12: React.FC = () => {
  const { p, t, sec } = useShot();
  const tWoman = wordAt(12, /^woman/i, 0.42);
  const tKnock = wordAt(12, /^knocked/i, 0.58);
  const tName = wordAt(12, /^name/i, 0.93);
  // feet slide into the gap as "a woman in red" is spoken
  const feet = ramp(t, tWoman - 0.6, tWoman + 0.5, EOUT);
  // three knocks: short decaying jolts
  const knock = (k: number) => {
    const dt = t - (tKnock + k * 0.32);
    return dt < 0 || dt > 0.22 ? 0 : Math.sin((dt / 0.22) * Math.PI) * (1 - dt / 0.3);
  };
  const jolt = 7 * (knock(0) + knock(1) + knock(2));
  const sway = Math.sin(t * 1.3) * 0.6;
  // camera: slow push toward the gap, a final lean-in on "name"
  const push = ramp(p, 0, 1, EIO);
  const last = ramp(t, tName - 0.2, sec, EOUT);
  const hh = handheld(t, 0.25);
  const cam: Cam = { zoom: 1.04 + 0.42 * push + 0.12 * last, dx: 0, dy: -60 * push, ox: 540, oy: 1240, tx: hh.hx, ty: hh.hy };
  const cx = 640 + (1 - feet) * 260;
  // dust shaken from the lintel by the knocks
  const dust = Array.from({ length: 10 }, (_, i) => {
    const t0 = tKnock + (i % 3) * 0.32;
    const dt = t - t0;
    if (dt < 0) return null;
    const x = DOOR.x0 + 40 + ((i * 137) % (DOOR.x1 - DOOR.x0 - 80));
    const y = DOOR.top - 20 + dt * (110 + (i % 4) * 30);
    const o = Math.max(0, 0.7 - dt * 0.35);
    return <circle key={i} cx={x + Math.sin(dt * 2 + i) * 6} cy={y} r={2 + (i % 3)} fill={MOON} opacity={o} />;
  });
  return (
    <AbsoluteFill style={{ backgroundColor: '#07080c' }}>
      <BandImg id="home/bg" k={0.9} cam={cam} />
      <Live k={0.9} cam={cam}>
        <UnderGap feet={feet} sway={sway} lift={last} />
        <Door jolt={jolt} block={0.92 * feet} />
        <Spill feet={feet} cx={cx} o={0.85 + 0.15 * Math.sin(t * 0.7)} />
        {dust}
      </Live>
      <BandImg id="home/fg" k={1.25} cam={cam} />
    </AbsoluteFill>
  );
};
