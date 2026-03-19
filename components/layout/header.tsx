import { useState, useEffect } from "react";
import Link from "next/link";
import OrientysLogo from "@/components/OrientysLogo";

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
          isScrolled ? "backdrop-blur-md border-b" : "bg-transparent",
        ].join(" ")}
        style={
          isScrolled
            ? {
                backgroundColor:
                  "color-mix(in srgb, var(--color-bg-base) 95%, transparent)",
                borderColor: "var(--color-border-strong)",
              }
            : undefined
        }
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <OrientysLogo
                height={36}
                className="transition-transform duration-500 group-hover:scale-105"
              />
              <span
                className="font-display text-xl font-bold tracking-tight"
                style={{ color: "var(--color-text-primary)" }}
              >
                Orientys
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-sm font-medium transition-colors duration-200 group py-1"
                  style={{ color: "var(--color-text-muted)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--color-text-primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--color-text-muted)";
                  }}
                >
                  {link.label}
                  <span
                    className="absolute bottom-0 left-0 w-0 h-[1px] group-hover:w-full transition-all duration-300"
                    style={{ backgroundColor: "var(--color-brand-accent)" }}
                  />
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium transition-colors duration-200"
                style={{ color: "var(--color-text-muted)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--color-text-primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--color-text-muted)";
                }}
              >
                Connexion
              </Link>
              <Link
                href="/signup"
                className="group relative px-5 py-2.5 text-sm font-semibold overflow-hidden rounded"
                style={{ color: "var(--color-bg-base)" }}
              >
                <span
                  className="absolute inset-0 transition-transform duration-300 group-hover:scale-105"
                  style={{ background: "var(--gradient-brand)" }}
                />
                <span className="relative">Commencer gratuitement</span>
              </Link>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px]"
              aria-label="Toggle menu"
            >
              {[
                isMobileMenuOpen ? "rotate-45 translate-y-[6.5px]" : "",
                isMobileMenuOpen ? "opacity-0 scale-x-0" : "",
                isMobileMenuOpen ? "-rotate-45 -translate-y-[6.5px]" : "",
              ].map((extra, i) => (
                <span
                  key={i}
                  className={`block w-6 h-[1.5px] transition-all duration-300 origin-center ${extra}`}
                  style={{ backgroundColor: "var(--color-text-primary)" }}
                />
              ))}
            </button>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 h-[1px] transition-all duration-100"
          style={{
            width: `${scrollProgress}%`,
            background: "var(--gradient-brand)",
          }}
        />
      </header>

      {/* Menu mobile */}
      <div
        className={[
          "fixed inset-0 z-40 lg:hidden transition-all duration-500",
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        ].join(" ")}
      >
        <div
          className="absolute inset-0 backdrop-blur-lg"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--color-bg-base) 98%, transparent)",
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div className="relative flex flex-col h-full px-8 pt-28 pb-12">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={[
                  "text-3xl font-display font-bold transition-all duration-300 py-2 transform",
                  isMobileMenuOpen
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-8 opacity-0",
                ].join(" ")}
                style={{
                  color: "var(--color-text-muted)",
                  transitionDelay: `${i * 60 + 100}ms`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--color-brand-accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--color-text-muted)";
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-4">
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-center py-4 border font-medium rounded transition-colors duration-300"
              style={{
                borderColor: "var(--color-border-strong)",
                color: "var(--color-text-primary)",
              }}
            >
              Connexion
            </Link>
            <Link
              href="/signup"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-center py-4 font-bold rounded"
              style={{
                background: "var(--gradient-brand)",
                color: "var(--color-bg-base)",
              }}
            >
              Commencer gratuitement
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
