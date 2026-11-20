import React from 'react';

/** Giant Yule Cat silhouette, side view walking left->right, origin at the back feet line. s = scale (1 ≈ 700 px long body). walk = gait phase (rad). look: 0 side, 1 head turned back toward camera (eyes visible). */
export const YuleCat: React.FC<{ x: number; y: number; s: number; walk?: number; look?: number; eyes?: number; id: string; fill?: string }> = ({ x, y, s, walk = 0, look = 0.3, eyes = 1, id, fill = '#08080a' }) => {
  const a = Math.sin(walk) * 40, b = Math.sin(walk + Math.PI) * 40;
  const leg = (lx: number, sw: number, front: boolean) => {
    const w = front ? 34 : 40;
    return <path d={`M ${lx - w} -250 C ${lx - w - 6} -150 ${lx - w + sw * 0.6} -70 ${lx - w + sw} -14 L ${lx + sw - 26} 0 L ${lx + sw + 40} 0 C ${lx + sw + 30} -30 ${lx + w * 0.6 + sw * 0.5} -90 ${lx + w} -260 Z`} fill={fill} />;
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <radialGradient id={`${id}eg`} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffd23f" stopOpacity="0.85" /><stop offset="0.35" stopColor="#ffb000" stopOpacity="0.3" /><stop offset="1" stopColor="#ffb000" stopOpacity="0" /></radialGradient>
      </defs>
      {/* tail, raised curve */}
      <path d={`M -320 -360 C -440 -380 -500 -500 -470 -660 C -455 -740 -400 -770 -375 -735 C -420 -650 -420 -520 -320 -450 Z`} fill={fill} />
      {/* far legs */}
      {leg(-240, b, false)}{leg(190, a, true)}
      {/* body */}
      <path d={`M -350 -330 C -380 -470 -290 -560 -150 -560 C -30 -560 80 -520 200 -540 C 300 -555 350 -470 335 -340 C 320 -240 250 -200 160 -215 C 40 -230 -60 -200 -180 -205 C -300 -210 -340 -260 -350 -330 Z`} fill={fill} />
      {/* near legs */}
      {leg(-200, a, false)}{leg(230, b, true)}
      {/* neck + head */}
      <g transform={`translate(320 -500)`}>
        <path d={`M -90 30 C -60 -60 -10 -110 50 -120 L 110 -40 C 90 20 30 60 -40 80 Z`} fill={fill} />
        <ellipse cx={70} cy={-110} rx={95} ry={80} fill={fill} />
        {/* ears */}
        <path d={`M 10 -160 L 0 -265 L 75 -185 Z`} fill={fill} />
        <path d={`M 95 -175 L 145 -270 L 160 -160 Z`} fill={fill} />
        {/* muzzle */}
        <path d={`M 140 -120 C 185 -105 190 -70 160 -55 L 100 -60 Z`} fill={fill} />
        {/* whiskers */}
        <path d={`M 160 -78 L 250 -95 M 160 -70 L 255 -66 M 158 -62 L 240 -38`} stroke={fill} strokeWidth={3} />
        {eyes > 0 && <g opacity={eyes}>
          <circle cx={60 + look * 0} cy={-120} r={70} fill={`url(#${id}eg)`} />
          <circle cx={120} cy={-120} r={60} fill={`url(#${id}eg)`} />
          <path d={`M 38 -128 C 52 -142 78 -140 88 -124 C 76 -112 52 -112 38 -128 Z`} fill="#ffd23f" />
          <path d={`M 108 -126 C 118 -140 140 -138 148 -122 C 138 -112 118 -112 108 -126 Z`} fill="#ffd23f" opacity={0.85 + look * 0.15} />
          <ellipse cx={63} cy={-126} rx={3.5} ry={10} fill={fill} />
          <ellipse cx={128} cy={-124} rx={3} ry={9} fill={fill} />
        </g>}
      </g>
    </g>
  );
};

/** One giant paw print in snow (perspective-squashed ellipse group). */
export const PawPrint: React.FC<{ x: number; y: number; s: number; rot?: number; o?: number; dark?: string; lip?: string }> = ({ x, y, s, rot = 0, o = 1, dark = '#5c6f86', lip = '#f4f8fc' }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s} ${s * 0.55})`} opacity={o}>
    <path d="M -72 30 C -80 -30 -30 -40 0 -20 C 30 -40 80 -30 72 30 C 60 75 -60 75 -72 30 Z" fill={lip} />
    <path d="M -62 32 C -68 -18 -28 -28 0 -8 C 28 -28 68 -18 62 32 C 52 66 -52 66 -62 32 Z" fill={dark} />
    {[-92, -34, 34, 92].map((dx, i) => (
      <g key={i}>
        <ellipse cx={dx} cy={-92 + Math.abs(dx) * 0.5} rx={27} ry={34} fill={lip} />
        <ellipse cx={dx} cy={-88 + Math.abs(dx) * 0.5} rx={22} ry={28} fill={dark} />
      </g>
    ))}
  </g>
);
