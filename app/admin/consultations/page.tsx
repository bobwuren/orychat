"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Download,
  Filter,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Phone,
  Mail,
  MessageSquare,
  UserCheck,
  UserX,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  AlertCircle,
  MoreVertical,
  BarChart3,
  MessageCircle,
  UserPlus,
  MailCheck,
  PhoneCall,
  Brain,
  BookOpen,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useConsultations } from "@/lib/hooks/useConsultations";
import { Consultation, ConsultationStatus, Counselor } from "@/lib/types/questionnaire-consultation.types";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const STATUS_COLORS: Record<ConsultationStatus, string> = {
  pending: "#F59E0B", // orange
  assigned: "#3B82F6", // blue
  completed: "#10B981", // green
  cancelled: "#EF4444", // red
};

const STATUS_ICONS: Record<ConsultationStatus, React.ReactNode> = {
  pending: <Clock className="h-3 w-3" />,
  assigned: <UserCheck className="h-3 w-3" />,
  completed: <CheckCircle className="h-3 w-3" />,
  cancelled: <XCircle className="h-3 w-3" />,
};

export default function ConsultationsAdminPage() {
  const {
    consultations,
    stats,
    isLoading,
    error,
    fetchAllConsultations,
    fetchStats,
    updateStatus,
  } = useConsultations();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [selectedCounselor, setSelectedCounselor] = useState<Counselor | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<ConsultationStatus>("assigned");
  const [counselorSearch, setCounselorSearch] = useState("");
  const [activeTab, setActiveTab] = useState("consultations");
  const [limit] = useState(10);

  // Données mockées pour les conseillers (à remplacer par une vraie API)
  const [counselors, setCounselors] = useState<Counselor[]>([
    {
      id: "1",
      name: "Dr. Sarah Chen",
      email: "sarah.chen@orientation.fr",
      phone: "+33 6 12 34 56 78",
      bio: "Spécialiste en orientation numérique avec 10 ans d'expérience",
      specialties: ["Informatique", "Digital", "IA"],
      isActive: true,
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      name: "Prof. Martin Dupont",
      email: "martin.dupont@orientation.fr",
      phone: "+33 6 98 76 54 32",
      bio: "Expert en reconversion professionnelle et formations",
      specialties: ["Ingénierie", "Management", "Formation"],
      isActive: true,
      createdAt: "2024-02-20T14:45:00Z",
      updatedAt: "2024-02-20T14:45:00Z",
    },
    {
      id: "3",
      name: "Mme. Leila Ahmadi",
      email: "leila.ahmadi@orientation.fr",
      phone: "+33 7 23 45 67 89",
      bio: "Conseillère en orientation scolaire et universitaire",
      specialties: ["Lycée", "Université", "International"],
      isActive: false,
      createdAt: "2024-03-10T09:15:00Z",
      updatedAt: "2024-03-10T09:15:00Z",
    },
  ]);

  useEffect(() => {
    fetchAllConsultations({ status: statusFilter !== "all" ? statusFilter as ConsultationStatus : undefined });
    fetchStats();
  }, [statusFilter, fetchAllConsultations, fetchStats]);

  // Filtrer les consultations par recherche
  const filteredConsultations = consultations.filter(consultation => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      consultation.studentId.toLowerCase().includes(searchLower) ||
      consultation.studentEmail?.toLowerCase().includes(searchLower) ||
      consultation.studentPhone.toLowerCase().includes(searchLower) ||
      consultation.id.toLowerCase().includes(searchLower)
    );
  });

  // Pagination
  const paginatedConsultations = filteredConsultations.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  // Préparer les données pour les graphiques
  const statusData = stats ? [
    { name: 'En attente', value: stats.pending, color: STATUS_COLORS.pending },
    { name: 'Assigné', value: stats.assigned, color: STATUS_COLORS.assigned },
    { name: 'Complété', value: stats.completed, color: STATUS_COLORS.completed },
    { name: 'Annulé', value: stats.cancelled, color: STATUS_COLORS.cancelled },
  ] : [];

  // Filtrer les conseillers
  const filteredCounselors = counselors.filter(counselor => {
    if (!counselorSearch) return true;
    const searchLower = counselorSearch.toLowerCase();
    return (
      counselor.name.toLowerCase().includes(searchLower) ||
      counselor.email.toLowerCase().includes(searchLower) ||
      counselor.specialties?.some(s => s.toLowerCase().includes(searchLower)) ||
      false
    );
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleStatusUpdate = async () => {
    if (!selectedConsultation) return;
    
    try {
      await updateStatus(selectedConsultation.id, { status: newStatus });
      setIsStatusDialogOpen(false);
      setSelectedConsultation(null);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleAssignCounselor = async () => {
    if (!selectedConsultation || !selectedCounselor) return;
    
    try {
      // Ici vous appelleriez l'API pour assigner le conseiller
      // await assignCounselor(selectedConsultation.id, { counselorId: selectedCounselor.id });
      setIsAssignDialogOpen(false);
      setSelectedConsultation(null);
      setSelectedCounselor(null);
    } catch (err) {
      console.error("Error assigning counselor:", err);
    }
  };

  const handleRefresh = () => {
    fetchAllConsultations({ status: statusFilter !== "all" ? statusFilter as ConsultationStatus : undefined });
    fetchStats();
  };

  const getStatusBadge = (status: ConsultationStatus) => {
    return (
      <Badge 
        className={`flex items-center gap-1 ${status === 'pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
          status === 'assigned' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
          status === 'completed' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
          'bg-red-100 text-red-800 hover:bg-red-100'}`}
      >
        {STATUS_ICONS[status]}
        {status === 'pending' ? 'En attente' :
         status === 'assigned' ? 'Assigné' :
         status === 'completed' ? 'Complété' : 'Annulé'}
      </Badge>
    );
  };

  const getCommunicationBadges = (consultation: Consultation) => {
    return (
      <div className="flex flex-wrap gap-1">
        {consultation.whatsappSent && (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <MessageCircle className="mr-1 h-3 w-3" />
            WhatsApp
          </Badge>
        )}
        {consultation.emailSentToCounselor && (
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            <MailCheck className="mr-1 h-3 w-3" />
            Email
          </Badge>
        )}
      </div>
    );
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <div className="text-center">
          <h3 className="text-lg font-semibold">Erreur de chargement</h3>
        </div>
        <Button onClick={handleRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Consultations d&apos;Orientation</h1>
          <p className="text-muted-foreground">
            Gérez les demandes de consultation et les conseillers
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button
            onClick={() => setIsExportDialogOpen(true)}
            variant="outline"
          >
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button onClick={() => setActiveTab("counselors")}>
            <UserPlus className="mr-2 h-4 w-4" />
            Ajouter un conseiller
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 lg:w-auto">
          <TabsTrigger value="consultations" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Consultations
          </TabsTrigger>
          <TabsTrigger value="counselors" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Conseillers
          </TabsTrigger>
        </TabsList>

        {/* Onglet Consultations */}
        <TabsContent value="consultations" className="space-y-6">
          {/* Cartes de statistiques */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Consultations</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.total || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Demandes de consultation
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">En attente</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.pending || 0}</div>
                <p className="text-xs text-muted-foreground">
                  En attente d&apos;attribution
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Assignées</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.assigned || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Conseillers assignés
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Complétées</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.completed || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Consultations terminées
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Barre de recherche et filtres */}
          <Card>
            <CardHeader>
              <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                  <CardTitle>Liste des Consultations</CardTitle>
                  <CardDescription>
                    Gérez toutes les demandes de consultation
                  </CardDescription>
                </div>
                <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-2 md:space-y-0">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="assigned">Assigné</SelectItem>
                      <SelectItem value="completed">Complété</SelectItem>
                      <SelectItem value="cancelled">Annulé</SelectItem>
                    </SelectContent>
                  </Select>
                  <form onSubmit={handleSearch} className="flex space-x-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher une consultation..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 w-full md:w-64"
                      />
                    </div>
                    <Button type="submit" size="icon" variant="outline">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Tableau */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Étudiant</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Communication</TableHead>
                      <TableHead>Créé le</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      // Skeleton loader
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                          <TableCell className="text-right">
                            <Skeleton className="h-8 w-20 ml-auto" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : paginatedConsultations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex flex-col items-center space-y-2">
                            <Users className="h-12 w-12 text-muted-foreground" />
                            <p className="text-muted-foreground">Aucune consultation trouvée</p>
                            <p className="text-sm text-muted-foreground">
                              {searchTerm || statusFilter !== "all" ? "Essayez de modifier vos filtres" : 
                               "Les consultations apparaîtront ici"}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedConsultations.map((consultation) => (
                        <TableRow key={consultation.id}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                  {consultation.studentId.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">Étudiant #{consultation.studentId.substring(0, 8)}</div>
                                {consultation.questionnaireId && (
                                  <div className="text-xs text-muted-foreground flex items-center">
                                    <Brain className="mr-1 h-3 w-3" />
                                    Questionnaire rempli
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {consultation.studentEmail && (
                                <div className="flex items-center">
                                  <Mail className="mr-1 h-3 w-3 text-muted-foreground" />
                                  <span className="text-sm">{consultation.studentEmail}</span>
                                </div>
                              )}
                              <div className="flex items-center">
                                <Phone className="mr-1 h-3 w-3 text-muted-foreground" />
                                <span className="text-sm">{consultation.studentPhone}</span>
                              </div>
                              {consultation.additionalComment && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="flex items-center cursor-help">
                                        <MessageSquare className="mr-1 h-3 w-3 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">Message</span>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="max-w-xs">{consultation.additionalComment}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(consultation.status)}</TableCell>
                          <TableCell>{getCommunicationBadges(consultation)}</TableCell>
                          <TableCell>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="text-sm text-muted-foreground cursor-help">
                                    {formatDistanceToNow(new Date(consultation.createdAt), {
                                      addSuffix: true,
                                      locale: fr,
                                    })}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {new Date(consultation.createdAt).toLocaleDateString("fr-FR", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
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
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedConsultation(consultation);
                                    setIsViewDialogOpen(true);
                                  }}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  Voir les détails
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedConsultation(consultation);
                                    setIsAssignDialogOpen(true);
                                  }}
                                  disabled={consultation.status === 'completed' || consultation.status === 'cancelled'}
                                >
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Assigner un conseiller
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedConsultation(consultation);
                                    setIsStatusDialogOpen(true);
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Changer le statut
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <PhoneCall className="mr-2 h-4 w-4" />
                                  Contacter
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Supprimer
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

              {/* Pagination */}
              {!isLoading && paginatedConsultations.length > 0 && (
                <div className="flex items-center justify-between py-4">
                  <div className="text-sm text-muted-foreground">
                    Affichage de <strong>{(currentPage - 1) * limit + 1}</strong> à{" "}
                    <strong>{Math.min(currentPage * limit, filteredConsultations.length)}</strong> sur{" "}
                    <strong>{filteredConsultations.length}</strong> consultations
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) setCurrentPage(currentPage - 1);
                          }}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      {Array.from({ length: Math.ceil(filteredConsultations.length / limit) })
                        .slice(0, 3)
                        .map((_, index) => (
                          <PaginationItem key={index}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(index + 1);
                              }}
                              isActive={currentPage === index + 1}
                            >
                              {index + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < Math.ceil(filteredConsultations.length / limit)) {
                              setCurrentPage(currentPage + 1);
                            }
                          }}
                          className={currentPage >= Math.ceil(filteredConsultations.length / limit) ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Conseillers */}
        <TabsContent value="counselors" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                  <CardTitle>Conseillers d&apos;Orientation</CardTitle>
                  <CardDescription>
                    Gérez les conseillers disponibles pour les consultations
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un conseiller
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Barre de recherche conseillers */}
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher un conseiller..."
                      value={counselorSearch}
                      onChange={(e) => setCounselorSearch(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="active">Actifs uniquement</SelectItem>
                      <SelectItem value="inactive">Inactifs uniquement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Liste des conseillers */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredCounselors.map((counselor) => (
                    <Card key={counselor.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>
                                {counselor.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{counselor.name}</CardTitle>
                              <CardDescription>{counselor.email}</CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={counselor.isActive}
                              onCheckedChange={() => {
                                // Toggle active status
                              }}
                            />
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Voir le profil
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Modifier
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Users className="mr-2 h-4 w-4" />
                                  Voir les consultations
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {counselor.bio && (
                            <p className="text-sm text-muted-foreground">{counselor.bio}</p>
                          )}
                          {counselor.phone && (
                            <div className="flex items-center text-sm">
                              <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                              {counselor.phone}
                            </div>
                          )}
                          {counselor.specialties && counselor.specialties.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {counselor.specialties.map((specialty) => (
                                <Badge key={specialty} variant="secondary">
                                  {specialty}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="mr-2 h-4 w-4" />
                            Membre depuis {formatDistanceToNow(new Date(counselor.createdAt), { addSuffix: true, locale: fr })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredCounselors.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <UserX className="h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-muted-foreground">Aucun conseiller trouvé</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de visualisation */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de la Consultation</DialogTitle>
            <DialogDescription>
              Informations complètes de la demande de consultation
            </DialogDescription>
          </DialogHeader>
          {selectedConsultation && (
            <div className="space-y-6 py-4">
              {/* En-tête */}
              <div className="rounded-lg bg-muted p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">ID Consultation</p>
                    <p className="font-medium font-mono">{selectedConsultation.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ID Étudiant</p>
                    <p className="font-medium">{selectedConsultation.studentId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Statut</p>
                    <div className="mt-1">{getStatusBadge(selectedConsultation.status)}</div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Créée le</p>
                    <p className="font-medium">
                      {new Date(selectedConsultation.createdAt).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Informations de contact */}
              <div>
                <h3 className="font-semibold mb-3">Informations de contact</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Téléphone</Label>
                    <div className="flex items-center mt-1">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{selectedConsultation.studentPhone}</span>
                    </div>
                  </div>
                  {selectedConsultation.studentEmail && (
                    <div>
                      <Label>Email</Label>
                      <div className="flex items-center mt-1">
                        <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{selectedConsultation.studentEmail}</span>
                      </div>
                    </div>
                  )}
                </div>
                {selectedConsultation.additionalComment && (
                  <div className="mt-4">
                    <Label>Message supplémentaire</Label>
                    <div className="mt-1 p-3 rounded-lg border bg-muted/50">
                      <p className="text-sm">{selectedConsultation.additionalComment}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Communications */}
              <div>
                <h3 className="font-semibold mb-3">Communications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className={`h-5 w-5 ${selectedConsultation.whatsappSent ? 'text-green-600' : 'text-muted-foreground'}`} />
                    <div>
                      <p className="font-medium">WhatsApp</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedConsultation.whatsappSent ? 'Message envoyé' : 'Non envoyé'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className={`h-5 w-5 ${selectedConsultation.emailSentToCounselor ? 'text-blue-600' : 'text-muted-foreground'}`} />
                    <div>
                      <p className="font-medium">Email conseiller</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedConsultation.emailSentToCounselor ? 'Email envoyé' : 'Non envoyé'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ID associés */}
              <div>
                <h3 className="font-semibold mb-3">Identifiants associés</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Questionnaire</Label>
                    <div className="flex items-center mt-1">
                      <Brain className="mr-2 h-4 w-4 text-muted-foreground" />
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {selectedConsultation.questionnaireId.substring(0, 8)}...
                      </code>
                    </div>
                  </div>
                  <div>
                    <Label>Recommandation</Label>
                    <div className="flex items-center mt-1">
                      <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {selectedConsultation.recommendationId.substring(0, 8)}...
                      </code>
                    </div>
                  </div>
                  {selectedConsultation.counselorId && (
                    <div>
                      <Label>Conseiller assigné</Label>
                      <div className="flex items-center mt-1">
                        <UserCheck className="mr-2 h-4 w-4 text-muted-foreground" />
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {selectedConsultation.counselorId.substring(0, 8)}...
                        </code>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Fermer
            </Button>
            <Button>
              <PhoneCall className="mr-2 h-4 w-4" />
              Contacter l&apos;étudiant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog d'assignation */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assigner un conseiller</DialogTitle>
            <DialogDescription>
              Sélectionnez un conseiller pour la consultation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedConsultation && (
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">Consultation #{selectedConsultation.id.substring(0, 8)}</p>
                <p className="font-medium">Étudiant: {selectedConsultation.studentId.substring(0, 8)}</p>
                <p className="text-sm">Téléphone: {selectedConsultation.studentPhone}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label>Rechercher un conseiller</Label>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Nom, email ou spécialité..."
                  value={counselorSearch}
                  onChange={(e) => setCounselorSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {filteredCounselors.map((counselor) => (
                <div
                  key={counselor.id}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-muted ${
                    selectedCounselor?.id === counselor.id ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setSelectedCounselor(counselor)}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        {counselor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{counselor.name}</p>
                      <p className="text-sm text-muted-foreground">{counselor.email}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {counselor.specialties?.slice(0, 2).map((s) => (
                          <Badge key={s} variant="outline" className="text-xs">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch checked={counselor.isActive} disabled />
                    <Badge variant={counselor.isActive ? "default" : "secondary"}>
                      {counselor.isActive ? "Actif" : "Inactif"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAssignDialogOpen(false);
              setSelectedCounselor(null);
            }}>
              Annuler
            </Button>
            <Button onClick={handleAssignCounselor} disabled={!selectedCounselor}>
              <UserCheck className="mr-2 h-4 w-4" />
              Assigner ce conseiller
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de changement de statut */}
      <AlertDialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Changer le statut</AlertDialogTitle>
            <AlertDialogDescription>
              Sélectionnez le nouveau statut pour cette consultation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            {selectedConsultation && (
              <div className="rounded-lg bg-muted p-4">
                <p className="font-medium">Consultation #{selectedConsultation.id.substring(0, 8)}</p>
                <p className="text-sm text-muted-foreground">
                  Statut actuel: {selectedConsultation.status === 'pending' ? 'En attente' :
                    selectedConsultation.status === 'assigned' ? 'Assigné' :
                    selectedConsultation.status === 'completed' ? 'Complété' : 'Annulé'}
                </p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              {(['pending', 'assigned', 'completed', 'cancelled'] as ConsultationStatus[]).map((status) => (
                <Button
                  key={status}
                  variant={newStatus === status ? "default" : "outline"}
                  onClick={() => setNewStatus(status)}
                  className="justify-start"
                >
                  {STATUS_ICONS[status]}
                  <span className="ml-2">
                    {status === 'pending' ? 'En attente' :
                     status === 'assigned' ? 'Assigné' :
                     status === 'completed' ? 'Complété' : 'Annulé'}
                  </span>
                </Button>
              ))}
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleStatusUpdate}>
              Confirmer le changement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog d'export */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exporter les données</DialogTitle>
            <DialogDescription>
              Exportez les consultations dans le format souhaité.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Format d&apos;export</Label>
              <Select value="csv">
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV (Excel)</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Période</Label>
              <Select value="all">
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les données</SelectItem>
                  <SelectItem value="month">30 derniers jours</SelectItem>
                  <SelectItem value="week">7 derniers jours</SelectItem>
                  <SelectItem value="today">Aujourd&apos;hui</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Statut</Label>
              <Select value="all">
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente uniquement</SelectItem>
                  <SelectItem value="assigned">Assigné uniquement</SelectItem>
                  <SelectItem value="completed">Complété uniquement</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
              Annuler
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Exporter maintenant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}