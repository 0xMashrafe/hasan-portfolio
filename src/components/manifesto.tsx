import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Reveal } from "./motion";

const copy =
  "Good interfaces don't announce themselves. They disappear — leaving only the work, and a quiet sense that somebody cared about the details.";

function Word({
  children,
  progress,
  range,
  accent,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  accent?: boolean;
}) {
  const opacity = useTransform(progress, range, [0.3, 1]);
  const y = useTransform(progress, range, [8, 0]);

  return (
    <motion.span
      style={{ opacity, y }}
      className={accent ? "serif-italic text-accent-text" : undefined}
    >
      {children}{" "}
    </motion.span>
  );
}

export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });

  const words = copy.split(" ");
  const total = words.length;

  return (
    <section className="relative py-16 md:py-24">
      <div className="container-x">
        <div ref={ref} className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-3">
            <Reveal>
              <div className="mono sticky top-24 flex items-center gap-3 text-muted">
                <span className="size-1.5 rounded-full bg-accent" />
                Point of view
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-9">
            <p className="max-w-[24ch] text-[clamp(1.8rem,4.1vw,3.3rem)] font-medium leading-[1.18] tracking-[-0.035em] sm:max-w-[26ch]">
              {words.map((word, i) => {
                const start = i / total;
                const end = Math.min(1, start + 0.18);
                return (
                  <Word
                    key={`${word}-${i}`}
                    progress={scrollYProgress}
                    range={[start, end]}
                    accent={word.startsWith("disappear")}
                  >
                    {word}
                  </Word>
                );
              })}
            </p>

            <Reveal delay={0.1} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
              {["Considered", "Fast", "Accessible", "A little theatrical"].map((value) => (
                <span key={value} className="mono flex items-center gap-2 text-muted">
                  <span className="text-accent-text">/</span>
                  {value}
                </span>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
