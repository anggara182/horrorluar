// Look test v2: 2D/3D mix. Cel-shaded inked 3D cast + painted 2D layers + motivated lighting.
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AbsoluteFill, continueRender, delayRender, useVideoConfig } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Beam, Glow, Limb, T, V3, canvasTex, rbox, cyl } from './toon';
import { Ride, Phone, faceTex, plateTex, K } from './cast2';
import { Card, Ground, StreetLamp, Toko24, asphaltTex, rng, skyTex, skylineTex, treesTex } from './sets2';
import { chatScreen } from '../ui/screens';
import { Caption, words } from '../ui/Caption';

const CamRig: React.FC<{ pos: V3; target: V3; fov: number; roll?: number }> = ({ pos, target, fov, roll = 0 }) => {
  const { camera } = useThree();
  useLayoutEffect(() => {
    const c = camera as THREE.PerspectiveCamera; c.position.set(...pos); c.fov = fov; c.near = 0.02; c.far = 300;
    c.lookAt(...target); c.rotateZ(roll); c.updateProjectionMatrix();
  }, [pos.join(), target.join(), fov, roll]);
  return null;
};

const Spot: React.FC<{ p: V3; to: V3; color: string; intensity: number; angle?: number; penumbra?: number; shadow?: boolean; distance?: number }> =
  ({ p, to, color, intensity, angle = 0.5, penumbra = 0.7, shadow = true, distance = 40 }) => {
    const target = useMemo(() => new THREE.Object3D(), []);
    return (<>
      <primitive object={target} position={to} />
      <spotLight position={p} target={target} color={color} intensity={intensity} angle={angle} penumbra={penumbra} distance={distance} decay={1.1}
        castShadow={shadow} shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0006} shadow-normalBias={0.03} shadow-radius={6} />
    </>);
  };

const Moon: React.FC<{ p: V3; color: string; intensity: number }> = ({ p, color, intensity }) => (
  <directionalLight position={p} color={color} intensity={intensity} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
    shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} shadow-bias={-0.0006} shadow-normalBias={0.03} shadow-radius={4} />
);

const useFonts = () => {
  const [h] = useState(() => delayRender('fonts')); const [ok, setOk] = useState(false);
  useLayoutEffect(() => { Promise.all(['500 34px Inter', '700 26px Inter', '800 44px Inter', '900 140px Inter'].map((f) => document.fonts.load(f))).then(() => { setOk(true); continueRender(h); }); }, []);
  return ok;
};

