import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { 
  Building2, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Zap, 
  Key,
  Database,
  Globe
} from "lucide-react";

export default async function ConfiguracoesPage() {
  const { userId } = await auth();
  const finalUserId = userId || "user_dev_test_stable";

  const user = await prisma.user.findUnique({
    where: { clerk_id: finalUserId },
    include: {
      company: true,
    },
  });

  if (!user) {
    redirect("/onboarding");
  }

  const company = user.company;

  return (
    <div className="min-h-screen p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Configurações</h1>
        <p className="text-zinc-400">Gerencie os dados da sua empresa e chaves de integração</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Perfil da Empresa */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-zinc-800 pb-4">
              <Building2 className="h-5 w-5 text-[#3ecf8e]" />
              <h2 className="text-lg font-semibold text-white">Dados da Empresa</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1 block">Razão Social</label>
                <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-300">
                  {company.razao_social}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1 block">CNPJ / ID</label>
                <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-300">
                  {company.cnpj || "Não informado"}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1 block">Website / URL</label>
                <div className="flex items-center gap-2 bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-300">
                  <Globe className="h-4 w-4 text-zinc-500" />
                  <span>match-rh.vercel.app</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-zinc-800 pb-4">
              <Key className="h-5 w-5 text-[#3ecf8e]" />
              <h2 className="text-lg font-semibold text-white">Chaves de API & Integrações</h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-[#3ecf8e]/10 flex items-center justify-center text-[#3ecf8e]">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Google Gemini IA</p>
                    <p className="text-xs text-zinc-500">Ativo • Modelo Flash 1.5</p>
                  </div>
                </div>
                <span className="px-2 py-1 rounded bg-zinc-800 text-[10px] font-bold text-zinc-400">CONECTADO</span>
              </div>

              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Supabase Cloud DB</p>
                    <p className="text-xs text-zinc-500">Ativo • PostgreSQL 15</p>
                  </div>
                </div>
                <span className="px-2 py-1 rounded bg-zinc-800 text-[10px] font-bold text-zinc-400">CONECTADO</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar de Status */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h3 className="text-sm font-bold text-white mb-4">Plano Atual</h3>
            <div className="mb-4">
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs text-zinc-500 font-medium">Uso de Vagas</span>
                <span className="text-xs font-bold text-[#3ecf8e]">3 / 5</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#3ecf8e]" style={{ width: '60%' }} />
              </div>
            </div>
            <button className="w-full bg-[#3ecf8e] text-zinc-950 py-2.5 rounded-lg text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
              Upgrade para PRO
            </button>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h3 className="text-sm font-bold text-white mb-4">Suporte</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border border-zinc-800 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors">
                <Mail className="h-4 w-4" />
                Abrir Ticket
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border border-zinc-800 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors">
                <Database className="h-4 w-4" />
                Documentação API
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
