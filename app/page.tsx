"use client";

import Link from "next/link";

/**
 * Page d'accueil publique - Orientys
 *
 * Client Component — event handlers pour les hover effects.
 * Animations via classes CSS définies dans globals.css.
 * Hover gérés via onMouseEnter/onMouseLeave sur les features.
 */

const stats = [
  { value: "15+", label: "Élèves orientés", suffix: "" },
  { value: "10", label: "Séries supportées", suffix: "" },
  { value: "94%", label: "Satisfaction", suffix: "" },
];

const features = [
  {
    number: "01",
    title: "Analyse intelligente de vos notes",
    description:
      "Notre algorithme évalue vos performances matière par matière et identifie vos points forts réels pour proposer des orientations cohérentes.",
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Recommandations personnalisées par IA",
    description:
      "Chaque recommandation est générée spécifiquement pour votre profil. Pas de liste générique — une orientation pensée pour vous.",
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Accès aux formations et universités",
    description:
      "Pour chaque orientation recommandée, découvrez les diplômes disponibles et les établissements qui les proposent, avec tous les liens utiles.",
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const steps = [
  {
    step: "01",
    title: "Choisissez votre série",
    description:
      "Sélectionnez votre série parmi toutes les séries du baccalauréat (A, C, D, F, G1, G2, G3…).",
  },
  {
    step: "02",
    title: "Saisissez vos notes",
    description:
      "Entrez vos notes pour chaque matière de votre série. La saisie prend moins de 2 minutes.",
  },
  {
    step: "03",
    title: "Renseignez votre profil",
    description:
      "L'IA se base sur votre profil pour déterminer le meilleur parcours.",
  },
  {
    step: "04",
    title: "Recevez votre orientation",
    description:
      "L'IA analyse votre profil et génère instantanément des recommandations d'orientation détaillées.",
  },
];

const testimonials = [
  {
    quote:
      "Orientys m'a aidé à comprendre que la filière droit correspondait vraiment à mon profil. Je n'aurais pas fait ce choix seul.",
    name: "Kofi A.",
    serie: "Série A · Terminale",
    initial: "K",
  },
  {
    quote:
      "En 3 minutes j'avais une recommandation claire avec les universités qui proposaient la formation. Impressionnant.",
    name: "Mariama D.",
    serie: "Série C · Terminale",
    initial: "M",
  },
  {
    quote:
      "J'hésitais entre informatique et comptabilité. L'analyse de mes notes a tout clarifié. Je suis maintenant en L1 Info.",
    name: "Edem K.",
    serie: "Série G1 · Terminale",
    initial: "E",
  },
];

const faqs = [
  {
    question: "Est-ce que le service est gratuit ?",
    answer:
      "Oui, la création de compte et la génération de recommandations sont entièrement gratuites pour les lycéens.",
  },
  {
    question: "Quelles séries sont supportées ?",
    answer:
      "Orientys supporte toutes les séries du baccalauréat togolais : A, C, D, F, G1, G2, G3 et plus encore. La liste complète est accessible après connexion.",
  },
  {
    question: "Comment fonctionne l'IA derrière les recommandations ?",
    answer:
      "Notre modèle analyse le poids de chaque matière dans votre série, identifie vos dominantes et les croise avec les prérequis des filières universitaires ainsi que votre profil pour générer des orientations pertinentes.",
  },
  {
    question: "Puis-je consulter mes anciennes recommandations ?",
    answer:
      "Oui. Toutes vos recommandations sont sauvegardées et accessibles depuis votre espace personnel dans l'onglet Historique.",
  },
  {
    question: "Les recommandations sont-elles définitives ?",
    answer:
      "Non. Vous pouvez relancer une analyse à tout moment avec de nouvelles notes ou une autre série. Chaque résultat est indépendant.",
  },
];

function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] rounded-full border"
      style={{
        color: "var(--color-brand-accent)",
        borderColor: "var(--color-accent-border-md)",
        backgroundColor: "var(--color-accent-bg)",
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full animate-glow-pulse"
        style={{ backgroundColor: "var(--color-brand-accent)" }}
      />
      {children}
    </span>
  );
}

function BrandDivider() {
  return (
    <div
      className="w-10 h-[2px] rounded-full"
      style={{ background: "var(--gradient-brand)" }}
    />
  );
}

export default function HomePage() {
  return (
    <main
      className="overflow-x-hidden"
      style={{
        backgroundColor: "var(--color-bg-base)",
        color: "var(--color-text-primary)",
      }}
    >
      {/* ================================================================== */}
      {/* HERO                                                                */}
      {/* ================================================================== */}
      <section className="relative min-h-[100svh] flex items-center pt-14 sm:pt-16">
        {/* Fond décoratif */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute inset-0"
            style={{ background: "var(--gradient-hero-radial)" }}
          />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(var(--color-brand-accent) 1px, transparent 1px), linear-gradient(90deg, var(--color-brand-accent) 1px, transparent 1px)`,
              backgroundSize: "64px 64px",
            }}
          />
          {/* Orbes lumineux */}
          <div
            className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-3xl opacity-[0.06]"
            style={{ background: "var(--gradient-brand)" }}
          />
          <div
            className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full blur-3xl opacity-[0.04]"
            style={{ backgroundColor: "var(--color-brand-light)" }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Contenu gauche */}
            <div className="animate-fade-in-up">
              <div className="mb-6 sm:mb-8">
                <SectionBadge>Orientation numérique pour lycéens</SectionBadge>
              </div>

              <h1
                className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[0.95] tracking-tight mb-6 sm:mb-8"
                style={{ color: "var(--color-text-primary)" }}
              >
                Découvrez{" "}
                <span className="relative inline-block">
                  <span
                    className="text-transparent bg-clip-text"
                    style={{ backgroundImage: "var(--gradient-brand)" }}
                  >
                    votre voie
                  </span>
                  <svg
                    className="absolute -bottom-1 left-0 w-full"
                    viewBox="0 0 300 6"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2 4 Q75 1 150 4 Q225 7 298 3"
                      stroke="url(#heroGrad)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <defs>
                      <linearGradient
                        id="heroGrad"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#1e1b6e" />
                        <stop offset="100%" stopColor="#6b5dd3" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
                <br />
                après le bac
              </h1>

              <p
                className="text-base sm:text-lg max-w-xl leading-relaxed mb-8 sm:mb-10"
                style={{ color: "var(--color-text-muted)" }}
              >
                Entrez vos notes. L&apos;IA analyse votre profil et vous propose
                les orientations universitaires les plus adaptées à votre série
                et à vos résultats.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                <Link
                  href="/signup"
                  className="btn-brand group relative inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 font-semibold rounded-xl w-full sm:w-auto justify-center"
                >
                  <span className="relative">Obtenir mon orientation</span>
                  <svg
                    className="relative w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
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
                </Link>
                <Link
                  href="#how-it-works"
                  className="link-muted inline-flex items-center gap-2 text-sm font-medium w-full sm:w-auto justify-center sm:justify-start"
                >
                  Voir comment ça marche
                  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M8 3v10M4 9l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>

              {/* Social proof */}
              <div
                className="flex items-center gap-4 mt-8 sm:mt-10 pt-8 sm:pt-10 border-t"
                style={{ borderColor: "var(--color-border-default)" }}
              >
                <div className="flex -space-x-2">
                  {["K", "M", "E"].map((initial, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-[11px] font-bold"
                      style={{
                        background: "var(--gradient-brand)",
                        borderColor: "var(--color-bg-base)",
                        color: "var(--color-bg-base)",
                      }}
                    >
                      {initial}
                    </div>
                  ))}
                </div>
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    15+ lycéens guidés
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    94% de satisfaction
                  </p>
                </div>
              </div>
            </div>

            {/* Carte décorative droite */}
            <div
              className="hidden lg:block animate-fade-in"
              style={{ animationDelay: "300ms" }}
            >
              <div className="relative">
                <div
                  className="absolute -inset-6 rounded-3xl animate-glow-pulse"
                  style={{ background: "var(--gradient-glow)" }}
                />

                <div
                  className="relative rounded-2xl p-6 border animate-float"
                  style={{
                    backgroundColor: "var(--color-bg-surface)",
                    borderColor: "var(--color-border-strong)",
                    boxShadow: "0 32px 64px rgba(0,0,0,0.4)",
                  }}
                >
                  {/* Header carte */}
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold"
                      style={{
                        background: "var(--gradient-brand)",
                        color: "var(--color-bg-base)",
                      }}
                    >
                      IA
                    </div>
                    <div className="flex-1">
                      <p
                        className="text-xs font-semibold"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        Recommandation générée
                      </p>
                      <p
                        className="text-[10px]"
                        style={{ color: "var(--color-text-disabled)" }}
                      >
                        Série C · 8 matières analysées
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span
                        className="text-[10px]"
                        style={{ color: "var(--color-text-disabled)" }}
                      >
                        Live
                      </span>
                    </div>
                  </div>

                  {/* Barres */}
                  <div className="space-y-4 mb-6">
                    {[
                      {
                        label: "Génie Informatique",
                        score: 94,
                        color: "#6b5dd3",
                      },
                      {
                        label: "Data Science & IA",
                        score: 87,
                        color: "#8b7fe8",
                      },
                      {
                        label: "Sciences de l'Ingénieur",
                        score: 79,
                        color: "#b4adee",
                      },
                    ].map((item, i) => (
                      <div key={item.label}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className="text-xs"
                            style={{ color: "var(--color-text-secondary)" }}
                          >
                            {item.label}
                          </span>
                          <span
                            className="text-xs font-semibold"
                            style={{ color: item.color }}
                          >
                            {item.score}%
                          </span>
                        </div>
                        <div
                          className="h-1.5 rounded-full overflow-hidden"
                          style={{
                            backgroundColor: "var(--color-bg-elevated)",
                          }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${item.score}%`,
                              backgroundColor: item.color,
                              opacity: 1 - i * 0.15,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer carte */}
                  <div
                    className="flex items-center justify-between pt-4 border-t"
                    style={{ borderColor: "var(--color-border-default)" }}
                  >
                    <span
                      className="text-[11px]"
                      style={{ color: "var(--color-text-disabled)" }}
                    >
                      3 universités disponibles
                    </span>
                    <span
                      className="text-[10px] font-semibold px-2 py-1 rounded-md"
                      style={{
                        backgroundColor: "var(--color-state-success-bg)",
                        color: "var(--color-state-success)",
                        border: "1px solid var(--color-state-success-border)",
                      }}
                    >
                      ✓ Résultat en 30s
                    </span>
                  </div>
                </div>

                {/* Badge flottant */}
                <div
                  className="absolute -top-3 -right-3 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg border"
                  style={{
                    background: "var(--gradient-brand)",
                    color: "var(--color-bg-base)",
                    borderColor: "var(--color-accent-border)",
                  }}
                >
                  Gratuit
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 hidden sm:flex"
          style={{ color: "var(--color-text-disabled)" }}
        >
          <div
            className="w-[1px] h-8 animate-pulse"
            style={{
              background: `linear-gradient(to bottom, var(--color-text-disabled), transparent)`,
            }}
          />
        </div>
      </section>

      {/* ================================================================== */}
      {/* STATS                                                               */}
      {/* ================================================================== */}
      <section
        className="border-y"
        style={{
          borderColor: "var(--color-border-default)",
          backgroundColor: "var(--color-bg-overlay)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="py-8 sm:py-10 px-4 sm:px-8 flex flex-col gap-1 text-center sm:text-left"
                style={
                  i < stats.length - 1
                    ? { borderRight: `1px solid var(--color-border-default)` }
                    : undefined
                }
              >
                <span
                  className="font-display text-2xl sm:text-4xl font-bold text-transparent bg-clip-text"
                  style={{ backgroundImage: "var(--gradient-brand)" }}
                >
                  {stat.value}
                </span>
                <span
                  className="text-xs sm:text-sm"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* FEATURES                                                            */}
      {/* ================================================================== */}
      <section id="features" className="py-20 sm:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12 sm:mb-16">
            <SectionBadge>Fonctionnalités</SectionBadge>
            <h2
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mt-5 mb-5 leading-tight"
              style={{ color: "var(--color-text-primary)" }}
            >
              Tout ce dont vous avez besoin pour{" "}
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "var(--gradient-brand)" }}
              >
                bien choisir
              </span>
            </h2>
            <BrandDivider />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {features.map((feature, i) => (
              <div
                key={feature.number}
                className="group relative p-6 sm:p-8 border rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: "var(--color-bg-base)",
                  borderColor: "var(--color-border-default)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor =
                    "var(--color-border-strong)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 32px rgba(107,93,211,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor =
                    "var(--color-border-default)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Glow hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at top left, rgba(107,93,211,0.06), transparent 60%)`,
                  }}
                />

                {/* Icône */}
                <div
                  className="w-10 h-10 rounded-xl border flex items-center justify-center mb-5"
                  style={{
                    backgroundColor: "var(--color-accent-bg)",
                    borderColor: "var(--color-accent-border)",
                    color: "var(--color-brand-accent)",
                  }}
                >
                  {feature.icon}
                </div>

                <span
                  className="font-display text-4xl font-bold block mb-4 select-none"
                  style={{ color: "var(--color-border-strong)" }}
                >
                  {feature.number}
                </span>
                <h3
                  className="font-display text-lg font-bold mb-3 leading-snug"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {feature.description}
                </p>

                <div
                  className="mt-5 w-0 h-[1px] group-hover:w-full transition-all duration-500 rounded-full"
                  style={{ background: "var(--gradient-brand)" }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* HOW IT WORKS                                                        */}
      {/* ================================================================== */}
      <section
        id="how-it-works"
        className="py-20 sm:py-24 lg:py-32"
        style={{ backgroundColor: "var(--color-bg-overlay)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <SectionBadge>Comment ça marche</SectionBadge>
              <h2
                className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mt-5 mb-5 leading-tight"
                style={{ color: "var(--color-text-primary)" }}
              >
                Quatre étapes.{" "}
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: "var(--gradient-brand)" }}
                >
                  Moins de 5 minutes.
                </span>
              </h2>
              <BrandDivider />
              <p
                className="mt-5 sm:mt-6 leading-relaxed text-sm sm:text-base"
                style={{ color: "var(--color-text-muted)" }}
              >
                Le processus est conçu pour être rapide et sans friction. Pas de
                création de dossier complexe — juste vos notes et votre série.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:gap-5">
              {steps.map((step, i) => (
                <div key={step.step} className="flex gap-4 sm:gap-5 group">
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors duration-300 group-hover:border-[var(--color-brand-accent)]"
                      style={{
                        borderColor: "var(--color-accent-border-md)",
                        backgroundColor: "var(--color-accent-bg)",
                        color: "var(--color-brand-accent)",
                      }}
                    >
                      {step.step}
                    </div>
                    {i < steps.length - 1 && (
                      <div
                        className="w-[1px] flex-1 mt-3 min-h-[28px]"
                        style={{
                          background: `linear-gradient(to bottom, var(--color-accent-border-md), transparent)`,
                        }}
                      />
                    )}
                  </div>
                  <div className="pb-4 sm:pb-5 pt-1.5">
                    <h3
                      className="font-display text-base sm:text-lg font-bold mb-1.5"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}

              <Link
                href="/signup"
                className="link-accent group mt-2 inline-flex items-center gap-2 text-sm font-semibold ml-[3.5rem]"
              >
                Commencer maintenant
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
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* UNIVERSITIES                                                        */}
      {/* ================================================================== */}
      <section id="universities" className="py-20 sm:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <SectionBadge>Universités partenaires</SectionBadge>
            <h2
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mt-5 mb-5 leading-tight"
              style={{ color: "var(--color-text-primary)" }}
            >
              Des établissements{" "}
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "var(--gradient-brand)" }}
              >
                de référence
              </span>
            </h2>
            <p
              className="leading-relaxed text-sm sm:text-base"
              style={{ color: "var(--color-text-muted)" }}
            >
              Orientys référence des universités et grandes écoles en Afrique
              francophone pour vous proposer des formations accessibles et
              reconnues.
            </p>
          </div>

          <div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px rounded-2xl overflow-hidden"
            style={{ backgroundColor: "var(--color-border-default)" }}
          >
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="uni-card h-20 sm:h-24 flex items-center justify-center"
              >
                <div className="w-16 sm:w-20 h-5 sm:h-6 rounded-md skeleton" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* TESTIMONIALS                                                        */}
      {/* ================================================================== */}
      <section
        className="py-20 sm:py-24 lg:py-32"
        style={{ backgroundColor: "var(--color-bg-overlay)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <SectionBadge>Témoignages</SectionBadge>
            <h2
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mt-5 leading-tight"
              style={{ color: "var(--color-text-primary)" }}
            >
              Ce qu&apos;ils en disent
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="card-hover relative rounded-2xl p-6 sm:p-8 border group"
              >
                {/* Guillemet décoratif */}
                <div
                  className="font-display text-5xl sm:text-6xl leading-none select-none mb-3"
                  style={{ color: "var(--color-accent-border-md)" }}
                >
                  &ldquo;
                </div>
                <p
                  className="text-sm leading-relaxed mb-6 sm:mb-8"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {t.quote}
                </p>
                <div
                  className="flex items-center gap-3 pt-4 sm:pt-5 border-t"
                  style={{ borderColor: "var(--color-border-default)" }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{
                      background: "var(--gradient-brand)",
                      color: "var(--color-bg-base)",
                    }}
                  >
                    {t.initial}
                  </div>
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {t.name}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {t.serie}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* FAQ                                                                 */}
      {/* ================================================================== */}
      <section id="faq" className="py-20 sm:py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <SectionBadge>FAQ</SectionBadge>
            <h2
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mt-5 leading-tight"
              style={{ color: "var(--color-text-primary)" }}
            >
              Questions fréquentes
            </h2>
          </div>

          <div className="flex flex-col gap-2.5 sm:gap-3">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group border rounded-xl overflow-hidden"
                style={{
                  backgroundColor: "var(--color-bg-page)",
                  borderColor: "var(--color-border-default)",
                }}
              >
                <summary
                  className="flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 cursor-pointer list-none text-sm font-semibold transition-colors duration-200 hover:text-[var(--color-brand-accent)] gap-4"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  <span>{faq.question}</span>
                  <span
                    className="shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300 group-open:border-[var(--color-brand-accent)] group-open:bg-[var(--color-accent-bg)]"
                    style={{
                      borderColor: "var(--color-border-strong)",
                      color: "var(--color-text-disabled)",
                    }}
                  >
                    <svg
                      className="w-3 h-3 transition-transform duration-300 group-open:rotate-45"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M6 2v8M2 6h8"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </summary>
                <div
                  className="px-5 sm:px-6 pb-4 sm:pb-5 text-sm leading-relaxed border-t pt-4"
                  style={{
                    color: "var(--color-text-muted)",
                    borderColor: "var(--color-border-default)",
                  }}
                >
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* CTA FINAL                                                           */}
      {/* ================================================================== */}
      <section
        className="py-20 sm:py-24 lg:py-32"
        style={{ backgroundColor: "var(--color-bg-overlay)" }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "var(--gradient-glow)" }}
            />

            <p
              className="text-xs uppercase tracking-[0.2em] mb-5 sm:mb-6"
              style={{ color: "var(--color-brand-accent)" }}
            >
              Prêt à avancer ?
            </p>
            <h2
              className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-5 sm:mb-6"
              style={{ color: "var(--color-text-primary)" }}
            >
              Votre avenir commence
              <br />
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "var(--gradient-brand)" }}
              >
                par un seul clic
              </span>
            </h2>
            <p
              className="max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed text-sm sm:text-base"
              style={{ color: "var(--color-text-muted)" }}
            >
              Créez votre compte gratuitement, saisissez vos notes et obtenez
              une recommandation d&apos;orientation personnalisée en moins de 5
              minutes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/signup"
                className="btn-brand group relative inline-flex items-center gap-2.5 px-8 sm:px-10 py-4 font-semibold overflow-hidden rounded-xl w-full sm:w-auto justify-center"
              >
                <span className="relative">Créer mon compte gratuit</span>
                <svg
                  className="relative w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
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
              </Link>
              <Link href="/login" className="link-muted text-sm font-medium">
                J&apos;ai déjà un compte →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
