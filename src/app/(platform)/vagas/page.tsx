import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import VagasClient from "./VagasClient";

export default async function VagasServerPage() {
  const { userId } = await auth();
  const finalUserId = userId || "user_dev_test_stable";

  if (!finalUserId && process.env.NODE_ENV === "production") {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { clerk_id: finalUserId },
    include: {
      company: {
        include: {
          jobs: {
            orderBy: { created_at: "desc" },
          },
          candidates: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/onboarding");
  }

  // Transformar os jobs do banco no formato que o Client espera
  const initialVagas = user.company.jobs.map((job) => {
    // Extrair os campos do JSON que usamos para tipagem flexível (ou default se não existir)
    const perfil = job.perfil_ideal_json as {
      departamento?: string;
      localizacao?: string;
      tipo?: string;
      nivel?: string;
    } | null;

    return {
      id: job.id,
      titulo: job.titulo,
      tipo: perfil?.tipo || "CLT",
      nivel: perfil?.nivel || "Pleno",
      localizacao: perfil?.localizacao || "Remoto",
      // Calculando dias abertos: se criado hoje, 0 dias
      diasAberta: Math.max(
        0,
        Math.floor(
          (new Date().getTime() - new Date(job.created_at).getTime()) /
            (1000 * 3600 * 24)
        )
      ),
      salaryMin: job.salary_min || 0,
      salaryMax: job.salary_max || 0,
      candidatos: 0, // Mock: não temos candidatos reais linkados ainda na query
      descricao: job.descricao || "",
      departamento: perfil?.departamento || "Geral",
      status: job.status,
    };
  });

  return <VagasClient initialVagas={initialVagas} />;
}
