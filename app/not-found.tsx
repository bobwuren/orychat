import Link from "next/link";
import type { Metadata } from "next";
import BackButton from "@/components/BackButton";

export const metadata: Metadata = {
  title: "Page introuvable - Orientys",
  description: "Cette page n'existe pas ou a été déplacée.",
};

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--color-bg-page)" }}
    >
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 */}
          <div className="relative inline-block mb-6 sm:mb-8">
            <p
              className="text-[7rem] sm:text-[10rem] md:text-[14rem] font-display font-bold leading-none select-none text-transparent bg-clip-text"
              style={{
                backgroundImage: `linear-gradient(135deg, var(--color-border-default) 0%, var(--color-border-strong) 50%, var(--color-border-default) 100%)`,
              }}
            >
              404
            </p>
          </div>

          <h1
            className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4"
            style={{ color: "var(--color-text-primary)" }}
          >
            Cette page est introuvable
          </h1>
          <p
            className="text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-8 sm:mb-10"
            style={{ color: "var(--color-text-muted)" }}
          >
            La page que vous cherchez n&apos;existe pas, a été déplacée ou
            l&apos;URL est incorrecte.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-xl text-sm font-bold transition-all hover:brightness-110 w-full sm:w-auto justify-center"
              style={{
                background: "var(--gradient-brand)",
                color: "var(--color-bg-base)",
              }}
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
              Retour à l&apos;accueil
            </Link>
            <BackButton />
          </div>
        </div>
      </div>
    </div>
  );
}
