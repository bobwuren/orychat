"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";

/**
 * Layout de la zone client authentifiée (/dashboard/*)
 *
 * Responsabilités (inchangées) :
 * - Redirige vers /login si l'utilisateur n'est pas authentifié
 * - Affiche la navbar avec lien Historique et bouton Déconnexion
 */
export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading, logout, user } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) router.replace("/login");
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#c9a84c]/30 border-t-[#c9a84c] rounded-full animate-spin" />
      </div>
    );
  }

  const navLinks = [
    { href: "/dashboard", label: "Analyse" },
    { href: "/dashboard/history", label: "Historique" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-[#0e0e0e]/95 backdrop-blur-md border-b border-[#1a1a1a]">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 group shrink-0"
          >
            <div className="relative w-6 h-6">
              <div className="absolute inset-0 bg-gradient-to-br from-[#c9a84c] to-[#e8c97a] rounded-sm rotate-45 group-hover:rotate-[60deg] transition-transform duration-500" />
              <div className="absolute inset-[2px] bg-[#0e0e0e] rounded-sm rotate-45" />
              <div className="absolute inset-[4px] bg-gradient-to-br from-[#c9a84c] to-[#e8c97a] rounded-sm rotate-45" />
            </div>
            <span className="font-display text-sm font-bold text-white tracking-tight">
              Orientys
            </span>
          </Link>

          {/* Navigation centrale */}
          <nav className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    "px-3 py-1.5 rounded text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-[#c9a84c]/10 text-[#c9a84c]"
                      : "text-[#666] hover:text-white hover:bg-[#141414]",
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions droite */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Initiale utilisateur */}
            {user?.email && (
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#c9a84c]/15 border border-[#c9a84c]/20 flex items-center justify-center text-[11px] font-bold text-[#c9a84c]">
                  {user.email[0].toUpperCase()}
                </div>
              </div>
            )}

            {/* Déconnexion */}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#555] hover:text-red-400 hover:bg-red-500/5 rounded transition-all duration-200"
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  d="M10.5 3.5H13a1 1 0 011 1v7a1 1 0 01-1 1h-2.5M7 5.5L10.5 8 7 10.5M10.5 8H2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      {/* Contenu */}
      <main className="relative">
        {/* Fond subtil */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.04),transparent_60%)]" />
        </div>
        <div className="relative">{children}</div>
      </main>
    </div>
  );
}
