"use client";

/**
 * BackButton
 *
 * Bouton "Page précédente" pour la page 404.
 * Séparé de not-found.tsx qui est un Server Component.
 */
export default function BackButton() {
  return (
    <button
      onClick={() => history.back()}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border text-sm font-medium transition-all duration-200"
      style={{
        backgroundColor: "var(--color-bg-surface)",
        borderColor: "var(--color-border-default)",
        color: "var(--color-text-muted)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "var(--color-text-primary)";
        e.currentTarget.style.borderColor = "var(--color-border-strong)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "var(--color-text-muted)";
        e.currentTarget.style.borderColor = "var(--color-border-default)";
      }}
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
