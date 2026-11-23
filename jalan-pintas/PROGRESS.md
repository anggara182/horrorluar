# PROGRESS - Episode 01

Selesai: 0 naskah (v2, `ep01/naskah.md`), 1 VO.
- `ep01/vo.mp3` (77,8 dtk, −16,3 LUFS), sumber `ep01/vo.wav` (tidak di-commit, buat ulang: `python3 -I tools/vo.py ep01 --assemble`).
- Take terpilih + timestamp tiap kata: `ep01/vo_timing.json` (transkrip cocok 100% di 8 dari 11 blok, sisanya beda ejaan saja).
- ai33: 22 task (2 take × 11 blok), 3.314 kredit, `ep01/vo/tasks.json`. Suara: Angga (narator), Baron (Si Pengendara), Kurnia (Juned, EQ telepon).
- Tidak ada hening >0,8 dtk, jadi tidak ada yang dipotong.

Berikutnya: adrian dengar `ep01/vo.mp3`. Kalau oke → langkah 2 timing + 3 shot list (`ep01/brief.md`: shot tiap 2–4 dtk, tiap 1 dtk di 5 dtk pertama, dikunci ke kata pertama barisnya).
Kalau ada baris yang jelek: generate ulang baris itu saja (hapus `ep01/vo/bNN_t*.mp3`, jalankan `tools/vo.py ep01`).

Catatan render (23 Nov, pipeline diganti):
- Blender ditinggal. Remotion + Three.js di `remotion/` (`npm install`, lalu `npx remotion still ...`). Di container: Chromium headless shell + `swangle`; di PC lokal hapus baris browser di `remotion.config.ts`.
- Kecepatan uji: ±0,17 dtk/frame 1080x1920 → satu episode ±6 menit render.
- Look test 3 shot jadi (`remotion/out/s1-3.png`): hook TOKO 24, POV HP, helm menghadap belakang. Menunggu pendapat adrian.
- PR visual sebelum build penuh: motor masih kotak-kotak (perlu dibulatkan), tangan kiri penumpang menembus badan driver, wajah penumpang kecil di wide shot, set masih terlalu gelap dibanding referensi.
