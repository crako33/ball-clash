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
      noise(ctx, dest, 0.25, t, 0.07, 300, 0.8);
      osc(ctx, dest, "sine", 120, 0.18, t, 0.07, 60);
    },
    ballCollision: (ctx, dest, t) => {
      noise(ctx, dest, 0.3, t, 0.09, 800, 0.7);
      osc(ctx, dest, "sine", 200, 0.2, t, 0.08, 80);
    },
    damage: (ctx, dest, t) => {
      osc(ctx, dest, "sawtooth", 180, 0.12, t, 0.06, 90);
    },

    // Knife Ball
    knifeHit: (ctx, dest, t) => {
      noise(ctx, dest, 0.4, t, 0.08, 4000, 2);
      osc(ctx, dest, "sawtooth", 600, 0.15, t, 0.06, 200);
    },

    // Spike Ball
    spikeHit: (ctx, dest, t) => {
      noise(ctx, dest, 0.35, t, 0.1, 1200, 1.5);
      osc(ctx, dest, "square", 150, 0.15, t, 0.1, 80);
    },

    // Gun Ball
    gunShot: (ctx, dest, t) => {
      noise(ctx, dest, 0.55, t, 0.12, 1800, 0.5);
      osc(ctx, dest, "sawtooth", 220, 0.35, t, 0.1, 55);
    },
    bulletHit: (ctx, dest, t) => {
      noise(ctx, dest, 0.3, t, 0.07, 3000, 1.2);
      osc(ctx, dest, "sine", 440, 0.1, t, 0.05, 110);
    },
    gunReload: (ctx, dest, t) => {
      osc(ctx, dest, "sine", 320, 0.08, t, 0.05, 280);
      osc(ctx, dest, "sine", 500, 0.06, t + 0.06, 0.05, 420);
    },

    // Vampire Ball
    vampireLatch: (ctx, dest, t) => {
      osc(ctx, dest, "sine", 220, 0.1, t, 0.4, 180);
      osc(ctx, dest, "sawtooth", 110, 0.05, t, 0.4, 90);
    },
    vampireDrain: (ctx, dest, t) => {
      osc(ctx, dest, "sine", 180, 0.07, t, 0.2, 200);
    },

    // Bomb Ball
    bombFuse: (ctx, dest, t) => {
      osc(ctx, dest, "square", 600, 0.06, t, 0.06, 650);
    },
    explosion: (ctx, dest, t) => {
      noise(ctx, dest, 0.9, t, 0.4, 250, 0.3);
      osc(ctx, dest, "sine", 80, 0.6, t, 0.35, 30);
      osc(ctx, dest, "sawtooth", 55, 0.4, t, 0.4, 20);
    },

    // Laser Ball
    laserCharge: (ctx, dest, t) => {
      osc(ctx, dest, "sawtooth", 300, 0.08, t, 0.8, 1200);
    },
    laserFire: (ctx, dest, t) => {
      osc(ctx, dest, "square", 800, 0.2, t, 0.6, 1200);
      noise(ctx, dest, 0.2, t, 0.6, 6000, 3);
    },

    // Shield Ball
    shieldThrow: (ctx, dest, t) => {
      noise(ctx, dest, 0.2, t, 0.12, 2500, 2);
      osc(ctx, dest, "sine", 500, 0.12, t, 0.1, 300);
    },
    shieldBlock: (ctx, dest, t) => {
      noise(ctx, dest, 0.35, t, 0.15, 1800, 1);
      osc(ctx, dest, "triangle", 350, 0.25, t, 0.15, 200);
    },
    shieldCatch: (ctx, dest, t) => {
      osc(ctx, dest, "sine", 700, 0.1, t, 0.12, 900);
    },

    // Spider Ball
    webShoot: (ctx, dest, t) => {
      noise(ctx, dest, 0.15, t, 0.1, 3500, 3);
      osc(ctx, dest, "sine", 900, 0.08, t, 0.08, 200);
    },
    webHit: (ctx, dest, t) => {
      osc(ctx, dest, "sine", 300, 0.12, t, 0.25, 150);
      osc(ctx, dest, "triangle", 180, 0.1, t, 0.25, 100);
    },



    // Spore Ball
    sporeShoot: (ctx, dest, t) => {
      osc(ctx, dest, "sine", 400, 0.08, t, 0.12, 600);
      noise(ctx, dest, 0.1, t, 0.1, 1200, 2);
    },
    cactusHit: (ctx, dest, t) => {
      osc(ctx, dest, "sawtooth", 250, 0.12, t, 0.08, 180);
      noise(ctx, dest, 0.15, t, 0.08, 900, 1);
    },

    // Hammer Ball
    hammerSpin: (ctx, dest, t) => {
      noise(ctx, dest, 0.12, t, 0.08, 1500, 2.5);
    },
    hammerCharge: (ctx, dest, t) => {
      osc(ctx, dest, "sawtooth", 200, 0.1, t, 0.3, 600);
    },
    hammerLaunch: (ctx, dest, t) => {
      noise(ctx, dest, 0.5, t, 0.35, 400, 0.5);
      osc(ctx, dest, "sawtooth", 150, 0.35, t, 0.3, 50);
    },
    hammerHit: (ctx, dest, t) => {
      noise(ctx, dest, 0.6, t, 0.2, 300, 0.4);
      osc(ctx, dest, "sine", 100, 0.5, t, 0.25, 40);
    },

    // Wall Spike Ball
    spikePlant: (ctx, dest, t) => {
      noise(ctx, dest, 0.3, t, 0.1, 800, 1);
      osc(ctx, dest, "sine", 180, 0.2, t, 0.1, 90);
    },
    wallSpikeHit: (ctx, dest, t) => {
      noise(ctx, dest, 0.3, t, 0.08, 2000, 1.5);
      osc(ctx, dest, "sawtooth", 300, 0.15, t, 0.07, 150);
    },

    // String Web Ball
    stringTwang: (ctx, dest, t) => {
      osc(ctx, dest, "triangle", 550, 0.12, t, 0.35, 80);
      osc(ctx, dest, "sine", 280, 0.08, t, 0.35, 50);
    },
    stringHit: (ctx, dest, t) => {
      osc(ctx, dest, "triangle", 700, 0.15, t, 0.12, 200);
    },

    // Arm Ball
    armGrab: (ctx, dest, t) => {
      noise(ctx, dest, 0.25, t, 0.12, 1000, 2);
      osc(ctx, dest, "sine", 350, 0.18, t, 0.12, 180);
    },
    armSlam: (ctx, dest, t) => {
      noise(ctx, dest, 0.5, t, 0.25, 400, 0.5);
      osc(ctx, dest, "triangle", 120, 0.35, t, 0.25, 60);
    },

    // Chess Ball
    chessMove: (ctx, dest, t) => {
      noise(ctx, dest, 0.15, t, 0.18, 1200, 2);
      osc(ctx, dest, "sine", 250, 0.15, t, 0.18, 500);
    },
    chessSlam: (ctx, dest, t) => {
      noise(ctx, dest, 0.4, t, 0.25, 400, 0.8);
      osc(ctx, dest, "sine", 180, 0.45, t, 0.35, 80);
      osc(ctx, dest, "triangle", 360, 0.25, t, 0.25, 120);
    },

    // Round result
    roundWin: (ctx, dest, t) => {
      [0, 0.15, 0.30, 0.5].forEach((dt, i) => {
        const freqs = [523, 659, 784, 1047];
        osc(ctx, dest, "triangle", freqs[i], 0.18, t + dt, 0.3);
      });
    },
    roundLose: (ctx, dest, t) => {
      osc(ctx, dest, "sawtooth", 220, 0.15, t, 0.3, 110);
      osc(ctx, dest, "sawtooth", 185, 0.12, t + 0.15, 0.35, 90);
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

  return { playSound, toggleMute, isMuted };
}
