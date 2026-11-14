// Third batch of hand-composed room illustrations: the rest of Meldrew Hall.
// Original artwork, drawn only from what each room description says.
(function (root) {
'use strict';
const B = (root.ZBespoke || require('./bespoke.js')).BESPOKE;

// ---------- helpers ----------
const box = (h, wall, floor, side) => {
  const { add, lin } = h;
  add(`<rect width="400" height="260" fill="${side || '#140f0b'}"/>`);
  add(`<polygon points="0,0 400,0 340,50 60,50" fill="#000" opacity=".35"/><polygon points="0,0 60,50 60,200 0,260" fill="#000" opacity=".25"/><polygon points="400,0 340,50 340,200 400,260" fill="#000" opacity=".3"/>`);
  add(`<rect x="60" y="50" width="280" height="150" fill="${lin('w', [[0, wall[0]], [1, wall[1]]])}"/><polygon points="60,200 340,200 400,260 0,260" fill="${lin('f', [[0, floor[0]], [1, floor[1]]])}"/>`);
};
const bricks = (h, x0, y0, x1, y1, col, op, bw = 22, bh = 10) => { for (let y = y0; y < y1; y += bh + 2) for (let x = x0 + ((Math.round((y - y0) / (bh + 2))) % 2) * (bw / 2); x < x1; x += bw + 2) h.add(`<rect x="${x}" y="${y}" width="${Math.min(bw, x1 - x)}" height="${Math.min(bh, y1 - y)}" fill="none" stroke="${col || '#000'}" opacity="${op || .3}"/>`); };
const soot = (h, n, x0, x1, y0, y1) => { for (let i = 0; i < n; i++) h.add(`<circle cx="${h.R(x0, x1).toFixed(1)}" cy="${h.R(y0, y1).toFixed(1)}" r="${h.R(.5, 1.6).toFixed(2)}" fill="#0a0806" opacity="${h.R(.3, .7).toFixed(2)}"/>`); };

// ---------- the cellars ----------
B['Cellars South'] = { cat: 'cellar', draw(h) {
  // looking west at the bricked-up wall with its small hole; the cellars go back north (right)
  box(h, ['#5a3a2c', '#3a2620'], ['#2a221c', '#16120e'], '#120e0b');
  bricks(h, 60, 50, 340, 200, '#1a0e08', .45);
  // newer, rougher bricking where the cellar was walled up
  h.add(`<rect x="110" y="60" width="180" height="140" fill="#6a4434" opacity=".35"/>`);
  bricks(h, 110, 60, 290, 200, '#140a06', .5, 18, 9);
  // the hole, ten or eleven inches across, low in the wall
  h.add(h.open('hole') + `<ellipse cx="200" cy="178" rx="15" ry="12" fill="#050303"/><path d="M186,172 q14,-10 28,0" stroke="#8a6050" stroke-width="2" fill="none" opacity=".6"/>` + '</g>');
  // the way back north: an opening in the right-hand wall
  h.add(`<polygon points="350,70 392,40 392,262 350,212" fill="#070504"/><polygon points="344,74 350,70 350,212 344,206" fill="#3a2a20"/>`);
  if (h.st.here('robot mouse')) h.add(h.tag('robot mouse', `<ellipse cx="236" cy="214" rx="16" ry="8" fill="#8a8a8e"/><circle cx="222" cy="209" r="6" fill="#9a9aa0"/><circle cx="219" cy="203" r="3.5" fill="#aaa"/><circle cx="218" cy="209" r="1.3" fill="#e04030"/><path d="M252,214 q12,2 16,-6" stroke="#6a6a6e" stroke-width="1.5" fill="none"/>`));
  h.glow(200, 140, 170, '#ffe2a6', .12);
} };

B['Dark Shaft'] = { cat: 'cellar', draw(h) {
  // halfway up the dumbwaiter shaft: a dark corridor leads off to the north
  h.add(`<rect width="400" height="260" fill="#0a0806"/>`);
  h.add(`<rect x="110" y="0" width="180" height="260" fill="${h.lin('sh', [[0, '#2a221c'], [.5, '#1a1410'], [1, '#0c0907']])}"/>`);
  bricks(h, 110, 0, 290, 260, '#000', .35, 20, 9);
  h.add(`<rect x="100" y="0" width="10" height="260" fill="#1e1712"/><rect x="290" y="0" width="10" height="260" fill="#1e1712"/>`);
  // the dark corridor north, opening off the shaft
  h.add(h.open('corridor') + `<rect x="300" y="96" width="100" height="104" fill="#040302"/><polygon points="290,92 300,96 300,200 290,206" fill="#2a2018"/><rect x="300" y="196" width="100" height="6" fill="#1a140e"/>` + '</g>');
  // pulley ropes running up and down the shaft
  const here = !h.st.known || h.st.here('dumbwaiter');
  h.add(`<line x1="176" y1="0" x2="176" y2="260" stroke="#a8885a" stroke-width="2.2"/><line x1="224" y1="0" x2="224" y2="260" stroke="#a8885a" stroke-width="2.2"/>`);
  if (here) h.add(h.tag('dumbwaiter', `<polygon points="146,126 254,126 268,112 160,112" fill="#7a5634" stroke="#1a1008"/><polygon points="254,126 268,112 268,206 254,220" fill="#3e2a16" stroke="#1a1008"/><rect x="146" y="126" width="108" height="94" fill="#5a3e24" stroke="#1a1008" stroke-width="2"/><rect x="154" y="134" width="92" height="78" fill="#120a04"/><line x1="154" y1="173" x2="246" y2="173" stroke="#3a2614" stroke-width="3"/><line x1="176" y1="0" x2="176" y2="114" stroke="#a8885a" stroke-width="2.2"/><line x1="224" y1="0" x2="224" y2="114" stroke="#a8885a" stroke-width="2.2"/>`));
  else h.add(`<rect x="130" y="200" width="140" height="60" fill="#030202"/>`);
  h.glow(200, 160, 140, '#ffe2a6', .1);
} };

B['Dark Passage'] = { cat: 'cellar', draw(h) {
  // a passage full of coal dust, sloping slightly down to the south (towards us); the metal door at the north end
  h.add(`<rect width="400" height="260" fill="#0b0a09"/>`);
  h.add(`<polygon points="0,0 400,0 250,90 150,90" fill="#161412"/><polygon points="0,0 150,90 150,170 0,260" fill="#1c1916"/><polygon points="400,0 250,90 250,170 400,260" fill="#181513"/>`);
  h.add(`<polygon points="150,170 250,170 400,260 0,260" fill="${h.lin('cd', [[0, '#1e1c1a'], [1, '#0e0d0c']])}"/>`);
  // the metal door at the far end
  const open = h.st.known && h.st.open('metal door', false);
  h.add(h.open('metal door') + (open
    ? `<rect x="168" y="96" width="64" height="74" fill="#c8a060" opacity=".22"/><rect x="168" y="96" width="64" height="74" fill="#050404" opacity=".7"/><polygon points="168,96 150,92 150,174 168,170" fill="#5a5a60"/>`
    : `<rect x="168" y="96" width="64" height="74" fill="#4a4a50" stroke="#2a2a2e" stroke-width="2"/>${[104, 132, 160].map(y => `<rect x="168" y="${y}" width="64" height="3" fill="#33333a"/>`).join('')}<circle cx="222" cy="134" r="3" fill="#8a8a90"/><rect x="219" y="140" width="5" height="7" fill="#1a1a1e"/>`) + '</g>');
  // shallow sandstone recess in the east wall
  h.add(h.open('recess') + `<polygon points="292,96 334,72 334,176 292,160" fill="#a8844a"/><polygon points="298,102 328,84 328,166 298,154" fill="#6a5030"/>` + '</g>');
  // coal dust everywhere, hanging in the air
  soot(h, 160, 0, 400, 0, 260);
  for (let i = 0; i < 10; i++) h.add(`<ellipse cx="${h.R(20, 380)}" cy="${h.R(60, 240)}" rx="${h.R(40, 90)}" ry="${h.R(8, 18)}" fill="#3a3632" opacity="${h.R(.08, .18).toFixed(2)}"/>`);
  h.glow(200, 140, 170, '#ffe2a6', .08);
} };

B['Sandstone Passage'] = { cat: 'cellar', draw(h) {
  // a flight of sandstone steps slanting down westwards from the coal-dust passage to the east
  h.add(`<rect width="400" height="260" fill="#120d08"/>`);
  h.add(`<polygon points="0,30 400,0 400,90 0,120" fill="#2a1e12"/><polygon points="0,200 400,150 400,260 0,260" fill="#1a130c"/>`);
  for (let i = 0; i < 11; i++) {
    const x = 20 + i * 34, y = 214 - i * 12;
    h.add(`<polygon points="${x},${y} ${x + 36},${y - 4} ${x + 36},${y + 12} ${x},${y + 16}" fill="${i % 2 ? '#c89a5a' : '#d8aa68'}"/><polygon points="${x},${y} ${x + 36},${y - 4} ${x + 42},${y - 10} ${x + 6},${y - 6}" fill="#e8c080"/>`);
  }
  h.add(`<polygon points="0,120 400,90 400,150 0,200" fill="${h.lin('ss', [[0, '#8a6a40'], [1, '#6a5030']], 1, 0)}" opacity=".55"/>`);
  for (let i = 0; i < 18; i++) { const y = h.R(40, 190); h.add(`<line x1="${h.R(0, 380)}" y1="${y}" x2="${h.R(0, 400)}" y2="${y + h.R(-4, 4)}" stroke="#a8845a" opacity=".2"/>`); }
  // at the top, the coal-dust passage
  h.add(`<polygon points="372,40 400,36 400,150 372,154" fill="#050404"/>`);
  soot(h, 25, 330, 400, 30, 160);
  h.glow(120, 190, 150, '#ffd890', .14);
} };

// ---------- the servants' stairs ----------
B['White Hallway'] = { cat: 'interior', draw(h) {
  // a low white hallway, once scullery and pantry
  h.add(`<rect width="400" height="260" fill="#cfcac0"/>`);
  h.add(`<polygon points="0,0 400,0 340,40 60,40" fill="#e8e4dc"/><polygon points="0,0 60,40 60,196 0,260" fill="#bdb7ac"/><polygon points="400,0 340,40 340,196 400,260" fill="#c4beb2"/>`);
  h.add(`<rect x="60" y="40" width="280" height="156" fill="${h.lin('wh', [[0, '#f2efe8'], [1, '#dcd7cc']])}"/><polygon points="60,196 340,196 400,260 0,260" fill="${h.lin('fl', [[0, '#9a8a74'], [1, '#6a5c4a']])}"/>`);
  for (let i = 0; i < 8; i++) h.add(`<line x1="${60 + i * 40}" y1="196" x2="${i * 57}" y2="260" stroke="#5a4c3a" opacity=".4"/>`);
  // the tight, dark staircase going up and south (left)
  h.add(h.open('staircase') + `<polygon points="10,58 54,74 54,198 10,236" fill="#1a1612"/><polygon points="10,58 54,74 54,80 10,66" fill="#8a8478"/>${[0, 1, 2, 3, 4, 5, 6].map(i => `<polygon points="${12 + i * 5},${228 - i * 22} ${52},${194 - i * 18} ${52},${198 - i * 18} ${12 + i * 5},${233 - i * 22}" fill="#6a5a48"/>`).join('')}<line x1="54" y1="74" x2="54" y2="198" stroke="#8a8478" stroke-width="3"/>` + '</g>');
  // the garden doorway to the northeast, with the bricked path outside
  h.add(h.open('doorway') + `<rect x="250" y="74" width="66" height="122" fill="${h.lin('gd', [[0, '#a8c8e0'], [.55, '#d8e4d0'], [1, '#6a9a4a']])}"/><polygon points="268,196 300,196 330,136 300,136" fill="#a8603a"/>${[0, 1, 2, 3, 4].map(i => `<line x1="${270 + i * 8}" y1="${196 - i * 12}" x2="${300 + i * 6}" y2="${196 - i * 12}" stroke="#6a3a20" opacity=".6"/>`).join('')}<rect x="250" y="74" width="66" height="122" fill="none" stroke="#8a8478" stroke-width="4"/>` + '</g>');
  h.add(`<polygon points="250,196 316,196 360,260 210,260" fill="#fff8e0" opacity=".12"/>`);
  // the picture hook on the wall, and Mad Isaac if he has been hung there
  h.add(h.open('picture hook') + `<path d="M150,82 l4,-4 l4,4" stroke="#6a6a6a" stroke-width="2" fill="none"/><circle cx="154" cy="78" r="2" fill="#6a6a6a"/>` + '</g>');
  if (h.st.known && h.st.here('painting')) h.add(h.tag('painting', `<line x1="154" y1="80" x2="126" y2="96" stroke="#6a5a40"/><line x1="154" y1="80" x2="182" y2="96" stroke="#6a5a40"/><rect x="116" y="94" width="76" height="92" fill="#7a5a20" stroke="#c8a040" stroke-width="3"/><rect x="123" y="101" width="62" height="78" fill="#2e2418"/><path d="M134,179 Q138,146 154,140 Q170,146 174,179Z" fill="#4a2a24"/><ellipse cx="154" cy="128" rx="9" ry="11" fill="#c8a080"/><path d="M144,125 Q154,108 164,125" fill="#e8e0d0"/>`));
  // the elephant's foot umbrella stand beside the garden doorway
  h.add(h.open('umbrella stand') + `<path d="M216,196 q-2,-40 4,-46 h28 q6,6 4,46z" fill="#8a8480"/>${[0, 1, 2, 3].map(i => `<path d="M220,${160 + i * 9} q14,4 28,0" stroke="#6a6460" fill="none"/>`).join('')}<ellipse cx="234" cy="150" rx="14" ry="4" fill="#5a5450"/>${[0, 1, 2, 3].map(i => `<ellipse cx="${220 + i * 9}" cy="196" rx="4" ry="2" fill="#d8d0c4"/>`).join('')}` + '</g>');
  h.contents('umbrella stand', 216, 152, 16, 14, 3);
  if (h.st.here('sceptre')) h.add(h.tag('sceptre', `<line x1="238" y1="150" x2="242" y2="118" stroke="#d8a830" stroke-width="3"/><circle cx="242" cy="116" r="4" fill="#e8c048"/>`));
} };

B['Halfway up the Stairs'] = { cat: 'interior', draw(h) {
  // the servants' steep zigzag staircase; every door on it is locked
  h.add(`<rect width="400" height="260" fill="#0f0c09"/>`);
  h.add(`<polygon points="40,0 360,0 330,260 70,260" fill="${h.lin('st', [[0, '#2a2018'], [1, '#1a140e']])}"/>`);
  // flights going up in a zigzag
  const flight = (x0, y0, dir, n) => { for (let i = 0; i < n; i++) { const x = x0 + dir * i * 16, y = y0 - i * 11; h.add(`<rect x="${dir > 0 ? x : x - 60}" y="${y}" width="60" height="11" fill="${i % 2 ? '#4a3826' : '#5a4430'}" stroke="#1c140c" stroke-width=".8"/>`); } };
  flight(90, 248, 1, 7); h.add(`<rect x="196" y="160" width="120" height="10" fill="#4a3826"/>`); flight(310, 158, -1, 6); h.add(`<rect x="160" y="88" width="120" height="10" fill="#4a3826"/>`); flight(160, 86, 1, 5);
  // banister
  h.add(`<path d="M90,214 L196,140 M316,140 L226,70 M160,64 L226,20" stroke="#6a4a2a" stroke-width="3" fill="none"/>`);
  // locked doors on the landings
  for (const [x, y] of [[326, 118], [96, 52]]) h.add(h.open('doors') + `<rect x="${x}" y="${y}" width="34" height="50" fill="#3a2614" stroke="#1a1008" stroke-width="2"/><rect x="${x + 4}" y="${y + 4}" width="26" height="18" fill="none" stroke="#24180c"/><rect x="${x + 4}" y="${y + 26}" width="26" height="20" fill="none" stroke="#24180c"/><circle cx="${x + 27}" cy="${y + 27}" r="2" fill="#a8884a"/><rect x="${x + 25}" y="${y + 31}" width="4" height="6" fill="#0a0604"/>` + '</g>');
  h.glow(200, 140, 180, '#ffe2a6', .08);
} };

// ---------- secret ways ----------
B['Chimney'] = { cat: 'cellar', draw(h) {
  // cramped and sooty, no floor: you are wedged by your feet; to the east, through the fireplace, the cupboard
  h.add(`<rect width="400" height="260" fill="#0a0806"/>`);
  h.add(`<polygon points="70,0 330,0 300,260 100,260" fill="${h.lin('ch', [[0, '#1e1814'], [1, '#100c09']])}"/>`);
  bricks(h, 70, 0, 330, 260, '#000', .55, 26, 11);
  soot(h, 120, 70, 330, 0, 260);
  // light from the cupboard beyond the fireplace opening, low on the east (right)
  h.add(h.open('fireplace') + `<rect x="262" y="150" width="68" height="70" fill="${h.lin('cp', [[0, '#5a4a3c'], [1, '#3a2e24']])}"/><path d="M262,150 h68 v-8 h-68z" fill="#1a1410"/>${[0, 1, 2].map(i => `<rect x="${266 + i * 20}" y="${214}" width="14" height="6" fill="#2a2a2e"/>`).join('')}` + '</g>');
  h.glow(296, 186, 110, '#e8d0a0', .22);
  // your feet, jammed against the walls
  h.add(`<path d="M112,232 l40,-6 l6,10 l-44,6z" fill="#3a2a1e"/><path d="M290,226 l-40,-4 l-6,10 l44,4z" fill="#3a2a1e"/>`);
  // the sooty old stick, wedged loosely beside you
  if (h.st.here('stick')) h.add(h.tag('sooty stick', `<line x1="140" y1="70" x2="176" y2="196" stroke="#1a1612" stroke-width="7" stroke-linecap="round"/><line x1="141" y1="72" x2="175" y2="192" stroke="#3a3430" stroke-width="2" opacity=".6"/>`));
} };

B['Dark Staircase'] = { cat: 'cellar', draw(h) {
  // a dark staircase turning from east to south as it descends; chanting rises from below
  h.add(`<rect width="400" height="260" fill="#080605"/>`);
  for (let i = 0; i < 12; i++) {
    const t = i / 11, a = -Math.PI * .1 + t * Math.PI * .7;
    const cx = 200 + Math.cos(a) * 150 * (1 - t * .5), cy = 50 + t * 190, w = 130 - t * 60;
    h.add(`<polygon points="${cx - w / 2},${cy} ${cx + w / 2},${cy - 6} ${cx + w / 2 + 6},${cy + 8} ${cx - w / 2 + 6},${cy + 14}" fill="${i % 2 ? '#2e241c' : '#3a2e24'}" stroke="#120c08" stroke-width=".8"/>`);
  }
  h.add(`<ellipse cx="150" cy="250" rx="90" ry="22" fill="#000"/>`);
  if (h.st.here('matchbook')) h.add(h.tag('matchbook', `<rect x="236" y="104" width="16" height="10" rx="1" fill="#b8323a" transform="rotate(-12 244 109)"/><rect x="236" y="104" width="16" height="3" fill="#e8dcc0" transform="rotate(-12 244 109)"/>`));
  h.glow(200, 120, 160, '#ffe2a6', .06);
} };


// ---------- the gardens ----------
const sky = (h, a, b) => h.add(`<rect width="400" height="260" fill="${h.lin('sky', [[0, a], [1, b]])}"/>`);
const clouds = (h, n, y0, y1) => { for (let i = 0; i < n; i++) h.add(`<ellipse cx="${h.R(0, 400)}" cy="${h.R(y0, y1)}" rx="${h.R(30, 60)}" ry="${h.R(6, 11)}" fill="#fff" opacity="${h.R(.35, .6).toFixed(2)}"/>`); };
const privet = (h, pts, c) => { h.add(`<polygon points="${pts}" fill="${c || '#2a5226'}"/>`); };
const leafy = (h, n, x0, x1, y0, y1, cols) => { for (let i = 0; i < n; i++) h.add(`<circle cx="${h.R(x0, x1).toFixed(1)}" cy="${h.R(y0, y1).toFixed(1)}" r="${h.R(2, 5).toFixed(1)}" fill="${cols[i % cols.length]}" opacity=".7"/>`); };
const roller = h => { if (h.st.known && h.st.here('roller')) h.add(h.tag('garden roller', `<rect x="120" y="226" width="160" height="34" rx="6" fill="#4a6a3a" stroke="#1a2a14" stroke-width="2"/><rect x="132" y="232" width="136" height="20" rx="10" fill="#6a6a6a"/>${[0, 1, 2, 3, 4].map(i => `<line x1="${142 + i * 28}" y1="232" x2="${142 + i * 28}" y2="252" stroke="#4a4a4a"/>`).join('')}<path d="M170,226 v-14 h60 v14" stroke="#2a2a2a" stroke-width="4" fill="none"/>`)); };
// the roller can be driven up to the plane tree too
if (B['Family Tree'] && !B['Family Tree'].withRoller) { const d0 = B['Family Tree'].draw; B['Family Tree'].draw = function (h) { d0.call(this, h); roller(h); }; B['Family Tree'].withRoller = true; }
// which ways a maze corridor runs, read from the text: "runs east, south and west"
const runs = (h, txt) => { const m = (txt || '').match(/(?:runs|corridor runs|maze runs)\s+([a-z ,]+?)(?:\.|$)/i); const s = m ? m[1] : ''; return { n: /north/.test(s), s: /south/.test(s), e: /east/.test(s), w: /west/.test(s) }; };

B['Maze'] = { cat: 'garden', draw(h) {
  // a first-person look down a passage of the privet maze; the openings follow the text
  const r = runs(h, h.desc);
  sky(h, '#90b8d8', '#e4ece0'); clouds(h, 3, 10, 50);
  privet(h, '0,40 150,100 150,200 0,260', '#244a20'); privet(h, '400,40 250,100 250,200 400,260', '#21461d');
  h.add(`<polygon points="150,200 250,200 400,260 0,260" fill="#6a8a4a"/><polygon points="170,200 230,200 280,260 120,260" fill="#8a7a5a" opacity=".5"/>`);
  if (r.n) h.add(`<rect x="150" y="100" width="100" height="100" fill="#3a6a32" opacity=".55"/><rect x="170" y="110" width="60" height="90" fill="#6a9a4a"/>`); else privet(h, '150,100 250,100 250,200 150,200', '#2e5a28');
  if (r.w) h.add(`<polygon points="40,70 100,94 100,210 40,236" fill="#7a9a5a"/><polygon points="40,70 100,94 100,100 40,78" fill="#1a3a16"/>`);
  if (r.e) h.add(`<polygon points="360,70 300,94 300,210 360,236" fill="#7a9a5a"/><polygon points="360,70 300,94 300,100 360,78" fill="#1a3a16"/>`);
  for (let i = 0; i < 140; i++) { const left = h.r() < .5, x = left ? h.R(0, 150) : h.R(250, 400), u = left ? x / 150 : (400 - x) / 150, top = 40 + 60 * u, bot = 260 - 60 * u, y = h.R(top, bot); if (r.w && left && x > 40 && x < 100 && y > 80) continue; if (r.e && !left && x > 300 && x < 360 && y > 80) continue; h.add(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${h.R(2, 5).toFixed(1)}" fill="${['#3a6a30', '#1e3e1a', '#4a7a3a'][i % 3]}" opacity=".7"/>`); }
  roller(h);
} };

B['Patio in Maze'] = { cat: 'garden', draw(h) {
  sky(h, '#90b8d8', '#e4ece0'); clouds(h, 3, 10, 50);
  privet(h, '0,40 400,40 400,150 0,150', '#244a20'); leafy(h, 80, 0, 400, 40, 150, ['#3a6a30', '#1e3e1a']);
  // the gap back west
  h.add(`<rect x="0" y="96" width="34" height="80" fill="#6a9a4a"/>`);
  // old stone patio, one flagstone missing
  h.add(`<polygon points="30,150 370,150 400,260 0,260" fill="#a8a090"/>`);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) { const y0 = 150 + r * 27.5, y1 = y0 + 27.5, s0 = (y0 - 150) / 110, s1 = (y1 - 150) / 110; const x = (k, s) => 30 - 30 * s + k * (340 + 60 * s) / 6; const miss = r === 2 && c === 3; h.add(`<polygon points="${x(c, s0)},${y0} ${x(c + 1, s0)},${y0} ${x(c + 1, s1)},${y1} ${x(c, s1)},${y1}" fill="${miss ? '#0a0806' : ['#b8b0a0', '#a49c8c', '#aca494'][(r + c) % 3]}" stroke="#7a7466"/>`); }
  h.add(h.open('flagstone') + `<rect x="0" y="0" width="0" height="0"/>` + '</g>');
  // soft earth, and the marble rose sticking out of it
  h.add(`<ellipse cx="300" cy="180" rx="28" ry="8" fill="#4a3424"/>`);
  if (h.st.here('rose')) h.add(h.tag('marble rose', `<line x1="300" y1="180" x2="300" y2="158" stroke="#e8e4dc" stroke-width="2.5"/><circle cx="300" cy="154" r="7" fill="#f2efe8"/><path d="M295,154 q5,-6 10,0 q-5,5 -10,0" stroke="#c8c2b6" fill="none"/>`));
  roller(h);
} };

B['Viewpoint Ledge'] = { cat: 'garden', draw(h) {
  // a flagstoned rampart on the hillside, looking down across the valley to the motorway
  sky(h, '#8ab4d8', '#e8ecdc'); clouds(h, 5, 10, 70);
  h.add(`<path d="M0,110 Q100,96 200,106 T400,100 L400,170 L0,170Z" fill="#8aa07a"/><path d="M0,130 Q120,118 240,128 T400,124 L400,180 L0,180Z" fill="#6f8a5e"/>`);
  // the motorway below, with coaches
  h.add(h.open('motorway') + `<polygon points="0,150 400,140 400,156 0,168" fill="#5a5a5e"/><line x1="0" y1="159" x2="400" y2="148" stroke="#e8e8e0" stroke-dasharray="10 8" opacity=".7"/>${[60, 210, 330].map((x, i) => `<rect x="${x}" y="${146 - x * .02 - i}" width="30" height="9" rx="2" fill="${['#c8a030', '#3a6aa8', '#e8e4dc'][i]}"/><rect x="${x + 3}" y="${147 - x * .02 - i}" width="24" height="3" fill="#2a3a4a"/>`).join('')}` + '</g>');
  // the rampart wall and flagstones
  h.add(`<rect x="0" y="176" width="400" height="20" fill="#a8a090"/>${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="${i * 50}" y="168" width="38" height="10" fill="#b8b0a0"/>`).join('')}<polygon points="0,196 400,196 400,260 0,260" fill="#9a9284"/>`);
  for (let i = 0; i < 7; i++) h.add(`<line x1="${i * 66}" y1="196" x2="${i * 66 - 30}" y2="260" stroke="#7a7466"/>`);
  // the plaque, and the miniature etching resting on it
  h.add(h.open('plaque') + `<rect x="296" y="200" width="10" height="46" fill="#6a6a6a"/><polygon points="270,186 332,186 338,204 264,204" fill="#8a7a5a" stroke="#4a3a2a"/><path d="M276,194 h50" stroke="#4a3a2a" opacity=".6"/>` + '</g>');
  if (h.st.here('miniature')) h.add(h.tag('miniature', `<rect x="292" y="178" width="18" height="12" fill="#e8e4f0" stroke="#8a8aa0" transform="rotate(-6 301 184)"/>`));
  privet(h, '380,140 400,140 400,260 380,260', '#244a20');
  roller(h);
} };

B['Up the Plane Tree'] = { cat: 'garden', draw(h) {
  // in among the branches and leaves; the maze glimpsed below, the conservatory windows of the house
  sky(h, '#9ac0dc', '#e8eee0');
  // the house far off with the conservatory windows, Aunt Jemima at one of them
  h.add(`<rect x="250" y="40" width="150" height="80" fill="#a8988a"/>${[0, 1, 2, 3].map(i => `<rect x="${262 + i * 34}" y="56" width="22" height="34" fill="#c8dce8" stroke="#6a5a4e"/>`).join('')}`);
  h.add(h.tag('Jemima', `<circle cx="307" cy="68" r="4" fill="#d8d4cc"/><rect x="303" y="72" width="8" height="12" fill="#c8508a"/>`));
  // the maze below, through the lower branches (its layout as the game describes it)
  const LAY = ['###########################', '...............###......###', '######...###......###...###', '###.........###.........###', '######...##################', '###...............###...###', '############...############'];
  h.add(`<rect x="0" y="170" width="400" height="90" fill="#7a9a5a"/>`);
  LAY.forEach((row, ry) => [...row].forEach((ch, cx) => { if (ch === '#') { const y = 174 + ry * 12, x = 6 + cx * 14.6; h.add(`<rect x="${x.toFixed(1)}" y="${y}" width="15" height="11" fill="#244a20"/>`); } }));
  // branches and leaves all around
  h.add(`<path d="M0,240 Q120,200 200,150 M60,0 Q120,80 140,160 M400,200 Q300,170 230,120 M380,0 Q320,60 300,130" stroke="#5a4a3a" stroke-width="12" fill="none" stroke-linecap="round"/>`);
  for (let i = 0; i < 70; i++) { const x = h.r() < .5 ? h.R(0, 150) : h.R(250, 400), y = h.R(0, 260); h.add(`<path d="M${x},${y} l8,-6 l4,4 l6,-2 l-2,8 l4,4 l-10,2 l-4,6 l-2,-8z" fill="${['#3a7a3a', '#2a5a2a', '#4a8a42'][i % 3]}" opacity=".9"/>`); }
  for (let i = 0; i < 30; i++) h.add(`<path d="M${h.R(0, 400)},${h.R(0, 60)} l8,-6 l4,4 l6,-2 l-2,8 l4,4 l-10,2 l-4,6 l-2,-8z" fill="#3a7a3a" opacity=".85"/>`);
} };

B['Clearing'] = { cat: 'garden', draw(h) {
  // a clearing at the edge of the garden: walls and maze hedges; the plane tree east, the garage entrance west, a small vegetable garden south
  sky(h, '#90b8d8', '#e4ece0'); clouds(h, 3, 10, 60);
  h.add(`<rect x="0" y="100" width="150" height="90" fill="#a8988a"/>`); bricks(h, 0, 100, 150, 190, '#6a5a4e', .4, 20, 8);
  h.add(h.open('garage entrance') + `<rect x="40" y="120" width="70" height="70" fill="#1a1612"/><rect x="40" y="120" width="70" height="5" fill="#6a5a4e"/>` + '</g>');
  privet(h, '150,110 290,110 290,190 150,190', '#244a20'); leafy(h, 40, 150, 290, 110, 190, ['#3a6a30', '#1e3e1a']);
  // the plane tree to the east
  h.add(h.open('plane tree') + `<path d="M330,190 Q336,120 326,60 L344,60 Q350,120 352,190Z" fill="#7a6a58"/><circle cx="340" cy="50" r="58" fill="#2e5a28"/><circle cx="300" cy="70" r="34" fill="#3a6a30"/><circle cx="380" cy="80" r="36" fill="#2a5226"/>` + '</g>');
  h.add(`<path d="M0,190 Q200,182 400,192 L400,260 L0,260Z" fill="#6a9a4a"/>`);
  // the vegetable garden to the south, in front of us
  h.add(h.open('vegetable garden') + `${[0, 1, 2].map(i => `<polygon points="${120 - i * 30},${226 + i * 12} ${280 + i * 30},${226 + i * 12} ${286 + i * 30},${232 + i * 12} ${114 - i * 30},${232 + i * 12}" fill="#5a3e28"/>${Array.from({ length: 10 }, (_, k) => `<circle cx="${130 - i * 28 + k * (15 + i * 6)}" cy="${224 + i * 12}" r="3" fill="#4a8a3a"/>`).join('')}`).join('')}` + '</g>');
  roller(h);
} };

B['Hedgery'] = { cat: 'garden', draw(h) {
  // a restful hedge garden; the summer house to the north, a broad croquet lawn opening to the east
  sky(h, '#8ab4d8', '#e8ecdc'); clouds(h, 4, 10, 60);
  privet(h, '0,120 130,120 130,200 0,200', '#2a5226'); leafy(h, 30, 0, 130, 120, 200, ['#3a6a30']);
  h.add(h.open('summer house') + `<rect x="150" y="96" width="110" height="94" fill="#e8e0cc"/><polygon points="140,96 205,46 270,96" fill="#bcd0dc" stroke="#7a6a50" stroke-width="2"/><rect x="186" y="134" width="38" height="56" fill="#5a4a36"/>${[0, 1].map(i => `<rect x="${160 + i * 74}" y="112" width="18" height="24" fill="#a8c0d0" stroke="#8a7a60"/>`).join('')}<line x1="140" y1="96" x2="270" y2="96" stroke="#7a6a50" stroke-width="3"/>` + '</g>');
  // the sparrows around the gutters of the summer house
  if (/sparrows/i.test(h.desc)) h.add(h.open('sparrows') + `${Array.from({ length: 9 }, (_, i) => { const x = 146 + i * 14 + h.R(-3, 3), y = 92 + h.R(-4, 2); return `<ellipse cx="${x}" cy="${y}" rx="3.4" ry="2.6" fill="#7a5a3a"/><circle cx="${x + 2.5}" cy="${y - 2}" r="1.8" fill="#6a4a2e"/>`; }).join('')}<path d="M210,60 q4,-4 8,0 M228,52 q4,-4 8,0" stroke="#5a4028" stroke-width="1.5" fill="none"/>` + '</g>');
  privet(h, '280,120 330,120 330,200 280,200', '#2a5226');
  h.add(h.open('croquet lawn') + `<path d="M330,170 L400,160 L400,220 L330,214Z" fill="#7aaa52"/>` + '</g>');
  h.add(`<path d="M0,196 Q200,186 400,200 L400,260 L0,260Z" fill="#6a9a4a"/>`);
} };

B['Bricked Path'] = { cat: 'garden', draw(h) {
  // a pleasant bricked path from the outer rooms of the Hall to a track through the eastern garden
  sky(h, '#8ab4d8', '#e8ecdc'); clouds(h, 4, 10, 60);
  h.add(`<rect x="0" y="40" width="120" height="160" fill="#a8988a"/>`); bricks(h, 0, 40, 120, 200, '#6a5a4e', .35, 22, 9);
  h.add(`<rect x="70" y="120" width="40" height="80" fill="#cfcac0"/>`);
  h.add(`<path d="M120,180 Q260,166 400,176 L400,260 L120,260Z" fill="#6a9a4a"/><path d="M0,200 L120,200 L120,260 L0,260Z" fill="#6a9a4a"/>`);
  h.add(h.open('bricked path') + `<polygon points="90,260 170,260 380,176 352,176" fill="#a8603a"/>${Array.from({ length: 12 }, (_, i) => { const t = i / 12, y = 260 - t * 84; const x0 = 90 + t * 262, x1 = 170 + t * 210; return `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="#6a3a20" opacity=".55"/>`; }).join('')}` + '</g>');
  h.add(`<polygon points="352,176 380,176 400,172 400,168" fill="#c8b48a"/>`);
} };

B['Behind Summer House'] = { cat: 'garden', draw(h) {
  // among dense hedges by the shabby, wood-slatted back of the summer house
  sky(h, '#7aa0c0', '#c8d4c8');
  h.add(h.open('summer house') + `<rect x="120" y="40" width="200" height="170" fill="#8a7458"/>${Array.from({ length: 12 }, (_, i) => `<line x1="120" y1="${48 + i * 14}" x2="320" y2="${48 + i * 14}" stroke="#5a4a36" stroke-width="2"/>`).join('')}` + '</g>');
  const holed = (h.st.known && ((!h.st.here('squirrel') && h.st.here('hole')) || h.st.open('loose board', false))) || /squeeze past the loose board/i.test(h.desc);
  h.add(h.open('loose board') + (holed ? `<rect x="208" y="118" width="40" height="44" fill="#140e08"/>` : `<rect x="210" y="118" width="34" height="12" fill="#9a8466" transform="rotate(4 227 124)"/><rect x="212" y="131" width="30" height="3" fill="#140e08"/>`) + '</g>');
  privet(h, '0,20 120,40 120,260 0,260', '#1e3e1a'); privet(h, '320,40 400,20 400,180 320,210', '#1e3e1a');
  leafy(h, 160, 0, 400, 0, 260, ['#2a5226', '#16301a', '#3a6a30']);
  for (let i = 0; i < 14; i++) { const x = h.R(0, 400), y = h.R(0, 260); h.add(`<path d="M${x},${y} l${h.R(-30, 30)},${h.R(-20, 20)} l${h.R(-10, 10)},${h.R(-14, 14)}" stroke="#2a1e14" stroke-width="2" fill="none"/>`); }
  h.add(`<path d="M120,210 L320,210 L400,260 L60,260Z" fill="#3a4a2a"/>`);
} };

B['Beside the Wall'] = { cat: 'garden', draw(h) {
  // the path along the foot of the Hall ends at one of the carved garden walls; a shrub in a wide round tub
  sky(h, '#8ab4d8', '#e8ecdc'); clouds(h, 3, 10, 50);
  h.add(`<rect x="0" y="0" width="120" height="200" fill="#a8988a"/>`); bricks(h, 0, 0, 120, 200, '#6a5a4e', .35, 22, 9);
  h.add(`<rect x="24" y="30" width="30" height="44" fill="#3a4a5a"/><rect x="24" y="110" width="30" height="44" fill="#3a4a5a"/>`);
  h.add(h.open('carved wall') + `<rect x="120" y="96" width="280" height="104" fill="#c8bca4"/>${[0, 1, 2, 3, 4].map(i => `<path d="M${150 + i * 52},170 q10,-40 20,0 q10,-40 20,0" stroke="#8a7e66" stroke-width="3" fill="none"/><circle cx="${170 + i * 52}" cy="122" r="9" fill="none" stroke="#8a7e66" stroke-width="3"/>`).join('')}<rect x="120" y="90" width="280" height="8" fill="#a89a80"/>` + '</g>');
  h.add(`<polygon points="0,200 400,200 400,260 0,260" fill="#b8a88a"/><polygon points="120,200 400,200 400,260 60,260" fill="#c8b898" opacity=".6"/>`);
  h.add(h.open('shrub') + `<ellipse cx="240" cy="232" rx="56" ry="12" fill="#6a4a2a"/><rect x="184" y="206" width="112" height="26" fill="#7a5632"/><ellipse cx="240" cy="206" rx="56" ry="10" fill="#5a3a20"/><circle cx="240" cy="176" r="34" fill="#3a6a30"/><circle cx="216" cy="188" r="20" fill="#2e5a28"/><circle cx="264" cy="186" r="22" fill="#2a5226"/>` + '</g>');
  // the timber hatch beside the shrub, once the text has named it; open, it shows the dark barrel-shaft
  const hOpen = /timber lid stands open/i.test(h.desc) || (h.st && h.st.known && h.st.open('timber hatch', false));
  if (hOpen || /timber hatch/i.test(h.desc)) h.add(h.open('timber hatch') + (hOpen
    ? `<ellipse cx="96" cy="238" rx="40" ry="11" fill="#2a2016" stroke="#3a2414" stroke-width="2.5"/><ellipse cx="96" cy="239" rx="32" ry="7.5" fill="#030201"/><path d="M58,214 L62,236 L132,236 L136,214Z" fill="#7a5630" stroke="#3a2414" stroke-width="2"/>${[76, 96, 116].map(x => `<line x1="${x}" y1="215" x2="${x}" y2="235" stroke="#4a3018" stroke-width="1.5"/>`).join('')}`
    : `<ellipse cx="96" cy="238" rx="40" ry="11" fill="#7a5630" stroke="#3a2414" stroke-width="2.5"/>${[-24, -8, 8, 24].map(x => `<line x1="${96 + x}" y1="${228 + Math.abs(x) / 5}" x2="${96 + x}" y2="${248 - Math.abs(x) / 5}" stroke="#4a3018" stroke-width="1.5"/>`).join('')}<rect x="90" y="235" width="12" height="5" fill="#5a5a5a"/>`) + '</g>');
} };

B['Up the Beanstalk'] = { cat: 'heights', draw(h) {
  // at the top of the beanstalk, amongst the clouds; the clouds stretch away north
  sky(h, '#6a9ad0', '#e8f0f8');
  for (let i = 0; i < 14; i++) h.add(`<ellipse cx="${h.R(0, 400)}" cy="${h.R(120, 260)}" rx="${h.R(60, 120)}" ry="${h.R(16, 30)}" fill="#ffffff" opacity="${h.R(.75, .95).toFixed(2)}"/>`);
  h.add(h.open('beanstalk') + `<path d="M200,260 C180,220 230,190 205,150 C190,120 215,100 210,80" stroke="#2e6a2a" stroke-width="16" fill="none"/>${[0, 1, 2, 3, 4].map(i => `<ellipse cx="${200 + (i % 2 ? 26 : -24)}" cy="${226 - i * 32}" rx="18" ry="8" fill="#3a8a3a" transform="rotate(${i % 2 ? -30 : 30} ${200 + (i % 2 ? 26 : -24)} ${226 - i * 32})"/>`).join('')}` + '</g>');
} };

B['Tree Planting'] = { cat: 'garden', draw(h) {
  // long ago: Capability Meldrew and his workmen delicately planting a sapling plane tree
  sky(h, '#90b8d8', '#e8ecdc'); clouds(h, 4, 10, 60);
  h.add(`<path d="M0,170 Q200,160 400,172 L400,260 L0,260Z" fill="#7a9a5a"/>`);
  h.add(h.open('sapling') + `<ellipse cx="200" cy="226" rx="36" ry="9" fill="#4a3424"/><line x1="200" y1="226" x2="200" y2="150" stroke="#6a5a48" stroke-width="4"/><circle cx="200" cy="140" r="18" fill="#4a8a42"/><circle cx="188" cy="150" r="10" fill="#3a7a3a"/><circle cx="212" cy="148" r="11" fill="#3a7a3a"/>` + '</g>');
  const man = (x, s, col, hat) => `<g transform="translate(${x} 228) scale(${s})"><rect x="-6" y="-22" width="5" height="22" fill="#4a3a2a"/><rect x="1" y="-22" width="5" height="22" fill="#4a3a2a"/><rect x="-9" y="-50" width="18" height="30" fill="${col}"/><circle cx="0" cy="-58" r="7" fill="#e0b896"/>${hat}</g>`;
  h.add(h.tag('workmen', man(130, 1, '#8a6a40', '<rect x="-8" y="-68" width="16" height="5" fill="#5a4a30"/>') + man(270, 1, '#7a7458', '<rect x="-8" y="-68" width="16" height="5" fill="#5a4a30"/>') + `<line x1="282" y1="196" x2="262" y2="230" stroke="#6a4a2a" stroke-width="3"/><rect x="254" y="226" width="12" height="8" fill="#9aa0a8"/>`));
  h.add(h.tag('Capability Meldrew', man(330, 1.1, '#2a3a5a', '<path d="M-10,-64 L0,-74 L10,-64Z" fill="#1a1a1e"/>') + `<line x1="340" y1="180" x2="318" y2="170" stroke="#e8e0c8" stroke-width="2"/>`));
} };


B['Maze Foundations'] = { cat: 'garden', draw(h) {
  // long ago, before the maze was grown: a grid of grass plots and seedbeds; fences and beds as the text says
  const d = (h.desc || '').toLowerCase();
  const side = w => new RegExp('(fence|fences)[^.]*\\b' + w).test(d) || new RegExp('fences to (\\w+ and )?' + w).test(d);
  const bed = w => new RegExp('seedbeds? to the (\\w+ and )?' + w).test(d);
  sky(h, '#90b8d8', '#e8ecdc'); clouds(h, 4, 10, 60);
  h.add(`<path d="M0,120 Q200,112 400,122 L400,260 L0,260Z" fill="#7a9a5a"/>`);
  // a grid of plots receding
  for (let r = 0; r < 4; r++) for (let c = -2; c <= 2; c++) { const y0 = 122 + r * r * 9, y1 = 122 + (r + 1) * (r + 1) * 9, s0 = .25 + r * .25, s1 = .25 + (r + 1) * .25; const x = (k, s) => 200 + k * 90 * s; const seed = (r * 7 + c * 3) % 3 === 0; h.add(`<polygon points="${x(c - .5, s0)},${y0} ${x(c + .5, s0)},${y0} ${x(c + .5, s1)},${y1} ${x(c - .5, s1)},${y1}" fill="${seed ? '#6a4a30' : ['#86a862', '#7a9c58'][(r + c + 9) % 2]}" stroke="#5a7a40" stroke-width=".8"/>`); }
  // where you stand: grass or a freshly planted bed
  const onBed = /standing on a bed/.test(d);
  h.add(`<polygon points="110,230 290,230 340,260 60,260" fill="${onBed ? '#5a3e28' : '#8aac66'}"/>${onBed ? Array.from({ length: 8 }, (_, i) => `<line x1="${90 + i * 30}" y1="244" x2="${100 + i * 30}" y2="244" stroke="#3a2818" stroke-width="2"/>`).join('') : ''}`);
  if (bed('north')) h.add(`<polygon points="150,190 250,190 270,226 130,226" fill="#5a3e28"/>`);
  if (bed('east')) h.add(`<polygon points="300,200 400,196 400,250 330,240" fill="#5a3e28"/>`);
  if (bed('west')) h.add(`<polygon points="0,196 100,200 70,240 0,250" fill="#5a3e28"/>`);
  if (bed('south')) h.add(`<rect x="100" y="250" width="200" height="10" fill="#5a3e28"/>`);
  // wooden fences
  const fence = (x0, y0, x1, y1) => { let s = `<line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}" stroke="#8a6a44" stroke-width="3"/><line x1="${x0}" y1="${y0 + 10}" x2="${x1}" y2="${y1 + 10}" stroke="#8a6a44" stroke-width="3"/>`; for (let k = 0; k <= 6; k++) { const x = x0 + (x1 - x0) * k / 6, y = y0 + (y1 - y0) * k / 6; s += `<rect x="${x - 2}" y="${y - 6}" width="4" height="24" fill="#7a5a36"/>`; } return s; };
  if (side('north')) h.add(h.tag('fence', fence(80, 170, 320, 170)));
  if (side('east')) h.add(h.tag('fence', fence(320, 160, 396, 236)));
  if (side('west')) h.add(h.tag('fence', fence(80, 160, 4, 236)));
  // the uncouth rustics are at work to the south, behind you: out of sight
} };

})(typeof window !== 'undefined' ? window : this);

