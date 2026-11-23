// Canvas-painted flat sprites + texture loading for SVG sprites.
import * as THREE from 'three';
import { rng } from '../look2/sets2';

// No mipmaps / anisotropy: texture filtering is the main CPU cost under SwiftShader (≈40% faster). Size canvases close to on-screen size.
export const toTex = (c: HTMLCanvasElement) => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 1; t.generateMipmaps = false; t.minFilter = THREE.LinearFilter; return t; };
export const paint = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) => {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d')!); return toTex(c);
};

/** Rasterise an SVG string at `scale` and return a texture (async). */
export const svgTex = (svg: string, scale = 1) => new Promise<THREE.Texture>((res, rej) => {
  const img = new Image();
  img.onload = () => {
    const c = document.createElement('canvas'); c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
    c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height); res(toTex(c));
  };
  img.onerror = () => rej(new Error('svg load failed'));
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
});

const rr = (g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
};

export const glowTex = () => paint(256, 256, (g) => {
  const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.15, 'rgba(255,255,255,.6)'); gr.addColorStop(0.45, 'rgba(255,255,255,.15)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
});

export const blobTex = () => paint(256, 128, (g) => {
  g.save(); g.scale(1, 0.5); const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, 'rgba(0,0,0,.95)'); gr.addColorStop(0.6, 'rgba(0,0,0,.45)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); g.restore();
});

/** Soft light cone (bright at the narrow end = bottom of the texture). */
export const coneTex = () => paint(256, 512, (g) => {
  const lg = g.createLinearGradient(0, 512, 0, 0); lg.addColorStop(0, 'rgba(255,255,255,.95)'); lg.addColorStop(0.5, 'rgba(255,255,255,.3)'); lg.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = lg; g.beginPath(); g.moveTo(112, 512); g.lineTo(144, 512); g.lineTo(256, 0); g.lineTo(0, 0); g.closePath(); g.fill();
});

export const fogTex = (rgb: string) => paint(512, 128, (g) => {
  g.save(); g.scale(1, 0.25); const gr = g.createRadialGradient(256, 256, 0, 256, 256, 256);
  gr.addColorStop(0, `rgba(${rgb},.6)`); gr.addColorStop(1, `rgba(${rgb},0)`); g.fillStyle = gr; g.fillRect(0, 0, 512, 512); g.restore();
});

