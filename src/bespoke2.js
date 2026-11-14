// Second batch of hand-composed room illustrations (original artwork based on the room descriptions).
(function (root) {
'use strict';
const B = (root.ZBespoke || require('./bespoke.js')).BESPOKE;

// ---------- helpers ----------
const sky = (h, a, b, c) => h.add(`<rect width="400" height="260" fill="${h.lin('sky', c ? [[0, a], [.6, b], [1, c]] : [[0, a], [1, b]])}"/>`);
const room = (h, wall, floor, side) => {
  const { add, lin } = h;
  add(`<rect width="400" height="260" fill="${side || '#1a140e'}"/>`);
  add(`<polygon points="0,0 400,0 340,50 60,50" fill="#000" opacity=".35"/><polygon points="0,0 60,50 60,200 0,260" fill="#000" opacity=".25"/><polygon points="400,0 340,50 340,200 400,260" fill="#000" opacity=".3"/>`);
  add(`<rect x="60" y="50" width="280" height="150" fill="${lin('w', [[0, wall[0]], [1, wall[1]]])}"/><polygon points="60,200 340,200 400,260 0,260" fill="${lin('f', [[0, floor[0]], [1, floor[1]]])}"/>`);
};
const stones = (h, x0, y0, x1, y1, col, op) => { for (let y = y0; y < y1; y += 14) for (let x = x0 + ((y / 14) % 2) * 12; x < x1; x += 24) h.add(`<rect x="${x}" y="${y}" width="22" height="12" fill="none" stroke="${col || '#000'}" opacity="${op || .25}"/>`); };
const hedge = (h, x, y, w, ht, c) => { h.add(`<rect x="${x}" y="${y}" width="${w}" height="${ht}" rx="6" fill="${c || '#2a5226'}"/>`); for (let i = 0; i < w / 10; i++) h.add(`<circle cx="${x + 5 + i * 10}" cy="${y + 3}" r="6" fill="${c || '#2a5226'}"/>`); };
const figure = (h, x, y, s, col) => h.add(`<g transform="translate(${x} ${y}) scale(${s})"><circle cx="0" cy="-46" r="7" fill="${col}"/><path d="M-9,-38 Q0,-42 9,-38 L12,-12 L7,0 L-7,0 L-12,-12Z" fill="${col}"/></g>`);
const lamp = (h, x, y, c) => { h.glow(x, y, 50, c || '#ffc870', .5); h.add(`<circle cx="${x}" cy="${y}" r="3.5" fill="#fff0c0"/>`); };
const moonAt = (h, x, y, r, col) => { h.glow(x, y, r * 4, col || '#f4ecd0', .35); h.add(`<circle cx="${x}" cy="${y}" r="${r}" fill="${col || '#f4ecd0'}"/>`); };
const seaBand = (h, y, a, b) => { h.add(`<rect y="${y}" width="400" height="${260 - y}" fill="${h.lin('sea', [[0, a], [1, b]])}"/>`); for (let i = 0; i < 26; i++) { const yy = h.R(y + 4, 258), x = h.R(-10, 400), l = h.R(8, 30); h.add(`<path d="M${x},${yy} q${l / 2},-3 ${l},0" stroke="#fff" stroke-width=".8" fill="none" opacity="${h.R(.12, .4).toFixed(2)}"/>`); } };
const columns = (h, x0, x1, n, top, bot, col) => { for (let i = 0; i < n; i++) { const x = x0 + i * (x1 - x0) / (n - 1); h.add(`<rect x="${x - 8}" y="${top}" width="16" height="${bot - top}" fill="${col || '#e8dcc4'}"/><rect x="${x - 11}" y="${top}" width="22" height="5" fill="#d8ccb0"/><rect x="${x - 11}" y="${bot - 5}" width="22" height="5" fill="#cfc2a6"/><line x1="${x - 3}" y1="${top + 5}" x2="${x - 3}" y2="${bot - 5}" stroke="#000" opacity=".08" stroke-width="3"/>`); } };

// ---------- the house ----------
B['Inside Cupboard'] = { cat: 'interior', draw(h) {
  room(h, ['#4a3e34', '#2e2620'], ['#3a2c20', '#20170f']);
  // blacked-out skylight with a crank handle
  h.add(`<polygon points="150,0 250,0 240,30 160,30" fill="${h.st.known && h.st.open('skylight', false) ? '#9ac0e0' : '#0a0a0c'}" stroke="#3a3028" stroke-width="3"/><line x1="200" y1="30" x2="200" y2="62" stroke="#6a6a6a" stroke-width="2"/><path d="M200,62 h14 v8" stroke="#6a6a6a" stroke-width="3" fill="none"/><rect x="210" y="68" width="8" height="10" rx="2" fill="#7a4a2a"/>`);
  // large painting of an 18th-century ancestor propped against the west wall
  if (h.st.here('painting')) h.add(h.tag('painting', `<g transform="skewY(8)"><rect x="12" y="40" width="70" height="120" fill="#7a5a20" stroke="#c8a040" stroke-width="4"/><rect x="20" y="48" width="54" height="104" fill="#2e2418"/><path d="M28,152 Q32,108 47,100 Q62,108 66,152Z" fill="#4a2a24"/><ellipse cx="47" cy="88" rx="10" ry="12" fill="#c8a080"/><path d="M36,84 Q47,64 58,84 Q60,96 56,104 L38,104 Q34,96 36,84Z" fill="#e8e4dc" opacity=".9"/><circle cx="43" cy="88" r="1.3" fill="#2a1a10"/><circle cx="51" cy="88" r="1.3" fill="#2a1a10"/><path d="M42,128 h10 l3,10 h-16z" fill="#e8e4dc"/></g>`));
  // gas mask on the floor
  if (h.st.here('gas mask')) h.add(h.tag('gas mask', `<ellipse cx="260" cy="226" rx="24" ry="18" fill="#4a5244"/><circle cx="250" cy="220" r="7" fill="#9ab0b8" stroke="#222" stroke-width="2"/><circle cx="270" cy="220" r="7" fill="#9ab0b8" stroke="#222" stroke-width="2"/><rect x="254" y="232" width="12" height="16" rx="3" fill="#2a2e28"/><path d="M260,248 q20,6 40,-4" stroke="#2a2e28" stroke-width="5" fill="none"/>`));
  h.add(`<rect x="335" y="88" width="6" height="110" fill="#000" opacity=".3"/>`);
  // the blacked-out skylight lets no light in: only what you carry shows the room; open, the sky lights it
  const sky = (h.st.known && h.st.open('skylight', false)) || /skylight above is open/i.test(h.desc);
  if (sky) { h.add(`<polygon points="160,30 240,30 300,260 100,260" fill="#e8f0f8" opacity=".14"/>`); h.glow(200, 40, 220, '#f0f4ff', .35); }
  else h.add(`<defs><radialGradient id="icDim" cx=".5" cy=".6" r=".6"><stop offset="0" stop-color="#000" stop-opacity=".3"/><stop offset=".6" stop-color="#000" stop-opacity=".72"/><stop offset="1" stop-color="#000" stop-opacity=".92"/></radialGradient></defs><rect width="400" height="260" fill="url(#icDim)"/>`);
} };

B['Roof'] = { cat: 'heights', draw(h) {
  sky(h, '#5a8ac0', '#c8dcec');
  for (let i = 0; i < 5; i++) h.add(`<ellipse cx="${h.R(0, 400)}" cy="${h.R(20, 90)}" rx="${h.R(30, 70)}" ry="${h.R(7, 13)}" fill="#fff" opacity=".6"/>`);
  // the odd little balcony, too far away to the south
  h.add(`<rect x="300" y="128" width="40" height="22" fill="#d8c8a8"/><rect x="296" y="148" width="48" height="4" fill="#5a4a3a"/>${Array.from({ length: 7 }, (_, i) => `<line x1="${298 + i * 7}" y1="152" x2="${298 + i * 7}" y2="164" stroke="#3a3028" stroke-width="1.5"/>`).join('')}<rect x="296" y="164" width="48" height="3" fill="#3a3028"/>`);
  // steep red-tiled roof slopes
  h.add(`<polygon points="0,150 200,90 400,150 400,260 0,260" fill="#a8442a"/>`);
  for (let y = 100; y < 260; y += 10) h.add(`<line x1="0" y1="${y + 40}" x2="400" y2="${y + 40}" stroke="#7a2e1a" opacity=".5"/>`);
  for (let x = 0; x < 400; x += 16) h.add(`<line x1="${x}" y1="140" x2="${x + (x - 200) * .4}" y2="260" stroke="#7a2e1a" opacity=".35"/>`);
  // recessed lead flat with open skylight and stub of the old flagpole
  h.add(`<polygon points="110,190 290,190 330,250 70,250" fill="#5a5e62"/><polygon points="170,206 230,206 238,232 162,232" fill="#14181c"/><polygon points="170,206 230,206 226,176 174,176" fill="#8aa8c0" opacity=".7" stroke="#3a3a3a" stroke-width="2"/><rect x="262" y="196" width="6" height="12" fill="#6a6a6a"/>`);
  // catwalk to the northwest
  h.add(`<polygon points="110,190 128,190 40,120 26,124" fill="#6a5034"/>${Array.from({ length: 8 }, (_, i) => `<line x1="${118 - i * 11}" y1="${190 - i * 9}" x2="${104 - i * 11}" y2="${188 - i * 9}" stroke="#3a2a1a"/>`).join('')}`);
} };

B['Battlements'] = { cat: 'heights', draw(h) {
  sky(h, '#7a90a8', '#d8dce0');
  h.add(`<rect width="400" height="260" fill="#b8d8f0" opacity=".12"/>`);
  h.ridge(170, 8, '#7a8a70', 6); h.ridge(184, 6, '#5a6e4e', 8);
  // crenellated parapet
  let d = 'M0,260 L0,140';
  for (let x = 0; x < 400; x += 56) d += ` L${x},110 L${x + 30},110 L${x + 30},140 L${x + 56},140`;
  d += ' L400,260Z';
  h.add(`<path d="${d}" fill="#8a8478"/>`); stones(h, 0, 110, 400, 260, '#4a463e', .4);
  h.add(`<rect y="200" width="400" height="60" fill="#6a6458"/>`);
  // the iron gothic key
  // once the ghost has shown himself he has eaten the key
  const eaten = h.st.here('Sir Joshua') && h.st.mentioned && h.st.mentioned('ghost');
  if (h.st.here('gothic') && !eaten) h.add(h.tag('gothic', `<g transform="rotate(-12 210 228)"><circle cx="186" cy="228" r="11" fill="none" stroke="#2a2a2e" stroke-width="4"/><path d="M180,222 l6,-8 l6,8" stroke="#2a2a2e" stroke-width="2.5" fill="none"/><rect x="196" y="225" width="50" height="6" fill="#2a2a2e"/><path d="M234,231 v10 h6 v-6 h4 v8 h4 v-12" fill="#2a2a2e"/></g>`));
  // peculiar cold: frost sparkles
  for (let i = 0; i < 40; i++) h.add(`<circle cx="${h.R(0, 400)}" cy="${h.R(110, 260)}" r="${h.R(.5, 1.4)}" fill="#e8f4ff" opacity="${h.R(.3, .8)}"/>`);
} };

B["Priest's Hole"] = { cat: 'cellar', draw(h) {
  room(h, ['#3a342e', '#24201c'], ['#4a3a4a', '#2a222a']);
  stones(h, 60, 50, 340, 200, '#000', .2);
  // cross painted on one wall
  h.add(`<rect x="192" y="70" width="16" height="90" fill="#8a2a22" opacity=".8"/><rect x="168" y="94" width="64" height="14" fill="#8a2a22" opacity=".8"/>`);
  // padded floor
  for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++) h.add(`<circle cx="${40 + i * 64 + j * 10}" cy="${214 + j * 16}" r="2" fill="#1a141a"/>`);
  // little hatch door low on one wall, and the crawl up into the chimney
  if (h.st.known && h.st.open('hatch', false)) h.add(`<rect x="270" y="168" width="40" height="32" fill="#060404"/><polygon points="270,168 256,172 256,204 270,200" fill="#4a3420"/>`);
  else h.add(`<rect x="270" y="168" width="40" height="32" fill="#4a3420" stroke="#1a1008" stroke-width="2"/><circle cx="302" cy="184" r="2" fill="#c8a060"/>`);
  h.add(`<polygon points="70,50 110,50 104,0 76,0" fill="#060404"/>`);
  // prayer book in the dust
  if (h.st.here('prayer book')) h.add(h.tag('prayer book', `<rect x="150" y="226" width="34" height="22" fill="#3a1a14" stroke="#1a0a08" transform="rotate(-10 167 237)"/><rect x="164" y="230" width="4" height="12" fill="#c8a040" transform="rotate(-10 167 237)"/><rect x="152" y="230" width="8" height="2" fill="#c8a040" transform="rotate(-10 167 237)"/>`));
  for (let i = 0; i < 40; i++) h.add(`<circle cx="${h.R(0, 400)}" cy="${h.R(200, 260)}" r="${h.R(1, 4)}" fill="#6a5a50" opacity=".35"/>`);
  // supernatural air
  h.glow(200, 110, 150, '#b0c0ff', .18);
} };

B["Alison's Writing Room"] = { cat: 'interior', draw(h) {
  room(h, ['#c8b8a0', '#a89880'], ['#7a5a40', '#5a3e28'], '#5a4a3a');
  // dice-motif wallpaper
  for (let y = 58; y < 196; y += 22) for (let x = 66 + ((y / 22) % 2) * 11; x < 336; x += 22) { const n = 1 + Math.floor(h.r() * 6); h.add(`<rect x="${x}" y="${y}" width="12" height="12" rx="2" fill="#efe6d4" stroke="#9a8a70" stroke-width=".6"/>${pips(x, y, n)}`); }
  function pips(x, y, n) { const P = { 1: [[6, 6]], 2: [[3, 3], [9, 9]], 3: [[3, 3], [6, 6], [9, 9]], 4: [[3, 3], [9, 3], [3, 9], [9, 9]], 5: [[3, 3], [9, 3], [6, 6], [3, 9], [9, 9]], 6: [[3, 3], [9, 3], [3, 6], [9, 6], [3, 9], [9, 9]] }; return P[n].map(([a, b]) => `<circle cx="${x + a}" cy="${y + b}" r=".9" fill="#5a4a3a"/>`).join(''); }
  // latticed south windows showing blue sky (on the right wall); opened, the casements swing into the room
  h.add(`<polygon points="352,60 392,40 392,170 352,170" fill="#8ac0e8"/>`);
  const winOpen = (h.st.known && h.st.open('windows', false)) || /latticed windows open on/i.test(h.desc);
  if (winOpen) { h.add(`<path d="M360,120 q14,-20 30,-10 v60 h-30z" fill="#6aa850" opacity=".7"/>`); h.add(h.tag('windows', `<polygon points="352,60 330,72 330,176 352,170" fill="#8ac0e8" opacity=".35" stroke="#1a1a1a" stroke-width="2"/>${[0, 1, 2, 3, 4].map(i => `<line x1="330" y1="${72 + i * 24}" x2="352" y2="${60 + i * 24}" stroke="#1a1a1a" stroke-width="1.2"/>`).join('')}`)); h.glow(372, 110, 90, '#fff8d8', .35); }
  else for (let i = 0; i < 6; i++) h.add(`<line x1="352" y1="${60 + i * 22}" x2="392" y2="${40 + i * 26}" stroke="#1a1a1a" stroke-width="1.2"/><line x1="${352 + i * 8}" y1="${60 - i * 4}" x2="${352 + i * 8}" y2="170" stroke="#1a1a1a" stroke-width="1.2"/>`);
  // engravings of four heroines
  for (let i = 0; i < 4; i++) { const x = 92 + i * 44; h.add(`<rect x="${x}" y="70" width="30" height="38" fill="#f4eee0" stroke="#3a2a1a" stroke-width="2"/><ellipse cx="${x + 15}" cy="${84}" rx="6" ry="7" fill="#8a8070"/><path d="M${x + 6},106 q9,-16 18,0" fill="#6a6050"/>`); }
  // small door with a square outline of sixes (on the left)
  h.add(`<rect x="6" y="120" width="40" height="90" fill="#efe6d4"/><rect x="12" y="128" width="28" height="82" fill="#6a4a2a"/><circle cx="36" cy="170" r="2" fill="#c8a060"/>`);
  // comfortable bed and long vanity mirror
  h.add(`<rect x="150" y="160" width="160" height="44" fill="#f0e8f0"/><rect x="146" y="140" width="10" height="76" fill="#6a4a30"/><rect x="304" y="150" width="10" height="66" fill="#6a4a30"/><path d="M180,170 Q240,156 304,170 L304,202 L180,202Z" fill="#c8a0b8"/><ellipse cx="174" cy="160" rx="18" ry="9" fill="#fff"/>`);
  h.add(`<rect x="318" y="96" width="24" height="104" rx="4" fill="#c8d8e0" stroke="#8a6a3a" stroke-width="3"/><path d="M324,104 l12,40" stroke="#fff" opacity=".6" stroke-width="2"/>`);
  // the Merchant Navy flag spread out as a blanket on the bed
  if (h.st.known ? h.st.inside('bed').some(n => /flag/i.test(n)) : /as a blanket|on the comfortable bed (is|you can see) a flag/i.test(h.desc))
    h.add(h.tag('flag', `<path d="M184,168 Q240,156 300,168 L300,200 L184,200Z" fill="#c82a2a"/><rect x="186" y="168" width="40" height="18" fill="#1a3a8a"/><path d="M186,168 l40,18 M226,168 l-40,18 M206,168 v18 M186,177 h40" stroke="#fff" stroke-width="3"/><path d="M206,168 v18 M186,177 h40" stroke="#c82a2a" stroke-width="1.5"/>`));
  // mildew
  for (let i = 0; i < 12; i++) h.add(`<circle cx="${h.R(60, 340)}" cy="${h.R(50, 70)}" r="${h.R(3, 10)}" fill="#5a6a4a" opacity=".2"/>`);
} };

B['Tiny Balcony'] = { cat: 'heights', draw(h) {
  sky(h, '#4a8ad0', '#dcecf4');
  h.add(`<circle cx="320" cy="40" r="16" fill="#fff8e0"/>`);
  // magnificent view over the gardens down to the motorway
  h.ridge(140, 8, '#8aa0a0', 6);
  h.add(`<path d="M0,150 Q200,138 400,148" stroke="#8a8a8a" stroke-width="5" fill="none"/>`);
  for (let i = 0; i < 6; i++) h.add(`<rect x="${h.R(0, 380)}" y="${144 + h.R(-2, 2)}" width="5" height="3" fill="${['#c83a3a', '#3a6ac8', '#e8e8e8'][i % 3]}"/>`);
  h.ridge(165, 8, '#6a9a5a', 7);
  for (let i = 0; i < 8; i++) h.tree(h.R(0, 400), h.R(178, 192), h.R(22, 36), '#3e6a36');
  h.add(`<rect y="190" width="400" height="70" fill="#5a8a46"/>`);
  for (let i = 0; i < 4; i++) h.add(`<rect x="${40 + i * 90}" y="${200 + h.R(0, 10)}" width="${h.R(40, 70)}" height="14" rx="5" fill="#2a5226"/>`);
  if (h.st.known && h.st.here('gold key')) { h.glow(300, 240, 24, '#ffe08a', .7); h.add(`<path d="M290,242 h18 m-4,0 v4 m-6,-4 v3" stroke="#e8c040" stroke-width="2.5" fill="none"/><circle cx="288" cy="242" r="4" fill="none" stroke="#e8c040" stroke-width="2.5"/>`); }
  // balcony rail in the foreground and the window-sill behind
  h.add(`<rect y="214" width="400" height="8" fill="#e8e0cc"/><rect y="250" width="400" height="10" fill="#d8ccb4"/>${Array.from({ length: 16 }, (_, i) => `<rect x="${8 + i * 25}" y="222" width="8" height="28" rx="3" fill="#e0d8c4"/>`).join('')}`);
} };

// ---------- basement ----------
B['Cellars'] = { cat: 'cellar', draw(h) {
  room(h, ['#3a3430', '#221e1a'], ['#2e2822', '#1a1612'], '#141210');
  stones(h, 60, 50, 340, 200, '#000', .35);
  // shaft opening with the wheel beside it (mirrors the storage room)
  h.add(`<rect x="100" y="80" width="70" height="110" fill="#040302" stroke="#2a221a" stroke-width="5"/>`);
h.add(h.open('wheel'));   const wx = 225, wy = 130, wr = 32;
  h.add(`<circle cx="${wx}" cy="${wy}" r="${wr}" fill="none" stroke="#3a3a36" stroke-width="6"/>`);
  for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; h.add(`<line x1="${wx}" y1="${wy}" x2="${wx + Math.cos(a) * wr}" y2="${wy + Math.sin(a) * wr}" stroke="#3a3a36" stroke-width="3.5"/>`); }
  h.add(`<circle cx="${wx}" cy="${wy}" r="6" fill="#5a5a52"/><rect x="${wx + 20}" y="${wy - 36}" width="7" height="18" rx="3" fill="#7a4a2a"/>`); h.add('</g>');
  // little closed window-vent low in the north wall
  h.add(`<rect x="270" y="170" width="40" height="18" fill="#3a3a3a" stroke="#1a1a1a"/>${[0, 1, 2, 3].map(i => `<line x1="272" y1="${173 + i * 4}" x2="308" y2="${173 + i * 4}" stroke="#1a1a1a"/>`).join('')}`);
  if (h.st.known && h.st.here('dumbwaiter')) h.add(`<rect x="106" y="140" width="58" height="46" fill="#4a3420" stroke="#1a1008" stroke-width="1.5"/><line x1="106" y1="163" x2="164" y2="163" stroke="#2a1a0c" stroke-width="2"/><line x1="124" y1="80" x2="124" y2="140" stroke="#8a7a60"/><line x1="146" y1="80" x2="146" y2="140" stroke="#8a7a60"/>`);
  // dust-covered robot mouse in a corner
  if (h.st.here('robot mouse')) h.add(h.tag('robot mouse', `<ellipse cx="340" cy="236" rx="18" ry="10" fill="#8a8a8e"/><circle cx="324" cy="230" r="7" fill="#9a9aa0"/><circle cx="321" cy="223" r="4" fill="#aaa"/><circle cx="320" cy="230" r="1.4" fill="#e04030"/><path d="M358,238 q16,4 22,-6" stroke="#6a6a6a" stroke-width="2" fill="none"/><ellipse cx="340" cy="230" rx="16" ry="5" fill="#b8b0a0" opacity=".5"/>`));
  // cobwebs
  for (const [x, y, s] of [[60, 50, 1], [340, 50, -1]]) h.add(`<g stroke="#c8c8c8" opacity=".35" fill="none">${[0, 1, 2, 3].map(i => `<path d="M${x},${y + i * 10} Q${x + s * (14 + i * 6)},${y + 8 + i * 8} ${x + s * (10 + i * 10)},${y}"/>`).join('')}<line x1="${x}" y1="${y}" x2="${x + s * 50}" y2="${y + 40}"/></g>`);
  h.glow(180, 150, 150, '#ffe2a6', .14);
} };

