import React from 'react';

/** Child from behind in wool jumper + wellies. (x,y) = feet, h = height. */
export const Kid: React.FC<{ x: number; y: number; h: number; phase?: number; jumper: string; hair?: 'long' | 'short'; rim?: number; reach?: number; rc?: string; boot?: string }> = ({ x, y, h, phase = 0, jumper, hair = 'long', rim = 1, reach = 0, rc = '#ffc76b', boot = '#2a1d14' }) => {
  const s = h / 500;
  const sw = Math.sin(phase) * 14;
  const bob = Math.abs(Math.sin(phase)) * 4;
  const R = rc;
  return (
    <g transform={`translate(${x},${y - bob * s}) scale(${s})`}>
      {/* legs + wellies */}
      <path d={`M -34 -230 L ${-40 + sw} -70 L ${-14 + sw} -70 L -4 -220 Z`} fill="#1d1612" />
      <path d={`M 4 -220 L ${14 - sw} -70 L ${40 - sw} -70 L 34 -230 Z`} fill="#1d1612" />
      <path d={`M ${-44 + sw} -86 L ${-46 + sw} -2 L ${-10 + sw} 0 L ${-12 + sw} -86 Z`} fill={boot} />
      <path d={`M ${12 - sw} -86 L ${10 - sw} 0 L ${46 - sw} -2 L ${44 - sw} -86 Z`} fill={boot} />
      {/* jumper torso */}
      <path d="M -62 -368 Q -74 -300 -54 -214 L 54 -214 Q 74 -300 62 -368 Q 34 -392 0 -394 Q -34 -392 -62 -368 Z" fill={jumper} />
      <path d="M -54 -230 L 54 -230 L 54 -214 L -54 -214 Z" fill="#000" opacity={0.25} />
      {/* arms */}
      <path d={`M -62 -364 Q -82 -300 ${-74 - sw * 0.4} -236 L ${-56 - sw * 0.4} -232 Q -58 -300 -48 -350 Z`} fill={jumper} />
      <g transform={`rotate(${-reach * 60}, 62, -360)`}>
        <path d={`M 62 -364 Q 82 -300 ${74 + sw * 0.4} -236 L ${56 + sw * 0.4} -232 Q 58 -300 48 -350 Z`} fill={jumper} />
      </g>
      {/* head + hair */}
      <rect x={-12} y={-414} width={24} height={26} fill="#1a1416" />
      <ellipse cx={0} cy={-452} rx={42} ry={48} fill="#1a1416" />
      {hair === 'long'
        ? <path d="M -46 -462 Q -44 -510 0 -506 Q 44 -510 46 -462 Q 52 -390 42 -330 Q 0 -320 -42 -330 Q -52 -390 -46 -462 Z" fill="#120d0c" />
        : <path d="M -46 -456 Q -44 -506 0 -503 Q 44 -506 46 -456 L 44 -430 Q 0 -420 -44 -430 Z" fill="#120d0c" />}
      {/* cool rim from the loch */}
      <g stroke={R} fill="none" strokeLinecap="round" opacity={0.7 * rim}>
        <path d="M -40 -496 Q 0 -512 40 -496" strokeWidth={4} />
        <path d="M 64 -360 Q 76 -300 70 -240" strokeWidth={4} opacity={0.7} />
        <path d="M 46 -470 Q 52 -420 46 -380" strokeWidth={3} opacity={0.6} />
      </g>
    </g>
  );
};
