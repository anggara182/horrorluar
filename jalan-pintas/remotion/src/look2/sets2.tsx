// 2D painted layers (sky, kampung skyline, trees) + textured 3D ground and TOKO 24.
import React, { useMemo } from 'react';
import * as THREE from 'three';
import { canvasTex, Glow, Limb, T, rbox, cyl, V3 } from './toon';

export const rng = (seed: number) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

/** Flat painted card in 3D space (unlit). */
export const Card: React.FC<{ tex: THREE.Texture; p: V3; w: number; h: number; ry?: number; opacity?: number; additive?: boolean }> = ({ tex, p, w, h, ry = 0, opacity = 1, additive }) => (
  <mesh position={p} rotation={[0, ry, 0]}>
    <planeGeometry args={[w, h]} />
    <meshBasicMaterial map={tex} transparent opacity={opacity} depthWrite={!additive} fog={false} toneMapped={false}
      blending={additive ? THREE.AdditiveBlending : THREE.NormalBlending} />
  </mesh>
);

export const skyTex = (top: string, mid: string, bottom: string, moon = true, seed = 3) => canvasTex(1024, 1024, (g) => {
  const gr = g.createLinearGradient(0, 0, 0, 1024); gr.addColorStop(0, top); gr.addColorStop(0.6, mid); gr.addColorStop(1, bottom);
  g.fillStyle = gr; g.fillRect(0, 0, 1024, 1024);
  const r = rng(seed); g.fillStyle = 'rgba(255,255,255,.8)';
  for (let i = 0; i < 160; i++) { const s = r() * 2.2; g.globalAlpha = 0.3 + r() * 0.7; g.fillRect(r() * 1024, r() * 600, s, s); }
  g.globalAlpha = 1;
  if (moon) {
    const mg = g.createRadialGradient(760, 220, 0, 760, 220, 260); mg.addColorStop(0, 'rgba(220,230,255,.55)'); mg.addColorStop(1, 'rgba(220,230,255,0)');
    g.fillStyle = mg; g.fillRect(400, 0, 624, 600);
    g.fillStyle = '#eef2ff'; g.beginPath(); g.arc(760, 220, 46, 0, Math.PI * 2); g.fill();
    g.fillStyle = 'rgba(160,170,210,.35)'; g.beginPath(); g.arc(748, 210, 10, 0, Math.PI * 2); g.arc(776, 236, 7, 0, Math.PI * 2); g.fill();
  }
  // soft cloud bands
  for (let i = 0; i < 7; i++) {
    const y = 280 + r() * 380, x = r() * 1024, w = 300 + r() * 400;
    const cg = g.createRadialGradient(x, y, 0, x, y, w / 2); cg.addColorStop(0, 'rgba(120,110,170,.22)'); cg.addColorStop(1, 'rgba(120,110,170,0)');
    g.save(); g.scale(1, 0.25); g.fillStyle = cg; g.beginPath(); g.arc(x, y * 4, w / 2, 0, Math.PI * 2); g.fill(); g.restore();
  }
});

/** Kampung rooftops, water tower, poles and sagging cables, lit windows. */
export const skylineTex = (seed: number, fill: string, win: string, density = 0.25, poles = true) => canvasTex(2048, 512, (g) => {
  const r = rng(seed); g.clearRect(0, 0, 2048, 512);
  g.fillStyle = fill; let x = 0; const wins: [number, number][] = [];
  while (x < 2048) {
    const w = 90 + r() * 170, h = 120 + r() * 170, base = 512, top = base - h, roof = 30 + r() * 50;
    g.beginPath(); g.moveTo(x, base); g.lineTo(x, top); g.lineTo(x + w * 0.5, top - roof); g.lineTo(x + w, top); g.lineTo(x + w, base); g.fill();
    if (r() < 0.35) g.fillRect(x + w * 0.65, top - roof - 40, 10, 40);
    for (let wy = top + 25; wy < base - 40; wy += 46) for (let wx = x + 16; wx < x + w - 30; wx += 40) if (r() < density) wins.push([wx, wy]);
    x += w + r() * 14;
  }
  // water tower
  const tx = 600 + r() * 800; g.fillRect(tx, 150, 8, 230); g.fillRect(tx + 52, 150, 8, 230); g.fillRect(tx - 14, 110, 88, 52);
  for (const [wx, wy] of wins) { g.fillStyle = win; g.globalAlpha = 0.55 + r() * 0.45; g.fillRect(wx, wy, 18, 22); }
  g.globalAlpha = 1;
  if (poles) {
    g.fillStyle = fill; g.strokeStyle = fill; g.lineWidth = 3;
    const px = [180, 720, 1260, 1800];
    px.forEach((p) => { g.fillRect(p, 20, 10, 492); g.fillRect(p - 40, 40, 90, 8); });
    for (let k = 0; k < 3; k++) for (let i = 0; i < px.length - 1; i++) {
      g.beginPath(); g.moveTo(px[i] - 30 + k * 35, 44); g.quadraticCurveTo((px[i] + px[i + 1]) / 2, 110 + k * 8, px[i + 1] - 30 + k * 35, 44); g.stroke();
    }
  }
});

