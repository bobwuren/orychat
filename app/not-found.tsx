import Link from "next/link";
import type { Metadata } from "next";
import BackButton from "@/components/BackButton";

export const metadata: Metadata = {
  title: "Page introuvable — Orientys",
  description: "Cette page n'existe pas ou a été déplacée.",
};

/**
 * Page 404 — not-found.tsx
 *
 * Next.js App Router : ce fichier doit s'appeler not-found.tsx à la racine de /app
 * pour être utilisé comme 404 global.
 *
 * Header + Footer injectés par ConditionalShell.
 */

const QUICK_LINKS = [
  { href: "/", label: "Accueil", desc: "Retour à la page principale" },
  { href: "/login", label: "Connexion", desc: "Accédez à votre compte" },
  {
    href: "/signup",
    label: "Inscription",
    desc: "Créez votre compte gratuitement",
  },
  { href: "/contact", label: "Contact", desc: "Contactez notre équipe" },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Zone centrale */}
      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-2xl mx-auto text-center">
          {/* Numéro 404 décoratif */}
          <div className="relative inline-block mb-8">
            <p
              className="text-[10rem] md:text-[14rem] font-display font-bold leading-none select-none"
              style={{
                background:
                  "linear-gradient(135deg, #1a1a1a 0%, #222 50%, #1a1a1a 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              404
            </p>
            {/* Diamond décoratif centré */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="relative w-16 h-16 opacity-80">
                <div className="absolute inset-0 bg-gradient-to-br from-[#c9a84c] to-[#e8c97a] rounded-xl rotate-45" />
                <div className="absolute inset-[3px] bg-[#0a0a0a] rounded-xl rotate-45" />
                <div className="absolute inset-[7px] bg-gradient-to-br from-[#c9a84c] to-[#e8c97a] rounded-lg rotate-45" />
              </div>
            </div>
          </div>

          {/* Message */}
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Cette page est introuvable
          </h1>
          <p className="text-[#555] text-base leading-relaxed max-w-md mx-auto mb-10">
            La page que vous cherchez n'existe pas, a été déplacée ou l'URL est
            incorrecte. Voici quelques liens utiles pour vous orienter.
          </p>

          {/* CTA principal */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#c9a84c] to-[#e8c97a] text-[#0e0e0e] text-sm font-bold hover:brightness-110 transition-all"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Retour à l'accueil
            </Link>
            {/* Composant client — history.back() interdit dans un Server Component */}
            <BackButton />
          </div>

          {/* Liens rapides */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {QUICK_LINKS.map(({ href, label, desc }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col gap-1.5 p-4 bg-[#0e0e0e] border border-[#1a1a1a] rounded-xl hover:border-[#c9a84c]/25 hover:bg-[#c9a84c]/[0.03] transition-all duration-200 text-left"
              >
                <span className="text-sm font-semibold text-white group-hover:text-[#c9a84c] transition-colors">
                  {label}
                </span>
                <span className="text-xs text-[#444] group-hover:text-[#666] transition-colors leading-snug">
                  {desc}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
