import { Suspense, lazy } from "react";
import { ClientOnly, createFileRoute } from "@tanstack/react-router";

const MatlabDemo = lazy(() => import("@/components/matlab/MatlabDemo"));

export const Route = createFileRoute("/matlab-demo")({
  head: () => ({
    meta: [
      { title: "MATLAB-style Simulation Demo | SAFEMARG" },
      { name: "description", content: "Run SAFEMARG's adaptive path planning simulation inside a MATLAB-style desktop in your browser across five Indian road scenarios." },
      { property: "og:title", content: "MATLAB-style Simulation Demo | SAFEMARG" },
      { property: "og:description", content: "Editor, command window, workspace and live bird's-eye figure — watch the planner avoid cattle, autos and pedestrians." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <ClientOnly fallback={<div className="p-10 text-center text-muted-foreground">Loading demo…</div>}>
      <Suspense fallback={<div className="p-10 text-center text-muted-foreground">Loading demo…</div>}>
        <MatlabDemo />
      </Suspense>
    </ClientOnly>
  ),
});