const Grade: React.FC<{ tint?: string; vignette?: number; glow?: string }> = ({ tint, vignette = 0.6, glow }) => (
  <AbsoluteFill style={{ pointerEvents: 'none' }}>
    {tint && <AbsoluteFill style={{ background: tint, mixBlendMode: 'soft-light' }} />}
    {glow && <AbsoluteFill style={{ background: glow, mixBlendMode: 'screen' }} />}
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 75% 60% at 50% 52%, rgba(0,0,0,0) 40%, rgba(5,3,12,${vignette}) 100%)` }} />
    <AbsoluteFill style={{ opacity: 0.09, mixBlendMode: 'overlay', backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='300' height='300' filter='url(%23n)'/></svg>\")" }} />
  </AbsoluteFill>
);

/** POV hand + phone glued to the camera. */
const PovHand: React.FC<{ screen: THREE.Texture }> = ({ screen }) => {
  const { camera } = useThree(); const ref = useRef<THREE.Group>(null);
  useLayoutEffect(() => { ref.current!.position.copy(camera.position); ref.current!.quaternion.copy(camera.quaternion); });
  return (
    <group ref={ref}>
      <group position={[0.02, -0.07, -0.29]} rotation={[-0.22, -0.08, 0.06]}>
        <Phone screen={screen} />
        <T g={rbox(0.08, 0.1, 0.034, 0.015)} p={[0.006, -0.048, -0.024]} color={K.kulit} outline={0.003} />
        {[0, 1, 2, 3].map((i) => <Limb key={i} a={[-0.042, -0.012 - i * 0.021, -0.014]} b={[-0.047, -0.012 - i * 0.021, 0.004]} r={0.0085} color={K.kulit} outline={0.002} />)}
        <Limb a={[0.044, -0.075, -0.01]} b={[0.043, -0.03, 0.009]} r={0.0105} color={K.kulit} outline={0.002} />
        <Limb a={[0.02, -0.095, -0.03]} b={[0.1, -0.33, 0.12]} r={0.042} color={K.kulit} outline={0.003} />
        <Limb a={[0.075, -0.25, 0.06]} b={[0.13, -0.42, 0.18]} r={0.05} color={K.seragam} outline={0.003} />
      </group>
    </group>
  );
};

const Shot1: React.FC<{ tex: Record<string, THREE.Texture> }> = ({ tex }) => (
  <>
    <color attach="background" args={['#141634']} />
    <fog attach="fog" args={['#1a1c44', 18, 60]} />
    <CamRig pos={[1.7, 0.5, 5.8]} target={[-0.2, 1.55, -2.2]} fov={44} roll={-0.03} />
    <hemisphereLight args={['#5866b8', '#1c1a26', 0.55]} />
    <Moon p={[-6, 10, 8]} color="#8ea0ff" intensity={0.7} />
    <Card tex={tex.sky} p={[0, 14, -45]} w={110} h={60} />
    <Card tex={tex.sky2} p={[0, 4.2, -26]} w={48} h={12} />
    <Card tex={tex.sky1} p={[-6, 3.4, -15]} w={30} h={7.5} />
    <Ground tex={tex.asphalt} w={60} d={6} rep={[8, 1]} />
    <T g={rbox(60, 0.16, 0.3, 0.02)} p={[0, 0.08, -3.05]} color="#6b6f7c" outline={0} />
    <Ground tex={tex.paving} w={60} d={4} rep={[14, 1]} p={[0, 0.16, -5.2]} color="#9aa0b4" />
    <Toko24 p={[0.4, 0.16, -7.4]} />
    <StreetLamp p={[-3.6, 0, -3.4]} />
    <Spot p={[-3.6, 6.2, -2.1]} to={[0.2, 0.8, 0.3]} color="#ffcf8f" intensity={70} angle={0.55} />
    <pointLight position={[3, 1.6, 3.5]} color="#9fb4ff" intensity={3} distance={9} />
    <group position={[0.3, 0, 0.45]} rotation={[0, -2.62, 0]}>
      <Ride plate={tex.plate} face={tex.face} screen={tex.screen} />
      <Spot p={[0.7, 1.1, 0]} to={[6, 0, 0]} color="#fff1cf" intensity={50} angle={0.42} shadow={false} />
      <Beam p={[2.2, 0.9, 0]} r={[0, 0, -Math.PI / 2 - 0.08]} len={3.2} w={1.4} color="#fff1cf" opacity={0.22} />
    </group>
  </>
);

const Shot2: React.FC<{ tex: Record<string, THREE.Texture> }> = ({ tex }) => (
  <>
    <color attach="background" args={['#0b0d24']} />
    <fog attach="fog" args={['#0e1030', 8, 40]} />
    <CamRig pos={[-0.66, 1.8, 0.3]} target={[4, 0.85, -0.25]} fov={54} roll={0.04} />
    <hemisphereLight args={['#3c4890', '#0e0d16', 0.45]} />
    <Moon p={[12, 9, -4]} color="#9fb0ff" intensity={0.8} />
    <Card tex={tex.sky} p={[70, 16, 0]} w={140} h={70} ry={-Math.PI / 2} />
    <Card tex={tex.sky2} p={[36, 4.5, 0]} w={60} h={15} ry={-Math.PI / 2} />
    <Card tex={tex.trees} p={[14, 3, 5.5]} w={30} h={7.5} ry={-Math.PI / 2 - 0.5} />
    <Card tex={tex.trees2} p={[14, 3, -5.5]} w={30} h={7.5} ry={-Math.PI / 2 + 0.5} />
    <Ground tex={tex.asphalt2} w={80} d={5} rep={[10, 1]} />
    <Ground tex={tex.dirt} w={80} d={20} rep={[20, 5]} p={[0, -0.01, 0]} color="#6b6a74" />
    {Array.from({ length: 9 }, (_, i) => (
      <group key={i}>
        <T g={rbox(4.2, 1.5, 0.2, 0.03)} p={[2 + i * 4.4, 0.75, 2.9]} color="#59607a" outline={0.012} />
        <T g={rbox(4.2, 1.2, 0.2, 0.03)} p={[4 + i * 4.4, 0.6, -2.9]} color="#4c536b" outline={0.012} />
      </group>
    ))}
    <StreetLamp p={[16, 0, -3.3]} ry={0} />
    <pointLight position={[16, 6, -2]} color="#ffcf8f" intensity={30} distance={14} />
    <group>
      <Ride plate={tex.plate} face={tex.face} passenger={false} />
      <Spot p={[0.7, 1.1, 0]} to={[8, 0, 0]} color="#fff1cf" intensity={90} angle={0.45} />
      <Beam p={[2.6, 0.9, 0]} r={[0, 0, -Math.PI / 2 - 0.05]} len={4} w={1.8} color="#fff1cf" opacity={0.16} />
    </group>
    <PovHand screen={tex.screen} />
    <pointLight position={[-0.45, 1.55, 0.25]} color="#a98bff" intensity={0.12} distance={0.5} />
  </>
);

const Shot3: React.FC<{ tex: Record<string, THREE.Texture> }> = ({ tex }) => (
  <>
    <color attach="background" args={['#1a0808']} />
    <fog attach="fog" args={['#260c0e', 6, 34]} />
    <CamRig pos={[-3.6, 1.95, 1.0]} target={[-0.15, 1.42, 0.02]} fov={31} roll={0.05} />
    <hemisphereLight args={['#7a2a33', '#120607', 0.3]} />
    <Moon p={[8, 9, 5]} color="#6f7fd0" intensity={0.35} />
    <Card tex={tex.skyRed} p={[60, 14, 0]} w={140} h={70} ry={-Math.PI / 2} />
    <Card tex={tex.trees3} p={[26, 3.5, 0]} w={46} h={11} ry={-Math.PI / 2} />
    <Ground tex={tex.dirt} w={80} d={30} rep={[20, 7]} color="#6a4a44" />
    {/* rails beside the path */}
    <T g={rbox(80, 0.22, 2.8, 0.04)} p={[10, 0.11, -2.6]} color="#3c2f2c" outline={0} />
    {Array.from({ length: 48 }, (_, i) => <T key={i} g={rbox(0.28, 0.08, 2.4, 0.02)} p={[-14 + i * 1.6, 0.26, -2.6]} color="#4f3a2a" outline={0.006} />)}
    {[-3.3, -1.9].map((z) => <T key={z} g={rbox(80, 0.1, 0.08, 0.02)} p={[10, 0.35, z]} color="#7a5040" outline={0.006} />)}
    <group position={[9, 0, -4.4]} rotation={[0.06, 0, 0]}>
      <T g={cyl(0.07, 0.07, 4.4)} p={[0, 2.2, 0]} color="#2a2a30" />
      <T g={rbox(0.5, 0.9, 0.34, 0.06)} p={[0, 4.6, 0]} color="#121216" />
      <mesh position={[-0.18, 4.8, 0]} rotation={[0, -Math.PI / 2, 0]}><circleGeometry args={[0.12, 24]} /><meshBasicMaterial color="#ff3030" toneMapped={false} /></mesh>
      <Glow p={[-0.4, 4.8, 0]} color="#ff2020" size={3.2} opacity={0.9} />
      <pointLight position={[-0.6, 4.6, 0]} color="#ff2a2a" intensity={40} distance={20} decay={1.1} />
    </group>
    {[0, 1, 2, 3, 4].map((i) => <Card key={i} tex={tex.fog} p={[2 + i * 4, 0.6, (i % 2 ? -1 : 1) * 1.2]} w={14} h={2.2} ry={-Math.PI / 2} opacity={0.55} />)}
    <group>
      <Ride plate={tex.plate} face={tex.faceScared} screen={tex.screen} headTurn={Math.PI} headDown={0.5} />
    </group>
    <Spot p={[-5.5, 1.15, 0.3]} to={[0, 1.1, 0]} color="#fff4e6" intensity={60} angle={0.36} />
    <Beam p={[-3.8, 1.0, 0.25]} r={[0, 0, -Math.PI / 2]} len={3.6} w={1.5} color="#fff4e6" opacity={0.12} />
  </>
);

export const Look2: React.FC<{ shot: number }> = ({ shot }) => {
  const { width, height } = useVideoConfig();
  const fonts = useFonts();
  const tex = useMemo(() => {
    if (!fonts) return null;
    const fog = canvasTex(512, 128, (g) => { const gr = g.createRadialGradient(256, 64, 0, 256, 64, 256); gr.addColorStop(0, 'rgba(150,60,60,.55)'); gr.addColorStop(1, 'rgba(150,60,60,0)'); g.save(); g.scale(1, 0.25); g.fillStyle = gr; g.fillRect(0, 0, 512, 512); g.restore(); });
    const paving = canvasTex(512, 256, (g) => { g.fillStyle = '#5a5f70'; g.fillRect(0, 0, 512, 256); g.strokeStyle = '#3d4150'; g.lineWidth = 4; for (let x = 0; x < 512; x += 64) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 256); g.stroke(); } for (let y = 0; y < 256; y += 64) { g.beginPath(); g.moveTo(0, y); g.lineTo(512, y); g.stroke(); } });
    paving.wrapS = paving.wrapT = THREE.RepeatWrapping;
    const dirt = canvasTex(512, 512, (g) => { const r = rng(11); g.fillStyle = '#3a3532'; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 4000; i++) { const v = 40 + r() * 40; g.fillStyle = `rgb(${v + 6},${v},${v - 4})`; g.fillRect(r() * 512, r() * 512, 3, 3); } });
    dirt.wrapS = dirt.wrapT = THREE.RepeatWrapping;
    return {
      sky: skyTex('#0a0c2a', '#2a2160', '#5a3a7a'), sky1: skylineTex(4, '#0e1024', '#ffcf7a', 0.28), sky2: skylineTex(9, '#1b1a3e', '#d9b070', 0.12, false),
      trees: treesTex(5, '#0b0e1c'), trees2: treesTex(8, '#0d1020'), trees3: treesTex(12, '#120607'),
      skyRed: skyTex('#120406', '#4a1014', '#7a2020', false, 7), fog,
      asphalt: asphaltTex(1, true), asphalt2: asphaltTex(2, false), paving, dirt,
      plate: plateTex(), face: faceTex('worried'), faceScared: faceTex('scared'),
      screen: chatScreen([{ text: 'Kak, saya udah di titik jemput. Kakaknya di mana?', time: '00.14' }]),
    } as Record<string, THREE.Texture>;
  }, [fonts]);
  if (!tex) return null;
  const S = shot === 1 ? Shot1 : shot === 2 ? Shot2 : Shot3;
  return (
    <AbsoluteFill style={{ background: '#0b0d24' }}>
      <ThreeCanvas width={width} height={height} shadows linear={false} onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.15; gl.shadowMap.type = THREE.PCFSoftShadowMap; }}>
        <S tex={tex} />
      </ThreeCanvas>
      {shot === 1 && <><Grade vignette={0.55} glow="radial-gradient(ellipse 60% 30% at 40% 52%, rgba(255,140,60,.10), rgba(0,0,0,0) 70%)" /><Caption words={words('Bayangin kamu lagi dibonceng ojol tengah malem...')} active={4} keyword={4} /></>}
      {shot === 2 && <><Grade vignette={0.65} /><Caption words={words('Kak, saya udah di titik jemput.', 'JUNED')} active={5} keyword={4} top={250} /></>}
      {shot === 3 && <><Grade vignette={0.72} tint="rgba(255,60,60,.12)" /><Caption words={words('Dan helm drivernya... ngadep ke belakang.')} active={5} keyword={5} /></>}
    </AbsoluteFill>
  );
};
