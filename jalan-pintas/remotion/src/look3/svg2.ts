// More flat vector sprites for EP01 (same painted style as svg.ts). 700 px = 1 m unless noted.
import { svg, wheelSide } from './svg';

/** One side-view wheel (spins as its own sprite). 360x360. */
export const wheel = () => svg(360, 360, wheelSide(180, 180));

const eyes = (scared: boolean, lx: number, rx: number, y: number, s = 1) => `
  ${[lx, rx].map((x) => `
    <ellipse cx="${x}" cy="${y}" rx="${30 * s}" ry="${(scared ? 40 : 34) * s}" fill="#fbf7f2"/>
    <ellipse cx="${x}" cy="${y}" rx="${30 * s}" ry="${(scared ? 40 : 34) * s}" fill="none" stroke="#1a1010" stroke-width="${6 * s}"/>
    <circle cx="${x + 6 * s}" cy="${y + (scared ? 4 : 10) * s}" r="${(scared ? 9 : 14) * s}" fill="#1a1010"/>
    <circle cx="${x + 2 * s}" cy="${y + (scared ? -2 : 4) * s}" r="${4 * s}" fill="#fff"/>`).join('')}`;

/** Kamu, standing at the shop, front 3/4, phone in both hands, purple screen light on the face. 700x1400. */
export const kamuStand = ({ face = true }: { face?: boolean } = {}) => svg(700, 1400, `
  <radialGradient id="faceP" cx=".5" cy=".7" r=".6"><stop offset="0" stop-color="#b48cff" stop-opacity=".55"/><stop offset="1" stop-color="#b48cff" stop-opacity="0"/></radialGradient>
  <linearGradient id="rimW" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#fff3e0" stop-opacity=".9"/><stop offset=".25" stop-color="#fff3e0" stop-opacity="0"/></linearGradient>
  <ellipse cx="350" cy="1385" rx="190" ry="20" fill="#000" opacity=".5"/>
  <!-- legs -->
  <path d="M262 860 L246 1352 L322 1352 L344 900 Z" fill="url(#jeans)"/>
  <path d="M356 900 L382 1352 L458 1352 L444 860 Z" fill="url(#jeans)"/>
  <path d="M300 900 L306 1340" stroke="#22355a" stroke-width="6" opacity=".6"/>
  <path d="M226 1344 C232 1326 330 1326 336 1344 L338 1378 L222 1378 Z" fill="#eceae4"/><path d="M222 1370 L338 1370" stroke="#9a9a96" stroke-width="7"/>
  <path d="M370 1344 C376 1326 474 1326 480 1344 L482 1378 L366 1378 Z" fill="#eceae4"/><path d="M366 1370 L482 1370" stroke="#9a9a96" stroke-width="7"/>
  <!-- backpack peeking + straps -->
  <rect x="190" y="470" width="60" height="330" rx="24" fill="url(#grey)"/>
  <!-- torso -->
  <path d="M222 900 C206 760 210 600 250 520 C290 470 420 470 460 520 C500 600 504 760 488 900 Z" fill="url(#orange)"/>
  <path d="M460 520 C500 600 504 760 488 900" fill="none" stroke="url(#rimW)" stroke-width="12"/>
  <path d="M300 488 C330 470 380 470 410 488 L396 520 C372 506 338 506 314 520 Z" fill="#c25a16"/>
  <path d="M355 520 L355 880" stroke="#c25a16" stroke-width="5"/>
  <path d="M262 520 C272 600 280 700 284 820" stroke="#3a3f4c" stroke-width="16" fill="none" stroke-linecap="round"/>
  <path d="M440 520 C432 600 428 700 426 820" stroke="#3a3f4c" stroke-width="16" fill="none" stroke-linecap="round"/>
  <rect x="384" y="590" width="70" height="30" rx="5" fill="#fff3e4"/><text x="419" y="612" font-family="Inter, Arial" font-weight="900" font-size="18" fill="#ff6a00" text-anchor="middle">TOKO 24</text>
  <!-- arms to the phone -->
  <path d="M250 540 C214 600 214 690 262 742 C292 760 322 742 330 720" fill="none" stroke="url(#orange)" stroke-width="66" stroke-linecap="round"/>
  <path d="M460 540 C496 600 496 690 448 742 C418 760 388 742 380 720" fill="none" stroke="url(#orange)" stroke-width="66" stroke-linecap="round"/>
  <ellipse cx="330" cy="716" rx="34" ry="28" fill="url(#skin)"/><ellipse cx="382" cy="716" rx="34" ry="28" fill="url(#skin)"/>
  <g transform="rotate(-8 356 690)"><rect x="318" y="626" width="76" height="132" rx="12" fill="#121318"/><rect x="324" y="634" width="64" height="112" rx="8" fill="#9b72ff"/><rect x="330" y="650" width="52" height="16" rx="4" fill="#efe6ff" opacity=".8"/></g>
  <circle cx="356" cy="660" r="120" fill="url(#glowP)" opacity=".5"/>
  <!-- neck + head (no helmet yet) -->
  <rect x="320" y="420" width="70" height="70" rx="22" fill="#8f5a3a"/>
  <circle cx="356" cy="330" r="118" fill="url(#skin)"/>
  <circle cx="356" cy="360" r="118" fill="url(#faceP)"/>
  <path d="M238 320 C232 220 300 190 360 192 C430 194 480 230 476 300 C452 262 400 246 350 252 C300 256 262 282 250 336 Z" fill="#1d140f"/>
  <path d="M250 300 C280 270 320 262 352 268 L330 230 C290 236 258 258 250 300 Z" fill="#2a1d15"/>
  <ellipse cx="240" cy="345" rx="16" ry="26" fill="#9a603e"/>
  ${face ? `${eyes(false, 318, 404, 348, 0.8)}
  <path d="M290 300 C306 294 326 298 340 308" stroke="#2a170f" stroke-width="9" fill="none" stroke-linecap="round"/>
  <path d="M374 308 C388 298 408 294 424 300" stroke="#2a170f" stroke-width="9" fill="none" stroke-linecap="round"/>` : ''}
  <path d="M362 368 C356 392 364 402 374 402" stroke="#6e3f27" stroke-width="6" fill="none" stroke-linecap="round"/>
  ${face ? '<path d="M332 430 C346 422 366 434 384 424" stroke="#3a1712" stroke-width="7" fill="none" stroke-linecap="round"/>' : ''}
  <path d="M470 330 C476 300 470 260 450 236" fill="none" stroke="url(#rimW)" stroke-width="10"/>
`);

