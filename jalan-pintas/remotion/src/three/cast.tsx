// Scooter, Si Pengendara (driver), Kamu (passenger). Scooter space: forward = +Z, ground y = 0.
import React from 'react';
import * as THREE from 'three';
import { Box, C, Glow, Limb, useTextTexture, V3 } from './kit';

const Wheel: React.FC<{ z: number }> = ({ z }) => (
  <group position={[0, 0.22, z]} rotation={[0, 0, Math.PI / 2]}>
    <mesh castShadow><cylinderGeometry args={[0.22, 0.22, 0.11, 24]} /><meshStandardMaterial color="#111216" roughness={0.9} /></mesh>
    <mesh><cylinderGeometry args={[0.11, 0.11, 0.12, 16]} /><meshStandardMaterial color="#8a8f9e" roughness={0.4} metalness={0.5} /></mesh>
  </group>
);

export const Plate: React.FC<{ p: V3; r?: V3; scale?: number }> = ({ p, r = [0, Math.PI, 0], scale = 1 }) => {
  const tex = useTextTexture((g, w, h) => {
    g.fillStyle = '#0d0d10'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#e8e8e8'; g.lineWidth = 8; g.strokeRect(8, 8, w - 16, h - 16);
    g.fillStyle = '#f2f2f2'; g.font = 'bold 92px Inter, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('B 4217 KZ', w / 2, h / 2 + 4);
  }, 512, 160, 'plate');
  return (
    <mesh position={p} rotation={r} scale={scale}>
      <planeGeometry args={[0.3, 0.094]} />
      <meshStandardMaterial map={tex} roughness={0.5} emissive="#ffffff" emissiveMap={tex} emissiveIntensity={0.15} />
    </mesh>
  );
};

export const Scooter: React.FC<{ headlight?: boolean }> = ({ headlight = true }) => (
  <group>
    <Wheel z={0.62} /><Wheel z={-0.62} />
    <Box p={[0, 0.3, 0.08]} s={[0.34, 0.08, 0.6]} color={C.motor} />
    <Box p={[0, 0.5, -0.4]} s={[0.4, 0.34, 0.72]} color={C.motor} rough={0.45} />
    <Box p={[0, 0.72, -0.32]} s={[0.34, 0.09, 0.78]} color={C.jok} rough={0.9} />
    <Box p={[0, 0.62, 0.42]} s={[0.42, 0.62, 0.12]} r={[-0.25, 0, 0]} color={C.motor} rough={0.45} />
    <Limb a={[0, 0.7, 0.5]} b={[0, 1.04, 0.56]} r={0.035} color="#22252f" />
    <Limb a={[-0.32, 1.06, 0.52]} b={[0.32, 1.06, 0.52]} r={0.022} color="#1a1c22" />
    <Box p={[0, 1.0, 0.6]} s={[0.3, 0.14, 0.12]} color={C.motor} rough={0.45} />
    {/* mirrors */}
    <Limb a={[-0.26, 1.06, 0.52]} b={[-0.3, 1.24, 0.5]} r={0.01} color="#1a1c22" />
    <Box p={[-0.31, 1.27, 0.5]} s={[0.1, 0.07, 0.02]} color="#9fb3d9" metal={0.9} rough={0.1} />
    <Limb a={[0.26, 1.06, 0.52]} b={[0.3, 1.24, 0.5]} r={0.01} color="#1a1c22" />
    <Box p={[0.31, 1.27, 0.5]} s={[0.1, 0.07, 0.02]} color="#9fb3d9" metal={0.9} rough={0.1} />
    {/* lights */}
    <Box p={[0, 1.0, 0.67]} s={[0.16, 0.08, 0.02]} color="#fff" emissive="#fff6dd" ei={4} cast={false} />
    <Box p={[0, 0.66, -0.77]} s={[0.24, 0.06, 0.03]} color={C.merah} emissive={C.merah} ei={3} cast={false} />
    <Glow p={[0, 0.66, -0.82]} color={C.merah} size={0.5} opacity={0.6} />
    <Plate p={[0, 0.48, -0.775]} />
    {headlight && <Glow p={[0, 1.0, 0.72]} color="#fff3d0" size={0.7} opacity={0.9} />}
  </group>
);

