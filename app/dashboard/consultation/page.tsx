"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { consultationsApi } from "@/lib/api";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Validation minimale d'un numéro de téléphone international.
 * On accepte les numéros commençant par + suivis d'au moins 7 chiffres/espaces.
 */
function isValidPhone(value: string): boolean {
  return /^\+?[\d\s\-().]{7,20}$/.test(value.trim());
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

// ---------------------------------------------------------------------------
// Page principale
// ---------------------------------------------------------------------------

/**
 * Page de demande de consultation conseiller.
 * Étape 6 (optionnelle) du parcours étudiant.
 * Requiert questionnaireId et recommendationId en sessionStorage.
 */
export default function ConsultationPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pré-remplir l'email depuis le compte utilisateur
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Soumission
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // État succès
  // ---------------------------------------------------------------------------

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 flex flex-col items-center gap-6 text-center">
        {/* Icône succès */}
        <div className="w-16 h-16 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/30 flex items-center justify-center">
          <svg
            className="w-7 h-7 text-[#c9a84c]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div>
          <h2 className="font-display text-2xl font-bold text-white mb-3">
            Demande enregistrée
          </h2>
          <p className="text-sm text-[#666] leading-relaxed max-w-sm">
            Votre demande de consultation a été transmise avec succès. Vous
            allez recevoir un message WhatsApp avec les modalités de paiement et
            les prochaines étapes.
          </p>
        </div>

        {/* Étapes */}
        <div className="w-full bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl p-6 text-left mt-2">
          <p className="text-xs uppercase tracking-[0.15em] text-[#c9a84c] font-semibold mb-4">
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
                <div className="w-5 h-5 rounded-full bg-[#141414] border border-[#1e1e1e] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold text-[#555]">
                    {i + 1}
                  </span>
                </div>
                <span className="text-sm text-[#888] leading-snug">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <button
          onClick={() => router.push("/dashboard/history")}
          className="group relative px-8 py-3 rounded-xl text-sm font-semibold text-[#0e0e0e] overflow-hidden mt-2"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-[#c9a84c] to-[#e8c97a] transition-transform duration-300 group-hover:scale-105" />
          <span className="relative">Voir mon historique</span>
        </button>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Formulaire
  // ---------------------------------------------------------------------------

  return (
    <div className="max-w-lg mx-auto px-6 py-12">
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
        Retour aux recommandations
      </button>

      {/* En-tête */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.15em] text-[#c9a84c] font-semibold mb-3">
          Consultation conseiller
        </p>
        <h1 className="font-display text-3xl font-bold text-white mb-2">
          Parler à un expert
        </h1>
        <p className="text-[#666] text-sm leading-relaxed">
          Un conseiller d'orientation professionnel analysera votre profil et
          vous guidera personnellement dans votre choix de filière.
        </p>
      </div>

      {/* Info service */}
      <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl p-5 mb-8 flex gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center shrink-0">
          <svg
            className="w-5 h-5 text-[#c9a84c]"
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
          <p className="text-sm font-semibold text-white mb-1">
            Entretien individuel personnalisé
          </p>
          <p className="text-xs text-[#555] leading-relaxed">
            Votre profil académique, questionnaire et recommandations IA seront
            transmis à votre conseiller avant l'entretien.
          </p>
        </div>
      </div>

      {/* Formulaire */}
      <div className="flex flex-col gap-5">
        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-[#888] uppercase tracking-[0.1em] mb-2">
            Email{" "}
            <span className="text-[#444] font-normal normal-case tracking-normal">
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
            className={[
              "w-full px-4 py-3 bg-[#0e0e0e] border rounded-xl text-sm text-white placeholder:text-[#333] focus:outline-none focus:ring-1 transition-all duration-200",
              errors.email
                ? "border-red-500/40 focus:border-red-500/60 focus:ring-red-500/20"
                : "border-[#1e1e1e] focus:border-[#c9a84c]/50 focus:ring-[#c9a84c]/20",
            ].join(" ")}
          />
          {errors.email && (
            <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>
          )}
        </div>

        {/* Téléphone */}
        <div>
          <label className="block text-xs font-semibold text-[#888] uppercase tracking-[0.1em] mb-2">
            Téléphone <span className="text-red-400">*</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (errors.phone) setErrors((p) => ({ ...p, phone: "" }));
            }}
            placeholder="+228 90 12 34 56"
            className={[
              "w-full px-4 py-3 bg-[#0e0e0e] border rounded-xl text-sm text-white placeholder:text-[#333] focus:outline-none focus:ring-1 transition-all duration-200",
              errors.phone
                ? "border-red-500/40 focus:border-red-500/60 focus:ring-red-500/20"
                : "border-[#1e1e1e] focus:border-[#c9a84c]/50 focus:ring-[#c9a84c]/20",
            ].join(" ")}
          />
          {errors.phone && (
            <p className="mt-1.5 text-xs text-red-400">{errors.phone}</p>
          )}
          <p className="mt-1.5 text-[11px] text-[#444]">
            Vous recevrez les modalités de paiement sur ce numéro WhatsApp.
          </p>
        </div>

        {/* Commentaire */}
        <div>
          <label className="block text-xs font-semibold text-[#888] uppercase tracking-[0.1em] mb-2">
            Commentaire additionnel{" "}
            <span className="text-[#444] font-normal normal-case tracking-normal">
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
              className="w-full px-4 py-3 bg-[#0e0e0e] border border-[#1e1e1e] rounded-xl text-sm text-white placeholder:text-[#333] resize-none focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/20 transition-all duration-200"
            />
            <span className="absolute bottom-3 right-3 text-[10px] text-[#333]">
              {comment.length}/1000
            </span>
          </div>
        </div>
      </div>

      {/* Erreur globale */}
      {errors.global && (
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
          <span className="text-sm text-red-400">{errors.global}</span>
        </div>
      )}

      {/* Bouton */}
      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="group relative w-full mt-8 py-4 font-semibold text-sm text-[#0e0e0e] rounded-xl overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-[#c9a84c] to-[#e8c97a] transition-transform duration-300 group-hover:scale-105 group-disabled:scale-100" />
        <span className="relative flex items-center justify-center gap-2">
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-[#0e0e0e]/30 border-t-[#0e0e0e] rounded-full animate-spin" />
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

      <p className="text-center text-[11px] text-[#444] mt-4 leading-relaxed">
        En soumettant, vous acceptez que vos données académiques soient
        transmises au conseiller assigné.
      </p>
    </div>
  );
}
