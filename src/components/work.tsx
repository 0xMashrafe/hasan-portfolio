import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationFrame, useMotionValue, useReducedMotion, type MotionValue } from "motion/react";
import { ArrowUpRight, Plus, X } from "lucide-react";
import { profile, projects, type Project } from "../data";
import { cn, useMediaQuery } from "../lib/utils";
import { EASE, Reveal, SectionHead } from "./motion";

function Preview({ project, x, y }: { project: Project; x: MotionValue<number>; y: MotionValue<number> }) {
  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-40 hidden w-[300px] md:block"
      style={{ x, y, marginLeft: 40, marginTop: -190 }}
      initial={{ opacity: 0, scale: 0.92, rotate: -3 }}
      animate={{ opacity: 1, scale: 1, rotate: -1.5 }}
      exit={{ opacity: 0, scale: 0.94, rotate: 2 }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      <div className="overflow-hidden rounded-xl border border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
        <div
          className="relative aspect-[4/5] overflow-hidden"
          style={{
            background: `radial-gradient(120% 100% at 20% 10%, ${project.accent}33 0%, transparent 55%), radial-gradient(100% 80% at 90% 90%, ${project.accent}22 0%, transparent 60%), #0b0b0d`,
          }}
        >
          <div className="absolute inset-0 stack-line opacity-30" />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between border-b border-white/10 px-3 py-2 text-[9px] uppercase tracking-[0.2em] text-white/50">
            <span>{project.category}</span>
            <span>{project.year}</span>
          </div>
          <div className="absolute inset-0 grid place-items-center">
            <div
              className="size-[58%] rounded-full blur-[2px] transition-transform duration-700 group-hover:scale-110"
              style={{
                background: `conic-gradient(from 180deg, ${project.accent}, transparent 55%, ${project.accent}55)`,
                opacity: 0.85,
                filter: "blur(0.5px)",
              }}
            />
            <span
              className="absolute font-display text-[84px] font-medium leading-none tracking-[-0.06em] text-black/70 mix-blend-overlay"
            >
              {project.index}
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-3">
            <div className="text-[22px] leading-none tracking-[-0.03em] text-white">{project.title}</div>
            <div className="mt-2 h-px w-full bg-white/15" />
            <div className="mt-2 flex items-center justify-between text-[9px] uppercase tracking-[0.2em] text-white/50">
              <span>{project.role}</span>
              <ArrowUpRight className="size-3" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    document.documentElement.dataset.overlay = "1";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      delete document.documentElement.dataset.overlay;
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project ? (
        <motion.div
          className="fixed inset-0 z-[85] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} case study`}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} aria-hidden />
          <motion.div
            className="relative max-h-[92svh] w-full max-w-[860px] overflow-y-auto rounded-t-2xl border border-line bg-bg sm:rounded-2xl"
            initial={{ y: 40, opacity: 0, scale: 0.985 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <div className="relative h-[190px] overflow-hidden border-b border-line sm:h-[240px]">
              <div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(90% 120% at 15% 0%, ${project.accent}44 0%, transparent 60%), radial-gradient(80% 100% at 100% 100%, ${project.accent}22 0%, transparent 60%), var(--bg-soft)`,
                }}
              />
              <div className="absolute inset-0 stack-line opacity-40" />
              <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6">
                <div className="mono flex items-center justify-between text-muted">
                  <span>
                    case study — {project.index} / {project.year}
                  </span>
                  <button
                    type="button"
                    onClick={onClose}
                    className="grid size-8 place-items-center rounded-full border border-line bg-bg/60 text-ink backdrop-blur transition-colors hover:bg-ink hover:text-bg"
                    aria-label="Close case study"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
                <div className="flex items-end justify-between gap-4">
                  <h3 className="display-tight text-[clamp(2.4rem,6vw,4rem)]">{project.title}</h3>
                  <span className="mono mb-1 rounded-full border border-line px-3 py-1 text-muted">
                    {project.category}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-8 p-5 sm:p-7 md:grid-cols-5">
              <div className="md:col-span-3">
                <p className="text-[16px] leading-relaxed text-ink/90">{project.description}</p>

                <div className="mt-6 flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="mono rounded-full border border-line px-2.5 py-1 text-[9px] text-muted"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <a
                    href={`mailto:${profile.email}?subject=${encodeURIComponent(
                      `Case study request — ${project.title}`,
                    )}`}
                    className="group inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-[13px] font-medium text-bg transition-colors hover:bg-accent hover:text-accent-ink"
                  >
                    Request the full case study
                    <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                  <span className="mono text-muted">{project.role}</span>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="mono mb-3 text-muted">Outcomes</div>
                <div className="grid grid-cols-3 gap-3 md:grid-cols-1">
                  {project.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-lg border border-line bg-bg-soft/60 p-3"
                    >
                      <div className="text-[clamp(1.15rem,2.4vw,1.6rem)] leading-none tracking-[-0.04em]">
                        {metric.value}
                      </div>
                      <div className="mono mt-2 text-[8.5px] text-muted">{metric.label}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 hidden rounded-lg border border-line p-3 md:block">
                  <div className="mono text-[8.5px] text-muted">Year</div>
                  <div className="mt-1 text-[15px]">{project.year}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function Work() {
  const [active, setActive] = useState<Project | null>(null);
  const [hovered, setHovered] = useState<Project | null>(null);
  const [filter, setFilter] = useState("All");
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const target = useRef({ x: 0, y: 0 });
  const chasing = useRef(false);

  useAnimationFrame(() => {
    if (!chasing.current) return;
    mx.set(mx.get() + (target.current.x - mx.get()) * 0.18);
    my.set(my.get() + (target.current.y - my.get()) * 0.18);
  });

  const clampPoint = (x: number, y: number) => ({
    x: Math.min(x + 40, window.innerWidth - 340),
    y: Math.min(Math.max(y, 230), window.innerHeight - 230),
  });

  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];
  const visible = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="work" className="relative py-20 md:py-24">
      <div className="container-x">
        <SectionHead
          index="03"
          label="Selected work"
          title={
            <>
              Recent <span className="serif-italic">builds</span>
            </>
          }
          description="Five projects that show the range — a design system, two products, a brand site and a data canvas. All designed and shipped end-to-end."
        />

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <div className="mono flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={cn(
                  "relative rounded-full border px-3 py-1.5 text-[9px] transition-colors duration-300",
                  filter === cat
                    ? "border-transparent text-bg"
                    : "border-line text-muted hover:border-ink/30 hover:text-ink",
                )}
              >
                {filter === cat ? (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-full bg-ink"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                ) : null}
                <span className="relative">{cat}</span>
              </button>
            ))}
          </div>
          <span className="mono text-muted">
            [{String(visible.length).padStart(2, "0")} projects]
          </span>
        </div>

        <div ref={containerRef} className="relative mt-6" onPointerLeave={() => { setHovered(null); chasing.current = false; }}>
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: EASE, delay: reduce ? 0 : i * 0.035 }}
              >
                <button
                  type="button"
                  onClick={() => setActive(project)}
                  onPointerEnter={(e) => {
                    if (e.pointerType !== "mouse") return;
                    setHovered(project);
                    const next = clampPoint(e.clientX, e.clientY);
                    if (!chasing.current) {
                      mx.set(next.x);
                      my.set(next.y);
                      chasing.current = true;
                    }
                    target.current = next;
                  }}
                  onPointerMove={(e) => {
                    if (e.pointerType !== "mouse") return;
                    target.current = clampPoint(e.clientX, e.clientY);
                  }}
                  className="group relative block w-full border-t border-line text-left last:border-b"
                  data-cursor="OPEN CASE"
                  aria-label={`Open ${project.title} case study`}
                >
                  <span
                    className="pointer-events-none absolute inset-0 origin-bottom scale-y-0 bg-ink/[0.03] transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-y-100"
                    aria-hidden
                  />
                  <div className="relative grid grid-cols-[28px_1fr_auto] items-center gap-4 py-5 md:grid-cols-[48px_1fr_auto] md:gap-8 md:py-7">
                    <span className="mono self-start pt-2 text-[9px] text-muted/60 md:pt-3">
                      {project.index}
                    </span>

                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="display-tight truncate text-[clamp(1.9rem,5.2vw,3.5rem)] transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-1 md:group-hover:translate-x-3">
                          {project.title}
                        </h3>
                        <span
                          className="mt-1 hidden size-2 shrink-0 rounded-full transition-transform duration-500 group-hover:scale-150 sm:block"
                          style={{ background: project.accent }}
                        />
                      </div>
                      <p className="mt-1.5 max-w-[52ch] text-[13px] leading-relaxed text-muted md:mt-2 md:text-[14px]">
                        {project.blurb}
                      </p>
                      <div className="mono mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[8.5px] text-muted/70">
                        <span>{project.category}</span>
                        <span className="hidden sm:inline">/</span>
                        <span className="hidden sm:inline">{project.role}</span>
                        <span className="sm:hidden">/</span>
                        <span>{project.year}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-6">
                      <span className="mono hidden text-[9px] text-muted/60 lg:block">
                        {project.year}
                      </span>
                      <span className="grid size-9 place-items-center rounded-full border border-line transition-all duration-500 group-hover:rotate-45 group-hover:border-transparent group-hover:bg-accent group-hover:text-accent-ink md:size-11">
                        <ArrowUpRight className="size-4" />
                      </span>
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {isDesktop && hovered && !reduce ? (
              <Preview key={hovered.id} project={hovered} x={mx} y={my} />
            ) : null}
          </AnimatePresence>
        </div>

        <Reveal className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <p className="mono max-w-[46ch] text-muted">
            More work available on request — including internal products under NDA.
          </p>
          <a
            href="#contact"
            className="group mono inline-flex items-center gap-2 text-ink"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <Plus className="size-3 transition-transform duration-500 group-hover:rotate-90" />
            Request full portfolio
          </a>
        </Reveal>
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}
