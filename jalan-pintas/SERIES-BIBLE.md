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

## Look (2.5D, dikunci adrian 23 Nov)
- **2.5D:** semua tokoh, motor, dan properti = gambar vektor DATAR (SVG di kode) dengan shading, rim light, dan kilau yang dilukis langsung. Gambar-gambar itu ditaruh sebagai lapisan di ruang 3D (Three.js lewat Remotion). Kamera 3D bergerak di antara lapisan → parallax. Material unlit, tanpa lampu/bayangan 3D. Acuan: `remotion/out/v3-s1..3.png` dan `remotion/out/contact-sheet.jpg`.
- Cahaya = dilukis di gambar + glow additive (lampu, sorot lampu motor, genangan cahaya di aspal) + kabut warna. Grain + vignette di atas (CSS).
- Warna per babak: oranye TOKO 24 (flashback) → biru jalan gelap (sekarang) → merah rel mati (bahaya/pilihan).
- Palet: navy malam `#0B1030`, ungu JALANIN `#7B3FE4`, oranye TOKO 24 `#FF7A1A`, merah lampu belakang `#E0262B`.
- Gerak: kamera (push, tilt, whip, handheld), latar parallax, roda berputar (sprite roda terpisah; versi blur saat ngebut), tapak ban bergulir, motor goyang kecil, lampu berkedip, GANTI GAMBAR (mis. helm biasa → helm menghadap belakang), dan micro-expression wajah Kamu (kedip, lirik, alis, mulut, napas; `look3/face.ts`). Titik ungu di kaca helm berkedip di kalimat seram. Tanpa animasi anggota badan.
- Caption: frasa utuh, putih bold + outline gelap, sepertiga bawah (lihat CLAUDE.md §Caption).

**Daftar gambar (sprite)** — `remotion/src/look3/svg.ts` + `svg2.ts`, skala 700 px = 1 m:
| Sprite | Dipakai untuk |
|---|---|
| `ridersSide` (opsi: tanpa penumpang, tanpa roda, lampu mati) + `wheel` | berdua/driver dari samping (jalan, toko, rel) |
| `ridersBack({turned})` | dari belakang; `turned` = helm driver menghadap kamera (twist) |
| `ridersFront({headlight})` | dari depan saat berhenti: kaca helm menatap kamera, Kamu mengintip |
| `driverBackPov` + `handPhone` | POV penumpang + tangan memegang HP (layar dari `ui/screens2.ts`) |
| `kamuStand` | Kamu berdiri di depan TOKO 24 |
| `faceCU('worried'/'scared')` | close-up wajah Kamu (bisa diwarnai merah) |
| `helmetCU`, `jacketCU` (badge JUNED + garis reflektif), `plateCU` (B 4217 KZ), `mirrorCU` (satu lampu jauh), `tapHand`, `followerFront` | close-up dan motor pengikut |
| `paint.ts` | fasad TOKO 24, tiang listrik, sinyal rel, rel, tembok kampung, glow, kerucut cahaya, kabut |

**Menambah sudut/gambar baru:** gambar SVG baru di `svg2.ts` dengan `defs` yang sama (gradien `purple`, `helm`, `orange`, `skin`, `visor`, rim light), tentukan titik pijak (bawah tengah) dan tinggi dalam meter, cek di sheet sprite, lalu tempatkan di shot lewat `SPECS` di `remotion/src/ep/EP01.tsx` (`rider`, `cu`, `stand`, dll). Kanvas digambar seukuran tampilannya di layar (tekstur tanpa mipmap supaya render cepat; terlalu besar = berkedip).
- Set: `remotion/src/ep/sets25.tsx` — `*Side` (jalan di sumbu x, kamera dari samping) dan `*Axis` (jalan di sumbu z, kamera dari belakang/depan/POV), untuk jalan kampung, TOKO 24, dan rel mati.
- Kamera dipilih sesuai gambar yang ada (tidak ada sudut atas/bawah aspal kecuali digambar dulu).

## Bentuk episode (60–90 dtk, ±160–190 kata)
| Waktu | Fungsi |
|---|---|
| 0–5 dtk | Hook "Bayangin…" + hal yang salah. Ep2+ = recap 5–8 dtk. |
| 5–20 dtk | Setup: di mana, jam berapa, siapa. Kalimat pendek. |
| 20–50 dtk | Eskalasi: ada hal baru tiap 5–10 dtk (chat, bunyi, detail di spion). |
| 50–70 dtk | Twist: satu petunjuk yang jelas (foto, plat, pantulan), bukan daftar aturan. |
| akhir | Pilihan 1/2, sama-sama berisiko. Label 1 dan 2 menempel ke benda yang dimaksud. Cut to black di kata terakhir. |

### Episode 2 dan seterusnya: SALAH → GAGAL → REWIND → BENAR (adrian, 23 Nov)
Cerita ditentukan kita (kanon), bukan hasil vote. Pilihan di akhir episode tetap ditanyakan ke penonton sebagai pancingan komentar, dan jawabannya baru terbuka di episode berikutnya.

| Bagian | Durasi | Isi |
|---|---|---|
| Recap | 2–4 dtk | SATU beat, 2–3 cut cepat: situasi terakhir + dua pilihan dalam satu kalimat ("Mesin mati di rel. Lompat turun, atau tetap pegangan?"). Suara dari frame pertama. |
| Cabang SALAH | 15–20 dtk | "Kalau kamu [opsi salah]…" Dimainkan seolah nyata, konsekuensinya konkret dan seram, berakhir buruk. |
| GAGAL | ±1 dtk | Stempel GAGAL di layar + hit. Satu-satunya teks besar yang boleh selain caption dan label pilihan. |
| Rewind | 1,5–2 dtk | Frame cabang salah diputar mundur cepat (±6×) dengan look kaset VHS: garis scan, warna geser, pita noise, ikon ◀◀. Audio = cuplikan cabang salah dibalik + desing pita. Kembali ke momen pilihan. |
| Cabang BENAR | 35–45 dtk | "Tapi kamu [opsi benar]." Cerita lanjut, ada eskalasi dan satu twist. |
| Pilihan baru | 6–8 dtk | Pilihan 1/2, label menempel ke benda, cut to black di kata terakhir. |

Aturan:
- Opsi yang benar dicatat di `EPISODES.md` saat episode sebelumnya ditulis, sebelum tayang. Jangan diubah setelah tayang.
- Cabang SALAH tetap harus logis dan menanam petunjuk untuk misteri season, bukan cuma jumpscare.
- Opsi benar tidak boleh selalu nomor yang sama, dan tidak boleh selalu yang "aman".
- Setiap episode harus bisa ditonton sendiri. Universe = bonus untuk fans, bukan tembok untuk penonton baru.

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
