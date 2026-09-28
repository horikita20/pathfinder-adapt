import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";

// MATLAB-style desktop mock. Scoped palette (imitates the IDE look on purpose).
const C = {
  frame: "#f3f3f3", strip: "#fafafa", border: "#d0d0d0", blue: "#0076a8", tab: "#e8e8e8",
  text: "#222", muted: "#6b6b6b", kw: "#0e00ff", cm: "#228b22", str: "#a020f0", panel: "#ffffff",
};

const SCENARIOS = [
  { id: "village", name: "Village road — cattle crossing", obs: ["cattle", "twowheeler", "cattle"] },
  { id: "market", name: "Market street — pedestrians", obs: ["ped", "auto", "ped", "ped"] },
  { id: "intersection", name: "Unsignalled intersection", obs: ["auto", "car", "twowheeler"] },
  { id: "merge", name: "Highway merge — wrong-side vehicle", obs: ["car", "truck", "car"] },
  { id: "monsoon", name: "Monsoon — low visibility", obs: ["auto", "ped", "twowheeler"] },
] as const;

const CODE = [
  ["cm", "%% SAFEMARG — adaptive path planning demo"],
  ["cm", "% Scenario from RoadRunner, sensors from Automated Driving Toolbox"],
  ["", "scenario = loadScenario(<S>);"],
  ["", "sensors  = [cameraSensor, radarSensor, lidarSensor];"],
  ["", "planner  = adaptivePlanner('Horizon', 3, 'Safety', 1.5);"],
  ["", ""],
  ["kw", "while"],
  ["", "    dets  = fuseDetections(sensors, scenario);"],
  ["", "    tracks = predictAgents(dets);        % irregular agents"],
  ["", "    path  = replan(planner, tracks);     % collision-free"],
  ["", "    applyControl(egoVehicle, path);"],
  ["", "    logMetrics(latency, smoothness);"],
  ["kw", "end"],
  ["", "plotResults(metrics);"],
] as const;

type Obs = { x: number; y: number; kind: string };

