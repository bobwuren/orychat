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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  BookOpen,
  Download,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  AlertCircle,
  MoreVertical,
  X,
  Hash,
} from "lucide-react";
import { useSubjects } from "@/lib/hooks";
import { useSeries } from "@/lib/hooks";
import type { SubjectWithCoefficients } from "@/lib/types";

// ─── Constantes ──────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 10;
type DialogMode = "create" | "edit" | "view" | "delete" | "export" | null;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * seriesCoefficients peut arriver comme objet { [serieId]: coef } (getAll)
 * ou comme tableau [{ serieId, coefficient }] (create/update response).
 * On normalise toujours en tableau.
 */
function normalizeCoefficients(
  raw: any,
): Array<{ serieId: string; coefficient: number; seriesName?: string }> {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  // objet { [serieId]: coefficient }
  return Object.entries(raw).map(([serieId, coefficient]) => ({
    serieId,
    coefficient: coefficient as number,
  }));
}

// ─── Formulaire matière ───────────────────────────────────────────────────────

interface SerieCoeffRow {
  serieId: string;
  coefficient: number;
}

interface SubjectFormProps {
  initial?: Partial<SubjectWithCoefficients>;
  serieOptions: Array<{ id: string; code: string; description: string }>;
  onSubmit: (data: {
    name: string;
    seriesCoefficients: SerieCoeffRow[];
  }) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  mode: "create" | "edit";
}

