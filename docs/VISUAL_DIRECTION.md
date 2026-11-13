# Arahan visual

## Prinsip
- **SVG code only.** Tidak ada 3D, tidak ada gambar AI. Semua aset digambar sebagai React SVG di Remotion; gerak, kamera, dan parallax dikerjakan di Remotion.
- **Gaya:** semi-realis yang distilisasi. Siluet berlapis di depan cahaya gradien yang kaya (rasa wayang / poster sinematik).
- **Detail hanya di yang penting.** Hero (makhluk, tangan, mata, prop kunci) dibuat detail. Background dan elemen lain low detail: isian rata atau gradien 2–3 stop, siluet sederhana, maks ~6 shape per elemen, tanpa tekstur.
- **Hard cut saja.** Tidak ada light leak, transisi, glitch, chromatic aberration, flash, atau shake sebagai efek.
- **Seram, bukan gore.**

## Komposisi dan polish
- Satu focal point per shot: hero di depan area paling terang, diberi rim light, sisanya lebih gelap dan kontras lebih rendah.
- Minimal 3 lapis kedalaman: foreground siluet gelap, midground dengan hero, background terang/langit.
- Hero di sepertiga frame, tidak terpotong di kepala/kaki kecuali extreme close-up yang disengaja.
- Hero harus di atas 72% tinggi frame pada shot yang punya caption (caption mulai di 74%).
- Silhouette test: kalau hero diisi hitam polos tidak dikenali, perbaiki bentuknya dulu sebelum menambah detail.

## Konstruksi karakter
- Proporsi: kepala dewasa ≈ 1/7 tinggi badan, anak (~7 th) ≈ 1/5.
- Bangun dari primitif: kepala elips → leher → torso (bahu lebih lebar dari pinggang) → lengan/kaki tapered dengan tekukan siku/lutut → tangan sederhana dengan 1–2 pemisah jari. Rambut: satu shape besar + 4–8 stroke helai + rim.
- Wajah tidak detail; karakter lebih sering dari belakang, samping, atau siluet.

## Teknis (efisiensi render)
- World space 1296x2304, frame 1080x1920.
- Background statis di-*bake* ke PNG per depth band. Blur diterapkan sekali saat bake, bukan per frame. Maks 3–4 band per set; satu set band dipakai ulang lewat crop/zoom/parallax kamera.
- Elemen hidup di `<Live>`; kamera lewat `Cam` / `handheld` / `ramp`. Animasi pakai progres relatif dan `wordAt(...)` agar sinkron ke VO, tidak pernah frame absolut.
- Dilarang: filter per frame, mix-blend-mode, box-shadow glow (glow = radial gradient).
- **Grain** ditambahkan saat encode akhir (`finish.sh`): plate noise kasar 540x960 di-upscale, refresh 15 fps, overlay 0.30, x264 crf 23 `-tune grain`.
- **Vignette** dan **caption** global, tidak digambar per shot.

## Caption
- Montserrat 800, 46 px, mulai di 74% tinggi frame, kata demi kata mengikuti timing VO.
- Kata kunci (`*kata*` di naskah) berwarna aksen episode.
- Shot graphic (judul/CTA) tanpa caption; teks digambar sendiri dalam lebar aman 920 px. Teks CTA harus tampil penuh ≥0,5 detik sebelum shot berakhir.
- Font judul: Cinzel / Marcellus / Cormorant / Oswald. Untuk aksara Jepang/Korea/Thai pakai Noto yang punya glyph-nya dan cek tampilnya.

## Per episode
Palet, karakter, dan pembagian set tiap episode ada di `episodes/<ep>/STYLE.md`.
