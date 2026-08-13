import { auth } from "@/lib/auth";
import { HeaderNav } from "@/components/header-nav";

export async function Header() {
  const session = await auth();
  const isTeacher =
    session?.user?.role === "TEACHER" || session?.user?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--surface)]/95 backdrop-blur">
      <div className="shell relative flex h-20 items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr]">
        <HeaderNav loggedIn={Boolean(session)} isTeacher={Boolean(isTeacher)} />
      </div>
    </header>
  );
}
