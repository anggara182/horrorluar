// EP01 "Titik Ungu": 35 shots locked to the VO (ep01/shots.json + ep01/vo_timing.json). Video only; audio is mixed by tools/mix.py.
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AbsoluteFill, continueRender, delayRender, useCurrentFrame, useVideoConfig } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import shotsJson from '../../../ep01/shots.json';
import timing from '../../../ep01/vo_timing.json';
import { Beam, Glow, Limb, T, V3, canvasTex, rbox } from '../look2/toon';
import { K, Penumpang, PenumpangBerdiri, Phone, Ride, badgeTex, faceTex, plateTex } from '../look2/cast2';
import { asphaltTex, rng, skyTex, skylineTex, treesTex } from '../look2/sets2';
import { JalanSet, RelSet, TokoSet, Tex } from './sets';
import { chatScreen2, infoScreen, mapScreen, orderScreen } from '../ui/screens2';
import { Caption, CapWord } from '../ui/Caption';

export const FPS = 24;
export const END = shotsJson.end;
export const DURATION = Math.ceil(END * FPS) + 1;

type Cam = { p: V3; t: V3; fov: number };
type Spec = {
  set: 'jalan' | 'toko' | 'rel';
  a: Cam; b?: Cam; world?: boolean; ease?: 'io' | 'out' | 'whip';
  move?: number; x?: (lt: number, d: number) => number; track?: boolean;
  ride?: Record<string, any> | null; stand?: boolean;
  pov?: string; povZ?: [number, number];
  shake?: number; lamps?: boolean; follower?: number; labels?: number;
  headTurn?: (gt: number, lt: number) => number; headlight?: (lt: number) => boolean;
  grade?: 'jalan' | 'toko' | 'rel' | 'photo' | 'twist';
};

const POV: Cam = { p: [-0.62, 1.78, 0.28], t: [4, 0.85, -0.2], fov: 54 };
const C = (p: V3, t: V3, fov: number): Cam => ({ p, t, fov });

