import { useCallback, useEffect, useState } from "react";
import Lenis from "lenis";
import { usePrefersReducedMotion } from "./lib/useReducedMotion";
import { About } from "./components/about";
import { FlowField, PointerGlow } from "./components/background";
import { Capabilities } from "./components/capabilities";
import { CommandPalette } from "./components/command-palette";
import { Contact, Footer } from "./components/contact";
import { Cursor } from "./components/cursor";
import { Experience } from "./components/experience";
import { Header, ScrollProgress } from "./components/header";
import { Manifesto } from "./components/manifesto";
import { Hero } from "./components/hero";
import { Preloader } from "./components/preloader";
import { Rail } from "./components/rail";
import { useToast } from "./components/motion";
import { Work } from "./components/work";
import { profile } from "./data";

type Theme = "dark" | "light";

export default function App() {
  const reduce = usePrefersReducedMotion();
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    const stored = window.localStorage.getItem("ayaan-theme");
    return stored === "light" || stored === "dark" ? stored : "dark";
  });
  const [ready, setReady] = useState(() =>
    typeof window === "undefined" ? false : window.sessionStorage.getItem("ayaan-visited") === "1",
  );
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { message, show } = useToast();

  /* theme ------------------------------------------------------------- */
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("ayaan-theme", theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#08080a" : "#f2efe7");
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  /* smooth scroll ----------------------------------------------------- */
  useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.6,
    });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, [reduce]);

  /* command palette shortcut ------------------------------------------ */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
      if (e.key === "/" && !paletteOpen) {
        const el = document.activeElement;
        const typing =
          el instanceof HTMLInputElement ||
          el instanceof HTMLTextAreaElement ||
          (el as HTMLElement | null)?.isContentEditable;
        if (!typing) {
          e.preventDefault();
          setPaletteOpen(true);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paletteOpen]);

  /* copy email -------------------------------------------------------- */
  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      show("Email copied to clipboard");
    } catch {
      show(`Write to ${profile.email}`);
    }
  }, [show]);

  return (
    <>
      <div className="grain" aria-hidden />
      <FlowField />
      <PointerGlow />
      <Cursor />
      <ScrollProgress />
      <Rail />

      <Preloader onDone={() => setReady(true)} />

      <div className="relative z-10">
        <Header theme={theme} toggleTheme={toggleTheme} onOpenPalette={() => setPaletteOpen(true)} />
        <main>
          {ready ? <Hero ready={ready} /> : <div className="min-h-[100svh]" />}
          <About />
          <Manifesto />
          <Work />
          <Capabilities />
          <Experience />
          <Contact copyEmail={copyEmail} toast={message} />
        </main>
        <Footer />
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        theme={theme}
        toggleTheme={toggleTheme}
        onCopyEmail={copyEmail}
      />
    </>
  );
}
