import HeroSection from "@/components/home/hero-section";
import FeaturesSection from "@/components/home/features-section";
import HowItWorksSection from "@/components/home/how-it-works-section";
import TestimonialsSection from "@/components/home/testimonials-section";
import CTASection from "@/components/home/cta-section";
import StatsSection from "@/components/home/stats-section";
import UniversitiesSection from "@/components/home/universities-section";
import FAQSection from "@/components/home/faq-section";
import { BGPattern } from "@/components/bg-pattern";

export default function HomePage() {
  return (
    <div className="flex flex-col relative">
      <div className="fixed inset-0 -z-50">
        <BGPattern
          variant="dots"
          mask="fade-edges"
          size={32}
          fill="hsl(var(--primary) / 0.1)"
        />
      </div>
      <div className="relative z-10">
        <HeroSection />
        <StatsSection />
        <div className="relative">
          <BGPattern
            variant="dots"
            mask="fade-center"
            size={48}
            fill="hsl(var(--primary) / 0.05)"
            className="absolute inset-0 -z-10"
          />
          <FeaturesSection />
        </div>
        <HowItWorksSection />
        <div className="relative">
          <BGPattern
            variant="dots"
            mask="fade-x"
            size={40}
            fill="hsl(var(--primary) / 0.03)"
            className="absolute inset-0 -z-10"
          />
          <UniversitiesSection />
        </div>
        <div className="relative">
          <BGPattern
            variant="dots"
            mask="fade-y"
            size={36}
            fill="hsl(var(--primary) / 0.04)"
            className="absolute inset-0 -z-10"
          />
          <TestimonialsSection />
        </div>
        <FAQSection />
        <div className="relative overflow-hidden">
          <BGPattern
            variant="dots"
            mask="fade-edges"
            size={28}
            fill="hsl(var(--primary) / 0.08)"
            className="absolute inset-0 -z-10"
          />
          <CTASection />
        </div>
      </div>
    </div>
  );
}
