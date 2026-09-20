// ════════════════════════════════════════════════════════════
//  JANA — All Chapters
//  Each chapter: { render(container, advance, utils) }
//  advance() → triggers the transition to the next chapter
//  utils → { openLightbox, showToast, particles, audio }
// ════════════════════════════════════════════════════════════

import { CONTENT }    from './content.js?v=4';
import { typewrite }  from './effects.js';

// ─── Helper: delay ────────────────────────────────────────
const delay = ms => new Promise(r => setTimeout(r, ms));

// ─── Helper: IntersectionObserver for scroll-reveal ───────
function scrollReveal(elements, opts = {}) {
  const {
    threshold  = 0.12,
    margin     = '0px 0px -40px 0px',
    staggerMs  = 90,
    delayStart = 0,
  } = opts;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const i = parseInt(entry.target.dataset.reveal || '0');
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delayStart + i * staggerMs);
      obs.unobserve(entry.target);
    });
  }, { threshold, rootMargin: margin });

  elements.forEach((el, i) => {
    el.dataset.reveal = i;
    obs.observe(el);
  });

  return obs;
}

// ─── Helper: confetti burst (Chapter 5) ───────────────────
function spawnConfetti(parent) {
  const glyphs = ['✦', '✧', '◈', '◇', '⊕', '✸', '★', '◉'];
  for (let i = 0; i < 22; i++) {
    setTimeout(() => {
      const el     = document.createElement('span');
      el.className = 'ch5-confetti';
      el.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      const isGold = Math.random() > 0.45;
      el.style.cssText = [
        `left: ${Math.random() * 100}%`,
        `top:  ${Math.random() * 25 + 5}%`,
        `color: ${isGold
          ? 'rgba(212,168,122,0.7)'
          : (Math.random() > 0.5 ? 'rgba(196,123,142,0.55)' : 'rgba(170,155,210,0.55)')}`
        ,
        `font-size: ${Math.random() * 14 + 8}px`,
        `animation-duration: ${Math.random() * 2.2 + 2}s`,
        `animation-delay: ${Math.random() * 0.6}s`,
        `position: absolute`,
      ].join(';');
      parent.appendChild(el);
    }, i * 55);
  }
}