/** TOKO 24 storefront, flat and lit. 9 m x 5.4 m → 2048x1228. */
export const tokoTex = () => paint(2048, 1228, (g) => {
  const W = 2048, H = 1228, r = rng(7);
  // wall
  const wg = g.createLinearGradient(0, 0, 0, H); wg.addColorStop(0, '#262a3c'); wg.addColorStop(1, '#3a3f55'); g.fillStyle = wg; g.fillRect(60, 120, W - 120, H - 120);
  // sign box
  const sg = g.createLinearGradient(0, 150, 0, 380); sg.addColorStop(0, '#ffb653'); sg.addColorStop(1, '#ff6a00');
  rr(g, 260, 150, 1528, 230, 18); g.fillStyle = sg; g.fill(); g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = 8; g.stroke();
  g.fillStyle = '#fff'; g.font = '900 170px Inter'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('TOKO 24', 940, 272);
  g.font = '800 46px Inter'; g.fillText('BUKA', 1600, 236); g.fillText('24 JAM', 1600, 296);
  // awning
  g.fillStyle = '#1d2030'; g.fillRect(40, 400, W - 80, 36); g.fillStyle = '#ff8a2a'; g.fillRect(40, 432, W - 80, 10);
  // glass front
  const gx = 140, gy = 470, gw = W - 280, gh = 720;
  const gl = g.createLinearGradient(0, gy, 0, gy + gh); gl.addColorStop(0, '#f8fbff'); gl.addColorStop(1, '#c9d6f2'); g.fillStyle = gl; g.fillRect(gx, gy, gw, gh);
  g.fillStyle = '#ffffff'; for (let i = 0; i < 7; i++) g.fillRect(gx + 60 + i * 250, gy + 18, 170, 14);
  const cols = ['#ff6a3d', '#ffd23f', '#3fb6ff', '#7bd36a', '#ff8ad0', '#ffffff', '#c46bff', '#ff9a3c'];
  for (let s = 0; s < 6; s++) {
    if (s === 3) continue; const sx = gx + 40 + s * 290;
    g.fillStyle = '#aeb9d6'; g.fillRect(sx, gy + 120, 240, 560);
    for (let row = 0; row < 5; row++) {
      g.fillStyle = '#8390b2'; g.fillRect(sx, gy + 190 + row * 104, 240, 9);
      for (let k = 0; k < 7; k++) { g.fillStyle = cols[Math.floor(r() * cols.length)]; const h = 40 + r() * 46; g.fillRect(sx + 8 + k * 33, gy + 190 + row * 104 - h, 25, h); }
    }
  }
  // door + posters
  const dx = gx + 3 * 290 + 20; g.fillStyle = 'rgba(140,158,200,.35)'; g.fillRect(dx, gy + 60, 250, gh - 60);
  g.strokeStyle = '#59627e'; g.lineWidth = 12; g.strokeRect(dx, gy + 60, 250, gh - 60); g.beginPath(); g.moveTo(dx + 125, gy + 60); g.lineTo(dx + 125, gy + gh); g.stroke();
  g.fillStyle = '#e8352d'; g.fillRect(dx + 18, gy + 300, 92, 130); g.fillStyle = '#fff'; g.font = '800 30px Inter'; g.textAlign = 'left'; g.fillText('PROMO', dx + 20, gy + 345); g.font = '700 22px Inter'; g.fillText('2 GRATIS 1', dx + 20, gy + 385);
  g.fillStyle = '#ffd23f'; g.fillRect(dx + 140, gy + 310, 92, 110); g.fillStyle = '#222'; g.font = '800 28px Inter'; g.fillText('KOPI', dx + 152, gy + 355); g.fillText('5RB', dx + 156, gy + 395);
  // cashier silhouette
  g.fillStyle = '#5d6b8f'; g.beginPath(); g.arc(gx + 1560, gy + 230, 46, 0, Math.PI * 2); g.fill(); g.fillRect(gx + 1508, gy + 276, 104, 170);
  g.fillStyle = '#8f9ab8'; g.fillRect(gx + 1400, gy + 420, 330, 260);
  // mullions
  g.fillStyle = '#4c5470'; for (let i = 0; i <= 6; i++) g.fillRect(gx + i * (gw / 6) - 7, gy, 14, gh); g.fillRect(gx, gy, gw, 14);
  // pillars
  g.fillStyle = '#2b2f42'; g.fillRect(60, 400, 80, H - 400); g.fillRect(W - 140, 400, 80, H - 400);
  // light bloom on glass
  const bl = g.createRadialGradient(W / 2, gy + gh / 2, 50, W / 2, gy + gh / 2, 900); bl.addColorStop(0, 'rgba(255,255,255,.35)'); bl.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = bl; g.fillRect(0, gy - 100, W, gh + 100);
});

/** Utility pole with cross-arm, insulators, transformer and sagging cables, flat silhouette lit from one side. 600x2400 (1.25 m x 10 m). */
export const poleTex = () => paint(600, 2400, (g) => {
  const pg = g.createLinearGradient(260, 0, 340, 0); pg.addColorStop(0, '#5c6276'); pg.addColorStop(0.5, '#3a3f50'); pg.addColorStop(1, '#1d202b');
  g.fillStyle = pg; g.fillRect(262, 120, 76, 2280);
  g.fillStyle = '#2a2e3c'; g.fillRect(60, 220, 480, 26); g.fillRect(110, 420, 380, 22);
  g.fillStyle = '#c9d0de'; [90, 200, 400, 510].forEach((x) => { g.fillRect(x, 190, 16, 32); }); [140, 460].forEach((x) => g.fillRect(x, 392, 14, 30));
  g.fillStyle = '#4a5064'; g.fillRect(330, 620, 150, 230); g.fillStyle = '#6a7186'; g.fillRect(340, 630, 130, 18);
  g.fillStyle = '#e8e0c8'; g.fillRect(300, 1500, 40, 140); g.fillStyle = '#d23a2a'; g.font = '800 28px Inter'; g.save(); g.translate(330, 1600); g.rotate(-Math.PI / 2); g.fillText('SEDOT WC', -70, 0); g.restore();
  g.strokeStyle = '#151722'; g.lineWidth = 6;
  [98, 208, 408, 518].forEach((x, i) => { g.beginPath(); g.moveTo(x, 200); g.quadraticCurveTo(x < 300 ? -100 : 700, 420 + i * 10, x < 300 ? -200 : 800, 300 + i * 18); g.stroke(); });
});

