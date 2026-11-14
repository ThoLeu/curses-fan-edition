(function () {
'use strict';
const $ = s => document.querySelector(s);
const LS = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } },
  del(k) { try { localStorage.removeItem(k); } catch (e) {} }
};
const moodLabel = n => (ZMusic.MOODS[n] && ZMusic.MOODS[n].label) || 'Haus';
const DIRS = {
  n: 'n', north: 'n', s: 's', south: 's', e: 'e', east: 'e', w: 'w', west: 'w',
  ne: 'ne', northeast: 'ne', nw: 'nw', northwest: 'nw', se: 'se', southeast: 'se', sw: 'sw', southwest: 'sw',
  u: 'u', up: 'u', upstairs: 'u', d: 'd', down: 'd', downstairs: 'd', in: 'in', inside: 'in', enter: 'in', out: 'out', outside: 'out', exit: 'out', leave: 'out'
};
const VEC = { n: [0, -1], s: [0, 1], e: [1, 0], w: [-1, 0], ne: [1, -1], nw: [-1, -1], se: [1, 1], sw: [-1, 1], u: [1, -1], d: [-1, 1], in: [1, 1], out: [-1, -1] };
const OPP = { n: 's', s: 'n', e: 'w', w: 'e', ne: 'sw', sw: 'ne', nw: 'se', se: 'nw', u: 'd', d: 'u', in: 'out', out: 'in' };
const CELLX = 136, CELLY = 74;

const S = {
  zm: null, bytes: null, serial: '', cur: null, lastCmd: '', lastDir: null,
  map: { rooms: {}, edges: [] }, history: [], hIdx: -1, slot: 1,
  music: new ZMusic.Music(), view: { x: 0, y: 0, z: 1, manual: false }, turnText: ''
};

// ---------- story loading ----------
function b64(bytes) { let s = ''; for (let i = 0; i < bytes.length; i += 8192) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 8192)); return btoa(s); }
function unb64(str) { const bin = atob(str); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u; }
function storyInfo(bytes) {
  const rel = (bytes[2] << 8) | bytes[3];
  const serial = String.fromCharCode(...bytes.slice(0x12, 0x18));
  return { version: bytes[0], release: rel, serial, id: rel + '-' + serial };
}

// Which story is this? Curses release 16 gets every extra; other stories still run.
function detectStory(bytes) {
  const info = storyInfo(bytes);
  if (info.id === '16-951024') return { kind: 'curses16', info };
  let curses = false;
  try { const zm = new ZM.ZMachine(bytes, {}); const P = new ZParse.Parser(zm); curses = P.known('meldrew') && P.known('jemima'); } catch (e) {}
  return { kind: curses ? 'curses' : 'other', info };
}
function handleFile(file) {
  const rd = new FileReader();
  rd.onload = () => handleBytes(new Uint8Array(rd.result), file.name);
  rd.readAsArrayBuffer(file);
}
// one click: fetch the story file straight from the IF Archive, if the browser and the archive allow it here
const ARCHIVE_URL = 'https://ifarchive.org/if-archive/games/zcode/curses.z5';
async function loadFromArchive(btn) {
  const old = btn.textContent; btn.disabled = true; btn.textContent = T('Lade aus dem IF Archive …');
  try {
    const r = await fetch(ARCHIVE_URL, { mode: 'cors', cache: 'force-cache' });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    handleBytes(new Uint8Array(await r.arrayBuffer()), 'curses.z5');
  } catch (e) {
    showStartError(T('Direkt laden ging hier nicht – der Browser oder das IF Archive lässt es von dieser Seite aus nicht zu. Lade die Datei über den Link „curses.z5 herunterladen“ herunter und leg sie hier ab.'));
  } finally { btn.disabled = false; btn.textContent = old; }
}
function handleBytes(bytes, name) {
  {
    if (bytes.length < 64 || bytes[0] < 3 || bytes[0] > 5) { showStartError(T('Das sieht nicht nach einer Z-Code-Datei (Version 3–5) aus.')); return; }
    LS.set('zp:story', b64(bytes)); LS.set('zp:storyname', name);
    const d = detectStory(bytes), box = $('#detect');
    box.hidden = false; box.classList.toggle('warn', d.kind !== 'curses16');
    $('#startErr').hidden = true;
    if (d.kind === 'curses16') {
      box.textContent = T('✓ Erkannt: Curses, Release 16, alles bereit: Bilder, Karte, Hilfe');
      setTimeout(() => startGame(bytes, false), 900);
    } else {
      box.textContent = d.kind === 'curses' ? T('Erkannt: Curses, aber eine andere Version. Es läuft, die eigenen Raumbilder, die Hilfe und einige Zustandsbilder sind aber für Release 16 gemacht.') : T('Das ist nicht Curses. Das Spiel läuft trotzdem, nur ohne die Curses-Extras (eigene Raumbilder, Hilfe, Zustandsbilder).');
      $('#detectBtns').hidden = false;
      $('#startAnyway').onclick = () => startGame(bytes, false);
    }
  }
}
function showStartError(msg) { const e = $('#startErr'); e.textContent = msg; e.hidden = false; }

function initStart() {
  // the framed plate: the attic, with a few motes of dust drifting through the light
  const plate = $('#startPic');
  plate.innerHTML = ZArt.scene('Attic', 'beams trapdoor light below', null, null).svg +
    '<div class="dust">' + Array.from({ length: 22 }, (_, k) => `<i style="left:${40 + Math.random() * 22}%;top:${25 + Math.random() * 65}%;animation-delay:${(Math.random() * 9).toFixed(1)}s"></i>`).join('') + '</div>';
  const cached = LS.get('zp:story');
  if (cached) {
    try {
      const bytes = unb64(cached), info = storyInfo(bytes);
      const auto = LS.get('zp:auto:' + info.id);
      const meta = JSON.parse(LS.get('zp:meta:' + info.id) || 'null');
      $('#resumeCard').hidden = false;
      $('#playBox').hidden = true;
      $('#dropTitle').textContent = T('Andere Story-Datei laden');
      if (auto && meta && meta.room) {
        const map = JSON.parse(LS.get('zp:map:' + info.id) || 'null');
        const cat = map && map.rooms[meta.room] && map.rooms[meta.room].cat;
        let rdesc = ''; try { rdesc = (JSON.parse(LS.get('zp:desc:' + info.id) || '{}') || {})[meta.room] || ''; } catch (e) {}
        $('#resumePic').innerHTML = ZArt.scene(meta.room, rdesc, cat || null, null).svg;
        $('#resumeRoom').textContent = meta.room;
        const when = new Date(meta.time);
        const today = new Date().toDateString() === when.toDateString();
        $('#resumeMeta').textContent = [meta.region, meta.score != null ? meta.score + ' ' + T('Punkte') : null, meta.turns != null ? meta.turns + ' ' + T('Züge') : null,
          T('zuletzt') + ' ' + (today ? when.toLocaleTimeString(document.documentElement.lang === 'en' ? 'en-GB' : 'de-DE', { hour: '2-digit', minute: '2-digit' }) : when.toLocaleDateString(document.documentElement.lang === 'en' ? 'en-GB' : 'de-DE'))].filter(Boolean).join(' · ');
      } else {
        $('#resumePic').innerHTML = ZArt.scene('Attic', '', null, null).svg;
        $('#resumeRoom').textContent = (LS.get('zp:storyname') || 'Story') + ' · Release ' + info.release;
        $('#resumeMeta').textContent = T('Zuletzt gespielt');
      }
      $('#resumeBtn').textContent = auto ? T('▶ Weiterspielen') : T('▶ Spielen');
      $('#resumeBtn').onclick = () => startGame(bytes, !!auto);
      $('#freshBtn').hidden = !auto;
      $('#freshBtn').onclick = () => { LS.del('zp:auto:' + info.id); LS.del('zp:meta:' + info.id); startGame(bytes, false); };
    } catch (e) {}
  }
  $('#fileInput').addEventListener('change', e => { if (e.target.files[0]) handleFile(e.target.files[0]); });
  { const pb = $('#playBtn'); if (pb) pb.onclick = () => loadFromArchive(pb); }
  const dz = $('#drop');
  ['dragenter', 'dragover'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.add('over'); }));
  ['dragleave', 'drop'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.remove('over'); }));
  dz.addEventListener('drop', e => { const f = e.dataTransfer.files[0]; if (f) handleFile(f); });
  document.addEventListener('dragover', e => e.preventDefault());
  document.addEventListener('drop', e => { e.preventDefault(); if (!S.zm && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); });
  // how to play: three presets, language and translation column (needs the settings module, which loads after this file)
  setTimeout(initStartPrefs, 0);
}
function initStartPrefs() {
  if (!window.ZFeat) { setTimeout(initStartPrefs, 20); return; }
  const P = () => window.ZFeat.prefs();
  const markStyle = () => document.querySelectorAll('#styleTiles .tile').forEach(b => b.classList.toggle('sel', b.dataset.style === (P().style || (P().classic ? 'classic' : 'illustrated'))));
  document.querySelectorAll('#styleTiles .tile').forEach(b => b.addEventListener('click', () => {
    const s = b.dataset.style, p = P();
    p.style = s;
    if (s === 'illustrated') { p.classic = false; p.trCol = false; }
    if (s === 'classic') { p.classic = true; p.trCol = false; }
    if (s === 'helpers') { p.classic = false; p.trCol = true; p.germanInput = true; p.smartParser = true; p.wordClick = true; p.exits = true; }
    window.ZFeat.commit(); markStyle(); $('#startTr').checked = !!p.trCol;
  }));
  markStyle();
  $('#startLang').value = P().lang || 'de';
  $('#startLang').addEventListener('change', e => { P().lang = e.target.value; window.ZFeat.commit(); });
  $('#startTr').checked = !!P().trCol;
  $('#startTr').addEventListener('change', e => { P().trCol = e.target.checked; window.ZFeat.commit(); });
  // a short taste of the attic music
  let prevT = null;
  $('#previewBtn').onclick = () => {
    const b = $('#previewBtn');
    if (S.music.enabled && prevT) { clearTimeout(prevT); prevT = null; S.music.setEnabled(false); b.textContent = T('♫ Stimmung anhören'); return; }
    if (!S.music.setEnabled(true)) return;
    S.music.setIntensity(.3);
    S.music.moodName = null; S.music.setMood('attic', 'Attic');
    b.textContent = T('■ Hörprobe stoppen');
    prevT = setTimeout(() => { prevT = null; S.music.setEnabled(false); b.textContent = T('♫ Stimmung anhören'); }, 20000);
    S.previewTimer = () => { if (prevT) { clearTimeout(prevT); prevT = null; S.music.setEnabled(false); } };
  };
}

