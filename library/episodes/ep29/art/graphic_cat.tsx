import React from 'react';

export const CAT = '#08080a';
export const EYE = '#ffd23f';

/** Glowing almond cat eye with slit pupil. open 0..1 (blink), look = pupil x shift. */
export const CatEye: React.FC<{ x: number; y: number; w: number; open?: number; id: string; tilt?: number; glow?: number }> = ({ x, y, w, open = 1, id, tilt = 0, glow = 1 }) => {
  const h = w * 0.5 * Math.max(0.04, open);
  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt})`}>
      <defs>
        <radialGradient id={`${id}-halo`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={EYE} stopOpacity={0.55} />
          <stop offset="0.35" stopColor="#ffb020" stopOpacity={0.18} />
          <stop offset="1" stopColor="#ffb020" stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`${id}-iris`} cx="0.5" cy="0.55" r="0.6">
          <stop offset="0" stopColor="#fff6c4" />
          <stop offset="0.45" stopColor={EYE} />
          <stop offset="1" stopColor="#c98a00" />
        </radialGradient>
      </defs>
      <ellipse cx={0} cy={0} rx={w * 1.6} ry={w * 1.1} fill={`url(#${id}-halo)`} opacity={glow * Math.min(1, open * 1.5)} />
      <path d={`M ${-w / 2} 0 Q 0 ${-h * 1.25} ${w / 2} 0 Q 0 ${h * 1.25} ${-w / 2} 0 Z`} fill={`url(#${id}-iris)`} />
      <path d={`M 0 ${-h * 0.58} Q ${w * 0.07} 0 0 ${h * 0.58} Q ${-w * 0.07} 0 0 ${-h * 0.58} Z`} fill="#050505" />
    </g>
  );
};

/** Frontal head silhouette (ears up), eyes added by caller. Local origin = head centre, width ~ 2*r. */
export const CatHeadFront: React.FC<{ x: number; y: number; r: number; rim?: string }> = ({ x, y, r, rim = '#6fe3a6' }) => (
  <g transform={`translate(${x} ${y})`}>
    <path
      d={`M ${-r * 1.02} ${r * 0.1}
        C ${-r * 1.05} ${-r * 0.4} ${-r * 0.95} ${-r * 0.65} ${-r * 0.82} ${-r * 0.8}
        L ${-r * 0.9} ${-r * 1.62} Q ${-r * 0.86} ${-r * 1.7} ${-r * 0.78} ${-r * 1.62}
        L ${-r * 0.32} ${-r * 1.0}
        Q 0 ${-r * 1.1} ${r * 0.32} ${-r * 1.0}
        L ${r * 0.78} ${-r * 1.62} Q ${r * 0.86} ${-r * 1.7} ${r * 0.9} ${-r * 1.62}
        L ${r * 0.82} ${-r * 0.8}
        C ${r * 0.95} ${-r * 0.65} ${r * 1.05} ${-r * 0.4} ${r * 1.02} ${r * 0.1}
        C ${r * 1.3} ${r * 0.5} ${r * 1.6} ${r * 0.8} ${r * 2.4} ${r * 1.3}
        L ${r * 2.4} ${r * 4} L ${-r * 2.4} ${r * 4} L ${-r * 2.4} ${r * 1.3}
        C ${-r * 1.6} ${r * 0.8} ${-r * 1.3} ${r * 0.5} ${-r * 1.02} ${r * 0.1} Z`}
      fill={CAT}
    />
    {/* rim light along ear edges and crown */}
    <path d={`M ${-r * 0.82} ${-r * 0.8} L ${-r * 0.9} ${-r * 1.62} Q ${-r * 0.86} ${-r * 1.7} ${-r * 0.78} ${-r * 1.62} L ${-r * 0.32} ${-r * 1.0} Q 0 ${-r * 1.1} ${r * 0.32} ${-r * 1.0} L ${r * 0.78} ${-r * 1.62} Q ${r * 0.86} ${-r * 1.7} ${r * 0.9} ${-r * 1.62} L ${r * 0.82} ${-r * 0.8}`}
      fill="none" stroke={rim} strokeWidth={r * 0.025} strokeLinejoin="round" opacity={0.55} />
    {/* whiskers, faint */}
    {[-1, 1].map((sd) => [0, 1, 2].map((i) => (
      <path key={`${sd}${i}`} d={`M ${sd * r * 0.32} ${r * 0.32 + i * r * 0.06} Q ${sd * r * 0.9} ${r * 0.2 + i * r * 0.1} ${sd * r * 1.45} ${r * 0.12 + i * r * 0.2}`}
        fill="none" stroke="#3c4a52" strokeWidth={r * 0.012} opacity={0.6} />
    )))}
  </g>
);