B['Wine Cellars'] = { cat: 'cellar', draw(h) {
  room(h, ['#2e2620', '#1a1612'], ['#2a221c', '#141210'], '#100c0a');
  // hexagonal wine racks, mostly empty
  const hex = (cx, cy, r) => Array.from({ length: 6 }, (_, i) => `${cx + r * Math.cos(Math.PI / 6 + i * Math.PI / 3)},${cy + r * Math.sin(Math.PI / 6 + i * Math.PI / 3)}`).join(' ');
  for (let row = 0; row < 6; row++) for (let col = 0; col < 13; col++) {
    const cx = 74 + col * 21 + (row % 2) * 10.5, cy = 64 + row * 22;
    h.add(`<polygon points="${hex(cx, cy, 12)}" fill="#120c08" stroke="#5a3e24" stroke-width="2"/>`);
    if (h.r() < .28) h.add(`<circle cx="${cx}" cy="${cy}" r="6" fill="#2a4a2a"/><circle cx="${cx}" cy="${cy}" r="2.4" fill="#5a2a1a"/>`);
    else if (h.r() < .15) h.add(`<circle cx="${cx + 2}" cy="${cy + 2}" r="1.5" fill="#8a8070"/>`);
  }
  h.add(`<rect x="60" y="196" width="280" height="6" fill="#3a2818"/>`);
  // the barrel-shaft to the north lets in daylight only once the timber hatch above is open
  if (/bright light floods in/i.test(h.desc) || (h.st && h.st.known && h.st.open('timber hatch', false))) {
    h.add(`<polygon points="200,0 250,0 300,260 120,260" fill="#fff2c8" opacity=".16"/><polygon points="212,0 238,0 268,260 150,260" fill="#fff8e0" opacity=".14"/>`);
    h.glow(210, 230, 110, '#fff0c0', .3);
  } else h.glow(300, 120, 120, '#ffb070', .18);
} };

B['Cellar West'] = { cat: 'cellar', draw(h) {
  room(h, ['#2a2622', '#181512'], ['#2a2420', '#151210'], '#100d0b');
  stones(h, 60, 50, 340, 200, '#000', .3);
  // heavy ironbound door in the northwest wall
  if (h.st.known && h.st.open('ironbound', false)) h.add(`<path d="M70,200 L70,100 Q70,70 100,70 Q130,70 130,100 L130,200Z" fill="#060404"/><polygon points="70,100 50,108 50,206 70,200" fill="#4a3018"/>`);
  else h.add(`<path d="M70,200 L70,100 Q70,70 100,70 Q130,70 130,100 L130,200Z" fill="#4a3018" stroke="#1a1008" stroke-width="3"/>${[100, 130, 160, 186].map(y => `<rect x="70" y="${y}" width="60" height="6" fill="#2a2a2e"/>`).join('')}${[0, 1, 2, 3].map(i => `<circle cx="${80 + i * 14}" cy="${103 + i}" r="1.8" fill="#6a6a6a"/>`).join('')}<circle cx="120" cy="150" r="4" fill="none" stroke="#6a6a6a" stroke-width="2"/>`);
  // golden, jewelled staircase leading down into smoky mists to the south
  for (let i = 0; i < 9; i++) {
    const w = 150 - i * 12, x = 280 - w / 2 + i * 4, y = 252 - i * 7;
    h.add(`<rect x="${x}" y="${y - 7}" width="${w}" height="7" fill="${i % 2 ? '#d8a830' : '#e8c048'}" stroke="#8a6010" stroke-width=".8"/>`);
    for (let k = 0; k < 4; k++) h.add(`<circle cx="${x + 10 + k * (w - 20) / 3}" cy="${y - 3.5}" r="2" fill="${['#e83a5a', '#3a8ae8', '#3ae88a', '#e8e83a'][(i + k) % 4]}"/>`);
  }
  h.glow(280, 200, 130, '#ffd86a', .3);
  for (let i = 0; i < 9; i++) h.add(`<ellipse cx="${h.R(200, 380)}" cy="${h.R(150, 260)}" rx="${h.R(30, 70)}" ry="${h.R(8, 16)}" fill="#c8c0d0" opacity="${h.R(.08, .22)}"/>`);
} };

