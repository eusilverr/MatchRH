"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createCandidate(data: {
  nome: string;
  email: string;
  linkedin_url?: string;
  jobId?: string;
}) {
  const { userId } = await auth();
  const finalUserId = userId || "user_dev_test_stable";

  const user = await prisma.user.findUnique({
    where: { clerk_id: finalUserId },
  });

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  await prisma.candidate.create({
    data: {
      company_id: user.company_id,
      nome: data.nome,
      email: data.email,
      linkedin_url: data.linkedin_url || null,
      job_id: data.jobId || null,
    },
  });

  revalidatePath("/candidatos");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function createTestLink(data: { candidateId: string; jobId?: string }) {
  const { userId } = await auth();
  const finalUserId = userId || "user_dev_test_stable";

  const user = await prisma.user.findUnique({
    where: { clerk_id: finalUserId },
  });

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  // Gera um token único de 32 chars
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

  // Expira em 30 dias
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await prisma.testLink.create({
    data: {
      company_id: user.company_id,
      candidate_id: data.candidateId,
      token,
      type: "candidate",
      expires_at: expiresAt,
    },
  });

  if (data.candidateId) {
    await prisma.candidate.update({
      where: { id: data.candidateId },
      data: { test_link_token: token },
    });
  }

  revalidatePath("/candidatos");
  revalidatePath("/testes");
  
  return { token };
}

