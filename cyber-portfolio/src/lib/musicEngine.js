/* ─── Procedural Music Engine ────────────────────────────────────────────────
   Synthesizes two tracks:
   • "boot"  — eerie dark ambient drone for BootSequence + IntrusionOverlay
   • "main"  — cyberpunk beat (kick, snare, hat, bass, pad, arp) for the portfolio

   No audio files. Pure Web Audio API.
   Transitions crossfade in 1.5 s.
──────────────────────────────────────────────────────────────────────────── */

const BPM       = 118;
const BEAT_MS   = (60 / BPM) * 1000;          // ~508 ms
const BAR_MS    = BEAT_MS * 4;                  // ~2034 ms

/* A-minor pentatonic: A2, C3, D3, E3, G3, A3 */
const PENTA = [110, 130.81, 146.83, 164.81, 196.00, 220.00];

/* Chord clusters for pad — Am, Dm, Em, Am */
const CHORDS = [
  [220, 261.63, 329.63],   // Am
  [146.83, 174.61, 220.00],// Dm
  [164.81, 196.00, 246.94],// Em
  [220, 261.63, 329.63],   // Am
];

class MusicEngine {
  constructor() {
    this.ctx         = null;
    this.master      = null;
    this.bootGain    = null;
    this.mainGain    = null;
    this.muted       = false;
    this.volume      = 0.28;
    this.initialized = false;
    this.phase       = null;   // 'boot' | 'main' | null

    /* scheduled interval handles */
    this._intervals  = [];
    /* running oscillators / sources to clean up */
    this._bootNodes  = [];
  }

  /* ── Public lifecycle ──────────────────────────────────── */

  init() {
    if (this.initialized) return;
    try {
      this.ctx    = new (window.AudioContext || window.webkitAudioContext)();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.volume;
      this.master.connect(this.ctx.destination);

      this.bootGain = this.ctx.createGain();
      this.bootGain.gain.value = 0;
      this.bootGain.connect(this.master);

      this.mainGain = this.ctx.createGain();
      this.mainGain.gain.value = 0;
      this.mainGain.connect(this.master);

      this.initialized = true;
    } catch (e) {}
  }

  _resume() { if (this.ctx?.state === 'suspended') this.ctx.resume(); }

  setMuted(m) {
    this.muted = m;
    if (this.master) this.master.gain.value = m ? 0 : this.volume;
  }

