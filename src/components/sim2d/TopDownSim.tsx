import { useCallback, useEffect, useRef, useState } from "react";
import { KIND_META, SCENARIOS, type ObstacleKind, type Scenario } from "./scenarios";

type Obstacle = {
  id: number;
  kind: ObstacleKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  detected: boolean;
};

type Sensors = { camera: boolean; radar: boolean; lidar: boolean };

type Stats = {
  completion: number;
  detected: number;
  replans: number;
  latency: number;
  speed: number;
  collisions: number;
  status: "idle" | "running" | "complete" | "braking";
};

const SENSOR = {
  camera: { range: 38, halfAngle: (30 * Math.PI) / 180, color: "#22d3ee" },
  radar: { range: 58, halfAngle: (62 * Math.PI) / 180, color: "#34d399" },
  lidar: { range: 26, halfAngle: Math.PI, color: "#818cf8" },
};

const CORRIDOR = 1.7; // metres, half-width of the ego safety corridor
const PX_PER_M = 10;

function rand([a, b]: [number, number]) {
  return a + Math.random() * (b - a);
}

export default function TopDownSim() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0]!.id);
  const [sensors, setSensors] = useState<Sensors>({ camera: true, radar: true, lidar: true });
  const [running, setRunning] = useState(false);
  const [stats, setStats] = useState<Stats>({
    completion: 0,
    detected: 0,
    replans: 0,
    latency: 0,
    speed: 0,
    collisions: 0,
    status: "idle",
  });

  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0]!;
  const scenarioRef = useRef<Scenario>(scenario);
  const sensorsRef = useRef(sensors);
  const runningRef = useRef(running);
  sensorsRef.current = sensors;
  runningRef.current = running;

  const world = useRef({
    ego: { x: 0, y: 0, speed: 0, heading: 0 },
    obstacles: [] as Obstacle[],
    nextId: 1,
    offset: 0,
    targetOffset: 0,
    lastReplanOffset: 0,
    replans: 0,
    latency: 0,
    collisions: 0,
    spawnAcc: {} as Record<number, number>,
    time: 0,
  });

  const reset = useCallback((s: Scenario) => {
    const w = world.current;
    w.ego = { x: 0, y: 0, speed: 0, heading: 0 };
    w.obstacles = [];
    w.nextId = 1;
    w.offset = 0;
    w.targetOffset = 0;
    w.lastReplanOffset = 0;
    w.replans = 0;
    w.latency = 0;
    w.collisions = 0;
    w.spawnAcc = {};
    w.time = 0;
    for (let i = 0; i < s.initial; i++) {
      const rule = s.rules[Math.floor(Math.random() * s.rules.length)]!;
      w.obstacles.push({
        id: w.nextId++,
        kind: rule.kind,
        x: rand(rule.xRange),
        y: rand([15, s.goalDistance * 0.8]),
        vy: rand(rule.speed),
        vx: rand(rule.drift),
        detected: false,
      });
    }
    setStats({
      completion: 0,
      detected: 0,
      replans: 0,
      latency: 0,
      speed: 0,
      collisions: 0,
      status: "idle",
    });
  }, []);

  useEffect(() => {
    scenarioRef.current = scenario;
    setRunning(false);
    reset(scenario);
  }, [scenario, reset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let last = performance.now();
    let hudAcc = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const s = scenarioRef.current;
      const w = world.current;

      if (runningRef.current) {
        w.time += dt;
        step(w, s, dt);
      }

      const rect = canvas.getBoundingClientRect();
      draw(ctx, rect.width, rect.height, w, s, sensorsRef.current);

      hudAcc += dt;
      if (hudAcc > 0.1) {
        hudAcc = 0;
        const detected = w.obstacles.filter((o) => o.detected).length;
        const completion = Math.min(100, (w.ego.y / s.goalDistance) * 100);
        const done = w.ego.y >= s.goalDistance;
        if (done && runningRef.current) {
          runningRef.current = false;
          setRunning(false);
        }
        setStats({
          completion,
          detected,
          replans: w.replans,
          latency: w.latency,
          speed: w.ego.speed,
          collisions: w.collisions,
          status: done
            ? "complete"
            : !runningRef.current
              ? "idle"
              : w.ego.speed < s.egoTargetSpeed * 0.45
                ? "braking"
                : "running",
        });
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  const shoot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `safeautonomy-${scenario.id}.png`;
    a.click();
  };

  return (
    <div className="flex min-h-[100dvh] flex-col gap-3 bg-[#070b0f] p-3 text-[#e6edf3] lg:flex-row">
      <div className="relative min-h-[420px] flex-1 overflow-hidden rounded-xl border border-white/10 bg-[#080d12]">
        <canvas ref={canvasRef} className="h-full w-full" />
        <div className="pointer-events-none absolute left-3 top-3 rounded-md border border-white/10 bg-black/45 px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-[#22d3ee] backdrop-blur">
          {scenario.name}
        </div>
      </div>

      <aside className="w-full shrink-0 space-y-3 lg:w-[320px]">
        <Panel title="Scenario">
          <div className="grid gap-1.5">
            {SCENARIOS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setScenarioId(s.id)}
                className={`rounded-md border px-3 py-2 text-left font-mono text-[11px] transition ${
                  s.id === scenarioId
                    ? "border-[#22d3ee]/60 bg-[#22d3ee]/10 text-[#22d3ee]"
                    : "border-white/10 bg-white/[0.02] text-[#9aa4ac] hover:border-white/25 hover:text-white"
                }`}
              >
                <span className="opacity-60">{String(i + 1).padStart(2, "0")}</span> {s.name}
                <span className="mt-0.5 block text-[10px] normal-case opacity-55">{s.blurb}</span>
              </button>
            ))}
          </div>
        </Panel>

        <Panel title="Telemetry">
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Scenario completion" value={`${stats.completion.toFixed(0)}%`} accent />
            <Stat label="Replanning latency" value={`${stats.latency || 0} ms`} accent />
            <Stat label="Objects detected" value={String(stats.detected)} />
            <Stat label="Replanning events" value={String(stats.replans)} />
            <Stat label="Ego speed" value={`${(stats.speed * 3.6).toFixed(0)} km/h`} />
            <Stat label="Near-misses" value={String(stats.collisions)} />
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#22d3ee] to-[#34d399] transition-[width] duration-150"
              style={{ width: `${stats.completion}%` }}
            />
          </div>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-[#6b7681]">
            status · {stats.status}
          </p>
        </Panel>

        <Panel title="Sensor layers">
          <div className="grid gap-1.5">
            {(
              [
                ["camera", "Camera · 60° cone · 38 m"],
                ["radar", "Radar · 124° arc · 58 m"],
                ["lidar", "LiDAR · 360° · 26 m"],
              ] as const
            ).map(([key, label]) => (
              <label
                key={key}
                className="flex cursor-pointer items-center gap-2 rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 font-mono text-[11px] text-[#9aa4ac]"
              >
                <input
                  type="checkbox"
                  checked={sensors[key]}
                  onChange={(e) => setSensors((p) => ({ ...p, [key]: e.target.checked }))}
                  className="h-3.5 w-3.5 accent-[#22d3ee]"
                />
                <span style={{ color: SENSOR[key].color }}>■</span>
                {label}
              </label>
            ))}
          </div>
        </Panel>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setRunning((r) => !r)}
            className="rounded-md bg-[#22d3ee] px-3 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-[#04222a] transition hover:bg-[#67e8f9]"
          >
            {running ? "Pause" : "Run scenario"}
          </button>
          <button
            onClick={() => {
              setRunning(false);
              reset(scenario);
            }}
            className="rounded-md border border-white/15 px-3 py-2.5 font-mono text-[11px] uppercase tracking-widest text-[#9aa4ac] transition hover:border-white/35 hover:text-white"
          >
            Reset
          </button>
          <button
            onClick={shoot}
            className="col-span-2 rounded-md border border-white/15 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-[#6b7681] transition hover:border-white/35 hover:text-white"
          >
            Capture frame (PNG)
          </button>
        </div>
      </aside>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-white/10 bg-[#0a1016] p-3">
      <h2 className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#6b7681]">{title}</h2>
      {children}
    </section>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.02] px-2.5 py-2">
      <p className="font-mono text-[9px] uppercase tracking-widest text-[#6b7681]">{label}</p>
      <p className={`font-mono text-lg ${accent ? "text-[#34d399]" : "text-white"}`}>{value}</p>
    </div>
  );
}

