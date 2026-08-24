"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PasswordField } from "@/components/password-field";
import { getNameError, NAME_HINT } from "@/lib/name";
import { getPasswordError, PASSWORD_HINT } from "@/lib/password";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const nameError = getNameError(name);
  const passwordError = getPasswordError(password);
  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;
  const canSubmit =
    !nameError &&
    isValidEmail(email.trim()) &&
    !passwordError &&
    passwordsMatch;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError("");

    const payload = {
      name: name.trim(),
      email: email.trim(),
      password,
    };

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      setLoading(false);
      setError(data.error ?? "Erro ao cadastrar");
      return;
    }

    const result = await signIn("credentials", {
      email: payload.email,
      password: payload.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      router.push("/login");
      return;
    }

    router.push("/minha-area");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-md space-y-4">
      <div className="space-y-1">
        <label className="mb-1 block text-sm" htmlFor="name">
          Nome completo
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Nome e sobrenome"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="field"
        />
        <p className="text-xs text-[var(--muted)]">{NAME_HINT}</p>
        {name.trim().length > 0 && nameError && (
          <p className="text-sm text-red-700">{nameError}</p>
        )}
      </div>
      <div>
        <label className="mb-1 block text-sm" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="field"
        />
      </div>
      <div className="space-y-1">
        <PasswordField
          id="password"
          name="password"
          label="Senha"
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
        />
        <p className="text-xs text-[var(--muted)]">{PASSWORD_HINT}</p>
        {password.length > 0 && passwordError && (
          <p className="text-sm text-red-700">{passwordError}</p>
        )}
      </div>
      <div className="space-y-1">
        <PasswordField
          id="confirmPassword"
          name="confirmPassword"
          label="Confirmar senha"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={setConfirmPassword}
        />
        {confirmPassword.length > 0 && !passwordsMatch && (
          <p className="text-sm text-red-700">A senha não está igual</p>
        )}
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={loading || !canSubmit}
        className="btn btn-primary w-full"
      >
        {loading ? "Criando..." : "Criar conta"}
      </button>
      <p className="text-center text-sm text-[var(--muted)]">
        Já tem conta?{" "}
        <Link href="/login" className="underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}
