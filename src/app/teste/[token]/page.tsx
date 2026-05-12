import { TestEngine } from "@/components/TestEngine";
import { Zap } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function TestPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  // Buscar o token no banco de dados (TestLink)
  const testLink = await prisma.testLink.findUnique({
    where: { token },
    include: {
      company: true,
    },
  });

  if (!testLink) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white p-4">
        <h1 className="text-2xl font-bold mb-2">Link Inválido</h1>
        <p className="text-zinc-400 text-center">Este link de teste não existe ou já expirou.</p>
      </div>
    );
  }

  if (testLink.completed_at) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white p-4">
        <div className="bg-[#3ecf8e]/10 p-4 rounded-full mb-4">
          <Zap className="h-8 w-8 text-[#3ecf8e]" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Teste já concluído!</h1>
        <p className="text-zinc-400 text-center max-w-md">
          Agradecemos seu tempo. Seus resultados já foram enviados com sucesso para {testLink.company.razao_social}.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col text-white">
      <header className="w-full border-b bg-zinc-900 shadow-sm py-4 border-zinc-800">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#3ecf8e]">
              <Zap className="h-5 w-5 text-zinc-950" strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-xl font-bold text-white">Match</span>
              <span className="text-xl font-bold text-[#3ecf8e]">RH</span>
            </div>
          </div>
          <div className="text-sm text-zinc-400 font-medium">
            {testLink.company.razao_social}
          </div>
        </div>
      </header>

      
      <main className="flex-1 py-8 px-4">
        <TestEngine token={token} />
      </main>

      <footer className="w-full py-6 text-center text-xs text-zinc-500">
        <p>Desenvolvido com a tecnologia MatchRH</p>
      </footer>
    </div>
  );
}
