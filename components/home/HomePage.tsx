import Link from "next/link";

/* ---------------------------------------------------------------------------
 * Page d'accueil publique — Orientys
 *
 * Sections (ordre d'affichage) :
 *  1. Hero         — accroche principale + CTA
 *  2. Stats        — chiffres clés
 *  3. Features     — 3 propositions de valeur
 *  4. How it works — les 3 étapes du flow
 *  5. Universities — logos partenaires
 *  6. Testimonials — témoignages lycéens
 *  7. FAQ          — questions fréquentes
 *  8. CTA final    — conversion
 *
 * Toutes les fonctionnalités restent identiques.
 * Seule l'interface est améliorée.
 * --------------------------------------------------------------------------- */

// ---------------------------------------------------------------------------
// Données statiques
// ---------------------------------------------------------------------------

const stats = [
  { value: "2 400+", label: "Élèves orientés" },
  { value: "18", label: "Séries supportées" },
  { value: "94%", label: "Taux de satisfaction" },
  { value: "60+", label: "Universités partenaires" },
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
      "Chaque recommandation est générée spécifiquement pour votre profil. Pas de liste générique — une orientation pensée pour vous.",
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
    serie: "Série A — Terminale",
  },
  {
    quote:
      "En 3 minutes j'avais une recommandation claire avec les universités qui proposaient la formation. Impressionnant.",
    name: "Mariama D.",
    serie: "Série C — Terminale",
  },
  {
    quote:
      "J'hésitais entre informatique et comptabilité. L'analyse de mes notes a tout clarifié. Je suis maintenant en L1 Info.",
    name: "Edem K.",
    serie: "Série G1 — Terminale",
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
      "Notre modèle analyse le poids de chaque matière dans votre série, identifie vos dominantes et les croise avec les prérequis des filières universitaires pour générer des orientations pertinentes.",
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
// Composants utilitaires
// ---------------------------------------------------------------------------

/**
 * Ligne décorative horizontale avec gradient or
 */
function GoldDivider() {
  return (
    <div className="w-12 h-[2px] bg-gradient-to-r from-[#c9a84c] to-[#e8c97a]" />
  );
}

/**
 * Badge de section (ex: "Fonctionnalités")
 */
function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#c9a84c] border border-[#c9a84c]/30 rounded-full bg-[#c9a84c]/5">
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function HomePage() {
  // Contenu rendu dans app/page.tsx via ConditionalShell (Header + Footer auto)
  return (
    <main className="bg-[#0e0e0e] text-white overflow-x-hidden">
      {/* ------------------------------------------------------------------ */}
      {/* HERO                                                                */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* Fond : gradient radial + grille */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(201,168,76,0.12),transparent)]" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(#c9a84c 1px, transparent 1px), linear-gradient(90deg, #c9a84c 1px, transparent 1px)`,
              backgroundSize: "80px 80px",
            }}
          />
          {/* Grain overlay */}
          <div
            className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
              backgroundSize: "128px 128px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="mb-8 animate-fade-in-up">
              <SectionBadge>Orientation numérique pour lycéens</SectionBadge>
            </div>

            {/* Titre principal */}
            <h1
              className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.95] tracking-tight mb-8 animate-fade-in-up"
              style={{ animationDelay: "100ms" }}
            >
              Découvrez{" "}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c9a84c] to-[#e8c97a]">
                  votre voie
                </span>
                {/* Soulignement décoratif */}
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 300 8"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 6 Q75 2 150 6 Q225 10 298 4"
                    stroke="url(#goldGrad)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <defs>
                    <linearGradient
                      id="goldGrad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#c9a84c" />
                      <stop offset="100%" stopColor="#e8c97a" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              <br />
              après le bac
            </h1>

            {/* Sous-titre */}
            <p
              className="text-lg lg:text-xl text-[#888] max-w-2xl leading-relaxed mb-12 animate-fade-in-up"
              style={{ animationDelay: "200ms" }}
            >
              Entrez vos notes. L&apos;IA analyse votre profil et vous propose
              les orientations universitaires les plus adaptées à votre série et
              à vos résultats.
            </p>

            {/* CTA */}
            <div
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-fade-in-up"
              style={{ animationDelay: "300ms" }}
            >
              <Link
                href="/signup"
                className="group relative inline-flex items-center gap-2 px-8 py-4 font-semibold text-[#0e0e0e] overflow-hidden rounded"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#c9a84c] to-[#e8c97a] transition-all duration-300 group-hover:scale-105" />
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
                className="inline-flex items-center gap-2 text-sm text-[#888] hover:text-white transition-colors duration-200"
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

          {/* Carte flottante décorative — aperçu d'une recommandation */}
          <div className="hidden lg:block absolute right-8 xl:right-0 top-1/2 -translate-y-1/2 w-80 xl:w-96">
            <div className="relative">
              {/* Halo */}
              <div className="absolute -inset-8 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.08),transparent_70%)]" />

              <div className="relative bg-[#141414] border border-[#222] rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c9a84c] to-[#e8c97a] flex items-center justify-center text-[#0e0e0e] text-xs font-bold">
                    IA
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">
                      Recommandation générée
                    </div>
                    <div className="text-[10px] text-[#555]">
                      Série C • 8 matières
                    </div>
                  </div>
                  <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>

                <div className="space-y-3">
                  {[
                    { label: "Génie Informatique", score: 94 },
                    { label: "Mathématiques Appliquées", score: 87 },
                    { label: "Sciences de l'Ingénieur", score: 79 },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-[#aaa]">
                          {item.label}
                        </span>
                        <span className="text-xs font-semibold text-[#c9a84c]">
                          {item.score}%
                        </span>
                      </div>
                      <div className="h-1 bg-[#1e1e1e] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#c9a84c] to-[#e8c97a] rounded-full"
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 pt-5 border-t border-[#1e1e1e] text-[11px] text-[#555]">
                  3 universités disponibles pour ces formations
                </div>
              </div>

              {/* Carte secondaire — badge */}
              <div className="absolute -top-4 -right-4 bg-[#c9a84c] text-[#0e0e0e] text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg">
                Résultat en 30s
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#444]">
          <span className="text-[10px] uppercase tracking-widest">
            Découvrir
          </span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-[#444] to-transparent animate-pulse" />
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* STATS                                                               */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-y border-[#1a1a1a] bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={[
                  "py-10 px-8 flex flex-col gap-1",
                  i < stats.length - 1 ? "border-r border-[#1a1a1a]" : "",
                ].join(" ")}
              >
                <span className="font-display text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#c9a84c] to-[#e8c97a]">
                  {stat.value}
                </span>
                <span className="text-sm text-[#666]">{stat.label}</span>
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
          {/* En-tête de section */}
          <div className="max-w-2xl mb-20">
            <SectionBadge>Fonctionnalités</SectionBadge>
            <h2 className="font-display text-4xl lg:text-5xl font-bold mt-5 mb-5 leading-tight">
              Tout ce dont vous avez besoin pour{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c9a84c] to-[#e8c97a]">
                bien choisir
              </span>
            </h2>
            <GoldDivider />
          </div>

          {/* Grille features */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-[#1a1a1a] rounded-2xl overflow-hidden">
            {features.map((feature) => (
              <div
                key={feature.number}
                className="bg-[#0e0e0e] p-8 lg:p-10 group hover:bg-[#141414] transition-colors duration-300"
              >
                <span className="font-display text-5xl font-bold text-[#1e1e1e] group-hover:text-[#252525] transition-colors duration-300 block mb-6 select-none">
                  {feature.number}
                </span>
                <h3 className="font-display text-xl font-bold text-white mb-4 leading-snug">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#666] leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-6 w-0 h-[1px] bg-gradient-to-r from-[#c9a84c] to-transparent group-hover:w-full transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* HOW IT WORKS                                                        */}
      {/* ------------------------------------------------------------------ */}
      <section id="how-it-works" className="py-24 lg:py-32 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Texte */}
            <div>
              <SectionBadge>Comment ça marche</SectionBadge>
              <h2 className="font-display text-4xl lg:text-5xl font-bold mt-5 mb-5 leading-tight">
                Trois étapes. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c9a84c] to-[#e8c97a]">
                  Moins de 5 minutes.
                </span>
              </h2>
              <GoldDivider />
              <p className="mt-6 text-[#666] leading-relaxed">
                Le processus est conçu pour être rapide et sans friction. Pas de
                création de dossier complexe — juste vos notes et votre série.
              </p>
            </div>

            {/* Steps */}
            <div className="flex flex-col gap-6">
              {steps.map((step, i) => (
                <div key={step.step} className="flex gap-6 group">
                  {/* Indicateur vertical */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full border border-[#c9a84c]/30 bg-[#c9a84c]/5 flex items-center justify-center text-xs font-bold text-[#c9a84c] shrink-0 group-hover:bg-[#c9a84c]/10 transition-colors duration-300">
                      {step.step}
                    </div>
                    {i < steps.length - 1 && (
                      <div className="w-[1px] flex-1 mt-3 bg-gradient-to-b from-[#2a2a2a] to-transparent min-h-[32px]" />
                    )}
                  </div>

                  {/* Contenu */}
                  <div className="pb-6">
                    <h3 className="font-display text-lg font-bold text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#666] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}

              <Link
                href="/signup"
                className="group mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[#c9a84c] hover:text-[#e8c97a] transition-colors duration-200"
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
            <h2 className="font-display text-4xl lg:text-5xl font-bold mt-5 mb-5 leading-tight">
              Des établissements{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c9a84c] to-[#e8c97a]">
                de référence
              </span>
            </h2>
            <p className="text-[#666] leading-relaxed">
              Orientys référence plus de 60 universités et grandes écoles en
              Afrique francophone pour vous proposer des formations accessibles
              et reconnues.
            </p>
          </div>

          {/* Grille placeholder — les vraies données viennent de l'API */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-[#1a1a1a] rounded-2xl overflow-hidden">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="bg-[#0e0e0e] h-24 flex items-center justify-center group hover:bg-[#141414] transition-colors duration-300"
              >
                <div className="w-20 h-6 bg-[#1e1e1e] rounded group-hover:bg-[#252525] transition-colors duration-300" />
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-[#444]">
            Les logos des partenaires sont affichés après connexion
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* TESTIMONIALS                                                        */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-24 lg:py-32 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <SectionBadge>Témoignages</SectionBadge>
            <h2 className="font-display text-4xl lg:text-5xl font-bold mt-5 leading-tight">
              Ce qu&apos;ils en disent
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="relative bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl p-8 hover:border-[#2a2a2a] transition-colors duration-300 group"
              >
                {/* Guillemets décoratifs */}
                <div className="font-display text-6xl text-[#c9a84c]/20 leading-none select-none mb-4">
                  &ldquo;
                </div>
                <p className="text-sm text-[#888] leading-relaxed mb-8 italic">
                  {t.quote}
                </p>
                <div className="flex items-center gap-3 pt-5 border-t border-[#1a1a1a]">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c9a84c]/30 to-[#e8c97a]/10 flex items-center justify-center text-[#c9a84c] text-xs font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {t.name}
                    </div>
                    <div className="text-xs text-[#555]">{t.serie}</div>
                  </div>
                </div>
                {/* Halo hover */}
                <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.03),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
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
            <h2 className="font-display text-4xl lg:text-5xl font-bold mt-5 leading-tight">
              Questions fréquentes
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group border border-[#1a1a1a] rounded-xl overflow-hidden bg-[#0a0a0a] open:border-[#2a2a2a] transition-colors duration-300"
              >
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none text-sm font-semibold text-white hover:text-[#c9a84c] transition-colors duration-200">
                  {faq.question}
                  <span className="ml-4 shrink-0 w-5 h-5 rounded-full border border-[#2a2a2a] flex items-center justify-center text-[#555] group-open:text-[#c9a84c] group-open:border-[#c9a84c] transition-all duration-300">
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
                <div className="px-6 pb-5 text-sm text-[#666] leading-relaxed border-t border-[#1a1a1a] pt-4">
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
      <section className="py-24 lg:py-32 bg-[#080808]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          {/* Fond décoratif */}
          <div className="relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.08),transparent_70%)] pointer-events-none" />

            <p className="text-xs uppercase tracking-[0.2em] text-[#c9a84c] mb-6">
              Prêt à avancer ?
            </p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Votre avenir commence
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c9a84c] to-[#e8c97a]">
                par un seul clic
              </span>
            </h2>
            <p className="text-[#666] max-w-xl mx-auto mb-10 leading-relaxed">
              Créez votre compte gratuitement, saisissez vos notes et obtenez
              une recommandation d&apos;orientation personnalisée en moins de 5
              minutes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="group relative inline-flex items-center gap-2 px-10 py-4 font-semibold text-[#0e0e0e] overflow-hidden rounded"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#c9a84c] to-[#e8c97a] transition-all duration-300 group-hover:scale-105" />
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
              <Link
                href="/login"
                className="text-sm text-[#666] hover:text-white transition-colors duration-200"
              >
                J&apos;ai déjà un compte →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
