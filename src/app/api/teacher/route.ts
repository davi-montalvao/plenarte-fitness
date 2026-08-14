import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const courseSchema = z.object({
  title: z.string().min(3),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, "Use apenas letras minúsculas, números e hífen"),
  description: z.string().min(10),
  priceCents: z.number().int().positive(),
  published: z.boolean().optional(),
});

const courseUpdateSchema = courseSchema.extend({
  id: z.string(),
  coverUrl: z.string().nullable().optional(),
  published: z.boolean(),
});

const lessonSchema = z.object({
  courseId: z.string(),
  title: z.string().min(2),
  description: z.string().optional(),
  youtubeUrl: z.string().url(),
  order: z.number().int().nonnegative().optional(),
});

const lessonUpdateSchema = z.object({
  id: z.string(),
  title: z.string().min(2),
  description: z.string().optional(),
  youtubeUrl: z.string().url(),
  order: z.number().int().nonnegative().optional(),
});

async function requireTeacher() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) {
    return null;
  }
  return session;
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const body = await request.json();
  const type = body?.type;

  if (type === "course") {
    const parsed = courseSchema.safeParse(body.data);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const course = await prisma.course.create({
      data: {
        ...parsed.data,
        published: parsed.data.published ?? false,
        teacherId: session.user.id,
      },
    });

    return NextResponse.json({ course });
  }

  if (type === "lesson") {
    const parsed = lessonSchema.safeParse(body.data);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const course = await prisma.course.findFirst({
      where: { id: parsed.data.courseId },
    });

    if (!course) {
      return NextResponse.json({ error: "Curso não encontrado" }, { status: 404 });
    }

    const lesson = await prisma.lesson.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        youtubeUrl: parsed.data.youtubeUrl,
        order: parsed.data.order ?? 0,
        courseId: course.id,
      },
    });

    return NextResponse.json({ lesson });
  }

  return NextResponse.json({ error: "Tipo inválido" }, { status: 400 });
}

export async function PATCH(request: Request) {
  const session = await requireTeacher();
  if (!session) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const body = await request.json();

  if (body?.type === "course") {
    const parsed = courseUpdateSchema.safeParse(body.data);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const existing = await prisma.course.findFirst({
      where: { id: parsed.data.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Curso não encontrado" }, { status: 404 });
    }

    const slugTaken = await prisma.course.findFirst({
      where: {
        slug: parsed.data.slug,
        NOT: { id: parsed.data.id },
      },
      select: { id: true },
    });

    if (slugTaken) {
      return NextResponse.json({ error: "Slug já em uso" }, { status: 409 });
    }

    const { id, ...data } = parsed.data;
    const course = await prisma.course.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        priceCents: data.priceCents,
        coverUrl: data.coverUrl ?? null,
        published: data.published,
      },
    });

    return NextResponse.json({ course });
  }

  if (body?.type !== "lesson") {
    return NextResponse.json({ error: "Tipo inválido" }, { status: 400 });
  }

  const parsed = lessonUpdateSchema.safeParse(body.data);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.lesson.findFirst({
    where: { id: parsed.data.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Aula não encontrada" }, { status: 404 });
  }

  const { id, ...data } = parsed.data;
  const lesson = await prisma.lesson.update({
    where: { id },
    data,
  });

  return NextResponse.json({ lesson });
}

export async function DELETE(request: Request) {
  const session = await requireTeacher();
  if (!session) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const body = await request.json();
  const lessonId = body?.data?.id;
  if (typeof lessonId !== "string") {
    return NextResponse.json({ error: "Aula inválida" }, { status: 400 });
  }

  const existing = await prisma.lesson.findFirst({
    where: { id: lessonId },
  });

  if (!existing) {
    return NextResponse.json({ error: "Aula não encontrada" }, { status: 404 });
  }

  await prisma.lesson.delete({ where: { id: lessonId } });
  return NextResponse.json({ ok: true });
}

