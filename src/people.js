// Characters of Curses, drawn into the room pictures while they are actually present.
// Every figure is drawn with its feet at (0,0), about 120 units tall, and only from what the game says about them.
(function (root) {
const sh = (w = 30) => `<ellipse cx="0" cy="2" rx="${w}" ry="5" fill="#000" opacity=".3"/>`;
const SKIN = '#e4bc9c', SKIN2 = '#d4a888';
const eyes = (y, open = true, dx = 7, col = '#2a1a12') => open ? `<circle cx="${-dx}" cy="${y}" r="1.9" fill="${col}"/><circle cx="${dx}" cy="${y}" r="1.9" fill="${col}"/>` : `<path d="M${-dx - 4},${y} q4,3 8,0 M${dx - 4},${y} q4,3 8,0" stroke="${col}" stroke-width="1.8" fill="none"/>`;

const F = {
  // ------------------------------------------------ Meldrew Hall and village
  jemima: () => `${sh(34)}
<path d="M-34,0 Q-40,-62 -24,-80 Q0,-90 24,-80 Q40,-62 34,0Z" fill="url(#ppDye)"/>
<path d="M-10,-81 q10,8 20,0" stroke="#efe2cc" stroke-width="4" fill="none"/>
<rect x="-6" y="-94" width="12" height="12" fill="${SKIN}"/>
<ellipse cx="0" cy="-108" rx="17" ry="20" fill="#e8c4a2"/>
<path d="M-19,-110 Q-21,-136 0,-135 Q21,-136 19,-110 Q15,-124 0,-124 Q-15,-124 -19,-110Z" fill="#d8d4cc"/><circle cx="0" cy="-138" r="9" fill="#d8d4cc" stroke="#b8b4ac"/>
<circle cx="-7" cy="-108" r="5.5" fill="none" stroke="#6a5038" stroke-width="1.6"/><circle cx="7" cy="-108" r="5.5" fill="none" stroke="#6a5038" stroke-width="1.6"/><path d="M-1.5,-108 h3" stroke="#6a5038" stroke-width="1.6"/>
${eyes(-107.5, true, 7)}<path d="M-6,-97 q6,3 12,0" stroke="#a05a4a" stroke-width="1.6" fill="none"/>
<path d="M-24,-70 Q-38,-48 -18,-38 L-10,-42 Q-24,-50 -16,-64Z" fill="url(#ppDye)"/><path d="M24,-70 Q38,-48 18,-38 L10,-42 Q24,-50 16,-64Z" fill="url(#ppDye)"/>
<circle cx="-15" cy="-40" r="5" fill="${SKIN}"/><circle cx="15" cy="-40" r="5" fill="${SKIN}"/>
${Array.from({ length: 9 }, (_, k) => { const t = k / 8, x = -15 + 30 * t, y = -40 + Math.sin(t * Math.PI) * 16; return `<circle cx="${x}" cy="${y}" r="3.4" fill="#f6f4ec"/><circle cx="${x}" cy="${y}" r="1.3" fill="#e8c040"/>`; }).join('')}`,

  evans: () => `${sh(30)}
<path d="M-16,-26 L-14,-50 L16,-52 L20,-26Z" fill="#5a4a36"/>
<path d="M-6,-26 L2,0 L14,0 L10,-26Z" fill="#4a3e2e"/><path d="M10,-26 L22,-2 L32,-4 L24,-28Z" fill="#4a3e2e"/>
<rect x="0" y="-3" width="16" height="6" rx="3" fill="#2a2018"/><rect x="22" y="-7" width="15" height="6" rx="3" fill="#2a2018"/>
<path d="M-18,-48 Q-20,-86 0,-90 Q20,-86 18,-48Z" fill="#7a6a48"/>
<rect x="-5" y="-100" width="10" height="12" fill="${SKIN2}"/>
<ellipse cx="0" cy="-110" rx="15" ry="16" fill="#dcb494"/>
<path d="M-9,-98 q9,6 18,0 q-2,5 -9,6 q-7,-1 -9,-6z" fill="#e8e4dc"/>
${eyes(-110, true, 6)}<path d="M-9,-115 l6,1 M3,-114 l6,-1" stroke="#8a8478" stroke-width="1.6"/>
<path d="M-24,-122 Q-22,-124 -16,-124 L-14,-138 Q0,-144 14,-138 L16,-124 Q22,-124 24,-122 Q0,-116 -24,-122Z" fill="#5a4c38"/><rect x="-15" y="-130" width="30" height="5" fill="#2e261c"/>
<rect x="5" y="-131" width="7" height="7" fill="#efe6cc"/><path d="M10,-129 a3,3 0 1 0 0,4 a2.2,2.2 0 1 1 0,-4z" fill="#c8a040"/>
<g transform="rotate(-6 0 -60)"><path d="M-34,-74 L0,-68 L34,-74 L34,-42 L0,-36 L-34,-42Z" fill="#ece4cc" stroke="#b8ae94"/><path d="M0,-68 V-36" stroke="#b8ae94" stroke-width="1.4"/>
${[0, 1, 2, 3].map(k => `<path d="M-29,${-63 + k * 6} h24 M5,${-63 + k * 6} h24" stroke="#8a826e" stroke-width="1.4" opacity=".7"/>`).join('')}</g>
<circle cx="-32" cy="-58" r="4.5" fill="#dcb494"/><circle cx="32" cy="-62" r="4.5" fill="#dcb494"/>`,

  monkey: () => `${sh(14)}<path d="M10,-8 q22,-2 16,-26 q-2,-8 -6,-2 q4,16 -12,18" fill="#7a5232"/>
<ellipse cx="0" cy="-14" rx="11" ry="14" fill="#8a6038"/><ellipse cx="0" cy="-10" rx="6" ry="8" fill="#c8a07a"/>
<circle cx="0" cy="-34" r="10" fill="#8a6038"/><circle cx="-10" cy="-36" r="4" fill="#c8a07a"/><circle cx="10" cy="-36" r="4" fill="#c8a07a"/><ellipse cx="0" cy="-31" rx="7" ry="6" fill="#d8b08a"/>
${eyes(-35, true, 3.4)}<path d="M-3,-28 q3,2 6,0" stroke="#4a3020" stroke-width="1.2" fill="none"/>
<rect x="-6" y="-25" width="12" height="3" rx="1" fill="#c83a3a"/>`,

  austin: () => `${sh(40)}<ellipse cx="0" cy="-12" rx="34" ry="13" fill="#d8803a"/>
<path d="M32,-8 q30,4 40,-6 q4,-4 0,-6 q-14,8 -38,4z" fill="#d8803a"/>
<path d="M-22,-16 q8,-4 14,2 M-4,-18 q8,-4 14,2 M14,-18 q8,-4 12,2" stroke="#b05e24" stroke-width="2.5" fill="none"/>
<circle cx="-34" cy="-20" r="12" fill="#e08a40"/><polygon points="-43,-26 -42,-40 -34,-29" fill="#e08a40"/><polygon points="-31,-30 -24,-40 -24,-24" fill="#e08a40"/>
<path d="M-41,-20 q3,2 6,0 M-31,-20 q3,2 6,0" stroke="#3a2010" stroke-width="1.8" fill="none"/><path d="M-36,-15 l2,2 l2,-2" stroke="#7a3a20" stroke-width="1.2" fill="none"/>`,

  joshua: () => `<g opacity=".62"><ellipse cx="0" cy="-60" rx="46" ry="74" fill="url(#ppGhost)"/>
<path d="M-26,0 L-20,-62 Q0,-72 20,-62 L26,0 L12,0 L8,-30 L-8,-30 L-12,0Z" fill="#a8acb4"/>
<rect x="-12" y="-30" width="9" height="30" fill="#d0d4d8"/><rect x="3" y="-30" width="9" height="30" fill="#d0d4d8"/>
<path d="M-10,-62 h20 v34 h-20z" fill="#c4c8cc"/>${[0, 1, 2, 3].map(k => `<circle cx="0" cy="${-58 + k * 8}" r="1.4" fill="#e8eaec"/>`).join('')}
<path d="M-8,-70 q8,10 16,0 l-3,8 h-10z" fill="#eef0f2"/>
<rect x="-5" y="-80" width="10" height="10" fill="#c8ccd0"/>
<ellipse cx="0" cy="-92" rx="13" ry="15" fill="#c8ccd2"/>${eyes(-92, true, 5, '#5a6068')}<path d="M-5,-84 q5,2 10,0" stroke="#6a7078" stroke-width="1.4" fill="none"/>
<path d="M-15,-96 Q-16,-112 0,-112 Q16,-112 15,-96 Q18,-86 14,-80 M-15,-96 Q-18,-86 -14,-80" fill="#e4e6e8" stroke="#e4e6e8" stroke-width="5"/>
<path d="M14,-82 q8,6 4,16" stroke="#9aa0a8" stroke-width="3" fill="none"/>
<path d="M-26,-112 L0,-126 L26,-112 Q0,-104 -26,-112Z" fill="#6a7078"/>
<path d="M-20,-62 Q-32,-40 -26,-22 M20,-62 Q32,-40 26,-22" stroke="#a8acb4" stroke-width="9" fill="none" stroke-linecap="round"/>
<path d="M-28,-22 q2,4 6,2 M28,-22 q-2,4 -6,2" stroke="#e8eaec" stroke-width="4" fill="none"/></g>`,

  // ------------------------------------------------ Unreal City, Paris
  sosostris: () => `${sh(46)}
<path d="M-44,0 Q-42,-60 -20,-74 Q0,-80 20,-74 Q42,-60 44,0Z" fill="#5a2e5a"/>
<path d="M-36,-50 Q0,-30 36,-50" stroke="#c8a040" stroke-width="1.6" fill="none" stroke-dasharray="2.5 3"/>
<rect x="-5" y="-88" width="10" height="12" fill="${SKIN2}"/>
<ellipse cx="0" cy="-102" rx="15" ry="18" fill="#dcb294"/>
<path d="M-19,-100 Q-21,-128 0,-130 Q21,-128 19,-100 Q16,-116 0,-118 Q-16,-116 -19,-100Z" fill="#7a2a4a"/><path d="M-19,-100 Q-23,-84 -16,-74 M19,-100 Q23,-84 16,-74" stroke="#7a2a4a" stroke-width="6" fill="none" stroke-linecap="round"/>
<circle cx="0" cy="-118" r="3.5" fill="#e8d060"/>
${eyes(-102, false, 6, '#4a2a20')}<ellipse cx="0" cy="-95" rx="3" ry="2.4" fill="#d8645a"/><path d="M-4,-89 q4,2 8,0" stroke="#9a4a4a" stroke-width="1.5" fill="none"/>
<circle cx="-16" cy="-88" r="2.2" fill="#e8d060"/><circle cx="16" cy="-88" r="2.2" fill="#e8d060"/>
<path d="M-30,-36 Q-20,-24 -4,-24 L4,-24 Q20,-24 30,-36" stroke="#5a2e5a" stroke-width="13" fill="none" stroke-linecap="round"/>
<circle cx="-3" cy="-24" r="5.5" fill="#dcb294"/><circle cx="4" cy="-24" r="5.5" fill="#dcb294"/>
<path d="M6,-28 q8,-6 12,2 q-4,6 -12,2z" fill="#f4f0e8"/>`,

  hollow: () => `${sh(34)}

<path d="M-12,0 L-6,-40 M12,0 L6,-40" stroke="#8a8270" stroke-width="7" stroke-linecap="round"/>
<path d="M-16,-40 L-14,-82 Q0,-88 14,-82 L16,-40Z" fill="#b8ae94" stroke="#8a8270" stroke-width="1.5"/>
<path d="M-12,-70 l24,8 M-12,-56 l24,-6" stroke="#9a907a" stroke-width="1"/>
<path d="M-14,-80 L-34,-64 M14,-80 L-22,-60" stroke="#b8ae94" stroke-width="6" stroke-linecap="round"/>
${[-34, -22].map(x => `<path d="M${x},-64 l-4,-3 M${x},-64 l-5,1 M${x},-64 l-3,4" stroke="#d8c070" stroke-width="1.2"/>`).join('')}
<path d="M-6,-88 l-4,-4 M0,-88 l0,-5 M6,-88 l4,-4" stroke="#d8c070" stroke-width="1.4"/>
<rect x="-13" y="-114" width="26" height="28" rx="3" fill="#cbc2a8" stroke="#8a8270"/>
<ellipse cx="-6" cy="-102" rx="3" ry="4" fill="#3a342a"/><ellipse cx="6" cy="-102" rx="3" ry="4" fill="#3a342a"/><path d="M-5,-92 q5,-3 10,0" stroke="#5a5244" stroke-width="1.4" fill="none"/>
<path d="M-13,-114 l26,0 l-4,-6 h-18z" fill="#4a4438"/>`,

  shopkeeper: () => `<rect x="-60" y="-56" width="120" height="56" fill="#5a4a3a"/><rect x="-64" y="-60" width="128" height="6" fill="#7a6650"/>
${[[-52, '#c84a3a'], [-36, '#3a6a9a'], [-20, '#e0b040'], [14, '#4a8a5a'], [30, '#c84a3a'], [46, '#e8e0cc']].map(([x, c]) => `<rect x="${x}" y="-50" width="12" height="18" fill="${c}"/><rect x="${x + 2}" y="-46" width="8" height="2" fill="#000" opacity=".25"/>`).join('')}
<path d="M-58,-26 h116" stroke="#3a2e22" stroke-width="2"/>${[-50, -30, -10, 10, 30].map(x => `<rect x="${x}" y="-22" width="16" height="12" fill="#e8dcbc"/><path d="M${x + 3},${-19} l10,6 M${x + 3},${-13} l6,-4" stroke="#8a7a5a" stroke-width="1"/>`).join('')}
<path d="M-24,-60 Q-24,-96 0,-98 Q24,-96 24,-60Z" fill="#4a5a6a"/>
<path d="M-24,-74 Q0,-66 24,-74 L24,-66 Q0,-58 -24,-66Z" fill="#3a4a5a"/>
<rect x="-5" y="-108" width="10" height="12" fill="${SKIN2}"/>
<ellipse cx="0" cy="-118" rx="14" ry="16" fill="#dcb494"/>
<path d="M-14,-122 Q-14,-138 0,-138 Q14,-138 14,-122 Q8,-130 0,-128 Q-8,-130 -14,-122Z" fill="#3a2e24"/>
${eyes(-118, true, 5.5)}<path d="M-9,-124 l6,2 M3,-122 l6,-2" stroke="#3a2e24" stroke-width="2"/>
<path d="M-6,-108 q6,-3 12,0" stroke="#7a4a3a" stroke-width="1.6" fill="none"/><path d="M-4,-112 h8" stroke="#5a4030" stroke-width="2.2"/>`,

  // ------------------------------------------------ Alexandria, Greece, Egypt
  bartender: () => `<rect x="-56" y="-50" width="112" height="50" fill="#6a4a2e"/><rect x="-60" y="-54" width="120" height="7" fill="#8a6440"/>${[-40, -12, 16, 44].map(x => `<path d="M${x},-44 v40" stroke="#4a321e" stroke-width="2"/>`).join('')}
<path d="M-22,-54 Q-22,-90 0,-92 Q22,-90 22,-54Z" fill="#e8e4d8"/><path d="M-14,-86 L0,-54 L14,-86" fill="#5a6a7a"/>
<rect x="-5" y="-102" width="10" height="12" fill="${SKIN2}"/>
<ellipse cx="0" cy="-112" rx="14" ry="16" fill="#d8ae8c"/><path d="M-14,-116 Q-12,-132 0,-130 Q12,-132 14,-116 Q10,-124 0,-124 Q-10,-124 -14,-116Z" fill="#2a2420"/>
<path d="M-9,-112 q3,-2 6,0 M3,-112 q3,-2 6,0" stroke="#2a1a12" stroke-width="1.8" fill="none"/><path d="M-10,-116 l6,-2 M4,-118 l6,2" stroke="#2a2420" stroke-width="1.8"/>
<path d="M-6,-101 q6,-4 12,0" stroke="#7a4a3a" stroke-width="1.6" fill="none"/><path d="M-12,-104 q12,10 24,0 q-4,8 -12,8 q-8,0 -12,-8z" fill="#3a302a" opacity=".85"/>
<path d="M16,-70 L28,-58 M-16,-70 L-26,-60" stroke="#e8e4d8" stroke-width="8" stroke-linecap="round"/>
<path d="M22,-70 l10,0 l-2,16 h-6z" fill="#cfe0e8" opacity=".85" stroke="#9ab0bc"/><path d="M-30,-66 q8,-4 14,4 q-6,8 -14,4z" fill="#f0ece0"/>`,

  homer: () => `<rect x="-30" y="-28" width="60" height="28" fill="#b8b0a0"/><rect x="-30" y="-28" width="60" height="4" fill="#d0c8b8"/>${sh(34)}
<path d="M-24,-28 L-28,-80 Q0,-92 28,-80 L24,-28Z" fill="#c8b48a"/><path d="M-4,-88 L-2,-28 M-26,-52 h52" stroke="#a89470" stroke-width="2"/><rect x="-26" y="-56" width="52" height="5" fill="#a89470"/>
<path d="M-12,-88 l12,12 l12,-12" fill="#b8a47a"/>
<path d="M-10,-28 L-14,-6 M10,-28 L16,-6" stroke="#8a7a60" stroke-width="9" stroke-linecap="round"/><path d="M-20,-4 h12 M10,-4 h12" stroke="#5a4a30" stroke-width="5" stroke-linecap="round"/>
<rect x="-5" y="-98" width="10" height="10" fill="${SKIN2}"/>
<ellipse cx="0" cy="-108" rx="15" ry="17" fill="#d8b090"/>
<path d="M-15,-108 Q-14,-128 0,-128 Q14,-128 15,-108 Q12,-116 6,-118 Q0,-110 -6,-118 Q-12,-116 -15,-108Z" fill="#e8e4dc"/>
<path d="M-14,-104 Q-16,-78 0,-74 Q16,-78 14,-104 Q8,-96 0,-98 Q-8,-96 -14,-104Z" fill="#f0ece4"/>
${eyes(-108, false, 5.5, '#6a5040')}
<g transform="rotate(-20 0 -66)">${[0, 1, 2, 3, 4, 5].map(k => `<rect x="${-14 + k * 5}" y="${-74 + k * 1.5}" width="4" height="${20 - k * 2.5}" rx="1.5" fill="#c8a050" stroke="#8a6a30" stroke-width=".8"/>`).join('')}<rect x="-15" y="-66" width="32" height="3" fill="#8a6a30"/></g>
<circle cx="-12" cy="-62" r="5" fill="#d8b090"/><circle cx="14" cy="-58" r="5" fill="#d8b090"/>
<text x="20" y="-124" font-size="11" fill="#e8e0d0" opacity=".8" font-family="DejaVu Serif">z</text><text x="28" y="-134" font-size="8" fill="#e8e0d0" opacity=".6" font-family="DejaVu Serif">z</text>`,

  callimachus: () => `${sh(26)}<path d="M-22,0 L-20,-70 Q0,-80 20,-70 L22,0Z" fill="#e8e0cc"/><path d="M-20,-70 Q4,-40 22,-4" stroke="#b8a888" stroke-width="10" fill="none" opacity=".6"/>
<rect x="-5" y="-88" width="10" height="12" fill="${SKIN}"/>
<ellipse cx="0" cy="-98" rx="13" ry="15" fill="#e0b896"/>${[[-10, -108], [-4, -112], [3, -112], [9, -108], [12, -101], [-12, -101]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#3a2a20"/>`).join('')}
<path d="M-7,-97 q3,-2 6,0 M3,-97 q3,-2 6,0" stroke="#2a1a12" stroke-width="1.8" fill="none"/><path d="M-8,-102 l6,1 M2,-101 l6,-1" stroke="#3a2a20" stroke-width="1.6"/>
<path d="M-4,-88 q4,-2 8,0" stroke="#8a5a4a" stroke-width="1.4" fill="none"/>
<path d="M14,-66 Q22,-80 8,-88" stroke="#e8e0cc" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="7" cy="-87" r="4.5" fill="#e0b896"/>
<rect x="-30" y="-58" width="34" height="20" fill="#e8dcb8" stroke="#b8a070"/><rect x="-34" y="-60" width="6" height="24" rx="3" fill="#a88a50"/><rect x="2" y="-60" width="6" height="24" rx="3" fill="#a88a50"/>${[0, 1, 2].map(k => `<path d="M-24,${-53 + k * 5} h22" stroke="#8a7a5a" stroke-width="1"/>`).join('')}`,

  apollonius: () => `${sh(28)}<path d="M-24,0 L-22,-74 Q0,-84 22,-74 L24,0Z" fill="#ece6d4"/>
<path d="M-22,-74 L22,-20" stroke="#7a3a8a" stroke-width="10"/><path d="M-22,-74 L22,-20" stroke="#9a5aaa" stroke-width="3"/>
<path d="M-8,0 v-6 M8,0 v-6" stroke="#8a6a40" stroke-width="5"/>
<rect x="-5" y="-92" width="10" height="12" fill="${SKIN}"/>
<ellipse cx="0" cy="-104" rx="14" ry="16" fill="#dcb494"/>
<path d="M-14,-106 Q-12,-122 0,-121 Q12,-122 14,-106 Q10,-114 0,-114 Q-10,-114 -14,-106Z" fill="#c8c4bc"/><path d="M-12,-96 Q0,-80 12,-96 Q8,-88 0,-86 Q-8,-88 -12,-96Z" fill="#c8c4bc"/>
<path d="M-8,-106 h5 M3,-106 h5" stroke="#2a1a12" stroke-width="2"/><path d="M0,-104 l4,6 h-4" stroke="#b08868" stroke-width="1.4" fill="none"/>
<path d="M18,-70 L30,-90" stroke="#ece6d4" stroke-width="8" stroke-linecap="round"/><circle cx="31" cy="-92" r="4.5" fill="#dcb494"/>
<g transform="rotate(-18 34 -104)"><rect x="24" y="-118" width="22" height="28" fill="#efe4c4" stroke="#b8a070"/>${[0, 1, 2, 3].map(k => `<path d="M27,${-112 + k * 5} h16" stroke="#8a7a5a" stroke-width="1"/>`).join('')}</g>`,

  slave: () => `${sh(22)}<path d="M-8,0 v-34 M8,0 v-34" stroke="#c8a07c" stroke-width="7" stroke-linecap="round"/>
<path d="M-18,-30 L-16,-80 Q0,-86 16,-80 L18,-30Z" fill="#d8ccb0"/><path d="M-18,-46 h36" stroke="#a89870" stroke-width="3"/>
<path d="M-16,-78 Q-22,-60 -6,-50 M16,-78 Q22,-60 6,-50" stroke="#c8a07c" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="0" cy="-50" r="5" fill="#c8a07c"/>
<rect x="-5" y="-94" width="10" height="12" fill="#c8a07c"/>
<ellipse cx="0" cy="-104" rx="13" ry="15" fill="#c8a07c"/><path d="M-13,-106 Q-12,-120 0,-120 Q12,-120 13,-106 Q8,-112 0,-112 Q-8,-112 -13,-106Z" fill="#2a2018"/>
${eyes(-104, true, 5)}<path d="M-4,-95 h8" stroke="#7a5040" stroke-width="1.4"/>`,

  officers: () => [-26, 26].map((ox, i) => `<g transform="translate(${ox} 0)">${sh(18)}
<path d="M-8,0 L-7,-34 M8,0 L7,-34" stroke="#2a2420" stroke-width="7"/><path d="M-9,-34 L-8,-50 M9,-34 L8,-50" stroke="#e8e4dc" stroke-width="8"/>
<path d="M-16,-34 L-14,-82 Q0,-88 14,-82 L16,-34 L10,-30 L0,-46 L-10,-30Z" fill="#26346a"/><path d="M-6,-84 L-4,-40 M6,-84 L4,-40" stroke="#e8e4dc" stroke-width="3"/>
<rect x="-18" y="-84" width="8" height="4" fill="#d8b040"/><rect x="10" y="-84" width="8" height="4" fill="#d8b040"/><path d="M-6,-84 h12" stroke="#c83a3a" stroke-width="3"/>
<rect x="-4" y="-94" width="8" height="10" fill="${SKIN}"/>
<ellipse cx="0" cy="-102" rx="11" ry="13" fill="#e0b896"/>${eyes(-102, true, 4.5)}<path d="M-5,-95 q5,2 10,0" stroke="#7a4a3a" stroke-width="1.3" fill="none"/>
<path d="M-24,-110 Q0,-130 24,-110 Q0,-116 -24,-110Z" fill="#1e1e22"/><circle cx="${i ? -8 : 8}" cy="-116" r="3" fill="#c83a3a"/>
<path d="M${i ? -14 : 14},-80 L${i ? -22 : 22},-58" stroke="#26346a" stroke-width="7" stroke-linecap="round"/>
<g transform="translate(${i ? -24 : 24} -46)"><circle r="16" fill="url(#ppLamp)"/><path d="M-6,-12 h12 l2,4 h-16z" fill="#a8803a"/><rect x="-6" y="-8" width="12" height="16" rx="2" fill="#ffe8a0" stroke="#b8903a" stroke-width="2"/><path d="M0,-12 v-6" stroke="#a8803a" stroke-width="1.5"/></g></g>`).join(''),

  sailor: () => `<rect x="10" y="-40" width="56" height="5" fill="#7a5a3a"/><path d="M16,-35 v35 M60,-35 v35" stroke="#5a4028" stroke-width="4"/>${sh(30)}
<rect x="-22" y="-34" width="28" height="6" fill="#6a4a2a"/><path d="M-20,-28 v28 M4,-28 v28" stroke="#4a3420" stroke-width="3"/>
<path d="M-10,-34 L-4,-2 L8,-2 L6,-34Z" fill="#2e3a4e"/><rect x="-6" y="-4" width="16" height="6" rx="3" fill="#2a2018"/>
<path d="M-20,-34 Q-22,-76 0,-80 Q22,-76 18,-34Z" fill="#2e3a4e"/>${[0, 1, 2, 3].map(k => `<path d="M-16,${-70 + k * 9} h32" stroke="#e8e4dc" stroke-width="2" opacity=".5"/>`).join('')}
<path d="M14,-66 L30,-44" stroke="#2e3a4e" stroke-width="8" stroke-linecap="round"/><circle cx="31" cy="-43" r="4.5" fill="#c89878"/>
<rect x="-5" y="-90" width="10" height="10" fill="#c89878"/>
<ellipse cx="0" cy="-100" rx="14" ry="15" fill="#c89878"/><path d="M-14,-96 Q-14,-76 0,-74 Q14,-76 14,-96 Q8,-90 0,-90 Q-8,-90 -14,-96Z" fill="#9a948a"/>
${eyes(-102, true, 5.5)}<path d="M-9,-107 l6,1 M3,-106 l6,-1" stroke="#7a746a" stroke-width="2"/>
<path d="M-16,-108 Q-14,-122 0,-122 Q14,-122 16,-108Z" fill="#1e2632"/><rect x="-17" y="-110" width="34" height="4" fill="#141a22"/>
<text x="20" y="-112" font-size="12" fill="#e8e0c8" opacity=".8" font-family="DejaVu Sans">♪</text><text x="30" y="-124" font-size="9" fill="#e8e0c8" opacity=".6" font-family="DejaVu Sans">♫</text>`,

  // ------------------------------------------------ gardens
  crake: () => `<ellipse cx="0" cy="-6" rx="30" ry="9" fill="#7a6038"/>${Array.from({ length: 10 }, (_, k) => `<path d="M${-28 + k * 6},-6 q4,-6 8,0" stroke="#5a4428" stroke-width="2" fill="none"/>`).join('')}
<ellipse cx="0" cy="-20" rx="18" ry="11" fill="#a07a48"/>${[0, 1, 2, 3].map(k => `<path d="M${-12 + k * 6},-24 l3,5" stroke="#6a4a28" stroke-width="2"/>`).join('')}
<path d="M14,-24 Q22,-40 14,-46 Q6,-48 6,-38 Q8,-28 6,-22Z" fill="#a07a48"/><ellipse cx="12" cy="-40" rx="5" ry="4" fill="#8a9aa0"/>
<circle cx="13" cy="-42" r="1.6" fill="#1a1a1a"/><path d="M14,-48 l3,-2" stroke="#5a4428" stroke-width="2"/><path d="M18,-40 l7,1 l-7,2z" fill="#c89a5a"/>
<path d="M-16,-20 l-12,-6 l2,6z" fill="#7a5a34"/>`,

  squirrel: () => `${sh(18)}<path d="M8,-6 Q40,-6 34,-40 Q30,-60 14,-56 Q28,-44 20,-24 Q16,-16 6,-14Z" fill="#b85a2a"/>
<ellipse cx="0" cy="-16" rx="11" ry="14" fill="#c86a34"/><ellipse cx="-2" cy="-12" rx="6" ry="8" fill="#ecc8a0"/>
<circle cx="-4" cy="-34" r="9" fill="#c86a34"/><polygon points="-10,-40 -8,-50 -4,-41" fill="#c86a34"/><polygon points="0,-41 3,-50 5,-39" fill="#c86a34"/>
<circle cx="-7" cy="-35" r="2" fill="#1a1010"/><path d="M-11,-39 l6,2" stroke="#3a1a10" stroke-width="1.8"/><circle cx="-12" cy="-31" r="1.6" fill="#3a1a10"/>
<path d="M-8,-22 q-6,-2 -8,2 M2,-22 q-4,-6 -8,-4" stroke="#c86a34" stroke-width="3" fill="none" stroke-linecap="round"/>
<path d="M-18,-46 l-4,-4 M-20,-40 l-6,0" stroke="#e8e0c8" stroke-width="1.5" opacity=".8"/>`,

  goat: () => `${sh(30)}<path d="M-20,0 v-22 M-10,0 v-22 M12,0 v-22 M22,0 v-22" stroke="#7a7064" stroke-width="5" stroke-linecap="round"/>
<ellipse cx="0" cy="-30" rx="28" ry="14" fill="#e8e2d6"/><path d="M-28,-30 q-6,4 -4,10" stroke="#e8e2d6" stroke-width="4" fill="none"/>
<path d="M22,-36 Q30,-56 40,-52 Q48,-48 42,-38 Q36,-30 26,-28Z" fill="#e8e2d6"/>
<path d="M32,-54 q-4,-10 -12,-12 M38,-54 q0,-10 -6,-14" stroke="#8a7a60" stroke-width="3" fill="none"/>
<circle cx="38" cy="-46" r="3.4" fill="#fff"/><circle cx="38.6" cy="-46" r="1.8" fill="#1a1a1a"/><path d="M34,-52 l6,-2" stroke="#6a6050" stroke-width="1.4"/>
<path d="M42,-36 q0,8 -4,10 q-2,-4 0,-10" fill="#cfc8b8"/><path d="M28,-50 l-8,2 l6,4z" fill="#d8d0c4"/>
<path d="M48,-60 l2,-6 M52,-56 l5,-3" stroke="#e8e0c8" stroke-width="1.6" opacity=".9"/>`,

  // ------------------------------------------------ further afield
  druid: () => `${sh(32)}<path d="M-30,0 Q-36,-60 -18,-86 Q0,-96 18,-86 Q36,-60 30,0Z" fill="#5a4a3a"/>
${Array.from({ length: 14 }, (_, k) => `<path d="M${-30 + k * 4.6},0 l2,-10 l2,10" fill="#4a3a2c"/>`).join('')}
<path d="M-24,-60 Q0,-48 24,-60 Q22,-40 0,-36 Q-22,-40 -24,-60Z" fill="#8a7a62"/>${Array.from({ length: 9 }, (_, k) => `<path d="M${-22 + k * 5.5},-48 l1,6" stroke="#6a5a46" stroke-width="1.4"/>`).join('')}
<path d="M-22,-100 Q-24,-126 0,-128 Q24,-126 22,-100 L18,-82 Q0,-76 -18,-82Z" fill="#6a5440"/><path d="M-22,-102 Q0,-112 22,-102" stroke="#9a8a72" stroke-width="5" fill="none"/>
<ellipse cx="0" cy="-98" rx="12" ry="14" fill="#cfa888"/>${eyes(-99, true, 5, '#1a1008')}<path d="M-9,-104 l6,2 M3,-102 l6,-2" stroke="#2a1a10" stroke-width="1.8"/><path d="M-4,-90 q4,-2 8,0" stroke="#6a3a2a" stroke-width="1.5" fill="none"/>
<path d="M-14,-80 Q0,-62 14,-80" stroke="#b8a888" stroke-width="1.5" fill="none"/>${[[-12, -76, 'bone'], [-4, -68, 'tooth'], [5, -68, 'skull'], [12, -76, 'bone']].map(([x, y, k]) => k === 'skull' ? `<circle cx="${x}" cy="${y}" r="3.6" fill="#e8e0cc"/><circle cx="${x - 1.2}" cy="${y - .6}" r=".9" fill="#222"/><circle cx="${x + 1.2}" cy="${y - .6}" r=".9" fill="#222"/>` : k === 'tooth' ? `<path d="M${x - 2},${y - 3} l2,7 l2,-7z" fill="#efe8d8"/>` : `<rect x="${x - 1.5}" y="${y - 4}" width="3" height="8" rx="1.5" fill="#e0d8c4"/>`).join('')}`,

  spy: () => `${sh(56)}<path d="M-50,-8 Q-50,-22 -30,-22 L30,-20 Q44,-20 44,-10 L44,-2 L-50,-2Z" fill="#6a5a42"/>
<path d="M44,-6 L64,-8 L64,-2 L44,-2Z" fill="#4a3e2e"/><path d="M40,-14 L62,-16 L64,-10 L42,-8Z" fill="#4a3e2e"/>
<circle cx="-54" cy="-12" r="11" fill="#5a4030"/><path d="M-66,-12 q2,-10 12,-12" stroke="#7a5a40" stroke-width="3" fill="none"/>
<path d="M-40,-20 L-62,-4 M-24,-20 L-46,-2" stroke="#6a5a42" stroke-width="7" stroke-linecap="round"/>
${[[-34, -22, '#8a7a3a'], [-10, -24, '#a8803a'], [14, -22, '#6a7a3a'], [30, -20, '#b86a2a'], [-56, -22, '#8a7a3a'], [4, -14, '#a8803a']].map(([x, y, c]) => `<path d="M${x},${y} q5,-6 10,0 q-5,5 -10,0z" fill="${c}"/>`).join('')}
${Array.from({ length: 30 }, (_, k) => `<circle cx="${-60 + (k * 37) % 110}" cy="${-22 + (k * 13) % 18}" r=".9" fill="#c8b898" opacity=".7"/>`).join('')}`,

  knight: () => `${sh(30)}<g><path d="M-12,0 L-10,-40 M12,0 L10,-40" stroke="url(#ppSteel)" stroke-width="10" stroke-linecap="round"/>
<path d="M-24,-40 L-22,-86 Q0,-94 22,-86 L24,-40 Q0,-34 -24,-40Z" fill="url(#ppSteel)" stroke="#6a7a8a" stroke-width="1.5"/>
<path d="M-22,-86 Q-40,-80 -40,-110 M22,-86 Q38,-70 44,-50" stroke="url(#ppSteel)" stroke-width="9" fill="none" stroke-linecap="round"/>
<path d="M-40,-112 l0,-22 M-46,-120 l12,0" stroke="#c8d4e0" stroke-width="4"/>
<path d="M-14,-90 Q-16,-122 0,-124 Q16,-122 14,-90Z" fill="url(#ppSteel)" stroke="#6a7a8a" stroke-width="1.5"/><path d="M-12,-108 h24" stroke="#1a2430" stroke-width="3"/><path d="M0,-124 Q6,-136 14,-134" stroke="#c83a3a" stroke-width="4" fill="none"/>
${[[-30, -100], [30, -110], [-34, -60], [36, -76], [0, -136]].map(([x, y]) => `<path d="M${x},${y - 5} l1.4,3.6 l3.6,1.4 l-3.6,1.4 l-1.4,3.6 l-1.4,-3.6 l-3.6,-1.4 l3.6,-1.4z" fill="#f4fbff"/>`).join('')}</g>`,

  demon: () => `${sh(24)}<path d="M-10,0 L-8,-40 M10,0 L8,-40" stroke="#1e1a22" stroke-width="8"/>
<path d="M-20,-40 L-18,-84 Q0,-90 18,-84 L20,-40Z" fill="#26222c"/><path d="M-6,-86 L0,-60 L6,-86" fill="#e8e4dc"/><path d="M-2,-80 L0,-64 L2,-80" fill="#a02a2a"/>
<path d="M18,-80 L28,-46" stroke="#26222c" stroke-width="7" stroke-linecap="round"/><path d="M29,-46 L32,0" stroke="#1a1010" stroke-width="3"/><circle cx="29" cy="-47" r="4" fill="#c88a6a"/>
<rect x="-5" y="-96" width="10" height="10" fill="#c88a6a"/>
<ellipse cx="0" cy="-106" rx="13" ry="16" fill="#cc8c70"/><path d="M-13,-112 Q-12,-124 0,-124 Q12,-124 13,-112 Q8,-118 0,-118 Q-8,-118 -13,-112Z" fill="#3a3a3a"/>
<path d="M-10,-118 q-6,-8 -2,-16 q2,8 6,10z M10,-118 q6,-8 2,-16 q-2,8 -6,10z" fill="#8a2a2a"/>
<circle cx="-5" cy="-106" r="1.8" fill="#e83a2a"/><circle cx="5" cy="-106" r="1.8" fill="#e83a2a"/><path d="M-6,-97 q6,3 12,-1" stroke="#5a2a2a" stroke-width="1.5" fill="none"/>`,

  angel: () => `<path d="M-14,-80 Q-60,-120 -54,-50 Q-36,-64 -14,-60Z M14,-80 Q60,-120 54,-50 Q36,-64 14,-60Z" fill="#f4f2ec" stroke="#d8d4c8"/>${sh(26)}
<path d="M-22,0 Q-26,-60 -14,-80 Q0,-86 14,-80 Q26,-60 22,0Z" fill="#f0eee8"/><path d="M-6,-80 Q-8,-40 -10,0 M6,-80 Q8,-40 10,0" stroke="#d8d4c8" stroke-width="1.5" fill="none"/>
<rect x="-5" y="-94" width="10" height="12" fill="${SKIN}"/>
<ellipse cx="0" cy="-104" rx="13" ry="15" fill="#e8c8ac"/><path d="M-13,-104 Q-14,-120 0,-120 Q14,-120 13,-104 Q12,-112 0,-113 Q-12,-112 -13,-104Z" fill="#e4e2dc"/>
${eyes(-104, true, 5)}<path d="M-5,-96 q5,3 10,0" stroke="#a06a5a" stroke-width="1.4" fill="none"/>
<ellipse cx="0" cy="-126" rx="12" ry="3.5" fill="none" stroke="#f0d060" stroke-width="2.5"/>`,

  // ------------------------------------------------ Andromeda, seen from behind: long hair, rock in front
  // not a person: the green light the old man's staff sets chasing round the walls in the dream
  flurries: () => { let o = ''; for (let i = 0; i < 26; i++) { const a = i * 2.39, r = 40 + (i * 37) % 120, x = Math.cos(a) * r * 1.3, y = Math.sin(a) * r * .55 - 60; o += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(3 + i % 4).toFixed(1)}" fill="#9aff8a" opacity=".85"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(10 + i % 5 * 3).toFixed(1)}" fill="#7af06a" opacity=".18"/>`; if (i % 3 === 0) o += `<path d="M${x.toFixed(1)},${y.toFixed(1)} q${(14 + i % 7).toFixed(0)},-10 ${(28 + i % 9).toFixed(0)},2" stroke="#9aff8a" stroke-width="2" fill="none" opacity=".6"/>`; } return o; },
  andromeda: () => `<path d="M-14,-74 L-34,-108 M14,-74 L28,-110" stroke="${SKIN}" stroke-width="6" stroke-linecap="round"/>
<rect x="-40" y="-114" width="9" height="6" rx="2" fill="#7a7a74"/><rect x="24" y="-116" width="9" height="6" rx="2" fill="#7a7a74"/>
<path d="M-36,-112 l-10,-8 l-8,-2 l-10,0" stroke="#8a8a84" stroke-width="2.5" stroke-dasharray="4 2" fill="none"/><path d="M30,-114 l-6,-10 l-10,-6" stroke="#8a8a84" stroke-width="2.5" stroke-dasharray="4 2" fill="none"/>
<path d="M-15,-78 Q-18,-50 -12,-30 L12,-30 Q18,-50 15,-78 Q0,-84 -15,-78Z" fill="${SKIN}"/>
<ellipse cx="0" cy="-94" rx="11" ry="13" fill="#5a3424"/>
<path d="M-11,-96 Q-16,-60 -10,-34 Q0,-28 10,-34 Q16,-60 11,-96 Q0,-88 -11,-96Z" fill="#5a3424"/><path d="M-4,-90 Q-6,-60 -3,-36 M4,-90 Q6,-60 3,-36" stroke="#3a2016" stroke-width="1.4" fill="none"/>
<path d="M-40,0 Q-46,-30 -26,-44 Q-8,-50 6,-40 Q30,-46 42,-26 Q50,-8 44,0Z" fill="#5e5246"/><path d="M-30,-40 Q-6,-48 8,-38 Q28,-44 40,-26" stroke="#8a7a6a" stroke-width="2" fill="none"/>`
};

