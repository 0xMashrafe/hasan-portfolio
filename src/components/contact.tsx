import { AnimatePresence, motion } from "motion/react";
import { ArrowUp, ArrowUpRight, Check, Copy, Mail } from "lucide-react";
import { navSections, profile } from "../data";
import { scrollToId, useLocalTime } from "../lib/utils";
import { Magnetic, Reveal, Ticker } from "./motion";

export function Contact({
  copyEmail,
  toast,
}: {
  copyEmail: () => void;
  toast: string | null;
}) {
  const time = useLocalTime(profile.timeZone);

  return (
    <section id="contact" className="relative overflow-hidden pt-20 md:pt-28">
      <div className="container-x">
        <div className="flex items-center gap-3 border-b border-line pb-5">
          <span className="mono text-accent-text">06</span>
          <span className="h-px w-8 bg-line" />
          <span className="mono text-muted">Contact</span>
          <span className="mono ml-auto hidden text-muted sm:block">
            {time} GMT+6 · {profile.location}
          </span>
        </div>

        <div className="grid gap-12 pt-10 md:grid-cols-12 md:gap-8 md:pt-14">
          <div className="md:col-span-7">
            <Reveal>
              <p className="mono mb-5 flex items-center gap-2 text-muted">
                <span className="relative flex size-1.5">
                  <span className="size-1.5 rounded-full bg-accent" />
                  <span className="pulse-dot absolute inset-0 text-accent" />
                </span>
                {profile.availability} — Q3 / Q4 2026
              </p>
            </Reveal>

            <h2 className="display-tight text-[clamp(2.9rem,7.4vw,5.6rem)]">
              <span className="block overflow-hidden">
                <Reveal y={30}>
                  <span className="block">Let&apos;s make</span>
                </Reveal>
              </span>
              <span className="block overflow-hidden">
                <Reveal y={30} delay={0.06}>
                  <span className="block">
                    something worth
                  </span>
                </Reveal>
              </span>
              <span className="block overflow-hidden">
                <Reveal y={30} delay={0.12}>
                  <span className="block">
                    <span className="serif-italic text-accent-text">keeping.</span>
                  </span>
                </Reveal>
              </span>
            </h2>

            <Reveal delay={0.1}>
              <p className="mt-7 max-w-[44ch] text-[15px] leading-relaxed text-muted">
                I take on a small number of projects at a time — products, brands and interface
                systems where craft is the point. Tell me what you&apos;re building and I&apos;ll
                tell you honestly if I can help.
              </p>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Magnetic strength={0.18}>
                  <a
                    href={`mailto:${profile.email}`}
                    className="group flex items-center gap-3 rounded-full bg-ink px-5 py-3.5 text-[14px] font-medium text-bg transition-colors duration-300 hover:bg-accent hover:text-accent-ink"
                    data-cursor="EMAIL ME"
                  >
                    <Mail className="size-4" />
                    {profile.email}
                    <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </Magnetic>

                <button
                  type="button"
                  onClick={copyEmail}
                  className="group flex items-center gap-2 rounded-full border border-line px-4 py-3.5 text-[13px] text-muted transition-colors duration-300 hover:border-ink/35 hover:text-ink"
                >
                  <Copy className="size-3.5 transition-transform duration-300 group-hover:scale-110" />
                  Copy
                </button>
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-4 md:col-start-9">
            <Reveal delay={0.05}>
              <div className="mono mb-3 flex items-center justify-between text-muted">
                <span>Elsewhere</span>
                <span className="text-muted/50">04 links</span>
              </div>
              <ul>
                {profile.socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-2 border-t border-line py-3 last:border-b"
                    >
                      <span className="relative overflow-hidden text-[14px]">
                        <span className="block transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-full">
                          {social.label}
                        </span>
                        <span className="absolute inset-0 translate-y-full text-accent-text transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-y-0">
                          {social.label}
                        </span>
                      </span>
                      <span className="mono flex items-center gap-2 text-[9px] text-muted">
                        {social.handle}
                        <ArrowUpRight className="size-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.12} className="mt-8">
              <div className="rounded-xl border border-line p-4">
                <div className="mono text-muted">Currently</div>
                <div className="mt-2 flex items-center gap-2.5">
                  <span className="relative flex size-2">
                    <span className="size-2 rounded-full bg-accent" />
                    <span className="pulse-dot absolute inset-0 text-accent" />
                  </span>
                  <span className="text-[14px]">Booking from September 2026</span>
                </div>
                <div className="mono mt-3 border-t border-line pt-3 text-[9px] text-muted">
                  Replies within 24 hours, Mon–Thu
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <div className="mt-16 border-y border-line py-5 md:mt-24">
        <Ticker
          speed="slow"
          reverse
          items={["Available for select projects", "Design engineering", "Motion systems", "Dhaka → worldwide"]}
          className="mono text-muted"
        />
      </div>

      <AnimatePresence>
        {toast ? (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 left-1/2 z-[95] flex -translate-x-1/2 items-center gap-2 rounded-full border border-line bg-ink px-4 py-2.5 text-bg shadow-2xl"
            role="status"
          >
            <Check className="size-3.5 text-accent" />
            <span className="text-[12.5px]">{toast}</span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden pt-16 md:pt-20">
      <div className="container-x">
        <div className="grid gap-8 pb-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollToId("home");
              }}
              className="inline-flex items-center gap-3"
            >
              <span className="grid size-9 place-items-center rounded-full border border-line">
                <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
                  <path d="M4 20 12 4l8 16" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M8.2 14h7.6" stroke="var(--accent)" strokeWidth="1.6" />
                </svg>
              </span>
              <span className="text-[16px] tracking-[-0.02em]">{profile.name}</span>
            </a>
            <p className="mono mt-4 max-w-[30ch] text-muted">
              Independent design engineer. Building quiet, considered things for the web since 2018.
            </p>
          </div>

          <div className="md:col-span-3">
            <div className="mono mb-3 text-muted">Navigate</div>
            <ul className="space-y-1.5">
              {[{ id: "home", label: "Home" }, ...navSections].map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToId(s.id);
                    }}
                    className="link-underline text-[13.5px] text-muted transition-colors hover:text-ink"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 md:text-right">
            <div className="mono mb-3 text-muted">Get in touch</div>
            <a
              href={`mailto:${profile.email}`}
              className="link-underline inline-block text-[15px] text-ink"
            >
              {profile.email}
            </a>
            <div className="mono mt-3 text-[9px] text-muted">{profile.location}</div>
            <button
              type="button"
              onClick={() => scrollToId("home")}
              className="mono group mt-6 inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-2 text-muted transition-colors hover:border-ink/30 hover:text-ink"
            >
              Back to top
              <ArrowUp className="size-3 transition-transform duration-500 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>

        <div className="mono flex flex-col gap-2 border-t border-line py-5 text-[9px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} {profile.name}. All rights reserved.</span>
          <span className="flex items-center gap-4">
            <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>Built with React &amp; Motion</span>
            <span className="text-muted/50">·</span>
            <span>Dhaka, BD</span>
            <span className="text-muted/50">·</span>
            <span>v1.4</span>
          </span>
          </span>
        </div>
      </div>

      <div aria-hidden className="pointer-events-none select-none overflow-hidden px-2">
        <div className="whitespace-nowrap text-center text-[13.4vw] font-medium leading-[0.8] tracking-[-0.07em] text-ink/[0.06]">
          AYAAN RAHMAN
        </div>
      </div>
    </footer>
  );
}
