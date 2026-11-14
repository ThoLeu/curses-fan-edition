// Generative ambient music via Web Audio: original procedural compositions, mystical and spherical.
// Every room has its own mood (chosen from what happens there in the game), and the music reacts
// to what happens: discoveries add a shimmer, danger darkens it for a while.
(function (root) {
'use strict';

const LYD = [0, 2, 4, 6, 7, 9, 11], ION = [0, 2, 4, 5, 7, 9, 11], MIX = [0, 2, 4, 5, 7, 9, 10], DOR = [0, 2, 3, 5, 7, 9, 10], AEO = [0, 2, 3, 5, 7, 8, 10], PHR = [0, 1, 3, 5, 7, 8, 10], WT = [0, 2, 4, 6, 8, 10];
// voices: musicbox, harp, flute, choir, glass, bowl, celesta, strings, bell, piano
const MOODS = {
  attic:     { label: 'Dachboden', root: 50, scale: LYD, beat: 1.5, pad: .045, padCut: 1100, drone: .03, voices: { musicbox: 1, celesta: .6, bowl: .3 }, rate: .55, air: 'dust' },
  home:      { label: 'Haus', root: 48, scale: ION, beat: 1.4, pad: .045, padCut: 1200, drone: .028, voices: { piano: 1, musicbox: .5, celesta: .4 }, rate: .5 },
  cosy:      { label: 'Gemütlich', root: 53, scale: MIX, beat: 1.2, pad: .055, padCut: 1500, drone: .022, voices: { harp: 1, flute: .6, musicbox: .4 }, rate: .6 },
  heights:   { label: 'Höhe', root: 55, scale: LYD, beat: 1.8, pad: .06, padCut: 1800, drone: .025, voices: { glass: .8, flute: .7, celesta: .5 }, rate: .45, air: 'wind' },
  chill:     { label: 'Kälte', root: 49, scale: DOR, beat: 2.0, pad: .045, padCut: 900, drone: .03, voices: { glass: 1, bowl: .6 }, rate: .4, air: 'wind' },
  cellar:    { label: 'Gewölbe', root: 43, scale: DOR, beat: 1.9, pad: .04, padCut: 700, drone: .045, voices: { bowl: 1, strings: .7, bell: .3 }, rate: .4, air: 'drip' },
  arcane:    { label: 'Geheimnis', root: 46, scale: WT, beat: 2.0, pad: .045, padCut: 1000, drone: .04, voices: { glass: 1, bowl: .7, celesta: .4 }, rate: .45 },
  garden:    { label: 'Garten', root: 55, scale: ION, beat: 1.3, pad: .04, padCut: 1600, drone: .02, voices: { flute: 1, harp: .8, celesta: .3 }, rate: .6, air: 'birds' },
  maze:      { label: 'Irrgarten', root: 52, scale: DOR, beat: 1.25, pad: .04, padCut: 1300, drone: .022, voices: { harp: 1, musicbox: .6, flute: .4 }, rate: .65, air: 'birds' },
  sacred:    { label: 'Sakral', root: 45, scale: AEO, beat: 2.2, pad: .05, padCut: 1400, drone: .03, voices: { choir: 1, bell: .4, bowl: .3 }, rate: .35 },
  village:   { label: 'Dorf', root: 53, scale: MIX, beat: 1.4, pad: .04, padCut: 1500, drone: .02, voices: { harp: .8, flute: .8, bell: .4 }, rate: .5, air: 'birds' },
  ancient:   { label: 'Antike', root: 50, scale: DOR, beat: 1.6, pad: .045, padCut: 1300, drone: .035, voices: { harp: 1, flute: .7, bowl: .3 }, rate: .55 },
  sea:       { label: 'Meer', root: 47, scale: LYD, beat: 2.1, pad: .05, padCut: 1200, drone: .03, voices: { glass: .6, harp: .5, choir: .4 }, rate: .4, air: 'waves' },
  city:      { label: 'Stadt', root: 46, scale: AEO, beat: 1.5, pad: .042, padCut: 1000, drone: .03, voices: { piano: 1, strings: .5, bell: .2 }, rate: .45, air: 'rain' },
  otherworld:{ label: 'Anderswelt', root: 51, scale: WT, beat: 2.2, pad: .05, padCut: 1600, drone: .032, voices: { glass: 1, celesta: .8, choir: .4 }, rate: .5 },
  shadow:    { label: 'Schatten', root: 41, scale: PHR, beat: 2.2, pad: .04, padCut: 650, drone: .05, voices: { strings: 1, bowl: .7 }, rate: .3, air: 'wind' },
  heaven:    { label: 'Himmel', root: 57, scale: LYD, beat: 2.0, pad: .05, padCut: 2200, drone: .02, voices: { choir: 1, celesta: .7, harp: .5 }, rate: .5 },
  dark:      { label: 'Dunkel', root: 40, scale: DOR, beat: 2.4, pad: .03, padCut: 500, drone: .05, voices: { bowl: 1, strings: .4 }, rate: .25 }
};
// moods for rooms, from what the game makes of each place
const ROOMS = {
  'Potting Room': 'cosy', "Aunt Jemima's Lair": 'cosy', 'Airing Cupboard': 'cosy', 'Tiny Balcony': 'heights', 'Roof': 'heights', 'Chimney': 'cellar',
  'Battlements': 'chill', 'Dark Room': 'arcane', 'Disused Observatory': 'arcane', 'Souvenirs Room': 'attic', "Priest's Hole": 'sacred', 'Inside Cupboard': 'arcane',
  'Infinity Symbol': 'arcane', 'Dark Shaft': 'cellar', 'Cellar West': 'arcane', 'The Octagon': 'arcane', 'Hall of Exhibits': 'arcane', 'Museum Foyer': 'city', 'Revolving Door': 'city',
  'Stone Cross': 'village', 'Parish Church': 'sacred', 'Bell Tower': 'sacred', 'West Side Chapel': 'sacred', 'East Side Chapel': 'sacred', 'Crypt': 'shadow', 'Oubliette': 'shadow',
  'Maze': 'maze', 'Patio in Maze': 'maze', 'Maze Foundations': 'maze', 'Folly': 'heights', 'Up the Plane Tree': 'heights', 'Up the Beanstalk': 'heights', 'Viewpoint Ledge': 'heights',
  'Unreal City': 'city', 'Consulting Room': 'otherworld', 'Chatelet-les-Halles': 'city', 'Near Ring Road': 'city', 'Ruined Castle Cafe': 'city',
  'Sea Shore': 'sea', 'Cliffs': 'sea', 'Clifftop Walk': 'sea', 'Lighthouse': 'sea', 'Island of Pharos': 'sea', 'Aboard Ship': 'sea', 'Up the Mast': 'otherworld', 'Prow of the Lady Magdalena': 'sea', 'Stern': 'sea', 'On board the Phlebas': 'sea', 'Down by River': 'sea',
  'Necropolis': 'shadow', 'The Spirit World': 'shadow', 'Hellish Place': 'shadow', 'Heavenly Place': 'heaven', 'Temple of Zeus': 'sacred', 'Inner Sanctum': 'sacred', 'Cave Mouth': 'arcane',
  'Universe Maintenance Room': 'otherworld', 'Inside the Orb': 'otherworld', 'Shrine of the Bear': 'ancient', 'Rough Tent': 'ancient', 'Coven Cell': 'arcane', 'Wall of Thorns': 'shadow', 'Murky Cave': 'cellar'
};
// a mood from the picture's category when a room has no entry of its own
const BY_CAT = { attic: 'attic', interior: 'home', cellar: 'cellar', heights: 'heights', garden: 'garden', water: 'sea', cave: 'cellar', classical: 'ancient', church: 'sacred', egypt: 'ancient', camp: 'ancient', city: 'city', otherworld: 'otherworld', darkness: 'dark' };
function moodFor(room, cat, region) {
  if (cat === 'darkness') return 'dark';
  if (ROOMS[room]) return ROOMS[room];
  if (/tarot|\brod\b|high rod|ace of|grim reaper|fool|drowned sailor|sosostris/i.test(room || '')) return 'otherworld';
  if (region && /Meldrew Hall/i.test(region) && cat === 'interior') return 'home';
  return BY_CAT[cat] || 'home';
}
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
class Music {
  constructor() { this.sfxVol = .5; this.ctx = null; this.enabled = false; this.volume = .6; this.current = null; this.moodName = null; this.intensity = .3; this.tension = 0; this.spark = 0; }
  init() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    // phones: bigger audio buffers and a lighter mix, so that the sound does not crackle
    this.lite = !!((root.matchMedia && root.matchMedia('(pointer: coarse)').matches) || /Android|iPhone|iPad|iPod|Mobile/i.test((root.navigator || {}).userAgent || ''));
    let ctx; try { ctx = new AC({ latencyHint: 'playback' }); } catch (e) { ctx = new AC(); }
    this.ctx = ctx;
    this.master = ctx.createGain(); this.master.gain.value = 0;
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -20; comp.ratio.value = 3;
    const makeup = ctx.createGain(); makeup.gain.value = 1.5;
    // a limiter at the very end: the sum of all voices never clips, which on small speakers rattles
    const lim = ctx.createDynamicsCompressor(); lim.threshold.value = -4; lim.knee.value = 0; lim.ratio.value = 20; lim.attack.value = .002; lim.release.value = .15;
    // small phone speakers rattle on deep bass they cannot play: leave it out there
    if (this.lite) { const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 120; hp.Q.value = .7; this.master.connect(comp); comp.connect(makeup); makeup.connect(hp); hp.connect(lim); }
    else { this.master.connect(comp); comp.connect(makeup); makeup.connect(lim); }
    lim.connect(ctx.destination);
    this.limiter = lim;
    // a long, soft hall
    this.reverb = ctx.createConvolver(); this.reverb.buffer = this.impulse(this.lite ? 1.8 : 5.5);
    this.revGain = ctx.createGain(); this.revGain.gain.value = .75;
    this.reverb.connect(this.revGain); this.revGain.connect(this.master);
    // a slow stereo echo, the "spherical" part
    this.echoIn = ctx.createGain(); this.echoIn.gain.value = .5;
    const dl = ctx.createDelay(2), dr = ctx.createDelay(2), fb = ctx.createGain(), lp = ctx.createBiquadFilter();
    dl.delayTime.value = .62; dr.delayTime.value = .93; fb.gain.value = .38; lp.type = 'lowpass'; lp.frequency.value = 2600;
    const pl = ctx.createStereoPanner ? ctx.createStereoPanner() : ctx.createGain(), pr = ctx.createStereoPanner ? ctx.createStereoPanner() : ctx.createGain();
    if (pl.pan) { pl.pan.value = -.7; pr.pan.value = .7; }
    this.echoIn.connect(dl); dl.connect(lp); lp.connect(dr); dr.connect(fb); fb.connect(dl);
    dl.connect(pl); dr.connect(pr); pl.connect(this.master); pr.connect(this.master); pl.connect(this.reverb); pr.connect(this.reverb);
    this.noiseBuf = this.makeNoise();
  }
  impulse(sec) {
    const ctx = this.ctx, len = ctx.sampleRate * sec, b = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2) * (i < ctx.sampleRate * .02 ? i / (ctx.sampleRate * .02) : 1); }
    return b;
  }
  makeNoise() {
    const ctx = this.ctx, len = ctx.sampleRate * 4, b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0);
    let last = 0; for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; last = (last + .02 * w) / 1.02; d[i] = last * 3.5; }
    return b;
  }
  setEnabled(on) {
    this.init();
    if (!this.ctx) return false;
    this.enabled = on;
    if (on) { this.ctx.resume(); this.master.gain.setTargetAtTime(this.volume * (this.ducked ? .25 : 1), this.ctx.currentTime, .6); if (this.moodName && !this.current) this.startMood(this.moodName, this.moodSeed); }
    else {
      // switched off: fade out, then really stop the voices and the scheduler (saves battery on phones)
      this.master.gain.setTargetAtTime(0, this.ctx.currentTime, .4);
      const old = this.current; this.current = null;
      if (old) { clearInterval(old.timer); setTimeout(() => { try { old.stopAll(); old.bus.disconnect(); } catch (e) {} }, 2500); }
      // with sound effects off as well, nothing needs the audio engine at all
      if (!this.sfxVol) setTimeout(() => { if (!this.enabled && !this.sfxVol && this.ctx.state === 'running') this.ctx.suspend(); }, 3000);
    }
    return true;
  }
  duck(on) { this.ducked = on; if (this.ctx && this.enabled) this.master.gain.setTargetAtTime(this.volume * (on ? .25 : 1), this.ctx.currentTime, .3); }
  // ---------- sound effects (independent of the music switch) ----------
  initSfx() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    if (!this.sfxBus) { this.sfxBus = this.ctx.createGain(); this.sfxBus.gain.value = this.sfxVol ?? .5; this.sfxBus.connect(this.limiter || this.ctx.destination); this.sfxBus.connect(this.reverb); }
  }
  updateSfx() { if (this.sfxVol && this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); if (this.sfxBus) this.sfxBus.gain.setTargetAtTime(this.sfxVol ?? .5, this.ctx.currentTime, .1); if (!this.sfxVol) this.ambience(null); }
  noiseHit(t, dur, freq, q, vol, type) {
    const ctx = this.ctx, s = ctx.createBufferSource(); s.buffer = this.noiseBuf;
    const f = ctx.createBiquadFilter(); f.type = type || 'bandpass'; f.frequency.value = freq; f.Q.value = q;
    const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(this.sfxBus); s.start(t, Math.random() * 2); s.stop(t + dur + .05);
  }
  tone(t, f0, f1, dur, vol, type) {
    const ctx = this.ctx, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || 'sine'; o.frequency.setValueAtTime(f0, t); if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g); g.connect(this.sfxBus); o.start(t); o.stop(t + dur + .05);
  }
  sfx(kind) {
    if (!this.ctx || !this.sfxBus || !this.sfxVol) return;
    const t = this.ctx.currentTime + .02;
    if (kind === 'creak') { const o = this.ctx.createOscillator(), g = this.ctx.createGain(), f = this.ctx.createBiquadFilter(); o.type = 'sawtooth'; o.frequency.setValueAtTime(140, t); o.frequency.linearRampToValueAtTime(95, t + .5); o.frequency.linearRampToValueAtTime(160, t + .8); f.type = 'bandpass'; f.frequency.value = 900; f.Q.value = 6; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.12, t + .08); g.gain.linearRampToValueAtTime(.06, t + .6); g.gain.exponentialRampToValueAtTime(.0001, t + .9); o.connect(f); f.connect(g); g.connect(this.sfxBus); o.start(t); o.stop(t + 1); }
    else if (kind === 'thud') { this.tone(t, 110, 50, .35, .35, 'sine'); this.noiseHit(t, .2, 400, 1, .2, 'lowpass'); }
    else if (kind === 'pickup') { this.noiseHit(t, .12, 2500, 2, .12); this.tone(t + .03, 880, 1320, .12, .05, 'triangle'); }
    else if (kind === 'drop') { this.noiseHit(t, .18, 600, 1.5, .25); this.tone(t, 160, 80, .2, .12); }
    else if (kind === 'step') { for (let i = 0; i < 3; i++) this.noiseHit(t + i * .22, .09, 500 + Math.random() * 200, 1.2, .14, 'lowpass'); }
    else if (kind === 'chime') { [0, .12, .24].forEach((d, i) => this.tone(t + d, [784, 988, 1319][i], 0, 1.2, .07, 'sine')); }
  }
  // a short sound for an ending with a picture of its own: under two seconds, quiet, more comic than grim
  endSfx(key) {
    if (!this.ctx || !this.sfxBus || !this.sfxVol) return;
    const ctx = this.ctx, out = this.sfxBus, t = ctx.currentTime + .05;
    if (!this.whiteBuf) { const len = ctx.sampleRate * 3, b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0); for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1; this.whiteBuf = b; }
    if (!this.noiseBuf) this.noiseBuf = this.makeNoise();
    // noise through a filter, with an envelope: a = attack, h = hold, r = release; f0 to f1 sweeps the filter
    const nz = (t0, a, h, r, vol, type, f0, f1, q, white) => {
      const s = ctx.createBufferSource(); s.buffer = white ? this.whiteBuf : this.noiseBuf;
      const f = ctx.createBiquadFilter(); f.type = type; f.Q.value = q || 1; f.frequency.setValueAtTime(f0, t0); if (f1) f.frequency.exponentialRampToValueAtTime(f1, t0 + a + h + r);
      const g = ctx.createGain(); g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(vol, t0 + a); g.gain.setValueAtTime(vol, t0 + a + h); g.gain.exponentialRampToValueAtTime(.0001, t0 + a + h + r);
      s.connect(f); f.connect(g); g.connect(out); s.start(t0, Math.random()); s.stop(t0 + a + h + r + .05);
    };
    const tn = (t0, f0, f1, dur, vol, type, a) => {
      const o = ctx.createOscillator(), g = ctx.createGain(); o.type = type || 'sine';
      o.frequency.setValueAtTime(f0, t0); if (f1) o.frequency.exponentialRampToValueAtTime(f1, t0 + dur);
      g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(vol, t0 + (a || .01)); g.gain.exponentialRampToValueAtTime(.0001, t0 + dur);
      o.connect(g); g.connect(out); o.start(t0); o.stop(t0 + dur + .05);
    };
    // a struck piece of metal: a few inharmonic partials that ring out
    const metal = (t0, base, dur, vol) => [1, 2.76, 5.4, 8.93].forEach((m, i) => tn(t0, base * m, 0, dur / (1 + i * .5), vol / (1 + i), 'sine', .002));
    if (key === 'flood') {
      metal(t, 260, .5, .12); nz(t, .005, .02, .1, .25, 'bandpass', 900, 0, 2);
      nz(t + .05, .08, 1.0, .5, .24, 'bandpass', 3800, 2600, 1.2, true);
      for (let i = 0; i < 7; i++) tn(t + .35 + i * .19 + Math.random() * .06, 1500 + Math.random() * 500, 700, .08, .06);
    } else if (key === 'bear') {
      const o = ctx.createOscillator(), lfo = ctx.createOscillator(), lg = ctx.createGain(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      o.type = 'sawtooth'; o.frequency.setValueAtTime(85, t); o.frequency.linearRampToValueAtTime(62, t + 1.2);
      lfo.frequency.value = 23; lg.gain.value = .08; lfo.connect(lg); lg.connect(g.gain);
      f.type = 'lowpass'; f.frequency.value = 420; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.14, t + .25); g.gain.exponentialRampToValueAtTime(.0001, t + 1.4);
      o.connect(f); f.connect(g); g.connect(out); o.start(t); lfo.start(t); o.stop(t + 1.5); lfo.stop(t + 1.5);
      nz(t + .9, .05, .1, .3, .22, 'bandpass', 300, 2600, 1.5, true);
    } else if (key === 'crush') {
      const s = ctx.createBufferSource(); s.buffer = this.noiseBuf; const f = ctx.createBiquadFilter(), g = ctx.createGain(), lfo = ctx.createOscillator(), lg = ctx.createGain();
      f.type = 'lowpass'; f.frequency.setValueAtTime(180, t); f.frequency.linearRampToValueAtTime(520, t + 1.1);
      lfo.frequency.value = 13; lg.gain.value = .12; lfo.connect(lg); lg.connect(g.gain);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.2, t + 1.0); g.gain.linearRampToValueAtTime(0, t + 1.12);
      s.connect(f); f.connect(g); g.connect(out); s.start(t); lfo.start(t); s.stop(t + 1.2); lfo.stop(t + 1.2);
      tn(t + 1.1, 120, 40, .4, .3); nz(t + 1.1, .003, .02, .35, .25, 'lowpass', 900);
      for (let i = 0; i < 6; i++) nz(t + 1.2 + i * .07, .002, 0, .05, .08, 'bandpass', 2000 + i * 300, 0, 3, true);
    } else if (key === 'zeus') {
      nz(t, .002, .03, .12, .3, 'highpass', 2500, 0, .7, true);
      nz(t + .05, .04, .3, 1.5, .3, 'lowpass', 260, 90, .8);
      tn(t + .05, 60, 35, 1.2, .2);
    } else if (key === 'freak') {
      nz(t, .6, .1, .05, .14, 'bandpass', 3000, 400, 2, true);
      tn(t + .75, 90, 30, 1.1, .32); nz(t + .75, .005, .1, 1.0, .25, 'lowpass', 500, 120);
    } else if (key === 'kraken') {
      nz(t, .01, .05, .45, .26, 'bandpass', 1200, 500, 1, true); tn(t, 140, 60, .4, .18);
      for (let i = 0; i < 9; i++) tn(t + .3 + i * .1 + Math.random() * .04, 280 + Math.random() * 200, 700 + Math.random() * 400, .07, .06);
      tn(t + .2, 55, 45, 1.6, .14, 'sine', .4);
    } else if (key === 'fire') {
      nz(t, .3, .9, .6, .3, 'lowpass', 500, 900, 1);
      for (let i = 0; i < 26; i++) nz(t + Math.random() * 1.6, .001, 0, .02 + Math.random() * .03, .16 + Math.random() * .14, 'bandpass', 1500 + Math.random() * 3500, 0, 4, true);
    } else if (key === 'bomb') {
      tn(t, 90, 28, 1.4, .34); nz(t, .004, .08, 1.4, .3, 'lowpass', 700, 90, .7);
      for (let i = 0; i < 8; i++) nz(t + .35 + Math.random() * .9, .002, 0, .05, .06, 'bandpass', 1800 + Math.random() * 2000, 0, 3, true);
    } else if (key === 'prison') {
      metal(t, 110, 1.6, .2); nz(t, .002, .02, .12, .2, 'bandpass', 700, 0, 1.5);
      nz(t + .55, .001, 0, .04, .16, 'bandpass', 3200, 0, 6, true); metal(t + .58, 620, .3, .06);
    } else if (key === 'mastfall') {
      nz(t, .002, .03, .15, .28, 'highpass', 1500, 0, .7, true); tn(t, 300, 120, .15, .14, 'square');
      tn(t + .2, 1300, 260, .9, .07, 'sine', .05);
      tn(t + 1.12, 110, 45, .35, .32); nz(t + 1.12, .003, .02, .3, .26, 'lowpass', 800);
    } else if (key === 'spooked') {
      const o = ctx.createOscillator(), v = ctx.createOscillator(), vg = ctx.createGain(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(420, t); o.frequency.linearRampToValueAtTime(760, t + .6); o.frequency.linearRampToValueAtTime(380, t + 1.6);
      v.frequency.value = 6; vg.gain.value = 18; v.connect(vg); vg.connect(o.frequency);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.1, t + .3); g.gain.linearRampToValueAtTime(.08, t + 1.2); g.gain.exponentialRampToValueAtTime(.0001, t + 1.8);
      o.connect(g); g.connect(out); g.connect(this.reverb || out); o.start(t); v.start(t); o.stop(t + 1.9); v.stop(t + 1.9);
      nz(t + .1, .4, .3, .8, .16, 'bandpass', 600, 2400, 2, true);
    } else if (key === 'australia') {
      metal(t, 880, 1.4, .16); metal(t + .45, 880, 1.4, .14);
      nz(t + .2, .5, .3, .9, .18, 'lowpass', 500, 300, 1);
    }
  }
  ambience(kind) {
    if (kind === this.ambKind) return;
    const ctx = this.ctx;
    if (this.amb) { const a = this.amb; a.g.gain.setTargetAtTime(0, ctx.currentTime, .8); setTimeout(() => { try { a.stop(); } catch (e) {} }, 4000); clearInterval(a.timer); this.amb = null; }
    this.ambKind = kind;
    if (!kind || !ctx || !this.sfxBus || !this.sfxVol) return;
    const g = ctx.createGain(); g.gain.value = 0; g.connect(this.sfxBus); g.gain.setTargetAtTime(1, ctx.currentTime, 1.5);
    const a = { g, nodes: [], stop() { this.nodes.forEach(n => { try { n.stop(); } catch (e) {} }); g.disconnect(); } };
    if (kind === 'rain' || kind === 'surf') {
      const s = ctx.createBufferSource(); s.buffer = this.noiseBuf; s.loop = true;
      const f = ctx.createBiquadFilter(); f.type = kind === 'rain' ? 'highpass' : 'lowpass'; f.frequency.value = kind === 'rain' ? 1800 : 500;
      const vg = ctx.createGain(); vg.gain.value = kind === 'rain' ? .05 : .08;
      if (kind === 'surf') { const l = ctx.createOscillator(), lg = ctx.createGain(); l.frequency.value = .09; lg.gain.value = .06; l.connect(lg); lg.connect(vg.gain); l.start(); a.nodes.push(l); }
      s.connect(f); f.connect(vg); vg.connect(g); s.start(); a.nodes.push(s);
      if (kind === 'rain') a.timer = setInterval(() => { if (Math.random() < .12) { const t = ctx.currentTime; this.noiseHit(t, 2.5, 90, .7, .25, 'lowpass'); } }, 4000);
    } else if (kind === 'bells') {
      const ring = () => { const t = ctx.currentTime + .1; [220, 196.0, 174.6].forEach((f, i) => { const o = ctx.createOscillator(), o2 = ctx.createOscillator(), gg = ctx.createGain(); o.frequency.value = f; o2.frequency.value = f * 2.76; o.connect(gg); o2.connect(gg); gg.connect(g); gg.gain.setValueAtTime(0, t + i * 1.4); gg.gain.linearRampToValueAtTime(.05, t + i * 1.4 + .01); gg.gain.exponentialRampToValueAtTime(.0001, t + i * 1.4 + 4); o.start(t + i * 1.4); o2.start(t + i * 1.4); o.stop(t + i * 1.4 + 4.2); o2.stop(t + i * 1.4 + 4.2); }); };
      ring(); a.timer = setInterval(() => { if (Math.random() < .35) ring(); }, 15000);
    }
    this.amb = a;
  }
  setVolume(v) { this.volume = v; if (this.ctx && this.enabled) this.master.gain.setTargetAtTime(v * (this.ducked ? .25 : 1), this.ctx.currentTime, .2); }
  setMood(name, seed) {
    if (!MOODS[name]) name = 'home';
    seed = seed || name;
    if (name === this.moodName && seed === this.moodSeed && this.current) return;
    this.moodName = name; this.moodSeed = seed;
    if (!this.ctx || !this.enabled) return;
    this.startMood(name, seed);
  }
  // 0 = bright and spherical, 1 = dark and brooding
  setIntensity(v) { this.intensity = Math.max(0, Math.min(1, +v)); }
  g() { return Math.min(1, (this.intensity ?? .3) + this.tension * .6); }
  // react to what just happened in the game
  react(text, scoreUp) {
    if (!this.ctx || !this.enabled || !this.current) { if (scoreUp) this.spark = 1; return; }
    const t = this.ctx.currentTime;
    if (scoreUp) { this.spark = 1; this.flourish(t + .2, 'rise'); }
    if (/\*\*\* You have (?!won)|You have died/.test(text)) { this.tension = 1; this.flourish(t + .1, 'fall'); }
    else if (/\b(die|dies|death|dead|kill|scream|danger|terror|tremble|shiver|horrible|ghastly|wail|cold here|fall to|plummet|crumble)\b/i.test(text)) this.tension = Math.max(this.tension, .7);
    if (/\b(glow|glows|glowing|shimmer|sparkl|magic|golden|wonder|marvellous|enchant|radiant|bright light|light streams)\w*/i.test(text)) this.spark = Math.max(this.spark, .6);
    if (/\*\*\* You have won/.test(text)) { this.tension = 0; this.spark = 1; this.flourish(t + .2, 'win'); }
  }
  variant(name, seed) {
    const base = MOODS[name] || MOODS.home;
    let h = 2166136261; for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
    const rnd = () => { h ^= h << 13; h >>>= 0; h ^= h >>> 17; h ^= h << 5; h >>>= 0; return h / 4294967296; };
    const voices = {}; for (const k in base.voices) voices[k] = base.voices[k] * (.6 + rnd() * .8);
    return Object.assign({}, base, { root: base.root + [0, 0, 2, -2, 5, -3, 7][Math.floor(rnd() * 7)], beat: base.beat * (.9 + rnd() * .2), voices, rnd, prog: [[0, 3, 4, 0], [0, 5, 3, 4], [0, 4, 5, 3], [0, 2, 3, 1]][Math.floor(rnd() * 4)], rate: base.rate * (.8 + rnd() * .4) });
  }
  startMood(name, seed) {
    const ctx = this.ctx, old = this.current;
    if (old) { old.bus.gain.setTargetAtTime(0, ctx.currentTime, 2.2); clearInterval(old.timer); setTimeout(() => { try { old.stopAll(); old.bus.disconnect(); } catch (e) {} }, 11000); }
    const m = this.variant(name, seed || name);
    const bus = ctx.createGain(); bus.gain.value = 0;
    const tone = ctx.createBiquadFilter(); tone.type = 'lowpass'; tone.frequency.value = 4000; tone.Q.value = .2;
    bus.connect(tone); tone.connect(this.master); tone.connect(this.reverb);
    bus.gain.setTargetAtTime(1, ctx.currentTime + .4, 2.4);
    const p = { m, bus, tone, nodes: [], nextBar: ctx.currentTime + .6, bar: 0, stopAll() { this.nodes.forEach(n => { try { n.stop(); } catch (e) {} }); } };
    this.current = p;
    this.startDrone(p);
    if (m.air) this.startAir(p, m.air);
    p.timer = setInterval(() => this.schedule(p), 250);
    this.schedule(p);
  }
  // the scale bends darker with the slider and with tension: lydian → ionian → dorian → aeolian
  note(m, deg, oct) {
    let s = m.scale; const g = this.g();
    if (s !== WT && g > .55) s = g > .8 ? AEO : DOR;
    const n = s.length, o = Math.floor(deg / n), d = ((deg % n) + n) % n; return m.root + s[d] + 12 * (o + (oct || 0));
  }
  startDrone(p) {
    const ctx = this.ctx, m = p.m, t = ctx.currentTime;
    const out = ctx.createGain(); out.gain.value = 0; out.gain.setTargetAtTime(m.drone, t, 3);
    const flt = ctx.createBiquadFilter(); flt.type = 'lowpass'; flt.frequency.value = 500; flt.Q.value = .5;
    const lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = .02 + m.rnd() * .03; lg.gain.value = 220; lfo.connect(lg); lg.connect(flt.frequency); lfo.start(t);
    const add = (midi, type, vol, det) => { const o = ctx.createOscillator(), og = ctx.createGain(); o.type = type; o.frequency.value = mtof(midi); o.detune.value = det; og.gain.value = vol; o.connect(og); og.connect(flt); o.start(t); p.nodes.push(o); };
    add(m.root - 24, 'sine', 1, -3); add(m.root - 24, 'triangle', .5, 4); add(m.root - 17, 'sine', .55, 2); add(m.root - 12, 'sine', .25, -5);
    flt.connect(out); out.connect(p.bus); p.drone = { out, flt };
    p.nodes.push(lfo);
  }
  startAir(p, kind) {
    const ctx = this.ctx, t = ctx.currentTime, s = ctx.createBufferSource(); s.buffer = this.noiseBuf; s.loop = true;
    const f = ctx.createBiquadFilter(), gg = ctx.createGain();
    const cfg = { wind: ['bandpass', 520, 1.2, .03], waves: ['lowpass', 650, .4, .06], rain: ['highpass', 2400, .3, .025], dust: ['bandpass', 1800, .8, .008], drip: ['lowpass', 300, .5, .012], birds: ['bandpass', 3000, 1, .006] }[kind] || ['lowpass', 400, .5, .01];
    f.type = cfg[0]; f.frequency.value = cfg[1]; f.Q.value = cfg[2]; gg.gain.value = cfg[3];
    const l = ctx.createOscillator(), lg = ctx.createGain(); l.frequency.value = kind === 'waves' ? .08 : .04; lg.gain.value = kind === 'waves' ? cfg[3] * .8 : cfg[1] * .3;
    l.connect(lg); lg.connect(kind === 'waves' ? gg.gain : f.frequency);
    s.connect(f); f.connect(gg); gg.connect(p.bus); s.start(t); l.start(t); p.nodes.push(s, l);
    p.air = kind;
  }
  schedule(p, horizon) {
    const ctx = this.ctx, m = p.m, g = this.g();
    p.tone.frequency.setTargetAtTime(4200 - g * 2600, ctx.currentTime, 1.5);
    if (p.drone) p.drone.flt.frequency.setTargetAtTime(560 - g * 260, ctx.currentTime, 2);
    while (p.nextBar < ctx.currentTime + (horizon || 2.5)) {
      const t = p.nextBar, bar = m.beat * 4;
      if (p.bar % 2 === 0) this.padChord(p, t, bar * 2.3);
      const rate = m.rate * (1 - g * .4) + this.spark * .5;
      const n = m.rnd() < rate ? (m.rnd() < .3 ? 2 : 1) : 0;
      for (let k = 0; k < n; k++) this.voice(p, t + m.rnd() * bar * .9);
      if (this.spark > .05 && m.rnd() < this.spark) this.voice(p, t + m.rnd() * bar, 'celesta');
      if (p.air === 'birds' && m.rnd() < .35) this.voice(p, t + m.rnd() * bar, 'bird');
      if (p.air === 'drip' && m.rnd() < .5) this.voice(p, t + m.rnd() * bar, 'drip');
      if (g > .6 && m.rnd() < (g - .6) * .8) this.voice(p, t + m.rnd() * bar, 'strings');
      this.spark *= .82; this.tension *= .9;
      p.bar++; p.nextBar += bar;
    }
  }
  padChord(p, t, dur) {
    const ctx = this.ctx, m = p.m, g = this.g();
    const step = m.prog[Math.floor(p.bar / 2) % 4];
    // open, suspended voicings: root, second or fourth, fifth, ninth
    const shape = [[0, 1, 4, 8], [0, 3, 4, 7], [0, 2, 4, 8]][Math.floor(p.bar / 8) % 3];
    const notes = shape.map(d => this.note(m, d + step, -1));
    const out = ctx.createGain(), flt = ctx.createBiquadFilter();
    flt.type = 'lowpass'; flt.frequency.value = m.padCut * (1.1 - g * .5); flt.Q.value = .3;
    const lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = .07; lg.gain.value = m.padCut * .3; lfo.connect(lg); lg.connect(flt.frequency); lfo.start(t); lfo.stop(t + dur + .2);
    const a = Math.min(5, dur * .4);
    out.gain.setValueAtTime(0, t); out.gain.linearRampToValueAtTime(m.pad, t + a); out.gain.setValueAtTime(m.pad, t + dur * .65); out.gain.linearRampToValueAtTime(0, t + dur);
    flt.connect(out); out.connect(p.bus); out.connect(this.echoIn);
    for (const nn of notes) for (const [type, det, v] of (this.lite ? [['sine', -6, .62], ['triangle', 7, .4]] : [['sine', -6, .6], ['triangle', 7, .35], ['sine', 1202, .08]])) {
      const o = ctx.createOscillator(), og = ctx.createGain();
      o.type = type; o.frequency.value = mtof(nn); o.detune.value = det + (m.rnd() - .5) * 4; og.gain.value = v / notes.length;
      o.connect(og); og.connect(flt); o.start(t); o.stop(t + dur + .1);
    }
  }
  pick(p) { const w = p.m.voices; let tot = 0; for (const k in w) tot += w[k]; let r = p.m.rnd() * tot; for (const k in w) { r -= w[k]; if (r <= 0) return k; } return Object.keys(w)[0]; }
  pluck(t, f, vol, dur, partials, dest, bright) {
    const ctx = this.ctx, gn = ctx.createGain(), lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.setValueAtTime(bright || 3500, t); lp.frequency.exponentialRampToValueAtTime(600, t + dur * .8);
    gn.gain.setValueAtTime(0, t); gn.gain.linearRampToValueAtTime(vol, t + .008); gn.gain.exponentialRampToValueAtTime(.0001, t + dur);
    lp.connect(gn); gn.connect(dest); gn.connect(this.echoIn);
    for (const [mul, v] of partials) { const o = ctx.createOscillator(), og = ctx.createGain(); o.type = 'sine'; o.frequency.value = f * mul; og.gain.value = v; o.connect(og); og.connect(lp); o.start(t); o.stop(t + dur + .05); }
  }
  voice(p, t, kind) {
    const ctx = this.ctx, m = p.m, bus = p.bus;
    kind = kind || this.pick(p);
    const deg = () => Math.floor(m.rnd() * 9);
    if (kind === 'musicbox') {
      // a few notes of a music box, slightly out of reach
      let d = deg(); for (let i = 0; i < 3 + Math.floor(m.rnd() * 3); i++) { this.pluck(t + i * m.beat * .5, mtof(this.note(m, d, 1)), .03, 2.2, [[1, 1], [4.01, .25], [8.3, .06]], bus, 6000); d += [1, 2, -1, 3, -2][Math.floor(m.rnd() * 5)]; }
    } else if (kind === 'celesta') {
      this.pluck(t, mtof(this.note(m, deg() + 2, 2)), .022, 3, [[1, 1], [3, .2], [6.2, .05]], bus, 7000);
    } else if (kind === 'harp') {
      // a gently rolled arpeggio
      const b = Math.floor(m.rnd() * 3); for (let i = 0; i < 4; i++) this.pluck(t + i * .17, mtof(this.note(m, b + i * 2, 0)), .035, 3.2, [[1, 1], [2, .4], [3, .15]], bus, 2800);
    } else if (kind === 'piano') {
      const d = deg(); this.pluck(t, mtof(this.note(m, d, 0)), .04, 4, [[1, 1], [2, .35], [3.01, .1]], bus, 2200);
      if (m.rnd() < .5) this.pluck(t + m.beat, mtof(this.note(m, d + 2, 0)), .03, 4, [[1, 1], [2, .3]], bus, 2000);
    } else if (kind === 'flute') {
      let d = 4 + Math.floor(m.rnd() * 3);
      for (let i = 0; i < 2 + Math.floor(m.rnd() * 3); i++) {
        const tt = t + i * m.beat * 1.1, f = mtof(this.note(m, d, 1)), gn = ctx.createGain(), len = m.beat * 1.3;
        gn.gain.setValueAtTime(0, tt); gn.gain.linearRampToValueAtTime(.028, tt + .25); gn.gain.linearRampToValueAtTime(.0001, tt + len);
        const o = ctx.createOscillator(), vib = ctx.createOscillator(), vg = ctx.createGain(); o.type = 'sine'; o.frequency.value = f; vib.frequency.value = 5; vg.gain.value = f * .005; vib.connect(vg); vg.connect(o.frequency);
        const br = ctx.createBufferSource(), bf = ctx.createBiquadFilter(), bg = ctx.createGain(); br.buffer = this.noiseBuf; bf.type = 'bandpass'; bf.frequency.value = f; bf.Q.value = 8; bg.gain.value = .25;
        br.connect(bf); bf.connect(bg); bg.connect(gn); o.connect(gn); gn.connect(bus); gn.connect(this.echoIn);
        o.start(tt); vib.start(tt); br.start(tt, m.rnd() * 3); o.stop(tt + len + .05); vib.stop(tt + len + .05); br.stop(tt + len + .05);
        d += [-1, 1, -2, 2, 0][Math.floor(m.rnd() * 5)];
      }
    } else if (kind === 'choir') {
      // a wordless "aah": a few voices through vowel filters
      const f0 = mtof(this.note(m, Math.floor(m.rnd() * 5), 0)), len = m.beat * 5, gn = ctx.createGain();
      gn.gain.setValueAtTime(0, t); gn.gain.linearRampToValueAtTime(.03, t + 2); gn.gain.setValueAtTime(.03, t + len * .6); gn.gain.linearRampToValueAtTime(.0001, t + len); gn.connect(bus); gn.connect(this.echoIn);
      for (const fm of [800, 1150, 2900]) { const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = fm; bp.Q.value = 6; bp.connect(gn);
        for (const [mul, det] of [[1, -8], [1, 9], [1.5, 0]]) { const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f0 * mul; o.detune.value = det; const og = ctx.createGain(); og.gain.value = .12; o.connect(og); og.connect(bp); o.start(t); o.stop(t + len + .1); } }
    } else if (kind === 'glass') {
      const f = mtof(this.note(m, deg(), 1)), gn = ctx.createGain(), len = 6;
      gn.gain.setValueAtTime(0, t); gn.gain.linearRampToValueAtTime(.022, t + 1.6); gn.gain.linearRampToValueAtTime(.0001, t + len);
      const trem = ctx.createOscillator(), tg = ctx.createGain(); trem.frequency.value = 4; tg.gain.value = .006; trem.connect(tg); tg.connect(gn.gain); trem.start(t); trem.stop(t + len);
      gn.connect(bus); gn.connect(this.echoIn);
      for (const r of [1, 2.01, 3]) { const o = ctx.createOscillator(), og = ctx.createGain(); o.frequency.value = f * r; og.gain.value = [1, .3, .1][[1, 2.01, 3].indexOf(r)]; o.connect(og); og.connect(gn); o.start(t); o.stop(t + len + .1); }
    } else if (kind === 'bowl') {
      // a singing bowl, low and long
      const f = mtof(this.note(m, Math.floor(m.rnd() * 5), -1)), gn = ctx.createGain(); gn.gain.setValueAtTime(0, t); gn.gain.linearRampToValueAtTime(.03, t + .05); gn.gain.exponentialRampToValueAtTime(.0001, t + 9); gn.connect(bus);
      [[1, 1], [2.71, .4], [5.1, .15]].forEach(([r, v]) => { const o = ctx.createOscillator(), og = ctx.createGain(), bt = ctx.createOscillator(), bg = ctx.createGain(); o.frequency.value = f * r; bt.frequency.value = .8 + r * .3; bg.gain.value = v * .3; bt.connect(bg); bg.connect(og.gain); og.gain.value = v; o.connect(og); og.connect(gn); o.start(t); bt.start(t); o.stop(t + 9.1); bt.stop(t + 9.1); });
    } else if (kind === 'bell') {
      const f = mtof(this.note(m, Math.floor(m.rnd() * 5), 0)); this.pluck(t, f, .028, 7, [[1, 1], [2.76, .35], [5.4, .15], [8.93, .05]], bus, 5000);
    } else if (kind === 'strings') {
      const f = mtof(this.note(m, Math.floor(m.rnd() * 4), -1)), len = m.beat * 4, gn = ctx.createGain(), lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900;
      gn.gain.setValueAtTime(0, t); gn.gain.linearRampToValueAtTime(.03, t + 2.5); gn.gain.linearRampToValueAtTime(.0001, t + len); lp.connect(gn); gn.connect(bus);
      for (const det of [-7, 0, 6]) { const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = det; o.connect(lp); o.start(t); o.stop(t + len + .1); }
    } else if (kind === 'bird') {
      for (let i = 0; i < 2 + Math.floor(m.rnd() * 4); i++) { const tt = t + i * .13, o = ctx.createOscillator(), gn = ctx.createGain(), f = 2600 + m.rnd() * 1800; o.frequency.setValueAtTime(f, tt); o.frequency.exponentialRampToValueAtTime(f * (1.2 + m.rnd() * .4), tt + .08); gn.gain.setValueAtTime(0, tt); gn.gain.linearRampToValueAtTime(.006, tt + .01); gn.gain.exponentialRampToValueAtTime(.0001, tt + .1); o.connect(gn); gn.connect(bus); o.start(tt); o.stop(tt + .12); }
    } else if (kind === 'drip') {
      const o = ctx.createOscillator(), gn = ctx.createGain(), f = 900 + m.rnd() * 900; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 1.6, t + .05); gn.gain.setValueAtTime(0, t); gn.gain.linearRampToValueAtTime(.02, t + .003); gn.gain.exponentialRampToValueAtTime(.0001, t + .12); o.connect(gn); gn.connect(bus); gn.connect(this.echoIn); o.start(t); o.stop(t + .15);
    }
  }
  // short gestures for discoveries, deaths and the end
  flourish(t, kind) {
    const p = this.current; if (!p) return; const m = p.m;
    if (kind === 'rise') for (let i = 0; i < 6; i++) this.pluck(t + i * .11, mtof(this.note(m, i * 2, 1)), .03, 3, [[1, 1], [3, .15]], p.bus, 7000);
    else if (kind === 'fall') for (let i = 0; i < 4; i++) this.pluck(t + i * .5, mtof(this.note(m, 6 - i * 2, -1)), .04, 6, [[1, 1], [2.76, .3]], p.bus, 1500);
    else if (kind === 'win') for (let i = 0; i < 10; i++) this.pluck(t + i * .14, mtof(this.note(m, i, 1)), .03, 4, [[1, 1], [2, .3], [3, .1]], p.bus, 7000);
  }
  noiseAt(bus, t, dur, freq, q, vol, type, attack) {
    const ctx = this.ctx, s = ctx.createBufferSource(); s.buffer = this.noiseBuf;
    const f = ctx.createBiquadFilter(); f.type = type || 'bandpass'; f.frequency.value = freq; f.Q.value = q;
    const gn = ctx.createGain(); gn.gain.setValueAtTime(0, t); gn.gain.linearRampToValueAtTime(vol, t + (attack || .005)); gn.gain.exponentialRampToValueAtTime(.0001, t + dur);
    s.connect(f); f.connect(gn); gn.connect(bus); s.start(t, Math.random() * 2); s.stop(t + dur + .05);
  }
}

const api = { Music, MOODS, ROOMS, moodFor };
if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.ZMusic = api;
})(typeof window !== 'undefined' ? window : this);