// the end of the game: the curse is lifted, and the family drives off to the airport
(function (root) {
'use strict';
const B = (root.ZBespoke || require('./bespoke.js')).BESPOKE;
B['House'] = { cat: 'garden', draw(h) {
  const { add, lin } = h;
  add(`<rect width="400" height="260" fill="${lin('sk', [[0, '#7aa6d0'], [1, '#f4dcb0']])}"/>`);
  h.glow(320, 70, 120, '#fff0c0', .7); add(`<circle cx="320" cy="70" r="16" fill="#fff6d8"/>`);
  for (const [x, y, w] of [[60, 40, 60], [180, 28, 46], [260, 54, 38]]) add(`<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${w * .18}" fill="#fff" opacity=".7"/>`);
  h.ridge(150, 8, '#8aa88a', 6);
  // Meldrew Hall on its hill, battlements and all
  add(`<rect x="40" y="70" width="170" height="86" fill="#8a7a6a"/>${Array.from({ length: 9 }, (_, i) => `<rect x="${40 + i * 20}" y="60" width="12" height="11" fill="#8a7a6a"/>`).join('')}<rect x="104" y="40" width="36" height="32" fill="#7a6a5a"/>${[96, 104, 112, 120, 128].map(x => `<rect x="${x + 4}" y="32" width="5" height="9" fill="#7a6a5a"/>`).join('')}`);
  for (const x of [56, 86, 150, 180]) add(`<rect x="${x}" y="92" width="12" height="18" fill="#3a3a4a"/>`);
  add(`<rect x="116" y="124" width="18" height="32" fill="#4a2e18"/>`);
  add(`<path d="M0,260 L0,160 Q120,150 220,158 Q320,164 400,152 L400,260Z" fill="${lin('gr', [[0, '#6a9a4a'], [1, '#3e6a2c']])}"/>`);
  for (const [x, s] of [[24, 46], [230, 40], [372, 54]]) h.tree(x, 166, s, '#3e6a36');
  // the gravel drive, and the car on its way out
  add(`<path d="M126,158 Q170,190 250,214 Q330,236 400,240 L400,260 L330,260 Q260,240 210,220 Q150,196 116,158Z" fill="#c8b88e"/>`);
  add(`<g transform="translate(322 236) scale(.62)"><path d="M-60,-10 q0,-20 20,-22 l14,-20 h50 l18,20 q18,2 18,22 v10 h-120z" fill="#5a2a2a"/><rect x="-28" y="-48" width="22" height="16" fill="#a8c0d0"/><rect x="2" y="-48" width="22" height="16" fill="#a8c0d0"/><circle cx="-34" cy="0" r="11" fill="#1a1a1a"/><circle cx="40" cy="0" r="11" fill="#1a1a1a"/><rect x="-40" y="-66" width="70" height="12" rx="3" fill="#8a6a3a"/></g>`);
  add(`<path d="M290,238 q-12,-2 -22,4 M296,244 q-14,0 -24,6" stroke="#e8dcc0" stroke-width="2" fill="none" opacity=".7"/>`);
} };
})(typeof window !== 'undefined' ? window : this);
