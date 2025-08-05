/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {DataTable} from '@/components/ui/data-table';
import {createColumns} from './columns';
import {useEffect, useState} from 'react';
import {getAllDegrees, deleteDegree, exportDegrees} from '@/lib/services/degreeAdminService'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Badge} from '@/components/ui/badge';
import {Skeleton} from '@/components/ui/skeleton';
import {DegreeFormDialog} from '@/components/degrees/DegreeFormDialog';
import {
    Plus,
    GraduationCap,
    Search,
    RefreshCw,
    FileUp,
    Edit,
    ChevronDown,
    Building,
} from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import {ScrollArea} from '@/components/ui/scroll-area';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Degree } from '@/types/entities';
import { toast } from '@/hooks/use-toast';

export default function DegreesPage() {
    const [data, setData] = useState<Degree[]>([]);
    const [filteredData, setFilteredData] = useState<Degree[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDegree, setSelectedDegree] = useState<Degree | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    // Charger les données
    const loadData = async () => {
        setLoading(true);
        try {
            // Utilise le service optimisé qui fait un seul appel API
            const degreesData = await getAllDegrees();

            // Ajouter des logs pour diagnostiquer la structure des données
            if (degreesData && degreesData.length > 0) {
                console.log('📊 Structure du premier diplôme:', JSON.stringify(degreesData[0], null, 2));
                console.log('🔑 Clés disponibles dans les données:', Object.keys(degreesData[0]));
            }

            // Les universités sont déjà incluses dans les données pour l'affichage
            const enrichedDegrees = degreesData.map((degree: any) => {
                // Vérifier si universities existe et est un tableau
                const universities = Array.isArray(degree.universities) ? degree.universities : [];
                // Log pour chaque diplôme
                console.log(`🏫 Diplôme "${degree.name}": ${universities.length} universités trouvées`);
                return {
                    ...degree,
                    associatedUniversities: universities
                };
            });

            console.log(`✅ [DegreesPage] ${enrichedDegrees.length} diplômes chargés avec leurs universités`);
            setData(enrichedDegrees);
            setFilteredData(enrichedDegrees);
        } catch (error) {
            console.error('❌ Erreur lors du chargement des diplômes:', error);
            toast({
                title: "Erreur",
                description: "Impossible de charger les diplômes",
                variant: "destructive",
            });
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
            filtered = filtered.filter(degree =>
                (degree.name && degree.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (degree.description && degree.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        setFilteredData(filtered);
    }, [data, searchTerm]);

    // Actions CRUD
    const handleEdit = (degree: Degree) => {
        setSelectedDegree(degree);
        setIsFormOpen(true);
    };

    const handleView = (degree: Degree) => {
        setSelectedDegree(degree);
        setIsDetailsOpen(true);
    };

    const handleDelete = async (degreeId: string) => {
        try {
            await deleteDegree(degreeId);
            await loadData(); // Recharger les données
            toast({
                title: "Succès",
                description: "Diplôme supprimé avec succès",
            });
        } catch (error) {
            console.error('❌ Erreur lors de la suppression:', error);
            toast({
                title: "Erreur",
                description: "Impossible de supprimer le diplôme",
                variant: "destructive",
            });
        }
    };

    const handleFormSuccess = async () => {
        await loadData();
        setSelectedDegree(null);
        toast({
            title: "Succès",
            description: selectedDegree ? "Diplôme modifié avec succès" : "Diplôme créé avec succès",
        });
    };

    const handleNewDegree = () => {
        setSelectedDegree(null);
        setIsFormOpen(true);
    };

    const handleExport = async (format: 'csv' | 'json' = 'json') => {
        setIsExporting(true);
        try {
            const exportData = await exportDegrees(format);
            
            if (format === 'csv') {
                // Pour CSV, les données sont déjà en format texte
                const blob = new Blob([exportData], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `degrees_${new Date().toISOString().split('T')[0]}.csv`;
                link.click();
            } else {
                // Pour JSON
                const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json;charset=utf-8;' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `degrees_${new Date().toISOString().split('T')[0]}.json`;
                link.click();
            }
            
            toast({
                title: "Succès",
                description: `Export ${format.toUpperCase()} réussi`,
            });
        } catch (error) {
            console.error('❌ Erreur lors de l\'export:', error);
            toast({
                title: "Erreur",
                description: "Erreur lors de l'export",
                variant: "destructive",
            });
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
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
                        Gestion des Diplômes
                    </h1>
                    <p className="text-muted-foreground">
                        Gérez les diplômes d&apos;enseignement supérieur et leurs associations
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
                    
                    <Button onClick={handleNewDegree} className="gap-2">
                        <Plus className="h-4 w-4"/>
                        Nouveau diplôme
                    </Button>
                </div>
            </div>

            {/* Cartes de statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Diplômes</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.length}</div>
                        <p className="text-xs text-muted-foreground">
                            diplômes disponibles
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
                            diplômes affichés
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Universités Associées</CardTitle>
                        <Building className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Set(data.flatMap(d => (d as any).associatedUniversities?.map((u: any) => u.id) || [])).size}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            universités partenaires
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
                                placeholder="Rechercher par nom ou description..."
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
                                Liste des Diplômes
                            </CardTitle>
                            <CardDescription>
                                Consultez et modifiez les diplômes d&apos;enseignement supérieur
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
            <DegreeFormDialog
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                degree={selectedDegree}
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
                            Détails du diplôme
                        </SheetTitle>
                        <SheetDescription>
                            Informations complètes sur le diplôme sélectionné
                        </SheetDescription>
                    </SheetHeader>

                    {selectedDegree && (
                        <ScrollArea className="h-[calc(100vh-200px)] mt-6">
                            <div className="space-y-6 pr-4">
                                {/* Header avec nom */}
                                <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 rounded-lg border">
                                    <div className="flex items-center justify-between mb-2">
                                        <Badge className="text-base font-semibold px-4 py-2">
                                            {selectedDegree.name}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                            ID: {selectedDegree.id.slice(0, 8)}...
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {selectedDegree.description || 'Aucune description disponible'}
                                    </p>
                                </div>

                                {/* Universités associées */}
                                <div className="bg-card border rounded-lg p-4">
                                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                        🏫 Universités associées
                                        <Badge variant="secondary" className="ml-auto">
                                            {((selectedDegree as any).associatedUniversities || []).length} université{((selectedDegree as any).associatedUniversities || []).length > 1 ? 's' : ''}
                                        </Badge>
                                    </h4>
                                    <div className="grid gap-2">
                                        {((selectedDegree as any).associatedUniversities || []).length > 0 ? (
                                            ((selectedDegree as any).associatedUniversities || []).map((university: any) => (
                                                <div key={university.id} className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                                                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                                                    <div className="flex-1">
                                                        <span className="font-medium text-sm">{university.name}</span>
                                                        {university.isSponsor && (
                                                            <Badge variant="default" className="ml-2 text-xs">
                                                                ⭐ Sponsor
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-4 text-muted-foreground">
                                                <p className="text-sm">Aucune université associée</p>
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
                                                {selectedDegree.id}
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
                                    if (selectedDegree) handleEdit(selectedDegree);
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
            <Sheet>
                <SheetContent>
                    <div>
                        <div>
                            <div className="flex gap-2 pt-4 border-t">
                                <Button
                                    onClick={() => {
                                        setIsDetailsOpen(false);
                                        if (selectedDegree) {
                                            handleEdit(selectedDegree);
                                        }
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
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
