import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/youtube";

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return date.toLocaleDateString("pt-BR");
}

export default async function TeacherPanelPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "TEACHER" && session.user.role !== "ADMIN") {
    redirect("/minha-area");
  }

  const course = await prisma.course.findFirst({
    where: { teacherId: session.user.id },
    orderBy: [{ published: "desc" }, { createdAt: "desc" }],
    include: {
      lessons: { select: { id: true }, orderBy: { order: "asc" } },
      purchases: {
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!course) {
    return (
      <div className="shell py-14 md:py-16">
        <p className="kicker">Olá, {session.user.name}</p>
        <h1 className="font-display mt-2 text-3xl text-[var(--accent)] sm:text-4xl">
          Painel
        </h1>
        <div className="card mt-10 max-w-lg p-6 sm:p-7">
          <p className="text-[var(--muted)]">Você ainda não tem um curso.</p>
          <Link href="/professora/cursos/novo" className="btn btn-primary mt-5">
            Novo curso
          </Link>
        </div>
      </div>
    );
  }

  const lessonIds = course.lessons.map((lesson) => lesson.id);
  const totalLessons = lessonIds.length;
  const paid = course.purchases.filter((purchase) => purchase.status === "PAID");
  const pending = course.purchases.filter(
    (purchase) => purchase.status === "PENDING",
  );
  const revenueCents = paid.reduce((sum, purchase) => sum + purchase.amountCents, 0);

  const progressRows =
    paid.length === 0 || totalLessons === 0
      ? []
      : await prisma.lessonProgress.groupBy({
          by: ["userId"],
          where: {
            userId: { in: paid.map((purchase) => purchase.userId) },
            lessonId: { in: lessonIds },
          },
          _count: { lessonId: true },
        });

  const watchedByUser = new Map(
    progressRows.map((row) => [row.userId, row._count.lessonId]),
  );

  const stats = [
    { label: "Alunas", value: String(paid.length) },
    { label: "Receita", value: formatPrice(revenueCents) },
    { label: "Pendente", value: String(pending.length) },
    { label: "Aulas", value: String(totalLessons) },
  ];

  return (
    <div className="shell py-14 md:py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="kicker">Olá, {session.user.name}</p>
          <h1 className="font-display mt-2 text-3xl text-[var(--accent)] sm:text-4xl">
            Painel
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)] sm:text-base">
            {course.title}
          </p>
        </div>
        <Link
          href={`/professora/cursos/${course.id}`}
          className="btn btn-primary w-full sm:w-auto"
        >
          Gerenciar aulas
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card px-4 py-4 sm:px-5 sm:py-5">
            <p className="font-display text-2xl text-[var(--accent)] sm:text-3xl">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-[var(--muted)]">{stat.label}</p>
          </div>
        ))}
      </div>

      {pending.length > 0 && (
        <section className="mt-10 sm:mt-12">
          <h2 className="font-display text-2xl">Pendentes</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Iniciaram o pagamento, mas ainda não concluíram.
          </p>

          <ul className="mt-4 space-y-3 md:hidden">
            {pending.map((purchase) => (
              <li key={purchase.id} className="card p-4">
                <p className="font-medium">{purchase.user.name}</p>
                <p className="break-all text-sm text-[var(--muted)]">
                  {purchase.user.email}
                </p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {formatPrice(purchase.amountCents)} · {formatDate(purchase.createdAt)}
                </p>
              </li>
            ))}
          </ul>

          <div className="card mt-4 hidden overflow-x-auto md:block">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--line)] text-[var(--muted)]">
                  <th className="px-5 py-3 font-medium">Nome</th>
                  <th className="px-5 py-3 font-medium">E-mail</th>
                  <th className="px-5 py-3 font-medium">Valor</th>
                  <th className="px-5 py-3 font-medium">Início</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((purchase) => (
                  <tr
                    key={purchase.id}
                    className="border-b border-[var(--line)] last:border-b-0"
                  >
                    <td className="px-5 py-4 font-medium">{purchase.user.name}</td>
                    <td className="px-5 py-4 text-[var(--muted)]">
                      {purchase.user.email}
                    </td>
                    <td className="px-5 py-4 text-[var(--muted)]">
                      {formatPrice(purchase.amountCents)}
                    </td>
                    <td className="px-5 py-4 text-[var(--muted)]">
                      {formatDate(purchase.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="mt-10 sm:mt-12">
        <h2 className="font-display text-2xl">Alunas</h2>

        {paid.length === 0 ? (
          <p className="mt-4 text-[var(--muted)]">Ainda não há alunas no curso.</p>
        ) : (
          <>
            <ul className="mt-4 space-y-3 md:hidden">
              {paid.map((purchase) => {
                const watched = watchedByUser.get(purchase.userId) ?? 0;
                const percent =
                  totalLessons === 0 ? 0 : Math.round((watched / totalLessons) * 100);

                return (
                  <li key={purchase.id} className="card space-y-3 p-4">
                    <div>
                      <p className="font-medium">{purchase.user.name}</p>
                      <p className="break-all text-sm text-[var(--muted)]">
                        {purchase.user.email}
                      </p>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        Compra {formatDate(purchase.updatedAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-[var(--muted)]">
                        {watched} de {totalLessons} aula
                        {totalLessons === 1 ? "" : "s"}
                      </p>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--accent-soft)]">
                        <div
                          className="h-full rounded-full bg-[var(--accent)]"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="card mt-4 hidden overflow-x-auto md:block">
              <table className="w-full min-w-[36rem] text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--line)] text-[var(--muted)]">
                    <th className="px-5 py-3 font-medium">Nome</th>
                    <th className="px-5 py-3 font-medium">E-mail</th>
                    <th className="px-5 py-3 font-medium">Compra</th>
                    <th className="px-5 py-3 font-medium">Progresso</th>
                  </tr>
                </thead>
                <tbody>
                  {paid.map((purchase) => {
                    const watched = watchedByUser.get(purchase.userId) ?? 0;
                    const percent =
                      totalLessons === 0
                        ? 0
                        : Math.round((watched / totalLessons) * 100);

                    return (
                      <tr
                        key={purchase.id}
                        className="border-b border-[var(--line)] last:border-b-0"
                      >
                        <td className="px-5 py-4 font-medium">{purchase.user.name}</td>
                        <td className="px-5 py-4 text-[var(--muted)]">
                          {purchase.user.email}
                        </td>
                        <td className="px-5 py-4 text-[var(--muted)]">
                          {formatDate(purchase.updatedAt)}
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-[var(--muted)]">
                            {watched}/{totalLessons}
                          </p>
                          <div className="mt-2 h-2 w-28 overflow-hidden rounded-full bg-[var(--accent-soft)]">
                            <div
                              className="h-full rounded-full bg-[var(--accent)]"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
