import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CameraMode, DriveMode, DriverInput, Metrics, SimEvent, World } from "@/lib/sim/engine";
import { SCENARIOS, createWorld } from "@/lib/sim/engine";
import SimCanvas from "./SimScene";
import { SimulatorHud } from "./SimulatorHud";

export default function Simulator() {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0]!.id);
  const [cameraMode, setCameraMode] = useState<CameraMode>("outside");
  const [driveMode, setDriveMode] = useState<DriveMode>("auto");
  const [quality, setQuality] = useState<"high" | "low">("high");
  const [running, setRunning] = useState(false);
  const [version, setVersion] = useState(0);

  const world = useMemo<World>(() => createWorld(scenarioId), [scenarioId, version]);
  const inputRef = useRef<DriverInput>({ throttle: 0, brake: 0, steer: 0 });
  const [metrics, setMetrics] = useState<Metrics>(world.metrics);
  const [events, setEvents] = useState<SimEvent[]>([]);

  useEffect(() => {
    world.running = running;
    world.mode = driveMode;
  }, [world, running, driveMode]);

  const onTick = useCallback(() => {
    setMetrics({ ...world.metrics });
    setEvents(world.events.slice(0, 8));
    if (!world.running && running) setRunning(false);
  }, [world, running]);

  // keyboard driving
  useEffect(() => {
    const keys = new Set<string>();
    const apply = () => {
      const i = inputRef.current;
      i.throttle = keys.has("w") || keys.has("arrowup") ? 1 : 0;
      i.brake = keys.has("s") || keys.has("arrowdown") ? 1 : 0;
      i.steer = (keys.has("d") || keys.has("arrowright") ? 1 : 0) - (keys.has("a") || keys.has("arrowleft") ? 1 : 0);
    };
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(k)) {
        e.preventDefault();
        keys.add(k);
        apply();
      }
      if (k === " ") {
        e.preventDefault();
        setRunning((r) => !r);
      }
      if (k === "1") setCameraMode("inside");
      if (k === "2") setCameraMode("outside");
      if (k === "3") setCameraMode("overview");
    };
    const up = (e: KeyboardEvent) => {
      keys.delete(e.key.toLowerCase());
      apply();
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  const onTouch = useCallback((key: "up" | "down" | "left" | "right", active: boolean) => {
    const i = inputRef.current;
    if (key === "up") i.throttle = active ? 1 : 0;
    if (key === "down") i.brake = active ? 1 : 0;
    if (key === "left") i.steer = active ? -1 : 0;
    if (key === "right") i.steer = active ? 1 : 0;
  }, []);

  const reset = useCallback(() => {
    setRunning(false);
    setEvents([]);
    setVersion((v) => v + 1);
  }, []);

  const changeScenario = useCallback((id: string) => {
    setRunning(false);
    setEvents([]);
    setScenarioId(id);
  }, []);

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#0d1216]">
      <SimCanvas
        key={`${scenarioId}-${version}-${quality}`}
        world={world}
        cameraMode={cameraMode}
        inputRef={inputRef}
        onTick={onTick}
        quality={quality}
      />
      <SimulatorHud
        metrics={metrics}
        events={events}
        scenario={world.scenario}
        running={running}
        cameraMode={cameraMode}
        driveMode={driveMode}
        quality={quality}
        onCamera={setCameraMode}
        onDriveMode={setDriveMode}
        onScenario={changeScenario}
        onToggleRun={() => setRunning((r) => !r)}
        onReset={reset}
        onQuality={setQuality}
        onTouch={onTouch}
      />
      {!running && (
        <div className="pointer-events-none absolute inset-x-0 bottom-24 flex justify-center">
          <p className="rounded-full border border-white/10 bg-[#0d1216]/85 px-4 py-1.5 text-[11px] text-[#9aa4ac] backdrop-blur">
            Press Start · drag to orbit · scroll to zoom · keys 1/2/3 switch camera
          </p>
        </div>
      )}
    </div>
  );
}
