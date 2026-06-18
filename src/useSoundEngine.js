import { useRef, useCallback } from "react";

/**
 * Procedural sound engine for Ball Fighters.
 * All sounds are synthesised via Web Audio API – no external files.
 *
 * Usage:
 *   const { playSound, toggleMute, muted } = useSoundEngine();
 *   playSound("wallBounce");
 */
export function useSoundEngine() {
  const ctxRef = useRef(null);
  const mutedRef = useRef(false);
  const mutedStateRef = useRef(false); // for react-less read
  const masterGainRef = useRef(null);
  const compressorRef = useRef(null);
  const arenaReverbRef = useRef(null);
  const musicGainRef = useRef(null);
  const musicTimerRef = useRef(null);
  const musicStepRef = useRef(0);
  const audioBufferCacheRef = useRef({});
  // cooldown map: soundKey -> earliest next play time (AudioContext time)
  const cooldowns = useRef({});

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      ctxRef.current = new AudioCtx();
      masterGainRef.current = ctxRef.current.createGain();
      masterGainRef.current.gain.value = 0.5;

      compressorRef.current = ctxRef.current.createDynamicsCompressor();
      compressorRef.current.threshold.value = -16;
      compressorRef.current.knee.value = 10;
      compressorRef.current.ratio.value = 5;
      compressorRef.current.attack.value = 0.003;
      compressorRef.current.release.value = 0.24;
      masterGainRef.current.connect(compressorRef.current);
      compressorRef.current.connect(ctxRef.current.destination);

      const impulseLength = Math.floor(ctxRef.current.sampleRate * 0.85);
      const impulse = ctxRef.current.createBuffer(2, impulseLength, ctxRef.current.sampleRate);
      for (let channel = 0; channel < 2; channel++) {
        const data = impulse.getChannelData(channel);
        for (let i = 0; i < impulseLength; i++) {
          const decay = Math.pow(1 - i / impulseLength, 2.8);
          data[i] = (Math.random() * 2 - 1) * decay;
        }
      }
      arenaReverbRef.current = ctxRef.current.createConvolver();
      arenaReverbRef.current.buffer = impulse;
      arenaReverbRef.current.connect(masterGainRef.current);
      musicGainRef.current = ctxRef.current.createGain();
      musicGainRef.current.gain.value = 0.18;
      musicGainRef.current.connect(masterGainRef.current);

      // Create stream destination node to allow recording audio
      ctxRef.current.recStreamDestination = ctxRef.current.createMediaStreamDestination();
      compressorRef.current.connect(ctxRef.current.recStreamDestination);
    }
    // Resume if suspended (browsers require user gesture first)
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const createSpatialBus = useCallback((ctx, output, spatial = {}) => {
    const input = ctx.createGain();
    const panner = ctx.createPanner();
    const dry = ctx.createGain();
    const roomSend = ctx.createGain();
    const pan = Math.max(-1, Math.min(1, spatial.pan || 0));
    const depth = Math.max(0, Math.min(1, spatial.depth || 0));

    panner.panningModel = "HRTF";
    panner.distanceModel = "inverse";
    panner.refDistance = 1.8;
    panner.maxDistance = 12;
    panner.rolloffFactor = 0.45;
    panner.positionX.value = pan * 2.8;
    panner.positionY.value = 0.25;
    panner.positionZ.value = -1.2 - depth * 3;
    dry.gain.value = 1.05;
    roomSend.gain.value = Math.max(0, Math.min(0.65, spatial.room ?? 0.16));

    input.connect(panner);
    panner.connect(dry);
    dry.connect(output);
    if (arenaReverbRef.current) {
      panner.connect(roomSend);
      roomSend.connect(arenaReverbRef.current);
    }
    return input;
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
    o.stop(startAt + dur + 0.01);
  }, []);

  /** White-noise burst */
  const noise = useCallback((ctx, dest, vol, startAt, dur, filterFreq = 2000, filterQ = 1) => {
    const bufLen = Math.ceil(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const f = ctx.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = filterFreq;
    f.Q.value = filterQ;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, startAt);
    g.gain.exponentialRampToValueAtTime(0.0001, startAt + dur);
    src.connect(f);
    f.connect(g);
    g.connect(dest);
    src.start(startAt);
    src.stop(startAt + dur + 0.01);
  }, []);

  // ─── Sound definitions ──────────────────────────────────────────────────────

  const sounds = useRef({
    // Generic
    wallBounce: (ctx, dest, t) => {
      noise(ctx, dest, 0.55, t, 0.16, 180, 0.55);
      noise(ctx, dest, 0.22, t + 0.018, 0.28, 1800, 1.6);
      osc(ctx, dest, "sine", 105, 0.55, t, 0.26, 32);
      osc(ctx, dest, "triangle", 310, 0.28, t, 0.18, 92);
      osc(ctx, dest, "sine", 72, 0.3, t + 0.045, 0.34, 28);
    },
    ballCollision: (ctx, dest, t) => {
      noise(ctx, dest, 0.4, t, 0.15, 600, 0.5);
      osc(ctx, dest, "sine", 180, 0.3, t, 0.14, 60);
      osc(ctx, dest, "triangle", 350, 0.15, t, 0.06, 120);
    },
    damage: (ctx, dest, t) => {
      noise(ctx, dest, 0.3, t, 0.08, 800, 1.2);
      osc(ctx, dest, "sawtooth", 140, 0.18, t, 0.08, 50);
    },

    // Knife Ball
    knifeHit: (ctx, dest, t) => {
      noise(ctx, dest, 0.5, t, 0.14, 5000, 1.8);
      osc(ctx, dest, "sawtooth", 1200, 0.2, t, 0.12, 400);
      osc(ctx, dest, "sine", 800, 0.15, t, 0.1, 900);
    },

    // Spike Ball
    spikeHit: (ctx, dest, t) => {
      noise(ctx, dest, 0.45, t, 0.15, 1000, 1.0);
      osc(ctx, dest, "sawtooth", 220, 0.25, t, 0.15, 60);
      osc(ctx, dest, "triangle", 90, 0.3, t, 0.18, 30);
    },

    // Gun Ball
    gunShot: (ctx, dest, t) => {
      // Muzzle blast and supersonic crack.
      noise(ctx, dest, 1.3, t, 0.2, 980, 0.28);
      noise(ctx, dest, 0.62, t + 0.004, 0.48, 4600, 1.9);
      osc(ctx, dest, "sine", 68, 1.05, t, 0.54, 15);
      osc(ctx, dest, "sawtooth", 230, 0.68, t, 0.28, 34);
      osc(ctx, dest, "triangle", 1240, 0.34, t + 0.003, 0.24, 240);
      // Delayed pressure wave: the part that makes the shot feel arena-sized.
      noise(ctx, dest, 0.72, t + 0.075, 0.66, 115, 0.22);
      osc(ctx, dest, "sine", 39, 0.82, t + 0.065, 0.78, 11);
      osc(ctx, dest, "triangle", 155, 0.34, t + 0.08, 0.48, 42);
      osc(ctx, dest, "sine", 620, 0.14, t + 0.09, 0.62, 170);
    },
    bulletHit: (ctx, dest, t) => {
      noise(ctx, dest, 0.72, t, 0.18, 2800, 1.25);
      noise(ctx, dest, 0.28, t + 0.01, 0.3, 620, 0.7);
      osc(ctx, dest, "sawtooth", 420, 0.42, t, 0.18, 72);
      osc(ctx, dest, "sine", 105, 0.5, t, 0.28, 27);
      osc(ctx, dest, "triangle", 1380, 0.2, t + 0.008, 0.32, 380);
    },
    gunReload: (ctx, dest, t) => {
      // Magazine insert / reload rustle
      noise(ctx, dest, 0.2, t, 0.08, 3000, 1.5);
      osc(ctx, dest, "triangle", 200, 0.15, t, 0.06, 300);
      osc(ctx, dest, "triangle", 400, 0.12, t + 0.08, 0.07, 250);
      noise(ctx, dest, 0.16, t + 0.3, 0.14, 2000, 1.2);
      osc(ctx, dest, "triangle", 250, 0.24, t + 0.3, 0.12, 150);

      // Cocking / slide release (chambering round) at t + 1.2s
      const tCock = t + 1.2;
      // Pull back
      noise(ctx, dest, 0.18, tCock, 0.06, 2800, 1.5);
      osc(ctx, dest, "triangle", 500, 0.2, tCock, 0.05, 900);
      // Let go (clack)
      noise(ctx, dest, 0.38, tCock + 0.12, 0.11, 3200, 1.8);
      osc(ctx, dest, "triangle", 800, 0.36, tCock + 0.12, 0.09, 1400);
      osc(ctx, dest, "sine", 1200, 0.15, tCock + 0.12, 0.05, 1800);
    },

    // Vampire Ball
    vampireLatch: (ctx, dest, t) => {
      noise(ctx, dest, 0.35, t, 0.4, 1500, 2);
      osc(ctx, dest, "sawtooth", 140, 0.2, t, 0.45, 70);
      osc(ctx, dest, "sine", 60, 0.3, t, 0.45, 50);
    },
    vampireDrain: (ctx, dest, t) => {
      noise(ctx, dest, 0.15, t, 0.25, 400, 1.0);
      osc(ctx, dest, "triangle", 100, 0.15, t, 0.25, 130);
    },

    // Bomb Ball
    bombFuse: (ctx, dest, t) => {
      noise(ctx, dest, 0.2, t, 0.08, 4500, 3);
      osc(ctx, dest, "square", 800, 0.05, t, 0.05, 900);
    },
    explosion: (ctx, dest, t) => {
      noise(ctx, dest, 0.95, t, 0.6, 200, 0.4);
      noise(ctx, dest, 0.4, t, 0.3, 1500, 0.8);
      osc(ctx, dest, "sine", 60, 0.8, t, 0.5, 20);
      osc(ctx, dest, "sawtooth", 45, 0.6, t, 0.55, 10);
      osc(ctx, dest, "triangle", 120, 0.5, t, 0.4, 30);
    },

    // Laser Ball
    laserCharge: (ctx, dest, t) => {
      osc(ctx, dest, "sawtooth", 200, 0.15, t, 0.8, 1000);
      osc(ctx, dest, "square", 100, 0.08, t, 0.8, 500);
      noise(ctx, dest, 0.1, t, 0.8, 3000, 1.5);
    },
    laserFire: (ctx, dest, t) => {
      osc(ctx, dest, "sawtooth", 120, 0.4, t, 0.65, 80);
      osc(ctx, dest, "square", 400, 0.25, t, 0.6, 200);
      noise(ctx, dest, 0.4, t, 0.65, 2500, 0.6);
    },

    // Shield Ball
    shieldThrow: (ctx, dest, t) => {
      noise(ctx, dest, 0.42, t, 0.34, 1450, 1.2);
      osc(ctx, dest, "triangle", 280, 0.32, t, 0.32, 720);
      osc(ctx, dest, "sine", 96, 0.3, t, 0.25, 48);
      osc(ctx, dest, "triangle", 820, 0.14, t + 0.03, 0.42, 360);
    },
    shieldBlock: (ctx, dest, t) => {
      noise(ctx, dest, 0.75, t, 0.28, 850, 0.65);
      noise(ctx, dest, 0.3, t + 0.012, 0.5, 3900, 2.4);
      osc(ctx, dest, "sine", 82, 0.72, t, 0.42, 24);
      osc(ctx, dest, "triangle", 260, 0.5, t, 0.38, 72);
      osc(ctx, dest, "sine", 1180, 0.42, t, 0.52, 690);
      osc(ctx, dest, "triangle", 1760, 0.2, t + 0.018, 0.66, 920);
    },
    shieldMetalHit: (ctx, dest, t) => {
      // A compact cannon report on contact, with only a brief steel accent.
      noise(ctx, dest, 1.34, t, 0.2, 920, 0.3);
      noise(ctx, dest, 0.64, t + 0.004, 0.43, 4200, 1.7);
      osc(ctx, dest, "sine", 64, 1.06, t, 0.5, 14);
      osc(ctx, dest, "sawtooth", 205, 0.66, t, 0.27, 31);
      osc(ctx, dest, "triangle", 1080, 0.3, t + 0.004, 0.24, 260);
      noise(ctx, dest, 0.68, t + 0.07, 0.58, 125, 0.24);
      osc(ctx, dest, "sine", 40, 0.76, t + 0.062, 0.68, 11);
      osc(ctx, dest, "triangle", 590, 0.18, t + 0.078, 0.36, 190);
    },
    shieldBashBoom: (ctx, dest, t) => {
      // Heavy shotgun-like blast: wider and lower than the thrown-shield hit.
      noise(ctx, dest, 1.48, t, 0.25, 760, 0.26);
      noise(ctx, dest, 0.78, t + 0.003, 0.52, 3600, 1.45);
      osc(ctx, dest, "sine", 52, 1.2, t, 0.62, 10);
      osc(ctx, dest, "sawtooth", 168, 0.76, t, 0.34, 24);
      osc(ctx, dest, "triangle", 880, 0.38, t + 0.006, 0.3, 180);
      noise(ctx, dest, 0.86, t + 0.075, 0.72, 105, 0.2);
      osc(ctx, dest, "sine", 34, 0.94, t + 0.064, 0.82, 8);
      osc(ctx, dest, "triangle", 138, 0.38, t + 0.082, 0.5, 38);
      osc(ctx, dest, "sine", 520, 0.16, t + 0.095, 0.5, 145);
    },
    shieldCatch: (ctx, dest, t) => {
      noise(ctx, dest, 0.4, t, 0.14, 900, 1);
      osc(ctx, dest, "triangle", 520, 0.32, t, 0.2, 180);
      osc(ctx, dest, "sine", 110, 0.25, t, 0.22, 52);
    },

    // Warper Ball
    warpCast: (ctx, dest, t) => {
      osc(ctx, dest, "sine", 58, 0.5, t, 0.72, 34);
      osc(ctx, dest, "sawtooth", 130, 0.26, t, 0.64, 680);
      osc(ctx, dest, "triangle", 420, 0.2, t + 0.04, 0.7, 1180);
      noise(ctx, dest, 0.2, t, 0.72, 2600, 3.2);
    },
    warpCapture: (ctx, dest, t) => {
      noise(ctx, dest, 0.62, t, 0.38, 1500, 1.4);
      osc(ctx, dest, "sine", 760, 0.44, t, 0.44, 94);
      osc(ctx, dest, "triangle", 1280, 0.24, t + 0.015, 0.5, 320);
      osc(ctx, dest, "sine", 72, 0.54, t + 0.02, 0.48, 28);
    },
    warpDrag: (ctx, dest, t) => {
      noise(ctx, dest, 0.34, t, 0.24, 1180, 2.8);
      osc(ctx, dest, "sawtooth", 92, 0.28, t, 0.24, 210);
      osc(ctx, dest, "triangle", 410, 0.18, t, 0.22, 118);
      osc(ctx, dest, "sine", 52, 0.42, t, 0.28, 36);
      osc(ctx, dest, "sine", 940, 0.1, t + 0.025, 0.2, 520);
    },
    warpSlam: (ctx, dest, t) => {
      noise(ctx, dest, 1.35, t, 0.82, 155, 0.24);
      noise(ctx, dest, 0.72, t + 0.008, 1.05, 3200, 1.7);
      osc(ctx, dest, "sine", 42, 1.25, t, 1.05, 10);
      osc(ctx, dest, "sawtooth", 126, 0.86, t, 0.7, 18);
      osc(ctx, dest, "triangle", 610, 0.54, t + 0.012, 0.92, 105);
      osc(ctx, dest, "sine", 1680, 0.34, t + 0.018, 1.15, 430);
      // A delayed dimensional aftershock gives the slam scale beyond the first transient.
      noise(ctx, dest, 0.78, t + 0.115, 0.7, 120, 0.22);
      osc(ctx, dest, "sine", 35, 0.92, t + 0.11, 0.82, 9);
      osc(ctx, dest, "triangle", 360, 0.32, t + 0.13, 0.72, 72);
    },

    // Spider Ball
    webShoot: (ctx, dest, t) => {
      noise(ctx, dest, 0.3, t, 0.18, 1500, 1.2);
      osc(ctx, dest, "sine", 500, 0.15, t, 0.15, 180);
    },
    webHit: (ctx, dest, t) => {
      noise(ctx, dest, 0.35, t, 0.28, 700, 0.9);
      osc(ctx, dest, "triangle", 180, 0.2, t, 0.25, 80);
    },

    // Spore Ball
    sporeShoot: (ctx, dest, t) => {
      noise(ctx, dest, 0.25, t, 0.15, 2000, 1.5);
      osc(ctx, dest, "triangle", 320, 0.15, t, 0.12, 550);
    },
    cactusHit: (ctx, dest, t) => {
      noise(ctx, dest, 0.35, t, 0.12, 1200, 1.8);
      osc(ctx, dest, "sawtooth", 280, 0.2, t, 0.1, 140);
    },

    // Hammer Ball
    hammerSpin: (ctx, dest, t) => {
      noise(ctx, dest, 0.34, t, 0.2, 420, 0.7);
      osc(ctx, dest, "sine", 105, 0.24, t, 0.2, 72);
      osc(ctx, dest, "triangle", 240, 0.1, t, 0.16, 150);
    },
    hammerCharge: (ctx, dest, t) => {
      osc(ctx, dest, "sawtooth", 74, 0.28, t, 0.82, 620);
      osc(ctx, dest, "triangle", 42, 0.42, t, 0.82, 170);
      osc(ctx, dest, "sine", 190, 0.18, t + 0.08, 0.72, 980);
      noise(ctx, dest, 0.18, t, 0.82, 2400, 2.2);
    },
    hammerLaunch: (ctx, dest, t) => {
      noise(ctx, dest, 0.88, t, 0.62, 520, 0.38);
      noise(ctx, dest, 0.28, t + 0.025, 0.7, 2800, 1.1);
      osc(ctx, dest, "sawtooth", 230, 0.62, t, 0.55, 32);
      osc(ctx, dest, "sine", 68, 0.78, t, 0.68, 20);
      osc(ctx, dest, "triangle", 410, 0.25, t + 0.02, 0.38, 95);
    },
    hammerHit: (ctx, dest, t) => {
      noise(ctx, dest, 1.15, t, 0.52, 210, 0.28);
      noise(ctx, dest, 0.42, t + 0.008, 0.72, 2100, 1.15);
      osc(ctx, dest, "sine", 48, 1.05, t, 0.7, 14);
      osc(ctx, dest, "sawtooth", 118, 0.72, t, 0.48, 24);
      osc(ctx, dest, "triangle", 310, 0.58, t, 0.52, 74);
      osc(ctx, dest, "sine", 920, 0.3, t + 0.012, 0.8, 410);
    },

    // Wall Spike Ball
    spikePlant: (ctx, dest, t) => {
      noise(ctx, dest, 0.4, t, 0.16, 600, 0.8);
      osc(ctx, dest, "triangle", 150, 0.3, t, 0.14, 50);
    },
    wallSpikeHit: (ctx, dest, t) => {
      noise(ctx, dest, 0.4, t, 0.15, 1500, 1.2);
      osc(ctx, dest, "sawtooth", 350, 0.25, t, 0.12, 100);
    },

    // String Web Ball
    stringTwang: (ctx, dest, t) => {
      osc(ctx, dest, "triangle", 480, 0.25, t, 0.45, 60);
      osc(ctx, dest, "sine", 200, 0.18, t, 0.45, 30);
      noise(ctx, dest, 0.12, t, 0.15, 2000, 1.5);
    },
    stringHit: (ctx, dest, t) => {
      osc(ctx, dest, "triangle", 550, 0.25, t, 0.15, 120);
      noise(ctx, dest, 0.25, t, 0.1, 3000, 1.8);
    },

    // Arm Ball
    armGrab: (ctx, dest, t) => {
      noise(ctx, dest, 0.35, t, 0.16, 800, 1.5);
      osc(ctx, dest, "triangle", 300, 0.25, t, 0.14, 150);
    },
    armSlam: (ctx, dest, t) => {
      noise(ctx, dest, 0.75, t, 0.32, 250, 0.3);
      osc(ctx, dest, "sine", 65, 0.75, t, 0.3, 30);
      osc(ctx, dest, "triangle", 130, 0.5, t, 0.25, 50);
    },

    // Fire Driver
    carRev: (ctx, dest, t) => {
      osc(ctx, dest, "sawtooth", 48, 0.3, t, 0.72, 118);
      osc(ctx, dest, "square", 72, 0.1, t + 0.03, 0.66, 168);
      osc(ctx, dest, "sine", 38, 0.38, t, 0.78, 76);
      noise(ctx, dest, 0.14, t, 0.72, 260, 0.7);
      osc(ctx, dest, "sawtooth", 125, 0.12, t + 0.44, 0.3, 185);
    },

    // Eight Ball
    cueReady: (ctx, dest, t) => {
      osc(ctx, dest, "sine", 48, 0.48, t, 0.72, 92);
      osc(ctx, dest, "triangle", 160, 0.28, t, 0.68, 620);
      osc(ctx, dest, "sine", 520, 0.15, t + 0.06, 0.58, 1180);
      noise(ctx, dest, 0.2, t, 0.7, 1700, 2.6);
    },
    cueStrike: (ctx, dest, t) => {
      noise(ctx, dest, 1.15, t, 0.24, 1350, 0.8);
      noise(ctx, dest, 0.46, t + 0.01, 0.54, 4800, 2.1);
      osc(ctx, dest, "triangle", 760, 0.58, t, 0.3, 120);
      osc(ctx, dest, "sine", 92, 0.82, t, 0.58, 18);
      osc(ctx, dest, "sawtooth", 220, 0.42, t + 0.006, 0.36, 38);
      osc(ctx, dest, "sine", 38, 0.46, t + 0.065, 0.7, 11);
    },
    cueImpact: (ctx, dest, t) => {
      noise(ctx, dest, 0.82, t, 0.24, 1050, 0.8);
      noise(ctx, dest, 0.28, t + 0.008, 0.42, 3600, 1.8);
      osc(ctx, dest, "triangle", 480, 0.5, t, 0.34, 72);
      osc(ctx, dest, "sine", 76, 0.74, t, 0.52, 17);
      osc(ctx, dest, "sawtooth", 165, 0.34, t, 0.28, 34);
      osc(ctx, dest, "sine", 980, 0.18, t + 0.012, 0.5, 310);
    },

    // Chess Ball
    chessMove: (ctx, dest, t) => {
      noise(ctx, dest, 0.25, t, 0.22, 500, 0.8);
      osc(ctx, dest, "triangle", 180, 0.2, t, 0.22, 350);
    },
    chessSlam: (ctx, dest, t) => {
      noise(ctx, dest, 0.8, t, 0.35, 200, 0.4);
      osc(ctx, dest, "sine", 50, 0.85, t, 0.38, 20);
      osc(ctx, dest, "sawtooth", 90, 0.45, t, 0.32, 30);
      osc(ctx, dest, "triangle", 280, 0.4, t, 0.28, 90);
    },

    // Round result
    roundWin: (ctx, dest, t) => {
      noise(ctx, dest, 0.95, t, 1.2, 350, 0.4);
      noise(ctx, dest, 0.65, t + 0.1, 2.0, 1800, 0.8);
      osc(ctx, dest, "sine", 70, 0.9, t, 0.8, 20);
      osc(ctx, dest, "sawtooth", 45, 0.7, t, 0.9, 10);
    },
    roundLose: (ctx, dest, t) => {
      noise(ctx, dest, 0.95, t, 1.2, 350, 0.4);
      noise(ctx, dest, 0.65, t + 0.1, 2.0, 1800, 0.8);
      osc(ctx, dest, "sine", 70, 0.9, t, 0.8, 20);
      osc(ctx, dest, "sawtooth", 45, 0.7, t, 0.9, 10);
    },
  });

  // ─── Public API ─────────────────────────────────────────────────────────────

  const playSound = useCallback((name, volume = 1, cooldownMs = 0, spatial = null) => {
    if (mutedRef.current) return;
    const fn = sounds.current[name];
    if (!fn) return;
    const ctx = getCtx();
    if (!ctx) return;

    // Cooldown check (avoid sound spam)
    if (cooldownMs > 0) {
      const key = name;
      const now = ctx.currentTime;
      if (cooldowns.current[key] && cooldowns.current[key] > now) return;
      cooldowns.current[key] = now + cooldownMs / 1000;
    }

    const roomBySound = {
      hammerHit: 0.48,
      hammerLaunch: 0.4,
      hammerCharge: 0.32,
      shieldBlock: 0.48,
      shieldMetalHit: 0.54,
      shieldBashBoom: 0.6,
      shieldThrow: 0.34,
      gunShot: 0.56,
      bulletHit: 0.42,
      gunReload: 0.28,
      wallBounce: 0.42,
      warpCast: 0.48,
      warpCapture: 0.52,
      warpDrag: 0.56,
      warpSlam: 0.62,
      cueReady: 0.42,
      cueStrike: 0.56,
      cueImpact: 0.5,
      explosion: 0.5,
    };
    const spatialConfig = typeof spatial === "number"
      ? { pan: spatial }
      : { ...(spatial || {}) };
    if (spatialConfig.room === undefined) spatialConfig.room = roomBySound[name] ?? 0.16;
    const dest = createSpatialBus(ctx, masterGainRef.current, spatialConfig);
    const t = ctx.currentTime;

    // Volume scaling wrapper: inject a temporary gain node
    if (volume !== 1) {
      const g = ctx.createGain();
      g.gain.value = Math.max(0, Math.min(2, volume));
      g.connect(dest);
      fn(ctx, g, t);
    } else {
      fn(ctx, dest, t);
    }
  }, [createSpatialBus, getCtx]);

  const toggleMute = useCallback(() => {
    mutedRef.current = !mutedRef.current;
    mutedStateRef.current = mutedRef.current;
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = mutedRef.current ? 0 : 0.5;
    }
    return mutedRef.current;
  }, []);

  const isMuted = useCallback(() => mutedRef.current, []);

  const getAudioStream = useCallback(() => {
    getCtx();
    return ctxRef.current ? ctxRef.current.recStreamDestination?.stream : null;
  }, [getCtx]);

  const playAudioFile = useCallback(async (url, volume = 1, delay = 0) => {
    if (mutedRef.current) return;
    const ctx = getCtx();
    if (!ctx || !masterGainRef.current) return;
    try {
      if (!audioBufferCacheRef.current[url]) {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        audioBufferCacheRef.current[url] = await ctx.decodeAudioData(arrayBuffer);
      }
      const source = ctx.createBufferSource();
      const gain = ctx.createGain();
      source.buffer = audioBufferCacheRef.current[url];
      gain.gain.value = Math.max(0, Math.min(2, volume));
      source.connect(gain);
      gain.connect(masterGainRef.current);
      source.start(ctx.currentTime + Math.max(0, delay));
    } catch {
      // Ignore announcer/music file failures; procedural SFX should continue.
    }
  }, [getCtx]);

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

  return { playSound, playAudioFile, toggleMute, isMuted, getAudioStream, startMatchMusic, stopMatchMusic };
}
