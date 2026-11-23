// JALANIN app screens (fictional). Drawn on a 720x1550 canvas, used as a phone texture.
import * as THREE from 'three';

const UNGU = '#7B3FE4', MUDA = '#C7A8FF', OR = '#FF7A1A';
const W = 720, H = 1550;

const round = (g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
};
const wrap = (g: CanvasRenderingContext2D, text: string, maxW: number) => {
  const out: string[] = []; let line = '';
  for (const w of text.split(' ')) { const t = line ? line + ' ' + w : w; if (g.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t; }
  if (line) out.push(line); return out;
};
const make = (draw: (g: CanvasRenderingContext2D) => void) => {
  const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d')!;
  g.fillStyle = '#0f1020'; g.fillRect(0, 0, W, H);
  g.fillStyle = '#cfd2e6'; g.font = '600 28px Inter'; g.fillText('00.14', 40, 52); g.fillText('▮▮▮  62%', 540, 52);
  g.fillStyle = UNGU; g.fillRect(0, 80, W, 130); g.fillStyle = '#fff'; g.font = '800 46px Inter'; g.fillText('JALANIN', 40, 162);
  draw(g);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
};

const miniMap = (g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, big = false) => {
  round(g, x, y, w, h, 28); g.fillStyle = '#1a1d33'; g.fill();
  g.save(); round(g, x, y, w, h, 28); g.clip();
  g.strokeStyle = '#2c3152'; g.lineWidth = big ? 34 : 24;
  const L: [number, number, number, number][] = [[0, 0.15, 1, 0.4], [0.1, 1, 0.75, 0], [0.55, 0, 0.6, 1], [0, 0.7, 1, 0.78]];
  for (const [a, b, c, d] of L) { g.beginPath(); g.moveTo(x + a * w, y + b * h); g.lineTo(x + c * w, y + d * h); g.stroke(); }
  const px = x + w * 0.3, py = y + h * 0.42, hx = x + w * 0.78, hy = y + h * 0.8;
  g.strokeStyle = UNGU; g.lineWidth = big ? 10 : 7; g.setLineDash([18, 14]); g.beginPath(); g.moveTo(px, py + 20); g.lineTo(hx, hy); g.stroke(); g.setLineDash([]);
  g.restore();
  const s = big ? 1.6 : 1;
  g.fillStyle = OR; round(g, px - 85 * s, py - 105 * s, 170 * s, 50 * s, 12); g.fill();
  g.fillStyle = '#fff'; g.font = `800 ${Math.round(28 * s)}px Inter`; g.textAlign = 'center'; g.fillText('TOKO 24', px, py - 70 * s); g.textAlign = 'left';
  g.fillStyle = 'rgba(123,63,228,.35)'; g.beginPath(); g.arc(px, py, 52 * s, 0, Math.PI * 2); g.fill();
  g.fillStyle = UNGU; g.beginPath(); g.arc(px, py - 4, 28 * s, 0, Math.PI * 2); g.fill(); g.beginPath(); g.moveTo(px - 24 * s, py + 8); g.lineTo(px + 24 * s, py + 8); g.lineTo(px, py + 44 * s); g.fill();
  g.fillStyle = '#fff'; g.beginPath(); g.arc(px, py - 4, 10 * s, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#e8e8f0'; g.beginPath(); g.arc(hx, hy, 14 * s, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#9aa0c8'; g.font = `600 ${Math.round(24 * s)}px Inter`; g.fillText('Kamu', hx - 30 * s, hy + 48 * s);
};

const eta = (g: CanvasRenderingContext2D, y: number) => {
  round(g, 30, y, W - 60, 130, 24); g.fillStyle = '#1a1d33'; g.fill();
  g.fillStyle = '#9aa0c8'; g.font = '500 30px Inter'; g.fillText('Tiba dalam', 64, y + 52);
  g.fillStyle = '#fff'; g.font = '800 50px Inter'; g.fillText('7 menit', 64, y + 108);
  g.fillStyle = MUDA; g.font = '700 30px Inter'; g.fillText('Juned', 400, y + 52); g.fillStyle = '#fff'; g.font = '800 36px Inter'; g.fillText('B 4217 KZ', 400, y + 104);
};

export type Msg = { text?: string; time: string; photo?: boolean };

const bubbles = (g: CanvasRenderingContext2D, msgs: Msg[], y0: number) => {
  let y = y0;
  for (const m of msgs) {
    if (m.photo) {
      const h = 520; g.fillStyle = '#2a2d45'; round(g, 30, y, W - 120, h, 26); g.fill();
      g.fillStyle = MUDA; g.font = '700 30px Inter'; g.fillText('Juned', 60, y + 46);
      // painted thumbnail: two riders from behind on a red night road
      const x = 54, ty = y + 70, tw = W - 168, th = 380;
      g.save(); round(g, x, ty, tw, th, 18); g.clip();
      const gr = g.createLinearGradient(0, ty, 0, ty + th); gr.addColorStop(0, '#1a0608'); gr.addColorStop(1, '#5a1a1a'); g.fillStyle = gr; g.fillRect(x, ty, tw, th);
      g.fillStyle = 'rgba(255,240,220,.25)'; g.beginPath(); g.moveTo(x + tw / 2 - 30, ty + th); g.lineTo(x + tw / 2 + 30, ty + th); g.lineTo(x + tw / 2 + 120, ty + 120); g.lineTo(x + tw / 2 - 120, ty + 120); g.fill();
      g.fillStyle = '#0c0608'; g.beginPath(); g.ellipse(x + tw / 2 + 18, ty + 150, 34, 38, 0, 0, Math.PI * 2); g.fill(); g.fillRect(x + tw / 2 - 20, ty + 180, 78, 110);
      g.beginPath(); g.ellipse(x + tw / 2 - 18, ty + 190, 30, 32, 0, 0, Math.PI * 2); g.fill(); g.fillRect(x + tw / 2 - 64, ty + 215, 90, 140);
      g.fillStyle = '#b48cff'; g.beginPath(); g.arc(x + tw / 2 + 26, ty + 150, 4, 0, Math.PI * 2); g.fill();
      g.filter = 'blur(2px)'; g.restore(); g.filter = 'none';
      g.fillStyle = '#8a8fb0'; g.font = '500 24px Inter'; g.fillText(m.time, W - 190, y + h - 22);
      y += h + 22; continue;
    }
    g.font = '500 42px Inter'; const lines = wrap(g, m.text!, W - 190); const h = 44 + lines.length * 54 + 36;
    g.fillStyle = '#2a2d45'; round(g, 30, y, W - 120, h, 26); g.fill();
    g.fillStyle = MUDA; g.font = '700 30px Inter'; g.fillText('Juned', 60, y + 46);
    g.fillStyle = '#f2f2f7'; g.font = '500 42px Inter'; lines.forEach((l, i) => g.fillText(l, 60, y + 100 + i * 54));
    g.fillStyle = '#8a8fb0'; g.font = '500 24px Inter'; g.fillText(m.time, W - 190, y + h - 20);
    y += h + 22;
  }
};

/** Chat: small map + ETA on top, messages below (newest last). */
export const chatScreen2 = (msgs: Msg[]) => make((g) => {
  g.fillStyle = '#e6dcff'; g.font = '500 28px Inter'; g.fillText('Chat driver', 520, 160);
  miniMap(g, 30, 240, W - 60, 300); eta(g, 560);
  const total = msgs.reduce((a, m) => a + (m.photo ? 542 : 200), 0);
  bubbles(g, msgs, Math.min(720, H - 40 - total));
});

/** Big map: pin stuck at TOKO 24. */
export const mapScreen = () => make((g) => {
  g.fillStyle = '#e6dcff'; g.font = '500 28px Inter'; g.fillText('Lacak driver', 500, 160);
  miniMap(g, 30, 240, W - 60, 960, true); eta(g, 1230);
  g.fillStyle = '#ff6b6b'; g.font = '700 30px Inter'; g.fillText('● Lokasi driver tidak bergerak', 40, 1430);
});

/** Driver info card. */
export const infoScreen = () => make((g) => {
  g.fillStyle = '#e6dcff'; g.font = '500 28px Inter'; g.fillText('Driver kamu', 520, 160);
  round(g, 30, 260, W - 60, 900, 30); g.fillStyle = '#1a1d33'; g.fill();
  g.fillStyle = UNGU; g.beginPath(); g.arc(W / 2, 450, 120, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#07070b'; round(g, W / 2 - 80, 420, 160, 70, 30); g.fill(); g.fillStyle = '#d9c2ff'; g.beginPath(); g.arc(W / 2 + 30, 450, 7, 0, Math.PI * 2); g.fill();
  g.textAlign = 'center'; g.fillStyle = '#fff'; g.font = '800 60px Inter'; g.fillText('Juned', W / 2, 650);
  g.fillStyle = '#9aa0c8'; g.font = '500 32px Inter'; g.fillText('★ 4,9 · Jaket ungu', W / 2, 705);
  g.fillStyle = '#0d0d10'; round(g, 110, 780, W - 220, 160, 18); g.fill(); g.strokeStyle = '#ddd'; g.lineWidth = 6; round(g, 118, 788, W - 236, 144, 14); g.stroke();
  g.fillStyle = '#fff'; g.font = '900 96px Inter'; g.fillText('B 4217 KZ', W / 2, 895);
  g.fillStyle = '#9aa0c8'; g.font = '500 30px Inter'; g.fillText('Plat terdaftar', W / 2, 1010);
  g.textAlign = 'left';
});

/** Order screen (flashback): searching then found. */
export const orderScreen = () => make((g) => {
  g.fillStyle = '#e6dcff'; g.font = '500 28px Inter'; g.fillText('Pesan ojek', 530, 160);
  miniMap(g, 30, 240, W - 60, 700, false);
  round(g, 30, 980, W - 60, 420, 28); g.fillStyle = '#1a1d33'; g.fill();
  g.fillStyle = '#fff'; g.font = '800 48px Inter'; g.fillText('Driver ditemukan', 64, 1060);
  g.fillStyle = MUDA; g.font = '700 36px Inter'; g.fillText('Juned · B 4217 KZ', 64, 1130);
  g.fillStyle = '#9aa0c8'; g.font = '500 32px Inter'; g.fillText('Jaket ungu · tiba 5 menit', 64, 1185);
  g.fillStyle = UNGU; round(g, 64, 1250, W - 128, 100, 50); g.fill(); g.fillStyle = '#fff'; g.font = '800 40px Inter'; g.textAlign = 'center'; g.fillText('Lacak', W / 2, 1314); g.textAlign = 'left';
});
