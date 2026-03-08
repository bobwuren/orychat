"use client";

import { useState, useEffect, useCallback } from "react";
import {
  AdminPage,
  PageHeader,
  AdminCard,
  Btn,
  AdminTable,
  THead,
  Th,
  TBody,
  Tr,
  Td,
  SkeletonRows,
  EmptyRow,
  AdminDialog,
  DialogActions,
  FormField,
  AdminInput,
  AdminBadge,
  PaginationBar,
  SearchBar,
  InlineError,
  PageError,
} from "@/components/admin/ui";
import { getUsers, updateUser, deleteUser } from "@/lib/api/auth.api";
import { useAuth } from "@/lib/hooks";
import type { AuthUser, UserRole } from "@/lib/types/auth.types";

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------

const ITEMS_PER_PAGE = 10;
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

type DialogMode = "view" | "edit" | "delete" | "create-admin" | null;

// ---------------------------------------------------------------------------
// Icônes SVG inline
// ---------------------------------------------------------------------------

function IconRefresh() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
      <path
        d="M2 8a6 6 0 0110.472-4M14 8a6 6 0 01-10.472 4M2 8h2m10 0h-2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconShield() {
  return (
    <svg
      className="w-3.5 h-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconEye({ off }: { off?: boolean }) {
  if (off)
    return (
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconCopy({ checked }: { checked?: boolean }) {
  if (checked)
    return (
      <svg
        className="w-3.5 h-3.5 text-green-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          d="M4.5 12.75l6 6 9-13.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  return (
    <svg
      className="w-3.5 h-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Helpers d'affichage
// ---------------------------------------------------------------------------

function RoleBadge({ role }: { role: UserRole }) {
  if (role === "admin") {
    return (
      <AdminBadge color="gold">
        <svg
          className="w-2.5 h-2.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Admin
      </AdminBadge>
    );
  }
  return <AdminBadge color="gray">Client</AdminBadge>;
}

function UserAvatar({
  user,
  size = "sm",
}: {
  user: AuthUser;
  size?: "sm" | "lg";
}) {
  const isAdmin = user.permissions === "admin";
  const dim = size === "lg" ? "w-12 h-12 text-base" : "w-7 h-7 text-[11px]";
  return (
    <div
      className={`${dim} rounded-full flex items-center justify-center font-bold shrink-0 ${
        isAdmin
          ? "bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-[#c9a84c]"
          : "bg-[#141414] border border-[#222] text-[#555]"
      }`}
    >
      {user.email[0].toUpperCase()}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Formulaire édition utilisateur
// ---------------------------------------------------------------------------

interface EditUserFormProps {
  user: AuthUser;
  onSubmit: (email?: string, password?: string) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

function EditUserForm({
  user,
  onSubmit,
  onCancel,
  isLoading,
}: EditUserFormProps) {
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
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(newPassword)) {
        setFormError(
          "Min. 8 caractères, une majuscule, une minuscule, un chiffre.",
        );
        return;
      }
    }
    try {
      await onSubmit(newEmail, newPassword);
    } catch (err: any) {
      setFormError(err?.message ?? "Erreur.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Email" required>
        <AdminInput
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </FormField>
      <FormField
        label="Nouveau mot de passe"
        hint="Laisser vide pour ne pas modifier. Min. 8 chars, 1 maj, 1 min, 1 chiffre."
      >
        <div className="relative">
          <AdminInput
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={isLoading}
            className="pr-10"
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444] hover:text-[#888] transition-colors"
          >
            <IconEye off={showPassword} />
          </button>
        </div>
      </FormField>
      <p className="text-[11px] text-[#444]">
        Le rôle (admin/client) ne peut pas être modifié depuis cette interface.
      </p>
      <InlineError message={formError} />
      <DialogActions>
        <Btn
          variant="ghost"
          type="button"
          onClick={onCancel}
          disabled={isLoading}
        >
          Annuler
        </Btn>
        <Btn variant="primary" type="submit" loading={isLoading}>
          Enregistrer
        </Btn>
      </DialogActions>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Page principale
// ---------------------------------------------------------------------------

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

  // Credentials admin générés — affichés une seule fois après création
  const [generatedCredentials, setGeneratedCredentials] = useState<{
    email: string;
    password: string;
  } | null>(null);
  const [copiedField, setCopiedField] = useState<"email" | "password" | null>(
    null,
  );

  // ── Chargement ─────────────────────────────────────────────────────────────

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

  // ── Filtrage ───────────────────────────────────────────────────────────────

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

  // ── Stats ──────────────────────────────────────────────────────────────────

  const adminCount = users.filter((u) => u.permissions === "admin").length;
  const clientCount = users.filter((u) => u.permissions === "client").length;

  // ── Dialogs ────────────────────────────────────────────────────────────────

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

  // ── Actions ────────────────────────────────────────────────────────────────

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
      setUsers((prev) => [...prev, data.user]);
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

  // ── Rendu erreur globale ───────────────────────────────────────────────────

  if (loadError && users.length === 0) {
    return <PageError message={loadError} onRetry={load} />;
  }

  // ── Stats cards ────────────────────────────────────────────────────────────

  const statCards = [
    {
      key: "all" as const,
      label: "Total",
      value: users.length,
      icon: (
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      color: "text-[#666]",
    },
    {
      key: "admin" as const,
      label: "Admins",
      value: adminCount,
      icon: (
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      color: "text-[#c9a84c]",
    },
    {
      key: "client" as const,
      label: "Clients",
      value: clientCount,
      icon: (
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      color: "text-[#555]",
    },
  ];

  return (
    <AdminPage>
      <PageHeader
        title="Utilisateurs"
        subtitle={`${users.length} utilisateur${users.length !== 1 ? "s" : ""} · ${adminCount} admin${adminCount !== 1 ? "s" : ""} · ${clientCount} client${clientCount !== 1 ? "s" : ""}`}
        actions={
          <>
            <Btn
              variant="secondary"
              size="sm"
              loading={isLoading}
              onClick={load}
              icon={<IconRefresh />}
            >
              Actualiser
            </Btn>
          </>
        }
      />

      {/* ── Stats cards cliquables ── */}
      <div className="grid grid-cols-3 gap-3">
        {statCards.map(({ key, label, value, icon, color }) => {
          const isActive = filterRole === key;
          return (
            <button
              key={key}
              onClick={() => setFilterRole(key)}
              className={[
                "flex flex-col gap-3 p-4 rounded-xl border text-left transition-all duration-200",
                isActive
                  ? "bg-[#c9a84c]/5 border-[#c9a84c]/25"
                  : "bg-[#0e0e0e] border-[#1a1a1a] hover:border-[#252525] hover:bg-[#141414]",
              ].join(" ")}
            >
              <div className={`${color} ${isActive ? "text-[#c9a84c]" : ""}`}>
                {icon}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.1em] text-[#444] font-semibold">
                  {label}
                </p>
                <p className="text-2xl font-bold text-white mt-0.5">{value}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Tableau ── */}
      <AdminCard
        title="Liste des utilisateurs"
        description="Consultez, modifiez ou supprimez les comptes."
        toolbar={
          <SearchBar
            value={searchInput}
            onChange={(v) => {
              setSearchInput(v);
              if (!v) setSearchTerm("");
            }}
            onSubmit={() => setSearchTerm(searchInput)}
            placeholder="Email ou ID…"
          />
        }
      >
        <AdminTable>
          <THead>
            <Th>Utilisateur</Th>
            <Th>ID</Th>
            <Th>Rôle</Th>
            <Th right>Actions</Th>
          </THead>
          <TBody>
            {isLoading ? (
              <SkeletonRows cols={4} />
            ) : paginated.length === 0 ? (
              <EmptyRow
                colSpan={4}
                label={
                  searchTerm || filterRole !== "all"
                    ? "Aucun résultat."
                    : "Aucun utilisateur."
                }
              />
            ) : (
              paginated.map((u) => (
                <Tr key={u.id}>
                  <Td>
                    <div className="flex items-center gap-2.5">
                      <UserAvatar user={u} />
                      <div>
                        <p className="text-sm font-medium text-white">
                          {u.email}
                        </p>
                        {u.id === currentUser?.id && (
                          <p className="text-[10px] text-[#c9a84c]">
                            Votre compte
                          </p>
                        )}
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <code className="text-[11px] font-mono text-[#444] bg-[#141414] px-2 py-0.5 rounded">
                      {String(u.id).slice(0, 16)}
                      {String(u.id).length > 16 ? "…" : ""}
                    </code>
                  </Td>
                  <Td>
                    <RoleBadge role={u.permissions} />
                  </Td>
                  <Td right>
                    <div className="flex items-center justify-end gap-1">
                      <Btn
                        variant="ghost"
                        size="sm"
                        onClick={() => openView(u)}
                      >
                        Voir
                      </Btn>
                      <Btn
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(u)}
                      >
                        Modifier
                      </Btn>
                      <Btn
                        variant="danger"
                        size="sm"
                        onClick={() => openDelete(u)}
                        disabled={u.id === currentUser?.id}
                      >
                        Supprimer
                      </Btn>
                    </div>
                  </Td>
                </Tr>
              ))
            )}
          </TBody>
        </AdminTable>
        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filtered.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </AdminCard>

      {/* ── Dialog Vue ── */}
      <AdminDialog
        open={dialogMode === "view"}
        onClose={closeDialog}
        title="Détails de l'utilisateur"
        size="sm"
      >
        <div className="space-y-5">
          <div className="flex items-center gap-4 p-4 bg-[#0a0a0a] border border-[#141414] rounded-xl">
            {selected && <UserAvatar user={selected} size="lg" />}
            <div>
              <p className="font-semibold text-white">{selected?.email}</p>
              <div className="mt-1.5">
                {selected && <RoleBadge role={selected.permissions} />}
              </div>
              {selected?.id === currentUser?.id && (
                <p className="text-[10px] text-[#c9a84c] mt-1.5">
                  Votre compte
                </p>
              )}
            </div>
          </div>
          <div className="p-4 bg-[#0a0a0a] border border-[#141414] rounded-xl">
            <p className="text-[10px] uppercase tracking-[0.12em] text-[#444] font-semibold mb-2">
              ID
            </p>
            <code className="text-xs font-mono text-[#888] break-all">
              {selected?.id}
            </code>
          </div>
        </div>
        <DialogActions>
          <Btn variant="ghost" onClick={closeDialog}>
            Fermer
          </Btn>
          <Btn
            variant="secondary"
            onClick={() => {
              closeDialog();
              setTimeout(() => selected && openEdit(selected), 100);
            }}
          >
            Modifier
          </Btn>
        </DialogActions>
      </AdminDialog>

      {/* ── Dialog Édition ── */}
      <AdminDialog
        open={dialogMode === "edit"}
        onClose={closeDialog}
        title="Modifier l'utilisateur"
        description="Modifiez l'email et/ou le mot de passe."
      >
        {selected && (
          <EditUserForm
            key={selected.id}
            user={selected}
            onSubmit={handleUpdate}
            onCancel={closeDialog}
            isLoading={actionLoading}
          />
        )}
        <InlineError message={actionError} />
      </AdminDialog>

      {/* ── Dialog Suppression ── */}
      <AdminDialog
        open={dialogMode === "delete"}
        onClose={closeDialog}
        title="Confirmer la suppression"
        description="Cette action est irréversible."
        size="sm"
      >
        {selected && (
          <div className="flex items-center gap-3 p-4 bg-[#141414] border border-[#1e1e1e] rounded-xl mb-2">
            <UserAvatar user={selected} />
            <div>
              <p className="text-sm font-semibold text-white">
                {selected.email}
              </p>
              <RoleBadge role={selected.permissions} />
            </div>
          </div>
        )}
        {selected?.id === currentUser?.id && (
          <InlineError message="Vous ne pouvez pas supprimer votre propre compte." />
        )}
        <InlineError message={actionError} />
        <DialogActions>
          <Btn variant="ghost" onClick={closeDialog} disabled={actionLoading}>
            Annuler
          </Btn>
          <Btn
            variant="danger"
            onClick={handleDelete}
            loading={actionLoading}
            disabled={selected?.id === currentUser?.id}
          >
            Supprimer définitivement
          </Btn>
        </DialogActions>
      </AdminDialog>
    </AdminPage>
  );
}
