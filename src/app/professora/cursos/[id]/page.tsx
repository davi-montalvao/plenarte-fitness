import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NewLessonForm } from "@/components/new-lesson-form";
import { LessonRow } from "@/components/lesson-row";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ManageCoursePage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "TEACHER" && session.user.role !== "ADMIN") {
    redirect("/minha-area");
  }

  const { id } = await params;

  const course = await prisma.course.findFirst({
    where: { id, teacherId: session.user.id },
    include: { lessons: { orderBy: { order: "asc" } } },
  });

  if (!course) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <p className="kicker">
        {course.published ? "Publicado" : "Rascunho"} · /cursos/{course.slug}
      </p>
      <h1 className="font-display mt-2 text-4xl text-[var(--accent)]">
        {course.title}
      </h1>

      <section className="mt-8">
        <h2 className="font-display text-2xl">Aulas</h2>
        <ul className="mt-4 space-y-2">
          {course.lessons.map((lesson) => (
            <LessonRow key={lesson.id} lesson={lesson} />
          ))}
        </ul>
      </section>

      <div className="mt-8">
        <NewLessonForm courseId={course.id} />
      </div>
    </div>
  );
}
