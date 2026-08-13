import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ pagamento?: string }>;
};

export default async function StudentAreaPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const params = await searchParams;

  const purchases = await prisma.purchase.findMany({
    where: { userId: session.user.id, status: "PAID" },
    include: {
      course: {
        include: { _count: { select: { lessons: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="shell py-16">
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

      <section className="mt-10">
        <h2 className="font-display text-2xl">Meu curso</h2>
        {purchases.length === 0 ? (
          <p className="mt-4 text-[var(--muted)]">
            Você ainda não tem o curso.{" "}
            <Link href="/cursos" className="text-[var(--accent)]">
              Ver o curso
            </Link>
          </p>
        ) : (
          <ul className="mt-5 grid gap-4 md:grid-cols-2">
            {purchases.map((purchase) => (
              <li key={purchase.id} className="card p-6">
                <h3 className="font-display text-xl">{purchase.course.title}</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {purchase.course._count.lessons} aulas
                </p>
                <Link
                  href={`/minha-area/cursos/${purchase.course.slug}`}
                  className="mt-4 inline-block text-[var(--accent)]"
                >
                  Assistir →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
