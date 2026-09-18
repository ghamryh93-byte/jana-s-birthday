// ════════════════════════════════════════════════════════════
//  JANA — Visual Effects
//  ParticleSystem · Typewriter · AudioManager
// ════════════════════════════════════════════════════════════

/* ─── Particle System ───────────────────────────────────── */
export class ParticleSystem {
  constructor(canvas) {
    this.canvas  = canvas;
    this.ctx     = canvas.getContext('2d');
    this.pool    = [];
    this.running = false;
    this.raf     = null;
    this.max     = 38;

    this._resize = this._resize.bind(this);
    window.addEventListener('resize', this._resize, { passive: true });
    this._resize();
  }

  _resize() {
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  _spawn() {
    const maxAlpha = Math.random() * 0.22 + 0.05;
    // Warm romantic palette — gold, dusty rose, lavender
    const palette = [
      [212, 168, 122],  // champagne gold
      [196, 123, 142],  // dusty rose
      [170, 155, 210],  // soft lavender
      [212, 168, 122],  // gold (weighted higher)
    ];
    const c = palette[Math.floor(Math.random() * palette.length)];
    return {
      x:        Math.random() * this.canvas.width,
      y:        this.canvas.height + 12,
      size:     Math.random() * 1.4 + 0.3,
      vy:       Math.random() * 0.38 + 0.14,
      vx:       (Math.random() - 0.5) * 0.18,
      alpha:    0,
      maxAlpha,
      life:     0,
      maxLife:  Math.random() * 280 + 140,
      r: c[0], g: c[1], b: c[2],
    };
  }

  _tick() {
    // Spawn
    if (this.pool.length < this.max && Math.random() < 0.18) {
      this.pool.push(this._spawn());
    }

    // Update & cull
    this.pool = this.pool.filter(p => {
      p.life++;
      p.y -= p.vy;
      p.x += p.vx;

      const ratio = p.life / p.maxLife;
      if (ratio < 0.25) {
        p.alpha = (ratio / 0.25) * p.maxAlpha;
      } else if (ratio > 0.75) {
        p.alpha = ((1 - ratio) / 0.25) * p.maxAlpha;
      } else {
        p.alpha = p.maxAlpha;
      }

      return p.life < p.maxLife && p.y > -18;
    });

    // Draw
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.pool.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${p.alpha})`;
      ctx.fill();
    });
  }

  start() {
    this.running = true;
    const loop = () => {
      if (!this.running) return;
      this._tick();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  burst(x, y, count = 12) {
    // Burst of particles — warm rose + gold mix
    const palette = [
      [212, 168, 122],  // champagne gold
      [196, 123, 142],  // dusty rose
      [212, 168, 122],  // gold (weighted)
      [212, 168, 122],  // gold (weighted)
    ];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i;
      const speed = Math.random() * 1.5 + 0.5;
      const c = palette[Math.floor(Math.random() * palette.length)];
      this.pool.push({
        x, y,
        size:    Math.random() * 2 + 0.5,
        vy:      Math.sin(angle) * speed - 1,
        vx:      Math.cos(angle) * speed,
        alpha:   0,
        maxAlpha: 0.45,
        life:    0,
        maxLife: 80 + Math.random() * 60,
        r: c[0], g: c[1], b: c[2],
      });
    }
  }

  destroy() {
    this.stop();
    window.removeEventListener('resize', this._resize);
  }
}


/* ─── Typewriter ─────────────────────────────────────────── */
/**
 * Types text into an element character by character.
 * Adds a blinking cursor that fades out when done.
 *
 * @param {HTMLElement} el     - Target element
 * @param {string}      text   - Text to type
 * @param {number}      speed  - Base ms per character (default 55)
 * @returns {Promise<void>}    - Resolves when typing is complete
 */
export function typewrite(el, text, speed = 55) {
  return new Promise(resolve => {
    el.innerHTML = '';

    const textNode = document.createTextNode('');
    const cursor   = document.createElement('span');
    cursor.className = 'ch0-cursor';

    el.appendChild(textNode);
    el.appendChild(cursor);

    let i = 0;
    function next() {
      if (i >= text.length) {
        // Cursor lingers, then fades
        setTimeout(() => {
          cursor.style.transition = 'opacity 0.5s';
          cursor.style.opacity    = '0';
          setTimeout(() => {
            if (cursor.parentNode === el) cursor.remove();
          }, 500);
          resolve();
        }, 1800);
        return;
      }

      textNode.nodeValue = text.slice(0, ++i);
      const jitter = (Math.random() * 22) - 11;
      setTimeout(next, speed + jitter);
    }

    setTimeout(next, 80);
  });
}


/* ─── Audio Manager ──────────────────────────────────────── */
/**
 * Creates a soft ambient drone using Web Audio API oscillators.
 * Gracefully handles browsers that block AudioContext.
 */
export class AudioManager {
  constructor() {
    this.ctx        = null;
    this.masterGain = null;
    this.oscillators = [];
    this.initialized = false;
    this.muted       = false;
    this.playing     = false;
  }

  _init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      this.initialized = true;
    } catch (e) {
      // AudioContext unavailable — experience still works
    }
  }

  _addTone(freq, gainVal, type = 'sine') {
    if (!this.ctx) return;
    const osc  = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    this.oscillators.push(osc);
  }

  play() {
    this._init();
    if (!this.ctx || this.playing) return;

    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();

      // Gentle A-minor ambient drone — three harmonic overtones
      this._addTone(55.0,  0.055, 'sine');   // A1 — fundamental
      this._addTone(82.5,  0.028, 'sine');   // E2 — perfect fifth
      this._addTone(110.0, 0.018, 'sine');   // A2 — octave
      this._addTone(165.0, 0.008, 'sine');   // E3 — upper fifth (very subtle)

      if (!this.muted) {
        this.masterGain.gain.linearRampToValueAtTime(0.75, this.ctx.currentTime + 3.5);
      }
      this.playing = true;
    } catch (e) {
      // Graceful silence
    }
  }

  toggle() {
    this._init();
    this.muted = !this.muted;

    if (this.muted) {
      this.masterGain?.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.6);
    } else {
      if (!this.playing) {
        this.play();
      } else {
        if (this.ctx?.state === 'suspended') this.ctx.resume();
        this.masterGain?.gain.linearRampToValueAtTime(0.75, this.ctx.currentTime + 0.6);
      }
    }

    return this.muted;
  }

  pause() {
    if (!this.initialized || !this.masterGain) return;
    this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.2);
  }
}
