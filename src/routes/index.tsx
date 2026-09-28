import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/nav";
import { Hero } from "@/components/site/hero";
import { Problem, Solution, Market, BusinessModel, Team } from "@/components/site/sections";
import { Contact, Footer } from "@/components/site/contact";
import carSketch from "@/assets/car-sketch.png.asset.json";

const title = "SAFEMARG | Adaptive Path Planning for Indian Roads";
const description =
  "SAFEMARG develops simulation-based autonomous driving and ADAS technology for complex, unstructured Indian roads.";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "keywords",
        content:
          "SAFEMARG, autonomous vehicles India, ADAS, path planning, simulation, Indian roads",
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
          name: "SAFEMARG",
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
    <div className="relative min-h-screen bg-background">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[5] bg-no-repeat opacity-[0.12] mix-blend-multiply"
        style={{
          backgroundImage: `url(${carSketch.url})`,
          backgroundPosition: "right 4% center",
          backgroundSize: "min(62vw, 720px) auto",
        }}
      />
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
