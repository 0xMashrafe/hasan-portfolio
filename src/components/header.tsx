import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { ArrowUpRight, Command, Menu, Moon, Sun, X } from "lucide-react";
import { navSections, profile } from "../data";
import { cn, scrollToId } from "../lib/utils";
import { EASE, Magnetic } from "./motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.3 });
  return (
    <motion.div
      className="fixed left-0 top-0 z-[55] h-[2px] w-full origin-left bg-accent"
      style={{ scaleX }}
      aria-hidden
    />
  );
}

function useActiveSection() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const ids = ["home", ...navSections.map((s) => s.id)];
    const onScroll = () => {
      const marker = window.innerHeight * 0.35;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= marker) current = id;
      }
      if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 120) {
        current = ids[ids.length - 1];
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return active;
}

export function Header({
  theme,
  toggleTheme,
  onOpenPalette,
}: {
  theme: "dark" | "light";
  toggleTheme: () => void;
  onOpenPalette: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    if (menuOpen) document.documentElement.dataset.overlay = "1";
    else delete document.documentElement.dataset.overlay;
    return () => {
      document.documentElement.style.overflow = "";
      delete document.documentElement.dataset.overlay;
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled
            ? "border-b border-line bg-bg/70 backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent",
        )}
      >
        <div className="container-x grid h-[70px] grid-cols-[1fr_auto] items-center gap-4 md:grid-cols-[auto_1fr_auto]">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToId("home");
            }}
            className="group flex items-center gap-3"
            aria-label="Ayaan Rahman — home"
            data-cursor="HOME"
          >
            <span className="relative grid size-9 place-items-center rounded-full border border-line">
              <span className="absolute inset-0 rounded-full bg-accent opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-30" />
              <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
                <path d="M4 20 12 4l8 16" stroke="currentColor" strokeWidth="1.6" />
                <path d="M8.2 14h7.6" stroke="var(--accent)" strokeWidth="1.6" />
              </svg>
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-[17px] font-medium tracking-[-0.03em]">{profile.name}</span>
              <span className="mono mt-1 text-[9px] text-muted">{profile.handle}</span>
            </span>
          </a>

          <nav className="hidden items-center justify-center gap-1 md:flex" aria-label="Main">
            <div className="flex items-center gap-1 rounded-full border border-line/70 px-1.5 py-1">
              {navSections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToId(section.id);
                  }}
                  className={cn(
                    "relative rounded-full px-3 py-1.5 text-[12.5px] transition-colors duration-300 lg:px-3.5 lg:text-[13px]",
                    active === section.id ? "text-bg" : "text-muted hover:text-ink",
                  )}
                >
                  {active === section.id ? (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-ink"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  ) : null}
                  <span className="relative">{section.label}</span>
                </a>
              ))}
            </div>
          </nav>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onOpenPalette}
              className="mono hidden items-center gap-2 rounded-full border border-line px-3 py-2 text-muted transition-colors hover:border-ink/30 hover:text-ink lg:flex"
              aria-label="Open command palette"
            >
              <Command className="size-3" />
              <span>K</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="group grid size-9 place-items-center overflow-hidden rounded-full border border-line transition-colors hover:border-ink/30"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              data-cursor={theme === "dark" ? "LIGHT" : "DARK"}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ y: 14, opacity: 0, rotate: -30 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: -14, opacity: 0, rotate: 30 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="grid place-items-center"
                >
                  {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
                </motion.span>
              </AnimatePresence>
            </button>

            <Magnetic strength={0.18} className="hidden sm:inline-flex">
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("contact");
                }}
                className="group flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-[13px] font-medium text-bg transition-colors hover:bg-accent hover:text-accent-ink"
              >
                Let&apos;s talk
                <ArrowUpRight className="size-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Magnetic>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="grid size-9 place-items-center rounded-full border border-line md:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-4" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            className="fixed inset-0 z-[80] flex flex-col bg-bg md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div className="container-x flex h-[70px] items-center justify-between">
              <span className="mono text-muted">menu / 2026</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="grid size-9 place-items-center rounded-full border border-line"
                aria-label="Close menu"
              >
                <X className="size-4" />
              </button>
            </div>
            <nav className="container-x flex flex-1 flex-col justify-center gap-1">
              {[{ id: "home", label: "Home", index: "01" }, ...navSections].map((s, i) => (
                <motion.a
                  key={s.id}
                  href={`#${s.id}`}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.7, ease: EASE }}
                  onClick={(e) => {
                    e.preventDefault();
                    setMenuOpen(false);
                    window.setTimeout(() => scrollToId(s.id), 480);
                  }}
                  className="group flex items-baseline justify-between border-b border-line py-4"
                >
                  <span className="display-tight text-[clamp(2.2rem,9vw,3.2rem)] transition-transform duration-500 group-hover:translate-x-2">
                    {s.label}
                  </span>
                  <span className="mono text-muted">{s.index}</span>
                </motion.a>
              ))}
            </nav>
            <div className="container-x pb-10">
              <p className="mono mb-4 text-muted">{profile.email}</p>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  toggleTheme();
                }}
                className="mono flex items-center gap-2 text-muted"
              >
                {theme === "dark" ? <Sun className="size-3" /> : <Moon className="size-3" />}
                Switch to {theme === "dark" ? "light" : "dark"} mode
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
