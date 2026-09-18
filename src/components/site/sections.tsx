import {
  AlertTriangle,
  Brain,
  Bus,
  Globe2,
  Map,
  Radar,
  Route as RouteIcon,
  TrafficCone,
  Truck,
  Users,
  Check,
} from "lucide-react";
import { Reveal, SectionTag } from "./reveal";

/* ---------------- Problem ---------------- */

const problems = [
  {
    icon: Users,
    tone: "text-primary",
    title: "Mixed traffic chaos",
    body: "Cars, buses, trucks, auto-rickshaws, two-wheelers, bicycles, pedestrians, pushcarts and animals share the same road space without lane discipline.",
  },
  {
    icon: TrafficCone,
    tone: "text-warning",
    title: "Unstructured infrastructure",
    body: "Missing lane markings, unclear road edges, potholes, informal merging, wrong-side driving and unmarked crossings.",
  },
  {
    icon: AlertTriangle,
    tone: "text-destructive",
    title: "Unpredictable behaviour",
    body: "Sudden pedestrian movement, cattle on the road, vehicles merging without signalling, crossings at unmarked locations.",
  },
];

export function Problem() {
  return (
    <section id="problem" className="border-t border-border bg-surface px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div>
          <Reveal>
            <SectionTag>The problem</SectionTag>
            <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.6rem]">
              Why Indian roads break autonomous driving
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Most autonomous driving systems are built for structured roads — clear lane markings,
              standard signage, predictable traffic flow. Indian roads are fundamentally different.
            </p>
          </Reveal>

          <div className="mt-12 space-y-4">
            {problems.map((item, i) => (
              <Reveal key={item.title} delay={i * 90}>
                <article className="group flex gap-5 rounded-xl border border-border bg-background/40 p-6 transition-colors hover:border-primary/40">
                  <item.icon className={`${item.tone} shrink-0`} size={30} strokeWidth={1.5} />
                  <div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-[0.975rem] leading-relaxed text-muted-foreground">
                      {item.body}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={120} className="lg:pt-24">
          <div className="rounded-2xl border border-warning/25 bg-background/60 p-10 text-center">
            <p className="text-5xl font-bold tracking-tight text-warning lg:text-6xl">1.4M+</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Road accident casualties reported in India each year — the highest burden in the
              world.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Solution ---------------- */

const features = [
  {
    icon: Radar,
    title: "Multi-sensor perception",
    body: "Camera, LiDAR and radar fusion detects every road user — vehicles, two-wheelers, autos, pedestrians, animals.",
    metric: "95%+ detection accuracy",
  },
  {
    icon: Brain,
    title: "Trajectory prediction",
    body: "Models predict short-term motion of surrounding agents, including non-lane-based and irregular movement.",
    metric: "<100ms prediction latency",
  },
  {
    icon: RouteIcon,
    title: "Adaptive path planner",
    body: "Generates collision-free paths that replan in real time as conditions change — missing lanes, potholes, sudden obstacles.",
    metric: "95%+ scenario completion",
  },
  {
    icon: Map,
    title: "Indian scenarios validated",
    body: "Unmarked village roads, busy urban intersections, highway merges, dense market areas and cattle-crossing events.",
    metric: "5 real scenarios",
  },
];

const stack = [
  "MATLAB",
  "Simulink",
  "RoadRunner",
  "Automated Driving Toolbox",
  "Deep Learning Toolbox",
];

export function Solution() {
  return (
    <section
      id="solution"
      className="shell-gradient border-t border-border px-6 py-24 lg:px-10 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionTag>Our solution</SectionTag>
          <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.6rem]">
            Adaptive path planning built for India
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            A simulation-based adaptive path planning system that perceives diverse road users,
            predicts their behaviour, and replans safe, collision-free paths in real time — tuned
            for Indian road conditions.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 80}>
              <article className="h-full rounded-2xl border border-border bg-card/70 p-8 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/45">
                <f.icon className="text-primary" size={30} strokeWidth={1.5} />
                <h3 className="mt-6 text-xl font-semibold">{f.title}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{f.body}</p>
                <p className="mt-6 text-base font-semibold text-primary">{f.metric}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 border-t border-border pt-10 text-sm uppercase tracking-[0.16em] text-muted-foreground/70">
            {stack.map((tool) => (
              <span key={tool}>{tool}</span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Market ---------------- */

const metrics = [
  { value: "$50B+", label: "Total addressable market" },
  { value: "1.4M", label: "Annual road casualties (India)" },
  { value: "400M", label: "Vehicles on Indian roads by 2030" },
  { value: "18%", label: "Global AV market CAGR" },
];

const segments = [
  {
    icon: Truck,
    title: "Commercial fleets — initial TAM $8B",
    body: "ADAS for trucks, buses and taxis: immediate revenue with fleet operators and OEMs.",
  },
  {
    icon: Bus,
    title: "Autonomous shuttles — $2B+",
    body: "IT parks, airports and BRT corridors: closed-campus autonomy deployment.",
  },
  {
    icon: Globe2,
    title: "Export to emerging markets",
    body: "South-East Asia, Africa and Latin America face the same unstructured road challenges.",
  },
];

export function Market() {
  return (
    <section id="market" className="border-t border-border bg-surface px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-14 lg:grid-cols-2">
          <Reveal>
            <SectionTag tone="warning">Market size</SectionTag>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.6rem]">
              A $50B+ untapped market
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              India has the world's largest road fatality burden and almost no autonomous driving
              solutions built for its conditions. We are capturing that white space.
            </p>
          </Reveal>

          <Reveal delay={100}>
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border">
              {metrics.map((m) => (
                <div key={m.label} className="bg-background p-7">
                  <dt className="text-3xl font-bold tracking-tight text-warning lg:text-4xl">
                    {m.value}
                  </dt>
                  <dd className="mt-2 text-sm text-muted-foreground">{m.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {segments.map((s, i) => (
            <Reveal key={s.title} delay={i * 90}>
              <article className="h-full rounded-xl border border-border bg-background/40 p-7 transition-colors hover:border-primary/40">
                <s.icon className="text-primary" size={26} strokeWidth={1.5} />
                <h3 className="mt-5 text-lg font-semibold leading-snug">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{s.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Business model ---------------- */

const plans = [
  {
    title: "Simulation platform",
    price: "$50K–500K / year",
    body: "Annual licensing to OEMs, Tier-1 suppliers and universities for scenario design and validation.",
    points: [
      "RoadRunner scenario library",
      "MATLAB / Simulink integration",
      "50+ Indian road scenarios",
      "Technical support & training",
    ],
  },
  {
    title: "ADAS software stack",
    price: "$200 / vehicle / year",
    body: "Recurring SaaS for commercial fleets — perception, prediction and planning on edge hardware.",
    points: [
      "Real-time perception & planning",
      "Over-the-air updates",
      "Fleet analytics dashboard",
      "24/7 support",
    ],
    highlight: true,
  },
  {
    title: "Validation services",
    price: "$100K–2M / project",
    body: "Custom scenario design and validation for government bodies, universities and OEM teams.",
    points: [
      "Bespoke scenario creation",
      "Regulatory compliance testing",
      "Data annotation & labelling",
      "Research partnerships",
    ],
  },
];

const phases = [
  { phase: "Year 1", text: "10+ university licences, 2 pilot fleets" },
  { phase: "Year 2–3", text: "OEM partnerships, 5K+ vehicles on ADAS" },
  { phase: "Year 4+", text: "Campus autonomy, export to SE Asia" },
];

export function BusinessModel() {
  return (
    <section
      id="model"
      className="shell-gradient border-t border-border px-6 py-24 lg:px-10 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal className="text-center">
          <SectionTag tone="success">Revenue model</SectionTag>
          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.6rem]">
            B2B SaaS and licensing — high margin, scalable
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Three revenue streams with 85%+ gross margins. Software-first, low COGS, recurring
            revenue.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {plans.map((p, i) => (
            <Reveal key={p.title} delay={i * 90}>
              <article
                className={`flex h-full flex-col rounded-2xl border bg-background/60 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-glow)] ${
                  p.highlight ? "border-primary/45" : "border-border hover:border-primary/40"
                }`}
              >
                <h3 className="text-xl font-semibold">{p.title}</h3>
                <p className="mt-3 text-2xl font-bold tracking-tight text-primary">{p.price}</p>
                <p className="mt-4 leading-relaxed text-muted-foreground">{p.body}</p>
                <ul className="mt-7 space-y-2.5 border-t border-border pt-7 text-sm text-muted-foreground">
                  {p.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5">
                      <Check size={16} className="mt-0.5 shrink-0 text-success" />
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {phases.map((p, i) => (
            <Reveal key={p.phase} delay={i * 80}>
              <div className="rounded-xl border-l-2 border-primary/60 bg-background/40 px-6 py-5">
                <p className="text-xs uppercase tracking-[0.16em] text-primary">{p.phase}</p>
                <p className="mt-2 text-muted-foreground">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Team ---------------- */

const team = [
  {
    name: "Monika Sharma",
    role: "Founder & CEO",
    bio: "Building SAFEMARG's simulation-led perception and adaptive path-planning platform for Indian road conditions.",
  },
];

export function Team() {
  return (
    <section id="team" className="border-t border-border bg-surface px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="text-center">
          <SectionTag>The team</SectionTag>
          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.6rem]">
            Engineers who have solved this before
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Deep expertise in autonomous driving, machine learning and Indian road systems, backed
            by advisors from industry and academia.
          </p>
        </Reveal>

        <div className="mx-auto mt-14 max-w-2xl">
          {team.map((member, i) => (
            <Reveal key={member.role} delay={i * 80}>
              <article className="flex h-full items-start gap-6 rounded-2xl border border-border bg-background/50 p-7 transition-colors hover:border-primary/40">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-primary/45 bg-muted text-lg font-semibold text-primary">
                  {member.name
                    .split(" ")
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="mt-0.5 text-sm text-primary">{member.role}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
