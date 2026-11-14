// Comfort features: settings, inventory, notebook, named saves, transcript, word taps, exits,
// autocomplete, score toast, sound effects, classic mode. All optional and stored per viewer.
(function () {
'use strict';
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const LS = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } },
  del(k) { try { localStorage.removeItem(k); } catch (e) {} }
};
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const Z = () => window.__zp;
const DEF = { sayBrackets: false, trCol: false, lang: 'de', smartParser: true, germanInput: true, wordClick: true, autocomplete: true, scoreToast: true, exits: true, sfx: true, sfxVol: .5, classic: false, classicColor: 'amber', fontSize: 17, width: 'mittel', theme: 'dark' };
let P = Object.assign({}, DEF, JSON.parse(LS.get('zp:prefs') || '{}'));
const saveP = () => LS.set('zp:prefs', JSON.stringify(P));

// ---------------- settings ----------------
function applyPrefs() {
  const b = document.body;
  if (window.ZI18n && ZI18n.lang() !== P.lang) { ZI18n.applyLang(P.lang); const zp0 = Z(); if (zp0 && zp0.relang) zp0.relang(); lastInvSig = ''; renderInventory(); renderSaves(); renderExits(); renderTr(); }
  b.classList.toggle('classic', !!P.classic);
  b.dataset.ccolor = P.classicColor;
  b.dataset.theme = P.theme;
  document.documentElement.style.setProperty('--fs', P.fontSize + 'px');
  document.documentElement.style.setProperty('--tw', { schmal: '58ch', mittel: '72ch', breit: '92ch' }[P.width] || '72ch');
  b.classList.toggle('wordclick', !!P.wordClick);
  $('#exitBar').hidden = !P.exits || !!P.classic;
  const zp = Z(); if (zp && zp.S.music) { zp.S.music.setIntensity(.3); zp.S.music.sfxVol = P.sfx && !P.classic ? P.sfxVol : 0; zp.S.music.updateSfx && zp.S.music.updateSfx(); }
  if (P.classic && zp && zp.S.music.enabled) { $('#musicBtn').click(); }
  syncSettingsForm();
}
function syncSettingsForm() {
  const f = $('#setForm'); if (!f) return;
  for (const el of f.querySelectorAll('[data-p]')) {
    const k = el.dataset.p;
    if (el.type === 'checkbox') el.checked = !!P[k];
    else el.value = P[k] === false ? '' : P[k];
  }
  $('#fsVal').textContent = P.fontSize + ' px';
}
function initSettings() {
  const m = $('#setModal');
  $('#setBtn').onclick = () => { syncSettingsForm(); m.hidden = false; };
  $('#setClose').onclick = () => { m.hidden = true; };
  m.addEventListener('click', e => { if (e.target === m) m.hidden = true; });
  $('#setForm').addEventListener('input', e => {
    const el = e.target, k = el.dataset.p; if (!k) return;
    P[k] = el.type === 'checkbox' ? el.checked : (el.type === 'range' ? +el.value : el.value);
    saveP(); applyPrefs();
    if (k === 'sfx' && P.sfx) Z().S.music.initSfx();
  });
}

// ---------------- side tabs ----------------
function initTabs() {
  $$('#sideTabs button').forEach(b => b.addEventListener('click', () => {
    $$('#sideTabs button').forEach(x => x.classList.toggle('sel', x === b));
    $$('.sidePane').forEach(p => p.hidden = p.id !== b.dataset.pane);
    if (b.dataset.pane === 'paneMap') setTimeout(() => Z().renderMap(), 30);
    if (b.dataset.pane === 'paneInv') renderInventory();
    if (b.dataset.pane === 'paneNotes') renderNotes();
  }));
}

// ---------------- inventory ----------------
// The list is the game's own: after every turn the story's "inventory" is played on the side (and
// everything put back), so names, groups and states are exactly what the game would tell the player:
// "a featureless mahogany rod" until it has a name, "(being worn)", "five Tarot cards", "the Rods of …".
let lastInvSig = '', invCache = null, invTurn = -1, turnNo = 0;
const ST_DE = [[/^providing light$/, 'leuchtet'], [/^being worn$/, 'getragen'], [/^around your neck$/, 'um den Hals'], [/^(tucked|twitching) behind your ear$/, 'hinterm Ohr'],
  [/^which is open but empty$/, 'offen, leer'], [/^which is open$/, 'offen'], [/^which is closed and locked$/, 'verschlossen'], [/^which is closed$/, 'geschlossen'], [/^closed$/, 'geschlossen'],
  [/^which is empty$/, 'leer'], [/^charged$/, 'geladen'], [/^lit$/, 'brennt']];
