import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AssistenteClient from "./AssistenteClient";

export const metadata = {
  title: "Assistente IA | MatchRH",
};

export default async function AssistentePage() {
  const { userId } = await auth();
  const finalUserId = userId || "user_dev_test_stable";

  const user = await prisma.user.findUnique({
    where: { clerk_id: finalUserId },
  });

  if (!user) {
    redirect("/sign-in");
  }

  return <AssistenteClient />;
}
