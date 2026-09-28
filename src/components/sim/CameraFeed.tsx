import { useEffect, useRef, useState, type RefObject } from "react";
import type { Actor, DriverInput, World } from "@/lib/sim/engine";
import { actorLabel, stepWorld } from "@/lib/sim/engine";

import villageAsset from "@/assets/scenario-village.jpg.asset.json";
import marketImg from "@/assets/scenario-market.jpg";
import intersectionImg from "@/assets/scenario-intersection.jpg";
import highwayImg from "@/assets/scenario-highway.jpg";
import cattleImg from "@/assets/scenario-cattle.jpg";

const FEEDS: Record<string, string> = {
  village: villageAsset.url,
  market: marketImg,
  intersection: intersectionImg,
  highway: highwayImg,
  cattle: cattleImg,
};

const CAM_HEIGHT = 1.25; // metres above road
const HORIZON = 0.44; // fraction of frame height
const HFOV = 55 * (Math.PI / 180);

const RISK_COLOR = { low: "#00d9ff", medium: "#ff9f1c", high: "#ff4d4d" } as const;

interface Box {
  id: number;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  distance: number;
  confidence: number;
  risk: Actor["risk"];
}

export default function CameraFeed({
  world,
  inputRef,
  onTick,
}: {
  world: World;
  inputRef: RefObject<DriverInput>;
  onTick: () => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 1280, h: 720 });
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [shift, setShift] = useState(0);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    setSize({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let acc = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      stepWorld(world, dt, inputRef.current);

      acc += dt;
      if (acc < 1 / 15) return;
      acc = 0;

      const { w, h } = size;
      const fx = w / (2 * Math.tan(HFOV / 2));
      const horizon = h * HORIZON;
      const next: Box[] = [];

      for (const a of world.actors) {
        if (!a.detected) continue;
        const dz = a.z - world.ego.z;
        if (dz < 4 || dz > 65) continue;
        const dx = a.x - world.ego.x;
        const cx = w / 2 + (dx / dz) * fx;
        const groundY = horizon + (CAM_HEIGHT / dz) * fx;
        const topY = horizon + ((CAM_HEIGHT - a.height) / dz) * fx;
        const bw = Math.max(14, ((a.width + 0.3) / dz) * fx);
        const bh = Math.max(12, groundY - topY);
        if (cx < -bw || cx > w + bw || topY > h) continue;
        next.push({
          id: a.id,
          label: actorLabel(a.kind),
          x: cx - bw / 2,
          y: topY,
          w: bw,
          h: bh,
          distance: a.distance,
          confidence: a.confidence,
          risk: a.risk,
        });
      }

      next.sort((p, q) => q.distance - p.distance);
      setBoxes(next.slice(-14));
      setShift(Math.max(-1, Math.min(1, -world.ego.x / 4)));
      onTick();
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [world, inputRef, onTick, size]);

  const src = FEEDS[world.scenario.id] ?? FEEDS["village"]!;

  return (
    <div ref={hostRef} className="absolute inset-0 overflow-hidden bg-black">
      <img
        src={src}
        alt={`${world.scenario.name} camera feed`}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out"
        style={{ transform: `scale(1.06) translateX(${shift * 1.6}%)` }}
      />
      {/* lens + exposure grade so it reads as a live camera, not a photo */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(120% 90% at 50% 45%, transparent 55%, rgba(0,0,0,0.45) 100%)" }}
      />

      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox={`0 0 ${size.w} ${size.h}`}>
        {boxes.map((b) => {
          const c = RISK_COLOR[b.risk];
          const labelW = Math.max(96, b.label.length * 6.5 + 46);
          const labelY = Math.max(0, b.y - 18);
          return (
            <g key={b.id} opacity={b.risk === "low" ? 0.85 : 1}>
              <rect
                x={b.x}
                y={b.y}
                width={b.w}
                height={b.h}
                fill="none"
                stroke={c}
                strokeWidth={b.risk === "high" ? 2.4 : 1.4}
                rx={2}
              />
              <rect x={b.x} y={labelY} width={labelW} height={16} fill={c} opacity={0.92} rx={2} />
              <text x={b.x + 5} y={labelY + 12} fontSize={11} fontFamily="Inter, sans-serif" fill="#08131a">
                {`${b.label} · ${b.distance.toFixed(0)}m · ${Math.round(b.confidence * 100)}%`}
              </text>
            </g>
          );
        })}
      </svg>

      {/* camera identity strip */}
      <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-sm bg-black/55 px-2.5 py-1 font-mono text-[11px] tracking-wide text-white/85 backdrop-blur-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-[#ff4d4d]" />
        CAM-01 FRONT · 1920×1080 · 30 FPS
      </div>
      <div className="pointer-events-none absolute right-4 top-4 rounded-sm bg-black/55 px-2.5 py-1 font-mono text-[11px] text-white/70 backdrop-blur-sm">
        {world.scenario.name}
      </div>

      {/* bonnet so the driver POV stays grounded */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[14%] bg-gradient-to-t from-black/85 to-transparent" />
    </div>
  );
}