/** Helmet with a closed dark visor and a tiny purple pin glint. Faces +Z. */
const ClosedHelmet: React.FC = () => (
  <group>
    <mesh castShadow scale={[1, 1.04, 1.12]}><sphereGeometry args={[0.165, 32, 24]} /><meshStandardMaterial color={C.ungu} roughness={0.35} /></mesh>
    <mesh scale={[1, 1.04, 1.12]}>
      <sphereGeometry args={[0.168, 32, 24, Math.PI / 2 - 0.95, 1.9, 0.95, 0.85]} />
      <meshStandardMaterial color="#07070b" roughness={0.08} metalness={0.6} side={THREE.DoubleSide} />
    </mesh>
    <mesh position={[0.045, 0.02, 0.183]}><sphereGeometry args={[0.009, 12, 8]} /><meshBasicMaterial color="#d9c2ff" /></mesh>
    <Glow p={[0.045, 0.02, 0.19]} color={C.ungu} size={0.16} opacity={1} />
  </group>
);

/** Si Pengendara, seated on the scooter. headTurn = radians around Y (Math.PI = facing backwards). */
export const Pengendara: React.FC<{ headTurn?: number }> = ({ headTurn = 0 }) => {
  const J = C.jaket, P = C.celana;
  return (
    <group>
      <Box p={[0, 0.84, -0.06]} s={[0.32, 0.16, 0.26]} color={P} />
      <mesh position={[0, 1.13, 0.0]} rotation={[0.18, 0, 0]} castShadow>
        <capsuleGeometry args={[0.17, 0.32, 6, 16]} /><meshStandardMaterial color={J} roughness={0.8} />
      </mesh>
      {/* badge */}
      <Box p={[0.08, 1.2, 0.16]} s={[0.08, 0.03, 0.01]} r={[0.18, 0, 0]} color="#f1ecff" cast={false} />
      <Limb a={[0, 1.36, 0.06]} b={[0, 1.42, 0.08]} r={0.05} color={C.kulit} />
      <group position={[0, 1.52, 0.09]} rotation={[0, headTurn, 0]}><ClosedHelmet /></group>
      {[-1, 1].map((s) => (
        <group key={s}>
          <Limb a={[0.2 * s, 1.3, 0.06]} b={[0.27 * s, 1.14, 0.29]} r={0.055} color={J} />
          <Limb a={[0.27 * s, 1.14, 0.29]} b={[0.3 * s, 1.07, 0.5]} r={0.048} color={J} />
          <mesh position={[0.3 * s, 1.065, 0.52]}><sphereGeometry args={[0.045, 12, 10]} /><meshStandardMaterial color="#1b1b22" /></mesh>
          <Limb a={[0.1 * s, 0.83, -0.02]} b={[0.15 * s, 0.86, 0.34]} r={0.07} color={P} />
          <Limb a={[0.15 * s, 0.86, 0.34]} b={[0.14 * s, 0.38, 0.3]} r={0.06} color={P} />
          <Box p={[0.14 * s, 0.35, 0.36]} s={[0.1, 0.07, 0.2]} color="#121218" />
        </group>
      ))}
    </group>
  );
};

/** Worried face on the +Z side of a head of radius ~0.13. */
const WorriedFace: React.FC = () => (
  <group>
    {[-1, 1].map((s) => (
      <group key={s}>
        <mesh position={[0.045 * s, 0.015, 0.122]}><sphereGeometry args={[0.016, 12, 10]} /><meshBasicMaterial color="#111" /></mesh>
        <mesh position={[0.046 * s, 0.055, 0.118]} rotation={[0, 0, 0.35 * s]}><boxGeometry args={[0.04, 0.009, 0.01]} /><meshBasicMaterial color="#2a1a12" /></mesh>
      </group>
    ))}
    <mesh position={[0, -0.05, 0.12]} scale={[1, 0.55, 1]}><sphereGeometry args={[0.018, 12, 8]} /><meshBasicMaterial color="#3a1712" /></mesh>
  </group>
);

