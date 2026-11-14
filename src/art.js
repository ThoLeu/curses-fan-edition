// Procedural room illustrations: original SVG scenes chosen by keywords.
(function (root) {
'use strict';

function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function rngFrom(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

const CATS = {
  darkness: [],
  attic: ['attic', 'loft', 'beam', 'rafter', 'trapdoor', 'teachest', 'tea chest', 'winery', 'clutter', 'lumber'],
  interior: ['room', 'hall', 'hallway', 'cupboard', 'office', 'corridor', 'library', 'foyer', 'study', 'lair', 'annexe', 'chamber', 'museum', 'exhibit', 'furniture', 'souvenir', 'wardrobe', 'storage', 'garage', 'door', 'carpet', 'fireplace', 'bed'],
  cellar: ['cellar', 'crypt', 'catacomb', 'tomb', 'oubliette', 'passage', 'shaft', 'hypocaust', 'well', 'sarcophag*', 'charnel', 'underground', 'tunnel', 'dead end', 'foundation', 'buried', 'vault', 'dungeon', 'staircase', 'damp'],
  heights: ['roof', 'battlement', 'chimney', 'tower', 'spire', 'balcony', 'observatory', 'telescope', 'ledge', 'viewpoint', 'beanstalk', 'parapet', 'slates', 'gutter', 'mast'],
  garden: ['garden', 'lawn', 'hedge', 'hedgery', 'privet', 'stile', 'meadow', 'maze', 'patio', 'folly', 'summer house', 'croquet', 'vegetable', 'tree', 'clearing', 'footpath', 'drive', 'hollow', 'ornament', 'mosaic', 'potting', 'flower', 'grass', 'bush', 'orchard', 'path', 'gravel', 'planting'],
  water: ['sea', 'helm', 'river-boat', 'on board', 'skiff', 'harbourlands', 'shore', 'river', 'stream', 'ship', 'harbour', 'harbor', 'jetty', 'causeway', 'drifting', 'prow', 'stern', 'aboard', 'boat', 'island', 'mast', 'wave', 'beach', 'lighthouse', 'quay', 'deck'],
  cave: ['cave', 'cavern', 'crags', 'crevice', 'cliff', 'rock', 'spur', 'rope', 'valley', 'thorn', 'ravine', 'boulder', 'gorge', 'jagged'],
  classical: ['temple', 'labyrinth', 'alexandria', 'minotaur', 'zeus', 'cloister', 'sanctum', 'oracle', 'frieze', 'villa', 'atrium', 'triclinium', 'roman', 'greek', 'stadium', 'theatre', 'theater', 'palace', 'muses', 'taverna', 'column', 'marble', 'balustrade', 'statue'],
  church: ['church', 'chapel', 'stone cross', 'memorial', 'parish', 'altar', 'priest', 'pew', 'bell', 'stained', 'nave', 'font'],
  egypt: ['pyramid', 'necropolis', 'dynasty', 'sphinx', 'desert', 'pharaoh', 'dune', 'sand'],
  camp: ['tent', 'camp-fire', 'camp-fires', 'druid', 'druidic', 'camp', 'encampment', 'dolmen', 'shrine', 'bear', 'campfire', 'general', 'menhir', 'standing stone', 'soldier'],
  city: ['city', 'road', 'street', 'halles', 'paris', 'warehouse', 'cafe', 'café', 'outside the', 'port', 'shop', 'market', 'station', 'metro', 'traffic', 'pavement'],
  otherworld: ['dream', 'spirit', 'heaven', 'hell', 'universe', 'orb', 'infinity', 'premonition', 'death', 'reaper', 'fool', 'clairvoy*', 'tarot', 'fashion', 'melancholy', 'void', 'mist', 'ghost', 'phantom', 'vision', 'cosmos']
};

const reCache = {};
function kwRe(k) {
  if (reCache[k]) return reCache[k];
  const pre = k.endsWith('*'), w = (pre ? k.slice(0, -1) : k).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return reCache[k] = new RegExp('(^|[^a-z])' + w + (pre ? '' : '(s|es)?(?![a-z\\-])'));
}
function classify(name, desc) {
  const BSx = root.ZBespoke || (typeof require === 'function' ? (() => { try { return require('./bespoke.js'); } catch (e) { return null; } })() : null);
  if (BSx && BSx.BESPOKE[name]) return BSx.BESPOKE[name].cat;
  const n = (name || '').toLowerCase(), d = (desc || '').toLowerCase();
  if (n === 'darkness' || n === 'dunkelheit') return 'darkness';
  let best = 'interior', bestScore = 0;
  for (const cat in CATS) {
    let s = 0;
    for (const k0 of CATS[cat]) {
      const re = kwRe(k0);
      if (re.test(n)) s += 6;
      if (d) { const m = d.match(new RegExp(re.source, 'g')); if (m) s += Math.min(3, m.length); }
    }
    if (s > bestScore) { bestScore = s; best = cat; }
  }
  return best;
}
const MOOD = { darkness: 'dark', attic: 'house', interior: 'house', cellar: 'dark', heights: 'dream', garden: 'nature', water: 'water', cave: 'dark', classical: 'ancient', church: 'sacred', egypt: 'ancient', camp: 'ancient', city: 'city', otherworld: 'dream' };


// Game state for an illustration: which objects are in the room, which are open, what the player carries.
// Without state (e.g. a preview) every object counts as present in its default condition.
function makeState(s) {
  const lc = a => (a || []).map(x => String(x).toLowerCase());
  if (!s) return { known: false, here: () => true, open: (w, d) => d !== false, carried: () => false, isOn: () => false, inside: () => [], link: () => '', fitted: () => [], moved: () => false, sig: '' };
  const here = lc(s.here), open = lc(s.open), carried = lc(s.carried);
  const m = (arr, w) => arr.some(n => n.includes(w.toLowerCase()));
  const on = lc(s.on), ins = s.inside || {};
  // switched on; what lies inside something (by part of its name)
  const isOn = w => m(on, w);
  const byKey = (o, w, d) => { const k = Object.keys(o || {}).find(n => n.toLowerCase().includes(w.toLowerCase())); return k ? o[k] : d; };
  const inside = w => byKey(ins, w, []);
  // the socket a thing is fixed in; the parts fitted to a thing
  const link = w => byKey(s.links, w, '');
  const fitted = w => byKey(s.fitted, w, []);
  return { known: true, mentioned: s.mentioned || null, hereList: s.here || [], moved: w => m(lc(s.moved), w), here: w => m(here, w), open: (w, d) => m(here, w) ? m(open, w) : d !== false, carried: w => m(carried, w), isOn, inside, link, fitted };
}

let uid = 0;
function scene(name, desc, catOverride, state) {
  const cat = catOverride || classify(name, desc);
  const r = rngFrom(hash(name || 'x'));
  const id = 's' + (++uid);
  const kw = ((name || '') + ' ' + (desc || '') + ' ' + (state && state.here ? state.here.join(' ') : '')).toLowerCase();
  const has = (...w) => w.some(x => kw.includes(x));
  const W = 400, H = 260;
  const R = (a, b) => a + r() * (b - a);
  const RI = (a, b) => Math.floor(R(a, b + 1));
  const defs = [];
  const els = [];
  const lin = (gid, stops, x2 = 0, y2 = 1) => { defs.push(`<linearGradient id="${id}${gid}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op !== undefined ? ` stop-opacity="${op}"` : ''}/>`).join('')}</linearGradient>`); return `url(#${id}${gid})`; };
  const rad = (gid, stops, cx = .5, cy = .5, rr = .5) => { defs.push(`<radialGradient id="${id}${gid}" cx="${cx}" cy="${cy}" r="${rr}">${stops.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op !== undefined ? ` stop-opacity="${op}"` : ''}/>`).join('')}</radialGradient>`); return `url(#${id}${gid})`; };
  const add = s => els.push(s);
  const ridge = (y, amp, fill, steps = 9, rough = 1) => {
    let d = `M0,${H} L0,${y + R(-amp, amp)}`;
    const pts = [];
    for (let i = 0; i <= steps; i++) pts.push([i * W / steps, y + R(-amp, amp) * rough]);
    for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; d += ` Q${x0 + (x1 - x0) / 2},${y0} ${x1},${y1}`; }
    d += ` L${W},${H} Z`;
    add(`<path d="${d}" fill="${fill}"/>`);
  };
  const stars = (n, maxY, op = .9) => { let s = ''; for (let i = 0; i < n; i++) { const rr = r() < .1 ? 1.4 : R(.3, .9); s += `<circle cx="${R(0, W).toFixed(1)}" cy="${R(0, maxY).toFixed(1)}" r="${rr.toFixed(2)}" fill="#fff8e0" opacity="${R(.3, op).toFixed(2)}"/>`; } add(s); };
  const moon = (x, y, rr, col = '#f4ecd0') => { add(`<circle cx="${x}" cy="${y}" r="${rr * 3}" fill="${rad('mg', [[0, col, .35], [1, col, 0]])}"/><circle cx="${x}" cy="${y}" r="${rr}" fill="${col}"/><circle cx="${x + rr * .35}" cy="${y - rr * .2}" r="${rr * .85}" fill="#000" opacity=".08"/>`); };
  const glow = (x, y, rr, col, op = .6) => add(`<circle cx="${x}" cy="${y}" r="${rr}" fill="${rad('g' + (++uid), [[0, col, op], [1, col, 0]])}"/>`);
  const tree = (x, y, s, col, trunk = '#2b2017') => {
    let t = `<rect x="${x - s * .06}" y="${y - s * .5}" width="${s * .12}" height="${s * .5}" fill="${trunk}"/>`;
    for (let i = 0; i < 5; i++) t += `<circle cx="${x + R(-.3, .3) * s}" cy="${y - s * .55 - R(0, .45) * s}" r="${s * R(.22, .34)}" fill="${col}"/>`;
    add(t);
  };
  const cypress = (x, y, h, col) => add(`<path d="M${x},${y - h} C${x + h * .16},${y - h * .6} ${x + h * .14},${y - h * .1} ${x},${y} C${x - h * .14},${y - h * .1} ${x - h * .16},${y - h * .6} ${x},${y - h} Z" fill="${col}"/>`);
  const skyDay = (top, bot) => add(`<rect width="${W}" height="${H}" fill="${lin('sky', [[0, top], [1, bot]])}"/>`);
  const night = r() < .5;
  const st = makeState(state);
  const tag = (k, s) => `<g class="zi" data-k="${k}">${s}</g>`, open = k => `<g class="zi" data-k="${k}">`;
  // what the game says lies in a container: small icons in a row, starting at x, y (their bottom edge)
  const contents = (container, x, y, size = 18, step = 20, max = 4) => {
    const I = (typeof window !== 'undefined' && window.ZIcons) || (typeof require === 'function' ? (() => { try { return require('./icons.js'); } catch (e) { return null; } })() : null);
    if (!I || !st || !st.known) return;
    st.inside(container).slice(0, max).forEach((n, i) => { const body = I.icon(n).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, ''); add(tag(n, `<g transform="translate(${x + i * step} ${y - size}) scale(${size / 40})">${body}</g>`)); });
  };
  const h = { desc: desc || '', W, H, R, RI, r, add, lin, rad, glow, stars, moon, tree, cypress, ridge, has, id, st, tag, open, contents };
  const BS = (root.ZBespoke || (typeof require === 'function' ? (() => { try { return require('./bespoke.js'); } catch (e) { return null; } })() : null));
  const bespoke = BS && BS.BESPOKE[name];
  if (bespoke && catOverride !== 'darkness') { bespoke.draw(h); return finish(bespoke.cat); }
  // every other room: composed from its description
  if (!bespoke && cat !== 'darkness') {
    const GEN = root.ZGeneric || (typeof require === 'function' ? (() => { try { require('./genparts.js'); return require('./generic.js'); } catch (e) { return null; } })() : null);
    if (GEN && desc && GEN.compose(h, name, desc, cat)) return finish(cat);
  }

  switch (cat) {
    case 'darkness': {
      add(`<rect width="${W}" height="${H}" fill="#07060a"/>`);
      glow(R(150, 250), R(110, 150), 90, '#3a3350', .35);
      for (let i = 0; i < 40; i++) add(`<circle cx="${R(0, W)}" cy="${R(0, H)}" r="${R(.3, 1)}" fill="#a9a0c0" opacity="${R(.05, .25)}"/>`);
      add(`<text x="${W / 2}" y="${H / 2 + 6}" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="15" fill="#6d6585" opacity=".7">… stockfinster …</text>`);
      break;
    }
    case 'attic': {
      add(`<rect width="${W}" height="${H}" fill="#1a120c"/>`);
      const gx = 200 + R(-20, 20);
      add(`<polygon points="${gx - 75},205 ${gx - 75},112 ${gx},58 ${gx + 75},112 ${gx + 75},205" fill="${lin('gw', [[0, '#5a4330'], [1, '#3a2a1d']])}"/>`);
      add(`<polygon points="0,0 ${gx},58 ${gx - 75},112 0,250" fill="#24180f"/><polygon points="${W},0 ${gx},58 ${gx + 75},112 ${W},250" fill="#20150d"/>`);
      for (let i = 1; i < 6; i++) { const t = i / 6; add(`<line x1="${gx * t}" y1="${58 * t}" x2="${(gx - 75) * t}" y2="${112 + (250 - 112) * (1 - t) * 0 + t * 0}" stroke="none"/>`); }
      for (let i = 0; i < 5; i++) { const t = (i + 1) / 6; add(`<line x1="${gx - (gx) * t}" y1="${58 - 58 * t}" x2="${gx - 75 - (gx - 75) * t}" y2="${112 + 138 * t}" stroke="#3b2819" stroke-width="${3 + i * 2}"/><line x1="${gx + (W - gx) * t}" y1="${58 - 58 * t}" x2="${gx + 75 + (W - gx - 75) * t}" y2="${112 + 138 * t}" stroke="#36241a" stroke-width="${3 + i * 2}"/>`); }
      add(`<polygon points="${gx - 75},205 ${gx + 75},205 ${W},${H} 0,${H}" fill="${lin('fl', [[0, '#3b2b1e'], [1, '#5b432e']])}"/>`);
      for (let i = -6; i <= 6; i++) add(`<line x1="${gx + i * 12.5}" y1="205" x2="${gx + i * 40}" y2="${H}" stroke="#2a1d13" stroke-width="1"/>`);
      add(`<circle cx="${gx}" cy="118" r="15" fill="#c8d6e8"/><circle cx="${gx}" cy="118" r="15" fill="none" stroke="#2a1d13" stroke-width="3"/><line x1="${gx - 15}" y1="118" x2="${gx + 15}" y2="118" stroke="#2a1d13" stroke-width="2"/><line x1="${gx}" y1="103" x2="${gx}" y2="133" stroke="#2a1d13" stroke-width="2"/>`);
      add(`<polygon points="${gx - 12},120 ${gx + 12},120 ${gx + 70},250 ${gx - 40},250" fill="#e8dcb0" opacity=".07"/>`);
      const nb = RI(3, 5);
      for (let i = 0; i < nb; i++) {
        const side = i % 2 ? 1 : -1, bx = gx + side * R(70, 150), by = R(212, 238), bw = R(34, 52), bh = bw * R(.7, .9);
        add(`<rect x="${bx - bw / 2}" y="${by - bh}" width="${bw}" height="${bh}" fill="#6b4a2c" stroke="#2a1b10" stroke-width="1.5"/><polygon points="${bx - bw / 2},${by - bh} ${bx - bw / 2 + 8},${by - bh - 7} ${bx + bw / 2 + 8},${by - bh - 7} ${bx + bw / 2},${by - bh}" fill="#82603b" stroke="#2a1b10"/><line x1="${bx - bw / 2}" y1="${by - bh / 2}" x2="${bx + bw / 2}" y2="${by - bh / 2}" stroke="#3a2616"/>`);
      }
      if (has('trapdoor', 'light', 'below')) { add(`<polygon points="${gx - 30},250 ${gx + 30},250 ${gx + 55},${H} ${gx - 55},${H}" fill="#f6e6a8" opacity=".55"/>`); add(`<polygon points="${gx - 30},250 ${gx + 30},250 ${gx + 18},40 ${gx - 18},40" fill="${lin('lb', [[0, '#f6e6a8', 0], [1, '#f6e6a8', .25]])}"/>`); }
      for (let i = 0; i < 26; i++) add(`<circle cx="${gx + R(-60, 60)}" cy="${R(60, 240)}" r="${R(.4, 1.2)}" fill="#f2e2b0" opacity="${R(.15, .5)}"/>`);
      break;
    }
    case 'interior': {
      const library = has('library', 'book', 'shel', 'reading', 'librarian', 'study');
      const museum = has('museum', 'exhibit', 'foyer', 'souvenir');
      const wall = museum ? ['#5c5246', '#3d352c'] : [['#4a3a2a', '#2f241a'], ['#3b3a2f', '#25241c'], ['#3d2c2c', '#271b1b'], ['#2f3640', '#1d2229']][RI(0, 3)];
      add(`<rect width="${W}" height="${H}" fill="${lin('wl', [[0, wall[0]], [1, wall[1]]])}"/>`);
      for (let x = 0; x < W; x += 22) add(`<line x1="${x}" y1="0" x2="${x}" y2="170" stroke="#000" opacity=".06"/>`);
      add(`<rect y="170" width="${W}" height="${H - 170}" fill="${lin('fl', [[0, '#3a2919'], [1, '#22170e']])}"/><rect y="150" width="${W}" height="22" fill="#000" opacity=".18"/><line x1="0" y1="170" x2="${W}" y2="170" stroke="#1a110a" stroke-width="3"/>`);
      if (library) {
        for (let s = 0; s < 2; s++) {
          const sx = s ? R(250, 290) : R(20, 50), sw = 100;
          add(`<rect x="${sx}" y="40" width="${sw}" height="135" fill="#2a1a0f" stroke="#140c06" stroke-width="3"/>`);
          for (let row = 0; row < 4; row++) {
            const y = 48 + row * 32; let x = sx + 5;
            add(`<rect x="${sx}" y="${y + 26}" width="${sw}" height="4" fill="#4a2f1b"/>`);
            while (x < sx + sw - 6) { const bw = R(4, 9), bh = R(17, 25); add(`<rect x="${x}" y="${y + 26 - bh}" width="${bw}" height="${bh}" fill="${['#6e2a22', '#2f4a3a', '#7a5a2a', '#33405e', '#5a3a50', '#8a7a5a'][RI(0, 5)]}"/>`); x += bw + R(.5, 1.5); }
          }
        }
      } else if (has('window')) {
        const wx = R(130, 230), ww = 74;
        const outside = night ? '#1a2540' : '#9fb7c9';
        add(`<rect x="${wx}" y="40" width="${ww}" height="96" fill="${outside}"/>`);
        if (night) { moon(wx + R(18, 56), R(58, 80), 7); stars(0, 0); for (let i = 0; i < 12; i++) add(`<circle cx="${wx + R(2, ww - 2)}" cy="${R(42, 130)}" r=".6" fill="#fff" opacity=".7"/>`); }
        else add(`<path d="M${wx},120 Q${wx + 30},105 ${wx + ww},115 L${wx + ww},136 L${wx},136Z" fill="#5b7d5a"/>`);
        add(`<rect x="${wx}" y="40" width="${ww}" height="96" fill="none" stroke="#1c140d" stroke-width="5"/><line x1="${wx + ww / 2}" y1="40" x2="${wx + ww / 2}" y2="136" stroke="#1c140d" stroke-width="3"/><line x1="${wx}" y1="88" x2="${wx + ww}" y2="88" stroke="#1c140d" stroke-width="3"/>`);
        const cc = ['#6b2a2a', '#2a4a5a', '#5a4a2a', '#4a2a4a'][RI(0, 3)];
        if (has('curtain', 'drape')) add(`<path d="M${wx - 18},34 Q${wx + 4},90 ${wx - 8},150 L${wx - 26},150 Q${wx - 20},90 ${wx - 26},34Z" fill="${cc}"/><path d="M${wx + ww + 18},34 Q${wx + ww - 4},90 ${wx + ww + 8},150 L${wx + ww + 26},150 Q${wx + ww + 20},90 ${wx + ww + 26},34Z" fill="${cc}"/><rect x="${wx - 32}" y="30" width="${ww + 64}" height="6" fill="#2a1b10"/>`);
        add(`<polygon points="${wx},136 ${wx + ww},136 ${wx + ww + 60},${H} ${wx - 40},${H}" fill="${night ? '#9fb0e0' : '#f0e2b0'}" opacity=".07"/>`);
      }
      if (museum) { for (let i = 0; i < 3; i++) { const x = 70 + i * 120 + R(-10, 10); add(`<rect x="${x - 16}" y="150" width="32" height="40" fill="#6a5e50"/><rect x="${x - 20}" y="146" width="40" height="6" fill="#7a6e60"/><path d="M${x - 10},146 Q${x},${R(100, 115)} ${x + 10},146Z" fill="#a89a80"/>`); } }
      glow(R(120, 280), 120, 200, '#ffd8a0', .12);
      break;
    }
    case 'cellar': {
      add(`<rect width="${W}" height="${H}" fill="#0e0c0b"/>`);
      const cx = 200 + R(-30, 30);
      for (let i = 0; i < 7; i++) {
        const t = i / 7, w = 380 * (1 - t * .85), h = 240 * (1 - t * .8), y0 = 255 - (255 - 150) * t * .9;
        const c = Math.round(70 - t * 60);
        add(`<path d="M${cx - w / 2},${y0} L${cx - w / 2},${y0 - h * .55} Q${cx - w / 2},${y0 - h} ${cx},${y0 - h} Q${cx + w / 2},${y0 - h} ${cx + w / 2},${y0 - h * .55} L${cx + w / 2},${y0}" fill="none" stroke="rgb(${c},${c - 8},${c - 14})" stroke-width="${14 * (1 - t)}"/>`);
      }
      for (let i = 0; i < 60; i++) { const x = R(0, W), y = R(0, H); add(`<rect x="${x}" y="${y}" width="${R(10, 22)}" height="${R(4, 7)}" fill="none" stroke="#2a2420" stroke-width=".8" opacity=".6"/>`); }
      add(`<ellipse cx="${cx}" cy="245" rx="160" ry="12" fill="#000" opacity=".5"/>`);
      glow(cx, 150, 160, '#ffe2a6', .12);
      if (has('stair', 'steps')) for (let i = 0; i < 6; i++) add(`<rect x="${cx - 40 + i * 6}" y="${230 - i * 14}" width="${80 - i * 12}" height="14" fill="#2c2622" stroke="#1a1512"/>`);
      if (has('sarcophag', 'tombstone', 'coffin', ' tomb')) add(`<rect x="${cx - 50}" y="200" width="100" height="34" fill="#3a3430" stroke="#1d1916"/><rect x="${cx - 56}" y="194" width="112" height="9" fill="#4a443e"/><path d="M${cx - 8},206 h16 M${cx},200 v26" stroke="#6a625a" stroke-width="3"/>`);
      if (has('cobweb', 'web')) for (let i = 0; i < 4; i++) add(`<line x1="${R(0, W)}" y1="0" x2="${R(0, W)}" y2="${R(10, 40)}" stroke="#6a8aa0" stroke-width=".7" opacity=".3"/>`);
      break;
    }
    case 'heights': {
      add(`<rect width="${W}" height="${H}" fill="${lin('sky', [[0, '#0b1230'], [.7, '#2b3560'], [1, '#6a5a70']])}"/>`);
      stars(120, 150); moon(R(60, 340), R(35, 70), R(10, 16));
      ridge(190, 10, '#2a2f48', 7); ridge(205, 8, '#1f2238', 8);
      if (has('village', 'town', 'city', 'lights', 'motorway')) for (let i = 0; i < 14; i++) add(`<circle cx="${R(0, W)}" cy="${R(200, 215)}" r="1.2" fill="#ffd27a" opacity="${R(.4, .9)}"/>`);
      if (has('observatory', 'telescope')) {
        add(`<rect x="150" y="150" width="100" height="70" fill="#1a1a24"/><path d="M150,150 A50,50 0 0 1 250,150Z" fill="#2a2a38"/><rect x="194" y="102" width="12" height="40" fill="#0b1230"/><rect x="190" y="95" width="16" height="60" fill="#5a5a6a" transform="rotate(-30 198 140)"/>`);
      } else if (has('spire', 'bell')) {
        add(`<polygon points="200,20 222,160 178,160" fill="#14131c"/><rect x="170" y="160" width="60" height="100" fill="#14131c"/><path d="M188,190 a12,12 0 0 1 24,0 v24 h-24z" fill="#ffd27a" opacity=".5"/>`);
      } else if (has('beanstalk', 'tree')) {
        add(`<path d="M200,${H} C170,200 240,150 200,100 C170,60 230,30 210,0" stroke="#1d3a22" stroke-width="16" fill="none"/>`);
        for (let i = 0; i < 12; i++) { const y = R(10, 250), x = 200 + Math.sin(y / 30) * 20; add(`<ellipse cx="${x + R(-30, 30)}" cy="${y}" rx="16" ry="7" fill="#2d5a32" transform="rotate(${R(-40, 40)} ${x} ${y})"/>`); }
      } else if (has('battlement', 'tower', 'roof', 'parapet', 'turret', 'rampart', 'wall')) {
        let d = `M0,${H} L0,200`;
        let x = 0;
        while (x < W) { const cw = R(14, 22); d += ` L${x},188 L${x + cw},188 L${x + cw},200 L${x + cw + R(10, 18)},200`; x += cw + R(18, 26); }
        d += ` L${W},200 L${W},${H}Z`;
        add(`<path d="${d}" fill="#141320"/>`);
        for (let i = 0; i < 3; i++) { const cx = R(30, 370); add(`<rect x="${cx}" y="${R(120, 150)}" width="${R(14, 22)}" height="80" fill="#141320"/><rect x="${cx - 3}" y="${R(118, 122)}" width="26" height="6" fill="#1c1b2a"/>`); }
      }
      break;
    }
    case 'garden': {
      const dusk = r() < .4;
      skyDay(dusk ? '#e3a06a' : '#8fb4d6', dusk ? '#f2d6a2' : '#dfe8e0');
      if (dusk) glow(R(80, 320), 150, 120, '#ffd9a0', .7); else add(`<circle cx="${R(40, 360)}" cy="${R(30, 60)}" r="16" fill="#fff6d8" opacity=".9"/>`);
      for (let i = 0; i < 4; i++) add(`<ellipse cx="${R(0, W)}" cy="${R(20, 80)}" rx="${R(30, 60)}" ry="${R(6, 12)}" fill="#fff" opacity="${R(.25, .5)}"/>`);
      ridge(150, 10, dusk ? '#7a6a6a' : '#7d9a86', 6);
      ridge(170, 8, dusk ? '#4c5a3c' : '#5b8a52', 8);
      if (has('tree', 'wood', 'forest', 'copse', 'orchard', 'grove', 'avenue', 'oak', 'yew', 'elm', 'willow')) for (let i = 0; i < 5; i++) tree(R(0, W), R(165, 180), R(30, 50), dusk ? '#334428' : '#3e6a36');
      if (has('maze', 'hedge')) {
        for (let i = 0; i < 4; i++) { const y = 185 + i * 18, h = 12 + i * 5; add(`<rect x="${-20 + i * 10 + R(0, 30)}" y="${y - h}" width="${R(120, 180)}" height="${h}" rx="4" fill="#24451f"/><rect x="${R(220, 280)}" y="${y - h}" width="${R(120, 180)}" height="${h}" rx="4" fill="#2a4f24"/>`); }
      }
      add(`<path d="M0,180 Q200,170 400,182 L400,${H} L0,${H}Z" fill="${lin('lawn', [[0, dusk ? '#56683a' : '#6a9a4a'], [1, dusk ? '#2c3a1e' : '#3e6a2c']])}"/>`);
      if (!has('maze') && has('path', 'drive', 'track', 'lane', 'walk', 'trail')) add(`<path d="M${R(170, 190)},182 Q${R(150, 250)},215 ${R(120, 160)},${H} L${R(250, 290)},${H} Q${R(200, 240)},215 ${R(205, 225)},182Z" fill="#c8b88e" opacity=".85"/>`);
      if (has('summer house', 'folly', 'pavilion')) { const x = R(70, 120); add(`<rect x="${x}" y="150" width="56" height="36" fill="#e8e0cc"/><polygon points="${x - 6},150 ${x + 28},126 ${x + 62},150" fill="#8a4a3a"/><rect x="${x + 20}" y="162" width="16" height="24" fill="#3a2a1a"/>`); }
      if (has('stream', 'water', 'pond', 'fountain')) add(`<path d="M0,215 Q120,200 220,222 T400,212 L400,226 Q300,232 220,236 T0,229Z" fill="#8ab4c8" opacity=".8"/>`);
      if (has('flower', 'daisy', 'daisies', 'bloom', 'rose', 'tulip', 'flowerbed')) for (let i = 0; i < 40; i++) add(`<circle cx="${R(0, W)}" cy="${R(195, 255)}" r="${R(1, 2.5)}" fill="${['#f2d24a', '#e86a6a', '#f4f0f0', '#b07ad8'][RI(0, 3)]}" opacity=".85"/>`);
      if (has('statue', 'ornament', 'sundial', 'gnome')) add(`<rect x="300" y="196" width="18" height="30" fill="#9a9488"/><circle cx="309" cy="190" r="8" fill="#aaa498"/>`);
      break;
    }
    case 'water': {
      const dusk = r() < .6;
      skyDay(dusk ? '#2a2a52' : '#7aa6c8', dusk ? '#e89a6a' : '#d8e6ea');
      const sx = R(80, 320);
      if (dusk) glow(sx, 140, 120, '#ffc080', .6);
      add(`<circle cx="${sx}" cy="${dusk ? 136 : 50}" r="${dusk ? 20 : 14}" fill="${dusk ? '#ffd8a0' : '#fffbe8'}"/>`);
      const river = has('river', 'stream') && !has('sea');
      if (river) { ridge(130, 12, '#4a6a4a', 6); }
      add(`<rect y="142" width="${W}" height="${H - 142}" fill="${lin('sea', [[0, dusk ? '#5a4a6a' : '#5a8aa8'], [1, dusk ? '#1a1a30' : '#1e4a68']])}"/>`);
      if (dusk) add(`<rect x="${sx - 14}" y="142" width="28" height="118" fill="${lin('rf', [[0, '#ffd8a0', .7], [1, '#ffd8a0', 0]])}"/>`);
      for (let i = 0; i < 28; i++) { const y = R(146, 258), x = R(-20, W), l = R(10, 40) * (y / 160); add(`<path d="M${x},${y} q${l / 2},-3 ${l},0" stroke="#fff" stroke-width=".8" fill="none" opacity="${R(.15, .45)}"/>`); }
      if (river) { add(`<path d="M0,175 Q60,165 120,180 L0,200Z" fill="#33502e"/><path d="M400,180 Q330,172 280,190 L400,210Z" fill="#33502e"/>`); for (let i = 0; i < 30; i++) { const x = r() < .5 ? R(0, 110) : R(290, 400), y = R(180, 210); add(`<line x1="${x}" y1="${y}" x2="${x + R(-3, 3)}" y2="${y - R(10, 24)}" stroke="#2a3f22" stroke-width="1.5"/>`); } }
      if (has('lighthouse', 'pharos')) { const lx = R(40, 90); add(`<path d="M${lx - 30},160 Q${lx},130 ${lx + 40},160Z" fill="#2a2420"/><polygon points="${lx - 8},145 ${lx + 8},145 ${lx + 5},70 ${lx - 5},70" fill="#e8e0d0"/><rect x="${lx - 7}" y="60" width="14" height="10" fill="#ffd27a"/><polygon points="${lx},65 ${lx + 220},40 ${lx + 220},90" fill="#fff2b0" opacity=".12"/>`); }
      if (has('ship', 'aboard', 'mast', 'prow', 'stern', 'deck', 'boat', 'drifting')) {
        const bx = R(140, 260), big = has('aboard', 'mast', 'prow', 'stern', 'deck');
        const sc = big ? 1.6 : 1;
        add(`<g transform="translate(${bx} ${big ? 205 : 170}) scale(${sc})"><path d="M-50,0 L50,0 L38,16 L-40,16Z" fill="#2a1a10"/><line x1="0" y1="0" x2="0" y2="-70" stroke="#2a1a10" stroke-width="2.5"/><line x1="-22" y1="0" x2="-22" y2="-48" stroke="#2a1a10" stroke-width="2"/><path d="M2,-66 Q30,-40 2,-8Z" fill="#efe4c8"/><path d="M-20,-44 Q-2,-26 -20,-6Z" fill="#e4d6b8"/><path d="M0,-70 l14,4 -14,4z" fill="#a83a2a"/></g>`);
      }
      if (has('cliff', 'shore', 'beach', 'jetty', 'causeway', 'harbour', 'island', 'quay')) {
        add(`<path d="M0,${H} L0,200 Q80,190 160,215 Q220,235 260,${H}Z" fill="#c8b07a"/>`);
        if (has('jetty', 'harbour', 'quay', 'causeway')) { add(`<rect x="230" y="198" width="170" height="8" fill="#4a3424"/>`); for (let x = 240; x < 400; x += 22) add(`<rect x="${x}" y="198" width="4" height="30" fill="#3a2618"/>`); }
      }
      break;
    }
    case 'cave': {
      const cliff = has('cliff', 'valley', 'prospect', 'clifftop', 'spur', 'rope');
      if (cliff) {
        skyDay('#6f8fb0', '#e8d8c0'); ridge(150, 14, '#8a9aa8', 6); ridge(175, 10, '#6a7a6a', 7);
        add(`<path d="M0,0 L120,0 Q150,60 130,120 Q170,180 140,${H} L0,${H}Z" fill="#5a4a3a"/><path d="M0,0 L80,0 Q100,80 90,160 Q110,210 90,${H} L0,${H}Z" fill="#3e3228"/>`);
        if (has('rope', 'hanging')) add(`<line x1="118" y1="0" x2="${R(120, 140)}" y2="200" stroke="#c8a870" stroke-width="2"/>`);
        add(`<path d="M260,${H} Q300,210 400,200 L400,${H}Z" fill="#4a5a3a"/>`);
        for (let i = 0; i < 3; i++) add(`<path d="M${R(200, 360)},${R(40, 90)} q6,-5 12,0 q6,-5 12,0" stroke="#2a2a2a" fill="none" stroke-width="1.3"/>`);
      } else {
        add(`<rect width="${W}" height="${H}" fill="${lin('out', [[0, '#8aa8c0'], [1, '#d8c8a0']])}"/>`);
        ridge(160, 10, '#7a8a7a', 6); ridge(190, 8, '#5a6a4a', 7);
        add(`<path d="M0,0 L${W},0 L${W},${H} L0,${H}Z M90,${H} Q80,120 150,70 Q200,40 250,70 Q330,120 310,${H}Z" fill="#2a221c" fill-rule="evenodd"/>`);
        for (let i = 0; i < 22; i++) { const x = R(0, W), y = R(0, H); add(`<path d="M${x},${y} l${R(10, 30)},${R(-8, 8)} l${R(-5, 10)},${R(8, 20)}z" fill="#3a3028" opacity=".8"/>`); }
        for (let i = 0; i < 7; i++) { const x = R(150, 260); add(`<path d="M${x - 5},${R(40, 70)} l5,${R(12, 26)} l5,-${R(12, 26)}z" fill="#2a221c"/>`); }
      }
      break;
    }
    case 'classical': {
      skyDay('#4a7ab0', '#f0dcb0');
      add(`<circle cx="${R(40, 360)}" cy="${R(30, 60)}" r="18" fill="#fff4c8"/>`);
      ridge(160, 14, '#a8a08a', 6); ridge(180, 8, '#8a8a5a', 7);
      const indoor = has('cloister', 'atrium', 'triclinium', 'sanctum', 'inner', 'palace', 'lost inside', 'guard');
      const tx = indoor ? 200 : R(150, 250), n = indoor ? 7 : 6, cw = indoor ? 320 : 170, cl = tx - cw / 2;
      if (!indoor) add(`<polygon points="${cl - 10},92 ${tx},62 ${cl + cw + 10},92" fill="#e6dcc4" stroke="#b0a080"/><rect x="${cl - 10}" y="92" width="${cw + 20}" height="10" fill="#d8ccb0"/>`);
      else add(`<rect x="0" y="40" width="${W}" height="20" fill="#d8ccb0"/><rect x="0" y="60" width="${W}" height="6" fill="#b8a888"/>`);
      const top = indoor ? 66 : 102, bot = indoor ? 215 : 190;
      for (let i = 0; i < n; i++) { const x = cl + i * (cw / (n - 1)); add(`<rect x="${x - 7}" y="${top}" width="14" height="${bot - top}" fill="${lin('col', [[0, '#f4ecd8'], [1, '#c8bca0']], 1, 0)}"/><rect x="${x - 10}" y="${top}" width="20" height="5" fill="#e0d4bc"/><rect x="${x - 10}" y="${bot - 4}" width="20" height="5" fill="#d0c4aa"/>`); }
      add(`<rect x="${cl - 20}" y="${bot}" width="${cw + 40}" height="6" fill="#d8ccb0"/><rect x="${cl - 30}" y="${bot + 6}" width="${cw + 60}" height="6" fill="#c8bca0"/>`);
      if (!indoor && has('cypress', 'tree', 'grove')) { cypress(R(30, 80), 200, R(70, 100), '#2a4026'); cypress(R(320, 370), 200, R(70, 100), '#2a4026'); }
      add(`<rect y="${bot + 12}" width="${W}" height="${H}" fill="#b8a07a"/>`);
      if (has('taverna')) add(`<rect x="20" y="150" width="90" height="50" fill="#f0f0f0"/><rect x="50" y="170" width="20" height="30" fill="#2a5a8a"/><rect x="20" y="146" width="90" height="6" fill="#2a5a8a"/>`);
      break;
    }
    case 'church': {
      const outside = has('outside', 'spire', 'bell tower', 'churchyard');
      if (outside) {
        add(`<rect width="${W}" height="${H}" fill="${lin('sky', [[0, '#141a34'], [1, '#4a4a6a']])}"/>`); stars(80, 140); moon(320, 50, 12);
        add(`<polygon points="160,10 180,110 140,110" fill="#14131c"/><rect x="135" y="110" width="50" height="150" fill="#14131c"/><rect x="185" y="160" width="160" height="100" fill="#1a1924"/><polygon points="180,160 265,120 350,160" fill="#1a1924"/>`);
        for (let i = 0; i < 4; i++) add(`<path d="M${205 + i * 36},215 v-22 a8,8 0 0 1 16,0 v22z" fill="#ffd27a" opacity=".55"/>`);
        add(`<path d="M150,150 a10,10 0 0 1 20,0 v20 h-20z" fill="#ffd27a" opacity=".5"/>`);
      } else {
        add(`<rect width="${W}" height="${H}" fill="${lin('st', [[0, '#2c2a30'], [1, '#141317']])}"/>`);
        const nw = !has('window', 'glass') ? 0 : has('chapel') ? 1 : 3;
        for (let i = 0; i < nw; i++) {
          const x = nw === 1 ? 200 : 90 + i * 110, w = 54;
          add(`<path d="M${x - w / 2},170 L${x - w / 2},70 Q${x - w / 2},28 ${x},18 Q${x + w / 2},28 ${x + w / 2},70 L${x + w / 2},170Z" fill="#111"/>`);
          for (let rr = 0; rr < 8; rr++) for (let c = 0; c < 3; c++) {
            const cx = x - w / 2 + 6 + c * 15, cy = 34 + rr * 17;
            if (cy < 40 && c !== 1) continue;
            add(`<rect x="${cx}" y="${cy}" width="13" height="15" fill="${['#b8323a', '#2a5ab0', '#d8a830', '#3a8a5a', '#8a3ab0'][RI(0, 4)]}" opacity=".85"/>`);
          }
          add(`<path d="M${x - w / 2},170 L${x - w / 2},70 Q${x - w / 2},28 ${x},18 Q${x + w / 2},28 ${x + w / 2},70 L${x + w / 2},170Z" fill="none" stroke="#2a2830" stroke-width="5"/><line x1="${x}" y1="20" x2="${x}" y2="170" stroke="#2a2830" stroke-width="3"/>`);
          add(`<polygon points="${x - w / 2},170 ${x + w / 2},170 ${x + w},${H} ${x - w},${H}" fill="#f0d8a0" opacity=".06"/>`);
        }
        if (has('pew')) for (let i = 0; i < 4; i++) { const y = 190 + i * 18; add(`<rect x="${40 - i * 10}" y="${y}" width="${130 + i * 6}" height="${8 + i * 2}" fill="#3a2414"/><rect x="${230 + i * 4}" y="${y}" width="${130 + i * 6}" height="${8 + i * 2}" fill="#3a2414"/>`); }
        if (has('candle')) for (let i = 0; i < 2; i++) { const x = i ? 250 : 150; add(`<rect x="${x - 2}" y="168" width="4" height="16" fill="#efe6cc"/><circle cx="${x}" cy="164" r="3" fill="#ffd27a"/>`); glow(x, 164, 40, '#ffcf70', .4); }
      }
      break;
    }
    case 'egypt': {
      skyDay('#e8b070', '#f8e0b0');
      add(`<circle cx="${R(60, 340)}" cy="${R(50, 80)}" r="26" fill="#fff0c0" opacity=".95"/>`);
      if (has('pyramid')) for (let i = 0; i < 3; i++) { const x = R(40, 360), s = R(50, 110), b = 190; add(`<polygon points="${x - s},${b} ${x},${b - s * .95} ${x + s},${b}" fill="#d8a860"/><polygon points="${x},${b - s * .95} ${x + s},${b} ${x + s * .3},${b}" fill="#a87a40"/>`); }
      add(`<path d="M0,190 Q100,175 200,192 T400,186 L400,${H} L0,${H}Z" fill="${lin('dn', [[0, '#e0b878'], [1, '#b8884a']])}"/>`);
      add(`<path d="M0,225 Q120,205 240,228 T400,220 L400,${H} L0,${H}Z" fill="#c8985a" opacity=".8"/>`);
      if (has('necropolis', 'tomb', 'crossroads')) for (let i = 0; i < 5; i++) { const x = R(20, 380); add(`<rect x="${x}" y="${R(195, 215)}" width="${R(12, 20)}" height="${R(14, 26)}" fill="#8a6a40"/>`); }
      break;
    }
    case 'camp': {
      add(`<rect width="${W}" height="${H}" fill="${lin('sky', [[0, '#0a0c1e'], [1, '#2a2440']])}"/>`); stars(140, 160);
      ridge(150, 30, '#16182a', 6, 1); ridge(185, 12, '#11121e', 8);
      add(`<rect y="200" width="${W}" height="60" fill="#14120f"/>`);
      const fx = R(170, 230);
      const fire = has('fire', 'flame', 'blaze', 'embers', 'camp');
      if (fire) glow(fx, 205, 140, '#ff8a2a', .45);
      if (has('tent', 'camp', 'encampment')) for (let i = 0; i < 3; i++) { const x = i === 1 ? R(260, 330) : (i ? R(40, 110) : R(330, 380)), s = R(36, 56); add(`<polygon points="${x - s},218 ${x},${218 - s * 1.1} ${x + s},218" fill="#6a5a40"/><polygon points="${x - 8},218 ${x},${208 - s * .3} ${x + 8},218" fill="#1a120a"/><polygon points="${x},${218 - s * 1.1} ${x + s},218 ${x + s * .45},218" fill="#4a3e2c"/>`); }
      if (has('dolmen', 'stone', 'menhir')) add(`<rect x="${fx - 70}" y="160" width="16" height="50" fill="#4a4844"/><rect x="${fx + 54}" y="162" width="16" height="48" fill="#4a4844"/><rect x="${fx - 80}" y="148" width="160" height="16" rx="4" fill="#5a5854"/>`);
      if (fire) add(`<path d="M${fx - 14},214 Q${fx - 10},190 ${fx},176 Q${fx + 10},192 ${fx + 14},214Z" fill="#ff9a30"/><path d="M${fx - 7},214 Q${fx - 4},198 ${fx},188 Q${fx + 5},200 ${fx + 7},214Z" fill="#ffe08a"/><path d="M${fx - 20},216 l40,-6 M${fx - 20},210 l40,6" stroke="#3a2414" stroke-width="4"/>`);
      if (fire) for (let i = 0; i < 14; i++) add(`<circle cx="${fx + R(-20, 20)}" cy="${R(120, 180)}" r="${R(.6, 1.4)}" fill="#ffb050" opacity="${R(.3, .9)}"/>`);
      break;
    }
    case 'city': {
      add(`<rect width="${W}" height="${H}" fill="${lin('sky', [[0, '#1e2448'], [.6, '#7a4a6a'], [1, '#e8986a']])}"/>`); stars(30, 60, .5);
      let x = -10;
      while (x < W) {
        const bw = R(36, 70), bh = R(60, 140), y = 200 - bh;
        add(`<rect x="${x}" y="${y}" width="${bw}" height="${bh}" fill="${['#1c1a26', '#221e2c', '#1a1822'][RI(0, 2)]}"/>`);
        if (r() < .5) add(`<path d="M${x - 2},${y} L${x + 8},${y - 14} L${x + bw - 8},${y - 14} L${x + bw + 2},${y}Z" fill="#2a2638"/>`);
        for (let wy = y + 10; wy < 190; wy += 16) for (let wx = x + 6; wx < x + bw - 8; wx += 12) if (r() < .45) add(`<rect x="${wx}" y="${wy}" width="6" height="9" fill="#ffd27a" opacity="${R(.5, .95)}"/>`);
        x += bw + R(0, 4);
      }
      add(`<polygon points="0,200 ${W},200 ${W},${H} 0,${H}" fill="${lin('st', [[0, '#2a2630'], [1, '#141218']])}"/>`);
      for (let i = 0; i < 8; i++) add(`<line x1="${200 + (i - 4) * 10}" y1="200" x2="${200 + (i - 4) * 70}" y2="${H}" stroke="#3a3440" stroke-width="1"/>`);
      if (has('lamp', 'street')) for (let i = 0; i < 2; i++) { const lx = i ? R(300, 360) : R(40, 100); add(`<line x1="${lx}" y1="${H}" x2="${lx}" y2="150" stroke="#0e0c12" stroke-width="4"/><rect x="${lx - 6}" y="140" width="12" height="14" fill="#ffe0a0"/>`); glow(lx, 147, 60, '#ffd890', .5); }
      if (has('cafe', 'café', 'taverna')) add(`<path d="M120,160 L280,160 L290,176 L110,176Z" fill="#a83a3a"/><path d="M110,176 q10,6 20,0 q10,6 20,0 q10,6 20,0 q10,6 20,0 q10,6 20,0 q10,6 20,0 q10,6 20,0 q10,6 20,0 q10,6 20,0" fill="#e8e0d0"/>`);
      if (has('river', 'port', 'warehouse')) add(`<rect y="225" width="${W}" height="35" fill="#1a2a40"/><path d="M0,232 q20,-3 40,0 t40,0 t40,0 t40,0 t40,0 t40,0 t40,0 t40,0 t40,0 t40,0" stroke="#ffd27a" fill="none" opacity=".3"/>`);
      break;
    }
    case 'otherworld': default: {
      const hell = has('hell', 'death', 'reaper', 'buried'), heaven = has('heaven', 'spirit', 'height');
      const c = hell ? ['#1a0606', '#5a1010', '#ff6a2a'] : heaven ? ['#e8e0f8', '#f8e8c0', '#ffffff'] : ['#0a0820', '#3a1a5a', '#b08aff'];
      add(`<rect width="${W}" height="${H}" fill="${rad('bg', [[0, c[1]], [1, c[0]]], .5, .55, .75)}"/>`);
      if (!heaven) stars(90, H, .8);
      const cx = 200 + R(-40, 40), cy = 130 + R(-20, 20);
      for (let i = 0; i < 9; i++) {
        const rr = 20 + i * 18, a = R(0, 6.28);
        add(`<path d="M${cx + Math.cos(a) * rr},${cy + Math.sin(a) * rr * .6} A${rr},${rr * .6} 0 0 1 ${cx + Math.cos(a + 2.4) * rr},${cy + Math.sin(a + 2.4) * rr * .6}" stroke="${c[2]}" stroke-width="${R(.6, 2)}" fill="none" opacity="${R(.2, .6)}"/>`);
      }
      glow(cx, cy, 80, c[2], .5);
      add(`<circle cx="${cx}" cy="${cy}" r="${R(10, 18)}" fill="${c[2]}" opacity=".9"/>`);
      for (let i = 0; i < 6; i++) { const x = R(30, 370), y = R(30, 230), rr = R(3, 9); glow(x, y, rr * 4, c[2], .4); add(`<circle cx="${x}" cy="${y}" r="${rr}" fill="${c[2]}" opacity=".7"/>`); }
      if (has('infinity')) add(`<path d="M${cx - 60},${cy} C${cx - 60},${cy - 40} ${cx},${cy - 40} ${cx},${cy} C${cx},${cy + 40} ${cx + 60},${cy + 40} ${cx + 60},${cy} C${cx + 60},${cy - 40} ${cx},${cy - 40} ${cx},${cy} C${cx},${cy + 40} ${cx - 60},${cy + 40} ${cx - 60},${cy}Z" stroke="#ffe8a0" stroke-width="3" fill="none"/>`);
      if (has('tarot', 'fool', 'clairvoy*', 'cups', 'reaper', 'sailor')) for (let i = 0; i < 3; i++) { const x = 120 + i * 80; add(`<rect x="${x - 22}" y="170" width="44" height="66" rx="4" fill="#e8d8b0" stroke="#8a6a30" stroke-width="2" transform="rotate(${(i - 1) * 8} ${x} 203)"/><circle cx="${x}" cy="200" r="10" fill="none" stroke="#8a3a2a" stroke-width="2" transform="rotate(${(i - 1) * 8} ${x} 203)"/>`); }
      break;
    }
  }
  props(h, cat, kw);
  return finish(cat);

  function finish(c) {
  // the people who are here, drawn on top of the room
  if (catOverride !== 'darkness') { const PP = root.ZPeople || (typeof require === 'function' ? (() => { try { return require('./people.js'); } catch (e) { return null; } })() : null); if (PP) try { PP.drawAll(h, name, els.join('')); } catch (e) {} }
  // atmosphere: vignette + grain + frame
  defs.push(`<filter id="${id}gr" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="${hash(name || '') % 100}"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .4  0 0 0 0 .3  0 0 0 .5 0"/></filter>`);
  const vig = rad('vg', [[.55, '#000', 0], [1, '#000', .7]], .5, .5, .75);
  // things the game text has not mentioned yet are only a faint, colourless shape
  if (h.st.known && h.st.mentioned) {
    let faint = false; const known = h.st.mentioned;
    const body = els.join('').replace(/<g class="zi" data-k="([^"]+)"/g, (m, k) => known(k) ? m : (faint = true, `<g class="zi zu" data-k="${k}" opacity=".2" filter="url(#${id}zu)"`));
    if (faint) defs.push(`<filter id="${id}zu" x="-20%" y="-20%" width="140%" height="140%"><feColorMatrix type="saturate" values="0"/><feGaussianBlur stdDeviation="1.8"/></filter>`);
    els.length = 0; els.push(body);
  }
  return {
    cat: c, mood: MOOD[c] || 'house',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${defs.join('')}</defs>${els.join('')}<rect width="${W}" height="${H}" filter="url(#${id}gr)" opacity=".35"/><rect width="${W}" height="${H}" fill="${vig}"/></svg>`,
    bespoke: !!bespoke
  };
  }
}

// Props drawn on top of the generic scenes, taken from what the room description mentions.
const INDOOR = { attic: 1, interior: 1, cellar: 1, church: 1, darkness: 0 };
function props(h, cat, kw) {
  if (cat === 'darkness' || cat === 'otherworld') return;
  const { add, R, has } = h;
  const indoor = !!INDOOR[cat];
  const slots = [[30, 250], [370, 250], [95, 250], [305, 250]];
  let si = 0;
  const slot = () => slots[si++ % slots.length];
  // the word as it stands in the description, unless it is negated ("there are no bones on show")
  const wordM = w => {
    const re = new RegExp('\\b' + w + '\\b', 'g'); let m;
    while ((m = re.exec(kw))) { const before = kw.slice(Math.max(0, m.index - 28), m.index); if (!/\b(no|not|nor|without|never|none)\b[^.,;]*$/.test(before)) return m[0]; }
    return null;
  };
  const word = w => !!wordM(w);
  if (word('(stairs|staircase|steps|stairway|flight)')) {
    const up = /\b(up|upward|upstairs)\b/.test(kw) && !/\bdown\b/.test(kw);
    const x = r0() < .5 ? 300 : 20, n = 6;
    for (let i = 0; i < n; i++) add(`<rect x="${x + i * 6}" y="${up ? 252 - (i + 1) * 12 : 200 + i * 10}" width="${80 - i * 8}" height="${up ? 12 : 10}" fill="${i % 2 ? '#4a3a2c' : '#3e3024'}" stroke="#15100b" stroke-width=".8" opacity=".95"/>`);
  }
  if (indoor && wordM('(door|doorway|doors)')) { const lbl = wordM('(door|doorway|doors)');
    const x = R(40, 330);
    add(`<g class="zi" data-k="${lbl}">`); add(`<rect x="${x - 3}" y="${118}" width="42" height="86" fill="#2a1b10"/><rect x="${x}" y="121" width="36" height="83" fill="${word('open') ? '#060403' : '#5a3a20'}"/>${word('open') ? '' : `<circle cx="${x + 30}" cy="164" r="2.5" fill="#c8a060"/>`}`); add('</g>');
  }
  if (indoor && word('window') && !word('no windows')) {
    const x = R(60, 300);
    add(`<rect x="${x}" y="62" width="44" height="56" fill="#26324a" stroke="#1a120b" stroke-width="4"/><line x1="${x + 22}" y1="62" x2="${x + 22}" y2="118" stroke="#1a120b" stroke-width="2"/><line x1="${x}" y1="90" x2="${x + 44}" y2="90" stroke="#1a120b" stroke-width="2"/>`);
  }
  if (wordM('(ladder)')) { const lbl = wordM('(ladder)'); const x = R(60, 320); add(`<g class="zi" data-k="${lbl}"><line x1="${x}" y1="250" x2="${x + 14}" y2="40" stroke="#7a5a34" stroke-width="4"/><line x1="${x + 30}" y1="250" x2="${x + 44}" y2="40" stroke="#7a5a34" stroke-width="4"/>${Array.from({ length: 9 }, (_, i) => `<line x1="${x + 1 + i * 1.5}" y1="${230 - i * 22}" x2="${x + 31 + i * 1.5}" y2="${230 - i * 22}" stroke="#6a4a28" stroke-width="3"/>`).join('')}</g>`); }
  if (wordM('(rope)')) { const lbl = wordM('(rope)'); const x = R(80, 320); add(`<g class="zi" data-k="${lbl}"><path d="M${x},0 q6,80 -2,160 q-2,20 4,40" stroke="#c8a870" stroke-width="3" fill="none"/></g>`); }
  if (wordM('(chest|trunk|crate|box|boxes)')) { const lbl = wordM('(chest|trunk|crate|box|boxes)'); const [x, y] = slot(); add(`<g class="zi" data-k="${lbl}"><rect x="${x - 26}" y="${y - 30}" width="52" height="30" rx="3" fill="#6a4628" stroke="#22150a" stroke-width="1.5"/><path d="M${x - 26},${y - 30} q26,-14 52,0" fill="#7a5632" stroke="#22150a"/><rect x="${x - 4}" y="${y - 24}" width="8" height="8" fill="#c8a050"/></g>`); }
  if (wordM('(barrel|barrels|cask|casks)')) { const lbl = wordM('(barrel|barrels|cask|casks)'); const [x, y] = slot(); add(`<g class="zi" data-k="${lbl}"><ellipse cx="${x}" cy="${y - 22}" rx="20" ry="26" fill="#6a4426"/><ellipse cx="${x}" cy="${y - 46}" rx="16" ry="4" fill="#4a2e18"/><path d="M${x - 20},${y - 32} h40 M${x - 20},${y - 12} h40" stroke="#2a2a2a" stroke-width="3"/></g>`); }
  if (wordM('(statue|bust|sculpture)')) { const lbl = wordM('(statue|bust|sculpture)'); const [x, y] = slot(); add(`<g class="zi" data-k="${lbl}"><rect x="${x - 12}" y="${y - 26}" width="24" height="26" fill="#9a948a"/><path d="M${x - 10},${y - 26} q0,-36 10,-44 q10,8 10,44z" fill="#b0aaa0"/><circle cx="${x}" cy="${y - 76}" r="8" fill="#b8b2a8"/></g>`); }
  if (wordM('(bench|seat)')) { const lbl = wordM('(bench|seat)'); const [x, y] = slot(); add(`<g class="zi" data-k="${lbl}"><rect x="${x - 30}" y="${y - 20}" width="60" height="6" fill="#7a5a3a"/><rect x="${x - 26}" y="${y - 14}" width="5" height="14" fill="#4a3420"/><rect x="${x + 21}" y="${y - 14}" width="5" height="14" fill="#4a3420"/></g>`); }
  if (word('(lamp|lantern|candle|candles|torch|torches)')) { const x = R(60, 340), y = R(90, 140); h.glow(x, y, 70, '#ffc870', .45); add(`<rect x="${x - 5}" y="${y - 8}" width="10" height="14" rx="2" fill="#2a2016"/><circle cx="${x}" cy="${y - 1}" r="3.5" fill="#ffe0a0"/>`); }
  if (wordM('(skeleton|bones|skull)')) { const lbl = wordM('(skeleton|bones|skull)'); const [x, y] = slot(); add(`<g class="zi" data-k="${lbl}"><circle cx="${x}" cy="${y - 10}" r="8" fill="#e0d8c4"/><circle cx="${x - 3}" cy="${y - 11}" r="2" fill="#222"/><circle cx="${x + 3}" cy="${y - 11}" r="2" fill="#222"/><path d="M${x + 12},${y - 4} l24,-4 M${x + 14},${y} l20,2" stroke="#d8d0bc" stroke-width="3"/></g>`); }
  if (word('(fountain|well)') && !indoor) { const x = R(120, 280); add(`<ellipse cx="${x}" cy="236" rx="40" ry="9" fill="#8a8478"/><rect x="${x - 40}" y="216" width="80" height="20" fill="#9a9488"/><ellipse cx="${x}" cy="216" rx="40" ry="8" fill="#6a9ab8"/>`); }
  if (wordM('(cat|kitten)')) { const lbl = wordM('(cat|kitten)'); const [x, y] = slot(); add(`<g class="zi" data-k="${lbl}"><ellipse cx="${x}" cy="${y - 10}" rx="18" ry="9" fill="#d8803a"/><circle cx="${x - 16}" cy="${y - 18}" r="8" fill="#e08a40"/><polygon points="${x - 22},${y - 22} ${x - 21},${y - 31} ${x - 16},${y - 24}" fill="#e08a40"/><polygon points="${x - 14},${y - 24} ${x - 9},${y - 31} ${x - 9},${y - 20}" fill="#e08a40"/><path d="M${x + 16},${y - 8} q14,0 10,-14" stroke="#d8803a" stroke-width="4" fill="none"/></g>`); }
  if (word('(bell|bells)') && cat === 'church') { const x = R(120, 280); add(`<path d="M${x - 18},60 q0,-30 18,-32 q18,2 18,32 l6,8 h-48z" fill="#b8903a"/><circle cx="${x}" cy="72" r="4" fill="#6a5020"/>`); }
  function r0() { return R(0, 1); }
}

const api = { scene, classify, MOOD, CATS };
if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.ZArt = api;
})(typeof window !== 'undefined' ? window : this);
