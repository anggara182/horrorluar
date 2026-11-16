# EP21 Baba Yaga — style guide (all agents MUST follow)

## Look
Semi-realistic stylized vector, **layered silhouettes against rich gradient light** (shadow-puppet / cinematic poster feel).
Detail lives in composition, light and the HERO element, not in background texture.

## Detail budget (the speed rule)
- **Everything else = LOW detail**: flat fills or 2–3 stop gradients, simple silhouettes, max ~6 shapes per background element, no textures, no micro props, no per-element rim light, no noise.
- Reuse within your set: one set of bands serves all your shots via camera crop/zoom/parallax.

## Palette
- Russian winter forest at night: birch trunks `#cfd3d6` with dark marks, spruce silhouettes `#0a1210`, deep snow `#d8e2ea` in blue shadow `#5d6f85`, moon `#e9eef5`.
- The hut: dark log cabin `#3a2b20` with a mossy roof, one warm window `#ffb35c`, standing on two giant scaly chicken legs `#8a7a62` with talons; wisps of chimney smoke.
- Inside: clay oven glow `#ff8a3d`, iron pot, drying herbs, skulls only as dim shapes on a shelf (never gory).
- Baba Yaga: tiny bent old woman, huge hooked nose, wild grey hair `#b9b4aa`, headscarf `#5a2a2a`, a glint of iron teeth; seen in firelight profile or silhouette.
- Accent / caption keywords `#ff9e4a`.

## Characters (no detailed faces)
- Grandmother as a girl (~10): red wool coat `#9b2d2d`, headscarf, felt boots, seen from behind / side in the snow.
- Baba Yaga: tiny, hunched old witch with a hooked nose, iron teeth glint, wild grey hair; eerie-folkloric, never gory.

## Tech rules
- World space 1296x2304 (`src/art/world.ts`), frame 1080x1920. Bands: `Record<string, BandSpec>` in your `src/sets/<set>.tsx`, ids `"<set>/<band>"`, optional `blur` (applied once at bake). 3–4 bands per set max.
- Shots: `src/shots/<OWNER>.tsx` exporting `Sxx` components; use `useShot()` progress (relative), `BandImg`, `Live`, `Cam`, `handheld`, `ramp`, `EIO` from `src/comp/Camera.tsx`. Never hardcode absolute frames.
- NO per-frame blur/filters, NO mix-blend-mode, NO box-shadow glows. Glow = radial gradient shapes.
- Hard cuts only. NO light leaks, NO transitions, NO glitch / chromatic aberration / flashes / shakes-as-effects. Grain + vignette + captions are global (don't draw them). Keep the HERO out of the caption zone (y > 69% of frame) when the shot has a caption.

## Polish rules (v3)
- Every shot needs ONE clear focal point: put the HERO against the lightest area behind it (value contrast), give it a rim light, and keep everything else darker/lower contrast.
- 3 depth layers minimum (fg dark silhouette framing, mid with the hero, bg light/sky). Foreground framing elements (leaves, stalk edges) are cheap and add a lot.
- Composition: hero on a third, never cut at the head or feet by the frame edge unless it's a deliberate extreme close-up. Keep the hero above 72% of frame height (captions now smaller, start at 74%) when the shot has a caption.

## Character construction (build from primitives, then check the silhouette in preview)
- Proportions: adult head ≈ 1/7 of height; child (~7 y) ≈ 1/5.
- Build: head ellipse → neck → torso path (shoulders wider than waist) → limbs as tapered paths with elbow/knee bends → hands as simple mittens with 1–2 finger separations. Hair as one big shape + 4–8 strand strokes + rim strokes.
- Silhouette test: if the hero filled in solid black is not recognisable, fix the shape before adding detail.

## Self-check workflow (mandatory)
1. Write the set + shots. 2. `node scripts/preview.mjs <set> <ids>` (bakes ONLY your bands, renders 3 stills per shot at 15/50/90%, strip at out/preview/<set>.jpg, ~30–60 s). 3. LOOK at the strip with the Read tool and fix what reads wrong. 4. Preview once more. Stop.

## Sets in this episode
- `forest` (owner F, file src/shots/F.tsx): snowy birch forest at night and dawn, the hut on chicken legs outside, the village far away
- `hut` (owner H, file src/shots/H.tsx): inside the hut: oven, pot, Baba Yaga, close-ups, the yarn
- `graphic` (owner G, file src/shots/G.tsx): title, lore, CTA
