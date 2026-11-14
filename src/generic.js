// Generic room illustrations, composed from the room description: walls and floor of the right material,
// the ways out where the text puts them, and the things the text names. Nothing that is not in the text.
(function (root) {
'use strict';
const GT = root.ZGenText || (typeof require === 'function' ? require('./gentext.js') : null);
const IC = () => root.ZIcons || (typeof require === 'function' ? (() => { try { return require('./icons.js'); } catch (e) { return null; } })() : null);
const P = () => root.ZGenParts || (typeof require === 'function' ? require('./genparts.js') : null);
const W = 400, H = 260;
const lerp = (a, b, t) => a + (b - a) * t;
const f1 = v => Math.round(v * 10) / 10;

// ---------------------------------------------------------------- materials
const MAT = {
  plaster: { wall: ['#5e4c3a', '#3c3026'], side: '#2e241b', floor: ['#4a3624', '#2a1e14'], kind: 'boards' },
  grime: { wall: ['#55503c', '#302c22'], side: '#24211a', floor: ['#3a3426', '#1e1b14'], kind: 'boards' },
  limestone: { wall: ['#c4ae86', '#9a8460'], side: '#7a6648', floor: ['#a48c66', '#6a5a40'], kind: 'flags' },
  stone: { wall: ['#5c5852', '#3a3834'], side: '#2c2a27', floor: ['#3e3a35', '#23211e'], kind: 'flags' },
  rock: { wall: ['#4e4236', '#2a221c'], side: '#211a15', floor: ['#33291f', '#1a1410'], kind: 'earth' },
  marble: { wall: ['#dcd4c4', '#aca492'], side: '#8a8272', floor: ['#b4ac9a', '#7a7466'], kind: 'flags' },
  granite: { wall: ['#bc8a80', '#8c5c56'], side: '#6a4440', floor: ['#9a6a62', '#5a3a36'], kind: 'flags' },
  glaze: { wall: ['#dc9838', '#a8641c'], side: '#7a4612', floor: ['#c8a064', '#8a6a3a'], kind: 'sand' },
  sandstone: { wall: ['#b8965e', '#8a6c40'], side: '#6a5030', floor: ['#8e7044', '#5a4428'], kind: 'flags' },
  tile: { wall: ['#c4c2b0', '#8c8a7a'], side: '#6a6a5e', floor: ['#5c5c58', '#363634'], kind: 'flags' },
  hide: { wall: ['#7a6040', '#4a3820'], side: '#3a2a18', floor: ['#3a2e20', '#1e1810'], kind: 'earth' }
};

// ---------------------------------------------------------------- the composer
const LAYOUT = {};
function compose(h, name, desc, cat) {
  if (!GT) return false;
  const rd = GT.reader(desc);
  if (rd.text.length < 30) return false;
  // A room keeps its layout (stage, material, view, size, ways out) when its description changes
  // because of something the player did; only a much fuller description lays it out anew.
  // (a description is "much fuller" when it is longer and keeps less than half of the sentences the layout came from)
  const sents = rd.text.toLowerCase().split(/(?<=[.!?])\s+/).filter(x => x.length > 12);
  const L = LAYOUT[name], kept = L ? L.sents.filter(x => sents.includes(x)).length / Math.max(1, L.sents.length) : 0;
  const fresh = !L || (rd.text.length > L.len * 1.3 && kept < .5);
  const st = fresh ? GT.stage(name, rd, cat) : L.st;
  const mat = fresh ? GT.material(rd, cat, st) : L.mat;
  // people walking down the stairs are not a way out of their own
  let exits = GT.exits(rd).filter(e => !/\b(strides?|strolls?|walks?|runs?|marche?s?|hurr(y|ies)|clatters?)\b/.test(e.clause)); const walls = GT.walls(rd);
  if (!fresh) exits = L.exits.concat(exits.filter(e => !L.exits.some(x => x.dir === e.dir && x.vert === e.vert)));
  // a staircase seen through an open door is drawn with the door, not as a way out of its own
  if (rd.has('door opens onto a staircase')) exits = exits.filter(e => !(e.vert && /door opens onto/.test(e.clause)));
  const ctx = { h, rd, name, cat, st, mat, exits, walls, surf: {}, used: { back: [], high: [], left: [], right: [], floor: [], floorB: [], land: [] }, out: [] };
  ctx.facing = fresh ? facing(ctx) : L.facing;
  if (!fresh) ctx.size = L.size;
  if (fresh) LAYOUT[name] = { len: rd.text.length, sents, st, mat, exits: exits.slice(), facing: ctx.facing, size: null };
  ctx.layout = LAYOUT[name];
  if (rd.has('only into a solid|to a sealed wall|only to a sealed')) ctx.exits = ctx.exits.filter(e => e.dir !== ctx.facing);
  ctx.rel = d => d === null || d === undefined ? null : (d - ctx.facing + 8) % 8;
  if (/inside well/i.test(name) || rd.has('clinging perilously to the walls')) { P().SHAFT(ctx); P().PORTABLES(ctx); return true; }
  if (rd.has('lie in the mummy|coffin lid')) P().COFFIN(ctx);
  else if (st === 'land') P().LAND(ctx);
  else if (st === 'deck') P().DECK(ctx);
  else if (st === 'tent') P().TENT(ctx);
  else ROOM(ctx);
  P().PORTABLES(ctx);
  return true;
}

// which way the picture looks: towards the ways out and the walls the text describes
function facing(ctx) {
  const items = [];
  const wt = ctx.st === 'land' ? { stairs: 3, door: 3, doorway: 3, ladder: 2, passage: 2, crawl: 2, path: 3, way: 2 } : { stairs: 3, door: 3, doorway: 3, ladder: 2, passage: 2, crawl: 2, path: 1.5, way: 1 };
  for (const e of ctx.exits) if (e.dir !== null) items.push([e.dir, wt[e.type] || 1]);
  for (const w of ctx.walls) items.push([w.dir, 4]);
  for (const l of P().landmarkDirs(ctx)) items.push([l.dir, 2.5]);
  if (ctx.st === 'passage') { const m = /\b(?:from|running)\s+(?:the\s+)?(?:\w+\s+)?(north|south|east|west)\w*\s+(?:\w+\s+)?to\s+(?:the\s+)?(north|south|east|west)/.exec(ctx.rd.t); if (m) return GT.COMPASS.indexOf(m[2]); }
  const vis = [1, .85, .55, 0, -.2, 0, .55, .85];
  let best = 0, bv = -1e9;
  for (const f of ctx.st === 'land' || ctx.st === 'deck' ? [0, 4, 2, 6, 1, 7, 3, 5] : [0, 4, 2, 6]) {
    let v = 0; for (const [d, w] of items) v += w * vis[(d - f + 8) % 8];
    if (v > bv + 1e-6) { bv = v; best = f; }
  }
  return best;
}

// ---------------------------------------------------------------- room geometry
function geo(ctx) {
  const { rd, st } = ctx;
  let size = rd.has('vast|great|spacious|large|huge|hall|cavernous') ? 'large' : rd.has('tiny|small|little room|cramped|low|claustrophobic|stooped|almost no room|no room|twelve feet') ? 'small' : 'normal';
  if (st === 'passage') size = 'deep';
  if (/revolving door|buried alive|sarcophagus|well/i.test(ctx.name)) size = 'small';
  if (ctx.size) size = ctx.size; else if (ctx.layout) ctx.layout.size = size;
  const g = { large: [104, 60, 296, 166], normal: [74, 48, 326, 186], small: [50, 34, 350, 210], deep: [166, 92, 234, 146] }[size];
  const [bx0, by0, bx1, by1] = g;
  const sb = (bx1 - bx0) / W;
  const G = {
    size, bx0, by0, bx1, by1, sb, vx: (bx0 + bx1) / 2, vy: (by0 + by1) / 2,
    back: (u, v = 0) => ({ x: lerp(bx0, bx1, u), y: lerp(by1, by0, v), s: sb }),
    floor: (u, d) => { const s = lerp(1, sb, d); return { x: lerp(lerp(0, W, u), lerp(bx0, bx1, u), d), y: lerp(H, by1, d), s }; },
    sideX: (side, t) => side === 'left' ? lerp(0, bx0, t) : lerp(W, bx1, t),
    sideTop: t => lerp(0, by0, t), sideBot: t => lerp(H, by1, t),
    // a quad on a side wall: t along the wall (0 near .. 1 far), v up the wall (0 floor .. 1 ceiling)
    sideQuad(side, t0, t1, v0, v1) {
      const P = (t, v) => { const x = this.sideX(side, t), b = this.sideBot(t), tp = this.sideTop(t); return [f1(x), f1(lerp(b, tp, v))]; };
      return [P(t0, v0), P(t0, v1), P(t1, v1), P(t1, v0)];
    }
  };
  return G;
}
const poly = (pts, attrs) => `<polygon points="${pts.map(p => p.join(',')).join(' ')}" ${attrs}/>`;
const at = (p, body, sx) => `<g transform="translate(${f1(p.x)} ${f1(p.y)}) scale(${f1((sx || 1) * p.s * 100) / 100} ${f1(p.s * 100) / 100})">${body}</g>`;
// draw a frontal shape onto a side wall (local units as on the back wall)
function onSide(G, side, t, body) {
  const x = G.sideX(side, t), b = G.sideBot(t), tp = G.sideTop(t);
  const s = (b - tp) / (G.by1 - G.by0) * G.sb;
  const midBack = (G.by0 + G.by1) / 2;
  const slope = side === 'left' ? (midBack - H / 2) / G.bx0 : (H / 2 - midBack) / (W - G.bx1);
  const a = s * .42;
  return `<g transform="matrix(${f1(a * 1000) / 1000} ${f1(a * slope * 1000) / 1000} 0 ${f1(s * 1000) / 1000} ${f1(x)} ${f1(b)})">${body}</g>`;
}
// claim a stretch of a wall or the floor, so that things do not sit on top of each other
function claim(ctx, where, w, prefs) {
  const used = ctx.used[where];
  for (const u of prefs) { if (u - w / 2 < -.02 || u + w / 2 > 1.02) continue; if (used.every(([a, b]) => u + w / 2 <= a || u - w / 2 >= b)) { used.push([u - w / 2, u + w / 2]); return u; } }
  return null;
}

// ---------------------------------------------------------------- rooms, passages, caves
function ROOM(ctx) {
  const { h, rd, st, mat } = ctx;
  const G = ctx.G = geo(ctx);
  const M = MAT[mat] || MAT.plaster;
  const { add, lin, id } = h;
  const roofless = rd.has('no roof|open to the sky|roofless');
  // ceiling, side walls, back wall, floor
  add(`<rect width="${W}" height="${H}" fill="${M.side}"/>`);
  const ceil = [[0, 0], [W, 0], [G.bx1, G.by0], [G.bx0, G.by0]];
  if (roofless) {
    add(poly(ceil, `fill="${lin('sk', [[0, '#0c1430'], [1, '#2a3660']])}"`));
    h.stars(40, G.by0, .8);
  } else add(poly(ceil, `fill="#000" opacity=".45"`));
  const L = [[0, 0], [G.bx0, G.by0], [G.bx0, G.by1], [0, H]], R = [[W, 0], [G.bx1, G.by0], [G.bx1, G.by1], [W, H]];
  add(poly(L, `fill="${lin('lw', [[0, M.wall[1]], [1, M.wall[0]]], 1, 0)}"`));
  add(poly(R, `fill="${lin('rw', [[0, M.wall[0]], [1, M.wall[1]]], 1, 0)}"`));
  add(poly(L, `fill="#000" opacity=".28"`)); add(poly(R, `fill="#000" opacity=".34"`));
  add(`<rect x="${G.bx0}" y="${G.by0}" width="${G.bx1 - G.bx0}" height="${G.by1 - G.by0}" fill="${lin('bw', [[0, M.wall[0]], [1, M.wall[1]]])}"/>`);
  const F = [[0, H], [G.bx0, G.by1], [G.bx1, G.by1], [W, H]];
  add(poly(F, `fill="${lin('fl', [[0, M.floor[1]], [1, M.floor[0]]], 0, 0)}"`));
  texture(ctx, M);
  if (st === 'cave') caveFrame(ctx, 'after');
  P().FEATURES(ctx, 'pre');
  // light from the side the text names
  if (rd.has('moonlight|moonlit')) add(`<rect width="${W}" height="${H}" fill="#5a7ac8" opacity=".12"/>`);
  // ways out
  for (const e of ctx.exits) drawExit(ctx, e);
  // the things the text names
  P().FEATURES(ctx);
  lighting(ctx);
}

function texture(ctx, M) {
  const { h, mat } = ctx, G = ctx.G, { add, R } = h;
  const bw = G.bx1 - G.bx0, bh = G.by1 - G.by0;
  let s = '';
  const clipB = `${h.id}cb`, clipL = `${h.id}cl`, clipR = `${h.id}cr`, clipF = `${h.id}cf`;
  add(`<defs><clipPath id="${clipB}"><rect x="${G.bx0}" y="${G.by0}" width="${bw}" height="${bh}"/></clipPath><clipPath id="${clipL}"><polygon points="0,0 ${G.bx0},${G.by0} ${G.bx0},${G.by1} 0,${H}"/></clipPath><clipPath id="${clipR}"><polygon points="${W},0 ${G.bx1},${G.by0} ${G.bx1},${G.by1} ${W},${H}"/></clipPath><clipPath id="${clipF}"><polygon points="0,${H} ${G.bx0},${G.by1} ${G.bx1},${G.by1} ${W},${H}"/></clipPath></defs>`);
  const rows = (n, stagger, col, op) => {
    // courses of blocks on the back wall and in perspective on the side walls
    let b = '', l = '', r = '';
    for (let i = 1; i < n; i++) { const v = i / n, y = lerp(G.by1, G.by0, v); b += `M${G.bx0},${f1(y)}H${G.bx1}`; l += `M0,${f1(lerp(H, 0, v))}L${G.bx0},${f1(y)}`; r += `M${W},${f1(lerp(H, 0, v))}L${G.bx1},${f1(y)}`; }
    for (let i = 0; i < n; i++) { const v0 = i / n, v1 = (i + 1) / n, y0 = lerp(G.by1, G.by0, v0), y1 = lerp(G.by1, G.by0, v1); const k = stagger ? (i % 2 ? .5 : 0) : 0; for (let x = G.bx0 + (k * bw / 6); x < G.bx1; x += bw / 6) if (x > G.bx0 + 1) b += `M${f1(x)},${f1(y0)}V${f1(y1)}`; }
    for (const [side, path] of [['left', l], ['right', r]]) for (let i = 0; i < n; i++) for (const t of (i % 2 && stagger ? [.25, .62, .86] : [.12, .45, .74, .93])) { const x = G.sideX(side, t), y0 = lerp(G.sideBot(t), G.sideTop(t), i / n), y1 = lerp(G.sideBot(t), G.sideTop(t), (i + 1) / n); if (side === 'left') l += `M${f1(x)},${f1(y0)}V${f1(y1)}`; else r += `M${f1(x)},${f1(y0)}V${f1(y1)}`; }
    return `<path d="${b}" stroke="${col}" stroke-width=".8" opacity="${op}" fill="none" clip-path="url(#${clipB})"/><path d="${l}" stroke="${col}" stroke-width="1" opacity="${op}" fill="none" clip-path="url(#${clipL})"/><path d="${r}" stroke="${col}" stroke-width="1" opacity="${op}" fill="none" clip-path="url(#${clipR})"/>`;
  };
  if (mat === 'stone' || mat === 'limestone' || mat === 'sandstone') s += rows(mat === 'limestone' ? 7 : 9, true, '#000', mat === 'stone' ? .35 : .22);
  else if (mat === 'brick') s += rows(16, true, '#1a0e08', .4);
  else if (mat === 'tile' || mat === 'glaze') { s += rows(12, false, mat === 'glaze' ? '#6a3a0a' : '#5a5a50', .45); if (mat === 'glaze') for (let i = 0; i < 26; i++) s += `<rect x="${f1(R(G.bx0, G.bx1 - 8))}" y="${f1(R(G.by0, G.by1 - 8))}" width="6" height="4" fill="#ffe0a0" opacity="${f1(R(.08, .25) * 100) / 100}" clip-path="url(#${clipB})"/>`; }
  else if (mat === 'marble') { for (let i = 0; i < 9; i++) { const x = R(G.bx0, G.bx1), y = R(G.by0, G.by1); s += `<path d="M${f1(x)},${f1(y)} q${f1(R(-30, 30))},${f1(R(10, 30))} ${f1(R(-40, 40))},${f1(R(20, 60))}" stroke="#8a8478" stroke-width=".7" fill="none" opacity=".5" clip-path="url(#${clipB})"/>`; } s += rows(5, true, '#7a7468', .25); }
  else if (mat === 'granite') {
    // painted to look like alabaster panelling
    for (let i = 0; i < 4; i++) { const x = G.bx0 + bw * (.04 + i * .245); s += `<rect x="${f1(x)}" y="${f1(G.by0 + bh * .12)}" width="${f1(bw * .2)}" height="${f1(bh * .62)}" fill="#e0c486" opacity=".55" stroke="#8a5a2a" stroke-width="1.5"/><rect x="${f1(x + 4)}" y="${f1(G.by0 + bh * .12 + 4)}" width="${f1(bw * .2 - 8)}" height="${f1(bh * .62 - 8)}" fill="none" stroke="#a07a3a" stroke-width=".8" opacity=".7"/>`; }
    for (const side of ['left', 'right']) for (const t of [.25, .62]) s += poly(G.sideQuad(side, t - .14, t + .14, .2, .82), `fill="#d8ba7a" opacity=".35" stroke="#7a4a2a" stroke-width="1"`);
    for (let i = 0; i < 60; i++) s += `<circle cx="${f1(R(G.bx0, G.bx1))}" cy="${f1(R(G.by0, G.by1))}" r=".7" fill="#4a2a28" opacity=".35"/>`;
  } else if (mat === 'rock') {
    for (let i = 0; i < 46; i++) { const x = R(0, W), y = R(0, H * .8); s += `<path d="M${f1(x)},${f1(y)} l${f1(R(8, 26))},${f1(R(-6, 6))} l${f1(R(-4, 8))},${f1(R(6, 18))} l${f1(R(-20, -6))},${f1(R(-2, 6))}z" fill="${['#000', '#6a5a48', '#3a3026'][i % 3]}" opacity="${f1(R(.12, .3) * 100) / 100}"/>`; }
  } else if (mat === 'grime') {
    for (let i = 0; i < 12; i++) s += `<ellipse cx="${f1(R(0, W))}" cy="${f1(R(20, 200))}" rx="${f1(R(8, 30))}" ry="${f1(R(10, 34))}" fill="#1a160e" opacity="${f1(R(.12, .3) * 100) / 100}"/>`;
  } else if (mat === 'plaster') {
    s += `<rect x="${G.bx0}" y="${f1(G.by1 - (G.by1 - G.by0) * .3)}" width="${bw}" height="3" fill="#000" opacity=".18"/>`;
    s += poly(G.sideQuad('left', 0, 1, .29, .31), 'fill="#000" opacity=".15"') + poly(G.sideQuad('right', 0, 1, .29, .31), 'fill="#000" opacity=".15"');
  }
  // floor
  const M2 = MAT[mat] || M;
  if (M2.kind === 'boards') { let d = ''; for (let i = 0; i <= 14; i++) { const u = i / 14; d += `M${f1(lerp(-60, W + 60, u))},${H}L${f1(lerp(G.bx0, G.bx1, u))},${G.by1}`; } s += `<path d="${d}" stroke="#000" stroke-width="1" opacity=".3" clip-path="url(#${clipF})"/>`; }
  else if (M2.kind === 'flags') { let d = ''; for (let i = 0; i <= 8; i++) { const u = i / 8; d += `M${f1(lerp(-80, W + 80, u))},${H}L${f1(lerp(G.bx0, G.bx1, u))},${G.by1}`; } for (let k = 1; k < 6; k++) { const y = G.by1 + (H - G.by1) * Math.pow(k / 6, 1.6); d += `M0,${f1(y)}H${W}`; } s += `<path d="${d}" stroke="#000" stroke-width="1" opacity=".28" clip-path="url(#${clipF})"/>`; }
  else if (M2.kind === 'sand') { for (let k = 0; k < 9; k++) { const y = R(G.by1 + 4, H - 4); s += `<path d="M${f1(R(0, 120))},${f1(y)} q60,-5 120,0 t120,0" stroke="#fff4d0" stroke-width=".8" fill="none" opacity=".3" clip-path="url(#${clipF})"/>`; } }
  else { for (let i = 0; i < 40; i++) s += `<circle cx="${f1(R(0, W))}" cy="${f1(R(G.by1, H))}" r="${f1(R(.6, 2))}" fill="#000" opacity=".3" clip-path="url(#${clipF})"/>`; }
  add(s);
}

// rough rock edges around a cave picture
function caveFrame(ctx, when) {
  const { h } = ctx, { add, R } = h;
  if (when === 'before') return;
  let d = `M0,0 H${W} V${H} H0 Z M14,${H}`;
  const pts = [];
  for (let i = 0; i <= 16; i++) { const a = Math.PI * (1 - i / 16); pts.push([200 + Math.cos(a) * (184 + R(-14, 6)), 236 - Math.sin(a) * (222 + R(-26, 4))]); }
  d += pts.map(p => ` L${f1(p[0])},${f1(p[1])}`).join('') + ` L386,${H} Z`;
  add(`<path d="${d}" fill="#140f0b" fill-rule="evenodd"/>`);
  for (let i = 0; i < 9; i++) { const x = R(70, 330); add(`<path d="M${f1(x - 7)},${f1(R(8, 22))} l7,${f1(R(14, 30))} l7,-${f1(R(14, 30))}z" fill="#140f0b"/>`); }
}

function lighting(ctx) {
  const { h, rd } = ctx, { add } = h;
  const dark = rd.has('dark|dim|dimly|gloomy|murky|shadowy|dismal|cannot see|can hardly see|stooped|nightmarish');
  if (dark) add(`<rect width="${W}" height="${H}" fill="#000" opacity="${rd.has('can hardly see|pitch|murky depths') ? .45 : .3}"/>`);
  if (rd.has('light streams in|light filters in|filters in|comes in from|skylight|square hole in the roof')) { /* drawn with the opening */ }
  h.glow(200, 150, 190, '#ffe2b0', dark ? .14 : .08);
}

// ---------------------------------------------------------------- ways out
function drawExit(ctx, e) {
  const { h, rd } = ctx, G = ctx.G, { add } = h;
  const rel = ctx.rel(e.dir);
  const shut = rd.has('closed|shut|locked|sealed') && /door/.test(e.type);
  const cave = ctx.st === 'cave' || ctx.mat === 'rock';
  const opening = (wid, hei, kind) => {
    // local shape of an opening, origin bottom centre
    if (kind === 'crawl') return cave ? `<path d="M${-wid * .5},0 Q${-wid * .55},${-hei * .5} ${-wid * .1},${-hei * .55} Q${wid * .4},${-hei * .6} ${wid * .5},0Z" fill="#050403"/>` : `<path d="M${-wid * .45},0 V${-hei * .3} A${wid * .45},${hei * .3} 0 0 1 ${wid * .45},${-hei * .3} V0Z" fill="#050403"/>`;
    if (cave) return `<path d="M${-wid / 2},0 Q${-wid * .6},${-hei * .7} ${-wid * .15},${-hei} Q${wid * .2},${-hei * 1.05} ${wid * .5},${-hei * .55} L${wid / 2},0Z" fill="#050403"/>`;
    if (kind === 'arch') return `<path d="M${-wid / 2},0 V${-hei + wid / 2} A${wid / 2},${wid / 2} 0 0 1 ${wid / 2},${-hei + wid / 2} V0Z" fill="#060504"/><path d="M${-wid / 2 - 4},0 V${-hei + wid / 2} A${wid / 2 + 4},${wid / 2 + 4} 0 0 1 ${wid / 2 + 4},${-hei + wid / 2} V0" fill="none" stroke="#000" stroke-width="5" opacity=".4"/>`;
    // a lintelled doorway, perhaps with its door
    let s = `<rect x="${-wid / 2}" y="${-hei}" width="${wid}" height="${hei}" fill="#060504"/><rect x="${-wid / 2 - 6}" y="${-hei - 8}" width="${wid + 12}" height="9" fill="#000" opacity=".35"/>`;
    if (kind === 'door') s += shut ? `<rect x="${-wid / 2 + 2}" y="${-hei + 2}" width="${wid - 4}" height="${hei - 2}" fill="#5a3a20" stroke="#2a180c" stroke-width="2"/><path d="M${-wid / 6},${-hei + 6}V-4M${wid / 6},${-hei + 6}V-4" stroke="#2a180c" stroke-width="1.5"/><circle cx="${wid / 2 - 9}" cy="${-hei / 2}" r="3" fill="#c8a060"/>` : `<path d="M${-wid / 2},0 V${-hei} L${-wid / 2 - wid * .35},${-hei - 8} V8Z" fill="#5a3a20" stroke="#2a180c" stroke-width="2"/>`;
    return s;
  };
  const stairsIn = (wid, hei, up) => {
    let s = `<path d="M${-wid / 2},0 V${-hei + wid / 2} A${wid / 2},${wid / 2} 0 0 1 ${wid / 2},${-hei + wid / 2} V0Z" fill="#070605"/>`;
    for (let i = 0; i < 6; i++) { const y = up ? -i * hei * .09 : 0, ww = wid * (1 - i * .1); s += up ? `<rect x="${-ww / 2}" y="${f1(y - hei * .09)}" width="${f1(ww)}" height="${f1(hei * .09)}" fill="${i % 2 ? '#5a4e40' : '#4a4034'}" opacity="${1 - i * .12}"/>` : ''; }
    return s;
  };
  const type = e.type;
  const kind = type === 'door' ? 'door' : type === 'doorway' ? (ctx.cat === 'classical' || ctx.cat === 'egypt' ? 'lintel' : 'lintel') : type === 'crawl' ? 'crawl' : 'arch';
  const isStairs = type === 'stairs';
  if (e.dir === null) {
    // up or down without a compass direction
    if (isStairs || type === 'ladder' || type === 'doorway' || type === 'passage') {
      const side = ctx.used.left.length <= ctx.used.right.length ? 'left' : 'right';
      if (e.vert === 'down') return stairsDown(ctx, .3);
      if (type === 'ladder') return void add(ladder(G.floor(side === 'left' ? .15 : .85, .55)));
      return sideStairs(ctx, side);
    }
    return;
  }
  if (rel === 0 || rel === 1 || rel === 7) {
    const u = claim(ctx, 'back', .3, rel === 0 ? [.5, .4, .6] : rel === 7 ? [.17, .25, .3] : [.83, .75, .7]);
    if (u === null) return;
    if (kind !== 'crawl') ctx.used.high.push([u - .15, u + .15]);
    (ctx.backExits = ctx.backExits || []).push(u);
    const p = G.back(u);
    if (cave && /path|way|doorway/.test(type) && rd.has('outside is|starry|night|moonlit|daylight')) { add(at(p, opening(90, 150, kind))); add(at(p, `<path d="M-38,-4 Q-44,-100 -10,-136 Q22,-142 40,-80 L40,-4Z" fill="#101a3a"/>${[[-20, -110], [6, -96], [20, -120], [-6, -70], [24, -60]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6" fill="#fff"/>`).join('')}<path d="M-38,-4 Q0,-30 40,-14 L40,-4Z" fill="#1a2418"/>`)); return; }
    if (isStairs && e.vert === 'down') return void stairsDown(ctx, u);
    const big = G.size === 'deep' ? 1.6 : 1;
    add(at(p, isStairs ? stairsIn(86 * big, 170 * big, true) : opening((kind === 'crawl' ? 70 : 76) * big, (kind === 'crawl' ? 90 : 160) * big, kind)));
  } else if (rel === 2 || rel === 6) {
    const side = rel === 6 ? 'left' : 'right';
    const t = claim(ctx, side, .34, [.5, .3, .7]);
    if (t === null) return;
    if (isStairs && e.vert === 'up') return sideStairs(ctx, side, t);
    if (isStairs && e.vert === 'down') return stairsDown(ctx, side === 'left' ? .2 : .8);
    const vh = kind === 'crawl' ? .3 : .68;
    if (cave && /path|way|doorway/.test(type) && rd.has('outside is|starry|night|moonlit')) {
      const q = G.sideQuad(side, Math.max(.05, t - .25), Math.min(.95, t + .25), 0, .82);
      add(`<path d="M${q[0][0]},${q[0][1]} L${q[1][0]},${q[1][1] + 14} Q${(q[1][0] + q[2][0]) / 2},${Math.min(q[1][1], q[2][1]) - 14} ${q[2][0]},${q[2][1] + 14} L${q[3][0]},${q[3][1]}Z" fill="#101a3a"/>`);
      for (let i = 0; i < 6; i++) add(`<circle cx="${f1(lerp(q[0][0], q[3][0], .2 + i * .12))}" cy="${f1(lerp(q[1][1], q[0][1], .25 + (i % 3) * .2))}" r="1.4" fill="#fff"/>`);
      return;
    }
    const q = G.sideQuad(side, t - .13, t + .13, 0, vh);
    if (cave || kind === 'arch' || kind === 'crawl') {
      const [a, b, c, d] = q; const top = [(b[0] + c[0]) / 2, Math.min(b[1], c[1]) - 10];
      add(`<path d="M${a[0]},${a[1]} L${b[0]},${b[1] + (kind === 'crawl' ? 0 : 12)} Q${top[0]},${top[1]} ${c[0]},${c[1] + (kind === 'crawl' ? 0 : 12)} L${d[0]},${d[1]}Z" fill="#060504"/>`);
    } else {
      add(poly(q, 'fill="#060504"'));
      if (kind === 'door') { if (shut) add(poly(q, 'fill="#5a3a20" stroke="#2a180c" stroke-width="2"')); else { const [a, b] = rel === 6 ? [q[3], q[2]] : [q[0], q[1]]; const k = rel === 6 ? 1 : -1; add(poly([a, b, [b[0] + k * 26, b[1] - 6], [a[0] + k * 26, a[1] + 10]], 'fill="#5a3a20" stroke="#2a180c" stroke-width="1.5"')); } }
    }
  } else {
    // behind the viewer: only stairs are worth showing, going down at the front edge
    if (isStairs) { const u = rel === 5 ? .15 : rel === 3 ? .85 : .5; if (e.vert === 'down') stairsDown(ctx, u, true); else frontStairs(ctx, u); }
    else frontGap(ctx, rel === 5 ? .12 : rel === 3 ? .88 : .5, type);
  }
}
// a way out behind the viewer: a strip of the floor in front falls into shadow there
function frontGap(ctx, u, type) {
  const { h } = ctx; const x = u * W;
  h.add(`<path d="M${f1(x - 60)},${H} Q${f1(x)},${H - 26} ${f1(x + 60)},${H}Z" fill="#000" opacity=".45"/>`);
}
function frontStairs(ctx, u) {
  const { h } = ctx; const x = u * W; let s = '';
  for (let i = 0; i < 4; i++) s += `<rect x="${f1(x - 70 + i * 6)}" y="${H - 14 - i * 12}" width="${140 - i * 12}" height="${14 + i * 12}" fill="${i % 2 ? '#4a4034' : '#3a3228'}" opacity=".9"/>`;
  h.add(s);
}
function stairsDown(ctx, u, front) {
  const { h } = ctx, G = ctx.G;
  const p = G.floor(u, front ? .05 : .55), w = 120 * p.s, d = 50 * p.s;
  let s = `<polygon points="${f1(p.x - w / 2)},${f1(p.y)} ${f1(p.x + w / 2)},${f1(p.y)} ${f1(p.x + w * .4)},${f1(p.y - d)} ${f1(p.x - w * .4)},${f1(p.y - d)}" fill="#050403"/>`;
  for (let i = 1; i < 5; i++) { const y = p.y - d + i * d / 5; s += `<line x1="${f1(p.x - w * .38 + i * 2)}" y1="${f1(y)}" x2="${f1(p.x + w * .38 - i * 2)}" y2="${f1(y)}" stroke="#3a3228" stroke-width="${f1(2 + i)}" opacity="${f1(1 - i * .18)}"/>`; }
  h.add(s);
}
function sideStairs(ctx, side, t = .5) {
  const { h } = ctx, G = ctx.G; let s = '';
  const n = 8;
  for (let i = 0; i < n; i++) {
    const t0 = .08 + i * .1, v0 = i * .085;
    const q = G.sideQuad(side, t0, t0 + .1, v0, v0 + .085);
    const x0 = q[0][0], x1 = q[3][0];
    const inward = side === 'left' ? 1 : -1;
    s += poly([[q[0][0], q[0][1]], [q[1][0], q[1][1]], [q[2][0], q[2][1]], [q[3][0], q[3][1]]], `fill="${i % 2 ? '#5a4c3c' : '#4a3e30'}"`);
    s += poly([[q[1][0], q[1][1]], [q[2][0], q[2][1]], [q[2][0] + inward * 42 * (1 - t0 * .6), q[2][1] + 4], [q[1][0] + inward * 46 * (1 - t0 * .6), q[1][1] + 4]], `fill="#6a5a48"`);
  }
  h.add(`<g opacity=".95">${s}</g>`);
}
const ladder = p => at(p, `<line x1="-16" y1="0" x2="-10" y2="-190" stroke="#7a5a34" stroke-width="5"/><line x1="16" y1="0" x2="10" y2="-190" stroke="#7a5a34" stroke-width="5"/>${Array.from({ length: 8 }, (_, i) => `<line x1="${-15 + i * .7}" y1="${-18 - i * 22}" x2="${15 - i * .7}" y2="${-18 - i * 22}" stroke="#6a4a28" stroke-width="4"/>`).join('')}`);

const api = { compose, MAT, geo, at, poly, onSide, claim, lerp, f1, W, H, drawExit, lighting, texture, ladder, ROOM };
root.ZGeneric = api;
if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : this);
