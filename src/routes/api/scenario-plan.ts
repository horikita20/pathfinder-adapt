import { createFileRoute } from "@tanstack/react-router";
import { handleScenarioPlan } from "@/lib/scenario-plan.server";

export const Route = createFileRoute("/api/scenario-plan")({
  server: { handlers: { POST: ({ request }) => handleScenarioPlan(request) } },
});
