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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building,
  Download,
  Filter,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Globe,
  Mail,
  Phone,
  Award,
  Users,
  Calendar,
  Star,
  RefreshCw,
  AlertCircle,
  MoreVertical,
  ExternalLink,
  GraduationCap,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUniversities } from "@/lib/hooks/useUniversities";
import { University, SponsorshipLevel } from "@/lib/types/universities.types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const SPONSORSHIP_COLORS: Record<SponsorshipLevel, string> = {
  Platinum: "#E5E4E2",
  Gold: "#FFD700",
  Silver: "#C0C0C0",
  Bronze: "#CD7F32",
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function UniversitiesAdminPage() {
  const {
    universities,
    isLoading,
    error,
    fetchUniversities,
    deleteUniversity,
    exportUniversities,
  } = useUniversities();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSponsor, setFilterSponsor] = useState<string>("all");
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv");
  const [isExporting, setIsExporting] = useState(false);
  const [limit] = useState(10);

  useEffect(() => {
    fetchUniversities({
      page: currentPage,
      limit,
      search: searchTerm || undefined,
      sponsorOnly: filterSponsor === "sponsors" ? true : undefined,
    });
  }, [currentPage, searchTerm, filterSponsor, fetchUniversities]);

  // Calculer les statistiques
  const stats = {
    totalUniversities: universities.length,
    sponsors: universities.filter(u => u.isSponsor).length,
    nonSponsors: universities.filter(u => !u.isSponsor).length,
    withDegrees: universities.filter(u => u.degrees && u.degrees.length > 0).length,
    averageDegrees: universities.length > 0 
      ? (universities.reduce((acc, uni) => acc + (uni.degrees?.length || 0), 0) / universities.length).toFixed(1)
      : "0.0",
    totalStudents: universities.reduce((acc, uni) => acc + (uni.studentCount || 0), 0),
  };

  // Préparer les données pour les graphiques
  const sponsorshipData = [
    { name: 'Sponsors', value: stats.sponsors },
    { name: 'Non-Sponsors', value: stats.nonSponsors },
  ];

  const sponsorshipLevelData = universities
    .filter(u => u.isSponsor && u.sponsorshipLevel)
    .reduce((acc, uni) => {
      const level = uni.sponsorshipLevel!;
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {} as Record<SponsorshipLevel, number>);

  const chartData = Object.entries(sponsorshipLevelData).map(([level, count]) => ({
    name: level,
    count,
    color: SPONSORSHIP_COLORS[level as SponsorshipLevel],
  }));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUniversities({
      page: 1,
      limit,
      search: searchTerm || undefined,
      sponsorOnly: filterSponsor === "sponsors" ? true : undefined,
    });
  };

  const handleDelete = async (universityId: string) => {
    try {
      await deleteUniversity(universityId);
      setIsDeleteDialogOpen(false);
      setSelectedUniversity(null);
    } catch (err) {
      console.error("Error deleting university:", err);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportUniversities({ format: exportFormat });
      setIsExportDialogOpen(false);
    } catch (err) {
      console.error("Error exporting universities:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleRefresh = () => {
    fetchUniversities({
      page: currentPage,
      limit,
      search: searchTerm || undefined,
      sponsorOnly: filterSponsor === "sponsors" ? true : undefined,
    });
  };

  const getSponsorshipBadge = (university: University) => {
    if (!university.isSponsor) return null;
    
    const colorClass = {
      Platinum: "bg-gradient-to-r from-gray-200 to-gray-400 text-gray-900",
      Gold: "bg-gradient-to-r from-yellow-100 to-yellow-300 text-yellow-900",
      Silver: "bg-gradient-to-r from-gray-100 to-gray-300 text-gray-900",
      Bronze: "bg-gradient-to-r from-orange-100 to-orange-300 text-orange-900",
    }[university.sponsorshipLevel || "Bronze"];

    return (
      <Badge className={`${colorClass} hover:opacity-90`}>
        <Award className="mr-1 h-3 w-3" />
        {university.sponsorshipLevel || "Sponsor"}
      </Badge>
    );
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <div className="text-center">
          <h3 className="text-lg font-semibold">Erreur de chargement</h3>
          <p className="text-muted-foreground">{error.message}</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Universités</h1>
          <p className="text-muted-foreground">
            Gérez toutes les universités et leurs informations
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
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle Université
          </Button>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total des Universités</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUniversities}</div>
            <p className="text-xs text-muted-foreground">
              Universités enregistrées
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sponsors</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sponsors}</div>
            <p className="text-xs text-muted-foreground">
              Universités partenaires
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Étudiants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalStudents.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Étudiants au total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Diplômes</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageDegrees}</div>
            <p className="text-xs text-muted-foreground">
              Diplômes par université
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Répartition Sponsors/Non-Sponsors</CardTitle>
            <CardDescription>Proportion des universités partenaires</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {isLoading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sponsorshipData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {sponsorshipData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Niveaux de Sponsoring</CardTitle>
            <CardDescription>Distribution par niveau de partenariat</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {isLoading ? (
                <Skeleton className="h-full w-full" />
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="count">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Aucun sponsor enregistré</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et tableau */}
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <CardTitle>Liste des Universités</CardTitle>
              <CardDescription>
                Gérez toutes les universités et leurs informations
              </CardDescription>
            </div>
            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-2 md:space-y-0">
              <Select value={filterSponsor} onValueChange={setFilterSponsor}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Toutes les universités" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les universités</SelectItem>
                  <SelectItem value="sponsors">Sponsors uniquement</SelectItem>
                  <SelectItem value="non-sponsors">Non-sponsors</SelectItem>
                </SelectContent>
              </Select>
              <form onSubmit={handleSearch} className="flex space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher une université..."
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
                  <TableHead>Nom</TableHead>
                  <TableHead>Localisation</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Diplômes</TableHead>
                  <TableHead>Étudiants</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Skeleton loader
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-8 w-20 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : universities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center space-y-2">
                        <Building className="h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground">Aucune université trouvée</p>
                        <Button variant="outline" size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Ajouter une université
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  universities.map((university) => (
                    <TableRow key={university.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <div>
                            <div className="font-medium">{university.name}</div>
                            {university.ranking && (
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Star className="mr-1 h-3 w-3 text-yellow-500" />
                                Classement: #{university.ranking}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span>{university.location || "Non spécifié"}</span>
                        </div>
                        {university.establishedYear && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="mr-1 h-3 w-3" />
                            Fondé en {university.establishedYear}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {university.website && (
                            <div className="flex items-center">
                              <Globe className="mr-1 h-3 w-3 text-muted-foreground" />
                              <a 
                                href={university.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline flex items-center"
                              >
                                Site web
                                <ExternalLink className="ml-1 h-2 w-2" />
                              </a>
                            </div>
                          )}
                          {university.email && (
                            <div className="flex items-center">
                              <Mail className="mr-1 h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{university.email}</span>
                            </div>
                          )}
                          {university.phone && (
                            <div className="flex items-center">
                              <Phone className="mr-1 h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{university.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="secondary">
                                {university.degrees?.length || 0} diplôme(s)
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="space-y-1 max-w-xs">
                                {university.degrees?.map((degree) => (
                                  <div key={degree.id} className="text-sm">
                                    {degree.name}
                                  </div>
                                )) || "Aucun diplôme"}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        {university.studentCount ? (
                          <div className="flex items-center">
                            <Users className="mr-1 h-3 w-3 text-muted-foreground" />
                            <span>{university.studentCount.toLocaleString()}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {getSponsorshipBadge(university)}
                          {university.logo && (
                            <Badge variant="outline" className="bg-white">
                              Logo disponible
                            </Badge>
                          )}
                        </div>
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
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Voir les détails
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <GraduationCap className="mr-2 h-4 w-4" />
                              Gérer les diplômes
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {university.website && (
                              <DropdownMenuItem asChild>
                                <a 
                                  href={university.website} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center"
                                >
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  Visiter le site
                                </a>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setSelectedUniversity(university);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
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
          {!isLoading && universities.length > 0 && (
            <div className="flex items-center justify-between py-4">
              <div className="text-sm text-muted-foreground">
                Affichage de <strong>{(currentPage - 1) * limit + 1}</strong> à{" "}
                <strong>{Math.min(currentPage * limit, universities.length)}</strong> sur{" "}
                <strong>{universities.length}</strong> universités
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
                  {[1, 2, 3].map((page) => (
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
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(currentPage + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer l&apos;université{" "}
              <strong>{selectedUniversity?.name}</strong> ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-lg bg-muted p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Nom</p>
                  <p className="font-medium text-lg">{selectedUniversity?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Localisation</p>
                  <p className="font-medium">{selectedUniversity?.location || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Étudiants</p>
                  <p className="font-medium">
                    {selectedUniversity?.studentCount?.toLocaleString() || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Statut Sponsor</p>
                  <p className="font-medium">
                    {selectedUniversity?.isSponsor ? "Sponsor" : "Non-sponsor"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Diplômes</p>
                  <p className="font-medium">{selectedUniversity?.degrees?.length || 0}</p>
                </div>
                {selectedUniversity?.website && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Site web</p>
                    <a 
                      href={selectedUniversity.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:underline flex items-center"
                    >
                      {selectedUniversity.website}
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedUniversity && handleDelete(selectedUniversity.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer définitivement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog d'export */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exporter les universités</DialogTitle>
            <DialogDescription>
              Sélectionnez le format d&lsquo;export souhaité.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Format d&apos;export</label>
              <Select
                value={exportFormat}
                onValueChange={(value: "csv" | "json") => setExportFormat(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV (Excel)</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">
                L&apos;export inclura toutes les universités avec leurs diplômes associés.
                Le fichier sera téléchargé automatiquement après l&apos;export.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsExportDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Export en cours...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Exporter maintenant
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}