/** Kamu's face close-up, front 3/4, open-face helmet. mood: worried | scared. 1000x1200. */
export const faceCU = (mood: 'worried' | 'scared', face = true) => {
  const sc = mood === 'scared';
  return svg(1000, 1200, `
  <linearGradient id="rimC2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b9c8ff" stop-opacity=".9"/><stop offset=".2" stop-color="#b9c8ff" stop-opacity="0"/></linearGradient>
  <!-- shoulders -->
  <path d="M60 1200 C80 1000 220 900 380 880 L620 880 C780 900 920 1000 940 1200 Z" fill="url(#orange)"/>
  <path d="M60 1200 C80 1000 220 900 380 880" fill="none" stroke="url(#rimC2)" stroke-width="16"/>
  <path d="M370 880 C420 920 580 920 630 880 L610 950 C560 980 440 980 390 950 Z" fill="#c25a16"/>
  <path d="M250 930 C270 1000 280 1100 286 1200" stroke="#3a3f4c" stroke-width="40" fill="none"/>
  <!-- neck -->
  <rect x="420" y="760" width="160" height="160" rx="50" fill="#8a5434"/>
  <!-- head -->
  <ellipse cx="500" cy="560" rx="250" ry="270" fill="url(#skin)"/>
  <ellipse cx="260" cy="590" rx="34" ry="56" fill="#9a603e"/>
  <path d="M250 560 C240 420 300 330 380 300 C330 380 320 440 330 520 Z" fill="#1d140f"/>
  ${face ? `${eyes(sc, 410, 600, 560, 1.6)}
  <path d="${sc ? 'M340 452 C370 430 420 424 456 440' : 'M344 470 C376 456 420 456 452 476'}" stroke="#2a170f" stroke-width="18" fill="none" stroke-linecap="round"/>
  <path d="${sc ? 'M548 440 C584 424 634 430 664 452' : 'M552 476 C584 456 628 456 660 470'}" stroke="#2a170f" stroke-width="18" fill="none" stroke-linecap="round"/>` : ''}
  <path d="M520 600 C506 650 520 676 548 676" stroke="#6e3f27" stroke-width="10" fill="none" stroke-linecap="round"/>
  ${!face ? '' : sc ? '<ellipse cx="510" cy="744" rx="40" ry="50" fill="#3a1712"/><ellipse cx="510" cy="760" rx="26" ry="24" fill="#7a2a22"/>'
       : '<path d="M450 740 C478 722 506 750 534 732 C552 722 566 730 576 738" stroke="#3a1712" stroke-width="12" fill="none" stroke-linecap="round"/>'}
  <ellipse cx="350" cy="660" rx="54" ry="26" fill="#d06450" opacity=".25"/><ellipse cx="660" cy="660" rx="54" ry="26" fill="#d06450" opacity=".25"/>
  <path d="M730 470 C748 520 748 548 730 556 C712 548 712 520 730 470 Z" fill="#bfe4ff" stroke="#1a1010" stroke-width="5"/>
  ${sc ? '<path d="M262 520 C276 560 276 584 262 590 C248 584 248 560 262 520 Z" fill="#bfe4ff" stroke="#1a1010" stroke-width="5"/>' : ''}
  <!-- open-face helmet shell + peak -->
  <path d="M220 560 C200 330 340 200 510 200 C680 200 810 320 790 520 L730 500 C690 400 600 360 500 360 C400 360 300 410 270 560 Z" fill="url(#slate)"/>
  <path d="M220 560 C200 330 340 200 510 200" fill="none" stroke="url(#rimC2)" stroke-width="14"/>
  <path d="M300 380 C380 330 640 330 720 380 L760 410 C640 360 380 360 270 410 Z" fill="#2b3348"/>
  <ellipse cx="400" cy="270" rx="90" ry="34" fill="#fff" opacity=".15" transform="rotate(-15 400 270)"/>
  <path d="M260 600 C280 680 330 740 380 770" stroke="#22283a" stroke-width="10" fill="none"/>
  <path d="M760 560 C752 650 700 730 640 770" stroke="#22283a" stroke-width="10" fill="none"/>
`);
};

