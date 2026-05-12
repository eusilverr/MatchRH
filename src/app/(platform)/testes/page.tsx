import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Copy, CheckCircle2, Clock, Search, ClipboardCheck } from "lucide-react";

export default async function TestesPage() {
  const { userId } = await auth();
  const finalUserId = userId || "user_dev_test_stable";

  if (!finalUserId && process.env.NODE_ENV === "production") {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { clerk_id: finalUserId },
    include: {
      company: {
        include: {
          test_links: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/onboarding");
  }

  const links = user.company.test_links;
  const concluidos = links.filter((l) => l.completed_at).length;
  const pendentes = links.length - concluidos;

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Testes Comportamentais</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Acompanhe o status dos links de testes DISC/Eneagrama enviados.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Total Gerados
            </p>
            <ClipboardCheck className="h-4 w-4 text-zinc-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{links.length}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Concluídos
            </p>
            <CheckCircle2 className="h-4 w-4 text-[#3ecf8e]" />
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{concluidos}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Pendentes
            </p>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{pendentes}</p>
        </div>
      </div>

      {/* Tabela/Lista */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Links Gerados</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Buscar por Token..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 py-2 pl-9 pr-4 text-sm text-white placeholder:text-zinc-600 focus:border-[#3ecf8e]/50 focus:outline-none focus:ring-1 focus:ring-[#3ecf8e]/20"
            />
          </div>
        </div>

        {links.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-800 py-12">
            <ClipboardCheck className="mb-3 h-10 w-10 text-zinc-700" />
            <p className="text-sm text-zinc-400">Nenhum teste gerado ainda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-400">
              <thead className="border-b border-zinc-800 text-xs font-medium uppercase text-zinc-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Público (Tipo)</th>
                  <th className="px-4 py-3 font-medium">Link do Teste</th>
                  <th className="px-4 py-3 font-medium">Token ID</th>
                  <th className="px-4 py-3 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {links.map((link) => (
                  <tr key={link.id} className="transition-colors hover:bg-zinc-950/50">
                    <td className="whitespace-nowrap px-4 py-4 font-medium text-white capitalize">
                      {link.type === "employee" ? "Colaborador" : "Candidato"}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="truncate max-w-[200px] text-zinc-500">
                          {`/teste/${link.token}`}
                        </span>
                        <button
                          title="Copiar Link"
                          className="rounded p-1.5 text-zinc-500 hover:bg-[#3ecf8e]/10 hover:text-[#3ecf8e] transition-colors"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 font-mono text-xs text-zinc-500">
                      {link.token.substring(0, 8)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-right">
                      {link.completed_at ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#3ecf8e]/10 px-2.5 py-1 text-[11px] font-bold uppercase text-[#3ecf8e]">
                          <CheckCircle2 className="h-3 w-3" /> Concluído
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/10 px-2.5 py-1 text-[11px] font-bold uppercase text-amber-400">
                          <Clock className="h-3 w-3" /> Pendente
                        </span>
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
