"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { recommendationsApi, notesApi } from "@/lib/api";
import type { Recommendation, Serie } from "@/lib/types";
import Link from "next/link";
import { StepIndicator } from "@/app/dashboard/page";

/** Page de résultat de la recommandation IA — étape 4 */
export default function RecommendationPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [recommendation, setRecommendation] = useState<Recommendation | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasStarted = useRef(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (hasStarted.current) return;
    hasStarted.current = true;

    const notesRaw = sessionStorage.getItem("notesPayload");
    const serieRaw = sessionStorage.getItem("selectedSerie");

    if (!notesRaw || !serieRaw) {
      router.replace("/dashboard");
      return;
    }

    const notesPayload: Array<{ subjectId: string; value: number }> =
      JSON.parse(notesRaw);
    const serie: Serie = JSON.parse(serieRaw);
    const questionnaireId =
      sessionStorage.getItem("questionnaireId") ?? undefined;

    const generate = async () => {
      try {
        await notesApi.saveNotes({
          notes: notesPayload.map((n) => ({
            userId: user.id,
            subjectId: n.subjectId,
            serieId: serie.id,
            value: n.value,
          })),
        });

        const res = await recommendationsApi.generate({
          serieId: serie.id,
          notes: notesPayload.map((n) => ({
            subjectId: n.subjectId,
            value: n.value,
          })),
          ...(questionnaireId && { questionnaireId }),
        });

        setRecommendation(res.recommendation);
        sessionStorage.setItem(
          "consultationRecommendationId",
          res.recommendation.id,
        );
        sessionStorage.removeItem("notesPayload");
      } catch (err: any) {
        setError(err?.message ?? "Erreur lors de la génération.");
      } finally {
        setLoading(false);
      }
    };

    generate();
  }, [user, authLoading, router]);

  /* État chargement */
  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-6 text-center">
        <div className="relative w-16 h-16">
          <div
            className="absolute inset-0 rounded-full border-2"
            style={{ borderColor: "var(--color-accent-border)" }}
          />
          <div
            className="absolute inset-0 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "var(--color-brand-accent)" }}
          />
          <div
            className="absolute inset-[6px] rounded-full flex items-center justify-center"
            style={{ backgroundColor: "var(--color-accent-bg)" }}
          >
            <svg
              className="w-5 h-5 animate-glow-pulse"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              style={{ color: "var(--color-brand-accent)" }}
            >
              <path
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <div>
          <p
            className="font-display text-lg sm:text-xl font-bold mb-2"
            style={{ color: "var(--color-text-primary)" }}
          >
            Analyse en cours…
          </p>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            L&apos;IA analyse votre profil et génère vos recommandations
          </p>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{
                backgroundColor: "var(--color-accent-border-md)",
                animationDelay: `${i * 200}ms`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  /* État erreur */
  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 sm:py-24 flex flex-col items-center gap-6 text-center">
        <div
          className="w-14 h-14 rounded-2xl border flex items-center justify-center"
          style={{
            backgroundColor: "var(--color-state-error-bg)",
            borderColor: "var(--color-state-error-border)",
          }}
        >
          <svg
            className="w-6 h-6"
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
            className="font-display text-lg sm:text-xl font-bold mb-2"
            style={{ color: "var(--color-text-primary)" }}
          >
            Une erreur est survenue
          </p>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            {error}
          </p>
        </div>
        <button onClick={() => router.push("/dashboard")} className="btn-back">
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
            <path
              d="M13 8H3M7 4l-4 4 4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Recommencer
        </button>
      </div>
    );
  }

  /* Résultat */
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-8 sm:mb-10 gap-4">
        <button onClick={() => router.push("/dashboard")} className="btn-back">
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
            <path
              d="M13 8H3M7 4l-4 4 4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Nouvelle analyse
        </button>
        <Link
          href="/dashboard/history"
          className="nav-link flex items-center gap-1.5 text-sm"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Historique
        </Link>
      </div>

      {/* En-tête */}
      <div className="mb-6 sm:mb-8">
        <p
          className="text-xs uppercase tracking-[0.15em] font-semibold mb-2 sm:mb-3"
          style={{ color: "var(--color-brand-accent)" }}
        >
          Étape 4 sur 4 — Terminé
        </p>
        <h1
          className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-2"
          style={{ color: "var(--color-text-primary)" }}
        >
          Votre recommandation
        </h1>
        <p
          className="text-sm sm:text-base"
          style={{ color: "var(--color-text-muted)" }}
        >
          Basée sur vos notes en série{" "}
          <span
            className="font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {recommendation?.serieCode}
          </span>
        </p>
      </div>

      <StepIndicator
        current={3}
        steps={["Série", "Notes", "Profil", "Résultat"]}
        done={4}
      />

      {/* Orientations */}
      <div className="flex flex-col gap-4 sm:gap-5">
        {recommendation?.orientations.map((orientation, idx) => (
          <div
            key={idx}
            className="group border rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 animate-fade-in-up"
            style={{
              backgroundColor: "var(--color-bg-base)",
              borderColor: "var(--color-border-default)",
              animationDelay: `${idx * 100}ms`,
              animationFillMode: "both",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--color-border-strong)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--color-border-default)";
            }}
          >
            {/* En-tête orientation */}
            <div
              className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 sm:pb-5 border-b"
              style={{ borderColor: "var(--color-border-subtle)" }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border flex items-center justify-center shrink-0 mt-0.5"
                  style={{
                    backgroundColor: "var(--color-accent-bg)",
                    borderColor: "var(--color-accent-border)",
                  }}
                >
                  <span
                    className="text-xs font-bold"
                    style={{ color: "var(--color-brand-accent)" }}
                  >
                    {idx + 1}
                  </span>
                </div>
                <div>
                  <h2
                    className="font-display text-base sm:text-lg font-bold mb-1 sm:mb-1.5"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {orientation.name}
                  </h2>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {orientation.why}
                  </p>
                </div>
              </div>
            </div>

            {/* Corps */}
            <div className="px-4 sm:px-6 py-4 sm:py-5 flex flex-col gap-4 sm:gap-5">
              {/* Diplômes */}
              {orientation.degrees.length > 0 && (
                <div>
                  <p
                    className="text-[10px] uppercase tracking-[0.15em] font-semibold mb-2 sm:mb-3"
                    style={{ color: "var(--color-text-disabled)" }}
                  >
                    Diplômes accessibles
                  </p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {orientation.degrees.map((d, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-medium border rounded-lg"
                        style={{
                          backgroundColor: "var(--color-bg-surface)",
                          borderColor: "var(--color-border-default)",
                          color: "var(--color-text-secondary)",
                        }}
                      >
                        {d.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Universités */}
              {orientation.universities.length > 0 && (
                <div>
                  <p
                    className="text-[10px] uppercase tracking-[0.15em] font-semibold mb-2 sm:mb-3"
                    style={{ color: "var(--color-text-disabled)" }}
                  >
                    Universités partenaires
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                    {orientation.universities.map((u, i) => {
                      const url = u.site ?? u.website;
                      const Component = url ? "a" : "div";
                      return (
                        <Component
                          key={i}
                          href={url}
                          target={url ? "_blank" : undefined}
                          rel={url ? "noopener noreferrer" : undefined}
                          className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl transition-all duration-200"
                          style={{
                            backgroundColor: "var(--color-bg-surface)",
                            borderColor: "var(--color-border-default)",
                            cursor: url ? "pointer" : "default",
                          }}
                          onMouseEnter={
                            url
                              ? (e: any) => {
                                  e.currentTarget.style.borderColor =
                                    "var(--color-border-strong)";
                                }
                              : undefined
                          }
                          onMouseLeave={
                            url
                              ? (e: any) => {
                                  e.currentTarget.style.borderColor =
                                    "var(--color-border-default)";
                                }
                              : undefined
                          }
                        >
                          <div
                            className="w-6 h-6 sm:w-7 sm:h-7 rounded flex items-center justify-center shrink-0"
                            style={{
                              backgroundColor: "var(--color-bg-elevated)",
                            }}
                          >
                            <svg
                              className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              style={{ color: "var(--color-text-disabled)" }}
                            >
                              <path
                                d="M4 10.5v9.75a.75.75 0 00.75.75h4.5a.75.75 0 00.75-.75V15a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v5.25a.75.75 0 00.75.75h4.5a.75.75 0 00.75-.75V10.5M12 3L2.25 10.5M21.75 10.5L12 3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <span
                            className="text-xs sm:text-sm font-medium truncate flex-1"
                            style={{ color: "var(--color-text-secondary)" }}
                          >
                            {u.name}
                          </span>
                          {url && (
                            <svg
                              className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 opacity-50"
                              viewBox="0 0 12 12"
                              fill="none"
                            >
                              <path
                                d="M3.5 8.5l5-5M5 3.5h3.5V7"
                                stroke="currentColor"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </Component>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bannière consultation */}
      <div
        className="mt-6 sm:mt-8 border rounded-xl sm:rounded-2xl p-4 sm:p-6"
        style={{
          backgroundColor: "var(--color-bg-base)",
          borderColor: "var(--color-border-default)",
        }}
      >
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div
            className="w-10 h-10 rounded-xl border flex items-center justify-center shrink-0"
            style={{
              backgroundColor: "var(--color-accent-bg)",
              borderColor: "var(--color-accent-border)",
              color: "var(--color-brand-accent)",
            }}
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="text-sm font-semibold mb-1"
              style={{ color: "var(--color-text-primary)" }}
            >
              Besoin d&apos;un accompagnement personnalisé ?
            </p>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "var(--color-text-muted)" }}
            >
              Un conseiller d&apos;orientation professionnel peut vous guider
              dans votre choix lors d&apos;un entretien individuel.
            </p>
          </div>
          <button
            disabled
            className="shrink-0 relative px-4 py-2.5 rounded-xl text-xs font-semibold overflow-hidden opacity-50 cursor-not-allowed w-full sm:w-auto"
            style={{ color: "var(--color-bg-base)" }}
            title="Fonction en cours de développement"
          >
            <span
              className="absolute inset-0"
              style={{ background: "var(--gradient-brand)" }}
            />
            <span className="relative flex items-center justify-center gap-1.5">
              Consulter un conseiller
              <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                <path
                  d="M3 6h6M6 3l3 3-3 3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div
              className="absolute -top-2 -right-2 px-4 py-1.5 rounded text-[9px] font-bold whitespace-nowrap"
              style={{
                backgroundColor: "var(--color-state-warning-bg)",
                color: "var(--color-state-warning)",
              }}
            >
              Bientôt
            </div>
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-3">
        <Link
          href="/dashboard/history"
          className="flex-1 py-3 sm:py-3.5 border text-sm font-medium rounded-xl transition-all duration-200 text-center"
          style={{
            borderColor: "var(--color-border-strong)",
            color: "var(--color-text-muted)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--color-text-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--color-text-muted)";
          }}
        >
          Voir l&apos;historique
        </Link>
        <button
          onClick={() => router.push("/dashboard")}
          className="flex-1 py-3 sm:py-3.5 relative overflow-hidden rounded-xl group"
          style={{ color: "var(--color-bg-base)" }}
        >
          <span
            className="absolute inset-0 transition-all duration-300 group-hover:brightness-110"
            style={{ background: "var(--gradient-brand)" }}
          />
          <span className="relative flex items-center justify-center gap-2 text-sm font-semibold">
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 2v12M2 8h12"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            Nouvelle analyse
          </span>
        </button>
      </div>
    </div>
  );
}
