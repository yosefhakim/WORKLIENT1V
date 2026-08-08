import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Search, LayoutDashboard, Home, ArrowRight } from "lucide-react";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

const STATIC_ACTIONS = [
  { label: "Go to Home", path: "/", icon: Home },
  { label: "Go to Search", path: "/search", icon: Search },
  { label: "Go to Dashboard", path: "/dashboard", icon: LayoutDashboard },
];

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && open) onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  function runSearch() {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate("/search");
    }
    onClose();
  }

  function goTo(path: string) {
    navigate(path);
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-elevated)] shadow-2xl shadow-black/50"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                runSearch();
              }}
              className="flex items-center gap-3 border-b border-[var(--color-border)] px-4 py-3.5"
            >
              <Search size={17} className="text-[var(--color-text-muted)]" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search opportunities, or jump to a page…"
                className="flex-1 bg-transparent text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]"
              />
              <kbd className="rounded border border-[var(--color-border)] px-1.5 py-0.5 text-[10px] text-[var(--color-text-muted)]">
                Esc
              </kbd>
            </form>
            <div className="max-h-72 overflow-y-auto p-2">
              <button
                type="button"
                onClick={runSearch}
                className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]"
              >
                <span className="flex items-center gap-2.5">
                  <Search size={14} className="text-[var(--color-accent-hover)]" />
                  {query ? `Search for "${query}"` : "Search all opportunities"}
                </span>
                <ArrowRight size={14} className="text-[var(--color-text-muted)]" />
              </button>
              <div className="mx-1 my-1 border-t border-[var(--color-border)]" />
              {STATIC_ACTIONS.map((action) => (
                <button
                  key={action.path}
                  type="button"
                  onClick={() => goTo(action.path)}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]"
                >
                  <action.icon size={14} />
                  {action.label}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