/* ---------------------------------- sim ---------------------------------- */

type World = React.MutableRefObject<{
  ego: { x: number; y: number; speed: number; heading: number };
  obstacles: Obstacle[];
  nextId: number;
  offset: number;
  targetOffset: number;
  lastReplanOffset: number;
  replans: number;
  latency: number;
  collisions: number;
  spawnAcc: Record<number, number>;
  time: number;
}>["current"];

function inSensor(o: Obstacle, ego: World["ego"], sensors: Sensors) {
  const dx = o.x - ego.x;
  const dy = o.y - ego.y;
  const dist = Math.hypot(dx, dy);
  const ang = Math.abs(Math.atan2(dx, dy));
  for (const key of ["camera", "radar", "lidar"] as const) {
    if (!sensors[key]) continue;
    const s = SENSOR[key];
    if (dist <= s.range && ang <= s.halfAngle) return dist;
  }
  return null;
}

/** Cost of driving with a given lateral offset, looking 3 s ahead. */
function offsetCost(w: World, s: Scenario, offset: number) {
  const lane = w.ego.x + offset;
  if (Math.abs(lane) > s.roadHalfWidth - 0.9) return Infinity;
  let cost = Math.abs(offset) * 0.6 + Math.abs(offset - w.offset) * 0.35;
  for (const o of w.obstacles) {
    const m = KIND_META[o.kind];
    for (let t = 0; t <= 3; t += 0.25) {
      const ox = o.x + o.vx * t;
      const oy = o.y + o.vy * t;
      const ey = w.ego.y + w.ego.speed * t;
      if (oy < ey - 4 || oy > ey + 45) continue;
      const clear = Math.abs(ox - lane) - (m.w / 2 + CORRIDOR);
      if (clear < 0) {
        const urgency = Math.max(0.2, 3 - t);
        cost += 60 * urgency * (1 - Math.max(clear, -3) / -3);
      } else if (clear < 1.2) {
        cost += 6 * (1.2 - clear);
      }
    }
  }
  return cost;
}