const SPECS: Record<string, Spec> = {
  S01: { set: 'jalan', world: true, track: true, a: C([0.6, 0.3, 2.35], [0, 1.0, 0], 54), b: C([0.9, 0.32, 2.3], [0, 1.0, 0], 52), x: (lt) => -4 + 9 * lt, shake: 0.02, ride: {} },
  S02: { set: 'jalan', move: 7, a: C([0.4, 1.3, 2.45], [-0.2, 1.2, 0], 50), b: C([0.7, 1.33, 2.35], [-0.1, 1.2, 0], 50), shake: 0.012, ride: { headDown: 0.45 } },
  S03: { set: 'jalan', move: 7, a: C([-6, 7, 9], [1, 0.8, 0], 40), b: C([-4.5, 6.4, 8], [1.5, 0.8, 0], 40), shake: 0.01, ride: {} },
  S04: { set: 'jalan', move: 7, a: C([-0.52, 1.78, 0.38], [-0.27, 1.2, 0.06], 28), b: C([-0.5, 1.72, 0.3], [-0.27, 1.21, 0.06], 24), shake: 0.006, ride: { headDown: 0.45 } },
  S05: { set: 'jalan', move: 7, a: POV, pov: 'chat1', povZ: [-0.32, -0.3], shake: 0.004, ride: { passenger: false } },
  S06: { set: 'jalan', move: 7, a: POV, pov: 'chat1', povZ: [-0.3, -0.24], shake: 0.004, ride: { passenger: false } },
  S07: { set: 'jalan', move: 7, a: C([-1.6, 1.95, 0.5], [0.1, 1.45, 0], 38), b: C([-1.4, 1.92, 0.44], [0.1, 1.47, 0], 36), shake: 0.008, ride: { headDown: 0.2 } },
  S08: { set: 'toko', world: true, a: C([1.6, 1.5, -1.2], [0.3, 1.45, -4.6], 40), b: C([1.25, 1.48, -1.9], [0.3, 1.5, -4.6], 38), ride: null, stand: true, shake: 0.006, grade: 'toko' },
  S09: { set: 'toko', a: C([2.6, 0.4, 3.0], [-1.2, 0.95, 0], 44), b: C([2.5, 0.42, 2.9], [-0.4, 0.95, 0], 44), x: (lt, d) => -8 * Math.pow(1 - Math.min(1, lt / (d * 0.8)), 2.2), ride: { passenger: false }, shake: 0.008, grade: 'toko' },
  S10: { set: 'toko', a: C([0.95, 1.15, 0.38], [-0.06, 1.12, 0], 34), b: C([0.88, 1.45, 0.32], [-0.02, 1.5, 0], 34), ease: 'io', ride: { passenger: false }, shake: 0.005, grade: 'toko' },
  S11: { set: 'toko', a: C([-1.75, 0.62, 0.3], [-0.9, 0.47, 0], 30), b: C([-1.5, 0.58, 0.2], [-0.9, 0.47, 0], 28), ride: { passenger: false }, shake: 0.004, grade: 'toko' },
  S12: { set: 'toko', a: C([0.62, 1.3, 0.3], [0.07, 1.26, 0.06], 26), b: C([0.52, 1.28, 0.22], [0.07, 1.26, 0.06], 24), ride: { passenger: false }, shake: 0.004, grade: 'toko' },
  S13: { set: 'toko', a: C([1.8, 1.25, 3.6], [-0.25, 1.1, 0], 40), b: C([1.55, 1.22, 3.25], [-0.25, 1.1, 0], 40), ride: { headDown: 0.4 }, shake: 0.006, grade: 'toko' },
  S14: { set: 'jalan', move: 7, a: C([0.45, 1.5, 1.95], [-0.5, 1.35, 0], 40), b: C([0.3, 1.52, 1.8], [-0.5, 1.37, 0], 40), ride: { headDown: 0.5 }, shake: 0.01 },
  S15: { set: 'jalan', move: 7, a: POV, pov: 'map', povZ: [-0.31, -0.22], shake: 0.004, ride: { passenger: false } },
  S16: { set: 'jalan', move: 7, a: C([-1.15, 1.78, -0.95], [-0.2, 1.36, -0.1], 40), b: C([-1.05, 1.75, -0.85], [-0.2, 1.37, -0.1], 38), ride: { tap: 1, headDown: 0.1 }, shake: 0.008 },
  S17: { set: 'jalan', move: 7, a: C([1.25, 1.22, 0.72], [0, 1.52, 0], 34), b: C([1.08, 1.26, 0.6], [0, 1.53, 0], 32), ride: { headDown: 0.15 }, shake: 0.008 },
  S18: { set: 'jalan', move: 7, x: (lt) => 8 + 7 * lt, a: C([-7, 6, -2], [5, 0, 0], 45), b: C([-6, 5.6, -1.6], [6, 0, 0], 45), ride: {}, shake: 0.01 },
  S19: { set: 'rel', move: 6, a: C([7, 1.4, 3.2], [-1, 1, -1], 42), b: C([6.4, 1.5, 2.8], [-0.5, 1, -1], 42), ride: { headDown: 0.3 }, shake: 0.01, grade: 'rel' },
  S20: { set: 'rel', move: 6, a: POV, pov: 'chat2', povZ: [-0.32, -0.27], shake: 0.004, ride: { passenger: false }, grade: 'rel' },
  S21: { set: 'rel', move: 6, a: C([0.3, 1.56, 0.62], [-0.48, 1.5, 0], 30), b: C([0.22, 1.55, 0.55], [-0.48, 1.5, 0], 27), ride: { headDown: 0.05, face: 'scared', pTurn: -0.6 }, shake: 0.006, grade: 'rel' },
  S22: { set: 'rel', move: 6, a: C([0.05, 1.42, 0.3], [0.405, 1.36, 0.28], 22), b: C([0.1, 1.41, 0.29], [0.405, 1.36, 0.28], 18), ride: { mirror: true }, shake: 0.004, grade: 'rel' },
  S23: { set: 'rel', move: 6, a: C([-1.6, 0.62, 0.5], [-0.9, 1.4, 1.6], 30), b: C([-1.5, 0.6, 0.25], [-0.9, 0.48, 0], 30), ease: 'whip', ride: {}, shake: 0.006, grade: 'rel' },
  S24: { set: 'rel', move: 6, a: C([-1.5, 0.58, 0.15], [-0.9, 0.47, 0], 26), b: C([-1.25, 0.55, 0.08], [-0.9, 0.47, 0], 24), ride: {}, shake: 0.004, grade: 'rel' },
  S25: { set: 'rel', move: 6, a: POV, pov: 'info', povZ: [-0.27, -0.25], shake: 0.003, ride: { passenger: false }, grade: 'rel' },
  S26: { set: 'rel', move: 6, a: C([-15, 1.05, 1.2], [0, 1.1, 0], 30), b: C([-14, 1.05, 1.0], [0, 1.1, 0], 30), follower: -10, ride: {}, shake: 0.01, grade: 'rel' },
  S27: { set: 'rel', move: 6, a: POV, pov: 'photo', povZ: [-0.3, -0.25], shake: 0.003, ride: { passenger: false }, grade: 'rel' },
  S28: { set: 'rel', a: C([-3.6, 1.15, 0.9], [-0.45, 0.95, 0], 28), b: C([-3.5, 1.16, 0.88], [-0.45, 0.97, 0], 28), ride: { headTurn: Math.PI, headDown: 0.5 }, grade: 'photo' },
  S29: { set: 'rel', a: C([-3.6, 1.2, 0.95], [-0.4, 0.95, 0], 30), b: C([-3.5, 1.95, 1.0], [-0.15, 1.42, 0.02], 29), ease: 'out', ride: { headTurn: Math.PI, headDown: 0.5, face: 'scared' }, grade: 'twist' },
  S30: { set: 'rel', x: (lt) => 3 * (1 - Math.exp(-lt * 1.6)), a: C([5.5, 1.25, 1.6], [0, 1, 0], 40), b: C([5.2, 1.25, 1.5], [0, 1, 0], 40), headlight: (lt) => lt < 0.22 || (lt > 0.3 && lt < 0.36), ride: { face: 'scared', headDown: 0.1 }, shake: 0.008, grade: 'rel' },
  S31: { set: 'rel', a: C([-1.7, 2.15, 1.15], [0, 1.45, 0], 32), b: C([-1.55, 2.1, 1.05], [0, 1.47, 0], 30), headlight: () => false, headTurn: (gt) => (gt < 63.77 ? 0 : -1.35 * Math.min(1, (gt - 63.77) / 1.3)), ride: { headDown: 0.1 }, shake: 0.006, grade: 'rel' },
  S32: { set: 'rel', a: C([0.32, 1.55, 0.6], [-0.48, 1.5, 0], 29), b: C([0.24, 1.54, 0.52], [-0.48, 1.5, 0], 26), headlight: () => false, ride: { headDown: 0.0, face: 'scared', pTurn: -0.6 }, shake: 0.006, grade: 'rel' },
  S33: { set: 'rel', a: C([5.2, 1.6, 1.9], [-6, 1.1, -0.7], 36), b: C([5.0, 1.6, 1.82], [-6, 1.1, -0.7], 36), headlight: () => false, follower: -13, labels: 1, ride: { face: 'scared', headDown: 0 }, shake: 0.006, grade: 'rel' },
  S34: { set: 'rel', a: C([5.0, 1.6, 1.82], [-6, 1.1, -0.7], 36), b: C([4.8, 1.6, 1.75], [-6, 1.1, -0.7], 36), headlight: () => false, follower: -13, labels: 2, ride: { face: 'scared', headDown: 0 }, shake: 0.006, grade: 'rel' },
  S35: { set: 'rel', a: C([4.8, 1.6, 1.75], [-6, 1.1, -0.7], 36), b: C([0.55, 1.55, 0.75], [-0.48, 1.5, 0], 30), ease: 'io', headlight: () => false, follower: -13, labels: 2, ride: { face: 'scared', headDown: 0, pTurn: -0.5 }, shake: 0.004, grade: 'rel' },
};

