import { toast } from "sonner";

export const FOUNDERS_EMAIL = "founders@safeautonomy.in";

/**
 * Opens the visitor's email app. Preview iframes and some browsers block
 * `mailto:` navigation, so we always fall back to copying the address.
 */
export function openEmail(subject: string, body?: string) {
  const params = new URLSearchParams({ subject });
  if (body) params.set("body", body);
  const href = `mailto:${FOUNDERS_EMAIL}?${params.toString()}`;

  let opened = false;
  try {
    const win = window.open(href, "_blank");
    opened = Boolean(win);
    if (!opened) window.location.href = href;
  } catch {
    opened = false;
  }

  void navigator.clipboard?.writeText(FOUNDERS_EMAIL).catch(() => undefined);
  toast.success("Opening your email app", {
    description: `If nothing opens, write to ${FOUNDERS_EMAIL} — it's copied to your clipboard.`,
  });
}

export function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  if (typeof history !== "undefined") history.replaceState(null, "", `#${id}`);
}
