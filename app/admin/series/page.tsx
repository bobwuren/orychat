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
import { Textarea } from "@/components/ui/textarea";
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
  List,
} from "lucide-react";
import { useSeries } from "@/lib/hooks";
import { useSubjects } from "@/lib/hooks";
import type { Serie } from "@/lib/types";

// ─── Constantes ───────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 10;
type DialogMode = "create" | "edit" | "view" | "delete" | "export" | null;

// ─── Formulaire série ─────────────────────────────────────────────────────────

interface SubjectRow {
  subjectId: string;
  coefficient: number;
}

interface SerieFormProps {
  initial?: Partial<Serie>;
  subjectOptions: Array<{ id: string; name: string }>;
  onSubmit: (data: {
    code: string;
    description: string;
    subjects: SubjectRow[];
  }) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  mode: "create" | "edit";
}

function SerieForm({
  initial,
  subjectOptions,
  onSubmit,
  onCancel,
  isLoading,
  mode,
}: SerieFormProps) {
  const [code, setCode] = useState(initial?.code ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  // subjects de la série : [{ subjectId, coefficient }]
  const [rows, setRows] = useState<SubjectRow[]>(() =>
    (initial?.subjects ?? []).map((s: any) => ({
      subjectId: String(s.subjectId ?? s.id ?? ""),
      coefficient: s.coefficient ?? 1,
    })),
  );
  const [formError, setFormError] = useState<string | null>(null);

  const addRow = () =>
    setRows((prev) => [...prev, { subjectId: "", coefficient: 1 }]);
  const removeRow = (i: number) =>
    setRows((prev) => prev.filter((_, idx) => idx !== i));
  const updateRow = (
    i: number,
    field: keyof SubjectRow,
    value: string | number,
  ) =>
    setRows((prev) =>
      prev.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)),
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!code.trim()) {
      setFormError("Le code est obligatoire.");
      return;
    }
    if (!description.trim()) {
      setFormError("La description est obligatoire.");
      return;
    }
    for (const r of rows) {
      if (!r.subjectId) {
        setFormError("Chaque ligne doit avoir une matière sélectionnée.");
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
      await onSubmit({
        code: code.trim(),
        description: description.trim(),
        subjects: rows,
      });
    } catch (err: any) {
      setFormError(err?.message ?? "Une erreur est survenue.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="code">
            Code <span className="text-red-500">*</span>
          </Label>
          <Input
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="ex: S1, L, ES"
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2 col-span-2">
          <Label htmlFor="description">
            Description <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description de la série"
            disabled={isLoading}
            rows={2}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Matières</Label>
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
            Aucune matière associée.
          </p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {rows.map((row, i) => (
              <div key={i} className="flex items-center gap-2">
                <Select
                  value={row.subjectId}
                  onValueChange={(v) => updateRow(i, "subjectId", v)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Matière…" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjectOptions.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.name}
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

export default function SeriesAdminPage() {
  const {
    series,
    currentSerie,
    isLoading,
    error,
    fetchSeries,
    fetchSerieById,
    createSerie,
    updateSerie,
    deleteSerie,
    exportSeries,
  } = useSeries();

  const { subjects, fetchSubjects } = useSubjects();

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedSerie, setSelectedSerie] = useState<Serie | null>(null);
  const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv");
  const [isExporting, setIsExporting] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const filtered = (series ?? []).filter(
    (s) =>
      !searchTerm ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const load = useCallback(() => {
    fetchSeries();
  }, [fetchSeries]);

  useEffect(() => {
    load();
    fetchSubjects();
  }, [load, fetchSubjects]);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const closeDialog = () => {
    setDialogMode(null);
    setSelectedSerie(null);
    setActionError(null);
  };

  const openCreate = () => {
    setSelectedSerie(null);
    setActionError(null);
    setDialogMode("create");
  };

  const openEdit = async (s: Serie) => {
    setActionError(null);
    setSelectedSerie(s);
    setDialogMode("edit");
    await fetchSerieById(s.id);
  };

  const openView = async (s: Serie) => {
    setActionError(null);
    setSelectedSerie(s);
    setDialogMode("view");
    await fetchSerieById(s.id);
  };

  const openDelete = (s: Serie) => {
    setActionError(null);
    setSelectedSerie(s);
    setDialogMode("delete");
  };

  // ── Actions ──

  const handleCreate = async (data: {
    code: string;
    description: string;
    subjects: SubjectRow[];
  }) => {
    setActionLoading(true);
    setActionError(null);
    try {
      await createSerie({
        code: data.code,
        description: data.description,
        subjects: data.subjects.map((r) => ({
          subjectId: r.subjectId,
          coefficient: r.coefficient,
        })),
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
    code: string;
    description: string;
    subjects: SubjectRow[];
  }) => {
    if (!selectedSerie) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await updateSerie(selectedSerie.id, {
        code: data.code,
        description: data.description,
        subjects: data.subjects.map((r) => ({
          subjectId: r.subjectId,
          coefficient: r.coefficient,
        })),
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
    if (!selectedSerie) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await deleteSerie(selectedSerie.id);
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
      await exportSeries({ format: exportFormat });
      closeDialog();
    } catch (err: any) {
      setActionError(err?.message ?? "Erreur lors de l'export.");
    } finally {
      setIsExporting(false);
    }
  };

  const subjectOptions = (subjects ?? []).map((s) => ({
    id: String(s.id),
    name: s.name,
  }));

  const resolveSubjectName = (subjectId: string) => {
    const s = subjects?.find((s) => String(s.id) === String(subjectId));
    return s?.name ?? subjectId;
  };

  // getById retourne { id, code, description, subjects } direct (sans enveloppe serie:)
  // Le hook useSeries stocke dans currentSerie via response.serie — mais le backend ne renvoie pas { serie: ... }
  // On utilise donc selectedSerie pour l'affichage et currentSerie si disponible
  const activeSerie =
    currentSerie?.id === selectedSerie?.id
      ? (currentSerie ?? selectedSerie)
      : selectedSerie;

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
          <h1 className="text-3xl font-bold tracking-tight">Séries</h1>
          <p className="text-muted-foreground">
            {filtered.length} série{filtered.length !== 1 ? "s" : ""}
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
            <Plus className="mr-2 h-4 w-4" /> Nouvelle série
          </Button>
        </div>
      </div>

      {/* Tableau */}
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <CardTitle>Liste des séries</CardTitle>
              <CardDescription>
                Créez, modifiez ou supprimez des séries académiques.
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
                  placeholder="Code ou description…"
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
                  <TableHead>Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Matières</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 4 }).map((__, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12">
                      <div className="flex flex-col items-center space-y-3">
                        <BookOpen className="h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          {searchTerm ? "Aucun résultat." : "Aucune série."}
                        </p>
                        {!searchTerm && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={openCreate}
                          >
                            <Plus className="mr-2 h-4 w-4" /> Créer la première
                            série
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((serie) => (
                    <TableRow key={serie.id}>
                      <TableCell>
                        <Badge variant="secondary" className="font-mono">
                          {serie.code}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[260px]">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="truncate block cursor-help">
                                {serie.description}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">{serie.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        {(serie.subjects?.length ?? 0) === 0 ? (
                          <span className="text-muted-foreground text-sm">
                            —
                          </span>
                        ) : (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge
                                  variant="outline"
                                  className="cursor-help"
                                >
                                  <List className="h-3 w-3 mr-1" />
                                  {serie.subjects?.length} matière
                                  {(serie.subjects?.length ?? 0) > 1 ? "s" : ""}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="space-y-1">
                                  {serie.subjects?.map((s: any) => (
                                    <div
                                      key={s.id ?? s.subjectId}
                                      className="text-sm"
                                    >
                                      {s.name} — coef. {s.coefficient}
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
                            <DropdownMenuItem onClick={() => openView(serie)}>
                              <Eye className="mr-2 h-4 w-4" /> Voir les détails
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEdit(serie)}>
                              <Edit className="mr-2 h-4 w-4" /> Modifier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => openDelete(serie)}
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
            <DialogTitle>Nouvelle série</DialogTitle>
            <DialogDescription>
              Remplissez les informations de la série.
            </DialogDescription>
          </DialogHeader>
          <SerieForm
            mode="create"
            subjectOptions={subjectOptions}
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
            <DialogTitle>Modifier la série</DialogTitle>
            <DialogDescription>
              Modifiez les informations de la série.
            </DialogDescription>
          </DialogHeader>
          <SerieForm
            key={selectedSerie?.id}
            mode="edit"
            initial={activeSerie ?? undefined}
            subjectOptions={subjectOptions}
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
            <DialogTitle>Détails de la série</DialogTitle>
          </DialogHeader>
          {isLoading ? (
            <div className="space-y-3 py-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3">
                <Badge
                  variant="secondary"
                  className="font-mono text-base px-3 py-1"
                >
                  {activeSerie?.code}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="font-medium">{activeSerie?.description}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Matières ({activeSerie?.subjects?.length ?? 0})
                </p>
                {(activeSerie?.subjects?.length ?? 0) === 0 ? (
                  <p className="text-sm italic text-muted-foreground">
                    Aucune matière associée.
                  </p>
                ) : (
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {activeSerie?.subjects?.map((s: any) => (
                      <div
                        key={s.id ?? s.subjectId}
                        className="flex items-center justify-between text-sm border rounded px-3 py-1.5"
                      >
                        <span className="font-medium">
                          {s.name ?? resolveSubjectName(s.subjectId)}
                        </span>
                        <Badge variant="outline">coef. {s.coefficient}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Fermer
            </Button>
            <Button onClick={() => selectedSerie && openEdit(selectedSerie)}>
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
              Cette action est <strong>irréversible</strong>. Toutes les
              dépendances seront supprimées en cascade.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-muted p-4 my-2">
            <p className="text-sm text-muted-foreground">Série concernée</p>
            <p className="font-semibold text-lg font-mono">
              {selectedSerie?.code}
            </p>
            <p className="text-sm text-muted-foreground">
              {selectedSerie?.description}
            </p>
            <p className="text-sm mt-1">
              {selectedSerie?.subjects?.length ?? 0} matière(s) associée(s)
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
            <DialogTitle>Exporter les séries</DialogTitle>
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
              Toutes les séries ({filtered.length}) avec leurs matières seront
              incluses.
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
