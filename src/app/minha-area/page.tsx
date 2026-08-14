import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/youtube";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ pagamento?: string }>;
};

function formatDate(date: Date) {
  return date.toLocaleDateString("pt-BR");
}

export default async function StudentAreaPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role === "TEACHER" || session.user.role === "ADMIN") {
    redirect("/professora");
  }

  const params = await searchParams;

  const purchase = await prisma.purchase.findFirst({
    where: { userId: session.user.id, status: "PAID" },
    include: {
      course: {
        include: {
          lessons: { orderBy: { order: "asc" } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const progress = purchase
    ? await prisma.lessonProgress.findMany({
        where: {
          userId: session.user.id,
          lessonId: { in: purchase.course.lessons.map((lesson) => lesson.id) },
        },
        select: { lessonId: true },
      })
    : [];

  const watchedIds = new Set(progress.map((item) => item.lessonId));

  const total = purchase?.course.lessons.length ?? 0;
  const watched = purchase
    ? purchase.course.lessons.filter((lesson) => watchedIds.has(lesson.id)).length
    : 0;
  const nextLesson = purchase?.course.lessons.find((lesson) => !watchedIds.has(lesson.id));
  const percent = total === 0 ? 0 : Math.round((watched / total) * 100);

  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <p className="kicker">Olá, {session.user.name}</p>
      <h1 className="font-display mt-3 text-4xl text-[var(--accent)]">Minha área</h1>

      {params.pagamento === "sucesso" && (
        <p className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">
          Pagamento recebido. Se o curso ainda não aparecer, aguarde alguns
          segundos e atualize a página.
        </p>
      )}
      {params.pagamento === "falha" && (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          Pagamento não concluído. Tente novamente.
        </p>
      )}
      {params.pagamento === "pendente" && (
        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Pagamento pendente. Assim que for aprovado, o curso será liberado.
        </p>
      )}

      {!purchase ? (
        <div className="card mt-10 p-7">
          <p className="text-[var(--muted)]">Você ainda não tem o curso.</p>
          <Link href="/cursos" className="btn btn-primary mt-5">
            Ver o curso
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-8">
            {nextLesson ? (
              <Link
                href={`/minha-area/cursos/${purchase.course.slug}?aula=${nextLesson.id}`}
                className="btn btn-primary"
              >
                Continuar aula
              </Link>
            ) : (
              <Link
                href={`/minha-area/cursos/${purchase.course.slug}`}
                className="btn btn-primary"
              >
                Rever aulas
              </Link>
            )}
          </div>

          <section className="mt-12">
            <h2 className="font-display text-2xl">Seu progresso</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {watched} de {total} aula{total === 1 ? "" : "s"}
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--accent-soft)]">
              <div
                className="h-full rounded-full bg-[var(--accent)]"
                style={{ width: `${percent}%` }}
              />
            </div>
          </section>

          <section className="mt-12">
            <h2 className="font-display text-2xl">Aulas</h2>
            <ul className="mt-4 space-y-2">
              {purchase.course.lessons.map((lesson, index) => {
                const done = watchedIds.has(lesson.id);

                return (
                  <li key={lesson.id} className="card flex items-center justify-between gap-4 px-4 py-3">
                    <div>
                      <p>
                        <span className="text-[var(--muted)]">
                          {done ? "✓" : "○"} {String(index + 1).padStart(2, "0")}
                        </span>{" "}
                        {lesson.title}
                      </p>
                      <p className="text-sm text-[var(--muted)]">
                        {done ? "Assistida" : "Pendente"}
                      </p>
                    </div>
                    <Link
                      href={`/minha-area/cursos/${purchase.course.slug}?aula=${lesson.id}`}
                      className="text-sm text-[var(--accent)]"
                    >
                      Assistir →
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="mt-12">
            <h2 className="font-display text-2xl">Compra</h2>
            <div className="card mt-4 p-5">
              <p className="font-display text-xl">{purchase.course.title}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                {formatPrice(purchase.amountCents)} · pago em {formatDate(purchase.updatedAt)}
              </p>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
