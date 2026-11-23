// EP01 "Titik Ungu", 2.5D: flat painted sprites (src/look3) placed in 3D space, unlit, camera moves for parallax.
// 35 shots locked to the VO (ep01/shots.json + ep01/vo_timing.json). Video only; audio = tools/mix.py.
// The 3D cel-shaded version is kept in EP01_3d.tsx (not registered).
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AbsoluteFill, continueRender, delayRender, useCurrentFrame, useVideoConfig } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import shotsJson from '../../../ep01/shots.json';
import timing from '../../../ep01/vo_timing.json';
import { asphaltTex, skyTex, skylineTex, treesTex } from '../look2/sets2';
import { chatScreen2, infoScreen, mapScreen } from '../ui/screens2';
import { Caption, CapWord } from '../ui/Caption';
import { driverBackPov, handPhone, helmetBackPov, ridersBack, ridersSide } from '../look3/svg';
import { faceCU, followerFront, helmetCU, jacketCU, kamuStand, mirrorCU, plateCU, ridersFront, tapHand, treadStrip, wheel, wheelBlur } from '../look3/svg2';
import { FaceView, Mood, VIEW_CU, VIEW_PEEK, VIEW_SIDE, VIEW_STAND, drawFace, faceAt, headBobAt } from '../look3/face';
import { blobTex, coneTex, fogTex, glowTex, paint, poleTex, railTex, signalTex, svgTex, tokoTex, wallTex } from '../look3/paint';
import { Add, JalanAxis, JalanSide, RelAxis, RelSide, Sprite, Tex, TokoSide, V3 } from './sets25';

export const FPS = 24;
export const END = shotsJson.end;
export const DURATION = Math.ceil(END * FPS) + 1;

type Cam = { p: V3; t: V3; fov: number };
type Scene = 'jalanSide' | 'tokoSide' | 'relSide' | 'jalanAxis' | 'relAxis';
type Spec = {
  scene: Scene; a: Cam; b?: Cam; ease?: 'io' | 'out' | 'whip'; world?: boolean; track?: number;
  move?: number; x?: (lt: number, d: number) => number;
  rider?: 'side' | 'sideDriver' | 'back' | 'backT' | 'front' | 'frontLit' | 'none';
  cu?: [string, number, string?]; stand?: boolean; pov?: string; povZ?: [number, number]; tap?: boolean;
  swapAt?: number; hl?: (lt: number) => boolean; follower?: number; labels?: number; dark?: boolean;
  grade?: 'jalan' | 'toko' | 'rel' | 'photo' | 'twist'; shake?: number; cone?: boolean; capY?: number;
};
const C = (p: V3, t: V3, fov: number): Cam => ({ p, t, fov });
const POV: Cam = C([0.1, 1.75, 0.3], [0.05, 1.0, -6], 58);
const RED = '#ffc2b8';

