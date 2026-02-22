"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";

/**
 * Layout de la zone admin (/admin/*)
 *
 * Responsabilités (inchangées) :
 * - Redirige vers /login si non authentifié
 * - Redirige vers / si rôle !== admin
 * - Sidebar de navigation avec toutes les sections admin
 * - Collapsible sur mobile
 */

const NAV_ITEMS = [
  {
    href: "/admin/users",
    label: "Utilisateurs",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: "/admin/series",
    label: "Séries",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: "/admin/subjects",
    label: "Matières",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: "/admin/universities",
    label: "Universités",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 10.5v9.75a.75.75 0 00.75.75h4.5a.75.75 0 00.75-.75V15a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v5.25a.75.75 0 00.75.75h4.5a.75.75 0 00.75-.75V10.5M12 3L2.25 10.5M21.75 10.5L12 3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: "/admin/degrees",
    label: "Diplômes",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: "/admin/recommendations",
    label: "Recommandations",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: "/admin/consultations",
    label: "Consultations",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: "/admin/counselors",
    label: "Conseillers",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading, logout, user, role } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) router.replace("/login");
    else if (role !== "admin") router.replace("/");
  }, [loading, isAuthenticated, role, router]);

  if (loading || !isAuthenticated || role !== "admin") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#c9a84c]/30 border-t-[#c9a84c] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* ── Overlay mobile ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={[
          "fixed top-0 left-0 bottom-0 z-40 w-60 flex flex-col bg-[#0e0e0e] border-r border-[#1a1a1a] transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-[#1a1a1a] shrink-0">
          <div className="relative w-6 h-6">
            <div className="absolute inset-0 bg-gradient-to-br from-[#c9a84c] to-[#e8c97a] rounded-sm rotate-45" />
            <div className="absolute inset-[2px] bg-[#0e0e0e] rounded-sm rotate-45" />
            <div className="absolute inset-[4px] bg-gradient-to-br from-[#c9a84c] to-[#e8c97a] rounded-sm rotate-45" />
          </div>
          <div>
            <span className="font-display text-sm font-bold text-white tracking-tight block">Orientys</span>
            <span className="text-[10px] text-[#c9a84c] font-semibold uppercase tracking-[0.12em]">Admin</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={[
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20"
                    : "text-[#555] hover:text-white hover:bg-[#141414] border border-transparent",
                ].join(" ")}
              >
                <span className={isActive ? "text-[#c9a84c]" : "text-[#444]"}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Profil + déconnexion */}
        <div className="px-3 py-4 border-t border-[#1a1a1a] space-y-1 shrink-0">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-[#c9a84c]/15 border border-[#c9a84c]/20 flex items-center justify-center text-[11px] font-bold text-[#c9a84c] shrink-0">
              {user?.email?.[0]?.toUpperCase() ?? "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{user?.name ?? user?.email}</p>
              <p className="text-[10px] text-[#444]">Administrateur</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#555] hover:text-red-400 hover:bg-red-500/5 border border-transparent transition-all duration-200"
          >
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M10.5 3.5H13a1 1 0 011 1v7a1 1 0 01-1 1h-2.5M7 5.5L10.5 8 7 10.5M10.5 8H2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ── Zone principale ── */}
      <div className="flex-1 flex flex-col lg:pl-60">
        {/* Topbar mobile */}
        <header className="lg:hidden sticky top-0 z-20 h-14 flex items-center justify-between px-4 bg-[#0e0e0e]/95 backdrop-blur-md border-b border-[#1a1a1a]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col justify-center items-center w-8 h-8 gap-[5px]"
          >
            <span className="block w-5 h-[1.5px] bg-white" />
            <span className="block w-5 h-[1.5px] bg-white" />
            <span className="block w-5 h-[1.5px] bg-white" />
          </button>
          <span className="font-display text-sm font-bold text-white">Orientys Admin</span>
          <div className="w-8" />
        </header>

        {/* Contenu */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}