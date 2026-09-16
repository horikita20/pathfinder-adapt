import { useState, type FormEvent } from "react";
import { Github, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { Reveal } from "./reveal";

const schema = z.object({
  name: z.string().trim().min(1, "Please add your name").max(100),
  email: z.string().trim().email("Please use a valid email address").max(255),
  message: z.string().trim().min(1, "Please add a short message").max(1000),
});

const socials = [
  { icon: Linkedin, href: "https://www.linkedin.com", label: "LinkedIn" },
  { icon: Twitter, href: "https://x.com", label: "X" },
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Mail, href: "mailto:founders@safeautonomy.in", label: "Email" },
];

export function Contact() {
  const [submitting, setSubmitting] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const parsed = schema.safeParse(data);

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }

    setSubmitting(true);
    const { name, email, message } = parsed.data;
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:founders@safeautonomy.in?subject=${encodeURIComponent(
      `Enquiry from ${name}`,
    )}&body=${body}`;
    toast.success("Opening your email app to send this to the founders.");
    form.reset();
    setSubmitting(false);
  }

  const field =
    "w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40";

  return (
    <section
      id="contact"
      className="shell-gradient hex-grid border-t border-border px-6 py-24 lg:px-10 lg:py-32"
    >
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Ready to transform Indian road safety?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            We are raising $2M seed to scale our simulation platform and deploy ADAS in 10,000+
            commercial vehicles by 2028.
          </p>
        </Reveal>

        <Reveal delay={90}>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="mailto:founders@safeautonomy.in?subject=Demo%20request"
              className="inline-flex items-center rounded-lg bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground transition-transform duration-200 hover:scale-[1.04] hover:shadow-[var(--shadow-glow)]"
            >
              Schedule a demo
            </a>
            <a
              href="mailto:founders@safeautonomy.in?subject=Pitch%20deck%20request"
              className="inline-flex items-center rounded-lg border border-border px-7 py-3.5 text-base font-medium transition-transform duration-200 hover:scale-[1.04] hover:border-primary/50"
            >
              Request pitch deck
            </a>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <li>
              <a href="mailto:founders@safeautonomy.in" className="text-primary hover:underline">
                founders@safeautonomy.in
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={15} /> +91 00000 00000
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={15} /> Lucknow, Uttar Pradesh, India
            </li>
          </ul>
        </Reveal>

        <Reveal delay={180}>
          <ul className="mt-7 flex items-center justify-center gap-5">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  aria-label={s.label}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="inline-flex text-primary transition-transform duration-200 hover:scale-110"
                >
                  <s.icon size={22} />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={220}>
          <form onSubmit={onSubmit} className="mx-auto mt-14 max-w-lg space-y-3 text-left">
            <label className="sr-only" htmlFor="name">
              Your name
            </label>
            <input id="name" name="name" placeholder="Your name" className={field} />
            <label className="sr-only" htmlFor="email">
              Your email
            </label>
            <input id="email" name="email" placeholder="Your email" className={field} />
            <label className="sr-only" htmlFor="message">
              Your message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder="Your message"
              className={field}
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground transition-transform duration-200 hover:scale-[1.02] disabled:opacity-60"
            >
              Send message
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-background px-6 py-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
        <p>© 2026 SafeAutonomy India. All rights reserved.</p>
        <p className="flex gap-5">
          <a href="mailto:founders@safeautonomy.in" className="hover:text-foreground">
            Privacy policy
          </a>
          <a href="mailto:founders@safeautonomy.in" className="hover:text-foreground">
            Terms of service
          </a>
        </p>
      </div>
    </footer>
  );
}
