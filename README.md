# 🤖 MatchRH - SaaS B2B de Gestão de Talentos com IA

**MatchRH** é uma plataforma SaaS multi-tenant projetada para modernizar o processo de recrutamento e seleção (R&S). Combinando inteligência artificial generativa e análise comportamental, a ferramenta ajuda empresas a encontrar o candidato ideal com base em dados técnicos e culturais.

![MatchRH Dashboard](https://raw.githubusercontent.com/eusilverr/MatchRH/main/public/dashboard-preview.png)

## 🚀 Funcionalidades Principais

- **Dashboard Inteligente:** Visão geral em tempo real de vagas, candidatos e métricas de conversão.
- **Gestão de Vagas:** Fluxo completo de criação e monitoramento de oportunidades.
- **Gerador de Descrição com IA:** Use o poder do **Gemini 2.5 Flash** para criar descrições de cargos atraentes em segundos.
- **Análise Comportamental:** Integração com testes de personalidade (DISC, Eneagrama e 16 Personas).
- **Match Score com IA:** Algoritmo que calcula a aderência do candidato à vaga baseando-se no perfil psicológico e técnico.
- **Assistente MatchRH:** Um chatbot inteligente integrado para fornecer insights sobre a base de talentos e processos internos.
- **Organograma Dinâmico:** Visualização clara da estrutura da empresa.
- **Multi-tenancy:** Isolamento completo de dados por empresa via Clerk.

## 🛠️ Stack Tecnológica

- **Framework:** [Next.js 15+](https://nextjs.org/) (App Router)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/) (Hospedado no [Supabase](https://supabase.com/))
- **ORM:** [Prisma](https://www.prisma.io/)
- **Autenticação:** [Clerk](https://clerk.com/)
- **IA Generativa:** [Google Gemini 2.5 Flash](https://aistudio.google.com/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Ícones:** [Lucide React](https://lucide.dev/)

---

## 📦 Como Implantar o Projeto

### 1. Pré-requisitos
- Node.js 18+ instalado.
- Uma conta no [Supabase](https://supabase.com/).
- Uma conta no [Clerk](https://clerk.com/).
- Uma chave de API do [Google AI Studio](https://aistudio.google.com/).

### 2. Configuração do Banco de Dados (Supabase)
1. Crie um novo projeto no Supabase.
2. Vá em **Settings > Database** e copie a **Connection String** (Transaction Mode, porta 6543).

### 3. Configuração de Autenticação (Clerk)
1. Crie um aplicativo no Clerk.
2. Habilite o login via Email e/ou Google.
3. Copie a `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` e a `CLERK_SECRET_KEY`.

### 4. Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto com as seguintes chaves:

```env
# Banco de Dados
DATABASE_URL="sua_connection_string_do_supabase"

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="sua_chave_publica"
CLERK_SECRET_KEY="sua_chave_secreta"
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Google Gemini IA
GEMINI_API_KEY="sua_chave_do_gemini"

# Supabase (Opcional para Client-side)
NEXT_PUBLIC_SUPABASE_URL="sua_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sua_anon_key"
```

### 5. Instalação e Execução
```bash
# Instalar dependências
npm install

# Gerar o cliente Prisma
npx prisma generate

# Sincronizar o banco de dados
npx prisma db push

# Iniciar o servidor de desenvolvimento
npm run dev
```

### 6. Deploy na Vercel
1. Conecte seu repositório GitHub na Vercel.
2. Adicione todas as Variáveis de Ambiente listadas acima nas configurações do projeto.
3. Certifique-se de que o comando de build seja `next build`.
4. No campo de **Install Command**, use `npm install`.

---

## 📄 Licença

Este projeto é para fins de demonstração e desenvolvimento de portfólio. Todos os direitos reservados.

---
Feito com ❤️ por [MatchRH Team](https://match-rh.vercel.app/)