function step(w: World, s: Scenario, dt: number) {
  // spawn
  s.rules.forEach((rule, i) => {
    w.spawnAcc[i] = (w.spawnAcc[i] ?? 0) + rule.rate * dt;
    while (w.spawnAcc[i] >= 1) {
      w.spawnAcc[i] -= 1;
      if (w.obstacles.length > 60) break;
      w.obstacles.push({
        id: w.nextId++,
        kind: rule.kind,
        x: rand(rule.xRange),
        y: w.ego.y + rand(rule.ahead),
        vy: rand(rule.speed),
        vx: rand(rule.drift),
        detected: false,
      });
    }
  });

  // move obstacles
  for (const o of w.obstacles) {
    o.x += o.vx * dt;
    o.y += o.vy * dt;
    if (Math.random() < dt * 0.4) o.vx += (Math.random() - 0.5) * 0.6;
    const lim = s.roadHalfWidth + 6;
    if (o.x > lim || o.x < -lim) o.vx *= -1;
  }
  w.obstacles = w.obstacles.filter((o) => o.y > w.ego.y - 25 && o.y < w.ego.y + 400);

  // plan: evaluate lateral offsets
  let best = w.offset;
  let bestCost = Infinity;
  for (let off = -6; off <= 6; off += 0.5) {
    const c = offsetCost(w, s, off);
    if (c < bestCost) {
      bestCost = c;
      best = off;
    }
  }
  if (Math.abs(best - w.lastReplanOffset) > 0.6) {
    w.lastReplanOffset = best;
    w.replans += 1;
    w.latency = Math.round(40 + Math.random() * 55);
  }
  w.targetOffset = best;
  w.offset += Math.max(-4 * dt, Math.min(4 * dt, w.targetOffset - w.offset));

  // longitudinal control
  let target = s.egoTargetSpeed;
  let nearest = Infinity;
  for (const o of w.obstacles) {
    const m = KIND_META[o.kind];
    const dy = o.y - w.ego.y;
    if (dy < -1 || dy > 45) continue;
    if (Math.abs(o.x - (w.ego.x + w.offset)) > m.w / 2 + CORRIDOR) continue;
    nearest = Math.min(nearest, dy);
  }
  if (nearest < 30) target = Math.min(target, Math.max(0, (nearest - 6) * 0.8));
  if (bestCost > 40) target = Math.min(target, 3);
  const accel = target > w.ego.speed ? 3.2 : 7;
  w.ego.speed += Math.max(-accel * dt, Math.min(accel * dt, target - w.ego.speed));
  w.ego.speed = Math.max(0, w.ego.speed);

  // near-miss counter
  for (const o of w.obstacles) {
    const d = Math.hypot(o.x - (w.ego.x + w.offset), o.y - w.ego.y);
    if (d < 2.2 && !("hit" in o)) {
      (o as Obstacle & { hit?: boolean }).hit = true;
      w.collisions += 1;
    }
  }

  w.ego.x += Math.max(-3 * dt, Math.min(3 * dt, w.offset * 0.9 - 0 ));
  w.ego.x = Math.max(-s.roadHalfWidth + 1, Math.min(s.roadHalfWidth - 1, w.ego.x));
  w.ego.y = Math.min(s.goalDistance, w.ego.y + w.ego.speed * dt);
  w.ego.heading = Math.atan2(w.targetOffset, 8);

  // detection flags
  for (const o of w.obstacles) o.detected = false;
}

