import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/nav";
import { Hero } from "@/components/site/hero";
import { Problem, Solution, Market, BusinessModel, Team } from "@/components/site/sections";
import { Contact, Footer } from "@/components/site/contact";

const title = "SafeAutonomy India | Adaptive Path Planning for Indian Roads";
const description =
  "Simulation-based autonomous driving and ADAS for unstructured Indian roads. SIH 2026 problem statement SIH26037. Raising $2M seed.";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "keywords",
        content:
          "autonomous vehicles India, ADAS, path planning, simulation, SIH 2026, MathWorks, Indian roads",
      },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "SafeAutonomy India",
          description,
          email: "founders@safeautonomy.in",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Lucknow",
            addressRegion: "Uttar Pradesh",
            addressCountry: "IN",
          },
        }),
      },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Market />
        <BusinessModel />
        <Team />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
