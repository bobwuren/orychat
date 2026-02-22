"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { recommendationsApi, notesApi } from "@/lib/api";
import type { Recommendation, Serie } from "@/lib/types";
import Link from "next/link";

/** Page de résultat de la recommandation IA */
export default function RecommendationPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [recommendation, setRecommendation] = useState<Recommendation | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const notesRaw = sessionStorage.getItem("notesPayload");
    const serieRaw = sessionStorage.getItem("selectedSerie");

    if (!notesRaw || !serieRaw || !user) {
      router.replace("/dashboard");
      return;
    }

    const notesPayload: Array<{ subjectId: string; value: number }> =
      JSON.parse(notesRaw);
    const serie: Serie = JSON.parse(serieRaw);

    const generate = async () => {
      try {
        // 1. Sauvegarder les notes
        await notesApi.saveNotes({
          notes: notesPayload.map((n) => ({
            userId: user.id,
            subjectId: n.subjectId,
            serieId: serie.id,
            value: n.value,
          })),
        });

        // 2. Générer la recommandation IA
        const res = await recommendationsApi.generate({
          serieId: serie.id,
          notes: notesPayload.map((n) => ({
            subjectId: n.subjectId,
            value: n.value,
          })),
        });

        setRecommendation(res.recommendation);

        // 3. Nettoyage sessionStorage
        sessionStorage.removeItem("notesPayload");
      } catch (err: any) {
        setError(err?.message ?? "Erreur lors de la génération.");
      } finally {
        setLoading(false);
      }
    };

    generate();
  }, [user, router]);

  // --- État chargement ---
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 flex flex-col items-center gap-6 text-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-[#c9a84c]/20" />
          <div className="absolute inset-0 rounded-full border-2 border-t-[#c9a84c] animate-spin" />
          <div className="absolute inset-[6px] rounded-full bg-[#c9a84c]/5 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-[#c9a84c]"
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
          </div>
        </div>
        <div>
          <p className="font-display text-xl font-bold text-white mb-2">
            Analyse en cours…
          </p>
          <p className="text-sm text-[#555]">
            L&apos;IA analyse votre profil et génère vos recommandations
          </p>
        </div>
        {/* Dots animés */}
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]/40 animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  // --- État erreur ---
  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 flex flex-col items-center gap-6 text-center">
        <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-red-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <p className="font-display text-xl font-bold text-white mb-2">
            Une erreur est survenue
          </p>
          <p className="text-sm text-[#555]">{error}</p>
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-sm text-[#c9a84c] hover:text-[#e8c97a] transition-colors"
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
          Recommencer
        </button>
      </div>
    );
  }

  // --- Résultat ---
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-10">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-sm text-[#555] hover:text-white transition-colors group"
        >
          <svg
            className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
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
          Nouvelle analyse
        </button>
        <Link
          href="/dashboard/history"
          className="flex items-center gap-1.5 text-sm text-[#555] hover:text-white transition-colors"
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

      {/* En-tête résultat */}
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.15em] text-[#c9a84c] font-semibold mb-3">
          Étape 3 sur 3 — Terminé
        </p>
        <h1 className="font-display text-3xl lg:text-4xl font-bold text-white mb-2">
          Votre recommandation
        </h1>
        <p className="text-[#666]">
          Basée sur vos notes en série{" "}
          <span className="text-white font-semibold">
            {recommendation?.serieCode}
          </span>
        </p>
      </div>

      {/* Indicateur progression — étape 3 complète */}
      <div className="flex items-center gap-2 mb-10">
        {["Série", "Notes", "Résultat"].map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <div
              className={[
                "flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold border transition-all",
                i < 3
                  ? "bg-[#c9a84c]/20 border-[#c9a84c]/40 text-[#c9a84c]"
                  : "border-[#2a2a2a] text-[#444]",
              ].join(" ")}
            >
              <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2 6l3 3 5-5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-xs font-medium text-[#555]">{step}</span>
            {i < 2 && <div className="w-8 h-[1px] bg-[#1e1e1e] mx-1" />}
          </div>
        ))}
      </div>

      {/* Orientations */}
      <div className="flex flex-col gap-5">
        {recommendation?.orientations.map((orientation, idx) => (
          <div
            key={idx}
            className="group bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl overflow-hidden hover:border-[#2a2a2a] transition-all duration-300"
          >
            {/* En-tête orientation */}
            <div className="px-6 pt-6 pb-5 border-b border-[#141414]">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-[#c9a84c]">
                    {idx + 1}
                  </span>
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-white mb-1.5">
                    {orientation.name}
                  </h2>
                  <p className="text-sm text-[#666] leading-relaxed">
                    {orientation.why}
                  </p>
                </div>
              </div>
            </div>

            {/* Corps */}
            <div className="px-6 py-5 flex flex-col gap-5">
              {/* Diplômes */}
              {orientation.degrees.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] font-semibold text-[#444] mb-3">
                    Diplômes accessibles
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {orientation.degrees.map((d, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#141414] border border-[#1e1e1e] text-[#aaa] rounded-lg hover:border-[#2a2a2a] hover:text-white transition-all duration-200"
                      >
                        {d.articleLink ? (
                          <a
                            href={d.articleLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5"
                          >
                            {d.name}
                            <svg
                              className="w-3 h-3 text-[#555]"
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
                          </a>
                        ) : (
                          d.name
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Universités */}
              {orientation.universities.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] font-semibold text-[#444] mb-3">
                    Universités partenaires
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {orientation.universities.map((u, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 px-4 py-3 bg-[#141414] border border-[#1e1e1e] rounded-xl hover:border-[#2a2a2a] transition-all duration-200"
                      >
                        <div className="w-7 h-7 rounded bg-[#1e1e1e] flex items-center justify-center shrink-0">
                          <svg
                            className="w-3.5 h-3.5 text-[#555]"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <path
                              d="M4 10.5v9.75a.75.75 0 00.75.75h4.5a.75.75 0 00.75-.75V15a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v5.25a.75.75 0 00.75.75h4.5a.75.75 0 00.75-.75V10.5M12 3L2.25 10.5M21.75 10.5L12 3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-[#aaa] truncate flex-1">
                          {u.name}
                        </span>
                        {(u.site || u.website) && (
                          <a
                            href={u.site ?? u.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 text-[#444] hover:text-[#c9a84c] transition-colors"
                          >
                            <svg
                              className="w-3.5 h-3.5"
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
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-8 flex gap-3">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex-1 py-3.5 border border-[#2a2a2a] text-sm font-medium text-[#888] hover:text-white hover:border-[#3a3a3a] rounded-xl transition-all duration-200"
        >
          Nouvelle analyse
        </button>
        <Link
          href="/dashboard/history"
          className="flex-1 py-3.5 text-center relative overflow-hidden rounded-xl group"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-[#c9a84c] to-[#e8c97a] transition-transform duration-300 group-hover:scale-105" />
          <span className="relative flex items-center justify-center gap-2 text-sm font-semibold text-[#0e0e0e]">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Voir l&apos;historique
          </span>
        </Link>
      </div>
    </div>
  );
}
