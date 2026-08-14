import Link from "next/link";
import { Logo } from "@/components/logo";
import { auth } from "@/lib/auth";

export async function Footer() {
  const session = await auth();
  const loggedIn = Boolean(session);
  const isTeacher =
    session?.user?.role === "TEACHER" || session?.user?.role === "ADMIN";

  const links = [
    { href: "/cursos", label: "Curso" },
    { href: "/#sobre", label: "Sobre" },
    ...(loggedIn && !isTeacher ? [{ href: "/minha-area", label: "Minha área" }] : []),
    ...(isTeacher ? [{ href: "/professora", label: "Painel" }] : []),
    ...(loggedIn ? [{ href: "/minha-conta", label: "Minha conta" }] : []),
    ...(!loggedIn
      ? [
          { href: "/login", label: "Entrar" },
          { href: "/cadastro", label: "Criar conta" },
        ]
      : []),
    {
      href: "https://www.plenarteballet.com.br/",
      label: "Plenarte Ballet",
      external: true,
    },
  ];

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
          {links.map((link) =>
            "external" in link && link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[var(--accent)]"
              >
                {link.label}
              </a>
            ) : (
              <Link key={link.href} href={link.href} className="hover:text-[var(--accent)]">
                {link.label}
              </Link>
            ),
          )}
        </div>
      </div>
      <div className="space-y-2 border-t border-[var(--line)] px-4 py-4 text-center text-xs text-[var(--muted)]">
        <p>© 2026 Plenarte Fitness. Todos os direitos reservados.</p>
        <p>
          Criado por{" "}
          <a
            href="https://davimontalvao.com.br"
            target="_blank"
            rel="noreferrer"
            className="text-[var(--foreground)] underline-offset-2 hover:text-[var(--accent)] hover:underline"
          >
            Davi Montalvão
          </a>
        </p>
        <p>Feito com amor 💜 e persistência 🚀</p>
      </div>
    </footer>
  );
}
