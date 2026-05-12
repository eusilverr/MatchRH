"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Building2, Network, Users, Sparkles, ChevronRight, ChevronLeft,
  Loader2, Check, Copy, Plus, X,
} from "lucide-react";
import { OrgChart, type OrgNodeExport } from "./OrgChart";
import {
  createCompany, saveOrganograma, generateTestLinks, saveContextoValores, completeOnboarding,
} from "@/app/onboarding/actions";

// ─── Schemas ────────────────────────────────
const companySchema = z.object({
  razao_social: z.string().min(3, "Razão social deve ter no mínimo 3 caracteres"),
  cnpj: z.string().length(14, "CNPJ deve ter 14 dígitos (apenas números)"),
  cep: z.string()
    .transform((val) => val.replace(/\D/g, ""))
    .pipe(z.string().length(8, "CEP deve ter 8 dígitos")),
  logradouro: z.string().min(1, "Obrigatório"),
  numero: z.string().min(1, "Obrigatório"),
  bairro: z.string().min(1, "Obrigatório"),
  cidade: z.string().min(1, "Obrigatório"),
  uf: z.string().length(2, "UF inválida"),
});

type CompanyFormData = z.infer<typeof companySchema>;

const steps = [
  { icon: Building2, label: "Dados da Empresa" },
  { icon: Network, label: "Organograma" },
  { icon: Users, label: "Colaboradores" },
  { icon: Sparkles, label: "Contexto & Valores" },
];

