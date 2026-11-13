# Visual set brief (all set agents follow this)

You build the visuals for ONE set of a short (≈55 s, 9:16) horror-legend video in a Remotion project. SVG vector only.

## Read first (in your project dir)
- `STYLE.md` (all sections: detail budget, palette, characters, polish rules, character construction, tech rules).
- `src/data/episode.json`: your shots (framing, camera, hero, notes, words, caption flag).
- Kit: `src/comp/Camera.tsx` (useShot, BandImg, Live, Cam, handheld, ramp, EIO), `src/data/ep.ts` (wordAt, spanOf), `src/comp/Overlays.tsx` (CAPTION_FONT, GREEN = this episode's accent colour).
- Good reference implementations with the same kit: `/home/user/ep07/src/shots/C.tsx` + `/home/user/ep07/src/art/close_face.tsx` (close-ups, mask/eyes), `/home/user/ep07/src/shots/S.tsx` + `/home/user/ep07/src/sets/street.tsx` (wide sets with figures), `/home/user/ep05/src/shots/G.tsx` (graphic/title/CTA), `/home/user/ep06/src/shots/C.tsx` + `/home/user/ep06/src/art/close_art.tsx` (hands, trails).

- Asset library: `/home/user/library/LIBRARY.md` (+ `catalog.json`, shot thumbnails in `thumbs/<ep>/sNN.jpg`). Before drawing a character, hand, face or prop from scratch, look for one there; to reuse it, copy its whole source file into a NEW file `src/art/<set>_<name>.tsx`, fix its relative imports, then restyle via props/palette.

## Ownership
Edit ONLY `src/sets/<set>.tsx`, `src/shots/<OWNER>.tsx` and NEW files `src/art/<set>_*.tsx`. Other agents edit other sets of the same project in parallel; never touch anything else. Do NOT git commit, do NOT run `bake.mjs`, `contact.mjs` or a render.

## Rules
- Timing comes from the real voice-over and may change: animate on relative progress only, sync beats with `wordAt(id, /regex/, fallbackFraction)`. Never hardcode absolute frames.
- Captions (global) start at 74% of frame height on shots with `caption: true`: keep heroes above 72%. Graphic shots with `caption: false` draw their own text inside a 920 px safe width; CTA words appear on their `words[]` times, capped so all text is fully visible ≥0.5 s before the shot ends.
- Title fonts via `@remotion/google-fonts` (Cinzel / Marcellus / Cormorant / Oswald…). For Japanese/Korean/Thai glyphs use a Noto font that has them and check they render.
- No 3D, no per-frame filters, no mix-blend-mode, no box-shadow glows (glow = radial gradients), hard cuts only, no glitch/flash/transition effects, no grain (added at encode).
- Eerie, never gory. Ghosts are mostly implied: silhouettes, hair, hands, reflections, eyes.
- Reuse one set of bands across your shots via camera crop/zoom/parallax; live elements via `<Live>`.

## Workflow (mandatory)
edit → `node scripts/preview.mjs <set> <ids>` (bakes only your bands, 3 stills per shot, strip at `out/preview/<set>.jpg`) → Read the strip critically (silhouette test, clear focal point, composition, caption zone, no stray artifacts, nothing reading as the wrong object) → fix → repeat. Do at least 3 preview loops; do not stop early unless every shot is clearly polished. Use ALL the time until the HARD STOP. At the end `npx tsc -p . 2>&1 | grep -E "<set>|shots/<OWNER>"` must print nothing.

## Report
One short Indonesian paragraph: what each shot shows, what is still weak.
