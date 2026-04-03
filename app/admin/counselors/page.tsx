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
  AdminTextarea,
  AdminBadge,
  Toggle,
  PaginationBar,
  SearchBar,
  InlineError,
  PageError,
} from "@/components/admin/ui";
import { counselorsApi } from "@/lib/api";
import type {
  Counselor,
  CreateCounselorRequest,
  UpdateCounselorRequest,
} from "@/lib/types";

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

function IconPlus() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none">
      <path
        d="M6 2v8M2 6h8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconX() {
  return (
    <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
      <path
        d="M2 2l8 8M10 2l-8 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

type CounselorDialogMode = "create" | "edit" | "view" | "delete" | null;

function CounselorAvatar({
  counselor,
  size = "sm",
}: {
  counselor: Counselor;
  size?: "sm" | "lg";
}) {
  const dim = size === "lg" ? "w-16 h-16 text-xl" : "w-8 h-8 text-sm";
  if (counselor.photo) {
    return (
      <img
        src={counselor.photo}
        alt={counselor.name}
        className={`${dim} rounded-full object-cover border shrink-0`}
        style={{ borderColor: "var(--color-border-default)" }}
      />
    );
  }
  return (
    <div
      className={`${dim} rounded-full border flex items-center justify-center font-bold shrink-0`}
      style={{
        backgroundColor: "var(--color-bg-surface)",
        borderColor: "var(--color-border-default)",
        color: "var(--color-text-muted)",
      }}
    >
      {counselor.name[0].toUpperCase()}
    </div>
  );
}

function CounselorForm({
  initial,
  onSubmit,
  onCancel,
  isLoading,
  mode,
}: {
  initial?: Partial<Counselor>;
  onSubmit: (
    data: CreateCounselorRequest | UpdateCounselorRequest,
  ) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  mode: "create" | "edit";
}) {
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
    if (s && !specialties.includes(s)) setSpecialties((prev) => [...prev, s]);
    setSpecialtyInput("");
  };

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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <FormField label="Nom complet" required>
            <AdminInput
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: Koffi Mensah"
              disabled={isLoading}
            />
          </FormField>
        </div>
        <FormField label="Email" required>
          <AdminInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="conseiller@example.com"
            disabled={isLoading}
          />
        </FormField>
        <FormField label="Téléphone">
          <AdminInput
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+228 90 12 34 56"
            disabled={isLoading}
          />
        </FormField>
        <div className="sm:col-span-2">
          <FormField label="URL Photo">
            <AdminInput
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
              placeholder="https://…"
              disabled={isLoading}
            />
          </FormField>
        </div>
        <div className="sm:col-span-2">
          <FormField label="Biographie">
            <AdminTextarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Présentation du conseiller…"
              disabled={isLoading}
            />
          </FormField>
        </div>
      </div>

      <div className="space-y-2">
        <p
          className="text-xs font-semibold uppercase tracking-[0.1em]"
          style={{ color: "var(--color-text-muted)" }}
        >
          Spécialités
        </p>
        <div className="flex gap-2">
          <AdminInput
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
          <Btn
            type="button"
            variant="secondary"
            size="sm"
            onClick={addSpecialty}
            disabled={isLoading || !specialtyInput.trim()}
            icon={<IconPlus />}
          >
            Ajouter
          </Btn>
        </div>
        {specialties.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {specialties.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border rounded-lg"
                style={{
                  backgroundColor: "var(--color-bg-surface)",
                  borderColor: "var(--color-border-default)",
                  color: "var(--color-text-secondary)",
                }}
              >
                {s}
                <button
                  type="button"
                  onClick={() =>
                    setSpecialties((prev) => prev.filter((x) => x !== s))
                  }
                  className="transition-colors"
                  style={{ color: "var(--color-text-disabled)" }}
                >
                  <IconX />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <Toggle
        checked={isActive}
        onChange={setIsActive}
        label="Conseiller actif"
        disabled={isLoading}
      />
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
          {mode === "create" ? "Créer le conseiller" : "Enregistrer"}
        </Btn>
      </DialogActions>
    </form>
  );
}

export default function CounselorsAdminPage() {
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogMode, setDialogMode] = useState<CounselorDialogMode>(null);
  const [selected, setSelected] = useState<Counselor | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 10;

  const load = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const res = await counselorsApi.getAllAdmin();
      setCounselors(res.counselors ?? []);
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
  }, [searchTerm, filterActive]);

  const filtered = counselors.filter((c) => {
    const matchSearch =
      !searchTerm ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone ?? "").includes(searchTerm) ||
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
  const activeCount = counselors.filter((c) => c.isActive).length;

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
      setLoadError(err?.message ?? "Erreur lors du changement de statut.");
    }
  };

  if (loadError && counselors.length === 0)
    return <PageError message={loadError} onRetry={load} />;

  return (
    <AdminPage>
      <PageHeader
        title="Conseillers"
        subtitle={`${counselors.length} conseiller${counselors.length !== 1 ? "s" : ""} · ${activeCount} actif${activeCount !== 1 ? "s" : ""}`}
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
            <Btn
              variant="primary"
              size="sm"
              onClick={openCreate}
              icon={<IconPlus />}
            >
              Nouveau
            </Btn>
          </>
        }
      />

      <AdminCard
        title="Liste des conseillers"
        toolbar={
          <div className="flex items-center gap-2 flex-wrap">
            <div
              className="flex rounded-lg border overflow-hidden text-xs"
              style={{ borderColor: "var(--color-border-default)" }}
            >
              {(["all", "active", "inactive"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterActive(f)}
                  className="px-3 py-2 font-medium transition-all"
                  style={
                    filterActive === f
                      ? {
                          backgroundColor: "var(--color-accent-bg)",
                          color: "var(--color-brand-accent)",
                        }
                      : {
                          backgroundColor: "var(--color-bg-base)",
                          color: "var(--color-text-disabled)",
                        }
                  }
                >
                  {f === "all"
                    ? "Tous"
                    : f === "active"
                      ? "Actifs"
                      : "Inactifs"}
                </button>
              ))}
            </div>
            <SearchBar
              value={searchInput}
              onChange={(v) => {
                setSearchInput(v);
                if (!v) setSearchTerm("");
              }}
              onSubmit={() => setSearchTerm(searchInput)}
              placeholder="Nom, email, téléphone…"
            />
          </div>
        }
      >
        <AdminTable>
          <THead>
            <Th>Photo</Th>
            <Th>Nom</Th>
            <Th>Email</Th>
            <Th>Téléphone</Th>
            <Th>Spécialités</Th>
            <Th>Statut</Th>
            <Th right>Actions</Th>
          </THead>
          <TBody>
            {isLoading ? (
              <SkeletonRows cols={7} />
            ) : paginated.length === 0 ? (
              <EmptyRow
                colSpan={7}
                label={
                  searchTerm || filterActive !== "all"
                    ? "Aucun résultat."
                    : "Aucun conseiller."
                }
                action={
                  !searchTerm && filterActive === "all" ? (
                    <Btn
                      variant="secondary"
                      size="sm"
                      onClick={openCreate}
                      icon={<IconPlus />}
                    >
                      Créer le premier conseiller
                    </Btn>
                  ) : undefined
                }
              />
            ) : (
              paginated.map((c) => (
                <Tr key={c.id} className={!c.isActive ? "opacity-50" : ""}>
                  {/* Photo */}
                  <Td>
                    <CounselorAvatar counselor={c} />
                  </Td>
                  {/* Nom */}
                  <Td>
                    <div className="min-w-0">
                      <p
                        className="text-sm font-medium truncate max-w-[120px]"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {c.name}
                      </p>
                      {c.bio && (
                        <p
                          className="text-xs truncate max-w-[120px]"
                          style={{ color: "var(--color-text-disabled)" }}
                        >
                          {c.bio}
                        </p>
                      )}
                    </div>
                  </Td>
                  {/* Email */}
                  <Td>
                    <a
                      href={`mailto:${c.email}`}
                      className="text-xs transition-colors"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {c.email}
                    </a>
                  </Td>
                  {/* Téléphone */}
                  <Td>
                    {c.phone ? (
                      <span
                        className="text-xs"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {c.phone}
                      </span>
                    ) : (
                      <span
                        className="text-xs"
                        style={{ color: "var(--color-text-disabled)" }}
                      >
                        -
                      </span>
                    )}
                  </Td>
                  {/* Spécialités */}
                  <Td>
                    <div className="flex flex-wrap gap-1">
                      {(c.specialties ?? []).length === 0 ? (
                        <span
                          className="text-xs"
                          style={{ color: "var(--color-text-disabled)" }}
                        >
                          -
                        </span>
                      ) : (
                        <>
                          {(c.specialties ?? []).slice(0, 2).map((s) => (
                            <AdminBadge key={s} color="gray">
                              {s}
                            </AdminBadge>
                          ))}
                          {(c.specialties ?? []).length > 2 && (
                            <AdminBadge color="gray">
                              +{(c.specialties ?? []).length - 2}
                            </AdminBadge>
                          )}
                        </>
                      )}
                    </div>
                  </Td>
                  {/* Statut */}
                  <Td>
                    {c.isActive ? (
                      <AdminBadge color="green">Actif</AdminBadge>
                    ) : (
                      <AdminBadge color="gray">Inactif</AdminBadge>
                    )}
                  </Td>
                  {/* Actions */}
                  <Td right>
                    <div className="flex items-center justify-end gap-1 flex-wrap">
                      <Btn
                        variant="ghost"
                        size="sm"
                        onClick={() => openView(c)}
                      >
                        Voir
                      </Btn>
                      <Btn
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(c)}
                      >
                        Modifier
                      </Btn>
                      <Btn
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleActive(c)}
                      >
                        {c.isActive ? "Désactiver" : "Activer"}
                      </Btn>
                      <Btn
                        variant="danger"
                        size="sm"
                        onClick={() => openDelete(c)}
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

      {/* ── Dialog Création ── */}
      <AdminDialog
        open={dialogMode === "create"}
        onClose={closeDialog}
        size="md"
        title="Nouveau conseiller"
        description="Nom et email sont obligatoires."
      >
        <CounselorForm
          mode="create"
          onSubmit={handleCreate}
          onCancel={closeDialog}
          isLoading={actionLoading}
        />
        <InlineError message={actionError} />
      </AdminDialog>

      {/* ── Dialog Édition ── */}
      <AdminDialog
        open={dialogMode === "edit"}
        onClose={closeDialog}
        size="md"
        title="Modifier le conseiller"
      >
        <CounselorForm
          key={selected?.id}
          mode="edit"
          initial={selected ?? undefined}
          onSubmit={handleUpdate}
          onCancel={closeDialog}
          isLoading={actionLoading}
        />
        <InlineError message={actionError} />
      </AdminDialog>

      {/* ── Dialog Vue ── */}
      <AdminDialog
        open={dialogMode === "view"}
        onClose={closeDialog}
        title="Détails du conseiller"
        size="md"
      >
        {selected && (
          <div className="space-y-5">
            <div
              className="flex items-center gap-4 p-4 rounded-xl border"
              style={{
                backgroundColor: "var(--color-bg-page)",
                borderColor: "var(--color-border-default)",
              }}
            >
              <CounselorAvatar counselor={selected} size="lg" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p
                    className="font-semibold text-lg"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {selected.name}
                  </p>
                  {selected.isActive ? (
                    <AdminBadge color="green">Actif</AdminBadge>
                  ) : (
                    <AdminBadge color="gray">Inactif</AdminBadge>
                  )}
                </div>
                <p
                  className="text-xs mt-1"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {selected.email}
                </p>
                {selected.phone && (
                  <p
                    className="text-xs"
                    style={{ color: "var(--color-text-disabled)" }}
                  >
                    {selected.phone}
                  </p>
                )}
              </div>
            </div>

            {selected.bio && (
              <div>
                <p
                  className="text-[10px] uppercase tracking-[0.12em] font-semibold mb-1"
                  style={{ color: "var(--color-text-disabled)" }}
                >
                  Biographie
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {selected.bio}
                </p>
              </div>
            )}

            {(selected.specialties ?? []).length > 0 && (
              <div>
                <p
                  className="text-[10px] uppercase tracking-[0.12em] font-semibold mb-2"
                  style={{ color: "var(--color-text-disabled)" }}
                >
                  Spécialités
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(selected.specialties ?? []).map((s) => (
                    <AdminBadge key={s} color="gold">
                      {s}
                    </AdminBadge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        <DialogActions>
          <Btn variant="ghost" onClick={closeDialog}>
            Fermer
          </Btn>
          <Btn
            variant="secondary"
            onClick={() => selected && openEdit(selected)}
          >
            Modifier
          </Btn>
        </DialogActions>
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
          <div
            className="flex items-center gap-3 p-4 rounded-xl border"
            style={{
              backgroundColor: "var(--color-bg-surface)",
              borderColor: "var(--color-border-default)",
            }}
          >
            <CounselorAvatar counselor={selected} />
            <div>
              <p
                className="font-semibold"
                style={{ color: "var(--color-text-primary)" }}
              >
                {selected.name}
              </p>
              <p
                className="text-xs"
                style={{ color: "var(--color-text-muted)" }}
              >
                {selected.email}
              </p>
              {selected.phone && (
                <p
                  className="text-xs"
                  style={{ color: "var(--color-text-disabled)" }}
                >
                  {selected.phone}
                </p>
              )}
            </div>
          </div>
        )}
        <InlineError message={actionError} />
        <DialogActions>
          <Btn variant="ghost" onClick={closeDialog} disabled={actionLoading}>
            Annuler
          </Btn>
          <Btn variant="danger" onClick={handleDelete} loading={actionLoading}>
            Supprimer définitivement
          </Btn>
        </DialogActions>
      </AdminDialog>
    </AdminPage>
  );
}
