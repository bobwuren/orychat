"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Eye,
  RefreshCw,
  AlertCircle,
  MoreVertical,
  X,
  MessageSquare,
  Phone,
  Mail,
  User,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  MessageCircle,
} from "lucide-react";
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

// ─── Constantes ───────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 10;
type DialogMode = "view" | "assign" | "status" | null;

const STATUS_LABELS: Record<ConsultationStatus, string> = {
  pending: "En attente",
  assigned: "Assignée",
  completed: "Terminée",
  cancelled: "Annulée",
};

const STATUS_STYLES: Record<ConsultationStatus, string> = {
  pending: "bg-yellow-50 text-yellow-800 border-yellow-300",
  assigned: "bg-blue-50 text-blue-800 border-blue-300",
  completed: "bg-green-50 text-green-800 border-green-300",
  cancelled: "bg-red-50 text-red-800 border-red-300",
};

const STATUS_ICONS: Record<ConsultationStatus, React.ReactNode> = {
  pending: <Clock className="h-3 w-3 mr-1" />,
  assigned: <UserCheck className="h-3 w-3 mr-1" />,
  completed: <CheckCircle className="h-3 w-3 mr-1" />,
  cancelled: <XCircle className="h-3 w-3 mr-1" />,
};

const VALID_STATUSES: ConsultationStatus[] = [
  "pending",
  "assigned",
  "completed",
  "cancelled",
];

