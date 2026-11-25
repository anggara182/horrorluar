# CLAUDE.md - JALAN PINTAS

Serial horor interaktif 2.5D, bahasa Indonesia. Tiap episode ditutup pilihan 1/2. Kanon ditentukan kita (bukan vote): episode berikutnya memainkan opsi SALAH dulu → GAGAL → rewind → opsi BENAR (bible §Bentuk episode).
Baca `SERIES-BIBLE.md` dan `EPISODES.md` dulu, dan jangan pernah bertentangan dengan keduanya. Lalu baca `PROGRESS.md` dan kerjakan HANYA langkah berikutnya.

Panduan umum pipeline ada di repo choicesfate (`docs/`; salinan sementara: `choicesfate.bundle` di root repo ini). Jangan menyentuh file di luar `jalan-pintas/` kecuali diminta.

## Batas keras
- Satu video maksimal 4 jam: build + render + edit. Kalau sesuatu makan waktu terlalu lama, sederhanakan.
- Pipeline: Remotion + Three.js (`@remotion/three`) di `remotion/`. Blender tidak dipakai (23 Nov: render CPU ±12 dtk/frame vs ±0,2 dtk/frame Three.js).
- Look 2.5D: gambar vektor datar di ruang 3D (bible §Look). Tanpa walk cycle, tanpa lip sync. Sudut kamera mengikuti gambar yang sudah ada; sudut baru = gambar baru dulu.
- Gerak = kamera, parallax, roda berputar, lampu, ganti gambar, dan micro-expression wajah (kedip, lirikan, alis, mulut; `remotion/src/look3/face.ts`, deterministik per frame).

## Cara kerja
- Satu langkah per sesi: 0 naskah, 1 VO, 2 timing, 3 shot list, 4 build, 5 preview, 6 render, 7 edit.
- Setelah tiap langkah, tulis yang sudah selesai dan langkah berikutnya di `PROGRESS.md`. Lalu berhenti.
- Preview = SATU contact sheet low-res berisi key frame. Tidak ada cek frame per frame.
- Render: `tools/render_shots.sh epNN vN` (per shot + cache; draf `SCALE=0.5`). Render panjang dijalankan di background. Tulis perintahnya di `PROGRESS.md`, lalu berhenti.
- Cek sebelum render: tidak ada tekstur hilang/melar/berkedip, tidak ada tangan/tubuh yang menembus benda, teks layar HP terbaca di ukuran HP.
- Agent kontrol (maks 3 aktif): timing (shot mulai di barisnya), visual (contact sheet: tekstur, benda melayang/terpotong, tokoh keluar frame, teks HP terbaca), aturan (cek daftar di bawah). Ulangi sampai bersih, baru render final.

## Aturan video
- 9:16, 1080x1920, 24 fps. Panjang video = panjang VO.
- Tanpa teks judul atau hook di layar. Yang boleh: caption, layar HP (peta + chat), 2 label pilihan di akhir, dan stempel GAGAL + ikon ◀◀ saat rewind.
- Jangan merapatkan jeda VO. Hanya potong hening di atas 1,2 dtk.
- Satu cut atau gerak kamera tiap 2–4 dtk, dan tiap 1 dtk di 5 dtk pertama.
- Suara mulai di frame pertama, dan gambar sudah bergerak.
- Cut to black tepat saat kata terakhir selesai. Tanpa end card, tanpa outro.

## Caption
- Polos dan gampang dibaca (arahan adrian 23 Nov, gaya karaoke dibuang): satu frasa utuh tampil sekaligus (frasa baru tiap beberapa kata, ikut timing VO), semua kata putih, bold Inter ±70 px, huruf biasa, maks 2 baris, rata tengah.
- Outline gelap tebal (`-webkit-text-stroke` ±7 px `#0b0812`, paint-order stroke) + bayangan lembut, supaya terbaca di rak toko yang terang maupun malam.
- Tanpa kotak kata kunci, tanpa kata abu, tanpa bold per kata. Chat Juned boleh sedikit ungu muda; selain itu putih.
- Posisi: sepertiga bawah (y ±1300–1450) secara default, tapi digeser per shot supaya tidak menutupi wajah, HP, atau label pilihan. Shot POV HP: di atas (y ±250).
- Komponen: `remotion/src/ui/Caption.tsx`; posisi per shot: `capY` di `SPECS` (`remotion/src/ep/EP01.tsx`).

## Suara
- VO −16 LUFS, master −14 LUFS, true peak di bawah −1 dBTP.
- Dengung mesin motor di bawah semua shot berkendara. Mesin berhenti di kalimat paling seram, lalu masuk lagi pelan.
- Bunyi notifikasi chat selalu sama di setiap pesan.

## Kontinuitas (jangan dilanggar)
1. Satu episode, satu folder (`epNN/`). Episode yang sudah tayang tidak pernah diubah. Versi baru = `-v2`, tidak menimpa.
2. Yang sudah terjadi itu permanen. Benda hilang, luka, atau tempat yang rusak tetap begitu di episode berikutnya.
3. ETA di aplikasi selalu "7 menit" dan tidak pernah turun, kecuali bible bilang lain.
4. Hal baru (tokoh, tempat, benda, aturan) langsung dicatat ke `SERIES-BIBLE.md` dan `EPISODES.md` di sesi yang sama.

## Biaya dan layanan luar
- Key ai33 dipakai bersama akun studio lain (batas efektif ±5 task). Sebelum submit VO, minta izin adrian dulu dan ikuti aturan antrean studio (tunggu kalau ≥4 task belum done, jarak submit ≥15 dtk + jitter, backoff kalau kena 429/5xx; sudah ada di `tools/vo.py`). Jangan submit SFX lewat ai33.
- Sebelum memakai apa pun yang berbayar, sebutkan harganya dulu.
- Tanpa gambar AI untuk tokoh, cover, atau logo. Semuanya dirender dari scene Three.js.
- Jangan posting atau menjadwalkan tanpa izin eksplisit adrian.

## Hasil akhir
- H.264 CRF 22 (supaya final < 50 MB; CRF 18 = ±93 MB), AAC 192k. Plus salinan kecil untuk HP (`-hp.mp4`).
- Cover 1080x1920 dari render Three.js (lihat bible §Cover).
- Tokoh, motor, dan set ada di `remotion/src/look3/` (sprite) dan `remotion/src/ep/sets25.tsx`, dipakai ulang tiap episode.