function SubjectForm({
  initial,
  serieOptions,
  onSubmit,
  onCancel,
  isLoading,
  mode,
}: SubjectFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [rows, setRows] = useState<SerieCoeffRow[]>(() =>
    normalizeCoefficients((initial as any)?.seriesCoefficients).map((sc) => ({
      serieId: sc.serieId,
      coefficient: sc.coefficient,
    })),
  );
  const [formError, setFormError] = useState<string | null>(null);

  const addRow = () =>
    setRows((prev) => [...prev, { serieId: "", coefficient: 1 }]);
  const removeRow = (i: number) =>
    setRows((prev) => prev.filter((_, idx) => idx !== i));
  const updateRow = (
    i: number,
    field: keyof SerieCoeffRow,
    value: string | number,
  ) =>
    setRows((prev) =>
      prev.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)),
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!name.trim()) {
      setFormError("Le nom est obligatoire.");
      return;
    }
    for (const r of rows) {
      if (!r.serieId) {
        setFormError(
          "Chaque ligne de coefficient doit avoir une série sélectionnée.",
        );
        return;
      }
      if (
        typeof r.coefficient !== "number" ||
        isNaN(r.coefficient) ||
        r.coefficient < 0
      ) {
        setFormError("Le coefficient doit être un nombre positif.");
        return;
      }
    }
    try {
      await onSubmit({ name: name.trim(), seriesCoefficients: rows });
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
          placeholder="ex: Mathématiques"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Coefficients par série</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addRow}
            disabled={isLoading}
          >
            <Plus className="h-3 w-3 mr-1" /> Ajouter
          </Button>
        </div>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            Aucun coefficient défini.
          </p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {rows.map((row, i) => (
              <div key={i} className="flex items-center gap-2">
                <Select
                  value={row.serieId}
                  onValueChange={(v) => updateRow(i, "serieId", v)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Série…" />
                  </SelectTrigger>
                  <SelectContent>
                    {serieOptions.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.code} — {s.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  min={0}
                  step={0.5}
                  value={row.coefficient}
                  onChange={(e) =>
                    updateRow(i, "coefficient", parseFloat(e.target.value))
                  }
                  className="w-24"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRow(i)}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        )}
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

// ─── Page principale ──────────────────────────────────────────────────────────

export default function SubjectsAdminPage() {
  const {
    subjects,
    currentSubject,
    isLoading,
    error,
    fetchSubjects,
    fetchSubjectById,
    createSubject,
    updateSubject,
    deleteSubject,
    exportSubjects,
  } = useSubjects();

  // Pour peupler le sélecteur de séries dans le formulaire
  const { series, fetchSeries } = useSeries();

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedSubject, setSelectedSubject] =
    useState<SubjectWithCoefficients | null>(null);
  const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv");
  const [isExporting, setIsExporting] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const filtered = (subjects ?? []).filter(
    (s) =>
      !searchTerm || s.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const load = useCallback(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  useEffect(() => {
    load();
    fetchSeries();
  }, [load, fetchSeries]);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const closeDialog = () => {
    setDialogMode(null);
    setSelectedSubject(null);
    setActionError(null);
  };

  const openCreate = () => {
    setSelectedSubject(null);
    setActionError(null);
    setDialogMode("create");
  };

  const openEdit = async (s: SubjectWithCoefficients) => {
    setActionError(null);
    setSelectedSubject(s);
    setDialogMode("edit");
    await fetchSubjectById(s.id);
  };

  const openView = async (s: SubjectWithCoefficients) => {
    setActionError(null);
    setSelectedSubject(s);
    setDialogMode("view");
    await fetchSubjectById(s.id);
  };

  const openDelete = (s: SubjectWithCoefficients) => {
    setActionError(null);
    setSelectedSubject(s);
    setDialogMode("delete");
  };

  // ── Actions ──

  const handleCreate = async (data: {
    name: string;
    seriesCoefficients: SerieCoeffRow[];
  }) => {
    setActionLoading(true);
    setActionError(null);
    try {
      await createSubject({
        name: data.name,
        seriesCoefficients: data.seriesCoefficients,
      });
      closeDialog();
    } catch (err: any) {
      setActionError(err?.message ?? "Erreur lors de la création.");
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (data: {
    name: string;
    seriesCoefficients: SerieCoeffRow[];
  }) => {
    if (!selectedSubject) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await updateSubject(selectedSubject.id, {
        name: data.name,
        seriesCoefficients: data.seriesCoefficients,
      });
      closeDialog();
    } catch (err: any) {
      setActionError(err?.message ?? "Erreur lors de la mise à jour.");
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedSubject) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await deleteSubject(selectedSubject.id);
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
      await exportSubjects({ format: exportFormat });
      closeDialog();
    } catch (err: any) {
      setActionError(err?.message ?? "Erreur lors de l'export.");
    } finally {
      setIsExporting(false);
    }
  };

  const serieOptions = (series ?? []).map((s) => ({
    id: String(s.id),
    code: s.code,
    description: s.description,
  }));

  // Résoudre le nom de série à partir de l'ID
  const resolveSerieLabel = (serieId: string) => {
    const s = series?.find((s) => String(s.id) === String(serieId));
    return s ? `${s.code}` : serieId;
  };

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
          <h1 className="text-3xl font-bold tracking-tight">Matières</h1>
          <p className="text-muted-foreground">
            {filtered.length} matière{filtered.length !== 1 ? "s" : ""}
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
            <Plus className="mr-2 h-4 w-4" /> Nouvelle matière
          </Button>
        </div>
      </div>

      {/* Tableau */}
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <CardTitle>Liste des matières</CardTitle>
              <CardDescription>
                Créez, modifiez ou supprimez des matières.
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
                  <TableHead>Coefficients / Séries</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 3 }).map((__, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-12">
                      <div className="flex flex-col items-center space-y-3">
                        <BookOpen className="h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          {searchTerm ? "Aucun résultat." : "Aucune matière."}
                        </p>
                        {!searchTerm && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={openCreate}
                          >
                            <Plus className="mr-2 h-4 w-4" /> Créer la première
                            matière
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((subject) => {
                    const coeffs = normalizeCoefficients(
                      (subject as any).seriesCoefficients,
                    );
                    return (
                      <TableRow key={subject.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                            {subject.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          {coeffs.length === 0 ? (
                            <span className="text-muted-foreground text-sm">
                              —
                            </span>
                          ) : (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge
                                    variant="secondary"
                                    className="cursor-help"
                                  >
                                    <Hash className="h-3 w-3 mr-1" />
                                    {coeffs.length} série
                                    {coeffs.length > 1 ? "s" : ""}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="space-y-1">
                                    {coeffs.map((c, idx) => (
                                      <div
                                        key={`${c.serieId ?? "unknown"}-${idx}`}
                                        className="text-sm"
                                      >
                                        {resolveSerieLabel(c.serieId)} : coef.{" "}
                                        {c.coefficient}
                                      </div>
                                    ))}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
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
                                onClick={() => openView(subject)}
                              >
                                <Eye className="mr-2 h-4 w-4" /> Voir les
                                détails
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openEdit(subject)}
                              >
                                <Edit className="mr-2 h-4 w-4" /> Modifier
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={() => openDelete(subject)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
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

      {/* ── Dialog Création ── */}
      <Dialog
        open={dialogMode === "create"}
        onOpenChange={(o) => !o && closeDialog()}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nouvelle matière</DialogTitle>
            <DialogDescription>
              Remplissez les informations de la matière.
            </DialogDescription>
          </DialogHeader>
          <SubjectForm
            mode="create"
            serieOptions={serieOptions}
            onSubmit={handleCreate}
            onCancel={closeDialog}
            isLoading={actionLoading}
          />
          {actionError && (
            <p className="text-sm text-red-500 flex items-center gap-1">
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier la matière</DialogTitle>
            <DialogDescription>
              Modifiez les informations de la matière.
            </DialogDescription>
          </DialogHeader>
          <SubjectForm
            key={selectedSubject?.id}
            mode="edit"
            initial={
              currentSubject?.id === selectedSubject?.id
                ? (currentSubject ?? selectedSubject ?? undefined)
                : (selectedSubject ?? undefined)
            }
            serieOptions={serieOptions}
            onSubmit={handleUpdate}
            onCancel={closeDialog}
            isLoading={actionLoading}
          />
          {actionError && (
            <p className="text-sm text-red-500 flex items-center gap-1">
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Détails de la matière</DialogTitle>
          </DialogHeader>
          {isLoading ? (
            <div className="space-y-3 py-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-full" />
              ))}
            </div>
          ) : (
            (() => {
              const s =
                currentSubject?.id === selectedSubject?.id
                  ? (currentSubject ?? selectedSubject)
                  : selectedSubject;
              const coeffs = normalizeCoefficients(
                (s as any)?.seriesCoefficients,
              );
              return (
                <div className="space-y-4 py-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Nom</p>
                    <p className="font-medium text-lg">{s?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Coefficients par série
                    </p>
                    {coeffs.length === 0 ? (
                      <p className="text-sm italic text-muted-foreground">
                        Aucun coefficient défini.
                      </p>
                    ) : (
                      <div className="space-y-1">
                        {coeffs.map((c) => (
                          <div
                            key={c.serieId}
                            className="flex items-center gap-2"
                          >
                            <Badge variant="outline">
                              {resolveSerieLabel(c.serieId)}
                            </Badge>
                            <span className="text-sm">
                              coef. <strong>{c.coefficient}</strong>
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()
          )}
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Fermer
            </Button>
            <Button
              onClick={() => selectedSubject && openEdit(selectedSubject)}
            >
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
              Cette action est <strong>irréversible</strong>. Toutes les notes
              et dépendances seront supprimées.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-muted p-4 my-2">
            <p className="text-sm text-muted-foreground">Matière concernée</p>
            <p className="font-semibold text-lg">{selectedSubject?.name}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {
                normalizeCoefficients(
                  (selectedSubject as any)?.seriesCoefficients,
                ).length
              }{" "}
              série(s) associée(s)
            </p>
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
            <DialogTitle>Exporter les matières</DialogTitle>
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
              Toutes les matières ({filtered.length}) avec leurs coefficients
              seront incluses.
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