function statusTags(st) {
  if (!st) return [];
  // "(providing light and closed)" → two states
  return st.split(/\s+and\s+(?=closed|open|being|providing|which)/).map(x => x.trim()).filter(Boolean).map(x => {
    const de = ST_DE.find(([re]) => re.test(x));
    return { en: x.replace(/^which is /, ''), de: de ? de[1] : x, key: de ? de[1] : x };
  });
}
function parseInventory(text) {
  const lines = (text || '').split('\n');
  const i0 = lines.findIndex(l => /^You are carrying/i.test(l.trim()));
  if (i0 < 0) return [];
  const root = { kids: [], depth: -1 }, stack = [root];
  const art = n => n.replace(/^(a|an|the|some)\s+/i, '').trim();
  for (let i = i0 + 1; i < lines.length; i++) {
    const raw = lines[i]; if (!/^\s{2,}\S/.test(raw)) break;
    const depth = Math.floor(raw.match(/^\s*/)[0].length / 2) - 1, l = raw.trim();
    while (stack.length > 1 && stack[stack.length - 1].depth >= depth) stack.pop();
    const parent = stack[stack.length - 1];
    let m;
    if ((m = /^(\w+) Tarot cards:$/.exec(l))) { const g = { name: 'Tarot', title: l.replace(/:$/, ''), group: 'tarot', depth, kids: [], status: [] }; parent.kids.push(g); stack.push(g); continue; }
    if (parent.group === 'tarot' && !parent.kids.length) { for (const n of l.replace(/^the /, '').split(/, | and /)) parent.kids.push({ name: art(n), depth, kids: [], status: [] }); continue; }
    if ((m = /^the (High )?Rods of (.+)$/.exec(l))) { const g = { name: (m[1] || '') + 'Rods', title: l.replace(/^the /, ''), group: 'rods', depth, kids: [], status: [] }; for (const n of m[2].split(/, | and /)) { const s2 = /\(([^)]*)\)$/.exec(n); g.kids.push({ name: (m[1] || '') + 'Rod of ' + n.replace(/\s*\([^)]*\)$/, ''), depth: depth + 1, kids: [], status: statusTags(s2 && s2[1]) }); } parent.kids.push(g); continue; }
    const sm = /\(([^)]*)\)\s*$/.exec(l);
    const it = { name: art(l.replace(/\s*\([^)]*\)\s*$/, '')), depth, kids: [], status: statusTags(sm && sm[1]) };
    parent.kids.push(it); stack.push(it);
  }
  return root.kids;
}
// which object of the story stands behind each line (for the commands and the "left here" bar)
function learnNames(items) {
  const zp = Z(), zm = zp.S.zm, S = zp.S; S.pname = S.pname || {};
  let me = 0; for (let c = zm.child(zm.readVar(17)); c; c = zm.sibling(c)) if (/^(yourself|self|you|player)$/i.test(zm.objName(c))) me = c;
  if (!me) return;
  const match = (list, owner) => {
    const objs = []; for (let c = zm.child(owner); c; c = zm.sibling(c)) objs.push(c);
    const free = new Set(objs), lines = [];
    for (const it of list) { if (it.group) { for (const k of it.kids) lines.push([k, owner]); } else lines.push([it, owner]); }
    const left = [];
    for (const [it] of lines) {
      const low = it.name.toLowerCase();
      const o = [...free].find(c => { const n = zm.objName(c).toLowerCase(); return n && (low === n || low.endsWith(' ' + n) || low.includes(n)); });
      if (o) { free.delete(o); it.obj = o; S.pname[o] = it.name; } else left.push(it);
    }
    // what is left keeps the order of the story's object tree
    const rest = objs.filter(c => free.has(c));
    left.forEach((it, i) => { if (rest[i]) { it.obj = rest[i]; S.pname[rest[i]] = it.name; } });
    for (const [it] of lines) if (it.obj && it.kids.length) match(it.kids, it.obj);
  };
  match(items, me);
}
function inventoryTree() {
  const zp = Z(), zm = zp.S.zm; if (!zm) return [];
  if (invCache && invTurn === turnNo) return invCache;
  if (zm.state !== 'input' || !zm.silentCommand) return invCache || [];
  const S = zp.S;
  const items = parseInventory(zm.silentCommand('inventory'));
  try { learnNames(items); } catch (e) {}
  // a closed container shows what was in it the last time it was open
  if (!S.seenInside) S.seenInside = JSON.parse(LS.get('zp:seen:' + S.serial) || '{}');
  let changed = false;
  const walk = list => { for (const it of list) {
    const closed = it.status.some(t => /geschlossen|verschlossen/.test(t.de));
    if (it.kids.length && !it.group) { const names = it.kids.map(k => k.name).join('|'); if (S.seenInside[it.name] !== names) { S.seenInside[it.name] = names; changed = true; } walk(it.kids); }
    else if (closed && S.seenInside[it.name]) it.kids = S.seenInside[it.name].split('|').filter(Boolean).map(n => ({ name: n, depth: it.depth + 1, kids: [], status: [], stale: true }));
  } };
  walk(items);
  if (changed) LS.set('zp:seen:' + S.serial, JSON.stringify(S.seenInside));
  invCache = items; invTurn = turnNo;
  return items;
}
const countItems = list => list.reduce((n, it) => n + (it.group ? it.kids.length : 1) + (it.group ? 0 : countItems(it.kids)), 0);
let invOpen = null;
function isOpenNode(it) {
  if (!invOpen) { try { invOpen = JSON.parse(LS.get('zp:invOpen') || '{}'); } catch (e) { invOpen = {}; } }
  const k = it.group || it.name;
  if (k in invOpen) return invOpen[k];
  return it.group ? false : it.kids.length <= 8;   // groups and full containers start folded
}
function renderInventory() {
  const box = $('#invList'); if (!box) return;
  const items = inventoryTree();
  const sig = JSON.stringify(items) + JSON.stringify(invOpen || {});
  if (sig === lastInvSig && box.childElementCount) return;
  lastInvSig = sig;
  if (!items.length) { box.innerHTML = `<p class="paneEmpty">${T('Du trägst nichts bei dir.')}</p>`; $('#invCount').textContent = ''; return; }
  const en = (P.lang || 'de') === 'en';
  const tags = it => it.status.map(t => ` <small class="tag">${esc(en ? t.en : t.de)}</small>`).join('') + (it.stale ? ` <small class="tag">${T('zuletzt gesehen')}</small>` : '');
  const row = it => {
    const foldable = it.group || it.kids.length, open = foldable && isOpenNode(it);
    const caret = foldable ? `<span class="fold" data-fold="${esc(it.group || it.name)}" data-open="${open ? 1 : 0}">${open ? '▾' : '▸'}</span>` : '<span class="fold"></span>';
    const label = it.group ? `${esc(it.title)} <small class="tag">${it.kids.length}</small>` : esc(it.name) + tags(it);
    const icon = it.group === 'tarot' ? ZIcons.icon(it.kids[0] ? it.kids[0].name : 'Tarot card') : it.group === 'rods' ? ZIcons.icon('mahogany rod') : ZIcons.icon(it.name);
    const head = `<button class="invItem d${Math.max(0, it.depth)}${it.stale ? ' stale' : ''}${it.group ? ' grp' : ''}" ${it.group ? `data-fold="${esc(it.group)}" data-open="${open ? 1 : 0}"` : `data-item="${esc(it.name)}" data-st="${esc(it.status.map(t => t.de).join(','))}"`} title="${esc(it.group ? it.title : it.name)}${it.stale ? T(' (zuletzt gesehen, als der Behälter offen war)') : ''}">${caret}<span class="ico">${icon}</span><span class="nm">${label}</span></button>`;
    return head + (open ? it.kids.map(row).join('') : '');
  };
  box.innerHTML = items.map(row).join('');
  $('#invCount').textContent = countItems(items);
}
// The menu offers only what gives nothing away: looking, putting down, and undoing a state the list shows.
function itemMenu(anchor, name, st) {
  const noun = Z().nounFor(name), s = st || '';
  const v = [['examine', 'examine ' + noun]];
  if (/getragen|um den Hals|hinterm Ohr/.test(s)) v.push(['take off', 'take off ' + noun]);
  if (/leuchtet/.test(s)) v.push(['turn off', 'turn off ' + noun]);
  if (/(^|,)offen/.test(s)) v.push(['close', 'close ' + noun]);
  if (/(^|,)geschlossen/.test(s)) v.push(['open', 'open ' + noun]);
  v.push(['drop', 'drop ' + noun]);
  showPop(anchor, name, v);
}