/** Si Pengendara's helmet, 3/4 front close-up: closed visor, purple pin glint. 1000x1200. */
export const helmetCU = () => svg(1000, 1200, `
  <linearGradient id="rimC3" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b9c8ff" stop-opacity=".95"/><stop offset=".22" stop-color="#b9c8ff" stop-opacity="0"/></linearGradient>
  <path d="M40 1200 C70 1000 220 900 400 880 L640 880 C820 900 950 1010 970 1200 Z" fill="url(#purple)"/>
  <path d="M40 1200 C70 1000 220 900 400 880" fill="none" stroke="url(#rimC3)" stroke-width="18"/>
  <path d="M80 1100 C300 1060 700 1060 950 1100 L955 1150 C700 1110 300 1110 76 1150 Z" fill="#e3e7f0"/>
  <path d="M380 880 C430 840 600 840 650 880 L640 940 C590 910 440 910 392 940 Z" fill="#3e1f99"/>
  <!-- shell -->
  <path d="M200 520 C190 290 340 150 520 150 C720 150 840 300 830 520 C826 680 760 800 640 860 L380 860 C260 800 206 680 200 520 Z" fill="url(#helm)"/>
  <path d="M200 520 C190 290 340 150 520 150" fill="none" stroke="url(#rimC3)" stroke-width="18"/>
  <ellipse cx="380" cy="270" rx="120" ry="44" fill="#fff" opacity=".2" transform="rotate(-22 380 270)"/>
  <rect x="440" y="158" width="150" height="34" rx="17" fill="#4b26ad"/>
  <!-- visor -->
  <path d="M300 430 C320 350 440 320 560 322 C690 326 790 360 806 440 C820 520 800 600 760 630 C680 680 420 680 340 640 C296 610 284 520 300 430 Z" fill="url(#visor)"/>
  <path d="M340 400 C420 352 560 344 680 368" stroke="#ffffff" stroke-width="14" fill="none" opacity=".55" stroke-linecap="round"/>
  <path d="M720 392 L760 420" stroke="#ffffff" stroke-width="10" opacity=".4" stroke-linecap="round"/>
  <circle cx="640" cy="500" r="90" fill="url(#glowP)"/><circle cx="640" cy="500" r="16" fill="#f1e6ff"/>
  <!-- chin bar + vents -->
  <path d="M380 690 C460 720 640 720 720 680 L700 800 C620 840 460 840 400 800 Z" fill="#5a2fc0"/>
  ${[0, 1, 2].map((k) => `<rect x="${500 + k * 44}" y="${740}" width="26" height="12" rx="6" fill="#2a1470"/>`).join('')}
`);

