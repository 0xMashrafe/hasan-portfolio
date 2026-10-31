import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { navSections, profile } from "../data";
import { useLocalTime, scrollToId } from "../lib/utils";
import { EASE, Magnetic } from "./motion";

function RotatingBadge() {
  return (
    <div className="relative hidden size-[132px] shrink-0 xl:block">
      <svg viewBox="0 0 132 132" className="size-full animate-spin-slow">
        <defs>
          <path
            id="badge-circle"
            d="M66,66 m-50,0 a50,50 0 1,1 100,0 a50,50 0 1,1 -100,0"
            fill="none"
          />
        </defs>
        <text className="fill-muted font-mono text-[9px] uppercase tracking-[0.34em]">
          <textPath href="#badge-circle">
            open for select projects · 2026 · dhaka ·
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="relative flex size-8 items-center justify-center rounded-full border border-line">
          <span className="size-1.5 rounded-full bg-accent" />
          <span className="pulse-dot absolute inset-0 grid place-items-center text-accent">
            <span className="size-1.5 rounded-full bg-accent" />
          </span>
        </span>
      </div>
    </div>
  );
}

export function Hero({ ready }: { ready: boolean }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const time = useLocalTime(profile.timeZone);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.97]);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 18 });
  const sy = useSpring(py, { stiffness: 60, damping: 18 });
  const nameX = useTransform(sx, (v) => v * 14);
  const nameY = useTransform(sy, (v) => v * 8);
  const badgeX = useTransform(sx, (v) => v * -26);
  const badgeY = useTransform(sy, (v) => v * -18);

  const show = ready && !reduce;

  return (
    <section
      ref={ref}
      id="home"
      className="relative flex min-h-[100svh] flex-col justify-between pb-6 pt-[88px] md:pt-[98px]"
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const rect = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - rect.left) / rect.width - 0.5);
        py.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
    >
      <motion.div className="container-x" style={reduce ? undefined : { y, opacity, scale }}>
        {/* top meta line */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
          <div className="mono flex items-center gap-3 text-muted">
            <span className="text-accent-text">(01)</span>
            <span className="hidden sm:inline">Independent design engineer</span>
            <span className="sm:hidden">Design engineer</span>
            <span className="h-3 w-px bg-line" />
            <span>{profile.location}</span>
          </div>
          <div className="mono flex items-center gap-2 text-muted">
            <span className="relative flex size-1.5">
              <span className="size-1.5 rounded-full bg-accent" />
              <span className="pulse-dot absolute inset-0 text-accent" />
            </span>
            <span className="text-ink/80">Available</span>
            <span className="hidden text-muted/60 sm:inline">—</span>
            <span className="hidden tabular-nums sm:inline">{time} GMT+6</span>
          </div>
        </div>

        {/* name */}
        <div className="relative flex items-end justify-between gap-6 pt-6">
          <motion.h1
            className="display-tight w-full text-[clamp(3.4rem,12.2vw,11rem)] uppercase"
            style={reduce ? undefined : { x: nameX, y: nameY }}
            aria-label={profile.name}
          >
            <span className="block overflow-hidden pb-[0.02em]">
              <motion.span
                className="block will-change-transform"
                initial={show ? { y: "112%" } : false}
                animate={show ? { y: "0%" } : undefined}
                transition={{ duration: 1.25, ease: EASE, delay: 0.05 }}
              >
                Ayaan
              </motion.span>
            </span>
            <span className="flex items-end justify-between gap-4 overflow-hidden pb-[0.02em]">
              <motion.span
                className="block will-change-transform"
                initial={show ? { y: "112%" } : false}
                animate={show ? { y: "0%" } : undefined}
                transition={{ duration: 1.25, ease: EASE, delay: 0.14 }}
              >
                Rahman
                <span className="text-accent-text">.</span>
              </motion.span>
            </span>
          </motion.h1>

          <motion.div
            style={reduce ? undefined : { x: badgeX, y: badgeY }}
            className="absolute -top-1 right-0 hidden xl:block"
          >
            <RotatingBadge />
          </motion.div>
        </div>

        {/* statement + index */}
        <div className="mt-6 grid gap-8 border-t border-line pt-5 md:mt-7 md:grid-cols-12 md:gap-8 md:pt-6">
          <div className="md:col-span-7 lg:col-span-6">
            <motion.p
              className="max-w-[32ch] text-[clamp(1.1rem,1.75vw,1.5rem)] leading-[1.4] tracking-[-0.02em]"
              initial={show ? { opacity: 0, y: 20 } : false}
              animate={show ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 1, ease: EASE, delay: 0.42 }}
            >
              I design and build digital products that{" "}
              <span className="serif-italic text-accent-text">feel alive</span> — where motion,
              typography and code meet in the same breath.
            </motion.p>

            <motion.div
              className="mt-6 flex flex-wrap items-center gap-3"
              initial={show ? { opacity: 0, y: 16 } : false}
              animate={show ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.9, ease: EASE, delay: 0.55 }}
            >
              <Magnetic strength={0.2}>
                <button
                  type="button"
                  onClick={() => scrollToId("work")}
                  className="group flex items-center gap-3 rounded-full bg-ink px-5 py-3 text-[13.5px] font-medium text-bg transition-colors duration-300 hover:bg-accent hover:text-accent-ink"
                  data-cursor="VIEW WORK"
                >
                  Selected work
                  <span className="grid size-5 place-items-center rounded-full bg-bg/10 transition-transform duration-500 group-hover:rotate-45">
                    <ArrowUpRight className="size-3" />
                  </span>
                </button>
              </Magnetic>

              <Magnetic strength={0.16}>
                <a
                  href={`mailto:${profile.email}`}
                  className="group flex items-center gap-2 rounded-full border border-line px-5 py-3 text-[13.5px] text-ink transition-colors duration-300 hover:border-ink/40"
                >
                  <span className="relative flex size-1.5">
                    <span className="size-1.5 rounded-full bg-accent" />
                  </span>
                  Start a project
                </a>
              </Magnetic>
            </motion.div>
          </div>

          <motion.div
            className="md:col-span-5 md:col-start-8 lg:col-span-5 lg:col-start-8"
            initial={show ? { opacity: 0, y: 20 } : false}
            animate={show ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 1, ease: EASE, delay: 0.68 }}
          >
            <div className="mono mb-2 flex items-center justify-between text-muted">
              <span>Index</span>
              <span className="text-muted/50">vol. 04 / 2026</span>
            </div>
            <ul>
              {navSections.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToId(item.id);
                    }}
                    className="group flex items-center justify-between border-t border-line py-2 last:border-b"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="mono text-[9px] text-muted/60">{item.index}</span>
                      <span className="relative overflow-hidden text-[15px] tracking-[-0.01em]">
                        <span className="block transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-full">
                          {item.label}
                        </span>
                        <span className="absolute inset-0 translate-y-full text-accent-text transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-y-0">
                          {item.label}
                        </span>
                      </span>
                    </span>
                    <ArrowUpRight className="size-3.5 text-muted/50 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-text" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.div>

      {/* bottom rail */}
      <div className="container-x mt-5">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <button
            type="button"
            onClick={() => scrollToId("about")}
            className="group flex items-center gap-3 text-muted transition-colors hover:text-ink"
            aria-label="Scroll to about"
          >
            <span className="relative grid size-9 place-items-center rounded-full border border-line">
              <motion.span
                animate={reduce ? undefined : { y: [-2, 2, -2] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowDown className="size-3.5" />
              </motion.span>
            </span>
            <span className="mono">Scroll to explore</span>
          </button>

          <div className="flex items-center gap-7 sm:gap-10">
            {profile.stats.slice(0, 3).map((stat) => (
              <div key={stat.label} className="text-right sm:text-left">
                <div className="text-[clamp(1.15rem,2vw,1.55rem)] leading-none tracking-[-0.04em]">
                  {stat.value}
                </div>
                <div className="mono mt-1.5 text-[9px] text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
