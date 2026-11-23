// Sets: TOKO 24 front, dark kampung road, the dead railway. Road runs along Z.
import React from 'react';
import { Box, C, FogCard, Glow, Limb, useTextTexture } from './kit';

export const Asphalt: React.FC<{ len?: number; color?: string; dashes?: boolean }> = ({ len = 120, color = C.aspal, dashes = true }) => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[60, len]} /><meshStandardMaterial color="#15171e" roughness={0.95} /></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]} receiveShadow><planeGeometry args={[5, len]} /><meshStandardMaterial color={color} roughness={0.9} /></mesh>
    {dashes && Array.from({ length: Math.floor(len / 4) }, (_, i) => (
      <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, -len / 2 + i * 4]}><planeGeometry args={[0.1, 1.6]} /><meshStandardMaterial color="#d8d8d0" roughness={0.6} /></mesh>
    ))}
  </group>
);

export const Tiang: React.FC<{ x: number; z: number; lamp?: boolean }> = ({ x, z, lamp }) => (
  <group position={[x, 0, z]}>
    <Limb a={[0, 0, 0]} b={[0, 6.5, 0]} r={0.09} color="#5b5f6b" />
    <Box p={[0, 6.1, 0]} s={[1.4, 0.08, 0.08]} color="#3a3d47" />
    {lamp && <>
      <Box p={[-0.6 * Math.sign(x), 5.6, 0]} s={[0.4, 0.08, 0.16]} color="#ddd" emissive="#f4f1e0" ei={3} />
      <Glow p={[-0.6 * Math.sign(x), 5.5, 0]} color="#f4f1e0" size={1.6} opacity={0.5} />
      <pointLight position={[-0.6 * Math.sign(x), 5.2, 0]} color="#e9eefc" intensity={6} distance={12} decay={1.4} />
    </>}
  </group>
);

export const Toko24: React.FC<{ z?: number; x?: number; ry?: number }> = ({ z = 0, x = 4.2, ry = -Math.PI / 2 }) => {
  const sign = useTextTexture((g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#ff9a3c'); gr.addColorStop(1, '#ff6a00');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = '#fff'; g.font = '900 150px Inter, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('TOKO 24', w / 2, h / 2 + 8);
  }, 1024, 200, 'toko24');
  const glass = useTextTexture((g, w, h) => {
    g.fillStyle = '#f3f6ff'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#c9d2ea';
    for (let i = 0; i < 4; i++) g.fillRect(40 + i * 245, 120, 180, 300);       // shelves
    g.fillStyle = '#ff9a3c'; for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) g.fillRect(52 + i * 245, 140 + j * 70, 150, 18);
    g.fillStyle = '#5a6380'; g.fillRect(0, 0, w, 14); g.fillRect(w / 2 - 6, 0, 12, h);
  }, 1024, 512, 'glass');
  return (
    <group position={[x, 0, z]} rotation={[0, ry, 0]}>
      <Box p={[0, 1.7, -1.6]} s={[7, 3.4, 3]} color="#2b2f3d" />
      <mesh position={[0, 1.2, -0.09]}><planeGeometry args={[5.2, 2.2]} /><meshBasicMaterial map={glass} toneMapped={false} /></mesh>
      <mesh position={[0, 2.85, 0.0]}><planeGeometry args={[4.6, 0.9]} /><meshBasicMaterial map={sign} toneMapped={false} /></mesh>
      <Glow p={[0, 2.85, 0.3]} color={C.oranye} size={6} opacity={0.35} />
      <Glow p={[0, 1.2, 0.4]} color="#dfe8ff" size={6} opacity={0.25} />
      <Box p={[0, 0.06, 1.2]} s={[7, 0.12, 2.4]} color="#3c4050" />
      <pointLight position={[0, 1.6, 1.4]} color="#eaf0ff" intensity={14} distance={10} decay={1.3} />
      <pointLight position={[0, 2.9, 1.0]} color={C.oranye} intensity={10} distance={9} decay={1.4} />
    </group>
  );
};

const PohonPisang: React.FC<{ p: [number, number, number]; s?: number }> = ({ p, s = 1 }) => (
  <group position={p} scale={s}>
    <Limb a={[0, 0, 0]} b={[0, 2.2, 0]} r={0.12} color="#3d4a33" />
    {[0, 1.3, 2.5, 3.7, 5].map((a, i) => (
      <mesh key={i} position={[Math.cos(a) * 0.7, 2.3 + (i % 2) * 0.2, Math.sin(a) * 0.7]} rotation={[0.5 * Math.sin(a), -a, -0.6]} castShadow>
        <planeGeometry args={[1.6, 0.42]} /><meshStandardMaterial color="#20331f" roughness={0.9} side={2} />
      </mesh>
    ))}
  </group>
);

export const JalanGelap: React.FC = () => (
  <group>
    <Asphalt dashes={false} color="#1e2029" />
    {Array.from({ length: 14 }, (_, i) => (
      <group key={i}>
        <Box p={[-3.4, 0.7, -30 + i * 4.4]} s={[0.25, 1.4, 4.2]} color="#3a3f52" />
        {i % 2 === 0 && <PohonPisang p={[3.6, 0, -30 + i * 4.4]} s={1 + (i % 3) * 0.15} />}
        {i % 3 === 1 && <PohonPisang p={[-4.4, 0, -29 + i * 4.4]} s={1.1} />}
      </group>
    ))}
  </group>
);

export const RelMati: React.FC = () => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[60, 120]} /><meshStandardMaterial color="#1a1514" roughness={1} /></mesh>
    <Box p={[2.6, 0.12, 0]} s={[3, 0.24, 120]} color="#3a302d" rough={1} />
    {Array.from({ length: 70 }, (_, i) => <Box key={i} p={[2.6, 0.27, -60 + i * 1.7]} s={[2.4, 0.08, 0.3]} color="#4a3a2c" rough={1} cast={false} />)}
    {[-0.72, 0.72].map((dx) => <Box key={dx} p={[2.6 + dx, 0.36, 0]} s={[0.08, 0.1, 120]} color="#6b4a3a" rough={0.5} metal={0.5} />)}
    {/* signal post, leaning */}
    <group position={[4.6, 0, -9]} rotation={[0, 0, -0.08]}>
      <Limb a={[0, 0, 0]} b={[0, 4.2, 0]} r={0.07} color="#2a2a30" />
      <Box p={[0, 4.4, 0]} s={[0.45, 0.8, 0.3]} color="#121216" />
      <mesh position={[0, 4.55, 0.16]}><sphereGeometry args={[0.1, 16, 12]} /><meshBasicMaterial color="#ff2d2d" /></mesh>
      <Glow p={[0, 4.55, 0.3]} color={C.merah} size={2.2} opacity={0.8} />
      <pointLight position={[0, 4.5, 0.6]} color={C.merah} intensity={18} distance={16} decay={1.3} />
    </group>
    {Array.from({ length: 8 }, (_, i) => (
      <FogCard key={i} p={[(i % 2 ? -1 : 1) * 1.5, 0.5 + (i % 3) * 0.2, -4 - i * 3]} s={[14, 1.6]} color="#7a2a2a" opacity={0.1} />
    ))}
  </group>
);
