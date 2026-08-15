import Link from "next/link";
import { Logo } from "@/components/logo";
import { auth } from "@/lib/auth";

function IconGlobe() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
      className="shrink-0"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M3 12h18M12 3c2.5 2.8 3.8 5.8 3.8 9s-1.3 6.2-3.8 9c-2.5-2.8-3.8-5.8-3.8-9s1.3-6.2 3.8-9z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle
        cx="12"
        cy="12"
        r="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M7.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 5 5l1.5-2 4 1.5v3c0 1.1-.9 2-2 2A15.5 15.5 0 0 1 3.5 5.5c0-1.1.9-2 2-2z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
  ];

  const contacts = [
    {
      href: "https://www.plenarteballet.com.br/",
      label: "plenarteballet.com.br",
      icon: IconGlobe,
      external: true,
    },
    {
      href: "https://www.instagram.com/plenarteballet/",
      label: "@plenarteballet",
      icon: IconInstagram,
      external: true,
    },
    {
      href: "https://wa.me/5511932433250",
      label: "(11) 93243-3250",
      icon: IconPhone,
      external: true,
    },
  ];

  return (
    <footer className="mt-auto border-t border-[var(--line)] bg-[var(--surface)]">
      <div className="shell flex flex-col gap-10 py-14 sm:flex-row sm:justify-between sm:gap-16">
        <div className="max-w-xs space-y-4">
          <Logo />
          <p className="text-sm text-[var(--muted)]">
            Movimento, força e elegância.
          </p>
          <ul className="space-y-2.5 text-sm">
            {contacts.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-[var(--foreground)]/85 hover:text-[var(--accent)]"
                  >
                    <Icon />
                    <span>{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <nav className="flex flex-col gap-2 text-sm sm:items-end sm:text-right">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-[var(--accent)]">
              {link.label}
            </Link>
          ))}
        </nav>
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
