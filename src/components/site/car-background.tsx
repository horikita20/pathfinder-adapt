import { useEffect, useRef } from "react";
import carSketch from "@/assets/car-sketch.png.asset.json";

/** Fixed car sketch that drifts, rotates and zooms as the page scrolls. */
export function CarBackground() {
  const carRef = useRef<HTMLDivElement>(null);
  const roadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = window.scrollY / max; // 0 → 1
      const mobile = window.innerWidth < 768;
      const x = Math.sin(p * Math.PI * 2) * (mobile ? 12 : 22); // vw swerve, like lane changes
      const y = (p - 0.5) * (mobile ? 18 : 28); // vh
      const rot = Math.sin(p * Math.PI * 3) * 8;
      const scale = 0.85 + Math.sin(p * Math.PI) * 0.3;
      if (carRef.current)
        carRef.current.style.transform = `translate3d(${x}vw, ${y}vh, 0) rotate(${rot}deg) scale(${scale})`;
      if (roadRef.current) roadRef.current.style.backgroundPositionY = `${window.scrollY * 0.6}px`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[5] overflow-hidden mix-blend-multiply">
      {/* dashed road lane markings moving with scroll */}
      <div
        ref={roadRef}
        className="absolute inset-y-0 right-[18%] w-[2px] opacity-[0.04] md:right-[28%]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, var(--foreground) 0 40px, transparent 40px 90px)",
        }}
      />
      <div
        ref={carRef}
        className="absolute bottom-[4%] right-[-10%] h-[60vw] w-[78vw] bg-contain bg-center bg-no-repeat opacity-[0.07] will-change-transform md:bottom-auto md:right-[4%] md:top-1/2 md:-mt-[22vw] md:h-[44vw] md:max-h-[560px] md:w-[min(62vw,720px)] md:opacity-[0.13]"
        style={{ backgroundImage: `url(${carSketch.url})`, transition: "transform 120ms linear" }}
      />
    </div>
  );
}
