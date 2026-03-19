// ============================================================================
// components/ContactForm.tsx
// ============================================================================
"use client";

import { useState } from "react";

/**
 * ContactForm — formulaire de contact.
 * Gère validation locale, états d'envoi, feedback succès/erreur.
 * Couleurs via variables CSS du design system.
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
      setName(""); setEmail(""); setSubject(""); setMessage("");
    } catch {
      setStatus("error");
    }
  };

  const inputBase: React.CSSProperties = {
    backgroundColor: "var(--color-input-bg)",
    borderColor: "var(--color-input-border)",
    color: "var(--color-text-primary)",
  };

  const inputErrorStyle: React.CSSProperties = {
    ...inputBase,
    borderColor: "var(--color-state-error-border)",
  };

  const inputClass =
    "w-full px-4 py-3 border rounded-xl text-sm focus:outline-none transition-all duration-200";

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "var(--color-input-border-focus)";
    e.currentTarget.style.boxShadow = "0 0 0 3px var(--color-input-ring)";
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, hasError: boolean) => {
    e.currentTarget.style.borderColor = hasError
      ? "var(--color-state-error-border)"
      : "var(--color-input-border)";
    e.currentTarget.style.boxShadow = "none";
  };

  return (
    <div
      className="p-6 lg:p-8 border rounded-2xl"
      style={{
        backgroundColor: "var(--color-bg-base)",
        borderColor: "var(--color-border-default)",
      }}
    >
      <h2
        className="font-display text-xl font-bold mb-1"
        style={{ color: "var(--color-text-primary)" }}
      >
        Envoyez-nous un message
      </h2>
      <p
        className="text-sm mb-7"
        style={{ color: "var(--color-text-disabled)" }}
      >
        Tous les champs marqués d&apos;un * sont obligatoires.
      </p>

      {status === "success" && (
        <div
          className="flex items-start gap-4 p-5 border rounded-xl mb-6"
          style={{
            backgroundColor: "var(--color-state-success-bg)",
            borderColor: "var(--color-state-success-border)",
          }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: "var(--color-state-success-bg)" }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--color-state-success)" }}>
              <path d="M4.5 12.75l6 6 9-13.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--color-state-success)" }}>
              Message envoyé !
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-state-success)" }}>
              Nous vous répondrons dans les 24–48h ouvrées.
            </p>
          </div>
        </div>
      )}

      {status === "error" && (
        <div
          className="flex items-start gap-3 p-4 border rounded-xl mb-6"
          style={{
            backgroundColor: "var(--color-state-error-bg)",
            borderColor: "var(--color-state-error-border)",
          }}
        >
          <p className="text-sm" style={{ color: "var(--color-state-error)" }}>
            Une erreur est survenue. Veuillez réessayer ou nous écrire directement à contact@orientys.com.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label
              className="text-xs font-semibold uppercase tracking-[0.1em]"
              style={{ color: "var(--color-text-muted)" }}
            >
              Nom <span style={{ color: "var(--color-brand-accent)" }}>*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setFieldErrors(p => ({ ...p, name: "" })); }}
              placeholder="Votre nom"
              className={inputClass}
              style={fieldErrors.name ? inputErrorStyle : inputBase}
              onFocus={handleFocus}
              onBlur={(e) => handleBlur(e, !!fieldErrors.name)}
              disabled={status === "loading"}
            />
            {fieldErrors.name && (
              <p className="text-xs" style={{ color: "var(--color-state-error)" }}>{fieldErrors.name}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label
              className="text-xs font-semibold uppercase tracking-[0.1em]"
              style={{ color: "var(--color-text-muted)" }}
            >
              Email <span style={{ color: "var(--color-brand-accent)" }}>*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setFieldErrors(p => ({ ...p, email: "" })); }}
              placeholder="vous@exemple.com"
              className={inputClass}
              style={fieldErrors.email ? inputErrorStyle : inputBase}
              onFocus={handleFocus}
              onBlur={(e) => handleBlur(e, !!fieldErrors.email)}
              disabled={status === "loading"}
            />
            {fieldErrors.email && (
              <p className="text-xs" style={{ color: "var(--color-state-error)" }}>{fieldErrors.email}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            className="text-xs font-semibold uppercase tracking-[0.1em]"
            style={{ color: "var(--color-text-muted)" }}
          >
            Sujet <span style={{ color: "var(--color-brand-accent)" }}>*</span>
          </label>
          <select
            value={subject}
            onChange={(e) => { setSubject(e.target.value); setFieldErrors(p => ({ ...p, subject: "" })); }}
            className={inputClass}
            style={fieldErrors.subject ? inputErrorStyle : inputBase}
            onFocus={handleFocus}
            onBlur={(e) => handleBlur(e, !!fieldErrors.subject)}
            disabled={status === "loading"}
          >
            <option value="">Sélectionner un sujet…</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {fieldErrors.subject && (
            <p className="text-xs" style={{ color: "var(--color-state-error)" }}>{fieldErrors.subject}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            className="text-xs font-semibold uppercase tracking-[0.1em]"
            style={{ color: "var(--color-text-muted)" }}
          >
            Message <span style={{ color: "var(--color-brand-accent)" }}>*</span>
          </label>
          <textarea
            value={message}
            onChange={(e) => { setMessage(e.target.value); setFieldErrors(p => ({ ...p, message: "" })); }}
            placeholder="Décrivez votre demande en détail…"
            rows={6}
            className={`${inputClass} resize-none`}
            style={fieldErrors.message ? inputErrorStyle : inputBase}
            onFocus={handleFocus}
            onBlur={(e) => handleBlur(e as any, !!fieldErrors.message)}
            disabled={status === "loading"}
          />
          <div className="flex items-center justify-between">
            {fieldErrors.message ? (
              <p className="text-xs" style={{ color: "var(--color-state-error)" }}>{fieldErrors.message}</p>
            ) : <span />}
            <p className="text-xs" style={{ color: "var(--color-text-disabled)" }}>
              {message.trim().length} / 20 min
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: "var(--gradient-brand)",
            color: "var(--color-bg-base)",
          }}
        >
          {status === "loading" ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Envoi en cours…
            </>
          ) : status === "success" ? (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4.5 12.75l6 6 9-13.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Message envoyé
            </>
          ) : (
            <>
              Envoyer le message
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </>
          )}
        </button>

        <p
          className="text-xs text-center"
          style={{ color: "var(--color-text-disabled)" }}
        >
          En soumettant ce formulaire, vous acceptez notre{" "}
          <a
            href="/politique-confidentialite"
            className="transition-colors"
            style={{ color: "var(--color-brand-accent)" }}
          >
            politique de confidentialité
          </a>
          .
        </p>
      </form>
    </div>
  );
}