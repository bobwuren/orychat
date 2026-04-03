import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions d'utilisation - Orientys",
  description:
    "Consultez les conditions générales d'utilisation de la plateforme Orientys.",
};

/**
 * Page Conditions d'utilisation (CGU) — Server Component.
 * Aucun event handler. Couleurs via variables CSS du design system.
 */

const SECTIONS = [
  {
    title: "1. Objet",
    content: `Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la plateforme Orientys (ci-après « la Plateforme »), service en ligne d'orientation universitaire assistée par intelligence artificielle, à destination des lycéens et étudiants de l'espace francophone africain.`,
  },
  {
    title: "2. Acceptation des conditions",
    content: `L'utilisation de la Plateforme implique l'acceptation pleine et entière des présentes CGU. Si vous n'acceptez pas ces conditions, vous devez cesser d'utiliser le service. En créant un compte, vous déclarez avoir lu, compris et accepté les présentes CGU.`,
  },
  {
    title: "3. Accès au service",
    content: `L'accès à la Plateforme est réservé aux personnes physiques souhaitant obtenir une orientation universitaire. Pour utiliser le service complet, vous devez :`,
    list: [
      "Créer un compte avec une adresse e-mail valide",
      "Sélectionner votre série scolaire actuelle",
      "Saisir vos notes par matière",
      "Accepter les présentes CGU et la politique de confidentialité",
    ],
  },
  {
    title: "4. Utilisation du service",
    content: `La Plateforme fournit des recommandations d'orientation à titre indicatif uniquement. Ces recommandations ne constituent pas un conseil pédagogique officiel ni une garantie d'admission dans les établissements mentionnés. Vous êtes seul responsable de vos décisions d'orientation.`,
  },
  {
    title: "5. Obligations de l'utilisateur",
    content: `En utilisant la Plateforme, vous vous engagez à :`,
    list: [
      "Fournir des informations exactes et honnêtes (notes, série, informations de compte)",
      "Ne pas tenter d'accéder à des comptes autres que le vôtre",
      "Ne pas utiliser le service à des fins frauduleuses ou illicites",
      "Ne pas reproduire, copier ou revendre une partie du service sans autorisation",
      "Signaler tout dysfonctionnement ou usage abusif à notre équipe",
    ],
  },
  {
    title: "6. Intelligence artificielle et limites",
    content: `Les recommandations générées par notre système d'IA sont basées sur les données que vous saisissez et les informations disponibles sur les établissements partenaires. Orientys ne garantit pas :`,
    list: [
      "L'exactitude ou l'exhaustivité des informations sur les universités",
      "La disponibilité des filières ou les conditions d'admission (susceptibles de changer)",
      "L'adéquation parfaite des recommandations à votre situation personnelle",
      "Un résultat spécifique suite à l'utilisation du service",
    ],
    after:
      "Nous vous encourageons à croiser les recommandations avec d'autres sources d'information officielles.",
  },
  {
    title: "7. Propriété intellectuelle",
    content: `L'ensemble des éléments de la Plateforme (textes, visuels, algorithmes, interface, marque Orientys) est protégé par les droits de propriété intellectuelle. Toute reproduction, modification ou exploitation sans autorisation expresse est interdite.`,
  },
  {
    title: "8. Comptes conseillers",
    content: `Les conseillers d'orientation inscrits sur la Plateforme s'engagent à fournir des conseils bienveillants et professionnels. Orientys se réserve le droit de suspendre tout compte conseiller ne respectant pas ces standards ou les présentes CGU.`,
  },
  {
    title: "9. Suspension et résiliation",
    content: `Orientys se réserve le droit de suspendre ou résilier votre accès sans préavis en cas de :`,
    list: [
      "Violation des présentes CGU",
      "Utilisation frauduleuse du service",
      "Inactivité prolongée du compte",
      "Demande expresse de votre part",
    ],
  },
  {
    title: "10. Limitation de responsabilité",
    content: `Dans les limites permises par la loi applicable, Orientys ne saurait être tenu responsable de tout dommage indirect, perte de données, ou préjudice résultant de l'utilisation ou de l'impossibilité d'utiliser le service. La Plateforme est fournie « en l'état », sans garantie d'aucune sorte.`,
  },
  {
    title: "11. Modification des CGU",
    content: `Orientys se réserve le droit de modifier les présentes CGU à tout moment. Les modifications prennent effet dès leur publication sur la Plateforme. En cas de modification substantielle, vous serez notifié par e-mail. La poursuite de l'utilisation du service vaut acceptation des CGU modifiées.`,
  },
  {
    title: "12. Droit applicable",
    content: `Les présentes CGU sont régies par le droit applicable dans le pays du siège d'Orientys. En cas de litige, les parties s'efforceront de trouver une solution amiable avant tout recours judiciaire.`,
  },
];

