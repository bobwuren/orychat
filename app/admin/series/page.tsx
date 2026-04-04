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
  PaginationBar,
  SearchBar,
  InlineError,
  PageError,
} from "@/components/admin/ui";
import { useSeries, useSubjects } from "@/lib/hooks";
import type { Serie } from "@/lib/types";

type DialogMode = "create" | "edit" | "view" | "delete" | "export" | null;
const ITEMS_PER_PAGE = 10;

interface SubjectRow {
  subjectId: string;
  coefficient: number;
}

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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Code" required hint="Ex : A, C, D, G1">
          <AdminInput
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="ex: A"
            disabled={isLoading}
            required
          />
        </FormField>
        <div className="sm:col-span-2">
          <FormField
            label="Description"
            required
            hint="Intitulé complet de la série"
          >
            <AdminTextarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ex: Sciences de la Vie et de la Terre"
              rows={2}
              disabled={isLoading}
            />
          </FormField>
        </div>
      </div>

      {/* Matières */}
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-1">
          <p
            className="text-xs font-semibold uppercase tracking-[0.1em]"
            style={{ color: "var(--color-text-muted)" }}
          >
            Matières{" "}
            <span
              className="font-normal normal-case tracking-normal"
              style={{ color: "var(--color-text-disabled)" }}
            >
              (optionnel)
            </span>
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
            Aucune matière associée.
          </p>
        ) : (
          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {rows.map((row, i) => (
              <div key={i} className="flex items-center gap-2">
                <select
                  value={row.subjectId}
                  onChange={(e) => updateRow(i, "subjectId", e.target.value)}
                  disabled={isLoading}
                  className="flex-1 px-3 py-2 rounded-lg text-sm focus:outline-none transition-all"
                  style={inlineSelectStyle}
                  onFocus={inlineInputFocus}
                  onBlur={inlineInputBlur}
                >
                  <option value="">Matière…</option>
                  {subjectOptions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={0}
                  step={1}
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
          {mode === "create" ? "Créer la série" : "Enregistrer"}
        </Btn>
      </DialogActions>
    </form>
  );
}

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

  const filtered = (series ?? []).filter(
    (s) =>
      !searchTerm ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

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
      setActionError(err?.message ?? "Erreur.");
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
      setActionError(err?.message ?? "Erreur.");
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
      setActionError(err?.message ?? "Erreur.");
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
      setActionError(err?.message ?? "Erreur export.");
    } finally {
      setIsExporting(false);
    }
  };

  const subjectOptions = (subjects ?? []).map((s) => ({
    id: String(s.id),
    name: s.name,
  }));
  const resolveSubjectName = (subjectId: string) =>
    subjects?.find((s) => String(s.id) === String(subjectId))?.name ??
    subjectId;
  const activeSerie =
    currentSerie?.id === selectedSerie?.id
      ? (currentSerie ?? selectedSerie)
      : selectedSerie;

  if (error) return <PageError message={error.message} onRetry={load} />;

  return (
    <AdminPage>
      <PageHeader
        title="Séries"
        subtitle={`${filtered.length} série${filtered.length !== 1 ? "s" : ""}`}
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
              Nouvelle série
            </Btn>
          </>
        }
      />

      <AdminCard
        title="Liste des séries"
        description="Créez, modifiez ou supprimez des séries académiques."
        toolbar={
          <SearchBar
            value={searchInput}
            onChange={(v) => {
              setSearchInput(v);
              if (!v) setSearchTerm("");
            }}
            onSubmit={() => setSearchTerm(searchInput)}
            placeholder="Code ou description…"
          />
        }
      >
        <AdminTable>
          <THead>
            <Th>Code</Th>
            <Th>Description</Th>
            <Th>Matières</Th>
            <Th right>Actions</Th>
          </THead>
          <TBody>
            {isLoading ? (
              <SkeletonRows cols={4} />
            ) : paginated.length === 0 ? (
              <EmptyRow
                colSpan={4}
                label={searchTerm ? "Aucun résultat." : "Aucune série."}
                action={
                  !searchTerm ? (
                    <Btn variant="secondary" size="sm" onClick={openCreate}>
                      Créer la première série
                    </Btn>
                  ) : undefined
                }
              />
            ) : (
              paginated.map((serie) => (
                <Tr key={serie.id}>
                  <Td>
                    <AdminBadge color="gold">{serie.code}</AdminBadge>
                  </Td>
                  <Td>
                    <span
                      className="block max-w-xs truncate"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {serie.description}
                    </span>
                  </Td>
                  <Td>
                    {(serie.subjects?.length ?? 0) === 0 ? (
                      <span
                        className="text-sm"
                        style={{ color: "var(--color-text-disabled)" }}
                      >
                        -
                      </span>
                    ) : (
                      <AdminBadge color="gray">
                        {serie.subjects?.length} matière
                        {(serie.subjects?.length ?? 0) > 1 ? "s" : ""}
                      </AdminBadge>
                    )}
                  </Td>
                  <Td right>
                    <div className="flex items-center justify-end gap-1">
                      <Btn
                        variant="ghost"
                        size="sm"
                        onClick={() => openView(serie)}
                      >
                        Voir
                      </Btn>
                      <Btn
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(serie)}
                      >
                        Modifier
                      </Btn>
                      <Btn
                        variant="danger"
                        size="sm"
                        onClick={() => openDelete(serie)}
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
          totalPages={Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))}
          totalItems={filtered.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </AdminCard>

      <AdminDialog
        open={dialogMode === "create"}
        onClose={closeDialog}
        size="md"
        title="Nouvelle série"
        description="Code et description sont obligatoires."
      >
        <SerieForm
          mode="create"
          subjectOptions={subjectOptions}
          onSubmit={handleCreate}
          onCancel={closeDialog}
          isLoading={actionLoading}
        />
        <InlineError message={actionError} />
      </AdminDialog>

      <AdminDialog
        open={dialogMode === "edit"}
        onClose={closeDialog}
        size="md"
        title="Modifier la série"
      >
        <SerieForm
          key={selectedSerie?.id}
          mode="edit"
          initial={activeSerie ?? undefined}
          subjectOptions={subjectOptions}
          onSubmit={handleUpdate}
          onCancel={closeDialog}
          isLoading={actionLoading}
        />
        <InlineError message={actionError} />
      </AdminDialog>

      <AdminDialog
        open={dialogMode === "view"}
        onClose={closeDialog}
        title="Détails de la série"
        size="md"
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
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <AdminBadge color="gold">{activeSerie?.code}</AdminBadge>
            </div>
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.12em] font-semibold mb-1"
                style={{ color: "var(--color-text-disabled)" }}
              >
                Description
              </p>
              <p
                className="text-sm"
                style={{ color: "var(--color-text-primary)" }}
              >
                {activeSerie?.description}
              </p>
            </div>
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.12em] font-semibold mb-2"
                style={{ color: "var(--color-text-disabled)" }}
              >
                Matières ({activeSerie?.subjects?.length ?? 0})
              </p>
              {(activeSerie?.subjects?.length ?? 0) === 0 ? (
                <p
                  className="text-sm italic"
                  style={{ color: "var(--color-text-disabled)" }}
                >
                  Aucune matière associée.
                </p>
              ) : (
                <div className="space-y-1.5 max-h-52 overflow-y-auto">
                  {activeSerie?.subjects?.map((s: any) => (
                    <div
                      key={s.id ?? s.subjectId}
                      className="flex items-center justify-between px-3 py-2 border rounded-lg text-sm"
                      style={{
                        backgroundColor: "var(--color-bg-surface)",
                        borderColor: "var(--color-border-default)",
                      }}
                    >
                      <span
                        className="font-medium"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {s.name ?? resolveSubjectName(s.subjectId)}
                      </span>
                      <span
                        className="text-xs font-semibold"
                        style={{ color: "var(--color-brand-accent)" }}
                      >
                        coef. {s.coefficient}
                      </span>
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
            onClick={() => selectedSerie && openEdit(selectedSerie)}
          >
            Modifier
          </Btn>
        </DialogActions>
      </AdminDialog>

      <AdminDialog
        open={dialogMode === "delete"}
        onClose={closeDialog}
        title="Confirmer la suppression"
        description="Cette action est irréversible. Toutes les dépendances seront supprimées."
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
            Série concernée
          </p>
          <p
            className="font-semibold font-mono"
            style={{ color: "var(--color-text-primary)" }}
          >
            {selectedSerie?.code}
          </p>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            {selectedSerie?.description}
          </p>
          <p
            className="text-xs"
            style={{ color: "var(--color-text-disabled)" }}
          >
            {selectedSerie?.subjects?.length ?? 0} matière(s) associée(s)
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

      <AdminDialog
        open={dialogMode === "export"}
        onClose={closeDialog}
        title="Exporter les séries"
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
            Toutes les séries ({filtered.length}) avec leurs matières seront
            incluses.
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
