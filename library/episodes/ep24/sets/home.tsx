import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H } from '../art/world';

/** Set "home" (apartment: door, altar with incense, hallway, close-ups). Static bands baked ONCE to public/baked/home/<band>.png. Ids "home/<band>". */

// shared layout (world coords)
export const ALT = { x0: 330, x1: 1010, top: 1270, cx: 690, potX: 690, potY: 1240, tabX: 690, tabY: 900 };
export const DOOR = { x0: 430, x1: 870, top: 560, bot: 1560, peepX: 650, peepY: 1000 };
export const WIN = { x0: 240, x1: 1060, top: 420, bot: 1560 };

const Tiles: React.FC<{ y0: number; vx: number; col: string }> = ({ y0, vx, col }) => {
  const l: React.ReactNode[] = [];
  for (let i = -8; i <= 8; i++) l.push(<line key={'c' + i} x1={vx + i * 60} y1={y0} x2={vx + i * 260} y2={H} />);
  for (let j = 1; j < 7; j++) { const y = y0 + (H - y0) * Math.pow(j / 6, 1.8); l.push(<line key={'r' + j} x1={0} y1={y} x2={W} y2={y} />); }
  return <g stroke={col} strokeWidth={3} opacity={0.5}>{l}</g>;
};

const Altar: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="hAwall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#140b0a" /><stop offset="0.55" stopColor="#3a1c14" /><stop offset="1" stopColor="#1c0f0c" /></linearGradient>
      <radialGradient id="hAglow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffb067" stopOpacity="0.75" /><stop offset="0.45" stopColor="#d2603a" stopOpacity="0.32" /><stop offset="1" stopColor="#d2603a" stopOpacity="0" /></radialGradient>
      <linearGradient id="hAfloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a1813" /><stop offset="1" stopColor="#0d0807" /></linearGradient>
      <linearGradient id="hAcloth" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b02a20" /><stop offset="1" stopColor="#4a0f0c" /></linearGradient>
      <linearGradient id="hAtab" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7a1a14" /><stop offset="1" stopColor="#3a0c0a" /></linearGradient>
    </defs>
    <rect width={W} height={H} fill="url(#hAwall)" />
    <ellipse cx={ALT.cx - 120} cy={1000} rx={760} ry={640} fill="url(#hAglow)" />
    {/* shelf niche */}
    <rect x={ALT.x0 + 60} y={620} width={ALT.x1 - ALT.x0 - 120} height={650} fill="#2a130e" opacity={0.55} />
    <rect x={ALT.x0 + 40} y={600} width={ALT.x1 - ALT.x0 - 80} height={24} fill="#1a0c09" />
    {/* ancestor tablet */}
    <rect x={ALT.tabX - 95} y={ALT.tabY - 210} width={190} height={400} rx={10} fill="url(#hAtab)" />
    <rect x={ALT.tabX - 70} y={ALT.tabY - 180} width={140} height={340} fill="none" stroke="#d9a24a" strokeWidth={5} opacity={0.8} />
    <path d={`M ${ALT.tabX - 95} ${ALT.tabY - 210} Q ${ALT.tabX} ${ALT.tabY - 280} ${ALT.tabX + 95} ${ALT.tabY - 210} Z`} fill="#5a120e" />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={ALT.tabX - 14} y={ALT.tabY - 140 + i * 72} width={28} height={40} rx={4} fill="#e2b25a" opacity={0.75} />)}
    {/* table */}
    <rect x={ALT.x0 - 30} y={ALT.top} width={ALT.x1 - ALT.x0 + 60} height={34} fill="#3a1f15" />
    <rect x={ALT.x0 - 30} y={ALT.top} width={ALT.x1 - ALT.x0 + 60} height={6} fill="#ffb067" opacity={0.5} />
    <path d={`M ${ALT.x0} ${ALT.top + 34} L ${ALT.x1} ${ALT.top + 34} L ${ALT.x1 - 20} ${ALT.top + 470} L ${ALT.x0 + 20} ${ALT.top + 470} Z`} fill="url(#hAcloth)" />
    <path d={`M ${ALT.cx - 90} ${ALT.top + 34} L ${ALT.cx + 90} ${ALT.top + 34} L ${ALT.cx + 60} ${ALT.top + 300} L ${ALT.cx} ${ALT.top + 360} L ${ALT.cx - 60} ${ALT.top + 300} Z`} fill="#d9a24a" opacity={0.35} />
    {/* floor */}
    <rect x={0} y={1740} width={W} height={H - 1740} fill="url(#hAfloor)" />
    <Tiles y0={1740} vx={ALT.cx} col="#4a2a1e" />
    {/* fruit plate + cups */}
    <ellipse cx={ALT.x0 + 90} cy={ALT.top - 4} rx={70} ry={12} fill="#c9b8a0" opacity={0.7} />
    {[-30, 0, 30].map((d, i) => <circle key={i} cx={ALT.x0 + 90 + d} cy={ALT.top - 40 + (i === 1 ? -22 : 0)} r={30} fill="#e07a2a" />)}
    {[-30, 0, 30].map((d, i) => <path key={'r' + i} d={`M ${ALT.x0 + 70 + d} ${ALT.top - 58 + (i === 1 ? -22 : 0)} a 30 30 0 0 1 30 -10`} stroke="#ffc37a" strokeWidth={5} fill="none" />)}
    {[ALT.x1 - 150, ALT.x1 - 90].map((x, i) => <path key={i} d={`M ${x - 22} ${ALT.top - 44} L ${x + 22} ${ALT.top - 44} L ${x + 15} ${ALT.top} L ${x - 15} ${ALT.top} Z`} fill="#d8cbb4" />)}
    {/* incense pot (brass) */}
    <path d={`M ${ALT.potX - 95} ${ALT.potY - 50} L ${ALT.potX + 95} ${ALT.potY - 50} Q ${ALT.potX + 90} ${ALT.potY + 20} ${ALT.potX} ${ALT.potY + 24} Q ${ALT.potX - 90} ${ALT.potY + 20} ${ALT.potX - 95} ${ALT.potY - 50} Z`} fill="#8a5a22" />
    <ellipse cx={ALT.potX} cy={ALT.potY - 50} rx={95} ry={18} fill="#c99a4a" />
    <ellipse cx={ALT.potX} cy={ALT.potY - 48} rx={80} ry={12} fill="#5a4a3e" />
    <path d={`M ${ALT.potX - 60} ${ALT.potY - 20} Q ${ALT.potX} ${ALT.potY} ${ALT.potX + 60} ${ALT.potY - 20}`} stroke="#ffcf86" strokeWidth={4} fill="none" opacity={0.6} />
    {/* old burnt stubs */}
    {[-40, -15, 25, 50].map((d, i) => <line key={i} x1={ALT.potX + d} y1={ALT.potY - 52} x2={ALT.potX + d * 1.2} y2={ALT.potY - 110 - i * 6} stroke="#b0402a" strokeWidth={5} />)}
    {/* candles (red, glowing) */}
    {[ALT.x0 + 30, ALT.x1 - 30].map((x, i) => (
      <g key={i}>
        <ellipse cx={x} cy={ALT.top - 210} rx={120} ry={140} fill="url(#hAglow)" />
        <rect x={x - 22} y={ALT.top - 170} width={44} height={170} rx={6} fill="#c8302a" />
        <path d={`M ${x} ${ALT.top - 230} q 14 25 0 50 q -14 -25 0 -50 Z`} fill="#ffe2a0" />
      </g>
    ))}
  </g>
);

