"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { recommendationsApi } from "@/lib/api";
import type { Recommendation } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

/** Page d'historique des recommandations de l'utilisateur */
export default function HistoryPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    recommendationsApi
      .getUserRecommendations()
      .then((res) => setRecommendations(res.recommendations ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* En-tête */}
      <div className="flex items-start justify-between mb-10 gap-4">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-white mb-2">
            Historique
          </h1>
          <p className="text-[#666] text-sm">
            Toutes vos analyses d&apos;orientation
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="group shrink-0 relative overflow-hidden px-5 py-2.5 rounded-lg text-sm font-semibold text-[#0e0e0e]"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-[#c9a84c] to-[#e8c97a] transition-transform duration-300 group-hover:scale-105" />
          <span className="relative flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
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

      {/* Chargement */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-xl bg-[#141414] animate-pulse"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
      ) : recommendations.length === 0 ? (
        /* État vide */
        <div className="flex flex-col items-center text-center py-20 gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#141414] border border-[#1e1e1e] flex items-center justify-center">
            <svg
              className="w-7 h-7 text-[#333]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            >
              <path
                d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <p className="font-display text-lg font-bold text-white mb-1">
              Aucune analyse pour l&apos;instant
            </p>
            <p className="text-sm text-[#444]">
              Lancez votre première analyse pour découvrir vos orientations.
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="group relative px-6 py-3 rounded-lg text-sm font-semibold text-[#0e0e0e] overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#c9a84c] to-[#e8c97a] transition-transform duration-300 group-hover:scale-105" />
            <span className="relative">Faire ma première analyse</span>
          </button>
        </div>
      ) : (
        /* Liste */
        <div className="flex flex-col gap-3">
          {recommendations.map((rec) => {
            const isOpen = expanded === rec.id;

            return (
              <div
                key={rec.id}
                className={[
                  "bg-[#0e0e0e] border rounded-2xl overflow-hidden transition-all duration-300",
                  isOpen
                    ? "border-[#2a2a2a]"
                    : "border-[#1a1a1a] hover:border-[#222]",
                ].join(" ")}
              >
                {/* Ligne de résumé — cliquable */}
                <button
                  className="w-full text-left px-6 py-5"
                  onClick={() => setExpanded(isOpen ? null : rec.id)}
                >
                  <div className="flex items-center gap-4">
                    {/* Badge série */}
                    <div className="w-11 h-11 rounded-xl bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center shrink-0">
                      <span className="font-display text-sm font-bold text-[#c9a84c]">
                        {rec.serieCode ?? "?"}
                      </span>
                    </div>

                    {/* Infos */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white">
                        Série {rec.serieCode ?? "—"}
                      </p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-[#555]">
                          {formatDistanceToNow(new Date(rec.createdAt), {
                            addSuffix: true,
                            locale: fr,
                          })}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 bg-[#141414] border border-[#1e1e1e] rounded text-[#555]">
                          {rec.orientations.length} orientation
                          {rec.orientations.length > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    {/* Chevron */}
                    <svg
                      className={[
                        "w-4 h-4 text-[#444] transition-transform duration-300 shrink-0",
                        isOpen ? "rotate-180" : "",
                      ].join(" ")}
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M4 6l4 4 4-4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </button>

                {/* Contenu déplié */}
                {isOpen && (
                  <div className="border-t border-[#141414] px-6 py-5 flex flex-col gap-5">
                    {rec.orientations.map((o, idx) => (
                      <div
                        key={idx}
                        className={
                          idx > 0 ? "pt-5 border-t border-[#141414]" : ""
                        }
                      >
                        {/* Nom + justification */}
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-6 h-6 rounded-md bg-[#141414] border border-[#1e1e1e] flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-[10px] font-bold text-[#555]">
                              {idx + 1}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white mb-1">
                              {o.name}
                            </p>
                            <p className="text-xs text-[#555] leading-relaxed">
                              {o.why}
                            </p>
                          </div>
                        </div>

                        {/* Diplômes */}
                        {o.degrees.length > 0 && (
                          <div className="mb-3 ml-9">
                            <div className="flex flex-wrap gap-1.5">
                              {o.degrees.map((d, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 bg-[#141414] border border-[#1e1e1e] text-[#666] rounded-lg"
                                >
                                  {d.articleLink ? (
                                    <a
                                      href={d.articleLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1 hover:text-[#c9a84c] transition-colors"
                                    >
                                      {d.name}
                                      <svg
                                        className="w-2.5 h-2.5"
                                        viewBox="0 0 10 10"
                                        fill="none"
                                      >
                                        <path
                                          d="M2.5 7.5l5-5M4 2.5h3.5V6"
                                          stroke="currentColor"
                                          strokeWidth="1"
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
                        {o.universities.length > 0 && (
                          <div className="ml-9 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {o.universities.map((u, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-2 px-3 py-2 bg-[#141414] border border-[#1a1a1a] rounded-lg"
                              >
                                <svg
                                  className="w-3 h-3 text-[#444] shrink-0"
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
                                <span className="text-xs text-[#666] truncate flex-1">
                                  {u.name}
                                </span>
                                {(u.site || u.website) && (
                                  <a
                                    href={u.site ?? u.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#444] hover:text-[#c9a84c] transition-colors shrink-0"
                                  >
                                    <svg
                                      className="w-3 h-3"
                                      viewBox="0 0 10 10"
                                      fill="none"
                                    >
                                      <path
                                        d="M2.5 7.5l5-5M4 2.5h3.5V6"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