/**
 * Side silhouette of the giant cat, facing left, stepping. Local origin = ground under the body,
 * units: shoulder height ~720, length ~1300. step 0..1 lifts/advances the raised front paw.
 */
export const YuleCatSide: React.FC<{ x: number; y: number; s: number; step?: number; tail?: number; eye?: number; id: string; rim?: string }> = ({ x, y, s, step = 0.5, tail = 0, eye = 1, id, rim = '#6fe3a6' }) => {
  const px = -560 - 120 * step, py = -250 + 140 * Math.sin(step * Math.PI) * -1 + 60 * step;
  const kx = -430 - 40 * step, ky = -470 - 60 * Math.sin(step * Math.PI);
  const tx = 760 + 40 * Math.sin(tail), ty = -1150 + 30 * Math.cos(tail);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* tail */}
      <path d={`M 500 -640 C 700 -620 790 -760 720 -930 C 680 -1040 ${tx - 90} ${ty - 10} ${tx} ${ty}`} fill="none" stroke={CAT} strokeWidth={66} strokeLinecap="round" />
      <path d={`M 500 -640 C 700 -620 790 -760 720 -930 C 680 -1040 ${tx - 90} ${ty - 10} ${tx} ${ty}`} fill="none" stroke={rim} strokeWidth={6} strokeLinecap="round" opacity={0.35} transform="translate(-24 -20)" />
      {/* far hind leg */}
      <path d="M 260 -440 C 250 -300 270 -150 290 -10 L 350 0 C 340 -150 380 -300 420 -440 Z" fill="#050506" />
      <path d="M -120 -440 C -100 -300 -90 -150 -80 -10 L -20 0 C -40 -150 -40 -300 -20 -440 Z" fill="#050506" />
      {/* body */}
      <path d={`M -330 -560 C -360 -660 -300 -740 -200 -750 C -40 -700 160 -650 380 -715 C 480 -730 560 -640 540 -520
        C 530 -400 500 -300 470 -220 L 490 -60 C 495 -20 480 0 440 0 L 380 0 C 380 -40 400 -60 410 -120
        C 400 -220 360 -320 330 -400 C 220 -470 20 -480 -140 -440
        C -170 -330 -190 -200 -200 -60 C -200 -20 -215 0 -250 0 L -300 0 C -315 -20 -300 -40 -280 -60 C -285 -200 -310 -330 -330 -430 C -345 -480 -345 -520 -330 -560 Z`} fill={CAT} />
      {/* raised front leg */}
      <path d={`M -300 -560 Q ${kx + 40} ${ky - 60} ${kx} ${ky} Q ${(kx + px) / 2 - 10} ${(ky + py) / 2} ${px} ${py}`} fill="none" stroke={CAT} strokeWidth={92} strokeLinecap="round" />
      <path d={`M -330 -600 Q ${kx + 40} ${ky - 100} ${kx - 10} ${ky - 40} Q ${(kx + px) / 2 - 40} ${(ky + py) / 2 - 40} ${px - 30} ${py - 40}`} fill="none" stroke={rim} strokeWidth={6} strokeLinecap="round" opacity={0.4} />
      <ellipse cx={px - 20} cy={py + 20} rx={62} ry={40} fill={CAT} transform={`rotate(-20 ${px - 20} ${py + 20})`} />
      {/* neck + head */}
      <path d="M -330 -540 L -520 -720 L -340 -900 L -170 -740 Z" fill={CAT} />
      <ellipse cx={-430} cy={-800} rx={150} ry={128} fill={CAT} />
      <ellipse cx={-555} cy={-755} rx={62} ry={50} fill={CAT} />
      <path d="M -490 -880 L -520 -1050 L -400 -915 Z" fill={CAT} />
      <path d="M -370 -905 L -330 -1050 L -280 -870 Z" fill={CAT} />
      {/* rim light along back, head and ears */}
      <path d="M -520 -1050 L -400 -915 M -330 -1050 L -280 -870 M -200 -750 C -40 -700 160 -650 380 -715 C 480 -730 560 -640 540 -520" fill="none" stroke={rim} strokeWidth={7} strokeLinecap="round" opacity={0.5} />
      {/* whiskers */}
      {[0, 1, 2].map((i) => <path key={i} d={`M -580 ${-745 + i * 10} Q -660 ${-760 + i * 18} -730 ${-740 + i * 34}`} fill="none" stroke="#2c3a40" strokeWidth={4} />)}
      <CatEye x={-505} y={-815} w={70} open={eye} id={`${id}-e`} tilt={-8} />
    </g>
  );
};

