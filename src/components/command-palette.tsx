import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AtSign,
  Briefcase,
  Copy,
  GitBranch,
  Home,
  Layers,
  Mail,
  Moon,
  Route,
  Sun,
  User,
  Wrench,
  X,
} from "lucide-react";
import { navSections, profile } from "../data";
import { cn, scrollToId } from "../lib/utils";
import { EASE } from "./motion";

type Item = {
  id: string;
  label: string;
  hint: string;
  group: "Navigate" | "Actions" | "Elsewhere";
  icon: React.ComponentType<{ className?: string }>;
  keywords?: string;
  run: () => void;
};

export function CommandPalette({
  open,
  onClose,
  theme,
  toggleTheme,
  onCopyEmail,
}: {
  open: boolean;
  onClose: () => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
  onCopyEmail: () => void;
}) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const items = useMemo<Item[]>(() => {
    const go = (id: string) => () => {
      onClose();
      window.setTimeout(() => scrollToId(id), 240);
    };
    return [
      { id: "home", label: "Home", hint: "01", group: "Navigate", icon: Home, run: go("home") },
      ...navSections.map((s) => ({
        id: s.id,
        label: s.label,
        hint: s.index,
        group: "Navigate" as const,
        icon:
          s.id === "about" ? User : s.id === "work" ? Layers : s.id === "craft" ? Wrench : s.id === "path" ? Route : Mail,
        run: go(s.id),
      })),
      {
        id: "theme",
        label: `Switch to ${theme === "dark" ? "light" : "dark"} mode`,
        hint: "T",
        group: "Actions",
        icon: theme === "dark" ? Sun : Moon,
        keywords: "theme dark light toggle appearance",
        run: () => {
          toggleTheme();
          onClose();
        },
      },
      {
        id: "email",
        label: "Copy email address",
        hint: profile.email,
        group: "Actions",
        icon: Copy,
        keywords: "copy mail contact",
        run: () => {
          onCopyEmail();
          onClose();
        },
      },
      {
        id: "mailto",
        label: "Send an email",
        hint: "↗",
        group: "Actions",
        icon: Mail,
        keywords: "mail contact hire",
        run: () => {
          window.location.href = `mailto:${profile.email}`;
          onClose();
        },
      },
      ...profile.socials.slice(0, 3).map((s) => ({
        id: s.label,
        label: s.label,
        hint: s.handle,
        group: "Elsewhere" as const,
        icon: s.label === "GitHub" ? GitBranch : s.label === "LinkedIn" ? Briefcase : AtSign,
        run: () => {
          window.open(s.href, "_blank", "noopener,noreferrer");
          onClose();
        },
      })),
    ];
  }, [onClose, theme, toggleTheme, onCopyEmail]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) =>
      `${item.label} ${item.hint} ${item.keywords ?? ""} ${item.group}`.toLowerCase().includes(q),
    );
  }, [items, query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setCursor(0);
    }
  }, [open]);

  useEffect(() => {
    setCursor(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    document.documentElement.dataset.overlay = "1";
    return () => {
      document.documentElement.style.overflow = "";
      delete document.documentElement.dataset.overlay;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setCursor((c) => (filtered.length ? (c + 1) % filtered.length : 0));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setCursor((c) => (filtered.length ? (c - 1 + filtered.length) % filtered.length : 0));
      }
      if (e.key === "Enter") {
        e.preventDefault();
        filtered[cursor]?.run();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, cursor, onClose]);

  const groups: Item["group"][] = ["Navigate", "Actions", "Elsewhere"];

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[90] flex items-start justify-center px-4 pt-[12vh] sm:pt-[16vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <div
            className="absolute inset-0 bg-bg/70 backdrop-blur-md"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            initial={{ y: 18, scale: 0.985, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 10, scale: 0.99, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="relative w-full max-w-[560px] overflow-hidden rounded-2xl border border-line bg-bg-soft shadow-[0_40px_120px_-20px_rgba(0,0,0,0.75)]"
          >
            <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
              <span className="mono text-accent-text">/</span>
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Jump to a section or run a command…"
                className="w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-muted/70"
                data-native-cursor
                aria-label="Search commands"
              />
              <button
                onClick={onClose}
                className="grid size-6 place-items-center rounded border border-line text-muted transition-colors hover:text-ink"
                aria-label="Close"
              >
                <X className="size-3" />
              </button>
            </div>

            <div ref={listRef} className="no-scrollbar max-h-[46vh] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="px-3 py-10 text-center">
                  <p className="text-[14px] text-muted">Nothing matches “{query}”.</p>
                  <p className="mono mt-2 text-[10px] text-muted/70">try “work”, “theme” or “email”</p>
                </div>
              ) : (
                groups.map((group) => {
                  const groupItems = filtered.filter((i) => i.group === group);
                  if (!groupItems.length) return null;
                  return (
                    <div key={group} className="mb-1">
                      <div className="mono px-3 py-2 text-[9px] text-muted/70">{group}</div>
                      {groupItems.map((item) => {
                        const index = filtered.indexOf(item);
                        const isActive = index === cursor;
                        return (
                          <button
                            key={item.id}
                            onMouseMove={() => setCursor(index)}
                            onClick={item.run}
                            className={cn(
                              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                              isActive ? "bg-ink/[0.06] text-ink" : "text-muted hover:text-ink",
                            )}
                          >
                            <item.icon className={cn("size-3.5 shrink-0", isActive && "text-accent-text")} />
                            <span className="flex-1 truncate text-[13.5px]">{item.label}</span>
                            <span className="mono max-w-[46%] truncate text-[9px] text-muted/70">{item.hint}</span>
                          </button>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>

            <div className="mono flex items-center justify-between border-t border-line px-4 py-2.5 text-[9px] text-muted/70">
              <span className="flex items-center gap-3">
                <span>↑↓ navigate</span>
                <span>↵ open</span>
                <span>esc close</span>
              </span>
              <span className="hidden sm:block">ayaan.exe</span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
