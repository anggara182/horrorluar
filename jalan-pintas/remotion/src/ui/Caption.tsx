// Karaoke caption: words said so far in grey, the current word white and bold, one keyword in a selection box.
import React from 'react';
import { AbsoluteFill } from 'remotion';

export type CapWord = { w: string; who?: 'NARATOR' | 'PENGENDARA' | 'JUNED' };

const COLOR = { NARATOR: '#ffffff', PENGENDARA: '#C9CCD6', JUNED: '#C7A8FF' } as const;

const Handle: React.FC<{ s: React.CSSProperties }> = ({ s }) => (
  <span style={{ position: 'absolute', width: 12, height: 12, background: '#fff', border: '2px solid #7B3FE4', ...s }} />
);

export const Caption: React.FC<{ words: CapWord[]; active: number; keyword?: number; top?: number }> = ({ words, active, keyword, top = 330 }) => (
  <AbsoluteFill style={{ alignItems: 'center' }}>
    <div style={{ position: 'absolute', top, width: 900, textAlign: 'center', fontFamily: 'Inter, sans-serif', fontSize: 64, lineHeight: 1.3,
      letterSpacing: -0.5, textShadow: '0 3px 18px rgba(0,0,0,.85), 0 0 2px rgba(0,0,0,.9)' }}>
      {words.slice(0, active + 1).map((x, i) => {
        const now = i === active; const col = COLOR[x.who ?? 'NARATOR'];
        const boxed = i === keyword;
        return (
          <React.Fragment key={i}>
            <span style={{ position: 'relative', display: 'inline-block', padding: boxed ? '0 10px' : 0,
              color: now || boxed ? col : 'rgba(205,208,220,.72)', fontWeight: now || boxed ? 800 : 500,
              border: boxed ? '3px solid #7B3FE4' : 'none', background: boxed ? 'rgba(123,63,228,.28)' : 'none' }}>
              {x.w}
              {boxed && <>
                <Handle s={{ left: -8, top: -8 }} /><Handle s={{ right: -8, top: -8 }} />
                <Handle s={{ left: -8, bottom: -8 }} /><Handle s={{ right: -8, bottom: -8 }} />
              </>}
            </span>{' '}
          </React.Fragment>
        );
      })}
    </div>
  </AbsoluteFill>
);

export const words = (s: string, who: CapWord['who'] = 'NARATOR'): CapWord[] => s.split(' ').map((w) => ({ w, who }));
