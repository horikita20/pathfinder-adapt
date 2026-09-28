/**
 * SAFEMARG — driving simulation engine.
 * Pure TypeScript, framework agnostic. The 3D layer reads this state every frame.
 */

export type CameraMode = "inside" | "outside" | "overview";
export type DriveMode = "auto" | "manual";
export type RiskLevel = "low" | "medium" | "high";

export type ActorKind =
  | "car"
  | "auto"
  | "bike"
  | "bus"
  | "truck"
  | "cycle"
  | "pedestrian"
  | "cow"
  | "vendor"
  | "barrier"
  | "pothole"
  | "debris";

export interface Actor {
  id: number;
  kind: ActorKind;
  x: number;
  z: number;
  heading: number; // radians, 0 = travelling with the ego (+z)
  speed: number; // m/s
  width: number;
  length: number;
  height: number;
  color: string;
  wander: number;
  phase: number;
  oncoming: boolean;
  fixed: boolean;
  // perception output
  detected: boolean;
  distance: number;
  risk: RiskLevel;
  confidence: number;
}

export interface SimEvent {
  id: number;
  t: number;
  kind: "brake" | "avoid" | "warning" | "detect";
  label: string;
}

export interface Metrics {
  speedKph: number;
  detected: number;
  tracked: number;
  nearest: { label: string; distance: number } | null;
  risk: RiskLevel;
  latencyMs: number;
  completion: number;
  distanceM: number;
  brakeEvents: number;
  warnings: number;
  avoidances: number;
  sensorHealth: number;
}

export interface Scenario {
  id: string;
  name: string;
  brief: string;
  roadWidth: number;
  lengthM: number;
  speedLimit: number; // m/s
  fog: number;
  density: Partial<Record<ActorKind, number>>;
}

export const SCENARIOS: Scenario[] = [
  {
    id: "market",
    name: "Dense Urban Market",
    brief: "Narrow bazaar street, vendors spilling onto the carriageway, constant pedestrian flow.",
    roadWidth: 9,
    lengthM: 1200,
    speedLimit: 8,
    fog: 0.016,
    density: { auto: 7, bike: 10, pedestrian: 14, vendor: 8, cycle: 4, car: 4, cow: 1, pothole: 5, debris: 3 },
  },
  {
    id: "village",
    name: "Unmarked Village Road",
    brief: "No lane markings, broken edges, tractors and cattle sharing a single usable lane.",
    roadWidth: 7,
    lengthM: 1400,
    speedLimit: 11,
    fog: 0.012,
    density: { bike: 6, cow: 4, pedestrian: 6, cycle: 5, truck: 2, auto: 3, pothole: 12, debris: 4 },
  },
  {
    id: "intersection",
    name: "Unsignalised Intersection",
    brief: "Four-way crossing with no signals — vehicles negotiate by nosing in.",
    roadWidth: 10,
    lengthM: 1000,
    speedLimit: 9,
    fog: 0.014,
    density: { auto: 8, bike: 9, car: 7, bus: 2, pedestrian: 9, cycle: 3, pothole: 4, barrier: 3 },
  },
  {
    id: "highway",
    name: "Highway Merge, Mixed Traffic",
    brief: "Faster traffic, wrong-side two-wheelers and a truck merging without indicating.",
    roadWidth: 12,
    lengthM: 2000,
    speedLimit: 19,
    fog: 0.008,
    density: { car: 10, truck: 6, bus: 3, bike: 7, auto: 3, barrier: 4, pothole: 3, debris: 2 },
  },
  {
    id: "cattle",
    name: "Cattle Crossing & Potholes",
    brief: "Stray cattle, a badly damaged surface and low visibility from road dust.",
    roadWidth: 8,
    lengthM: 1300,
    speedLimit: 10,
    fog: 0.022,
    density: { cow: 7, pothole: 16, bike: 6, auto: 4, pedestrian: 5, truck: 2, debris: 5, cycle: 2 },
  },
];

export interface DriverInput {
  throttle: number; // 0..1
  brake: number; // 0..1
  steer: number; // -1..1
}

export interface World {
  scenario: Scenario;
  actors: Actor[];
  ego: {
    x: number;
    z: number;
    speed: number;
    heading: number;
    braking: boolean;
    targetX: number;
  };
  path: Float32Array; // pairs of x,z, PATH_POINTS long
  mode: DriveMode;
  running: boolean;
  elapsed: number;
  metrics: Metrics;
  events: SimEvent[];
  nextId: number;
  seed: number;
}

