"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutDashboard,
  Briefcase,
  Users,
  ClipboardCheck,
  Network,
  Settings,
  LogOut,
  Zap,
  BarChart,
  Bot
} from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/vagas", label: "Vagas", icon: Briefcase },
  { href: "/candidatos", label: "Candidatos", icon: Users },
  { href: "/testes", label: "Testes", icon: ClipboardCheck },
  { href: "/organograma", label: "Organograma", icon: Network },
  { href: "/relatorios", label: "Relatórios", icon: BarChart },
  { href: "/assistente", label: "Assistente IA", icon: Bot },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-zinc-800 bg-zinc-900">
      {/* Logo */}
      <div className="flex items-center gap-2.5 border-b border-zinc-800 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#3ecf8e]">
          <Zap className="h-5 w-5 text-zinc-950" strokeWidth={2.5} />
        </div>
        <div>
          <span className="text-lg font-bold text-white">Match</span>
          <span className="text-lg font-bold text-[#3ecf8e]">RH</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          Menu Principal
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-[#3ecf8e] text-zinc-950 font-bold shadow-lg shadow-[#3ecf8e]/20"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <Icon
                className={`h-[18px] w-[18px] ${
                  isActive ? "text-zinc-950" : "text-zinc-500 group-hover:text-zinc-300"
                }`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-zinc-800 px-3 py-4">
        <div className="mb-3 rounded-xl bg-zinc-800/50 p-4">
          <p className="text-xs font-semibold text-white">Plano Gratuito</p>
          <p className="mt-1 text-[11px] text-zinc-500">
            3 de 5 vagas utilizadas
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-700">
            <div
              className="h-full rounded-full bg-[#3ecf8e] transition-all"
              style={{ width: "60%" }}
            />
          </div>
          <button className="mt-3 w-full rounded-md bg-[#3ecf8e]/10 py-1.5 text-xs font-medium text-[#3ecf8e] transition-colors hover:bg-[#3ecf8e]/20">
            Fazer Upgrade
          </button>
        </div>

        <SignOutButton>
          <button className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white">
            <LogOut className="h-[18px] w-[18px]" />
            Sair
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
}
