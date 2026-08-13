import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/youtube";

export const dynamic = "force-dynamic";

export default async function TeacherPanelPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "TEACHER" && session.user.role !== "ADMIN") {
    redirect("/minha-area");
  }

  const courses = await prisma.course.findMany({
    where: { teacherId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { lessons: true, purchases: true } } },
  });

  return (
    <div className="shell py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="kicker">Professora</p>
          <h1 className="font-display mt-2 text-4xl text-[var(--accent)]">
            Painel
          </h1>
        </div>
        <Link href="/professora/cursos/novo" className="btn btn-primary">
          Novo curso
        </Link>
      </div>

      <ul className="mt-8 space-y-3">
        {courses.map((course) => (
          <li
            key={course.id}
            className="card flex flex-wrap items-center justify-between gap-3 px-5 py-4"
          >
            <div>
              <h2 className="font-display text-xl">{course.title}</h2>
              <p className="text-sm text-[var(--muted)]">
                {course.published ? "Publicado" : "Rascunho"} ·{" "}
                {course._count.lessons} aulas · {course._count.purchases} compras ·{" "}
                {formatPrice(course.priceCents)}
              </p>
            </div>
            <Link href={`/professora/cursos/${course.id}`} className="text-[var(--accent)]">
              Gerenciar →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
