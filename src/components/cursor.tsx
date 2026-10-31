import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * Custom cursor: a precise dot plus a lagging ring that reads `data-cursor`
 * from the element under the pointer to grow and show a label.
 */
export function Cursor() {
  const [label, setLabel] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 420, damping: 34, mass: 0.35 });
  const ringY = useSpring(y, { stiffness: 420, damping: 34, mass: 0.35 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);
    document.documentElement.classList.add("custom-cursor");

    const isOverlayOpen = () => document.documentElement.dataset.overlay === "1";

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      if (isOverlayOpen()) {
        setVisible(false);
        return;
      }
      setVisible(true);

      const target = (e.target as Element | null)?.closest?.("[data-cursor],a,button");
      const attr = target?.getAttribute?.("data-cursor");
      if (attr) {
        setLabel(attr);
        setActive(true);
      } else if (target) {
        setLabel(null);
        setActive(true);
      } else {
        setLabel(null);
        setActive(false);
      }
    };

    const leave = () => setVisible(false);

    const overlayObserver = new MutationObserver(() => {
      if (isOverlayOpen()) {
        setVisible(false);
        setLabel(null);
        setActive(false);
        document.documentElement.classList.remove("custom-cursor");
      } else {
        document.documentElement.classList.add("custom-cursor");
      }
    });
    overlayObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-overlay"],
    });

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      document.documentElement.classList.remove("custom-cursor");
      overlayObserver.disconnect();
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[70]" aria-hidden>
      <motion.div
        className="absolute left-0 top-0 rounded-full bg-ink"
        style={{ x, y, marginLeft: -2.5, marginTop: -2.5 }}
        animate={{ opacity: visible ? 1 : 0, scale: active ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        // eslint-disable-next-line react/no-unknown-property
      >
        <div className="size-[5px] rounded-full bg-ink" />
      </motion.div>

      <motion.div
        className="absolute left-0 top-0 flex items-center justify-center rounded-full border border-ink/40 mix-blend-difference"
        style={{ x: ringX, y: ringY, marginLeft: "-1.25rem", marginTop: "-1.25rem" }}
        animate={{
          width: label ? 68 : active ? 46 : 26,
          height: label ? 68 : active ? 46 : 26,
          opacity: visible ? 1 : 0,
          backgroundColor: label ? "var(--ink)" : "transparent",
          borderColor: label ? "transparent" : "color-mix(in srgb, var(--ink) 45%, transparent)",
          marginLeft: label ? -34 : active ? -23 : -13,
          marginTop: label ? -34 : active ? -23 : -13,
        }}
        transition={{ type: "spring", stiffness: 320, damping: 26, mass: 0.5 }}
      >
        {label ? (
          <span className="mono text-[9px] font-medium tracking-[0.16em] text-bg">{label}</span>
        ) : null}
      </motion.div>
    </div>
  );
}