/** Driver's torso, 3/4 front: jacket, reflective stripes, readable JUNED badge, helmet chin at the top. 900x1600. */
export const jacketCU = () => svg(900, 1600, `
  <linearGradient id="rimW2" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#ffe3b8" stop-opacity=".95"/><stop offset=".2" stop-color="#ffe3b8" stop-opacity="0"/></linearGradient>
  <!-- helmet chin (top) -->
  <path d="M220 0 L700 0 C720 120 680 230 600 280 L330 280 C250 230 205 120 220 0 Z" fill="url(#helm)"/>
  <path d="M260 0 C300 80 600 80 660 0 L650 120 C600 170 330 170 280 120 Z" fill="url(#visor)"/>
  <circle cx="560" cy="60" r="60" fill="url(#glowP)"/><circle cx="560" cy="60" r="10" fill="#f1e6ff"/>
  <!-- torso -->
  <path d="M60 1600 C40 1100 90 600 230 380 C300 300 620 300 690 380 C830 600 880 1100 860 1600 Z" fill="url(#purple)"/>
  <path d="M690 380 C830 600 880 1100 860 1600" fill="none" stroke="url(#rimW2)" stroke-width="18"/>
  <path d="M300 330 C380 290 540 290 620 330 L600 400 C540 370 380 370 320 400 Z" fill="#3e1f99"/>
  <path d="M460 390 L460 1600" stroke="#2c1670" stroke-width="10"/>
  <path d="M440 390 L480 390" stroke="#c9cfdb" stroke-width="8"/>
  <!-- reflective stripes (lit) -->
  <path d="M70 880 C300 850 620 850 850 880 L852 950 C620 920 300 920 66 950 Z" fill="#e8ecf5"/>
  <path d="M70 880 C300 850 620 850 850 880" stroke="#ffffff" stroke-width="6" fill="none"/>
  <path d="M60 1060 C300 1030 620 1030 856 1060 L858 1130 C620 1100 300 1100 56 1130 Z" fill="#e8ecf5"/>
  <!-- badge -->
  <rect x="520" y="560" width="250" height="96" rx="8" fill="#f4f0ff"/>
  <rect x="520" y="560" width="250" height="24" rx="8" fill="#7b3fe4"/>
  <text x="645" y="642" font-family="Inter, Arial" font-weight="900" font-size="54" fill="#1a1030" text-anchor="middle">JUNED</text>
  <rect x="120" y="580" width="200" height="60" rx="8" fill="#5a2fc0"/>
  <text x="220" y="622" font-family="Inter, Arial" font-weight="900" font-size="36" fill="#e6dcff" text-anchor="middle">JALANIN</text>
  <ellipse cx="300" cy="520" rx="160" ry="60" fill="#fff" opacity=".1" transform="rotate(-20 300 520)"/>
`);

