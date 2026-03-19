import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 md:p-8 relative overflow-hidden"
      style={{ backgroundColor: "var(--color-bg-overlay)" }}
    >
      <div
        className="absolute inset-0"
        style={{ background: "var(--gradient-hero-radial)" }}
      />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(var(--color-brand-accent) 1px, transparent 1px), linear-gradient(90deg, var(--color-brand-accent) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />
      <div className="relative w-full max-w-3xl">
        <SignupForm />
      </div>
    </div>
  );
}