// ─── Helper: Stars canvas (Chapter 7) ─────────────────────
function initStars(canvas, golden = false) {
  if (!canvas) return;
  canvas.width  = canvas.offsetWidth  || window.innerWidth;
  canvas.height = canvas.offsetHeight || window.innerHeight;

  const ctx = canvas.getContext('2d');
  const COUNT = 90;
  const start = Date.now();

  const stars = Array.from({ length: COUNT }, () => ({
    x:     Math.random() * canvas.width,
    y:     Math.random() * canvas.height,
    r:     Math.random() * 1.4 + 0.2,
    delay: Math.random() * 3500,
    target: Math.random() * 0.38 + 0.06,
    alpha: 0,
  }));

  let running = true;

  function draw() {
    if (!running) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const elapsed = Date.now() - start;
    stars.forEach(s => {
      if (elapsed < s.delay) return;
      s.alpha = Math.min(s.alpha + 0.003, s.target);

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = golden
        ? `rgba(212,168,122,${s.alpha})`
        : `rgba(200,175,215,${s.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
  return () => { running = false; };
}


// ════════════════════════════════════════════════════════════
//  CHAPTER 0 — CINEMATIC BOOT SEQUENCE
// ════════════════════════════════════════════════════════════

const chapter0 = {
  render(container, advance, utils) {

    // ── Build the boot screen overlay (sits above everything) ──
    const boot = document.createElement('div');
    boot.className = 'boot-screen';
    boot.setAttribute('aria-hidden', 'true');
    boot.innerHTML = `
      <div class="boot-inner" id="boot-inner">
        <div class="boot-line" id="boot-l1">INITIALIZING...</div>
        <div class="boot-progress-num" id="boot-pct">0%</div>
        <div class="boot-access" id="boot-access">ACCESS GRANTED.</div>
      </div>
    `;
    document.body.appendChild(boot);

    // ── Sound nudge (discreet, non-obtrusive) ────────────────
    const soundNudge = document.createElement('button');
    soundNudge.className = 'ch0-sound-nudge';
    soundNudge.id = 'ch0-sound-nudge';
    soundNudge.setAttribute('aria-label', 'Enable ambient sound');
    soundNudge.innerHTML = `<span class="ch0-sound-dot"></span> enable sound`;
    document.body.appendChild(soundNudge);

    soundNudge.addEventListener('click', () => {
      utils.audio.toggle();
      soundNudge.classList.remove('visible');
      // Show the normal audio button
      document.getElementById('audio-btn')?.classList.add('visible');
    });

    // ── Main chapter content (hidden until boot finishes) ────
    container.innerHTML = `
      <div class="ch0" id="ch0-main">
        <h1 class="ch0-title" id="ch0-title" aria-label="JANA">
          <span class="ch0-letter" style="--i:0" aria-hidden="true">J</span>
          <span class="ch0-letter" style="--i:1" aria-hidden="true">A</span>
          <span class="ch0-letter" style="--i:2" aria-hidden="true">N</span>
          <span class="ch0-letter" style="--i:3" aria-hidden="true">A</span>
        </h1>
        <div class="ch0-line-accent" id="ch0-line-accent"></div>
        <div class="ch0-granted" id="ch0-granted">&gt; ACCESS GRANTED.</div>
        <button class="ch0-enter-btn" id="ch0-enter-btn" aria-label="Enter the experience">
          ENTER <span class="ch0-enter-arrow" aria-hidden="true">→</span>
        </button>
      </div>
    `;

    // ── Boot sequence orchestration ──────────────────────────
    const bootL1  = boot.querySelector('#boot-l1');
    const bootPct = boot.querySelector('#boot-pct');
    const bootAcc = boot.querySelector('#boot-access');

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    // Animate a percentage counter from one value to another
    async function animatePct(from, to, durationMs) {
      const steps = Math.abs(to - from);
      const stepMs = durationMs / steps;
      for (let i = from + 1; i <= to; i++) {
        await sleep(stepMs + (Math.random() * stepMs * 0.6 - stepMs * 0.3));
        bootPct.textContent = i + '%';
      }
    }

    async function runBoot() {
      // ── Phase 1: INITIALIZING... appears ──
      await sleep(320);
      bootL1.classList.add('visible');

      // ── Phase 2: percentage counter ──
      await sleep(480);
      bootPct.classList.add('visible');
      bootPct.textContent = '0%';

      await animatePct(0, 12, 520);
      await sleep(180);
      await animatePct(12, 34, 680);
      await sleep(220);
      await animatePct(34, 67, 900);
      await sleep(160);
      await animatePct(67, 99, 560);

      // ── Phase 3: pause at 99% ──
      await sleep(740);

      // ── Phase 4: hide progress, show ACCESS GRANTED ──
      bootL1.classList.add('bright');
      bootPct.style.transition = 'opacity 0.4s ease';
      bootPct.style.opacity = '0';
      await sleep(400);
      bootAcc.classList.add('visible');
      await sleep(1400);

      // ── Phase 5: boot fades out, chapter reveals ──
      boot.classList.add('fade-out');

      // Reveal main chapter content simultaneously
      const ch0Main = container.querySelector('#ch0-main');
      if (ch0Main) ch0Main.classList.add('visible');

      await sleep(600);

      // ── Phase 6: cursor blink then JANA reveal ──
      // JANA letters appear
      container.querySelectorAll('.ch0-letter').forEach(el => {
        el.classList.add('visible');
      });

      // Line accent
      await sleep(200);
      const lineAccent = container.querySelector('#ch0-line-accent');
      if (lineAccent) lineAccent.classList.add('visible');

      // ── Phase 7: "> ACCESS GRANTED." below JANA ──
      await sleep(900);
      const granted = container.querySelector('#ch0-granted');
      if (granted) granted.classList.add('visible');

      // ── Phase 8: ENTER button ──
      await sleep(800);
      const enterBtn = container.querySelector('#ch0-enter-btn');
      if (enterBtn) {
        enterBtn.classList.add('visible');

        // Wire click immediately — button is now live
        enterBtn.addEventListener('click', () => {
          // Unlock audio on first user gesture
          utils.audio.play();
          soundNudge.classList.remove('visible');
          document.getElementById('audio-btn')?.classList.add('visible');
          // Visual feedback
          enterBtn.style.pointerEvents = 'none';
          enterBtn.style.opacity = '0.4';
          advance();
        });
      }

      // ── Phase 9: discreet sound nudge ──
      await sleep(1200);
      soundNudge.classList.add('visible');

      // ── Remove boot DOM after fully invisible (fire-and-forget) ──
      sleep(1000).then(() => { if (boot.parentNode) boot.remove(); });
    }

    // ── Easter egg: tap JANA title 5× ──
    let titleTaps = 0;
    container.querySelector('#ch0-title')?.addEventListener('click', e => {
      e.stopPropagation();
      titleTaps++;
      if (titleTaps >= 5) {
        titleTaps = 0;
        const title = container.querySelector('#ch0-title');
        title.style.transition = 'text-shadow 0.3s';
        title.style.textShadow = '0 0 120px rgba(196,123,142,0.55), 0 0 240px rgba(139,122,171,0.2)';
        setTimeout(() => { title.style.textShadow = ''; }, 700);
        utils.particles.burst(window.innerWidth / 2, window.innerHeight / 2, 16);
      }
    });

    runBoot();
  },
};


// ════════════════════════════════════════════════════════════
//  CHAPTER 1 — JANA DATABASE
// ════════════════════════════════════════════════════════════

const chapter1 = {
  render(container, advance /*, utils */) {
    const db = CONTENT.database;

    const fieldsHTML = db.fields.map((f, i) => `
      <div class="ch1-field" data-reveal="${i}">
        <span class="ch1-field-label">${escHtml(f.label)}</span>
        <span class="ch1-field-value">${escHtml(f.value)}</span>
      </div>
    `).join('');

    const traitsHTML = db.traits.map(t =>
      `<span class="ch1-trait">${escHtml(t)}</span>`
    ).join('');

    container.innerHTML = `
      <div class="ch1">

        <div class="ch1-header">
          <span class="ch1-classified">Classified</span>
          <div class="ch1-fileno">
            File No.
            <span>JANA · ${CONTENT.age}</span>
          </div>
        </div>

        <div class="ch1-subject-title">${escHtml(CONTENT.name)}</div>
        <div class="ch1-subject-tag">Personnel File &mdash; Birthday Protocol Active</div>

        <div class="ch1-photo-area">
          <div class="ch1-photo-frame">
            <img src="${escHtml(db.photo)}"
                 alt="Subject: ${escHtml(CONTENT.name)}"
                 onerror="this.style.display='none';">
            <div class="ch1-heart-overlay" aria-hidden="true">
              <span class="ch1-heart-char">&#x2665;</span>
            </div>
            <div class="ch1-photo-label">Subject identified</div>
          </div>

          <div class="ch1-stamps">
            <div class="ch1-stamp">
              <span class="ch1-stamp-label">Age</span>
              <span class="ch1-stamp-value">${CONTENT.age}</span>
            </div>
            <div class="ch1-threat">
              <div class="ch1-threat-label">Threat Level</div>
              <div class="ch1-threat-value">${escHtml(db.threatLevel)}</div>
            </div>
          </div>
        </div>

        <div class="ch1-fields" id="ch1-fields">
          ${fieldsHTML}
        </div>

        <div class="ch1-traits-section">
          <div class="ch1-traits-title">Known Attributes</div>
          <div class="ch1-traits-grid">${traitsHTML}</div>
        </div>

        <div class="ch1-warning">
          <p class="ch1-warning-text">${escHtml(db.dangerWarning)}</p>
        </div>

        <div class="ch1-proceed-area">
          <button class="proceed-btn" id="ch1-proceed">Access Photo Archive</button>
        </div>

      </div>
    `;

    // Scroll-reveal for fields
    scrollReveal(
      [...container.querySelectorAll('.ch1-field')],
      { staggerMs: 80, threshold: 0.05 }
    );

    container.querySelector('#ch1-proceed')
      .addEventListener('click', advance);
  },
};


// ════════════════════════════════════════════════════════════
//  CHAPTER 2 — MEMORY ARCHIVE
// ════════════════════════════════════════════════════════════

const chapter2 = {
  render(container, advance, utils) {
    const memoriesHTML = CONTENT.memories.map((m, i) => `
      <div class="ch2-memory" data-reveal="${i}">
        <div class="ch2-memory-icon" aria-hidden="true">${m.icon}</div>
        <div class="ch2-memory-meta">
          <span class="ch2-memory-id">${escHtml(m.id)}</span>
          <span class="ch2-memory-date">${escHtml(m.date)}</span>
        </div>
        <div class="ch2-memory-card" data-has-note="${m.hiddenNote ? '1' : '0'}">
          <div class="ch2-memory-title">${escHtml(m.title)}</div>
          <div class="ch2-memory-text">${escHtml(m.description)}</div>
          ${m.hiddenNote
            ? `<div class="ch2-memory-note">${escHtml(m.hiddenNote)}</div>`
            : ''}
        </div>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="ch2">
        <div class="ch2-chapter-header">
          <div class="section-tag">Memory Archive</div>
          <div class="divider"></div>
          <h2 class="chapter-title">Things That Happened</h2>
          <p class="chapter-subtitle" style="margin-top:12px">
            A selection of recovered moments
          </p>
        </div>

        <div class="ch2-timeline">
          <div class="ch2-timeline-line" aria-hidden="true"></div>
          ${memoriesHTML}
        </div>

        <div style="text-align:center; margin-top:44px;">
          <button class="proceed-btn" id="ch2-proceed">Photo Archive</button>
        </div>
      </div>
    `;

    // Scroll-reveal memories
    scrollReveal(
      [...container.querySelectorAll('.ch2-memory')],
      { staggerMs: 110, threshold: 0.12, margin: '0px 0px -60px 0px' }
    );

    // Easter egg: long-press memory card with a hidden note
    container.querySelectorAll('.ch2-memory-card[data-has-note="1"]').forEach(card => {
      let pressTimer;

      const startPress = () => {
        pressTimer = setTimeout(() => {
          card.classList.add('note-revealed');
          utils.showToast('hidden note revealed ✦');
        }, 750);
      };
      const endPress = () => clearTimeout(pressTimer);

      card.addEventListener('pointerdown', startPress);
      card.addEventListener('pointerup',   endPress);
      card.addEventListener('pointerleave', endPress);
      card.addEventListener('contextmenu', e => e.preventDefault()); // prevent long-press menu on mobile
    });

    container.querySelector('#ch2-proceed')
      .addEventListener('click', advance);
  },
};


// ════════════════════════════════════════════════════════════
//  CHAPTER 3 — PHOTO ARCHIVE
// ════════════════════════════════════════════════════════════

const chapter3 = {
  render(container, advance, utils) {
    const photosHTML = CONTENT.photos.map((p, i) => `
      <div class="ch3-photo-item" data-reveal="${i}">
        <div class="ch3-photo-inner" role="button" tabindex="0"
             aria-label="Open photo: ${escHtml(p.caption)}">
          <img src="${escHtml(p.src)}"
               alt="${escHtml(p.caption)}"
               loading="lazy"
               onerror="this.parentElement.classList.add('no-img')">
          <div class="ch3-photo-label">${escHtml(p.label)}</div>
          <div class="ch3-photo-caption">${escHtml(p.caption)}</div>
        </div>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="ch3">
        <div class="ch3-chapter-header">
          <div class="section-tag">Photo Archive</div>
          <div class="divider"></div>
          <h2 class="chapter-title">Recovered Material</h2>
          <p class="chapter-subtitle" style="margin-top:12px">
            Handle with care
          </p>
        </div>

        <div class="ch3-grid" id="ch3-grid">
          ${photosHTML}
        </div>

        <div style="text-align:center; margin-top:44px;">
          <button class="proceed-btn" id="ch3-proceed">The Songs</button>
        </div>
      </div>
    `;

    // Scroll-reveal photos
    scrollReveal(
      [...container.querySelectorAll('.ch3-photo-item')],
      { staggerMs: 95, threshold: 0.08 }
    );

    // Lightbox on click / enter
    container.querySelectorAll('.ch3-photo-inner').forEach((el, i) => {
      const open = () => {
        const photo = CONTENT.photos[i];
        if (photo) utils.openLightbox(photo.src, photo.caption);
      };
      el.addEventListener('click', open);
      el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') open(); });
    });

    container.querySelector('#ch3-proceed')
      .addEventListener('click', advance);
  },
};


// ════════════════════════════════════════════════════════════
//  CHAPTER 4 — SONGS FOR JANA
// ════════════════════════════════════════════════════════════

const chapter4 = {
  render(container, advance, utils) {

    const songsHTML = CONTENT.songs.map((s, i) => `
      <div class="ch4-song" data-reveal="${i}" data-index="${i}">
        <div class="ch4-song-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</div>
        <div class="ch4-song-body">
          <div class="ch4-song-header">
            <div class="ch4-song-info">
              <div class="ch4-song-title">${escHtml(s.title)}</div>
              <div class="ch4-song-artist">${escHtml(s.artist)}</div>
            </div>
            <button type="button" class="ch4-play-btn" data-index="${i}"
                    aria-label="Play ${escHtml(s.title)}"
                    title="Play song">
              <span class="ch4-play-icon">▶</span>
              <span class="ch4-eq" aria-hidden="true">
                <span class="ch4-eq-bar"></span>
                <span class="ch4-eq-bar"></span>
                <span class="ch4-eq-bar"></span>
                <span class="ch4-eq-bar"></span>
              </span>
            </button>
          </div>
          ${s.why ? `<div class="ch4-song-why">&ldquo;${escHtml(s.why)}&rdquo;</div>` : ''}

          <div class="ch4-player" id="ch4-player-${i}">
            <div class="ch4-player-bar">
              <span class="ch4-player-time" id="ch4-time-${i}">0:00</span>
              <div class="ch4-progress-track" id="ch4-track-${i}" role="slider"
                   aria-label="Song progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
                <div class="ch4-progress-fill" id="ch4-fill-${i}"></div>
                <div class="ch4-progress-thumb" id="ch4-thumb-${i}"></div>
              </div>
              <span class="ch4-player-dur" id="ch4-dur-${i}">--:--</span>
            </div>
          </div>

          <div class="ch4-links">
            ${s.spotifyUrl ? `
              <a class="ch4-spotify" href="${escHtml(s.spotifyUrl)}"
                 target="_blank" rel="noopener noreferrer">
                ♫ Open on Spotify
              </a>
            ` : ''}
          </div>
        </div>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="ch4">
        <div class="ch4-chapter-header">
          <div class="section-tag">Sonic Archive</div>
          <div class="divider"></div>
          <h2 class="chapter-title">Songs for Jana</h2>
          <p class="chapter-subtitle" style="margin-top:12px">
            A playlist that needed to exist
          </p>
        </div>

        <div class="ch4-list">
          ${songsHTML}
        </div>

        <div style="text-align:center; margin-top:44px;">
          <button class="proceed-btn" id="ch4-proceed">Twenty&thinsp;One</button>
        </div>
      </div>
    `;

    // ── Helper: Format seconds ──
    const fmt = t => {
      if (!t || isNaN(t) || t < 0) return '0:00';
      const m = Math.floor(t / 60);
      const s = String(Math.floor(t % 60)).padStart(2, '0');
      return `${m}:${s}`;
    };

    // ── Web Audio in-memory player engine ──
    // Uses AudioContext buffers so no browser download or IDM extension can ever intercept it
    let audioCtx = null;
    function getAudioCtx() {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      return audioCtx;
    }

    const bufferCache = new Map();
    async function loadBuffer(url) {
      if (bufferCache.has(url)) return bufferCache.get(url);
      const ctx = getAudioCtx();
      const res = await fetch(encodeURI(url));
      const arrayBuf = await res.arrayBuffer();
      const audioBuf = await ctx.decodeAudioData(arrayBuf);
      bufferCache.set(url, audioBuf);
      return audioBuf;
    }

    // Preload audio files sequentially in the background
    (async () => {
      for (const s of CONTENT.songs) {
        if (s.audioFile) {
          try {
            const buf = await loadBuffer(s.audioFile);
            const idx = CONTENT.songs.indexOf(s);
            const durEl = container.querySelector(`#ch4-dur-${idx}`);
            if (durEl && buf) durEl.textContent = fmt(buf.duration);
          } catch (_) {}
        }
      }
    })();

    // Active playback state
    let activeSongIndex = -1;
    let activeSource = null;
    let activeGain = null;
    let startedTime = 0;
    let pausedTime = 0;
    let trackDuration = 0;
    let progressTimer = null;

    function stopCurrent() {
      clearInterval(progressTimer);
      progressTimer = null;

      if (activeSource) {
        try {
          activeSource.onended = null;
          activeSource.stop();
        } catch (_) {}
        activeSource = null;
      }
      if (activeSongIndex !== -1) {
        const prevBtn = container.querySelector(`.ch4-play-btn[data-index="${activeSongIndex}"]`);
        if (prevBtn) prevBtn.classList.remove('playing');
      }
    }

    async function playSong(index, offset = 0) {
      const s = CONTENT.songs[index];
      if (!s) return;

      const playBtn = container.querySelector(`.ch4-play-btn[data-index="${index}"]`);
      const player = container.querySelector(`#ch4-player-${index}`);
      const fill = container.querySelector(`#ch4-fill-${index}`);
      const thumb = container.querySelector(`#ch4-thumb-${index}`);
      const timeEl = container.querySelector(`#ch4-time-${index}`);
      const durEl = container.querySelector(`#ch4-dur-${index}`);

      stopCurrent();
      utils.audio?.pause();

      activeSongIndex = index;
      if (playBtn) playBtn.classList.add('playing');
      if (player) player.classList.add('visible');

      const ctx = getAudioCtx();
      if (ctx.state === 'suspended') await ctx.resume();

      try {
        const buffer = await loadBuffer(s.audioFile);
        trackDuration = buffer.duration;
        if (durEl) durEl.textContent = fmt(trackDuration);

        const source = ctx.createBufferSource();
        const gain = ctx.createGain();
        source.buffer = buffer;
        source.connect(gain);
        gain.connect(ctx.destination);

        activeSource = source;
        activeGain = gain;
        startedTime = ctx.currentTime - offset;
        pausedTime = offset;

        source.onended = () => {
          if (activeSource === source) {
            stopCurrent();
            if (fill) fill.style.width = '0%';
            if (thumb) thumb.style.left = '0%';
            if (timeEl) timeEl.textContent = '0:00';
            activeSongIndex = -1;
            pausedTime = 0;
            utils.audio?.play();
          }
        };

        source.start(0, offset);

        progressTimer = setInterval(() => {
          if (!activeSource) return;
          const cur = Math.max(0, ctx.currentTime - startedTime);
          if (timeEl) timeEl.textContent = fmt(cur);
          if (fill && trackDuration > 0) {
            const pct = Math.min(100, (cur / trackDuration) * 100);
            fill.style.width = pct + '%';
            if (thumb) thumb.style.left = pct + '%';
          }
        }, 100);

      } catch (err) {
        console.error('Audio playback error:', err);
        stopCurrent();
        activeSongIndex = -1;
        if (playBtn) playBtn.classList.remove('playing');
      }
    }

    function pauseCurrent() {
      if (!activeSource || activeSongIndex === -1) return;
      const ctx = getAudioCtx();
      pausedTime = Math.max(0, ctx.currentTime - startedTime);
      const btn = container.querySelector(`.ch4-play-btn[data-index="${activeSongIndex}"]`);
      if (btn) btn.classList.remove('playing');
      stopCurrent();
      utils.audio?.play();
    }

    // ── Setup listeners for each song ──
    CONTENT.songs.forEach((s, i) => {
      const playBtn = container.querySelector(`.ch4-play-btn[data-index="${i}"]`);
      const track = container.querySelector(`#ch4-track-${i}`);
      const fill = container.querySelector(`#ch4-fill-${i}`);
      const thumb = container.querySelector(`#ch4-thumb-${i}`);
      const timeEl = container.querySelector(`#ch4-time-${i}`);

      if (!playBtn) return;

      playBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (activeSongIndex === i && activeSource) {
          // Pause currently playing song
          pauseCurrent();
        } else if (activeSongIndex === i && !activeSource) {
          // Resume from where it was paused
          playSong(i, pausedTime);
        } else {
          // Play new song from start
          pausedTime = 0;
          playSong(i, 0);
        }
      });

      // Seek on progress track click
      if (track) {
        track.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!trackDuration) return;

          const rect = track.getBoundingClientRect();
          const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
          const seekTo = pct * trackDuration;

          if (fill) fill.style.width = (pct * 100) + '%';
          if (thumb) thumb.style.left = (pct * 100) + '%';
          if (timeEl) timeEl.textContent = fmt(seekTo);

          playSong(i, seekTo);
        });
      }
    });

    // Teardown when advancing to next chapter
    const advanceBtn = container.querySelector('#ch4-proceed');
    advanceBtn.addEventListener('click', (e) => {
      e.preventDefault();
      stopCurrent();
      activeSongIndex = -1;
      pausedTime = 0;
      utils.audio?.play();
      advance();
    });

    // Scroll-reveal songs
    scrollReveal(
      [...container.querySelectorAll('.ch4-song')],
      { staggerMs: 120, threshold: 0.1 }
    );
  },
};


