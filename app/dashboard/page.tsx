"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { seriesApi } from "@/lib/api";
import type { Serie } from "@/lib/types";

/**
 * Retourne la couleur d'accent associée à une série.
 * Ces couleurs sont des accents sémantiques par série - indépendants du thème.
 */
function getSerieAccent(code: string): string {
  if (!code) return "var(--color-brand-accent)";
  const c = code.toUpperCase();
  if (c.startsWith("A")) return "#818cf8";
  if (c.startsWith("C")) return "#34d399";
  if (c.startsWith("D")) return "#60a5fa";
  if (c.startsWith("F")) return "#f97316";
  if (c.startsWith("G1")) return "#a78bfa";
  if (c.startsWith("G2")) return "#fb923c";
  if (c.startsWith("G3")) return "#f472b6";
  return "#6b5dd3";
}

function getSerieShortLabel(code: string): string {
  const map: Record<string, string> = {
    A: "Lettres & Sciences Humaines",
    C: "Mathématiques & Physique",
    D: "Sciences de la Vie & Terre",
    F: "Sciences de l'Ingénieur",
    G1: "Techniques Commerciales",
    G2: "Comptabilité & Gestion",
    G3: "Secrétariat & Administration",
  };
  return map[code.toUpperCase()] ?? "Série générale";
}

/** Page de sélection de la série - dashboard principal */
export default function DashboardPage() {
  const router = useRouter();
  const [series, setSeries] = useState<Serie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    seriesApi
      .getAll()
      .then((res) => setSeries(res.series ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (serie: Serie) => {
    sessionStorage.setItem("selectedSerie", JSON.stringify(serie));
    document.cookie = "flow_serie=1; path=/; SameSite=Strict";
    document.cookie = "flow_notes=0; path=/; max-age=0; SameSite=Strict";
    router.push("/dashboard/notes");
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* En-tête */}
      <div className="mb-12">
        <p
          className="text-xs uppercase tracking-[0.15em] font-semibold mb-3"
          style={{ color: "var(--color-brand-accent)" }}
        >
          Étape 1 sur 3
        </p>
        <h1
          className="font-display text-3xl lg:text-4xl font-bold mb-3"
          style={{ color: "var(--color-text-primary)" }}
        >
          Quelle est votre série ?
        </h1>
        <p className="max-w-lg" style={{ color: "var(--color-text-muted)" }}>
          Sélectionnez votre filière pour commencer la saisie de vos notes et
          obtenir votre recommandation d&apos;orientation.
        </p>
      </div>

      {/* Indicateur de progression */}
      <StepIndicator current={0} steps={["Série", "Notes", "Résultat"]} />

      {/* Grille des séries */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-xl animate-pulse"
              style={{
                backgroundColor: "var(--color-bg-surface)",
                animationDelay: `${i * 80}ms`,
              }}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {series.map((serie) => {
            const accent = getSerieAccent(serie.code);
            const shortLabel =
              serie.description ?? getSerieShortLabel(serie.code);

            return (
              <button
                key={serie.id}
                onClick={() => handleSelect(serie)}
                className="group relative text-left border rounded-xl p-6 transition-all duration-300 overflow-hidden hover:-translate-y-0.5 hover:shadow-xl"
                style={{
                  backgroundColor: "var(--color-bg-base)",
                  borderColor: "var(--color-border-default)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor =
                    "var(--color-border-strong)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor =
                    "var(--color-border-default)";
                }}
              >
                {/* Glow hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at top left, ${accent}10, transparent 60%)`,
                  }}
                />

                {/* Barre latérale colorée */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl opacity-40 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: accent }}
                />

                {/* Code */}
                <div className="flex items-start justify-between mb-3">
                  <span
                    className="font-display text-3xl font-bold leading-none"
                    style={{ color: accent }}
                  >
                    {serie.code}
                  </span>
                  <svg
                    className="w-4 h-4 mt-1 transition-all duration-300 group-hover:translate-x-0.5"
                    viewBox="0 0 16 16"
                    fill="none"
                    style={{ color: "var(--color-border-strong)" }}
                  >
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* Description */}
                <p
                  className="text-sm leading-snug line-clamp-2 transition-colors duration-300 group-hover:text-[var(--color-text-secondary)]"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {shortLabel}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Composant indicateur d'étapes - partagé dans les pages dashboard
// ---------------------------------------------------------------------------

/**
 * Barre de progression multi-étapes.
 *
 * @param current - index de l'étape active (0-based)
 * @param steps   - labels des étapes
 * @param done    - nombre d'étapes déjà complétées (défaut : current)
 */
export function StepIndicator({
  current,
  steps,
  done,
}: {
  current: number;
  steps: string[];
  done?: number;
}) {
  const completedCount = done ?? current;

  return (
    <div className="flex items-center gap-2 mb-10">
      {steps.map((step, i) => {
        const isCompleted = i < completedCount;
        const isActive = i === current;

        return (
          <div key={step} className="flex items-center gap-2">
            <div
              className="flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold border transition-all"
              style={
                isCompleted
                  ? {
                      backgroundColor: "var(--color-accent-bg)",
                      borderColor: "var(--color-accent-border-md)",
                      color: "var(--color-brand-accent)",
                    }
                  : isActive
                    ? {
                        background: "var(--gradient-brand)",
                        borderColor: "transparent",
                        color: "var(--color-bg-base)",
                      }
                    : {
                        backgroundColor: "transparent",
                        borderColor: "var(--color-border-strong)",
                        color: "var(--color-text-disabled)",
                      }
              }
            >
              {isCompleted ? (
                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <span
              className="text-xs font-medium"
              style={{
                color: isActive
                  ? "var(--color-text-primary)"
                  : "var(--color-text-disabled)",
              }}
            >
              {step}
            </span>
            {i < steps.length - 1 && (
              <div
                className="w-8 h-[1px] mx-1"
                style={{ backgroundColor: "var(--color-border-default)" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
