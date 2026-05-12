"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  ChevronRight,
  Building2,
  TrendingUp,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { CreateJobModal } from "@/components/vagas/CreateJobModal";

const FILTROS = ["Todas", "Júnior", "Pleno", "Sênior"];

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });
}

export type VagaProps = {
  id: string;
  titulo: string;
  tipo: string;
  nivel: string;
  localizacao: string;
  diasAberta: number;
  salaryMin: number;
  salaryMax: number;
  candidatos: number;
  descricao: string;
  departamento: string;
  status: string;
};

export default function VagasClient({ initialVagas }: { initialVagas: VagaProps[] }) {
  const [filtroAtivo, setFiltroAtivo] = useState("Todas");
  const [busca, setBusca] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const vagasFiltradas = initialVagas.filter((vaga) => {
    const matchFiltro = filtroAtivo === "Todas" || vaga.nivel === filtroAtivo;
    const matchBusca =
      busca === "" ||
      vaga.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      vaga.departamento.toLowerCase().includes(busca.toLowerCase());
    return matchFiltro && matchBusca;
  });

  return (
    <div className="min-h-screen p-8">
      <CreateJobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Page Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Vagas</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Gerencie todas as vagas da sua empresa
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-[#3ecf8e] px-5 py-2.5 text-sm font-semibold text-zinc-950 shadow-lg shadow-[#3ecf8e]/20 transition-all hover:bg-[#34b279] hover:shadow-[#3ecf8e]/30 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Nova Vaga
        </button>
      </div>

      {/* Stats Row */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Vagas Abertas", value: "6", icon: Briefcase, change: "+2 esta semana" },
          { label: "Total Candidatos", value: "101", icon: TrendingUp, change: "+23 esta semana" },
          { label: "Em Processo", value: "34", icon: Clock, change: "12 entrevistas" },
          { label: "Contratações", value: "8", icon: Building2, change: "este mês" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-zinc-700"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                {stat.label}
              </p>
              <stat.icon className="h-4 w-4 text-zinc-600" />
            </div>
            <p className="mt-2 text-2xl font-bold text-white">{stat.value}</p>
            <p className="mt-1 text-xs text-[#3ecf8e]">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar vaga por título ou departamento..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 outline-none transition-colors focus:border-[#3ecf8e]/50 focus:ring-1 focus:ring-[#3ecf8e]/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="mr-1 h-4 w-4 text-zinc-500" />
          {FILTROS.map((filtro) => (
            <button
              key={filtro}
              onClick={() => setFiltroAtivo(filtro)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                filtroAtivo === filtro
                  ? "bg-[#3ecf8e] text-zinc-950 font-bold shadow-md shadow-[#3ecf8e]/20"
                  : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-600"
              }`}
            >
              {filtro}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="mb-4 text-xs text-zinc-500">
        {vagasFiltradas.length} vaga{vagasFiltradas.length !== 1 ? "s" : ""} encontrada{vagasFiltradas.length !== 1 ? "s" : ""}
      </p>

      {/* Job Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {vagasFiltradas.map((vaga) => (
          <div
            key={vaga.id}
            className="group flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition-all duration-200 hover:border-zinc-600 hover:shadow-xl hover:shadow-black/20"
          >
            {/* Card Header */}
            <div className="mb-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="inline-flex items-center rounded-full bg-[#3ecf8e]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#3ecf8e]">
                  {vaga.departamento}
                </span>
                <span className="text-[11px] text-zinc-500">
                  {vaga.candidatos} candidatos
                </span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-[#3ecf8e] transition-colors">
                {vaga.titulo}
              </h3>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-400">
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />
                  {vaga.tipo} • {vaga.nivel}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {vaga.localizacao}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Há {vaga.diasAberta} dia{vaga.diasAberta !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-5 flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-2">
                Sobre a posição
              </p>
              <p className="text-sm leading-relaxed text-zinc-400 line-clamp-3">
                {vaga.descricao}
              </p>
            </div>

            {/* Salary + CTA */}
            <div className="border-t border-zinc-800 pt-4">
              <div className="mb-4 flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 text-[#3ecf8e]" />
                <span className="text-sm font-semibold text-white">
                  {formatCurrency(vaga.salaryMin)} — {formatCurrency(vaga.salaryMax)}
                </span>
              </div>
              <Link href={`/vagas/${vaga.id}`} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#3ecf8e] py-2.5 text-sm font-semibold text-zinc-950 transition-all hover:bg-[#34b279] active:scale-[0.98]">
                Ver Detalhes
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {vagasFiltradas.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-800 py-16">
          <Briefcase className="mb-4 h-12 w-12 text-zinc-700" />
          <p className="text-sm font-medium text-zinc-400">
            Nenhuma vaga encontrada
          </p>
          <p className="mt-1 text-xs text-zinc-600">
            Tente ajustar os filtros ou busque por outro termo
          </p>
        </div>
      )}
    </div>
  );
}
