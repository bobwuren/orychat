"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { consultationsApi } from "@/lib/api";

function isValidPhone(value: string): boolean {
  return /^\+?[\d\s\-().]{7,20}$/.test(value.trim());
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/** Page de demande de consultation conseiller */
export default function ConsultationPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user]);

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!phone.trim()) {
      next.phone = "Le numéro de téléphone est obligatoire.";
    } else if (!isValidPhone(phone)) {
      next.phone = "Format invalide (ex : +228 90 12 34 56).";
    }
    if (email && !isValidEmail(email)) {
      next.email = "Format d'email invalide.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const questionnaireId = sessionStorage.getItem("questionnaireId");
    const recommendationId = sessionStorage.getItem(
      "consultationRecommendationId",
    );

    if (!questionnaireId || !recommendationId) {
      setErrors({
        global:
          "Informations manquantes. Veuillez reprendre depuis le début du parcours.",
      });
      return;
    }

    setSubmitting(true);
    try {
      await consultationsApi.request({
        questionnaireId,
        recommendationId,
        studentEmail: email || undefined,
        studentPhone: phone.trim(),
        additionalComment: comment.trim() || undefined,
      });
      setSuccess(true);
    } catch (err: any) {
      setErrors({
        global: err?.message ?? "Une erreur est survenue. Veuillez réessayer.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const inputBase: React.CSSProperties = {
    backgroundColor: "var(--color-input-bg)",
    borderColor: "var(--color-input-border)",
    color: "var(--color-text-primary)",
  };

  const inputClass =
    "w-full px-4 py-3 border rounded-xl text-sm focus:outline-none transition-all duration-200";

  const onFocus = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    e.currentTarget.style.borderColor = "var(--color-input-border-focus)";
    e.currentTarget.style.boxShadow = "0 0 0 3px var(--color-input-ring)";
  };

  const onBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    hasError: boolean,
  ) => {
    e.currentTarget.style.borderColor = hasError
      ? "var(--color-state-error-border)"
      : "var(--color-input-border)";
    e.currentTarget.style.boxShadow = "none";
  };

  /* Succès */
  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-16 sm:py-24 flex flex-col items-center gap-6 text-center animate-fade-in-up">
        <div
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border flex items-center justify-center"
          style={{
            backgroundColor: "var(--color-state-success-bg)",
            borderColor: "var(--color-state-success-border)",
          }}
        >
          <svg
            className="w-6 h-6 sm:w-7 sm:h-7"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            style={{ color: "var(--color-state-success)" }}
          >
            <path
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div>
          <h2
            className="font-display text-xl sm:text-2xl font-bold mb-3"
            style={{ color: "var(--color-text-primary)" }}
          >
            Demande enregistrée
          </h2>
          <p
            className="text-sm leading-relaxed max-w-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            Votre demande de consultation a été transmise. Vous allez recevoir
            un message WhatsApp avec les modalités de paiement et les prochaines
            étapes.
          </p>
        </div>

        {/* Étapes suivantes */}
        <div
          className="w-full border rounded-xl sm:rounded-2xl p-5 sm:p-6 text-left"
          style={{
            backgroundColor: "var(--color-bg-base)",
            borderColor: "var(--color-border-default)",
          }}
        >
          <p
            className="text-xs uppercase tracking-[0.15em] font-semibold mb-4"
            style={{ color: "var(--color-brand-accent)" }}
          >
            Prochaines étapes
          </p>
          <ol className="flex flex-col gap-3">
            {[
              "Effectuez le paiement via les instructions WhatsApp",
              "Envoyez la preuve de paiement sur le même WhatsApp",
              "Notre équipe validera et assignera un conseiller sous 24-48h",
              "Le conseiller vous contactera pour organiser l'entretien",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <div
                  className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5"
                  style={{
                    backgroundColor: "var(--color-bg-surface)",
                    borderColor: "var(--color-border-default)",
                  }}
                >
                  <span
                    className="text-[10px] font-bold"
                    style={{ color: "var(--color-text-disabled)" }}
                  >
                    {i + 1}
                  </span>
                </div>
                <span
                  className="text-sm leading-snug"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <button
          onClick={() => router.push("/dashboard/history")}
          className="group relative px-7 sm:px-8 py-3 rounded-xl text-sm font-semibold overflow-hidden"
          style={{ color: "var(--color-bg-base)" }}
        >
          <span
            className="absolute inset-0 transition-all duration-300 group-hover:brightness-110"
            style={{ background: "var(--gradient-brand)" }}
          />
          <span className="relative">Voir mon historique</span>
        </button>
      </div>
    );
  }

  /* Formulaire */
  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Retour */}
      <button onClick={() => router.back()} className="btn-back mb-8 sm:mb-10">
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
          <path
            d="M13 8H3M7 4l-4 4 4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Retour aux recommandations
      </button>

      {/* En-tête */}
      <div className="mb-6 sm:mb-8">
        <p
          className="text-xs uppercase tracking-[0.15em] font-semibold mb-2 sm:mb-3"
          style={{ color: "var(--color-brand-accent)" }}
        >
          Consultation conseiller
        </p>
        <h1
          className="font-display text-2xl sm:text-3xl font-bold mb-2"
          style={{ color: "var(--color-text-primary)" }}
        >
          Parler à un expert
        </h1>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
        >
          Un conseiller d'orientation professionnel analysera votre profil et
          vous guidera personnellement dans votre choix de filière.
        </p>
      </div>

      {/* Info service */}
      <div
        className="border rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-6 sm:mb-8 flex gap-3 sm:gap-4"
        style={{
          backgroundColor: "var(--color-bg-base)",
          borderColor: "var(--color-border-default)",
        }}
      >
        <div
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center shrink-0"
          style={{
            backgroundColor: "var(--color-accent-bg)",
            borderColor: "var(--color-accent-border)",
            color: "var(--color-brand-accent)",
          }}
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
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
        <div>
          <p
            className="text-sm font-semibold mb-1"
            style={{ color: "var(--color-text-primary)" }}
          >
            Entretien individuel personnalisé
          </p>
          <p
            className="text-xs leading-relaxed"
            style={{ color: "var(--color-text-muted)" }}
          >
            Votre profil académique, questionnaire et recommandations IA seront
            transmis à votre conseiller avant l'entretien.
          </p>
        </div>
      </div>

      {/* Formulaire */}
      <div className="flex flex-col gap-4 sm:gap-5">
        {/* Email */}
        <div>
          <label
            className="block text-xs font-semibold uppercase tracking-[0.1em] mb-2"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Email{" "}
            <span
              className="font-normal normal-case tracking-normal"
              style={{ color: "var(--color-text-disabled)" }}
            >
              (optionnel)
            </span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((p) => ({ ...p, email: "" }));
            }}
            placeholder="votre@email.com"
            className={inputClass}
            style={
              errors.email
                ? {
                    ...inputBase,
                    borderColor: "var(--color-state-error-border)",
                  }
                : inputBase
            }
            onFocus={onFocus}
            onBlur={(e) => onBlur(e, !!errors.email)}
          />
          {errors.email && (
            <p
              className="mt-1.5 text-xs"
              style={{ color: "var(--color-state-error)" }}
            >
              {errors.email}
            </p>
          )}
        </div>

        {/* Téléphone */}
        <div>
          <label
            className="block text-xs font-semibold uppercase tracking-[0.1em] mb-2"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Téléphone{" "}
            <span style={{ color: "var(--color-state-error)" }}>*</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (errors.phone) setErrors((p) => ({ ...p, phone: "" }));
            }}
            placeholder="+228 90 12 34 56"
            className={inputClass}
            style={
              errors.phone
                ? {
                    ...inputBase,
                    borderColor: "var(--color-state-error-border)",
                  }
                : inputBase
            }
            onFocus={onFocus}
            onBlur={(e) => onBlur(e, !!errors.phone)}
          />
          {errors.phone && (
            <p
              className="mt-1.5 text-xs"
              style={{ color: "var(--color-state-error)" }}
            >
              {errors.phone}
            </p>
          )}
          <p
            className="mt-1.5 text-[11px]"
            style={{ color: "var(--color-text-disabled)" }}
          >
            Vous recevrez les modalités de paiement sur ce numéro WhatsApp.
          </p>
        </div>

        {/* Commentaire */}
        <div>
          <label
            className="block text-xs font-semibold uppercase tracking-[0.1em] mb-2"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Commentaire additionnel{" "}
            <span
              className="font-normal normal-case tracking-normal"
              style={{ color: "var(--color-text-disabled)" }}
            >
              (optionnel)
            </span>
          </label>
          <div className="relative">
            <textarea
              value={comment}
              onChange={(e) => {
                if (e.target.value.length <= 1000) setComment(e.target.value);
              }}
              placeholder="Un point particulier à aborder pendant l'entretien..."
              rows={4}
              className={`${inputClass} resize-none`}
              style={inputBase}
              onFocus={onFocus}
              onBlur={(e) => onBlur(e, false)}
            />
            <span
              className="absolute bottom-3 right-3 text-[10px]"
              style={{ color: "var(--color-text-disabled)" }}
            >
              {comment.length}/1000
            </span>
          </div>
        </div>
      </div>

      {/* Erreur globale */}
      {errors.global && (
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
            {errors.global}
          </span>
        </div>
      )}

      {/* Bouton */}
      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="group relative w-full mt-6 sm:mt-8 py-3.5 sm:py-4 font-semibold text-sm rounded-xl overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ color: "var(--color-bg-base)" }}
      >
        <span
          className="absolute inset-0 transition-all duration-300 group-hover:brightness-110 group-disabled:brightness-100"
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
              Envoi en cours...
            </>
          ) : (
            <>
              Envoyer ma demande
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

      <p
        className="text-center text-[11px] mt-4 leading-relaxed"
        style={{ color: "var(--color-text-disabled)" }}
      >
        En soumettant, vous acceptez que vos données académiques soient
        transmises au conseiller assigné.
      </p>
    </div>
  );
}