export const treesTex = (seed: number, fill: string) => canvasTex(2048, 512, (g) => {
  const r = rng(seed); g.fillStyle = fill;
  for (let i = 0; i < 14; i++) {
    const x = r() * 2048, h = 240 + r() * 200, base = 512;
    g.fillRect(x - 7, base - h, 14, h);
    for (let k = 0; k < 7; k++) {
      const a = -Math.PI / 2 + (k - 3) * 0.45 + (r() - 0.5) * 0.3, L = 120 + r() * 90;
      g.save(); g.translate(x, base - h); g.rotate(a);
      g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(L * 0.5, -32, L, 6); g.quadraticCurveTo(L * 0.5, 22, 0, 0); g.fill();
      g.restore();
    }
  }
  g.fillRect(0, 470, 2048, 42);
});

export const asphaltTex = (seed: number, lines: boolean) => {
  const t = canvasTex(1024, 1024, (g) => {
    const r = rng(seed); g.fillStyle = '#2b2d36'; g.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 9000; i++) { const v = 30 + r() * 40; g.fillStyle = `rgb(${v},${v + 2},${v + 8})`; g.fillRect(r() * 1024, r() * 1024, 2, 2); }
    g.fillStyle = 'rgba(15,16,22,.45)'; for (let i = 0; i < 6; i++) { g.beginPath(); g.ellipse(r() * 1024, r() * 1024, 60 + r() * 120, 30 + r() * 60, r() * 3, 0, Math.PI * 2); g.fill(); }
    g.strokeStyle = 'rgba(12,12,18,.8)'; g.lineWidth = 3;
    for (let i = 0; i < 8; i++) { let x = r() * 1024, y = r() * 1024; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 6; k++) { x += (r() - 0.5) * 80; y += r() * 60; g.lineTo(x, y); } g.stroke(); }
    if (lines) { g.fillStyle = 'rgba(225,222,205,.75)'; for (let y = 0; y < 1024; y += 256) g.fillRect(500, y, 24, 150); }
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
};

export const Ground: React.FC<{ tex: THREE.Texture; w: number; d: number; rep: [number, number]; p?: V3; ry?: number; color?: string }> = ({ tex, w, d, rep, p = [0, 0, 0], ry = 0, color = '#ffffff' }) => {
  const t = useMemo(() => { const c = tex.clone(); c.repeat.set(rep[0], rep[1]); c.needsUpdate = true; return c; }, [tex]);
  return (
    <mesh position={p} rotation={[-Math.PI / 2, 0, ry]} receiveShadow>
      <planeGeometry args={[w, d]} /><meshStandardMaterial map={t} color={color} roughness={0.85} metalness={0.05} />
    </mesh>
  );
};

