// Episode sets. Road runs along X; the scooter always heads +X (profile space = world offsets).
import React from 'react';
import * as THREE from 'three';
import { Glow, T, rbox, cyl } from '../look2/toon';
import { Card, Ground, StreetLamp, Toko24 } from '../look2/sets2';

export type Tex = Record<string, THREE.Texture>;

export const SkyDome: React.FC<{ tex: THREE.Texture }> = ({ tex }) => (
  <mesh rotation={[0, -Math.PI / 2, 0]}>
    <sphereGeometry args={[150, 48, 24]} />
    <meshBasicMaterial map={tex} side={THREE.BackSide} fog={false} toneMapped={false} />
  </mesh>
);

/** Skyline cards around the road so every camera direction has a painted horizon. */
const Horizon: React.FC<{ a: THREE.Texture; b: THREE.Texture; trees?: THREE.Texture; trees2?: THREE.Texture; y?: number }> = ({ a, b, trees, trees2, y = 0 }) => (
  <group position={[0, y, 0]}>
    {[-40, 10, 60].map((x) => (
      <group key={x}>
        <Card tex={b} p={[x, 4.5, -30]} w={52} h={13} />
        <Card tex={b} p={[x, 4.5, 30]} w={52} h={13} ry={Math.PI} />
        <Card tex={a} p={[x + 12, 3.5, -16]} w={36} h={9} />
        <Card tex={a} p={[x - 8, 3.5, 16]} w={36} h={9} ry={Math.PI} />
        {trees && <Card tex={trees} p={[x, 3, -7.5]} w={30} h={7.5} />}
        {trees2 && <Card tex={trees2} p={[x + 15, 3, 7.5]} w={30} h={7.5} ry={Math.PI} />}
      </group>
    ))}
    <Card tex={b} p={[95, 4.5, 0]} w={70} h={15} ry={-Math.PI / 2} />
    <Card tex={b} p={[-75, 4.5, 0]} w={70} h={15} ry={Math.PI / 2} />
  </group>
);

export const JalanSet: React.FC<{ tex: Tex; lamps?: boolean }> = ({ tex, lamps = true }) => (
  <group>
    <color attach="background" args={['#0b0d24']} />
    <fog attach="fog" args={['#0e1030', 10, 55]} />
    <hemisphereLight args={['#3c4890', '#0e0d16', 0.5]} />
    <directionalLight position={[30, 14, -10]} color="#9fb0ff" intensity={0.8} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024}
      shadow-camera-left={-40} shadow-camera-right={40} shadow-camera-top={20} shadow-camera-bottom={-20} shadow-bias={-0.0006} shadow-normalBias={0.04} />
    <SkyDome tex={tex.sky} />
    <Horizon a={tex.sky1} b={tex.sky2} trees={tex.trees} trees2={tex.trees2} />
    <Ground tex={tex.asphalt2} w={240} d={5} rep={[30, 1]} p={[40, 0, 0]} />
    <Ground tex={tex.dirt} w={240} d={40} rep={[60, 10]} p={[40, -0.01, 0]} color="#6b6a74" />
    {Array.from({ length: 30 }, (_, i) => (
      <group key={i}>
        <T g={rbox(4.2, 1.5, 0.2, 0.03)} p={[-40 + i * 4.4, 0.75, 2.9]} color={i % 3 ? '#59607a' : '#646b86'} outline={0.012} />
        <T g={rbox(4.2, 1.2, 0.2, 0.03)} p={[-38 + i * 4.4, 0.6, -2.9]} color={i % 4 ? '#4c536b' : '#5a5f78'} outline={0.012} />
      </group>
    ))}
    {lamps && [-30, 6, 42, 78].map((x) => (
      <group key={x}>
        <StreetLamp p={[x, 0, -3.3]} />
        <pointLight position={[x, 6, -2]} color="#ffcf8f" intensity={26} distance={14} />
      </group>
    ))}
  </group>
);

