# EP22 Huldra — style guide (all agents MUST follow)

## Look
Semi-realistic stylized vector, **layered silhouettes against rich gradient light** (shadow-puppet / cinematic poster feel).
Detail lives in composition, light and the HERO element, not in background texture.

## Detail budget (the speed rule)
- **Everything else = LOW detail**: flat fills or 2–3 stop gradients, simple silhouettes, max ~6 shapes per background element, no textures, no micro props, no per-element rim light, no noise.
- Reuse within your set: one set of bands serves all your shots via camera crop/zoom/parallax.

## Palette
- Norwegian mountain forest under the midnight sun: pale gold sky `#f3d9a4` fading to lilac `#9c8fb3`, tall pines `#16241c`, mossy rocks `#4b5b3e`, ferns, a mountain lake glint.
- Mountain summer farm (seter): turf-roof log cabin `#4a3626` with grass on top, wooden fence, goats `#e7e2d6` with bells.
- The huldra: tall beautiful woman, long golden hair `#e8c873`, simple linen dress `#d9d1bf`; from behind a cow's tail and a back hollow like a rotten tree `#3b2a1e`. Never gory.
- Accent / caption keywords `#a6e3a1`.

## Characters (no detailed faces)
- Narrator's brother (~16): wool sweater, cap, a herding stick, seen from behind / side.
- The huldra: beautiful from the front (soft smile, golden hair, no detailed face), uncanny from behind: a cow's tail under the dress, a hollow bark-like back.

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
- `woods` (owner W, file src/shots/W.tsx): pine forest under the midnight sun: trees, rocks, the huldra between the pines
- `farm` (owner M, file src/shots/M.tsx): mountain summer farm: turf-roof cabin, goats, fence, the path down the mountain
- `graphic` (owner G, file src/shots/G.tsx): title, lore, CTA
