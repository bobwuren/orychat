/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {DataTable} from '@/components/ui/data-table';
import {createColumns} from './columns';
import {useEffect, useState} from 'react';
import {getAllSeries, deleteSerie, exportSeries} from '@/lib/services/serieAdminService'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Badge} from '@/components/ui/badge';
import {Skeleton} from '@/components/ui/skeleton';
import {SerieFormDialog} from '@/components/series/SerieFormDialog';
import {
    Plus,
    GraduationCap,
    Search,
    RefreshCw,
    FileUp,
    ChevronDown,
    Edit,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import {ScrollArea} from '@/components/ui/scroll-area';
import { Serie } from '@/types/entities';

export default function SeriesPage() {
    const [data, setData] = useState<Serie[]>([]);
    const [filteredData, setFilteredData] = useState<Serie[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSerie, setSelectedSerie] = useState<Serie | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    // Charger les données
    const loadData = async () => {
        setLoading(true);
        try {
            const seriesData = await getAllSeries();
            
            // Les données viennent déjà enrichies avec les subjects !
            const enrichedSeries = seriesData.map((serie: any) => ({
                ...serie,
                subjects: serie.subjects || [] // Utiliser directement les subjects fournis par l'API
            }));
            
            setData(enrichedSeries);
            setFilteredData(enrichedSeries);
        } catch (error) {
            console.error('❌ Erreur lors du chargement des séries:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Filtrage par recherche
    useEffect(() => {
        let filtered = data;

        if (searchTerm) {
            filtered = filtered.filter(serie =>
                serie.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                serie.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredData(filtered);
    }, [data, searchTerm]);

    // Actions CRUD
    const handleEdit = (serie: Serie) => {
        setSelectedSerie(serie);
        setIsFormOpen(true);
    };

    const handleView = (serie: Serie) => {
        setSelectedSerie(serie);
        setIsDetailsOpen(true);
    };

    const handleDelete = async (serieId: number) => {
        try {
            await deleteSerie(serieId);
            await loadData(); // Recharger les données
        } catch (error) {
            console.error('❌ Erreur lors de la suppression:', error);
        }
    };

    const handleFormSuccess = async () => {
        await loadData();
        setSelectedSerie(null);
    };

    const handleNewSerie = () => {
        setSelectedSerie(null);
        setIsFormOpen(true);
    };

    const handleExport = async (format: 'csv' | 'json' = 'json') => {
        setIsExporting(true);
        try {
            const exportData = await exportSeries(format);
            
            if (format === 'csv') {
                // Pour CSV, les données sont déjà en format texte
                const blob = new Blob([exportData], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `series_${new Date().toISOString().split('T')[0]}.csv`;
                link.click();
            } else {
                // Pour JSON
                const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json;charset=utf-8;' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `series_${new Date().toISOString().split('T')[0]}.json`;
                link.click();
            }
            
            // console.log('✅ Export réussi:', format);
        } catch (error) {
            console.error('❌ Erreur lors de l\'export:', error);
        } finally {
            setIsExporting(false);
        }
    };

    // Colonnes avec les callbacks
    const columns = createColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        onView: handleView,
    });

    if (loading) {
        return (
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-64"/>
                        <Skeleton className="h-4 w-96"/>
                    </div>
                    <Skeleton className="h-10 w-40"/>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(2)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader className="pb-2">
                                <Skeleton className="h-4 w-24"/>
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-16 mb-1"/>
                                <Skeleton className="h-3 w-32"/>
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
                        <div className="space-y-3">
                            {[...Array(6)].map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full"/>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* En-tête */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <GraduationCap className="h-6 w-6 text-primary"/>
                        </div>
                        Gestion des Séries
                    </h1>
                    <p className="text-muted-foreground">
                        Gérez les séries d&apos;études et leurs spécialisations
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={loadData}
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
                    
                    <Button onClick={handleNewSerie} className="gap-2">
                        <Plus className="h-4 w-4"/>
                        Nouvelle série
                    </Button>
                </div>
            </div>

            {/* Cartes de statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Séries</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.length}</div>
                        <p className="text-xs text-muted-foreground">
                            séries disponibles
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Résultats Filtrés</CardTitle>
                        <Search className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{filteredData.length}</div>
                        <p className="text-xs text-muted-foreground">
                            séries affichées
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Barre de recherche */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                            <Input
                                placeholder="Rechercher par code ou description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        {searchTerm && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSearchTerm('')}
                            >
                                Effacer
                            </Button>
                        )}
                    </div>

                    {searchTerm && (
                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                            <p className="text-sm text-muted-foreground">
                                {filteredData.length} résultat{filteredData.length > 1 ? 's' : ''} trouvé{filteredData.length > 1 ? 's' : ''}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Tableau des données */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <GraduationCap className="h-5 w-5"/>
                                Liste des Séries
                            </CardTitle>
                            <CardDescription>
                                Consultez et modifiez les séries d&apos;études disponibles
                            </CardDescription>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                            {filteredData.length} / {data.length}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <DataTable
                        columns={columns}
                        data={filteredData}
                    />
                </CardContent>
            </Card>

            {/* Dialog de formulaire */}
            <SerieFormDialog
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                serie={selectedSerie}
                onSuccess={handleFormSuccess}
            />
            
            {/* Sheet de détails */}
            <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <SheetContent className="sm:max-w-[600px]">
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <GraduationCap className="h-4 w-4 text-primary"/>
                            </div>
                            Détails de la série
                        </SheetTitle>
                        <SheetDescription>
                            Informations complètes sur la série sélectionnée
                        </SheetDescription>
                    </SheetHeader>

                    {selectedSerie && (
                        <ScrollArea className="h-[calc(100vh-200px)] mt-6">
                            <div className="space-y-6 pr-4">
                                {/* Header avec code et description */}
                                <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 rounded-lg border">
                                    <div className="flex items-center justify-between mb-2">
                                        <Badge className="text-base font-semibold px-4 py-2 font-mono">
                                            {selectedSerie.code}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                            ID: {selectedSerie.id}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {selectedSerie.description || 'Aucune description disponible'}
                                    </p>
                                </div>

                                {/* Matières associées */}
                                <div className="bg-card border rounded-lg p-4">
                                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                        📚 Matières et coefficients
                                        <Badge variant="secondary" className="ml-auto">
                                            {(selectedSerie.subjects || []).length} matière{(selectedSerie.subjects || []).length > 1 ? 's' : ''}
                                        </Badge>
                                    </h4>
                                    <div className="grid gap-2">
                                        {(selectedSerie.subjects || []).length > 0 ? (
                                            (selectedSerie.subjects || []).map((subject: any, index: number) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                                                        <span className="font-medium text-sm">
                                                            {subject.name || subject.subjectName || 'Matière inconnue'}
                                                        </span>
                                                    </div>
                                                    <Badge variant="outline" className="text-xs">
                                                        Coeff. {subject.coefficient || 1}
                                                    </Badge>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-4 text-muted-foreground">
                                                <p className="text-sm">Aucune matière associée</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Métadonnées */}
                                <div className="bg-card border rounded-lg p-4">
                                    <h4 className="font-semibold text-sm mb-3">Métadonnées</h4>
                                    <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2">
                                            <span className="text-sm font-medium text-muted-foreground">Identifiant complet</span>
                                            <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                                                {selectedSerie.id}
                                            </code>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    )}
                    
                    {/* Actions en bas */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-background border-t">
                        <div className="flex gap-2">
                            <Button 
                                onClick={() => {
                                    setIsDetailsOpen(false);
                                    if (selectedSerie) handleEdit(selectedSerie);
                                }} 
                                className="flex-1 gap-2"
                            >
                                <Edit className="h-4 w-4"/>
                                Modifier
                            </Button>
                            <Button 
                                variant="outline" 
                                onClick={() => setIsDetailsOpen(false)} 
                                className="flex-1"
                            >
                                Fermer
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}