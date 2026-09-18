import { Suspense, lazy } from "react";
import { ClientOnly, Link, createFileRoute } from "@tanstack/react-router";

const TopDownSim = lazy(() => import("@/components/sim2d/TopDownSim"));

export const Route = createFileRoute("/perception")({
  head: () => ({
    meta: [
      { title: "Perception & Planning Demo | SafeAutonomy India" },
      {
        name: "description",
        content:
          "Live top-down simulation of camera, radar and LiDAR perception with adaptive path replanning across five unstructured Indian road scenarios.",
      },
      { property: "og:title", content: "Perception & Planning Demo | SafeAutonomy India" },
      {
        property: "og:description",
        content:
          "Watch sensor coverage, object detection and sub-100ms replanning run live on village roads, market streets, intersections, highway merges and cattle crossings.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PerceptionPage,
});

function Loading() {
  return (
    <div className="flex h-[100dvh] w-full flex-col items-center justify-center gap-4 bg-[#070b0f]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#22d3ee] border-t-transparent" />
      <p className="font-mono text-xs uppercase tracking-widest text-[#6b7681]">Initialising simulation</p>
    </div>
  );
}

function PerceptionPage() {
  return (
    <main className="relative bg-[#070b0f]">
      <Link
        to="/"
        className="absolute bottom-4 left-4 z-20 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-[#9aa4ac] backdrop-blur hover:text-white"
      >
        ← Back to site
      </Link>
      <ClientOnly fallback={<Loading />}>
        <Suspense fallback={<Loading />}>
          <TopDownSim />
        </Suspense>
      </ClientOnly>
    </main>
  );
}
