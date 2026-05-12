"use client";

import { useState } from "react";
import { X, Loader2, Send, Link, CheckCircle2 } from "lucide-react";
import { createTestLink } from "@/app/(platform)/candidatos/actions";

export function SendTestModal({
  isOpen,
  onClose,
  candidate,
}: {
  isOpen: boolean;
  onClose: () => void;
  candidate: { id: string; nome: string; jobId: string } | null;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !candidate) return null;

  async function handleGenerateLink() {
    setIsLoading(true);
    setError(null);
    try {
      const { token } = await createTestLink({ candidateId: candidate!.id, jobId: candidate!.jobId });
      setGeneratedLink(`${window.location.origin}/teste/${token}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao gerar link do teste.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleCopy() {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  // Reset state when closing manually via X button (if not already handled by parent)
  const handleClose = () => {
    setGeneratedLink(null);
    setCopied(false);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4 bg-zinc-950/50">
          <div>
            <h2 className="text-lg font-bold text-white">Enviar Teste</h2>
            <p className="text-xs text-zinc-400">
              Candidato: <span className="font-semibold text-white">{candidate.nome}</span>
            </p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {!generatedLink ? (
            <div className="space-y-6">
              <div className="bg-[#3ecf8e]/5 border border-[#3ecf8e]/20 p-4 rounded-xl text-sm text-zinc-300">
                <p className="mb-2">
                  Você está prestes a gerar um link único de teste comportamental para este candidato.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-zinc-400 text-xs">
                  <li>O link será válido por 30 dias.</li>
                  <li>O candidato responderá aos testes DISC, Eneagrama e 16 Personalidades.</li>
                  <li>Após a conclusão, um Match Score será gerado automaticamente.</li>
                </ul>
              </div>

              <button
                onClick={handleGenerateLink}
                disabled={isLoading}
                className="flex w-full justify-center items-center gap-2 rounded-lg bg-[#3ecf8e] px-4 py-3 text-sm font-bold text-zinc-950 shadow-lg shadow-[#3ecf8e]/20 transition-all hover:bg-[#34b279] active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {isLoading ? "Gerando link seguro..." : "Gerar Link do Teste"}
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center justify-center mb-2">
                <div className="bg-[#3ecf8e]/20 p-3 rounded-full">
                  <CheckCircle2 className="h-8 w-8 text-[#3ecf8e]" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-white mb-1">Link Gerado com Sucesso!</h3>
                <p className="text-xs text-zinc-400">
                  Copie o link abaixo e envie para o candidato por e-mail ou WhatsApp.
                </p>
              </div>

              <div className="flex items-center gap-2 mt-4 bg-zinc-950 border border-zinc-800 p-2 rounded-lg">
                <div className="flex-1 truncate px-2 text-sm text-zinc-300 font-mono">
                  {generatedLink}
                </div>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                    copied
                      ? "bg-[#3ecf8e]/20 text-[#3ecf8e]"
                      : "bg-zinc-800 hover:bg-zinc-700 text-white"
                  }`}
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" /> Copiado
                    </>
                  ) : (
                    <>
                      <Link className="h-3.5 w-3.5" /> Copiar
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={handleClose}
                className="w-full mt-4 rounded-lg bg-zinc-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700 transition-colors"
              >
                Fechar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
