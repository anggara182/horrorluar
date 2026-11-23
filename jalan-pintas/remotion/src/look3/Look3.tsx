// Look test v3: 2.5D. Flat painted sprites (SVG/canvas) on planes in 3D space, unlit; depth comes from parallax + fog.
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AbsoluteFill, continueRender, delayRender, useVideoConfig } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { asphaltTex, skyTex, skylineTex, treesTex } from '../look2/sets2';
import { chatScreen2 } from '../ui/screens2';
import { Caption, words } from '../ui/Caption';
import { driverBackPov, handPhone, ridersBack, ridersSide } from './svg';
import { blobTex, coneTex, fogTex, glowTex, poleTex, railTex, signalTex, svgTex, tokoTex, wallTex } from './paint';

type V3 = [number, number, number];
type Tex = Record<string, THREE.Texture>;

const aspect = (t: THREE.Texture) => { const im: any = t.image; return im.width / im.height; };

/** Flat sprite standing on the ground: p = bottom centre, h = height in metres. */
const Sprite: React.FC<{ tex: THREE.Texture; p: V3; h: number; color?: string; opacity?: number; ry?: number; fog?: boolean; order?: number }> =
  ({ tex, p, h, color = '#ffffff', opacity = 1, ry = 0, fog = true, order }) => {
    const w = h * aspect(tex);
    return (
      <group position={p} rotation={[0, ry, 0]}>
        <mesh position={[0, h / 2, 0]} renderOrder={order}>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial map={tex} color={color} transparent opacity={opacity} alphaTest={0.02} fog={fog} toneMapped={false} />
        </mesh>
      </group>
    );
  };

const Add: React.FC<{ tex: THREE.Texture; p: V3; s: [number, number]; color: string; opacity?: number; r?: V3 }> = ({ tex, p, s, color, opacity = 0.8, r = [0, 0, 0] }) => (
  <mesh position={p} rotation={r} renderOrder={20}>
    <planeGeometry args={s} />
    <meshBasicMaterial map={tex} color={color} transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false} fog={false} toneMapped={false} side={THREE.DoubleSide} />
  </mesh>
);

const Flat: React.FC<{ tex: THREE.Texture; p: V3; s: [number, number]; color?: string; opacity?: number; rep?: [number, number] }> = ({ tex, p, s, color = '#ffffff', opacity = 1, rep }) => {
  const t = useMemo(() => { if (!rep) return tex; const c = tex.clone(); c.repeat.set(rep[0], rep[1]); c.needsUpdate = true; return c; }, [tex]);
  return (
    <mesh position={p} rotation={[-Math.PI / 2, 0, 0]} renderOrder={opacity < 1 ? 5 : 0}>
      <planeGeometry args={s} />
      <meshBasicMaterial map={t} color={color} transparent={opacity < 1} opacity={opacity} depthWrite={opacity >= 1} toneMapped={false} />
    </mesh>
  );
};

/** Light cone: narrow end at p, pointing along angle a (radians, 0 = up), length len. */
const Cone: React.FC<{ tex: THREE.Texture; p: V3; a: number; len: number; w: number; color: string; opacity?: number; ry?: number }> = ({ tex, p, a, len, w, color, opacity = 0.3, ry = 0 }) => (
  <group position={p} rotation={[0, ry, a]}>
    <Add tex={tex} p={[0, len / 2, 0]} s={[w, len]} color={color} opacity={opacity} />
  </group>
);

const CamRig: React.FC<{ p: V3; t: V3; fov: number }> = ({ p, t, fov }) => {
  const { camera } = useThree();
  useLayoutEffect(() => { const c = camera as THREE.PerspectiveCamera; c.position.set(...p); c.fov = fov; c.near = 0.02; c.far = 400; c.lookAt(...t); c.updateProjectionMatrix(); c.updateMatrixWorld(); });
  return null;
};

/** Children follow the camera (POV props). */
const OnCamera: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { camera } = useThree(); const ref = useRef<THREE.Group>(null);
  useLayoutEffect(() => { ref.current!.position.copy(camera.position); ref.current!.quaternion.copy(camera.quaternion); });
  return <group ref={ref}>{children}</group>;
};

