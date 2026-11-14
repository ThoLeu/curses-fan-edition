// Demo mode: plays a walkthrough file (loaded by the player) through the real game, step by step.
// The walkthrough is read in a hidden second interpreter first, so its "repeat until" notes and
// the random parts (the statues, the place to dig) are worked out before the show starts.
(function (root) {
const SEED = 4711;
function resolve(bytes, text) {
  const lines = text.replace(/\r/g, '').split('\n');
  const start = lines.findIndex(l => /^1\.\s/.test(l) && /housekeeping|attic/i.test(l)), end = lines.findIndex(l => /^Congratulations/.test(l.trim()));
  if (start < 0) throw new Error('format');
  let saved = null;
  const zm = new ZM.ZMachine(bytes, { save: j => { saved = j; return true; }, restore: () => saved });
  zm.setScreenWidth(80); zm.seedRandom(SEED);
  zm.run(); zm.provideChar(32); zm.run(); zm.takeOutput();
  const played = [], sections = [];
  const room = () => zm.objName(zm.readVar(17));
  const cmd = c => {
    if (zm.state === 'char') { zm.provideChar(32); zm.run(); zm.takeOutput(); }
    if (zm.state !== 'input') throw new Error('state');
    played.push(c); zm.provideInput(c); zm.run(); return zm.takeOutput().map(s => s.text).join('');
  };
  const solveStatues = () => {
    const find = w => { for (let o = 1; o < 502; o++) if (zm.objName(o).toLowerCase() === 'statue of ' + w) return o; };
    const target = { dionysus: 'Southwest Cross', demeter: 'Northwest Cross', poseidon: 'Northeast Cross', ares: 'Southeast Cross' };
    const dirOf = { 'Northeast Cross': 'ne', 'Northwest Cross': 'nw', 'Southeast Cross': 'se', 'Southwest Cross': 'sw' };
    const opp = { ne: 'sw', sw: 'ne', nw: 'se', se: 'nw' };
    const toCenter = () => { if (room() !== 'Cross Centre') cmd(opp[dirOf[room()]]); };
    for (let k = 0; k < 12; k++) {
      const bad = Object.keys(target).find(g => zm.objName(zm.parent(find(g))) !== target[g]);
      if (!bad) break;
      const where = zm.objName(zm.parent(find(bad)));
      if (where !== room()) { toCenter(); if (where !== 'Cross Centre') cmd(dirOf[where]); }
      if (room() !== 'Cross Centre') cmd('push ' + bad + ' ' + opp[dirOf[room()]]);
      cmd('push ' + bad + ' ' + dirOf[target[bad]]);
    }
    toCenter();
  };
  const words = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
  let paces = '', skip = false;
  for (let i = start; i < (end < 0 ? lines.length : end); i++) {
    const l = lines[i];
    if (/^\d+\.\s/.test(l)) { sections.push([played.length, l.trim().replace(/^\d+\.\s*/, '')]); continue; }
    if (/^-+$/.test(l.trim()) || !l.trim() || /^\[save file/.test(l.trim())) continue;
    if (skip) { if (l.includes(')')) skip = false; continue; }
    if (/^\(/.test(l.trim())) { if (!l.includes(')')) skip = true; continue; }
    const raw = l.trim();
    if ((raw.match(/\(/g) || []).length > (raw.match(/\)/g) || []).length && !/\)\s*$/.test(raw)) skip = true;
    const m = raw.match(/^If you're in '([^']+)' then '([^']+)'/);
    if (m) {
      if (room() === m[1]) for (const c of m[2].split('.').map(s => s.trim()).filter(Boolean)) cmd(c);
      if (!/^If you're in/.test((lines[i + 1] || '').trim()) && (lines[i + 1] || '').trim() === 's' && (lines[i + 2] || '').trim() === 's' && (lines[i + 3] || '').trim() === 'se') i += 3;
      continue;
    }
    const c = raw.split(' (')[0].trim();
    if (!c) continue;
    if (/^turn calendar x8/.test(raw)) { for (let k = 0; k < 14; k++) if (/Merlyn/i.test(cmd('turn calendar'))) break; continue; }
    const rep = raw.match(/\(x(\d+)/); if (rep && /^z\b/.test(c)) { for (let k = 0; k < +rep[1]; k++) cmd('z'); continue; }
    if (/until Austin/i.test(raw)) { for (let k = 0; k < 40; k++) if (/Austin/.test(cmd('z'))) break; continue; }
    if (/Until messenger/i.test(raw)) { for (let k = 0; k < 40; k++) if (/messenger|boy/i.test(cmd('z'))) break; continue; }
    if (/^sail/.test(c) && /Until/i.test(raw)) { for (let k = 0; k < 25 && room() !== 'Garden Stream'; k++) cmd('sail'); continue; }
    if (/dislodge a greenish oak/.test(raw)) { const ds = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']; for (let k = 0; k < 60; k++) if (/oak/i.test(cmd(ds[k % 8]))) break; continue; }
    const rr = raw.match(/Repeat until it rests at '(\w+)'/); if (rr) { for (let k = 0; k < 8; k++) if (new RegExp('\\b' + rr[1] + '\\b', 'i').test(cmd('turn it'))) break; continue; }
    if (c === 'push statue ne') { solveStatues(); while (lines[i + 1] && !/^put inscribed stone/.test(lines[i + 1].trim())) i++; continue; }
    if (/^priestess, tell me about fig/.test(c)) { paces = cmd(c); continue; }
    if (/^walk <X>/.test(c) || /^walk <Y>/.test(c)) continue;
    if (/^dig/.test(c)) {
      const nums = (paces.match(/\b(one|two|three|four|five|six|seven|eight|nine|ten|a)\b(?= paces?| pace)/gi) || []).map(w => w.toLowerCase() === 'a' ? 1 : words[w.toLowerCase()]);
      const X = nums[0] || 4, Y = nums[1] || 1, base = zm.snapshot();
      const tries = [];
      for (const [a, b] of [[X, Y], [Y, X]]) for (const ex of ['east', 'west']) for (const ny of ['north', 'south']) tries.push([a, ex, b, ny]);
      for (let a = 0; a <= 12; a++) for (const ex of ['east', 'west']) for (let b = 0; b <= 12; b++) for (const ny of ['north', 'south']) if (!(a === 0 && ex === 'west') && !(b === 0 && ny === 'south')) tries.push([a, ex, b, ny]);
      for (let n = 0; n < tries.length; n++) {
        const [a, ex, b, ny] = tries[n];
        zm.applySnapshot(base); zm.state = 'input'; const mark = played.length;
        if (a) cmd(`walk ${a} paces ${ex}`); if (b) cmd(`walk ${b} paces ${ny}`); cmd('get implement'); if (n < 8) cmd('x it'); const o = cmd('dig');
        if (/something solid/i.test(o)) break;
        played.length = mark;
      }
      continue;
    }
    if ((/^get implement/.test(c) || /^x it$/.test(c)) && played[played.length - 1] === 'dig') continue;
    cmd(c);
  }
  return { cmds: played, sections, seed: SEED };
}
root.ZDemo = { resolve, SEED };
})(window);

// ---------------------------------------------------------------- the show
(function () {
const $ = s => document.querySelector(s);
const T = s => (window.ZI18N && ZI18N.T ? ZI18N.T(s) : (window.T ? window.T(s) : s));
const SPEED = { slow: 3200, normal: 1500, fast: 550, turbo: 90 };
let D = null;
function stash(serial) { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.includes(serial)) o[k] = localStorage.getItem(k); } return o; }
function unstash(serial, o) { const del = []; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.includes(serial)) del.push(k); } del.forEach(k => localStorage.removeItem(k)); for (const k in o) localStorage.setItem(k, o[k]); }
// The player's own data is also kept in localStorage while a demo runs, so a tab closed or reloaded
// mid-demo cannot lose it: on the next page load it is put back before anything else reads it.
const RESCUE = 'zp:demoRescue';
try {
  const r = JSON.parse(localStorage.getItem(RESCUE) || 'null');
  if (r && r.serial && r.saved) { unstash(r.serial, r.saved); }
  localStorage.removeItem(RESCUE);
} catch (e) {}
function bar() {
  const b = $('#demoBar'); if (!D) { b.hidden = true; return; }
  b.hidden = false;
  const sec = D.sections.filter(s => s[0] <= D.i).pop();
  $('#demoSec').textContent = sec ? sec[1] : '';
  $('#demoPos').textContent = `${Math.min(D.i, D.cmds.length)} / ${D.cmds.length}`;
  $('#demoProg').style.width = (100 * D.i / D.cmds.length) + '%';
  $('#demoPlay').textContent = D.paused ? '▶' : '⏸';
  $('#demoPlay').title = D.paused ? T('Weiter') : T('Pause');
}
function typeInto(cmd, ms, done) {
  const inp = $('#cmd'); inp.value = '';
  if (ms < 200) { inp.value = cmd; return done(); }
  let k = 0; const per = Math.min(70, ms * .35 / Math.max(1, cmd.length));
  const t = setInterval(() => { inp.value = cmd.slice(0, ++k); if (k >= cmd.length) { clearInterval(t); setTimeout(done, Math.min(260, ms * .15)); } }, per);
  D.typer = t;
}
function step() {
  if (!D) return;
  const Z = window.__zp, S = Z.S;
  if (D.i >= D.cmds.length) { finish(); return; }
  if (S.zm.state === 'char') Z.sendKey(32);
  const c = D.cmds[D.i];
  typeInto(c, D.ms, () => {
    if (!D) return;
    $('#cmd').value = '';
    Z.sendCommand(c, 'demo'); D.i++; bar();
    if (S.zm.state === 'char') Z.sendKey(32);
    if (!D.paused && !D.single) D.timer = setTimeout(step, D.ms);
    D.single = false;
  });
}
function finish() {
  clearTimeout(D.timer);
  D.paused = true; D.done = true; bar();
  $('#demoPlay').disabled = true; $('#demoStep').disabled = true;
  window.__zp.appendSys(T('Die Vorführung ist zu Ende. Mit „Beenden“ kommst du zurück zu deinem eigenen Spiel.'));
}
function stop() {
  if (!D) return;
  clearTimeout(D.timer); clearInterval(D.typer);
  const Z = window.__zp, S = Z.S, keep = D.saved, serial = D.serial, hadAuto = D.hadAuto;
  D = null; S.demo = false; bar();
  document.body.classList.remove('demo');
  unstash(serial, keep);
  try { localStorage.removeItem(RESCUE); } catch (e) {}
  $('#cmd').readOnly = false;
  Z.startGame(S.bytes, hadAuto);
}
function begin(res) {
  const Z = window.__zp, S = Z.S;
  const serial = S.serial;
  D = { cmds: res.cmds, sections: res.sections, i: 0, paused: false, ms: SPEED[$('#demoSpeed').value] || SPEED.normal, serial, saved: stash(serial), hadAuto: !!localStorage.getItem('zp:auto:' + serial) };
  try { localStorage.setItem(RESCUE, JSON.stringify({ serial, saved: D.saved })); }
  catch (e) { D = null; Z.appendSys(T('Für die Vorführung ist im Browserspeicher nicht genug Platz, um deinen Spielstand sicher aufzuheben. Lösche alte Spielstände und versuche es noch einmal.')); return; }
  $('#demoPlay').disabled = false; $('#demoStep').disabled = false;
  S.demo = true; document.body.classList.add('demo');
  Z.startGame(S.bytes, false, { seed: res.seed });
  $('#cmd').readOnly = true;
  Z.appendSys(T('Vorführung der Komplettlösung: Das Spiel spielt sich selbst. Dein eigener Spielstand bleibt unberührt.'));
  bar();
  D.timer = setTimeout(step, 900);
}
function init() {
  const f = $('#demoFile'); if (!f) return;
  f.addEventListener('change', () => {
    const file = f.files && f.files[0]; f.value = '';
    if (!file) return;
    const msg = $('#demoMsg');
    const S = window.__zp && window.__zp.S;
    if (!S || !S.bytes) { msg.textContent = T('Lade zuerst die Story-Datei curses.z5, dann die Komplettlösung.'); return; }
    msg.textContent = T('Komplettlösung wird vorbereitet …');
    file.text().then(text => setTimeout(() => {
      let res;
      try { res = ZDemo.resolve(S.bytes, text); } catch (e) { msg.textContent = T('Diese Datei sieht nicht nach der Komplettlösung für Curses aus.'); return; }
      if (res.cmds.length < 50) { msg.textContent = T('Diese Datei sieht nicht nach der Komplettlösung für Curses aus.'); return; }
      msg.textContent = '';
      $('#helpModal').hidden = true;
      begin(res);
    }, 30));
  });
  $('#demoPlay').onclick = () => { if (!D || D.done) return; D.paused = !D.paused; bar(); if (!D.paused) step(); else { clearTimeout(D.timer); } };
  $('#demoStep').onclick = () => { if (!D || D.done) return; D.paused = true; clearTimeout(D.timer); D.single = true; bar(); step(); };
  $('#demoSpeed').onchange = e => { if (D) D.ms = SPEED[e.target.value] || SPEED.normal; };
  $('#demoStop').onclick = stop;
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
window.ZDemoUI = { begin, stop, state: () => D };
})();
