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
import { StepIndicator } from "@/app/dashboard/page";

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
      { value: "Ça dépend du contexte", label: "Ça dépend du contexte" },
    ],
  },
];

const OPEN_QUESTION_MAX = 2000;

/** Page questionnaire d'orientation — étape 3 */
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

  const answeredCount = Object.values(qcm).filter(Boolean).length;
  const totalQcm = QCM_QUESTIONS.length;

  const handleQcmChange = (key: keyof QcmState, value: string) => {
    setQcm((prev) => ({ ...prev, [key]: value }));
    if (error) setError(null);
  };

  const handleOpenChange = (key: keyof OpenState, value: string) => {
    if (value.length <= OPEN_QUESTION_MAX) {
      setOpen((prev) => ({ ...prev, [key]: value }));
    }
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
        ...(qcm.domaineNumerique && { domaineNumerique: qcm.domaineNumerique }),
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

  /* Styles partagés pour les textareas */
  const textareaClass =
    "w-full px-4 py-3 border rounded-xl text-sm resize-none focus:outline-none focus:ring-1 transition-all duration-200";
  const textareaStyle = {
    backgroundColor: "var(--color-input-bg)",
    borderColor: "var(--color-input-border)",
    color: "var(--color-text-primary)",
  };

  const onTextareaFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "var(--color-input-border-focus)";
    e.currentTarget.style.boxShadow = "0 0 0 3px var(--color-input-ring)";
  };

  const onTextareaBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "var(--color-input-border)";
    e.currentTarget.style.boxShadow = "none";
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      {/* Retour */}
      <button
        onClick={() => router.back()}
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
        Retour aux notes
      </button>

      {/* En-tête */}
      <div className="mb-10">
        <p
          className="text-xs uppercase tracking-[0.15em] font-semibold mb-3"
          style={{ color: "var(--color-brand-accent)" }}
        >
          Étape 3 sur 4
        </p>
        <h1
          className="font-display text-3xl lg:text-4xl font-bold mb-2"
          style={{ color: "var(--color-text-primary)" }}
        >
          Votre profil
        </h1>
        <p style={{ color: "var(--color-text-muted)" }}>
          Ces informations personnalisent vos recommandations IA.{" "}
          <span style={{ color: "var(--color-text-disabled)" }}>
            Toutes les questions sont optionnelles.
          </span>
        </p>
      </div>

      <StepIndicator
        current={2}
        steps={["Série", "Notes", "Profil", "Résultat"]}
        done={2}
      />

      {/* Barre progression QCM */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-xs"
            style={{ color: "var(--color-text-disabled)" }}
          >
            {answeredCount} / {totalQcm} questions répondues
          </span>
          <span
            className="text-xs font-semibold"
            style={{ color: "var(--color-brand-accent)" }}
          >
            {Math.round((answeredCount / totalQcm) * 100)}%
          </span>
        </div>
        <div
          className="h-1 rounded-full overflow-hidden"
          style={{ backgroundColor: "var(--color-bg-elevated)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(answeredCount / totalQcm) * 100}%`,
              background: "var(--gradient-brand)",
            }}
          />
        </div>
      </div>

      {/* Questions QCM */}
      <div className="flex flex-col gap-6 mb-8">
        {QCM_QUESTIONS.map((question, qIdx) => (
          <div
            key={question.key}
            className="border rounded-2xl p-6"
            style={{
              backgroundColor: "var(--color-bg-base)",
              borderColor: "var(--color-border-default)",
            }}
          >
            <div className="flex items-start gap-3 mb-5">
              <div
                className="w-6 h-6 rounded-md border flex items-center justify-center shrink-0 mt-0.5"
                style={{
                  backgroundColor: "var(--color-bg-surface)",
                  borderColor: "var(--color-border-default)",
                }}
              >
                <span
                  className="text-[10px] font-bold"
                  style={{ color: "var(--color-text-disabled)" }}
                >
                  {qIdx + 1}
                </span>
              </div>
              <p
                className="text-sm font-semibold leading-snug"
                style={{ color: "var(--color-text-primary)" }}
              >
                {question.title}
              </p>
            </div>

            <div className="flex flex-col gap-2 ml-9">
              {question.options.map((option) => {
                const isSelected = qcm[question.key] === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleQcmChange(question.key, option.value)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm transition-all duration-200"
                    style={
                      isSelected
                        ? {
                            borderColor: "var(--color-accent-border-md)",
                            backgroundColor: "var(--color-accent-bg)",
                            color: "var(--color-text-primary)",
                          }
                        : {
                            borderColor: "var(--color-border-default)",
                            backgroundColor: "var(--color-bg-surface)",
                            color: "var(--color-text-muted)",
                          }
                    }
                  >
                    {/* Indicateur radio */}
                    <div
                      className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200"
                      style={
                        isSelected
                          ? {
                              borderColor: "var(--color-brand-accent)",
                              backgroundColor: "var(--color-brand-accent)",
                            }
                          : { borderColor: "var(--color-border-strong)" }
                      }
                    >
                      {isSelected && (
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: "var(--color-bg-base)" }}
                        />
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
        <div
          className="flex-1 h-[1px]"
          style={{ backgroundColor: "var(--color-border-default)" }}
        />
        <span
          className="text-xs uppercase tracking-widest"
          style={{ color: "var(--color-text-disabled)" }}
        >
          Questions ouvertes
        </span>
        <div
          className="flex-1 h-[1px]"
          style={{ backgroundColor: "var(--color-border-default)" }}
        />
      </div>

      {/* Questions ouvertes */}
      <div className="flex flex-col gap-5 mb-8">
        {[
          {
            num: "6",
            key: "matieresPreferees" as keyof OpenState,
            title: "Matières préférées et forces",
            hint: "Quelles matières vous réussissent le mieux et pourquoi ?",
            placeholder:
              "Ex : J'aime les mathématiques car j'ai un esprit logique...",
          },
          {
            num: "7",
            key: "passionsExtraScolaires" as keyof OpenState,
            title: "Passions et activités extra-scolaires",
            hint: "Hobbies, sports, bénévolat, tech, arts...",
            placeholder:
              "Ex : Je fais de la programmation dans mon temps libre...",
          },
          {
            num: "8",
            key: "messageLibre" as keyof OpenState,
            title: "Message libre",
            hint: "Un projet, une ambition, quelque chose à ajouter ?",
            placeholder: "Ex : Je veux créer ma startup dans 5 ans...",
            optional: true,
          },
        ].map(({ num, key, title, hint, placeholder, optional }) => (
          <div
            key={key}
            className="border rounded-2xl p-6"
            style={{
              backgroundColor: "var(--color-bg-base)",
              borderColor: "var(--color-border-default)",
            }}
          >
            <div className="flex items-start gap-3 mb-4">
              <div
                className="w-6 h-6 rounded-md border flex items-center justify-center shrink-0 mt-0.5"
                style={{
                  backgroundColor: "var(--color-bg-surface)",
                  borderColor: "var(--color-border-default)",
                }}
              >
                <span
                  className="text-[10px] font-bold"
                  style={{ color: "var(--color-text-disabled)" }}
                >
                  {num}
                </span>
              </div>
              <div className="flex-1">
                <p
                  className="text-sm font-semibold mb-1"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {title}{" "}
                  {optional && (
                    <span
                      className="font-normal"
                      style={{ color: "var(--color-text-disabled)" }}
                    >
                      (optionnel)
                    </span>
                  )}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--color-text-disabled)" }}
                >
                  {hint}
                </p>
              </div>
            </div>
            <div className="relative">
              <textarea
                value={open[key]}
                onChange={(e) => handleOpenChange(key, e.target.value)}
                placeholder={placeholder}
                rows={3}
                className={textareaClass}
                style={{ ...textareaStyle, placeholder: undefined } as any}
                onFocus={onTextareaFocus}
                onBlur={onTextareaBlur}
              />
              <span
                className="absolute bottom-3 right-3 text-[10px]"
                style={{ color: "var(--color-text-disabled)" }}
              >
                {open[key].length}/{OPEN_QUESTION_MAX}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Erreur */}
      {error && (
        <div
          className="mb-5 flex items-center gap-2 px-4 py-3 border rounded-lg"
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

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="group relative w-full py-4 font-semibold text-sm rounded-xl overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ color: "var(--color-bg-base)" }}
        >
          <span
            className="absolute inset-0 transition-transform duration-300 group-hover:scale-105 group-disabled:scale-100"
            style={{ background: "var(--gradient-brand)" }}
          />
          <span className="relative flex items-center justify-center gap-2">
            {submitting ? (
              <>
                <div
                  className="w-4 h-4 border-2 rounded-full animate-spin"
                  style={{
                    borderColor: "rgba(255,255,255,0.3)",
                    borderTopColor: "white",
                  }}
                />
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
      </div>
    </div>
  );
}
