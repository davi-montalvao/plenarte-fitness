import "dotenv/config";
import { hash } from "bcryptjs";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hash("professora123", 10);

  const teacher = await prisma.user.upsert({
    where: { email: "professora@plenarte.com" },
    update: {},
    create: {
      name: "Professora Plenarte",
      email: "professora@plenarte.com",
      passwordHash,
      role: Role.TEACHER,
    },
  });

  const course = await prisma.course.upsert({
    where: { slug: "ballet-fitness-fundamentos" },
    update: {
      coverUrl: "/images/ballet-fitness-movimento.png",
      priceCents: 1,
    },
    create: {
      title: "Ballet Fitness — Fundamentos",
      slug: "ballet-fitness-fundamentos",
      description:
        "Treino de ballet fitness para mulheres adultas. Mesma sequência, você ajusta a carga e a intensidade no seu ritmo.",
      priceCents: 1,
      coverUrl: "/images/ballet-fitness-movimento.png",
      published: true,
      teacherId: teacher.id,
      lessons: {
        create: [
          {
            title: "Aquecimento e postura",
            description: "Preparação do corpo e alinhamento.",
            youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            order: 1,
          },
          {
            title: "Sequência fitness completa",
            description: "Treino principal — ajuste a carga conforme seu condicionamento.",
            youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            order: 2,
          },
        ],
      },
    },
  });

  console.log("Seed OK");
  console.log("Professora: professora@plenarte.com / professora123");
  console.log("Curso:", course.slug);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