/** TOKO 24 storefront, front faces +z. Width 7 m. */
export const Toko24: React.FC<{ p: V3; ry?: number }> = ({ p, ry = 0 }) => {
  const sign = useMemo(() => canvasTex(1024, 220, (g) => {
    const gr = g.createLinearGradient(0, 0, 0, 220); gr.addColorStop(0, '#ffb04a'); gr.addColorStop(1, '#ff6a00'); g.fillStyle = gr; g.fillRect(0, 0, 1024, 220);
    g.fillStyle = '#fff'; g.font = '900 140px Inter'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('TOKO 24', 470, 112);
    g.font = '700 34px Inter'; g.fillText('BUKA', 900, 90); g.fillText('24 JAM', 900, 134);
    g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 6; g.strokeRect(14, 14, 996, 192);
  }), []);
  const front = useMemo(() => canvasTex(2048, 900, (g) => {
    const r = rng(7);
    g.fillStyle = '#eaf0ff'; g.fillRect(0, 0, 2048, 900);
    const lg = g.createLinearGradient(0, 0, 0, 900); lg.addColorStop(0, 'rgba(255,255,255,.9)'); lg.addColorStop(1, 'rgba(200,215,245,.2)'); g.fillStyle = lg; g.fillRect(0, 0, 2048, 900);
    // ceiling lamps
    g.fillStyle = '#ffffff'; for (let i = 0; i < 6; i++) g.fillRect(120 + i * 330, 40, 200, 16);
    // shelves with products
    const cols = ['#ff6a3d', '#ffd23f', '#3fb6ff', '#7bd36a', '#ff8ad0', '#ffffff', '#c46bff'];
    for (let s = 0; s < 5; s++) {
      const sx = 60 + s * 400; if (s === 2) continue;
      g.fillStyle = '#b8c2db'; g.fillRect(sx, 180, 320, 560);
      for (let row = 0; row < 5; row++) {
        g.fillStyle = '#8f9ab8'; g.fillRect(sx, 240 + row * 105, 320, 10);
        for (let k = 0; k < 9; k++) { g.fillStyle = cols[Math.floor(r() * cols.length)]; const h = 40 + r() * 45; g.fillRect(sx + 8 + k * 34, 240 + row * 105 - h, 26, h); }
      }
    }
    // door (centre) with posters
    g.fillStyle = 'rgba(160,175,210,.35)'; g.fillRect(860, 150, 330, 750);
    g.strokeStyle = '#59627e'; g.lineWidth = 14; g.strokeRect(860, 150, 330, 750); g.beginPath(); g.moveTo(1025, 150); g.lineTo(1025, 900); g.stroke();
    g.fillStyle = '#e8352d'; g.fillRect(890, 420, 110, 150); g.fillStyle = '#fff'; g.font = '800 34px Inter'; g.fillText('PROMO', 896, 470); g.font = '700 26px Inter'; g.fillText('2 GRATIS 1', 893, 510);
    g.fillStyle = '#ffd23f'; g.fillRect(1050, 430, 110, 120); g.fillStyle = '#222'; g.font = '800 28px Inter'; g.fillText('KOPI', 1070, 480); g.fillText('5RB', 1072, 520);
    // window mullions
    g.fillStyle = '#59627e'; [0, 440, 1210, 1640, 2040].forEach((x) => g.fillRect(x, 0, 14, 900)); g.fillRect(0, 0, 2048, 14);
    // cashier silhouette
    g.fillStyle = '#5d6b8f'; g.beginPath(); g.arc(1460, 330, 40, 0, Math.PI * 2); g.fill(); g.fillRect(1415, 370, 90, 160); g.fillStyle = '#8f9ab8'; g.fillRect(1300, 500, 330, 240);
  }), []);
  const wall = '#3a3f50';
  return (
    <group position={p} rotation={[0, ry, 0]}>
      <T g={rbox(7.4, 3.6, 4, 0.05)} p={[0, 1.8, -2]} color={wall} outline={0} />
      <mesh position={[0, 1.35, 0.02]}><planeGeometry args={[6.4, 2.6]} /><meshBasicMaterial map={front} toneMapped={false} /></mesh>
      <T g={rbox(7.6, 0.12, 1.2, 0.03)} p={[0, 2.78, 0.6]} color="#2b2f3c" outline={0} />
      <mesh position={[0, 3.25, 0.06]}><planeGeometry args={[5.4, 1.16]} /><meshBasicMaterial map={sign} toneMapped={false} /></mesh>
      <Glow p={[0, 3.25, 0.5]} color="#ff7a1a" size={7.5} opacity={0.4} />
      <Glow p={[0, 1.4, 0.6]} color="#dfe8ff" size={7} opacity={0.3} />
      <T g={rbox(7.6, 0.16, 2.4, 0.03)} p={[0, 0.08, 1.2]} color="#4b5063" outline={0} />
      {[-3.6, 3.6].map((x) => <T key={x} g={rbox(0.3, 3.6, 0.3, 0.03)} p={[x, 1.8, 0.1]} color={wall} outline={0} />)}
      <pointLight position={[0, 1.6, 1.6]} color="#e8eeff" intensity={22} distance={14} decay={1.2} />
      <pointLight position={[0, 3.2, 1.2]} color="#ff7a1a" intensity={16} distance={12} decay={1.3} />
    </group>
  );
};

export const StreetLamp: React.FC<{ p: V3; ry?: number; color?: string; on?: boolean }> = ({ p, ry = 0, color = '#ffd9a0', on = true }) => (
  <group position={p} rotation={[0, ry, 0]}>
    <T g={cyl(0.07, 0.1, 6.5)} p={[0, 3.25, 0]} color="#4b505e" outline={0.01} />
    <Limb a={[0, 6.2, 0]} b={[0, 6.4, 1.3]} r={0.04} color="#4b505e" outline={0.008} />
    <T g={rbox(0.25, 0.1, 0.5, 0.03)} p={[0, 6.35, 1.35]} color="#30333d" outline={0.008} />
    {on && <>
      <mesh position={[0, 6.29, 1.35]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[0.2, 0.4]} /><meshBasicMaterial color="#fff3d8" side={THREE.DoubleSide} toneMapped={false} /></mesh>
      <Glow p={[0, 6.2, 1.35]} color={color} size={2.4} opacity={0.6} />
    </>}
  </group>
);
