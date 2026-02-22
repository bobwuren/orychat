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
  BarChart3,
  Download,
  Filter,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  BookOpen,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSeries } from "@/lib/hooks";
import { Serie } from "@/lib/types";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

export default function SeriesAdminPage() {
  const { series, isLoading, error, fetchSeries, deleteSerie, exportSeries } =
    useSeries();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [limit] = useState(10);
  const [selectedSerie, setSelectedSerie] = useState<Serie | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv");
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    fetchSeries({
      page: currentPage,
      limit,
      search: searchTerm || undefined,
    });
  }, [currentPage, searchTerm, fetchSeries]);

  // Calculer les statistiques
  const stats = {
    totalSeries: series.length,
    totalSubjects: series.reduce(
      (acc, serie) => acc + (serie.totalSubjects || 0),
      0
    ),
    averageSubjects:
      series.length > 0
        ? (
            series.reduce((acc, serie) => acc + (serie.totalSubjects || 0), 0) /
            series.length
          ).toFixed(1)
        : "0.0",
    activeSeries: series.filter((s) => s.totalSubjects && s.totalSubjects > 0)
      .length,
  };

  // Préparer les données pour les graphiques
  const chartData = series.map((serie) => ({
    name: serie.code,
    subjects: serie.totalSubjects || 0,
    createdAt: serie.createdAt ? new Date(serie.createdAt).getTime() : 0,
  }));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchSeries({
      page: 1,
      limit,
      search: searchTerm || undefined,
    });
  };

  const handleDelete = async (serieId: string) => {
    try {
      await deleteSerie(serieId);
      setIsDeleteDialogOpen(false);
      setSelectedSerie(null);
    } catch (err) {
      console.error("Error deleting serie:", err);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportSeries({
        format: exportFormat,
        includeSubjects: true,
      });
      setIsExportDialogOpen(false);
    } catch (err) {
      console.error("Error exporting series:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleRefresh = () => {
    fetchSeries({
      page: currentPage,
      limit,
      search: searchTerm || undefined,
    });
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
          <h1 className="text-3xl font-bold tracking-tight">
            Séries Académiques
          </h1>
          <p className="text-muted-foreground">
            Gérez les séries et leurs matières associées
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Actualiser
          </Button>
          <Button onClick={() => setIsExportDialogOpen(true)} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle Série
          </Button>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total des Séries
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSeries}</div>
            <p className="text-xs text-muted-foreground">
              Séries académiques enregistrées
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total des Matières
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubjects}</div>
            <p className="text-xs text-muted-foreground">
              Matières réparties sur toutes les séries
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moyenne</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageSubjects}</div>
            <p className="text-xs text-muted-foreground">
              Matières par série en moyenne
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Séries Actives
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSeries}</div>
            <p className="text-xs text-muted-foreground">
              Séries avec au moins une matière
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Barre de recherche et filtres */}
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <CardTitle>Liste des Séries</CardTitle>
              <CardDescription>
                Gérez toutes les séries académiques
              </CardDescription>
            </div>
            <form
              onSubmit={handleSearch}
              className="flex w-full md:w-auto space-x-2"
            >
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une série..."
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
                  <TableHead>Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Matières</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Skeleton loader
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-10" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-8 w-20 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : series.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center space-y-2">
                        <BookOpen className="h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          Aucune série trouvée
                        </p>
                        <Button variant="outline" size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Créer une série
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  series.map((serie) => (
                    <TableRow key={serie.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="font-mono">
                            {serie.code}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[300px] truncate">
                          {serie.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {serie.totalSubjects || 0} matières
                        </Badge>
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
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Voir les détails
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setSelectedSerie(serie);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
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
          {!isLoading && series.length > 0 && (
            <div className="flex items-center justify-between py-4">
              <div className="text-sm text-muted-foreground">
                Affichage de <strong>{(currentPage - 1) * limit + 1}</strong> à{" "}
                <strong>{Math.min(currentPage * limit, series.length)}</strong>{" "}
                sur <strong>{series.length}</strong> séries
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
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                  {[1, 2, 3].map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(currentPage + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer la série{" "}
              <strong>{selectedSerie?.code}</strong> ? Cette action est
              irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-lg bg-muted p-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">Code</p>
                  <p className="font-medium">{selectedSerie?.code}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Matières</p>
                  <p className="font-medium">
                    {selectedSerie?.totalSubjects || 0}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="font-medium">{selectedSerie?.description}</p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedSerie && handleDelete(selectedSerie.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer définitivement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog d'export */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exporter les séries</DialogTitle>
            <DialogDescription>
              Sélectionnez le format d&apos;export et les options souhaitées.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Format d&apos;export</label>
              <Select
                value={exportFormat}
                onValueChange={(value: "csv" | "json") =>
                  setExportFormat(value)
                }
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
                L&apos;export inclura toutes les séries avec leurs matières
                associées. Le fichier sera téléchargé automatiquement après
                l&apos;export.
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
