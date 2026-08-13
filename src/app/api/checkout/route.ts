import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createCheckoutPreference } from "@/lib/mercadopago";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { courseId } = await request.json();
    if (!courseId || typeof courseId !== "string") {
      return NextResponse.json({ error: "Curso inválido" }, { status: 400 });
    }

    const course = await prisma.course.findFirst({
      where: { id: courseId, published: true },
    });

    if (!course) {
      return NextResponse.json({ error: "Curso não encontrado" }, { status: 404 });
    }

    const existing = await prisma.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: course.id,
        },
      },
    });

    if (existing?.status === "PAID") {
      return NextResponse.json({ error: "Curso já adquirido" }, { status: 400 });
    }

    const purchase =
      existing ??
      (await prisma.purchase.create({
        data: {
          userId: session.user.id,
          courseId: course.id,
          amountCents: course.priceCents,
          status: "PENDING",
        },
      }));

    const preference = await createCheckoutPreference({
      purchaseId: purchase.id,
      courseTitle: course.title,
      amountCents: course.priceCents,
    });

    await prisma.purchase.update({
      where: { id: purchase.id },
      data: { mercadoPagoPreference: preference.id },
    });

    return NextResponse.json({
      checkoutUrl: preference.sandbox_init_point ?? preference.init_point,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao criar checkout. Verifique o Mercado Pago." },
      { status: 500 },
    );
  }
}
