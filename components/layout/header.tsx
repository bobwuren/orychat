"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Menu, X, Brain, ChevronRight } from "lucide-react";

const navItems = [
  {
    title: "Accueil",
    href: "/",
  },
  {
    title: "Orientation",
    items: [
      {
        title: "Test d'orientation",
        href: "/orientation/test",
        description: "Découvrez vos voies professionnelles avec notre test IA",
      },
      {
        title: "Métiers par secteur",
        href: "/metiers",
        description: "Explorez les métiers porteurs de chaque secteur",
      },
      {
        title: "Filières et formations",
        href: "/formations",
        description: "Toutes les formations disponibles par filière",
      },
    ],
  },
  {
    title: "Universités",
    href: "/universites",
  },
  {
    title: "Ressources",
    items: [
      {
        title: "Blog orientation",
        href: "/blog",
        description: "Conseils et actualités sur l'orientation",
      },
      {
        title: "Guide des études",
        href: "/guides",
        description: "Guides complets par niveau d'études",
      },
      {
        title: "FAQ",
        href: "/faq",
        description: "Réponses aux questions fréquentes",
      },
    ],
  },
  {
    title: "À propos",
    href: "/about",
  },
  {
    title: "Contact",
    href: "/contact",
  },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Orien<span className="text-primary">tys</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <NavigationMenu>
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  {item.items ? (
                    <>
                      <NavigationMenuTrigger>
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                          {item.items.map((subItem) => (
                            <li key={subItem.title}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={subItem.href}
                                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                >
                                  <div className="text-sm font-medium leading-none">
                                    {subItem.title}
                                  </div>
                                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                    {subItem.description}
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none",
                        pathname === item.href
                          ? "bg-accent text-accent-foreground"
                          : "text-foreground/60"
                      )}
                    >
                      {item.title}
                    </Link>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-2">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Connexion
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">
              Commencer gratuitement
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <Link
                  href="/"
                  className="flex items-center space-x-2"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60">
                    <Brain className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-xl font-bold">
                    Orien<span className="text-primary">tys</span>
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <nav className="flex-1 space-y-4">
                {navItems.map((item) => (
                  <div key={item.title}>
                    {item.items ? (
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-muted-foreground px-2">
                          {item.title}
                        </p>
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.title}
                            href={subItem.href}
                            className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                            onClick={() => setIsOpen(false)}
                          >
                            <span>{subItem.title}</span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                          pathname === item.href
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent"
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        <span>{item.title}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              <div className="space-y-3 pt-6 border-t">
                <Link
                  href="/login"
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                >
                  <Button variant="outline" className="w-full">
                    Connexion
                  </Button>
                </Link>
                <Link
                  href="/signup"
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                >
                  <Button className="w-full">Commencer gratuitement</Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