const Shot1: React.FC<{ t: Tex }> = ({ t }) => (
  <>
    <color attach="background" args={['#141634']} />
    <fog attach="fog" args={['#1c1d46', 16, 70]} />
    <CamRig p={[0.55, 0.55, 4.3]} t={[0.2, 1.32, -1]} fov={44} />
    <Sprite tex={t.sky} p={[0, -10, -90]} h={80} fog={false} />
    <Sprite tex={t.skyFar} p={[-4, 0, -42]} h={14} color="#8d88c8" />
    <Sprite tex={t.skyNear} p={[8, 0, -26]} h={9} color="#b3b0dd" />
    <Flat tex={t.asphalt} p={[0, 0, 0]} s={[60, 22]} rep={[6, 2]} color="#8c90ad" />
    <Flat tex={t.paving} p={[0, 0.01, -6.6]} s={[30, 3]} color="#c9cde0" />
    <Sprite tex={t.toko} p={[0.6, 0, -8.6]} h={5.4} />
    <Add tex={t.glow} p={[0.6, 2.2, -8.0]} s={[16, 9]} color="#ffd8a8" opacity={0.55} />
    <Add tex={t.glow} p={[0.6, 4.1, -8.2]} s={[10, 3.5]} color="#ff8a2a" opacity={0.6} />
    <Add tex={t.glow} p={[0.6, 0.02, -5.5]} s={[14, 6]} color="#ffe6c4" opacity={0.45} r={[-Math.PI / 2, 0, 0]} />
    <Sprite tex={t.pole} p={[-4.2, 0, -5]} h={10} color="#9aa0c0" />
    {/* riders + light */}
    <mesh position={[0.25, 0.012, 0.05]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={6}><planeGeometry args={[2.5, 0.8]} /><meshBasicMaterial map={t.blob} transparent opacity={0.75} depthWrite={false} /></mesh>
    <Sprite tex={t.riders} p={[0.2, -0.057, 0]} h={2.0} order={8} />
    <Cone tex={t.cone} p={[0.95, 1.0, 0.02]} a={-Math.PI / 2 - 0.16} len={4.2} w={2.0} color="#fff1cf" opacity={0.28} />
    <Add tex={t.glow} p={[0.98, 1.0, 0.05]} s={[0.9, 0.9]} color="#fff3d0" opacity={0.95} />
    <Add tex={t.glow} p={[-0.6, 0.72, 0.05]} s={[0.6, 0.6]} color="#ff2a2a" opacity={0.8} />
    <Add tex={t.glow} p={[3.4, 0.02, 0.4]} s={[4.5, 2.2]} color="#fff1cf" opacity={0.5} r={[-Math.PI / 2, 0, 0]} />
    {/* foreground pole + kerb, close to the lens */}
    <Sprite tex={t.pole} p={[-1.55, 0, 2.6]} h={10} color="#4a4f66" order={30} />
  </>
);

const Shot2: React.FC<{ t: Tex }> = ({ t }) => {
  const scale = 0.24 / 1100;
  return (
    <>
      <color attach="background" args={['#090b20']} />
      <fog attach="fog" args={['#0c0e2a', 6, 42]} />
      <CamRig p={[0.1, 1.75, 0]} t={[0.05, 1.0, -6]} fov={58} />
      <Sprite tex={t.sky} p={[0, -12, -95]} h={80} fog={false} />
      <Sprite tex={t.skyFar} p={[0, 0, -48]} h={14} color="#8d88c8" />
      <Sprite tex={t.trees} p={[-7, 0, -22]} h={9} color="#3a3f6a" />
      <Sprite tex={t.trees2} p={[8, 0, -16]} h={8} color="#3a3f6a" />
      <Flat tex={t.dirt} p={[0, -0.01, -40]} s={[40, 90]} color="#2c2c38" />
      <Flat tex={t.asphalt2} p={[0, 0, -40]} s={[5, 90]} rep={[1, 12]} color="#a2a6c2" />
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 2.9, 0.75, -40]} rotation={[0, -s * Math.PI / 2, 0]}>
          <planeGeometry args={[90, 1.5]} /><meshBasicMaterial map={s < 0 ? t.wallL : t.wallR} color="#9aa0c6" toneMapped={false} />
        </mesh>
      ))}
      <Sprite tex={t.pole} p={[2.4, 0, -24]} h={9} color="#7a80a8" />
      <Add tex={t.glow} p={[1.9, 6.4, -23.8]} s={[3, 3]} color="#ffd6a0" opacity={0.9} />
      <Add tex={t.glow} p={[1.2, 0.03, -22]} s={[7, 5]} color="#ffcf8f" opacity={0.55} r={[-Math.PI / 2, 0, 0]} />
      {/* headlight pool on the road ahead */}
      <Add tex={t.glow} p={[0.1, 0.02, -5]} s={[5, 10]} color="#fff0cc" opacity={0.85} r={[-Math.PI / 2, 0, 0]} />
      <Cone tex={t.cone} p={[0, 0.95, -1.6]} a={Math.PI / 2 - 0.12} len={7} w={3} color="#fff0cc" opacity={0.12} ry={Math.PI / 2} />
      {/* the driver's back */}
      <Sprite tex={t.driverBack} p={[-0.2, 0.96, -1.35]} h={0.84} order={10} />
      <OnCamera>
        <group position={[0.045, -0.078, -0.3]} rotation={[-0.15, -0.1, 0.07]}>
          <mesh renderOrder={40}><planeGeometry args={[0.24 * aspect(t.hand), 0.24]} /><meshBasicMaterial map={t.hand} transparent alphaTest={0.02} toneMapped={false} fog={false} /></mesh>
          <mesh position={[0, 60 * scale, 0.0006]} renderOrder={41}><planeGeometry args={[380 * scale, 820 * scale]} /><meshBasicMaterial map={t.screen} toneMapped={false} fog={false} /></mesh>
        </group>
        <Add tex={t.glow} p={[0.045, -0.075, -0.31]} s={[0.4, 0.4]} color="#9b72ff" opacity={0.18} />
      </OnCamera>
    </>
  );
};