const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const lerp3 = (a: V3, b: V3, u: number): V3 => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)];
const ease = (u: number, k?: string) => (k === 'whip' ? 1 - Math.pow(1 - Math.min(1, u / 0.3), 3) : k === 'out' ? 1 - Math.pow(1 - Math.min(1, u / 0.6), 3) : k === 'io' ? u * u * (3 - 2 * u) : u);

const camAt = (s: Spec, u: number, base: V3, gt: number) => {
  const b = s.b ?? s.a; const e = ease(u, s.ease);
  const off = s.world ? [0, 0, 0] : base;
  const p = lerp3(s.a.p, b.p, e), t = lerp3(s.a.t, b.t, e);
  if (s.world && s.track) t[0] += base[0];
  const k = s.shake ?? 0;
  const sh: V3 = [Math.sin(gt * 1.9) * k + Math.sin(gt * 4.3) * k * 0.4, Math.sin(gt * 2.3 + 1) * k + Math.sin(gt * 5.1) * k * 0.3, Math.sin(gt * 1.6 + 2) * k];
  return { p: [p[0] + off[0] + sh[0], p[1] + off[1] + sh[1], p[2] + off[2] + sh[2]] as V3, t: [t[0] + off[0], t[1] + off[1], t[2] + off[2]] as V3, fov: lerp(s.a.fov, b.fov, e) };
};

