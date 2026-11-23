// Scooter + riders, cel-shaded with ink. Built in PROFILE space: x = forward, y = up, z = right/left.
import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Blob, canvasTex, capsule, cyl, Glow, Limb, outlineMat, profile, rbox, sphere, T, torus, toonRamp, V3 } from './toon';

export const K = {
  body: '#e3e5ea', trim: '#3b3f4a', seat: '#1b1c22', chrome: '#b9c0cc', rubber: '#16171b',
  jaket: '#6b3fd0', jaketGelap: '#4c2a9c', stripe: '#dfe3ec', helm: '#7b3fe4', celana: '#2a2c38', sepatu: '#121218',
  kulit: '#9a6443', rambut: '#1b130f', seragam: '#ff8a2a', seragamGelap: '#d9661a', jeans: '#2f4a78', ransel: '#59606e', helmP: '#3d4a66',
};

const Wheel: React.FC<{ x: number; spin?: number }> = ({ x, spin = 0 }) => (
  <group position={[x, 0.245, 0]} rotation={[0, 0, -spin]}>
    <T g={torus(0.18, 0.065)} color={K.rubber} outline={0.01} />
    <T g={cyl(0.125, 0.125, 0.07)} r={[Math.PI / 2, 0, 0]} color={K.chrome} outline={0.006} />
    <T g={cyl(0.04, 0.04, 0.12)} r={[Math.PI / 2, 0, 0]} color={K.trim} outline={0} />
    {[0, 1, 2, 3, 4].map((i) => <T key={i} g={rbox(0.1, 0.022, 0.03, 0.008)} p={[Math.cos(i * 1.2566) * 0.07, Math.sin(i * 1.2566) * 0.07, 0]} r={[0, 0, i * 1.2566]} color="#8e96a4" outline={0} />)}
  </group>
);

export const plateTex = () => canvasTex(512, 160, (g) => {
  g.fillStyle = '#0d0d10'; g.fillRect(0, 0, 512, 160); g.strokeStyle = '#ddd'; g.lineWidth = 8; g.strokeRect(8, 8, 496, 144);
  g.fillStyle = '#f2f2f2'; g.font = '800 92px Inter'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('B 4217 KZ', 256, 84);
});

