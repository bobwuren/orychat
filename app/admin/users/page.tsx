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

const ITEMS_PER_PAGE = 10;
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";
type DialogMode = "view" | "edit" | "delete" | "create-admin" | null;

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

function RoleBadge({ role }: { role: UserRole }) {
  return role === "admin" ? (
    <AdminBadge color="gold">Admin</AdminBadge>
  ) : (
    <AdminBadge color="gray">Client</AdminBadge>
  );
}

function UserAvatar({
  user,
  size = "sm",
}: {
  user: AuthUser;
  size?: "sm" | "lg";
}) {
  const dim = size === "lg" ? "w-12 h-12 text-base" : "w-7 h-7 text-[11px]";
  const isAdmin = user.permissions === "admin";
  return (
    <div
      className={`${dim} rounded-full flex items-center justify-center font-bold shrink-0 border`}
      style={
        isAdmin
          ? {
              backgroundColor: "var(--color-accent-bg)",
              borderColor: "var(--color-accent-border)",
              color: "var(--color-brand-accent)",
            }
          : {
              backgroundColor: "var(--color-bg-surface)",
              borderColor: "var(--color-border-default)",
              color: "var(--color-text-disabled)",
            }
      }
    >
      {user.email[0].toUpperCase()}
    </div>
  );
}

function EditUserForm({
  user,
  onSubmit,
  onCancel,
  isLoading,
}: {
  user: AuthUser;
  onSubmit: (email?: string, password?: string) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
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
    if (
      newPassword &&
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(newPassword)
    ) {
      setFormError(
        "Min. 8 caractères, une majuscule, une minuscule, un chiffre.",
      );
      return;
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
        hint="Laisser vide pour ne pas modifier."
      >
        <div className="relative">
          <AdminInput
            type={showPwd ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={isLoading}
            className="pr-10"
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPwd((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: "var(--color-text-disabled)" }}
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              {showPwd ? (
                <path
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <>
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
                </>
              )}
            </svg>
          </button>
        </div>
      </FormField>
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
  const adminCount = users.filter((u) => u.permissions === "admin").length;
  const clientCount = users.filter((u) => u.permissions === "client").length;

  const closeDialog = () => {
    setDialogMode(null);
    setSelected(null);
    setActionError(null);
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

  if (loadError && users.length === 0)
    return <PageError message={loadError} onRetry={load} />;

  const statCards = [
    { key: "all" as const, label: "Total", value: users.length },
    { key: "admin" as const, label: "Admins", value: adminCount },
    { key: "client" as const, label: "Clients", value: clientCount },
  ];

  return (
    <AdminPage>
      <PageHeader
        title="Utilisateurs"
        subtitle={`${users.length} utilisateur${users.length !== 1 ? "s" : ""} · ${adminCount} admin${adminCount !== 1 ? "s" : ""}`}
        actions={
          <Btn
            variant="secondary"
            size="sm"
            loading={isLoading}
            onClick={load}
            icon={<IconRefresh />}
          >
            Actualiser
          </Btn>
        }
      />

      <div className="grid grid-cols-3 gap-3">
        {statCards.map(({ key, label, value }) => {
          const isActive = filterRole === key;
          return (
            <button
              key={key}
              onClick={() => setFilterRole(key)}
              className="flex flex-col gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl border text-left transition-all duration-200"
              style={
                isActive
                  ? {
                      backgroundColor: "var(--color-accent-bg)",
                      borderColor: "var(--color-accent-border-md)",
                    }
                  : {
                      backgroundColor: "var(--color-bg-base)",
                      borderColor: "var(--color-border-default)",
                    }
              }
            >
              <span
                className="text-[10px] uppercase tracking-[0.1em] font-semibold"
                style={{ color: "var(--color-text-disabled)" }}
              >
                {label}
              </span>
              <p
                className="text-xl sm:text-2xl font-bold"
                style={{
                  color: isActive
                    ? "var(--color-brand-accent)"
                    : "var(--color-text-primary)",
                }}
              >
                {value}
              </p>
            </button>
          );
        })}
      </div>

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
            <Th>Rôle</Th>
            <Th right>Actions</Th>
          </THead>
          <TBody>
            {isLoading ? (
              <SkeletonRows cols={3} />
            ) : paginated.length === 0 ? (
              <EmptyRow
                colSpan={3}
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
                      <div className="min-w-0">
                        <p
                          className="text-sm font-medium truncate max-w-[140px] sm:max-w-none"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {u.email}
                        </p>
                        {u.id === currentUser?.id && (
                          <p
                            className="text-[10px]"
                            style={{ color: "var(--color-brand-accent)" }}
                          >
                            Votre compte
                          </p>
                        )}
                      </div>
                    </div>
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
                        Suppr.
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

      <AdminDialog
        open={dialogMode === "view"}
        onClose={closeDialog}
        title="Détails de l'utilisateur"
        size="sm"
      >
        <div className="space-y-4">
          <div
            className="flex items-center gap-4 p-4 rounded-xl border"
            style={{
              backgroundColor: "var(--color-bg-page)",
              borderColor: "var(--color-border-default)",
            }}
          >
            {selected && <UserAvatar user={selected} size="lg" />}
            <div>
              <p
                className="font-semibold"
                style={{ color: "var(--color-text-primary)" }}
              >
                {selected?.email}
              </p>
              <div className="mt-1.5">
                {selected && <RoleBadge role={selected.permissions} />}
              </div>
              {selected?.id === currentUser?.id && (
                <p
                  className="text-[10px] mt-1.5"
                  style={{ color: "var(--color-brand-accent)" }}
                >
                  Votre compte
                </p>
              )}
            </div>
          </div>
          <div
            className="p-4 rounded-xl border"
            style={{
              backgroundColor: "var(--color-bg-page)",
              borderColor: "var(--color-border-default)",
            }}
          >
            <p
              className="text-[10px] uppercase tracking-[0.12em] font-semibold mb-2"
              style={{ color: "var(--color-text-disabled)" }}
            >
              ID
            </p>
            <code
              className="text-xs font-mono break-all"
              style={{ color: "var(--color-text-secondary)" }}
            >
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

      <AdminDialog
        open={dialogMode === "delete"}
        onClose={closeDialog}
        title="Confirmer la suppression"
        description="Cette action est irréversible."
        size="sm"
      >
        {selected && (
          <div
            className="flex items-center gap-3 p-4 rounded-xl border"
            style={{
              backgroundColor: "var(--color-bg-surface)",
              borderColor: "var(--color-border-default)",
            }}
          >
            <UserAvatar user={selected} />
            <div>
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--color-text-primary)" }}
              >
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
