// Flat vector sprites (SVG strings). Shading, rim light and glints are painted in. Units: 700 px = 1 m.
export const PX_PER_M = 700;

const defs = `
<linearGradient id="white" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#d6dbe8"/><stop offset="1" stop-color="#8e95b0"/></linearGradient>
<linearGradient id="purple" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#9a68ff"/><stop offset=".5" stop-color="#6b3fd0"/><stop offset="1" stop-color="#3b1e8a"/></linearGradient>
<linearGradient id="helm" x1=".2" y1="0" x2=".7" y2="1"><stop offset="0" stop-color="#a77bff"/><stop offset=".45" stop-color="#7b3fe4"/><stop offset="1" stop-color="#3a1a90"/></linearGradient>
<linearGradient id="orange" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#ffbd6a"/><stop offset=".5" stop-color="#ff8a2a"/><stop offset="1" stop-color="#b9501a"/></linearGradient>
<linearGradient id="pants" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#454a5c"/><stop offset="1" stop-color="#1c1e27"/></linearGradient>
<linearGradient id="jeans" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a6aa0"/><stop offset="1" stop-color="#22355a"/></linearGradient>
<linearGradient id="grey" x1="0" y1="0" x2=".2" y2="1"><stop offset="0" stop-color="#8b92a6"/><stop offset="1" stop-color="#454b5c"/></linearGradient>
<linearGradient id="skin" x1="0" y1="0" x2=".4" y2="1"><stop offset="0" stop-color="#c08259"/><stop offset="1" stop-color="#7f4d31"/></linearGradient>
<linearGradient id="slate" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#62719a"/><stop offset="1" stop-color="#28314a"/></linearGradient>
<linearGradient id="visor" x1="0" y1="0" x2=".4" y2="1"><stop offset="0" stop-color="#2a2840"/><stop offset=".5" stop-color="#0b0a14"/><stop offset="1" stop-color="#020205"/></linearGradient>
<linearGradient id="chrome" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eef1f7"/><stop offset=".5" stop-color="#9aa2b4"/><stop offset="1" stop-color="#5a6174"/></linearGradient>
<linearGradient id="seat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b3d48"/><stop offset="1" stop-color="#111217"/></linearGradient>
<radialGradient id="glowW"><stop offset="0" stop-color="#fff8e0" stop-opacity="1"/><stop offset=".25" stop-color="#fff0c8" stop-opacity=".55"/><stop offset="1" stop-color="#fff0c8" stop-opacity="0"/></radialGradient>
<radialGradient id="glowR"><stop offset="0" stop-color="#ff4040" stop-opacity=".9"/><stop offset="1" stop-color="#ff2020" stop-opacity="0"/></radialGradient>
<radialGradient id="glowP"><stop offset="0" stop-color="#c9a6ff" stop-opacity="1"/><stop offset=".3" stop-color="#8a4dff" stop-opacity=".6"/><stop offset="1" stop-color="#8a4dff" stop-opacity="0"/></radialGradient>
`;

