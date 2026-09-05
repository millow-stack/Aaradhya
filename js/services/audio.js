/**
 * Aaradhya — Web Audio API Synthesizer & Devotional Sound Engine
 * Zero external dependencies. Uses browser Web Audio API to create authentic
 * Tanpura drone harmonics (Sa, Pa, Sa', High Sa) and reverberant temple bell chimes.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.AaradhyaAudio = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  let audioCtx = null;
  let tanpuraNodes = [];
  let isPlaying = false;

  function getAudioContext() {
    if (typeof window === 'undefined') return null;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  /**
   * Play meditative Vedic Tanpura drone with harmonic overtone frequencies:
   * Sa (138.59 Hz), Pa (207.65 Hz), Sa' (277.18 Hz), High Sa (554.37 Hz)
   */
  function startTanpuraDrone() {
    const ctx = getAudioContext();
    if (!ctx) return false;

    stopTanpuraDrone();

    const freqs = [138.59, 207.65, 277.18, 554.37];
    freqs.forEach((freq, idx) => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Natural soft acoustic timbre: alternating sine & triangle waves
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Gentle ambient volume
        const volume = 0.035 / (idx + 1);
        gain.gain.setValueAtTime(volume, ctx.currentTime);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        tanpuraNodes.push({ osc, gain });
      } catch (err) {
        console.warn('Audio oscillator start failed', err);
      }
    });

    isPlaying = true;
    return true;
  }

  /**
   * Stop active Tanpura drone smoothly
   */
  function stopTanpuraDrone() {
    if (tanpuraNodes.length > 0) {
      tanpuraNodes.forEach(node => {
        try {
          node.gain.gain.exponentialRampToValueAtTime(0.0001, (audioCtx ? audioCtx.currentTime : 0) + 0.3);
          setTimeout(() => {
            try {
              node.osc.stop();
              node.osc.disconnect();
            } catch (e) {}
          }, 350);
        } catch (e) {
          try { node.osc.stop(); } catch (ign) {}
        }
      });
      tanpuraNodes = [];
    }
    isPlaying = false;
  }

  /**
   * Play high-resonance brass Temple Bell chime with decaying overtones
   */
  function playTempleBell() {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      // Fundamental 880Hz (A5) with bell harmonic overtone 1760Hz
      const fundamental = ctx.createOscillator();
      const overtone = ctx.createOscillator();
      const masterGain = ctx.createGain();

      fundamental.type = 'sine';
      fundamental.frequency.setValueAtTime(880, ctx.currentTime);
      fundamental.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 1.2);

      overtone.type = 'triangle';
      overtone.frequency.setValueAtTime(1760, ctx.currentTime);
      overtone.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.9);

      masterGain.gain.setValueAtTime(0.25, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

      fundamental.connect(masterGain);
      overtone.connect(masterGain);
      masterGain.connect(ctx.destination);

      fundamental.start();
      overtone.start();

      fundamental.stop(ctx.currentTime + 1.2);
      overtone.stop(ctx.currentTime + 1.2);
    } catch (e) {
      // Safe fallback on mobile browsers with strict autoplay policies
    }
  }

  /**
   * Mobile device tactile haptic feedback
   */
  function triggerHaptic(durationMs = 35) {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate([durationMs]); } catch (e) {}
    }
  }

  return {
    startTanpuraDrone,
    stopTanpuraDrone,
    playTempleBell,
    triggerHaptic,
    isPlaying: () => isPlaying
  };
}));
