import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { handleMiddlewareError } from './lib/errorHandler';

export function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    // Pages publiques (login uniquement)
    const publicPages = ['/login'];

  // Toutes les autres pages sont protégées
  const isPublicPage = publicPages.includes(pathname);
  const isProtectedPage = !isPublicPage && !pathname.startsWith('/api');

  // Récupérer le token depuis les cookies
  const token = request.cookies.get('adminAccessToken')?.value;

  // Si connecté et sur /login, redirige vers /users
  if (isPublicPage && token) {
    return NextResponse.redirect(new URL('/users', request.url));
  }

  // Si non connecté et sur une page protégée, redirige vers /login
  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirection racine
  if (pathname === '/') {
    if (token) {
      return NextResponse.redirect(new URL('/users', request.url));
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // Permet au serveur de continuer à fonctionner même en cas d'erreur
    // On peut renvoyer une réponse avec un statut d'erreur si nécessaire
    const errorInfo = handleMiddlewareError(error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(errorInfo, { status: 500 });
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

