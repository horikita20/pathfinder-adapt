import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/nav";
import { Footer } from "@/components/site/contact";
import { Reveal, SectionTag } from "@/components/site/reveal";

const title = "Team | SAFEMARG";
const description =
  "Meet the SAFEMARG team — a founder-led effort building simulation-led perception and adaptive path planning for unstructured Indian roads.";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "/team" }],
  }),
  component: TeamPage,
});

const focus = [
  {
    title: "Perception",
    body: "Detection and tracking for Indian road classes — cars, auto-rickshaws, two-wheelers, pedestrians and animals — with distance and risk on every track.",
  },
  {
    title: "Adaptive path planning",
    body: "A planner that scores the full drivable width instead of following a lane, and re-plans continuously as the safe corridor shifts.",
  },
  {
    title: "Simulation and validation",
    body: "Five unstructured Indian road scenarios used as the regression suite for every algorithm change before vehicle testing.",
  },
  {
    title: "Prototype hardware",
    body: "A low-cost camera-first sensor and compute kit, wired and bench-tested before it goes on a vehicle.",
  },
];

function TeamPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main>
        <section className="border-b border-border px-6 pb-16 pt-32 lg:px-10 lg:pb-24 lg:pt-40">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <SectionTag>The team</SectionTag>
              <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.9rem]">
                Small team, one hard problem
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                SAFEMARG is founder-led and currently pre-seed. Everything on this site — the
                perception simulator, the hardware walkthrough and the prototype kit — was built
                in-house.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="border-b border-border bg-surface px-6 py-20 lg:px-10 lg:py-28">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <article className="rounded-lg border border-border bg-background p-8 shadow-[var(--shadow-card)] sm:p-10">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-primary/45 bg-muted text-xl font-semibold text-primary">
                    MS
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Monika Sharma</h2>
                    <p className="mt-1 text-sm text-primary">Founder &amp; CEO</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Maharana Pratap Group of Institutions (MPGI), Lucknow
                    </p>
                    <p className="mt-5 leading-relaxed text-muted-foreground">
                      Monika founded SAFEMARG to make autonomous driving work on the roads she
                      actually drives on. She leads the perception and adaptive path-planning work,
                      built the simulation environment used to validate every change, and assembled
                      the prototype sensor and compute kit herself.
                    </p>
                    <p className="mt-4 leading-relaxed text-muted-foreground">
                      Her focus right now is getting the planner to hold a safe corridor through
                      dense mixed traffic at real Indian road speeds, and taking that from
                      simulation into a supervised closed-campus pilot.
                    </p>
                  </div>
                </div>
              </article>
            </Reveal>
          </div>
        </section>

        <section className="border-b border-border px-6 py-20 lg:px-10 lg:py-28">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">What we work on</h2>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {focus.map((f, i) => (
                <Reveal key={f.title} delay={i * 70}>
                  <article className="h-full rounded-lg border border-border bg-background p-7 shadow-[var(--shadow-card)]">
                    <h3 className="text-lg font-semibold">{f.title}</h3>
                    <p className="mt-3 text-[0.975rem] leading-relaxed text-muted-foreground">
                      {f.body}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20 lg:px-10 lg:py-28">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Working with us</h2>
              <p className="mt-5 leading-relaxed text-muted-foreground">
                We are open to pilot conversations with fleet operators, campuses and OEM teams, and
                to collaborators who want to work on perception and planning for unstructured roads.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="/#contact"
                  className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Get in touch
                </a>
                <Link
                  to="/perception"
                  className="rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/45"
                >
                  See the simulator
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
