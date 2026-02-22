"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { recommendationsApi, notesApi } from "@/lib/api";
import type { Recommendation } from "@/lib/types";
import type { Serie } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  History,
  GraduationCap,
  Building,
  ExternalLink,
  RefreshCw,
} from "lucide-react";

export default function RecommendationPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [recommendation, setRecommendation] = useState<Recommendation | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const notesRaw = sessionStorage.getItem("notesPayload");
    const serieRaw = sessionStorage.getItem("selectedSerie");

    if (!notesRaw || !serieRaw || !user) {
      router.replace("/dashboard");
      return;
    }

    const notesPayload: Array<{ subjectId: string; value: number }> =
      JSON.parse(notesRaw);
    const serie: Serie = JSON.parse(serieRaw);

    const generate = async () => {
      try {
        // 1. Sauvegarder les notes
        await notesApi.saveNotes({
          notes: notesPayload.map((n) => ({
            userId: user.id,
            subjectId: n.subjectId,
            serieId: serie.id,
            value: n.value,
          })),
        });

        // 2. Générer la recommandation
        const res = await recommendationsApi.generate({
          serieId: serie.id,
          notes: notesPayload.map((n) => ({
            subjectId: n.subjectId,
            value: n.value,
          })),
        });

        setRecommendation(res.recommendation);
        // Nettoyer la session
        sessionStorage.removeItem("notesPayload");
      } catch (err: any) {
        setError(err?.message ?? "Erreur lors de la génération.");
      } finally {
        setLoading(false);
      }
    };

    generate();
  }, [user, router]);

  if (loading)
    return (
      <div className="container mx-auto px-4 py-16 max-w-3xl flex flex-col items-center gap-4">
        <RefreshCw className="h-8 w-8 text-primary animate-spin" />
        <p className="text-muted-foreground">
          Génération de votre recommandation…
        </p>
      </div>
    );

  if (error)
    return (
      <div className="container mx-auto px-4 py-16 max-w-3xl text-center space-y-4">
        <p className="text-red-500">{error}</p>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Recommencer
        </Button>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Nouvelle analyse
        </button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/dashboard/history")}
        >
          <History className="mr-1.5 h-4 w-4" /> Historique
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">
          Votre recommandation
        </h1>
        <p className="text-muted-foreground mt-1">
          Basée sur vos notes en série{" "}
          <strong>{recommendation?.serieCode}</strong>
        </p>
      </div>

      <div className="space-y-6">
        {recommendation?.orientations.map((orientation, idx) => (
          <Card key={idx} className="border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                {orientation.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{orientation.why}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Diplômes */}
              {orientation.degrees.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                    Diplômes
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {orientation.degrees.map((d, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {d.articleLink ? (
                          <a
                            href={d.articleLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:underline"
                          >
                            {d.name} <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          d.name
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {/* Universités */}
              {orientation.universities.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                    Universités
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {orientation.universities.map((u, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/50"
                      >
                        <Building className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="font-medium">{u.name}</span>
                        {(u.site || u.website) && (
                          <a
                            href={u.site ?? u.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-auto text-primary hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex gap-3">
        <Button
          onClick={() => router.push("/dashboard")}
          variant="outline"
          className="flex-1"
        >
          Nouvelle analyse
        </Button>
        <Button onClick={() => router.push("/dashboard/history")} className="flex-1">
          <History className="mr-2 h-4 w-4" /> Voir l&apos;historique
        </Button>
      </div>
    </div>
  );
}
