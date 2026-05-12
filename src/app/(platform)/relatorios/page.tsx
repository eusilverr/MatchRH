import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import RelatoriosClient from "./RelatoriosClient";

export const metadata = {
  title: "Relatórios | MatchRH",
};

export default async function RelatoriosPage() {
  const { userId } = await auth();
  const finalUserId = userId || "user_dev_test_stable";

  const user = await prisma.user.findUnique({
    where: { clerk_id: finalUserId },
  });

  if (!user) {
    redirect("/sign-in");
  }

  // Buscar dados consolidados do banco
  const companyId = user.company_id;

  const [totalVagas, vagasAbertas, totalCandidatos, testesLinks] = await Promise.all([
    prisma.job.count({ where: { company_id: companyId } }),
    prisma.job.count({ where: { company_id: companyId, status: "OPEN" } }),
    prisma.candidate.count({ where: { company_id: companyId } }),
    prisma.testLink.findMany({
      where: { company_id: companyId, type: "candidate" },
      select: { completed_at: true }
    })
  ]);

  const testesConcluidos = testesLinks.filter(t => t.completed_at !== null).length;
  // Pendentes são os links que não foram concluídos. Se não tem link, não entra na conta.
  // Mas para o resumo, podemos simplificar dizendo que pendentes são os candidatos que não tem teste concluído.
  const candidatosComTesteConcluido = await prisma.candidate.count({
    where: { company_id: companyId, test_completed_at: { not: null } }
  });
  const candidatosSemTesteConcluido = totalCandidatos - candidatosComTesteConcluido;

  const relatoriosData = {
    totalVagas,
    vagasAbertas,
    totalCandidatos,
    testesConcluidos: candidatosComTesteConcluido,
    testesPendentes: candidatosSemTesteConcluido,
  };

  return <RelatoriosClient data={relatoriosData} />;
}
