import Link from "next/link";

/* ---------------------------------------------------------------------------
 * Page d'accueil publique - Orientys
 *
 * Server Component - aucun event handler (onMouseEnter, onMouseLeave, etc.).
 * Les hovers sont gérés exclusivement via les classes CSS définies dans
 * globals.css (@layer components).
 * --------------------------------------------------------------------------- */

const stats = [
  { value: "15 +", label: "Élèves orientés" },
  { value: "10", label: "Séries supportées" },
  { value: "94%", label: "Taux de satisfaction" },
  // { value: "60+", label: "Universités partenaires" },
];

const features = [
  {
    number: "01",
    title: "Analyse intelligente de vos notes",
    description:
      "Notre algorithme évalue vos performances matière par matière et identifie vos points forts réels pour vous proposer des orientations cohérentes.",
  },
  {
    number: "02",
    title: "Recommandations personnalisées par IA",
    description:
      "Chaque recommandation est générée spécifiquement pour votre profil. Pas de liste générique - une orientation pensée pour vous.",
  },
  {
    number: "03",
    title: "Accès aux formations et universités",
    description:
      "Pour chaque orientation recommandée, découvrez les diplômes disponibles et les établissements qui les proposent, avec tous les liens utiles.",
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
    serie: "Série A - Terminale",
  },
  {
    quote:
      "En 3 minutes j'avais une recommandation claire avec les universités qui proposaient la formation. Impressionnant.",
    name: "Mariama D.",
    serie: "Série C - Terminale",
  },
  {
    quote:
      "J'hésitais entre informatique et comptabilité. L'analyse de mes notes a tout clarifié. Je suis maintenant en L1 Info.",
    name: "Edem K.",
    serie: "Série G1 - Terminale",
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

// ---------------------------------------------------------------------------
// Composants utilitaires - Server Components, pas d'event handlers
// ---------------------------------------------------------------------------

/** Séparateur horizontal avec gradient de marque */
function BrandDivider() {
  return (
    <div
      className="w-12 h-[2px]"
      style={{ background: "var(--gradient-brand)" }}
    />
  );
}

/** Badge de section */
function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] rounded-full border"
      style={{
        color: "var(--color-brand-accent)",
        borderColor: "var(--color-accent-border-md)",
        backgroundColor: "var(--color-accent-bg)",
      }}
    >
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function HomePage() {
  return (
    <main
      className="overflow-x-hidden"
      style={{
        backgroundColor: "var(--color-bg-base)",
        color: "var(--color-text-primary)",
      }}
    >
      {/* ------------------------------------------------------------------ */}
      {/* HERO                                                                */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{ background: "var(--gradient-hero-radial)" }}
          />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(var(--color-brand-accent) 1px, transparent 1px), linear-gradient(90deg, var(--color-brand-accent) 1px, transparent 1px)`,
              backgroundSize: "80px 80px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-4xl">
            <div className="mb-8">
              <SectionBadge>Orientation numérique pour lycéens</SectionBadge>
            </div>

            <h1
              className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.95] tracking-tight mb-8"
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
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 300 8"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 6 Q75 2 150 6 Q225 10 298 4"
                    stroke="url(#brandGrad)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <defs>
                    <linearGradient
                      id="brandGrad"
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
              className="text-lg lg:text-xl max-w-2xl leading-relaxed mb-12"
              style={{ color: "var(--color-text-muted)" }}
            >
              Entrez vos notes. L&apos;IA analyse votre profil et vous propose
              les orientations universitaires les plus adaptées à votre série et
              à vos résultats.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* btn-brand gère le hover via CSS */}
              <Link
                href="/signup"
                className="btn-brand group relative inline-flex items-center gap-2 px-8 py-4 font-semibold overflow-hidden rounded"
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
              {/* link-muted gère le hover via CSS */}
              <Link
                href="#how-it-works"
                className="link-muted inline-flex items-center gap-2 text-sm"
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
          </div>

          {/* Carte flottante décorative */}
          <div className="hidden lg:block absolute right-8 xl:right-0 top-1/2 -translate-y-1/2 w-80 xl:w-96">
            <div className="relative">
              <div
                className="absolute -inset-8"
                style={{ background: "var(--gradient-glow)" }}
              />
              <div
                className="relative rounded-2xl p-6 shadow-2xl border"
                style={{
                  backgroundColor: "var(--color-bg-surface)",
                  borderColor: "var(--color-border-strong)",
                }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "var(--gradient-brand)",
                      color: "var(--color-bg-base)",
                    }}
                  >
                    IA
                  </div>
                  <div>
                    <div
                      className="text-xs font-semibold"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      Recommandation générée
                    </div>
                    <div
                      className="text-[10px]"
                      style={{ color: "var(--color-text-disabled)" }}
                    >
                      Série C • 8 matières
                    </div>
                  </div>
                  <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>

                <div className="space-y-3">
                  {[
                    { label: "Génie Informatique", score: 94 },
                    { label: "Analyste en Data Science", score: 87 },
                    { label: "Sciences de l'Ingénieur", score: 79 },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className="text-xs"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          {item.label}
                        </span>
                        <span
                          className="text-xs font-semibold"
                          style={{ color: "var(--color-brand-accent)" }}
                        >
                          {item.score}%
                        </span>
                      </div>
                      <div
                        className="h-1 rounded-full overflow-hidden"
                        style={{ backgroundColor: "var(--color-bg-elevated)" }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${item.score}%`,
                            background: "var(--gradient-brand-soft)",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className="mt-5 pt-5 border-t text-[11px]"
                  style={{
                    borderColor: "var(--color-border-default)",
                    color: "var(--color-text-disabled)",
                  }}
                >
                  3 universités disponibles pour ces formations
                </div>
              </div>

              <div
                className="absolute -top-4 -right-4 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg"
                style={{
                  background: "var(--gradient-brand)",
                  color: "var(--color-bg-base)",
                }}
              >
                Résultat en 30s
              </div>
            </div>
          </div>
        </div>

        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ color: "var(--color-text-disabled)" }}
        >
          <span className="text-[10px] uppercase tracking-widest">
            Découvrir
          </span>
          <div
            className="w-[1px] h-8 animate-pulse"
            style={{
              background: `linear-gradient(to bottom, var(--color-text-disabled), transparent)`,
            }}
          />
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* STATS                                                               */}
      {/* ------------------------------------------------------------------ */}
      <section
        className="border-y"
        style={{
          borderColor: "var(--color-border-default)",
          backgroundColor: "var(--color-bg-page)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-3">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="py-10 px-8 flex flex-col gap-1"
                style={
                  i < stats.length - 1
                    ? { borderRight: `1px solid var(--color-border-default)` }
                    : undefined
                }
              >
                <span
                  className="font-display text-3xl lg:text-4xl font-bold text-transparent bg-clip-text"
                  style={{ backgroundImage: "var(--gradient-brand)" }}
                >
                  {stat.value}
                </span>
                <span
                  className="text-sm"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* FEATURES                                                            */}
      {/* ------------------------------------------------------------------ */}
      <section id="features" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mb-20">
            <SectionBadge>Fonctionnalités</SectionBadge>
            <h2
              className="font-display text-4xl lg:text-5xl font-bold mt-5 mb-5 leading-tight"
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

          {/* gap-px + bg de grille - feature-card gère le hover via CSS */}
          <div
            className="grid grid-cols-1 lg:grid-cols-3 gap-px rounded-2xl overflow-hidden"
            style={{ backgroundColor: "var(--color-border-default)" }}
          >
            {features.map((feature) => (
              <div
                key={feature.number}
                className="feature-card p-8 lg:p-10 group"
              >
                <span
                  className="font-display text-5xl font-bold block mb-6 select-none"
                  style={{ color: "var(--color-border-strong)" }}
                >
                  {feature.number}
                </span>
                <h3
                  className="font-display text-xl font-bold mb-4 leading-snug"
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
                  className="mt-6 w-0 h-[1px] group-hover:w-full transition-all duration-500"
                  style={{ background: "var(--gradient-brand)" }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* HOW IT WORKS                                                        */}
      {/* ------------------------------------------------------------------ */}
      <section
        id="how-it-works"
        className="py-24 lg:py-32"
        style={{ backgroundColor: "var(--color-bg-overlay)" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div>
              <SectionBadge>Comment ça marche</SectionBadge>
              <h2
                className="font-display text-4xl lg:text-5xl font-bold mt-5 mb-5 leading-tight"
                style={{ color: "var(--color-text-primary)" }}
              >
                Trois étapes.{" "}
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: "var(--gradient-brand)" }}
                >
                  Moins de 5 minutes.
                </span>
              </h2>
              <BrandDivider />
              <p
                className="mt-6 leading-relaxed"
                style={{ color: "var(--color-text-muted)" }}
              >
                Le processus est conçu pour être rapide et sans friction. Pas de
                création de dossier complexe - juste vos notes et votre série.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              {steps.map((step, i) => (
                <div key={step.step} className="flex gap-6 group">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-10 h-10 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 transition-colors duration-300 group-hover:bg-[var(--color-accent-bg-hover)]"
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
                        className="w-[1px] flex-1 mt-3 min-h-[32px]"
                        style={{
                          background: `linear-gradient(to bottom, var(--color-border-strong), transparent)`,
                        }}
                      />
                    )}
                  </div>
                  <div className="pb-6">
                    <h3
                      className="font-display text-lg font-bold mb-2"
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
                className="link-accent group mt-2 inline-flex items-center gap-2 text-sm font-semibold"
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

      {/* ------------------------------------------------------------------ */}
      {/* UNIVERSITIES                                                        */}
      {/* ------------------------------------------------------------------ */}
      <section id="universities" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <SectionBadge>Universités partenaires</SectionBadge>
            <h2
              className="font-display text-4xl lg:text-5xl font-bold mt-5 mb-5 leading-tight"
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
              className="leading-relaxed"
              style={{ color: "var(--color-text-muted)" }}
            >
              Orientys référence des universités et grandes écoles en
              Afrique francophone pour vous proposer des formations accessibles
              et reconnues.
            </p>
          </div>

          <div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px rounded-2xl overflow-hidden"
            style={{ backgroundColor: "var(--color-border-default)" }}
          >
            {Array.from({ length: 10 }).map((_, i) => (
              /* uni-card gère le hover via CSS */
              <div
                key={i}
                className="uni-card h-24 flex items-center justify-center"
              >
                <div
                  className="w-20 h-6 rounded"
                  style={{ backgroundColor: "var(--color-bg-elevated)" }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* TESTIMONIALS                                                        */}
      {/* ------------------------------------------------------------------ */}
      <section
        className="py-24 lg:py-32"
        style={{ backgroundColor: "var(--color-bg-overlay)" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <SectionBadge>Témoignages</SectionBadge>
            <h2
              className="font-display text-4xl lg:text-5xl font-bold mt-5 leading-tight"
              style={{ color: "var(--color-text-primary)" }}
            >
              Ce qu&apos;ils en disent
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              /* card-hover gère fond + bordure via CSS */
              <div
                key={i}
                className="card-hover relative rounded-2xl p-8 border group"
              >
                <div
                  className="font-display text-6xl leading-none select-none mb-4"
                  style={{ color: "var(--color-accent-border-md)" }}
                >
                  &ldquo;
                </div>
                <p
                  className="text-sm leading-relaxed mb-8 italic"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {t.quote}
                </p>
                <div
                  className="flex items-center gap-3 pt-5 border-t"
                  style={{ borderColor: "var(--color-border-default)" }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "var(--gradient-brand)",
                      color: "var(--color-bg-base)",
                    }}
                  >
                    {t.name[0]}
                  </div>
                  <div>
                    <div
                      className="text-sm font-semibold"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {t.name}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {t.serie}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* FAQ                                                                 */}
      {/* ------------------------------------------------------------------ */}
      <section id="faq" className="py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <SectionBadge>FAQ</SectionBadge>
            <h2
              className="font-display text-4xl lg:text-5xl font-bold mt-5 leading-tight"
              style={{ color: "var(--color-text-primary)" }}
            >
              Questions fréquentes
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group border rounded-xl overflow-hidden transition-colors duration-300"
                style={{
                  backgroundColor: "var(--color-bg-page)",
                  borderColor: "var(--color-border-default)",
                }}
              >
                <summary
                  className="flex items-center justify-between px-6 py-5 cursor-pointer list-none text-sm font-semibold transition-colors duration-200 hover:text-[var(--color-brand-accent)]"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {faq.question}
                  <span
                    className="ml-4 shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300 group-open:border-[var(--color-brand-accent)] group-open:text-[var(--color-brand-accent)]"
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
                  className="px-6 pb-5 text-sm leading-relaxed border-t pt-4"
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

      {/* ------------------------------------------------------------------ */}
      {/* CTA FINAL                                                           */}
      {/* ------------------------------------------------------------------ */}
      <section
        className="py-24 lg:py-32"
        style={{ backgroundColor: "var(--color-bg-overlay)" }}
      >
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="relative">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "var(--gradient-glow)" }}
            />

            <p
              className="text-xs uppercase tracking-[0.2em] mb-6"
              style={{ color: "var(--color-brand-accent)" }}
            >
              Prêt à avancer ?
            </p>
            <h2
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
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
              className="max-w-xl mx-auto mb-10 leading-relaxed"
              style={{ color: "var(--color-text-muted)" }}
            >
              Créez votre compte gratuitement, saisissez vos notes et obtenez
              une recommandation d&apos;orientation personnalisée en moins de 5
              minutes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="btn-brand group relative inline-flex items-center gap-2 px-10 py-4 font-semibold overflow-hidden rounded"
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
              <Link href="/login" className="link-muted text-sm">
                J&apos;ai déjà un compte →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
