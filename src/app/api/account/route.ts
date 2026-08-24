import { NextResponse } from "next/server";
import { compare, hash } from "bcryptjs";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getNameError } from "@/lib/name";
import { getPasswordError } from "@/lib/password";

const schema = z.object({
  name: z.string().min(2),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
});

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const name = parsed.data.name.trim();
    const nameError = getNameError(name);
    if (nameError) {
      return NextResponse.json({ error: nameError }, { status: 400 });
    }

    const currentPassword = parsed.data.currentPassword ?? "";
    const newPassword = parsed.data.newPassword ?? "";
    const changingPassword = Boolean(currentPassword || newPassword);

    if (changingPassword) {
      if (!currentPassword || !newPassword) {
        return NextResponse.json(
          { error: "Preencha a senha atual e a nova senha" },
          { status: 400 },
        );
      }

      const passwordError = getPasswordError(newPassword);
      if (passwordError) {
        return NextResponse.json({ error: passwordError }, { status: 400 });
      }
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    if (changingPassword) {
      const valid = await compare(currentPassword, user.passwordHash);
      if (!valid) {
        return NextResponse.json(
          { error: "Senha atual incorreta" },
          { status: 400 },
        );
      }
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        ...(changingPassword
          ? { passwordHash: await hash(newPassword, 10) }
          : {}),
      },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json({ user: updated });
  } catch {
    return NextResponse.json({ error: "Erro ao salvar" }, { status: 500 });
  }
}
