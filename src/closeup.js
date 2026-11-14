// Close-ups of things the game describes but that never stand in a room of their own:
// the Tarot cards and the rods. Shown beside the text when their description is printed.
// Original artwork, drawn only from what each description says.
(function (root) {
'use strict';
let uid = 0;

// a Tarot card: cream border, gilt frame, a picture and its title
function card(title, scene, defs) {
  const id = 'cu' + (++uid);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 320"><defs>${defs ? defs(id) : ''}<linearGradient id="${id}p" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4ead2"/><stop offset="1" stop-color="#dccca4"/></linearGradient><filter id="${id}s" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="4" stdDeviation="5" flood-opacity=".55"/></filter></defs>
<g filter="url(#${id}s)"><rect x="8" y="8" width="184" height="304" rx="12" fill="url(#${id}p)" stroke="#8a6a30" stroke-width="2"/></g>
<rect x="20" y="20" width="160" height="244" rx="4" fill="#1a1410" stroke="#b8902e" stroke-width="3"/>
<svg x="22" y="22" width="156" height="240" viewBox="0 0 156 240" preserveAspectRatio="xMidYMid slice">${scene(id)}</svg>
<rect x="20" y="20" width="160" height="244" rx="4" fill="none" stroke="#e8c860" stroke-width="1" opacity=".6"/>
<rect x="30" y="274" width="140" height="26" rx="3" fill="#efe3c2" stroke="#b8902e" stroke-width="1.5"/>
<text x="100" y="292" text-anchor="middle" font-family="Georgia,serif" font-size="${title.length > 16 ? 11 : 14}" fill="#5a3a14" letter-spacing=".5">${title}</text></svg>`;
}

// a rod lying on dark velvet
function rod(kind, plaque) {
  const id = 'cu' + (++uid);
  const adam = kind !== 'mahogany';
  const shaft = adam ? `url(#${id}a)` : `url(#${id}m)`;
  let end = '';
  if (kind === 'hand') end = `<path d="M262,96 q-4,-26 6,-30 l6,18 v-30 q0,-8 7,-8 q7,0 7,8 v30 v-36 q0,-8 7,-8 q7,0 7,8 v38 v-30 q0,-8 7,-8 q7,0 7,8 v34 v-20 q0,-7 6,-7 q6,0 6,7 v34 q0,26 -26,30 h-20 q-22,-6 -26,-30z" fill="url(#${id}a)" stroke="#6a7280" stroke-width="1.5"/>`;
  else if (kind === 'skull') end = `<path d="M262,96 q0,-46 40,-46 q40,0 40,46 q0,18 -14,24 v14 h-52 v-14 q-14,-6 -14,-24z" fill="url(#${id}a)" stroke="#6a7280" stroke-width="1.5"/><ellipse cx="286" cy="96" rx="11" ry="12" fill="#2a2e36"/><ellipse cx="318" cy="96" rx="11" ry="12" fill="#2a2e36"/><path d="M302,106 l-6,12 h12z" fill="#2a2e36"/><path d="M282,128 v8 M292,128 v8 M302,128 v8 M312,128 v8 M322,128 v8" stroke="#5a6270" stroke-width="2"/>`;
  else if (kind === 'heart') end = `<path d="M302,140 C250,104 262,56 288,60 C298,62 302,72 302,78 C302,72 306,62 316,60 C342,56 354,104 302,140Z" fill="url(#${id}a)" stroke="#6a7280" stroke-width="1.5"/><path d="M282,74 q6,-8 14,-4" stroke="#fff" stroke-width="3" fill="none" opacity=".7"/>`;
  else end = `<rect x="262" y="88" width="46" height="24" rx="3" fill="url(#${id}g)" stroke="#7a7a82"/>${plaque ? `<text x="285" y="104" text-anchor="middle" font-family="Georgia,serif" font-size="9" fill="#3a3a42">${plaque}</text>` : ''}`;
  // adamantine rods are inscribed with their title along the shaft
  const insc = adam ? `<text x="160" y="106" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="11" fill="#4a5260" opacity=".8">${{ hand: 'Life', skull: 'Death', heart: 'Love' }[kind]}</text>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200"><defs>
<radialGradient id="${id}v" cx=".5" cy=".5" r=".75"><stop offset="0" stop-color="#4a1a2a"/><stop offset="1" stop-color="#14060c"/></radialGradient>
<linearGradient id="${id}a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f8fc"/><stop offset=".45" stop-color="#b8c2d0"/><stop offset="1" stop-color="#7a8494"/></linearGradient>
<linearGradient id="${id}m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a8583a"/><stop offset=".5" stop-color="#6a2a16"/><stop offset="1" stop-color="#3a140a"/></linearGradient>
<linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f0f0f4"/><stop offset="1" stop-color="#a8a8b4"/></linearGradient></defs>
<rect width="400" height="200" fill="url(#${id}v)"/>${Array.from({ length: 30 }, (_, i) => `<path d="M${(i * 53) % 400},${(i * 37) % 200} q20,6 40,0" stroke="#000" opacity=".15" fill="none"/>`).join('')}
<ellipse cx="200" cy="150" rx="170" ry="14" fill="#000" opacity=".45"/>
<rect x="40" y="91" width="230" height="18" rx="9" fill="${shaft}" stroke="${adam ? '#6a7280' : '#2a0e04'}" stroke-width="1.5"/>
${adam ? '' : '<path d="M60,96 q80,-3 190,0 M70,104 q80,3 180,1" stroke="#2a0e04" stroke-width="1" fill="none" opacity=".5"/>'}
<rect x="40" y="93" width="230" height="4" rx="2" fill="#fff" opacity="${adam ? .55 : .2}"/>
<circle cx="40" cy="100" r="9" fill="${shaft}" stroke="${adam ? '#6a7280' : '#2a0e04'}" stroke-width="1.5"/>
${insc}${end}
${adam ? `<circle cx="300" cy="94" r="70" fill="#e8f0ff" opacity=".06"/>` : ''}</svg>`;
}

const CARDS = [
  [/bad cold, but nevertheless/, 'Madame Sosostris', () => card('Madame Sosostris', id => `<rect width="156" height="240" fill="#2a1a3a"/>${Array.from({ length: 40 }, (_, i) => `<circle cx="${(i * 41) % 156}" cy="${(i * 29) % 120}" r="${i % 5 ? .7 : 1.3}" fill="#f8e8b0" opacity=".7"/>`).join('')}
<path d="M30,240 Q34,150 78,140 Q122,150 126,240Z" fill="#5a2a5a"/><path d="M52,240 Q60,170 78,166 Q96,170 104,240Z" fill="#7a3a6a" opacity=".7"/>
<ellipse cx="78" cy="104" rx="26" ry="30" fill="#e8c8a8"/><path d="M48,108 Q46,62 78,58 Q110,62 108,108 Q100,80 78,78 Q56,80 48,108Z" fill="#3a1a4a"/><path d="M50,90 q28,-20 56,0" stroke="#c8a040" stroke-width="3" fill="none"/><circle cx="78" cy="76" r="4" fill="#e8c040"/>
<path d="M66,100 q4,-3 8,0 M84,100 q4,-3 8,0" stroke="#3a2418" stroke-width="2" fill="none"/><ellipse cx="78" cy="116" rx="7" ry="5" fill="#e88a8a"/>
<path d="M62,120 q16,-10 32,0 q-2,16 -16,18 q-14,-2 -16,-18z" fill="#f4f0e8" stroke="#c8c0b0"/><path d="M90,122 q14,4 18,18" stroke="#e8c8a8" stroke-width="7" fill="none" stroke-linecap="round"/>
<path d="M100,100 q6,-4 10,0 M104,92 q6,-4 10,0" stroke="#c8d8f0" stroke-width="1.5" fill="none" opacity=".7"/>`)],
  [/hood, scythe, skeleton/i, 'Grim Reaper', () => card('Grim Reaper', id => `<rect width="156" height="240" fill="#3a3a46"/><circle cx="118" cy="40" r="16" fill="#d8d8c8" opacity=".85"/>
<path d="M0,240 V200 Q78,184 156,204 V240Z" fill="#1a1a20"/>
<path d="M118,30 L40,236" stroke="#5a3a20" stroke-width="5"/><path d="M118,30 Q150,40 152,82 Q132,52 108,50Z" fill="#c8ccd4" stroke="#7a8090"/>
<path d="M44,236 Q40,120 80,82 Q118,112 116,236Z" fill="#14141a"/><path d="M58,112 Q60,70 80,66 Q102,70 104,112 Q98,96 80,94 Q62,96 58,112Z" fill="#14141a"/>
<ellipse cx="80" cy="100" rx="15" ry="17" fill="#e8e4d8"/><circle cx="74" cy="98" r="4.5" fill="#14141a"/><circle cx="86" cy="98" r="4.5" fill="#14141a"/><path d="M80,104 l-3,5 h6z" fill="#14141a"/>
<path d="M70,110 q10,8 20,0" stroke="#14141a" stroke-width="1.6" fill="none"/>${[72, 76, 80, 84, 88].map(x => `<line x1="${x}" y1="110" x2="${x}" y2="114" stroke="#14141a" stroke-width="1"/>`).join('')}
<path d="M98,140 q14,-10 22,-26" stroke="#e8e4d8" stroke-width="3" fill="none"/>${[0, 1, 2, 3].map(i => `<line x1="${68 + i * 3}" y1="${150 + i * 14}" x2="${92 - i * 2}" y2="${150 + i * 14}" stroke="#d8d4c8" stroke-width="2.5" opacity=".7"/>`).join('')}`)],
  [/edge of a cliff/, 'The Fool', () => card('The Fool', id => `<defs><linearGradient id="${id}k" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8c860"/><stop offset="1" stop-color="#f8eed0"/></linearGradient></defs><rect width="156" height="240" fill="url(#${id}k)"/><circle cx="30" cy="36" r="18" fill="#fff4c0"/>
<path d="M0,200 Q60,180 156,196 V240 H0Z" fill="#8ab0c8" opacity=".7"/><path d="M0,240 V150 L96,150 L104,240Z" fill="#8a7a5a"/><path d="M96,150 L104,240" stroke="#5a4a32" stroke-width="2"/><path d="M0,150 H96" stroke="#5a7a3a" stroke-width="5"/>
<g transform="translate(96 150)"><path d="M-10,0 L-6,-34 L6,-34 L14,-4" stroke="#3a3a6a" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M8,-6 l12,10" stroke="#3a3a6a" stroke-width="6" stroke-linecap="round"/>
<path d="M-12,-34 Q-14,-72 0,-76 Q14,-72 12,-34Z" fill="#c84a3a"/><path d="M-12,-60 l-16,-14 M12,-60 l14,-18" stroke="#c84a3a" stroke-width="6" stroke-linecap="round"/><circle cx="0" cy="-86" r="10" fill="#e8c8a8"/><path d="M-10,-90 q10,-14 22,-2 l6,-8 l-2,12z" fill="#3a8a4a"/><circle cx="5" cy="-87" r="1.5" fill="#2a1a10"/>
<line x1="26" y1="-78" x2="20" y2="-44" stroke="#5a3a1a" stroke-width="2.5"/><circle cx="27" cy="-80" r="6" fill="#a87a3a"/></g>`)],
  [/pearls that were his eyes/, 'Drowned Sailor', () => card('Drowned Sailor', id => `<defs><linearGradient id="${id}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a7a8a"/><stop offset="1" stop-color="#0a2a3a"/></linearGradient></defs><rect width="156" height="240" fill="url(#${id}w)"/>
${[[30, 40], [120, 30], [60, 200], [130, 170]].map(([x, y]) => `<path d="M${x},${y} l20,80" stroke="#8ad0e0" stroke-width="10" opacity=".08"/>`).join('')}
<path d="M0,240 Q40,212 78,222 Q120,210 156,228 V240Z" fill="#c8b07a" opacity=".8"/>${[20, 40, 120, 140].map((x, i) => `<path d="M${x},236 q${i % 2 ? 8 : -8},-30 0,-60 q${i % 2 ? -8 : 8},-20 0,-36" stroke="#3a6a3a" stroke-width="3" fill="none"/>`).join('')}
<g transform="rotate(-8 78 130)"><path d="M46,230 Q44,150 78,140 Q112,150 110,230Z" fill="#2a3a5a"/><path d="M58,148 L78,170 L98,148" fill="#e8e8f0"/><path d="M64,152 h28" stroke="#2a3a5a" stroke-width="3"/>
<ellipse cx="78" cy="110" rx="22" ry="26" fill="#a8c0c0"/><path d="M56,104 Q58,80 78,80 Q98,80 100,104 Q90,92 78,92 Q66,92 56,104Z" fill="#2a3a3a"/>
<circle cx="70" cy="110" r="5.5" fill="#f8f4f0"/><circle cx="86" cy="110" r="5.5" fill="#f8f4f0"/><circle cx="68.5" cy="108.5" r="2" fill="#fff"/><circle cx="84.5" cy="108.5" r="2" fill="#fff"/>
<path d="M72,126 q6,3 12,0" stroke="#5a7070" stroke-width="1.5" fill="none"/></g>${[[40, 80], [50, 60], [112, 70], [118, 50], [108, 30]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${2 + i % 3}" fill="none" stroke="#c8f0ff" opacity=".6"/>`).join('')}`)],
  [/crystal-glass cups and glasses/, 'Ace of Cups', () => card('Ace of Cups', id => `<defs><radialGradient id="${id}g" cx=".5" cy=".4" r=".7"><stop offset="0" stop-color="#5a4a7a"/><stop offset="1" stop-color="#1a1430"/></radialGradient></defs><rect width="156" height="240" fill="url(#${id}g)"/>
${(() => { let s = ''; const cups = [[78, 120, 1.4], [40, 90, .8], [116, 92, .8], [30, 160, .9], [126, 162, .9], [78, 198, .9], [56, 60, .6], [100, 58, .6], [52, 210, .7], [104, 212, .7]]; for (const [x, y, k] of cups) s += `<g transform="translate(${x} ${y}) scale(${k})"><path d="M-14,-30 h28 q0,24 -14,28 q-14,-4 -14,-28z" fill="#d8eef8" opacity=".45" stroke="#f0faff" stroke-width="1.5"/><path d="M0,-2 v18 M-10,16 h20" stroke="#f0faff" stroke-width="2"/><path d="M-9,-26 q2,14 6,20" stroke="#fff" stroke-width="2" fill="none" opacity=".8"/><circle cx="8" cy="-24" r="1.6" fill="#fff"/></g>`; return s; })()}
${Array.from({ length: 24 }, (_, i) => `<circle cx="${(i * 47) % 156}" cy="${(i * 31) % 240}" r="${i % 4 ? .8 : 1.6}" fill="#fff" opacity=".6"/>`).join('')}`)],
  [/castle on a hill/i, 'Castle', () => card('Castle', id => `<defs><linearGradient id="${id}k" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a9ac8"/><stop offset="1" stop-color="#e8e0c8"/></linearGradient></defs><rect width="156" height="240" fill="url(#${id}k)"/>
${[[30, 40, 26], [110, 30, 20], [70, 60, 16]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .35}" fill="#fff" opacity=".7"/>`).join('')}
<path d="M0,240 V170 Q40,120 78,118 Q118,120 156,166 V240Z" fill="#5a8a44"/><path d="M0,240 V196 Q60,176 156,200 V240Z" fill="#3e6a30"/>
<g transform="translate(78 124)"><rect x="-34" y="-36" width="68" height="36" fill="#9a9488"/><rect x="-46" y="-64" width="20" height="64" fill="#a8a296"/><rect x="26" y="-58" width="20" height="58" fill="#a8a296"/>
${[-46, -40, -34, 26, 32, 40].map((x, i) => `<rect x="${x}" y="${i < 3 ? -70 : -64}" width="5" height="7" fill="#a8a296"/>`).join('')}${[-34, -24, -14, -4, 6, 16, 26].map(x => `<rect x="${x}" y="-42" width="6" height="7" fill="#9a9488"/>`).join('')}
<path d="M-8,0 v-16 a8,8 0 0 1 16,0 v16z" fill="#2a2018"/><rect x="-40" y="-48" width="6" height="10" fill="#2a2018"/><rect x="32" y="-44" width="6" height="10" fill="#2a2018"/>${[[-46, -64], [-34, -36], [26, -58]].map(([x, y]) => `<path d="M${x},${y} v${-y}" stroke="#000" opacity=".12" stroke-width="6"/>`).join('')}
<path d="M-36,-70 v-18 l12,5 l-12,5" fill="#c84a3a" stroke="#5a3a1a" stroke-width="1"/></g>`)],
  [/single bright light/i, 'Star', () => card('Star', id => `<defs><radialGradient id="${id}r"><stop offset="0" stop-color="#fffbe8"/><stop offset=".25" stop-color="#ffe8a0" stop-opacity=".6"/><stop offset="1" stop-color="#ffe8a0" stop-opacity="0"/></radialGradient></defs><rect width="156" height="240" fill="#05060e"/>
<circle cx="78" cy="110" r="70" fill="url(#${id}r)"/><path d="M78,70 L84,104 L118,110 L84,116 L78,150 L72,116 L38,110 L72,104Z" fill="#fffbe8"/><path d="M78,90 L81,107 L98,110 L81,113 L78,130 L75,113 L58,110 L75,107Z" fill="#fff"/>`)],
  [/andromeda chained to a rock/i, 'Maiden', () => card('Maiden', id => `<defs><linearGradient id="${id}k" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8a878"/><stop offset=".55" stop-color="#f4d8b0"/><stop offset=".56" stop-color="#4a7a9a"/><stop offset="1" stop-color="#1e3a5a"/></linearGradient></defs><rect width="156" height="240" fill="url(#${id}k)"/>
${Array.from({ length: 10 }, (_, i) => `<path d="M${(i * 37) % 140},${140 + (i * 23) % 90} q8,-3 16,0" stroke="#fff" opacity=".4" fill="none"/>`).join('')}
<path d="M86,240 Q80,160 104,100 Q126,84 140,110 Q150,170 156,240Z" fill="#5a4e44"/><path d="M104,100 Q112,96 120,104" stroke="#7a6e62" stroke-width="3" fill="none"/><path d="M0,240 Q40,222 90,232 L96,240Z" fill="#c8b07a"/>
<g transform="translate(96 214)"><path d="M-12,0 Q-14,-50 -4,-74 Q8,-80 14,-74 Q22,-48 16,0Z" fill="#f4f0e8"/><path d="M-6,-60 q-16,-14 -6,-34 M12,-60 q16,-16 8,-38" stroke="#e8c8a8" stroke-width="6" fill="none" stroke-linecap="round"/>
<circle cx="4" cy="-86" r="10" fill="#e8c8a8"/><path d="M-8,-86 q2,-16 14,-14 q12,4 8,20 q-2,-12 -10,-12 q-6,2 -12,6z" fill="#8a4a24"/><path d="M-6,-84 q-6,20 -4,34" stroke="#8a4a24" stroke-width="5" fill="none"/>
<path d="M-12,-96 l-10,-6 M-16,-99 l-4,-3 M20,-100 l10,-6 M26,-103 l4,-3" stroke="#6a6a72" stroke-width="2.5" stroke-dasharray="3 1.5"/><path d="M-22,-102 l-4,-2 M30,-106 l6,4" stroke="#6a6a72" stroke-width="3"/></g>`)],
  [/old druidical symbol/i, 'Crescent Moon', () => card('Crescent Moon', id => `<defs><radialGradient id="${id}g" cx=".5" cy=".45" r=".7"><stop offset="0" stop-color="#2a3a5a"/><stop offset="1" stop-color="#080c1a"/></radialGradient></defs><rect width="156" height="240" fill="url(#${id}g)"/>
${Array.from({ length: 36 }, (_, i) => `<circle cx="${(i * 43) % 156}" cy="${(i * 31) % 200}" r="${i % 6 ? .7 : 1.4}" fill="#fff" opacity=".7"/>`).join('')}
<circle cx="78" cy="100" r="50" fill="#f4ecc8" opacity=".12"/><path d="M96,56 A46,46 0 1 0 96,144 A36,36 0 1 1 96,56Z" fill="#f4ecc8"/>
`)],
  [/nothing special about the eight of wands/i, 'Eight of Wands', () => card('Eight of Wands', id => `<defs><linearGradient id="${id}k" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ab8d8"/><stop offset="1" stop-color="#e8e4c8"/></linearGradient></defs><rect width="156" height="240" fill="url(#${id}k)"/>
<path d="M0,240 V200 Q78,184 156,198 V240Z" fill="#6a9a4a"/>
${Array.from({ length: 8 }, (_, i) => `<g transform="translate(${20 + i * 3} ${70 + i * 15}) rotate(-28)"><rect x="0" y="-3" width="104" height="6" rx="3" fill="#8a5a2a" stroke="#4a2e12" stroke-width=".8"/><path d="M104,0 q6,-6 10,-2 q-4,6 -10,2z" fill="#5a9a3a"/><path d="M30,-3 q4,-6 8,-2" fill="#5a9a3a"/></g>`).join('')}`)],
  [/sculpted hand on one end/, 'High Rod of Life', () => rod('hand')],
  [/sculpted skull on one end/, 'High Rod of Death', () => rod('skull')],
  [/sculpted heart on one end/, 'High Rod of Love', () => rod('heart')],
  [/plaque on this mahogany rod proclaims it as the rod of (\w+)/i, null, m => rod('mahogany', m[1])],
  [/featureless mahogany rod/, null, () => rod('mahogany', '')]
];

// the close-up for a piece of game text, if it describes one of these things
function find(text) {
  const t = String(text || '');
  for (const [re, title, draw] of CARDS) { const m = re.exec(t); if (m) return { title: title || ('Rod of ' + (m[1] || '…')).replace('Rod of …', 'Mahogany rod'), svg: draw(m), wide: /<svg[^>]*viewBox="0 0 400/.test(draw(m)) }; }
  return null;
}

const api = { find, card, rod };
if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.ZClose = api;
})(typeof window !== 'undefined' ? window : this);
