"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Brain,
  Download,
  Filter,
  Search,
  Edit,
  Trash2,
  Eye,
  User,
  BookOpen,
  Building,
  GraduationCap,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  MoreVertical,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRecommendations } from "@/lib/hooks/useRecommendations";
import { Recommendation } from "@/lib/types/notes-recommendations.types";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"];

export default function RecommendationsAdminPage() {
  const {
    recommendations,
    isLoading,
    error,
    fetchAllRecommendations,
    exportRecommendations,
  } = useRecommendations();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv");
  const [isExporting, setIsExporting] = useState(false);
  const [limit] = useState(10);

  useEffect(() => {
    fetchAllRecommendations();
  }, [fetchAllRecommendations]);

  // Calculer les statistiques
  const stats = {
    totalRecommendations: recommendations.length,
    totalOrientations: recommendations.reduce((acc, rec) => acc + (rec.orientations?.length || 0), 0),
    averageOrientations: recommendations.length > 0 
      ? (recommendations.reduce((acc, rec) => acc + (rec.orientations?.length || 0), 0) / recommendations.length).toFixed(1)
      : "0.0",
    uniqueSeries: new Set(recommendations.map(rec => rec.serieId)).size,
    uniqueUsers: new Set(recommendations.map(rec => rec.userId)).size,
  };

  // Préparer les données pour les graphiques
  const orientationsDistribution = recommendations.reduce((acc, rec) => {
    const count = rec.orientations?.length || 0;
    acc[count] = (acc[count] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const chartData = Object.entries(orientationsDistribution).map(([key, value]) => ({
    name: `${key} orientation${parseInt(key) > 1 ? 's' : ''}`,
    count: value,
  }));

  const getTopDegrees = () => {
    const degreeCounts: Record<string, number> = {};
    recommendations.forEach(rec => {
      rec.orientations?.forEach(orientation => {
        orientation.degrees?.forEach(degree => {
          degreeCounts[degree.name] = (degreeCounts[degree.name] || 0) + 1;
        });
      });
    });
    return Object.entries(degreeCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
  };

  const topDegreesData = getTopDegrees();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportRecommendations({ format: exportFormat });
      setIsExportDialogOpen(false);
    } catch (err) {
      console.error("Error exporting recommendations:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleRefresh = () => {
    fetchAllRecommendations();
  };

  const getUserInitials = (userId: string) => {
    return userId.substring(0, 2).toUpperCase();
  };

  const getRecommendationSummary = (recommendation: Recommendation) => {
    const orientations = recommendation.orientations?.length || 0;
    const totalDegrees = recommendation.orientations?.reduce(
      (acc, orientation) => acc + (orientation.degrees?.length || 0), 0
    ) || 0;
    const totalUniversities = recommendation.orientations?.reduce(
      (acc, orientation) => acc + (orientation.universities?.length || 0), 0
    ) || 0;

    return `${orientations} orientation(s), ${totalDegrees} diplôme(s), ${totalUniversities} université(s)`;
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <div className="text-center">
          <h3 className="text-lg font-semibold">Erreur de chargement</h3>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
        <Button onClick={handleRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recommandations IA</h1>
          <p className="text-muted-foreground">
            Gérez toutes les recommandations générées par l&apos;IA
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button
            onClick={() => setIsExportDialogOpen(true)}
            variant="outline"
          >
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recommandations</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRecommendations}</div>
            <p className="text-xs text-muted-foreground">
              Recommandations générées
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Uniques</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueUsers}</div>
            <p className="text-xs text-muted-foreground">
              Utilisateurs bénéficiaires
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Séries Uniques</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueSeries}</div>
            <p className="text-xs text-muted-foreground">
              Séries différentes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moyenne</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageOrientations}</div>
            <p className="text-xs text-muted-foreground">
              Orientations par recommandation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Distribution des orientations</CardTitle>
            <CardDescription>Nombre de recommandations par nombre d&apos;orientations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {isLoading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Diplômes les plus recommandés</CardTitle>
            <CardDescription>Top 5 des diplômes suggérés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {isLoading ? (
                <Skeleton className="h-full w-full" />
              ) : topDegreesData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topDegreesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {topDegreesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Aucun diplôme recommandé</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barre de recherche et tableau */}
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <CardTitle>Historique des Recommandations</CardTitle>
              <CardDescription>
                Toutes les recommandations générées par l&apos;IA
              </CardDescription>
            </div>
            <form onSubmit={handleSearch} className="flex w-full md:w-auto space-x-2">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une recommandation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button type="submit" size="icon" variant="outline">
                <Filter className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardHeader>
        <CardContent>
          {/* Tableau */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Série</TableHead>
                  <TableHead>Résumé</TableHead>
                  <TableHead>Généré le</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Skeleton loader
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-10 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-8 w-20 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : recommendations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex flex-col items-center space-y-2">
                        <Brain className="h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground">Aucune recommandation trouvée</p>
                        <p className="text-sm text-muted-foreground">
                          Les recommandations apparaîtront ici après génération
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  recommendations
                    .slice((currentPage - 1) * limit, currentPage * limit)
                    .map((recommendation) => (
                    <TableRow key={recommendation.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {getUserInitials(recommendation.userId)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">Utilisateur #{recommendation.userId.substring(0, 8)}</div>
                            <div className="text-xs text-muted-foreground">
                              ID: {recommendation.userId}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {recommendation.serieCode || recommendation.serieId}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="max-w-[300px] truncate">
                                {getRecommendationSummary(recommendation)}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="space-y-2 max-w-xs">
                                <div className="font-medium">Contenu de la recommandation:</div>
                                {recommendation.orientations?.slice(0, 2).map((orientation, idx) => (
                                  <div key={idx} className="text-sm">
                                    • {orientation.name}: {orientation.degrees?.length || 0} diplôme(s)
                                  </div>
                                ))}
                                {recommendation.orientations && recommendation.orientations.length > 2 && (
                                  <div className="text-xs text-muted-foreground">
                                    + {recommendation.orientations.length - 2} autres orientations
                                  </div>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-sm text-muted-foreground cursor-help">
                                {formatDistanceToNow(new Date(recommendation.createdAt), {
                                  addSuffix: true,
                                  locale: fr,
                                })}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              {new Date(recommendation.createdAt).toLocaleDateString("fr-FR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedRecommendation(recommendation);
                                setIsViewDialogOpen(true);
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Voir les détails
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Sparkles className="mr-2 h-4 w-4" />
                              Régénérer
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {!isLoading && recommendations.length > 0 && (
            <div className="flex items-center justify-between py-4">
              <div className="text-sm text-muted-foreground">
                Affichage de <strong>{(currentPage - 1) * limit + 1}</strong> à{" "}
                <strong>{Math.min(currentPage * limit, recommendations.length)}</strong> sur{" "}
                <strong>{recommendations.length}</strong> recommandations
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  {Array.from({ length: Math.ceil(recommendations.length / limit) })
                    .slice(0, 3)
                    .map((_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(index + 1);
                          }}
                          isActive={currentPage === index + 1}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < Math.ceil(recommendations.length / limit)) {
                          setCurrentPage(currentPage + 1);
                        }
                      }}
                      className={currentPage >= Math.ceil(recommendations.length / limit) ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de visualisation */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de la Recommandation</DialogTitle>
            <DialogDescription>
              Recommandation générée par l&apos;IA pour l&apos;utilisateur
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* En-tête */}
            <div className="rounded-lg bg-muted p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Utilisateur</p>
                  <p className="font-medium">ID: {selectedRecommendation?.userId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Série</p>
                  <p className="font-medium">
                    {selectedRecommendation?.serieCode || selectedRecommendation?.serieId}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Généré le</p>
                  <p className="font-medium">
                    {selectedRecommendation?.createdAt && new Date(selectedRecommendation.createdAt).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nombre d&apos;orientations</p>
                  <p className="font-medium">{selectedRecommendation?.orientations?.length || 0}</p>
                </div>
              </div>
            </div>

            {/* Orientations */}
            {selectedRecommendation?.orientations?.map((orientation, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        <Badge className="mr-2">Orientation {index + 1}</Badge>
                        {orientation.name}
                      </CardTitle>
                      <CardDescription>{orientation.why}</CardDescription>
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      <Sparkles className="mr-1 h-3 w-3" />
                      Générée par IA
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Diplômes recommandés */}
                  {orientation.degrees && orientation.degrees.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <GraduationCap className="mr-2 h-4 w-4" />
                        Diplômes Recommandés ({orientation.degrees.length})
                      </h4>
                      <div className="grid gap-2">
                        {orientation.degrees.map((degree, degreeIndex) => (
                          <div key={degreeIndex} className="flex items-center justify-between p-2 rounded-lg border">
                            <div>
                              <p className="font-medium">{degree.name}</p>
                              {degree.articleLink && (
                                <a 
                                  href={degree.articleLink} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:underline flex items-center"
                                >
                                  En savoir plus
                                  <ExternalLink className="ml-1 h-3 w-3" />
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Universités recommandées */}
                  {orientation.universities && orientation.universities.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Building className="mr-2 h-4 w-4" />
                        Universités Recommandées ({orientation.universities.length})
                      </h4>
                      <div className="grid gap-2">
                        {orientation.universities.map((university, uniIndex) => (
                          <div key={uniIndex} className="flex items-center justify-between p-2 rounded-lg border">
                            <div>
                              <p className="font-medium">{university.name}</p>
                              {(university.website || university.site) && (
                                <a 
                                  href={university.website || university.site} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:underline flex items-center"
                                >
                                  Visiter le site
                                  <ExternalLink className="ml-1 h-3 w-3" />
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Fermer
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Télécharger PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog d'export */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exporter les recommandations</DialogTitle>
            <DialogDescription>
              Sélectionnez le format d&apos;export souhaité.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Format d&apos;export</label>
              <Select
                value={exportFormat}
                onValueChange={(value: "csv" | "json") => setExportFormat(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV (Excel)</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">
                L&apos;export inclura toutes les recommandations avec leurs orientations,
                diplômes et universités associés.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsExportDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Export en cours...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Exporter maintenant
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}