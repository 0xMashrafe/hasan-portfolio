import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { experience } from "../data";
import { Reveal, SectionHead } from "./motion";

export function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 65%"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const opacity = useTransform(scrollYProgress, [0, 0.06], [0, 1]);

  return (
    <section id="path" className="relative py-20 md:py-24">
      <div className="container-x">
        <SectionHead
          index="05"
          label="The path"
          title={
            <>
              Where I&apos;ve <span className="serif-italic">been</span>
            </>
          }
          description="A short history of studios, products and the years spent learning in public. References available on request."
        />

        <div ref={ref} className="relative mt-14 md:mt-20 md:pl-[190px]">
          {/* rail */}
          <div className="absolute left-0 top-0 hidden h-full w-px bg-line md:block">
            <motion.div
              className="h-full w-px origin-top bg-accent"
              style={{ scaleY, opacity }}
            />
          </div>

          <div>
            {experience.map((job, i) => (
              <Reveal key={job.company} delay={i * 0.04} amount={0.2}>
                <div className="group relative border-t border-line py-7 last:border-b md:py-9">
                  {/* timeline dot */}
                  <span className="absolute -left-[190px] top-[38px] hidden size-[7px] -translate-x-1/2 rounded-full border border-line bg-bg transition-colors duration-500 group-hover:border-accent group-hover:bg-accent md:block" />

                  <div className="grid gap-4 md:grid-cols-12 md:gap-8">
                    <div className="md:col-span-3">
                      <div className="mono text-[9px] text-muted">{job.period}</div>
                      <div className="mono mt-2 text-[9px] text-muted/50">{job.location}</div>
                    </div>

                    <div className="md:col-span-9">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-[clamp(1.25rem,2.6vw,1.75rem)] leading-tight tracking-[-0.035em]">
                            {job.role}
                          </h3>
                          <p className="mono mt-2 text-accent-text">{job.company}</p>
                        </div>
                        <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-full border border-line text-muted opacity-0 transition-all duration-500 group-hover:opacity-100 md:opacity-100 md:group-hover:border-accent md:group-hover:text-accent-text">
                          <ArrowUpRight className="size-3.5" />
                        </span>
                      </div>

                      <p className="mt-4 max-w-[62ch] text-[14px] leading-relaxed text-muted transition-colors duration-500 group-hover:text-ink/80">
                        {job.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {job.tags.map((tag) => (
                          <span
                            key={tag}
                            className="mono rounded-full border border-line px-2.5 py-1 text-[8.5px] text-muted/80"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="mt-12 flex flex-wrap items-center justify-between gap-5 rounded-xl border border-line bg-bg-soft/40 p-5 md:mt-16 md:p-6">
          <div>
            <p className="text-[16px] tracking-[-0.02em]">Looking for the full story?</p>
            <p className="mono mt-1.5 text-muted">CV, case studies and references — one email away.</p>
          </div>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="group mono inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-ink transition-colors hover:border-ink/40 hover:bg-ink hover:text-bg"
          >
            Request CV
            <ArrowUpRight className="size-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
