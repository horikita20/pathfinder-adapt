import {
  Activity,
  AlertTriangle,
  Car,
  Eye,
  Gauge,
  Pause,
  Play,
  RotateCcw,
  ScanLine,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CameraMode, DriveMode, Metrics, Scenario, SimEvent } from "@/lib/sim/engine";
import { SCENARIOS } from "@/lib/sim/engine";

const RISK_TEXT = { low: "text-[#00ff88]", medium: "text-[#ff9f1c]", high: "text-[#ff3b30]" } as const;

const CAMERAS: { id: CameraMode; label: string; icon: typeof Eye }[] = [
  { id: "inside", label: "Inside", icon: Eye },
  { id: "outside", label: "Outside", icon: Car },
  { id: "overview", label: "Overview", icon: Video },
];

function Panel({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "pointer-events-auto rounded-md border border-white/10 bg-[#0d1216]/82 p-3 text-xs text-[#d7dde2] backdrop-blur-md",
        className,
      )}
    >
      {children}
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: React.ReactNode; accent?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-0.5">
      <span className="text-[10px] uppercase tracking-wider text-[#8b959d]">{label}</span>
      <span className={cn("font-mono text-[12px] text-white", accent)}>{value}</span>
    </div>
  );
}

export interface HudProps {
  metrics: Metrics;
  events: SimEvent[];
  scenario: Scenario;
  running: boolean;
  cameraMode: CameraMode;
  driveMode: DriveMode;
  quality: "high" | "low";
  onCamera: (m: CameraMode) => void;
  onDriveMode: (m: DriveMode) => void;
  onScenario: (id: string) => void;
  onToggleRun: () => void;
  onReset: () => void;
  onQuality: (q: "high" | "low") => void;
  onTouch: (key: "up" | "down" | "left" | "right", active: boolean) => void;
}

