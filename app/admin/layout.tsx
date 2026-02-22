"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";

/**
 * Layout admin — Topbar persistante + Sidebar collapsible
 *
 * Structure visuelle :
 *   ┌──────────────────────────────────────────────────┐
 *   │  [Logo] [Collapse] ···············  [Profil]     │  ← TOPBAR h-14 fixée
 *   ├─────────┬────────────────────────────────────────┤
 *   │ SIDEBAR │                                        │
 *   │ (icons  │            CONTENU                     │
 *   │ ou full)│                                        │
 *   └─────────┴────────────────────────────────────────┘
 *
 * États :
 * - Desktop : collapsed (w-16, icônes + tooltips) ↔ expanded (w-60, icônes + labels)
 * - Mobile  : sidebar cachée → overlay slide depuis la gauche via bouton hamburger
 */

const NAV_ITEMS = [
  {
    href: "/admin/users",
    label: "Utilisateurs",
    icon: (
      <svg
        className="w-4 h-4 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "/admin/series",
    label: "Séries",
    icon: (
      <svg
        className="w-4 h-4 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "/admin/subjects",
    label: "Matières",
    icon: (
      <svg
        className="w-4 h-4 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "/admin/universities",
    label: "Universités",
    icon: (
      <svg
        className="w-4 h-4 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          d="M4 10.5v9.75a.75.75 0 00.75.75h4.5a.75.75 0 00.75-.75V15a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v5.25a.75.75 0 00.75.75h4.5a.75.75 0 00.75-.75V10.5M12 3L2.25 10.5M21.75 10.5L12 3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "/admin/degrees",
    label: "Diplômes",
    icon: (
      <svg
        className="w-4 h-4 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "/admin/recommendations",
    label: "Recommandations",
    icon: (
      <svg
        className="w-4 h-4 shrink-0"
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
    href: "/admin/consultations",
    label: "Consultations",
    icon: (
      <svg
        className="w-4 h-4 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "/admin/counselors",
    label: "Conseillers",
    icon: (
      <svg
        className="w-4 h-4 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading, logout, user, role } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) router.replace("/login");
    else if (role !== "admin") router.replace("/");
  }, [loading, isAuthenticated, role, router]);

  // Fermeture automatique du menu mobile lors d'un changement de route
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (loading || !isAuthenticated || role !== "admin") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#c9a84c]/30 border-t-[#c9a84c] rounded-full animate-spin" />
      </div>
    );
  }

  const currentSection = NAV_ITEMS.find((item) =>
    pathname.startsWith(item.href),
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* ══════════════════════════════════════════
          TOPBAR — fixée, pleine largeur, z-50
      ══════════════════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#0e0e0e]/98 backdrop-blur-md border-b border-[#1a1a1a] flex items-center">
        {/* Bloc gauche : logo + bouton toggle */}
        <div
          className={[
            "flex items-center h-full border-r border-[#1a1a1a] shrink-0 transition-all duration-300",
            collapsed ? "w-16 justify-center" : "w-60 px-4 gap-3",
          ].join(" ")}
        >
          {/* Diamond logo */}
          <div className="relative w-6 h-6 shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#c9a84c] to-[#e8c97a] rounded-sm rotate-45" />
            <div className="absolute inset-[2px] bg-[#0e0e0e] rounded-sm rotate-45" />
            <div className="absolute inset-[4px] bg-gradient-to-br from-[#c9a84c] to-[#e8c97a] rounded-sm rotate-45" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <span className="font-display text-sm font-bold text-white tracking-tight block leading-none">
                Orientys
              </span>
              <span className="text-[10px] text-[#c9a84c] font-semibold uppercase tracking-[0.12em]">
                Admin
              </span>
            </div>
          )}
        </div>

        {/* Bouton collapse desktop */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="hidden lg:flex w-10 h-10 ml-2 items-center justify-center rounded-lg text-[#444] hover:text-white hover:bg-[#141414] transition-all shrink-0"
          title={collapsed ? "Déplier la navigation" : "Réduire la navigation"}
        >
          {collapsed ? (
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
              <path
                d="M5 4l4 4-4 4M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
              <path
                d="M11 4L7 8l4 4M7 4L3 8l4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>

        {/* Hamburger mobile */}
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="lg:hidden flex w-10 h-10 ml-2 items-center justify-center rounded-lg text-[#444] hover:text-white hover:bg-[#141414] transition-all shrink-0"
          title="Menu"
        >
          {mobileOpen ? (
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 3l10 10M13 3L3 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 4h12M2 8h12M2 12h12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>

        {/* Breadcrumb / section active */}
        <div className="flex-1 flex items-center gap-2 px-4 min-w-0">
          {currentSection && (
            <>
              <span className="text-[#2a2a2a] hidden sm:block">
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M6 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-sm text-[#555] truncate hidden sm:block font-medium">
                {currentSection.label}
              </span>
            </>
          )}
        </div>

        {/* Profil + actions droite */}
        <div className="flex items-center gap-2 pr-4 shrink-0">
          {/* Bouton notifications */}
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[#444] hover:text-white hover:bg-[#141414] transition-all">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Séparateur */}
          <div className="w-px h-6 bg-[#1e1e1e] mx-1" />

          {/* Avatar + nom + déconnexion */}
          <div className="flex items-center gap-2.5">
            {/* Avatar initiale */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c9a84c]/20 to-[#c9a84c]/5 border border-[#c9a84c]/25 flex items-center justify-center text-xs font-bold text-[#c9a84c] shrink-0 select-none">
              {user?.name?.[0]?.toUpperCase() ??
                user?.email?.[0]?.toUpperCase() ??
                "A"}
            </div>

            {/* Nom + rôle — caché sur mobile */}
            <div className="hidden md:block leading-none">
              <p className="text-xs font-semibold text-white truncate max-w-[100px]">
                {user?.name ?? user?.email?.split("@")[0] ?? "Admin"}
              </p>
              <p className="text-[10px] text-[#c9a84c] mt-0.5">
                Administrateur
              </p>
            </div>

            {/* Déconnexion */}
            <button
              onClick={logout}
              title="Déconnexion"
              className="w-7 h-7 flex items-center justify-center rounded-lg text-[#444] hover:text-red-400 hover:bg-red-500/10 transition-all"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                <path
                  d="M10.5 3.5H13a1 1 0 011 1v7a1 1 0 01-1 1h-2.5M7 5.5L10.5 8 7 10.5M10.5 8H2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════
          Sous la topbar
      ══════════════════════════════════════════ */}
      <div className="flex pt-14 min-h-screen">
        {/* Overlay mobile */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/60 lg:hidden"
            style={{ top: "56px" }}
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* ── SIDEBAR ── */}
        <aside
          className={[
            // Base
            "fixed top-14 left-0 bottom-0 z-40 flex flex-col bg-[#0e0e0e] border-r border-[#1a1a1a] transition-all duration-300 overflow-x-hidden",
            // Desktop : toujours visible, largeur variable
            collapsed ? "hidden lg:flex lg:w-16" : "hidden lg:flex lg:w-60",
            // Mobile : visible si mobileOpen
            mobileOpen ? "!flex w-64" : "",
          ].join(" ")}
        >
          <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-0.5">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed && !mobileOpen ? item.label : undefined}
                  className={[
                    "flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                    collapsed && !mobileOpen
                      ? "justify-center px-0 py-3"
                      : "px-3 py-2.5",
                    isActive
                      ? "bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20"
                      : "text-[#555] hover:text-white hover:bg-[#141414] border border-transparent",
                  ].join(" ")}
                >
                  {/* Icône */}
                  <span
                    className={
                      isActive
                        ? "text-[#c9a84c]"
                        : "text-[#444] group-hover:text-[#888] transition-colors"
                    }
                  >
                    {item.icon}
                  </span>

                  {/* Label — masqué en mode collapsed sur desktop */}
                  {(!collapsed || mobileOpen) && (
                    <span className="truncate">{item.label}</span>
                  )}

                  {/* Indicateur actif (collapsed) */}
                  {isActive && collapsed && !mobileOpen && (
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#c9a84c] rounded-full" />
                  )}

                  {/* Tooltip (collapsed desktop uniquement) */}
                  {collapsed && !mobileOpen && (
                    <span className="absolute left-full ml-2.5 px-2.5 py-1.5 bg-[#1a1a1a] border border-[#252525] text-white text-xs font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all whitespace-nowrap z-50 shadow-lg">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Version — visible uniquement en mode expanded */}
          {(!collapsed || mobileOpen) && (
            <div className="px-5 py-4 border-t border-[#111] shrink-0">
              <p className="text-[10px] text-[#2a2a2a] font-medium">v1.0.0</p>
            </div>
          )}
        </aside>

        {/* ── CONTENU ── */}
        <main
          className={[
            "flex-1 min-h-full transition-all duration-300",
            collapsed ? "lg:pl-16" : "lg:pl-60",
          ].join(" ")}
        >
          <div className="p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
