import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Sparkles, Square } from "lucide-react";
import { SiteNav } from "@/components/site/nav";
import { Footer } from "@/components/site/contact";

const title = "AI Scenario Planner | SAFEMARG";
const description =
  "Describe any Indian road scenario and get a tailored simulation test plan for SAFEMARG's adaptive path planning stack.";

export const Route = createFileRoute("/scenario-planner")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlannerPage,
});

const audiences = ["OEM", "Investor", "Fleet operator", "Researcher"] as const;

const examples = [
  "Evening rush at a Lucknow market street: no lane markings, parked handcarts, auto-rickshaws cutting in, pedestrians crossing anywhere, light drizzle.",
  "Two-lane state highway at night with an overloaded truck ahead, oncoming bus overtaking on the wrong side and cattle near the shoulder.",
  "Village road with potholes and a school zone, children walking along the edge and a tractor merging from a field.",
];

function PlannerPage() {
  const [audience, setAudience] = useState<(typeof audiences)[number]>("OEM");
  const [scenario, setScenario] = useState("");
  const [plan, setPlan] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError("");
    setPlan("");
    setLoading(true);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const res = await fetch("/api/scenario-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audience, scenario }),
        signal: ctrl.signal,
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Could not generate a plan. Please try again.");
        return;
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let text = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        text += dec.decode(value, { stream: true });
        setPlan(text);
      }
      if (!text.trim()) setError("No plan was returned. Please try a more detailed description.");
    } catch (err) {
      if ((err as Error).name !== "AbortError") setError("Connection lost. Please try again.");
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto max-w-5xl px-6 pb-24 pt-28 lg:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          AI scenario planner
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Describe a road. Get a simulation plan.
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Tell us about an Indian road situation you care about. Our AI drafts the road users,
          sensor setup, test cases and metrics we would use to validate it in simulation.
        </p>

        <form onSubmit={generate} className="mt-10 rounded-lg border border-border bg-card p-6">
          <fieldset>
            <legend className="text-sm font-medium">I am a…</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {audiences.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAudience(a)}
                  aria-pressed={audience === a}
                  className={`rounded-md border px-4 py-2 text-sm transition-colors ${
                    audience === a
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </fieldset>

          <label htmlFor="scenario" className="mt-6 block text-sm font-medium">
            Road scenario
          </label>
          <textarea
            id="scenario"
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            rows={5}
            maxLength={2000}
            placeholder="e.g. Busy unmarked intersection in Kanpur with e-rickshaws, cyclists and a stray cow…"
            className="mt-2 w-full rounded-md border border-input bg-background p-3 text-sm outline-none focus:border-primary"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {examples.map((ex, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setScenario(ex)}
                className="rounded-md bg-muted px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                Example {i + 1}
              </button>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="submit"
              disabled={loading || scenario.trim().length < 20}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {loading ? "Generating…" : "Generate plan"}
            </button>
            {loading && (
              <button
                type="button"
                onClick={() => abortRef.current?.abort()}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-3 text-sm"
              >
                <Square size={14} /> Stop
              </button>
            )}
          </div>
        </form>

        {error && (
          <p className="mt-6 rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </p>
        )}

        {plan && (
          <article className="mt-8 rounded-lg border border-border bg-card p-6">
            <Markdownish text={plan} />
            <p className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">
              AI-generated draft. Metrics are targets to be measured in simulation, not validated
              results.
            </p>
          </article>
        )}
      </main>
      <Footer />
    </div>
  );
}

function inline(s: string) {
  return s.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      part
    ),
  );
}

function Markdownish({ text }: { text: string }) {
  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {text.split("\n").map((line, i) => {
        const t = line.trim();
        if (!t) return null;
        if (t.startsWith("## ") || t.startsWith("### "))
          return (
            <h2 key={i} className="pt-4 text-base font-semibold text-foreground">
              {t.replace(/^#+\s/, "")}
            </h2>
          );
        if (/^[-*]\s/.test(t))
          return (
            <p key={i} className="pl-4 text-muted-foreground before:-ml-4 before:mr-2 before:content-['•']">
              {inline(t.slice(2))}
            </p>
          );
        return (
          <p key={i} className="text-muted-foreground">
            {inline(t)}
          </p>
        );
      })}
    </div>
  );
}