B['Infinity Symbol'] = { cat: 'otherworld', draw(h) {
  const st = h.st;
  // the rods the game has fixed in the arc sockets, the spherical opening, and the golden light once the orb is in it
  const rods = st.known ? st.inside('circular arc') : [];
  const NUM = { two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7 }, nm = /\b(two|three|four|five|six|seven)\b(?: of the)? sockets contain rods/i.exec(h.desc);
  const nRods = rods.length || (/all nine sockets are occupied/i.test(h.desc) ? 9 : /socket is left empty/i.test(h.desc) ? 8 : nm ? NUM[nm[1].toLowerCase()] : /one socket contains a rod/i.test(h.desc) ? 1 : 0);
  const hole = st.known ? st.here('spherical opening') : /spherical opening/.test(h.desc);
  const lit = /golden light/.test(h.desc) || (st.known && !hole && st.mentioned && st.mentioned('spherical opening'));
  h.add(`<rect width="400" height="260" fill="${lit ? '#4a3410' : '#0c0c14'}"/>`);
  // crystal icicles of rock and spiders' webs
  for (let i = 0; i < 26; i++) { const x = h.R(0, 400), l = h.R(20, 70); h.add(`<polygon points="${x - 6},0 ${x + 6},0 ${x},${l}" fill="${lit ? '#f0d890' : '#6a7a9a'}" opacity="${h.R(.4, .8)}"/><line x1="${x}" y1="0" x2="${x}" y2="${l}" stroke="${lit ? '#fff4c8' : '#c8d8f0'}" opacity=".4"/>`); }
  if (!lit || /webs/.test(h.desc)) for (const [x, y] of [[40, 40], [360, 60]]) h.add(`<g stroke="#e0e0e8" opacity=".3" fill="none">${[10, 20, 30, 40].map(r => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}${[0, 1, 2, 3, 4, 5, 6, 7].map(k => `<line x1="${x}" y1="${y}" x2="${x + Math.cos(k * .785) * 44}" y2="${y + Math.sin(k * .785) * 44}"/>`).join('')}</g>`);
  // the small spherical opening in one wall, and the orb glowing in it
  if (hole || lit) h.add(h.tag('spherical opening', `<circle cx="100" cy="112" r="9" fill="#050404" stroke="#4a4a54" stroke-width="2"/>${lit ? `<circle cx="100" cy="112" r="8" fill="#ffd860"/><circle cx="97" cy="109" r="3" fill="#fff8d8"/>` : ''}`));
  if (lit) { h.glow(100, 112, 90, '#ffd860', .8); h.add(`<rect width="400" height="260" fill="#ffc840" opacity=".14"/>`); }
  // round, smooth white marble disc with the black lemniscate and nine sockets
  h.add(`<ellipse cx="200" cy="190" rx="170" ry="52" fill="#e8e6e0"/><ellipse cx="200" cy="190" rx="150" ry="44" fill="none" stroke="#9a968e" stroke-width="2"/>`);
  const ROD = n => /sacrifice/i.test(n) ? '#7a1a2a' : /fire/i.test(n) ? '#d8442a' : /\bice\b/i.test(n) ? '#bfe4f4' : /love/i.test(n) ? '#e87aa0' : /luck/i.test(n) ? '#4aa85a' : /bronze/i.test(n) ? '#b87a3a' : /stalking/i.test(n) ? '#6a8a3a' : /husbandry/i.test(n) ? '#8a6a3a' : /returning/i.test(n) ? '#c8ccd8' : /sacrifice/i.test(n) ? '#7a1a2a' : '#a8a090';
  // sockets behind the lemniscate first, so the rods in front overlap them
  const order = [...Array(9).keys()].sort((a, b) => Math.sin(a / 9 * Math.PI * 2) - Math.sin(b / 9 * Math.PI * 2));
  for (const i of order) {
    const a = i / 9 * Math.PI * 2, x = 200 + Math.cos(a) * 150, y = 190 + Math.sin(a) * 44;
    h.add(`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="8" ry="3.5" fill="#2a2824"/>`);
    if (i < nRods) h.add(h.tag('rod', `<rect x="${(x - 3).toFixed(1)}" y="${(y - 40).toFixed(1)}" width="6" height="40" rx="2" fill="${ROD(rods[i] || '')}" stroke="#1a1410" stroke-width=".8"/><ellipse cx="${x.toFixed(1)}" cy="${(y - 40).toFixed(1)}" rx="3" ry="1.4" fill="#fff" opacity=".35"/>`));
    if (i === 0) h.add(`<path d="M120,190 C120,166 196,166 200,190 C204,214 280,214 280,190 C280,166 204,166 200,190 C196,214 120,214 120,190Z" stroke="#111" stroke-width="7" fill="none"/>`);
  }
  // dead white insects
  if (!lit) for (let i = 0; i < 12; i++) h.add(`<ellipse cx="${h.R(20, 380)}" cy="${h.R(236, 256)}" rx="2" ry="1" fill="#f0f0f0" opacity=".7"/>`);
  // the crevice towards the iron doorway and the warmth of the house
  h.add(`<polygon points="380,90 400,80 400,170 386,160" fill="#3a2a1a"/>`);
  if (!lit) h.glow(396, 128, 50, '#ffb060', .4);
} };

B['The Octagon'] = { cat: 'interior', draw(h) {
  h.add(`<rect width="400" height="260" fill="#120f0c"/>`);
  // octagonal walls in perspective
  const walls = [[0, 30, 70, 50, 70, 200, 0, 240], [70, 50, 150, 60, 150, 196, 70, 200], [150, 60, 250, 60, 250, 196, 150, 196], [250, 60, 330, 50, 330, 200, 250, 196], [330, 50, 400, 30, 400, 240, 330, 200]];
  walls.forEach((p, i) => h.add(`<polygon points="${p.join(',')}" fill="${['#2a241c', '#3a3226', '#44392b', '#3a3226', '#2a241c'][i]}"/>`));
  h.add(`<polygon points="0,240 70,200 330,200 400,240 400,260 0,260" fill="#2a2018"/>`);
  // high windows on the north face, dim light
  for (let i = 0; i < 3; i++) h.add(`<rect x="${166 + i * 26}" y="68" width="14" height="30" fill="#8a9aa8" opacity=".6"/>`);
  h.add(`<polygon points="166,98 230,98 260,200 140,200" fill="#c8d0d8" opacity=".05"/>`);
  // dull exhibits in cases
  for (const x of [92, 290]) h.add(`<rect x="${x}" y="140" width="40" height="50" fill="#5a4a36" stroke="#2a2016"/><rect x="${x + 3}" y="120" width="34" height="22" fill="#8aa0a8" opacity=".25" stroke="#6a6a6a"/><path d="M${x + 12},140 l6,-12 l6,12z" fill="#8a7a5a"/>`);
  // the charcoal sketch, the gilded model coffin, the parchment scroll
  if (h.st.here('sketch')) h.add(h.tag('sketch', `<rect x="176" y="112" width="48" height="36" fill="#e8e0cc" stroke="#4a3a2a" stroke-width="2"/><path d="M182,142 q10,-20 18,-6 q8,-14 18,6" stroke="#2a2a2a" fill="none"/>`));
  if (h.st.here('coffin')) {
    const open = h.st.known ? h.st.open('coffin', false) : /coffin rests open/i.test(h.desc), power = !open && (/throbbing with electric power/i.test(h.desc) || !!(h.st.mentioned && h.st.mentioned('throbbing')));
    if (open) h.add(h.tag('coffin', `<path d="M170,228 L190,212 L232,212 L246,228 L232,244 L190,244Z" fill="#8a6010" stroke="#6a4a08" stroke-width="2"/><path d="M178,228 L194,216 L228,216 L238,228 L228,240 L194,240Z" fill="#2a1a08"/><path d="M190,212 L198,186 L240,186 L232,212Z" fill="#d8a830" stroke="#8a6010" stroke-width="2"/><path d="M212,192 v14 M206,198 h12" stroke="#8a6010" stroke-width="2"/>`));
    else h.add(h.tag('coffin', `<path d="M170,228 L190,212 L232,212 L246,228 L232,244 L190,244Z" fill="#d8a830" stroke="#8a6010" stroke-width="2"/><path d="M200,220 v16 M194,226 h12" stroke="#8a6010" stroke-width="2"/>`));
    if (open) h.contents('coffin', 196, 238, 16, 14, 3);
    if (power) { h.glow(208, 228, 46, '#a8d8ff', .6); h.add(`<path d="M172,222 l-10,-8 l6,-2 l-10,-10 M244,222 l10,-8 l-6,-2 l10,-10 M208,210 l-4,-12 l6,2 l-2,-12" stroke="#d8f0ff" stroke-width="1.6" fill="none"/>`); }
  }
  if (h.st.here('scroll')) h.add(h.tag('scroll', `<rect x="336" y="150" width="14" height="50" rx="5" fill="#f0e8d4" transform="rotate(8 343 175)"/><ellipse cx="346" cy="152" rx="9" ry="4" fill="#e8dcc0"/>`));
  // small window-vent high in the southwest wall
  h.add(`<rect x="20" y="70" width="26" height="12" fill="#3a3a3a" transform="skewY(-14)"/>`);
} };

// ---------- the gardens ----------
B['Garden Stream'] = { cat: 'garden', draw(h) {
  sky(h, '#8ab4d8', '#e4ece0');
  // the house rises high to the south (behind)
  h.add(`<rect x="210" y="0" width="190" height="150" fill="#a8988a"/>`); stones(h, 210, 0, 400, 150, '#6a5a4e', .35);
  for (let i = 0; i < 3; i++) h.add(`<rect x="${236 + i * 54}" y="30" width="26" height="40" fill="#3a4a5a"/><rect x="${236 + i * 54}" y="90" width="26" height="40" fill="#3a4a5a"/>`);
  // coal bunker with shut loading door on the house wall
  const bunkerOpen = h.st.known ? h.st.open('coal bunker', false) : /whose door stands open/i.test(h.desc);
  h.add(h.tag('coal bunker', `<rect x="250" y="134" width="70" height="36" fill="#3a3a3a"/><polygon points="246,134 324,134 316,124 254,124" fill="#4a4a4a"/>${bunkerOpen ? `<rect x="270" y="142" width="30" height="20" fill="#050505"/><polygon points="270,142 300,142 304,130 266,130" fill="#2a2a2a" stroke="#555"/>${[0, 1, 2].map(i => `<circle cx="${276 + i * 8}" cy="160" r="3" fill="#111"/>`).join('')}` : `<rect x="270" y="142" width="30" height="20" fill="#2a2a2a" stroke="#555"/>`}`));
  h.add(`<path d="M0,150 Q200,140 400,160 L400,260 L0,260Z" fill="#5a8a46"/>`);
  for (let i = 0; i < 4; i++) h.tree(h.R(10, 190), h.R(150, 160), h.R(34, 50), '#3a6a32');
  // the meandering stream with reeds
  h.add(`<path d="M0,214 Q90,190 180,214 T400,206 L400,228 Q300,236 190,240 T0,236Z" fill="#7aaac8"/><path d="M20,222 q30,-6 60,0 M220,226 q40,-6 70,0" stroke="#e8f4ff" stroke-width="1.2" fill="none" opacity=".6"/>`);
  // the skiff, moored on the stream
  if (h.st.known ? h.st.here('skiff') : /skiff/i.test(h.desc)) h.add(h.tag('skiff', `<path d="M60,218 L170,218 L156,232 L72,232Z" fill="#6a4a2a" stroke="#3a2614"/><line x1="112" y1="218" x2="112" y2="140" stroke="#4a3018" stroke-width="3"/><path d="M115,146 Q150,180 115,212Z" fill="#e8dcc0"/><path d="M60,220 l-20,-10" stroke="#8a7a5a" stroke-width="1.2"/>`));
  for (let i = 0; i < 40; i++) { const x = h.R(0, 400), y = h.R(196, 250); h.add(`<line x1="${x}" y1="${y}" x2="${x + h.R(-4, 4)}" y2="${y - h.R(12, 28)}" stroke="#2f5a26" stroke-width="1.6"/>`); if (h.r() < .25) h.add(`<ellipse cx="${x}" cy="${y - 26}" rx="2" ry="6" fill="#6a4a2a"/>`); }
} };