const SUMMARY_CARDS = [
  {
    icon: (
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Usage personnel",
    desc: "Le service est destiné à un usage individuel non commercial.",
  },
  {
    icon: (
      <svg
        className="w-4 h-4"
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
    title: "Recommandations IA",
    desc: "Les résultats sont indicatifs, pas des garanties d'admission.",
  },
  {
    icon: (
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
    ),
    title: "Données honnêtes",
    desc: "Vous vous engagez à fournir des informations exactes.",
  },
];

export default function ConditionsUtilisationPage() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-bg-page)" }}
    >
      {/* Hero */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-3xl pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, var(--color-accent-bg-hover), transparent)",
          }}
        />

        <div className="relative max-w-3xl mx-auto px-6">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6"
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
              Légal
            </span>
          </div>

          <h1
            className="font-display text-4xl md:text-5xl font-bold leading-tight mb-4"
            style={{ color: "var(--color-text-primary)" }}
          >
            Conditions
            <br />
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "var(--gradient-brand)" }}
            >
              d&apos;utilisation
            </span>
          </h1>
          <p
            className="text-base leading-relaxed"
            style={{ color: "var(--color-text-muted)" }}
          >
            Ces conditions régissent votre utilisation d&apos;Orientys. En
            créant un compte, vous acceptez ces termes. Merci de les lire
            attentivement.
          </p>
          <p
            className="text-xs mt-4"
            style={{ color: "var(--color-text-disabled)" }}
          >
            Dernière mise à jour : 1er janvier 2025
          </p>
        </div>
      </section>

      {/* Contenu */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        {/* Résumé en 3 cartes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {SUMMARY_CARDS.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="p-4 border rounded-xl space-y-2"
              style={{
                backgroundColor: "var(--color-bg-base)",
                borderColor: "var(--color-border-default)",
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: "var(--color-accent-bg)",
                  color: "var(--color-brand-accent)",
                }}
              >
                {icon}
              </div>
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--color-text-primary)" }}
              >
                {title}
              </p>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "var(--color-text-muted)" }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {SECTIONS.map((section) => (
            <div key={section.title} className="space-y-3">
              <h2
                className="font-display text-xl font-bold"
                style={{ color: "var(--color-text-primary)" }}
              >
                {section.title}
              </h2>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {section.content}
              </p>
              {section.list && (
                <ul className="space-y-2 ml-1">
                  {section.list.map((item) => (
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
              {section.after && (
                <p
                  className="text-sm leading-relaxed italic"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {section.after}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Contact */}
        <div
          className="mt-16 p-6 border rounded-2xl text-center"
          style={{
            backgroundColor: "var(--color-bg-base)",
            borderColor: "var(--color-border-default)",
          }}
        >
          <p
            className="text-sm mb-3"
            style={{ color: "var(--color-text-muted)" }}
          >
            Des questions sur nos conditions d&apos;utilisation ?
          </p>
          {/* link-accent gère le hover via CSS */}
          <a
            href="/contact"
            className="link-accent inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-medium transition-all"
            style={{
              backgroundColor: "var(--color-accent-bg)",
              borderColor: "var(--color-accent-border)",
            }}
          >
            Nous contacter
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}