export default function MatlabDemo() {
  const [scn, setScn] = useState(0);
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState<string[]>([">> "]);
  const [ws, setWs] = useState({ t: 0, latency: 0, avoided: 0, offset: 0, completion: 0 });
  const canvas = useRef<HTMLCanvasElement>(null);
  const plot = useRef<HTMLCanvasElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => { logRef.current?.scrollTo(0, 1e6); }, [log]);

  function run() {
    setLog((l) => [...l.slice(0, -1), ">> safemarg_main", `Loading scenario: ${SCENARIOS[scn]!.name}`,
      "Initialising camera, radar, LiDAR models... done", "Starting simulation (simulated in browser)..."]);
    setRunning(true);
  }

  useEffect(() => {
    if (!running) return;
    const cv = canvas.current!, pc = plot.current!;
    const ctx = cv.getContext("2d")!, pctx = pc.getContext("2d")!;
    const W = cv.width, H = cv.height;
    const lanes = [W * 0.3, W * 0.5, W * 0.7];
    const kinds = SCENARIOS[scn]!.obs;
    const obs: Obs[] = kinds.map((k, i) => ({ kind: k, y: -120 - i * 170, x: lanes[i % 3]! }));
    let ego = W / 2, t = 0, avoided = 0, raf = 0, dash = 0;
    const lat: number[] = [];
    const total = 900;
    const colors: Record<string, string> = { cattle: "#8b5a2b", ped: "#d9534f", auto: "#e6b800", twowheeler: "#ff7f0e", car: "#1f77b4", truck: "#555" };

    const tick = () => {
      t++;
      dash = (dash + 4) % 40;
      obs.forEach((o) => { o.y += 3.2; if (o.y > H + 40) { o.y = -80 - Math.random() * 200; o.x = lanes[Math.floor(Math.random() * 3)]!; avoided++; } });
      // planner: pick lane with farthest nearest obstacle ahead
      const egoY = H - 70;
      const score = (lx: number) => Math.min(...obs.filter((o) => Math.abs(o.x - lx) < 30 && o.y < egoY + 20).map((o) => egoY - o.y), 999);
      const target = lanes.reduce((b, l) => (score(l) > score(b) + 10 ? l : b), lanes.reduce((a, b) => Math.abs(b - ego) < Math.abs(a - ego) ? b : a));
      ego += (target - ego) * 0.08;
      const latency = 55 + Math.random() * 30;
      lat.push(latency); if (lat.length > 120) lat.shift();

      // draw road
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#e9e9e9"; ctx.fillRect(W * 0.2, 0, W * 0.6, H);
      ctx.strokeStyle = "#999"; ctx.setLineDash([20, 20]); ctx.lineDashOffset = -dash; ctx.lineWidth = 2;
      [W * 0.4, W * 0.6].forEach((x) => { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); });
      ctx.setLineDash([]);
      // planned path
      ctx.strokeStyle = "#2ca02c"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ego, egoY);
      ctx.bezierCurveTo(ego, egoY - 60, target, egoY - 100, target, egoY - 200); ctx.stroke();
      // sensor cone
      ctx.fillStyle = "rgba(0,118,168,0.10)"; ctx.beginPath(); ctx.moveTo(ego, egoY);
      ctx.lineTo(ego - 110, egoY - 260); ctx.lineTo(ego + 110, egoY - 260); ctx.fill();
      obs.forEach((o) => {
        ctx.fillStyle = colors[o.kind] ?? "#333";
        const s = o.kind === "ped" ? 10 : o.kind === "truck" ? 26 : 18;
        ctx.fillRect(o.x - s / 2, o.y - s, s, s * 1.6);
        if (egoY - o.y < 260 && egoY - o.y > 0) { ctx.strokeStyle = "#d62728"; ctx.lineWidth = 1.5; ctx.strokeRect(o.x - s / 2 - 4, o.y - s - 4, s + 8, s * 1.6 + 8); }
      });
      ctx.fillStyle = "#0076a8"; ctx.fillRect(ego - 11, egoY - 18, 22, 36);
      ctx.fillStyle = "#222"; ctx.font = "12px monospace"; ctx.fillText(`t = ${(t / 60).toFixed(1)} s`, 8, 16);

      // latency plot
      const PW = pc.width, PH = pc.height;
      pctx.fillStyle = "#fff"; pctx.fillRect(0, 0, PW, PH);
      pctx.strokeStyle = "#ddd"; pctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) { const y = 10 + (i * (PH - 30)) / 4; pctx.beginPath(); pctx.moveTo(30, y); pctx.lineTo(PW - 5, y); pctx.stroke(); }
      const yOf = (v: number) => 10 + (1 - v / 120) * (PH - 30);
      pctx.strokeStyle = "#d62728"; pctx.setLineDash([5, 4]); pctx.beginPath(); pctx.moveTo(30, yOf(100)); pctx.lineTo(PW - 5, yOf(100)); pctx.stroke(); pctx.setLineDash([]);
      pctx.strokeStyle = "#0072bd"; pctx.lineWidth = 1.5; pctx.beginPath();
      lat.forEach((v, i) => { const x = 30 + (i / 119) * (PW - 35); i ? pctx.lineTo(x, yOf(v)) : pctx.moveTo(x, yOf(v)); }); pctx.stroke();
      pctx.fillStyle = "#444"; pctx.font = "10px sans-serif";
      [0, 60, 120].forEach((v) => pctx.fillText(String(v), 4, yOf(v) + 3));
      pctx.fillText("Replanning latency (ms) — target 100", 36, PH - 6);

      if (t % 20 === 0) setWs({ t: +(t / 60).toFixed(1), latency: +latency.toFixed(1), avoided, offset: +((ego - W / 2) / 40).toFixed(2), completion: Math.min(100, Math.round((t / total) * 100)) });
      if (t % 120 === 0) setLog((l) => [...l, `  [t=${(t / 60).toFixed(1)}s] agents tracked: ${obs.length}  latency: ${latency.toFixed(1)} ms  path: collision-free`]);
      if (t >= total) {
        const avg = lat.reduce((a, b) => a + b, 0) / lat.length;
        setLog((l) => [...l, "Simulation complete.", `  mean latency: ${avg.toFixed(1)} ms   agents avoided: ${avoided}   completion: 100%`, ">> "]);
        setRunning(false);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, scn]);

  const panelHead = (t: string) => (
    <div style={{ background: C.tab, borderBottom: `1px solid ${C.border}`, color: C.text }} className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide">{t}</div>
  );

  return (
    <div style={{ background: C.frame, color: C.text, fontFamily: "Segoe UI, Helvetica, Arial, sans-serif" }} className="flex min-h-[100dvh] flex-col text-[13px]">
      {/* title bar */}
      <div style={{ background: C.blue }} className="flex items-center justify-between px-3 py-1.5 text-[12px] text-[#fff]">
        <span>MATLAB-style Desktop — SAFEMARG demo (browser simulation)</span>
        <Link to="/" className="rounded px-2 py-0.5 hover:bg-[#ffffff22]">✕ Back to site</Link>
      </div>
      {/* toolstrip */}
      <div style={{ background: C.strip, borderBottom: `1px solid ${C.border}` }}>
        <div className="flex gap-4 px-3 pt-1 text-[11px] font-semibold">
          {["HOME", "PLOTS", "APPS", "EDITOR"].map((t) => (
            <span key={t} style={t === "EDITOR" ? { color: C.blue, borderBottom: `2px solid ${C.blue}` } : { color: C.muted }} className="pb-1">{t}</span>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3 px-3 py-2">
          <button onClick={run} disabled={running} style={{ border: `1px solid ${C.border}`, background: "#fff" }} className="flex items-center gap-1.5 rounded px-3 py-1.5 font-semibold disabled:opacity-50">
            <span style={{ color: "#2ca02c" }}>▶</span> Run
          </button>
          <button onClick={() => { setRunning(false); setLog((l) => [...l, "Simulation stopped by user.", ">> "]); }} disabled={!running} style={{ border: `1px solid ${C.border}`, background: "#fff" }} className="flex items-center gap-1.5 rounded px-3 py-1.5 disabled:opacity-50">
            <span style={{ color: "#d62728" }}>■</span> Stop
          </button>
          <label className="flex items-center gap-2 text-[12px]">
            Scenario
            <select value={scn} disabled={running} onChange={(e) => setScn(+e.target.value)} style={{ border: `1px solid ${C.border}` }} className="rounded bg-[#fff] px-2 py-1">
              {SCENARIOS.map((s, i) => <option key={s.id} value={i}>{s.name}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className="grid flex-1 gap-1 p-1 lg:grid-cols-[200px_1fr_1fr_220px]">
        {/* current folder */}
        <div style={{ background: C.panel, border: `1px solid ${C.border}` }} className="hidden lg:block">
          {panelHead("Current Folder")}
          <ul className="p-2 font-mono text-[12px] leading-6">
            {["📁 scenarios", "📁 sensors", "📄 safemarg_main.m", "🔷 adaptivePlanner.slx", "🔷 decisionLogic.sfx", "🛣 village_road.rrscene", "🛣 intersection.rrscene", "📊 metrics.mat"].map((f) => (
              <li key={f} style={f.includes("main") ? { background: "#dbeaf5" } : undefined} className="rounded px-1">{f}</li>
            ))}
          </ul>
        </div>

        {/* editor + command window */}
        <div className="flex min-w-0 flex-col gap-1">
          <div style={{ background: C.panel, border: `1px solid ${C.border}` }}>
            {panelHead("Editor — safemarg_main.m")}
            <pre className="overflow-x-auto p-2 font-mono text-[12px] leading-5">
              {CODE.map(([k, line], i) => (
                <div key={i} className="flex">
                  <span style={{ color: C.muted }} className="w-7 shrink-0 select-none text-right pr-2">{i + 1}</span>
                  {k === "cm" ? <span style={{ color: C.cm }}>{line}</span>
                    : k === "kw" ? <span style={{ color: C.kw }}>{line === "while" ? <>while <span style={{ color: C.text }}>~isDone(scenario)</span></> : line}</span>
                    : line.includes("<S>") ? <span>scenario = loadScenario(<span style={{ color: C.str }}>'{SCENARIOS[scn]!.id}'</span>);</span>
                    : <span>{line}</span>}
                </div>
              ))}
            </pre>
          </div>
          <div style={{ background: C.panel, border: `1px solid ${C.border}` }} className="flex min-h-[180px] flex-1 flex-col">
            {panelHead("Command Window")}
            <div ref={logRef} className="max-h-[260px] flex-1 overflow-y-auto p-2 font-mono text-[12px] leading-5">
              {log.map((l, i) => <div key={i}>{l}</div>)}
              {!running && log.length === 1 && <div style={{ color: C.muted }}>Press ▶ Run in the toolbar to start the simulation.</div>}
            </div>
          </div>
        </div>

        {/* figure */}
        <div style={{ background: C.panel, border: `1px solid ${C.border}` }} className="flex min-w-0 flex-col">
          {panelHead("Figure 1 — Bird's-eye scope")}
          <div className="flex flex-1 flex-col items-center gap-2 p-2">
            <canvas ref={canvas} width={360} height={380} className="w-full max-w-[420px]" style={{ border: `1px solid ${C.border}` }} />
            <canvas ref={plot} width={360} height={130} className="w-full max-w-[420px]" style={{ border: `1px solid ${C.border}` }} />
          </div>
        </div>

        {/* workspace */}
        <div style={{ background: C.panel, border: `1px solid ${C.border}` }}>
          {panelHead("Workspace")}
          <table className="w-full font-mono text-[12px]">
            <thead><tr style={{ color: C.muted }}><th className="px-2 py-1 text-left font-normal">Name</th><th className="px-2 py-1 text-left font-normal">Value</th></tr></thead>
            <tbody>
              {[["simTime", `${ws.t} s`], ["latency_ms", ws.latency], ["agentsAvoided", ws.avoided], ["lateralOffset", `${ws.offset} m`], ["completion", `${ws.completion} %`], ["scenario", `'${SCENARIOS[scn]!.id}'`]].map(([n, v]) => (
                <tr key={n as string} style={{ borderTop: `1px solid ${C.tab}` }}><td className="px-2 py-1">{n}</td><td className="px-2 py-1">{String(v)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p style={{ color: C.muted }} className="px-3 py-2 text-[11px]">
        Browser recreation of a MATLAB-style workflow for demonstration. Not MATLAB software; values are simulated. MATLAB and Simulink are trademarks of The MathWorks, Inc.
      </p>
    </div>
  );
}
