import React from 'react';
import { Composition } from 'remotion';
import { LookTest } from './LookTest';
import { Look2 } from './look2/Look2';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="LookTest" component={LookTest} width={1080} height={1920} fps={24} durationInFrames={48} defaultProps={{ shot: 1 }} />
    <Composition id="Look2" component={Look2} width={1080} height={1920} fps={24} durationInFrames={48} defaultProps={{ shot: 1 }} />
  </>
);
