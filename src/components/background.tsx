import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

type Particle = {
  x: number;
  y: number;
  angle: number;
  speed: number;
  length: number;
  alpha: number;
  width: number;
  accent: boolean;
};

/**
 * A slow flow-field of drifting strokes. Reacts to the pointer, respects
 * reduced motion, pauses when the tab is hidden.
 */
export function FlowField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let running = true;
    let t = 0;
    const pointer = { x: -9999, y: -9999 };
    let ink = "243, 240, 233";
    let accent = "217, 255, 75";
    let lightMode = false;

    const readColors = () => {
      const styles = getComputedStyle(document.documentElement);
      ink = styles.getPropertyValue("--ink-rgb").trim() || ink;
      accent = styles.getPropertyValue("--accent-rgb").trim() || accent;
      lightMode = document.documentElement.dataset.theme === "light";
    };

    const particles: Particle[] = [];
    const count = () => {
      const w = window.innerWidth;
      if (w < 640) return 26;
      if (w < 1024) return 40;
      return 54;
    };

    const seed = () => {
      particles.length = 0;
      const n = count();
      for (let i = 0; i < n; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          angle: -0.55 + (Math.random() - 0.5) * 0.5,
          speed: 0.16 + Math.random() * 0.42,
          length: 90 + Math.random() * 150,
          alpha: 0.07 + Math.random() * 0.17,
          width: 0.55 + Math.random() * 0.85,
          accent: Math.random() > 0.94,
        });
      }
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      readColors();
      seed();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      t += 0.0018;

      for (const p of particles) {
        // a coherent, slow wind field — not random noise
        const target =
          -0.5 +
          Math.sin(p.x * 0.0011 + p.y * 0.0007 + t * 2.4) * 0.42 +
          Math.cos(p.y * 0.0013 - t * 1.6) * 0.22;
        p.angle += Math.sin(target - p.angle) * 0.03;

        // pointer repulsion
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < 42000) {
          const f = (1 - dist2 / 42000) * 0.9;
          p.angle += Math.atan2(dy, dx) * f * 0.06;
          p.x += (dx / (Math.sqrt(dist2) + 1)) * f * 0.9;
          p.y += (dy / (Math.sqrt(dist2) + 1)) * f * 0.9;
        }

        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;

        if (p.x < -80) p.x = width + 80;
        if (p.x > width + 80) p.x = -80;
        if (p.y < -80) p.y = height + 80;
        if (p.y > height + 80) p.y = -80;

        // draw a short curved stroke that follows the field
        const segments = 7;
        const step = p.length / segments;
        let cx = p.x;
        let cy = p.y;
        let a = p.angle;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        for (let sIdx = 0; sIdx < segments; sIdx++) {
          const nf =
            Math.sin(cx * 0.0011 + cy * 0.0007 + t * 2.4) * 0.42 +
            Math.cos(cy * 0.0013 - t * 1.6) * 0.22;
          a += (nf - 0.5) * 0.16;
          cx += Math.cos(a) * step;
          cy += Math.sin(a) * step;
          ctx.lineTo(cx, cy);
        }
        const color = p.accent ? accent : ink;
        const grad = ctx.createLinearGradient(p.x, p.y, cx, cy);
        const alpha = p.alpha * (lightMode ? 0.5 : 1);
        grad.addColorStop(0, `rgba(${color}, ${alpha})`);
        grad.addColorStop(1, `rgba(${color}, 0)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = p.width;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      if (running) raf = requestAnimationFrame(draw);
    };

    const onPointer = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };
    const onVisibility = () => {
      running = !document.hidden;
      if (running) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(draw);
      }
    };

    resize();
    readColors();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    const observer = new MutationObserver(readColors);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    if (reduce) {
      ctx.clearRect(0, 0, width, height);
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      observer.disconnect();
    };
  }, [reduce]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <canvas ref={canvasRef} className="h-full w-full opacity-90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,transparent_0%,var(--bg)_78%)] opacity-70" />
    </div>
  );
}

/** Accent light that trails the pointer. */
export function PointerGlow() {
  const reduce = useReducedMotion();
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const sx = useSpring(x, { stiffness: 55, damping: 20, mass: 0.7 });
  const sy = useSpring(y, { stiffness: 55, damping: 20, mass: 0.7 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      if (ref.current) ref.current.style.opacity = "1";
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [reduce, x, y]);

  if (reduce) return null;

  return (
    <motion.div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-0 hidden size-[520px] rounded-full opacity-0 transition-opacity duration-700 md:block"
      style={{
        x: sx,
        y: sy,
        marginLeft: -260,
        marginTop: -260,
        background:
          "radial-gradient(circle, color-mix(in srgb, var(--accent) 16%, transparent) 0%, transparent 62%)",
        filter: "blur(24px)",
      }}
    />
  );
}
