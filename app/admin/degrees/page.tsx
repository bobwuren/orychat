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
  PaginationBar,
  SearchBar,
  InlineError,
  PageError,
} from "@/components/admin/ui";
import { useDegrees } from "@/lib/hooks";
import type {
  Degree,
  CreateDegreeRequest,
  UpdateDegreeRequest,
} from "@/lib/types";

// Icônes communes
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

type DegreeDialogMode = "create" | "edit" | "view" | "delete" | "export" | null;

function DegreeForm({
  initial,
  onSubmit,
  onCancel,
  isLoading,
  mode,
}: {
  initial?: Partial<Degree>;
  onSubmit: (data: CreateDegreeRequest | UpdateDegreeRequest) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  mode: "create" | "edit";
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!name.trim()) {
      setFormError("Le nom est obligatoire.");
      return;
    }
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
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
          placeholder="ex: Licence Informatique"
          disabled={isLoading}
        />
      </FormField>
      <FormField label="Description">
        <AdminTextarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description optionnelle"
          rows={3}
          disabled={isLoading}
        />
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
          {mode === "create" ? "Créer le diplôme" : "Enregistrer"}
        </Btn>
      </DialogActions>
    </form>
  );
}

export default function DegreesAdminPage() {
  const {
    degrees,
    currentDegree,
    isLoading,
    error,
    fetchDegrees,
    fetchDegreeById,
    createDegree,
    updateDegree,
    deleteDegree,
    exportDegrees,
  } = useDegrees();
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogMode, setDialogMode] = useState<DegreeDialogMode>(null);
  const [selectedDegree, setSelectedDegree] = useState<Degree | null>(null);
  const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv");
  const [isExporting, setIsExporting] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const ITEMS_PER_PAGE = 10;

  const load = useCallback(() => {
    fetchDegrees();
  }, [fetchDegrees]);
  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filtered = (degrees ?? []).filter(
    (d) =>
      !searchTerm || d.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const closeDialog = () => {
    setDialogMode(null);
    setSelectedDegree(null);
    setActionError(null);
  };

  const handleCreate = async (
    data: CreateDegreeRequest | UpdateDegreeRequest,
  ) => {
    setActionLoading(true);
    setActionError(null);
    try {
      await createDegree(data as CreateDegreeRequest);
      closeDialog();
    } catch (err: any) {
      setActionError(err?.message ?? "Erreur.");
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (
    data: CreateDegreeRequest | UpdateDegreeRequest,
  ) => {
    if (!selectedDegree) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await updateDegree(selectedDegree.id, data as UpdateDegreeRequest);
      closeDialog();
    } catch (err: any) {
      setActionError(err?.message ?? "Erreur.");
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedDegree) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await deleteDegree(selectedDegree.id);
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
      await exportDegrees({ format: exportFormat });
      closeDialog();
    } catch (err: any) {
      setActionError(err?.message ?? "Erreur export.");
    } finally {
      setIsExporting(false);
    }
  };

  const activeDegree =
    currentDegree?.id === selectedDegree?.id
      ? (currentDegree ?? selectedDegree)
      : selectedDegree;
  if (error) return <PageError message={error.message} onRetry={load} />;

  return (
    <AdminPage>
      <PageHeader
        title="Diplômes"
        subtitle={`${filtered.length} diplôme${filtered.length !== 1 ? "s" : ""}`}
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
              onClick={() => {
                setSelectedDegree(null);
                setActionError(null);
                setDialogMode("create");
              }}
              icon={<IconPlus />}
            >
              Nouveau diplôme
            </Btn>
          </>
        }
      />
      <AdminCard
        title="Liste des diplômes"
        toolbar={
          <SearchBar
            value={searchInput}
            onChange={(v) => {
              setSearchInput(v);
              if (!v) setSearchTerm("");
            }}
            onSubmit={() => setSearchTerm(searchInput)}
            placeholder="Rechercher un diplôme…"
          />
        }
      >
        <AdminTable>
          <THead>
            <Th>Nom</Th>
            <Th>Description</Th>
            <Th right>Actions</Th>
          </THead>
          <TBody>
            {isLoading ? (
              <SkeletonRows cols={3} />
            ) : paginated.length === 0 ? (
              <EmptyRow
                colSpan={3}
                label={searchTerm ? "Aucun résultat." : "Aucun diplôme."}
              />
            ) : (
              paginated.map((degree) => (
                <Tr key={degree.id}>
                  <Td>
                    <span
                      className="font-medium"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {degree.name}
                    </span>
                  </Td>
                  <Td muted>
                    <span className="block max-w-xs truncate">
                      {degree.description ?? "—"}
                    </span>
                  </Td>
                  <Td right>
                    <div className="flex items-center justify-end gap-1">
                      <Btn
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedDegree(degree);
                          setDialogMode("view");
                          fetchDegreeById(degree.id);
                        }}
                      >
                        Voir
                      </Btn>
                      <Btn
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedDegree(degree);
                          setDialogMode("edit");
                          fetchDegreeById(degree.id);
                        }}
                      >
                        Modifier
                      </Btn>
                      <Btn
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          setSelectedDegree(degree);
                          setActionError(null);
                          setDialogMode("delete");
                        }}
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
        title="Nouveau diplôme"
      >
        <DegreeForm
          mode="create"
          onSubmit={handleCreate}
          onCancel={closeDialog}
          isLoading={actionLoading}
        />
        <InlineError message={actionError} />
      </AdminDialog>
      <AdminDialog
        open={dialogMode === "edit"}
        onClose={closeDialog}
        title="Modifier le diplôme"
      >
        <DegreeForm
          key={selectedDegree?.id}
          mode="edit"
          initial={activeDegree ?? undefined}
          onSubmit={handleUpdate}
          onCancel={closeDialog}
          isLoading={actionLoading}
        />
        <InlineError message={actionError} />
      </AdminDialog>
      <AdminDialog
        open={dialogMode === "view"}
        onClose={closeDialog}
        title="Détails du diplôme"
      >
        <div className="space-y-4">
          {[
            { label: "Nom", value: activeDegree?.name },
            { label: "Description", value: activeDegree?.description },
            {
              label: "Créé le",
              value: activeDegree?.createdAt
                ? new Date(activeDegree.createdAt).toLocaleDateString("fr-FR")
                : undefined,
            },
          ].map(({ label, value }) => (
            <div key={label}>
              <p
                className="text-[10px] uppercase tracking-[0.12em] font-semibold mb-1"
                style={{ color: "var(--color-text-disabled)" }}
              >
                {label}
              </p>
              <p
                className="text-sm"
                style={{ color: "var(--color-text-primary)" }}
              >
                {value ?? (
                  <span style={{ color: "var(--color-text-disabled)" }}>—</span>
                )}
              </p>
            </div>
          ))}
        </div>
        <DialogActions>
          <Btn variant="ghost" onClick={closeDialog}>
            Fermer
          </Btn>
          <Btn
            variant="secondary"
            onClick={() => selectedDegree && setDialogMode("edit")}
          >
            Modifier
          </Btn>
        </DialogActions>
      </AdminDialog>
      <AdminDialog
        open={dialogMode === "delete"}
        onClose={closeDialog}
        title="Confirmer la suppression"
        description="Cette action est irréversible."
        size="sm"
      >
        <div
          className="p-4 border rounded-xl mb-2"
          style={{
            backgroundColor: "var(--color-bg-surface)",
            borderColor: "var(--color-border-default)",
          }}
        >
          <p
            className="text-xs mb-1"
            style={{ color: "var(--color-text-muted)" }}
          >
            Diplôme concerné
          </p>
          <p
            className="font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {selectedDegree?.name}
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
        title="Exporter les diplômes"
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
            {filtered.length} diplôme{filtered.length !== 1 ? "s" : ""} seront
            inclus.
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