B['Family Tree'] = { cat: 'garden', draw(h) {
  sky(h, '#90b8d8', '#e8eee0');
  hedge(h, 0, 120, 160, 70, '#264c22'); hedge(h, 196, 120, 204, 70, '#264c22');
  h.add(`<rect x="160" y="132" width="36" height="58" fill="#14240f"/>`);
  h.add(`<path d="M0,186 Q200,176 400,190 L400,260 L0,260Z" fill="#6a9a4a"/>`);
  // great plane tree, its shade
  h.add(`<ellipse cx="110" cy="238" rx="120" ry="18" fill="#000" opacity=".2"/><path d="M96,240 Q100,170 88,120 L112,120 Q108,170 124,240Z" fill="#6a5a4a"/>`);
  for (let i = 0; i < 9; i++) h.add(`<circle cx="${110 + h.R(-80, 80)}" cy="${h.R(20, 110)}" r="${h.R(28, 44)}" fill="${['#3a6a32', '#2f5a28', '#4a7a3a'][i % 3]}"/>`);
  for (let i = 0; i < 20; i++) h.add(`<circle cx="${110 + h.R(-90, 90)}" cy="${h.R(10, 120)}" r="2.5" fill="#c8b070" opacity=".7"/>`);
  // signpost pointing east to the mosaic
  h.add(`<rect x="300" y="160" width="5" height="60" fill="#6a4a2a"/><polygon points="270,164 330,164 342,172 330,180 270,180" fill="#e8dcc0" stroke="#6a4a2a"/><path d="M280,172 h40" stroke="#4a3a2a" stroke-width="1.5"/>`);
  h.add(`<path d="M360,230 Q380,220 400,226 L400,240 Q380,236 360,240Z" fill="#7aaac8"/>`);
} };

B['Lawn Ornaments'] = { cat: 'garden', draw(h) {
  sky(h, '#90b8d8', '#e8eee0');
  hedge(h, 0, 110, 400, 70, '#284e24');
  h.add(`<path d="M0,170 Q200,162 400,172 L400,260 L0,260Z" fill="#6aa04a"/>`);
  for (let i = 0; i < 10; i++) h.add(`<line x1="0" y1="${178 + i * 9}" x2="400" y2="${180 + i * 9}" stroke="#7ab05a" stroke-width="3" opacity=".4"/>`);
  // gnomes
  for (const [x, y, s] of [[60, 236, 1], [118, 214, .8], [340, 230, 1.1]]) h.add(`<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="0" rx="12" ry="4" fill="#000" opacity=".2"/><rect x="-9" y="-22" width="18" height="22" rx="4" fill="#3a6ac8"/><circle cx="0" cy="-28" r="7" fill="#f0c8a0"/><path d="M-6,-24 q6,12 12,0z" fill="#fff"/><polygon points="-8,-32 8,-32 2,-52" fill="#d83a2a"/></g>`);
  // plaster nymph
  h.add(`<rect x="260" y="200" width="20" height="22" fill="#d8d4c8"/><path d="M262,200 q-2,-40 8,-46 q10,6 8,46z" fill="#ece8dc"/><circle cx="270" cy="148" r="7" fill="#ece8dc"/><path d="M276,160 q12,-14 6,-24" stroke="#ece8dc" stroke-width="4" fill="none"/>`);
  // stone windmills to grow flowers in
  for (const x of [170, 390]) h.add(`<polygon points="${x - 12},236 ${x + 12},236 ${x + 7},196 ${x - 7},196" fill="#a89c88"/><polygon points="${x - 9},196 ${x + 9},196 ${x},184" fill="#8a7e6a"/>${[0, 1, 2, 3].map(k => `<line x1="${x}" y1="196" x2="${x + Math.cos(k * 1.57 + .4) * 22}" y2="${196 + Math.sin(k * 1.57 + .4) * 22}" stroke="#7a6e5a" stroke-width="4"/>`).join('')}<circle cx="${x - 4}" cy="200" r="3" fill="#e84a6a"/><circle cx="${x + 4}" cy="202" r="3" fill="#f2c040"/>`);
  // the plaster statuette: a bust of a woman, prominent
  if (h.st.here('statuette')) h.add(h.tag('statuette', `<rect x="198" y="208" width="34" height="34" fill="#cfc8b8"/><rect x="194" y="204" width="42" height="6" fill="#dcd6c6"/><path d="M200,204 Q202,180 215,176 Q228,180 230,204Z" fill="#e8e2d4"/><ellipse cx="215" cy="164" rx="10" ry="12" fill="#ece6d8"/><path d="M205,160 Q215,146 225,160 Q226,150 215,148 Q204,150 205,160Z" fill="#dcd4c4"/>`));
  // after the roller: plaster dust where the statuette stood, and the ancient well; the orb beside it; the roller parked
  const dl = (h.desc || '').toLowerCase();
  if (/broken plaster|ancient well/.test(dl) || (h.st.known && !h.st.here('statuette') && h.st.here('ancient well'))) {
    for (let k = 0; k < 40; k++) h.add(`<circle cx="${h.R(150, 280).toFixed(1)}" cy="${h.R(205, 250).toFixed(1)}" r="${h.R(1, 3).toFixed(1)}" fill="#e8e4d8" opacity=".8"/>`);
    h.add(h.tag('ancient well', `<ellipse cx="215" cy="232" rx="34" ry="11" fill="#5a5650"/><ellipse cx="215" cy="230" rx="26" ry="7" fill="#050403"/><path d="M181,232 v-10 a34,11 0 0 1 68,0 v10" fill="none" stroke="#6a665e" stroke-width="3"/>`));
  }
  if (h.st.here('golden orb') && /golden orb/.test(dl)) h.add(h.tag('golden orb', `<circle cx="262" cy="232" r="9" fill="#e8c040"/><circle cx="262" cy="232" r="20" fill="#ffe08a" opacity=".3"/><circle cx="259" cy="229" r="3" fill="#fff4c0"/>`));
  if (/garden roller is parked|motorised garden roller/.test(dl) && h.st.here('roller')) h.add(h.tag('garden roller', `<g transform="translate(96 218)"><rect x="-44" y="-6" width="88" height="34" rx="16" fill="#4a5a3a" stroke="#2a3220" stroke-width="2"/><rect x="-30" y="-34" width="56" height="30" rx="4" fill="#6a7a4a" stroke="#2a3220" stroke-width="2"/><rect x="-22" y="-52" width="18" height="18" fill="#2a2a2a"/><path d="M-40,8 h80 M-40,18 h80" stroke="#2a3220" opacity=".5"/></g>`));
} };

B['Mosaic'] = { cat: 'classical', draw(h) {
  sky(h, '#90b8d8', '#e8eee0');
  h.add(`<rect y="70" width="400" height="190" fill="#6a9a4a"/>`);
  // sunken excavation covered by perspex
  h.add(`<polygon points="60,100 340,100 390,250 10,250" fill="#8a7a60"/><polygon points="76,110 324,110 368,240 32,240" fill="#e8dcc0"/>`);
  const quad = (x0, y0, x1, y1, c) => h.add(`<polygon points="${x0},${y0} ${x1},${y0} ${x1 + (x1 - 200) * .18},${y1} ${x0 + (x0 - 200) * .18},${y1}" fill="${c}"/>`);
  quad(86, 118, 196, 172, '#c87a48'); quad(204, 118, 314, 172, '#5a8aa8'); quad(78, 178, 196, 232, '#a8a04a'); quad(204, 178, 322, 232, '#8a4a5a');
  for (let i = 0; i < 420; i++) { const x = h.R(40, 360), y = h.R(112, 238); h.add(`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="3" height="3" fill="#fff" opacity="${h.R(.05, .2).toFixed(2)}"/>`); }
  // idealised Roman scenes as simple figures
  figure(h, 140, 166, .7, '#4a2a1a'); h.add(`<path d="M240,160 q20,-14 40,0 q-20,8 -40,0z" fill="#2a3a4a"/>`); figure(h, 130, 226, .7, '#4a4a1a'); h.add(`<path d="M246,226 q8,-26 16,0 M266,226 q8,-26 16,0" stroke="#4a1a2a" stroke-width="5" fill="none"/>`);
  h.add(`<rect x="200" y="112" width="4" height="128" fill="#4a3a2a"/><rect x="36" y="172" width="330" height="4" fill="#4a3a2a"/>`);
  // perspex sheen
  h.add(`<polygon points="76,110 324,110 368,240 32,240" fill="#e0f0ff" opacity=".16"/><path d="M110,120 L70,230 M150,120 L118,230" stroke="#fff" opacity=".35" stroke-width="5"/>`);
  // hard wooden ball, palm-sized
  if (h.st.here('wooden ball')) h.add(h.tag('wooden ball', `<circle cx="270" cy="206" r="9" fill="#8a5a2a"/><circle cx="267" cy="203" r="3" fill="#b88a4a"/>`));
} };

B['Garage'] = { cat: 'interior', draw(h) {
  room(h, ['#8a5a44', '#6a4232'], ['#5a5650', '#3a3834']);
  stones(h, 60, 50, 340, 200, '#3a2218', .45);
  // big open doorway east onto the clearing
  h.add(`<polygon points="352,60 400,40 400,250 352,206" fill="#9ac080"/><polygon points="352,60 400,40 400,60 352,72" fill="#6a4232"/>`);
  // big motorised garden roller
  if (h.st.here('roller')) h.add(h.tag('roller', `<rect x="100" y="176" width="150" height="50" rx="25" fill="#4a5a4a" stroke="#1a221a" stroke-width="3"/><rect x="96" y="196" width="158" height="8" fill="#2a322a"/><rect x="170" y="130" width="60" height="48" fill="#a8302a"/><rect x="176" y="120" width="40" height="12" fill="#3a3a3a"/><path d="M230,140 L290,96" stroke="#3a3a3a" stroke-width="5"/><rect x="282" y="86" width="30" height="8" rx="3" fill="#222"/>`));
  // weed killer bottle in the shadows
  if (h.st.here('weed killer')) h.add(h.tag('weed killer', `<rect x="300" y="196" width="20" height="30" rx="3" fill="#3a6a3a" opacity=".85"/><rect x="305" y="188" width="10" height="9" fill="#d8d8d8"/><path d="M303,206 h14 M310,202 l-4,10 h8z" stroke="#e8e8e8" stroke-width="1" fill="none"/>`));
  h.add(`<rect x="290" y="180" width="50" height="50" fill="#000" opacity=".35"/>`);
  // the bladed agricultural implement on its hook: a spade
  h.add(`<circle cx="90" cy="64" r="3" fill="#333"/>`);
  if (h.st.here('spade')) h.add(h.tag('spade', `<line x1="90" y1="66" x2="90" y2="140" stroke="#7a5430" stroke-width="4"/><rect x="82" y="64" width="16" height="5" rx="2" fill="#5a3a20"/><path d="M80,140 h20 l-2,30 q-8,6 -16,0z" fill="#9aa0a8" stroke="#5a5a60"/>`));
} };

B['Vegetable Garden'] = { cat: 'garden', draw(h) {
  sky(h, '#90b0c8', '#dce4d8');
  h.add(`<rect y="0" width="400" height="120" fill="#000" opacity=".1"/>`);
  hedge(h, 0, 90, 400, 60, '#244420');
  h.add(`<rect y="140" width="400" height="120" fill="#5a3e26"/>`);
  // recently turned rows, good intentions
  for (let i = 0; i < 6; i++) h.add(`<path d="M0,${156 + i * 18} Q200,${150 + i * 18} 400,${158 + i * 18}" stroke="#3e2a18" stroke-width="7" fill="none"/>`);
  for (let i = 0; i < 9; i++) h.add(`<path d="M${h.R(20, 380)},${h.R(160, 250)} q3,-8 6,0" stroke="#4a7a3a" stroke-width="2" fill="none"/>`);
  // the runner-bean plant: on its canes, grown into a giant beanstalk, or gone after the weed killer
  const d = (h.desc || '').toLowerCase();
  const giant = /giant runner-bean plant|enormous beanstalk/.test(d) || !!(h.st.known && h.st.mentioned && h.st.mentioned('enormous beanstalk')), gone = d.length > 40 && !/runner-bean|beanstalk/.test(d);
  if (giant) {
    h.add(h.tag('runner-bean plant', `<path d="M196,250 C150,200 250,160 200,110 C160,70 240,40 205,0" stroke="#2e6a2a" stroke-width="22" fill="none"/><path d="M196,250 C150,200 250,160 200,110 C160,70 240,40 205,0" stroke="#4a8a3a" stroke-width="8" fill="none" opacity=".6"/>${Array.from({ length: 18 }, (_, i) => { const y = 240 - i * 14, x = 200 + Math.sin(y / 34) * 30; return `<ellipse cx="${(x + (i % 2 ? 24 : -24)).toFixed(1)}" cy="${y}" rx="18" ry="8" fill="#3e7a3a" transform="rotate(${i % 2 ? 30 : -30} ${x.toFixed(1)} ${y})"/>`; }).join('')}`));
    h.add(`<ellipse cx="205" cy="6" rx="90" ry="16" fill="#fff" opacity=".7"/>`);
  } else if (!gone) {
    h.add(h.open('runner-bean plant'));
  h.add(`<line x1="186" y1="230" x2="200" y2="70" stroke="#a88a5a" stroke-width="3"/><line x1="214" y1="230" x2="200" y2="70" stroke="#a88a5a" stroke-width="3"/>`);
  for (let i = 0; i < 16; i++) { const y = 220 - i * 9.5, x = 200 + Math.sin(i * .9) * (14 - i * .6); h.add(`<ellipse cx="${x + 8}" cy="${y}" rx="7" ry="4" fill="#3e7a3a" transform="rotate(${i % 2 ? 30 : -30} ${x} ${y})"/>`); if (i % 4 === 1) h.add(`<circle cx="${x - 6}" cy="${y + 2}" r="3" fill="#d83a2a"/>`); }
  h.add(`<path d="M200,226 C190,190 214,170 196,140 C184,116 210,96 200,72" stroke="#2e6a2a" stroke-width="2" fill="none"/>`);
    h.add('</g>');
  }
} };

