import { clerkMiddleware } from '@clerk/nextjs/server'

// MODO DE DIAGNÓSTICO: Tudo é público
export default clerkMiddleware(async (auth, req) => {
  // Não fazemos nada. Ninguém é redirecionado.
  return;
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
