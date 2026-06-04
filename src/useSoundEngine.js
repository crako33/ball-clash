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
  // cooldown map: soundKey -> earliest next play time (AudioContext time)
  const cooldowns = useRef({});

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      ctxRef.current = new AudioCtx();
      masterGainRef.current = ctxRef.current.createGain();
      masterGainRef.current.gain.value = 0.55;
      masterGainRef.current.connect(ctxRef.current.destination);

      // Create stream destination node to allow recording audio
      ctxRef.current.recStreamDestination = ctxRef.current.createMediaStreamDestination();
      masterGainRef.current.connect(ctxRef.current.recStreamDestination);
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
      noise(ctx, dest, 0.35, t, 0.1, 150, 0.6);
      osc(ctx, dest, "sine", 90, 0.3, t, 0.12, 40);
      osc(ctx, dest, "triangle", 160, 0.15, t, 0.08, 80);
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
      noise(ctx, dest, 0.7, t, 0.25, 1200, 0.4);
      osc(ctx, dest, "sawtooth", 160, 0.5, t, 0.2, 30);
      osc(ctx, dest, "sine", 80, 0.6, t, 0.28, 20);
    },
    bulletHit: (ctx, dest, t) => {
      noise(ctx, dest, 0.4, t, 0.1, 2500, 1.0);
      osc(ctx, dest, "sawtooth", 300, 0.25, t, 0.08, 90);
      osc(ctx, dest, "sine", 120, 0.3, t, 0.12, 40);
    },
    gunReload: (ctx, dest, t) => {
      noise(ctx, dest, 0.2, t, 0.08, 3000, 1.5);
      osc(ctx, dest, "triangle", 200, 0.15, t, 0.06, 300);
      osc(ctx, dest, "triangle", 400, 0.12, t + 0.08, 0.07, 250);
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
      noise(ctx, dest, 0.25, t, 0.2, 1800, 1.5);
      osc(ctx, dest, "triangle", 350, 0.2, t, 0.18, 480);
    },
    shieldBlock: (ctx, dest, t) => {
      noise(ctx, dest, 0.45, t, 0.2, 1000, 0.7);
      osc(ctx, dest, "triangle", 220, 0.35, t, 0.22, 90);
      osc(ctx, dest, "sine", 950, 0.25, t, 0.18, 800);
    },
    shieldCatch: (ctx, dest, t) => {
      noise(ctx, dest, 0.25, t, 0.1, 800, 1);
      osc(ctx, dest, "triangle", 400, 0.2, t, 0.12, 250);
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
      noise(ctx, dest, 0.25, t, 0.12, 350, 0.6);
      osc(ctx, dest, "sine", 110, 0.15, t, 0.12, 90);
    },
    hammerCharge: (ctx, dest, t) => {
      osc(ctx, dest, "sawtooth", 150, 0.2, t, 0.35, 450);
      osc(ctx, dest, "triangle", 90, 0.15, t, 0.35, 180);
    },
    hammerLaunch: (ctx, dest, t) => {
      noise(ctx, dest, 0.65, t, 0.45, 600, 0.4);
      osc(ctx, dest, "sawtooth", 180, 0.45, t, 0.4, 40);
      osc(ctx, dest, "sine", 70, 0.5, t, 0.45, 30);
    },
    hammerHit: (ctx, dest, t) => {
      noise(ctx, dest, 0.8, t, 0.38, 250, 0.3);
      osc(ctx, dest, "sine", 55, 0.8, t, 0.35, 25);
      osc(ctx, dest, "sawtooth", 100, 0.5, t, 0.3, 35);
      osc(ctx, dest, "triangle", 220, 0.4, t, 0.25, 110);
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

  const playSound = useCallback((name, volume = 1, cooldownMs = 0) => {
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

    const dest = masterGainRef.current;
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
  }, [getCtx]);

  const toggleMute = useCallback(() => {
    mutedRef.current = !mutedRef.current;
    mutedStateRef.current = mutedRef.current;
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = mutedRef.current ? 0 : 0.55;
    }
    return mutedRef.current;
  }, []);

  const isMuted = useCallback(() => mutedRef.current, []);

  const getAudioStream = useCallback(() => {
    getCtx();
    return ctxRef.current ? ctxRef.current.recStreamDestination?.stream : null;
  }, [getCtx]);

  return { playSound, toggleMute, isMuted, getAudioStream };
}