function draw(
  ctx: CanvasRenderingContext2D,
  cw: number,
  ch: number,
  w: World,
  s: Scenario,
  sensors: Sensors,
) {
  const scale = PX_PER_M;
  const ox = cw / 2;
  const oy = ch * 0.78;
  const toX = (x: number) => ox + (x - w.ego.x) * scale;
  const toY = (y: number) => oy - (y - w.ego.y) * scale;

  ctx.fillStyle = "#070b0f";
  ctx.fillRect(0, 0, cw, ch);

  // road surface
  ctx.fillStyle = "#12181e";
  ctx.fillRect(toX(-s.roadHalfWidth), 0, s.roadHalfWidth * 2 * scale, ch);
  ctx.strokeStyle = "rgba(255,255,255,0.10)";
  ctx.setLineDash([12, 10]);
  ctx.lineWidth = 1;
  [-s.roadHalfWidth, s.roadHalfWidth].forEach((x) => {
    ctx.beginPath();
    ctx.moveTo(toX(x), 0);
    ctx.lineTo(toX(x), ch);
    ctx.stroke();
  });
  ctx.setLineDash([]);

  // distance grid every 10 m
  ctx.strokeStyle = "rgba(255,255,255,0.045)";
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.font = "9px ui-monospace, monospace";
  const startM = Math.floor((w.ego.y - 20) / 10) * 10;
  for (let m = startM; m < w.ego.y + ch / scale; m += 10) {
    const y = toY(m);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(cw, y);
    ctx.stroke();
    ctx.fillText(`${m} m`, 6, y - 3);
  }

  // goal line
  if (s.goalDistance < w.ego.y + ch / scale) {
    const gy = toY(s.goalDistance);
    ctx.strokeStyle = "#34d399";
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(cw, gy);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#34d399";
    ctx.fillText("GOAL", cw - 40, gy - 6);
  }

  // sensor fields
  const egoPx = { x: toX(w.ego.x), y: toY(w.ego.y) };
  (["radar", "camera", "lidar"] as const).forEach((key) => {
    if (!sensors[key]) return;
    const cfg = SENSOR[key];
    ctx.beginPath();
    if (key === "lidar") {
      ctx.arc(egoPx.x, egoPx.y, cfg.range * scale, 0, Math.PI * 2);
    } else {
      ctx.moveTo(egoPx.x, egoPx.y);
      ctx.arc(
        egoPx.x,
        egoPx.y,
        cfg.range * scale,
        -Math.PI / 2 - cfg.halfAngle,
        -Math.PI / 2 + cfg.halfAngle,
      );
      ctx.closePath();
    }
    ctx.fillStyle = `${cfg.color}14`;
    ctx.fill();
    ctx.strokeStyle = `${cfg.color}66`;
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // planned path
  const laneX = w.ego.x + w.offset;
  ctx.beginPath();
  ctx.moveTo(egoPx.x, egoPx.y);
  ctx.bezierCurveTo(
    egoPx.x,
    toY(w.ego.y + 8),
    toX(laneX),
    toY(w.ego.y + 16),
    toX(laneX),
    toY(w.ego.y + 34),
  );
  ctx.lineTo(toX(laneX * 0.4), toY(Math.min(s.goalDistance, w.ego.y + 90)));
  ctx.strokeStyle = "#34d399";
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.strokeStyle = "rgba(52,211,153,0.18)";
  ctx.lineWidth = CORRIDOR * 2 * scale;
  ctx.stroke();
  ctx.lineWidth = 1;

  // obstacles (nearest first so labels go to the most relevant objects)
  let labels = 0;
  const sorted = [...w.obstacles].sort(
    (a, b) =>
      Math.hypot(a.x - w.ego.x, a.y - w.ego.y) - Math.hypot(b.x - w.ego.x, b.y - w.ego.y),
  );
  for (const o of sorted) {
    const m = KIND_META[o.kind];
    const px = toX(o.x);
    const py = toY(o.y);
    if (py < -40 || py > ch + 40) continue;
    const bw = m.w * scale;
    const bl = m.l * scale;
    ctx.fillStyle = `${m.color}55`;
    ctx.strokeStyle = m.color;
    if (o.kind === "pedestrian") {
      ctx.beginPath();
      ctx.arc(px, py, bw / 2 + 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.fillRect(px - bw / 2, py - bl / 2, bw, bl);
      ctx.strokeRect(px - bw / 2, py - bl / 2, bw, bl);
    }

    const dist = inSensor(o, w.ego, sensors);
    if (dist !== null) {
      o.detected = true;
      const pad = 5;
      ctx.strokeStyle = "#22d3ee";
      ctx.setLineDash([3, 3]);
      ctx.strokeRect(px - bw / 2 - pad, py - bl / 2 - pad, bw + pad * 2, bl + pad * 2);
      ctx.setLineDash([]);
      if (labels < 8) {
        labels += 1;
        ctx.fillStyle = "#22d3ee";
        ctx.font = "10px ui-monospace, monospace";
        ctx.fillText(`${m.label} ${dist.toFixed(0)}m`, px + bw / 2 + 7, py - bl / 2 - 2);
      }
    }
  }

  // ego vehicle
  ctx.save();
  ctx.translate(egoPx.x, egoPx.y);
  ctx.rotate(-w.ego.heading);
  const ew = 1.8 * scale;
  const el = 4.3 * scale;
  ctx.fillStyle = "#e6edf3";
  ctx.fillRect(-ew / 2, -el / 2, ew, el);
  ctx.fillStyle = "#22d3ee";
  ctx.beginPath();
  ctx.moveTo(0, -el / 2 - 7);
  ctx.lineTo(-6, -el / 2 + 2);
  ctx.lineTo(6, -el / 2 + 2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