/** Kamu's hand tapping a shoulder (over-the-shoulder insert). 600x700. */
export const tapHand = () => svg(600, 700, `
  <path d="M0 700 C40 600 120 500 220 430 L300 520 C220 580 140 650 110 700 Z" fill="url(#orange)"/>
  <path d="M190 440 C250 380 330 330 410 320 C470 314 520 330 540 360 C548 380 530 392 500 390 L420 392 C400 420 360 470 300 520 Z" fill="url(#skin)"/>
  ${[0, 1, 2, 3].map((k) => `<path d="M${400 + k * 8} ${330 + k * 22} C${460 + k * 6} ${330 + k * 22} ${530 - k * 6} ${346 + k * 22} ${540 - k * 10} ${366 + k * 24}" stroke="#7f4d31" stroke-width="4" fill="none" opacity=".6"/>`).join('')}
  <path d="M260 420 C250 380 270 350 300 350" stroke="#7f4d31" stroke-width="5" fill="none" opacity=".6"/>
`);

/** Left mirror close-up: one far headlight in the reflection. 900x900. */
export const mirrorCU = () => svg(900, 900, `
  <radialGradient id="mref" cx=".5" cy=".4" r=".7"><stop offset="0" stop-color="#3a1418"/><stop offset="1" stop-color="#0e0608"/></radialGradient>
  <clipPath id="mclip"><ellipse cx="450" cy="400" rx="330" ry="250"/></clipPath>
  <path d="M520 640 C560 720 600 800 620 900" stroke="#2a2d36" stroke-width="30" fill="none"/>
  <ellipse cx="450" cy="400" rx="370" ry="290" fill="#1d1f27"/>
  <ellipse cx="450" cy="400" rx="370" ry="290" fill="none" stroke="#4a4e5c" stroke-width="10"/>
  <g clip-path="url(#mclip)">
    <rect x="80" y="140" width="740" height="540" fill="url(#mref)"/>
    <path d="M80 330 C300 300 600 300 820 330 L820 680 L80 680 Z" fill="#160a0c"/>
    <path d="M300 680 L430 360 L470 360 L600 680 Z" fill="#2a1414"/>
    <path d="M120 360 L420 340 L420 380 L120 470 Z" fill="#241014"/><path d="M780 360 L480 340 L480 380 L780 470 Z" fill="#241014"/>
    <circle cx="452" cy="352" r="150" fill="url(#glowW)"/>
    <circle cx="452" cy="352" r="26" fill="#fffbea"/>
    <ellipse cx="452" cy="420" rx="120" ry="18" fill="#fff0c8" opacity=".25"/>
    <path d="M160 200 C300 170 500 170 700 200" stroke="#ffffff" stroke-width="10" opacity=".12"/>
  </g>
  <path d="M110 330 C140 220 260 150 420 130" stroke="#ffffff" stroke-width="12" fill="none" opacity=".35" stroke-linecap="round"/>
`);

