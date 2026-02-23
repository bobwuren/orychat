"use client";

import { useState } from "react";

/**
 * ContactForm — composant client du formulaire de contact.
 *
 * Gère : validation locale, états d'envoi, feedback visuel succès/erreur.
 * Le submit POST vers /api/contact (à implémenter côté backend).
 */

type Status = "idle" | "loading" | "success" | "error";

const SUBJECTS = [
  "Question générale",
  "Problème technique",
  "Mon compte",
  "Recommandation IA",
  "Demande de partenariat",
  "Presse / Médias",
  "Autre",
];

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = "Le nom est obligatoire.";
    if (!email.trim()) errors.email = "L'email est obligatoire.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = "Format d'email invalide.";
    if (!subject) errors.subject = "Veuillez sélectionner un sujet.";
    if (!message.trim()) errors.message = "Le message est obligatoire.";
    else if (message.trim().length < 20)
      errors.message = "Le message doit faire au moins 20 caractères.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject,
          message: message.trim(),
        }),
      });
      if (!res.ok) throw new Error("Erreur serveur.");
      setStatus("success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  };

  const inputBase =
    "w-full px-4 py-3 bg-[#141414] border rounded-xl text-sm text-white placeholder:text-[#444] focus:outline-none transition-all duration-200";
  const inputIdle =
    "border-[#1e1e1e] focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]/20";
  const inputError = "border-red-500/40 focus:border-red-400";

  return (
    <div className="p-6 lg:p-8 bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl">
      <h2 className="font-display text-xl font-bold text-white mb-1">
        Envoyez-nous un message
      </h2>
      <p className="text-sm text-[#555] mb-7">
        Tous les champs marqués d'un * sont obligatoires.
      </p>

      {/* Succès */}
      {status === "success" && (
        <div className="flex items-start gap-4 p-5 bg-green-500/5 border border-green-500/20 rounded-xl mb-6">
          <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
            <svg
              className="w-4 h-4 text-green-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M4.5 12.75l6 6 9-13.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-green-400">
              Message envoyé !
            </p>
            <p className="text-xs text-green-400/70 mt-0.5">
              Nous vous répondrons dans les 24–48h ouvrées. Pensez à vérifier
              vos spams.
            </p>
          </div>
        </div>
      )}

      {/* Erreur globale */}
      {status === "error" && (
        <div className="flex items-start gap-3 p-4 bg-red-500/5 border border-red-500/20 rounded-xl mb-6">
          <svg
            className="w-4 h-4 text-red-400 shrink-0 mt-0.5"
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
          <p className="text-sm text-red-400">
            Une erreur est survenue. Veuillez réessayer ou nous écrire
            directement à contact@orientys.com.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Nom + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-[0.1em] text-[#555]">
              Nom <span className="text-[#c9a84c]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setFieldErrors((p) => ({ ...p, name: "" }));
              }}
              placeholder="Votre nom"
              className={`${inputBase} ${fieldErrors.name ? inputError : inputIdle}`}
              disabled={status === "loading"}
            />
            {fieldErrors.name && (
              <p className="text-xs text-red-400">{fieldErrors.name}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-[0.1em] text-[#555]">
              Email <span className="text-[#c9a84c]">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setFieldErrors((p) => ({ ...p, email: "" }));
              }}
              placeholder="vous@exemple.com"
              className={`${inputBase} ${fieldErrors.email ? inputError : inputIdle}`}
              disabled={status === "loading"}
            />
            {fieldErrors.email && (
              <p className="text-xs text-red-400">{fieldErrors.email}</p>
            )}
          </div>
        </div>

        {/* Sujet */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-[0.1em] text-[#555]">
            Sujet <span className="text-[#c9a84c]">*</span>
          </label>
          <select
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              setFieldErrors((p) => ({ ...p, subject: "" }));
            }}
            className={`${inputBase} ${fieldErrors.subject ? inputError : inputIdle}`}
            disabled={status === "loading"}
          >
            <option value="">Sélectionner un sujet…</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s} className="bg-[#141414]">
                {s}
              </option>
            ))}
          </select>
          {fieldErrors.subject && (
            <p className="text-xs text-red-400">{fieldErrors.subject}</p>
          )}
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-[0.1em] text-[#555]">
            Message <span className="text-[#c9a84c]">*</span>
          </label>
          <textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setFieldErrors((p) => ({ ...p, message: "" }));
            }}
            placeholder="Décrivez votre demande en détail…"
            rows={6}
            className={`${inputBase} resize-none ${fieldErrors.message ? inputError : inputIdle}`}
            disabled={status === "loading"}
          />
          <div className="flex items-center justify-between">
            {fieldErrors.message ? (
              <p className="text-xs text-red-400">{fieldErrors.message}</p>
            ) : (
              <span />
            )}
            <p className="text-xs text-[#333]">
              {message.trim().length} / 20 min
            </p>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#c9a84c] to-[#e8c97a] text-[#0e0e0e] text-sm font-bold hover:brightness-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" ? (
            <>
              <svg
                className="w-4 h-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Envoi en cours…
            </>
          ) : status === "success" ? (
            <>
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M4.5 12.75l6 6 9-13.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Message envoyé
            </>
          ) : (
            <>
              Envoyer le message
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
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
        </button>

        <p className="text-xs text-[#333] text-center">
          En soumettant ce formulaire, vous acceptez notre{" "}
          <a
            href="/politique-confidentialite"
            className="text-[#c9a84c]/70 hover:text-[#c9a84c] transition-colors"
          >
            politique de confidentialité
          </a>
          .
        </p>
      </form>
    </div>
  );
}
