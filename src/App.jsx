import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSoundEngine } from "./useSoundEngine";

const BALL_TYPES = {
  knife: {
    id: "knife",
    name: "Saber Ball",
    shortName: "SABR",
    color: "#4ade80",
    stroke: "#15803d",
    radius: 30,
    description: "Yoda-like brawler with a green lightsaber. Secondary: Saber Throw.",
  },
  gun: {
    id: "gun",
    name: "Gunner Ball",
    shortName: "GUNR",
    color: "#0f172a",
    stroke: "#f1f5f9",
    radius: 30,
    description: "Suit brawler with a beagle dog. Permanent rapid fire unlocks when the dog dies.",
  },
  vampire: {
    id: "vampire",
    name: "Vamper Ball",
    shortName: "VAMP",
    color: "#1e1b4b",
    stroke: "#b91c1c",
    radius: 30,
    description: "Vampiric brawler. Latch to drain health. Cape and glowing red eyes.",
  },
  laser: {
    id: "laser",
    name: "Laser Ball",
    shortName: "LASR",
    color: "#dc2626",
    stroke: "#facc15",
    radius: 30,
    description: "Iron-style repulsor brawler. Charges white beams and periodic stun pulses.",
  },
  shield: {
    id: "shield",
    name: "Shielder Ball",
    shortName: "SHLD",
    color: "#3b82f6",
    stroke: "#ef4444",
    radius: 32,
    description: "Throws a round shield. Secondary: Bash & Emergency Recall.",
  },
  spider: {
    id: "spider",
    name: "Spider Ball",
    shortName: "SPIDR",
    color: "#ef4444",
    stroke: "#3b82f6",
    radius: 30,
    description: "Webs enemies, pulls them in. Secondary: Slow Web.",
  },
  blackSpider: {
    id: "blackSpider",
    name: "Black Spider Ball",
    shortName: "BSPD",
    color: "#020617",
    stroke: "#f1f5f9",
    radius: 30,
    description: "Throws a web line to pull, spin, and slam enemies into corners.",
  },
  bomber: {
    id: "bomber",
    name: "Bomber Ball",
    shortName: "MINE",
    color: "#facc15",
    stroke: "#78350f",
    radius: 29,
    description: "Lays up to 3 proximity landmines. Secondary: Homing Mine.",
  },
  spore: {
    id: "spore",
    name: "Sporer Ball",
    shortName: "SPOR",
    color: "#020617",
    stroke: "#ef4444",
    radius: 30,
    description: "Drops spores that grow wiggling hydras.",
  },
  hammer: {
    id: "hammer",
    name: "Hammer Ball",
    shortName: "HAMR",
    color: "#cbd5e1",
    stroke: "#64748b",
    radius: 30,
    description: "Spins hammer then launches itself rocket-like.",
  },
  stringWeb: {
    id: "stringWeb",
    name: "Line Weaver Ball",
    shortName: "WEB",
    color: "#d946ef",
    stroke: "#fdf4ff",
    radius: 30,
    description: "Creates damaging laser string nets.",
  },
  arm: {
    id: "arm",
    name: "Armer Ball",
    shortName: "ARM",
    color: "#020617",
    stroke: "#cbd5e1",
    radius: 31,
    description: "Grabs opponent, slams them into corners. Secondary: Elbow Drop.",
  },
  chess: {
    id: "chess",
    name: "Chesser Ball",
    shortName: "CHES",
    color: "#e2e8f0",
    stroke: "#fbbf24",
    radius: 30,
    description: "Summons random chess crown. Castles to swap positions.",
  },
  wrecker: {
    id: "wrecker",
    name: "Wrecker Ball",
    shortName: "WREK",
    color: "#22c55e",
    stroke: "#15803d",
    radius: 36,
    description: "Hulk-like brawler. Leaps to smash, rage boosts size. Secondary: Ground Push.",
  },
  dragon: {
    id: "dragon",
    name: "Dragon Ball",
    shortName: "DRGN",
    color: "#dc2626",
    stroke: "#f97316",
    radius: 33,
    description: "Burst fire-breather. Exploding giant fireballs. Secondary: Flame Dash.",
  },
  psychicer: {
    id: "psychicer",
    name: "Psychicer Ball",
    shortName: "PSY",
    color: "#8b5cf6",
    stroke: "#f0abfc",
    radius: 31,
    description: "Drops psychic circles. Enemies caught inside take damage on their next bounces.",
  },
  chaos: {
    id: "chaos",
    name: "Warper Ball",
    shortName: "WARP",
    color: "#1e3a8a",
    stroke: "#f59e0b",
    radius: 31,
    description: "Sorcerer brawler with Eldritch shields and Time portals. Conjures magic circles that slam enemies into walls.",
  },
  trident: {
    id: "trident",
    name: "Trident Ball",
    shortName: "TRID",
    color: "#fbbf24",
    stroke: "#22c55e",
    radius: 31,
    description: "Throws a trident that pins enemies to walls, sticks on miss, then recalls.",
  },
  shadow: {
    id: "shadow",
    name: "Shadow Summoner Ball",
    shortName: "SHDW",
    color: "#111827",
    stroke: "#a78bfa",
    radius: 31,
    description: "Slashes nearby enemies and summons tiny shadow minions that swarm opponents.",
  },
  feralClaw: {
    id: "feralClaw",
    name: "Feral Claw Ball",
    shortName: "CLAW",
    color: "#eab308",
    stroke: "#1f2937",
    radius: 31,
    description: "Relentless claw brawler. Alternates twin slashes, pounces from mid-range, and regenerates after escaping pressure.",
  },
  mirror: {
    id: "mirror",
    name: "Mirrorer Ball",
    shortName: "MIRR",
    color: "#67e8f9",
    stroke: "#f8fafc",
    radius: 31,
    description: "Creates a mirrored clone across the arena center. Clone damages, main body bounces.",
  },
  joker: {
    id: "joker",
    name: "Joker Ball",
    shortName: "JOKR",
    color: "#fb7185",
    stroke: "#f9a8d4",
    radius: 31,
    description: "Trickster brawler with elastic Bungee Lines. Sets up ricochet angles to hook enemies and drag them through wall corners.",
  },
  gazerBall: {
    id: "gazerBall",
    name: "Gazer Ball",
    shortName: "GAZR",
    color: "#dc2626",
    stroke: "#ef4444",
    radius: 31,
    description: "Legendary beam warrior. Builds Focus stacks for powered shots. Fires devastating red gaze blasts that ricochet. Omega Surge unleashes hell.",
  },
  constellation: {
    id: "constellation",
    name: "Constellation Ball",
    shortName: "CSTL",
    color: "#1e1b4b",
    stroke: "#e0f2fe",
    radius: 31,
    description: "Cosmic weaver. Bounces place stars. Active skill connects stars into active shapes (Circle, Line, Triangle, Square) with powerful effects.",
  },
  fireSkull: {
    id: "fireSkull",
    name: "Fire Driver",
    shortName: "FDRV",
    color: "#f8fafc",
    stroke: "#ef4444",
    radius: 31,
    description: "Draws a burning road across wall bounces, then drives a blazing car along it five times.",
  },
};

const getHpBarColor = (type) => {
  if (type === "arm") return "#8b0000";
  if (type === "gun") return "#ffffff";
  return BALL_TYPES[type]?.color || "#4ade80";
};

const GRID_SIZE = 7;
const TILE_SIZE = 64;
const ARENA_SIZE = GRID_SIZE * TILE_SIZE;
const OPENING_SKILL_DELAY = 2000;
const MIN_DAMAGE = 1;
const SHIELD_GUARD_HITS = 5;
const SHIELD_PICKUP_RADIUS = 30;
const SHIELD_DROP_COOLDOWN = 1000;
const SHIELD_BASH_READY_THROWS = 3;
const SHIELD_BASH_CLOSE_RADIUS = 95;
const SHIELD_BASH_LUNGE_SPEED = 720;
const SHIELD_BASH_LUNGE_DURATION = 430;
const HYDRA_MAX_GLOW_STACKS = 3;
const HYDRA_RAGE_PER_BOUNCE = 1;
const SPIDER_FINAL_BOUNCE_MULTIPLIER = 1.8;
const ARM_RAGDOLL_WALL_DAMAGE = 7;
const ARM_THROW_WALL_DAMAGE = 10;
const CHESS_CROWN_HITBOX_MULTIPLIER = 1.5;
const BOUNCE_SPEED_MULTIPLIER = 1;
const MAX_HEALTH = 150;
const MAX_PARTICLES = 180;
const MAX_FLOATING_TEXTS = 48;
const MAX_TRAIL_POINTS = 13;
const MAX_EXPLOSIONS = 12;
const DEATH_SLOW_MO_DURATION = 1400;
const FIGHT_INTRO_DURATION = 2050;
const FIGHT_INTRO_IMPACT_AT = 1550;

const BALANCE = {
  knife: { damage: 2, cooldown: 390, bladeLength: 60, spinSpeed: 0.09, secCooldown: 3500, secDamage: 5 },
  gun: { bulletDamage: 1, bulletSpeed: 420, shotCooldown: 520, reloadTime: 1900, bulletLife: 1.55, secCooldown: 4000, secDashForce: 380, dogDamage: 3, dogHealth: 50, dogSpeed: 190, dogCooldown: 9000, rapidFireCooldown: 140, rapidPierceShots: 2 },
  vampire: { drainPerTick: 1, healPerTick: 1, tickCooldown: 250, latchDuration: 1000, latchCooldown: 3000, latchDistance: 10 },
  laser: { damagePerTick: 1, tickCooldown: 90, chargeTime: 750, fireDuration: 650, cooldown: 2300, beamWidth: 14, pulseDamage: 10, pulseSpeed: 620, pulseStunDuration: 950, recoilForce: 180 },
  shield: { damage: 2, arcWidth: 1.57, knockback: 14, cooldown: 1000, shieldSpeed: 550, returnSpeed: 650, duration: 1200, secCooldownHeld: 3000, secBashDamage: 4 },
  spider: { fangDamage: 2, webSpeed: 900, pullSpeed: 700, bounceSpeed: 470, pullDuration: 900, cooldown: 3400, secCooldown: 7700, secPoolRadius: 35, secDamage: 1 },
  bomber: { mineDamage: 10, mineRadius: 70, mineTriggerDist: 15, cooldown: 2200, maxMines: 3, knockback: 16, secCooldown: 7000 },
  spore: { cactusDamage: 2, growthDuration: 1000, speedBoost: 2, cactusLife: 5000, cooldown: 6000 },
  hammer: { spinDamage: 4, launchDamage: 10, spinSpeed: 0.05, chargeDuration: 900, launchSpeed: 580, launchDuration: 580, cooldown: 1500 },
  stringWeb: { stringDamage: 3, stringLifetime: 9000, maxStrings: 14, stringHitPadding: 10, trampolineCooldown: 1100, trampolineBoost: 1.45, trampolineMinSpeed: 310 },
  arm: { slamDamage: 1, grabRange: 40, grabDuration: 500, swingSpeed: 0.1, cooldown: 6000, punchDamage: 1, punchRange: 55, punchCooldown: 600, punchKnockback: 330, secCooldown: 7000, secSlamDamage: 6 },
  chess: { cooldown: 6000, centerSpeed: 230, crownDuration: 2500, damage: 7, tickCooldown: 400 },
  wrecker: { cooldown: 950, leapDamage: 10, megaLeapDamage: 16, shockwaveRadius: 78, megaShockwaveRadius: 108, knockbackForce: 500, rageRequired: 6, megaRageRequired: 12, pushCooldown: 2200, pushRange: 52, pushForce: 420, pushDamage: 2, leapCooldown: 7200, leapDuration: 680, leapLeadTime: 0.38, landingRecoil: 240, recoverySpeed: 230, bounceBoost: 1.1, maxBounceSpeed: 300, sizePerRage: 0.015, maxRageSizeScale: 1.16, megaSizeScale: 1.24 },
  dragon: { flameDamage: 1, flameRange: 100, flameAngle: 0.55, tickCooldown: 460, breathDuration: 650, breathCooldown: 1800, heatPerWallBounce: 1, heatRequired: 5, fireballDamage: 5, fireballSpeed: 440, fireballBounces: 1, burnDuration: 900, cooldown: 2300, secCooldown: 5000, secDamage: 8, secDashForce: 650 },
  psychicer: { circleDamage: 1, circleRadius: 86, circlesPerDrop: 1, maxBounceHits: 5, cooldown: 5600, circleLife: 7000 },
  chaos: { circleRadius: 48, launchSpeed: 950, slamDamage: 6, controlHold: 220, controlDuration: 1200, radiusBounce: 140, cooldown: 5600, circleLife: 6800, triggerCooldown: 1000, trapCount: 3 },
  trident: { throwDamage: 4, wallDamage: 5, throwSpeed: 760, recallSpeed: 720, cooldown: 6800, stuckDuration: 800, diveDamage: 6, diveCooldown: 8400, diveTrackDuration: 1150, divePauseDuration: 520, diveSpeed: 720, diveBurstRadius: 44, diveSlowDuration: 1600, diveSlowMultiplier: 0.35 },
  shadow: { slashDamage: 2, slashRange: 35, slashCooldown: 450, comboRange: 36, comboSecondDamage: 2, summonCooldown: 4600, maxMinions: 3, minionHealth: 4, minionDamage: 1, minionSpeed: 33, minionLife: 6200, minionHitCooldown: 1100, commandDuration: 700, markDuration: 1100, switchCooldown: 6000, switchRange: 145, switchDamage: 3 },
  feralClaw: { slashDamage: 3, slashRange: 30, slashCooldown: 720, slashKnockback: 210, slashWindup: 90, slashDuration: 310, slashLunge: 155, slashRecoil: 105, pounceDamage: 7, pounceCooldown: 5200, pounceSpeed: 650, pounceDuration: 480, pounceWindup: 220, pounceOvershoot: 190, pounceMinRange: 115, pounceMaxRange: 285, regenDelay: 2800, regenAmount: 1, regenInterval: 1000, lowHealthThreshold: 45, lowHealthCooldownMult: 0.78, lowHealthRegenMult: 0.72, rageJitter: 36, ultimateThreshold: 28, ultimateDuration: 4800, ultimateCooldownMult: 0.48, ultimateSpeedMult: 1.08, ultimateDamageMult: 1.1 },
  mirror: { cloneDamage: 3, hitCooldown: 650, cloneRadiusScale: 0.82, knockback: 240, switchCooldown: 4200 },
  joker: { throwSpeed: 580, cooldown: 6000, secCooldown: 8000, tipRadius: 9, maxBounces: 15, threadLife: 4000 },
  blackSpider: { cooldown: 7000, secCooldown: 10000, pullSpeed: 1200,
    // String Pull Slam
    slamCooldown: 7000, slamStringSpeed: 900, slamPullDuration: 600, slamSpinDuration: 700, slamSpinRadius: 75, slamLaunchSpeed: 1150, slamWallDamage: 12, slamHitDamage: 4,
    // Tendril Trap
    trapRadius: 32, trapDuration: 6000, trapStickDuration: 500, trapSpeedBoost: 280, maxTraps: 3,
  },
  gazerBall: { chargeDuration: 320, cooldown: 1350, beamDamage: 4, beamKnockback: 720, beamWidth: 4, stunDuration: 420, recoilForce: 620, ricochetSpeed: 1200, ricochetLife: 3500, maxBounces: 5, ricochetDmg: [14, 11, 8, 6, 4], ricochetKb: [520, 420, 320, 220, 140], focusInterval: 700, maxFocusStacks: 5, focusBonus: 0.08, ultDuration: 5500, ultWidthMult: 1.7, ultMaxBounces: 10, ultCDRMult: 0.45, postFireSlowDuration: 260 },
  constellation: { cooldown: 4200, activePatternDuration: 4800, triangleDamage: 8, triangleKnockback: 420, squareEdgeDamage: 4, squareTickDamage: 2, squareKnockback: 340, pentagonEdgeDamage: 5, pentagonTickDamage: 3, pentagonPullStrength: 180, postFireSlowDuration: 300, ultDuration: 5600 },
  fireSkull: { cooldown: 8000, carDamage: 8, carKnockback: 1280, carSpeed: 950, carRadius: 40, carHitboxScale: 1.32, roadWidth: 28, minRoadLength: 520, carPasses: 5, maxRoadLife: 10000 },
};

const BALANCE_STORAGE_KEY = "ball-fighters-balance-v1";
const WRECKER_GRUMBLES = ["Grrrr!", "RAAHH!", "SMASH!", "HRRRGH!", "MAD!"];

const mergeBalanceSettings = (base, saved = {}) => {
  const merged = {};
  Object.entries(base).forEach(([type, settings]) => {
    merged[type] = { ...settings, ...(saved[type] || {}) };
  });
  return merged;
};

const loadSavedBalanceSettings = () => {
  if (typeof window === "undefined") return BALANCE;
  try {
    const raw = window.localStorage.getItem(BALANCE_STORAGE_KEY);
    if (!raw) return BALANCE;
    return mergeBalanceSettings(BALANCE, JSON.parse(raw));
  } catch {
    return BALANCE;
  }
};

const hasStringBounceGuard = (ball) => ball?.type === "stringWeb" && (ball.stringBounceWallBouncesLeft || 0) > 0;
const isWreckerJumpInvulnerable = (ball) => (ball?.type === "wrecker" && ball.wreckerState === "leaping") || (ball?.type === "dragon" && ball.dragonState === "dashing");

const interruptSkills = (ball) => {
  if (!ball) return;
  if (ball.laserState) ball.laserState = "idle";
  if (ball.laserStateUntil) ball.laserStateUntil = 0;
  if (ball.hammerState) ball.hammerState = "spinning";
  if (ball.hammerStateUntil) ball.hammerStateUntil = 0;
  if (ball.dragonBreathUntil) ball.dragonBreathUntil = 0;
  if (ball.knifeBladeState && ball.knifeBladeState !== "rotating") ball.knifeBladeState = "rotating";
  if (ball.tridentDiveState && ball.tridentDiveState !== "idle") ball.tridentDiveState = "idle";
  if (ball.type === "shield" && ball.shieldState === "held") {
    ball.shieldState = "dropped";
    ball.shieldGuardHits = 0;
    ball.shieldX = ball.x;
    ball.shieldY = ball.y;
    ball.shieldVx = 0;
    ball.shieldVy = 0;
    ball.shieldThrownUntil = 0;
    ball.shieldNextHitAt = 0;
    ball.shieldSpinAngle = 0;
    ball.shieldBonusDamage = 0;
    ball.shieldLaserPierceHits = 0;
  }
};

const isGrabInvulnerable = (ball, currentTime) => {
  if (!ball) return false;
  if (ball.type === "wrecker" && ball.wreckerState === "leaping") return true;
  if (ball.type === "dragon" && ball.dragonState === "dashing") return true;
  if (ball.type === "shield" && ball.shieldBashUntil && currentTime < ball.shieldBashUntil) return true;
  if (ball.type === "hammer" && (ball.hammerState === "charging" || ball.hammerState === "launching")) return true;
  return false;
};

const cancelActiveMovementStates = (ball) => {
  if (!ball) return;
  if (ball.wreckerState === "leaping") {
    ball.wreckerState = "idle";
    ball.wreckerStateUntil = 0;
  }
  if (ball.shieldBashUntil) {
    ball.shieldBashUntil = 0;
  }
  if (ball.hammerState === "launching" || ball.hammerState === "charging") {
    ball.hammerState = "spinning";
    ball.hammerStateUntil = 0;
  }
  if (ball.dragonState === "dashing") {
    ball.dragonState = "idle";
    ball.dragonBreathUntil = 0;
  }
  if (ball.tridentDiveState && ball.tridentDiveState !== "idle") {
    ball.tridentDiveState = "idle";
    ball.tridentDiveHitDone = false;
  }
  if (ball.type === "feralClaw" && ball.feralPounceUntil) {
    ball.feralPounceUntil = 0;
    ball.feralPounceHit = false;
    ball.feralPounceState = "idle";
    ball.feralPounceWindupUntil = 0;
    ball.feralPounceSettleUntil = 0;
  }
  if (ball.armState === "elbow_dropping") {
    ball.armState = "idle";
    ball.armStateUntil = 0;
  }
};

const isBallConnected = (ball, balls = [], currentTime = 0) => {
  if (!ball) return false;
  if (ball.type === "vampire" && ball.latchedTo && ball.latchUntil > currentTime) return true;
  if (ball.type === "spider" && (ball.webState === "pulling" || ball.webState === "webBouncing")) return true;
  if (ball.type === "arm" && ball.armState === "elbow_dropping" && ball.armStateUntil > currentTime) return true;
  if (ball.type === "hammer" && ball.hammerState === "charging") return true;
  if (ball.jokerPulledUntil && ball.jokerPulledUntil > currentTime) return true;
  if (ball.tridentPinnedUntil && ball.tridentPinnedUntil > currentTime) return true;
  if (ball.type === "blackSpider" && ball.bsSkillState && ball.bsSkillState !== "idle") return true;

  return balls.some((other) => {
    if (!other || other.id === ball.id) return false;
    if (other.type === "vampire" && other.latchedTo === ball.id && other.latchUntil > currentTime) return true;
    if (other.type === "spider" && other.webTargetId === ball.id && (other.webState === "pulling" || other.webState === "webBouncing")) return true;
    if (other.type === "arm" && other.armGrabTargetId === ball.id && other.armState === "elbow_dropping" && other.armStateUntil > currentTime) return true;
    if (other.type === "joker" && other.jokerPullTargetId === ball.id && other.jokerPullUntil > currentTime) return true;
    if (other.tridentTargetId === ball.id && (other.tridentState === "thrown" || other.tridentState === "stuck")) return true;
    if (other.type === "blackSpider" && other.bsHookedTargetId === ball.id && (other.bsSkillState === "pulling" || other.bsSkillState === "spinning")) return true;
    return false;
  });
};

const canStartSkillConnection = (actor, target, balls, currentTime) => (
  !isBallConnected(actor, balls, currentTime) && 
  !isBallConnected(target, balls, currentTime) &&
  (!target.attachmentResistanceUntil || target.attachmentResistanceUntil <= currentTime) &&
  !isGrabInvulnerable(target, currentTime)
);

const linePointDist = (px, py, x1, y1, x2, y2) => {
  const A = px - x1, B = py - y1, C = x2 - x1, D = y2 - y1;
  const dot = A * C + B * D, lenSq = C * C + D * D;
  let param = -1;
  if (lenSq !== 0) param = dot / lenSq;
  let xx, yy;
  if (param < 0) { xx = x1; yy = y1; }
  else if (param > 1) { xx = x2; yy = y2; }
  else { xx = x1 + param * C; yy = y1 + param * D; }
  return Math.hypot(px - xx, py - yy);
};

const isLineWrappingCorner = (x1, y1, x2, y2, cx, cy, threshold = 28) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq < 1) return false;
  
  const dot1 = (cx - x1) * dx + (cy - y1) * dy;
  if (dot1 < 0) return false;
  const dot2 = (cx - x2) * (-dx) + (cy - y2) * (-dy);
  if (dot2 < 0) return false;
  
  const dist = linePointDist(cx, cy, x1, y1, x2, y2);
  return dist < threshold;
};

const getStringBounceVelocity = (ball, str, hitX, hitY, speed, seed = 0) => {
  const dx = str.x2 - str.x1;
  const dy = str.y2 - str.y1;
  const len = Math.hypot(dx, dy) || 1;
  const tx = dx / len;
  const ty = dy / len;
  const nx = -ty;
  const ny = tx;
  const side = Math.sign((ball.x - hitX) * nx + (ball.y - hitY) * ny) || Math.sign(ball.vx * nx + ball.vy * ny) || 1;
  const travel = Math.sign(ball.vx * tx + ball.vy * ty) || (Math.sin(seed * 0.017) > 0 ? 1 : -1);
  const wobble = Math.sin(seed * 0.031 + ball.id.length) * 0.16;
  let outX = nx * side * 0.78 + tx * travel * (0.42 + wobble);
  let outY = ny * side * 0.78 + ty * travel * (0.42 + wobble);
  let outLen = Math.hypot(outX, outY) || 1;
  outX /= outLen;
  outY /= outLen;

  if (Math.abs(outX * tx + outY * ty) > 0.82) {
    outX = nx * side * 0.88 + tx * travel * 0.28;
    outY = ny * side * 0.88 + ty * travel * 0.28;
    outLen = Math.hypot(outX, outY) || 1;
    outX /= outLen;
    outY /= outLen;
  }

  return { vx: outX * speed, vy: outY * speed };
};

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const isChessCrownActive = (ball) => ball?.type === "chess" && (
  ball.chessState === "movingToCenter" ||
  ball.chessState === "activeCrown" ||
  ball.chessState === "attacking"
);

const drawStar = (ctx, cx, cy, spikes, outerRadius, innerRadius) => {
  let rot = (Math.PI / 2) * 3;
  let x;
  let y;
  const step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;
    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fillStyle = "#ffffff";
  ctx.fill();
};

export default function App() {
  const { playSound, playAudioFile, getAudioStream, startMatchMusic, stopMatchMusic } = useSoundEngine();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const recordingCanvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordingFrameRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const fightIntroRef = useRef({ active: false, startTime: 0, recordingRequested: false, impactSoundPlayed: false, readySoundPlayed: false, fightSoundPlayed: false });
  const [selectedBalls, setSelectedBalls] = useState(["knife", "laser"]);
  const [gameStarted, setGameStarted] = useState(false);
  const [fightIntroActive, setFightIntroActive] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1.5);
  const [balanceSettings, setBalanceSettings] = useState(loadSavedBalanceSettings);
  const [balanceSaveStatus, setBalanceSaveStatus] = useState("");
  const [recordingStatus, setRecordingStatus] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const [gameState, setGameState] = useState({
    leftHealth: MAX_HEALTH,
    rightHealth: MAX_HEALTH,
    leftName: "Saber Ball",
    rightName: "Laser Ball",
    winner: null,
    running: false,
  });

  const [combatStats, setCombatStats] = useState({
    left: { damageDealt: 0, hitsLanded: 0, totalShots: 0, healed: 0, blocked: 0 },
    right: { damageDealt: 0, hitsLanded: 0, totalShots: 0, healed: 0, blocked: 0 },
  });

  const [tournamentResults, setTournamentResults] = useState(null);
  const [simulatingTournament, setSimulatingTournament] = useState(false);

  const makeBall = (type, side, speedJitter = 0) => {
    const config = BALL_TYPES[type];
    const direction = side === "left" ? 1 : -1;
    const pad = 18;
    const r = config.radius;
    const minY = pad + r + 50;
    const maxY = ARENA_SIZE - pad - r - 50;
    const randomY = minY + Math.random() * (maxY - minY);
    const startX = side === "left" ? pad + r + 15 : ARENA_SIZE - pad - r - 15;
    const vxVal = direction * (180 + Math.random() * 60) * BOUNCE_SPEED_MULTIPLIER;
    const vyVal = (Math.random() - 0.5) * 250 * BOUNCE_SPEED_MULTIPLIER;

    return {
      id: `${side}-${type}`,
      type,
      side,
      name: config.name,
      shortName: config.shortName,
      x: startX,
      y: randomY,
      vx: vxVal,
      vy: vyVal,
      r,
      originalRadius: r,
      mass: type === "wrecker" ? 1.8 : type === "shield" ? 1.5 : 1,
      health: MAX_HEALTH,
      wreckerState: "normal",
      wreckerLeapStart: 0,
      wreckerLeapUntil: 0,
      wreckerNextLeapAllowedUntil: 0,
      wreckerCooldownUntil: 0,
      wreckerTargetX: 0,
      wreckerTargetY: 0,
      wreckerPushCooldownUntil: 0,
      rageStacks: 0,
      consecutiveWallBounces: 0,
      wreckerEnlargedUntil: 0,
      isMegaLeap: false,
      angle: side === "left" ? 0 : Math.PI,
      spinAngle: 0,
      ammo: type === "gun" ? 6 : null,
      maxAmmo: type === "gun" ? 6 : null,
      reloadUntil: 0,
      nextShotAt: 0,
      skillLockedUntil: 0,
      flashUntil: 0,
      dogSummoned: false,
      dog: null,
      dogRespawnAt: 0,
      dogDied: false,
      permanentRapidFire: false,
      rapidFireUntil: 0,
      nextRapidFireAt: 0,
      rapidPierceShotsRemaining: 0,
      latchedTo: null,
      latchUntil: 0,
      nextDrainAt: 0,
      nextLatchAt: 0,
      trail: [],
      nextBombAt: 0,
      laserState: "idle",
      laserStateUntil: 0,
      laserTargetAngle: 0,
      laserNextTickAt: 0,
      laserReflect: null,
      laserShotCount: 0,
      shieldAngle: side === "left" ? 0 : Math.PI,
      shieldState: "held", shieldX: 0, shieldY: 0, shieldVx: 0, shieldVy: 0, shieldThrownUntil: 0, shieldNextHitAt: 0, nextThrowAt: 0, shieldSpinAngle: 0, shieldGuardHits: 0, shieldBonusDamage: 0,
      // Spider Specific
      webState: "idle", webX: 0, webY: 0, webVx: 0, webVy: 0, webStateUntil: 0, webTargetId: null, webBouncesLeft: 0, webLastTargetX: 0, webLastTargetY: 0, fangFlashUntil: 0,
      // Black Spider Specific
      blackSpiderMarkedTargetId: null,
      blackSpiderMarkUntil: 0,
      blackSpiderAnchorState: "idle",
      blackSpiderAnchorWall: null,
      blackSpiderDashUntil: 0,
      blackSpiderDashVx: 0,
      blackSpiderDashVy: 0,
      blackSpiderProjectileX: 0,
      blackSpiderProjectileY: 0,
      blackSpiderProjectileVx: 0,
      blackSpiderProjectileVy: 0,
      blackSpiderSecondaryAnchorX: 0,
      blackSpiderSecondaryAnchorY: 0,
      blackSpiderSecondaryAnchorVx: 0,
      blackSpiderSecondaryAnchorVy: 0,
      attachmentResistanceUntil: 0,
      // Venom Abilities
      venomWallBounces: 0,
      venomLashFlashUntil: 0,
      venomSpeedBoostUntil: 0,
      bsSkillState: "idle",
      bsSlamWallUntil: 0,
      bsSlamWallSourceId: null,
      bsSpinAngle: 0,
      bsSpinUntil: 0,
      bsPullUntil: 0,
      bsStringX: 0,
      bsStringY: 0,
      bsStringVx: 0,
      bsStringVy: 0,
      bsHookedTargetId: null,
      // Gazer Ball Specific
      gazerState: "idle",
      gazerChargeTimer: 0,
      gazerBeamAngle: 0,
      gazerBeamFlashUntil: 0,
      gazerCooldownUntil: 0,
      gazerRecoilUntil: 0,
      gazerFocusStacks: 0,
      gazerLastFiredAt: 0,
      gazerNextFocusAt: 0,
      gazerUltActive: false,
      gazerUltUntil: 0,
      gazerBeamPath: [],
      // Constellation Specific
      constellationStars: [],
      constellationUltActive: false,
      constellationUltUntil: 0,
      constellationShieldedUntil: 0,
      // Vampire Specific
      hasStuck: false,
      // Fire Skull Specific
      fsLastWallX: null,
      fsLastWallY: null,
      fsRoadActive: false,
      fsRoadSegments: [],
      fsRoadStartWallPoint: null,
      fsNextRoadAt: 0,
      // Spore Specific
      nextSporeAt: 0, hydraGlowStacks: 0,
      nextPsychicAt: 0,
      nextChaosAt: 0,
      chaosFlashUntil: 0,
      chaosControlledUntil: 0,
      chaosControlHoldUntil: 0,
      chaosSlamDone: false,
      // Trident Specific
      tridentState: "held", tridentX: 0, tridentY: 0, tridentVx: 0, tridentVy: 0, tridentAngle: side === "left" ? 0 : Math.PI, tridentTargetId: null, tridentStuckUntil: 0,
      tridentDiveState: "idle", tridentDiveX: 0, tridentDiveY: 0, tridentDiveUntil: 0, tridentDiveStartAt: 0, tridentNextDiveAt: 0, tridentDiveAngle: side === "left" ? 0 : Math.PI, tridentDiveHitDone: false,
      // Shadow Specific
      shadowMinions: [], shadowNextSummonAt: 0, shadowNextSlashAt: 0, shadowNextSwitchAt: 0, shadowSlashUntil: 0, shadowSlashAngle: side === "left" ? 0 : Math.PI, shadowCommandUntil: 0, shadowComboSecondAt: 0, shadowComboTargetId: null,
      // Feral Claw Specific
      feralNextSlashAt: 0, feralSlashStartAt: 0, feralSlashUntil: 0, feralSlashHitAt: 0, feralSlashHitDone: false, feralSlashAngle: side === "left" ? 0 : Math.PI, feralSlashSide: 1, feralSlashRecoilUntil: 0,
      feralNextPounceAt: type === "feralClaw" ? 1800 : 0, feralPounceState: "idle", feralPounceStartAt: 0, feralPounceWindupUntil: 0, feralPounceUntil: 0, feralPounceSettleUntil: 0, feralPounceAngle: side === "left" ? 0 : Math.PI, feralPounceHit: false, feralRushTrail: [], feralLastTrailAt: 0,
      feralUltimateTriggered: false, feralUltimateUntil: 0,
      feralNextRegenAt: 0, feralRegenFlashUntil: 0, lastDamageTakenAt: 0,
      // Mirror Specific
      mirrorNextHitAt: 0, mirrorFlashUntil: 0, mirrorNextSwitchAt: type === "mirror" ? (balanceSettings.mirror?.switchCooldown ?? BALANCE.mirror.switchCooldown) : 0, mirrorSwitchFlashUntil: 0,

      // Joker Specific
      jokerNextThreadAt: type === "joker" ? (balanceSettings.joker?.cooldown ?? BALANCE.joker.cooldown) : 0, jokerFlashUntil: 0,
      // Hammer Specific
      hammerState: "spinning", hammerAngle: 0, hammerStateUntil: 0, hammerNextHitAt: 0, hammerLaunchAngle: 0,
      // Arm Specific
      armState: "idle", armStateUntil: 0, armAngle: 0, armBaseAngle: 0, armDirection: 1, armThrowWallUntil: 0, armThrowWallSourceId: null, armGrabDamageHits: 0,
      armDropStartAt: 0, armDropStartX: 0, armDropStartY: 0, armDropTargetX: 0, armDropTargetY: 0,
      armNextPunchAt: 0,
      armPunchUntil: 0,
      // Chess Specific
      chessState: "idle",
      chessCrown: null,
      chessTimer: 0,
      chessScale: 1.0,
      chessAttackWaypoints: [],
      chessWaypointIndex: 0,
      // Secondary Skills State
      nextSecondaryAt: 0,
      knifeBladeState: "rotating",
      knifeBladeX: 0,
      knifeBladeY: 0,
      knifeBladeVx: 0,
      knifeBladeVy: 0,
      knifeBladeTargetX: 0,
      knifeBladeTargetY: 0,
      knifeBladeHoverUntil: 0,
      knifeBladeAngle: 0,
      shieldBashUntil: 0,
      elbowDropUntil: 0,
      laserSweepState: "idle",
      laserSweepStateUntil: 0,
      laserSweepAngle: 0,
      laserSweepStartAngle: 0,
      laserSweepEndAngle: 0,
      laserSweepHitDone: false,
    };
  };

  const gameRef = useRef({
    width: ARENA_SIZE,
    height: ARENA_SIZE,
    lastTime: 0,
    simTime: 0,
    damageCooldowns: {},
    bullets: [],
    bombs: [],
    mines: [],
    explosions: [],
    particles: [],
    floatingTexts: [],
    wallSpikes: [],
    strings: [],
    cacti: [],
    psychicCircles: [],
    chaosCircles: [],
    jokerThreads: [],
    venomPools: [],
    webStrands: [],
    fireCars: [],
    screenShake: 0,
    deathEffectStarted: false,
    deathSlowMoUntil: 0,
    combatStarted: false,
    simulationSpeed: 1.5,
    balance: balanceSettings,
    balls: [makeBall("knife", "left", 20), makeBall("laser", "right", 20)],
    stats: {
      left: { damageDealt: 0, hitsLanded: 0, totalShots: 0, healed: 0, blocked: 0 },
      right: { damageDealt: 0, hitsLanded: 0, totalShots: 0, healed: 0, blocked: 0 }
    }
  });

  const selectBall = (slot, type) => {
    fightIntroRef.current = { active: false, startTime: 0, recordingRequested: false, impactSoundPlayed: false, readySoundPlayed: false, fightSoundPlayed: false };
    setFightIntroActive(false);
    stopMatchMusic();
    setSelectedBalls((prev) => {
      const next = [...prev];
      next[slot] = type;
      return next;
    });
    setGameStarted(false);
    setGameState((prev) => ({ ...prev, winner: null, running: false }));
    setElapsedTime(0);
    const nextLeft = slot === 0 ? type : selectedBalls[0];
    const nextRight = slot === 1 ? type : selectedBalls[1];
    const balls = [makeBall(nextLeft, "left", 20), makeBall(nextRight, "right", 20)];
    gameRef.current.balls = balls;
    gameRef.current.bullets = [];
    gameRef.current.bombs = [];
    gameRef.current.mines = [];
    gameRef.current.explosions = [];
    gameRef.current.particles = [];
    gameRef.current.floatingTexts = [];
    gameRef.current.wallSpikes = [];
    gameRef.current.strings = [];
    gameRef.current.cacti = [];
    gameRef.current.psychicCircles = [];
    gameRef.current.chaosCircles = [];
    gameRef.current.jokerThreads = [];
    gameRef.current.venomPools = [];
    gameRef.current.deathEffectStarted = false;
    gameRef.current.deathSlowMoUntil = 0;
    gameRef.current.combatStarted = false;
    gameRef.current.portals = [];
    gameRef.current.portalProjectiles = [];
  };

  const initializeFightState = () => {
    const balls = [
      makeBall(selectedBalls[0], "left", 20),
      makeBall(selectedBalls[1], "right", 20),
    ];
    gameRef.current = {
      ...gameRef.current,
      lastTime: 0,
      simTime: 0,
      damageCooldowns: {},
      bullets: [],
      bombs: [],
      mines: [],
      explosions: [],
      particles: [],
      floatingTexts: [],
      wallSpikes: [],
      strings: [],
      cacti: [],
      psychicCircles: [],
      chaosCircles: [],
      jokerThreads: [],
      venomPools: [],
      webStrands: [],
      fireCars: [],
      screenShake: 0,
      deathEffectStarted: false,
      deathSlowMoUntil: 0,
      combatStarted: false,
      simulationSpeed,
      balls,
      balance: { ...BALANCE, ...balanceSettings },
      roundOverSoundPlayed: false,
      stats: {
        left: { damageDealt: 0, hitsLanded: 0, totalShots: 0, healed: 0, blocked: 0 },
        right: { damageDealt: 0, hitsLanded: 0, totalShots: 0, healed: 0, blocked: 0 }
      }
    };
    setCombatStats({
      left: { damageDealt: 0, hitsLanded: 0, totalShots: 0, healed: 0, blocked: 0 },
      right: { damageDealt: 0, hitsLanded: 0, totalShots: 0, healed: 0, blocked: 0 }
    });
    return balls;
  };

  const beginCombatFromIntro = () => {
    if (!fightIntroRef.current.active) return;
    const left = gameRef.current.balls[0];
    const right = gameRef.current.balls[1];
    if (left && right) {
      const centerY = gameRef.current.height / 2;
      const intro = fightIntroRef.current;
      const seed = (left.type.length * 17 + right.type.length * 31) % 100;
      const leftVertical = intro.leftRecoilY || (seed % 2 === 0 ? -1 : 1);
      const rightVertical = intro.rightRecoilY || -leftVertical;
      const leftAngle = Math.PI + leftVertical * (0.42 + (seed % 7) * 0.018);
      const rightAngle = rightVertical * (0.38 + (seed % 5) * 0.022);
      const speed = 520;
      left.vx = Math.cos(leftAngle) * speed;
      left.vy = Math.sin(leftAngle) * speed;
      right.vx = Math.cos(rightAngle) * speed;
      right.vy = Math.sin(rightAngle) * speed;
      left.y = clamp(left.y || centerY, left.r + 18, gameRef.current.height - left.r - 18);
      right.y = clamp(right.y || centerY, right.r + 18, gameRef.current.height - right.r - 18);
    }
    gameRef.current.combatStarted = true;
    fightIntroRef.current = { active: false, startTime: 0, recordingRequested: false, impactSoundPlayed: false, readySoundPlayed: false, fightSoundPlayed: false };
    setFightIntroActive(false);
    gameRef.current.lastTime = 0;
    gameRef.current.simTime = 0;
    setElapsedTime(0);
    setGameStarted(true);
    setGameState((prev) => ({ ...prev, winner: null, running: true }));
    startMatchMusic();
    playSound("gunReload");
  };

  const startFight = ({ record = false } = {}) => {
    const balls = initializeFightState();
    setGameStarted(false);
    setGameState({
      leftHealth: MAX_HEALTH,
      rightHealth: MAX_HEALTH,
      leftName: balls[0].name,
      rightName: balls[1].name,
      winner: null,
      running: false,
    });
    setElapsedTime(0);
    fightIntroRef.current = {
      active: true,
      startTime: performance.now(),
      recordingRequested: record,
      impactSoundPlayed: false,
      readySoundPlayed: false,
      fightSoundPlayed: false
    };
    setFightIntroActive(true);
    playAudioFile("/Balls%20Ready.%20Fight!.mp3", 1.05, 0.02);
    playSound("shieldCatch", 0.75, 80);
    if (record && !isRecording) requestAnimationFrame(() => startFightRecording());
  };

  const skipFightIntro = () => beginCombatFromIntro();

  const resetToSelection = () => {
    fightIntroRef.current = { active: false, startTime: 0, recordingRequested: false, impactSoundPlayed: false, readySoundPlayed: false, fightSoundPlayed: false };
    setFightIntroActive(false);
    stopMatchMusic();
    setGameStarted(false);
    setGameState((prev) => ({ ...prev, winner: null, running: false }));
    setElapsedTime(0);
    const balls = [makeBall(selectedBalls[0], "left", 20), makeBall(selectedBalls[1], "right", 20)];
    gameRef.current.balls = balls;
    gameRef.current.bullets = [];
    gameRef.current.bombs = [];
    gameRef.current.mines = [];
    gameRef.current.explosions = [];
    gameRef.current.particles = [];
    gameRef.current.floatingTexts = [];
    gameRef.current.wallSpikes = [];
    gameRef.current.strings = [];
    gameRef.current.cacti = [];
    gameRef.current.psychicCircles = [];
    gameRef.current.chaosCircles = [];
    gameRef.current.jokerThreads = [];
    gameRef.current.venomPools = [];
    gameRef.current.deathEffectStarted = false;
    gameRef.current.deathSlowMoUntil = 0;
    gameRef.current.combatStarted = false;
  };

  const resetFight = () => {
    stopMatchMusic();
    startFight();
  };

  const updateBalanceSetting = (type, key, val) => {
    setBalanceSettings((prev) => {
      const next = { ...prev, [type]: { ...prev[type], [key]: val } };
      gameRef.current.balance = next;
      return next;
    });
    setBalanceSaveStatus("");
  };

  const saveBalanceSettings = () => {
    const next = mergeBalanceSettings(BALANCE, balanceSettings);
    setBalanceSettings(next);
    gameRef.current.balance = next;
    try {
      window.localStorage.setItem(BALANCE_STORAGE_KEY, JSON.stringify(next));
      setBalanceSaveStatus("Saved");
    } catch {
      setBalanceSaveStatus("Save failed");
    }
  };

  const downloadBalanceSheet = () => {
    const next = mergeBalanceSettings(BALANCE, balanceSettings);
    setBalanceSettings(next);
    gameRef.current.balance = next;

    const csvEscape = (value) => {
      const text = String(value ?? "");
      return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
    };
    const rows = [["ball", "setting", "current_value", "code_default", "changed"]];
    Object.entries(next).forEach(([type, settings]) => {
      Object.entries(settings).forEach(([key, value]) => {
        const defaultValue = BALANCE[type]?.[key] ?? "";
        rows.push([type, key, value, defaultValue, value !== defaultValue ? "yes" : "no"]);
      });
    });

    const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n");
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ball-fighters-balance-${stamp}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setBalanceSaveStatus("Downloaded sheet");
  };

  const drawRoundedRect = (ctx, x, y, w, h, r) => {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  const drawRecordingHudCard = (ctx, ball, x, y, w, align = "left") => {
    const config = BALL_TYPES[ball?.type] || BALL_TYPES.knife;
    const hp = clamp(Math.ceil(ball?.health ?? 0), 0, MAX_HEALTH);
    const barW = w - 44;
    const barH = 18;
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.28)";
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 8;
    ctx.fillStyle = "rgba(31, 41, 55, 0.96)";
    drawRoundedRect(ctx, x, y, w, 108, 22);
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(148, 163, 184, 0.22)";
    ctx.stroke();

    ctx.textAlign = align;
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#f8fafc";
    ctx.font = "800 34px Arial, sans-serif";
    const nameX = align === "left" ? x + 22 : x + w - 22;
    ctx.fillText(ball?.name || config.name, nameX, y + 42);

    ctx.font = "800 24px Arial, sans-serif";
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText(`${hp} HP`, nameX, y + 76);

    const barX = x + 22;
    const barY = y + 82;
    ctx.fillStyle = "#0f172a";
    drawRoundedRect(ctx, barX, barY, barW, barH, 9);
    ctx.fill();
    ctx.fillStyle = getHpBarColor(ball?.type);
    drawRoundedRect(ctx, barX, barY, barW * (hp / MAX_HEALTH), barH, 9);
    ctx.fill();
    ctx.restore();
  };

  const drawRecordingFrame = () => {
    const sourceCanvas = canvasRef.current;
    const recordCanvas = recordingCanvasRef.current;
    if (!sourceCanvas || !recordCanvas) return;

    const ctx = recordCanvas.getContext("2d", { alpha: false });
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    const left = gameRef.current.balls?.find((ball) => ball.side === "left");
    const right = gameRef.current.balls?.find((ball) => ball.side === "right");
    const width = 1080;
    const height = 1920;
    const arenaSize = 980;
    const arenaX = (width - arenaSize) / 2;
    const arenaY = 520;
    const hudY = arenaY - 154;
    const cardW = 490;

    ctx.clearRect(0, 0, width, height);
    const bg = ctx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, "#1f2937");
    bg.addColorStop(0.48, "#111827");
    bg.addColorStop(1, "#374151");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    drawRecordingHudCard(ctx, left, arenaX, hudY, cardW, "left");
    drawRecordingHudCard(ctx, right, arenaX + arenaSize - cardW, hudY, cardW, "right");

    ctx.save();
    ctx.shadowColor = "rgba(15, 23, 42, 0.32)";
    ctx.shadowBlur = 28;
    ctx.shadowOffsetY = 16;
    ctx.fillStyle = "#020617";
    drawRoundedRect(ctx, arenaX - 8, arenaY - 8, arenaSize + 16, arenaSize + 16, 26);
    ctx.fill();
    ctx.restore();

    ctx.drawImage(sourceCanvas, arenaX, arenaY, arenaSize, arenaSize);

    ctx.save();
    ctx.lineWidth = 8;
    ctx.strokeStyle = "#020617";
    drawRoundedRect(ctx, arenaX, arenaY, arenaSize, arenaSize, 18);
    ctx.stroke();
    ctx.restore();

    const winner = left?.health <= 0 && right?.health > 0
      ? right.name
      : right?.health <= 0 && left?.health > 0
        ? left.name
        : null;
    if (winner) {
      ctx.save();
      ctx.textAlign = "center";
      ctx.fillStyle = "#f8fafc";
      ctx.font = "900 58px Arial, sans-serif";
      ctx.fillText(`${winner} Wins!`, width / 2, arenaY + arenaSize + 96);
      ctx.restore();
    }
  };

  const stopFightRecording = () => {
    if (recordingFrameRef.current) {
      cancelAnimationFrame(recordingFrameRef.current);
      recordingFrameRef.current = null;
    }
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }
  };

  const startFightRecording = () => {
    const sourceCanvas = canvasRef.current;
    if (!sourceCanvas || typeof MediaRecorder === "undefined") {
      setRecordingStatus("Recording unsupported");
      return;
    }

    const recordCanvas = document.createElement("canvas");
    recordCanvas.width = 1080;
    recordCanvas.height = 1920;
    recordingCanvasRef.current = recordCanvas;
    recordedChunksRef.current = [];
    drawRecordingFrame();

    const stream = recordCanvas.captureStream(60);
    const audioStream = getAudioStream?.();
    audioStream?.getAudioTracks?.().forEach((track) => stream.addTrack(track));
    const mimeType = [
      "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
      "video/mp4;codecs=h264,aac",
      "video/mp4",
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm;codecs=vp9",
      "video/webm;codecs=vp8",
      "video/webm"
    ].find((type) => MediaRecorder.isTypeSupported(type)) || "video/webm";
    const recordingExtension = mimeType.startsWith("video/mp4") ? "mp4" : "webm";
    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 24000000,
      audioBitsPerSecond: 192000
    });

    recorder.ondataavailable = (event) => {
      if (event.data?.size) recordedChunksRef.current.push(event.data);
    };
    recorder.onstop = () => {
      if (recordingFrameRef.current) {
        cancelAnimationFrame(recordingFrameRef.current);
        recordingFrameRef.current = null;
      }
      const blob = new Blob(recordedChunksRef.current, { type: mimeType });
      const url = URL.createObjectURL(blob);
      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      const link = document.createElement("a");
      link.href = url;
      link.download = `ball-fighters-recording-${stamp}.${recordingExtension}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setIsRecording(false);
      setRecordingStatus(`Downloaded 1080x1920 ${recordingExtension.toUpperCase()} with audio`);
      mediaRecorderRef.current = null;
      recordingCanvasRef.current = null;
      recordedChunksRef.current = [];
    };

    const renderRecording = () => {
      drawRecordingFrame();
      recordingFrameRef.current = requestAnimationFrame(renderRecording);
    };

    mediaRecorderRef.current = recorder;
    recorder.start(250);
    setIsRecording(true);
    setRecordingStatus(`Recording HD ${recordingExtension.toUpperCase()} 1080x1920 60fps`);
    renderRecording();
  };

  const toggleFightRecording = () => {
    if (isRecording) stopFightRecording();
    else startFightRecording();
  };

  const launchAndRecordFight = () => {
    if (isRecording) {
      stopFightRecording();
      return;
    }
    startFight({ record: true });
  };

  useEffect(() => {
    return () => {
      stopMatchMusic();
      if (recordingFrameRef.current) cancelAnimationFrame(recordingFrameRef.current);
      const recorder = mediaRecorderRef.current;
      if (recorder && recorder.state !== "inactive") recorder.stop();
    };
  }, [stopMatchMusic]);

  const runTournament = (roundsCount) => {
    setSimulatingTournament(true);
    setTimeout(() => {
      const balance = { ...BALANCE, ...gameRef.current.balance };
      let leftWins = 0, rightWins = 0, totalDuration = 0;
      let leftRemainingHpTotal = 0, rightRemainingHpTotal = 0;
      const leftType = selectedBalls[0], rightType = selectedBalls[1];

      for (let r = 0; r < roundsCount; r++) {
        const leftBall = makeBall(leftType, "left", 20);
        const rightBall = makeBall(rightType, "right", 20);
        const balls = [leftBall, rightBall];
        let localBullets = [], localBombs = [], localMines = [], localCacti = [], localWallSpikes = [], localStrings = [], localPortalProjectiles = [], localPortals = [], localVenomPools = [];
        let damageCooldowns = {};
        let simTime = 0, dt = 0.016, maxTicks = 10000;

        while (leftBall.health > 0 && rightBall.health > 0 && maxTicks > 0) {
          maxTicks--;
          simTime += dt * 1000;

          balls.forEach((ball) => {
            const isPulling = ball.type === "spider" && ball.webState === "pulling";
            const isChargingHammer = ball.type === "hammer" && ball.hammerState === "charging";
            const isBlackSpiderDashing = false;
            const isBlackSpiderPullingSelf = false;
            const isBlackSpiderPulled = balls.some(b => b.type === "blackSpider" && b.bsHookedTargetId === ball.id && (b.bsSkillState === "pulling" || b.bsSkillState === "spinning"));
            
            const isLatchedTarget = balls.some(b => b.type === "vampire" && b.latchedTo === ball.id && b.latchUntil > simTime);
            const isLatchedSelf = ball.type === "vampire" && ball.latchedTo && ball.latchUntil > simTime;
            const isArmGrabbed = balls.some(b => b.type === "arm" && b.armGrabTargetId === ball.id && b.armState === "elbow_dropping" && b.armStateUntil > simTime);
            let slowMult = (isLatchedTarget || isLatchedSelf) ? 0.4 : 1.0;
            const insideWeb = localVenomPools.some((pool) => {
              if (ball.side === pool.ownerSide) return false;
              const dist = Math.hypot(ball.x - pool.x, ball.y - pool.y);
              return dist < ball.r + pool.r;
            });
            if (insideWeb) slowMult *= 0.5;
            
            const isBlackSpiderMarked = balls.some(b => b.type === "blackSpider" && b.blackSpiderMarkedTargetId === ball.id && b.blackSpiderMarkUntil > simTime);
            if (isBlackSpiderMarked) slowMult *= 0.85;

            if (ball.dragonScorchedUntil && simTime < ball.dragonScorchedUntil) slowMult *= 0.75;
            if (ball.shadowSlowedUntil && simTime < ball.shadowSlowedUntil) slowMult *= 0.6;
            if (ball.paralyzedUntil && simTime < ball.paralyzedUntil) slowMult = 0;
            if (ball.type === "dragon" && ball.dragonState === "dashing") slowMult = 1.0;

            if (isChessCrownActive(ball) || (!isPulling && !isLatchedSelf && !isChargingHammer && !isArmGrabbed && !isBlackSpiderDashing && !isBlackSpiderPullingSelf && !isBlackSpiderPulled)) {
              ball.x += ball.vx * dt * slowMult;
              ball.y += ball.vy * dt * slowMult;
              
              const isWreckerLeaping = ball.type === "wrecker" && ball.wreckerState === "leaping";
              if (!isWreckerLeaping) {
                const pad = 18;
                let bounced = false, bx = ball.x, by = ball.y, sideHit = null;
                if (ball.x - ball.r < pad) { ball.x = pad + ball.r; ball.vx = Math.abs(ball.vx); bounced = true; bx = pad; sideHit = "left"; }
                if (ball.x + ball.r > ARENA_SIZE - pad) { ball.x = ARENA_SIZE - pad - ball.r; ball.vx = -Math.abs(ball.vx); bounced = true; bx = ARENA_SIZE - pad; sideHit = "right"; }
                if (ball.y - ball.r < pad) { ball.y = pad + ball.r; ball.vy = Math.abs(ball.vy); bounced = true; by = pad; sideHit = "top"; }
                if (ball.y + ball.r > ARENA_SIZE - pad) { ball.y = ARENA_SIZE - pad - ball.r; ball.vy = -Math.abs(ball.vy); bounced = true; by = ARENA_SIZE - pad; sideHit = "bottom"; }
                
                if (bounced) {
                  if (ball.type === "wrecker") {
                    ball.consecutiveWallBounces = (ball.consecutiveWallBounces || 0) + 1;
                    ball.rageStacks = (ball.rageStacks || 0) + 1;
                    const boost = balance.wrecker.bounceBoost || 1.14;
                    const maxBounceSpeed = balance.wrecker.maxBounceSpeed || 330;
                    const speed = Math.hypot(ball.vx, ball.vy);
                    if (speed > 0) {
                      const nextSpeed = Math.min(maxBounceSpeed, Math.max(230, speed * boost));
                      ball.vx = (ball.vx / speed) * nextSpeed;
                      ball.vy = (ball.vy / speed) * nextSpeed;
                    }
                  }
                }
                
                if (bounced && simTime >= OPENING_SKILL_DELAY) {
                if (ball.type === "stringWeb") {
                    if (ball.lastBounceX !== undefined && ball.lastBounceX !== null) {
                      const newString = {
                        x1: ball.lastBounceX, y1: ball.lastBounceY, x2: bx, y2: by, ownerSide: ball.side, createdTime: simTime,
                        life: balance.stringWeb.stringLifetime
                      };
                      localStrings.push(newString);
                      const maxStrings = balance.stringWeb.maxStrings || 10;
                      const ownerStrings = localStrings.filter((str) => str.ownerSide === ball.side);
                      if (ownerStrings.length > maxStrings) {
                        const oldest = ownerStrings.sort((a, b) => a.createdTime - b.createdTime)[0];
                        localStrings = localStrings.filter((str) => str !== oldest);
                      }
                    }
                    ball.lastBounceX = bx;
                    ball.lastBounceY = by;
                  }
                }
              }
            }

            if ((ball.type === "wrecker" && (ball.wreckerState === "leaping" || ball.wreckerState === "cooldown")) ||
                (ball.type === "feralClaw" && simTime < (ball.feralPounceUntil || 0))) {
              // bypass base speed limits
            } else {
              const isWrecker = ball.type === "wrecker";
              const baseSpeed = isWrecker ? 245 : 220;
              const maxSpeed = isWrecker ? (balance.wrecker.maxBounceSpeed || 340) : baseSpeed;
              const currentSpeed = Math.hypot(ball.vx, ball.vy);
              if (currentSpeed > maxSpeed) {
                const newSpeed = maxSpeed + (currentSpeed - maxSpeed) * 0.9;
                ball.vx = (ball.vx / currentSpeed) * newSpeed;
                ball.vy = (ball.vy / currentSpeed) * newSpeed;
              } else if (currentSpeed < baseSpeed * 0.7 && currentSpeed > 10) {
                const newSpeed = baseSpeed * 0.7 + (currentSpeed - baseSpeed * 0.7) * 0.98;
                ball.vx = (ball.vx / currentSpeed) * newSpeed;
                ball.vy = (ball.vy / currentSpeed) * newSpeed;
              }
            }
          });

          const dx = rightBall.x - leftBall.x, dy = rightBall.y - leftBall.y;
          const dist = Math.hypot(dx, dy), minDist = leftBall.r + rightBall.r;
          let collided = false;

          if (dist > 0 && dist < minDist) {
            collided = true;
            if (leftBall.type !== "vampire" && rightBall.type !== "vampire") {
              const nx = dx / dist, ny = dy / dist, overlap = minDist - dist;
              const aAnchored = leftBall.type === "chess" && (leftBall.chessState === "activeCrown" || leftBall.chessState === "movingToCenter" || leftBall.chessState === "attacking");
              const bAnchored = rightBall.type === "chess" && (rightBall.chessState === "activeCrown" || rightBall.chessState === "movingToCenter" || rightBall.chessState === "attacking");
              
              if (aAnchored) {
                rightBall.x += overlap * nx; rightBall.y += overlap * ny;
              } else if (bAnchored) {
                leftBall.x -= overlap * nx; leftBall.y -= overlap * ny;
              } else {
                leftBall.x -= (overlap / 2) * nx; leftBall.y -= (overlap / 2) * ny;
                rightBall.x += (overlap / 2) * nx; rightBall.y += (overlap / 2) * ny;
              }

              const tx = -ny, ty = nx;
              const dpTanA = leftBall.vx * tx + leftBall.vy * ty;
              const dpTanB = rightBall.vx * tx + rightBall.vy * ty;
              const dpNormA = leftBall.vx * nx + leftBall.vy * ny;
              const dpNormB = rightBall.vx * nx + rightBall.vy * ny;

              if (aAnchored) {
                rightBall.vx = tx * dpTanB - nx * dpNormB;
                rightBall.vy = ty * dpTanB - ny * dpNormB;
              } else if (bAnchored) {
                leftBall.vx = tx * dpTanA - nx * dpNormA;
                leftBall.vy = ty * dpTanA - ny * dpNormA;
              } else {
                const mA = (dpNormA * (leftBall.mass - rightBall.mass) + 2 * rightBall.mass * dpNormB) / (leftBall.mass + rightBall.mass);
                const mB = (dpNormB * (rightBall.mass - leftBall.mass) + 2 * leftBall.mass * dpNormA) / (leftBall.mass + rightBall.mass);
                leftBall.vx = tx * dpTanA + nx * mA; leftBall.vy = ty * dpTanA + ny * mA;
                rightBall.vx = tx * dpTanB + nx * mB; rightBall.vy = ty * dpTanB + ny * mB;
              }
            }
          }

            const localApplyDamage = (defender, amount, cooldownKey, cd = 360) => {
              if (isChessCrownActive(defender) && !cooldownKey.includes("chess-attack")) return;
              if (isWreckerJumpInvulnerable(defender)) return;
              if (damageCooldowns[cooldownKey] > simTime) return;
              let finalAmount = Math.max(MIN_DAMAGE, Math.round(amount));
              defender.health = Math.max(0, defender.health - finalAmount);
              defender.lastDamageTakenAt = simTime;
              damageCooldowns[cooldownKey] = simTime + cd;
            };

          if (collided && simTime >= OPENING_SKILL_DELAY) {
            if (leftBall.type === "spore" && leftBall.hydraGlowStacks > 0) {
              localApplyDamage(rightBall, leftBall.hydraGlowStacks * balance.spore.cactusDamage, `${leftBall.id}-hydra-glow-hit`, 250);
              leftBall.hydraGlowStacks = 0;
            }
            if (rightBall.type === "spore" && rightBall.hydraGlowStacks > 0) {
              localApplyDamage(leftBall, rightBall.hydraGlowStacks * balance.spore.cactusDamage, `${rightBall.id}-hydra-glow-hit`, 250);
              rightBall.hydraGlowStacks = 0;
            }
            
            [leftBall, rightBall].forEach((b, idx) => {
              if (b.type === "shield" && b.shieldState === "held") {
                const enemy = idx === 0 ? rightBall : leftBall;
                const angle = Math.atan2(enemy.y - b.y, enemy.x - b.x);
                let diff = Math.abs(angle - b.shieldAngle);
                while (diff > Math.PI) diff = Math.abs(diff - Math.PI * 2);
                if (diff < balance.shield.arcWidth / 2) {
                  if (!hasStringBounceGuard(enemy)) {
                    enemy.vx += Math.cos(angle) * balance.shield.knockback * 15;
                    enemy.vy += Math.sin(angle) * balance.shield.knockback * 15;
                  }
                  b.shieldGuardHits = (b.shieldGuardHits || 0) + 1;
                  if (b.shieldGuardHits >= SHIELD_GUARD_HITS) {
                    b.shieldGuardHits = 0;
                    b.shieldState = "dropped";
                    b.shieldX = b.x + Math.cos(angle) * (b.r + 8);
                    b.shieldY = b.y + Math.sin(angle) * (b.r + 8);
                    b.shieldVx = 0;
                    b.shieldVy = 0;
                    b.shieldThrownUntil = 0;
                    b.shieldNextHitAt = 0;
                    b.shieldSpinAngle = 0;
                    b.nextThrowAt = simTime + balance.shield.cooldown;
                  }
                }
              }
            });
          }

          balls.forEach((ball, idx) => {
            const enemy = idx === 0 ? rightBall : leftBall;
            if (ball.paralyzedUntil && simTime < ball.paralyzedUntil) return;
            const isGrabbedByArm = balls.some(b => b.type === "arm" && b.armGrabTargetId === ball.id && b.armState === "elbow_dropping" && b.armStateUntil > simTime);
            if (isGrabbedByArm) return;
            const isBlackSpiderPulled = balls.some(b => b.type === "blackSpider" && b.bsHookedTargetId === ball.id && (b.bsSkillState === "pulling" || b.bsSkillState === "spinning"));
            if (isBlackSpiderPulled) return;
            if (simTime >= OPENING_SKILL_DELAY) {
              if (ball.type === "knife") {
                const bal = balance.knife;
                if (!ball.knifeBladeState) ball.knifeBladeState = "rotating";
                
                if (ball.knifeBladeState === "rotating") {
                  const dist = Math.hypot(enemy.x - ball.x, enemy.y - ball.y);
                  const maxSlashRange = ball.r + bal.bladeLength + 22;
                  const targetAngle = Math.atan2(enemy.y - ball.y, enemy.x - ball.x);
                  
                  if (ball.saberSlashActive === undefined) {
                    ball.saberSlashActive = false;
                  }

                  if (dist < maxSlashRange && !ball.saberSlashActive && simTime >= (ball.nextSlashAt || 0)) {
                    ball.saberSlashActive = true;
                    ball.saberSlashStart = simTime;
                    ball.saberSlashDuration = 160;
                    ball.saberSlashDir = Math.random() < 0.5 ? 1 : -1;
                    ball.saberSlashBase = targetAngle;
                    ball.nextSlashAt = simTime + (bal.cooldown || 390);
                    playSound("laserFire", 0.48, 195);
                  }

                  if (ball.saberSlashActive) {
                    const p = (simTime - ball.saberSlashStart) / ball.saberSlashDuration;
                    if (p >= 1) {
                      ball.saberSlashActive = false;
                      const breath = Math.sin(simTime * 0.006) * 0.12;
                      ball.spinAngle = targetAngle + breath;
                    } else {
                      ball.spinAngle = ball.saberSlashBase + ball.saberSlashDir * (-1.35 + p * 2.7);
                      const bladeEndX = ball.x + Math.cos(ball.spinAngle) * (ball.r + bal.bladeLength);
                      const bladeEndY = ball.y + Math.sin(ball.spinAngle) * (ball.r + bal.bladeLength);
                      const distToBlade = linePointDist(enemy.x, enemy.y, ball.x, ball.y, bladeEndX, bladeEndY);
                      if (distToBlade < enemy.r + 14) {
                        localApplyDamage(enemy, bal.damage, `${ball.id}-saber-slash-hit-${ball.saberSlashStart}`, 150);
                      }
                    }
                  } else {
                    const breath = Math.sin(simTime * 0.006) * 0.12;
                    ball.spinAngle = targetAngle + breath;
                  }

                  if (dist >= 120 && dist <= 240 && simTime >= (ball.nextSecondaryAt || 0) && !ball.saberSlashActive) {
                    ball.knifeBladeState = "thrown";
                    ball.knifeBladeX = ball.x;
                    ball.knifeBladeY = ball.y;
                    const angle = Math.atan2(enemy.y - ball.y, enemy.x - ball.x);
                    ball.knifeBladeTargetX = enemy.x;
                    ball.knifeBladeTargetY = enemy.y;
                    ball.knifeBladeVx = Math.cos(angle) * 500;
                    ball.knifeBladeVy = Math.sin(angle) * 500;
                    ball.knifeBladeAngle = angle;
                    ball.nextSecondaryAt = simTime + bal.secCooldown;
                    playSound("webShoot", 0.7, 140);
                  }
                } else {
                  if (ball.knifeBladeState === "thrown") {
                    ball.knifeBladeX += ball.knifeBladeVx * dt;
                    ball.knifeBladeY += ball.knifeBladeVy * dt;
                    const dToTar = Math.hypot(ball.knifeBladeTargetX - ball.knifeBladeX, ball.knifeBladeTargetY - ball.knifeBladeY);
                    if (dToTar < 15) {
                      ball.knifeBladeState = "hovering";
                      ball.knifeBladeHoverUntil = simTime + 300;
                    }
                  } else if (ball.knifeBladeState === "hovering") {
                    if (simTime >= ball.knifeBladeHoverUntil) {
                      ball.knifeBladeState = "returning";
                    }
                  } else if (ball.knifeBladeState === "returning") {
                    const returnAngle = Math.atan2(ball.y - ball.knifeBladeY, ball.x - ball.knifeBladeX);
                    ball.knifeBladeVx = Math.cos(returnAngle) * 550;
                    ball.knifeBladeVy = Math.sin(returnAngle) * 550;
                    ball.knifeBladeAngle = returnAngle;
                    ball.knifeBladeX += ball.knifeBladeVx * dt;
                    ball.knifeBladeY += ball.knifeBladeVy * dt;
                    if (Math.hypot(ball.x - ball.knifeBladeX, ball.y - ball.knifeBladeY) < ball.r + 10) {
                      ball.knifeBladeState = "rotating";
                    }
                  }
                  
                  if (Math.hypot(ball.knifeBladeX - enemy.x, ball.knifeBladeY - enemy.y) < enemy.r + 16) {
                    localApplyDamage(enemy, bal.secDamage, `${ball.id}-knife-sec`, 300);
                  }
                }
              }
              if (ball.type === "feralClaw") {
                const bal = balance.feralClaw;
                const targetAngle = Math.atan2(enemy.y - ball.y, enemy.x - ball.x);
                const targetDist = Math.hypot(enemy.x - ball.x, enemy.y - ball.y);
                const lowHealth = ball.health <= bal.lowHealthThreshold;
                if (!ball.feralUltimateTriggered && ball.health <= bal.ultimateThreshold) {
                  ball.feralUltimateTriggered = true;
                  ball.feralUltimateUntil = simTime + bal.ultimateDuration;
                  ball.feralNextSlashAt = simTime;
                  ball.feralNextPounceAt = simTime + 180;
                }
                const ultimateActive = simTime < (ball.feralUltimateUntil || 0);
                const cooldownMult = (lowHealth ? bal.lowHealthCooldownMult : 1) * (ultimateActive ? bal.ultimateCooldownMult : 1);
                const regenMult = lowHealth ? bal.lowHealthRegenMult : 1;
                const damageMult = ultimateActive ? bal.ultimateDamageMult : 1;
                const speedMult = ultimateActive ? bal.ultimateSpeedMult : 1;

                if (ball.health < MAX_HEALTH && simTime - (ball.lastDamageTakenAt || 0) >= bal.regenDelay && simTime >= (ball.feralNextRegenAt || 0)) {
                  ball.health = Math.min(MAX_HEALTH, ball.health + bal.regenAmount);
                  ball.feralNextRegenAt = simTime + bal.regenInterval * regenMult;
                }

                if (simTime < (ball.feralPounceUntil || 0)) {
                  ball.vx = Math.cos(ball.feralPounceAngle) * bal.pounceSpeed * speedMult;
                  ball.vy = Math.sin(ball.feralPounceAngle) * bal.pounceSpeed * speedMult;
                  if (!ball.feralPounceHit && targetDist <= ball.r + enemy.r + 8) {
                    ball.feralPounceHit = true;
                    ball.feralPounceUntil = simTime;
                    localApplyDamage(enemy, bal.pounceDamage * damageMult, `${ball.id}-feral-pounce`, bal.pounceCooldown - 50);
                    enemy.vx += Math.cos(ball.feralPounceAngle) * bal.slashKnockback * 1.8;
                    enemy.vy += Math.sin(ball.feralPounceAngle) * bal.slashKnockback * 1.8;
                    if (ultimateActive) {
                      ball.vx -= Math.cos(ball.feralPounceAngle) * bal.slashRecoil * 1.4;
                      ball.vy -= Math.sin(ball.feralPounceAngle) * bal.slashRecoil * 1.4;
                    }
                  }
                } else if (targetDist >= bal.pounceMinRange && targetDist <= bal.pounceMaxRange && simTime >= (ball.feralNextPounceAt || 0)) {
                  ball.feralPounceAngle = targetAngle;
                  ball.feralPounceUntil = simTime + bal.pounceDuration;
                  ball.feralNextPounceAt = simTime + bal.pounceCooldown * cooldownMult;
                  ball.feralPounceHit = false;
                  ball.vx = Math.cos(targetAngle) * bal.pounceSpeed * speedMult;
                  ball.vy = Math.sin(targetAngle) * bal.pounceSpeed * speedMult;
                } else if (targetDist <= ball.r + enemy.r + bal.slashRange && simTime >= (ball.feralNextSlashAt || 0)) {
                  ball.feralSlashSide = -(ball.feralSlashSide || 1);
                  ball.feralSlashAngle = targetAngle;
                  ball.feralSlashUntil = simTime + 230;
                  ball.feralNextSlashAt = simTime + bal.slashCooldown * cooldownMult;
                  localApplyDamage(enemy, bal.slashDamage * damageMult, `${ball.id}-feral-claw-${ball.feralSlashSide}`, bal.slashCooldown * 0.7);
                  enemy.vx += Math.cos(targetAngle) * bal.slashKnockback;
                  enemy.vy += Math.sin(targetAngle) * bal.slashKnockback;
                  ball.vx -= Math.cos(targetAngle) * bal.slashRecoil;
                  ball.vy -= Math.sin(targetAngle) * bal.slashRecoil;
                }
              }
              if (ball.type === "gun") {
                ball.angle = Math.atan2(enemy.y - ball.y, enemy.x - ball.x);
                
                if (ball.ammo <= 0 || ball.reloadUntil > simTime) {
                  const dist = Math.hypot(enemy.x - ball.x, enemy.y - ball.y);
                  if (dist < 160 && simTime >= (ball.nextSecondaryAt || 0)) {
                    ball.nextSecondaryAt = simTime + balance.gun.secCooldown;
                    const awayAngle = Math.atan2(ball.y - enemy.y, ball.x - enemy.x);
                    ball.vx += Math.cos(awayAngle) * balance.gun.secDashForce;
                    ball.vy += Math.sin(awayAngle) * balance.gun.secDashForce;
                    ball.ammo = Math.min(ball.maxAmmo, (ball.ammo || 0) + 2);
                    ball.reloadUntil = 0;
                  }
                }
                
                if (ball.reloadUntil <= simTime) {
                  if (ball.ammo <= 0) {
                    ball.reloadUntil = simTime + balance.gun.reloadTime;
                    ball.ammo = ball.maxAmmo;
                  } else if (ball.nextShotAt <= simTime) {
                    const isRapidShot = ball.permanentRapidFire;
                    const piercesDefense = isRapidShot && (ball.rapidPierceShotsRemaining || 0) > 0;
                    if (piercesDefense) ball.rapidPierceShotsRemaining -= 1;
                    localBullets.push({
                      ownerId: ball.id, targetSide: enemy.side,
                      x: ball.x + Math.cos(ball.angle) * (ball.r + 26),
                      y: ball.y + Math.sin(ball.angle) * (ball.r + 26),
                      vx: Math.cos(ball.angle) * balance.gun.bulletSpeed,
                      vy: Math.sin(ball.angle) * balance.gun.bulletSpeed,
                      r: 5, damage: balance.gun.bulletDamage, life: balance.gun.bulletLife, piercesDefense
                    });
                    ball.ammo--;
                    ball.nextShotAt = simTime + (isRapidShot ? balance.gun.rapidFireCooldown : balance.gun.shotCooldown);
                  }
                }
              }
            if (ball.type === "vampire") {
              const latched = ball.latchedTo === enemy.id && ball.latchUntil > simTime;
              if (!latched) {
                if (ball.latchedTo === enemy.id) {
                  ball.latchedTo = null;
                  const pushAngle = Math.atan2(ball.y - enemy.y, ball.x - enemy.x);
                  const pushForce = 480;
                  ball.vx = Math.cos(pushAngle) * pushForce;
                  ball.vy = Math.sin(pushAngle) * pushForce;
                  if (!hasStringBounceGuard(enemy)) {
                    enemy.vx = -Math.cos(pushAngle) * pushForce;
                    enemy.vy = -Math.sin(pushAngle) * pushForce;
                  }
                }
                const dist = Math.hypot(ball.x - enemy.x, ball.y - enemy.y);
                const latchLimit = ball.r + enemy.r + balance.vampire.latchDistance;
                if (dist >= latchLimit) {
                  ball.hasStuck = false;
                }
                if (dist < latchLimit && !ball.hasStuck && canStartSkillConnection(ball, enemy, balls, simTime)) {
                  ball.latchedTo = enemy.id;
                  ball.latchUntil = simTime + balance.vampire.latchDuration;
                  ball.hasStuck = true;
                  ball.nextDrainAt = simTime;
                }
              } else {
                const angle = Math.atan2(ball.y - enemy.y, ball.x - enemy.x);
                ball.x = enemy.x + Math.cos(angle) * (ball.r + enemy.r - 8);
                ball.y = enemy.y + Math.sin(angle) * (ball.r + enemy.r - 8);
                if (ball.nextDrainAt <= simTime) {
                  if (isChessCrownActive(enemy)) return;
                  if (isWreckerJumpInvulnerable(enemy)) return;
                  enemy.health = Math.max(0, enemy.health - Math.max(MIN_DAMAGE, balance.vampire.drainPerTick));
                  ball.health = Math.min(MAX_HEALTH, ball.health + balance.vampire.healPerTick);
                  ball.nextDrainAt = simTime + balance.vampire.tickCooldown;
                }
              }
            }
            if (ball.type === "laser") {
              const dist = Math.hypot(enemy.x - ball.x, enemy.y - ball.y);

              if (ball.laserState === "idle") {
                ball.laserTargetAngle = Math.atan2(enemy.y - ball.y, enemy.x - ball.x);
                if (ball.nextShotAt <= simTime) {
                  ball.laserState = "charging"; ball.laserStateUntil = simTime + balance.laser.chargeTime;
                  ball.laserTargetAngle = Math.atan2(enemy.y - ball.y, enemy.x - ball.x);
                }
              } else if (ball.laserState === "charging") {
                const targetAngle = Math.atan2(enemy.y - ball.y, enemy.x - ball.x);
                let angleDiff = targetAngle - (ball.laserTargetAngle ?? targetAngle);
                while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
                while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
                ball.laserTargetAngle = (ball.laserTargetAngle ?? targetAngle) + angleDiff * 0.035;
                if (simTime >= ball.laserStateUntil) {
                  ball.laserState = "firing"; ball.laserStateUntil = simTime + balance.laser.fireDuration;
                  ball.laserNextTickAt = simTime;
                }
              } else if (ball.laserState === "firing") {
                const targetAngle = Math.atan2(enemy.y - ball.y, enemy.x - ball.x);
                let angleDiff = targetAngle - (ball.laserTargetAngle ?? targetAngle);
                while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
                while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
                ball.laserTargetAngle = (ball.laserTargetAngle ?? targetAngle) + angleDiff * 0.035;
                const recoilAngle = Math.atan2(ball.y - enemy.y, ball.x - enemy.x);
                const recoilF = balance.laser.recoilForce || 180;
                ball.vx += Math.cos(recoilAngle) * recoilF * dt;
                ball.vy += Math.sin(recoilAngle) * recoilF * dt;

                const mX = ball.x + Math.cos(ball.laserTargetAngle) * ball.r;
                const mY = ball.y + Math.sin(ball.laserTargetAngle) * ball.r;
                const eX = mX + Math.cos(ball.laserTargetAngle) * 1500;
                const eY = mY + Math.sin(ball.laserTargetAngle) * 1500;
                const d = linePointDist(enemy.x, enemy.y, mX, mY, eX, eY);
                if (d < enemy.r + balance.laser.beamWidth / 2 && simTime >= ball.laserNextTickAt) {
                  if (isChessCrownActive(enemy)) return;
                  if (isWreckerJumpInvulnerable(enemy)) return;
                  enemy.health = Math.max(0, enemy.health - Math.max(MIN_DAMAGE, balance.laser.damagePerTick));
                  ball.laserNextTickAt = simTime + balance.laser.tickCooldown;
                }
                if (simTime >= ball.laserStateUntil) {
                  ball.laserState = "idle"; ball.nextShotAt = simTime + balance.laser.cooldown;
                }
              }
            }
            if (ball.type === "shield") {
              if (ball.shieldBashUntil && simTime < ball.shieldBashUntil) {
                const dist = Math.hypot(enemy.x - ball.x, enemy.y - ball.y);
                if (dist < ball.r + enemy.r + 5) {
                  localApplyDamage(enemy, balance.shield.secBashDamage, `${ball.id}-shield-bash`, 250);
                  const pushAngle = Math.atan2(enemy.y - ball.y, enemy.x - ball.x);
                  if (!hasStringBounceGuard(enemy)) {
                    enemy.vx += Math.cos(pushAngle) * balance.shield.knockback * 15;
                    enemy.vy += Math.sin(pushAngle) * balance.shield.knockback * 15;
                  }
                  ball.shieldBashUntil = 0;
                }
              }

              if (ball.shieldState === "held") {
                ball.shieldAngle = Math.atan2(enemy.y - ball.y, enemy.x - ball.x);
                
                const dist = Math.hypot(enemy.x - ball.x, enemy.y - ball.y);
                if ((ball.shieldBashThrows || 0) >= SHIELD_BASH_READY_THROWS && simTime >= (ball.nextSecondaryAt || 0) && canStartSkillConnection(ball, enemy, balls, simTime)) {
                  ball.nextSecondaryAt = simTime + balance.shield.secCooldownHeld;
                  const bashAngle = Math.atan2(enemy.y - ball.y, enemy.x - ball.x);
                  ball.shieldBashThrows = 0;
                  if (dist <= SHIELD_BASH_CLOSE_RADIUS) {
                    localApplyDamage(enemy, balance.shield.secBashDamage, `${ball.id}-shield-bash-ready`, 250);
                    if (!hasStringBounceGuard(enemy)) {
                      enemy.vx += Math.cos(bashAngle) * balance.shield.knockback * 22;
                      enemy.vy += Math.sin(bashAngle) * balance.shield.knockback * 22;
                    }
                  } else {
                    ball.shieldBashUntil = simTime + SHIELD_BASH_LUNGE_DURATION;
                    ball.vx = Math.cos(bashAngle) * SHIELD_BASH_LUNGE_SPEED;
                    ball.vy = Math.sin(bashAngle) * SHIELD_BASH_LUNGE_SPEED;
                  }
                } else if (ball.nextThrowAt <= simTime) {
                  ball.shieldState = "thrown";
                  ball.shieldGuardHits = 0;
                  ball.shieldBonusDamage = 0;
                  ball.shieldBashThrows = Math.min(SHIELD_BASH_READY_THROWS, (ball.shieldBashThrows || 0) + 1);
                  ball.shieldX = ball.x + Math.cos(ball.shieldAngle) * (ball.r + 5);
                  ball.shieldY = ball.y + Math.sin(ball.shieldAngle) * (ball.r + 5);
                  const angle = Math.atan2(enemy.y - ball.y, enemy.x - ball.x);
                  ball.shieldVx = Math.cos(angle) * balance.shield.shieldSpeed;
                  ball.shieldVy = Math.sin(angle) * balance.shield.shieldSpeed;
                  ball.shieldThrownUntil = simTime + balance.shield.duration;
                  ball.shieldNextHitAt = 0;
                }
              } else if (ball.shieldState === "dropped") {
                ball.shieldVx = 0;
                ball.shieldVy = 0;
                const pickupDist = Math.hypot(ball.x - ball.shieldX, ball.y - ball.shieldY);
                if (pickupDist < ball.r + SHIELD_PICKUP_RADIUS) {
                  ball.shieldState = "held";
                  ball.shieldGuardHits = 0;
                  ball.shieldBonusDamage = 0;
                  ball.shieldLaserPierceHits = 0;
                  ball.nextThrowAt = simTime + balance.shield.cooldown;
                }
              } else {
                ball.shieldX += ball.shieldVx * dt;
                ball.shieldY += ball.shieldVy * dt;

                const pad = 18, shieldR = 24;
                if (ball.shieldX - shieldR < pad) { ball.shieldX = pad + shieldR; ball.shieldVx = Math.abs(ball.shieldVx); ball.shieldBonusDamage = (ball.shieldBonusDamage || 0) + 1; }
                if (ball.shieldX + shieldR > ARENA_SIZE - pad) { ball.shieldX = ARENA_SIZE - pad - shieldR; ball.shieldVx = -Math.abs(ball.shieldVx); ball.shieldBonusDamage = (ball.shieldBonusDamage || 0) + 1; }
                if (ball.shieldY - shieldR < pad) { ball.shieldY = pad + shieldR; ball.shieldVy = Math.abs(ball.shieldVy); ball.shieldBonusDamage = (ball.shieldBonusDamage || 0) + 1; }
                if (ball.shieldY + shieldR > ARENA_SIZE - pad) { ball.shieldY = ARENA_SIZE - pad - shieldR; ball.shieldVy = -Math.abs(ball.shieldVy); ball.shieldBonusDamage = (ball.shieldBonusDamage || 0) + 1; }

                const d = Math.hypot(ball.shieldX - enemy.x, ball.shieldY - enemy.y);
                if (d < enemy.r + shieldR) {
                  if (simTime >= ball.shieldNextHitAt) {
                    localApplyDamage(enemy, balance.shield.damage + (ball.shieldBonusDamage || 0), `${ball.id}-shield-hit`, balance.shield.cooldown);
                    const knockAngle = Math.atan2(enemy.y - ball.shieldY, enemy.x - ball.shieldX);
                    if (!hasStringBounceGuard(enemy)) {
                      enemy.vx += Math.cos(knockAngle) * balance.shield.knockback * 12;
                      enemy.vy += Math.sin(knockAngle) * balance.shield.knockback * 12;
                    }
                    ball.shieldVx = -Math.cos(knockAngle) * balance.shield.shieldSpeed;
                    ball.shieldVy = -Math.sin(knockAngle) * balance.shield.shieldSpeed;
                    ball.shieldNextHitAt = simTime + 300;
                  }
                }

                if (ball.shieldState === "thrown" && simTime >= ball.shieldThrownUntil) {
                  ball.shieldState = "returning";
                }

                if (ball.shieldState === "returning") {
                  const returnAngle = Math.atan2(ball.y - ball.shieldY, ball.x - ball.shieldX);
                  ball.shieldVx = Math.cos(returnAngle) * balance.shield.returnSpeed;
                  ball.shieldVy = Math.sin(returnAngle) * balance.shield.returnSpeed;
                  const distToOwner = Math.hypot(ball.x - ball.shieldX, ball.y - ball.shieldY);
                  if (distToOwner < ball.r + 10) {
                    ball.shieldState = "held";
                    ball.shieldGuardHits = 0;
                    ball.shieldBonusDamage = 0;
                    ball.shieldLaserPierceHits = 0;
                    ball.nextThrowAt = simTime + balance.shield.cooldown;
                  }
                }
              }
            }
            // Spider Ball Physics in Tournament
            if (ball.type === "spider") {
              const dist = Math.hypot(enemy.x - ball.x, enemy.y - ball.y);
              if (dist < 240 && simTime >= (ball.nextSecondaryAt || 0)) {
                ball.nextSecondaryAt = simTime + balance.spider.secCooldown;
                const spitX = clamp(ball.x + (enemy.x - ball.x) * 0.4 + (Math.random() - 0.5) * 20, 30, ARENA_SIZE - 30);
                const spitY = clamp(ball.y + (enemy.y - ball.y) * 0.4 + (Math.random() - 0.5) * 20, 30, ARENA_SIZE - 30);
                localVenomPools.push({
                  x: spitX,
                  y: spitY,
                  r: balance.spider.secPoolRadius,
                  ownerSide: ball.side,
                  createdTime: simTime,
                  duration: 4000
                });
              }

              if (ball.webState === "idle" && ball.nextShotAt <= simTime && canStartSkillConnection(ball, enemy, balls, simTime)) {
                ball.webState = "shooting";
                ball.webX = ball.x; ball.webY = ball.y;
                const angle = Math.atan2(enemy.y - ball.y, enemy.x - ball.x);
                ball.webVx = Math.cos(angle) * balance.spider.webSpeed;
                ball.webVy = Math.sin(angle) * balance.spider.webSpeed;
                ball.nextShotAt = simTime + balance.spider.cooldown;
              } else if (ball.webState === "shooting") {
                ball.webX += ball.webVx * dt;
                ball.webY += ball.webVy * dt;
                const pad = 18;
                if (ball.webX < pad || ball.webX > ARENA_SIZE - pad || ball.webY < pad || ball.webY > ARENA_SIZE - pad) {
                  ball.webState = "idle";
                } else if (Math.hypot(ball.webX - enemy.x, ball.webY - enemy.y) < enemy.r + 6) {
                  if (canStartSkillConnection(ball, enemy, balls, simTime)) {
                    ball.webState = "pulling";
                    ball.webTargetId = enemy.id;
                    ball.webBouncesLeft = 3;
                    ball.webLastTargetX = enemy.x;
                    ball.webLastTargetY = enemy.y;
                    ball.webStateUntil = simTime + balance.spider.pullDuration;
                  } else {
                    ball.webState = "idle";
                    ball.webTargetId = null;
                  }
                }
              } else if (ball.webState === "pulling") {
                if (simTime >= ball.webStateUntil) {
                  ball.webState = "idle";
                  ball.webTargetId = null;
                  ball.webBouncesLeft = 0;
                  localVenomPools.push({
                    x: enemy.x,
                    y: enemy.y,
                    r: balance.spider.secPoolRadius,
                    ownerSide: ball.side,
                    createdTime: simTime,
                    duration: 4000
                  });
                  return;
                }
                const targetDx = enemy.x - (ball.webLastTargetX ?? enemy.x);
                const targetDy = enemy.y - (ball.webLastTargetY ?? enemy.y);
                ball.webLastTargetX = enemy.x;
                ball.webLastTargetY = enemy.y;
                ball.x += targetDx;
                ball.y += targetDy;
                const angle = Math.atan2(enemy.y - ball.y, enemy.x - ball.x);
                ball.x += Math.cos(angle) * balance.spider.pullSpeed * dt;
                ball.y += Math.sin(angle) * balance.spider.pullSpeed * dt;
                const pad = 18;
                if (ball.x - ball.r < pad) { ball.x = pad + ball.r; ball.vx = Math.abs(ball.vx); }
                if (ball.x + ball.r > ARENA_SIZE - pad) { ball.x = ARENA_SIZE - pad - ball.r; ball.vx = -Math.abs(ball.vx); }
                if (ball.y - ball.r < pad) { ball.y = pad + ball.r; ball.vy = Math.abs(ball.vy); }
                if (ball.y + ball.r > ARENA_SIZE - pad) { ball.y = ARENA_SIZE - pad - ball.r; ball.vy = -Math.abs(ball.vy); }
                ball.webX = enemy.x; ball.webY = enemy.y;
                if (Math.hypot(enemy.x - ball.x, enemy.y - ball.y) < ball.r + enemy.r + 12) {
                  const pushAngle = Math.atan2(ball.y - enemy.y, ball.x - enemy.x);
                  ball.x = enemy.x + Math.cos(pushAngle) * (ball.r + enemy.r + 4);
                  ball.y = enemy.y + Math.sin(pushAngle) * (ball.r + enemy.r + 4);
                  const randomSign = Math.random() < 0.5 ? -1 : 1;
                  const bounceAngle = pushAngle + randomSign * (0.6 + Math.random() * 0.5);
                  ball.vx = Math.cos(bounceAngle) * balance.spider.bounceSpeed;
                  ball.vy = Math.sin(bounceAngle) * balance.spider.bounceSpeed;
                  localApplyDamage(enemy, balance.spider.fangDamage, `${ball.id}-fang-${ball.webBouncesLeft}`, 120);
                  ball.fangFlashUntil = simTime + 180;
                  ball.webBouncesLeft -= 1;
                  if (ball.webBouncesLeft > 0) {
                    ball.webState = "webBouncing";
                    ball.webStateUntil = simTime + 300;
                  } else {
                    ball.webState = "idle";
                    ball.webTargetId = null;
                    localVenomPools.push({
                      x: enemy.x,
                      y: enemy.y,
                      r: balance.spider.secPoolRadius,
                      ownerSide: ball.side,
                      createdTime: simTime,
                      duration: 4000
                    });
                  }
                }
              } else if (ball.webState === "webBouncing") {
                const targetDx = enemy.x - (ball.webLastTargetX ?? enemy.x);
                const targetDy = enemy.y - (ball.webLastTargetY ?? enemy.y);
                ball.webLastTargetX = enemy.x;
                ball.webLastTargetY = enemy.y;
                ball.x += targetDx;
                ball.y += targetDy;
                ball.webX = enemy.x; ball.webY = enemy.y;
                if (simTime >= ball.webStateUntil) {
                  ball.webState = "pulling";
                  ball.webStateUntil = simTime + balance.spider.pullDuration;
                }
              }
            }
            // Black Spider Ball Physics in Tournament
            if (ball.type === "blackSpider") {
              // Disabled skills
            }
            // Bomber Ball Physics in Tournament
            if (ball.type === "bomber") {
              if (ball.nextShotAt <= simTime) {
                const rx = clamp(ball.x + (Math.random() - 0.5) * 120, 50, ARENA_SIZE - 50);
                const ry = clamp(ball.y + (Math.random() - 0.5) * 120, 50, ARENA_SIZE - 50);
                const activeMines = localMines.filter(m => m.ownerId === ball.id);
                if (activeMines.length >= balance.bomber.maxMines) {
                  activeMines[0].triggerTime = simTime;
                }
                localMines.push({
                  ownerId: ball.id, ownerSide: ball.side, x: rx, y: ry, r: 10, triggerRadius: 45, triggerTime: null, isHoming: false
                });
                ball.nextShotAt = simTime + balance.bomber.cooldown;
              }
              
              const secCooldown = balance.bomber.secCooldown !== undefined ? balance.bomber.secCooldown : 7000;
              if (simTime >= (ball.nextSecondaryAt || 0)) {
                ball.nextSecondaryAt = simTime + secCooldown;
                const angle = Math.atan2(enemy.y - ball.y, enemy.x - ball.x);
                const rx = clamp(ball.x - Math.cos(angle) * (ball.r + 15), 50, ARENA_SIZE - 50);
                const ry = clamp(ball.y - Math.sin(angle) * (ball.r + 15), 50, ARENA_SIZE - 50);
                localMines.push({
                  ownerId: ball.id, ownerSide: ball.side, x: rx, y: ry, r: 10, triggerRadius: 45, triggerTime: null,
                  isHoming: true, vx: Math.cos(angle) * 30, vy: Math.sin(angle) * 30
                });
              }
            }

            // Wrecker Ball Physics in Tournament
            if (ball.type === "wrecker") {
              const wreckerCD = balance.wrecker.cooldown !== undefined ? balance.wrecker.cooldown : 950;
              const sizePerRage = balance.wrecker.sizePerRage || 0.015;
              const maxRageSizeScale = balance.wrecker.maxRageSizeScale || 1.16;
              const leapDuration = balance.wrecker.leapDuration || 680;
              let sizeScale = Math.min(maxRageSizeScale, 1 + Math.min(12, ball.rageStacks || 0) * sizePerRage);
              if (ball.wreckerEnlargedUntil > 0 && simTime < ball.wreckerEnlargedUntil) {
                ball.r = ball.originalRadius * (balance.wrecker.megaSizeScale || 1.24);
              } else {
                ball.r = ball.originalRadius * sizeScale;
              }
              
              if (!ball.wreckerState) ball.wreckerState = "idle";
              if (ball.wreckerState === "leaping") {
                const elapsed = simTime - (ball.wreckerLeapStart || simTime);
                const rawProgress = clamp(elapsed / leapDuration, 0, 1);
                const progress = rawProgress < 0.5 ? 2 * rawProgress * rawProgress : 1 - Math.pow(-2 * rawProgress + 2, 2) / 2;
                ball.x = (ball.wreckerStartX || ball.x) + ((ball.wreckerLeapTargetX || ball.x) - (ball.wreckerStartX || ball.x)) * progress;
                ball.y = (ball.wreckerStartY || ball.y) + ((ball.wreckerLeapTargetY || ball.y) - (ball.wreckerStartY || ball.y)) * progress;
                ball.vx = 0;
                ball.vy = 0;

                if (simTime >= ball.wreckerLeapUntil) {
                  ball.wreckerState = "cooldown";
                  ball.wreckerStateUntil = simTime + wreckerCD;
                  ball.wreckerNextLeapAllowedUntil = simTime + wreckerCD + (balance.wrecker.leapCooldown || 7200);
                  
                  const landedMega = !!ball.isMegaLeap;
                  ball.consecutiveWallBounces = 0;
                  
                  const dToEnemy = Math.hypot(enemy.x - ball.x, enemy.y - ball.y);
                  const slamRadius = landedMega ? (balance.wrecker.megaShockwaveRadius || 108) : (balance.wrecker.shockwaveRadius || 78);
                  if (dToEnemy < slamRadius + enemy.r) {
                    localApplyDamage(enemy, landedMega ? balance.wrecker.megaLeapDamage : balance.wrecker.leapDamage, `${ball.id}-wrecker-leap`, 9999999);
                    const knockAngle = Math.atan2(enemy.y - ball.y, enemy.x - ball.x);
                    const knockForce = balance.wrecker.knockbackForce || 500;
                    if (!hasStringBounceGuard(enemy)) {
                      enemy.vx += Math.cos(knockAngle) * knockForce;
                      enemy.vy += Math.sin(knockAngle) * knockForce;
                    }
                  }

                  const reboundAngle = Math.atan2(ball.y - enemy.y, ball.x - enemy.x);
                  ball.vx = Math.cos(reboundAngle) * (balance.wrecker.landingRecoil || 240);
                  ball.vy = Math.sin(reboundAngle) * (balance.wrecker.landingRecoil || 240);
                  ball.rageStacks = 0;
                  ball.isMegaLeap = false;
                }
              } else if (ball.wreckerState === "cooldown") {
                const angle = Math.atan2(enemy.y - ball.y, enemy.x - ball.x);
                ball.vx = Math.cos(angle) * 110;
                ball.vy = Math.sin(angle) * 110;
                if (simTime >= ball.wreckerStateUntil) {
                  ball.wreckerState = "idle";
                }
              } else {
                const distToEnemy = Math.hypot(enemy.x - ball.x, enemy.y - ball.y);
                const canLeap = (ball.rageStacks || 0) >= (balance.wrecker.rageRequired || 6) && simTime >= (ball.wreckerNextLeapAllowedUntil || 0) && distToEnemy < 240;
                
                if (canLeap && canStartSkillConnection(ball, enemy, balls, simTime)) {
                  ball.wreckerState = "leaping";
                  ball.wreckerLeapStart = simTime;
                  ball.wreckerLeapUntil = simTime + leapDuration;
                  ball.wreckerStartX = ball.x;
                  ball.wreckerStartY = ball.y;
                  if ((ball.rageStacks || 0) >= (balance.wrecker.megaRageRequired || 12) || (ball.consecutiveWallBounces || 0) >= 10) {
                    ball.isMegaLeap = true;
                  }
                  const leadTime = balance.wrecker.leapLeadTime || 0.38;
                  ball.wreckerLeapTargetX = enemy.x + enemy.vx * leadTime;
                  ball.wreckerLeapTargetY = enemy.y + enemy.vy * leadTime;
                  ball.vx = 0;
                  ball.vy = 0;
                } else {
                  const angle = Math.atan2(enemy.y - ball.y, enemy.x - ball.x);
                  const normalSpeed = 220;
                  ball.vx = Math.cos(angle) * normalSpeed;
                  ball.vy = Math.sin(angle) * normalSpeed;
                }
              }
            }

            // Arm Ball Physics in Tournament
            if (ball.type === "arm") {
              if (ball.armState === "elbow_dropping") {
                const duration = Math.max(1, ball.armStateUntil - (ball.armDropStartAt || simTime));
                const progress = clamp((simTime - (ball.armDropStartAt || simTime)) / duration, 0, 1);
                const ease = 1 - Math.pow(1 - progress, 3);
                const arc = Math.sin(progress * Math.PI) * 58;
                const startX = ball.armDropStartX || ball.x;
                const startY = ball.armDropStartY || ball.y;
                const landX = ball.armDropTargetX || enemy.x;
                const landY = ball.armDropTargetY || enemy.y;
                ball.x = startX + (landX - startX) * ease;
                ball.y = startY + (landY - startY) * ease - arc;
                ball.vx = 0;
                ball.vy = 0;
                if (simTime >= ball.armStateUntil) {
                  ball.armState = "idle";
                  ball.armGrabTargetId = null;
                  ball.x = landX;
                  ball.y = landY;
                  const impactDist = Math.hypot(enemy.x - landX, enemy.y - landY);
                  const launchAngle = ball.armDropAngle ?? Math.atan2(enemy.y - landY, enemy.x - landX);
                  const didHit = impactDist <= ball.r + enemy.r + 24;
                  if (didHit) {
                    localApplyDamage(enemy, balance.arm.secSlamDamage, `${ball.id}-elbow-slam`, 500);
                    const launchForce = 640;
                    enemy.vx = Math.cos(launchAngle) * launchForce;
                    enemy.vy = Math.sin(launchAngle) * launchForce;
                  }
                  const recoilForce = didHit ? 980 : 760;
                  ball.vx = -Math.cos(launchAngle) * recoilForce;
                  ball.vy = -Math.sin(launchAngle) * recoilForce;
                }
              } else if (ball.armState === "idle") {
                const targetAngle = Math.atan2(enemy.y - ball.y, enemy.x - ball.x);
                ball.armAngle = (ball.armAngle || 0) + balance.arm.swingSpeed;
                const targetDist = Math.hypot(enemy.x - ball.x, enemy.y - ball.y);

                if (targetDist < ball.r + enemy.r + balance.arm.punchRange && simTime >= (ball.armNextPunchAt || 0)) {
                  ball.armNextPunchAt = simTime + balance.arm.punchCooldown;
                  localApplyDamage(enemy, balance.arm.punchDamage, `${ball.id}-arm-punch`, 350);
                  enemy.vx += Math.cos(targetAngle) * balance.arm.punchKnockback;
                  enemy.vy += Math.sin(targetAngle) * balance.arm.punchKnockback;
                }

                const elbowDropRange = Math.max(88, balance.arm.grabRange + ball.r + enemy.r + 12);
                if (targetDist <= elbowDropRange && simTime >= (ball.nextSecondaryAt || 0) && canStartSkillConnection(ball, enemy, balls, simTime)) {
                  const leadTime = clamp(targetDist / 520, 0.06, 0.24);
                  const landX = clamp(enemy.x + (enemy.vx || 0) * leadTime, ball.r + 20, ARENA_SIZE - ball.r - 20);
                  const landY = clamp(enemy.y + (enemy.vy || 0) * leadTime, ball.r + 20, ARENA_SIZE - ball.r - 20);
                  ball.nextSecondaryAt = simTime + balance.arm.secCooldown;
                  ball.armState = "elbow_dropping";
                  ball.armDropStartAt = simTime;
                  ball.armStateUntil = simTime + 580;
                  ball.armGrabTargetId = enemy.id;
                  ball.armDropStartX = ball.x;
                  ball.armDropStartY = ball.y;
                  ball.armDropTargetX = landX;
                  ball.armDropTargetY = landY;
                  ball.armDropAngle = Math.atan2(landY - ball.y, landX - ball.x);
                  interruptSkills(enemy);
                }
              }
            }

            // Chess Ball Physics in Tournament
            if (ball.type === "chess") {
              if (ball.chessState === "idle") {
                if (ball.nextShotAt <= simTime) {
                  ball.chessState = "movingToCenter";
                }
              } else if (ball.chessState === "movingToCenter") {
                const cx = ARENA_SIZE / 2;
                const cy = ARENA_SIZE / 2;
                const dx = cx - ball.x;
                const dy = cy - ball.y;
                const dist = Math.hypot(dx, dy);
                if (dist < 10) {
                  ball.x = cx;
                  ball.y = cy;
                  ball.vx = 0;
                  ball.vy = 0;
                  ball.chessState = "activeCrown";
                  ball.chessTimer = simTime + balance.chess.crownDuration;
                  ball.chessScale = 1.0;
                  
                  const crowns = ["knight", "bishop", "rook"];
                  ball.chessCrown = crowns[Math.floor(Math.random() * crowns.length)];
                } else {
                  const angle = Math.atan2(dy, dx);
                  ball.vx = Math.cos(angle) * balance.chess.centerSpeed;
                  ball.vy = Math.sin(angle) * balance.chess.centerSpeed;
                }
              } else if (ball.chessState === "activeCrown") {
                ball.x = ARENA_SIZE / 2;
                ball.y = ARENA_SIZE / 2;
                ball.vx = 0;
                ball.vy = 0;

                const duration = balance.chess.crownDuration;
                const timeLeft = ball.chessTimer - simTime;
                const elapsed = duration - timeLeft;
                const progress = clamp(elapsed / duration, 0, 1);

                if (ball.chessCrown === "knight") {
                  ball.chessScale = 1.0 + 1.6 * Math.abs(Math.sin(progress * Math.PI * 2));
                } else if (ball.chessCrown === "bishop") {
                  ball.chessScale = 1.0 + 1.8 * Math.sin(progress * Math.PI);
                } else if (ball.chessCrown === "rook") {
                  if (progress >= 0.25 && progress <= 0.75) {
                    ball.chessScale = 3.0;
                  } else {
                    ball.chessScale = 1.0;
                  }
                } else {
                  ball.chessScale = 1.0;
                }



                if (simTime >= ball.chessTimer) {
                  ball.chessState = "attacking";
                  ball.chessScale = 1.0;
                  ball.chessWaypointIndex = 0;
                  
                  const cx = ARENA_SIZE / 2;
                  const cy = ARENA_SIZE / 2;
                  const pad = 18 + ball.r;
                  
                  if (ball.chessCrown === "bishop") {
                    ball.chessAttackWaypoints = [
                      { x: pad, y: pad },
                      { x: ARENA_SIZE - pad, y: ARENA_SIZE - pad },
                      { x: cx, y: cy },
                      { x: ARENA_SIZE - pad, y: pad },
                      { x: pad, y: ARENA_SIZE - pad },
                      { x: cx, y: cy }
                    ];
                  } else if (ball.chessCrown === "rook") {
                    ball.chessAttackWaypoints = [
                      { x: pad, y: cy },
                      { x: ARENA_SIZE - pad, y: cy },
                      { x: cx, y: cy },
                      { x: cx, y: pad },
                      { x: cx, y: ARENA_SIZE - pad },
                      { x: cx, y: cy }
                    ];
                  } else { // knight
                    ball.chessAttackWaypoints = [
                      { x: cx, y: cy - 160 }, { x: cx - 80, y: cy - 160 }, { x: cx, y: cy },
                      { x: cx, y: cy - 160 }, { x: cx + 80, y: cy - 160 }, { x: cx, y: cy },
                      { x: cx, y: cy + 160 }, { x: cx - 80, y: cy + 160 }, { x: cx, y: cy },
                      { x: cx, y: cy + 160 }, { x: cx + 80, y: cy + 160 }, { x: cx, y: cy }
                    ];
                  }
                }
              } else if (ball.chessState === "attacking") {
                const waypoints = ball.chessAttackWaypoints;
                const idx = ball.chessWaypointIndex;
                if (idx < waypoints.length) {
                  const wp = waypoints[idx];
                  const dx = wp.x - ball.x;
                  const dy = wp.y - ball.y;
                  const dist = Math.hypot(dx, dy);
                  const speed = balance.chess.centerSpeed * 4;
                  
                  if (dist < 12) {
                    ball.x = wp.x;
                    ball.y = wp.y;
                    ball.chessWaypointIndex++;
                    ball.vx = 0;
                    ball.vy = 0;
                  } else {
                    const angle = Math.atan2(dy, dx);
                    ball.vx = Math.cos(angle) * speed;
                    ball.vy = Math.sin(angle) * speed;
                  }
                  
                  const distTarget = Math.hypot(enemy.x - ball.x, enemy.y - ball.y);
                  if (distTarget < enemy.r + (ball.r + 5) * CHESS_CROWN_HITBOX_MULTIPLIER) {
                    localApplyDamage(enemy, balance.chess.damage, `${ball.id}-chess-attack`, balance.chess.tickCooldown);
                  }
                } else {
                  ball.chessState = "idle";
                  ball.chessCrown = null;
                  ball.chessScale = 1.0;
                  
                  const angle = Math.random() * Math.PI * 2;
                  const launchForce = 350;
                  ball.vx = Math.cos(angle) * launchForce;
                  ball.vy = Math.sin(angle) * launchForce;
                  ball.nextShotAt = simTime + balance.chess.cooldown;
                }
              }
            }

            // Dragon Ball Physics in Tournament
            if (ball.type === "dragon") {
              // Disabled skills
            }

            if (ball.type === "spore" && ball.nextSporeAt <= simTime) {
              for (let i = 0; i < 5; i++) {
                const rx = clamp(ball.x + (Math.random() - 0.5) * 280, 120, ARENA_SIZE - 120);
                const ry = clamp(ball.y + (Math.random() - 0.5) * 280, 120, ARENA_SIZE - 120);
                localCacti.push({
                  ownerId: ball.id, ownerSide: ball.side, x: rx, y: ry, r: 0, targetR: 22,
                  createdTime: simTime, growthDuration: balance.spore.growthDuration, life: balance.spore.cactusLife, charges: 2
                });
              }
              ball.nextSporeAt = simTime + balance.spore.cooldown;
            }
            if (ball.type === "hammer") {
              if (ball.hammerState === "spinning") {
                ball.hammerAngle = (ball.hammerAngle || 0) + balance.hammer.spinSpeed;
                const hx = ball.x + Math.cos(ball.hammerAngle) * (ball.r + 40);
                const hy = ball.y + Math.sin(ball.hammerAngle) * (ball.r + 40);
                const d = Math.hypot(hx - enemy.x, hy - enemy.y);
                if (d < enemy.r + 14) {
                  localApplyDamage(enemy, balance.hammer.spinDamage, `${ball.id}-hammer-spin-hit`, balance.hammer.cooldown);
                }
                if (ball.hammerAngle >= 10 * Math.PI && canStartSkillConnection(ball, enemy, balls, simTime)) {
                  ball.hammerState = "charging";
                  ball.hammerStateUntil = simTime + balance.hammer.chargeDuration;
                  ball.vx = 0; ball.vy = 0;
                }
              } else if (ball.hammerState === "charging") {
                ball.vx = 0; ball.vy = 0;
                ball.hammerAngle = Math.atan2(enemy.y - ball.y, enemy.x - ball.x);
                if (simTime >= ball.hammerStateUntil) {
                  ball.hammerState = "launching";
                  ball.hammerStateUntil = simTime + balance.hammer.launchDuration;
                  ball.hammerLaunchAngle = ball.hammerAngle;
                  ball.vx = Math.cos(ball.hammerLaunchAngle) * balance.hammer.launchSpeed;
                  ball.vy = Math.sin(ball.hammerLaunchAngle) * balance.hammer.launchSpeed;
                  ball.hammerNextHitAt = 0;
                }
              } else if (ball.hammerState === "launching") {
                ball.vx = Math.cos(ball.hammerLaunchAngle) * balance.hammer.launchSpeed;
                ball.vy = Math.sin(ball.hammerLaunchAngle) * balance.hammer.launchSpeed;
                const d = Math.hypot(ball.x - enemy.x, ball.y - enemy.y);
                if (d < ball.r + enemy.r) {
                  if (simTime >= ball.hammerNextHitAt) {
                    localApplyDamage(enemy, balance.hammer.launchDamage, `${ball.id}-hammer-launch-hit`, balance.hammer.launchDuration);
                    if (!hasStringBounceGuard(enemy)) {
                      enemy.vx += Math.cos(ball.hammerLaunchAngle) * 600;
                      enemy.vy += Math.sin(ball.hammerLaunchAngle) * 600;
                    }
                    ball.hammerNextHitAt = simTime + balance.hammer.launchDuration;
                  }
                }
                 if (simTime >= ball.hammerStateUntil) {
                   ball.hammerState = "spinning";
                   ball.hammerAngle = 0;
                 }
               }
             }
             if (ball.type === "shadow") {
               const bal = balance.shadow;
               const targetAngle = Math.atan2(enemy.y - ball.y, enemy.x - ball.x);
               const targetDist = Math.hypot(enemy.x - ball.x, enemy.y - ball.y);
               if (ball.shadowComboSecondAt && simTime >= ball.shadowComboSecondAt) {
                 ball.shadowComboSecondAt = 0;
                 if (enemy.id === ball.shadowComboTargetId && targetDist <= ball.r + enemy.r + bal.slashRange + 8) {
                   localApplyDamage(enemy, bal.comboSecondDamage, `${ball.id}-shadow-combo-second`, bal.slashCooldown - 10);
                   if (!hasStringBounceGuard(enemy)) {
                     const secondAngle = Math.atan2(enemy.y - ball.y, enemy.x - ball.x) + 0.18;
                     enemy.vx += Math.cos(secondAngle) * 170;
                     enemy.vy += Math.sin(secondAngle) * 170;
                   }
                 }
                 ball.shadowComboTargetId = null;
               }
               const switchCandidate = (ball.shadowMinions || [])
                 .filter((minion) => minion.health > 0 && Math.hypot(minion.x - enemy.x, minion.y - enemy.y) <= bal.switchRange)
                 .sort((a, b) => Math.hypot(a.x - enemy.x, a.y - enemy.y) - Math.hypot(b.x - enemy.x, b.y - enemy.y))[0];
               if (switchCandidate && simTime >= (ball.shadowNextSwitchAt || 0) && simTime >= (ball.shadowNextSlashAt || 0)) {
                 const oldX = ball.x;
                 const oldY = ball.y;
                 ball.x = switchCandidate.x;
                 ball.y = switchCandidate.y;
                 switchCandidate.x = oldX;
                 switchCandidate.y = oldY;
                 ball.vx *= 0.65;
                 ball.vy *= 0.65;
                 ball.shadowNextSwitchAt = simTime + bal.switchCooldown;
                 ball.shadowNextSlashAt = simTime + bal.slashCooldown;
                 ball.shadowSlashUntil = simTime + 260;
                 ball.shadowSlashAngle = Math.atan2(enemy.y - ball.y, enemy.x - ball.x);
                 localApplyDamage(enemy, bal.switchDamage, `${ball.id}-shadow-switch-knife`, bal.switchCooldown - 10);
                 if (!hasStringBounceGuard(enemy)) {
                   enemy.vx += Math.cos(ball.shadowSlashAngle) * 240;
                   enemy.vy += Math.sin(ball.shadowSlashAngle) * 240;
                 }
                 const hitOld = Math.hypot(enemy.x - oldX, enemy.y - oldY) <= enemy.r + 64;
                 const hitNew = Math.hypot(enemy.x - ball.x, enemy.y - ball.y) <= enemy.r + 64;
                 if (hitOld || hitNew) {
                   localApplyDamage(enemy, 3, `${ball.id}-shadow-shockwave`, 400);
                   enemy.shadowSlowedUntil = simTime + 1500;
                 }
               }
               if (targetDist <= ball.r + enemy.r + bal.slashRange && simTime >= (ball.shadowNextSlashAt || 0)) {
                 const comboReady = targetDist <= ball.r + enemy.r + (bal.comboRange || 36);
                 ball.shadowNextSlashAt = simTime + bal.slashCooldown;
                 ball.shadowSlashUntil = simTime + (comboReady ? 330 : 240);
                 ball.shadowSlashAngle = targetAngle;
                 ball.shadowCommandUntil = simTime + bal.commandDuration;
                 ball.shadowComboSecondAt = comboReady ? simTime + 150 : 0;
                 ball.shadowComboTargetId = comboReady ? enemy.id : null;
                 enemy.shadowMarkedUntil = simTime + bal.markDuration;
                 enemy.shadowMarkedBy = ball.id;
                 localApplyDamage(enemy, bal.slashDamage, `${ball.id}-shadow-slash`, bal.slashCooldown - 10);
                 if (!hasStringBounceGuard(enemy)) {
                   enemy.vx += Math.cos(targetAngle) * (comboReady ? 150 : 210);
                   enemy.vy += Math.sin(targetAngle) * (comboReady ? 150 : 210);
                 }
               }
               if (simTime >= (ball.shadowNextSummonAt || 0) && (ball.shadowMinions || []).length < bal.maxMinions) {
                 const angle = Math.random() * Math.PI * 2;
                 const spawnDist = ball.r + 12;
                 const minion = {
                   id: `${ball.id}-shadow-${simTime}-${(ball.shadowMinions || []).length}`,
                   type: "shadowMinion",
                   side: ball.side,
                   ownerId: ball.id,
                   x: ball.x + Math.cos(angle) * spawnDist,
                   y: ball.y + Math.sin(angle) * spawnDist,
                   vx: Math.cos(angle) * bal.minionSpeed,
                   vy: Math.sin(angle) * bal.minionSpeed,
                   r: 8,
                   health: bal.minionHealth,
                   maxHealth: bal.minionHealth,
                   hitsLeft: 2,
                   flankSlot: (ball.shadowMinions || []).length % 3,
                   createdTime: simTime,
                   nextHitAt: 0
                 };
                 if (!ball.shadowMinions) ball.shadowMinions = [];
                 ball.shadowMinions.push(minion);
                 ball.shadowNextSummonAt = simTime + bal.summonCooldown;
               }
               const deadMinions = [];
               const aliveMinions = [];
               (ball.shadowMinions || []).forEach((minion) => {
                 const expired = simTime >= minion.createdTime + bal.minionLife;
                 if (minion.health <= 0 || expired) {
                   deadMinions.push(minion);
                 } else {
                   aliveMinions.push(minion);
                 }
               });
               ball.shadowMinions = aliveMinions.slice(0, bal.maxMinions);
               ball.shadowMinions.forEach((minion) => {
                 const commandActive = simTime < (ball.shadowCommandUntil || 0);
                 const moveSpeed = Math.hypot(enemy.vx || 0, enemy.vy || 0);
                 const forwardAngle = moveSpeed > 35 ? Math.atan2(enemy.vy, enemy.vx) : Math.atan2(enemy.y - ball.y, enemy.x - ball.x);
                 const sideSign = minion.flankSlot === 1 ? -1 : 1;
                 const slotAngle = minion.flankSlot === 2
                   ? forwardAngle + Math.PI
                   : forwardAngle + Math.PI * 0.72 * sideSign;
                 const contactDist = enemy.r + minion.r + 5;
                 const flankDist = contactDist + 18;
                 const slotX = clamp(enemy.x + Math.cos(slotAngle) * flankDist, minion.r + 20, ARENA_SIZE - minion.r - 20);
                 const slotY = clamp(enemy.y + Math.sin(slotAngle) * flankDist, minion.r + 20, ARENA_SIZE - minion.r - 20);
                 const dx = slotX - minion.x;
                 const dy = slotY - minion.y;
                 const dist = Math.max(1, Math.hypot(dx, dy));
                 const toTargetX = enemy.x - minion.x;
                 const toTargetY = enemy.y - minion.y;
                 const minionTargetDist = Math.max(1, Math.hypot(toTargetX, toTargetY));
                 const speedMult = commandActive ? 1.55 : 1;
                 const orbitDir = minion.orbitDir || (minion.id.length % 2 === 0 ? 1 : -1);
                 minion.orbitDir = orbitDir;
                 let desiredVx;
                 let desiredVy;
                 if (minionTargetDist <= contactDist) {
                   desiredVx = -(toTargetX / minionTargetDist) * bal.minionSpeed * 1.35 + (-toTargetY / minionTargetDist) * bal.minionSpeed * 0.32 * orbitDir;
                   desiredVy = -(toTargetY / minionTargetDist) * bal.minionSpeed * 1.35 + (toTargetX / minionTargetDist) * bal.minionSpeed * 0.32 * orbitDir;
                   const pushOut = contactDist - minionTargetDist;
                   minion.x -= (toTargetX / minionTargetDist) * pushOut;
                   minion.y -= (toTargetY / minionTargetDist) * pushOut;
                 } else if (dist < 10) {
                   desiredVx = (-toTargetY / minionTargetDist) * bal.minionSpeed * 0.55 * orbitDir;
                   desiredVy = (toTargetX / minionTargetDist) * bal.minionSpeed * 0.55 * orbitDir;
                 } else {
                   desiredVx = (dx / dist) * bal.minionSpeed * speedMult;
                   desiredVy = (dy / dist) * bal.minionSpeed * speedMult;
                 }
                 ball.shadowMinions.forEach((other) => {
                   if (other === minion) return;
                   const sepDx = minion.x - other.x;
                   const sepDy = minion.y - other.y;
                   const sepDist = Math.max(1, Math.hypot(sepDx, sepDy));
                   if (sepDist < minion.r * 3.2) {
                     const push = (minion.r * 3.2 - sepDist) * 4.5;
                     desiredVx += (sepDx / sepDist) * push;
                     desiredVy += (sepDy / sepDist) * push;
                   }
                 });
                 minion.vx += (desiredVx - minion.vx) * (commandActive ? 0.16 : 0.07);
                 minion.vy += (desiredVy - minion.vy) * (commandActive ? 0.16 : 0.07);
                 minion.x += minion.vx * dt;
                 minion.y += minion.vy * dt;
                 const pad = 18 + minion.r;
                 if (minion.x < pad) { minion.x = pad; minion.vx = Math.abs(minion.vx); }
                 if (minion.x > ARENA_SIZE - pad) { minion.x = ARENA_SIZE - pad; minion.vx = -Math.abs(minion.vx); }
                 if (minion.y < pad) { minion.y = pad; minion.vy = Math.abs(minion.vy); }
                 if (minion.y > ARENA_SIZE - pad) { minion.y = ARENA_SIZE - pad; minion.vy = -Math.abs(minion.vy); }
                 const attackAngle = Math.atan2(minion.y - enemy.y, minion.x - enemy.x);
                 const flankDiffRaw = attackAngle - slotAngle;
                 const flankDiff = Math.abs(Math.atan2(Math.sin(flankDiffRaw), Math.cos(flankDiffRaw)));
                 if (minionTargetDist <= contactDist + 2 && flankDiff < 0.95 && simTime >= (minion.nextHitAt || 0)) {
                   minion.nextHitAt = simTime + bal.minionHitCooldown;
                   const markedBonus = enemy.shadowMarkedBy === ball.id && simTime < (enemy.shadowMarkedUntil || 0) ? 1 : 0;
                   const minionDamage = bal.minionDamage + markedBonus;
                   localApplyDamage(enemy, minionDamage, `${minion.id}-hit`, bal.minionHitCooldown - 10);
                   const hitAngle = Math.atan2(enemy.y - minion.y, enemy.x - minion.x);
                   if (!hasStringBounceGuard(enemy)) {
                     enemy.vx += Math.cos(hitAngle) * 130;
                     enemy.vy += Math.sin(hitAngle) * 130;
                   }
                   minion.hitsLeft = (minion.hitsLeft ?? 2) - 1;
                   if (minion.hitsLeft <= 0) {
                     minion.health = 0;
                     deadMinions.push(minion);
                   }
                   minion.vx = -Math.cos(hitAngle) * bal.minionSpeed;
                   minion.vy = -Math.sin(hitAngle) * bal.minionSpeed;
                 }
               });
               deadMinions.forEach((minion) => {
                 const d = Math.hypot(enemy.x - minion.x, enemy.y - minion.y);
                 if (d <= enemy.r + 48) {
                   localApplyDamage(enemy, 2, `${minion.id}-death-burst`, 300);
                   enemy.shadowMarkedUntil = simTime + 1200;
                   enemy.shadowMarkedBy = ball.id;
                   if (!hasStringBounceGuard(enemy)) {
                     const angle = Math.atan2(enemy.y - minion.y, enemy.x - minion.x);
                     enemy.vx += Math.cos(angle) * 80;
                     enemy.vy += Math.sin(angle) * 80;
                   }
                 }
               });
               ball.shadowMinions = ball.shadowMinions.filter((minion) => minion.health > 0);
             }
          }
          });

          localBullets = localBullets.filter((bullet) => {
            bullet.x += bullet.vx * dt; bullet.y += bullet.vy * dt;
            if (bullet.kind !== "dragonFireball") {
              bullet.life -= dt;
            }
            if (bullet.life <= 0) return false;
            
            if (bullet.kind === "dragonFireball") {
              const pad = 18 + bullet.r;
              if (bullet.x < pad) { bullet.x = pad; bullet.vx = Math.abs(bullet.vx); }
              if (bullet.x > ARENA_SIZE - pad) { bullet.x = ARENA_SIZE - pad; bullet.vx = -Math.abs(bullet.vx); }
              if (bullet.y < pad) { bullet.y = pad; bullet.vy = Math.abs(bullet.vy); }
              if (bullet.y > ARENA_SIZE - pad) { bullet.y = ARENA_SIZE - pad; bullet.vy = -Math.abs(bullet.vy); }
            } else if (bullet.x < 18 || bullet.x > ARENA_SIZE - 18 || bullet.y < 18 || bullet.y > ARENA_SIZE - 18) {
              return false;
            }
            
            const shieldBall = bullet.targetSide === "left" ? leftBall : rightBall;
            if (shieldBall.type === "shield" && !bullet.piercesDefense && !bullet.cannotReflect) {
              if (shieldBall.shieldState === "held") {
                const d = Math.hypot(bullet.x - shieldBall.x, bullet.y - shieldBall.y);
                if (d < shieldBall.r + 15 && d > shieldBall.r - 10) {
                  const angle = Math.atan2(bullet.y - shieldBall.y, bullet.x - shieldBall.x);
                  let diff = Math.abs(angle - shieldBall.shieldAngle);
                  while (diff > Math.PI) diff = Math.abs(diff - Math.PI * 2);
                  if (diff < balance.shield.arcWidth / 2) {
                    const enemy = bullet.targetSide === "left" ? rightBall : leftBall;
                    const refAngle = Math.atan2(enemy.y - bullet.y, enemy.x - bullet.x) + (Math.random() - 0.5) * 0.15;
                    const speed = Math.hypot(bullet.vx, bullet.vy);
                    bullet.vx = Math.cos(refAngle) * speed; bullet.vy = Math.sin(refAngle) * speed;
                    bullet.targetSide = null;
                    shieldBall.shieldGuardHits = (shieldBall.shieldGuardHits || 0) + 1;
                    if (shieldBall.shieldGuardHits >= SHIELD_GUARD_HITS) {
                      shieldBall.shieldGuardHits = 0;
                      shieldBall.shieldState = "dropped";
                      shieldBall.shieldX = shieldBall.x + Math.cos(angle) * (shieldBall.r + 8);
                      shieldBall.shieldY = shieldBall.y + Math.sin(angle) * (shieldBall.r + 8);
                      shieldBall.shieldVx = 0;
                      shieldBall.shieldVy = 0;
                      shieldBall.shieldThrownUntil = 0;
                      shieldBall.shieldNextHitAt = 0;
                      shieldBall.shieldSpinAngle = 0;
                      shieldBall.nextThrowAt = simTime + balance.shield.cooldown;
                    }
                    return true;
                  }
                }
              } else if (shieldBall.shieldState === "thrown" || shieldBall.shieldState === "returning") {
                const dShield = Math.hypot(bullet.x - shieldBall.shieldX, bullet.y - shieldBall.shieldY);
                if (dShield < 24 + bullet.r) {
                  bullet.targetSide = bullet.targetSide === "left" ? "right" : "left";
                  const enemy = bullet.targetSide === "left" ? leftBall : rightBall;
                  const refAngle = Math.atan2(enemy.y - bullet.y, enemy.x - bullet.x) + (Math.random() - 0.5) * 0.15;
                  const speed = Math.hypot(bullet.vx, bullet.vy);
                  bullet.vx = Math.cos(refAngle) * speed; bullet.vy = Math.sin(refAngle) * speed;
                  bullet.targetSide = null;
                  return true;
                }
              }
            }
            const target = bullet.targetSide === "left" ? leftBall : rightBall;
            if (bullet.targetSide && Math.hypot(bullet.x - target.x, bullet.y - target.y) < target.r + bullet.r) {
              if (isChessCrownActive(target)) return false;
              if (isWreckerJumpInvulnerable(target)) return false;
              target.health = Math.max(0, target.health - bullet.damage);
              if (bullet.burnDuration) {
                target.burnUntil = Math.max(target.burnUntil || 0, simTime + bullet.burnDuration);
              }
              if (bullet.kind === "dragonFireball") {
                for (let i = 0; i < 3; i++) {
                  const angle = Math.atan2(bullet.vy, bullet.vx) + Math.PI + (i - 1) * 0.42 + (Math.random() - 0.5) * 0.15;
                  const spd = 260 + Math.random() * 80;
                  localBullets.push({
                    ownerId: bullet.ownerId,
                    targetSide: bullet.targetSide,
                    kind: "dragonEmber",
                    x: bullet.x,
                    y: bullet.y,
                    vx: Math.cos(angle) * spd,
                    vy: Math.sin(angle) * spd,
                    r: 5,
                    damage: Math.max(1, Math.round(bullet.damage * 0.35)),
                    life: 1.2,
                    burnDuration: bullet.burnDuration ? Math.round(bullet.burnDuration * 0.5) : 400
                  });
                }
              }
              return false;
            }
            return true;
          });

          localMines = localMines.filter((mine) => {
            const enemy = mine.ownerSide === "left" ? rightBall : leftBall;
            const d = Math.hypot(mine.x - enemy.x, mine.y - enemy.y);
            if (mine.triggerTime) {
              if (simTime >= mine.triggerTime) {
                balls.forEach(ball => {
                  const db = Math.hypot(ball.x - mine.x, ball.y - mine.y);
                  if (db < balance.bomber.mineRadius + ball.r) {
                    if (isChessCrownActive(ball)) return;
                    if (isWreckerJumpInvulnerable(ball)) return;
                    const falloff = 1 - (db / (balance.bomber.mineRadius + ball.r));
                    ball.health = Math.max(0, ball.health - Math.max(MIN_DAMAGE, Math.round(balance.bomber.mineDamage * falloff)));
                    const angle = Math.atan2(ball.y - mine.y, ball.x - mine.x);
                    const force = balance.bomber.knockback * 25 * falloff;
                    if (!hasStringBounceGuard(ball)) {
                      ball.vx += Math.cos(angle) * force; ball.vy += Math.sin(angle) * force;
                    }
                  }
                });
                return false;
              }
              return true;
            }
            if (d < enemy.r + balance.bomber.mineTriggerDist) {
              mine.triggerTime = simTime + 150;
            }
            return true;
          });

          localCacti = localCacti.filter((cactus) => {
            cactus.life -= dt * 1000;
            if (cactus.life <= 0 || cactus.charges <= 0) return false;
            const growthProgress = Math.min(1, (simTime - cactus.createdTime) / balance.spore.growthDuration);
            cactus.r = cactus.targetR * growthProgress;

            balls.forEach((ball) => {
              const d = Math.hypot(ball.x - cactus.x, ball.y - cactus.y);
              const minD = ball.r + cactus.r;
              if (d > 0 && d < minD) {
                const nx = (ball.x - cactus.x) / d;
                const ny = (ball.y - cactus.y) / d;
                const overlap = minD - d;
                ball.x += nx * overlap;
                ball.y += ny * overlap;

                const dpNorm = ball.vx * nx + ball.vy * ny;
                if (dpNorm < 0) {
                  const tx = -ny, ty = nx;
                  const dpTan = ball.vx * tx + ball.vy * ty;
                  ball.vx = tx * dpTan - nx * dpNorm;
                  ball.vy = ty * dpTan - ny * dpNorm;
                }

                if (ball.side === cactus.ownerSide) {
                  ball.vx *= balance.spore.speedBoost;
                  ball.vy *= balance.spore.speedBoost;
                  if (ball.type === "spore") ball.hydraGlowStacks = Math.min(HYDRA_MAX_GLOW_STACKS, (ball.hydraGlowStacks || 0) + HYDRA_RAGE_PER_BOUNCE);
                } else {
                  localApplyDamage(ball, balance.spore.cactusDamage, `${ball.id}-cactus-${cactus.createdTime}`, simTime, 500);
                }
                cactus.charges--;
              }
            });
            return true;
          });

          const pendingLocalStrings = [];
          localStrings = localStrings.filter((str) => {
            str.life -= dt * 1000;
            if (str.life <= 0) return false;
            balls.forEach((ball) => {
              const dist = linePointDist(ball.x, ball.y, str.x1, str.y1, str.x2, str.y2);
              const stringBal = balance.stringWeb || BALANCE.stringWeb;
              if (ball.side === str.ownerSide) {
                if (ball.type !== "stringWeb" || dist >= ball.r + (stringBal.stringHitPadding || 0) || simTime < (ball.nextStringTrampolineAt || 0)) return;
                const A = ball.x - str.x1, B = ball.y - str.y1, C = str.x2 - str.x1, D = str.y2 - str.y1;
                const dot = A * C + B * D, lenSq = C * C + D * D;
                const param = lenSq ? clamp(dot / lenSq, 0, 1) : 0;
                const xx = str.x1 + param * C, yy = str.y1 + param * D;
                const speed = Math.hypot(ball.vx, ball.vy);
                const nextSpeed = Math.max(stringBal.trampolineMinSpeed || 300, speed * (stringBal.trampolineBoost || 1.4));
                const bounce = getStringBounceVelocity(ball, str, xx, yy, nextSpeed, simTime + str.createdTime);
                ball.vx = bounce.vx;
                ball.vy = bounce.vy;
                if (ball.lastBounceX !== undefined && ball.lastBounceX !== null) {
                  pendingLocalStrings.push({
                    x1: ball.lastBounceX,
                    y1: ball.lastBounceY,
                    x2: xx,
                    y2: yy,
                    ownerSide: ball.side,
                    createdTime: simTime,
                    life: stringBal.stringLifetime
                  });
                }
                ball.lastBounceX = xx;
                ball.lastBounceY = yy;
                ball.nextStringTrampolineAt = simTime + (stringBal.trampolineCooldown || 1100);
                ball.stringBounceWallBouncesLeft = 2;
                return;
              }
              if (dist < ball.r + (stringBal.stringHitPadding || 0)) {
                if (!str.insideIds) str.insideIds = {};
                if (str.insideIds[ball.id]) return;
                str.insideIds[ball.id] = true;
                localApplyDamage(ball, balance.stringWeb.stringDamage, `${ball.id}-string-${str.createdTime}`, 9999999);
              } else if (str.insideIds) {
                delete str.insideIds[ball.id];
              }
            });

            return true;
          });
          if (pendingLocalStrings.length) {
            localStrings.push(...pendingLocalStrings);
            const stringBal = balance.stringWeb || BALANCE.stringWeb;
            const maxStrings = stringBal.maxStrings || 10;
            const sides = [...new Set(pendingLocalStrings.map((str) => str.ownerSide))];
            sides.forEach((side) => {
              const ownerStrings = localStrings.filter((str) => str.ownerSide === side);
              while (ownerStrings.length > maxStrings) {
                const oldest = ownerStrings.sort((a, b) => a.createdTime - b.createdTime)[0];
                const index = localStrings.indexOf(oldest);
                if (index >= 0) localStrings.splice(index, 1);
                ownerStrings.splice(ownerStrings.indexOf(oldest), 1);
              }
            });
          }

          localVenomPools = localVenomPools.filter((pool) => {
            if (simTime >= pool.createdTime + pool.duration) return false;
            balls.forEach((ball) => {
              if (ball.side === pool.ownerSide) return;
              const dist = Math.hypot(ball.x - pool.x, ball.y - pool.y);
              if (dist < ball.r + pool.r) {
                localApplyDamage(ball, balance.spider.secDamage, `${ball.id}-venom-tick-${pool.createdTime}`, 250);
              }
            });
            return true;
          });

          // Headless portal projectile updates
          localPortalProjectiles = localPortalProjectiles.filter((proj) => {
            proj.x += proj.vx * dt;
            proj.y += proj.vy * dt;
            const pad = 18;
            let hit = false;
            let hitX = proj.x, hitY = proj.y;
            let wallSide = null;
            if (proj.x < pad) { hit = true; hitX = pad; wallSide = "left"; }
            else if (proj.x > ARENA_SIZE - pad) { hit = true; hitX = ARENA_SIZE - pad; wallSide = "right"; }
            else if (proj.y < pad) { hit = true; hitY = pad; wallSide = "top"; }
            else if (proj.y > ARENA_SIZE - pad) { hit = true; hitY = ARENA_SIZE - pad; wallSide = "bottom"; }
            
            if (hit) {
              const ownerPortals = localPortals.filter(p => p.ownerId === proj.ownerId);
              let portalType = "A";
              if (ownerPortals.length === 1) {
                if (ownerPortals[0].type === "A") portalType = "B";
              } else if (ownerPortals.length >= 2) {
                ownerPortals.sort((a, b) => a.createdTime - b.createdTime);
                const oldest = ownerPortals[0];
                localPortals = localPortals.filter(p => p !== oldest);
                portalType = oldest.type;
              }
              const newPortal = {
                x: hitX, y: hitY, side: wallSide, type: portalType,
                ownerId: proj.ownerId, createdTime: simTime, life: balance.portal.portalDuration
              };
              localPortals.push(newPortal);
              return false;
            }
            return true;
          });

          // Headless portals expiration updates
          localPortals = localPortals.filter((portal) => {
            portal.life -= dt * 1000;
            return portal.life > 0;
          });

          // Headless teleportation checks
          balls.forEach((ball) => {
            localPortals.forEach((p1) => {
              const p2 = localPortals.find(other => other.ownerId === p1.ownerId && other.type !== p1.type);
              if (!p2) return;
              const dist = Math.hypot(ball.x - p1.x, ball.y - p1.y);
              if (dist < ball.r + 14) {
                if (!ball.lastTeleportTime || ball.lastTeleportTime < simTime - 500) {
                  ball.x = p2.x;
                  ball.y = p2.y;
                  ball.lastTeleportTime = simTime;
                }
              }
            });
          });
        }

        if (leftBall.health <= 0 && rightBall.health > 0) { rightWins++; rightRemainingHpTotal += rightBall.health; }
        else if (rightBall.health <= 0 && leftBall.health > 0) { leftWins++; leftRemainingHpTotal += leftBall.health; }
        else { leftWins += 0.5; rightWins += 0.5; }
        totalDuration += simTime / 1000;
      }

      setTournamentResults({
        leftWins, rightWins,
        leftWinRate: ((leftWins / roundsCount) * 100).toFixed(1),
        rightWinRate: ((rightWins / roundsCount) * 100).toFixed(1),
        avgDuration: (totalDuration / roundsCount).toFixed(1),
        leftAvgHp: leftWins > 0 ? (leftRemainingHpTotal / Math.ceil(leftWins)).toFixed(1) : 0,
        rightAvgHp: rightWins > 0 ? (rightRemainingHpTotal / Math.ceil(rightWins)).toFixed(1) : 0,
        roundsCount
      });
      setSimulatingTournament(false);
    }, 50);
  };

  useEffect(() => {
    const canvas = canvasRef.current, ctx = canvas.getContext("2d"), game = gameRef.current;

    const resizeCanvas = () => {
      const scale = window.devicePixelRatio || 1, container = canvas.parentElement;
      const maxDisplaySize = 650;
      const displaySize = Math.min(container.clientWidth, maxDisplaySize);
      canvas.width = displaySize * scale; canvas.height = displaySize * scale;
      canvas.style.width = `${displaySize}px`; canvas.style.height = `${displaySize}px`;
      const virtScale = (displaySize / ARENA_SIZE) * scale;
      ctx.setTransform(virtScale, 0, 0, virtScale, 0, 0);
      game.width = ARENA_SIZE; game.height = ARENA_SIZE;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const applyDamage = (defender, amount, cooldownKey, currentTime, cooldown = 360) => {
      if (defender.constellationShieldedUntil && currentTime < defender.constellationShieldedUntil) return;
      if (isChessCrownActive(defender) && !cooldownKey.includes("chess-attack")) return;
      if (isWreckerJumpInvulnerable(defender)) return;
      if (game.damageCooldowns[cooldownKey] > currentTime) return;
      
      let finalAmount = Math.max(MIN_DAMAGE, Math.round(amount));

      defender.health = clamp(defender.health - finalAmount, 0, MAX_HEALTH);
      defender.lastDamageTakenAt = currentTime;
      game.damageCooldowns[cooldownKey] = currentTime + cooldown;
      game.screenShake = Math.max(game.screenShake || 0, Math.min(22, 6 + finalAmount * 1.5));
      defender.webHitFlashUntil = currentTime + 120;

      // Determine hit flash color based on source/weapon prefix in cooldownKey
      let flashColor = "#ef4444"; // Default red
      const keyLower = cooldownKey.toLowerCase();
      if (keyLower.includes("knife") || keyLower.includes("saber")) {
        flashColor = "#4ade80"; // Saber Ball green
      } else if (keyLower.includes("laser")) {
        flashColor = "#facc15"; // Laser Ball gold
      } else if (keyLower.includes("shield")) {
        flashColor = "#3b82f6"; // Shield Ball blue
      } else if (keyLower.includes("spider") || keyLower.includes("string") || keyLower.includes("joker") || keyLower.includes("gum")) {
        flashColor = "#d946ef"; // Spider/Web/Joker pink/magenta
      } else if (keyLower.includes("dragon") || keyLower.includes("ember") || keyLower.includes("fireball")) {
        flashColor = "#ff781f"; // Dragon orange
      } else if (keyLower.includes("shadow") || keyLower.includes("minion") || keyLower.includes("burst")) {
        flashColor = "#8b5cf6"; // Shadow purple
      } else if (keyLower.includes("trident") || keyLower.includes("dive")) {
        flashColor = "#38bdf8"; // Trident sky blue
      } else if (keyLower.includes("hammer")) {
        flashColor = "#f59e0b"; // Hammer gold/amber
      } else if (keyLower.includes("bomb") || keyLower.includes("explosion") || keyLower.includes("mine")) {
        flashColor = "#f97316"; // Bomber orange
      } else if (keyLower.includes("cactus") || keyLower.includes("spore") || keyLower.includes("hydra")) {
        flashColor = "#86efac"; // Sporer light green
      } else if (keyLower.includes("wrecker")) {
        flashColor = "#22c55e"; // Wrecker green
      } else if (keyLower.includes("mirror")) {
        flashColor = "#67e8f9"; // Mirror cyan
      } else if (keyLower.includes("feral") || keyLower.includes("claw") || keyLower.includes("pounce")) {
        flashColor = "#facc15";

      }
      defender.webHitFlashColor = flashColor;

      if (defender.type === "wrecker") {
        defender.rageStacks = (defender.rageStacks || 0) + 1;
        if (!defender.nextGrumbleAt || currentTime >= defender.nextGrumbleAt) {
          defender.nextGrumbleAt = currentTime + 650;
          game.floatingTexts = game.floatingTexts || [];
          game.floatingTexts.push({
            x: defender.x, y: defender.y - defender.r - 22, vy: -45,
            text: WRECKER_GRUMBLES[Math.floor(Math.random() * WRECKER_GRUMBLES.length)],
            color: "#86efac", life: 0.75, maxLife: 0.75
          });
        }
      }

      game.floatingTexts = game.floatingTexts || [];
      game.floatingTexts.push({
        x: defender.x + (Math.random() - 0.5) * 20,
        y: defender.y - defender.r - 5,
        vy: -60,
        text: `-${finalAmount}`,
        color: "#f87171",
        life: 0.8,
        maxLife: 0.8
      });

      // Play damage sound effects based on the source
      if (keyLower.includes("knife")) {
        playSound("knifeHit", 1, 80);
      } else if (keyLower.includes("wallspike")) {
        playSound("wallSpikeHit", 1, 100);
      } else if (keyLower.includes("spike")) {
        playSound("spikeHit", 1, 80);
      } else if (keyLower.includes("bullet")) {
        playSound("bulletHit", 1, 60);
      } else if (keyLower.includes("vampire")) {
        playSound("vampireDrain", 0.6, 100);
      } else if (keyLower.includes("laser")) {
        playSound("damage", 0.5, 80);
      } else if (keyLower.includes("shield")) {
        playSound("shieldBlock", 0.9, 100);
      } else if (keyLower.includes("spider") || keyLower.includes("fang")) {
        playSound("webHit", 0.9, 80);
      } else if (keyLower.includes("cactus")) {
        playSound("cactusHit", 1, 100);
      } else if (keyLower.includes("hammer")) {
        playSound("hammerHit", 1, 150);
      } else if (keyLower.includes("string")) {
        playSound("stringHit", 1, 100);
      } else if (keyLower.includes("arm-corner")) {
        playSound("armSlam", 1, 150);
      } else {
        playSound("damage", 1, 100);
      }
    };

    const getParticleBudget = (requested) => {
      if (!game.particles) game.particles = [];
      const room = Math.max(0, MAX_PARTICLES - game.particles.length);
      if (room <= 0) return 0;
      return Math.min(requested, room);
    };
    const canSpawnParticle = () => (game.particles?.length || 0) < MAX_PARTICLES;

    const spawnSparks = (x, y, color, count = 8) => {
      count = getParticleBudget(count);
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2, spd = 60 + Math.random() * 120;
        game.particles.push({
          x, y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
          color, radius: 1.5 + Math.random() * 2, life: 0.2 + Math.random() * 0.2, maxLife: 0.4
        });
      }
    };



    const spawnDust = (x, y, count = 4) => {
      count = getParticleBudget(count);
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2, spd = 20 + Math.random() * 40;
        game.particles.push({
          x, y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
          color: "rgba(226, 232, 240, 0.4)", radius: 2 + Math.random() * 2, life: 0.3 + Math.random() * 0.3, maxLife: 0.6
        });
      }
    };

    const spawnShieldSparks = (x, y, shieldAngle) => {
      const count = getParticleBudget(8);
      for (let i = 0; i < count; i++) {
        const a = shieldAngle + Math.PI + (Math.random() - 0.5) * 1.2, spd = 80 + Math.random() * 150;
        game.particles.push({
          x, y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
          color: "#60a5fa", radius: 2 + Math.random() * 1.5, life: 0.25 + Math.random() * 0.15, maxLife: 0.4
        });
      }
    };

    const spawnExplosionParticles = (x, y) => {
      const colors = ["#f97316", "#ef4444", "#eab308", "#64748b"];
      const count = getParticleBudget(25);
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2, spd = 50 + Math.random() * 150;
        game.particles.push({
          x, y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
          color: colors[Math.floor(Math.random() * colors.length)],
          radius: 3 + Math.random() * 4, life: 0.4 + Math.random() * 0.4, maxLife: 0.8
        });
      }
    };

    const pruneShadowMinions = () => {
      game.balls.forEach((owner) => {
        if (owner.type !== "shadow" || !owner.shadowMinions) return;
        const target = game.balls.find(o => o.id !== owner.id);
        const bal = game.balance.shadow || BALANCE.shadow;
        owner.shadowMinions = owner.shadowMinions.filter((minion) => {
          const alive = minion.health > 0 && game.simTime < minion.createdTime + bal.minionLife;
          if (!alive) {
            // Shadow burst explosion visual
            spawnSparks(minion.x, minion.y, "#8b5cf6", 14);
            playSound("armSlam", 0.5, 200);
            
            // Deal shadow burst damage to target if close
            if (target) {
              const d = Math.hypot(target.x - minion.x, target.y - minion.y);
              if (d <= target.r + 48) {
                applyDamage(target, 2, `${minion.id}-death-burst`, game.simTime, 300);
                target.shadowMarkedUntil = game.simTime + 1200;
                target.shadowMarkedBy = owner.id;
                if (!hasStringBounceGuard(target)) {
                  const angle = Math.atan2(target.y - minion.y, target.x - minion.x);
                  target.vx += Math.cos(angle) * 80;
                  target.vy += Math.sin(angle) * 80;
                }
                if (owner.side === "left") game.stats.left.damageDealt += 2;
                else game.stats.right.damageDealt += 2;
              }
            }
            return false;
          }
          return true;
        });
      });
    };


    const spawnDeathShatter = (defeated, currentTime) => {
      const config = BALL_TYPES[defeated.type] || BALL_TYPES.knife;
      const colors = [config.color, config.stroke, "#f8fafc", "#94a3b8"];
      const count = getParticleBudget(52);
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const spd = 80 + Math.random() * 320;
        const distance = Math.random() * defeated.r * 0.7;
        game.particles.push({
          x: defeated.x + Math.cos(a) * distance,
          y: defeated.y + Math.sin(a) * distance,
          vx: Math.cos(a) * spd,
          vy: Math.sin(a) * spd,
          color: colors[i % colors.length],
          radius: 2.5 + Math.random() * 4.5,
          life: 0.9 + Math.random() * 0.55,
          maxLife: 1.45,
          isShard: true,
          angle: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 9,
        });
      }
      game.floatingTexts = game.floatingTexts || [];
      game.floatingTexts.push({
        x: defeated.x,
        y: defeated.y - defeated.r - 18,
        vy: -38,
        text: "SHATTER",
        color: config.stroke,
        life: 1.1,
        maxLife: 1.1
      });
      game.deathEffectStarted = true;
      game.deathSlowMoUntil = currentTime + DEATH_SLOW_MO_DURATION;
      game.screenShake = Math.max(game.screenShake, 22);
      defeated.shattered = true;
      defeated.trail = [];
      playSound("explosion", 0.9, -120);
    };

    const spawnVampireCrosses = (vampire, target) => {
      if (game.particles.length < MAX_PARTICLES && Math.random() < 0.2) {
        const dx = target.x - vampire.x, dy = target.y - vampire.y, d = Math.hypot(dx, dy);
        const a = Math.atan2(dy, dx), speed = 120;
        game.particles.push({
          x: target.x - Math.cos(a) * target.r, y: target.y - Math.sin(a) * target.r,
          vx: -Math.cos(a) * speed, vy: -Math.sin(a) * speed,
          color: "#fca5a5", radius: 3, life: d / speed, maxLife: d / speed, isCross: true
        });
      }
    };

    const getShieldBeamBlock = (shieldBall, x1, y1, x2, y2, beamWidth = 0) => {
      if (!shieldBall || shieldBall.type !== "shield") return null;
      if (shieldBall.shieldState === "held") {
        const d = linePointDist(shieldBall.x, shieldBall.y, x1, y1, x2, y2);
        if (d > shieldBall.r + 8 + beamWidth / 2) return null;
        const impactAngle = Math.atan2(y1 - shieldBall.y, x1 - shieldBall.x);
        let diff = Math.abs(impactAngle - shieldBall.shieldAngle);
        while (diff > Math.PI) diff = Math.abs(diff - Math.PI * 2);
        if (diff > game.balance.shield.arcWidth / 2) return null;
        const shieldR = shieldBall.r + 8;
        const impactX = shieldBall.x + Math.cos(shieldBall.shieldAngle) * shieldR;
        const impactY = shieldBall.y + Math.sin(shieldBall.shieldAngle) * shieldR;
        return { x: impactX, y: impactY, angle: shieldBall.shieldAngle };
      }

      if (shieldBall.shieldState !== "thrown" && shieldBall.shieldState !== "returning") return null;
      const cx = shieldBall.shieldX;
      const cy = shieldBall.shieldY;
      const R = 24;
      const A = cx - x1, B = cy - y1, C = x2 - x1, D = y2 - y1;
      const dot = A * C + B * D, lenSq = C * C + D * D;
      let param = -1;
      if (lenSq !== 0) param = dot / lenSq;
      let xx, yy;
      if (param < 0) { xx = x1; yy = y1; }
      else if (param > 1) { xx = x2; yy = y2; }
      else { xx = x1 + param * C; yy = y1 + param * D; }
      const d = Math.hypot(cx - xx, cy - yy);
      if (d > R + beamWidth / 2) return null;
      const angleOfBeam = Math.atan2(D, C);
      const h = Math.sqrt(Math.max(0, R * R - d * d));
      const impactX = xx - Math.cos(angleOfBeam) * h;
      const impactY = yy - Math.sin(angleOfBeam) * h;
      const normalAngle = Math.atan2(impactY - cy, impactX - cx);
      return { x: impactX, y: impactY, angle: normalAngle };
    };

    const registerShieldGuardHit = (shieldBall, impactAngle, currentTime) => {
      if (!shieldBall || shieldBall.type !== "shield" || shieldBall.shieldState !== "held") return;
      shieldBall.shieldGuardHits = (shieldBall.shieldGuardHits || 0) + 1;
      if (shieldBall.shieldGuardHits < SHIELD_GUARD_HITS) return;

      shieldBall.shieldGuardHits = 0;
      shieldBall.shieldState = "dropped";
      shieldBall.shieldX = shieldBall.x + Math.cos(impactAngle) * (shieldBall.r + 8);
      shieldBall.shieldY = shieldBall.y + Math.sin(impactAngle) * (shieldBall.r + 8);
      shieldBall.shieldVx = 0;
      shieldBall.shieldVy = 0;
      shieldBall.shieldThrownUntil = 0;
      shieldBall.shieldNextHitAt = 0;
      shieldBall.shieldSpinAngle = 0;
      shieldBall.shieldBonusDamage = 0;
      shieldBall.shieldLaserPierceHits = 0;
      shieldBall.nextThrowAt = currentTime + game.balance.shield.cooldown;
      spawnSparks(shieldBall.shieldX, shieldBall.shieldY, "#facc15", 10);
      spawnDust(shieldBall.shieldX, shieldBall.shieldY, 6);
    };

    const handleWallBounce = (ball) => {
      const pad = 18; let bounced = false, bx = ball.x, by = ball.y;
      let sideHit = null;
      if (ball.x - ball.r < pad) { ball.x = pad + ball.r; ball.vx = Math.abs(ball.vx); bounced = true; bx = pad; sideHit = "left"; }
      if (ball.x + ball.r > game.width - pad) { ball.x = game.width - pad - ball.r; ball.vx = -Math.abs(ball.vx); bounced = true; bx = game.width - pad; sideHit = "right"; }
      if (ball.y - ball.r < pad) { ball.y = pad + ball.r; ball.vy = Math.abs(ball.vy); bounced = true; by = pad; sideHit = "top"; }
      if (ball.y + ball.r > game.height - pad) { ball.y = game.height - pad - ball.r; ball.vy = -Math.abs(ball.vy); bounced = true; by = game.height - pad; sideHit = "bottom"; }
      if (bounced) {
        spawnDust(bx, by, 5);
        if (hasStringBounceGuard(ball)) {
          ball.stringBounceWallBouncesLeft = Math.max(0, (ball.stringBounceWallBouncesLeft || 0) - 1);
          if (ball.stringBounceWallBouncesLeft > 0) {
            game.floatingTexts = game.floatingTexts || [];
            game.floatingTexts.push({
              x: ball.x, y: ball.y - ball.r - 18, vy: -45,
              text: `GUARD ${ball.stringBounceWallBouncesLeft}`, color: "#f0abfc", life: 0.55, maxLife: 0.55
            });
          }
        }
        if (ball.type === "wrecker") {
          ball.consecutiveWallBounces = (ball.consecutiveWallBounces || 0) + 1;
          ball.rageStacks = (ball.rageStacks || 0) + 1;
          if (!ball.nextGrumbleAt || game.simTime >= ball.nextGrumbleAt) {
            ball.nextGrumbleAt = game.simTime + 650;
            game.floatingTexts = game.floatingTexts || [];
            game.floatingTexts.push({
              x: ball.x, y: ball.y - ball.r - 22, vy: -45,
              text: WRECKER_GRUMBLES[Math.floor(Math.random() * WRECKER_GRUMBLES.length)],
              color: "#86efac", life: 0.75, maxLife: 0.75
            });
          }
          const bal = game.balance.wrecker || BALANCE.wrecker;
          const boost = bal.bounceBoost || 1.14;
          const maxBounceSpeed = bal.maxBounceSpeed || 340;
          const speed = Math.hypot(ball.vx, ball.vy);
          if (speed > 0) {
            const nextSpeed = Math.min(maxBounceSpeed, Math.max(235, speed * boost));
            ball.vx = (ball.vx / speed) * nextSpeed;
            ball.vy = (ball.vy / speed) * nextSpeed;
          }
          spawnSparks(ball.x, ball.y, "#22c55e", Math.min(16, 5 + (ball.rageStacks || 0)));
        }
        if (ball.type === "constellation") {
          game.constellationStars = game.constellationStars || [];
          const addStar = (offsetX = 0, offsetY = 0) => {
            const myStars = game.constellationStars.filter(s => s.ownerId === ball.id);
            if (myStars.length >= 5) {
              myStars.sort((a, b) => a.createdAt - b.createdAt);
              const oldest = myStars[0];
              game.constellationStars = game.constellationStars.filter(s => s.id !== oldest.id);
            }
            game.constellationStars.push({
              id: Math.random().toString(),
              ownerId: ball.id,
              x: clamp(ball.x + offsetX, pad + 10, game.width - pad - 10),
              y: clamp(ball.y + offsetY, pad + 10, game.height - pad - 10),
              createdAt: game.simTime,
            });
          };

          if (ball.constellationUltActive && game.simTime < ball.constellationUltUntil) {
            addStar(0, 0);
            const angle = Math.random() * Math.PI * 2;
            const dist = 25 + Math.random() * 15;
            addStar(Math.cos(angle) * dist, Math.sin(angle) * dist);
            spawnSparks(ball.x, ball.y, "#facc15", 16);
          } else {
            addStar(0, 0);
            spawnSparks(ball.x, ball.y, "#facc15", 8);
          }
          playSound("wallBounce", 0.8, 140);
        }
        if (ball.type === "fireSkull") {
          const fsBal = game.balance.fireSkull || BALANCE.fireSkull;
          const carIsRunning = (game.fireCars || []).some((car) => car.ownerId === ball.id);
          if (!carIsRunning && game.simTime >= (ball.fsNextRoadAt || 0)) {
            const wallPoint = {
              x: sideHit === "left" ? 0 : sideHit === "right" ? game.width : bx,
              y: sideHit === "top" ? 0 : sideHit === "bottom" ? game.height : by,
            };
            if (!ball.fsRoadActive) {
            // First wall bounce: mark start
            ball.fsLastWallX = bx;
            ball.fsLastWallY = by;
            ball.fsRoadActive = true;
            ball.fsRoadSegments = [{ x: bx, y: by }];
            ball.fsRoadStartWallPoint = wallPoint;
            playSound("repulsorCharge");
            game.floatingTexts = game.floatingTexts || [];
            game.floatingTexts.push({
              x: ball.x, y: ball.y - ball.r - 22, vy: -45,
              text: "ROAD START!", color: "#f97316", life: 0.75, maxLife: 0.75
            });
            spawnSparks(bx, by, "#f97316", 12);
          } else {
            // Complete the road only after enough actual travel. Short bounce
            // segments remain active and continue drawing to the next bounce.
            const segmentCount = ball.fsRoadSegments ? ball.fsRoadSegments.length : 0;
            if (segmentCount > 0) {
              const roadPath = [...ball.fsRoadSegments, { x: bx, y: by }];
              const renderRoadPath = roadPath.map((point) => ({ ...point }));
              renderRoadPath[0] = ball.fsRoadStartWallPoint || renderRoadPath[0];
              renderRoadPath[renderRoadPath.length - 1] = wallPoint;
              const totalDist = roadPath.slice(1).reduce((sum, point, index) => {
                const previous = roadPath[index];
                return sum + Math.hypot(point.x - previous.x, point.y - previous.y);
              }, 0);
              const minRoadLength = Math.max(520, fsBal.minRoadLength || 520);
              if (totalDist >= minRoadLength) {
                const startPoint = roadPath[0];
                game.fireCars = game.fireCars || [];
                game.fireCars.push({
                  id: `${ball.id}-car-${game.simTime}`,
                  ownerId: ball.id,
                  ownerSide: ball.side,
                  startX: startPoint.x,
                  startY: startPoint.y,
                  endX: roadPath[roadPath.length - 1].x,
                  endY: roadPath[roadPath.length - 1].y,
                  path: roadPath,
                  renderPath: renderRoadPath,
                  pathLength: totalDist,
                  distanceTravelled: 0,
                  pass: 1,
                  maxPasses: fsBal.carPasses || 5,
                  x: startPoint.x,
                  y: startPoint.y,
                  vx: 0,
                  vy: 0,
                  radius: fsBal.carRadius || 40,
                  progress: 0,
                  speed: fsBal.carSpeed || 950,
                  damage: Math.max(8, fsBal.carDamage || 8),
                  createdTime: game.simTime,
                });
                playSound("megaLeap"); // Roaring engine sound substitute
                game.screenShake = Math.max(game.screenShake || 0, 18);
                game.floatingTexts = game.floatingTexts || [];
                game.floatingTexts.push({
                  x: (startPoint.x + bx) / 2, y: (startPoint.y + by) / 2 - 22, vy: -55,
                  text: "FIRE CAR SUMMON!", color: "#ef4444", life: 0.9, maxLife: 0.9
                });
                // Spawn big fire blast particles at start and end
                spawnSparks(startPoint.x, startPoint.y, "#ef4444", 20);
                spawnSparks(bx, by, "#ef4444", 20);
                ball.fsLastWallX = null;
                ball.fsLastWallY = null;
                ball.fsRoadActive = false;
                ball.fsRoadSegments = [];
                ball.fsRoadStartWallPoint = null;
              } else {
                ball.fsRoadSegments.push({ x: bx, y: by });
                game.floatingTexts = game.floatingTexts || [];
                game.floatingTexts.push({
                  x: bx, y: by - 18, vy: -35,
                  text: "ROAD EXTEND!", color: "#fb923c", life: 0.65, maxLife: 0.65
                });
              }
            }
            }
          }
        }
        // Wall goo trigger removed. Black Spider now spits a slime web pool via its secondary skill.
        if (ball.bsSlamWallUntil && game.simTime <= ball.bsSlamWallUntil) {
          const bsBal = game.balance.blackSpider || BALANCE.blackSpider;
          applyDamage(ball, bsBal.slamWallDamage || 18, `${ball.bsSlamWallSourceId || ball.id}-bs-slam-wall`, game.simTime, 500);
          ball.bsSlamWallUntil = 0;
          ball.bsSlamWallSourceId = null;
          spawnSparks(ball.x, ball.y, "#0f172a", 20);
          game.screenShake = Math.max(game.screenShake, 18);
          playSound("explosion", 1.0, 90);
          game.floatingTexts = game.floatingTexts || [];
          game.floatingTexts.push({
            x: ball.x, y: ball.y - ball.r - 22, vy: -55,
            text: "SLAMMED!", color: "#cbd5e1", life: 1.0, maxLife: 1.0
          });
        }
        if (ball.armThrowWallUntil && game.simTime <= ball.armThrowWallUntil) {
          applyDamage(ball, ARM_THROW_WALL_DAMAGE, `${ball.armThrowWallSourceId || ball.id}-arm-throw-wall`, game.simTime, 500);
          ball.armThrowWallUntil = 0;
          ball.armThrowWallSourceId = null;
          spawnSparks(ball.x, ball.y, "#ef4444", 14);
          game.screenShake = Math.max(game.screenShake, 14);
        }
        if (ball.chaosControlledUntil && game.simTime <= ball.chaosControlledUntil + 250 && !ball.chaosSlamDone) {
          const axisMatched = (ball.chaosControlAxis === "vertical" && (sideHit === "top" || sideHit === "bottom")) ||
            (ball.chaosControlAxis === "horizontal" && (sideHit === "left" || sideHit === "right"));
          if (axisMatched) {
            const chaosBal = game.balance.chaos || BALANCE.chaos;
            applyDamage(ball, chaosBal.slamDamage || 6, `${ball.chaosControllerId || "chaos"}-chaos-wall-slam`, game.simTime, 350);
            const ownerStats = ball.chaosControllerSide === "left" ? game.stats.left : game.stats.right;
            if (ownerStats) {
              ownerStats.damageDealt += Math.max(MIN_DAMAGE, Math.round(chaosBal.slamDamage || 6));
              ownerStats.hitsLanded++;
            }
            ball.chaosSlamDone = true;
            ball.chaosControlledUntil = 0;
            ball.chaosControlHoldUntil = 0;
            const radiusBounce = chaosBal.radiusBounce || 140;
            const tangent = sideHit === "top" || sideHit === "bottom" ? (Math.random() > 0.5 ? 1 : -1) : 0;
            const verticalTangent = sideHit === "left" || sideHit === "right" ? (Math.random() > 0.5 ? 1 : -1) : 0;
            if (tangent) ball.vx += tangent * radiusBounce;
            if (verticalTangent) ball.vy += verticalTangent * radiusBounce;
            ball.chaosDraggedUntil = game.simTime + 220;
            game.screenShake = Math.max(game.screenShake, 13);
            spawnSparks(ball.x, ball.y, "#fdba74", 18);
            spawnDust(ball.x, ball.y, 10);
          }
        }
        if (ball.jokerPulledUntil && game.simTime <= ball.jokerPulledUntil + 160) {
          const activeGum = (game.jokerThreads || []).find((thread) => thread.state === "pulling" && thread.targetId === ball.id);
          
          if (game.simTime >= (ball.jokerNextSlamAllowedAt || 0)) {
            ball.jokerNextSlamAllowedAt = game.simTime + 120; // 120ms invulnerability window
            
            let slamCount = activeGum ? (activeGum.slamCount || 0) : 0;
            if (slamCount < 6) {
              if (activeGum) activeGum.slamCount = slamCount + 1;
              
              const isNudge = Math.random() < 0.35;
              const slamDmg = isNudge ? 2.5 : 5.0;

              const cooldownKey = `${ball.jokerPullOwnerId || "joker"}-joker-wall-pull`;
              applyDamage(ball, slamDmg, cooldownKey, game.simTime, 260);
              
              const ownerStats = ball.jokerPullOwnerSide === "left" ? game.stats.left : game.stats.right;
              if (ownerStats) {
                ownerStats.damageDealt += Math.max(MIN_DAMAGE, Math.round(slamDmg));
                ownerStats.hitsLanded++;
              }
              
              ball.webHitFlashUntil = game.simTime + 180;
              game.screenShake = Math.max(game.screenShake, 10);
              spawnSparks(ball.x, ball.y, "#f9a8d4", 16);
              playSound("wallBounce", 1.0, 90);

              game.floatingTexts = game.floatingTexts || [];
              game.floatingTexts.push({
                x: ball.x, y: ball.y - ball.r - 20, vy: -50,
                text: isNudge ? "NUDGED! -2.5" : "WALL SLAM! -5",
                color: isNudge ? "#22d3ee" : "#fb7185",
                life: 0.6, maxLife: 0.6
              });
            }
          }

          if (activeGum) {
            activeGum.pullIndex = Math.max(0, (activeGum.pullIndex || 0) - 1);
            activeGum.lastWallNudgeAt = game.simTime;
          }
          const escape = 260;
          if (sideHit === "left") ball.vx = Math.abs(ball.vx) + escape;
          else if (sideHit === "right") ball.vx = -Math.abs(ball.vx) - escape;
          else if (sideHit === "top") ball.vy = Math.abs(ball.vy) + escape;
          else if (sideHit === "bottom") ball.vy = -Math.abs(ball.vy) - escape;
        }
        if ((gameStarted || game.combatStarted) && game.simTime >= OPENING_SKILL_DELAY) {
          if (ball.type === "stringWeb") {
            if (!game.strings) game.strings = [];
            if (ball.lastBounceX !== undefined && ball.lastBounceX !== null) {
              const newString = {
                x1: ball.lastBounceX,
                y1: ball.lastBounceY,
                x2: bx,
                y2: by,
                ownerSide: ball.side,
                createdTime: game.simTime,
                life: game.balance.stringWeb.stringLifetime
              };
              game.strings.push(newString);
              const maxStrings = game.balance.stringWeb.maxStrings || 10;
              const ownerStrings = game.strings.filter((str) => str.ownerSide === ball.side);
              if (ownerStrings.length > maxStrings) {
                const oldest = ownerStrings.sort((a, b) => a.createdTime - b.createdTime)[0];
                game.strings = game.strings.filter((str) => str !== oldest);
              }
              playSound("stringTwang");
            }
            ball.lastBounceX = bx;
            ball.lastBounceY = by;
          } else {
            playSound("wallBounce", 0.8, 120);
          }
        } else {
          playSound("wallBounce", 0.8, 120);
        }
      }
    };

    const resolveBallCollision = (a, b) => {
      const dx = b.x - a.x, dy = b.y - a.y, dist = Math.hypot(dx, dy), minDist = a.r + b.r;
      if (dist === 0 || dist >= minDist) return false;

      // Disrupt Fire Skull road if it hits opponent
      if (a.type === "fireSkull" && a.fsRoadActive) {
        a.fsLastWallX = null;
        a.fsLastWallY = null;
        a.fsRoadActive = false;
        a.fsRoadSegments = [];
        a.fsRoadStartWallPoint = null;
        spawnSparks(a.x, a.y, "#475569", 12);
        game.floatingTexts = game.floatingTexts || [];
        game.floatingTexts.push({
          x: a.x, y: a.y - a.r - 22, vy: -45,
          text: "ROAD DISRUPTED!", color: "#94a3b8", life: 0.75, maxLife: 0.75
        });
      }
      if (b.type === "fireSkull" && b.fsRoadActive) {
        b.fsLastWallX = null;
        b.fsLastWallY = null;
        b.fsRoadActive = false;
        b.fsRoadSegments = [];
        b.fsRoadStartWallPoint = null;
        spawnSparks(b.x, b.y, "#475569", 12);
        game.floatingTexts = game.floatingTexts || [];
        game.floatingTexts.push({
          x: b.x, y: b.y - b.r - 22, vy: -45,
          text: "ROAD DISRUPTED!", color: "#94a3b8", life: 0.75, maxLife: 0.75
        });
      }

      if (a.type === "vampire" || b.type === "vampire") return true;

      const nx = dx / dist, ny = dy / dist, overlap = minDist - dist;
      
      const aAnchored = a.type === "chess" && (a.chessState === "activeCrown" || a.chessState === "movingToCenter" || a.chessState === "attacking");
      const bAnchored = b.type === "chess" && (b.chessState === "activeCrown" || b.chessState === "movingToCenter" || b.chessState === "attacking");
      
      if (aAnchored) {
        b.x += overlap * nx; b.y += overlap * ny;
      } else if (bAnchored) {
        a.x -= overlap * nx; a.y -= overlap * ny;
      } else {
        a.x -= (overlap / 2) * nx; a.y -= (overlap / 2) * ny;
        b.x += (overlap / 2) * nx; b.y += (overlap / 2) * ny;
      }

      const tx = -ny, ty = nx;
      const dpTanA = a.vx * tx + a.vy * ty, dpTanB = b.vx * tx + b.vy * ty;
      const dpNormA = a.vx * nx + a.vy * ny, dpNormB = b.vx * nx + b.vy * ny;
      
      if (aAnchored) {
        b.vx = tx * dpTanB - nx * dpNormB;
        b.vy = ty * dpTanB - ny * dpNormB;
      } else if (bAnchored) {
        a.vx = tx * dpTanA - nx * dpNormA;
        a.vy = ty * dpTanA - ny * dpNormA;
      } else {
        const mA = (dpNormA * (a.mass - b.mass) + 2 * b.mass * dpNormB) / (a.mass + b.mass);
        const mB = (dpNormB * (b.mass - a.mass) + 2 * a.mass * dpNormA) / (a.mass + b.mass);
        a.vx = tx * dpTanA + nx * mA; a.vy = ty * dpTanA + ny * mA;
        b.vx = tx * dpTanB + nx * mB; b.vy = ty * dpTanB + ny * mB;
      }
      return true;
    };

    const updateWrecker = (ball, target, currentTime, stepDt) => {
      const bal = game.balance.wrecker || BALANCE.wrecker;

      // Dynamically set physical hitbox size based on rage stacks and mega enlargement
      const sizePerRage = bal.sizePerRage || 0.018;
      const maxRageSizeScale = bal.maxRageSizeScale || 1.2;
      let sizeScale = Math.min(maxRageSizeScale, 1 + Math.min(12, ball.rageStacks || 0) * sizePerRage);
      if (ball.wreckerEnlargedUntil > 0 && currentTime < ball.wreckerEnlargedUntil) {
        ball.r = ball.originalRadius * (bal.megaSizeScale || 1.3);
      } else {
        ball.r = ball.originalRadius * sizeScale;
      }
      
      // Handle dazed cooldown from miss or landing
      if (ball.wreckerState === "cooldown") {
        if (currentTime >= ball.wreckerCooldownUntil) {
          ball.wreckerState = "normal";
          const speed = Math.hypot(ball.vx, ball.vy);
          const recoverSpeed = bal.recoverySpeed || 230;
          if (speed > 0) {
            ball.vx = (ball.vx / speed) * recoverSpeed;
            ball.vy = (ball.vy / speed) * recoverSpeed;
          } else {
            const angle = Math.random() * Math.PI * 2;
            ball.vx = Math.cos(angle) * recoverSpeed;
            ball.vy = Math.sin(angle) * recoverSpeed;
          }
        } else {
          // Slow recovery velocity towards target
          const angle = Math.atan2(target.y - ball.y, target.x - ball.x);
          ball.vx = Math.cos(angle) * 110;
          ball.vy = Math.sin(angle) * 110;
        }
        return;
      }

      if (ball.wreckerState === "leaping") {
        ball.vx = 0;
        ball.vy = 0;
        
        const timeLeft = ball.wreckerLeapUntil - currentTime;
        const leapDuration = bal.leapDuration || 680;
        
        if (timeLeft > 200) {
          const leadTime = bal.leapLeadTime || 0.38;
          let tx = target.x + target.vx * leadTime;
          let ty = target.y + target.vy * leadTime;
          const pad = 18 + ball.r;
          tx = Math.max(pad, Math.min(game.width - pad, tx));
          ty = Math.max(pad, Math.min(game.height - pad, ty));
          ball.wreckerTargetX = tx;
          ball.wreckerTargetY = ty;
        }

        const elapsed = currentTime - ball.wreckerLeapStart;
        const rawProgress = clamp(elapsed / leapDuration, 0, 1);
        const progress = rawProgress < 0.5
          ? 2 * rawProgress * rawProgress
          : 1 - Math.pow(-2 * rawProgress + 2, 2) / 2;
        ball.x = ball.wreckerStartX + (ball.wreckerTargetX - ball.wreckerStartX) * progress;
        ball.y = ball.wreckerStartY + (ball.wreckerTargetY - ball.wreckerStartY) * progress;

        if (currentTime >= ball.wreckerLeapUntil) {
          ball.wreckerState = "cooldown";
          ball.wreckerCooldownUntil = currentTime + bal.cooldown;
          
          // Landing rebound so Wrecker keeps its heavy bounce after impact.
          const angle = Math.atan2(ball.y - target.y, ball.x - target.x);
          const recoil = bal.landingRecoil || 240;
          ball.vx = Math.cos(angle) * recoil;
          ball.vy = Math.sin(angle) * recoil;

          // Shockwave effects
          const damage = ball.isMegaLeap ? bal.megaLeapDamage : bal.leapDamage;
          const radius = ball.isMegaLeap ? bal.megaShockwaveRadius : bal.shockwaveRadius;
          const dist = Math.hypot(target.x - ball.x, target.y - ball.y);
          if (dist < radius) {
            applyDamage(target, damage, `${ball.id}-leap-slam`, currentTime, 0);
            const knockAngle = Math.atan2(target.y - ball.y, target.x - ball.x);
            if (!hasStringBounceGuard(target)) {
              target.vx += Math.cos(knockAngle) * bal.knockbackForce;
              target.vy += Math.sin(knockAngle) * bal.knockbackForce;
              target.knockbackActiveUntil = currentTime + 600;
            }
            const ownerStats = ball.side === "left" ? game.stats.left : game.stats.right;
            if (ownerStats) {
              ownerStats.damageDealt += Math.max(MIN_DAMAGE, Math.round(damage));
              ownerStats.hitsLanded++;
            }
          }

          game.screenShake = Math.max(game.screenShake, ball.isMegaLeap ? 14 : 8);
          playSound("explosion");

          // Shockwave rings/particles
          const color = ball.isMegaLeap ? "#fbbf24" : "#a855f7";
          const shockwaveParticles = getParticleBudget(16);
          for (let i = 0; i < shockwaveParticles; i++) {
            const angle = (i / 16) * Math.PI * 2;
            game.particles.push({
              x: ball.x, y: ball.y,
              vx: Math.cos(angle) * (ball.isMegaLeap ? 220 : 150),
              vy: Math.sin(angle) * (ball.isMegaLeap ? 220 : 150),
              color, radius: ball.isMegaLeap ? 4.5 : 3, life: 0.45, maxLife: 0.45
            });
          }

          ball.rageStacks = 0;
          ball.consecutiveWallBounces = 0;
          ball.isMegaLeap = false;
          ball.wreckerEnlargedUntil = 0;
        }
        return;
      }

      if (ball.wreckerState === "normal") {
        const leapCooldown = bal.leapCooldown !== undefined ? bal.leapCooldown : 5000;
        if ((ball.rageStacks || 0) >= bal.rageRequired && currentTime >= (ball.wreckerNextLeapAllowedUntil || 0) && canStartSkillConnection(ball, target, game.balls, currentTime)) {
          ball.wreckerState = "leaping";
          ball.wreckerLeapStart = currentTime;
          const leapDuration = bal.leapDuration || 680;
          ball.wreckerLeapUntil = currentTime + leapDuration;
          ball.wreckerNextLeapAllowedUntil = currentTime + leapDuration + leapCooldown;
          ball.wreckerStartX = ball.x;
          ball.wreckerStartY = ball.y;

          const leadTime = bal.leapLeadTime || 0.38;
          let tx = target.x + target.vx * leadTime;
          let ty = target.y + target.vy * leadTime;
          const pad = 18 + ball.r;
          tx = Math.max(pad, Math.min(game.width - pad, tx));
          ty = Math.max(pad, Math.min(game.height - pad, ty));
          ball.wreckerTargetX = tx;
          ball.wreckerTargetY = ty;
          ball.vx = 0;
          ball.vy = 0;
          playSound("jump");

          if (ball.rageStacks >= bal.megaRageRequired || ball.consecutiveWallBounces >= 10) {
            ball.isMegaLeap = true;
            ball.wreckerEnlargedUntil = ball.wreckerLeapUntil;
          }
        } else {
          const pushCooldown = bal.pushCooldown !== undefined ? bal.pushCooldown : 1600;
          const pushRange = bal.pushRange !== undefined ? bal.pushRange : 38;
          const pushForce = bal.pushForce !== undefined ? bal.pushForce : 600;
          const pushDamage = bal.pushDamage !== undefined ? bal.pushDamage : 7;

          if (currentTime >= (ball.wreckerPushCooldownUntil || 0)) {
            const dist = Math.hypot(target.x - ball.x, target.y - ball.y);
            if (dist < target.r + ball.r + pushRange && canStartSkillConnection(ball, target, game.balls, currentTime)) {
              ball.wreckerPushCooldownUntil = currentTime + pushCooldown;
              applyDamage(target, pushDamage, `${ball.id}-ground-push`, currentTime, 0);

              const angle = Math.atan2(target.y - ball.y, target.x - ball.x);
              if (!hasStringBounceGuard(target)) {
                target.vx = Math.cos(angle) * pushForce;
                target.vy = Math.sin(angle) * pushForce;
                target.knockbackActiveUntil = currentTime + 600;
              }
              const ownerStats = ball.side === "left" ? game.stats.left : game.stats.right;
              if (ownerStats) {
                ownerStats.damageDealt += Math.max(MIN_DAMAGE, Math.round(pushDamage));
                ownerStats.hitsLanded++;
              }
              ball.vx -= Math.cos(angle) * 120;
              ball.vy -= Math.sin(angle) * 120;
              ball.rageStacks = Math.max(0, (ball.rageStacks || 0) - 1);
              spawnSparks(target.x, target.y, "#86efac", 8);
              game.floatingTexts = game.floatingTexts || [];
              game.floatingTexts.push({
                x: ball.x, y: ball.y - ball.r - 18, vy: -45,
                text: "GROUND PUSH", color: "#86efac", life: 0.65, maxLife: 0.65
              });
              playSound("hammerHit");
            }
          }
        }
      }
    };

    const updateVampire = (vampire, target, currentTime) => {
      if (isChessCrownActive(target)) return;
      const isLatched = vampire.latchedTo === target.id && vampire.latchUntil > currentTime;
      if (!isLatched) {
        if (vampire.latchedTo === target.id) {
          vampire.latchedTo = null;
          const pushAngle = Math.atan2(vampire.y - target.y, vampire.x - target.x);
          const pushForce = 480;
          vampire.vx = Math.cos(pushAngle) * pushForce;
          vampire.vy = Math.sin(pushAngle) * pushForce;
          target.vx = -Math.cos(pushAngle) * pushForce;
          target.vy = -Math.sin(pushAngle) * pushForce;
          spawnSparks(vampire.x, vampire.y, "#f87171", 10);
          spawnDust(vampire.x, vampire.y, 6);
        }

        const dist = distance(vampire, target);
        const latchLimit = vampire.r + target.r + game.balance.vampire.latchDistance;
        if (dist >= latchLimit) {
          vampire.hasStuck = false;
        }

        if (dist < latchLimit && !vampire.hasStuck && canStartSkillConnection(vampire, target, game.balls, currentTime)) {
          vampire.latchedTo = target.id;
          vampire.latchUntil = currentTime + game.balance.vampire.latchDuration;
          vampire.hasStuck = true;
          vampire.nextDrainAt = currentTime;
          playSound("vampireLatch");
        }
        return;
      }

      const angle = Math.atan2(vampire.y - target.y, vampire.x - target.x);
      const attachDistance = vampire.r + target.r - 8;
      vampire.x = target.x + Math.cos(angle) * attachDistance;
      vampire.y = target.y + Math.sin(angle) * attachDistance;
      vampire.vx = target.vx; vampire.vy = target.vy;

      if (vampire.nextDrainAt <= currentTime) {
        if (isWreckerJumpInvulnerable(target)) {
          vampire.nextDrainAt = currentTime + game.balance.vampire.tickCooldown;
          return;
        }
        const drainAmount = Math.max(MIN_DAMAGE, game.balance.vampire.drainPerTick);
        target.health = clamp(target.health - drainAmount, 0, MAX_HEALTH);
        vampire.health = clamp(vampire.health + game.balance.vampire.healPerTick, 0, MAX_HEALTH);
        
        if (vampire.side === "left") {
          game.stats.left.damageDealt += drainAmount;
          game.stats.left.healed += game.balance.vampire.healPerTick;
        } else {
          game.stats.right.damageDealt += drainAmount;
          game.stats.right.healed += game.balance.vampire.healPerTick;
        }
        
        game.floatingTexts = game.floatingTexts || [];
        game.floatingTexts.push({
          x: target.x + (Math.random() - 0.5) * 16, y: target.y - target.r - 5, vy: -60,
          text: `-${drainAmount}`, color: "#f87171", life: 0.8, maxLife: 0.8
        });
        game.floatingTexts.push({
          x: vampire.x + (Math.random() - 0.5) * 16, y: vampire.y - vampire.r - 5, vy: -60,
          text: `+${game.balance.vampire.healPerTick}`, color: "#34d399", life: 0.8, maxLife: 0.8
        });

        playSound("vampireDrain", 0.6, 50);
        vampire.nextDrainAt = currentTime + game.balance.vampire.tickCooldown;
      }
    };

    const updateArm = (armBall, target, currentTime, stepDt) => {
      if (isChessCrownActive(target)) return;
      const bal = game.balance;

      if (armBall.armState === "elbow_dropping") {
        const duration = Math.max(1, armBall.armStateUntil - (armBall.armDropStartAt || currentTime));
        const progress = clamp((currentTime - (armBall.armDropStartAt || currentTime)) / duration, 0, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const arc = Math.sin(progress * Math.PI) * 58;
        const startX = armBall.armDropStartX || armBall.x;
        const startY = armBall.armDropStartY || armBall.y;
        const landX = armBall.armDropTargetX || target.x;
        const landY = armBall.armDropTargetY || target.y;
        armBall.x = startX + (landX - startX) * ease;
        armBall.y = startY + (landY - startY) * ease - arc;
        armBall.vx = 0;
        armBall.vy = 0;
        
        if (currentTime >= armBall.armStateUntil) {
          armBall.armState = "idle";
          armBall.armGrabTargetId = null;
          armBall.x = landX;
          armBall.y = landY;
          const impactDist = Math.hypot(target.x - landX, target.y - landY);
          const launchAngle = armBall.armDropAngle ?? Math.atan2(target.y - landY, target.x - landX);
          const didHit = impactDist <= armBall.r + target.r + 24;
          if (didHit) {
            applyDamage(target, bal.arm.secSlamDamage, `${armBall.id}-elbow-slam`, currentTime, 500);
            const launchForce = 640;
            target.vx = Math.cos(launchAngle) * launchForce;
            target.vy = Math.sin(launchAngle) * launchForce;
            target.armThrowWallUntil = currentTime + 1400;
            target.armThrowWallSourceId = armBall.id;
            spawnSparks(target.x, target.y, "#ef4444", 15);
            game.screenShake = Math.max(game.screenShake, 16);
          } else {
            game.floatingTexts = game.floatingTexts || [];
            game.floatingTexts.push({
              x: armBall.x,
              y: armBall.y - armBall.r - 18,
              vy: -42,
              text: "MISS",
              color: "#cbd5e1",
              life: 0.6,
              maxLife: 0.6
            });
            game.screenShake = Math.max(game.screenShake, 5);
          }
          const recoilForce = didHit ? 980 : 760;
          armBall.vx = -Math.cos(launchAngle) * recoilForce;
          armBall.vy = -Math.sin(launchAngle) * recoilForce;
          playSound("armSlam");
          spawnDust(armBall.x, armBall.y, didHit ? 16 : 9);
        }
        return;
      }

      if (armBall.armState === "idle") {
        const targetAngle = Math.atan2(target.y - armBall.y, target.x - armBall.x);
        let diff = targetAngle - (armBall.armAngle || 0);
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        const sweep = Math.sin(currentTime * 0.006) * 0.55;
        armBall.armAngle = (armBall.armAngle || 0) + diff * 0.11 + bal.arm.swingSpeed * 0.45 + sweep * 0.025;
        const targetDist = Math.hypot(target.x - armBall.x, target.y - armBall.y);

        if (targetDist < armBall.r + target.r + bal.arm.punchRange && currentTime >= (armBall.armNextPunchAt || 0)) {
          armBall.armNextPunchAt = currentTime + bal.arm.punchCooldown;
          armBall.armPunchStartAt = currentTime;
          armBall.armPunchUntil = currentTime + 360;
          armBall.armPunchAngle = targetAngle;
          applyDamage(target, bal.arm.punchDamage, `${armBall.id}-arm-punch`, currentTime, 350);
          if (!hasStringBounceGuard(target)) {
            target.vx += Math.cos(targetAngle) * bal.arm.punchKnockback;
            target.vy += Math.sin(targetAngle) * bal.arm.punchKnockback;
          }
          spawnSparks(target.x, target.y, "#e5e7eb", 10);
          playSound("hammerHit");
          game.floatingTexts = game.floatingTexts || [];
          game.floatingTexts.push({
            x: armBall.x, y: armBall.y - armBall.r - 18, vy: -45,
            text: "PUNCH", color: "#e5e7eb", life: 0.7, maxLife: 0.7
          });
        }
        
        const elbowDropRange = Math.max(88, bal.arm.grabRange + armBall.r + target.r + 12);
        if (targetDist <= elbowDropRange && currentTime >= (armBall.nextSecondaryAt || 0) && canStartSkillConnection(armBall, target, game.balls, currentTime)) {
          const leadTime = clamp(targetDist / 520, 0.06, 0.24);
          const landX = clamp(target.x + (target.vx || 0) * leadTime, armBall.r + 20, game.width - armBall.r - 20);
          const landY = clamp(target.y + (target.vy || 0) * leadTime, armBall.r + 20, game.height - armBall.r - 20);
          armBall.nextSecondaryAt = currentTime + bal.arm.secCooldown;
          armBall.armState = "elbow_dropping";
          armBall.armDropStartAt = currentTime;
          armBall.armStateUntil = currentTime + 580;
          armBall.armGrabTargetId = target.id;
          armBall.armDropStartX = armBall.x;
          armBall.armDropStartY = armBall.y;
          armBall.armDropTargetX = landX;
          armBall.armDropTargetY = landY;
          armBall.armDropAngle = Math.atan2(landY - armBall.y, landX - armBall.x);
          playSound("armGrab");
          
          game.floatingTexts = game.floatingTexts || [];
          game.floatingTexts.push({
            x: armBall.x, y: armBall.y - armBall.r - 20, vy: -50,
            text: "ELBOW DROP", color: "#f87171", life: 0.8, maxLife: 0.8
          });
            
          if (armBall.side === "left") game.stats.left.totalShots++;
          else game.stats.right.totalShots++;
          interruptSkills(target);
        }
      }
    };

    const updateChess = (ball, target, currentTime, stepDt) => {
      const bal = game.balance || BALANCE;
      const chessBal = bal.chess || BALANCE.chess;

      if (ball.chessState === "idle") {
        if (ball.nextShotAt <= currentTime) {
          ball.chessState = "movingToCenter";
          playSound("chessMove");
        }
      } else if (ball.chessState === "movingToCenter") {
        const cx = ARENA_SIZE / 2;
        const cy = ARENA_SIZE / 2;
        const dx = cx - ball.x;
        const dy = cy - ball.y;
        const dist = Math.hypot(dx, dy);
        
        if (dist < 10) {
          ball.x = cx;
          ball.y = cy;
          ball.vx = 0;
          ball.vy = 0;
          ball.chessState = "activeCrown";
          ball.chessTimer = currentTime + chessBal.crownDuration;
          ball.chessScale = 1.0;
          
          const crowns = ["knight", "bishop", "rook"];
          ball.chessCrown = crowns[Math.floor(Math.random() * crowns.length)];
          
          playSound("chessSlam");
          spawnSparks(cx, cy, "#fbbf24", 15);
        } else {
          const angle = Math.atan2(dy, dx);
          ball.vx = Math.cos(angle) * chessBal.centerSpeed;
          ball.vy = Math.sin(angle) * chessBal.centerSpeed;
        }
      } else if (ball.chessState === "activeCrown") {
        ball.x = ARENA_SIZE / 2;
        ball.y = ARENA_SIZE / 2;
        ball.vx = 0;
        ball.vy = 0;

        const duration = chessBal.crownDuration;
        const timeLeft = ball.chessTimer - currentTime;
        const elapsed = duration - timeLeft;
        const progress = clamp(elapsed / duration, 0, 1);

        if (ball.chessCrown === "knight") {
          ball.chessScale = 1.0 + 1.6 * Math.abs(Math.sin(progress * Math.PI * 2));
        } else if (ball.chessCrown === "bishop") {
          ball.chessScale = 1.0 + 1.8 * Math.sin(progress * Math.PI);
        } else if (ball.chessCrown === "rook") {
          if (progress >= 0.25 && progress <= 0.75) {
            ball.chessScale = 3.0;
          } else {
            ball.chessScale = 1.0;
          }
        } else {
          ball.chessScale = 1.0;
        }



        if (currentTime >= ball.chessTimer) {
          ball.chessState = "attacking";
          ball.chessScale = 1.0;
          ball.chessWaypointIndex = 0;
          
          const cx = ARENA_SIZE / 2;
          const cy = ARENA_SIZE / 2;
          const pad = 18 + ball.r;
          
          if (ball.chessCrown === "bishop") {
            ball.chessAttackWaypoints = [
              { x: pad, y: pad },
              { x: ARENA_SIZE - pad, y: ARENA_SIZE - pad },
              { x: cx, y: cy },
              { x: ARENA_SIZE - pad, y: pad },
              { x: pad, y: ARENA_SIZE - pad },
              { x: cx, y: cy }
            ];
          } else if (ball.chessCrown === "rook") {
            ball.chessAttackWaypoints = [
              { x: pad, y: cy },
              { x: ARENA_SIZE - pad, y: cy },
              { x: cx, y: cy },
              { x: cx, y: pad },
              { x: cx, y: ARENA_SIZE - pad },
              { x: cx, y: cy }
            ];
          } else { // knight
            ball.chessAttackWaypoints = [
              { x: cx, y: cy - 160 }, { x: cx - 80, y: cy - 160 }, { x: cx, y: cy },
              { x: cx, y: cy - 160 }, { x: cx + 80, y: cy - 160 }, { x: cx, y: cy },
              { x: cx, y: cy + 160 }, { x: cx - 80, y: cy + 160 }, { x: cx, y: cy },
              { x: cx, y: cy + 160 }, { x: cx + 80, y: cy + 160 }, { x: cx, y: cy }
            ];
          }
          playSound("chessMove");
        }
      } else if (ball.chessState === "attacking") {
        const waypoints = ball.chessAttackWaypoints;
        const idx = ball.chessWaypointIndex;
        if (idx < waypoints.length) {
          const wp = waypoints[idx];
          const dx = wp.x - ball.x;
          const dy = wp.y - ball.y;
          const dist = Math.hypot(dx, dy);
          const speed = chessBal.centerSpeed * 4;
          
          if (dist < 12) {
            ball.x = wp.x;
            ball.y = wp.y;
            ball.chessWaypointIndex++;
            ball.vx = 0;
            ball.vy = 0;
          } else {
            const angle = Math.atan2(dy, dx);
            ball.vx = Math.cos(angle) * speed;
            ball.vy = Math.sin(angle) * speed;
          }
          
          const distTarget = Math.hypot(target.x - ball.x, target.y - ball.y);
          if (distTarget < target.r + (ball.r + 5) * CHESS_CROWN_HITBOX_MULTIPLIER) {
            applyDamage(target, chessBal.damage, `${ball.id}-chess-attack`, currentTime, chessBal.tickCooldown);
          }
        } else {
          ball.chessState = "idle";
          ball.chessCrown = null;
          ball.chessScale = 1.0;
          
          const angle = Math.random() * Math.PI * 2;
          const launchForce = 350;
          ball.vx = Math.cos(angle) * launchForce;
          ball.vy = Math.sin(angle) * launchForce;
          ball.nextShotAt = currentTime + chessBal.cooldown;
          
          playSound("chessMove");
        }
      }
    };

    const updateGun = (gun, target, currentTime, stepDt) => {
      gun.angle = Math.atan2(target.y - gun.y, target.x - gun.x);
      const gunBal = game.balance.gun;
      
      if (!gun.dog && !gun.dogDied && currentTime >= (gun.dogRespawnAt || 0)) {
        const dogAngle = Math.atan2(target.y - gun.y, target.x - gun.x) + (gun.side === "left" ? -0.8 : 0.8);
        gun.dog = {
          x: clamp(gun.x - Math.cos(gun.angle) * 22 + Math.cos(dogAngle) * 16, 30, game.width - 30),
          y: clamp(gun.y - Math.sin(gun.angle) * 22 + Math.sin(dogAngle) * 16, 30, game.height - 30),
          vx: Math.cos(dogAngle) * gunBal.dogSpeed,
          vy: Math.sin(dogAngle) * gunBal.dogSpeed,
          r: 12,
          health: gunBal.dogHealth,
          nextBiteAt: 0,
          nextHurtAt: 0,
        };
        game.floatingTexts = game.floatingTexts || [];
        game.floatingTexts.push({
          x: gun.x, y: gun.y - gun.r - 22, vy: -50,
          text: "DOG!", color: "#fbbf24", life: 0.8, maxLife: 0.8
        });
      }

      if (gun.dog) {
        const dog = gun.dog;
        if (dog.dead) {
          dog.vx *= 0.88;
          dog.vy *= 0.88;
          dog.x = clamp(dog.x + dog.vx * stepDt, 18 + dog.r, game.width - 18 - dog.r);
          dog.y = clamp(dog.y + dog.vy * stepDt, 18 + dog.r, game.height - 18 - dog.r);
        } else {
        const dTarget = Math.hypot(target.x - dog.x, target.y - dog.y);
        const chaseAngle = Math.atan2(target.y - dog.y, target.x - dog.x);
        dog.vx += Math.cos(chaseAngle) * gunBal.dogSpeed * 2.8 * stepDt;
        dog.vy += Math.sin(chaseAngle) * gunBal.dogSpeed * 2.8 * stepDt;
        const dogSpeed = Math.hypot(dog.vx, dog.vy);
        const maxDogSpeed = gunBal.dogSpeed * 1.35;
        if (dogSpeed > maxDogSpeed) {
          dog.vx = (dog.vx / dogSpeed) * maxDogSpeed;
          dog.vy = (dog.vy / dogSpeed) * maxDogSpeed;
        }
        dog.x += dog.vx * stepDt;
        dog.y += dog.vy * stepDt;
        const pad = 18;
        if (dog.x - dog.r < pad) { dog.x = pad + dog.r; dog.vx = Math.abs(dog.vx); spawnDust(dog.x, dog.y, 3); }
        if (dog.x + dog.r > game.width - pad) { dog.x = game.width - pad - dog.r; dog.vx = -Math.abs(dog.vx); spawnDust(dog.x, dog.y, 3); }
        if (dog.y - dog.r < pad) { dog.y = pad + dog.r; dog.vy = Math.abs(dog.vy); spawnDust(dog.x, dog.y, 3); }
        if (dog.y + dog.r > game.height - pad) { dog.y = game.height - pad - dog.r; dog.vy = -Math.abs(dog.vy); spawnDust(dog.x, dog.y, 3); }

        if (dTarget < target.r + dog.r && currentTime >= dog.nextBiteAt) {
          applyDamage(target, gunBal.dogDamage, `${gun.id}-dog-bite`, currentTime, 500);
          dog.nextBiteAt = currentTime + 650;
          if (!hasStringBounceGuard(target)) {
            target.vx += Math.cos(chaseAngle) * 120;
            target.vy += Math.sin(chaseAngle) * 120;
          }
          spawnSparks(dog.x, dog.y, "#fbbf24", 8);
        }

        if (dTarget < target.r + dog.r + 4 && currentTime >= (dog.nextHurtAt || 0)) {
          const impactSpeed = Math.hypot(target.vx - dog.vx, target.vy - dog.vy);
          if (impactSpeed > 155) {
            const impactDamage = clamp(Math.round(impactSpeed / 85), 2, 8);
            dog.health -= impactDamage;
            dog.nextHurtAt = currentTime + 420;
            const hitAngle = Math.atan2(dog.y - target.y, dog.x - target.x);
            dog.vx += Math.cos(hitAngle) * 180;
            dog.vy += Math.sin(hitAngle) * 180;
            spawnSparks(dog.x, dog.y, "#f97316", 7);
            game.floatingTexts = game.floatingTexts || [];
            game.floatingTexts.push({
              x: dog.x, y: dog.y - dog.r - 12, vy: -42,
              text: `DOG -${impactDamage}`, color: "#fb923c", life: 0.5, maxLife: 0.5
            });
          }
        }

        if (dog.health <= 0) {
          spawnDust(dog.x, dog.y, 10);
          spawnSparks(dog.x, dog.y, "#fbbf24", 10);
          dog.health = 0;
          dog.dead = true;
          dog.vx *= 0.35;
          dog.vy *= 0.35;
          gun.dogDied = true;
          gun.permanentRapidFire = true;
          gun.rapidPierceShotsRemaining = gunBal.rapidPierceShots || 2;
          gun.dogRespawnAt = Infinity;
          game.floatingTexts = game.floatingTexts || [];
          ["My DOOG!!", "You Hurt My DOOG"].forEach((text, index) => {
            game.floatingTexts.push({
              x: gun.x, y: gun.y - gun.r - 22 - index * 18, vy: -50,
              text, color: index ? "#f87171" : "#fbbf24", life: 1, maxLife: 1
            });
          });
        }
        }
      }
      
      // Tactical Reload Dash
      if (gun.ammo <= 0 || gun.reloadUntil > currentTime) {
        const dist = Math.hypot(target.x - gun.x, target.y - gun.y);
        if (dist < 160 && currentTime >= (gun.nextSecondaryAt || 0)) {
          gun.nextSecondaryAt = currentTime + gunBal.secCooldown;
          const awayAngle = Math.atan2(gun.y - target.y, gun.x - target.x);
          gun.vx += Math.cos(awayAngle) * gunBal.secDashForce;
          gun.vy += Math.sin(awayAngle) * gunBal.secDashForce;
          gun.ammo = Math.min(gun.maxAmmo, (gun.ammo || 0) + 2);
          gun.reloadUntil = 0; // Interrupt reload
          gun.nextRapidFireAt = currentTime;
          playSound("gunReload");
          
          const dashParticles = getParticleBudget(8);
          for (let i = 0; i < dashParticles; i++) {
            const a = awayAngle + (Math.random() - 0.5) * 0.5;
            const spd = 60 + Math.random() * 80;
            game.particles.push({
              x: gun.x, y: gun.y,
              vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
              color: "#e2e8f0", radius: 2, life: 0.35, maxLife: 0.35
            });
          }
          
          game.floatingTexts = game.floatingTexts || [];
          game.floatingTexts.push({
            x: gun.x, y: gun.y - gun.r - 20, vy: -50,
            text: gun.permanentRapidFire ? "You Hurt My DOOG" : "TACTICAL DASH", color: gun.permanentRapidFire ? "#f87171" : "#67e8f9", life: 0.8, maxLife: 0.8
          });
        }
      }

      if (gun.reloadUntil > currentTime) return;
      if (gun.ammo <= 0) {
        gun.reloadUntil = currentTime + gunBal.reloadTime;
        gun.ammo = gun.maxAmmo;
        playSound("gunReload");
        return;
      }
      const shotCooldown = gun.permanentRapidFire ? gunBal.rapidFireCooldown : gunBal.shotCooldown;
      if (gun.nextShotAt > currentTime) return;
      const isRapidShot = gun.permanentRapidFire;
      const piercesDefense = isRapidShot && (gun.rapidPierceShotsRemaining || 0) > 0;
      if (piercesDefense) gun.rapidPierceShotsRemaining -= 1;

      const mX = gun.x + Math.cos(gun.angle) * (gun.r + 26);
      const mY = gun.y + Math.sin(gun.angle) * (gun.r + 26);
      game.bullets.push({
        ownerId: gun.id, targetSide: target.side, x: mX, y: mY,
        vx: Math.cos(gun.angle) * gunBal.bulletSpeed,
        vy: Math.sin(gun.angle) * gunBal.bulletSpeed,
        r: 5, damage: gunBal.bulletDamage, life: gunBal.bulletLife, piercesDefense,
      });

      if (gun.side === "left") game.stats.left.totalShots++;
      else game.stats.right.totalShots++;

      gun.ammo--;
      gun.nextShotAt = currentTime + shotCooldown;
      gun.flashUntil = currentTime + 90;
      playSound("gunShot");
    };

    const updateLaser = (laserBall, target, currentTime, stepDt) => {
      const bal = game.balance;

      if (laserBall.laserState === "idle") {
        laserBall.laserTargetAngle = Math.atan2(target.y - laserBall.y, target.x - laserBall.x);
        if (laserBall.nextShotAt <= currentTime) {
          if ((laserBall.laserShotCount || 0) >= 3) {
            const pulseAngle = Math.atan2(target.y - laserBall.y, target.x - laserBall.x);
            const pulseX = laserBall.x + Math.cos(pulseAngle) * (laserBall.r + 12);
            const pulseY = laserBall.y + Math.sin(pulseAngle) * (laserBall.r + 12);
            game.bullets.push({
              ownerId: laserBall.id,
              targetSide: target.side,
              x: pulseX,
              y: pulseY,
              vx: Math.cos(pulseAngle) * bal.laser.pulseSpeed,
              vy: Math.sin(pulseAngle) * bal.laser.pulseSpeed,
              r: 12,
              damage: bal.laser.pulseDamage,
              life: 3.0,
              kind: "laserPulse",
              stunDuration: bal.laser.pulseStunDuration,
              bouncesLeft: 4,
              piercesDefense: true,
              cannotReflect: true,
            });
            laserBall.laserShotCount = 0;
            laserBall.nextShotAt = currentTime + bal.laser.cooldown;
            laserBall.laserTargetAngle = pulseAngle;
            game.floatingTexts = game.floatingTexts || [];
            game.floatingTexts.push({
              x: laserBall.x, y: laserBall.y - laserBall.r - 20, vy: -50,
              text: "CANNON SHOT", color: "#facc15", life: 0.8, maxLife: 0.8
            });
            spawnSparks(pulseX, pulseY, "#facc15", 14);
            playSound("laserFire");
            return;
          }
          laserBall.laserState = "charging";
          laserBall.laserStateUntil = currentTime + bal.laser.chargeTime;
          laserBall.laserTargetAngle = Math.atan2(target.y - laserBall.y, target.x - laserBall.x);
          laserBall.laserFireAngle = laserBall.laserTargetAngle;
          laserBall.laserShieldBlockCount = 0;
          laserBall.laserReflect = null;
          playSound("laserCharge");
        }
      } else if (laserBall.laserState === "charging") {
        laserBall.laserReflect = null;
        const targetAngle = Math.atan2(target.y - laserBall.y, target.x - laserBall.x);
        let angleDiff = targetAngle - (laserBall.laserTargetAngle ?? targetAngle);
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        laserBall.laserTargetAngle = (laserBall.laserTargetAngle ?? targetAngle) + angleDiff * 0.035;

        if (canSpawnParticle() && Math.random() < 0.3) {
          const a = Math.random() * Math.PI * 2, dst = laserBall.r + 20 + Math.random() * 20;
          game.particles.push({
            x: laserBall.x + Math.cos(a) * dst, y: laserBall.y + Math.sin(a) * dst,
            vx: -Math.cos(a) * 70, vy: -Math.sin(a) * 70, color: Math.random() < 0.65 ? "#ffffff" : "#facc15", radius: 1.8, life: 0.28, maxLife: 0.28
          });
        }

        if (currentTime >= laserBall.laserStateUntil) {
          laserBall.laserState = "firing";
          laserBall.laserStateUntil = currentTime + bal.laser.fireDuration;
          laserBall.laserFireAngle = laserBall.laserTargetAngle;
          laserBall.laserShieldBlockCount = 0;
          playSound("laserFire");
          laserBall.laserNextTickAt = currentTime;
          game.screenShake = Math.max(game.screenShake, 5);
        }
      } else if (laserBall.laserState === "firing") {
        const recoilAngle = Math.atan2(laserBall.y - target.y, laserBall.x - target.x);
        const recoilF = bal.laser.recoilForce || 180;
        laserBall.vx += Math.cos(recoilAngle) * recoilF * stepDt;
        laserBall.vy += Math.sin(recoilAngle) * recoilF * stepDt;

        const targetAngle = Math.atan2(target.y - laserBall.y, target.x - laserBall.x);
        let angleDiff = targetAngle - (laserBall.laserFireAngle ?? laserBall.laserTargetAngle);
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        laserBall.laserFireAngle = (laserBall.laserFireAngle ?? laserBall.laserTargetAngle) + angleDiff * 0.035;
        laserBall.laserTargetAngle = laserBall.laserFireAngle;

        const mX = laserBall.x + Math.cos(laserBall.laserTargetAngle) * laserBall.r;
        const mY = laserBall.y + Math.sin(laserBall.laserTargetAngle) * laserBall.r;
        const eX = mX + Math.cos(laserBall.laserTargetAngle) * 1500;
        const eY = mY + Math.sin(laserBall.laserTargetAngle) * 1500;

        if (canSpawnParticle() && Math.random() < 0.4) {
          const dst = Math.random() * 400;
          game.particles.push({
            x: mX + Math.cos(laserBall.laserTargetAngle) * dst,
            y: mY + Math.sin(laserBall.laserTargetAngle) * dst,
            vx: (Math.random() - 0.5) * 30, vy: (Math.random() - 0.5) * 30,
            color: Math.random() < 0.75 ? "#ffffff" : "#facc15", radius: 1.5, life: 0.15, maxLife: 0.15
          });
        }

        const shieldBlock = getShieldBeamBlock(target.type === "shield" ? target : null, mX, mY, eX, eY, bal.laser.beamWidth);
        if (shieldBlock) {
          const reflectedAngle = 2 * shieldBlock.angle - Math.PI - laserBall.laserTargetAngle;
          laserBall.laserReflect = { x: shieldBlock.x, y: shieldBlock.y, angle: reflectedAngle };
          const piercesShield = ((target.shieldLaserPierceHits || 0) + 1) >= 4;

          if (currentTime >= laserBall.laserNextTickAt) {
            laserBall.laserNextTickAt = currentTime + bal.laser.tickCooldown;
            laserBall.laserShieldBlockCount = (laserBall.laserShieldBlockCount || 0) + 1;
            target.shieldLaserPierceHits = (target.shieldLaserPierceHits || 0) + 1;
            if (target.side === "left") game.stats.left.blocked++;
            else game.stats.right.blocked++;
            spawnShieldSparks(shieldBlock.x, shieldBlock.y, shieldBlock.angle);
            registerShieldGuardHit(target, shieldBlock.angle, currentTime);
            spawnSparks(laserBall.x, laserBall.y, "#ffffff", 5);
            const recoil = Math.atan2(laserBall.y - shieldBlock.y, laserBall.x - shieldBlock.x);
            laserBall.vx += Math.cos(recoil) * 130;
            laserBall.vy += Math.sin(recoil) * 130;
            target.vx += Math.cos(recoil + Math.PI) * 55;
            target.vy += Math.sin(recoil + Math.PI) * 55;
            if (piercesShield) {
              const pierceDamage = Math.max(MIN_DAMAGE, bal.laser.damagePerTick);
              applyDamage(target, pierceDamage, `${laserBall.id}-laser-pierce`, currentTime, bal.laser.tickCooldown);
              target.shieldLaserPierceHits = 0;
              game.floatingTexts = game.floatingTexts || [];
              game.floatingTexts.push({
                x: target.x, y: target.y - target.r - 22, vy: -55,
                text: "PIERCE", color: "#facc15", life: 0.65, maxLife: 0.65
              });
            }
          }
          if (currentTime >= laserBall.laserStateUntil) {
            laserBall.laserState = "idle";
            laserBall.laserShotCount = (laserBall.laserShotCount || 0) + 1;
            laserBall.nextShotAt = currentTime + bal.laser.cooldown;
            laserBall.laserReflect = null;
            laserBall.laserShieldBlockCount = 0;
          }
          return;
        } else {
          laserBall.laserReflect = null;
          laserBall.laserShieldBlockCount = Math.max(0, (laserBall.laserShieldBlockCount || 0) - 0.05);
        }

        const d = linePointDist(target.x, target.y, mX, mY, eX, eY);
        if (d < target.r + bal.laser.beamWidth / 2 && currentTime >= laserBall.laserNextTickAt) {
          const beamDamage = Math.max(MIN_DAMAGE, bal.laser.damagePerTick);
          if (isChessCrownActive(target)) return;
          if (isWreckerJumpInvulnerable(target)) {
            laserBall.laserNextTickAt = currentTime + bal.laser.tickCooldown;
            return;
          }
          target.health = clamp(target.health - beamDamage, 0, MAX_HEALTH);

          game.floatingTexts = game.floatingTexts || [];
          game.floatingTexts.push({
            x: target.x + (Math.random() - 0.5) * 20, y: target.y - target.r - 5, vy: -60,
            text: `-${beamDamage}`, color: "#ffffff", life: 0.8, maxLife: 0.8
          });
          
          if (laserBall.side === "left") { game.stats.left.damageDealt += beamDamage; game.stats.left.hitsLanded++; }
          else { game.stats.right.damageDealt += beamDamage; game.stats.right.hitsLanded++; }

          const beamHitParticles = getParticleBudget(3);
          for (let i = 0; i < beamHitParticles; i++) {
            const sa = Math.random() * Math.PI * 2, spd = 40 + Math.random() * 60;
            game.particles.push({
              x: target.x + (Math.random() - 0.5) * target.r, y: target.y + (Math.random() - 0.5) * target.r,
              vx: Math.cos(sa) * spd, vy: Math.sin(sa) * spd, color: Math.random() < 0.7 ? "#ffffff" : "#facc15", radius: 2, life: 0.2, maxLife: 0.2
            });
          }
          laserBall.laserNextTickAt = currentTime + bal.laser.tickCooldown;
        }

        if (currentTime >= laserBall.laserStateUntil) {
          laserBall.laserState = "idle";
          laserBall.laserShotCount = (laserBall.laserShotCount || 0) + 1;
          laserBall.nextShotAt = currentTime + bal.laser.cooldown;
          laserBall.laserReflect = null;
          laserBall.laserShieldBlockCount = 0;
        }
      }
    };

    const updateBomber = (bomberBall, target, currentTime) => {
      // 1. Regular mine spawning logic
      if (currentTime >= bomberBall.nextShotAt) {
        const randomOffset = () => (Math.random() - 0.5) * 120;
        const mX = clamp(bomberBall.x + randomOffset(), 50, game.width - 50);
        const mY = clamp(bomberBall.y + randomOffset(), 50, game.height - 50);

        const activeMines = game.mines.filter(m => m.ownerId === bomberBall.id);
        if (activeMines.length >= game.balance.bomber.maxMines) {
          activeMines[0].triggerTime = currentTime;
        }

        game.mines.push({
          ownerId: bomberBall.id,
          ownerSide: bomberBall.side,
          x: mX,
          y: mY,
          r: 10,
          triggerRadius: 45,
          isAboutToDetonate: false,
          triggerTime: null,
          isHoming: false,
        });

        if (bomberBall.side === "left") game.stats.left.totalShots++;
        else game.stats.right.totalShots++;

        bomberBall.nextShotAt = currentTime + game.balance.bomber.cooldown;
        playSound("spikePlant");
      }

      // 2. Secondary homing mine skill
      const bal = game.balance.bomber || BALANCE.bomber;
      const secCooldown = bal.secCooldown !== undefined ? bal.secCooldown : 7000;
      if (currentTime >= (bomberBall.nextSecondaryAt || 0)) {
        bomberBall.nextSecondaryAt = currentTime + secCooldown;
        const angle = Math.atan2(target.y - bomberBall.y, target.x - bomberBall.x);
        const mX = clamp(bomberBall.x - Math.cos(angle) * (bomberBall.r + 15), 50, game.width - 50);
        const mY = clamp(bomberBall.y - Math.sin(angle) * (bomberBall.r + 15), 50, game.height - 50);

        game.mines.push({
          ownerId: bomberBall.id,
          ownerSide: bomberBall.side,
          x: mX,
          y: mY,
          r: 10,
          triggerRadius: 45,
          isAboutToDetonate: false,
          triggerTime: null,
          isHoming: true,
          vx: Math.cos(angle) * 30,
          vy: Math.sin(angle) * 30,
        });

        game.floatingTexts = game.floatingTexts || [];
        game.floatingTexts.push({
          x: bomberBall.x, y: bomberBall.y - bomberBall.r - 20, vy: -50,
          text: "HOMING MINE", color: "#38bdf8", life: 0.8, maxLife: 0.8
        });
        playSound("spikePlant");
      }
    };

    const updateSpider = (spiderBall, target, currentTime, stepDt) => {
      const bal = game.balance;
      const hasActiveWebTrap = () => (game.venomPools || []).some((pool) => pool.ownerId === spiderBall.id);
      const dropWebTrap = (x, y) => {
        if (hasActiveWebTrap()) return false;
        game.venomPools = game.venomPools || [];
        game.venomPools.push({
          ownerId: spiderBall.id,
          x,
          y,
          r: bal.spider.secPoolRadius,
          ownerSide: spiderBall.side,
          createdTime: currentTime,
          duration: 4000
        });
        return true;
      };

      // Venomous Web Spit Trigger
      const dist = Math.hypot(target.x - spiderBall.x, target.y - spiderBall.y);
      if (dist < 240 && currentTime >= (spiderBall.nextSecondaryAt || 0) && !hasActiveWebTrap()) {
        spiderBall.nextSecondaryAt = currentTime + bal.spider.secCooldown;
        const spitX = clamp(spiderBall.x + (target.x - spiderBall.x) * 0.4 + (Math.random() - 0.5) * 20, 30, game.width - 30);
        const spitY = clamp(spiderBall.y + (target.y - spiderBall.y) * 0.4 + (Math.random() - 0.5) * 20, 30, game.height - 30);
        if (dropWebTrap(spitX, spitY)) {
          playSound("webShoot");

          game.floatingTexts = game.floatingTexts || [];
          game.floatingTexts.push({
            x: spiderBall.x, y: spiderBall.y - spiderBall.r - 20, vy: -50,
            text: "WEB", color: "#10b981", life: 0.8, maxLife: 0.8
          });
        }
      }

      if (spiderBall.webState === "idle") {
        if (spiderBall.nextShotAt <= currentTime && canStartSkillConnection(spiderBall, target, game.balls, currentTime)) {
          spiderBall.webState = "shooting";
          spiderBall.webX = spiderBall.x;
          spiderBall.webY = spiderBall.y;
          
          const angle = Math.atan2(target.y - spiderBall.y, target.x - spiderBall.x);
          spiderBall.webVx = Math.cos(angle) * bal.spider.webSpeed;
          spiderBall.webVy = Math.sin(angle) * bal.spider.webSpeed;
          
          if (spiderBall.side === "left") game.stats.left.totalShots++;
          else game.stats.right.totalShots++;

          spiderBall.nextShotAt = currentTime + bal.spider.cooldown;
          playSound("webShoot");
        }
      } else if (spiderBall.webState === "shooting") {
        // Handled in updateSpiderWebProjectile
      } else if (spiderBall.webState === "pulling") {
        if (currentTime >= spiderBall.webStateUntil) {
          spiderBall.webState = "idle";
          spiderBall.webTargetId = null;
          spiderBall.webBouncesLeft = 0;
          dropWebTrap(target.x, target.y);
          return;
        }
        const targetDx = target.x - (spiderBall.webLastTargetX ?? target.x);
        const targetDy = target.y - (spiderBall.webLastTargetY ?? target.y);
        spiderBall.webLastTargetX = target.x;
        spiderBall.webLastTargetY = target.y;
        spiderBall.x += targetDx;
        spiderBall.y += targetDy;
        const angle = Math.atan2(target.y - spiderBall.y, target.x - spiderBall.x);
        
        spiderBall.x += Math.cos(angle) * bal.spider.pullSpeed * stepDt;
        spiderBall.y += Math.sin(angle) * bal.spider.pullSpeed * stepDt;
        handleWallBounce(spiderBall);
        
        spiderBall.webX = target.x;
        spiderBall.webY = target.y;

        const dist = Math.hypot(target.x - spiderBall.x, target.y - spiderBall.y);
        if (dist < spiderBall.r + target.r + 12) {
          const pushAngle = Math.atan2(spiderBall.y - target.y, spiderBall.x - target.x);
          spiderBall.x = target.x + Math.cos(pushAngle) * (spiderBall.r + target.r + 4);
          spiderBall.y = target.y + Math.sin(pushAngle) * (spiderBall.r + target.r + 4);
          const randomSign = Math.random() < 0.5 ? -1 : 1;
          const bounceAngle = pushAngle + randomSign * (0.6 + Math.random() * 0.5);
          spiderBall.vx = Math.cos(bounceAngle) * bal.spider.bounceSpeed;
          spiderBall.vy = Math.sin(bounceAngle) * bal.spider.bounceSpeed;
          applyDamage(target, bal.spider.fangDamage, `${spiderBall.id}-fang-${spiderBall.webBouncesLeft}`, currentTime, 120);
          if (spiderBall.side === "left") {
            game.stats.left.damageDealt += Math.max(MIN_DAMAGE, bal.spider.fangDamage);
            game.stats.left.hitsLanded++;
          } else {
            game.stats.right.damageDealt += Math.max(MIN_DAMAGE, bal.spider.fangDamage);
            game.stats.right.hitsLanded++;
          }
          spiderBall.fangFlashUntil = currentTime + 180;
          game.floatingTexts = game.floatingTexts || [];
          game.floatingTexts.push({
            x: target.x, y: target.y - target.r - 20, vy: -60,
            text: "FANG", color: "#f8fafc", life: 0.7, maxLife: 0.7
          });
          spawnSparks(spiderBall.x, spiderBall.y, "#cbd5e1", 5);
          spiderBall.webBouncesLeft -= 1;
          if (spiderBall.webBouncesLeft > 0) {
            spiderBall.webState = "webBouncing";
            spiderBall.webStateUntil = currentTime + 300;
          } else {
            spiderBall.webState = "idle";
            spiderBall.webTargetId = null;
            spiderBall.webBouncesLeft = 0;
            spawnSparks(target.x, target.y, "#93c5fd", 6);
            dropWebTrap(target.x, target.y);
          }
        }
      } else if (spiderBall.webState === "webBouncing") {
        const targetDx = target.x - (spiderBall.webLastTargetX ?? target.x);
        const targetDy = target.y - (spiderBall.webLastTargetY ?? target.y);
        spiderBall.webLastTargetX = target.x;
        spiderBall.webLastTargetY = target.y;
        spiderBall.x += targetDx;
        spiderBall.y += targetDy;
        spiderBall.webX = target.x;
        spiderBall.webY = target.y;
        if (currentTime >= spiderBall.webStateUntil) {
          spiderBall.webState = "pulling";
          spiderBall.webStateUntil = currentTime + bal.spider.pullDuration;
        }
      }

    };
    const updateGazerBall = (ball, target, currentTime, stepDt) => {
      const bal = game.balance.gazerBall || BALANCE.gazerBall;

      // --- Ultimate expiry ---
      if (ball.gazerUltActive && currentTime >= ball.gazerUltUntil) {
        ball.gazerUltActive = false;
        spawnSparks(ball.x, ball.y, "#ef4444", 16);
        game.floatingTexts = game.floatingTexts || [];
        game.floatingTexts.push({ x: ball.x, y: ball.y - ball.r - 22, vy: -45, text: "SURGE ENDED", color: "#f87171", life: 0.7, maxLife: 0.7 });
      }

      const effectiveCooldown = ball.gazerUltActive ? (bal.cooldown * (bal.ultCDRMult || 0.5)) : bal.cooldown;
      const effectiveMaxBounces = ball.gazerUltActive ? (bal.ultMaxBounces || 8) : (bal.maxBounces || 4);
      const effectiveWidth = ball.gazerUltActive ? (bal.beamWidth * (bal.ultWidthMult || 2)) : bal.beamWidth;

      // --- Energy Focus passive: gain 1 stack per focusInterval ms without firing ---
      if (ball.gazerState === "idle" || ball.gazerState === "cooldown") {
        if ((ball.gazerFocusStacks || 0) < (bal.maxFocusStacks || 5)) {
          if (currentTime >= (ball.gazerNextFocusAt || 0)) {
            ball.gazerFocusStacks = (ball.gazerFocusStacks || 0) + 1;
            ball.gazerNextFocusAt = currentTime + (bal.focusInterval || 1000);
            if (ball.gazerFocusStacks >= (bal.maxFocusStacks || 5)) {
              game.floatingTexts = game.floatingTexts || [];
              game.floatingTexts.push({ x: ball.x, y: ball.y - ball.r - 20, vy: -40, text: "FOCUS MAX!", color: "#fbbf24", life: 0.75, maxLife: 0.75 });
            }
          }
        }
      }

      // --- Charging ---
      if (ball.gazerState === "charging") {
        ball.gazerChargeTimer += stepDt * 1000;
        const targetAngle = Math.atan2(target.y - ball.y, target.x - ball.x);
        let angleDiff = targetAngle - (ball.gazerBeamAngle ?? targetAngle);
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        ball.gazerBeamAngle = (ball.gazerBeamAngle ?? targetAngle) + angleDiff * 0.04;

        if (ball.gazerChargeTimer >= bal.chargeDuration) {
          // FIRE
          ball.gazerState = "firing";
          ball.gazerChargeTimer = 0;

          const stacks = ball.gazerFocusStacks || 0;
          const stackMult = 1 + stacks * (bal.focusBonus || 0.05);
          const finalDamage = bal.beamDamage * stackMult * (ball.gazerUltActive ? 1.2 : 1);
          const finalWidth = effectiveWidth * (1 + stacks * (bal.focusBonus || 0.05) * 0.6);

          // Reset focus stacks on fire
          ball.gazerFocusStacks = 0;
          ball.gazerNextFocusAt = currentTime + (bal.focusInterval || 1000);
          ball.gazerLastFiredAt = currentTime;

          const angle = ball.gazerBeamAngle;
          const dx = Math.cos(angle);
          const dy = Math.sin(angle);
          
          let cx = ball.x + dx * ball.r;
          let cy = ball.y + dy * ball.r;
          
          const path = [{ x: cx, y: cy }];
          let cdx = dx;
          let cdy = dy;
          let bounces = 0;
          let targetHit = false;
          let shieldHit = false;
          const pad = 18;

          while (bounces < effectiveMaxBounces) {
            let tWall = Infinity;
            let wallNormalX = 0, wallNormalY = 0;

            const leftWall = pad;
            const rightWall = game.width - pad;
            const topWall = pad;
            const bottomWall = game.height - pad;

            if (cdx > 0) {
              const t = (rightWall - cx) / cdx;
              if (t > 0 && t < tWall) { tWall = t; wallNormalX = -1; wallNormalY = 0; }
            } else if (cdx < 0) {
              const t = (leftWall - cx) / cdx;
              if (t > 0 && t < tWall) { tWall = t; wallNormalX = 1; wallNormalY = 0; }
            }

            if (cdy > 0) {
              const t = (bottomWall - cy) / cdy;
              if (t > 0 && t < tWall) { tWall = t; wallNormalX = 0; wallNormalY = -1; }
            } else if (cdy < 0) {
              const t = (topWall - cy) / cdy;
              if (t > 0 && t < tWall) { tWall = t; wallNormalX = 0; wallNormalY = 1; }
            }

            // Target circle intersection
            let tTarget = Infinity;
            const ox = cx - target.x;
            const oy = cy - target.y;
            const A = 1;
            const B = 2 * (ox * cdx + oy * cdy);
            const C = ox * ox + oy * oy - target.r * target.r;
            const disc = B * B - 4 * A * C;

            if (disc >= 0) {
              const sqrtDisc = Math.sqrt(disc);
              const t1 = (-B - sqrtDisc) / 2;
              const t2 = (-B + sqrtDisc) / 2;

              if (t1 > 0.1 && t1 < tTarget) {
                tTarget = t1;
              } else if (t2 > 0.1 && t2 < tTarget) {
                tTarget = t2;
              }
            }

            // Shield block intersection along the 1600px line segment
            const segLen = 1600;
            const ex = cx + cdx * segLen;
            const ey = cy + cdy * segLen;
            const shieldBlock = getShieldBeamBlock(target.type === "shield" ? target : null, cx, cy, ex, ey, finalWidth);
            let tShield = Infinity;
            if (shieldBlock) {
              tShield = Math.hypot(shieldBlock.x - cx, shieldBlock.y - cy);
            }

            // Check which one is closer
            if (tShield < tTarget && tShield < tWall && tShield < segLen) {
              const hitX = shieldBlock.x;
              const hitY = shieldBlock.y;
              path.push({ x: hitX, y: hitY });

              // Shield block sparks and hits
              spawnShieldSparks(hitX, hitY, shieldBlock.angle);
              registerShieldGuardHit(target, shieldBlock.angle, currentTime);
              playSound("shieldBlock", 0.85, 95);
              spawnSparks(hitX, hitY, "#ef4444", 10);
              game.screenShake = Math.max(game.screenShake, 10);

              // Recoil: push gazer ball away from shield hit point
              const recoilAngle = Math.atan2(ball.y - hitY, ball.x - hitX);
              if (!hasStringBounceGuard(ball)) {
                ball.vx += Math.cos(recoilAngle) * (bal.recoilForce || 600);
                ball.vy += Math.sin(recoilAngle) * (bal.recoilForce || 600);
              }
              // Push shield holder back from impact
              if (!hasStringBounceGuard(target)) {
                target.vx -= Math.cos(recoilAngle) * 160;
                target.vy -= Math.sin(recoilAngle) * 160;
              }

              game.floatingTexts = game.floatingTexts || [];
              game.floatingTexts.push({
                x: hitX, y: hitY - 18, vy: -50,
                text: "BLOCKED!", color: "#3b82f6", life: 0.7, maxLife: 0.7
              });

              // Reflect off shield angle
              const reflectedAngle = 2 * shieldBlock.angle - Math.PI - Math.atan2(cdy, cdx);
              cdx = Math.cos(reflectedAngle);
              cdy = Math.sin(reflectedAngle);

              cx = hitX;
              cy = hitY;
              shieldHit = true;
              bounces++;
            } else if (tTarget < tWall && tTarget < segLen) {
              const hitX = cx + cdx * tTarget;
              const hitY = cy + cdy * tTarget;
              path.push({ x: hitX, y: hitY });

              // Direct hit on target!
              if (!targetHit) {
                targetHit = true;
                
                const tv = Math.hypot(target.vx, target.vy);
                const approachDot = tv > 0 ? -(target.vx * cdx + target.vy * cdy) / tv : 0;
                const approachFactor = Math.max(0, approachDot);
                const ricochetIndex = Math.max(0, Math.min(bounces - 1, (bal.ricochetDmg?.length || 1) - 1));
                const bouncedDamage = bounces > 0
                  ? ((bal.ricochetDmg?.[ricochetIndex] ?? finalDamage) * (ball.gazerUltActive ? 1.08 : 1))
                  : finalDamage;
                const bouncedKb = bounces > 0
                  ? (bal.ricochetKb?.[ricochetIndex] ?? bal.beamKnockback)
                  : bal.beamKnockback;
                const totalDamage = bouncedDamage;
                const totalKb = bouncedKb * (ball.gazerUltActive ? 1.12 : 1) + approachFactor * tv * 0.6;

                applyDamage(target, totalDamage, `${ball.id}-gazer-beam`, currentTime, 300);
                if (!hasStringBounceGuard(target)) {
                  target.vx += cdx * totalKb;
                  target.vy += cdy * totalKb;
                }
                target.webHitFlashUntil = currentTime + (bal.stunDuration || 300);
                
                const ownerStats = ball.side === "left" ? game.stats.left : game.stats.right;
                ownerStats.damageDealt += Math.max(MIN_DAMAGE, Math.round(totalDamage));
                ownerStats.hitsLanded++;

                game.screenShake = Math.max(game.screenShake, 22);
                spawnSparks(target.x, target.y, "#ef4444", 22);
                spawnDust(target.x, target.y, 12);
                playSound("laserFire", 1.0, 140);

                game.floatingTexts = game.floatingTexts || [];
                game.floatingTexts.push({
                  x: target.x, y: target.y - target.r - 28, vy: -62,
                  text: `GAZER BLAST! -${Math.round(totalDamage)}`, color: "#ef4444", life: 0.95, maxLife: 0.95
                });

                // Check ultimate trigger
                if (!ball.gazerUltActive && ball.health <= 40 && currentTime > (ball.gazerUltUntil || 0)) {
                  ball.gazerUltActive = true;
                  ball.gazerUltUntil = currentTime + (bal.ultDuration || 5000);
                  game.screenShake = Math.max(game.screenShake, 18);
                  spawnSparks(ball.x, ball.y, "#fbbf24", 30);
                  playSound("laserFire", 1.0, 80);
                  game.floatingTexts.push({
                    x: ball.x, y: ball.y - ball.r - 30, vy: -65,
                    text: "OMEGA SURGE!", color: "#fbbf24", life: 1.1, maxLife: 1.1
                  });
                }
              } else {
                spawnSparks(hitX, hitY, "#fff5f5", 14);
                playSound("wallBounce", 0.7, 120);
              }

              // Reflect off circle normal
              let nx = hitX - target.x;
              let ny = hitY - target.y;
              const len = Math.hypot(nx, ny);
              if (len > 0) { nx /= len; ny /= len; }

              const dot = cdx * nx + cdy * ny;
              cdx = cdx - 2 * dot * nx;
              cdy = cdy - 2 * dot * ny;

              cx = hitX;
              cy = hitY;
              bounces++;
            } else if (tWall < segLen) {
              const hitX = cx + cdx * tWall;
              const hitY = cy + cdy * tWall;
              path.push({ x: hitX, y: hitY });

              // Reflect off wall normal
              const dot = cdx * wallNormalX + cdy * wallNormalY;
              cdx = cdx - 2 * dot * wallNormalX;
              cdy = cdy - 2 * dot * wallNormalY;

              cx = hitX;
              cy = hitY;
              bounces++;

              spawnSparks(hitX, hitY, "#ef4444", 8);
              playSound("wallBounce", 0.65, 100);
            } else {
              path.push({ x: cx + cdx * segLen, y: cy + cdy * segLen });
              break;
            }
          }

          ball.gazerBeamPath = path;

          // Recoil (muzzle kick — skip if shield already applied a directional recoil)
          if (!shieldHit && !hasStringBounceGuard(ball)) {
            ball.vx -= dx * (bal.recoilForce || 600);
            ball.vy -= dy * (bal.recoilForce || 600);
          }
          ball.gazerBeamFlashUntil = currentTime + 240;
          ball.gazerRecoilUntil = currentTime + (bal.postFireSlowDuration || 400);
          ball.gazerCooldownUntil = currentTime + effectiveCooldown;
          ball.gazerState = "cooldown";

          if (ball.side === "left") game.stats.left.totalShots++;
          else game.stats.right.totalShots++;
        }
        return;
      }

      if (ball.gazerState === "cooldown") {
        if (currentTime >= ball.gazerCooldownUntil) ball.gazerState = "idle";
        return;
      }

      // Idle -> begin charge
      if (ball.gazerState === "idle" && currentTime >= (ball.gazerCooldownUntil || 0)) {
        ball.gazerState = "charging";
        ball.gazerChargeTimer = 0;
        ball.gazerBeamAngle = Math.atan2(target.y - ball.y, target.x - ball.x);
        playSound("laserCharge", 0.85, 160);
      }
    };


    const isPointInTriangle = (px, py, ax, ay, bx, by, cx, cy) => {
      const v0x = cx - ax, v0y = cy - ay;
      const v1x = bx - ax, v1y = by - ay;
      const v2x = px - ax, v2y = py - ay;

      const dot00 = v0x * v0x + v0y * v0y;
      const dot01 = v0x * v1x + v0y * v1y;
      const dot02 = v0x * v2x + v0y * v2y;
      const dot11 = v1x * v1x + v1y * v1y;
      const dot12 = v1x * v2x + v1y * v2y;

      const denom = dot00 * dot11 - dot01 * dot01;
      if (Math.abs(denom) < 1e-6) return false;
      const invDenom = 1 / denom;
      const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
      const v = (dot00 * dot12 - dot01 * dot02) * invDenom;

      return (u >= 0) && (v >= 0) && (u + v < 1);
    };

    const isPointInPolygon = (px, py, points) => {
      let inside = false;
      for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        const xi = points[i].x, yi = points[i].y;
        const xj = points[j].x, yj = points[j].y;
        const intersects = ((yi > py) !== (yj > py)) &&
          (px < ((xj - xi) * (py - yi)) / ((yj - yi) || 1e-6) + xi);
        if (intersects) inside = !inside;
      }
      return inside;
    };

    const updateConstellation = (ball, currentTime) => {
      const bal = game.balance.constellation || BALANCE.constellation;

      // 1. Ultimate trigger at <= 40 HP (once per battle)
      if (!ball.constellationUltActive && ball.health <= 40 && currentTime > (ball.constellationUltUntil || 0)) {
        ball.constellationUltActive = true;
        ball.constellationUltUntil = currentTime + bal.ultDuration;
        game.screenShake = Math.max(game.screenShake, 18);
        spawnSparks(ball.x, ball.y, "#facc15", 30);
        playSound("laserFire", 1.0, 70);
        game.floatingTexts = game.floatingTexts || [];
        game.floatingTexts.push({
          x: ball.x, y: ball.y - ball.r - 28, vy: -60,
          text: "COSMIC ALIGNMENT!", color: "#facc15", life: 1.1, maxLife: 1.1
        });
      }

      // Check ultimate end
      if (ball.constellationUltActive && currentTime >= ball.constellationUltUntil) {
        ball.constellationUltActive = false;
        spawnSparks(ball.x, ball.y, "#38bdf8", 12);
      }

      // 2. Casting skill on cooldown
      const effectiveCooldown = ball.constellationUltActive ? (bal.cooldown * 0.5) : bal.cooldown;
      if (currentTime >= (ball.nextShotAt || 0)) {
        game.constellationStars = game.constellationStars || [];
        // Get stars owned by this ball
        const myStars = game.constellationStars.filter(s => s.ownerId === ball.id);
        
        if (myStars.length >= 3) {
          // Consume used stars from the global list, prioritizing the largest
          // side-count pattern available from the most recent placements.
          myStars.sort((a, b) => a.createdAt - b.createdAt);
          const sideCount = myStars.length >= 5 ? 5 : myStars.length >= 4 ? 4 : 3;
          const usedStars = myStars.slice(-sideCount);
          
          // Remove usedStars from game.constellationStars
          const usedIds = new Set(usedStars.map(s => s.id));
          game.constellationStars = game.constellationStars.filter(s => !usedIds.has(s.id));

          // Identify shape
          let shapeType = "triangle";
          let label = "Tri Shield";
          if (usedStars.length === 4) { shapeType = "square"; label = "Star Cage"; }
          else if (usedStars.length === 5) { shapeType = "pentagon"; label = "Nova Ring"; }

          game.activeConstellations = game.activeConstellations || [];
          game.activeConstellations.push({
            id: Math.random().toString(),
            ownerId: ball.id,
            ownerSide: ball.side,
            type: shapeType,
            stars: usedStars.map(s => ({ x: s.x, y: s.y })),
            spawnTime: currentTime,
            duration: bal.activePatternDuration || 4000,
            nextTickAt: currentTime,
          });

          // Visual and audio feedback
          game.screenShake = Math.max(game.screenShake, 14);
          playSound("laserFire", 0.9, 130);
          game.floatingTexts = game.floatingTexts || [];
          game.floatingTexts.push({
            x: ball.x, y: ball.y - ball.r - 20, vy: -50,
            text: label.toUpperCase(), color: "#e0f2fe", life: 0.8, maxLife: 0.8
          });

          ball.nextShotAt = currentTime + effectiveCooldown;
        }
      }
    };

    const updateActiveConstellations = (currentTime) => {
      if (!game.activeConstellations) return;
      const bal = game.balance.constellation || BALANCE.constellation;

      game.activeConstellations = game.activeConstellations.filter(c => {
        if (currentTime >= c.spawnTime + c.duration) {
          return false; // expires
        }

        const enemy = game.balls.find(b => b.side !== c.ownerSide);
        const owner = game.balls.find(b => b.side === c.ownerSide);

        if (c.type === "triangle") {
          // Cosmic Shield (3 stars)
          const p1 = c.stars[0], p2 = c.stars[1], p3 = c.stars[2];

          // 1. Owner invulnerability check
          if (owner) {
            const inside = isPointInTriangle(owner.x, owner.y, p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
            if (inside) {
              owner.constellationShieldedUntil = currentTime + 100;
            }
          }

          // 2. Enemy barrier check
          if (enemy) {
            const segments = [[p1, p2], [p2, p3], [p3, p1]];
            segments.forEach(([s1, s2]) => {
              const dist = linePointDist(enemy.x, enemy.y, s1.x, s1.y, s2.x, s2.y);
              if (dist < enemy.r + 5) {
                const damageKey = `${c.id}-triangle-damage`;
                if (!(game.damageCooldowns[damageKey] > currentTime)) {
                  applyDamage(enemy, bal.triangleDamage || 8, damageKey, currentTime, 1050);
                  const dx = s2.x - s1.x;
                  const dy = s2.y - s1.y;
                  const len = Math.hypot(dx, dy) || 1;
                  const nx = -dy / len;
                  const ny = dx / len;
                  const side = Math.sign((enemy.x - s1.x) * nx + (enemy.y - s1.y) * ny) || 1;
                  if (!hasStringBounceGuard(enemy)) {
                    enemy.vx += nx * side * (bal.triangleKnockback || 460);
                    enemy.vy += ny * side * (bal.triangleKnockback || 460);
                  }
                  spawnSparks(enemy.x, enemy.y, "#facc15", 10);
                  playSound("wallBounce", 0.9, 100);
                }
              }
            });
          }
        } 
        else if (c.type === "square" && enemy) {
          // Star Prison (4 stars)
          const p1 = c.stars[0], p2 = c.stars[1], p3 = c.stars[2], p4 = c.stars[3];

          // Sort vertices angularly
          const cx = (p1.x + p2.x + p3.x + p4.x) / 4;
          const cy = (p1.y + p2.y + p3.y + p4.y) / 4;
          const q = [p1, p2, p3, p4].sort((a, b) => Math.atan2(a.y - cy, a.x - cx) - Math.atan2(b.y - cy, b.x - cx));

          // Check if enemy inside
          const inside = isPointInTriangle(enemy.x, enemy.y, q[0].x, q[0].y, q[1].x, q[1].y, q[2].x, q[2].y) ||
                         isPointInTriangle(enemy.x, enemy.y, q[0].x, q[0].y, q[2].x, q[2].y, q[3].x, q[3].y);

          if (inside) {
            // Apply tick damage
            if (currentTime >= (c.nextTickAt || 0)) {
                applyDamage(enemy, bal.squareTickDamage || 2, `${c.id}-prison-damage`, currentTime, 420);
              }

            // Trap enemy inside: reflect velocity inward
            const edges = [[q[0], q[1]], [q[1], q[2]], [q[2], q[3]], [q[3], q[0]]];
            edges.forEach(([s1, s2]) => {
              const d = linePointDist(enemy.x, enemy.y, s1.x, s1.y, s2.x, s2.y);
              if (d < enemy.r + 5) {
                const dx = s2.x - s1.x;
                const dy = s2.y - s1.y;
                const lenSq = dx * dx + dy * dy;
                let rx = s1.x, ry = s1.y;
                if (lenSq > 0) {
                  const param = clamp(((enemy.x - s1.x) * dx + (enemy.y - s1.y) * dy) / lenSq, 0, 1);
                  rx = s1.x + param * dx;
                  ry = s1.y + param * dy;
                }
                
                let nx = cx - rx;
                let ny = cy - ry;
                const len = Math.hypot(nx, ny);
                if (len > 0) { nx /= len; ny /= len; }

                const dot = enemy.vx * nx + enemy.vy * ny;
                if (dot < 0) {
                  applyDamage(enemy, bal.squareEdgeDamage || 4, `${c.id}-square-edge`, currentTime, 760);
                  const bounceD = 1.05;
                  enemy.vx = (enemy.vx - 2 * dot * nx) * bounceD;
                  enemy.vy = (enemy.vy - 2 * dot * ny) * bounceD;
                  if (!hasStringBounceGuard(enemy)) {
                    enemy.vx += nx * (bal.squareKnockback || 420);
                    enemy.vy += ny * (bal.squareKnockback || 420);
                  }
                  enemy.x = rx + nx * (enemy.r + 8);
                  enemy.y = ry + ny * (enemy.r + 8);
                  spawnSparks(enemy.x, enemy.y, "#c084fc", 8);
                  playSound("wallBounce", 0.75, 120);
                }
              }
            });
          }
          if (currentTime >= (c.nextTickAt || 0)) {
            c.nextTickAt = currentTime + 420;
          }
        } else if (c.type === "pentagon" && enemy) {
          const cx = c.stars.reduce((sum, p) => sum + p.x, 0) / c.stars.length;
          const cy = c.stars.reduce((sum, p) => sum + p.y, 0) / c.stars.length;
          const q = [...c.stars].sort((a, b) => Math.atan2(a.y - cy, a.x - cx) - Math.atan2(b.y - cy, b.x - cx));
          const inside = isPointInPolygon(enemy.x, enemy.y, q);

          if (inside && currentTime >= (c.nextTickAt || 0)) {
            applyDamage(enemy, bal.pentagonTickDamage || 3, `${c.id}-pentagon-tick`, currentTime, 460);
            const pullAngle = Math.atan2(cy - enemy.y, cx - enemy.x);
            if (!hasStringBounceGuard(enemy)) {
              enemy.vx += Math.cos(pullAngle) * (bal.pentagonPullStrength || 240);
              enemy.vy += Math.sin(pullAngle) * (bal.pentagonPullStrength || 240);
            }
            spawnSparks(enemy.x, enemy.y, "#f59e0b", 10);
          }

          const edges = q.map((point, index) => [point, q[(index + 1) % q.length]]);
          edges.forEach(([s1, s2]) => {
            const dist = linePointDist(enemy.x, enemy.y, s1.x, s1.y, s2.x, s2.y);
            if (dist < enemy.r + 5) {
              const damageKey = `${c.id}-pentagon-edge`;
              if (!(game.damageCooldowns[damageKey] > currentTime)) {
                applyDamage(enemy, bal.pentagonEdgeDamage || 5, damageKey, currentTime, 820);
                spawnSparks(enemy.x, enemy.y, "#fbbf24", 10);
                playSound("wallBounce", 0.85, 100);
              }
            }
          });

          if (currentTime >= (c.nextTickAt || 0)) {
            c.nextTickAt = currentTime + 460;
          }
        }

        return true;
      });
    };

    const updateFireSkull = (ball, target, currentTime, stepDt) => {
      if (ball.fsRoadActive) {
        ball.fsRoadSegments = ball.fsRoadSegments || [];
        ball.fsRoadSegments.push({ x: ball.x, y: ball.y });
        
        // Aesthetics: trail particles
        if (Math.random() < 0.4) {
          game.particles.push({
            x: ball.x + (Math.random() - 0.5) * 12,
            y: ball.y + (Math.random() - 0.5) * 12,
            vx: (Math.random() - 0.5) * 40,
            vy: (Math.random() - 0.5) * 40,
            color: Math.random() < 0.5 ? "#f97316" : "#ef4444",
            radius: 2 + Math.random() * 3,
            life: 0.35 + Math.random() * 0.25,
            maxLife: 0.6
          });
        }
      }
    };

    const updateBlackSpider = (ball, target, currentTime, stepDt) => {
      const bsBal = game.balance.blackSpider || BALANCE.blackSpider;

      // --- Spit Symbiote Slime Web secondary skill ---
      const hasActiveSymbiotePool = () => (game.venomPools || []).some((pool) => pool.ownerId === ball.id && pool.isSymbiote);
      const dropSymbiotePool = (x, y) => {
        if (hasActiveSymbiotePool()) return false;
        game.venomPools = game.venomPools || [];
        game.venomPools.push({
          ownerId: ball.id,
          x,
          y,
          r: 50, // unique symbiote pool size
          ownerSide: ball.side,
          createdTime: currentTime,
          duration: 4500, // lasts 4.5 seconds
          isSymbiote: true,
        });
        return true;
      };

      const spitDist = Math.hypot(target.x - ball.x, target.y - ball.y);
      if (spitDist < 280 && currentTime >= (ball.nextSecondaryAt || 0) && !hasActiveSymbiotePool()) {
        ball.nextSecondaryAt = currentTime + (bsBal.secCooldown || 10000);
        const spitX = clamp(ball.x + (target.x - ball.x) * 0.45 + (Math.random() - 0.5) * 15, 30, game.width - 30);
        const spitY = clamp(ball.y + (target.y - ball.y) * 0.45 + (Math.random() - 0.5) * 15, 30, game.height - 30);
        if (dropSymbiotePool(spitX, spitY)) {
          playSound("webShoot");
          game.floatingTexts = game.floatingTexts || [];
          game.floatingTexts.push({
            x: ball.x, y: ball.y - ball.r - 20, vy: -50,
            text: "SLIME WEB!", color: "#4a044e", life: 0.8, maxLife: 0.8
          });
        }
      }

      if (!ball.bsSkillState) ball.bsSkillState = "idle";

      if (ball.bsSkillState === "idle") {
        const targetDistance = Math.hypot(target.x - ball.x, target.y - ball.y);
        const canThrow = currentTime >= (ball.nextShotAt || 0) &&
                         targetDistance < 450 &&
                         canStartSkillConnection(ball, target, game.balls, currentTime);
        
        if (canThrow) {
          ball.nextShotAt = currentTime + (bsBal.slamCooldown || bsBal.cooldown || 7000);
          ball.bsSkillState = "throwing";
          ball.bsStringX = ball.x;
          ball.bsStringY = ball.y;
          
          const dx = target.x - ball.x;
          const dy = target.y - ball.y;
          const dist = Math.hypot(dx, dy);
          const speed = bsBal.slamStringSpeed || 900;
          
          ball.bsStringVx = (dx / dist) * speed;
          ball.bsStringVy = (dy / dist) * speed;
          ball.bsHookedTargetId = target.id;
          
          playSound("webShoot", 0.9, 85);
          game.floatingTexts = game.floatingTexts || [];
          game.floatingTexts.push({
            x: ball.x, y: ball.y - ball.r - 22, vy: -55,
            text: "PULL SLAM!", color: "#cbd5e1", life: 0.85, maxLife: 0.85
          });
        }
      } else if (ball.bsSkillState === "throwing") {
        ball.bsStringX += ball.bsStringVx * stepDt;
        ball.bsStringY += ball.bsStringVy * stepDt;
        
        const dx = target.x - ball.bsStringX;
        const dy = target.y - ball.bsStringY;
        const dist = Math.hypot(dx, dy);
        
        if (dist < target.r + 10) {
          ball.bsSkillState = "pulling";
          ball.bsPullUntil = currentTime + (bsBal.slamPullDuration || 600);
          target.webHitFlashUntil = currentTime + (bsBal.slamPullDuration || 600);
          target.webHitFlashColor = "#000000";
          playSound("webShoot", 0.9, 70);
          spawnSparks(target.x, target.y, "#334155", 8);
        } else {
          const distFromSelf = Math.hypot(ball.bsStringX - ball.x, ball.bsStringY - ball.y);
          const pad = 18;
          const hitWall = ball.bsStringX < pad || ball.bsStringX > game.width - pad ||
                          ball.bsStringY < pad || ball.bsStringY > game.height - pad;
          
          if (hitWall) {
            ball.bsSkillState = "idle";
            ball.bsHookedTargetId = null;
          } else if (distFromSelf > 650) {
            ball.bsSkillState = "idle";
            ball.bsHookedTargetId = null;
          }
        }
      } else if (ball.bsSkillState === "pulling") {
        const dx = ball.x - target.x;
        const dy = ball.y - target.y;
        const dist = Math.hypot(dx, dy);
        
        target.webHitFlashUntil = currentTime + 100;
        target.webHitFlashColor = "#000000";

        if (dist > 5) {
          const pullSpeed = bsBal.pullSpeed || 1200;
          target.vx = (dx / dist) * pullSpeed;
          target.vy = (dy / dist) * pullSpeed;
          target.x += target.vx * stepDt;
          target.y += target.vy * stepDt;
        }
        
        if (currentTime >= ball.bsPullUntil || dist < ball.r + target.r + 15) {
          ball.bsSkillState = "spinning";
          ball.bsSpinUntil = currentTime + (bsBal.slamSpinDuration || 700);
          ball.bsSpinAngle = Math.atan2(target.y - ball.y, target.x - ball.x);
          playSound("webShoot", 0.85, 110);
        }
      } else if (ball.bsSkillState === "spinning") {
        const spinDurationSec = (bsBal.slamSpinDuration || 700) / 1000;
        const spinSpeed = (4 * Math.PI) / spinDurationSec;
        ball.bsSpinAngle += spinSpeed * stepDt;
        
        target.webHitFlashUntil = currentTime + 100;
        target.webHitFlashColor = "#000000";

        const orbitRadius = bsBal.slamSpinRadius || 75;
        target.x = ball.x + Math.cos(ball.bsSpinAngle) * orbitRadius;
        target.y = ball.y + Math.sin(ball.bsSpinAngle) * orbitRadius;
        
        const pad = 18;
        target.x = clamp(target.x, target.r + pad + 2, game.width - target.r - pad - 2);
        target.y = clamp(target.y, target.r + pad + 2, game.height - target.r - pad - 2);
        
        target.vx = -Math.sin(ball.bsSpinAngle) * orbitRadius * spinSpeed;
        target.vy = Math.cos(ball.bsSpinAngle) * orbitRadius * spinSpeed;
        
        if (currentTime >= ball.bsSpinUntil) {
          const corners = [
            { x: pad + 30, y: pad + 30 },
            { x: game.width - pad - 30, y: pad + 30 },
            { x: pad + 30, y: game.height - pad - 30 },
            { x: game.width - pad - 30, y: game.height - pad - 30 },
          ];
          
          let bestCorner = corners[0];
          let maxDist = 0;
          for (const c of corners) {
            const d = Math.hypot(c.x - target.x, c.y - target.y);
            if (d > maxDist) {
              maxDist = d;
              bestCorner = c;
            }
          }
          
          const angle = Math.atan2(bestCorner.y - target.y, bestCorner.x - target.x);
          const launchSpeed = bsBal.slamLaunchSpeed || 1150;
          target.vx = Math.cos(angle) * launchSpeed;
          target.vy = Math.sin(angle) * launchSpeed;
          
          target.bsSlamWallUntil = currentTime + 800;
          target.bsSlamWallSourceId = ball.id;
          
          applyDamage(target, bsBal.slamHitDamage || 4, `${ball.id}-bs-slam-hit-${currentTime}`, currentTime, 300);
          if (ball.side === "left") {
            game.stats.left.damageDealt += Math.max(MIN_DAMAGE, bsBal.slamHitDamage || 4);
            game.stats.left.hitsLanded++;
          } else {
            game.stats.right.damageDealt += Math.max(MIN_DAMAGE, bsBal.slamHitDamage || 4);
            game.stats.right.hitsLanded++;
          }
          
          ball.bsSkillState = "idle";
          ball.bsHookedTargetId = null;
          
          playSound("explosion", 0.9, 100);
          game.screenShake = Math.max(game.screenShake, 12);
          
          game.floatingTexts = game.floatingTexts || [];
          game.floatingTexts.push({
            x: target.x, y: target.y - target.r - 20, vy: -60,
            text: "SLAM SHOT!", color: "#f1f5f9", life: 0.9, maxLife: 0.9
          });
          
          spawnSparks(target.x, target.y, "#334155", 16);
        }
      }
    };

    const updateShield = (shieldBall, target, currentTime, stepDt) => {
      const bal = game.balance;
      const shieldR = 24;

      const bounceShieldFrom = (x, y, radius, color = "#60a5fa") => {
        const dx = shieldBall.shieldX - x;
        const dy = shieldBall.shieldY - y;
        const dist = Math.hypot(dx, dy);
        if (!dist || dist >= shieldR + radius) return false;
        const nx = dx / dist;
        const ny = dy / dist;
        const speed = Math.max(Math.hypot(shieldBall.shieldVx, shieldBall.shieldVy), bal.shield.shieldSpeed);
        shieldBall.shieldX = x + nx * (shieldR + radius + 1);
        shieldBall.shieldY = y + ny * (shieldR + radius + 1);
        shieldBall.shieldVx = nx * speed;
        shieldBall.shieldVy = ny * speed;
        shieldBall.shieldThrownUntil = Math.max(shieldBall.shieldThrownUntil, currentTime + 250);
        shieldBall.shieldBonusDamage = (shieldBall.shieldBonusDamage || 0) + 1;
        spawnSparks(shieldBall.shieldX, shieldBall.shieldY, color, 6);
        spawnDust(shieldBall.shieldX, shieldBall.shieldY, 3);
        playSound("shieldBlock", 0.8, 85);
        return true;
      };

      // Update active Shield Bash
      if (shieldBall.shieldBashUntil && currentTime < shieldBall.shieldBashUntil) {
        const dist = Math.hypot(target.x - shieldBall.x, target.y - shieldBall.y);
        if (dist < shieldBall.r + target.r + 5) {
          applyDamage(target, bal.shield.secBashDamage, `${shieldBall.id}-shield-bash`, currentTime, 250);
          const pushAngle = Math.atan2(target.y - shieldBall.y, target.x - shieldBall.x);
          if (!hasStringBounceGuard(target)) {
            target.vx += Math.cos(pushAngle) * bal.shield.knockback * 15;
            target.vy += Math.sin(pushAngle) * bal.shield.knockback * 15;
          }
          spawnSparks(target.x, target.y, "#3b82f6", 10);
          shieldBall.shieldBashUntil = 0; // stop lunge
        }
      }

      if (shieldBall.shieldState === "held") {
        shieldBall.shieldAngle = Math.atan2(target.y - shieldBall.y, target.x - shieldBall.x);
        
        // Trigger Shield Bash
        const dist = Math.hypot(target.x - shieldBall.x, target.y - shieldBall.y);
        if ((shieldBall.shieldBashThrows || 0) >= SHIELD_BASH_READY_THROWS && currentTime >= (shieldBall.nextSecondaryAt || 0) && canStartSkillConnection(shieldBall, target, game.balls, currentTime)) {
          shieldBall.nextSecondaryAt = currentTime + bal.shield.secCooldownHeld;
          const bashAngle = Math.atan2(target.y - shieldBall.y, target.x - shieldBall.x);
          shieldBall.shieldBashThrows = 0;
          if (dist <= SHIELD_BASH_CLOSE_RADIUS) {
            applyDamage(target, bal.shield.secBashDamage, `${shieldBall.id}-shield-bash-ready`, currentTime, 250);
            if (!hasStringBounceGuard(target)) {
              target.vx += Math.cos(bashAngle) * bal.shield.knockback * 22;
              target.vy += Math.sin(bashAngle) * bal.shield.knockback * 22;
            }
            spawnSparks(target.x, target.y, "#60a5fa", 14);
            game.screenShake = Math.max(game.screenShake, 12);
          } else {
            shieldBall.shieldBashUntil = currentTime + SHIELD_BASH_LUNGE_DURATION;
            shieldBall.vx = Math.cos(bashAngle) * SHIELD_BASH_LUNGE_SPEED;
            shieldBall.vy = Math.sin(bashAngle) * SHIELD_BASH_LUNGE_SPEED;
          }
          playSound("wallBounce");
          
          game.floatingTexts = game.floatingTexts || [];
          game.floatingTexts.push({
            x: shieldBall.x, y: shieldBall.y - shieldBall.r - 20, vy: -50,
            text: dist <= SHIELD_BASH_CLOSE_RADIUS ? "BASH RECOIL" : "SHIELD BASH", color: "#3b82f6", life: 0.8, maxLife: 0.8
          });
          
          const bashParticles = getParticleBudget(6);
          for (let i = 0; i < bashParticles; i++) {
            const sa = bashAngle + (Math.random() - 0.5) * 0.5;
            const spd = 50 + Math.random() * 60;
            game.particles.push({
              x: shieldBall.x, y: shieldBall.y,
              vx: Math.cos(sa) * spd, vy: Math.sin(sa) * spd,
              color: "#3b82f6", radius: 2, life: 0.35, maxLife: 0.35
            });
          }
          return;
        }

        if (shieldBall.nextThrowAt <= currentTime) {
          shieldBall.shieldState = "thrown";
          shieldBall.shieldGuardHits = 0;
          shieldBall.shieldBonusDamage = 0;
          shieldBall.shieldBashThrows = Math.min(SHIELD_BASH_READY_THROWS, (shieldBall.shieldBashThrows || 0) + 1);
          shieldBall.shieldX = shieldBall.x + Math.cos(shieldBall.shieldAngle) * (shieldBall.r + 5);
          shieldBall.shieldY = shieldBall.y + Math.sin(shieldBall.shieldAngle) * (shieldBall.r + 5);
          
          const angle = Math.atan2(target.y - shieldBall.y, target.x - shieldBall.x);
          shieldBall.shieldVx = Math.cos(angle) * bal.shield.shieldSpeed;
          shieldBall.shieldVy = Math.sin(angle) * bal.shield.shieldSpeed;
          shieldBall.shieldThrownUntil = currentTime + bal.shield.duration;
          shieldBall.shieldNextHitAt = 0;
          shieldBall.shieldSpinAngle = 0;

          if (shieldBall.side === "left") game.stats.left.totalShots++;
          else game.stats.right.totalShots++;
          playSound("shieldThrow");
        }
      } else if (shieldBall.shieldState === "dropped") {
        shieldBall.shieldVx = 0;
        shieldBall.shieldVy = 0;
        const pickupDist = Math.hypot(shieldBall.x - shieldBall.shieldX, shieldBall.y - shieldBall.shieldY);
        if (pickupDist < shieldBall.r + SHIELD_PICKUP_RADIUS) {
          shieldBall.shieldState = "held";
          shieldBall.shieldGuardHits = 0;
          shieldBall.shieldBonusDamage = 0;
          shieldBall.shieldLaserPierceHits = 0;
          shieldBall.nextThrowAt = currentTime + bal.shield.cooldown;
          spawnSparks(shieldBall.x, shieldBall.y, "#60a5fa", 8);
          playSound("shieldCatch");
        }
      } else {
        shieldBall.shieldX += shieldBall.shieldVx * stepDt;
        shieldBall.shieldY += shieldBall.shieldVy * stepDt;
        shieldBall.shieldSpinAngle = (shieldBall.shieldSpinAngle || 0) + 0.25;

        const pad = 18;
        let bounced = false;
        if (shieldBall.shieldX - shieldR < pad) { shieldBall.shieldX = pad + shieldR; shieldBall.shieldVx = Math.abs(shieldBall.shieldVx); bounced = true; }
        if (shieldBall.shieldX + shieldR > game.width - pad) { shieldBall.shieldX = game.width - pad - shieldR; shieldBall.shieldVx = -Math.abs(shieldBall.shieldVx); bounced = true; }
        if (shieldBall.shieldY - shieldR < pad) { shieldBall.shieldY = pad + shieldR; shieldBall.shieldVy = Math.abs(shieldBall.shieldVy); bounced = true; }
        if (shieldBall.shieldY + shieldR > game.height - pad) { shieldBall.shieldY = game.height - pad - shieldR; shieldBall.shieldVy = -Math.abs(shieldBall.shieldVy); bounced = true; }
        if (bounced) {
          shieldBall.shieldBonusDamage = (shieldBall.shieldBonusDamage || 0) + 1;
          spawnDust(shieldBall.shieldX, shieldBall.shieldY, 3);
          spawnSparks(shieldBall.shieldX, shieldBall.shieldY, "#3b82f6", 4);
        }

        game.bombs.forEach((bomb) => bounceShieldFrom(bomb.x, bomb.y, bomb.r, "#f97316"));
        game.mines.forEach((mine) => bounceShieldFrom(mine.x, mine.y, mine.r, "#facc15"));
        (game.cacti || []).forEach((cactus) => bounceShieldFrom(cactus.x, cactus.y, cactus.r || cactus.targetR || 18, "#14b8a6"));
        game.balls.forEach((ball) => {
          if (ball.id === shieldBall.id) return;
          if (ball.type === "shield" && (ball.shieldState === "thrown" || ball.shieldState === "returning")) {
            bounceShieldFrom(ball.shieldX, ball.shieldY, shieldR, "#93c5fd");
          }
          if (ball.type === "hammer" && ball.hammerState === "launching") {
            const hammerX = ball.x + Math.cos(ball.hammerLaunchAngle || 0) * (ball.r + 40);
            const hammerY = ball.y + Math.sin(ball.hammerLaunchAngle || 0) * (ball.r + 40);
            if (bounceShieldFrom(hammerX, hammerY, 18, "#fbbf24")) {
              ball.vx *= -0.45;
              ball.vy *= -0.45;
            }
          }
        });

        const d = Math.hypot(shieldBall.shieldX - target.x, shieldBall.shieldY - target.y);
        if (d < target.r + shieldR) {
          if (currentTime >= shieldBall.shieldNextHitAt) {
            const shieldHitDamage = bal.shield.damage + (shieldBall.shieldBonusDamage || 0);
            applyDamage(target, shieldHitDamage, `${shieldBall.id}-shield-hit`, currentTime, 300);
            
            if (shieldBall.side === "left") {
              game.stats.left.damageDealt += shieldHitDamage;
              game.stats.left.hitsLanded++;
            } else {
              game.stats.right.damageDealt += shieldHitDamage;
              game.stats.right.hitsLanded++;
            }

            const knockAngle = Math.atan2(target.y - shieldBall.shieldY, target.x - shieldBall.x);
            if (!hasStringBounceGuard(target)) {
              target.vx += Math.cos(knockAngle) * bal.shield.knockback * 12;
              target.vy += Math.sin(knockAngle) * bal.shield.knockback * 12;
            }

            shieldBall.shieldVx = -Math.cos(knockAngle) * bal.shield.shieldSpeed;
            shieldBall.shieldVy = -Math.sin(knockAngle) * bal.shield.shieldSpeed;
            shieldBall.shieldNextHitAt = currentTime + 300;

            game.screenShake = Math.max(game.screenShake, 8);
            spawnSparks(shieldBall.shieldX, shieldBall.shieldY, "#ef4444", 8);
            spawnDust(shieldBall.shieldX, shieldBall.shieldY, 5);
          }
        }

        if (shieldBall.shieldState === "thrown" && currentTime >= shieldBall.shieldThrownUntil) {
          shieldBall.shieldState = "returning";
        }

        if (shieldBall.shieldState === "returning") {
          const returnAngle = Math.atan2(shieldBall.y - shieldBall.shieldY, shieldBall.x - shieldBall.shieldX);
          shieldBall.shieldVx = Math.cos(returnAngle) * bal.shield.returnSpeed;
          shieldBall.shieldVy = Math.sin(returnAngle) * bal.shield.returnSpeed;

          const distToOwner = Math.hypot(shieldBall.x - shieldBall.shieldX, shieldBall.y - shieldBall.shieldY);
          if (distToOwner < shieldBall.r + 10) {
            shieldBall.shieldState = "held";
            shieldBall.shieldGuardHits = 0;
            shieldBall.shieldBonusDamage = 0;
            shieldBall.shieldLaserPierceHits = 0;
            shieldBall.nextThrowAt = currentTime + bal.shield.cooldown;
            spawnSparks(shieldBall.x, shieldBall.y, "#60a5fa", 6);
            playSound("shieldCatch");
          }
        }
      }
    };

    const updateHammer = (hammerBall, target, currentTime) => {
      const bal = game.balance;

      if (hammerBall.hammerState === "spinning") {
        hammerBall.hammerAngle = (hammerBall.hammerAngle || 0) + bal.hammer.spinSpeed;
        
        if (!hammerBall.lastSpinSoundAt || currentTime - hammerBall.lastSpinSoundAt >= 180) {
          hammerBall.lastSpinSoundAt = currentTime;
          playSound("hammerSpin", 0.7);
        }

        // Spin collision check at hammer head
        const hx = hammerBall.x + Math.cos(hammerBall.hammerAngle) * (hammerBall.r + 40);
        const hy = hammerBall.y + Math.sin(hammerBall.hammerAngle) * (hammerBall.r + 40);
        const d = Math.hypot(hx - target.x, hy - target.y);
        
        if (d < target.r + 14) {
          applyDamage(target, bal.hammer.spinDamage, `${hammerBall.id}-hammer-spin-hit`, currentTime, 250);
          
          if (hammerBall.side === "left") {
            game.stats.left.damageDealt += bal.hammer.spinDamage;
            game.stats.left.hitsLanded++;
          } else {
            game.stats.right.damageDealt += bal.hammer.spinDamage;
            game.stats.right.hitsLanded++;
          }
          
          spawnSparks(hx, hy, "#fbbf24", 6);
        }

        // 5 rotations = 10 * Math.PI radians
        if (hammerBall.hammerAngle >= 10 * Math.PI && canStartSkillConnection(hammerBall, target, game.balls, currentTime)) {
          hammerBall.hammerState = "charging";
          hammerBall.hammerStateUntil = currentTime + bal.hammer.chargeDuration;
          hammerBall.vx = 0;
          hammerBall.vy = 0;
          game.floatingTexts = game.floatingTexts || [];
          game.floatingTexts.push({
            x: hammerBall.x,
            y: hammerBall.y - hammerBall.r - 20,
            vy: -45,
            text: "Hammer Charge",
            color: "#fbbf24",
            life: 0.9,
            maxLife: 0.9
          });
          playSound("hammerCharge");
        }
      } else if (hammerBall.hammerState === "charging") {
        hammerBall.vx = 0;
        hammerBall.vy = 0;
        hammerBall.hammerAngle = Math.atan2(target.y - hammerBall.y, target.x - hammerBall.x);

        // Charging sparks visual
        if (canSpawnParticle() && Math.random() < 0.25) {
          const a = Math.random() * Math.PI * 2, dst = 30 + Math.random() * 30;
          const hx = hammerBall.x + Math.cos(hammerBall.hammerAngle) * (hammerBall.r + 40);
          const hy = hammerBall.y + Math.sin(hammerBall.hammerAngle) * (hammerBall.r + 40);
          game.particles.push({
            x: hx + Math.cos(a) * dst, y: hy + Math.sin(a) * dst,
            vx: -Math.cos(a) * 80, vy: -Math.sin(a) * 80,
            color: "#fbbf24", radius: 1.5, life: 0.25, maxLife: 0.25
          });
        }

        if (currentTime >= hammerBall.hammerStateUntil) {
          hammerBall.hammerState = "launching";
          hammerBall.hammerStateUntil = currentTime + bal.hammer.launchDuration;
          hammerBall.hammerLaunchAngle = hammerBall.hammerAngle;
          
          hammerBall.vx = Math.cos(hammerBall.hammerLaunchAngle) * bal.hammer.launchSpeed;
          hammerBall.vy = Math.sin(hammerBall.hammerLaunchAngle) * bal.hammer.launchSpeed;
          hammerBall.hammerNextHitAt = 0;

          if (hammerBall.side === "left") game.stats.left.totalShots++;
          else game.stats.right.totalShots++;
          
          game.screenShake = Math.max(game.screenShake, 10);
          spawnDust(hammerBall.x, hammerBall.y, 8);
          spawnSparks(hammerBall.x, hammerBall.y, "#f97316", 10);
          playSound("hammerLaunch");
        }
      } else if (hammerBall.hammerState === "launching") {
        // Enforce constant high velocity in launch direction
        hammerBall.vx = Math.cos(hammerBall.hammerLaunchAngle) * bal.hammer.launchSpeed;
        hammerBall.vy = Math.sin(hammerBall.hammerLaunchAngle) * bal.hammer.launchSpeed;

        // Spawn rocket flames
        if (canSpawnParticle() && Math.random() < 0.6) {
          const oppositeAngle = hammerBall.hammerLaunchAngle + Math.PI;
          const px = hammerBall.x - Math.cos(hammerBall.hammerLaunchAngle) * hammerBall.r;
          const py = hammerBall.y - Math.sin(hammerBall.hammerLaunchAngle) * hammerBall.r;
          const spread = (Math.random() - 0.5) * 0.4;
          const speed = 150 + Math.random() * 250;
          const vx = Math.cos(oppositeAngle + spread) * speed;
          const vy = Math.sin(oppositeAngle + spread) * speed;
          const colors = ["#f97316", "#ef4444", "#eab308"];
          game.particles.push({
            x: px, y: py, vx, vy,
            color: colors[Math.floor(Math.random() * colors.length)],
            radius: 2 + Math.random() * 3,
            life: 0.2 + Math.random() * 0.2,
            maxLife: 0.4
          });
        }

        // Collision check with opponent
        const d = distance(hammerBall, target);
        if (d < hammerBall.r + target.r) {
          if (currentTime >= hammerBall.hammerNextHitAt) {
            applyDamage(target, bal.hammer.launchDamage, `${hammerBall.id}-hammer-launch-hit`, currentTime, bal.hammer.launchDuration);
            
            if (hammerBall.side === "left") {
              game.stats.left.damageDealt += bal.hammer.launchDamage;
              game.stats.left.hitsLanded++;
            } else {
              game.stats.right.damageDealt += bal.hammer.launchDamage;
              game.stats.right.hitsLanded++;
            }

            // High knockback
            if (!hasStringBounceGuard(target)) {
              target.vx += Math.cos(hammerBall.hammerLaunchAngle) * 600;
              target.vy += Math.sin(hammerBall.hammerLaunchAngle) * 600;
            }
            
            game.screenShake = Math.max(game.screenShake, 18);
            spawnSparks(target.x, target.y, "#f59e0b", 16);
            spawnDust(target.x, target.y, 10);
            
            hammerBall.hammerNextHitAt = currentTime + bal.hammer.launchDuration;
          }
        }

        if (currentTime >= hammerBall.hammerStateUntil) {
          hammerBall.hammerState = "spinning";
          hammerBall.hammerAngle = 0;
        }
      }
    };

    const updateDragon = (ball, target, currentTime) => {
      // Disabled skills
    };

    const updatePsychicer = (ball, target, currentTime) => {
      const bal = game.balance.psychicer || BALANCE.psychicer;
      if (currentTime < (ball.nextPsychicAt || 0)) return;

      if (!game.psychicCircles) game.psychicCircles = [];
      if (game.psychicCircles.some((circle) => circle.ownerId === ball.id)) return;
      for (let i = 0; i < 1; i++) {
        const pad = 18 + bal.circleRadius;
        const x = pad + Math.random() * Math.max(1, game.width - pad * 2);
        const y = pad + Math.random() * Math.max(1, game.height - pad * 2);
        game.psychicCircles.push({
          ownerId: ball.id,
          ownerSide: ball.side,
          x,
          y,
          r: bal.circleRadius,
          createdTime: currentTime,
          life: bal.circleLife,
          hitsByBall: {},
          damageByBall: {},
          lastBounceByBall: {},
        });
        spawnSparks(x, y, "#c084fc", 8);
      }

      ball.nextPsychicAt = Infinity;
      ball.psychicFlashUntil = currentTime + 550;
      game.screenShake = Math.max(game.screenShake, 4);
      game.floatingTexts = game.floatingTexts || [];
      game.floatingTexts.push({
        x: ball.x, y: ball.y - ball.r - 20, vy: -45,
        text: "PSYCHIC FIELD", color: "#f0abfc", life: 0.8, maxLife: 0.8
      });
      if (ball.side === "left") game.stats.left.totalShots++;
      else game.stats.right.totalShots++;
      playSound("sporeShoot", 0.75, 220);
    };

    const updateChaos = (ball, target, currentTime) => {
      const bal = game.balance.chaos || BALANCE.chaos;
      if (currentTime < (ball.nextChaosAt || 0)) return;

      if (!game.chaosCircles) game.chaosCircles = [];
      game.chaosCircles = game.chaosCircles.filter((circle) => circle.ownerId !== ball.id);
      const pad = 18 + bal.circleRadius;
      const makeCircle = (axis, armSide, color, index) => {
        const x = pad + Math.random() * Math.max(1, game.width - pad * 2);
        const y = pad + Math.random() * Math.max(1, game.height - pad * 2);
        const circle = {
          id: `${ball.id}-chaos-${axis}-${currentTime}-${index}`,
          ownerId: ball.id,
          ownerSide: ball.side,
          axis,
          armSide,
          color,
          x,
          y,
          r: bal.circleRadius,
          createdTime: currentTime,
          life: bal.circleLife,
          triggeredAtByBall: {},
        };
        game.chaosCircles.push(circle);
        spawnSparks(x, y, color, 8);
      };

      const trapCount = Math.max(1, Math.round(bal.trapCount || 3));
      const randomAxis = Math.random() > 0.5 ? "vertical" : "horizontal";
      const trapPatterns = [
        ["vertical", "left", "#fdba74"],
        ["horizontal", "right", "#f97316"],
        [randomAxis, "center", randomAxis === "vertical" ? "#fdba74" : "#f97316"],
      ];
      for (let i = 0; i < trapCount; i++) {
        const pattern = trapPatterns[i % trapPatterns.length];
        makeCircle(pattern[0], pattern[1], pattern[2], i);
      }
      ball.nextChaosAt = currentTime + bal.cooldown;
      ball.chaosFlashUntil = currentTime + 600;
      game.screenShake = Math.max(game.screenShake, 5);
      game.floatingTexts = game.floatingTexts || [];
      game.floatingTexts.push({
        x: ball.x, y: ball.y - ball.r - 20, vy: -45,
        text: "WARP MAGIC", color: "#facc15", life: 0.8, maxLife: 0.8
      });
      if (ball.side === "left") game.stats.left.totalShots++;
      else game.stats.right.totalShots++;
      playSound("sporeShoot", 0.85, 80);
    };



    const updateJoker = (ball, target, currentTime) => {
      const bal = game.balance.joker || BALANCE.joker;

      if (!game.jokerThreads) game.jokerThreads = [];
      const activeThread = game.jokerThreads.find((thread) => thread.ownerId === ball.id && thread.state !== "done");

      // 1. Signature Ability: Bungee Gum Reel
      if (!activeThread && currentTime >= (ball.jokerNextThreadAt || 0) && canStartSkillConnection(ball, target, game.balls, currentTime)) {
        const aimAngle = Math.atan2(target.y - ball.y, target.x - ball.x) + (Math.random() - 0.5) * 0.35;
        const sx = ball.x + Math.cos(aimAngle) * (ball.r + 8);
        const sy = ball.y + Math.sin(aimAngle) * (ball.r + 8);
        game.jokerThreads.push({
          id: `${ball.id}-joker-${currentTime}`,
          ownerId: ball.id,
          ownerSide: ball.side,
          x: sx,
          y: sy,
          vx: Math.cos(aimAngle) * (bal.throwSpeed || 580),
          vy: Math.sin(aimAngle) * (bal.throwSpeed || 580),
          r: bal.tipRadius || 9,
          state: "flying",
          targetId: null,
          anchorAngle: aimAngle,
          anchorRadius: ball.r + 8,
          bouncesLeft: bal.maxBounces || 15,
          points: [{ x: sx, y: sy }],
          life: bal.threadLife || 4000,
          createdTime: currentTime,
          pullIndex: 0,
          slamCount: 0,
          initialBounces: bal.maxBounces || 15,
        });
        ball.jokerNextThreadAt = Infinity; // Disable primary during active hook
        ball.jokerFlashUntil = currentTime + 520;
        game.floatingTexts = game.floatingTexts || [];
        game.floatingTexts.push({
          x: ball.x, y: ball.y - ball.r - 20, vy: -48,
          text: "BUNGEE REEL", color: "#fb7185", life: 0.75, maxLife: 0.75
        });
        spawnSparks(sx, sy, "#f9a8d4", 10);
        playSound("shieldThrow", 0.8, 260);
        if (ball.side === "left") game.stats.left.totalShots++;
        else game.stats.right.totalShots++;
      }
    };

    const checkTetherIntersection = (thread, game) => {
      if (!game.bullets) return false;
      const owner = game.balls.find(b => b.id === thread.ownerId);
      if (!owner) return false;
      
      const anchorPoint = {
        x: owner.x + Math.cos(thread.anchorAngle || 0) * (thread.anchorRadius || owner.r + 8),
        y: owner.y + Math.sin(thread.anchorAngle || 0) * (thread.anchorRadius || owner.r + 8)
      };
      const points = [anchorPoint, ...(thread.points || []), { x: thread.x, y: thread.y }];
      
      for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        
        for (const bullet of game.bullets) {
          if (bullet.ownerId === thread.ownerId) continue;
          
          const dist = linePointDist(bullet.x, bullet.y, p1.x, p1.y, p2.x, p2.y);
          if (dist < bullet.r + 6) {
            bullet.life = 0; // destroy projectile
            return true;
          }
        }
      }
      return false;
    };

    const updateJokerThreads = (dt) => {
      if (!game.jokerThreads) return;
      const pad = 18;
      game.jokerThreads = game.jokerThreads.filter((thread) => {
        const owner = game.balls.find((ball) => ball.id === thread.ownerId);
        if (!owner) return false;
        const bal = game.balance.joker || BALANCE.joker;
        
        const getAnchorPoint = () => ({
          x: owner.x + Math.cos(thread.anchorAngle || 0) * (thread.anchorRadius || owner.r + 8),
          y: owner.y + Math.sin(thread.anchorAngle || 0) * (thread.anchorRadius || owner.r + 8)
        });

        const finishGumString = () => {
          owner.jokerPullTargetId = null;
          owner.jokerPullUntil = 0;
          owner.jokerNextThreadAt = game.simTime + (bal.cooldown || 6000);
          const target = game.balls.find((ball) => ball.id === thread.targetId);
          if (target) {
            target.jokerPulledUntil = 0;
            target.jokerPullOwnerId = null;
          }
          return false;
        };

        const startPathReturn = () => {
          if (thread.state === "returning") return true;
          const lastPoint = thread.points?.[thread.points.length - 1];
          if (!lastPoint || Math.hypot(thread.x - lastPoint.x, thread.y - lastPoint.y) > 8) {
            thread.points = [...(thread.points || []), { x: thread.x, y: thread.y }];
          }
          thread.state = "returning";
          thread.returnIndex = Math.max(0, (thread.points || []).length - 2);
          thread.life = Math.max(thread.life || 0, 2200);
          return true;
        };

        if (thread.state === "flying") {
          thread.life -= dt * 1000;
          if (thread.life <= 0) {
            return startPathReturn();
          }
        }

        const tryHookTarget = () => {
          const target = game.balls.find((ball) => ball.side !== thread.ownerSide);
          if (!target || Math.hypot(thread.x - target.x, thread.y - target.y) > target.r + thread.r) return false;
          if (!canStartSkillConnection(owner, target, game.balls, game.simTime)) return false;
          
          thread.points.push({ x: thread.x, y: thread.y });
          thread.state = "pulling";
          thread.targetId = target.id;
          thread.pullIndex = Math.max(0, thread.points.length - 2);
          thread.slamCount = 0;
          thread.life = Math.max(thread.life, 2500);
          
          owner.jokerPullTargetId = target.id;
          owner.jokerPullUntil = game.simTime + 2500;
          target.jokerPulledUntil = owner.jokerPullUntil;
          target.jokerPullOwnerId = owner.id;
          target.jokerPullOwnerSide = owner.side;

          applyDamage(target, 4, `${owner.id}-joker-tip`, game.simTime, 500);
          
          const ownerStats = owner.side === "left" ? game.stats.left : game.stats.right;
          if (ownerStats) {
            ownerStats.damageDealt += 4;
            ownerStats.hitsLanded++;
          }
          spawnSparks(target.x, target.y, "#f9a8d4", 16);
          game.screenShake = Math.max(game.screenShake, 8);
          game.floatingTexts = game.floatingTexts || [];
          game.floatingTexts.push({
            x: target.x,
            y: target.y - target.r - 18,
            vy: -55,
            text: "HOOKED!",
            color: "#fb7185",
            life: 0.7,
            maxLife: 0.7
          });
          return true;
        };

        if (thread.state === "flying") {
            thread.x += thread.vx * dt;
            thread.y += thread.vy * dt;
            let bounced = false;
            if (thread.x - thread.r < pad) {
              thread.x = pad + thread.r;
              thread.vx = Math.abs(thread.vx);
              bounced = true;
            } else if (thread.x + thread.r > game.width - pad) {
              thread.x = game.width - pad - thread.r;
              thread.vx = -Math.abs(thread.vx);
              bounced = true;
            }
            if (thread.y - thread.r < pad) {
              thread.y = pad + thread.r;
              thread.vy = Math.abs(thread.vy);
              bounced = true;
            } else if (thread.y + thread.r > game.height - pad) {
              thread.y = game.height - pad - thread.r;
              thread.vy = -Math.abs(thread.vy);
              bounced = true;
            }
            if (bounced) {
              thread.points.push({ x: thread.x, y: thread.y });
              thread.bouncesLeft -= 1;
              spawnSparks(thread.x, thread.y, "#f9a8d4", 6);
              playSound("stringTwang", 0.65, 260);
              if (thread.bouncesLeft <= 0) {
                startPathReturn();
              }
            }

            tryHookTarget();
            return true;
          }

          if (thread.state === "returning") {
            const point = thread.returnIndex <= 0 ? getAnchorPoint() : thread.points[thread.returnIndex];
            const dx = point.x - thread.x;
            const dy = point.y - thread.y;
            const dist = Math.max(1, Math.hypot(dx, dy));
            const speed = (bal.throwSpeed || 580) * 1.25;
            thread.x += (dx / dist) * speed * dt;
            thread.y += (dy / dist) * speed * dt;
            if (dist < 12) {
              thread.returnIndex -= 1;
            }

            if (tryHookTarget()) return true;
            const anchor = getAnchorPoint();
            if (thread.returnIndex < 0 || Math.hypot(thread.x - anchor.x, thread.y - anchor.y) < 14) {
              spawnSparks(owner.x, owner.y, "#f9a8d4", 8);
              return finishGumString();
            }
            return true;
          }

          if (thread.state === "pulling") {
            const target = game.balls.find((ball) => ball.id === thread.targetId);
            if (!target || target.health <= 0) return finishGumString();

            const targetDashing = isWreckerJumpInvulnerable(target) || (target.type === "hammer" && target.hammerState === "launching");
            const tetherIntersected = checkTetherIntersection(thread, game);
            
            if (targetDashing || tetherIntersected) {
              game.floatingTexts = game.floatingTexts || [];
              game.floatingTexts.push({
                x: target.x, y: target.y - target.r - 20, vy: -50,
                text: targetDashing ? "SEVERED! (DASH)" : "SEVERED! (PROJECTILE)",
                color: "#38bdf8", life: 0.8, maxLife: 0.8
              });
              playSound("stringTwang", 1.0, 150);
              return finishGumString();
            }

            const ownerPoint = getAnchorPoint();
            const point = thread.pullIndex <= 0 ? ownerPoint : thread.points[thread.pullIndex];
            const dx = point.x - target.x;
            const dy = point.y - target.y;
            const dist = Math.max(1, Math.hypot(dx, dy));

            const totalBounces = Math.max(0, thread.points.length - 2);
            const pullSpeed = 500 + Math.min(5, totalBounces) * 64;

            const wallRecovery = game.simTime < (thread.lastWallNudgeAt || 0) + 140;
            const currentPullSpeed = wallRecovery ? pullSpeed * 0.45 : pullSpeed;

            target.vx = (dx / dist) * currentPullSpeed;
            target.vy = (dy / dist) * currentPullSpeed;
            target.jokerPulledUntil = game.simTime + 80;
            target.jokerPullOwnerId = owner.id;
            target.jokerPullOwnerSide = owner.side;
            owner.jokerPullUntil = game.simTime + 220;
            thread.x = target.x;
            thread.y = target.y;

            if (dist < Math.max(18, target.r * 0.7)) {
              thread.pullIndex -= 1;

              if (game.simTime >= (target.jokerNextSlamAllowedAt || 0)) {
                target.jokerNextSlamAllowedAt = game.simTime + 120;
                
                let slamCount = thread.slamCount || 0;
                if (slamCount < 6) {
                  thread.slamCount = slamCount + 1;
                  
                  const isNudge = Math.random() < 0.35;
                  const slamDmg = isNudge ? 2.5 : 5.0;

                  applyDamage(target, slamDmg, `${owner.id}-joker-slam-${thread.pullIndex}`, game.simTime, 100);
                  const ownerStats = owner.side === "left" ? game.stats.left : game.stats.right;
                  if (ownerStats) {
                    ownerStats.damageDealt += Math.max(MIN_DAMAGE, Math.round(slamDmg));
                  }
                  spawnSparks(target.x, target.y, "#f9a8d4", 14);
                  playSound("wallBounce", 1.0, 90);

                  game.floatingTexts = game.floatingTexts || [];
                  game.floatingTexts.push({
                    x: target.x, y: target.y - target.r - 20, vy: -50,
                    text: isNudge ? "NUDGED! -2.5" : "WALL SLAM! -5",
                    color: isNudge ? "#22d3ee" : "#fb7185",
                    life: 0.6, maxLife: 0.6
                  });
                }
              }
            }

            if (thread.pullIndex < 0 || Math.hypot(target.x - ownerPoint.x, target.y - ownerPoint.y) < target.r + 14) {
              const releaseAngle = Math.atan2(target.y - ownerPoint.y, target.x - ownerPoint.x);
              target.vx = Math.cos(releaseAngle) * 330;
              target.vy = Math.sin(releaseAngle) * 330;
              target.jokerPulledUntil = 0;
              target.jokerPullOwnerId = null;
              owner.jokerPullTargetId = null;
              owner.jokerPullUntil = 0;
              spawnSparks(owner.x, owner.y, "#f9a8d4", 12);
              return finishGumString();
            }
            return true;
          }

          return false;
        });
      };

      const drawTridentText = (ball, text, color) => {
        game.floatingTexts = game.floatingTexts || [];
        game.floatingTexts.push({
          x: ball.x,
          y: ball.y - ball.r - 22,
          vy: -48,
          text,
          color,
          life: 0.8,
          maxLife: 0.8
        });
      };

    const startTridentRecall = (ball, currentTime) => {
      if (ball.tridentState === "held") return;
      const pinned = game.balls.find((other) => other.id === ball.tridentTargetId);
      if (pinned) {
        const pullAngle = Math.atan2(ball.y - ball.tridentY, ball.x - ball.tridentX);
        const pullSpeed = 620;
        pinned.tridentPinnedUntil = 0;
        pinned.tridentPinOwnerId = null;
        pinned.vx = Math.cos(pullAngle) * pullSpeed;
        pinned.vy = Math.sin(pullAngle) * pullSpeed;
        pinned.knockbackActiveUntil = currentTime + 450;
        spawnSparks(pinned.x, pinned.y, "#facc15", 10);
        game.floatingTexts = game.floatingTexts || [];
        game.floatingTexts.push({
          x: pinned.x,
          y: pinned.y - pinned.r - 18,
          vy: -48,
          text: "PULLED",
          color: "#facc15",
          life: 0.65,
          maxLife: 0.65
        });
      }
      ball.tridentState = "recalling";
      ball.tridentTargetId = null;
      ball.tridentStuckUntil = 0;
    };

    const updateTrident = (ball, target, currentTime, stepDt) => {
      const bal = game.balance.trident || BALANCE.trident;
      const directAimAngle = Math.atan2(target.y - ball.y, target.x - ball.x);
      const mountSide = ball.side === "left" ? 1 : -1;
      const mountAngle = directAimAngle + mountSide * Math.PI / 2;
      const heldPose = {
        x: ball.x + Math.cos(mountAngle) * (ball.r + 19),
        y: ball.y + Math.sin(mountAngle) * (ball.r + 19),
        angle: directAimAngle
      };
      const getTridentAimPoint = (originX, originY, projectileSpeed, maxLeadTime = 0.55) => {
        const dx = target.x - originX;
        const dy = target.y - originY;
        const vx = target.vx || 0;
        const vy = target.vy || 0;
        const speedSq = Math.max(1, projectileSpeed * projectileSpeed);
        const a = vx * vx + vy * vy - speedSq;
        const b = 2 * (dx * vx + dy * vy);
        const c = dx * dx + dy * dy;
        let leadTime = 0;
        const disc = b * b - 4 * a * c;
        if (disc >= 0 && Math.abs(a) > 0.001) {
          const sqrtDisc = Math.sqrt(disc);
          const t1 = (-b - sqrtDisc) / (2 * a);
          const t2 = (-b + sqrtDisc) / (2 * a);
          leadTime = [t1, t2].filter((t) => t > 0).sort((aTime, bTime) => aTime - bTime)[0] || 0;
        } else if (Math.abs(b) > 0.001) {
          leadTime = Math.max(0, -c / b);
        }
        leadTime = clamp(leadTime, 0.08, maxLeadTime);
        return {
          x: clamp(target.x + vx * leadTime, target.r + 24, game.width - target.r - 24),
          y: clamp(target.y + vy * leadTime, target.r + 24, game.height - target.r - 24)
        };
      };
      const throwAimPoint = getTridentAimPoint(heldPose.x, heldPose.y, bal.throwSpeed, 0.5);
      const aimAngle = Math.atan2(throwAimPoint.y - heldPose.y, throwAimPoint.x - heldPose.x);
      heldPose.angle = aimAngle;
      const diveState = ball.tridentDiveState || "idle";
      const targetDistance = Math.hypot(target.x - ball.x, target.y - ball.y);
      const throwReady = currentTime >= (ball.nextShotAt || 0) && targetDistance < 430 && canStartSkillConnection(ball, target, game.balls, currentTime);
      const startDive = diveState === "idle" && (ball.tridentState === "held" || !ball.tridentState) && !throwReady && currentTime >= (ball.tridentNextDiveAt || 0) && targetDistance < 440;
      if (startDive) {
        ball.tridentDiveState = "tracking";
        ball.tridentDiveX = heldPose.x;
        ball.tridentDiveY = heldPose.y;
        ball.tridentDiveAngle = aimAngle;
        ball.tridentDiveStartAt = currentTime;
        ball.tridentDiveUntil = currentTime + bal.diveTrackDuration;
        ball.tridentDiveHitDone = false;
        ball.tridentNextDiveAt = currentTime + bal.diveCooldown;
        drawTridentText(ball, "DIVE", "#38bdf8");
        playSound("webShoot", 0.55, 80);
      }

      if (ball.tridentDiveState && ball.tridentDiveState !== "idle") {
        ball.tridentState = "held";
        ball.tridentAngle = heldPose.angle;
        ball.tridentX = heldPose.x;
        ball.tridentY = heldPose.y;

        if (ball.tridentDiveState === "tracking") {
          const followX = clamp(target.x, target.r + 24, game.width - target.r - 24);
          const followY = clamp(target.y, target.r + 24, game.height - target.r - 24);
          const dx = followX - ball.tridentDiveX;
          const dy = followY - ball.tridentDiveY;
          const dist = Math.hypot(dx, dy);
          if (dist > 1) {
            const chaseProgress = clamp((currentTime - (ball.tridentDiveStartAt || currentTime)) / Math.max(1, bal.diveTrackDuration), 0, 1);
            const catchUp = dist > target.r * 1.7 ? 1.35 : 1;
            const step = Math.min(dist, bal.diveSpeed * (0.86 + chaseProgress * 0.3) * catchUp * stepDt);
            const wiggle = dist > target.r * 1.2 ? 0 : Math.sin(currentTime * 0.018) * 3;
            const desiredAngle = Math.atan2(dy, dx);
            let angleDiff = desiredAngle - (ball.tridentDiveAngle || desiredAngle);
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
            ball.tridentDiveAngle = (ball.tridentDiveAngle || desiredAngle) + angleDiff * 0.32;
            ball.tridentDiveX += (dx / dist) * step + Math.cos(ball.tridentDiveAngle + Math.PI / 2) * wiggle * stepDt;
            ball.tridentDiveY += (dy / dist) * step + Math.sin(ball.tridentDiveAngle + Math.PI / 2) * wiggle * stepDt;
          }
          if (currentTime >= ball.tridentDiveUntil) {
            ball.tridentDiveState = "pause";
            ball.tridentDiveUntil = currentTime + bal.divePauseDuration;
            ball.tridentDiveAngle = Math.atan2(target.y - ball.tridentDiveY, target.x - ball.tridentDiveX);
            drawTridentText(ball, "BITE", "#38bdf8");
          }
          return;
        }

        if (ball.tridentDiveState === "pause") {
          if (currentTime >= ball.tridentDiveUntil) {
            ball.tridentDiveState = "burst";
            ball.tridentDiveUntil = currentTime + 420;
            const dx = target.x - ball.tridentDiveX;
            const dy = target.y - ball.tridentDiveY;
            const dist = Math.hypot(dx, dy);
            const biteHitRadius = Math.min(bal.diveBurstRadius || 44, 52);
            if (dist < target.r + biteHitRadius && !ball.tridentDiveHitDone) {
              ball.tridentDiveHitDone = true;
              const hitAngle = dist > 1 ? Math.atan2(dy, dx) : aimAngle;
              applyDamage(target, bal.diveDamage, `${ball.id}-trident-dive`, currentTime, 650);
              if (ball.side === "left") {
                game.stats.left.damageDealt += Math.max(MIN_DAMAGE, bal.diveDamage);
                game.stats.left.hitsLanded++;
              } else {
                game.stats.right.damageDealt += Math.max(MIN_DAMAGE, bal.diveDamage);
                game.stats.right.hitsLanded++;
              }
              const slowMultiplier = bal.diveSlowMultiplier ?? 0.35;
              target.vx *= slowMultiplier;
              target.vy *= slowMultiplier;
              target.stringSlowUntil = currentTime + (bal.diveSlowDuration || 1600);
              target.webHitFlashUntil = currentTime + 220;
              target.webHitFlashColor = "#38bdf8";
              ball.tridentDiveAngle = hitAngle;
              ball.tridentDiveX = target.x - Math.cos(hitAngle) * target.r * 0.3;
              ball.tridentDiveY = target.y - Math.sin(hitAngle) * target.r * 0.3;
              game.screenShake = Math.max(game.screenShake, 12);
              spawnSparks(target.x, target.y, "#38bdf8", 12);
              spawnSparks(target.x, target.y, "#f8fafc", 8);
              game.floatingTexts = game.floatingTexts || [];
              game.floatingTexts.push({
                x: target.x,
                y: target.y - target.r - 22,
                vy: -54,
                text: "SHARK SLOW",
                color: "#38bdf8",
                life: 0.8,
                maxLife: 0.8
              });
              playSound("explosion", 0.65, 130);
            } else {
              spawnSparks(ball.tridentDiveX, ball.tridentDiveY, "#38bdf8", 8);
              drawTridentText(ball, "SPLASH", "#38bdf8");
              playSound("wallHit", 0.45, 180);
            }
          }
          return;
        }

        if (ball.tridentDiveState === "burst") {
          if (currentTime >= ball.tridentDiveUntil) {
            ball.tridentDiveState = "idle";
            ball.tridentDiveHitDone = false;
          }
          return;
        }
      }

      if (!ball.tridentState || ball.tridentState === "held") {
        ball.tridentState = "held";
        ball.tridentAngle = heldPose.angle;
        ball.tridentX = heldPose.x;
        ball.tridentY = heldPose.y;
        if (throwReady) {
          ball.tridentState = "thrown";
          ball.tridentX = heldPose.x;
          ball.tridentY = heldPose.y;
          ball.tridentVx = Math.cos(aimAngle) * bal.throwSpeed;
          ball.tridentVy = Math.sin(aimAngle) * bal.throwSpeed;
          ball.tridentAngle = aimAngle;
          ball.tridentTargetId = null;
          ball.tridentStuckUntil = 0;
          ball.nextShotAt = currentTime + bal.cooldown;
          drawTridentText(ball, "TRIDENT", "#facc15");
          if (ball.side === "left") game.stats.left.totalShots++;
          else game.stats.right.totalShots++;
          playSound("shieldThrow", 0.8, 120);
        }
        return;
      }

      if (ball.tridentState === "thrown") {
        ball.tridentX += ball.tridentVx * stepDt;
        ball.tridentY += ball.tridentVy * stepDt;
        ball.tridentAngle = Math.atan2(ball.tridentVy, ball.tridentVx);

        const hooked = game.balls.find((other) => other.id === ball.tridentTargetId);
        if (!hooked && Math.hypot(ball.tridentX - target.x, ball.tridentY - target.y) < target.r + 18 && canStartSkillConnection(ball, target, game.balls, currentTime)) {
          ball.tridentTargetId = target.id;
          target.tridentPinnedUntil = currentTime + bal.stuckDuration + 600;
          target.tridentPinOwnerId = ball.id;
          target.vx = ball.tridentVx;
          target.vy = ball.tridentVy;
          applyDamage(target, bal.throwDamage, `${ball.id}-trident-hit`, currentTime, 350);
          if (ball.side === "left") {
            game.stats.left.damageDealt += Math.max(MIN_DAMAGE, bal.throwDamage);
            game.stats.left.hitsLanded++;
          } else {
            game.stats.right.damageDealt += Math.max(MIN_DAMAGE, bal.throwDamage);
            game.stats.right.hitsLanded++;
          }
          target.webHitFlashUntil = currentTime + 180;
          spawnSparks(ball.tridentX, ball.tridentY, "#facc15", 9);
          playSound("webHit", 0.8, 180);
        }

        const pinned = game.balls.find((other) => other.id === ball.tridentTargetId);
        if (pinned) {
          pinned.x = clamp(ball.tridentX - Math.cos(ball.tridentAngle) * (pinned.r + 12), pinned.r + 18, game.width - pinned.r - 18);
          pinned.y = clamp(ball.tridentY - Math.sin(ball.tridentAngle) * (pinned.r + 12), pinned.r + 18, game.height - pinned.r - 18);
          pinned.vx = ball.tridentVx;
          pinned.vy = ball.tridentVy;
        }

        const wallPad = 18;
        const hitWall = ball.tridentX < wallPad || ball.tridentX > game.width - wallPad || ball.tridentY < wallPad || ball.tridentY > game.height - wallPad;
        if (hitWall) {
          ball.tridentX = clamp(ball.tridentX, wallPad, game.width - wallPad);
          ball.tridentY = clamp(ball.tridentY, wallPad, game.height - wallPad);
          ball.tridentState = "stuck";
          ball.tridentStuckUntil = currentTime + bal.stuckDuration;
          ball.tridentVx = 0;
          ball.tridentVy = 0;

          if (pinned) {
            pinned.x = clamp(ball.tridentX - Math.cos(ball.tridentAngle) * (pinned.r + 10), pinned.r + 18, game.width - pinned.r - 18);
            pinned.y = clamp(ball.tridentY - Math.sin(ball.tridentAngle) * (pinned.r + 10), pinned.r + 18, game.height - pinned.r - 18);
            pinned.vx = 0;
            pinned.vy = 0;
            pinned.tridentPinnedUntil = ball.tridentStuckUntil;
            applyDamage(pinned, bal.wallDamage, `${ball.id}-trident-wall`, currentTime, 450);
            if (ball.side === "left") {
              game.stats.left.damageDealt += Math.max(MIN_DAMAGE, bal.wallDamage);
              game.stats.left.hitsLanded++;
            } else {
              game.stats.right.damageDealt += Math.max(MIN_DAMAGE, bal.wallDamage);
              game.stats.right.hitsLanded++;
            }
            game.screenShake = Math.max(game.screenShake, 8);
            drawTridentText(ball, "PINNED", "#65a30d");
          } else {
            drawTridentText(ball, "STUCK", "#facc15");
          }
          spawnSparks(ball.tridentX, ball.tridentY, "#facc15", 12);
        }
        return;
      }

      if (ball.tridentState === "stuck") {
        const pinned = game.balls.find((other) => other.id === ball.tridentTargetId);
        if (pinned && currentTime < ball.tridentStuckUntil) {
          pinned.x = clamp(ball.tridentX - Math.cos(ball.tridentAngle) * (pinned.r + 10), pinned.r + 18, game.width - pinned.r - 18);
          pinned.y = clamp(ball.tridentY - Math.sin(ball.tridentAngle) * (pinned.r + 10), pinned.r + 18, game.height - pinned.r - 18);
          pinned.vx = 0;
          pinned.vy = 0;
        }
        if (currentTime >= ball.tridentStuckUntil) startTridentRecall(ball, currentTime);
        return;
      }

      if (ball.tridentState === "recalling") {
        const dx = ball.x - ball.tridentX;
        const dy = ball.y - ball.tridentY;
        const dist = Math.hypot(dx, dy);
        if (dist < ball.r + 14) {
          ball.tridentState = "held";
          ball.tridentTargetId = null;
          return;
        }
        const angle = Math.atan2(dy, dx);
        ball.tridentAngle = angle;
        ball.tridentX += Math.cos(angle) * bal.recallSpeed * stepDt;
        ball.tridentY += Math.sin(angle) * bal.recallSpeed * stepDt;
      }
    };

    const updateFeralClaw = (ball, target, currentTime) => {
      const bal = game.balance.feralClaw || BALANCE.feralClaw;
      const lowHealth = ball.health <= (bal.lowHealthThreshold || 45);
      if (!ball.feralUltimateTriggered && ball.health <= (bal.ultimateThreshold || 28)) {
        ball.feralUltimateTriggered = true;
        ball.feralUltimateUntil = currentTime + (bal.ultimateDuration || 4800);
        ball.feralNextSlashAt = currentTime;
        ball.feralNextPounceAt = currentTime + 180;
        game.floatingTexts.push({
          x: ball.x, y: ball.y - ball.r - 22, vy: -38,
          text: "FERAL FRENZY", color: "#fb923c", life: 1, maxLife: 1
        });
        game.screenShake = Math.max(game.screenShake, 8);
        spawnSparks(ball.x, ball.y, "#fb923c", 18);
        playSound("knifeHit", 0.9, 55);
      }

      const ultimateActive = currentTime < (ball.feralUltimateUntil || 0);
      const cooldownMult = (lowHealth ? (bal.lowHealthCooldownMult || 0.78) : 1) * (ultimateActive ? (bal.ultimateCooldownMult || 0.48) : 1);
      const regenMult = lowHealth ? (bal.lowHealthRegenMult || 0.72) : 1;
      const targetAngle = Math.atan2(target.y - ball.y, target.x - ball.x);
      const targetDist = Math.hypot(target.x - ball.x, target.y - ball.y);
      const damageMult = ultimateActive ? (bal.ultimateDamageMult || 1.1) : 1;
      const speedMult = ultimateActive ? (bal.ultimateSpeedMult || 1.08) : 1;

      if ((lowHealth || ultimateActive) && ball.feralPounceState === "idle" && !(ball.feralSlashUntil && currentTime < ball.feralSlashUntil)) {
        const speed = Math.hypot(ball.vx, ball.vy);
        if (speed > 20) {
          const heading = Math.atan2(ball.vy, ball.vx);
          const twitch = (Math.sin(currentTime * 0.031 + ball.id.length) + Math.sin(currentTime * 0.013)) * (bal.rageJitter || 36) * 0.00022;
          ball.vx = Math.cos(heading + twitch) * speed;
          ball.vy = Math.sin(heading + twitch) * speed;
        }
      }

      if (ball.health < MAX_HEALTH && currentTime - (ball.lastDamageTakenAt || 0) >= bal.regenDelay) {
        if (currentTime >= (ball.feralNextRegenAt || 0)) {
          const healed = Math.min(bal.regenAmount, MAX_HEALTH - ball.health);
          ball.health += healed;
          ball.feralNextRegenAt = currentTime + bal.regenInterval * regenMult;
          ball.feralRegenFlashUntil = currentTime + 280;
          const ownerStats = ball.side === "left" ? game.stats.left : game.stats.right;
          ownerStats.healed += healed;
          spawnSparks(ball.x, ball.y, "#86efac", 5);
        }
      } else {
        ball.feralNextRegenAt = Math.max(ball.feralNextRegenAt || 0, currentTime + 120);
      }

      ball.feralRushTrail = (ball.feralRushTrail || []).filter((point) => currentTime - point.time < 420);

      if (ball.feralPounceState === "windup") {
        ball.feralPounceAngle = targetAngle;
        ball.vx = ball.vx * 0.76 - Math.cos(targetAngle) * 10;
        ball.vy = ball.vy * 0.76 - Math.sin(targetAngle) * 10;
        if (currentTime >= (ball.feralPounceWindupUntil || 0)) {
          ball.feralPounceState = "launch";
          ball.feralPounceStartAt = currentTime;
          ball.feralPounceUntil = currentTime + bal.pounceDuration;
          playSound("webShoot", 0.8, 65);
        }
        return;
      }

      if (ball.feralPounceState === "launch" && currentTime < (ball.feralPounceUntil || 0)) {
        const rushProgress = clamp((currentTime - ball.feralPounceStartAt) / Math.max(1, bal.pounceDuration), 0, 1);
        const wobble = Math.sin(rushProgress * Math.PI * 5) * 0.045;
        const rushAngle = ball.feralPounceAngle + wobble;
        const rushSpeed = bal.pounceSpeed * speedMult * (1.12 - rushProgress * 0.12);
        ball.vx = Math.cos(rushAngle) * rushSpeed;
        ball.vy = Math.sin(rushAngle) * rushSpeed;
        if (currentTime - (ball.feralLastTrailAt || 0) >= 24) {
          ball.feralRushTrail.push({ x: ball.x, y: ball.y, angle: rushAngle, time: currentTime });
          ball.feralLastTrailAt = currentTime;
        }
        if (!ball.feralPounceHit && targetDist <= ball.r + target.r + 8) {
          ball.feralPounceHit = true;
          ball.feralPounceState = "settle";
          ball.feralPounceSettleUntil = currentTime + (ultimateActive ? bal.pounceOvershoot * 0.58 : bal.pounceOvershoot);
          applyDamage(target, bal.pounceDamage * damageMult, `${ball.id}-feral-pounce`, currentTime, bal.pounceCooldown - 50);
          if (!hasStringBounceGuard(target)) {
            target.vx += Math.cos(ball.feralPounceAngle) * bal.slashKnockback * 1.8;
            target.vy += Math.sin(ball.feralPounceAngle) * bal.slashKnockback * 1.8;
          }
          if (ultimateActive) {
            const reboundAngle = ball.feralPounceAngle + Math.PI + Math.sin(currentTime * 0.019) * 0.65;
            ball.vx = Math.cos(reboundAngle) * bal.slashRecoil * 1.45;
            ball.vy = Math.sin(reboundAngle) * bal.slashRecoil * 1.45;
            ball.feralNextSlashAt = currentTime + 70;
            ball.feralNextPounceAt = Math.min(ball.feralNextPounceAt, currentTime + bal.pounceCooldown * cooldownMult);
          } else {
            ball.vx = Math.cos(ball.feralPounceAngle) * bal.pounceSpeed * 0.42;
            ball.vy = Math.sin(ball.feralPounceAngle) * bal.pounceSpeed * 0.42;
          }
          const ownerStats = ball.side === "left" ? game.stats.left : game.stats.right;
          ownerStats.damageDealt += Math.max(MIN_DAMAGE, Math.round(bal.pounceDamage * damageMult));
          ownerStats.hitsLanded++;
          game.screenShake = Math.max(game.screenShake, 10);
          spawnSparks(target.x, target.y, "#facc15", 14);
          playSound("knifeHit", 1, 110);
        }
        return;
      }

      if (ball.feralPounceState === "launch") {
        ball.feralPounceState = "settle";
        ball.feralPounceSettleUntil = currentTime + bal.pounceOvershoot;
        ball.vx *= 0.48;
        ball.vy *= 0.48;
      }

      if (ball.feralPounceState === "settle") {
        ball.vx *= 0.91;
        ball.vy *= 0.91;
        if (currentTime < (ball.feralPounceSettleUntil || 0)) return;
        ball.feralPounceState = "idle";
      }

      if (targetDist >= bal.pounceMinRange && targetDist <= bal.pounceMaxRange && currentTime >= (ball.feralNextPounceAt || 0)) {
        ball.feralPounceAngle = targetAngle;
        ball.feralPounceState = "windup";
        ball.feralPounceStartAt = currentTime;
        ball.feralPounceWindupUntil = currentTime + bal.pounceWindup;
        ball.feralNextPounceAt = currentTime + bal.pounceCooldown * cooldownMult;
        ball.feralPounceHit = false;
        game.floatingTexts.push({
          x: ball.x, y: ball.y - ball.r - 18, vy: -42,
          text: "CLAW RUSH", color: "#facc15", life: 0.62, maxLife: 0.62
        });
        return;
      }

      if (ball.feralSlashUntil && currentTime < ball.feralSlashUntil) {
        const slashProgress = clamp((currentTime - ball.feralSlashStartAt) / Math.max(1, bal.slashDuration), 0, 1);
        if (slashProgress < 0.68) {
          const lunge = bal.slashLunge * Math.sin((slashProgress / 0.68) * Math.PI);
          ball.vx += Math.cos(ball.feralSlashAngle) * lunge * 0.075;
          ball.vy += Math.sin(ball.feralSlashAngle) * lunge * 0.075;
        }
        if (!ball.feralSlashHitDone && currentTime >= ball.feralSlashHitAt) {
          ball.feralSlashHitDone = true;
          if (targetDist <= ball.r + target.r + bal.slashRange + 16) {
            applyDamage(target, bal.slashDamage * damageMult, `${ball.id}-feral-claw-${ball.feralSlashSide}`, currentTime, bal.slashCooldown * 0.7);
            if (!hasStringBounceGuard(target)) {
              target.vx += Math.cos(ball.feralSlashAngle) * bal.slashKnockback;
              target.vy += Math.sin(ball.feralSlashAngle) * bal.slashKnockback;
            }
            ball.vx -= Math.cos(ball.feralSlashAngle) * bal.slashRecoil;
            ball.vy -= Math.sin(ball.feralSlashAngle) * bal.slashRecoil;
            ball.feralSlashRecoilUntil = currentTime + 120;
            const ownerStats = ball.side === "left" ? game.stats.left : game.stats.right;
            ownerStats.damageDealt += Math.max(MIN_DAMAGE, Math.round(bal.slashDamage * damageMult));
            ownerStats.hitsLanded++;
            spawnSparks(target.x, target.y, ultimateActive ? "#fb923c" : "#e5e7eb", ultimateActive ? 13 : 8);
            playSound("knifeHit", 0.85, ball.feralSlashSide > 0 ? 95 : 125);
          }
        }
        return;
      }

      const slashReach = ball.r + target.r + bal.slashRange;
      if (targetDist <= slashReach && currentTime >= (ball.feralNextSlashAt || 0)) {
        ball.feralSlashSide = -(ball.feralSlashSide || 1);
        ball.feralSlashAngle = targetAngle;
        ball.feralSlashStartAt = currentTime;
        ball.feralSlashUntil = currentTime + bal.slashDuration;
        ball.feralSlashHitAt = currentTime + bal.slashWindup;
        ball.feralSlashHitDone = false;
        ball.feralNextSlashAt = currentTime + bal.slashCooldown * cooldownMult;
      }
    };

    const updateShadow = (ball, target, currentTime, stepDt) => {
      const bal = game.balance.shadow || BALANCE.shadow;
      ball.shadowMinions = (ball.shadowMinions || []).filter((minion) => minion.health > 0 && currentTime < minion.createdTime + bal.minionLife).slice(0, bal.maxMinions);

      const targetAngle = Math.atan2(target.y - ball.y, target.x - ball.x);
      const targetDist = Math.hypot(target.x - ball.x, target.y - ball.y);
      if (ball.shadowComboSecondAt && currentTime >= ball.shadowComboSecondAt) {
        ball.shadowComboSecondAt = 0;
        if (target.id === ball.shadowComboTargetId && targetDist <= ball.r + target.r + bal.slashRange + 8) {
          const secondAngle = Math.atan2(target.y - ball.y, target.x - ball.x) + 0.18;
          ball.shadowSlashUntil = currentTime + 240;
          ball.shadowSlashAngle = secondAngle;
          applyDamage(target, bal.comboSecondDamage, `${ball.id}-shadow-combo-second`, currentTime, bal.slashCooldown - 10);
          if (!hasStringBounceGuard(target)) {
            target.vx += Math.cos(secondAngle) * 170;
            target.vy += Math.sin(secondAngle) * 170;
          }
          if (ball.side === "left") {
            game.stats.left.damageDealt += Math.max(MIN_DAMAGE, bal.comboSecondDamage);
            game.stats.left.hitsLanded++;
          } else {
            game.stats.right.damageDealt += Math.max(MIN_DAMAGE, bal.comboSecondDamage);
            game.stats.right.hitsLanded++;
          }
          target.webHitFlashUntil = currentTime + 170;
          spawnSparks(target.x, target.y, "#e9d5ff", 8);
        }
        ball.shadowComboTargetId = null;
      }
      const switchCandidate = (ball.shadowMinions || [])
        .filter((minion) => minion.health > 0 && Math.hypot(minion.x - target.x, minion.y - target.y) <= bal.switchRange)
        .sort((a, b) => Math.hypot(a.x - target.x, a.y - target.y) - Math.hypot(b.x - target.x, b.y - target.y))[0];
      if (switchCandidate && currentTime >= (ball.shadowNextSwitchAt || 0) && currentTime >= (ball.shadowNextSlashAt || 0)) {
        const oldX = ball.x;
        const oldY = ball.y;
        ball.x = switchCandidate.x;
        ball.y = switchCandidate.y;
        switchCandidate.x = oldX;
        switchCandidate.y = oldY;
        ball.vx *= 0.65;
        ball.vy *= 0.65;
        ball.shadowNextSwitchAt = currentTime + bal.switchCooldown;
        ball.shadowNextSlashAt = currentTime + bal.slashCooldown;
        ball.shadowSlashUntil = currentTime + 260;
        ball.shadowSlashAngle = Math.atan2(target.y - ball.y, target.x - ball.x);
        applyDamage(target, bal.switchDamage, `${ball.id}-shadow-switch-knife`, currentTime, bal.switchCooldown - 10);
        if (!hasStringBounceGuard(target)) {
          target.vx += Math.cos(ball.shadowSlashAngle) * 240;
          target.vy += Math.sin(ball.shadowSlashAngle) * 240;
        }
        if (ball.side === "left") {
          game.stats.left.damageDealt += Math.max(MIN_DAMAGE, bal.switchDamage);
          game.stats.left.hitsLanded++;
        } else {
          game.stats.right.damageDealt += Math.max(MIN_DAMAGE, bal.switchDamage);
          game.stats.right.hitsLanded++;
        }
        
        // Switch shockwave checks
        const hitOld = Math.hypot(target.x - oldX, target.y - oldY) <= target.r + 64;
        const hitNew = Math.hypot(target.x - ball.x, target.y - ball.y) <= target.r + 64;
        if (hitOld || hitNew) {
          applyDamage(target, 3, `${ball.id}-shadow-shockwave`, currentTime, 400);
          target.shadowSlowedUntil = currentTime + 1500;
          if (ball.side === "left") game.stats.left.damageDealt += 3;
          else game.stats.right.damageDealt += 3;
          spawnSparks(target.x, target.y, "#a78bfa", 12);
        }

        spawnSparks(ball.x, ball.y, "#c4b5fd", 14);
        spawnSparks(switchCandidate.x, switchCandidate.y, "#6d28d9", 8);
        game.screenShake = Math.max(game.screenShake, 6);
        game.floatingTexts = game.floatingTexts || [];
        game.floatingTexts.push({
          x: ball.x,
          y: ball.y - ball.r - 22,
          vy: -45,
          text: "SHADOW SWITCH",
          color: "#c4b5fd",
          life: 0.75,
          maxLife: 0.75
        });
        playSound("knifeHit", 0.8, 120);
      }
      if (targetDist <= ball.r + target.r + bal.slashRange && currentTime >= (ball.shadowNextSlashAt || 0)) {
        const comboReady = targetDist <= ball.r + target.r + (bal.comboRange || 36);
        ball.shadowNextSlashAt = currentTime + bal.slashCooldown;
        ball.shadowSlashUntil = currentTime + (comboReady ? 330 : 240);
        ball.shadowSlashAngle = targetAngle;
        ball.shadowCommandUntil = currentTime + bal.commandDuration;
        ball.shadowComboSecondAt = comboReady ? currentTime + 150 : 0;
        ball.shadowComboTargetId = comboReady ? target.id : null;
        target.shadowMarkedUntil = currentTime + bal.markDuration;
        target.shadowMarkedBy = ball.id;
        applyDamage(target, bal.slashDamage, `${ball.id}-shadow-slash`, currentTime, bal.slashCooldown - 10);
        if (!hasStringBounceGuard(target)) {
          target.vx += Math.cos(targetAngle) * (comboReady ? 150 : 210);
          target.vy += Math.sin(targetAngle) * (comboReady ? 150 : 210);
        }
        if (ball.side === "left") {
          game.stats.left.damageDealt += Math.max(MIN_DAMAGE, bal.slashDamage);
          game.stats.left.hitsLanded++;
        } else {
          game.stats.right.damageDealt += Math.max(MIN_DAMAGE, bal.slashDamage);
          game.stats.right.hitsLanded++;
        }
        target.webHitFlashUntil = currentTime + 160;
        spawnSparks(target.x, target.y, "#c4b5fd", 9);
        playSound("hammerHit", 0.65, -180);
      }

      if (currentTime >= (ball.shadowNextSummonAt || 0) && ball.shadowMinions.length < bal.maxMinions) {
        const angle = Math.random() * Math.PI * 2;
        const spawnDist = ball.r + 12;
        const minion = {
          id: `${ball.id}-shadow-${currentTime}-${ball.shadowMinions.length}`,
          type: "shadowMinion",
          name: "Shadow Minion",
          side: ball.side,
          ownerId: ball.id,
          x: ball.x + Math.cos(angle) * spawnDist,
          y: ball.y + Math.sin(angle) * spawnDist,
          vx: Math.cos(angle) * bal.minionSpeed,
          vy: Math.sin(angle) * bal.minionSpeed,
          r: 8,
          health: bal.minionHealth || BALANCE.shadow.minionHealth,
          maxHealth: bal.minionHealth || BALANCE.shadow.minionHealth,
          hitsLeft: 2,
          flankSlot: ball.shadowMinions.length % 3,
          createdTime: currentTime,
          nextHitAt: 0,
          pulseOffset: Math.random() * Math.PI * 2
        };
        ball.shadowMinions.push(minion);
        ball.shadowNextSummonAt = currentTime + bal.summonCooldown;
        spawnSparks(minion.x, minion.y, "#6d28d9", 8);
        game.floatingTexts = game.floatingTexts || [];
        game.floatingTexts.push({
          x: ball.x, y: ball.y - ball.r - 20, vy: -45,
          text: "ARISE", color: "#c4b5fd", life: 0.7, maxLife: 0.7
        });
        if (ball.side === "left") game.stats.left.totalShots++;
        else game.stats.right.totalShots++;
      }

      ball.shadowMinions.forEach((minion) => {
        if (!minion.trail) minion.trail = [];
        minion.trail.push({ x: minion.x, y: minion.y });
        if (minion.trail.length > 6) minion.trail.shift();

        const commandActive = currentTime < (ball.shadowCommandUntil || 0);
        const moveSpeed = Math.hypot(target.vx || 0, target.vy || 0);
        const forwardAngle = moveSpeed > 35 ? Math.atan2(target.vy, target.vx) : Math.atan2(target.y - ball.y, target.x - ball.x);
        const sideSign = minion.flankSlot === 1 ? -1 : 1;
        const slotAngle = minion.flankSlot === 2
          ? forwardAngle + Math.PI
          : forwardAngle + Math.PI * 0.72 * sideSign;
        const contactDist = target.r + minion.r + 5;
        const flankDist = contactDist + 18;
        const slotX = clamp(target.x + Math.cos(slotAngle) * flankDist, minion.r + 20, game.width - minion.r - 20);
        const slotY = clamp(target.y + Math.sin(slotAngle) * flankDist, minion.r + 20, game.height - minion.r - 20);
        const dx = slotX - minion.x;
        const dy = slotY - minion.y;
        const dist = Math.max(1, Math.hypot(dx, dy));
        const toTargetX = target.x - minion.x;
        const toTargetY = target.y - minion.y;
        const targetDist = Math.max(1, Math.hypot(toTargetX, toTargetY));
        const speedMult = commandActive ? 1.55 : 1;
        const orbitDir = minion.orbitDir || (minion.id.length % 2 === 0 ? 1 : -1);
        minion.orbitDir = orbitDir;
        let desiredVx;
        let desiredVy;
        if (targetDist <= contactDist) {
          desiredVx = -(toTargetX / targetDist) * bal.minionSpeed * 1.35 + (-toTargetY / targetDist) * bal.minionSpeed * 0.32 * orbitDir;
          desiredVy = -(toTargetY / targetDist) * bal.minionSpeed * 1.35 + (toTargetX / targetDist) * bal.minionSpeed * 0.32 * orbitDir;
          const pushOut = contactDist - targetDist;
          minion.x -= (toTargetX / targetDist) * pushOut;
          minion.y -= (toTargetY / targetDist) * pushOut;
        } else if (dist < 10) {
          desiredVx = (-toTargetY / targetDist) * bal.minionSpeed * 0.55 * orbitDir;
          desiredVy = (toTargetX / targetDist) * bal.minionSpeed * 0.55 * orbitDir;
        } else {
          desiredVx = (dx / dist) * bal.minionSpeed * speedMult;
          desiredVy = (dy / dist) * bal.minionSpeed * speedMult;
        }
        ball.shadowMinions.forEach((other) => {
          if (other === minion) return;
          const sepDx = minion.x - other.x;
          const sepDy = minion.y - other.y;
          const sepDist = Math.max(1, Math.hypot(sepDx, sepDy));
          if (sepDist < minion.r * 3.2) {
            const push = (minion.r * 3.2 - sepDist) * 4.5;
            desiredVx += (sepDx / sepDist) * push;
            desiredVy += (sepDy / sepDist) * push;
          }
        });
        minion.vx += (desiredVx - minion.vx) * (commandActive ? 0.16 : 0.07);
        minion.vy += (desiredVy - minion.vy) * (commandActive ? 0.16 : 0.07);
        minion.x += minion.vx * stepDt;
        minion.y += minion.vy * stepDt;

        const pad = 18 + minion.r;
        if (minion.x < pad) { minion.x = pad; minion.vx = Math.abs(minion.vx); }
        if (minion.x > game.width - pad) { minion.x = game.width - pad; minion.vx = -Math.abs(minion.vx); }
        if (minion.y < pad) { minion.y = pad; minion.vy = Math.abs(minion.vy); }
        if (minion.y > game.height - pad) { minion.y = game.height - pad; minion.vy = -Math.abs(minion.vy); }

        const attackAngle = Math.atan2(minion.y - target.y, minion.x - target.x);
        const flankDiffRaw = attackAngle - slotAngle;
        const flankDiff = Math.abs(Math.atan2(Math.sin(flankDiffRaw), Math.cos(flankDiffRaw)));
        if (targetDist <= contactDist + 2 && flankDiff < 0.95 && currentTime >= (minion.nextHitAt || 0)) {
          minion.nextHitAt = currentTime + bal.minionHitCooldown;
          const markedBonus = target.shadowMarkedBy === ball.id && currentTime < (target.shadowMarkedUntil || 0) ? 1 : 0;
          const minionDamage = bal.minionDamage + markedBonus;
          applyDamage(target, minionDamage, `${minion.id}-hit`, currentTime, bal.minionHitCooldown - 10);
          const hitAngle = Math.atan2(target.y - minion.y, target.x - minion.x);
          if (!hasStringBounceGuard(target)) {
            target.vx += Math.cos(hitAngle) * 130;
            target.vy += Math.sin(hitAngle) * 130;
          }
          if (ball.side === "left") {
            game.stats.left.damageDealt += Math.max(MIN_DAMAGE, minionDamage);
            game.stats.left.hitsLanded++;
          } else {
            game.stats.right.damageDealt += Math.max(MIN_DAMAGE, minionDamage);
            game.stats.right.hitsLanded++;
          }
          minion.hitsLeft = (minion.hitsLeft ?? 2) - 1;
          if (minion.hitsLeft <= 0) minion.health = 0;
          minion.vx = -Math.cos(hitAngle) * bal.minionSpeed;
          minion.vy = -Math.sin(hitAngle) * bal.minionSpeed;
          spawnSparks(minion.x, minion.y, "#8b5cf6", minion.health <= 0 ? 10 : 5);
          if (minion.health <= 0) {
            game.floatingTexts = game.floatingTexts || [];
            game.floatingTexts.push({
              x: minion.x,
              y: minion.y - minion.r - 10,
              vy: -38,
              text: "POOF",
              color: "#c4b5fd",
              life: 0.55,
              maxLife: 0.55
            });
          }
        }
      });
      ball.shadowMinions = ball.shadowMinions.filter((minion) => minion.health > 0);
    };


    const getMirrorClone = (ball) => ({
      x: game.width - ball.x,
      y: game.height - ball.y,
      r: ball.r * ((game.balance.mirror || BALANCE.mirror).cloneRadiusScale || 0.82)
    });

    const updateMirror = (ball, target, currentTime) => {
      const bal = game.balance.mirror || BALANCE.mirror;
      const clone = getMirrorClone(ball);
      const distToTarget = Math.hypot(target.x - ball.x, target.y - ball.y);
      if (ball.mirrorNextSwitchAt == null) ball.mirrorNextSwitchAt = currentTime + bal.switchCooldown;
      if (currentTime >= ball.mirrorNextSwitchAt && distToTarget > 120) {
        const oldX = ball.x;
        const oldY = ball.y;
        ball.x = clone.x;
        ball.y = clone.y;
        ball.vx = -ball.vx;
        ball.vy = -ball.vy;
        ball.mirrorNextSwitchAt = currentTime + bal.switchCooldown;
        ball.mirrorSwitchFlashUntil = currentTime + 420;
        ball.mirrorFlashUntil = currentTime + 420;
        spawnSparks(oldX, oldY, "#67e8f9", 12);
        spawnSparks(ball.x, ball.y, "#f8fafc", 14);
        game.screenShake = Math.max(game.screenShake, 5);
        game.floatingTexts = game.floatingTexts || [];
        game.floatingTexts.push({
          x: ball.x, y: ball.y - ball.r - 20, vy: -45,
          text: "SWITCH", color: "#67e8f9", life: 0.7, maxLife: 0.7
        });
        playSound("shieldCatch", 0.8, 180);
        return;
      }

      if (Math.hypot(clone.x - target.x, clone.y - target.y) < clone.r + target.r && currentTime >= (ball.mirrorNextHitAt || 0)) {
        ball.mirrorNextHitAt = currentTime + bal.hitCooldown;
        ball.mirrorFlashUntil = currentTime + 260;
        applyDamage(target, bal.cloneDamage, `${ball.id}-mirror-clone`, currentTime, bal.hitCooldown - 10);
        const hitAngle = Math.atan2(target.y - clone.y, target.x - clone.x);
        if (!hasStringBounceGuard(target)) {
          target.vx += Math.cos(hitAngle) * bal.knockback;
          target.vy += Math.sin(hitAngle) * bal.knockback;
        }
        if (ball.side === "left") {
          game.stats.left.damageDealt += Math.max(MIN_DAMAGE, bal.cloneDamage);
          game.stats.left.hitsLanded++;
        } else {
          game.stats.right.damageDealt += Math.max(MIN_DAMAGE, bal.cloneDamage);
          game.stats.right.hitsLanded++;
        }
        target.webHitFlashUntil = currentTime + 150;
        spawnSparks(clone.x, clone.y, "#67e8f9", 10);
      }
    };

    const updateSpore = (sporeBall, target, currentTime) => {
      const bal = game.balance;
      if (sporeBall.nextSporeAt > currentTime) return;

      for (let i = 0; i < 5; i++) {
        const pad = 120;
        const rx = clamp(sporeBall.x + (Math.random() - 0.5) * 280, pad, game.width - pad);
        const ry = clamp(sporeBall.y + (Math.random() - 0.5) * 280, pad, game.height - pad);

        game.cacti.push({
          ownerId: sporeBall.id,
          ownerSide: sporeBall.side,
          x: rx,
          y: ry,
          r: 0,
          targetR: 22,
          createdTime: currentTime,
          growthDuration: bal.spore.growthDuration,
          life: bal.spore.cactusLife,
          charges: 2
        });

        spawnSparks(rx, ry, "#14b8a6", 4);
      }

      if (sporeBall.side === "left") game.stats.left.totalShots++;
      else game.stats.right.totalShots++;

      sporeBall.nextSporeAt = currentTime + bal.spore.cooldown;
      playSound("sporeShoot");
    };

    const updateSpiderWebProjectile = (stepDt, balls) => {
      balls.forEach(ball => {
        if (ball.type !== "spider" || ball.webState !== "shooting") return;
        ball.webX += ball.webVx * stepDt;
        ball.webY += ball.webVy * stepDt;
        const pad = 18;
        if (ball.webX < pad || ball.webX > game.width - pad || ball.webY < pad || ball.webY > game.height - pad) {
          ball.webState = "idle";
          return;
        }
        const target = balls.find(o => o.side !== ball.side);
        if (Math.hypot(ball.webX - target.x, ball.webY - target.y) < target.r + 6) {
          if (!canStartSkillConnection(ball, target, balls, game.simTime)) {
            ball.webState = "idle";
            ball.webTargetId = null;
            spawnSparks(ball.webX, ball.webY, "#94a3b8", 5);
            return;
          }
          ball.webState = "pulling";
          ball.webTargetId = target.id;
          ball.webBouncesLeft = 3;
          ball.webLastTargetX = target.x;
          ball.webLastTargetY = target.y;
          ball.webStateUntil = game.simTime + game.balance.spider.pullDuration;
          spawnSparks(ball.webX, ball.webY, "#818cf8", 8);
          playSound("webHit");
        }
      });
    };

    const updateFireCars = (stepDt, balls) => {
      if (!game.fireCars || game.fireCars.length === 0) return;

      game.fireCars = game.fireCars.filter(car => {
        const path = car.path || [{ x: car.startX, y: car.startY }, { x: car.endX, y: car.endY }];
        const totalDist = car.pathLength || Math.hypot(car.endX - car.startX, car.endY - car.startY);
        if (totalDist <= 0 || path.length < 2) return false;

        car.distanceTravelled = (car.distanceTravelled || 0) + car.speed * stepDt;
        while (car.distanceTravelled >= totalDist && car.pass < car.maxPasses) {
          car.distanceTravelled -= totalDist;
          car.pass += 1;
          playSound("megaLeap", 0.65, 120);
        }
        if (car.distanceTravelled >= totalDist) {
          const owner = balls.find((ball) => ball.id === car.ownerId);
          if (owner) {
            const fsBal = game.balance.fireSkull || BALANCE.fireSkull;
            owner.fsNextRoadAt = game.simTime + (fsBal.cooldown || 8000);
            game.floatingTexts = game.floatingTexts || [];
            game.floatingTexts.push({
              x: owner.x, y: owner.y - owner.r - 20, vy: -38,
              text: "ENGINE COOLDOWN", color: "#facc15", life: 0.8, maxLife: 0.8
            });
          }
          return false;
        }

        car.progress = car.distanceTravelled / totalDist;
        let remaining = car.distanceTravelled;
        let activeStart = path[0];
        let activeEnd = path[1];
        for (let i = 1; i < path.length; i++) {
          const segmentStart = path[i - 1];
          const segmentEnd = path[i];
          const segmentLength = Math.hypot(segmentEnd.x - segmentStart.x, segmentEnd.y - segmentStart.y);
          activeStart = segmentStart;
          activeEnd = segmentEnd;
          if (remaining <= segmentLength || i === path.length - 1) {
            const segmentProgress = segmentLength > 0 ? Math.min(1, remaining / segmentLength) : 0;
            car.x = segmentStart.x + (segmentEnd.x - segmentStart.x) * segmentProgress;
            car.y = segmentStart.y + (segmentEnd.y - segmentStart.y) * segmentProgress;
            break;
          }
          remaining -= segmentLength;
        }
        const totalDx = activeEnd.x - activeStart.x;
        const totalDy = activeEnd.y - activeStart.y;
        car.angle = Math.atan2(totalDy, totalDx);

        // Tail fire particles
        if (Math.random() < 0.65) {
          game.particles.push({
            x: car.x + (Math.random() - 0.5) * car.radius * 0.8,
            y: car.y + (Math.random() - 0.5) * car.radius * 0.8,
            vx: -Math.cos(car.angle) * 120 + (Math.random() - 0.5) * 80,
            vy: -Math.sin(car.angle) * 120 + (Math.random() - 0.5) * 80,
            color: Math.random() < 0.6 ? "#ea580c" : "#facc15",
            radius: 3 + Math.random() * 5,
            life: 0.35 + Math.random() * 0.35,
            maxLife: 0.7
          });
        }

        balls.forEach(ball => {
          if (ball.side === car.ownerSide) return;
          const d = Math.hypot(ball.x - car.x, ball.y - car.y);
          const carHitRadius = car.radius * ((game.balance.fireSkull?.carHitboxScale) || BALANCE.fireSkull.carHitboxScale || 1.32);
          if (d < ball.r + carHitRadius) {
            applyDamage(ball, car.damage, `${car.id}-pass-${car.pass}-hit-${ball.id}`, game.simTime, 400);
            const recoilForce = Math.max(1280, (game.balance.fireSkull?.carKnockback) || BALANCE.fireSkull.carKnockback || 1280);
            ball.vx += Math.cos(car.angle) * recoilForce;
            ball.vy += Math.sin(car.angle) * recoilForce;
            ball.skillLockedUntil = Math.max(ball.skillLockedUntil || 0, game.simTime + 1400);
            game.screenShake = Math.max(game.screenShake || 0, 20);
            playSound("explosion", 0.9, 130);
            spawnSparks(ball.x, ball.y, "#ef4444", 18);
            game.floatingTexts = game.floatingTexts || [];
            game.floatingTexts.push({
              x: ball.x, y: ball.y - ball.r - 18, vy: -42,
              text: "SKILL LOCK", color: "#facc15", life: 0.7, maxLife: 0.7
            });
          }
        });

        return true;
      });
    };

    const updateMines = (stepDt, balls) => {
      game.mines = game.mines.filter((mine) => {
        const enemy = balls.find(b => b.side !== mine.ownerSide);
        
        if (mine.isHoming && !mine.triggerTime) {
          const targetDx = enemy.x - mine.x;
          const targetDy = enemy.y - mine.y;
          const targetDist = Math.hypot(targetDx, targetDy);
          if (targetDist > 0) {
            const desiredVx = (targetDx / targetDist) * 110;
            const desiredVy = (targetDy / targetDist) * 110;
            mine.vx = (mine.vx || 0) + (desiredVx - (mine.vx || 0)) * 0.035;
            mine.vy = (mine.vy || 0) + (desiredVy - (mine.vy || 0)) * 0.035;
          }
          mine.x += mine.vx * stepDt;
          mine.y += mine.vy * stepDt;
          const pad = 18;
          if (mine.x < pad) { mine.x = pad; mine.vx = Math.abs(mine.vx); }
          if (mine.x > game.width - pad) { mine.x = game.width - pad; mine.vx = -Math.abs(mine.vx); }
          if (mine.y < pad) { mine.y = pad; mine.vy = Math.abs(mine.vy); }
          if (mine.y > game.height - pad) { mine.y = game.height - pad; mine.vy = -Math.abs(mine.vy); }
        }

        const dist = Math.hypot(mine.x - enemy.x, mine.y - enemy.y);

        if (mine.triggerTime) {
          if (game.simTime >= mine.triggerTime) {
            game.explosions.push({
              ownerId: mine.ownerId, x: mine.x, y: mine.y, r: 0,
              maxRadius: game.balance.bomber.mineRadius, duration: 400, life: 400
            });
            game.screenShake = Math.max(game.screenShake, mine.isHoming ? 15 : 12);
            spawnExplosionParticles(mine.x, mine.y);
            playSound("explosion");

            balls.forEach(ball => {
              const db = Math.hypot(ball.x - mine.x, ball.y - mine.y);
              if (db < game.balance.bomber.mineRadius + ball.r) {
                if (isChessCrownActive(ball)) return;
                
                let dmg;
                let force;
                let floatColor = "#f87171";
                if (mine.isHoming) {
                  dmg = 2;
                  const angle = Math.atan2(ball.y - mine.y, ball.x - mine.x);
                  force = game.balance.bomber.knockback * 20 * 2.8;
                  if (!hasStringBounceGuard(ball)) {
                    ball.vx += Math.cos(angle) * force; ball.vy += Math.sin(angle) * force;
                  }
                  floatColor = "#38bdf8";
                } else {
                  const falloff = 1 - (db / (game.balance.bomber.mineRadius + ball.r));
                  dmg = Math.max(MIN_DAMAGE, Math.round(game.balance.bomber.mineDamage * falloff));
                  const angle = Math.atan2(ball.y - mine.y, ball.x - mine.x);
                  force = game.balance.bomber.knockback * 20 * falloff;
                  if (!hasStringBounceGuard(ball)) {
                    ball.vx += Math.cos(angle) * force; ball.vy += Math.sin(angle) * force;
                  }
                }

                if (isWreckerJumpInvulnerable(ball)) return;
                ball.health = clamp(ball.health - dmg, 0, MAX_HEALTH);

                game.floatingTexts = game.floatingTexts || [];
                game.floatingTexts.push({
                  x: ball.x + (Math.random() - 0.5) * 20, y: ball.y - ball.r - 5, vy: -60,
                  text: `-${dmg}`, color: floatColor, life: 0.8, maxLife: 0.8
                });

                if (mine.ownerId.startsWith("left") && ball.side === "right") {
                  game.stats.left.damageDealt += dmg; game.stats.left.hitsLanded++;
                } else if (mine.ownerId.startsWith("right") && ball.side === "left") {
                  game.stats.right.damageDealt += dmg; game.stats.right.hitsLanded++;
                }
              }
            });
            return false;
          }
          return true;
        }

        if (dist < enemy.r + game.balance.bomber.mineTriggerDist) {
          mine.triggerTime = game.simTime + 150;
          mine.isAboutToDetonate = true;
          spawnSparks(mine.x, mine.y, mine.isHoming ? "#38bdf8" : "#ef4444", 4);
          playSound("bombFuse");
        }
        return true;
      });
    };

    const updateVenomPools = (dt) => {
      if (!game.venomPools) return;
      const bal = game.balance;
      game.venomPools = game.venomPools.filter((pool) => {
        if (game.simTime >= pool.createdTime + pool.duration) return false;

        game.balls.forEach((ball) => {
          if (ball.side === pool.ownerSide) return;
          const dist = Math.hypot(ball.x - pool.x, ball.y - pool.y);
          if (dist < ball.r + pool.r) {
            if (pool.isSymbiote) {
              // Unique symbiote interaction:
              // 1. Gravity well: Pull target towards center of the slime pool
              const dx = pool.x - ball.x;
              const dy = pool.y - ball.y;
              const distToCenter = Math.hypot(dx, dy);
              if (distToCenter > 1) {
                const pullSpeed = 480; // strong suction
                ball.vx += (dx / distToCenter) * pullSpeed * dt;
                ball.vy += (dy / distToCenter) * pullSpeed * dt;
              }
              // 2. Damage: 2 tick damage every 250ms, max 6 damage total per pool
              pool.damageDealtMap = pool.damageDealtMap || {};
              const currentDamage = pool.damageDealtMap[ball.id] || 0;
              if (currentDamage < 6) {
                const tickDamage = Math.min(2, 6 - currentDamage);
                applyDamage(ball, tickDamage, `${ball.id}-symbiote-tick-${pool.createdTime}`, game.simTime, 250);
                pool.damageDealtMap[ball.id] = currentDamage + tickDamage;
                
                // 3. Stun Flash: Turn stun flash black
                ball.webHitFlashUntil = game.simTime + 220;
                ball.webHitFlashColor = "#000000";

                // 4. Update owner stats
                const owner = game.balls.find(b => b.id === pool.ownerId);
                if (owner) {
                  const ownerStats = owner.side === "left" ? game.stats.left : game.stats.right;
                  if (ownerStats) {
                    ownerStats.damageDealt += Math.max(MIN_DAMAGE, tickDamage);
                  }
                }
              }

              if (canSpawnParticle() && Math.random() < 0.22) {
                game.particles.push({
                  x: ball.x + (Math.random() - 0.5) * ball.r,
                  y: ball.y + (Math.random() - 0.5) * ball.r,
                  vx: (Math.random() - 0.5) * 20, vy: -10 - Math.random() * 20,
                  color: "#0f172a", radius: 2, life: 0.35, maxLife: 0.35
                });
              }
            } else {
              applyDamage(ball, bal.spider.secDamage, `${ball.id}-venom-tick-${pool.createdTime}`, game.simTime, 250);

              if (canSpawnParticle() && Math.random() < 0.15) {
                game.particles.push({
                  x: ball.x + (Math.random() - 0.5) * ball.r,
                  y: ball.y + (Math.random() - 0.5) * ball.r,
                  vx: (Math.random() - 0.5) * 20, vy: -20 - Math.random() * 20,
                  color: "#10b981", radius: 1.5, life: 0.35, maxLife: 0.35
                });
              }
            }
          }
        });

        if (canSpawnParticle() && Math.random() < 0.04) {
          const a = Math.random() * Math.PI * 2;
          const d = Math.random() * pool.r;
          game.particles.push({
            x: pool.x + Math.cos(a) * d, y: pool.y + Math.sin(a) * d,
            vx: 0, vy: -8 - Math.random() * 12,
            color: pool.isSymbiote ? "#3b0764" : "#34d399", radius: 1.2, life: 0.4, maxLife: 0.4
          });
        }

        return true;
      });
    };

    // Tendril Trap – sticky goo patches left by Black Spider on wall bounces
    const updateVenomTraps = (dt) => {
      if (!game.venomTraps) return;
      const bsBal = game.balance.blackSpider || BALANCE.blackSpider;
      game.venomTraps = game.venomTraps.filter((trap) => {
        if (trap.triggered) return false;
        if (game.simTime >= trap.createdTime + trap.duration) return false;

        // Bubble ambient particles
        if (canSpawnParticle() && Math.random() < 0.06) {
          const a = Math.random() * Math.PI * 2;
          const d = Math.random() * trap.r * 0.8;
          game.particles.push({
            x: trap.x + Math.cos(a) * d, y: trap.y + Math.sin(a) * d,
            vx: (Math.random() - 0.5) * 18, vy: -10 - Math.random() * 16,
            color: "#0f172a", radius: 2.5 + Math.random() * 2, life: 0.45, maxLife: 0.45
          });
        }

        // Check enemy collision
        game.balls.forEach((ball) => {
          if (ball.side === trap.ownerSide) return;
          const dist = Math.hypot(ball.x - trap.x, ball.y - trap.y);
          if (dist < ball.r + trap.r) {
            trap.triggered = true;

            // Stick enemy
            const stickDur = bsBal.trapStickDuration || 500;
            ball.paralyzedUntil = Math.max(ball.paralyzedUntil || 0, game.simTime + stickDur);

            // Speed boost for the owner
            const owner = game.balls.find(b => b.id === trap.ownerId);
            if (owner) {
              const boostForce = bsBal.trapSpeedBoost || 280;
              const toEnemy = Math.atan2(ball.y - owner.y, ball.x - owner.x);
              owner.vx += Math.cos(toEnemy) * boostForce;
              owner.vy += Math.sin(toEnemy) * boostForce;
              owner.venomSpeedBoostUntil = game.simTime + 600;
            }

            spawnSparks(trap.x, trap.y, "#1e293b", 14);
            spawnDust(ball.x, ball.y, 8);
            game.screenShake = Math.max(game.screenShake, 7);
            playSound("webShoot", 0.75, 80);

            game.floatingTexts = game.floatingTexts || [];
            game.floatingTexts.push({
              x: ball.x, y: ball.y - ball.r - 22, vy: -55,
              text: "TRAPPED!", color: "#94a3b8", life: 0.85, maxLife: 0.85
            });
          }
        });

        return !trap.triggered;
      });
    };
    // Web Weave – permanent strands left by Black Spider on every wall bounce
    const updateWebStrands = () => {
      if (!game.webStrands || !game.webStrands.length) return;
      const bsBal = game.balance.blackSpider || BALANCE.blackSpider;
      const strandDamage = bsBal.webStrandDamage || 4;
      const hitPad = 10; // how close to the strand line counts as a hit

      game.webStrands.forEach((strand) => {
        game.balls.forEach((ball) => {
          if (ball.side === strand.ownerSide) return;

          const dist = linePointDist(ball.x, ball.y, strand.x1, strand.y1, strand.x2, strand.y2);
          if (dist < ball.r + hitPad) {
            // Use insideIds to trigger damage only on fresh contact (not while staying inside)
            if (!strand.insideIds) strand.insideIds = {};
            if (strand.insideIds[ball.id]) return;
            strand.insideIds[ball.id] = true;

            applyDamage(ball, strandDamage, `${ball.id}-webstrand-${strand.id}`, game.simTime, 800);

            // Find closest point on strand for effect position
            const A = ball.x - strand.x1, B = ball.y - strand.y1;
            const C = strand.x2 - strand.x1, D = strand.y2 - strand.y1;
            const dot = A * C + B * D, lenSq = C * C + D * D;
            const param = lenSq ? clamp(dot / lenSq, 0, 1) : 0;
            const hitX = strand.x1 + param * C;
            const hitY = strand.y1 + param * D;

            spawnSparks(hitX, hitY, "#1e293b", 14);
            spawnSparks(hitX, hitY, "#94a3b8", 8);
            game.screenShake = Math.max(game.screenShake, 6);
            playSound("webHit", 0.65, 75);

            game.floatingTexts = game.floatingTexts || [];
            game.floatingTexts.push({
              x: ball.x, y: ball.y - ball.r - 18, vy: -55,
              text: "WEB STRAND", color: "#94a3b8", life: 0.75, maxLife: 0.75
            });

            if (canSpawnParticle()) {
              for (let i = 0; i < 6; i++) {
                game.particles.push({
                  x: hitX + (Math.random() - 0.5) * 18,
                  y: hitY + (Math.random() - 0.5) * 18,
                  vx: (Math.random() - 0.5) * 55,
                  vy: -20 - Math.random() * 40,
                  color: i % 2 === 0 ? "#0f172a" : "#475569",
                  radius: 2.5 + Math.random() * 2.5,
                  life: 0.4, maxLife: 0.4,
                });
              }
            }
          } else if (strand.insideIds) {
            delete strand.insideIds[ball.id];
          }
        });
      });
    };

    const updateBullets = (dt, balls) => {
      game.bullets = game.bullets.filter((bullet) => {
        bullet.x += bullet.vx * dt; bullet.y += bullet.vy * dt;
        if (bullet.kind !== "dragonFireball") {
          bullet.life -= dt;
        }
        if (bullet.life <= 0) return false;
        if (bullet.kind === "laserPulse" || bullet.kind === "dragonFireball") {
          let bounced = false;
          const pad = 18 + bullet.r;
          if (bullet.x < pad) { bullet.x = pad; bullet.vx = Math.abs(bullet.vx); bounced = true; }
          if (bullet.x > game.width - pad) { bullet.x = game.width - pad; bullet.vx = -Math.abs(bullet.vx); bounced = true; }
          if (bullet.y < pad) { bullet.y = pad; bullet.vy = Math.abs(bullet.vy); bounced = true; }
          if (bullet.y > game.height - pad) { bullet.y = game.height - pad; bullet.vy = -Math.abs(bullet.vy); bounced = true; }
          if (bounced) {
            if (bullet.kind !== "dragonFireball") {
              const defaultBounces = bullet.kind === "laserPulse" ? 4 : 3;
              bullet.bouncesLeft = (bullet.bouncesLeft ?? defaultBounces) - 1;
              if (bullet.bouncesLeft < 0) return false;
            }
            spawnSparks(bullet.x, bullet.y, bullet.kind === "dragonFireball" ? "#f97316" : "#facc15", 8);
          }
        } else if (bullet.x < 18 || bullet.x > game.width - 18 || bullet.y < 18 || bullet.y > game.height - 18) {
          return false;
        }

        const side = bullet.targetSide, shieldBall = balls.find(b => b.side === side);
        if (shieldBall && shieldBall.type === "shield" && !bullet.piercesDefense && !bullet.cannotReflect) {
          if (shieldBall.shieldState === "held") {
            const d = Math.hypot(bullet.x - shieldBall.x, bullet.y - shieldBall.y);
            if (d < shieldBall.r + 15 && d > shieldBall.r - 10) {
              const angle = Math.atan2(bullet.y - shieldBall.y, bullet.x - shieldBall.x);
              let diff = Math.abs(angle - shieldBall.shieldAngle);
              while (diff > Math.PI) diff = Math.abs(diff - Math.PI * 2);
              if (diff < game.balance.shield.arcWidth / 2) {
                const attacker = balls.find(b => b.side !== side);
                const refAngle = Math.atan2(attacker.y - bullet.y, attacker.x - bullet.x) + (Math.random() - 0.5) * 0.15;
                const spd = Math.hypot(bullet.vx, bullet.vy);
                bullet.vx = Math.cos(refAngle) * spd; bullet.vy = Math.sin(refAngle) * spd;
                bullet.targetSide = null;
                bullet.ownerId = null;
                
                if (side === "left") game.stats.left.blocked++;
                else game.stats.right.blocked++;

                spawnShieldSparks(bullet.x, bullet.y, shieldBall.shieldAngle);
                registerShieldGuardHit(shieldBall, angle, game.simTime);
                return true;
              }
            }
          } else if (shieldBall.shieldState === "thrown" || shieldBall.shieldState === "returning") {
            const dShield = Math.hypot(bullet.x - shieldBall.shieldX, bullet.y - shieldBall.shieldY);
            if (dShield < 24 + bullet.r) {
              const attacker = balls.find(b => b.side !== side);
              const refAngle = Math.atan2(attacker.y - bullet.y, attacker.x - bullet.x) + (Math.random() - 0.5) * 0.15;
              const spd = Math.hypot(bullet.vx, bullet.vy);
              bullet.vx = Math.cos(refAngle) * spd; bullet.vy = Math.sin(refAngle) * spd;
              bullet.targetSide = null;
              bullet.ownerId = null;
              
              if (side === "left") game.stats.left.blocked++;
              else game.stats.right.blocked++;

              const bounceAngle = Math.atan2(bullet.vy, bullet.vx);
              spawnShieldSparks(bullet.x, bullet.y, bounceAngle);
              return true;
            }
          }
        }

        const target = bullet.targetSide ? balls.find((ball) => ball.side === bullet.targetSide) : null;
        if (target && Math.hypot(bullet.x - target.x, bullet.y - target.y) < target.r + bullet.r) {
          if (isChessCrownActive(target)) return false;
          if (isWreckerJumpInvulnerable(target)) return false;
          target.health = clamp(target.health - bullet.damage, 0, MAX_HEALTH);
          if (bullet.stunDuration) {
            target.paralyzedUntil = Math.max(target.paralyzedUntil || 0, game.simTime + bullet.stunDuration);
          }
          if (bullet.burnDuration) {
            target.burnUntil = Math.max(target.burnUntil || 0, game.simTime + bullet.burnDuration);
            target.nextBurnTickAt = game.simTime;
          }

          game.floatingTexts = game.floatingTexts || [];
          game.floatingTexts.push({
            x: target.x + (Math.random() - 0.5) * 20, y: target.y - target.r - 5, vy: -60,
            text: `-${bullet.damage}`, color: "#f87171", life: 0.8, maxLife: 0.8
          });
          if (bullet.stunDuration) {
            game.floatingTexts.push({
              x: target.x, y: target.y - target.r - 22, vy: -55,
              text: "ELECTRIFIED", color: "#38bdf8", life: 0.8, maxLife: 0.8
            });
          }
          
          if (bullet.ownerId?.startsWith("left")) { game.stats.left.damageDealt += bullet.damage; game.stats.left.hitsLanded++; }
          else if (bullet.ownerId?.startsWith("right")) { game.stats.right.damageDealt += bullet.damage; game.stats.right.hitsLanded++; }

          spawnSparks(bullet.x, bullet.y, bullet.kind === "dragonFireball" ? "#f97316" : "#facc15", bullet.kind === "laserPulse" ? 16 : 8);
          return false;
        }
        return true;
      });
    };

    const updateExplosions = (dt) => {
      game.explosions = game.explosions.filter((exp) => {
        exp.life -= dt * 1000;
        exp.r = exp.maxRadius * (1 - (exp.life / exp.duration));
        return exp.life > 0;
      });
      if (game.explosions.length > MAX_EXPLOSIONS) {
        game.explosions.splice(0, game.explosions.length - MAX_EXPLOSIONS);
      }
    };

    const updateParticles = (dt) => {
      game.particles = game.particles.filter((p) => {
        p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
        p.alpha = Math.max(0, p.life / p.maxLife);
        return p.life > 0;
      });
      if (game.particles.length > MAX_PARTICLES) {
        game.particles.splice(0, game.particles.length - MAX_PARTICLES);
      }
    };

    const drawArena = () => {
      // Clear the entire physical canvas by temporarily resetting the transform
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      ctx.fillStyle = "#0f172a"; ctx.fillRect(0, 0, game.width, game.height);
      ctx.strokeStyle = "#1e293b"; ctx.lineWidth = 4;
      ctx.strokeRect(0, 0, game.width, game.height);

      ctx.save();
      ctx.strokeStyle = "rgba(148, 163, 184, 0.18)";
      ctx.lineWidth = 1;
      for (let i = 1; i < GRID_SIZE; i++) {
        const p = i * TILE_SIZE;
        ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, game.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(game.width, p); ctx.stroke();
      }
      ctx.restore();
    };

    const drawHealthInsideBall = (ball) => {
      ctx.fillStyle = "#f8fafc"; ctx.font = "bold 17px sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      
      const displayHp = Math.ceil(ball.health);
      ctx.fillText(displayHp, ball.x, ball.y + 2);
      ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
    };

    const drawKnifeBall = (ball) => {
      const config = BALL_TYPES.knife;
      ctx.save(); ctx.translate(ball.x, ball.y);
      ctx.beginPath(); ctx.arc(0, 0, ball.r, 0, Math.PI * 2);
      ctx.fillStyle = config.color; ctx.fill();
      ctx.lineWidth = 4; ctx.strokeStyle = config.stroke; ctx.stroke();
      ctx.restore();

      const bladeState = ball.knifeBladeState || "rotating";
      if (bladeState === "rotating") {
        if (ball.saberSlashActive && game.simTime < ball.saberSlashStart + ball.saberSlashDuration) {
          const p = (game.simTime - ball.saberSlashStart) / ball.saberSlashDuration;
          ctx.save();
          ctx.globalAlpha = Math.max(0, 0.45 * (1 - p));
          ctx.fillStyle = "rgba(74, 222, 128, 0.35)";
          ctx.strokeStyle = "#4ade80";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(ball.x, ball.y);
          const startAngle = ball.saberSlashBase - ball.saberSlashDir * 1.35;
          const currentAngle = ball.spinAngle;
          ctx.arc(ball.x, ball.y, ball.r + game.balance.knife.bladeLength, startAngle, currentAngle, ball.saberSlashDir < 0);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }

        ctx.save(); ctx.translate(ball.x, ball.y);
        ctx.rotate(ball.spinAngle);
        const hiltX = ball.r - 8;
        const tipX = ball.r + game.balance.knife.bladeLength;
        const saberGrad = ctx.createLinearGradient(hiltX, 0, tipX, 0);
        saberGrad.addColorStop(0, "#bbf7d0");
        saberGrad.addColorStop(0.5, "#22c55e");
        saberGrad.addColorStop(1, "#ecfdf5");
        ctx.shadowColor = "#22c55e";
        ctx.shadowBlur = 12;
        ctx.strokeStyle = saberGrad;
        ctx.lineWidth = 8;
        ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(ball.r + 4, 0); ctx.lineTo(tipX, 0); ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "#ecfdf5";
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(ball.r + 8, 0); ctx.lineTo(tipX - 4, 0); ctx.stroke();
        ctx.fillStyle = "#374151"; ctx.fillRect(hiltX, -5, 16, 10);
        ctx.fillStyle = "#d1d5db"; ctx.fillRect(hiltX + 2, -3, 4, 6);
        ctx.restore();
      } else {
        ctx.save(); ctx.translate(ball.knifeBladeX, ball.knifeBladeY);
        ctx.rotate(ball.knifeBladeAngle);
        const tipX = game.balance.knife.bladeLength - 12;
        ctx.shadowColor = "#22c55e";
        ctx.shadowBlur = 14;
        ctx.strokeStyle = "#22c55e";
        ctx.lineWidth = 8;
        ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(tipX, 0); ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "#f0fdf4";
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(4, 0); ctx.lineTo(tipX - 4, 0); ctx.stroke();
        ctx.fillStyle = "#374151"; ctx.fillRect(-16, -5, 18, 10);
        ctx.fillStyle = "#d1d5db"; ctx.fillRect(-13, -3, 5, 6);
        ctx.restore();
      }
      drawHealthInsideBall(ball);
    };

    const drawVampireBall = (ball, currentTime, target) => {
      const config = BALL_TYPES.vampire;
      const isLatched = ball.latchUntil > currentTime && target;
      const biteAngle = target ? Math.atan2(target.y - ball.y, target.x - ball.x) : ball.angle;

      if (isLatched) {
        ctx.save(); ctx.strokeStyle = "rgba(239, 68, 68, 0.6)"; ctx.lineWidth = 3;
        ctx.setLineDash([6, 6]); ctx.beginPath(); ctx.moveTo(ball.x, ball.y);
        ctx.lineTo(target.x, target.y); ctx.stroke(); ctx.restore();
        spawnVampireCrosses(ball, target);
      }

      ctx.save(); ctx.translate(ball.x, ball.y); ctx.rotate(biteAngle);
      ctx.beginPath(); ctx.arc(0, 0, ball.r + (isLatched ? 6 : 2), 0, Math.PI * 2);
      ctx.fillStyle = isLatched ? "rgba(239, 68, 68, 0.2)" : "rgba(239, 68, 68, 0.05)"; ctx.fill();
      ctx.beginPath(); ctx.arc(0, 0, ball.r, 0, Math.PI * 2);
      ctx.fillStyle = config.color; ctx.fill();
      ctx.lineWidth = 4; ctx.strokeStyle = config.stroke; ctx.stroke();

      const fangLength = isLatched ? 24 : 15, fangStart = ball.r - 3;
      ctx.fillStyle = "#fee2e2"; ctx.strokeStyle = "#991b1b"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(fangStart, -9); ctx.lineTo(fangStart + fangLength, -3); ctx.lineTo(fangStart, 1); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(fangStart, 9); ctx.lineTo(fangStart + fangLength, 3); ctx.lineTo(fangStart, -1); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.restore();
      drawHealthInsideBall(ball);
    };

    const drawGunBall = (ball, currentTime) => {
      const config = BALL_TYPES.gun;
      
      // Save context to draw rotated gun barrels first
      ctx.save();
      ctx.translate(ball.x, ball.y);
      ctx.rotate(ball.angle);
      
      // Sleek pistol silhouette
      ctx.fillStyle = "#020617";
      ctx.fillRect(ball.r - 3, -4, 30, 8);
      ctx.fillStyle = "#475569";
      ctx.fillRect(ball.r + 4, -2, 22, 4);
      ctx.fillStyle = "#111827";
      ctx.fillRect(ball.r + 3, 4, 8, 12);
      
      // Gun base connector
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(ball.r - 7, -7, 7, 14);
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(ball.r - 7, -7, 7, 14);

      // Clean aim line
      ctx.strokeStyle = "rgba(203, 213, 225, 0.28)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.moveTo(ball.r + 28, 0);
      ctx.lineTo(ball.r + 150, 0);
      ctx.stroke();
      ctx.setLineDash([]);

      // Muzzle flash
      if (ball.flashUntil > currentTime) {
        const flashGrad = ctx.createRadialGradient(ball.r + 28, 0, 2, ball.r + 40, 0, 15);
        flashGrad.addColorStop(0, "#ffffff");
        flashGrad.addColorStop(0.3, "#facc15");
        flashGrad.addColorStop(1, "rgba(6, 182, 212, 0)");
        ctx.fillStyle = flashGrad;
        ctx.beginPath();
        ctx.arc(ball.r + 32, 0, 16, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Ball shell: black suit
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      const metalGrad = ctx.createRadialGradient(
        ball.x - ball.r * 0.2, ball.y - ball.r * 0.2, 2,
        ball.x, ball.y, ball.r
      );
      metalGrad.addColorStop(0, "#1f2937");
      metalGrad.addColorStop(0.55, "#020617");
      metalGrad.addColorStop(1, "#000000");
      ctx.fillStyle = metalGrad;
      ctx.fill();

      // Suit border
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = "#cbd5e1";
      ctx.stroke();

      // Suit lapels, shirt, and tie
      ctx.save();
      ctx.translate(ball.x, ball.y);
      ctx.rotate(ball.angle);
      ctx.fillStyle = "#f8fafc";
      ctx.beginPath();
      ctx.moveTo(-ball.r * 0.25, -ball.r * 0.58);
      ctx.lineTo(ball.r * 0.18, 0);
      ctx.lineTo(-ball.r * 0.25, ball.r * 0.58);
      ctx.lineTo(-ball.r * 0.5, ball.r * 0.36);
      ctx.lineTo(-ball.r * 0.18, 0);
      ctx.lineTo(-ball.r * 0.5, -ball.r * 0.36);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#111827";
      ctx.beginPath();
      ctx.moveTo(-ball.r * 0.78, -ball.r * 0.55);
      ctx.lineTo(-ball.r * 0.18, 0);
      ctx.lineTo(-ball.r * 0.78, ball.r * 0.55);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#111827";
      ctx.beginPath();
      ctx.moveTo(ball.r * 0.45, -ball.r * 0.5);
      ctx.lineTo(ball.r * 0.12, 0);
      ctx.lineTo(ball.r * 0.45, ball.r * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#020617";
      ctx.beginPath();
      ctx.moveTo(-ball.r * 0.02, -ball.r * 0.28);
      ctx.lineTo(ball.r * 0.16, 0);
      ctx.lineTo(-ball.r * 0.02, ball.r * 0.36);
      ctx.lineTo(-ball.r * 0.18, 0);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#e5e7eb";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-ball.r * 0.18, -ball.r * 0.45);
      ctx.lineTo(-ball.r * 0.02, -ball.r * 0.28);
      ctx.moveTo(-ball.r * 0.18, ball.r * 0.45);
      ctx.lineTo(-ball.r * 0.02, ball.r * 0.36);
      ctx.stroke();

      ctx.restore();

      if (ball.dog) {
        const dog = ball.dog;
        const dogAngle = Math.atan2(dog.vy, dog.vx);
        ctx.save();
        ctx.translate(dog.x, dog.y);
        ctx.rotate(dogAngle);
        ctx.globalAlpha = dog.dead ? 0.78 : 1;
        ctx.shadowColor = dog.dead ? "rgba(15, 23, 42, 0.6)" : "#f59e0b";
        ctx.shadowBlur = dog.dead ? 2 : 8;
        ctx.fillStyle = dog.dead ? "#57534e" : "#f8fafc";
        ctx.strokeStyle = dog.dead ? "#a8a29e" : "#92400e";
        ctx.lineWidth = 2;

        // Round beagle-face dog ball.
        ctx.fillStyle = dog.dead ? "#57534e" : "#92400e";
        ctx.beginPath();
        ctx.ellipse(-dog.r * 0.3, -dog.r * 0.7, dog.r * 0.34, dog.r * 0.55, -0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(-dog.r * 0.3, dog.r * 0.7, dog.r * 0.34, dog.r * 0.55, 0.35, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0, 0, dog.r + 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = dog.dead ? "#78716c" : "#b45309";
        ctx.beginPath();
        ctx.ellipse(-dog.r * 0.2, 0, dog.r * 0.58, dog.r * 0.85, 0, Math.PI / 2, Math.PI * 1.5);
        ctx.fill();

        ctx.fillStyle = dog.dead ? "#d6d3d1" : "#fde68a";
        ctx.beginPath();
        ctx.ellipse(dog.r * 0.3, 0, dog.r * 0.56, dog.r * 0.42, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#020617";
        ctx.beginPath();
        ctx.arc(dog.r * 0.78, 0, 3, 0, Math.PI * 2);
        ctx.fill();

        if (dog.dead) {
          ctx.strokeStyle = "#f8fafc";
          ctx.lineWidth = 2;
          [[dog.r * 0.24, -dog.r * 0.36], [dog.r * 0.24, dog.r * 0.36]].forEach(([ex, ey]) => {
            ctx.beginPath(); ctx.moveTo(ex - 3, ey - 3); ctx.lineTo(ex + 3, ey + 3); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(ex + 3, ey - 3); ctx.lineTo(ex - 3, ey + 3); ctx.stroke();
          });
        } else {
          ctx.fillStyle = "#f8fafc";
          ctx.beginPath(); ctx.arc(dog.r * 0.3, -dog.r * 0.36, 3, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(dog.r * 0.3, dog.r * 0.36, 3, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "#020617";
          ctx.beginPath(); ctx.arc(dog.r * 0.38, -dog.r * 0.36, 1.5, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(dog.r * 0.38, dog.r * 0.36, 1.5, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();

        ctx.save();
        ctx.fillStyle = dog.dead ? "#f87171" : "#fbbf24";
        ctx.font = "bold 8px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(dog.dead ? "X X" : Math.ceil(dog.health), dog.x, dog.y + dog.r + 13);
        ctx.restore();
      }
      drawHealthInsideBall(ball);
    };

    const drawWreckerBall = (ball) => {
      const config = BALL_TYPES.wrecker;
      
      // Determine if leaping to draw ground shadow
      let height = 0;
      if (ball.wreckerState === "leaping") {
        const bal = game.balance.wrecker || BALANCE.wrecker;
        const duration = bal.leapDuration || 680;
        const progress = clamp((game.simTime - (ball.wreckerLeapStart || game.simTime)) / duration, 0, 1);
        height = Math.sin(progress * Math.PI) * (ball.isMegaLeap ? 185 : 155);

        // Draw ground shadow
        ctx.save();
        ctx.fillStyle = "rgba(15, 23, 42, 0.45)";
        ctx.beginPath();
        const shadowScale = 1 - (height / 185) * 0.45;
        ctx.ellipse(ball.x, ball.y, ball.r * shadowScale, ball.r * 0.3 * shadowScale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.save();
      ctx.translate(ball.x, ball.y - height);

      const drawR = ball.r;

      // Green glow representing anger/rage
      if (ball.rageStacks > 0) {
        ctx.shadowColor = "#22c55e";
        ctx.shadowBlur = ball.rageStacks * 6.5;
      }

      // Draw Main Green Body
      const greenGrad = ctx.createRadialGradient(-drawR * 0.3, -drawR * 0.3, drawR * 0.05, 0, 0, drawR);
      greenGrad.addColorStop(0, "#4ade80");
      greenGrad.addColorStop(0.65, "#15803d");
      greenGrad.addColorStop(1, "#14532d");
      ctx.beginPath(); ctx.arc(0, 0, drawR, 0, Math.PI * 2);
      ctx.fillStyle = greenGrad; ctx.fill();

      // Draw purple pants/accent at the bottom
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, drawR, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = "#a855f7";
      ctx.fillRect(-drawR, drawR * 0.4, drawR * 2, drawR * 0.65);
      ctx.strokeStyle = "#7e22ce";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-drawR, drawR * 0.4);
      ctx.lineTo(drawR, drawR * 0.4);
      ctx.stroke();
      ctx.restore();

      // Golden ring highlight if mega-charged
      if (ball.consecutiveWallBounces >= 10 || ball.isMegaLeap) {
        ctx.lineWidth = 3; ctx.strokeStyle = "#fbbf24";
        ctx.beginPath(); ctx.arc(0, 0, drawR, 0, Math.PI * 2); ctx.stroke();
      } else {
        ctx.lineWidth = 3.5; ctx.strokeStyle = config.stroke;
        ctx.beginPath(); ctx.arc(0, 0, drawR, 0, Math.PI * 2); ctx.stroke();
      }

      // Draw cracks if rage stacks are high (>= 4)
      if (ball.rageStacks >= 4) {
        ctx.strokeStyle = "rgba(20, 83, 45, 0.75)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-drawR * 0.6, drawR * 0.1); ctx.lineTo(-drawR * 0.2, -drawR * 0.15); ctx.lineTo(-drawR * 0.35, -drawR * 0.45);
        ctx.moveTo(drawR * 0.5, -drawR * 0.1); ctx.lineTo(drawR * 0.15, -drawR * 0.35); ctx.lineTo(drawR * 0.3, -drawR * 0.6);
        ctx.stroke();
      }

      // Ensure NO eyes are drawn (completely eyeless)

      ctx.restore();

      // Draw dizzy stars above the wrecker ball when in cooldown state
      if (ball.wreckerState === "cooldown") {
        ctx.save();
        ctx.fillStyle = "#fbbf24";
        const starY = ball.y - drawR - height - 12;
        const timeAngle = game.simTime * 0.008;
        const starsCount = 3;
        for (let i = 0; i < starsCount; i++) {
          const angle = timeAngle + (i / starsCount) * Math.PI * 2;
          const sx = ball.x + Math.cos(angle) * 16;
          const sy = starY + Math.sin(angle) * 5;
          drawStar(ctx, sx, sy, 5, 5, 2);
          ctx.fill();
        }
        ctx.restore();
      }

      drawHealthInsideBall(ball);
    };

    const drawLaserBall = (ball, target) => {
      const config = BALL_TYPES.laser;
      const facing = ball.laserTargetAngle || 0;
      const charging = ball.laserState === "charging";
      const firing = ball.laserState === "firing";
      const glow = firing ? 18 : charging ? 12 : 5;

      ctx.save();
      ctx.translate(ball.x, ball.y);
      ctx.rotate(facing);

      ctx.shadowColor = firing ? "#ffffff" : "#facc15";
      ctx.shadowBlur = glow;
      const armorGrad = ctx.createRadialGradient(-ball.r * 0.35, -ball.r * 0.35, 3, 0, 0, ball.r);
      armorGrad.addColorStop(0, "#f87171");
      armorGrad.addColorStop(0.45, config.color);
      armorGrad.addColorStop(1, "#7f1d1d");
      ctx.beginPath();
      ctx.arc(0, 0, ball.r, 0, Math.PI * 2);
      ctx.fillStyle = armorGrad;
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#7f1d1d";
      ctx.stroke();

      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, ball.r - 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = "#facc15";
      ctx.fillRect(-ball.r * 0.2, -ball.r, ball.r * 0.42, ball.r * 2);
      ctx.fillStyle = "#b91c1c";
      ctx.fillRect(-ball.r, ball.r * 0.35, ball.r * 2, ball.r * 0.28);
      ctx.restore();

      ctx.shadowColor = "#facc15";
      ctx.shadowBlur = 10;
      ctx.fillStyle = "#facc15";
      ctx.fillRect(ball.r - 6, -11, 15, 22);
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(ball.r + 5, -7, 8, 14);
      ctx.strokeStyle = "#7f1d1d";
      ctx.lineWidth = 2;
      ctx.strokeRect(ball.r - 6, -11, 15, 22);
      ctx.restore();

      if (ball.laserState === "charging" && target) {
        const timeLeft = ball.laserStateUntil - game.simTime;
        const progress = 1 - Math.max(0, timeLeft / game.balance.laser.chargeTime);
        ctx.save(); ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 + progress * 0.65})`; ctx.lineWidth = 1.5 + progress * 1.5;
        ctx.setLineDash([8, 8]);
        ctx.beginPath(); ctx.moveTo(ball.x + Math.cos(ball.laserTargetAngle) * ball.r, ball.y + Math.sin(ball.laserTargetAngle) * ball.r);
        ctx.lineTo(target.x, target.y); ctx.stroke(); ctx.setLineDash([]);
        ctx.strokeStyle = "#facc15"; ctx.lineWidth = 2 + progress * 2; ctx.shadowColor = "#facc15"; ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r + 20 * (1 - progress), 0, Math.PI * 2); ctx.stroke(); ctx.restore();
      }

      if (ball.laserState === "firing") {
        const mX = ball.x + Math.cos(ball.laserTargetAngle) * ball.r;
        const mY = ball.y + Math.sin(ball.laserTargetAngle) * ball.r;
        ctx.save();
        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur = 22;
        const tracePath = () => {
          ctx.beginPath();
          ctx.moveTo(mX, mY);
          if (ball.laserReflect) {
            ctx.lineTo(ball.laserReflect.x, ball.laserReflect.y);
            const refEX = ball.laserReflect.x + Math.cos(ball.laserReflect.angle) * 1500;
            const refEY = ball.laserReflect.y + Math.sin(ball.laserReflect.angle) * 1500;
            ctx.lineTo(refEX, refEY);
          } else {
            const eX = mX + Math.cos(ball.laserTargetAngle) * 1500;
            const eY = mY + Math.sin(ball.laserTargetAngle) * 1500;
            ctx.lineTo(eX, eY);
          }
        };
        ctx.strokeStyle = "rgba(255, 255, 255, 0.98)";
        ctx.lineWidth = Math.max(3, game.balance.laser.beamWidth * 0.45);
        tracePath();
        ctx.stroke();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.42)";
        ctx.lineWidth = game.balance.laser.beamWidth;
        tracePath();
        ctx.stroke();
        ctx.strokeStyle = "rgba(250, 204, 21, 0.28)";
        ctx.lineWidth = game.balance.laser.beamWidth + 5;
        tracePath();
        ctx.stroke();
        ctx.restore();
      }

      drawHealthInsideBall(ball);
    };

    const drawShieldBall = (ball) => {
      // Draw the Shielder body (patriotic concentric rings: blue, white, red)
      ctx.save();
      ctx.translate(ball.x, ball.y);
      
      ctx.beginPath();
      ctx.arc(0, 0, ball.r, 0, Math.PI * 2);
      ctx.fillStyle = "#ef4444";
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(0, 0, ball.r * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(0, 0, ball.r * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = "#1e3a8a";
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(0, 0, ball.r, 0, Math.PI * 2);
      ctx.strokeStyle = "#1e3a8a";
      ctx.lineWidth = 3;
      ctx.stroke();
      
      ctx.restore();

      // If the shield is held, draw the protective shield arc
      if (ball.shieldState === "held") {
        if ((ball.shieldBashThrows || 0) >= SHIELD_BASH_READY_THROWS) {
          const pulse = 0.5 + Math.sin(game.simTime * 0.014) * 0.5;
          ctx.save();
          ctx.globalAlpha = 0.65 + pulse * 0.25;
          ctx.strokeStyle = "#facc15";
          ctx.lineWidth = 3 + pulse * 2;
          ctx.shadowColor = "#facc15";
          ctx.shadowBlur = 18 + pulse * 10;
          ctx.beginPath();
          ctx.arc(ball.x, ball.y, ball.r + 15 + pulse * 5, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = "#facc15";
          ctx.font = "bold 10px ui-sans-serif, system-ui";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("BASH", ball.x, ball.y - ball.r - 18);
          ctx.restore();
        }

        ctx.save();
        ctx.shadowColor = "#60a5fa";
        ctx.shadowBlur = 10;
        ctx.strokeStyle = "rgba(96, 165, 250, 0.85)";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r + 8, ball.shieldAngle - game.balance.shield.arcWidth / 2, ball.shieldAngle + game.balance.shield.arcWidth / 2);
        ctx.stroke();
        ctx.strokeStyle = "#ef4444"; // Red accent on shield arc
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r + 3, ball.shieldAngle - game.balance.shield.arcWidth / 2, ball.shieldAngle + game.balance.shield.arcWidth / 2);
        ctx.stroke();
        ctx.restore();
      } else if (ball.shieldState === "dropped") {
        ctx.save();
        const pulse = Math.sin(game.simTime * 0.012) * 3;
        ctx.strokeStyle = "rgba(250, 204, 21, 0.85)";
        ctx.lineWidth = 3;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(ball.x, ball.y);
        ctx.lineTo(ball.shieldX, ball.shieldY);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(ball.shieldX, ball.shieldY, SHIELD_PICKUP_RADIUS + pulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "#facc15";
        ctx.font = "bold 11px ui-sans-serif, system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText("PICK UP", ball.shieldX, ball.shieldY - 34);
        ctx.restore();

        ctx.save();
        ctx.translate(ball.shieldX, ball.shieldY);
        ctx.rotate(0.35);
        const shieldR = 24;
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(0, 0, shieldR, 0, Math.PI * 2);
        ctx.fillStyle = "#ef4444";
        ctx.fill();
        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, shieldR * 0.72, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, 0, shieldR * 0.46, 0, Math.PI * 2);
        ctx.fillStyle = "#1d4ed8";
        ctx.fill();
        ctx.strokeStyle = "rgba(250, 204, 21, 0.9)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-18, -18);
        ctx.lineTo(18, 18);
        ctx.moveTo(16, -20);
        ctx.lineTo(-14, 16);
        ctx.stroke();
        ctx.restore();
        ctx.save();
        ctx.strokeStyle = "rgba(250, 204, 21, 0.85)";
        ctx.lineWidth = 4;
        ctx.setLineDash([10, 8]);
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r + 8, -0.7, 0.35);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r + 8, 1.4, 2.2);
        ctx.stroke();
        ctx.restore();
      } else {
        // Draw the thrown flying shield
        ctx.save();
        const speed = Math.hypot(ball.shieldVx || 0, ball.shieldVy || 0);
        const trailLen = clamp(speed * 0.055, 18, 54);
        const trailAngle = Math.atan2(ball.shieldVy || 0, ball.shieldVx || 0);
        ctx.translate(ball.shieldX, ball.shieldY);
        ctx.rotate(trailAngle);
        const trailGrad = ctx.createLinearGradient(0, 0, -trailLen, 0);
        trailGrad.addColorStop(0, "rgba(255,255,255,0.55)");
        trailGrad.addColorStop(0.45, "rgba(96,165,250,0.34)");
        trailGrad.addColorStop(1, "rgba(239,68,68,0)");
        ctx.strokeStyle = trailGrad;
        ctx.lineWidth = 12;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-trailLen, 0);
        ctx.stroke();
        ctx.strokeStyle = "rgba(255,255,255,0.45)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-trailLen * 0.72, 0);
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.translate(ball.shieldX, ball.shieldY);
        ctx.rotate(ball.shieldSpinAngle || 0);

        const shieldR = 24;

        ctx.beginPath();
        ctx.arc(0, 0, shieldR, 0, Math.PI * 2);
        ctx.fillStyle = "#ef4444";
        ctx.fill();

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, shieldR * 0.75, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0, 0, shieldR * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = "#1d4ed8";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0, 0, shieldR * 0.24, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        ctx.restore();
      }

      drawHealthInsideBall(ball);
    };

    const drawSpiderBall = (ball) => {
      const config = BALL_TYPES.spider;
      ctx.save(); ctx.translate(ball.x, ball.y);
      ctx.strokeStyle = config.stroke; ctx.lineWidth = 3; ctx.lineCap = "round";
      
      const legSwing = Math.sin(game.simTime * 0.015) * 0.2;
      for (let i = 0; i < 8; i++) {
        const isLeft = i < 4, legIdx = i % 4;
        const baseAngle = isLeft ? Math.PI * 0.7 + legIdx * 0.2 : -Math.PI * 0.1 + legIdx * 0.2;
        const angle = baseAngle + legSwing * (i % 2 === 0 ? 1 : -1);
        const jX = Math.cos(angle) * ball.r, jY = Math.sin(angle) * ball.r;
        const tX = Math.cos(angle) * (ball.r + 14), tY = Math.sin(angle) * (ball.r + 14) + (isLeft ? 5 : -5);
        ctx.beginPath(); ctx.moveTo(jX * 0.8, jY * 0.8);
        ctx.quadraticCurveTo(jX * 1.3, jY * 1.3, tX, tY); ctx.stroke();
      }

      ctx.beginPath(); ctx.arc(0, 0, ball.r, 0, Math.PI * 2);
      ctx.fillStyle = config.color; ctx.fill();
      ctx.lineWidth = 4; ctx.strokeStyle = config.stroke; ctx.stroke();

      // Draw blue spider-web pattern on red shell
      ctx.save();
      ctx.strokeStyle = config.stroke; ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-ball.r, 0); ctx.lineTo(ball.r, 0);
      ctx.moveTo(0, -ball.r); ctx.lineTo(0, ball.r);
      ctx.moveTo(-ball.r * 0.7, -ball.r * 0.7); ctx.lineTo(ball.r * 0.7, ball.r * 0.7);
      ctx.moveTo(-ball.r * 0.7, ball.r * 0.7); ctx.lineTo(ball.r * 0.7, -ball.r * 0.7);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, ball.r * 0.45, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, ball.r * 0.75, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Dark blue hourglass markings
      ctx.fillStyle = "#1e3a8a";
      ctx.beginPath(); ctx.moveTo(-6, -8); ctx.lineTo(6, -8); ctx.lineTo(0, 0); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(6, 8); ctx.lineTo(-6, 8); ctx.closePath(); ctx.fill();

      if (ball.fangFlashUntil > game.simTime) {
        ctx.save();
        const target = game.balls.find(o => o.id !== ball.id);
        if (target) {
          const angle = Math.atan2(target.y - ball.y, target.x - ball.x);
          ctx.rotate(angle + Math.PI / 2);
        }
        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur = 10;
        ctx.fillStyle = "#f8fafc";
        ctx.strokeStyle = "#1e3a8a";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-12, -ball.r + 7);
        ctx.lineTo(-3, -ball.r - 14);
        ctx.lineTo(2, -ball.r + 7);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(12, -ball.r + 7);
        ctx.lineTo(3, -ball.r - 14);
        ctx.lineTo(-2, -ball.r + 7);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
        ctx.restore();
      }
      ctx.restore();

      // Draw blue spider-web pattern on red shell
      ctx.save();
      ctx.strokeStyle = config.stroke; ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-ball.r, 0); ctx.lineTo(ball.r, 0);
      ctx.moveTo(0, -ball.r); ctx.lineTo(0, ball.r);
      ctx.moveTo(-ball.r * 0.7, -ball.r * 0.7); ctx.lineTo(ball.r * 0.7, ball.r * 0.7);
      ctx.moveTo(-ball.r * 0.7, ball.r * 0.7); ctx.lineTo(ball.r * 0.7, -ball.r * 0.7);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, ball.r * 0.45, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, ball.r * 0.75, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      drawHealthInsideBall(ball);

      if (ball.webState === "shooting" || ball.webState === "pulling" || ball.webState === "webBouncing") {
        ctx.save(); ctx.strokeStyle = "rgba(226, 232, 240, 0.65)"; ctx.lineWidth = 2.5;
        ctx.shadowColor = "#ffffff"; ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.moveTo(ball.x, ball.y); ctx.lineTo(ball.webX, ball.webY);
        ctx.stroke();

        if (ball.webState === "shooting") {
          ctx.fillStyle = "#cbd5e1"; ctx.beginPath(); ctx.arc(ball.webX, ball.webY, 6, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = "#e2e8f0"; ctx.lineWidth = 1.5;
          for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
            ctx.beginPath(); ctx.moveTo(ball.webX, ball.webY);
            ctx.lineTo(ball.webX + Math.cos(a) * 9, ball.webY + Math.sin(a) * 9); ctx.stroke();
          }
        }
        ctx.restore();
      }
    };

    const drawBlackSpiderBall = (ball) => {
      const config = BALL_TYPES.blackSpider || { color: "#020617", stroke: "#f1f5f9" };
      ctx.save();
      ctx.translate(ball.x, ball.y);
      
      // 1. Draw writhing tendrils/legs
      const timeOffset = game.simTime * 0.016;
      ctx.lineCap = "round";
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3 + Math.sin(timeOffset + i) * 0.22;
        const jX = Math.cos(angle) * ball.r;
        const jY = Math.sin(angle) * ball.r;
        const cX = Math.cos(angle + 0.1) * (ball.r + 8 + Math.sin(timeOffset * 2 + i) * 4);
        const cY = Math.sin(angle + 0.1) * (ball.r + 8 + Math.sin(timeOffset * 2 + i) * 4);
        const tX = Math.cos(angle) * (ball.r + 14 + Math.sin(timeOffset * 1.5 + i) * 6);
        const tY = Math.sin(angle) * (ball.r + 14 + Math.sin(timeOffset * 1.5 + i) * 6);
        
        // Underglow stroke
        ctx.strokeStyle = "#f1f5f9";
        ctx.lineWidth = 6.5;
        ctx.save();
        ctx.shadowColor = "#cbd5e1";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(jX * 0.8, jY * 0.8);
        ctx.quadraticCurveTo(cX, cY, tX, tY);
        ctx.stroke();
        ctx.restore();

        // Dark central stroke
        ctx.strokeStyle = "#090d16";
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(jX * 0.8, jY * 0.8);
        ctx.quadraticCurveTo(cX, cY, tX, tY);
        ctx.stroke();
      }

      // 2. Draw glossy black body background
      ctx.beginPath();
      ctx.arc(0, 0, ball.r, 0, Math.PI * 2);
      const metalGrad = ctx.createRadialGradient(
        -ball.r * 0.25, -ball.r * 0.25, 2,
        0, 0, ball.r
      );
      metalGrad.addColorStop(0, "#475569");
      metalGrad.addColorStop(0.4, "#1e293b");
      metalGrad.addColorStop(0.75, "#0f172a");
      metalGrad.addColorStop(1, "#020617");
      ctx.fillStyle = metalGrad;
      ctx.fill();

      // 2b. Draw white web pattern inside the black spider ball
      ctx.save();
      ctx.strokeStyle = "rgba(241, 245, 249, 0.4)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-ball.r * 0.95, 0); ctx.lineTo(ball.r * 0.95, 0);
      ctx.moveTo(0, -ball.r * 0.95); ctx.lineTo(0, ball.r * 0.95);
      ctx.moveTo(-ball.r * 0.67, -ball.r * 0.67); ctx.lineTo(ball.r * 0.67, ball.r * 0.67);
      ctx.moveTo(-ball.r * 0.67, ball.r * 0.67); ctx.lineTo(ball.r * 0.67, -ball.r * 0.67);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, ball.r * 0.42, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, ball.r * 0.72, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Outer light stroke with glow
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = config.stroke || "#f1f5f9";
      ctx.save();
      ctx.shadowColor = "#e2e8f0";
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.restore();

      // Draw String Pull Slam visuals
      if (ball.bsSkillState === "throwing") {
        ctx.restore(); ctx.save();
        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.shadowColor = "#cbd5e1";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        const midX = (ball.x + ball.bsStringX) / 2 + Math.sin(game.simTime * 0.05) * 8;
        const midY = (ball.y + ball.bsStringY) / 2 + Math.cos(game.simTime * 0.05) * 8;
        ctx.moveTo(ball.x, ball.y);
        ctx.quadraticCurveTo(midX, midY, ball.bsStringX, ball.bsStringY);
        ctx.stroke();
        
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2.0;
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.moveTo(ball.x, ball.y);
        ctx.quadraticCurveTo(midX, midY, ball.bsStringX, ball.bsStringY);
        ctx.stroke();
        
        // draw projectile head
        ctx.fillStyle = "#f1f5f9";
        ctx.beginPath();
        ctx.arc(ball.bsStringX, ball.bsStringY, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.restore(); ctx.save();
        ctx.translate(ball.x, ball.y);
      } else if ((ball.bsSkillState === "pulling" || ball.bsSkillState === "spinning") && ball.bsHookedTargetId) {
        const target = game.balls.find(o => o.id === ball.bsHookedTargetId);
        if (target) {
          ctx.restore(); ctx.save();
          ctx.strokeStyle = "#94a3b8";
          ctx.lineWidth = 5.5;
          ctx.lineCap = "round";
          ctx.shadowColor = "#e2e8f0";
          ctx.shadowBlur = 12;
          ctx.beginPath();
          const midX = (ball.x + target.x) / 2 + (Math.random() - 0.5) * 3;
          const midY = (ball.y + target.y) / 2 + (Math.random() - 0.5) * 3;
          ctx.moveTo(ball.x, ball.y);
          ctx.quadraticCurveTo(midX, midY, target.x, target.y);
          ctx.stroke();
          
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2.2;
          ctx.shadowBlur = 0;
          ctx.beginPath();
          ctx.moveTo(ball.x, ball.y);
          ctx.quadraticCurveTo(midX, midY, target.x, target.y);
          ctx.stroke();
          ctx.restore(); ctx.save();
          ctx.translate(ball.x, ball.y);
        }
      }


      // 3. Draw white eye markings (Venom style)
      const isAggressive = (ball.venomLashFlashUntil && game.simTime < ball.venomLashFlashUntil) ||
                            (ball.bsSkillState && ball.bsSkillState !== "idle");
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "#f1f5f9";
      ctx.shadowBlur = isAggressive ? 6 : 2;

      // Left eye path
      ctx.beginPath();
      if (isAggressive) {
        ctx.moveTo(-16, -6);
        ctx.quadraticCurveTo(-6, -11, -3, -5);
        ctx.quadraticCurveTo(-7, -4, -16, -6);
      } else {
        ctx.moveTo(-18, -2);
        ctx.quadraticCurveTo(-11, -16, -4, -4);
        ctx.quadraticCurveTo(-10, -5, -18, -2);
      }
      ctx.fill();

      // Right eye path
      ctx.beginPath();
      if (isAggressive) {
        ctx.moveTo(16, -6);
        ctx.quadraticCurveTo(6, -11, 3, -5);
        ctx.quadraticCurveTo(7, -4, 16, -6);
      } else {
        ctx.moveTo(18, -2);
        ctx.quadraticCurveTo(11, -16, 4, -4);
        ctx.quadraticCurveTo(10, -5, 18, -2);
      }
      ctx.fill();

      ctx.restore();
      drawHealthInsideBall(ball);
    };

    const drawBomberBall = (ball) => {
      const config = BALL_TYPES.bomber;
      ctx.save(); ctx.translate(ball.x, ball.y);
      ctx.beginPath(); ctx.arc(0, 0, ball.r, 0, Math.PI * 2);
      ctx.fillStyle = config.color; ctx.fill();
      ctx.clip();

      ctx.strokeStyle = "#1e293b"; ctx.lineWidth = 8;
      for (let xOffset = -ball.r * 2; xOffset < ball.r * 2; xOffset += 18) {
        ctx.beginPath(); ctx.moveTo(xOffset, -ball.r - 2);
        ctx.lineTo(xOffset + 24, ball.r + 2); ctx.stroke();
      }

      ctx.restore(); ctx.save(); ctx.translate(ball.x, ball.y);
      ctx.beginPath(); ctx.arc(0, 0, ball.r, 0, Math.PI * 2);
      ctx.lineWidth = 4; ctx.strokeStyle = config.stroke; ctx.stroke();
      ctx.fillStyle = "#1e293b"; ctx.beginPath(); ctx.arc(0, 2, 8, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(-2, -8, 4, 6); ctx.restore();
      drawHealthInsideBall(ball);
    };


    const drawHammerBall = (ball) => {
      const config = BALL_TYPES.hammer;
      const target = game.balls.find(o => o.side !== ball.side);
      
      // Draw targeting laser when charging
      if (ball.hammerState === "charging" && target) {
        ctx.save();
        ctx.strokeStyle = "rgba(147, 197, 253, 0.65)";
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        const hx = ball.x + Math.cos(ball.hammerAngle) * (ball.r + 40);
        const hy = ball.y + Math.sin(ball.hammerAngle) * (ball.r + 40);
        ctx.moveTo(hx, hy);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
        ctx.restore();
      }

      ctx.save();
      
      // Vibrate if charging
      let vibX = 0, vibY = 0;
      if (ball.hammerState === "charging") {
        vibX = (Math.random() - 0.5) * 3.5;
        vibY = (Math.random() - 0.5) * 3.5;
      }
      ctx.translate(ball.x + vibX, ball.y + vibY);
      
      // Draw hammer handle and head
      ctx.save();
      ctx.rotate(ball.hammerAngle || 0);
      
      // Thunder hammer handle
      ctx.strokeStyle = "#7c2d12";
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(ball.r + 26, 0);
      ctx.stroke();

      ctx.strokeStyle = "#facc15";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(4, -3);
      ctx.lineTo(ball.r + 22, -3);
      ctx.moveTo(4, 3);
      ctx.lineTo(ball.r + 22, 3);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Hammer head
      const headGrad = ctx.createLinearGradient(ball.r + 22, -14, ball.r + 42, 14);
      headGrad.addColorStop(0, "#f8fafc");
      headGrad.addColorStop(0.5, "#94a3b8");
      headGrad.addColorStop(1, "#e2e8f0");
      ctx.fillStyle = headGrad;
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.rect(ball.r + 22, -14, 20, 28);
      ctx.fill();
      ctx.stroke();

      ctx.restore();

      // Main ball: silver outer shell
      ctx.beginPath();
      ctx.arc(0, 0, ball.r, 0, Math.PI * 2);
      const bodyGrad = ctx.createRadialGradient(-ball.r * 0.35, -ball.r * 0.4, 4, 0, 0, ball.r);
      bodyGrad.addColorStop(0, "#f8fafc");
      bodyGrad.addColorStop(0.5, config.color);
      bodyGrad.addColorStop(1, "#64748b");
      ctx.fillStyle = bodyGrad;
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = config.stroke;
      ctx.stroke();

      // Inner metal ring
      ctx.beginPath();
      ctx.arc(0, 0, ball.r * 0.65, 0, Math.PI * 2);
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Center rivet
      ctx.beginPath();
      ctx.arc(0, 0, ball.r * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = "#94a3b8";
      ctx.fill();

      ctx.strokeStyle = "rgba(147, 197, 253, 0.75)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, ball.r * 0.72, Math.PI * 0.1, Math.PI * 1.25);
      ctx.stroke();

      if (ball.hammerState === "charging" || ball.hammerState === "launching") {
        ctx.strokeStyle = "rgba(96, 165, 250, 0.9)";
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
          const a = (game.simTime * 0.01 + i * 2.1) % (Math.PI * 2);
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * (ball.r + 2), Math.sin(a) * (ball.r + 2));
          ctx.lineTo(Math.cos(a + 0.25) * (ball.r + 12), Math.sin(a + 0.25) * (ball.r + 12));
          ctx.lineTo(Math.cos(a - 0.1) * (ball.r + 20), Math.sin(a - 0.1) * (ball.r + 20));
          ctx.stroke();
        }
      }

      ctx.restore();
      if (ball.hammerState === "charging") {
        ctx.save();
        ctx.fillStyle = "#fbbf24";
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "center";
        ctx.shadowColor = "rgba(15, 23, 42, 0.8)";
        ctx.shadowBlur = 4;
        ctx.fillText("Hammer Charge", ball.x, ball.y - ball.r - 16);
        ctx.restore();
      }
      drawHealthInsideBall(ball);
    };

    const drawArmBall = (ball) => {
      const config = BALL_TYPES.arm;
      const bal = game.balance;
      const L = bal.arm.grabRange;
      
      let yOffset = 0;
      if (ball.armState === "elbow_dropping") {
        const duration = Math.max(1, ball.armStateUntil - (ball.armDropStartAt || game.simTime));
        const elapsed = game.simTime - (ball.armDropStartAt || game.simTime);
        const progress = clamp(elapsed / duration, 0, 1);
        yOffset = -18 * Math.sin(progress * Math.PI);
      }
      
      const armAngle = ball.armAngle || 0;
      const enemy = game.balls.find(b => b.id !== ball.id);
      const punching = ball.armPunchUntil && game.simTime < ball.armPunchUntil;
      const punchDuration = Math.max(1, (ball.armPunchUntil || 0) - (ball.armPunchStartAt || 0));
      const punchProgress = punching ? clamp((game.simTime - (ball.armPunchStartAt || game.simTime)) / punchDuration, 0, 1) : 0;
      const punchExtend = punching
        ? Math.sin(Math.min(1, punchProgress * 1.35) * Math.PI) * 42 - Math.sin(punchProgress * Math.PI) * 9
        : 0;
      const dropAngle = ball.armState === "elbow_dropping"
        ? Math.atan2((ball.armDropTargetY || ball.y) - ball.y, (ball.armDropTargetX || ball.x) - ball.x)
        : armAngle;
      const drawArmAngle = punching ? (ball.armPunchAngle ?? armAngle) : dropAngle;
      const reach = L + punchExtend;
      const handX = ball.armState === "elbow_dropping"
        ? (ball.armDropTargetX || (enemy ? enemy.x : ball.x))
        : ball.x + Math.cos(drawArmAngle) * reach;
      const handY = ball.armState === "elbow_dropping"
        ? (ball.armDropTargetY || (enemy ? enemy.y : ball.y))
        : ball.y + Math.sin(drawArmAngle) * reach;

      // Draw the arm line / segments
      ctx.save();
      
      const bendAmp = ball.armState === "elbow_dropping" ? 14 : 6;
      const bendFreq = ball.armState === "elbow_dropping" ? 0.03 : 0.01;
      const bendOffset = Math.sin(game.simTime * bendFreq) * bendAmp;
      
      const midX = (ball.x + handX) / 2;
      const midY = (ball.y + yOffset + handY) / 2;
      const perpAngle = drawArmAngle + Math.PI / 2;
      const punchSnap = punching ? Math.sin(punchProgress * Math.PI) : 0;
      const jointX = midX + Math.cos(perpAngle) * bendOffset - Math.cos(drawArmAngle) * punchSnap * 12;
      const jointY = midY + Math.sin(perpAngle) * bendOffset - Math.sin(drawArmAngle) * punchSnap * 12;

      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 10;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(ball.x, ball.y + yOffset);
      ctx.lineTo(jointX, jointY);
      ctx.stroke();

      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(ball.x, ball.y + yOffset);
      ctx.lineTo(jointX, jointY);
      ctx.stroke();

      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(jointX, jointY);
      ctx.lineTo(handX, handY);
      ctx.stroke();

      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(jointX, jointY);
      ctx.lineTo(handX, handY);
      ctx.stroke();

      ctx.fillStyle = "#cbd5e1";
      ctx.strokeStyle = "#f8fafc";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(jointX, jointY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(jointX, jointY, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.translate(handX, handY);
      ctx.rotate(drawArmAngle);
      
      let fingerAngle = 0.5;
      if (punching) {
        fingerAngle = 0.02;
      } else if (ball.armState === "elbow_dropping") {
        fingerAngle = 0.12 + Math.sin(game.simTime * 0.05) * 0.05;
      } else {
        fingerAngle = 0.4 + Math.sin(game.simTime * 0.015) * 0.15;
      }

      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.fillStyle = "#e5e7eb";

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(Math.cos(fingerAngle) * 15, Math.sin(fingerAngle) * 15, Math.cos(fingerAngle) * 20 - Math.sin(fingerAngle) * 5, Math.sin(fingerAngle) * 20 + Math.cos(fingerAngle) * 5);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(Math.cos(-fingerAngle) * 15, Math.sin(-fingerAngle) * 15, Math.cos(-fingerAngle) * 20 - Math.sin(-fingerAngle) * -5, Math.sin(-fingerAngle) * 20 + Math.cos(-fingerAngle) * -5);
      ctx.stroke();

      ctx.fillStyle = punching ? "#f8fafc" : "#cbd5e1";
      ctx.beginPath();
      ctx.arc(0, 0, punching ? 10 + punchSnap * 3 : 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      if (punching) {
        ctx.strokeStyle = "rgba(248, 250, 252, 0.7)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 16 + punchSnap * 10, -0.8, 0.8);
        ctx.stroke();
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(5, 0, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      ctx.restore();

      ctx.save();
      ctx.translate(ball.x, ball.y + yOffset);
      ctx.beginPath();
      ctx.arc(0, 0, ball.r, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(-ball.r * 0.3, -ball.r * 0.3, 3, 0, 0, ball.r);
      grad.addColorStop(0, "#f8fafc");
      grad.addColorStop(0.4, config.color);
      grad.addColorStop(1, "#020617");
      ctx.fillStyle = grad;
      ctx.fill();
      
      ctx.strokeStyle = config.stroke;
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.strokeStyle = "rgba(226, 232, 240, 0.9)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, ball.r * 0.65, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const radius = i % 2 === 0 ? ball.r * 0.34 : ball.r * 0.14;
        const a = -Math.PI / 2 + (i * Math.PI) / 5;
        const x = Math.cos(a) * radius;
        const y = Math.sin(a) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "rgba(226, 232, 240, 0.85)";
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * ball.r * 0.65, Math.sin(a) * ball.r * 0.65, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      drawHealthInsideBall(ball);
    };

    const drawLightning = (x1, y1, x2, y2, color, thickness) => {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      
      const dist = Math.hypot(x2 - x1, y2 - y1);
      const segments = Math.max(5, Math.floor(dist / 20));
      const dx = (x2 - x1) / segments;
      const dy = (y2 - y1) / segments;
      
      const px = -dy;
      const py = dx;
      const hyp = Math.hypot(px, py);
      
      for (let i = 1; i < segments; i++) {
        const cx = x1 + dx * i;
        const cy = y1 + dy * i;
        const offset = (Math.random() - 0.5) * Math.min(25, dist * 0.15);
        ctx.lineTo(cx + (px * offset) / (hyp || 1), cy + (py * offset) / (hyp || 1));
      }
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.restore();
    };

    const drawChessBall = (ball) => {
      const drawKnightCrown = (size) => {
        ctx.beginPath();
        ctx.moveTo(-size * 0.4, size * 0.5);
        ctx.lineTo(-size * 0.4, -size * 0.2);
        ctx.quadraticCurveTo(-size * 0.4, -size * 0.6, 0, -size * 0.6);
        ctx.quadraticCurveTo(size * 0.4, -size * 0.6, size * 0.3, -size * 0.2);
        ctx.lineTo(size * 0.4, -size * 0.1);
        ctx.lineTo(size * 0.1, -size * 0.1);
        ctx.lineTo(size * 0.3, size * 0.5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(-size * 0.05, -size * 0.35, size * 0.06, 0, Math.PI * 2);
        ctx.fill();
      };

      const drawBishopCrown = (size) => {
        ctx.beginPath();
        ctx.moveTo(-size * 0.3, size * 0.5);
        ctx.quadraticCurveTo(-size * 0.4, -size * 0.1, -size * 0.1, -size * 0.5);
        ctx.lineTo(0, -size * 0.4);
        ctx.lineTo(size * 0.1, -size * 0.5);
        ctx.quadraticCurveTo(size * 0.4, -size * 0.1, size * 0.3, size * 0.5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = size * 0.09;
        ctx.beginPath();
        ctx.moveTo(0, -size * 0.15);
        ctx.lineTo(0, size * 0.25);
        ctx.moveTo(-size * 0.12, size * 0.02);
        ctx.lineTo(size * 0.12, size * 0.02);
        ctx.stroke();
      };

      const drawRookCrown = (size) => {
        ctx.beginPath();
        ctx.moveTo(-size * 0.3, size * 0.5);
        ctx.lineTo(-size * 0.3, -size * 0.3);
        ctx.lineTo(-size * 0.4, -size * 0.3);
        ctx.lineTo(-size * 0.4, -size * 0.5);
        ctx.lineTo(-size * 0.2, -size * 0.5);
        ctx.lineTo(-size * 0.2, -size * 0.35);
        ctx.lineTo(-size * 0.1, -size * 0.35);
        ctx.lineTo(-size * 0.1, -size * 0.5);
        ctx.lineTo(size * 0.1, -size * 0.5);
        ctx.lineTo(size * 0.1, -size * 0.35);
        ctx.lineTo(size * 0.2, -size * 0.35);
        ctx.lineTo(size * 0.2, -size * 0.5);
        ctx.lineTo(size * 0.4, -size * 0.5);
        ctx.lineTo(size * 0.4, -size * 0.3);
        ctx.lineTo(size * 0.3, -size * 0.3);
        ctx.lineTo(size * 0.3, size * 0.5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      };

      if (ball.chessState === "activeCrown") {
        ctx.save();
        ctx.strokeStyle = "rgba(251, 191, 36, 0.45)";
        ctx.fillStyle = "rgba(251, 191, 36, 0.04)";
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.arc(ARENA_SIZE / 2, ARENA_SIZE / 2, ball.r * ball.chessScale, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Draw attack path indicators (faint dashed red lines)
        ctx.save();
        ctx.strokeStyle = "rgba(239, 68, 68, 0.35)";
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 6]);
        
        const cx = ARENA_SIZE / 2;
        const cy = ARENA_SIZE / 2;
        const pad = 18 + ball.r;

        if (ball.chessCrown === "bishop") {
          ctx.beginPath();
          ctx.moveTo(pad, pad);
          ctx.lineTo(ARENA_SIZE - pad, ARENA_SIZE - pad);
          ctx.moveTo(ARENA_SIZE - pad, pad);
          ctx.lineTo(pad, ARENA_SIZE - pad);
          ctx.stroke();
        } else if (ball.chessCrown === "rook") {
          ctx.beginPath();
          ctx.moveTo(pad, cy);
          ctx.lineTo(ARENA_SIZE - pad, cy);
          ctx.moveTo(cx, pad);
          ctx.lineTo(cx, ARENA_SIZE - pad);
          ctx.stroke();
        } else if (ball.chessCrown === "knight") {
          ctx.beginPath();
          ctx.moveTo(cx, cy); ctx.lineTo(cx, cy - 160); ctx.lineTo(cx - 80, cy - 160);
          ctx.moveTo(cx, cy); ctx.lineTo(cx, cy - 160); ctx.lineTo(cx + 80, cy - 160);
          ctx.moveTo(cx, cy); ctx.lineTo(cx, cy + 160); ctx.lineTo(cx - 80, cy + 160);
          ctx.moveTo(cx, cy); ctx.lineTo(cx, cy + 160); ctx.lineTo(cx + 80, cy + 160);
          ctx.stroke();
        }
        ctx.restore();
      }

      ctx.save();
      ctx.translate(ball.x, ball.y);
      
      ctx.beginPath();
      ctx.arc(0, 0, ball.r, 0, Math.PI * 2);
      ctx.clip();
      
      const sqSize = ball.r / 2;
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(-ball.r, -ball.r, ball.r * 2, ball.r * 2);
      
      ctx.fillStyle = "#f8fafc";
      for (let i = -2; i < 2; i++) {
        for (let j = -2; j < 2; j++) {
          if ((i + j) % 2 === 0) {
            ctx.fillRect(i * sqSize, j * sqSize, sqSize, sqSize);
          }
        }
      }
      ctx.restore();

      ctx.save();
      ctx.translate(ball.x, ball.y);
      ctx.beginPath();
      ctx.arc(0, 0, ball.r, 0, Math.PI * 2);
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 4;
      ctx.stroke();
      
      if (ball.chessCrown) {
        ctx.fillStyle = "#fbbf24";
        ctx.strokeStyle = "#78350f";
        ctx.lineWidth = 2.5;
        
        ctx.save();
        const baseSize = ball.r * 0.7;
        ctx.scale(ball.chessScale, ball.chessScale);
        
        if (ball.chessCrown === "knight") {
          drawKnightCrown(baseSize);
        } else if (ball.chessCrown === "bishop") {
          drawBishopCrown(baseSize);
        } else if (ball.chessCrown === "rook") {
          drawRookCrown(baseSize);
        }
        ctx.restore();
      }
      
      ctx.restore();
      drawHealthInsideBall(ball);
    };

    const drawDragonBall = (ball) => {
      const config = BALL_TYPES.dragon;
      const angle = ball.dragonAngle || ball.angle || 0;
      ctx.save();
      ctx.translate(ball.x, ball.y);
      if (ball.dragonState === "dashing") {
        ctx.save();
        ctx.shadowColor = "#f97316";
        ctx.shadowBlur = 25;
        ctx.globalAlpha = 0.65 + Math.sin(game.simTime * 0.04) * 0.15;
        const radGrad = ctx.createRadialGradient(0, 0, ball.r - 2, 0, 0, ball.r + 14);
        radGrad.addColorStop(0, "rgba(254, 240, 138, 0.45)");
        radGrad.addColorStop(0.5, "rgba(249, 115, 22, 0.35)");
        radGrad.addColorStop(1, "rgba(220, 38, 38, 0)");
        ctx.fillStyle = radGrad;
        ctx.beginPath(); ctx.arc(0, 0, ball.r + 14, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
      ctx.rotate(angle);
      ctx.fillStyle = "#f97316";
      ctx.strokeStyle = "#7f1d1d";
      ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(-6, -ball.r + 4); ctx.lineTo(4, -ball.r - 18); ctx.lineTo(13, -ball.r + 5); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-6, ball.r - 4); ctx.lineTo(4, ball.r + 18); ctx.lineTo(13, ball.r - 5); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, ball.r, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(-ball.r * 0.3, -ball.r * 0.3, 3, 0, 0, ball.r);
      grad.addColorStop(0, "#fb923c");
      grad.addColorStop(0.52, config.color);
      grad.addColorStop(1, "#7f1d1d");
      ctx.fillStyle = grad; ctx.fill();
      ctx.lineWidth = 4; ctx.strokeStyle = config.stroke; ctx.stroke();
      ctx.fillStyle = "#fed7aa";
      ctx.beginPath(); ctx.moveTo(ball.r - 3, -8); ctx.lineTo(ball.r + 14, 0); ctx.lineTo(ball.r - 3, 8); ctx.closePath(); ctx.fill();
      const heat = ball.dragonHeat || 0;
      if (heat > 0) {
        ctx.fillStyle = "#facc15";
        ctx.font = "bold 9px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`HEAT ${heat}`, 0, ball.r + 16);
      }
      ctx.restore();

      const target = game.balls.find(o => o.side !== ball.side);
      if (target) {
        const bal = game.balance.dragon;
        const flameRange = bal.flameRange || 100;
        const flameAngle = bal.flameAngle || 0.55;
        const dist = Math.hypot(target.x - ball.x, target.y - ball.y);
        const active = game.simTime < (ball.dragonFlameActiveUntil || 0);
        if (active) {
          const mouthX = ball.x + Math.cos(angle) * (ball.r + 12);
          const mouthY = ball.y + Math.sin(angle) * (ball.r + 12);
          const time = game.simTime || 0;
          const flameCount = 5;
          ctx.save();
          ctx.globalCompositeOperation = "lighter";
          for (let i = 0; i < flameCount; i++) {
            const t = (i + 0.5) / flameCount;
            const side = t - 0.5;
            const flicker = Math.sin(time * 0.018 + i * 1.73) * 0.5 + Math.sin(time * 0.031 + i) * 0.5;
            const tongueAngle = angle + side * flameAngle * 0.82 + flicker * 0.07;
            const length = flameRange * (0.45 + (1 - Math.abs(side)) * 0.3 + flicker * 0.04);
            const width = 10 + (1 - Math.abs(side) * 1.5) * 18 + Math.sin(time * 0.024 + i * 2.1) * 4;
            const endX = mouthX + Math.cos(tongueAngle) * length;
            const endY = mouthY + Math.sin(tongueAngle) * length;
            const midX = mouthX + Math.cos(tongueAngle + flicker * 0.12) * length * 0.52;
            const midY = mouthY + Math.sin(tongueAngle + flicker * 0.12) * length * 0.52;
            const nx = -Math.sin(tongueAngle);
            const ny = Math.cos(tongueAngle);
            const grad = ctx.createLinearGradient(mouthX, mouthY, endX, endY);
            grad.addColorStop(0, "rgba(255, 255, 255, 0.82)");
            grad.addColorStop(0.18, "rgba(254, 240, 138, 0.72)");
            grad.addColorStop(0.55, "rgba(249, 115, 22, 0.48)");
            grad.addColorStop(1, "rgba(220, 38, 38, 0)");
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.moveTo(mouthX, mouthY);
            ctx.quadraticCurveTo(midX + nx * width, midY + ny * width, endX, endY);
            ctx.quadraticCurveTo(midX - nx * width * 0.75, midY - ny * width * 0.75, mouthX, mouthY);
            ctx.fill();
          }

          ctx.shadowColor = "#facc15";
          ctx.shadowBlur = 18;
          ctx.strokeStyle = "rgba(254, 240, 138, 0.72)";
          ctx.lineWidth = 5 + Math.sin(time * 0.03) * 1.4;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(mouthX, mouthY);
          ctx.quadraticCurveTo(
            mouthX + Math.cos(angle + Math.sin(time * 0.025) * 0.1) * flameRange * 0.22,
            mouthY + Math.sin(angle + Math.sin(time * 0.025) * 0.1) * flameRange * 0.22,
            mouthX + Math.cos(angle) * flameRange * 0.45,
            mouthY + Math.sin(angle) * flameRange * 0.45
          );
          ctx.stroke();
          ctx.restore();
        } else {
          ctx.save();
          ctx.globalAlpha = 0.12;
          ctx.strokeStyle = "#fb923c";
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 9]);
          ctx.beginPath();
          ctx.arc(ball.x, ball.y, flameRange, angle - flameAngle / 2, angle + flameAngle / 2);
          ctx.stroke();
          ctx.restore();
        }
      }

      if (ball.burnUntil && game.simTime < ball.burnUntil) {
        ctx.save();
        ctx.globalAlpha = 0.45 + Math.sin(game.simTime * 0.025) * 0.15;
        ctx.strokeStyle = "#fb923c";
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r + 7, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();
      }
      drawHealthInsideBall(ball);
    };

    const drawPsychicerBall = (ball) => {
      const config = BALL_TYPES.psychicer;
      const pulse = 0.5 + Math.sin(game.simTime * 0.007) * 0.5;
      ctx.save();
      ctx.translate(ball.x, ball.y);

      if (ball.psychicFlashUntil && game.simTime < ball.psychicFlashUntil) {
        ctx.globalAlpha = 0.28;
        ctx.strokeStyle = "#f0abfc";
        ctx.lineWidth = 5;
        ctx.beginPath(); ctx.arc(0, 0, ball.r + 10 + pulse * 8, 0, Math.PI * 2); ctx.stroke();
        ctx.globalAlpha = 1;
      }

      ctx.shadowColor = "#a78bfa";
      ctx.shadowBlur = 12 + pulse * 8;
      ctx.beginPath(); ctx.arc(0, 0, ball.r, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(-ball.r * 0.3, -ball.r * 0.35, 4, 0, 0, ball.r);
      grad.addColorStop(0, "#f5d0fe");
      grad.addColorStop(0.45, config.color);
      grad.addColorStop(1, "#4c1d95");
      ctx.fillStyle = grad; ctx.fill();
      ctx.lineWidth = 4; ctx.strokeStyle = config.stroke; ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.strokeStyle = "#fdf4ff";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, ball.r * 0.55, -0.15 + pulse * 0.3, Math.PI * 1.35 + pulse * 0.3);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, ball.r * 0.28, Math.PI * 0.8 - pulse * 0.25, Math.PI * 2.1 - pulse * 0.25);
      ctx.stroke();

      ctx.fillStyle = "#fdf4ff";
      ctx.beginPath(); ctx.arc(-8, -5, 4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(8, -5, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#7c3aed";
      ctx.beginPath(); ctx.arc(-8 + pulse * 1.2, -5, 1.8, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(8 + pulse * 1.2, -5, 1.8, 0, Math.PI * 2); ctx.fill();

      const cd = Number.isFinite(ball.nextPsychicAt) ? Math.max(0, (ball.nextPsychicAt || 0) - game.simTime) : 0;
      if (cd > 0) {
        ctx.fillStyle = "#fdf4ff";
        ctx.font = "bold 8px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`${Math.ceil(cd / 1000)}s`, 0, ball.r + 14);
      }
      ctx.restore();
      drawHealthInsideBall(ball);
    };

    const drawChaosBall = (ball) => {
      const config = BALL_TYPES.chaos;
      const pulse = 0.5 + Math.sin(game.simTime * 0.01) * 0.5;
      const ownerCircles = (game.chaosCircles || []).filter((circle) => circle.ownerId === ball.id);
      const verticalCircle = ownerCircles.find((circle) => circle.armSide === "left");
      const horizontalCircle = ownerCircles.find((circle) => circle.armSide === "right");
      const controlledTarget = game.balls.find((other) => other.chaosControllerId === ball.id && other.chaosControlledUntil > game.simTime && !other.chaosSlamDone);

      const drawArmToCircle = (circle, side) => {
        const baseAngle = side === "left" ? Math.PI * 0.78 : Math.PI * 0.22;
        const sx = ball.x + Math.cos(baseAngle) * (ball.r - 2);
        const sy = ball.y + Math.sin(baseAngle) * (ball.r - 2);
        const targetControlledByArm = controlledTarget && ((side === "left" && controlledTarget.chaosControlAxis === "vertical") || (side === "right" && controlledTarget.chaosControlAxis === "horizontal"));
        const hasCircle = !!circle || !!targetControlledByArm;
        const tx = targetControlledByArm ? controlledTarget.x : hasCircle ? circle.x : ball.x + (side === "left" ? -42 : 42);
        const ty = targetControlledByArm ? controlledTarget.y : hasCircle ? circle.y : ball.y + Math.sin(game.simTime * 0.006 + (side === "left" ? 0 : 2)) * 14;
        const dist = Math.hypot(tx - sx, ty - sy);
        const aimAngle = Math.atan2(ty - sy, tx - sx);
        const wave = Math.sin(game.simTime * 0.022 + (side === "left" ? 0 : Math.PI)) * 0.45;
        const angle = aimAngle + (targetControlledByArm ? wave * 0.35 : wave * 0.18);
        const reach = targetControlledByArm ? 42 + pulse * 7 : hasCircle ? Math.min(dist, 58 + pulse * 8) : 34;
        const ex = sx + Math.cos(angle) * reach;
        const ey = sy + Math.sin(angle) * reach;
        const bend = (side === "left" ? -1 : 1) * (12 + Math.sin(game.simTime * 0.014) * 5);
        const midX = (sx + ex) / 2 + Math.cos(angle + Math.PI / 2) * bend;
        const midY = (sy + ey) / 2 + Math.sin(angle + Math.PI / 2) * bend;

        ctx.save();
        ctx.lineCap = "round";
        ctx.strokeStyle = side === "left" ? "#0ea5e9" : "#3b82f6";
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = hasCircle ? 10 : 4;
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.quadraticCurveTo(midX, midY, ex, ey);
        ctx.stroke();
        ctx.strokeStyle = "#111827";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.quadraticCurveTo(midX, midY, ex, ey);
        ctx.stroke();
        ctx.fillStyle = side === "left" ? "#bae6fd" : "#bfdbfe";
        ctx.beginPath(); ctx.arc(ex, ey, 6, 0, Math.PI * 2); ctx.fill();
        if (targetControlledByArm) {
          ctx.strokeStyle = side === "left" ? "rgba(186, 230, 253, 0.75)" : "rgba(191, 219, 254, 0.75)";
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 8]);
          ctx.lineDashOffset = -game.simTime * 0.08;
          for (let i = 0; i < 3; i++) {
            const spread = (i - 1) * 0.22 + Math.sin(game.simTime * 0.018 + i) * 0.05;
            const rayAngle = aimAngle + spread;
            const rayLength = 30 + i * 10 + pulse * 8;
            ctx.beginPath();
            ctx.moveTo(ex + Math.cos(rayAngle) * 8, ey + Math.sin(rayAngle) * 8);
            ctx.lineTo(ex + Math.cos(rayAngle) * rayLength, ey + Math.sin(rayAngle) * rayLength);
            ctx.stroke();
          }
          ctx.setLineDash([]);
        }
        ctx.restore();
      };

      drawArmToCircle(verticalCircle, "left");
      drawArmToCircle(horizontalCircle, "right");

      ctx.save();
      ctx.translate(ball.x, ball.y);
      if (ball.chaosFlashUntil && game.simTime < ball.chaosFlashUntil) {
        ctx.globalAlpha = 0.3;
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 5;
        ctx.beginPath(); ctx.arc(0, 0, ball.r + 10 + pulse * 10, 0, Math.PI * 2); ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // 1. Dark navy background for the ball
      ctx.fillStyle = "#0c101d";
      ctx.beginPath(); ctx.arc(0, 0, ball.r, 0, Math.PI * 2); ctx.fill();

      // 2. High-contrast orange-gold outer strokes
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#ea580c";
      ctx.beginPath(); ctx.arc(0, 0, ball.r, 0, Math.PI * 2); ctx.stroke();

      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "#f59e0b";
      ctx.beginPath(); ctx.arc(0, 0, ball.r - 2, 0, Math.PI * 2); ctx.stroke();

      // 3. Glowing orange-gold mystical magic circles (Tao Mandalas)
      ctx.shadowColor = "#f59e0b";
      ctx.shadowBlur = 8 + pulse * 4;

      const rRing1 = ball.r * 0.76;
      const rRing2 = ball.r * 0.64;

      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(0, 0, rRing1, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, rRing2, 0, Math.PI * 2); ctx.stroke();

      // Intersecting rotated squares (spinning 8-point mandala star)
      ctx.save();
      ctx.rotate(game.simTime * 0.0035);
      ctx.beginPath();
      for (let i = 0; i <= 4; i++) {
        const angle = (i * Math.PI) / 2;
        const px = Math.cos(angle) * rRing2;
        const py = Math.sin(angle) * rRing2;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      ctx.beginPath();
      for (let i = 0; i <= 4; i++) {
        const angle = (i * Math.PI) / 2 + Math.PI / 4;
        const px = Math.cos(angle) * rRing2;
        const py = Math.sin(angle) * rRing2;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.restore();

      // 4. Arcane runes rotating counter-wise between the gold rings
      ctx.save();
      ctx.rotate(-game.simTime * 0.0018);
      const rRune = (rRing1 + rRing2) / 2;
      ctx.strokeStyle = "#f59e0b";
      ctx.fillStyle = "#f59e0b";
      ctx.lineWidth = 1.2;
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        ctx.save();
        ctx.rotate(angle);
        ctx.translate(rRune, 0);
        ctx.beginPath();
        if (i % 3 === 0) {
          // Tiny diamond
          ctx.moveTo(-1.5, 0);
          ctx.lineTo(0, -1.5);
          ctx.lineTo(1.5, 0);
          ctx.lineTo(0, 1.5);
          ctx.closePath();
          ctx.fill();
        } else if (i % 3 === 1) {
          // Radial tick mark
          ctx.moveTo(0, -2);
          ctx.lineTo(0, 2);
          ctx.stroke();
        } else {
          // Small triangle
          ctx.moveTo(-1.5, -1.5);
          ctx.lineTo(1.5, 0);
          ctx.lineTo(-1.5, 1.5);
          ctx.closePath();
          ctx.stroke();
        }
        ctx.restore();
      }
      ctx.restore();

      // 5. Subtle green magical accents
      ctx.shadowColor = "#10b981";
      ctx.shadowBlur = 4;
      ctx.fillStyle = "#10b981";
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2 + game.simTime * 0.0015;
        const px = Math.cos(angle) * (ball.r * 0.48);
        const py = Math.sin(angle) * (ball.r * 0.48);
        ctx.beginPath(); ctx.arc(px, py, 1.5, 0, Math.PI * 2); ctx.fill();
      }

      ctx.shadowBlur = 0;

      // 6. Eye of Agamotto / Center stat number backdrop (Clean dark area for high contrast)
      ctx.fillStyle = "#070b13";
      ctx.beginPath(); ctx.arc(0, 0, ball.r * 0.42, 0, Math.PI * 2); ctx.fill();

      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(0, 0, ball.r * 0.42, 0, Math.PI * 2); ctx.stroke();

      const cd = Math.max(0, (ball.nextChaosAt || 0) - game.simTime);
      if (cd > 0) {
        ctx.fillStyle = "#fed7aa";
        ctx.font = "bold 8px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`${Math.ceil(cd / 1000)}s`, 0, ball.r + 14);
      }
      ctx.restore();
      drawHealthInsideBall(ball);
    };

    const drawTridentWeapon = (x, y, angle, scale = 1, alpha = 1) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.globalAlpha = alpha;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = "#facc15";
      ctx.shadowBlur = 8;
      ctx.strokeStyle = "#facc15";
      ctx.lineWidth = 4 * scale;
      ctx.beginPath();
      ctx.moveTo(-42 * scale, 0);
      ctx.lineTo(34 * scale, 0);
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.strokeStyle = "#854d0e";
      ctx.lineWidth = 1.6 * scale;
      ctx.beginPath();
      ctx.moveTo(-38 * scale, 0);
      ctx.lineTo(22 * scale, 0);
      ctx.stroke();

      ctx.strokeStyle = "#fde68a";
      ctx.lineWidth = 3 * scale;
      [-1, 0, 1].forEach((slot) => {
        ctx.beginPath();
        ctx.moveTo(24 * scale, slot * 8 * scale);
        ctx.lineTo(48 * scale, slot * 10 * scale);
        ctx.stroke();
      });
      ctx.strokeStyle = "#65a30d";
      ctx.lineWidth = 2 * scale;
      ctx.beginPath();
      ctx.moveTo(24 * scale, -10 * scale);
      ctx.quadraticCurveTo(16 * scale, 0, 24 * scale, 10 * scale);
      ctx.stroke();

      ctx.fillStyle = "#65a30d";
      ctx.beginPath();
      ctx.arc(-10 * scale, 0, 3.4 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawTridentBall = (ball) => {
      const config = BALL_TYPES.trident;
      const bal = game.balance.trident || BALANCE.trident;
      const pulse = 0.5 + Math.sin(game.simTime * 0.009) * 0.5;
      const held = ball.tridentState === "held" || !ball.tridentState;
      const target = game.balls.find((other) => other.side !== ball.side);
      const aimAngle = target ? Math.atan2(target.y - ball.y, target.x - ball.x) : (ball.tridentAngle ?? 0);
      const mountSide = ball.side === "left" ? 1 : -1;
      const mountAngle = aimAngle + mountSide * Math.PI / 2;
      const angle = held ? aimAngle : (ball.tridentAngle ?? aimAngle);
      const tx = held ? ball.x + Math.cos(mountAngle) * (ball.r + 19) : ball.tridentX;
      const ty = held ? ball.y + Math.sin(mountAngle) * (ball.r + 19) : ball.tridentY;

      if (ball.tridentDiveState && ball.tridentDiveState !== "idle") {
        const state = ball.tridentDiveState;
        const dx = ball.tridentDiveX || ball.x;
        const dy = ball.tridentDiveY || ball.y;
        const burst = state === "burst";
        const poolRadius = bal.diveBurstRadius || 58;
        const biteProgress = burst ? clamp((ball.tridentDiveUntil - game.simTime) / 420, 0, 1) : 0;
        const finBob = Math.sin(game.simTime * 0.02) * 3;
        ctx.save();
        ctx.translate(dx, dy);
        ctx.rotate(ball.tridentDiveAngle || aimAngle);
        ctx.globalAlpha = burst ? 0.92 : 0.5 + pulse * 0.2;
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = burst ? 30 : 15;
        ctx.fillStyle = burst ? "rgba(14, 165, 233, 0.38)" : "rgba(14, 165, 233, 0.24)";
        ctx.strokeStyle = burst ? "#facc15" : "#38bdf8";
        ctx.lineWidth = burst ? 4 : 3;
        ctx.beginPath();
        ctx.ellipse(0, 0, poolRadius * (burst ? 1.42 : 0.95), poolRadius * (burst ? 0.48 : 0.28), 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        if (!burst) {
          ctx.fillStyle = state === "pause" ? "#facc15" : "#65a30d";
          ctx.strokeStyle = "#fef3c7";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(12, -2 + finBob);
          ctx.lineTo(-20, -27 - pulse * 6 + finBob);
          ctx.lineTo(-10, 6 + finBob);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.globalAlpha *= 0.7;
          ctx.strokeStyle = "#e0f2fe";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-poolRadius * 0.72, 8);
          ctx.quadraticCurveTo(-poolRadius * 0.15, 15 + pulse * 4, poolRadius * 0.55, 5);
          ctx.stroke();
        } else {
          ctx.globalAlpha = 0.9;
          ctx.strokeStyle = "#f8fafc";
          ctx.lineWidth = 6;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.arc(6, 0, poolRadius * (0.62 + (1 - biteProgress) * 0.24), -0.92, 0.92);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(6, 0, poolRadius * (0.62 + (1 - biteProgress) * 0.24), -0.92, 0.92, true);
          ctx.stroke();
          ctx.fillStyle = "#fef3c7";
          for (let i = -3; i <= 3; i++) {
            const toothX = 4 + Math.abs(i) * 4;
            const toothY = i * 7;
            ctx.beginPath();
            ctx.moveTo(toothX, toothY);
            ctx.lineTo(toothX + 13 + (1 - biteProgress) * 6, toothY - 4);
            ctx.lineTo(toothX + 13 + (1 - biteProgress) * 6, toothY + 4);
            ctx.closePath();
            ctx.fill();
          }
          ctx.globalAlpha = 0.5;
          ctx.strokeStyle = "#38bdf8";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, 0, poolRadius * (1.1 + (1 - biteProgress) * 0.55), 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = "#65a30d";
          ctx.globalAlpha = 0.8;
          ctx.beginPath();
          ctx.moveTo(-poolRadius * 0.25, -poolRadius * 0.18);
          ctx.lineTo(-poolRadius * 0.52, -poolRadius * 0.56);
          ctx.lineTo(-poolRadius * 0.48, -poolRadius * 0.08);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      drawTridentWeapon(tx, ty, angle, held ? 0.82 : 0.9, ball.tridentState === "recalling" ? 0.82 : 1);

      if (ball.tridentState === "stuck") {
        ctx.save();
        ctx.globalAlpha = 0.38 + pulse * 0.22;
        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(tx, ty, 18 + pulse * 7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      ctx.save();
      ctx.translate(ball.x, ball.y);
      if (ball.tridentDiveState === "tracking" || ball.tridentDiveState === "pause") {
        ctx.globalAlpha = 0.72;
      }
      if (ball.tridentState === "thrown" || ball.tridentState === "recalling") {
        ctx.globalAlpha = 0.25;
        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, ball.r + 8 + pulse * 7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      ctx.shadowColor = "#facc15";
      ctx.shadowBlur = 12 + pulse * 6;
      ctx.beginPath();
      ctx.arc(0, 0, ball.r, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(-ball.r * 0.35, -ball.r * 0.35, 4, 0, 0, ball.r);
      grad.addColorStop(0, "#fef3c7");
      grad.addColorStop(0.45, config.color);
      grad.addColorStop(1, "#854d0e");
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = config.stroke;
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.strokeStyle = "rgba(34, 197, 94, 0.9)";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(0, 0, ball.r * 0.62, Math.PI * 0.2 + pulse * 0.2, Math.PI * 1.4 + pulse * 0.2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, ball.r * 0.36, -Math.PI * 0.25 - pulse * 0.25, Math.PI * 0.9 - pulse * 0.25);
      ctx.stroke();

      ctx.restore();
      drawHealthInsideBall(ball);
    };

    const drawFeralClawBall = (ball) => {
      const config = BALL_TYPES.feralClaw;
      const bal = game.balance.feralClaw || BALANCE.feralClaw;
      const now = game.simTime;
      const slashActive = ball.feralSlashUntil && now < ball.feralSlashUntil;
      const slashProgress = slashActive ? clamp((now - ball.feralSlashStartAt) / Math.max(1, bal.slashDuration), 0, 1) : 0;
      const windup = ball.feralPounceState === "windup";
      const rushing = ball.feralPounceState === "launch";
      const settling = ball.feralPounceState === "settle";
      const ultimateActive = now < (ball.feralUltimateUntil || 0);
      const raging = ball.health <= bal.lowHealthThreshold || ultimateActive;
      const regenerating = ball.feralRegenFlashUntil && now < ball.feralRegenFlashUntil;
      const facing = (windup || rushing || settling) ? ball.feralPounceAngle : (ball.feralSlashAngle || ball.angle || 0);

      if ((ball.feralRushTrail || []).length > 1) {
        ctx.save();
        ctx.lineCap = "round";
        [-8, 0, 8].forEach((offset, trailIndex) => {
          ctx.beginPath();
          ball.feralRushTrail.forEach((point, index) => {
            const px = point.x + Math.cos(point.angle + Math.PI / 2) * offset;
            const py = point.y + Math.sin(point.angle + Math.PI / 2) * offset;
            if (index === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          });
          ctx.globalAlpha = 0.18 + trailIndex * 0.035;
          ctx.strokeStyle = trailIndex === 1 && ultimateActive ? "#fb923c" : "#e5e7eb";
          ctx.lineWidth = 2.2;
          ctx.stroke();
        });
        ctx.restore();
      }

      let lean = 0;
      let scaleX = 1;
      let scaleY = 1;
      if (windup) {
        const windupProgress = clamp((now - ball.feralPounceStartAt) / Math.max(1, bal.pounceWindup), 0, 1);
        lean = -5 * windupProgress;
        scaleX = 0.78 + windupProgress * 0.04;
        scaleY = 1.16 - windupProgress * 0.04;
      } else if (rushing) {
        scaleX = 1.16;
        scaleY = 0.9;
        lean = 7;
      } else if (settling) {
        scaleX = 1.04;
        scaleY = 0.97;
        lean = 4;
      } else if (slashActive) {
        const attackCurve = Math.sin(slashProgress * Math.PI);
        lean = attackCurve * 9 - Math.max(0, slashProgress - 0.72) * 15;
        scaleX = 1 + attackCurve * 0.08;
        scaleY = 1 - attackCurve * 0.05;
      }

      const rageX = raging ? Math.sin(now * 0.071) * (ultimateActive ? 2.8 : 1.3) : 0;
      const rageY = raging ? Math.sin(now * 0.047 + 1.4) * (ultimateActive ? 2.2 : 1) : 0;
      const rageTurn = raging ? Math.sin(now * 0.039) * (ultimateActive ? 0.055 : 0.025) : 0;

      ctx.save();
      ctx.translate(ball.x + rageX, ball.y + rageY);
      ctx.rotate(facing + rageTurn);
      ctx.translate(lean, 0);
      ctx.scale(scaleX, scaleY);

      if (raging) {
        const irregularPulse = 0.55 + Math.sin(now * 0.019) * 0.18 + Math.sin(now * 0.043 + 1.2) * 0.16;
        ctx.save();
        ctx.globalAlpha = ultimateActive ? 0.42 : 0.22;
        ctx.strokeStyle = ultimateActive ? "#fb923c" : "#facc15";
        ctx.lineWidth = ultimateActive ? 5 : 3;
        ctx.setLineDash([8 + irregularPulse * 8, 5, 3, 7]);
        ctx.beginPath();
        ctx.arc(0, 0, ball.r + 8 + irregularPulse * 5, now * 0.002, Math.PI * 1.45 + now * 0.002);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, ball.r + 13 - irregularPulse * 3, Math.PI * 0.7 - now * 0.0017, Math.PI * 2.05 - now * 0.0017);
        ctx.stroke();
        ctx.restore();
      }

      if (regenerating) {
        ctx.shadowColor = "#86efac";
        ctx.shadowBlur = 16;
      }

      ctx.fillStyle = config.color;
      ctx.beginPath();
      ctx.arc(0, 0, ball.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = ultimateActive ? "#fb923c" : config.stroke;
      ctx.lineWidth = ultimateActive ? 5 : 4;
      ctx.stroke();

      ctx.fillStyle = "#111827";
      ctx.beginPath();
      ctx.moveTo(-ball.r * 0.92, -ball.r * 0.55);
      ctx.lineTo(-ball.r * 0.46, -ball.r * 0.92);
      ctx.lineTo(-ball.r * 0.28, -ball.r * 0.42);
      ctx.lineTo(0, -ball.r * 0.62);
      ctx.lineTo(ball.r * 0.28, -ball.r * 0.42);
      ctx.lineTo(ball.r * 0.46, -ball.r * 0.92);
      ctx.lineTo(ball.r * 0.92, -ball.r * 0.55);
      ctx.lineTo(ball.r * 0.66, ball.r * 0.48);
      ctx.lineTo(0, ball.r * 0.72);
      ctx.lineTo(-ball.r * 0.66, ball.r * 0.48);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = ultimateActive ? "#fb923c" : "#facc15";
      [-1, 1].forEach((side) => {
        ctx.beginPath();
        ctx.moveTo(side * ball.r * 0.7, -ball.r * 0.1);
        ctx.lineTo(side * ball.r * 0.16, -ball.r * 0.34);
        ctx.lineTo(side * ball.r * 0.28, ball.r * 0.08);
        ctx.lineTo(side * ball.r * 0.68, ball.r * 0.15);
        ctx.closePath();
        ctx.fill();
      });
      ctx.fillStyle = "#f8fafc";
      ctx.beginPath();
      ctx.ellipse(-ball.r * 0.4, -ball.r * 0.04, ball.r * 0.16, ball.r * 0.08, -0.2, 0, Math.PI * 2);
      ctx.ellipse(ball.r * 0.4, -ball.r * 0.04, ball.r * 0.16, ball.r * 0.08, 0.2, 0, Math.PI * 2);
      ctx.fill();

      const burst = slashActive ? Math.sin(clamp(slashProgress * 1.45, 0, 1) * Math.PI * 0.75) : 0;
      const twitch = raging ? (Math.sin(now * 0.061) + Math.sin(now * 0.027 + 2)) * ball.r * 0.07 : 0;
      const clawReach = ball.r * (0.8 + burst * 1.15 + (ultimateActive ? 0.18 : 0));
      const clawSide = slashActive ? (ball.feralSlashSide || 1) : 1;
      ctx.strokeStyle = "#e5e7eb";
      ctx.lineWidth = 3.5;
      ctx.lineCap = "round";
      ctx.shadowColor = ultimateActive ? "#fb923c" : "#f8fafc";
      ctx.shadowBlur = slashActive ? 9 : 2;
      [-0.18, 0, 0.18].forEach((spread, index) => {
        const y = clawSide * ball.r * (0.25 + spread);
        ctx.beginPath();
        ctx.moveTo(ball.r * 0.65, y);
        ctx.quadraticCurveTo(ball.r + clawReach * 0.48, y + twitch * (index - 1), ball.r + clawReach, y + spread * ball.r * 0.8);
        ctx.stroke();
      });
      ctx.restore();

      if (slashActive) {
        const trailAlpha = Math.sin(slashProgress * Math.PI) * 0.58;
        const trailCount = ultimateActive ? 5 : 2;
        ctx.save();
        ctx.strokeStyle = ultimateActive ? "#fb923c" : "#f8fafc";
        ctx.lineWidth = ultimateActive ? 3.5 : 3;
        ctx.lineCap = "round";
        for (let i = 0; i < trailCount; i++) {
          const chaos = ultimateActive ? Math.sin(now * 0.017 + i * 2.1) * 0.28 : i * 0.13;
          ctx.globalAlpha = trailAlpha * (1 - i / (trailCount + 2));
          ctx.beginPath();
          ctx.arc(ball.x, ball.y, ball.r + 23 + i * 6, facing - 0.95 + chaos, facing + 0.72 + chaos);
          ctx.stroke();
        }
        ctx.restore();
      }

      drawHealthInsideBall(ball);
    };

    const drawShadowBall = (ball) => {
      const config = BALL_TYPES.shadow;
      const bal = game.balance.shadow || BALANCE.shadow;
      const pulse = 0.5 + Math.sin(game.simTime * 0.012) * 0.5;

      (ball.shadowMinions || []).forEach((minion) => {
        const minionPulse = 0.5 + Math.sin(game.simTime * 0.018 + minion.pulseOffset) * 0.5;
        
        // Draw trail in global coords
        (minion.trail || []).forEach((pt, index) => {
          const alpha = (index + 1) / (minion.trail.length + 1) * 0.22;
          ctx.save();
          ctx.translate(pt.x, pt.y);
          ctx.beginPath(); ctx.arc(0, 0, minion.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(124, 58, 237, ${alpha})`; ctx.fill();
          ctx.restore();
        });

        ctx.save();
        ctx.translate(minion.x, minion.y);
        ctx.shadowColor = "#8b5cf6";
        ctx.shadowBlur = 8 + minionPulse * 5;
        ctx.beginPath();
        ctx.arc(0, 0, minion.r, 0, Math.PI * 2);
        ctx.fillStyle = "#020617";
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#7c3aed";
        ctx.stroke();
        ctx.fillStyle = "#c4b5fd";
        ctx.beginPath(); ctx.arc(-2.5, -1.5, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(3, -1.5, 1.5, 0, Math.PI * 2); ctx.fill();
        const hpRatio = clamp((minion.health || 0) / Math.max(1, minion.maxHealth || minion.health || 1), 0, 1);
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(15, 23, 42, 0.8)";
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(0, 0, minion.r + 3, -Math.PI / 2, Math.PI * 1.5); ctx.stroke();
        ctx.strokeStyle = "#c4b5fd";
        ctx.beginPath(); ctx.arc(0, 0, minion.r + 3, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * hpRatio); ctx.stroke();
        ctx.restore();
      });

      if (ball.shadowSlashUntil && game.simTime < ball.shadowSlashUntil) {
        const duration = ball.shadowComboSecondAt && game.simTime < ball.shadowComboSecondAt + 180 ? 330 : 240;
        const progress = clamp((ball.shadowSlashUntil - game.simTime) / duration, 0, 1);
        const comboActive = !!(ball.shadowComboSecondAt && game.simTime < ball.shadowComboSecondAt + 220);
        ctx.save();
        ctx.translate(ball.x, ball.y);
        ctx.rotate(ball.shadowSlashAngle || 0);
        ctx.globalAlpha = progress;
        ctx.shadowColor = "#c4b5fd";
        ctx.shadowBlur = comboActive ? 24 : 16;
        ctx.strokeStyle = "#e9d5ff";
        ctx.lineWidth = comboActive ? 9 : 7;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.arc(0, 0, ball.r + bal.slashRange * 0.58, comboActive ? -0.72 : -0.45, comboActive ? 0.58 : 0.45);
        ctx.stroke();
        ctx.strokeStyle = "#7c3aed";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, ball.r + bal.slashRange * 0.58, comboActive ? -0.62 : -0.36, comboActive ? 0.5 : 0.36);
        ctx.stroke();
        if (comboActive) {
          ctx.rotate(0.5);
          ctx.globalAlpha = progress * 0.72;
          ctx.strokeStyle = "#f5d0fe";
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.arc(0, 0, ball.r + bal.slashRange * 0.42, -0.52, 0.64);
          ctx.stroke();
        }
        ctx.restore();
      }

      ctx.save();
      ctx.translate(ball.x, ball.y);
      ctx.shadowColor = "#7c3aed";
      ctx.shadowBlur = 12 + pulse * 8;
      ctx.beginPath();
      ctx.arc(0, 0, ball.r, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(-ball.r * 0.35, -ball.r * 0.35, 4, 0, 0, ball.r);
      grad.addColorStop(0, "#334155");
      grad.addColorStop(0.48, config.color);
      grad.addColorStop(1, "#020617");
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = config.stroke;
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.strokeStyle = "#c4b5fd";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(0, 0, ball.r * 0.72, game.simTime * 0.005, game.simTime * 0.005 + Math.PI * 1.45);
      ctx.stroke();
      ctx.strokeStyle = "#4c1d95";
      ctx.beginPath();
      ctx.arc(0, 0, ball.r * 0.42, -game.simTime * 0.006, -game.simTime * 0.006 + Math.PI * 1.25);
      ctx.stroke();

      const daggerAngle = ball.shadowSlashAngle || (ball.side === "left" ? 0 : Math.PI);
      ctx.save();
      ctx.rotate(daggerAngle);
      ctx.strokeStyle = "#e5e7eb";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(ball.r * 0.35, -ball.r * 0.42);
      ctx.lineTo(ball.r + 18, -ball.r * 0.42);
      ctx.stroke();
      ctx.fillStyle = "#7c3aed";
      ctx.fillRect(ball.r * 0.22, -ball.r * 0.52, 10, 7);
      ctx.restore();

      ctx.fillStyle = "#c4b5fd";
      ctx.beginPath(); ctx.arc(-8, -5, 4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(8, -5, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#020617";
      ctx.beginPath(); ctx.arc(-8, -5, 2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(8, -5, 2, 0, Math.PI * 2); ctx.fill();

      ctx.restore();
      drawHealthInsideBall(ball);
    };

    const drawMirrorBody = (x, y, r, alpha, flash = false) => {
      const config = BALL_TYPES.mirror;
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = alpha;
      ctx.shadowColor = "#67e8f9";
      ctx.shadowBlur = flash ? 18 : 10;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(-r * 0.35, -r * 0.35, 4, 0, 0, r);
      grad.addColorStop(0, "#f8fafc");
      grad.addColorStop(0.42, config.color);
      grad.addColorStop(1, "#0e7490");
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = config.stroke;
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.strokeStyle = "rgba(248, 250, 252, 0.9)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-r * 0.55, -r * 0.4);
      ctx.lineTo(r * 0.5, r * 0.35);
      ctx.moveTo(r * 0.35, -r * 0.55);
      ctx.lineTo(-r * 0.42, r * 0.45);
      ctx.stroke();

      ctx.restore();
    };

    const drawMirrorBall = (ball) => {
      const bal = game.balance.mirror || BALANCE.mirror;
      const clone = {
        x: game.width - ball.x,
        y: game.height - ball.y,
        r: ball.r * (bal.cloneRadiusScale || 0.82)
      };
      const flash = ball.mirrorFlashUntil && game.simTime < ball.mirrorFlashUntil;
      const switchFlash = ball.mirrorSwitchFlashUntil && game.simTime < ball.mirrorSwitchFlashUntil;

      ctx.save();
      ctx.strokeStyle = switchFlash ? "rgba(248, 250, 252, 0.85)" : "rgba(103, 232, 249, 0.32)";
      ctx.lineWidth = switchFlash ? 4 : 2;
      ctx.setLineDash([7, 7]);
      ctx.lineDashOffset = -game.simTime * 0.04;
      ctx.beginPath();
      ctx.moveTo(ball.x, ball.y);
      ctx.lineTo(game.width / 2, game.height / 2);
      ctx.lineTo(clone.x, clone.y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(248, 250, 252, 0.75)";
      ctx.beginPath();
      ctx.arc(game.width / 2, game.height / 2, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (switchFlash) {
        const progress = clamp((ball.mirrorSwitchFlashUntil - game.simTime) / 420, 0, 1);
        ctx.save();
        ctx.globalAlpha = progress;
        ctx.strokeStyle = "#67e8f9";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r + 12 + (1 - progress) * 16, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(clone.x, clone.y, clone.r + 10 + (1 - progress) * 14, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      drawMirrorBody(clone.x, clone.y, clone.r, flash ? 0.78 : 0.52, flash);
      drawMirrorBody(ball.x, ball.y, ball.r, 1, flash);
      const cd = Math.max(0, (ball.mirrorNextSwitchAt ?? 0) - game.simTime);
      if (cd > 0) {
        ctx.save();
        ctx.fillStyle = "#e0f2fe";
        ctx.font = "bold 8px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`${Math.ceil(cd / 1000)}s`, ball.x, ball.y + ball.r + 15);
        ctx.restore();
      }
      drawHealthInsideBall(ball);
    };




    const drawGazerBall = (ball) => {
      const isFiring = ball.gazerBeamFlashUntil && game.simTime < ball.gazerBeamFlashUntil;
      const isUlt = ball.gazerUltActive;

      // Beam flash (Drawn thinner than laser)
      if (isFiring && ball.gazerBeamPath && ball.gazerBeamPath.length > 0) {
        const path = ball.gazerBeamPath;
        const flashAlpha = Math.max(0, (ball.gazerBeamFlashUntil - game.simTime) / 240);
        ctx.save();
        ctx.globalAlpha = flashAlpha;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        // Outer bloom
        ctx.strokeStyle = "rgba(220,38,38,0.16)";
        ctx.lineWidth = isUlt ? 18 : 9;
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) ctx.lineTo(path[i].x, path[i].y);
        ctx.stroke();
        // Mid
        ctx.strokeStyle = "rgba(248,113,113,0.38)";
        ctx.lineWidth = isUlt ? 10 : 6;
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) ctx.lineTo(path[i].x, path[i].y);
        ctx.stroke();
        // Core
        ctx.strokeStyle = "#fff5f5";
        ctx.lineWidth = isUlt ? 4 : 2.5;
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) ctx.lineTo(path[i].x, path[i].y);
        ctx.stroke();
        ctx.restore();
      }

      // Draw Ball Body (2D Flat Color Design inspired by Cyc-visor warrior)
      ctx.save();
      ctx.translate(ball.x, ball.y);

      // Rotate body to face the opponent
      const target = game.balls.find(o => o.side !== ball.side);
      const facingAngle = target ? Math.atan2(target.y - ball.y, target.x - ball.x) : (ball.side === "left" ? 0 : Math.PI);
      ctx.rotate(facingAngle);

      // --- Body (Deep Navy Flat Color) ---
      ctx.beginPath();
      ctx.arc(0, 0, ball.r, 0, Math.PI * 2);
      ctx.fillStyle = "#0f172a"; // Deep navy
      ctx.fill();

      // --- Gold Horizontal Band ---
      ctx.fillStyle = "#b45309"; // richer but less bright gold
      ctx.fillRect(-ball.r, -ball.r * 0.15, ball.r * 2, ball.r * 0.3);

      // --- Red Visor Slit (Only on the right side of the central dial) ---
      const visorGlowColor = isUlt ? "#f59e0b" : "#dc2626";
      const visorCoreColor = isUlt ? "#ffffff" : "#fca5a5";
      ctx.fillStyle = visorGlowColor;
      ctx.fillRect(0, -ball.r * 0.12, ball.r * 0.9, ball.r * 0.24);
      ctx.fillStyle = visorCoreColor;
      ctx.fillRect(ball.r * 0.15, -ball.r * 0.06, ball.r * 0.7, ball.r * 0.12);

      // --- Gold Visor Frame/Shade (Bordering the visor slit) ---
      ctx.strokeStyle = "#92400e"; // Darker gold for borders
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, -ball.r * 0.15);
      ctx.lineTo(ball.r * 0.9, -ball.r * 0.15);
      ctx.moveTo(0, ball.r * 0.15);
      ctx.lineTo(ball.r * 0.9, ball.r * 0.15);
      ctx.stroke();

      // --- Central Circular Dial/Lens ---
      // Outer dial circle
      ctx.beginPath();
      ctx.arc(0, 0, ball.r * 0.42, 0, Math.PI * 2);
      ctx.fillStyle = "#b45309";
      ctx.fill();
      ctx.strokeStyle = "#854d0e";
      ctx.lineWidth = 2.5;
      ctx.stroke();
      
      // Inner circle details
      ctx.beginPath();
      ctx.arc(0, 0, ball.r * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = "#92400e";
      ctx.fill();
      ctx.strokeStyle = "#b45309";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Small central emitter dot
      ctx.beginPath();
      ctx.arc(0, 0, ball.r * 0.1, 0, Math.PI * 2);
      ctx.fillStyle = visorCoreColor;
      ctx.fill();

      // --- Outer Stroke / Aura ---
      ctx.beginPath();
      ctx.arc(0, 0, ball.r, 0, Math.PI * 2);
      ctx.strokeStyle = isUlt ? "#f59e0b" : "#dc2626";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.restore();
      drawHealthInsideBall(ball);
    };



    const drawConstellationBall = (ball) => {
      const isUlt = ball.constellationUltActive;
      const shielded = ball.constellationShieldedUntil && game.simTime < ball.constellationShieldedUntil;
      const pulse = 0.5 + Math.sin(game.simTime * 0.015) * 0.5;

      ctx.save();
      ctx.translate(ball.x, ball.y);

      // 1. Ultimate cosmic aura
      if (isUlt) {
        ctx.save();
        ctx.shadowColor = "#facc15";
        ctx.shadowBlur = 18 + pulse * 10;
        ctx.strokeStyle = "rgba(250, 204, 21, 0.4)";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(0, 0, ball.r + 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 2. Invulnerability Golden Shield Bubble
      if (shielded) {
        ctx.save();
        ctx.shadowColor = "#fbbf24";
        ctx.shadowBlur = 15;
        ctx.strokeStyle = "rgba(251, 191, 36, 0.8)";
        ctx.lineWidth = 4 + pulse * 2;
        ctx.fillStyle = "rgba(251, 191, 36, 0.15)";
        ctx.beginPath();
        ctx.arc(0, 0, ball.r + 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      // 3. Ball Body (Deep space navy)
      ctx.beginPath();
      ctx.arc(0, 0, ball.r, 0, Math.PI * 2);
      ctx.fillStyle = "#1e1b4b";
      ctx.fill();

      // 4. Starlight visor / grid
      ctx.strokeStyle = isUlt ? "#facc15" : "rgba(224, 242, 254, 0.3)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-ball.r * 0.8, -ball.r * 0.2);
      ctx.lineTo(ball.r * 0.8, -ball.r * 0.2);
      ctx.moveTo(-ball.r * 0.8, ball.r * 0.2);
      ctx.lineTo(ball.r * 0.8, ball.r * 0.2);
      ctx.moveTo(-ball.r * 0.2, -ball.r * 0.8);
      ctx.lineTo(-ball.r * 0.2, ball.r * 0.8);
      ctx.moveTo(ball.r * 0.2, -ball.r * 0.8);
      ctx.lineTo(ball.r * 0.2, ball.r * 0.8);
      ctx.stroke();

      // Visor Center piece (Glowing diamond star)
      ctx.save();
      ctx.shadowColor = isUlt ? "#facc15" : "#e0f2fe";
      ctx.shadowBlur = 8 + pulse * 6;
      ctx.fillStyle = isUlt ? "#facc15" : "#e0f2fe";
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.lineTo(6, 0);
      ctx.lineTo(0, 10);
      ctx.lineTo(-6, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Faint orbiting orbits
      ctx.strokeStyle = "rgba(224, 242, 254, 0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, ball.r * 0.7, 0, Math.PI * 2);
      ctx.stroke();

      // Outer Stroke
      ctx.strokeStyle = isUlt ? "#facc15" : "#e0f2fe";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, ball.r, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
      drawHealthInsideBall(ball);
    };

    // ─── Fire Skull Ball ──────────────────────────────────────────────────────
    const drawFireSkullBall = (ball) => {
      ctx.save();
      ctx.translate(ball.x, ball.y);

      const badgeGrad = ctx.createLinearGradient(-ball.r, -ball.r, ball.r, ball.r);
      badgeGrad.addColorStop(0, "#ef4444");
      badgeGrad.addColorStop(0.55, "#f97316");
      badgeGrad.addColorStop(1, "#facc15");
      ctx.fillStyle = badgeGrad;
      ctx.beginPath();
      ctx.arc(0, 0, ball.r, 0, Math.PI * 2);
      ctx.fill();

      const redGlow = ctx.createRadialGradient(0, 0, ball.r * 0.1, 0, 0, ball.r * 0.9);
      redGlow.addColorStop(0, "#111111");
      redGlow.addColorStop(0.72, "#050505");
      redGlow.addColorStop(1, "#000000");
      ctx.fillStyle = redGlow;
      ctx.beginPath();
      ctx.arc(0, 0, ball.r * 0.9, 0, Math.PI * 2);
      ctx.fill();

      const skullScale = ball.r / 30;
      ctx.save();

      const skullGrad = ctx.createRadialGradient(-ball.r * 0.18, -ball.r * 0.18, 1, 0, 0, ball.r * 0.95);
      skullGrad.addColorStop(0, "#ffffff");
      skullGrad.addColorStop(1, "#f3f4f6");
      ctx.fillStyle = skullGrad;
      ctx.beginPath();
      ctx.moveTo(0, -18 * skullScale);
      ctx.quadraticCurveTo(-16 * skullScale, -18 * skullScale, -24 * skullScale, -4 * skullScale);
      ctx.quadraticCurveTo(-28 * skullScale, 7 * skullScale, -24 * skullScale, 16 * skullScale);
      ctx.quadraticCurveTo(-27 * skullScale, 19 * skullScale, -23 * skullScale, 24 * skullScale);
      ctx.quadraticCurveTo(-18 * skullScale, 27 * skullScale, -14 * skullScale, 23 * skullScale);
      ctx.lineTo(-17 * skullScale, 40 * skullScale);
      ctx.quadraticCurveTo(-18 * skullScale, 43 * skullScale, -14 * skullScale, 44 * skullScale);
      ctx.lineTo(-8 * skullScale, 45 * skullScale);
      ctx.quadraticCurveTo(-4 * skullScale, 45 * skullScale, -4 * skullScale, 41 * skullScale);
      ctx.lineTo(-2 * skullScale, 30 * skullScale);
      ctx.quadraticCurveTo(0, 29 * skullScale, 2 * skullScale, 30 * skullScale);
      ctx.lineTo(4 * skullScale, 41 * skullScale);
      ctx.quadraticCurveTo(4 * skullScale, 45 * skullScale, 8 * skullScale, 45 * skullScale);
      ctx.lineTo(14 * skullScale, 44 * skullScale);
      ctx.quadraticCurveTo(18 * skullScale, 43 * skullScale, 17 * skullScale, 40 * skullScale);
      ctx.lineTo(14 * skullScale, 23 * skullScale);
      ctx.quadraticCurveTo(18 * skullScale, 27 * skullScale, 23 * skullScale, 24 * skullScale);
      ctx.quadraticCurveTo(27 * skullScale, 19 * skullScale, 24 * skullScale, 16 * skullScale);
      ctx.quadraticCurveTo(28 * skullScale, 7 * skullScale, 24 * skullScale, -4 * skullScale);
      ctx.quadraticCurveTo(16 * skullScale, -18 * skullScale, 0, -18 * skullScale);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#7f0000";
      ctx.beginPath();
      ctx.ellipse(-10.5 * skullScale, 10.5 * skullScale, 8.4 * skullScale, 9.9 * skullScale, -0.49, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(10.5 * skullScale, 10.5 * skullScale, 9.9 * skullScale, 8.4 * skullScale, -0.49, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, 15 * skullScale);
      ctx.quadraticCurveTo(1 * skullScale, 15 * skullScale, 2 * skullScale, 17 * skullScale);
      ctx.lineTo(5 * skullScale, 24 * skullScale);
      ctx.quadraticCurveTo(6 * skullScale, 27 * skullScale, 3.5 * skullScale, 26 * skullScale);
      ctx.lineTo(0, 24 * skullScale);
      ctx.lineTo(-3.5 * skullScale, 26 * skullScale);
      ctx.quadraticCurveTo(-6 * skullScale, 27 * skullScale, -5 * skullScale, 24 * skullScale);
      ctx.lineTo(-2 * skullScale, 17 * skullScale);
      ctx.quadraticCurveTo(-1 * skullScale, 15 * skullScale, 0, 15 * skullScale);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      ctx.restore();
      drawHealthInsideBall(ball);
    };

    // ─── Fire Road (drawn before balls, world-space) ──────────────────────────
    const drawFireRoads = () => {
      game.balls.forEach(ball => {
        if (ball.type !== "fireSkull" || !ball.fsRoadActive) return;
        const segs = ball.fsRoadSegments;
        if (!segs || segs.length < 2) return;

        ctx.save();

        // Thick outer glow road
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        const fsBal = game.balance.fireSkull || BALANCE.fireSkull;
        const roadW = fsBal.roadWidth || 28;
        const time = game.simTime;
        const startPoint = ball.fsRoadStartWallPoint || segs[0];

        // Animated dashed lava road — multiple layers
        for (let layer = 0; layer < 3; layer++) {
          const widths  = [roadW * 1.4, roadW, roadW * 0.48];
          const colors  = ["rgba(239,68,68,0.22)", "rgba(249,115,22,0.38)", "rgba(253,186,116,0.75)"];
          const blurs   = [18, 10, 5];
          const dashes  = [layer === 2 ? [] : [14, 10], [14, 10], []];
          const offsets = [0, -time * 0.08, 0];

          ctx.save();
          ctx.shadowColor = layer === 0 ? "#ef4444" : "#f97316";
          ctx.shadowBlur = blurs[layer];
          ctx.globalAlpha = 1;
          ctx.strokeStyle = colors[layer];
          ctx.lineWidth = widths[layer];
          if (dashes[layer].length) {
            ctx.setLineDash(dashes[layer]);
            ctx.lineDashOffset = offsets[layer];
          } else {
            ctx.setLineDash([]);
          }
          ctx.beginPath();
          ctx.moveTo(startPoint.x, startPoint.y);
          for (let i = 1; i < segs.length; i++) ctx.lineTo(segs[i].x, segs[i].y);
          ctx.lineTo(ball.x, ball.y);
          ctx.stroke();
          ctx.restore();
        }

        // Start point flare
        ctx.save();
        ctx.shadowColor = "#fbbf24";
        ctx.shadowBlur = 20;
        ctx.fillStyle = "#fef3c7";
        ctx.beginPath();
        ctx.arc(startPoint.x, startPoint.y, 7 + Math.sin(time * 0.02) * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.restore();
      });
    };

    // ─── Fire Car entity rendering ────────────────────────────────────────────
    const drawFireCarEntities = () => {
      if (!game.fireCars || game.fireCars.length === 0) return;
      const time = game.simTime;
      const pulse = 0.5 + Math.sin(time * 0.025) * 0.5;

      game.fireCars.forEach(car => {
        const visualPath = car.renderPath || car.path;
        if (visualPath?.length > 1) {
          ctx.save();
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.strokeStyle = "rgba(251, 191, 36, 0.38)";
          ctx.lineWidth = (game.balance.fireSkull?.roadWidth || BALANCE.fireSkull.roadWidth) * 0.8;
          ctx.beginPath();
          ctx.moveTo(visualPath[0].x, visualPath[0].y);
          for (let i = 1; i < visualPath.length; i++) ctx.lineTo(visualPath[i].x, visualPath[i].y);
          ctx.stroke();
          ctx.restore();
        }

        const dx = car.endX - car.startX;
        const dy = car.endY - car.startY;
        const dist = Math.hypot(dx, dy);
        if (dist <= 0) return;
        const angle = car.angle ?? Math.atan2(dy, dx);
        const carVisualScale = (game.balance.fireSkull?.carHitboxScale) || BALANCE.fireSkull.carHitboxScale || 1.32;
        const hw = car.radius * 1.72 * carVisualScale;
        const hh = car.radius * 0.62 * Math.max(1.08, carVisualScale * 0.95);
        const carBody = "#111315";
        const carBodyShade = "#23272d";
        const carWindow = "#3b4550";
        const carTrim = "#f97316";
        const carTrimBright = "#fbbf24";
        const carWheel = "#1f242b";

        ctx.save();
        ctx.translate(car.x, car.y);
        ctx.rotate(angle);

        // Road heat trail behind
        ctx.save();
        ctx.globalAlpha = 0.22;
        ctx.strokeStyle = "rgba(251,191,36,0.38)";
        ctx.lineWidth = car.radius * 1.05 * carVisualScale;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(-(car.radius * 3.5 * carVisualScale), 0);
        ctx.lineTo(0, 0);
        ctx.stroke();
        ctx.restore();

        // Long top-down muscle-car body.
        ctx.save();
        ctx.shadowColor = "rgba(249, 115, 22, 0.22)";
        ctx.shadowBlur = 10 + pulse * 4;
        const glossGrad = ctx.createLinearGradient(-hw, -hh, hw, hh);
        glossGrad.addColorStop(0, "#070707");
        glossGrad.addColorStop(0.45, "#1a1a1a");
        glossGrad.addColorStop(1, "#000000");
        ctx.fillStyle = glossGrad;
        ctx.beginPath();
        ctx.moveTo(-hw * 1.08, -hh * 0.58);
        ctx.lineTo(-hw * 0.94, -hh * 0.88);
        ctx.lineTo(hw * 0.68, -hh * 0.96);
        ctx.lineTo(hw * 0.98, -hh * 0.78);
        ctx.lineTo(hw * 1.13, -hh * 0.45);
        ctx.lineTo(hw * 1.13, hh * 0.45);
        ctx.lineTo(hw * 0.98, hh * 0.78);
        ctx.lineTo(hw * 0.68, hh * 0.96);
        ctx.lineTo(-hw * 0.94, hh * 0.88);
        ctx.lineTo(-hw * 1.08, hh * 0.58);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "rgba(251, 191, 36, 0.55)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Four wheels sit outside the body so the silhouette reads as a car.
        ctx.fillStyle = carWheel;
        [[-0.68, -1], [0.68, -1], [-0.68, 1], [0.68, 1]].forEach(([x, side]) => {
          ctx.beginPath();
          ctx.roundRect(hw * x - hw * 0.15, side * hh * 0.91 - hh * 0.16, hw * 0.3, hh * 0.32, 4);
          ctx.fill();
        });

        // Rear deck, cabin, windshield, and long hood.
        ctx.fillStyle = carBodyShade;
        ctx.beginPath();
        ctx.moveTo(-hw * 0.96, -hh * 0.68);
        ctx.lineTo(-hw * 0.43, -hh * 0.72);
        ctx.lineTo(-hw * 0.35, hh * 0.72);
        ctx.lineTo(-hw * 0.96, hh * 0.68);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#24272b";
        ctx.beginPath();
        ctx.moveTo(-hw * 0.39, -hh * 0.73);
        ctx.lineTo(hw * 0.34, -hh * 0.76);
        ctx.lineTo(hw * 0.48, -hh * 0.55);
        ctx.lineTo(hw * 0.43, hh * 0.55);
        ctx.lineTo(hw * 0.29, hh * 0.76);
        ctx.lineTo(-hw * 0.39, hh * 0.73);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = carWindow;
        ctx.beginPath();
        ctx.moveTo(-hw * 0.31, -hh * 0.58);
        ctx.lineTo(-hw * 0.11, -hh * 0.62);
        ctx.lineTo(-hw * 0.11, hh * 0.62);
        ctx.lineTo(-hw * 0.31, hh * 0.58);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(hw * 0.04, -hh * 0.62);
        ctx.lineTo(hw * 0.31, -hh * 0.55);
        ctx.lineTo(hw * 0.39, hh * 0.55);
        ctx.lineTo(hw * 0.04, hh * 0.62);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#0b0c0e";
        ctx.strokeStyle = "#30343a";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(hw * 0.47, -hh * 0.68);
        ctx.lineTo(hw * 1.02, -hh * 0.56);
        ctx.lineTo(hw * 1.07, hh * 0.56);
        ctx.lineTo(hw * 0.47, hh * 0.68);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        const stripeGrad = ctx.createLinearGradient(0, -hh * 1.1, 0, hh * 1.4);
        stripeGrad.addColorStop(0, "#ff5a45");
        stripeGrad.addColorStop(0.55, "#f22214");
        stripeGrad.addColorStop(1, "#b90c05");
        ctx.fillStyle = stripeGrad;
        ctx.fillRect(-hw * 1.02, -hh * 0.18, hw * 2.05, hh * 0.13);
        ctx.fillRect(-hw * 1.02, hh * 0.05, hw * 2.05, hh * 0.13);

        // Hood scoop and vents.
        ctx.fillStyle = "#050505";
        ctx.beginPath();
        ctx.moveTo(hw * 0.65, -hh * 0.19);
        ctx.lineTo(hw * 0.92, -hh * 0.14);
        ctx.lineTo(hw * 0.92, hh * 0.14);
        ctx.lineTo(hw * 0.65, hh * 0.19);
        ctx.closePath();
        ctx.fill();
        [-1, 1].forEach((side) => {
          ctx.strokeStyle = "#34383d";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(hw * 0.62, side * hh * 0.45);
          ctx.lineTo(hw * 0.91, side * hh * 0.38);
          ctx.stroke();
        });

        // Mirrors, headlights, and tail lights.
        ctx.fillStyle = "#090a0c";
        ctx.beginPath();
        ctx.ellipse(hw * 0.12, -hh * 1.02, hw * 0.08, hh * 0.09, 0, 0, Math.PI * 2);
        ctx.ellipse(hw * 0.12, hh * 1.02, hw * 0.08, hh * 0.09, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fbbf24";
        ctx.globalAlpha = 0.82;
        ctx.fillRect(hw * 1.01, -hh * 0.54, hw * 0.08, hh * 0.22);
        ctx.fillRect(hw * 1.01, hh * 0.32, hw * 0.08, hh * 0.22);
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(-hw * 1.05, -hh * 0.52, hw * 0.06, hh * 0.2);
        ctx.fillRect(-hw * 1.05, hh * 0.32, hw * 0.06, hh * 0.2);
        ctx.globalAlpha = 1;

        ctx.strokeStyle = "rgba(255,255,255,0.14)";
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(-hw * 0.92, -hh * 0.69);
        ctx.quadraticCurveTo(0, -hh * 0.84, hw * 0.91, -hh * 0.67);
        ctx.stroke();
        ctx.strokeStyle = "rgba(255,255,255,0.08)";
        ctx.beginPath();
        ctx.moveTo(-hw * 0.78, hh * 0.7);
        ctx.quadraticCurveTo(hw * 0.15, hh * 0.83, hw * 0.9, hh * 0.63);
        ctx.stroke();

        ctx.restore();

        // Flame exhaust jets (2 trails out the back)
        [-hh * 0.55, hh * 0.55].forEach(offY => {
          for (let j = 0; j < 3; j++) {
            const flameLen = (20 + j * 14) * (0.7 + pulse * 0.5);
            ctx.save();
            ctx.globalAlpha = (0.52 - j * 0.16) * (0.8 + Math.random() * 0.18);
            ctx.strokeStyle = j === 0 ? "#fff3a3" : j === 1 ? "#fbbf24" : "#f59e0b";
            ctx.lineWidth = 4.5 - j;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(-hw, offY);
            ctx.lineTo(-hw - flameLen, offY + (Math.random() - 0.5) * 10);
            ctx.stroke();
            ctx.restore();
          }
        });

        ctx.restore();
      });
    };

    const drawConstellationStars = () => {
      if (!game.constellationStars) return;

      const pulse = 0.5 + Math.sin(game.simTime * 0.015) * 0.5;

      const groups = {};
      game.constellationStars.forEach(s => {
        groups[s.ownerId] = groups[s.ownerId] || [];
        groups[s.ownerId].push(s);
      });

      Object.keys(groups).forEach(ownerId => {
        const stars = groups[ownerId];
        stars.sort((a, b) => a.createdAt - b.createdAt);
        const previewStars = stars.slice(-5);

        if (previewStars.length >= 2) {
          ctx.save();
          ctx.strokeStyle = "rgba(224, 242, 254, 0.35)";
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);

          if (previewStars.length === 2) {
            ctx.beginPath();
            ctx.moveTo(previewStars[0].x, previewStars[0].y);
            ctx.lineTo(previewStars[1].x, previewStars[1].y);
            ctx.stroke();
          } else if (previewStars.length >= 3) {
            const cx = previewStars.reduce((sum, s) => sum + s.x, 0) / previewStars.length;
            const cy = previewStars.reduce((sum, s) => sum + s.y, 0) / previewStars.length;
            const sorted = [...previewStars].sort((a, b) => Math.atan2(a.y - cy, a.x - cx) - Math.atan2(b.y - cy, b.x - cx));
            ctx.beginPath();
            ctx.moveTo(sorted[0].x, sorted[0].y);
            for (let i = 1; i < sorted.length; i++) ctx.lineTo(sorted[i].x, sorted[i].y);
            ctx.closePath();
            ctx.stroke();
          }
          ctx.restore();
        }
      });

      game.constellationStars.forEach(s => {
        ctx.save();
        ctx.shadowColor = "#facc15";
        ctx.shadowBlur = 8 + pulse * 6;
        ctx.fillStyle = "#facc15";

        ctx.beginPath();
        ctx.moveTo(s.x, s.y - 7);
        ctx.lineTo(s.x + 3, s.y - 2);
        ctx.lineTo(s.x + 7, s.y);
        ctx.lineTo(s.x + 3, s.y + 2);
        ctx.lineTo(s.x, s.y + 7);
        ctx.lineTo(s.x - 3, s.y + 2);
        ctx.lineTo(s.x - 7, s.y);
        ctx.lineTo(s.x - 3, s.y - 2);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });
    };

    const drawActiveConstellations = () => {
      if (!game.activeConstellations) return;
      const pulse = 0.5 + Math.sin(game.simTime * 0.02) * 0.5;
      const bal = game.balance.constellation || BALANCE.constellation;

      game.activeConstellations.forEach(c => {
        const elapsed = game.simTime - c.spawnTime;
        const remaining = c.duration - elapsed;
        const alpha = clamp(remaining / 500, 0, 1);

        ctx.save();
        ctx.globalAlpha = alpha;

        if (c.type === "triangle") {
          const p1 = c.stars[0], p2 = c.stars[1], p3 = c.stars[2];

          ctx.fillStyle = "rgba(250, 204, 21, 0.08)";
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.closePath();
          ctx.fill();

          ctx.save();
          ctx.shadowColor = "#facc15";
          ctx.shadowBlur = 12 + pulse * 4;
          ctx.strokeStyle = "rgba(250, 204, 21, 0.85)";
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.closePath();
          ctx.stroke();
          ctx.restore();
        } else if (c.type === "square") {
          const p1 = c.stars[0], p2 = c.stars[1], p3 = c.stars[2], p4 = c.stars[3];
          const cx = (p1.x + p2.x + p3.x + p4.x) / 4;
          const cy = (p1.y + p2.y + p3.y + p4.y) / 4;
          const q = [p1, p2, p3, p4].sort((a, b) => Math.atan2(a.y - cy, a.x - cx) - Math.atan2(b.y - cy, b.x - cx));

          ctx.fillStyle = "rgba(192, 132, 252, 0.06)";
          ctx.beginPath();
          ctx.moveTo(q[0].x, q[0].y);
          for (let i = 1; i < 4; i++) ctx.lineTo(q[i].x, q[i].y);
          ctx.closePath();
          ctx.fill();

          ctx.save();
          ctx.shadowColor = "#c084fc";
          ctx.shadowBlur = 14 + pulse * 6;
          ctx.strokeStyle = "rgba(192, 132, 252, 0.85)";
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(q[0].x, q[0].y);
          for (let i = 1; i < 4; i++) ctx.lineTo(q[i].x, q[i].y);
          ctx.closePath();
          ctx.stroke();
          ctx.restore();

          ctx.strokeStyle = "rgba(192, 132, 252, 0.12)";
          ctx.lineWidth = 1.5;
          ctx.save();
          ctx.clip();
          ctx.beginPath();
          for (let gx = -160; gx <= 160; gx += 20) {
            ctx.moveTo(cx + gx, cy - 200);
            ctx.lineTo(cx + gx, cy + 200);
          }
          ctx.stroke();
          ctx.restore();
        } else if (c.type === "pentagon") {
          const cx = c.stars.reduce((sum, p) => sum + p.x, 0) / c.stars.length;
          const cy = c.stars.reduce((sum, p) => sum + p.y, 0) / c.stars.length;
          const q = [...c.stars].sort((a, b) => Math.atan2(a.y - cy, a.x - cx) - Math.atan2(b.y - cy, b.x - cx));

          ctx.fillStyle = "rgba(251, 191, 36, 0.08)";
          ctx.beginPath();
          ctx.moveTo(q[0].x, q[0].y);
          for (let i = 1; i < q.length; i++) ctx.lineTo(q[i].x, q[i].y);
          ctx.closePath();
          ctx.fill();

          ctx.save();
          ctx.shadowColor = "#f59e0b";
          ctx.shadowBlur = 12 + pulse * 5;
          ctx.strokeStyle = "rgba(251, 191, 36, 0.8)";
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.moveTo(q[0].x, q[0].y);
          for (let i = 1; i < q.length; i++) ctx.lineTo(q[i].x, q[i].y);
          ctx.closePath();
          ctx.stroke();
          ctx.restore();

          ctx.strokeStyle = "rgba(255, 243, 163, 0.35)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          for (const p of q) {
            ctx.moveTo(cx, cy);
            ctx.lineTo(p.x, p.y);
          }
          ctx.stroke();
        }

        ctx.restore();
      });
    };

    const drawJokerBall = (ball) => {
      const config = BALL_TYPES.joker;
      const pulse = 0.5 + Math.sin(game.simTime * 0.014) * 0.5;
      const flash = ball.jokerFlashUntil && game.simTime < ball.jokerFlashUntil;
      ctx.save();
      ctx.translate(ball.x, ball.y);
      if (flash) {
        ctx.globalAlpha = 0.32 + pulse * 0.18;
        ctx.strokeStyle = "#f9a8d4";
        ctx.lineWidth = 5;
        ctx.shadowColor = "#fb7185";
        ctx.shadowBlur = 18;
        ctx.beginPath(); ctx.arc(0, 0, ball.r + 9 + pulse * 6, 0, Math.PI * 2); ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // 1. Solid rose body background
      ctx.fillStyle = "#fb7185";
      ctx.beginPath(); ctx.arc(0, 0, ball.r, 0, Math.PI * 2); ctx.fill();

      // Outer gold border stroke
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#f9a8d4";
      ctx.beginPath(); ctx.arc(0, 0, ball.r, 0, Math.PI * 2); ctx.stroke();

      // 2. Inner light rose disc
      ctx.fillStyle = "#ffe4e6";
      ctx.beginPath(); ctx.arc(0, 0, ball.r * 0.78, 0, Math.PI * 2); ctx.fill();

      // 3. Draw clean concentric target rings to represent the hunter/angler theme
      ctx.strokeStyle = "#be123c";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, ball.r * 0.58, 0, Math.PI * 2);
      ctx.stroke();

      // 4. Center clean dark backdrop for the large HP stat number
      ctx.fillStyle = "#4c0519";
      ctx.beginPath(); ctx.arc(0, 0, ball.r * 0.38, 0, Math.PI * 2); ctx.fill();

      ctx.strokeStyle = "#f9a8d4";
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(0, 0, ball.r * 0.38, 0, Math.PI * 2); ctx.stroke();

      // 5. Draw reel meter progress ring around Joker Ball if pulling
      const activeThread = game.jokerThreads && game.jokerThreads.find(t => t.ownerId === ball.id && t.state === "pulling");
      if (activeThread) {
        const totalNodes = activeThread.points.length;
        const remainingNodes = activeThread.pullIndex + 1;
        const progress = remainingNodes / Math.max(1, totalNodes);
        
        ctx.save();
        ctx.strokeStyle = "rgba(217, 70, 239, 0.25)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, ball.r + 6, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.strokeStyle = "#d946ef";
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.arc(0, 0, ball.r + 6, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
        ctx.stroke();
        ctx.restore();
      }

      const cd = Math.max(0, (ball.jokerNextThreadAt || 0) - game.simTime);
      if (cd > 0) {
        ctx.fillStyle = "#ffe4e6";
        ctx.font = "bold 8px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`${Math.ceil(cd / 1000)}s`, 0, ball.r + 14);
      }
      ctx.restore();
      drawHealthInsideBall(ball);
    };

    const drawJokerThreads = () => {
      if (!game.jokerThreads) return;
      game.jokerThreads.forEach((thread) => {
        const owner = game.balls.find((ball) => ball.id === thread.ownerId);
        const anchor = owner ? {
          x: owner.x + Math.cos(thread.anchorAngle || 0) * (thread.anchorRadius || owner.r + 8),
          y: owner.y + Math.sin(thread.anchorAngle || 0) * (thread.anchorRadius || owner.r + 8)
        } : null;
        if (!anchor) return;

        // Dotted trajectory preview
        if (thread.state === "flying") {
          ctx.save();
          ctx.strokeStyle = "rgba(249, 168, 212, 0.45)";
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 6]);
          
          let tx = thread.x, ty = thread.y;
          let tvx = thread.vx, tvy = thread.vy;
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          
          for (let b = 0; b < 2; b++) {
            const pad = 18 + (thread.r || 9);
            let tMin = Infinity;
            let sideHit = "";
            
            if (tvx < 0) {
              const t = (pad - tx) / tvx;
              if (t > 0 && t < tMin) { tMin = t; sideHit = "left"; }
            } else if (tvx > 0) {
              const t = (game.width - pad - tx) / tvx;
              if (t > 0 && t < tMin) { tMin = t; sideHit = "right"; }
            }
            
            if (tvy < 0) {
              const t = (pad - ty) / tvy;
              if (t > 0 && t < tMin) { tMin = t; sideHit = "top"; }
            } else if (tvy > 0) {
              const t = (game.height - pad - ty) / tvy;
              if (t > 0 && t < tMin) { tMin = t; sideHit = "bottom"; }
            }
            
            if (tMin !== Infinity) {
              tx += tvx * tMin;
              ty += tvy * tMin;
              ctx.lineTo(tx, ty);
              if (sideHit === "left" || sideHit === "right") tvx = -tvx;
              if (sideHit === "top" || sideHit === "bottom") tvy = -tvy;
            }
          }
          ctx.stroke();
          ctx.restore();
        }

        // Draw faint glowing original path guide line when pulling
        if (thread.state === "pulling") {
          ctx.save();
          ctx.strokeStyle = "rgba(249, 168, 212, 0.25)";
          ctx.lineWidth = 3;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          const fullPoints = [anchor, ...(thread.points || [])];
          ctx.moveTo(fullPoints[0].x, fullPoints[0].y);
          for (let i = 1; i < fullPoints.length; i++) {
            ctx.lineTo(fullPoints[i].x, fullPoints[i].y);
          }
          ctx.stroke();
          ctx.restore();
        }

        // Construct active remaining segments
        const points = [anchor];
        if (thread.state === "pulling") {
          for (let i = 0; i <= thread.pullIndex; i++) {
            if (thread.points[i]) points.push(thread.points[i]);
          }
        } else {
          points.push(...(thread.points || []));
        }
        points.push({ x: thread.x, y: thread.y });

        ctx.save();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        
        const isTense = thread.state === "pulling";
        const threadColor = isTense ? "rgba(225, 29, 72, 0.95)" : "rgba(249, 168, 212, 0.85)";
        const glowColor = isTense ? "#e11d48" : "#f9a8d4";
        const threadWidth = isTense ? 8 : 6;

        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 14;
        ctx.strokeStyle = threadColor;
        ctx.lineWidth = threadWidth;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(15, 23, 42, 0.7)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
        ctx.stroke();

        // Draw the tip as a glowing pink gum blob
        ctx.save();
        ctx.translate(thread.x, thread.y);
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 12;
        ctx.fillStyle = isTense ? "#e11d48" : "#d946ef";
        ctx.beginPath();
        ctx.arc(0, 0, thread.r || 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        ctx.restore();
      });
    };

    const drawBall = (ball, currentTime) => {
      if (ball.shattered) return;
      if (ball.type === "knife") drawKnifeBall(ball);
      else if (ball.type === "wrecker") drawWreckerBall(ball);
      else if (ball.type === "gun") drawGunBall(ball, currentTime);
      else if (ball.type === "vampire") {
        const target = game.balls.find((o) => o.id === ball.latchedTo) || game.balls.find((o) => o.side !== ball.side);
        drawVampireBall(ball, currentTime, target);
      }
      else if (ball.type === "laser") {
        const target = game.balls.find((o) => o.side !== ball.side);
        drawLaserBall(ball, target);
      }
      else if (ball.type === "shield") drawShieldBall(ball);
      else if (ball.type === "spider") drawSpiderBall(ball);
      else if (ball.type === "bomber") drawBomberBall(ball);
      else if (ball.type === "spore") drawSporeBall(ball);
      else if (ball.type === "hammer") drawHammerBall(ball);
      else if (ball.type === "stringWeb") drawStringWebBall(ball);
      else if (ball.type === "arm") drawArmBall(ball);
      else if (ball.type === "chess") drawChessBall(ball);
      else if (ball.type === "dragon") drawDragonBall(ball);
      else if (ball.type === "psychicer") drawPsychicerBall(ball);
      else if (ball.type === "chaos") drawChaosBall(ball);
      else if (ball.type === "trident") drawTridentBall(ball);
      else if (ball.type === "shadow") drawShadowBall(ball);
      else if (ball.type === "feralClaw") drawFeralClawBall(ball);
      else if (ball.type === "mirror") drawMirrorBall(ball);

      else if (ball.type === "joker") drawJokerBall(ball);
      else if (ball.type === "blackSpider") drawBlackSpiderBall(ball);
      else if (ball.type === "gazerBall") drawGazerBall(ball);
      else if (ball.type === "constellation") drawConstellationBall(ball);
      else if (ball.type === "fireSkull") drawFireSkullBall(ball);

      if (ball.chaosDraggedUntil && game.simTime < ball.chaosDraggedUntil) {
        const progress = (ball.chaosDraggedUntil - game.simTime) / 360;
        ctx.save();
        ctx.globalAlpha = Math.max(0, progress * 0.72);
        ctx.strokeStyle = ball.chaosControlAxis === "vertical" ? "#38bdf8" : "#fdba74";
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 6]);
        ctx.lineDashOffset = -game.simTime * 0.06;
        ctx.beginPath();
        ctx.moveTo(ball.x, ball.y);
        ctx.lineTo(ball.chaosDragX || ball.x, ball.chaosDragY || ball.y);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r + 7 + (1 - progress) * 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      if (ball.webHitFlashUntil && game.simTime < ball.webHitFlashUntil) {
        const progress = (ball.webHitFlashUntil - game.simTime) / 180;
        ctx.save();
        ctx.globalAlpha = Math.max(0, progress);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;
        ctx.shadowColor = ball.webHitFlashColor || BALL_TYPES[ball.type]?.color || "#ef4444";
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r + 8 + (1 - progress) * 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      if (ball.shadowMarkedUntil && game.simTime < ball.shadowMarkedUntil) {
        const progress = clamp((ball.shadowMarkedUntil - game.simTime) / 1400, 0, 1);
        ctx.save();
        ctx.globalAlpha = 0.35 + progress * 0.35;
        ctx.strokeStyle = "#a78bfa";
        ctx.lineWidth = 3;
        ctx.shadowColor = "#7c3aed";
        ctx.shadowBlur = 12;
        ctx.setLineDash([6, 6]);
        ctx.lineDashOffset = -game.simTime * 0.05;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r + 12 + Math.sin(game.simTime * 0.018) * 3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }

      if (ball.paralyzedUntil && game.simTime < ball.paralyzedUntil) {
        const progress = clamp((ball.paralyzedUntil - game.simTime) / 1200, 0, 1);
        ctx.save();
        ctx.globalAlpha = 0.55 + progress * 0.3;
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2.5;
        ctx.shadowColor = "#67e8f9";
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r + 9 + Math.sin(game.simTime * 0.02) * 3, 0, Math.PI * 2);
        ctx.stroke();
        for (let i = 0; i < 5; i++) {
          const angle = game.simTime * 0.012 + i * Math.PI * 0.4;
          const inner = ball.r + 3;
          const outer = ball.r + 16 + (i % 2) * 4;
          const mid = (inner + outer) / 2;
          ctx.beginPath();
          ctx.moveTo(ball.x + Math.cos(angle) * inner, ball.y + Math.sin(angle) * inner);
          ctx.lineTo(ball.x + Math.cos(angle + 0.13) * mid, ball.y + Math.sin(angle + 0.13) * mid);
          ctx.lineTo(ball.x + Math.cos(angle - 0.08) * outer, ball.y + Math.sin(angle - 0.08) * outer);
          ctx.stroke();
        }
        ctx.fillStyle = "#67e8f9";
        ctx.font = "bold 9px sans-serif";
        ctx.textAlign = "center";
        ctx.shadowBlur = 8;
        ctx.fillText("ELECTRIFIED", ball.x, ball.y - ball.r - 14);
        ctx.restore();
      }

      // Draw Attachment Resistance aura (shimmering silver honeycomb grid)
      if (ball.attachmentResistanceUntil && game.simTime < ball.attachmentResistanceUntil) {
        const progress = clamp((ball.attachmentResistanceUntil - game.simTime) / 1750, 0, 1);
        ctx.save();
        ctx.globalAlpha = 0.28 + progress * 0.42;
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 3;
        ctx.shadowColor = "#f1f5f9";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r + 9, 0, Math.PI * 2);
        ctx.stroke();

        ctx.lineWidth = 1.2;
        for (let i = 0; i < 6; i++) {
          const angle = game.simTime * 0.005 + (i * Math.PI) / 3;
          ctx.beginPath();
          ctx.moveTo(ball.x + Math.cos(angle) * ball.r, ball.y + Math.sin(angle) * ball.r);
          ctx.lineTo(ball.x + Math.cos(angle) * (ball.r + 14), ball.y + Math.sin(angle) * (ball.r + 14));
          ctx.stroke();
          
          const nextAngle = game.simTime * 0.005 + ((i + 1) * Math.PI) / 3;
          ctx.beginPath();
          ctx.moveTo(ball.x + Math.cos(angle) * (ball.r + 14), ball.y + Math.sin(angle) * (ball.r + 14));
          ctx.lineTo(ball.x + Math.cos(nextAngle) * (ball.r + 14), ball.y + Math.sin(nextAngle) * (ball.r + 14));
          ctx.stroke();
        }
        ctx.restore();
      }

      if (ball.type === "blackSpider") {
        // Legacy drawing disabled. String Pull Slam handles its own drawing in drawBlackSpiderBall.
      }
    };

    const drawBallTrail = (ball) => {
      if (!ball.trail || ball.trail.length < 2) return;
      const config = BALL_TYPES[ball.type] || { color: "#cbd5e1", stroke: "#94a3b8" };
      ctx.save();
      if (ball.type === "chaos") {
        for (let i = 0; i < ball.trail.length; i++) {
          const pt = ball.trail[i];
          const progress = i / ball.trail.length;
          
          // Outer light orange mystical trail
          ctx.shadowColor = "#f97316";
          ctx.shadowBlur = 10 * progress;
          ctx.globalAlpha = progress * 0.28;
          ctx.fillStyle = "#fdba74";
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, ball.r * (0.35 + 0.65 * progress), 0, Math.PI * 2);
          ctx.fill();

          // Inner glowing yellow magic trail
          ctx.shadowColor = "#facc15";
          ctx.shadowBlur = 6 * progress;
          ctx.globalAlpha = progress * 0.38;
          ctx.fillStyle = "#fef08a";
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, ball.r * (0.18 + 0.42 * progress), 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // Draw continuous connecting path line
        ctx.beginPath();
        ctx.moveTo(ball.trail[0].x, ball.trail[0].y);
        for (let i = 1; i < ball.trail.length; i++) {
          ctx.lineTo(ball.trail[i].x, ball.trail[i].y);
        }
        ctx.strokeStyle = config.color;
        ctx.lineWidth = ball.r * 1.35;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.globalAlpha = 0.08;
        ctx.stroke();

        // Draw overlapping glowing circles
        for (let i = 0; i < ball.trail.length; i++) {
          const pt = ball.trail[i];
          const progress = i / ball.trail.length;
          ctx.shadowColor = config.stroke || config.color;
          ctx.shadowBlur = 7 * progress;
          ctx.globalAlpha = progress * 0.18;
          ctx.fillStyle = config.color;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, ball.r * (0.35 + 0.65 * progress), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    };

    const drawBullets = () => {
      game.bullets.forEach((bullet) => {
        ctx.save();
        if (bullet.kind === "laserPulse") {
          ctx.shadowColor = "#facc15";
          ctx.shadowBlur = 16;
          const pulse = 0.75 + Math.sin(game.simTime * 0.018) * 0.25;
          ctx.beginPath(); ctx.arc(bullet.x, bullet.y, bullet.r + 5 * pulse, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(250, 204, 21, 0.2)"; ctx.fill();
          ctx.beginPath(); ctx.arc(bullet.x, bullet.y, bullet.r, 0, Math.PI * 2);
          ctx.fillStyle = "#facc15"; ctx.fill();
          ctx.strokeStyle = "#38bdf8"; ctx.lineWidth = 2.5; ctx.stroke();
        } else if (bullet.kind === "dragonFireball") {
          ctx.shadowColor = "#f97316";
          ctx.shadowBlur = 18;
          const pulse = 0.8 + Math.sin(game.simTime * 0.02) * 0.2;
          const speedAngle = Math.atan2(bullet.vy, bullet.vx);
          const tailLength = 26 + pulse * 10;
          const tailWidth = bullet.r * (1.4 + pulse * 0.2);
          const tailGrad = ctx.createLinearGradient(
            bullet.x - Math.cos(speedAngle) * tailLength,
            bullet.y - Math.sin(speedAngle) * tailLength,
            bullet.x,
            bullet.y
          );
          tailGrad.addColorStop(0, "rgba(220, 38, 38, 0)");
          tailGrad.addColorStop(0.45, "rgba(249, 115, 22, 0.35)");
          tailGrad.addColorStop(1, "rgba(254, 240, 138, 0.75)");
          ctx.fillStyle = tailGrad;
          ctx.beginPath();
          ctx.moveTo(bullet.x + Math.cos(speedAngle) * bullet.r, bullet.y + Math.sin(speedAngle) * bullet.r);
          ctx.lineTo(
            bullet.x - Math.cos(speedAngle) * tailLength - Math.sin(speedAngle) * tailWidth,
            bullet.y - Math.sin(speedAngle) * tailLength + Math.cos(speedAngle) * tailWidth
          );
          ctx.lineTo(
            bullet.x - Math.cos(speedAngle) * tailLength + Math.sin(speedAngle) * tailWidth,
            bullet.y - Math.sin(speedAngle) * tailLength - Math.cos(speedAngle) * tailWidth
          );
          ctx.closePath();
          ctx.fill();
          ctx.beginPath(); ctx.arc(bullet.x, bullet.y, bullet.r + 7 * pulse, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(249, 115, 22, 0.24)"; ctx.fill();
          ctx.beginPath(); ctx.arc(bullet.x, bullet.y, bullet.r, 0, Math.PI * 2);
          const coreGrad = ctx.createRadialGradient(bullet.x - bullet.r * 0.35, bullet.y - bullet.r * 0.35, 1, bullet.x, bullet.y, bullet.r);
          coreGrad.addColorStop(0, "#fff7ed");
          coreGrad.addColorStop(0.35, "#facc15");
          coreGrad.addColorStop(1, "#f97316");
          ctx.fillStyle = coreGrad; ctx.fill();
          ctx.strokeStyle = "#fef3c7"; ctx.lineWidth = 2.5; ctx.stroke();
        } else if (bullet.kind === "dragonEmber") {
          ctx.shadowColor = "#ef4444";
          ctx.shadowBlur = 8;
          ctx.beginPath(); ctx.arc(bullet.x, bullet.y, bullet.r + 2 * Math.abs(Math.sin(game.simTime * 0.03)), 0, Math.PI * 2);
          ctx.fillStyle = "rgba(239, 68, 68, 0.3)"; ctx.fill();
          ctx.beginPath(); ctx.arc(bullet.x, bullet.y, bullet.r, 0, Math.PI * 2);
          ctx.fillStyle = "#fb923c"; ctx.fill();
        } else {
          ctx.beginPath(); ctx.arc(bullet.x, bullet.y, bullet.r, 0, Math.PI * 2);
          ctx.fillStyle = bullet.piercesDefense ? "#67e8f9" : "#facc15"; ctx.fill();
          if (bullet.piercesDefense) {
            ctx.strokeStyle = "#f8fafc";
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }
        ctx.restore();
      });
    };

    const drawMines = () => {
      game.mines.forEach((mine) => {
        ctx.save();
        if (mine.isHoming) {
          ctx.shadowColor = "#38bdf8"; ctx.shadowBlur = 8;
          ctx.strokeStyle = "#1e3a8a"; ctx.lineWidth = 2.5; ctx.fillStyle = "#1e293b";
          ctx.beginPath(); ctx.arc(mine.x, mine.y, mine.r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

          ctx.fillStyle = "#38bdf8";
          ctx.beginPath(); ctx.arc(mine.x, mine.y, mine.r - 2, 0, Math.PI / 2); ctx.lineTo(mine.x, mine.y); ctx.fill();
          ctx.beginPath(); ctx.arc(mine.x, mine.y, mine.r - 2, Math.PI, Math.PI * 1.5); ctx.lineTo(mine.x, mine.y); ctx.fill();

          const rate = mine.isAboutToDetonate ? 0.05 : 0.015;
          const pulse = Math.abs(Math.sin(game.simTime * rate));
          ctx.fillStyle = `rgba(59, 130, 246, ${0.4 + 0.6 * pulse})`;
          ctx.beginPath(); ctx.arc(mine.x, mine.y, 4, 0, Math.PI * 2); ctx.fill();

          ctx.strokeStyle = `rgba(56, 189, 248, 0.12)`; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(mine.x, mine.y, mine.triggerRadius, 0, Math.PI * 2); ctx.stroke();
        } else {
          ctx.shadowColor = "#f59e0b"; ctx.shadowBlur = 6;
          ctx.strokeStyle = "#78350f"; ctx.lineWidth = 2.5; ctx.fillStyle = "#1e293b";
          ctx.beginPath(); ctx.arc(mine.x, mine.y, mine.r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

          ctx.fillStyle = "#facc15";
          ctx.beginPath(); ctx.arc(mine.x, mine.y, mine.r - 2, 0, Math.PI / 2); ctx.lineTo(mine.x, mine.y); ctx.fill();
          ctx.beginPath(); ctx.arc(mine.x, mine.y, mine.r - 2, Math.PI, Math.PI * 1.5); ctx.lineTo(mine.x, mine.y); ctx.fill();

          const rate = mine.isAboutToDetonate ? 0.05 : 0.015;
          const pulse = Math.abs(Math.sin(game.simTime * rate));
          ctx.fillStyle = `rgba(239, 68, 68, ${0.4 + 0.6 * pulse})`;
          ctx.beginPath(); ctx.arc(mine.x, mine.y, 4, 0, Math.PI * 2); ctx.fill();

          ctx.strokeStyle = `rgba(245, 158, 11, 0.12)`; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(mine.x, mine.y, mine.triggerRadius, 0, Math.PI * 2); ctx.stroke();
        }
        ctx.restore();
      });
    };

    const drawExplosions = () => {
      game.explosions.forEach((exp) => {
        ctx.save(); const progress = 1 - (exp.life / exp.duration);
        ctx.strokeStyle = `rgba(249, 115, 22, ${1 - progress})`; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(exp.x, exp.y, exp.r, 0, Math.PI * 2); ctx.stroke();
        const grad = ctx.createRadialGradient(exp.x, exp.y, 0, exp.x, exp.y, exp.r);
        grad.addColorStop(0, `rgba(254, 240, 138, ${0.8 * (1 - progress)})`);
        grad.addColorStop(0.5, `rgba(249, 115, 22, ${0.5 * (1 - progress)})`);
        grad.addColorStop(1, "rgba(239, 68, 68, 0)");
        ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(exp.x, exp.y, exp.r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      });
    };

    const drawParticles = () => {
      if (!game.particles.length) return;
      ctx.save();
      game.particles.forEach((p) => {
        if (p.alpha <= 0.02) return;
        ctx.globalAlpha = p.alpha;
        if (p.isCross) {
          ctx.strokeStyle = p.color; ctx.lineWidth = 2; ctx.beginPath();
          ctx.moveTo(p.x - 4, p.y); ctx.lineTo(p.x + 4, p.y);
          ctx.moveTo(p.x, p.y - 4); ctx.lineTo(p.x, p.y + 4); ctx.stroke();
        } else if (p.isShard) {
          p.angle = (p.angle || 0) + (p.spin || 0) * 0.016;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle || 0);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.radius, -p.radius * 0.55, p.radius * 2.1, p.radius * 1.1);
          ctx.restore();
        } else {
          ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill();
        }
      });
      ctx.restore();
    };

    const updateFloatingTexts = (dt) => {
      game.floatingTexts = (game.floatingTexts || []).filter((ft) => {
        ft.y += ft.vy * dt;
        ft.life -= dt;
        return ft.life > 0;
      });
      if (game.floatingTexts.length > MAX_FLOATING_TEXTS) {
        game.floatingTexts.splice(0, game.floatingTexts.length - MAX_FLOATING_TEXTS);
      }
    };

    const drawFloatingTexts = () => {
      if (!game.floatingTexts) return;
      game.floatingTexts.forEach((ft) => {
        ctx.save();
        const alpha = Math.max(0, ft.life / ft.maxLife);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = ft.color;
        ctx.font = "bold 15px sans-serif";
        ctx.textAlign = "center";
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 4;
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      });
    };

    const updateCacti = (dt) => {
      game.cacti = (game.cacti || []).filter((cactus) => {
        cactus.life -= dt * 1000;
        if (cactus.life <= 0 || cactus.charges <= 0) return false;

        const growthProgress = Math.min(1.0, (game.simTime - cactus.createdTime) / cactus.growthDuration);
        cactus.r = cactus.targetR * growthProgress;

        game.balls.forEach((ball) => {
          const d = Math.hypot(ball.x - cactus.x, ball.y - cactus.y);
          const minD = ball.r + cactus.r;
          if (d > 0 && d < minD) {
            const nx = (ball.x - cactus.x) / d;
            const ny = (ball.y - cactus.y) / d;
            const overlap = minD - d;
            ball.x += nx * overlap;
            ball.y += ny * overlap;

            const dpNorm = ball.vx * nx + ball.vy * ny;
            if (dpNorm < 0) {
              const tx = -ny, ty = nx;
              const dpTan = ball.vx * tx + ball.vy * ty;
              ball.vx = tx * dpTan - nx * dpNorm;
              ball.vy = ty * dpTan - ny * dpNorm;
            }

            if (ball.side === cactus.ownerSide) {
              ball.vx *= game.balance.spore.speedBoost;
              ball.vy *= game.balance.spore.speedBoost;
              if (ball.type === "spore") {
                ball.hydraGlowStacks = Math.min(HYDRA_MAX_GLOW_STACKS, (ball.hydraGlowStacks || 0) + HYDRA_RAGE_PER_BOUNCE);
                game.floatingTexts = game.floatingTexts || [];
                game.floatingTexts.push({
                  x: ball.x, y: ball.y - ball.r - 18, vy: -45,
                  text: `RAGE x${ball.hydraGlowStacks}`, color: "#fb7185", life: 0.7, maxLife: 0.7
                });
              }
              spawnSparks(ball.x, ball.y, "#2dd4bf", 10);
            } else {
              applyDamage(ball, game.balance.spore.cactusDamage, `${ball.id}-cactus-${cactus.createdTime}`, game.simTime, 500);
              spawnSparks(ball.x, ball.y, "#f43f5e", 8);
            }
            cactus.charges--;
          }
        });
        return true;
      });
    };

    const updateStrings = (dt) => {
      if (!game.strings) return;
      const pendingStrings = [];
      game.strings = game.strings.filter((str) => {
        str.life -= dt * 1000;
        if (str.life <= 0) return false;
        game.balls.forEach((ball) => {
          const dist = linePointDist(ball.x, ball.y, str.x1, str.y1, str.x2, str.y2);
          const stringBal = game.balance.stringWeb || BALANCE.stringWeb;
          if (ball.side === str.ownerSide) {
            if (ball.type !== "stringWeb" || dist >= ball.r + (stringBal.stringHitPadding || 0) || game.simTime < (ball.nextStringTrampolineAt || 0)) return;
            const A = ball.x - str.x1, B = ball.y - str.y1, C = str.x2 - str.x1, D = str.y2 - str.y1;
            const dot = A * C + B * D, lenSq = C * C + D * D;
            const param = lenSq ? clamp(dot / lenSq, 0, 1) : 0;
            const xx = str.x1 + param * C, yy = str.y1 + param * D;
            const speed = Math.hypot(ball.vx, ball.vy);
            const nextSpeed = Math.max(stringBal.trampolineMinSpeed || 300, speed * (stringBal.trampolineBoost || 1.4));
            const bounce = getStringBounceVelocity(ball, str, xx, yy, nextSpeed, game.simTime + str.createdTime);
            ball.vx = bounce.vx;
            ball.vy = bounce.vy;
            if (ball.lastBounceX !== undefined && ball.lastBounceX !== null) {
              const newString = {
                x1: ball.lastBounceX,
                y1: ball.lastBounceY,
                x2: xx,
                y2: yy,
                ownerSide: ball.side,
                createdTime: game.simTime,
                life: stringBal.stringLifetime
              };
              pendingStrings.push(newString);
            }
            ball.lastBounceX = xx;
            ball.lastBounceY = yy;
            ball.nextStringTrampolineAt = game.simTime + (stringBal.trampolineCooldown || 1100);
            ball.stringBounceWallBouncesLeft = 2;
            ball.webHitFlashUntil = game.simTime + 160;
            ball.webHitFlashColor = "#d946ef";
            game.screenShake = Math.max(game.screenShake, 5);
            spawnSparks(xx, yy, "#f0abfc", 12);
            game.floatingTexts = game.floatingTexts || [];
            game.floatingTexts.push({
              x: ball.x, y: ball.y - ball.r - 18, vy: -55,
              text: "STRING BOUNCE", color: "#f0abfc", life: 0.7, maxLife: 0.7
            });
            playSound("stringTwang", 0.8, 140);
            return;
          }
          if (dist < ball.r + (stringBal.stringHitPadding || 0)) {
            if (!str.insideIds) str.insideIds = {};
            if (str.insideIds[ball.id]) return;
            str.insideIds[ball.id] = true;
            applyDamage(ball, game.balance.stringWeb.stringDamage, `${ball.id}-string-${str.createdTime}`, game.simTime, 9999999);
            
            const A = ball.x - str.x1, B = ball.y - str.y1, C = str.x2 - str.x1, D = str.y2 - str.y1;
            const dot = A * C + B * D, lenSq = C * C + D * D;
            let param = -1;
            if (lenSq !== 0) param = dot / lenSq;
            let xx, yy;
            if (param < 0) { xx = str.x1; yy = str.y1; }
            else if (param > 1) { xx = str.x2; yy = str.y2; }
            else { xx = str.x1 + param * C; yy = str.y1 + param * D; }
            
            ball.spinAngle = (ball.spinAngle || 0) + 0.6;
            ball.webHitFlashUntil = game.simTime + 180;
            game.screenShake = Math.max(game.screenShake, 7);
            spawnSparks(xx, yy, "#d946ef", 16);
            game.floatingTexts = game.floatingTexts || [];
            game.floatingTexts.push({
              x: ball.x, y: ball.y - ball.r - 18, vy: -55,
              text: "WEB HIT", color: "#f0abfc", life: 0.75, maxLife: 0.75
            });
            playSound("webHit", 0.7, 100);
          } else if (str.insideIds) {
            delete str.insideIds[ball.id];
          }
        });

        return true;
      });
      if (pendingStrings.length) {
        game.strings.push(...pendingStrings);
        const stringBal = game.balance.stringWeb || BALANCE.stringWeb;
        const maxStrings = stringBal.maxStrings || 10;
        const sides = [...new Set(pendingStrings.map((str) => str.ownerSide))];
        sides.forEach((side) => {
          let ownerStrings = game.strings.filter((str) => str.ownerSide === side).sort((a, b) => a.createdTime - b.createdTime);
          while (ownerStrings.length > maxStrings) {
            const oldest = ownerStrings.shift();
            game.strings = game.strings.filter((str) => str !== oldest);
          }
        });
      }
    };

    const updatePsychicCircles = (dt) => {
      if (!game.psychicCircles) return;
      const bal = game.balance.psychicer || BALANCE.psychicer;
      const removePsychicCircle = (circle) => {
        const circleId = `${circle.ownerId}-${circle.createdTime}`;
        game.balls.forEach((ball) => {
          if (ball.psychicTrapCircleId === circleId) {
            ball.psychicTrapCircleId = null;
            ball.psychicTrappedUntil = 0;
          }
          if (ball.id === circle.ownerId) {
            const ownerBal = game.balance.psychicer || BALANCE.psychicer;
            ball.nextPsychicAt = game.simTime + (ownerBal.cooldown || 5600);
          }
        });
      };
      game.psychicCircles = game.psychicCircles.filter((circle) => {
        circle.life -= dt * 1000;
        if (circle.life <= 0) {
          removePsychicCircle(circle);
          return false;
        }

        game.balls.forEach((ball) => {
          if (ball.side === circle.ownerSide) return;
          const d = Math.hypot(ball.x - circle.x, ball.y - circle.y);
          const captureRadius = circle.r + ball.r * 0.55;
          const isCapturedHere = ball.psychicTrapCircleId === `${circle.ownerId}-${circle.createdTime}`;
          const inside = d <= captureRadius || isCapturedHere;
          if (!inside) {
            return;
          }

          if (!circle.hitsByBall) circle.hitsByBall = {};
          if (!circle.damageByBall) circle.damageByBall = {};

          const hitCount = circle.hitsByBall[ball.id] || 0;
          const damageDone = circle.damageByBall[ball.id] || 0;
          const maxHits = Math.min(5, bal.maxBounceHits || 5);
          if (!isCapturedHere && hitCount < maxHits && damageDone < 5) {
            ball.psychicTrapCircleId = `${circle.ownerId}-${circle.createdTime}`;
            ball.psychicTrappedUntil = Math.max(ball.psychicTrappedUntil || 0, game.simTime + 900);
            ball.vx *= 0.62;
            ball.vy *= 0.62;
            ball.psychicFieldUntil = game.simTime + 220;
            game.floatingTexts = game.floatingTexts || [];
            game.floatingTexts.push({
              x: ball.x, y: ball.y - ball.r - 18, vy: -48,
              text: "PSY TRAP", color: "#f0abfc", life: 0.65, maxLife: 0.65
            });
          }

          if (hitCount >= maxHits || damageDone >= 5) {
            if (isCapturedHere) {
              ball.psychicTrapCircleId = null;
              ball.psychicTrappedUntil = 0;
            }
            return;
          }

          const dx = ball.x - circle.x;
          const dy = ball.y - circle.y;
          const dist = Math.max(0.001, Math.hypot(dx, dy));
          const nx = dx / dist;
          const ny = dy / dist;
          const trapRadius = Math.max(ball.r + 8, circle.r - ball.r * 0.45);
          const pull = 18 * dt;
          ball.vx += ((circle.x - ball.x) / Math.max(1, circle.r)) * pull;
          ball.vy += ((circle.y - ball.y) / Math.max(1, circle.r)) * pull;
          ball.psychicTrappedUntil = Math.max(ball.psychicTrappedUntil || 0, game.simTime + 180);
          ball.psychicFieldUntil = game.simTime + 180;

          if (dist >= trapRadius) {
            ball.x = circle.x + nx * trapRadius;
            ball.y = circle.y + ny * trapRadius;
            const velocityOut = ball.vx * nx + ball.vy * ny;
            const tx = -ny;
            const ty = nx;
            const tangent = ball.vx * tx + ball.vy * ty;
            const nextInward = Math.max(190, Math.abs(velocityOut) * 0.92);
            const swirl = (hitCount % 2 === 0 ? 1 : -1) * 95;
            ball.vx = -nx * nextInward + tx * (tangent * 0.55 + swirl);
            ball.vy = -ny * nextInward + ty * (tangent * 0.55 + swirl);

            const remainingDamageCap = Math.max(0, 5 - damageDone);
            const damage = Math.min(bal.circleDamage || 1, remainingDamageCap);
            if (damage > 0) {
              applyDamage(ball, damage, `${circle.ownerId}-psychic-${circle.createdTime}-${ball.id}-${hitCount}`, game.simTime, 0);
              const ownerStats = circle.ownerSide === "left" ? game.stats.left : game.stats.right;
              ownerStats.damageDealt += damage;
              ownerStats.hitsLanded++;
              ball.psychicFieldUntil = game.simTime + 260;
              game.screenShake = Math.max(game.screenShake, 5);
              spawnSparks(ball.x, ball.y, "#d8b4fe", 12);
              game.floatingTexts = game.floatingTexts || [];
              game.floatingTexts.push({
                x: ball.x, y: ball.y - ball.r - 18, vy: -50,
                text: `PSY -${damage}`, color: "#f0abfc", life: 0.65, maxLife: 0.65
              });
            }
            circle.hitsByBall[ball.id] = hitCount + 1;
            circle.damageByBall[ball.id] = damageDone + damage;
            circle.flashUntil = game.simTime + 220;
            if (circle.hitsByBall[ball.id] >= maxHits || circle.damageByBall[ball.id] >= 5) {
              ball.psychicTrapCircleId = null;
              ball.psychicTrappedUntil = 0;
              circle.consumed = true;
            }
          }
        });

        if (circle.consumed) {
          removePsychicCircle(circle);
          return false;
        }
        return true;
      });
    };

    const updateChaosCircles = (dt) => {
      const bal = game.balance.chaos || BALANCE.chaos;
      game.balls.forEach((ball) => {
        if (!ball.chaosControlledUntil || game.simTime >= ball.chaosControlledUntil || ball.chaosSlamDone) return;
        cancelActiveMovementStates(ball);
        const speed = bal.launchSpeed || 620;
        if (game.simTime < (ball.chaosControlHoldUntil || 0)) {
          ball.vx = 0;
          ball.vy = 0;
          ball.chaosDraggedUntil = game.simTime + 180;
          return;
        }

        const dx = (ball.chaosDragX || ball.x) - ball.x;
        const dy = (ball.chaosDragY || ball.y) - ball.y;
        const dist = Math.max(1, Math.hypot(dx, dy));
        const nx = dx / dist;
        const ny = dy / dist;
        const wobble = Math.sin(game.simTime * 0.025 + (ball.id.length || 1)) * (bal.radiusBounce || 140);
        const tx = -ny;
        const ty = nx;
        ball.vx = nx * speed + tx * wobble;
        ball.vy = ny * speed + ty * wobble;
        ball.chaosDraggedUntil = game.simTime + 200;
      });

      if (!game.chaosCircles) return;
      game.chaosCircles = game.chaosCircles.filter((circle) => {
        circle.life -= dt * 1000;
        if (circle.life <= 0) return false;

        game.balls.forEach((ball) => {
          if (ball.side === circle.ownerSide) return;
          if (circle.consumed) return;
          const d = Math.hypot(ball.x - circle.x, ball.y - circle.y);
          if (d > circle.r + ball.r * 0.25) return;
          if (ball.chaosControlledUntil && game.simTime < ball.chaosControlledUntil) return;
          if (!circle.triggeredAtByBall) circle.triggeredAtByBall = {};
          if (game.simTime < (circle.triggeredAtByBall[ball.id] || 0)) return;

          const pad = 18 + ball.r;
          if (circle.axis === "vertical") {
            const topDistance = ball.y - pad;
            const bottomDistance = game.height - pad - ball.y;
            const dir = bottomDistance >= topDistance ? 1 : -1;
            ball.vx = 0;
            ball.vy = 0;
            ball.chaosDragX = ball.x;
            ball.chaosDragY = dir > 0 ? game.height - pad : pad;
          } else {
            const leftDistance = ball.x - pad;
            const rightDistance = game.width - pad - ball.x;
            const dir = rightDistance >= leftDistance ? 1 : -1;
            ball.vx = 0;
            ball.vy = 0;
            ball.chaosDragX = dir > 0 ? game.width - pad : pad;
            ball.chaosDragY = ball.y;
          }

          circle.triggeredAtByBall[ball.id] = game.simTime + (bal.triggerCooldown || 1000);
          circle.flashUntil = game.simTime + 300;
          cancelActiveMovementStates(ball);
          ball.chaosControlAxis = circle.axis;
          ball.chaosControllerId = circle.ownerId;
          ball.chaosControllerSide = circle.ownerSide;
          ball.chaosSlamDone = false;
          ball.chaosControlHoldUntil = game.simTime + (bal.controlHold || 220);
          ball.chaosControlledUntil = game.simTime + (bal.controlHold || 220) + (bal.controlDuration || 1200);
          ball.chaosDraggedUntil = game.simTime + 360;
          ball.webHitFlashUntil = game.simTime + 160;
          ball.webHitFlashColor = "#fef08a";
          ball.spinAngle = (ball.spinAngle || 0) + 0.85;
          circle.consumed = true;
          game.screenShake = Math.max(game.screenShake, 8);
          spawnSparks(ball.x, ball.y, "#fde047", 14);
          game.floatingTexts = game.floatingTexts || [];
          game.floatingTexts.push({
            x: ball.x, y: ball.y - ball.r - 18, vy: -55,
            text: "WARP MAGIC",
            color: "#fde047", life: 0.7, maxLife: 0.7
          });
          playSound("shieldBlock", 0.75, circle.axis === "vertical" ? 180 : -160);
        });

        return !circle.consumed;
      });
    };



    const drawCacti = () => {
      if (!game.cacti) return;
      game.cacti.forEach((cactus) => {
        ctx.save();
        ctx.translate(cactus.x, cactus.y);

        const progress = Math.min(1.0, (game.simTime - cactus.createdTime) / cactus.growthDuration);
        const alpha = Math.max(0, cactus.life / 1000);
        ctx.globalAlpha = Math.min(progress, alpha > 1 ? 1 : alpha);

        const r = cactus.r;

        // Base/body color: black hydra body with hot rage outline
        ctx.fillStyle = "#020617";
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 3.5;

        // Draw 3 wiggling hydra necks/heads
        const headsCount = 3;
        for (let i = 0; i < headsCount; i++) {
          const angleOffset = -Math.PI / 2 + (i - 1) * (Math.PI / 4);
          const wiggleAngle = Math.sin(game.simTime * 0.008 + i * 2) * 0.25;
          const currentAngle = angleOffset + wiggleAngle;

          const neckLength = r * 1.3;
          const endX = Math.cos(currentAngle) * neckLength;
          const endY = Math.sin(currentAngle) * neckLength;

          // Draw neck
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(
            Math.cos(currentAngle + 0.1) * neckLength * 0.5,
            Math.sin(currentAngle + 0.1) * neckLength * 0.5,
            endX, endY
          );
          ctx.stroke();

          // Draw head circle
          ctx.save();
          ctx.translate(endX, endY);
          ctx.fillStyle = "#111827";
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.45, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Draw eyes on the hydra head
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(-r * 0.15, -r * 0.05, r * 0.12, 0, Math.PI * 2);
          ctx.arc(r * 0.15, -r * 0.05, r * 0.12, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#020617";
          ctx.beginPath();
          ctx.arc(-r * 0.15, -r * 0.05, r * 0.06, 0, Math.PI * 2);
          ctx.arc(r * 0.15, -r * 0.05, r * 0.06, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Draw central body bulb
        ctx.fillStyle = "#020617";
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.9, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Draw red octopus symbol in the center of the hydra body
        ctx.save();
        const symR = r * 0.7;
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(0, -symR * 0.1, symR * 0.4, Math.PI, 0);
        ctx.bezierCurveTo(symR * 0.4, symR * 0.2, symR * 0.2, symR * 0.35, 0, symR * 0.35);
        ctx.bezierCurveTo(-symR * 0.2, symR * 0.35, -symR * 0.4, symR * 0.2, -symR * 0.4, -symR * 0.1);
        ctx.fill();

        // mini octopus eyes
        ctx.fillStyle = "#020617";
        ctx.beginPath();
        ctx.arc(-symR * 0.12, -symR * 0.1, symR * 0.08, 0, Math.PI * 2);
        ctx.arc(symR * 0.12, -symR * 0.1, symR * 0.08, 0, Math.PI * 2);
        ctx.fill();

        // mini tentacles
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = symR * 0.12;
        ctx.lineCap = "round";
        for (let j = 0; j < 4; j++) {
          const tentacleAngle = Math.PI * 0.2 + (j / 3) * Math.PI * 0.6;
          const tWiggle = Math.sin(game.simTime * 0.015 + j * 1.5) * 1.5;
          ctx.beginPath();
          ctx.moveTo(Math.cos(tentacleAngle) * symR * 0.25, Math.sin(tentacleAngle) * symR * 0.25 + symR * 0.1);
          ctx.quadraticCurveTo(
            Math.cos(tentacleAngle) * symR * 0.5 + tWiggle, Math.sin(tentacleAngle) * symR * 0.5 + symR * 0.2,
            Math.cos(tentacleAngle) * symR * 0.7 + tWiggle * 1.5, Math.sin(tentacleAngle) * symR * 0.7 + symR * 0.25
          );
          ctx.stroke();
        }
        ctx.restore();

        ctx.restore();
      });
    };

    const drawSporeBall = (ball) => {
      const config = BALL_TYPES.spore;
      ctx.save(); ctx.translate(ball.x, ball.y);
      if ((ball.hydraGlowStacks || 0) > 0) {
        const stacks = ball.hydraGlowStacks || 0;
        const pulse = Math.sin(game.simTime * 0.012) * 3;
        ctx.save();
        ctx.shadowColor = "#fb7185";
        ctx.shadowBlur = 18 + stacks * 2;
        ctx.strokeStyle = "rgba(251, 113, 133, 0.9)";
        ctx.lineWidth = Math.min(10, 3 + stacks);
        ctx.beginPath();
        ctx.arc(0, 0, ball.r + 6 + pulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      ctx.beginPath(); ctx.arc(0, 0, ball.r, 0, Math.PI * 2);
      ctx.fillStyle = config.color; ctx.fill();
      ctx.lineWidth = 4; ctx.strokeStyle = config.stroke; ctx.stroke();

      // Draw Octopus symbol inside Hydra Ball
      ctx.save();
      // Octopus body/head in center
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(0, -2, 7, Math.PI, 0); // top dome of head
      ctx.bezierCurveTo(7, 3, 5, 4.5, 0, 4.5); // bottom of head
      ctx.bezierCurveTo(-5, 4.5, -7, 3, -7, -2);
      ctx.fill();
      
      // Eyes
      ctx.fillStyle = "#020617";
      ctx.beginPath();
      ctx.arc(-2.5, -1.5, 1.5, 0, Math.PI * 2);
      ctx.arc(2.5, -1.5, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fecaca";
      ctx.beginPath();
      ctx.arc(-2, -2, 0.6, 0, Math.PI * 2);
      ctx.arc(3, -2, 0.6, 0, Math.PI * 2);
      ctx.fill();

      // Tentacles wiggling at the bottom of the shell
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      const wigglesCount = 4;
      for (let i = 0; i < wigglesCount; i++) {
        const angle = Math.PI * 0.15 + (i / (wigglesCount - 1)) * Math.PI * 0.7;
        const wiggle = Math.sin(game.simTime * 0.01 + i * 2) * 2;
        
        ctx.beginPath();
        const startX = Math.cos(angle) * 5;
        const startY = 3.5;
        ctx.moveTo(startX, startY);
        const endX = Math.cos(angle) * 16 + wiggle;
        const endY = Math.sin(angle) * 14 + 5;
        ctx.quadraticCurveTo(
          Math.cos(angle) * 10 + wiggle * 0.5, Math.sin(angle) * 9 + 4,
          endX, endY
        );
        ctx.stroke();
      }
      ctx.restore();

      ctx.restore();
      if ((ball.hydraGlowStacks || 0) > 0) {
        ctx.fillStyle = "#fff1f2";
        ctx.strokeStyle = "#7f1d1d";
        ctx.lineWidth = 3;
        ctx.font = "bold 13px ui-sans-serif, system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const label = `x${ball.hydraGlowStacks}`;
        ctx.strokeText(label, 0, -ball.r - 13);
        ctx.fillText(label, 0, -ball.r - 13);
      }
      drawHealthInsideBall(ball);
    };

    const drawStrings = () => {
      if (!game.strings) return;
      game.strings.forEach((str) => {
        ctx.save();

        ctx.strokeStyle = str.ownerSide === "left" ? "rgba(192, 132, 252, 0.24)" : "rgba(232, 121, 249, 0.24)";
        ctx.lineWidth = 12;
        ctx.shadowColor = str.ownerSide === "left" ? "#a855f7" : "#d946ef";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(str.x1, str.y1);
        ctx.lineTo(str.x2, str.y2);
        ctx.stroke();

        ctx.strokeStyle = str.ownerSide === "left" ? "#c084fc" : "#e879f9";
        ctx.lineWidth = 4;
        ctx.shadowBlur = 8;

        ctx.beginPath();
        ctx.moveTo(str.x1, str.y1);
        ctx.lineTo(str.x2, str.y2);
        ctx.stroke();

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.2;
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.moveTo(str.x1, str.y1);
        ctx.lineTo(str.x2, str.y2);
        ctx.stroke();

        const drawEndpoint = (x, y) => {
          ctx.save();
          ctx.shadowBlur = 0;
          ctx.fillStyle = str.ownerSide === "left" ? "#581c87" : "#86198f";
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(x, y, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.arc(x, y, 3.5, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(x - 11, y);
          ctx.lineTo(x - 5, y);
          ctx.moveTo(x + 5, y);
          ctx.lineTo(x + 11, y);
          ctx.moveTo(x, y - 11);
          ctx.lineTo(x, y - 5);
          ctx.moveTo(x, y + 5);
          ctx.lineTo(x, y + 11);
          ctx.stroke();
          ctx.restore();
        };
        drawEndpoint(str.x1, str.y1);
        drawEndpoint(str.x2, str.y2);

        ctx.restore();
      });
    };

    const drawVenomPools = () => {
      if (!game.venomPools) return;
      game.venomPools.forEach((pool) => {
        if (pool.isSymbiote) {
          ctx.save();
          // Draw dark pulsing slime pool
          const pulse = 0.9 + Math.sin(game.simTime * 0.008 + pool.createdTime * 0.01) * 0.1;
          const age = game.simTime - pool.createdTime;
          const lifeRatio = 1 - age / pool.duration;
          const alpha = Math.max(0, Math.min(0.85, lifeRatio * 1.5));
          
          // Radial gradient for symbiote slime
          const grad = ctx.createRadialGradient(pool.x, pool.y, 2, pool.x, pool.y, pool.r * pulse);
          grad.addColorStop(0, `rgba(15, 23, 42, ${alpha * 0.95})`);     // slate-900
          grad.addColorStop(0.5, `rgba(2, 6, 23, ${alpha * 0.85})`);      // slate-950
          grad.addColorStop(0.85, `rgba(74, 4, 78, ${alpha * 0.45})`);   // dark purple/fuchsia border
          grad.addColorStop(1, `rgba(0, 0, 0, 0)`);
          
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(pool.x, pool.y, pool.r * pulse, 0, Math.PI * 2);
          ctx.fill();
          
          // Draw a few dark wiggling web threads inside
          ctx.strokeStyle = `rgba(241, 245, 249, ${alpha * 0.35})`; // white-ish webs
          ctx.lineWidth = 1.2;
          const numSpokes = 8;
          for (let i = 0; i < numSpokes; i++) {
            const angle = (i * Math.PI * 2) / numSpokes + Math.sin(game.simTime * 0.01 + i) * 0.1;
            ctx.beginPath();
            ctx.moveTo(pool.x, pool.y);
            const midX = pool.x + Math.cos(angle) * pool.r * 0.5 + Math.sin(game.simTime * 0.03) * 3;
            const midY = pool.y + Math.sin(angle) * pool.r * 0.5 + Math.cos(game.simTime * 0.03) * 3;
            ctx.quadraticCurveTo(midX, midY, pool.x + Math.cos(angle) * pool.r * pulse, pool.y + Math.sin(angle) * pool.r * pulse);
            ctx.stroke();
          }
          ctx.restore();
        } else {
          ctx.save();
          ctx.strokeStyle = "rgba(209, 213, 219, 0.4)"; // light gray/silver color for spider web
          ctx.lineWidth = 1.5;
          
          // 1. Draw radial spokes
          const numSpokes = 8;
          for (let i = 0; i < numSpokes; i++) {
            const angle = (i * Math.PI * 2) / numSpokes;
            ctx.beginPath();
            ctx.moveTo(pool.x, pool.y);
            ctx.lineTo(pool.x + Math.cos(angle) * pool.r, pool.y + Math.sin(angle) * pool.r);
            ctx.stroke();
          }
          
          // 2. Draw concentric rings
          const numRings = 3;
          for (let r = 1; r <= numRings; r++) {
            const ringRad = (pool.r * r) / numRings;
            ctx.beginPath();
            ctx.arc(pool.x, pool.y, ringRad, 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.restore();
        }
      });
    };

    // Draw Tendril Traps – dark symbiote goo puddles left by Black Spider
    const drawVenomTraps = () => {
      if (!game.venomTraps) return;
      game.venomTraps.forEach((trap) => {
        if (trap.triggered) return;
        const age = game.simTime - trap.createdTime;
        const lifeRatio = 1 - age / trap.duration;
        const alpha = Math.min(0.85, lifeRatio * 1.1);
        const pulse = 0.85 + Math.sin(game.simTime * 0.009 + trap.createdTime * 0.01) * 0.12;

        ctx.save();
        // Outer glow
        const grad = ctx.createRadialGradient(trap.x, trap.y, 2, trap.x, trap.y, trap.r);
        grad.addColorStop(0, `rgba(15, 23, 42, ${alpha * 0.9})`);
        grad.addColorStop(0.55, `rgba(2, 6, 23, ${alpha * 0.65})`);
        grad.addColorStop(1, `rgba(0, 0, 0, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(trap.x, trap.y, trap.r * pulse, trap.r * 0.55 * pulse, 0, 0, Math.PI * 2);
        ctx.fill();

        // Symbiote web lines radiating from center
        ctx.strokeStyle = `rgba(30, 41, 59, ${alpha * 0.7})`;
        ctx.lineWidth = 2;
        const numSpokes = 6;
        for (let i = 0; i < numSpokes; i++) {
          const angle = (i * Math.PI * 2) / numSpokes + game.simTime * 0.002;
          ctx.beginPath();
          ctx.moveTo(trap.x, trap.y);
          ctx.quadraticCurveTo(
            trap.x + Math.cos(angle + 0.4) * trap.r * 0.5,
            trap.y + Math.sin(angle + 0.4) * trap.r * 0.3,
            trap.x + Math.cos(angle) * trap.r * pulse,
            trap.y + Math.sin(angle) * trap.r * 0.55 * pulse
          );
          ctx.stroke();
        }

        // Ring
        ctx.strokeStyle = `rgba(51, 65, 85, ${alpha * 0.5})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(trap.x, trap.y, trap.r * 0.6 * pulse, trap.r * 0.34 * pulse, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
      });
    };
    // Draw Web Weave strands – Black Spider's permanent wall-bounce threads
    const drawWebStrands = () => {
      if (!game.webStrands || !game.webStrands.length) return;
      const now = game.simTime;
      game.webStrands.forEach((strand) => {
        const age = now - strand.createdTime;
        const pulse = 0.75 + Math.sin(now * 0.005 + strand.createdTime * 0.017) * 0.22;

        ctx.save();

        // Outer dark glow
        ctx.strokeStyle = "rgba(2, 6, 23, 0.55)";
        ctx.lineWidth = 14;
        ctx.shadowColor = "#0f172a";
        ctx.shadowBlur = 18;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(strand.x1, strand.y1);
        ctx.lineTo(strand.x2, strand.y2);
        ctx.stroke();

        // Mid glow – slate silver
        ctx.strokeStyle = `rgba(100, 116, 139, ${0.45 * pulse})`;
        ctx.lineWidth = 5;
        ctx.shadowColor = "#475569";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(strand.x1, strand.y1);
        ctx.lineTo(strand.x2, strand.y2);
        ctx.stroke();

        // Core bright thread
        ctx.strokeStyle = `rgba(226, 232, 240, ${0.85 * pulse})`;
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.moveTo(strand.x1, strand.y1);
        ctx.lineTo(strand.x2, strand.y2);
        ctx.stroke();

        // Endpoint anchor dots
        const drawAnchor = (x, y) => {
          ctx.save();
          ctx.shadowBlur = 0;
          ctx.fillStyle = "#0f172a";
          ctx.strokeStyle = `rgba(148, 163, 184, ${0.9 * pulse})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(x, y, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          // Inner bright dot
          ctx.fillStyle = `rgba(226, 232, 240, ${0.8 * pulse})`;
          ctx.beginPath();
          ctx.arc(x, y, 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        };
        drawAnchor(strand.x1, strand.y1);
        drawAnchor(strand.x2, strand.y2);

        ctx.restore();
      });
    };

    const drawPsychicCircles = () => {
      if (!game.psychicCircles) return;
      game.psychicCircles.forEach((circle) => {
        const lifeAlpha = clamp(circle.life / 7000, 0, 1);
        const pulse = 0.5 + Math.sin(game.simTime * 0.006 + circle.createdTime * 0.01) * 0.5;
        ctx.save();
        ctx.translate(circle.x, circle.y);
        ctx.globalAlpha = Math.min(0.95, 0.35 + lifeAlpha * 0.45);
        const grad = ctx.createRadialGradient(0, 0, 4, 0, 0, circle.r);
        grad.addColorStop(0, "rgba(240, 171, 252, 0.2)");
        grad.addColorStop(0.62, "rgba(139, 92, 246, 0.14)");
        grad.addColorStop(1, "rgba(76, 29, 149, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(0, 0, circle.r, 0, Math.PI * 2); ctx.fill();

        ctx.strokeStyle = `rgba(216, 180, 254, ${0.45 + pulse * 0.35})`;
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 8]);
        ctx.lineDashOffset = -game.simTime * 0.035;
        ctx.beginPath(); ctx.arc(0, 0, circle.r, 0, Math.PI * 2); ctx.stroke();
        ctx.setLineDash([]);

        ctx.strokeStyle = "rgba(240, 171, 252, 0.35)";
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 3; i++) {
          const a = game.simTime * 0.0025 + i * Math.PI * 2 / 3;
          ctx.beginPath();
          ctx.ellipse(0, 0, circle.r * 0.72, circle.r * 0.22, a, 0, Math.PI * 2);
          ctx.stroke();
        }

        const used = Object.values(circle.hitsByBall || {}).reduce((sum, value) => Math.max(sum, value), 0);
        ctx.fillStyle = "#fdf4ff";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "center";
        ctx.shadowColor = "rgba(15, 23, 42, 0.75)";
        ctx.shadowBlur = 4;
        ctx.fillText(`${Math.max(0, 5 - used)} BOUNCES`, 0, 4);
        ctx.restore();
      });
    };

    const drawChaosCircles = () => {
      if (!game.chaosCircles) return;
      game.chaosCircles.forEach((circle) => {
        const bal = game.balance.chaos || BALANCE.chaos;
        const baseLife = bal.circleLife || BALANCE.chaos.circleLife;
        const lifeAlpha = clamp(circle.life / baseLife, 0, 1);
        const pulse = 0.5 + Math.sin(game.simTime * 0.011 + circle.createdTime * 0.01) * 0.5;
        const flash = game.simTime < (circle.flashUntil || 0);
        
        ctx.save();
        ctx.translate(circle.x, circle.y);
        ctx.globalAlpha = Math.min(1, 0.38 + lifeAlpha * 0.5 + (flash ? 0.22 : 0));
        const isVertical = circle.axis === "vertical";
        
        // 1. Fill: Glowing orange/light orange
        ctx.fillStyle = isVertical ? "rgba(253, 186, 116, 0.15)" : "rgba(249, 115, 22, 0.15)";
        ctx.beginPath(); ctx.arc(0, 0, circle.r, 0, Math.PI * 2); ctx.fill();

        // 2. Outer dash ring with glow
        ctx.strokeStyle = isVertical ? "#fed7aa" : "#fdba74";
        ctx.lineWidth = flash ? 5.5 : 3.5;
        ctx.shadowColor = isVertical ? "#f97316" : "#ea580c";
        ctx.shadowBlur = 10;
        ctx.setLineDash([8, 7]);
        ctx.lineDashOffset = isVertical ? -game.simTime * 0.045 : game.simTime * 0.045;
        ctx.beginPath(); ctx.arc(0, 0, circle.r + pulse * 2.5, 0, Math.PI * 2); ctx.stroke();
        ctx.setLineDash([]);
        ctx.shadowBlur = 0; // reset glow

        // 3. Runic pentagram lines
        ctx.strokeStyle = isVertical ? "rgba(254, 215, 170, 0.45)" : "rgba(253, 186, 116, 0.45)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle1 = (i * Math.PI * 2) / 5;
          const angle2 = ((i + 2) * Math.PI * 2) / 5;
          ctx.moveTo(Math.cos(angle1) * circle.r * 0.85, Math.sin(angle1) * circle.r * 0.85);
          ctx.lineTo(Math.cos(angle2) * circle.r * 0.85, Math.sin(angle2) * circle.r * 0.85);
        }
        ctx.stroke();
        
        // 4. Inner runic concentric circle
        ctx.strokeStyle = isVertical ? "rgba(254, 215, 170, 0.55)" : "rgba(253, 186, 116, 0.55)";
        ctx.beginPath();
        ctx.arc(0, 0, circle.r * 0.55, 0, Math.PI * 2);
        ctx.stroke();

        // 5. Outer rotating runic tick marks
        ctx.strokeStyle = isVertical ? "rgba(253, 186, 116, 0.75)" : "rgba(249, 115, 22, 0.75)";
        ctx.lineWidth = 1.8;
        for (let i = 0; i < 8; i++) {
          const a = (i * Math.PI * 2) / 8 + game.simTime * 0.004;
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * circle.r * 0.88, Math.sin(a) * circle.r * 0.88);
          ctx.lineTo(Math.cos(a) * circle.r * 1.04, Math.sin(a) * circle.r * 1.04);
          ctx.stroke();
        }

        // 6. Directional slam arrows
        ctx.fillStyle = isVertical ? "#fdba74" : "#f97316";
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        const arrowSize = 10 + pulse * 2;
        const drawArrow = (x, y, angle) => {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.moveTo(arrowSize, 0);
          ctx.lineTo(-arrowSize * 0.55, -arrowSize * 0.65);
          ctx.lineTo(-arrowSize * 0.25, 0);
          ctx.lineTo(-arrowSize * 0.55, arrowSize * 0.65);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        };
        
        if (circle.axis === "vertical") {
          drawArrow(0, -circle.r * 0.45, -Math.PI / 2);
          drawArrow(0, circle.r * 0.45, Math.PI / 2);
        } else {
          drawArrow(-circle.r * 0.45, 0, Math.PI);
          drawArrow(circle.r * 0.45, 0, 0);
        }
        ctx.restore();
      });
    };



    const drawStringWebBall = (ball) => {
      const config = BALL_TYPES.stringWeb;
      ctx.save(); ctx.translate(ball.x, ball.y);
      
      ctx.beginPath(); ctx.arc(0, 0, ball.r, 0, Math.PI * 2);
      ctx.fillStyle = config.color; ctx.fill();
      ctx.lineWidth = 4; ctx.strokeStyle = config.stroke; ctx.stroke();

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + (game.simTime * 0.001);
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * 22, Math.sin(a) * 22);
      }
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
      drawHealthInsideBall(ball);
    };

    const drawIntroText = (text, x, y, size, color = "#f8fafc", alpha = 1) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `900 ${size}px Arial Black, Impact, sans-serif`;
      ctx.lineWidth = Math.max(5, size * 0.12);
      ctx.strokeStyle = "#020617";
      ctx.shadowColor = color;
      ctx.shadowBlur = 14;
      ctx.strokeText(text, x, y);
      ctx.fillStyle = color;
      ctx.fillText(text, x, y);
      ctx.restore();
    };

    const drawFightIntro = (time) => {
      const intro = fightIntroRef.current;
      const left = game.balls[0];
      const right = game.balls[1];
      if (!intro.active || !left || !right) return;

      const elapsed = time - intro.startTime;
      const easeOut = (v) => 1 - Math.pow(1 - clamp(v, 0, 1), 3);
      const easeIn = (v) => Math.pow(clamp(v, 0, 1), 3);
      const centerX = game.width / 2;
      const centerY = game.height / 2;
      let shake = 0;
      if (!intro.initialized) {
        intro.initialized = true;
        intro.leftStartX = left.r + 42;
        intro.rightStartX = game.width - right.r - 42;
        intro.centerY = centerY;
        intro.leftRecoilY = ((left.type.length * 17 + right.type.length * 31) % 2 === 0) ? -1 : 1;
        intro.rightRecoilY = -intro.leftRecoilY;
        left.x = intro.leftStartX;
        right.x = intro.rightStartX;
        left.y = centerY;
        right.y = centerY;
        left.vx = 0;
        left.vy = 0;
        right.vx = 0;
        right.vy = 0;
        left.trail = [];
        right.trail = [];
      }
      if (elapsed > 250 && elapsed < FIGHT_INTRO_IMPACT_AT) shake = easeIn((elapsed - 250) / (FIGHT_INTRO_IMPACT_AT - 250)) * 13;
      if (elapsed >= FIGHT_INTRO_IMPACT_AT && elapsed < 2050) shake = 20 * (1 - clamp((elapsed - FIGHT_INTRO_IMPACT_AT) / 420, 0, 1));

      drawArena();
      ctx.save();
      if (shake > 0) ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
      ctx.beginPath();
      ctx.rect(0, 0, game.width, game.height);
      ctx.clip();

      let leftX = intro.leftStartX || left.x;
      let rightX = intro.rightStartX || right.x;
      let leftY = intro.centerY || centerY;
      let rightY = intro.centerY || centerY;
      const chargeStart = 250;
      const impactAt = FIGHT_INTRO_IMPACT_AT;
      if (elapsed >= chargeStart && elapsed < impactAt) {
        const p = easeIn((elapsed - chargeStart) / (impactAt - chargeStart));
        leftX = (intro.leftStartX || leftX) + (centerX - left.r - (intro.leftStartX || leftX)) * p;
        rightX = (intro.rightStartX || rightX) - ((intro.rightStartX || rightX) - (centerX + right.r)) * p;
        left.vx = 720 + p * 360;
        right.vx = -720 - p * 360;
        for (let i = 0; i < 9; i++) {
          const trailP = i / 9;
          ctx.globalAlpha = (1 - trailP) * 0.22;
          ctx.fillStyle = BALL_TYPES[left.type].color;
          ctx.beginPath(); ctx.arc(leftX - 18 - i * 16, leftY + Math.sin(i) * 3, left.r * (0.7 - trailP * 0.28), 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = BALL_TYPES[right.type].color;
          ctx.beginPath(); ctx.arc(rightX + 18 + i * 16, rightY + Math.cos(i) * 3, right.r * (0.7 - trailP * 0.28), 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1;
        for (let i = 0; i < 16; i++) {
          const dustX = i % 2 === 0 ? leftX - 34 - Math.random() * 32 : rightX + 34 + Math.random() * 32;
          const dustY = centerY + 30 + (Math.random() - 0.5) * 20;
          ctx.fillStyle = "rgba(203, 213, 225, 0.55)";
          ctx.fillRect(dustX, dustY, 4 + Math.random() * 6, 4 + Math.random() * 6);
        }
      } else if (elapsed >= impactAt) {
        const recoil = easeOut(clamp((elapsed - impactAt) / 420, 0, 1));
        const arc = Math.sin(recoil * Math.PI) * 28;
        leftX = centerX - left.r - 4 - recoil * 138;
        rightX = centerX + right.r + 4 + recoil * 138;
        leftY = centerY + (intro.leftRecoilY || -1) * (recoil * 92 + arc);
        rightY = centerY + (intro.rightRecoilY || 1) * (recoil * 92 + arc * 0.8);
        left.vx = -520;
        left.vy = (intro.leftRecoilY || -1) * 300;
        right.vx = 520;
        right.vy = (intro.rightRecoilY || 1) * 300;
      }

      left.x = leftX;
      left.y = leftY;
      right.x = rightX;
      right.y = rightY;
      left.trail = [...(left.trail || []), { x: left.x, y: left.y }].slice(-MAX_TRAIL_POINTS);
      right.trail = [...(right.trail || []), { x: right.x, y: right.y }].slice(-MAX_TRAIL_POINTS);

      game.balls.forEach(drawBallTrail);
      drawBall(left, game.simTime);
      drawBall(right, game.simTime);
      if (elapsed < impactAt) {
        drawIntroText(left.name, left.x, left.y - left.r - 28, 14, BALL_TYPES[left.type].color, 0.92);
        drawIntroText(right.name, right.x, right.y - right.r - 28, 14, BALL_TYPES[right.type].color, 0.92);
      }

      if (elapsed >= impactAt && elapsed < impactAt + 520) {
        const p = clamp((elapsed - impactAt) / 520, 0, 1);
        if (!intro.impactSoundPlayed) {
          intro.impactSoundPlayed = true;
          playSound("hammerHit", 1, 200);
        }
        ctx.save();
        ctx.globalAlpha = 1 - p;
        ctx.fillStyle = "#f8fafc";
        ctx.fillRect(0, 0, game.width, game.height);
        ctx.restore();
        ctx.save();
        ctx.globalAlpha = 1 - p;
        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 8;
        for (let i = 0; i < 4; i++) {
          const r = 18 + p * 170 + i * 18;
          ctx.strokeRect(centerX - r, centerY - r, r * 2, r * 2);
        }
        ctx.restore();
      }

      if (elapsed < impactAt) {
        if (!intro.readySoundPlayed) {
          intro.readySoundPlayed = true;
          playSound("shieldBlock", 0.8, 120);
        }
        drawIntroText("READY", centerX, centerY - 72, 54, "#facc15", 1);
      } else {
        if (!intro.fightSoundPlayed) {
          intro.fightSoundPlayed = true;
          playSound("explosion", 0.65, 180);
        }
        drawIntroText("FIGHT", centerX, centerY - 78, 66, "#ef4444", 1);
      }
      ctx.restore();
    };

    const drawWinner = (winner) => {
      if (!winner) return;
      const slowMoActive = game.deathSlowMoUntil && performance.now() < game.deathSlowMoUntil;
      ctx.fillStyle = slowMoActive ? "rgba(15, 23, 42, 0.32)" : "rgba(15, 23, 42, 0.85)";
      ctx.fillRect(0, 0, game.width, game.height);
      ctx.fillStyle = "#f8fafc"; ctx.font = "bold 36px sans-serif";
      ctx.textAlign = "center";
      if (slowMoActive) {
        ctx.font = "bold 26px sans-serif";
        ctx.fillText(`${winner} wins!`, game.width / 2, game.height / 2 + 22);
      } else {
        ctx.fillText(`${winner} wins!`, game.width / 2, game.height / 2);
        ctx.font = "16px sans-serif"; ctx.fillText("Match complete", game.width / 2, game.height / 2 + 36);
      }
      ctx.textAlign = "start";
    };

    const loop = (time) => {
      const dt = Math.min((time - (game.lastTime || time)) / 1000, 0.025);
      game.lastTime = time;
      const left = game.balls[0], right = game.balls[1];
      const combatActive = gameStarted || game.combatStarted;

      if (fightIntroRef.current.active) {
        const introElapsed = time - fightIntroRef.current.startTime;
        drawFightIntro(time);
        setElapsedTime(0);
        if (introElapsed >= FIGHT_INTRO_DURATION) {
          beginCombatFromIntro();
        }
        animationRef.current = requestAnimationFrame(loop);
        return;
      }

      if (combatActive && left.health > 0 && right.health > 0) {
        const steps = Math.ceil(game.simulationSpeed), stepDt = (dt * game.simulationSpeed) / steps;
        for (let s = 0; s < steps; s++) {
          game.simTime += stepDt * 1000;

          const activeVenomPools = game.venomPools?.length ? game.venomPools : null;
          game.balls.forEach((ball) => {
            const isPulling = ball.type === "spider" && ball.webState === "pulling";
            const isChargingHammer = ball.type === "hammer" && ball.hammerState === "charging";
            const isBlackSpiderDashing = false;
            const isBlackSpiderPullingSelf = false;
            const isBlackSpiderPulled = game.balls.some(b => b.type === "blackSpider" && b.bsHookedTargetId === ball.id && (b.bsSkillState === "pulling" || b.bsSkillState === "spinning"));
            
            const isLatchedTarget = game.balls.some(b => b.type === "vampire" && b.latchedTo === ball.id && b.latchUntil > game.simTime);
            const isLatchedSelf = ball.type === "vampire" && ball.latchedTo && ball.latchUntil > game.simTime;
            const isArmGrabbed = game.balls.some(b => b.type === "arm" && b.armGrabTargetId === ball.id && b.armState === "elbow_dropping" && b.armStateUntil > game.simTime);
            const isTridentPinned = ball.tridentPinnedUntil && game.simTime < ball.tridentPinnedUntil;
            let slowMult = (isLatchedTarget || isLatchedSelf) ? 0.4 : 1.0;
            const insideWeb = activeVenomPools ? activeVenomPools.some((pool) => {
              if (ball.side === pool.ownerSide) return false;
              const dist = Math.hypot(ball.x - pool.x, ball.y - pool.y);
              return dist < ball.r + pool.r;
            }) : false;
            if (insideWeb) slowMult *= 0.5;
            
            const isBlackSpiderMarked = game.balls.some(b => b.type === "blackSpider" && b.blackSpiderMarkedTargetId === ball.id && b.blackSpiderMarkUntil > game.simTime);
            if (isBlackSpiderMarked) slowMult *= 0.85;

            if (ball.dragonScorchedUntil && game.simTime < ball.dragonScorchedUntil) slowMult *= 0.75;
            if (ball.shadowSlowedUntil && game.simTime < ball.shadowSlowedUntil) slowMult *= 0.6;
            if (ball.type === "gazerBall" && ball.gazerState === "charging") slowMult *= 0.4;
            if (ball.type === "gazerBall" && ball.gazerRecoilUntil && game.simTime < ball.gazerRecoilUntil) slowMult *= 0.55;
            if (ball.paralyzedUntil && game.simTime < ball.paralyzedUntil) slowMult = 0;
            if (ball.type === "dragon" && ball.dragonState === "dashing") slowMult = 1.0;

            if (!isTridentPinned && !isBlackSpiderDashing && !isBlackSpiderPullingSelf && !isBlackSpiderPulled && (isChessCrownActive(ball) || (!isPulling && !isLatchedSelf && !isChargingHammer && !isArmGrabbed))) {
              ball.x += ball.vx * stepDt * slowMult; ball.y += ball.vy * stepDt * slowMult;
              handleWallBounce(ball);
            }
            if (s === steps - 1) {
              if (!ball.trail) ball.trail = [];
              ball.trail.push({ x: ball.x, y: ball.y });
              if (ball.trail.length > MAX_TRAIL_POINTS) ball.trail.shift();
            }

            if ((ball.type === "wrecker" && (ball.wreckerState === "leaping" || ball.wreckerState === "cooldown")) ||
                (ball.type === "feralClaw" && (ball.feralPounceState === "launch" || ball.feralPounceState === "settle"))) {
              // bypass base speed limits
            } else {
              const isWrecker = ball.type === "wrecker";
              const baseSpeed = isWrecker ? 245 : 220;
              const maxSpeed = isWrecker ? ((game.balance.wrecker || BALANCE.wrecker).maxBounceSpeed || 340) : baseSpeed;
              const currentSpeed = Math.hypot(ball.vx, ball.vy);
              if (currentSpeed > maxSpeed) {
                const damp = Math.pow(isWrecker ? 0.9 : 0.95, stepDt * 60);
                const newSpeed = maxSpeed + (currentSpeed - maxSpeed) * damp;
                ball.vx = (ball.vx / currentSpeed) * newSpeed; ball.vy = (ball.vy / currentSpeed) * newSpeed;
              } else if (currentSpeed < baseSpeed * 0.7 && currentSpeed > 10) {
                const accel = Math.pow(0.98, stepDt * 60);
                const newSpeed = baseSpeed * 0.7 + (currentSpeed - baseSpeed * 0.7) * accel;
                ball.vx = (ball.vx / currentSpeed) * newSpeed; ball.vy = (ball.vy / currentSpeed) * newSpeed;
              }
            }
          });

          const collided = resolveBallCollision(left, right);
          if (collided) {
            playSound("ballCollision", 1, 80);
            if (game.simTime >= OPENING_SKILL_DELAY) {
            if (left.type === "spore" && left.hydraGlowStacks > 0) {
              const glowDamage = left.hydraGlowStacks * game.balance.spore.cactusDamage;
              applyDamage(right, glowDamage, `${left.id}-hydra-glow-hit`, game.simTime, 250);
              game.floatingTexts = game.floatingTexts || [];
              game.floatingTexts.push({ x: right.x, y: right.y - right.r - 22, vy: -60, text: `RAGE -${glowDamage}`, color: "#fb7185", life: 0.8, maxLife: 0.8 });
              left.hydraGlowStacks = 0;
            }
            if (right.type === "spore" && right.hydraGlowStacks > 0) {
              const glowDamage = right.hydraGlowStacks * game.balance.spore.cactusDamage;
              applyDamage(left, glowDamage, `${right.id}-hydra-glow-hit`, game.simTime, 250);
              game.floatingTexts = game.floatingTexts || [];
              game.floatingTexts.push({ x: left.x, y: left.y - left.r - 22, vy: -60, text: `RAGE -${glowDamage}`, color: "#fb7185", life: 0.8, maxLife: 0.8 });
              right.hydraGlowStacks = 0;
            }
            
            [left, right].forEach((b, idx) => {
              if (b.type === "shield" && b.shieldState === "held") {
                  const enemy = idx === 0 ? right : left;
                  const angle = Math.atan2(enemy.y - b.y, enemy.x - b.x);
                  let diff = Math.abs(angle - b.shieldAngle);
                  while (diff > Math.PI) diff = Math.abs(diff - Math.PI * 2);
                  if (diff < game.balance.shield.arcWidth / 2) {
                    if (!hasStringBounceGuard(enemy)) {
                      enemy.vx += Math.cos(angle) * game.balance.shield.knockback * 15;
                      enemy.vy += Math.sin(angle) * game.balance.shield.knockback * 15;
                    }
                    spawnShieldSparks(enemy.x - Math.cos(angle) * enemy.r, enemy.y - Math.sin(angle) * enemy.r, angle);
                    registerShieldGuardHit(b, angle, game.simTime);
                  }
              }
            });
          }
        }

          game.balls.forEach((ball) => {
            const target = ball.side === "left" ? right : left;
            const isGrabbedByArm = game.balls.some(b => b.type === "arm" && b.armGrabTargetId === ball.id && b.armState === "elbow_dropping" && b.armStateUntil > game.simTime);
            if (game.simTime >= OPENING_SKILL_DELAY) {
                if (ball.burnUntil && game.simTime < ball.burnUntil && game.simTime >= (ball.nextBurnTickAt || 0)) {
                  const burnDamage = Math.max(MIN_DAMAGE, 1);
                  ball.health = clamp(ball.health - burnDamage, 0, MAX_HEALTH);
                  ball.nextBurnTickAt = game.simTime + 450;
                  spawnSparks(ball.x, ball.y, "#fb923c", 4);
                  game.floatingTexts = game.floatingTexts || [];
                  game.floatingTexts.push({ x: ball.x, y: ball.y - ball.r - 8, vy: -45, text: `BURN -${burnDamage}`, color: "#fb923c", life: 0.55, maxLife: 0.55 });
                }
                const isGumPulled = ball.jokerPulledUntil && game.simTime < ball.jokerPulledUntil;
                const isBlackSpiderPulled = game.balls.some(b => b.type === "blackSpider" && b.bsHookedTargetId === ball.id && (b.bsSkillState === "pulling" || b.bsSkillState === "spinning"));
                if (ball.type === "knife" && !isGrabbedByArm && !isGumPulled && !isBlackSpiderPulled) {
                  const bal = game.balance.knife;
                  if (!ball.knifeBladeState) ball.knifeBladeState = "rotating";
                  
                  if (ball.knifeBladeState === "rotating") {
                    ball.spinAngle += bal.spinSpeed;
                    const tip = {
                      x: ball.x + Math.cos(ball.spinAngle) * (ball.r + bal.bladeLength),
                      y: ball.y + Math.sin(ball.spinAngle) * (ball.r + bal.bladeLength),
                    };
                    if (Math.hypot(tip.x - target.x, tip.y - target.y) < target.r + 14) {
                      applyDamage(target, bal.damage, `${ball.id}-knife-hit`, game.simTime, bal.cooldown);
                      spawnSparks(tip.x, tip.y, "#bae6fd", 5);
                    }
                    
                    const dist = Math.hypot(target.x - ball.x, target.y - ball.y);
                    if (dist >= 120 && dist <= 240 && game.simTime >= (ball.nextSecondaryAt || 0)) {
                      ball.knifeBladeState = "thrown";
                      ball.knifeBladeX = ball.x;
                      ball.knifeBladeY = ball.y;
                      const angle = Math.atan2(target.y - ball.y, target.x - ball.x);
                      ball.knifeBladeTargetX = target.x;
                      ball.knifeBladeTargetY = target.y;
                      ball.knifeBladeVx = Math.cos(angle) * 500;
                      ball.knifeBladeVy = Math.sin(angle) * 500;
                      ball.knifeBladeAngle = angle;
                      ball.nextSecondaryAt = game.simTime + bal.secCooldown;
                      playSound("shieldThrow");
                    }
                  } else {
                    if (ball.knifeBladeState === "thrown") {
                      ball.knifeBladeX += ball.knifeBladeVx * stepDt;
                      ball.knifeBladeY += ball.knifeBladeVy * stepDt;
                      const dToTar = Math.hypot(ball.knifeBladeTargetX - ball.knifeBladeX, ball.knifeBladeTargetY - ball.knifeBladeY);
                      if (dToTar < 15) {
                        ball.knifeBladeState = "hovering";
                        ball.knifeBladeHoverUntil = game.simTime + 300;
                      }
                    } else if (ball.knifeBladeState === "hovering") {
                      if (game.simTime >= ball.knifeBladeHoverUntil) {
                        ball.knifeBladeState = "returning";
                      }
                    } else if (ball.knifeBladeState === "returning") {
                      const angle = Math.atan2(ball.y - ball.knifeBladeY, ball.x - ball.knifeBladeX);
                      ball.knifeBladeVx = Math.cos(angle) * 550;
                      ball.knifeBladeVy = Math.sin(angle) * 550;
                      ball.knifeBladeAngle = angle;
                      ball.knifeBladeX += ball.knifeBladeVx * stepDt;
                      ball.knifeBladeY += ball.knifeBladeVy * stepDt;
                      if (Math.hypot(ball.x - ball.knifeBladeX, ball.y - ball.knifeBladeY) < ball.r + 10) {
                        ball.knifeBladeState = "rotating";
                      }
                    }
                    
                    if (Math.hypot(ball.knifeBladeX - target.x, ball.knifeBladeY - target.y) < target.r + 16) {
                      applyDamage(target, bal.secDamage, `${ball.id}-knife-sec`, game.simTime, 300);
                      spawnSparks(ball.knifeBladeX, ball.knifeBladeY, "#38bdf8", 6);
                    }
                  }
                }
                const isParalyzed = ball.paralyzedUntil && game.simTime < ball.paralyzedUntil;
                const skillsLocked = ball.skillLockedUntil && game.simTime < ball.skillLockedUntil;
                if (!isParalyzed && !isGrabbedByArm && !isGumPulled && !isBlackSpiderPulled && !skillsLocked) {
                  if (ball.type === "gun") updateGun(ball, target, game.simTime, stepDt);
                  if (ball.type === "wrecker") updateWrecker(ball, target, game.simTime, stepDt);
                  if (ball.type === "vampire") updateVampire(ball, target, game.simTime);
                  if (ball.type === "laser") updateLaser(ball, target, game.simTime, stepDt);
                  
                  // New Weapon Ticks
                  if (ball.type === "spider") updateSpider(ball, target, game.simTime, stepDt);
                  if (ball.type === "bomber") updateBomber(ball, target, game.simTime);
                  if (ball.type === "spore") updateSpore(ball, target, game.simTime);
                  if (ball.type === "hammer") updateHammer(ball, target, game.simTime);
                  if (ball.type === "arm") updateArm(ball, target, game.simTime, stepDt);
                  if (ball.type === "chess") updateChess(ball, target, game.simTime, stepDt);
                  if (ball.type === "dragon") updateDragon(ball, target, game.simTime);
                  if (ball.type === "psychicer") updatePsychicer(ball, target, game.simTime);
                  if (ball.type === "chaos") updateChaos(ball, target, game.simTime);

                  if (ball.type === "trident") updateTrident(ball, target, game.simTime, stepDt);
                  if (ball.type === "shadow") updateShadow(ball, target, game.simTime, stepDt);
                  if (ball.type === "feralClaw") updateFeralClaw(ball, target, game.simTime);
                  if (ball.type === "mirror") updateMirror(ball, target, game.simTime);
                  if (ball.type === "joker") updateJoker(ball, target, game.simTime);
                  if (ball.type === "blackSpider") updateBlackSpider(ball, target, game.simTime, stepDt);
                  if (ball.type === "gazerBall") updateGazerBall(ball, target, game.simTime, stepDt);
                  if (ball.type === "fireSkull") updateFireSkull(ball, target, game.simTime, stepDt);
                  if (ball.type === "constellation") updateConstellation(ball, game.simTime);
                  
                  if (ball.type === "shield") updateShield(ball, target, game.simTime, stepDt);
                }
            }
          });

          updateBullets(stepDt, game.balls);
          updateSpiderWebProjectile(stepDt, game.balls);
          updateMines(stepDt, game.balls);
          updateFireCars(stepDt, game.balls);
          pruneShadowMinions();
          updateExplosions(stepDt);
          updateParticles(stepDt);
          updateFloatingTexts(stepDt);
          updateCacti(stepDt);
          updateStrings(stepDt);
          updateVenomPools(stepDt);
          updateVenomTraps(stepDt);
          updateWebStrands();
          updatePsychicCircles(stepDt);
          updateChaosCircles(stepDt);
          updateActiveConstellations(game.simTime);
          updateJokerThreads(stepDt);
        }
      } else if (combatActive) {
        const slowMoActive = game.deathSlowMoUntil && time < game.deathSlowMoUntil;
        const effectDt = slowMoActive ? dt * 0.24 : dt;
        updateParticles(effectDt);
        updateFloatingTexts(effectDt);
        updateJokerThreads(effectDt);
      } else if (!combatActive) {
        game.balls.forEach((ball) => {
          ball.x += ball.vx * dt; ball.y += ball.vy * dt;
          handleWallBounce(ball);
          if (!ball.trail) ball.trail = [];
          ball.trail.push({ x: ball.x, y: ball.y });
          if (ball.trail.length > MAX_TRAIL_POINTS) ball.trail.shift();

          if (ball.type === "shield") {
            const target = ball.side === "left" ? right : left;
            ball.shieldAngle = Math.atan2(target.y - ball.y, target.x - ball.x);
          }
          if (ball.type === "knife") ball.spinAngle += 0.02;
        });
        resolveBallCollision(left, right);
        updateParticles(dt);
        updateFloatingTexts(dt);
        updateCacti(dt);
        updateStrings(dt);
        updateWebStrands();
        updatePsychicCircles(dt);
        updateChaosCircles(dt);
        updateJokerThreads(dt);
      }

      drawArena();

      ctx.save();
      // Clip rendering of gameplay elements to the arena boundaries
      ctx.beginPath();
      ctx.rect(0, 0, game.width, game.height);
      ctx.clip();

      if (game.screenShake > 0.1) {
        const sx = (Math.random() - 0.5) * game.screenShake * 1.8;
        const sy = (Math.random() - 0.5) * game.screenShake * 1.8;
        ctx.translate(sx, sy);
        game.screenShake *= Math.pow(0.88, dt * 60);
      }

      game.balls.forEach(drawBallTrail);
      drawFireRoads();
      drawStrings(); drawJokerThreads(); drawVenomPools(); drawVenomTraps(); drawWebStrands(); drawPsychicCircles(); drawChaosCircles(); drawConstellationStars(); drawActiveConstellations();
      drawMines(); drawBullets(); drawExplosions(); drawParticles(); drawFloatingTexts(); drawCacti();
      drawFireCarEntities();
      drawBall(left, game.simTime); drawBall(right, game.simTime);
      ctx.restore();

      const winner = combatActive ? left.health <= 0 ? right.name : right.health <= 0 ? left.name : null : null;
      if (winner && !game.deathEffectStarted) {
        const defeated = left.health <= 0 ? left : right;
        spawnDeathShatter(defeated, time);
      }
      if (winner && !game.roundOverSoundPlayed) {
        game.roundOverSoundPlayed = true;
        stopMatchMusic();
        playSound("roundWin");
      }
      if (!combatActive) {
        ctx.fillStyle = "rgba(15, 23, 42, 0.4)"; ctx.fillRect(18, 18, game.width - 36, game.height - 36);
      } else {
        drawWinner(winner);
      }

      setGameState((prev) => {
        const next = {
          leftHealth: Math.ceil(left.health), rightHealth: Math.ceil(right.health),
          leftName: left.name, rightName: right.name, winner, running: combatActive && !winner
        };
        setCombatStats({ left: { ...game.stats.left }, right: { ...game.stats.right } });
        if (
          prev.leftHealth === next.leftHealth && prev.rightHealth === next.rightHealth &&
          prev.leftName === next.leftName && prev.rightName === next.rightName &&
          prev.winner === next.winner && prev.running === next.running
        ) return prev;
        return next;
      });
      setElapsedTime(game.simTime / 1000);

      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [gameStarted, simulationSpeed, startMatchMusic, stopMatchMusic]);

  const renderSlider = (label, type, key, min, max, step = 1, unit = "") => {
    const isDamageSetting = key.toLowerCase().includes("damage") || key === "drainPerTick";
    const effectiveMin = isDamageSetting ? Math.max(min, MIN_DAMAGE) : min;
    const val = Math.min(max, Math.max(effectiveMin, balanceSettings[type][key]));
    const displayVal = key === "arcWidth" ? Math.round(val * 180 / Math.PI) + "°" : val;
    return (
      <div className="space-y-1.5 py-1 text-slate-300">
        <div className="flex justify-between text-xs font-semibold">
          <span>{label}</span>
          <span className="text-sky-400 font-bold">{displayVal}{unit}</span>
        </div>
        <input
          type="range" min={effectiveMin} max={max} step={step} value={val}
          onChange={(e) => updateBalanceSetting(type, key, parseFloat(e.target.value))}
          className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
        />
      </div>
    );
  };

  const renderSettingsForBall = (type) => {
    const config = BALL_TYPES[type];
    if (!config) return null;
    return (
      <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
        <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-2 py-1 font-bold text-sm text-slate-950">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: config.color }} />
          {config.name} Tuning
        </div>
        <div className="space-y-2">
          {type === "knife" && (
            <>
              {renderSlider("Knife Damage", "knife", "damage", 1, 30)}
              {renderSlider("Hit Cooldown", "knife", "cooldown", 100, 1500, 10, "ms")}
              {renderSlider("Blade Length", "knife", "bladeLength", 15, 100, 1, "px")}
              {renderSlider("Rotation Speed", "knife", "spinSpeed", 0.02, 0.3, 0.01)}
              {renderSlider("Sec: Throw Cooldown", "knife", "secCooldown", 1000, 8000, 100, "ms")}
              {renderSlider("Sec: Throw Damage", "knife", "secDamage", 1, 20)}
            </>
          )}
          {type === "gun" && (
            <>
              {renderSlider("Bullet Damage", "gun", "bulletDamage", 1, 30)}
              {renderSlider("Shot Cooldown", "gun", "shotCooldown", 100, 1500, 10, "ms")}
              {renderSlider("Reload Time", "gun", "reloadTime", 500, 4000, 50, "ms")}
              {renderSlider("Bullet Speed", "gun", "bulletSpeed", 100, 800, 10, "px/s")}
              {renderSlider("Bullet Life", "gun", "bulletLife", 0.4, 4, 0.05, "s")}
              {renderSlider("Sec: Dash Cooldown", "gun", "secCooldown", 1000, 8000, 100, "ms")}
              {renderSlider("Sec: Dash Force", "gun", "secDashForce", 100, 800, 20, "px/s")}
              {renderSlider("Dog Damage", "gun", "dogDamage", 1, 20)}
              {renderSlider("Dog Health", "gun", "dogHealth", 5, 100)}
              {renderSlider("Dog Speed", "gun", "dogSpeed", 80, 420, 10, "px/s")}
              {renderSlider("Dog Respawn", "gun", "dogCooldown", 2000, 20000, 500, "ms")}
              {renderSlider("Rapid Fire Cooldown", "gun", "rapidFireCooldown", 50, 500, 10, "ms")}
              {renderSlider("Rapid Pierce Shots", "gun", "rapidPierceShots", 0, 6, 1)}
            </>
          )}
          {type === "vampire" && (
            <>
              {renderSlider("Drain Rate", "vampire", "drainPerTick", 1, 10, 1, "/tick")}
              {renderSlider("Heal Rate", "vampire", "healPerTick", 1, 8, 1, "/tick")}
              {renderSlider("Drain Cooldown", "vampire", "tickCooldown", 50, 800, 10, "ms")}
              {renderSlider("Latch Duration", "vampire", "latchDuration", 200, 3000, 50, "ms")}
              {renderSlider("Latch Cooldown", "vampire", "latchCooldown", 1000, 6000, 100, "ms")}
              {renderSlider("Latch Distance", "vampire", "latchDistance", 0, 60, 1, "px")}
            </>
          )}
          {type === "laser" && (
            <>
              {renderSlider("Tick Damage", "laser", "damagePerTick", 1, 15)}
              {renderSlider("Tick Cooldown", "laser", "tickCooldown", 50, 500, 10, "ms")}
              {renderSlider("Charge Duration", "laser", "chargeTime", 300, 2500, 50, "ms")}
              {renderSlider("Fire Duration", "laser", "fireDuration", 300, 2000, 50, "ms")}
              {renderSlider("Beam Width", "laser", "beamWidth", 6, 40, 2, "px")}
              {renderSlider("Cooldown", "laser", "cooldown", 1000, 5000, 100, "ms")}
              {renderSlider("Pulse Damage", "laser", "pulseDamage", 1, 40)}
              {renderSlider("Pulse Speed", "laser", "pulseSpeed", 200, 1000, 20, "px/s")}
              {renderSlider("Pulse Stun Duration", "laser", "pulseStunDuration", 200, 2500, 50, "ms")}

            </>
          )}
          {type === "shield" && (
            <>
              {renderSlider("Shield Damage", "shield", "damage", 2, 30)}
              {renderSlider("Shield Arc Width", "shield", "arcWidth", 0.3, 3.14, 0.05)}
              {renderSlider("Knockback Force", "shield", "knockback", 5, 35, 1)}
              {renderSlider("Throw Cooldown", "shield", "cooldown", 500, 4000, 50, "ms")}
              {renderSlider("Shield Speed", "shield", "shieldSpeed", 200, 1000, 20, "px/s")}
              {renderSlider("Return Speed", "shield", "returnSpeed", 200, 1200, 20, "px/s")}
              {renderSlider("Throw Duration", "shield", "duration", 300, 3000, 50, "ms")}
              {renderSlider("Sec: Bash Cooldown (Held)", "shield", "secCooldownHeld", 1000, 8000, 100, "ms")}
              {renderSlider("Sec: Bash Damage", "shield", "secBashDamage", 1, 20)}
            </>
          )}
          {type === "spider" && (
            <>
              {renderSlider("Fang Damage", "spider", "fangDamage", 1, 20)}
              {renderSlider("Web Speed", "spider", "webSpeed", 200, 1000, 20, "px/s")}
              {renderSlider("Pull Speed", "spider", "pullSpeed", 200, 1000, 20, "px/s")}
              {renderSlider("Bounce Speed", "spider", "bounceSpeed", 100, 600, 10, "px/s")}
              {renderSlider("Pull Duration", "spider", "pullDuration", 300, 1800, 50, "ms")}
              {renderSlider("Cooldown", "spider", "cooldown", 1000, 6000, 100, "ms")}
              {renderSlider("Sec: Web Cooldown", "spider", "secCooldown", 1000, 10000, 100, "ms")}
              {renderSlider("Sec: Web Radius", "spider", "secPoolRadius", 15, 80, 1, "px")}
              {renderSlider("Sec: Web Damage", "spider", "secDamage", 1, 15)}
            </>
          )}
          {type === "bomber" && (
            <>
              {renderSlider("Mine Damage", "bomber", "mineDamage", 1, 40)}
              {renderSlider("Explosion Radius", "bomber", "mineRadius", 30, 150, 5, "px")}
              {renderSlider("Trigger Range", "bomber", "mineTriggerDist", 5, 40, 1, "px")}
              {renderSlider("Lay Cooldown", "bomber", "cooldown", 500, 4000, 50, "ms")}
              {renderSlider("Max Mines", "bomber", "maxMines", 1, 8, 1)}
              {renderSlider("Knockback Force", "bomber", "knockback", 5, 40, 1)}
              {renderSlider("Sec: Homing Cooldown", "bomber", "secCooldown", 1000, 12000, 100, "ms")}
            </>
          )}

          {type === "spore" && (
            <>
              {renderSlider("Hydra Damage", "spore", "cactusDamage", 1, 30)}
              {renderSlider("Growth Duration", "spore", "growthDuration", 300, 2500, 50, "ms")}
              {renderSlider("Speed Boost Force", "spore", "speedBoost", 1.1, 2.0, 0.05)}
              {renderSlider("Hydra Lifetime", "spore", "cactusLife", 3000, 12000, 500, "ms")}
              {renderSlider("Drop Cooldown", "spore", "cooldown", 1000, 8000, 100, "ms")}
            </>
          )}
          {type === "hammer" && (
            <>
              {renderSlider("Spin Damage", "hammer", "spinDamage", 1, 20)}
              {renderSlider("Launch Damage", "hammer", "launchDamage", 1, 50)}
              {renderSlider("Spin Speed", "hammer", "spinSpeed", 0.05, 0.35, 0.01)}
              {renderSlider("Charge Duration", "hammer", "chargeDuration", 300, 2500, 50, "ms")}
              {renderSlider("Launch Speed", "hammer", "launchSpeed", 300, 1500, 20, "px/s")}
              {renderSlider("Launch Duration", "hammer", "launchDuration", 300, 2000, 50, "ms")}
            </>
          )}
          {type === "stringWeb" && (
            <>
              {renderSlider("String Damage", "stringWeb", "stringDamage", 1, 35)}
              {renderSlider("String Lifetime", "stringWeb", "stringLifetime", 1000, 20000, 500, "ms")}
              {renderSlider("Max Strings", "stringWeb", "maxStrings", 1, 20, 1)}
              {renderSlider("String Hit Padding", "stringWeb", "stringHitPadding", 0, 24, 1, "px")}
              {renderSlider("Trampoline Cooldown", "stringWeb", "trampolineCooldown", 200, 4000, 50, "ms")}
              {renderSlider("Trampoline Boost", "stringWeb", "trampolineBoost", 1, 2.5, 0.05, "x")}
              {renderSlider("Trampoline Min Speed", "stringWeb", "trampolineMinSpeed", 120, 700, 10, "px/s")}
            </>
          )}
          {type === "arm" && (
            <>
              {renderSlider("Punch Damage", "arm", "punchDamage", 1, 30)}
              {renderSlider("Punch Range", "arm", "punchRange", 20, 160, 5, "px")}
              {renderSlider("Elbow Drop Grab Range", "arm", "grabRange", 20, 160, 5, "px")}
              {renderSlider("Punch Cooldown", "arm", "punchCooldown", 200, 3000, 50, "ms")}
              {renderSlider("Punch Knockback", "arm", "punchKnockback", 50, 800, 20)}
              {renderSlider("Sec: Elbow Drop Cooldown", "arm", "secCooldown", 1000, 8000, 100, "ms")}
              {renderSlider("Sec: Elbow Drop Damage", "arm", "secSlamDamage", 1, 30)}
            </>
          )}
          {type === "chess" && (
            <>
              {renderSlider("Cooldown", "chess", "cooldown", 1000, 12000, 100, "ms")}
              {renderSlider("Center Travel Speed", "chess", "centerSpeed", 100, 800, 10, "px/s")}
              {renderSlider("Crown Duration", "chess", "crownDuration", 500, 6000, 100, "ms")}
              {renderSlider("Crown Damage", "chess", "damage", 1, 40)}
              {renderSlider("Damage Tick Rate", "chess", "tickCooldown", 100, 1500, 50, "ms")}
            </>
          )}
          {type === "dragon" && (
            <>
              {renderSlider("Flame Damage", "dragon", "flameDamage", 1, 20)}
              {renderSlider("Flame Range", "dragon", "flameRange", 60, 130, 2, "px")}
              {renderSlider("Flame Angle", "dragon", "flameAngle", 0.25, 1.1, 0.05)}
              {renderSlider("Tick Cooldown", "dragon", "tickCooldown", 300, 1200, 20, "ms")}
              {renderSlider("Breath Duration", "dragon", "breathDuration", 250, 1200, 50, "ms")}
              {renderSlider("Breath Recovery", "dragon", "breathCooldown", 800, 3500, 100, "ms")}
              {renderSlider("Heat Per Wall Bounce", "dragon", "heatPerWallBounce", 1, 5, 1)}
              {renderSlider("Heat Required", "dragon", "heatRequired", 3, 9, 1)}
              {renderSlider("Fireball Damage", "dragon", "fireballDamage", 1, 15)}
              {renderSlider("Fireball Speed", "dragon", "fireballSpeed", 200, 700, 20, "px/s")}
              {renderSlider("Fireball Bounces", "dragon", "fireballBounces", 0, 4, 1)}
              {renderSlider("Burn Duration", "dragon", "burnDuration", 300, 1800, 50, "ms")}
              {renderSlider("Fireball Cooldown", "dragon", "cooldown", 1200, 5000, 50, "ms")}
              {renderSlider("Sec: Dash Cooldown", "dragon", "secCooldown", 1000, 9000, 100, "ms")}
              {renderSlider("Sec: Dash Damage", "dragon", "secDamage", 1, 30)}
              {renderSlider("Sec: Dash Speed", "dragon", "secDashForce", 300, 900, 50, "px/s")}
            </>
          )}
          {type === "psychicer" && (
            <>
              {renderSlider("Circle Damage", "psychicer", "circleDamage", 1, 5)}
              {renderSlider("Circle Radius", "psychicer", "circleRadius", 45, 150, 5, "px")}
              {renderSlider("Max Bounce Hits", "psychicer", "maxBounceHits", 1, 5, 1)}
              {renderSlider("Drop Cooldown", "psychicer", "cooldown", 1000, 12000, 100, "ms")}
              {renderSlider("Circle Lifetime", "psychicer", "circleLife", 1000, 15000, 500, "ms")}
            </>
          )}
          {type === "chaos" && (
            <>
              {renderSlider("Circle Radius", "chaos", "circleRadius", 25, 110, 5, "px")}
              {renderSlider("Launch Speed", "chaos", "launchSpeed", 250, 1100, 20, "px/s")}
              {renderSlider("Wall Slam Damage", "chaos", "slamDamage", 1, 20)}
              {renderSlider("Control Hold", "chaos", "controlHold", 0, 800, 50, "ms")}
              {renderSlider("Control Duration", "chaos", "controlDuration", 300, 2500, 50, "ms")}
              {renderSlider("Radius Bounce", "chaos", "radiusBounce", 0, 400, 20)}
              {renderSlider("Drop Cooldown", "chaos", "cooldown", 1000, 12000, 100, "ms")}
              {renderSlider("Circle Lifetime", "chaos", "circleLife", 1000, 15000, 500, "ms")}
              {renderSlider("Trigger Cooldown", "chaos", "triggerCooldown", 200, 3000, 100, "ms")}
              {renderSlider("Trap Count", "chaos", "trapCount", 1, 5, 1)}
            </>
          )}

          {type === "joker" && (
            <>
              {renderSlider("Gum String Hit Damage", "joker", "threadDamage", 1, 12)}
              {renderSlider("Throw Speed", "joker", "throwSpeed", 260, 1000, 20, "px/s")}
              {renderSlider("Gum String Cooldown", "joker", "cooldown", 1200, 12000, 100, "ms")}
              {renderSlider("Tip Radius", "joker", "tipRadius", 5, 18, 1, "px")}
              {renderSlider("Tip Bounces", "joker", "maxBounces", 1, 30, 1)}
              {renderSlider("Pull Speed", "joker", "pullSpeed", 280, 1000, 20, "px/s")}
              {renderSlider("Wall Pull Damage", "joker", "pullWallDamage", 1, 18)}
              {renderSlider("Pull Duration", "joker", "pullDuration", 500, 3200, 100, "ms")}
              {renderSlider("Gum String Lifetime", "joker", "threadLife", 1000, 12000, 250, "ms")}
            </>
          )}
          {type === "constellation" && (
            <>
              {renderSlider("Active Cooldown", "constellation", "cooldown", 1000, 15000, 100, "ms")}
              {renderSlider("Pattern Duration", "constellation", "activePatternDuration", 1000, 10000, 100, "ms")}
              {renderSlider("3 Sides: Edge Damage", "constellation", "triangleDamage", 1, 30, 1)}
              {renderSlider("3 Sides: Knockback", "constellation", "triangleKnockback", 100, 900, 20)}
              {renderSlider("4 Sides: Edge Damage", "constellation", "squareEdgeDamage", 1, 20, 1)}
              {renderSlider("4 Sides: Tick Damage", "constellation", "squareTickDamage", 1, 20, 1)}
              {renderSlider("4 Sides: Knockback", "constellation", "squareKnockback", 100, 900, 20)}
              {renderSlider("5 Sides: Edge Damage", "constellation", "pentagonEdgeDamage", 1, 20, 1)}
              {renderSlider("5 Sides: Tick Damage", "constellation", "pentagonTickDamage", 1, 20, 1)}
              {renderSlider("5 Sides: Pull Force", "constellation", "pentagonPullStrength", 50, 600, 10)}
              {renderSlider("Ultimate Duration", "constellation", "ultDuration", 1000, 15000, 500, "ms")}
            </>
          )}
          {type === "gazerBall" && (
            <>
              {renderSlider("Charge Duration", "gazerBall", "chargeDuration", 100, 2000, 50, "ms")}
              {renderSlider("Beam Cooldown", "gazerBall", "cooldown", 1000, 15000, 100, "ms")}
              {renderSlider("Beam Damage", "gazerBall", "beamDamage", 1, 60)}
              {renderSlider("Beam Knockback", "gazerBall", "beamKnockback", 100, 1500, 20)}
              {renderSlider("Beam Width", "gazerBall", "beamWidth", 2, 80, 1, "px")}
              {renderSlider("Recoil Force", "gazerBall", "recoilForce", 50, 1200, 20)}
              {renderSlider("Focus Interval", "gazerBall", "focusInterval", 200, 4000, 50, "ms")}
              {renderSlider("Max Focus Stacks", "gazerBall", "maxFocusStacks", 1, 10, 1)}
              {renderSlider("Focus Bonus", "gazerBall", "focusBonus", 0.01, 0.2, 0.01, "x")}
              {renderSlider("Ult Duration", "gazerBall", "ultDuration", 1000, 15000, 500, "ms")}
              {renderSlider("Ult Width Mult", "gazerBall", "ultWidthMult", 1.1, 4, 0.1, "x")}
              {renderSlider("Ult Max Bounces", "gazerBall", "ultMaxBounces", 1, 15, 1)}
              {renderSlider("Ult CDR Mult", "gazerBall", "ultCDRMult", 0.1, 0.9, 0.05, "x")}
            </>
          )}
          {type === "trident" && (
            <>
              {renderSlider("Throw Damage", "trident", "throwDamage", 1, 25)}
              {renderSlider("Wall Pin Damage", "trident", "wallDamage", 1, 30)}
              {renderSlider("Throw Speed", "trident", "throwSpeed", 250, 1400, 20, "px/s")}
              {renderSlider("Recall Speed", "trident", "recallSpeed", 250, 1300, 20, "px/s")}
              {renderSlider("Throw Cooldown", "trident", "cooldown", 1500, 14000, 100, "ms")}
              {renderSlider("Wall Stick Duration", "trident", "stuckDuration", 200, 2500, 50, "ms")}
              {renderSlider("Dive Damage", "trident", "diveDamage", 1, 25)}
              {renderSlider("Dive Cooldown", "trident", "diveCooldown", 2500, 16000, 100, "ms")}
              {renderSlider("Dive Track Time", "trident", "diveTrackDuration", 300, 2200, 50, "ms")}
              {renderSlider("Dive Stop Time", "trident", "divePauseDuration", 100, 1200, 50, "ms")}
              {renderSlider("Dive Speed", "trident", "diveSpeed", 180, 1000, 20, "px/s")}
              {renderSlider("Bite Hit Radius", "trident", "diveBurstRadius", 20, 70, 5, "px")}
              {renderSlider("Dive Slow Duration", "trident", "diveSlowDuration", 300, 4000, 50, "ms")}
              {renderSlider("Dive Slow Multiplier", "trident", "diveSlowMultiplier", 0.1, 1, 0.05, "x")}
            </>
          )}
          {type === "shadow" && (
            <>
              {renderSlider("Slash Damage", "shadow", "slashDamage", 1, 20)}
              {renderSlider("Slash Range", "shadow", "slashRange", 20, 120, 5, "px")}
              {renderSlider("Slash Cooldown", "shadow", "slashCooldown", 100, 3000, 50, "ms")}
              {renderSlider("Blade Combo Range", "shadow", "comboRange", 10, 80, 5, "px")}
              {renderSlider("Combo Second Damage", "shadow", "comboSecondDamage", 1, 12)}
              {renderSlider("Summon Cooldown", "shadow", "summonCooldown", 2000, 10000, 100, "ms")}
              {renderSlider("Max Minions", "shadow", "maxMinions", 1, 3, 1)}
              {renderSlider("Minion Health", "shadow", "minionHealth", 1, 10, 1)}
              {renderSlider("Minion Damage", "shadow", "minionDamage", 1, 12)}
              {renderSlider("Minion Speed", "shadow", "minionSpeed", 20, 420, 1, "px/s")}
              {renderSlider("Minion Life", "shadow", "minionLife", 2000, 12000, 500, "ms")}
              {renderSlider("Minion Hit Cooldown", "shadow", "minionHitCooldown", 200, 2000, 50, "ms")}
              {renderSlider("Command Duration", "shadow", "commandDuration", 200, 2500, 50, "ms")}
              {renderSlider("Mark Duration", "shadow", "markDuration", 300, 3000, 50, "ms")}
              {renderSlider("Switch Cooldown", "shadow", "switchCooldown", 2000, 12000, 100, "ms")}
              {renderSlider("Switch Range", "shadow", "switchRange", 60, 240, 5, "px")}
              {renderSlider("Switch Knife Damage", "shadow", "switchDamage", 1, 12)}
            </>
          )}
          {type === "feralClaw" && (
            <>
              {renderSlider("Claw Damage", "feralClaw", "slashDamage", 1, 15)}
              {renderSlider("Claw Reach", "feralClaw", "slashRange", 10, 90, 5, "px")}
              {renderSlider("Claw Cooldown", "feralClaw", "slashCooldown", 200, 1800, 20, "ms")}
              {renderSlider("Claw Knockback", "feralClaw", "slashKnockback", 50, 600, 10)}
              {renderSlider("Claw Windup", "feralClaw", "slashWindup", 40, 250, 10, "ms")}
              {renderSlider("Claw Recoil", "feralClaw", "slashRecoil", 20, 300, 5)}
              {renderSlider("Pounce Damage", "feralClaw", "pounceDamage", 1, 25)}
              {renderSlider("Pounce Cooldown", "feralClaw", "pounceCooldown", 1500, 10000, 100, "ms")}
              {renderSlider("Pounce Speed", "feralClaw", "pounceSpeed", 300, 1000, 20, "px/s")}
              {renderSlider("Pounce Duration", "feralClaw", "pounceDuration", 200, 1000, 20, "ms")}
              {renderSlider("Rush Windup", "feralClaw", "pounceWindup", 80, 500, 10, "ms")}
              {renderSlider("Rush Overshoot", "feralClaw", "pounceOvershoot", 50, 450, 10, "ms")}
              {renderSlider("Regen Delay", "feralClaw", "regenDelay", 1000, 7000, 100, "ms")}
              {renderSlider("Regen Amount", "feralClaw", "regenAmount", 1, 5, 1)}
              {renderSlider("Regen Interval", "feralClaw", "regenInterval", 300, 2500, 50, "ms")}
              {renderSlider("Feral Threshold", "feralClaw", "lowHealthThreshold", 20, 80, 5, "HP")}
              {renderSlider("Frenzy Threshold", "feralClaw", "ultimateThreshold", 10, 60, 2, "HP")}
              {renderSlider("Frenzy Duration", "feralClaw", "ultimateDuration", 2000, 8000, 100, "ms")}
            </>
          )}
          {type === "mirror" && (
            <>
              {renderSlider("Clone Damage", "mirror", "cloneDamage", 1, 20)}
              {renderSlider("Hit Cooldown", "mirror", "hitCooldown", 150, 2000, 50, "ms")}
              {renderSlider("Clone Size", "mirror", "cloneRadiusScale", 0.4, 1.2, 0.05, "x")}
              {renderSlider("Knockback", "mirror", "knockback", 50, 800, 10)}
              {renderSlider("Switch Cooldown", "mirror", "switchCooldown", 1000, 10000, 100, "ms")}
            </>
          )}
          {type === "wrecker" && (
            <>
              {renderSlider("Brawl Cooldown", "wrecker", "cooldown", 400, 3000, 50, "ms")}
              {renderSlider("Leap Damage", "wrecker", "leapDamage", 1, 60)}
              {renderSlider("Mega Leap Damage", "wrecker", "megaLeapDamage", 1, 80)}
              {renderSlider("Shockwave Radius", "wrecker", "shockwaveRadius", 30, 180, 5, "px")}
              {renderSlider("Mega Shockwave Radius", "wrecker", "megaShockwaveRadius", 50, 250, 5, "px")}
              {renderSlider("Knockback Force", "wrecker", "knockbackForce", 100, 1200, 20)}
              {renderSlider("Rage Required", "wrecker", "rageRequired", 1, 12, 1)}
              {renderSlider("Mega Rage Required", "wrecker", "megaRageRequired", 2, 18, 1)}
              {renderSlider("Push Cooldown", "wrecker", "pushCooldown", 400, 5000, 50, "ms")}
              {renderSlider("Push Range", "wrecker", "pushRange", 10, 120, 1, "px")}
              {renderSlider("Push Force", "wrecker", "pushForce", 100, 1200, 20)}
              {renderSlider("Push Damage", "wrecker", "pushDamage", 1, 30)}
              {renderSlider("Leap Cooldown", "wrecker", "leapCooldown", 1000, 15000, 100, "ms")}
              {renderSlider("Leap Duration", "wrecker", "leapDuration", 350, 1200, 50, "ms")}
              {renderSlider("Target Lead", "wrecker", "leapLeadTime", 0, 0.9, 0.05, "s")}
              {renderSlider("Landing Recoil", "wrecker", "landingRecoil", 80, 600, 20)}
              {renderSlider("Recovery Speed", "wrecker", "recoverySpeed", 120, 420, 10, "px/s")}
              {renderSlider("Bounce Boost", "wrecker", "bounceBoost", 1, 1.5, 0.01, "x")}
              {renderSlider("Max Bounce Speed", "wrecker", "maxBounceSpeed", 220, 520, 10, "px/s")}
              {renderSlider("Size Per Rage", "wrecker", "sizePerRage", 0.005, 0.05, 0.001, "x")}
              {renderSlider("Max Rage Size", "wrecker", "maxRageSizeScale", 1, 1.5, 0.01, "x")}
              {renderSlider("Mega Size", "wrecker", "megaSizeScale", 1.05, 1.8, 0.01, "x")}
            </>
          )}
        </div>
      </div>
    );
  };
  const renderAppContent = () => {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-slate-900 pb-5">
          <div>
            <h1 className="font-extrabold tracking-tight bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent text-3xl md:text-4xl">
              Ball Weapon Simulator
            </h1>
            <p className="mt-1.5 text-xs text-sm text-slate-400">
              Customize balances, run simulations, or trigger automated tournament models in memory.
            </p>
          </div>
        </div>

        {/* Speed Controls */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-900/40 border border-slate-900 rounded-2xl px-4 py-2.5 backdrop-blur-sm justify-center md:justify-start">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Simulation Speed:</span>
          <div className="flex gap-1.5">
            {[1, 1.5, 1.75, 2].map((speed) => (
              <button
                key={speed}
                onClick={() => { setSimulationSpeed(speed); gameRef.current.simulationSpeed = speed; }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  simulationSpeed === speed
                    ? "bg-sky-500 text-slate-950 shadow-md shadow-sky-500/25"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-12">
          
          {/* Left Column: Canvas & Live Stats */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="overflow-hidden rounded-2xl border-slate-900 bg-slate-900/30 backdrop-blur-md shadow-2xl">
              <CardContent className="flex justify-center p-3 md:p-4">
                <div className="overflow-hidden rounded-xl border border-slate-900 w-full flex justify-center bg-slate-950/60">
                  <canvas ref={canvasRef} className="block max-w-full shadow-lg" />
                </div>
              </CardContent>
            </Card>

            {/* Health Bars & Match Status */}
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="rounded-2xl border-slate-900 bg-slate-900/40 backdrop-blur-sm text-slate-100 p-5 shadow-lg">
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Fighter 1</div>
                <div className="mt-1 rounded-lg bg-slate-100 px-2 py-1 text-xl font-bold text-slate-950 truncate">{gameState.leftName}</div>
                <div className="mt-2.5 flex items-center justify-between text-sm">
                  <span className="text-slate-400">HP:</span>
                  <span className="text-base font-bold text-slate-200">{gameState.leftHealth}</span>
                </div>
                <div className="w-full bg-slate-850 h-2 rounded-full mt-2 overflow-hidden border border-slate-900">
                  <div className="h-full rounded-full transition-all duration-300" style={{ width: `${clamp(gameState.leftHealth, 0, MAX_HEALTH) / MAX_HEALTH * 100}%`, backgroundColor: getHpBarColor(selectedBalls[0]) }} />
                </div>
              </Card>

              <Card className="rounded-2xl border-slate-900 bg-slate-900/40 backdrop-blur-sm text-slate-100 p-5 shadow-lg">
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Fighter 2</div>
                <div className="mt-1 rounded-lg bg-slate-100 px-2 py-1 text-xl font-bold text-slate-950 truncate">{gameState.rightName}</div>
                <div className="mt-2.5 flex items-center justify-between text-sm">
                  <span className="text-slate-400">HP:</span>
                  <span className="text-base font-bold text-slate-200">{gameState.rightHealth}</span>
                </div>
                <div className="w-full bg-slate-850 h-2 rounded-full mt-2 overflow-hidden border border-slate-900">
                  <div className="h-full rounded-full transition-all duration-300" style={{ width: `${clamp(gameState.rightHealth, 0, MAX_HEALTH) / MAX_HEALTH * 100}%`, backgroundColor: getHpBarColor(selectedBalls[1]) }} />
                </div>
              </Card>

              <Card className="rounded-2xl border-slate-900 bg-slate-900/40 backdrop-blur-sm text-slate-100 p-5 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Combat Status</div>
                  <div className="mt-1 text-lg font-bold text-sky-400">
                    {gameState.winner
                      ? `${gameState.winner} Wins!`
                      : fightIntroActive
                        ? "Intro..."
                      : gameState.running && elapsedTime < OPENING_SKILL_DELAY / 1000
                        ? `Skills in ${Math.max(1, Math.ceil(OPENING_SKILL_DELAY / 1000 - elapsedTime))}s`
                        : gameState.running
                          ? "Fighting..."
                          : "Ready to Brawl"}
                  </div>
                </div>
                <div className="mt-3 text-[10px] text-slate-500 font-medium uppercase">
                  Time: {elapsedTime.toFixed(1)}s
                </div>
              </Card>
            </div>

            {/* Combat Stats Details */}
            <Card className="rounded-2xl border-slate-900 bg-slate-900/30 backdrop-blur-sm text-slate-100 shadow-xl overflow-hidden">
              <CardContent className="p-5">
                <h3 className="text-base font-bold mb-3.5 flex items-center gap-2 text-slate-200 uppercase tracking-wider text-xs">
                  <svg className="w-4 h-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Combat Performance Stats
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead>
                      <tr className="border-b border-slate-900 text-slate-400 uppercase tracking-widest text-[10px] pb-2">
                        <th className="pb-2.5 font-bold">Metric</th>
                        <th className="pb-2.5 font-bold text-slate-950"><span className="rounded bg-slate-100 px-2 py-1">{gameState.leftName}</span></th>
                        <th className="pb-2.5 font-bold text-slate-950"><span className="rounded bg-slate-100 px-2 py-1">{gameState.rightName}</span></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900/50">
                      <tr>
                        <td className="py-2.5 font-semibold text-slate-400">Total Damage Dealt</td>
                        <td className="py-2.5 text-sm font-extrabold text-slate-200">{combatStats.left.damageDealt}</td>
                        <td className="py-2.5 text-sm font-extrabold text-slate-200">{combatStats.right.damageDealt}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-semibold text-slate-400">Total Damage Received</td>
                        <td className="py-2.5 text-sm font-bold text-rose-400">{combatStats.right.damageDealt}</td>
                        <td className="py-2.5 text-sm font-bold text-rose-400">{combatStats.left.damageDealt}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-semibold text-slate-400">Hits Landed</td>
                        <td className="py-2.5 text-slate-200">{combatStats.left.hitsLanded}</td>
                        <td className="py-2.5 text-slate-200">{combatStats.right.hitsLanded}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-semibold text-slate-400">Attacks Launched</td>
                        <td className="py-2.5 text-slate-300">{combatStats.left.totalShots || "-"}</td>
                        <td className="py-2.5 text-slate-300">{combatStats.right.totalShots || "-"}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-semibold text-slate-400">Health Gained (Healing)</td>
                        <td className="py-2.5 text-emerald-400 font-bold">{combatStats.left.healed || "-"}</td>
                        <td className="py-2.5 text-emerald-400 font-bold">{combatStats.right.healed || "-"}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-semibold text-slate-400">Projectiles Blocked</td>
                        <td className="py-2.5 text-blue-400 font-bold">{combatStats.left.blocked || "-"}</td>
                        <td className="py-2.5 text-blue-400 font-bold">{combatStats.right.blocked || "-"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Selections, Balances, & Tournament */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Selection Card */}
            <Card className="rounded-2xl border-slate-900 bg-slate-900/30 backdrop-blur-md text-slate-100 shadow-xl">
              <CardContent className="space-y-5 p-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 border-b border-slate-900 pb-2 text-center">Contestant Selector</h3>
                
                <div className="space-y-4">
                  {[0, 1].map((slot) => {
                    const selectedId = selectedBalls[slot];
                    const selectedBall = BALL_TYPES[selectedId];
                    return (
                      <div key={slot} className="space-y-2 bg-slate-950/40 p-3 rounded-xl border border-slate-900">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Slot {slot + 1} ({slot === 0 ? "Left" : "Right"})</span>
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded border text-slate-950" style={{ backgroundColor: "#f8fafc", borderColor: `${selectedBall?.color}70` }}>
                            {selectedBall?.name}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-1 pt-1">
                          {Object.values(BALL_TYPES).map((ball) => {
                            const isSelected = selectedId === ball.id;
                            return (
                              <button
                                key={ball.id}
                                type="button"
                                onClick={() => selectBall(slot, ball.id)}
                                title={`${ball.name}: ${ball.description}`}
                                className={`relative rounded-lg border py-1.5 px-0.5 text-center transition-all ${
                                  isSelected
                                    ? "border-sky-500 bg-sky-950/20 font-bold"
                                    : "border-slate-850 bg-slate-900/10 hover:bg-slate-900/40 text-slate-400 hover:text-slate-200"
                                }`}
                                style={{
                                  borderColor: isSelected ? ball.color : undefined,
                                  boxShadow: isSelected ? `0 0 8px ${ball.color}40` : undefined,
                                }}
                              >
                                <div className="text-[9px] uppercase font-bold" style={{ color: isSelected ? ball.color : undefined }}>
                                  {ball.shortName}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="grid gap-2 sm:grid-cols-2">
                  <Button onClick={startFight} className="rounded-xl py-5 text-sm font-bold bg-sky-600 hover:bg-sky-500 shadow-lg shadow-sky-500/25">
                    Launch Fight
                  </Button>
                  <Button
                    type="button"
                    onClick={launchAndRecordFight}
                    className={`rounded-xl py-5 text-sm font-bold shadow-lg ${
                      isRecording
                        ? "bg-rose-600 hover:bg-rose-500 shadow-rose-500/20"
                        : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20"
                    }`}
                  >
                    {isRecording ? "Stop Recording" : "Launch + Record HD"}
                  </Button>
                </div>
                {fightIntroActive && (
                  <Button
                    type="button"
                    onClick={skipFightIntro}
                    className="w-full rounded-xl py-3 text-xs font-bold bg-slate-700 hover:bg-slate-600 text-slate-100"
                  >
                    Skip Intro
                  </Button>
                )}
                {recordingStatus && (
                  <div className={`text-center text-[10px] font-bold uppercase tracking-wider ${isRecording ? "text-rose-400" : "text-emerald-400"}`}>
                    {recordingStatus}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Balance Settings */}
            <Card className="rounded-2xl border-slate-900 bg-slate-900/30 backdrop-blur-md text-slate-100 shadow-xl">
              <CardContent className="p-5 space-y-4 flex flex-col max-h-[500px] overflow-y-auto">
                <div className="sticky top-0 z-10 -mx-5 -mt-5 border-b border-slate-900 bg-slate-900/95 px-5 py-4 backdrop-blur">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">Balance Tuning</h3>
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button
                        type="button"
                        onClick={downloadBalanceSheet}
                        className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-sky-500"
                      >
                        Download Sheet
                      </Button>
                      <Button
                        type="button"
                        onClick={saveBalanceSettings}
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500"
                      >
                        Save Adjustments
                      </Button>
                    </div>
                  </div>
                  {balanceSaveStatus && (
                    <div className={`mt-2 text-[10px] font-bold uppercase tracking-wider ${balanceSaveStatus === "Saved" || balanceSaveStatus === "Downloaded sheet" ? "text-emerald-400" : "text-rose-400"}`}>
                      {balanceSaveStatus}
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  {renderSettingsForBall(selectedBalls[0])}
                  {selectedBalls[0] !== selectedBalls[1] && renderSettingsForBall(selectedBalls[1])}
                </div>
              </CardContent>
            </Card>

            {/* Tournament Mode Card */}
            <Card className="rounded-2xl border-slate-900 bg-slate-900/30 backdrop-blur-md text-slate-100 shadow-xl overflow-hidden">
              <CardContent className="p-5 space-y-4">
                <h3 className="text-sm font-bold flex items-center gap-2 text-slate-200 uppercase tracking-wider">
                  <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Tournament Model
                </h3>
                <p className="text-[11px] text-slate-400">
                  Run high-speed battles in memory to check fighter win-rates under the current balance configuration.
                </p>
                <div className="flex gap-2">
                  {[10, 50, 100].map((rounds) => (
                    <Button
                      key={rounds} onClick={() => runTournament(rounds)} disabled={simulatingTournament}
                      variant="outline" className="flex-1 rounded-xl text-xs py-2 bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800 hover:text-slate-100"
                    >
                      Sim {rounds}
                    </Button>
                  ))}
                </div>

                {simulatingTournament && (
                  <div className="flex items-center justify-center gap-2 py-4 text-xs text-slate-400 font-semibold border-t border-slate-900">
                    <svg className="animate-spin h-4 w-4 text-sky-400" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Running memory brawls...
                  </div>
                )}

                {tournamentResults && !simulatingTournament && (
                  <div className="space-y-3.5 pt-3.5 border-t border-slate-900">
                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1.5">
                        <span className="rounded bg-slate-100 px-2 py-1 text-slate-950">{BALL_TYPES[selectedBalls[0]]?.name} ({tournamentResults.leftWinRate}%)</span>
                        <span className="rounded bg-slate-100 px-2 py-1 text-slate-950">({tournamentResults.rightWinRate}%) {BALL_TYPES[selectedBalls[1]]?.name}</span>
                      </div>
                      <div className="w-full bg-slate-950 h-2.5 rounded-full flex overflow-hidden border border-slate-900">
                        <div className="h-full transition-all duration-500" style={{ width: `${tournamentResults.leftWinRate}%`, backgroundColor: BALL_TYPES[selectedBalls[0]]?.color }} />
                        <div className="h-full transition-all duration-500" style={{ width: `${tournamentResults.rightWinRate}%`, backgroundColor: BALL_TYPES[selectedBalls[1]]?.color }} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-950/40 rounded-xl p-3 border border-slate-900">
                      <div>
                        <span className="text-slate-400">Rounds Ran:</span>
                        <div className="font-bold text-slate-200 mt-0.5">{tournamentResults.roundsCount}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Avg Duration:</span>
                        <div className="font-bold text-slate-200 mt-0.5">{tournamentResults.avgDuration}s</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Left Avg Win HP:</span>
                        <div className="font-bold mt-0.5" style={{ color: BALL_TYPES[selectedBalls[0]]?.color }}>{tournamentResults.leftAvgHp} HP</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Right Avg Win HP:</span>
                        <div className="font-bold mt-0.5" style={{ color: BALL_TYPES[selectedBalls[1]]?.color }}>{tournamentResults.rightAvgHp} HP</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>

        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-[1600px] space-y-6">
        {renderAppContent()}
      </div>
    </div>
  );
}
