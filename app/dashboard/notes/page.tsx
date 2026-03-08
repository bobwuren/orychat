"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Serie, SubjectWithCoefficients } from "@/lib/types";
import { subjectsApi } from "@/lib/api";
import { useAuth } from "@/lib/hooks/useAuth";

/** Page de saisie des notes par matière */
export default function NotesPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [serie, setSerie] = useState<Serie | null>(null);
  const [subjects, setSubjects] = useState<SubjectWithCoefficients[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedSerie");
    if (!stored) {
      router.replace("/dashboard");
      return;
    }

    const s: Serie = JSON.parse(stored);
    setSerie(s);

    subjectsApi
      .getBySerie(s.id)
      .then((res: any) => {
        const list: SubjectWithCoefficients[] = Array.isArray(res)
          ? res
          : (res.subjects ?? []);
        setSubjects(list);
        const init: Record<string, string> = {};
        list.forEach((sub) => {
          init[sub.id] = "";
        });
        setNotes(init);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

  const handleChange = (id: string, value: string) => {
    if (value === "" || (parseFloat(value) >= 0 && parseFloat(value) <= 20)) {
      setNotes((prev) => ({ ...prev, [id]: value }));
      if (error) setError(null);
    }
  };

  const handleSubmit = () => {
    const missing = subjects.filter(
      (s) => notes[s.id] === "" || notes[s.id] === undefined,
    );
    if (missing.length > 0) {
      setError(
        `${missing.length} matière${missing.length > 1 ? "s" : ""} sans note`,
      );
      return;
    }

    const notesPayload = subjects.map((s) => ({
      subjectId: s.id,
      value: parseFloat(notes[s.id]),
      subjectName: s.name,
      coefficient:
        s.seriesCoefficients?.find((sc) => sc.serieId === serie?.id)
          ?.coefficient ??
        s.coefficient ??
        1,
    }));

    sessionStorage.setItem("notesPayload", JSON.stringify(notesPayload));

    // Cookie lu par le middleware pour autoriser les étapes suivantes
    document.cookie = "flow_notes=1; path=/; SameSite=Strict";

    // Aller au questionnaire (étape 3) avant la génération IA
    router.push("/dashboard/questionnaire");
  };

  const filledCount = subjects.filter(
    (s) => notes[s.id] !== "" && notes[s.id] !== undefined,
  ).length;
  const progress =
    subjects.length > 0 ? (filledCount / subjects.length) * 100 : 0;

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-16 rounded-xl bg-[#141414] animate-pulse"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      {/* Retour */}
      <button
        onClick={() => router.push("/dashboard")}
        className="flex items-center gap-2 text-sm text-[#555] hover:text-white transition-colors mb-10 group"
      >
        <svg
          className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M13 8H3M7 4l-4 4 4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Changer de série
      </button>

      {/* En-tête */}
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.15em] text-[#c9a84c] font-semibold mb-3">
          Étape 2 sur 4
        </p>
        <h1 className="font-display text-3xl lg:text-4xl font-bold text-white mb-2">
          Vos notes
        </h1>
        <p className="text-[#666]">
          Série <span className="text-white font-semibold">{serie?.code}</span>
          {serie?.description && (
            <span className="text-[#555]"> — {serie.description}</span>
          )}
        </p>
      </div>

      {/* Indicateur de progression */}
      <div className="flex items-center gap-2 mb-10">
        {["Série", "Notes", "Profil", "Résultat"].map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <div
              className={[
                "flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold border transition-all",
                i === 0
                  ? "bg-[#c9a84c]/20 border-[#c9a84c]/40 text-[#c9a84c]"
                  : i === 1
                    ? "bg-[#c9a84c] border-[#c9a84c] text-[#0e0e0e]"
                    : "border-[#2a2a2a] text-[#444]",
              ].join(" ")}
            >
              {i === 0 ? (
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
              className={[
                "text-xs font-medium",
                i === 1 ? "text-white" : "text-[#444]",
              ].join(" ")}
            >
              {step}
            </span>
            {i < 3 && <div className="w-8 h-[1px] bg-[#1e1e1e] mx-1" />}
          </div>
        ))}
      </div>

      {/* Barre de progression saisie */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[#555]">
            {filledCount} / {subjects.length} matières renseignées
          </span>
          <span className="text-xs text-[#c9a84c] font-semibold">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#c9a84c] to-[#e8c97a] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Liste des matières */}
      <div className="flex flex-col gap-2.5">
        {subjects.map((subject) => {
          const coeff =
            subject.seriesCoefficients?.find((sc) => sc.serieId === serie?.id)
              ?.coefficient ??
            subject.coefficient ??
            1;
          const value = notes[subject.id] ?? "";
          const isFilled = value !== "";
          const numValue = parseFloat(value);

          return (
            <div
              key={subject.id}
              className={[
                "group flex items-center gap-4 px-5 py-4 bg-[#0e0e0e] border rounded-xl transition-all duration-200",
                isFilled
                  ? "border-[#2a2a2a]"
                  : "border-[#141414] hover:border-[#1e1e1e]",
              ].join(" ")}
            >
              {/* Indicateur rempli */}
              <div
                className={[
                  "w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-300",
                  isFilled ? "bg-[#c9a84c]" : "bg-[#2a2a2a]",
                ].join(" ")}
              />

              {/* Nom matière */}
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-white truncate block">
                  {subject.name}
                </span>
              </div>

              {/* Coefficient */}
              <span className="shrink-0 text-[11px] font-semibold text-[#444] bg-[#141414] px-2 py-0.5 rounded">
                coef. {coeff}
              </span>

              {/* Input note */}
              <div className="relative shrink-0">
                <input
                  type="number"
                  min={0}
                  max={20}
                  step={0.5}
                  placeholder="—"
                  value={value}
                  onChange={(e) => handleChange(subject.id, e.target.value)}
                  className={[
                    "w-20 px-3 py-2 text-center text-sm font-semibold rounded-lg bg-[#141414] border transition-all duration-200 focus:outline-none focus:ring-1",
                    isFilled && numValue >= 10
                      ? "border-[#2a2a2a] text-white focus:border-[#c9a84c] focus:ring-[#c9a84c]/20"
                      : isFilled && numValue < 10
                        ? "border-[#2a2a2a] text-[#f87171] focus:border-[#f87171] focus:ring-red-500/20"
                        : "border-[#1e1e1e] text-white placeholder:text-[#333] focus:border-[#c9a84c] focus:ring-[#c9a84c]/20",
                  ].join(" ")}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Erreur */}
      {error && (
        <div className="mt-5 flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <svg
            className="w-4 h-4 text-red-400 shrink-0"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M8 5v3M8 11h.01M14.5 8a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-sm text-red-400">{error}</span>
        </div>
      )}

      {/* Bouton soumettre */}
      <button
        onClick={handleSubmit}
        disabled={filledCount < subjects.length}
        className="group relative w-full mt-8 py-4 font-semibold text-sm text-[#0e0e0e] rounded-xl overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-[#c9a84c] to-[#e8c97a] transition-transform duration-300 group-hover:scale-105 group-disabled:scale-100" />
        <span className="relative flex items-center justify-center gap-2">
          Continuer
          <svg
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
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
        </span>
      </button>
    </div>
  );
}
