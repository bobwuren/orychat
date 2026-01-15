import HeroSection from "@/components/home/hero-section";
import FeaturesSection from "@/components/home/features-section";
import HowItWorksSection from "@/components/home/how-it-works-section";
import TestimonialsSection from "@/components/home/testimonials-section";
import CTASection from "@/components/home/cta-section";
import StatsSection from "@/components/home/stats-section";
import UniversitiesSection from "@/components/home/universities-section";
import FAQSection from "@/components/home/faq-section";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Universities Partners Section */}
      <UniversitiesSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}
