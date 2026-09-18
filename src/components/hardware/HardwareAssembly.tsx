import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BatteryCharging,
  Camera,
  Check,
  CircuitBoard,
  Cpu,
  Laptop,
  Radio,
  RotateCcw,
  Wifi,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    number: "01",
    eyebrow: "Controller online",
    title: "Power up the ESP32",
    detail: "The ESP32 initializes the control loop, GPIO interfaces, WiFi and Bluetooth Low Energy.",
  },
  {
    number: "02",
    eyebrow: "Distance sensing",
    title: "Connect the ultrasonic sensor",
    detail: "TRIG initiates each pulse. ECHO returns its flight time so the controller can calculate obstacle distance.",
  },
  {
    number: "03",
    eyebrow: "Vision input",
    title: "Add the ESP32-CAM",
    detail: "The camera streams compressed frames over a high-speed UART link for local processing and uplink.",
  },
  {
    number: "04",
    eyebrow: "Vehicle actuation",
    title: "Wire the motor driver",
    detail: "Direction pins control motor polarity while the PWM enable line regulates vehicle speed.",
  },
  {
    number: "05",
    eyebrow: "Complete system",
    title: "Connect power and intelligence",
    detail: "The regulated battery rail powers the prototype while WiFi exchanges sensor data and driving commands with the AI laptop.",
  },
] as const;

type NodeProps = {
  active: boolean;
  current?: boolean;
  className: string;
  icon: typeof Cpu;
  index: string;
  title: string;
  subtitle: string;
  status: string;
};

function HardwareNode({ active, current, className, icon: Icon, index, title, subtitle, status }: NodeProps) {
  return (
    <div
      className={cn("hardware-node", className, active && "is-active", current && "is-current")}
      aria-label={`${title}: ${active ? "connected" : "not connected"}`}
    >
      <span className="hardware-node-index">{index}</span>
      <Icon className="hardware-node-icon" aria-hidden />
      <div className="min-w-0">
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>
      <span className="hardware-node-status">
        {active ? <Check aria-hidden /> : <span aria-hidden />}
        {active ? status : "STANDBY"}
      </span>
    </div>
  );
}

type ConnectionProps = {
  visible: boolean;
  current: boolean;
  path: string;
  labelX: number;
  labelY: number;
  labels: readonly string[];
  wifi?: boolean;
};

function Connection({ visible, current, path, labelX, labelY, labels, wifi }: ConnectionProps) {
  if (!visible) return null;
  const plateHeight = labels.length * 24 + 16;
  const plateWidth = Math.max(...labels.map((label) => label.length)) * 8.2 + 30;

  return (
    <g className={cn("hardware-connection", wifi && "is-wifi", current && "is-entering")}>
      <path className="hardware-wire-glow" d={path} pathLength="1" />
      <path className="hardware-wire" d={path} pathLength="1" />
      <g className="hardware-wire-label" transform={`translate(${labelX - plateWidth / 2} ${labelY - plateHeight / 2})`}>
        <rect width={plateWidth} height={plateHeight} rx="5" />
        {labels.map((label, index) => (
          <text key={label} x={plateWidth / 2} y={22 + index * 24} textAnchor="middle">
            {wifi && index === 0 ? `⌁  ${label}` : label}
          </text>
        ))}
      </g>
    </g>
  );
}

