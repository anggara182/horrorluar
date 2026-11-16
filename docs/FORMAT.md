# Format seri

Short vertikal 9:16 (1080x1920, 30 fps), 50–60 detik, VO bahasa Inggris untuk audiens global. Satu legenda per episode, dari Indonesia dan luar negeri.

## Struktur 13 shot
| # | Fungsi | Isi |
|---|---|---|
| 1 | Hook / aturan | "In <negara>, if <kondisi>… <aturan>." Aturan yang bisa dicoba penonton. |
| 2 | Judul | Nama legenda + negara (nama lokal/aksara asli bila ada). |
| 3 | Lore | Siapa makhluknya, satu kalimat, satu detail khas. |
| 4–10 | Cerita | Orang pertama ("my grandfather…", "my friend…"), naik tegangan, puncak di shot 9–10. |
| 11 | Resolusi | Kabur / pagi hari / bukti yang tertinggal. |
| 12 | Twist + loop | Kejadian terulang sekarang, membuka kemungkinan masih terjadi. |
| 13 | CTA | "Would you …? Comment YES or NO." Tanpa VO, teks di layar. |

## Aturan naskah
- ±150–165 kata total. Kalimat pendek. Kata kunci ditandai `*kata*` (warna aksen di caption).
- Tag emosi ElevenLabs v3 di teks TTS: `[whispers]`, `[hushed]`, `[scared]`, `[urgent]`. Jeda dengan `...`.
- Seram tapi tidak gore. Makhluk lebih banyak tersirat: siluet, bayangan, tangan, mata, jejak.
- Nama lokal yang sulit diucapkan wajib dicek STT. Kalau salah, pakai ejaan fonetis (contoh: "pot-chong" untuk pocong, "Meh Nahk" untuk Mae Nak, "bah-bee ngeh-pet" untuk babi ngepet) atau splice dari take berbahasa asli (contoh: "Suster Ngesot").

## Voice (ai33 / ElevenLabs v3)
| key | voice id | pakai untuk |
|---|---|---|
| narr | elevenlabs_nDJIICjR9zfJExIFeSCN | narator utama |
| ghost | elevenlabs_nersejR7R1Z5oU9HjCpV | suara hantu (jangan untuk tawa: hasilnya noise) |
| guard | elevenlabs_pqHfZKP75CvOlQylNhV4 | pria tua |
| gran | elevenlabs_wGcFBfKz5yUQqhqr0mVy | nenek |
| mom | elevenlabs_EXAVITQu4vr4xnSDxMaL | ibu |
| man | elevenlabs_iP95p4xoKVk53GoZ742B | pria di telepon (EQ telepon di mix) |

## Episode yang sudah jadi
EP01 Kuntilanak · EP02 Nyi Roro Kidul · EP03 Wewe Gombel · EP04 Pocong · EP05 Ghost Train · EP06 Suster Ngesot · EP07 Kuchisake-onna (Jepang) · EP08 La Llorona (Meksiko) · EP09 Jangsan Tiger (Korea) · EP10 Bloody Mary (AS) · EP11 Tuyul · EP12 Mae Nak (Thailand) · EP13 The Banshee (Irlandia) · EP14 The Elevator Game (Korea) · EP15 Genderuwo · EP16 Hanako-san (Jepang) · EP17 El Silbón (Venezuela) · EP18 Aswang (Filipina) · EP19 Jelangkung · EP20 The Kelpie (Skotlandia) · EP21 Baba Yaga (Rusia) · EP22 Huldra (Norwegia) · EP23 Babi Ngepet · EP24 Ghost Month (Tiongkok) · EP25 Tokoloshe (Afrika Selatan).
Naskah lengkap semua episode ada di `pipeline/episodes.py`.
