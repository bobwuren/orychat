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
 * - Redirige vers /login si non authentifié
 * - Navbar sticky avec logo, navigation et déconnexion
 * - Fond décoratif radial fixe
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
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-8 h-8 border-2 rounded-full animate-spin"
            style={{
              borderColor: "var(--color-accent-border)",
              borderTopColor: "var(--color-brand-accent)",
            }}
          />
          <p
            className="text-xs"
            style={{ color: "var(--color-text-disabled)" }}
          >
            Chargement…
          </p>
        </div>
      </div>
    );
  }

  const navLinks = [
    {
      href: "/dashboard",
      label: "Analyse",
      icon: (
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      href: "/dashboard/history",
      label: "Historique",
      icon: (
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-bg-page)" }}
    >
      {/* Navbar */}
      <header
        className="sticky top-0 z-50 backdrop-blur-xl border-b"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--color-bg-base) 94%, transparent)",
          borderColor: "var(--color-border-default)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 sm:gap-2.5 group shrink-0"
          >
            <OrientysLogo
              width={32}
              height={32}
              className="transition-transform duration-500 group-hover:scale-105"
            />
            <span
              className="font-display text-base sm:text-lg font-bold tracking-tight hidden sm:block"
              style={{ color: "var(--color-text-primary)" }}
            >
              Orientys
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200"
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
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "var(--color-text-primary)";
                      e.currentTarget.style.backgroundColor =
                        "var(--color-bg-surface)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "var(--color-text-muted)";
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <span className="hidden sm:block">{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions droite */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Avatar */}
            {user?.email && (
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center text-[11px] font-bold"
                style={{
                  backgroundColor: "var(--color-accent-bg)",
                  borderColor: "var(--color-accent-border-md)",
                  color: "var(--color-brand-accent)",
                }}
                title={user.email}
              >
                {user.email[0].toUpperCase()}
              </div>
            )}

            {/* Déconnexion */}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs rounded-lg transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
              style={{ color: "var(--color-text-disabled)" }}
              title="Se déconnecter"
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

      {/* Contenu principal */}
      <main className="relative">
        <div
          className="fixed inset-0 pointer-events-none"
          style={{ background: "var(--gradient-hero-radial)", opacity: 0.6 }}
        />
        <div className="relative">{children}</div>
      </main>
    </div>
  );
}
