"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { PasswordField } from "@/components/password-field";
import { getPasswordError, PASSWORD_HINT } from "@/lib/password";

type Props = {
  name: string;
  email: string;
  isTeacher: boolean;
};

export function AccountForm({ name: initialName, email, isTeacher }: Props) {
  const router = useRouter();
  const { update } = useSession();
  const [name, setName] = useState(initialName);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState<{ type: "ok" | "error"; text: string } | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const changingPassword =
    showPassword &&
    (currentPassword.length > 0 ||
      newPassword.length > 0 ||
      confirmPassword.length > 0);
  const passwordError =
    newPassword.length > 0 ? getPasswordError(newPassword) : null;
  const passwordsMatch =
    confirmPassword.length > 0 && newPassword === confirmPassword;
  const passwordOk =
    !changingPassword ||
    (Boolean(currentPassword) &&
      Boolean(newPassword) &&
      Boolean(confirmPassword) &&
      !passwordError &&
      passwordsMatch);
  const canSubmit = name.trim().length >= 2 && passwordOk && !loading;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    const didChangePassword = changingPassword;
    setError("");
    setSaved(false);
    setToast(null);
    setLoading(true);

    const res = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        ...(didChangePassword
          ? { currentPassword, newPassword }
          : {}),
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      const message = data.error ?? "Não foi possível salvar. Tente de novo.";
      setError(message);
      setToast({ type: "error", text: message });
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    await update({ name: data.user.name });

    if (didChangePassword) {
      setToast({ type: "ok", text: "Senha alterada com sucesso" });
      window.setTimeout(() => {
        router.push(isTeacher ? "/professora" : "/minha-area");
        router.refresh();
      }, 1400);
      return;
    }

    setSaved(true);
    router.refresh();
  }

  return (
    <>
      {toast && (
        <div
          role="status"
          className={`fixed bottom-6 left-1/2 z-50 w-[min(92vw,24rem)] -translate-x-1/2 rounded-xl border px-4 py-3 text-center text-sm ${
            toast.type === "ok"
              ? "border-green-200 bg-green-50 text-green-900"
              : "border-red-200 bg-red-50 text-red-900"
          }`}
        >
          {toast.text}
        </div>
      )}

      <form onSubmit={onSubmit} className="card space-y-4 p-4 sm:p-6">
        <div>
          <label className="mb-1 block text-sm" htmlFor="name">
            Nome
          </label>
          <input
            id="name"
            name="name"
            required
            minLength={2}
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="field"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm" htmlFor="email">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            disabled
            className="field bg-[var(--accent-soft)]/40 text-[var(--muted)]"
          />
          <p className="mt-1 text-xs text-[var(--muted)]">
            Por enquanto o e-mail não pode ser alterado.
          </p>
        </div>

        <div className="border-t border-[var(--line)] pt-4">
          <button
            type="button"
            className="flex w-full items-center justify-between text-left text-sm"
            onClick={() => {
              setShowPassword((open) => {
                if (open) {
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }
                return !open;
              });
            }}
            aria-expanded={showPassword}
          >
            <span className="text-[var(--muted)]">Trocar senha</span>
            <span className="inline-flex items-center gap-1.5 text-[var(--accent)]">
              {showPassword ? "Fechar" : "Abrir"}
              <svg
                viewBox="0 0 16 16"
                aria-hidden="true"
                className={`h-3.5 w-3.5 transition-transform ${
                  showPassword ? "rotate-180" : ""
                }`}
              >
                <path
                  d="M3.5 6L8 10.5L12.5 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
        </div>

        {showPassword && (
          <div className="space-y-4">
            <PasswordField
              id="currentPassword"
              name="currentPassword"
              label="Senha atual"
              autoComplete="current-password"
              required={false}
              value={currentPassword}
              onChange={setCurrentPassword}
            />

            <div className="space-y-1">
              <PasswordField
                id="newPassword"
                name="newPassword"
                label="Nova senha"
                autoComplete="new-password"
                required={false}
                value={newPassword}
                onChange={setNewPassword}
              />
              <p className="text-xs text-[var(--muted)]">{PASSWORD_HINT}</p>
              {newPassword.length > 0 && passwordError && (
                <p className="text-sm text-red-700">{passwordError}</p>
              )}
            </div>

            <div className="space-y-1">
              <PasswordField
                id="confirmPassword"
                name="confirmPassword"
                label="Confirmar nova senha"
                autoComplete="new-password"
                required={false}
                value={confirmPassword}
                onChange={setConfirmPassword}
              />
              {confirmPassword.length > 0 && !passwordsMatch && (
                <p className="text-sm text-red-700">A senha não está igual</p>
              )}
            </div>
          </div>
        )}

        {error && <p className="text-sm text-red-700">{error}</p>}
        {saved && !error && (
          <p className="text-sm text-green-800">Dados salvos.</p>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="btn btn-primary w-full sm:w-auto"
        >
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </>
  );
}
