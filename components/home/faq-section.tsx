import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { HelpCircle, MessageCircle, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    question: "Combien coûte le service d'orientation ?",
    answer:
      "Notre test d'orientation et l'accès aux recommandations de base sont entièrement gratuits. Nous proposons également des services premium avec accompagnement personnalisé par nos conseillers experts, à partir de 49€.",
  },
  {
    question: "Combien de temps faut-il pour obtenir mes résultats ?",
    answer:
      "Notre test d'orientation prend environ 10-15 minutes à compléter. Immédiatement après, vous recevrez vos premières recommandations. L'analyse complète par notre IA est disponible en moins de 24 heures.",
  },
  {
    question: "Comment fonctionne l'intelligence artificielle ?",
    answer:
      "Notre IA analyse votre profil sous plusieurs angles : vos centres d'intérêt, compétences, personnalité, résultats scolaires, et aspirations. Elle compare ces données avec notre base de plus de 500 formations et 1000 métiers pour générer des recommandations personnalisées.",
  },
  {
    question: "Puis-je consulter un conseiller en personne ?",
    answer:
      "Oui ! Nous proposons des consultations en ligne avec nos conseillers certifiés. Vous pouvez également participer à nos ateliers d'orientation organisés dans plusieurs villes de France tout au long de l'année.",
  },
  {
    question: "Comment sont protégées mes données personnelles ?",
    answer:
      "Nous prenons la protection de vos données très au sérieux. Toutes vos informations sont chiffrées et stockées en France. Nous ne partageons jamais vos données personnelles avec des tiers sans votre consentement explicite. Consultez notre politique de confidentialité pour plus d'informations.",
  },
  {
    question:
      "Vos recommandations sont-elles à jour avec le marché de l'emploi ?",
    answer:
      "Absolument. Notre équipe met à jour régulièrement notre base de données avec les dernières tendances du marché, les nouveaux métiers émergents, et les évolutions des formations. Nous travaillons en partenariat avec Pôle Emploi et les branches professionnelles.",
  },
  {
    question: "Puis-je utiliser Orientys si je suis déjà étudiant ?",
    answer:
      "Bien sûr ! Notre plateforme est conçue pour tous les niveaux : lycéens, étudiants en réorientation, professionnels en reconversion, et même pour valider un choix d'orientation déjà fait. Chaque profil bénéficie d'un accompagnement adapté.",
  },
  {
    question: "Comment contacter un conseiller en cas de besoin ?",
    answer:
      "Plusieurs options s'offrent à vous : chat en direct sur notre plateforme, email à support@orientys.com, téléphone au 01 23 45 67 89, ou prise de rendez-vous pour une consultation personnalisée. Notre équipe de support répond sous 24 heures maximum.",
  },
];

export default function FAQSection() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm mb-4">
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Questions fréquentes</span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            Vous avez des{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              questions ?
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Trouvez rapidement les réponses à vos interrogations.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto mb-16">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left hover:no-underline hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact Options */}
        <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
          <div className="rounded-xl border border-border/50 p-6 hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold">Chat en direct</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Discutez avec notre équipe en temps réel pour des réponses
              immédiates.
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Ouvrir le chat
            </Button>
          </div>

          <div className="rounded-xl border border-border/50 p-6 hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <Mail className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold">Par email</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Envoyez-nous vos questions et recevez une réponse détaillée sous
              24h.
            </p>
            <Link href="mailto:support@orientys.com">
              <Button variant="outline" size="sm" className="w-full">
                support@orientys.com
              </Button>
            </Link>
          </div>

          <div className="rounded-xl border border-border/50 p-6 hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <HelpCircle className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="font-semibold">Centre d&apos;aide</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Consultez notre base de connaissances complète avec tutoriels et
              guides.
            </p>
            <Link href="/help">
              <Button variant="outline" size="sm" className="w-full">
                Accéder au centre d&apos;aide
              </Button>
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col items-center gap-4 p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
            <h3 className="text-2xl font-bold">
              Vous ne trouvez pas votre réponse ?
            </h3>
            <p className="text-muted-foreground max-w-2xl">
              Notre équipe d&apos;experts est à votre disposition pour répondre
              à toutes vos questions sur l&apos;orientation et votre parcours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/contact">
                <Button size="lg" className="gap-2">
                  Nous contacter
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/faq">
                <Button size="lg" variant="outline">
                  Voir toutes les FAQ
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