// ---------- game ----------
function slotKey(n) { return 'zp:save:' + S.serial + ':' + n; }
// Forget everything about the current run: map, position, notes, what was seen and carried.
// Named saves are deliberate and stay.
function wipeRun(serial) {
  for (const k of ['auto', 'meta', 'map', 'cur', 'rev', 'words', 'heldids', 'seen', 'notes', 'desc']) LS.del('zp:' + k + ':' + serial);
  S.descs = null;
  S.map = { rooms: {}, edges: [] }; S.cur = null; S.resumeRoom = null; S.revealed = null; S.words = null; S.wordsLoc = null; S.heldIds = null;
  S.lastStatus = null; S.lastRegion = null; S.lastTagKeys = null; S.lastText = ''; S.turnText = ''; S.sheet = null; shownKey = null;
  const ri = document.getElementById('roomItems'); if (ri) { ri.innerHTML = ''; ri.hidden = true; ri.dataset.sig = ''; }
  const pic = document.getElementById('pic'); if (pic) pic.innerHTML = '';
  if (window.ZFeat && ZFeat.resetRun) try { ZFeat.resetRun(); } catch (e) {}
}
function musicByDefault() {
  const P = window.ZFeat ? ZFeat.prefs() : {};
  if (LS.get('zp:music') === '0' || P.classic || S.music.enabled || S.demo) return;
  const mb = document.getElementById('musicBtn'); if (mb && mb.onclick) mb.onclick();
}
function startGame(bytes, resume, opts) {
  if (S.previewTimer) S.previewTimer();
  setTimeout(musicByDefault, 0);
  S.bytes = bytes; S.objIds = null; try { clearEnding(); } catch (e) {}
  const info = storyInfo(bytes);
  S.serial = info.id;
  $('#start').hidden = true; $('#game').hidden = false;
  $('#transcript').innerHTML = '';
  if (!resume || !LS.get('zp:auto:' + S.serial)) wipeRun(S.serial);
  S.map = JSON.parse(LS.get('zp:map:' + S.serial) || 'null') || { rooms: {}, edges: [] };
  S.cur = LS.get('zp:cur:' + S.serial) || null;
  S.zm = new ZM.ZMachine(bytes, {
    save: json => window.ZFeat ? ZFeat.save(json) : LS.set(slotKey(1), json),
    restore: () => window.ZFeat ? ZFeat.restore() : LS.get(slotKey(1)),
    onClear: () => { $('#transcript').innerHTML = ''; },
    onRestart: () => { if (!S.demo) wipeRun(S.serial); $('#transcript').innerHTML = ''; renderMap(); },
    beep: () => {}
  });
  if (opts && opts.seed) S.zm.seedRandom(opts.seed);
  try { S.parser = new ZParse.Parser(S.zm); } catch (e) { S.parser = null; }
  measureWidth();
  let resumed = false;
  if (resume) {
    const auto = LS.get('zp:auto:' + S.serial);
    try {
      const o = JSON.parse(auto);
      const snap = S.zm.deserialize(o.state);
      S.zm.applySnapshot(snap);
      S.zm.pendingRead = o.pending; S.zm.state = 'input';
      S.zm.upperLines = o.upperLines || 1; S.zm.upper = [];
      resumed = true; S.resumeRoom = S.cur;
      appendSys(T('Spiel fortgesetzt.'));
      S.lastCmd = 'look';
      S.zm.provideInput('look');
    } catch (e) { appendSys(T('Automatischer Spielstand ließ sich nicht laden, das Spiel startet neu.')); }
  }
  S.revealed = null; S.words = null; S.wordsLoc = null; S.heldIds = null; S.homes = null; if (!resumed) { LS.del('zp:rev:' + S.serial); LS.del('zp:words:' + S.serial); LS.del('zp:heldids:' + S.serial); LS.del('zp:desc:' + S.serial); S.descs = null; }
  if (!resumed && S.cur && !resume) { /* new game: keep map knowledge but start fresh position */ S.cur = null; }
  S.notes = null;
  pump();
  renderMap();
  $('#cmd').focus();
}

function measureWidth() {
  const probe = document.createElement('span'); probe.className = 'mono'; probe.textContent = 'MMMMMMMMMM';
  probe.style.visibility = 'hidden'; probe.style.position = 'absolute';
  document.body.appendChild(probe);
  const cw = probe.getBoundingClientRect().width / 10; probe.remove();
  const avail = $('#status').clientWidth - 16;
  const cols = Math.floor(avail / (cw || 8));
  if (S.zm) S.zm.setScreenWidth(Math.max(64, Math.min(110, cols)));
}

function pump(pre) {
  const zm = S.zm;
  const st = pre ? pre.st : zm.run();
  const out = pre ? pre.out : zm.takeOutput();
  const text = out.map(o => o.text).join('');
  S.lastText = text;
  noteWords(text);
  try { S.music.react(text, false); } catch (e) {}
  try { closeUp(text); } catch (e) {}
  S.endBuf = ((S.endBuf || '') + text).slice(-4000);
  try { ending(S.endBuf, text); } catch (e) {}
  renderOutput(out);
  renderUpper();
  S.turnText += text;
  try { noteReveals(text); } catch (e) {}
  detectRoom();
  S.turnText = '';
  if (window.ZFeat) try { ZFeat.afterTurn({ text, state: st }); } catch (e) { console.error(e); }
  const inp = $('#cmd');
  $('#keyHint').hidden = st !== 'char';
  inp.disabled = st !== 'input';
  const trInp = document.getElementById('trCmd');
  if (trInp) { trInp.disabled = st !== 'input' && st !== 'char'; trInp.placeholder = st === 'char' ? T('Drück eine Taste …') : T('Was tust du? (auf Deutsch)'); }
  if (st === 'input') {
    inp.placeholder = T('Was tust du?');
    if (S.lastSrc === 'tr' && trInp && !document.getElementById('trCol').hidden) trInp.focus({ preventScroll: true }); else inp.focus({ preventScroll: true });
    autosave();
  } else if (st === 'char') {
    inp.placeholder = T('Drück eine Taste …');
  } else if (st === 'quit') {
    appendSys(T('Das Spiel ist beendet. Über „Neu starten“ geht es von vorn los.'));
  } else if (st === 'error') {
    appendSys(T('Der Interpreter ist auf einen Fehler gestoßen: ') + (zm.error && zm.error.message));
  }
  scrollDown();
}

function autosave() {
  if (S.demo) return;
  try {
    const zm = S.zm;
    LS.set('zp:auto:' + S.serial, JSON.stringify({ state: zm.serialize(), pending: zm.pendingRead, upperLines: zm.upperLines }));
    const line = zm.upperText().map(r => r.map(c => c.ch).join('')).join(' ');
    const sc = line.match(/Score:\s*(-?\d+)/i), tu = line.match(/(?:Turns|Moves):\s*(\d+)/i);
    LS.set('zp:meta:' + S.serial, JSON.stringify({ room: S.cur, region: S.curRegion && S.curRegion !== 'Ohne Region' ? S.curRegion : null, score: sc ? +sc[1] : null, turns: tu ? +tu[1] : null, time: Date.now() }));
  } catch (e) {}
}

