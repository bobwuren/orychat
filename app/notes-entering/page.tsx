"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import ModernNavigation from "@/components/navigation/ModernNavigation";
import {
  GraduationCap,
  Edit3,
  ArrowLeft,
  AlertCircle,
  Calculator,
  Brain,
  FlaskConical,
  Globe,
  BookOpen,
  Target,
  TrendingUp,
  PieChart,
  BarChart3,
  CheckCircle2,
  Sparkles,
  FileText,
} from "lucide-react";
import { getAllSeries } from "@/lib/services/serieService";
import { Serie } from "@/types/serie";
import UserMenu from "@/components/custom-comps/UserMenu";
import useRouteProtection from "@/hooks/useRouteProtection";

// Couleur selon la note (même logique que summary)
function getScoreBackground(note: number) {
  if (note >= 16) return "bg-emerald-100 text-emerald-800 border-emerald-200"; // Excellent
  if (note >= 14) return "bg-green-100 text-green-700 border-green-200"; // Bien
  if (note >= 12) return "bg-yellow-100 text-yellow-800 border-yellow-200"; // Moyen
  if (note >= 10) return "bg-orange-100 text-orange-800 border-orange-200"; // Passable
  if (note > 0) return "bg-red-100 text-red-700 border-red-200"; // Faible
  return "bg-muted text-muted-foreground border-border"; // Non saisi
}