// ---------------- popover (items and words) ----------------
function showPop(anchor, title, actions, xy) {
  const p = $('#pop');
  p.innerHTML = `<div class="popT">${esc(title)}</div>` + actions.map(([label, cmd]) => `<button data-cmd="${esc(cmd)}">${esc(label)}</button>`).join('') + `<button data-ins="${esc(actions[0] ? actions[0][1].replace(/^\S+\s/, '') : title)}" class="ins">${T('in Eingabe übernehmen')}</button>`;
  p.hidden = false;
  const r = xy || anchor.getBoundingClientRect();
  const W = p.offsetWidth, H = p.offsetHeight;
  let x = (xy ? xy.x : r.left), y = (xy ? xy.y + 14 : r.bottom + 4);
  x = Math.min(x, innerWidth - W - 8); if (y + H > innerHeight - 8) y = (xy ? xy.y - H - 10 : r.top - H - 4);
  p.style.left = Math.max(8, x) + 'px'; p.style.top = Math.max(8, y) + 'px';
}
function hidePop() { $('#pop').hidden = true; }
function initPop() {
  $('#pop').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    hidePop();
    if (b.dataset.cmd) {
      const before = Z().S.lastText;
      Z().sendCommand(b.dataset.cmd);
      // a bug in Curses (Garvin's list): once a rod has a name, "featureless" still matches it, so the
      // game keeps asking which rod is meant. The game itself accepts "a featureless mahogany rod" as
      // the answer, so the menu gives that answer; typed commands are left exactly as the game has them.
      if (/featureless/.test(b.dataset.cmd)) {
        let n = 0; const t = setInterval(() => { const S = Z().S; if (++n > 40) clearInterval(t); if (!S.zm || S.zm.state !== 'input' || S.lastText === before) return; clearInterval(t);
          if (/Which do you mean, the featureless mahogany rod/.test(S.lastText || '')) Z().sendCommand('a featureless mahogany rod', 'raw'); }, 100);
      }
    }
    else if (b.dataset.ins) { const i = $('#cmd'); i.value = (i.value ? i.value.trim() + ' ' : '') + b.dataset.ins; i.focus(); }
  });
  document.addEventListener('pointerdown', e => { if (!e.target.closest('#pop') && !e.target.closest('.invItem')) hidePop(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') hidePop(); });
  $('#invList').addEventListener('click', e => {
    const f = e.target.closest('[data-fold]');
    if (f) { e.stopPropagation(); if (!invOpen) invOpen = {}; invOpen[f.dataset.fold] = f.dataset.open !== '1'; LS.set('zp:invOpen', JSON.stringify(invOpen)); lastInvSig = ''; renderInventory(); return; }
    if (f) { e.stopPropagation(); const k = f.dataset.fold; if (!invOpen) invOpen = {}; const it = { group: /^(tarot|rods)$/.test(k) ? k : null, name: k, kids: [] }; invOpen[k] = !(k in invOpen ? invOpen[k] : f.closest('.invItem') && f.textContent.trim() === '▾'); if (f.classList.contains('grp')) invOpen[k] = !(k in invOpen ? !invOpen[k] : false) ; LS.set('zp:invOpen', JSON.stringify(invOpen)); lastInvSig = ''; renderInventory(); return; }
    const b = e.target.closest('.invItem'); if (b && b.dataset.item) itemMenu(b, b.dataset.item, b.dataset.st);
  });
  // word taps in the transcript
  $('#transcript').addEventListener('click', e => {
    if (!P.wordClick || P.classic) return;
    if (e.target.closest('.say')) return;
    if (window.getSelection().toString()) return;
    const zm = Z().S.zm; if (!zm || zm.state !== 'input') return;
    const w = wordAt(e.clientX, e.clientY);
    if (!w || w.length < 3 || STOP.has(w)) return;
    e.stopPropagation();
    showPop(null, w, [['examine', 'examine ' + w], ['take', 'take ' + w], ['open', 'open ' + w], ['read', 'read ' + w], ['push', 'push ' + w], ['enter', 'enter ' + w]], { x: e.clientX, y: e.clientY });
  });
}
const STOP = new Set('the and you your are but for not with this that there here into onto from have has had was were been can could would should will its it’s it\'s which what when where who whom about above below some any all very just than then them they their his her him she he our out off one two also onto upon over under seems seem like only even more most much many such yet nor too'.split(' '));
function wordAt(x, y) {
  let node, off;
  if (document.caretPositionFromPoint) { const p = document.caretPositionFromPoint(x, y); if (!p) return null; node = p.offsetNode; off = p.offset; }
  else if (document.caretRangeFromPoint) { const r = document.caretRangeFromPoint(x, y); if (!r) return null; node = r.startContainer; off = r.startOffset; }
  if (!node || node.nodeType !== 3) return null;
  if (node.parentElement && node.parentElement.closest('.cmdEcho')) return null;
  const t = node.textContent;
  let a = off, b = off;
  while (a > 0 && /[A-Za-z\-']/.test(t[a - 1])) a--;
  while (b < t.length && /[A-Za-z\-']/.test(t[b])) b++;
  return t.slice(a, b).replace(/^'+|'+$/g, '').toLowerCase() || null;
}

// ---------------- exits ----------------
// the buttons show what you would type in the game (E for east, not the German O)
const DLAB = { n: 'N', s: 'S', e: 'E', w: 'W', ne: 'NE', nw: 'NW', se: 'SE', sw: 'SW', u: '↑ U', d: '↓ D', in: 'in', out: 'out' };
const DCMD = { n: 'n', s: 's', e: 'e', w: 'w', ne: 'ne', nw: 'nw', se: 'se', sw: 'sw', u: 'u', d: 'd', in: 'in', out: 'out' };
const OPP = { n: 's', s: 'n', e: 'w', w: 'e', ne: 'sw', sw: 'ne', nw: 'se', se: 'nw', u: 'd', d: 'u', in: 'out', out: 'in' };
function renderExits() {
  const bar = $('#exitBar'); if (!bar || !P.exits || P.classic) return;
  const S = Z().S, cur = S.cur;
  const ex = [];
  for (const e of S.map.edges) {
    if (e.a === cur && e.dir) ex.push([e.dir, e.b]);
    else if (e.b === cur && e.dir && OPP[e.dir]) ex.push([OPP[e.dir], e.a]);
  }
  const seen = new Set();
  const list = ex.filter(([d]) => !seen.has(d) && seen.add(d));
  bar.innerHTML = list.length ? `<span class="exL">${T('Bekannte Wege:')}</span>` + list.map(([d, to]) => `<button data-cmd="${DCMD[d]}" title="${T('nach')} ${esc(to)} (${DCMD[d]})">${DLAB[d]} <small>${esc(to)}</small></button>`).join('') : '';
}
function initExits() { $('#exitBar').addEventListener('click', e => { const b = e.target.closest('button'); if (b) Z().sendCommand(b.dataset.cmd); }); }

// ---------------- autocomplete ----------------
const VERBS = 'look examine take drop open close read push pull turn enter exit inventory wait search listen smell touch climb wear remove put give show ask tell eat drink unlock lock switch light blow throw insert sleep wake attack jump undo save restore again north south east west northeast northwest southeast southwest up down'.split(' ');
const vocab = new Set(VERBS);
function learn(text) { for (const w of (text.toLowerCase().match(/[a-z][a-z\-']{2,}/g) || [])) if (!STOP.has(w)) vocab.add(w.replace(/'s$/, '')); }
let acList = [], acIdx = 0;
function updateAC() {
  const box = $('#acBox'), inp = $('#cmd');
  if (!P.autocomplete || P.classic || inp.disabled) { box.hidden = true; return; }
  const v = inp.value, m = v.match(/([a-z\-']+)$/i);
  if (!m || m[1].length < 2) { box.hidden = true; acList = []; return; }
  const pre = m[1].toLowerCase();
  acList = [...vocab].filter(w => w.startsWith(pre) && w !== pre).sort((a, b) => (VERBS.includes(b) - VERBS.includes(a)) || a.length - b.length).slice(0, 6);
  if (!acList.length) { box.hidden = true; return; }
  acIdx = 0;
  box.innerHTML = acList.map((w, i) => `<button data-w="${w}" class="${i === 0 ? 'sel' : ''}">${w}</button>`).join('') + `<span class="acTip">${T('Tab übernimmt')}</span>`;
  box.hidden = false;
}
function acceptAC(w) { const inp = $('#cmd'); inp.value = inp.value.replace(/([a-z\-']+)$/i, w) + ' '; $('#acBox').hidden = true; inp.focus(); }
function initAC() {
  const inp = $('#cmd');
  inp.addEventListener('input', updateAC);
  inp.addEventListener('keydown', e => {
    const box = $('#acBox');
    if (e.key === 'Tab' && !box.hidden && acList.length) { e.preventDefault(); acceptAC(acList[acIdx]); }
    else if (e.key === 'Escape') box.hidden = true;
    else if (e.key === 'Enter') box.hidden = true;
  });
  $('#acBox').addEventListener('mousedown', e => { const b = e.target.closest('button'); if (b) { e.preventDefault(); acceptAC(b.dataset.w); } });
}

// ---------------- score toast ----------------
let lastScore = null;
function checkScore() {
  const zm = Z().S.zm; if (!zm) return;
  const rows = zm.upperText(); if (!rows.length || zm.upperLines > 3) return;
  const line = rows.map(r => r.map(c => c.ch).join('')).join(' ');
  const m = line.match(/Score:\s*(-?\d+)/i); if (!m) return;
  const s = +m[1];
  if (lastScore !== null && s !== lastScore && P.scoreToast && !P.classic) {
    const t = $('#toast'), d = s - lastScore;
    t.textContent = (d > 0 ? '+' : '') + d + ' ' + (Math.abs(d) === 1 ? T('Punkt') : T('Punkte'));
    t.classList.remove('show'); void t.offsetWidth; t.classList.add('show');
    if (d > 0) { Z().S.music.sfx('chime'); Z().S.music.react('', true); }
  }
  lastScore = s;
}

// ---------------- sound effects from state changes ----------------
let prevState = null, prevRoom = null;
function stateSfx(room, st) {
  const mu = Z().S.music;
  if (!st) { prevState = null; prevRoom = room; return; }
  if (prevState && room === prevRoom) {
    const opened = st.open.filter(x => !prevState.open.includes(x) && st.here.includes(x));
    const closed = prevState.open.filter(x => !st.open.includes(x) && st.here.includes(x));
    if (opened.length) mu.sfx('creak'); else if (closed.length) mu.sfx('thud');
    const gained = st.carried.filter(x => !prevState.carried.includes(x));
    const lost = prevState.carried.filter(x => !st.carried.includes(x));
    if (gained.length) mu.sfx('pickup'); else if (lost.length && st.here.some(x => lost.includes(x))) mu.sfx('drop');
  } else if (room !== prevRoom) mu.sfx('step');
  prevState = st; prevRoom = room;
  const r = (room || '').toLowerCase();
  mu.ambience(/museum|exhibits|cabinet|revolving|coven|dark staircase/.test(r) ? 'rain' : /church|chapel|bell tower|spire/.test(r) ? 'bells' : /sea|shore|ship|mast|prow|stern|jetty|harbour|drifting|causeway|pharos|lighthouse|cliff/.test(r) ? 'surf' : null);
}

// ---------------- notebook ----------------
function notes() { const S = Z().S; if (!S.notes) S.notes = JSON.parse(LS.get('zp:notes:' + S.serial) || 'null') || { general: '', rooms: {} }; return S.notes; }
function saveNotes() { const S = Z().S; LS.set('zp:notes:' + S.serial, JSON.stringify(S.notes)); }
function renderNotes() {
  const n = notes(), cur = Z().S.cur;
  $('#noteRoomName').textContent = cur || '–';
  const ta = $('#noteRoom');
  if (document.activeElement !== ta) ta.value = (cur && n.rooms[cur]) || '';
  ta.disabled = !cur;
  if (document.activeElement !== $('#noteGeneral')) $('#noteGeneral').value = n.general || '';
  const others = Object.keys(n.rooms).filter(k => n.rooms[k] && n.rooms[k].trim() && k !== cur);
  $('#noteOthers').innerHTML = others.length ? `<h4>${T('Notizen zu anderen Räumen')}</h4>` + others.map(k => `<div class="noteO"><b>${esc(k)}</b><span>${esc(n.rooms[k]).replace(/\n/g, '<br>')}</span></div>`).join('') : '';
}
function initNotes() {
  let t;
  $('#noteRoom').addEventListener('input', e => { const n = notes(), cur = Z().S.cur; if (!cur) return; n.rooms[cur] = e.target.value; clearTimeout(t); t = setTimeout(() => { saveNotes(); Z().renderMap(); }, 300); });
  $('#noteGeneral').addEventListener('input', e => { notes().general = e.target.value; clearTimeout(t); t = setTimeout(saveNotes, 300); });
}

// ---------------- named saves ----------------
const idxKey = () => 'zp:saves:' + Z().S.serial;
const dataKey = id => 'zp:sd:' + Z().S.serial + ':' + id;
function saveList() {
  let l = JSON.parse(LS.get(idxKey()) || 'null');
  if (!l) {
    l = [];
    for (let i = 1; i <= 3; i++) { const old = LS.get('zp:save:' + Z().S.serial + ':' + i); if (old) { const id = 'alt' + i; LS.set(dataKey(id), old); l.push({ id, name: 'Platz ' + i + ' (alt)', time: LS.get('zp:save:' + Z().S.serial + ':' + i + ':t') || '', room: '' }); } }
    LS.set(idxKey(), JSON.stringify(l));
  }
  return l;
}
let pendingName = null, pendingId = null;
function ioSave(json) {
  const S = Z().S;
  const l = saveList();
  let id = Date.now().toString(36); while (l.some(s => s.id === id)) id += 'x';
  const time = new Date().toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' });
  const name = (pendingName && pendingName.trim()) || ((S.cur || T('Spielstand')) + ' · ' + time);
  if (!LS.set(dataKey(id), json)) { pendingName = null; Z().appendSys(T('Der Spielstand passt nicht mehr in den Browser-Speicher. Lösche unter „Spielstände“ ein paar alte Stände oder exportiere sie.')); return false; }
  l.unshift({ id, name, time, room: S.cur || '' });
  LS.set(idxKey(), JSON.stringify(l));
  pendingName = null;
  renderSaves();
  return true;
}
function ioRestore() {
  const l = saveList();
  const id = pendingId || (l[0] && l[0].id);
  pendingId = null;
  return id ? LS.get(dataKey(id)) : null;
}
function renderSaves() {
  const box = $('#saveList'); if (!box) return;
  const l = saveList();
  box.innerHTML = l.length ? l.map(s => `<div class="saveRow" data-id="${s.id}"><div><b>${esc(s.name)}</b><small>${esc(s.time)}${s.room ? ' · ' + esc(s.room) : ''}</small></div><div class="sbtn"><button data-a="load">${T('Laden')}</button><button data-a="exp">${T('Exportieren')}</button><button data-a="del" title="${T('Löschen')}">✕</button></div></div>`).join('') : `<p class="paneEmpty">${T('Noch keine Spielstände.')}</p>`;
}
function exportBundle(id) {
  const S = Z().S, meta = saveList().find(s => s.id === id);
  return JSON.stringify({ type: 'zspieler-save', v: 1, story: S.serial, name: meta.name, time: meta.time, room: meta.room, state: LS.get(dataKey(id)), map: S.map, notes: notes() });
}
function offerText(title, text, filename) {
  $('#xferTitle').textContent = title;
  $('#xferText').value = text;
  $('#xferBox').hidden = false;
  const dl = $('#xferDl');
  dl.onclick = null;
  if (window.claude && typeof window.claude.use === 'function') {
    // published artifact: files go through the viewer's download capability
    dl.removeAttribute('href'); dl.removeAttribute('download');
    dl.hidden = !DL;
    if (DL) dl.onclick = async e => { e.preventDefault(); try { await DL.save({ filename, data: text }); } catch (err) { dl.textContent = T('Speichern abgebrochen'); setTimeout(() => dl.textContent = T('Als Datei speichern'), 2200); } };
  } else {
    try { const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' })); dl.href = url; dl.download = filename; dl.hidden = false; } catch (e) { dl.hidden = true; }
  }
  $('#xferText').select();
}
function importBundle(text) {
  let o; try { o = JSON.parse(text); } catch (e) { return T('Das ist kein gültiger Spielstand-Text.'); }
  if (o.type !== 'zspieler-save') return T('Das ist kein Spielstand aus dem Z-Spieler.');
  const S = Z().S;
  if (o.story !== S.serial) return T('Dieser Spielstand gehört zu einer anderen Story-Datei') + ' (' + o.story + ').';
  // the save itself is checked before anything is stored
  if (typeof o.state !== 'string') return T('Der Spielstand ist beschädigt.');
  try { S.zm.deserialize(o.state); } catch (e) { return T('Der Spielstand ist beschädigt.'); }
  const id = Date.now().toString(36);
  LS.set(dataKey(id), o.state);
  const l = saveList(); l.unshift({ id, name: String(o.name || 'Import').slice(0, 80) + ' ' + T('(importiert)'), time: String(o.time || '').slice(0, 40), room: String(o.room || '').slice(0, 80) }); LS.set(idxKey(), JSON.stringify(l));
  // merge map and notes
  // map data from a file is taken only in the expected shape: names as text, places as numbers, known kinds
  const str = x => typeof x === 'string' && x.length > 0 && x.length < 80;
  const num = x => typeof x === 'number' && isFinite(x) && Math.abs(x) < 1e5;
  if (o.map && o.map.rooms && typeof o.map.rooms === 'object') {
    for (const k in o.map.rooms) {
      const r = o.map.rooms[k]; if (!str(k) || !r || typeof r !== 'object' || S.map.rooms[k]) continue;
      const c = { x: num(r.x) ? r.x : 0, y: num(r.y) ? r.y : 0 };
      if (typeof r.cat === 'string' && /^[a-z0-9_-]{1,24}$/i.test(r.cat)) c.cat = r.cat;
      if (str(r.region)) c.region = r.region;
      for (const f of ['dl', 'order', 'visits']) if (num(r[f])) c[f] = r[f];
      if (r.pinned === true) c.pinned = true;
      S.map.rooms[k] = c;
    }
    for (const e of Array.isArray(o.map.edges) ? o.map.edges : []) {
      if (!e || !str(e.a) || !str(e.b) || (e.dir != null && !/^(n|s|e|w|ne|nw|se|sw|u|d|in|out)$/.test(e.dir))) continue;
      if (!S.map.edges.some(x => x.a === e.a && x.b === e.b)) S.map.edges.push({ a: e.a, b: e.b, dir: e.dir || null });
    }
    LS.set('zp:map:' + S.serial, JSON.stringify(S.map)); Z().renderMap();
  }
  if (o.notes && typeof o.notes === 'object') { const n = notes(); for (const k in o.notes.rooms || {}) if (!n.rooms[k] && typeof o.notes.rooms[k] === 'string') n.rooms[k] = o.notes.rooms[k]; if (typeof o.notes.general === 'string' && o.notes.general && !n.general.includes(o.notes.general)) n.general = (n.general ? n.general + '\n\n' : '') + o.notes.general; saveNotes(); }
  renderSaves();
  return null;
}
function transcriptText() {
  const parts = [];
  for (const el of $('#transcript').children) {
    if (el.classList.contains('sys')) { parts.push('[' + el.textContent + ']\n'); continue; }
    let s = ''; for (const n of el.childNodes) { if (n.nodeType === 1 && n.classList.contains('say')) continue; s += n.textContent; }
    parts.push(s);
  }
  return parts.join('').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}
function initSaves() {
  const m = $('#saveModal');
  const ready = () => Z().S.zm && Z().S.zm.state === 'input';
  $('#savesBtn').onclick = () => { renderSaves(); $('#xferBox').hidden = true; $('#saveMsg').textContent = ready() ? '' : T('Speichern und Laden geht, sobald das Spiel auf eine Eingabe wartet.'); $('#saveName').value = ''; $('#saveName').placeholder = (Z().S.cur || T('Spielstand')) + ' · ' + T('jetzt'); m.hidden = false; };
  $('#saveClose').onclick = () => { m.hidden = true; };
  m.addEventListener('click', e => { if (e.target === m) m.hidden = true; });
  $('#saveNow').onclick = () => { if (!ready()) return; pendingName = $('#saveName').value; m.hidden = true; Z().sendCommand('save'); };
  $('#saveList').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const id = b.closest('.saveRow').dataset.id;
    if (b.dataset.a === 'load') { if (!ready()) return; pendingId = id; m.hidden = true; Z().sendCommand('restore'); }
    else if (b.dataset.a === 'exp') { const meta = saveList().find(s => s.id === id); offerText(T('Spielstand „') + meta.name + T('“'), exportBundle(id), 'curses-' + meta.name.replace(/[^\w\-]+/g, '_').slice(0, 40) + '.zsave.txt'); }
    else if (b.dataset.a === 'del') {
      if (!b.dataset.armed) { b.dataset.armed = 1; b.textContent = T('Löschen?'); setTimeout(() => { delete b.dataset.armed; b.textContent = '✕'; }, 2500); return; }
      LS.del(dataKey(id)); LS.set(idxKey(), JSON.stringify(saveList().filter(s => s.id !== id))); renderSaves();
    }
  });
  $('#xferCopy').onclick = async () => { const t = $('#xferText'); try { await navigator.clipboard.writeText(t.value); $('#xferCopy').textContent = T('Kopiert ✓'); } catch (e) { t.select(); document.execCommand && document.execCommand('copy'); $('#xferCopy').textContent = T('Markiert, mit Strg+C kopieren'); } setTimeout(() => $('#xferCopy').textContent = T('Kopieren'), 2200); };
  $('#impBtn').onclick = () => { const err = importBundle($('#impText').value.trim()); $('#impMsg').textContent = err || T('Importiert. Der Spielstand steht oben in der Liste.'); if (!err) $('#impText').value = ''; };
  $('#impFile').addEventListener('change', e => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { const err = importBundle(String(r.result).trim()); $('#impMsg').textContent = err || T('Importiert. Der Spielstand steht oben in der Liste.'); }; r.readAsText(f); e.target.value = ''; });
  $('#transcriptBtn').onclick = () => offerText(T('Transkript'), transcriptText(), 'curses-transkript.txt');
}


// ---------------- translation panel (done by the reader's own browser, never by this page) ----------------
const TR = { blocks: [], translator: null, auto: false, target: 'de', busy: Promise.resolve() };
function trAdd(cmd, text) {
  text = (text || '').replace(/\n>\s*$/, '').replace(/^\s+|\s+$/g, '');
  if (!text) return;
  TR.seq = (TR.seq || 0) + 1;
  const b = { cmd, text, out: null, id: TR.seq, de: Z().S.lastSrc === 'tr' };
  // tag the original block so both columns can scroll together
  const outs = [...document.querySelectorAll('#transcript .out')].filter(el => el.textContent.replace(/🔊/g, '').trim());
  const last = outs[outs.length - 1]; if (last && !last.dataset.turn) last.dataset.turn = b.id;
  TR.blocks.push(b); if (TR.blocks.length > 80) TR.blocks.shift();
  renderTr();
  if (TR.auto && TR.translator) trTranslate(b);
}
function renderTr() {
  const box = $('#trList'); if (!box) return;
  if (!TR.blocks.length) { box.innerHTML = `<p class="paneEmpty notranslate" translate="no">${esc(T('Hier erscheinen die Antworten des Spiels zum Übersetzen.'))}</p>`; return; }
  const say = Z().ttsOk && Z().ttsOk();
  box.innerHTML = TR.blocks.map((b, i) => `<div class="trBlock" data-turn="${b.id}" data-i="${i}">${say && (b.out || b.text || '').trim() ? `<button type="button" class="say trSay" translate="no" title="${T('Übersetzung vorlesen')}" aria-label="${T('Übersetzung vorlesen')}">🔊</button>` : ''}${b.cmd ? `<span class="trCmd${b.de ? ' de' : ''}" translate="no">&gt; ${esc(b.cmd)}</span>` : ''}<span class="trText${TR.auto && !b.out ? ' pending' : ''}"${TR.auto ? ' translate="no"' : ''}>${esc(b.out || b.text)}</span></div>`).join('');
  if (!TR.userScrolled) { const sc = $('#trScroll'); sc.scrollTop = sc.scrollHeight; }
}
function trTranslate(b) {
  TR.busy = TR.busy.then(async () => {
    try {
      // The browser's translator loses line breaks and can drop whole sentences from a long piece.
      // So every line goes on its own (a room name stays a heading), and a long line is sent in
      // pieces of a few sentences; the pieces are joined again in the original layout.
      TR.cache = TR.cache || new Map();
      const tr = async x => { if (TR.cache.has(x)) return TR.cache.get(x); const y = await TR.translator.translate(x); if (TR.cache.size > 2000) TR.cache.clear(); TR.cache.set(x, y); return y; };
      const lines = [];
      for (const line of b.text.split('\n')) {
        if (!line.trim()) { lines.push(''); continue; }
        const sents = line.trim().split(/(?<=[.!?…])\s+(?=["'“‘(]?[A-Z0-9])/);
        const pieces = []; let cur = '';
        for (const x of sents) { if (cur && (cur + ' ' + x).length > 160) { pieces.push(cur); cur = x; } else cur = cur ? cur + ' ' + x : x; }
        if (cur) pieces.push(cur);
        const outp = []; for (const x of pieces) outp.push(await tr(x));
        lines.push(outp.join(' '));
      }
      b.out = lines.join('\n').replace(/\n{3,}/g, '\n\n');
    } catch (e) { $('#trStatus').textContent = T('Übersetzung fehlgeschlagen'); }
    renderTr();
  });
}
async function makeTranslator(target) {
  // Chrome/Edge built-in, on-device translation (current API and the older experimental one)
  try {
    if ('Translator' in self) {
      const av = await self.Translator.availability({ sourceLanguage: 'en', targetLanguage: target });
      if (av === 'unavailable') return { err: T('Diese Sprachkombination wird nicht unterstützt.') };
      $('#trStatus').textContent = av === 'available' ? '' : T('Sprachmodell wird geladen …');
      return { t: await self.Translator.create({ sourceLanguage: 'en', targetLanguage: target, monitor(m) { m.addEventListener('downloadprogress', e => { $('#trStatus').textContent = T('Sprachmodell wird geladen …') + ' ' + Math.round((e.loaded || 0) * 100) + ' %'; }); } }) };
    }
    if (self.translation && self.translation.createTranslator) return { t: await self.translation.createTranslator({ sourceLanguage: 'en', targetLanguage: target }) };
  } catch (e) { return { err: T('Dein Browser bietet keine eingebaute Übersetzung an. Nutze seine Übersetzen-Funktion (siehe unten).') }; }
  return { err: T('Dein Browser bietet keine eingebaute Übersetzung an. Nutze seine Übersetzen-Funktion (siehe unten).') };
}
function setTrCol(on) {
  P.trCol = !!on; saveP();
  document.body.classList.toggle('trcol', P.trCol);
  $('#trCol').hidden = !P.trCol;
  const b = $('#trBtn'); b.classList.toggle('on', P.trCol); b.setAttribute('aria-pressed', P.trCol);
  if (!P.trCol && document.body.dataset.tab === 'tr') document.querySelector('[data-tab=text]').click();
  if (P.trCol) renderTr();
  setTimeout(() => { const zp = Z(); if (zp && zp.renderMap) zp.renderMap(); window.dispatchEvent(new Event('resize')); }, 30);
}
function initTrSync() {
  // scrolling the original brings the matching translation into view
  const sc = $('#scroll');
  let tm;
  sc.addEventListener('scroll', () => {
    if (!P.trCol) return;
    clearTimeout(tm);
    tm = setTimeout(() => {
      const top = sc.getBoundingClientRect().top + 8;
      const blocks = [...document.querySelectorAll('#transcript .out[data-turn]')];
      const nearBottom = sc.scrollTop + sc.clientHeight > sc.scrollHeight - 30;
      const trs = $('#trScroll');
      if (nearBottom) { TR.userScrolled = false; trs.scrollTop = trs.scrollHeight; return; }
      const vis = blocks.find(b => b.getBoundingClientRect().bottom > top);
      if (!vis) return;
      const target = document.querySelector('#trList .trBlock[data-turn="' + vis.dataset.turn + '"]');
      if (!target) return;
      TR.userScrolled = true;
      document.querySelectorAll('#trList .trBlock.hl').forEach(x => x.classList.remove('hl'));
      target.classList.add('hl');
      trs.scrollTop = target.offsetTop - trs.offsetTop - 8;
    }, 60);
  });
}
function initTrInput() {
  const f = $('#trForm'), inp = $('#trCmd'), hist = []; let hi = -1;
  f.addEventListener('submit', e => {
    e.preventDefault();
    const zm = Z().S.zm; if (!zm) return;
    if (zm.state === 'char') { Z().S.lastSrc = 'tr'; Z().sendKey(inp.value ? inp.value.charCodeAt(0) : 13); inp.value = ''; return; }
    const v = inp.value; inp.value = '';
    if (v.trim()) { hist.push(v); hi = -1; }
    Z().sendCommand(v, 'tr');
  });
  inp.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' && hist.length) { e.preventDefault(); hi = hi < 0 ? hist.length - 1 : Math.max(0, hi - 1); inp.value = hist[hi]; }
    else if (e.key === 'ArrowDown' && hi >= 0) { e.preventDefault(); hi++; if (hi >= hist.length) { hi = -1; inp.value = ''; } else inp.value = hist[hi]; }
  });
}
// reading the translation aloud, in a voice for the target language
function trSpeak(blockEl) {
  const zp = Z(); if (!zp || !zp.speakText || !blockEl) return;
  const b = TR.blocks[+blockEl.dataset.i]; const te = blockEl.querySelector('.trText');
  const text = (te ? te.textContent : '').trim();
  // not translated yet (the browser's own translation has not run): read the original in the original voice
  const translated = b && text && text !== (b.text || '').trim();
  const ok = zp.speakText(text, translated ? TR.target : null, blockEl);
  if (translated && !ok) $('#trStatus').textContent = T('Keine passende Stimme für diese Sprache gefunden – es liest die Standardstimme.');
}
function initTr() {
  initTrInput();
  $('#trList').addEventListener('click', e => { const btn = e.target.closest('.trSay'); if (!btn) return; e.stopPropagation(); trSpeak(btn.closest('.trBlock')); });
  { const sb = $('#trSayBtn'); if (sb) sb.onclick = () => { const zp = Z(); const blocks = [...document.querySelectorAll('#trList .trBlock')].filter(x => x.querySelector('.trText') && x.querySelector('.trText').textContent.trim()); const last = blocks.pop(); if (zp.speaking && zp.speaking()) zp.stopSpeech(); else if (last) trSpeak(last); }; if (!(Z().ttsOk && Z().ttsOk())) sb.hidden = true; }
  const sel = $('#trTarget');
  $('#trBtn').onclick = () => setTrCol(!P.trCol);
  initTrSync();
  TR.target = P.trTarget || (P.lang === 'en' ? 'de' : 'de'); sel.value = TR.target;
  const hasApi = ('Translator' in self) || !!(self.translation && self.translation.createTranslator);
  $('#trAutoBtn').hidden = !hasApi;
  sel.addEventListener('change', () => { P.trTarget = TR.target = sel.value; saveP(); try { Z().loadTrVoices(); } catch (e) {} if (TR.auto) { TR.auto = false; $('#trAutoBtn').click(); } });
  $('#trAutoBtn').onclick = async () => {
    const btn = $('#trAutoBtn');
    if (TR.auto) { TR.auto = false; btn.textContent = T('Automatisch übersetzen'); $('#trStatus').textContent = ''; TR.blocks.forEach(b => b.out = null); renderTr(); return; }
    btn.disabled = true;
    const r = await makeTranslator(TR.target);
    btn.disabled = false;
    if (!r.t) { $('#trStatus').textContent = r.err; return; }
    TR.translator = r.t; TR.auto = true; btn.textContent = T('Übersetzung aus'); $('#trStatus').textContent = T('übersetzt automatisch');
    TR.blocks.forEach(b => { b.out = null; }); renderTr(); TR.blocks.forEach(trTranslate);
  };
  renderTr();
  setTrCol(P.trCol && !P.classic);
}

// The picture is an illustration only: it names nothing and cannot be clicked, so that
// finding out what is there stays the player's work in the text.

// ---------------- per-turn hook ----------------
function afterTurn(info) {
  turnNo++;
  learn(info.text || '');
  trAdd(Z().S.lastShownCmd, info.text);
  checkScore();
  const zp = Z(), room = zp.S.cur;
  const name = zp.statusRoom();
  const st = name && !/^darkness$/i.test(name) ? zp.roomState(name) : null;
  if (P.sfx && !P.classic) stateSfx(name, st); else { prevState = st; prevRoom = name; }
  renderExits();
  try { zp.renderRoomItems(); } catch (e) {}
  if (!$('#paneInv').hidden) renderInventory(); else { const items = inventoryTree(); $('#invCount').textContent = countItems(items) || ''; }
  if (!$('#paneNotes').hidden) renderNotes();
  updateAC();
}

let DL = null;
try { if (window.claude && typeof window.claude.use === 'function') window.claude.use('downloads').then(d => { DL = d; }).catch(() => {}); } catch (e) {}
// a new game forgets everything about the previous one (named saves stay)
function resetRun() {
  const S = Z().S;
  lastInvSig = ''; lastScore = null; prevState = null; prevRoom = null; acList = []; acIdx = 0;
  S.seenInside = null; S.notes = null;
  TR.blocks = []; try { renderTr(); } catch (e) {}
  try { renderNotes(); } catch (e) {}
  try { renderInventory(); } catch (e) {}
  const t = $('#toast'); if (t) t.classList.remove('show');
}
window.ZFeat = { resetRun, afterTurn, save: ioSave, restore: ioRestore, prefs: () => P, notes, applyPrefs, commit: () => { saveP(); applyPrefs(); setTrCol(P.trCol && !P.classic); } };
function init() {
  initSettings(); initTabs(); initPop(); initExits(); initAC(); initNotes(); initSaves(); initTr();
  applyPrefs();
  // audio needs a user gesture before sound effects can play
  document.addEventListener('pointerdown', () => { if (P.sfx && !P.classic && Z() && Z().S.music.initSfx) Z().S.music.initSfx(); }, { once: true });
  document.addEventListener('keydown', () => { if (P.sfx && !P.classic && Z() && Z().S.music.initSfx) Z().S.music.initSfx(); }, { once: true });
}
init();
})();
