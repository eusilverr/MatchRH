"use client";

import { useState, useTransition, useRef } from "react";
import { Plus, X, Loader2, Sparkles } from "lucide-react";
import { createJob, generateJD } from "@/app/(platform)/vagas/actions";

export function CreateJobModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [descricao, setDescricao] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const data = {
      titulo: formData.get("titulo") as string,
      departamento: formData.get("departamento") as string,
      localizacao: formData.get("localizacao") as string,
      tipo: formData.get("tipo") as string,
      nivel: formData.get("nivel") as string,
      descricao: formData.get("descricao") as string,
      salary_min: Number(formData.get("salary_min")) || undefined,
      salary_max: Number(formData.get("salary_max")) || undefined,
    };

    startTransition(async () => {
      try {
        await createJob(data);
        setDescricao(""); // reset after success
        onClose();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Erro ao criar vaga.");
      }
    });
  }

  async function handleGenerateIA() {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    
    const titulo = formData.get("titulo") as string;
    const departamento = formData.get("departamento") as string;
    const nivel = formData.get("nivel") as string;
    const localizacao = formData.get("localizacao") as string;
    const tipo = formData.get("tipo") as string;

    if (!titulo || !departamento) {
      setError("Preencha Título e Departamento antes de usar a IA.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    try {
      const res = await generateJD({ titulo, departamento, nivel, localizacao, tipo });
      setDescricao(res.text);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao gerar descrição com IA.");
    } finally {
      setIsGenerating(false);
    }
  }

  const inputClass =
    "flex h-10 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#3ecf8e]/50 focus:border-[#3ecf8e]/50 transition-all";
  const labelClass = "text-sm font-medium text-zinc-300";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-white">Criar Nova Vaga</h2>
            <p className="text-sm text-zinc-400">Preencha os detalhes iniciais da oportunidade.</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className={labelClass}>Título da Vaga</label>
                <input required name="titulo" placeholder="Ex: Desenvolvedor Front-end" className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Departamento</label>
                <input required name="departamento" placeholder="Ex: Engenharia" className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className={labelClass}>Nível</label>
                <select required name="nivel" className={`${inputClass} appearance-none`}>
                  <option value="Júnior">Júnior</option>
                  <option value="Pleno">Pleno</option>
                  <option value="Sênior">Sênior</option>
                  <option value="Especialista">Especialista</option>
                  <option value="Liderança">Liderança</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Tipo de Contrato</label>
                <select required name="tipo" className={`${inputClass} appearance-none`}>
                  <option value="CLT">CLT</option>
                  <option value="PJ">PJ</option>
                  <option value="Estágio">Estágio</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Localização</label>
                <input required name="localizacao" placeholder="Ex: Remoto, São Paulo..." className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className={labelClass}>Salário Mínimo (R$)</label>
                <input type="number" name="salary_min" placeholder="5000" className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Salário Máximo (R$)</label>
                <input type="number" name="salary_max" placeholder="8000" className={inputClass} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className={labelClass}>Descrição Breve</label>
                <button
                  type="button"
                  onClick={handleGenerateIA}
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#3ecf8e] hover:text-[#34b279] transition-colors disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                  {isGenerating ? "Gerando..." : "Gerar com IA"}
                </button>
              </div>
              <textarea
                required
                name="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Qual o objetivo desta posição? Descreva resumidamente..."
                className={`${inputClass} min-h-[100px] resize-y py-3`}
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t border-zinc-800 pt-5">
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
              Criar Vaga
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
