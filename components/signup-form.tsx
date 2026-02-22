"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";

/**
 * Formulaire d'inscription — Orientys
 *
 * Fonctionnalités inchangées :
 * - Soumission email + password + confirmPassword via useAuth.register
 * - Validation : mots de passe identiques (côté client)
 * - Redirection admin → /admin, client → /
 * - Affichage des erreurs
 */
export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const { register, loading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Calcule la force du mot de passe (0–4).
   * Utilisé uniquement pour l'indicateur visuel.
   */
  const getPasswordStrength = (pwd: string): number => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    return score;
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthLabels = ["", "Faible", "Moyen", "Bon", "Fort"];
  const strengthColors = ["", "#ef4444", "#f59e0b", "#84cc16", "#22c55e"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      return setError("Les mots de passe ne correspondent pas");
    }

    const res = await register({ name, email, password });

    if (res.success) {
      if (res.data!.user.permissions === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } else {
      // res.error est une instance d'Error ou ApiError — on extrait le message
      const err = res.error;
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "string"
            ? err
            : "Erreur lors de l'inscription";
      setError(message);
    }
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      <div className="grid lg:grid-cols-2 min-h-[580px] bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl overflow-hidden shadow-2xl">
        {/* Panneau gauche — visuel décoratif */}
        <div className="hidden lg:flex order-last lg:order-first relative bg-[#080808] border-r border-[#1a1a1a] overflow-hidden">
          {/* Fond grille */}
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: `linear-gradient(#c9a84c 1px, transparent 1px), linear-gradient(90deg, #c9a84c 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.1),transparent_60%)]" />

          <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center gap-8 w-full">
            <div className="w-20 h-20 rounded-2xl bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-[#c9a84c]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              >
                <path
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div>
              <p className="font-display text-2xl font-bold text-white mb-3">
                Commencez
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c9a84c] to-[#e8c97a]">
                  votre parcours
                </span>
              </p>
              <p className="text-sm text-[#555] leading-relaxed max-w-xs">
                Créez votre compte gratuitement et obtenez votre première
                recommandation en moins de 5 minutes.
              </p>
            </div>

            {/* Étapes rapides */}
            <div className="flex flex-col gap-3 w-full pt-4 border-t border-[#1a1a1a]">
              {[
                "Créez votre compte",
                "Sélectionnez votre série",
                "Recevez votre orientation",
              ].map((step, i) => (
                <div key={step} className="flex items-center gap-3 text-left">
                  <div className="w-5 h-5 rounded-full bg-[#c9a84c]/15 border border-[#c9a84c]/30 flex items-center justify-center text-[10px] font-bold text-[#c9a84c] shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-xs text-[#555]">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panneau droit — formulaire */}
        <div className="flex flex-col justify-center px-8 py-12 lg:px-12">
          {/* Logo */}
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 mb-10 group w-fit"
          >
            <div className="relative w-7 h-7">
              <div className="absolute inset-0 bg-gradient-to-br from-[#c9a84c] to-[#e8c97a] rounded-sm rotate-45 group-hover:rotate-[60deg] transition-transform duration-500" />
              <div className="absolute inset-[3px] bg-[#0e0e0e] rounded-sm rotate-45" />
              <div className="absolute inset-[5px] bg-gradient-to-br from-[#c9a84c] to-[#e8c97a] rounded-sm rotate-45" />
            </div>
            <span className="font-display text-base font-bold text-white tracking-tight">
              Orientys
            </span>
          </Link>

          {/* En-tête */}
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-white mb-2">
              Créer un compte
            </h1>
            <p className="text-sm text-[#666]">
              Gratuit — aucune carte bancaire requise
            </p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Nom complet */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[#888]">
                Nom complet
              </label>
              <input
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jean Dupont"
                className="w-full px-4 py-3 bg-[#141414] border border-[#222] rounded-lg text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]/30 transition-all duration-200"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[#888]">
                Adresse email
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                className="w-full px-4 py-3 bg-[#141414] border border-[#222] rounded-lg text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]/30 transition-all duration-200"
              />
            </div>

            {/* Mot de passe */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[#888]">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 bg-[#141414] border border-[#222] rounded-lg text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]/30 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444] hover:text-[#888] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {/* Indicateur de force */}
              {password.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className="flex-1 h-1 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor:
                          passwordStrength >= level
                            ? strengthColors[passwordStrength]
                            : "#1e1e1e",
                      }}
                    />
                  ))}
                  <span
                    className="text-[11px] ml-1 shrink-0"
                    style={{ color: strengthColors[passwordStrength] }}
                  >
                    {strengthLabels[passwordStrength]}
                  </span>
                </div>
              )}
            </div>

            {/* Confirmation */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[#888]">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={[
                  "w-full px-4 py-3 bg-[#141414] border rounded-lg text-sm text-white placeholder:text-[#444] focus:outline-none transition-all duration-200",
                  confirmPassword.length > 0 && confirmPassword !== password
                    ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                    : confirmPassword.length > 0 && confirmPassword === password
                      ? "border-green-500/50 focus:border-green-500 focus:ring-1 focus:ring-green-500/20"
                      : "border-[#222] focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]/30",
                ].join(" ")}
              />
            </div>

            {/* Erreur */}
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg">
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

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full py-3.5 font-semibold text-sm text-[#0e0e0e] rounded-lg overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#c9a84c] to-[#e8c97a] transition-transform duration-300 group-hover:scale-105 group-disabled:scale-100" />
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
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
                    Création du compte…
                  </>
                ) : (
                  "Créer mon compte"
                )}
              </span>
            </button>
          </form>

          {/* Lien connexion */}
          <p className="mt-6 text-center text-sm text-[#555]">
            Déjà un compte ?{" "}
            <Link
              href="/login"
              className="text-[#c9a84c] hover:text-[#e8c97a] transition-colors font-medium"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