// when the game ends (other than by winning) the room picture fades to grey; twelve endings have a
// picture of their own. It stays while the game asks RESTART/RESTORE/UNDO and goes with whatever follows.
function ending(buf, text) {
  const pic = $('#pic'); if (!pic) return;
  let el = $('#endScene'); if (!el) { el = document.createElement('div'); el.id = 'endScene'; el.hidden = true; pic.appendChild(el); }
  const e = !S.ended && window.ZEnd ? ZEnd.find(buf) : null;
  if (e) {
    S.ended = true; pic.classList.add('ended');
    if (e.key) try { S.music.endSfx(e.key); } catch (err) {}
    if (e.svg) { el.innerHTML = e.svg; el.hidden = false; el.classList.remove('on'); requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('on'))); }
    else { el.hidden = true; el.innerHTML = ''; }
    const cu = $('#closeUp'); if (cu) { cu.hidden = true; cu.innerHTML = ''; }
    return;
  }
  if (!S.ended || !text || !text.trim()) return;
  if ( /Would you like to RESTART|Please give one of the answers above/.test(text) && !/Previous turn undone/.test(text)) return;
  clearEnding();
}
function clearEnding() {
  S.ended = false;
  const pic = $('#pic'), el = $('#endScene');
  if (pic) pic.classList.remove('ended');
  if (el) { el.classList.remove('on'); el.hidden = true; el.innerHTML = ''; }
}
// a close-up of a Tarot card or a rod when the game describes one; it goes with the next command or a click
function closeUp(text) {
  const el = document.getElementById('closeUp'); if (!el || !window.ZClose) return;
  const c = text ? ZClose.find(text) : null;
  if (!c) { el.hidden = true; el.innerHTML = ''; return; }
  el.innerHTML = c.svg + '<span class="cuX">×</span>';
  el.classList.toggle('wide', !!c.wide);
  el.title = T('Zum Schließen klicken');
  el.hidden = false;
  el.onclick = () => { el.hidden = true; el.innerHTML = ''; };
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') { const el = document.getElementById('closeUp'); if (el && !el.hidden) { el.hidden = true; el.innerHTML = ''; } } });
function sendCommand(cmd, src) {
  const zm = S.zm;
  if (!zm || zm.state !== 'input') return;
  S.lastShownCmd = cmd; S.lastSrc = src || 'main'; S.endBuf = '';
  appendCmd(cmd);
  if (cmd.trim()) { S.history.push(cmd); if (S.history.length > 200) S.history.shift(); }
  S.hIdx = -1;
  stopSpeech();
  const prefs = window.ZFeat ? ZFeat.prefs() : {};
  const smart = prefs.smartParser !== false && !prefs.classic;
  if (src === 'tr' && S.parser && !smart) { const pr = S.parser.prepare(cmd, { force: true }); if (pr.cmd !== cmd) { appendNote(T('übersetzt: ') + pr.cmd); cmd = pr.cmd; } }
  // "undo" while the game is asking "Which do you mean …?" would be read as the verb "undo" (= open)
  // and open something. Cancel the question with a word the game rejects, then undo for real.
  if (/^undo$/i.test(cmd.trim()) && /(Which do you mean|What do you want to|Whom do you want|Who do you want|What do you want)[^\n]*\?\s*>?\s*$/.test(S.lastText || '')) {
    zm.provideInput('zzqq'); zm.run(); zm.takeOutput();
  }
  if (!smart || !S.parser || src === 'raw' || /^(save|restore|restart|quit|undo|q)$/i.test(cmd.trim())) {
    const c = cmd.trim().toLowerCase();
    if (!/^(g|again)$/.test(c)) S.lastCmd = c;
    zm.provideInput(cmd); pump(); return;
  }
  // try the command; if the game's parser did not understand it, try sensible rewrites.
  // Parser errors do not use up a turn, and every failed try is rolled back completely.
  // with the translation column open, German goes in there and the original line stays English
  const fromTr = src === 'tr', trOpen = !!prefs.trCol;
  const prep = S.parser.prepare(cmd, fromTr ? { force: true } : { german: prefs.germanInput !== false && !trOpen });
  const tries = [prep];
  const snap = { s: zm.snapshot(), pr: zm.pendingRead, u: zm.undoStack.length, upper: JSON.stringify(zm.upper), ul: zm.upperLines, cur: Object.assign({}, zm.cursor), win: zm.curWin, style: zm.style };
  const restore = () => { zm.applySnapshot(snap.s); zm.pendingRead = snap.pr; zm.state = 'input'; zm.undoStack.length = snap.u; zm.upper = JSON.parse(snap.upper); zm.upperLines = snap.ul; zm.cursor = Object.assign({}, snap.cur); zm.curWin = snap.win; zm.style = snap.style; zm.takeOutput(); };
  const severity = o => /That's not a verb I recognise|I didn't understand that sentence/.test(o) ? 3 : ZParse.PARSER_ERR.test(o) ? 2 : 0;
  let chosen = null, best = null;
  for (let k = 0; k < 8 && k < tries.length; k++) {
    const tr = tries[k];
    zm.provideInput(tr.cmd);
    const st = zm.run();
    const out = zm.takeOutput();
    const txt = out.map(o => o.text).join('');
    const sev = severity(txt);
    if (!sev) { chosen = { tr, st, out }; break; }
    if (!best || sev < best.sev) best = { tr, sev };
    if (k === 0) tries.push(...S.parser.alternatives(tr.cmd, { noDe: !fromTr && trOpen }));
    restore();
  }
  if (!chosen) {
    // nothing was understood: play the most helpful version (a missing object beats an unknown verb)
    const tr = best && best.sev < 3 ? best.tr : prep;
    zm.provideInput(tr.cmd); const st = zm.run(); chosen = { tr, st, out: zm.takeOutput(), failed: true };
  }
  const used = chosen.tr.cmd;
  const c = used.trim().toLowerCase();
  if (!/^(g|again)$/.test(c)) S.lastCmd = c;
  if (used.trim().toLowerCase() !== cmd.trim().toLowerCase()) appendNote((chosen.tr.why === 'de' ? T('übersetzt: ') : T('verstanden als: ')) + used);
  pump(chosen);
}
function appendNote(msg) {
  const tr = $('#transcript');
  let block = tr.lastElementChild;
  if (!block || !block.classList.contains('out')) block = newBlock();
  const sp = document.createElement('span'); sp.className = 'parseNote'; sp.textContent = '(' + msg + ')\n';
  block.appendChild(sp);
}
function sendKey(code) {
  const zm = S.zm;
  if (!zm || zm.state !== 'char') return;
  S.lastShownCmd = '';
  zm.provideChar(code);
  pump();
}

// ---------- output rendering ----------
function styleClass(s) { let c = ''; if (s & 1) c += ' rev'; if (s & 2) c += ' b'; if (s & 4) c += ' i'; if (s & 8) c += ' mono'; return c.trim(); }
function newBlock() {
  const b = document.createElement('div'); b.className = 'out';
  if (TTS.ok) {
    const btn = document.createElement('button');
    btn.className = 'say'; btn.type = 'button'; btn.hidden = true;
    btn.title = T('Diesen Abschnitt vorlesen'); btn.setAttribute('aria-label', T('Diesen Abschnitt vorlesen'));
    btn.textContent = '🔊';
    btn.addEventListener('click', e => { e.stopPropagation(); speakBlock(b); });
    b.appendChild(btn);
  }
  $('#transcript').appendChild(b);
  return b;
}
// a quotation box keeps the columns of the status window: take away the common indent and the padding
function dedent(t) {
  const lines = t.split('\n').map(l => l.replace(/\s+$/, ''));
  while (lines.length && !lines[0].trim()) lines.shift();
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
  const ind = Math.min(...lines.filter(l => l.trim()).map(l => l.match(/^ */)[0].length));
  return lines.map(l => l.slice(Number.isFinite(ind) ? ind : 0)).join('\n');
}
function renderOutput(out) {
  if (!out.length) return;
  const tr = $('#transcript');
  let block = tr.lastElementChild;
  if (!block || !block.classList.contains('out')) block = newBlock();
  if (out.some(o => o.text.trim().replace(/^>$/, ''))) { const sb = block.querySelector('.say'); if (sb) sb.hidden = false; }
  for (const o of out) {
    const sp = document.createElement('span');
    const cls = styleClass(o.style); if (cls) sp.className = cls;
    if (o.box) { sp.className = 'quoteBox'; sp.textContent = dedent(o.text); block.appendChild(sp); continue; }
    // lines the game centres with spaces for a fixed-width screen are centred properly here
    const centred = o.text.split('\n').filter(l => /^ {6,}\S/.test(l));
    // only titles and single lines: drawings and tables made of characters keep their columns
    if (centred.length && centred.length <= 4 && centred.every(l => (l.match(/[A-Za-z]/g) || []).length >= 4 && (l.match(/[A-Za-z]/g) || []).length / l.trim().length > .5)) {
      const lines = o.text.split('\n');
      lines.forEach((l, i) => {
        if (/^ {6,}\S/.test(l)) { const c = document.createElement('span'); c.className = 'centerLine'; c.textContent = l.trim(); sp.appendChild(c); }
        else { sp.appendChild(document.createTextNode(l + (i < lines.length - 1 && !(i + 1 < lines.length && /^ {6,}\S/.test(lines[i + 1]) && l === '') ? '\n' : ''))); }
      });
      block.appendChild(sp); continue;
    }
    sp.textContent = o.text;
    block.appendChild(sp);
  }
  while (tr.childElementCount > 600) tr.firstElementChild.remove();
}
function appendCmd(cmd) {
  const tr = $('#transcript');
  let block = tr.lastElementChild;
  if (!block || !block.classList.contains('out')) block = newBlock();
  const sp = document.createElement('span'); sp.className = 'cmdEcho'; sp.textContent = cmd + '\n';
  block.appendChild(sp);
  newBlock();
}
function appendSys(msg) { const d = document.createElement('div'); d.className = 'sys'; d.textContent = msg; $('#transcript').appendChild(d); scrollDown(); }
function scrollDown() { const t = $('#scroll'); t.scrollTop = t.scrollHeight; }

function renderUpper() {
  const zm = S.zm;
  const rows = zm.upperText();
  const big = zm.upperLines > 3;
  const status = $('#status'), overlay = $('#overlay');
  const toHTML = rws => rws.map(r => {
    let h = '', cur = -1, buf = '';
    const flush = () => { if (buf) h += cur ? `<span class="${styleClass(cur)}">${esc(buf)}</span>` : esc(buf); buf = ''; };
    for (const c of r) { if (c.style !== cur) { flush(); cur = c.style; } buf += c.ch; }
    flush(); return h;
  }).join('\n');
  if (big) {
    overlay.hidden = false; overlay.innerHTML = toHTML(rows); status.innerHTML = '';
  } else {
    overlay.hidden = true;
    // right after a quotation the game redraws only the first status row: keep the second one
    let rr = rows;
    if (rows.length === 1 && S.lastStatus && S.lastStatus.length === 2) rr = [rows[0], S.lastStatus[1]];
    else if (rows.length >= 2) S.lastStatus = rows;
    status.innerHTML = rr.length ? toHTML(rr) : '';
  }
  status.classList.toggle('empty', !rows.length || big);
}
function esc(s) { return s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }

// ---------- room tracking ----------
function statusRoom() {
  const zm = S.zm;
  if (!zm || zm.upperLines < 1 || zm.upperLines > 3) return null;
  const rows = zm.upperText();
  if (!rows.length) return null;
  const line = rows[0].map(c => c.ch).join('');
  const name = line.trim().split(/\s{2,}/)[0];
  // right after resuming, Curses may redraw only the second status line: use the room saved with the game
  if (!name || /^score|^moves|^turns|^\(/i.test(name)) return S.resumeRoom || null;
  S.resumeRoom = null;
  return name.trim();
}
function statusRegion() {
  // after a quotation box the game briefly shows only the first status row: keep the last region then
  const r = statusRegion0(), n = statusRoom();
  if (r) { S.lastRegion = { r, n }; return r; }
  return S.lastRegion && n && S.lastRegion.n === n ? S.lastRegion.r : null;
}
function statusRegion0() {
  const zm = S.zm;
  if (!zm || zm.upperLines < 2 || zm.upperLines > 3) return null;
  const rows = zm.upperText();
  if (rows.length < 2) return null;
  const line = rows[1].map(c => c.ch).join('');
  const m = line.match(/\(([^)]+)\)/);
  let r = m ? m[1] : line.trim().split(/\s{2,}/)[0];
  if (!r || /^(score|moves|turns)\b|\d{4}$/i.test(r)) return null;
  r = r.trim().replace(/^in (the )?/i, '');
  return r ? r.charAt(0).toUpperCase() + r.slice(1) : null;
}
function parseDir(cmd) {
  let c = cmd.toLowerCase().replace(/[.,!].*$/, '').trim();
  c = c.replace(/^(go|walk|run|head|move|climb|crawl|swim)\s+/, '').replace(/^(to the|the)\s+/, '').trim();
  if (DIRS[c]) return DIRS[c];
  return null;
}
function detectRoom() {
  const name = statusRoom();
  if (!name) return;
  // only the room description itself, not what the move said before it ("you unbar the door ...")
  let desc = S.turnText || '';
  { const lines = desc.split('\n'); let k = -1; const isHead = l => { l = l.trim(); return l === name || (l.startsWith(name + ' (') && l.endsWith(')')); }; for (let i = lines.length - 1; i >= 0; i--) if (isHead(lines[i])) { k = i; break; } desc = k >= 0 ? lines.slice(k).join('\n') : ''; }
  if (/^darkness$/i.test(name)) { showRoom(name, desc, true); return; }
  const isNew = !S.map.rooms[name];
  const prev = S.cur;
  const region = statusRegion() || (S.map.rooms[name] && S.map.rooms[name].region) || S.curRegion || 'Ohne Region';
  S.curRegion = region;
  if (name !== prev) {
    S.view.sheet = null; S.view.manual = false;   // the map follows you into the new region
    const cmd = S.lastCmd || '';
    const dir = parseDir(cmd);
    // ordinary walking and climbing connect rooms on the map; magic, travel and time jumps do not
    const local = !dir && /^(enter|climb|board|get (in|on|out|off|up)|go |walk |crawl|squeeze|jump|swing|descend|ascend|stand|exit|leave|follow)\b/.test(cmd);
    const noEdge = /^(undo|restore|restart|load|oops)/.test(cmd) || !prev || !S.map.rooms[prev] || (!dir && !local);
    if (isNew) placeRoom(name, noEdge ? null : prev, dir, region);
    else if (S.map.rooms[name].region !== region) assignRegion(name, region);
    if (!noEdge) addEdge(prev, name, dir);
    S.cur = name;
    LS.set('zp:cur:' + S.serial, name);
  }
  const room = S.map.rooms[name];
  if (room && desc && desc.length > (room.dl || 0) && desc.includes(name)) {
    const c = ZArt.classify(name, desc);
    if (!room.cat || (room.dl || 0) < 60) { room.cat = c; room.dl = desc.length; }
  }
  room.visits = (room.visits || 0) + (name !== prev ? 1 : 0);
  saveMap();
  noteEvents(name, S.turnText || '');
  showRoom(name, desc, false);
  renderMap();
}
function occupied(x, y, region, except) { for (const k in S.map.rooms) { const r = S.map.rooms[k]; if (k !== except && (r.region || 'Ohne Region') === region && r.x === x && r.y === y) return true; } return false; }
function assignRegion(name, region) {
  // a room from an older map (or a room that changed region): move it onto that region's sheet
  const r = S.map.rooms[name];
  r.region = region;
  if (!occupied(r.x, r.y, region, name)) return;
  for (let rr = 1; rr < 20; rr++) for (let dx = -rr; dx <= rr; dx++) for (let dy = -rr; dy <= rr; dy++) {
    if (Math.max(Math.abs(dx), Math.abs(dy)) !== rr) continue;
    if (!occupied(r.x + dx, r.y + dy, region, name)) { r.x += dx; r.y += dy; return; }
  }
}
function placeRoom(name, from, dir, region) {
  let x = 0, y = 0;
  const occ = (a, b) => occupied(a, b, region);
  const inRegion = Object.keys(S.map.rooms).filter(k => (S.map.rooms[k].region || 'Ohne Region') === region);
  if (from && S.map.rooms[from] && (S.map.rooms[from].region || 'Ohne Region') === region) {
    const f = S.map.rooms[from], v = VEC[dir] || [0, 1];
    x = f.x + v[0]; y = f.y + v[1];
    if (occ(x, y)) {
      // push further along the direction first, then spiral
      let found = false;
      for (let k = 2; k <= 3 && !found; k++) { const nx = f.x + v[0] * k, ny = f.y + v[1] * k; if (!occ(nx, ny)) { x = nx; y = ny; found = true; } }
      for (let rr = 1; rr < 12 && !found; rr++) for (let dx = -rr; dx <= rr && !found; dx++) for (let dy = -rr; dy <= rr && !found; dy++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== rr) continue;
        if (!occ(f.x + v[0] + dx, f.y + v[1] + dy)) { x = f.x + v[0] + dx; y = f.y + v[1] + dy; found = true; }
      }
    }
  } else if (inRegion.length) {
    // arrival by magic or travel inside a known region: a new group beside what is already drawn
    let maxX = -1e9, minY = 1e9; for (const k of inRegion) { maxX = Math.max(maxX, S.map.rooms[k].x); minY = Math.min(minY, S.map.rooms[k].y); }
    x = maxX + 3; y = minY; while (occ(x, y)) y++;
  }
  S.map.order = (S.map.order || 0) + 1;
  S.map.rooms[name] = { x, y, cat: null, dl: 0, region, order: S.map.order };
}
function addEdge(a, b, dir) {
  if (!a || !b || a === b) return;
  const e = S.map.edges.find(e => (e.a === a && e.b === b) || (e.a === b && e.b === a));
  if (e) { if (!e.dir && dir) { e.dir = dir; e.a = a; e.b = b; } return; }
  S.map.edges.push({ a, b, dir: dir || null });
}
function saveMap() { LS.set('zp:map:' + S.serial, JSON.stringify(S.map)); }

