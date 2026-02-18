import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Star,
  Quote,
  ArrowRight,
  GraduationCap,
  Briefcase,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { BGPattern } from "@/components/bg-pattern";

const testimonials = [
  {
    name: "Marie Dubois",
    role: "Étudiante en Data Science",
    avatar: "MD",
    quote:
      "Grâce à Orientys, j'ai découvert la data science alors que je pensais m'orienter vers le marketing. Aujourd'hui, je suis en master et j'ai déjà une alternance chez Google !",
    rating: 5,
    before: "Étudiante indécise",
    after: "Data Scientist en formation",
    icon: GraduationCap,
  },
  {
    name: "Thomas Martin",
    role: "Développeur Full-Stack",
    avatar: "TM",
    quote:
      "Après un échec en médecine, je ne savais plus quoi faire. La plateforme m'a redirigé vers l'informatique. 3 ans plus tard, je travaille dans une startup à San Francisco.",
    rating: 5,
    before: "Échec en PACES",
    after: "Développeur à l'international",
    icon: Globe,
  },
  {
    name: "Sophie Chen",
    role: "Product Manager",
    avatar: "SC",
    quote:
      "L'analyse IA a parfaitement identifié mon profil de leader et mes compétences en gestion. J'ai suivi les formations recommandées et je gère maintenant une équipe de 15 personnes.",
    rating: 5,
    before: "Étudiante en gestion",
    after: "Product Manager senior",
    icon: Briefcase,
  },
  {
    name: "Lucas Moreau",
    role: "Ingénieur en cybersécurité",
    avatar: "LM",
    quote:
      "Le test m'a révélé une passion pour la sécurité informatique que je ne soupçonnais pas. Les conseillers m'ont guidé vers les meilleures formations du secteur.",
    rating: 5,
    before: "Bac S sans projet",
    after: "Expert en cybersécurité",
    icon: Briefcase,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 md:py-28 relative">
      {/* Pattern de fond pour cette section */}
      <div className="absolute inset-0 -z-10">
        <BGPattern
          variant="dots"
          mask="fade-y"
          size={36}
          fill="hsl(var(--primary) / 0.04)"
        />
      </div>

      <div className="container px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm mb-4 backdrop-blur-sm">
            <Quote className="mr-2 h-4 w-4" />
            <span>Témoignages</span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            Ils ont trouvé leur voie avec{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              nous
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Découvrez les parcours inspirants de nos étudiants.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.name}
              className="group hover:shadow-lg transition-all duration-300 bg-background/80 backdrop-blur-sm"
            >
              <CardContent className="p-6">
                {/* Quote Icon */}
                <div className="mb-4">
                  <Quote className="h-8 w-8 text-primary/30" />
                </div>

                {/* Quote */}
                <p className="text-muted-foreground mb-6 italic">
                  "{testimonial.quote}"
                </p>

                {/* User Info */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transformation */}
                <div className="mt-6 pt-6 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">
                        Avant
                      </p>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {testimonial.before}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">
                        Après
                      </p>
                      <div className="flex items-center gap-2">
                        <testimonial.icon className="h-4 w-4 text-primary" />
                        <span className="font-medium">{testimonial.after}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 backdrop-blur-sm relative overflow-hidden">
            {/* Pattern à l'intérieur du CTA */}
            <div className="absolute inset-0 -z-10">
              <BGPattern
                variant="dots"
                mask="fade-center"
                size={16}
                fill="hsl(var(--primary) / 0.1)"
              />
            </div>

            <div className="text-left">
              <h3 className="text-xl font-bold mb-2">
                Prêt à écrire votre propre succès ?
              </h3>
              <p className="text-muted-foreground">
                Rejoignez les milliers d'étudiants qui ont trouvé leur voie
                grâce à notre plateforme.
              </p>
            </div>
            <Link href="/signup">
              <Button size="lg" className="gap-2 backdrop-blur-sm">
                Commencer maintenant
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* More Testimonials Link */}
          <div className="mt-8">
            <Link href="/temoignages">
              <Button variant="link" className="gap-2">
                Voir plus de témoignages
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
