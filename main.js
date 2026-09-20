// ════════════════════════════════════════════════════════════
//  JANA — Entry Point & Chapter Manager
//  Boots the experience, wires all systems together.
// ════════════════════════════════════════════════════════════

import { CONTENT }        from './content.js?v=17';
import { ParticleSystem, AudioManager } from './effects.js';
import { Transitions }    from './transitions.js';
import { Chapters }       from './chapters.js?v=17';

// ─── Birthday detection ───────────────────────────────────
const isBirthday = (() => {
  const d = new Date();
  return (
    d.getMonth() === CONTENT.birthday.month - 1 &&
    d.getDate()  === CONTENT.birthday.day
  );
})();

if (isBirthday) document.body.classList.add('birthday-mode');

// ─── Particle system ─────────────────────────────────────
const canvas    = document.getElementById('particles');
const particles = new ParticleSystem(canvas);
particles.start();

// ─── Audio manager ───────────────────────────────────────
const audio = new AudioManager();

// ─── Transitions ─────────────────────────────────────────
const transitions = new Transitions(document.getElementById('curtain'));

// ─── UI References ───────────────────────────────────────
const container    = document.getElementById('chapter');
const progressFill = document.getElementById('progress-fill');
const audioBtn     = document.getElementById('audio-btn');
const audioIcon    = document.getElementById('audio-icon');
const lightbox     = document.getElementById('lightbox');
const lightboxImg  = document.getElementById('lightbox-img');
const lightboxCap  = document.getElementById('lightbox-caption');
const toastEl      = document.getElementById('toast');

// ─── Progress bar ─────────────────────────────────────────
function updateProgress(index) {
  const pct = (index / (Chapters.length - 1)) * 100;
  progressFill.style.width = pct + '%';
}

// ─── Audio button ─────────────────────────────────────────
audioBtn.addEventListener('click', () => {
  const muted = audio.toggle();
  audioIcon.textContent = muted ? '♪̶' : '♪';
  audioBtn.classList.toggle('muted', muted);
});

// ─── Lightbox ─────────────────────────────────────────────
function openLightbox(src, caption) {
  lightboxImg.src          = src;
  lightboxCap.textContent  = caption || '';
  lightbox.classList.add('active');
  lightbox.setAttribute('aria-hidden', 'false');
  document.getElementById('lightbox-close').focus();
}

function closeLightbox() {
  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden', 'true');
}

document.getElementById('lightbox-close')
  .addEventListener('click', closeLightbox);

lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

// ─── Toast ────────────────────────────────────────────────
let toastTimer;
function showToast(message, duration = 3200) {
  clearTimeout(toastTimer);
  toastEl.textContent = message;
  toastEl.classList.add('visible');
  toastTimer = setTimeout(() => toastEl.classList.remove('visible'), duration);
}

// ─── Utilities object (passed into every chapter) ─────────
const utils = { openLightbox, showToast, particles, audio };

// ─── Chapter manager ──────────────────────────────────────
let currentIndex    = -1;
let isTransitioning = false;

async function goto(index) {
  // Guard: no out-of-bounds, no double transition
  if (isTransitioning || index < 0 || index >= Chapters.length) return;
  isTransitioning = true;

  const chapter = Chapters[index];
  const advance = () => goto(index + 1);

  await transitions.dissolve(async () => {
    // Teardown current chapter (clear DOM + scroll)
    container.innerHTML  = '';
    container.scrollTop  = 0;

    // Render next chapter
    chapter.render(container, advance, utils);

    currentIndex = index;
    updateProgress(index);
  });

  isTransitioning = false;

  // Show audio button + start ambient tone from chapter 1 onward
  if (index >= 1) {
    audioBtn.classList.add('visible');
    audio.play();
  }
}

// ─── Easter egg: Konami-ish key sequence on desktop ───────
//  Type "jana" at any point to trigger a particle burst
let keyBuffer = '';
document.addEventListener('keydown', e => {
  keyBuffer = (keyBuffer + e.key.toLowerCase()).slice(-4);
  if (keyBuffer === 'jana') {
    keyBuffer = '';
    particles.burst(window.innerWidth / 2, window.innerHeight / 2, 20);
    showToast('✦ jana ✦');
  }
});

// ─── Boot ─────────────────────────────────────────────────
goto(0);
