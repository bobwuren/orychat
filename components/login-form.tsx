"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";
import OrientysLogo from "@/components/OrientysLogo";

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
      router.push(
        res.data!.user.permissions === "admin" ? "/admin" : "/dashboard",
      );
    } else {
      const err = res.error;
      setError(
        err instanceof Error
          ? err.message
          : typeof err === "string"
            ? err
            : "Échec de la connexion",
      );
    }
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: "var(--color-input-bg)",
    borderColor: "var(--color-input-border)",
    color: "var(--color-text-primary)",
  };

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "var(--color-input-border-focus)";
    e.currentTarget.style.boxShadow = "0 0 0 3px var(--color-input-ring)";
  };

  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "var(--color-input-border)";
    e.currentTarget.style.boxShadow = "none";
  };

  const inputClass =
    "w-full px-4 py-3 border rounded-lg text-sm placeholder:text-[var(--color-text-placeholder)] focus:outline-none transition-all duration-200";

  return (
    <div className={cn("w-full", className)} {...props}>
      <div
        className="grid lg:grid-cols-2 min-h-[520px] border rounded-2xl overflow-hidden shadow-2xl"
        style={{
          backgroundColor: "var(--color-bg-base)",
          borderColor: "var(--color-border-default)",
        }}
      >
        {/* Panneau gauche — formulaire */}
        <div className="flex flex-col justify-center px-8 py-12 lg:px-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 mb-10 group w-fit"
          >
            <OrientysLogo
              height={30}
              className="transition-transform duration-500 group-hover:scale-105"
            />
            <span
              className="font-display text-base font-bold tracking-tight"
              style={{ color: "var(--color-text-primary)" }}
            >
              Orientys
            </span>
          </Link>

          <div className="mb-8">
            <h1
              className="font-display text-3xl font-bold mb-2"
              style={{ color: "var(--color-text-primary)" }}
            >
              Bon retour
            </h1>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              Connectez-vous pour accéder à votre espace
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-xs font-semibold uppercase tracking-[0.12em]"
                style={{ color: "var(--color-text-secondary)" }}
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
                className={inputClass}
                style={inputStyle}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-xs font-semibold uppercase tracking-[0.12em]"
                style={{ color: "var(--color-text-secondary)" }}
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
                  className={`${inputClass} pr-12`}
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "var(--color-text-disabled)" }}
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

            {error && (
              <div
                className="flex items-center gap-2 px-4 py-3 border rounded-lg"
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

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full py-3.5 font-semibold text-sm rounded-lg overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed mt-1"
              style={{ color: "var(--color-bg-base)" }}
            >
              <span
                className="absolute inset-0 transition-transform duration-300 group-hover:scale-105 group-disabled:scale-100"
                style={{ background: "var(--gradient-brand)" }}
              />
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

          <p
            className="mt-6 text-center text-sm"
            style={{ color: "var(--color-text-disabled)" }}
          >
            Pas encore de compte ?{" "}
            <Link
              href="/signup"
              className="font-medium transition-colors"
              style={{ color: "var(--color-brand-accent)" }}
            >
              Créer un compte
            </Link>
          </p>
        </div>

        {/* Panneau droit — visuel */}
        <div
          className="hidden lg:flex relative border-l overflow-hidden"
          style={{
            backgroundColor: "var(--color-bg-overlay)",
            borderColor: "var(--color-border-default)",
          }}
        >
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(var(--color-brand-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-brand-primary) 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "var(--gradient-glow)" }}
          />

          <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center gap-6 w-full">
            <OrientysLogo height={72} />

            <div>
              <p
                className="font-display text-2xl font-bold mb-3"
                style={{ color: "var(--color-text-primary)" }}
              >
                Votre avenir,
                <br />
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: "var(--gradient-brand)" }}
                >
                  guidé par l&apos;IA
                </span>
              </p>
              <p
                className="text-sm leading-relaxed max-w-xs"
                style={{ color: "var(--color-text-muted)" }}
              >
                Des recommandations personnalisées basées sur vos notes et votre
                série.
              </p>
            </div>

            <div
              className="flex gap-6 pt-4 border-t w-full justify-center"
              style={{ borderColor: "var(--color-border-default)" }}
            >
              {[
                ["2 400+", "Élèves"],
                ["94%", "Satisfaction"],
                ["60+", "Universités"],
              ].map(([v, l]) => (
                <div key={l} className="text-center">
                  <div
                    className="font-display text-lg font-bold"
                    style={{ color: "var(--color-brand-accent)" }}
                  >
                    {v}
                  </div>
                  <div
                    className="text-[11px]"
                    style={{ color: "var(--color-text-disabled)" }}
                  >
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
