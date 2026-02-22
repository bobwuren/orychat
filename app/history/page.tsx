"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { recommendationsApi } from "@/lib/api";
import type { Recommendation } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  GraduationCap,
  Plus,
  Clock,
  ChevronDown,
  ChevronUp,
  Building,
  ExternalLink,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export default function HistoryPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    recommendationsApi
      .getUserRecommendations()
      .then((res) => setRecommendations(res.recommendations ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">
            Mes recommandations
          </h1>
          <p className="text-muted-foreground mt-1">
            Historique de vos analyses d&apos;orientation
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard")}>
          <Plus className="mr-2 h-4 w-4" /> Nouvelle analyse
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : recommendations.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto">
            <GraduationCap className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            Aucune recommandation pour le moment.
          </p>
          <Button onClick={() => router.push("/dashboard")}>
            Faire ma première analyse
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {recommendations.map((rec) => {
            const isOpen = expanded === rec.id;
            return (
              <Card key={rec.id} className="border overflow-hidden">
                <button
                  className="w-full text-left"
                  onClick={() => setExpanded(isOpen ? null : rec.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <GraduationCap className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">
                            Série {rec.serieCode ?? "—"}
                          </CardTitle>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(rec.createdAt), {
                                addSuffix: true,
                                locale: fr,
                              })}
                            </span>
                            <Badge variant="secondary" className="text-xs ml-1">
                              {rec.orientations.length} orientation
                              {rec.orientations.length > 1 ? "s" : ""}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </CardHeader>
                </button>

                {isOpen && (
                  <CardContent className="pt-0 space-y-4">
                    {rec.orientations.map((o, idx) => (
                      <div key={idx} className="border-t pt-4 space-y-3">
                        <div>
                          <p className="font-semibold">{o.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {o.why}
                          </p>
                        </div>
                        {o.degrees.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {o.degrees.map((d, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="text-xs"
                              >
                                {d.articleLink ? (
                                  <a
                                    href={d.articleLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 hover:underline"
                                  >
                                    {d.name}{" "}
                                    <ExternalLink className="h-2.5 w-2.5" />
                                  </a>
                                ) : (
                                  d.name
                                )}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {o.universities.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {o.universities.map((u, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/40"
                              >
                                <Building className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                <span className="font-medium truncate">
                                  {u.name}
                                </span>
                                {(u.site || u.website) && (
                                  <a
                                    href={u.site ?? u.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-auto text-primary shrink-0"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
