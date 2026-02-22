"use client";

import { useState, useEffect, useCallback, SetStateAction } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Badge } from "@/components/ui/badge";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  GraduationCap,
  Download,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Clock,
  RefreshCw,
  AlertCircle,
  MoreVertical,
  Calendar,
  X,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useDegrees } from "@/lib/hooks";
import type {
  Degree,
  CreateDegreeRequest,
  UpdateDegreeRequest,
} from "@/lib/types";

// ─── Types locaux ────────────────────────────────────────────────────────────

type DialogMode = "create" | "edit" | "view" | "delete" | "export" | null;

const ITEMS_PER_PAGE = 10;

// ─── Formulaire diplôme ──────────────────────────────────────────────────────

interface DegreeFormProps {
  initial?: Partial<Degree>;
  onSubmit: (data: CreateDegreeRequest | UpdateDegreeRequest) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  mode: "create" | "edit";
}

function DegreeForm({
  initial,
  onSubmit,
  onCancel,
  isLoading,
  mode,
}: DegreeFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [level, setLevel] = useState(initial?.level ?? "");
  const [duration, setDuration] = useState(initial?.duration ?? "");
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!name.trim()) {
      setFormError("Le nom est obligatoire.");
      return;
    }
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
        level: level.trim() || undefined,
        duration: duration.trim() || undefined,
      });
    } catch (err: any) {
      setFormError(err?.message ?? "Une erreur est survenue.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">
          Nom <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ex: Licence Informatique"
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="level">Niveau</Label>
        <Input
          id="level"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          placeholder="ex: Licence, Master, BTS…"
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="duration">Durée</Label>
        <Input
          id="duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="ex: 3 ans"
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e: { target: { value: SetStateAction<string>; }; }) => setDescription(e.target.value)}
          placeholder="Description optionnelle"
          disabled={isLoading}
          rows={3}
        />
      </div>
      {formError && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="h-4 w-4" /> {formError}
        </p>
      )}
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />{" "}
              Enregistrement…
            </>
          ) : mode === "create" ? (
            <>
              <Plus className="mr-2 h-4 w-4" /> Créer
            </>
          ) : (
            <>
              <Edit className="mr-2 h-4 w-4" /> Mettre à jour
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}

// ─── Page principale ─────────────────────────────────────────────────────────

