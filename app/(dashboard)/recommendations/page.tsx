"use client"

import {useState, useEffect} from "react"
import {Search, Eye, BarChart3, RefreshCw, FileUp, ChevronDown} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {DataTable} from "@/components/ui/data-table"
import {Input} from "@/components/ui/input"
import {Skeleton} from "@/components/ui/skeleton"
import {toast} from "@/hooks/use-toast"
import {getAllRecommendations, exportRecommendations} from "@/lib/services/recommendationAdminService"
import {Recommendation} from "@/types/entities"
import {columns} from "./columns"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import {ScrollArea} from "@/components/ui/scroll-area"

export default function RecommendationsPage() {
    const [recommendations, setRecommendations] = useState<Recommendation[]>([])
    const [filteredRecommendations, setFilteredRecommendations] = useState<Recommendation[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [serieFilter, setSerieFilter] = useState("all")
    const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [isExporting, setIsExporting] = useState(false)

    // Statistiques calculées
    const stats = {
        total: recommendations.length,
        thisMonth: recommendations.filter(r => {
            const date = new Date(r.createdAt)
            const now = new Date()
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
        }).length,
        uniqueUsers: new Set(recommendations.map(r => r.userId)).size,
        topSeries: (() => {
            const seriesCounts = recommendations.reduce((acc, r) => {
                acc[r.serieCode || 'Inconnu'] = (acc[r.serieCode || 'Inconnu'] || 0) + 1
                return acc
            }, {} as Record<string, number>)
            const topSerie = Object.entries(seriesCounts).sort(([, a], [, b]) => b - a)[0]
            return topSerie ? {name: topSerie[0], count: topSerie[1]} : null
        })()
    }

    // Obtenir la liste unique des séries pour le filtre
    const uniqueSeries = Array.from(new Set(recommendations.map(r => r.serieCode || 'Inconnu')))

    const loadRecommendations = async () => {
        setLoading(true)
        try {
            const data = await getAllRecommendations()
            setRecommendations(data)
            setFilteredRecommendations(data)
            toast({
                title: "Recommandations chargées",
                description: `${data.length} recommandations trouvées`,
            })
        } catch (error) {
            console.error('❌ Erreur lors du chargement des recommandations:', error)
            toast({
                title: "Erreur de chargement",
                description: "Impossible de charger les recommandations",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleView = (recommendation: Recommendation) => {
        setSelectedRecommendation(recommendation)
        setIsDetailsOpen(true)
    }

    const handleExport = async (format: 'csv' | 'json' = 'json') => {
        setIsExporting(true)
        try {
            const exportData = await exportRecommendations()

            if (format === 'csv') {
                // Convertir les données en CSV
                const csvContent = convertToCSV(filteredRecommendations)
                const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'})
                const link = document.createElement('a')
                link.href = URL.createObjectURL(blob)
                link.download = `recommendations_${new Date().toISOString().split('T')[0]}.csv`
                link.click()
            } else {
                // Pour JSON
                const blob = new Blob([JSON.stringify(filteredRecommendations, null, 2)], {type: 'application/json;charset=utf-8;'})
                const link = document.createElement('a')
                link.href = URL.createObjectURL(blob)
                link.download = `recommendations_${new Date().toISOString().split('T')[0]}.json`
                link.click()
            }

            // console.log('✅ Export réussi:', format)
            toast({
                title: "Export réussi",
                description: `Les recommandations ont été exportées en ${format.toUpperCase()}`,
            })
        } catch (error) {
            console.error('❌ Erreur lors de l\'export:', error)
            toast({
                title: "Erreur d'export",
                description: "Impossible d'exporter les recommandations",
                variant: "destructive",
            })
        } finally {
            setIsExporting(false)
        }
    }

    const convertToCSV = (data: Recommendation[]) => {
        const headers = ['ID', 'Email Utilisateur', 'Série', 'Date de Création', 'Nombre Orientations', 'Orientations']
        const rows = data.map(rec => [
            rec.id,
            rec.userEmail || 'Non disponible',
            rec.serieCode || 'Inconnu',
            new Date(rec.createdAt).toLocaleDateString('fr-FR'),
            rec.orientations.length.toString(),
            rec.orientations.map(o => o.name).join('; ')
        ])

        return [headers, ...rows].map(row =>
            row.map(field => `"${field?.toString().replace(/"/g, '""') || ''}"`).join(',')
        ).join('\n')
    }

    const applyFilters = (data: Recommendation[]) => {
        let filtered = data

        // Filtre par terme de recherche
        if (searchTerm) {
            filtered = filtered.filter(recommendation =>
                recommendation.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                recommendation.serieCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                recommendation.orientations.some(o =>
                    o.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    o.why?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    o.universities.some(u => u.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    o.degrees.some(d => d.name?.toLowerCase().includes(searchTerm.toLowerCase()))
                )
            )
        }

        // Filtre par série
        if (serieFilter !== "all") {
            filtered = filtered.filter(recommendation => recommendation.serieCode === serieFilter)
        }

        setFilteredRecommendations(filtered)
    }

    useEffect(() => {
        loadRecommendations()
    }, [])

    useEffect(() => {
        applyFilters(recommendations)
    }, [searchTerm, serieFilter, recommendations])

    if (loading) {
        return (
            <div className="flex-1 space-y-6 p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-9 w-80"/>
                        <Skeleton className="h-5 w-96"/>
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-9 w-28"/>
                        <Skeleton className="h-9 w-28"/>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <Skeleton className="h-4 w-32"/>
                                <Skeleton className="h-4 w-4"/>
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-16 mb-1"/>
                                <Skeleton className="h-3 w-24"/>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48"/>
                        <Skeleton className="h-4 w-80"/>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Skeleton className="h-10 flex-1"/>
                            <Skeleton className="h-10 w-48"/>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-48"/>
                                <Skeleton className="h-4 w-80"/>
                            </div>
                            <Skeleton className="h-6 w-16"/>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {[...Array(6)].map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full"/>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-6 p-6">
            {/* En-tête */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Eye className="h-6 w-6 text-primary"/>
                        </div>
                        Gestion des Recommandations
                    </h1>
                    <p className="text-muted-foreground">
                        Consultez et gérez les recommandations d&apos;orientation générées pour les utilisateurs
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={loadRecommendations}
                        disabled={loading}
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}/>
                        Actualiser
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                disabled={isExporting}
                            >
                                <FileUp className="h-4 w-4"/>
                                {isExporting ? 'Export...' : 'Exporter'}
                                <ChevronDown className="h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleExport('json')}>
                                Exporter en JSON
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExport('csv')}>
                                Exporter en CSV
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Cartes de statistiques */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Recommandations</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.thisMonth} ce mois-ci
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Utilisateurs Uniques</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.uniqueUsers}</div>
                        <p className="text-xs text-muted-foreground">
                            utilisateurs avec recommandations
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Série Populaire</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-bold truncate">
                            {stats.topSeries?.name || "Aucune"}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {stats.topSeries ? `${stats.topSeries.count} recommandations` : "Pas de données"}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filtres et recherche */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                            <Input
                                placeholder="Rechercher par utilisateur, série, université..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="sm:w-[200px]">
                            <Select value={serieFilter} onValueChange={setSerieFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filtrer par série"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Toutes les séries</SelectItem>
                                    {uniqueSeries.map((serie) => (
                                        <SelectItem key={serie} value={serie}>
                                            {serie}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {(searchTerm || serieFilter !== "all") && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setSearchTerm("")
                                    setSerieFilter("all")
                                }}
                            >
                                Effacer
                            </Button>
                        )}
                    </div>

                    {(searchTerm || serieFilter !== "all") && (
                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Filtres actifs:</span>
                                {searchTerm && (
                                    <Badge variant="secondary" className="text-xs">
                                        Recherche: {searchTerm}
                                    </Badge>
                                )}
                                {serieFilter !== "all" && (
                                    <Badge variant="secondary" className="text-xs">
                                        Série: {serieFilter}
                                    </Badge>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {filteredRecommendations.length} résultat{filteredRecommendations.length > 1 ? 's' : ''} trouvé{filteredRecommendations.length > 1 ? 's' : ''}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Tableau des recommandations */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="h-5 w-5"/>
                                Liste des Recommandations
                            </CardTitle>
                            <CardDescription>
                                Consultez les recommandations d&apos;orientation générées pour les utilisateurs
                            </CardDescription>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                            {filteredRecommendations.length} / {recommendations.length}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <DataTable
                        columns={columns(handleView)}
                        data={filteredRecommendations}
                    />
                </CardContent>
            </Card>

            {/* Sheet de visualisation détaillée */}
            <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <SheetContent className="sm:max-w-[700px] lg:max-w-[800px]">
                    <SheetHeader className="mb-4">
                        <SheetTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-primary"/>
                            Détails de la Recommandation
                        </SheetTitle>
                        <SheetDescription>
                            Informations complètes sur cette recommandation d&apos;orientation
                        </SheetDescription>
                    </SheetHeader>

                    {selectedRecommendation && (
                        <ScrollArea className="h-[calc(100vh-150px)]">
                            <div className="space-y-6 pr-4">
                                {/* Informations utilisateur */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Card>
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <div
                                                    className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-bold text-sm">
                            {selectedRecommendation.userEmail?.charAt(0).toUpperCase() || 'U'}
                          </span>
                                                </div>
                                                {selectedRecommendation.userEmail || 'Utilisateur anonyme'}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <div className="flex justify-between">
                                                <span
                                                    className="text-sm font-medium text-muted-foreground">Série:</span>
                                                <Badge
                                                    variant="outline">{selectedRecommendation.serieCode || 'Inconnu'}</Badge>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm font-medium text-muted-foreground">ID Utilisateur:</span>
                                                <code
                                                    className="text-xs bg-muted px-2 py-1 rounded">{selectedRecommendation.userId}</code>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-lg">Informations générales</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm font-medium text-muted-foreground">Date de création:</span>
                                                <span className="text-sm">
                          {new Date(selectedRecommendation.createdAt).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                          })}
                        </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span
                                                    className="text-sm font-medium text-muted-foreground">Heure:</span>
                                                <span className="text-sm">
                          {new Date(selectedRecommendation.createdAt).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit'
                          })}
                        </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Orientations détaillées */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <BarChart3 className="h-5 w-5 text-primary"/>
                                            Orientations Recommandées
                                            <Badge variant="secondary" className="ml-2">
                                                {selectedRecommendation.orientations.length}
                                            </Badge>
                                        </CardTitle>
                                        <CardDescription>
                                            Voici les orientations professionnelles recommandées selon le profil
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {selectedRecommendation.orientations.map((orientation, index) => (
                                                <Card key={index} className="border-l-4 border-l-primary">
                                                    <CardHeader className="pb-3">
                                                        <div className="flex items-center justify-between">
                                                            <CardTitle className="text-base flex items-center gap-2">
                                <span
                                    className="flex items-center justify-center w-6 h-6 bg-primary/10 text-primary rounded-full text-sm font-bold">
                                  {index + 1}
                                </span>
                                                                {orientation.name || `Orientation #${index + 1}`}
                                                            </CardTitle>
                                                            <Badge variant="outline" className="text-xs">
                                                                Priorité {index + 1}
                                                            </Badge>
                                                        </div>
                                                    </CardHeader>

                                                    <CardContent className="space-y-4">
                                                        {/* Explication */}
                                                        {orientation.why && (
                                                            <div
                                                                className="bg-muted/50 p-3 rounded-lg border-l-4 border-l-primary/50">
                                                                <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                                                    💡 Pourquoi cette orientation ?
                                                                </h5>
                                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                                    {orientation.why}
                                                                </p>
                                                            </div>
                                                        )}

                                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                            {/* Universités */}
                                                            <div>
                                                                <h6 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                                                    🏫 Universités recommandées
                                                                    <Badge variant="secondary" className="text-xs">
                                                                        {orientation.universities?.length || 0}
                                                                    </Badge>
                                                                </h6>
                                                                {orientation.universities && orientation.universities.length > 0 ? (
                                                                    <div className="space-y-2">
                                                                        {orientation.universities.map((uni, idx) => (
                                                                            <div key={idx}
                                                                                 className="flex items-center justify-between p-2 bg-muted/30 rounded border">
                                                                                <span
                                                                                    className="font-medium text-sm">{uni.name}</span>
                                                                                {uni.site && (
                                                                                    <a
                                                                                        href={uni.site}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        className="text-xs text-primary hover:underline"
                                                                                    >
                                                                                        Site web
                                                                                    </a>
                                                                                )}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <div
                                                                        className="text-center py-3 text-muted-foreground bg-muted/30 rounded border border-dashed">
                                                                        <p className="text-xs">Aucune université
                                                                            spécifiée</p>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Formations */}
                                                            <div>
                                                                <h6 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                                                    📚 Formations suggérées
                                                                    <Badge variant="secondary" className="text-xs">
                                                                        {orientation.degrees?.length || 0}
                                                                    </Badge>
                                                                </h6>
                                                                {orientation.degrees && orientation.degrees.length > 0 ? (
                                                                    <div className="space-y-2">
                                                                        {orientation.degrees.map((degree, idx) => (
                                                                            <div key={idx}
                                                                                 className="flex items-center justify-between p-2 bg-muted/30 rounded border">
                                                                                <span
                                                                                    className="font-medium text-sm">{degree.name}</span>
                                                                                {degree.articleLink && (
                                                                                    <a
                                                                                        href={degree.articleLink}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        className="text-xs text-primary hover:underline"
                                                                                    >
                                                                                        En savoir +
                                                                                    </a>
                                                                                )}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <div
                                                                        className="text-center py-3 text-muted-foreground bg-muted/30 rounded border border-dashed">
                                                                        <p className="text-xs">Aucune formation
                                                                            spécifiée</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </ScrollArea>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}