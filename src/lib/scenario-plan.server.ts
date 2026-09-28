import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { z } from "zod";

const RUN_ID = "X-Lovable-AIG-Run-ID";

const inputSchema = z.object({
  audience: z.enum(["OEM", "Investor", "Fleet operator", "Researcher"]),
  scenario: z.string().trim().min(20).max(2000),
});

const SYSTEM = `You are the simulation planning assistant for SAFEMARG (also called SafeAutonomy), an early-stage startup building simulation-based adaptive path planning and collision avoidance for unstructured Indian roads.
Given a road scenario and the reader's role, write a concise, practical simulation plan in Markdown with these sections:
## Scenario summary
## Road users & behaviours to model
## Environment & conditions
## Sensor setup (camera / radar / LiDAR)
## Test cases (numbered, 4-6, each with pass criteria)
## Metrics to measure (e.g. replanning latency, minimum gap, path smoothness, completion rate)
## Risks & edge cases
## Next steps for this ${"{audience}"}
Tailor emphasis to the audience (OEM: integration and validation detail; Investor: why it matters, market relevance, de-risking; Fleet operator: operations and safety; Researcher: methodology).
Rules: keep under ~450 words. Present metrics as targets to be measured, never as achieved results. Do not claim partnerships, certifications, awards, or customers.`;

function lovableFetch(initial?: string | null) {
  let runId = initial?.trim() || undefined;
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    const headers = new Headers(init?.headers);
    if (runId && !headers.has(RUN_ID)) headers.set(RUN_ID, runId);
    const res = await fetch(input, { ...init, headers });
    runId ??= res.headers.get(RUN_ID)?.trim() || undefined;
    return res;
  };
}

export async function handleScenarioPlan(request: Request) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) return Response.json({ error: "AI is not configured." }, { status: 500 });

  let body: z.infer<typeof inputSchema>;
  try {
    body = inputSchema.parse(await request.json());
  } catch {
    return Response.json(
      { error: "Please describe the scenario in at least 20 characters." },
      { status: 400 },
    );
  }

  const openai = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: lovableFetch(request.headers.get(RUN_ID)),
  });

  const result = streamText({
    model: openai.responses("openai/gpt-6-astra"),
    system: SYSTEM.replace("{audience}", body.audience),
    prompt: `Audience: ${body.audience}\n\nScenario:\n${body.scenario}`,
    abortSignal: request.signal,
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });

  // Surface gateway errors (402/403/429) as a clean status before streaming.
  const reader = result.fullStream.getReader();
  const encoder = new TextEncoder();
  let first: Awaited<ReturnType<typeof reader.read>>;
  try {
    for (;;) {
      first = await reader.read();
      if (first.done) break;
      const p = first.value;
      if (p.type === "error") throw p.error;
      if (p.type === "text-delta") break;
    }
  } catch (err) {
    const status = (err as { statusCode?: number })?.statusCode ?? 500;
    const msg =
      status === 402
        ? "AI credits have run out. Please try again later."
        : status === 429
          ? "Too many requests right now. Please wait a moment and try again."
          : "Could not generate a plan. Please try again.";
    return Response.json({ error: msg }, { status });
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        if (!first.done && first.value.type === "text-delta") {
          controller.enqueue(encoder.encode(first.value.text));
        }
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value.type === "text-delta") controller.enqueue(encoder.encode(value.text));
          if (value.type === "error") {
            controller.enqueue(encoder.encode("\n\n_Generation stopped due to an error._"));
            break;
          }
        }
      } finally {
        controller.close();
      }
    },
    cancel() {
      void reader.cancel();
    },
  });

  return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
