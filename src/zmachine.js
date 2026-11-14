// Z-Machine interpreter (versions 3–5, tuned for v5 Inform games)
// Standalone, no dependencies. Works in the browser and in Node.
(function (root) {
'use strict';

const DEFAULT_UNICODE = [
  0xe4,0xf6,0xfc,0xc4,0xd6,0xdc,0xdf,0xbb,0xab,0xeb,0xef,0xff,0xcb,0xcf,0xe1,0xe9,
  0xed,0xf3,0xfa,0xfd,0xc1,0xc9,0xcd,0xd3,0xda,0xdd,0xe0,0xe8,0xec,0xf2,0xf9,0xc0,
  0xc8,0xcc,0xd2,0xd9,0xe2,0xea,0xee,0xf4,0xfb,0xc2,0xca,0xce,0xd4,0xdb,0xe5,0xc5,
  0xf8,0xd8,0xe3,0xf1,0xf5,0xc3,0xd1,0xd5,0xe6,0xc6,0xe7,0xc7,0xfe,0xf0,0xde,0xd0,
  0xa3,0x153,0x152,0xa1,0xbf
];
const A0 = 'abcdefghijklmnopqrstuvwxyz';
const A1 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const A2 = ' \n0123456789.,!?_#\'"/\\-:()';

class ZError extends Error {}

class ZMachine {
  constructor(storyBytes, io) {
    this.story = new Uint8Array(storyBytes);
    this.io = io || {};
    this.undoStack = [];
    this.restart();
  }

  // ---------- setup ----------
  restart() {
    const m = this.m = this.story.slice();
    this.version = m[0];
    if (this.version < 3 || this.version > 5) throw new ZError('Nur Z-Code-Versionen 3 bis 5 werden unterstützt (Datei: v' + this.version + ').');
    this.pc = this.w(6);
    this.globals = this.w(0x0c);
    this.objTable = this.w(0x0a);
    this.dict = this.w(0x08);
    this.abbrev = this.w(0x18);
    this.staticBase = this.w(0x0e);
    this.packMul = this.version <= 3 ? 2 : 4;
    this.stack = [];
    this.frames = [{ retPC: 0, locals: [], store: -1, argc: 0, base: 0 }];
    this.streams3 = [];
    this.stream1 = true;
    this.upperLines = 0;
    this.curWin = 0;
    this.cursor = { row: 1, col: 1 };
    this.style = 0;
    this.upper = [];
    this.out = [];
    this.state = 'run';
    this.seedRandom(0);
    // alphabet
    const alphaAddr = this.version >= 5 ? this.w(0x34) : 0;
    if (alphaAddr) {
      const tab = [];
      for (let i = 0; i < 78; i++) tab.push(String.fromCharCode(m[alphaAddr + i]));
      this.alpha = [tab.slice(0, 26).join(''), tab.slice(26, 52).join(''), ' \n' + tab.slice(54, 78).join('')];
    } else this.alpha = [A0, A1, A2];
    // unicode table
    this.unicode = DEFAULT_UNICODE;
    const ext = this.version >= 5 ? this.w(0x36) : 0;
    if (ext && this.w(ext) >= 3) {
      const ut = this.w(ext + 6);
      if (ut) {
        const n = m[ut]; this.unicode = [];
        for (let i = 0; i < n; i++) this.unicode.push(this.w(ut + 1 + 2 * i));
      }
    }
    this.setupHeader();
    this.dictCache = {};
  }

  setupHeader() {
    const m = this.m;
    if (this.version <= 3) {
      m[1] = (m[1] & ~0x70) | 0x20; // no status line unavailable, screen split available
    } else {
      m[1] = 0x1c; // bold, italic, fixed available; no colours, no timed input
      m[0x1e] = 6; m[0x1f] = 'Z'.charCodeAt(0);
      m[0x20] = 255; m[0x21] = this.screenWidth || 80;
      this.sw(0x22, this.screenWidth || 80); this.sw(0x24, 255);
      m[0x26] = 1; m[0x27] = 1;
    }
    // flags 2: keep transcript/fixed bits, disallow pictures/mouse/sound; allow undo
    let f2 = this.w(0x10);
    f2 &= ~(0x08 | 0x20 | 0x80 | 0x100);
    this.sw(0x10, f2);
    m[0x32] = 1; m[0x33] = 0;
  }

  setScreenWidth(cols) {
    this.screenWidth = Math.max(40, Math.min(255, cols | 0));
    if (this.version >= 4) { this.m[0x21] = this.screenWidth; this.sw(0x22, this.screenWidth); }
  }

  seedRandom(seed) {
    if (!seed) { this.rngMode = 'random'; return; }
    this.rngMode = 'seeded';
    this.rngS = seed >>> 0 || 1;
    this.rng = () => { let s = this.rngS; s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; this.rngS = s; return s / 4294967296; };
  }
  rand() { return this.rngMode === 'seeded' ? this.rng() : Math.random(); }

  // ---------- memory ----------
  w(a) { return (this.m[a] << 8) | this.m[a + 1]; }
  sw(a, v) { this.m[a] = (v >> 8) & 255; this.m[a + 1] = v & 255; }
  sb(a, v) {
    if (a >= this.staticBase) throw new ZError('Schreibzugriff auf statischen Speicher: ' + a.toString(16));
    this.m[a] = v & 255;
  }
  sww(a, v) {
    if (a + 1 >= this.staticBase) throw new ZError('Schreibzugriff auf statischen Speicher: ' + a.toString(16));
    this.sw(a, v);
  }
  s16(v) { return v & 0x8000 ? v - 0x10000 : v; }

  // ---------- variables ----------
  frame() { return this.frames[this.frames.length - 1]; }
  pop() {
    const f = this.frame();
    if (this.stack.length <= f.base) throw new ZError('Stack-Unterlauf');
    return this.stack.pop();
  }
  push(v) { this.stack.push(v & 0xffff); }
  readVar(v) {
    if (v === 0) return this.pop();
    if (v < 16) return this.frame().locals[v - 1] & 0xffff;
    return this.w(this.globals + 2 * (v - 16));
  }
  writeVar(v, val) {
    val &= 0xffff;
    if (v === 0) this.push(val);
    else if (v < 16) this.frame().locals[v - 1] = val;
    else this.sw(this.globals + 2 * (v - 16), val);
  }
  readInd(v) {
    if (v === 0) { const f = this.frame(); if (this.stack.length <= f.base) throw new ZError('Stack-Unterlauf'); return this.stack[this.stack.length - 1]; }
    return this.readVar(v);
  }
  writeInd(v, val) {
    if (v === 0) { const f = this.frame(); if (this.stack.length <= f.base) throw new ZError('Stack-Unterlauf'); this.stack[this.stack.length - 1] = val & 0xffff; }
    else this.writeVar(v, val);
  }

  // ---------- text ----------
  decode(addr, maxBytes) {
    // returns [string, nextAddr]
    const m = this.m;
    let zchars = [];
    let a = addr;
    for (;;) {
      const word = (m[a] << 8) | m[a + 1]; a += 2;
      zchars.push((word >> 10) & 31, (word >> 5) & 31, word & 31);
      if (word & 0x8000) break;
      if (maxBytes && a - addr >= maxBytes) break;
      if (a >= m.length) break;
    }
    return [this.zcharsToString(zchars, true), a];
  }
  zcharsToString(z, allowAbbrev) {
    let s = '', alpha = 0, i = 0;
    while (i < z.length) {
      const c = z[i++];
      if (c === 0) { s += ' '; alpha = 0; continue; }
      if (c >= 1 && c <= 3) {
        if (i >= z.length) break;
        const idx = 32 * (c - 1) + z[i++];
        if (allowAbbrev) {
          const aa = this.w(this.abbrev + 2 * idx) * 2;
          s += this.decode(aa)[0];
        }
        alpha = 0; continue;
      }
      if (c === 4) { alpha = 1; continue; }
      if (c === 5) { alpha = 2; continue; }
      if (alpha === 2 && c === 6) {
        if (i + 1 >= z.length + 1) break;
        const hi = z[i++], lo = z[i++];
        if (hi === undefined || lo === undefined) break;
        s += this.zsciiToStr((hi << 5) | lo);
        alpha = 0; continue;
      }
      s += this.alpha[alpha][c - 6];
      alpha = 0;
    }
    return s;
  }
  zsciiToStr(c) {
    if (c === 13 || c === 10) return '\n';
    if (c >= 32 && c <= 126) return String.fromCharCode(c);
    if (c >= 155 && c <= 251) {
      const u = this.unicode[c - 155];
      return u ? String.fromCharCode(u) : '?';
    }
    if (c === 9) return ' ';
    return '';
  }
  strToZscii(ch) {
    const code = ch.charCodeAt(0);
    if (code >= 32 && code <= 126) return code;
    if (ch === '\n') return 13;
    const idx = this.unicode.indexOf(code);
    if (idx >= 0) return 155 + idx;
    return 63; // '?'
  }
  unpack(p) { return p * this.packMul; }

  encodeWord(zsciiArr) {
    // encode for dictionary comparison (v4+: 9 zchars / 6 bytes; v3: 6 zchars / 4 bytes)
    const n = this.version <= 3 ? 6 : 9;
    const z = [];
    for (const c of zsciiArr) {
      if (z.length >= n) break;
      const ch = String.fromCharCode(c);
      let i = this.alpha[0].indexOf(ch);
      if (i >= 0) { z.push(i + 6); continue; }
      i = this.alpha[1].indexOf(ch);
      if (i >= 0) { z.push(4, i + 6); continue; }
      i = this.alpha[2].indexOf(ch);
      if (i >= 2) { z.push(5, i + 6); continue; }
      z.push(5, 6, (c >> 5) & 31, c & 31);
    }
    while (z.length < n) z.push(5);
    z.length = n;
    const words = [];
    for (let i = 0; i < n; i += 3) words.push((z[i] << 10) | (z[i + 1] << 5) | z[i + 2]);
    words[words.length - 1] |= 0x8000;
    return words;
  }

  // ---------- output ----------
  print(str) {
    if (!str) return;
    if (this.streams3.length) {
      const t = this.streams3[this.streams3.length - 1];
      for (const ch of str) {
        this.m[t.addr + 2 + t.count] = this.strToZscii(ch);
        t.count++;
      }
      return;
    }
    if (!this.stream1) return;
    if (this.curWin === 1) { this.printUpper(str); return; }
    const last = this.out[this.out.length - 1];
    if (last && last.style === this.style && !last.box) last.text += str;
    else this.out.push({ text: str, style: this.style });
  }
  printUpper(str) {
    for (const ch of str) {
      if (ch === '\n') { this.cursor.row++; this.cursor.col = 1; continue; }
      const r = this.cursor.row - 1, c = this.cursor.col - 1;
      if (r >= 0 && r < this.upperLines) {
        const row = this.upper[r] || (this.upper[r] = []);
        if (c < (this.screenWidth || 80)) row[c] = { ch, style: this.style };
      }
      this.cursor.col++;
    }
  }
  takeOutput() { const o = this.out; this.out = []; return o; }
  upperText() {
    const W = this.screenWidth || 80;
    const rows = [];
    for (let r = 0; r < this.upperLines; r++) {
      const row = this.upper[r] || [];
      const cells = [];
      for (let c = 0; c < W; c++) cells.push(row[c] || { ch: ' ', style: 0 });
      rows.push(cells);
    }
    return rows;
  }

  // ---------- objects ----------
  objAddr(o) { return this.objTable + (this.version <= 3 ? 62 + (o - 1) * 9 : 126 + (o - 1) * 14); }
  parent(o) { const a = this.objAddr(o); return this.version <= 3 ? this.m[a + 4] : this.w(a + 6); }
  sibling(o) { const a = this.objAddr(o); return this.version <= 3 ? this.m[a + 5] : this.w(a + 8); }
  child(o) { const a = this.objAddr(o); return this.version <= 3 ? this.m[a + 6] : this.w(a + 10); }
  setParent(o, v) { const a = this.objAddr(o); if (this.version <= 3) this.m[a + 4] = v; else this.sw(a + 6, v); }
  setSibling(o, v) { const a = this.objAddr(o); if (this.version <= 3) this.m[a + 5] = v; else this.sw(a + 8, v); }
  setChild(o, v) { const a = this.objAddr(o); if (this.version <= 3) this.m[a + 6] = v; else this.sw(a + 10, v); }
  propTable(o) { const a = this.objAddr(o); return this.w(a + (this.version <= 3 ? 7 : 12)); }
  // the name to show the player: a few objects carry only an internal tag ("mb") as their name and
  // print a proper one through a routine; for those, use the words the parser knows them by
  shownName(o) {
    const n = this.objName(o);
    if (!/^[A-Za-z]{1,3}$/.test(n.trim())) return n;
    try {
      let a = this.propTable(o); a += 1 + 2 * this.m[a];
      while (this.m[a]) {
        const sz = this.m[a]; let num, len, hdr;
        if (sz & 0x80) { num = sz & 63; len = (this.m[a + 1] & 63) || 64; hdr = 2; } else { num = sz & 63; len = sz & 64 ? 2 : 1; hdr = 1; }
        if (num === 1) { const w = []; for (let i = 0; i < len && w.length < 3; i += 2) w.push(this.decode(this.m[a + hdr + i] * 256 + this.m[a + hdr + i + 1])[0]); if (w.length) return w.join(' '); }
        a += hdr + len;
      }
    } catch (e) {}
    return n;
  }
  // the words the parser recognises for object o (its "name" property)
  nameWords(o) {
    const out = [];
    try {
      let a = this.propTable(o); a += 1 + 2 * this.m[a];
      while (this.m[a]) {
        const sz = this.m[a]; let num, len, hdr;
        if (sz & 0x80) { num = sz & 63; len = (this.m[a + 1] & 63) || 64; hdr = 2; } else { num = sz & 63; len = sz & 64 ? 2 : 1; hdr = 1; }
        if (num === 1) for (let i = 0; i + 1 < len; i += 2) out.push(this.decode(this.m[a + hdr + i] * 256 + this.m[a + hdr + i + 1])[0]);
        a += hdr + len;
      }
    } catch (e) {}
    return out;
  }
  objName(o) {
    if (!o) return '';
    const p = this.propTable(o);
    if (!this.m[p]) return '';
    return this.decode(p + 1, this.m[p] * 2)[0];
  }
  testAttr(o, a) { return !!(this.m[this.objAddr(o) + (a >> 3)] & (0x80 >> (a & 7))); }
  setAttr(o, a, on) {
    const addr = this.objAddr(o) + (a >> 3);
    if (on) this.m[addr] |= (0x80 >> (a & 7)); else this.m[addr] &= ~(0x80 >> (a & 7));
  }
  removeObj(o) {
    const p = this.parent(o);
    if (!p) return;
    const sib = this.sibling(o);
    if (this.child(p) === o) this.setChild(p, sib);
    else {
      let c = this.child(p);
      while (c) {
        const n = this.sibling(c);
        if (n === o) { this.setSibling(c, sib); break; }
        c = n;
      }
    }
    this.setParent(o, 0); this.setSibling(o, 0);
  }
  insertObj(o, d) {
    this.removeObj(o);
    this.setSibling(o, this.child(d));
    this.setChild(d, o);
    this.setParent(o, d);
  }
  // property iteration helpers
  firstProp(o) { const p = this.propTable(o); return p + 1 + this.m[p] * 2; }
  propInfo(a) {
    // a = address of size byte; returns {num, len, data, next}
    const b = this.m[a];
    if (this.version <= 3) {
      if (!b) return null;
      const len = (b >> 5) + 1;
      return { num: b & 31, len, data: a + 1, next: a + 1 + len };
    }
    if (!b) return null;
    if (b & 0x80) {
      let len = this.m[a + 1] & 0x3f; if (len === 0) len = 64;
      return { num: b & 0x3f, len, data: a + 2, next: a + 2 + len };
    }
    const len = b & 0x40 ? 2 : 1;
    return { num: b & 0x3f, len, data: a + 1, next: a + 1 + len };
  }
  findProp(o, n) {
    let a = this.firstProp(o);
    for (;;) {
      const pi = this.propInfo(a);
      if (!pi) return null;
      if (pi.num === n) return pi;
      if (pi.num < n) return null;
      a = pi.next;
    }
  }
  getProp(o, n) {
    const pi = this.findProp(o, n);
    if (!pi) return this.w(this.objTable + 2 * (n - 1));
    if (pi.len === 1) return this.m[pi.data];
    return this.w(pi.data);
  }
  getPropLen(addr) {
    if (!addr) return 0;
    const b = this.m[addr - 1];
    if (this.version <= 3) return (b >> 5) + 1;
    if (b & 0x80) { const l = b & 0x3f; return l === 0 ? 64 : l; }
    return b & 0x40 ? 2 : 1;
  }

  // ---------- dictionary ----------
  tokenise(textAddr, parseAddr, dictAddr, flag) {
    const m = this.m;
    dictAddr = dictAddr || this.dict;
    const d = this.loadDict(dictAddr);
    let chars, start;
    if (this.version >= 5) { const len = m[textAddr + 1]; chars = Array.from(m.slice(textAddr + 2, textAddr + 2 + len)); start = 2; }
    else { chars = []; let i = 1; while (m[textAddr + i]) { chars.push(m[textAddr + i]); i++; } start = 1; }
    const words = [];
    let i = 0;
    while (i < chars.length) {
      const c = chars[i];
      if (c === 32) { i++; continue; }
      if (d.seps.includes(c)) { words.push({ pos: i, chars: [c] }); i++; continue; }
      const st = i; const wc = [];
      while (i < chars.length && chars[i] !== 32 && !d.seps.includes(chars[i])) { wc.push(chars[i]); i++; }
      words.push({ pos: st, chars: wc });
    }
    const max = m[parseAddr];
    const n = Math.min(max, words.length);
    m[parseAddr + 1] = n;
    for (let k = 0; k < n; k++) {
      const wd = words[k];
      const entry = this.lookup(d, wd.chars);
      const a = parseAddr + 2 + 4 * k;
      if (entry === 0 && flag) continue;
      this.sw(a, entry);
      m[a + 2] = wd.chars.length;
      m[a + 3] = wd.pos + start;
    }
  }
  loadDict(addr) {
    if (this.dictCache[addr] && addr < this.staticBase === false) return this.dictCache[addr];
    const m = this.m;
    const ns = m[addr];
    const seps = Array.from(m.slice(addr + 1, addr + 1 + ns));
    const elen = m[addr + 1 + ns];
    const cnt = this.s16(this.w(addr + 2 + ns));
    const d = { seps, elen, count: Math.abs(cnt), sorted: cnt > 0, base: addr + 4 + ns };
    if (addr >= this.staticBase) this.dictCache[addr] = d;
    return d;
  }
  lookup(d, chars) {
    const lower = chars.map(c => (c >= 65 && c <= 90) ? c + 32 : c);
    const enc = this.encodeWord(lower);
    const nw = enc.length;
    const cmp = (a) => {
      for (let i = 0; i < nw; i++) {
        const x = this.w(a + 2 * i);
        if (x !== enc[i]) return x < enc[i] ? -1 : 1;
      }
      return 0;
    };
    if (d.sorted) {
      let lo = 0, hi = d.count - 1;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        const a = d.base + mid * d.elen;
        const c = cmp(a);
        if (c === 0) return a;
        if (c < 0) lo = mid + 1; else hi = mid - 1;
      }
      return 0;
    }
    for (let k = 0; k < d.count; k++) { const a = d.base + k * d.elen; if (cmp(a) === 0) return a; }
    return 0;
  }

  // ---------- calls ----------
  call(paddr, args, store) {
    const addr = this.unpack(paddr);
    if (paddr === 0) { if (store >= 0) this.writeVar(store, 0); return; }
    const m = this.m;
    const n = m[addr];
    let a = addr + 1;
    const locals = [];
    for (let i = 0; i < n; i++) {
      if (this.version <= 4) { locals.push(this.w(a)); a += 2; } else locals.push(0);
    }
    for (let i = 0; i < args.length && i < n; i++) locals[i] = args[i];
    this.frames.push({ retPC: this.pc, locals, store, argc: args.length, base: this.stack.length });
    this.pc = a;
  }
  // Play one command on the side (for example "inventory") and return what the game printed; everything,
  // the story's memory, the undo history, the screen and the random numbers, is put back afterwards.
  silentCommand(cmd, maxSteps = 3000000) {
    if (this.state !== 'input') return null;
    const keep = { snap: this.snapshot(), undo: this.undoStack.slice(), out: this.out, upper: JSON.stringify(this.upper), upperLines: this.upperLines, curWin: this.curWin, cursor: { ...this.cursor }, style: this.style, streams3: this.streams3.slice(), stream1: this.stream1, pendingRead: this.pendingRead, rngS: this.rngS, io: this.io };
    this.out = []; this.io = {};
    let text = '';
    try { this.provideInput(cmd); this.run(maxSteps); text = this.out.map(o => o.text).join(''); } catch (e) { text = ''; }
    this.applySnapshot(keep.snap); this.undoStack = keep.undo; this.out = keep.out; this.upper = JSON.parse(keep.upper); this.upperLines = keep.upperLines; this.curWin = keep.curWin;
    this.cursor = keep.cursor; this.style = keep.style; this.streams3 = keep.streams3; this.stream1 = keep.stream1; this.pendingRead = keep.pendingRead; this.rngS = keep.rngS; this.io = keep.io; this.state = 'input';
    return text;
  }
  // Run a routine of the story (for example an object's short_name) on the side and return what it printed
  // and returned; the machine is put back exactly as it was afterwards.
  callSilently(paddr, args = [], maxSteps = 200000) {
    const snap = this.snapshot(), outSave = this.out, st0 = this.state;
    this.out = []; this.state = 'run';
    let ret = null, n = 0;
    const depth = this.frames.length;
    try {
      this.call(paddr, args, -1);
      if (this.frames.length > depth) this.frame().onReturn = v => { ret = v; };
      while (this.frames.length > depth && n < maxSteps && this.state === 'run') { this.step(); n++; }
    } catch (e) { ret = null; }
    const text = this.out.map(o => o.text).join('');
    this.applySnapshot(snap); this.out = outSave; this.state = st0;
    return { ret, text, done: n < maxSteps };
  }
  ret(v) {
    const f = this.frames.pop();
    if (!this.frames.length) throw new ZError('Rücksprung aus der Hauptroutine');
    this.stack.length = f.base;
    this.pc = f.retPC;
    if (f.store >= 0) this.writeVar(f.store, v);
    if (f.onReturn) f.onReturn(v);
  }
  branch(cond) {
    const m = this.m;
    const b = m[this.pc++];
    let off;
    if (b & 0x40) off = b & 0x3f;
    else { off = ((b & 0x3f) << 8) | m[this.pc++]; if (off & 0x2000) off -= 0x4000; }
    if (!!(b & 0x80) === !!cond) {
      if (off === 0) this.ret(0);
      else if (off === 1) this.ret(1);
      else this.pc += off - 2;
    }
  }
  storeRes(v) { this.writeVar(this.m[this.pc++], v); }

  // ---------- state snapshots ----------
  snapshot() {
    return {
      mem: this.m.slice(0, this.staticBase),
      stack: this.stack.slice(),
      frames: this.frames.map(f => ({ retPC: f.retPC, locals: f.locals.slice(), store: f.store, argc: f.argc, base: f.base })),
      pc: this.pc
    };
  }
  applySnapshot(s) {
    // keep header flags that the interpreter controls
    const f2 = this.w(0x10) & 3;
    this.m.set(s.mem, 0);
    this.stack = s.stack.slice();
    this.frames = s.frames.map(f => ({ retPC: f.retPC, locals: f.locals.slice(), store: f.store, argc: f.argc, base: f.base }));
    this.pc = s.pc;
    this.setupHeader();
    this.sw(0x10, (this.w(0x10) & ~3) | f2);
  }
  serialize() {
    const s = this.snapshot();
    let bin = '';
    // like Quetzal's CMem: differences to the original story file, runs of unchanged bytes packed
    const m = s.mem, o = this.story, out = [];
    for (let i = 0; i < m.length; i++) {
      const d = m[i] ^ o[i];
      if (d) { out.push(d); continue; }
      let n = 0; while (i + 1 < m.length && (m[i + 1] ^ o[i + 1]) === 0 && n < 255) { n++; i++; }
      out.push(0, n);
    }
    for (let i = 0; i < out.length; i += 4096) bin += String.fromCharCode.apply(null, out.slice(i, i + 4096));
    const b64 = typeof btoa === 'function' ? btoa(bin) : Buffer.from(bin, 'binary').toString('base64');
    return JSON.stringify({ v: 2, len: m.length, serial: this.serialNo(), mem: b64, stack: s.stack, frames: s.frames, pc: s.pc, store: s.store });
  }
  deserialize(json) {
    const o = JSON.parse(json);
    if (o.serial !== this.serialNo()) throw new ZError('Spielstand gehört zu einer anderen Story-Datei.');
    const bin = typeof atob === 'function' ? atob(o.mem) : Buffer.from(o.mem, 'base64').toString('binary');
    let mem;
    if (o.v === 2) {
      mem = new Uint8Array(o.len); let j = 0;
      for (let i = 0; i < bin.length && j < o.len; i++) {
        const c = bin.charCodeAt(i);
        if (c) { mem[j] = c ^ this.story[j]; j++; }
        else { const n = bin.charCodeAt(++i) + 1; for (let k = 0; k < n && j < o.len; k++, j++) mem[j] = this.story[j]; }
      }
      for (; j < o.len; j++) mem[j] = this.story[j];
    } else {
      mem = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) mem[i] = bin.charCodeAt(i);
    }
    return { mem, stack: o.stack, frames: o.frames, pc: o.pc, store: o.store };
  }
  serialNo() {
    return this.w(2) + '-' + String.fromCharCode(...this.story.slice(0x12, 0x18));
  }

  // ---------- input ----------
  provideInput(str) {
    if (this.state !== 'input') return;
    const r = this.pendingRead;
    const m = this.m;
    str = str.toLowerCase();
    const zs = [];
    for (const ch of str) { const z = this.strToZscii(ch); if (z) zs.push(z); }
    if (this.version >= 5) {
      const max = m[r.text];
      const n = Math.min(max, zs.length);
      for (let i = 0; i < n; i++) m[r.text + 2 + i] = zs[i];
      m[r.text + 1] = n;
    } else {
      const max = m[r.text] - 1;
      const n = Math.min(max, zs.length);
      for (let i = 0; i < n; i++) m[r.text + 1 + i] = zs[i];
      m[r.text + 1 + n] = 0;
    }
    if (r.parse) this.tokenise(r.text, r.parse, 0, 0);
    if (this.version >= 5) this.writeVar(r.store, 13);
    this.state = 'run';
  }
  provideChar(ch) {
    if (this.state !== 'char') return;
    let code;
    if (typeof ch === 'number') code = ch;
    else code = ch.length ? this.strToZscii(ch) : 13;
    this.writeVar(this.pendingRead.store, code);
    this.state = 'run';
  }

  // ---------- main loop ----------
  run(maxSteps) {
    maxSteps = maxSteps || 5000000;
    let steps = 0;
    try {
      while (this.state === 'run') {
        this.step();
        if (++steps > maxSteps) { this.state = 'yield'; break; }
      }
    } catch (e) {
      this.state = 'error';
      this.error = e;
      this.print('\n[Interpreter-Fehler: ' + e.message + ']\n');
    }
    if (this.state === 'yield') this.state = 'run';
    return this.state;
  }

  step() {
    const m = this.m;
    const opPC = this.pc;
    let op = m[this.pc++];
    let ops = [], form, opnum, count;
    if (op === 0xbe && this.version >= 5) {
      opnum = m[this.pc++];
      form = 'ext';
      this.readTypes(m[this.pc++], ops);
    } else if (op >= 0xc0) {
      opnum = op & 0x1f;
      form = op < 0xe0 ? '2op' : 'var';
      if (form === 'var' && (opnum === 12 || opnum === 26)) {
        const t1 = m[this.pc++], t2 = m[this.pc++];
        this.readTypes(t1, ops, t2);
      } else this.readTypes(m[this.pc++], ops);
    } else if (op >= 0x80) {
      const t = (op >> 4) & 3;
      opnum = op & 0x0f;
      if (t === 3) form = '0op';
      else { form = '1op'; ops.push(this.readOperand(t)); }
    } else {
      form = '2op';
      opnum = op & 0x1f;
      ops.push(this.readOperand(op & 0x40 ? 2 : 1));
      ops.push(this.readOperand(op & 0x20 ? 2 : 1));
    }
    switch (form) {
      case '2op': return this.op2(opnum, ops, opPC);
      case '1op': return this.op1(opnum, ops[0], opPC);
      case '0op': return this.op0(opnum, opPC);
      case 'var': return this.opVar(opnum, ops, opPC);
      case 'ext': return this.opExt(opnum, ops, opPC);
    }
  }
  readOperand(t) {
    const m = this.m;
    if (t === 0) { const v = (m[this.pc] << 8) | m[this.pc + 1]; this.pc += 2; return v; }
    if (t === 1) return m[this.pc++];
    if (t === 2) return this.readVar(m[this.pc++]);
    return undefined;
  }
  readTypes(byte, ops, byte2) {
    const types = [];
    for (let s = 6; s >= 0; s -= 2) types.push((byte >> s) & 3);
    if (byte2 !== undefined) for (let s = 6; s >= 0; s -= 2) types.push((byte2 >> s) & 3);
    for (const t of types) { if (t === 3) break; ops.push(this.readOperand(t)); }
  }

  op2(n, o, at) {
    const [a, b] = o;
    switch (n) {
      case 1: { let r = false; for (let i = 1; i < o.length; i++) if (o[0] === o[i]) r = true; return this.branch(r); }
      case 2: return this.branch(this.s16(a) < this.s16(b));
      case 3: return this.branch(this.s16(a) > this.s16(b));
      case 4: { const v = (this.s16(this.readInd(a)) - 1) & 0xffff; this.writeInd(a, v); return this.branch(this.s16(v) < this.s16(b)); }
      case 5: { const v = (this.s16(this.readInd(a)) + 1) & 0xffff; this.writeInd(a, v); return this.branch(this.s16(v) > this.s16(b)); }
      case 6: return this.branch(a ? this.parent(a) === b : b === 0);
      case 7: return this.branch((a & b) === b);
      case 8: return this.storeRes(a | b);
      case 9: return this.storeRes(a & b);
      case 10: return this.branch(a ? this.testAttr(a, b) : false);
      case 11: if (a) this.setAttr(a, b, true); return;
      case 12: if (a) this.setAttr(a, b, false); return;
      case 13: return this.writeInd(a, b);
      case 14: if (a && b) this.insertObj(a, b); return;
      case 15: return this.storeRes(this.w((a + 2 * this.s16(b)) & 0xffff));
      case 16: return this.storeRes(this.m[(a + this.s16(b)) & 0xffff]);
      case 17: return this.storeRes(a ? this.getProp(a, b) : 0);
      case 18: { const pi = a ? this.findProp(a, b) : null; return this.storeRes(pi ? pi.data : 0); }
      case 19: {
        if (!a) return this.storeRes(0);
        let r = 0;
        if (b === 0) { const pi = this.propInfo(this.firstProp(a)); r = pi ? pi.num : 0; }
        else { const pi = this.findProp(a, b); if (pi) { const nx = this.propInfo(pi.next); r = nx ? nx.num : 0; } }
        return this.storeRes(r);
      }
      case 20: return this.storeRes(this.s16(a) + this.s16(b));
      case 21: return this.storeRes(this.s16(a) - this.s16(b));
      case 22: return this.storeRes(Math.imul(this.s16(a), this.s16(b)));
      case 23: if (!b) throw new ZError('Division durch null'); return this.storeRes(Math.trunc(this.s16(a) / this.s16(b)));
      case 24: if (!b) throw new ZError('Division durch null'); return this.storeRes(this.s16(a) % this.s16(b));
      case 25: return this.call(a, [b], this.m[this.pc++]);
      case 26: return this.call(a, [b], -1);
      case 27: return; // set_colour: ignored
      case 28: { // throw
        while (this.frames.length > b) this.frames.pop();
        return this.ret(a);
      }
    }
    throw new ZError('Unbekannter 2OP-Opcode ' + n + ' bei ' + at.toString(16));
  }

  op1(n, a, at) {
    switch (n) {
      case 0: return this.branch(a === 0);
      case 1: { const v = a ? this.sibling(a) : 0; this.storeRes(v); return this.branch(v !== 0); }
      case 2: { const v = a ? this.child(a) : 0; this.storeRes(v); return this.branch(v !== 0); }
      case 3: return this.storeRes(a ? this.parent(a) : 0);
      case 4: return this.storeRes(this.getPropLen(a));
      case 5: return this.writeInd(a, this.s16(this.readInd(a)) + 1);
      case 6: return this.writeInd(a, this.s16(this.readInd(a)) - 1);
      case 7: return this.print(this.decode(a)[0]);
      case 8: return this.call(a, [], this.m[this.pc++]);
      case 9: if (a) this.removeObj(a); return;
      case 10: return this.print(this.objName(a));
      case 11: return this.ret(a);
      case 12: this.pc += this.s16(a) - 2; return;
      case 13: return this.print(this.decode(this.unpack(a))[0]);
      case 14: return this.storeRes(this.readInd(a));
      case 15:
        if (this.version >= 5) return this.call(a, [], -1);
        return this.storeRes(~a & 0xffff);
    }
    throw new ZError('Unbekannter 1OP-Opcode ' + n);
  }

  op0(n, at) {
    switch (n) {
      case 0: return this.ret(1);
      case 1: return this.ret(0);
      case 2: { const [s, nx] = this.decode(this.pc); this.pc = nx; return this.print(s); }
      case 3: { const [s, nx] = this.decode(this.pc); this.pc = nx; this.print(s + '\n'); return this.ret(1); }
      case 4: return;
      case 5: { const ok = this.doSave(); if (this.version <= 3) return this.branch(ok); return this.storeRes(ok ? 1 : 0); }
      case 6: { return this.doRestore(this.version <= 3 ? 'branch' : 'store'); }
      case 7: { const w = this.screenWidth; this.restart(); if (w) this.setScreenWidth(w); this.io.onRestart && this.io.onRestart(); return; }
      case 8: return this.ret(this.pop());
      case 9: return this.storeRes(this.frames.length);
      case 10: this.state = 'quit'; return;
      case 11: return this.print('\n');
      case 12: return; // show_status (v3) – status handled by host
      case 13: return this.branch(true);
      case 15: return this.branch(true);
    }
    throw new ZError('Unbekannter 0OP-Opcode ' + n);
  }

  opVar(n, o, at) {
    const m = this.m;
    switch (n) {
      case 0: return this.call(o[0], o.slice(1), m[this.pc++]);
      case 1: return this.sww((o[0] + 2 * this.s16(o[1])) & 0xffff, o[2]);
      case 2: return this.sb((o[0] + this.s16(o[1])) & 0xffff, o[2]);
      case 3: {
        const pi = this.findProp(o[0], o[1]);
        if (!pi) throw new ZError('put_prop: Eigenschaft ' + o[1] + ' fehlt bei Objekt ' + o[0]);
        if (pi.len === 1) m[pi.data] = o[2] & 255; else this.sw(pi.data, o[2]);
        return;
      }
      case 4: { // read / aread
        const store = this.version >= 5 ? m[this.pc++] : -1;
        this.pendingRead = { text: o[0], parse: o[1], store };
        this.state = 'input';
        return;
      }
      case 5: return this.print(this.zsciiToStr(o[0]));
      case 6: return this.print(String(this.s16(o[0])));
      case 7: {
        const r = this.s16(o[0]);
        if (r <= 0) { this.seedRandom(-r); return this.storeRes(0); }
        return this.storeRes(1 + Math.floor(this.rand() * r));
      }
      case 8: return this.push(o[0]);
      case 9: { const v = this.pop(); return this.writeInd(o[0], v); }
      case 10: {
        // Inform's "box" (Curses' quotations) is drawn into a tall upper window that shrinks again
        // straight away. Hand the text to the story window, so it can actually be read.
        if (o[0] < this.upperLines && this.upperLines > 3) {
          const from = Math.max(o[0], this.statusH || 0);
          const lines = Array.from(this.upper.slice(from), r => Array.from(r || [], c => c ? c.ch : ' ').join('').trimEnd());
          while (lines.length && !lines[0].trim()) lines.shift();
          while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
          if (lines.length) {
            const ind = Math.min(...lines.filter(l => l.trim()).map(l => l.match(/^ */)[0].length));
            // the box belongs before the prompt that is already printed
            const last = this.out[this.out.length - 1];
            let prompt = '';
            if (last && !last.box) { const mm = last.text.match(/\n?>\s*$/); if (mm) { prompt = mm[0]; last.text = last.text.slice(0, -prompt.length); } }
            this.out.push({ text: lines.map(l => l.slice(ind)).join('\n') + '\n', style: 0, box: true });
            if (prompt) this.out.push({ text: prompt, style: last.style });
          }
        } else if (o[0] <= 3) this.statusH = o[0];
        this.upperLines = o[0];
        if (this.upper.length > o[0]) this.upper.length = o[0];
        if (this.curWin === 1 && this.cursor.row > o[0]) this.cursor = { row: 1, col: 1 };
        return;
      }
      case 11: this.curWin = o[0]; if (o[0] === 1) this.cursor = { row: 1, col: 1 }; return;
      case 12: return this.call(o[0], o.slice(1), m[this.pc++]);
      case 13: {
        const w = this.s16(o[0]);
        if (w === -1) { this.upperLines = 0; this.upper = []; this.curWin = 0; this.io.onClear && this.io.onClear(); }
        else if (w === -2) { this.upper = []; this.io.onClear && this.io.onClear(); }
        else if (w === 1) this.upper = [];
        else if (w === 0) this.io.onClear && this.io.onClear();
        return;
      }
      case 14: {
        if (this.curWin === 1) { const row = this.upper[this.cursor.row - 1]; if (row) row.length = this.cursor.col - 1; }
        return;
      }
      case 15: if (this.curWin === 1) this.cursor = { row: this.s16(o[0]), col: o[1] || 1 }; return;
      case 16: this.sww(o[0], this.cursor.row); this.sww(o[0] + 2, this.cursor.col); return;
      case 17: this.style = o[0] === 0 ? 0 : (this.style | o[0]); return;
      case 18: return;
      case 19: {
        const s = this.s16(o[0]);
        if (s === 3) this.streams3.push({ addr: o[1], count: 0 });
        else if (s === -3) { const t = this.streams3.pop(); if (t) this.sw(t.addr, t.count); }
        else if (s === 1) this.stream1 = true;
        else if (s === -1) this.stream1 = false;
        return;
      }
      case 20: return;
      case 21: if (this.io.beep) this.io.beep(o[0]); return;
      case 22: {
        this.pendingRead = { store: m[this.pc++] };
        this.state = 'char';
        return;
      }
      case 23: {
        const x = o[0], tab = o[1], len = o[2], form = o.length > 3 ? o[3] : 0x82;
        const fl = form & 0x7f, words = form & 0x80;
        let addr = tab, found = 0;
        for (let i = 0; i < len; i++) {
          const v = words ? this.w(addr) : m[addr];
          if (v === x) { found = addr; break; }
          addr += fl;
        }
        this.storeRes(found);
        return this.branch(found !== 0);
      }
      case 24: return this.storeRes(~o[0] & 0xffff);
      case 25: return this.call(o[0], o.slice(1), -1);
      case 26: return this.call(o[0], o.slice(1), -1);
      case 27: return this.tokenise(o[0], o[1], o[2] || 0, o[3] || 0);
      case 28: {
        const zs = Array.from(m.slice(o[0] + o[2], o[0] + o[2] + o[1]));
        const enc = this.encodeWord(zs);
        enc.forEach((v, i) => this.sww(o[3] + 2 * i, v));
        return;
      }
      case 29: {
        const first = o[0], second = o[1];
        let size = this.s16(o[2]);
        if (second === 0) { for (let i = 0; i < Math.abs(size); i++) this.sb(first + i, 0); return; }
        if (size < 0) { size = -size; for (let i = 0; i < size; i++) this.sb(second + i, m[first + i]); return; }
        const tmp = m.slice(first, first + size);
        for (let i = 0; i < size; i++) this.sb(second + i, tmp[i]);
        return;
      }
      case 30: {
        const addr = o[0], width = o[1], height = o.length > 2 ? o[2] : 1, skip = o.length > 3 ? o[3] : 0;
        let a = addr;
        const startCol = this.cursor.col;
        for (let r = 0; r < height; r++) {
          let line = '';
          for (let c = 0; c < width; c++) line += this.zsciiToStr(m[a++]);
          a += skip;
          if (this.curWin === 1) { this.cursor.col = startCol; this.print(line); this.cursor.row++; }
          else this.print(line + (r < height - 1 ? '\n' : ''));
        }
        return;
      }
      case 31: return this.branch(o[0] <= this.frame().argc);
    }
    throw new ZError('Unbekannter VAR-Opcode ' + n);
  }

  opExt(n, o, at) {
    switch (n) {
      case 0: {
        if (o.length) return this.storeRes(0);
        const ok = this.doSave(); return this.storeRes(ok ? 1 : 0);
      }
      case 1: {
        if (o.length) return this.storeRes(0);
        return this.doRestore('store');
      }
      case 2: { const v = o[0], s = this.s16(o[1]); return this.storeRes(s >= 0 ? (v << s) : (v >>> -s)); }
      case 3: { const v = this.s16(o[0]), s = this.s16(o[1]); return this.storeRes(s >= 0 ? (v << s) : (v >> -s)); }
      case 4: { const f = o[0]; const prev = this.font || 1; if (f === 0) return this.storeRes(prev); if (f === 1 || f === 4) { this.font = f; return this.storeRes(prev); } return this.storeRes(0); }
      case 9: {
        const store = this.m[this.pc++];
        const snap = this.snapshot(); snap.store = store;
        this.undoStack.push(snap);
        if (this.undoStack.length > 30) this.undoStack.shift();
        this.writeVar(store, 1);
        return;
      }
      case 10: {
        const store = this.m[this.pc++];
        const snap = this.undoStack.pop();
        if (!snap) return this.writeVar(store, 0);
        this.applySnapshot(snap);
        this.writeVar(snap.store, 2);
        return;
      }
      case 11: return this.print(String.fromCharCode(o[0]));
      case 12: return this.storeRes(3);
      case 13: return;
    }
    // unknown extended opcodes are ignored for robustness (picture ops etc.)
    if (n >= 5 && n <= 8) return;
    throw new ZError('Unbekannter EXT-Opcode ' + n);
  }

  doSave() {
    // For v4+ the store byte follows; capture state as if save returned 2 after restore.
    if (!this.io.save) return false;
    let store = -1;
    const pcBefore = this.pc;
    if (this.version >= 4) { store = this.m[this.pc]; this.pc++; }
    const snap = this.snapshot(); // pc after store byte
    const json = (() => { const s = this.serialize(); const o = JSON.parse(s); o.store = store; o.branchPC = this.version <= 3 ? pcBefore : null; return JSON.stringify(o); })();
    this.pc = pcBefore;
    let ok = false;
    try { ok = !!this.io.save(json); } catch (e) { ok = false; }
    return ok;
  }
  doRestore(mode) {
    let json = null;
    try { json = this.io.restore ? this.io.restore() : null; } catch (e) { json = null; }
    let st = null;
    if (json) { try { st = this.deserialize(json); st.raw = JSON.parse(json); } catch (e) { this.print('[' + e.message + ']\n'); st = null; } }
    if (!st) { if (mode === 'branch') return this.branch(false); return this.storeRes(0); }
    this.applySnapshot(st);
    if (this.version >= 4) { if (st.store >= 0) this.writeVar(st.store, 2); }
    else { this.pc = st.raw.branchPC; this.branch(true); }
    this.undoStack = [];
  }
}

const api = { ZMachine, ZError };
if (typeof module !== 'undefined' && module.exports) module.exports = api;
else root.ZM = api;
})(typeof window !== 'undefined' ? window : this);
