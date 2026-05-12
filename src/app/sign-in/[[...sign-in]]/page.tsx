import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Zap } from "lucide-react";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/40">
        {/* Left Panel - Branding */}
        <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-zinc-900 via-zinc-900 to-[#3ecf8e]/10 p-12 lg:flex">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#3ecf8e]">
              <Zap className="h-5 w-5 text-zinc-950" strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-xl font-bold text-white">Match</span>
              <span className="text-xl font-bold text-[#3ecf8e]">RH</span>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-3xl font-bold leading-tight text-white">
              Contrate com
              <br />
              <span className="text-[#3ecf8e]">inteligência</span>
            </h2>
            <p className="text-sm leading-relaxed text-zinc-400">
              A plataforma de RH que usa testes psicométricos e IA para
              encontrar o candidato perfeito para a cultura da sua empresa.
            </p>
          </div>

          <div className="space-y-3">
            {[
              "Testes DISC, Eneagrama e Big Five",
              "Match de candidatos por cultura",
              "Organograma visual inteligente",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm text-zinc-400">
                <div className="h-1.5 w-1.5 rounded-full bg-[#3ecf8e]" />
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Clerk Form */}
        <div className="flex w-full flex-col items-center justify-center p-8 lg:w-1/2">
          <div className="mb-6 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#3ecf8e]">
              <Zap className="h-5 w-5 text-zinc-950" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold text-white">Match</span>
            <span className="text-lg font-bold text-[#3ecf8e]">RH</span>
          </div>
          <SignIn
            fallbackRedirectUrl="/dashboard"
            signUpFallbackRedirectUrl="/dashboard"
            appearance={{
              baseTheme: dark,
              variables: {
                colorPrimary: "#3ecf8e",
                colorText: "#ffffff",
              },
              elements: {
                rootBox: "w-full",
                cardBox: "w-full shadow-none",
                card: "!bg-[#18181b] shadow-none w-full border-none",
                headerTitle: "!text-white text-2xl font-bold",
                headerSubtitle: "!text-zinc-400",
                formFieldLabel: "!text-zinc-300 font-medium",
                formFieldInput: "!bg-zinc-900 !text-white !border-zinc-700 focus:!border-[#3ecf8e]",
                socialButtonsBlockButton: "!bg-zinc-800 !border-zinc-700 !text-white hover:!bg-zinc-700",
                socialButtonsBlockButtonText: "!text-white font-medium",
                formButtonPrimary: "!bg-[#3ecf8e] hover:!bg-[#34b279] !text-zinc-950 font-bold",
                dividerLine: "!bg-zinc-800",
                dividerText: "!text-zinc-500",
                footerActionText: "!text-zinc-400",
                footerActionLink: "!text-[#3ecf8e] hover:!text-[#34b279]",
                identityPreviewText: "!text-white",
                identityPreviewEditButton: "!text-[#3ecf8e]",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
