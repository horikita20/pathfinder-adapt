import { Suspense, lazy } from "react";
import { ClientOnly, Link, createFileRoute } from "@tanstack/react-router";

const Simulator = lazy(() => import("@/components/sim/Simulator"));

export const Route = createFileRoute("/simulator")({
  head: () => ({
    meta: [
      { title: "Indian Road Simulator | SAFEMARG" },
      {
        name: "description",
        content:
          "Drive an autonomous vehicle through simulated Indian streets — mixed traffic, potholes, cattle and pedestrians — with inside, chase and overview cameras plus live sensor detection.",
      },
      { property: "og:title", content: "Indian Road Simulator | SAFEMARG" },
      {
        property: "og:description",
        content: "Interactive 3D simulation of adaptive path planning and collision avoidance on unstructured Indian roads.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SimulatorPage,
});

function Loading({ label }: { label: string }) {
  return (
    <div className="flex h-[100dvh] w-full flex-col items-center justify-center gap-4 bg-sim-page">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-sim-cyan border-t-transparent" />
      <p className="text-sm text-sim-muted">{label}</p>
    </div>
  );
}

function SimulatorPage() {
  return (
    <main className="relative">
      <Link
        to="/"
        className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2 rounded-full border border-sim-line bg-sim-panel px-4 py-1.5 text-[11px] text-sim-muted shadow-sm backdrop-blur hover:text-sim-ink"
      >
        ← Back to site
      </Link>
      <ClientOnly fallback={<Loading label="Preparing simulation…" />}>
        <Suspense fallback={<Loading label="Loading 3D environment…" />}>
          <Simulator />
        </Suspense>
      </ClientOnly>
    </main>
  );
}
