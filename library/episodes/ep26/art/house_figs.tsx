import React from 'react';

const SKIN = '#c99a74', SKIN_D = '#8a6448', HAT = '#d9b866', HAT_D = '#a88a3e', RIM = '#fff4d6';

/** glass wind chime hanging from the eave; sw = swing in degrees */
export const Chime: React.FC<{ x: number; y: number; s?: number; sw?: number }> = ({ x, y, s = 1, sw = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${sw})`}>
    <line x1={0} y1={0} x2={0} y2={60} stroke="#2a1d14" strokeWidth={2} />
    <path d="M-34 110 Q-34 60 0 58 Q34 60 34 110 Z" fill="#d8eef0" opacity={0.85} />
    <path d="M-34 110 Q-34 60 0 58" stroke="#ffffff" strokeWidth={4} fill="none" opacity={0.9} />
    <path d="M-30 96 Q0 104 30 96" stroke="#d65a4a" strokeWidth={5} fill="none" />
    <g transform={`rotate(${sw * 1.6} 0 110)`}>
      <line x1={0} y1={110} x2={0} y2={150} stroke="#2a1d14" strokeWidth={1.5} />
      <rect x={-14} y={150} width={28} height={90} fill="#f3ead2" />
      <rect x={-14} y={150} width={28} height={6} fill="#d65a4a" />
    </g>
  </g>
);

/** tiny white wriggling figure far away */
export const Kune: React.FC<{ x: number; y: number; h: number; t: number; o?: number }> = ({ x, y, h, t, o = 1 }) => {
  const a = Math.sin(t * 5) * 0.35, b = Math.sin(t * 7 + 1) * 0.4;
  const w = h * 0.12;
  return (
    <g opacity={o} transform={`translate(${x} ${y})`}>
      <path d={`M0 0 Q${w * 3 * a} ${-h * 0.35} ${-w * 2 * b} ${-h * 0.6} Q${w * 3 * a} ${-h * 0.85} ${w * b} ${-h}`} stroke="#f5f5ef" strokeWidth={w} fill="none" strokeLinecap="round" />
      <path d={`M${-w * 2 * b} ${-h * 0.6} L${-w * 4 * a} ${-h * 0.75}`} stroke="#f5f5ef" strokeWidth={w * 0.6} strokeLinecap="round" />
    </g>
  );
};

/** child sitting on the veranda edge, seen from behind. x,y = seat point, h = seated height */
export const KidBack: React.FC<{ x: number; y: number; h: number; shirt: string; melon?: number; lean?: number }> = ({ x, y, h, shirt, melon = 0, lean = 0 }) => {
  const u = h / 100;
  return (
    <g transform={`translate(${x} ${y}) scale(${u}) rotate(${lean})`}>
      {/* torso */}
      <path d="M-24 0 L-28 -44 Q-28 -58 -14 -60 L14 -60 Q28 -58 28 -44 L24 0 Z" fill={shirt} />
      <path d="M28 -44 L24 0" stroke={RIM} strokeWidth={2} opacity={0.6} />
      {/* arm raising a watermelon slice */}
      <path d={`M24 -54 Q40 -40 ${30 + 4 * melon} ${-62 - 10 * melon}`} stroke={SKIN} strokeWidth={9} fill="none" strokeLinecap="round" />
      <g transform={`translate(${28 + 4 * melon} ${-72 - 10 * melon}) rotate(-20)`}>
        <path d="M-14 0 A14 14 0 0 0 14 0 Z" fill="#2f6b2a" />
        <path d="M-11 0 A11 11 0 0 0 11 0 Z" fill="#e2483e" />
      </g>
      {/* neck + head */}
      <rect x={-6} y={-68} width={12} height={10} fill={SKIN_D} />
      <ellipse cx={0} cy={-80} rx={14} ry={15} fill="#1d1612" />
      {/* straw hat */}
      <ellipse cx={0} cy={-84} rx={30} ry={8} fill={HAT_D} />
      <path d="M-16 -84 Q-16 -104 0 -104 Q16 -104 16 -84 Z" fill={HAT} />
      <rect x={-16} y={-89} width={32} height={4} fill="#b0412f" />
      <path d="M-30 -84 Q0 -92 30 -84" stroke={RIM} strokeWidth={1.5} fill="none" opacity={0.7} />
    </g>
  );
};

/** brother standing in profile facing right, raising binoculars. raise 0..1 */
export const BrotherSide: React.FC<{ x: number; y: number; h: number; raise: number; smile?: number; bino?: boolean }> = ({ x, y, h, raise, smile = 0, bino = true }) => {
  const u = h / 200;
  // hand position: from waist (10,-95) to eye (22,-172)
  const hx = 14 + 14 * raise, hy = -100 - 70 * raise;
  return (
    <g transform={`translate(${x} ${y}) scale(${u})`}>
      {/* legs (shorts) */}
      <path d="M-10 -92 L-14 -50 L-12 0 L-2 0 L0 -50 L4 -92 Z" fill={SKIN} />
      <path d="M2 -92 L4 -50 L10 0 L20 0 L14 -50 L16 -92 Z" fill={SKIN_D} />
      <path d="M-14 -96 L18 -96 L20 -66 L-16 -66 Z" fill="#33465e" />
      {/* torso */}
      <path d="M-14 -96 L-16 -146 Q-14 -158 0 -160 L10 -160 Q22 -156 20 -140 L18 -96 Z" fill="#e8e2d0" />
      <path d="M20 -140 L18 -96" stroke={RIM} strokeWidth={2.5} />
      {/* back arm */}
      <path d={`M2 -150 Q${0 + 6 * raise} ${-120 - 20 * raise} ${hx - 4} ${hy + 4}`} stroke={SKIN_D} strokeWidth={9} fill="none" strokeLinecap="round" />
      {/* head */}
      <rect x={0} y={-170} width={10} height={14} fill={SKIN_D} />
      <path d="M-4 -176 Q-6 -196 8 -198 Q22 -198 24 -186 L28 -178 L24 -176 Q24 -166 16 -164 Q4 -162 -2 -168 Z" fill={SKIN} />
      <path d="M24 -186 L28 -178 L24 -176" stroke={RIM} strokeWidth={1.5} fill="none" />
      <path d={`M19 -168 Q${22 + smile} ${-168 - 2 * smile} ${24} ${-170 - 2 * smile}`} stroke="#6a3a2a" strokeWidth={1.4} fill="none" />
      <path d="M-6 -186 Q-6 -200 8 -200 Q18 -200 20 -192 Q10 -190 4 -182 Z" fill="#1d1612" />
      {/* binoculars */}
      {bino && <g transform={`translate(${hx + 6} ${hy}) rotate(${-10 + 10 * raise})`}>
        <rect x={-6} y={-8} width={20} height={9} rx={2} fill="#2b2b2b" />
        <rect x={-6} y={2} width={20} height={9} rx={2} fill="#1f1f1f" />
        <rect x={12} y={-9} width={4} height={21} rx={1} fill="#454545" />
        <path d="M-6 -8 L14 -8" stroke="#9a9a9a" strokeWidth={1} />
      </g>}
      {/* front arm */}
      <path d={`M10 -152 Q${14 + 4 * raise} ${-124 - 10 * raise} ${hx} ${hy + 6}`} stroke={SKIN} strokeWidth={10} fill="none" strokeLinecap="round" />
    </g>
  );
};

/** extreme close: brother's lower face under binoculars, mouth corners lifting. Frame-space 1080x1920 */
export const MouthClose: React.FC<{ smile: number }> = ({ smile }) => (
  <g>
    <defs>
      <linearGradient id="mcSkin" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#7a5640" /><stop offset="0.6" stopColor="#c99a74" /><stop offset="1" stopColor="#e6bf98" /></linearGradient>
    </defs>
    {/* face mass */}
    <path d="M120 300 Q100 900 300 1180 Q540 1420 780 1200 Q980 960 960 300 Z" fill="url(#mcSkin)" />
    <path d="M960 300 Q980 960 780 1200" stroke="#fff4d6" strokeWidth={10} fill="none" opacity={0.6} />
    {/* nose shadow */}
    <path d="M520 520 Q560 640 520 700 Q560 720 600 700" stroke="#8a6448" strokeWidth={10} fill="none" strokeLinecap="round" />
    {/* mouth */}
    <path d={`M${370 - 20 * smile} ${880 - 70 * smile} Q540 ${900 + 60 * smile} ${710 + 20 * smile} ${880 - 70 * smile}`} stroke="#4a2418" strokeWidth={14} fill="none" strokeLinecap="round" />
    <path d={`M${400} ${905} Q540 ${930 + 40 * smile} ${680} ${905}`} stroke="#a0605a" strokeWidth={8} fill="none" opacity={0.5} />
    <path d={`M${360 - 20 * smile} ${870 - 70 * smile} q-20 -10 -24 -30`} stroke="#8a6448" strokeWidth={6 * smile} fill="none" opacity={smile} />
    <path d={`M${720 + 20 * smile} ${870 - 70 * smile} q20 -10 24 -30`} stroke="#8a6448" strokeWidth={6 * smile} fill="none" opacity={smile} />
    {/* binoculars + hands over the eyes */}
    <rect x={60} y={-40} width={420} height={420} rx={70} fill="#1f1f1f" />
    <rect x={560} y={-40} width={420} height={420} rx={70} fill="#2b2b2b" />
    <rect x={440} y={80} width={160} height={120} fill="#3a3a3a" />
    <rect x={90} y={300} width={360} height={60} rx={20} fill="#3a3a3a" /><rect x={590} y={300} width={360} height={60} rx={20} fill="#454545" />
    {[160, 240, 680, 760].map((x) => <rect key={x} x={x} y={20} width={40} height={260} rx={10} fill="#141414" />)}
    <path d="M560 30 L560 370" stroke="#8a8a8a" strokeWidth={6} opacity={0.6} />
    <path d="M980 40 L980 360" stroke="#fff4d6" strokeWidth={6} opacity={0.5} />
    <path d="M0 260 Q60 200 140 260 L160 420 Q60 460 0 420 Z" fill="#a87a58" />
    <path d="M1080 240 Q1000 190 930 250 L920 410 Q1010 450 1080 420 Z" fill="#c99a74" />
  </g>
);

/** Grandpa in profile facing left. x,y = feet; h height. reach 0..1 extends arms forward-left */
export const Grandpa: React.FC<{ x: number; y: number; h: number; reach?: number; worry?: number }> = ({ x, y, h, reach = 0, worry = 0 }) => {
  const u = h / 200;
  const ax = -40 - 20 * reach, ay = -150 - 22 * reach;
  return (
    <g transform={`translate(${x} ${y}) scale(${u})`}>
      <path d="M-8 -92 L-14 0 L-2 0 L4 -90 Z M6 -92 L10 0 L22 0 L18 -92 Z" fill="#4b4a3e" />
      <path d="M-14 -96 L-18 -150 Q-14 -164 2 -166 L12 -166 Q24 -162 22 -146 L20 -96 Z" fill="#f2efe4" />
      <path d="M-14 -160 Q2 -150 20 -160 L18 -140 Q2 -132 -12 -142 Z" fill="#7aa6c4" />
      <path d="M22 -146 L20 -96" stroke="#fff4d6" strokeWidth={2.5} opacity={0.7} />
      <path d={`M6 -156 Q${-14 - 10 * reach} ${-130 - 10 * reach} ${ax} ${ay}`} stroke="#a07050" strokeWidth={10} fill="none" strokeLinecap="round" />
      <ellipse cx={ax - 4} cy={ay} rx={13} ry={9} fill="#a07050" />
      <rect x={-2} y={-176} width={12} height={14} fill="#8a6044" />
      <path d="M-14 -178 Q-14 -202 4 -204 Q20 -204 20 -186 Q20 -170 10 -168 Q-2 -166 -6 -172 L-12 -174 L-16 -180 Z" fill="#a87a58" />
      <path d="M-16 -180 L-12 -174" stroke="#fff4d6" strokeWidth={1.5} />
      <path d="M0 -204 Q18 -206 20 -188 Q14 -196 2 -198 Z" fill="#c8c4bc" />
      <path d={`M-8 ${-190 - 2 * worry} L0 ${-192}`} stroke="#3a2a20" strokeWidth={1.6} />
    </g>
  );
};

/** close Grandpa profile (frame space), facing right, worried, whispering. open 0..1 */
export const GrandpaClose: React.FC<{ open: number }> = ({ open }) => (
  <g>
    <defs>
      <linearGradient id="gcSkin" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#3a2818" /><stop offset="1" stopColor="#9a6c4c" /></linearGradient>
    </defs>
    <path d="M-40 1920 L-40 1300 Q20 1180 160 1160 L300 1150 L330 1920 Z" fill="#e8e4d8" />
    <path d="M-40 1180 Q160 1260 340 1180 L360 1300 Q160 1360 -40 1290 Z" fill="#7aa6c4" />
    <path d="M60 1180 L60 1040 L300 1020 L320 1180 Z" fill="#6a4a34" />
    <path d={`M-60 400 Q40 300 260 320 Q440 340 480 520 L500 600 Q560 680 530 720 L500 730 L520 800 L490 820 Q${510 + 10 * open} 860 490 880 Q480 960 400 1000 Q300 1060 160 1040 L-60 1040 Z`} fill="url(#gcSkin)" />
    <path d={`M480 520 L500 600 Q560 680 530 720 L500 730 L520 800 L490 820 Q${510 + 10 * open} 860 490 880 Q480 960 400 1000`} stroke="#d8eaf4" strokeWidth={6} fill="none" opacity={0.8} />
    <path d="M380 560 Q420 540 450 560" stroke="#1a110a" strokeWidth={8} fill="none" strokeLinecap="round" />
    <path d="M360 500 Q410 470 460 495" stroke="#cfc9bf" strokeWidth={14} fill="none" strokeLinecap="round" />
    <path d="M330 470 Q350 440 380 430 M340 520 Q380 505 400 515" stroke="#3a2818" strokeWidth={5} fill="none" opacity={0.7} />
    <path d="M-60 400 Q40 290 260 310 Q300 316 330 330 Q200 330 120 420 L-60 520 Z" fill="#c8c4bc" />
    <path d="M440 640 Q420 700 380 720" stroke="#3a2818" strokeWidth={6} fill="none" opacity={0.6} />
  </g>
);