export default function NotesEnteringPage() {
  const router = useRouter();
  const [series, setSeries] = useState<Serie[]>([]);
  const [selectedSerie, setSelectedSerie] = useState<string>("");
  const [notes, setNotes] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [errorKey, setErrorKey] = useState(0);
  const [loading, setLoading] = useState(true);

  // Protection de route : nécessite d'être connecté et d'avoir sélectionné une série
  useRouteProtection({
    requireAuth: true,
    requireSerieSelection: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      const serieId = localStorage.getItem("selectedSerieId") || "";
      setSelectedSerie(serieId);

      if (!serieId) {
        router.push("/dashboard");
        return;
      }

      try {
        // Gestion du cache avec expiration (24h)
        const cacheKey = "series";
        const cacheTimeKey = "series_cache_time";
        const now = Date.now();
        const cacheDuration = 24 * 60 * 60 * 1000; // 24h en ms
        const cachedSeries = localStorage.getItem(cacheKey);
        const cachedTime = localStorage.getItem(cacheTimeKey);
        if (
          cachedSeries &&
          cachedTime &&
          now - parseInt(cachedTime, 10) < cacheDuration
        ) {
          setSeries(JSON.parse(cachedSeries));
        } else {
          const data = await getAllSeries();
          setSeries(data);
          localStorage.setItem(cacheKey, JSON.stringify(data));
          localStorage.setItem(cacheTimeKey, now.toString());
        }

        // Charger les notes du localStorage si elles existent
        const notesStr = localStorage.getItem("notes");
        if (notesStr) {
          try {
            const parsedNotes = JSON.parse(notesStr);
            setNotes(parsedNotes);
          } catch {
            // Si les notes sont corrompues, les réinitialiser
            localStorage.removeItem("notes");
            setNotes({});
          }
        }
      } catch (err) {
        console.error("Erreur lors du chargement des séries:", err);
        setError("Impossible de charger les séries. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const selectedSerieData = series.find((s) => s.id === selectedSerie);
  const subjects = selectedSerieData?.subjects || [];

  const filledSubjectsCount = subjects.filter((s) => notes[s.id] > 0).length;
  const progress =
    subjects.length > 0 ? (filledSubjectsCount / subjects.length) * 100 : 0;

  const handleNoteChange = (subjectId: string, value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0 || numValue > 20) return;
    const newNotes = {
      ...notes,
      [subjectId]: numValue,
    };
    setNotes(newNotes);
    localStorage.setItem("notes", JSON.stringify(newNotes));
  };

  const handleBackToSeries = () => {
    localStorage.removeItem("selectedSerieId");
    localStorage.removeItem("notes");
    router.push("/dashboard");
  };

  const handleNext = () => {
    if (
      subjects.length > 0 &&
      subjects.every((subject) => notes[subject.id] > 0)
    ) {
      setError(null);
      router.push("/summary");
    } else {
      setError(
        "Veuillez saisir une note pour chaque matière avant de continuer."
      );
      setErrorKey((prev) => prev + 1);
    }
  };

  // Fonction utilitaire pour choisir l'icône d'une matière selon son nom
  function getSubjectIcon(name: string) {
    const key = (name || "").toLowerCase();
    if (key.includes("math")) return Calculator;
    if (key.includes("philo")) return Brain;
    if (key.includes("phys") || key.includes("chimie")) return FlaskConical;
    if (key.includes("angl")) return Globe;
    if (key.includes("fran")) return BookOpen;
    if (key.includes("hist") || key.includes("geo")) return Target;
    if (key.includes("svt") || key.includes("vie") || key.includes("terre"))
      return Brain;
    if (key.includes("gestion")) return TrendingUp;
    if (key.includes("compta")) return PieChart;
    if (key.includes("market")) return Target;
    if (key.includes("info")) return BarChart3;
    return BookOpen;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="mx-auto bg-gradient-to-br from-primary to-primary/80 p-4 rounded-3xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shadow-2xl">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-primary-foreground"></div>
          </div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">Chargement en cours</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Préparation de votre espace de saisie...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6 mb-6 lg:mb-8">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="h-10 w-10 sm:h-14 sm:w-14 lg:h-16 lg:w-16 bg-gradient-to-br from-primary to-primary/80 rounded-3xl flex items-center justify-center shadow-2xl group hover:shadow-primary/25 transition-all duration-300">
              <Edit3 className="h-5 w-5 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-primary-foreground" />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl lg:text-4xl xl:text-5xl font-black text-primary tracking-tight">
                Saisie des notes
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 lg:gap-3 w-full lg:w-auto">
            <Button
              variant="outline"
              onClick={handleBackToSeries}
              className="shadow-lg hover:shadow-xl transition-all px-3 py-2 sm:px-4 sm:py-2 lg:px-6 lg:py-3 text-xs sm:text-sm lg:text-base rounded-xl border-2 hover:border-primary/30"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 sm:mr-2" />
              Séries
            </Button>
            <div className="flex-1 lg:flex-none">
              <ModernNavigation variant="compact" className="flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <Card className="mb-6 lg:mb-8 border-0 shadow-2xl bg-card/60 backdrop-blur-md overflow-hidden group hover:shadow-3xl transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/15 via-primary/8 to-secondary/15 group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-500" />
          <CardContent className="relative p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 lg:gap-6 mb-4 lg:mb-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-300">
                  <span className="text-sm sm:text-base lg:text-xl xl:text-2xl font-black text-primary-foreground">
                    {selectedSerieData?.code}
                  </span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-foreground">
                    {selectedSerieData?.description}
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">
                    {filledSubjectsCount}/{subjects.length} matière{subjects.length > 1 ? "s" : ""} complétée{subjects.length > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-black text-primary">
                  {Math.round(progress)}%
                </p>
                <p className="text-xs sm:text-sm lg:text-base text-muted-foreground font-medium">Progression</p>
              </div>
            </div>
            <Progress value={progress} className="h-2 sm:h-3 lg:h-4 bg-muted/50 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out rounded-full" style={{width: `${progress}%`}} />
            </Progress>
              <p className="text-xs sm:text-sm lg:text-base xl:text-lg text-muted-foreground font-medium mt-2">
                Veuillez saisir vos notes pour chaque matière
              </p>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <div
            key={errorKey}
            className="fixed bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm sm:max-w-md lg:max-w-lg px-4 pointer-events-none"
          >
            <Alert className="border-destructive/30 bg-destructive/95 text-destructive-foreground shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-4 fade-in-0 rounded-2xl">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              <AlertDescription className="font-bold text-center text-sm sm:text-base">
                {error}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Subjects Grid */}
        <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-6 lg:mb-8">
          {subjects.map((subject, index) => {
            const Icon = getSubjectIcon(subject.name);
            const hasNote = notes[subject.id] > 0;
            const noteValue = notes[subject.id] || "";

            return (
            <Card
              key={index}
              className={`group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-card/60 backdrop-blur-md overflow-hidden hover:scale-[1.02] active:scale-95 ${
                hasNote ? "ring-2 ring-primary/30 shadow-primary/20 bg-card/80" : ""
              } min-h-[140px] sm:min-h-[160px] lg:min-h-[180px]`}
            >
                <div
                  className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-300 ${
                    hasNote
                      ? "from-primary/15 via-primary/8 to-secondary/15 opacity-100"
                      : "from-muted/8 via-transparent to-muted/8 opacity-0 group-hover:opacity-100"
                  }`}
                />

                <CardHeader className="relative pb-2 sm:pb-3 lg:pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div
                        className={`h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                          hasNote
                            ? "bg-primary/25 shadow-xl scale-105"
                            : "bg-muted/30 group-hover:bg-primary/15 group-hover:scale-105"
                        }`}
                      >
                        <Icon
                          className={`h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 transition-colors ${
                            hasNote
                              ? "text-primary"
                              : "text-muted-foreground group-hover:text-primary"
                          }`}
                        />
                      </div>
                      <div className="space-y-1">
                        <CardTitle className="text-sm sm:text-base lg:text-lg text-foreground font-bold leading-tight">
                          {subject.name}
                        </CardTitle>
                        <Badge variant="secondary" className="shadow-sm text-xs sm:text-sm px-2 py-0.5 bg-secondary/80 font-semibold">
                          Coeff. {subject.coefficient}
                        </Badge>
                      </div>
                    </div>
                    {hasNote && (
                      <div className="flex items-center gap-1 sm:gap-2">
                        <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />
                        <div
                          className={`text-xs sm:text-sm lg:text-base font-bold px-2 sm:px-3 py-1 rounded-xl border-2 shadow-sm ${getScoreBackground(
                            notes[subject.id]
                          )}`}
                        >
                          {notes[subject.id].toFixed(1)}/20
                        </div>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="relative">
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="Note sur 20"
                      className="h-10 sm:h-12 lg:h-14 text-sm sm:text-base lg:text-lg pr-8 sm:pr-10 lg:pr-12 transition-all focus:ring-2 focus:ring-primary/30 bg-background/80 border-border/50 hover:border-primary/50 focus:border-primary rounded-xl shadow-inner"
                      min="0"
                      max="20"
                      step="0.5"
                      value={noteValue}
                      onChange={(e) =>
                        handleNoteChange(subject.id, e.target.value)
                      }
                    />
                    <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-xs sm:text-sm lg:text-base text-muted-foreground font-medium">
                      /20
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <Button
            size="lg"
            className="px-8 py-4 sm:px-12 sm:py-6 lg:px-16 lg:py-8 text-base sm:text-lg lg:text-xl font-black shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-2xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleNext}
            disabled={filledSubjectsCount === 0}
          >
            {filledSubjectsCount === subjects.length ? (
                <>
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2 sm:mr-3" />
                  Suivant
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ml-2 sm:ml-3 rotate-180" />
                </>
            ) : (
              <>
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2 sm:mr-3" />
                Continuer ({filledSubjectsCount}/{subjects.length})
                <Edit3 className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ml-2 sm:ml-3" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