const CamRig: React.FC<{ p: V3; t: V3; fov: number }> = ({ p, t, fov }) => {
  const { camera } = useThree();
  useLayoutEffect(() => { const c = camera as THREE.PerspectiveCamera; c.position.set(...p); c.fov = fov; c.near = 0.02; c.far = 400; c.lookAt(...t); c.updateProjectionMatrix(); });
  return null;
};

const PovHand: React.FC<{ screen: THREE.Texture; z: number }> = ({ screen, z }) => {
  const { camera } = useThree(); const ref = useRef<THREE.Group>(null);
  useLayoutEffect(() => { camera.updateMatrixWorld(); ref.current!.position.copy(camera.position); ref.current!.quaternion.copy(camera.quaternion); });
  return (
    <group ref={ref}>
      <group position={[0.02, -0.07, z]} rotation={[-0.22, -0.08, 0.06]}>
        <Phone screen={screen} />
        <T g={rbox(0.08, 0.1, 0.034, 0.015)} p={[0.006, -0.048, -0.024]} color={K.kulit} outline={0.003} />
        {[0, 1, 2, 3].map((i) => <Limb key={i} a={[-0.042, -0.012 - i * 0.021, -0.014]} b={[-0.047, -0.012 - i * 0.021, 0.004]} r={0.0085} color={K.kulit} outline={0.002} />)}
        <Limb a={[0.044, -0.075, -0.01]} b={[0.043, -0.03, 0.009]} r={0.0105} color={K.kulit} outline={0.002} />
        <Limb a={[0.02, -0.095, -0.03]} b={[0.1, -0.33, 0.12]} r={0.042} color={K.kulit} outline={0.003} />
        <Limb a={[0.075, -0.25, 0.06]} b={[0.13, -0.42, 0.18]} r={0.05} color={K.seragam} outline={0.003} />
      </group>
      <pointLight position={[0.02, -0.03, z + 0.08]} color="#b39dff" intensity={0.12} distance={0.4} />
    </group>
  );
};

