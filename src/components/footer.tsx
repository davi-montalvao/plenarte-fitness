import Link from "next/link";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--line)] bg-[var(--surface)]">
      <div className="shell flex flex-col gap-10 py-14 md:flex-row md:justify-between">
        <div className="max-w-xs space-y-3">
          <Logo />
          <p className="text-sm text-[var(--muted)]">
            Movimento, força e elegância.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
          <Link href="/cursos" className="hover:text-[var(--accent)]">
            Curso
          </Link>
          <Link href="/cadastro" className="hover:text-[var(--accent)]">
            Criar conta
          </Link>
          <Link href="/login" className="hover:text-[var(--accent)]">
            Entrar
          </Link>
          <Link href="/#sobre" className="hover:text-[var(--accent)]">
            Sobre
          </Link>
          <a
            href="https://www.plenarteballet.com.br/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[var(--accent)]"
          >
            Plenarte Ballet
          </a>
        </div>
      </div>
      <div className="border-t border-[var(--line)] px-4 py-4 text-center text-xs text-[var(--muted)]">
        © 2026 Plenarte Fitness. Todos os direitos reservados.
      </div>
    </footer>
  );
}
