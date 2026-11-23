// Cel shading + ink outlines: the "2D look" on 3D shapes.
import React, { useMemo } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export type V3 = [number, number, number];

let ramp: THREE.DataTexture | null = null;
/** 4-step light ramp: deep shadow, shadow, lit, highlight. */
export const toonRamp = () => {
  if (ramp) return ramp;
  const d = new Uint8Array([70, 70, 70, 255, 140, 140, 140, 255, 215, 215, 215, 255, 255, 255, 255, 255]);
  ramp = new THREE.DataTexture(d, 4, 1, THREE.RGBAFormat);
  ramp.minFilter = ramp.magFilter = THREE.NearestFilter; ramp.generateMipmaps = false; ramp.needsUpdate = true;
  return ramp;
};

const INK = '#120d1d';
const outlineMats = new Map<string, THREE.ShaderMaterial>();
export const outlineMat = (t = 0.012, color = INK) => {
  const k = `${t}-${color}`;
  if (!outlineMats.has(k)) {
    outlineMats.set(k, new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: { t: { value: t }, c: { value: new THREE.Color(color) } },
      vertexShader: 'uniform float t; void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vec3 n = normalize(normalMatrix*normal); mv.xyz += n * t; gl_Position = projectionMatrix * mv; }',
      fragmentShader: 'uniform vec3 c; void main(){ gl_FragColor = vec4(c,1.0); }',
    }));
  }
  return outlineMats.get(k)!;
};

/** A cel-shaded mesh with an ink outline. Pass a geometry; outline=0 to skip the ink. */
export const T: React.FC<{ g: THREE.BufferGeometry; color: string; p?: V3; r?: V3; s?: V3 | number; outline?: number; emissive?: string; ei?: number; shadow?: boolean }> =
  ({ g, color, p = [0, 0, 0], r = [0, 0, 0], s = 1, outline = 0.012, emissive, ei = 1, shadow = true }) => (
    <group position={p} rotation={r} scale={s as any}>
      <mesh geometry={g} castShadow={shadow}>
        <meshToonMaterial color={color} gradientMap={toonRamp()} emissive={emissive ?? '#000'} emissiveIntensity={emissive ? ei : 0} />
      </mesh>
      {outline > 0 && <mesh geometry={g} material={outlineMat(outline)} />}
    </group>
  );

// ---- geometry factories (memoised by key) ----
const cache = new Map<string, THREE.BufferGeometry>();
const memo = (k: string, f: () => THREE.BufferGeometry) => { if (!cache.has(k)) cache.set(k, f()); return cache.get(k)!; };

export const rbox = (w: number, h: number, d: number, r = 0.02) => memo(`rb${w},${h},${d},${r}`, () => new RoundedBoxGeometry(w, h, d, 3, r));
export const sphere = (r: number) => memo(`sp${r}`, () => new THREE.SphereGeometry(r, 40, 28));
export const capsule = (r: number, len: number) => memo(`cp${r},${len}`, () => new THREE.CapsuleGeometry(r, len, 8, 20));
export const cyl = (r1: number, r2: number, h: number) => memo(`cy${r1},${r2},${h}`, () => new THREE.CylinderGeometry(r1, r2, h, 28));
export const torus = (R: number, r: number) => memo(`to${R},${r}`, () => new THREE.TorusGeometry(R, r, 16, 40));

/** Extrude a side profile (x = forward, y = up) to a given width, centred on z. */
export const profile = (key: string, pts: [number, number][], width: number, bevel = 0.03) => memo(`pf${key}`, () => {
  const s = new THREE.Shape();
  s.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i += 2) {
    const c = pts[i], e = pts[i + 1] ?? pts[0];
    s.quadraticCurveTo(c[0], c[1], e[0], e[1]);
  }
  const g = new THREE.ExtrudeGeometry(s, { depth: width - bevel * 2, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 5, curveSegments: 16 });
  g.translate(0, 0, -(width - bevel * 2) / 2); g.computeVertexNormals();
  return g;
});

const UP = new THREE.Vector3(0, 1, 0);
/** Cel-shaded capsule between two points. */
export const Limb: React.FC<{ a: V3; b: V3; r: number; color: string; outline?: number }> = ({ a, b, r, color, outline = 0.01 }) => {
  const { pos, quat, len } = useMemo(() => {
    const va = new THREE.Vector3(...a), vb = new THREE.Vector3(...b); const dir = vb.clone().sub(va); const len = dir.length();
    return { pos: va.add(vb).multiplyScalar(0.5), quat: new THREE.Quaternion().setFromUnitVectors(UP, dir.normalize()), len };
  }, [a.join(), b.join()]);
  const e = new THREE.Euler().setFromQuaternion(quat);
  return <T g={capsule(r, Math.round(len * 1000) / 1000)} color={color} p={[pos.x, pos.y, pos.z]} r={[e.x, e.y, e.z]} outline={outline} />;
};

// ---- glow (fake bloom) ----
let glowTex: THREE.Texture | null = null;
const getGlow = () => {
  if (glowTex) return glowTex;
  const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d')!;
  const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.12, 'rgba(255,255,255,.7)'); gr.addColorStop(0.4, 'rgba(255,255,255,.18)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 256, 256); glowTex = new THREE.CanvasTexture(c); return glowTex;
};
export const Glow: React.FC<{ p: V3; color: string; size?: number; opacity?: number }> = ({ p, color, size = 1, opacity = 0.8 }) => (
  <sprite position={p} scale={[size, size, 1]} renderOrder={10}>
    <spriteMaterial map={getGlow()} color={color} transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false} fog={false} />
  </sprite>
);

/** Soft dark blob under objects (2D contact shadow). */
let blobTex: THREE.Texture | null = null;
export const Blob: React.FC<{ p: V3; s: [number, number]; opacity?: number }> = ({ p, s, opacity = 0.6 }) => {
  if (!blobTex) {
    const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d')!;
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128); blobTex = new THREE.CanvasTexture(c);
  }
  return (
    <mesh position={p} rotation={[-Math.PI / 2, 0, 0]} renderOrder={1}>
      <planeGeometry args={s} /><meshBasicMaterial map={blobTex} transparent opacity={opacity} depthWrite={false} />
    </mesh>
  );
};

/** Canvas → texture helper. */
export const canvasTex = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) => {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d')!);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 1; t.generateMipmaps = false; t.minFilter = THREE.LinearFilter; return t;
};

/** Additive light beam (visible headlight cone in haze). */
let beamTex: THREE.Texture | null = null;
export const Beam: React.FC<{ p: V3; r: V3; len: number; w: number; color: string; opacity?: number }> = ({ p, r, len, w, color, opacity = 0.25 }) => {
  if (!beamTex) beamTex = canvasTex(128, 256, (g) => {
    const lg = g.createLinearGradient(0, 256, 0, 0); lg.addColorStop(0, 'rgba(255,255,255,1)'); lg.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = lg; g.beginPath(); g.moveTo(54, 256); g.lineTo(74, 256); g.lineTo(128, 0); g.lineTo(0, 0); g.closePath(); g.fill();
  });
  return (
    <group position={p} rotation={r}>
      {[0, Math.PI / 2].map((k) => (
        <mesh key={k} rotation={[0, k, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[w, len]} />
          <meshBasicMaterial map={beamTex!} color={color} transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} fog={false} />
        </mesh>
      ))}
    </group>
  );
};