// One line per shot (scripts/render_shots.mjs hashes these lines to find changed shots).
const SPECS: Record<string, Spec> = {
  S01: { scene: 'jalanSide', world: true, track: 0.55, a: C([0, 0.42, 3.3], [0, 1.0, 0], 50), b: C([0.3, 0.44, 3.2], [0, 1.0, 0], 48), x: (lt) => -3.6 + 7.5 * lt, rider: 'side', shake: 0.02, cone: true },
  S02: { scene: 'jalanSide', move: 7, a: C([0.4, 1.25, 2.7], [-0.1, 1.12, 0], 42), b: C([0.65, 1.28, 2.45], [0, 1.12, 0], 42), rider: 'side', shake: 0.01, cone: true },
  S03: { scene: 'jalanSide', move: 7, a: C([-1.2, 2.0, 15], [0, 1.3, 0], 13), b: C([-0.8, 1.9, 13.5], [0, 1.25, 0], 11), rider: 'side', shake: 0.006, cone: true },
  S04: { scene: 'jalanSide', move: 7, a: C([-0.12, 1.12, 1.6], [-0.3, 1.1, 0], 36), b: C([-0.2, 1.11, 1.42], [-0.3, 1.1, 0], 36), rider: 'side', shake: 0.005 },
  S05: { scene: 'jalanAxis', move: 7, a: POV, pov: 'chat1', povZ: [-0.32, -0.3], shake: 0.003 },
  S06: { scene: 'jalanAxis', move: 7, a: POV, pov: 'chat1', povZ: [-0.3, -0.25], shake: 0.003 },
  S07: { scene: 'jalanAxis', move: 7, a: C([0.32, 2.1, 1.75], [0.05, 1.45, 0], 32), b: C([0.26, 2.05, 1.55], [0.05, 1.47, 0], 32), rider: 'back', shake: 0.008 },
  S08: { scene: 'tokoSide', world: true, a: C([1.2, 1.45, -2.0], [0.3, 1.3, -6], 38), b: C([0.95, 1.42, -2.7], [0.3, 1.32, -6], 38), stand: true, rider: 'none', shake: 0.005, grade: 'toko' },
  S09: { scene: 'tokoSide', world: true, track: 1, a: C([1.6, 0.55, 3.6], [0, 1.0, 0], 44), b: C([1.5, 0.56, 3.5], [0, 1.0, 0], 44), x: (lt, d) => -7 * Math.pow(1 - Math.min(1, lt / (d * 0.8)), 2.2), rider: 'sideDriver', shake: 0.006, grade: 'toko', cone: true },
  S10: { scene: 'tokoSide', a: C([0.05, 1.0, 1.4], [0.05, 1.0, 0], 34), b: C([0.22, 1.4, 1.75], [0.22, 1.38, 0], 34), ease: 'io', cu: ['jacket', 2.29], rider: 'none', shake: 0.004, grade: 'toko' },
  S11: { scene: 'tokoSide', a: C([0, 0.56, 2.9], [0, 0.5, 0], 34), b: C([0, 0.54, 2.6], [0, 0.5, 0], 34), cu: ['plate', 1.0], rider: 'none', shake: 0.004, grade: 'toko' },
  S12: { scene: 'tokoSide', a: C([0.28, 1.43, 1.35], [0.28, 1.43, 0], 30), b: C([0.28, 1.43, 1.15], [0.28, 1.43, 0], 30), cu: ['jacket', 2.29], rider: 'none', shake: 0.003, grade: 'toko' },
  S13: { scene: 'tokoSide', a: C([0.6, 1.3, 3.4], [-0.1, 1.1, 0], 40), b: C([0.4, 1.28, 3.1], [-0.1, 1.1, 0], 40), rider: 'side', shake: 0.005, grade: 'toko', cone: true },
  S14: { scene: 'jalanSide', move: 7, a: C([-0.18, 1.18, 2.0], [-0.32, 1.08, 0], 38), b: C([-0.26, 1.17, 1.8], [-0.32, 1.08, 0], 38), rider: 'side', shake: 0.008 },
  S15: { scene: 'jalanAxis', move: 7, a: POV, pov: 'map', povZ: [-0.31, -0.24], shake: 0.003 },
  S16: { scene: 'jalanAxis', move: 7, a: C([-0.1, 1.64, 0.05], [-0.33, 1.32, -1.1], 44), b: C([-0.18, 1.58, -0.3], [-0.35, 1.33, -1.1], 40), ease: 'io', pov: 'none', tap: true, shake: 0.004 },
  S17: { scene: 'jalanSide', move: 7, a: C([0.05, 1.0, 2.7], [0.06, 1.0, 0], 40), b: C([0.05, 1.02, 2.4], [0.06, 1.02, 0], 40), cu: ['helm', 1.71], rider: 'none', shake: 0.006 },
  S18: { scene: 'jalanAxis', move: 7, dark: true, a: C([0.4, 1.7, 4.2], [0, 1.0, -6], 42), b: C([0.4, 1.8, 6.2], [0, 1.0, -6], 42), rider: 'back', shake: 0.008 },
  S19: { scene: 'relSide', move: 6, a: C([0.9, 1.2, 3.7], [-0.2, 1.05, 0], 40), b: C([0.6, 1.2, 3.35], [-0.2, 1.05, 0], 40), rider: 'side', shake: 0.008, grade: 'rel', cone: true },
  S20: { scene: 'relAxis', move: 6, a: POV, pov: 'chat2', povZ: [-0.32, -0.27], shake: 0.003, grade: 'rel' },
  S21: { scene: 'relSide', move: 6, a: C([0, 0.94, 2.0], [0, 0.9, 0], 40), b: C([0, 0.93, 1.75], [0, 0.9, 0], 40), cu: ['faceS', 1.71, RED], rider: 'none', shake: 0.005, grade: 'rel' },
  S22: { scene: 'relSide', move: 6, a: C([0, 0.68, 2.4], [0, 0.66, 0], 40), b: C([0, 0.68, 2.1], [0, 0.66, 0], 40), cu: ['mirror', 1.29], rider: 'none', shake: 0.004, grade: 'rel' },
  S23: { scene: 'relSide', move: 6, a: C([0, 1.5, 2.8], [0, 2.0, 0], 34), b: C([0, 0.56, 2.8], [0, 0.5, 0], 34), ease: 'whip', cu: ['plate', 1.0, '#ffd8d0'], rider: 'none', shake: 0.006, grade: 'rel' },
  S24: { scene: 'relSide', move: 6, a: C([0, 0.54, 2.7], [0, 0.5, 0], 34), b: C([0, 0.52, 2.35], [0, 0.5, 0], 34), cu: ['plate', 1.0, '#ffd8d0'], rider: 'none', shake: 0.004, grade: 'rel' },
  S25: { scene: 'relAxis', move: 6, a: POV, pov: 'info', povZ: [-0.27, -0.25], shake: 0.003, grade: 'rel' },
  S26: { scene: 'relAxis', move: 6, a: C([0.25, 1.1, 9.0], [0, 1.0, -2], 30), b: C([0.25, 1.1, 8.5], [0, 1.0, -2], 30), rider: 'back', cone: true, shake: 0.01, grade: 'rel' },
  S27: { scene: 'relAxis', move: 6, a: POV, pov: 'photo', povZ: [-0.3, -0.25], shake: 0.003, grade: 'rel' },
  S28: { scene: 'relAxis', a: C([0.25, 0.95, 3.0], [0.1, 0.85, 0], 22), b: C([0.24, 0.96, 2.95], [0.1, 0.86, 0], 22), rider: 'backT', cone: true, grade: 'photo', capY: 300 },
  S29: { scene: 'relAxis', a: C([0.25, 0.95, 3.0], [0.1, 0.85, 0], 22), b: C([0.2, 1.55, 2.6], [0.12, 1.42, 0], 26), ease: 'out', rider: 'backT', cone: true, grade: 'twist' },
  S30: { scene: 'relAxis', x: (lt) => 3 * (1 - Math.exp(-lt * 1.6)), a: C([0.6, 1.3, -4.6], [0, 1.0, 0], 38), b: C([0.55, 1.3, -4.4], [0, 1.0, 0], 38), rider: 'front', hl: (lt) => lt < 0.22 || (lt > 0.3 && lt < 0.36), shake: 0.008, grade: 'rel' },
  S31: { scene: 'relAxis', a: C([0.32, 1.95, 1.7], [0.1, 1.5, 0], 34), b: C([0.28, 1.92, 1.5], [0.1, 1.51, 0], 34), rider: 'back', swapAt: 63.77, shake: 0.005, grade: 'rel' },
  S32: { scene: 'relSide', a: C([0, 0.93, 1.95], [0, 0.9, 0], 40), b: C([0, 0.92, 1.62], [0, 0.9, 0], 40), cu: ['faceS', 1.71, RED], rider: 'none', shake: 0.005, grade: 'rel' },
  S33: { scene: 'relAxis', a: C([1.4, 1.4, -4.6], [0, 1.2, 2], 36), b: C([1.3, 1.4, -4.4], [0, 1.2, 2], 36), rider: 'front', follower: 13, labels: 1, shake: 0.005, grade: 'rel' , capY: 300},
  S34: { scene: 'relAxis', a: C([1.3, 1.4, -4.4], [0, 1.2, 2], 36), b: C([1.2, 1.4, -4.2], [0, 1.2, 2], 36), rider: 'front', follower: 13, labels: 2, shake: 0.005, grade: 'rel' , capY: 300},
  S35: { scene: 'relAxis', a: C([1.2, 1.4, -4.2], [0, 1.2, 2], 36), b: C([-0.22, 1.36, -1.7], [-0.37, 1.3, 0], 32), ease: 'io', rider: 'front', follower: 13, labels: 2, shake: 0.004, grade: 'rel' , capY: 300},
};