// ════════════════════════════════════════════════════════════
//  CHAPTER 5 — 21
// ════════════════════════════════════════════════════════════

const chapter5 = {
  render(container, advance /*, utils */) {

    container.innerHTML = `
      <div class="ch5">
        <div class="ch5-number-wrap">
          <div class="ch5-number" id="ch5-num" aria-label="21">21</div>
        </div>

        <div class="ch5-divider" id="ch5-divider" aria-hidden="true"></div>

        <p class="ch5-message" id="ch5-msg"></p>

        <div class="ch5-btn-area" id="ch5-btn">
          <button class="proceed-btn" id="ch5-proceed">There&rsquo;s more</button>
        </div>
      </div>
    `;

    const numEl   = container.querySelector('#ch5-num');
    const divEl   = container.querySelector('#ch5-divider');
    const msgEl   = container.querySelector('#ch5-msg');
    const btnArea = container.querySelector('#ch5-btn');
    const ch5div  = container.querySelector('.ch5');

    // Set message text (preserves line breaks via white-space:pre-line, parses **bold**)
    msgEl.innerHTML = escHtml(CONTENT.message21)
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // ── Sequential reveal ──
    requestAnimationFrame(() => {
      // 1. Number appears (outline)
      numEl.classList.add('visible');

      // 2. Confetti burst
      setTimeout(() => spawnConfetti(ch5div), 450);

      // 3. Number fills in + divider
      setTimeout(() => {
        numEl.classList.add('revealed');
        divEl.classList.add('visible');
      }, 1300);

      // 4. Message
      setTimeout(() => msgEl.classList.add('visible'), 2000);

      // 5. Button
      setTimeout(() => btnArea.classList.add('visible'), 3200);
    });

    container.querySelector('#ch5-proceed')
      .addEventListener('click', advance);
  },
};


