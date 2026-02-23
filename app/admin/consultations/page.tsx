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
  AdminBadge,
  PaginationBar,
  SearchBar,
  InlineError,
  PageError,
} from "@/components/admin/ui";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useConsultations } from "@/lib/hooks";
import { counselorsApi } from "@/lib/api";
import type {
  Consultation,
  ConsultationFullDetails,
  ConsultationStatus,
  Counselor,
} from "@/lib/types";

const ITEMS_PER_PAGE = 10;
type DialogMode = "view" | "assign" | "status" | null;

const STATUS_LABELS: Record<ConsultationStatus, string> = {
  pending: "En attente",
  assigned: "Assignée",
  completed: "Terminée",
  cancelled: "Annulée",
};

type BadgeColor = "gold" | "green" | "red" | "blue" | "gray";
const STATUS_COLORS: Record<ConsultationStatus, BadgeColor> = {
  pending: "gold",
  assigned: "blue",
  completed: "green",
  cancelled: "red",
};

const VALID_STATUSES: ConsultationStatus[] = [
  "pending",
  "assigned",
  "completed",
  "cancelled",
];

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
function IconUserCheck() {
  return (
    <svg
      className="w-3.5 h-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StatusBadge({ status }: { status: ConsultationStatus }) {
  return (
    <AdminBadge color={STATUS_COLORS[status]}>
      {STATUS_LABELS[status]}
    </AdminBadge>
  );
}

export default function ConsultationsAdminPage() {
  const {
    consultations,
    currentConsultation,
    stats,
    isLoading,
    error,
    fetchAllConsultations,
    fetchConsultationById,
    fetchStats,
    assignCounselor,
    updateStatus,
  } = useConsultations();

  const [activeCounselors, setActiveCounselors] = useState<Counselor[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<ConsultationStatus | "all">(
    "all",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selected, setSelected] = useState<Consultation | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [selectedCounselorId, setSelectedCounselorId] = useState("");
  const [newStatus, setNewStatus] = useState<ConsultationStatus>("pending");

  const load = useCallback(async () => {
    await fetchAllConsultations(
      filterStatus !== "all" ? { status: filterStatus } : undefined,
    );
    fetchStats();
  }, [fetchAllConsultations, fetchStats, filterStatus]);

  useEffect(() => {
    load();
    counselorsApi
      .getAll()
      .then((res) => setActiveCounselors(res.counselors ?? []))
      .catch(() => {});
  }, [load]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  const filtered = (consultations ?? []).filter((c) => {
    const matchSearch =
      !searchTerm ||
      c.id?.toString().includes(searchTerm) ||
      c.studentId?.toString().includes(searchTerm) ||
      c.studentPhone?.includes(searchTerm) ||
      (c.studentEmail ?? "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  const detailedConsultation = (
    currentConsultation?.id === selected?.id ? currentConsultation : null
  ) as ConsultationFullDetails | null;

  const closeDialog = () => {
    setDialogMode(null);
    setSelected(null);
    setActionError(null);
    setSelectedCounselorId("");
    setNewStatus("pending");
  };

  const openView = async (c: Consultation) => {
    setSelected(c);
    setDialogMode("view");
    setViewLoading(true);
    try {
      await fetchConsultationById(c.id);
    } catch {
    } finally {
      setViewLoading(false);
    }
  };
  const openAssign = (c: Consultation) => {
    setSelected(c);
    setSelectedCounselorId(c.counselorId ?? "");
    setActionError(null);
    setDialogMode("assign");
  };
  const openStatus = (c: Consultation) => {
    setSelected(c);
    setNewStatus(c.status);
    setActionError(null);
    setDialogMode("status");
  };

  const handleAssign = async () => {
    if (!selected || !selectedCounselorId) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await assignCounselor(selected.id, { counselorId: selectedCounselorId });
      closeDialog();
    } catch (err: any) {
      setActionError(err?.message ?? "Erreur lors de l'assignation.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selected) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await updateStatus(selected.id, { status: newStatus });
      closeDialog();
    } catch (err: any) {
      setActionError(
        err?.message ?? "Erreur lors de la mise à jour du statut.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (error && !consultations?.length)
    return <PageError message={String(error)} onRetry={load} />;

  return (
    <AdminPage>
      <PageHeader
        title="Consultations"
        subtitle={`${filtered.length} consultation${filtered.length !== 1 ? "s" : ""}`}
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

      {stats && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {(
            [
              "pending",
              "assigned",
              "completed",
              "cancelled",
            ] as ConsultationStatus[]
          ).map((s) => {
            const isActive = filterStatus === s;
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(filterStatus === s ? "all" : s)}
                className={[
                  "flex flex-col gap-3 p-4 rounded-xl border text-left transition-all duration-200",
                  isActive
                    ? "bg-[#c9a84c]/5 border-[#c9a84c]/25"
                    : "bg-[#0e0e0e] border-[#1a1a1a] hover:border-[#252525] hover:bg-[#141414]",
                ].join(" ")}
              >
                <span className="text-[10px] uppercase tracking-[0.1em] text-[#444] font-semibold">
                  {STATUS_LABELS[s]}
                </span>
                <p
                  className={`text-2xl font-bold ${isActive ? "text-[#c9a84c]" : "text-white"}`}
                >
                  {stats[s] ?? 0}
                </p>
              </button>
            );
          })}
        </div>
      )}

      <AdminCard
        title="Liste des consultations"
        description="Assignez des conseillers et suivez les statuts."
        toolbar={
          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as ConsultationStatus | "all")
              }
              className="px-3 py-2 bg-[#141414] border border-[#222] rounded-lg text-sm text-white focus:outline-none focus:border-[#c9a84c] transition-all"
            >
              <option value="all">Tous les statuts</option>
              {VALID_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
            <SearchBar
              value={searchInput}
              onChange={(v) => {
                setSearchInput(v);
                if (!v) setSearchTerm("");
              }}
              onSubmit={() => setSearchTerm(searchInput)}
              placeholder="ID, étudiant, téléphone…"
            />
          </div>
        }
      >
        <AdminTable>
          <THead>
            <Th>Étudiant</Th>
            <Th>Statut</Th>
            <Th>Conseiller</Th>
            <Th>Notifs</Th>
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
                  searchTerm || filterStatus !== "all"
                    ? "Aucun résultat."
                    : "Aucune consultation."
                }
              />
            ) : (
              paginated.map((c) => (
                <Tr key={c.id} onClick={() => openView(c)}>
                  <Td>
                    <div className="space-y-0.5">
                      <code className="text-xs text-[#666] font-mono">
                        {String(c.studentId).slice(0, 10)}…
                      </code>
                      {c.studentEmail && (
                        <p className="text-xs text-[#444]">{c.studentEmail}</p>
                      )}
                      <p className="text-xs text-[#444]">{c.studentPhone}</p>
                    </div>
                  </Td>
                  <Td>
                    <StatusBadge status={c.status} />
                  </Td>
                  <Td>
                    {c.counselorId ? (
                      <code className="text-xs text-[#555] font-mono">
                        {String(c.counselorId).slice(0, 8)}…
                      </code>
                    ) : (
                      <span className="text-xs text-[#333]">Non assigné</span>
                    )}
                  </Td>
                  <Td>
                    <div className="flex items-center gap-3 text-[10px] font-medium">
                      <span
                        className={
                          c.whatsappSent ? "text-green-400" : "text-[#333]"
                        }
                      >
                        WA {c.whatsappSent ? "✓" : "✗"}
                      </span>
                      <span
                        className={
                          c.emailSentToCounselor
                            ? "text-green-400"
                            : "text-[#333]"
                        }
                      >
                        Mail {c.emailSentToCounselor ? "✓" : "✗"}
                      </span>
                    </div>
                  </Td>
                  <Td muted>
                    {c.createdAt
                      ? formatDistanceToNow(new Date(c.createdAt), {
                          addSuffix: true,
                          locale: fr,
                        })
                      : "—"}
                  </Td>
                  <Td right>
                    <div
                      className="flex items-center justify-end gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
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
                        onClick={() => openAssign(c)}
                        disabled={
                          c.status === "cancelled" || c.status === "completed"
                        }
                      >
                        Assigner
                      </Btn>
                      <Btn
                        variant="secondary"
                        size="sm"
                        onClick={() => openStatus(c)}
                      >
                        Statut
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

      {/* Dialog Vue */}
      <AdminDialog
        open={dialogMode === "view"}
        onClose={closeDialog}
        title="Détails de la consultation"
        size="lg"
      >
        {viewLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-5 bg-[#1a1a1a] rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <StatusBadge
                status={(detailedConsultation ?? selected)?.status ?? "pending"}
              />
              <div className="flex items-center gap-4 text-xs">
                <span
                  className={
                    (detailedConsultation ?? selected)?.whatsappSent
                      ? "text-green-400"
                      : "text-[#333]"
                  }
                >
                  WhatsApp{" "}
                  {(detailedConsultation ?? selected)?.whatsappSent ? "✓" : "✗"}
                </span>
                <span
                  className={
                    (detailedConsultation ?? selected)?.emailSentToCounselor
                      ? "text-green-400"
                      : "text-[#333]"
                  }
                >
                  Email conseiller{" "}
                  {(detailedConsultation ?? selected)?.emailSentToCounselor
                    ? "✓"
                    : "✗"}
                </span>
              </div>
            </div>

            <div className="p-4 bg-[#0a0a0a] border border-[#141414] rounded-xl space-y-3">
              <p className="text-[10px] uppercase tracking-[0.12em] text-[#444] font-semibold">
                Étudiant
              </p>
              <div className="grid grid-cols-2 gap-4">
                {(detailedConsultation?.student?.email ??
                  selected?.studentEmail) && (
                  <div>
                    <p className="text-[10px] text-[#444] mb-0.5">Email</p>
                    <p className="text-sm text-white">
                      {detailedConsultation?.student?.email ??
                        selected?.studentEmail}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-[10px] text-[#444] mb-0.5">Téléphone</p>
                  <p className="text-sm text-white">
                    {selected?.studentPhone ?? "—"}
                  </p>
                </div>
              </div>
            </div>

            {detailedConsultation?.serie && (
              <div className="p-4 bg-[#0a0a0a] border border-[#141414] rounded-xl space-y-2">
                <p className="text-[10px] uppercase tracking-[0.12em] text-[#444] font-semibold">
                  Série
                </p>
                <div className="flex items-center gap-2">
                  <AdminBadge color="gold">
                    {detailedConsultation.serie.code}
                  </AdminBadge>
                  <span className="text-sm text-[#888]">
                    {detailedConsultation.serie.description}
                  </span>
                </div>
              </div>
            )}

            {(detailedConsultation?.notes ?? []).length > 0 && (
              <div className="p-4 bg-[#0a0a0a] border border-[#141414] rounded-xl space-y-3">
                <p className="text-[10px] uppercase tracking-[0.12em] text-[#444] font-semibold">
                  Notes ({detailedConsultation!.notes!.length})
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {detailedConsultation!.notes!.map((n, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-3 py-2 bg-[#141414] border border-[#1a1a1a] rounded-lg"
                    >
                      <span className="text-xs text-[#888]">
                        {n.subjectName}
                      </span>
                      <span
                        className={`text-xs font-bold ${n.value >= 10 ? "text-green-400" : "text-red-400"}`}
                      >
                        {n.value}/20
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {detailedConsultation?.counselor && (
              <div className="p-4 bg-[#0a0a0a] border border-[#141414] rounded-xl space-y-3">
                <p className="text-[10px] uppercase tracking-[0.12em] text-[#444] font-semibold">
                  Conseiller assigné
                </p>
                <div className="flex items-center gap-3">
                  {detailedConsultation.counselor.photo ? (
                    <img
                      src={detailedConsultation.counselor.photo}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover border border-[#1a1a1a]"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#141414] border border-[#1a1a1a] flex items-center justify-center text-sm font-bold text-[#555]">
                      {detailedConsultation.counselor.name[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-white text-sm">
                      {detailedConsultation.counselor.name}
                    </p>
                    <p className="text-xs text-[#555]">
                      {detailedConsultation.counselor.email}
                    </p>
                  </div>
                </div>
                {selected?.assignedAt && (
                  <p className="text-xs text-[#444]">
                    Assigné le{" "}
                    {new Date(selected.assignedAt).toLocaleDateString("fr-FR")}
                  </p>
                )}
              </div>
            )}

            {selected?.additionalComment && (
              <div className="p-4 bg-[#0a0a0a] border border-[#141414] rounded-xl">
                <p className="text-[10px] uppercase tracking-[0.12em] text-[#444] font-semibold mb-2">
                  Commentaire
                </p>
                <p className="text-sm text-[#888] leading-relaxed">
                  {selected.additionalComment}
                </p>
              </div>
            )}

            <p className="text-xs text-[#333]">
              Créé le{" "}
              {selected?.createdAt
                ? new Date(selected.createdAt).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "—"}
            </p>
          </div>
        )}
        <DialogActions>
          <Btn variant="ghost" onClick={closeDialog}>
            Fermer
          </Btn>
          {selected &&
            selected.status !== "cancelled" &&
            selected.status !== "completed" && (
              <Btn
                variant="secondary"
                onClick={() => {
                  closeDialog();
                  setTimeout(() => selected && openAssign(selected), 100);
                }}
                icon={<IconUserCheck />}
              >
                Assigner
              </Btn>
            )}
          {selected && (
            <Btn
              variant="primary"
              onClick={() => {
                closeDialog();
                setTimeout(() => selected && openStatus(selected), 100);
              }}
              icon={<IconRefresh />}
            >
              Changer le statut
            </Btn>
          )}
        </DialogActions>
      </AdminDialog>

      {/* Dialog Assignation */}
      <AdminDialog
        open={dialogMode === "assign"}
        onClose={closeDialog}
        title="Assigner un conseiller"
        description="Seuls les conseillers actifs sont disponibles. Un email leur sera envoyé automatiquement."
        size="sm"
      >
        <div className="space-y-4">
          <FormField label="Conseiller" required>
            <select
              value={selectedCounselorId}
              onChange={(e) => setSelectedCounselorId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#141414] border border-[#222] rounded-lg text-sm text-white focus:outline-none focus:border-[#c9a84c] transition-all"
            >
              <option value="">Sélectionner un conseiller…</option>
              {activeCounselors.length === 0 ? (
                <option value="_none" disabled>
                  Aucun conseiller actif
                </option>
              ) : (
                activeCounselors.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.email}
                  </option>
                ))
              )}
            </select>
          </FormField>
          {selectedCounselorId &&
            selectedCounselorId !== "_none" &&
            (() => {
              const c = activeCounselors.find(
                (x) => x.id === selectedCounselorId,
              );
              if (!c) return null;
              return (
                <div className="flex items-center gap-3 p-3 bg-[#0a0a0a] border border-[#141414] rounded-xl">
                  <div className="w-9 h-9 rounded-full bg-[#141414] border border-[#1a1a1a] flex items-center justify-center text-sm font-bold text-[#555] shrink-0">
                    {c.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{c.name}</p>
                    <p className="text-xs text-[#555]">{c.email}</p>
                    {(c.specialties ?? []).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(c.specialties ?? []).map((s) => (
                          <AdminBadge key={s} color="gray">
                            {s}
                          </AdminBadge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
        </div>
        <InlineError message={actionError} />
        <DialogActions>
          <Btn variant="ghost" onClick={closeDialog} disabled={actionLoading}>
            Annuler
          </Btn>
          <Btn
            variant="primary"
            onClick={handleAssign}
            loading={actionLoading}
            disabled={!selectedCounselorId || selectedCounselorId === "_none"}
            icon={<IconUserCheck />}
          >
            Assigner
          </Btn>
        </DialogActions>
      </AdminDialog>

      {/* Dialog Statut */}
      <AdminDialog
        open={dialogMode === "status"}
        onClose={closeDialog}
        title="Changer le statut"
        description={`Statut actuel : ${selected ? STATUS_LABELS[selected.status] : "—"}`}
        size="sm"
      >
        <div className="space-y-2">
          {VALID_STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setNewStatus(s)}
              className={[
                "w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm text-left transition-all",
                newStatus === s
                  ? "bg-[#c9a84c]/5 border-[#c9a84c]/25"
                  : "bg-[#0e0e0e] border-[#1a1a1a] hover:border-[#252525]",
              ].join(" ")}
            >
              <StatusBadge status={s} />
              {s === selected?.status && (
                <span className="text-[10px] text-[#444] font-medium">
                  Actuel
                </span>
              )}
            </button>
          ))}
        </div>
        <InlineError message={actionError} />
        <DialogActions>
          <Btn variant="ghost" onClick={closeDialog} disabled={actionLoading}>
            Annuler
          </Btn>
          <Btn
            variant="primary"
            onClick={handleStatusUpdate}
            loading={actionLoading}
            disabled={newStatus === selected?.status}
          >
            Confirmer
          </Btn>
        </DialogActions>
      </AdminDialog>
    </AdminPage>
  );
}
