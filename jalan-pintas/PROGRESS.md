# PROGRESS - Episode 01

Selesai: 0 naskah (v2, `ep01/naskah.md`), 1 VO, 2 timing + 3 shot list (`ep01/brief.md`, `ep01/shots.json`: 35 shot, rata-rata 2,2 dtk). Look v2 DIKUNCI adrian (23 Nov, "bagus tuh").
- `ep01/vo.mp3` (77,8 dtk, −16,3 LUFS), sumber `ep01/vo.wav` (tidak di-commit, buat ulang: `python3 -I tools/vo.py ep01 --assemble`).
- Take terpilih + timestamp tiap kata: `ep01/vo_timing.json` (transkrip cocok 100% di 8 dari 11 blok, sisanya beda ejaan saja).
- ai33: 22 task (2 take × 11 blok), 3.314 kredit, `ep01/vo/tasks.json`. Suara: Angga (narator), Baron (Si Pengendara), Kurnia (Juned, EQ telepon).
- Tidak ada hening >0,8 dtk, jadi tidak ada yang dipotong.

Selesai juga (23 Nov):
- v1 (3D cel-shading) dirender: `ep01/render/ep01-v1.mp4` (34 mnt). Kode 3D disimpan di `remotion/src/ep/EP01_3d.tsx` (tidak dipakai).
- adrian pilih **2.5D** (gambar datar di ruang 3D). EP01 dipindah: `remotion/src/ep/EP01.tsx` + `sets25.tsx` + sprite `src/look3/`. 35 shot, kamera disesuaikan ke gambar yang ada. Contact sheet: `remotion/out/contact-sheet.jpg` (`node scripts/contact.mjs ep01 0.5`).
- Audio tetap `ep01/mix.wav` (`tools/mix.py ep01`, cue di `ep01/sfx.json`).
- Render per shot + cache: `tools/render_shots.sh ep01 vN` (hanya shot yang berubah dirender ulang; `--only S05,S06` / `--force`). Draf cepat: `SCALE=0.5 tools/render_shots.sh ep01 vN-draft` (540x960).
- Kecepatan (container tanpa GPU): draf 540x960 ±0,24 dtk/frame (35 shot, 7,5 mnt termasuk ±4 dtk persiapan per shot). Final 1080x1920 ±0,34 dtk/frame (10,7 mnt render + ±1,5 mnt sambung/encode = ±12,8 mnt). Revisi 1 shot ±10–20 dtk + encode ±1,5 mnt.
- v2 final: `ep01/render/ep01-v2.mp4` (44,5 MB, CRF 22, −13,8 LUFS) + `ep01-v2-hp.mp4` (10 MB).
- Percepatan yang dipasang: tanpa antialias WebGL, material unlit tanpa lampu/bayangan, tekstur tanpa mipmap/anisotropi (kecuali tanah/tembok berulang), sedikit lapisan transparan layar penuh.

v3 (23 Nov, catatan adrian setelah v2: "rapiin lagi, ekspresi bisa digerakin, ban ga muter", caption "dibikin normal dan kebaca"):
- Roda: roda samping berputar (versi blur + tanda putih saat ngebut, biar tidak efek wagon-wheel), tapak ban belakang/depan bergulir, ban depan goyang dikit saat jalan. Motor parkir/berhenti diam.
- Micro-expression Kamu (`remotion/src/look3/face.ts`, deterministik per frame): kedip tiap ±2–4 dtk, lirikan kecil, alis naik di kata kunci, mulut rapat/terbuka, napas + menelan; mata melotot + pupil mengecil di beat seram (S21, S29, S32, S35). Dipakai di tampak samping, berdiri di toko, close-up wajah, dan tampak depan.
- Si Pengendara: titik ungu di kaca helm berkedip di kalimat seram, kilau kaca bergeser pelan, helm close-up miring sedikit; S16 helm menoleh tipis saat ditepuk.
- Caption baru: frasa utuh, putih bold + outline gelap, default sepertiga bawah, per shot `capY`.
- Reframe S03/S04/S10/S14/S16, variasi pohon/skyline.
- Render v3: `tools/render_shots.sh ep01 v3` (log `ep01/render-v3.log`). Audio v3 di-remux main dengan mix baru.

Berikutnya: adrian nonton `ep01/render/ep01-v2.mp4` → revisi per shot → cover + caption → jadwal (izin adrian).
Kalau ada baris VO yang jelek: generate ulang baris itu saja (hapus `ep01/vo/bNN_t*.mp3`, jalankan `tools/vo.py ep01`), lalu `tools/mix.py ep01`.

Catatan teknis:
- Remotion + Three.js di `remotion/` (`npm install`). Di container: Chromium headless shell + `swangle`; di PC lokal hapus baris browser di `remotion.config.ts`.
- `tools/render.sh` = render lama satu-langkah (v1); pakai `tools/render_shots.sh`.
