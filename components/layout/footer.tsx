import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Send,
  Brain,
  Award,
  Users,
  GraduationCap,
} from "lucide-react";

const footerLinks = {
  orientation: [
    { name: "Test d'orientation", href: "/orientation/test" },
    { name: "Métiers par secteur", href: "/metiers" },
    { name: "Filières et formations", href: "/formations" },
    { name: "Universités partenaires", href: "/universites" },
    { name: "FAQ Orientation", href: "/faq" },
  ],
  ressources: [
    { name: "Blog orientation", href: "/blog" },
    { name: "Guide des études", href: "/guides" },
    { name: "Témoignages", href: "/temoignages" },
    { name: "Événements", href: "/evenements" },
    { name: "Newsletter", href: "/newsletter" },
  ],
  aPropos: [
    { name: "Notre mission", href: "/about" },
    { name: "Notre équipe", href: "/team" },
    { name: "Partenariats", href: "/partenariats" },
    { name: "Carrières", href: "/carrieres" },
    { name: "Presse", href: "/presse" },
  ],
  legal: [
    { name: "Conditions d'utilisation", href: "/conditions" },
    { name: "Politique de confidentialité", href: "/confidentialite" },
    { name: "Cookies", href: "/cookies" },
    { name: "Mentions légales", href: "/mentions-legales" },
    { name: "CGV", href: "/cgv" },
  ],
  contact: [
    { name: "Nous contacter", href: "/contact" },
    { name: "Support", href: "/support" },
    { name: "Devenir conseiller", href: "/devenir-conseiller" },
    { name: "Devenir partenaire", href: "/devenir-partenaire" },
  ],
};

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "https://facebook.com/Orientys" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com/Orientys" },
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/Orientys" },
  { name: "Instagram", icon: Instagram, href: "https://instagram.com/Orientys" },
  { name: "YouTube", icon: Youtube, href: "https://youtube.com/Orientys" },
];

const partnerUniversities = [
  "Université Paris-Saclay",
  "Sorbonne Université",
  "HEC Paris",
  "École Polytechnique",
  "CentraleSupélec",
  "ESSEC Business School",
  "Sciences Po",
  "Université de Lyon",
];

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-background to-secondary/30 border-t">
      {/* Newsletter Section */}
      <div className="container px-4 py-12 md:px-6 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold tracking-tight">
              Restez informé sur l&apos;orientation
            </h3>
            <p className="text-muted-foreground max-w-lg">
              Recevez nos conseils, actualités sur les formations et opportunités 
              directement dans votre boîte mail.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Award className="h-4 w-4" />
              <span>+15 000 étudiants accompagnés</span>
            </div>
          </div>
          
          <form className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input 
                type="email" 
                placeholder="Votre email" 
                className="flex-1"
                required
              />
              <Button type="submit" className="gap-2">
                <Send className="h-4 w-4" />
                S&apos;abonner
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              En vous abonnant, vous acceptez notre{" "}
              <Link href="/confidentialite" className="underline hover:text-primary">
                politique de confidentialité
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="border-t">
        <div className="container px-4 py-12 md:px-6">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Brand and Description */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60">
                  <Brain className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">
                    Orien<span className="text-primary">tys</span>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Votre compagnon d&apos;orientation intelligent
                  </p>
                </div>
              </div>
              
              <p className="text-muted-foreground max-w-md">
                Nous accompagnons les étudiants dans leur parcours d&apos;orientation 
                grâce à l&apos;intelligence artificielle et l&apos;expertise de nos conseillers.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <span className="text-sm">+500 formations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-sm">+50 conseillers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <span className="text-sm">95% de satisfaction</span>
                </div>
              </div>
              
              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full border bg-background hover:bg-accent transition-colors"
                    aria-label={social.name}
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Grid */}
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div className="space-y-4">
                <h4 className="font-semibold">Orientation</h4>
                <ul className="space-y-2">
                  {footerLinks.orientation.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">Ressources</h4>
                <ul className="space-y-2">
                  {footerLinks.ressources.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">Légal</h4>
                <ul className="space-y-2">
                  {footerLinks.legal.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Universities Partners */}
          <div className="mt-12 pt-8 border-t">
            <h4 className="text-center font-semibold mb-6">
              Universités partenaires
            </h4>
            <div className="flex flex-wrap justify-center gap-4">
              {partnerUniversities.map((university) => (
                <div
                  key={university}
                  className="px-4 py-2 rounded-full border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  {university}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <a 
                  href="mailto:contact@Orientys.fr" 
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  contact@Orientys.fr
                </a>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Téléphone</p>
                <a 
                  href="tel:+33123456789" 
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  +33 1 23 45 67 89
                </a>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Adresse</p>
                <p className="text-sm text-muted-foreground">
                  123 Rue de l&apos;Éducation, 75000 Paris
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Accordion */}
          <div className="mt-8 md:hidden">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="orientation">
                <AccordionTrigger>Orientation</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {footerLinks.orientation.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground hover:text-primary"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="ressources">
                <AccordionTrigger>Ressources</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {footerLinks.ressources.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground hover:text-primary"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="legal">
                <AccordionTrigger>Légal</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {footerLinks.legal.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground hover:text-primary"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t bg-secondary/20">
        <div className="container flex flex-col sm:flex-row justify-between items-center gap-4 px-4 py-6 md:px-6">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            © {new Date().getFullYear()} Orientys. Tous droits réservés.
          </p>
          
          <div className="flex items-center gap-4">
            <Link
              href="/confidentialite"
              className="text-xs text-muted-foreground hover:text-primary"
            >
              Confidentialité
            </Link>
            <Link
              href="/conditions"
              className="text-xs text-muted-foreground hover:text-primary"
            >
              Conditions
            </Link>
            <Link
              href="/cookies"
              className="text-xs text-muted-foreground hover:text-primary"
            >
              Cookies
            </Link>
            <Link
              href="/accessibilite"
              className="text-xs text-muted-foreground hover:text-primary"
            >
              Accessibilité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}