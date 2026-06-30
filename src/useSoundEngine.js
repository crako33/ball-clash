import { useRef, useCallback } from "react";

/**
 * Procedural sound engine for Ball Fighters.
 * All sounds are synthesised via Web Audio API – no external files.
 *
 * Usage:
 *   const { playSound, toggleMute, muted } = useSoundEngine();
 *   playSound("wallBounce", 1.0, 0, { pan: 0, depth: 0, room: 0.5 });
 */

const HEAVY_HITS = new Set([
  "explosion",
  "hammerHit",
  "armSlam",
  "chessSlam",
  "wallSlam",
  "warpSlam",
  "laserFire",
  "bigLaserFire"
]);

const ALLOWED_AUDIO_FILES = new Set([
  "/Balls%20Ready.%20Fight!.mp3",
  "/gun.mp3",
  "/shield%20hit%201.mp3",
  "/shield%20hit%202.mp3",
  "/spider%20bite.mp3",
  "/spider%20splatter%20opponent%20step.mp3",
  "/Gun%20Reload.mp3",
  "/Gun%20Shot.mp3",
  "/hammer%20hit%20new.mp3",
  "/mine%20bomb.mp3",
  "/laser%20armor%20connect%20sound.mp3",
  "/laser%20charge.mp3",
  "/laser%20fire.mp3",
  "/big%20laser.mp3",
  "/fisher%20reeling.mp3",
  "/big%20laser%20charge%20sound.mp3",
  "/laser%20sound%20charge.mp3",
  "/Spike%20Bash%20Sound.mp3",
  "/Spike%20hit%201.mp3",
  "/spike%20hit2.mp3",
  "/Saber%20hit.mp3",
  "/warp%20drag.mp3",
  "/Wave%201.mp3",
  "/Wave%202.mp3",
]);

const AUDIO_FILE_COOLDOWNS = Object.freeze({
  "/gun.mp3": 0.2,
  "/shield%20hit%201.mp3": 0.11,
  "/shield%20hit%202.mp3": 0.11,
  "/spider%20bite.mp3": 0.1,
  "/spider%20splatter%20opponent%20step.mp3": 0.18,
  "/Gun%20Reload.mp3": 0.3,
  "/Gun%20Shot.mp3": 0.14,
  "/hammer%20hit%20new.mp3": 0.16,
  "/mine%20bomb.mp3": 0.2,
  "/laser%20armor%20connect%20sound.mp3": 0.12,
  "/laser%20charge.mp3": 0.4,
  "/laser%20fire.mp3": 0.18,
  "/big%20laser.mp3": 0.4,
  "/fisher%20reeling.mp3": 0.9,
  "/big%20laser%20charge%20sound.mp3": 0.5,
  "/laser%20sound%20charge.mp3": 0.35,
  "/Spike%20Bash%20Sound.mp3": 0.22,
  "/Spike%20hit%201.mp3": 0.08,
  "/spike%20hit2.mp3": 0.08,
  "/Saber%20hit.mp3": 0.08,
  "/warp%20drag.mp3": 0.18,
  "/Wave%201.mp3": 0.35,
  "/Wave%202.mp3": 0.45,
});

const AUDIO_FILE_MAX_INSTANCES = Object.freeze({
  "/Gun%20Shot.mp3": 3,
  "/hammer%20hit%20new.mp3": 2,
  "/mine%20bomb.mp3": 2,
  "/Spike%20Bash%20Sound.mp3": 2,
  "/Spike%20hit%201.mp3": 3,
  "/spike%20hit2.mp3": 3,
  "/shield%20hit%201.mp3": 2,
  "/shield%20hit%202.mp3": 2,
  "/Saber%20hit.mp3": 3,
  "/laser%20fire.mp3": 2,
  "/big%20laser.mp3": 1,
  "/Wave%201.mp3": 2,
  "/Wave%202.mp3": 2,
});

const DEFAULT_SOUND_COOLDOWNS = Object.freeze({
  ballCollision: 90,
  wallBounce: 100,
  damage: 90,
  bulletHit: 90,
  webHit: 120,
  spiderSplatterStep: 130,
  hammerSpin: 180,
  warpDrag: 170,
  wallSlam: 160,
  explosion: 180,
  gunShot: 90,
  laserFire: 140,
  hammerHit: 130,
  hammerCharge: 220,
  shieldBlock: 120,
  shieldThrow: 100,
  shieldCatch: 110,
  spikeHit: 90,
  spikePlant: 100,
  stringTwang: 130,
  warpSlam: 180,
  cueImpact: 80,
});

const MAX_PROCEDURAL_VOICES = 34;
const MAX_FILE_VOICES = 12;