export default function HardwareAssembly() {
  const [step, setStep] = useState(1);
  const activeStep = STEPS[step - 1] ?? STEPS[0];

  const goNext = useCallback(() => setStep((value) => Math.min(5, value + 1)), []);
  const goPrevious = useCallback(() => setStep((value) => Math.max(1, value - 1)), []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        goNext();
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrevious();
      }
      if (event.key.toLowerCase() === "r") setStep(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrevious]);

  return (
    <main className="hardware-shell">
      <header className="hardware-header">
        <div className="hardware-brand">
          <Link to="/" aria-label="Back to SAFEMARG">
            <CircuitBoard aria-hidden />
          </Link>
          <div>
            <span>SAFEMARG / LAB 01</span>
            <strong>Hardware Assembly</strong>
          </div>
        </div>
        <div className="hardware-system-status" aria-label="System status">
          <span aria-hidden /> SYSTEM BUILD · {step === 5 ? "ONLINE" : "IN PROGRESS"}
        </div>
      </header>

      <section className="hardware-stage" aria-labelledby="assembly-heading">
        <div className="hardware-copy" key={`copy-${step}`}>
          <span>{activeStep.eyebrow}</span>
          <h1 id="assembly-heading">{activeStep.title}</h1>
          <p>{activeStep.detail}</p>
        </div>

        <div className="hardware-board-wrap">
          <div className="hardware-board" aria-live="polite">
            <div className="hardware-board-meta hardware-board-meta-left">SCHEMATIC / REV 1.0</div>
            <div className="hardware-board-meta hardware-board-meta-right">12V INPUT · 5V LOGIC</div>

            <svg className="hardware-connections" viewBox="0 0 1200 700" preserveAspectRatio="none" aria-hidden>
              <defs>
                <filter id="wire-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="7" />
                </filter>
              </defs>
              <Connection
                visible={step >= 2}
                current={step === 2}
                path="M600 296 L600 205 L410 205 L410 164"
                labelX={515}
                labelY={215}
                labels={["GPIO5 → TRIG", "GPIO18 → ECHO"]}
              />
              <Connection
                visible={step >= 3}
                current={step === 3}
                path="M462 360 L368 360 L368 334 L310 334"
                labelX={386}
                labelY={395}
                labels={["UART TX/RX (2 Mbps)"]}
              />
              <Connection
                visible={step >= 4}
                current={step === 4}
                path="M600 430 L600 492 L418 492 L418 538"
                labelX={532}
                labelY={505}
                labels={["GPIO25/26 → IN1/IN2", "GPIO27 → ENA (PWM)"]}
              />
              <Connection
                visible={step >= 5}
                current={step === 5}
                path="M738 360 L838 360 L838 482 L895 482"
                labelX={835}
                labelY={402}
                labels={["5V / GND rail"]}
              />
              <Connection
                visible={step >= 5}
                current={step === 5}
                wifi
                path="M728 315 C795 245 830 235 872 245 S940 210 980 180"
                labelX={865}
                labelY={205}
                labels={["WiFi: sensor data + commands"]}
              />
            </svg>

            <HardwareNode active current={step === 1} className="node-esp32" icon={Cpu} index="01" title="ESP32" subtitle="Dev Module · WiFi + BLE" status="CONTROLLER" />
            <HardwareNode active={step >= 2} current={step === 2} className="node-ultrasonic" icon={Radio} index="02" title="HC-SR04" subtitle="Ultrasonic Sensor" status="SENSING" />
            <HardwareNode active={step >= 3} current={step === 3} className="node-camera" icon={Camera} index="03" title="ESP32-CAM" subtitle="OV2640 Camera Module" status="STREAMING" />
            <HardwareNode active={step >= 4} current={step === 4} className="node-motor" icon={CircuitBoard} index="04" title="L298N" subtitle="Motor Driver · 2× DC" status="ACTUATION" />
            <HardwareNode active={step >= 5} current={step === 5} className="node-battery" icon={BatteryCharging} index="05" title="Li-ion 2S" subtitle="Battery + Buck Converter" status="POWERED" />
            <HardwareNode active={step >= 5} current={step === 5} className="node-laptop" icon={Laptop} index="06" title="AI Laptop" subtitle="Detection + Path Planning" status="LINKED" />

            <div className="hardware-board-corner corner-a" aria-hidden />
            <div className="hardware-board-corner corner-b" aria-hidden />
            <div className="hardware-board-corner corner-c" aria-hidden />
            <div className="hardware-board-corner corner-d" aria-hidden />
          </div>
        </div>
      </section>

      <footer className="hardware-controls">
        <div className="hardware-progress" aria-label={`Step ${step} of 5`}>
          <span className="hardware-progress-count">{activeStep.number}<small>/ 05</small></span>
          <div className="hardware-progress-track">
            {STEPS.map((item, index) => (
              <button
                key={item.number}
                type="button"
                onClick={() => setStep(index + 1)}
                className={cn(index + 1 <= step && "is-complete", index + 1 === step && "is-current")}
                aria-label={`Go to step ${index + 1}: ${item.title}`}
                aria-current={index + 1 === step ? "step" : undefined}
              />
            ))}
          </div>
        </div>

        <div className="hardware-actions">
          {step === 5 ? (
            <Button variant="outline" size="lg" onClick={() => setStep(1)} className="hardware-replay">
              <RotateCcw aria-hidden /> Replay assembly
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="lg" onClick={goPrevious} disabled={step === 1}>
                <ArrowLeft aria-hidden /> Previous
              </Button>
              <Button size="lg" onClick={goNext} className="hardware-next">
                Next connection <ArrowRight aria-hidden />
              </Button>
            </>
          )}
        </div>

        <div className="hardware-key-hint"><span>←</span><span>→</span> navigate · <span>R</span> restart</div>
      </footer>
    </main>
  );
}