const Headlamp: React.FC<{ on: boolean; strength?: number }> = ({ on, strength = 80 }) => {
  const target = useMemo(() => new THREE.Object3D(), []);
  if (!on) return null;
  return (<>
    <primitive object={target} position={[8, 0, 0]} />
    <spotLight position={[0.7, 1.1, 0]} target={target} color="#fff1cf" intensity={strength} angle={0.45} penumbra={0.6} distance={40} decay={1.1}
      castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-bias={-0.0006} shadow-normalBias={0.03} />
    <Beam p={[2.6, 0.9, 0]} r={[0, 0, -Math.PI / 2 - 0.05]} len={4} w={1.8} color="#fff1cf" opacity={0.14} />
  </>);
};

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
  ws.forEach((w, i) => {
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

// ---------- choice labels (projected onto 3D points) ----------
const project = (cam: { p: V3; t: V3; fov: number }, pt: V3, w: number, h: number) => {
  const c = new THREE.PerspectiveCamera(cam.fov, w / h, 0.02, 400); c.position.set(...cam.p); c.lookAt(...cam.t); c.updateMatrixWorld(); c.updateProjectionMatrix();
  const v = new THREE.Vector3(...pt).project(c); return [(v.x + 1) / 2 * w, (1 - v.y) / 2 * h];
};
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

const clampX = (x: number, w: number) => Math.max(40, Math.min(1080 - 40 - w, x));
const clampY = (y: number) => Math.max(560, Math.min(1700, y));

const mirrorTex = () => canvasTex(256, 256, (g) => {
  g.fillStyle = '#12060a'; g.fillRect(0, 0, 256, 256);
  const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, '#2a0a10'); gr.addColorStop(1, '#4a1a1a'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  g.fillStyle = '#1a0c0c'; g.beginPath(); g.moveTo(40, 256); g.lineTo(118, 120); g.lineTo(138, 120); g.lineTo(216, 256); g.fill();
  const lg = g.createRadialGradient(128, 128, 0, 128, 128, 60); lg.addColorStop(0, 'rgba(255,250,235,1)'); lg.addColorStop(0.15, 'rgba(255,240,210,.8)'); lg.addColorStop(1, 'rgba(255,240,210,0)');
  g.fillStyle = lg; g.fillRect(60, 60, 140, 140);
});

export const EP01: React.FC = () => {
  const frame = useCurrentFrame(); const { width, height } = useVideoConfig();
  const gt = frame / FPS;
  const [h] = useState(() => delayRender('fonts')); const [ok, setOk] = useState(false);
  useLayoutEffect(() => { Promise.all(['500 34px Inter', '700 26px Inter', '800 44px Inter', '900 140px Inter'].map((f) => document.fonts.load(f))).then(() => { setOk(true); continueRender(h); }); }, []);
  const tex = useMemo<Tex | null>(() => {
    if (!ok) return null;
    const fog = canvasTex(512, 128, (g) => { const gr = g.createRadialGradient(256, 64, 0, 256, 64, 256); gr.addColorStop(0, 'rgba(150,60,60,.55)'); gr.addColorStop(1, 'rgba(150,60,60,0)'); g.save(); g.scale(1, 0.25); g.fillStyle = gr; g.fillRect(0, 0, 512, 512); g.restore(); });
    const paving = canvasTex(512, 256, (g) => { g.fillStyle = '#5a5f70'; g.fillRect(0, 0, 512, 256); g.strokeStyle = '#3d4150'; g.lineWidth = 4; for (let x = 0; x < 512; x += 64) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 256); g.stroke(); } for (let y = 0; y < 256; y += 64) { g.beginPath(); g.moveTo(0, y); g.lineTo(512, y); g.stroke(); } });
    paving.wrapS = paving.wrapT = THREE.RepeatWrapping;
    const dirt = canvasTex(512, 512, (g) => { const r = rng(11); g.fillStyle = '#3a3532'; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 4000; i++) { const v = 40 + r() * 40; g.fillStyle = `rgb(${v + 6},${v},${v - 4})`; g.fillRect(r() * 512, r() * 512, 3, 3); } });
    dirt.wrapS = dirt.wrapT = THREE.RepeatWrapping;
    const m1 = { text: 'Kak, saya udah di titik jemput. Kakaknya di mana?', time: '00.14' };
    const m2 = { text: 'Kak, saya liat tadi Kakak naik motor orang. Itu bukan saya.', time: '00.17' };
    const m3 = { text: 'Kak, saya ngikutin dari belakang. Liat foto ini.', time: '00.18' };
    return {
      sky: skyTex('#0a0c2a', '#2a2160', '#5a3a7a'), sky1: skylineTex(4, '#0e1024', '#ffcf7a', 0.28), sky2: skylineTex(9, '#1b1a3e', '#d9b070', 0.12, false),
      trees: treesTex(5, '#0b0e1c'), trees2: treesTex(8, '#0d1020'), trees3: treesTex(12, '#120607'), skyRed: skyTex('#120406', '#4a1014', '#7a2020', false, 7), fog,
      asphalt: asphaltTex(1, true), asphalt2: asphaltTex(2, false), paving, dirt,
      plate: plateTex(), badge: badgeTex(), face: faceTex('worried'), faceScared: faceTex('scared'), mirror: mirrorTex(),
      chat1: chatScreen2([m1]), chat2: chatScreen2([m1, m2]), photo: chatScreen2([m3, { photo: true, time: '00.18' }]), map: mapScreen(), info: infoScreen(), order: orderScreen(),
    };
  }, [ok]);
  if (!tex) return null;
  if (gt >= END) return <AbsoluteFill style={{ background: '#000' }} />;

  const shots = shotsJson.shots; const shot = shots.find((s) => gt >= s.start && gt < s.end) ?? shots[shots.length - 1];
  const spec = SPECS[shot.id]; const d = shot.end - shot.start; const lt = gt - shot.start; const u = Math.min(1, lt / d);
  const sx = spec.x ? spec.x(lt, d) : (spec.move ?? 0) * lt;
  const moving = !!spec.move || !!spec.x;
  const base: V3 = [sx, 0, 0];
  const cam = camAt(spec, u, base, gt);
  const r = spec.ride;
  const headlight = spec.headlight ? spec.headlight(lt) : true;
  const headTurn = spec.headTurn ? spec.headTurn(gt, lt) : (r?.headTurn ?? 0);
  const face = r?.face === 'scared' ? tex.faceScared : tex.face;
  const bob = moving ? Math.sin(gt * 40) * 0.004 : 0;
  const grade = spec.grade ?? (spec.set === 'rel' ? 'rel' : spec.set === 'toko' ? 'toko' : 'jalan');

  // label anchor points (world)
  const lab1 = spec.labels ? project(cam, [sx + (spec.follower ?? -13) + 0.7, 1.1, 0], width, height) : null;
  const lab2 = spec.labels && spec.labels >= 2 ? project(cam, [sx - 0.05, 1.55, 0], width, height) : null;
  const pop1 = spec.labels ? (shot.id === 'S33' ? Math.max(0, gt - 68.27) : 1) : 0;
  const pop2 = shot.id === 'S34' ? Math.max(0, gt - 71.95) : 1;

  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <ThreeCanvas width={width} height={height} shadows linear={false}
        onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.15; gl.shadowMap.type = THREE.PCFSoftShadowMap; }}>
        <CamRig p={cam.p} t={cam.t} fov={cam.fov} />
        {spec.set === 'jalan' && <JalanSet tex={tex} />}
        {spec.set === 'toko' && <TokoSet tex={tex} />}
        {spec.set === 'rel' && <RelSet tex={tex} />}
        {r && (
          <group position={[sx, bob, 0]}>
            <Ride plate={tex.plate} face={face} screen={spec.set === 'toko' ? tex.order : spec.set === 'rel' ? tex.chat2 : tex.chat1} headTurn={headTurn} passenger={r.passenger !== false} headDown={r.headDown}
              headlight={headlight} pTurn={r.pTurn} badge={tex.badge} mirrorTex={r.mirror ? tex.mirror : undefined} spin={sx / 0.245} tap={r.tap !== undefined ? Math.abs(Math.sin(lt * 9)) : undefined} />
            <Headlamp on={headlight} />
          </group>
        )}
        {spec.stand && <group position={[0.3, 0.16, -4.6]} rotation={[0, -Math.PI / 2 + 0.25, 0]}><PenumpangBerdiri face={tex.face} screen={tex.order} headDown={0.4} /></group>}
        {spec.follower !== undefined && (
          <group position={[sx + spec.follower, 0, 0.3]}>
            <Ride plate={tex.plate} face={tex.face} passenger={false} dark headlight spin={sx / 0.245} />
            <Headlamp on strength={55} />
            <Glow p={[0.75, 1.1, 0]} color="#fff6e0" size={2.4} opacity={0.9} />
          </group>
        )}
        {spec.pov && <PovHand screen={tex[spec.pov]} z={lerp(spec.povZ![0], spec.povZ![1], ease(u, 'io'))} />}
      </ThreeCanvas>
      <Grade kind={grade} lt={lt} />
      {lab1 && <Label n={1} text="LOMPAT TURUN" at={lab1} box={[clampX(lab1[0] - 170, 470), clampY(lab1[1] - 230)]} color="#FFD23F" pop={pop1} />}
      {lab2 && <Label n={2} text="TETAP PEGANGAN" at={lab2} box={[clampX(lab2[0] - 260, 560), clampY(lab2[1] + 260)]} color="#B48CFF" pop={pop2} />}
      <Captions gt={gt} top={spec.pov ? 250 : 330} />
    </AbsoluteFill>
  );
};

