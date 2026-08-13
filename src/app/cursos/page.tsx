import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/youtube";

export const dynamic = "force-dynamic";

const DEFAULT_COVER = "/images/ballet-fitness-movimento.png";

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { lessons: true } } },
  });

  return (
    <div className="shell py-16">
      <p className="kicker">Plenarte Fitness</p>
      <h1 className="font-display mt-3 text-4xl text-[var(--accent)] md:text-5xl">
        O curso
      </h1>
      <p className="mt-3 max-w-xl text-[var(--muted)]">
        Assista no seu ritmo e treine em casa.
      </p>

      {courses.length === 0 ? (
        <p className="mt-10 text-[var(--muted)]">Nenhum curso publicado ainda.</p>
      ) : (
        <ul className="mt-10 grid gap-5 md:grid-cols-2">
          {courses.map((course) => (
            <li key={course.id} className="card overflow-hidden p-0 transition hover:-translate-y-0.5">
              <div className="relative h-48 w-full">
                <Image
                  src={course.coverUrl || DEFAULT_COVER}
                  alt={course.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-7">
                <h2 className="font-display text-2xl">{course.title}</h2>
                <p className="mt-2 line-clamp-3 text-[var(--muted)]">
                  {course.description}
                </p>
                <div className="mt-5 flex items-center justify-between text-sm">
                  <span className="text-[var(--muted)]">
                    {course._count.lessons} aula
                    {course._count.lessons === 1 ? "" : "s"} ·{" "}
                    {formatPrice(course.priceCents)}
                  </span>
                  <Link href={`/cursos/${course.slug}`} className="text-[var(--accent)]">
                    Ver detalhes →
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