// which object names belong to which figure (the names as the game uses them)
const WHO = [
  [/^Jemima$|^Aunt Jemima$/, 'jemima', 'Jemima'], [/^Old Evans$/, 'evans', 'Old Evans', ['Evans']], [/^pet monkey$/, 'monkey', 'monkey'], [/^Austin$/, 'austin', 'Austin'],
  [/^Sir Joshua Meldrewe$/, 'joshua', 'Sir Joshua', ['ghost']], [/^Madame Sosostris/, 'sosostris', 'Madame Sosostris'], [/^hollow man$/, 'hollow', 'hollow man'],
  [/^surly shopkeeper$/, 'shopkeeper', 'shopkeeper'], [/^bartender$/, 'bartender', 'bartender'], [/^Homer$/, 'homer', 'Homer'], [/^Callimachus$/, 'callimachus', 'Callimachus'],
  [/^Apollonius$/, 'apollonius', 'Apollonius'], [/^slave$/, 'slave', 'slave'], [/^Napoleonic officers$/, 'officers', 'officers'], [/^gambling sailor$/, 'sailor', 'sailor'],
  [/^corn crake$/, 'crake', 'corn crake'], [/^irate squirrel friend$/, 'squirrel', 'squirrel'], [/^anxious-looking goat$/, 'goat', 'goat'], [/^Druid$/, 'druid', 'Druid'],
  [/^unconscious Saxon spy$/, 'spy', 'Saxon spy'], [/^adamantine knight$/, 'knight', 'knight'], [/^demon$/, 'demon', 'demon'], [/^angel$/, 'angel', 'angel'], [/^Andromeda$/, 'andromeda', 'Andromeda'], [/^flurries of green luminescence$/, 'flurries', 'green luminescence', ['luminescence']]
];
// where a figure stands in a given room: [x, y of the feet, scale]; otherwise a default spot
const PLACE = {
  'Potting Room': { jemima: [250, 236, 1] }, 'Island of Pharos': { austin: [330, 212, .55] }, 'Causeway': { austin: [272, 252, .62] }, 'Stone Cross': { evans: [150, 226, .62], monkey: [220, 244, .8] },
  'Sea Shore': { andromeda: [136, 214, .95] }, 'Battlements': { joshua: [270, 226, .95] }, 'Consulting Room': { sosostris: [140, 232, .9] },
  'On board the Phlebas': { hollow: [284, 238, 1] }, 'Chatelet-les-Halles': { shopkeeper: [260, 242, .95] }, 'Eraina Taverna': { bartender: [250, 244, .95] },
  'Inner Sanctum': { homer: [120, 238, .95] }, 'Reading Corridor': { callimachus: [230, 236, .95] }, "Librarian's Office": { apollonius: [150, 236, .95], callimachus: [290, 238, .9] },
  'Lost inside the Palace': { slave: [310, 234, .9] }, 'The Spirit World': { officers: [200, 238, .95] }, 'Warehouses and Port': { sailor: [190, 242, .95] },
  'Hollow': { crake: [210, 240, 1.1] }, 'Coven Cell': { goat: [180, 238, 1] }, 'Shrine of the Bear': { druid: [300, 238, .95] }, 'Rough Tent': { spy: [100, 246, 1] }, 'Melancholy Dream': { flurries: [200, 190, 1] }
};
const SPOTS = [[290, 238, .9], [110, 238, .9], [200, 240, .85]];
const DEFS = `<linearGradient id="ppDye" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d0508a"/><stop offset=".3" stop-color="#e8a040"/><stop offset=".55" stop-color="#5aa0b0"/><stop offset=".8" stop-color="#8a5ab0"/><stop offset="1" stop-color="#d0508a"/></linearGradient>
<radialGradient id="ppGhost"><stop offset="0" stop-color="#dfe8f0" stop-opacity=".5"/><stop offset="1" stop-color="#dfe8f0" stop-opacity="0"/></radialGradient>
<radialGradient id="ppLamp"><stop offset="0" stop-color="#ffe8a0" stop-opacity=".7"/><stop offset="1" stop-color="#ffe8a0" stop-opacity="0"/></radialGradient>
<linearGradient id="ppSteel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e8f2fa"/><stop offset=".5" stop-color="#9aaabb"/><stop offset="1" stop-color="#d0dce8"/></linearGradient>`;

// add every character who is present (and not already drawn by the room picture itself)
function drawAll(h, room, already) {
  if (!h.st || !h.st.known) return false;
  const here = [];
  // a person is drawn once the text has spoken of them (by name or as the game calls them): no ghostly hints before that
  const known = h.st.mentioned;
  for (const [re, key, label, alias] of WHO) if (h.st.here && (h.st.hereList || []).some(n => re.test(n))) {
    const name = known ? [label].concat(alias || []).find(k => known(k)) : label;
    if (name) here.push([key, name]);
  }
  let used = 0, any = false;
  for (const [key, label] of here) {
    if (new RegExp('data-k="' + label + '"', 'i').test(already) || (key === 'austin' && /data-k="austin"/i.test(already))) continue;
    const p = (PLACE[room] && PLACE[room][key]) || SPOTS[used++ % SPOTS.length];
    h.add(h.tag(label, `<g transform="translate(${p[0]} ${p[1]}) scale(${p[2]})">${F[key]()}</g>`));
    any = true;
  }
  if (any) h.add(`<defs>${DEFS}</defs>`);
  return any;
}

const api = { drawAll, F, WHO, PLACE, DEFS };
if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.ZPeople = api;
})(typeof window !== 'undefined' ? window : this);
