"use client";

import { useState, useTransition } from "react";
import {
  Users,
  Plus,
  Search,
  ExternalLink,
  FileText,
  CheckCircle2,
  Clock,
  X,
  Loader2,
  Briefcase,
  Send,
} from "lucide-react";
import { createCandidate } from "./actions";
import { SendTestModal } from "@/components/candidatos/SendTestModal";

type Candidate = {
  id: string;
  nome: string;
  email: string;
  linkedin_url: string;
  cv_url: string;
  jobTitulo: string;
  jobId: string;
  test_completed: boolean;
};

type Job = {
  id: string;
  titulo: string;
};

function AddCandidateModal({
  isOpen,
  onClose,
  openJobs,
}: {
  isOpen: boolean;
  onClose: () => void;
  openJobs: Job[];
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await createCandidate({
          nome: fd.get("nome") as string,
          email: fd.get("email") as string,
          linkedin_url: fd.get("linkedin_url") as string,
          jobId: fd.get("jobId") as string,
        });
        onClose();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Erro ao cadastrar candidato.");
      }
    });
  }

  const inputClass =
    "flex h-10 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#3ecf8e]/50 focus:border-[#3ecf8e]/50 transition-all";
  const labelClass = "text-sm font-medium text-zinc-300";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-white">Adicionar Candidato</h2>
            <p className="text-sm text-zinc-400">Preencha os dados básicos do candidato.</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className={labelClass}>Nome Completo</label>
            <input required name="nome" placeholder="Ex: João da Silva" className={inputClass} />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>E-mail</label>
            <input required type="email" name="email" placeholder="joao@email.com" className={inputClass} />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>LinkedIn (opcional)</label>
            <input name="linkedin_url" placeholder="https://linkedin.com/in/joaosilva" className={inputClass} />
          </div>

          {openJobs.length > 0 && (
            <div className="space-y-1.5">
              <label className={labelClass}>Vincular à Vaga</label>
              <select name="jobId" className={`${inputClass} appearance-none`}>
                <option value="">Sem vaga definida</option>
                {openJobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.titulo}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-zinc-800 pt-5 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 rounded-lg bg-[#3ecf8e] px-6 py-2.5 text-sm font-bold text-zinc-950 shadow-lg shadow-[#3ecf8e]/20 transition-all hover:bg-[#34b279] active:scale-[0.98] disabled:opacity-50"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CandidatosClient({
  initialCandidates,
  openJobs,
}: {
  initialCandidates: Candidate[];
  openJobs: Job[];
}) {
  const [busca, setBusca] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testModalCandidate, setTestModalCandidate] = useState<{ id: string; nome: string; jobId: string } | null>(null);

  const filtrados = initialCandidates.filter(
    (c) =>
      busca === "" ||
      c.nome.toLowerCase().includes(busca.toLowerCase()) ||
      c.email.toLowerCase().includes(busca.toLowerCase()) ||
      c.jobTitulo.toLowerCase().includes(busca.toLowerCase())
  );

  const total = initialCandidates.length;
  const comTeste = initialCandidates.filter((c) => c.test_completed).length;
  const semTeste = total - comTeste;

  return (
    <div className="min-h-screen p-8">
      <AddCandidateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        openJobs={openJobs}
      />
      <SendTestModal
        isOpen={!!testModalCandidate}
        onClose={() => setTestModalCandidate(null)}
        candidate={testModalCandidate}
      />

      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Candidatos</h1>
          <p className="mt-1 text-sm text-zinc-400">Gerencie os candidatos das suas vagas abertas.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-[#3ecf8e] px-5 py-2.5 text-sm font-semibold text-zinc-950 shadow-lg shadow-[#3ecf8e]/20 transition-all hover:bg-[#34b279] active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Novo Candidato
        </button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Total</p>
            <Users className="h-4 w-4 text-zinc-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{total}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Teste Concluído</p>
            <CheckCircle2 className="h-4 w-4 text-[#3ecf8e]" />
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{comTeste}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Aguardando Teste</p>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{semTeste}</p>
        </div>
      </div>

      {/* Tabela */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Lista de Candidatos</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Buscar candidato..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 py-2 pl-9 pr-4 text-sm text-white placeholder:text-zinc-600 focus:border-[#3ecf8e]/50 focus:outline-none focus:ring-1 focus:ring-[#3ecf8e]/20"
            />
          </div>
        </div>

        {filtrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-800 py-12">
            <Users className="mb-3 h-10 w-10 text-zinc-700" />
            <p className="text-sm text-zinc-400">
              {busca ? "Nenhum candidato encontrado para esta busca." : "Nenhum candidato cadastrado ainda."}
            </p>
            {!busca && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 rounded-lg bg-[#3ecf8e] px-4 py-2 text-xs font-semibold text-zinc-950 transition-colors hover:bg-[#34b279]"
              >
                Adicionar Primeiro Candidato
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-800 text-xs font-medium uppercase text-zinc-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Candidato</th>
                  <th className="px-4 py-3 font-medium">Vaga</th>
                  <th className="px-4 py-3 font-medium">Links</th>
                  <th className="px-4 py-3 font-medium text-right">Teste</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {filtrados.map((c) => (
                  <tr key={c.id} className="group transition-colors hover:bg-zinc-950/50">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-white">{c.nome}</p>
                      <p className="mt-0.5 text-xs text-zinc-500">{c.email}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <div className="flex items-center gap-1.5 text-zinc-400">
                        <Briefcase className="h-3.5 w-3.5 text-zinc-600" />
                        <span className="text-xs">{c.jobTitulo}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {c.linkedin_url && (
                          <a
                            href={c.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-md p-1.5 text-zinc-500 hover:bg-blue-500/10 hover:text-blue-400 transition-colors"
                            title="Ver LinkedIn"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {c.cv_url && (
                          <a
                            href={c.cv_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-700 hover:text-zinc-200 transition-colors"
                            title="Ver Currículo"
                          >
                            <FileText className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {!c.linkedin_url && !c.cv_url && (
                          <span className="text-xs text-zinc-700">—</span>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-right">
                      {c.test_completed ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#3ecf8e]/10 px-2.5 py-1 text-[11px] font-bold uppercase text-[#3ecf8e]">
                          <CheckCircle2 className="h-3 w-3" /> Concluído
                        </span>
                      ) : (
                        <button
                          onClick={() => setTestModalCandidate({ id: c.id, nome: c.nome, jobId: c.jobId })}
                          className="inline-flex items-center gap-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition-colors"
                        >
                          <Send className="h-3.5 w-3.5" /> Enviar Teste
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
