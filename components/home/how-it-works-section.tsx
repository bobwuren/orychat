import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  FileText,
  Brain,
  GraduationCap,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

const steps = [
  {
    step: "01",
    icon: User,
    title: "Créez votre profil",
    description:
      "Renseignez vos centres d'intérêt, compétences et aspirations.",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    step: "02",
    icon: FileText,
    title: "Passez notre test",
    description: "Répondez à notre questionnaire personnalisé (10-15 minutes).",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    step: "03",
    icon: Brain,
    title: "Analyse IA",
    description:
      "Notre intelligence artificielle analyse votre profil sous tous les angles.",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    step: "04",
    icon: GraduationCap,
    title: "Recevez vos résultats",
    description:
      "Obtenez des recommandations de métiers et formations personnalisées.",
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
  {
    step: "05",
    icon: MessageSquare,
    title: "Consultez un expert",
    description: "Discutez avec nos conseillers pour affiner votre choix.",
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
];

const benefits = [
  "Gratuit et sans engagement",
  "Accès instantané aux résultats",
  "Recommandations actualisées",
  "Support personnalisé",
  "Garantie satisfaction",
];

export default function HowItWorksSection() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            Comment ça{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              fonctionne ?
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            En 5 étapes simples, découvrez votre voie idéale.
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 to-transparent hidden lg:block" />

          <div className="grid gap-8 lg:grid-cols-5">
            {steps.map((item, index) => (
              <div key={item.step} className="relative">
                <Card className="h-full border-border/50 hover:border-primary/50 transition-colors">
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <div
                        className={`${item.bgColor} ${item.color} p-4 rounded-full`}
                      >
                        <item.icon className="h-8 w-8" />
                      </div>
                    </div>
                    <div className="flex items-center justify-center mb-2">
                      <span
                        className={`text-sm font-bold ${item.color} bg-opacity-10 px-3 py-1 rounded-full`}
                      >
                        Étape {item.step}
                      </span>
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>

                {/* Connector Arrow for Mobile */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-4">
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Benefits and CTA */}
        <div className="mt-20 grid gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">
              Les avantages de notre plateforme
            </h3>
            <ul className="space-y-4">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="pt-6">
              <Link href="/faq">
                <Button variant="link" className="gap-2 p-0">
                  En savoir plus sur notre méthode
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">
                Prêt à découvrir votre voie ?
              </h3>
              <p className="text-muted-foreground">
                Commencez gratuitement dès maintenant et obtenez vos premières
                recommandations en moins de 10 minutes.
              </p>

              <div className="space-y-4">
                <Link href="/signup" className="block">
                  <Button size="lg" className="w-full gap-2">
                    Créer mon compte gratuit
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <Link href="/orientation/test">
                  <Button size="lg" variant="outline" className="w-full">
                    Tester sans inscription
                  </Button>
                </Link>
              </div>

              <p className="text-sm text-muted-foreground text-center">
                Aucune carte bancaire requise • Essayez avant de vous engager
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