/** Close-up of the scooter's rear: taillight + plate B 4217 KZ. 1200x700. */
export const plateCU = () => svg(1200, 700, `
  <linearGradient id="litW" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#b9bccb"/></linearGradient>
  <path d="M80 300 C80 160 220 90 600 90 C980 90 1120 160 1120 300 L1080 560 C960 640 240 640 120 560 Z" fill="url(#litW)"/>
  <path d="M80 300 C80 160 220 90 600 90 C980 90 1120 160 1120 300" fill="none" stroke="#ffffff" stroke-width="10"/>
  <rect x="300" y="170" width="600" height="110" rx="50" fill="#ff2a2a"/><rect x="340" y="186" width="520" height="26" rx="13" fill="#ffb0b0"/>
  <ellipse cx="600" cy="225" rx="460" ry="180" fill="url(#glowR)" opacity=".7"/>
  <ellipse cx="150" cy="260" rx="40" ry="30" fill="#ffae3a"/><ellipse cx="1050" cy="260" rx="40" ry="30" fill="#ffae3a"/>
  <rect x="300" y="350" width="600" height="190" rx="12" fill="#0d0d10" stroke="#e6e6e6" stroke-width="12"/>
  <text x="600" y="485" font-family="Inter, Arial, sans-serif" font-weight="900" font-size="118" fill="#f4f4f4" text-anchor="middle" textLength="540" lengthAdjust="spacingAndGlyphs">B 4217 KZ</text>
  <rect x="520" y="560" width="160" height="140" rx="40" fill="#26272e"/>
`);

/** The follower: scooter seen from the front, one blazing headlight, rider in silhouette. 800x1400. */
export const followerFront = () => svg(800, 1400, `
  <linearGradient id="sil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1a3a"/><stop offset="1" stop-color="#0a0608"/></linearGradient>
  <ellipse cx="400" cy="1385" rx="200" ry="22" fill="#000" opacity=".6"/>
  <rect x="352" y="1110" width="96" height="270" rx="44" fill="#121216"/>
  <path d="M250 1100 C250 900 300 700 400 680 C500 700 550 900 550 1100 L520 1140 L280 1140 Z" fill="url(#sil)"/>
  <path d="M120 640 L680 640" stroke="#0c0c10" stroke-width="22" stroke-linecap="round"/>
  <!-- rider silhouette -->
  <path d="M200 900 C190 700 230 560 300 500 C360 460 440 460 500 500 C570 560 610 700 600 900 Z" fill="url(#sil)"/>
  <path d="M300 500 C360 460 440 460 500 500" stroke="#7b3fe4" stroke-width="8" fill="none" opacity=".5"/>
  <circle cx="400" cy="380" r="120" fill="url(#sil)"/>
  <path d="M290 330 C300 280 350 260 400 260 C450 260 500 280 510 330" stroke="#7b3fe4" stroke-width="8" fill="none" opacity=".45"/>
  <!-- headlight -->
  <ellipse cx="400" cy="640" rx="64" ry="44" fill="#fffbea"/>
  <circle cx="400" cy="640" r="260" fill="url(#glowW)"/>
`);