// ════════════════════════════════════════════════════════════
//  CHAPTER 6 — DO NOT OPEN
// ════════════════════════════════════════════════════════════

const chapter6 = {
  render(container, advance, utils) {

    container.innerHTML = `
      <div class="ch6">
        <p class="ch6-alert" id="ch6-alert">⚠ &nbsp; unauthorized territory &nbsp; ⚠</p>

        <div class="ch6-vault-ring" id="ch6-vault"
             role="button" tabindex="0" aria-label="Vault — tap to attempt opening">
          <span class="ch6-lock" id="ch6-lock" aria-hidden="true">🔒</span>
        </div>

        <h2 class="ch6-title" id="ch6-title">DO NOT OPEN</h2>

        <p class="ch6-sub" id="ch6-sub">
          You were told not to open this.<br>
          This was supposed to stay locked.
        </p>

        <button class="ch6-open-btn" id="ch6-open-btn">Force Open</button>
      </div>
    `;

    // ── Vault open sequence ──
    let opened = false;
    let shookN = 0;

    const vaultEl = container.querySelector('#ch6-vault');
    const lockEl  = container.querySelector('#ch6-lock');
    const openBtn = container.querySelector('#ch6-open-btn');
    const hideEls = ['#ch6-alert', '#ch6-vault', '#ch6-title', '#ch6-sub', '#ch6-open-btn']
                      .map(sel => container.querySelector(sel));

    function shakeVault() {
      vaultEl.classList.remove('shaking');
      void vaultEl.offsetWidth; // Trigger reflow so animation restarts
      vaultEl.classList.add('shaking');
    }

    async function openVault() {
      if (opened) return;
      opened = true;

      // Final dramatic shake
      shakeVault();
      await delay(520);

      // Lock switches to open
      lockEl.textContent = '🔓';

      // White flash
      const flash = document.createElement('div');
      flash.style.cssText = 'position:fixed;inset:0;background:rgba(255,255,255,0.12);z-index:8500;pointer-events:none;transition:opacity 0.4s;';
      document.body.appendChild(flash);
      setTimeout(() => {
        flash.style.opacity = '0';
        setTimeout(() => flash.remove(), 420);
      }, 100);

      // Fade out vault elements
      hideEls.forEach(el => {
        if (!el) return;
        el.style.transition = 'opacity 0.5s';
        el.style.opacity    = '0';
      });

      await delay(600);

      // Go straight to the final Dear Jana page
      utils.showToast('you opened it anyway 🔓');
      await delay(200);
      advance();
    }

    // Tapping vault before using the button → shake warning
    vaultEl.addEventListener('click', () => {
      if (opened) return;
      shookN++;
      shakeVault();
      if (shookN >= 3) openVault();
    });
    vaultEl.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') vaultEl.click();
    });

    openBtn.addEventListener('click', openVault);
  },
};


