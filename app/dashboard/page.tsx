"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { seriesApi } from "@/lib/api";
import type { Serie } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronRight,
  GraduationCap,
  BookOpen,
  FlaskConical,
  Brain,
  Wrench,
  TrendingUp,
  PieChart,
  Target,
} from "lucide-react";

function getSerieIcon(code: string) {
  if (!code) return GraduationCap;
  const c = code.toUpperCase();
  if (c.startsWith("A")) return BookOpen;
  if (c.startsWith("C")) return FlaskConical;
  if (c.startsWith("D")) return Brain;
  if (c.startsWith("F")) return Wrench;
  if (c.startsWith("G1")) return TrendingUp;
  if (c.startsWith("G2")) return PieChart;
  if (c.startsWith("G3")) return Target;
  return GraduationCap;
}

export default function DashboardPage() {
  const router = useRouter();
  const [series, setSeries] = useState<Serie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    seriesApi
      .getAll()
      .then((res) => setSeries(res.series ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (serie: Serie) => {
    sessionStorage.setItem("selectedSerie", JSON.stringify(serie));
    router.push("/notes");
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">
          Choisissez votre série
        </h1>
        <p className="text-muted-foreground mt-1">
          Sélectionnez votre filière pour saisir vos notes et obtenir une
          recommandation d&apos;orientation.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {series.map((serie) => {
            const Icon = getSerieIcon(serie.code);
            return (
              <Card
                key={serie.id}
                className="cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200 border hover:border-primary/50 group"
                onClick={() => handleSelect(serie)}
              >
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground">{serie.code}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {serie.description}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
