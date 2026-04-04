import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité - Orientys",
  description:
    "Découvrez comment Orientys collecte, utilise et protège vos données personnelles.",
};

const PRIVACY_SECTIONS = [
  {
    title: "1. Responsable du traitement",
    content: `Orientys est responsable du traitement de vos données personnelles. Pour toute question, contactez-nous à contactacan.info@gmail.com.`,
  },
  {
    title: "2. Données collectées",
    content: `Nous collectons uniquement les données nécessaires au fonctionnement du service :`,
    list: [
      "Adresse e-mail et mot de passe lors de la création de votre compte",
      "Série scolaire sélectionnée",
      "Notes par matière saisies volontairement",
      "Historique des recommandations générées",
      "Données de navigation anonymes à des fins statistiques",
    ],
  },
  {
    title: "3. Finalités du traitement",
    content: `Vos données sont utilisées pour :`,
    list: [
      "Fournir le service de recommandation d'orientation universitaire",
      "Assurer la sécurité et l'authentification de votre compte",
      "Améliorer la qualité de nos algorithmes",
      "Vous envoyer des communications relatives à votre compte",
      "Respecter nos obligations légales",
    ],
  },
  {
    title: "4. Base légale",
    content: `Le traitement repose sur : l'exécution du contrat, votre consentement pour les fonctionnalités optionnelles, et nos obligations légales.`,
  },
  {
    title: "5. Conservation des données",
    content: `Vos données sont conservées pendant la durée de votre inscription. À la suppression, vos données identifiables sont effacées sous 30 jours.`,
  },
  {
    title: "6. Partage des données",
    content: `Nous ne vendons jamais vos données. Partage uniquement avec :`,
    list: [
      "Prestataires techniques sous contrat de confidentialité",
      "Conseillers auxquels vous demandez explicitement une consultation",
      "Autorités légales sur réquisition judiciaire",
    ],
  },
  {
    title: "7. Intelligence artificielle",
    content: `Les recommandations sont générées par un modèle IA tiers. Vos notes sont transmises de manière sécurisée et ne servent pas à entraîner ce modèle. Aucune donnée personnelle identifiante n'est transmise.`,
  },
  {
    title: "8. Vos droits",
    content: `Vous disposez des droits suivants :`,
    list: [
      "Droit d'accès : obtenir une copie de vos données",
      "Droit de rectification : corriger des données inexactes",
      "Droit à l'effacement : demander la suppression",
      "Droit à la portabilité : recevoir vos données dans un format structuré",
      "Droit d'opposition : vous opposer à certains traitements",
    ],
    after:
      "Pour exercer ces droits, contactez contactacan.info@gmail.com. Nous répondrons sous 30 jours.",
  },
  {
    title: "9. Sécurité",
    content: `Nous mettons en œuvre des mesures techniques appropriées pour protéger vos données. Les mots de passe sont stockés sous forme hachée.`,
  },
  {
    title: "10. Cookies",
    content: `Orientys utilise uniquement des cookies strictement nécessaires au fonctionnement (authentification, session). Aucun cookie publicitaire ou de tracking.`,
  },
  {
    title: "11. Modifications",
    content: `Nous nous réservons le droit de modifier cette politique. En cas de modification substantielle, vous serez notifié par e-mail.`,
  },
];

function LegalHero({
  badge,
  title,
  highlight,
  intro,
}: {
  badge: string;
  title: string;
  highlight: string;
  intro: string;
}) {
  return (
    <section className="relative pt-24 sm:pt-28 pb-12 sm:pb-16 overflow-hidden">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] sm:w-[600px] h-[200px] sm:h-[300px] rounded-full blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, var(--color-accent-bg-hover), transparent)",
        }}
      />
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-5 sm:mb-6"
          style={{
            borderColor: "var(--color-accent-border)",
            backgroundColor: "var(--color-accent-bg)",
          }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: "var(--color-brand-accent)" }}
          />
          <span
            className="text-xs font-semibold tracking-[0.1em] uppercase"
            style={{ color: "var(--color-brand-accent)" }}
          >
            {badge}
          </span>
        </div>
        <h1
          className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-3 sm:mb-4"
          style={{ color: "var(--color-text-primary)" }}
        >
          {title}
          <br />
          <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: "var(--gradient-brand)" }}
          >
            {highlight}
          </span>
        </h1>
        <p
          className="text-sm sm:text-base leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
        >
          {intro}
        </p>
      </div>
    </section>
  );
}

function LegalSection({
  title,
  content,
  list,
  after,
}: {
  title: string;
  content: string;
  list?: string[];
  after?: string;
}) {
  return (
    <div className="space-y-2 sm:space-y-3">
      <h2
        className="font-display text-lg sm:text-xl font-bold"
        style={{ color: "var(--color-text-primary)" }}
      >
        {title}
      </h2>
      <p
        className="text-sm leading-relaxed"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {content}
      </p>
      {list && (
        <ul className="space-y-2 ml-1">
          {list.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 text-sm"
              style={{ color: "var(--color-text-muted)" }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                style={{
                  backgroundColor: "var(--color-brand-accent)",
                  opacity: 0.6,
                }}
              />
              {item}
            </li>
          ))}
        </ul>
      )}
      {after && (
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {after}
        </p>
      )}
    </div>
  );
}

export default function PolitiqueConfidentialitePage() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-bg-page)" }}
    >
      <LegalHero
        badge="Légal"
        title="Politique de"
        highlight="confidentialité"
        intro="La protection de vos données personnelles est une priorité pour Orientys. Ce document décrit comment nous collectons, utilisons et protégeons vos informations."
      />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        {/* Résumé */}
        <div
          className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 border rounded-xl sm:rounded-2xl mb-10 sm:mb-12"
          style={{
            backgroundColor: "var(--color-accent-bg)",
            borderColor: "var(--color-accent-border)",
          }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
            style={{
              backgroundColor: "var(--color-accent-bg-hover)",
              color: "var(--color-brand-accent)",
            }}
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
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
              L&apos;essentiel en bref
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Vos données ne sont pas vendues. Seules les informations
              nécessaires au service sont collectées. Vous pouvez demander la
              suppression de votre compte à tout moment. Les mots de passe sont
              hachés et inaccessibles.
            </p>
          </div>
        </div>

        <div className="space-y-8 sm:space-y-10">
          {PRIVACY_SECTIONS.map((s) => (
            <LegalSection key={s.title} {...s} />
          ))}
        </div>

        <div
          className="mt-12 sm:mt-16 p-5 sm:p-6 border rounded-xl sm:rounded-2xl text-center"
          style={{
            backgroundColor: "var(--color-bg-base)",
            borderColor: "var(--color-border-default)",
          }}
        >
          <p
            className="text-sm mb-3"
            style={{ color: "var(--color-text-muted)" }}
          >
            Une question sur vos données personnelles ?
          </p>
          <a
            href="mailto:contactacan.info@gmail.com"
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl border text-sm font-medium transition-all"
            style={{
              backgroundColor: "var(--color-accent-bg)",
              borderColor: "var(--color-accent-border)",
              color: "var(--color-brand-accent)",
            }}
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            contactacan.info@gmail.com
          </a>
        </div>
      </section>
    </div>
  );
}
