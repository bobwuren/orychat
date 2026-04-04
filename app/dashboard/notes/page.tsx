"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Serie, SubjectWithCoefficients } from "@/lib/types";
import { subjectsApi } from "@/lib/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { StepIndicator } from "@/app/dashboard/page";

const MIN_AVERAGE = 10;

function computeWeightedAverage(
  subjects: SubjectWithCoefficients[],
  notes: Record<string, string>,
  serieId: string,
): number {
  let totalWeight = 0;
  let weightedSum = 0;

  for (const subject of subjects) {
    const coeff =
      subject.seriesCoefficients?.find((sc) => sc.serieId === serieId)
        ?.coefficient ??
      subject.coefficient ??
      1;
    const value = parseFloat(notes[subject.id]);
    if (!isNaN(value)) {
      weightedSum += value * coeff;
      totalWeight += coeff;
    }
  }

  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

/** Page de saisie des notes par matière — étape 2 */
export default function NotesPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [serie, setSerie] = useState<Serie | null>(null);
  const [subjects, setSubjects] = useState<SubjectWithCoefficients[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAverageBlock, setShowAverageBlock] = useState(false);

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
      if (showAverageBlock) setShowAverageBlock(false);
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

    const average = computeWeightedAverage(subjects, notes, serie?.id ?? "");

    if (average < MIN_AVERAGE) {
      setShowAverageBlock(true);
      setError(null);
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
  const allFilled = filledCount === subjects.length && subjects.length > 0;
  const progress =
    subjects.length > 0 ? (filledCount / subjects.length) * 100 : 0;
  const currentAverage = allFilled
    ? computeWeightedAverage(subjects, notes, serie?.id ?? "")
    : null;

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="space-y-2.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-14 sm:h-16 rounded-xl skeleton"
              style={{ animationDelay: `${i * 70}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Retour */}
      <button
        onClick={() => router.push("/dashboard")}
        className="btn-back mb-8 sm:mb-10"
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
        Changer de série
      </button>

      {/* En-tête */}
      <div className="mb-6 sm:mb-8">
        <p
          className="text-xs uppercase tracking-[0.15em] font-semibold mb-2 sm:mb-3"
          style={{ color: "var(--color-brand-accent)" }}
        >
          Étape 2 sur 4
        </p>
        <h1
          className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-1.5 sm:mb-2"
          style={{ color: "var(--color-text-primary)" }}
        >
          Vos notes
        </h1>
        <p
          className="text-sm sm:text-base"
          style={{ color: "var(--color-text-muted)" }}
        >
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
              — {serie.description}
            </span>
          )}
        </p>
      </div>

      <StepIndicator
        current={1}
        steps={["Série", "Notes", "Profil", "Résultat"]}
        done={1}
      />

      {/* Progression */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-xs"
            style={{ color: "var(--color-text-disabled)" }}
          >
            {filledCount} / {subjects.length} matières renseignées
          </span>
          {currentAverage !== null && (
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full border"
              style={{
                color:
                  currentAverage >= MIN_AVERAGE
                    ? "var(--color-state-success)"
                    : "var(--color-state-error)",
                backgroundColor:
                  currentAverage >= MIN_AVERAGE
                    ? "var(--color-state-success-bg)"
                    : "var(--color-state-error-bg)",
                borderColor:
                  currentAverage >= MIN_AVERAGE
                    ? "var(--color-state-success-border)"
                    : "var(--color-state-error-border)",
              }}
            >
              Moy. {currentAverage.toFixed(2)}/20
            </span>
          )}
        </div>
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Liste des matières */}
      <div className="flex flex-col gap-2">
        {subjects.map((subject) => {
          const coeff =
            subject.seriesCoefficients?.find((sc) => sc.serieId === serie?.id)
              ?.coefficient ??
            subject.coefficient ??
            1;
          const value = notes[subject.id] ?? "";
          const isFilled = value !== "";
          const numValue = parseFloat(value);
          const isLow = isFilled && numValue < MIN_AVERAGE;

          return (
            <div
              key={subject.id}
              className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 sm:py-4 border rounded-xl transition-all duration-200"
              style={{
                backgroundColor: "var(--color-bg-base)",
                borderColor: isFilled
                  ? isLow
                    ? "var(--color-state-error-border)"
                    : "var(--color-border-strong)"
                  : "var(--color-border-subtle)",
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-300"
                style={{
                  backgroundColor: isFilled
                    ? isLow
                      ? "var(--color-state-error)"
                      : "var(--color-brand-accent)"
                    : "var(--color-border-strong)",
                }}
              />

              <div className="flex-1 min-w-0">
                <span
                  className="text-xs sm:text-sm font-medium truncate block"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {subject.name}
                </span>
              </div>

              <span
                className="shrink-0 text-[10px] sm:text-[11px] font-semibold px-1.5 sm:px-2 py-0.5 rounded hidden sm:block"
                style={{
                  color: "var(--color-text-disabled)",
                  backgroundColor: "var(--color-bg-surface)",
                }}
              >
                ×{coeff}
              </span>

              <input
                type="number"
                min={0}
                max={20}
                step={0.5}
                placeholder="—"
                value={value}
                onChange={(e) => handleChange(subject.id, e.target.value)}
                className="w-16 sm:w-20 px-2 sm:px-3 py-2 text-center text-sm font-semibold rounded-lg border transition-all duration-200 focus:outline-none shrink-0"
                style={{
                  backgroundColor: "var(--color-bg-surface)",
                  borderColor: isLow
                    ? "var(--color-state-error-border)"
                    : isFilled
                      ? "var(--color-accent-border)"
                      : "var(--color-border-default)",
                  color: isLow
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
                  e.currentTarget.style.borderColor = isLow
                    ? "var(--color-state-error-border)"
                    : isFilled
                      ? "var(--color-accent-border)"
                      : "var(--color-border-default)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Erreur (champs manquants) */}
      {error && (
        <div
          className="mt-5 flex items-center gap-2 px-4 py-3 border rounded-xl"
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

      {/* Blocage moyenne insuffisante */}
      {showAverageBlock && currentAverage !== null && (
        <div className="mt-6 animate-fade-in-up">
          <div
            className="border rounded-2xl overflow-hidden"
            style={{
              borderColor: "var(--color-state-error-border)",
              backgroundColor: "var(--color-bg-base)",
            }}
          >
            {/* Header */}
            <div
              className="px-5 sm:px-6 py-4 sm:py-5 border-b flex items-center gap-3"
              style={{
                backgroundColor: "var(--color-state-error-bg)",
                borderColor: "var(--color-state-error-border)",
              }}
            >
              <div
                className="w-9 h-9 rounded-full border flex items-center justify-center shrink-0"
                style={{
                  borderColor: "var(--color-state-error-border)",
                  backgroundColor: "var(--color-state-error-bg)",
                }}
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  style={{ color: "var(--color-state-error)" }}
                >
                  <path
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <p
                  className="text-sm font-bold"
                  style={{ color: "var(--color-state-error)" }}
                >
                  Moyenne insuffisante · {currentAverage.toFixed(2)}/20
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "var(--color-state-error)" }}
                >
                  Une moyenne d'au moins 10/20 est requise pour accéder à
                  l'orientation.
                </p>
              </div>
            </div>

            {/* Corps explicatif */}
            <div className="px-5 sm:px-6 py-5 sm:py-6 space-y-5">
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--color-text-muted)" }}
              >
                Notre plateforme est destinée aux{" "}
                <strong style={{ color: "var(--color-text-primary)" }}>
                  bacheliers et lycéens en terminal
                </strong>{" "}
                ayant validé leur niveau. La recommandation d'orientation
                universitaire n'est pertinente qu'à partir d'un profil
                académique solide.
              </p>

              {/* Conseils */}
              <div>
                <p
                  className="text-xs uppercase tracking-[0.12em] font-semibold mb-3"
                  style={{ color: "var(--color-brand-accent)" }}
                >
                  Conseils pour progresser
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    {
                      icon: (
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path
                            d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ),
                      title: "Revoir les bases",
                      text: "Identifiez vos matières les plus faibles et reprenez les fondamentaux avec des exercices ciblés.",
                    },
                    {
                      icon: (
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path
                            d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ),
                      title: "Groupes de travail",
                      text: "Travailler en groupe avec vos camarades permet de combler les lacunes plus rapidement.",
                    },
                    {
                      icon: (
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path
                            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ),
                      title: "Soutien scolaire",
                      text: "Un professeur particulier ou un tuteur peut vous aider à progresser rapidement dans les matières à fort coefficient.",
                    },
                    {
                      icon: (
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path
                            d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ),
                      title: "Annales et exercices",
                      text: "Pratiquez sur des sujets d'examens passés pour vous familiariser avec les attendus et améliorer votre rythme.",
                    },
                  ].map(({ icon, title, text }) => (
                    <div
                      key={title}
                      className="flex items-start gap-3 p-3.5 border rounded-xl"
                      style={{
                        backgroundColor: "var(--color-bg-surface)",
                        borderColor: "var(--color-border-default)",
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 mt-0.5"
                        style={{
                          backgroundColor: "var(--color-accent-bg)",
                          borderColor: "var(--color-accent-border)",
                          color: "var(--color-brand-accent)",
                        }}
                      >
                        {icon}
                      </div>
                      <div>
                        <p
                          className="text-xs font-semibold mb-0.5"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {title}
                        </p>
                        <p
                          className="text-xs leading-relaxed"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          {text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA révision */}
              <div
                className="flex items-center justify-between flex-wrap gap-3 p-4 border rounded-xl"
                style={{
                  backgroundColor: "var(--color-accent-bg)",
                  borderColor: "var(--color-accent-border)",
                }}
              >
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    Vous pouvez réessayer après avoir progressé
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    Corrigez vos notes et soumettez à nouveau.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowAverageBlock(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-xs font-semibold px-4 py-2 rounded-lg border transition-all duration-200 shrink-0"
                  style={{
                    backgroundColor: "var(--color-bg-base)",
                    borderColor: "var(--color-accent-border-md)",
                    color: "var(--color-brand-accent)",
                  }}
                >
                  Modifier mes notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bouton continuer */}
      {!showAverageBlock && (
        <button
          onClick={handleSubmit}
          disabled={filledCount < subjects.length}
          className="group relative w-full mt-6 sm:mt-8 py-3.5 sm:py-4 font-semibold text-sm rounded-xl overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          style={{ color: "var(--color-bg-base)" }}
        >
          <span
            className="absolute inset-0 transition-all duration-300 group-hover:brightness-110 group-disabled:brightness-100"
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
      )}

      {!showAverageBlock && filledCount < subjects.length && (
        <p
          className="text-center text-xs mt-3"
          style={{ color: "var(--color-text-disabled)" }}
        >
          Renseignez toutes les matières pour continuer
        </p>
      )}
    </div>
  );
}
