"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import OrientysLogo from "@/components/OrientysLogo";

const navLinks = [
  { href: "/#features", label: "Fonctionnalités" },
  { href: "/#how-it-works", label: "Comment ça marche" },
  { href: "/#universities", label: "Universités" },
  { href: "/#faq", label: "FAQ" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setIsScrolled(scrollY > 24);
      setScrollProgress(docHeight > 0 ? (scrollY / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header
        className={[
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled ? "backdrop-blur-xl border-b" : "bg-transparent",
        ].join(" ")}
        style={
          isScrolled
            ? {
                backgroundColor:
                  "color-mix(in srgb, var(--color-bg-base) 92%, transparent)",
                borderColor: "var(--color-border-default)",
                boxShadow: "0 1px 0 0 var(--color-border-subtle)",
              }
            : undefined
        }
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-18 lg:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group shrink-0"
              onClick={closeMobileMenu}
            >
              <OrientysLogo
                width={40}
                height={40}
                className="transition-transform duration-500 group-hover:scale-105"
              />
              <span
                className="font-display text-lg sm:text-xl font-bold tracking-tight"
                style={{ color: "var(--color-text-primary)" }}
              >
                Orientys
              </span>
            </Link>

            {/* Nav desktop */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group"
                  style={{ color: "var(--color-text-muted)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--color-text-primary)";
                    e.currentTarget.style.backgroundColor =
                      "var(--color-bg-surface)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--color-text-muted)";
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {link.label}
                  <span
                    className="absolute bottom-1 left-3 right-3 h-[1px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                    style={{ backgroundColor: "var(--color-brand-accent)" }}
                  />
                </Link>
              ))}
            </nav>

            {/* Actions desktop */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                style={{ color: "var(--color-text-muted)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--color-text-primary)";
                  e.currentTarget.style.backgroundColor =
                    "var(--color-bg-surface)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--color-text-muted)";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                Connexion
              </Link>
              <Link
                href="/signup"
                className="group relative px-5 py-2.5 text-sm font-semibold overflow-hidden rounded-xl"
                style={{ color: "var(--color-bg-base)" }}
              >
                <span
                  className="absolute inset-0 transition-all duration-300 group-hover:brightness-110"
                  style={{ background: "var(--gradient-brand)" }}
                />
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"
                  style={{ background: "var(--gradient-brand)" }}
                />
                <span className="relative">Commencer gratuitement</span>
              </Link>
            </div>

            {/* Burger mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden relative w-10 h-10 flex flex-col justify-center items-center gap-[5px] rounded-lg transition-colors duration-200"
              aria-label={
                isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"
              }
              style={{
                backgroundColor: isMobileMenuOpen
                  ? "var(--color-bg-surface)"
                  : "transparent",
              }}
            >
              <span
                className={`block w-5 h-[1.5px] transition-all duration-300 origin-center ${
                  isMobileMenuOpen ? "rotate-45 translate-y-[3.5px]" : ""
                }`}
                style={{ backgroundColor: "var(--color-text-primary)" }}
              />
              <span
                className={`block h-[1.5px] transition-all duration-300 ${
                  isMobileMenuOpen ? "w-0 opacity-0" : "w-5 opacity-100"
                }`}
                style={{ backgroundColor: "var(--color-text-primary)" }}
              />
              <span
                className={`block w-5 h-[1.5px] transition-all duration-300 origin-center ${
                  isMobileMenuOpen ? "-rotate-45 -translate-y-[3.5px]" : ""
                }`}
                style={{ backgroundColor: "var(--color-text-primary)" }}
              />
            </button>
          </div>
        </div>

        {/* Barre de progression scroll */}
        <div
          className="absolute bottom-0 left-0 h-[2px] transition-all duration-100"
          style={{
            width: `${scrollProgress}%`,
            background: "var(--gradient-brand)",
            opacity: isScrolled ? 1 : 0,
          }}
        />
      </header>

      {/* Overlay mobile menu */}
      <div
        className={[
          "fixed inset-0 z-40 lg:hidden transition-all duration-400",
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        ].join(" ")}
      >
        {/* Fond */}
        <div
          className="absolute inset-0 backdrop-blur-xl"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--color-bg-base) 97%, transparent)",
          }}
          onClick={closeMobileMenu}
        />

        {/* Contenu */}
        <div className="relative flex flex-col h-full px-6 sm:px-8">
          {/* Espaceur header */}
          <div className="h-14 sm:h-16 shrink-0" />

          {/* Liens */}
          <nav className="flex flex-col gap-1 pt-8">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className={[
                  "flex items-center justify-between px-4 py-4 rounded-xl text-2xl font-display font-bold",
                  "transition-all duration-300",
                  "border border-transparent",
                  isMobileMenuOpen
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-6 opacity-0",
                ].join(" ")}
                style={{
                  color: "var(--color-text-primary)",
                  transitionDelay: `${i * 50 + 80}ms`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--color-bg-surface)";
                  e.currentTarget.style.borderColor =
                    "var(--color-border-default)";
                  e.currentTarget.style.color = "var(--color-brand-accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.borderColor = "transparent";
                  e.currentTarget.style.color = "var(--color-text-primary)";
                }}
              >
                <span>{link.label}</span>
                <svg
                  className="w-5 h-5 opacity-30"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M6 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            ))}
          </nav>

          {/* Séparateur */}
          <div
            className={[
              "my-6 h-[1px] transition-all duration-500",
              isMobileMenuOpen ? "opacity-100" : "opacity-0",
            ].join(" ")}
            style={{
              backgroundColor: "var(--color-border-default)",
              transitionDelay: "300ms",
            }}
          />

          {/* Actions */}
          <div
            className={[
              "flex flex-col gap-3 transition-all duration-500",
              isMobileMenuOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0",
            ].join(" ")}
            style={{ transitionDelay: "350ms" }}
          >
            <Link
              href="/login"
              onClick={closeMobileMenu}
              className="text-center py-4 border rounded-xl font-semibold text-sm transition-colors duration-200"
              style={{
                borderColor: "var(--color-border-strong)",
                color: "var(--color-text-primary)",
              }}
            >
              Se connecter
            </Link>
            <Link
              href="/signup"
              onClick={closeMobileMenu}
              className="text-center py-4 rounded-xl font-bold text-sm"
              style={{
                background: "var(--gradient-brand)",
                color: "var(--color-bg-base)",
              }}
            >
              Commencer gratuitement
            </Link>
          </div>

          {/* Footer mobile menu */}
          <div
            className="mt-auto pb-8 text-center"
            style={{ color: "var(--color-text-disabled)" }}
          >
            <p className="text-xs">© 2026 Orientys</p>
          </div>
        </div>
      </div>
    </>
  );
}