export function SimulatorHud(props: HudProps) {
  const { metrics: m, scenario, events } = props;

  return (
    <div className="pointer-events-none absolute inset-0 select-none">
      {/* top bar */}
      <div className="absolute inset-x-0 top-0 flex flex-wrap items-center gap-2 p-3">
        <Panel className="flex items-center gap-2 py-2">
          <span className="h-2 w-2 rounded-full bg-[#00d9ff]" />
          <span className="text-[11px] font-semibold tracking-wide text-white">SafeAutonomy India</span>
          <span className="hidden text-[10px] text-[#8b959d] sm:inline">SIMULATION ONLY</span>
        </Panel>

        <Panel className="flex items-center gap-1 p-1">
          {CAMERAS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => props.onCamera(c.id)}
              className={cn(
                "flex items-center gap-1.5 rounded px-2.5 py-1.5 text-[11px] transition-colors",
                props.cameraMode === c.id ? "bg-[#00d9ff] text-[#06202a]" : "text-[#9aa4ac] hover:bg-white/10",
              )}
            >
              <c.icon size={13} />
              {c.label}
            </button>
          ))}
        </Panel>

        <Panel className="flex items-center gap-1 p-1">
          {(["auto", "manual"] as DriveMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => props.onDriveMode(mode)}
              className={cn(
                "rounded px-2.5 py-1.5 text-[11px] uppercase tracking-wide transition-colors",
                props.driveMode === mode ? "bg-[#00ff88] text-[#04220f]" : "text-[#9aa4ac] hover:bg-white/10",
              )}
            >
              {mode === "auto" ? "Autonomous" : "Manual"}
            </button>
          ))}
        </Panel>

        <Panel className="ml-auto flex items-center gap-1 p-1">
          <button
            type="button"
            onClick={props.onToggleRun}
            className="flex items-center gap-1.5 rounded bg-white/10 px-3 py-1.5 text-[11px] text-white hover:bg-white/20"
          >
            {props.running ? <Pause size={13} /> : <Play size={13} />}
            {props.running ? "Pause" : "Start"}
          </button>
          <button
            type="button"
            onClick={props.onReset}
            className="flex items-center gap-1.5 rounded px-3 py-1.5 text-[11px] text-[#9aa4ac] hover:bg-white/10"
          >
            <RotateCcw size={13} />
            Reset
          </button>
          <button
            type="button"
            onClick={() => props.onQuality(props.quality === "high" ? "low" : "high")}
            className="rounded px-2 py-1.5 text-[10px] uppercase tracking-wide text-[#9aa4ac] hover:bg-white/10"
          >
            {props.quality === "high" ? "High" : "Lite"}
          </button>
        </Panel>
      </div>

      {/* scenario picker */}
      <div className="absolute left-3 top-[4.6rem] w-[220px] max-w-[62vw]">
        <Panel>
          <p className="mb-2 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#8b959d]">
            <ScanLine size={12} /> Scenario
          </p>
          <div className="flex flex-col gap-1">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => props.onScenario(s.id)}
                className={cn(
                  "rounded px-2 py-1.5 text-left text-[11px] transition-colors",
                  s.id === scenario.id ? "bg-[#00d9ff]/15 text-[#00d9ff]" : "text-[#9aa4ac] hover:bg-white/8",
                )}
              >
                {s.name}
              </button>
            ))}
          </div>
          <p className="mt-2 border-t border-white/10 pt-2 text-[10px] leading-snug text-[#7f8991]">{scenario.brief}</p>
        </Panel>
      </div>

      {/* sensors */}
      <div className="absolute bottom-3 left-3 hidden w-[220px] md:block">
        <Panel>
          <p className="mb-2 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#8b959d]">
            <Activity size={12} /> Sensor stack
          </p>
          {[
            ["Front camera", "60 m", true],
            ["Side cameras ×2", "25 m", true],
            ["Rear camera", "30 m", true],
            ["Front radar", "70 m", true],
            ["Roof LiDAR", "50 m", true],
            ["GNSS + IMU", "—", true],
            ["AI compute (ECU)", `${m.latencyMs} ms`, true],
          ].map(([name, range, ok]) => (
            <div key={name as string} className="flex items-center justify-between py-0.5">
              <span className="flex items-center gap-1.5 text-[11px] text-[#c3cbd1]">
                <span className={cn("h-1.5 w-1.5 rounded-full", ok ? "bg-[#00ff88]" : "bg-[#ff3b30]")} />
                {name}
              </span>
              <span className="font-mono text-[10px] text-[#8b959d]">{range}</span>
            </div>
          ))}
          <div className="mt-2 border-t border-white/10 pt-2">
            <Row label="Tracked objects" value={m.tracked} accent="text-[#00d9ff]" />
            <Row label="Sensor health" value={`${m.sensorHealth}%`} accent="text-[#00ff88]" />
          </div>
        </Panel>
      </div>

      {/* dashboard */}
      <div className="absolute bottom-3 right-3 w-[230px] max-w-[64vw]">
        <Panel>
          <div className="mb-2 flex items-end justify-between">
            <div>
              <p className="font-mono text-3xl leading-none text-white">{m.speedKph.toFixed(0)}</p>
              <p className="text-[10px] uppercase tracking-wider text-[#8b959d]">km/h</p>
            </div>
            <Gauge size={18} className="text-[#00d9ff]" />
          </div>
          <Row label="Mode" value={props.driveMode === "auto" ? "Autonomous" : "Manual"} accent="text-[#00ff88]" />
          <Row label="Camera" value={props.cameraMode} />
          <Row label="Detected" value={m.detected} accent="text-[#00d9ff]" />
          <Row
            label="Nearest"
            value={m.nearest ? `${m.nearest.label} · ${m.nearest.distance.toFixed(0)} m` : "clear"}
          />
          <Row label="Collision risk" value={m.risk.toUpperCase()} accent={RISK_TEXT[m.risk]} />
          <Row label="Replanning" value={`${m.latencyMs} ms`} />
          <Row label="Braking events" value={m.brakeEvents} />
          <div className="mt-2">
            <div className="mb-1 flex justify-between text-[10px] uppercase tracking-wider text-[#8b959d]">
              <span>Scenario completion</span>
              <span className="font-mono text-[#00ff88]">{m.completion.toFixed(0)}%</span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded bg-white/10">
              <div className="h-full bg-[#00ff88] transition-[width] duration-300" style={{ width: `${m.completion}%` }} />
            </div>
          </div>
        </Panel>
      </div>

      {/* event log */}
      <div className="absolute right-3 top-[4.6rem] hidden w-[250px] lg:block">
        <Panel>
          <p className="mb-1.5 text-[10px] uppercase tracking-wider text-[#8b959d]">Event log</p>
          <div className="flex max-h-[180px] flex-col gap-1 overflow-hidden">
            {events.length === 0 && <span className="text-[11px] text-[#7f8991]">No events yet — press Start.</span>}
            {events.slice(0, 7).map((e) => (
              <div key={e.id} className="flex items-start gap-1.5 text-[11px] leading-snug">
                <span
                  className={cn(
                    "mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full",
                    e.kind === "warning" ? "bg-[#ff3b30]" : e.kind === "brake" ? "bg-[#ff9f1c]" : "bg-[#00d9ff]",
                  )}
                />
                <span className="text-[#c3cbd1]">{e.label}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* collision warning */}
      {m.risk === "high" && (
        <div className="absolute left-1/2 top-16 -translate-x-1/2">
          <div className="pointer-events-none flex animate-pulse items-center gap-2 rounded border border-[#ff3b30] bg-[#2a0b0a]/85 px-4 py-2 text-[12px] font-semibold uppercase tracking-wider text-[#ff6b60] backdrop-blur">
            <AlertTriangle size={14} /> Collision risk — braking
          </div>
        </div>
      )}

      {/* manual touch controls */}
      {props.driveMode === "manual" && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 md:hidden">
          {(
            [
              ["left", "◀"],
              ["down", "▼"],
              ["up", "▲"],
              ["right", "▶"],
            ] as const
          ).map(([key, glyph]) => (
            <button
              key={key}
              type="button"
              onPointerDown={() => props.onTouch(key, true)}
              onPointerUp={() => props.onTouch(key, false)}
              onPointerLeave={() => props.onTouch(key, false)}
              className="pointer-events-auto h-12 w-12 rounded-full border border-white/15 bg-[#0d1216]/85 text-white backdrop-blur"
            >
              {glyph}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
