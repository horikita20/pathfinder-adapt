// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { Plugin } from "vite";

/**
 * The dev-only devtools plugin injects `data-tsd-source` on every JSX element.
 * react-three-fiber rejects that prop on three.js elements ("Cannot set data-tsd-source"),
 * so strip it from the 3D simulator modules only.
 */
function stripSourceAttrFromThreeJsx(): Plugin {
  return {
    name: "strip-tsd-source-from-r3f",
    enforce: "post",
    transform(code, id) {
      if (!id.includes("/src/components/sim/")) return null;
      if (!code.includes("data-tsd-source")) return null;
      return { code: code.replace(/\s*"data-tsd-source":\s*"[^"]*",?/g, "").replace(/\s*data-tsd-source="[^"]*"/g, ""), map: null };
    },
  };
}

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [stripSourceAttrFromThreeJsx()],
  },
});
