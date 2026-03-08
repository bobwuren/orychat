"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { questionnaireApi } from "@/lib/api";
import type {
  VisionProfessionnelle,
  StyleApprentissage,
  DomaineNumerique,
  PrioriteFormation,
  ModeTravail,
} from "@/lib/types";

// ---------------------------------------------------------------------------
// Types locaux
// ---------------------------------------------------------------------------

interface QcmOption {
  value: string;
  label: string;
}

interface QcmQuestion {
  key: keyof QcmState;
  title: string;
  options: QcmOption[];
}

interface QcmState {
  visionProfessionnelle: VisionProfessionnelle | "";
  styleApprentissage: StyleApprentissage | "";
  domaineNumerique: DomaineNumerique | "";
  prioriteFormation: PrioriteFormation | "";
  modeTravail: ModeTravail | "";
}

interface OpenState {
  matieresPreferees: string;
  passionsExtraScolaires: string;
  messageLibre: string;
}

// ---------------------------------------------------------------------------
// Données statiques des questions
// ---------------------------------------------------------------------------

const QCM_QUESTIONS: QcmQuestion[] = [
  {
    key: "visionProfessionnelle",
    title: "Dans 5-10 ans, tu te vois plutôt :",
    options: [
      {
        value: "Entrepreneur(e) / Créateur(trice) d'entreprise",
        label: "Entrepreneur(e) / Créateur(trice) d'entreprise",
      },
      {
        value: "Salarié(e) dans une grande entreprise",
        label: "Salarié(e) dans une grande entreprise",
      },
      {
        value: "Freelance / Consultant(e) indépendant(e)",
        label: "Freelance / Consultant(e) indépendant(e)",
      },
      {
        value: "Chercheur(se) / Enseignant(e)",
        label: "Chercheur(se) / Enseignant(e)",
      },
      { value: "Je ne sais pas encore", label: "Je ne sais pas encore" },
    ],
  },
  {
    key: "styleApprentissage",
    title: "Tu apprends mieux par :",
    options: [
      {
        value: "La pratique (projets, stages, travaux pratiques)",
        label: "La pratique (projets, stages, travaux pratiques)",
      },
      {
        value: "La théorie (cours magistraux, lectures, recherche)",
        label: "La théorie (cours magistraux, lectures, recherche)",
      },
      {
        value: "Un équilibre entre théorie et pratique",
        label: "Un équilibre entre théorie et pratique",
      },
    ],
  },
  {
    key: "domaineNumerique",
    title: "Dans le numérique, qu'est-ce qui t'intéresse le plus :",
    options: [
      {
        value: "Créer des sites web et applications",
        label: "Créer des sites web et applications",
      },
      {
        value: "Analyser des données et faire de l'IA",
        label: "Analyser des données et faire de l'IA",
      },
      {
        value: "Gérer les réseaux sociaux et le marketing digital",
        label: "Gérer les réseaux sociaux et le marketing digital",
      },
      {
        value: "Résoudre des problèmes techniques (cybersécurité, réseaux)",
        label: "Résoudre des problèmes techniques (cybersécurité, réseaux)",
      },
      {
        value: "Design graphique et création de contenu",
        label: "Design graphique et création de contenu",
      },
      { value: "Autre / Je ne sais pas", label: "Autre / Je ne sais pas" },
    ],
  },
  {
    key: "prioriteFormation",
    title: "Qu'est-ce qui est le plus important pour toi :",
    options: [
      {
        value: "Durée courte de formation",
        label: "Durée courte de formation",
      },
      { value: "Coût accessible", label: "Coût accessible" },
      {
        value: "Prestige et réputation de l'école",
        label: "Prestige et réputation de l'école",
      },
      {
        value: "Garantie de débouchés professionnels",
        label: "Garantie de débouchés professionnels",
      },
      {
        value: "Flexibilité (cours en ligne, horaires adaptés)",
        label: "Flexibilité (cours en ligne, horaires adaptés)",
      },
    ],
  },
  {
    key: "modeTravail",
    title: "Tu préfères travailler :",
    options: [
      { value: "Seul(e) sur tes projets", label: "Seul(e) sur tes projets" },
      {
        value: "En équipe / collaboration",
        label: "En équipe / collaboration",
      },
      {
        value: "Ça dépend du contexte",
        label: "Ça dépend du contexte",
      },
    ],
  },
];

const OPEN_QUESTION_MAX = 2000;

// ---------------------------------------------------------------------------
// Page principale
// ---------------------------------------------------------------------------

/**
 * Page questionnaire d'orientation.
 * Étape 3 du parcours étudiant.
 * Lit serieId depuis sessionStorage (mis en place à l'étape 1).
 */
