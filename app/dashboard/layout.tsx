"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";
import OrientysLogo from "@/components/OrientysLogo";

/**
 * Layout de la zone client authentifiée (/dashboard/*)
 *
 * Responsabilités :
 * - Redirige vers /login si l'utilisateur n'est pas authentifié
 * - Affiche la navbar avec liens de navigation et bouton Déconnexion
 *
 * Couleurs via variables CSS du design system — aucune valeur hardcodée.
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
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--color-bg-base)" }}
      >
        <div
          className="w-6 h-6 border-2 rounded-full animate-spin"
          style={{
            borderColor: "var(--color-accent-border)",
            borderTopColor: "var(--color-brand-accent)",
          }}
        />
      </div>
    );
  }

  const navLinks = [
    { href: "/dashboard", label: "Analyse" },
    { href: "/dashboard/history", label: "Historique" },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-bg-page)" }}
    >
      {/* Navbar */}
      <header
        className="sticky top-0 z-50 backdrop-blur-md border-b"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--color-bg-base) 95%, transparent)",
          borderColor: "var(--color-border-default)",
        }}
      >
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 group shrink-0"
          >
            <OrientysLogo
              height={28}
              className="transition-transform duration-500 group-hover:scale-105"
            />
            <span
              className="font-display text-sm font-bold tracking-tight"
              style={{ color: "var(--color-text-primary)" }}
            >
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
                  className="px-3 py-1.5 rounded text-sm font-medium transition-all duration-200"
                  style={
                    isActive
                      ? {
                          backgroundColor: "var(--color-accent-bg)",
                          color: "var(--color-brand-accent)",
                        }
                      : {
                          color: "var(--color-text-muted)",
                        }
                  }
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions droite */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Avatar initiale */}
            {user?.email && (
              <div className="hidden sm:flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full border flex items-center justify-center text-[11px] font-bold"
                  style={{
                    backgroundColor: "var(--color-accent-bg)",
                    borderColor: "var(--color-accent-border)",
                    color: "var(--color-brand-accent)",
                  }}
                >
                  {user.email[0].toUpperCase()}
                </div>
              </div>
            )}

            {/* Déconnexion */}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded transition-all duration-200 hover:bg-red-500/5 hover:text-red-400"
              style={{ color: "var(--color-text-disabled)" }}
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
        <div
          className="fixed inset-0 pointer-events-none"
          style={{ background: "var(--gradient-hero-radial)" }}
        />
        <div className="relative">{children}</div>
      </main>
    </div>
  );
}
