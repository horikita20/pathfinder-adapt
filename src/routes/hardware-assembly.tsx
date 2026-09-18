import { lazy, Suspense } from "react";
import { ClientOnly, createFileRoute } from "@tanstack/react-router";

const HardwareAssembly = lazy(() => import("@/components/hardware/HardwareAssembly"));

const title = "Hardware Assembly Walkthrough | SafeAutonomy India";
const description =
  "Interactive five-step schematic showing how the SafeAutonomy prototype connects sensors, vision, motor control, power and AI path planning.";

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
  return <div className="hardware-loading">Loading hardware schematic…</div>;
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