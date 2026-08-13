import Image from "next/image";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/youtube";
import { BuyButton } from "@/components/buy-button";
import Link from "next/link";

export const dynamic = "force-dynamic";

const DEFAULT_COVER = "/images/curso-detalhe-v3.png";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const session = await auth();

  const course = await prisma.course.findFirst({
    where: { slug, published: true },
    include: {
      lessons: { orderBy: { order: "asc" }, select: { id: true, title: true, order: true } },
      teacher: { select: { name: true } },
    },
  });

  if (!course) notFound();

  const purchase = session?.user?.id
    ? await prisma.purchase.findUnique({
        where: {
          userId_courseId: {
            userId: session.user.id,
            courseId: course.id,
          },
        },
      })
    : null;

  const owned = purchase?.status === "PAID";
  const isTeacher =
    session?.user?.role === "TEACHER" || session?.user?.role === "ADMIN";

  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <p className="kicker">com {course.teacher.name}</p>
      <div className="relative mt-4 aspect-[16/9] overflow-hidden rounded-2xl bg-[var(--accent-soft)]">
        <Image
          src={DEFAULT_COVER}
          alt={course.title}
          fill
          className="object-cover object-[center_35%]"
          sizes="(max-width: 768px) 100vw, 42rem"
          quality={95}
          priority
        />
      </div>
      <h1 className="font-display mt-5 text-3xl text-[var(--accent)] md:text-4xl">
        {course.title}
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-[var(--muted)]">
        {course.description}
      </p>
      <p className="font-display mt-8 text-3xl">{formatPrice(course.priceCents)}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        {isTeacher ? (
          <>
            <Link href={`/minha-area/cursos/${course.slug}`} className="btn btn-primary">
              Assistir aulas
            </Link>
            <Link
              href={`/professora/cursos/${course.id}`}
              className="rounded-full border border-[var(--line)] px-5 py-3 text-sm"
            >
              Gerenciar
            </Link>
          </>
        ) : owned ? (
          <Link href={`/minha-area/cursos/${course.slug}`} className="btn btn-primary">
            Ir para as aulas
          </Link>
        ) : (
          <BuyButton courseId={course.id} />
        )}
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl">Conteúdo</h2>
        <ol className="mt-4 space-y-2">
          {course.lessons.map((lesson, index) => (
            <li key={lesson.id} className="card px-4 py-3">
              <span className="text-[var(--muted)]">{String(index + 1).padStart(2, "0")}</span>{" "}
              {lesson.title}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
