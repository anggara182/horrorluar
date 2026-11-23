// Look test: three key EP01 moments as stills. shot 1 = hook at TOKO 24, 2 = POV phone, 3 = twist (helmet turned back).
import React, { useLayoutEffect, useMemo, useState } from 'react';
import { AbsoluteFill, continueRender, delayRender, useCurrentFrame, useVideoConfig } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { C, Limb, V3 } from './three/kit';
import { Ride, Phone } from './three/cast';
import { Asphalt, JalanGelap, RelMati, Tiang, Toko24 } from './three/sets';
import { chatScreen } from './ui/screens';
import { Caption, words } from './ui/Caption';

const CamRig: React.FC<{ pos: V3; target: V3; fov: number }> = ({ pos, target, fov }) => {
  const { camera } = useThree();
  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(...pos); cam.fov = fov; cam.near = 0.02; cam.far = 200; cam.lookAt(...target); cam.updateProjectionMatrix();
  }, [pos.join(), target.join(), fov]);
  return null;
};

const Headlight: React.FC<{ p: V3; to: V3; intensity?: number; color?: string; angle?: number }> = ({ p, to, intensity = 40, color = '#fff3d6', angle = 0.45 }) => {
  const target = useMemo(() => new THREE.Object3D(), []);
  return (
    <>
      <primitive object={target} position={to} />
      <spotLight position={p} target={target} color={color} intensity={intensity} angle={angle} penumbra={0.6} distance={30} decay={1.2}
        castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-bias={-0.0005} />
    </>
  );
};

const Moon: React.FC<{ color?: string; intensity?: number; p?: V3 }> = ({ color = '#7d8fd6', intensity = 1.2, p = [-8, 12, 6] }) => (
  <directionalLight position={p} color={color} intensity={intensity} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
    shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8} shadow-bias={-0.0004} />
);

/** POV hand holding the phone, attached to the camera (camera looks down its local -Z). */
const PovHand: React.FC<{ screen: THREE.Texture }> = ({ screen }) => {
  const { camera } = useThree();
  const ref = React.useRef<THREE.Group>(null);
  useLayoutEffect(() => { ref.current!.position.copy(camera.position); ref.current!.quaternion.copy(camera.quaternion); });
  return (
    <group ref={ref}>
      <group position={[0.012, -0.075, -0.3]} rotation={[-0.25, 0.06, 0.04]}>
        <Phone screen={screen} p={[0, 0, 0]} />
        <mesh position={[0.005, -0.045, -0.026]}><boxGeometry args={[0.085, 0.1, 0.035]} /><meshStandardMaterial color={C.kulit} roughness={0.7} /></mesh>
        {[0, 1, 2, 3].map((i) => <Limb key={i} a={[-0.04, -0.01 - i * 0.022, -0.012]} b={[-0.046, -0.01 - i * 0.022, 0.004]} r={0.009} color={C.kulit} cast={false} />)}
        <Limb a={[0.045, -0.07, -0.01]} b={[0.044, -0.025, 0.008]} r={0.011} color={C.kulit} cast={false} />
        <Limb a={[0.02, -0.09, -0.03]} b={[0.09, -0.32, 0.1]} r={0.04} color={C.seragam} />
      </group>
    </group>
  );
};

const useFontsReady = () => {
  const [h] = useState(() => delayRender('fonts'));
  const [ok, setOk] = useState(false);
  useLayoutEffect(() => {
    Promise.all(['500 34px Inter', '700 26px Inter', '800 44px Inter', '900 150px Inter'].map((f) => document.fonts.load(f)))
      .then(() => { setOk(true); continueRender(h); });
  }, []);
  return ok;
};

