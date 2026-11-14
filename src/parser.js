// A friendlier front end for the game's parser: German commands, synonyms and typo repair.
// Nothing here changes the game; it only rewrites what the player typed before the game sees it.
(function (root) {
'use strict';

const fold = s => s.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss');

// ---------- German -> English ----------
const DE_DIR = { norden: 'n', n: 'n', sueden: 's', s: 's', osten: 'e', o: 'e', westen: 'w', w: 'w', nordosten: 'ne', no: 'ne', nordwesten: 'nw', nw: 'nw', suedosten: 'se', so: 'se', suedwesten: 'sw', sw: 'sw', hoch: 'u', rauf: 'u', hinauf: 'u', oben: 'u', nachoben: 'u', runter: 'd', hinunter: 'd', herunter: 'd', unten: 'd', nachunten: 'd', rein: 'in', hinein: 'in', herein: 'in', raus: 'out', hinaus: 'out', heraus: 'out' };
// verb -> english, optionally depending on a separable particle at the end of the sentence
const DE_VERB = {
  nimm: 'take', nehme: 'take', nehmen: 'take', hol: 'take', hole: 'take', holen: 'take', schnapp: 'take', pack: 'take',
  leg: { ab: 'drop', hin: 'drop', weg: 'drop', _: 'put' }, lege: { ab: 'drop', hin: 'drop', _: 'put' }, ablegen: 'drop', wirf: { weg: 'drop', _: 'throw' }, lass: { fallen: 'drop', _: 'drop' },
  untersuche: 'examine', untersuch: 'examine', untersuchen: 'examine', betrachte: 'examine', betracht: 'examine', pruefe: 'examine', inspiziere: 'examine', x: 'examine', u: 'examine',
  schau: { an: 'examine', nach: 'search', unter: 'look under', _: 'look' }, schaue: { an: 'examine', _: 'look' }, sieh: { an: 'examine', nach: 'search', _: 'look' }, guck: { an: 'examine', _: 'look' }, umsehen: 'look', umschauen: 'look', l: 'look',
  oeffne: 'open', oeffnen: 'open', mach: { auf: 'open', zu: 'close', an: 'switch on', aus: 'switch off', sauber: 'clean' }, mache: { auf: 'open', zu: 'close', an: 'switch on', aus: 'switch off' },
  schliess: { auf: 'unlock', ab: 'lock', _: 'close' }, schliesse: { auf: 'unlock', ab: 'lock', _: 'close' }, schliessen: 'close', sperr: { auf: 'unlock', ab: 'lock', _: 'lock' }, sperre: { auf: 'unlock', ab: 'lock', _: 'lock' },
  lies: 'read', lese: 'read', lesen: 'read', drueck: 'push', druecke: 'push', schieb: 'push', schiebe: 'push', zieh: { an: 'wear', aus: 'remove', _: 'pull' }, ziehe: { an: 'wear', aus: 'remove', _: 'pull' },
  dreh: 'turn', drehe: 'turn', gib: 'give', gebe: 'give', zeig: { auf: 'point', _: 'show' }, zeige: { auf: 'point', _: 'show' }, richte: 'point', ziele: 'point',
  frag: 'ask', frage: 'ask', sag: 'say', sage: 'say', iss: 'eat', esse: 'eat', trink: 'drink', trinke: 'drink', trag: 'wear', trage: 'wear', setz: { auf: 'wear', _: 'put' },
  betritt: 'enter', betrete: 'enter', steig: { ein: 'enter', aus: 'get out', auf: 'climb', ab: 'get off', _: 'climb' }, steige: { ein: 'enter', aus: 'get out', auf: 'climb', _: 'climb' }, kletter: 'climb', klettere: 'climb',
  warte: 'wait', warten: 'wait', schlaf: 'sleep', schlafe: 'sleep', wach: { auf: 'wake up', _: 'wake' }, kuess: 'kiss', kuesse: 'kiss', spring: 'jump', springe: 'jump', hoer: { zu: 'listen', _: 'listen' }, hoere: 'listen', lausche: 'listen', riech: 'smell', rieche: 'smell',
  durchsuche: 'search', durchsuch: 'search', such: 'search', suche: 'search', zuend: { an: 'light' }, zuende: { an: 'light' }, entzuende: 'light',
  blas: 'blow', blase: 'blow', puste: 'blow', spiel: 'play', spiele: 'play', grab: 'dig', grabe: 'dig', fuell: 'fill', fuelle: 'fill', schlag: 'hit', schlage: 'hit', zerbrich: 'break', brich: 'break', zerschlag: 'break', zerschlage: 'break',
  wink: 'wave', winke: 'wave', schwenk: 'wave', schwenke: 'wave', schwing: 'swing', schwinge: 'swing', steck: 'put', stecke: 'put', reinig: 'clean', reinige: 'clean', putz: 'clean', putze: 'clean', repariere: 'fix', reparier: 'fix',
  rieb: 'strike', reib: 'strike', reibe: 'strike', kneif: 'pinch', kneife: 'pinch', zwick: 'pinch', zwicke: 'pinch', klopf: 'knock', klopfe: 'knock', beruehr: 'touch', beruehre: 'touch', fass: { an: 'touch' }, rede: 'talk', sprich: 'talk',
  geh: null, gehe: null, lauf: null, laufe: null, renn: null, gehen: null,
  inventar: 'inventory', inv: 'inventory', i: 'inventory', rueckgaengig: 'undo', zurueck: 'undo', nochmal: 'again', wiederholen: 'again', speichern: 'save', speichere: 'save', laden: 'restore', lade: 'restore', hilfe: 'help', punkte: 'score', ende: 'quit', beenden: 'quit', neustart: 'restart'
};
const DE_PREP = { mit: 'with', in: 'in', ins: 'in', im: 'in', auf: 'on', unter: 'under', hinter: 'behind', nach: 'about', ueber: 'about', zu: 'to', zum: 'to', zur: 'to', von: 'from', aus: 'from', an: 'at', am: 'at', durch: 'through', gegen: 'against' };
const DE_DROP = new Set('der die das den dem des ein eine einen einem einer eines bitte mal doch dann jetzt nun noch alle'.split(' '));
const DE_PRON = { es: 'it', ihn: 'it', ihm: 'it', sie: 'it', ihr: 'it', mich: 'me', mir: 'me', dich: 'me', selbst: 'me' , alles: 'all' };
// common nouns of the house and its surroundings (own word list)
const DE_NOUN = {
  buch: 'book', buecher: 'books', woerterbuch: 'dictionary', lexikon: 'dictionary', roman: 'novel', gedichtband: 'poetry', gedichte: 'poetry', schluessel: 'key', taschenlampe: 'torch', lampe: 'torch', batterie: 'battery', batterien: 'batteries',
  karte: 'map', stadtplan: 'map', tuer: 'door', falltuer: 'trapdoor', luke: 'hatch', kiste: 'chest', kisten: 'teachests', teekisten: 'teachests', schrank: 'cupboard', rad: 'wheel', seil: 'rope', seile: 'ropes', aufzug: 'dumbwaiter', speiseaufzug: 'dumbwaiter',
  schraubenschluessel: 'wrench', handschuhe: 'gloves', schal: 'scarf', maske: 'mask', gasmaske: 'mask', bild: 'painting', gemaelde: 'painting', foto: 'photograph', kugel: 'ball', glaskugel: 'ball', katze: 'cat', kater: 'cat', maus: 'mouse', robotermaus: 'mouse',
  stab: 'rod', muenze: 'coin', stein: 'stone', blume: 'flower', gaensebluemchen: 'daisy', kalender: 'calendar', bett: 'bed', fenster: 'window', ballon: 'demijohn', glasballon: 'demijohn', keks: 'biscuit', schokoladenkeks: 'biscuit', zettel: 'paper', papier: 'paper',
  rucksack: 'rucksack', tasche: 'rucksack', tarotkarten: 'tarot', karten: 'cards', flasche: 'bottle', schachtel: 'box', kaestchen: 'box', schmuckkaestchen: 'box', uhr: 'watch', fahne: 'flag', flagge: 'flag', zweig: 'branch', ast: 'branch', spaten: 'spade',
  statue: 'statue', projektor: 'projector', schiff: 'ship', boot: 'boat', hut: 'hat', mantel: 'cloak', umhang: 'cloak', sandalen: 'sandals', pfeife: 'whistle', vogelpfeife: 'whistle', horn: 'horn', stock: 'stick', hammer: 'mallet', schlaeger: 'mallet',
  kerze: 'candle', streichholz: 'match', streichhoelzer: 'matches', spiegel: 'mirror', treppe: 'stairs', leiter: 'ladder', wand: 'wall', boden: 'floor', decke: 'ceiling', dach: 'roof', kamin: 'fireplace', schornstein: 'chimney', brunnen: 'well', loch: 'hole',
  tisch: 'table', stuhl: 'chair', kissen: 'cushion', schalter: 'switch', knopf: 'button', klingel: 'bell', glocke: 'bell', kabel: 'wire', draht: 'wire', rose: 'rose', nuesse: 'nuts', feige: 'fig', nachtisch: 'dessert', sarg: 'coffin', kranz: 'chain', kette: 'chain', tante: 'jemima', etikett: 'label', schild: 'sign', inschrift: 'inscription', gitter: 'grating', mosaik: 'mosaic', wandbild: 'mural', fries: 'frieze', wagen: 'roller', walze: 'roller', gartenwalze: 'roller', baum: 'tree', hecke: 'hedge', kreuz: 'cross', altar: 'altar', urne: 'urn', priesterin: 'priestess', dämon: 'demon', daemon: 'demon', engel: 'angel', geist: 'ghost', skelett: 'skeleton', schaedel: 'skull', herz: 'heart', hand: 'hand', ring: 'ring'
};

function looksGerman(f) {
  const t = f.split(/\s+/);
  if (/[äöüß]/.test(f)) return true;
  const v = t[0];
  if (v in DE_VERB && !(v in EN_COMMON)) return true;
  return t.some(w => DE_DROP.has(w) && !/^(die|the)$/.test(w) || (w in DE_PREP && !(w in EN_COMMON)) || w in DE_NOUN && !(w in EN_COMMON));
}
const EN_COMMON = { x: 1, i: 1, l: 1, u: 1, n: 1, s: 1, w: 1, o: 1, no: 1, so: 1, in: 1, an: 1, am: 1, rose: 1, statue: 1, rucksack: 1, horn: 1, hammer: 1, boot: 1, hut: 1, grab: 1, spiel: 0, inventar: 0, ende: 0, rad: 0, im: 0, zu: 0, nach: 0, um: 0 };

function translateDe(input) {
  let f = fold(input).replace(/[!?]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (!f) return null;
  // whole-command shortcuts
  const whole = { 'schau dich um': 'look', 'sieh dich um': 'look', 'umsehen': 'look', 'was habe ich': 'inventory', 'was trage ich': 'inventory', 'warte': 'wait', 'z': 'wait', 'nochmal': 'again', 'zurueck': 'undo', 'steh auf': 'get up', 'aufstehen': 'get up', 'wach auf': 'wake up', 'schlafen': 'sleep' };
  if (whole[f]) return whole[f];
  let t = f.split(' ');
  // "geh nach norden", "geh rein", "nach oben"
  const dirWord = w => DE_DIR[w] || null;
  if (['geh', 'gehe', 'lauf', 'laufe', 'renn', 'gehen'].includes(t[0])) {
    const rest = t.slice(1).filter(w => !['nach', 'in', 'richtung', 'zum', 'zur', 'die', 'den', 'das'].includes(w));
    const joined = rest.join('');
    if (dirWord(joined)) return dirWord(joined);
    if (rest.length) return 'enter ' + rest.map(w => DE_NOUN[w] || w).join(' ');
    return null;
  }
  if (t.length <= 2 && dirWord(t.join(''))) return dirWord(t.join(''));
  if (t[0] === 'nach' && dirWord(t.slice(1).join(''))) return dirWord(t.slice(1).join(''));
  // verb with separable particle
  let verb = DE_VERB[t[0]];
  if (verb === undefined) return null;
  if (verb === null) return null;
  t = t.slice(1);
  if (typeof verb === 'object') {
    const last = t[t.length - 1];
    if (last && verb[last]) { verb = verb[last]; t = t.slice(0, -1); }
    else if (t[0] && verb[t[0]] && t.length === 1) { verb = verb[t[0]]; t = []; }
    else verb = verb._ || Object.values(verb)[0];
  }
  // "steig in den aufzug" -> enter ; "zieh am seil" -> pull rope
  if (/^(climb|put)$/.test(verb) && /^(in|ins)$/.test(t[0]) && verb === 'climb') { verb = 'enter'; t = t.slice(1); }
  if (/^(pull|push|turn|knock|touch)$/.test(verb)) t = t.filter(w => !['an', 'am', 'auf'].includes(w));
  const out = [];
  for (const w of t) {
    if (DE_DROP.has(w)) continue;
    if (w in DE_PRON) { out.push(DE_PRON[w]); continue; }
    if (w in DE_PREP) { out.push(verb === 'point' && (w === 'auf' || w === 'an') ? 'at' : DE_PREP[w]); continue; }
    if (w in DE_NOUN) { out.push(DE_NOUN[w]); continue; }
    out.push(w);
  }
  // "point X" with "auf" particle consumed as verb particle -> "point X at" needs target; leave as is
  let cmd = (verb + ' ' + out.join(' ')).trim();
  cmd = cmd.replace(/^put (\S+(?: \S+)?) on me$/, 'wear $1');
  return cmd;
}

// ---------- English synonyms the original parser does not know ----------
const EN_SYN = [
  [/^(get|take|remove|grab|fetch|pull|pick)\s+(.+?)\s+(out of|out from|from out of|from inside|from within|out)\s+(the\s+)?(.+)$/, 'take $2 from $5'],
  [/^(grab|snatch|collect|acquire|pick)\s+(up\s+)?(.+)$/, 'take $3'],
  [/^pick\s+(.+?)\s+up$/, 'take $1'],
  [/^(put|set|lay)\s+down\s+(.+)$/, 'drop $2'],
  [/^(inspect|check|study|observe|view|describe|read about)\s+(.+)$/, 'examine $2'],
  [/^(look|l)\s+(.+)$/, 'examine $2'],
  [/^(walk|go|run|head|move|travel)\s+(to the\s+|towards\s+|to\s+)?(north|south|east|west|northeast|northwest|southeast|southwest|up|down|n|s|e|w|ne|nw|se|sw|u|d)$/, '$3'],
  [/^(go|walk|step|climb|get)\s+(in|into|inside)\s+(.+)$/, 'enter $3'],
  [/^(leave|exit|get out of)\s+.+$/, 'out'],
  [/^(shut)\s+(.+)$/, 'close $2'],
  [/^(switch|turn)\s+(.+?)\s+on$/, 'switch on $2'],
  [/^(switch|turn)\s+(.+?)\s+off$/, 'switch off $2'],
  [/^(talk|speak|chat)\s+(to|with)\s+(.+)$/, 'ask $3 about $3'],
  [/^(use)\s+(.+)$/, 'examine $2']
];

// ---------- typo repair against the game's own dictionary ----------
function dist(a, b) {
  const m = a.length, n = b.length; if (Math.abs(m - n) > 2) return 9;
  const d = Array.from({ length: m + 1 }, (_, i) => [i].concat(Array(n).fill(0)));
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
  }
  return d[m][n];
}

class Parser {
  constructor(zm) {
    this.vocab = new Set();
    try {
      const d = zm.loadDict(zm.dict), res = zm.version <= 3 ? 6 : 9;
      this.res = res;
      for (let k = 0; k < d.count; k++) this.vocab.add(zm.decode(d.base + k * d.elen, res === 6 ? 4 : 6)[0]);
    } catch (e) { this.res = 9; }
    this.list = [...this.vocab].filter(w => /^[a-z][a-z\-']*$/.test(w));
  }
  known(w) { return this.vocab.has(w.slice(0, this.res)) || /^\d+$/.test(w); }
  fixWord(w) {
    if (w.length < 4 || this.known(w)) return null;
    const lim = w.length >= 7 ? 2 : 1;
    let best = null, bs = 1e9, bd = 9, tie = false;
    const ww = w.length > this.res ? w.slice(0, this.res) : w;
    for (const v of this.list) {
      if (Math.abs(v.length - ww.length) > lim) continue;
      const dd = dist(ww, v); if (dd > lim) continue;
      // prefer same length and same first letter when several words are equally close
      const score = dd * 10 - (v.length === ww.length ? 3 : 0) - (v[0] === ww[0] ? 2 : 0);
      if (score < bs) { bs = score; bd = dd; best = v; tie = false; } else if (score === bs && v !== best) tie = true;
    }
    return best && !tie ? best : null;
  }
  // first rewrite: German and well-known phrasings, applied before the game sees the command
  prepare(input, opts) {
    const raw = input.trim();
    let cmd = raw, why = null;
    if (opts.force) { const tr = translateDe(raw); if (tr && tr !== fold(raw)) return { cmd: tr, why: 'de' }; return { cmd, why }; }
    if (opts.german) {
      const f = fold(raw);
      if (looksGerman(f) || /[äöüß]/.test(raw)) { const tr = translateDe(raw); if (tr && tr !== f) { cmd = tr; why = 'de'; } }
    }
    return { cmd, why };
  }
  // further guesses, used only when the game did not understand the command
  alternatives(cmd, opts) {
    opts = opts || {};
    const out = [], seen = new Set([cmd.toLowerCase()]);
    const add = (c, why) => { c = c.replace(/\s+/g, ' ').trim(); if (c && !seen.has(c)) { seen.add(c); out.push({ cmd: c, why }); } };
    const low = cmd.toLowerCase().replace(/[^a-z0-9,.' \-]/g, ' ').replace(/\s+/g, ' ').trim();
    for (const [re, rep] of EN_SYN) if (re.test(low)) add(low.replace(re, rep), 'syn');
    // typo repair, word by word
    const words = low.split(' ');
    const fixed = words.map(w => this.fixWord(w) || w);
    if (fixed.join(' ') !== low) { add(fixed.join(' '), 'typo'); for (const [re, rep] of EN_SYN) if (re.test(fixed.join(' '))) add(fixed.join(' ').replace(re, rep), 'typo'); }
    // drop words the game does not know at all (adjectives the game never heard of)
    const kept = fixed.filter((w, i) => i === 0 || this.known(w) || ['it', 'all', 'me'].includes(w));
    if (kept.length >= 2 && kept.length < fixed.length) add(kept.join(' '), 'trim');
    // German translation as a last resort even if it did not look German
    if (!opts.noDe) { const tr = translateDe(cmd); if (tr) add(tr, 'de'); }
    return out.slice(0, 6);
  }
}
const PARSER_ERR = /That's not a verb I recognise|I didn't understand (that sentence|the way that finished)|I only understood you as far as|You can't see any such thing|You seem to want to talk to someone|I beg your pardon\?|There are none at all available|You can't use multiple objects with that verb|I'm not sure what ".*" refers to|That's not something you need to refer to/;

const api = { Parser, PARSER_ERR, translateDe, fold };
if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.ZParse = api;
})(typeof window !== 'undefined' ? window : this);
