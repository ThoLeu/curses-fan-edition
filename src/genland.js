// Open-air scenes, boats and tents for the generic room pictures, composed from what the description names.
(function (root) {
'use strict';
const GT = () => root.ZGenText || require('./gentext.js');
const IC = () => root.ZIcons || (typeof require === 'function' ? (() => { try { return require('./icons.js'); } catch (e) { return null; } })() : null);
const W = 400, H = 260;
const lerp = (a, b, t) => a + (b - a) * t;
const f1 = v => Math.round(v * 10) / 10;
const at = (x, y, s, body, flip) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1((flip ? -s : s) * 100) / 100} ${f1(s * 100) / 100})">${body}</g>`;

// ---------------------------------------------------------------- landmarks in the distance (local: base at 0, ~100 units tall)
const LM = [
  ['wall of thorns|thorn wall|great outgrowth', 'thorns', 0],
  ['pharos tower|pharos light|lighthouse|pharos', 'lighthouse', 1],
  ["meldrew hall(?! will)|the house and its battlements|the hall\\b|foot of the hall|side of the hall|the house rises", 'hall', 0],
  ['temple of zeus|marble temple|the temple', 'temple', 0],
  ['roman villa|the villa|a villa', 'villa', 0],
  ['eraina taverna|taverna', 'taverna', 0],
  ['animal-hide tent|side of an animal-hide tent', 'tent', 2],
  ['crude encampments|encampments', 'tents', 0],
  ['circle of camp fires|cartwheel circle', 'campring', 0],
  ['dolmen|standing stone|glacial erratic|erratic glacial rock', 'dolmen', 0],
  ['cave mouth|crack leads|cleft in the rock|crevice in the hill', 'cave', 5],
  ['stepped bowl|theatre', 'theatre', 0],
  ['stadium of alexandria|the stadium', 'stadium', 0],
  ['hugely impressive edifice|royal palace|palace', 'palace', 0],
  ['portico entrance|museum of the ptolemies', 'museum', 0],
  ['the village|village', 'village', 0],
  ['the whole city|(?<!of )the city|(?<!wooden )buildings', 'city', 0],
  ['warehouses', 'warehouses', 0],
  ['tourist boat|glass-roofed tourist', 'boat', 1],
  ['wooden buildings|stables', 'stables', 7],
  ['men on horseback', 'horsemen', 1],
  ['parish church|the spire|spire', 'spire', 7]
];
const D = {
  lighthouse: n => `<path d="M-60,0 Q-20,-30 50,0Z" fill="#2a2420"/><polygon points="-12,-6 12,-6 8,-150 -8,-150" fill="${n ? '#8a8478' : '#e8e0d0'}"/><path d="M-12,-50 h24 M-10,-100 h20" stroke="#000" opacity=".2" stroke-width="3"/><rect x="-10" y="-166" width="20" height="16" fill="#ffd27a"/><polygon points="-14,-166 14,-166 0,-180" fill="#5a4a3a"/>${n ? '<polygon points="0,-158 260,-200 260,-120" fill="#fff2b0" opacity=".14"/><circle cx="0" cy="-158" r="22" fill="#ffd27a" opacity=".3"/>' : ''}`,
  hall: n => `<rect x="-90" y="-90" width="180" height="90" fill="${n ? '#3a3440' : '#8a7a6a'}"/>${Array.from({ length: 9 }, (_, i) => `<rect x="${-90 + i * 20}" y="-100" width="12" height="10" fill="${n ? '#3a3440' : '#8a7a6a'}"/>`).join('')}<rect x="-30" y="-130" width="40" height="40" fill="${n ? '#34303a' : '#7a6a5a'}"/>${[-70, -40, 20, 50].map(x => `<rect x="${x}" y="-70" width="12" height="18" fill="${n ? '#ffd27a' : '#2a2a3a'}" opacity=".8"/>`).join('')}<rect x="-8" y="-34" width="18" height="34" fill="#2a1a10"/>`,
  temple: () => `<polygon points="-86,-96 0,-128 86,-96" fill="#e8e0cc" stroke="#a89a80"/><rect x="-86" y="-96" width="172" height="10" fill="#dcd2ba"/>${[-74, -50, -26, 0, 26, 50, 74].map(x => `<rect x="${x - 6}" y="-86" width="12" height="78" fill="#f0e8d6"/>`).join('')}<rect x="-94" y="-8" width="188" height="8" fill="#d0c6ae"/><rect x="-14" y="-78" width="28" height="70" fill="#2a2420" opacity=".6"/>`,
  villa: n => `<rect x="-100" y="-70" width="200" height="70" fill="${n ? '#8a8270' : '#d8ccb0'}"/><polygon points="-110,-70 0,-104 110,-70" fill="${n ? '#6a3a2a' : '#a85a3a'}"/>${[-80, -50, -20, 20, 50, 80].map(x => `<rect x="${x - 5}" y="-62" width="10" height="56" fill="${n ? '#a8a08c' : '#f0e8d4'}"/>`).join('')}<path d="M-110,-70 h220" stroke="#5a3020" stroke-width="3"/>${Array.from({ length: 10 }, (_, i) => `<path d="M${-104 + i * 22},-72 l8,-3" stroke="#5a2a1a" stroke-width="2"/>`).join('')}`,
  taverna: () => `<rect x="-80" y="-80" width="160" height="80" fill="#f2f0ea"/><rect x="-86" y="-84" width="172" height="8" fill="#2a5a8a"/><rect x="-20" y="-56" width="40" height="56" fill="#140e08"/><rect x="-20" y="-56" width="40" height="4" fill="#2a5a8a"/><rect x="-66" y="-60" width="22" height="22" fill="#2a5a8a"/><rect x="44" y="-60" width="22" height="22" fill="#2a5a8a"/><text x="0" y="-64" text-anchor="middle" font-family="Georgia,serif" font-size="11" fill="#2a5a8a">ΤΑΒΕΡΝΑ</text>`,
  tent: () => `<path d="M-90,0 L-60,-70 L0,-110 L60,-70 L90,0Z" fill="#6a5034"/><path d="M0,-110 L-30,0 M0,-110 L30,0 M0,-110 L-70,-10 M0,-110 L70,-10" stroke="#3a2a18" stroke-width="2"/><path d="M-90,0 L-60,-70 L0,-110" fill="none" stroke="#8a6a44" stroke-width="2"/>`,
  tents: () => [-120, -50, 30, 100].map((x, i) => `<g transform="translate(${x} 0) scale(${[.7, 1, .8, .6][i]})"><polygon points="-30,0 0,-40 30,0" fill="#3a2e22"/><polygon points="0,-40 30,0 12,0" fill="#2a2018"/></g>`).join(''),
  campring: () => { let s = ''; for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2, x = Math.cos(a) * 120, y = Math.sin(a) * 26 - 30; s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="16" fill="#ff8a2a" opacity=".25"/><circle cx="${f1(x)}" cy="${f1(y)}" r="4" fill="#ffc050"/>`; } for (let i = 0; i < 6; i++) s += `<rect x="${-60 + i * 22}" y="-44" width="12" height="16" fill="#1a1410"/>`; return s; },
  dolmen: () => `<rect x="-60" y="-80" width="24" height="80" fill="#5a5854"/><rect x="36" y="-76" width="24" height="76" fill="#55534f"/><path d="M-76,-78 q10,-20 80,-22 q70,0 76,20 l-6,8 h-146z" fill="#6a6864"/><path d="M-50,-60 l4,40 M44,-60 l-2,30" stroke="#3a3834" stroke-width="2"/>`,
  thorns: () => { let s = `<path d="M-200,0 Q-200,-70 0,-76 Q200,-70 200,0Z" fill="#2a2418"/>`; for (let i = 0; i < 30; i++) { const x = -190 + i * 13; s += `<path d="M${x},${-40 - (i % 5) * 7} l6,-14 l2,12 l8,-10 l-2,14" stroke="#4a3a24" stroke-width="2" fill="none"/>`; } return s; },
  cave: () => `<path d="M-60,0 Q-70,-80 -10,-100 Q50,-110 64,-40 L70,0Z" fill="#4a3e34"/><path d="M-24,0 Q-30,-50 0,-60 Q26,-58 24,0Z" fill="#060504"/>`,
  theatre: () => { let s = ''; for (let i = 0; i < 8; i++) s += `<path d="M${-150 + i * 6},${-i * 10} Q0,${-40 - i * 12} ${150 - i * 6},${-i * 10}" stroke="${i % 2 ? '#c8b894' : '#d8c8a4'}" stroke-width="9" fill="none"/>`; return s + `<path d="M-150,0 h300" stroke="#8a7a5a" stroke-width="4"/>`; },
  stadium: () => { let s = `<ellipse cx="0" cy="-40" rx="180" ry="50" fill="#c8b48a"/><ellipse cx="0" cy="-36" rx="140" ry="32" fill="#a88a5a"/><ellipse cx="0" cy="-34" rx="110" ry="20" fill="#c8a878"/>`; for (let i = 0; i < 120; i++) { const a = i / 120 * Math.PI * 2, r = 150 + (i % 3) * 8; s += `<circle cx="${f1(Math.cos(a) * r)}" cy="${f1(-40 + Math.sin(a) * r * .3)}" r="2.6" fill="${['#c84a3a', '#e8d8b0', '#3a5a8a', '#2a2018'][i % 4]}"/>`; } return s; },
  palace: n => `<rect x="-160" y="-110" width="320" height="110" fill="${n ? '#8a8070' : '#e0d4b8'}"/><rect x="-170" y="-124" width="340" height="16" fill="${n ? '#9a9080' : '#ece2c8'}"/>${Array.from({ length: 13 }, (_, i) => `<rect x="${-150 + i * 25}" y="-104" width="10" height="96" fill="${n ? '#a89e8c' : '#f4ecd8'}"/>`).join('')}<rect x="-26" y="-80" width="52" height="80" fill="#1a1410"/><polygon points="-60,-124 0,-150 60,-124" fill="${n ? '#9a9080' : '#ece2c8'}"/>`,
  museum: n => `<polygon points="-90,-100 0,-130 90,-100" fill="${n ? '#9a9080' : '#e8dcc4'}"/><rect x="-90" y="-100" width="180" height="18" fill="${n ? '#8a8070' : '#d8ccb0'}"/>${[-60, -20, 20, 60].map(x => `<circle cx="${x}" cy="-91" r="5" fill="#000" opacity=".25"/>`).join('')}${[-76, -46, -16, 16, 46, 76].map(x => `<rect x="${x - 6}" y="-82" width="12" height="74" fill="${n ? '#b0a898' : '#f2eadc'}"/>`).join('')}<rect x="-100" y="-8" width="200" height="8" fill="#c8bca4"/><rect x="-104" y="0" width="208" height="6" fill="#b8ac94"/>`,
  village: n => [-60, -30, 0, 30, 60].map((x, i) => `<rect x="${x - 12}" y="${-24 - (i % 2) * 4}" width="24" height="${24 + (i % 2) * 4}" fill="${n ? '#3a3440' : '#c8b8a0'}"/><polygon points="${x - 15},${-24 - (i % 2) * 4} ${x},${-38 - (i % 2) * 4} ${x + 15},${-24 - (i % 2) * 4}" fill="${n ? '#2a2430' : '#8a4a3a'}"/>${n ? `<rect x="${x - 3}" y="-16" width="6" height="7" fill="#ffd27a"/>` : ''}`).join('') + `<polygon points="10,-38 16,-80 22,-38" fill="${n ? '#2a2430' : '#6a6060'}"/>`,
  city: (n, anc) => { let s = ''; for (let i = 0; i < 11; i++) { const x = -200 + i * 38, hh = 30 + (i * 37) % 50; s += anc ? `<rect x="${x}" y="${-hh}" width="34" height="${hh}" fill="${n ? '#4a4440' : '#e8e0cc'}"/><rect x="${x - 2}" y="${-hh - 4}" width="38" height="5" fill="${n ? '#5a5450' : '#d8ccb0'}"/>` : `<rect x="${x}" y="${-hh - 20}" width="34" height="${hh + 20}" fill="${n ? '#1c1a26' : '#6a6470'}"/>`; if (n) for (let k = 0; k < 3; k++) s += `<rect x="${x + 6 + k * 10}" y="${-hh + 8 + (k % 2) * 10}" width="5" height="6" fill="#ffd27a" opacity=".85"/>`; } if (anc && n) for (let i = 0; i < 18; i++) s += `<circle cx="${-190 + i * 22}" cy="${-8 - (i * 13) % 30}" r="2.5" fill="#ffc050"/><circle cx="${-190 + i * 22}" cy="${-8 - (i * 13) % 30}" r="9" fill="#ffa030" opacity=".25"/>`; return s; },
  warehouses: n => [-150, -60, 30, 120].map(x => `<rect x="${x - 40}" y="-70" width="80" height="70" fill="${n ? '#2a2830' : '#8a7a6a'}"/><polygon points="${x - 44},-70 ${x},-92 ${x + 44},-70" fill="${n ? '#22202a' : '#6a5a4a'}"/><rect x="${x - 14}" y="-40" width="28" height="40" fill="#120e0a"/>`).join(''),
  boat: () => `<path d="M-90,0 L90,0 L76,18 L-80,18Z" fill="#e8e0d0"/><rect x="-70" y="-26" width="130" height="26" fill="#a8c8d8" opacity=".7" stroke="#e8e0d0" stroke-width="3"/>${[-50, -26, -2, 22, 46].map(x => `<line x1="${x}" y1="-26" x2="${x}" y2="0" stroke="#e8e0d0" stroke-width="2"/>`).join('')}<path d="M-72,-26 Q0,-40 62,-26" fill="none" stroke="#e8e0d0" stroke-width="3"/>`,
  stables: n => [-70, 20].map(x => `<rect x="${x - 40}" y="-50" width="80" height="50" fill="${n ? '#3a2e22' : '#7a5a3a'}"/><polygon points="${x - 46},-50 ${x},-70 ${x + 46},-50" fill="${n ? '#2a2018' : '#5a3a22'}"/>${[-26, -6, 14].map(k => `<line x1="${x + k}" y1="-50" x2="${x + k}" y2="0" stroke="#000" opacity=".3"/>`).join('')}<rect x="${x - 10}" y="-30" width="20" height="30" fill="#0e0a06"/>`).join('') + `<g fill="#0e0c0a"><rect x="-30" y="-36" width="8" height="36"/><circle cx="-26" cy="-40" r="5"/><rect x="60" y="-34" width="8" height="34"/><circle cx="64" cy="-38" r="5"/></g>`,
  horsemen: () => [-40, 0, 40].map(x => `<g transform="translate(${x} 0)" fill="#1a1612"><path d="M-14,-12 q0,-10 14,-10 h8 l6,-6 l4,2 l-4,8 v6 l-2,10 h-3 v-8 h-16 v8 h-3z"/><rect x="-6" y="-34" width="6" height="14"/><circle cx="-3" cy="-38" r="4"/></g>`).join(''),
  spire: n => `<polygon points="0,-130 14,-50 -14,-50" fill="${n ? '#2a2830' : '#6a6870'}"/><rect x="-18" y="-50" width="36" height="50" fill="${n ? '#2a2830' : '#7a7870'}"/><rect x="18" y="-30" width="70" height="30" fill="${n ? '#24222a' : '#8a8478'}"/>`
};

// which way the landmarks lie, as the text says ("the lighthouse to the west")
function landmarkDirs(ctx) {
  if (ctx.st !== 'land') return [];
  const { rd } = ctx; const out = [];
  for (const [src, key] of LM) {
    const m = rd.find(src); if (!m) continue;
    const s = rd.sentence(m.i);
    // the clause the landmark is in
    const pos = m.i - rd.t.indexOf(s);
    const parts = s.split(/[,;]/); let acc = 0, cl = s;
    for (const p of parts) { if (pos >= acc && pos <= acc + p.length) { cl = p; break; } acc += p.length + 1; }
    const d = /\b(north|south|east|west|northeast|northwest|southeast|southwest)\b/.exec(cl);
    if (d && !/\bof\b/.test(cl.slice(d.index + d[0].length, d.index + d[0].length + 4))) out.push({ dir: GT().COMPASS.indexOf(d[1]), key });
    else if (d) out.push({ dir: (GT().COMPASS.indexOf(d[1]) + 4) % 8, key });
  }
  return out;
}

// ---------------------------------------------------------------- the open air
function LAND(ctx) {
  const { h, rd, name } = ctx, { add, lin, R, tag } = h;
  const night = rd.has('night|moonlit|moonlight|starry|stars|camp-fires|camp fires|campfire|firelight|torches|celebration|procession|party|lit up|dark stone jetty|embers') || /^(jetty|crossroads|stadium|outside the|warehouses|causeway|encampment|beneath dolmen|near dolmen|camp fire|premonition|entrance|roman villa|stream|valley|spur|hanging|murky)/i.test(name);
  const dawn = rd.has('dawning|dawn|first light');
  const high = rd.has('overlooking|view over|splendid view|on top of|clifftop|crags|natural shelf|cliffs|spire|cascades down the hillside|hanging perilously|spur of rock|up on the hill');
  const anc = rd.has('alexandria|ptolem|chlamys|heptastadion|pharos|ancient|greek|roman|villa|temple|labyrinth|taverna|goats');
  const seaW = rd.has('sea|mediterranean|harbour(?!-)|the waters|waters lap|waves|shore');
  const riverW = rd.has('river|urban waters|stream');
  const hz = high ? 108 : 150;
  ctx.hz = hz;
  // sky
  if (night) { add(`<rect width="${W}" height="${H}" fill="${lin('sk', [[0, '#070a1e'], [.6, '#1a2448'], [1, '#3a3a5a']])}"/>`); h.stars(110, hz - 10, .9); if (rd.has('moon|moonlit|moonlight|clear|starry|frosty')) h.moon(R(60, 340), R(28, 58), 11); }
  else if (dawn) { add(`<rect width="${W}" height="${H}" fill="${lin('sk', [[0, '#3a4a7a'], [.6, '#e8a07a'], [1, '#f8d8a0']])}"/>`); h.glow(R(240, 340), hz, 120, '#ffd8a0', .6); }
  else if (rd.has('storm|rain')) add(`<rect width="${W}" height="${H}" fill="${lin('sk', [[0, '#3a4250'], [1, '#6a7280']])}"/>`);
  else { add(`<rect width="${W}" height="${H}" fill="${lin('sk', [[0, '#6a9ac8'], [1, '#d8e6ea']])}"/>`); add(`<circle cx="${f1(R(50, 350))}" cy="${f1(R(26, 50))}" r="15" fill="#fff8dc" opacity=".95"/>`); for (let i = 0; i < 4; i++) add(`<ellipse cx="${f1(R(0, W))}" cy="${f1(R(20, hz - 50))}" rx="${f1(R(30, 60))}" ry="${f1(R(6, 11))}" fill="#fff" opacity="${f1(R(.3, .55) * 100) / 100}"/>`); }
  // far layer
  const dim = night ? .45 : 1;
  const tint = (day, nightC) => night ? nightC : day;
  if (seaW) {
    add(`<rect y="${hz}" width="${W}" height="${H - hz}" fill="${lin('sea', [[0, tint('#5a8ab0', '#1e2a4a')], [1, tint('#1e4a68', '#0a1020')]])}"/>`);
    for (let i = 0; i < 26; i++) { const y = R(hz + 4, H), x = R(-20, W), l = R(8, 34) * (y / 180); add(`<path d="M${f1(x)},${f1(y)} q${f1(l / 2)},-3 ${f1(l)},0" stroke="${night ? '#c8d0f0' : '#fff'}" stroke-width=".8" fill="none" opacity="${f1(R(.12, .4) * 100) / 100}"/>`); }
    if (night) add(`<rect x="${f1(R(120, 280))}" y="${hz}" width="20" height="${H - hz}" fill="${lin('mr', [[0, '#f4ecd0', .45], [1, '#f4ecd0', 0]])}"/>`);
  } else {
    h.ridge(hz - 6, 8, tint('#8aa0a8', '#262c44'), 6);
  }
  const ground = /spire/i.test(name) ? 'grass' : rd.has('fields|meadow|grassy|grassland|lawn|pastures') && !rd.has('sacred earth') ? 'grass' : rd.has('flagstoned|flagstones|forecourt') ? 'flags' : rd.has('gravel|drive') ? 'gravel' : rd.has('street|road|pavement|crossroads|buildings') ? 'road' : rd.has('muddy|mud|hollow') ? 'mud' : rd.has('rock|crags|cliff|cliffs|spur|shelf|rope') ? 'rock' : rd.has('lead spire|spire') ? 'lead' : rd.has('sand|beach') ? 'sand' : rd.has('earth|turf|path across') && rd.has('sacred') ? 'earth' : 'grass';
  // the near ground
  const gcol = { grass: ['#5a8a44', '#2e5224'], gravel: ['#a8987a', '#6a5a44'], road: ['#4a4640', '#24221e'], mud: ['#5a4a2e', '#2e2416'], rock: ['#6a5a4a', '#3a3026'], lead: ['#7a7e86', '#4a4e56'], sand: ['#d8c08a', '#a8905a'], flags: ['#a8a090', '#6a645a'], earth: ['#8a6a44', '#4a3622'] }[ground];
  const gy = seaW ? (ground === 'rock' || high ? hz + 46 : hz + 54) : hz + 4;
  const ny = night ? .45 : 0;
  if (!(seaW && ground === 'grass' && !rd.has('grass|grassy|fields|grassland'))) {
    const shape = seaW ? `M0,${H} L0,${gy + 10} Q120,${gy - 6} 220,${gy + 14} Q300,${gy + 26} ${W},${gy + 4} L${W},${H}Z` : `M0,${gy} Q200,${gy - 8} ${W},${gy + 2} L${W},${H} L0,${H}Z`;
    add(`<path d="${shape}" fill="${lin('gr', [[0, gcol[0]], [1, gcol[1]]])}"/>`);
    if (ny) add(`<path d="${shape}" fill="#0a0e20" opacity="${ny}"/>`);
    if (ground === 'flags') { let d = ''; for (let k = 1; k < 6; k++) { const y = gy + (H - gy) * Math.pow(k / 6, 1.5); d += `M0,${f1(y)}H${W}`; } for (let i = 0; i <= 10; i++) d += `M${f1(lerp(-200, 600, i / 10))},${H}L${f1(lerp(120, 280, i / 10))},${gy}`; add(`<path d="${d}" stroke="#000" opacity=".25" stroke-width="1"/>`); }
    if (ground === 'grass') for (let i = 0; i < 60; i++) { const x = R(0, W), y = R(gy + 6, H); add(`<path d="M${f1(x)},${f1(y)} l-2,-${f1(3 + (y - gy) / 14)} M${f1(x)},${f1(y)} l2,-${f1(3 + (y - gy) / 16)}" stroke="${night ? '#1e2e1a' : '#3a6a2a'}" stroke-width="1"/>`); }
    if (ground === 'rock') for (let i = 0; i < 18; i++) { const x = R(0, W), y = R(gy + 6, H); add(`<path d="M${f1(x)},${f1(y)} l${f1(R(10, 30))},${f1(R(-6, 4))} l${f1(R(-4, 6))},${f1(R(6, 14))}z" fill="#000" opacity=".2"/>`); }
  }
  // a river between here and the far bank
  if (riverW && !seaW && !rd.has('stream runs|a stream|cascades')) {
    add(`<path d="M0,${hz - 4} Q200,${hz - 12} ${W},${hz - 2} L${W},${hz + 6} L0,${hz + 6}Z" fill="${night ? '#1a2018' : '#5a6a4a'}"/>`);
    add(`<rect y="${hz + 4}" width="${W}" height="38" fill="${lin('rv', [[0, night ? '#2a3040' : '#6a6048'], [1, night ? '#1a2030' : '#4a4230']])}"/>`);
    for (let i = 0; i < 14; i++) add(`<path d="M${f1(R(0, W))},${f1(R(hz + 10, hz + 40))} q8,-2 16,0" stroke="#c8c0a0" stroke-width=".8" fill="none" opacity=".35"/>`);
    ctx.riverY = hz + 24;
  }
  // landmarks, placed where the text puts them
  const dirs = landmarkDirs(ctx);
  const placed = [];
  const relX = r => [200, 310, 384, null, null, null, 16, 90][r];
  let slot = 0;
  const lmOrder = LM.map(l => l[1]);
  for (const [src, key, defRel] of LM) {
    const m = rd.find(src); if (!m) continue;
    if (key === 'spire' && /spire/i.test(name)) continue;
    if (key === 'hall' && /beside the drive/i.test(name)) continue;
    const dd = dirs.find(d => d.key === key);
    let rel = dd ? ctx.rel(dd.dir) : defRel;
    if (rel === 3 || rel === 4 || rel === 5) { if (dd) continue; rel = 0; }
    let x = relX(rel); if (x === null || x === undefined) x = 200;
    while (placed.some(px => Math.abs(px - x) < 70) && slot < 6) { x = [120, 280, 60, 340, 200, 160][slot++]; }
    placed.push(x);
    const big = { palace: 1, stadium: 1, theatre: 1, city: 1, warehouses: 1, thorns: 1, campring: 1, hall: high ? .5 : 1, temple: 1, villa: 1, taverna: 1 }[key];
    const sc = (high ? .55 : .85) * (big ? 1 : .9) * (key === 'thorns' && !/thorns|sacred/i.test(name) ? .45 : 1) * (key === 'hall' && /spire/i.test(name) ? .5 : 1);
    // the tourist boat, once waved over, lies moored close to this bank instead of on the far one
    const sOpen = o => !!(h.st && h.st.known && h.st.open(o, false));
    const near = key === 'boat' && (rd.has('moored close to the bank') || sOpen('tourist boat'));
    let baseY = key === 'boat' ? (ctx.riverY || (seaW ? hz + 26 : hz + 10)) : key === 'campring' ? hz + 60 : hz + (high ? 6 : 10);
    if (near) { baseY += 46; x = 200; }
    if (seaW && !/lighthouse|boat|cave|city|warehouses/.test(key)) add(`<ellipse cx="${f1(x)}" cy="${f1(baseY + 2)}" rx="${f1(120 * sc)}" ry="${f1(14 * sc)}" fill="${night ? '#1e2218' : '#6a7a4a'}"/>`);
    if (key === 'dolmen') { ctx.surf = ctx.surf || {}; ctx.surf.dolmen = { x, y: baseY - 98 * sc, s: sc }; }
    let body = (D[key] || (() => ''))(night, anc);
    // the ragged gap burnt out of the thorns
    if (key === 'thorns' && (rd.has('ragged gap in the wall') || sOpen('wall of thorns'))) body += `<path d="M-34,0 L-30,-30 L-18,-50 L-4,-58 L10,-52 L22,-40 L32,-18 L36,0Z" fill="${night ? '#0e1018' : '#4a6a3a'}"/><path d="M-34,0 L-30,-30 L-18,-50 L-4,-58 L10,-52 L22,-40 L32,-18 L36,0" stroke="#1a1410" stroke-width="5" fill="none"/>${[[-26, -34], [-10, -54], [18, -44], [30, -16]].map(([px, py]) => `<circle cx="${px}" cy="${py}" r="4" fill="#3a2a20" opacity=".8"/>`).join('')}`;
    add(tag(m.w.replace(/^(the|a|an|side of an|side of a) /, ''), at(key === 'city' || key === 'warehouses' || key === 'thorns' ? 200 : x, baseY, sc * (near ? 1.7 : 1), body)));
    if (key === 'campring' || key === 'lighthouse' && night) h.glow(x, baseY - 30, 140, '#ff9a40', .25);
  }
  // ways out across the ground
  for (const e of ctx.exits) {
    if (e.dir === null || !/path|way|crawl|doorway|passage|stairs/.test(e.type)) continue;
    const r = ctx.rel(e.dir); if (r === 3 || r === 4 || r === 5) continue;
    if (e.type === 'crawl' || e.type === 'doorway' || e.type === 'stairs') continue;
    const tx = { 0: 200, 1: 300, 7: 100, 2: W + 30, 6: -30 }[r], ty = r === 2 || r === 6 ? gy + 30 : gy + 2;
    const pc = { grass: '#c8b88e', gravel: '#c8b896', road: '#5a564e', mud: '#7a6440', rock: '#8a7a64', lead: '#8a8e96', sand: '#e8d4a0', flags: '#b8b0a0', earth: '#b89a6a' }[ground];
    add(`<path d="M150,${H} Q${f1((150 + tx) / 2)},${f1((H + ty) / 2 + 6)} ${f1(tx - 4)},${f1(ty)} L${f1(tx + 4)},${f1(ty)} Q${f1((250 + tx) / 2)},${f1((H + ty) / 2 + 6)} 250,${H}Z" fill="${pc}" opacity="${night ? .45 : .8}"/>`);
  }
  LANDFEAT(ctx, { night, gy, hz, high, seaW, riverW, ground, anc });
  if (night) add(`<rect width="${W}" height="${H}" fill="#0a1030" opacity=".18"/>`);
}

// near things in the open air
function LANDFEAT(ctx, E) {
  const { h, rd } = ctx, { add, R, tag } = h;
  const { night, gy, hz } = E;
  ctx.anchor = ctx.anchor || {};
  const T = (k, s) => tag(m && m.w ? m.w.replace(/^(the|a|an) /, '') : k, s);
  const f = src => rd.find(src);
  let m;
  if ((m = f('fig tree'))) { add(T('fig tree', at(318, 236, 1, `<path d="M0,0 q-6,-60 -2,-110 M-2,-90 q-30,-10 -60,-4 M-2,-70 q30,-14 54,-8" stroke="#4a3a24" stroke-width="9" fill="none"/>${Array.from({ length: 14 }, (_, i) => `<path d="M${-70 + (i * 37) % 130},${-110 + (i * 23) % 50} q10,-12 20,0 q-10,12 -20,0z" fill="${night ? '#1e3a1e' : '#3a6a2a'}"/>`).join('')}`))); ctx.anchor.tree = { x: 290, y: 176, s: 1, k: 1.2 }; }
  if ((m = f('trees')) && !f('fig tree')) for (const [x, s] of [[40, 1], [360, .9], [90, .6]]) h.tree(x, gy + 30 * s, 60 * s, night ? '#1a2a1a' : '#2e5a2a');
  if ((m = f('thorny hedge|hedge'))) add(T('hedge', `<path d="M0,${gy + 8} Q80,${gy - 18} 160,${gy + 4} L160,${gy + 26} L0,${gy + 30}Z" fill="${night ? '#14200f' : '#2a4a1e'}"/>` + Array.from({ length: 14 }, (_, i) => `<path d="M${10 + i * 11},${gy - 2 + (i % 3) * 4} l4,-8 l3,8" stroke="#4a3a24" fill="none"/>`).join('')));
  if ((m = f('reeds'))) { let s = ''; for (let i = 0; i < 46; i++) { const x = R(0, W), y = R(gy + 20, H); s += `<path d="M${f1(x)},${f1(y)} q${f1(R(-4, 4))},-${f1(R(16, 34))} ${f1(R(-6, 6))},-${f1(R(26, 44))}" stroke="${night ? '#2a3a1e' : '#6a7a3a'}" stroke-width="1.6" fill="none"/>`; } add(T('reeds', s)); }
  if ((m = f("bird's nest|nest"))) { add(T('nest', at(200, 246, 1, `<ellipse cx="0" cy="-8" rx="44" ry="13" fill="#6a4a24"/><path d="M-40,-12 q40,-14 80,0 M-36,-6 q36,10 72,0" stroke="#3a2410" stroke-width="2" fill="none"/>`))); ctx.anchor.nest = { x: 236, y: 240, s: 1, k: 1 }; }
  if ((m = f('stile'))) add(T('stile', at(110, 246, 1, `<rect x="-50" y="-70" width="8" height="70" fill="#6a4a28"/><rect x="42" y="-70" width="8" height="70" fill="#6a4a28"/><rect x="-60" y="-56" width="120" height="7" fill="#7a5a34"/><rect x="-60" y="-30" width="120" height="7" fill="#7a5a34"/><rect x="-30" y="-14" width="60" height="6" fill="#8a6a40"/>`)));
  if ((m = f('mountain goats|goats|goat pastures'))) for (const [x, y, s, fl] of [[250, gy + 40, .8, 0], [320, gy + 24, .55, 1], [130, gy + 30, .6, 1]]) add(T('goats', at(x, y, s, `<ellipse cx="0" cy="-26" rx="26" ry="13" fill="#d8d0c0"/><path d="M-18,-16 v16 M-8,-16 v16 M10,-16 v16 M20,-16 v16" stroke="#8a8478" stroke-width="4"/><path d="M22,-34 q10,-8 16,-2 l-2,12 q-8,2 -14,-4z" fill="#d8d0c0"/><path d="M30,-38 q-2,-14 -10,-16 M34,-38 q2,-14 -4,-18" stroke="#6a5a4a" stroke-width="2.5" fill="none"/>`, fl)));
  if ((m = f('mounds|rubbish'))) { add(T('rubbish', `<path d="M0,${H} Q40,${gy + 40} 110,${gy + 52} Q170,${gy + 44} 210,${H}Z" fill="#4a3e2a"/><path d="M220,${H} Q280,${gy + 56} 360,${gy + 60} Q390,${gy + 66} 400,${H}Z" fill="#3e3424"/>` + [[40, 236], [80, 226], [300, 238], [150, 250], [340, 232]].map(([x, y], i) => `<rect x="${x}" y="${y}" width="${10 + i * 2}" height="6" fill="${['#8a8a7a', '#6a5a4a', '#a89a7a', '#5a6a5a', '#7a6a5a'][i]}" transform="rotate(${i * 25} ${x} ${y})"/>`).join(''))); if (f('rats')) add(T('rats', [[120, 238], [270, 248]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="9" ry="5" fill="#2a2420"/><circle cx="${x + 9}" cy="${y - 2}" r="3.5" fill="#2a2420"/><path d="M${x - 9},${y} q-10,2 -14,-4" stroke="#2a2420" fill="none"/>`).join(''))); ctx.anchor.mound = { x: 110, y: 214, s: 1 }; }
  if ((m = f('harbourside table'))) { add(T('table', at(196, 246, .9, `<rect x="-50" y="-52" width="100" height="8" fill="#6a4a2a"/><rect x="-44" y="-44" width="6" height="44" fill="#4a2e18"/><rect x="38" y="-44" width="6" height="44" fill="#4a2e18"/>`))); ctx.surf = ctx.surf || {}; ctx.surf.table = { x: 230, y: 200, s: .9 }; }
  if ((m = f('down some steps|steps below'))) add(T('steps', `<polygon points="60,${gy + 24} 150,${gy + 24} 160,${gy + 44} 50,${gy + 44}" fill="#0a0806"/>${[0, 1, 2].map(i => `<rect x="${56 + i * 3}" y="${gy + 28 + i * 5}" width="${98 - i * 6}" height="4" fill="#3a3630"/>`).join('')}`));
  if ((m = f('metropolitan sign'))) add(T('sign', `<rect x="100" y="${gy - 30}" width="4" height="54" fill="#2a3a2a"/><rect x="64" y="${gy - 46}" width="76" height="18" rx="3" fill="#e8d8a0" stroke="#2a3a2a" stroke-width="2"/><text x="102" y="${gy - 33}" text-anchor="middle" font-family="Georgia,serif" font-size="9" fill="#2a3a2a">METROPOLITAN</text>`));
  if ((m = f('a clock|old clock')) && !/spire/i.test(ctx.name)) add(T('clock', `<rect x="296" y="${gy - 70}" width="5" height="90" fill="#1a1a1a"/><circle cx="298" cy="${gy - 78}" r="15" fill="#efe6cc" stroke="#1a1a1a" stroke-width="3"/><path d="M298,${gy - 78} v-10 M298,${gy - 78} l7,4" stroke="#1a1a1a" stroke-width="2"/>`));
  if ((m = f('black-suited pedestrians|pedestrians|bowler-hatted'))) { let s = ''; for (let i = 0; i < 22; i++) { const x = 150 + i * 12 + (i % 3) * 4, y = gy + 26 + (i % 4) * 8, k = .8 + (i % 4) * .1; s += `<g transform="translate(${x} ${y}) scale(${k})"><rect x="-6" y="-34" width="12" height="34" fill="#141418"/><circle cy="-40" r="5.5" fill="#d8b890"/><ellipse cy="-45" rx="8" ry="2" fill="#141418"/><rect x="-5" y="-52" width="10" height="7" rx="3" fill="#141418"/>${i % 3 === 0 ? '<rect x="7" y="-22" width="10" height="7" fill="#2a1a10"/>' : ''}</g>`; } add(T('pedestrians', s)); }
  if ((m = f('procession|kaleidoscopic din|it looks full'))) { let s = ''; for (let i = 0; i < 30; i++) { const x = R(10, 390), y = R(gy + 30, H - 4), k = (y - gy) / 70; s += `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(k * 100) / 100})"><rect x="-6" y="-32" width="12" height="32" rx="4" fill="${['#c84a3a', '#e8d8b0', '#3a5a8a', '#d8a830', '#6a3a6a'][i % 5]}"/><circle cy="-38" r="6" fill="#c8945a"/>${i % 4 === 0 ? `<line x1="8" y1="-30" x2="12" y2="-60" stroke="#6a4a28" stroke-width="2"/><circle cx="12" cy="-62" r="4" fill="#ffc050"/>` : ''}</g>`; } add(T('procession', s)); }
  if ((m = f('there are of course guards|guards'))) add(T('guards', [70, 330].map(x => `<g transform="translate(${x} ${gy + 34})"><rect x="-8" y="-46" width="16" height="46" fill="#7a3a2a"/><circle cy="-54" r="7" fill="#c8945a"/><path d="M-8,-58 q8,-12 16,0" fill="#c8a040"/><line x1="12" y1="0" x2="14" y2="-80" stroke="#6a4a28" stroke-width="3"/><path d="M14,-80 l-4,10 h8z" fill="#9aa0a8"/><ellipse cx="-12" cy="-26" rx="8" ry="12" fill="#c8a040"/></g>`).join('')));
  if ((m = f('figures of men'))) add(T('men', [150, 250].map(x => `<g transform="translate(${x} ${gy + 4}) scale(.6)" fill="#1a1612"><rect x="-6" y="-36" width="12" height="36"/><circle cy="-42" r="6"/></g>`).join('')));
  if ((m = f('platoon of soldiers|soldiers sit|soldiers are sitting|soldiers'))) { let s = ''; for (let i = 0; i < 7; i++) { const a = Math.PI * (.1 + i * .13), x = 200 + Math.cos(a) * 120, y = 214 + Math.sin(a) * 18 - 10; s += `<g transform="translate(${f1(x)} ${f1(y)}) scale(.9)"><path d="M-12,0 q0,-26 12,-30 q12,4 12,30z" fill="#2a2418"/><circle cy="-36" r="7" fill="${night ? '#5a4030' : '#a87a58'}"/><path d="M-8,-40 q8,-10 16,0" fill="#4a4a4a"/></g>`; } add(T('soldiers', s)); }
  if ((m = f('embers|campfire of hot coals|hot coals|embers of a fire'))) { add(T('fire', `<ellipse cx="200" cy="232" rx="40" ry="9" fill="#2a1408"/>${Array.from({ length: 16 }, (_, i) => `<circle cx="${f1(172 + (i * 37) % 56)}" cy="${f1(228 + (i * 13) % 8)}" r="${f1(2 + (i % 3))}" fill="${i % 2 ? '#ff6a1a' : '#ffb040'}"/>`).join('')}`)); h.glow(200, 228, 110, '#ff7a2a', .5); }
  if ((m = f('collapsed'))) add(T('tent', `<path d="M40,${H} Q90,${gy + 40} 170,${gy + 56} Q200,${gy + 70} 180,${H}Z" fill="#5a4430"/><line x1="70" y1="${gy + 60}" x2="160" y2="${gy + 30}" stroke="#4a3420" stroke-width="5"/>`));
  if ((m = f('hemp rope|securely fastened rope|rope'))) add(T('rope', `<path d="M210,0 q8,80 -4,150 q-6,40 4,110" stroke="#c8a870" stroke-width="4" fill="none"/>`));
  if (/hanging on rope/i.test(ctx.name)) add(`<path d="M150,${H} L140,0 L0,0 L0,${H}Z" fill="#3a3026"/><path d="M150,${H} L140,0" stroke="#5a4a3a" stroke-width="3"/>`);
  if ((m = f('yellow daisy|daisy'))) add(T('daisy', `<path d="M120,190 q10,-6 24,0 q-4,10 -24,6z" fill="#4a6a2a"/><path d="M132,190 v-14" stroke="#4a7a2a" stroke-width="2"/>${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<ellipse cx="${f1(132 + Math.cos(i * .785) * 5)}" cy="${f1(174 + Math.sin(i * .785) * 5)}" rx="3" ry="1.6" fill="#f4e050" transform="rotate(${i * 45} ${f1(132 + Math.cos(i * .785) * 5)} ${f1(174 + Math.sin(i * .785) * 5)})"/>`).join('')}<circle cx="132" cy="174" r="2.6" fill="#c88a20"/>`));
  if ((m = f('rough ladder|ladder'))) add(T('ladder', `<line x1="250" y1="${gy + 70}" x2="226" y2="${gy - 34}" stroke="#7a5a34" stroke-width="5"/><line x1="282" y1="${gy + 70}" x2="258" y2="${gy - 34}" stroke="#7a5a34" stroke-width="5"/>${Array.from({ length: 7 }, (_, i) => `<line x1="${f1(248 - i * 3.6)}" y1="${f1(gy + 60 - i * 15)}" x2="${f1(280 - i * 3.6)}" y2="${f1(gy + 60 - i * 15)}" stroke="#6a4a28" stroke-width="4"/>`).join('')}`));
  if ((m = f('cascades|stream runs|a stream'))) add(T('stream', `<path d="M150,${gy - 4} Q170,${gy + 30} 140,${gy + 60} Q110,${H - 20} 150,${H} L230,${H} Q200,${H - 30} 210,${gy + 60} Q230,${gy + 26} 180,${gy - 4}Z" fill="${night ? '#3a5a8a' : '#8ab8d8'}" opacity=".85"/>${[0, 1, 2, 3, 4].map(i => `<path d="M${160 + i * 8},${gy + 10 + i * 18} q6,6 12,0" stroke="#e8f4ff" fill="none" opacity=".7"/>`).join('')}`));
  if ((m = f('dark stone jetty|jetty'))) { add(T('jetty', `<polygon points="0,${gy + 30} 220,${gy + 22} 260,${H} 0,${H}" fill="#2a2a30"/><path d="M0,${gy + 30} L220,${gy + 22}" stroke="#4a4a52" stroke-width="3"/>`)); }
  if ((m = f('skiff')) && !/harbour mouth|drifting/i.test(ctx.name)) add(T('skiff', at(300, gy + 50, .9, `<path d="M-60,0 L60,0 L48,14 L-50,14Z" fill="#6a4a2a"/><line x1="0" y1="0" x2="0" y2="-90" stroke="#4a3018" stroke-width="3"/><path d="M2,-86 Q40,-50 2,-10Z" fill="#e8dcc0"/><line x1="-50" y1="6" x2="-90" y2="-6" stroke="#c8a870" stroke-width="1.5"/>`)));
  if ((m = f('rough-hewn steps'))) add(T('steps', [0, 1, 2, 3, 4].map(i => `<rect x="${30 + i * 8}" y="${gy + 20 - i * 14}" width="${70 - i * 10}" height="14" fill="${i % 2 ? '#4a4a50' : '#3a3a40'}"/>`).join('') + `<path d="M40,${gy - 50} h50 M45,${gy - 50} v-20 M60,${gy - 50} v-20 M75,${gy - 50} v-20" stroke="#5a5a62" stroke-width="3"/>`));
  if ((m = f('causeway|land bridge'))) add(T('causeway', `<polygon points="150,${H} 250,${H} 212,${hz} 188,${hz}" fill="${night ? '#4a4440' : '#b8a888'}"/><path d="M150,${H} L188,${hz} M250,${H} L212,${hz}" stroke="#2a2420" stroke-width="2"/>`));
  if ((m = f('the car|suitcases'))) add(T('car', at(300, 246, 1, `<path d="M-60,-10 q0,-20 20,-22 l14,-20 h50 l18,20 q18,2 18,22 v10 h-120z" fill="#5a2a2a"/><rect x="-28" y="-48" width="22" height="16" fill="#a8c0d0"/><rect x="2" y="-48" width="22" height="16" fill="#a8c0d0"/><circle cx="-34" cy="0" r="11" fill="#1a1a1a"/><circle cx="40" cy="0" r="11" fill="#1a1a1a"/><rect x="-96" y="-26" width="26" height="20" fill="#8a6a3a"/><rect x="-90" y="-30" width="14" height="4" fill="#5a3a1a"/>`)));
  if ((m = f('fire escape|wistaria'))) add(T('fire escape', `<rect x="0" y="0" width="120" height="${gy + 60}" fill="${night ? '#3a3440' : '#8a7a6a'}"/>${[40, 100, 160].map(y => `<rect x="20" y="${y}" width="16" height="24" fill="#2a2a3a" opacity=".7"/><rect x="70" y="${y}" width="16" height="24" fill="#2a2a3a" opacity=".7"/>`).join('')}<path d="M118,20 L140,20 L140,${gy + 60} M118,80 h22 M118,140 h22 M118,200 h22" stroke="#3a3a3a" stroke-width="3" fill="none"/>${Array.from({ length: 12 }, (_, i) => `<path d="M${120 + (i % 3) * 6},${f1(30 + i * 16)} l-10,10 M${126 + (i % 2) * 6},${f1(40 + i * 16)} l8,8" stroke="#3a3a3a" stroke-width="1.5"/>`).join('')}${Array.from({ length: 22 }, (_, i) => `<circle cx="${f1(118 + R(-6, 30))}" cy="${f1(R(10, gy + 50))}" r="${f1(R(3, 6))}" fill="${i % 3 ? '#9a7ac8' : '#3a6a2a'}" opacity=".85"/>`).join('')}`));
  if ((m = f('dragonflies|pollen'))) add(T('dragonflies', Array.from({ length: 6 }, () => { const x = R(60, 340), y = R(40, gy); return `<path d="M${f1(x - 6)},${f1(y)} h12 M${f1(x)},${f1(y)} l-4,-4 M${f1(x)},${f1(y)} l4,-4 M${f1(x)},${f1(y)} l-4,4 M${f1(x)},${f1(y)} l4,4" stroke="#3a6a8a" stroke-width="1.2"/>`; }).join('') + Array.from({ length: 30 }, () => `<circle cx="${f1(R(0, W))}" cy="${f1(R(20, gy + 40))}" r="1" fill="#f8e890" opacity=".7"/>`).join('')));
  if (/spire/i.test(ctx.name)) { if (f('farmlands|parceled')) { let s = ''; for (let i = 0; i < 18; i++) s += `<rect x="${f1(R(0, 380))}" y="${f1(R(hz + 8, hz + 80))}" width="${f1(R(30, 70))}" height="${f1(R(8, 20))}" fill="${['#6a9a4a', '#8ab05a', '#b8b060', '#5a8a3a'][i % 4]}" opacity=".6"/>`; add(s); } add(`<path d="M0,${H} L0,212 Q200,196 ${W},214 L${W},${H}Z" fill="#6a6e76"/>${Array.from({ length: 12 }, (_, i) => `<line x1="${i * 36}" y1="${H}" x2="${f1(i * 36 + (i - 6) * 3)}" y2="210" stroke="#4a4e56"/>`).join('')}`); add(T('weathervane', `<path d="M330,${H} V40 M306,74 H354 M330,58 l0,0" stroke="#3a3a3e" stroke-width="4"/><text x="300" y="78" font-size="10" fill="#3a3a3e" font-family="Georgia">W</text><text x="356" y="78" font-size="10" fill="#3a3a3e" font-family="Georgia">E</text><path d="M330,40 l-34,-4 v8z" fill="#3a3a3e"/>`)); ctx.anchor.vane = { x: 300, y: 50, s: .9, k: 1.1 }; if (f('old clock')) add(T('clock', `<circle cx="120" cy="236" r="20" fill="#efe6cc" stroke="#3a3a3e" stroke-width="4"/><path d="M120,236 v-12 M120,236 l8,5" stroke="#1a1a1a" stroke-width="2"/>`)); }
  if ((m = f('timber door'))) add(T('door', `<rect x="${f1(178)}" y="${f1(hz + 6)}" width="20" height="30" fill="#4a3420"/>`));
  if ((m = f('hillside crags|crags|shelf on the hillside|natural shelf|spur'))) add(`<path d="M0,${H} L0,${gy - 20} Q60,${gy - 30} 110,${gy + 10} Q150,${gy + 30} 140,${H}Z" fill="#4a3e32" opacity=".9"/>`);
  if ((m = f('patrols of men|tracks below'))) add(T('patrols', [260, 300, 330].map(x => `<g transform="translate(${x} ${H - 16}) scale(.5)" fill="#14110e"><rect x="-6" y="-36" width="12" height="36"/><circle cy="-42" r="6"/><circle cx="14" cy="-48" r="7" fill="#ffb050" opacity=".8"/></g>`).join('')));
}

// ---------------------------------------------------------------- on board
function DECK(ctx) {
  const { h, rd, name } = ctx, { add, lin, R, tag } = h;
  ctx.anchor = ctx.anchor || {};
  const n = (name || '').toLowerCase();
  const mist = rd.has('mist|glassy');
  const night = rd.has('night|moon|moonlight|lunar');
  const day = rd.has('brightens into day');
  if (mist) { add(`<rect width="${W}" height="${H}" fill="${lin('ms', [[0, '#b8c8d0'], [1, '#e8eef0']])}"/>`); for (let i = 0; i < 12; i++) add(`<ellipse cx="${f1(R(0, W))}" cy="${f1(R(30, 160))}" rx="${f1(R(40, 120))}" ry="${f1(R(8, 18))}" fill="#fff" opacity=".35"/>`); }
  else if (night && !day) { add(`<rect width="${W}" height="${H}" fill="${lin('sk', [[0, '#070a20'], [1, '#2a3460']])}"/>`); h.stars(100, 120, .9); h.moon(R(80, 320), 44, 13); }
  else add(`<rect width="${W}" height="${H}" fill="${lin('sk', [[0, '#7aa6c8'], [1, '#e8dcc0']])}"/>`);
  const wy = 132;
  if (rd.has('sea|water|waves|river|harbour|ripples|waters|mediterranean|drift')) {
    add(`<rect y="${wy}" width="${W}" height="${H - wy}" fill="${lin('sea', [[0, night ? '#3a4a7a' : rd.has('river|urban|brown') ? '#6a5a3a' : '#5a8ab0'], [1, night ? '#0a1030' : '#1e3a50']])}"/>`);
    for (let i = 0; i < 30; i++) { const y = R(wy + 4, H), x = R(-20, W), l = R(8, 30); add(`<path d="M${f1(x)},${f1(y)} q${f1(l / 2)},-3 ${f1(l)},0" stroke="${night ? '#e8ecff' : '#fff'}" stroke-width=".9" fill="none" opacity="${f1(R(.15, .5) * 100) / 100}"/>`); }
    if (night) add(`<rect x="${f1(R(140, 260))}" y="${wy}" width="22" height="${H - wy}" fill="${lin('mr', [[0, '#e8ecff', .5], [1, '#e8ecff', 0]])}"/>`);
  } else add(`<rect y="${wy}" width="${W}" height="${H - wy}" fill="#dde6ea" opacity=".8"/>`);
  if (rd.has('reddish sand bank|sand bank')) add(tag('sand bank', `<path d="M150,${wy} q50,-10 100,0z" fill="#c88a6a"/>`));
  if (rd.has('pharos light|pharos')) { add(tag('Pharos', at(70, wy + 2, .7, D.lighthouse(true)))); h.glow(70, wy - 120, 100, '#ffd27a', .4); }
  if (rd.has('jaws of the royal harbour|jaws')) add(`<path d="M0,${wy} L0,${wy - 30} L60,${wy - 20} L120,${wy}Z M${W},${wy} L${W},${wy - 26} L330,${wy - 16} L280,${wy}Z" fill="#14121a"/>`);
  if (rd.has('curious fish|fish')) for (let i = 0; i < 7; i++) { const x = R(30, 370), y = R(wy + 30, 230); add(tag('fish', `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="12" ry="4" fill="#2a3a5a" opacity=".6"/><circle cx="${f1(x + 7)}" cy="${f1(y - 1)}" r="1.8" fill="#c8f060"/>`)); }
  if (/river-boat|glass-roofed/.test(rd.t)) {
    add(`<path d="M0,${H} L0,200 L400,200 L400,${H}Z" fill="#5a4a3a"/>`);
    add(`<path d="M400,150 Q340,140 300,160 L400,190Z" fill="#3a4a2e"/>`);
    add(tag('glass-roofed', `<path d="M0,40 Q200,0 400,40" stroke="#c8d0d8" stroke-width="6" fill="none"/>${[40, 120, 200, 280, 360].map(x => `<line x1="${x}" y1="${f1(40 - Math.sin(x / 400 * Math.PI) * 30)}" x2="${x}" y2="200" stroke="#c8d0d8" stroke-width="4"/>`).join('')}<rect width="${W}" height="200" fill="#c8e0f0" opacity=".1"/>`));
    if (rd.has('helm|wheel')) add(tag('helm', `<rect x="244" y="150" width="12" height="50" fill="#5a3a20"/><circle cx="250" cy="140" r="22" fill="none" stroke="#7a5430" stroke-width="5"/>${[0, 1, 2, 3].map(i => `<line x1="${f1(250 + Math.cos(i * .785) * 30)}" y1="${f1(140 + Math.sin(i * .785) * 30)}" x2="${f1(250 - Math.cos(i * .785) * 30)}" y2="${f1(140 - Math.sin(i * .785) * 30)}" stroke="#6a4626" stroke-width="3.5"/>`).join('')}<circle cx="250" cy="140" r="5" fill="#5a3a1a"/>`));
    return;
  }
  if (/^prow/.test(n)) {
    add(`<polygon points="0,${H} 400,${H} 230,150 170,150" fill="${lin('dk', [[0, '#8a6a44'], [1, '#5a4024']])}"/>`);
    for (let i = 1; i < 8; i++) add(`<line x1="${f1(i * 57)}" y1="${H}" x2="${f1(170 + i * 8.6)}" y2="150" stroke="#3a2614" stroke-width="1.2"/>`);
    add(`<path d="M0,190 L170,150 M400,190 L230,150" stroke="#4a3018" stroke-width="8"/><path d="M0,200 L170,156 M400,200 L230,156" stroke="#6a4a28" stroke-width="3"/>`);
    add(tag('figurine', `<path d="M192,150 q-4,-40 8,-60 q12,20 8,60z" fill="#e8d8b8"/><circle cx="200" cy="84" r="8" fill="#e8c8a0"/><path d="M192,80 q8,-12 16,0 l2,14 q-10,-6 -20,0z" fill="#8a3a2a"/><path d="M194,110 h12 M193,124 h14" stroke="#3a6aa8" stroke-width="3"/>`));
    ctx.anchor.figurehead = { x: 214, y: 118, s: .9, k: 1.1 };
    return;
  }
  if (/^stern/.test(n)) {
    if (mist) add(`<ellipse cx="200" cy="100" rx="60" ry="40" fill="#8a9aa8" opacity=".4"/><ellipse cx="200" cy="100" rx="30" ry="22" fill="#6a7a88" opacity=".4"/>`);
    add(`<rect x="0" y="176" width="400" height="84" fill="${lin('dk', [[0, '#7a5a38'], [1, '#4a3020']])}"/>`);
    for (let i = 1; i < 10; i++) add(`<line x1="${i * 40}" y1="176" x2="${i * 46 - 30}" y2="${H}" stroke="#3a2614"/>`);
    add(`<rect x="0" y="150" width="400" height="10" fill="#5a3a20"/>${[20, 80, 140, 200, 260, 320, 380].map(x => `<rect x="${x - 3}" y="156" width="6" height="22" fill="#4a3018"/>`).join('')}<rect x="0" y="174" width="400" height="5" fill="#3a2614"/>`);
    if (rd.has('capstan')) add(tag('capstan', at(110, 240, 1, S().capstan())));
    if (rd.has('anchor chain|chain')) add(tag('chain', `<path d="M136,206 Q200,196 250,170 L262,150" stroke="#6a6a72" stroke-width="6" fill="none" stroke-dasharray="7 3"/>`));
    return;
  }
  // in the skiff
  add(`<path d="M-20,${H} Q0,176 200,170 Q400,176 420,${H}Z" fill="#6a4a2a"/><path d="M0,${H} Q30,190 200,186 Q370,190 400,${H}Z" fill="#4a3018"/><path d="M-20,${H} Q0,176 200,170 Q400,176 420,${H}" stroke="#8a6a40" stroke-width="5" fill="none"/>${[90, 200, 310].map(x => `<rect x="${x - 30}" y="${x === 200 ? 210 : 226}" width="60" height="8" fill="#7a5a34"/>`).join('')}`);
  add(tag('skiff', `<line x1="200" y1="210" x2="200" y2="10" stroke="#4a3018" stroke-width="5"/><path d="M204,18 Q290,90 204,180Z" fill="#e8dcc0" opacity=".95"/>`));
}
const GP = () => (typeof window !== 'undefined' && window.ZGenParts && window.ZGenParts.S) ? window.ZGenParts : require('./genparts.js');
function S() { return GP().S; }

// ---------------------------------------------------------------- inside a tent
function TENT(ctx) {
  const { h, rd } = ctx, { add, lin, R, tag } = h;
  ctx.anchor = ctx.anchor || {};
  add(`<rect width="${W}" height="${H}" fill="#1a120a"/>`);
  add(`<path d="M0,190 L200,-10 L400,190 L400,${H} L0,${H}Z" fill="${lin('hw', [[0, '#6a5034'], [1, '#3a2a18']])}"/>`);
  for (let i = 0; i < 9; i++) add(`<path d="M200,-10 L${f1(-40 + i * 60)},${f1(190 + Math.abs(i - 4) * 8)}" stroke="#2a1a0c" stroke-width="2" opacity=".6"/>`);
  for (let i = 0; i < 30; i++) add(`<path d="M${f1(R(10, 390))},${f1(R(60, 200))} l6,3" stroke="#2a1a0c" stroke-width="1" opacity=".5"/>`);
  add(`<path d="M0,190 Q200,170 400,190 L400,${H} L0,${H}Z" fill="${lin('gr', [[0, '#2e2416'], [1, '#14100a']])}"/>`);
  if (rd.has('central pole|supported by')) add(tag('pole', `<rect x="194" y="-10" width="12" height="232" fill="#5a3e22"/><rect x="194" y="-10" width="4" height="232" fill="#000" opacity=".2"/>`));
  if (rd.has('dim light from the camp-fires|camp-fires outside')) { add(`<rect x="0" y="180" width="400" height="16" fill="#ff8a2a" opacity=".22"/>`); h.glow(80, 200, 120, '#ff8a3a', .3); h.glow(320, 200, 120, '#ff8a3a', .3); }
  ctx.G = null;
  if (rd.has('trestle table')) { add(tag('table', at(200, rd.has('north end') ? 200 : 226, rd.has('north end') ? .75 : 1, S().trestle(170)))); ctx.surf = ctx.surf || {}; ctx.surf.table = { x: 200, y: rd.has('north end') ? 158 : 170, s: rd.has('north end') ? .75 : 1 }; }
  if (rd.has('caged animals')) add(tag('caged animals', at(ctx.surf.table.x - 50, ctx.surf.table.y, ctx.surf.table.s, S().cage()) + at(ctx.surf.table.x + 46, ctx.surf.table.y, ctx.surf.table.s, S().cage())));
  if (rd.has('entrails')) add(tag('entrails', `<path d="M${ctx.surf.table.x - 20},${ctx.surf.table.y - 2} q10,-10 20,0 q10,-8 18,2" stroke="#8a2a2a" stroke-width="5" fill="none"/>`));
  if (rd.has('crude drawings')) add(tag('drawings', `<rect x="${ctx.surf.table.x + 6}" y="${ctx.surf.table.y - 4}" width="26" height="4" fill="#c8a878"/>`));
  if (rd.has('tapestry')) add(tag('tapestry', at(80, 200, .7, GP().WS.tapestry(rd.has('bear')))));
  if (rd.has('advisers|junior officers|politicians')) { let s = ''; for (let i = 0; i < 6; i++) { const x = [40, 90, 320, 360, 130, 280][i], y = 236 + (i % 2) * 6; s += `<g transform="translate(${x} ${y}) scale(${.85 + (i % 3) * .06})"><rect x="-9" y="-52" width="18" height="52" rx="5" fill="${['#3a2a1a', '#4a3a2a', '#2a2a3a', '#5a2a1a'][i % 4]}"/><circle cy="-60" r="8" fill="#b88a68"/></g>`; } add(tag('advisers', s)); }
  if (rd.has('thin, reedy man|reedy man')) add(tag('reedy man', `<g transform="translate(250 214) scale(.85)"><rect x="-7" y="-70" width="14" height="70" rx="4" fill="#2a2018"/><circle cy="-78" r="8" fill="#c8986e"/><path d="M8,-80 l5,3 l-5,2z" fill="#a8785a"/></g>`));
  if (rd.has('blindfolded')) { /* nothing to see but the tent */ }
  add(`<rect width="${W}" height="${H}" fill="#000" opacity=".22"/>`);
  h.glow(200, 160, 180, '#ffc070', .12);
}

root.ZGenParts = Object.assign(root.ZGenParts || {}, { LAND, DECK, TENT, landmarkDirs, LM, D });
if (typeof module !== 'undefined' && module.exports) module.exports = root.ZGenParts;
})(typeof window !== 'undefined' ? window : this);
