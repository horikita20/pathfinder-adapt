import { lazy, Suspense } from "react";
import { ClientOnly, createFileRoute } from "@tanstack/react-router";

const HardwareAssembly = lazy(() => import("@/components/hardware/HardwareAssembly"));

const title = "System Assembly Walkthrough | SAFEMARG";
const description =
  "Interactive five-step walkthrough of the SAFEMARG MATLAB/Simulink pipeline: sensor models, camera detection, adaptive planning, vehicle dynamics and RoadRunner validation.";

export const Route = createFileRoute("/hardware-assembly")({
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
  component: HardwareAssemblyPage,
});

function Loading() {
  return <div className="hardware-loading">Loading system model…</div>;
}

function HardwareAssemblyPage() {
  return (
    <ClientOnly fallback={<Loading />}>
      <Suspense fallback={<Loading />}>
        <HardwareAssembly />
      </Suspense>
    </ClientOnly>
  );
}