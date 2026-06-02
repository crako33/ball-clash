import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSoundEngine } from "./useSoundEngine";

const BALL_TYPES = {
  knife: {
    id: "knife",
    name: "Knifer Ball",
    shortName: "KNIFR",
    color: "#38bdf8",
    stroke: "#bae6fd",
    radius: 30,
    description: "Rotating knife brawler. Secondary: Blade Throw.",
  },
  spike: {
    id: "spike",
    name: "Spiker Ball",
    shortName: "SPIKR",
    color: "#fb7185",
    stroke: "#fecdd3",
    radius: 31,
    description: "Spiked brawler. Spikes damage enemies on contact.",
  },
  gun: {
    id: "gun",
    name: "Gunner Ball",
    shortName: "GUNR",
    color: "#0f172a",
    stroke: "#f1f5f9",
    radius: 30,
    description: "Skull brawler. Fires 6 shots, then reloads. Secondary: Dash.",
  },
  vampire: {
    id: "vampire",
    name: "Vampirer Ball",
    shortName: "VAMP",
    color: "#f87171",
    stroke: "#fee2e2",
    radius: 30,
    description: "Vampiric brawler. HP drain on latch.",
  },
  bomb: {
    id: "bomb",
    name: "Grenader Ball",
    shortName: "GREN",
    color: "#64748b",
    stroke: "#cbd5e1",
    radius: 29,
    description: "Throws bombs that explode and knock back enemies.",
  },
  laser: {
    id: "laser",
    name: "Laser Ball",
    shortName: "LASR",
    color: "#ef4444",
    stroke: "#facc15",
    radius: 30,
    description: "Fires continuous laser. Secondary: Sweep Laser.",
  },
  shield: {
    id: "shield",
    name: "Shielder Ball",
    shortName: "SHLD",
    color: "#3b82f6",
    stroke: "#ef4444",
    radius: 32,
    description: "Throws star-spangled shield. Secondary: Bash & Emergency Recall.",
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
  bomber: {
    id: "bomber",
    name: "Bomber Ball",
    shortName: "MINE",
    color: "#facc15",
    stroke: "#78350f",
    radius: 29,
    description: "Lays up to 3 proximity landmines.",
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
    name: "Hammerer Ball",
    shortName: "HAMR",
    color: "#cbd5e1",
    stroke: "#64748b",
    radius: 30,
    description: "Spins hammer then launches itself rocket-like.",
  },
  wallSpike: {
    id: "wallSpike",
    name: "Wall Spiker Ball",
    shortName: "WSPK",
    color: "#ea580c",
    stroke: "#ffedd5",
    radius: 30,
    description: "Spawns spikes on arena walls.",
  },
  stringWeb: {
    id: "stringWeb",
    name: "String Weber Ball",
    shortName: "WEB",
    color: "#d946ef",
    stroke: "#fdf4ff",
    radius: 30,
    description: "Creates laser string nets.",
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
};

const GRID_SIZE = 7;
const TILE_SIZE = 64;
const ARENA_SIZE = GRID_SIZE * TILE_SIZE;
const MIN_DAMAGE = 1;
const SHIELD_GUARD_HITS = 5;
const SHIELD_PICKUP_RADIUS = 30;
const SHIELD_DROP_COOLDOWN = 1000;
const HYDRA_MAX_GLOW_STACKS = 3;
const HYDRA_RAGE_PER_BOUNCE = 1;
const SPIDER_FINAL_BOUNCE_MULTIPLIER = 1.8;
const ARM_RAGDOLL_WALL_DAMAGE = 7;
const ARM_THROW_WALL_DAMAGE = 10;
const CHESS_CROWN_HITBOX_MULTIPLIER = 1.5;
const BOUNCE_SPEED_MULTIPLIER = 1;

const BALANCE = {
  knife: { damage: 2, cooldown: 390, bladeLength: 60, spinSpeed: 0.09, secCooldown: 3500, secDamage: 5 },
  spike: { collisionDamage: 10, touchDamage: 10, cooldown: 380, spikeReach: 11 },
  gun: { bulletDamage: 1, bulletSpeed: 420, shotCooldown: 520, reloadTime: 1900, bulletLife: 1.55, secCooldown: 4000, secDashForce: 380 },
  vampire: { drainPerTick: 1, healPerTick: 1, tickCooldown: 250, latchDuration: 1000, latchCooldown: 3000, latchDistance: 10 },
  bomb: { damage: 10, fuseTime: 1200, radius: 65, cooldown: 1800, throwSpeed: 250, knockback: 18 },
  laser: { damagePerTick: 1, tickCooldown: 100, chargeTime: 1000, fireDuration: 800, cooldown: 2500, beamWidth: 16, secCooldown: 4000, secDamage: 5 },
  shield: { damage: 2, arcWidth: 1.57, knockback: 14, cooldown: 1000, shieldSpeed: 550, returnSpeed: 650, duration: 1200, secCooldownHeld: 3000, secCooldownThrown: 4000, secBashDamage: 4 },
  spider: { fangDamage: 2, webSpeed: 600, pullSpeed: 620, bounceSpeed: 260, pullDuration: 900, cooldown: 3000, secCooldown: 5000, secPoolRadius: 35, secDamage: 3 },
  bomber: { mineDamage: 10, mineRadius: 70, mineTriggerDist: 15, cooldown: 2200, maxMines: 3, knockback: 16 },
  spore: { cactusDamage: 2, growthDuration: 1000, speedBoost: 1.5, cactusLife: 3000, cooldown: 6000 },
  hammer: { spinDamage: 4, launchDamage: 10, spinSpeed: 0.05, chargeDuration: 900, launchSpeed: 580, launchDuration: 580, cooldown: 1500 },
  wallSpike: { spikeDamage: 2, spikeLifetime: 8000, maxSpikes: 8 },
  stringWeb: { stringDamage: 2, stringLifetime: 6000, maxStrings: 10 },
  arm: { slamDamage: 2, grabRange: 100, grabDuration: 1200, swingSpeed: 0.07, cooldown: 6000, secCooldown: 5000, secSlamDamage: 6 },
  chess: { cooldown: 6000, centerSpeed: 230, crownDuration: 2500, damage: 7, tickCooldown: 400 },
};

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
  const { playSound, toggleMute, isMuted } = useSoundEngine();
  const [mutedState, setMutedState] = useState(false);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [selectedBalls, setSelectedBalls] = useState(["knife", "spike"]);
  const [gameStarted, setGameStarted] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1.5);
  const [balanceSettings, setBalanceSettings] = useState(BALANCE);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const [gameState, setGameState] = useState({
    leftHealth: 100,
    rightHealth: 100,
    leftName: "Knife Ball",
    rightName: "Spike Ball",
    winner: null,
    running: false,
  });

  const [combatStats, setCombatStats] = useState({
    left: { damageDealt: 0, hitsLanded: 0, totalShots: 0, healed: 0, blocked: 0 },
    right: { damageDealt: 0, hitsLanded: 0, totalShots: 0, healed: 0, blocked: 0 },
  });

  const [tournamentResults, setTournamentResults] = useState(null);
  const [simulatingTournament, setSimulatingTournament] = useState(false);
  const [viewMode, setViewMode] = useState("desktop");

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
      mass: type === "shield" ? 1.5 : 1,
      health: 100,
      angle: side === "left" ? 0 : Math.PI,
      spinAngle: 0,
      ammo: type === "gun" ? 6 : null,
      maxAmmo: type === "gun" ? 6 : null,
      reloadUntil: 0,
      nextShotAt: 0,
      flashUntil: 0,
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
      shieldAngle: side === "left" ? 0 : Math.PI,
      shieldState: "held", shieldX: 0, shieldY: 0, shieldVx: 0, shieldVy: 0, shieldThrownUntil: 0, shieldNextHitAt: 0, nextThrowAt: 0, shieldSpinAngle: 0, shieldGuardHits: 0, shieldBonusDamage: 0,
      // Spider Specific
      webState: "idle", webX: 0, webY: 0, webVx: 0, webVy: 0, webStateUntil: 0, webTargetId: null, webBouncesLeft: 0, webLastTargetX: 0, webLastTargetY: 0, fangFlashUntil: 0,
      // Vampire Specific
      hasStuck: false,
      // Spore Specific
      nextSporeAt: 0, hydraGlowStacks: 0,
      // Hammer Specific
      hammerState: "spinning", hammerAngle: 0, hammerStateUntil: 0, hammerNextHitAt: 0, hammerLaunchAngle: 0,
      // Arm Specific
      armState: "idle", armStateUntil: 0, armAngle: 0, armBaseAngle: 0, armDirection: 1, armThrowWallUntil: 0, armThrowWallSourceId: null, armGrabDamageHits: 0,
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
    venomPools: [],
    screenShake: 0,
    simulationSpeed: 1.5,
    balance: BALANCE,
    balls: [makeBall("knife", "left", 20), makeBall("spike", "right", 20)],
    stats: {
      left: { damageDealt: 0, hitsLanded: 0, totalShots: 0, healed: 0, blocked: 0 },
      right: { damageDealt: 0, hitsLanded: 0, totalShots: 0, healed: 0, blocked: 0 }
    }
  });

  const selectBall = (slot, type) => {
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
    gameRef.current.venomPools = [];
    gameRef.current.portals = [];
    gameRef.current.portalProjectiles = [];
  };

  const startFight = () => {
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
      venomPools: [],
      screenShake: 0,
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
    setGameState({
      leftHealth: 100,
      rightHealth: 100,
      leftName: balls[0].name,
      rightName: balls[1].name,
      winner: null,
      running: true,
    });
    setElapsedTime(0);
    setGameStarted(true);
    playSound("gunReload");
  };

  const resetToSelection = () => {
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
    gameRef.current.venomPools = [];
  };

  const resetFight = () => {
    startFight();
  };

  const updateBalanceSetting = (type, key, val) => {
    setBalanceSettings((prev) => {
      const next = { ...prev, [type]: { ...prev[type], [key]: val } };
      gameRef.current.balance = next;
      return next;
    });
  };

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
            
            const isLatchedTarget = balls.some(b => b.type === "vampire" && b.latchedTo === ball.id && b.latchUntil > simTime);
            const isLatchedSelf = ball.type === "vampire" && ball.latchedTo && ball.latchUntil > simTime;
            const isArmGrabbed = balls.some(b => b.type === "arm" && b.armState === "grabbing" && b.armStateUntil > simTime && b.id !== ball.id);
            let slowMult = (isLatchedTarget || isLatchedSelf) ? 0.4 : 1.0;
            const insideWeb = localVenomPools.some((pool) => {
              if (ball.side === pool.ownerSide) return false;
              const dist = Math.hypot(ball.x - pool.x, ball.y - pool.y);
              return dist < ball.r + pool.r;
            });
            if (insideWeb) slowMult *= 0.6;

            if (isChessCrownActive(ball) || (!isPulling && !isLatchedSelf && !isChargingHammer && !isArmGrabbed)) {
              ball.x += ball.vx * dt * slowMult;
              ball.y += ball.vy * dt * slowMult;
              const pad = 18;
              let bounced = false, bx = ball.x, by = ball.y, sideHit = null;
              if (ball.x - ball.r < pad) { ball.x = pad + ball.r; ball.vx = Math.abs(ball.vx); bounced = true; bx = pad; sideHit = "left"; }
              if (ball.x + ball.r > ARENA_SIZE - pad) { ball.x = ARENA_SIZE - pad - ball.r; ball.vx = -Math.abs(ball.vx); bounced = true; bx = ARENA_SIZE - pad; sideHit = "right"; }
              if (ball.y - ball.r < pad) { ball.y = pad + ball.r; ball.vy = Math.abs(ball.vy); bounced = true; by = pad; sideHit = "top"; }
              if (ball.y + ball.r > ARENA_SIZE - pad) { ball.y = ARENA_SIZE - pad - ball.r; ball.vy = -Math.abs(ball.vy); bounced = true; by = ARENA_SIZE - pad; sideHit = "bottom"; }
              
              if (bounced && simTime >= 3000) {
                if (ball.type === "wallSpike") {
                  const newSpike = {
                    x: bx, y: by, side: sideHit, ownerSide: ball.side, createdTime: simTime,
                    life: balance.wallSpike.spikeLifetime, charges: 1
                  };
                  localWallSpikes.push(newSpike);
                }
                if (ball.type === "stringWeb") {
                  if (ball.lastBounceX !== undefined && ball.lastBounceX !== null) {
                    const newString = {
                      x1: ball.lastBounceX, y1: ball.lastBounceY, x2: bx, y2: by, ownerSide: ball.side, createdTime: simTime,
                      life: Infinity
                    };
                    localStrings.push(newString);
                  }
                  ball.lastBounceX = bx;
                  ball.lastBounceY = by;
                }
              }
            }

            const baseSpeed = 220, currentSpeed = Math.hypot(ball.vx, ball.vy);
            if (currentSpeed > baseSpeed) {
              const newSpeed = baseSpeed + (currentSpeed - baseSpeed) * 0.95;
              ball.vx = (ball.vx / currentSpeed) * newSpeed;
              ball.vy = (ball.vy / currentSpeed) * newSpeed;
            } else if (currentSpeed < baseSpeed * 0.7 && currentSpeed > 10) {
              const newSpeed = baseSpeed * 0.7 + (currentSpeed - baseSpeed * 0.7) * 0.98;
              ball.vx = (ball.vx / currentSpeed) * newSpeed;
              ball.vy = (ball.vy / currentSpeed) * newSpeed;
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
              if (damageCooldowns[cooldownKey] > simTime) return;
              let finalAmount = Math.max(MIN_DAMAGE, Math.round(amount));
              defender.health = Math.max(0, defender.health - finalAmount);
              damageCooldowns[cooldownKey] = simTime + cd;
            };

          if (collided) {
            if (leftBall.type === "spike") localApplyDamage(rightBall, balance.spike.collisionDamage, `${leftBall.id}-spike-hit`, balance.spike.cooldown);
            if (rightBall.type === "spike") localApplyDamage(leftBall, balance.spike.collisionDamage, `${rightBall.id}-spike-hit`, balance.spike.cooldown);
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
                  enemy.vx += Math.cos(angle) * balance.shield.knockback * 15;
                  enemy.vy += Math.sin(angle) * balance.shield.knockback * 15;
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
            if (simTime >= 3000) {
              if (ball.type === "knife") {
                const bal = balance.knife;
                if (!ball.knifeBladeState) ball.knifeBladeState = "rotating";
                
                if (ball.knifeBladeState === "rotating") {
                  ball.spinAngle += bal.spinSpeed;
                  const tip = {
                    x: ball.x + Math.cos(ball.spinAngle) * (ball.r + bal.bladeLength),
                    y: ball.y + Math.sin(ball.spinAngle) * (ball.r + bal.bladeLength),
                  };
                  if (Math.hypot(tip.x - enemy.x, tip.y - enemy.y) < enemy.r + 14) {
                    localApplyDamage(enemy, bal.damage, `${ball.id}-knife-hit`, bal.cooldown);
                  }
                  
                  const dist = Math.hypot(enemy.x - ball.x, enemy.y - ball.y);
                  if (dist >= 120 && dist <= 240 && simTime >= (ball.nextSecondaryAt || 0)) {
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
              if (ball.type === "spike" && Math.hypot(ball.x - enemy.x, ball.y - enemy.y) < ball.r + enemy.r + balance.spike.spikeReach) {
                localApplyDamage(enemy, balance.spike.touchDamage, `${ball.id}-spike-touch`, balance.spike.cooldown);
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
                    localBullets.push({
                      ownerId: ball.id, targetSide: enemy.side,
                      x: ball.x + Math.cos(ball.angle) * (ball.r + 26),
                      y: ball.y + Math.sin(ball.angle) * (ball.r + 26),
                      vx: Math.cos(ball.angle) * balance.gun.bulletSpeed,
                      vy: Math.sin(ball.angle) * balance.gun.bulletSpeed,
                      r: 5, damage: balance.gun.bulletDamage, life: balance.gun.bulletLife
                    });
                    ball.ammo--;
                    ball.nextShotAt = simTime + balance.gun.shotCooldown;
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
                  enemy.vx = -Math.cos(pushAngle) * pushForce;
                  enemy.vy = -Math.sin(pushAngle) * pushForce;
                }
                const dist = Math.hypot(ball.x - enemy.x, ball.y - enemy.y);
                const latchLimit = ball.r + enemy.r + balance.vampire.latchDistance;
                if (dist >= latchLimit) {
                  ball.hasStuck = false;
                }
                if (dist < latchLimit && !ball.hasStuck) {
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
                  enemy.health = Math.max(0, enemy.health - Math.max(MIN_DAMAGE, balance.vampire.drainPerTick));
                  ball.health = Math.min(100, ball.health + balance.vampire.healPerTick);
                  ball.nextDrainAt = simTime + balance.vampire.tickCooldown;
                }
              }
            }
            if (ball.type === "bomb" && ball.nextBombAt <= simTime) {
              const angle = Math.atan2(enemy.y - ball.y, enemy.x - ball.x);
              localBombs.push({
                ownerId: ball.id, targetSide: enemy.side,
                x: ball.x + Math.cos(angle) * (ball.r + 15),
                y: ball.y + Math.sin(angle) * (ball.r + 15),
                vx: Math.cos(angle) * balance.bomb.throwSpeed + ball.vx * 0.3,
                vy: Math.sin(angle) * balance.bomb.throwSpeed + ball.vy * 0.3,
                r: 10, fuseUntil: simTime + balance.bomb.fuseTime,
              });
              ball.nextBombAt = simTime + balance.bomb.cooldown;
            }
            if (ball.type === "laser") {
              const dist = Math.hypot(enemy.x - ball.x, enemy.y - ball.y);
              if (ball.laserSweepState === "idle" && simTime >= (ball.nextSecondaryAt || 0) && dist < 250) {
                ball.laserSweepState = "sweeping";
                ball.laserSweepStateUntil = simTime + 400;
                const angleToEnemy = Math.atan2(enemy.y - ball.y, enemy.x - ball.x);
                ball.laserSweepStartAngle = angleToEnemy - Math.PI / 6;
                ball.laserSweepEndAngle = angleToEnemy + Math.PI / 6;
                ball.laserSweepHitDone = false;
                ball.nextSecondaryAt = simTime + balance.laser.secCooldown;
              }

              if (ball.laserSweepState === "sweeping") {
                const progress = Math.min(1, Math.max(0, (simTime - (ball.laserSweepStateUntil - 400)) / 400));
                ball.laserSweepAngle = ball.laserSweepStartAngle + (ball.laserSweepEndAngle - ball.laserSweepStartAngle) * progress;
                
                const sx = ball.x + Math.cos(ball.laserSweepAngle) * ball.r;
                const sy = ball.y + Math.sin(ball.laserSweepAngle) * ball.r;
                const ex = ball.x + Math.cos(ball.laserSweepAngle) * 300;
                const ey = ball.y + Math.sin(ball.laserSweepAngle) * 300;
                
                const dSeg = linePointDist(enemy.x, enemy.y, sx, sy, ex, ey);
                if (dSeg < enemy.r + balance.laser.beamWidth / 2 && !ball.laserSweepHitDone) {
                  ball.laserSweepHitDone = true;
                  localApplyDamage(enemy, balance.laser.secDamage, `${ball.id}-laser-sec`, 9999999);
                }
                
                if (simTime >= ball.laserSweepStateUntil) {
                  ball.laserSweepState = "idle";
                }
              }

              if (ball.laserState === "idle" && ball.nextShotAt <= simTime) {
                ball.laserState = "charging"; ball.laserStateUntil = simTime + balance.laser.chargeTime;
                ball.laserTargetAngle = Math.atan2(enemy.y - ball.y, enemy.x - ball.x);
              } else if (ball.laserState === "charging") {
                const targetAngle = Math.atan2(enemy.y - ball.y, enemy.x - ball.x);
                ball.laserTargetAngle = targetAngle;
                if (simTime >= ball.laserStateUntil) {
                  ball.laserState = "firing"; ball.laserStateUntil = simTime + balance.laser.fireDuration;
                  ball.laserNextTickAt = simTime;
                }
              } else if (ball.laserState === "firing") {
                const targetAngle = Math.atan2(enemy.y - ball.y, enemy.x - ball.x);
                ball.laserTargetAngle = targetAngle;
                const mX = ball.x + Math.cos(ball.laserTargetAngle) * ball.r;
                const mY = ball.y + Math.sin(ball.laserTargetAngle) * ball.r;
                const eX = mX + Math.cos(ball.laserTargetAngle) * 1500;
                const eY = mY + Math.sin(ball.laserTargetAngle) * 1500;
                const d = linePointDist(enemy.x, enemy.y, mX, mY, eX, eY);
                if (d < enemy.r + balance.laser.beamWidth / 2 && simTime >= ball.laserNextTickAt) {
                  if (isChessCrownActive(enemy)) return;
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
                  enemy.vx += Math.cos(pushAngle) * balance.shield.knockback * 15;
                  enemy.vy += Math.sin(pushAngle) * balance.shield.knockback * 15;
                  ball.shieldBashUntil = 0;
                }
              }

              if (ball.shieldState === "held") {
                ball.shieldAngle = Math.atan2(enemy.y - ball.y, enemy.x - ball.x);
                
                const dist = Math.hypot(enemy.x - ball.x, enemy.y - ball.y);
                if (dist < 85 && simTime >= (ball.nextSecondaryAt || 0)) {
                  ball.nextSecondaryAt = simTime + balance.shield.secCooldownHeld;
                  ball.shieldBashUntil = simTime + 250;
                  const bashAngle = Math.atan2(enemy.y - ball.y, enemy.x - ball.x);
                  ball.vx = Math.cos(bashAngle) * 480;
                  ball.vy = Math.sin(bashAngle) * 480;
                } else if (ball.nextThrowAt <= simTime) {
                  ball.shieldState = "thrown";
                  ball.shieldGuardHits = 0;
                  ball.shieldBonusDamage = 0;
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
                  ball.shieldFastRecall = false;
                  ball.nextThrowAt = simTime + balance.shield.cooldown;
                }
              } else {
                const distToEnemy = Math.hypot(enemy.x - ball.x, enemy.y - ball.y);
                if (distToEnemy < 100 && simTime >= (ball.nextSecondaryAt || 0)) {
                  ball.nextSecondaryAt = simTime + balance.shield.secCooldownThrown;
                  ball.shieldState = "returning";
                  ball.shieldFastRecall = true;
                }

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
                    enemy.vx += Math.cos(knockAngle) * balance.shield.knockback * 12;
                    enemy.vy += Math.sin(knockAngle) * balance.shield.knockback * 12;
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
                  const mult = ball.shieldFastRecall ? 1.5 : 1.0;
                  ball.shieldVx = Math.cos(returnAngle) * balance.shield.returnSpeed * mult;
                  ball.shieldVy = Math.sin(returnAngle) * balance.shield.returnSpeed * mult;
                  const distToOwner = Math.hypot(ball.x - ball.shieldX, ball.y - ball.shieldY);
                  if (distToOwner < ball.r + 10) {
                    ball.shieldState = "held";
                    ball.shieldGuardHits = 0;
                    ball.shieldBonusDamage = 0;
                    ball.shieldFastRecall = false;
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

              if (ball.webState === "idle" && ball.nextShotAt <= simTime) {
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
                  ball.webState = "pulling";
                  ball.webTargetId = enemy.id;
                  ball.webBouncesLeft = 3;
                  ball.webLastTargetX = enemy.x;
                  ball.webLastTargetY = enemy.y;
                  ball.webStateUntil = simTime + balance.spider.pullDuration;
                }
              } else if (ball.webState === "pulling") {
                if (simTime >= ball.webStateUntil) {
                  ball.webState = "idle";
                  ball.webTargetId = null;
                  ball.webBouncesLeft = 0;
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
            // Bomber Ball Physics in Tournament
            if (ball.type === "bomber" && ball.nextShotAt <= simTime) {
              const rx = clamp(ball.x + (Math.random() - 0.5) * 120, 50, ARENA_SIZE - 50);
              const ry = clamp(ball.y + (Math.random() - 0.5) * 120, 50, ARENA_SIZE - 50);
              const activeMines = localMines.filter(m => m.ownerId === ball.id);
              if (activeMines.length >= balance.bomber.maxMines) {
                activeMines[0].triggerTime = simTime;
              }
              localMines.push({
                ownerId: ball.id, ownerSide: ball.side, x: rx, y: ry, r: 10, triggerRadius: 45, triggerTime: null
              });
              ball.nextShotAt = simTime + balance.bomber.cooldown;
            }

            // Arm Ball Physics in Tournament
            if (ball.type === "arm") {
              const grabRange = balance.arm.grabRange;
              if (ball.armState === "elbow_dropping") {
                ball.x += (enemy.x - ball.x) * 0.18;
                ball.y += (enemy.y - ball.y) * 0.18;
                enemy.x = ball.x;
                enemy.y = ball.y;
                enemy.vx = 0; enemy.vy = 0;
                if (simTime >= ball.armStateUntil) {
                  ball.armState = "idle";
                  localApplyDamage(enemy, balance.arm.secSlamDamage, `${ball.id}-elbow-slam`, 500);
                  const launchAngle = Math.random() * Math.PI * 2;
                  const launchForce = 650;
                  enemy.vx = Math.cos(launchAngle) * launchForce;
                  enemy.vy = Math.sin(launchAngle) * launchForce;
                }
              } else if (ball.armState === "idle") {
                ball.armAngle = (ball.armAngle || 0) + balance.arm.swingSpeed;
                
                // Leap Lunge Trigger
                const targetAngle = Math.atan2(enemy.y - ball.y, enemy.x - ball.x);
                const targetDist = Math.hypot(enemy.x - ball.x, enemy.y - ball.y);
                if (targetDist > 220 && simTime >= (ball.nextSecondaryAt || 0)) {
                  ball.nextSecondaryAt = simTime + balance.arm.secCooldown;
                  ball.vx += Math.cos(targetAngle) * 450;
                  ball.vy += Math.sin(targetAngle) * 450;
                }
                
                if (ball.nextShotAt <= simTime) {
                  const handX = ball.x + Math.cos(ball.armAngle) * grabRange;
                  const handY = ball.y + Math.sin(ball.armAngle) * grabRange;
                  const dist = Math.hypot(handX - enemy.x, handY - enemy.y);
                  if (dist < enemy.r + 22) {
                    ball.armState = "grabbing";
                    ball.armStateUntil = simTime + balance.arm.grabDuration;
                    ball.armGrabDamageHits = 0;
                    
                    const pad = 18;
                    const distLeft = ball.x - pad;
                    const distRight = ARENA_SIZE - pad - ball.x;
                    const distTop = ball.y - pad;
                    const distBottom = ARENA_SIZE - pad - ball.y;
                    
                    let wallAngle = 0;
                    const minDist = Math.min(distLeft, distRight, distTop, distBottom);
                    if (minDist === distLeft) {
                      wallAngle = Math.PI;
                    } else if (minDist === distRight) {
                      wallAngle = 0;
                    } else if (minDist === distTop) {
                      wallAngle = -Math.PI / 2;
                    } else {
                      wallAngle = Math.PI / 2;
                    }
                    ball.armBaseAngle = wallAngle;
                    
                    ball.armDirection = 1;
                    ball.nextShotAt = simTime + balance.arm.cooldown;
                  }
                }
              } else if (ball.armState === "grabbing") {
                const elapsed = simTime - (ball.armStateUntil - balance.arm.grabDuration);
                
                // Elbow Drop Trigger
                if (elapsed >= 500 && simTime >= (ball.nextSecondaryAt || 0)) {
                  ball.nextSecondaryAt = simTime + balance.arm.secCooldown;
                  ball.armState = "elbow_dropping";
                  ball.armStateUntil = simTime + 400;
                } else {
                  const swayAngle = Math.sin(elapsed * 0.012) * 1.3;
                  ball.armAngle = ball.armBaseAngle + swayAngle;
                  
                  const handX = ball.x + Math.cos(ball.armAngle) * grabRange;
                  const handY = ball.y + Math.sin(ball.armAngle) * grabRange;
                  
                  const pad = 18;
                  const targetX = clamp(handX, pad + enemy.r, ARENA_SIZE - pad - enemy.r);
                  const targetY = clamp(handY, pad + enemy.r, ARENA_SIZE - pad - enemy.r);
                  
                  enemy.x = targetX;
                  enemy.y = targetY;
                  enemy.vx = 0; enemy.vy = 0;
                  
                  const corners = [
                    { x: pad + enemy.r, y: pad + enemy.r },
                    { x: ARENA_SIZE - pad - enemy.r, y: pad + enemy.r },
                    { x: pad + enemy.r, y: ARENA_SIZE - pad - enemy.r },
                    { x: ARENA_SIZE - pad - enemy.r, y: ARENA_SIZE - pad - enemy.r }
                  ];
                  const isNearCorner = corners.some(c => Math.hypot(enemy.x - c.x, enemy.y - c.y) < 32);
                  const damageKey = `${ball.id}-arm-corner`;
                  if (isNearCorner && (ball.armGrabDamageHits || 0) < 2 && (!damageCooldowns[damageKey] || damageCooldowns[damageKey] <= simTime)) {
                    localApplyDamage(enemy, balance.arm.slamDamage, damageKey, 500);
                    ball.armGrabDamageHits = (ball.armGrabDamageHits || 0) + 1;
                  }
                  
                  if (simTime >= ball.armStateUntil) {
                    ball.armState = "idle";
                    const swingDirSign = Math.cos(elapsed * 0.012) >= 0 ? 1 : -1;
                    const launchAngle = ball.armAngle + (Math.PI / 2) * swingDirSign;
                    const launchForce = 520;
                    enemy.vx = Math.cos(launchAngle) * launchForce;
                    enemy.vy = Math.sin(launchAngle) * launchForce;
                  }
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
                if (ball.hammerAngle >= 10 * Math.PI) {
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
                    enemy.vx += Math.cos(ball.hammerLaunchAngle) * 600;
                    enemy.vy += Math.sin(ball.hammerLaunchAngle) * 600;
                    ball.hammerNextHitAt = simTime + balance.hammer.launchDuration;
                  }
                }
                if (simTime >= ball.hammerStateUntil) {
                  ball.hammerState = "spinning";
                  ball.hammerAngle = 0;
                }
              }
            }
          }
          });

          localBullets = localBullets.filter((bullet) => {
            bullet.x += bullet.vx * dt; bullet.y += bullet.vy * dt; bullet.life -= dt;
            if (bullet.x < 18 || bullet.x > ARENA_SIZE - 18 || bullet.y < 18 || bullet.y > ARENA_SIZE - 18 || bullet.life <= 0) return false;
            
            const shieldBall = bullet.targetSide === "left" ? leftBall : rightBall;
            if (shieldBall.type === "shield") {
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
              target.health = Math.max(0, target.health - bullet.damage);
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
                    const falloff = 1 - (db / (balance.bomber.mineRadius + ball.r));
                    ball.health = Math.max(0, ball.health - Math.max(MIN_DAMAGE, Math.round(balance.bomber.mineDamage * falloff)));
                    const angle = Math.atan2(ball.y - mine.y, ball.x - mine.x);
                    const force = balance.bomber.knockback * 25 * falloff;
                    ball.vx += Math.cos(angle) * force; ball.vy += Math.sin(angle) * force;
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

          localBombs = localBombs.filter((bomb) => {
            bomb.x += bomb.vx * dt; bomb.y += bomb.vy * dt;
            const p = 18;
            if (bomb.x - bomb.r < p) { bomb.x = p + bomb.r; bomb.vx = Math.abs(bomb.vx) * 0.8; }
            if (bomb.x + bomb.r > ARENA_SIZE - p) { bomb.x = ARENA_SIZE - p - bomb.r; bomb.vx = -Math.abs(bomb.vx) * 0.8; }
            if (bomb.y - bomb.r < p) { bomb.y = p + bomb.r; bomb.vy = Math.abs(bomb.vy) * 0.8; }
            if (bomb.y + bomb.r > ARENA_SIZE - p) { bomb.y = ARENA_SIZE - p - bomb.r; bomb.vy = -Math.abs(bomb.vy) * 0.8; }
            
            const target = bomb.targetSide === "left" ? leftBall : rightBall;
            const dist = Math.hypot(bomb.x - target.x, bomb.y - target.y);
            if (simTime >= bomb.fuseUntil || dist < target.r + bomb.r) {
              balls.forEach(ball => {
                const db = Math.hypot(ball.x - bomb.x, ball.y - bomb.y);
                if (db < balance.bomb.radius + ball.r) {
                  if (isChessCrownActive(ball)) return;
                  const falloff = 1 - (db / (balance.bomb.radius + ball.r));
                  ball.health = Math.max(0, ball.health - Math.max(MIN_DAMAGE, Math.round(balance.bomb.damage * falloff)));
                  const angle = Math.atan2(ball.y - bomb.y, ball.x - bomb.x);
                  const force = balance.bomb.knockback * 25 * falloff;
                  ball.vx += Math.cos(angle) * force; ball.vy += Math.sin(angle) * force;
                }
              });
              return false;
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

          localWallSpikes = localWallSpikes.filter((spike) => {
            balls.forEach((ball) => {
              if (ball.side === spike.ownerSide) return;

              let hit = false;
              const pad = 18;
              const spikeHeight = 15;
              const spikeWidth = 16;

              if (spike.side === "left") {
                if (ball.x - ball.r < pad + spikeHeight && ball.x + ball.r > pad) {
                  if (Math.abs(ball.y - spike.y) < ball.r + spikeWidth / 2) {
                    hit = true;
                  }
                }
              } else if (spike.side === "right") {
                const xLimit = ARENA_SIZE - pad - spikeHeight;
                if (ball.x + ball.r > xLimit && ball.x - ball.r < ARENA_SIZE - pad) {
                  if (Math.abs(ball.y - spike.y) < ball.r + spikeWidth / 2) {
                    hit = true;
                  }
                }
              } else if (spike.side === "top") {
                if (ball.y - ball.r < pad + spikeHeight && ball.y + ball.r > pad) {
                  if (Math.abs(ball.x - spike.x) < ball.r + spikeWidth / 2) {
                    hit = true;
                  }
                }
              } else if (spike.side === "bottom") {
                const yLimit = ARENA_SIZE - pad - spikeHeight;
                if (ball.y + ball.r > yLimit && ball.y - ball.r < ARENA_SIZE - pad) {
                  if (Math.abs(ball.x - spike.x) < ball.r + spikeWidth / 2) {
                    hit = true;
                  }
                }
              }

              if (hit) {
                localApplyDamage(ball, balance.wallSpike.spikeDamage, `${ball.id}-wallspike-${spike.createdTime}`, 500);
              }
            });

            return true;
          });

          localStrings = localStrings.filter((str) => {
            balls.forEach((ball) => {
              if (ball.side === str.ownerSide) return;

              const dist = linePointDist(ball.x, ball.y, str.x1, str.y1, str.x2, str.y2);
              if (dist < ball.r) {
                if (!str.damagedIds) str.damagedIds = {};
                if (str.damagedIds[ball.id]) return;
                str.damagedIds[ball.id] = true;
                localApplyDamage(ball, balance.stringWeb.stringDamage, `${ball.id}-string-${str.createdTime}`, 9999999);
              }
            });

            return true;
          });

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
      const maxDisplaySize = viewMode === "desktop" ? 650 : ARENA_SIZE;
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
      if (isChessCrownActive(defender) && !cooldownKey.includes("chess-attack")) return;
      if (game.damageCooldowns[cooldownKey] > currentTime) return;
      
      let finalAmount = Math.max(MIN_DAMAGE, Math.round(amount));

      defender.health = clamp(defender.health - finalAmount, 0, 100);
      game.damageCooldowns[cooldownKey] = currentTime + cooldown;

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
      const keyLower = cooldownKey.toLowerCase();
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

    const spawnSparks = (x, y, color, count = 8) => {
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2, spd = 60 + Math.random() * 120;
        game.particles.push({
          x, y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
          color, radius: 1.5 + Math.random() * 2, life: 0.2 + Math.random() * 0.2, maxLife: 0.4
        });
      }
    };

    const spawnDust = (x, y, count = 4) => {
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2, spd = 20 + Math.random() * 40;
        game.particles.push({
          x, y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
          color: "rgba(226, 232, 240, 0.4)", radius: 2 + Math.random() * 2, life: 0.3 + Math.random() * 0.3, maxLife: 0.6
        });
      }
    };

    const spawnShieldSparks = (x, y, shieldAngle) => {
      for (let i = 0; i < 8; i++) {
        const a = shieldAngle + Math.PI + (Math.random() - 0.5) * 1.2, spd = 80 + Math.random() * 150;
        game.particles.push({
          x, y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
          color: "#60a5fa", radius: 2 + Math.random() * 1.5, life: 0.25 + Math.random() * 0.15, maxLife: 0.4
        });
      }
    };

    const spawnExplosionParticles = (x, y) => {
      const colors = ["#f97316", "#ef4444", "#eab308", "#64748b"];
      for (let i = 0; i < 25; i++) {
        const a = Math.random() * Math.PI * 2, spd = 50 + Math.random() * 150;
        game.particles.push({
          x, y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
          color: colors[Math.floor(Math.random() * colors.length)],
          radius: 3 + Math.random() * 4, life: 0.4 + Math.random() * 0.4, maxLife: 0.8
        });
      }
    };

    const spawnVampireCrosses = (vampire, target) => {
      if (Math.random() < 0.2) {
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
        if (ball.armThrowWallUntil && game.simTime <= ball.armThrowWallUntil) {
          applyDamage(ball, ARM_THROW_WALL_DAMAGE, `${ball.armThrowWallSourceId || ball.id}-arm-throw-wall`, game.simTime, 500);
          ball.armThrowWallUntil = 0;
          ball.armThrowWallSourceId = null;
          spawnSparks(ball.x, ball.y, "#ef4444", 14);
          game.screenShake = Math.max(game.screenShake, 14);
        }
        if (gameStarted && game.simTime >= 3000) {
          if (ball.type === "wallSpike") {
            if (!game.wallSpikes) game.wallSpikes = [];
            const newSpike = {
              x: bx,
              y: by,
              side: sideHit,
              ownerSide: ball.side,
              createdTime: game.simTime,
              life: game.balance.wallSpike.spikeLifetime,
              charges: 1
            };
            game.wallSpikes.push(newSpike);
            playSound("spikePlant");
          } else if (ball.type === "stringWeb") {
            if (!game.strings) game.strings = [];
            if (ball.lastBounceX !== undefined && ball.lastBounceX !== null) {
              const newString = {
                x1: ball.lastBounceX,
                y1: ball.lastBounceY,
                x2: bx,
                y2: by,
                ownerSide: ball.side,
                createdTime: game.simTime,
                life: Infinity
              };
              game.strings.push(newString);
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

        if (dist < latchLimit && !vampire.hasStuck) {
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
        const drainAmount = Math.max(MIN_DAMAGE, game.balance.vampire.drainPerTick);
        target.health = clamp(target.health - drainAmount, 0, 100);
        vampire.health = clamp(vampire.health + game.balance.vampire.healPerTick, 0, 100);
        
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
      const grabRange = bal.arm.grabRange;

      if (armBall.armState === "elbow_dropping") {
        armBall.x += (target.x - armBall.x) * 0.18;
        armBall.y += (target.y - armBall.y) * 0.18;
        target.x = armBall.x;
        target.y = armBall.y;
        target.vx = 0; target.vy = 0;
        
        if (currentTime >= armBall.armStateUntil) {
          armBall.armState = "idle";
          applyDamage(target, bal.arm.secSlamDamage, `${armBall.id}-elbow-slam`, currentTime, 500);
          const launchAngle = Math.random() * Math.PI * 2;
          const launchForce = 650;
          target.vx = Math.cos(launchAngle) * launchForce;
          target.vy = Math.sin(launchAngle) * launchForce;
          target.armThrowWallUntil = currentTime + 1600;
          target.armThrowWallSourceId = armBall.id;
          playSound("armSlam");
          spawnDust(target.x, target.y, 16);
          spawnSparks(target.x, target.y, "#ef4444", 15);
          game.screenShake = Math.max(game.screenShake, 18);
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
        
        // Trigger Leap Lunge
        const targetDist = Math.hypot(target.x - armBall.x, target.y - armBall.y);
        if (targetDist > 220 && currentTime >= (armBall.nextSecondaryAt || 0)) {
          armBall.nextSecondaryAt = currentTime + bal.arm.secCooldown;
          armBall.vx += Math.cos(targetAngle) * 450;
          armBall.vy += Math.sin(targetAngle) * 450;
          playSound("hammerLaunch");
          
          game.floatingTexts = game.floatingTexts || [];
          game.floatingTexts.push({
            x: armBall.x, y: armBall.y - armBall.r - 20, vy: -50,
            text: "LEAP LUNGE", color: "#cbd5e1", life: 0.8, maxLife: 0.8
          });
          
          for (let i = 0; i < 8; i++) {
            const sa = targetAngle + Math.PI + (Math.random() - 0.5) * 0.5;
            const spd = 60 + Math.random() * 80;
            game.particles.push({
              x: armBall.x, y: armBall.y,
              vx: Math.cos(sa) * spd, vy: Math.sin(sa) * spd,
              color: "#cbd5e1", radius: 2, life: 0.3, maxLife: 0.3
            });
          }
        }

        if (armBall.nextShotAt <= currentTime) {
          const handX = armBall.x + Math.cos(armBall.armAngle) * grabRange;
          const handY = armBall.y + Math.sin(armBall.armAngle) * grabRange;
          const dist = Math.hypot(handX - target.x, handY - target.y);
          if (dist < target.r + 26 || targetDist < grabRange + target.r * 0.8) {
            armBall.armState = "grabbing";
            armBall.armStateUntil = currentTime + bal.arm.grabDuration;
            armBall.armGrabDamageHits = 0;
            armBall.armBaseAngle = targetAngle;
            armBall.armDirection = target.y < armBall.y ? 1 : -1;
            armBall.armGrabRadius = Math.max(armBall.r + target.r + 8, Math.min(grabRange, targetDist));
            armBall.armLastHandX = target.x;
            armBall.armLastHandY = target.y;
            
            if (armBall.side === "left") game.stats.left.totalShots++;
            else game.stats.right.totalShots++;
            
            armBall.nextShotAt = currentTime + bal.arm.cooldown;
            playSound("armGrab");
          }
        }
      } else if (armBall.armState === "grabbing") {
        const elapsed = currentTime - (armBall.armStateUntil - bal.arm.grabDuration);
        const progress = clamp(elapsed / bal.arm.grabDuration, 0, 1);
        
        // Trigger Elbow Drop mid-grab
        if (elapsed >= 500 && currentTime >= (armBall.nextSecondaryAt || 0)) {
          armBall.nextSecondaryAt = currentTime + bal.arm.secCooldown;
          armBall.armState = "elbow_dropping";
          armBall.armStateUntil = currentTime + 400;
          playSound("armGrab");
          
          game.floatingTexts = game.floatingTexts || [];
          game.floatingTexts.push({
            x: armBall.x, y: armBall.y - armBall.r - 20, vy: -50,
            text: "ELBOW DROP", color: "#f87171", life: 0.8, maxLife: 0.8
          });
          return;
        }

        const whip = Math.sin(progress * Math.PI * 2.4) * 0.8;
        armBall.armAngle = armBall.armBaseAngle + armBall.armDirection * (progress * Math.PI * 1.35 + whip);
        
        const reach = (armBall.armGrabRadius || grabRange) * (0.85 + Math.sin(progress * Math.PI) * 0.25);
        const handX = armBall.x + Math.cos(armBall.armAngle) * reach;
        const handY = armBall.y + Math.sin(armBall.armAngle) * reach;
        
        const pad = 18;
        const targetX = clamp(handX, pad + target.r, game.width - pad - target.r);
        const targetY = clamp(handY, pad + target.r, game.height - pad - target.r);
        const pull = Math.min(1, stepDt * 12);
        const prevX = target.x;
        const prevY = target.y;
        target.x += (targetX - target.x) * pull;
        target.y += (targetY - target.y) * pull;
        target.vx = (target.x - prevX) / Math.max(stepDt, 0.001);
        target.vy = (target.y - prevY) / Math.max(stepDt, 0.001);
        target.spinAngle = (target.spinAngle || 0) + armBall.armDirection * 0.35;
        
        const corners = [
          { x: pad + target.r, y: pad + target.r },
          { x: game.width - pad - target.r, y: pad + target.r },
          { x: pad + target.r, y: game.height - pad - target.r },
          { x: game.width - pad - target.r, y: game.height - pad - target.r }
        ];
        
        const isNearWall = target.x <= pad + target.r + 4 || target.x >= game.width - pad - target.r - 4 || target.y <= pad + target.r + 4 || target.y >= game.height - pad - target.r - 4;
        const isNearCorner = corners.some(c => Math.hypot(target.x - c.x, target.y - c.y) < 34);
        const damageKey = `${armBall.id}-arm-wall-ragdoll`;
        if ((isNearWall || isNearCorner) && (armBall.armGrabDamageHits || 0) < 2 && (!game.damageCooldowns[damageKey] || game.damageCooldowns[damageKey] <= currentTime)) {
          applyDamage(target, ARM_RAGDOLL_WALL_DAMAGE, damageKey, currentTime, 500);
          armBall.armGrabDamageHits = (armBall.armGrabDamageHits || 0) + 1;
          spawnSparks(target.x, target.y, "#e5e7eb", 12);
          game.screenShake = Math.max(game.screenShake, 14);
        }
        
        if (currentTime >= armBall.armStateUntil) {
          armBall.armState = "idle";
          const launchAngle = armBall.armAngle + (Math.PI / 2) * armBall.armDirection;
          const launchForce = 650;
          target.vx = Math.cos(launchAngle) * launchForce;
          target.vy = Math.sin(launchAngle) * launchForce;
          target.armThrowWallUntil = currentTime + 1600;
          target.armThrowWallSourceId = armBall.id;
          spawnDust(target.x, target.y, 10);
          spawnSparks(target.x, target.y, "#facc15", 10);
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

    const updateGun = (gun, target, currentTime) => {
      gun.angle = Math.atan2(target.y - gun.y, target.x - gun.x);
      
      // Tactical Reload Dash
      if (gun.ammo <= 0 || gun.reloadUntil > currentTime) {
        const dist = Math.hypot(target.x - gun.x, target.y - gun.y);
        if (dist < 160 && currentTime >= (gun.nextSecondaryAt || 0)) {
          gun.nextSecondaryAt = currentTime + game.balance.gun.secCooldown;
          const awayAngle = Math.atan2(gun.y - target.y, gun.x - target.x);
          gun.vx += Math.cos(awayAngle) * game.balance.gun.secDashForce;
          gun.vy += Math.sin(awayAngle) * game.balance.gun.secDashForce;
          gun.ammo = Math.min(gun.maxAmmo, (gun.ammo || 0) + 2);
          gun.reloadUntil = 0; // Interrupt reload
          playSound("gunReload");
          
          for (let i = 0; i < 8; i++) {
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
            text: "DASH +2 AMMO", color: "#67e8f9", life: 0.8, maxLife: 0.8
          });
        }
      }

      if (gun.reloadUntil > currentTime) return;
      if (gun.ammo <= 0) {
        gun.reloadUntil = currentTime + game.balance.gun.reloadTime;
        gun.ammo = gun.maxAmmo;
        playSound("gunReload");
        return;
      }
      if (gun.nextShotAt > currentTime) return;

      const mX = gun.x + Math.cos(gun.angle) * (gun.r + 26);
      const mY = gun.y + Math.sin(gun.angle) * (gun.r + 26);
      game.bullets.push({
        ownerId: gun.id, targetSide: target.side, x: mX, y: mY,
        vx: Math.cos(gun.angle) * game.balance.gun.bulletSpeed,
        vy: Math.sin(gun.angle) * game.balance.gun.bulletSpeed,
        r: 5, damage: game.balance.gun.bulletDamage, life: game.balance.gun.bulletLife,
      });

      if (gun.side === "left") game.stats.left.totalShots++;
      else game.stats.right.totalShots++;

      gun.ammo--;
      gun.nextShotAt = currentTime + game.balance.gun.shotCooldown;
      gun.flashUntil = currentTime + 90;
      playSound("gunShot");
    };

    const updateBomb = (bombBall, target, currentTime) => {
      if (bombBall.nextBombAt > currentTime) return;
      const angle = Math.atan2(target.y - bombBall.y, target.x - bombBall.x);
      game.bombs.push({
        ownerId: bombBall.id, targetSide: target.side,
        x: bombBall.x + Math.cos(angle) * (bombBall.r + 15),
        y: bombBall.y + Math.sin(angle) * (bombBall.r + 15),
        vx: Math.cos(angle) * game.balance.bomb.throwSpeed + bombBall.vx * 0.3,
        vy: Math.sin(angle) * game.balance.bomb.throwSpeed + bombBall.vy * 0.3,
        r: 10, fuseUntil: currentTime + game.balance.bomb.fuseTime
      });

      if (bombBall.side === "left") game.stats.left.totalShots++;
      else game.stats.right.totalShots++;

      bombBall.nextBombAt = currentTime + game.balance.bomb.cooldown;
      playSound("shieldThrow");
    };

    const updateLaser = (laserBall, target, currentTime) => {
      const bal = game.balance;

      const dist = Math.hypot(target.x - laserBall.x, target.y - laserBall.y);
      if (laserBall.laserSweepState === "idle" && currentTime >= (laserBall.nextSecondaryAt || 0) && dist < 250) {
        laserBall.laserSweepState = "sweeping";
        laserBall.laserSweepStateUntil = currentTime + 400;
        const angleToTarget = Math.atan2(target.y - laserBall.y, target.x - laserBall.x);
        laserBall.laserSweepStartAngle = angleToTarget - Math.PI / 6;
        laserBall.laserSweepEndAngle = angleToTarget + Math.PI / 6;
        laserBall.laserSweepHitDone = false;
        laserBall.nextSecondaryAt = currentTime + bal.laser.secCooldown;
        playSound("laserFire");
        
        game.floatingTexts = game.floatingTexts || [];
        game.floatingTexts.push({
          x: laserBall.x, y: laserBall.y - laserBall.r - 20, vy: -50,
          text: "LASER SWEEP", color: "#22d3ee", life: 0.8, maxLife: 0.8
        });
      }

      if (laserBall.laserSweepState === "sweeping") {
        const progress = Math.min(1, Math.max(0, (currentTime - (laserBall.laserSweepStateUntil - 400)) / 400));
        laserBall.laserSweepAngle = laserBall.laserSweepStartAngle + (laserBall.laserSweepEndAngle - laserBall.laserSweepStartAngle) * progress;
        
        const sx = laserBall.x + Math.cos(laserBall.laserSweepAngle) * laserBall.r;
        const sy = laserBall.y + Math.sin(laserBall.laserSweepAngle) * laserBall.r;
        const ex = laserBall.x + Math.cos(laserBall.laserSweepAngle) * 300;
        const ey = laserBall.y + Math.sin(laserBall.laserSweepAngle) * 300;
        
        if (Math.random() < 0.3) {
          const pDist = Math.random() * 300;
          game.particles.push({
            x: sx + Math.cos(laserBall.laserSweepAngle) * pDist,
            y: sy + Math.sin(laserBall.laserSweepAngle) * pDist,
            vx: (Math.random() - 0.5) * 30, vy: (Math.random() - 0.5) * 30,
            color: "#22d3ee", radius: 1.5, life: 0.2, maxLife: 0.2
          });
        }

        const dSeg = linePointDist(target.x, target.y, sx, sy, ex, ey);
        if (dSeg < target.r + bal.laser.beamWidth / 2 && !laserBall.laserSweepHitDone) {
          laserBall.laserSweepHitDone = true;
          if (!isChessCrownActive(target)) {
            const dmg = Math.max(MIN_DAMAGE, bal.laser.secDamage);
            target.health = clamp(target.health - dmg, 0, 100);
            
            game.floatingTexts = game.floatingTexts || [];
            game.floatingTexts.push({
              x: target.x + (Math.random() - 0.5) * 20, y: target.y - target.r - 5, vy: -60,
              text: `-${dmg}`, color: "#22d3ee", life: 0.8, maxLife: 0.8
            });
            
            if (laserBall.side === "left") { game.stats.left.damageDealt += dmg; game.stats.left.hitsLanded++; }
            else { game.stats.right.damageDealt += dmg; game.stats.right.hitsLanded++; }
            
            playSound("laserFire");
            for (let i = 0; i < 5; i++) {
              const sa = Math.random() * Math.PI * 2, spd = 60 + Math.random() * 60;
              game.particles.push({
                x: target.x + (Math.random() - 0.5) * target.r, y: target.y + (Math.random() - 0.5) * target.r,
                vx: Math.cos(sa) * spd, vy: Math.sin(sa) * spd, color: "#22d3ee", radius: 2, life: 0.25, maxLife: 0.25
              });
            }
          }
        }
        
        if (currentTime >= laserBall.laserSweepStateUntil) {
          laserBall.laserSweepState = "idle";
        }
      }

      if (laserBall.laserState === "idle" && laserBall.nextShotAt <= currentTime) {
        laserBall.laserState = "charging";
        laserBall.laserStateUntil = currentTime + bal.laser.chargeTime;
        laserBall.laserTargetAngle = Math.atan2(target.y - laserBall.y, target.x - laserBall.x);
        laserBall.laserReflect = null;
        playSound("laserCharge");
      } else if (laserBall.laserState === "charging") {
        laserBall.laserReflect = null;
        const targetAngle = Math.atan2(target.y - laserBall.y, target.x - laserBall.x);
        laserBall.laserTargetAngle = targetAngle;

        if (Math.random() < 0.3) {
          const a = Math.random() * Math.PI * 2, dst = laserBall.r + 20 + Math.random() * 20;
          game.particles.push({
            x: laserBall.x + Math.cos(a) * dst, y: laserBall.y + Math.sin(a) * dst,
            vx: -Math.cos(a) * 60, vy: -Math.sin(a) * 60, color: "#34d399", radius: 1.5, life: 0.3, maxLife: 0.3
          });
        }

        if (currentTime >= laserBall.laserStateUntil) {
          laserBall.laserState = "firing";
          laserBall.laserStateUntil = currentTime + bal.laser.fireDuration;
          playSound("laserFire");
          laserBall.laserNextTickAt = currentTime;
          game.screenShake = Math.max(game.screenShake, 5);
        }
      } else if (laserBall.laserState === "firing") {
        const targetAngle = Math.atan2(target.y - laserBall.y, target.x - laserBall.x);
        laserBall.laserTargetAngle = targetAngle;

        const mX = laserBall.x + Math.cos(laserBall.laserTargetAngle) * laserBall.r;
        const mY = laserBall.y + Math.sin(laserBall.laserTargetAngle) * laserBall.r;
        const eX = mX + Math.cos(laserBall.laserTargetAngle) * 1500;
        const eY = mY + Math.sin(laserBall.laserTargetAngle) * 1500;

        if (Math.random() < 0.4) {
          const dst = Math.random() * 400;
          game.particles.push({
            x: mX + Math.cos(laserBall.laserTargetAngle) * dst,
            y: mY + Math.sin(laserBall.laserTargetAngle) * dst,
            vx: (Math.random() - 0.5) * 30, vy: (Math.random() - 0.5) * 30,
            color: "#10b981", radius: 1.5, life: 0.15, maxLife: 0.15
          });
        }

        const shieldBlock = getShieldBeamBlock(target.type === "shield" ? target : null, mX, mY, eX, eY, bal.laser.beamWidth);
        if (shieldBlock) {
          // Calculate laser reflection: 2 * normalAngle - PI - incomingAngle
          const reflectedAngle = 2 * shieldBlock.angle - Math.PI - laserBall.laserTargetAngle;
          laserBall.laserReflect = { x: shieldBlock.x, y: shieldBlock.y, angle: reflectedAngle };

          if (currentTime >= laserBall.laserNextTickAt) {
            laserBall.laserNextTickAt = currentTime + bal.laser.tickCooldown;
            if (target.side === "left") game.stats.left.blocked++;
            else game.stats.right.blocked++;
            spawnShieldSparks(shieldBlock.x, shieldBlock.y, shieldBlock.angle);
            registerShieldGuardHit(target, shieldBlock.angle, currentTime);
            spawnSparks(laserBall.x, laserBall.y, "#10b981", 5);
          }
          return;
        } else {
          laserBall.laserReflect = null;
        }

        const d = linePointDist(target.x, target.y, mX, mY, eX, eY);
        if (d < target.r + bal.laser.beamWidth / 2 && currentTime >= laserBall.laserNextTickAt) {
          const beamDamage = Math.max(MIN_DAMAGE, bal.laser.damagePerTick);
          if (isChessCrownActive(target)) return;
          target.health = clamp(target.health - beamDamage, 0, 100);

          game.floatingTexts = game.floatingTexts || [];
          game.floatingTexts.push({
            x: target.x + (Math.random() - 0.5) * 20, y: target.y - target.r - 5, vy: -60,
            text: `-${beamDamage}`, color: "#f87171", life: 0.8, maxLife: 0.8
          });
          
          if (laserBall.side === "left") { game.stats.left.damageDealt += beamDamage; game.stats.left.hitsLanded++; }
          else { game.stats.right.damageDealt += beamDamage; game.stats.right.hitsLanded++; }

          for (let i = 0; i < 3; i++) {
            const sa = Math.random() * Math.PI * 2, spd = 40 + Math.random() * 60;
            game.particles.push({
              x: target.x + (Math.random() - 0.5) * target.r, y: target.y + (Math.random() - 0.5) * target.r,
              vx: Math.cos(sa) * spd, vy: Math.sin(sa) * spd, color: "#10b981", radius: 2, life: 0.2, maxLife: 0.2
            });
          }
          laserBall.laserNextTickAt = currentTime + bal.laser.tickCooldown;
        }

        if (currentTime >= laserBall.laserStateUntil) {
          laserBall.laserState = "idle";
          laserBall.nextShotAt = currentTime + bal.laser.cooldown;
          laserBall.laserReflect = null;
        }
      }
    };

    const updateBomber = (bomberBall, target, currentTime) => {
      if (bomberBall.nextShotAt > currentTime) return;

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
      });

      if (bomberBall.side === "left") game.stats.left.totalShots++;
      else game.stats.right.totalShots++;

      bomberBall.nextShotAt = currentTime + game.balance.bomber.cooldown;
      playSound("spikePlant");
    };

    const updateSpider = (spiderBall, target, currentTime, stepDt) => {
      const bal = game.balance;

      // Venomous Web Spit Trigger
      const dist = Math.hypot(target.x - spiderBall.x, target.y - spiderBall.y);
      if (dist < 240 && currentTime >= (spiderBall.nextSecondaryAt || 0)) {
        spiderBall.nextSecondaryAt = currentTime + bal.spider.secCooldown;
        const spitX = clamp(spiderBall.x + (target.x - spiderBall.x) * 0.4 + (Math.random() - 0.5) * 20, 30, game.width - 30);
        const spitY = clamp(spiderBall.y + (target.y - spiderBall.y) * 0.4 + (Math.random() - 0.5) * 20, 30, game.height - 30);
        game.venomPools.push({
          x: spitX,
          y: spitY,
          r: bal.spider.secPoolRadius,
          ownerSide: spiderBall.side,
          createdTime: currentTime,
          duration: 4000
        });
        playSound("webShoot");
        
        game.floatingTexts = game.floatingTexts || [];
        game.floatingTexts.push({
          x: spiderBall.x, y: spiderBall.y - spiderBall.r - 20, vy: -50,
          text: "WEB", color: "#10b981", life: 0.8, maxLife: 0.8
        });
      }

      if (spiderBall.webState === "idle") {
        if (spiderBall.nextShotAt <= currentTime) {
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
          target.vx += Math.cos(pushAngle) * bal.shield.knockback * 15;
          target.vy += Math.sin(pushAngle) * bal.shield.knockback * 15;
          spawnSparks(target.x, target.y, "#3b82f6", 10);
          shieldBall.shieldBashUntil = 0; // stop lunge
        }
      }

      if (shieldBall.shieldState === "held") {
        shieldBall.shieldAngle = Math.atan2(target.y - shieldBall.y, target.x - shieldBall.x);
        
        // Trigger Shield Bash
        const dist = Math.hypot(target.x - shieldBall.x, target.y - shieldBall.y);
        if (dist < 85 && currentTime >= (shieldBall.nextSecondaryAt || 0)) {
          shieldBall.nextSecondaryAt = currentTime + bal.shield.secCooldownHeld;
          shieldBall.shieldBashUntil = currentTime + 250;
          const bashAngle = Math.atan2(target.y - shieldBall.y, target.x - shieldBall.x);
          shieldBall.vx = Math.cos(bashAngle) * 480;
          shieldBall.vy = Math.sin(bashAngle) * 480;
          playSound("wallBounce");
          
          game.floatingTexts = game.floatingTexts || [];
          game.floatingTexts.push({
            x: shieldBall.x, y: shieldBall.y - shieldBall.r - 20, vy: -50,
            text: "SHIELD BASH", color: "#3b82f6", life: 0.8, maxLife: 0.8
          });
          
          for (let i = 0; i < 6; i++) {
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
          shieldBall.shieldFastRecall = false;
          shieldBall.nextThrowAt = currentTime + bal.shield.cooldown;
          spawnSparks(shieldBall.x, shieldBall.y, "#60a5fa", 8);
          playSound("shieldCatch");
        }
      } else {
        // Trigger Emergency Fast Recall
        const distToEnemy = Math.hypot(target.x - shieldBall.x, target.y - shieldBall.y);
        if (distToEnemy < 100 && currentTime >= (shieldBall.nextSecondaryAt || 0)) {
          shieldBall.nextSecondaryAt = currentTime + bal.shield.secCooldownThrown;
          shieldBall.shieldState = "returning";
          shieldBall.shieldFastRecall = true;
          playSound("shieldCatch");
          
          game.floatingTexts = game.floatingTexts || [];
          game.floatingTexts.push({
            x: shieldBall.x, y: shieldBall.y - shieldBall.r - 20, vy: -50,
            text: "FAST RECALL", color: "#60a5fa", life: 0.8, maxLife: 0.8
          });
        }

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
            target.vx += Math.cos(knockAngle) * bal.shield.knockback * 12;
            target.vy += Math.sin(knockAngle) * bal.shield.knockback * 12;

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
          const mult = shieldBall.shieldFastRecall ? 1.5 : 1.0;
          shieldBall.shieldVx = Math.cos(returnAngle) * bal.shield.returnSpeed * mult;
          shieldBall.shieldVy = Math.sin(returnAngle) * bal.shield.returnSpeed * mult;

          const distToOwner = Math.hypot(shieldBall.x - shieldBall.shieldX, shieldBall.y - shieldBall.shieldY);
          if (distToOwner < shieldBall.r + 10) {
            shieldBall.shieldState = "held";
            shieldBall.shieldGuardHits = 0;
            shieldBall.shieldBonusDamage = 0;
            shieldBall.shieldFastRecall = false;
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
        if (hammerBall.hammerAngle >= 10 * Math.PI) {
          hammerBall.hammerState = "charging";
          hammerBall.hammerStateUntil = currentTime + bal.hammer.chargeDuration;
          hammerBall.vx = 0;
          hammerBall.vy = 0;
          playSound("hammerCharge");
        }
      } else if (hammerBall.hammerState === "charging") {
        hammerBall.vx = 0;
        hammerBall.vy = 0;
        hammerBall.hammerAngle = Math.atan2(target.y - hammerBall.y, target.x - hammerBall.x);

        // Charging sparks visual
        if (Math.random() < 0.25) {
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
        if (Math.random() < 0.6) {
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
            target.vx += Math.cos(hammerBall.hammerLaunchAngle) * 600;
            target.vy += Math.sin(hammerBall.hammerLaunchAngle) * 600;
            
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
          ball.webState = "idle"; return;
        }
        const target = balls.find(o => o.side !== ball.side);
        if (Math.hypot(ball.webX - target.x, ball.webY - target.y) < target.r + 6) {
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

    const updateMines = (stepDt, balls) => {
      game.mines = game.mines.filter((mine) => {
        const enemy = balls.find(b => b.side !== mine.ownerSide);
        const dist = Math.hypot(mine.x - enemy.x, mine.y - enemy.y);

        if (mine.triggerTime) {
          if (game.simTime >= mine.triggerTime) {
            game.explosions.push({
              ownerId: mine.ownerId, x: mine.x, y: mine.y, r: 0,
              maxRadius: game.balance.bomber.mineRadius, duration: 400, life: 400
            });
            game.screenShake = Math.max(game.screenShake, 12);
            spawnExplosionParticles(mine.x, mine.y);
            playSound("explosion");

            balls.forEach(ball => {
              const db = Math.hypot(ball.x - mine.x, ball.y - mine.y);
              if (db < game.balance.bomber.mineRadius + ball.r) {
                const falloff = 1 - (db / (game.balance.bomber.mineRadius + ball.r));
                const dmg = Math.max(MIN_DAMAGE, Math.round(game.balance.bomber.mineDamage * falloff));
                if (isChessCrownActive(ball)) return;
                ball.health = clamp(ball.health - dmg, 0, 100);

                game.floatingTexts = game.floatingTexts || [];
                game.floatingTexts.push({
                  x: ball.x + (Math.random() - 0.5) * 20, y: ball.y - ball.r - 5, vy: -60,
                  text: `-${dmg}`, color: "#f87171", life: 0.8, maxLife: 0.8
                });

                const angle = Math.atan2(ball.y - mine.y, ball.x - mine.x);
                const force = game.balance.bomber.knockback * 20 * falloff;
                ball.vx += Math.cos(angle) * force; ball.vy += Math.sin(angle) * force;

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
          spawnSparks(mine.x, mine.y, "#ef4444", 4);
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
            applyDamage(ball, bal.spider.secDamage, `${ball.id}-venom-tick-${pool.createdTime}`, game.simTime, 250);

            if (Math.random() < 0.15) {
              game.particles.push({
                x: ball.x + (Math.random() - 0.5) * ball.r,
                y: ball.y + (Math.random() - 0.5) * ball.r,
                vx: (Math.random() - 0.5) * 20, vy: -20 - Math.random() * 20,
                color: "#10b981", radius: 1.5, life: 0.35, maxLife: 0.35
              });
            }
          }
        });

        if (Math.random() < 0.04) {
          const a = Math.random() * Math.PI * 2;
          const d = Math.random() * pool.r;
          game.particles.push({
            x: pool.x + Math.cos(a) * d, y: pool.y + Math.sin(a) * d,
            vx: 0, vy: -8 - Math.random() * 12,
            color: "#34d399", radius: 1.2, life: 0.4, maxLife: 0.4
          });
        }

        return true;
      });
    };

    const updateBullets = (dt, balls) => {
      game.bullets = game.bullets.filter((bullet) => {
        bullet.x += bullet.vx * dt; bullet.y += bullet.vy * dt; bullet.life -= dt;
        if (bullet.x < 18 || bullet.x > game.width - 18 || bullet.y < 18 || bullet.y > game.height - 18 || bullet.life <= 0) return false;

        const side = bullet.targetSide, shieldBall = balls.find(b => b.side === side);
        if (shieldBall && shieldBall.type === "shield") {
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
          target.health = clamp(target.health - bullet.damage, 0, 100);

          game.floatingTexts = game.floatingTexts || [];
          game.floatingTexts.push({
            x: target.x + (Math.random() - 0.5) * 20, y: target.y - target.r - 5, vy: -60,
            text: `-${bullet.damage}`, color: "#f87171", life: 0.8, maxLife: 0.8
          });
          
          if (bullet.ownerId.startsWith("left")) { game.stats.left.damageDealt += bullet.damage; game.stats.left.hitsLanded++; }
          else { game.stats.right.damageDealt += bullet.damage; game.stats.right.hitsLanded++; }

          spawnSparks(bullet.x, bullet.y, "#facc15", 8);
          return false;
        }
        return true;
      });
    };

    const updateBombs = (dt, balls) => {
      game.bombs = game.bombs.filter((bomb) => {
        bomb.x += bomb.vx * dt; bomb.y += bomb.vy * dt;
        
        const pad = 18; let bounced = false;
        if (bomb.x - bomb.r < pad) { bomb.x = pad + bomb.r; bomb.vx = Math.abs(bomb.vx) * 0.8; bounced = true; }
        if (bomb.x + bomb.r > game.width - pad) { bomb.x = game.width - pad - bomb.r; bomb.vx = -Math.abs(bomb.vx) * 0.8; bounced = true; }
        if (bomb.y - bomb.r < pad) { bomb.y = pad + bomb.r; bomb.vy = Math.abs(bomb.vy) * 0.8; bounced = true; }
        if (bomb.y + bomb.r > game.height - pad) { bomb.y = game.height - pad - bomb.r; bomb.vy = -Math.abs(bomb.vy) * 0.8; bounced = true; }
        if (bounced) spawnDust(bomb.x, bomb.y, 3);

        // Periodic ticking sound
        if (!bomb.lastTickTime || game.simTime - bomb.lastTickTime >= 300) {
          bomb.lastTickTime = game.simTime;
          playSound("bombFuse", 0.5, 0);
        }

        const target = balls.find((b) => b.side === bomb.targetSide);
        const dist = Math.hypot(bomb.x - target.x, bomb.y - target.y);
        
        if (game.simTime >= bomb.fuseUntil || dist < target.r + bomb.r) {
          game.explosions.push({
            ownerId: bomb.ownerId, x: bomb.x, y: bomb.y, r: 0,
            maxRadius: game.balance.bomb.radius, duration: 400, life: 400
          });
          game.screenShake = Math.max(game.screenShake, 14);
          spawnExplosionParticles(bomb.x, bomb.y);
          playSound("explosion");

          balls.forEach(ball => {
            const db = Math.hypot(ball.x - bomb.x, ball.y - bomb.y);
            if (db < game.balance.bomb.radius + ball.r) {
              const falloff = 1 - (db / (game.balance.bomb.radius + ball.r));
              const dmg = Math.max(MIN_DAMAGE, Math.round(game.balance.bomb.damage * falloff));
              if (isChessCrownActive(ball)) return;
              ball.health = clamp(ball.health - dmg, 0, 100);

              game.floatingTexts = game.floatingTexts || [];
              game.floatingTexts.push({
                x: ball.x + (Math.random() - 0.5) * 20, y: ball.y - ball.r - 5, vy: -60,
                text: `-${dmg}`, color: "#f87171", life: 0.8, maxLife: 0.8
              });

              const angle = Math.atan2(ball.y - bomb.y, ball.x - bomb.x);
              const force = game.balance.bomb.knockback * 20 * falloff;
              ball.vx += Math.cos(angle) * force; ball.vy += Math.sin(angle) * force;

              if (bomb.ownerId.startsWith("left")) {
                if (ball.side === "right") { game.stats.left.damageDealt += dmg; game.stats.left.hitsLanded++; }
              } else {
                if (ball.side === "left") { game.stats.right.damageDealt += dmg; game.stats.right.hitsLanded++; }
              }
            }
          });
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
    };

    const updateParticles = (dt) => {
      game.particles = game.particles.filter((p) => {
        p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
        p.alpha = Math.max(0, p.life / p.maxLife);
        return p.life > 0;
      });
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
      ctx.font = "bold 9px sans-serif"; ctx.fillStyle = "rgba(248,250,252,0.82)";
      ctx.fillText(ball.type === "gun" ? `${ball.ammo}/6` : ball.shortName, ball.x, ball.y - 16);
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
        ctx.save(); ctx.translate(ball.x, ball.y);
        ctx.rotate(ball.spinAngle);
        ctx.fillStyle = "#e5e7eb"; ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(ball.r - 4, -7);
        ctx.lineTo(ball.r + game.balance.knife.bladeLength, 0);
        ctx.lineTo(ball.r - 4, 7); ctx.closePath();
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#0f172a"; ctx.fillRect(ball.r - 8, -4, 14, 8);
        ctx.restore();
      } else {
        ctx.save(); ctx.translate(ball.knifeBladeX, ball.knifeBladeY);
        ctx.rotate(ball.knifeBladeAngle);
        ctx.fillStyle = "#e5e7eb"; ctx.strokeStyle = "#38bdf8"; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(-12, -7);
        ctx.lineTo(game.balance.knife.bladeLength - 12, 0);
        ctx.lineTo(-12, 7); ctx.closePath();
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#0f172a"; ctx.fillRect(-16, -4, 14, 8);
        ctx.restore();
      }
      drawHealthInsideBall(ball);
    };

    const drawSpikeBall = (ball) => {
      const config = BALL_TYPES.spike;
      ctx.save(); ctx.translate(ball.x, ball.y);
      const spikes = 12, outer = ball.r + game.balance.spike.spikeReach, inner = ball.r;
      ctx.beginPath();
      for (let i = 0; i < spikes * 2; i++) {
        const a = (i / (spikes * 2)) * Math.PI * 2, rad = i % 2 === 0 ? outer : inner;
        const px = Math.cos(a) * rad, py = Math.sin(a) * rad;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = config.color; ctx.fill();
      ctx.strokeStyle = config.stroke; ctx.lineWidth = 3; ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, ball.r - 8, 0, Math.PI * 2);
      ctx.fillStyle = "#be123c"; ctx.fill();
      ctx.restore();
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
      
      // Dual futuristic railgun barrels
      // Top Barrel
      ctx.fillStyle = "#334155";
      ctx.fillRect(ball.r - 2, -7, 30, 5);
      ctx.fillStyle = "#06b6d4"; // Cyan glow rail
      ctx.fillRect(ball.r + 8, -6, 18, 3);

      // Bottom Barrel
      ctx.fillStyle = "#334155";
      ctx.fillRect(ball.r - 2, 2, 30, 5);
      ctx.fillStyle = "#06b6d4"; // Cyan glow rail
      ctx.fillRect(ball.r + 8, 3, 18, 3);
      
      // Gun base connector
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(ball.r - 6, -9, 8, 18);
      ctx.strokeStyle = "#0891b2";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(ball.r - 6, -9, 8, 18);

      // Laser guide line (faint cyan)
      ctx.strokeStyle = "rgba(6, 182, 212, 0.4)";
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
        flashGrad.addColorStop(0.3, "#22d3ee");
        flashGrad.addColorStop(1, "rgba(6, 182, 212, 0)");
        ctx.fillStyle = flashGrad;
        ctx.beginPath();
        ctx.arc(ball.r + 32, 0, 16, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Ball shell - Radial Gradient for carbon/metallic feel
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      const metalGrad = ctx.createRadialGradient(
        ball.x - ball.r * 0.2, ball.y - ball.r * 0.2, 2,
        ball.x, ball.y, ball.r
      );
      metalGrad.addColorStop(0, "#475569");
      metalGrad.addColorStop(0.5, "#1e293b");
      metalGrad.addColorStop(1, "#0f172a");
      ctx.fillStyle = metalGrad;
      ctx.fill();

      // Cyber outer border
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = "#06b6d4";
      ctx.stroke();

      // Outer targeting scope ticks
      ctx.save();
      ctx.translate(ball.x, ball.y);
      ctx.rotate(ball.angle);
      
      // Thin cyan reticle circle
      ctx.strokeStyle = "rgba(6, 182, 212, 0.85)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(0, 0, ball.r * 0.65, 0, Math.PI * 2);
      ctx.stroke();

      // Crosshairs
      ctx.strokeStyle = "#06b6d4";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      // Top tick
      ctx.moveTo(0, -ball.r * 0.65); ctx.lineTo(0, -ball.r * 0.45);
      // Bottom tick
      ctx.moveTo(0, ball.r * 0.65); ctx.lineTo(0, ball.r * 0.45);
      // Left tick
      ctx.moveTo(-ball.r * 0.65, 0); ctx.lineTo(-ball.r * 0.45, 0);
      // Right tick
      ctx.moveTo(ball.r * 0.65, 0); ctx.lineTo(ball.r * 0.45, 0);
      ctx.stroke();

      // Center glowing dot
      ctx.fillStyle = "#22d3ee";
      ctx.beginPath();
      ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
      drawHealthInsideBall(ball);
    };

    const drawBombBall = (ball) => {
      const config = BALL_TYPES.bomb;
      ctx.save(); ctx.translate(ball.x, ball.y);
      ctx.beginPath(); ctx.arc(0, 0, ball.r, 0, Math.PI * 2);
      ctx.fillStyle = config.color; ctx.fill();
      ctx.lineWidth = 4; ctx.strokeStyle = config.stroke; ctx.stroke();
      ctx.fillStyle = "#64748b"; ctx.fillRect(ball.r - 8, -6, 12, 12);
      ctx.strokeStyle = "#d97706"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(ball.r + 6, 0, 8, Math.PI, Math.PI * 1.8); ctx.stroke();
      ctx.fillStyle = "#facc15"; ctx.beginPath(); ctx.arc(ball.r + 10, -5, 4 + Math.random() * 2, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      drawHealthInsideBall(ball);
    };

    const drawLaserBall = (ball, target) => {
      const config = BALL_TYPES.laser;
      ctx.save(); ctx.translate(ball.x, ball.y); ctx.rotate(ball.laserTargetAngle);
      ctx.fillStyle = "#b91c1c"; ctx.fillRect(ball.r - 6, -10, 16, 20);
      ctx.fillStyle = "#facc15"; ctx.fillRect(ball.r + 4, -7, 6, 14);
      ctx.restore();

      ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fillStyle = config.color; ctx.fill();
      ctx.lineWidth = 4; ctx.strokeStyle = config.stroke; ctx.stroke();

      if (ball.laserState === "charging" && target) {
        const timeLeft = ball.laserStateUntil - game.simTime;
        const progress = 1 - Math.max(0, timeLeft / game.balance.laser.chargeTime);
        ctx.save(); ctx.strokeStyle = `rgba(239, 68, 68, ${progress * 0.6})`; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(ball.x + Math.cos(ball.laserTargetAngle) * ball.r, ball.y + Math.sin(ball.laserTargetAngle) * ball.r);
        ctx.lineTo(target.x, target.y); ctx.stroke();
        ctx.strokeStyle = "#facc15"; ctx.lineWidth = 2; ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r + 20 * (1 - progress), 0, Math.PI * 2); ctx.stroke(); ctx.restore();
      }

      if (ball.laserState === "firing") {
        const mX = ball.x + Math.cos(ball.laserTargetAngle) * ball.r;
        const mY = ball.y + Math.sin(ball.laserTargetAngle) * ball.r;
        ctx.save();
        ctx.shadowColor = "#ef4444";
        ctx.shadowBlur = 15;
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
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = game.balance.laser.beamWidth / 2;
        tracePath();
        ctx.stroke();
        ctx.strokeStyle = "rgba(250, 204, 21, 0.45)";
        ctx.lineWidth = game.balance.laser.beamWidth;
        tracePath();
        ctx.stroke();
        ctx.restore();
      }
      if (ball.laserSweepState === "sweeping") {
        const sx = ball.x + Math.cos(ball.laserSweepAngle) * ball.r;
        const sy = ball.y + Math.sin(ball.laserSweepAngle) * ball.r;
        const ex = ball.x + Math.cos(ball.laserSweepAngle) * 300;
        const ey = ball.y + Math.sin(ball.laserSweepAngle) * 300;
        ctx.save();
        ctx.shadowColor = "#22d3ee";
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = "rgba(34, 211, 238, 0.55)";
        ctx.lineWidth = game.balance.laser.beamWidth;
        ctx.stroke();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = game.balance.laser.beamWidth / 2;
        ctx.stroke();
        ctx.restore();
      }
      drawHealthInsideBall(ball);
    };

    const drawShieldBall = (ball) => {
      // Draw the Shielder body (patriotic concentric rings: blue, white, red)
      ctx.save();
      ctx.translate(ball.x, ball.y);
      
      // Outer ring (red)
      ctx.beginPath();
      ctx.arc(0, 0, ball.r, 0, Math.PI * 2);
      ctx.fillStyle = "#ef4444";
      ctx.fill();
      
      // Middle ring (white)
      ctx.beginPath();
      ctx.arc(0, 0, ball.r * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      
      // Inner circle (blue)
      ctx.beginPath();
      ctx.arc(0, 0, ball.r * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = "#1e3a8a";
      ctx.fill();
      
      // Outer outline (blue)
      ctx.beginPath();
      ctx.arc(0, 0, ball.r, 0, Math.PI * 2);
      ctx.strokeStyle = "#1e3a8a";
      ctx.lineWidth = 3;
      ctx.stroke();
      
      ctx.restore();

      // If the shield is held, draw the protective shield arc
      if (ball.shieldState === "held") {
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
        ctx.translate(ball.shieldX, ball.shieldY);
        ctx.rotate(ball.shieldSpinAngle || 0);

        const shieldR = 24;

        // Outer ring (red)
        ctx.beginPath();
        ctx.arc(0, 0, shieldR, 0, Math.PI * 2);
        ctx.fillStyle = "#ef4444";
        ctx.fill();

        // Outer outline (white)
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Middle ring (white)
        ctx.beginPath();
        ctx.arc(0, 0, shieldR * 0.75, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        // Inner circle (blue)
        ctx.beginPath();
        ctx.arc(0, 0, shieldR * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = "#1d4ed8";
        ctx.fill();

        // White star in center
        drawStar(ctx, 0, 0, 5, shieldR * 0.4, shieldR * 0.16);

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
        ctx.beginPath(); ctx.moveTo(ball.x, ball.y); ctx.lineTo(ball.webX, ball.webY); ctx.stroke();

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
      drawHealthInsideBall(ball);
    };

    const drawArmBall = (ball) => {
      const config = BALL_TYPES.arm;
      const bal = game.balance;
      const L = bal.arm.grabRange;
      
      let yOffset = 0;
      if (ball.armState === "elbow_dropping") {
        const elapsed = game.simTime - (ball.armStateUntil - 400);
        const progress = clamp(elapsed / 400, 0, 1);
        yOffset = -70 * Math.sin(progress * Math.PI);
      }
      
      const armAngle = ball.armAngle || 0;
      const enemy = game.balls.find(b => b.id !== ball.id);
      const handX = ball.armState === "elbow_dropping" && enemy ? enemy.x : ball.x + Math.cos(armAngle) * L;
      const handY = ball.armState === "elbow_dropping" && enemy ? enemy.y : ball.y + Math.sin(armAngle) * L;

      // Draw the arm line / segments
      ctx.save();
      
      const bendAmp = (ball.armState === "grabbing" || ball.armState === "elbow_dropping") ? 14 : 6;
      const bendFreq = (ball.armState === "grabbing" || ball.armState === "elbow_dropping") ? 0.03 : 0.01;
      const bendOffset = Math.sin(game.simTime * bendFreq) * bendAmp;
      
      const midX = (ball.x + handX) / 2;
      const midY = (ball.y + yOffset + handY) / 2;
      const perpAngle = armAngle + Math.PI / 2;
      const jointX = midX + Math.cos(perpAngle) * bendOffset;
      const jointY = midY + Math.sin(perpAngle) * bendOffset;

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
      ctx.rotate(armAngle);
      
      let fingerAngle = 0.5;
      if (ball.armState === "grabbing" || ball.armState === "elbow_dropping") {
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

      ctx.fillStyle = "#cbd5e1";
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

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

    const drawBall = (ball, currentTime) => {
      if (ball.type === "knife") drawKnifeBall(ball);
      else if (ball.type === "spike") drawSpikeBall(ball);
      else if (ball.type === "gun") drawGunBall(ball, currentTime);
      else if (ball.type === "vampire") {
        const target = game.balls.find((o) => o.id === ball.latchedTo) || game.balls.find((o) => o.side !== ball.side);
        drawVampireBall(ball, currentTime, target);
      }
      else if (ball.type === "bomb") drawBombBall(ball);
      else if (ball.type === "laser") {
        const target = game.balls.find((o) => o.side !== ball.side);
        drawLaserBall(ball, target);
      }
      else if (ball.type === "shield") drawShieldBall(ball);
      else if (ball.type === "spider") drawSpiderBall(ball);
      else if (ball.type === "bomber") drawBomberBall(ball);
      else if (ball.type === "spore") drawSporeBall(ball);
      else if (ball.type === "hammer") drawHammerBall(ball);
      else if (ball.type === "wallSpike") drawWallSpikeBall(ball);
      else if (ball.type === "stringWeb") drawStringWebBall(ball);
      else if (ball.type === "arm") drawArmBall(ball);
      else if (ball.type === "chess") drawChessBall(ball);
    };

    const drawBallTrail = (ball) => {
      if (!ball.trail || ball.trail.length < 2) return;
      const config = BALL_TYPES[ball.type];
      ctx.save();
      for (let i = 0; i < ball.trail.length; i++) {
        const pt = ball.trail[i], progress = i / ball.trail.length;
        ctx.globalAlpha = progress * 0.12; ctx.fillStyle = config.color;
        ctx.beginPath(); ctx.arc(pt.x, pt.y, ball.r * (0.4 + 0.6 * progress), 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    };

    const drawBullets = () => {
      game.bullets.forEach((bullet) => {
        ctx.beginPath(); ctx.arc(bullet.x, bullet.y, bullet.r, 0, Math.PI * 2);
        ctx.fillStyle = "#facc15"; ctx.fill();
      });
    };

    const drawBombs = () => {
      game.bombs.forEach((bomb) => {
        ctx.save(); ctx.shadowColor = "#f59e0b"; ctx.shadowBlur = 8;
        ctx.fillStyle = "#1e293b"; ctx.strokeStyle = "#475569"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(bomb.x, bomb.y, bomb.r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = "#d97706"; ctx.lineWidth = 2; ctx.beginPath();
        ctx.moveTo(bomb.x, bomb.y - bomb.r + 2);
        ctx.quadraticCurveTo(bomb.x + 8, bomb.y - bomb.r - 8, bomb.x + 12, bomb.y - bomb.r - 4); ctx.stroke();
        ctx.fillStyle = "#facc15"; ctx.beginPath(); ctx.arc(bomb.x + 12, bomb.y - bomb.r - 4, 3 + Math.random() * 2, 0, Math.PI * 2); ctx.fill();
        const pulse = Math.abs(Math.sin(game.simTime * 0.015));
        ctx.strokeStyle = `rgba(239, 68, 68, ${pulse})`; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(bomb.x, bomb.y, bomb.r + 4, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
      });
    };

    const drawMines = () => {
      game.mines.forEach((mine) => {
        ctx.save(); ctx.shadowColor = "#f59e0b"; ctx.shadowBlur = 6;
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
        ctx.beginPath(); ctx.arc(mine.x, mine.y, mine.triggerRadius, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
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
      game.particles.forEach((p) => {
        ctx.save(); ctx.globalAlpha = p.alpha;
        if (p.isCross) {
          ctx.strokeStyle = p.color; ctx.lineWidth = 2; ctx.beginPath();
          ctx.moveTo(p.x - 4, p.y); ctx.lineTo(p.x + 4, p.y);
          ctx.moveTo(p.x, p.y - 4); ctx.lineTo(p.x, p.y + 4); ctx.stroke();
        } else {
          ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
      });
    };

    const updateFloatingTexts = (dt) => {
      game.floatingTexts = (game.floatingTexts || []).filter((ft) => {
        ft.y += ft.vy * dt;
        ft.life -= dt;
        return ft.life > 0;
      });
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

    const updateWallSpikes = (dt) => {
      if (!game.wallSpikes) return;
      game.wallSpikes = game.wallSpikes.filter((spike) => {
        game.balls.forEach((ball) => {
          if (ball.side === spike.ownerSide) return;

          let hit = false;
          const pad = 18;
          const spikeHeight = 15;
          const spikeWidth = 16;

          if (spike.side === "left") {
            if (ball.x - ball.r < pad + spikeHeight && ball.x + ball.r > pad) {
              if (Math.abs(ball.y - spike.y) < ball.r + spikeWidth / 2) {
                hit = true;
              }
            }
          } else if (spike.side === "right") {
            const xLimit = game.width - pad - spikeHeight;
            if (ball.x + ball.r > xLimit && ball.x - ball.r < game.width - pad) {
              if (Math.abs(ball.y - spike.y) < ball.r + spikeWidth / 2) {
                hit = true;
              }
            }
          } else if (spike.side === "top") {
            if (ball.y - ball.r < pad + spikeHeight && ball.y + ball.r > pad) {
              if (Math.abs(ball.x - spike.x) < ball.r + spikeWidth / 2) {
                hit = true;
              }
            }
          } else if (spike.side === "bottom") {
            const yLimit = game.height - pad - spikeHeight;
            if (ball.y + ball.r > yLimit && ball.y - ball.r < game.height - pad) {
              if (Math.abs(ball.x - spike.x) < ball.r + spikeWidth / 2) {
                hit = true;
              }
            }
          }

          if (hit) {
            applyDamage(ball, game.balance.wallSpike.spikeDamage, `${ball.id}-wallspike-${spike.createdTime}`, game.simTime, 500);
            let sx = ball.x, sy = ball.y;
            if (spike.side === "left") sx = pad + 8;
            else if (spike.side === "right") sx = game.width - pad - 8;
            else if (spike.side === "top") sy = pad + 8;
            else if (spike.side === "bottom") sy = game.height - pad - 8;
            spawnSparks(sx, sy, "#ea580c", 10);
          }
        });

        return true;
      });
    };

    const updateStrings = () => {
      if (!game.strings) return;
      game.strings = game.strings.filter((str) => {
        game.balls.forEach((ball) => {
          if (ball.side === str.ownerSide) return;

          const dist = linePointDist(ball.x, ball.y, str.x1, str.y1, str.x2, str.y2);
          if (dist < ball.r) {
            if (!str.damagedIds) str.damagedIds = {};
            if (str.damagedIds[ball.id]) return;
            str.damagedIds[ball.id] = true;
            applyDamage(ball, game.balance.stringWeb.stringDamage, `${ball.id}-string-${str.createdTime}`, game.simTime, 9999999);
            
            const A = ball.x - str.x1, B = ball.y - str.y1, C = str.x2 - str.x1, D = str.y2 - str.y1;
            const dot = A * C + B * D, lenSq = C * C + D * D;
            let param = -1;
            if (lenSq !== 0) param = dot / lenSq;
            let xx, yy;
            if (param < 0) { xx = str.x1; yy = str.y1; }
            else if (param > 1) { xx = str.x2; yy = str.y2; }
            else { xx = str.x1 + param * C; yy = str.y1 + param * D; }
            
            spawnSparks(xx, yy, "#d946ef", 8);
          }
        });

        return true;
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

    const drawWallSpikes = () => {
      if (!game.wallSpikes) return;
      game.wallSpikes.forEach((spike) => {
        ctx.save();
        ctx.translate(spike.x, spike.y);

        ctx.globalAlpha = 1.0;

        ctx.fillStyle = spike.ownerSide === "left" ? "#f59e0b" : "#ea580c";
        ctx.strokeStyle = "#ffedd5";
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        if (spike.side === "left") {
          ctx.moveTo(0, -8);
          ctx.lineTo(15, 0);
          ctx.lineTo(0, 8);
        } else if (spike.side === "right") {
          ctx.moveTo(0, -8);
          ctx.lineTo(-15, 0);
          ctx.lineTo(0, 8);
        } else if (spike.side === "top") {
          ctx.moveTo(-8, 0);
          ctx.lineTo(0, 15);
          ctx.lineTo(8, 0);
        } else if (spike.side === "bottom") {
          ctx.moveTo(-8, 0);
          ctx.lineTo(0, -15);
          ctx.lineTo(8, 0);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      });
    };

    const drawStrings = () => {
      if (!game.strings) return;
      game.strings.forEach((str) => {
        ctx.save();

        ctx.strokeStyle = str.ownerSide === "left" ? "#c084fc" : "#e879f9";
        ctx.lineWidth = 3;
        ctx.shadowColor = str.ownerSide === "left" ? "#a855f7" : "#d946ef";
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

        const drawEndpoint = (x, y, label) => {
          ctx.save();
          ctx.shadowBlur = 0;
          ctx.fillStyle = str.ownerSide === "left" ? "#581c87" : "#86198f";
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(x, y, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 10px ui-sans-serif, system-ui";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(label, x, y + 0.5);
          ctx.restore();
        };
        drawEndpoint(str.x1, str.y1, "1");
        drawEndpoint(str.x2, str.y2, "2");

        ctx.restore();
      });
    };

    const drawVenomPools = () => {
      if (!game.venomPools) return;
      game.venomPools.forEach((pool) => {
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
      });
    };

    const drawWallSpikeBall = (ball) => {
      const config = BALL_TYPES.wallSpike;
      ctx.save(); ctx.translate(ball.x, ball.y);
      
      ctx.beginPath(); ctx.arc(0, 0, ball.r, 0, Math.PI * 2);
      ctx.fillStyle = config.color; ctx.fill();
      ctx.lineWidth = 4; ctx.strokeStyle = config.stroke; ctx.stroke();

      ctx.fillStyle = "#ffedd5";
      ctx.strokeStyle = "#ea580c";
      ctx.lineWidth = 1;
      const spikeCount = 6;
      for (let i = 0; i < spikeCount; i++) {
        const a = (i / spikeCount) * Math.PI * 2 + (game.simTime * 0.002);
        ctx.save();
        ctx.rotate(a);
        ctx.beginPath();
        ctx.moveTo(ball.r - 2, -4);
        ctx.lineTo(ball.r + 5, 0);
        ctx.lineTo(ball.r - 2, 4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      
      ctx.beginPath();
      ctx.moveTo(-6, -10);
      ctx.lineTo(-6, 10);
      ctx.stroke();
      
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.moveTo(-6, -4);
      ctx.lineTo(8, 0);
      ctx.lineTo(-6, 4);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
      drawHealthInsideBall(ball);
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

    const drawWinner = (winner) => {
      if (!winner) return;
      ctx.fillStyle = "rgba(15, 23, 42, 0.85)"; ctx.fillRect(0, 0, game.width, game.height);
      ctx.fillStyle = "#f8fafc"; ctx.font = "bold 36px sans-serif";
      ctx.textAlign = "center"; ctx.fillText(`${winner} wins!`, game.width / 2, game.height / 2);
      ctx.font = "16px sans-serif"; ctx.fillText("Reset fight or choose new balls", game.width / 2, game.height / 2 + 36);
      ctx.textAlign = "start";
    };

    const loop = (time) => {
      const dt = Math.min((time - (game.lastTime || time)) / 1000, 0.025);
      game.lastTime = time;
      const left = game.balls[0], right = game.balls[1];

      if (gameStarted && left.health > 0 && right.health > 0) {
        const steps = Math.ceil(game.simulationSpeed), stepDt = (dt * game.simulationSpeed) / steps;
        for (let s = 0; s < steps; s++) {
          game.simTime += stepDt * 1000;

          game.balls.forEach((ball) => {
            const isPulling = ball.type === "spider" && ball.webState === "pulling";
            const isChargingHammer = ball.type === "hammer" && ball.hammerState === "charging";
            
            const isLatchedTarget = game.balls.some(b => b.type === "vampire" && b.latchedTo === ball.id && b.latchUntil > game.simTime);
            const isLatchedSelf = ball.type === "vampire" && ball.latchedTo && ball.latchUntil > game.simTime;
            const isArmGrabbed = game.balls.some(b => b.type === "arm" && b.armState === "grabbing" && b.armStateUntil > game.simTime && b.id !== ball.id);
            let slowMult = (isLatchedTarget || isLatchedSelf) ? 0.4 : 1.0;
            const insideWeb = game.venomPools.some((pool) => {
              if (ball.side === pool.ownerSide) return false;
              const dist = Math.hypot(ball.x - pool.x, ball.y - pool.y);
              return dist < ball.r + pool.r;
            });
            if (insideWeb) slowMult *= 0.6;

            if (isChessCrownActive(ball) || (!isPulling && !isLatchedSelf && !isChargingHammer && !isArmGrabbed)) {
              ball.x += ball.vx * stepDt * slowMult; ball.y += ball.vy * stepDt * slowMult;
              handleWallBounce(ball);
            }
            if (!ball.trail) ball.trail = [];
            ball.trail.push({ x: ball.x, y: ball.y });
            if (ball.trail.length > 10) ball.trail.shift();

            const baseSpeed = 220, currentSpeed = Math.hypot(ball.vx, ball.vy);
            if (currentSpeed > baseSpeed) {
              const damp = Math.pow(0.95, stepDt * 60);
              const newSpeed = baseSpeed + (currentSpeed - baseSpeed) * damp;
              ball.vx = (ball.vx / currentSpeed) * newSpeed; ball.vy = (ball.vy / currentSpeed) * newSpeed;
            } else if (currentSpeed < baseSpeed * 0.7 && currentSpeed > 10) {
              const accel = Math.pow(0.98, stepDt * 60);
              const newSpeed = baseSpeed * 0.7 + (currentSpeed - baseSpeed * 0.7) * accel;
              ball.vx = (ball.vx / currentSpeed) * newSpeed; ball.vy = (ball.vy / currentSpeed) * newSpeed;
            }
          });

          const collided = resolveBallCollision(left, right);
          if (collided) {
            playSound("ballCollision", 1, 80);
            if (game.simTime >= 3000) {
            if (left.type === "spike") applyDamage(right, game.balance.spike.collisionDamage, `${left.id}-spike-hit`, game.simTime, game.balance.spike.cooldown);
            if (right.type === "spike") applyDamage(left, game.balance.spike.collisionDamage, `${right.id}-spike-hit`, game.simTime, game.balance.spike.cooldown);
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
                    enemy.vx += Math.cos(angle) * game.balance.shield.knockback * 15;
                    enemy.vy += Math.sin(angle) * game.balance.shield.knockback * 15;
                    spawnShieldSparks(enemy.x - Math.cos(angle) * enemy.r, enemy.y - Math.sin(angle) * enemy.r, angle);
                    registerShieldGuardHit(b, angle, game.simTime);
                  }
              }
            });
          }
        }

          game.balls.forEach((ball) => {
            const target = ball.side === "left" ? right : left;
            if (game.simTime >= 3000) {
                if (ball.type === "knife") {
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
                if (ball.type === "spike" && distance(ball, target) < ball.r + target.r + game.balance.spike.spikeReach) {
                  applyDamage(target, game.balance.spike.touchDamage, `${ball.id}-spike-touch`, game.simTime, game.balance.spike.cooldown);
                  spawnSparks(target.x + (Math.random() - 0.5) * target.r, target.y + (Math.random() - 0.5) * target.r, "#fca5a5", 2);
                }
                if (ball.type === "gun") updateGun(ball, target, game.simTime);
                if (ball.type === "vampire") updateVampire(ball, target, game.simTime);
                if (ball.type === "bomb") updateBomb(ball, target, game.simTime);
                if (ball.type === "laser") updateLaser(ball, target, game.simTime);
                
                // New Weapon Ticks
                if (ball.type === "spider") updateSpider(ball, target, game.simTime, stepDt);
                if (ball.type === "bomber") updateBomber(ball, target, game.simTime);
                if (ball.type === "spore") updateSpore(ball, target, game.simTime);
                if (ball.type === "hammer") updateHammer(ball, target, game.simTime);
                if (ball.type === "arm") updateArm(ball, target, game.simTime, stepDt);
                if (ball.type === "chess") updateChess(ball, target, game.simTime, stepDt);
                
                if (ball.type === "shield") updateShield(ball, target, game.simTime, stepDt);
            }
          });

          updateBullets(stepDt, game.balls);
          updateBombs(stepDt, game.balls);
          updateSpiderWebProjectile(stepDt, game.balls);
          updateMines(stepDt, game.balls);
          updateExplosions(stepDt);
          updateParticles(stepDt);
          updateFloatingTexts(stepDt);
          updateCacti(stepDt);
          updateWallSpikes(stepDt);
          updateStrings(stepDt);
          updateVenomPools(stepDt);
        }
      } else if (!gameStarted) {
        game.balls.forEach((ball) => {
          ball.x += ball.vx * dt; ball.y += ball.vy * dt;
          handleWallBounce(ball);
          if (!ball.trail) ball.trail = [];
          ball.trail.push({ x: ball.x, y: ball.y });
          if (ball.trail.length > 10) ball.trail.shift();

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
        updateWallSpikes(dt);
        updateStrings(dt);
      }

      drawArena();

      ctx.save();
      // Clip rendering of gameplay elements to the arena boundaries
      ctx.beginPath();
      ctx.rect(0, 0, game.width, game.height);
      ctx.clip();

      if (game.screenShake > 0.1) {
        const sx = (Math.random() - 0.5) * game.screenShake;
        const sy = (Math.random() - 0.5) * game.screenShake;
        ctx.translate(sx, sy);
        game.screenShake *= Math.pow(0.85, dt * 60);
      }

      game.balls.forEach(drawBallTrail);
      drawWallSpikes(); drawStrings(); drawVenomPools();
      drawMines(); drawBullets(); drawBombs(); drawExplosions(); drawParticles(); drawFloatingTexts(); drawCacti();
      drawBall(left, game.simTime); drawBall(right, game.simTime);
      ctx.restore();

      const winner = gameStarted ? left.health <= 0 ? right.name : right.health <= 0 ? left.name : null : null;
      if (winner && !game.roundOverSoundPlayed) {
        game.roundOverSoundPlayed = true;
        playSound("roundWin");
      }
      if (!gameStarted) {
        ctx.fillStyle = "rgba(15, 23, 42, 0.4)"; ctx.fillRect(18, 18, game.width - 36, game.height - 36);
      } else {
        drawWinner(winner);
      }

      setGameState((prev) => {
        const next = {
          leftHealth: Math.ceil(left.health), rightHealth: Math.ceil(right.health),
          leftName: left.name, rightName: right.name, winner, running: gameStarted && !winner
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
  }, [gameStarted, simulationSpeed, viewMode]);

  const renderSlider = (label, type, key, min, max, step = 1, unit = "") => {
    const isDamageSetting = key.toLowerCase().includes("damage") || key === "drainPerTick";
    const effectiveMin = isDamageSetting ? Math.max(min, MIN_DAMAGE) : min;
    const val = Math.max(effectiveMin, balanceSettings[type][key]);
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
        <div className="flex items-center gap-2 font-bold text-sm" style={{ color: config.color }}>
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
          {type === "spike" && (
            <>
              {renderSlider("Collision Damage", "spike", "collisionDamage", 1, 20)}
              {renderSlider("Touch Damage", "spike", "touchDamage", 1, 15)}
              {renderSlider("Hit Cooldown", "spike", "cooldown", 100, 1500, 10, "ms")}
              {renderSlider("Spike Reach", "spike", "spikeReach", 5, 30, 1, "px")}
            </>
          )}
          {type === "gun" && (
            <>
              {renderSlider("Bullet Damage", "gun", "bulletDamage", 2, 30)}
              {renderSlider("Shot Cooldown", "gun", "shotCooldown", 100, 1500, 10, "ms")}
              {renderSlider("Reload Time", "gun", "reloadTime", 500, 4000, 50, "ms")}
              {renderSlider("Bullet Speed", "gun", "bulletSpeed", 100, 800, 10, "px/s")}
              {renderSlider("Sec: Dash Cooldown", "gun", "secCooldown", 1000, 8000, 100, "ms")}
              {renderSlider("Sec: Dash Force", "gun", "secDashForce", 100, 800, 20, "px/s")}
            </>
          )}
          {type === "vampire" && (
            <>
              {renderSlider("Drain Rate", "vampire", "drainPerTick", 1, 10, 1, "/tick")}
              {renderSlider("Heal Rate", "vampire", "healPerTick", 1, 8, 1, "/tick")}
              {renderSlider("Drain Cooldown", "vampire", "tickCooldown", 50, 800, 10, "ms")}
              {renderSlider("Latch Duration", "vampire", "latchDuration", 200, 3000, 50, "ms")}
              {renderSlider("Latch Cooldown", "vampire", "latchCooldown", 1000, 6000, 100, "ms")}
            </>
          )}
          {type === "bomb" && (
            <>
              {renderSlider("Explosion Damage", "bomb", "damage", 5, 40)}
              {renderSlider("Fuse Duration", "bomb", "fuseTime", 400, 2500, 50, "ms")}
              {renderSlider("Explosion Radius", "bomb", "radius", 30, 180, 5, "px")}
              {renderSlider("Throw Cooldown", "bomb", "cooldown", 500, 4000, 50, "ms")}
              {renderSlider("Knockback Force", "bomb", "knockback", 5, 40, 1)}
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
              {renderSlider("Sec: Sweep Cooldown", "laser", "secCooldown", 1000, 8000, 100, "ms")}
              {renderSlider("Sec: Sweep Damage", "laser", "secDamage", 1, 20)}
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
              {renderSlider("Sec: Bash Cooldown (Held)", "shield", "secCooldownHeld", 1000, 8000, 100, "ms")}
              {renderSlider("Sec: Recall Cooldown (Thrown)", "shield", "secCooldownThrown", 1000, 8000, 100, "ms")}
              {renderSlider("Sec: Bash Damage", "shield", "secBashDamage", 1, 20)}
            </>
          )}
          {type === "spider" && (
            <>
              {renderSlider("Fang Damage", "spider", "fangDamage", 3, 20)}
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
              {renderSlider("Mine Damage", "bomber", "mineDamage", 5, 40)}
              {renderSlider("Explosion Radius", "bomber", "mineRadius", 30, 150, 5, "px")}
              {renderSlider("Trigger Range", "bomber", "mineTriggerDist", 5, 40, 1, "px")}
              {renderSlider("Lay Cooldown", "bomber", "cooldown", 500, 4000, 50, "ms")}
              {renderSlider("Knockback Force", "bomber", "knockback", 5, 40, 1)}
            </>
          )}

          {type === "spore" && (
            <>
              {renderSlider("Hydra Damage", "spore", "cactusDamage", 2, 30)}
              {renderSlider("Growth Duration", "spore", "growthDuration", 300, 2500, 50, "ms")}
              {renderSlider("Speed Boost Force", "spore", "speedBoost", 1.1, 2.0, 0.05)}
              {renderSlider("Hydra Lifetime", "spore", "cactusLife", 3000, 12000, 500, "ms")}
              {renderSlider("Drop Cooldown", "spore", "cooldown", 1000, 8000, 100, "ms")}
            </>
          )}
          {type === "hammer" && (
            <>
              {renderSlider("Spin Damage", "hammer", "spinDamage", 1, 20)}
              {renderSlider("Launch Damage", "hammer", "launchDamage", 5, 50)}
              {renderSlider("Spin Speed", "hammer", "spinSpeed", 0.05, 0.35, 0.01)}
              {renderSlider("Charge Duration", "hammer", "chargeDuration", 300, 2500, 50, "ms")}
              {renderSlider("Launch Speed", "hammer", "launchSpeed", 300, 1500, 20, "px/s")}
              {renderSlider("Launch Duration", "hammer", "launchDuration", 300, 2000, 50, "ms")}
            </>
          )}
          {type === "wallSpike" && (
            <>
              {renderSlider("Spike Damage", "wallSpike", "spikeDamage", 2, 35)}
              {renderSlider("Spike Lifetime", "wallSpike", "spikeLifetime", 2000, 15000, 500, "ms")}
              {renderSlider("Max Spikes", "wallSpike", "maxSpikes", 2, 16)}
            </>
          )}
          {type === "stringWeb" && (
            <>
              {renderSlider("String Damage", "stringWeb", "stringDamage", 2, 35)}
            </>
          )}
          {type === "arm" && (
            <>
              {renderSlider("Slam Damage", "arm", "slamDamage", 2, 50)}
              {renderSlider("Grab Range", "arm", "grabRange", 40, 200, 5, "px")}
              {renderSlider("Grab Duration", "arm", "grabDuration", 500, 3000, 100, "ms")}
              {renderSlider("Swing Speed", "arm", "swingSpeed", 0.02, 0.2, 0.01)}
              {renderSlider("Cooldown", "arm", "cooldown", 1000, 8000, 100, "ms")}
              {renderSlider("Sec: Elbow Drop Cooldown", "arm", "secCooldown", 1000, 8000, 100, "ms")}
              {renderSlider("Sec: Elbow Drop Damage", "arm", "secSlamDamage", 2, 30)}
            </>
          )}
          {type === "chess" && (
            <>
              {renderSlider("Cooldown", "chess", "cooldown", 1000, 12000, 100, "ms")}
              {renderSlider("Center Travel Speed", "chess", "centerSpeed", 100, 800, 10, "px/s")}
              {renderSlider("Crown Duration", "chess", "crownDuration", 500, 6000, 100, "ms")}
              {renderSlider("Crown Damage", "chess", "damage", 2, 40)}
              {renderSlider("Damage Tick Rate", "chess", "tickCooldown", 100, 1500, 50, "ms")}
            </>
          )}
        </div>
      </div>
    );
  };
  const renderAppContent = () => {
    return (
      <div className={`space-y-6 ${viewMode === "mobile" ? "space-y-4" : ""}`}>
        {/* Header */}
        <div className={`flex flex-col gap-4 border-b border-slate-900 pb-5 ${viewMode === "desktop" ? "md:flex-row md:items-center md:justify-between" : ""}`}>
          <div>
            <h1 className={`font-extrabold tracking-tight bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent ${viewMode === "desktop" ? "text-3xl md:text-4xl" : "text-2xl text-center"}`}>
              Ball Weapon Simulator
            </h1>
            <p className={`mt-1.5 text-xs text-slate-400 ${viewMode === "desktop" ? "text-sm" : "text-center"}`}>
              Customize balances, run simulations, or trigger automated tournament models in memory.
            </p>
          </div>
          <div className={`flex flex-wrap gap-2.5 items-center ${viewMode === "mobile" ? "justify-center" : ""}`}>
            {/* View Mode Toggle Switch */}
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 shadow-inner">
              <button
                type="button"
                onClick={() => setViewMode("desktop")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "desktop"
                    ? "bg-sky-600 text-white shadow-md shadow-sky-500/25"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Desktop
              </button>
              <button
                type="button"
                onClick={() => setViewMode("mobile")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "mobile"
                    ? "bg-sky-600 text-white shadow-md shadow-sky-500/25"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Mobile
              </button>
            </div>

            <Button onClick={resetFight} className="rounded-xl px-4 py-1.5 bg-sky-600 hover:bg-sky-500 font-bold text-xs" disabled={!gameStarted}>
              Reset Fight
            </Button>
            <Button onClick={resetToSelection} variant="secondary" className="rounded-xl px-4 py-1.5 bg-slate-800 text-slate-200 hover:bg-slate-700 font-bold text-xs">
              Choose Balls
            </Button>
            <Button
              type="button"
              onClick={() => {
                const nextMuted = toggleMute();
                setMutedState(nextMuted);
              }}
              variant="outline"
              className="rounded-xl px-3.5 py-1.5 border-slate-800 bg-slate-900/40 text-slate-300 hover:text-slate-100 hover:bg-slate-850 text-xs font-bold flex items-center gap-1.5"
            >
              {mutedState ? (
                <>
                  <svg className="w-3.5 h-3.5 text-rose-400" fill="currentColor" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.21.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
                  Muted
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 text-sky-400" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                  Sound On
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Speed Controls */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-900/40 border border-slate-900 rounded-2xl px-4 py-2.5 backdrop-blur-sm justify-center md:justify-start">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Simulation Speed:</span>
          <div className="flex gap-1.5">
            {[1, 1.5, 2].map((speed) => (
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
        <div className={`grid gap-6 ${viewMode === "desktop" ? "lg:grid-cols-12" : "grid-cols-1"}`}>
          
          {/* Left Column: Canvas & Live Stats */}
          <div className={`${viewMode === "desktop" ? "lg:col-span-8" : "col-span-1"} space-y-6`}>
            <Card className="overflow-hidden rounded-2xl border-slate-900 bg-slate-900/30 backdrop-blur-md shadow-2xl">
              <CardContent className="flex justify-center p-3 md:p-4">
                <div className="overflow-hidden rounded-xl border border-slate-900 w-full flex justify-center bg-slate-950/60">
                  <canvas ref={canvasRef} className="block max-w-full shadow-lg" />
                </div>
              </CardContent>
            </Card>

            {/* Health Bars & Match Status */}
            <div className={`grid gap-4 ${viewMode === "desktop" ? "sm:grid-cols-3" : "grid-cols-1"}`}>
              <Card className="rounded-2xl border-slate-900 bg-slate-900/40 backdrop-blur-sm text-slate-100 p-5 shadow-lg">
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Fighter 1</div>
                <div className="mt-1 text-xl font-bold truncate" style={{ color: BALL_TYPES[selectedBalls[0]]?.color }}>{gameState.leftName}</div>
                <div className="mt-2.5 flex items-center justify-between text-sm">
                  <span className="text-slate-400">HP:</span>
                  <span className="text-base font-bold text-slate-200">{gameState.leftHealth}</span>
                </div>
                <div className="w-full bg-slate-850 h-2 rounded-full mt-2 overflow-hidden border border-slate-900">
                  <div className="h-full rounded-full transition-all duration-300" style={{ width: `${gameState.leftHealth}%`, backgroundColor: BALL_TYPES[selectedBalls[0]]?.color }} />
                </div>
              </Card>

              <Card className="rounded-2xl border-slate-900 bg-slate-900/40 backdrop-blur-sm text-slate-100 p-5 shadow-lg">
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Fighter 2</div>
                <div className="mt-1 text-xl font-bold truncate" style={{ color: BALL_TYPES[selectedBalls[1]]?.color }}>{gameState.rightName}</div>
                <div className="mt-2.5 flex items-center justify-between text-sm">
                  <span className="text-slate-400">HP:</span>
                  <span className="text-base font-bold text-slate-200">{gameState.rightHealth}</span>
                </div>
                <div className="w-full bg-slate-850 h-2 rounded-full mt-2 overflow-hidden border border-slate-900">
                  <div className="h-full rounded-full transition-all duration-300" style={{ width: `${gameState.rightHealth}%`, backgroundColor: BALL_TYPES[selectedBalls[1]]?.color }} />
                </div>
              </Card>

              <Card className="rounded-2xl border-slate-900 bg-slate-900/40 backdrop-blur-sm text-slate-100 p-5 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Combat Status</div>
                  <div className="mt-1 text-lg font-bold text-sky-400">
                    {gameState.winner ? `${gameState.winner} Wins!` : gameState.running ? "Fighting..." : "Ready to Brawl"}
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
                        <th className="pb-2.5 font-bold" style={{ color: BALL_TYPES[selectedBalls[0]]?.color }}>{gameState.leftName}</th>
                        <th className="pb-2.5 font-bold" style={{ color: BALL_TYPES[selectedBalls[1]]?.color }}>{gameState.rightName}</th>
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
          <div className={`${viewMode === "desktop" ? "lg:col-span-4" : "col-span-1"} space-y-6`}>
            
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
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded border" style={{ backgroundColor: `${selectedBall?.color}15`, color: selectedBall?.color, borderColor: `${selectedBall?.color}40` }}>
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
                
                <Button onClick={startFight} className="w-full rounded-xl py-5 text-sm font-bold bg-sky-600 hover:bg-sky-500 shadow-lg shadow-sky-500/25">
                  Launch Simulator
                </Button>
              </CardContent>
            </Card>

            {/* Active Balance Settings */}
            <Card className="rounded-2xl border-slate-900 bg-slate-900/30 backdrop-blur-md text-slate-100 shadow-xl">
              <CardContent className="p-5 space-y-4 flex flex-col max-h-[500px] overflow-y-auto">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 border-b border-slate-900 pb-2">Balance Tuning</h3>
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
                        <span style={{ color: BALL_TYPES[selectedBalls[0]]?.color }}>{BALL_TYPES[selectedBalls[0]]?.name} ({tournamentResults.leftWinRate}%)</span>
                        <span style={{ color: BALL_TYPES[selectedBalls[1]]?.color }}>({tournamentResults.rightWinRate}%) {BALL_TYPES[selectedBalls[1]]?.name}</span>
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
      <style>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      {viewMode === "mobile" ? (
        /* Mobile Phone Mockup Frame */
        <div className="relative w-[385px] h-[820px] rounded-[48px] border-[10px] border-slate-800 bg-slate-950 shadow-2xl overflow-hidden flex flex-col ring-2 ring-slate-700/50">
          {/* Status Bar / Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-50 flex items-center justify-center">
            <div className="w-12 h-1 bg-slate-900 rounded-full mb-1" />
          </div>
          {/* Scrollable Screen Content */}
          <div className="flex-1 overflow-y-auto px-3 py-6 pt-10 scrollbar-none">
            {renderAppContent()}
          </div>
          {/* Home Indicator */}
          <div className="h-6 w-full flex items-center justify-center bg-slate-950 border-t border-slate-900/60 z-40">
            <div className="w-28 h-1 bg-slate-800 rounded-full" />
          </div>
        </div>
      ) : (
        /* Full Desktop Container */
        <div className="w-full max-w-[1600px] space-y-6">
          {renderAppContent()}
        </div>
      )}
    </div>
  );
}
