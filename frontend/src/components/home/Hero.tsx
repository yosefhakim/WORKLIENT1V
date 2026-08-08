import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";
import { TiltCard } from "../ui/TiltCard";

const POPULAR_CHIPS = ["Python", "Web Scraping", "React", "Django", "Remote", "Backend", "Freelance"];

export function Hero() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : "/search");
  }

  return (
    <section className="relative overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0" />
      <div
        className="orb-a pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[var(--color-accent)] opacity-20 blur-[100px]"
        aria-hidden="true"
      />
      <div
        className="orb-b pointer-events-none absolute -right-16 top-40 h-64 w-64 rounded-full bg-[var(--color-success)] opacity-15 blur-[100px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-4xl px-5 pb-20 pt-20 text-center sm:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs text-[var(--color-text-secondary)]"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-success)] opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-success)]" />
          </span>
          Live from 9 sources, updated continuously
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.06 }}
          className="text-gradient font-[var(--font-display)] text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl"
        >
          Find your next opportunity.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="mx-auto mt-5 max-w-xl text-base text-[var(--color-text-secondary)] sm:text-lg"
        >
          WORKLIENT collects jobs and freelance gigs from across the web and puts them in one fast,
          searchable place — no more tab-hopping between nine different sites.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18 }}
          className="mx-auto mt-9 max-w-xl"
        >
          <TiltCard maxTilt={4}>
            <form
              onSubmit={handleSubmit}
              className="glass flex items-center gap-2 rounded-2xl border border-[var(--color-border)] p-2 shadow-xl shadow-black/30"
            >
              <div className="flex flex-1 items-center gap-2.5 px-3">
                <Search size={18} className="text-[var(--color-text-muted)]" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Try “React developer” or “data entry”…"
                  aria-label="Search opportunities"
                  className="w-full bg-transparent py-2.5 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]"
                />
              </div>
              <button
                type="submit"
                className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)]"
              >
                <Sparkles size={15} />
                Search
              </button>
            </form>
          </TiltCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.24 }}
          className="mx-auto mt-6 flex max-w-2xl flex-wrap items-center justify-center gap-2"
        >
          {POPULAR_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => navigate(`/search?q=${encodeURIComponent(chip)}`)}
              className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent)]/40 hover:text-[var(--color-text-primary)]"
            >
              {chip}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
