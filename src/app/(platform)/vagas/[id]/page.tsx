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
            {job.departamento}
          </span>
          <span className="text-xs text-zinc-500 font-medium bg-zinc-900 border border-zinc-800 px-2.5 py-0.5 rounded-full">
            {job.nivel} • {job.tipo}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">{job.titulo}</h1>
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Briefcase className="h-4 w-4" />
          <span>Localização: {job.localizacao}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna da esquerda: Info da vaga */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
              Descrição da Vaga
            </h2>
            <div className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">
              {job.descricao || "Nenhuma descrição fornecida."}
            </div>
          </div>
        </div>

        {/* Coluna da direita: Ranking de candidatos */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
            <div className="border-b border-zinc-800 p-6 bg-zinc-950/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#3ecf8e]" />
                <h2 className="text-lg font-bold text-white">Ranking de Candidatos</h2>
              </div>
              <span className="text-xs font-medium text-zinc-500 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-full">
                {rankedCandidates.length} inscritos
              </span>
            </div>

            <div className="divide-y divide-zinc-800/50 p-6 space-y-4">
              {rankedCandidates.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-zinc-500 text-sm">Nenhum candidato nesta vaga ainda.</p>
                </div>
              ) : (
                rankedCandidates.map((c, index) => {
                  const report = c.match_reports[0];
                  const score = report?.match_score;
                  const hasTest = !!c.test_completed_at;

                  // Cores para o score
                  let scoreColor = "text-zinc-500";
                  let barColor = "bg-zinc-800";
                  if (score !== undefined) {
                    if (score >= 75) {
                      scoreColor = "text-[#3ecf8e]";
                      barColor = "bg-[#3ecf8e]";
                    } else if (score >= 50) {
                      scoreColor = "text-amber-400";
                      barColor = "bg-amber-400";
                    } else {
                      scoreColor = "text-red-400";
                      barColor = "bg-red-400";
                    }
                  }

                  return (
                    <div key={c.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-zinc-800/50 bg-zinc-950 hover:border-zinc-700 transition-colors">
                      <div className="font-bold text-zinc-600 text-lg w-6">
                        #{index + 1}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-white">{c.nome}</h3>
                        <p className="text-xs text-zinc-500">{c.email}</p>
                      </div>

                      <div className="sm:w-64">
                        {hasTest ? (
                          report ? (
                            <div className="space-y-1.5">
                              <div className="flex justify-between items-end">
                                <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1">
                                  <Zap className="h-3 w-3 text-[#3ecf8e]" />
                                  Match Score
                                </span>
                                <span className={`text-lg font-bold ${scoreColor}`}>
                                  {score}%
                                </span>
                              </div>
                              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${barColor}`} 
                                  style={{ width: \`\${score}%\` }}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-2 rounded-lg text-center font-medium">
                              Calculando Score... (Atualize a página em breve)
                            </div>
                          )
                        ) : (
                          <div className="text-xs text-zinc-500 bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-lg text-center">
                            Aguardando o candidato concluir o teste
                          </div>
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
