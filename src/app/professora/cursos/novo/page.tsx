import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { NewCourseForm } from "@/components/new-course-form";

export default async function NewCoursePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "TEACHER" && session.user.role !== "ADMIN") {
    redirect("/minha-area");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <p className="kicker">Painel</p>
      <h1 className="font-display mb-8 mt-2 text-4xl text-[var(--accent)]">
        Novo curso
      </h1>
      <NewCourseForm />
    </div>
  );
}
