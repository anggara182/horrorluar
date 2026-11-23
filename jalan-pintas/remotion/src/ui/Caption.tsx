// Plain, readable social-video caption: the whole phrase at once, white bold Inter with a thick dark outline.
// Default position = lower third; pass `top` to move it per shot (POV phone shots use the top).
// (`active`/`keyword` are accepted for old look-test callers and ignored.)
import React from 'react';
import { AbsoluteFill } from 'remotion';

export type CapWord = { w: string; who?: 'NARATOR' | 'PENGENDARA' | 'JUNED' };

const TINT = { NARATOR: '#ffffff', PENGENDARA: '#ffffff', JUNED: '#e6dbff' } as const;

export const Caption: React.FC<{ words: CapWord[]; active?: number; keyword?: number; top?: number }> = ({ words, top = 1320 }) => {
  const who = words[0]?.who ?? 'NARATOR';
  return (
    <AbsoluteFill style={{ alignItems: 'center' }}>
      <div style={{
        position: 'absolute', top, width: 940, textAlign: 'center', fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: 70, lineHeight: 1.16,
        letterSpacing: -0.3, color: TINT[who], WebkitTextStroke: '7px #0b0812', paintOrder: 'stroke fill',
        textShadow: '0 4px 18px rgba(0,0,0,.65), 0 0 3px rgba(0,0,0,.8)',
      } as React.CSSProperties}>
        {words.map((x) => x.w).join(' ')}
      </div>
    </AbsoluteFill>
  );
};

export const words = (s: string, who: CapWord['who'] = 'NARATOR'): CapWord[] => s.split(' ').map((w) => ({ w, who }));
