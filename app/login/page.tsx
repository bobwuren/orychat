import { LoginForm } from "@/components/login-form";

/**
 * Page de connexion.
 * Le formulaire est géré dans LoginForm — cette page est un simple wrapper de mise en page.
 */
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Fond décoratif */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(201,168,76,0.07),transparent)]" />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(#c9a84c 1px, transparent 1px), linear-gradient(90deg, #c9a84c 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />
      <div className="relative w-full max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
}
