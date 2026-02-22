import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * middleware.ts — Racine du projet (même niveau que /app)
 *
 * Responsabilités :
 *
 * 1. PROTECTION AUTH
 *    /dashboard/* et /admin/* → redirige vers /login si non connecté
 *    /login et /signup → redirige vers /dashboard si déjà connecté
 *
 * 2. PROTECTION DU FLOW DE RECOMMANDATION
 *    Le flow est séquentiel et unidirectionnel :
 *      /dashboard → /dashboard/notes → /dashboard/recommendation
 *
 *    - /dashboard/notes n'est accessible que si une série a été sélectionnée
 *      (cookie "flow_serie" présent)
 *    - /dashboard/recommendation n'est accessible que si les notes ont été saisies
 *      (cookie "flow_notes" présent)
 *    - Tenter d'accéder à une étape sans avoir complété la précédente
 *      redirige vers la première étape manquante
 *
 * IMPORTANT — Comment ça fonctionne avec localStorage :
 *    Le middleware s'exécute côté serveur (Edge Runtime) et ne peut pas
 *    lire localStorage. On synchronise l'état via des cookies légers
 *    posés côté client par useAuth et les pages du flow.
 *
 *    Cookies utilisés :
 *    - session_exists=1    → posé par useAuth.saveSession(), supprimé au logout
 *    - flow_serie=1        → posé par /dashboard/page.tsx au handleSelect()
 *    - flow_notes=1        → posé par /dashboard/notes/page.tsx au handleSubmit()
 *    Ces cookies sont supprimés par /dashboard/recommendation après génération.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionExists = request.cookies.get("session_exists")?.value === "1";
  const flowSerie = request.cookies.get("flow_serie")?.value === "1";
  const flowNotes = request.cookies.get("flow_notes")?.value === "1";

  // -------------------------------------------------------------------------
  // 1. PROTECTION AUTH
  // -------------------------------------------------------------------------

  const isProtectedRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  if (isProtectedRoute && !sessionExists) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Routes publiques inaccessibles quand connecté (login, signup, homepage)
  const isAuthRoute =
    pathname === "/login" || pathname === "/signup" || pathname === "/";

  if (isAuthRoute && sessionExists) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // -------------------------------------------------------------------------
  // 2. PROTECTION DU FLOW (seulement si connecté)
  // -------------------------------------------------------------------------

  if (sessionExists) {
    // Étape 2 — /dashboard/notes : requiert flow_serie
    if (pathname === "/dashboard/notes" && !flowSerie) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Étape 3 — /dashboard/recommendation : requiert flow_serie + flow_notes
    if (pathname === "/dashboard/recommendation") {
      if (!flowSerie) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      if (!flowNotes) {
        return NextResponse.redirect(new URL("/dashboard/notes", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/admin/:path*", "/login", "/signup"],
};