B['Summer House'] = { cat: 'garden', draw(h) {
  h.add(`<rect width="400" height="260" fill="#6a4a2c"/>`);
  // tall glass many-sided pyramidal roof, some panes missing or cracked
  h.add(`<polygon points="200,0 0,120 400,120" fill="#bcd8ec"/>`);
  for (let i = 0; i <= 8; i++) h.add(`<line x1="200" y1="0" x2="${i * 50}" y2="120" stroke="#5a3e24" stroke-width="3"/>`);
  for (let i = 1; i < 4; i++) { const y = i * 30; h.add(`<line x1="${200 - (200 * y / 120)}" y1="${y}" x2="${200 + (200 * y / 120)}" y2="${y}" stroke="#5a3e24" stroke-width="2"/>`); }
  h.add(`<polygon points="250,60 300,90 262,90" fill="#6a4a2c"/><polygon points="100,90 150,90 140,60" fill="#6a4a2c"/><path d="M230,40 l10,12 l-6,10 l12,8" stroke="#fff" stroke-width="1" fill="none" opacity=".8"/>`);
  // walls of varnished wooden planks
  h.add(`<rect y="120" width="400" height="140" fill="${h.lin('wd', [[0, '#9a6a3a'], [1, '#6a4422']])}"/>`);
  for (let x = 0; x < 400; x += 20) h.add(`<line x1="${x}" y1="120" x2="${x}" y2="260" stroke="#4a2e16" opacity=".5"/>`);
  h.add(`<rect y="120" width="400" height="6" fill="#4a2e16"/>`);
  // something golden hanging by a chain from a loose pane; once the sparrows have knocked it loose, it lies on the floor
  if (h.st.here('gold watch') && h.st.moved('gold watch')) h.add(h.tag('gold watch', `<path d="M150,244 q10,-6 20,2 q6,6 -4,8" stroke="#c8a040" stroke-width="1.5" fill="none"/><ellipse cx="160" cy="246" rx="9" ry="4" fill="#e8c040" stroke="#a88010"/>`));
  else if (h.st.here('gold watch')) {
  h.add(`<path d="M160,74 ${Array.from({ length: 8 }, (_, i) => `l${i % 2 ? 2 : -2},6`).join(' ')}" stroke="#c8a040" stroke-width="1.5" fill="none"/>`);
  h.glow(160, 128, 30, '#ffd86a', .7); h.add(`<circle cx="160" cy="128" r="8" fill="#e8c040" stroke="#a88010"/>`);
  }
  // croquet mallet standing by one wall
  if (h.st.here('mallet')) h.add(h.tag('mallet', `<rect x="320" y="150" width="5" height="90" fill="#c8a070"/><rect x="306" y="236" width="34" height="14" rx="3" fill="#7a3a2a"/><rect x="309" y="236" width="4" height="14" fill="#e8d050"/><rect x="333" y="236" width="4" height="14" fill="#e8d050"/>`));
  // the sparrows: chirping around the high gutter, or startled and circling high in the sky above the glass roof
  const calm = /sparrows chirp happily/i.test(h.desc), startled = /startled sparrows circle|take to the skies/i.test(h.desc);
  if (startled) h.add(h.tag('sparrows', Array.from({ length: 11 }, () => { const x = h.R(110, 290), y = h.R(8, 70), w = h.R(3, 6); return `<path d="M${x - w},${y - w * .5} q${w * .5},${w * .5} ${w},${w * .5} q${w * .5},0 ${w},${-w * .5}" stroke="#3a2a1e" stroke-width="1.6" fill="none"/>`; }).join('')));
  else if (calm) h.add(h.tag('sparrows', Array.from({ length: 6 }, () => { const x = h.R(20, 380), y = h.R(108, 118); return `<ellipse cx="${x}" cy="${y}" rx="5" ry="3.5" fill="#7a5a3a"/><circle cx="${x + 4}" cy="${y - 3}" r="2.4" fill="#6a4a2a"/><path d="M${x + 6},${y - 3} l3,1 -3,1z" fill="#c8a040"/>`; }).join('')));
  h.glow(200, 60, 200, '#ffffff', .25);
} };

B['Croquet Lawn'] = { cat: 'garden', draw(h) {
  sky(h, '#8ab4d8', '#eaf0e4');
  for (let i = 0; i < 7; i++) h.tree(h.R(0, 400), h.R(110, 125), h.R(40, 60), '#2e5a2a');
  hedge(h, 0, 112, 400, 36, '#244a20');
  // regulation lawn with stripes
  h.add(`<polygon points="40,150 360,150 400,260 0,260" fill="#5aa040"/>`);
  for (let i = 0; i < 8; i++) h.add(`<polygon points="${40 + i * 40},150 ${60 + i * 40},150 ${i * 50 + 25},260 ${i * 50},260" fill="#6ab04a" opacity=".5"/>`);
  // central coloured peg and six hoops
  h.add(`<rect x="198" y="176" width="4" height="26" fill="#fff"/>${['#3a6ac8', '#d83a2a', '#1a1a1a', '#e8d040'].map((c, i) => `<rect x="198" y="${177 + i * 5}" width="4" height="4" fill="${c}"/>`).join('')}`);
  const hoops = [[110, 168, .7], [290, 168, .7], [150, 192, .85], [250, 192, .85], [90, 230, 1.1], [310, 230, 1.1]];
  for (const [x, y, s] of hoops) h.add(`<path d="M${x - 8 * s},${y} v${-14 * s} a${8 * s},${6 * s} 0 0 1 ${16 * s},0 v${14 * s}" stroke="#f4f4f4" stroke-width="${2 * s}" fill="none"/>`);
  h.add(`<circle cx="170" cy="214" r="5" fill="#3a6ac8"/><circle cx="236" cy="238" r="6" fill="#d83a2a"/>`);
  // a gap in the hedge to the northwest, once the mallet has broken it
  if (/hedge is broken slightly|tiny gap through the hedge/i.test(h.desc)) h.add(h.tag('hedge', `<path d="M40,148 L46,118 Q60,108 74,118 L80,148Z" fill="#3a5a2a"/><path d="M50,148 L54,124 Q60,118 68,124 L70,148Z" fill="#8ab4d8" opacity=".55"/><path d="M44,120 l-6,-6 M78,118 l6,-8 M60,112 v-8" stroke="#244a20" stroke-width="2"/>`));
  // the hole you dug
  if (h.st.known ? h.st.here('dug hole') && h.st.open('dug hole', false) : /hole you dug in the lawn is just here/i.test(h.desc)) h.add(h.tag('hole', `<ellipse cx="200" cy="244" rx="28" ry="8" fill="#2a1a0c"/><ellipse cx="200" cy="244" rx="22" ry="5" fill="#0a0604"/><path d="M168,248 q10,-8 22,-4 M212,240 q14,-2 22,6" stroke="#6a4a2a" stroke-width="5" fill="none"/>`));
} };

B['Folly'] = { cat: 'garden', draw(h) {
  sky(h, '#8ab0d0', '#ece6d0');
  // the valley below: cottages around a church, fields, a hay wain on the river
  h.ridge(120, 10, '#8aa080', 6);
  h.add(`<rect y="130" width="400" height="130" fill="#9ab070"/>`);
  for (let i = 0; i < 5; i++) h.add(`<rect x="${i * 80}" y="${136 + (i % 2) * 6}" width="78" height="20" fill="${['#b8b060', '#a8b868', '#c8c070'][i % 3]}" opacity=".7"/>`);
  h.add(`<path d="M0,170 Q120,160 220,172 T400,166" stroke="#7aa8c0" stroke-width="7" fill="none"/>`);
  h.add(`<rect x="70" y="140" width="10" height="16" fill="#8a8478"/><polygon points="68,140 82,140 75,124" fill="#6a6458"/>`);
  for (let i = 0; i < 6; i++) h.add(`<rect x="${40 + i * 12}" y="${150 + (i % 2) * 4}" width="9" height="7" fill="#e8dcc0"/><polygon points="${39 + i * 12},${150 + (i % 2) * 4} ${49 + i * 12},${150 + (i % 2) * 4} ${44 + i * 12},${144 + (i % 2) * 4}" fill="#8a6a3a"/>`);
  h.add(`<rect x="200" y="162" width="18" height="8" fill="#c8a040"/><circle cx="203" cy="171" r="3" fill="#4a3a2a"/><circle cx="214" cy="171" r="3" fill="#4a3a2a"/>`);
  for (let i = 0; i < 4; i++) figure(h, 260 + i * 22, 158, .22, '#4a3a2a');
  // the hillside ledge
  h.add(`<path d="M0,210 Q200,196 400,214 L400,260 L0,260Z" fill="#6a7a4a"/>`);
  // the monstrous, purposeless freestanding tower
  h.add(`<polygon points="290,214 350,214 344,40 296,40" fill="#a89a84"/>`); stones(h, 296, 40, 344, 214, '#5a4e40', .5);
  h.add(`<rect x="290" y="28" width="60" height="14" fill="#9a8c76"/>${[0, 1, 2, 3].map(i => `<rect x="${290 + i * 16}" y="18" width="10" height="12" fill="#9a8c76"/>`).join('')}<path d="M310,90 l8,30 l-6,20" stroke="#3a3028" stroke-width="1.4" fill="none"/>`);
  // bean pole against the tower
  if (h.st.here('bean pole')) h.add(h.tag('bean pole', `<line x1="282" y1="214" x2="304" y2="80" stroke="#b8945a" stroke-width="3"/>`));
} };

// ---------- unreal city & museum ----------
B['Unreal City'] = { cat: 'city', draw(h) {
  sky(h, '#5a5a5e', '#8a8a8a');
  for (let i = 0; i < 7; i++) { const x = i * 60 - 10, ht = h.R(120, 190); h.add(`<rect x="${x}" y="${200 - ht}" width="58" height="${ht}" fill="${['#3a3a3e', '#444448', '#36363a'][i % 3]}"/>`); for (let y = 210 - ht; y < 190; y += 18) for (let wx = x + 8; wx < x + 50; wx += 14) h.add(`<rect x="${wx}" y="${y}" width="7" height="10" fill="#6a6a6e"/>`); }
  // grubby tenement doorway to the north
  h.add(`<rect x="170" y="140" width="40" height="60" fill="#1a1a1c"/><rect x="166" y="136" width="48" height="6" fill="#2a2a2c"/>`);
  h.add(`<rect y="200" width="400" height="60" fill="#4a4a4c"/>`);
  // the crowd streaming by, as if dead
  for (let i = 0; i < 16; i++) figure(h, h.R(0, 400), h.R(222, 256), h.R(.55, .8), `rgba(${h.RI(40, 70)},${h.RI(40, 70)},${h.RI(46, 76)},${h.R(.55, .9).toFixed(2)})`);
  h.add(`<rect width="400" height="260" fill="#9a9aa0" opacity=".18"/>`);
} };

