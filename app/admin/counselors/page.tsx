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
import { Switch } from "@/components/ui/switch";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  AlertCircle,
  MoreVertical,
  X,
  UserCheck,
  UserX,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { counselorsApi } from "@/lib/api";
import type {
  Counselor,
  CreateCounselorRequest,
  UpdateCounselorRequest,
} from "@/lib/types";

// ─── Constantes ───────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 10;
type DialogMode = "create" | "edit" | "view" | "delete" | null;

// ─── Formulaire conseiller ────────────────────────────────────────────────────

interface CounselorFormProps {
  initial?: Partial<Counselor>;
  onSubmit: (
    data: CreateCounselorRequest | UpdateCounselorRequest,
  ) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  mode: "create" | "edit";
}

function CounselorForm({
  initial,
  onSubmit,
  onCancel,
  isLoading,
  mode,
}: CounselorFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [photo, setPhoto] = useState(initial?.photo ?? "");
  const [bio, setBio] = useState(initial?.bio ?? "");
  const [specialtyInput, setSpecialtyInput] = useState("");
  const [specialties, setSpecialties] = useState<string[]>(
    initial?.specialties ?? [],
  );
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [formError, setFormError] = useState<string | null>(null);

  const addSpecialty = () => {
    const s = specialtyInput.trim();
    if (s && !specialties.includes(s)) {
      setSpecialties((prev) => [...prev, s]);
    }
    setSpecialtyInput("");
  };
  const removeSpecialty = (s: string) =>
    setSpecialties((prev) => prev.filter((x) => x !== s));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!name.trim()) {
      setFormError("Le nom est obligatoire.");
      return;
    }
    if (!email.trim()) {
      setFormError("L'email est obligatoire.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError("Format d'email invalide.");
      return;
    }
    if (photo && !/^https?:\/\/.+/.test(photo)) {
      setFormError("L'URL de la photo doit commencer par http(s)://");
      return;
    }
    try {
      await onSubmit({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        photo: photo.trim() || undefined,
        bio: bio.trim() || undefined,
        specialties: specialties.length > 0 ? specialties : undefined,
        isActive,
      });
    } catch (err: any) {
      setFormError(err?.message ?? "Une erreur est survenue.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 col-span-2">
          <Label htmlFor="c-name">
            Nom complet <span className="text-red-500">*</span>
          </Label>
          <Input
            id="c-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ex: Jean Dupont"
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2 col-span-2 md:col-span-1">
          <Label htmlFor="c-email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="c-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="conseiller@example.com"
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2 col-span-2 md:col-span-1">
          <Label htmlFor="c-phone">Téléphone</Label>
          <Input
            id="c-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+228 90 12 34 56"
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2 col-span-2">
          <Label htmlFor="c-photo">URL Photo</Label>
          <Input
            id="c-photo"
            value={photo}
            onChange={(e) => setPhoto(e.target.value)}
            placeholder="https://…"
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2 col-span-2">
          <Label htmlFor="c-bio">Biographie</Label>
          <Textarea
            id="c-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="Présentation du conseiller…"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Spécialités</Label>
        <div className="flex gap-2">
          <Input
            value={specialtyInput}
            onChange={(e) => setSpecialtyInput(e.target.value)}
            placeholder="ex: Orientation post-bac"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSpecialty();
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={addSpecialty}
            disabled={isLoading || !specialtyInput.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {specialties.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {specialties.map((s) => (
              <Badge key={s} variant="secondary" className="gap-1">
                {s}
                <button
                  type="button"
                  onClick={() => removeSpecialty(s)}
                  className="hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Switch
          id="c-active"
          checked={isActive}
          onCheckedChange={setIsActive}
          disabled={isLoading}
        />
        <Label htmlFor="c-active">Conseiller actif</Label>
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

export default function CounselorsAdminPage() {
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selected, setSelected] = useState<Counselor | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // ── Chargement ──────────────────────────────────────────────────────────────

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // getAllAdmin retourne { success, counselors, count }
      const res = await counselorsApi.getAllAdmin();
      setCounselors(res.counselors ?? []);
    } catch (err: any) {
      setError(err?.message ?? "Erreur de chargement.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterActive]);

  // ── Filtrage ────────────────────────────────────────────────────────────────

  const filtered = counselors.filter((c) => {
    const matchSearch =
      !searchTerm ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.specialties ?? []).some((s) =>
        s.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    const matchActive =
      filterActive === "all" ||
      (filterActive === "active" && c.isActive) ||
      (filterActive === "inactive" && !c.isActive);
    return matchSearch && matchActive;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // ── Dialogs ─────────────────────────────────────────────────────────────────

  const closeDialog = () => {
    setDialogMode(null);
    setSelected(null);
    setActionError(null);
  };
  const openCreate = () => {
    setSelected(null);
    setActionError(null);
    setDialogMode("create");
  };
  const openEdit = (c: Counselor) => {
    setSelected(c);
    setActionError(null);
    setDialogMode("edit");
  };
  const openView = (c: Counselor) => {
    setSelected(c);
    setDialogMode("view");
  };
  const openDelete = (c: Counselor) => {
    setSelected(c);
    setActionError(null);
    setDialogMode("delete");
  };

  // ── Actions ─────────────────────────────────────────────────────────────────

  const handleCreate = async (
    data: CreateCounselorRequest | UpdateCounselorRequest,
  ) => {
    setActionLoading(true);
    setActionError(null);
    try {
      const res = await counselorsApi.create(data as CreateCounselorRequest);
      setCounselors((prev) => [...prev, res.counselor]);
      closeDialog();
    } catch (err: any) {
      const msg = err?.message ?? "Erreur.";
      setActionError(msg);
      throw new Error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (
    data: CreateCounselorRequest | UpdateCounselorRequest,
  ) => {
    if (!selected) return;
    setActionLoading(true);
    setActionError(null);
    try {
      const res = await counselorsApi.update(
        selected.id,
        data as UpdateCounselorRequest,
      );
      setCounselors((prev) =>
        prev.map((c) => (c.id === selected.id ? res.counselor : c)),
      );
      closeDialog();
    } catch (err: any) {
      const msg = err?.message ?? "Erreur.";
      setActionError(msg);
      throw new Error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await counselorsApi.delete(selected.id);
      setCounselors((prev) => prev.filter((c) => c.id !== selected.id));
      closeDialog();
    } catch (err: any) {
      setActionError(err?.message ?? "Erreur.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleActive = async (c: Counselor) => {
    try {
      if (c.isActive) {
        await counselorsApi.deactivate(c.id);
      } else {
        await counselorsApi.activate(c.id);
      }
      setCounselors((prev) =>
        prev.map((x) => (x.id === c.id ? { ...x, isActive: !x.isActive } : x)),
      );
    } catch (err: any) {
      setError(err?.message ?? "Erreur lors du changement de statut.");
    }
  };

  // ── Rendu ────────────────────────────────────────────────────────────────────

  if (error && counselors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <div className="text-center">
          <h3 className="text-lg font-semibold">Erreur de chargement</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
        <Button onClick={load}>
          <RefreshCw className="mr-2 h-4 w-4" /> Réessayer
        </Button>
      </div>
    );
  }

  const activeCount = counselors.filter((c) => c.isActive).length;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Conseillers</h1>
          <p className="text-muted-foreground">
            {counselors.length} conseiller{counselors.length !== 1 ? "s" : ""}
            {" · "}
            {activeCount} actif{activeCount !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={load} disabled={isLoading}>
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />{" "}
            Actualiser
          </Button>
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" /> Nouveau conseiller
          </Button>
        </div>
      </div>

      {/* Tableau */}
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <CardTitle>Liste des conseillers</CardTitle>
              <CardDescription>
                Créez, modifiez, activez ou supprimez des conseillers.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {/* Filtre actif */}
              <div className="flex rounded-md border overflow-hidden text-sm">
                {(["all", "active", "inactive"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilterActive(f)}
                    className={`px-3 py-1.5 ${filterActive === f ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}
                  >
                    {f === "all"
                      ? "Tous"
                      : f === "active"
                        ? "Actifs"
                        : "Inactifs"}
                  </button>
                ))}
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
                    placeholder="Nom, email, spécialité…"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pl-8 w-56"
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
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Spécialités</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 5 }).map((__, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <div className="flex flex-col items-center space-y-3">
                        <User className="h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          {searchTerm || filterActive !== "all"
                            ? "Aucun résultat."
                            : "Aucun conseiller."}
                        </p>
                        {!searchTerm && filterActive === "all" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={openCreate}
                          >
                            <Plus className="mr-2 h-4 w-4" /> Créer le premier
                            conseiller
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((c) => (
                    <TableRow
                      key={c.id}
                      className={!c.isActive ? "opacity-60" : ""}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {c.photo ? (
                            <img
                              src={c.photo}
                              alt={c.name}
                              className="h-8 w-8 rounded-full object-cover shrink-0"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                              <User className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <p>{c.name}</p>
                            {c.bio && (
                              <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                                {c.bio}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <a
                              href={`mailto:${c.email}`}
                              className="hover:underline"
                            >
                              {c.email}
                            </a>
                          </div>
                          {c.phone && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {c.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {(c.specialties ?? []).length === 0 ? (
                            <span className="text-muted-foreground text-sm">
                              —
                            </span>
                          ) : (
                            (c.specialties ?? []).slice(0, 2).map((s) => (
                              <Badge
                                key={s}
                                variant="outline"
                                className="text-xs"
                              >
                                {s}
                              </Badge>
                            ))
                          )}
                          {(c.specialties ?? []).length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{(c.specialties ?? []).length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {c.isActive ? (
                          <Badge className="bg-green-100 text-green-800 border border-green-300 hover:bg-green-100">
                            <UserCheck className="h-3 w-3 mr-1" /> Actif
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-muted-foreground"
                          >
                            <UserX className="h-3 w-3 mr-1" /> Inactif
                          </Badge>
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
                            <DropdownMenuItem onClick={() => openView(c)}>
                              <Eye className="mr-2 h-4 w-4" /> Voir les détails
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEdit(c)}>
                              <Edit className="mr-2 h-4 w-4" /> Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleToggleActive(c)}
                            >
                              {c.isActive ? (
                                <>
                                  <UserX className="mr-2 h-4 w-4" /> Désactiver
                                </>
                              ) : (
                                <>
                                  <UserCheck className="mr-2 h-4 w-4" /> Activer
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => openDelete(c)}
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
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouveau conseiller</DialogTitle>
            <DialogDescription>
              Remplissez les informations du conseiller. Nom et email sont
              obligatoires.
            </DialogDescription>
          </DialogHeader>
          <CounselorForm
            mode="create"
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
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le conseiller</DialogTitle>
            <DialogDescription>
              Tous les champs sont optionnels sauf si vous souhaitez les
              modifier.
            </DialogDescription>
          </DialogHeader>
          <CounselorForm
            key={selected?.id}
            mode="edit"
            initial={selected ?? undefined}
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Détails du conseiller</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-4">
              {selected?.photo ? (
                <img
                  src={selected.photo}
                  alt={selected.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div>
                <p className="font-semibold text-lg">{selected?.name}</p>
                {selected?.isActive ? (
                  <Badge className="bg-green-100 text-green-800 border border-green-300 hover:bg-green-100 mt-1">
                    <UserCheck className="h-3 w-3 mr-1" /> Actif
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="text-muted-foreground mt-1"
                  >
                    <UserX className="h-3 w-3 mr-1" /> Inactif
                  </Badge>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Email</p>
                <a
                  href={`mailto:${selected?.email}`}
                  className="font-medium hover:underline"
                >
                  {selected?.email}
                </a>
              </div>
              {selected?.phone && (
                <div>
                  <p className="text-muted-foreground">Téléphone</p>
                  <p className="font-medium">{selected.phone}</p>
                </div>
              )}
            </div>
            {selected?.bio && (
              <div>
                <p className="text-sm text-muted-foreground">Biographie</p>
                <p className="text-sm mt-1">{selected.bio}</p>
              </div>
            )}
            {(selected?.specialties ?? []).length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Spécialités
                </p>
                <div className="flex flex-wrap gap-1">
                  {(selected?.specialties ?? []).map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="text-xs text-muted-foreground border-t pt-2">
              {selected?.createdAt && (
                <p>
                  Créé le{" "}
                  {new Date(selected.createdAt).toLocaleDateString("fr-FR")}
                </p>
              )}
              {selected?.updatedAt && (
                <p>
                  Modifié le{" "}
                  {new Date(selected.updatedAt).toLocaleDateString("fr-FR")}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Fermer
            </Button>
            <Button onClick={() => selected && openEdit(selected)}>
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
              Cette action est <strong>irréversible</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-muted p-4 my-2">
            <p className="text-sm text-muted-foreground">Conseiller concerné</p>
            <p className="font-semibold text-lg">{selected?.name}</p>
            <p className="text-sm text-muted-foreground">{selected?.email}</p>
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
    </div>
  );
}
