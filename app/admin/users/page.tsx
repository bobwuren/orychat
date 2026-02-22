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
  RefreshCw,
  AlertCircle,
  MoreVertical,
  X,
  Users,
  Shield,
  User,
  Eye,
  EyeOff,
  Copy,
  CheckCheck,
} from "lucide-react";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "@/lib/api/auth.api";
import { useAuth } from "@/lib/hooks";
import type { AuthUser, UserRole } from "@/lib/types/auth.types";

// ─── Constantes ───────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 10;
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

type DialogMode = "view" | "edit" | "delete" | "create-admin" | null;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function RoleBadge({ role }: { role: UserRole }) {
  if (role === "admin") {
    return (
      <Badge className="bg-purple-50 text-purple-800 border border-purple-300 hover:bg-purple-50">
        <Shield className="h-3 w-3 mr-1" /> Admin
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="text-muted-foreground">
      <User className="h-3 w-3 mr-1" /> Client
    </Badge>
  );
}

// ─── Formulaire édition utilisateur ──────────────────────────────────────────

interface EditFormProps {
  user: AuthUser;
  onSubmit: (email?: string, password?: string) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

function EditUserForm({ user, onSubmit, onCancel, isLoading }: EditFormProps) {
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const newEmail = email.trim() !== user.email ? email.trim() : undefined;
    const newPassword = password || undefined;

    if (!newEmail && !newPassword) {
      setFormError("Aucune modification détectée.");
      return;
    }
    if (newEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setFormError("Format d'email invalide.");
      return;
    }
    if (newPassword) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        setFormError(
          "Le mot de passe doit faire au moins 8 caractères, contenir une majuscule, une minuscule et un chiffre.",
        );
        return;
      }
    }

    try {
      await onSubmit(newEmail, newPassword);
    } catch (err: any) {
      setFormError(err?.message ?? "Une erreur est survenue.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="u-email">Email</Label>
        <Input
          id="u-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="u-password">
          Nouveau mot de passe{" "}
          <span className="text-muted-foreground text-xs">
            (laisser vide pour ne pas changer)
          </span>
        </Label>
        <div className="relative">
          <Input
            id="u-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 8 chars, 1 maj, 1 min, 1 chiffre"
            className="pr-10"
            disabled={isLoading}
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          Le rôle (admin/client) ne peut pas être modifié depuis cette
          interface.
        </p>
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

// ─── Formulaire création admin ────────────────────────────────────────────────

interface CreateAdminFormProps {
  onSubmit: (email: string) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

function CreateAdminForm({
  onSubmit,
  onCancel,
  isLoading,
}: CreateAdminFormProps) {
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!email.trim()) {
      setFormError("L'email est obligatoire.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError("Format d'email invalide.");
      return;
    }
    try {
      await onSubmit(email.trim().toLowerCase());
    } catch (err: any) {
      setFormError(err?.message ?? "Une erreur est survenue.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="a-email">
          Email du nouvel admin <span className="text-red-500">*</span>
        </Label>
        <Input
          id="a-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@example.com"
          disabled={isLoading}
        />
      </div>
      <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
        Un mot de passe sécurisé sera généré automatiquement et affiché une
        seule fois.
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
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Création…
            </>
          ) : (
            <>
              <Shield className="mr-2 h-4 w-4" /> Créer l&apos;admin
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function UsersAdminPage() {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState<AuthUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<UserRole | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selected, setSelected] = useState<AuthUser | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Credentials admin générés (affiché une seule fois)
  const [generatedCredentials, setGeneratedCredentials] = useState<{
    email: string;
    password: string;
  } | null>(null);
  const [copiedField, setCopiedField] = useState<"email" | "password" | null>(
    null,
  );

  // ── Chargement ──────────────────────────────────────────────────────────────

  const load = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const res = await getUsers();
      setUsers(res.users ?? []);
    } catch (err: any) {
      setLoadError(err?.message ?? "Erreur de chargement.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRole]);

  // ── Filtrage ────────────────────────────────────────────────────────────────

  const filtered = users.filter((u) => {
    const matchSearch =
      !searchTerm ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.id.toString().includes(searchTerm);
    const matchRole = filterRole === "all" || u.permissions === filterRole;
    return matchSearch && matchRole;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // ── Stats ───────────────────────────────────────────────────────────────────

  const adminCount = users.filter((u) => u.permissions === "admin").length;
  const clientCount = users.filter((u) => u.permissions === "client").length;

  // ── Dialogs ─────────────────────────────────────────────────────────────────

  const closeDialog = () => {
    setDialogMode(null);
    setSelected(null);
    setActionError(null);
    setGeneratedCredentials(null);
  };
  const openView = (u: AuthUser) => {
    setSelected(u);
    setDialogMode("view");
  };
  const openEdit = (u: AuthUser) => {
    setSelected(u);
    setActionError(null);
    setDialogMode("edit");
  };
  const openDelete = (u: AuthUser) => {
    setSelected(u);
    setActionError(null);
    setDialogMode("delete");
  };
  const openCreateAdmin = () => {
    setActionError(null);
    setGeneratedCredentials(null);
    setDialogMode("create-admin");
  };

  // ── Actions ─────────────────────────────────────────────────────────────────

  const handleUpdate = async (email?: string, password?: string) => {
    if (!selected) return;
    setActionLoading(true);
    setActionError(null);
    try {
      const res = await updateUser(selected.id, { email, password });
      setUsers((prev) =>
        prev.map((u) => (u.id === selected.id ? res.user : u)),
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
    if (selected.id === currentUser?.id) {
      setActionError("Vous ne pouvez pas supprimer votre propre compte.");
      return;
    }
    setActionLoading(true);
    setActionError(null);
    try {
      await deleteUser(selected.id);
      setUsers((prev) => prev.filter((u) => u.id !== selected.id));
      closeDialog();
    } catch (err: any) {
      setActionError(err?.message ?? "Erreur.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateAdmin = async (email: string) => {
    setActionLoading(true);
    setActionError(null);
    try {
      // Route dédiée création admin : POST /auth/users/admin
      const res = await fetch(`${API_BASE}/auth/users/admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken") ?? ""}`,
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur création admin.");
      // Ajouter à la liste locale
      setUsers((prev) => [...prev, data.user]);
      // Afficher les credentials générés
      setGeneratedCredentials(data.credentials);
    } catch (err: any) {
      const msg = err?.message ?? "Erreur.";
      setActionError(msg);
      throw new Error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const copyToClipboard = (value: string, field: "email" | "password") => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  // ── Rendu erreur ─────────────────────────────────────────────────────────────

  if (loadError && users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <div className="text-center">
          <h3 className="text-lg font-semibold">Erreur de chargement</h3>
          <p className="text-muted-foreground">{loadError}</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Utilisateurs</h1>
          <p className="text-muted-foreground">
            {users.length} utilisateur{users.length !== 1 ? "s" : ""} ·{" "}
            {adminCount} admin{adminCount !== 1 ? "s" : ""} · {clientCount}{" "}
            client{clientCount !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={load} disabled={isLoading}>
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />{" "}
            Actualiser
          </Button>
          <Button onClick={openCreateAdmin}>
            <Shield className="mr-2 h-4 w-4" /> Nouvel admin
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <button
          onClick={() => setFilterRole("all")}
          className={`rounded-lg border p-4 text-left transition-all hover:shadow-sm ${filterRole === "all" ? "ring-2 ring-primary" : ""}`}
        >
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <p className="text-2xl font-bold">{users.length}</p>
        </button>
        <button
          onClick={() => setFilterRole("admin")}
          className={`rounded-lg border p-4 text-left transition-all hover:shadow-sm ${filterRole === "admin" ? "ring-2 ring-primary" : ""}`}
        >
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-4 w-4 text-purple-500" />
            <p className="text-xs text-muted-foreground">Admins</p>
          </div>
          <p className="text-2xl font-bold">{adminCount}</p>
        </button>
        <button
          onClick={() => setFilterRole("client")}
          className={`rounded-lg border p-4 text-left transition-all hover:shadow-sm ${filterRole === "client" ? "ring-2 ring-primary" : ""}`}
        >
          <div className="flex items-center gap-2 mb-1">
            <User className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Clients</p>
          </div>
          <p className="text-2xl font-bold">{clientCount}</p>
        </button>
      </div>

      {/* Tableau */}
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <CardTitle>Liste des utilisateurs</CardTitle>
              <CardDescription>
                Consultez, modifiez ou supprimez les comptes.
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
                  placeholder="Email ou ID…"
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
                  <TableHead>Email</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
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
                        <Users className="h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          {searchTerm || filterRole !== "all"
                            ? "Aucun résultat."
                            : "Aucun utilisateur."}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((u) => (
                    <TableRow
                      key={u.id}
                      className={u.id === currentUser?.id ? "bg-muted/40" : ""}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${u.permissions === "admin" ? "bg-purple-100" : "bg-muted"}`}
                          >
                            {u.permissions === "admin" ? (
                              <Shield className="h-4 w-4 text-purple-600" />
                            ) : (
                              <User className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <p>{u.email}</p>
                            {u.id === currentUser?.id && (
                              <p className="text-xs text-muted-foreground">
                                Vous
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                          {String(u.id).slice(0, 16)}
                          {String(u.id).length > 16 ? "…" : ""}
                        </code>
                      </TableCell>
                      <TableCell>
                        <RoleBadge role={u.permissions} />
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
                            <DropdownMenuItem onClick={() => openView(u)}>
                              <Eye className="mr-2 h-4 w-4" /> Voir les détails
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEdit(u)}>
                              <Edit className="mr-2 h-4 w-4" /> Modifier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => openDelete(u)}
                              disabled={u.id === currentUser?.id}
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

      {/* ── Dialog Vue ── */}
      <Dialog
        open={dialogMode === "view"}
        onOpenChange={(o) => !o && closeDialog()}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Détails de l&apos;utilisateur</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-3">
              <div
                className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${selected?.permissions === "admin" ? "bg-purple-100" : "bg-muted"}`}
              >
                {selected?.permissions === "admin" ? (
                  <Shield className="h-6 w-6 text-purple-600" />
                ) : (
                  <User className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="font-medium">{selected?.email}</p>
                <RoleBadge role={selected?.permissions ?? "client"} />
              </div>
            </div>
            <div className="rounded-lg bg-muted p-3 space-y-1.5 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">ID</p>
                <code className="font-mono text-xs break-all">
                  {selected?.id}
                </code>
              </div>
            </div>
            {selected?.id === currentUser?.id && (
              <p className="text-xs text-muted-foreground border rounded p-2 bg-muted">
                Il s&apos;agit de votre propre compte.
              </p>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={closeDialog}>
              Fermer
            </Button>
            <Button
              onClick={() => {
                closeDialog();
                setTimeout(() => selected && openEdit(selected), 100);
              }}
            >
              <Edit className="mr-2 h-4 w-4" /> Modifier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog Édition ── */}
      <Dialog
        open={dialogMode === "edit"}
        onOpenChange={(o) => !o && closeDialog()}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier l&apos;utilisateur</DialogTitle>
            <DialogDescription>
              Modifiez l&apos;email et/ou le mot de passe.
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <EditUserForm
              key={selected.id}
              user={selected}
              onSubmit={handleUpdate}
              onCancel={closeDialog}
              isLoading={actionLoading}
            />
          )}
          {actionError && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" /> {actionError}
            </p>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Dialog Suppression ── */}
      <Dialog
        open={dialogMode === "delete"}
        onOpenChange={(o) => !o && closeDialog()}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Cette action est <strong>irréversible</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-muted p-4 my-2 space-y-1">
            <p className="text-sm text-muted-foreground">
              Utilisateur concerné
            </p>
            <p className="font-semibold">{selected?.email}</p>
            <RoleBadge role={selected?.permissions ?? "client"} />
          </div>
          {selected?.id === currentUser?.id && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              Vous ne pouvez pas supprimer votre propre compte.
            </p>
          )}
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
              disabled={actionLoading || selected?.id === currentUser?.id}
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

      {/* ── Dialog Création Admin ── */}
      <Dialog
        open={dialogMode === "create-admin"}
        onOpenChange={(o) => !o && closeDialog()}
      >
        <DialogContent className="max-w-md">
          {generatedCredentials ? (
            // Écran affichage credentials — affiché une seule fois
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CheckCheck className="h-5 w-5 text-green-600" />
                  Admin créé avec succès
                </DialogTitle>
                <DialogDescription>
                  Notez ces identifiants maintenant. Ils ne seront plus
                  affichés.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <div className="rounded-lg border bg-muted p-4 space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                    <div className="flex items-center justify-between gap-2">
                      <code className="text-sm font-mono">
                        {generatedCredentials.email}
                      </code>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 shrink-0"
                        onClick={() =>
                          copyToClipboard(generatedCredentials.email, "email")
                        }
                      >
                        {copiedField === "email" ? (
                          <CheckCheck className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Mot de passe généré
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <code className="text-sm font-mono bg-background px-2 py-1 rounded border">
                        {generatedCredentials.password}
                      </code>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 shrink-0"
                        onClick={() =>
                          copyToClipboard(
                            generatedCredentials.password,
                            "password",
                          )
                        }
                      >
                        {copiedField === "password" ? (
                          <CheckCheck className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Partagez ces identifiants de façon sécurisée. L&apos;admin
                  devra changer son mot de passe à la première connexion.
                </p>
              </div>
              <DialogFooter>
                <Button onClick={closeDialog}>Fermer</Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Créer un compte administrateur</DialogTitle>
                <DialogDescription>
                  Un mot de passe sécurisé sera généré automatiquement.
                </DialogDescription>
              </DialogHeader>
              <CreateAdminForm
                onSubmit={handleCreateAdmin}
                onCancel={closeDialog}
                isLoading={actionLoading}
              />
              {actionError && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" /> {actionError}
                </p>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
