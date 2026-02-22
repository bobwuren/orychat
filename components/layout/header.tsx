"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

/**
 * Header principal de l'application Orientys.
 *
 * Comportement :
 * - Transparent au sommet de la page, devient opaque au scroll
 * - Indicateur de scroll (barre de progression en bas du header)
 * - Navigation desktop avec hover underline animé
 * - Menu mobile avec overlay full-screen
 */
export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      setIsScrolled(scrollY > 20);
      setScrollProgress(docHeight > 0 ? (scrollY / docHeight) * 100 : 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Empêche le scroll body quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { href: "#features", label: "Fonctionnalités" },
    { href: "#how-it-works", label: "Comment ça marche" },
    { href: "#universities", label: "Universités" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <>
      <header
        className={[
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-[#0e0e0e]/95 backdrop-blur-md border-b border-[#2a2a2a]"
            : "bg-transparent",
        ].join(" ")}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-gradient-to-br from-[#c9a84c] to-[#e8c97a] rounded-sm rotate-45 group-hover:rotate-[60deg] transition-transform duration-500" />
                <div className="absolute inset-[3px] bg-[#0e0e0e] rounded-sm rotate-45" />
                <div className="absolute inset-[6px] bg-gradient-to-br from-[#c9a84c] to-[#e8c97a] rounded-sm rotate-45" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-white">
                Orientys
              </span>
            </Link>

            {/* Navigation desktop */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-sm font-medium text-[#a0a0a0] hover:text-white transition-colors duration-200 group py-1"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#c9a84c] group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </nav>

            {/* CTA desktop */}
            <div className="hidden lg:flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-[#a0a0a0] hover:text-white transition-colors duration-200"
              >
                Connexion
              </Link>
              <Link
                href="/signup"
                className="group relative px-5 py-2.5 text-sm font-semibold text-[#0e0e0e] overflow-hidden rounded"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#c9a84c] to-[#e8c97a] transition-transform duration-300 group-hover:scale-105" />
                <span className="relative">Commencer gratuitement</span>
              </Link>
            </div>

            {/* Burger mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px]"
              aria-label="Toggle menu"
            >
              <span
                className={[
                  "block w-6 h-[1.5px] bg-white transition-all duration-300 origin-center",
                  isMobileMenuOpen ? "rotate-45 translate-y-[6.5px]" : "",
                ].join(" ")}
              />
              <span
                className={[
                  "block w-6 h-[1.5px] bg-white transition-all duration-300",
                  isMobileMenuOpen ? "opacity-0 scale-x-0" : "",
                ].join(" ")}
              />
              <span
                className={[
                  "block w-6 h-[1.5px] bg-white transition-all duration-300 origin-center",
                  isMobileMenuOpen ? "-rotate-45 -translate-y-[6.5px]" : "",
                ].join(" ")}
              />
            </button>
          </div>
        </div>

        {/* Barre de progression scroll */}
        <div
          className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-[#c9a84c] to-[#e8c97a] transition-all duration-100"
          style={{ width: `${scrollProgress}%` }}
        />
      </header>

      {/* Menu mobile — overlay full screen */}
      <div
        className={[
          "fixed inset-0 z-40 lg:hidden transition-all duration-500",
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        ].join(" ")}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-[#0e0e0e]/98 backdrop-blur-lg"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Contenu */}
        <div className="relative flex flex-col h-full px-8 pt-28 pb-12">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={[
                  "text-3xl font-display font-bold text-white/80 hover:text-[#c9a84c] transition-all duration-300 py-2",
                  "transform transition-transform",
                  isMobileMenuOpen
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-8 opacity-0",
                ].join(" ")}
                style={{ transitionDelay: `${i * 60 + 100}ms` }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto flex flex-col gap-4">
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-center py-4 border border-[#2a2a2a] text-white font-medium rounded hover:border-[#c9a84c] transition-colors duration-300"
            >
              Connexion
            </Link>
            <Link
              href="/signup"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-center py-4 bg-gradient-to-r from-[#c9a84c] to-[#e8c97a] text-[#0e0e0e] font-bold rounded"
            >
              Commencer gratuitement
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
