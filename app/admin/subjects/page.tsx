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
  AdminSelect,
  AdminBadge,
  PaginationBar,
  SearchBar,
  InlineError,
  PageError,
} from "@/components/admin/ui";
import { useSubjects, useSeries } from "@/lib/hooks";
import type { SubjectWithCoefficients } from "@/lib/types";

// ---------------------------------------------------------------------------
// Types locaux
// ---------------------------------------------------------------------------

type DialogMode = "create" | "edit" | "view" | "delete" | "export" | null;
const ITEMS_PER_PAGE = 10;

interface SerieCoeffRow {
  serieId: string;
  coefficient: number;
}

// ---------------------------------------------------------------------------
// Helper — normalise seriesCoefficients (objet ou tableau)
// ---------------------------------------------------------------------------

function normalizeCoefficients(
  raw: any,
): Array<{ serieId: string; coefficient: number }> {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  return Object.entries(raw).map(([serieId, coefficient]) => ({
    serieId,
    coefficient: coefficient as number,
  }));
}

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

// ---------------------------------------------------------------------------
// Styles partagés pour les inputs inline
// ---------------------------------------------------------------------------

const inlineSelectStyle: React.CSSProperties = {
  backgroundColor: "var(--color-input-bg)",
  border: "1px solid var(--color-input-border)",
  color: "var(--color-text-primary)",
};

const inlineInputFocus = (
  e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
) => {
  e.currentTarget.style.borderColor = "var(--color-input-border-focus)";
  e.currentTarget.style.boxShadow = "0 0 0 3px var(--color-input-ring)";
};

const inlineInputBlur = (
  e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
) => {
  e.currentTarget.style.borderColor = "var(--color-input-border)";
  e.currentTarget.style.boxShadow = "none";
};

