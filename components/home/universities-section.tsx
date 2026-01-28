import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building,
  Award,
  Globe,
  Users,
  BookOpen,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { BGPattern } from "@/components/bg-pattern";

const universities = [
  {
    name: "Université Paris-Saclay",
    logo: "/logos/paris-saclay.svg",
    programs: 120,
    ranking: "#1",
    description: "Première université française dans le classement de Shanghai",
  },
  {
    name: "HEC Paris",
    logo: "/logos/hec.svg",
    programs: 45,
    ranking: "Top 3",
    description: "École de commerce leader en Europe",
  },
  {
    name: "École Polytechnique",
    logo: "/logos/polytechnique.svg",
    programs: 32,
    ranking: "#2",
    description: "Grande école d'ingénieurs d'excellence",
  },
  {
    name: "Sorbonne Université",
    logo: "/logos/sorbonne.svg",
    programs: 85,
    ranking: "Top 5",
    description: "Université pluridisciplinaire de renommée mondiale",
  },
  {
    name: "ESSEC Business School",
    logo: "/logos/essec.svg",
    programs: 38,
    ranking: "Top 5",
    description: "Business school innovante et internationale",
  },
  {
    name: "CentraleSupélec",
    logo: "/logos/centrale.svg",
    programs: 28,
    ranking: "#3",
    description: "Formation d'excellence en ingénierie",
  },
];

const benefits = [
  "Accès prioritaire aux journées portes ouvertes",
  "Bourses d'études partenaires",
  "Parrainage par des anciens élèves",
  "Accompagnement spécial pour les admissions",
  "Simulateur de chances d'admission",
];

export default function UniversitiesSection() {
  return (
    <section className="py-20 md:py-28 relative">
      {/* Pattern de fond pour cette section */}
      <div className="absolute inset-0 -z-10">
        <BGPattern
          variant="dots"
          mask="fade-x"
          size={40}
          fill="hsl(var(--primary) / 0.03)"
        />
      </div>

      <div className="container px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm mb-4 backdrop-blur-sm">
            <Building className="mr-2 h-4 w-4" />
            <span>Partenariats exclusifs</span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            Accédez aux meilleures{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              universités
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Nos partenariats privilégiés vous ouvrent les portes des
            établissements les plus prestigieux.
          </p>
        </div>

        {/* Universities Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {universities.map((uni) => (
            <Card
              key={uni.name}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-background/80 backdrop-blur-sm"
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <Building className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm backdrop-blur-sm">
                    <Award className="h-3 w-3" />
                    <span>{uni.ranking} France</span>
                  </div>
                </div>

                <CardTitle className="text-xl">{uni.name}</CardTitle>
                <CardDescription>{uni.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span>{uni.programs} formations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Accès prioritaire</span>
                  </div>
                </div>

                <div className="mt-4">
                  <Link
                    href={`/universites/${uni.name
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    <Button
                      variant="outline"
                      className="w-full group-hover:border-primary backdrop-blur-sm"
                    >
                      Voir les formations
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits and CTA */}
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Avantages pour nos étudiants</h3>

            <ul className="space-y-4">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <Link href="/partenariats">
                <Button variant="link" className="gap-2 p-0">
                  Découvrir tous nos partenariats
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-8 backdrop-blur-sm relative overflow-hidden">
            {/* Pattern à l'intérieur */}
            <div className="absolute inset-0 -z-10">
              <BGPattern
                variant="dots"
                mask="fade-edges"
                size={16}
                fill="hsl(var(--primary) / 0.1)"
              />
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Programme International</h3>
                  <p className="text-sm text-muted-foreground">
                    Accès aux universités étrangères partenaires
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-background/80 backdrop-blur-sm">
                    <div className="text-2xl font-bold text-primary">50+</div>
                    <p className="text-xs text-muted-foreground">Pays</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-background/80 backdrop-blur-sm">
                    <div className="text-2xl font-bold text-primary">200+</div>
                    <p className="text-xs text-muted-foreground">Universités</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-background/80 backdrop-blur-sm">
                    <div className="text-2xl font-bold text-primary">15%</div>
                    <p className="text-xs text-muted-foreground">Bourses</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link href="/international">
                  <Button variant="outline" className="w-full backdrop-blur-sm">
                    Explorer les opportunités internationales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="inline-block rounded-2xl bg-gradient-to-r from-primary to-primary/60 p-1 backdrop-blur-sm">
            <div className="rounded-xl bg-background/90 p-8 backdrop-blur-sm">
              <h3 className="text-2xl font-bold mb-4">
                Maximisez vos chances d'admission
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Nos conseillers vous aident à préparer vos candidatures et à
                mettre en valeur votre profil pour les admissions sélectives.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/consultation">
                  <Button size="lg" className="gap-2">
                    Réserver une consultation
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/admissions">
                  <Button
                    size="lg"
                    variant="outline"
                    className="backdrop-blur-sm"
                  >
                    En savoir plus sur les admissions
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
