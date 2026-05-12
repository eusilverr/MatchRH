"use client";

import { useEffect, useState } from "react";
import { useTestStore } from "@/store/useTestStore";
import { calculateDisc } from "@/lib/scoring/disc";
import { calculateEnneagram } from "@/lib/scoring/enneagram";
import { calculate16Personalities } from "@/lib/scoring/mbti";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";

const cardClass = "border border-zinc-800 shadow-2xl shadow-black/40 bg-zinc-900";
const primaryBtnClass = "bg-[#3ecf8e] hover:bg-[#34b279] text-zinc-950 font-bold transition-all";


// Mock das perguntas para visualização do MVP
const mockDiscQuestions = [
  { id: 1, options: [{ id: 'D', text: 'Decisivo' }, { id: 'I', text: 'Otimista' }, { id: 'S', text: 'Paciente' }, { id: 'C', text: 'Analítico' }] },
  { id: 2, options: [{ id: 'D', text: 'Agressivo' }, { id: 'I', text: 'Falante' }, { id: 'S', text: 'Acomodado' }, { id: 'C', text: 'Crítico' }] },
];

const mockEnneagramQuestions = [
  { id: 1, optionA: { text: 'Gosto de ter regras claras', type: 1 }, optionB: { text: 'Gosto de ajudar os outros', type: 2 } },
  { id: 2, optionA: { text: 'Foco no sucesso e metas', type: 3 }, optionB: { text: 'Gosto de ser autêntico e diferente', type: 4 } },
];

const mockMbtiQuestions = [
  { id: 1, text: 'Você se sente confortável em grandes grupos de pessoas.', domain: 'E' as const, key: '+' as const },
  { id: 2, text: 'Você geralmente planeja suas viagens detalhadamente.', domain: 'C' as const, key: '+' as const },
];