/** Icelandic turf house: 3 timber gables under a snowy turf mound. Origin = ground centre, width ~460. */
export const TurfHouse: React.FC<{ x: number; y: number; s: number; lit?: number }> = ({ x, y, s, lit = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <defs>
      <radialGradient id="th-glow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#ffc76b" stopOpacity={0.45} />
        <stop offset="1" stopColor="#ffc76b" stopOpacity={0} />
      </radialGradient>
    </defs>
    <ellipse cx={0} cy={-60} rx={380} ry={170} fill="url(#th-glow)" opacity={lit} />
    <path d="M -250 0 L -250 -110 Q -220 -270 0 -280 Q 220 -270 250 -110 L 250 0 Z" fill="#2a2520" />
    <path d="M -250 -110 Q -220 -270 0 -280 Q 220 -270 250 -110 Q 200 -200 0 -215 Q -200 -200 -250 -110 Z" fill="#c9d4e0" />
    <path d="M -250 -110 Q -240 -170 -200 -200 Q -150 -170 -160 -130 Z" fill="#5c6f86" opacity={0.6} />
    {[-150, 0, 150].map((gx, i) => (
      <g key={i}>
        <path d={`M ${gx - 68} 0 L ${gx - 68} -120 L ${gx} ${-205 - (i === 1 ? 20 : 0)} L ${gx + 68} -120 L ${gx + 68} 0 Z`} fill="#4b3a2c" />
        <path d={`M ${gx - 76} -116 L ${gx} ${-213 - (i === 1 ? 20 : 0)} L ${gx + 76} -116`} fill="none" stroke="#dfe7ef" strokeWidth={10} strokeLinejoin="round" />
        {i === 1 ? (
          <rect x={gx - 24} y={-80} width={48} height={80} fill="#1a130d" />
        ) : (
          <g>
            <rect x={gx - 22} y={-100} width={44} height={40} fill="#ffc76b" opacity={0.25 + 0.75 * lit} />
            <path d={`M ${gx} -100 L ${gx} -60 M ${gx - 22} -80 L ${gx + 22} -80`} stroke="#4b3a2c" strokeWidth={5} />
          </g>
        )}
      </g>
    ))}
    <path d="M -270 4 Q -120 -30 0 -6 Q 140 -34 270 4 Z" fill="#dfe7ef" />
  </g>
);

/** Knitted red sock hanging from its cuff (origin = top centre of cuff). */
export const Sock: React.FC<{ x: number; y: number; s?: number; rot?: number; flip?: boolean }> = ({ x, y, s = 1, rot = 0, flip }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${flip ? -s : s} ${s})`}>
    <path d="M -60 40 L -60 250 Q -60 300 -20 320 L 110 360 Q 160 372 166 330 Q 170 290 120 276 L 50 250 L 50 40 Z" fill="#b33a3a" />
    <path d="M -60 250 Q -60 300 -20 320 L 0 326 Q -30 290 -20 250 Z" fill="#8a2626" />
    <path d="M 120 276 Q 170 290 166 330 Q 160 372 110 360 Q 140 330 120 276 Z" fill="#8a2626" />
    {[120, 170].map((yy) => <rect key={yy} x={-60} y={yy} width={110} height={14} fill="#d8cbb4" opacity={0.9} />)}
    {[-40, -15, 10, 35].map((xx) => <path key={xx} d={`M ${xx} 70 L ${xx + 8} 82 L ${xx + 16} 70`} fill="none" stroke="#d8cbb4" strokeWidth={4} opacity={0.7} />)}
    <rect x={-68} y={0} width={126} height={48} rx={8} fill="#d8cbb4" />
    {[-50, -30, -10, 10, 30].map((xx) => <rect key={xx} x={xx} y={6} width={6} height={36} fill="#b9aa90" />)}
    <rect x={-10} y={-26} width={16} height={46} rx={4} fill="#8a6a48" />
  </g>
);
