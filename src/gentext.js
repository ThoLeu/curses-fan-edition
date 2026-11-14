// Reading a room description: what kind of place, which ways out, what is in it.
// Everything the generic illustrations draw comes from here, so nothing is drawn that the text does not say.
(function (root) {
'use strict';

const COMPASS = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'];
const DIR_RE = /\b(north|south|east|west|northeast|northwest|southeast|southwest|north-east|north-west|south-east|south-west)(wards?)?\b/g;

// the description proper: no heading, no next room, no speech, no score notices
function clean(desc) {
  const lines = String(desc || '').split('\n');
  if (lines.length > 1) lines.shift();
  const out = [];
  for (const l of lines) {
    const t = l.trim();
    if (/^>/.test(t)) break;
    if (out.length && t && t.length < 60 && /^[A-Z]/.test(t) && !/[.!?:"'\]]$/.test(t)) break; // the heading of the next room
    out.push(t);
  }
  return out.join(' ').replace(/\[[^\]]*\]/g, ' ').replace(/"[^"]{25,}"/g, ' ').replace(/\s+/g, ' ').trim();
}

// is the word at position i negated ("no bones or urns")?
const NEG = /\b(no|not|nor|without|never|none(?!-)|cannot)\b|n't\b/g;
const RESET = /\b(and|but|only|yet|though|although|while|which|so|since|where|except)\b/;
function negated(t, i) {
  let s = Math.max(t.lastIndexOf('.', i - 1), t.lastIndexOf(',', i - 1), t.lastIndexOf(';', i - 1), t.lastIndexOf(':', i - 1), t.lastIndexOf('!', i - 1), t.lastIndexOf('?', i - 1));
  const seg = t.slice(s + 1, i);
  let m, last = -1; NEG.lastIndex = 0;
  while ((m = NEG.exec(seg))) last = m.index + m[0].length;
  if (last < 0) return false;
  return !RESET.test(seg.slice(last));
}

function reader(desc) {
  const text = clean(desc), t = text.toLowerCase().replace(/\bnot far\b/g, 'quite near').replace(/\bof the earth\b/g, 'of the world');
  const cache = {};
  // first non-negated match of a pattern (word-bounded), or null
  const find = src => {
    if (src in cache) return cache[src];
    const re = new RegExp('\\b(?:' + src + ')\\b', 'g'); let m;
    while ((m = re.exec(t))) if (!negated(t, m.index)) return cache[src] = { w: m[0], i: m.index };
    return cache[src] = null;
  };
  const has = src => !!find(src);
  const all = src => { const re = new RegExp('\\b(?:' + src + ')\\b', 'g'); const r = []; let m; while ((m = re.exec(t))) if (!negated(t, m.index)) r.push({ w: m[0], i: m.index }); return r; };
  // the sentence around a position
  const sentence = i => { let a = i; while (a > 0 && !/[.!?]/.test(t[a - 1])) a--; let b = i; while (b < t.length && !/[.!?]/.test(t[b])) b++; return t.slice(a, b); };
  return { text, t, find, has, all, sentence };
}

const EXIT_KW = [
  ['stairs', 'stairs?|staircase|stairway|steps|flight'],
  ['ladder', 'ladder'],
  ['door', 'doors?'],
  ['doorway', 'doorways?|entrance|portico|opening|exit|gate|archway'],
  ['crawl', 'crawl|squeeze|crack|cleft|crevice|gap|hole'],
  ['passage', 'passages?|corridors?|tunnel|channel|cloisters?|arms|labyrinth|shaft|colonnades'],
  ['path', 'path|paths|walk|footpath|road|roads|street|track|lane|thoroughfare|slope|hillside|causeway|fields']
];
const MOTION = /\b(entrance|portico|steps|stairs?|staircase|ladder|crawl|scramble|crack|cleft|leads?|leading|lead|runs?|running|goes|go|continues?|extends?|extending|opens?|gives? onto|turns?|turning|fork|climbs?|climbing|rises?|descend|descending|slop(es|ing)|traversed|cut across|crawl|squeeze|slip|file|lies|lie|back|way|ways|route|routes|access|arms run|out|exit|doorways?|doorway|door|passage|corridor|road|to the|from)\b/;

// the ways out of a room: [{dir: 0..7 or null, vert: 'up'|'down'|null, type}]
function exits(rd) {
  const { t } = rd, out = [];
  const sents = t.split(/(?<=[.!?])\s+/);
  for (const s of sents) {
    if (!MOTION.test(s) && !/\b(north|south|east|west)\w* of (the|a)\b/.test(s)) continue;
    const clauses = s.split(/[,;:]|\bwhile\b|\bthough\b|\band\b|\bor\b/);
    let carry = null, vertOnly = -1, pos = t.indexOf(s);
    for (const c of clauses) {
      const base = t.indexOf(c, pos); pos = base + c.length;
      let type = null;
      for (const [k, src] of EXIT_KW) if (new RegExp('\\b(?:' + src + ')\\b').test(c)) { type = k; break; }
      if (type) carry = type; else type = carry;
      let m, any = false; DIR_RE.lastIndex = 0;
      while ((m = DIR_RE.exec(c))) {
        if (negated(t, base + m.index)) continue;
        const after = c.slice(m.index + m[0].length);
        if (/^\s+(wall|end|edge|side|corner|cloister|wing|bank)\b/.test(after)) continue;   // a wall, not a way
        let d = COMPASS.indexOf(m[1].replace('-', ''));
        const of = /^\s+of\s+(the\s+)?(\w+)/.exec(after);
        if (of) { const d2 = COMPASS.indexOf(of[2]); if (d2 >= 0) { d = d2; DIR_RE.lastIndex += of[0].length; } else d = (d + 4) % 8; }   // "east of north"; "just south of the foyer"
        const vt = type === 'stairs' || type === 'ladder' || /stair|step|flight|ladder|shaft/.test(c);
        let vert = vt && /\b(up|climbs?|rises?|ascend)\b/.test(c) ? 'up' : vt && /\b(down|descend\w*)\b/.test(c) ? 'down' : null;
        if (!vert && vertOnly >= 0 && /stair|step|flight/.test(out[vertOnly].type) && (type === out[vertOnly].type)) { vert = out[vertOnly].vert; out.splice(vertOnly, 1); vertOnly = -1; }
        out.push({ dir: d, vert, type: type || 'way', clause: c.trim() });
        any = true;
      }
      if (!any && /\b(up|down)\b/.test(c) && /(stair|step|flight|ladder|climb|scramble|leading back|lead back|back up)/.test(c)) {
        const i = c.search(/\b(up|down)\b/);
        if (!negated(t, base + i)) { out.push({ dir: null, vert: /\bup\b/.test(c) ? 'up' : 'down', type: type && type !== 'way' ? type : /stair|step|flight/.test(c) ? 'stairs' : /ladder/.test(c) ? 'ladder' : 'path', clause: c.trim() }); vertOnly = out.length - 1; }
      }
    }
  }
  // the same direction twice: keep the most specific
  const rank = { stairs: 6, ladder: 5, door: 4, doorway: 3, crawl: 3, passage: 2, path: 1, way: 0 };
  const by = {};
  for (const e of out) { const k = e.dir === null ? e.vert : e.dir; if (!by[k] || rank[e.type] > rank[by[k].type]) by[k] = e; }
  return Object.values(by);
}

// "giant bronze mural": walls the text talks about
function walls(rd) {
  const out = []; const re = /\b(north|south|east|west|northeast|northwest|southeast|southwest)\s+(wall|end|edge|side|corner)\b/g; let m;
  while ((m = re.exec(rd.t))) out.push({ dir: COMPASS.indexOf(m[1]), i: m.index, clause: rd.sentence(m.index) });
  return out;
}

// what kind of picture: a room, a passage, a cave, a tent, the deck of a boat, or the open air
function stage(name, rd, cat) {
  const n = (name || '').toLowerCase(), { t, has } = rd;
  if (/^(prow|stern|on board|harbour mouth|drifting)/.test(n)) return 'deck';
  if (/\btent\b/.test(n) && !/encampment/.test(n)) return 'tent';
  if (/^(outside|near|beside|down by|out on|cliffs?|clifftop|wall of|sacred earth|crossroads|causeway|jetty|stadium|entrance|encampment|camp fire|beneath dolmen|valley|spur|hanging|stream|roman villa|public footpath|hollow|warehouses|premonition)/.test(n)) return 'land';
  if (/\b(cave|cavern)\b/.test(n + ' ' + t.slice(0, 80)) && !/villa/.test(t)) return 'cave';
  if ((/(passage|shaft|death|dream|well)\b/.test(n) || has('shaft')) && !has('colonnade|colonnaded|columns')) return 'passage';
  if (/shrine of the bear/.test(n)) return 'tent';
  let ind = 0, out = 0;
  for (const w of t.match(/\b(room|hall|hallway|flat|hovel|office|cell|annexe|basement|chamber|corridor|cloisters?|sanctum|tomb|crypt|pit|kitchen|quarters|library|alcove|bay|apartment|ceiling|walls?|floor|doorways?|windows?|skylight|inside|shelves|cabinets?)\b/g) || []) ind++;
  for (const w of t.match(/\b(sky|night|moon|moonlit|stars|starry|sea|waves|road|street|path|walk|footpath|fields?|hill|hillside|valley|landscape|outside|forecourt|cliffs?|village|crowd|grass|grassland|pastures?|trees?|drive|gardens?|turf|windy|view|shore|bank|jetty|harbour|waters|overlooking|crags)\b/g) || []) out++;
  if (out > ind + 1) return 'land';
  return 'room';
}

// what the walls are made of
function material(rd, cat, st) {
  const { has } = rd;
  if (has('glaze')) return 'glaze';
  if (has('rose-coloured granite|granite')) return 'granite';
  if (has('marble') && has('cut from marble|marble wall|passage')) return 'marble';
  if (has('flagstones')) return 'stone';
  if (has('hieroglyphics')) return 'sandstone';
  if (has('jagged|rock|cave|cavern|through the earth|crags|pit')) return 'rock';
  if (has('station|metro')) return 'tile';
  if (has('caked with paint|squalor|filthy|peeling')) return 'grime';
  if (has('brick|bricks')) return 'brick';
  if (st === 'tent') return 'hide';
  if (cat === 'classical') return 'limestone';
  if (cat === 'egypt') return 'sandstone';
  if (cat === 'church') return 'stone';
  if (cat === 'cellar' || cat === 'cave') return 'stone';
  if (st === 'passage') return 'stone';
  return 'plaster';
}

const api = { clean, reader, exits, walls, stage, material, negated, COMPASS };
if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.ZGenText = api;
})(typeof window !== 'undefined' ? window : this);