/** Shots that are scenes along the road axis (A = [0,0,-d]); everything else travels along +x. */
const isAxis = (s: Spec) => s.scene === 'jalanAxis' || s.scene === 'relAxis';

const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const lerp3 = (a: V3, b: V3, u: number): V3 => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)];
const ease = (u: number, k?: string) => (k === 'whip' ? 1 - Math.pow(1 - Math.min(1, u / 0.3), 3) : k === 'out' ? 1 - Math.pow(1 - Math.min(1, u / 0.6), 3) : k === 'io' ? u * u * (3 - 2 * u) : u);

const camAt = (s: Spec, u: number, A: V3, gt: number): Cam => {
  const b = s.b ?? s.a; const e = ease(u, s.ease);
  const p = lerp3(s.a.p, b.p, e), t = lerp3(s.a.t, b.t, e);
  const off: V3 = s.world ? [0, 0, 0] : A;
  if (s.world && s.track) t[0] += A[0] * s.track;
  const k = s.shake ?? 0;
  const sh: V3 = [Math.sin(gt * 1.9) * k + Math.sin(gt * 4.3) * k * 0.4, Math.sin(gt * 2.3 + 1) * k + Math.sin(gt * 5.1) * k * 0.3, 0];
  return { p: [p[0] + off[0] + sh[0], p[1] + off[1] + sh[1], p[2] + off[2]], t: [t[0] + off[0], t[1] + off[1], t[2] + off[2]], fov: lerp(s.a.fov, b.fov, e) };
};

