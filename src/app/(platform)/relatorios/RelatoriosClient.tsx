"use client";

import { BarChart, Briefcase, Users, ClipboardCheck, TrendingUp } from "lucide-react";

type RelatoriosProps = {
  totalVagas: number;
  vagasAbertas: number;
  totalCandidatos: number;
  testesConcluidos: number;
  testesPendentes: number;
};

export default function RelatoriosClient({ data }: { data: RelatoriosProps }) {
  const taxaConclusao = data.totalCandidatos > 0 
    ? Math.round((data.testesConcluidos / data.totalCandidatos) * 100) 
    : 0;

  return (
    <div className="min-h-screen p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <BarChart className="h-8 w-8 text-[#3ecf8e]" />
          Relatórios
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Visão geral do desempenho da sua operação de RH
        </p>
      </div>

      {/* Cards Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total de Vagas</h3>
            <Briefcase className="h-5 w-5 text-zinc-500" />
          </div>
          <div className="text-3xl font-bold text-white">{data.totalVagas}</div>
          <div className="mt-2 text-xs font-medium text-[#3ecf8e]">
            {data.vagasAbertas} vagas abertas
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Candidatos Base</h3>
            <Users className="h-5 w-5 text-zinc-500" />
          </div>
          <div className="text-3xl font-bold text-white">{data.totalCandidatos}</div>
          <div className="mt-2 text-xs font-medium text-zinc-500">
            Cadastrados no sistema
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Testes Concluídos</h3>
            <ClipboardCheck className="h-5 w-5 text-zinc-500" />
          </div>
          <div className="text-3xl font-bold text-white">{data.testesConcluidos}</div>
          <div className="mt-2 text-xs font-medium text-amber-400">
            {data.testesPendentes} pendentes
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Engajamento</h3>
            <TrendingUp className="h-5 w-5 text-zinc-500" />
          </div>
          <div className="text-3xl font-bold text-white">{taxaConclusao}%</div>
          <div className="mt-2 text-xs font-medium text-zinc-500">
            Taxa de conclusão de testes
          </div>
        </div>
      </div>

      {/* Gráficos / Barras de Progresso */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Status das Vagas</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-medium text-zinc-400 mb-1">
                <span>Abertas</span>
                <span>{data.vagasAbertas}</span>
              </div>
              <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#3ecf8e]" 
                  style={{ width: data.totalVagas > 0 ? ((data.vagasAbertas / data.totalVagas) * 100) + '%' : '0%' }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-medium text-zinc-400 mb-1">
                <span>Fechadas</span>
                <span>{data.totalVagas - data.vagasAbertas}</span>
              </div>
              <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-zinc-500" 
                  style={{ width: data.totalVagas > 0 ? (((data.totalVagas - data.vagasAbertas) / data.totalVagas) * 100) + '%' : '0%' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Funil de Testes</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-medium text-zinc-400 mb-1">
                <span>Concluídos</span>
                <span>{data.testesConcluidos}</span>
              </div>
              <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#3ecf8e]" 
                  style={{ width: taxaConclusao + '%' }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-medium text-zinc-400 mb-1">
                <span>Pendentes</span>
                <span>{data.testesPendentes}</span>
              </div>
              <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-400" 
                  style={{ width: data.totalCandidatos > 0 ? ((data.testesPendentes / data.totalCandidatos) * 100) + '%' : '0%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
