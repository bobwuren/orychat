import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Orientys",
  description:
    "Découvrez comment Orientys collecte, utilise et protège vos données personnelles.",
};

/**
 * Page Politique de confidentialité
 *
 * Page statique serveur — pas besoin de client.
 * Header + Footer injectés par ConditionalShell.
 */

const SECTIONS = [
  {
    title: "1. Responsable du traitement",
    content: `Orientys (ci-après « nous » ou « la Plateforme ») est responsable du traitement de vos données personnelles. Pour toute question relative à la protection de vos données, vous pouvez nous contacter à l'adresse : privacy@orientys.com.`,
  },
  {
    title: "2. Données collectées",
    content: `Nous collectons uniquement les données nécessaires au fonctionnement du service :`,
    list: [
      "Adresse e-mail et mot de passe lors de la création de votre compte",
      "Série scolaire sélectionnée (ex : Scientifique, Littéraire)",
      "Notes par matière saisies volontairement",
      "Historique des recommandations générées",
      "Données de navigation (adresse IP, navigateur, pages visitées) à des fins statistiques anonymes",
    ],
  },
  {
    title: "3. Finalités du traitement",
    content: `Vos données sont utilisées pour les finalités suivantes :`,
    list: [
      "Fournir le service de recommandation d'orientation universitaire personnalisée",
      "Assurer la sécurité et l'authentification de votre compte",
      "Améliorer la qualité et la pertinence de nos algorithmes d'orientation",
      "Vous envoyer des communications relatives à votre compte (uniquement)",
      "Respecter nos obligations légales",
    ],
  },
  {
    title: "4. Base légale",
    content: `Le traitement de vos données repose sur les bases légales suivantes : l'exécution du contrat (fourniture du service), votre consentement explicite pour les fonctionnalités optionnelles, et nos obligations légales applicables.`,
  },
  {
    title: "5. Conservation des données",
    content: `Vos données sont conservées pendant la durée de votre inscription sur la Plateforme. À la suppression de votre compte, vos données personnelles identifiables sont supprimées sous 30 jours. Les données anonymisées à des fins statistiques peuvent être conservées indéfiniment.`,
  },
  {
    title: "6. Partage des données",
    content: `Nous ne vendons jamais vos données à des tiers. Vos données peuvent être partagées uniquement dans les cas suivants :`,
    list: [
      "Prestataires techniques (hébergement, base de données) opérant sous contrat de confidentialité",
      "Conseillers d'orientation auxquels vous demandez explicitement une consultation",
      "Autorités légales sur réquisition judiciaire",
    ],
  },
  {
    title: "7. Intelligence artificielle",
    content: `Les recommandations d'orientation sont générées par un modèle d'intelligence artificielle (IA) tiers. Vos notes et série sont transmises au modèle de manière sécurisée et ne sont pas utilisées pour entraîner ce modèle. Aucune donnée d'identification personnelle (nom, email) n'est transmise au modèle.`,
  },
  {
    title: "8. Vos droits",
    content: `Conformément à la réglementation applicable en matière de protection des données, vous disposez des droits suivants :`,
    list: [
      "Droit d'accès : obtenir une copie de vos données",
      "Droit de rectification : corriger des données inexactes",
      "Droit à l'effacement : demander la suppression de vos données",
      "Droit à la portabilité : recevoir vos données dans un format structuré",
      "Droit d'opposition : vous opposer à certains traitements",
    ],
    after:
      "Pour exercer ces droits, contactez-nous à privacy@orientys.com. Nous répondrons dans un délai de 30 jours.",
  },
  {
    title: "9. Sécurité",
    content: `Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, altération, divulgation ou destruction. Les mots de passe sont stockés sous forme hachée et ne sont jamais accessibles en clair.`,
  },
  {
    title: "10. Cookies",
    content: `Orientys utilise uniquement des cookies strictement nécessaires au fonctionnement du service (authentification, session). Aucun cookie publicitaire ou de tracking tiers n'est utilisé.`,
  },
  {
    title: "11. Modifications",
    content: `Nous nous réservons le droit de modifier cette politique. En cas de modification substantielle, vous serez notifié par e-mail. La date de dernière mise à jour est indiquée en bas de cette page.`,
  },
];

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        {/* Gradient décoratif */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-[#c9a84c]/6 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#c9a84c]/20 bg-[#c9a84c]/5 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
            <span className="text-xs font-semibold text-[#c9a84c] tracking-[0.1em] uppercase">
              Légal
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            Politique de
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c9a84c] to-[#e8c97a]">
              confidentialité
            </span>
          </h1>
          <p className="text-[#666] text-base leading-relaxed">
            La protection de vos données personnelles est une priorité pour
            Orientys. Ce document décrit comment nous collectons, utilisons et
            protégeons vos informations.
          </p>
          <p className="text-xs text-[#444] mt-4">
            Dernière mise à jour : 1er janvier 2025
          </p>
        </div>
      </section>

      {/* Contenu */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        {/* Résumé rapide */}
        <div className="flex items-start gap-4 p-5 bg-[#c9a84c]/5 border border-[#c9a84c]/15 rounded-2xl mb-12">
          <div className="w-8 h-8 rounded-lg bg-[#c9a84c]/10 flex items-center justify-center shrink-0 mt-0.5">
            <svg
              className="w-4 h-4 text-[#c9a84c]"
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
            <p className="text-sm font-semibold text-white mb-1">
              L'essentiel en bref
            </p>
            <p className="text-sm text-[#888] leading-relaxed">
              Vos données ne sont pas vendues. Seules les informations
              nécessaires au service sont collectées. Vous pouvez demander la
              suppression de votre compte à tout moment. Les mots de passe sont
              hachés et inaccessibles même pour notre équipe.
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {SECTIONS.map((section) => (
            <div key={section.title} className="space-y-3">
              <h2 className="font-display text-xl font-bold text-white">
                {section.title}
              </h2>
              <p className="text-[#888] text-sm leading-relaxed">
                {section.content}
              </p>
              {section.list && (
                <ul className="space-y-2 ml-1">
                  {section.list.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm text-[#777]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]/60 mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {section.after && (
                <p className="text-[#888] text-sm leading-relaxed">
                  {section.after}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-16 p-6 bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl text-center">
          <p className="text-sm text-[#666] mb-3">
            Une question sur vos données personnelles ?
          </p>
          <a
            href="mailto:privacy@orientys.com"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-[#c9a84c] text-sm font-medium hover:bg-[#c9a84c]/15 transition-all"
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
            privacy@orientys.com
          </a>
        </div>
      </section>
    </div>
  );
}
