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
  AdminSelect,
  AdminBadge,
  PaginationBar,
  SearchBar,
  InlineError,
  PageError,
} from "@/components/admin/ui";
import { useRecommendations } from "@/lib/hooks";
import type { Recommendation, Orientation } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

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

export default function RecommendationsAdminPage() {
  const {
    recommendations,
    currentRecommendation,
    isLoading,
    error,
    fetchAllRecommendations,
    fetchRecommendationById,
    exportRecommendations,
  } = useRecommendations();
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogMode, setDialogMode] = useState<"view" | "export" | null>(null);
  const [selectedReco, setSelectedReco] = useState<Recommendation | null>(null);
  const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv");
  const [isExporting, setIsExporting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const ITEMS_PER_PAGE = 10;

  const load = useCallback(() => {
    fetchAllRecommendations();
  }, [fetchAllRecommendations]);
  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filtered = (recommendations ?? []).filter(
    (r) =>
      !searchTerm ||
      r.userId?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.serieCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id?.toString().toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const closeDialog = () => {
    setDialogMode(null);
    setSelectedReco(null);
    setActionError(null);
  };

  const openView = async (r: Recommendation) => {
    setActionError(null);
    setSelectedReco(r);
    setDialogMode("view");
    setViewLoading(true);
    try {
      await fetchRecommendationById(r.id);
    } catch {
    } finally {
      setViewLoading(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    setActionError(null);
    try {
      await exportRecommendations({ format: exportFormat });
      closeDialog();
    } catch (err: any) {
      setActionError(err?.message ?? "Erreur export.");
    } finally {
      setIsExporting(false);
    }
  };

  const activeReco =
    currentRecommendation?.id === selectedReco?.id
      ? (currentRecommendation ?? selectedReco)
      : selectedReco;
  if (error) return <PageError message={error.message} onRetry={load} />;

  return (
    <AdminPage>
      <PageHeader
        title="Recommandations"
        subtitle={`${filtered.length} recommandation${filtered.length !== 1 ? "s" : ""}`}
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
          </>
        }
      />
      <AdminCard
        title="Liste des recommandations"
        toolbar={
          <SearchBar
            value={searchInput}
            onChange={(v) => {
              setSearchInput(v);
              if (!v) setSearchTerm("");
            }}
            onSubmit={() => setSearchTerm(searchInput)}
            placeholder="ID, userId, série…"
          />
        }
      >
        <AdminTable>
          <THead>
            <Th>ID</Th>
            <Th>Utilisateur</Th>
            <Th>Série</Th>
            <Th>Orientations</Th>
            <Th>Date</Th>
            <Th right>Actions</Th>
          </THead>
          <TBody>
            {isLoading ? (
              <SkeletonRows cols={6} />
            ) : paginated.length === 0 ? (
              <EmptyRow
                colSpan={6}
                label={
                  searchTerm ? "Aucun résultat." : "Aucune recommandation."
                }
              />
            ) : (
              paginated.map((reco) => (
                <Tr key={reco.id} onClick={() => openView(reco)}>
                  <Td mono muted>
                    #{String(reco.id).slice(0, 8)}…
                  </Td>
                  <Td mono muted>
                    {String(reco.userId).slice(0, 10)}…
                  </Td>
                  <Td>
                    {reco.serieCode ? (
                      <AdminBadge color="gold">{reco.serieCode}</AdminBadge>
                    ) : (
                      <span style={{ color: "var(--color-text-disabled)" }}>
                        -
                      </span>
                    )}
                  </Td>
                  <Td>
                    <AdminBadge color="blue">
                      {reco.orientations?.length ?? 0} orientation
                      {(reco.orientations?.length ?? 0) > 1 ? "s" : ""}
                    </AdminBadge>
                  </Td>
                  <Td muted>
                    {reco.createdAt
                      ? formatDistanceToNow(new Date(reco.createdAt), {
                          addSuffix: true,
                          locale: fr,
                        })
                      : "-"}
                  </Td>
                  <Td right>
                    <Btn
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openView(reco);
                      }}
                    >
                      Voir
                    </Btn>
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
        open={dialogMode === "view"}
        onClose={closeDialog}
        title="Détails de la recommandation"
        size="lg"
      >
        {viewLoading ? (
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
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "ID", value: activeReco?.id, mono: true },
                { label: "Utilisateur", value: activeReco?.userId, mono: true },
                {
                  label: "Série",
                  value: activeReco?.serieCode ?? activeReco?.serieId,
                },
                {
                  label: "Créé le",
                  value: activeReco?.createdAt
                    ? new Date(activeReco.createdAt).toLocaleDateString("fr-FR")
                    : undefined,
                },
              ].map(({ label, value, mono }) => (
                <div key={label}>
                  <p
                    className="text-[10px] uppercase tracking-[0.12em] font-semibold mb-1"
                    style={{ color: "var(--color-text-disabled)" }}
                  >
                    {label}
                  </p>
                  <p
                    className={`text-sm ${mono ? "font-mono" : ""}`}
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {value ?? (
                      <span style={{ color: "var(--color-text-disabled)" }}>
                        -
                      </span>
                    )}
                  </p>
                </div>
              ))}
            </div>
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.12em] font-semibold mb-3"
                style={{ color: "var(--color-text-disabled)" }}
              >
                Orientations ({activeReco?.orientations?.length ?? 0})
              </p>
              {(activeReco?.orientations?.length ?? 0) === 0 ? (
                <p
                  className="text-sm italic"
                  style={{ color: "var(--color-text-disabled)" }}
                >
                  Aucune orientation.
                </p>
              ) : (
                <div className="space-y-3">
                  {activeReco?.orientations?.map(
                    (o: Orientation, i: number) => (
                      <div
                        key={i}
                        className="border rounded-xl p-4 space-y-3"
                        style={{
                          backgroundColor: "var(--color-bg-page)",
                          borderColor: "var(--color-border-default)",
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className="w-6 h-6 rounded-full border flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5"
                            style={{
                              backgroundColor: "var(--color-accent-bg)",
                              borderColor: "var(--color-accent-border-md)",
                              color: "var(--color-brand-accent)",
                            }}
                          >
                            {i + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p
                              className="font-semibold"
                              style={{ color: "var(--color-text-primary)" }}
                            >
                              {o.name}
                            </p>
                            {o.why && (
                              <p
                                className="text-sm mt-1"
                                style={{ color: "var(--color-text-muted)" }}
                              >
                                {o.why}
                              </p>
                            )}
                          </div>
                        </div>
                        {o.degrees?.length > 0 && (
                          <div className="pl-9">
                            <p
                              className="text-[10px] uppercase tracking-[0.1em] font-semibold mb-1.5"
                              style={{ color: "var(--color-text-disabled)" }}
                            >
                              Diplômes
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {o.degrees.map((d: any, j: number) => (
                                <AdminBadge key={j} color="gray">
                                  {d.name}
                                </AdminBadge>
                              ))}
                            </div>
                          </div>
                        )}
                        {o.universities?.length > 0 && (
                          <div className="pl-9">
                            <p
                              className="text-[10px] uppercase tracking-[0.1em] font-semibold mb-1.5"
                              style={{ color: "var(--color-text-disabled)" }}
                            >
                              Universités
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {o.universities.map((u: any, j: number) => (
                                <AdminBadge key={j} color="gray">
                                  {u.name}
                                </AdminBadge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        <DialogActions>
          <Btn variant="ghost" onClick={closeDialog}>
            Fermer
          </Btn>
        </DialogActions>
      </AdminDialog>

      <AdminDialog
        open={dialogMode === "export"}
        onClose={closeDialog}
        title="Exporter les recommandations"
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
            Toutes les recommandations ({filtered.length}) seront incluses.
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
