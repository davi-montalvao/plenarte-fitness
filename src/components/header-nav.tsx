"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Logo } from "@/components/logo";

type Props = {
  loggedIn: boolean;
  isTeacher: boolean;
};

export function HeaderNav({ loggedIn, isTeacher }: Props) {
  const [open, setOpen] = useState(false);

  const sections = [
    { href: "/cursos", label: "Curso" },
    { href: "/#sobre", label: "Sobre" },
    ...(loggedIn && !isTeacher ? [{ href: "/minha-area", label: "Minha área" }] : []),
  ];

  return (
    <>
      <nav className="hidden items-center gap-8 text-[0.8rem] md:flex">
        {sections.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-[var(--foreground)]/80 transition hover:text-[var(--accent)]"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="md:justify-self-center">
        <Logo />
      </div>

      <div className="flex items-center justify-end gap-3">
        <div className="hidden items-center gap-3 md:flex">
          {isTeacher && (
            <Link
              href="/professora"
              className="text-[0.8rem] text-[var(--foreground)]/80 hover:text-[var(--accent)]"
            >
              Painel
            </Link>
          )}
          {loggedIn ? (
            <>
              <Link
                href="/minha-conta"
                className="text-[0.8rem] text-[var(--foreground)]/80 hover:text-[var(--accent)]"
              >
                Minha conta
              </Link>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-full border border-[var(--line)] px-4 py-2 text-[0.8rem] hover:border-[var(--accent)]"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full border border-[var(--line)] px-4 py-2 text-[0.8rem] hover:border-[var(--accent)]"
              >
                Entrar
              </Link>
              <Link href="/cadastro" className="btn btn-primary py-2.5">
                Criar conta
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center md:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">Menu</span>
          <span className="flex flex-col gap-1.5">
            <span className="block h-px w-5 bg-[var(--foreground)]" />
            <span className="block h-px w-5 bg-[var(--foreground)]" />
            <span className="block h-px w-5 bg-[var(--foreground)]" />
          </span>
        </button>
      </div>

      {open && (
        <div className="absolute inset-x-0 top-full border-b border-[var(--line)] bg-[var(--surface)] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4 text-sm">
            {sections.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            {isTeacher && (
              <Link href="/professora" onClick={() => setOpen(false)}>
                Painel
              </Link>
            )}
            {loggedIn ? (
              <>
                <Link href="/minha-conta" onClick={() => setOpen(false)}>
                  Minha conta
                </Link>
                <button
                  type="button"
                  className="text-left"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)}>
                  Entrar
                </Link>
                <Link
                  href="/cadastro"
                  className="btn btn-primary"
                  onClick={() => setOpen(false)}
                >
                  Criar conta
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