export const Scooter: React.FC<{ plate: THREE.Texture; headlight?: boolean; dark?: boolean; mirrorTex?: THREE.Texture; spin?: number }> = ({ plate, headlight = true, dark = false, mirrorTex, spin = 0 }) => {
  const BODY = dark ? '#2b2e38' : K.body;
  const cowl = profile('cowl', [[-0.12, 0.34], [-0.16, 0.64], [-0.45, 0.68], [-0.78, 0.72], [-0.9, 0.62], [-0.93, 0.52], [-0.8, 0.52], [-0.55, 0.5], [-0.3, 0.42], [-0.18, 0.34], [-0.12, 0.34]], 0.36, 0.035);
  const shield = profile('shield', [[0.2, 0.3], [0.25, 0.6], [0.3, 0.86], [0.34, 1.02], [0.44, 1.04], [0.53, 1.0], [0.5, 0.8], [0.46, 0.5], [0.4, 0.32], [0.3, 0.26], [0.2, 0.3]], 0.38, 0.03);
  const seat = profile('seat', [[-0.05, 0.66], [-0.1, 0.77], [-0.3, 0.77], [-0.6, 0.78], [-0.79, 0.72], [-0.83, 0.66], [-0.72, 0.655], [-0.4, 0.645], [-0.05, 0.66]], 0.3, 0.04);
  const fender = profile('fender', [[0.48, 0.47], [0.64, 0.56], [0.82, 0.46], [0.8, 0.43], [0.64, 0.51], [0.5, 0.44], [0.48, 0.47]], 0.15, 0.015);
  return (
    <group>
      <Blob p={[0, 0.01, 0]} s={[2.0, 0.8]} opacity={0.7} />
      <Wheel x={0.64} spin={spin} /><Wheel x={-0.64} spin={spin} />
      <T g={cowl} color={BODY} />
      <T g={shield} color={BODY} />
      <T g={seat} color={K.seat} />
      <T g={fender} color={BODY} outline={0.008} />
      <T g={rbox(0.5, 0.07, 0.3, 0.02)} p={[0.02, 0.31, 0]} color={K.trim} />
      <T g={rbox(0.42, 0.16, 0.22, 0.04)} p={[-0.42, 0.33, 0]} color="#4a4e5a" />
      <T g={cyl(0.045, 0.035, 0.42)} p={[-0.62, 0.3, 0.17]} r={[0, 0, Math.PI / 2 - 0.15]} color={K.chrome} outline={0.006} />
      {[-0.07, 0.07].map((z) => <Limb key={z} a={[0.64, 0.25, z]} b={[0.5, 0.95, z]} r={0.022} color={K.chrome} outline={0.006} />)}
      {/* headset + headlight */}
      <T g={sphere(0.1)} s={[1.45, 0.85, 1.6]} p={[0.5, 1.1, 0]} color={BODY} />
      <mesh position={[0.635, 1.1, 0]} scale={[0.35, 0.55, 1]}>
        <sphereGeometry args={[0.07, 24, 16]} /><meshBasicMaterial color={headlight ? '#fffbe8' : '#3a3c44'} toneMapped={false} />
      </mesh>
      {headlight && <Glow p={[0.68, 1.1, 0]} color="#fff2cc" size={0.9} opacity={0.95} />}
      {/* handlebar, grips, mirrors */}
      <Limb a={[0.46, 1.13, -0.32]} b={[0.46, 1.13, 0.32]} r={0.016} color={K.trim} outline={0.006} />
      {[-1, 1].map((s) => (
        <group key={s}>
          <Limb a={[0.46, 1.13, 0.27 * s]} b={[0.46, 1.13, 0.35 * s]} r={0.024} color={K.rubber} outline={0.006} />
          <Limb a={[0.46, 1.14, 0.22 * s]} b={[0.42, 1.33, 0.27 * s]} r={0.008} color={K.trim} outline={0.004} />
          <T g={sphere(0.05)} s={[0.35, 0.8, 1.25]} p={[0.42, 1.36, 0.28 * s]} color="#2a2e38" outline={0.006} />
          <mesh position={[0.396, 1.36, 0.28 * s]} rotation={[0, -Math.PI / 2, 0]} scale={[1.25, 0.8, 1]}>
            <circleGeometry args={[0.045, 24]} />{mirrorTex && s === 1 ? <meshBasicMaterial map={mirrorTex} toneMapped={false} /> : <meshStandardMaterial color="#9fb6e0" metalness={0.9} roughness={0.08} />}
          </mesh>
          <mesh position={[-0.9, 0.6, 0.15 * s]}><sphereGeometry args={[0.02, 12, 8]} /><meshBasicMaterial color="#ffae3a" /></mesh>
        </group>
      ))}
      {/* grab rail, taillight, plate */}
      {[-1, 1].map((s) => <Limb key={s} a={[-0.58, 0.74, 0.16 * s]} b={[-0.84, 0.72, 0.13 * s]} r={0.012} color={K.chrome} outline={0.005} />)}
      <T g={rbox(0.05, 0.07, 0.22, 0.015)} p={[-0.915, 0.6, 0]} color="#ff2a2a" emissive="#ff1f1f" ei={2.5} outline={0.006} />
      <Glow p={[-0.97, 0.6, 0]} color="#ff2020" size={0.6} opacity={0.8} />
      <mesh position={[-0.905, 0.45, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[0.28, 0.088]} /><meshBasicMaterial map={plate} toneMapped={false} />
      </mesh>
    </group>
  );
};

// ---------- faces (2D on 3D) ----------
export const faceTex = (mood: 'worried' | 'scared') => canvasTex(512, 512, (g) => {
  g.lineCap = 'round'; g.lineJoin = 'round';
  // hair fringe
  g.fillStyle = K.rambut; g.beginPath(); g.moveTo(40, 40); g.quadraticCurveTo(256, 0, 470, 40); g.lineTo(470, 120);
  for (let i = 0; i < 8; i++) { const x = 470 - i * 54; g.quadraticCurveTo(x - 20, 170, x - 54, 118); }
  g.closePath(); g.fill();
  const eye = (x: number) => {
    g.fillStyle = '#fbf7f2'; g.beginPath(); g.ellipse(x, 268, 34, mood === 'scared' ? 44 : 38, 0, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#1a1010'; g.lineWidth = 7; g.stroke();
    g.fillStyle = '#1a1010'; g.beginPath(); g.arc(x + 9, 282, mood === 'scared' ? 11 : 16, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#fff'; g.beginPath(); g.arc(x + 4, 274, 5, 0, Math.PI * 2); g.fill();
  };
  eye(190); eye(322);
  g.strokeStyle = '#2a170f'; g.lineWidth = 13;
  g.beginPath(); g.moveTo(140, 212); g.quadraticCurveTo(180, 214, 222, 190); g.stroke();
  g.beginPath(); g.moveTo(290, 190); g.quadraticCurveTo(332, 214, 372, 212); g.stroke();
  g.strokeStyle = '#6e3f27'; g.lineWidth = 7; g.beginPath(); g.moveTo(262, 300); g.quadraticCurveTo(252, 336, 270, 344); g.stroke();
  g.strokeStyle = '#3a1712'; g.lineWidth = 9; g.beginPath();
  if (mood === 'scared') { g.fillStyle = '#3a1712'; g.ellipse(258, 396, 22, 28, 0, 0, Math.PI * 2); g.fill(); }
  else { g.moveTo(224, 398); g.quadraticCurveTo(240, 386, 258, 398); g.quadraticCurveTo(276, 410, 292, 396); g.stroke(); }
  g.fillStyle = 'rgba(210,90,80,.25)'; g.beginPath(); g.ellipse(150, 340, 34, 18, 0, 0, Math.PI * 2); g.ellipse(362, 340, 34, 18, 0, 0, Math.PI * 2); g.fill();
  // sweat drop
  g.fillStyle = '#bfe4ff'; g.strokeStyle = '#1a1010'; g.lineWidth = 5; g.beginPath(); g.moveTo(420, 200); g.quadraticCurveTo(446, 250, 420, 262); g.quadraticCurveTo(394, 250, 420, 200); g.fill(); g.stroke();
});

/** Head facing +x with a drawn face on the front. */
const Head: React.FC<{ face: THREE.Texture; r?: number }> = ({ face, r = 0.135 }) => (
  <group>
    <T g={sphere(r)} color={K.kulit} outline={0.009} />
    <mesh scale={1.012}>
      <sphereGeometry args={[r, 40, 28, Math.PI - 1.05, 2.1, 0.55, 1.45]} />
      <meshToonMaterial map={face} transparent gradientMap={toonRamp()} />
    </mesh>
    {/* back hair */}
    <mesh scale={1.03}><sphereGeometry args={[r, 32, 20, -1.35, 2.7, 0.3, 1.95]} /><meshToonMaterial color={K.rambut} gradientMap={toonRamp()} /></mesh>
  </group>
);

/** Full-face helmet facing +x: shell, dark visor with a painted glint, purple pin dot. */
const FullHelmet: React.FC = () => (
  <group>
    <T g={sphere(0.165)} s={[1.12, 1.05, 1.0]} color={K.helm} outline={0.012} />
    <T g={rbox(0.1, 0.025, 0.12, 0.012)} p={[0.03, 0.17, 0]} color={K.jaketGelap} outline={0.006} />
    <mesh scale={[1.125, 1.055, 1.005]}>
      <sphereGeometry args={[0.166, 40, 24, Math.PI - 0.95, 1.9, 0.92, 0.82]} />
      <meshStandardMaterial color="#05050a" roughness={0.1} metalness={0.7} />
    </mesh>
    <mesh scale={[1.125, 1.055, 1.005]} material={outlineMat(0.006)}><sphereGeometry args={[0.166, 40, 24, Math.PI - 0.95, 1.9, 0.92, 0.82]} /></mesh>
    {/* painted glint stroke on the visor */}
    <mesh position={[0.168, 0.06, -0.06]} rotation={[0.2, Math.PI / 2, 0.5]}><planeGeometry args={[0.07, 0.012]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.85} /></mesh>
    <mesh position={[0.187, 0.015, 0.045]}><sphereGeometry args={[0.009, 12, 8]} /><meshBasicMaterial color="#e6d6ff" /></mesh>
    <Glow p={[0.2, 0.015, 0.045]} color="#8a4dff" size={0.18} opacity={1} />
  </group>
);

/** Si Pengendara. headTurn rotates the helmet around y (Math.PI = facing backwards). */
export const badgeTex = () => canvasTex(256, 96, (g) => { g.fillStyle = '#f4f0ff'; g.fillRect(0, 0, 256, 96); g.fillStyle = '#7b3fe4'; g.fillRect(0, 0, 256, 22); g.fillStyle = '#1a1030'; g.font = '900 50px Inter'; g.textAlign = 'center'; g.fillText('JUNED', 128, 76); });

export const Pengendara: React.FC<{ headTurn?: number; badge?: THREE.Texture }> = ({ headTurn = 0, badge }) => (
  <group>
    <T g={rbox(0.26, 0.16, 0.3, 0.06)} p={[-0.12, 0.84, 0]} color={K.celana} />
    <group position={[-0.08, 1.12, 0]} rotation={[0, 0, -0.2]}>
      <T g={capsule(0.16, 0.3)} s={[0.9, 1, 1.18]} color={K.jaket} />
      {[-0.07, 0.07].map((y) => <T key={y} g={cyl(0.149, 0.149, 0.03)} s={[0.9, 1, 1.18]} p={[0, y, 0]} color={K.stripe} emissive="#b9c2d6" ei={0.25} outline={0.006} />)}
      <T g={torus(0.085, 0.028)} p={[0.0, 0.29, 0]} r={[Math.PI / 2, 0, 0]} color={K.jaketGelap} outline={0.006} />
      {badge && <mesh position={[0.147, 0.13, 0.07]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[0.1, 0.0375]} /><meshBasicMaterial map={badge} toneMapped={false} /></mesh>}
    </group>
    <Limb a={[-0.04, 1.36, 0]} b={[-0.02, 1.42, 0]} r={0.05} color={K.kulit} />
    <group position={[-0.01, 1.53, 0]} rotation={[0, headTurn, 0]}><FullHelmet /></group>
    {[-1, 1].map((s) => (
      <group key={s}>
        <Limb a={[-0.05, 1.31, 0.2 * s]} b={[0.17, 1.15, 0.27 * s]} r={0.056} color={K.jaket} />
        <Limb a={[0.17, 1.15, 0.27 * s]} b={[0.4, 1.13, 0.3 * s]} r={0.048} color={K.jaket} />
        <T g={cyl(0.052, 0.052, 0.02)} p={[0.08, 1.2, 0.245 * s]} r={[0, 0, 1.2]} color={K.stripe} outline={0.004} />
        <T g={sphere(0.048)} p={[0.45, 1.13, 0.3 * s]} s={[1.2, 0.9, 1]} color="#15151b" />
        <Limb a={[-0.12, 0.83, 0.1 * s]} b={[0.2, 0.86, 0.15 * s]} r={0.07} color={K.celana} />
        <Limb a={[0.2, 0.86, 0.15 * s]} b={[0.18, 0.42, 0.14 * s]} r={0.06} color={K.celana} />
        <T g={rbox(0.22, 0.08, 0.1, 0.03)} p={[0.24, 0.37, 0.14 * s]} color={K.sepatu} />
      </group>
    ))}
  </group>
);

export const Phone: React.FC<{ screen?: THREE.Texture; p?: V3; r?: V3; s?: number }> = ({ screen, p = [0, 0, 0], r = [0, 0, 0], s = 1 }) => (
  <group position={p} rotation={r} scale={s}>
    <T g={rbox(0.075, 0.155, 0.009, 0.004)} color="#15161c" outline={0.003} />
    <mesh position={[0, 0, 0.0048]}><planeGeometry args={[0.068, 0.146]} />{screen ? <meshBasicMaterial map={screen} toneMapped={false} /> : <meshBasicMaterial color="#7b3fe4" />}</mesh>
  </group>
);

/** Kamu. Left hand on the driver's waist, right hand holds the phone. */
export const Penumpang: React.FC<{ face: THREE.Texture; screen?: THREE.Texture; headTurn?: number; headDown?: number; tap?: number }> = ({ face, screen, headTurn = 0, headDown = 0.35, tap }) => (
  <group>
    <T g={rbox(0.26, 0.15, 0.3, 0.06)} p={[-0.53, 0.85, 0]} color={K.jeans} />
    <group position={[-0.52, 1.13, 0]} rotation={[0, 0, -0.08]}>
      <T g={capsule(0.15, 0.28)} s={[0.9, 1, 1.15]} color={K.seragam} />
      <T g={torus(0.08, 0.026)} p={[0, 0.27, 0]} r={[Math.PI / 2, 0, 0]} color={K.seragamGelap} outline={0.006} />
      {/* backpack + straps */}
      <T g={rbox(0.14, 0.34, 0.28, 0.05)} p={[-0.2, -0.01, 0]} color={K.ransel} />
      <T g={rbox(0.05, 0.16, 0.2, 0.02)} p={[-0.28, -0.07, 0]} color="#4a505e" outline={0.006} />
      {[-1, 1].map((s) => <Limb key={s} a={[-0.13, 0.2, 0.1 * s]} b={[0.11, -0.05, 0.12 * s]} r={0.015} color="#3a3f4c" outline={0.004} />)}
    </group>
    <Limb a={[-0.5, 1.36, 0]} b={[-0.49, 1.4, 0]} r={0.048} color={K.kulit} />
    <group position={[-0.48, 1.5, 0]} rotation={[0, headTurn, -headDown]}>
      <Head face={face} />
      <mesh scale={[1.08, 1.04, 1.08]} position={[-0.005, 0.02, 0]}>
        <sphereGeometry args={[0.135, 36, 18, 0, Math.PI * 2, 0, Math.PI * 0.4]} /><meshToonMaterial color={K.helmP} gradientMap={toonRamp()} side={THREE.DoubleSide} />
      </mesh>
      <mesh scale={[1.08, 1.04, 1.08]} position={[-0.005, 0.02, 0]} material={outlineMat(0.008)}><sphereGeometry args={[0.135, 36, 18, 0, Math.PI * 2, 0, Math.PI * 0.4]} /></mesh>
      <T g={rbox(0.09, 0.014, 0.2, 0.006)} p={[0.13, 0.065, 0]} r={[0, 0, -0.25]} color={K.helmP} outline={0.005} />
    </group>
    {/* left arm to the driver's waist */}
    {tap === undefined ? <>
      <Limb a={[-0.48, 1.3, -0.19]} b={[-0.36, 1.1, -0.24]} r={0.05} color={K.seragam} />
      <Limb a={[-0.36, 1.1, -0.24]} b={[-0.21, 1.04, -0.2]} r={0.042} color={K.kulit} />
    </> : <>
      <Limb a={[-0.48, 1.3, -0.19]} b={[-0.33, 1.24, -0.3]} r={0.05} color={K.seragam} />
      <Limb a={[-0.33, 1.24, -0.3]} b={[-0.13, 1.36 + tap * 0.05, -0.21]} r={0.042} color={K.kulit} />
      <T g={sphere(0.045)} s={[1.3, 0.7, 1]} p={[-0.11, 1.37 + tap * 0.05, -0.2]} color={K.kulit} outline={0.004} />
    </>}
    {/* right arm holding the phone */}
    <Limb a={[-0.48, 1.3, 0.19]} b={[-0.38, 1.08, 0.22]} r={0.05} color={K.seragam} />
    <Limb a={[-0.38, 1.08, 0.22]} b={[-0.29, 1.19, 0.08]} r={0.042} color={K.kulit} />
    <Phone screen={screen} p={[-0.27, 1.23, 0.06]} r={[0, -Math.PI / 2 + 0.3, 0.9]} s={0.85} />
    {[-1, 1].map((s) => (
      <group key={s}>
        <Limb a={[-0.53, 0.85, 0.1 * s]} b={[-0.25, 0.87, 0.19 * s]} r={0.068} color={K.jeans} />
        <Limb a={[-0.25, 0.87, 0.19 * s]} b={[-0.3, 0.46, 0.22 * s]} r={0.058} color={K.jeans} />
        <T g={rbox(0.2, 0.08, 0.1, 0.03)} p={[-0.25, 0.41, 0.22 * s]} color="#ecebe6" />
      </group>
    ))}
  </group>
);

/** Kamu standing (flashback at TOKO 24), facing +x, phone in the right hand. */
export const PenumpangBerdiri: React.FC<{ face: THREE.Texture; screen?: THREE.Texture; headDown?: number }> = ({ face, screen, headDown = 0.35 }) => (
  <group>
    <Blob p={[0, 0.01, 0]} s={[0.7, 0.5]} opacity={0.6} />
    <T g={rbox(0.24, 0.16, 0.3, 0.06)} p={[0, 0.98, 0]} color={K.jeans} />
    <group position={[0, 1.27, 0]}>
      <T g={capsule(0.15, 0.3)} s={[0.85, 1, 1.15]} color={K.seragam} />
      <T g={torus(0.08, 0.026)} p={[0, 0.28, 0]} r={[Math.PI / 2, 0, 0]} color={K.seragamGelap} outline={0.006} />
      <T g={rbox(0.14, 0.34, 0.28, 0.05)} p={[-0.2, 0, 0]} color={K.ransel} />
      {[-1, 1].map((s) => <Limb key={s} a={[-0.12, 0.21, 0.1 * s]} b={[0.1, -0.05, 0.12 * s]} r={0.015} color="#3a3f4c" outline={0.004} />)}
    </group>
    <Limb a={[0, 1.5, 0]} b={[0, 1.55, 0]} r={0.048} color={K.kulit} />
    <group position={[0.01, 1.65, 0]} rotation={[0, 0, -headDown]}><Head face={face} /></group>
    <Limb a={[0, 1.44, -0.19]} b={[0.02, 1.16, -0.22]} r={0.05} color={K.seragam} />
    <Limb a={[0.02, 1.16, -0.22]} b={[0.04, 0.92, -0.2]} r={0.042} color={K.kulit} />
    <Limb a={[0, 1.44, 0.19]} b={[0.06, 1.18, 0.22]} r={0.05} color={K.seragam} />
    <Limb a={[0.06, 1.18, 0.22]} b={[0.2, 1.28, 0.1]} r={0.042} color={K.kulit} />
    <Phone screen={screen} p={[0.23, 1.32, 0.08]} r={[0, -Math.PI / 2 + 0.35, 0.95]} s={0.85} />
    {[-1, 1].map((s) => (
      <group key={s}>
        <Limb a={[0, 0.95, 0.1 * s]} b={[0.01, 0.52, 0.11 * s]} r={0.068} color={K.jeans} />
        <Limb a={[0.01, 0.52, 0.11 * s]} b={[0, 0.1, 0.11 * s]} r={0.058} color={K.jeans} />
        <T g={rbox(0.22, 0.08, 0.1, 0.03)} p={[0.05, 0.05, 0.11 * s]} color="#ecebe6" />
      </group>
    ))}
  </group>
);

/** Scooter + both riders, in profile space. */
export const Ride: React.FC<{ plate: THREE.Texture; face: THREE.Texture; screen?: THREE.Texture; headTurn?: number; passenger?: boolean; headDown?: number;
  headlight?: boolean; dark?: boolean; mirrorTex?: THREE.Texture; spin?: number; badge?: THREE.Texture; driver?: boolean; tap?: number; pTurn?: number }> =
  ({ plate, face, screen, headTurn = 0, passenger = true, headDown, headlight = true, dark, mirrorTex, spin, badge, driver = true, tap, pTurn = 0 }) => (
    <group>
      <Scooter plate={plate} headlight={headlight} dark={dark} mirrorTex={mirrorTex} spin={spin} />
      {driver && <Pengendara headTurn={headTurn} badge={badge} />}
      {passenger && <Penumpang face={face} screen={screen} headDown={headDown} tap={tap} headTurn={pTurn} />}
    </group>
  );
