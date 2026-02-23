import ContactForm from "@/components/ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Orientys",
  description:
    "Contactez l'équipe Orientys pour toute question sur notre service d'orientation universitaire.",
};

/**
 * Page Contact
 *
 * Structure serveur + composant client ContactForm (interaction formulaire).
 * Header + Footer injectés par ConditionalShell.
 */

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
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#c9a84c]/6 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#c9a84c]/20 bg-[#c9a84c]/5 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
            <span className="text-xs font-semibold text-[#c9a84c] tracking-[0.1em] uppercase">
              Nous contacter
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            Une question ?{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c9a84c] to-[#e8c97a]">
              Parlons-en.
            </span>
          </h1>
          <p className="text-[#666] text-base max-w-xl mx-auto leading-relaxed">
            Notre équipe répond généralement sous 24 à 48 heures ouvrées. Pour
            les demandes urgentes, préférez WhatsApp.
          </p>
        </div>
      </section>

      {/* Corps */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Colonne gauche — infos de contact */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl space-y-5">
              <h2 className="font-display text-lg font-bold text-white">
                Coordonnées
              </h2>

              {[
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
                  value: "contact@orientys.com",
                  href: "mailto:contact@orientys.com",
                },
                {
                  icon: (
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.125.553 4.122 1.522 5.855L.057 23.882a.5.5 0 00.61.61l6.056-1.463A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                    </svg>
                  ),
                  label: "WhatsApp",
                  value: "+228 90 00 00 00",
                  href: "https://wa.me/22890000000",
                },
              ].map(({ icon, label, value, href }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#c9a84c]/10 border border-[#c9a84c]/15 flex items-center justify-center text-[#c9a84c] shrink-0">
                    {icon}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.1em] text-[#444] font-semibold">
                      {label}
                    </p>
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="text-sm text-[#888] hover:text-white transition-colors"
                    >
                      {value}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Horaires */}
            <div className="p-6 bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl space-y-4">
              <h2 className="font-display text-lg font-bold text-white">
                Horaires de réponse
              </h2>
              <div className="space-y-2">
                {[
                  { day: "Lundi – Vendredi", hours: "8h – 18h" },
                  { day: "Samedi", hours: "9h – 13h" },
                  { day: "Dimanche", hours: "Fermé" },
                ].map(({ day, hours }) => (
                  <div
                    key={day}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-[#666]">{day}</span>
                    <span
                      className={
                        hours === "Fermé"
                          ? "text-[#444]"
                          : "text-white font-medium"
                      }
                    >
                      {hours}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#444] border-t border-[#111] pt-3">
                Temps de réponse moyen : 24h ouvrées
              </p>
            </div>
          </div>

          {/* Colonne droite — formulaire */}
          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-white mb-2">
              Questions fréquentes
            </h2>
            <p className="text-[#555] text-sm">
              Trouvez rapidement une réponse à vos interrogations.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FAQ_ITEMS.map(({ q, a }) => (
              <div
                key={q}
                className="p-5 bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl space-y-2 hover:border-[#252525] transition-all"
              >
                <p className="text-sm font-semibold text-white leading-snug">
                  {q}
                </p>
                <p className="text-sm text-[#666] leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