/** Phone screen texture renderer is passed in so the same phone works in every shot. */
export const Phone: React.FC<{ screen?: THREE.Texture; p: V3; r?: V3; s?: number }> = ({ screen, p, r = [0, 0, 0], s = 1 }) => (
  <group position={p} rotation={r} scale={s}>
    <mesh castShadow><boxGeometry args={[0.075, 0.155, 0.009]} /><meshStandardMaterial color="#121318" roughness={0.3} metalness={0.4} /></mesh>
    <mesh position={[0, 0, 0.0047]}>
      <planeGeometry args={[0.068, 0.146]} />
      {screen ? <meshBasicMaterial map={screen} toneMapped={false} /> : <meshBasicMaterial color={C.ungu} />}
    </mesh>
  </group>
);

/** Kamu, seated behind the driver. Left hand on the driver's waist, right hand holds the phone. */
export const Penumpang: React.FC<{ screen?: THREE.Texture; headTurn?: number; headTilt?: number }> = ({ screen, headTurn = 0, headTilt = 0.25 }) => {
  const S = C.seragam, P = C.celana, K = C.kulit;
  return (
    <group position={[0, 0, -0.5]}>
      <Box p={[0, 0.86, 0]} s={[0.3, 0.15, 0.25]} color={P} />
      <mesh position={[0, 1.13, 0.0]} rotation={[0.08, 0, 0]} castShadow>
        <capsuleGeometry args={[0.16, 0.3, 6, 16]} /><meshStandardMaterial color={S} roughness={0.8} />
      </mesh>
      <Box p={[0, 1.13, -0.19]} s={[0.26, 0.32, 0.12]} color={C.ransel} rough={0.85} />
      <Limb a={[-0.13, 1.33, -0.1]} b={[-0.14, 0.98, -0.14]} r={0.018} color="#3b3f4c" />
      <Limb a={[0.13, 1.33, -0.1]} b={[0.14, 0.98, -0.14]} r={0.018} color="#3b3f4c" />
      <Limb a={[0, 1.34, 0.02]} b={[0, 1.4, 0.03]} r={0.048} color={K} />
      <group position={[0, 1.5, 0.04]} rotation={[headTilt, headTurn, 0]}>
        <mesh castShadow><sphereGeometry args={[0.13, 32, 24]} /><meshStandardMaterial color={K} roughness={0.7} /></mesh>
        <WorriedFace />
        <mesh scale={[1.08, 1.05, 1.12]} position={[0, 0.02, -0.01]}>
          <sphereGeometry args={[0.135, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.42]} />
          <meshStandardMaterial color={C.helmPenumpang} roughness={0.45} side={THREE.DoubleSide} />
        </mesh>
      </group>
      {/* left arm to the driver's waist */}
      <Limb a={[-0.19, 1.29, 0.02]} b={[-0.23, 1.06, 0.2]} r={0.05} color={S} />
      <Limb a={[-0.23, 1.06, 0.2]} b={[-0.17, 1.02, 0.4]} r={0.045} color={K} />
      {/* right arm holding the phone */}
      <Limb a={[0.19, 1.29, 0.02]} b={[0.2, 1.08, 0.12]} r={0.05} color={S} />
      <Limb a={[0.2, 1.08, 0.12]} b={[0.07, 1.18, 0.25]} r={0.045} color={K} />
      <Phone screen={screen} p={[0.06, 1.24, 0.27]} r={[-0.9, 0.15, 0]} s={0.9} />
      {[-1, 1].map((s) => (
        <group key={s}>
          <Limb a={[0.1 * s, 0.85, 0.02]} b={[0.17 * s, 0.86, 0.34]} r={0.068} color={P} />
          <Limb a={[0.17 * s, 0.86, 0.34]} b={[0.21 * s, 0.42, 0.28]} r={0.058} color={P} />
          <Box p={[0.21 * s, 0.39, 0.33]} s={[0.1, 0.07, 0.19]} color="#121218" />
        </group>
      ))}
    </group>
  );
};

/** Rider pair on the scooter. */
export const Ride: React.FC<{ headTurn?: number; screen?: THREE.Texture; showPassenger?: boolean; passengerHeadTurn?: number; passengerHeadTilt?: number }> =
  ({ headTurn = 0, screen, showPassenger = true, passengerHeadTurn = 0, passengerHeadTilt = 0.25 }) => (
    <group>
      <Scooter />
      <Pengendara headTurn={headTurn} />
      {showPassenger && <Penumpang screen={screen} headTurn={passengerHeadTurn} headTilt={passengerHeadTilt} />}
    </group>
  );
