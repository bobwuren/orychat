import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware protégé contre les erreurs
 * Ne plantera jamais le serveur grâce au try/catch global
 */
export function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl

    // Pages publiques (ne nécessitent pas d'authentification)
    const publicPages = ['/login', '/register']
    
    // Pages protégées (nécessitent une authentification)
    const protectedPages = [
      '/dashboard', 
      '/notes-entering', 
      '/summary', 
      '/recommendation',
      '/recommendation-history'
    ]

  // Vérifier si la page courante est publique ou protégée
  const isPublicPage = publicPages.includes(pathname)
  const isProtectedPage = protectedPages.includes(pathname)

  // Récupérer le token depuis les cookies ou headers (si disponible côté serveur)
  // Note: localStorage n'est pas accessible côté serveur, donc on utilise les cookies
  const token = request.cookies.get('accessToken')?.value

  // Si c'est une page publique et que l'utilisateur est connecté, rediriger vers dashboard
  if (isPublicPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Si c'est une page protégée et que l'utilisateur n'est pas connecté, rediriger vers login
  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirection racine vers dashboard si connecté, sinon vers login
  if (pathname === '/') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } else {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next();
  } catch (error) {
    // Capturer toute erreur pour éviter que le serveur ne tombe
    console.error('[Middleware] Erreur:', error);
    
    // Toujours continuer la requête en cas d'erreur
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}