/** Rail signal post, leaning, red lamp on. 400x1800 (1 m x 4.5 m). */
export const signalTex = () => paint(400, 1800, (g) => {
  g.save(); g.translate(200, 1800); g.rotate(0.05);
  const pg = g.createLinearGradient(-20, 0, 20, 0); pg.addColorStop(0, '#5a3a3a'); pg.addColorStop(1, '#1a0f10'); g.fillStyle = pg; g.fillRect(-18, -1500, 36, 1500);
  rr(g, -80, -1720, 160, 300, 30); g.fillStyle = '#121216'; g.fill();
  g.fillStyle = '#2a0a0a'; g.beginPath(); g.arc(0, -1640, 46, 0, Math.PI * 2); g.fill(); g.beginPath(); g.arc(0, -1510, 46, 0, Math.PI * 2); g.fill();
  const lg = g.createRadialGradient(0, -1640, 0, 0, -1640, 46); lg.addColorStop(0, '#fff0f0'); lg.addColorStop(0.4, '#ff3a3a'); lg.addColorStop(1, '#a00'); g.fillStyle = lg; g.beginPath(); g.arc(0, -1640, 42, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#121216'; g.fillRect(-90, -1700, 180, 22);
  g.restore();
});

/** Dead railway seen as a long ground strip (rails along v). 512x2048. */
export const railTex = () => {
  const t = paint(512, 2048, (g) => {
    const r = rng(21); g.fillStyle = '#2a1c1a'; g.fillRect(0, 0, 512, 2048);
    for (let i = 0; i < 5000; i++) { const v = 30 + r() * 40; g.fillStyle = `rgb(${v + 14},${v},${v - 4})`; g.fillRect(r() * 512, r() * 2048, 4, 4); }
    for (let y = 0; y < 2048; y += 128) { g.fillStyle = '#4a3426'; g.fillRect(40, y + 30, 432, 46); g.fillStyle = '#5e4330'; g.fillRect(40, y + 30, 432, 10); }
    [150, 350].forEach((x) => { g.fillStyle = '#6a4234'; g.fillRect(x - 12, 0, 24, 2048); g.fillStyle = '#d88a70'; g.fillRect(x - 12, 0, 6, 2048); });
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
};

/** Kampung wall (plaster, stains, a gate, a poster). 2048x400 (≈ 10 m x 2 m). */
export const wallTex = (seed: number, base: string) => {
  const t = paint(2048, 400, (g) => {
    const r = rng(seed); g.fillStyle = base; g.fillRect(0, 0, 2048, 400);
    const sh = g.createLinearGradient(0, 0, 0, 400); sh.addColorStop(0, 'rgba(255,255,255,.06)'); sh.addColorStop(1, 'rgba(0,0,0,.35)'); g.fillStyle = sh; g.fillRect(0, 0, 2048, 400);
    g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(0, 0, 2048, 26);
    for (let i = 0; i < 18; i++) { g.fillStyle = `rgba(20,20,30,${0.08 + r() * 0.12})`; const x = r() * 2048; g.fillRect(x, 26, 20 + r() * 60, 120 + r() * 260); }
    for (let i = 0; i < 3; i++) { const x = 200 + i * 680 + r() * 100; g.fillStyle = '#1f2230'; g.fillRect(x, 60, 220, 340); g.strokeStyle = '#4a5068'; g.lineWidth = 6; for (let k = 0; k < 8; k++) { g.beginPath(); g.moveTo(x + 14 + k * 27, 70); g.lineTo(x + 14 + k * 27, 400); g.stroke(); } }
    g.fillStyle = '#d9cfa8'; g.fillRect(1200, 120, 90, 120); g.fillStyle = '#b8322a'; g.fillRect(1206, 130, 78, 26);
  });
  t.wrapS = THREE.RepeatWrapping; return t;
};