export const PATH_POINTS = 24;
const SENSOR_RANGE = 70;

const KIND_SPECS: Record<
  ActorKind,
  { w: number; l: number; h: number; speed: [number, number]; colors: string[]; label: string }
> = {
  car: { w: 1.7, l: 4, h: 1.5, speed: [6, 14], colors: ["#c9ccd1", "#8d99a6", "#b23a3a", "#2f4a63", "#e4e6e8"], label: "Car" },
  auto: { w: 1.4, l: 2.7, h: 1.8, speed: [5, 10], colors: ["#f2c744", "#f2c744", "#e8b93c"], label: "Auto-rickshaw" },
  bike: { w: 0.8, l: 1.9, h: 1.5, speed: [6, 15], colors: ["#2b2f33", "#7a1f1f", "#1f3a5f", "#3d3d3d"], label: "Two-wheeler" },
  bus: { w: 2.5, l: 10, h: 3.2, speed: [5, 11], colors: ["#2c6e49", "#b5432f", "#3a5a8c"], label: "Bus" },
  truck: { w: 2.4, l: 8, h: 3.4, speed: [5, 12], colors: ["#d6552b", "#2e6da4", "#c9a227"], label: "Truck" },
  cycle: { w: 0.6, l: 1.7, h: 1.6, speed: [2.5, 5], colors: ["#3b3b3b", "#4b6b4b"], label: "Cyclist" },
  pedestrian: { w: 0.55, l: 0.4, h: 1.7, speed: [0.8, 1.9], colors: ["#e0d7c8", "#c96a4b", "#4f6d7a", "#8a6f9e"], label: "Pedestrian" },
  cow: { w: 1, l: 2.3, h: 1.5, speed: [0, 1.2], colors: ["#d9cfc0", "#8a7b6b", "#efe7dc"], label: "Cattle" },
  vendor: { w: 2, l: 2.4, h: 2.1, speed: [0, 0], colors: ["#c05a2e", "#3f7d5c", "#b3903a"], label: "Street vendor" },
  barrier: { w: 0.7, l: 0.7, h: 1, speed: [0, 0], colors: ["#e8622c"], label: "Barrier" },
  pothole: { w: 1.4, l: 1.8, h: 0.05, speed: [0, 0], colors: ["#1a1a1a"], label: "Pothole" },
  debris: { w: 0.8, l: 0.8, h: 0.4, speed: [0, 0], colors: ["#6b5a43", "#4a4a4a"], label: "Unknown object" },
};

export function actorLabel(kind: ActorKind) {
  return KIND_SPECS[kind].label;
}

function mulberry(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(v: number, a: number, b: number) {
  return v < a ? a : v > b ? b : v;
}

function spawnActor(world: World, kind: ActorKind, rand: () => number, zAt: number): Actor {
  const spec = KIND_SPECS[kind];
  const half = world.scenario.roadWidth / 2;
  const fixed = spec.speed[1] === 0;
  const roadside = kind === "vendor";
  const oncoming = !fixed && kind !== "pedestrian" && kind !== "cow" && rand() < 0.3;
  let x: number;
  if (roadside) x = (rand() < 0.5 ? -1 : 1) * (half + 1.2 + rand() * 1.6);
  else if (kind === "pedestrian") x = -half - 1 + rand() * (world.scenario.roadWidth + 2);
  else x = clamp((rand() * 2 - 1) * (half - 0.9), -half + 0.6, half - 0.6);

  return {
    id: world.nextId++,
    kind,
    x,
    z: zAt,
    heading: oncoming ? Math.PI : 0,
    speed: fixed ? 0 : spec.speed[0] + rand() * (spec.speed[1] - spec.speed[0]),
    width: spec.w,
    length: spec.l,
    height: spec.h,
    color: spec.colors[Math.floor(rand() * spec.colors.length)]!,
    wander: kind === "bike" || kind === "auto" ? 0.5 + rand() : rand() * 0.3,
    phase: rand() * Math.PI * 2,
    oncoming,
    fixed,
    detected: false,
    distance: 999,
    risk: "low",
    confidence: 0,
  };
}

export function createWorld(scenarioId: string, seed = 1337): World {
  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0]!;
  const world: World = {
    scenario,
    actors: [],
    ego: { x: scenario.roadWidth / 4, z: 0, speed: 0, heading: 0, braking: false, targetX: scenario.roadWidth / 4 },
    path: new Float32Array(PATH_POINTS * 2),
    mode: "auto",
    running: false,
    elapsed: 0,
    events: [],
    nextId: 1,
    seed,
    metrics: {
      speedKph: 0,
      detected: 0,
      tracked: 0,
      nearest: null,
      risk: "low",
      latencyMs: 42,
      completion: 0,
      distanceM: 0,
      brakeEvents: 0,
      warnings: 0,
      avoidances: 0,
      sensorHealth: 100,
    },
  };
  const rand = mulberry(seed);
  for (const [kind, count] of Object.entries(scenario.density) as [ActorKind, number][]) {
    for (let i = 0; i < count; i++) {
      world.actors.push(spawnActor(world, kind, rand, 20 + rand() * 260));
    }
  }
  updatePath(world);
  return world;
}

