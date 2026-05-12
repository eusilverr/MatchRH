import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const finalUserId = userId || "user_dev_test_stable";
    console.log("Chat IA: Usuário", finalUserId);

    const user = await prisma.user.findUnique({
      where: { clerk_id: finalUserId },
    });

    if (!user) {
      console.log("Chat IA: Usuário não encontrado no banco.");
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { message, history } = body;
    console.log("Chat IA: Mensagem recebida:", message);

    if (!apiKey) {
      console.log("Chat IA: API Key ausente.");
      return NextResponse.json({ error: "Chave do Gemini não configurada" }, { status: 500 });
    }

    // Buscar contexto atualizado da empresa
    const companyId = user.company_id;
    console.log("Chat IA: Buscando contexto da empresa", companyId);
    const [totalVagas, vagasAbertas, totalCandidatos, testesConcluidos] = await Promise.all([
      prisma.job.count({ where: { company_id: companyId } }),
      prisma.job.count({ where: { company_id: companyId, status: "OPEN" } }),
      prisma.candidate.count({ where: { company_id: companyId } }),
      prisma.candidate.count({ where: { company_id: companyId, test_completed_at: { not: null } } }),
    ]);
    console.log("Chat IA: Contexto recuperado.");

    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",      systemInstruction: `Você é a MatchRH, uma assistente virtual especializada em RH integrada ao sistema da empresa.
Você deve ajudar os usuários a extrair insights da plataforma e entender melhor os processos de recrutamento.
Aqui está o contexto atual (em tempo real) dos dados da empresa nesta plataforma:
- Total de Vagas Cadastradas: ${totalVagas}
- Vagas Abertas no Momento: ${vagasAbertas}
- Total de Candidatos na Base: ${totalCandidatos}
- Candidatos que já concluíram testes comportamentais: ${testesConcluidos}

Seja sempre prestativa, educada e direta. Use os dados acima para responder caso o usuário pergunte algo sobre os números do sistema.`
    });

    // Criar uma sessão de chat com histórico
    // A API do Gemini exige que o histórico comece com uma mensagem do 'user'
    const formattedHistory = history
      .map((msg: any) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

    // Encontrar o índice da primeira mensagem do usuário
    const firstUserIndex = formattedHistory.findIndex((m: any) => m.role === "user");
    const validHistory = firstUserIndex !== -1 ? formattedHistory.slice(firstUserIndex) : [];

    const chat = model.startChat({
      history: validHistory,
    });

    console.log("Enviando mensagem para o Gemini...");
    const result = await chat.sendMessage(message);
    const responseText = result.response.text();
    console.log("Resposta recebida com sucesso.");

    return NextResponse.json({ reply: responseText });
  } catch (error: any) {
    console.error("ERRO DETALHADO NO CHAT IA:", error);
    return NextResponse.json({ 
      error: "Erro interno no servidor de IA", 
      details: error.message 
    }, { status: 500 });
  }
}
