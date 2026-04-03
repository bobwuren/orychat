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
  AdminSelect,
  AdminBadge,
  Toggle,
  PaginationBar,
  SearchBar,
  InlineError,
  PageError,
} from "@/components/admin/ui";
import { useUniversities, useDegrees } from "@/lib/hooks";
import type { University, Degree } from "@/lib/types";

type DialogMode = "create" | "edit" | "view" | "delete" | "export" | null;
type SponsorFilter = "all" | "sponsors" | "non-sponsors";
const ITEMS_PER_PAGE = 10;

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

function IconDownload() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 2v9M5 8l3 3 3-3M3 13h10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
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

function IconExternal() {
  return (
    <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
      <path
        d="M7 1h4v4M11 1L6 6M5 2H2a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Formulaire université — formations sélectionnées depuis la liste des diplômes
// ---------------------------------------------------------------------------

interface UniversityFormProps {
  initial?: Partial<University>;
  availableDegrees: Degree[];
  onSubmit: (data: {
    name: string;
    webSite?: string;
    description?: string;
    isSponsor: boolean;
    degreeIds: string[];
  }) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  mode: "create" | "edit";
}

function UniversityForm({
  initial,
  availableDegrees,
  onSubmit,
  onCancel,
  isLoading,
  mode,
}: UniversityFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [webSite, setWebSite] = useState(
    initial?.webSite ?? (initial as any)?.website ?? "",
  );
  const [description, setDescription] = useState(initial?.description ?? "");
  const [isSponsor, setIsSponsor] = useState(initial?.isSponsor ?? false);

  // Initialise les IDs depuis les formations déjà associées à l'université
  const [selectedDegreeIds, setSelectedDegreeIds] = useState<string[]>(() =>
    (initial?.degrees ?? []).map((d: any) => String(d.id)),
  );

  const [formError, setFormError] = useState<string | null>(null);

  const toggleDegree = (id: string) => {
    setSelectedDegreeIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!name.trim()) {
      setFormError("Le nom est obligatoire.");
      return;
    }
    if (mode === "create" && selectedDegreeIds.length === 0) {
      setFormError("Au moins une formation est requise.");
      return;
    }
    try {
      await onSubmit({
        name: name.trim(),
        webSite: webSite.trim() || undefined,
        description: description.trim() || undefined,
        isSponsor,
        degreeIds: selectedDegreeIds,
      });
    } catch (err: any) {
      setFormError(err?.message ?? "Une erreur est survenue.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Nom" required>
        <AdminInput
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ex: Université de Lomé"
          disabled={isLoading}
        />
      </FormField>
      <FormField label="Site web">
        <AdminInput
          value={webSite}
          onChange={(e) => setWebSite(e.target.value)}
          placeholder="https://…"
          type="url"
          disabled={isLoading}
        />
      </FormField>
      <FormField label="Description">
        <AdminTextarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          disabled={isLoading}
        />
      </FormField>
      <Toggle
        checked={isSponsor}
        onChange={setIsSponsor}
        label="Université sponsor"
        disabled={isLoading}
      />

      {/* Sélection des formations depuis le catalogue de diplômes */}
      <div className="space-y-2">
        <p
          className="text-xs font-semibold uppercase tracking-[0.1em]"
          style={{ color: "var(--color-text-muted)" }}
        >
          Formations{" "}
          {mode === "create" && (
            <span style={{ color: "var(--color-brand-accent)" }}>*</span>
          )}
        </p>

        {availableDegrees.length === 0 ? (
          <p
            className="text-sm italic py-2"
            style={{ color: "var(--color-text-disabled)" }}
          >
            Aucun diplôme disponible dans le catalogue.
          </p>
        ) : (
          <div
            className="max-h-48 overflow-y-auto space-y-1.5 pr-1 border rounded-xl p-3"
            style={{
              backgroundColor: "var(--color-bg-page)",
              borderColor: "var(--color-border-default)",
            }}
          >
            {availableDegrees.map((degree) => {
              const isSelected = selectedDegreeIds.includes(String(degree.id));
              return (
                <button
                  key={degree.id}
                  type="button"
                  onClick={() => toggleDegree(String(degree.id))}
                  disabled={isLoading}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all"
                  style={
                    isSelected
                      ? {
                          backgroundColor: "var(--color-accent-bg)",
                          border: "1px solid var(--color-accent-border-md)",
                        }
                      : {
                          backgroundColor: "var(--color-bg-base)",
                          border: "1px solid var(--color-border-default)",
                        }
                  }
                >
                  {/* Checkbox visuelle */}
                  <span
                    className="w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all"
                    style={
                      isSelected
                        ? {
                            backgroundColor: "var(--color-brand-accent)",
                            borderColor: "var(--color-brand-accent)",
                          }
                        : {
                            borderColor: "var(--color-border-strong)",
                          }
                    }
                  >
                    {isSelected && (
                      <svg
                        className="w-2.5 h-2.5"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <path
                          d="M2 5l2.5 2.5L8 3"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className="text-sm font-medium truncate"
                      style={{
                        color: isSelected
                          ? "var(--color-brand-accent)"
                          : "var(--color-text-primary)",
                      }}
                    >
                      {degree.name}
                    </p>
                    {degree.description && (
                      <p
                        className="text-xs truncate"
                        style={{ color: "var(--color-text-disabled)" }}
                      >
                        {degree.description}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {selectedDegreeIds.length > 0 && (
          <p
            className="text-xs"
            style={{ color: "var(--color-text-disabled)" }}
          >
            {selectedDegreeIds.length} formation
            {selectedDegreeIds.length > 1 ? "s" : ""} sélectionnée
            {selectedDegreeIds.length > 1 ? "s" : ""}
          </p>
        )}
      </div>

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
          {mode === "create" ? "Créer l'université" : "Enregistrer"}
        </Btn>
      </DialogActions>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Page principale
// ---------------------------------------------------------------------------

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
  const [filterSponsor, setFilterSponsor] = useState<SponsorFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedUniversity, setSelectedUniversity] =
    useState<University | null>(null);
  const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv");
  const [isExporting, setIsExporting] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(() => {
    fetchUniversities();
  }, [fetchUniversities]);

  useEffect(() => {
    load();
    fetchDegrees();
  }, [load, fetchDegrees]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterSponsor]);

  const filtered = (universities ?? []).filter((u) => {
    const matchSearch =
      !searchTerm || u.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSponsor =
      filterSponsor === "all" ||
      (filterSponsor === "sponsors" && u.isSponsor) ||
      (filterSponsor === "non-sponsors" && !u.isSponsor);
    return matchSearch && matchSponsor;
  });

  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const sponsorCount = (universities ?? []).filter((u) => u.isSponsor).length;

  const closeDialog = () => {
    setDialogMode(null);
    setSelectedUniversity(null);
    setActionError(null);
  };

  const openCreate = () => {
    setSelectedUniversity(null);
    setActionError(null);
    setDialogMode("create");
  };

  const openEdit = async (u: University) => {
    setActionError(null);
    setSelectedUniversity(u);
    setDialogMode("edit");
    await fetchUniversityById(u.id);
  };

  const openView = async (u: University) => {
    setActionError(null);
    setSelectedUniversity(u);
    setDialogMode("view");
    await fetchUniversityById(u.id);
  };

  const openDelete = (u: University) => {
    setActionError(null);
    setSelectedUniversity(u);
    setDialogMode("delete");
  };

  const handleCreate = async (data: any) => {
    setActionLoading(true);
    setActionError(null);
    try {
      await createUniversity(data);
      closeDialog();
    } catch (err: any) {
      setActionError(err?.message ?? "Erreur.");
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (data: any) => {
    if (!selectedUniversity) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await updateUniversity(selectedUniversity.id, data);
      closeDialog();
    } catch (err: any) {
      setActionError(err?.message ?? "Erreur.");
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUniversity) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await deleteUniversity(selectedUniversity.id);
      closeDialog();
    } catch (err: any) {
      setActionError(err?.message ?? "Erreur.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    setActionError(null);
    try {
      await exportUniversities({ format: exportFormat });
      closeDialog();
    } catch (err: any) {
      setActionError(err?.message ?? "Erreur export.");
    } finally {
      setIsExporting(false);
    }
  };

  const activeUniversity =
    currentUniversity?.id === selectedUniversity?.id
      ? (currentUniversity ?? selectedUniversity)
      : selectedUniversity;

  if (error) return <PageError message={error.message} onRetry={load} />;

  return (
    <AdminPage>
      <PageHeader
        title="Universités"
        subtitle={`${filtered.length} université${filtered.length !== 1 ? "s" : ""} · ${sponsorCount} sponsor${sponsorCount !== 1 ? "s" : ""}`}
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
              variant="secondary"
              size="sm"
              onClick={() => setDialogMode("export")}
              icon={<IconDownload />}
            >
              Exporter
            </Btn>
            <Btn
              variant="primary"
              size="sm"
              onClick={openCreate}
              icon={<IconPlus />}
            >
              Nouvelle université
            </Btn>
          </>
        }
      />

      <AdminCard
        title="Liste des universités"
        description="Créez, modifiez ou supprimez des universités."
        toolbar={
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={filterSponsor}
              onChange={(e) =>
                setFilterSponsor(e.target.value as SponsorFilter)
              }
              className="px-3 py-2 rounded-lg text-sm focus:outline-none transition-all"
              style={{
                backgroundColor: "var(--color-input-bg)",
                border: "1px solid var(--color-input-border)",
                color: "var(--color-text-primary)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor =
                  "var(--color-input-border-focus)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--color-input-border)";
              }}
            >
              <option value="all">Toutes</option>
              <option value="sponsors">Sponsors</option>
              <option value="non-sponsors">Non-sponsors</option>
            </select>
            <SearchBar
              value={searchInput}
              onChange={(v) => {
                setSearchInput(v);
                if (!v) setSearchTerm("");
              }}
              onSubmit={() => setSearchTerm(searchInput)}
              placeholder="Rechercher…"
            />
          </div>
        }
      >
        <AdminTable>
          <THead>
            <Th>Nom</Th>
            <Th>Formations</Th>
            <Th>Site web</Th>
            <Th>Sponsor</Th>
            <Th right>Actions</Th>
          </THead>
          <TBody>
            {isLoading ? (
              <SkeletonRows cols={5} />
            ) : paginated.length === 0 ? (
              <EmptyRow
                colSpan={5}
                label={
                  searchTerm || filterSponsor !== "all"
                    ? "Aucun résultat pour ces filtres."
                    : "Aucune université."
                }
                action={
                  !searchTerm && filterSponsor === "all" ? (
                    <Btn variant="secondary" size="sm" onClick={openCreate}>
                      Créer la première université
                    </Btn>
                  ) : undefined
                }
              />
            ) : (
              paginated.map((university) => {
                const site =
                  (university as any).webSite ?? (university as any).website;
                return (
                  <Tr key={university.id}>
                    <Td>
                      <span
                        className="font-medium"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {university.name}
                      </span>
                    </Td>
                    <Td>
                      {(university.degrees?.length ?? 0) === 0 ? (
                        <span
                          className="text-sm"
                          style={{ color: "var(--color-text-disabled)" }}
                        >
                          -
                        </span>
                      ) : (
                        <AdminBadge color="gray">
                          {university.degrees?.length} formation
                          {(university.degrees?.length ?? 0) > 1 ? "s" : ""}
                        </AdminBadge>
                      )}
                    </Td>
                    <Td>
                      {site ? (
                        <a
                          href={site}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm transition-colors"
                          style={{ color: "var(--color-brand-accent)" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          Site web <IconExternal />
                        </a>
                      ) : (
                        <span
                          className="text-sm"
                          style={{ color: "var(--color-text-disabled)" }}
                        >
                          -
                        </span>
                      )}
                    </Td>
                    <Td>
                      {university.isSponsor ? (
                        <AdminBadge color="gold">Sponsor</AdminBadge>
                      ) : (
                        <AdminBadge color="gray">Standard</AdminBadge>
                      )}
                    </Td>
                    <Td right>
                      <div className="flex items-center justify-end gap-1">
                        <Btn
                          variant="ghost"
                          size="sm"
                          onClick={() => openView(university)}
                        >
                          Voir
                        </Btn>
                        <Btn
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(university)}
                        >
                          Modifier
                        </Btn>
                        <Btn
                          variant="danger"
                          size="sm"
                          onClick={() => openDelete(university)}
                        >
                          Suppr.
                        </Btn>
                      </div>
                    </Td>
                  </Tr>
                );
              })
            )}
          </TBody>
        </AdminTable>
        <PaginationBar
          currentPage={currentPage}
          totalPages={Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))}
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
        title="Nouvelle université"
        description="Au moins une formation est requise."
      >
        <UniversityForm
          mode="create"
          availableDegrees={availableDegrees ?? []}
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
        title="Modifier l'université"
      >
        <UniversityForm
          key={selectedUniversity?.id}
          mode="edit"
          initial={activeUniversity ?? undefined}
          availableDegrees={availableDegrees ?? []}
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
        title="Détails de l'université"
        size="md"
      >
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-5 rounded animate-pulse"
                style={{ backgroundColor: "var(--color-bg-elevated)" }}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.12em] font-semibold mb-1"
                style={{ color: "var(--color-text-disabled)" }}
              >
                Nom
              </p>
              <p
                className="font-semibold text-lg"
                style={{ color: "var(--color-text-primary)" }}
              >
                {activeUniversity?.name}
              </p>
            </div>
            {activeUniversity?.description && (
              <div>
                <p
                  className="text-[10px] uppercase tracking-[0.12em] font-semibold mb-1"
                  style={{ color: "var(--color-text-disabled)" }}
                >
                  Description
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {activeUniversity.description}
                </p>
              </div>
            )}
            <div className="flex items-center gap-6 flex-wrap">
              <div>
                <p
                  className="text-[10px] uppercase tracking-[0.12em] font-semibold mb-1"
                  style={{ color: "var(--color-text-disabled)" }}
                >
                  Statut
                </p>
                {activeUniversity?.isSponsor ? (
                  <AdminBadge color="gold">Sponsor</AdminBadge>
                ) : (
                  <AdminBadge color="gray">Standard</AdminBadge>
                )}
              </div>
              {((activeUniversity as any)?.webSite ||
                (activeUniversity as any)?.website) && (
                <div>
                  <p
                    className="text-[10px] uppercase tracking-[0.12em] font-semibold mb-1"
                    style={{ color: "var(--color-text-disabled)" }}
                  >
                    Site web
                  </p>
                  <a
                    href={
                      (activeUniversity as any).webSite ??
                      (activeUniversity as any).website
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm transition-colors"
                    style={{ color: "var(--color-brand-accent)" }}
                  >
                    Visiter <IconExternal />
                  </a>
                </div>
              )}
            </div>
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.12em] font-semibold mb-2"
                style={{ color: "var(--color-text-disabled)" }}
              >
                Formations ({activeUniversity?.degrees?.length ?? 0})
              </p>
              {(activeUniversity?.degrees?.length ?? 0) === 0 ? (
                <p
                  className="text-sm italic"
                  style={{ color: "var(--color-text-disabled)" }}
                >
                  Aucune formation.
                </p>
              ) : (
                <div className="space-y-1.5 max-h-52 overflow-y-auto">
                  {activeUniversity?.degrees?.map((d: any) => (
                    <div
                      key={d.id}
                      className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm"
                      style={{
                        backgroundColor: "var(--color-bg-surface)",
                        borderColor: "var(--color-border-default)",
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      <svg
                        className="w-3.5 h-3.5 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        style={{ color: "var(--color-text-disabled)" }}
                      >
                        <path
                          d="M4 10.5v9.75a.75.75 0 00.75.75h4.5a.75.75 0 00.75-.75V15a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v5.25a.75.75 0 00.75.75h4.5a.75.75 0 00.75-.75V10.5M12 3L2.25 10.5M21.75 10.5L12 3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {d.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        <DialogActions>
          <Btn variant="ghost" onClick={closeDialog}>
            Fermer
          </Btn>
          <Btn
            variant="secondary"
            onClick={() => selectedUniversity && openEdit(selectedUniversity)}
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
        description="Cette action est irréversible. L'université et toutes ses associations seront supprimées."
        size="sm"
      >
        <div
          className="p-4 border rounded-xl mb-2 space-y-1"
          style={{
            backgroundColor: "var(--color-bg-surface)",
            borderColor: "var(--color-border-default)",
          }}
        >
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            Université concernée
          </p>
          <p
            className="font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {selectedUniversity?.name}
          </p>
          <p
            className="text-xs"
            style={{ color: "var(--color-text-disabled)" }}
          >
            {selectedUniversity?.degrees?.length ?? 0} formation(s) ·{" "}
            {selectedUniversity?.isSponsor ? "Sponsor" : "Standard"}
          </p>
        </div>
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

      {/* ── Dialog Export ── */}
      <AdminDialog
        open={dialogMode === "export"}
        onClose={closeDialog}
        title="Exporter les universités"
        size="sm"
      >
        <div className="space-y-4">
          <FormField label="Format">
            <AdminSelect
              value={exportFormat}
              onChange={(e) =>
                setExportFormat(e.target.value as "csv" | "json")
              }
              options={[
                { value: "csv", label: "CSV (Excel)" },
                { value: "json", label: "JSON" },
              ]}
            />
          </FormField>
          <p
            className="text-xs px-4 py-3 border rounded-lg"
            style={{
              color: "var(--color-text-disabled)",
              backgroundColor: "var(--color-bg-surface)",
              borderColor: "var(--color-border-default)",
            }}
          >
            Toutes les universités ({filtered.length}) avec leurs formations
            seront incluses.
          </p>
        </div>
        <InlineError message={actionError} />
        <DialogActions>
          <Btn variant="ghost" onClick={closeDialog} disabled={isExporting}>
            Annuler
          </Btn>
          <Btn variant="primary" onClick={handleExport} loading={isExporting}>
            Exporter
          </Btn>
        </DialogActions>
      </AdminDialog>
    </AdminPage>
  );
}
