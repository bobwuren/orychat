import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Shield, Users, TrendingUp } from "lucide-react";
import Link from "next/link";
import { BGPattern } from "@/components/bg-pattern";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background/80 to-secondary/10 py-20 md:py-28">
      {/* Pattern de fond */}
      <div className="absolute inset-0 -z-10">
        <BGPattern
          variant="dots"
          mask="fade-center"
          size={16}
          fill="hsl(var(--primary) / 0.1)"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-transparent" />
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm backdrop-blur-sm">
                <Sparkles className="mr-2 h-4 w-4" />
                <span>Powered by AI</span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Trouvez votre voie avec{" "}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  l'orientation intelligente
                </span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-2xl">
                Grâce à notre intelligence artificielle et nos conseillers
                experts, découvrez les formations et métiers qui correspondent à
                votre profil, vos passions et vos ambitions.
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-primary/10 p-2 backdrop-blur-sm">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">15K+</p>
                  <p className="text-sm text-muted-foreground">
                    Étudiants accompagnés
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-primary/10 p-2 backdrop-blur-sm">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">95%</p>
                  <p className="text-sm text-muted-foreground">
                    Taux de satisfaction
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-primary/10 p-2 backdrop-blur-sm">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">500+</p>
                  <p className="text-sm text-muted-foreground">
                    Formations disponibles
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/orientation/test" className="sm:w-auto w-full">
                <Button size="lg" className="w-full gap-2">
                  Démarrer le test gratuit
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/consultation" className="sm:w-auto w-full">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full backdrop-blur-sm"
                >
                  Réserver une consultation
                </Button>
              </Link>
            </div>

            <p className="text-sm text-muted-foreground">
              Gratuit • Sans engagement • Résultats en 10 minutes
            </p>
          </div>

          {/* Right Content - Illustration */}
          <div className="relative">
            <div className="relative h-full min-h-[400px] rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-8 backdrop-blur-sm overflow-hidden">
              {/* Pattern à l'intérieur de la carte */}
              <div className="absolute inset-0 -z-10">
                <BGPattern
                  variant="dots"
                  mask="fade-edges"
                  size={12}
                  fill="hsl(var(--primary) / 0.15)"
                />
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />

              <div className="relative z-10 h-full flex flex-col justify-center items-center space-y-6">
                <div className="w-full max-w-sm space-y-4">
                  <div className="rounded-xl bg-background/80 p-6 shadow-lg border backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">Profil analysé</p>
                        <p className="text-sm text-muted-foreground">
                          Intérêts • Compétences • Personnalité
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-2 rounded-full bg-primary/20 overflow-hidden">
                        <div className="h-full w-3/4 bg-gradient-to-r from-primary to-primary/60 rounded-full" />
                      </div>
                      <div className="h-2 rounded-full bg-primary/20 overflow-hidden">
                        <div className="h-full w-2/3 bg-gradient-to-r from-primary to-primary/60 rounded-full" />
                      </div>
                      <div className="h-2 rounded-full bg-primary/20 overflow-hidden">
                        <div className="h-full w-4/5 bg-gradient-to-r from-primary to-primary/60 rounded-full" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg bg-background/80 p-4 text-center border backdrop-blur-sm">
                      <p className="text-2xl font-bold text-primary">12</p>
                      <p className="text-xs text-muted-foreground">
                        Métiers matchés
                      </p>
                    </div>
                    <div className="rounded-lg bg-background/80 p-4 text-center border backdrop-blur-sm">
                      <p className="text-2xl font-bold text-primary">8.7</p>
                      <p className="text-xs text-muted-foreground">
                        Score d'adéquation
                      </p>
                    </div>
                    <div className="rounded-lg bg-background/80 p-4 text-center border backdrop-blur-sm">
                      <p className="text-2xl font-bold text-primary">24</p>
                      <p className="text-xs text-muted-foreground">
                        Formations suggérées
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -bottom-6 -left-6 hidden lg:block">
              <div className="rounded-xl bg-background/80 p-4 shadow-lg border backdrop-blur-sm max-w-xs">
                <p className="font-medium">
                  "Grâce à Orientys, j'ai découvert ma passion pour la data
                  science!"
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  - Marie, étudiante
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
