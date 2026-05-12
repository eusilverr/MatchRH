import Link from "next/link";
import {
  Zap,
  ArrowRight,
  Brain,
  BarChart3,
  Shield,
  Users,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-zinc-800/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#3ecf8e]">
              <Zap className="h-5 w-5 text-zinc-950" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold">Match</span>
            <span className="text-lg font-bold text-[#3ecf8e]">RH</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/sign-in"
              className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
            >
              Entrar
            </Link>
            <Link
              href="/sign-up"
              className="rounded-lg bg-[#3ecf8e] px-5 py-2 text-sm font-semibold text-zinc-950 transition-all hover:bg-[#34b279] active:scale-[0.98]"
            >
              Começar Grátis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(62,207,142,0.08)_0%,_transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 text-center lg:py-32">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-1.5 text-xs font-medium text-zinc-400">
            <Sparkles className="h-3.5 w-3.5 text-[#3ecf8e]" />
            Plataforma de RH com Inteligência Artificial
          </div>
          <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Contrate o candidato certo para a{" "}
            <span className="text-[#3ecf8e]">cultura certa</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
            Testes psicométricos DISC, Eneagrama e Big Five combinados com IA
            para mapear a cultura da sua empresa e encontrar o match perfeito.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/sign-up"
              className="flex items-center gap-2 rounded-lg bg-[#3ecf8e] px-8 py-3 text-base font-semibold text-zinc-950 shadow-lg shadow-[#3ecf8e]/20 transition-all hover:bg-[#34b279] hover:shadow-[#3ecf8e]/30 active:scale-[0.98]"
            >
              Começar Agora
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#features"
              className="rounded-lg border border-zinc-800 px-8 py-3 text-base font-medium text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white"
            >
              Como Funciona
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-zinc-800/50">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">
              Tudo que o seu RH precisa em{" "}
              <span className="text-[#3ecf8e]">uma plataforma</span>
            </h2>
            <p className="mt-3 text-zinc-400">
              Do mapeamento cultural à contratação, automatizado por IA.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Brain,
                title: "Testes Psicométricos",
                desc: "DISC, Eneagrama e Big Five aplicados de forma simples e automatizada para mapear perfis comportamentais.",
              },
              {
                icon: BarChart3,
                title: "Match por IA",
                desc: "Algoritmo inteligente que cruza o perfil do candidato com a cultura e as necessidades da vaga.",
              },
              {
                icon: Users,
                title: "Organograma Inteligente",
                desc: "Visualize a estrutura da empresa e identifique gaps de competência em cada departamento.",
              },
              {
                icon: Shield,
                title: "Segurança Total",
                desc: "Dados criptografados, conformidade com LGPD e controle de acesso granular por papel.",
              },
              {
                icon: Sparkles,
                title: "Relatórios com IA",
                desc: "Relatórios gerados automaticamente com insights acionáveis sobre cultura e compatibilidade.",
              },
              {
                icon: Zap,
                title: "Onboarding Rápido",
                desc: "Configure sua empresa em minutos. Cadastre equipe, defina valores e comece a recrutar.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition-all hover:border-zinc-700 hover:shadow-xl hover:shadow-black/20"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#3ecf8e]/10 text-[#3ecf8e] transition-colors group-hover:bg-[#3ecf8e]/20">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-400">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-800/50">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <h2 className="text-3xl font-bold">
            Pronto para transformar seu{" "}
            <span className="text-[#3ecf8e]">RH</span>?
          </h2>
          <p className="mt-3 text-zinc-400">
            Comece agora, gratuitamente. Sem cartão de crédito.
          </p>
          <Link
            href="/sign-up"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#3ecf8e] px-8 py-3 text-base font-semibold text-zinc-950 shadow-lg shadow-[#3ecf8e]/20 transition-all hover:bg-[#34b279]"
          >
            Criar Conta Grátis
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 bg-zinc-900/50">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-[#3ecf8e]" />
              <span className="text-sm font-semibold text-zinc-400">
                MatchRH
              </span>
            </div>
            <p className="text-xs text-zinc-600">
              © 2026 MatchRH. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
