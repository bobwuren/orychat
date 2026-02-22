"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { History, LogOut, GraduationCap } from "lucide-react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, loading, logout, user } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) router.replace("/login");
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      {/* Navbar client */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-semibold text-primary"
          >
            <GraduationCap className="h-5 w-5" />
            Orientys
          </Link>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/history">
                <History className="h-4 w-4 mr-1.5" />
                Historique
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-muted-foreground hover:text-red-600"
            >
              <LogOut className="h-4 w-4 mr-1.5" />
              Déconnexion
            </Button>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