const Grade: React.FC<{ tint?: string; vignette?: number }> = ({ tint, vignette = 0.55 }) => (
  <AbsoluteFill style={{ pointerEvents: 'none' }}>
    {tint && <AbsoluteFill style={{ background: tint, mixBlendMode: 'multiply' }} />}
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,${vignette}) 100%)` }} />
  </AbsoluteFill>
);

export const LookTest: React.FC<{ shot: number }> = ({ shot }) => {
  const { width, height } = useVideoConfig();
  useCurrentFrame();
  const fonts = useFontsReady();
  const screen = useMemo(() => (fonts ? chatScreen([{ text: 'Kak, saya udah di titik jemput. Kakaknya di mana?', time: '00.14' }]) : undefined), [fonts]);
  if (!fonts) return null;

  if (shot === 1) {
    return (
      <AbsoluteFill style={{ background: C.navy }}>
        <ThreeCanvas width={width} height={height} shadows linear={false} onCreated={({ gl }) => { gl.toneMappingExposure = 1.3; }}>
          <color attach="background" args={['#0d1233']} />
          <fog attach="fog" args={['#0d1233', 10, 45]} />
          <CamRig pos={[0.9, 0.35, 4.2]} target={[0.0, 1.45, -1.5]} fov={50} />
          <hemisphereLight args={['#4a5aa8', '#1a1a24', 1.0]} />
          <Moon />
          <group rotation={[0, Math.PI / 2, 0]}><Asphalt /></group>
          <Toko24 x={-0.2} z={-5.5} ry={0} />
          <pointLight position={[2.2, 1.9, 2.6]} color="#ffe2c4" intensity={7} distance={8} decay={1.3} />
          <Tiang x={-3.5} z={-3.2} lamp /><Tiang x={6} z={-3.2} />
          <group position={[0.4, 0, 0.3]} rotation={[0, -Math.PI / 2 + 0.55, 0]}>
            <Ride screen={screen} />
            <Headlight p={[0, 1.0, 0.7]} to={[0, 0, 6]} />
          </group>
        </ThreeCanvas>
        <Grade />
        <Caption words={words('Bayangin kamu lagi dibonceng ojol tengah malem...')} active={4} keyword={4} />
      </AbsoluteFill>
    );
  }

  if (shot === 2) {
    return (
      <AbsoluteFill style={{ background: C.navy }}>
        <ThreeCanvas width={width} height={height} shadows linear={false} onCreated={({ gl }) => { gl.toneMappingExposure = 1.3; }}>
          <color attach="background" args={['#070a1c']} />
          <fog attach="fog" args={['#070a1c', 4, 26]} />
          <CamRig pos={[0.24, 1.64, -0.5]} target={[-0.15, 1.05, 3.0]} fov={52} />
          <hemisphereLight args={['#33407e', '#0c0c12', 0.8]} />
          <Moon intensity={0.7} p={[6, 10, -4]} />
          <JalanGelap />
          <group position={[0, 0, 0]}>
            <Ride showPassenger={false} />
            <Headlight p={[0, 1.0, 0.7]} to={[0, 0, 8]} intensity={60} />
          </group>
          <PovHand screen={screen!} />
        </ThreeCanvas>
        <Grade vignette={0.65} />
        <Caption words={words('Kak, saya udah di titik jemput.', 'JUNED')} active={5} keyword={4} top={250} />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ background: '#120606' }}>
      <ThreeCanvas width={width} height={height} shadows linear={false} onCreated={({ gl }) => { gl.toneMappingExposure = 1.3; }}>
        <color attach="background" args={['#170707']} />
        <fog attach="fog" args={['#1d0909', 6, 30]} />
        <CamRig pos={[1.5, 2.15, 3.3]} target={[0.45, 1.35, -0.2]} fov={38} />
        <hemisphereLight args={['#6a2626', '#100606', 0.75]} />
        <Moon color="#5a6cb0" intensity={0.5} p={[-6, 10, -6]} />
        <RelMati />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.5, 0.01, 0]} receiveShadow><planeGeometry args={[1.8, 120]} /><meshStandardMaterial color="#3b2d26" roughness={1} /></mesh>
        <group position={[0.5, 0, 0]} rotation={[0, Math.PI, 0]}>
          <Ride screen={screen} headTurn={Math.PI} passengerHeadTilt={0.55} />
        </group>
        {/* the follower's headlight = the camera */}
        <Headlight p={[0.55, 1.1, 5]} to={[0.5, 1.0, -1]} intensity={45} color="#f6f1e6" angle={0.32} />
      </ThreeCanvas>
      <Grade tint="#ffd0d0" vignette={0.7} />
      <Caption words={words('Dan helm drivernya... ngadep ke belakang.')} active={5} keyword={5} />
    </AbsoluteFill>
  );
};