export const TokoSet: React.FC<{ tex: Tex }> = ({ tex }) => (
  <group>
    <color attach="background" args={['#141634']} />
    <fog attach="fog" args={['#1a1c44', 18, 60]} />
    <hemisphereLight args={['#5866b8', '#1c1a26', 0.55]} />
    <directionalLight position={[-6, 10, 8]} color="#8ea0ff" intensity={0.7} shadow-mapSize-width={1024} shadow-mapSize-height={1024}
      shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={10} shadow-camera-bottom={-10} shadow-bias={-0.0006} shadow-normalBias={0.03} />
    <SkyDome tex={tex.sky} />
    <Horizon a={tex.sky1} b={tex.sky2} />
    <Ground tex={tex.asphalt} w={120} d={6} rep={[16, 1]} />
    <Ground tex={tex.dirt} w={120} d={40} rep={[30, 10]} p={[0, -0.01, 8]} color="#5a5a66" />
    <T g={rbox(120, 0.16, 0.3, 0.02)} p={[0, 0.08, -3.05]} color="#6b6f7c" outline={0} />
    <Ground tex={tex.paving} w={120} d={4} rep={[28, 1]} p={[0, 0.16, -5.2]} color="#9aa0b4" />
    <Toko24 p={[0.4, 0.16, -7.4]} />
    <Card tex={tex.sky1} p={[-9, 3.4, -9]} w={10} h={6} />
    <Card tex={tex.sky1} p={[10, 3.4, -9]} w={10} h={6} />
    <StreetLamp p={[-3.6, 0, -3.4]} />
    <spotLight position={[-3.6, 6.2, -2.1]} color="#ffcf8f" intensity={70} angle={0.6} penumbra={0.7} distance={30} decay={1.1} castShadow
      shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-bias={-0.0006} shadow-normalBias={0.03} />
    <pointLight position={[3, 1.6, 3.5]} color="#9fb4ff" intensity={3} distance={9} />
  </group>
);

const Signal: React.FC<{ x: number; z: number }> = ({ x, z }) => (
  <group position={[x, 0, z]} rotation={[0.06, 0, 0.04]}>
    <T g={cyl(0.07, 0.07, 4.4)} p={[0, 2.2, 0]} color="#2a2a30" />
    <T g={rbox(0.5, 0.9, 0.34, 0.06)} p={[0, 4.6, 0]} color="#121216" />
    {[-1, 1].map((s) => (
      <group key={s}>
        <mesh position={[0.26 * s, 4.8, 0]} rotation={[0, (s * Math.PI) / 2, 0]}><circleGeometry args={[0.12, 24]} /><meshBasicMaterial color="#ff3030" toneMapped={false} /></mesh>
        <Glow p={[0.45 * s, 4.8, 0]} color="#ff2020" size={3.2} opacity={0.9} />
      </group>
    ))}
    <pointLight position={[0, 4.6, 0.6]} color="#ff2a2a" intensity={40} distance={22} decay={1.1} />
  </group>
);

export const RelSet: React.FC<{ tex: Tex }> = ({ tex }) => (
  <group>
    <color attach="background" args={['#1a0808']} />
    <fog attach="fog" args={['#260c0e', 8, 40]} />
    <hemisphereLight args={['#7a2a33', '#120607', 0.32]} />
    <directionalLight position={[8, 9, 5]} color="#6f7fd0" intensity={0.35} />
    <SkyDome tex={tex.skyRed} />
    <Horizon a={tex.trees3} b={tex.trees3} />
    <Ground tex={tex.dirt} w={240} d={60} rep={[60, 15]} p={[40, 0, 0]} color="#6a4a44" />
    <T g={rbox(240, 0.22, 2.8, 0.04)} p={[40, 0.11, -2.6]} color="#3c2f2c" outline={0} />
    {Array.from({ length: 130 }, (_, i) => <T key={i} g={rbox(0.28, 0.08, 2.4, 0.02)} p={[-40 + i * 1.6, 0.26, -2.6]} color="#4f3a2a" outline={0.006} shadow={false} />)}
    {[-3.3, -1.9].map((z) => <T key={z} g={rbox(240, 0.1, 0.08, 0.02)} p={[40, 0.35, z]} color="#7a5040" outline={0.006} />)}
    {[-14, 12, 44, 80].map((x) => <Signal key={x} x={x} z={-4.4} />)}
    {Array.from({ length: 14 }, (_, i) => <Card key={i} tex={tex.fog} p={[-30 + i * 9, 0.6, (i % 2 ? -1 : 1) * 2.2]} w={14} h={2.2} opacity={0.5} />)}
    {Array.from({ length: 14 }, (_, i) => <Card key={'b' + i} tex={tex.fog} p={[-26 + i * 9, 0.7, (i % 2 ? 1 : -1) * 4]} w={14} h={2.4} ry={Math.PI} opacity={0.45} />)}
  </group>
);
