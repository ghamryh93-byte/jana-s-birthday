// ════════════════════════════════════════════════════════════
//  JANA — Chapter Transitions
// ════════════════════════════════════════════════════════════

export class Transitions {
  constructor(curtainEl) {
    this.curtain = curtainEl;
  }

  /** Returns a Promise that resolves after `ms` milliseconds */
  _wait(ms) { return new Promise(r => setTimeout(r, ms)); }

  /**
   * Crossfade transition:
   * Fades to black → executes callback (content swap) → fades back in.
   *
   * @param {Function} callback   - Async content-swap function
   * @param {number}   inDur      - Fade-out duration (ms)
   * @param {number}   outDur     - Fade-in duration (ms)
   */
  async dissolve(callback, inDur = 500, outDur = 620) {
    const el = this.curtain;

    // ── Cover ──
    el.style.transition = `opacity ${inDur}ms cubic-bezier(0.4,0,0.2,1)`;
    el.classList.add('active');
    await this._wait(inDur + 40);

    // ── Swap content ──
    await callback();
    await this._wait(60);  // Allow paint frame before revealing

    // ── Reveal ──
    el.style.transition = `opacity ${outDur}ms cubic-bezier(0.4,0,0.2,1)`;
    el.classList.remove('active');
    await this._wait(outDur);
  }

  /**
   * Instant transition (no animation).
   * Used for restart / emergency navigation.
   */
  async instant(callback) {
    const el = this.curtain;
    el.style.transition = 'none';
    el.classList.add('active');
    await callback();
    await this._wait(80);
    el.style.transition = 'opacity 0.5s cubic-bezier(0.4,0,0.2,1)';
    el.classList.remove('active');
    await this._wait(500);
  }
}
