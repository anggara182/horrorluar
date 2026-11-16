import React from 'react';

/** Baba Yaga, facing right, origin at her feet. Height ~ 430 local units. stir = phase (radians), smile 0..1, glint 0..1. */
export const Yaga: React.FC<{ x: number; y: number; s: number; stir: number; smile: number; glint: number; id: string }> = ({ x, y, s, stir, smile, glint, id }) => {
  const hx = 130 + Math.cos(stir) * 22, hy = -215 + Math.sin(stir) * 8;
  const rim = '#ffb36a';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0d0907" />
          <stop offset="0.75" stopColor="#1c120d" />
          <stop offset="1" stopColor="#4a2618" />
        </linearGradient>
        <linearGradient id={`${id}-skin`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#24140e" />
          <stop offset="1" stopColor="#a0603c" />
        </linearGradient>
      </defs>
      {/* skirt + hunched body */}
      <path d="M-95 0 Q-110 -120 -90 -210 Q-80 -300 -20 -340 Q30 -360 60 -320 Q80 -290 70 -240 Q90 -120 85 0 Z" fill={`url(#${id}-body)`} />
      {/* shawl */}
      <path d="M-85 -230 Q-70 -320 -10 -345 Q50 -350 70 -300 Q60 -250 20 -230 Q-30 -215 -85 -230 Z" fill="#24100f" />
      <path d="M70 -300 Q60 -250 20 -230" stroke={rim} strokeWidth="3" fill="none" opacity="0.8" />
      <path d="M78 -230 Q92 -120 85 0" stroke={rim} strokeWidth="4" fill="none" opacity="0.7" />
      {/* feet */}
      <ellipse cx="60" cy="-6" rx="34" ry="10" fill="#0a0705" />
      {/* spoon */}
      <path d={`M${hx - 6} ${hy - 50} L${hx + 34} ${hy + 120}`} stroke="#4a3020" strokeWidth="8" strokeLinecap="round" />
      {/* arm */}
      <path d={`M40 -300 Q30 -230 60 -205 Q90 -195 ${hx} ${hy}`} stroke="#2a1712" strokeWidth="30" strokeLinecap="round" fill="none" />
      <path d={`M60 -205 Q90 -198 ${hx} ${hy - 12}`} stroke={rim} strokeWidth="4" fill="none" opacity="0.6" />
      {/* bony hand */}
      <ellipse cx={hx} cy={hy} rx="17" ry="14" fill={`url(#${id}-skin)`} />
      <path d={`M${hx + 8} ${hy - 8} q14 4 14 16 M${hx + 6} ${hy + 4} q12 4 10 14`} stroke="#3a2219" strokeWidth="3" fill="none" />
      {/* head */}
      <g transform="translate(48 -365)">
        {/* wild grey hair behind */}
        <path d="M-60 -10 Q-95 -30 -85 10 Q-110 20 -80 40 Q-100 70 -60 55 Q-45 40 -40 10 Z" fill="#8f8a82" />
        {[[-55, 0, -110, -15], [-55, 15, -115, 35], [-50, 30, -95, 75], [-40, 40, -70, 85], [20, 20, 35, 70], [28, 10, 55, 45]].map(([a, b, c, d], i) => (
          <path key={i} d={`M${a} ${b} Q${(a + c) / 2 - 10} ${(b + d) / 2 + 8} ${c} ${d}`} stroke="#b9b4aa" strokeWidth="3" fill="none" opacity="0.85" />
        ))}
        {/* face */}
        <path d="M-20 -30 Q20 -50 45 -20 Q55 -5 50 10 Q78 20 82 44 Q70 40 52 34 Q55 50 40 58 Q10 72 -15 50 Q-35 25 -20 -30 Z" fill={`url(#${id}-skin)`} />
        {/* hooked nose rim */}
        <path d="M50 10 Q78 20 82 44 Q70 40 52 34" stroke="#ffd29a" strokeWidth="3" fill="none" />
        {/* chin */}
        <path d="M40 58 Q48 70 36 76" stroke="#ffc08a" strokeWidth="3" fill="none" opacity="0.8" />
        {/* eye: dark socket + glint */}
        <ellipse cx="30" cy="2" rx="8" ry="5" fill="#140a06" />
        <circle cx="33" cy="1" r="2" fill="#ffd9a0" />
        {/* mouth + iron teeth */}
        <path d={`M28 ${44 - smile * 2} Q40 ${46 + smile * 4} 50 ${40 - smile * 6}`} stroke="#140a06" strokeWidth="4" fill="none" />
        <g opacity={0.35 + 0.65 * glint}>
          <rect x="36" y={43 - smile * 1} width="5" height="5" fill="#9aa3ab" />
          <rect x="43" y={42 - smile * 3} width="5" height="5" fill="#c9d1d8" />
          <circle cx="46" cy={43 - smile * 3} r={2 + glint * 3} fill="#ffffff" opacity={glint} />
        </g>
        {/* headscarf */}
        <path d="M-75 20 Q-80 -55 -10 -62 Q45 -60 52 -22 Q30 -38 0 -28 Q-25 -15 -35 30 Q-55 40 -75 20 Z" fill="#5a2a2a" />
        <path d="M-10 -62 Q45 -60 52 -22" stroke={rim} strokeWidth="4" fill="none" />
        <path d="M-70 25 L-95 55 L-60 45 Z" fill="#4a2020" />
        {/* stray hair from under the scarf */}
        <path d="M48 -24 Q62 -30 70 -18 M44 -20 Q60 -12 64 0" stroke="#d6d0c4" strokeWidth="2.5" fill="none" />
      </g>
    </g>
  );
};

