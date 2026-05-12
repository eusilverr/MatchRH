import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ArrowLeft, Users, Zap, Briefcase } from "lucide-react";
import Link from "next/link";

export default async function VagaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = await auth();
  const finalUserId = userId || "user_dev_test_stable";

  const user = await prisma.user.findUnique({
    where: { clerk_id: finalUserId },
  });

  if (!user) {
    redirect("/sign-in");
  }

  const job = await prisma.job.findUnique({
    where: { id, company_id: user.company_id },
    include: {
      candidates: {
        include: {
          match_reports: {
            where: { job_id: id },
            orderBy: { created_at: "desc" },
            take: 1,
          },
        },
      },
    },
  });

  if (!job) {
    redirect("/vagas");
  }

  // Ordenar candidatos por match_score (decrescente) e depois por nome
  const rankedCandidates = [...job.candidates].sort((a, b) => {
    const scoreA = a.match_reports[0]?.match_score || 0;
    const scoreB = b.match_reports[0]?.match_score || 0;
    if (scoreA !== scoreB) return scoreB - scoreA;
    return a.nome.localeCompare(b.nome);
  });

  return (
    <div className="min-h-screen p-8">
      <Link href="/vagas" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" />
        Voltar para Vagas
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="inline-flex items-center rounded-full bg-[#3ecf8e]/10 px-2.5 py-0.5 text-xs font-semibold text-[#3ecf8e]">
            {job.titulo}
          </span>
          <span className="text-xs text-zinc-500 font-medium bg-zinc-900 border border-zinc-800 px-2.5 py-0.5 rounded-full">
            Status: {job.status}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">{job.titulo}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Descrição</h2>
            <div className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">
              {job.descricao || "Sem descrição."}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
            <div className="border-b border-zinc-800 p-6 bg-zinc-950/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#3ecf8e]" />
                <h2 className="text-lg font-bold text-white">Candidatos ({rankedCandidates.length})</h2>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {rankedCandidates.length === 0 ? (
                <p className="text-center py-8 text-zinc-500">Nenhum candidato.</p>
              ) : (
                rankedCandidates.map((c, index) => {
                  const report = c.match_reports[0];
                  const score = report?.match_score || 0;
                  const hasTest = !!c.test_completed_at;

                  return (
                    <div key={c.id} className="flex items-center gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-950">
                      <span className="text-zinc-600 font-bold w-6">#{index + 1}</span>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-white">{c.nome}</h3>
                        <p className="text-xs text-zinc-500">{c.email}</p>
                      </div>
                      <div className="w-48">
                        {hasTest ? (
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px]">
                              <span className="text-zinc-400">Match Score</span>
                              <span className="text-[#3ecf8e] font-bold">{score}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                              <div className="h-full bg-[#3ecf8e]" style={{ width: `${score}%` }} />
                            </div>
                          </div>
                        ) : (
                          <span className="text-[10px] text-zinc-500">Teste pendente</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
