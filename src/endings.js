// Pictures for the ways the game can end. Every ending first fades the room picture (dark, drained of
// colour); twelve memorable ones get a picture of their own, drawn only from what the ending text says,
// kept shadowy and rather comic: no blood, no bodies. Original artwork; no game text is stored here,
// only short words to recognise which ending the game has just printed.
(function (root) {
'use strict';
let uid = 0;
const W = 400, H = 260;
const svg = (body, defs) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${defs || ''}</defs>${body}</svg>`;
const lin = (id, stops, x2 = 0, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a != null ? ` stop-opacity="${a}"` : ''}/>`).join('')}</linearGradient>`;
const rad = (id, stops, cx = .5, cy = .5, r = .5) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a != null ? ` stop-opacity="${a}"` : ''}/>`).join('')}</radialGradient>`;
// a small seeded random, so a picture looks the same every time
const rng = s => () => (s = (s * 16807) % 2147483647) / 2147483647;
const vign = id => `<rect width="${W}" height="${H}" fill="url(#${id}v)"/>`;
const vdef = id => rad(id + 'v', [[.55, '#000', 0], [1, '#000', .75]], .5, .5, .75);

const SCENES = {
  // the library pipe bursts: water everywhere, dripping through the ceiling, a sodden book
  flood(id) {
    const r = rng(7); let drops = '';
    for (let i = 0; i < 70; i++) { const x = 60 + r() * 300, y = 40 + r() * 200; drops += `<path d="M${x},${y} q2,6 0,9 q-2,-3 0,-9z" fill="#9ad0f0" opacity="${(.4 + r() * .5).toFixed(2)}"/>`; }
    let spray = ''; for (let i = 0; i < 14; i++) { const a = -2.6 + i * .37; spray += `<path d="M206,84 q${Math.cos(a) * 60},${Math.sin(a) * 40 - 20} ${Math.cos(a) * 130},${Math.sin(a) * 60 + 70}" stroke="#bfe4f8" stroke-width="${2 + (i % 3)}" fill="none" opacity=".6"/>`; }
    return svg(`<rect width="400" height="260" fill="url(#${id}w)"/>
