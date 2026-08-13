import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getYoutubeEmbedUrl } from "@/lib/youtube";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function WatchCoursePage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { slug } = await params;

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      lessons: { orderBy: { order: "asc" } },
    },
  });

  if (!course) notFound();

  const purchase = await prisma.purchase.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId: course.id,
      },
    },
  });

  const isTeacher =
    session.user.role === "TEACHER" || session.user.role === "ADMIN";

  if (purchase?.status !== "PAID" && !isTeacher) {
    redirect(`/cursos/${course.slug}`);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="font-display text-4xl text-[var(--accent)]">
        {course.title}
      </h1>

      <div className="mt-8 space-y-10">
        {course.lessons.map((lesson, index) => {
          const embed = getYoutubeEmbedUrl(lesson.youtubeUrl);

          return (
            <article key={lesson.id} className="space-y-3">
              <h2 className="font-display text-2xl">
                {String(index + 1).padStart(2, "0")}. {lesson.title}
              </h2>
              {lesson.description && (
                <p className="text-[var(--muted)]">{lesson.description}</p>
              )}
              {embed ? (
                <div className="aspect-video overflow-hidden rounded-2xl bg-black">
                  <iframe
                    src={embed}
                    title={lesson.title}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <p className="text-sm text-red-700">URL do YouTube inválida</p>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
