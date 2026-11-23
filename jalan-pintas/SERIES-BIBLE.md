# SERIES BIBLE - JALAN PINTAS

## Inti
- **Situasi yang semua orang kenal:** naik ojol sendirian tengah malam.
- **Twist:** kamu sudah dibonceng, tapi driver aslinya baru ngechat dari titik jemput.
- **Rumus (dari Rulebook, isinya milik kita):** tempat sehari-hari + dua suara yang saling bertentangan + pilihan 1/2 di akhir yang sama-sama berisiko.
- **Pertanyaan besar season:** siapa yang memboncengmu, dan ke mana jalan pintasnya berujung?
- **Sudut pandang:** orang kedua ("kamu"). Penonton yang naik motornya.
- **Hook pembuka (template):** "Bayangin kamu [situasi normal]... terus [satu hal yang salah]."

## Tokoh (maks 2 di layar sekaligus)
| Tokoh | Peran | Tampilan (bentuk dasar) | Detail yang wajib terbaca |
|---|---|---|---|
| **Kamu** | Penumpang, POV penonton | Manekin kepala bulat, kulit sawo matang, kaus seragam oranye "TOKO 24", ransel abu | Tangan selalu memegang pinggang driver atau HP |
| **Si Pengendara** | Driver yang memboncengmu, maskot seri | Jaket ungu aplikasi JALANIN, helm ungu dengan **kaca helm gelap selalu tertutup**, badge dada "JUNED" | Kaca helm memantulkan titik ungu kecil (pin peta). Wajahnya tidak pernah terlihat. Kepalanya bisa berputar 180° sementara badan tetap ke depan (EP01) |
| **Juned (di aplikasi)** | Driver asli, hanya muncul lewat chat/foto/telepon | Jaket dan helm sama, tapi kaca helm terbuka, kumis tipis, wajah cemas | Selalu muncul di layar HP, tidak pernah di set yang sama dengan Si Pengendara (sampai bible bilang lain) |

Suara (EP01, ganti di sini kalau adrian minta):
- Narator: "Angga - Authentic Indonesian" `elevenlabs_Aw7qttNp8aSAczVs9nwb`. Energik dan cepat, tidak berbisik.
- Si Pengendara: "Baron - Calm & Mature" `elevenlabs_gQQvBatMocMgEreeSqHb`. Rendah dan tenang, tidak pernah berteriak.
- Juned (chat dibacakan): "Kurnia - Character" `elevenlabs_tqu2FgJzLu4PdJziSqSq`. Kesal lalu takut. EQ telepon tipis di mix.
- Tidak memakai narator utama akun lain (Saos Cocol, Alvar, Ricky) supaya seri ini punya suara sendiri.
- Setting ai33: model `eleven_v3`, speed 1.05–1.10 (stability tidak diteruskan ai33). Tag emosi Inggris di depan kalimat.

## Benda dan perangkat berulang
- **Aplikasi JALANIN (fiktif):** peta gelap, pin ungu `#7B3FE4`, chat bubble. Plat terdaftar: **B 4217 KZ**.
- **ETA selalu "7 menit"** dan tidak pernah turun. Detail kecil untuk penonton jeli.
- **Spion kiri motor** = shot khas seri (padanan shot kaca spion bus di Rulebook).
- **Satu aturan Si Pengendara:** "Pegangan. Jangan lepas." (Satu aturan, bukan daftar.)

## Tempat
| Set | Isi (bentuk dasar) | Cahaya |
|---|---|---|
| Depan minimarket TOKO 24 | Kotak kaca terang, papan nama oranye menyala, parkiran, tiang listrik | Neon putih dingin + oranye papan nama |
| Jalan kampung tanpa lampu | Jalan aspal gelap, pagar tembok, pohon pisang dari silinder + bidang daun | Cahaya bulan biru + lampu depan motor (kerucut) |
| Rel mati | Rel berkarat, bantalan kayu, tiang sinyal miring, kabut rendah | Biru gelap, lampu sinyal merah redup |

Tambahkan tempat baru di sini begitu dipakai.

