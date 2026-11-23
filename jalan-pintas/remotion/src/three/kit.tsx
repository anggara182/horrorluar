// Shared building blocks: palette, limbs between two points, glow sprites, canvas textures.
import React, { useMemo } from 'react';
import * as THREE from 'three';

export const C = {
  navy: '#0B1030',
  night: '#141a3a',
  ungu: '#7B3FE4',
  unguMuda: '#C7A8FF',
  oranye: '#FF7A1A',
  merah: '#E0262B',
  kuning: '#FFD23F',
  kulit: '#8D5A3B',
  aspal: '#23252e',
  jaket: '#6a3bc4',
  celana: '#2b2e3b',
  seragam: '#ff8a2a',
  ransel: '#5b6070',
  motor: '#343a4f',
  jok: '#15161c',
  helmPenumpang: '#3d4256',
};

export type V3 = [number, number, number];

const UP = new THREE.Vector3(0, 1, 0);

/** Capsule from a to b (a rounded limb). */
export const Limb: React.FC<{ a: V3; b: V3; r?: number; color: string; cast?: boolean }> = ({ a, b, r = 0.055, color, cast = true }) => {
  const { pos, quat, len } = useMemo(() => {
    const va = new THREE.Vector3(...a), vb = new THREE.Vector3(...b);
    const dir = vb.clone().sub(va); const len = dir.length();
    const quat = new THREE.Quaternion().setFromUnitVectors(UP, dir.normalize());
    return { pos: va.add(vb).multiplyScalar(0.5), quat, len };
  }, [a.join(), b.join()]);
  return (
    <mesh position={pos} quaternion={quat} castShadow={cast} receiveShadow>
      <capsuleGeometry args={[r, Math.max(0.001, len), 6, 12]} />
      <meshStandardMaterial color={color} roughness={0.75} />
    </mesh>
  );
};

export const Box: React.FC<{ p: V3; s: V3; color: string; r?: V3; emissive?: string; ei?: number; rough?: number; metal?: number; cast?: boolean }> =
  ({ p, s, color, r = [0, 0, 0], emissive, ei = 1, rough = 0.7, metal = 0, cast = true }) => (
    <mesh position={p} rotation={r} castShadow={cast} receiveShadow>
      <boxGeometry args={s} />
      <meshStandardMaterial color={color} roughness={rough} metalness={metal} emissive={emissive ?? '#000'} emissiveIntensity={emissive ? ei : 0} />
    </mesh>
  );

let glowTex: THREE.Texture | null = null;
const getGlowTex = () => {
  if (glowTex) return glowTex;
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d')!; const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.25, 'rgba(255,255,255,0.45)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  glowTex = new THREE.CanvasTexture(c); return glowTex;
};

/** Additive halo: fake bloom around lights. */
export const Glow: React.FC<{ p: V3; color: string; size?: number; opacity?: number }> = ({ p, color, size = 1, opacity = 0.8 }) => (
  <sprite position={p} scale={[size, size, 1]}>
    <spriteMaterial map={getGlowTex()} color={color} transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false} />
  </sprite>
);

/** Text drawn on a canvas, used as a texture (signs, plates). */
export const useTextTexture = (draw: (g: CanvasRenderingContext2D, w: number, h: number) => void, w: number, h: number, key: string) =>
  useMemo(() => {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    draw(c.getContext('2d')!, w, h);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
  }, [key]);

/** Low transparent card that reads as ground fog. */
export const FogCard: React.FC<{ p: V3; s: [number, number]; color: string; opacity?: number; ry?: number }> = ({ p, s, color, opacity = 0.12, ry = 0 }) => (
  <mesh position={p} rotation={[0, ry, 0]}>
    <planeGeometry args={s} />
    <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
  </mesh>
);
