"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { seriesApi } from "@/lib/api";
import type { Serie } from "@/lib/types";

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

/** Page de sélection de la série — étape 1 */
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* En-tête */}
      <div className="mb-8 sm:mb-12">
        <p
          className="text-xs uppercase tracking-[0.15em] font-semibold mb-3"
          style={{ color: "var(--color-brand-accent)" }}
        >
          Étape 1 sur 4
        </p>
        <h1
          className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3"
          style={{ color: "var(--color-text-primary)" }}
        >
          Quelle est votre série ?
        </h1>
        <p
          className="text-sm sm:text-base max-w-lg"
          style={{ color: "var(--color-text-muted)" }}
        >
          Sélectionnez votre filière pour commencer la saisie de vos notes et
          obtenir votre recommandation d&apos;orientation.
        </p>
      </div>

      <StepIndicator
        current={0}
        steps={["Série", "Notes", "Profil", "Résultat"]}
      />

      {/* Grille des séries */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-24 sm:h-28 rounded-xl skeleton"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {series.map((serie, idx) => {
            const accent = getSerieAccent(serie.code);
            const shortLabel =
              serie.description ?? getSerieShortLabel(serie.code);

            return (
              <button
                key={serie.id}
                onClick={() => handleSelect(serie)}
                className="group relative text-left border rounded-xl p-5 sm:p-6 transition-all duration-300 overflow-hidden hover:-translate-y-0.5 hover:shadow-xl animate-fade-in-up"
                style={{
                  backgroundColor: "var(--color-bg-base)",
                  borderColor: "var(--color-border-default)",
                  animationDelay: `${idx * 60}ms`,
                  animationFillMode: "both",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor =
                    "var(--color-border-strong)";
                  e.currentTarget.style.boxShadow = `0 8px 32px ${accent}18`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor =
                    "var(--color-border-default)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Glow au hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at top left, ${accent}10, transparent 60%)`,
                  }}
                />

                {/* Barre colorée */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl opacity-30 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: accent }}
                />

                {/* Contenu */}
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <span
                    className="font-display text-2xl sm:text-3xl font-bold leading-none"
                    style={{ color: accent }}
                  >
                    {serie.code}
                  </span>
                  <svg
                    className="w-4 h-4 mt-1 transition-all duration-300 group-hover:translate-x-0.5 opacity-40 group-hover:opacity-100"
                    viewBox="0 0 16 16"
                    fill="none"
                    style={{ color: accent }}
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

                <p
                  className="text-xs sm:text-sm leading-snug line-clamp-2"
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

/* ---------------------------------------------------------------------------
 * StepIndicator — barre de progression multi-étapes partagée dans le dashboard
 * --------------------------------------------------------------------------- */

/**
 * @param current - index de l'étape active (0-based)
 * @param steps   - labels des étapes
 * @param done    - nombre d'étapes complétées (défaut : current)
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
    <div className="mb-8 sm:mb-10 overflow-x-auto">
      <div className="flex items-center gap-1 sm:gap-2 min-w-max">
        {steps.map((step, i) => {
          const isCompleted = i < completedCount;
          const isActive = i === current;

          return (
            <div key={step} className="flex items-center gap-1 sm:gap-2">
              {/* Cercle */}
              <div
                className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full text-[10px] sm:text-xs font-bold border-2 transition-all duration-300 shrink-0"
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
                          boxShadow: "0 0 0 3px var(--color-input-ring)",
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
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>

              {/* Label */}
              <span
                className="text-xs font-medium whitespace-nowrap"
                style={{
                  color: isActive
                    ? "var(--color-text-primary)"
                    : isCompleted
                      ? "var(--color-brand-accent)"
                      : "var(--color-text-disabled)",
                }}
              >
                {step}
              </span>

              {/* Connecteur */}
              {i < steps.length - 1 && (
                <div
                  className="w-6 sm:w-10 h-[1px] mx-0.5 sm:mx-1 shrink-0 transition-all duration-500"
                  style={{
                    background:
                      i < completedCount
                        ? "var(--gradient-brand)"
                        : "var(--color-border-default)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