## Look (Remotion + Three.js)
- **Look v2 (dikunci 23 Nov):** campuran 2D/3D. Tokoh, motor, properti = 3D cel shading 4 tingkat + garis tinta `#120d1d` (`remotion/src/look2/toon.tsx`). Wajah digambar 2D di kepala 3D. Latar = lapisan lukis 2D (langit, siluet kampung + jendela menyala, tiang + kabel, pohon pisang). Glow, sorot lampu, kabut = kartu 2D additive. Grain + vignette di atas.
- Lighting selalu punya sumber: lampu jalan / toko / lampu motor / sinyal merah / bulan sebagai rim. Acuan: `remotion/out/v2-s1..3.png`.
- Warna per babak: oranye TOKO 24 (awal) → biru jalan gelap (tengah) → merah rel mati (bahaya/pilihan).
- Shot POV: tangan memegang HP yang menempel ke kamera; layar HP (aplikasi JALANIN) harus terbaca.
- Look test: `remotion/out/sheet.png` (`npx remotion still src/index.ts LookTest out/sN.png --props='{"shot":N}'`).
- Palet: navy malam `#0B1030`, ungu JALANIN `#7B3FE4`, oranye TOKO 24 `#FF7A1A`, merah lampu belakang `#E0262B`.
- Malam tetap terbaca: wajah dan tangan selalu dapat rim light.
- Kamera: handheld shake di setiap shot, low angle di aspal saat motor lewat, push-in pelan ke kaca helm, whip-pan cepat ke spion/ke belakang, POV ke layar HP.
- Motor: skuter matic dari kotak dan silinder ber-bevel, tanpa merek. Roda berputar, badan motor goyang kecil.

## Bentuk episode (60–90 dtk, ±160–190 kata)
| Waktu | Fungsi |
|---|---|
| 0–5 dtk | Hook "Bayangin…" + hal yang salah. Ep2+ = recap 5–8 dtk. |
| 5–20 dtk | Setup: di mana, jam berapa, siapa. Kalimat pendek. |
| 20–50 dtk | Eskalasi: ada hal baru tiap 5–10 dtk (chat, bunyi, detail di spion). |
| 50–70 dtk | Twist: satu petunjuk yang jelas (foto, plat, pantulan), bukan daftar aturan. |
| akhir | Pilihan 1/2, sama-sama berisiko. Label 1 dan 2 menempel ke benda yang dimaksud. Cut to black di kata terakhir. |

Episode 2 dan seterusnya: recap 5–8 dtk → umumkan pilihan terbanyak → tunjukkan dulu akibat opsi yang kalah ("Kalau kamu pilih…") → lanjut dari opsi yang menang → pilihan baru.
Setiap episode harus bisa ditonton sendiri. Universe = bonus untuk fans, bukan tembok untuk penonton baru.

## Aturan menulis
- Bahasa ngobrol Jakarta-an ringan ("malem", "nggak"), kalimat pendek. Angka ditulis huruf.
- Kalimat yang tidak memunculkan atau menjawab pertanyaan, dibuang.
- Satu ide jelas per episode. Satu petunjuk lebih baik dari tiga.
- Tidak berbisik. Tag paling energik di 10 detik pertama: `[urgent]`, `[fast]`, `[tense]`.
- Nama speaker hanya ditulis saat suara berganti.
- Fiksi. Tanpa merek asli (aplikasi = JALANIN, minimarket = TOKO 24). Lucu boleh dari situasi, tidak dari tubuh, suku, agama, atau orang sungguhan.

## Cover (sama tiap episode, hanya nomor yang berubah)
Render dari scene Three.js, bukan gambar AI. Sepertiga atas: "JALAN" putih bold italic + "PINTAS" merah besar, garis merah tebal, "EPISODE N" spasi lebar. Bawah: close-up Kamu di boncengan, cemas, memegang HP dengan pin ungu. Latar: Si Pengendara dari belakang, kaca helm memantulkan titik ungu. Dua warna: hitam dan merah (+ ungu kecil di pin).

## Logo / foto profil
Helm ungu dengan kaca tertutup, kepala dan bahu, di tengah latar hitam pekat. Satu-satunya cahaya: titik ungu kecil di kaca helm + rim light dingin tipis. Tanpa teks. Dirender dari helm Si Pengendara (Three.js).

## Akun (usulan, belum dibuat)
- Nama: **Jalan Pintas**. Handle sama di IG, TikTok, YouTube: `@jalanpintas.series` (CEK ketersediaan).
- Bio: "Tiap malam satu episode. Kamu yang milih jalannya."
- Jam tayang usulan: 19.00 WIB tiap hari.
- Caption: label CERITA FIKSI, tutup dengan pertanyaan terbuka, tanpa "komen/like/tag".
