import React from 'react';

/** Long pale hand reaching in from the right, fingertips pinching at origin. (from library ep07 graphic_art PaleHand) */
export const PaleHand: React.FC<{ id?: string }> = ({ id = 'gph' }) => (
  <g>
    <defs>
      <linearGradient id={`${id}Skin`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#e3e5e9" />
        <stop offset="0.5" stopColor="#c9ccd1" />
        <stop offset="1" stopColor="#4f5258" />
      </linearGradient>
    </defs>
    <path d="M150 140 C260 170 380 240 520 330 L560 230 C430 160 300 90 190 60 Z" fill={`url(#${id}Skin)`} />
    <path d="M480 300 C540 330 620 380 700 430 L760 290 C680 240 600 210 520 190 Z" fill="#141114" />
    <path d="M40 20 C60 -10 120 -10 190 60 L150 140 C100 120 60 90 30 70 Z" fill={`url(#${id}Skin)`} />
    <path d="M40 20 C10 0 -40 -14 -96 -22 C-112 -24 -116 -10 -102 -4 C-50 6 0 30 34 54 Z" fill="#d6d8dc" />
    <path d="M36 52 C0 50 -50 46 -104 46 C-120 48 -118 62 -102 64 C-50 68 0 74 34 82 Z" fill="#c9ccd1" />
    <path d="M34 82 C0 90 -40 100 -84 108 C-98 112 -94 126 -80 124 C-36 120 6 114 40 106 Z" fill="#b9bcc2" />
    <path d="M60 -6 C30 -40 -10 -60 -46 -66 C-58 -66 -58 -52 -48 -48 C-14 -38 20 -16 44 10 Z" fill="#c4c7cc" />
    <path d="M-100 -20 C-110 -18 -112 -8 -102 -6" fill="none" stroke="#f1f2f4" strokeWidth={3} />
    <path d="M-104 48 C-114 50 -114 60 -104 62" fill="none" stroke="#f1f2f4" strokeWidth={3} />
    <path d="M-30 -10 Q-26 -2 -32 4 M-40 48 Q-36 56 -42 62 M-20 100 Q-16 108 -22 114" stroke="#878a90" strokeWidth={2} fill="none" />
    <path d="M60 -6 C30 -40 -10 -60 -46 -66" fill="none" stroke="#ffb59a" strokeWidth={3} opacity={0.8} />
    <path d="M40 20 C10 0 -40 -14 -96 -22" fill="none" stroke="#ffb59a" strokeWidth={2.5} opacity={0.7} />
    <path d="M190 60 C300 90 430 160 560 230" fill="none" stroke="#ff8a5c" strokeWidth={3} opacity={0.6} />
  </g>
);