<rect x="0" y="72" width="400" height="22" fill="#5a5a60"/><rect x="0" y="76" width="400" height="6" fill="#7a7a82"/>
<path d="M196,78 l8,-6 l6,10 l-6,8z" fill="#2a2a30"/>${spray}
<rect x="300" y="120" width="70" height="90" fill="#3a2a1e"/><rect x="306" y="126" width="58" height="34" fill="#2a1e14"/>
<path d="M0,214 Q100,204 200,214 T400,212 V260 H0Z" fill="url(#${id}f)"/>
${[[70, 228], [180, 236], [300, 230]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="${30}" ry="4" fill="none" stroke="#d8f0ff" stroke-width="1.5" opacity=".6"/>`).join('')}
<g transform="translate(150 218) rotate(-12)"><rect x="-22" y="-8" width="44" height="14" rx="2" fill="#6a3a3a"/><rect x="-20" y="-6" width="40" height="4" fill="#e8dcc0" opacity=".6"/></g>
${drops}
${[90, 160, 250, 330].map(x => `<path d="M${x},94 v${30 + (x % 40)}" stroke="#9ad0f0" stroke-width="2" stroke-dasharray="4 7" opacity=".7"/>`).join('')}
${vign(id)}`, lin(id + 'w', [[0, '#2a3a48'], [1, '#1a2430']]) + lin(id + 'f', [[0, '#4a7a9a', .85], [1, '#1a3a5a', .95]]) + vdef(id));
  },
  // darkness, icy cold, whispers; a great bear rears up and sweeps its paw
  bear(id) {
    const r = rng(11); let breath = '', whisper = '';
    for (let i = 0; i < 26; i++) { const x = r() * 400, y = r() * 260; breath += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(1 + r() * 2).toFixed(1)}" fill="#b8d8f0" opacity="${(.15 + r() * .35).toFixed(2)}"/>`; }
    for (let i = 0; i < 6; i++) whisper += `<path d="M${30 + i * 60},${40 + (i % 3) * 30} q20,-10 40,0 t40,0" stroke="#8ab0d0" stroke-width="1.2" fill="none" opacity=".25"/>`;
    return svg(`<rect width="400" height="260" fill="#04060a"/>${whisper}${breath}
<g opacity=".92"><path d="M150,260 C140,200 150,140 180,110 C170,90 175,66 196,62 C204,52 222,52 230,62 C252,66 258,92 246,112 C280,140 288,200 280,260Z" fill="#0e1218"/>
<circle cx="192" cy="58" r="10" fill="#0e1218"/><circle cx="236" cy="58" r="10" fill="#0e1218"/>
<path d="M246,124 C290,100 320,70 338,40 C344,30 356,34 352,46 C340,80 310,118 262,146Z" fill="#0e1218"/>
${[0, 1, 2, 3].map(k => `<path d="M${340 + k * 5},${36 - k * 2} l${6 + k},-14" stroke="#c8d0d8" stroke-width="2.5" stroke-linecap="round" opacity=".55"/>`).join('')}
<circle cx="204" cy="84" r="3" fill="#e8f0ff" opacity=".8"/><circle cx="224" cy="84" r="3" fill="#e8f0ff" opacity=".8"/></g>
<path d="M300,30 q30,40 50,10" stroke="#e8f0ff" stroke-width="2" fill="none" opacity=".35"/><path d="M290,52 q36,40 64,8" stroke="#e8f0ff" stroke-width="1.5" fill="none" opacity=".25"/>
${vign(id)}`, vdef(id));
  },
  // the opening crushes together, and so do the walls: dust, and nothing left between them
  crush(id) {
    const r = rng(5); let dust = '';
    for (let i = 0; i < 90; i++) dust += `<circle cx="${(170 + r() * 60).toFixed(0)}" cy="${(30 + r() * 220).toFixed(0)}" r="${(1 + r() * 3).toFixed(1)}" fill="#c8b48a" opacity="${(.2 + r() * .5).toFixed(2)}"/>`;
    const wall = (x0, x1, dir) => `<polygon points="${x0},0 ${x1},20 ${x1},240 ${x0},260" fill="url(#${id}s)"/>${Array.from({ length: 8 }, (_, k) => `<line x1="${x0}" y1="${k * 33}" x2="${x1}" y2="${20 + k * 28}" stroke="#2a2418" stroke-width="1.5" opacity=".6"/>`).join('')}`;
    return svg(`<rect width="400" height="260" fill="#1a1610"/>${wall(0, 186)}${wall(400, 214)}
<rect x="186" y="20" width="28" height="220" fill="#0a0806"/>${dust}
${[0, 1, 2].map(k => `<path d="M${120 - k * 30},130 h-24 m10,-8 l-10,8 l10,8" stroke="#e8d8b0" stroke-width="2" fill="none" opacity=".5"/><path d="M${280 + k * 30},130 h24 m-10,-8 l10,8 l-10,8" stroke="#e8d8b0" stroke-width="2" fill="none" opacity=".5"/>`).join('')}
${vign(id)}`, lin(id + 's', [[0, '#8a7a5a'], [1, '#5a4e38']], 1, 0) + vdef(id));
  },
  // Zeus' thunderbolt from the sky, straight into your back on the path to the temple
  zeus(id) {
    return svg(`<rect width="400" height="260" fill="url(#${id}k)"/>
<path d="M40,60 Q120,20 200,50 T380,40 L400,0 H0Z" fill="#2a2440" opacity=".8"/>
<polygon points="250,150 250,118 330,96 400,118 400,150" fill="#d8d4c8" opacity=".5"/>${[262, 286, 310, 334, 358, 382].map(x => `<rect x="${x}" y="${108 + (x - 262) * -.05}" width="7" height="44" fill="#e8e4d8" opacity=".45"/>`).join('')}
<path d="M0,190 Q200,170 400,186 V260 H0Z" fill="#3a4a2a"/><path d="M150,260 L200,150 L230,150 L260,260Z" fill="#8a7a5a" opacity=".7"/>
<path d="M170,0 L196,64 L178,70 L214,140 L196,144 L222,206" stroke="#fff8c0" stroke-width="7" fill="none" stroke-linejoin="bevel"/>
<path d="M170,0 L196,64 L178,70 L214,140 L196,144 L222,206" stroke="#ffffff" stroke-width="2.5" fill="none" stroke-linejoin="bevel"/>
<circle cx="222" cy="206" r="40" fill="url(#${id}g)"/>
${[0, 1, 2, 3, 4, 5, 6, 7].map(k => { const a = k * .785; return `<line x1="${222 + Math.cos(a) * 20}" y1="${206 + Math.sin(a) * 16}" x2="${222 + Math.cos(a) * 46}" y2="${206 + Math.sin(a) * 34}" stroke="#fff4b0" stroke-width="2" opacity=".7"/>`; }).join('')}
${vign(id)}`, lin(id + 'k', [[0, '#1a1830'], [1, '#4a4060']]) + rad(id + 'g', [[0, '#ffffff', .95], [.4, '#fff0a0', .6], [1, '#fff0a0', 0]]) + vdef(id));
  },
  // a freak accident, one of five, as the text says: meteorite, chasm, volcano, lightning or spears
  freak(id, t) {
    const sky = lin(id + 'k', [[0, '#1a2040'], [1, '#5a5070']]);
    const ground = `<path d="M0,196 Q200,184 400,196 V260 H0Z" fill="#3a3a2e"/>`;
    let b;
    if (/meteorite/i.test(t)) b = `${ground}<path d="M330,0 L214,190" stroke="url(#${id}t)" stroke-width="16" stroke-linecap="round"/><circle cx="212" cy="192" r="12" fill="#ffd080"/><circle cx="212" cy="192" r="34" fill="url(#${id}g)"/>${[0, 1, 2, 3, 4].map(k => `<circle cx="${200 + k * 7}" cy="${178 - k * 5}" r="${2 + k % 2}" fill="#ffb060" opacity=".7"/>`).join('')}`;
    else if (/earthquake/i.test(t)) b = `<path d="M0,196 Q200,184 400,196 V260 H0Z" fill="#3a3a2e"/><path d="M140,260 L170,214 L156,200 L190,190 L214,206 L236,196 L250,222 L270,260Z" fill="#050403"/>${[60, 120, 300, 350].map(x => `<polygon points="${x},196 ${x + 14},150 ${x + 30},196" fill="#5a5048" transform="rotate(${x % 2 ? 12 : -14} ${x + 15} 196)"/>`).join('')}`;
    else if (/volcano/i.test(t)) b = `${ground}<path d="M120,260 Q200,170 280,260Z" fill="#4a2a1a"/><path d="M196,200 Q170,120 120,40 M204,200 Q230,110 290,30 M200,200 V20" stroke="#ff7a2a" stroke-width="6" fill="none" opacity=".8"/><circle cx="200" cy="200" r="60" fill="url(#${id}g)"/>`;
    else if (/lightning/i.test(t)) b = `${ground}<path d="M220,0 L196,80 L216,84 L188,190" stroke="#e8f0ff" stroke-width="6" fill="none"/><circle cx="188" cy="190" r="30" fill="url(#${id}g)"/>${[0, 1, 2, 3, 4, 5].map(k => `<path d="M${180 + k * 4},176 l${(k - 2.5) * 5},-22" stroke="#e8f0ff" stroke-width="1.5" opacity=".6"/>`).join('')}`;
    else b = `${ground}${Array.from({ length: 22 }, (_, k) => `<line x1="${20 + k * 17}" y1="${30 + (k % 4) * 10}" x2="${120 + k * 7}" y2="${180 + (k % 3) * 6}" stroke="#a89060" stroke-width="2.5" opacity=".8"/><path d="M${120 + k * 7},${180 + (k % 3) * 6} l-3,-9 l7,2z" fill="#c8c0b0"/>`).join('')}`;
    return svg(`<rect width="400" height="260" fill="url(#${id}k)"/>${b}${vign(id)}`, sky + lin(id + 't', [[0, '#ff6a2a', 0], [1, '#ffe0a0', 1]], 1, 1) + rad(id + 'g', [[0, '#fff4c0', .9], [.5, '#ffa040', .5], [1, '#ff6020', 0]]) + vdef(id));
  },
  // diving into the sea below Andromeda's rock: a Kraken wakes from the depths
  kraken(id) {
    const tent = (x, h, s) => `<path d="M${x},260 C${x - 20 * s},${260 - h * .4} ${x + 30 * s},${260 - h * .7} ${x + 6 * s},${260 - h} q${10 * s},-8 ${14 * s},4 C${x + 46 * s},${260 - h * .6} ${x + 14 * s},${260 - h * .3} ${x + 26},260Z" fill="#2a3a3a"/>${Array.from({ length: 4 }, (_, k) => `<circle cx="${x + 8 + k * 3 * s}" cy="${260 - h * (.25 + k * .15)}" r="2.5" fill="#6a8a80" opacity=".7"/>`).join('')}`;
    return svg(`<rect width="400" height="260" fill="url(#${id}k)"/><circle cx="70" cy="60" r="22" fill="#ffe0a0" opacity=".6"/>
<path d="M300,60 L340,40 L380,70 L400,60 V170 H290Z" fill="#3a342e"/>
<g opacity=".55"><path d="M346,72 q-6,14 0,30" stroke="#d8c0a0" stroke-width="6" fill="none"/><circle cx="346" cy="66" r="6" fill="#d8c0a0"/><path d="M340,64 q-8,10 -4,30" stroke="#5a3a1e" stroke-width="5" fill="none"/><path d="M352,80 l12,-14" stroke="#8a8a90" stroke-width="1.5"/></g>
<path d="M0,150 Q100,140 200,150 T400,150 V260 H0Z" fill="url(#${id}s)"/>
${tent(110, 150, 1)}${tent(200, 190, -1)}${tent(260, 120, 1)}
<path d="M150,150 q10,-30 20,0" stroke="#e8f0f8" stroke-width="2" fill="none" opacity=".6"/>${[60, 150, 240, 330].map(x => `<path d="M${x},${156 + (x % 3) * 4} q10,-5 20,0" stroke="#c8e0e8" stroke-width="1.5" fill="none" opacity=".5"/>`).join('')}
${vign(id)}`, lin(id + 'k', [[0, '#e8a870'], [.6, '#a8a0b0'], [1, '#6a7a90']]) + lin(id + 's', [[0, '#2a5a6a'], [1, '#0a1a2a']]) + vdef(id));
  },
  // fire: spontaneous combustion, or a great conflagration
  fire(id) {
    const r = rng(3); let fl = '', sp = '';
    for (let i = 0; i < 9; i++) { const x = 40 + i * 42 + r() * 10, h = 90 + r() * 120; fl += `<path d="M${x - 30},260 C${x - 30},${260 - h * .5} ${x - 6},${260 - h * .6} ${x},${260 - h} C${x + 8},${260 - h * .6} ${x + 30},${260 - h * .5} ${x + 30},260Z" fill="url(#${id}f)" opacity=".9"/>`; }
    for (let i = 0; i < 40; i++) sp += `<circle cx="${(r() * 400).toFixed(0)}" cy="${(r() * 200).toFixed(0)}" r="${(1 + r() * 1.6).toFixed(1)}" fill="#ffd070" opacity="${(.3 + r() * .6).toFixed(2)}"/>`;
    return svg(`<rect width="400" height="260" fill="url(#${id}k)"/>${fl}${sp}<path d="M0,0 Q120,60 200,30 T400,40 V0Z" fill="#2a1a14" opacity=".7"/>${vign(id)}`,
      lin(id + 'k', [[0, '#2a1410'], [1, '#6a2a10']]) + lin(id + 'f', [[0, '#fff0a0'], [.4, '#ff9a2a'], [1, '#c8301a']]) + vdef(id));
  },
  // the bomb explodes
  bomb(id) {
    let rays = ''; for (let k = 0; k < 16; k++) { const a = k * Math.PI / 8; rays += `<polygon points="200,140 ${200 + Math.cos(a - .08) * 260},${140 + Math.sin(a - .08) * 260} ${200 + Math.cos(a + .08) * 260},${140 + Math.sin(a + .08) * 260}" fill="#fff0b0" opacity=".25"/>`; }
    const puff = (x, y, rr, c) => `<circle cx="${x}" cy="${y}" r="${rr}" fill="${c}"/>`;
    return svg(`<rect width="400" height="260" fill="#3a1a10"/>${rays}
${puff(200, 140, 90, '#7a4a2a')}${puff(150, 120, 50, '#9a6a3a')}${puff(250, 112, 56, '#9a6a3a')}${puff(200, 90, 50, '#b88a4a')}${puff(200, 140, 46, 'url(#' + id + 'g)')}
${[[60, 60, 20], [340, 70, -30], [90, 200, 50], [320, 210, -60], [200, 20, 10]].map(([x, y, a]) => `<rect x="${x}" y="${y}" width="16" height="6" fill="#2a1a10" transform="rotate(${a} ${x} ${y})"/>`).join('')}
${[[120, 40], [290, 50], [60, 150], [350, 160]].map(([x, y]) => `<path d="M${x},${y} q6,-8 12,0" stroke="#3a6a3a" stroke-width="2" fill="none"/><path d="M${x + 4},${y + 6} q6,-8 12,0" stroke="#c83a2a" stroke-width="2" fill="none"/>`).join('')}
${vign(id)}`, rad(id + 'g', [[0, '#ffffff'], [.5, '#ffe080'], [1, '#ff8a2a', 0]]) + vdef(id));
  },
  // someone sees you with the bomb: a foreign prison, twenty-five years
  prison(id) {
    let tally = ''; for (let g = 0; g < 5; g++) { const x = 60 + g * 30; for (let k = 0; k < 4; k++) tally += `<line x1="${x + k * 5}" y1="70" x2="${x + k * 5}" y2="94" stroke="#e8dcc0" stroke-width="2" opacity=".6"/>`; tally += `<line x1="${x - 3}" y1="90" x2="${x + 19}" y2="74" stroke="#e8dcc0" stroke-width="2" opacity=".6"/>`; }
    return svg(`<rect width="400" height="260" fill="url(#${id}w)"/>${tally}
<rect x="250" y="40" width="90" height="70" fill="#8ab0d8" opacity=".5"/>${[262, 280, 298, 316, 334].map(x => `<rect x="${x}" y="40" width="5" height="70" fill="#2a2a2e"/>`).join('')}
<polygon points="250,110 340,110 380,260 210,260" fill="#c8d8f0" opacity=".08"/>
<rect x="0" y="210" width="400" height="50" fill="#2a2620"/><rect x="40" y="190" width="120" height="20" fill="#5a4a38"/><rect x="40" y="206" width="8" height="16" fill="#3a2e22"/><rect x="152" y="206" width="8" height="16" fill="#3a2e22"/>
${Array.from({ length: 13 }, (_, k) => `<rect x="${4 + k * 31}" y="0" width="7" height="260" fill="url(#${id}b)"/>`).join('')}
<rect x="0" y="20" width="400" height="6" fill="#4a4a50"/><rect x="0" y="236" width="400" height="6" fill="#4a4a50"/>
${vign(id)}`, lin(id + 'w', [[0, '#4a4440'], [1, '#2a2622']]) + lin(id + 'b', [[0, '#2a2a30'], [.5, '#7a7a82'], [1, '#2a2a30']], 1, 0) + vdef(id));
  },
  // the flagpole cracks, and you fall head over heels to the deck below
  mastfall(id) {
    return svg(`<rect width="400" height="260" fill="url(#${id}k)"/>
<rect x="196" y="0" width="14" height="260" fill="#6a4a2a"/><rect x="120" y="40" width="170" height="6" fill="#5a3a1e"/>
<path d="M210,96 L300,88" stroke="#7a5a32" stroke-width="7"/><path d="M300,88 l8,-6 l-2,10 l8,2" stroke="#7a5a32" stroke-width="4" fill="none"/>
<g transform="translate(330 130) rotate(40)"><rect x="-40" y="-3" width="80" height="6" fill="#7a5a32"/></g>
<g transform="translate(280 150) rotate(-20)"><rect x="0" y="0" width="40" height="24" fill="#1a2a6a"/><path d="M0,0 L40,24 M40,0 L0,24" stroke="#e8e8f0" stroke-width="5"/><path d="M0,0 L40,24 M40,0 L0,24" stroke="#c82a2a" stroke-width="2"/><path d="M20,0 V24 M0,12 H40" stroke="#e8e8f0" stroke-width="7"/><path d="M20,0 V24 M0,12 H40" stroke="#c82a2a" stroke-width="4"/></g>
${[0, 1, 2].map(k => `<path d="M${250 + k * 16},${110 + k * 10} q-10,30 4,60" stroke="#e8f0f8" stroke-width="1.5" fill="none" opacity=".5"/>`).join('')}
<path d="M0,226 L400,214 V260 H0Z" fill="#8a6a40"/>${[40, 120, 200, 280, 360].map(x => `<line x1="${x}" y1="${226 - x * .03}" x2="${x - 20}" y2="260" stroke="#5a4428" stroke-width="2"/>`).join('')}
<circle cx="120" cy="222" r="8" fill="#3a3a3e"/><rect x="250" y="210" width="20" height="10" fill="#3a3a3e"/>
${vign(id)}`, lin(id + 'k', [[0, '#6a8ac0'], [1, '#c8d8e8']]) + vdef(id));
  },
  // the ghost swoops around and through you; you never venture into the attic again
  spooked(id) {
    const r = rng(9); let swirl = '';
    for (let i = 0; i < 5; i++) swirl += `<path d="M${200 - 120 + i * 10},${140 - i * 6} C${120 + i * 8},${40 + i * 6} ${300 - i * 8},${30 + i * 10} ${290 - i * 10},${150 - i * 4} S${150 + i * 6},${220 - i * 6} ${180 + i * 6},${150}" stroke="#d8e8f0" stroke-width="${6 - i}" fill="none" opacity="${(.12 + i * .06).toFixed(2)}"/>`;
    let motes = ''; for (let i = 0; i < 30; i++) motes += `<circle cx="${(r() * 400).toFixed(0)}" cy="${(r() * 260).toFixed(0)}" r="1.3" fill="#e8f0f8" opacity="${(.2 + r() * .4).toFixed(2)}"/>`;
    return svg(`<rect width="400" height="260" fill="url(#${id}k)"/>
<polygon points="0,40 400,10 400,60 0,90" fill="#2a2420"/>${[60, 160, 260, 360].map(x => `<rect x="${x}" y="0" width="14" height="${80 - x * .08}" fill="#1a1612"/>`).join('')}
${swirl}
<g opacity=".55"><path d="M236,80 C236,58 268,58 268,80 V130 l-6,-8 l-5,8 l-5,-8 l-5,8 l-5,-8 l-6,8Z" fill="#e8f0f8"/><circle cx="246" cy="84" r="3" fill="#1a2430"/><circle cx="258" cy="84" r="3" fill="#1a2430"/><ellipse cx="252" cy="98" rx="4" ry="6" fill="#1a2430"/></g>
${motes}
<path d="M0,214 L400,200 V260 H0Z" fill="#2e2620"/>${vign(id)}`, lin(id + 'k', [[0, '#3a4450'], [1, '#1e2228']]) + vdef(id));
  },
  // transported to Australia: a ship under full sail towards a far, sun-baked shore
  australia(id) {
    return svg(`<rect width="400" height="260" fill="url(#${id}k)"/><circle cx="320" cy="60" r="30" fill="#fff0b0"/><circle cx="320" cy="60" r="60" fill="url(#${id}g)"/>
<path d="M240,150 Q300,132 360,140 T400,138 V152 H240Z" fill="#c88a4a"/>
<path d="M0,150 H400 V260 H0Z" fill="url(#${id}s)"/>
<g transform="translate(120 150)"><path d="M-60,0 L60,0 L48,22 L-48,22Z" fill="#4a2e1a"/>${[-30, 0, 30].map(x => `<rect x="${x - 1.5}" y="-96" width="3" height="96" fill="#3a2a1a"/><path d="M${x - 22},-86 Q${x},-74 ${x + 22},-86 L${x + 20},-40 Q${x},-30 ${x - 20},-40Z" fill="#e8e0cc"/>`).join('')}
${[-40, -20, 0, 20, 40].map(x => `<rect x="${x - 3}" y="6" width="6" height="6" fill="#1a120a"/>`).join('')}</g>
${[40, 200, 300].map(x => `<path d="M${x},${180 + (x % 7) * 3} q10,-5 20,0" stroke="#e8f0f8" stroke-width="1.5" fill="none" opacity=".5"/>`).join('')}
${vign(id)}`, lin(id + 'k', [[0, '#5a9ad8'], [1, '#e8d8a8']]) + lin(id + 's', [[0, '#2a6a9a'], [1, '#0a2a4a']]) + rad(id + 'g', [[0, '#fff0b0', .6], [1, '#fff0b0', 0]]) + vdef(id));
  },
};