  setVolume(v) {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.master && !this.muted) this.master.gain.value = this.volume;
  }

  /* Fade a GainNode to target over `ms` milliseconds */
  _fadeTo(gainNode, target, ms) {
    const now = this.ctx.currentTime;
    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setValueAtTime(gainNode.gain.value, now);
    gainNode.gain.linearRampToValueAtTime(target, now + ms / 1000);
  }

  /* Stop all scheduled intervals */
  _clearIntervals() {
    this._intervals.forEach(clearInterval);
    this._intervals = [];
  }

  /* Ramp down a GainNode then disconnect */
  _stopGain(gn, ms = 800) {
    if (!gn) return;
    const now = this.ctx.currentTime;
    gn.gain.cancelScheduledValues(now);
    gn.gain.setValueAtTime(gn.gain.value, now);
    gn.gain.linearRampToValueAtTime(0, now + ms / 1000);
  }

  /* ── Boot ambient track ────────────────────────────────── */

  startBoot() {
    if (!this.initialized) return;
    this._resume();
    this.phase = 'boot';
    this._buildBootAmbient();
    this._fadeTo(this.bootGain, 1, 1200);
  }

  _buildBootAmbient() {
    const ctx = this.ctx;
    const out = this.bootGain;

    /* Sub drone  40 Hz */
    const drone = this._makeDrone(40, 'sine', 0.28, out);

    /* Mid drone  80 Hz with detune wobble */
    const mid   = this._makeDrone(80, 'sine', 0.14, out);
    const lfo   = ctx.createOscillator();
    const lfog  = ctx.createGain();
    lfo.frequency.value = 0.18;
    lfog.gain.value = 14;
    lfo.connect(lfog);
    lfog.connect(mid.frequency);
    lfo.start();
    this._bootNodes.push(lfo, lfog);

    /* High-pitched filtered noise pad */
    const noise = this._makeNoisePad(1800, 6, 0.05, out);

    /* Very slow arp ping — every 3.2 s */
    const arpFreqs = [440, 523.25, 587.33, 659.26];
    let arpIdx = 0;
    const arpId = setInterval(() => {
      if (this.phase !== 'boot') return;
      this._ping(arpFreqs[arpIdx % arpFreqs.length], 1.2, 0.045, out);
      arpIdx++;
    }, 3200);
    this._intervals.push(arpId);

    this._bootNodes.push(drone, mid, noise);
  }

  _makeDrone(freq, type, vol, dest) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const g   = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.value = vol;
    osc.connect(g); g.connect(dest);
    osc.start();
    return osc;
  }

  _makeNoisePad(bpFreq, Q, vol, dest) {
    const ctx  = this.ctx;
    const buf  = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src  = ctx.createBufferSource();
    const bp   = ctx.createBiquadFilter();
    const g    = ctx.createGain();
    src.buffer = buf;
    src.loop   = true;
    bp.type = 'bandpass'; bp.frequency.value = bpFreq; bp.Q.value = Q;
    g.gain.value = vol;
    src.connect(bp); bp.connect(g); g.connect(dest);
    src.start();
    return src;
  }

  _ping(freq, dur, vol, dest) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const g   = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    g.gain.setValueAtTime(vol, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    osc.connect(g); g.connect(dest);
    osc.start(); osc.stop(ctx.currentTime + dur + 0.05);
  }

  stopBoot(fadems = 1400) {
    this._fadeTo(this.bootGain, 0, fadems);
    setTimeout(() => {
      this._bootNodes.forEach(n => { try { n.stop?.(); n.disconnect?.(); } catch(_){} });
      this._bootNodes = [];
    }, fadems + 50);
  }

  /* ── Main cyberpunk beat track ─────────────────────────── */

  startMain() {
    if (!this.initialized) return;
    this._resume();
    this.phase = 'main';
    this._scheduleBeat();
    this._fadeTo(this.mainGain, 1, 1500);
  }

  _scheduleBeat() {
    const ctx = this.ctx;
    const out = this.mainGain;

    /* Persistent pad — refreshes every bar */
    let chordIdx = 0;
    this._playPad(CHORDS[chordIdx], out);
    const padId = setInterval(() => {
      if (this.phase !== 'main') return;
      chordIdx = (chordIdx + 1) % CHORDS.length;
      this._playPad(CHORDS[chordIdx], out);
    }, BAR_MS);
    this._intervals.push(padId);

    /* Sub bass — plays a 4-note pattern every beat */
    const bassPattern = [0, 0, 3, 5];  // indices into PENTA
    let bassStep = 0;
    const bassId = setInterval(() => {
      if (this.phase !== 'main') return;
      this._playBass(PENTA[bassPattern[bassStep % bassPattern.length]] / 2, out);
      bassStep++;
    }, BEAT_MS);
    this._intervals.push(bassId);

    /* Kick — beats 1 & 3 of every bar */
    let beatCount = 0;
    const kickId = setInterval(() => {
      if (this.phase !== 'main') return;
      const pos = beatCount % 4;
      if (pos === 0 || pos === 2) this._playKick(out);
      beatCount++;
    }, BEAT_MS);
    this._intervals.push(kickId);

    /* Snare — beats 2 & 4 */
    let snareCount = 0;
    const snareId = setInterval(() => {
      if (this.phase !== 'main') return;
      const pos = snareCount % 4;
      if (pos === 1 || pos === 3) this._playSnare(out);
      snareCount++;
    }, BEAT_MS);
    this._intervals.push(snareId);

    /* Hi-hat — 8th notes (half beat) */
    let hatCount = 0;
    const hatId = setInterval(() => {
      if (this.phase !== 'main') return;
      const onBeat = hatCount % 2 === 0;
      this._playHat(onBeat ? 0.06 : 0.035, out);
      hatCount++;
    }, BEAT_MS / 2);
    this._intervals.push(hatId);

    /* Arp — fires every 2 beats, cycles penta scale */
    let arpStep = 0;
    const arpFreqs = [PENTA[4]*2, PENTA[5]*2, PENTA[3]*2, PENTA[2]*2, PENTA[0]*2, PENTA[1]*2];
    const arpId = setInterval(() => {
      if (this.phase !== 'main') return;
      // Only play arp on every other bar beat to keep it sparse
      if (arpStep % 3 !== 0) { arpStep++; return; }
      this._ping(arpFreqs[arpStep % arpFreqs.length], 0.4, 0.055, out);
      arpStep++;
    }, BEAT_MS);
    this._intervals.push(arpId);
  }

  _playKick(dest) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const g   = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(80, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.12);
    g.gain.setValueAtTime(0.8, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);
    osc.connect(g); g.connect(dest);
    osc.start(); osc.stop(ctx.currentTime + 0.25);
  }

  _playSnare(dest) {
    const ctx  = this.ctx;
    const dur  = 0.18;
    const size = Math.floor(ctx.sampleRate * dur);
    const buf  = ctx.createBuffer(1, size, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < size; i++)
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (size * 0.28));

    const src  = ctx.createBufferSource();
    const hp   = ctx.createBiquadFilter();
    const g    = ctx.createGain();
    hp.type = 'highpass'; hp.frequency.value = 1200;
    src.buffer = buf;
    g.gain.setValueAtTime(0.32, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    src.connect(hp); hp.connect(g); g.connect(dest);
    src.start();

    /* Tonal body */
    const body = ctx.createOscillator();
    const bg   = ctx.createGain();
    body.type = 'triangle';
    body.frequency.setValueAtTime(180, ctx.currentTime);
    body.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.06);
    bg.gain.setValueAtTime(0.22, ctx.currentTime);
    bg.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
    body.connect(bg); bg.connect(dest);
    body.start(); body.stop(ctx.currentTime + 0.12);
  }

  _playHat(vol, dest) {
    const ctx  = this.ctx;
    const dur  = 0.06;
    const size = Math.floor(ctx.sampleRate * dur);
    const buf  = ctx.createBuffer(1, size, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < size; i++)
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (size * 0.2));

    const src = ctx.createBufferSource();
    const hp  = ctx.createBiquadFilter();
    const g   = ctx.createGain();
    hp.type = 'highpass'; hp.frequency.value = 7000;
    src.buffer = buf;
    g.gain.value = vol;
    src.connect(hp); hp.connect(g); g.connect(dest);
    src.start();
  }

  _playBass(freq, dest) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const g   = ctx.createGain();
    const lp  = ctx.createBiquadFilter();
    osc.type = 'sawtooth';
    osc.frequency.value = freq;
    lp.type = 'lowpass'; lp.frequency.value = 320;
    g.gain.setValueAtTime(0.55, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + BEAT_MS / 1000 * 0.85);
    osc.connect(lp); lp.connect(g); g.connect(dest);
    osc.start(); osc.stop(ctx.currentTime + BEAT_MS / 1000);
  }

  _playPad(freqs, dest) {
    const ctx = this.ctx;
    freqs.forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const g    = ctx.createGain();
      const rev  = ctx.createDelay(0.4);
      osc.type = i === 0 ? 'sine' : 'triangle';
      osc.frequency.value = freq;
      osc.detune.value    = (Math.random() - 0.5) * 8; // slight chorus
      rev.delayTime.value = 0.22;
      const dur = BAR_MS / 1000;
      g.gain.setValueAtTime(0, ctx.currentTime);
      g.gain.linearRampToValueAtTime(0.065 - i * 0.012, ctx.currentTime + 0.4);
      g.gain.linearRampToValueAtTime(0, ctx.currentTime + dur - 0.1);
      osc.connect(g); g.connect(dest);
      g.connect(rev); rev.connect(dest);
      osc.start(); osc.stop(ctx.currentTime + dur);
    });
  }

  stopMain(fadems = 1200) {
    this._fadeTo(this.mainGain, 0, fadems);
  }

  /* ── Phase transitions ─────────────────────────────────── */

  transition(toPhase) {
    if (!this.initialized) return;
    if (toPhase === 'boot' && this.phase !== 'boot') {
      this.startBoot();
    } else if (toPhase === 'main' && this.phase !== 'main') {
      this.stopBoot(1400);
      setTimeout(() => this.startMain(), 600);
    } else if (toPhase === null) {
      this._clearIntervals();
      this.stopBoot(800);
      this.stopMain(800);
      this.phase = null;
    }
  }
}

export const musicEngine = new MusicEngine();

/* Auto-init on first user interaction */
if (typeof window !== 'undefined') {
  const bootstrap = () => {
    musicEngine.init();
    window.removeEventListener('click',      bootstrap);
    window.removeEventListener('keydown',    bootstrap);
    window.removeEventListener('touchstart', bootstrap);
  };
  window.addEventListener('click',      bootstrap, { once: true });
  window.addEventListener('keydown',    bootstrap, { once: true });
  window.addEventListener('touchstart', bootstrap, { once: true });
}