// ─── Badge statut ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ConsultationStatus }) {
  return (
    <Badge variant="outline" className={`border ${STATUS_STYLES[status]}`}>
      {STATUS_ICONS[status]}
      {STATUS_LABELS[status]}
    </Badge>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

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

  // Assign dialog
  const [selectedCounselorId, setSelectedCounselorId] = useState("");
  // Status dialog
  const [newStatus, setNewStatus] = useState<ConsultationStatus>("pending");

  // ── Chargement ──────────────────────────────────────────────────────────────

  const load = useCallback(async () => {
    await fetchAllConsultations(
      filterStatus !== "all" ? { status: filterStatus } : undefined,
    );
    fetchStats();
  }, [fetchAllConsultations, fetchStats, filterStatus]);

  useEffect(() => {
    load();
    // Charger les conseillers actifs pour l'assignation
    counselorsApi
      .getAll()
      .then((res) => setActiveCounselors(res.counselors ?? []))
      .catch(() => {});
  }, [load]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  // ── Filtrage local ──────────────────────────────────────────────────────────

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

  // ── Dialogs ─────────────────────────────────────────────────────────────────

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
      /* fallback sur selected */
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

  // ── Actions ─────────────────────────────────────────────────────────────────

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

  // ── Vue détaillée ────────────────────────────────────────────────────────────

  const detailedConsultation = (
    currentConsultation?.id === selected?.id ? currentConsultation : null
  ) as ConsultationFullDetails | null;

  // ── Rendu erreur ─────────────────────────────────────────────────────────────

  if (error && !consultations?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <div className="text-center">
          <h3 className="text-lg font-semibold">Erreur de chargement</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
        <Button onClick={load}>
          <RefreshCw className="mr-2 h-4 w-4" /> Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Consultations</h1>
          <p className="text-muted-foreground">
            {filtered.length} consultation{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button variant="outline" onClick={load} disabled={isLoading}>
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />{" "}
          Actualiser
        </Button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {(
            [
              "pending",
              "assigned",
              "completed",
              "cancelled",
            ] as ConsultationStatus[]
          ).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(filterStatus === s ? "all" : s)}
              className={`rounded-lg border p-4 text-left transition-all hover:shadow-sm ${filterStatus === s ? "ring-2 ring-primary" : ""}`}
            >
              <p className="text-xs text-muted-foreground mb-1">
                {STATUS_LABELS[s]}
              </p>
              <p className="text-2xl font-bold">{stats[s] ?? 0}</p>
            </button>
          ))}
        </div>
      )}

      {/* Tableau */}
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <CardTitle>Liste des consultations</CardTitle>
              <CardDescription>
                Assignez des conseillers et suivez les statuts.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select
                value={filterStatus}
                onValueChange={(v: any) => setFilterStatus(v)}
              >
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  {VALID_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSearchTerm(searchInput);
                }}
                className="flex space-x-2"
              >
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="ID, étudiant, téléphone…"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pl-8 w-56"
                  />
                  {searchInput && (
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        setSearchInput("");
                        setSearchTerm("");
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
                <Button type="submit" variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Étudiant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Conseiller</TableHead>
                  <TableHead>Notifications</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 6 }).map((__, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center space-y-3">
                        <MessageSquare className="h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          {searchTerm || filterStatus !== "all"
                            ? "Aucun résultat."
                            : "Aucune consultation."}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1 text-sm font-medium">
                            <User className="h-3 w-3 text-muted-foreground" />
                            <span className="font-mono text-xs">
                              {String(c.studentId).slice(0, 10)}…
                            </span>
                          </div>
                          {c.studentEmail && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              {c.studentEmail}
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {c.studentPhone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={c.status} />
                      </TableCell>
                      <TableCell>
                        {c.counselorId ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-1 text-sm cursor-default">
                                  <UserCheck className="h-3 w-3 text-blue-500" />
                                  <span className="font-mono text-xs">
                                    {String(c.counselorId).slice(0, 8)}…
                                  </span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                Assigné le{" "}
                                {c.assignedAt
                                  ? new Date(c.assignedAt).toLocaleDateString(
                                      "fr-FR",
                                    )
                                  : "—"}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            Non assigné
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className={`flex items-center gap-1 text-xs ${c.whatsappSent ? "text-green-600" : "text-muted-foreground"}`}
                                >
                                  <MessageCircle className="h-3 w-3" />
                                  WA
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                {c.whatsappSent
                                  ? "WhatsApp envoyé"
                                  : "WhatsApp non envoyé"}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className={`flex items-center gap-1 text-xs ${c.emailSentToCounselor ? "text-green-600" : "text-muted-foreground"}`}
                                >
                                  <Mail className="h-3 w-3" />
                                  Email
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                {c.emailSentToCounselor
                                  ? "Email conseiller envoyé"
                                  : "Email non envoyé"}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {c.createdAt
                            ? formatDistanceToNow(new Date(c.createdAt), {
                                addSuffix: true,
                                locale: fr,
                              })
                            : "—"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => openView(c)}>
                              <Eye className="mr-2 h-4 w-4" /> Voir les détails
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openAssign(c)}
                              disabled={
                                c.status === "cancelled" ||
                                c.status === "completed"
                              }
                            >
                              <UserCheck className="mr-2 h-4 w-4" /> Assigner un
                              conseiller
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => openStatus(c)}>
                              <RefreshCw className="mr-2 h-4 w-4" /> Changer le
                              statut
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {!isLoading && filtered.length > ITEMS_PER_PAGE && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-muted-foreground">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} sur{" "}
                {filtered.length}
              </p>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage((p) => p - 1);
                      }}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages)
                          setCurrentPage((p) => p + 1);
                      }}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Dialog Vue ── */}
      <Dialog
        open={dialogMode === "view"}
        onOpenChange={(o) => !o && closeDialog()}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de la consultation</DialogTitle>
          </DialogHeader>
          {viewLoading ? (
            <div className="space-y-3 py-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-5 py-2">
              {/* Statut */}
              <div className="flex items-center justify-between">
                <StatusBadge
                  status={
                    (detailedConsultation ?? selected)?.status ?? "pending"
                  }
                />
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span
                    className={`flex items-center gap-1 ${(detailedConsultation ?? selected)?.whatsappSent ? "text-green-600" : ""}`}
                  >
                    <MessageCircle className="h-3 w-3" /> WhatsApp{" "}
                    {(detailedConsultation ?? selected)?.whatsappSent
                      ? "✓"
                      : "✗"}
                  </span>
                  <span
                    className={`flex items-center gap-1 ${(detailedConsultation ?? selected)?.emailSentToCounselor ? "text-green-600" : ""}`}
                  >
                    <Mail className="h-3 w-3" /> Email{" "}
                    {(detailedConsultation ?? selected)?.emailSentToCounselor
                      ? "✓"
                      : "✗"}
                  </span>
                </div>
              </div>

              {/* Étudiant */}
              <div className="border rounded-lg p-4 space-y-2">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Étudiant
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {detailedConsultation?.student?.email ? (
                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium">
                        {detailedConsultation.student.email}
                      </p>
                    </div>
                  ) : (
                    selected?.studentEmail && (
                      <div>
                        <p className="text-muted-foreground">Email</p>
                        <p className="font-medium">{selected.studentEmail}</p>
                      </div>
                    )
                  )}
                  <div>
                    <p className="text-muted-foreground">Téléphone</p>
                    <p className="font-medium">{selected?.studentPhone}</p>
                  </div>
                </div>
              </div>

              {/* Série (si dispo) */}
              {detailedConsultation?.serie && (
                <div className="border rounded-lg p-4 space-y-1">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Série
                  </p>
                  <p className="text-sm">
                    <Badge variant="secondary" className="font-mono mr-2">
                      {detailedConsultation.serie.code}
                    </Badge>
                    {detailedConsultation.serie.description}
                  </p>
                </div>
              )}

              {/* Notes (si dispo) */}
              {(detailedConsultation?.notes ?? []).length > 0 && (
                <div className="border rounded-lg p-4 space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Notes ({detailedConsultation!.notes!.length})
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {detailedConsultation!.notes!.map((n, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-sm border rounded px-3 py-1.5"
                      >
                        <span>{n.subjectName}</span>
                        <span
                          className={`font-semibold ${n.value >= 10 ? "text-green-600" : "text-red-600"}`}
                        >
                          {n.value}/20
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Conseiller assigné (si dispo) */}
              {detailedConsultation?.counselor && (
                <div className="border rounded-lg p-4 space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Conseiller assigné
                  </p>
                  <div className="flex items-center gap-3">
                    {detailedConsultation.counselor.photo ? (
                      <img
                        src={detailedConsultation.counselor.photo}
                        alt=""
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">
                        {detailedConsultation.counselor.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {detailedConsultation.counselor.email}
                      </p>
                    </div>
                  </div>
                  {selected?.assignedAt && (
                    <p className="text-xs text-muted-foreground">
                      Assigné le{" "}
                      {new Date(selected.assignedAt).toLocaleDateString(
                        "fr-FR",
                      )}
                    </p>
                  )}
                </div>
              )}

              {/* Commentaire */}
              {selected?.additionalComment && (
                <div className="border rounded-lg p-4">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                    Commentaire
                  </p>
                  <p className="text-sm">{selected.additionalComment}</p>
                </div>
              )}

              <p className="text-xs text-muted-foreground">
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
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={closeDialog}>
              Fermer
            </Button>
            {selected &&
              selected.status !== "cancelled" &&
              selected.status !== "completed" && (
                <Button
                  variant="outline"
                  onClick={() => {
                    closeDialog();
                    setTimeout(() => selected && openAssign(selected), 100);
                  }}
                >
                  <UserCheck className="mr-2 h-4 w-4" /> Assigner un conseiller
                </Button>
              )}
            {selected && (
              <Button
                onClick={() => {
                  closeDialog();
                  setTimeout(() => selected && openStatus(selected), 100);
                }}
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Changer le statut
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog Assignation ── */}
      <Dialog
        open={dialogMode === "assign"}
        onOpenChange={(o) => !o && closeDialog()}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assigner un conseiller</DialogTitle>
            <DialogDescription>
              Seuls les conseillers actifs sont disponibles. Un email leur sera
              envoyé automatiquement.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>
                Conseiller <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedCounselorId}
                onValueChange={setSelectedCounselorId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un conseiller…" />
                </SelectTrigger>
                <SelectContent>
                  {activeCounselors.length === 0 ? (
                    <SelectItem value="_none" disabled>
                      Aucun conseiller actif
                    </SelectItem>
                  ) : (
                    activeCounselors.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        <div className="flex flex-col">
                          <span>{c.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {c.email}
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            {selectedCounselorId && (
              <div className="rounded-lg bg-muted p-3 text-sm">
                {(() => {
                  const c = activeCounselors.find(
                    (x) => x.id === selectedCounselorId,
                  );
                  return c ? (
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div>
                        <p className="font-medium">{c.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {c.email}
                        </p>
                        {(c.specialties ?? []).length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {c.specialties!.map((s) => (
                              <Badge
                                key={s}
                                variant="outline"
                                className="text-xs"
                              >
                                {s}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            )}
          </div>
          {actionError && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" /> {actionError}
            </p>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeDialog}
              disabled={actionLoading}
            >
              Annuler
            </Button>
            <Button
              onClick={handleAssign}
              disabled={
                actionLoading ||
                !selectedCounselorId ||
                selectedCounselorId === "_none"
              }
            >
              {actionLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Assignation…
                </>
              ) : (
                <>
                  <UserCheck className="mr-2 h-4 w-4" /> Assigner
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog Statut ── */}
      <Dialog
        open={dialogMode === "status"}
        onOpenChange={(o) => !o && closeDialog()}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Changer le statut</DialogTitle>
            <DialogDescription>
              Statut actuel :{" "}
              <strong>{selected ? STATUS_LABELS[selected.status] : "—"}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {VALID_STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setNewStatus(s)}
                className={`w-full flex items-center gap-3 rounded-lg border px-4 py-3 text-sm text-left transition-all ${
                  newStatus === s
                    ? "ring-2 ring-primary border-primary"
                    : "hover:bg-muted"
                }`}
              >
                <StatusBadge status={s} />
                {s === selected?.status && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    Actuel
                  </span>
                )}
              </button>
            ))}
          </div>
          {actionError && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" /> {actionError}
            </p>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeDialog}
              disabled={actionLoading}
            >
              Annuler
            </Button>
            <Button
              onClick={handleStatusUpdate}
              disabled={actionLoading || newStatus === selected?.status}
            >
              {actionLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Mise à
                  jour…
                </>
              ) : (
                "Confirmer"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
