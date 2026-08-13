import Link from "next/link";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="inline-block w-fit leading-none">
      <span
        className={`font-display text-[1.35rem] tracking-[0.18em] ${
          light ? "text-white" : "text-[var(--accent)]"
        }`}
      >
        PLENARTE
      </span>
      <span
        className={`block text-center text-[0.62rem] tracking-[0.42em] ${
          light ? "text-white/80" : "text-[var(--accent)]"
        }`}
      >
        FITNESS
      </span>
    </Link>
  );
}