const Door: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="hDwall" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#0c0d12" /><stop offset="0.5" stopColor="#1d1b22" /><stop offset="1" stopColor="#0b0b10" /></linearGradient>
      <linearGradient id="hDdoor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#24201f" /><stop offset="1" stopColor="#3a2e2a" /></linearGradient>
      <linearGradient id="hDfloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1a1716" /><stop offset="1" stopColor="#070608" /></linearGradient>
      <radialGradient id="hDwarm" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ff9a5c" stopOpacity="0.32" /><stop offset="1" stopColor="#ff9a5c" stopOpacity="0" /></radialGradient>
    </defs>
    <rect width={W} height={H} fill="url(#hDwall)" />
    {/* warm altar spill from the left */}
    <ellipse cx={60} cy={1300} rx={520} ry={900} fill="url(#hDwarm)" />
    {/* frame */}
    <rect x={DOOR.x0 - 50} y={DOOR.top - 50} width={DOOR.x1 - DOOR.x0 + 100} height={DOOR.bot - DOOR.top + 50} fill="#141215" />
    <rect x={DOOR.x0} y={DOOR.top} width={DOOR.x1 - DOOR.x0} height={DOOR.bot - DOOR.top - 12} fill="url(#hDdoor)" />
    <rect x={DOOR.x0 - 50} y={DOOR.top - 50} width={8} height={DOOR.bot - DOOR.top + 50} fill="#ff9a5c" opacity={0.35} />
    {/* panels */}
    <rect x={DOOR.x0 + 60} y={DOOR.top + 80} width={DOOR.x1 - DOOR.x0 - 120} height={300} rx={6} fill="none" stroke="#151213" strokeWidth={10} />
    <rect x={DOOR.x0 + 60} y={DOOR.top + 520} width={DOOR.x1 - DOOR.x0 - 120} height={380} rx={6} fill="none" stroke="#151213" strokeWidth={10} />
    {/* paper charm (fu) */}
    <rect x={DOOR.x0 + 175} y={DOOR.top + 110} width={90} height={230} fill="#d9b23a" />
    <path d={`M ${DOOR.x0 + 220} ${DOOR.top + 140} l 0 170 M ${DOOR.x0 + 195} ${DOOR.top + 180} l 50 0 M ${DOOR.x0 + 200} ${DOOR.top + 240} l 40 30`} stroke="#9a1c14" strokeWidth={9} fill="none" />
    {/* peephole */}
    <circle cx={DOOR.peepX} cy={DOOR.peepY} r={16} fill="#3a3330" />
    {/* handle + lock */}
    <rect x={DOOR.x1 - 80} y={1060} width={22} height={70} rx={6} fill="#a08a6a" />
    <rect x={DOOR.x1 - 110} y={1110} width={70} height={16} rx={6} fill="#c9b08a" />
    {/* shoes rack hint, dim */}
    <rect x={DOOR.x1 + 90} y={1440} width={260} height={120} fill="#121014" />
    {/* floor */}
    <rect x={0} y={DOOR.bot} width={W} height={H - DOOR.bot} fill="url(#hDfloor)" />
    <Tiles y0={DOOR.bot} vx={DOOR.peepX} col="#2a2524" />
  </g>
);