// which ending the game has just printed: short words only, from the death texts
const MATCH = [
  ['flood', /pipe bursts/i],
  ['bear', /great bear rears up/i],
  ['crush', /powdered dog biscuit/i],
  ['zeus', /Zeus'? (has worked out|thunderbolt strikes you)/i],
  ['freak', /astonishing freak accident/i],
  ['kraken', /Kraken wakes/i],
  ['fire', /spontaneously combusted|great conflagration/i],
  ['bomb', /the bomb explodes/i],
  ['prison', /you with the bomb/i],
  ['mastfall', /colourful demise on the deck|hard wooden deck/i],
  ['spooked', /swoops around and through you/i],
  ['australia', /transported to Australia/i],
];
// the banner the game prints when it ends, other than the win
const END = /\*{3}\s*You have (?!won)[^*\n]{3,80}\*{3}/;

function find(text) {
  if (!text || !END.test(text)) return null;
  for (const [k, re] of MATCH) if (re.test(text)) { const id = 'en' + (++uid); return { key: k, svg: SCENES[k](id, text) }; }
  return { key: null, svg: null };
}
root.ZEnd = { find, END, keys: MATCH.map(m => m[0]), scene: (k, t) => SCENES[k]('en' + (++uid), t || '') };
})(typeof window !== 'undefined' ? window : globalThis);