const svg = (w: number, h: number, body: string, extraDefs = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${defs}${extraDefs}</defs>${body}</svg>`;

const wheelSide = (cx: number, cy: number) => `
  <circle cx="${cx}" cy="${cy}" r="171" fill="#15161b"/>
  <circle cx="${cx}" cy="${cy}" r="171" fill="none" stroke="#33363f" stroke-width="6"/>
  <path d="M ${cx - 150} ${cy - 60} A 160 160 0 0 1 ${cx + 40} ${cy - 160}" fill="none" stroke="#4a4e5c" stroke-width="7" stroke-linecap="round" opacity=".8"/>
  <circle cx="${cx}" cy="${cy}" r="110" fill="url(#chrome)"/>
  <circle cx="${cx}" cy="${cy}" r="92" fill="#3a3f4c"/>
  ${[0, 72, 144, 216, 288].map((a) => `<rect x="${cx - 9}" y="${cy - 92}" width="18" height="92" rx="8" fill="#b9c0ce" transform="rotate(${a} ${cx} ${cy})"/>`).join('')}
  <circle cx="${cx}" cy="${cy}" r="34" fill="#c9cfdb"/><circle cx="${cx}" cy="${cy}" r="14" fill="#4a4f5e"/>`;

/** Two riders on the white matic, side view, heading right. Warm rim light from the shop behind. 1600x1400. */
export const ridersSide = () => svg(1600, 1400, `
  <linearGradient id="rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe3b8" stop-opacity=".95"/><stop offset=".35" stop-color="#ffe3b8" stop-opacity="0"/></linearGradient>
  <!-- engine, swingarm, muffler -->
  <path d="M300 1060 L650 1040 L670 1150 L360 1205 Z" fill="#2f333e"/>
  <rect x="330" y="1050" width="300" height="105" rx="44" fill="#4a4f5e"/><rect x="350" y="1062" width="250" height="20" rx="10" fill="#6a7083" opacity=".6"/>
  ${wheelSide(330, 1189)}
  ${wheelSide(1230, 1189)}
  <rect x="150" y="1108" width="370" height="58" rx="29" fill="url(#chrome)" transform="rotate(-4 330 1137)"/>
  <rect x="300" y="1112" width="150" height="50" rx="20" fill="#3a3e4a" opacity=".85" transform="rotate(-4 330 1137)"/>
  <!-- fork -->
  <path d="M1218 1190 L1186 960" stroke="#a3abbd" stroke-width="26" stroke-linecap="round"/>
  <!-- floorboard + lower panel -->
  <path d="M820 1098 L1092 1098 L1068 1150 L858 1150 Z" fill="url(#white)"/>
  <rect x="840" y="1066" width="232" height="36" rx="12" fill="#2a2d37"/>
  <!-- rear cowl -->
  <path d="M185 948 C190 915 240 905 300 905 L815 905 C850 910 866 945 862 990 L858 1070 C760 1086 640 1086 560 1070 C535 1010 480 985 420 983 C360 982 320 990 280 1000 C230 1006 190 985 185 948 Z" fill="url(#white)"/>
  <path d="M185 948 C190 915 240 905 300 905 L815 905 C850 910 866 945 862 990" fill="none" stroke="url(#rim)" stroke-width="10"/>
  <path d="M300 1030 C420 1000 560 1010 700 1050" stroke="#aab1c6" stroke-width="5" fill="none" opacity=".7"/>
  <path d="M186 930 C195 915 215 912 232 915 L230 962 C210 964 192 956 186 945 Z" fill="#ff2a2a"/>
  <circle cx="205" cy="940" r="70" fill="url(#glowR)"/>
  <ellipse cx="245" cy="982" rx="14" ry="10" fill="#ffae3a"/>
  <path d="M300 900 C270 892 235 895 222 908" stroke="url(#chrome)" stroke-width="12" fill="none" stroke-linecap="round"/>
  <!-- seat -->
  <path d="M258 906 C252 880 290 866 340 864 L760 870 C805 872 822 890 816 906 Z" fill="url(#seat)"/>
  <path d="M300 868 L760 872" stroke="#5a5d6a" stroke-width="5" opacity=".7"/>
  <!-- front body + fender + headset -->
  <path d="M1060 1102 C1060 980 1090 860 1130 760 C1150 715 1185 690 1225 692 L1265 700 C1295 740 1305 820 1300 900 C1296 990 1270 1060 1220 1095 C1170 1110 1110 1110 1060 1102 Z" fill="url(#white)"/>
  <path d="M1130 760 C1150 715 1185 690 1225 692 L1265 700" fill="none" stroke="url(#rim)" stroke-width="9"/>
  <path d="M1095 1062 C1150 985 1310 985 1378 1060 L1362 1076 C1300 1012 1160 1010 1108 1076 Z" fill="url(#white)"/>
  <path d="M1110 692 C1120 642 1170 610 1230 612 C1282 614 1312 640 1314 675 C1302 702 1252 714 1190 714 C1150 714 1115 706 1110 692 Z" fill="url(#white)"/>
  <path d="M1110 692 C1120 642 1170 610 1230 612" fill="none" stroke="url(#rim)" stroke-width="9"/>
  <ellipse cx="1300" cy="664" rx="22" ry="32" fill="#fffbe6"/>
  <path d="M1160 632 L1130 512" stroke="#2a2d36" stroke-width="9" stroke-linecap="round"/>
  <ellipse cx="1126" cy="498" rx="27" ry="42" fill="#262932"/><ellipse cx="1130" cy="498" rx="17" ry="31" fill="#9fb6e0"/>
  <path d="M1155 640 L1060 624" stroke="#15161b" stroke-width="28" stroke-linecap="round"/>
  <!-- ===== passenger (behind) ===== -->
  <rect x="252" y="598" width="124" height="236" rx="34" fill="url(#grey)"/>
  <rect x="268" y="700" width="70" height="100" rx="16" fill="#3f4454"/>
  <path d="M256 640 C262 610 300 600 330 602" stroke="url(#rim)" stroke-width="8" fill="none"/>
  <path d="M378 890 C440 858 590 858 625 878 C642 905 632 936 606 941 L398 946 Z" fill="url(#jeans)"/>
  <path d="M582 890 C612 884 632 900 630 926 L612 1072 L560 1074 L576 920 Z" fill="url(#jeans)"/>
  <path d="M544 1062 C566 1048 640 1050 656 1072 L656 1094 L544 1094 Z" fill="#eceae4"/><path d="M544 1090 L656 1090" stroke="#9a9a96" stroke-width="6"/>
  <path d="M338 906 C323 780 330 660 370 600 C410 560 492 565 522 600 C552 650 554 760 542 906 Z" fill="url(#orange)"/>
  <path d="M338 906 C323 780 330 660 370 600 C410 560 492 565 522 600" fill="none" stroke="url(#rim)" stroke-width="9"/>
  <path d="M410 578 C440 566 480 566 505 580 L495 602 C470 592 440 592 418 600 Z" fill="#c25a16"/>
  <path d="M370 610 C395 650 410 700 418 760" stroke="#3a3f4c" stroke-width="14" fill="none" stroke-linecap="round"/>
  <rect x="470" y="660" width="46" height="18" rx="4" fill="#fff3e4" opacity=".9"/>
  <!-- near arm up to the phone -->
  <path d="M488 612 C530 622 562 682 566 722 C563 748 540 752 528 740 C510 702 490 662 470 642 Z" fill="url(#orange)"/>
  <path d="M534 722 C560 700 598 642 608 616 C624 608 642 620 638 642 C626 672 592 722 560 752 Z" fill="url(#skin)"/>
  <ellipse cx="622" cy="614" rx="24" ry="20" fill="#a86c48"/>
  <circle cx="566" cy="520" r="150" fill="url(#glowP)" opacity=".45"/>
  <g transform="rotate(-28 604 566)"><rect x="582" y="522" width="44" height="84" rx="9" fill="#121318"/><rect x="587" y="528" width="34" height="72" rx="5" fill="#9b72ff"/></g>
  <!-- head + open-face helmet -->
  <circle cx="470" cy="470" r="98" fill="url(#skin)"/>
  <path d="M380 470 C378 520 402 552 430 565 C410 520 405 480 420 450 Z" fill="#1a120d"/>
  <ellipse cx="438" cy="486" rx="14" ry="20" fill="#9a603e"/>
  <ellipse cx="522" cy="472" rx="17" ry="21" fill="#fbf7f2"/><circle cx="529" cy="481" r="9" fill="#1a1010"/><circle cx="526" cy="476" r="3" fill="#fff"/>
  <path d="M498 438 C515 432 534 436 548 446" stroke="#2a170f" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M562 478 C574 494 572 508 560 512" stroke="#6e3f27" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M528 530 C538 524 548 532 556 526" stroke="#3a1712" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M556 420 C566 438 566 448 556 452 C546 448 546 438 556 420 Z" fill="#bfe4ff" stroke="#1a1010" stroke-width="3"/>
  <path d="M370 474 C362 388 420 350 482 352 C542 354 578 392 580 432 L522 426 C480 414 420 432 396 482 Z" fill="url(#slate)"/>
  <path d="M370 474 C362 388 420 350 482 352 C542 354 578 392 580 432" fill="none" stroke="url(#rim)" stroke-width="8"/>
  <path d="M560 424 C584 426 606 436 612 448 L566 444 Z" fill="#2b3348"/>
  <path d="M410 500 C430 540 470 562 500 566" stroke="#22283a" stroke-width="6" fill="none"/>
  <!-- ===== driver ===== -->
  <path d="M640 880 C700 850 860 845 905 860 C932 880 926 922 900 932 C840 942 720 946 650 936 Z" fill="url(#pants)"/>
  <path d="M858 880 C900 868 936 884 936 910 L952 1070 L890 1076 L864 920 Z" fill="url(#pants)"/>
  <path d="M880 1060 C900 1046 990 1048 1012 1070 L1012 1094 L880 1094 Z" fill="#16171c"/><path d="M880 1090 L1012 1090" stroke="#3c3f4a" stroke-width="6"/>
  <path d="M610 900 C590 780 605 660 650 580 C690 530 760 520 805 545 C845 575 850 640 835 700 C820 780 792 860 782 900 Z" fill="url(#purple)"/>
  <path d="M610 900 C590 780 605 660 650 580 C690 530 760 520 805 545" fill="none" stroke="url(#rim)" stroke-width="10"/>
  <path d="M640 640 C620 720 618 820 630 900 L610 900 C592 800 596 700 622 620 Z" fill="#2c1670" opacity=".6"/>
  <path d="M598 758 C680 744 760 740 842 742 L839 772 C760 772 680 776 602 790 Z" fill="#e3e7f0"/>
  <path d="M604 820 C680 810 760 806 830 808 L826 836 C760 836 680 840 606 850 Z" fill="#e3e7f0"/>
  <path d="M700 546 C730 520 790 520 816 548 L800 572 C775 552 735 554 712 570 Z" fill="#3e1f99"/>
  <rect x="792" y="640" width="36" height="15" rx="2" fill="#f4f0ff"/>
  <path d="M758 560 C820 560 902 620 926 660 C932 690 906 706 880 696 C840 660 790 632 750 622 Z" fill="url(#purple)"/>
  <path d="M880 660 C940 640 1020 624 1066 614 C1082 630 1076 656 1056 661 C1000 673 930 690 890 702 Z" fill="url(#purple)"/>
  <path d="M1000 628 L1012 668" stroke="#e3e7f0" stroke-width="16"/>
  <ellipse cx="1076" cy="630" rx="36" ry="29" fill="#17171e"/>
  <!-- full-face helmet, visor closed -->
  <path d="M660 440 C655 350 720 300 790 302 C870 305 906 370 902 440 C900 502 872 542 830 550 L700 550 C670 532 662 492 660 440 Z" fill="url(#helm)"/>
  <path d="M660 440 C655 350 720 300 790 302 C870 305 906 370 902 440" fill="none" stroke="url(#rim)" stroke-width="11"/>
  <path d="M800 368 C862 370 898 400 900 442 C900 472 886 494 860 498 L800 494 C788 462 788 400 800 368 Z" fill="url(#visor)"/>
  <path d="M812 384 C842 384 868 396 882 414" stroke="#ffffff" stroke-width="6" fill="none" opacity=".55" stroke-linecap="round"/>
  <circle cx="860" cy="448" r="34" fill="url(#glowP)"/><circle cx="860" cy="448" r="6" fill="#efe2ff"/>
  <rect x="726" y="304" width="70" height="16" rx="8" fill="#4b26ad"/>
  <ellipse cx="736" cy="352" rx="46" ry="18" fill="#fff" opacity=".22" transform="rotate(-18 736 352)"/>
`);

/** From behind (the follower's view): passenger's back + backpack, driver's helmet TURNED to face the camera. 1000x1400. */
export const ridersBack = () => svg(1000, 1400, `
  <linearGradient id="rimR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff5a4a" stop-opacity=".95"/><stop offset=".4" stop-color="#ff5a4a" stop-opacity="0"/></linearGradient>
  <linearGradient id="lit" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6ea"/><stop offset="1" stop-color="#c9b8b0"/></linearGradient>
  <!-- driver's arms + handlebar + mirrors (behind everything) -->
  <path d="M170 712 L830 712" stroke="#15161b" stroke-width="22" stroke-linecap="round"/>
  <path d="M210 700 L186 560" stroke="#2a2d36" stroke-width="9"/><ellipse cx="184" cy="548" rx="34" ry="24" fill="#262932"/>
  <path d="M790 700 L814 560" stroke="#2a2d36" stroke-width="9"/><ellipse cx="816" cy="548" rx="34" ry="24" fill="#262932"/>
  <path d="M330 600 C300 640 270 680 250 712 L290 735 C312 700 340 660 370 630 Z" fill="url(#purple)"/>
  <path d="M670 600 C700 640 730 680 750 712 L710 735 C688 700 660 660 630 630 Z" fill="url(#purple)"/>
  <ellipse cx="248" cy="716" rx="32" ry="26" fill="#17171e"/><ellipse cx="752" cy="716" rx="32" ry="26" fill="#17171e"/>
  <!-- driver's back/shoulders -->
  <path d="M318 640 C326 560 398 520 500 516 C602 520 674 560 682 640 L686 760 L314 760 Z" fill="url(#purple)"/>
  <path d="M318 640 C326 560 398 520 500 516 C602 520 674 560 682 640" fill="none" stroke="url(#rimR)" stroke-width="12"/>
  <path d="M314 700 L686 700 L686 726 L314 726 Z" fill="#e3e7f0" opacity=".9"/>
  <!-- the helmet, turned around: visor faces us -->
  <g transform="translate(598 352)">
    <path d="M-132 4 C-136 -92 -70 -142 4 -142 C80 -142 136 -92 132 4 C130 70 100 116 52 128 L-50 128 C-100 116 -130 70 -132 4 Z" fill="url(#helm)"/>
    <path d="M-132 4 C-136 -92 -70 -142 4 -142 C80 -142 136 -92 132 4" fill="none" stroke="url(#rimR)" stroke-width="12"/>
    <path d="M-104 -34 C-96 -66 -50 -82 4 -82 C58 -82 102 -66 108 -34 C114 0 104 30 86 40 C50 52 -46 52 -86 40 C-104 30 -110 0 -104 -34 Z" fill="url(#visor)"/>
    <path d="M-80 -54 C-50 -70 -10 -74 30 -70" stroke="#ffffff" stroke-width="8" fill="none" opacity=".6" stroke-linecap="round"/>
    <path d="M60 -60 L84 -44" stroke="#ffffff" stroke-width="6" opacity=".5" stroke-linecap="round"/>
    <circle cx="36" cy="-6" r="46" fill="url(#glowP)"/><circle cx="36" cy="-6" r="9" fill="#f1e6ff"/>
    <path d="M-60 64 C-30 82 30 82 60 64 L56 96 C30 110 -30 110 -56 96 Z" fill="#3a1a90" opacity=".9"/>
    <rect x="-26" y="-140" width="52" height="16" rx="8" fill="#4b26ad"/>
  </g>
  <!-- scooter rear -->
  <rect x="440" y="1120" width="120" height="236" rx="46" fill="#141519"/><rect x="452" y="1300" width="96" height="40" rx="16" fill="#2a2c34"/>
  <path d="M330 1000 C330 930 380 900 500 900 C620 900 670 930 670 1000 L642 1112 C600 1144 400 1144 358 1112 Z" fill="url(#lit)"/>
  <path d="M330 1000 C330 930 380 900 500 900 C620 900 670 930 670 1000" fill="none" stroke="url(#rimR)" stroke-width="9"/>
  <rect x="404" y="956" width="192" height="42" rx="18" fill="#ff2a2a"/><rect x="420" y="962" width="160" height="10" rx="5" fill="#ff9a9a"/>
  <ellipse cx="500" cy="977" rx="210" ry="90" fill="url(#glowR)" opacity=".8"/>
  <ellipse cx="348" cy="988" rx="16" ry="12" fill="#ffae3a"/><ellipse cx="652" cy="988" rx="16" ry="12" fill="#ffae3a"/>
  <rect x="398" y="1036" width="204" height="66" rx="6" fill="#0d0d10" stroke="#e6e6e6" stroke-width="5"/>
  <text x="500" y="1083" font-family="Inter, Arial, sans-serif" font-weight="800" font-size="44" fill="#f4f4f4" text-anchor="middle">B 4217 KZ</text>
  <!-- passenger legs + shoes on pegs -->
  <path d="M352 900 C330 940 310 990 300 1060 L350 1064 C356 1000 372 950 392 920 Z" fill="url(#jeans)"/>
  <path d="M648 900 C670 940 690 990 700 1060 L650 1064 C644 1000 628 950 608 920 Z" fill="url(#jeans)"/>
  <path d="M276 1056 L362 1056 L362 1092 L276 1092 Z" fill="#eceae4"/><path d="M638 1056 L724 1056 L724 1092 L638 1092 Z" fill="#eceae4"/>
  <path d="M356 902 C356 860 420 846 500 846 C580 846 644 860 644 902 L644 942 L356 942 Z" fill="url(#jeans)"/>
  <!-- passenger torso + backpack -->
  <path d="M372 888 C362 760 374 650 412 598 C444 566 556 566 588 598 C626 650 638 760 628 888 Z" fill="url(#orange)"/>
  <path d="M372 888 C362 760 374 650 412 598 C444 566 556 566 588 598 C626 650 638 760 628 888" fill="none" stroke="url(#rimR)" stroke-width="10"/>
  <path d="M368 640 C350 700 346 760 352 820 L380 820 C376 760 380 700 392 650 Z" fill="url(#orange)"/>
  <path d="M632 640 C650 700 654 760 648 820 L620 820 C624 760 620 700 608 650 Z" fill="url(#orange)"/>
  <path d="M396 614 C396 586 604 586 604 614 L616 828 C616 860 384 860 384 828 Z" fill="url(#grey)"/>
  <path d="M396 614 C396 586 604 586 604 614" fill="none" stroke="url(#rimR)" stroke-width="8"/>
  <rect x="428" y="712" width="144" height="106" rx="22" fill="#4a5062"/><path d="M440 720 L560 720" stroke="#2a2e3a" stroke-width="5"/>
  <path d="M424 596 L436 566" stroke="#2e323e" stroke-width="18" stroke-linecap="round"/><path d="M576 596 L564 566" stroke="#2e323e" stroke-width="18" stroke-linecap="round"/>
  <rect x="470" y="598" width="60" height="14" rx="7" fill="#2e323e"/>
  <!-- passenger head from behind (hair) + open-face helmet -->
  <rect x="470" y="540" width="60" height="44" rx="18" fill="#8f5a3a"/>
  <ellipse cx="404" cy="500" rx="14" ry="22" fill="#9a603e"/><ellipse cx="596" cy="500" rx="14" ry="22" fill="#9a603e"/>
  <circle cx="500" cy="486" r="94" fill="#1d140f"/>
  <path d="M430 540 C460 566 540 566 570 540" stroke="#3a2a20" stroke-width="6" fill="none"/>
  <path d="M402 470 C398 392 444 352 500 352 C556 352 602 392 598 470 C560 446 440 446 402 470 Z" fill="url(#slate)"/>
  <path d="M402 470 C398 392 444 352 500 352 C556 352 602 392 598 470" fill="none" stroke="url(#rimR)" stroke-width="8"/>
`);

/** Driver seen from the passenger's eyes: helmet back, jacket back with JALANIN, arms to the bars. 1400x1200. */
export const driverBackPov = () => svg(1400, 1200, `
  <linearGradient id="rimC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9c8ff" stop-opacity=".9"/><stop offset=".3" stop-color="#b9c8ff" stop-opacity="0"/></linearGradient>
  <path d="M40 1010 L1360 1000" stroke="#15161b" stroke-width="30" stroke-linecap="round"/>
  <path d="M120 990 L80 790" stroke="#2a2d36" stroke-width="12"/><ellipse cx="78" cy="770" rx="58" ry="38" fill="#262932"/>
  <path d="M1280 985 L1320 790" stroke="#2a2d36" stroke-width="12"/><ellipse cx="1322" cy="770" rx="58" ry="38" fill="#262932"/><ellipse cx="1322" cy="772" rx="40" ry="24" fill="#5a6f9a"/>
  <path d="M520 1040 C560 960 840 960 880 1040 L880 1200 L520 1200 Z" fill="url(#white)"/>
  <path d="M300 760 C230 830 170 900 130 960 L200 1010 C250 950 310 880 370 830 Z" fill="url(#purple)"/>
  <path d="M1100 760 C1170 830 1230 900 1270 960 L1200 1010 C1150 950 1090 880 1030 830 Z" fill="url(#purple)"/>
  <path d="M170 920 L210 960" stroke="#e3e7f0" stroke-width="22"/><path d="M1230 920 L1190 960" stroke="#e3e7f0" stroke-width="22"/>
  <ellipse cx="140" cy="990" rx="54" ry="40" fill="#17171e"/><ellipse cx="1260" cy="990" rx="54" ry="40" fill="#17171e"/>
  <path d="M250 1200 C250 950 320 760 470 680 C560 640 840 640 930 680 C1080 760 1150 950 1150 1200 Z" fill="url(#purple)"/>
  <path d="M250 1200 C250 950 320 760 470 680 C560 640 840 640 930 680 C1080 760 1150 950 1150 1200" fill="none" stroke="url(#rimC)" stroke-width="14"/>
  <path d="M262 1010 C540 990 860 990 1138 1010 L1142 1050 C860 1030 540 1030 258 1050 Z" fill="#dfe3ec"/>
  <path d="M256 1100 C540 1080 860 1080 1144 1100 L1146 1140 C860 1120 540 1120 254 1140 Z" fill="#dfe3ec"/>
  <text x="700" y="900" font-family="Inter, Arial, sans-serif" font-weight="900" font-size="96" fill="#e6dcff" text-anchor="middle" letter-spacing="4">JALANIN</text>
  <path d="M560 680 C620 650 780 650 840 680 L820 720 C760 700 640 700 580 720 Z" fill="#3e1f99"/>
  <circle cx="700" cy="420" r="262" fill="url(#helm)"/>
  <path d="M440 420 C440 270 560 160 700 160 C840 160 960 270 960 420" fill="none" stroke="url(#rimC)" stroke-width="16"/>
  <ellipse cx="610" cy="280" rx="120" ry="50" fill="#fff" opacity=".18" transform="rotate(-25 610 280)"/>
  <path d="M560 560 C640 590 760 590 840 560" stroke="#d9dff0" stroke-width="16" fill="none" opacity=".8"/>
  <path d="M520 600 C600 650 800 650 880 600" stroke="#3a1a90" stroke-width="14" fill="none" opacity=".7"/>
`);

/** Hand holding the phone (POV). The screen area (x210..590, y80..900) is covered by a separate screen plane. 800x1100. */
export const handPhone = () => svg(800, 1100, `
  <path d="M520 1100 C560 960 600 860 640 760 C660 700 640 660 600 670 L560 700 L520 1100 Z" fill="url(#skin)"/>
  <rect x="186" y="56" width="428" height="868" rx="64" fill="#101116"/>
  <rect x="190" y="60" width="420" height="860" rx="60" fill="none" stroke="#3a3d48" stroke-width="5"/>
  <rect x="210" y="80" width="380" height="820" rx="40" fill="#05050a"/>
  <!-- fingers wrapping the left edge -->
  <ellipse cx="196" cy="520" rx="36" ry="30" fill="url(#skin)"/><ellipse cx="192" cy="604" rx="36" ry="30" fill="url(#skin)"/>
  <ellipse cx="196" cy="688" rx="34" ry="28" fill="url(#skin)"/><ellipse cx="206" cy="766" rx="30" ry="26" fill="url(#skin)"/>
  <!-- palm and thumb on the right edge -->
  <path d="M640 1100 C700 980 700 860 650 760 C630 720 600 720 590 760 L600 920 C560 1000 520 1060 500 1100 Z" fill="url(#skin)"/>
  <path d="M604 760 C640 700 650 640 624 600 C610 584 590 590 590 612 L598 740 Z" fill="#a86c48"/>
  <path d="M470 1100 C520 1040 600 1020 700 1030 L760 1100 Z" fill="url(#orange)"/>
`);