/** Both riders seen from the FRONT, stopped: driver's visor stares at us, Kamu peeks over his shoulder. 1000x1400. */
export const ridersFront = ({ headlight = false, face = true, tread = true }: { headlight?: boolean; face?: boolean; tread?: boolean } = {}) => svg(1000, 1400, `
  <linearGradient id="rimR2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff5a4a" stop-opacity=".95"/><stop offset=".35" stop-color="#ff5a4a" stop-opacity="0"/></linearGradient>
  <linearGradient id="litF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2e8e6"/><stop offset="1" stop-color="#9a8c90"/></linearGradient>
  <ellipse cx="500" cy="1386" rx="230" ry="24" fill="#000" opacity=".6"/>
  <!-- passenger behind (peeking, scared) -->
  <path d="M620 700 C640 600 700 560 760 560 C820 566 860 610 870 700 L870 860 L640 860 Z" fill="url(#orange)"/>
  <circle cx="760" cy="470" r="92" fill="url(#skin)"/>
  ${face ? `${eyes(true, 730, 800, 474, 0.75)}
  <path d="M706 440 C722 428 744 428 756 436" stroke="#2a170f" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M780 436 C792 428 812 428 826 440" stroke="#2a170f" stroke-width="8" fill="none" stroke-linecap="round"/>
  <ellipse cx="768" cy="530" rx="16" ry="20" fill="#3a1712"/>` : ''}
  <path d="M664 470 C656 400 700 360 762 360 C826 362 862 404 858 470 L820 456 C800 420 720 420 700 456 Z" fill="url(#slate)"/>
  <path d="M664 470 C656 400 700 360 762 360" fill="none" stroke="url(#rimR2)" stroke-width="7"/>
  <ellipse cx="668" cy="610" rx="34" ry="26" fill="url(#skin)"/>
  <!-- legshield + front fender + front tyre -->
  <rect x="452" y="1150" width="96" height="232" rx="44" fill="#1c1d22"/>
  ${tread ? [0, 1, 2, 3, 4].map((k) => `<rect x="462" y="${1190 + k * 36}" width="76" height="10" rx="5" fill="#3a3c46"/>`).join('') : ''}
  <path d="M410 1150 C410 1110 450 1092 500 1092 C550 1092 590 1110 590 1150 L560 1180 L440 1180 Z" fill="url(#litF)"/>
  <path d="M300 1120 C290 960 330 800 400 740 L600 740 C670 800 710 960 700 1120 C640 1150 360 1150 300 1120 Z" fill="url(#litF)"/>
  <path d="M300 1120 C290 960 330 800 400 740 L600 740 C670 800 710 960 700 1120" fill="none" stroke="url(#rimR2)" stroke-width="9"/>
  <!-- driver legs + shoes -->
  <path d="M310 860 C270 900 250 980 250 1080 L310 1084 C312 1000 330 940 360 900 Z" fill="url(#pants)"/>
  <path d="M690 860 C730 900 750 980 750 1080 L690 1084 C688 1000 670 940 640 900 Z" fill="url(#pants)"/>
  <path d="M226 1076 L320 1076 L320 1112 L226 1112 Z" fill="#16171c"/><path d="M680 1076 L774 1076 L774 1112 L680 1112 Z" fill="#16171c"/>
  <!-- driver torso front -->
  <path d="M300 900 C290 760 310 640 360 580 C400 540 600 540 640 580 C690 640 710 760 700 900 Z" fill="url(#purple)"/>
  <path d="M360 580 C400 540 600 540 640 580" fill="none" stroke="url(#rimR2)" stroke-width="10"/>
  <path d="M296 760 C420 744 580 744 704 760 L706 792 C580 778 420 778 294 792 Z" fill="#e3e7f0"/>
  <path d="M500 560 L500 900" stroke="#2c1670" stroke-width="8"/>
  <rect x="540" y="640" width="90" height="34" rx="4" fill="#f4f0ff"/><text x="585" y="664" font-family="Inter, Arial" font-weight="900" font-size="20" fill="#1a1030" text-anchor="middle">JUNED</text>
  <!-- arms to the grips -->
  <path d="M362 610 C300 640 250 690 220 760" fill="none" stroke="url(#purple)" stroke-width="64" stroke-linecap="round"/>
  <path d="M638 610 C700 640 750 690 780 760" fill="none" stroke="url(#purple)" stroke-width="64" stroke-linecap="round"/>
  <path d="M150 772 L850 772" stroke="#15161b" stroke-width="22" stroke-linecap="round"/>
  <ellipse cx="214" cy="772" rx="38" ry="30" fill="#17171e"/><ellipse cx="786" cy="772" rx="38" ry="30" fill="#17171e"/>
  <path d="M190 760 L160 600" stroke="#2a2d36" stroke-width="9"/><ellipse cx="158" cy="586" rx="36" ry="26" fill="#262932"/>
  <path d="M810 760 L840 600" stroke="#2a2d36" stroke-width="9"/><ellipse cx="842" cy="586" rx="36" ry="26" fill="#262932"/>
  <!-- headset + headlight -->
  <path d="M380 790 C400 740 600 740 620 790 L606 846 C560 870 440 870 394 846 Z" fill="url(#litF)"/>
  <ellipse cx="500" cy="812" rx="70" ry="28" fill="${headlight ? '#fffbea' : '#4a4c56'}"/>
  ${headlight ? '<circle cx="500" cy="812" r="200" fill="url(#glowW)"/>' : '<ellipse cx="480" cy="806" rx="30" ry="8" fill="#8a8c96" opacity=".6"/>'}
  <!-- the helmet, facing us -->
  <g transform="translate(500 400)">
    <path d="M-150 10 C-154 -100 -80 -160 0 -160 C80 -160 154 -100 150 10 C148 84 112 136 58 150 L-58 150 C-112 136 -148 84 -150 10 Z" fill="url(#helm)"/>
    <path d="M-150 10 C-154 -100 -80 -160 0 -160 C80 -160 154 -100 150 10" fill="none" stroke="url(#rimR2)" stroke-width="12"/>
    <path d="M-118 -36 C-110 -74 -56 -92 0 -92 C56 -92 110 -74 118 -36 C124 0 114 34 96 46 C56 60 -56 60 -96 46 C-114 34 -124 0 -118 -36 Z" fill="url(#visor)"/>
    <path d="M-90 -60 C-56 -78 -12 -82 30 -78" stroke="#ffffff" stroke-width="8" fill="none" opacity=".55" stroke-linecap="round"/>
    <circle cx="40" cy="-6" r="54" fill="url(#glowP)"/><circle cx="40" cy="-6" r="10" fill="#f1e6ff"/>
    <path d="M-66 74 C-34 94 34 94 66 74 L62 110 C34 126 -34 126 -62 110 Z" fill="#3a1a90" opacity=".9"/>
    <rect x="-30" y="-158" width="60" height="18" rx="9" fill="#4b26ad"/>
  </g>
`);

