// Hand-composed illustrations for individual rooms (original artwork, drawn from the room descriptions).
(function (root) {
'use strict';
const B = {};

// ---------- shared attic toolkit ----------
function attic(h, o) {
  o = o || {};
  const { add, lin, W, H } = h;
  const L = o.left ?? 90, Rr = o.right ?? 310, T = o.top ?? 78, F = o.floor ?? 196;
  const wall = o.wall || ['#5a4430', '#3a2b1e'];
  add(`<rect width="${W}" height="${H}" fill="#140e09"/>`);
  // ceiling (sloped) and rafters
  add(`<polygon points="0,0 ${W},0 ${Rr},${T} ${L},${T}" fill="${lin('ceil', [[0, '#1c140d'], [1, '#2e2216']])}"/>`);
  for (let i = 0; i <= 6; i++) { const t = i / 6; add(`<line x1="${t * W}" y1="0" x2="${L + t * (Rr - L)}" y2="${T}" stroke="#3a2a1b" stroke-width="${5 - Math.abs(t - .5) * 4}"/>`); }
  // side slopes
  add(`<polygon points="0,0 ${L},${T} ${L},${F} 0,${H}" fill="${lin('lw', [[0, '#21170f'], [1, '#2f2217']], 1, 0)}"/>`);
  add(`<polygon points="${W},0 ${Rr},${T} ${Rr},${F} ${W},${H}" fill="${lin('rw', [[0, '#2c2015'], [1, '#1d150e']], 1, 0)}"/>`);
  // back wall planks
  add(`<rect x="${L}" y="${T}" width="${Rr - L}" height="${F - T}" fill="${lin('bw', [[0, wall[0]], [1, wall[1]]])}"/>`);
  for (let x = L + 14; x < Rr; x += 14 + (x % 5)) add(`<line x1="${x}" y1="${T}" x2="${x}" y2="${F}" stroke="#000" opacity=".18"/>`);
  // low beams across
  if (o.beams !== false) {
    add(`<polygon points="0,${T * .55} ${W},${T * .55} ${W},${T * .55 + 12} 0,${T * .55 + 12}" fill="#2a1c11"/><line x1="0" y1="${T * .55 + 12}" x2="${W}" y2="${T * .55 + 12}" stroke="#0e0905" stroke-width="2"/>`);
  }
  // floor with boards converging
  add(`<polygon points="${L},${F} ${Rr},${F} ${W},${H} 0,${H}" fill="${lin('fl', [[0, '#3b2b1d'], [1, '#5a412b']])}"/>`);
  const cx = (L + Rr) / 2;
  for (let i = -8; i <= 8; i++) add(`<line x1="${cx + i * (Rr - L) / 16}" y1="${F}" x2="${cx + i * W / 13}" y2="${H}" stroke="#24180e" stroke-width="1"/>`);
  for (let k = 1; k < 4; k++) { const y = F + (H - F) * (k / 4) ** 1.3; add(`<line x1="${(L) * (1 - (y - F) / (H - F))}" y1="${y}" x2="${Rr + (W - Rr) * ((y - F) / (H - F))}" y2="${y}" stroke="#24180e" opacity=".35"/>`); }
  return { L, R: Rr, T, F, cx };
}
function torch(h, x, y, rr, op) { h.glow(x, y, rr, '#ffe2a6', op ?? .22); }
function dust(h, n, x0, x1, y0, y1, col) { for (let i = 0; i < n; i++) h.add(`<circle cx="${h.R(x0, x1).toFixed(1)}" cy="${h.R(y0, y1).toFixed(1)}" r="${h.R(.4, 1.3).toFixed(2)}" fill="${col || '#f2e2b0'}" opacity="${h.R(.12, .45).toFixed(2)}"/>`); }
function crate(h, x, y, w, ht, c) {
  c = c || '#6b4a2c';
  h.add(`<rect x="${x}" y="${y - ht}" width="${w}" height="${ht}" fill="${c}" stroke="#20140a" stroke-width="1.4"/><polygon points="${x},${y - ht} ${x + 9},${y - ht - 7} ${x + w + 9},${y - ht - 7} ${x + w},${y - ht}" fill="#8a6640" stroke="#20140a"/><polygon points="${x + w},${y - ht} ${x + w + 9},${y - ht - 7} ${x + w + 9},${y - 7} ${x + w},${y}" fill="#4a321c" stroke="#20140a"/><line x1="${x}" y1="${y - ht / 2}" x2="${x + w}" y2="${y - ht / 2}" stroke="#3a2616"/>`);
}
function doorway(h, x, y, w, ht, glowCol) {
  h.add(`<rect x="${x - 3}" y="${y - ht - 3}" width="${w + 6}" height="${ht + 3}" fill="#2a1b10"/><rect x="${x}" y="${y - ht}" width="${w}" height="${ht}" fill="#080503"/>`);
  if (glowCol) h.add(`<rect x="${x}" y="${y - ht}" width="${w}" height="${ht}" fill="${glowCol}" opacity=".25"/>`);
}
function sideOpening(h, side, a) {
  // dark passage opening in the left/right sloped wall
  const { L, R, T, F } = a;
  if (side === 'left') h.add(`<polygon points="${L - 10},${F - 70} ${L - 10},${F} ${L - 55},${F + 25} ${L - 55},${F - 50}" fill="#060403"/>`);
  else h.add(`<polygon points="${R + 10},${F - 70} ${R + 10},${F} ${R + 55},${F + 25} ${R + 55},${F - 50}" fill="#060403"/>`);
}
function stepsDown(h, x, y, n, dir, w) {
  // descending steps seen from above; dir -1 = towards left, 1 = right
  w = w || 70;
  for (let i = 0; i < n; i++) {
    const sx = x + dir * i * 14, sy = y + i * 9;
    h.add(`<polygon points="${sx},${sy} ${sx + w},${sy} ${sx + w + dir * 6},${sy + 9} ${sx + dir * 6},${sy + 9}" fill="${i % 2 ? '#4a3420' : '#563d26'}" stroke="#1c1209" stroke-width=".8"/>`);
  }
  h.add(`<polygon points="${x + dir * n * 14},${y + n * 9} ${x + dir * n * 14 + w},${y + n * 9} ${x + dir * n * 14 + w},${y + n * 9 + 30} ${x + dir * n * 14},${y + n * 9 + 30}" fill="#070403"/>`);
}
function stepsUp(h, x, y, n, w, dir) {
  dir = dir || 1;
  for (let i = 0; i < n; i++) h.add(`<rect x="${x + dir * i * 6}" y="${y - (i + 1) * 11}" width="${w - i * 4}" height="11" fill="${i % 2 ? '#5a4128' : '#4d3720'}" stroke="#1c1209" stroke-width=".8"/>`);
}

// ---------- rooms ----------
B['Attic'] = { cat: 'attic', draw(h) {
  const a = attic(h, {});
  doorway(h, h.R(150, 170), a.F, 36, 70); // north into the gloom
  sideOpening(h, 'left', a); sideOpening(h, 'right', a);
  // trapdoor: open hatch with lid swung up, light streaming up
  const tx = 175, ty = 228;
h.add(h.open('trapdoor'));   if (h.st.open('trapdoor')) {
    h.add(`<polygon points="${tx},${ty} ${tx + 64},${ty} ${tx + 74},${ty + 20} ${tx - 8},${ty + 20}" fill="#ffe7a8"/>`);
    h.add(`<polygon points="${tx},${ty} ${tx + 64},${ty} ${tx + 52},${ty - 54} ${tx + 6},${ty - 56}" fill="#5a3f26" stroke="#1d1209" stroke-width="1.5"/><line x1="${tx + 10}" y1="${ty - 40}" x2="${tx + 55}" y2="${ty - 40}" stroke="#3a2616" stroke-width="2"/><line x1="${tx + 6}" y1="${ty - 20}" x2="${tx + 60}" y2="${ty - 20}" stroke="#3a2616" stroke-width="2"/>`);
    h.add(`<polygon points="${tx - 8},${ty + 20} ${tx + 74},${ty + 20} ${tx + 120},0 ${tx - 60},0" fill="${h.lin('beam', [[0, '#ffe7a8', .05], [1, '#ffe7a8', .35]])}"/>`);
    dust(h, 50, tx - 40, tx + 110, 10, ty, '#fff1c8');
  } else {
    // closed: a flat hatch in the floor, a thin line of light around it, the room is much darker
    h.add(`<polygon points="${tx},${ty} ${tx + 64},${ty} ${tx + 74},${ty + 20} ${tx - 8},${ty + 20}" fill="#4e3722" stroke="#f6e0a0" stroke-width="1" stroke-opacity=".5"/><line x1="${tx + 2}" y1="${ty + 7}" x2="${tx + 66}" y2="${ty + 7}" stroke="#2a1a0c" stroke-width="2"/><line x1="${tx - 3}" y1="${ty + 14}" x2="${tx + 70}" y2="${ty + 14}" stroke="#2a1a0c" stroke-width="2"/><circle cx="${tx + 33}" cy="${ty + 10}" r="2.5" fill="none" stroke="#8a7050" stroke-width="1.5"/>`);
    h.add(`<rect width="400" height="260" fill="#000" opacity=".28"/>`);
    dust(h, 14, tx - 20, tx + 90, 60, ty);
  } h.add('</g>');
  // the antique jewellery box, only visible once the trapdoor no longer hides it
  if (h.st.known && h.st.here('jewellery box')) {
    const jx = tx + 92, jy = ty + 6;
    h.glow(jx + 12, jy - 6, 34, '#ffe08a', .5);
    h.add(`<rect x="${jx}" y="${jy - 14}" width="26" height="14" rx="2" fill="#7a2a3a" stroke="#c8a040" stroke-width="1.5"/><path d="M${jx},${jy - 14} q13,-10 26,0" fill="#8a3446" stroke="#c8a040" stroke-width="1.5"/><rect x="${jx + 11}" y="${jy - 10}" width="4" height="5" fill="#e8c860"/>${[0, 1, 2].map(i => `<path d="M${jx + 4 + i * 9},${jy - 20} l2,-4 l2,4 l-2,4z" fill="#fff8d0" opacity=".9"/>`).join('')}`);
  }
  // heavy teachests
h.add(h.open('teachests'));   crate(h, 40, 236, 54, 40, '#6e4c2b'); crate(h, 70, 206, 40, 30, '#7a5532'); h.add('</g>'); h.contents('teachest', 42, 210, 16, 13, 3); h.add(h.open('teachests') + '');
  crate(h, 300, 240, 58, 44, '#664527'); crate(h, 318, 200, 40, 30, '#6d4a2a'); h.add('</g>');
  if (!h.st.open('trapdoor')) torch(h, 200, 170, 160, .12);
} };

B['Old Winery'] = { cat: 'attic', draw(h) {
  const a = attic(h, { left: 110, right: 300, top: 92, floor: 190, wall: ['#55402c', '#36281b'] });
  // steps down to the west with a strong banister
  stepsDown(h, 6, 200, 5, -1, 92);
  h.add(`<path d="M120,150 L18,214" stroke="#8a5e34" stroke-width="7" stroke-linecap="round"/>`);
  for (let i = 0; i < 6; i++) { const x = 116 - i * 19, y = 152 + i * 12; h.add(`<line x1="${x}" y1="${y}" x2="${x}" y2="${y + 34}" stroke="#6a4626" stroke-width="3"/>`); }
  // banister continues east along the passage
  sideOpening(h, 'right', a);
  h.add(`<path d="M300,150 L392,168" stroke="#8a5e34" stroke-width="6" stroke-linecap="round"/>`);
  for (let i = 0; i < 5; i++) { const x = 304 + i * 20, y = 151 + i * 4; h.add(`<line x1="${x}" y1="${y}" x2="${x}" y2="${y + 40}" stroke="#6a4626" stroke-width="3"/>`); }
  // the labelled glass demijohn, with a red battery and a folded map inside
  const dx = 205, dy = 238;
  if (h.st.here('demijohn')) {
  h.add(h.open('demijohn'));
  h.add(`<ellipse cx="${dx}" cy="${dy}" rx="40" ry="7" fill="#000" opacity=".4"/>`);
  h.add(`<path d="M${dx - 34},${dy - 4} C${dx - 44},${dy - 50} ${dx - 22},${dy - 74} ${dx - 9},${dy - 78} L${dx - 8},${dy - 96} L${dx + 8},${dy - 96} L${dx + 9},${dy - 78} C${dx + 22},${dy - 74} ${dx + 44},${dy - 50} ${dx + 34},${dy - 4} Z" fill="#8fb39a" opacity=".38" stroke="#c8e0d0" stroke-width="1.5"/>`);
  h.add(`<rect x="${dx - 10}" y="${dy - 100}" width="20" height="7" rx="2" fill="#6a4a2a"/>`);
  if (h.st.here('red battery')) h.add(h.tag('red battery', `<rect x="${dx - 22}" y="${dy - 28}" width="14" height="22" rx="2" fill="#b02a22"/><rect x="${dx - 19}" y="${dy - 32}" width="8" height="4" fill="#5a1a14"/>`));
  if (h.st.here('tourist map')) h.add(h.tag('tourist map', `<polygon points="${dx - 2},${dy - 6} ${dx + 26},${dy - 10} ${dx + 22},${dy - 26} ${dx - 4},${dy - 22}" fill="#e8dcb0"/><line x1="${dx + 10}" y1="${dy - 8}" x2="${dx + 9}" y2="${dy - 24}" stroke="#b0a070"/><path d="M${dx + 2},${dy - 14} l6,-3 l6,4 l6,-3" stroke="#6a8aa0" fill="none"/>`));
  h.add(`<rect x="${dx - 16}" y="${dy - 62}" width="32" height="16" fill="#ece0bc" stroke="#8a7040"/><path d="M${dx - 11},${dy - 54} h22 M${dx - 11},${dy - 50} h14" stroke="#7a5a2a" stroke-width="1"/>`);
  h.add(`<path d="M${dx - 24},${dy - 60} q-4,20 0,40" stroke="#fff" opacity=".35" stroke-width="2" fill="none"/>`);
  h.add('</g>');
  }
  // the crack in the floorboards, where the key vanished
  h.add(`<path d="M120,246 L160,243 L172,248 L230,244 L250,250 L300,247" stroke="#050302" stroke-width="2.4" fill="none"/>`);
  torch(h, 205, 190, 150, .2);
} };

B['Old Furniture'] = { cat: 'attic', draw(h) {
  const a = attic(h, { wall: ['#4e3b2a', '#30231a'] });
  sideOpening(h, 'right', a);
  // badly scratched cupboard against the back wall: the game gives it no doors, only shelves
  h.add(h.open('scratched cupboard') + `<rect x="209" y="92" width="82" height="112" fill="#6a4628" stroke="#24160b" stroke-width="2"/><rect x="217" y="100" width="66" height="102" fill="#1c120a"/><rect x="217" y="146" width="66" height="4" fill="#4a3018"/>`);
  for (let i = 0; i < 9; i++) { const side = i % 3, x = side === 0 ? h.R(210, 216) : side === 1 ? h.R(284, 290) : h.R(214, 286), y = side === 2 ? h.R(93, 99) : h.R(100, 200); h.add(`<line x1="${x}" y1="${y}" x2="${x + h.R(-3, 3)}" y2="${y + (side === 2 ? h.R(-1, 1) : h.R(-8, 8))}" stroke="#c8a878" stroke-width=".8" opacity=".7"/>`); }
  h.add('</g>');
  if (h.st.here('parcel')) h.add(h.tag('parcel', `<rect x="224" y="124" width="26" height="22" fill="#c83a4a"/><rect x="235" y="124" width="4" height="22" fill="#e8c040"/><rect x="224" y="133" width="26" height="4" fill="#e8c040"/><path d="M237,124 q-6,-8 -10,-2 M237,124 q6,-8 10,-2" stroke="#e8c040" stroke-width="2" fill="none"/>`));
  if (h.st.here('whistle')) h.add(h.tag('whistle', `<path d="M258,140 h16 a5,5 0 0 1 0,8 h-16z" fill="#c8b8a0"/><circle cx="256" cy="144" r="3" fill="#a89880"/>`));
  if (h.st.here('red tablet')) h.add(h.tag('red tablet', `<circle cx="262" cy="190" r="3.5" fill="#d02a2a"/>`));
  if (h.st.here('medicine bottle')) h.add(h.tag('medicine bottle', `<rect x="238" y="170" width="20" height="30" rx="4" fill="#7a4a1e" stroke="#3a2008"/><rect x="241" y="174" width="5" height="20" rx="2" fill="#c89a5a" opacity=".5"/><rect x="241" y="164" width="14" height="8" rx="2" fill="#f0ece0" stroke="#a8a090"/><path d="M243,166 h10 M243,169 h10" stroke="#b8b0a0" stroke-width=".8"/><rect x="240" y="180" width="16" height="10" fill="#efe6cc"/><path d="M243,184 h10 M243,187 h7" stroke="#8a7a5a" stroke-width=".8"/>`));
  // armchair with springs coming out
  const ax = 70, ay = 240;
  h.add(`<path d="M${ax},${ay} L${ax},${ay - 42} Q${ax},${ay - 92} ${ax + 40},${ay - 92} Q${ax + 80},${ay - 92} ${ax + 80},${ay - 42} L${ax + 80},${ay}Z" fill="#6a2e2a"/><rect x="${ax - 14}" y="${ay - 52}" width="22" height="52" rx="8" fill="#7a3632"/><rect x="${ax + 72}" y="${ay - 52}" width="22" height="52" rx="8" fill="#7a3632"/><rect x="${ax + 4}" y="${ay - 40}" width="72" height="22" rx="6" fill="#813a35"/>`);
  for (let i = 0; i < 3; i++) { const sx = ax + 20 + i * 18; h.add(`<path d="M${sx},${ay - 38} q-5,-4 0,-8 q5,-4 0,-8 q-5,-4 0,-8" stroke="#b8b0a0" stroke-width="1.6" fill="none"/>`); }
  // umbrella stand with umbrellas
  h.add(`<rect x="182" y="210" width="24" height="34" fill="#4a5a52" stroke="#1d2420"/><ellipse cx="194" cy="210" rx="12" ry="4" fill="#33403a"/><path d="M188,210 L180,150 q-2,-8 4,-8" stroke="#222" stroke-width="2.5" fill="none"/><path d="M198,210 L206,160 q2,-8 -4,-10" stroke="#3a2416" stroke-width="2.5" fill="none"/>`);
  h.add(`<rect x="152" y="216" width="20" height="28" fill="#6a5a3a" stroke="#2a2010"/><ellipse cx="162" cy="216" rx="10" ry="3.5" fill="#4a3e28"/>`);
  // table with one leg missing, tilted
  h.add(`<g transform="rotate(-9 330 200)"><rect x="280" y="196" width="104" height="9" fill="#7a5632" stroke="#2a1a0c"/><rect x="286" y="205" width="7" height="44" fill="#5a3c20"/><rect x="371" y="205" width="7" height="44" fill="#5a3c20"/><rect x="306" y="205" width="7" height="34" fill="#4a3018"/></g>`);
  h.add(`<rect x="360" y="232" width="7" height="22" fill="#5a3c20" transform="rotate(70 363 243)"/>`);
  dust(h, 30, 30, 380, 60, 220);
  torch(h, 200, 170, 160, .18);
} };

B["Servant's Room"] = { cat: 'interior', draw(h) {
  const { add, lin } = h;
  // cramped, windowless, warm and stuffy
  add(`<rect width="400" height="260" fill="#2a1a10"/>`);
  add(`<polygon points="0,0 400,0 330,60 70,60" fill="#20140b"/><polygon points="0,0 70,60 70,200 0,260" fill="#2e1d11"/><polygon points="400,0 330,60 330,200 400,260" fill="#2a1a0f"/>`);
  add(`<rect x="70" y="60" width="260" height="140" fill="${lin('w', [[0, '#6a4a2e'], [1, '#4a321e']])}"/>`);
  for (let x = 80; x < 330; x += 18) add(`<line x1="${x}" y1="60" x2="${x}" y2="200" stroke="#000" opacity=".1"/>`);
  add(`<polygon points="70,200 330,200 400,260 0,260" fill="#4a3220"/>`);
  // the only doorway, to the west (left wall)
  add(`<polygon points="14,70 52,88 52,208 14,232" fill="#070403"/><polygon points="10,66 56,85 56,90 10,72" fill="#3a2614"/>`);
  // the old striped scarf hanging behind the doorway
  add(`<rect x="56" y="96" width="4" height="6" fill="#222"/>`);
  if (h.st.here('scarf')) for (let i = 0; i < 7; i++) add(`<rect x="57" y="${102 + i * 9}" width="10" height="9" fill="${['#a8322a', '#e8d8b0', '#2a4a7a'][i % 3]}"/>`);
  if (h.st.here('scarf')) add(h.tag('scarf', `<path d="M52,160 q10,-3 20,0 v3 q-10,-3 -20,0z" fill="#2a4ab0"/>${[['#2a4ab0', 0], ['#2a8a5a', 1], ['#4a4a52', 2], ['#c8282a', 3]].map(([c, i]) => `<rect x="56" y="${163 + i * 3}" width="5" height="3" fill="${c}"/>`).join('')}`));
  // reached by the servants' staircase, a tight door stands open in the northern wall (it never closes)
  if (/tight door stands open/i.test(h.desc) || (h.st.known && h.st.here('tight door'))) add(h.open('tight door') + `<rect x="232" y="88" width="40" height="106" fill="#0a0604"/><polygon points="232,88 220,84 220,200 232,194" fill="#5a3a20" stroke="#2a180c" stroke-width="1.5"/>${[0, 1, 2, 3].map(k => `<rect x="${238 + k * 7}" y="${180 - k * 18}" width="28" height="4" fill="#2a1a10" opacity="${.7 - k * .12}"/>`).join('')}</g>`);
  // the bed
h.add(h.open('bed'));   add(`<rect x="130" y="150" width="190" height="50" fill="#e4d6b8"/><rect x="130" y="150" width="190" height="16" fill="#d0c0a0"/><rect x="128" y="128" width="10" height="92" fill="#5a3a20"/><rect x="314" y="140" width="10" height="80" fill="#5a3a20"/><rect x="128" y="196" width="196" height="16" fill="#6a4628"/><ellipse cx="160" cy="146" rx="22" ry="10" fill="#f0e8d4"/>`);
  add(`<path d="M180,166 Q240,150 314,166 L314,198 L180,198Z" fill="#8a5a6a"/><path d="M190,176 h110 M190,186 h110" stroke="#6a3a4a" stroke-width="1"/>`); h.add('</g>');
  // tiny bedside table with a little book
h.add(h.open('table'));   add(`<rect x="88" y="170" width="34" height="5" fill="#7a5530"/><rect x="92" y="175" width="4" height="40" fill="#5a3a20"/><rect x="114" y="175" width="4" height="40" fill="#5a3a20"/>`); h.add('</g>');
  if (h.st.here('dictionary')) add(h.tag('dictionary', `<rect x="96" y="163" width="20" height="7" fill="#2a5a3a"/><rect x="96" y="163" width="20" height="2" fill="#e8dcc0"/>`));
  // a candle-free, warm drowsy haze
  h.glow(220, 150, 220, '#ffb070', .16);
  add(`<rect width="400" height="260" fill="#ff9a4a" opacity=".05"/>`);
  dust(h, 30, 80, 330, 60, 200, '#ffd8a0');
  add(`<text x="300" y="110" font-family="Georgia,serif" font-style="italic" font-size="16" fill="#f4e4c0" opacity=".25">z</text><text x="312" y="96" font-family="Georgia,serif" font-style="italic" font-size="12" fill="#f4e4c0" opacity=".2">z</text>`);
} };

B['Storage Room'] = { cat: 'attic', draw(h) {
  const a = attic(h, { wall: ['#4c4034', '#2e271f'] });
  // opening onto the dark shaft, with the dumbwaiter inside
  h.add(`<rect x="110" y="96" width="78" height="100" fill="#040302" stroke="#2a2016" stroke-width="5"/>`);
  h.add(`<line x1="138" y1="96" x2="138" y2="${h.st.here('dumbwaiter') ? 134 : 196}" stroke="#8a7a60" stroke-width="1.2"/><line x1="160" y1="96" x2="160" y2="${h.st.here('dumbwaiter') ? 134 : 196}" stroke="#8a7a60" stroke-width="1.2"/>`);
  if (h.st.here('dumbwaiter')) h.add(h.tag('dumbwaiter', `<rect x="122" y="134" width="54" height="44" fill="#4a3420" stroke="#1a1008" stroke-width="1.5"/><line x1="122" y1="156" x2="176" y2="156" stroke="#2a1a0c" stroke-width="2"/><rect x="122" y="134" width="54" height="5" fill="#5e4428"/>`));
  // big Victorian steam-engine style wheel with a handle
h.add(h.open('wheel'));   const wx = 248, wy = 140, wr = 38;
  h.add(`<circle cx="${wx}" cy="${wy}" r="${wr}" fill="none" stroke="#3a3a3a" stroke-width="7"/><circle cx="${wx}" cy="${wy}" r="${wr}" fill="none" stroke="#6a6a60" stroke-width="2"/>`);
  for (let i = 0; i < 6; i++) { const ang = i * Math.PI / 3; h.add(`<line x1="${wx}" y1="${wy}" x2="${wx + Math.cos(ang) * wr}" y2="${wy + Math.sin(ang) * wr}" stroke="#3e3e3a" stroke-width="4"/>`); }
  h.add(`<circle cx="${wx}" cy="${wy}" r="8" fill="#5a5a52" stroke="#222"/><line x1="${wx + wr * .7}" y1="${wy - wr * .7}" x2="${wx + wr * .7 + 14}" y2="${wy - wr * .7 - 4}" stroke="#4a4a44" stroke-width="5"/><rect x="${wx + wr * .7 + 12}" y="${wy - wr * .7 - 14}" width="8" height="20" rx="3" fill="#7a4a2a"/>`);
  h.add(`<rect x="${wx - 6}" y="${wy}" width="12" height="${196 - wy}" fill="#3a3a36"/><rect x="${wx - 22}" y="188" width="44" height="8" fill="#2e2e2a"/>`);
  h.add(`<path d="M${wx - wr},${wy} L188,120" stroke="#8a7a60" stroke-width="1.2"/>`); h.add('</g>');
  // the dusty steel wrench in the corner
  if (h.st.here('wrench')) h.add(h.tag('wrench', `<g transform="rotate(-24 330 236)"><rect x="300" y="232" width="56" height="7" rx="3" fill="#9aa0a6"/><path d="M356,226 a10,10 0 1 1 0,19 l-4,-5 h-6 v-9 h6z" fill="#9aa0a6"/></g>`));
  dust(h, 18, 290, 380, 220, 252, '#c8c0b0');
  sideOpening(h, 'left', a);
  torch(h, 180, 160, 150, .2);
} };


// the antiquated wireless in its heavy cabinet on casters; valves glowing and notes rising once it plays
function wireless(h, x, y, w = 56) {
  const st = h.st, d = h.desc || '';
  if (st.known ? !st.here('wireless') : !/antiquated wireless/i.test(d)) return;
  const on = !st.known || st.isOn('wireless');
  const plays = on && /radio plays|wireless fills the air/i.test(d);
  const glow = plays || (on && (/glowing valves/i.test(d) || !!(st.known && st.isOn('wireless') && st.mentioned && st.mentioned('glowing'))));
  const k = w / 56, X = v => (x + v * k).toFixed(1), Y = v => (y + v * k).toFixed(1);
  h.add(h.tag('wireless', `<rect x="${X(0)}" y="${Y(-50)}" width="${(56 * k).toFixed(1)}" height="${(46 * k).toFixed(1)}" rx="${(4 * k).toFixed(1)}" fill="#3a2414" stroke="#1a0e06" stroke-width="1.5"/>
    <rect x="${X(5)}" y="${Y(-45)}" width="${(30 * k).toFixed(1)}" height="${(26 * k).toFixed(1)}" rx="${(2 * k).toFixed(1)}" fill="#c8b48a"/>${[0, 1, 2, 3, 4].map(i => `<line x1="${X(8 + i * 6)}" y1="${Y(-43)}" x2="${X(8 + i * 6)}" y2="${Y(-21)}" stroke="#6a5030" stroke-width="${(1.2 * k).toFixed(1)}"/>`).join('')}
    <rect x="${X(39)}" y="${Y(-45)}" width="${(12 * k).toFixed(1)}" height="${(9 * k).toFixed(1)}" fill="${glow ? '#ffb040' : '#4a3a28'}"/><circle cx="${X(42)}" cy="${Y(-26)}" r="${(3.5 * k).toFixed(1)}" fill="#c8a060"/><circle cx="${X(50)}" cy="${Y(-26)}" r="${(3.5 * k).toFixed(1)}" fill="#c8a060"/>
    <circle cx="${X(8)}" cy="${Y(-2)}" r="${(3 * k).toFixed(1)}" fill="#222"/><circle cx="${X(48)}" cy="${Y(-2)}" r="${(3 * k).toFixed(1)}" fill="#222"/>`));
  if (glow) h.glow(+X(45), +Y(-40), 18 * k, '#ffb040', .6);
  if (plays) h.add(`<g fill="#3a2a1a" opacity=".55">${[[20, -62], [34, -72], [48, -64]].map(([a, b], i) => `<path d="M${X(a)},${Y(b)} v${(-9 * k).toFixed(1)} l${(6 * k).toFixed(1)},${(-2 * k).toFixed(1)} v${(3 * k).toFixed(1)} l${(-5 * k).toFixed(1)},${(2 * k).toFixed(1)}"  stroke="#3a2a1a" stroke-width="1.2" fill="none"/><ellipse cx="${X(a - 1.5)}" cy="${Y(b)}" rx="${(2.4 * k).toFixed(1)}" ry="${(1.7 * k).toFixed(1)}"/>`).join('')}</g>`);
}

B["Aunt Jemima's Lair"] = { cat: 'interior', draw(h) {
  const { add, lin } = h;
  // former conservatory: glazed roof, lots of light
  add(`<rect width="400" height="260" fill="${lin('sky', [[0, '#b8d4e4'], [1, '#e8eee4']])}"/>`);
  for (let x = -40; x < 440; x += 40) add(`<line x1="${x}" y1="0" x2="${200 + (x - 200) * .5}" y2="80" stroke="#f4f4ee" stroke-width="3"/>`);
  add(`<line x1="0" y1="40" x2="400" y2="40" stroke="#f4f4ee" stroke-width="3"/><line x1="0" y1="80" x2="400" y2="80" stroke="#e8e8e0" stroke-width="4"/>`);
  add(`<rect y="80" width="400" height="120" fill="${lin('w', [[0, '#e4dcc8'], [1, '#c8bca0']])}"/><rect y="200" width="400" height="60" fill="#8a6a4a"/>`);
  for (let x = 0; x < 400; x += 30) add(`<line x1="${x}" y1="200" x2="${x - 20}" y2="260" stroke="#6a4a2e" opacity=".5"/>`);
  // home-made calendar of watercolours
  add(`<rect x="160" y="92" width="58" height="76" fill="#fbf7ee" stroke="#8a7a5a"/><rect x="165" y="97" width="48" height="34" fill="#a8c8d8"/><path d="M165,131 Q180,112 195,124 T213,118 L213,131Z" fill="#7aa86a"/><circle cx="203" cy="106" r="5" fill="#f4d080" opacity=".8"/>`);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) add(`<rect x="${166 + c * 8}" y="${137 + r * 7}" width="6" height="5" fill="none" stroke="#b0a080" stroke-width=".6"/>`);
  add(`<circle cx="189" cy="92" r="2" fill="#555"/>`);
  // easel with a painting, pottery, bric-a-brac
  add(`<line x1="250" y1="230" x2="272" y2="110" stroke="#7a5430" stroke-width="4"/><line x1="300" y1="230" x2="278" y2="110" stroke="#7a5430" stroke-width="4"/><line x1="275" y1="120" x2="275" y2="235" stroke="#6a4626" stroke-width="3"/><rect x="246" y="124" width="58" height="46" fill="#fbf7ee" stroke="#5a3a20" stroke-width="2"/><path d="M250,160 q12,-20 24,-6 q10,-14 26,2 v10 h-50z" fill="#d88a6a" opacity=".8"/><circle cx="290" cy="134" r="6" fill="#e8c050" opacity=".8"/>`);
  add(`<rect x="90" y="178" width="56" height="5" fill="#7a5a3a"/><path d="M96,178 q4,-16 10,0z" fill="#3a6a8a"/><circle cx="118" cy="172" r="6" fill="#c8a040"/><path d="M128,178 l6,-14 l6,14z" fill="#8a3a6a"/>`);
  // doorway to the southwest landing and narrow stair up to the east
  add(`<rect x="8" y="110" width="30" height="92" fill="#3a2a1c"/><rect x="11" y="113" width="24" height="89" fill="#1a120a"/>`);
  stepsUp(h, 318, 200, 7, 60, 1);
  add(`<rect x="358" y="80" width="40" height="44" fill="#1a120a"/>`);
  // the pots of daisies stand on the floor in front of doorway and stair
  const pots = [[30, '#b8683a'], [62, '#8a4a2a'], [340, '#c87a48'], [372, '#a85a32']];
  for (const [x, c] of pots) { add(`<path d="M${x - 11},205 L${x + 11},205 L${x + 8},228 L${x - 8},228Z" fill="${c}"/>`); for (let i = 0; i < 5; i++) add(`<ellipse cx="${x + h.R(-10, 10)}" cy="${h.R(176, 200)}" rx="${h.R(5, 10)}" ry="${h.R(3, 6)}" fill="${['#4a8a4a', '#3a7a40', '#5a9a52'][i % 3]}" transform="rotate(${h.R(-50, 50)} ${x} 196)"/>`); }
  // the wireless, if it has been pushed in here
  wireless(h, 150, 238, 58);
  h.glow(200, 40, 260, '#ffffff', .25);
} };

B['Over the East Wing'] = { cat: 'attic', draw(h) {
  const a = attic(h, { wall: ['#5c4632', '#3a2b1c'] });
  // the attic turns: dark gap to the right (east) and back-left (northwest)
  sideOpening(h, 'right', a);
  h.add(`<polygon points="${a.L},${a.T + 10} ${a.L + 40},${a.T + 10} ${a.L + 40},${a.F} ${a.L},${a.F}" fill="#070403"/>`);
  // tight doorway west
  h.add(`<polygon points="22,110 50,124 50,214 22,232" fill="#070403"/>`);
  // short flight of wooden steps down to the south (towards the viewer)
  h.add(`<polygon points="150,232 250,232 262,260 138,260" fill="#060302"/>`);
  for (let i = 0; i < 3; i++) h.add(`<rect x="${152 + i * 4}" y="${236 + i * 8}" width="${96 - i * 8}" height="6" fill="#5a3e24"/>`);
  // Austin, the ginger cat, lounging
  const cx = 230, cy = 205;
  if (h.st.here('austin')) { h.add(h.open('Austin'));
  h.add(`<ellipse cx="${cx}" cy="${cy + 6}" rx="40" ry="6" fill="#000" opacity=".35"/>`);
  h.add(`<ellipse cx="${cx}" cy="${cy - 6}" rx="36" ry="14" fill="#d8803a"/>`);
  h.add(`<path d="M${cx + 34},${cy - 4} q24,6 18,-16 q-2,-6 -6,-2 q4,10 -12,10" fill="#d8803a"/>`);
  h.add(`<circle cx="${cx - 34}" cy="${cy - 14}" r="13" fill="#e08a40"/><polygon points="${cx - 44},${cy - 22} ${cx - 42},${cy - 36} ${cx - 34},${cy - 25}" fill="#e08a40"/><polygon points="${cx - 30},${cy - 26} ${cx - 22},${cy - 36} ${cx - 23},${cy - 20}" fill="#e08a40"/>`);
  h.add(`<path d="M${cx - 41},${cy - 15} q3,2 6,0 M${cx - 31},${cy - 15} q3,2 6,0" stroke="#3a1a08" stroke-width="1.4" fill="none"/><circle cx="${cx - 34}" cy="${cy - 10}" r="1.5" fill="#8a3a2a"/>`);
  for (let i = 0; i < 4; i++) h.add(`<path d="M${cx - 10 + i * 12},${cy - 18} q4,6 0,12" stroke="#b05a20" stroke-width="2.4" fill="none"/>`);
  h.add(`<ellipse cx="${cx - 14}" cy="${cy + 4}" rx="10" ry="4" fill="#e8964a"/><ellipse cx="${cx + 14}" cy="${cy + 4}" rx="10" ry="4" fill="#e8964a"/>`);
  h.add('</g>'); }
  // dusty, warm, empty air
  h.add(`<rect width="400" height="260" fill="#e8b070" opacity=".06"/>`);
  dust(h, 90, 20, 380, 20, 240);
  torch(h, 220, 170, 170, .22);
} };

B['Airing Cupboard'] = { cat: 'interior', draw(h) {
  const { add, lin } = h;
  add(`<rect width="400" height="260" fill="${lin('w', [[0, '#d8ccb4'], [1, '#a89a80']])}"/>`);
  add(`<polygon points="0,0 70,40 70,210 0,260" fill="#9a8c74"/><polygon points="400,0 330,40 330,210 400,260" fill="#8a7c66"/><polygon points="70,210 330,210 400,260 0,260" fill="#7a6a54"/><rect x="70" y="0" width="260" height="40" fill="#b8aa90"/>`);
  // slatted drying racks
  for (let r = 0; r < 3; r++) {
    const y = 70 + r * 45;
    for (let s = 0; s < 4; s++) add(`<rect x="90" y="${y + s * 3}" width="220" height="2" fill="#7a5a36"/>`);
    // odd ceramic sculptures, almost-but-not-quite mugs
    for (let k = 0; k < 5; k++) {
      const x = 104 + k * 42 + h.R(-6, 6), c = ['#5a8aa8', '#c86a4a', '#e8d070', '#7aa86a', '#a86ab0'][h.RI(0, 4)], tw = h.R(-14, 14);
      add(`<g transform="rotate(${tw.toFixed(1)} ${x} ${y})"><path d="M${x - 10},${y} L${x - 12 + h.R(-3, 3)},${y - 22} Q${x},${y - 30 - h.R(0, 8)} ${x + 11},${y - 20} L${x + 9},${y}Z" fill="${c}"/><path d="M${x + 10},${y - 16} q${h.R(8, 14)},${h.R(-6, 4)} ${h.R(0, 4)},${h.R(10, 14)}" stroke="${c}" stroke-width="3" fill="none"/></g>`);
    }
  }
  add(`<rect x="86" y="62" width="6" height="150" fill="#6a4a2a"/><rect x="308" y="62" width="6" height="150" fill="#6a4a2a"/>`);
  // an enormous pile of tie-dyed sheets in one corner
  const cols = ['#e84a6a', '#f2a030', '#f4e040', '#4ab86a', '#3a8ae8', '#9a4ae8'];
  for (let i = 0; i < 9; i++) {
    const x = 250 + h.R(-10, 120), y = 235 - i * 10 + h.R(-4, 4), w = h.R(80, 130), ht = h.R(16, 24);
    const gid = 'td' + i;
    h.rad(gid, [[0, cols[(i + 2) % 6]], [.35, cols[i % 6]], [.7, cols[(i + 4) % 6]], [1, cols[(i + 1) % 6]]], h.R(.2, .8), .5, .7);
    add(`<path d="M${x - w / 2},${y} Q${x - w / 2 + 10},${y - ht} ${x},${y - ht + h.R(-4, 4)} Q${x + w / 2 - 6},${y - ht} ${x + w / 2},${y} Z" fill="url(#${h.id}${gid})"/>`);
  }
  for (let i = 0; i < 6; i++) add(`<circle cx="${h.R(220, 390)}" cy="${h.R(180, 250)}" r="${h.R(4, 9)}" fill="none" stroke="#fff" stroke-width="1.2" opacity=".35"/>`);
  // the wireless that was under the sheets: only once you have found it
  if (h.st.mentioned && h.st.mentioned('wireless')) wireless(h, 200, 246, 62);
  h.glow(200, 120, 200, '#fff4d8', .2);
} };

B['Potting Room'] = { cat: 'garden', draw(h) {
  const { add, lin } = h;
  // a light room
  add(`<rect width="400" height="260" fill="${lin('w', [[0, '#f0ead8'], [1, '#d8ccb0']])}"/>`);
  add(`<rect x="120" y="20" width="160" height="90" fill="#cfe4f0"/><rect x="120" y="20" width="160" height="90" fill="none" stroke="#f8f6ee" stroke-width="5"/><line x1="200" y1="20" x2="200" y2="110" stroke="#f8f6ee" stroke-width="4"/><line x1="120" y1="65" x2="280" y2="65" stroke="#f8f6ee" stroke-width="4"/>`);
  add(`<path d="M120,96 Q170,80 280,92 L280,110 L120,110Z" fill="#9ac08a"/>`);
  add(`<rect y="196" width="400" height="64" fill="#9a7a58"/>`);
  // workbench
  add(`<rect x="40" y="150" width="320" height="10" fill="#8a6038"/><rect x="50" y="160" width="8" height="40" fill="#6a4626"/><rect x="342" y="160" width="8" height="40" fill="#6a4626"/>`);
  // pot plants and flowers along the bench
  for (let i = 0; i < 7; i++) {
    const x = 60 + i * 44 + h.R(-6, 6), c = ['#b8683a', '#c87a48', '#a85a32'][i % 3];
    add(`<path d="M${x - 12},150 L${x + 12},150 L${x + 9},128 L${x - 9},128Z" fill="${c}"/><rect x="${x - 13}" y="125" width="26" height="5" fill="${c}"/>`);
    for (let k = 0; k < 4; k++) add(`<path d="M${x},126 q${h.R(-14, 14)},${h.R(-18, -8)} ${h.R(-10, 10)},${h.R(-30, -20)}" stroke="#3e7a3a" stroke-width="2" fill="none"/>`);
    if (i % 2 === 0) for (let k = 0; k < 3; k++) { const fx = x + h.R(-12, 12), fy = h.R(94, 108); add(`<circle cx="${fx}" cy="${fy}" r="5" fill="${['#f8f8f0', '#e85a7a', '#f2c040'][k]}"/><circle cx="${fx}" cy="${fy}" r="2" fill="#f2b020"/>`); }
  }
  // daisies being judged: a daisy chain on the bench
  let d = '';
  for (let i = 0; i < 11; i++) { const x = 120 + i * 15, y = 146 + Math.sin(i * .9) * 2; d += `<g>${[0, 1, 2, 3, 4, 5, 6, 7].map(k => `<ellipse cx="${x + Math.cos(k * .785) * 3.5}" cy="${y + Math.sin(k * .785) * 3.5}" rx="2.2" ry="1.2" fill="#fbfbf4" transform="rotate(${k * 45} ${x + Math.cos(k * .785) * 3.5} ${y + Math.sin(k * .785) * 3.5})"/>`).join('')}<circle cx="${x}" cy="${y}" r="1.8" fill="#f2c020"/></g>`; }
  add(d); add(`<path d="M120,146 Q200,142 270,146" stroke="#5a8a3a" stroke-width="1" fill="none"/>`);
  // seed packets, ornamental trowels and garden implements
  add(`<rect x="300" y="132" width="16" height="18" fill="#e8c860" transform="rotate(-8 308 141)"/><rect x="320" y="134" width="16" height="16" fill="#7ab0d8" transform="rotate(6 328 142)"/>`);
  add(`<line x1="24" y1="60" x2="24" y2="140" stroke="#7a5430" stroke-width="4"/><path d="M18,140 h12 l-2,22 h-8z" fill="#9aa0a6"/><line x1="372" y1="40" x2="372" y2="140" stroke="#7a5430" stroke-width="4"/><path d="M362,140 h20 v6 h-4 v12 h-3 v-12 h-3 v12 h-3 v-12 h-3 v12 h-3 v-12 h-1z" fill="#8a9096"/>`);
  add(`<path d="M80,180 l18,-6 q10,-2 12,6 l-30,10z" fill="#b8c0c8"/><rect x="108" y="176" width="20" height="6" rx="3" fill="#a8603a" transform="rotate(-18 108 178)"/>`);
  // yellow rubber gloves on a hook
  add(`<circle cx="320" cy="40" r="3" fill="#555"/>`);
  if (h.st.here('gloves')) for (let g = 0; g < 2; g++) { const gx = 312 + g * 16; add(`<path d="M${gx},44 h12 v22 l3,8 l-3,10 h-2 l-1,-8 h-1 l-1,9 h-2 l-1,-9 h-1 l-1,8 h-2 l-1,-10 v-8 l-2,-4 z" fill="#f2d428" stroke="#b89a10" stroke-width=".8"/>`); }
  h.glow(200, 60, 240, '#ffffff', .3);
} };

B['Disused Observatory'] = { cat: 'interior', draw(h) {
  const { add, lin } = h;
  // small circular room with a proper (flat) roof
  add(`<rect width="400" height="260" fill="#1a1612"/>`);
  add(`<rect x="0" y="0" width="400" height="34" fill="#2a221a"/><rect x="0" y="34" width="400" height="6" fill="#120e0a"/>`);
  add(`<path d="M0,40 Q200,70 400,40 L400,206 Q200,232 0,206Z" fill="${lin('w', [[0, '#3a4a6a'], [1, '#2a3048']])}"/>`);
  // circular zodiac mural
  const cx = 200, cy = 118, rr = 70;
h.add(h.open('mural'));   add(`<circle cx="${cx}" cy="${cy}" r="${rr}" fill="#1e2a48" stroke="#c8a85a" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="${rr - 18}" fill="none" stroke="#c8a85a" stroke-width="1"/>`);
  const signs = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
  signs.forEach((s, i) => { const ang = -Math.PI / 2 + i * Math.PI / 6; add(`<line x1="${cx + Math.cos(ang + Math.PI / 12) * (rr - 18)}" y1="${cy + Math.sin(ang + Math.PI / 12) * (rr - 18)}" x2="${cx + Math.cos(ang + Math.PI / 12) * rr}" y2="${cy + Math.sin(ang + Math.PI / 12) * rr}" stroke="#c8a85a" stroke-width=".8"/><text x="${cx + Math.cos(ang) * (rr - 9)}" y="${cy + Math.sin(ang) * (rr - 9) + 4}" text-anchor="middle" font-size="11" fill="#e8d090" font-family="'Segoe UI Symbol','DejaVu Sans',sans-serif">${s}︎</text>`); });
  for (let i = 0; i < 26; i++) { const ang = h.R(0, 6.28), d = h.R(4, rr - 22); add(`<circle cx="${cx + Math.cos(ang) * d}" cy="${cy + Math.sin(ang) * d}" r="${h.R(.5, 1.4)}" fill="#f4e8c0" opacity=".7"/>`); } h.add('</g>');
  // stairs up to the north interrupt the mural (left), stairs down south (foreground), west alcove (far left)
  add(`<polygon points="268,206 268,60 300,52 300,208" fill="#14100c"/>`);
  for (let i = 0; i < 8; i++) add(`<rect x="${270 + i * 3}" y="${196 - i * 18}" width="${62 - i * 3}" height="10" fill="#5a4630" stroke="#1d150e"/>`);
  add(`<path d="M0,60 Q22,66 40,70 L40,200 Q20,198 0,196Z" fill="#06050a"/>`);
  add(`<polygon points="120,230 200,232 200,260 112,260" fill="#060403"/>`);
  for (let i = 0; i < 3; i++) add(`<rect x="${122 + i * 3}" y="${234 + i * 8}" width="${74 - i * 6}" height="6" fill="#4a3826"/>`);
  // smoke detector on the ceiling
  add(`<ellipse cx="120" cy="34" rx="12" ry="4" fill="#e8e8e4"/><rect x="108" y="28" width="24" height="6" fill="#d8d8d4"/><circle cx="126" cy="33" r="1.4" fill="#e04030"/>`);
  // the old telescope stand with a solid glass ball
  add(`<polygon points="214,250 226,170 238,250" fill="#3a3a40"/><line x1="226" y1="250" x2="200" y2="258" stroke="#3a3a40" stroke-width="4"/><line x1="226" y1="250" x2="252" y2="258" stroke="#3a3a40" stroke-width="4"/><rect x="216" y="162" width="20" height="10" fill="#4a4a52"/>`);
  if (h.st.here('glass ball')) h.glow(226, 140, 56, '#cfe6ff', .55);
  if (h.st.here('glass ball')) add(h.tag('glass ball', `<circle cx="226" cy="142" r="20" fill="${h.rad('ball', [[0, '#ffffff'], [.5, '#b8d4f0'], [1, '#5a7aa8']], .35, .3, .8)}" opacity=".92"/><ellipse cx="219" cy="134" rx="6" ry="4" fill="#fff" opacity=".8"/>`));
  // the projector's beam from the south, bent by the glass ball onto one sign of the mural
  const od = (h.desc || '').toLowerCase();
  const bm = /white light runs into/.test(od) || (h.st.known && h.st.mentioned && h.st.mentioned('beam') && h.st.isOn && false);
  if (bm && h.st.here('glass ball')) {
    const names = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
    const sm = /at the sign of (\w+)/.exec(od); const si = sm ? names.indexOf(sm[1]) : -1;
    const inBeam = `<polygon points="150,260 176,260 228,146 222,140" fill="#ffffff" opacity=".35"/><line x1="163" y1="260" x2="225" y2="143" stroke="#fff" stroke-width="2.5" opacity=".9"/>`;
    if (/opaque glass ball/.test(od)) {
      // the ball is still filmed over: the beam just ends on it
      add(h.tag('beam', inBeam)); h.glow(226, 142, 18, '#ffffff', .45);
    } else if (/straight rod of white/.test(od)) {
      add(h.tag('beam', inBeam + `<line x1="226" y1="142" x2="20" y2="70" stroke="#fff" stroke-width="1.6" opacity=".8"/><rect x="18" y="64" width="6" height="150" fill="#fff" opacity=".85"/>`));
      h.glow(21, 140, 40, '#ffffff', .6);
    } else if (/in a crescent against/.test(od)) {
      add(h.tag('beam', inBeam + `<line x1="226" y1="142" x2="58" y2="112" stroke="#fff" stroke-width="1.6" opacity=".7"/><path d="M60,88 A24,24 0 1 0 60,136 A18,18 0 1 1 60,88Z" fill="#fff" opacity=".9"/>`));
      h.glow(56, 112, 40, '#ffffff', .5);
    } else if (/spins it about wildly/.test(od)) {
      // the ball spins the light about like a strobe at a discotheque: short rays every way, flecks on the walls
      let rays = ''; for (let i = 0; i < 16; i++) { const a2 = h.R(0, 6.28), l = h.R(40, 150); rays += `<line x1="226" y1="142" x2="${(226 + Math.cos(a2) * l).toFixed(1)}" y2="${(142 + Math.sin(a2) * l * .7).toFixed(1)}" stroke="#fff" stroke-width="${h.R(1, 2.4).toFixed(1)}" opacity="${h.R(.3, .9).toFixed(2)}"/>`; }
      for (let i = 0; i < 30; i++) rays += `<circle cx="${h.R(10, 390).toFixed(0)}" cy="${h.R(40, 220).toFixed(0)}" r="${h.R(1.5, 4).toFixed(1)}" fill="#fff" opacity="${h.R(.3, .8).toFixed(2)}"/>`;
      add(h.tag('beam', inBeam + rays)); h.glow(226, 142, 40, '#ffffff', .8);
    } else if (/a beautiful spectrum/.test(od)) {
      // diffracted into a beautiful spectrum across the ceiling
      const cols = ['#ff4040', '#ff9a30', '#ffe040', '#50d050', '#40a0ff', '#6050e0', '#b050d0'];
      add(h.tag('beam', inBeam + `<g opacity=".22">${cols.map((c, i) => `<polygon points="226,142 ${20 + i * 52},34 ${72 + i * 52},34" fill="${c}"/>`).join('')}</g><g opacity=".5">${cols.map((c, i) => `<rect x="${20 + i * 52}" y="2" width="52" height="32" fill="${c}"/>`).join('')}</g>`));
      h.glow(226, 142, 30, '#ffffff', .8);
    } else if (/yellow searchlight/.test(od)) {
      // amplified into a powerful yellow searchlight which slowly turns about the room
      add(h.tag('beam', inBeam + `<polygon points="226,142 20,40 70,10" fill="#ffe060" opacity=".45"/><polygon points="226,142 30,36 64,18" fill="#fff4b0" opacity=".5"/><path d="M60,120 A170,120 0 0 1 120,20" stroke="#ffe060" stroke-width="1.5" fill="none" stroke-dasharray="4 6" opacity=".6"/>`));
      h.glow(46, 26, 60, '#ffe060', .7); h.glow(226, 142, 34, '#ffe880', .9);
    } else {
      const ang = -Math.PI / 2 + (si >= 0 ? si : 9) * Math.PI / 6 + Math.PI / 12, tx = cx + Math.cos(ang) * (rr - 9), ty = cy + Math.sin(ang) * (rr - 9);
      add(h.tag('beam', inBeam + `<line x1="226" y1="142" x2="${tx.toFixed(1)}" y2="${ty.toFixed(1)}" stroke="#fff" stroke-width="2" opacity=".9"/>`));
      h.glow(tx, ty, 22, '#ffffff', .8);
    }
  }
  if (!h.st.here('smoke detector')) add(`<rect x="106" y="28" width="28" height="8" fill="#1a1612"/>`);
} };

B['East Annexe'] = { cat: 'attic', draw(h) {
  const a = attic(h, { left: 120, right: 280, top: 96, floor: 196, wall: ['#4a3a2a', '#2c2218'] });
  // a gap between the roof tiles letting a little daylight in
  h.add(`<polygon points="250,0 268,0 260,40 246,38" fill="#dfe8f0"/>`);
  h.add(`<polygon points="246,38 260,40 330,260 190,260" fill="${h.lin('sun', [[0, '#f8f0d0', .45], [1, '#f8f0d0', .05]])}"/>`);
  dust(h, 50, 200, 320, 40, 250, '#fff4d0');
  // intriguing closed cupboard door in the north (back) wall
  if (h.st.known && h.st.open('cupboard door', false)) h.add(`<rect x="170" y="118" width="54" height="76" fill="#060403" stroke="#24160b" stroke-width="3"/><polygon points="170,118 150,126 150,200 170,194" fill="#6a4a2a" stroke="#24160b"/>`);
  else h.add(`<rect x="170" y="118" width="54" height="76" fill="#6a4a2a" stroke="#24160b" stroke-width="3"/><rect x="177" y="126" width="40" height="28" fill="none" stroke="#4a3018" stroke-width="2"/><rect x="177" y="160" width="40" height="28" fill="none" stroke="#4a3018" stroke-width="2"/><circle cx="214" cy="158" r="3" fill="#c8a060"/>`);
  // old loft insulation rolls piled up
  const rolls = [[60, 236, 30], [118, 238, 28], [86, 196, 28], [300, 240, 30], [356, 236, 28], [328, 198, 28], [40, 196, 24]];
  for (const [x, y, r] of rolls) {
    h.add(`<rect x="${x - r}" y="${y - r}" width="${r * 1.6}" height="${r * 2}" fill="#d8b85a"/><ellipse cx="${x + r * .6}" cy="${y}" rx="${r * .45}" ry="${r}" fill="#e8c86a"/>`);
    for (let k = 1; k < 4; k++) h.add(`<ellipse cx="${x + r * .6}" cy="${y}" rx="${r * .45 * k / 4}" ry="${r * k / 4}" fill="none" stroke="#b8963a" stroke-width="1"/>`);
    for (let k = 0; k < 8; k++) h.add(`<circle cx="${x - r + h.R(0, r * 1.6)}" cy="${y - r + h.R(0, r * 2)}" r="${h.R(1, 3)}" fill="#f0d88a" opacity=".6"/>`);
  }
  // the attics to the west and south are dark, until the hatchway in the dead end is open: then sunlight comes from the south, behind you
  h.add(`<polygon points="0,0 120,96 120,196 0,260" fill="#000" opacity=".55"/>`);
  if (/dead end south is bright/i.test(h.desc)) { h.add(`<rect x="0" y="170" width="400" height="90" fill="${h.lin('sbk', [[0, '#fff0c0', 0], [1, '#fff4d0', .6]])}"/>`); h.glow(200, 270, 220, '#fff0c0', .5); }
  else h.add(`<rect x="0" y="236" width="400" height="24" fill="#000" opacity=".4"/>`);
} };

B['Dark Room'] = { cat: 'interior', draw(h) {
  const { add } = h;
  // The red developing lamp only glows once the cord has been pulled (the lamp then hangs in the room).
  // Before that the room has no light of its own: what you carry shows it dimly, in plain colours.
  const red = h.st.known ? h.st.here('red lamp') : /eerie, reddish light/i.test(h.desc);
  const c = (r, p) => red ? r : p;
  // roughly furnished photographer's darkroom, very dim
  add(`<rect width="400" height="260" fill="${c('#1a0806', '#121110')}"/>`);
  add(`<polygon points="0,0 400,0 340,50 60,50" fill="${c('#120403', '#0c0b0a')}"/><polygon points="0,0 60,50 60,200 0,260" fill="${c('#220a08', '#1a1816')}"/><polygon points="400,0 340,50 340,200 400,260" fill="${c('#1e0807', '#171513')}"/><rect x="60" y="50" width="280" height="150" fill="${c('#2e100c', '#262320')}"/><polygon points="60,200 340,200 400,260 0,260" fill="${c('#240c09', '#1c1a17')}"/>`);
  for (let x = 70; x < 340; x += 16) add(`<line x1="${x}" y1="50" x2="${x}" y2="200" stroke="#000" opacity=".2"/>`);
  // the cord you keep bumping into
h.add(h.open('cord'));   add(`<path d="M140,0 Q142,60 138,104" stroke="#d8c8a8" stroke-width="1.4" fill="none"/><circle cx="138" cy="106" r="3" fill="#d8c8a8"/>`); h.add('</g>');
  // the developing lamp on the ceiling, lit
  if (red) { h.glow(200, 14, 150, '#ff2a1a', .55); add(h.tag('lamp', `<path d="M186,0 v6 h28 v-6z" fill="#2a1a18"/><path d="M188,6 q12,16 24,0z" fill="#ff4a2a"/><ellipse cx="200" cy="10" rx="8" ry="4" fill="#ffb090"/>`)); }
  if (h.st.known && h.st.here('golden orb') && h.st.mentioned && h.st.mentioned('golden orb')) { h.glow(138, 114, 30, '#ffd86a', .6); add(`<circle cx="138" cy="114" r="6" fill="#e8c040"/>`); }
  // a rough bench and a shelf (chemicals long gone)
  add(`<rect x="70" y="150" width="190" height="8" fill="#4a2418"/><rect x="76" y="158" width="6" height="42" fill="#3a1a10"/><rect x="250" y="158" width="6" height="42" fill="#3a1a10"/>`);
  add(`<rect x="270" y="110" width="66" height="5" fill="#4a2418"/><rect x="270" y="150" width="66" height="5" fill="#4a2418"/>`);
  // modern photographer's flash on a shelf
  if (h.st.here('flash')) add(h.tag('flash', `<rect x="290" y="88" width="20" height="22" rx="2" fill="#2a2a2a"/><rect x="286" y="80" width="28" height="12" rx="2" fill="#3a3a3a"/><rect x="289" y="82" width="22" height="8" fill="#e8e8f0" opacity=".85"/>`));
  // plaque with an old sepia photograph of a man
  add(`<rect x="160" y="64" width="64" height="74" fill="#6a3a1a" stroke="#c8903a" stroke-width="2"/><rect x="168" y="72" width="48" height="58" fill="${h.st.here('photograph') ? '#c8a070' : '#4a2a14'}"/>`);
  if (h.st.here('photograph')) add(h.tag('photograph', `<path d="M176,130 Q178,108 192,104 Q206,108 208,130Z" fill="#6a4a2a"/><ellipse cx="192" cy="94" rx="9" ry="11" fill="#8a6a44"/><path d="M182,90 Q192,78 202,90 Q198,84 192,84 Q186,84 182,90Z" fill="#4a3218"/><path d="M186,100 q6,4 12,0" stroke="#5a3a1a" stroke-width="1.6" fill="none"/>`));
  if (h.st.here('photograph')) add(h.tag('photograph', `<rect x="168" y="72" width="48" height="58" fill="#8a5a2a" opacity=".25"/>`));
  add(`<rect x="180" y="140" width="24" height="6" fill="#c8903a"/>`);
  if (red) add(`<rect width="400" height="260" fill="#ff2a1a" opacity=".1"/>`);
  else {
    // only a little carried light: the walls fall away into darkness, the room's contents are mere shapes
    add(`<defs><radialGradient id="drDim" cx=".5" cy=".55" r=".6"><stop offset="0" stop-color="#000" stop-opacity=".25"/><stop offset=".6" stop-color="#000" stop-opacity=".7"/><stop offset="1" stop-color="#000" stop-opacity=".92"/></radialGradient></defs><rect width="400" height="260" fill="url(#drDim)"/>`);
  }
} };

B['Souvenirs Room'] = { cat: 'interior', draw(h) {
  const { add, lin } = h;
  add(`<rect width="400" height="260" fill="#1c140e"/>`);
  // whitewashed south wall (we look at it), lit by the slide projector
  add(`<rect x="70" y="40" width="260" height="160" fill="${lin('w', [[0, '#d8d4c8'], [1, '#b8b2a4']])}"/><polygon points="0,0 70,40 70,200 0,260" fill="#2a1e14"/><polygon points="400,0 330,40 330,200 400,260" fill="#241a12"/><polygon points="70,200 330,200 400,260 0,260" fill="#3a2a1c"/><polygon points="0,0 400,0 330,40 70,40" fill="#16100a"/>`);
  // what the projector throws onto the south wall: nothing, white light, or the picture in its slot
  const st = h.st, dd = (h.desc || '').toLowerCase();
  const on = st.known ? st.isOn('projector') : /wall is lit up|south wall displays/.test(dd);
  const slide = st.known ? (st.inside('projector')[0] || '') : '';
  const CU = root.ZClose || (typeof require === 'function' ? (() => { try { return require('./closeup.js'); } catch (e) { return null; } })() : null);
  const cardText = { 'ace of cups': 'crystal-glass cups and glasses', fool: 'edge of a cliff', maiden: 'andromeda chained to a rock', castle: 'castle on a hill', star: 'single bright light', 'grim reaper': 'hood, scythe, skeleton', 'drowned sailor': 'pearls that were his eyes', 'crescent moon': 'old druidical symbol', 'eight of wands': 'nothing special about the eight of wands', 'madame sosostris': 'has a bad cold' };
  if (on) {
    h.glow(200, 104, 150, '#fff8dc', .35);
    add(`<rect x="120" y="54" width="160" height="104" fill="#fffbe8" opacity=".95"/>`);
    const sl = slide.toLowerCase(), key = Object.keys(cardText).find(k => sl.startsWith(k));
    let pic = '';
    if (key && CU) { const c = CU.find(cardText[key]); if (c) pic = `<g opacity=".78"><svg x="167" y="56" width="66" height="100" viewBox="0 0 200 320">${c.svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '').replace(/filter="url\(#[^)]*\)"/g, '')}</svg></g><rect x="167" y="56" width="66" height="100" fill="#fff8e0" opacity=".14"/>`; }
    else if (/miniature/.test(sl)) pic = `<g opacity=".8"><rect x="171" y="56" width="58" height="100" fill="#a8803a"/><rect x="175" y="60" width="50" height="92" fill="#a8c8e0"/><path d="M175,152 V112 Q196,96 214,104 L225,108 V152Z" fill="#6a8a4a"/><path d="M182,112 l22,-6 l14,10 l-36,4z" fill="#7a6a5a"/><rect x="193" y="70" width="14" height="40" fill="#9a8a78"/>${[193, 198, 203].map(x => `<rect x="${x}" y="66" width="4" height="5" fill="#9a8a78"/>`).join('')}<path d="M197,80 l3,8 M201,92 l-3,6" stroke="#5a4a3a" stroke-width="1"/></g><rect x="171" y="56" width="58" height="100" fill="#fff8e0" opacity=".14"/>`;
    else if (/sketch/.test(sl)) pic = `<g opacity=".8"><rect x="128" y="58" width="144" height="96" fill="#ece6d6"/><g stroke="#3a3430" stroke-width="1.4" fill="none"><path d="M140,140 h120 M146,140 V104 h108 V140 M140,104 h120 l-60,-24z"/>${Array.from({ length: 9 }, (_, k) => `<path d="M${152 + k * 12},106 v32"/>`).join('')}<path d="M194,140 v-18 h12 v18"/></g></g><rect x="128" y="58" width="144" height="96" fill="#fff8e0" opacity=".14"/>`;
    if (pic) add(st.mentioned && st.mentioned(slide) ? h.tag(slide, pic) : pic);
  } else add(`<rect x="120" y="54" width="160" height="104" fill="#000" opacity=".08"/>`);

  // projector on a stack of boxes, beam to the wall
  if (on) add(`<polygon points="200,214 120,54 280,54" fill="#fff4c8" opacity=".08"/>`);
  // the dial turned: a sharp beam runs backward out of the projector, through the north doorway
  if (on && (/points directly backward/.test(dd) || (st.mentioned && st.mentioned('beam') && st.mentioned('backward')))) add(h.tag('beam', `<polygon points="198,212 202,212 232,260 168,260" fill="#ffffff" opacity=".5"/><line x1="200" y1="212" x2="200" y2="260" stroke="#fff" stroke-width="3" opacity=".8"/>`));

  crate(h, 160, 252, 70, 26, '#5a4028');
  add(`<rect x="178" y="206" width="44" height="20" rx="3" fill="#3a3a40"/><circle cx="200" cy="212" r="7" fill="#1a1a20" stroke="#6a6a70"/><circle cx="200" cy="212" r="3" fill="#fff4c8"/><circle cx="186" cy="202" r="7" fill="#2a2a30" stroke="#555"/><circle cx="214" cy="202" r="7" fill="#2a2a30" stroke="#555"/>`);
  // souvenirs and holiday snaps: boxes and stacks of photos
  crate(h, 20, 250, 60, 40, '#6a4a2c'); crate(h, 330, 252, 54, 36, '#634426'); crate(h, 345, 214, 40, 26, '#7a5632');
  for (let i = 0; i < 8; i++) add(`<rect x="${100 + h.R(-20, 30)}" y="${226 + h.R(-6, 14)}" width="22" height="16" fill="#f4f0e4" stroke="#aaa" transform="rotate(${h.R(-30, 30)} 110 236)"/>`);
  // the only way out: back up to the observatory
  stepsUp(h, 300, 200, 5, 30, 1);
} };

B['Library Storage'] = { cat: 'interior', draw(h) {
  const a = attic(h, { wall: ['#4c3a2a', '#2e2219'] });
  // an awkward cranny: water tank and pipes in one corner
  h.add(`<rect x="230" y="104" width="78" height="92" fill="#5a6a6a" stroke="#2a3434" stroke-width="2"/><rect x="230" y="104" width="78" height="10" fill="#6e8080"/><line x1="230" y1="140" x2="308" y2="140" stroke="#3a4646"/><line x1="230" y1="170" x2="308" y2="170" stroke="#3a4646"/>`);
  h.add(`<path d="M270,104 V70 H150 V160" stroke="#b87a4a" stroke-width="7" fill="none"/><path d="M296,196 V230 H200" stroke="#b87a4a" stroke-width="7" fill="none"/><path d="M308,150 H370 V240" stroke="#a86a3a" stroke-width="6" fill="none"/>`);
  // the loose joint, dripping
  h.add(`<rect x="144" y="150" width="12" height="10" fill="#c88a5a" stroke="#6a3a1a"/>`);
  const nov = h.st.here('romantic novel'), poe = h.st.here('poetry');
  const leak = (nov ? 0 : 1) + (poe ? 0 : 1);
  for (let i = 0; i < 3 + leak * 4; i++) h.add(`<path d="M${150 + (i % 3 - 1) * 3 + (leak ? h.R(-6, 6) : 0)},${166 + i * (leak ? 6 : 10)} q-2,4 0,6 q2,-2 0,-6" fill="#9ac8e8" opacity=".85"/>`);
  if (leak) h.add(`<path d="M150,160 q-14,10 -24,26 M150,160 q14,10 24,26" stroke="#9ac8e8" stroke-width="2" fill="none" opacity=".7"/>`);
  h.add(`<ellipse cx="150" cy="232" rx="${20 + leak * 26}" ry="${4 + leak * 3}" fill="#6a9ab8" opacity=".5"/>`);
  // a romantic novel and a book of poetry, the only books left, propping up the pipe
  if (nov) h.add(`<rect x="136" y="196" width="30" height="10" fill="#c84a6a" stroke="#5a1a2a"/><rect x="136" y="196" width="30" height="2.5" fill="#f0e0c8"/>`);
  if (poe) h.add(`<rect x="138" y="${nov ? 184 : 196}" width="26" height="10" fill="#2a4a6a" stroke="#14283a"/><rect x="138" y="${nov ? 184 : 196}" width="26" height="2" fill="#e8dcc0"/>`);
  h.add(`<rect x="146" y="160" width="8" height="${nov && poe ? 24 : nov || poe ? 36 : 46}" fill="#b87a4a"/>`);
  dust(h, 24, 90, 320, 80, 220);
  torch(h, 200, 170, 160, .2);
} };

B['Dead End'] = { cat: 'attic', draw(h) {
  const a = attic(h, { left: 130, right: 270, top: 100, floor: 194, wall: ['#2e2620', '#1a1612'], beams: true });
  // particularly dirty, soot everywhere
  h.add(`<rect width="400" height="260" fill="#0a0806" opacity=".35"/>`);
  for (let i = 0; i < 70; i++) h.add(`<circle cx="${h.R(0, 400)}" cy="${h.R(150, 260)}" r="${h.R(2, 9)}" fill="#0a0806" opacity="${h.R(.3, .7)}"/>`);
  // broken old chimney-sweeping gear: brush heads and jointed rods
  h.add(`<g transform="rotate(-18 90 220)"><line x1="40" y1="220" x2="170" y2="220" stroke="#5a3a20" stroke-width="5"/><line x1="100" y1="216" x2="100" y2="224" stroke="#2a1a0a" stroke-width="3"/></g>`);
  h.add(`<g transform="rotate(14 300 200)"><line x1="250" y1="200" x2="330" y2="200" stroke="#5a3a20" stroke-width="5"/></g><line x1="330" y1="218" x2="370" y2="236" stroke="#4a2e18" stroke-width="5"/>`);
  for (const [bx, by, rot] of [[180, 232, 0], [340, 182, 30]]) {
    let s = '';
    for (let k = 0; k < 24; k++) { const ang = k / 24 * Math.PI * 2; s += `<line x1="${bx}" y1="${by}" x2="${bx + Math.cos(ang) * 18}" y2="${by + Math.sin(ang) * 18}" stroke="#141210" stroke-width="2"/>`; }
    h.add(`<g transform="rotate(${rot} ${bx} ${by})">${s}<circle cx="${bx}" cy="${by}" r="5" fill="#3a2a1a"/></g>`);
  }
  // the old canvas rucksack of a Victorian explorer
  const rx = 196, ry = 186;
  if (h.st.here('rucksack')) {
  h.glow(rx + 6, ry - 20, 70, '#ffe2a6', .3);
  h.add(`<path d="M${rx - 28},${ry} Q${rx - 34},${ry - 50} ${rx - 8},${ry - 60} L${rx + 22},${ry - 60} Q${rx + 44},${ry - 50} ${rx + 38},${ry} Z" fill="#8a7a50" stroke="#3a3220" stroke-width="2"/>`);
  h.add(`<path d="M${rx - 18},${ry - 58} Q${rx + 6},${ry - 74} ${rx + 30},${ry - 58} L${rx + 26},${ry - 34} Q${rx + 6},${ry - 28} ${rx - 14},${ry - 34}Z" fill="#9a8a5c" stroke="#3a3220" stroke-width="1.6"/>`);
  h.add(`<rect x="${rx - 10}" y="${ry - 40}" width="5" height="22" fill="#5a3a1a"/><rect x="${rx + 16}" y="${ry - 40}" width="5" height="22" fill="#5a3a1a"/><rect x="${rx - 11}" y="${ry - 22}" width="7" height="6" fill="#b89a50"/><rect x="${rx + 15}" y="${ry - 22}" width="7" height="6" fill="#b89a50"/>`);
  h.add(`<rect x="${rx - 20}" y="${ry - 20}" width="48" height="16" rx="3" fill="#7a6a42" stroke="#3a3220"/>`);
  h.add(`<path d="M${rx - 22},${ry - 10} l6,4 M${rx + 30},${ry - 30} l-6,6" stroke="#2a2418" stroke-width="2"/>`);
  }
  // later: the secret door in the south wall (ahead), and the hatchway onto the fire escape in the east wall (left)
  const dd = (h.desc || '').toLowerCase();
  if (/secret door stands open/.test(dd)) h.add(h.tag('secret door', `<rect x="172" y="120" width="56" height="74" fill="#050403"/><path d="M172,120 v74 l-20,6 v-86z" fill="#3a2a1c" stroke="#1a120a"/>`));
  if (/hatchway in the east wall/.test(dd)) {
    h.add(h.tag('hatchway', `<polygon points="40,96 96,112 96,186 40,200" fill="#f4ecd0"/><polygon points="40,96 96,112 96,186 40,200" fill="none" stroke="#2a1d13" stroke-width="4"/><path d="M50,150 L90,146 M50,168 L90,162 M58,140 v40 M80,138 v38" stroke="#3a3a3e" stroke-width="2.5"/>`));
    h.add(`<polygon points="96,112 96,186 260,250 300,200" fill="#f4ecd0" opacity=".12"/>`);
    h.glow(70, 150, 120, '#fff4d0', .35);
  }
  torch(h, 200, 160, 120, .15);
} };

const api = { BESPOKE: B };
if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.ZBespoke = api;
})(typeof window !== 'undefined' ? window : this);