export function useSoundEngine() {
  const ctxRef = useRef(null);
  const mutedRef = useRef(false);
  const mutedStateRef = useRef(false); // for react-less read
  const masterGainRef = useRef(null);
  const masterCompressorRef = useRef(null);
  const musicGainRef = useRef(null);
  const musicTimerRef = useRef(null);
  const musicStepRef = useRef(0);
  const audioBufferCacheRef = useRef({});
  const audioBufferPromiseCacheRef = useRef({});
  const audioFileCooldownsRef = useRef({});
  const activeAudioSourcesRef = useRef({});
  const activeProceduralVoicesRef = useRef(0);
  const activeFileVoicesRef = useRef(0);
  // cooldown map: soundKey -> earliest next play time (AudioContext time)
  const cooldowns = useRef({});

  // Spatial & Saturation cache refs
  const reverbBufferRef = useRef(null);
  const waveshaperCurveRef = useRef(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      ctxRef.current = new AudioCtx();
      masterGainRef.current = ctxRef.current.createGain();
      masterGainRef.current.gain.value = 0.52;
      masterCompressorRef.current = ctxRef.current.createDynamicsCompressor();
      masterCompressorRef.current.threshold.value = -14;
      masterCompressorRef.current.knee.value = 8;
      masterCompressorRef.current.ratio.value = 6;
      masterCompressorRef.current.attack.value = 0.004;
      masterCompressorRef.current.release.value = 0.18;
      masterGainRef.current.connect(masterCompressorRef.current);
      masterCompressorRef.current.connect(ctxRef.current.destination);
      musicGainRef.current = ctxRef.current.createGain();
      musicGainRef.current.gain.value = 0.18;
      musicGainRef.current.connect(masterGainRef.current);

      // Create stream destination node to allow recording audio
      ctxRef.current.recStreamDestination = ctxRef.current.createMediaStreamDestination();
      masterCompressorRef.current.connect(ctxRef.current.recStreamDestination);
    }
    // Resume if suspended (browsers require user gesture first)
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  // ─── Low-level helpers ──────────────────────────────────────────────────────

  /** Create an OscillatorNode → GainNode chain and schedule it. */
  const osc = useCallback((ctx, dest, type, freq, vol, startAt, dur, freqEnd = null) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, startAt);
    if (freqEnd !== null) o.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 1), startAt + dur);
    g.gain.setValueAtTime(vol, startAt);
    g.gain.exponentialRampToValueAtTime(0.0001, startAt + dur);
    o.connect(g);
    g.connect(dest);
    o.start(startAt);
    o.stop(startAt + dur + 0.02);
  }, []);

  /** White-noise burst with selectable filter type */
  const noise = useCallback((ctx, dest, vol, startAt, dur, filterFreq = 2000, filterQ = 1, filterType = "bandpass") => {
    const bufLen = Math.ceil(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const f = ctx.createBiquadFilter();
    f.type = filterType;
    f.frequency.value = filterFreq;
    f.Q.value = filterQ;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, startAt);
    g.gain.exponentialRampToValueAtTime(0.0001, startAt + dur);
    src.connect(f);
    f.connect(g);
    g.connect(dest);
    src.start(startAt);
    src.stop(startAt + dur + 0.02);
  }, []);

  // ─── Cache helpers for dynamic spatial/distortion effects ─────────────────

  const getReverbBuffer = useCallback((ctx) => {
    if (!reverbBufferRef.current) {
      const duration = 1.4;
      const decay = 2.4;
      const sampleRate = ctx.sampleRate;
      const length = Math.ceil(sampleRate * duration);
      const buffer = ctx.createBuffer(2, length, sampleRate);
      const left = buffer.getChannelData(0);
      const right = buffer.getChannelData(1);

      for (let i = 0; i < length; i++) {
        const percent = i / length;
        const envelope = Math.pow(1 - percent, decay);
        left[i] = (Math.random() * 2 - 1) * envelope;
        right[i] = (Math.random() * 2 - 1) * envelope;
      }
      reverbBufferRef.current = buffer;
    }
    return reverbBufferRef.current;
  }, []);

  const getDistortionCurve = useCallback(() => {
    if (!waveshaperCurveRef.current) {
      const n_samples = 44100;
      const curve = new Float32Array(n_samples);
      for (let i = 0; i < n_samples; ++i) {
        const x = (i * 2) / n_samples - 1;
        // Warm saturation curve using hyperbolic tangent
        curve[i] = Math.tanh(x * 1.6) / Math.tanh(1.6);
      }
      waveshaperCurveRef.current = curve;
    }
    return waveshaperCurveRef.current;
  }, []);

  const duckMusic = useCallback((dur = 0.12, targetGain = 0.03) => {
    const ctx = ctxRef.current;
    if (!ctx || !musicGainRef.current || mutedRef.current) return;
    const gNode = musicGainRef.current;
    const now = ctx.currentTime;

    gNode.gain.cancelScheduledValues(now);
    gNode.gain.setValueAtTime(gNode.gain.value, now);
    gNode.gain.setTargetAtTime(targetGain, now, 0.02);
    gNode.gain.setTargetAtTime(0.18, now + dur, 0.15);
  }, []);

  const triggerHammerHitSound = useCallback((ctx, dest, t) => {
    // 1. Initial Hammer Strike (heavy wooden/metal crack)
    noise(ctx, dest, 0.75, t, 0.12, 1200, 1.5, "bandpass");
    osc(ctx, dest, "sine", 60, 0.85, t, 0.25, 25);
    osc(ctx, dest, "sawtooth", 110, 0.5, t, 0.2, 35);
    osc(ctx, dest, "triangle", 260, 0.4, t, 0.18, 90);

    // 2. Exaggerated Thunder crack (Lightning strike)
    noise(ctx, dest, 0.85, t, 0.18, 150, 0.5, "lowpass");
    noise(ctx, dest, 0.65, t, 0.15, 4500, 2.5, "highpass"); // bright lightning bolt crack

    // 3. Rolling thunder rumble (long decaying low-frequency rumble)
    const rumbleDur = 1.6;
    noise(ctx, dest, 0.45, t + 0.08, rumbleDur, 70, 0.4, "lowpass");
    
    // detuned sub-bass oscillators for rolling effect
    osc(ctx, dest, "sine", 48, 0.65, t + 0.05, rumbleDur - 0.2, 22);
    osc(ctx, dest, "sine", 52, 0.55, t + 0.1, rumbleDur - 0.1, 20);
    osc(ctx, dest, "sine", 38, 0.45, t + 0.15, rumbleDur, 18);
  }, [osc, noise]);

  // ─── Sound definitions ──────────────────────────────────────────────────────

  const sounds = useRef({
    // Generic
    wallBounce: (ctx, dest, t) => {
      noise(ctx, dest, 0.4, t, 0.08, 400, 0.8, "bandpass");
      osc(ctx, dest, "sine", 95, 0.35, t, 0.1, 45);
      osc(ctx, dest, "triangle", 180, 0.2, t, 0.06, 90);
    },
    ballCollision: (ctx, dest, t) => {
      noise(ctx, dest, 0.45, t, 0.1, 1000, 1.2, "highpass");
      osc(ctx, dest, "sine", 250, 0.35, t, 0.1, 120);
      osc(ctx, dest, "triangle", 500, 0.2, t, 0.05, 200);
    },
    damage: (ctx, dest, t) => {
      noise(ctx, dest, 0.45, t, 0.12, 1200, 1.5, "bandpass");
      osc(ctx, dest, "sawtooth", 220, 0.28, t, 0.1, 60);
      osc(ctx, dest, "square", 110, 0.18, t, 0.08, 30);
    },

    // Knife Ball
    knifeHit: (ctx, dest, t) => {
      noise(ctx, dest, 0.6, t, 0.18, 6000, 2.0, "highpass");
      osc(ctx, dest, "sawtooth", 1400, 0.25, t, 0.14, 300);
      osc(ctx, dest, "sine", 900, 0.2, t, 0.12, 800);
    },
    saberThrowHit: (ctx, dest, t) => {
      noise(ctx, dest, 0.45, t, 0.15, 8000, 1.8, "highpass");
      osc(ctx, dest, "sine", 1200, 0.35, t, 0.12, 100);
      osc(ctx, dest, "sawtooth", 1600, 0.2, t, 0.08, 1400);
      osc(ctx, dest, "triangle", 700, 0.25, t, 0.15, 80);
    },
    saberLightning: (ctx, dest, t) => {
      noise(ctx, dest, 0.85, t, 0.18, 1500, 1.5, "bandpass");
      osc(ctx, dest, "sawtooth", 180, 0.55, t, 0.22, 20);
      osc(ctx, dest, "square", 90, 0.35, t, 0.18, 40);
      for (let i = 0; i < 4; i++) {
        const crackleTime = t + 0.04 + i * 0.05;
        noise(ctx, dest, 0.38, crackleTime, 0.03, 7000, 2.5, "highpass");
        osc(ctx, dest, "triangle", 1800 - i * 300, 0.15, crackleTime, 0.02, 50);
      }
    },

    // Spike Ball
    spikeHit: (ctx, dest, t) => {
      noise(ctx, dest, 0.5, t, 0.18, 1200, 1.0, "bandpass");
      osc(ctx, dest, "sawtooth", 280, 0.35, t, 0.18, 50);
      osc(ctx, dest, "triangle", 95, 0.4, t, 0.2, 25);
    },

    // Gun Ball
    gunShot: (ctx, dest, t) => {
      noise(ctx, dest, 0.95, t, 0.28, 450, 0.6, "lowpass");
      noise(ctx, dest, 0.65, t, 0.12, 3800, 2.0, "highpass");
      osc(ctx, dest, "sine", 75, 0.85, t, 0.26, 10);
      osc(ctx, dest, "sawtooth", 190, 0.65, t, 0.16, 40);
      osc(ctx, dest, "square", 120, 0.35, t, 0.1, 30);
    },
    bulletHit: (ctx, dest, t) => {
      noise(ctx, dest, 0.5, t, 0.08, 3500, 1.2, "highpass");
      osc(ctx, dest, "sawtooth", 400, 0.3, t, 0.06, 120);
      osc(ctx, dest, "sine", 150, 0.35, t, 0.1, 50);
    },
    gunReload: (ctx, dest, t) => {
      // Magazine insert / reload rustle
      noise(ctx, dest, 0.22, t, 0.08, 3000, 1.5);
      osc(ctx, dest, "triangle", 200, 0.18, t, 0.06, 300);
      osc(ctx, dest, "triangle", 400, 0.14, t + 0.08, 0.07, 250);
      noise(ctx, dest, 0.18, t + 0.3, 0.14, 2000, 1.2);
      osc(ctx, dest, "triangle", 250, 0.18, t + 0.3, 0.12, 150);

      // Cocking / slide release (chambering round) at t + 1.2s
      const tCock = t + 1.2;
      // Pull back
      noise(ctx, dest, 0.22, tCock, 0.06, 2800, 1.5);
      osc(ctx, dest, "triangle", 500, 0.24, tCock, 0.05, 900);
      // Let go (clack)
      noise(ctx, dest, 0.26, tCock + 0.12, 0.08, 3200, 1.8);
      osc(ctx, dest, "triangle", 800, 0.26, tCock + 0.12, 0.06, 1400);
      osc(ctx, dest, "sine", 1200, 0.18, tCock + 0.12, 0.05, 1800);
    },

    // Vampire Ball
    vampireLatch: (ctx, dest, t) => {
      noise(ctx, dest, 0.4, t, 0.4, 1800, 1.8, "bandpass");
      osc(ctx, dest, "sawtooth", 120, 0.25, t, 0.45, 60);
      osc(ctx, dest, "sine", 50, 0.35, t, 0.45, 40);
    },
    vampireDrain: (ctx, dest, t) => {
      noise(ctx, dest, 0.22, t, 0.2, 500, 1.5, "bandpass");
      osc(ctx, dest, "triangle", 110, 0.22, t, 0.2, 140);
    },

    // Bomb Ball
    bombFuse: (ctx, dest, t) => {
      noise(ctx, dest, 0.26, t, 0.08, 5500, 4.0, "bandpass");
      osc(ctx, dest, "square", 900, 0.07, t, 0.04, 1000);
    },
    explosion: (ctx, dest, t) => {
      osc(ctx, dest, "sine", 55, 0.95, t, 0.6, 15);
      osc(ctx, dest, "triangle", 90, 0.65, t, 0.5, 25);
      osc(ctx, dest, "sawtooth", 40, 0.55, t, 0.5, 10);
      noise(ctx, dest, 0.95, t, 0.65, 180, 0.4, "lowpass");
      noise(ctx, dest, 0.55, t, 0.35, 1200, 0.8, "bandpass");
    },

    // Laser Ball
    laserCharge: (ctx, dest, t, playbackRate = 1) => {
      const rate = Math.max(0.5, Math.min(2.5, playbackRate));
      const pitchScale = Math.sqrt(rate);
      const duration = 0.9 / rate;
      osc(ctx, dest, "sine", 88 * pitchScale, 0.38, t, duration, 1050 * pitchScale);
      osc(ctx, dest, "triangle", 46 * pitchScale, 0.22, t, duration * 0.94, 520 * pitchScale);
      noise(ctx, dest, 0.1, t + 0.04 / rate, duration * 0.82, 1450 * pitchScale, 1.2, "bandpass");
    },
    laserFire: (ctx, dest, t) => {
      osc(ctx, dest, "sawtooth", 110, 0.45, t, 0.65, 55);
      osc(ctx, dest, "square", 350, 0.3, t, 0.6, 150);
      noise(ctx, dest, 0.45, t, 0.6, 2200, 0.5, "bandpass");
      osc(ctx, dest, "sine", 75, 0.4, t, 0.5, 30);
    },

    // Shield Ball
    shieldThrow: (ctx, dest, t) => {
      noise(ctx, dest, 0.3, t, 0.2, 2200, 1.8, "bandpass");
      osc(ctx, dest, "triangle", 380, 0.22, t, 0.18, 520);
    },
    shieldBlock: (ctx, dest, t) => {
      noise(ctx, dest, 0.5, t, 0.15, 1500, 0.8, "bandpass");
      osc(ctx, dest, "triangle", 240, 0.4, t, 0.2, 100);
      osc(ctx, dest, "sine", 850, 0.28, t, 0.25, 800);
      osc(ctx, dest, "sine", 1250, 0.18, t, 0.18, 1200);
    },
    shieldCatch: (ctx, dest, t) => {
      noise(ctx, dest, 0.3, t, 0.08, 1200, 1.5, "bandpass");
      osc(ctx, dest, "triangle", 420, 0.25, t, 0.1, 280);
      osc(ctx, dest, "sine", 680, 0.18, t, 0.1, 650);
    },

    // Spider Ball
    webShoot: (ctx, dest, t) => {
      noise(ctx, dest, 0.35, t, 0.15, 1800, 1.5, "bandpass");
      osc(ctx, dest, "sine", 550, 0.18, t, 0.14, 220);
    },
    webHit: (ctx, dest, t) => {
      noise(ctx, dest, 0.4, t, 0.25, 900, 0.8, "bandpass");
      osc(ctx, dest, "triangle", 200, 0.25, t, 0.22, 90);
    },

    // Spore Ball
    sporeShoot: (ctx, dest, t) => {
      noise(ctx, dest, 0.3, t, 0.12, 2500, 2.0, "bandpass");
      osc(ctx, dest, "triangle", 360, 0.18, t, 0.1, 600);
    },
    cactusHit: (ctx, dest, t) => {
      noise(ctx, dest, 0.4, t, 0.1, 1500, 2.0, "bandpass");
      osc(ctx, dest, "sawtooth", 300, 0.22, t, 0.08, 160);
    },

    // Hammer Ball
    hammerSpin: (ctx, dest, t) => {
      noise(ctx, dest, 0.3, t, 0.1, 400, 0.5, "lowpass");
      osc(ctx, dest, "sine", 120, 0.2, t, 0.1, 95);
    },
    hammerCharge: (ctx, dest, t) => {
      // 1. Initial lightning crack (high-pass & band-pass noise + sawtooth bite)
      noise(ctx, dest, 0.95, t, 0.18, 1400, 1.0, "bandpass");
      noise(ctx, dest, 0.45, t + 0.05, 0.22, 3500, 0.8, "highpass");
      osc(ctx, dest, "sawtooth", 220, 0.55, t, 0.28, 55);

      // 2. Heavy bass rumble (sine & triangle pitch sweeps)
      osc(ctx, dest, "sine", 75, 0.95, t, 1.3, 25);
      osc(ctx, dest, "triangle", 45, 0.85, t, 1.5, 15);

      // 3. Rolling thunder rumble layers (simulating acoustic echoes/tremolo)
      noise(ctx, dest, 0.75, t, 1.5, 130, 3.0, "lowpass");
      noise(ctx, dest, 0.6, t + 0.12, 1.2, 110, 2.5, "lowpass");
      noise(ctx, dest, 0.55, t + 0.3, 1.0, 95, 2.5, "lowpass");
      noise(ctx, dest, 0.5, t + 0.48, 0.8, 80, 2.5, "lowpass");
      noise(ctx, dest, 0.4, t + 0.68, 0.6, 70, 2.0, "lowpass");
    },
    hammerLaunch: (ctx, dest, t) => {
      noise(ctx, dest, 0.75, t, 0.4, 700, 0.3, "bandpass");
      osc(ctx, dest, "sawtooth", 200, 0.5, t, 0.35, 50);
      osc(ctx, dest, "sine", 80, 0.55, t, 0.4, 35);
    },
    hammerHit: (ctx, dest, t) => {
      triggerHammerHitSound(ctx, dest, t);
    },

    // Wall Spike Ball
    spikePlant: (ctx, dest, t) => {
      noise(ctx, dest, 0.45, t, 0.14, 800, 1.0, "bandpass");
      osc(ctx, dest, "triangle", 160, 0.32, t, 0.12, 60);
    },
    wallSpikeHit: (ctx, dest, t) => {
      noise(ctx, dest, 0.45, t, 0.14, 1800, 1.2, "bandpass");
      osc(ctx, dest, "sawtooth", 380, 0.28, t, 0.1, 110);
    },

    // String Web Ball
    stringTwang: (ctx, dest, t) => {
      osc(ctx, dest, "triangle", 520, 0.28, t, 0.4, 70);
      osc(ctx, dest, "sine", 220, 0.22, t, 0.4, 35);
      noise(ctx, dest, 0.15, t, 0.12, 2200, 1.5, "bandpass");
    },
    stringHit: (ctx, dest, t) => {
      osc(ctx, dest, "triangle", 580, 0.28, t, 0.12, 130);
      noise(ctx, dest, 0.28, t, 0.08, 3200, 1.8, "highpass");
    },

    // Arm Ball
    armGrab: (ctx, dest, t) => {
      noise(ctx, dest, 0.4, t, 0.14, 900, 1.5, "bandpass");
      osc(ctx, dest, "triangle", 320, 0.28, t, 0.12, 160);
    },
    armSlam: (ctx, dest, t) => {
      noise(ctx, dest, 0.8, t, 0.3, 300, 0.3, "lowpass");
      osc(ctx, dest, "sine", 60, 0.8, t, 0.3, 25);
      osc(ctx, dest, "triangle", 140, 0.55, t, 0.22, 45);
    },

    // Fire Driver
    carRev: (ctx, dest, t) => {
      osc(ctx, dest, "sawtooth", 50, 0.35, t, 0.7, 125);
      osc(ctx, dest, "square", 75, 0.12, t + 0.02, 0.65, 175);
      osc(ctx, dest, "sine", 40, 0.42, t, 0.75, 80);
      noise(ctx, dest, 0.16, t, 0.7, 280, 0.7, "lowpass");
      osc(ctx, dest, "sawtooth", 130, 0.15, t + 0.4, 0.3, 190);
    },

    // Eight Ball
    cueReady: (ctx, dest, t) => {
      osc(ctx, dest, "triangle", 190, 0.15, t, 0.25, 270);
      noise(ctx, dest, 0.1, t, 0.2, 1000, 1.8, "bandpass");
    },
    cueStrike: (ctx, dest, t) => {
      noise(ctx, dest, 0.5, t, 0.08, 2000, 1.4, "bandpass");
      osc(ctx, dest, "triangle", 540, 0.35, t, 0.1, 180);
      osc(ctx, dest, "sine", 120, 0.36, t, 0.22, 60);
    },
    cueImpact: (ctx, dest, t) => {
      noise(ctx, dest, 0.38, t, 0.08, 1400, 1.2, "bandpass");
      osc(ctx, dest, "triangle", 380, 0.28, t, 0.1, 110);
      osc(ctx, dest, "sine", 96, 0.3, t, 0.15, 45);
    },

    // Chess Ball
    chessMove: (ctx, dest, t) => {
      noise(ctx, dest, 0.28, t, 0.2, 600, 1.0, "bandpass");
      osc(ctx, dest, "triangle", 190, 0.22, t, 0.2, 370);
    },
    chessSlam: (ctx, dest, t) => {
      noise(ctx, dest, 0.85, t, 0.32, 220, 0.4, "lowpass");
      osc(ctx, dest, "sine", 50, 0.9, t, 0.35, 20);
      osc(ctx, dest, "sawtooth", 95, 0.5, t, 0.3, 35);
      osc(ctx, dest, "triangle", 290, 0.45, t, 0.25, 100);
    },

    // Round results
    roundWin: (ctx, dest, t) => {
      noise(ctx, dest, 0.95, t, 1.2, 350, 0.4, "lowpass");
      noise(ctx, dest, 0.65, t + 0.1, 2.0, 1800, 0.8, "bandpass");
      osc(ctx, dest, "sine", 70, 0.9, t, 0.8, 20);
      osc(ctx, dest, "sawtooth", 45, 0.7, t, 0.9, 10);
    },
    roundLose: (ctx, dest, t) => {
      noise(ctx, dest, 0.95, t, 1.2, 350, 0.4, "lowpass");
      noise(ctx, dest, 0.65, t + 0.1, 2.0, 1800, 0.8, "bandpass");
      osc(ctx, dest, "sine", 70, 0.9, t, 0.8, 20);
      osc(ctx, dest, "sawtooth", 45, 0.7, t, 0.9, 10);
    },

    // ─── Newly Implemented Missing Sounds ────────────────────────────────────
    jump: (ctx, dest, t) => {
      osc(ctx, dest, "triangle", 150, 0.22, t, 0.15, 650);
      osc(ctx, dest, "sine", 150, 0.15, t, 0.15, 650);
    },
    repulsorCharge: (ctx, dest, t) => {
      osc(ctx, dest, "sine", 120, 0.25, t, 0.6, 950);
      osc(ctx, dest, "triangle", 120, 0.18, t, 0.6, 950);
      noise(ctx, dest, 0.12, t, 0.55, 3000, 1.2, "highpass");
    },
    wallHit: (ctx, dest, t) => {
      noise(ctx, dest, 0.25, t, 0.12, 1800, 1.2, "bandpass");
      osc(ctx, dest, "triangle", 180, 0.25, t, 0.1, 80);
      osc(ctx, dest, "sine", 90, 0.2, t, 0.12, 50);
    },
    wallSlam: (ctx, dest, t) => {
      osc(ctx, dest, "sine", 58, 0.85, t, 0.4, 20);
      osc(ctx, dest, "triangle", 110, 0.45, t, 0.3, 40);
      noise(ctx, dest, 0.75, t, 0.35, 180, 0.5, "lowpass");
    },
    warpCapture: (ctx, dest, t) => {
      noise(ctx, dest, 0.22, t, 0.45, 1500, 1.8, "bandpass");
      osc(ctx, dest, "sine", 700, 0.25, t, 0.4, 150);
      osc(ctx, dest, "triangle", 350, 0.18, t, 0.45, 900);
    },
    warpCast: (ctx, dest, t) => {
      noise(ctx, dest, 0.28, t, 0.35, 2200, 0.8, "bandpass");
      osc(ctx, dest, "sine", 400, 0.28, t, 0.3, 100);
      osc(ctx, dest, "sawtooth", 220, 0.12, t, 0.25, 50);
    },
    warpDrag: (ctx, dest, t) => {
      // Exaggerated low magic wrrrrl sound
      const duration = 0.8;
      
      // Carrier: a low sawtooth oscillator for warm bass growl
      const carrier = ctx.createOscillator();
      carrier.type = "sawtooth";
      carrier.frequency.setValueAtTime(60, t);
      carrier.frequency.exponentialRampToValueAtTime(32, t + duration); // sub sweep down
      
      // Modulator: creates the rotating "wrrrl" texture by modulating carrier frequency
      const modulator = ctx.createOscillator();
      modulator.type = "sine";
      // Modulate at a low "wrrrrl" speed (14 Hz vibrating / rotating speed)
      modulator.frequency.setValueAtTime(14, t); 
      modulator.frequency.linearRampToValueAtTime(6, t + duration); // slow down rotation
      
      // Modulation depth (gain)
      const modulationGain = ctx.createGain();
      // Exaggerated modulation depth for heavy growling texture
      modulationGain.gain.setValueAtTime(120, t);
      modulationGain.gain.linearRampToValueAtTime(40, t + duration);
      
      // Main volume envelope
      const amp = ctx.createGain();
      amp.gain.setValueAtTime(0.55, t);
      amp.gain.exponentialRampToValueAtTime(0.0001, t + duration);
      
      // Lowpass filter to keep it low, bassy, and magical
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(180, t);
      filter.frequency.exponentialRampToValueAtTime(90, t + duration);
      
      // Connect modulator -> modulationGain -> carrier.frequency
      modulator.connect(modulationGain);
      modulationGain.connect(carrier.frequency);
      
      // Connect carrier -> filter -> amp -> dest
      carrier.connect(filter);
      filter.connect(amp);
      amp.connect(dest);
      
      // Start/Stop nodes
      modulator.start(t);
      modulator.stop(t + duration + 0.05);
      carrier.start(t);
      carrier.stop(t + duration + 0.05);
      
      // Also add a secondary deep sub swell voice
      const sub = ctx.createOscillator();
      sub.type = "sine";
      sub.frequency.setValueAtTime(45, t);
      sub.frequency.linearRampToValueAtTime(35, t + duration);
      
      const subAmp = ctx.createGain();
      subAmp.gain.setValueAtTime(0.65, t);
      subAmp.gain.exponentialRampToValueAtTime(0.0001, t + duration);
      
      sub.connect(subAmp);
      subAmp.connect(dest);
      
      sub.start(t);
      sub.stop(t + duration + 0.05);

      // And a whooshing bandpassed noise vacuum tail
      noise(ctx, dest, 0.22, t, duration, 350, 1.8, "bandpass");
    },
    warpSlam: (ctx, dest, t) => {
      osc(ctx, dest, "sine", 70, 0.85, t, 0.5, 20);
      osc(ctx, dest, "triangle", 180, 0.4, t, 0.38, 40);
      osc(ctx, dest, "sawtooth", 600, 0.22, t, 0.3, 150);
      noise(ctx, dest, 0.8, t, 0.45, 280, 0.5, "lowpass");
      noise(ctx, dest, 0.35, t, 0.25, 2000, 1.5, "bandpass");
    },
    spiderSplatterStep: (ctx, dest, t) => {
      // Exaggerated wet splat (low-pass noise burst + organic squelch)
      noise(ctx, dest, 0.65, t, 0.25, 450, 0.8, "lowpass");
      noise(ctx, dest, 0.45, t, 0.12, 1200, 1.2, "bandpass");

      // Slimy bubble squelches (multiple quick pitch-modulated bubble pops)
      const pops = [
        { delay: 0.00, freq: 280, end: 390, vol: 0.32, dur: 0.10 },
        { delay: 0.03, freq: 190, end: 270, vol: 0.28, dur: 0.12 },
        { delay: 0.06, freq: 420, end: 150, vol: 0.24, dur: 0.08 }, // suction release
        { delay: 0.09, freq: 310, end: 460, vol: 0.20, dur: 0.11 }
      ];
      pops.forEach(p => {
        osc(ctx, dest, "sine", p.freq, p.vol, t + p.delay, p.dur, p.end);
      });

      // Suction thud (low frequency pull)
      osc(ctx, dest, "triangle", 110, 0.35, t, 0.22, 40);

      // Sticky web thread snaps
      osc(ctx, dest, "sine", 1900, 0.2, t + 0.02, 0.04, 1400);
      osc(ctx, dest, "sine", 2600, 0.14, t + 0.04, 0.03, 1800);
    },
    bigLaserFire: (ctx, dest, t) => {
      // Lightweight deep sustain: four voices, long tail, little high-frequency clutter.
      const beamDur = 2.15;
      noise(ctx, dest, 0.42, t, 0.42, 240, 0.45, "lowpass");
      osc(ctx, dest, "sine", 48, 0.62, t, beamDur, 24);
      osc(ctx, dest, "triangle", 92, 0.28, t, beamDur - 0.12, 44);
      noise(ctx, dest, 0.14, t + 0.08, beamDur - 0.2, 760, 0.8, "bandpass");
    },
    armorLock: (ctx, dest, t) => {
      // Exaggerated mechanical locking / latching sound
      noise(ctx, dest, 0.38, t, 0.08, 1500, 2.0, "bandpass");
      noise(ctx, dest, 0.25, t + 0.05, 0.06, 2800, 1.8, "bandpass");
      osc(ctx, dest, "triangle", 380, 0.32, t, 0.08, 220);
      osc(ctx, dest, "sine", 750, 0.28, t + 0.04, 0.05, 900);
      osc(ctx, dest, "sawtooth", 900, 0.16, t + 0.04, 0.04, 1100);
      osc(ctx, dest, "sine", 120, 0.35, t + 0.05, 0.1, 45);
    },
    fireballShoot: (ctx, dest, t) => {
      osc(ctx, dest, "sine", 180, 0.35, t, 0.18, 550);
      noise(ctx, dest, 0.28, t, 0.16, 1200, 1.2, "bandpass");
    },
    fireballExplode: (ctx, dest, t) => {
      noise(ctx, dest, 0.65, t, 0.35, 300, 0.5, "lowpass");
      osc(ctx, dest, "sine", 95, 0.45, t, 0.3, 40);
    },
    fireWhip: (ctx, dest, t) => {
      noise(ctx, dest, 0.72, t, 0.08, 3500, 2.5, "highpass");
      noise(ctx, dest, 0.38, t + 0.02, 0.15, 1400, 1.0, "bandpass");
      osc(ctx, dest, "sawtooth", 450, 0.32, t, 0.1, 120);
    },
    flameWheel: (ctx, dest, t) => {
      noise(ctx, dest, 0.52, t, 0.8, 180, 0.8, "lowpass");
      osc(ctx, dest, "sine", 58, 0.38, t, 0.8, 38);
    }
  });

  // ─── Public API ─────────────────────────────────────────────────────────────

  const playSound = useCallback((name, volume = 1, cooldownMs = 0, spatialOpts = null) => {
    if (mutedRef.current) return;
    const fn = sounds.current[name];
    if (!fn) return;
    const ctx = getCtx();
    if (!ctx) return;

    const isHeavy = HEAVY_HITS.has(name) || (volume >= 1.2 && (name.includes("Hit") || name.includes("Slam") || name.includes("Bounce")));
    if (!isHeavy && activeProceduralVoicesRef.current >= MAX_PROCEDURAL_VOICES) return;

    // Enforce a small per-cue floor even when a caller omits a cooldown.
    const effectiveCooldownMs = Math.max(cooldownMs, DEFAULT_SOUND_COOLDOWNS[name] || 0);
    if (effectiveCooldownMs > 0) {
      const key = name;
      const now = ctx.currentTime;
      if (cooldowns.current[key] && cooldowns.current[key] > now) return;
      cooldowns.current[key] = now + effectiveCooldownMs / 1000;
    }

    const dest = masterGainRef.current;
    const t = ctx.currentTime;
    activeProceduralVoicesRef.current += 1;
    const releaseVoice = () => {
      activeProceduralVoicesRef.current = Math.max(0, activeProceduralVoicesRef.current - 1);
    };

    // Setup local volume gain node
    const volGainNode = ctx.createGain();
    const safeVolume = Math.max(0, Math.min(isHeavy ? 1.55 : 1.15, volume));
    volGainNode.gain.setValueAtTime(0.0001, t);
    volGainNode.gain.linearRampToValueAtTime(safeVolume, t + 0.006);
    volGainNode.connect(dest);

    let nodeDest = volGainNode;

    // Apply spatial audio effects if options are present
    if (spatialOpts) {
      const { pan, depth, room } = spatialOpts;

      // 1. Distance/Depth lowpass filter and attenuation
      if (typeof depth === "number" && depth > 0) {
        const depthFilter = ctx.createBiquadFilter();
        depthFilter.type = "lowpass";
        const cutoff = Math.max(800, 20000 - depth * 19200);
        depthFilter.frequency.setValueAtTime(cutoff, t);
        depthFilter.connect(nodeDest);
        nodeDest = depthFilter;

        const depthGain = ctx.createGain();
        const dVol = Math.max(0.3, 1.0 - depth * 0.7);
        depthGain.gain.setValueAtTime(dVol, t);
        depthGain.connect(nodeDest);
        nodeDest = depthGain;
      }

      // 2. Stereo Panner
      if (typeof pan === "number" && ctx.createStereoPanner) {
        const panner = ctx.createStereoPanner();
        panner.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), t);
        panner.connect(nodeDest);
        nodeDest = panner;
      }

      // 3. Room Reverb (parallel wet/dry mix via Convolver)
      if (typeof room === "number" && room > 0) {
        const convolver = ctx.createConvolver();
        convolver.buffer = getReverbBuffer(ctx);

        const dryGain = ctx.createGain();
        const wetGain = ctx.createGain();
        const wetVal = Math.min(0.45, room * 0.45);

        wetGain.gain.setValueAtTime(wetVal, t);
        dryGain.gain.setValueAtTime(1.0 - wetVal, t);

        dryGain.connect(nodeDest);
        convolver.connect(wetGain);
        wetGain.connect(nodeDest);

        const splitter = ctx.createGain();
        splitter.connect(dryGain);
        splitter.connect(convolver);
        nodeDest = splitter;
      }
    }

    // Apply Waveshaper Saturation and Music Ducking for heavy hit impacts
    if (isHeavy) {
      const saturator = ctx.createWaveShaper();
      saturator.curve = getDistortionCurve();
      saturator.oversample = "4x";
      saturator.connect(nodeDest);
      nodeDest = saturator;

      duckMusic(0.16, 0.02);
    }

    // Trigger procedural sound synthesis
    fn(ctx, nodeDest, t, spatialOpts?.playbackRate || 1);
    window.setTimeout(() => {
      try { volGainNode.disconnect(); } catch {}
      releaseVoice();
    }, isHeavy ? 2400 : 1300);
  }, [getCtx, getReverbBuffer, getDistortionCurve, duckMusic]);

  const toggleMute = useCallback(() => {
    mutedRef.current = !mutedRef.current;
    mutedStateRef.current = mutedRef.current;
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = mutedRef.current ? 0 : 0.52;
    }
    return mutedRef.current;
  }, []);

  const isMuted = useCallback(() => mutedRef.current, []);

  const getAudioStream = useCallback(() => {
    getCtx();
    return ctxRef.current ? ctxRef.current.recStreamDestination?.stream : null;
  }, [getCtx]);

  const playAudioFile = useCallback(async (url, volume = 1, delay = 0, playbackRate = 1, instanceKey = url) => {
    if (mutedRef.current) return;
    if (!ALLOWED_AUDIO_FILES.has(url)) return;
    const ctx = getCtx();
    if (!ctx || !masterGainRef.current) return;
    const cooldownKey = instanceKey === url ? url : `${url}::${instanceKey}`;
    const nextAllowedAt = audioFileCooldownsRef.current[cooldownKey] || 0;
    if (ctx.currentTime < nextAllowedAt) return;
    audioFileCooldownsRef.current[cooldownKey] = ctx.currentTime + (AUDIO_FILE_COOLDOWNS[url] || 0.06);
    try {
      if (!audioBufferCacheRef.current[url]) {
        if (!audioBufferPromiseCacheRef.current[url]) {
          audioBufferPromiseCacheRef.current[url] = fetch(url)
            .then((response) => {
              if (!response.ok) throw new Error(`Audio request failed: ${response.status}`);
              return response.arrayBuffer();
            })
            .then((arrayBuffer) => ctx.decodeAudioData(arrayBuffer))
            .then((buffer) => {
              audioBufferCacheRef.current[url] = buffer;
              delete audioBufferPromiseCacheRef.current[url];
              return buffer;
            })
            .catch((error) => {
              delete audioBufferPromiseCacheRef.current[url];
              throw error;
            });
        }
        await audioBufferPromiseCacheRef.current[url];
      }
      if (mutedRef.current) return;
      const activeForKey = activeAudioSourcesRef.current[instanceKey];
      const activeForUrl = activeAudioSourcesRef.current[url];
      const maxForUrl = AUDIO_FILE_MAX_INSTANCES[url] || 2;
      if ((activeForKey?.size || 0) >= maxForUrl || (activeForUrl?.size || 0) >= maxForUrl) return;
      if (activeFileVoicesRef.current >= MAX_FILE_VOICES && !url.includes("Bash") && !url.includes("bomb") && !url.includes("laser")) return;
      const source = ctx.createBufferSource();
      const gain = ctx.createGain();
      source.buffer = audioBufferCacheRef.current[url];
      source.playbackRate.value = Math.max(0.5, Math.min(2.5, playbackRate));
      let detuneValue = 0;
      let actualDelay = delay;
      if (delay < 0) {
        detuneValue = delay;
        actualDelay = 0;
      }
      if (source.detune && detuneValue !== 0) {
        source.detune.setValueAtTime(detuneValue, ctx.currentTime);
      }
      const safeVolume = Math.max(0, Math.min(1.25, volume));
      const startAt = ctx.currentTime + actualDelay;
      gain.gain.setValueAtTime(0.0001, startAt);
      gain.gain.linearRampToValueAtTime(safeVolume, startAt + 0.012);
      const duration = source.buffer?.duration ? source.buffer.duration / source.playbackRate.value : 1;
      const fadeStart = startAt + Math.max(0.04, duration - 0.045);
      gain.gain.setTargetAtTime(0.0001, fadeStart, 0.018);
      source.connect(gain);
      gain.connect(masterGainRef.current);
      if (!activeAudioSourcesRef.current[instanceKey]) activeAudioSourcesRef.current[instanceKey] = new Set();
      const activeEntry = { source, gain };
      activeAudioSourcesRef.current[instanceKey].add(activeEntry);
      if (instanceKey !== url) {
        if (!activeAudioSourcesRef.current[url]) activeAudioSourcesRef.current[url] = new Set();
        activeAudioSourcesRef.current[url].add(activeEntry);
      }
      activeFileVoicesRef.current += 1;
      source.onended = () => {
        activeAudioSourcesRef.current[instanceKey]?.delete(activeEntry);
        if (activeAudioSourcesRef.current[instanceKey]?.size === 0) delete activeAudioSourcesRef.current[instanceKey];
        if (instanceKey !== url) {
          activeAudioSourcesRef.current[url]?.delete(activeEntry);
          if (activeAudioSourcesRef.current[url]?.size === 0) delete activeAudioSourcesRef.current[url];
        }
        activeFileVoicesRef.current = Math.max(0, activeFileVoicesRef.current - 1);
        try { source.disconnect(); } catch {}
        try { gain.disconnect(); } catch {}
      };
      source.start(startAt);
    } catch {
      // Keep procedural SFX running if an optional recorded clip fails.
    }
  }, [getCtx]);

  const stopAudioFile = useCallback((url) => {
    const ctx = ctxRef.current;
    const active = activeAudioSourcesRef.current[url];
    if (!ctx || !active?.size) return;
    const stopAt = ctx.currentTime + 0.04;
    active.forEach(({ source, gain }) => {
      try {
        gain.gain.cancelScheduledValues(ctx.currentTime);
        gain.gain.setValueAtTime(Math.max(0.0001, gain.gain.value), ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, stopAt);
        source.stop(stopAt);
      } catch {
        // Source may already have ended.
      }
    });
    activeFileVoicesRef.current = Math.max(0, activeFileVoicesRef.current - active.size);
    delete activeAudioSourcesRef.current[url];
  }, []);

  const stopMatchMusic = useCallback(() => {
    if (musicTimerRef.current) {
      clearInterval(musicTimerRef.current);
      musicTimerRef.current = null;
    }
    const ctx = ctxRef.current;
    if (ctx && musicGainRef.current) {
      const t = ctx.currentTime;
      musicGainRef.current.gain.cancelScheduledValues(t);
      musicGainRef.current.gain.setTargetAtTime(0.0001, t, 0.08);
    }
  }, []);

  const startMatchMusic = useCallback(() => {
    if (mutedRef.current || musicTimerRef.current) return;
    const ctx = getCtx();
    if (!ctx || !musicGainRef.current) return;
    const musicGain = musicGainRef.current;
    const t = ctx.currentTime;
    musicGain.gain.cancelScheduledValues(t);
    musicGain.gain.setValueAtTime(Math.max(musicGain.gain.value, 0.0001), t);
    musicGain.gain.linearRampToValueAtTime(0.18, t + 0.18);

    const scale = [0, 3, 5, 7, 10, 12, 15, 17];
    const bass = [0, 0, 7, 0, 10, 7, 5, 7, 0, 0, 12, 10, 7, 5, 3, 5];
    const lead = [12, 15, 17, 19, 17, 15, 12, 10, 12, 15, 19, 22, 20, 19, 17, 15];
    const tempo = 0.125;
    const root = 110;

    const scheduleStep = () => {
      if (mutedRef.current || !musicTimerRef.current) return;
      const now = ctx.currentTime;
      const step = musicStepRef.current++;
      const bassSemi = bass[step % bass.length];
      const leadSemi = lead[step % lead.length] + (step % 32 > 15 ? 2 : 0);
      const arpSemi = scale[(step * 3) % scale.length] + 24;
      const bassFreq = root * Math.pow(2, bassSemi / 12);
      const leadFreq = root * Math.pow(2, leadSemi / 12);
      const arpFreq = root * Math.pow(2, arpSemi / 12);

      osc(ctx, musicGain, "square", bassFreq, 0.18, now, 0.105, bassFreq * 0.99);
      if (step % 2 === 0) osc(ctx, musicGain, "square", leadFreq, 0.095, now + 0.012, 0.09, leadFreq * 1.005);
      osc(ctx, musicGain, "triangle", arpFreq, 0.055, now + 0.052, 0.06, arpFreq);
      if (step % 4 === 0) noise(ctx, musicGain, 0.035, now, 0.045, 1200, 1.8);
      if (step % 8 === 4) noise(ctx, musicGain, 0.025, now, 0.035, 4200, 2.2);
    };

    musicStepRef.current = 0;
    scheduleStep();
    musicTimerRef.current = setInterval(scheduleStep, tempo * 1000);
  }, [getCtx, noise, osc]);

  return { playSound, playAudioFile, stopAudioFile, toggleMute, isMuted, getAudioStream, startMatchMusic, stopMatchMusic };
}
