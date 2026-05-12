import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // 1. Verificar estado atual
  const users = await prisma.user.findMany()
  const companies = await prisma.company.findMany()
  console.log(`Usuarios: ${users.length}`, users.map(u => ({ id: u.id, clerk_id: u.clerk_id, email: u.email })))
  console.log(`Empresas: ${companies.length}`, companies.map(c => ({ id: c.id, razao_social: c.razao_social, cnpj: c.cnpj })))

  // 2. Limpar TUDO para um recomeço limpo
  console.log('\n--- LIMPANDO BANCO ---')
  await prisma.chatMessage.deleteMany()
  await prisma.matchReport.deleteMany()
  await prisma.candidate.deleteMany()
  await prisma.job.deleteMany()
  await prisma.testLink.deleteMany()
  await prisma.personalityResult.deleteMany()
  await prisma.organogramaNode.deleteMany()
  await prisma.user.deleteMany()
  await prisma.company.deleteMany()
  console.log('BANCO LIMPO! Pronto para um novo onboarding.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
