"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Download,
  Search,
  Eye,
  RefreshCw,
  AlertCircle,
  MoreVertical,
  X,
  BookOpen,
  GraduationCap,
  User,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useRecommendations } from "@/lib/hooks";
import type { Recommendation, Orientation } from "@/lib/types";

// ─── Constantes ───────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 10;
type DialogMode = "view" | "export" | null;

// ─── Page principale ──────────────────────────────────────────────────────────

export default function RecommendationsAdminPage() {
  const {
    recommendations,
    currentRecommendation,
    isLoading,
    error,
    fetchAllRecommendations,
    fetchRecommendationById,
    exportRecommendations,
  } = useRecommendations();

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedReco, setSelectedReco] = useState<Recommendation | null>(null);
  const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv");
  const [isExporting, setIsExporting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

  const load = useCallback(() => {
    fetchAllRecommendations();
  }, [fetchAllRecommendations]);
  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filtered = (recommendations ?? []).filter(
    (r) =>
      !searchTerm ||
      r.userId?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.serieCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id?.toString().toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const closeDialog = () => {
    setDialogMode(null);
    setSelectedReco(null);
    setActionError(null);
  };

  const openView = async (r: Recommendation) => {
    setActionError(null);
    setSelectedReco(r);
    setDialogMode("view");
    setViewLoading(true);
    try {
      // getById retourne l'objet direct, le hook stocke dans currentRecommendation
      await fetchRecommendationById(r.id);
    } catch {
      // si erreur on affiche quand même avec selectedReco
    } finally {
      setViewLoading(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    setActionError(null);
    try {
      await exportRecommendations({ format: exportFormat });
      closeDialog();
    } catch (err: any) {
      setActionError(err?.message ?? "Erreur export.");
    } finally {
      setIsExporting(false);
    }
  };

  const activeReco =
    currentRecommendation?.id === selectedReco?.id
      ? (currentRecommendation ?? selectedReco)
      : selectedReco;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <div className="text-center">
          <h3 className="text-lg font-semibold">Erreur de chargement</h3>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
        <Button onClick={load}>
          <RefreshCw className="mr-2 h-4 w-4" /> Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recommandations</h1>
          <p className="text-muted-foreground">
            {filtered.length} recommandation{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={load} disabled={isLoading}>
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />{" "}
            Actualiser
          </Button>
          <Button variant="outline" onClick={() => setDialogMode("export")}>
            <Download className="mr-2 h-4 w-4" /> Exporter
          </Button>
        </div>
      </div>

      {/* Tableau */}
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <CardTitle>Liste des recommandations</CardTitle>
              <CardDescription>
                Consultation des recommandations générées par l'IA.
              </CardDescription>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSearchTerm(searchInput);
              }}
              className="flex space-x-2"
            >
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="ID, userId, série…"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-8 w-60"
                />
                {searchInput && (
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      setSearchInput("");
                      setSearchTerm("");
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
              <Button type="submit" variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Série</TableHead>
                  <TableHead>Orientations</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 6 }).map((__, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center space-y-3">
                        <BookOpen className="h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          {searchTerm
                            ? "Aucun résultat."
                            : "Aucune recommandation."}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((reco) => (
                    <TableRow key={reco.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        #{String(reco.id).slice(0, 8)}…
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="font-mono text-xs">
                            {String(reco.userId).slice(0, 10)}…
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {reco.serieCode ? (
                          <Badge variant="secondary" className="font-mono">
                            {reco.serieCode}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            —
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="outline" className="cursor-help">
                                <GraduationCap className="h-3 w-3 mr-1" />
                                {reco.orientations?.length ?? 0} orientation
                                {(reco.orientations?.length ?? 0) > 1
                                  ? "s"
                                  : ""}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="space-y-1 max-w-xs">
                                {reco.orientations
                                  ?.slice(0, 5)
                                  .map((o: Orientation, i: number) => (
                                    <p key={i} className="text-sm">
                                      {o.name}
                                    </p>
                                  ))}
                                {(reco.orientations?.length ?? 0) > 5 && (
                                  <p className="text-xs text-muted-foreground">
                                    +{reco.orientations.length - 5} autres…
                                  </p>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {reco.createdAt
                            ? formatDistanceToNow(new Date(reco.createdAt), {
                                addSuffix: true,
                                locale: fr,
                              })
                            : "—"}
                        </span>
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
                            <DropdownMenuItem onClick={() => openView(reco)}>
                              <Eye className="mr-2 h-4 w-4" /> Voir les détails
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

          {!isLoading && filtered.length > ITEMS_PER_PAGE && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-muted-foreground">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} sur{" "}
                {filtered.length}
              </p>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage((p) => p - 1);
                      }}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
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
                    ),
                  )}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages)
                          setCurrentPage((p) => p + 1);
                      }}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Dialog Vue ── */}
      <Dialog
        open={dialogMode === "view"}
        onOpenChange={(o) => !o && closeDialog()}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de la recommandation</DialogTitle>
          </DialogHeader>
          {viewLoading ? (
            <div className="space-y-3 py-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-5 py-2">
              {/* Infos générales */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">ID</p>
                  <p className="font-mono text-sm">{activeReco?.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Utilisateur</p>
                  <p className="font-mono text-sm">{activeReco?.userId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Série</p>
                  {activeReco?.serieCode ? (
                    <Badge variant="secondary" className="font-mono mt-1">
                      {activeReco.serieCode}
                    </Badge>
                  ) : (
                    <p className="text-sm font-mono">{activeReco?.serieId}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Créé le</p>
                  <p className="text-sm">
                    {activeReco?.createdAt
                      ? new Date(activeReco.createdAt).toLocaleDateString(
                          "fr-FR",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )
                      : "—"}
                  </p>
                </div>
              </div>

              {/* Notes associées */}
              {(activeReco?.noteIds?.length ?? 0) > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Notes associées
                  </p>
                  <p className="text-sm">
                    {activeReco?.noteIds?.length} note(s)
                  </p>
                </div>
              )}

              {/* Orientations */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Orientations recommandées (
                  {activeReco?.orientations?.length ?? 0})
                </p>
                {(activeReco?.orientations?.length ?? 0) === 0 ? (
                  <p className="text-sm italic text-muted-foreground">
                    Aucune orientation.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {activeReco?.orientations?.map(
                      (o: Orientation, i: number) => (
                        <div
                          key={i}
                          className="border rounded-lg p-4 space-y-3"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold">{o.name}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {o.why}
                              </p>
                            </div>
                          </div>
                          {o.degrees?.length > 0 && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">
                                Diplômes suggérés
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {o.degrees.map((d, j) => (
                                  <Badge
                                    key={j}
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
                                        <X className="h-2 w-2 rotate-45" />
                                      </a>
                                    ) : (
                                      d.name
                                    )}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {o.universities?.length > 0 && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">
                                Universités suggérées
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {o.universities.map((u, j) => (
                                  <Badge
                                    key={j}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {u.site || u.website ? (
                                      <a
                                        href={u.site ?? u.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:underline"
                                      >
                                        {u.name}
                                      </a>
                                    ) : (
                                      u.name
                                    )}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog Export ── */}
      <Dialog
        open={dialogMode === "export"}
        onOpenChange={(o) => !o && closeDialog()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exporter les recommandations</DialogTitle>
            <DialogDescription>
              Choisissez le format d'export.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Format</Label>
              <Select
                value={exportFormat}
                onValueChange={(v: "csv" | "json") => setExportFormat(v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV (Excel)</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
              Toutes les recommandations ({filtered.length}) seront incluses
              avec leurs orientations.
            </div>
          </div>
          {actionError && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" /> {actionError}
            </p>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeDialog}
              disabled={isExporting}
            >
              Annuler
            </Button>
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Export…
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" /> Exporter
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