const Window: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="hWsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#080b18" /><stop offset="0.6" stopColor="#1c1830" /><stop offset="1" stopColor="#3a1e26" /></linearGradient>
      <radialGradient id="hWlan" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ff8a5c" stopOpacity="0.8" /><stop offset="1" stopColor="#ff8a5c" stopOpacity="0" /></radialGradient>
      <linearGradient id="hWwall" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#0b0d14" /><stop offset="1" stopColor="#151a26" /></linearGradient>
    </defs>
    <rect width={W} height={H} fill="url(#hWwall)" />
    {/* outside */}
    <rect x={WIN.x0} y={WIN.top} width={WIN.x1 - WIN.x0} height={WIN.bot - WIN.top} fill="url(#hWsky)" />
    {/* opposite shophouses */}
    <path d={`M ${WIN.x0} 900 L 420 900 L 420 840 L 640 840 L 640 930 L 860 930 L 860 870 L ${WIN.x1} 870 L ${WIN.x1} ${WIN.bot} L ${WIN.x0} ${WIN.bot} Z`} fill="#241c1f" />
    {[[300, 980], [500, 960], [720, 1010], [940, 990], [520, 1130], [880, 1150]].map(([x, y], i) => <rect key={i} x={x} y={y} width={70} height={90} fill={i % 2 ? '#ffcf86' : '#6fd1c4'} opacity={i % 2 ? 0.55 : 0.35} />)}
    {/* street below: lanterns string */}
    <path d={`M ${WIN.x0} 1230 Q 650 1300 ${WIN.x1} 1220`} stroke="#120d10" strokeWidth={4} fill="none" />
    {[330, 480, 650, 820, 970].map((x, i) => {
      const y = 1230 + Math.sin((x - WIN.x0) / (WIN.x1 - WIN.x0) * Math.PI) * 60 + 30;
      return (<g key={i}><ellipse cx={x} cy={y} rx={110} ry={110} fill="url(#hWlan)" /><ellipse cx={x} cy={y} rx={26} ry={32} fill="#e0402f" /><ellipse cx={x} cy={y} rx={12} ry={28} fill="#ff8a5c" /></g>);
    })}
    <rect x={WIN.x0} y={1430} width={WIN.x1 - WIN.x0} height={WIN.bot - 1430} fill="#1a1216" />
    <rect x={WIN.x0} y={1430} width={WIN.x1 - WIN.x0} height={8} fill="#ff8a5c" opacity={0.3} />
    {/* frame + mullions */}
    <rect x={WIN.x0 - 40} y={WIN.top - 40} width={WIN.x1 - WIN.x0 + 80} height={40} fill="#05060a" />
    <rect x={WIN.x0 - 40} y={WIN.bot} width={WIN.x1 - WIN.x0 + 80} height={60} fill="#05060a" />
    <rect x={WIN.x0 - 40} y={WIN.top} width={40} height={WIN.bot - WIN.top} fill="#05060a" />
    <rect x={WIN.x1} y={WIN.top} width={40} height={WIN.bot - WIN.top} fill="#05060a" />
    <rect x={(WIN.x0 + WIN.x1) / 2 - 14} y={WIN.top} width={28} height={WIN.bot - WIN.top} fill="#07080c" />
    <rect x={WIN.x0} y={WIN.bot + 4} width={WIN.x1 - WIN.x0} height={6} fill="#8aa0c0" opacity={0.3} />
  </g>
);

/** dark foreground framing: curtain fold left, chair back bottom-right */
const Fg: React.FC = () => (
  <g>
    <path d="M 0 0 L 190 0 Q 150 600 210 1200 Q 250 1800 170 2304 L 0 2304 Z" fill="#06060a" />
    <path d="M 120 0 Q 90 700 150 1300 Q 190 1900 120 2304" stroke="#1c1a22" strokeWidth={10} fill="none" />
    <path d="M 1296 1700 L 1060 1760 Q 1010 1980 1040 2304 L 1296 2304 Z" fill="#06060a" />
  </g>
);

export const HOME: Record<string, BandSpec> = {
  'home/altar': { node: () => <Altar /> },
  'home/door': { node: () => <Door /> },
  'home/window': { node: () => <Window /> },
  'home/fg': { blur: 6, node: () => <Fg /> },
};
