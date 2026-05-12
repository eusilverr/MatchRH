import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Zap } from "lucide-react";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#3ecf8e]">
            <Zap className="h-5 w-5 text-zinc-950" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold text-white">Match</span>
          <span className="text-lg font-bold text-[#3ecf8e]">RH</span>
        </div>
        <SignUp
          fallbackRedirectUrl="/onboarding"
          appearance={{
            baseTheme: dark,
            variables: {
              colorPrimary: "#3ecf8e",
              colorText: "#ffffff",
            },
            elements: {
              rootBox: "w-full",
              cardBox: "w-full",
              card: "!bg-[#18181b] border border-zinc-800 shadow-2xl shadow-black/40 rounded-2xl",
              headerTitle: "!text-white text-2xl font-bold",
              headerSubtitle: "!text-zinc-400",
              formFieldLabel: "!text-zinc-300 font-medium",
              socialButtonsBlockButton: "!bg-zinc-800 !border-zinc-700 !text-white hover:!bg-zinc-700",
              socialButtonsBlockButtonText: "!text-white font-medium",
              formButtonPrimary: "!bg-[#3ecf8e] hover:!bg-[#34b279] !text-zinc-950 font-bold",
              footerActionLink: "!text-[#3ecf8e] hover:!text-[#34b279]",
              formFieldInput: "!bg-zinc-900 !text-white !border-zinc-700 focus:!border-[#3ecf8e]",
              dividerLine: "!bg-zinc-800",
              dividerText: "!text-zinc-500",
              footerActionText: "!text-zinc-400",
            },
          }}
        />
      </div>
    </div>
  );
}
