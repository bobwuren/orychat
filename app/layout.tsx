import type { Metadata } from "next";
import "./globals.css";
import ConditionalShell from "@/components/layout/ConditionalShell";

export const metadata: Metadata = {
  title: "Orientys — Orientation numérique pour lycéens",
  description:
    "Entrez vos notes, obtenez une recommandation d'orientation universitaire personnalisée par IA.",
};

/**
 * Root layout — appliqué à toutes les routes.
 *
 * Le Header et Footer ne s'affichent que sur les routes publiques
 * (pas sur /login, /signup, /dashboard/*, /admin/*).
 * Cette logique est gérée par ConditionalShell côté client via usePathname.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ConditionalShell>{children}</ConditionalShell>
      </body>
    </html>
  );
}
