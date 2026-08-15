"use client";

import { useEffect, useState } from "react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function goTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={goTop}
      className="fixed bottom-5 right-4 z-40 flex max-w-[calc(100vw-2rem)] items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-xs text-[var(--accent)] shadow-sm md:hidden"
      aria-label="Voltar ao topo"
    >
      <svg
        viewBox="0 0 16 16"
        aria-hidden="true"
        className="h-3.5 w-3.5 shrink-0"
      >
        <path
          d="M8 12.5V3.5M8 3.5L3.5 8M8 3.5L12.5 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>Voltar ao topo</span>
    </button>
  );
}