B['Consulting Room'] = { cat: 'otherworld', draw(h) {
  room(h, ['#4a2e3a', '#2e1a24'], ['#3a2418', '#201410'], '#1a0e12');
  // screened windows
  h.add(`<rect x="90" y="70" width="50" height="60" fill="#3a2a30"/>${Array.from({ length: 7 }, (_, i) => `<line x1="${92 + i * 7}" y1="70" x2="${92 + i * 7}" y2="130" stroke="#1a0e12" stroke-width="2"/>`).join('')}`);
  // bead curtain doorway
  h.add(`<rect x="270" y="90" width="44" height="110" fill="#0a0608"/>${Array.from({ length: 8 }, (_, i) => Array.from({ length: 16 }, (_, k) => `<circle cx="${273 + i * 5.5}" cy="${94 + k * 6.6}" r="1.5" fill="${['#c83a5a', '#e8c040', '#3a8ac8'][(i + k) % 3]}"/>`).join('')).join('')}`);
  // seven-branched candelabra
  for (const cx of [60, 340]) { h.add(`<rect x="${cx - 2}" y="120" width="4" height="70" fill="#a88a3a"/><rect x="${cx - 12}" y="186" width="24" height="5" fill="#a88a3a"/>`); for (let k = -3; k <= 3; k++) { const x = cx + k * 7, y = 116 - (3 - Math.abs(k)) * 4; h.add(`<path d="M${cx},${136} Q${x},${136} ${x},${y + 6}" stroke="#a88a3a" stroke-width="2" fill="none"/><rect x="${x - 1.5}" y="${y - 4}" width="3" height="10" fill="#efe6cc"/>`); lamp(h, x, y - 7); } }
  // incense smoke
  for (let i = 0; i < 4; i++) h.add(`<path d="M${200 + i * 12},170 q-10,-30 6,-60 q14,-30 -2,-70" stroke="#d8d0e0" stroke-width="1.5" fill="none" opacity=".25"/>`);
  // the table with the electric bell push and the Tarot pack
  h.add(`<ellipse cx="200" cy="204" rx="80" ry="16" fill="#4a1a24"/><rect x="122" y="204" width="156" height="30" fill="#3a1218"/><path d="M122,234 q78,14 156,0" fill="#3a1218"/>`);
  if (h.st.here('tarot')) h.add(h.tag('tarot', `<rect x="180" y="192" width="22" height="14" rx="2" fill="#e8d8b0" stroke="#8a6a30" transform="rotate(-8 190 199)"/><rect x="183" y="190" width="22" height="14" rx="2" fill="#f0e4c0" stroke="#8a6a30" transform="rotate(-8 194 197)"/><circle cx="234" cy="200" r="6" fill="#d8d0c0"/><circle cx="234" cy="199" r="3" fill="#c83a2a"/>`));
} };

B['Museum Foyer'] = { cat: 'city', draw(h) {
  room(h, ['#2e3038', '#1c1e24'], ['#3a3632', '#1e1c1a'], '#121318');
  // tall windows with rain and sodium streetlight
  for (let i = 0; i < 3; i++) { const x = 90 + i * 80; h.add(`<rect x="${x}" y="64" width="50" height="110" fill="#2a2418"/>`); h.glow(x + 25, 140, 40, '#ff9a3a', .35); for (let k = 0; k < 14; k++) { const rx = x + h.R(2, 48), ry = h.R(66, 160); h.add(`<line x1="${rx}" y1="${ry}" x2="${rx - 2}" y2="${ry + 10}" stroke="#a8b8c8" stroke-width=".8" opacity=".6"/>`); } h.add(`<rect x="${x}" y="64" width="50" height="110" fill="none" stroke="#14151a" stroke-width="4"/><line x1="${x + 25}" y1="64" x2="${x + 25}" y2="174" stroke="#14151a" stroke-width="2"/>`); }
  // the revolving door to the northeast, blocked
  h.add(`<rect x="300" y="80" width="40" height="120" fill="#4a4030"/><line x1="320" y1="80" x2="320" y2="200" stroke="#c8a860" stroke-width="2"/><path d="M300,140 L340,140 M306,100 L334,180" stroke="#c8a860" stroke-width="1.5" opacity=".7"/><rect x="300" y="80" width="40" height="120" fill="none" stroke="#c8a860" stroke-width="2"/>`);
  // shadows swooping like bats
  for (let i = 0; i < 6; i++) { const x = h.R(60, 340), y = h.R(20, 60); h.add(`<path d="M${x},${y} q6,-6 12,0 q6,-6 12,0 q-6,2 -12,6 q-6,-4 -12,-6z" fill="#000" opacity=".55"/>`); }
  // the metal corridor south and a publicity poster
  h.add(`<polygon points="160,260 240,260 222,206 178,206" fill="#5a6068"/><polygon points="178,206 222,206 214,190 186,190" fill="#0a0a0c"/>`);
  if (h.st.here('poster')) h.add(h.tag('poster', `<rect x="34" y="96" width="22" height="34" fill="#c8402a" transform="skewY(14)"/>`));  // the beach ball, if you have bounced it in here from the revolving door
  if (h.st.here('beach ball')) {   // it only gets here by being bounced along with you
    const I = (typeof window !== 'undefined' && window.ZIcons) || (typeof require === 'function' ? require('./icons.js') : null);
    if (I) h.add(h.tag('beach ball', `<ellipse cx="270" cy="232" rx="18" ry="4" fill="#000" opacity=".35"/><g transform="translate(250 196) scale(1)">${I.icon('beach ball').replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')}</g>`));
  }
} };

// ---------- myth & time travel ----------
B['Sea Shore'] = { cat: 'water', draw(h) {
  sky(h, '#f0b080', '#fde8c8', '#a8c8e0');
  h.add(`<circle cx="300" cy="118" r="18" fill="#fff4d8"/>`); h.glow(300, 118, 90, '#ffd8a0', .5);
  seaBand(h, 124, '#3a7ab8', '#1a3a6a');
  h.add(`<rect x="290" y="124" width="22" height="136" fill="${h.lin('rf', [[0, '#fff0c8', .7], [1, '#fff0c8', 0]])}"/>`);
  // barely-climbable cliffs on the left
  h.add(`<path d="M0,0 L130,0 Q110,70 150,120 Q120,190 170,260 L0,260Z" fill="#8a6a4a"/><path d="M0,0 L80,0 Q70,90 100,160 Q80,210 110,260 L0,260Z" fill="#6a4e36"/>`);
  for (let i = 0; i < 10; i++) h.add(`<line x1="${h.R(10, 140)}" y1="${h.R(10, 250)}" x2="${h.R(10, 140)}" y2="${h.R(10, 250)}" stroke="#4a3624" stroke-width="1.5" opacity=".6"/>`);
  // rough rocky shore
  h.add(`<path d="M120,260 Q200,226 260,240 Q320,250 400,236 L400,260Z" fill="#7a6a5a"/>`);
  for (let i = 0; i < 9; i++) h.add(`<ellipse cx="${h.R(140, 390)}" cy="${h.R(240, 256)}" rx="${h.R(8, 20)}" ry="${h.R(4, 8)}" fill="#5a4e42"/>`);
  // Andromeda herself is drawn by the character layer (people.js)
} };

B['Lighthouse'] = { cat: 'water', draw(h) {
  sky(h, '#3a7ac8', '#a8d0f0', '#f8e0b0');
  h.add(`<circle cx="70" cy="170" r="20" fill="#fff4d0"/>`); h.glow(70, 170, 100, '#ffe0a0', .45);
  seaBand(h, 176, '#2a6aa8', '#14345a');
  h.add(`<path d="M330,174 l18,0 l-4,4 h-10z" fill="#4a4a5a" opacity=".6"/>`);
  // pinnacle top with marvellous device of polished bronze mirrors
  h.add(`<polygon points="40,260 360,260 330,214 70,214" fill="#c8b89a"/>`); stones(h, 70, 214, 330, 260, '#8a7a60', .4);
  h.add(`<rect x="180" y="150" width="40" height="64" fill="#8a6a3a"/><path d="M150,110 Q200,180 250,110 Q240,150 200,160 Q160,150 150,110Z" fill="${h.lin('br', [[0, '#f0c870'], [1, '#8a5a20']], 1, 0)}" stroke="#6a4010" stroke-width="2"/>`);
  for (let i = 0; i < 5; i++) h.add(`<path d="M${160 + i * 20},${116 + Math.abs(i - 2) * 4} l6,22" stroke="#fff4c8" stroke-width="2" opacity=".7"/>`);
  h.add(`<polygon points="150,120 250,120 400,60 400,180" fill="#fff8d0" opacity=".08"/>`);
  // spiral staircase down
  h.add(`<ellipse cx="300" cy="236" rx="24" ry="9" fill="#2a2016"/>${[0, 1, 2].map(i => `<path d="M${282 + i * 6},236 a${18 - i * 4},${6 - i} 0 0 1 ${36 - i * 12},0" stroke="#8a7a60" stroke-width="2" fill="none"/>`).join('')}`);
} };

B['Temple of Zeus'] = { cat: 'classical', draw(h) {
  h.add(`<rect width="400" height="260" fill="#1a1612"/>`);
  // a cavern of marble pillars, candle-lit
  for (let row = 0; row < 3; row++) { const s = 1 - row * .25, top = 40 + row * 30, bot = 230 - row * 26; columns(h, 40 + row * 50, 360 - row * 50, 6 - row, top, bot, ['#e8dcc4', '#c8bca4', '#a89c84'][row]); }
  h.add(`<rect width="400" height="30" fill="#2a241c"/><rect y="230" width="400" height="30" fill="#3a3228"/>`);
  for (let i = 0; i < 8; i++) { const x = 30 + i * 48, y = h.R(196, 214); h.add(`<rect x="${x - 2}" y="${y}" width="4" height="12" fill="#efe6cc"/>`); lamp(h, x, y - 4, '#ffc060'); }
  // the north entrance, Zeus howling outside
  h.add(`<rect x="182" y="110" width="36" height="96" fill="#5a6a8a"/><path d="M190,130 l10,20 l-6,4 l10,18" stroke="#fff8c0" stroke-width="2" fill="none"/>`);
  // one copper coin
  if (h.st.here('copper coin')) h.add(h.tag('copper coin', `<ellipse cx="220" cy="244" rx="7" ry="3" fill="#c87a3a"/><ellipse cx="220" cy="243" rx="4" ry="1.6" fill="#e8a060"/>`));
} };

B['Aboard Ship'] = { cat: 'water', draw(h) {
  sky(h, '#d8a0b8', '#f0c8d0', '#c8d0d8');
  for (let i = 0; i < 8; i++) h.add(`<ellipse cx="${h.R(0, 400)}" cy="${h.R(40, 200)}" rx="${h.R(60, 140)}" ry="${h.R(10, 22)}" fill="#f4f0f4" opacity="${h.R(.2, .45)}"/>`);
  // a tilted deck, storm with no rain
  h.add(`<g transform="rotate(-8 200 200)"><polygon points="-40,190 440,190 420,280 -20,280" fill="#7a5a3a"/>${Array.from({ length: 12 }, (_, i) => `<line x1="${-40 + i * 42}" y1="190" x2="${-20 + i * 40}" y2="280" stroke="#5a3e24"/>`).join('')}<rect x="-40" y="176" width="480" height="6" fill="#4a3018"/>${Array.from({ length: 16 }, (_, i) => `<rect x="${-36 + i * 30}" y="182" width="4" height="10" fill="#4a3018"/>`).join('')}`);
  // the mast rising dizzyingly high, with rigging
  h.add(`<rect x="190" y="-80" width="12" height="270" fill="#5a3e24"/><line x1="196" y1="-60" x2="20" y2="186" stroke="#3a2a1a"/><line x1="196" y1="-60" x2="380" y2="186" stroke="#3a2a1a"/>${Array.from({ length: 6 }, (_, i) => `<line x1="${40 + i * 12}" y1="${160 - i * 30}" x2="${150 + i * 8}" y2="${160 - i * 30}" stroke="#3a2a1a" opacity=".6"/>`).join('')}</g>`);
  if (h.st.known ? h.st.here('spar') : /broken flagpole/i.test(h.desc)) h.add(h.tag('flagpole', `<g transform="rotate(-8 200 200)"><rect x="220" y="196" width="130" height="7" rx="2" fill="#a07a4a" stroke="#5a3e24" transform="rotate(4 220 196)"/><path d="M350,200 l6,-4 l-2,6 l6,2z" fill="#a07a4a"/></g>`));
  if (h.st.known ? h.st.here('flag') : /flag has fluttered to a heap/i.test(h.desc)) h.add(h.tag('flag', `<path d="M120,228 q10,-16 30,-12 q14,-10 30,4 q6,14 -12,16 q-24,6 -48,-8z" fill="#c82a2a"/><path d="M128,222 q10,-8 22,-6 l4,10 q-14,4 -26,-4z" fill="#1a3a8a"/><path d="M130,220 l20,8 M150,216 l-18,10" stroke="#fff" stroke-width="2"/>`));
  h.add(`<rect width="400" height="260" fill="#ffffff" opacity=".12"/>`);
} };

B['Up the Mast'] = { cat: 'otherworld', draw(h) {
  sky(h, '#e8a8c0', '#f8d0d8');
  // two pale, bluish moons
  moonAt(h, 110, 70, 18, '#c8dcf0'); moonAt(h, 170, 46, 11, '#b8d0ec');
  for (let i = 0; i < 10; i++) h.add(`<ellipse cx="${h.R(0, 400)}" cy="${h.R(60, 260)}" rx="${h.R(60, 160)}" ry="${h.R(12, 30)}" fill="#fff" opacity="${h.R(.2, .45)}"/>`);
  // top of the mast with the flagpole jutting portwards and the ensign hanging
  h.add(`<rect x="250" y="60" width="14" height="200" fill="#5a3e24"/><rect x="244" y="96" width="26" height="8" fill="#4a3018"/><line x1="257" y1="70" x2="110" y2="150" stroke="#6a4a2a" stroke-width="3"/>`);
  if (h.st.here('flag')) h.add(h.tag('flag', `<g transform="translate(150 128) rotate(28)"><rect x="0" y="0" width="70" height="40" fill="#c8202a"/><rect x="0" y="0" width="30" height="18" fill="#1a2a6a"/><path d="M0,0 L30,18 M30,0 L0,18" stroke="#fff" stroke-width="3"/><path d="M15,0 V18 M0,9 H30" stroke="#fff" stroke-width="4"/><path d="M15,0 V18 M0,9 H30" stroke="#c8202a" stroke-width="2"/></g>`));
} };

