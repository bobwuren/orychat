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
  GraduationCap,
  Download,
  Filter,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Clock,
  BookOpen,
  RefreshCw,
  AlertCircle,
  MoreVertical,
  Calendar,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDegrees } from "@/lib/hooks/";
import { Degree } from "@/lib/types/universities.types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";


export default function DegreesAdminPage() {
  const {
    degrees = [],
    isLoading,
    error,
    fetchDegrees,
    deleteDegree,
    exportDegrees,
  } = useDegrees();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter] = useState<string>("all");
  const [selectedDegree, setSelectedDegree] = useState<Degree | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv");
  const [isExporting, setIsExporting] = useState(false);
  const [limit] = useState(10);

  useEffect(() => {
    fetchDegrees({
      page: currentPage,
      limit,
      search: searchTerm || undefined,
    });
  }, [currentPage, searchTerm, fetchDegrees]);


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchDegrees({
      page: 1,
      limit,
      search: searchTerm || undefined,
    });
  };

  const handleDelete = async (degreeId: string) => {
    try {
      await deleteDegree(degreeId);
      setIsDeleteDialogOpen(false);
      setSelectedDegree(null);
    } catch (err) {
      console.error("Error deleting degree:", err);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportDegrees({ format: exportFormat });
      setIsExportDialogOpen(false);
    } catch (err) {
      console.error("Error exporting degrees:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleRefresh = () => {
    fetchDegrees({
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
          <h1 className="text-3xl font-bold tracking-tight">Diplômes</h1>
          <p className="text-muted-foreground">
            Gérez tous les diplômes et leurs informations
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
            Nouveau Diplôme
          </Button>
        </div>
      </div>

      {/* Filtres et tableau */}
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <CardTitle>Liste des Diplômes</CardTitle>
              <CardDescription>
                Gérez tous les diplômes et leurs informations
              </CardDescription>
            </div>
            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-2 md:space-y-0">
              <form onSubmit={handleSearch} className="flex space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un diplôme..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-full md:w-64"
                  />
                </div>
                <Button type="submit" size="icon" variant="outline">
                  <Filter className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Tableau */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Skeleton loader
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-48" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-8 w-20 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : !degrees || degrees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center space-y-2">
                        <GraduationCap className="h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          Aucun diplôme trouvé
                        </p>
                        <Button variant="outline" size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Ajouter un diplôme
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  degrees
                    .filter(
                      (degree) =>
                        levelFilter === "all" || degree?.level === levelFilter,
                    )
                    .map((degree) => (
                      <TableRow key={degree?.id || Math.random()}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                            <span>{degree?.name || "Nom inconnu"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {degree?.duration ? (
                            <div className="flex items-center">
                              <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                              <span>{degree.duration}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="max-w-[250px] truncate cursor-help">
                                  {degree?.description || "Aucune description"}
                                </div>
                              </TooltipTrigger>
                              {degree?.description && (
                                <TooltipContent>
                                  <p className="max-w-xs">
                                    {degree.description}
                                  </p>
                                </TooltipContent>
                              )}
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center text-sm text-muted-foreground cursor-help">
                                  <Calendar className="mr-1 h-3 w-3" />
                                  {degree?.createdAt
                                    ? formatDistanceToNow(
                                        new Date(degree.createdAt),
                                        {
                                          addSuffix: true,
                                          locale: fr,
                                        },
                                      )
                                    : "N/A"}
                                </div>
                              </TooltipTrigger>
                              {degree?.createdAt && (
                                <TooltipContent>
                                  {new Date(
                                    degree.createdAt,
                                  ).toLocaleDateString("fr-FR", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </TooltipContent>
                              )}
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
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Voir les détails
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <BookOpen className="mr-2 h-4 w-4" />
                                Voir les universités
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  setSelectedDegree(degree);
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
          {!isLoading && degrees && degrees.length > 0 && (
            <div className="flex items-center justify-between py-4">
              <div className="text-sm text-muted-foreground">
                Affichage de <strong>{(currentPage - 1) * limit + 1}</strong> à{" "}
                <strong>{Math.min(currentPage * limit, degrees.length)}</strong>{" "}
                sur <strong>{degrees.length}</strong> diplômes
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
              Êtes-vous sûr de vouloir supprimer le diplôme{" "}
              <strong>{selectedDegree?.name || "ce diplôme"}</strong> ? Cette
              action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-lg bg-muted p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Nom</p>
                  <p className="font-medium text-lg">
                    {selectedDegree?.name || "Inconnu"}
                  </p>
                </div>
                {selectedDegree?.description && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="font-medium">{selectedDegree.description}</p>
                  </div>
                )}
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
              onClick={() => selectedDegree && handleDelete(selectedDegree.id)}
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
            <DialogTitle>Exporter les diplômes</DialogTitle>
            <DialogDescription>
              Sélectionnez le format d&apos;export souhaité.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Format d&apos;export
              </label>
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
                L&apos;export inclura tous les diplômes avec leurs informations.
                Le fichier sera téléchargé automatiquement après l&apos;export.
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
