import { ArrowDown, Mail } from "lucide-react";
import { Reveal } from "./reveal";
import { openEmail, scrollToSection } from "@/lib/contact-actions";

const badges = ["SIH 2026 Finalist", "MathWorks Partner", "IIT Partner College", "IEEE Member"];

export function Hero() {
  return (
    <section
      id="home"
      className="hex-grid shell-gradient relative flex min-h-screen items-center overflow-hidden px-6 pb-16 pt-28 lg:px-10"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-10 h-[34rem] w-[34rem] rounded-full bg-primary/10 blur-[140px]"
      />
      <div className="mx-auto w-full max-w-4xl text-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Pre-seed · raising $2M
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
          <ul className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs uppercase tracking-[0.18em] text-muted-foreground/70">
            {badges.map((badge) => (
              <li key={badge}>{badge}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