// ---------- alexandria ----------
B['Island of Pharos'] = { cat: 'water', draw(h) {
  sky(h, '#0a1230', '#2a3a6a');
  h.stars(90, 160); moonAt(h, 70, 50, 14);
  seaBand(h, 200, '#1a2a4a', '#0a1428');
  // the great lighthouse: a circle on an octagon on a square, blazing
  const cx = 230;
  h.add(`<rect x="${cx - 46}" y="96" width="92" height="110" fill="#c8b894"/><rect x="${cx - 52}" y="92" width="104" height="8" fill="#d8c8a4"/>`);
  h.add(`<polygon points="${cx - 30},92 ${cx + 30},92 ${cx + 26},40 ${cx - 26},40" fill="#d0c09c"/><rect x="${cx - 32}" y="36" width="64" height="6" fill="#d8c8a4"/>`);
  h.add(`<rect x="${cx - 14}" y="10" width="28" height="28" fill="#d8c8a8"/>`);
  for (let i = 0; i < 4; i++) for (let k = 0; k < 3; k++) h.add(`<rect x="${cx - 36 + i * 20}" y="${110 + k * 28}" width="7" height="12" fill="#ffd27a" opacity=".7"/>`);
  h.glow(cx, 12, 110, '#ffd070', .8); h.add(`<circle cx="${cx}" cy="12" r="10" fill="#fff4c0"/>`);
  // coastal defences with the rusty iron grating
  h.add(`<rect y="200" width="400" height="16" fill="#6a6050"/>`); stones(h, 0, 200, 400, 216, '#3a3428', .5);
  h.add(`<rect x="80" y="202" width="30" height="14" fill="#1a1410"/>${h.st.known && h.st.open('grating', false) ? '' : [0, 1, 2, 3, 4].map(i => `<line x1="${82 + i * 6.5}" y1="202" x2="${82 + i * 6.5}" y2="216" stroke="#8a4a2a" stroke-width="2"/>`).join('')}<path d="M80,206 q8,4 14,-2 q8,6 16,0" stroke="#2a5a3a" stroke-width="2" fill="none"/>`);
  h.add(`<path d="M300,216 L400,216" stroke="#6a6050" stroke-width="6"/>`);
  // the key that would fit the grating, lying in the passage beneath it
  if (/fit the grating/i.test(h.desc) && !(h.st.known && h.st.carried('rusty iron key'))) h.add(h.tag('key', `<g transform="translate(90 212) rotate(-20)"><circle r="2.6" fill="none" stroke="#b07a3a" stroke-width="1.6"/><path d="M2.6,0 h9 M9,0 v2.5 M11,0 v2" stroke="#b07a3a" stroke-width="1.6"/></g>`));
} };

B['Necropolis'] = { cat: 'egypt', draw(h) {
  sky(h, '#0e1028', '#3a3a5a');
  h.stars(110, 140); moonAt(h, 320, 46, 16);
  h.add(`<rect y="170" width="400" height="90" fill="${h.lin('sd', [[0, '#8a7a5a'], [1, '#4a3e2a']])}"/>`);
  // little termite-hill pyramids, one entrance gaping open
  for (let i = 0; i < 9; i++) { const x = 20 + i * 44 + h.R(-10, 10), s = h.R(18, 40), b = 180 + h.R(0, 60); h.add(`<polygon points="${x - s},${b} ${x},${b - s * 1.2} ${x + s},${b}" fill="#b8a07a"/><polygon points="${x},${b - s * 1.2} ${x + s},${b} ${x + s * .3},${b}" fill="#7a6a4a"/>`); if (i === 4) h.add(`<rect x="${x - 5}" y="${b - 12}" width="10" height="12" fill="#0a0806"/>`); }
  // the city walls to the northeast
  h.add(`<rect x="250" y="150" width="150" height="24" fill="#5a5040"/>`);
  // birds of prey circling, talons glinting
  for (let i = 0; i < 4; i++) { const x = h.R(60, 300), y = h.R(30, 100); h.add(`<path d="M${x - 14},${y} q7,-7 14,0 q7,-7 14,0" stroke="#0a0a14" stroke-width="2.4" fill="none"/><circle cx="${x}" cy="${y + 3}" r="1" fill="#fff"/>`); }
  // the tombstone you stand by: its stone face only once the text has spoken of it,
  // the amber gem in its mouth and the steps down once the tomb is opened
  if (/tombstone/.test(h.desc)) {
    const st = h.st, gem = st.known ? st.inside('tombstone').some(n => /amber/.test(n)) : /flight of steps downward/.test(h.desc);
    const face = gem || (st.mentioned && (st.mentioned('stone face') || st.mentioned('socket')));
    h.add(h.open('tombstone'));
    h.add(`<path d="M92,236 V178 Q92,160 120,158 Q148,160 148,178 V236Z" fill="#9a8a6a" stroke="#4a3e2a" stroke-width="2"/><path d="M96,236 V180 Q96,164 120,162" stroke="#c8b890" stroke-width="2" fill="none" opacity=".5"/>`);
    if (face) h.add(`<ellipse cx="120" cy="190" rx="16" ry="20" fill="#8a7a5a"/><path d="M110,184 h6 M124,184 h6" stroke="#2a2216" stroke-width="2.4"/><path d="M120,186 v8" stroke="#5a4a32" stroke-width="2"/><ellipse cx="120" cy="201" rx="5" ry="3.5" fill="${gem ? '#f0a020' : '#1a140c'}"${gem ? ' stroke="#ffd880" stroke-width="1"' : ''}/>`);
    h.add('</g>');
    if (gem) { h.glow(120, 201, 18, '#ffb030', .6); h.add(h.tag('steps', `<path d="M158,252 L176,222 H232 L250,252Z" fill="#0a0806"/>${[0, 1, 2, 3].map(i => `<path d="M${180 - i * 5},${228 + i * 7} H${228 + i * 5}" stroke="#7a6a4a" stroke-width="3"/>`).join('')}`)); }
  }
} };

B['Palace Balustrade'] = { cat: 'classical', draw(h) {
  sky(h, '#0a1030', '#2a3460');
  h.stars(100, 120);
  // the coin-bright moon low in the sky, reflected in black waters
  moonAt(h, 120, 130, 16, '#fff0c0');
  h.add(`<rect y="140" width="400" height="120" fill="#06080e"/><rect x="110" y="140" width="20" height="80" fill="${h.lin('mr', [[0, '#fff0c0', .6], [1, '#fff0c0', 0]])}"/>`);
  h.add(`<path d="M260,140 L400,140 L400,150 L260,148Z" fill="#2a2a34"/>${Array.from({ length: 10 }, (_, i) => `<circle cx="${270 + i * 13}" cy="144" r="1.5" fill="#ffb050"/>`).join('')}`);
  // broad stone balustrade
  h.add(`<rect y="196" width="400" height="10" fill="#d8ccb0"/><rect y="244" width="400" height="16" fill="#c8bca0"/>${Array.from({ length: 20 }, (_, i) => `<path d="M${10 + i * 20},206 q-5,10 0,19 q5,10 0,19 h8 q-5,-9 0,-19 q5,-9 0,-19z" fill="#e0d4b8"/>`).join('')}`);
  // an astronomical mounting on a tripod, but no telescope
  h.add(`<line x1="300" y1="244" x2="320" y2="160" stroke="#a88a4a" stroke-width="3"/><line x1="340" y1="244" x2="320" y2="160" stroke="#a88a4a" stroke-width="3"/><line x1="320" y1="244" x2="320" y2="160" stroke="#a88a4a" stroke-width="3"/><path d="M306,152 a14,14 0 0 1 28,0" stroke="#c8a860" stroke-width="3" fill="none"/><circle cx="320" cy="158" r="4" fill="#c8a860"/>`);
} };

// ---------- church, machinery, beyond ----------
B['Parish Church'] = { cat: 'church', draw(h) {
  h.add(`<rect width="400" height="260" fill="${h.lin('st', [[0, '#3a3630'], [1, '#1c1a16']])}"/>`);
  stones(h, 0, 0, 400, 180, '#000', .2);
  h.add(`<path d="M170,140 L170,60 Q170,30 200,22 Q230,30 230,60 L230,140Z" fill="#8a9ab8" opacity=".7"/><line x1="200" y1="24" x2="200" y2="140" stroke="#2a2830" stroke-width="3"/>`);
  // altar with flowers and the lectern
  h.add(`<rect x="160" y="140" width="80" height="36" fill="#e8e0cc"/><rect x="156" y="136" width="88" height="6" fill="#c8a040"/>`);
  for (const x of [170, 230]) { h.add(`<path d="M${x - 5},136 l3,-14 h4 l3,14z" fill="#8a6a3a"/>`); for (let k = 0; k < 5; k++) h.add(`<circle cx="${x + h.R(-8, 8)}" cy="${h.R(110, 122)}" r="3" fill="${['#f4f0e8', '#e8c040', '#d85a7a'][k % 3]}"/>`); }
  h.add(`<rect x="290" y="130" width="6" height="50" fill="#5a3a20"/><polygon points="278,128 308,128 302,118 284,118" fill="#6a4a28"/>`);
  // dark wooden pews on woven matting
  h.add(`<rect y="180" width="400" height="80" fill="#4a3a2a"/>`);
  for (let i = 0; i < 4; i++) { const y = 184 + i * 18; h.add(`<rect x="${20 - i * 8}" y="${y}" width="${120 + i * 6}" height="${8 + i * 2}" fill="#2a1a0e"/><rect x="${260 + i * 2}" y="${y}" width="${120 + i * 6}" height="${8 + i * 2}" fill="#2a1a0e"/>`); }
h.add(h.open('moonstone'));   // the Moonstone: a raised door-sized flagstone inscribed with a crescent
  if ((h.st.known && h.st.open('moonstone', false)) || /crystal doorway in the moonstone/i.test(h.desc)) {
    // pulled open: the slab stands up on its edge, a crystal doorway and a passage slanting down
    h.add(`<polygon points="160,206 240,206 252,250 148,250" fill="#0a0a12"/><polygon points="168,212 232,212 242,246 158,246" fill="${h.lin('mx', [[0, '#8ab0d8', .55], [1, '#2a3a5a', .2]])}" stroke="#c8e0f8" stroke-width="2"/>${[0, 1, 2].map(i => `<path d="M${176 + i * 4},${222 + i * 8} H${224 - i * 4}" stroke="#a8c8e8" stroke-width="2" opacity=".6"/>`).join('')}`);
    h.add(`<polygon points="160,206 240,206 236,162 164,162" fill="#8a8680" stroke="#4a4640" stroke-width="2"/><path d="M196,170 a12,12 0 1 0 10,20 a9,9 0 1 1 -10,-20z" fill="#d8dce8"/>`);
  } else h.add(`<polygon points="160,206 240,206 252,250 148,250" fill="#8a8680" stroke="#4a4640" stroke-width="2"/><path d="M196,214 a14,14 0 1 0 12,24 a11,11 0 1 1 -12,-24z" fill="#d8dce8"/>`);
  h.add('</g>');
  // the High Rods of Life, Love and Death, leaning together in a pyramid at the top of the slope down
  const hr = h.st.known ? ['Life', 'Love', 'Death'].filter(n => (h.st.hereList || []).includes(n)) : (/high rods of life, love and death lean together/i.test(h.desc) ? ['Life', 'Love', 'Death'] : []);
  if (hr.length) h.add(h.tag('High Rods', hr.map((n, i) => { const col = { Life: '#4aa84a', Love: '#e87aa0', Death: '#2a2a30' }[n], x0 = [170, 200, 230][i]; return `<line x1="${x0}" y1="${i === 1 ? 250 : 246}" x2="${hr.length > 1 ? 200 : x0 + 6}" y2="168" stroke="#1a1410" stroke-width="7" stroke-linecap="round"/><line x1="${x0}" y1="${i === 1 ? 250 : 246}" x2="${hr.length > 1 ? 200 : x0 + 6}" y2="168" stroke="${col}" stroke-width="4.5" stroke-linecap="round"/>`; }).join('')));
  // narrow stair upward, side chapels
  h.add(`<rect x="360" y="40" width="34" height="140" fill="#0e0c0a"/><rect x="6" y="60" width="40" height="120" fill="#141210"/>`);
} };