function updatePath(world: World) {
  const { ego, path } = world;
  for (let i = 0; i < PATH_POINTS; i++) {
    const t = i / (PATH_POINTS - 1);
    const dz = t * 45;
    const x = ego.x + (ego.targetX - ego.x) * Math.min(1, t * 2.2);
    path[i * 2] = x;
    path[i * 2 + 1] = ego.z + dz;
  }
}

function pushEvent(world: World, kind: SimEvent["kind"], label: string) {
  const last = world.events[0];
  if (last && last.kind === kind && world.elapsed - last.t < 1.5) return;
  world.events.unshift({ id: world.nextId++, t: world.elapsed, kind, label });
  if (world.events.length > 40) world.events.pop();
}

export function stepWorld(world: World, dtRaw: number, input: DriverInput) {
  if (!world.running) return;
  const dt = Math.min(dtRaw, 0.05);
  world.elapsed += dt;
  const { ego, scenario } = world;
  const half = scenario.roadWidth / 2;
  const rand = mulberry((world.seed + Math.floor(world.elapsed * 7)) | 0);

  // ---- perception -------------------------------------------------------
  let detected = 0;
  let nearest: { label: string; distance: number } | null = null;
  let worstRisk: RiskLevel = "low";

  for (const a of world.actors) {
    const dz = a.z - ego.z;
    const dx = a.x - ego.x;
    const dist = Math.hypot(dx, dz);
    a.distance = dist;
    a.detected = dist < SENSOR_RANGE && dz > -12;
    a.confidence = a.detected ? clamp(0.99 - dist / 140 - (a.kind === "debris" ? 0.15 : 0), 0.4, 0.99) : 0;
    if (!a.detected) {
      a.risk = "low";
      continue;
    }
    detected++;
    const corridor = Math.abs(dx) < a.width / 2 + 1.4;
    const closing = dz > 0 && dz < 26 && corridor;
    a.risk = closing && dz < 12 ? "high" : closing ? "medium" : "low";
    if (a.risk === "high") worstRisk = "high";
    else if (a.risk === "medium" && worstRisk === "low") worstRisk = "medium";
    if (dz > -2 && (!nearest || dist < nearest.distance)) {
      nearest = { label: actorLabel(a.kind), distance: dist };
    }
  }

  // ---- planning ---------------------------------------------------------
  let bestOffset = ego.x;
  if (world.mode === "auto") {
    let bestCost = Infinity;
    for (let off = -half + 1; off <= half - 1; off += 0.4) {
      let cost = Math.abs(off - ego.x) * 0.55 + Math.abs(off) * 0.05;
      for (const a of world.actors) {
        if (!a.detected) continue;
        const dz = a.z - ego.z;
        if (dz < -3 || dz > 50) continue;
        const clearance = Math.abs(a.x - off) - (a.width / 2 + 1.15);
        if (clearance < 0) cost += (a.kind === "pothole" ? 14 : 60) * (1 - dz / 55);
        else if (clearance < 1.2) cost += (1.2 - clearance) * 8 * (1 - dz / 60);
      }
      if (cost < bestCost) {
        bestCost = cost;
        bestOffset = off;
      }
    }
    if (Math.abs(bestOffset - ego.targetX) > 0.9) {
      world.metrics.avoidances++;
      pushEvent(world, "avoid", `Replanned path around ${nearest?.label ?? "obstacle"}`);
    }
    ego.targetX = bestOffset;
  } else {
    ego.targetX = clamp(ego.x + input.steer * 2.5, -half + 0.8, half - 0.8);
  }

  // ---- longitudinal control --------------------------------------------
  let desired = scenario.speedLimit;
  let leadGap = Infinity;
  for (const a of world.actors) {
    if (!a.detected) continue;
    const dz = a.z - ego.z;
    if (dz <= 0 || dz > 45) continue;
    if (Math.abs(a.x - ego.targetX) > a.width / 2 + 1.3) continue;
    const rel = a.oncoming ? ego.speed + a.speed : Math.max(0.5, ego.speed - a.speed);
    const gapTime = dz / Math.max(rel, 0.5);
    if (dz < leadGap) leadGap = dz;
    if (gapTime < 3.5) desired = Math.min(desired, Math.max(0, a.oncoming ? 2 : a.speed * 0.9));
    if (dz < 9) desired = 0;
  }

  if (world.mode === "auto") {
    const accel = desired > ego.speed ? 2.6 : -6.5;
    ego.speed = clamp(ego.speed + accel * dt, 0, scenario.speedLimit);
    ego.braking = desired < ego.speed - 0.4;
    if (ego.braking && ego.speed > 4) {
      world.metrics.brakeEvents++;
      pushEvent(world, "brake", `Automatic braking — ${nearest?.label ?? "obstacle"} at ${leadGap.toFixed(0)} m`);
    }
  } else {
    const accel = input.throttle * 3.2 - input.brake * 8 - 0.5;
    ego.speed = clamp(ego.speed + accel * dt, 0, scenario.speedLimit * 1.35);
    ego.braking = input.brake > 0.05;
  }

  if (worstRisk === "high") {
    world.metrics.warnings++;
    pushEvent(world, "warning", `Collision risk — ${nearest?.label ?? "object"} ahead`);
  }

  // ---- integrate --------------------------------------------------------
  const lateralRate = clamp(1.4 + ego.speed * 0.12, 1.4, 4.5);
  const dx = clamp(ego.targetX - ego.x, -lateralRate * dt, lateralRate * dt);
  ego.x += dx;
  ego.heading = clamp((-dx / Math.max(dt, 0.001)) * 0.12, -0.35, 0.35);
  ego.z += ego.speed * dt;
  world.metrics.distanceM = ego.z;

  // ---- actors -----------------------------------------------------------
  for (const a of world.actors) {
    if (!a.fixed) {
      const dir = a.oncoming ? -1 : 1;
      a.z += a.speed * dt * dir;
      if (a.kind === "pedestrian") {
        a.x += Math.sin(world.elapsed * 0.5 + a.phase) * a.speed * dt * 1.6;
      } else if (a.kind === "cow") {
        a.x += Math.sin(world.elapsed * 0.22 + a.phase) * 0.35 * dt * 10;
      } else {
        a.x += Math.sin(world.elapsed * 0.7 + a.phase) * a.wander * dt;
      }
      a.x = clamp(a.x, -half - 1.5, half + 1.5);
    }
    const rel = a.z - ego.z;
    if (rel < -45 || rel > 340) {
      const fresh = spawnActor(world, a.kind, rand, ego.z + 140 + rand() * 180);
      fresh.id = a.id;
      Object.assign(a, fresh);
    }
  }

  updatePath(world);

  // ---- metrics ----------------------------------------------------------
  const m = world.metrics;
  m.speedKph = ego.speed * 3.6;
  m.detected = detected;
  m.tracked = detected;
  m.nearest = nearest;
  m.risk = worstRisk;
  m.latencyMs = 34 + Math.round(detected * 1.4 + Math.sin(world.elapsed) * 4);
  m.completion = clamp((ego.z / scenario.lengthM) * 100, 0, 100);
  m.sensorHealth = 96 + Math.round(Math.sin(world.elapsed * 0.3) * 3);
  if (m.completion >= 100) {
    world.running = false;
    pushEvent(world, "detect", "Scenario completed");
  }
}

export function resetWorld(world: World, scenarioId: string) {
  const fresh = createWorld(scenarioId, Math.floor(Math.random() * 100000));
  Object.assign(world, fresh);
}
