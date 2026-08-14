import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NewLessonForm } from "@/components/new-lesson-form";
import { LessonRow } from "@/components/lesson-row";
import { EditCourseForm } from "@/components/edit-course-form";

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
    where: { id },
    include: { lessons: { orderBy: { order: "asc" } } },
  });

  if (!course) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <Link href="/professora" className="text-sm text-[var(--accent)]">
        ← Voltar ao painel
      </Link>
      <p className="kicker mt-4">
        {course.published ? "Publicado" : "Rascunho"} · /cursos/{course.slug}
      </p>
      <h1 className="font-display mt-2 text-3xl text-[var(--accent)] sm:text-4xl">
        {course.title}
      </h1>

      <section className="mt-8">
        <h2 className="font-display text-2xl">Curso</h2>
        <div className="mt-4 max-w-xl">
          <EditCourseForm
            course={{
              id: course.id,
              title: course.title,
              slug: course.slug,
              description: course.description,
              priceCents: course.priceCents,
              coverUrl: course.coverUrl,
              published: course.published,
            }}
          />
        </div>
      </section>

      <section className="mt-10 sm:mt-12">
        <h2 className="font-display text-2xl">Aulas</h2>
        <ul className="mt-4 space-y-2">
          {course.lessons.map((lesson) => (
            <LessonRow key={lesson.id} lesson={lesson} />
          ))}
        </ul>
      </section>

      <div className="mt-8 max-w-xl">
        <NewLessonForm courseId={course.id} />
      </div>
    </div>
  );
}
