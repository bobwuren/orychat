import ContactForm from "@/components/ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - Orientys",
  description:
    "Contactez l'équipe Orientys pour toute question sur notre service d'orientation universitaire.",
};

/**
 * Page Contact — Server Component.
 * Hover gérés via classes CSS (card-hover, nav-link) définies dans globals.css.
 */

const CONTACT_ITEMS = [
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
          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    label: "Email",
    value: "contactacan.info@gmail.com",
    href: "mailto:contactacan.info@gmail.com",
    external: false,
  },
  {
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.125.553 4.122 1.522 5.855L.057 23.882a.5.5 0 00.61.61l6.056-1.463A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
      </svg>
    ),
    label: "WhatsApp",
    value: "+228 97 13 33 38",
    href: "https://wa.me/22897133338",
    external: true,
  },
];

const HORAIRES = [
  { day: "Lundi – Vendredi", hours: "8h 30 – 17h" },
  { day: "Samedi et Dimanche", hours: "Fermé" },
];

const FAQ_ITEMS = [
  {
    q: "Comment fonctionne la recommandation IA ?",
    a: "Notre algorithme analyse votre série scolaire et vos notes par matière pour vous recommander les filières et universités les plus adaptées à votre profil académique.",
  },
  {
    q: "Mes données sont-elles sécurisées ?",
    a: "Oui. Vos données sont chiffrées, jamais vendues à des tiers, et vous pouvez demander leur suppression à tout moment depuis votre compte.",
  },
  {
    q: "Le service est-il gratuit ?",
    a: "L'accès de base à la plateforme et à la recommandation IA est gratuit. Les consultations avec un conseiller humain peuvent être payantes selon les modalités choisies.",
  },
  {
    q: "Comment contacter un conseiller ?",
    a: "Après avoir obtenu votre recommandation IA, vous pouvez demander une consultation personnalisée avec l'un de nos conseillers certifiés via votre tableau de bord.",
  },
];

export default function ContactPage() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-bg-page)" }}
    >
      {/* Hero */}
      <section className="relative pt-24 sm:pt-28 pb-12 sm:pb-16 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] sm:w-[700px] h-[250px] sm:h-[350px] rounded-full blur-3xl pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, var(--color-accent-bg-hover), transparent)",
          }}
        />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-5 sm:mb-6"
            style={{
              borderColor: "var(--color-accent-border)",
              backgroundColor: "var(--color-accent-bg)",
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full animate-glow-pulse"
              style={{ backgroundColor: "var(--color-brand-accent)" }}
            />
            <span
              className="text-xs font-semibold tracking-[0.1em] uppercase"
              style={{ color: "var(--color-brand-accent)" }}
            >
              Nous contacter
            </span>
          </div>

          <h1
            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-3 sm:mb-4"
            style={{ color: "var(--color-text-primary)" }}
          >
            Une question ?{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "var(--gradient-brand)" }}
            >
              Parlons-en.
            </span>
          </h1>
          <p
            className="text-sm sm:text-base max-w-xl mx-auto leading-relaxed"
            style={{ color: "var(--color-text-muted)" }}
          >
            Notre équipe répond généralement sous 24 à 48 heures ouvrées. Pour
            les demandes urgentes, préférez WhatsApp.
          </p>
        </div>
      </section>

      {/* Corps */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-12">
          {/* Colonne infos */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Coordonnées */}
            <div
              className="p-5 sm:p-6 border rounded-xl sm:rounded-2xl space-y-4 sm:space-y-5"
              style={{
                backgroundColor: "var(--color-bg-base)",
                borderColor: "var(--color-border-default)",
              }}
            >
              <h2
                className="font-display text-base sm:text-lg font-bold"
                style={{ color: "var(--color-text-primary)" }}
              >
                Coordonnées
              </h2>
              {CONTACT_ITEMS.map(({ icon, label, value, href, external }) => (
                <div key={label} className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl border flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: "var(--color-accent-bg)",
                      borderColor: "var(--color-accent-border)",
                      color: "var(--color-brand-accent)",
                    }}
                  >
                    {icon}
                  </div>
                  <div>
                    <p
                      className="text-[10px] uppercase tracking-[0.1em] font-semibold"
                      style={{ color: "var(--color-text-disabled)" }}
                    >
                      {label}
                    </p>
                    <a
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      className="nav-link text-sm"
                    >
                      {value}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Horaires */}
            <div
              className="p-5 sm:p-6 border rounded-xl sm:rounded-2xl space-y-3 sm:space-y-4"
              style={{
                backgroundColor: "var(--color-bg-base)",
                borderColor: "var(--color-border-default)",
              }}
            >
              <h2
                className="font-display text-base sm:text-lg font-bold"
                style={{ color: "var(--color-text-primary)" }}
              >
                Horaires de réponse
              </h2>
              <div className="space-y-2">
                {HORAIRES.map(({ day, hours }) => (
                  <div
                    key={day}
                    className="flex items-center justify-between text-sm"
                  >
                    <span style={{ color: "var(--color-text-muted)" }}>
                      {day}
                    </span>
                    <span
                      className={hours !== "Fermé" ? "font-medium" : ""}
                      style={{
                        color:
                          hours === "Fermé"
                            ? "var(--color-text-disabled)"
                            : "var(--color-text-primary)",
                      }}
                    >
                      {hours}
                    </span>
                  </div>
                ))}
              </div>
              <p
                className="text-xs border-t pt-3"
                style={{
                  color: "var(--color-text-disabled)",
                  borderColor: "var(--color-border-subtle)",
                }}
              >
                Temps de réponse moyen : 48h ouvrées
              </p>
            </div>
          </div>

          {/* Formulaire */}
          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 sm:mt-20">
          <div className="text-center mb-8 sm:mb-10">
            <h2
              className="font-display text-2xl sm:text-3xl font-bold mb-2"
              style={{ color: "var(--color-text-primary)" }}
            >
              Questions fréquentes
            </h2>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              Trouvez rapidement une réponse à vos interrogations.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {FAQ_ITEMS.map(({ q, a }) => (
              <div
                key={q}
                className="card-hover p-4 sm:p-5 border rounded-xl sm:rounded-2xl space-y-2"
              >
                <p
                  className="text-sm font-semibold leading-snug"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {q}
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
