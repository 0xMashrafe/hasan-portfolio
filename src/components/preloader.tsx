import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EASE } from "./motion";

const bootLines = [
  "initialising interface",
  "loading type system",
  "mounting motion layer",
];

export function Preloader({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const alreadySeen =
    typeof window !== "undefined" && window.sessionStorage.getItem("ayaan-visited") === "1";
  const [open, setOpen] = useState(!alreadySeen);
  const [progress, setProgress] = useState(alreadySeen ? 100 : 0);

  useEffect(() => {
    if (!open) {
      onDone();
      return;
    }
    document.documentElement.style.overflow = "hidden";

    const skip = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", skip);

    const total = reduce ? 300 : 1500;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / total);
      const eased = 1 - Math.pow(1 - p, 2.2);
      setProgress(Math.round(eased * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        window.sessionStorage.setItem("ayaan-visited", "1");
        window.setTimeout(() => setOpen(false), 220);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("keydown", skip);
      cancelAnimationFrame(raf);
    };
  }, [open, reduce, onDone]);

  return (
    <AnimatePresence onExitComplete={() => {
      document.documentElement.style.overflow = "";
      onDone();
    }}>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden bg-bg px-5 py-6 md:px-10 md:py-8"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          <div className="flex items-start justify-between">
            <div className="mono text-muted">
              <div className="text-ink">ayaan.exe</div>
              <div className="mt-1">portfolio / 2026</div>
            </div>
            <div className="mono hidden text-right text-muted sm:block">
              <div>dhaka, bd</div>
              <div className="mt-1">23.8103° n, 90.4125° e</div>
            </div>
          </div>

          <div className="flex flex-col items-start">
            <div className="mono mb-5 flex items-center gap-3 text-muted">
              <span className="relative inline-flex size-1.5">
                <span className="size-1.5 rounded-full bg-accent" />
              </span>
              {bootLines[Math.min(bootLines.length - 1, Math.floor((progress / 100) * bootLines.length))]}
              <span className="caret" />
            </div>
            <div className="display-tight flex items-baseline gap-4 text-ink">
              <span className="text-[clamp(4rem,18vw,15rem)] tabular-nums leading-none">
                {String(progress).padStart(3, "0")}
              </span>
              <span className="mono mb-3 text-muted">%</span>
            </div>
            <div className="mt-6 h-px w-full max-w-[560px] bg-line">
              <motion.div
                className="h-px bg-accent"
                style={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>
          </div>

          <div className="mono flex items-end justify-between text-muted">
            <span>design engineering — interaction — motion</span>
            <span className="hidden sm:block">press esc to skip</span>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