const Grade: React.FC<{ kind: string; lt: number }> = ({ kind, lt }) => (
  <AbsoluteFill style={{ pointerEvents: 'none' }}>
    {kind === 'toko' && <AbsoluteFill style={{ background: 'radial-gradient(ellipse 70% 40% at 50% 55%, rgba(255,140,60,.10), rgba(0,0,0,0) 70%)', mixBlendMode: 'screen' }} />}
    {(kind === 'rel' || kind === 'twist') && <AbsoluteFill style={{ background: 'rgba(255,60,60,.12)', mixBlendMode: 'soft-light' }} />}
    {kind === 'photo' && <AbsoluteFill style={{ boxShadow: 'inset 0 0 0 18px rgba(240,240,240,.9)', background: 'rgba(255,230,210,.06)' }} />}
    {kind === 'twist' && lt < 0.18 && <AbsoluteFill style={{ background: `rgba(255,255,255,${0.7 * (1 - lt / 0.18)})` }} />}
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 75% 60% at 50% 52%, rgba(0,0,0,0) 40%, rgba(5,3,12,${kind === 'rel' || kind === 'twist' ? 0.72 : 0.6}) 100%)` }} />
    <AbsoluteFill style={{ opacity: 0.09, mixBlendMode: 'overlay', backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='300' height='300' filter='url(%23n)'/></svg>\")" }} />
  </AbsoluteFill>
);
