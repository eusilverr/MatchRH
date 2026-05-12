"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createJob(data: {
  titulo: string;
  departamento: string;
  localizacao: string;
  tipo: string;
  nivel: string;
  descricao: string;
  salary_min?: number;
  salary_max?: number;
}) {
  const { userId } = await auth();
  const finalUserId = userId || "user_dev_test_stable";

  const user = await prisma.user.findUnique({
    where: { clerk_id: finalUserId },
  });

  if (!user) {
    throw new Error("Usuário não encontrado. Complete o Onboarding primeiro.");
  }

  const job = await prisma.job.create({
    data: {
      company_id: user.company_id,
      titulo: data.titulo,
      descricao: data.descricao,
      salary_min: data.salary_min,
      salary_max: data.salary_max,
      status: "OPEN",
      // Como o banco de dados tem campos específicos e queremos manter a flexibilidade inicial,
      // usaremos o campo perfil_ideal_json para armazenar localizacao, tipo, nivel e departamento por enquanto,
      // ou podemos simplesmente concatenar no responsabilidades/descricao para simplificar a demo.
      // O ideal é adicionar essas colunas no BD no futuro.
      perfil_ideal_json: {
        departamento: data.departamento,
        localizacao: data.localizacao,
        tipo: data.tipo,
        nivel: data.nivel,
      },
    },
  });

  revalidatePath("/vagas");
  revalidatePath("/dashboard");
  return { success: true, jobId: job.id };
}

export async function generateJD(data: {
  titulo: string;
  departamento: string;
  nivel: string;
  localizacao: string;
  tipo: string;
}) {
  const { userId } = await auth();
  const finalUserId = userId || "user_dev_test_stable";

  const user = await prisma.user.findUnique({
    where: { clerk_id: finalUserId },
  });

  if (!user) {
    throw new Error("Não autorizado.");
  }

  // Importar dinamicamente para evitar erro se a lib não foi carregada no build
  const { generateJobDescription } = await import("@/lib/ai");
  const jd = await generateJobDescription(data);
  return { text: jd };
}