// ---------- room state for the illustrations (read from the object tree, not from the text) ----------
const ATTR = { '16-951024': { open: 14, light: 9, container: 3, transparent: 23, moved: 12, on: 13,
  // property 23 of a thing names the socket it is fixed in (the sceptre in the burial chamber)
  link: 23,
  // parts that vanish from the object tree once they are fitted to something in the room (attribute 8)
  fitted: { 'adamantine statue': ['adamantine hand', 'adamantine skull', 'adamantine heart'] }, fittedAttr: 8 } };   // Curses release 16
// Can the player see inside object o? Only open or transparent containers show their contents.
function contentsVisible(o) {
  const at = ATTR[S.serial], zm = S.zm;
  if (!at) return true;
  return !zm.testAttr(o, at.container) || zm.testAttr(o, at.open) || zm.testAttr(o, at.transparent);
}
// An open container (a cupboard that is open from the start, say) only shows its contents
// in the picture once the game text has actually mentioned them.
function revealed() {
  if (!S.revealed) S.revealed = JSON.parse(LS.get('zp:rev:' + S.serial) || '{}');
  return S.revealed;
}
// Only what the game text has already mentioned may appear in a picture; the rest stays a faint shape.
const STOPW = new Set(['the', 'and', 'with', 'from', 'some', 'old', 'big', 'small', 'large']);
// Words are remembered per room: what was said while you were in that room. Things you have
// carried yourself are known everywhere.
function words() {
  if (!S.words) {
    let o = null; try { o = JSON.parse(LS.get('zp:words:' + S.serial) || 'null'); } catch (e) {}
    S.words = { rooms: {}, held: new Set(o && o.held || []) };
    if (o && o.rooms && !Array.isArray(o)) for (const k in o.rooms) S.words.rooms[k] = new Set(o.rooms[k]);
  }
  return S.words;
}
function saveWords() {
  clearTimeout(S.wordsT);
  S.wordsT = setTimeout(() => { const W = words(), rooms = {}; for (const k in W.rooms) rooms[k] = [...W.rooms[k]]; LS.set('zp:words:' + S.serial, JSON.stringify({ rooms, held: [...W.held] })); }, 400);
}
function addWords(set, text) {
  let n = 0;
  for (const m of (text || '').toLowerCase().matchAll(/[a-z][a-z'-]*/g)) {
    const w = m[0].replace(/'s$/, '').replace(/^'|'$/g, '');
    for (const v of [w, w.replace(/-/g, ''), ...w.split('-')]) if (v.length > 2 && !set.has(v)) { set.add(v); n++; }
  }
  return n;
}
function noteWords(text) {
  const zm = S.zm; if (!zm || !text) return;
  const W = words();
  let loc = ''; try { loc = zm.objName(zm.readVar(17)); } catch (e) {}
  if (!loc) return;
  const room = k => W.rooms[k] || (W.rooms[k] = new Set());
  let n = 0;
  // after a move, what was said before the new room's heading still belongs to the old room
  const prev = S.wordsLoc;
  if (prev && prev !== loc) {
    const lines = text.split('\n'); let k = -1;
    for (let i = 0; i < lines.length; i++) if (lines[i].trim() === loc) { k = i; break; }
    if (k > 0) {
      const pre = lines.slice(0, k).join('\n');
      n += addWords(room(prev), pre); text = lines.slice(k).join('\n');
      // ... except for things that came along ("bounce the beach ball"): those are named here too
      try { const low = pre.toLowerCase(); for (let c = zm.child(zm.readVar(17)), g = 0; c && g < 200; c = zm.sibling(c), g++) { const nm = zm.shownName(c); if (nm && nm.length > 3 && low.includes(nm.toLowerCase())) n += addWords(room(loc), nm); } } catch (e) {}
    }
  }
  n += addWords(room(loc), text);
  S.wordsLoc = loc;
  // what you carry, you know
  try {
    const me = (() => { for (let c = zm.child(zm.readVar(17)), g = 0; c && g < 300; c = zm.sibling(c), g++) if (/^(yourself|self|you|player)$/i.test(zm.objName(c))) return c; return 0; })();
    const walk = (o, d) => { for (let c = zm.child(o), g = 0; c && g < 100; c = zm.sibling(c), g++) { n += addWords(W.held, zm.shownName(c)); if (!heldIds().has(c)) { heldIds().add(c); LS.set('zp:heldids:' + S.serial, JSON.stringify([...heldIds()])); } if (d < 3 && contentsVisible(c)) walk(c, d + 1); } };
    if (me) walk(me, 0);
  } catch (e) {}
  if (n) saveWords();
}
// ---------- things you brought into a room that do not belong there ----------
function heldIds() {
  if (!S.heldIds) { try { S.heldIds = new Set(JSON.parse(LS.get('zp:heldids:' + S.serial) || '[]')); } catch (e) { S.heldIds = new Set(); } }
  return S.heldIds;
}
// where every object starts the game: the room at the top of its parent chain in the story file
function homes() {
  if (S.homes) return S.homes;
  const h = {};
  try {
    const z = new ZM.ZMachine(S.bytes, {});
    for (let o = 1; o < 1000; o++) { let nm; try { nm = z.objName(o); } catch (e) { break; } let r = o, g = 0; while (z.parent(r) && g++ < 20) r = z.parent(r); h[o] = r; }
  } catch (e) {}
  return (S.homes = h);
}
function roomItems() {
  const zm = S.zm; if (!zm || zm.state === 'error') return [];
  const loc = zm.readVar(17); if (!loc) return [];
  if (/^darkness$/i.test(statusRoom() || '')) return [];
  const H = homes(), held = heldIds(), out = [];
  const walk = (o, d) => {
    for (let c = zm.child(o), g = 0; c && g < 200; c = zm.sibling(c), g++) {
      const nm0 = zm.shownName(c), nm = (S.pname && S.pname[c]) || nm0;
      if (/^(yourself|self|you|player)$/i.test(nm0)) continue;
      // Inform marks everything the player has ever picked up as 'moved'; that survives saved games
      const moved = held.has(c) || (ATTR[S.serial] && zm.testAttr(c, ATTR[S.serial].moved ?? 12));
      if (moved && H[c] !== loc && nm) out.push(nm);
      if (d < 3 && contentsVisible(c)) walk(c, d + 1);
    }
  };
  walk(loc, 0);
  return out;
}
function renderRoomItems() {
  let box = $('#roomItems');
  if (!box) { box = document.createElement('div'); box.id = 'roomItems'; $('#picWrap').appendChild(box); }
  const items = roomItems(), sig = items.join('|');
  if (sig === box.dataset.sig) return;
  box.dataset.sig = sig;
  const q = s => esc(String(s)).replace(/"/g, '&quot;');
  box.innerHTML = items.map(n => `<span class="riItem" data-item="${q(n)}" title="${q(n)} · ${q(T('von dir hierher gebracht'))}"><span class="ico">${ZIcons.icon(n)}</span><span class="nm">${esc(n)}</span></span>`).join('');
  box.dataset.label = T('Hier abgelegt:');
  box.hidden = !items.length;
}
// The words to type for an object the player sees under the name `name`: only words the parser
// knows for exactly that object ("Volume II of the Family History" → "volume ii history").
function nounFor(name) {
  const zm = S.zm; if (!zm || !name) return name;
  const want = String(name).toLowerCase().trim();
  let found = 0;
  // the rods are typed as "rod of fire"
  if (/^(high )?rod of [a-z]+$/.test(want)) return want;
  const pn = S.pname || {};
  const walk = (o, d) => { for (let c = zm.child(o), g = 0; c && g < 300 && !found; c = zm.sibling(c), g++) { if (zm.shownName(c).toLowerCase().trim() === want || (pn[c] || '').toLowerCase() === want) { found = c; return; } if (d < 5) walk(c, d + 1); } };
  try { walk(zm.readVar(17), 0); } catch (e) {}
  if (!found) { const S2 = want.split(/\s+/).filter(w => !/^(a|an|the|of|some)$/.test(w)); return S2.slice(-2).join(' ') || name; }
  const dict = new Set(zm.nameWords(found).map(w => w.toLowerCase()));
  const words = want.replace(/[^a-z0-9' ]/g, ' ').split(/\s+/).filter(Boolean);
  // the rods carry a one-word name ("Fire") and are typed as "rod of fire"
  if (words.length === 1 && dict.has('rod') && !dict.has(words[0])) return 'rod of ' + words[0];
  // dictionary words are cut to the story's word length (9 letters in Curses): compare that way
  const cut = w => w.slice(0, 9);
  const dcut = new Set([...dict].map(cut));
  const pick = words.filter(w => dcut.has(cut(w)));
  if (pick.length) return pick.join(' ');
  const real = [...dict].filter(w => /^[a-z]+$/.test(w) && !/^z+$/.test(w) && w.length < 9);
  return real.length > 1 ? real[0] + ' ' + real[real.length - 1] : (real[0] || [...dict][0] || name);
}
function mentionedIn(roomName, key) {
  const W = words(), R = W.rooms[roomName] || new Set();
  const parts = String(key).toLowerCase().split(/[^a-z]+/).filter(w => w.length > 2 && !STOPW.has(w));
  if (!parts.length) return true;
  const has = w => [w, w.replace(/(es|s)$/, ''), w + 's', w + 'es'].some(v => R.has(v) || W.held.has(v));
  return parts.every(has) || (parts.length > 1 && has(parts.join('')));
}
function mentioned(key) { let loc = ''; try { loc = S.zm.objName(S.zm.readVar(17)); } catch (e) {} return mentionedIn(loc, key); }
function hiddenInside(o) {
  const at = ATTR[S.serial], zm = S.zm;
  if (!at || !zm.testAttr(o, at.container) || zm.testAttr(o, at.transparent) || !zm.child(o)) return false;
  return !revealed()[zm.objName(o).toLowerCase()];
}
function noteReveals(text) {
  const zm = S.zm, at = ATTR[S.serial];
  if (!zm || !at || !text) return;
  const low = text.toLowerCase(), rev = revealed();
  const g = zm.readVar(17); if (!g) return;
  let changed = false;
  const walk = (o, depth) => {
    for (let c = zm.child(o), n = 0; c && n < 200; c = zm.sibling(c), n++) {
      const nm = zm.shownName(c).toLowerCase();
      if (nm && zm.testAttr(c, at.container) && zm.child(c) && !rev[nm] && contentsVisible(c)) {
        let hit = low.includes('in the ' + nm) || low.includes('inside the ' + nm);
        for (let k = zm.child(c); k && !hit; k = zm.sibling(k)) { const kn = zm.objName(k).toLowerCase(); if (kn && kn.length > 2 && low.includes(kn)) hit = true; }
        if (hit) { rev[nm] = true; changed = true; }
      }
      if (depth < 4 && contentsVisible(c)) walk(c, depth + 1);
    }
  };
  walk(g, 0);
  if (changed) LS.set('zp:rev:' + S.serial, JSON.stringify(rev));
}
function findLocation(name) {
  const zm = S.zm;
  const g = zm.readVar(17);
  if (g && zm.objName(g) === name) return g;
  if (S.locCache && S.locCache[name] && zm.parent(S.locCache[name]) === 0) return S.locCache[name];
  // search top-level objects with that name that contain the player-ish object
  let best = 0;
  for (let o = 1; o < 2000; o++) {
    let a; try { a = zm.objAddr(o); } catch (e) { break; }
    if (a + 14 > zm.m.length) break;
    if (zm.parent(o) !== 0) continue;
    let nm = ''; try { nm = zm.objName(o); } catch (e) { break; }
    if (nm === name) { best = o; if (zm.child(o)) break; }
  }
  S.locCache = S.locCache || {}; if (best) S.locCache[name] = best;
  return best;
}
// an object's number by its name in the story file (looked up once)
function objByName(n) {
  const zm = S.zm, c = S.objIds = S.objIds || {};
  if (!(n in c)) { c[n] = 0; for (let o = 1; o < 600; o++) { let nm = ''; try { nm = zm.objName(o); } catch (e) { break; } if (nm === n) { c[n] = o; break; } } }
  return c[n];
}
function roomState(name) {
  const zm = S.zm;
  if (!zm) return null;
  try {
    const loc = findLocation(name);
    if (!loc) return null;
    const at = ATTR[S.serial];
    const here = [], open = [], carried = [], on = [], moved = [], inside = {}, links = {}, fitted = {};
    const isPlayer = o => /^(yourself|self|you|player)$/i.test(zm.objName(o));
    const walk = (o, into, depth) => {
      for (let c = zm.child(o), n = 0; c && n < 200; c = zm.sibling(c), n++) {
        const nm = zm.shownName(c);
        if (isPlayer(c)) { walk(c, carried, depth + 1); continue; }
        const hid = false; // contents of open containers show as faint shapes until the text mentions them
        if (nm && at && at.link && into === here && zm.findProp(c, at.link)) { const v = zm.getProp(c, at.link); if (v > 0 && v < 1024 && /socket/i.test(zm.objName(v))) links[nm] = zm.shownName(v); }
        if (nm && at && at.fitted && at.fitted[zm.objName(c)]) fitted[nm] = at.fitted[zm.objName(c)].filter(pn => { const o = objByName(pn); return o && !zm.parent(o) && zm.testAttr(o, at.fittedAttr); });
        if (nm) { into.push(nm); if (at && zm.testAttr(c, at.open) && !hid) open.push(nm); if (at && at.on && zm.testAttr(c, at.on)) on.push(nm); if (at && at.moved && into === here && zm.testAttr(c, at.moved)) moved.push(nm); if (into === here && o !== loc) { const pn = zm.shownName(o); (inside[pn] = inside[pn] || []).push(nm); } }
        if (depth < 4 && contentsVisible(c) && !hid) walk(c, into, depth + 1);
      }
    };
    walk(loc, here, 0);
    const roomKey = zm.objName(loc), known = k => mentionedIn(roomKey, k);
    const sig = here.join('|') + '#' + open.join('|') + '#' + on.join('|') + '#' + JSON.stringify(inside) + JSON.stringify(links) + JSON.stringify(fitted) + moved.join(',') + '#' + (S.lastTagKeys || []).concat(here).map(k => known(k) ? 1 : 0).join('');
    return { here, open, carried, on, moved, inside, links, fitted, mentioned: known, sig };
  } catch (e) { return null; }
}

// ---------- illustration ----------
let shownKey = null;
// the last description seen of each room: the generic pictures are drawn from it
function roomDesc(name, desc) {
  if (!S.descs) { try { S.descs = JSON.parse(LS.get('zp:desc:' + S.serial) || '{}') || {}; } catch (e) { S.descs = {}; } }
  const core = t => (window.ZGenText ? ZGenText.clean(t || '') : (t || '')).length;
  // a brief revisit prints only the heading and what lies about: keep the room's own paragraph from before
  if (desc && S.descs[name]) {
    const nl = desc.split('\n'), ol = S.descs[name].split('\n');
    if (nl.length > 2 && nl[1].trim() === '' && ol[1] && ol[1].trim()) { desc = [nl[0], ol[1]].concat(nl.slice(1)).join('\n'); }
  }
  if (desc && desc.length > 40 && (!S.descs[name] || core(desc) >= core(S.descs[name]) * .6)) {
    const d = desc.slice(0, 1800);
    if (S.descs[name] !== d) { S.descs[name] = d; clearTimeout(S.descT); S.descT = setTimeout(() => LS.set('zp:desc:' + S.serial, JSON.stringify(S.descs)), 500); }
    return desc;
  }
  return S.descs[name] || desc;
}
// Some changes the game only reports in the answer to an action, and puts into the room's description
// at the next look. When such an answer has been printed, the room's stored description takes in the
// sentence the game itself will use for it, so the picture follows at once.
const EVENTS = [
  // the sentence the game has just printed (found by a few words) is added to the stored description,
  // so the picture keeps showing what happened; no game text is kept in the page itself
  { room: /^Croquet Lawn$/, when: /tiny gap through the hedge/i },
  { room: /^The Spirit World$/, when: /entrance bursts open/i },
  // the bird whistle: the sparrows swoop onto the roof and then take to the skies
  { room: /^Summer House$/, when: /take to the skies/i, drop: /Sparrows chirp happily[^.]*\.\s*/ }
];
// the whole sentence (or the two around an exclamation) in which a match was found
function sentenceAt(text, re) {
  const m = re.exec(text); if (!m) return '';
  const t = text.replace(/\s+/g, ' '), i = t.search(re); if (i < 0) return '';
  let a = i; while (a > 0 && !/[.!?]/.test(t[a - 1])) a--;
  let b = i + m[0].length; while (b < t.length && !/[.!?]/.test(t[b])) b++;
  // an exclamation is often followed by its consequence: keep the next sentence too
  if (t[b] === '!') { b++; while (b < t.length && !/[.!?]/.test(t[b])) b++; }
  return t.slice(a, b + 1).trim();
}
function noteEvents(name, text) {
  if (!text || !name) return;
  roomDesc(name, '');
  const cur = S.descs && S.descs[name]; if (!cur) return;
  let d = cur;
  for (const e of EVENTS) { if (!e.room.test(name) || !e.when.test(text)) continue; const add = sentenceAt(text, e.when); if (!add || d.includes(add)) continue; if (e.drop) d = d.replace(e.drop, ''); d = d.replace(/\s*(\n>\s*)?$/, '') + '\n\n' + add; }
  if (d !== cur) { S.descs[name] = d; LS.set('zp:desc:' + S.serial, JSON.stringify(S.descs)); }
}
function showRoom(name, desc, dark) {
  if (!dark) desc = roomDesc(name, desc);
  const room = S.map.rooms[name];
  const cat = dark ? 'darkness' : (room && room.cat) || ZArt.classify(name, desc);
  const st = dark ? null : roomState(name);
  let wn = 0; try { const R = words().rooms[name]; wn = R ? R.size : 0; } catch (e) {}
  // new words in the room's text can change what the picture may show
  const key = name + '|' + cat + '|' + (st ? st.sig : '') + '|' + (desc || '').length + '|' + wn;
  const sc = ZArt.scene(name, desc, cat, st);
  S.lastTagKeys = [...new Set([...sc.svg.matchAll(/data-k="([^"]+)"/g)].map(m => m[1]))];
  const mood = ZMusic.moodFor(name, cat, S.curRegion);
  S.music.setMood(mood, dark ? 'dark' : name);
  $('#moodChip').textContent = '♪ ' + T(moodLabel(mood));
  if (key === shownKey) return;
  shownKey = key;
  const frame = $('#pic');
  const layer = document.createElement('div');
  layer.className = 'layer'; layer.innerHTML = sc.svg;
  frame.appendChild(layer);
  requestAnimationFrame(() => requestAnimationFrame(() => layer.classList.add('on')));
  setTimeout(() => layer.classList.add('on'), 60);
  const olds = [...frame.querySelectorAll('.layer')].slice(0, -1);
  setTimeout(() => olds.forEach(o => o.remove()), 1300);
  $('#roomName').textContent = dark ? T('Dunkelheit') : name;
}

// ---------- read aloud (speech synthesis, only on click) ----------
const TTS = { ok: typeof window.speechSynthesis !== 'undefined' && typeof window.SpeechSynthesisUtterance !== 'undefined', cur: null, token: 0, voices: [] };
function blockText(block) {
  let s = '';
  for (const n of block.childNodes) {
    if (n.nodeType !== 1 || n.classList.contains('say') || n.classList.contains('cmdEcho')) continue;
    s += n.textContent;
  }
  return s.split('\n').filter(l => l.trim() !== '>' ).join('\n')
    .replace(/^\s*>\s*$/gm, '').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
}
// Lines without closing punctuation (a room name, a title) are spoken as utterances of their own,
// with a full stop, so that the voice pauses before the text goes on.
function chunkText(text) {
  const out = []; let cur = '';
  const flush = () => { if (cur) { out.push(cur); cur = ''; } };
  for (const para of text.split(/\n\s*\n/)) {
    for (const line of para.split('\n')) {
      const l = line.replace(/\s+/g, ' ').trim(); if (!l) continue;
      if (l.length <= 80 && !/[.!?…:;,"'”’)\]]$/.test(l)) { flush(); out.push(l + '.'); continue; }
      for (const p of l.split(/(?<=[.!?…:;])\s+/).filter(Boolean)) {
        if ((cur + ' ' + p).length > 220 && cur) { out.push(cur); cur = p; } else cur = cur ? cur + ' ' + p : p;
      }
    }
    flush();
  }
  return out;
}
function pickVoice() {
  const uri = $('#voiceSel') && $('#voiceSel').value;
  return TTS.voices.find(v => v.voiceURI === uri) || TTS.voices.find(v => /^en/i.test(v.lang)) || null;
}
function speakBlock(block) { speakText(blockText(block), null, block); }
// a voice for another language (the translation): a saved choice, else the best one the system has
function pickVoiceFor(lang) {
  const l = String(lang || '').slice(0, 2).toLowerCase();
  const saved = LS.get('zp:voice:' + l);
  const of = TTS.voices.filter(v => v.lang.toLowerCase().startsWith(l));
  return TTS.voices.find(v => v.voiceURI === saved) || of.find(v => /natural|premium|enhanced|neural/i.test(v.name)) || of.find(v => /google/i.test(v.name)) || of[0] || null;
}
// read a text aloud; el is the element that is marked while it is read (a second click stops)
function speakText(text, lang, el) {
  if (!TTS.ok) return false;
  if (el && TTS.cur === el) { stopSpeech(); return true; }
  stopSpeech();
  { const P = window.ZFeat ? ZFeat.prefs() : {}; if (P.sayBrackets === false) text = text.replace(/\[[^\]]*\]/g, ' ').replace(/[ \t]+/g, ' ').trim(); }
  if (!text) return false;
  const token = ++TTS.token;
  const chunks = chunkText(text);
  const voice = lang ? pickVoiceFor(lang) : pickVoice(), rate = parseFloat(($('#rateSel') || {}).value || '1');
  TTS.cur = el || document.body; if (el) el.classList.add('speaking');
  updateSayUI(true); S.music.duck(true);
  chunks.forEach((c, i) => {
    const u = new SpeechSynthesisUtterance(c);
    if (voice) { u.voice = voice; u.lang = voice.lang; } else u.lang = lang || 'en-GB';
    u.rate = rate;
    if (i === chunks.length - 1) u.onend = u.onerror = () => { if (token === TTS.token) finishSpeech(); };
    speechSynthesis.speak(u);
  });
  return !!voice || !lang;
}
function finishSpeech() {
  if (TTS.cur) TTS.cur.classList.remove('speaking');
  TTS.cur = null; updateSayUI(false); S.music.duck(false);
}
function stopSpeech() {
  if (!TTS.ok) return;
  TTS.token++;
  if (speechSynthesis.speaking || speechSynthesis.pending) speechSynthesis.cancel();
  finishSpeech();
}
function lastTextBlock() {
  const blocks = [...document.querySelectorAll('#transcript .out')].reverse();
  return blocks.find(b => blockText(b)) || null;
}
function updateSayUI(on) {
  const b = $('#sayBtn'); if (!b) return;
  b.classList.toggle('on', on); b.textContent = on ? T('■ Stopp') : T('🔊 Vorlesen');
  b.title = on ? T('Vorlesen beenden') : T('Letzte Antwort des Spiels vorlesen');
}
function loadVoices() {
  if (!TTS.ok) return;
  TTS.voices = speechSynthesis.getVoices();
  setTimeout(loadTrVoices, 0);
  const sel = $('#voiceSel'); if (!sel) return;
  const saved = LS.get('zp:voice');
  const sorted = TTS.voices.slice().sort((a, b) => (/^en/i.test(b.lang) - /^en/i.test(a.lang)) || a.lang.localeCompare(b.lang) || a.name.localeCompare(b.name));
  sel.innerHTML = '';
  if (!sorted.length) { const o = document.createElement('option'); o.textContent = 'Standardstimme'; o.value = ''; sel.appendChild(o); return; }
  for (const v of sorted) { const o = document.createElement('option'); o.value = v.voiceURI; o.textContent = v.name.replace(/^(Microsoft|Google)\s+/, '') + ' (' + v.lang + ')'; sel.appendChild(o); }
  const def = sorted.find(v => v.voiceURI === saved) || sorted.find(v => /^en-GB/i.test(v.lang)) || sorted.find(v => /^en/i.test(v.lang)) || sorted[0];
  sel.value = def.voiceURI;
}
// the voice list for the translation, for the language the translation column is set to
function loadTrVoices() {
  const sel = $('#voiceTrSel'); if (!sel || !TTS.ok) return;
  const P = window.ZFeat ? ZFeat.prefs() : {}; const l = (P.trTarget || 'de').slice(0, 2);
  const of = TTS.voices.filter(v => v.lang.toLowerCase().startsWith(l));
  sel.innerHTML = '';
  const auto = document.createElement('option'); auto.value = ''; auto.textContent = of.length ? T('automatisch') : T('keine Stimme für diese Sprache'); sel.appendChild(auto);
  for (const v of of) { const o = document.createElement('option'); o.value = v.voiceURI; o.textContent = v.name.replace(/^(Microsoft|Google)\s+/, '') + ' (' + v.lang + ')'; sel.appendChild(o); }
  sel.value = LS.get('zp:voice:' + l) || '';
  sel.onchange = () => LS.set('zp:voice:' + l, sel.value);
}
function initSpeech() {
  if (!TTS.ok) { document.querySelectorAll('.ttsOnly').forEach(e => e.hidden = true); return; }
  loadVoices();
  speechSynthesis.addEventListener ? speechSynthesis.addEventListener('voiceschanged', loadVoices) : (speechSynthesis.onvoiceschanged = loadVoices);
  $('#sayBtn').onclick = () => { if (TTS.cur) stopSpeech(); else { const b = lastTextBlock(); if (b) speakBlock(b); } };
  $('#voiceSel').addEventListener('change', e => LS.set('zp:voice', e.target.value));
  const rs = $('#rateSel'); rs.value = LS.get('zp:rate') || '1';
  rs.addEventListener('change', e => LS.set('zp:rate', e.target.value));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && TTS.cur) stopSpeech(); });
  window.addEventListener('pagehide', () => speechSynthesis.cancel());
}

// ---------- optional hints (own wording, checked in the interpreter) ----------
const HINTS = [
  { area: 'Allgemein', items: [
    { q: 'Wie gebe ich Befehle ein?', s: [
      'Das Spiel versteht englische Befehle in der Form „Verb Gegenstand“, also zum Beispiel <code>take book</code> oder <code>open door</code>.',
      'Die wichtigsten Kürzel: <code>l</code> (look, Raum ansehen), <code>x ding</code> (examine, untersuchen), <code>i</code> (Inventar), Richtungen als <code>n s e w ne nw se sw u d in out</code>.',
      'Untersuche alles, was im Text vorkommt. In Curses stecken die Hinweise fast immer in den Beschreibungen. Mit <code>undo</code> nimmst du einen Zug zurück.'] },
    { q: 'Kann ich mich festspielen?', s: [
      'Ja. Curses gilt als gnadenlos: Man kann sich den Sieg verbauen, ohne es sofort zu merken.',
      'Speichere regelmäßig und nutze dafür abwechselnd die drei Speicherplätze oben. Dann kannst du zu einem älteren Stand zurück, falls du in einer Sackgasse steckst.'] },
    { q: 'Wo ist es zu dunkel?', s: [
      'Du trägst von Anfang an eine Taschenlampe bei dir.',
      'Mit <code>turn on torch</code> schaltest du sie ein. Dunkle Ecken des Dachbodens werden damit sichtbar.'] }
  ] },
  { area: 'Dachboden', items: [
    { q: 'Soll ich durch die offene Falltür nach unten?', s: [
      'Denk daran, wer unten ist: die Familie, mitten im Kofferpacken.',
      'Wer durch die Falltür hinuntergeht, gibt die Suche auf, und das Spiel ist sofort zu Ende. Bleib oben und such einen anderen Weg.'] },
    { q: 'Wie komme ich sonst vom Dachboden weg?', s: [
      'Es gibt noch einen Weg nach unten, der eigentlich nicht für Menschen gedacht ist.',
      'Schau dich im Lagerraum östlich der alten Weinkammer um. Dort hängt etwas in einem Schacht.',
      'Steig in den Speiseaufzug (<code>enter dumbwaiter</code>) und zieh an den Seilen (<code>pull ropes</code>). Die Fahrt ist ruppig, endet aber im Keller.'] },
    { q: 'Das große Rad im Lagerraum dreht sich nicht.', s: [
      'Mit roher Kraft kommst du hier nicht weiter. Sieh es dir genauer an.',
      'Beim Untersuchen (<code>x wheel</code>) entdeckst du eine schlecht versteckte Sicherung am Rad. Der Schraubenschlüssel daneben passt übrigens nicht darauf.'] },
    { q: 'Wozu ist das kleine Buch im Dienstbotenzimmer?', s: [
      'Nimm es und lies es.',
      'Es ist ein Nachschlagewerk zur klassischen Mythologie. Behalte es: Wenn dir später Götter und Sagengestalten begegnen, kannst du darin nachschlagen.'] },
    { q: 'Der Glasballon mit dem Stadtplan geht nicht auf.', s: [
      'Mit Gewalt geht es nicht. Er ist aus robustem Laborglas und steht fest am Boden.',
      'Lies das Etikett. Wie du an den Inhalt kommst, löst sich erst später im Spiel. Ausführliche Hinweise dazu findest du unten unter „Mehr Hilfe“.'] }
  ] },
  { area: 'Keller', items: [
    { q: 'Was hat es mit dem Roboter in der Ecke auf sich?', s: [
      'Untersuch ihn genau. Jemand hat sich vor Kurzem an ihm zu schaffen gemacht.',
      'Du kannst die Robotermaus mitnehmen (<code>take mouse</code>). Sie einfach in das Loch im Südkeller zu stecken, bringt allerdings noch nichts. Behalte sie im Hinterkopf.'] },
    { q: 'Die eisenbeschlagene Tür im Westkeller ist verschlossen.', s: [
      'Ja, sie ist abgeschlossen. Erinnerst du dich an einen Schlüssel, der irgendwo hinuntergefallen ist?',
      'Für diese Tür findest du ausführliche Hinweise unter „Mehr Hilfe“. Ein Tipp vorweg: Das Fensterchen im Hauptkeller verrät beim Untersuchen einen goldenen Schimmer.'] },
    { q: 'Gibt es im Spiel selbst eine Auskunft?', s: [
      'Ja, und zwar an einem Ort, den man nicht unbedingt freiwillig betritt.',
      'Die goldene Treppe im Westkeller (<code>s</code>) führt hinab zu einem sehr höflichen Dämon mit einem Auskunftsschalter.',
      'Frag ihn mit <code>ask demon about …</code>. Pro Besuch gibt es nur einen Hinweis. Für den nächsten musst du einmal hinausgehen und wiederkommen. Nicht jedes Thema darf er beantworten.'] }
  ] }
];
function renderHints() {
  const box = $('#hintList'); if (!box || box.dataset.done) return;
  box.dataset.done = '1';
  let html = '';
  for (const sec of HINTS) {
    html += `<h3>${T(sec.area)}</h3>`;
    for (const it of sec.items) {
      html += `<details class="hq"><summary>${T(it.q)}</summary><div class="steps">${it.s.map((s, i) => `<div class="hstep"><button type="button" data-step="${i}" ${i ? 'hidden' : ''}>${T('Stufe')} ${i + 1}${i === it.s.length - 1 && i > 0 ? T(' (Lösung)') : ''}</button><p hidden>${T(s)}</p></div>`).join('')}</div></details>`;
    }
  }
  box.innerHTML = html;
  box.addEventListener('click', e => {
    const b = e.target.closest('button[data-step]'); if (!b) return;
    const st = b.parentElement; st.querySelector('p').hidden = false; b.hidden = true;
    const next = st.nextElementSibling; if (next) next.querySelector('button').hidden = false;
  });
}
function initHelp() {
  const m = $('#helpModal');
  $('#helpBtn').onclick = () => { renderHints(); m.hidden = false; $('#helpClose').focus(); };
  $('#helpClose').onclick = () => { m.hidden = true; $('#cmd').focus(); };
  m.addEventListener('click', e => { if (e.target === m) { m.hidden = true; } });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !m.hidden) { m.hidden = true; e.stopPropagation(); } }, true);
}

// ---------- minimap: one sheet per region, as you would draw it on paper ----------
const regionOf = n => (S.map.rooms[n] && S.map.rooms[n].region) || 'Ohne Region';
function sheets() {
  // regions; the Tarot box and dreams hold several separate worlds, split those by connected paths
  const rooms = S.map.rooms, byRegion = {};
  for (const n in rooms) (byRegion[regionOf(n)] = byRegion[regionOf(n)] || []).push(n);
  const sheetOf = {}, list = [];
  for (const r in byRegion) {
    const ns = byRegion[r];
    if (/tarot|dream/i.test(r)) {
      const adj = {}; ns.forEach(n => adj[n] = []);
      for (const e of S.map.edges) if (adj[e.a] && adj[e.b]) { adj[e.a].push(e.b); adj[e.b].push(e.a); }
      const seen = new Set(), comps = [];
      for (const n of ns) { if (seen.has(n)) continue; const c = [], st = [n]; seen.add(n); while (st.length) { const x = st.pop(); c.push(x); for (const y of adj[x]) if (!seen.has(y)) { seen.add(y); st.push(y); } } comps.push(c); }
      comps.sort((a, b) => Math.min(...a.map(n => rooms[n].order || 0)) - Math.min(...b.map(n => rooms[n].order || 0)));
      comps.forEach((c, k) => { const id = comps.length > 1 ? r + ' · ' + (k + 1) : r; c.forEach(n => sheetOf[n] = id); list.push({ id, rooms: c }); });
    } else { ns.forEach(n => sheetOf[n] = r); list.push({ id: r, rooms: ns }); }
  }
  list.sort((a, b) => Math.min(...a.rooms.map(n => rooms[n].order || 0)) - Math.min(...b.rooms.map(n => rooms[n].order || 0)));
  return { sheetOf, list };
}
const sheetName = id => (S.map.sheetNames && S.map.sheetNames[id]) || T(id);
function renderMap() {
  const svg = $('#mapSvg');
  const rooms = S.map.rooms;
  if (!Object.keys(rooms).length) { svg.innerHTML = `<text x="0" y="0" text-anchor="middle" class="mapEmpty">${T('Die Karte zeichnet sich, sobald du dich bewegst.')}</text>`; svg.setAttribute('viewBox', '-160 -40 320 80'); $('#sheetBtn').textContent = T('Karte'); return; }
  const { sheetOf, list } = sheets();
  S.sheetCache = { sheetOf, list };
  const sheet = S.view.sheet || sheetOf[S.cur] || (list[0] && list[0].id);
  S.view.curSheet = sheet;
  const names = Object.keys(rooms).filter(n => sheetOf[n] === sheet);
  $('#sheetBtn').innerHTML = `${esc(sheetName(sheet))} <span class="cnt">${names.length}</span> ▾`;
  let h = '';
  const P = n => [rooms[n].x * CELLX, rooms[n].y * CELLY];
  const stubs = {};
  for (const e of S.map.edges) {
    if (!rooms[e.a] || !rooms[e.b]) continue;
    const ia = sheetOf[e.a] === sheet, ib = sheetOf[e.b] === sheet;
    if (ia && ib) {
      const [x1, y1] = P(e.a), [x2, y2] = P(e.b);
      const vertical = e.dir === 'u' || e.dir === 'd';
      const dashed = !e.dir || e.dir === 'in' || e.dir === 'out';
      h += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="edge${dashed ? ' dash' : ''}${vertical ? ' vert' : ''}"/>`;
      if (vertical || e.dir === 'in' || e.dir === 'out') {
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
        const lab = { u: '↑', d: '↓', in: T('rein'), out: T('raus') }[e.dir];
        h += `<g class="elab"><rect x="${mx - 15}" y="${my - 8}" width="30" height="16" rx="8"/><text x="${mx}" y="${my + 4}" text-anchor="middle">${lab}</text></g>`;
      }
    } else if (ia || ib) {
      // a path leaving this sheet: a small signpost to the other map instead of a long line
      const here = ia ? e.a : e.b, other = ia ? e.b : e.a;
      const d = e.dir ? (ia ? e.dir : ({ n: 's', s: 'n', e: 'w', w: 'e', ne: 'sw', sw: 'ne', nw: 'se', se: 'nw', u: 'd', d: 'u', in: 'out', out: 'in' }[e.dir])) : null;
      const key = here + '|' + sheetOf[other];
      if (stubs[key]) continue; stubs[key] = 1;
      const v = VEC[d] || [0, 1];
      const [x, y] = P(here), sx = x + v[0] * CELLX * .62, sy = y + v[1] * CELLY * .62 + (v[1] === 0 ? 0 : v[1] * 4);
      const lab = '→ ' + sheetName(sheetOf[other]);
      const w = Math.min(150, 14 + lab.length * 6.2);
      h += `<line x1="${x}" y1="${y}" x2="${sx}" y2="${sy}" class="edge stubl"/><g class="stub" data-sheet="${esc(sheetOf[other])}" data-room="${esc(other)}"><title>${esc(other)} (${esc(sheetName(sheetOf[other]))})</title><rect x="${sx - w / 2}" y="${sy - 10}" width="${w}" height="20" rx="10"/><text x="${sx}" y="${sy + 4}" text-anchor="middle">${esc(lab.length > 24 ? lab.slice(0, 23) + '…' : lab)}</text></g>`;
    }
  }
  for (const n of names) {
    const [x, y] = P(n), cur = n === S.cur;
    const label = n.length > 18 ? n.slice(0, 17) + '…' : n;
    const cat = rooms[n].cat || 'interior';
    const hasNote = S.notes && S.notes.rooms && S.notes.rooms[n] && S.notes.rooms[n].trim();
    h += `<g class="node${cur ? ' cur' : ''} c-${cat}" data-n="${esc(n)}"><title>${esc(n)}${hasNote ? ' – ' + esc(S.notes.rooms[n].slice(0, 120)) : ''}
${esc(T('Ziehen zum Verschieben'))}</title><rect x="${x - 56}" y="${y - 16}" width="112" height="32" rx="7"/><text x="${x}" y="${y + 4}" text-anchor="middle">${esc(label)}</text>${hasNote ? `<circle cx="${x + 52}" cy="${y - 13}" r="7" class="noteDot"/><text x="${x + 52}" y="${y - 9.5}" text-anchor="middle" class="noteDotT">✎</text>` : ''}</g>`;
  }
  svg.innerHTML = h;
  updateView();
  if (!$('#sheetMenu').hidden) renderSheetMenu();
}
function renderSheetMenu() {
  const m = $('#sheetMenu'), c = S.sheetCache; if (!c) return;
  const curSheet = c.sheetOf[S.cur];
  m.innerHTML = c.list.map(s => `<div class="shRow${s.id === S.view.curSheet ? ' sel' : ''}"><button class="shGo" data-sheet="${esc(s.id)}">${s.id === curSheet ? '● ' : ''}${esc(sheetName(s.id))} <span class="cnt">${s.rooms.length}</span></button><button class="shRen" data-ren="${esc(s.id)}" title="${T('Umbenennen')}" aria-label="${T('Umbenennen')}">✎</button></div>`).join('') + `<p class="shHint">${T('● = hier bist du gerade')}</p>`;
}
function showSheet(id, room) {
  S.view.sheet = id; S.view.manual = !!room;
  if (room && S.map.rooms[room]) { S.view.x = S.map.rooms[room].x * CELLX; S.view.y = S.map.rooms[room].y * CELLY; }
  else S.view.manual = false;
  $('#sheetMenu').hidden = true;
  renderMap();
}
function updateView() {
  const svg = $('#mapSvg'), box = svg.getBoundingClientRect();
  const w = (box.width || 300) / S.view.z, hh = (box.height || 200) / S.view.z;
  const sheet = S.view.curSheet, c = S.sheetCache;
  if (!S.view.manual) {
    if (S.cur && S.map.rooms[S.cur] && c && c.sheetOf[S.cur] === sheet) { S.view.x = S.map.rooms[S.cur].x * CELLX; S.view.y = S.map.rooms[S.cur].y * CELLY; }
    else if (c) { const ns = Object.keys(S.map.rooms).filter(n => c.sheetOf[n] === sheet); if (ns.length) { S.view.x = ns.reduce((a, n) => a + S.map.rooms[n].x, 0) / ns.length * CELLX; S.view.y = ns.reduce((a, n) => a + S.map.rooms[n].y, 0) / ns.length * CELLY; } }
  }
  svg.setAttribute('viewBox', `${S.view.x - w / 2} ${S.view.y - hh / 2} ${w} ${hh}`);
}
function initMapControls() {
  const svg = $('#mapSvg');
  let drag = null;
  // drag the background to pan; drag a room to move it (it snaps to a half-cell grid)
  svg.addEventListener('pointerdown', e => {
    const node = e.target.closest('.node');
    const n = node && node.dataset.n, r = n && S.map.rooms[n];
    drag = { x: e.clientX, y: e.clientY, vx: S.view.x, vy: S.view.y, room: r ? n : null, ox: r ? r.x : 0, oy: r ? r.y : 0, moved: false };
    svg.setPointerCapture(e.pointerId);
  });
  svg.addEventListener('pointermove', e => {
    if (!drag) return;
    const box = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal;
    const k = vb && box.width ? vb.width / box.width : 1 / S.view.z;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) drag.moved = true;
    if (!drag.moved) return;
    S.view.manual = true;
    if (drag.room) {
      const r = S.map.rooms[drag.room]; if (!r) return;
      const nx = Math.round((drag.ox + dx * k / CELLX) * 2) / 2, ny = Math.round((drag.oy + dy * k / CELLY) * 2) / 2;
      if (nx !== r.x || ny !== r.y) { r.x = nx; r.y = ny; r.pinned = true; svg.classList.add('dragging'); renderMap(); }
    } else { S.view.x = drag.vx - dx * k; S.view.y = drag.vy - dy * k; updateView(); }
  });
  const endDrag = () => { if (drag && drag.room && drag.moved) saveMap(); svg.classList.remove('dragging'); if (drag && drag.moved) S.suppressMapClick = true; drag = null; setTimeout(() => { S.suppressMapClick = false; }, 0); };
  svg.addEventListener('pointerup', endDrag); svg.addEventListener('pointercancel', endDrag);
  svg.addEventListener('wheel', e => { e.preventDefault(); S.view.z = Math.max(.35, Math.min(2.2, S.view.z * (e.deltaY < 0 ? 1.12 : 1 / 1.12))); updateView(); }, { passive: false });
  $('#mapCenter').onclick = () => { S.view.manual = false; S.view.sheet = null; S.view.z = 1; renderMap(); };
  // sheet selector and signposts
  $('#sheetBtn').onclick = e => { e.stopPropagation(); const m = $('#sheetMenu'); m.hidden = !m.hidden; if (!m.hidden) renderSheetMenu(); };
  $('#sheetMenu').addEventListener('click', e => {
    e.stopPropagation();
    const go = e.target.closest('.shGo'), ren = e.target.closest('.shRen');
    if (go) showSheet(go.dataset.sheet);
    else if (ren) {
      const id = ren.dataset.ren, row = ren.parentElement;
      row.innerHTML = `<input class="shIn" value="${esc(sheetName(id))}"><button class="shOk">OK</button>`;
      const inp = row.querySelector('input'); inp.focus(); inp.select();
      const done = () => { S.map.sheetNames = S.map.sheetNames || {}; const v = inp.value.trim(); if (v && v !== id) S.map.sheetNames[id] = v; else delete S.map.sheetNames[id]; saveMap(); renderMap(); renderSheetMenu(); };
      row.querySelector('.shOk').onclick = done; inp.onkeydown = ev => { if (ev.key === 'Enter') done(); if (ev.key === 'Escape') renderSheetMenu(); };
    }
  });
  document.addEventListener('pointerdown', e => { if (!e.target.closest('#sheetMenu') && !e.target.closest('#sheetBtn')) $('#sheetMenu').hidden = true; });
  $('#mapSvg').addEventListener('click', e => { if (S.suppressMapClick) return; const s = e.target.closest('.stub'); if (s) showSheet(s.dataset.sheet, s.dataset.room); });
  $('#mapZoomIn').onclick = () => { S.view.z = Math.min(2.2, S.view.z * 1.2); updateView(); };
  $('#mapZoomOut').onclick = () => { S.view.z = Math.max(.35, S.view.z / 1.2); updateView(); };
  $('#mapReset').onclick = () => {
    if (!S.zm) return;
    if ($('#mapReset').dataset.armed) {
      S.map = { rooms: {}, edges: [] }; delete $('#mapReset').dataset.armed; $('#mapReset').textContent = T('Karte leeren');
      const n = statusRoom(); S.cur = null; if (n && !/^darkness$/i.test(n)) { placeRoom(n, null, null); S.cur = n; }
      saveMap(); renderMap();
    } else { $('#mapReset').dataset.armed = '1'; $('#mapReset').textContent = T('Wirklich leeren?'); setTimeout(() => { delete $('#mapReset').dataset.armed; $('#mapReset').textContent = T('Karte leeren'); }, 3000); }
  };
  window.addEventListener('resize', () => { updateView(); measureWidth(); });
}

// ---------- controls ----------

function initControls() {
  const form = $('#cmdForm'), inp = $('#cmd');
  form.addEventListener('submit', e => { e.preventDefault(); const v = inp.value; inp.value = ''; sendCommand(v); });
  // Inside a sandboxed frame (the artifact viewer) browsers drop form submission, so Enter would do
  // nothing. Enter in any text field therefore raises the submit event itself.
  document.addEventListener('keydown', e => {
    if (e.key !== 'Enter' || e.isComposing || e.shiftKey || e.defaultPrevented) return;
    const el = e.target; if (!el || el.tagName !== 'INPUT' || !el.form) return;
    if (/^(checkbox|radio|range|file|button|submit)$/i.test(el.type)) return;
    e.preventDefault();
    el.form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  });
  inp.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp') { if (!S.history.length) return; e.preventDefault(); S.hIdx = S.hIdx < 0 ? S.history.length - 1 : Math.max(0, S.hIdx - 1); inp.value = S.history[S.hIdx]; }
    else if (e.key === 'ArrowDown') { if (S.hIdx < 0) return; e.preventDefault(); S.hIdx++; if (S.hIdx >= S.history.length) { S.hIdx = -1; inp.value = ''; } else inp.value = S.history[S.hIdx]; }
  });
  document.addEventListener('keydown', e => {
    if (!S.zm || S.zm.state !== 'char') return;
    if (!$('#helpModal').hidden) return;
    if (e.key === 'Escape' && TTS.cur) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const map = { Enter: 13, Escape: 27, Backspace: 8, Delete: 8, ArrowUp: 129, ArrowDown: 130, ArrowLeft: 131, ArrowRight: 132, ' ': 32 };
    let code = map[e.key];
    if (code === undefined && e.key.length === 1) code = e.key.charCodeAt(0);
    if (code === undefined) return;
    e.preventDefault(); sendKey(code);
  });
  document.querySelectorAll('[data-key]').forEach(b => b.addEventListener('click', () => sendKey(+b.dataset.key)));
  $('#scroll').addEventListener('click', () => { if (S.zm && S.zm.state === 'input' && !window.getSelection().toString()) inp.focus(); });
  $('#undoBtn').onclick = () => { if (S.zm && S.zm.state === 'input') sendCommand('undo'); };
  $('#restartBtn').onclick = () => {
    const b = $('#restartBtn');
    if (b.dataset.armed) {
      delete b.dataset.armed; b.textContent = T('Neu starten');
      wipeRun(S.serial);
      $('#transcript').innerHTML = ''; S.zm.restart(); measureWidth(); pump(); renderMap();
    } else { b.dataset.armed = '1'; b.textContent = 'Sicher?'; setTimeout(() => { delete b.dataset.armed; b.textContent = T('Neu starten'); }, 3000); }
  };
  $('#changeStory').onclick = () => { location.reload(); };
  // total reset: everything this page keeps in the browser goes, then the page starts as on a first visit
  $('#resetAllBtn').onclick = () => {
    const b = $('#resetAllBtn');
    if (!b.dataset.armed) { b.dataset.armed = '1'; b.textContent = T('Wirklich alles löschen?'); setTimeout(() => { delete b.dataset.armed; b.textContent = T('Alles zurücksetzen'); }, 4000); return; }
    try { S.music.setEnabled(false); } catch (e) {}
    try { if (TTS.ok) speechSynthesis.cancel(); } catch (e) {}
    try { const keys = []; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith('zp:')) keys.push(k); } keys.forEach(k => localStorage.removeItem(k)); } catch (e) {}
    try { sessionStorage.clear(); } catch (e) {}
    // nothing may write again before the page has reloaded (pending autosaves, map, notes)
    try { Storage.prototype.setItem = function () {}; } catch (e) {}
    S.resetting = true;
    if (!window.__noReload) location.reload();
  };
  // music
  const mb = $('#musicBtn'), vol = $('#vol');
  const savedVol = parseFloat(LS.get('zp:vol') || '0.6'); vol.value = savedVol; S.music.volume = savedVol;
  mb.onclick = () => {
    const on = !S.music.enabled;
    if (!S.music.setEnabled(on)) { mb.textContent = T('Kein Audio'); return; }
    mb.classList.toggle('on', on); mb.setAttribute('aria-pressed', on);
    mb.textContent = on ? T('♫ Musik an') : T('♫ Musik aus');
    LS.set('zp:music', on ? '1' : '0');
  };
  vol.addEventListener('input', () => { S.music.setVolume(+vol.value); LS.set('zp:vol', vol.value); });
  // music is on unless the player has switched it off; browsers only allow sound after a click or key press
  const wake = () => { const c = S.music.ctx; if (S.music.enabled && c && c.state === 'suspended') c.resume(); };
  document.addEventListener('pointerdown', wake, true); document.addEventListener('keydown', wake, true);
  // mobile tabs
  document.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => {
    document.body.dataset.tab = b.dataset.tab;
    document.querySelectorAll('[data-tab]').forEach(x => x.classList.toggle('sel', x === b));
    setTimeout(updateView, 50);
  }));
}

initStart(); initControls(); initMapControls(); initSpeech(); initHelp();
// redraw the current picture (after a change of style or position)
function refreshPicture() {
  shownKey = null;
  if (!S.zm) return;
  const n = statusRoom();
  if (n) showRoom(n, '', /^darkness$/i.test(n));
}
function relang() {
  const hl = $('#hintList'); if (hl) { delete hl.dataset.done; hl.innerHTML = ''; }
  if (S.zm) { renderMap(); if (S.cur) { const st = S.music.enabled; $('#moodChip').textContent = '♪ ' + T(moodLabel(S.music.moodName)); } }
  updateSayUI(!!TTS.cur);
  const mb = $('#musicBtn'); mb.textContent = S.music.enabled ? T('♫ Musik an') : T('♫ Musik aus');
  const inp = $('#cmd'); if (S.zm) inp.placeholder = S.zm.state === 'char' ? T('Drück eine Taste …') : T('Was tust du?');
}
window.__zp = { loadTrVoices, speakText, stopSpeech, ttsOk: () => TTS.ok, speaking: () => TTS.cur, S, startGame, sendCommand, sendKey, roomState, statusRoom, statusRegion, findLocation, renderMap, appendSys, contentsVisible, ATTR, relang, refreshPicture, mentioned, mentionedIn, roomItems, renderRoomItems, nounFor };
})();