// ════════════════════════════════════════════════════════════
//  CHAPTER 7 — FINAL CINEMATIC ENDING
// ════════════════════════════════════════════════════════════

const chapter7 = {
  render(container, advance, utils) {
    const isBirthday = document.body.classList.contains('birthday-mode');
    const { finalLetter, createdBy } = CONTENT;

    container.innerHTML = `
      <div class="ch7">
        <canvas class="ch7-stars-canvas" id="ch7-stars" aria-hidden="true"></canvas>

        ${isBirthday ? `
          <div class="ch7-birthday-badge">✦ &nbsp; September 21 &nbsp; ✦</div>
        ` : ''}

        <div class="ch7-content">
          <div class="ch7-opener" id="ch7-opener">Dear Jana,</div>

          <div class="ch7-letter-body" id="ch7-body"></div>

          <div class="ch7-signature" id="ch7-sig">
            &mdash; ${escHtml(createdBy)}
          </div>
        </div>

        <div class="ch7-credits" id="ch7-credits">
          <div class="ch7-credits-main">Made with care</div>
          <div class="ch7-credits-sub">For Jana &nbsp;✦&nbsp; September 21</div>
          <button class="ch7-restart" id="ch7-restart">← Start over</button>
        </div>
      </div>
    `;

    // Set letter text — RTL for Arabic, line breaks into paragraphs
    const bodyEl = container.querySelector('#ch7-body');
    bodyEl.setAttribute('dir', 'rtl');
    bodyEl.style.textAlign = 'right';
    bodyEl.style.fontFamily = "'Playfair Display', 'Georgia', 'Amiri', serif";
    // Convert blank lines to paragraph breaks, **bold** to <strong>
    const paragraphs = escHtml(finalLetter || '')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .split(/\n\n+/)
      .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
      .join('');
    bodyEl.innerHTML = paragraphs;

    // Stars
    const canvas = container.querySelector('#ch7-stars');
    // Delay so the canvas has laid out properly
    setTimeout(() => initStars(canvas, isBirthday), 100);

    // Sequential reveal
    const reveal = (sel, baseDelay) => {
      setTimeout(() => {
        container.querySelector(sel)?.classList.add('visible');
      }, baseDelay);
    };

    reveal('#ch7-opener',   900);
    reveal('#ch7-body',    1500);
    reveal('#ch7-sig',     2300);
    reveal('#ch7-credits', 3200);

    // Restart → dissolve back to intro
    container.querySelector('#ch7-restart').addEventListener('click', () => {
      // Reload is the cleanest way to restart the entire experience
      window.location.reload();
    });

    // Easter egg: triple-tap credits
    let creditsTaps = 0;
    container.querySelector('#ch7-credits').addEventListener('click', () => {
      creditsTaps++;
      if (creditsTaps >= 3) {
        creditsTaps = 0;
        utils.showToast('thank you for everything ♡');
        utils.particles?.burst(
          window.innerWidth / 2,
          window.innerHeight / 2,
          16
        );
      }
    });
  },
};


// ════════════════════════════════════════════════════════════
//  EXPORT — Chapter registry (order = play order)
// ════════════════════════════════════════════════════════════

export const Chapters = [
  chapter0,   // 0 — Cinematic Intro
  chapter1,   // 1 — JANA Database
  chapter3,   // 2 — Photo Archive
  chapter4,   // 3 — Songs
  chapter5,   // 4 — 21
  chapter6,   // 5 — Do Not Open
  chapter7,   // 6 — Final Ending
];


// ─── Utility: safe HTML escaping ─────────────────────────
function escHtml(str = '') {
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#039;');
}
