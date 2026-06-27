/* ─── Procedural Web Audio sound engine ─────────────────────────────────────
   All sounds are synthesized — zero external files.
   AudioContext is created lazily on first user interaction to satisfy
   browser autoplay policies.
──────────────────────────────────────────────────────────────────────────── */

class SoundEngine {
  constructor() {
    this.ctx          = null;
    this.masterGain   = null;
    this.initialized  = false;
    this.muted        = false;
    this.volume       = 0.35;
  }

  /* Call once after any user gesture */
  init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.volume;
      this.masterGain.connect(this.ctx.destination);
      this.initialized = true;
    } catch (e) { /* audio not available */ }
  }

  _resume() {
    if (this.ctx?.state === 'suspended') this.ctx.resume();
  }

  _ok() {
    if (!this.initialized || this.muted) return false;
    this._resume();
    return true;
  }

  setMuted(m) {
    this.muted = m;
    if (this.masterGain) this.masterGain.gain.value = m ? 0 : this.volume;
  }

  setVolume(v) {
    this.volume = v;
    if (this.masterGain && !this.muted) this.masterGain.gain.value = v;
  }

  /* ── Typewriter / key click ────────────────── */
  click(vol = 0.22) {
    if (!this._ok()) return;
    const ctx = this.ctx;
    const size = Math.floor(ctx.sampleRate * 0.014);
    const buf  = ctx.createBuffer(1, size, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < size; i++)
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (size * 0.12));

    const src  = ctx.createBufferSource();
    const gain = ctx.createGain();
    const filt = ctx.createBiquadFilter();
    filt.type = 'highpass';
    filt.frequency.value = 800;
    src.buffer = buf;
    gain.gain.value = vol;
    src.connect(filt); filt.connect(gain); gain.connect(this.masterGain);
    src.start();
  }

  /* ── Short square-wave beep (terminal OK) ──── */
  beep(freq = 880, duration = 0.06, vol = 0.1) {
    if (!this._ok()) return;
    const ctx  = this.ctx;
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain); gain.connect(this.masterGain);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration + 0.01);
  }

  /* ── SOC boot startup chime (ascending) ─────── */
  startup() {
    [220, 330, 440, 660, 1100].forEach((f, i) =>
      setTimeout(() => this.beep(f, 0.14, 0.09), i * 110)
    );
  }

  /* ── ACCESS GRANTED — 3 rising sine tones ─── */
  granted() {
    [660, 880, 1320].forEach((f, i) =>
      setTimeout(() => this.beep(f, 0.1, 0.13), i * 65)
    );
  }

  /* ── ACCESS DENIED — sawtooth descend buzz ─── */
  denied() {
    if (!this._ok()) return;
    const ctx  = this.ctx;
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.28);
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
    osc.connect(gain); gain.connect(this.masterGain);
    osc.start(); osc.stop(ctx.currentTime + 0.3);
  }

  /* ── ALERT — triple warning pulse ─────────── */
  alert() {
    [0, 170, 340].forEach(d =>
      setTimeout(() => this.beep(440, 0.11, 0.15), d)
    );
  }

  /* ── RGB screen glitch burst ───────────────── */
  glitch(intensity = 1) {
    if (!this._ok()) return;
    const ctx  = this.ctx;
    const dur  = 0.18 * intensity;
    const size = Math.floor(ctx.sampleRate * dur);
    const buf  = ctx.createBuffer(1, size, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < size; i++)
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (size * 0.35));

    const src  = ctx.createBufferSource();
    const bp   = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    bp.type = 'bandpass'; bp.frequency.value = 1400; bp.Q.value = 0.4;
    src.buffer = buf;
    gain.gain.value = 0.28 * intensity;
    src.connect(bp); bp.connect(gain); gain.connect(this.masterGain);
    src.start();

    // Brief sub-bass thud alongside
    const osc  = ctx.createOscillator();
    const og   = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.08);
    og.gain.setValueAtTime(0.22 * intensity, ctx.currentTime);
    og.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.connect(og); og.connect(this.masterGain);
    osc.start(); osc.stop(ctx.currentTime + 0.12);
  }

  /* ── Laser scan sweep ───────────────────────── */
  sweep(rising = true) {
    if (!this._ok()) return;
    const ctx  = this.ctx;
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(rising ? 200 : 1400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(rising ? 1400 : 200, ctx.currentTime + 0.45);
    gain.gain.setValueAtTime(0.07, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
    osc.connect(gain); gain.connect(this.masterGain);
    osc.start(); osc.stop(ctx.currentTime + 0.5);
  }

  /* ── UI hover tick ──────────────────────────── */
  tick() { this.beep(1200, 0.03, 0.05); }

  /* ── Decrypt lock-in chime (per char group) ─── */
  decryptLock() { this.beep(1760, 0.04, 0.04); }
}

export const soundEngine = new SoundEngine();

/* Auto-init on first user interaction */
if (typeof window !== 'undefined') {
  const bootstrap = () => {
    soundEngine.init();
    window.removeEventListener('click',    bootstrap);
    window.removeEventListener('keydown',  bootstrap);
    window.removeEventListener('touchstart', bootstrap);
  };
  window.addEventListener('click',     bootstrap, { once: true });
  window.addEventListener('keydown',   bootstrap, { once: true });
  window.addEventListener('touchstart', bootstrap, { once: true });
}
