import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  Briefcase,
  Users,
  ClipboardCheck,
  TrendingUp,
  ArrowUpRight,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default async function DashboardPage() {
  const { userId } = await auth();

  // ID ESTÁVEL PARA TESTE EM DESENVOLVIMENTO
  const finalUserId = userId || "user_dev_test_stable";

  if (!finalUserId && process.env.NODE_ENV === "production") {
    redirect("/sign-in");
  }

  // Buscar dados da empresa vinculada a este usuário
  const user = await prisma.user.findUnique({
    where: { clerk_id: finalUserId },
    include: {
      company: {
        include: {
          jobs: true,
          candidates: true,
          organograma_nodes: true,
          test_links: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/onboarding");
  }

  const company = user.company;

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-3xl font-bold text-white">{company.razao_social}</h1>
          <span className="rounded-full bg-[#3ecf8e]/10 px-3 py-1 text-xs font-semibold text-[#3ecf8e]">
            Ativo
          </span>
        </div>
        <p className="text-sm text-zinc-400">Painel de Controle de RH</p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Vagas Abertas"
          value={String(company.jobs.length)}
          icon={<Briefcase className="h-5 w-5" />}
          trend="+2 esta semana"
          color="text-[#3ecf8e]"
        />
        <StatCard
          label="Total Candidatos"
          value={String(company.candidates.length)}
          icon={<Users className="h-5 w-5" />}
          trend="+5 novos"
          color="text-blue-400"
        />
        <StatCard
          label="Testes Pendentes"
          value={String(company.test_links.filter((t) => !t.completed_at).length)}
          icon={<ClipboardCheck className="h-5 w-5" />}
          trend="aguardando"
          color="text-amber-400"
        />
        <StatCard
          label="Colaboradores"
          value={String(company.organograma_nodes.length)}
          icon={<TrendingUp className="h-5 w-5" />}
          trend="no organograma"
          color="text-purple-400"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Vagas Recentes */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Vagas Recentes</h2>
            <a
              href="/vagas"
              className="flex items-center gap-1 text-xs font-medium text-[#3ecf8e] hover:underline"
            >
              Ver todas
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>

          {company.jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-800 py-12">
              <Briefcase className="mb-3 h-10 w-10 text-zinc-700" />
              <p className="text-sm text-zinc-400">Nenhuma vaga criada ainda</p>
              <a
                href="/vagas"
                className="mt-3 rounded-lg bg-[#3ecf8e] px-4 py-2 text-xs font-semibold text-zinc-950 transition-colors hover:bg-[#34b279]"
              >
                Criar Primeira Vaga
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              {company.jobs.slice(0, 5).map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 transition-colors hover:border-zinc-700"
                >
                  <div>
                    <p className="font-medium text-white">{job.titulo}</p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      Criada em{" "}
                      {new Date(job.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase ${
                      job.status === "OPEN"
                        ? "bg-[#3ecf8e]/10 text-[#3ecf8e]"
                        : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {job.status === "OPEN" ? "Aberta" : job.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Atividade Recente */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-5 text-lg font-bold text-white">Atividade Recente</h2>
          <div className="space-y-4">
            <ActivityItem
              icon={<CheckCircle2 className="h-4 w-4 text-[#3ecf8e]" />}
              text="Onboarding concluído"
              time="agora"
            />
            <ActivityItem
              icon={<Users className="h-4 w-4 text-blue-400" />}
              text={`${company.organograma_nodes.length} colaborador(es) adicionados`}
              time="durante o onboarding"
            />
            <ActivityItem
              icon={<ClipboardCheck className="h-4 w-4 text-amber-400" />}
              text={`${company.test_links.length} link(s) de teste gerados`}
              time="durante o onboarding"
            />
            <ActivityItem
              icon={<Clock className="h-4 w-4 text-zinc-500" />}
              text="Empresa cadastrada"
              time={new Date(company.created_at).toLocaleDateString("pt-BR")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  trend,
  color,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-zinc-700">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          {label}
        </p>
        <div className="text-zinc-600">{icon}</div>
      </div>
      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
      <p className={`mt-1 text-xs ${color}`}>{trend}</p>
    </div>
  );
}

function ActivityItem({
  icon,
  text,
  time,
}: {
  icon: React.ReactNode;
  text: string;
  time: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-800">
        {icon}
      </div>
      <div>
        <p className="text-sm text-zinc-300">{text}</p>
        <p className="text-[11px] text-zinc-600">{time}</p>
      </div>
    </div>
  );
}
