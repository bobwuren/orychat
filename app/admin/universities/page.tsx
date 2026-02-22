"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Building, Download, Plus, Search, Edit, Trash2, Eye,
  RefreshCw, AlertCircle, MoreVertical, X, Award,
  Globe, GraduationCap, ExternalLink,
} from "lucide-react";
import { useUniversities } from "@/lib/hooks";
import { useDegrees } from "@/lib/hooks";
import type { University } from "@/lib/types";

// ─── Constantes ───────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 10;
type DialogMode = "create" | "edit" | "view" | "delete" | "export" | null;

// ─── Formulaire université ────────────────────────────────────────────────────

interface DegreeRow {
  name: string;
  description?: string;
}

interface UniversityFormProps {
  initial?: Partial<University>;
  availableDegrees: Array<{ id: string; name: string }>;
  onSubmit: (data: {
    name: string;
    webSite?: string;
    description?: string;
    isSponsor: boolean;
    degrees: DegreeRow[];
  }) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  mode: "create" | "edit";
}

function UniversityForm({ initial, availableDegrees, onSubmit, onCancel, isLoading, mode }: UniversityFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [webSite, setWebSite] = useState(initial?.webSite ?? initial?.website ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [isSponsor, setIsSponsor] = useState(initial?.isSponsor ?? false);
  // degrees : on envoie { name, description } — le backend crée/associe
  const [degrees, setDegrees] = useState<DegreeRow[]>(
    () => (initial?.degrees ?? []).map((d: any) => ({ name: d.name ?? "", description: d.description ?? "" }))
  );
  const [formError, setFormError] = useState<string | null>(null);

  const addDegree = () => setDegrees((prev) => [...prev, { name: "", description: "" }]);
  const removeDegree = (i: number) => setDegrees((prev) => prev.filter((_, idx) => idx !== i));
  const updateDegree = (i: number, field: keyof DegreeRow, value: string) =>
    setDegrees((prev) => prev.map((d, idx) => (idx === i ? { ...d, [field]: value } : d)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!name.trim()) { setFormError("Le nom est obligatoire."); return; }
    if (mode === "create" && degrees.length === 0) {
      setFormError("Au moins une formation est requise."); return;
    }
    for (const d of degrees) {
      if (!d.name.trim()) { setFormError("Chaque formation doit avoir un nom."); return; }
    }
    try {
      await onSubmit({
        name: name.trim(),
        webSite: webSite.trim() || undefined,
        description: description.trim() || undefined,
        isSponsor,
        degrees,
      });
    } catch (err: any) {
      setFormError(err?.message ?? "Une erreur est survenue.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="u-name">Nom <span className="text-red-500">*</span></Label>
        <Input id="u-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="ex: Université de Paris" disabled={isLoading} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="u-website">Site web</Label>
        <Input id="u-website" value={webSite} onChange={(e) => setWebSite(e.target.value)} placeholder="https://…" disabled={isLoading} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="u-desc">Description</Label>
        <Textarea id="u-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} disabled={isLoading} />
      </div>
      <div className="flex items-center gap-3">
        <Switch id="u-sponsor" checked={isSponsor} onCheckedChange={setIsSponsor} disabled={isLoading} />
        <Label htmlFor="u-sponsor">Université sponsor</Label>
      </div>
      {isSponsor && (
        <div className="space-y-2">
          <Label>Niveau de sponsoring</Label>
          <Select disabled={isLoading}>
            <SelectTrigger><SelectValue placeholder="Niveau…" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="bronze">Bronze</SelectItem>
              <SelectItem value="silver">Silver</SelectItem>
              <SelectItem value="gold">Gold</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>
            Formations {mode === "create" && <span className="text-red-500">*</span>}
          </Label>
          <Button type="button" variant="outline" size="sm" onClick={addDegree} disabled={isLoading}>
            <Plus className="h-3 w-3 mr-1" /> Ajouter
          </Button>
        </div>
        {degrees.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            {mode === "create" ? "Au moins une formation requise." : "Aucune formation associée."}
          </p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {degrees.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  value={d.name}
                  onChange={(e) => updateDegree(i, "name", e.target.value)}
                  placeholder="Nom de la formation"
                  disabled={isLoading}
                  className="flex-1"
                />
                <Input
                  value={d.description ?? ""}
                  onChange={(e) => updateDegree(i, "description", e.target.value)}
                  placeholder="Description (optionnel)"
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeDegree(i)} disabled={isLoading}>
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
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>Annuler</Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Enregistrement…</> :
            mode === "create" ? <><Plus className="mr-2 h-4 w-4" /> Créer</> :
              <><Edit className="mr-2 h-4 w-4" /> Mettre à jour</>}
        </Button>
      </DialogFooter>
    </form>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function UniversitiesAdminPage() {
  const {
    universities,
    currentUniversity,
    isLoading,
    error,
    fetchUniversities,
    fetchUniversityById,
    createUniversity,
    updateUniversity,
    deleteUniversity,
    exportUniversities,
  } = useUniversities();

  const { degrees: availableDegrees, fetchDegrees } = useDegrees();

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSponsor, setFilterSponsor] = useState<"all" | "sponsors" | "non-sponsors">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv");
  const [isExporting, setIsExporting] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(() => { fetchUniversities(); }, [fetchUniversities]);

  useEffect(() => { load(); fetchDegrees(); }, [load, fetchDegrees]);
  useEffect(() => { setCurrentPage(1); }, [searchTerm, filterSponsor]);

  const filtered = (universities ?? []).filter((u) => {
    const matchSearch = !searchTerm || u.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSponsor =
      filterSponsor === "all" ||
      (filterSponsor === "sponsors" && u.isSponsor) ||
      (filterSponsor === "non-sponsors" && !u.isSponsor);
    return matchSearch && matchSponsor;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const closeDialog = () => { setDialogMode(null); setSelectedUniversity(null); setActionError(null); };
  const openCreate = () => { setSelectedUniversity(null); setActionError(null); setDialogMode("create"); };
  const openEdit = async (u: University) => { setActionError(null); setSelectedUniversity(u); setDialogMode("edit"); await fetchUniversityById(u.id); };
  const openView = async (u: University) => { setActionError(null); setSelectedUniversity(u); setDialogMode("view"); await fetchUniversityById(u.id); };
  const openDelete = (u: University) => { setActionError(null); setSelectedUniversity(u); setDialogMode("delete"); };

  const handleCreate = async (data: any) => {
    setActionLoading(true); setActionError(null);
    try { await createUniversity(data); closeDialog(); }
    catch (err: any) { setActionError(err?.message ?? "Erreur."); throw err; }
    finally { setActionLoading(false); }
  };

  const handleUpdate = async (data: any) => {
    if (!selectedUniversity) return;
    setActionLoading(true); setActionError(null);
    try { await updateUniversity(selectedUniversity.id, data); closeDialog(); }
    catch (err: any) { setActionError(err?.message ?? "Erreur."); throw err; }
    finally { setActionLoading(false); }
  };

  const handleDelete = async () => {
    if (!selectedUniversity) return;
    setActionLoading(true); setActionError(null);
    try { await deleteUniversity(selectedUniversity.id); closeDialog(); }
    catch (err: any) { setActionError(err?.message ?? "Erreur."); }
    finally { setActionLoading(false); }
  };

  const handleExport = async () => {
    setIsExporting(true); setActionError(null);
    try { await exportUniversities({ format: exportFormat }); closeDialog(); }
    catch (err: any) { setActionError(err?.message ?? "Erreur export."); }
    finally { setIsExporting(false); }
  };

  const activeUniversity = currentUniversity?.id === selectedUniversity?.id
    ? (currentUniversity ?? selectedUniversity) : selectedUniversity;

  const degreesForForm = (availableDegrees ?? []).map((d) => ({ id: String(d.id), name: d.name }));

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <div className="text-center">
          <h3 className="text-lg font-semibold">Erreur de chargement</h3>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
        <Button onClick={load}><RefreshCw className="mr-2 h-4 w-4" /> Réessayer</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Universités</h1>
          <p className="text-muted-foreground">
            {filtered.length} université{filtered.length !== 1 ? "s" : ""}
            {" · "}{(universities ?? []).filter((u) => u.isSponsor).length} sponsor{(universities ?? []).filter((u) => u.isSponsor).length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={load} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} /> Actualiser
          </Button>
          <Button variant="outline" onClick={() => setDialogMode("export")}>
            <Download className="mr-2 h-4 w-4" /> Exporter
          </Button>
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" /> Nouvelle université
          </Button>
        </div>
      </div>

      {/* Tableau */}
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <CardTitle>Liste des universités</CardTitle>
              <CardDescription>Créez, modifiez ou supprimez des universités.</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={filterSponsor} onValueChange={(v: any) => setFilterSponsor(v)}>
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="sponsors">Sponsors</SelectItem>
                  <SelectItem value="non-sponsors">Non-sponsors</SelectItem>
                </SelectContent>
              </Select>
              <form
                onSubmit={(e) => { e.preventDefault(); setSearchTerm(searchInput); }}
                className="flex space-x-2"
              >
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher…"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pl-8 w-52"
                  />
                  {searchInput && (
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => { setSearchInput(""); setSearchTerm(""); }}
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
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Formations</TableHead>
                  <TableHead>Site web</TableHead>
                  <TableHead>Sponsor</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 5 }).map((__, j) => (
                        <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <div className="flex flex-col items-center space-y-3">
                        <Building className="h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          {searchTerm || filterSponsor !== "all" ? "Aucun résultat." : "Aucune université."}
                        </p>
                        {!searchTerm && filterSponsor === "all" && (
                          <Button variant="outline" size="sm" onClick={openCreate}>
                            <Plus className="mr-2 h-4 w-4" /> Créer la première université
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((university) => (
                    <TableRow key={university.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-muted-foreground shrink-0" />
                          {university.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        {(university.degrees?.length ?? 0) === 0 ? (
                          <span className="text-muted-foreground text-sm">—</span>
                        ) : (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge variant="secondary" className="cursor-help">
                                  <GraduationCap className="h-3 w-3 mr-1" />
                                  {university.degrees?.length}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="space-y-1 max-h-40 overflow-y-auto">
                                  {university.degrees?.map((d) => (
                                    <p key={d.id} className="text-sm">{d.name}</p>
                                  ))}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </TableCell>
                      <TableCell>
                        {university.webSite || university.website ? (
                          <a
                            href={university.webSite ?? university.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                          >
                            <Globe className="h-3 w-3" />
                            Site web
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </TableCell>
                        <TableCell>
                        {university.isSponsor ? (
                          <Badge variant="outline" className="border">
                          <Award className="h-3 w-3 mr-1" />
                          Oui
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">Non</Badge>
                        )}
                        </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => openView(university)}>
                              <Eye className="mr-2 h-4 w-4" /> Voir les détails
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEdit(university)}>
                              <Edit className="mr-2 h-4 w-4" /> Modifier
                            </DropdownMenuItem>
                            {(university.webSite || university.website) && (
                              <DropdownMenuItem asChild>
                                <a href={university.webSite ?? university.website} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="mr-2 h-4 w-4" /> Visiter le site
                                </a>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => openDelete(university)}
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
                {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} sur {filtered.length}
              </p>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#"
                      onClick={(e) => { e.preventDefault(); if (currentPage > 1) setCurrentPage((p) => p - 1); }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink href="#"
                        onClick={(e) => { e.preventDefault(); setCurrentPage(page); }}
                        isActive={currentPage === page}
                      >{page}</PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext href="#"
                      onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) setCurrentPage((p) => p + 1); }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Dialog Création ── */}
      <Dialog open={dialogMode === "create"} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouvelle université</DialogTitle>
            <DialogDescription>Remplissez les informations. Au moins une formation est requise.</DialogDescription>
          </DialogHeader>
          <UniversityForm
            mode="create"
            availableDegrees={degreesForForm}
            onSubmit={handleCreate}
            onCancel={closeDialog}
            isLoading={actionLoading}
          />
          {actionError && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="h-4 w-4" /> {actionError}</p>}
        </DialogContent>
      </Dialog>

      {/* ── Dialog Édition ── */}
      <Dialog open={dialogMode === "edit"} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier l'université</DialogTitle>
            <DialogDescription>Modifiez les informations de l'université.</DialogDescription>
          </DialogHeader>
          <UniversityForm
            key={selectedUniversity?.id}
            mode="edit"
            initial={activeUniversity ?? undefined}
            availableDegrees={degreesForForm}
            onSubmit={handleUpdate}
            onCancel={closeDialog}
            isLoading={actionLoading}
          />
          {actionError && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="h-4 w-4" /> {actionError}</p>}
        </DialogContent>
      </Dialog>

      {/* ── Dialog Vue ── */}
      <Dialog open={dialogMode === "view"} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Détails de l'université</DialogTitle></DialogHeader>
          {isLoading ? (
            <div className="space-y-3 py-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-5 w-full" />)}</div>
          ) : (
            <div className="space-y-4 py-2">
              <div>
                <p className="text-sm text-muted-foreground">Nom</p>
                <p className="font-semibold text-lg">{activeUniversity?.name}</p>
              </div>
              {activeUniversity?.description && (
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="text-sm">{activeUniversity.description}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Statut</p>
                  <p className="font-semibold">
                  {activeUniversity?.isSponsor ? "Oui" : "Non"}
                  </p>
              </div>
              {(activeUniversity?.webSite || activeUniversity?.website) && (
                <div>
                  <p className="text-sm text-muted-foreground">Site web</p>
                  <a
                    href={activeUniversity.webSite ?? activeUniversity.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
                  >
                    <Globe className="h-3 w-3" />
                    {activeUniversity.webSite ?? activeUniversity.website}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Formations ({activeUniversity?.degrees?.length ?? 0})</p>
                {(activeUniversity?.degrees?.length ?? 0) === 0 ? (
                  <p className="text-sm italic text-muted-foreground">Aucune formation.</p>
                ) : (
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {activeUniversity?.degrees?.map((d) => (
                      <div key={d.id} className="flex items-center gap-2 border rounded px-3 py-1.5 text-sm">
                        <GraduationCap className="h-3 w-3 text-muted-foreground" />
                        <span>{d.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Fermer</Button>
            <Button onClick={() => selectedUniversity && openEdit(selectedUniversity)}>
              <Edit className="mr-2 h-4 w-4" /> Modifier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog Suppression ── */}
      <Dialog open={dialogMode === "delete"} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Cette action est <strong>irréversible</strong>. L'université et toutes ses associations seront supprimées.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-muted p-4 my-2">
            <p className="text-sm text-muted-foreground">Université concernée</p>
            <p className="font-semibold text-lg">{selectedUniversity?.name}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedUniversity?.degrees?.length ?? 0} formation(s) · {selectedUniversity?.isSponsor ? "Sponsor" : "Standard"}
            </p>
          </div>
          {actionError && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="h-4 w-4" /> {actionError}</p>}
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} disabled={actionLoading}>Annuler</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={actionLoading}>
              {actionLoading ? <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Suppression…</> :
                <><Trash2 className="mr-2 h-4 w-4" /> Supprimer définitivement</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog Export ── */}
      <Dialog open={dialogMode === "export"} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exporter les universités</DialogTitle>
            <DialogDescription>Choisissez le format d'export.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Format</Label>
              <Select value={exportFormat} onValueChange={(v: "csv" | "json") => setExportFormat(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV (Excel)</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
              Toutes les universités ({filtered.length}) avec leurs formations seront incluses.
            </div>
          </div>
          {actionError && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="h-4 w-4" /> {actionError}</p>}
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} disabled={isExporting}>Annuler</Button>
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting ? <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Export…</> :
                <><Download className="mr-2 h-4 w-4" /> Exporter</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}