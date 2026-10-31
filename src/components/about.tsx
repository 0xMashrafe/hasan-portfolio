import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, MapPin } from "lucide-react";
import { profile } from "../data";
import { Reveal, SectionHead, Ticker } from "./motion";
import { useLocalTime } from "../lib/utils";

const now = [
  { label: "Reading", value: "The Creative Act — Rick Rubin" },
  { label: "Listening", value: "Blonde — Frank Ocean" },
  { label: "Building", value: "A motion spec for the open web" },
  { label: "Learning", value: "WebGPU, shaders & type design" },
];

export function About() {
  const reduce = useReducedMotion();
  const time = useLocalTime(profile.timeZone);

  return (
    <section id="about" className="relative py-20 md:py-24">
      <div className="container-x">
        <SectionHead
          index="02"
          label="About"
          title={
            <>
              A designer&apos;s eye,
              <br />
              an <span className="serif-italic">engineer&apos;s</span> hands.
            </>
          }
          description="Seven years of shipping products at the intersection of craft and performance — for startups, studios and the occasional stubborn idea of my own."
        />

        <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-12 md:gap-10">
          {/* portrait card */}
          <Reveal className="md:col-span-5" y={40}>
            <div className="group relative overflow-hidden rounded-2xl border border-line bg-bg-soft">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src="/art/portrait.jpg"
                  alt="Abstract chrome and lime sculpture representing Ayaan's design practice"
                  className="size-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.05]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <div className="mono flex items-center justify-between text-white/60">
                    <span>fig. 01 — studio practice</span>
                    <span>{time} dhaka</span>
                  </div>
                  <div className="mt-3 flex items-end justify-between gap-4">
                    <div>
                      <div className="text-[22px] leading-none tracking-[-0.03em]">{profile.name}</div>
                      <div className="mono mt-2 flex items-center gap-1.5 text-white/70">
                        <MapPin className="size-3" />
                        {profile.location}
                      </div>
                    </div>
                    <span className="mono rounded-full border border-white/25 px-2.5 py-1 text-[9px] text-white/80">
                      est. 2018
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="mono text-muted">Open to collaborations</p>
              <a
                href={`mailto:${profile.email}`}
                className="mono group inline-flex items-center gap-1.5 text-ink"
              >
                <span className="link-underline">{profile.email}</span>
                <ArrowUpRight className="size-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </Reveal>

          {/* copy */}
          <div className="md:col-span-7 md:pl-4 lg:pl-10">
            <Reveal delay={0.05}>
              <p className="text-[clamp(1.25rem,2.2vw,1.7rem)] leading-[1.4] tracking-[-0.02em]">
                {profile.intro}
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-6 max-w-[54ch] text-[15px] leading-relaxed text-muted">
                I started out making posters for local bands, then taught myself to build the
                things I was drawing. That order still shapes how I work: decide how it should
                feel, then engineer until reality matches. Most of my work now is a mix of design
                systems, product interfaces and small pieces of theatre — the kind of detail you
                notice second, then can&apos;t unsee.
              </p>
            </Reveal>

            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-line pt-8 sm:grid-cols-4">
              {profile.stats.map((stat, i) => (
                <Reveal key={stat.label} delay={0.06 * i} y={18}>
                  <div className="text-[clamp(1.7rem,3.2vw,2.4rem)] leading-none tracking-[-0.05em]">
                    {stat.value}
                  </div>
                  <div className="mono mt-2 text-[9px] text-muted">{stat.label}</div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.1} className="mt-10">
              <div className="mono mb-3 flex items-center gap-2 text-muted">
                <span className="size-1.5 animate-pulse rounded-full bg-accent" />
                Currently
              </div>
              <ul className="grid gap-0 sm:grid-cols-2">
                {now.map((item) => (
                  <li
                    key={item.label}
                    className="group flex items-baseline gap-3 border-t border-line py-3 last:border-b sm:border-b"
                  >
                    <span className="mono w-[62px] shrink-0 text-[9px] text-muted/70">
                      {item.label}
                    </span>
                    <span className="text-[13.5px] text-ink/90 transition-colors group-hover:text-accent-text">
                      {item.value}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>

      {/* signature marquee */}
      <div className="mt-16 border-y border-line py-5 text-ink md:mt-24">
        <Ticker
          items={[
            "Design engineering",
            "Motion systems",
            "Product interfaces",
            "Creative development",
            "Design systems",
            "Art direction",
          ]}
          className="mono [&_.animate-marquee]:items-baseline"
          speed="slow"
        />
      </div>

      {!reduce ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-32 hidden size-[380px] rounded-full bg-accent/5 blur-[100px] lg:block"
          animate={{ opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : null}
    </section>
  );
}
