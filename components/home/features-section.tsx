import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Brain, Users, BarChart3, Shield, Zap, Globe } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "IA Intelligente",
    description:
      "Notre algorithme analyse votre profil, vos compétences et vos intérêts pour des recommandations précises.",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    icon: Users,
    title: "Conseillers Experts",
    description:
      "Accompagnement personnalisé par des conseillers d'orientation certifiés et expérimentés.",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    icon: BarChart3,
    title: "Analyse de Marché",
    description:
      "Données actualisées sur les métiers porteurs et les tendances du marché de l'emploi.",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    icon: Shield,
    title: "Confidentialité Totale",
    description:
      "Vos données sont protégées et ne seront jamais partagées sans votre consentement.",
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
  {
    icon: Zap,
    title: "Résultats Rapides",
    description:
      "Obtenez vos recommandations d'orientation en moins de 10 minutes.",
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
  {
    icon: Globe,
    title: "Couverture Nationale",
    description:
      "Accès à toutes les formations et universités en France et à l'international.",
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-secondary/20 to-background">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            Pourquoi choisir{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Orientys ?
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Une plateforme complète qui combine technologie et expertise humaine
            pour votre réussite.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50"
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div
                    className={`${feature.bgColor} ${feature.color} p-3 rounded-xl group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Banner */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">98%</div>
              <p className="text-sm text-muted-foreground mt-2">
                Des utilisateurs satisfaits
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">15K+</div>
              <p className="text-sm text-muted-foreground mt-2">
                Étudiants accompagnés
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">500+</div>
              <p className="text-sm text-muted-foreground mt-2">
                Partenariats universités
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">24h</div>
              <p className="text-sm text-muted-foreground mt-2">
                Support moyen de réponse
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
