import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import OrgChartViewer from "./OrgChartViewer";

export default async function OrganogramaPage() {
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
          organograma_nodes: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/onboarding");
  }

  const nodes = user.company.organograma_nodes.map((n) => ({
    id: n.id,
    nome: n.nome,
    cargo: n.cargo,
    departamento: n.departamento || "",
    email: n.email || "",
    parentId: n.parent_id || undefined,
  }));

  return <OrgChartViewer initialNodes={nodes} companyName={user.company.razao_social} />;
}