/** Close profile for shot 10 (local units ~ 800 tall, origin at chin-ish). */
export const YagaClose: React.FC<{ x: number; y: number; s: number; smile: number; glint: number; blink: number; hairT: number }> = ({ x, y, s, smile, glint, blink, hairT }) => {
  const rim = '#ffb36a';
  const w = (k: number) => Math.sin(hairT + k) * 6;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <linearGradient id="yc-skin" x1="0" y1="0" x2="1" y2="0.2">
          <stop offset="0" stopColor="#120a07" />
          <stop offset="0.6" stopColor="#4e2c1e" />
          <stop offset="1" stopColor="#d0844f" />
        </linearGradient>
        <linearGradient id="yc-scarf" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1e0d0d" />
          <stop offset="1" stopColor="#6e3030" />
        </linearGradient>
      </defs>
      {/* wild hair mass behind */}
      <path d={`M-260 -160 Q-360 -120 -330 0 Q-400 80 -320 160 Q-360 260 -240 280 Q-160 300 -120 200 L-80 -100 Z`} fill="#6f6a63" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = -140 + i * 38, b = -330 - (i % 3) * 30;
        return <path key={i} d={`M-150 ${a} Q${-260 + w(i)} ${a + 20} ${b + w(i * 2)} ${a + 60 + (i % 2) * 30}`} stroke="#b9b4aa" strokeWidth={i % 3 ? 3 : 5} fill="none" opacity="0.8" />;
      })}
      {/* neck + shoulder */}
      <path d="M-160 180 Q-60 200 20 260 Q60 320 40 420 L-420 420 Q-380 280 -160 180 Z" fill="#120a08" />
      <path d="M20 260 Q60 320 40 420" stroke={rim} strokeWidth="5" fill="none" opacity="0.6" />
      {/* face profile: forehead, brow, hooked nose, lips, jutting chin */}
      <path d="M-150 -200 Q-20 -250 80 -170 Q105 -130 100 -90 Q110 -70 128 -40 Q176 30 192 100 Q194 128 172 124 Q148 98 120 74 Q126 92 118 110 Q130 120 124 138 Q114 150 110 158 Q128 186 108 214 Q70 250 0 240 Q-120 230 -180 120 Q-210 0 -150 -200 Z" fill="url(#yc-skin)" />
      {/* rim along profile */}
      <path d="M80 -170 Q105 -130 100 -90 Q110 -70 128 -40 Q176 30 192 100 Q194 128 172 124" stroke="#ffd7a0" strokeWidth="5" fill="none" />
      <path d="M110 158 Q128 186 108 214 Q70 250 0 240" stroke="#ffbf86" strokeWidth="4" fill="none" opacity="0.8" />
      {/* wrinkles */}
      <path d="M20 -60 Q50 -40 60 0 M0 40 Q40 60 60 110 M-20 120 Q20 150 60 160" stroke="#2a160e" strokeWidth="4" fill="none" opacity="0.7" />
      {/* brow + eye */}
      <path d="M30 -110 Q70 -120 96 -96" stroke="#2a160e" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M40 -112 Q66 -126 92 -108" stroke="#cfc8bc" strokeWidth="4" fill="none" />
      <ellipse cx="70" cy="-80" rx="20" ry={14 * (1 - blink) + 1} fill="#120805" />
      <circle cx="78" cy="-82" r={4 * (1 - blink)} fill="#ffd9a0" />
      <path d="M48 -66 Q70 -58 92 -70" stroke="#2a160e" strokeWidth="3" fill="none" />
      {/* mouth: sly smile with iron teeth */}
      <path d={`M60 ${132 - smile * 6} Q90 ${136 + smile * 6} 122 ${124 - smile * 16}`} stroke="#140805" strokeWidth={7 + smile * 3} fill="none" strokeLinecap="round" />
      <g opacity={smile}>
        <rect x="88" y={128} width="10" height="8" fill="#8e979f" />
        <rect x="100" y={126 - smile * 4} width="10" height="9" fill="#bcc5cc" />
        <rect x="112" y={122 - smile * 8} width="8" height="8" fill="#a4adb4" />
      </g>
      {/* glint on iron tooth (radial gradient, no filter) */}
      <circle cx="106" cy={128 - smile * 4} r={10 + 44 * glint} fill="url(#yc-glint)" opacity={glint} />
      <defs>
        <radialGradient id="yc-glint">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.25" stopColor="#ffe9c8" stopOpacity="0.8" />
          <stop offset="1" stopColor="#ffb36a" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* headscarf */}
      <path d="M-330 60 Q-370 -240 -120 -300 Q60 -320 110 -170 Q60 -200 -10 -190 Q-120 -160 -170 0 Q-200 120 -240 180 Q-310 160 -330 60 Z" fill="url(#yc-scarf)" />
      <path d="M-120 -300 Q60 -320 110 -170" stroke={rim} strokeWidth="6" fill="none" />
      <path d="M110 -170 Q60 -200 -10 -190" stroke="#3a1515" strokeWidth="6" fill="none" />
      {Array.from({ length: 9 }, (_, i) => {
        const y0 = -120 + i * 34;
        return <path key={'f' + i} d={`M${-150 - i * 6} ${y0} Q${-230 + w(i + 3)} ${y0 + 60} ${-250 - (i % 3) * 30 + w(i)} ${y0 + 150}`} stroke={i % 2 ? '#b9b4aa' : '#8f8a82'} strokeWidth={i % 3 ? 3 : 6} fill="none" opacity="0.9" />;
      })}
      <path d={`M-150 -110 Q-190 40 -180 200`} stroke="#ffcf9a" strokeWidth="3" fill="none" opacity="0.5" />
      {/* strands escaping the scarf over the brow */}
      <path d={`M100 -172 Q${130 + w(1)} -170 ${140 + w(2)} -140 M90 -168 Q${118 + w(3)} -150 ${112 + w(4)} -120 M80 -175 Q${110 + w(5)} -200 ${140 + w(6)} -195`} stroke="#d8d2c6" strokeWidth="3" fill="none" />
    </g>
  );
};
