// Phone screens for the fictional JALANIN app, drawn on a canvas and used as a texture.
import * as THREE from 'three';
import { C } from '../three/kit';

const round = (g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
};

const wrap = (g: CanvasRenderingContext2D, text: string, maxW: number) => {
  const out: string[] = []; let line = '';
  for (const w of text.split(' ')) { const t = line ? line + ' ' + w : w; if (g.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t; }
  if (line) out.push(line); return out;
};

export type ChatMsg = { text: string; time: string };

/** Chat with Juned + live map card (pin stuck at TOKO 24, ETA 7 menit). */
export const chatScreen = (msgs: ChatMsg[]) => {
  const W = 720, H = 1550; const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d')!;
  g.fillStyle = '#0f1020'; g.fillRect(0, 0, W, H);
  // status bar + header
  g.fillStyle = '#cfd2e6'; g.font = '600 28px Inter'; g.fillText('00.14', 40, 52);
  g.fillStyle = C.ungu; g.fillRect(0, 80, W, 130);
  g.fillStyle = '#fff'; g.font = '800 44px Inter'; g.fillText('JALANIN', 40, 160);
  g.font = '500 26px Inter'; g.fillStyle = '#e6dcff'; g.fillText('Driver kamu', 520, 160);
  // map card
  round(g, 30, 240, W - 60, 470, 28); g.fillStyle = '#1a1d33'; g.fill();
  g.save(); round(g, 30, 240, W - 60, 470, 28); g.clip();
  g.strokeStyle = '#2c3152'; g.lineWidth = 26;
  [[60, 300, 660, 420], [100, 700, 520, 260], [380, 240, 420, 710], [30, 560, 690, 600]].forEach(([a, b, x, y]) => { g.beginPath(); g.moveTo(a, b); g.lineTo(x, y); g.stroke(); });
  g.strokeStyle = C.ungu; g.lineWidth = 8; g.setLineDash([18, 14]); g.beginPath(); g.moveTo(205, 455); g.lineTo(560, 640); g.stroke(); g.setLineDash([]);
  g.restore();
  // shop label + pin
  g.fillStyle = C.oranye; round(g, 120, 330, 170, 52, 12); g.fill(); g.fillStyle = '#fff'; g.font = '800 28px Inter'; g.fillText('TOKO 24', 140, 366);
  g.fillStyle = C.ungu; g.beginPath(); g.arc(205, 440, 30, 0, Math.PI * 2); g.fill(); g.beginPath(); g.moveTo(180, 455); g.lineTo(230, 455); g.lineTo(205, 495); g.fill();
  g.fillStyle = '#fff'; g.beginPath(); g.arc(205, 440, 11, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#e8e8f0'; g.beginPath(); g.arc(560, 640, 14, 0, Math.PI * 2); g.fill();
  // ETA
  round(g, 30, 730, W - 60, 120, 24); g.fillStyle = '#1a1d33'; g.fill();
  g.fillStyle = '#9aa0c8'; g.font = '500 28px Inter'; g.fillText('Tiba dalam', 60, 780);
  g.fillStyle = '#fff'; g.font = '800 44px Inter'; g.fillText('7 menit', 60, 830);
  g.fillStyle = '#9aa0c8'; g.font = '600 28px Inter'; g.fillText('Juned · B 4217 KZ', 380, 805);
  // messages
  let y = 900;
  for (const m of msgs) {
    g.font = '500 34px Inter'; const lines = wrap(g, m.text, W - 200); const h = 40 + lines.length * 46 + 30;
    g.fillStyle = '#2a2d45'; round(g, 30, y, W - 140, h, 26); g.fill();
    g.fillStyle = C.unguMuda; g.font = '700 26px Inter'; g.fillText('Juned', 60, y + 40);
    g.fillStyle = '#f2f2f7'; g.font = '500 34px Inter'; lines.forEach((l, i) => g.fillText(l, 60, y + 86 + i * 46));
    g.fillStyle = '#8a8fb0'; g.font = '500 22px Inter'; g.fillText(m.time, W - 190, y + h - 18);
    y += h + 22;
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
};