B['Bell Tower'] = { cat: 'church', draw(h) {
  h.add(`<rect width="400" height="260" fill="${h.lin('st', [[0, '#2e2a26'], [1, '#4a4238']])}"/>`);
  stones(h, 0, 0, 400, 260, '#000', .25);
  h.add(`<rect x="0" y="0" width="400" height="20" fill="#1a1612"/>`);
  for (let x = 0; x < 400; x += 50) h.add(`<rect x="${x}" y="0" width="12" height="24" fill="#3a2a1a"/>`);
h.add(h.open('ropes'));   // thick braided ropes hanging down, tailing into striped sashes
  for (let i = 0; i < 6; i++) {
    const x = 50 + i * 60;
    h.add(`<path d="M${x},0 V${150 + (i % 2) * 20}" stroke="#c8a870" stroke-width="5"/><path d="M${x},0 V${150 + (i % 2) * 20}" stroke="#8a6a3a" stroke-width="5" stroke-dasharray="3 3"/>`);
    const y = 150 + (i % 2) * 20;
    for (let k = 0; k < 6; k++) h.add(`<rect x="${x - 6}" y="${y + k * 8}" width="12" height="8" rx="2" fill="${['#c8202a', '#f0f0f0', '#2a4ab0'][k % 3]}"/>`);
    h.add(`<path d="M${x},${y + 48} v20" stroke="#c8a870" stroke-width="4"/>`);
  }
  h.add('</g>');
  // the commemorative plaque
  h.add(`<rect x="160" y="60" width="80" height="50" fill="#a88a3a" stroke="#6a5018" stroke-width="3"/>${[0, 1, 2, 3].map(i => `<line x1="170" y1="${72 + i * 9}" x2="${230 - (i % 2) * 14}" y2="${72 + i * 9}" stroke="#5a4010" stroke-width="2"/>`).join('')}`);
  h.add(`<rect y="236" width="400" height="24" fill="#3a2a1a"/>`);
  h.glow(200, 40, 200, '#e8e0c8', .12);
} };

B['Universe Maintenance Room'] = { cat: 'otherworld', draw(h) {
  h.add(`<rect width="400" height="260" fill="#0c0e12"/>`);
  for (let i = 0; i < 60; i++) h.add(`<circle cx="${h.R(0, 400)}" cy="${h.R(0, 260)}" r="${h.R(.3, 1)}" fill="#a8b8d8" opacity="${h.R(.1, .5)}"/>`);
  // black metal one-metre cube with an unimpressive collection of gauges
  h.add(`<polygon points="130,110 250,110 280,90 160,90" fill="#2a2c30"/><rect x="130" y="110" width="120" height="120" fill="#141518"/><polygon points="250,110 280,90 280,210 250,230" fill="#0a0b0d"/>`);
  for (let i = 0; i < 3; i++) h.add(`<circle cx="${150 + i * 24}" cy="134" r="8" fill="#e8e4d8"/><line x1="${150 + i * 24}" y1="134" x2="${150 + i * 24 + h.R(-6, 6)}" y2="${128}" stroke="#c82a2a" stroke-width="1.4"/>`);
  // large dial like a hi-fi volume control, and a big electrician's switch
  h.add(`<circle cx="166" cy="186" r="22" fill="#9aa0a8" stroke="#4a4e54" stroke-width="3"/><circle cx="166" cy="186" r="14" fill="#7a8088"/><line x1="166" y1="186" x2="176" y2="170" stroke="#fff" stroke-width="2.5"/>${Array.from({ length: 11 }, (_, i) => { const a = Math.PI * .75 + i * Math.PI * 1.5 / 10; return `<line x1="${166 + Math.cos(a) * 25}" y1="${186 + Math.sin(a) * 25}" x2="${166 + Math.cos(a) * 29}" y2="${186 + Math.sin(a) * 29}" stroke="#c8c8c8"/>`; }).join('')}`);
  h.add(`<rect x="212" y="160" width="26" height="50" fill="#c8a020" stroke="#4a3a08" stroke-width="2"/><rect x="221" y="150" width="8" height="30" rx="2" fill="#2a2a2a" transform="rotate(-20 225 180)"/><rect x="214" y="200" width="22" height="6" fill="#f4f0e0"/>`);
  // aluminium staircase leading up
  for (let i = 0; i < 9; i++) h.add(`<rect x="${310 + i * 6}" y="${236 - i * 24}" width="60" height="5" fill="#c8ccd0"/>`);
  h.add(`<line x1="310" y1="240" x2="370" y2="20" stroke="#a8acb0" stroke-width="3"/><line x1="370" y1="240" x2="400" y2="40" stroke="#a8acb0" stroke-width="3"/>`);
  h.glow(205, 160, 140, '#88aaff', .12);
} };

B['Inside the Orb'] = { cat: 'otherworld', draw(h) {
  h.add(`<rect width="400" height="260" fill="${h.rad('bg', [[0, '#fff0c0'], [.5, '#e0b050'], [1, '#6a4010']], .5, .5, .7)}"/>`);
  for (let i = 0; i < 6; i++) h.add(`<ellipse cx="200" cy="130" rx="${190 - i * 12}" ry="${120 - i * 8}" fill="none" stroke="#fff8d8" opacity="${.12 + i * .02}" transform="rotate(${i * 11} 200 130)"/>`);
  // an eight-by-eight lattice of oblong crystals in pearly light
  h.glow(200, 130, 130, '#fffaf0', .6);
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    const x = 128 + c * 18 + (r - 3.5) * 2, y = 74 + r * 14;
    h.add(`<rect x="${x}" y="${y}" width="12" height="8" rx="1.5" fill="${(r + c) % 2 ? '#e8f0ff' : '#f8f0e0'}" stroke="#c8b890" stroke-width=".6" opacity=".9"/>`);
  }
  for (let i = 0; i < 30; i++) h.add(`<circle cx="${h.R(20, 380)}" cy="${h.R(20, 240)}" r="${h.R(.6, 2)}" fill="#fffaf0" opacity="${h.R(.3, .8)}"/>`);
} };

B['Hellish Place'] = { cat: 'otherworld', draw(h) {
  h.add(`<rect width="400" height="260" fill="${h.rad('bg', [[0, '#a83a1a'], [1, '#2a0806']], .5, .7, .8)}"/>`);
  for (let i = 0; i < 12; i++) { const x = h.R(0, 400); h.add(`<path d="M${x},260 q${h.R(-14, 14)},-${h.R(40, 90)} ${h.R(-6, 6)},-${h.R(80, 140)}" stroke="#ff8a2a" stroke-width="${h.R(4, 10)}" fill="none" opacity="${h.R(.15, .35)}"/>`); }
  // the stairs he came down
  for (let i = 0; i < 7; i++) h.add(`<rect x="${20 + i * 8}" y="${40 + i * 22}" width="70" height="8" fill="#3a1410"/>`);
  // a demon behind a flame-proofed desk, with a forked tail
  h.add(`<rect x="160" y="150" width="160" height="70" fill="#4a4a50" stroke="#2a2a2e" stroke-width="2"/><rect x="164" y="154" width="152" height="6" fill="#6a6a70"/><text x="240" y="196" text-anchor="middle" font-family="Georgia,serif" font-size="11" fill="#e8c8a0" opacity=".85">Information</text>`);
  h.add(h.tag('demon', `<circle cx="240" cy="110" r="18" fill="#b8301a"/><path d="M226,96 l-6,-16 l12,10z M254,96 l6,-16 l-12,10z" fill="#3a0a06"/><circle cx="234" cy="108" r="2" fill="#ffe070"/><circle cx="246" cy="108" r="2" fill="#ffe070"/><path d="M232,118 q8,6 16,0" stroke="#3a0a06" stroke-width="2" fill="none"/><path d="M218,128 h44 v22 h-44z" fill="#2a2a30"/><path d="M262,138 q40,10 30,-30 l6,-4 l-2,8" stroke="#b8301a" stroke-width="3" fill="none"/>`));
} };

B['Heavenly Place'] = { cat: 'otherworld', draw(h) {
  sky(h, '#a8d0f8', '#f4f8ff');
  for (let i = 0; i < 12; i++) h.add(`<ellipse cx="${h.R(0, 400)}" cy="${h.R(150, 260)}" rx="${h.R(50, 110)}" ry="${h.R(14, 26)}" fill="#ffffff" opacity=".85"/>`);
  // bridge of cloud extending south toward the beanstalk
  h.add(`<path d="M300,200 Q360,170 400,176 L400,196 Q360,192 310,214Z" fill="#fff"/><path d="M392,180 C380,220 404,240 396,260" stroke="#3a7a3a" stroke-width="6" fill="none"/>`);
  // an angel behind new office furniture, beside a blue Tourist Information sign
  h.add(`<rect x="120" y="150" width="150" height="60" fill="#e8e4dc" stroke="#b8b4ac" stroke-width="2"/><rect x="124" y="154" width="142" height="5" fill="#d0ccc4"/>`);
  h.add(h.tag('angel', `<path d="M168,120 q-40,-30 -50,10 q20,-4 40,10z M222,120 q40,-30 50,10 q-20,-4 -40,10z" fill="#fff" stroke="#d8d8e8"/><circle cx="195" cy="104" r="14" fill="#f0d0b0"/><ellipse cx="195" cy="86" rx="14" ry="4" fill="none" stroke="#f0d060" stroke-width="2.5"/><path d="M176,150 Q178,120 195,118 Q212,120 214,150Z" fill="#f8f4ec"/><path d="M188,106 q7,5 14,0" stroke="#8a5a4a" stroke-width="1.5" fill="none"/>`));
  h.add(`<rect x="300" y="110" width="6" height="90" fill="#8a8a8a"/><rect x="280" y="92" width="48" height="30" rx="3" fill="#2a5ab8"/><text x="304" y="112" text-anchor="middle" font-family="Georgia,serif" font-weight="bold" font-size="18" fill="#fff">i</text>`);
  h.glow(200, 60, 220, '#fffae0', .5);
} };


B['Stone Cross'] = { cat: 'garden', draw(h) {
  // the village green under an English afternoon sky
  sky(h, '#9cc0d8', '#e8e4d4');
  for (const [x, y, w] of [[60, 40, 90], [250, 28, 120], [180, 70, 70]]) h.add(`<ellipse cx="${x}" cy="${y}" rx="${w / 2}" ry="10" fill="#fff" opacity=".55"/>`);
  h.add(`<path d="M0,150 Q100,132 200,142 T400,136 V260 H0Z" fill="#7d9a5e"/>`);
  // the parish church, the closed pub, a few houses and tea-shops
  h.add(h.tag('parish church', `<rect x="296" y="96" width="44" height="54" fill="#a8a092"/><polygon points="292,96 318,74 344,96" fill="#6a5a4a"/><rect x="340" y="64" width="24" height="86" fill="#9a9284"/><polygon points="338,64 352,30 366,64" fill="#5a4a3a"/><rect x="348" y="80" width="8" height="12" fill="#3a3028"/><rect x="310" y="120" width="12" height="30" rx="6" fill="#3a3028"/>`));
  h.add(h.tag('Goat and Compasses', `<rect x="186" y="102" width="88" height="46" fill="#c8b490"/><polygon points="180,102 230,80 280,102" fill="#7a4a3a"/>${[196, 220, 244].map(x => `<rect x="${x}" y="114" width="16" height="14" fill="#5a4a3a"/><path d="M${x},114 l16,14 M${x + 16},114 l-16,14" stroke="#3a2e24" stroke-width="1.5"/>`).join('')}<rect x="230" y="132" width="12" height="16" fill="#4a3a2a"/><path d="M276,104 h14 v4" stroke="#3a2e24" stroke-width="2" fill="none"/><rect x="282" y="108" width="16" height="14" fill="#c8a040" stroke="#3a2e24"/><circle cx="290" cy="115" r="3" fill="#3a2e24"/>`));
  for (const [x, w, c] of [[20, 50, '#d8c8a8'], [76, 40, '#e0d4b8'], [124, 52, '#d0c0a0']]) h.add(`<rect x="${x}" y="114" width="${w}" height="34" fill="${c}"/><polygon points="${x - 4},114 ${x + w / 2},98 ${x + w + 4},114" fill="#8a5a42"/><rect x="${x + 8}" y="122" width="9" height="9" fill="#6a7a8a"/><rect x="${x + w - 18}" y="122" width="9" height="9" fill="#6a7a8a"/>`);
  // the long triangle of the green
  h.add(`<path d="M0,150 Q200,140 400,150 V260 H0Z" fill="#8aaa62"/><path d="M30,260 L190,152 L380,260Z" fill="#94b46a"/>`);
  // the public footpath, south towards the stile
  h.add(`<path d="M196,156 Q210,200 250,260 L292,260 Q236,200 206,156Z" fill="#c8b48a"/>`);
  h.add(h.tag('stile', `<rect x="300" y="196" width="6" height="64" fill="#6a4a2e"/><rect x="380" y="190" width="6" height="70" fill="#6a4a2e"/><rect x="292" y="204" width="108" height="6" fill="#8a6a44"/><rect x="292" y="224" width="108" height="6" fill="#8a6a44"/><rect x="326" y="238" width="40" height="6" fill="#7a5a3a"/>`));
  // the war memorial: a stone cross on its steps
  h.add(h.tag('stone cross', `<rect x="54" y="226" width="130" height="16" fill="#9c968a"/><rect x="64" y="212" width="110" height="16" fill="#aca698"/><rect x="76" y="200" width="86" height="14" fill="#bcb6a8"/><rect x="104" y="184" width="30" height="18" fill="#b4ae9e"/><rect x="113" y="104" width="12" height="82" fill="#c8c2b2"/><rect x="96" y="122" width="46" height="11" fill="#c8c2b2"/><path d="M125,104 v80 M142,133 h-17" stroke="#9a9486" stroke-width="2"/>`));
  for (let i = 0; i < 30; i++) h.add(`<circle cx="${h.R(10, 390)}" cy="${h.R(170, 255)}" r="1.6" fill="${h.r() < .5 ? '#f4f2ea' : '#e8d060'}"/>`);
} };

})(typeof window !== 'undefined' ? window : this);