const CamRig: React.FC<{ c: Cam }> = ({ c }) => {
  const { camera } = useThree();
  useLayoutEffect(() => { const k = camera as THREE.PerspectiveCamera; k.position.set(...c.p); k.fov = c.fov; k.near = 0.02; k.far = 400; k.lookAt(...c.t); k.updateProjectionMatrix(); k.updateMatrixWorld(); });
  return null;
};

const OnCamera: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { camera } = useThree(); const ref = useRef<THREE.Group>(null);
  useLayoutEffect(() => { ref.current!.position.copy(camera.position); ref.current!.quaternion.copy(camera.quaternion); });
  return <group ref={ref}>{children}</group>;
};

const aspect = (t: THREE.Texture) => { const im: any = t.image; return im.width / im.height; };

// ---------- riders ----------
const SideRiders: React.FC<{ t: Tex; A: V3; driverOnly?: boolean; spin: number; bob: number; cone?: boolean; warm?: boolean }> = ({ t, A, driverOnly, spin, bob, cone, warm }) => (
  <group position={[A[0], bob, A[2]]}>
    <mesh position={[0, 0.0, 0.02]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={6}><planeGeometry args={[2.6, 0.8]} /><meshBasicMaterial map={t.blob} transparent opacity={0.75} depthWrite={false} /></mesh>
    {[-0.671, 0.614].map((x) => (
      <mesh key={x} position={[x, 0.244, -0.003]} rotation={[0, 0, -spin]} renderOrder={7}>
        <planeGeometry args={[0.514, 0.514]} /><meshBasicMaterial map={t.wheel} transparent alphaTest={0.02} toneMapped={false} />
      </mesh>
    ))}
    <Sprite tex={driverOnly ? t.sideDriver : t.side} p={[0, -0.057, 0]} h={2.0} order={8} color={warm ? '#fff4ea' : '#ffffff'} />
    <Add tex={t.glow} p={[0.73, 0.99, 0.05]} s={[0.9, 0.9]} color="#fff3d0" opacity={0.95} />
    <Add tex={t.glow} p={[-0.87, 0.6, 0.05]} s={[0.6, 0.6]} color="#ff2a2a" opacity={0.8} />
    {cone && <group position={[0.75, 0.98, 0.02]} rotation={[0, 0, -Math.PI / 2 - 0.16]}><Add tex={t.cone} p={[0, 2.1, 0]} s={[2.0, 4.2]} color="#fff1cf" opacity={0.26} /></group>}
    {cone && <Add tex={t.glow} p={[3.2, 0.02, 0.3]} s={[4.5, 2.2]} color="#fff1cf" opacity={0.45} r={[-Math.PI / 2, 0, 0]} />}
  </group>
);

const BackRiders: React.FC<{ t: Tex; A: V3; turned: boolean; bob: number }> = ({ t, A, turned, bob }) => (
  <group position={[A[0], bob, A[2]]}>
    <mesh position={[0, 0.01, -0.2]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={6}><planeGeometry args={[1.3, 2.6]} /><meshBasicMaterial map={t.blob} transparent opacity={0.7} depthWrite={false} /></mesh>
    <Sprite tex={turned ? t.backT : t.back} p={[0, -0.023, 0]} h={2.0} order={8} />
    <Add tex={t.glow} p={[0, 0.6, 0.06]} s={[1.0, 0.6]} color="#ff2a2a" opacity={0.6} />
  </group>
);

const FrontRiders: React.FC<{ t: Tex; A: V3; lit: boolean }> = ({ t, A, lit }) => (
  <group position={A}>
    <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={6}><planeGeometry args={[1.4, 2.4]} /><meshBasicMaterial map={t.blob} transparent opacity={0.7} depthWrite={false} /></mesh>
    <Sprite tex={lit ? t.frontLit : t.front} p={[0, -0.026, 0]} h={2.0} ry={Math.PI} order={8} />
    {lit && <Add tex={t.glow} p={[0, 0.81, -0.08]} s={[1.6, 1.6]} color="#fff3d0" opacity={0.95} />}
    {lit && <Add tex={t.glow} p={[0, 0.02, -3]} s={[4, 6]} color="#fff1cf" opacity={0.5} r={[-Math.PI / 2, 0, 0]} />}
  </group>
);

// ---------- captions ----------
const KEYS = new Set(['ojol', 'aplikasi', 'jemput', 'boncengannya', 'minimarket', 'ungu', 'juned', 'cocok', 'peta', 'diem', 'pundak', 'pintas', 'lampu', 'mati', 'bukan', 'spion', 'sama', 'belakang', 'foto', 'punggungmu', 'ngadep', 'arahmu', 'percaya', 'lompat', 'pegangan', 'dua']);
type W = { w: string; s: number; e: number; who: string };
const PAGES = (() => {
  const raw: W[] = (timing as any).words.map((x: any) => ({ w: x.w, s: x.s, e: x.e, who: x.who }));
  const ws: W[] = [];
  for (let i = 0; i < raw.length; i++) {
    const x = { ...raw[i] };
    if (x.w === 'di' && raw[i + 1]?.w === 'bonceng') { ws.push({ ...x, w: 'dibonceng', e: raw[i + 1].e }); i++; continue; }
    if (x.w === 'Sama?') x.w = 'Sama.';
    const prev = ws[ws.length - 1];
    if (prev && /,$/.test(prev.w) && /^[A-Z][a-z]/.test(x.w) && !['Juned', 'Juned,', 'Juned.', 'B', 'Kak,', 'Kakak', 'Kak'].includes(x.w)) x.w = x.w[0].toLowerCase() + x.w.slice(1);
    ws.push(x);
  }
  const pages: { words: W[]; s: number; e: number }[] = []; let cur: W[] = [];
  ws.forEach((w) => {
    if (cur.length && (cur[0].who !== w.who || cur.length >= 6)) { pages.push({ words: cur, s: cur[0].s, e: 0 }); cur = []; }
    cur.push(w);
    if (/[.?]$/.test(w.w) || (/,$/.test(w.w) && cur.length >= 3)) { pages.push({ words: cur, s: cur[0].s, e: 0 }); cur = []; }
  });
  if (cur.length) pages.push({ words: cur, s: cur[0].s, e: 0 });
  pages.forEach((p, i) => { p.e = Math.min(pages[i + 1]?.s ?? END, p.words[p.words.length - 1].e + 0.7); });
  return pages;
})();

const Captions: React.FC<{ gt: number; top: number }> = ({ gt, top }) => {
  const pg = PAGES.find((p) => gt >= p.s - 0.02 && gt < p.e);
  if (!pg) return null;
  let active = 0; pg.words.forEach((w, i) => { if (gt >= w.s - 0.02) active = i; });
  const words: CapWord[] = pg.words.map((w) => ({ w: w.w, who: w.who as any }));
  const kIdx = pg.words.findIndex((w, i) => i <= active && KEYS.has(w.w.toLowerCase().replace(/[^a-z]/g, '')));
  return <Caption words={words} active={active} keyword={kIdx >= 0 ? kIdx : undefined} top={top} />;
};

// ---------- choice labels ----------
const project = (cam: Cam, pt: V3, w: number, h: number) => {
  const c = new THREE.PerspectiveCamera(cam.fov, w / h, 0.02, 400); c.position.set(...cam.p); c.lookAt(...cam.t); c.updateMatrixWorld(); c.updateProjectionMatrix();
  const v = new THREE.Vector3(...pt).project(c); return [(v.x + 1) / 2 * w, (1 - v.y) / 2 * h];
};
const clampX = (x: number, w: number) => Math.max(40, Math.min(1080 - 40 - w, x));
const clampY = (y: number) => Math.max(560, Math.min(1700, y));
const Label: React.FC<{ n: number; text: string; at: number[]; box: [number, number]; color: string; pop: number }> = ({ n, text, at, box, color, pop }) => {
  const sc = Math.min(1, pop * 4); const s = 0.6 + 0.4 * (1 - Math.pow(1 - sc, 3));
  return (
    <>
      <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, opacity: sc }}>
        <line x1={box[0] + 40} y1={box[1] + 40} x2={at[0]} y2={at[1]} stroke="#fff" strokeWidth={3} strokeDasharray="10 8" />
        <circle cx={at[0]} cy={at[1]} r={10} fill={color} stroke="#fff" strokeWidth={3} />
      </svg>
      <div style={{ position: 'absolute', left: box[0], top: box[1], transform: `scale(${s})`, transformOrigin: '40px 40px', opacity: sc, display: 'flex', alignItems: 'center', gap: 18,
        background: 'rgba(10,8,20,.82)', border: `4px solid ${color}`, borderRadius: 60, padding: '10px 34px 10px 10px', fontFamily: 'Inter', boxShadow: '0 8px 30px rgba(0,0,0,.6)' }}>
        <div style={{ width: 62, height: 62, borderRadius: 31, background: color, color: '#120d1d', fontWeight: 900, fontSize: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{n}</div>
        <div style={{ color: '#fff', fontWeight: 800, fontSize: 40, letterSpacing: 0.5 }}>{text}</div>
      </div>
    </>
  );
};

const Grade: React.FC<{ kind: string; lt: number; noise: string; flash?: number }> = ({ kind, lt, noise, flash = 0 }) => (
  <AbsoluteFill style={{ pointerEvents: 'none' }}>
    {kind === 'toko' && <AbsoluteFill style={{ background: 'radial-gradient(ellipse 70% 40% at 50% 55%, rgba(255,140,60,.10), rgba(0,0,0,0) 70%)', mixBlendMode: 'screen' }} />}
    {(kind === 'rel' || kind === 'twist') && <AbsoluteFill style={{ background: 'rgba(255,60,60,.10)', mixBlendMode: 'soft-light' }} />}
    {kind === 'photo' && <AbsoluteFill style={{ boxShadow: 'inset 0 0 0 18px rgba(240,240,240,.9)', background: 'rgba(255,230,210,.05)' }} />}
    {kind === 'twist' && lt < 0.18 && <AbsoluteFill style={{ background: `rgba(255,255,255,${0.7 * (1 - lt / 0.18)})` }} />}
    {flash > 0 && <AbsoluteFill style={{ background: `rgba(255,255,255,${flash})` }} />}
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 78% 62% at 50% 50%, rgba(0,0,0,0) 42%, rgba(5,3,12,${kind === 'rel' || kind === 'twist' ? 0.7 : 0.6}) 100%)` }} />
    <AbsoluteFill style={{ opacity: 0.08, mixBlendMode: 'overlay', backgroundImage: `url(${noise})` }} />
  </AbsoluteFill>
);

const useAssets = () => {
  const [h] = useState(() => delayRender('ep01 assets'));
  const [tex, setTex] = useState<Tex | null>(null);
  const [noise, setNoise] = useState('');
  useLayoutEffect(() => {
    (async () => {
      await Promise.all(['500 34px Inter', '700 26px Inter', '800 44px Inter', '900 140px Inter'].map((f) => document.fonts.load(f)));
      const L = async (s: string, k: number) => svgTex(s, k);
      const [side, sideDriver, back, backT, front, frontLit, driverBack, hand, whl, stand, faceW, faceS, helm, jacket, tap, mirror, plate, follower] = await Promise.all([
        L(ridersSide({ wheels: false }), 1.4), L(ridersSide({ wheels: false, passenger: false }), 1.4), L(ridersBack({ turned: false }), 1.4), L(ridersBack({ turned: true }), 1.4),
        L(ridersFront({ headlight: false }), 1.6), L(ridersFront({ headlight: true }), 1.4), L(driverBackPov(), 1), L(handPhone(), 1.2), L(wheel(), 1),
        L(kamuStand(), 1.5), L(faceCU('worried'), 1.3), L(faceCU('scared'), 1.3), L(helmetCU(), 1.3), L(jacketCU(), 1.3), L(tapHand(), 1), L(mirrorCU(), 1.3), L(plateCU(), 1.3), L(followerFront(), 1)]);
      const m1 = { text: 'Kak, saya udah di titik jemput. Kakaknya di mana?', time: '00.14' };
      const m2 = { text: 'Kak, saya liat tadi Kakak naik motor orang. Itu bukan saya.', time: '00.17' };
      const m3 = { text: 'Kak, saya ngikutin dari belakang. Liat foto ini.', time: '00.18' };
      const kerb = paint(512, 64, (g) => { g.fillStyle = '#5a5e70'; g.fillRect(0, 0, 512, 64); g.fillStyle = '#8a8ea2'; g.fillRect(0, 0, 512, 10); for (let x = 0; x < 512; x += 128) { g.fillStyle = '#3a3d4a'; g.fillRect(x, 0, 4, 64); } });
      kerb.wrapS = THREE.RepeatWrapping;
      const nc = document.createElement('canvas'); nc.width = nc.height = 256; const ng = nc.getContext('2d')!; const id = ng.createImageData(256, 256);
      for (let i = 0; i < id.data.length; i += 4) { const v = Math.random() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; }
      ng.putImageData(id, 0, 0); setNoise(nc.toDataURL());
      const tx: Tex = {
        side, sideDriver, back, backT, front, frontLit, driverBack, hand, wheel: whl, stand, faceW, faceS, helm, jacket, tap, mirror, plate, follower, kerb,
        chat1: chatScreen2([m1]), chat2: chatScreen2([m1, m2]), photo: chatScreen2([m3, { photo: true, time: '00.18' }]), map: mapScreen(), info: infoScreen(),
        sky: skyTex('#0a0c2a', '#2a2160', '#5a3a7a'), skyFar: skylineTex(4, '#0e1024', '#ffcf7a', 0.28), skyNear: skylineTex(9, '#141634', '#ffd28a', 0.2),
        trees: treesTex(5, '#0b0e1c'), trees2: treesTex(8, '#0d1020'), trees3: treesTex(12, '#120607'), skyRed: skyTex('#120406', '#4a1014', '#7a2020', false, 7),
        asphalt: asphaltTex(1, true), asphalt2: asphaltTex(2, false), dirt: asphaltTex(9, false), paving: asphaltTex(3, false),
        toko: tokoTex(), pole: poleTex(), signal: signalTex(), rail: railTex(), wallL: wallTex(3, '#4a5070'), wallR: wallTex(5, '#545a7c'),
        glow: glowTex(), blob: blobTex(), cone: coneTex(), fog: fogTex('150,60,60'),
      };
      // repeating ground/wall textures are seen at grazing angles: keep mipmaps there (cheap, few pixels), everything else is unmipped.
      for (const k of ['asphalt', 'asphalt2', 'dirt', 'paving', 'rail', 'wallL', 'wallR', 'kerb']) { const x = tx[k]; x.generateMipmaps = true; x.minFilter = THREE.LinearMipmapLinearFilter; x.needsUpdate = true; }
      setTex(tx);
      continueRender(h);
    })();
  }, []);
  return { tex, noise };
};

export const EP01: React.FC = () => {
  const frame = useCurrentFrame(); const { width, height } = useVideoConfig();
  const gt = frame / FPS;
  const { tex: t, noise } = useAssets();
  if (!t) return null;
  if (gt >= END) return <AbsoluteFill style={{ background: '#000' }} />;

  const shots = shotsJson.shots; const shot = shots.find((s) => gt >= s.start && gt < s.end) ?? shots[shots.length - 1];
  const s = SPECS[shot.id]; const d = shot.end - shot.start; const lt = gt - shot.start; const u = Math.min(1, lt / d);
  const dist = s.x ? s.x(lt, d) : (s.move ?? 0) * lt;
  const axis = isAxis(s);
  const A: V3 = axis ? [0, 0, -dist] : [dist, 0, 0];
  const cam = camAt(s, u, A, gt);
  const moving = !!s.move || !!s.x;
  const bob = moving ? Math.sin(gt * 40) * 0.004 : 0;
  const spin = dist / 0.245;
  const hl = s.hl ? s.hl(lt) : true;
  const grade = s.grade ?? (s.scene.startsWith('rel') ? 'rel' : s.scene.startsWith('toko') ? 'toko' : 'jalan');
  const turnedNow = s.rider === 'backT' || (s.swapAt !== undefined && gt >= s.swapAt);
  const swapFlash = s.swapAt !== undefined && gt >= s.swapAt && gt < s.swapAt + 0.12 ? 0.5 * (1 - (gt - s.swapAt) / 0.12) : 0;

  const lab1 = s.labels ? project(cam, [A[0], 1.07, A[2] + (s.follower ?? 13)], width, height) : null;
  const lab2 = s.labels && s.labels >= 2 ? project(cam, [A[0], 1.4, A[2]], width, height) : null;
  const fadeOut = shot.id === 'S35' ? Math.max(0, 0.25 * (1 - u * 2)) : 1; // labels fade while the camera pushes in to the face
  const pop1 = s.labels ? (shot.id === 'S33' ? Math.max(0, gt - 68.27) : fadeOut) : 0;
  const pop2 = shot.id === 'S34' ? Math.max(0, gt - 71.95) : fadeOut;
  const cu = s.cu ? t[s.cu[0]] : null;
  const povZ = s.povZ ? lerp(s.povZ[0], s.povZ[1], ease(u, 'io')) : -0.3;
  const scale = 0.24 / 1100;

  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <ThreeCanvas width={width} height={height} linear={false} gl={{ antialias: false, powerPreference: 'high-performance' }} onCreated={({ gl }) => { gl.toneMapping = THREE.NoToneMapping; }}>
        <CamRig c={cam} />
        {s.scene === 'jalanSide' && <JalanSide t={t} x0={A[0]} />}
        {s.scene === 'tokoSide' && <TokoSide t={t} />}
        {s.scene === 'relSide' && <RelSide t={t} x0={A[0]} />}
        {s.scene === 'jalanAxis' && <JalanAxis t={t} z0={A[2]} dark={s.dark} />}
        {s.scene === 'relAxis' && <RelAxis t={t} z0={A[2]} />}

        {(s.rider === 'side' || s.rider === 'sideDriver') && <SideRiders t={t} A={A} driverOnly={s.rider === 'sideDriver'} spin={spin} bob={bob} cone={s.cone} warm={grade === 'toko'} />}
        {(s.rider === 'back' || s.rider === 'backT') && <BackRiders t={t} A={A} turned={turnedNow} bob={bob} />}
        {(s.rider === 'front' || s.rider === 'frontLit') && <FrontRiders t={t} A={A} lit={s.rider === 'frontLit' || (s.hl ? hl : false)} />}
        {s.stand && <Sprite tex={t.stand} p={[0.3, 0, -6]} h={2.0} order={8} color="#fff6ee" />}
        {s.stand && <Add tex={t.glow} p={[0.36, 1.66, -5.95]} s={[0.9, 0.9]} color="#a57bff" opacity={0.35} />}
        {cu && <Sprite tex={cu} p={[A[0], 0, A[2]]} h={s.cu![1]} color={s.cu![2] ?? '#ffffff'} order={8} />}
        {/* follower behind the riders (front views) */}
        {s.follower !== undefined && <>
          <Sprite tex={t.follower} p={[A[0] + 0.2, -0.03, A[2] + s.follower]} h={2.0} ry={Math.PI} order={7} />
          <Add tex={t.glow} p={[A[0] + 0.2, 1.07, A[2] + s.follower - 0.1]} s={[3.2, 3.2]} color="#fff6e0" opacity={0.95} />
          <Add tex={t.glow} p={[A[0] + 0.2, 0.02, A[2] + s.follower - 4]} s={[4, 9]} color="#fff1cf" opacity={0.4} r={[-Math.PI / 2, 0, 0]} />
        </>}
        {/* the follower's / camera's own headlight on the road ahead (back views) */}
        {axis && s.cone && (s.rider === 'back' || s.rider === 'backT') && <Add tex={t.glow} p={[A[0] + 0.1, 0.02, A[2] + 1.6]} s={[4.5, 6]} color="#fff2e0" opacity={0.5} r={[-Math.PI / 2, 0, 0]} />}
        {/* POV: the driver's back ahead, the hand with the phone on the camera */}
        {s.pov && <>
          <Sprite tex={t.driverBack} p={[A[0] - 0.2, 0.75, A[2] - 1.05]} h={1.05} order={10} />
          <Add tex={t.glow} p={[A[0] + 0.1, 0.02, A[2] - 5]} s={[5, 10]} color="#fff0cc" opacity={0.75} r={[-Math.PI / 2, 0, 0]} />
        </>}
        {s.tap && <Sprite tex={t.tap} p={[A[0] - 0.47, 1.14 + 0.02 * Math.abs(Math.sin(lt * 9)), A[2] - 1.0]} h={0.35} order={12} />}
        {s.pov && s.pov !== 'none' && (
          <OnCamera>
            <group position={[0.02, -0.08, povZ]} rotation={[-0.15, -0.06, 0.05]}>
              <mesh renderOrder={40}><planeGeometry args={[0.24 * aspect(t.hand), 0.24]} /><meshBasicMaterial map={t.hand} transparent alphaTest={0.02} toneMapped={false} fog={false} depthTest={false} /></mesh>
              <mesh position={[0, 60 * scale, 0.0006]} renderOrder={41}><planeGeometry args={[380 * scale, 820 * scale]} /><meshBasicMaterial map={t[s.pov]} transparent toneMapped={false} fog={false} depthTest={false} /></mesh>
            </group>
          </OnCamera>
        )}
      </ThreeCanvas>
      <Grade kind={grade} lt={lt} noise={noise} flash={swapFlash} />
      {lab1 && <Label n={1} text="LOMPAT TURUN" at={lab1} box={[clampX(lab1[0] - 170, 470), clampY(lab1[1] - 230)]} color="#FFD23F" pop={pop1} />}
      {lab2 && <Label n={2} text="TETAP PEGANGAN" at={lab2} box={[clampX(lab2[0] - 260, 560), clampY(lab2[1] + 260)]} color="#B48CFF" pop={pop2} />}
      <Captions gt={gt} top={s.pov && s.pov !== 'none' ? 250 : 330} />
    </AbsoluteFill>
  );
};
