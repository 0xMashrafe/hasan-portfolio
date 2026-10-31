import { useRef, useState, type ReactNode } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { cn } from "../lib/utils";

export const EASE = [0.16, 1, 0.3, 1] as const;

/* ---------------------------------------------------------------- Reveal */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
  once = true,
  amount = 0.25,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, amount });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduce ? { opacity: 1 } : { opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------ Split lines */
const lineVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.05 } },
};

const wordVariants: Variants = {
  hidden: { y: "110%", opacity: 0 },
  show: {
    y: "0%",
    opacity: 1,
    transition: { duration: 1.05, ease: EASE },
  },
};

export function SplitWords({
  text,
  className,
  wordClassName,
  delay = 0,
  as = "span",
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  as?: "span" | "h1" | "h2" | "p";
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as] as typeof motion.span;
  const words = text.split(" ");

  return (
    <Tag
      className={cn("inline-block", className)}
      variants={lineVariants}
      initial={reduce ? "show" : "hidden"}
      animate="show"
      transition={{ delayChildren: delay }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden pb-[0.12em] align-bottom"
          aria-hidden
        >
          <motion.span
            className={cn("inline-block", wordClassName)}
            variants={wordVariants}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/* -------------------------------------------------------------- Magnetic */
export function Magnetic({
  children,
  strength = 0.28,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });
  const reduce = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={cn("inline-flex", className)}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------ Section head */
export function SectionHead({
  index,
  label,
  title,
  description,
  className,
}: {
  index: string;
  label: string;
  title: ReactNode;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
      <div>
        <Reveal>
          <div className="mb-5 flex items-center gap-3 text-muted">
            <span className="mono text-accent-text">{index}</span>
            <span className="h-px w-8 bg-line" />
            <span className="mono">{label}</span>
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="display-tight text-[clamp(2.4rem,5.4vw,4.4rem)]">{title}</h2>
        </Reveal>
      </div>
      {description ? (
        <Reveal delay={0.12} className="max-w-[34ch] md:pb-2">
          <p className="text-[15px] leading-relaxed text-muted md:text-right">{description}</p>
        </Reveal>
      ) : null}
    </div>
  );
}

/* ---------------------------------------------------------------- Ticker */
export function Ticker({
  items,
  className,
  speed = "normal",
  reverse = false,
}: {
  items: string[];
  className?: string;
  speed?: "normal" | "slow";
  reverse?: boolean;
}) {
  const row = [...items, ...items];
  return (
    <div className={cn("relative flex overflow-hidden", className)}>
      <div
        className={cn(
          "flex w-max shrink-0 items-center",
          speed === "slow" ? "animate-marquee-slow" : "animate-marquee",
        )}
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        {row.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center">
            <span className="whitespace-nowrap">{item}</span>
            <span className="mx-6 inline-block size-1.5 rounded-full bg-current opacity-40 md:mx-9" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- Toast */
export function useToast() {
  const [message, setMessage] = useState<string | null>(null);

  return {
    message,
    show: (msg: string) => {
      setMessage(msg);
      window.setTimeout(() => setMessage((m) => (m === msg ? null : m)), 2200);
    },
  };
}
