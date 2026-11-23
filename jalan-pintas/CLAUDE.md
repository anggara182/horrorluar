# CLAUDE.md - JALAN PINTAS

Serial horor interaktif 3D, bahasa Indonesia. Tiap episode ditutup pilihan 1/2, dan episode berikutnya mengikuti suara terbanyak.
Baca `SERIES-BIBLE.md` dan `EPISODES.md` dulu, dan jangan pernah bertentangan dengan keduanya. Lalu baca `PROGRESS.md` dan kerjakan HANYA langkah berikutnya.

Folder ini terpisah dari seri legenda Inggris di repo `horrorluar` (`../docs`, `../pipeline`). Jangan menyentuh file di luar `jalan-pintas/`.

## Batas keras
- Satu video maksimal 4 jam: build + render + edit. Kalau sesuatu makan waktu terlalu lama, sederhanakan.
- Pipeline: Remotion + Three.js (`@remotion/three`) di `remotion/`. Blender tidak dipakai (23 Nov: render CPU ±12 dtk/frame vs ±0,2 dtk/frame Three.js).
- Pakai bentuk dasar (kapsul, kotak, bola). Tanpa walk cycle, tanpa lip sync, tanpa model detail kecuali yang sudah ada di `remotion/src/three/`.
- Gerak tokoh = rotasi kepala/badan di antara shot + ganti ekspresi wajah. Dinamika datang dari kamera, cahaya, dan suara, bukan dari model.

## Cara kerja
- Satu langkah per sesi: 0 naskah, 1 VO, 2 timing, 3 shot list, 4 build, 5 preview, 6 render, 7 edit.
- Setelah tiap langkah, tulis yang sudah selesai dan langkah berikutnya di `PROGRESS.md`. Lalu berhenti.
- Preview = SATU contact sheet low-res berisi key frame. Tidak ada cek frame per frame.
- Render panjang dijalankan di background. Tulis perintahnya di `PROGRESS.md`, lalu berhenti.
- Cek sebelum render: tidak ada tekstur hilang/melar/berkedip, tidak ada tangan/tubuh yang menembus benda, teks layar HP terbaca di ukuran HP.
- Agent kontrol (maks 3 aktif): timing (shot mulai di barisnya), visual (contact sheet: tekstur, benda melayang/terpotong, tokoh keluar frame, teks HP terbaca), aturan (cek daftar di bawah). Ulangi sampai bersih, baru render final.

## Aturan video
- 9:16, 1080x1920, 24 fps. Panjang video = panjang VO.
- Tanpa teks judul atau hook di layar. Yang boleh: caption, layar HP (peta + chat), dan 2 label pilihan di akhir.
- Jangan merapatkan jeda VO. Hanya potong hening di atas 1,2 dtk.
- Satu cut atau gerak kamera tiap 2–4 dtk, dan tiap 1 dtk di 5 dtk pertama.
- Suara mulai di frame pertama, dan gambar sudah bergerak.
- Cut to black tepat saat kata terakhir selesai. Tanpa end card, tanpa outro.

## Caption
- Karaoke (dari referensi 23 Nov): huruf biasa (bukan kapital semua), Inter, maks 2 baris, di sepertiga atas (top ±330 px).
- Kata yang sedang diucapkan putih tebal, kata sebelumnya abu. Satu kata kunci per kalimat diberi kotak seleksi ungu `#7B3FE4` dengan 4 titik sudut.
- Komponen: `remotion/src/ui/Caption.tsx`.
- Warna per suara: driver = abu muda `#C9CCD6`, chat Juned di aplikasi = ungu muda `#C7A8FF`, narator = putih.

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
- Key ai33 dipakai bersama akun studio lain (batas efektif ±5 task). Sebelum submit VO, minta izin adrian dulu dan ikuti aturan antrean studio (`_shared/ATURAN-PARALEL.md` §3: tunggu kalau ≥4 task belum done, jarak submit ≥15 dtk + jitter, backoff kalau kena 429). Jangan submit SFX lewat ai33.
- Sebelum memakai apa pun yang berbayar, sebutkan harganya dulu.
- Tanpa gambar AI untuk tokoh, cover, atau logo. Semuanya dirender dari scene Three.js.
- Jangan posting atau menjadwalkan tanpa izin eksplisit adrian.

## Hasil akhir
- H.264 CRF 18, AAC 192k. Plus salinan kecil untuk HP (`-hp.mp4`).
- Cover 1080x1920 dari render Three.js (lihat bible §Cover).
- Tokoh, motor, dan set ada di `remotion/src/three/` dan dipakai ulang tiap episode.