export default function DegreesAdminPage() {
  const {
    degrees,
    currentDegree,
    isLoading,
    error,
    fetchDegrees,
    fetchDegreeById,
    createDegree,
    updateDegree,
    deleteDegree,
    exportDegrees,
  } = useDegrees();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedDegree, setSelectedDegree] = useState<Degree | null>(null);
  const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv");
  const [isExporting, setIsExporting] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Pagination côté client (le backend retourne tout d'un coup)
  const filtered = (degrees ?? []).filter(
    (d) =>
      !searchTerm || d.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const load = useCallback(() => {
    fetchDegrees();
  }, [fetchDegrees]);

  useEffect(() => {
    load();
  }, [load]);

  // Réinitialise la page si le filtre change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const closeDialog = () => {
    setDialogMode(null);
    setSelectedDegree(null);
    setActionError(null);
  };

  const openCreate = () => {
    setSelectedDegree(null);
    setActionError(null);
    setDialogMode("create");
  };

  const openEdit = async (degree: Degree) => {
    setActionError(null);
    setSelectedDegree(degree);
    setDialogMode("edit");
    // Rechargement frais depuis l'API
    await fetchDegreeById(degree.id);
  };

  const openView = async (degree: Degree) => {
    setActionError(null);
    setSelectedDegree(degree);
    setDialogMode("view");
    await fetchDegreeById(degree.id);
  };

  const openDelete = (degree: Degree) => {
    setActionError(null);
    setSelectedDegree(degree);
    setDialogMode("delete");
  };

  // ── Actions ──

  const handleCreate = async (
    data: CreateDegreeRequest | UpdateDegreeRequest,
  ) => {
    setActionLoading(true);
    setActionError(null);
    try {
      await createDegree(data as CreateDegreeRequest);
      closeDialog();
    } catch (err: any) {
      setActionError(err?.message ?? "Erreur lors de la création.");
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (
    data: CreateDegreeRequest | UpdateDegreeRequest,
  ) => {
    if (!selectedDegree) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await updateDegree(selectedDegree.id, data as UpdateDegreeRequest);
      closeDialog();
    } catch (err: any) {
      setActionError(err?.message ?? "Erreur lors de la mise à jour.");
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedDegree) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await deleteDegree(selectedDegree.id);
      closeDialog();
    } catch (err: any) {
      setActionError(err?.message ?? "Erreur lors de la suppression.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    setActionError(null);
    try {
      await exportDegrees({ format: exportFormat });
      closeDialog();
    } catch (err: any) {
      setActionError(err?.message ?? "Erreur lors de l'export.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchInput);
  };

  // ── Erreur globale ──

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

  // ── Rendu ──

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Diplômes</h1>
          <p className="text-muted-foreground">
            {filtered.length} diplôme{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={load} disabled={isLoading}>
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Actualiser
          </Button>
          <Button variant="outline" onClick={() => setDialogMode("export")}>
            <Download className="mr-2 h-4 w-4" /> Exporter
          </Button>
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" /> Nouveau diplôme
          </Button>
        </div>
      </div>

      {/* Tableau */}
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <CardTitle>Liste des diplômes</CardTitle>
              <CardDescription>
                Créez, modifiez ou supprimez des diplômes.
              </CardDescription>
            </div>
            <form onSubmit={handleSearch} className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher…"
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
                  <TableHead>Nom</TableHead>
                  <TableHead>Niveau</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Créé</TableHead>
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
                        <GraduationCap className="h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          {searchTerm
                            ? "Aucun résultat pour cette recherche."
                            : "Aucun diplôme."}
                        </p>
                        {!searchTerm && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={openCreate}
                          >
                            <Plus className="mr-2 h-4 w-4" /> Créer le premier
                            diplôme
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((degree) => (
                    <TableRow key={degree.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <GraduationCap className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span>{degree.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {degree.level ? (
                          <Badge variant="secondary">{degree.level}</Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {degree.duration ? (
                          <div className="flex items-center text-sm">
                            <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                            {degree.duration}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="max-w-[200px] truncate cursor-help text-sm text-muted-foreground">
                                {degree.description ?? "—"}
                              </div>
                            </TooltipTrigger>
                            {degree.description && (
                              <TooltipContent>
                                <p className="max-w-xs">{degree.description}</p>
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
                                {degree.createdAt
                                  ? formatDistanceToNow(
                                      new Date(degree.createdAt),
                                      { addSuffix: true, locale: fr },
                                    )
                                  : "—"}
                              </div>
                            </TooltipTrigger>
                            {degree.createdAt && (
                              <TooltipContent>
                                {new Date(degree.createdAt).toLocaleDateString(
                                  "fr-FR",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
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
                            <DropdownMenuItem onClick={() => openView(degree)}>
                              <Eye className="mr-2 h-4 w-4" /> Voir les détails
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEdit(degree)}>
                              <Edit className="mr-2 h-4 w-4" /> Modifier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => openDelete(degree)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Supprimer
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

      {/* ── Dialog Création ── */}
      <Dialog
        open={dialogMode === "create"}
        onOpenChange={(o) => !o && closeDialog()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouveau diplôme</DialogTitle>
            <DialogDescription>
              Remplissez les informations du nouveau diplôme.
            </DialogDescription>
          </DialogHeader>
          <DegreeForm
            mode="create"
            onSubmit={handleCreate}
            onCancel={closeDialog}
            isLoading={actionLoading}
          />
          {actionError && (
            <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" /> {actionError}
            </p>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Dialog Édition ── */}
      <Dialog
        open={dialogMode === "edit"}
        onOpenChange={(o) => !o && closeDialog()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le diplôme</DialogTitle>
            <DialogDescription>
              Modifiez les informations du diplôme.
            </DialogDescription>
          </DialogHeader>
          {/* On utilise currentDegree (rechargé) s'il correspond, sinon selectedDegree */}
          <DegreeForm
            key={selectedDegree?.id}
            mode="edit"
            initial={
              currentDegree?.id === selectedDegree?.id
                ? (currentDegree ?? selectedDegree ?? undefined)
                : (selectedDegree ?? undefined)
            }
            onSubmit={handleUpdate}
            onCancel={closeDialog}
            isLoading={actionLoading}
          />
          {actionError && (
            <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" /> {actionError}
            </p>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Dialog Vue ── */}
      <Dialog
        open={dialogMode === "view"}
        onOpenChange={(o) => !o && closeDialog()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails du diplôme</DialogTitle>
          </DialogHeader>
          {isLoading ? (
            <div className="space-y-3 py-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-4 py-2">
              {[
                {
                  label: "Nom",
                  value: (currentDegree ?? selectedDegree)?.name,
                },
                {
                  label: "Niveau",
                  value: (currentDegree ?? selectedDegree)?.level,
                },
                {
                  label: "Durée",
                  value: (currentDegree ?? selectedDegree)?.duration,
                },
                {
                  label: "Description",
                  value: (currentDegree ?? selectedDegree)?.description,
                },
                {
                  label: "Créé le",
                  value: (currentDegree ?? selectedDegree)?.createdAt
                    ? new Date(
                        (currentDegree ?? selectedDegree)!.createdAt!,
                      ).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : undefined,
                },
                {
                  label: "Mis à jour le",
                  value: (currentDegree ?? selectedDegree)?.updatedAt
                    ? new Date(
                        (currentDegree ?? selectedDegree)!.updatedAt!,
                      ).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : undefined,
                },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="font-medium">
                    {value ?? (
                      <span className="text-muted-foreground italic">—</span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Fermer
            </Button>
            <Button onClick={() => selectedDegree && openEdit(selectedDegree)}>
              <Edit className="mr-2 h-4 w-4" /> Modifier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog Suppression ── */}
      <Dialog
        open={dialogMode === "delete"}
        onOpenChange={(o) => !o && closeDialog()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Cette action est <strong>irréversible</strong>. Le diplôme sera
              définitivement supprimé.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-muted p-4 my-2">
            <p className="text-sm text-muted-foreground">Diplôme concerné</p>
            <p className="font-semibold text-lg">{selectedDegree?.name}</p>
            {selectedDegree?.level && (
              <Badge variant="secondary" className="mt-1">
                {selectedDegree.level}
              </Badge>
            )}
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
              disabled={actionLoading}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Suppression…
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" /> Supprimer définitivement
                </>
              )}
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
            <DialogTitle>Exporter les diplômes</DialogTitle>
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
              Tous les diplômes ({filtered.length}) seront inclus. Le fichier
              sera téléchargé automatiquement.
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
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Export en
                  cours…
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
