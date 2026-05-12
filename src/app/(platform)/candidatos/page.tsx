import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import CandidatosClient from "./CandidatosClient";

export default async function CandidatosPage() {
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
          candidates: {
            include: {
              job: true,
            },
            orderBy: { nome: "asc" },
          },
          jobs: {
            where: { status: "OPEN" },
            select: { id: true, titulo: true },
          },
        },
      },
    },
  });

  if (!user) {
    redirect("/onboarding");
  }

  const candidates = user.company.candidates.map((c) => ({
    id: c.id,
    nome: c.nome,
    email: c.email,
    linkedin_url: c.linkedin_url || "",
    cv_url: c.cv_url || "",
    jobTitulo: c.job?.titulo || "Sem vaga",
    jobId: c.job_id || "",
    test_completed: !!c.test_completed_at,
  }));

  const openJobs = user.company.jobs.map((j) => ({
    id: j.id,
    titulo: j.titulo,
  }));

  return <CandidatosClient initialCandidates={candidates} openJobs={openJobs} />;
}
