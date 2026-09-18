import { ArrowDown, Mail } from "lucide-react";
import { Reveal } from "./reveal";
import { openEmail, scrollToSection } from "@/lib/contact-actions";

const proofPoints = ["5 Indian road scenarios", "<100ms replanning target", "Simulation-first validation"];

export function Hero() {
  return (
    <section
      id="home"
      className="hex-grid shell-gradient relative flex min-h-[88svh] items-center overflow-hidden px-6 pb-16 pt-28 lg:px-10"
    >
      <div className="mx-auto w-full max-w-4xl text-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Built for complex Indian roads
          </span>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="mt-7 text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Building autonomous vehicles for Indian roads
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Adaptive path planning and collision avoidance for unstructured, mixed-traffic
            environments.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => scrollToSection("solution")}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground transition-transform duration-200 hover:scale-[1.04] hover:shadow-[var(--shadow-glow)]"
            >
              View demo <ArrowDown size={17} />
            </button>
            <button
              type="button"
              onClick={() => openEmail("Hello from your website")}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-7 py-3.5 text-base font-medium text-foreground transition-transform duration-200 hover:scale-[1.04] hover:border-primary/50"
            >
              <Mail size={17} /> Contact founders
            </button>
          </div>
        </Reveal>

        <Reveal delay={320}>
          <ul className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-medium text-muted-foreground">
            {proofPoints.map((point) => (
              <li key={point} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-primary" aria-hidden />
                {point}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