// ---------------------------------------------------------------------------
// Formulaire matière
// ---------------------------------------------------------------------------

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
        setFormError("Chaque ligne doit avoir une série sélectionnée.");
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
      <FormField label="Nom" required>
        <AdminInput
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ex: Mathématiques"
          disabled={isLoading}
        />
      </FormField>

      <div className="space-y-2">
        <div className="flex items-center justify-between mb-2">
          <p
            className="text-xs font-semibold uppercase tracking-[0.1em]"
            style={{ color: "var(--color-text-muted)" }}
          >
            Coefficients par série
          </p>
          <Btn
            type="button"
            variant="secondary"
            size="sm"
            onClick={addRow}
            disabled={isLoading}
            icon={<IconPlus />}
          >
            Ajouter
          </Btn>
        </div>
        {rows.length === 0 ? (
          <p
            className="text-sm italic py-2"
            style={{ color: "var(--color-text-disabled)" }}
          >
            Aucun coefficient défini.
          </p>
        ) : (
          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {rows.map((row, i) => (
              <div key={i} className="flex items-center gap-2">
                <select
                  value={row.serieId}
                  onChange={(e) => updateRow(i, "serieId", e.target.value)}
                  disabled={isLoading}
                  className="flex-1 px-3 py-2 rounded-lg text-sm focus:outline-none transition-all"
                  style={inlineSelectStyle}
                  onFocus={inlineInputFocus}
                  onBlur={inlineInputBlur}
                >
                  <option value="">Série…</option>
                  {serieOptions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code} - {s.description}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  value={row.coefficient}
                  onChange={(e) =>
                    updateRow(i, "coefficient", parseFloat(e.target.value))
                  }
                  disabled={isLoading}
                  className="w-20 px-3 py-2 rounded-lg text-sm text-center focus:outline-none transition-all"
                  style={inlineSelectStyle}
                  onFocus={inlineInputFocus}
                  onBlur={inlineInputBlur}
                />
                <button
                  type="button"
                  onClick={() => removeRow(i)}
                  disabled={isLoading}
                  className="w-7 h-7 flex items-center justify-center rounded-lg transition-all shrink-0"
                  style={{ color: "var(--color-text-disabled)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--color-state-error)";
                    e.currentTarget.style.backgroundColor =
                      "var(--color-state-error-bg)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--color-text-disabled)";
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <IconX />
                </button>
              </div>
            ))}
          </div>
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
          {mode === "create" ? "Créer la matière" : "Enregistrer"}
        </Btn>
      </DialogActions>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Page principale
// ---------------------------------------------------------------------------

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

  const filtered = (subjects ?? []).filter(
    (s) =>
      !searchTerm || s.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

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
      setActionError(err?.message ?? "Erreur.");
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
      setActionError(err?.message ?? "Erreur.");
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
      setActionError(err?.message ?? "Erreur.");
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
      setActionError(err?.message ?? "Erreur export.");
    } finally {
      setIsExporting(false);
    }
  };

  const serieOptions = (series ?? []).map((s) => ({
    id: String(s.id),
    code: s.code,
    description: s.description,
  }));
  const resolveSerieLabel = (serieId: string) =>
    series?.find((s) => String(s.id) === String(serieId))?.code ?? serieId;

  const activeSubject =
    currentSubject?.id === selectedSubject?.id
      ? (currentSubject ?? selectedSubject)
      : selectedSubject;

  if (error) return <PageError message={error.message} onRetry={load} />;

  return (
    <AdminPage>
      <PageHeader
        title="Matières"
        subtitle={`${filtered.length} matière${filtered.length !== 1 ? "s" : ""}`}
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
              Nouvelle matière
            </Btn>
          </>
        }
      />

      <AdminCard
        title="Liste des matières"
        description="Créez, modifiez ou supprimez des matières."
        toolbar={
          <SearchBar
            value={searchInput}
            onChange={(v) => {
              setSearchInput(v);
              if (!v) setSearchTerm("");
            }}
            onSubmit={() => setSearchTerm(searchInput)}
            placeholder="Rechercher une matière…"
          />
        }
      >
        <AdminTable>
          <THead>
            <Th>Nom</Th>
            <Th>Coefficients / Séries</Th>
            <Th right>Actions</Th>
          </THead>
          <TBody>
            {isLoading ? (
              <SkeletonRows cols={3} />
            ) : paginated.length === 0 ? (
              <EmptyRow
                colSpan={3}
                label={
                  searchTerm
                    ? "Aucun résultat pour cette recherche."
                    : "Aucune matière."
                }
                action={
                  !searchTerm ? (
                    <Btn variant="secondary" size="sm" onClick={openCreate}>
                      Créer la première matière
                    </Btn>
                  ) : undefined
                }
              />
            ) : (
              paginated.map((subject) => {
                const coeffs = normalizeCoefficients(
                  (subject as any).seriesCoefficients,
                );
                return (
                  <Tr key={subject.id}>
                    <Td>
                      <span
                        className="font-medium"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {subject.name}
                      </span>
                    </Td>
                    <Td>
                      {coeffs.length === 0 ? (
                        <span
                          className="text-sm"
                          style={{ color: "var(--color-text-disabled)" }}
                        >
                          -
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {coeffs.slice(0, 4).map((c, idx) => (
                            <AdminBadge
                              key={`${c.serieId}-${idx}`}
                              color="gray"
                            >
                              {resolveSerieLabel(c.serieId)} ×{c.coefficient}
                            </AdminBadge>
                          ))}
                          {coeffs.length > 4 && (
                            <AdminBadge color="gray">
                              +{coeffs.length - 4}
                            </AdminBadge>
                          )}
                        </div>
                      )}
                    </Td>
                    <Td right>
                      <div className="flex items-center justify-end gap-1">
                        <Btn
                          variant="ghost"
                          size="sm"
                          onClick={() => openView(subject)}
                        >
                          Voir
                        </Btn>
                        <Btn
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(subject)}
                        >
                          Modifier
                        </Btn>
                        <Btn
                          variant="danger"
                          size="sm"
                          onClick={() => openDelete(subject)}
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
        title="Nouvelle matière"
        description="Remplissez les informations de la matière."
      >
        <SubjectForm
          mode="create"
          serieOptions={serieOptions}
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
        title="Modifier la matière"
      >
        <SubjectForm
          key={selectedSubject?.id}
          mode="edit"
          initial={activeSubject ?? undefined}
          serieOptions={serieOptions}
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
        title="Détails de la matière"
      >
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-5 rounded animate-pulse"
                style={{ backgroundColor: "var(--color-bg-elevated)" }}
              />
            ))}
          </div>
        ) : (
          (() => {
            const s = activeSubject;
            const coeffs = normalizeCoefficients(
              (s as any)?.seriesCoefficients,
            );
            return (
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
                    {s?.name}
                  </p>
                </div>
                <div>
                  <p
                    className="text-[10px] uppercase tracking-[0.12em] font-semibold mb-2"
                    style={{ color: "var(--color-text-disabled)" }}
                  >
                    Coefficients par série
                  </p>
                  {coeffs.length === 0 ? (
                    <p
                      className="text-sm italic"
                      style={{ color: "var(--color-text-disabled)" }}
                    >
                      Aucun coefficient défini.
                    </p>
                  ) : (
                    <div className="space-y-1.5">
                      {coeffs.map((c) => (
                        <div
                          key={c.serieId}
                          className="flex items-center justify-between px-3 py-2 border rounded-lg"
                          style={{
                            backgroundColor: "var(--color-bg-surface)",
                            borderColor: "var(--color-border-default)",
                          }}
                        >
                          <AdminBadge color="gold">
                            {resolveSerieLabel(c.serieId)}
                          </AdminBadge>
                          <span
                            className="text-sm"
                            style={{ color: "var(--color-text-secondary)" }}
                          >
                            coef.{" "}
                            <strong
                              style={{ color: "var(--color-text-primary)" }}
                            >
                              {c.coefficient}
                            </strong>
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
        <DialogActions>
          <Btn variant="ghost" onClick={closeDialog}>
            Fermer
          </Btn>
          <Btn
            variant="secondary"
            onClick={() => selectedSubject && openEdit(selectedSubject)}
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
        description="Cette action est irréversible. Toutes les notes et dépendances seront supprimées."
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
            Matière concernée
          </p>
          <p
            className="font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {selectedSubject?.name}
          </p>
          <p
            className="text-xs"
            style={{ color: "var(--color-text-disabled)" }}
          >
            {
              normalizeCoefficients(
                (selectedSubject as any)?.seriesCoefficients,
              ).length
            }{" "}
            série(s) associée(s)
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
        title="Exporter les matières"
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
            Toutes les matières ({filtered.length}) avec leurs coefficients
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
