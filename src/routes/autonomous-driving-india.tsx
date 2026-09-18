import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/nav";
import { Footer } from "@/components/site/contact";
import { Reveal, SectionTag } from "@/components/site/reveal";

const title = "Autonomous Driving India | Why Indian Roads Need Purpose-Built ADAS";
const description =
  "Autonomous driving in India fails on imported assumptions. SAFEMARG explains why unstructured Indian roads need purpose-built ADAS, and demonstrates it with a live perception simulator and a hardware walkthrough.";

export const Route = createFileRoute("/autonomous-driving-india")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "keywords",
        content:
          "autonomous driving India, self driving cars in India, ADAS India, ADAS simulation India, Indian roads autonomous vehicles, adaptive path planning",
      },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "/autonomous-driving-india" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Why autonomous driving in India needs purpose-built ADAS",
          description,
          author: { "@type": "Organization", name: "SAFEMARG" },
          publisher: { "@type": "Organization", name: "SAFEMARG" },
          inLanguage: "en-IN",
          about: "Autonomous driving India",
        }),
      },
    ],
  }),
  component: AutonomousDrivingIndia,
});

const gaps = [
  {
    heading: "Lane-centric planners have no lanes to centre on",
    body: "Most production ADAS stacks localise the ego vehicle against lane markings and a high-definition map. On an Indian district road there is often no centre line, no shoulder line, and the drivable edge changes with the weather. A planner that needs a lane is blind before perception even starts.",
  },
  {
    heading: "Traffic is mixed, not homogeneous",
    body: "A single 20-metre stretch can contain a truck, three two-wheelers overtaking on both sides, an auto-rickshaw stopping without indication, a cyclist, a pedestrian crossing mid-block and cattle standing still. Detection classes trained mainly on cars and pedestrians in Western datasets under-represent auto-rickshaws, loaded cycle-rickshaws and animals.",
  },
  {
    heading: "Right of way is negotiated, not signalled",
    body: "At an unsignalized intersection nobody yields by rule; gaps are created by slow, continuous negotiation. A prediction model that assumes rule-following agents either freezes or takes an unsafe gap. Behaviour models have to be fitted to how Indian drivers actually move.",
  },
  {
    heading: "Surfaces and visibility degrade the sensor stack",
    body: "Potholes, dust, unlit night roads, monsoon spray and high-beam glare all reduce camera reliability at exactly the moments risk is highest. Redundancy and graceful degradation matter more here than raw peak accuracy on a clean benchmark.",
  },
  {
    heading: "Cost ceilings are different",
    body: "A sensor suite that costs more than the vehicle it is fitted to will never reach an Indian commercial fleet. Purpose-built means hitting useful safety performance within a few thousand dollars per vehicle, not a hundred thousand.",
  },
];

const approach = [
  {
    step: "01",
    title: "Simulation first",
    body: "Every algorithm change is validated across five unstructured Indian road scenarios — village road, dense market street, unsignalized intersection, highway merge and cattle crossing — before it touches a vehicle.",
  },
  {
    step: "02",
    title: "Perception tuned to Indian classes",
    body: "Detection and tracking cover auto-rickshaws, two-wheelers, pedestrians and animals as first-class categories, with distance and risk attached to each track.",
  },
  {
    step: "03",
    title: "Adaptive path planning",
    body: "Instead of following a lane, the planner continuously scores lateral offsets across the whole drivable width and re-plans as soon as the cheapest safe corridor moves.",
  },
  {
    step: "04",
    title: "Affordable hardware",
    body: "A camera-first suite with radar and a solid-state LiDAR option, targeted at roughly $2,500 per vehicle for the standard commercial tier.",
  },
];

function AutonomousDrivingIndia() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main>
        <section className="border-b border-border px-6 pb-16 pt-32 lg:px-10 lg:pb-24 lg:pt-40">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <SectionTag>Autonomous driving India</SectionTag>
              <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.9rem] lg:leading-[1.1]">
                Why unstructured Indian roads need purpose-built ADAS
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Autonomous driving research has largely been solved for structured roads. India is
                not a harder version of that problem — it is a different problem. The assumptions
                that make a Western ADAS stack work are the same assumptions that break it here.
              </p>
            </Reveal>
            <Reveal delay={90}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/perception"
                  className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  See the live perception simulator
                </Link>
                <Link
                  to="/hardware-assembly"
                  className="rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/45"
                >
                  Hardware walkthrough
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="border-b border-border bg-surface px-6 py-20 lg:px-10 lg:py-28">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Five reasons imported stacks fail in India
              </h2>
            </Reveal>
            <div className="mt-10 space-y-4">
              {gaps.map((g, i) => (
                <Reveal key={g.heading} delay={i * 70}>
                  <article className="rounded-lg border border-border bg-background p-7 shadow-[var(--shadow-card)]">
                    <h3 className="text-lg font-semibold">{g.heading}</h3>
                    <p className="mt-3 leading-relaxed text-muted-foreground">{g.body}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border px-6 py-20 lg:px-10 lg:py-28">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                What purpose-built looks like
              </h2>
              <p className="mt-5 leading-relaxed text-muted-foreground">
                SAFEMARG is building the perception and planning layer for these conditions, and
                validating it in simulation before every vehicle test.
              </p>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {approach.map((a, i) => (
                <Reveal key={a.step} delay={i * 70}>
                  <article className="h-full rounded-lg border border-border bg-background p-7 shadow-[var(--shadow-card)]">
                    <p className="text-xs uppercase tracking-[0.18em] text-primary">{a.step}</p>
                    <h3 className="mt-3 text-lg font-semibold">{a.title}</h3>
                    <p className="mt-3 text-[0.975rem] leading-relaxed text-muted-foreground">
                      {a.body}
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
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">See it running</h2>
              <p className="mt-5 leading-relaxed text-muted-foreground">
                Both demos run live in the browser — no video, no mock-up.
              </p>
            </Reveal>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <Reveal>
                <Link
                  to="/perception"
                  className="block h-full rounded-lg border border-border bg-background p-7 shadow-[var(--shadow-card)] transition-colors hover:border-primary/45"
                >
                  <h3 className="text-lg font-semibold">Perception simulator</h3>
                  <p className="mt-3 text-[0.975rem] leading-relaxed text-muted-foreground">
                    Top-down Indian road scenarios with sensor coverage, detections, a re-planning
                    corridor and measured planner latency.
                  </p>
                  <p className="mt-4 text-sm font-medium text-primary">Open the simulator →</p>
                </Link>
              </Reveal>
              <Reveal delay={80}>
                <Link
                  to="/hardware-assembly"
                  className="block h-full rounded-lg border border-border bg-background p-7 shadow-[var(--shadow-card)] transition-colors hover:border-primary/45"
                >
                  <h3 className="text-lg font-semibold">Hardware walkthrough</h3>
                  <p className="mt-3 text-[0.975rem] leading-relaxed text-muted-foreground">
                    Step-by-step wiring of the prototype: controller, ultrasonic sensor, camera,
                    motor driver, power rail and the WiFi link to the planning laptop.
                  </p>
                  <p className="mt-4 text-sm font-medium text-primary">Open the walkthrough →</p>
                </Link>
              </Reveal>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
