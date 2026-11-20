# Arahan audio

- **VO:** 2 take per baris (ElevenLabs v3 via ai33). Take dipilih otomatis dari skor transkrip; take yang berupa noise datar ditolak.
- **Retime:** shot mengikuti VO asli. Tempo default 1.05 (bisa per episode), jeda panjang antar kata dipendekkan ke maks 0,45 dtk, lalu timing setiap kata ditulis ulang ke `episode.json` (caption & animasi ikut).
- **Durasi target:** 50–60 detik. Kalau lebih, naikkan tempo per episode atau pendekkan jeda; jangan sampai narasi terasa terburu-buru.
- **Mix:** bed (ambience, drone) dinormalisasi ke −30 LUFS, SFX ke −24 LUFS. Bed di-duck kuat di bawah VO, SFX di-duck ringan, ada kantong EQ di 2,5 kHz pada bed supaya VO jelas.
- **Tidak boleh ada overlap volume:** antar cue SFX tidak saling menimpa (dicek otomatis), VO minimal ~13 dB di atas background di setiap kata.
- **Master:** −14 LUFS integrated, limiter peak −1,4 dBFS.
- **QC akhir:** spesifikasi file, durasi vs `episode.json`, loudness, dan offset audio (cross-correlation) harus 0 ms.
- **SFX library:** `library/sfx/` (117 file, prompt asal tercatat di `library/catalog.json`). Tiga take `laugh_ghost*` noise, jangan dipakai.