export function TestEngine({ token }: { token: string }) {
  const { step, setStep, discAnswers, enneagramAnswers, mbtiAnswers, setDiscAnswer, setEnneagramAnswer, setMbtiAnswer } = useTestStore();
  const [lgpdAccepted, setLgpdAccepted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Evita hydration mismatch por causa do Zustand persist

  const calculateProgress = () => {
    if (step === 'intro') return 0;
    if (step === 'disc') return 33;
    if (step === 'enneagram') return 66;
    if (step === '16p') return 90;
    return 100;
  };

  const submitTest = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/tests/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          discResults: discAnswers,
          enneagramResults: enneagramAnswers,
          mbtiResults: mbtiAnswers,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao enviar teste.");
      }

      setStep('completed');
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Ocorreu um erro inesperado.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-6 text-white">
      {step !== 'intro' && step !== 'completed' && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-zinc-400">
            <span>Progresso da Avaliação</span>
            <span>{calculateProgress()}%</span>
          </div>
          <Progress value={calculateProgress()} className="h-2 bg-zinc-800 [&>div]:bg-[#3ecf8e]" />
        </div>
      )}

      {step === 'intro' && (
        <Card className={cardClass}>
          <CardHeader>
            <CardTitle className="text-xl text-white">Avaliação de Perfil Comportamental</CardTitle>
            <CardDescription className="text-zinc-400">
              Bem-vindo(a)! Esta avaliação unificada nos ajudará a entender melhor suas características, preferências e estilo de trabalho.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-sm">
            <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl">
              <h3 className="font-semibold mb-2 text-[#3ecf8e]">Estrutura da Avaliação</h3>
              <ul className="list-disc pl-5 space-y-1 text-zinc-300">
                <li>Parte 1: Teste DISC (Perfil Comportamental)</li>
                <li>Parte 2: Eneagrama (Motivações Principais)</li>
                <li>Parte 3: 16 Personalidades (Estilo Cognitivo e Trabalho)</li>
              </ul>
              <p className="mt-4 text-xs text-zinc-500">O progresso é salvo automaticamente. Você pode fechar e retornar a qualquer momento usando seu link exclusivo.</p>
            </div>

            <div className="border border-amber-500/20 bg-amber-500/10 p-4 rounded-xl text-amber-200/90">
              <h3 className="font-semibold mb-1 text-amber-400">⚠️ Aviso Importante (SATEPSI)</h3>
              <p className="text-xs leading-relaxed">
                Esta plataforma utiliza algoritmos baseados em teorias comportamentais amplamente difundidas para suporte a decisões de Recursos Humanos (People Analytics). 
                Estes testes <strong>NÃO</strong> constituem avaliação psicológica clínica e não possuem validação do Conselho Federal de Psicologia (SATEPSI) para fins de diagnóstico.
              </p>
            </div>

            <div className="flex items-start space-x-3 border border-zinc-800 bg-zinc-950 p-4 rounded-xl">
              <Checkbox 
                id="lgpd" 
                checked={lgpdAccepted}
                onCheckedChange={(c) => setLgpdAccepted(c === true)}
                className="mt-1 border-zinc-700 data-[state=checked]:bg-[#3ecf8e] data-[state=checked]:text-zinc-950"
              />
              <div className="grid gap-1.5 leading-none">
                <label htmlFor="lgpd" className="text-sm font-medium text-zinc-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                  Termo de Consentimento e Privacidade (LGPD)
                </label>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Concordo com a coleta e processamento de minhas respostas para fins de mapeamento de perfil profissional. 
                  Meus dados serão armazenados de forma segura e poderão ser excluídos automaticamente após o período determinado pela empresa contratante.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-zinc-800 pt-6">
            <Button 
              className={`w-full ${primaryBtnClass}`} 
              disabled={!lgpdAccepted} 
              onClick={() => setStep('disc')}
            >
              Iniciar Avaliação
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 'disc' && (
        <Card className={cardClass}>
          <CardHeader>
            <CardTitle className="text-white">Parte 1: Teste DISC</CardTitle>
            <CardDescription className="text-zinc-400">
              Para cada grupo de palavras, escolha a que MAIS te descreve e a que MENOS te descreve.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {mockDiscQuestions.map((q) => (
              <div key={q.id} className="border border-zinc-800 bg-zinc-950 p-6 rounded-xl space-y-5">
                <p className="font-medium text-sm text-[#3ecf8e]">Grupo {q.id}</p>
                <div className="grid grid-cols-3 gap-2 text-center items-center text-sm">
                  <div className="font-semibold text-zinc-500">Palavra</div>
                  <div className="font-semibold text-zinc-500">MAIS</div>
                  <div className="font-semibold text-zinc-500">MENOS</div>
                  
                  {q.options.map((opt) => (
                    <div key={opt.id} className="contents group">
                      <div className="text-left text-zinc-300 py-2 border-t border-zinc-800/50 group-first:border-0">{opt.text}</div>
                      <div className="py-2 border-t border-zinc-800/50 group-first:border-0">
                        <input 
                          type="radio" 
                          name={`disc-${q.id}-most`} 
                          checked={discAnswers[q.id]?.most === opt.id}
                          onChange={() => setDiscAnswer(q.id, opt.id, discAnswers[q.id]?.least || 'N')}
                          disabled={discAnswers[q.id]?.least === opt.id}
                          className="w-4 h-4 accent-[#3ecf8e]"
                        />
                      </div>
                      <div className="py-2 border-t border-zinc-800/50 group-first:border-0">
                        <input 
                          type="radio" 
                          name={`disc-${q.id}-least`} 
                          checked={discAnswers[q.id]?.least === opt.id}
                          onChange={() => setDiscAnswer(q.id, discAnswers[q.id]?.most || 'N', opt.id)}
                          disabled={discAnswers[q.id]?.most === opt.id}
                          className="w-4 h-4 accent-[#3ecf8e]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="border-t border-zinc-800 pt-6">
            <Button className={`w-full ${primaryBtnClass}`} onClick={() => setStep('enneagram')}>
              Avançar para Parte 2
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 'enneagram' && (
        <Card className={cardClass}>
          <CardHeader>
            <CardTitle className="text-white">Parte 2: Eneagrama</CardTitle>
            <CardDescription className="text-zinc-400">
              Escolha a afirmação que melhor descreve o seu comportamento ou sentimento geral.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {mockEnneagramQuestions.map((q) => (
              <div key={q.id} className="border border-zinc-800 bg-zinc-950 p-5 rounded-xl space-y-4">
                <p className="text-sm font-medium text-[#3ecf8e]">Pergunta {q.id}</p>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-zinc-900 border border-zinc-800 transition-colors">
                    <input 
                      type="radio" 
                      name={`enneagram-${q.id}`} 
                      checked={enneagramAnswers[q.id] === q.optionA.type}
                      onChange={() => setEnneagramAnswer(q.id, q.optionA.type)}
                      className="w-4 h-4 accent-[#3ecf8e]"
                    />
                    <span className="text-sm text-zinc-300">{q.optionA.text}</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-zinc-900 border border-zinc-800 transition-colors">
                    <input 
                      type="radio" 
                      name={`enneagram-${q.id}`} 
                      checked={enneagramAnswers[q.id] === q.optionB.type}
                      onChange={() => setEnneagramAnswer(q.id, q.optionB.type)}
                      className="w-4 h-4 accent-[#3ecf8e]"
                    />
                    <span className="text-sm text-zinc-300">{q.optionB.text}</span>
                  </label>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="border-t border-zinc-800 pt-6">
            <Button className={`w-full ${primaryBtnClass}`} onClick={() => setStep('16p')}>
              Avançar para Parte 3
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === '16p' && (
        <Card className={cardClass}>
          <CardHeader>
            <CardTitle className="text-white">Parte 3: 16 Personalidades</CardTitle>
            <CardDescription className="text-zinc-400">
              Indique o quanto você concorda com as afirmações abaixo (1 = Discordo Totalmente, 5 = Concordo Totalmente).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {submitError && (
              <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
                {submitError}
              </div>
            )}
            {mockMbtiQuestions.map((q) => (
              <div key={q.id} className="border border-zinc-800 bg-zinc-950 p-6 rounded-xl space-y-5 text-center">
                <p className="text-sm font-medium text-zinc-300">{q.text}</p>
                <div className="flex justify-between items-center max-w-sm mx-auto">
                  <span className="text-xs font-semibold text-zinc-500">Discordo</span>
                  {[1, 2, 3, 4, 5].map((score) => (
                    <label key={score} className="flex flex-col items-center cursor-pointer p-2 hover:bg-zinc-900 rounded-full transition-colors">
                      <input 
                        type="radio" 
                        name={`mbti-${q.id}`} 
                        checked={mbtiAnswers[q.id] === score}
                        onChange={() => setMbtiAnswer(q.id, score)}
                        className={`w-${score === 1 || score === 5 ? '6' : score === 2 || score === 4 ? '5' : '4'} h-${score === 1 || score === 5 ? '6' : score === 2 || score === 4 ? '5' : '4'} accent-[#3ecf8e] cursor-pointer`}
                      />
                    </label>
                  ))}
                  <span className="text-xs font-semibold text-[#3ecf8e]">Concordo</span>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="border-t border-zinc-800 pt-6">
            <Button disabled={isSubmitting} className={`w-full ${primaryBtnClass}`} onClick={submitTest}>
              {isSubmitting ? "Enviando..." : "Finalizar e Enviar"}
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 'completed' && (
        <Card className={`${cardClass} text-center py-12 border-[#3ecf8e]/30 bg-[#3ecf8e]/5`}>
          <CardContent className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-[#3ecf8e]/20 text-[#3ecf8e] rounded-full flex items-center justify-center text-3xl mb-4">
              ✓
            </div>
            <h2 className="text-2xl font-bold text-white">Avaliação Concluída!</h2>
            <p className="text-zinc-400">
              Agradecemos sua participação. Suas respostas foram salvas com sucesso.
            </p>
            <p className="text-sm text-zinc-500">
              Você já pode fechar esta aba.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
