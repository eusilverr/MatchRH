import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { Zap } from "lucide-react";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col text-white">
      <header className="w-full border-b bg-zinc-900 shadow-sm py-4 border-zinc-800">
        <div className="container mx-auto px-4 flex justify-center">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#3ecf8e]">
              <Zap className="h-5 w-5 text-zinc-950" strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-xl font-bold text-white">Match</span>
              <span className="text-xl font-bold text-[#3ecf8e]">RH</span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 py-10 px-4 container mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2">Configure a sua Empresa</h2>
          <p className="text-zinc-400 text-sm">
            Prepare o ambiente para que a IA possa realizar o Match perfeito de candidatos.
          </p>
        </div>

        <OnboardingWizard />
      </main>
    </div>
  );
}
