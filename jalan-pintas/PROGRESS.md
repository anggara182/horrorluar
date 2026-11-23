# PROGRESS - Episode 01

Selesai: 0 naskah (v2, `ep01/naskah.md`), 1 VO.
- `ep01/vo.mp3` (77,8 dtk, −16,3 LUFS), sumber `ep01/vo.wav` (tidak di-commit, buat ulang: `python3 -I tools/vo.py ep01 --assemble`).
- Take terpilih + timestamp tiap kata: `ep01/vo_timing.json` (transkrip cocok 100% di 8 dari 11 blok, sisanya beda ejaan saja).
- ai33: 22 task (2 take × 11 blok), 3.314 kredit, `ep01/vo/tasks.json`. Suara: Angga (narator), Baron (Si Pengendara), Kurnia (Juned, EQ telepon).
- Tidak ada hening >0,8 dtk, jadi tidak ada yang dipotong.

Berikutnya: adrian dengar `ep01/vo.mp3`. Kalau oke → langkah 2 timing + 3 shot list (`ep01/brief.md`: shot tiap 2–4 dtk, tiap 1 dtk di 5 dtk pertama, dikunci ke kata pertama barisnya).
Kalau ada baris yang jelek: generate ulang baris itu saja (hapus `ep01/vo/bNN_t*.mp3`, jalankan `tools/vo.py ep01`).

Catatan render (penting untuk langkah 4–6):
- Blender 4.2.3 LTS di `/opt/blender/` (container, hilang kalau container baru: unduh lagi dari download.blender.org + `apt-get install libegl1 libegl-mesa0 libgl1-mesa-dri libxi6 libxxf86vm1 libxkbcommon0 libsm6`).
- Tanpa GPU: EEVEE 1080x1920, 16 sample ≈ 12 dtk/frame. 78 dtk × 24 fps = 1.870 frame ≈ 6 jam → melewati batas 4 jam.
- Rencana: render 720x1280 / 8 sample (perkiraan 3–4 dtk/frame), tanpa volumetrik (kabut = bidang transparan), lalu upscale ke 1080x1920 saat edit. Ukur ulang di preview.
