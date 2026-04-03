"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Serie, SubjectWithCoefficients } from "@/lib/types";
import { subjectsApi } from "@/lib/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { StepIndicator } from "@/app/dashboard/page";

/** Page de saisie des notes par matière - étape 2 */
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
    document.cookie = "flow_notes=1; path=/; SameSite=Strict";
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
              className="h-16 rounded-xl animate-pulse"
              style={{
                backgroundColor: "var(--color-bg-surface)",
                animationDelay: `${i * 80}ms`,
              }}
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
        className="flex items-center gap-2 text-sm mb-10 group transition-colors duration-200"
        style={{ color: "var(--color-text-muted)" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "var(--color-text-primary)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "var(--color-text-muted)";
        }}
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
        <p
          className="text-xs uppercase tracking-[0.15em] font-semibold mb-3"
          style={{ color: "var(--color-brand-accent)" }}
        >
          Étape 2 sur 4
        </p>
        <h1
          className="font-display text-3xl lg:text-4xl font-bold mb-2"
          style={{ color: "var(--color-text-primary)" }}
        >
          Vos notes
        </h1>
        <p style={{ color: "var(--color-text-muted)" }}>
          Série{" "}
          <span
            className="font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {serie?.code}
          </span>
          {serie?.description && (
            <span style={{ color: "var(--color-text-disabled)" }}>
              {" "}
              - {serie.description}
            </span>
          )}
        </p>
      </div>

      <StepIndicator
        current={1}
        steps={["Série", "Notes", "Profil", "Résultat"]}
        done={1}
      />

      {/* Barre de progression saisie */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-xs"
            style={{ color: "var(--color-text-disabled)" }}
          >
            {filledCount} / {subjects.length} matières renseignées
          </span>
          <span
            className="text-xs font-semibold"
            style={{ color: "var(--color-brand-accent)" }}
          >
            {Math.round(progress)}%
          </span>
        </div>
        <div
          className="h-1 rounded-full overflow-hidden"
          style={{ backgroundColor: "var(--color-bg-elevated)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: "var(--gradient-brand)",
            }}
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
              className="group flex items-center gap-4 px-5 py-4 border rounded-xl transition-all duration-200"
              style={{
                backgroundColor: "var(--color-bg-base)",
                borderColor: isFilled
                  ? "var(--color-border-strong)"
                  : "var(--color-border-subtle)",
              }}
            >
              {/* Indicateur */}
              <div
                className="w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-300"
                style={{
                  backgroundColor: isFilled
                    ? "var(--color-brand-accent)"
                    : "var(--color-border-strong)",
                }}
              />

              {/* Nom */}
              <div className="flex-1 min-w-0">
                <span
                  className="text-sm font-medium truncate block"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {subject.name}
                </span>
              </div>

              {/* Coefficient */}
              <span
                className="shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded"
                style={{
                  color: "var(--color-text-disabled)",
                  backgroundColor: "var(--color-bg-surface)",
                }}
              >
                coef. {coeff}
              </span>

              {/* Input note */}
              <input
                type="number"
                min={0}
                max={20}
                step={0.5}
                placeholder="-"
                value={value}
                onChange={(e) => handleChange(subject.id, e.target.value)}
                className="w-20 px-3 py-2 text-center text-sm font-semibold rounded-lg border transition-all duration-200 focus:outline-none focus:ring-1 shrink-0"
                style={{
                  backgroundColor: "var(--color-bg-surface)",
                  borderColor: "var(--color-border-default)",
                  color:
                    isFilled && numValue < 10
                      ? "var(--color-state-error)"
                      : "var(--color-text-primary)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor =
                    "var(--color-input-border-focus)";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px var(--color-input-ring)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor =
                    "var(--color-border-default)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Erreur */}
      {error && (
        <div
          className="mt-5 flex items-center gap-2 px-4 py-3 border rounded-lg"
          style={{
            backgroundColor: "var(--color-state-error-bg)",
            borderColor: "var(--color-state-error-border)",
          }}
        >
          <svg
            className="w-4 h-4 shrink-0"
            viewBox="0 0 16 16"
            fill="none"
            style={{ color: "var(--color-state-error)" }}
          >
            <path
              d="M8 5v3M8 11h.01M14.5 8a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
          <span
            className="text-sm"
            style={{ color: "var(--color-state-error)" }}
          >
            {error}
          </span>
        </div>
      )}

      {/* Bouton */}
      <button
        onClick={handleSubmit}
        disabled={filledCount < subjects.length}
        className="group relative w-full mt-8 py-4 font-semibold text-sm rounded-xl overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ color: "var(--color-bg-base)" }}
      >
        <span
          className="absolute inset-0 transition-transform duration-300 group-hover:scale-105 group-disabled:scale-100"
          style={{ background: "var(--gradient-brand)" }}
        />
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
