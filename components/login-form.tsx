"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";

/**
 * Formulaire de connexion — Orientys
 *
 * Fonctionnalités inchangées :
 * - Soumission email + mot de passe via useAuth.login
 * - Redirection admin → /admin, client → /
 * - Affichage des erreurs API
 */
export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const { login, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = await login({ email, password });

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
            : "Échec de la connexion";
      setError(message);
    }
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      <div className="grid lg:grid-cols-2 min-h-[520px] bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl overflow-hidden shadow-2xl">
        {/* Panneau gauche — formulaire */}
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
              Bon retour
            </h1>
            <p className="text-sm text-[#666]">
              Connectez-vous pour accéder à votre espace
            </p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-xs font-semibold uppercase tracking-[0.12em] text-[#888]"
              >
                Adresse email
              </label>
              <input
                id="email"
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
              <label
                htmlFor="password"
                className="text-xs font-semibold uppercase tracking-[0.12em] text-[#888]"
              >
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
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
                    Connexion…
                  </>
                ) : (
                  "Se connecter"
                )}
              </span>
            </button>
          </form>

          {/* Lien inscription */}
          <p className="mt-6 text-center text-sm text-[#555]">
            Pas encore de compte ?{" "}
            <Link
              href="/signup"
              className="text-[#c9a84c] hover:text-[#e8c97a] transition-colors font-medium"
            >
              Créer un compte
            </Link>
          </p>
        </div>

        {/* Panneau droit — visuel décoratif */}
        <div className="hidden lg:flex relative bg-[#080808] border-l border-[#1a1a1a] overflow-hidden">
          {/* Fond grille */}
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: `linear-gradient(#c9a84c 1px, transparent 1px), linear-gradient(90deg, #c9a84c 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }}
          />
          {/* Radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.1),transparent_60%)]" />

          {/* Contenu central */}
          <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center gap-6 w-full">
            {/* Icône décorative */}
            <div className="w-20 h-20 rounded-2xl bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center mb-2">
              <svg
                className="w-10 h-10 text-[#c9a84c]"
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
              <p className="font-display text-2xl font-bold text-white mb-3">
                Votre avenir,
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c9a84c] to-[#e8c97a]">
                  guidé par l'IA
                </span>
              </p>
              <p className="text-sm text-[#555] leading-relaxed max-w-xs">
                Des recommandations personnalisées basées sur vos notes et votre
                série.
              </p>
            </div>

            {/* Mini stats */}
            <div className="flex gap-6 pt-4 border-t border-[#1a1a1a] w-full justify-center">
              {[
                ["2 400+", "Élèves"],
                ["94%", "Satisfaction"],
                ["60+", "Universités"],
              ].map(([v, l]) => (
                <div key={l} className="text-center">
                  <div className="font-display text-lg font-bold text-[#c9a84c]">
                    {v}
                  </div>
                  <div className="text-[11px] text-[#444]">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
