"use client";

import { usePathname } from "next/navigation";
import Header from "./header";
import Footer from "./footer";

/**
 * ConditionalShell
 *
 * Wrapper client qui affiche Header et Footer uniquement sur les routes publiques.
 * Les routes dashboard, admin, login et signup ont leur propre chrome — pas de Header/Footer global.
 *
 * Routes publiques (avec Header + Footer) :
 *   /
 *
 * Routes sans Header/Footer :
 *   /login, /signup, /dashboard/*, /admin/*
 */

const ROUTES_WITHOUT_SHELL = ["/login", "/signup"];
const PREFIXES_WITHOUT_SHELL = ["/dashboard", "/admin"];

export default function ConditionalShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideShell =
    ROUTES_WITHOUT_SHELL.includes(pathname) ||
    PREFIXES_WITHOUT_SHELL.some((prefix) => pathname.startsWith(prefix));

  if (hideShell) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
