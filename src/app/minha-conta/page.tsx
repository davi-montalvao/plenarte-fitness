import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AccountForm } from "@/components/account-form";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const isTeacher =
    session.user.role === "TEACHER" || session.user.role === "ADMIN";

  return (
    <div className="mx-auto max-w-xl px-4 py-14">
      <p className="kicker">Olá, {session.user.name}</p>
      <h1 className="font-display mt-3 text-3xl text-[var(--accent)] sm:text-4xl">
        Minha conta
      </h1>
      <div className="mt-8">
        <AccountForm
          name={session.user.name ?? ""}
          email={session.user.email ?? ""}
          isTeacher={isTeacher}
        />
      </div>
    </div>
  );
}