export function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [orgNodes, setOrgNodes] = useState<OrgNodeExport[]>([]);
  const [emails, setEmails] = useState<string[]>([""]);
  const [generatedLinks, setGeneratedLinks] = useState<{ email: string; url: string }[]>([]);
  const [contexto, setContexto] = useState("");
  const [ritmo, setRitmo] = useState("");
  const [valores, setValores] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: { razao_social: "", cnpj: "", cep: "", logradouro: "", numero: "", bairro: "", cidade: "", uf: "" },
  });

  const { register, handleSubmit, setValue, formState: { errors } } = form;

  const fetchCep = async (cep: string) => {
    const clean = cep.replace(/\D/g, "");
    if (clean.length === 8) {
      setValue("cep", clean);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setValue("logradouro", data.logradouro);
          setValue("bairro", data.bairro);
          setValue("cidade", data.localidade);
          setValue("uf", data.uf);
        }
      } catch (e) { console.error("Erro ao buscar CEP", e); }
    }
  };

  const onSubmitStep1 = (data: CompanyFormData) => {
    setError(null);
    startTransition(async () => {
      try {
        const result = await createCompany(data);
        setCompanyId(result.companyId);
        setStep(2);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Erro ao salvar empresa");
      }
    });
  };

  const onSubmitStep2 = () => {
    if (!companyId) return;
    setError(null);
    startTransition(async () => {
      try {
        await saveOrganograma(companyId, orgNodes.map((n) => ({
          id: n.id, nome: n.nome, cargo: n.cargo,
          departamento: n.departamento || undefined,
          parentId: n.parentId, email: n.email || undefined,
        })));
        setStep(3);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Erro ao salvar organograma");
      }
    });
  };

  const onSubmitStep3 = () => {
    if (!companyId) return;
    const validEmails = emails.filter((e) => e.includes("@"));
    if (validEmails.length === 0) { setStep(4); return; }
    setError(null);
    startTransition(async () => {
      try {
        const result = await generateTestLinks(companyId, validEmails);
        setGeneratedLinks(result.links.map((l) => ({ email: l.email, url: l.url })));
        setStep(4);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Erro ao gerar links");
      }
    });
  };

  const onSubmitStep4 = () => {
    if (!companyId) return;
    setError(null);
    startTransition(async () => {
      try {
        await saveContextoValores(companyId, {
          contexto_empresa: contexto, perfil_ritmo: ritmo, valores,
        });
        await completeOnboarding();
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Erro ao finalizar");
      }
    });
  };

  const inputClass = "flex h-10 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#3ecf8e]/50 focus:border-[#3ecf8e]/50 transition-all";
  const labelClass = "text-sm font-medium text-zinc-300";
  const cardClass = "border border-zinc-800 shadow-2xl shadow-black/40 bg-zinc-900";
  const primaryBtnClass = "bg-[#3ecf8e] hover:bg-[#34b279] text-zinc-950 font-bold gap-2 px-6 transition-all";
  const secondaryBtnClass = "bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700 gap-2";

  return (
    <div className="space-y-8">
      {/* Step Indicators */}
      <div className="flex items-center justify-between mb-2">
        {steps.map((s, i) => {
          const StepIcon = s.icon;
          const isActive = i + 1 === step;
          const isComplete = i + 1 < step;
          return (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                isComplete ? "bg-[#3ecf8e] text-zinc-950" : isActive ? "bg-[#3ecf8e] text-zinc-950 shadow-lg shadow-[#3ecf8e]/20 scale-110 font-bold" : "bg-zinc-900 border border-zinc-800 text-zinc-500"
              }`}>
                {isComplete ? <Check className="w-5 h-5" strokeWidth={3} /> : <StepIcon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />}
              </div>
              <span className={`text-xs hidden md:block ${isActive ? "text-[#3ecf8e] font-bold" : "text-zinc-500 font-medium"}`}>
                {s.label}
              </span>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 rounded ${isComplete ? "bg-[#3ecf8e]" : "bg-zinc-800"}`} />
              )}
            </div>
          );
        })}
      </div>

      <Progress value={step * 25} className="h-1.5 bg-zinc-800 [&>div]:bg-[#3ecf8e]" />

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      {/* ─── ETAPA 1 ─── */}
      {step === 1 && (
        <Card className={cardClass}>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#3ecf8e]/10 text-[#3ecf8e]">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg text-white">Dados da Empresa</CardTitle>
                <CardDescription className="text-zinc-400">Informações básicas para faturamento e portal white-label.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form id="step1-form" onSubmit={handleSubmit(onSubmitStep1)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={labelClass}>Razão Social</label>
                  <input {...register("razao_social")} className={inputClass} placeholder="Ex: Empresa Ltda" />
                  {errors.razao_social && <p className="text-xs text-red-400">{errors.razao_social.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass}>CNPJ (apenas números)</label>
                  <input {...register("cnpj")} className={inputClass} placeholder="00000000000000" />
                  {errors.cnpj && <p className="text-xs text-red-400">{errors.cnpj.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className={labelClass}>CEP</label>
                  <input {...register("cep")} onBlur={(e) => fetchCep(e.target.value)} placeholder="Somente números" className={inputClass} />
                  {errors.cep && <p className="text-xs text-red-400">{errors.cep.message}</p>}
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className={labelClass}>Logradouro</label>
                  <input {...register("logradouro")} className={`${inputClass} bg-zinc-900`} />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className={labelClass}>Número</label>
                  <input {...register("numero")} className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass}>Bairro</label>
                  <input {...register("bairro")} className={`${inputClass} bg-zinc-900`} />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass}>Cidade</label>
                  <input {...register("cidade")} className={`${inputClass} bg-zinc-900`} />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass}>UF</label>
                  <input {...register("uf")} className={`${inputClass} bg-zinc-900`} />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-end pt-2 border-t border-zinc-800 mt-4">
            <Button type="submit" form="step1-form" disabled={isPending} className={primaryBtnClass}>
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
              Próxima Etapa
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* ─── ETAPA 2 ─── */}
      {step === 2 && (
        <Card className={cardClass}>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#3ecf8e]/10 text-[#3ecf8e]">
                <Network className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg text-white">Organograma da Empresa</CardTitle>
                <CardDescription className="text-zinc-400">Monte a hierarquia visual arrastando e conectando os cargos.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* O OrgChart precisa de um fundo escuro, vamos garantir que ele renderize bem com texto claro */}
            <div className="rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950">
              <OrgChart onChange={setOrgNodes} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-4 border-t border-zinc-800">
            <Button variant="outline" onClick={() => setStep(1)} className={secondaryBtnClass}>
              <ChevronLeft className="w-4 h-4" /> Voltar
            </Button>
            <Button onClick={onSubmitStep2} disabled={isPending} className={primaryBtnClass}>
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
              Próxima Etapa
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* ─── ETAPA 3 ─── */}
      {step === 3 && (
        <Card className={cardClass}>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#3ecf8e]/10 text-[#3ecf8e]">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg text-white">Colaboradores & Testes</CardTitle>
                <CardDescription className="text-zinc-400">Adicione os e-mails dos colaboradores para gerar links de testes psicométricos.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {emails.map((email, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  className={inputClass}
                  type="email"
                  placeholder="email@empresa.com"
                  value={email}
                  onChange={(e) => {
                    const updated = [...emails];
                    updated[i] = e.target.value;
                    setEmails(updated);
                  }}
                />
                {emails.length > 1 && (
                  <button onClick={() => setEmails(emails.filter((_, j) => j !== i))} className="p-2.5 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors border border-transparent hover:border-red-400/20">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setEmails([...emails, ""])} className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-700 gap-1.5">
              <Plus className="w-4 h-4" /> Adicionar outro e-mail
            </Button>

            {generatedLinks.length > 0 && (
              <div className="mt-6 space-y-2 p-4 rounded-lg bg-[#3ecf8e]/10 border border-[#3ecf8e]/20">
                <p className="text-sm font-medium text-[#3ecf8e]">Links gerados com sucesso!</p>
                {generatedLinks.map((l, i) => (
                  <div key={i} className="flex items-center justify-between text-sm gap-2 bg-zinc-900/50 p-2 rounded border border-zinc-800/50">
                    <span className="text-zinc-300">{l.email}</span>
                    <button onClick={() => navigator.clipboard.writeText(window.location.origin + l.url)} className="flex items-center gap-1 text-[#3ecf8e] hover:text-[#34b279] text-xs font-semibold">
                      <Copy className="w-3 h-3" /> Copiar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between pt-4 border-t border-zinc-800">
            <Button variant="outline" onClick={() => setStep(2)} className={secondaryBtnClass}>
              <ChevronLeft className="w-4 h-4" /> Voltar
            </Button>
            <Button onClick={onSubmitStep3} disabled={isPending} className={primaryBtnClass}>
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
              {emails.filter((e) => e.includes("@")).length > 0 ? "Gerar Links & Avançar" : "Pular Etapa"}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* ─── ETAPA 4 ─── */}
      {step === 4 && (
        <Card className={cardClass}>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#3ecf8e]/10 text-[#3ecf8e]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg text-white">Contexto & Valores</CardTitle>
                <CardDescription className="text-zinc-400">A IA usará essas informações para Match Cultural com candidatos.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-1.5">
              <label className={labelClass}>Contexto da Empresa</label>
              <textarea
                className={`${inputClass} min-h-[120px] resize-y leading-relaxed`}
                placeholder="Descreva o que a empresa faz, seu mercado, momento atual..."
                value={contexto}
                onChange={(e) => setContexto(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Perfil e Ritmo de Trabalho</label>
              <textarea
                className={`${inputClass} min-h-[100px] resize-y leading-relaxed`}
                placeholder="Ritmo acelerado? Presencial ou remoto? Horários flexíveis?"
                value={ritmo}
                onChange={(e) => setRitmo(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Valores da Empresa</label>
              <textarea
                className={`${inputClass} min-h-[100px] resize-y leading-relaxed`}
                placeholder="Inovação, transparência, colaboração..."
                value={valores}
                onChange={(e) => setValores(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-4 border-t border-zinc-800 mt-2">
            <Button variant="outline" onClick={() => setStep(3)} className={secondaryBtnClass}>
              <ChevronLeft className="w-4 h-4" /> Voltar
            </Button>
            <Button onClick={onSubmitStep4} disabled={isPending} className="bg-[#3ecf8e] hover:bg-[#34b279] text-zinc-950 font-bold gap-2 px-8 shadow-lg shadow-[#3ecf8e]/20">
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Concluir Onboarding
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
