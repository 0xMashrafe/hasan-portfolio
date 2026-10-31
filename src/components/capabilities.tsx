import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { capabilities, process } from "../data";
import { Reveal, SectionHead } from "./motion";

export function Capabilities() {
  const reduce = useReducedMotion();

  return (
    <section id="craft" className="relative py-20 md:py-24">
      <div className="container-x">
        <SectionHead
          index="04"
          label="Craft"
          title={
            <>
              The <span className="serif-italic">toolkit</span>
            </>
          }
          description="One person, full stack of the craft: strategy through to the last easing curve. These are the tools I actually use, not a résumé keyword dump."
        />

        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-line bg-line md:mt-16 md:grid-cols-3">
          {capabilities.map((group, i) => (
            <Reveal key={group.title} delay={i * 0.08} className="group relative">
              <div className="relative h-full bg-bg p-6 transition-colors duration-500 hover:bg-bg-soft md:p-7">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="mono text-[9px] text-accent-text">{group.index}</span>
                    <h3 className="mt-3 text-[clamp(1.5rem,2.6vw,1.9rem)] leading-none tracking-[-0.04em]">
                      {group.title}
                    </h3>
                    <p className="mono mt-2 text-[9px] normal-case tracking-normal text-muted">
                      {group.subtitle}
                    </p>
                  </div>
                  <ArrowUpRight className="size-4 text-muted/40 transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent-text" />
                </div>

                <ul className="mt-8 space-y-0">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="group/row flex items-center justify-between border-t border-line/70 py-2.5 last:border-b"
                    >
                      <span className="text-[14px] text-ink/85 transition-colors duration-300 group-hover/row:text-accent-text">
                        {item}
                      </span>
                      <span className="mono text-[8px] text-muted/0 transition-colors duration-300 group-hover/row:text-muted/60">
                        ●
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-x-100" />
              </div>
            </Reveal>
          ))}
        </div>

        {/* process */}
        <div className="mt-20 md:mt-28">
          <div className="flex flex-col gap-3 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
            <Reveal>
              <h3 className="text-[clamp(1.5rem,3vw,2.1rem)] tracking-[-0.04em]">
                How we&apos;d <span className="serif-italic">work together</span>
              </h3>
            </Reveal>
            <Reveal delay={0.06}>
              <span className="mono text-muted">Three movements, no agency theatre</span>
            </Reveal>
          </div>

          <div className="grid gap-8 pt-8 md:grid-cols-3 md:gap-10">
            {process.map((step, i) => (
              <Reveal key={step.index} delay={i * 0.1} className="group relative">
                <div className="flex items-baseline gap-3">
                  <span className="mono text-accent-text">{step.index}</span>
                  <span className="h-px flex-1 bg-line" />
                </div>
                <h4 className="mt-4 text-[22px] tracking-[-0.03em] transition-transform duration-500 group-hover:translate-x-1">
                  {step.title}
                </h4>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">{step.body}</p>
                {!reduce ? (
                  <motion.span
                    className="mt-5 block size-1.5 rounded-full bg-line transition-colors duration-500 group-hover:bg-accent"
                    whileHover={{ scale: 1.4 }}
                  />
                ) : null}
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
