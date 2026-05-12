import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateMatchScore } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, discResults, enneagramResults, mbtiResults } = body;

    if (!token) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 400 });
    }

    // Buscar o TestLink
    const testLink = await prisma.testLink.findUnique({
      where: { token },
      include: {
        company: true,
      },
    });

    if (!testLink) {
      return NextResponse.json({ error: "Token inválido" }, { status: 404 });
    }

    if (testLink.completed_at) {
      return NextResponse.json({ error: "Teste já foi respondido" }, { status: 400 });
    }

    if (testLink.expires_at && testLink.expires_at < new Date()) {
      return NextResponse.json({ error: "Token expirado" }, { status: 400 });
    }

    const isCandidate = testLink.type === "candidate";
    const subjectId = testLink.candidate_id || "unknown";

    // Salvar PersonalityResult
    const personalityResult = await prisma.personalityResult.create({
      data: {
        company_id: testLink.company_id,
        subject_id: subjectId,
        subject_type: testLink.type,
        disc_json: discResults,
        enneagram_json: enneagramResults,
        mbti_json: mbtiResults,
      },
    });

    // Marcar como completo
    await prisma.testLink.update({
      where: { id: testLink.id },
      data: { completed_at: new Date() },
    });

    // Se for candidato, atualizar e calcular Match Score (async sem bloquear)
    if (isCandidate && testLink.candidate_id) {
      await prisma.candidate.update({
        where: { id: testLink.candidate_id },
        data: { test_completed_at: new Date() },
      });

      // Calcular Match Score assincronamente
      const candidate = await prisma.candidate.findUnique({
        where: { id: testLink.candidate_id },
        include: { job: true },
      });

      if (candidate && candidate.job) {
        // Enviar para background calculation
        calculateMatchScore(candidate.job, {
          disc: discResults,
          enneagram: enneagramResults,
          mbti: mbtiResults,
        }).then(async (aiResult) => {
          await prisma.matchReport.create({
            data: {
              job_id: candidate.job!.id,
              candidate_id: candidate.id,
              match_score: aiResult.score,
              relatorio_json: aiResult.relatorio,
            },
          });
        }).catch(err => console.error("Background AI error:", err));
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro no submit do teste:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