export default function QuestionnairePage() {
  const router = useRouter();

  const [qcm, setQcm] = useState<QcmState>({
    visionProfessionnelle: "",
    styleApprentissage: "",
    domaineNumerique: "",
    prioriteFormation: "",
    modeTravail: "",
  });

  const [open, setOpen] = useState<OpenState>({
    matieresPreferees: "",
    passionsExtraScolaires: "",
    messageLibre: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Nombre de QCM répondus
  const answeredCount = Object.values(qcm).filter(Boolean).length;
  const totalQcm = QCM_QUESTIONS.length;

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleQcmChange = (key: keyof QcmState, value: string) => {
    setQcm((prev) => ({ ...prev, [key]: value }));
    if (error) setError(null);
  };

  const handleOpenChange = (key: keyof OpenState, value: string) => {
    if (value.length <= OPEN_QUESTION_MAX) {
      setOpen((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleSkip = () => {
    // L'utilisateur passe le questionnaire — on garde questionnaireId à null
    sessionStorage.removeItem("questionnaireId");
    router.push("/dashboard/recommendation");
  };

  const handleSubmit = async () => {
    const serieRaw = sessionStorage.getItem("selectedSerie");
    if (!serieRaw) {
      router.replace("/dashboard");
      return;
    }

    const { id: serieId } = JSON.parse(serieRaw);

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        serieId,
        ...(qcm.visionProfessionnelle && {
          visionProfessionnelle: qcm.visionProfessionnelle,
        }),
        ...(qcm.styleApprentissage && {
          styleApprentissage: qcm.styleApprentissage,
        }),
        ...(qcm.domaineNumerique && {
          domaineNumerique: qcm.domaineNumerique,
        }),
        ...(qcm.prioriteFormation && {
          prioriteFormation: qcm.prioriteFormation,
        }),
        ...(qcm.modeTravail && { modeTravail: qcm.modeTravail }),
        ...(open.matieresPreferees && {
          matieresPreferees: open.matieresPreferees,
        }),
        ...(open.passionsExtraScolaires && {
          passionsExtraScolaires: open.passionsExtraScolaires,
        }),
        ...(open.messageLibre && { messageLibre: open.messageLibre }),
      };

      const response = await questionnaireApi.submit(payload);

      // Stocker l'ID pour la génération enrichie
      sessionStorage.setItem(
        "questionnaireId",
        String(response.questionnaireId),
      );
      router.push("/dashboard/recommendation");
    } catch (err: any) {
      setError(
        err?.message ?? "Erreur lors de la soumission du questionnaire.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Rendu
  // ---------------------------------------------------------------------------

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      {/* Retour */}
      <button
        onClick={() => router.back()}
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
        Retour aux notes
      </button>

      {/* En-tête */}
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.15em] text-[#c9a84c] font-semibold mb-3">
          Étape 3 sur 4
        </p>
        <h1 className="font-display text-3xl lg:text-4xl font-bold text-white mb-2">
          Votre profil
        </h1>
        <p className="text-[#666]">
          Ces informations personnalisent vos recommandations IA.{" "}
          <span className="text-[#555]">
            Toutes les questions sont optionnelles.
          </span>
        </p>
      </div>

      {/* Indicateur de progression */}
      <div className="flex items-center gap-2 mb-10">
        {["Série", "Notes", "Profil", "Résultat"].map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <div
              className={[
                "flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold border transition-all",
                i < 2
                  ? "bg-[#c9a84c]/20 border-[#c9a84c]/40 text-[#c9a84c]"
                  : i === 2
                    ? "bg-[#c9a84c] border-[#c9a84c] text-[#0e0e0e]"
                    : "border-[#2a2a2a] text-[#444]",
              ].join(" ")}
            >
              {i < 2 ? (
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
                i === 2 ? "text-white" : "text-[#444]",
              ].join(" ")}
            >
              {step}
            </span>
            {i < 3 && <div className="w-8 h-[1px] bg-[#1e1e1e] mx-1" />}
          </div>
        ))}
      </div>

      {/* Barre progression QCM */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[#555]">
            {answeredCount} / {totalQcm} questions répondues
          </span>
          <span className="text-xs text-[#c9a84c] font-semibold">
            {Math.round((answeredCount / totalQcm) * 100)}%
          </span>
        </div>
        <div className="h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#c9a84c] to-[#e8c97a] rounded-full transition-all duration-500"
            style={{ width: `${(answeredCount / totalQcm) * 100}%` }}
          />
        </div>
      </div>

      {/* Questions QCM */}
      <div className="flex flex-col gap-6 mb-8">
        {QCM_QUESTIONS.map((question, qIdx) => (
          <div
            key={question.key}
            className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl p-6"
          >
            {/* Numéro + titre */}
            <div className="flex items-start gap-3 mb-5">
              <div className="w-6 h-6 rounded-md bg-[#141414] border border-[#1e1e1e] flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[10px] font-bold text-[#555]">
                  {qIdx + 1}
                </span>
              </div>
              <p className="text-sm font-semibold text-white leading-snug">
                {question.title}
              </p>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-2 ml-9">
              {question.options.map((option) => {
                const isSelected = qcm[question.key] === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleQcmChange(question.key, option.value)}
                    className={[
                      "flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm transition-all duration-200",
                      isSelected
                        ? "border-[#c9a84c]/60 bg-[#c9a84c]/8 text-white"
                        : "border-[#1e1e1e] bg-[#141414] text-[#888] hover:border-[#2a2a2a] hover:text-[#aaa]",
                    ].join(" ")}
                  >
                    {/* Indicateur radio */}
                    <div
                      className={[
                        "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200",
                        isSelected
                          ? "border-[#c9a84c] bg-[#c9a84c]"
                          : "border-[#333]",
                      ].join(" ")}
                    >
                      {isSelected && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0e0e0e]" />
                      )}
                    </div>
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Séparateur */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-[1px] bg-[#1a1a1a]" />
        <span className="text-xs text-[#444] uppercase tracking-widest">
          Questions ouvertes
        </span>
        <div className="flex-1 h-[1px] bg-[#1a1a1a]" />
      </div>

      {/* Questions ouvertes */}
      <div className="flex flex-col gap-5 mb-8">
        {/* Matières préférées */}
        <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-6 h-6 rounded-md bg-[#141414] border border-[#1e1e1e] flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-[10px] font-bold text-[#555]">6</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white mb-1">
                Matières préférées et forces
              </p>
              <p className="text-xs text-[#555]">
                Quelles matières vous réussissent le mieux et pourquoi ?
              </p>
            </div>
          </div>
          <div className="relative">
            <textarea
              value={open.matieresPreferees}
              onChange={(e) =>
                handleOpenChange("matieresPreferees", e.target.value)
              }
              placeholder="Ex : J'aime les mathématiques car j'ai un esprit logique..."
              rows={3}
              className="w-full px-4 py-3 bg-[#141414] border border-[#1e1e1e] rounded-xl text-sm text-white placeholder:text-[#333] resize-none focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/20 transition-all duration-200"
            />
            <span className="absolute bottom-3 right-3 text-[10px] text-[#333]">
              {open.matieresPreferees.length}/{OPEN_QUESTION_MAX}
            </span>
          </div>
        </div>

        {/* Passions */}
        <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-6 h-6 rounded-md bg-[#141414] border border-[#1e1e1e] flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-[10px] font-bold text-[#555]">7</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white mb-1">
                Passions et activités extra-scolaires
              </p>
              <p className="text-xs text-[#555]">
                Hobbies, sports, bénévolat, tech, arts...
              </p>
            </div>
          </div>
          <div className="relative">
            <textarea
              value={open.passionsExtraScolaires}
              onChange={(e) =>
                handleOpenChange("passionsExtraScolaires", e.target.value)
              }
              placeholder="Ex : Je fais de la programmation dans mon temps libre..."
              rows={3}
              className="w-full px-4 py-3 bg-[#141414] border border-[#1e1e1e] rounded-xl text-sm text-white placeholder:text-[#333] resize-none focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/20 transition-all duration-200"
            />
            <span className="absolute bottom-3 right-3 text-[10px] text-[#333]">
              {open.passionsExtraScolaires.length}/{OPEN_QUESTION_MAX}
            </span>
          </div>
        </div>

        {/* Message libre */}
        <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-6 h-6 rounded-md bg-[#141414] border border-[#1e1e1e] flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-[10px] font-bold text-[#555]">8</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white mb-1">
                Message libre{" "}
                <span className="text-[#444] font-normal">(optionnel)</span>
              </p>
              <p className="text-xs text-[#555]">
                Un projet, une ambition, quelque chose à ajouter ?
              </p>
            </div>
          </div>
          <div className="relative">
            <textarea
              value={open.messageLibre}
              onChange={(e) => handleOpenChange("messageLibre", e.target.value)}
              placeholder="Ex : Je veux créer ma startup dans 5 ans..."
              rows={3}
              className="w-full px-4 py-3 bg-[#141414] border border-[#1e1e1e] rounded-xl text-sm text-white placeholder:text-[#333] resize-none focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/20 transition-all duration-200"
            />
            <span className="absolute bottom-3 right-3 text-[10px] text-[#333]">
              {open.messageLibre.length}/{OPEN_QUESTION_MAX}
            </span>
          </div>
        </div>
      </div>

      {/* Erreur */}
      {error && (
        <div className="mb-5 flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg">
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

      {/* Actions */}
      <div className="flex flex-col gap-3">
        {/* Soumettre */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="group relative w-full py-4 font-semibold text-sm text-[#0e0e0e] rounded-xl overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-[#c9a84c] to-[#e8c97a] transition-transform duration-300 group-hover:scale-105 group-disabled:scale-100" />
          <span className="relative flex items-center justify-center gap-2">
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-[#0e0e0e]/30 border-t-[#0e0e0e] rounded-full animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                Générer mes recommandations
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
              </>
            )}
          </span>
        </button>

        {/* Passer */}
        <button
          onClick={handleSkip}
          disabled={submitting}
          className="w-full py-3 text-sm text-[#555] hover:text-[#888] transition-colors disabled:opacity-40"
        >
          Passer cette étape et continuer sans questionnaire
        </button>
      </div>
    </div>
  );
}
