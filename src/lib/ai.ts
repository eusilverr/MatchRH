import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function generateJobDescription(input: {
  titulo: string;
  departamento: string;
  nivel: string;
  localizacao: string;
  tipo: string;
}): Promise<string> {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY não configurada.");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = `
Você é um especialista em RH e atração de talentos.
Crie uma descrição de vaga (Job Description) clara, atraente e objetiva.

Informações da vaga:
- Título: ${input.titulo}
- Departamento: ${input.departamento}
- Nível: ${input.nivel}
- Tipo de Contrato: ${input.tipo}
- Localização: ${input.localizacao}

A descrição deve conter:
1. Resumo da oportunidade (1-2 frases)
2. Principais Responsabilidades (3-5 bullet points)
3. Requisitos Desejados (3-5 bullet points)
4. O que oferecemos (genérico, 2-3 bullet points)

Formato: Apenas texto, sem formatação complexa de markdown (pode usar bullet points normais como "•"), não adicione introdução ou conclusão. Seja direto e profissional, usando tom convidativo.
  `;

  console.log("Chamando Gemini API para JD...");
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("Resposta da Gemini API recebida (tamanho):", text.length);
    return text.trim();
  } catch (error) {
    console.error("Erro ao gerar JD com Gemini:", error);
    throw new Error("Falha ao gerar descrição com IA. Tente novamente.");
  }
}

export async function calculateMatchScore(
  jobContext: any,
  personalityResult: any
): Promise<{ score: number; relatorio: any }> {
  if (!apiKey) {
    return {
      score: 50,
      relatorio: { erro: "GEMINI_API_KEY não configurada. Score padrão aplicado." },
    };
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = `
Você é um sistema avançado de People Analytics.
Sua tarefa é comparar o perfil de uma vaga com os resultados de testes de personalidade de um candidato e gerar um score de compatibilidade (Match Score).

Contexto da Vaga:
${JSON.stringify(jobContext)}

Resultado do Candidato (DISC, Eneagrama, 16 Personalidades):
${JSON.stringify(personalityResult)}

Analise a aderência do perfil do candidato aos requisitos e ao contexto da vaga.
Retorne um JSON válido com o seguinte formato:
{
  "score": <numero de 0 a 100 indicando a porcentagem de compatibilidade>,
  "pontos_fortes": ["ponto 1", "ponto 2"],
  "pontos_atencao": ["ponto 1"],
  "resumo": "Breve resumo da análise (2-3 frases)"
}

Certifique-se de retornar APENAS o JSON, sem blocos de código (\`\`\`json) ou texto adicional.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    
    // Remove markdown code blocks if present
    if (text.startsWith("```json")) {
      text = text.substring(7);
    } else if (text.startsWith("```")) {
      text = text.substring(3);
    }
    if (text.endsWith("```")) {
      text = text.substring(0, text.length - 3);
    }
    
    const data = JSON.parse(text);
    return {
      score: data.score || 0,
      relatorio: data,
    };
  } catch (error) {
    console.error("Erro ao calcular Match Score com Gemini:", error);
    return {
      score: 50,
      relatorio: { erro: "Falha na análise da IA." },
    };
  }
}
