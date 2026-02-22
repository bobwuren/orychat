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
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useRecommendations } from "@/lib/hooks";
import type { Recommendation, Orientation } from "@/lib/types";

// ---------------------------------------------------------------------------
// Types locaux
// ---------------------------------------------------------------------------

type DialogMode = "view" | "export" | null;
const ITEMS_PER_PAGE = 10;

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
// Page principale
// ---------------------------------------------------------------------------

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
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedReco, setSelectedReco] = useState<Recommendation | null>(null);
  const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv");
  const [isExporting, setIsExporting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

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
      /* affichage avec selectedReco en fallback */
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
        description="Consultation des recommandations générées par l'IA."
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
                  searchTerm
                    ? "Aucun résultat pour cette recherche."
                    : "Aucune recommandation."
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
                      <span className="text-[#444]">—</span>
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
                      : "—"}
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

      {/* ── Dialog Vue ── */}
      <AdminDialog
        open={dialogMode === "view"}
        onClose={closeDialog}
        title="Détails de la recommandation"
        size="lg"
      >
        {viewLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-5 bg-[#1a1a1a] rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Infos générales */}
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
                    ? new Date(activeReco.createdAt).toLocaleDateString(
                        "fr-FR",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )
                    : undefined,
                },
              ].map(({ label, value, mono }) => (
                <div key={label}>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-[#444] font-semibold mb-1">
                    {label}
                  </p>
                  <p
                    className={`text-sm text-white ${mono ? "font-mono" : ""}`}
                  >
                    {value ?? <span className="text-[#444] italic">—</span>}
                  </p>
                </div>
              ))}
            </div>

            {/* Orientations */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.12em] text-[#444] font-semibold mb-3">
                Orientations recommandées (
                {activeReco?.orientations?.length ?? 0})
              </p>
              {(activeReco?.orientations?.length ?? 0) === 0 ? (
                <p className="text-sm text-[#444] italic">
                  Aucune orientation.
                </p>
              ) : (
                <div className="space-y-3">
                  {activeReco?.orientations?.map(
                    (o: Orientation, i: number) => (
                      <div
                        key={i}
                        className="border border-[#1e1e1e] rounded-xl p-4 space-y-3 bg-[#0a0a0a]"
                      >
                        <div className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-[#c9a84c]/15 border border-[#c9a84c]/30 flex items-center justify-center text-[11px] font-bold text-[#c9a84c] shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-white">{o.name}</p>
                            {o.why && (
                              <p className="text-sm text-[#555] mt-1">
                                {o.why}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Diplômes */}
                        {o.degrees?.length > 0 && (
                          <div className="pl-9">
                            <p className="text-[10px] uppercase tracking-[0.1em] text-[#444] font-semibold mb-1.5">
                              Diplômes
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {o.degrees.map((d: any, j: number) => (
                                <span key={j}>
                                  {d.articleLink ? (
                                    <a
                                      href={d.articleLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium bg-[#141414] border border-[#222] text-[#aaa] rounded hover:border-[#c9a84c]/40 hover:text-[#c9a84c] transition-all"
                                    >
                                      {d.name} <IconExternal />
                                    </a>
                                  ) : (
                                    <AdminBadge color="gray">
                                      {d.name}
                                    </AdminBadge>
                                  )}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Universités */}
                        {o.universities?.length > 0 && (
                          <div className="pl-9">
                            <p className="text-[10px] uppercase tracking-[0.1em] text-[#444] font-semibold mb-1.5">
                              Universités
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {o.universities.map((u: any, j: number) => (
                                <span key={j}>
                                  {u.site || u.website ? (
                                    <a
                                      href={u.site ?? u.website}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium bg-[#141414] border border-[#222] text-[#aaa] rounded hover:border-[#c9a84c]/40 hover:text-[#c9a84c] transition-all"
                                    >
                                      {u.name} <IconExternal />
                                    </a>
                                  ) : (
                                    <AdminBadge color="gray">
                                      {u.name}
                                    </AdminBadge>
                                  )}
                                </span>
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

      {/* ── Dialog Export ── */}
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
          <p className="text-xs text-[#444] bg-[#141414] border border-[#1e1e1e] rounded-lg px-4 py-3">
            Toutes les recommandations ({filtered.length}) seront incluses avec
            leurs orientations.
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
