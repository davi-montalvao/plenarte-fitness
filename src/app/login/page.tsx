import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <p className="kicker text-center">Plenarte Fitness</p>
      <h1 className="font-display mb-8 mt-3 text-center text-4xl text-[var(--accent)]">
        Entrar
      </h1>
      <LoginForm />
    </div>
  );
}