/** Side wheel at speed: rim + spokes smeared into rings, one bright mark so rotation reads (no wagon-wheel strobing). 360x360. */
export const wheelBlur = () => svg(360, 360, `
  <radialGradient id="hub"><stop offset="0" stop-color="#d7dce6"/><stop offset="1" stop-color="#7a8294"/></radialGradient>
  <circle cx="180" cy="180" r="171" fill="#15161b"/>
  <circle cx="180" cy="180" r="171" fill="none" stroke="#33363f" stroke-width="6"/>
  ${[150, 160].map((r) => `<circle cx="180" cy="180" r="${r}" fill="none" stroke="#3a3d47" stroke-width="3" opacity=".7"/>`).join('')}
  <circle cx="180" cy="180" r="110" fill="url(#chrome)"/>
  <circle cx="180" cy="180" r="92" fill="#4a505e"/>
  ${[30, 55, 80].map((r) => `<circle cx="180" cy="180" r="${r}" fill="none" stroke="#8f97a8" stroke-width="10" opacity=".45"/>`).join('')}
  <circle cx="180" cy="180" r="34" fill="url(#hub)"/><circle cx="180" cy="180" r="14" fill="#4a4f5e"/>
  <path d="M180 18 A 162 162 0 0 1 300 70" stroke="#6a6e7c" stroke-width="9" fill="none" stroke-linecap="round"/>
  <rect x="172" y="96" width="16" height="30" rx="6" fill="#e8ecf4"/>
`);

/** Scrolling tyre tread (seen from behind/front): light bands on transparent, repeats vertically. 64x128. */
export const treadStrip = () => svg(64, 128, `
  <rect x="0" y="0" width="64" height="128" fill="#26272e"/>
  <rect x="6" y="10" width="52" height="14" rx="6" fill="#4e505c"/><rect x="6" y="74" width="52" height="14" rx="6" fill="#4e505c"/>
  <rect x="0" y="0" width="10" height="128" fill="#5a5c68" opacity=".55"/>
`);
