import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getPasswordError } from "@/lib/password";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const passwordError = getPasswordError(parsed.data.password);
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }

    const exists = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });

    if (exists) {
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 409 });
    }

    const passwordHash = await hash(parsed.data.password, 10);

    await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash,
        role: "STUDENT",
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erro ao cadastrar" }, { status: 500 });
  }
}
