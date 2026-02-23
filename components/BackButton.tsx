"use client";

/**
 * BackButton
 *
 * Composant client minimal pour le bouton "Page précédente" de la 404.
 * Séparé de not-found.tsx qui est un Server Component.
 */
export default function BackButton() {
  return (
    <button
      onClick={() => history.back()}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#141414] border border-[#1e1e1e] text-[#888] text-sm font-medium hover:text-white hover:border-[#2a2a2a] transition-all"
    >
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
        <path
          d="M13 8H3M7 4l-4 4 4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Page précédente
    </button>
  );
}
