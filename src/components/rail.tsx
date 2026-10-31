import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { navSections } from "../data";
import { cn, scrollToId } from "../lib/utils";

const all = [{ id: "home", label: "Intro", index: "01" }, ...navSections];

export function Rail() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      const marker = window.innerHeight * 0.4;
      let current = all[0].id;
      for (const s of all) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= marker) current = s.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
      <div className="pointer-events-auto flex flex-col items-end gap-4">
        {all.map((section) => {
          const isActive = active === section.id;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => scrollToId(section.id)}
              className="group flex items-center gap-2.5"
              aria-label={`Go to ${section.label}`}
              aria-current={isActive ? "true" : undefined}
            >
              <span
                className={cn(
                  "mono whitespace-nowrap text-[8.5px] transition-all duration-500",
                  isActive
                    ? "text-ink opacity-100"
                    : "translate-x-1 text-muted opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                )}
              >
                {section.label}
              </span>
              <span
                className={cn(
                  "relative block h-px transition-all duration-500",
                  isActive ? "w-6 bg-accent" : "w-3 bg-ink/25 group-hover:w-5 group-hover:bg-ink/60",
                )}
              >
                {isActive ? (
                  <motion.span
                    layoutId="rail-active"
                    className="absolute -right-1 -top-[2px] size-[5px] rounded-full bg-accent"
                  />
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
