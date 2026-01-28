import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  Shield,
  Clock,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { BGPattern } from "@/components/bg-pattern";

const guarantees = [
  {
    icon: Sparkles,
    title: "Recommandations personnalisées",
    description: "Basées sur votre profil unique",
  },
  {
    icon: Shield,
    title: "Sans engagement",
    description: "Annulez à tout moment",
  },
  {
    icon: Clock,
    title: "Résultats rapides",
    description: "En moins de 10 minutes",
  },
  {
    icon: CheckCircle2,
    title: "Satisfait ou remboursé",
    description: "Garantie 30 jours",
  },
];

export default function CTASection() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Pattern de fond principal */}
      <div className="absolute inset-0 -z-10">
        <BGPattern
          variant="dots"
          mask="fade-edges"
          size={28}
          fill="hsl(var(--primary) / 0.08)"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-primary/5" />
      </div>

      {/* Pattern supplémentaire pour effet de profondeur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10">
        <BGPattern
          variant="dots"
          mask="fade-center"
          size={12}
          fill="hsl(var(--primary) / 0.15)"
          className="opacity-20"
        />
      </div>

      <div className="container px-4 md:px-6">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-6">
            Prêt à découvrir votre{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              voie idéale ?
            </span>
          </h2>

          <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            Rejoignez les milliers d'étudiants qui ont trouvé leur orientation
            grâce à notre plateforme intelligente.
          </p>

          {/* Guarantees */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {guarantees.map((guarantee) => (
              <div key={guarantee.title} className="text-center">
                <div className="inline-flex items-center justify-center p-3 rounded-full mb-3 bg-primary/10 backdrop-blur-sm">
                  <guarantee.icon className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-1">{guarantee.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {guarantee.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/signup" className="sm:w-auto w-full">
              <Button size="lg" className="w-full gap-2 px-8 backdrop-blur-sm">
                Commencer gratuitement
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <Link href="/orientation/test" className="sm:w-auto w-full">
              <Button
                size="lg"
                variant="outline"
                className="w-full backdrop-blur-sm"
              >
                Essayer sans inscription
              </Button>
            </Link>
          </div>

          {/* Testimonial */}
          <div className="max-w-md mx-auto">
            <div className="rounded-xl bg-background/80 border border-border/50 p-6 shadow-sm backdrop-blur-sm">
              <p className="text-muted-foreground italic mb-4">
                "En 15 minutes, j'ai découvert des métiers que je ne connaissais
                même pas. Aujourd'hui, je suis en école d'ingénieurs grâce à
                OrientaFuture !"
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Alexandre, 19 ans</p>
                  <p className="text-sm text-muted-foreground">
                    Étudiant en ingénierie
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Sparkles
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Links */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm">
            <Link
              href="/about"
              className="text-muted-foreground hover:text-primary"
            >
              À propos de nous
            </Link>
            <Link
              href="/blog"
              className="text-muted-foreground hover:text-primary"
            >
              Blog orientation
            </Link>
            <Link
              href="/careers"
              className="text-muted-foreground hover:text-primary"
            >
              Carrières
            </Link>
            <Link
              href="/press"
              className="text-muted-foreground hover:text-primary"
            >
              Presse
            </Link>
            <Link
              href="/contact"
              className="text-muted-foreground hover:text-primary"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
