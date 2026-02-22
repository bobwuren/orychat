"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Serie, SubjectWithCoefficients } from "@/lib/types";
import { subjectsApi } from "@/lib/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, AlertCircle } from "lucide-react";

export default function NotesPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [serie, setSerie] = useState<Serie | null>(null);
  const [subjects, setSubjects] = useState<SubjectWithCoefficients[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedSerie");
    if (!stored) {
      router.replace("/dashboard");
      return;
    }

    const s: Serie = JSON.parse(stored);
    setSerie(s);

    subjectsApi
      .getBySerie(s.id)
      .then((res: any) => {
        const list: SubjectWithCoefficients[] = Array.isArray(res)
          ? res
          : (res.subjects ?? []);
        setSubjects(list);
        const init: Record<string, string> = {};
        list.forEach((sub) => {
          init[sub.id] = "";
        });
        setNotes(init);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

  const handleChange = (id: string, value: string) => {
    if (value === "" || (parseFloat(value) >= 0 && parseFloat(value) <= 20)) {
      setNotes((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = () => {
    const missing = subjects.filter(
      (s) => notes[s.id] === "" || notes[s.id] === undefined,
    );
    if (missing.length > 0) {
      setError("Veuillez saisir une note pour chaque matière.");
      return;
    }
    const notesPayload = subjects.map((s) => ({
      subjectId: s.id,
      value: parseFloat(notes[s.id]),
      subjectName: s.name,
      coefficient:
        s.seriesCoefficients?.find((sc) => sc.serieId === serie?.id)
          ?.coefficient ??
        s.coefficient ??
        1,
    }));
    sessionStorage.setItem("notesPayload", JSON.stringify(notesPayload));
    router.push("/recommendation");
  };

  if (loading)
    return (
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <button
        onClick={() => router.push("/dashboard")}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Changer de série
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Saisie des notes</h1>
        <p className="text-muted-foreground mt-1">
          Série <strong>{serie?.code}</strong> — {serie?.description}
        </p>
      </div>

      <div className="space-y-3">
        {subjects.map((subject) => {
          const coeff =
            subject.seriesCoefficients?.find((sc) => sc.serieId === serie?.id)
              ?.coefficient ??
            subject.coefficient ??
            1;
          return (
            <Card key={subject.id} className="border">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{subject.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      coef. {coeff}
                    </Badge>
                  </div>
                </div>
                <Input
                  type="number"
                  min={0}
                  max={20}
                  step={0.5}
                  placeholder="0 – 20"
                  value={notes[subject.id] ?? ""}
                  onChange={(e) => handleChange(subject.id, e.target.value)}
                  className="w-24 text-center"
                />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-500 flex items-center gap-1.5">
          <AlertCircle className="h-4 w-4" /> {error}
        </p>
      )}

      <Button onClick={handleSubmit} className="mt-6 w-full" size="lg">
        Obtenir ma recommandation
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