const Shot3: React.FC<{ t: Tex }> = ({ t }) => (
  <>
    <color attach="background" args={['#1a0607']} />
    <fog attach="fog" args={['#2a0b0d', 7, 42]} />
    <CamRig p={[0.35, 1.6, 3.9]} t={[0.12, 1.3, 0]} fov={40} />
    <Sprite tex={t.skyRed} p={[0, -12, -95]} h={80} fog={false} />
    <Sprite tex={t.trees3} p={[-6, 0, -30]} h={12} color="#5a1c1e" />
    <Sprite tex={t.trees3} p={[9, 0, -22]} h={10} color="#3a1012" />
    <Flat tex={t.dirt} p={[0, -0.01, -30]} s={[40, 80]} color="#5a3632" />
    <Flat tex={t.rail} p={[-2.1, 0, -30]} s={[2.4, 80]} rep={[1, 9]} color="#c98a7a" />
    <Sprite tex={t.signal} p={[-3.8, 0, -12]} h={4.5} color="#d9b0b0" />
    <Add tex={t.glow} p={[-3.8, 3.95, -11.9]} s={[3.6, 3.6]} color="#ff2a2a" opacity={0.95} />
    <Sprite tex={t.signal} p={[-3.4, 0, -36]} h={4.5} color="#a06060" />
    <Add tex={t.glow} p={[-3.4, 3.95, -35.9]} s={[3, 3]} color="#ff2a2a" opacity={0.7} />
    {[-5, -9, -15, -22].map((z, i) => <Sprite key={z} tex={t.fog} p={[i % 2 ? 1.5 : -1.5, 0, z]} h={2.6} color="#ffffff" opacity={0.7} order={3} />)}
    {/* follower headlight = camera: light pool + long shadow forward */}
    <Add tex={t.glow} p={[0.2, 0.02, 1.2]} s={[5, 6]} color="#fff2e0" opacity={0.55} r={[-Math.PI / 2, 0, 0]} />
    <mesh position={[0.15, 0.015, -2.2]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={6}><planeGeometry args={[1.5, 5]} /><meshBasicMaterial map={t.blob} transparent opacity={0.75} depthWrite={false} /></mesh>
    <Sprite tex={t.ridersBack} p={[0.1, -0.057, 0]} h={2.0} order={8} />
  </>
);

const Grade: React.FC<{ tint?: string; vignette?: number; bottomGlow?: string }> = ({ tint, vignette = 0.6, bottomGlow }) => (
  <AbsoluteFill style={{ pointerEvents: 'none' }}>
    {tint && <AbsoluteFill style={{ background: tint, mixBlendMode: 'soft-light' }} />}
    {bottomGlow && <AbsoluteFill style={{ background: bottomGlow, mixBlendMode: 'screen' }} />}
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 78% 62% at 50% 50%, rgba(0,0,0,0) 42%, rgba(5,3,12,${vignette}) 100%)` }} />
    <AbsoluteFill style={{ opacity: 0.08, mixBlendMode: 'overlay', backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='300' height='300' filter='url(%23n)'/></svg>\")" }} />
  </AbsoluteFill>
);

export const Look3: React.FC<{ shot: number }> = ({ shot }) => {
  const { width, height } = useVideoConfig();
  const [h] = useState(() => delayRender('look3 assets'));
  const [tex, setTex] = useState<Tex | null>(null);
  useLayoutEffect(() => {
    (async () => {
      await Promise.all(['500 34px Inter', '700 26px Inter', '800 44px Inter', '900 140px Inter'].map((f) => document.fonts.load(f)));
      const [riders, ridersB, driverBack, hand] = await Promise.all([svgTex(ridersSide(), 1), svgTex(ridersBack(), 1.2), svgTex(driverBackPov(), 1), svgTex(handPhone(), 1)]);
      const dirt = asphaltTex(9, false);
      setTex({
        riders, ridersBack: ridersB, driverBack, hand,
        screen: chatScreen2([{ text: 'Kak, saya udah di titik jemput. Kakaknya di mana?', time: '00.14' }]),
        sky: skyTex('#0a0c2a', '#2a2160', '#5a3a7a'), skyFar: skylineTex(4, '#0e1024', '#ffcf7a', 0.28), skyNear: skylineTex(9, '#141634', '#ffd28a', 0.2),
        trees: treesTex(5, '#0b0e1c'), trees2: treesTex(8, '#0d1020'), trees3: treesTex(12, '#120607'), skyRed: skyTex('#120406', '#4a1014', '#7a2020', false, 7),
        asphalt: asphaltTex(1, true), asphalt2: asphaltTex(2, false), dirt, paving: asphaltTex(3, false),
        toko: tokoTex(), pole: poleTex(), signal: signalTex(), rail: railTex(), wallL: wallTex(3, '#4a5070'), wallR: wallTex(5, '#545a7c'),
        glow: glowTex(), blob: blobTex(), cone: coneTex(), fog: fogTex('150,60,60'),
      });
      continueRender(h);
    })();
  }, []);
  if (!tex) return null;
  const S = shot === 1 ? Shot1 : shot === 2 ? Shot2 : Shot3;
  return (
    <AbsoluteFill style={{ background: '#090b20' }}>
      <ThreeCanvas width={width} height={height} linear={false} gl={{ antialias: false }} onCreated={({ gl }) => { gl.toneMapping = THREE.NoToneMapping; }}>
        <S t={tex} />
      </ThreeCanvas>
      {shot === 1 && <><Grade vignette={0.55} /><Caption words={words('Bayangin kamu lagi dibonceng ojol tengah malem...')} active={4} keyword={4} /></>}
      {shot === 2 && <><Grade vignette={0.65} /><Caption words={words('Kak, saya udah di titik jemput.', 'JUNED')} active={5} keyword={4} top={250} /></>}
      {shot === 3 && <><Grade vignette={0.72} tint="rgba(255,60,60,.12)" bottomGlow="radial-gradient(ellipse 80% 30% at 50% 100%, rgba(255,240,220,.18), rgba(0,0,0,0) 70%)" /><Caption words={words('Dan helm drivernya... ngadep ke belakang.')} active={5} keyword={5} /></>}
    </AbsoluteFill>
  );
};
