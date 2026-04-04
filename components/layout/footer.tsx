import Link from "next/link";
import OrientysLogo from "@/components/OrientysLogo";

const productLinks = [
  { href: "/#features", label: "Fonctionnalités" },
  { href: "/#how-it-works", label: "Comment ça marche" },
  { href: "/#universities", label: "Universités partenaires" },
  { href: "/#faq", label: "FAQ" },
  { href: "/signup", label: "Créer un compte" },
  { href: "/login", label: "Se connecter" },
];

const legalLinks = [
  { href: "/privacy", label: "Confidentialité" },
  { href: "/terms", label: "Conditions d'utilisation" },
  { href: "/contact", label: "Contact" },
];

const socialLinks = [
  {
    href: "https://www.facebook.com/acan.tg12",
    label: "Facebook",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    href: "https://tg.linkedin.com/company/acan12",
    label: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.249-.129.597-.129.946v5.441h-3.554s.05-8.736 0-9.646h3.554v1.364c.429-.658 1.196-1.593 2.905-1.593 2.121 0 3.713 1.388 3.713 4.373v5.502zM5.337 8.855c-1.144 0-1.915-.758-1.915-1.704 0-.951.77-1.704 1.96-1.704 1.188 0 1.914.753 1.939 1.704 0 .946-.751 1.704-1.984 1.704zm1.6 11.597H3.738V9.859h3.199v10.593zM22.224 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.224 0z" />
      </svg>
    ),
  },
  {
    href: "https://www.instagram.com/acan_officiel",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative overflow-hidden border-t"
      style={{
        backgroundColor: "var(--color-bg-overlay)",
        borderColor: "var(--color-border-default)",
      }}
    >
      {/* Ligne décorative haut */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] sm:w-[600px] h-[1px]"
        style={{
          background:
            "linear-gradient(to right, transparent, var(--color-brand-accent), transparent)",
          opacity: 0.25,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grille principale */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 py-12 sm:py-16">
          {/* Colonne marque */}
          <div className="sm:col-span-2 lg:col-span-5">
            <Link
              href="/"
              className="inline-flex items-center gap-3 group mb-5 sm:mb-6"
            >
              <OrientysLogo
                width={40}
                height={40}
                className="transition-transform duration-500 group-hover:scale-105"
              />
              <span
                className="font-display text-lg font-bold tracking-tight"
                style={{ color: "var(--color-text-primary)" }}
              >
                Orientys
              </span>
            </Link>
            <p
              className="text-sm leading-relaxed max-w-xs mb-6 sm:mb-8"
              style={{ color: "var(--color-text-muted)" }}
            >
              La plateforme d&apos;orientation numérique qui guide les lycéens
              africains vers les formations digitales qui leur correspondent —
              grâce à l&apos;intelligence artificielle.
            </p>

            {/* Réseaux sociaux */}
            <div className="flex items-center gap-2.5">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="social-icon w-9 h-9 flex items-center justify-center border rounded-lg transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Colonne produit */}
          <div className="lg:col-span-3 lg:col-start-7">
            <h4
              className="text-xs font-semibold uppercase tracking-[0.15em] mb-4 sm:mb-5"
              style={{ color: "var(--color-brand-accent)" }}
            >
              Produit
            </h4>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="nav-link text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne légal */}
          <div className="lg:col-span-3 lg:col-start-11">
            <h4
              className="text-xs font-semibold uppercase tracking-[0.15em] mb-4 sm:mb-5"
              style={{ color: "var(--color-brand-accent)" }}
            >
              Légal
            </h4>
            <ul className="flex flex-col gap-2 sm:gap-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="nav-link text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bas de footer */}
        <div
          className="border-t py-5 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderColor: "var(--color-border-default)" }}
        >
          <p
            className="text-xs text-center sm:text-left"
            style={{ color: "var(--color-text-disabled)" }}
          >
            &copy; {currentYear} Orientys. Tous droits réservés.
          </p>
          <p
            className="text-xs text-center sm:text-right"
            style={{ color: "var(--color-text-disabled)" }}
          >
            Conçu pour les lycéens d&apos;Afrique francophone
          </p>
        </div>
      </div>
    </footer>
  );
}
