# horror luar

Pipeline produksi short horor legenda (9:16, 50–60 detik, VO Inggris) dengan Remotion + aset SVG. Repo ini berisi brief, arahan visual dan audio, naskah semua episode, script pipeline, dan library aset dari EP01–EP20. File video tidak disertakan.

## Isi
| Path | Isi |
|---|---|
| `docs/FORMAT.md` | Format seri: struktur 13 shot, aturan naskah, voice, daftar episode |
| `docs/VISUAL_DIRECTION.md` | Arahan visual: gaya, komposisi, konstruksi karakter, aturan teknis, caption |
| `docs/AUDIO.md` | Arahan audio: VO, retime, mix, loudness, QC |
| `docs/AGENT_BRIEF.md` | Brief untuk agent yang menggambar set (dipakai per episode) |
| `episodes/<ep>/STYLE.md` | Palet, karakter, dan pembagian set per episode |
| `pipeline/` | `episodes.py` (naskah), scaffold, generate audio, build mix, QC, antrean render, builder library |
| `library/` | Kode SVG semua episode, 87 SFX, thumbnail shot, `catalog.json`, `LIBRARY.md`, galeri `index.html` |
| `library/template/` | Kit Remotion untuk memulai episode baru |

## Alur episode baru
1. Tambah episode di `pipeline/episodes.py`.
2. `python3 scaffold.py epNN`
3. `python3 -I gen_audio_all.py epNN` (butuh env `AI33_API_KEY`)
4. 3 agent per episode, satu per set, mengikuti `docs/AGENT_BRIEF.md`. Cek library dulu sebelum menggambar dari nol.
5. `python3 -I build_audio_ep.py epNN`
6. `node scripts/bake.mjs` lalu `node scripts/contact.mjs 0.6`, review contact sheet, perbaiki
7. `./render_q.sh epNN:EPNN-nama` (render, grain, QC, commit)
8. `python3 -I build_library.py` untuk memperbarui library

Galeri library juga tersedia sebagai artifact di claude.ai.
