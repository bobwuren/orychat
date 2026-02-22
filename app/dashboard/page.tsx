"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { seriesApi } from "@/lib/api";
import type { Serie } from "@/lib/types";

/**
 * Retourne la couleur d'accent associée à une série.
 * Utilisée pour la décoration des cartes.
 */
function getSerieAccent(code: string): string {
  if (!code) return "#c9a84c";
  const c = code.toUpperCase();
  if (c.startsWith("A")) return "#818cf8"; // indigo
  if (c.startsWith("C")) return "#34d399"; // emerald
  if (c.startsWith("D")) return "#60a5fa"; // blue
  if (c.startsWith("F")) return "#f97316"; // orange
  if (c.startsWith("G1")) return "#a78bfa"; // violet
  if (c.startsWith("G2")) return "#fb923c"; // orange clair
  if (c.startsWith("G3")) return "#f472b6"; // pink
  return "#c9a84c";
}

/**
 * Retourne un label de description courte par série.
 */
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

/** Page de sélection de la série — dashboard principal */
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
    // Cookie lu par le middleware pour autoriser /dashboard/notes
    document.cookie = "flow_serie=1; path=/; SameSite=Strict";
    // Réinitialise l'étape suivante si on recommence depuis le début
    document.cookie = "flow_notes=0; path=/; max-age=0; SameSite=Strict";
    router.push("/dashboard/notes");
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* En-tête */}
      <div className="mb-12">
        <p className="text-xs uppercase tracking-[0.15em] text-[#c9a84c] font-semibold mb-3">
          Étape 1 sur 3
        </p>
        <h1 className="font-display text-3xl lg:text-4xl font-bold text-white mb-3">
          Quelle est votre série ?
        </h1>
        <p className="text-[#666] max-w-lg">
          Sélectionnez votre filière pour commencer la saisie de vos notes et
          obtenir votre recommandation d&apos;orientation.
        </p>
      </div>

      {/* Indicateur de progression */}
      <div className="flex items-center gap-2 mb-10">
        {["Série", "Notes", "Résultat"].map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <div
              className={[
                "flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold border transition-all",
                i === 0
                  ? "bg-[#c9a84c] border-[#c9a84c] text-[#0e0e0e]"
                  : "border-[#2a2a2a] text-[#444]",
              ].join(" ")}
            >
              {i + 1}
            </div>
            <span
              className={[
                "text-xs font-medium",
                i === 0 ? "text-white" : "text-[#444]",
              ].join(" ")}
            >
              {step}
            </span>
            {i < 2 && <div className="w-8 h-[1px] bg-[#1e1e1e] mx-1" />}
          </div>
        ))}
      </div>

      {/* Grille des séries */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-xl bg-[#141414] animate-pulse"
              style={{ animationDelay: `${i * 80}ms` }}
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
                className="group relative text-left bg-[#0e0e0e] border border-[#1a1a1a] rounded-xl p-6 hover:border-[#2a2a2a] transition-all duration-300 overflow-hidden hover:-translate-y-0.5 hover:shadow-xl"
                style={{
                  ["--accent" as string]: accent,
                }}
              >
                {/* Glow hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at top left, ${accent}08, transparent 60%)`,
                  }}
                />

                {/* Barre latérale colorée */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl opacity-40 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: accent }}
                />

                {/* Code de la série */}
                <div className="flex items-start justify-between mb-3">
                  <span
                    className="font-display text-3xl font-bold leading-none"
                    style={{ color: accent }}
                  >
                    {serie.code}
                  </span>
                  <svg
                    className="w-4 h-4 text-[#333] group-hover:text-[#666] group-hover:translate-x-0.5 transition-all duration-300 mt-1"
                    viewBox="0 0 16 16"
                    fill="none"
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
                <p className="text-sm text-[#555] group-hover:text-[#888] transition-colors duration-300 leading-snug line-clamp-2">
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
