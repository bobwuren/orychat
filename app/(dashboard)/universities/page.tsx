"use client"
import {DataTable} from "@/components/ui/data-table"
import {createColumns} from './columns';
import {UniversityFormDialog} from '@/components/universities/UniversityFormDialog';
import {getAllUniversities, deleteUniversity} from '@/lib/services/universityAdminService';
import {Card, CardHeader, CardTitle, CardContent} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Badge} from '@/components/ui/badge';
import {Skeleton} from '@/components/ui/skeleton';
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription} from '@/components/ui/sheet';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Plus, Globe, RefreshCw, Search, ChevronDown, Edit, FileUp} from 'lucide-react';
import {useEffect, useState} from "react"
import { University } from "@/types/entities";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function UniversitiesPage() {
    const [data, setData] = useState<University[]>([]);
    const [filteredData, setFilteredData] = useState<University[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    // Charger les données
    const loadData = async () => {
        setLoading(true);
        try {
            const universities = await getAllUniversities();
            setData(universities);
            setFilteredData(universities);
        } catch (error) {
            console.error('❌ Erreur lors du chargement des universités:', error);
            setData([]);
            setFilteredData([]);
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
            filtered = filtered.filter(u =>
                u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredData(filtered);
    }, [data, searchTerm]);

    // Actions CRUD
    const handleEdit = (university: University) => {
        setSelectedUniversity(university);
        setIsFormOpen(true);
    };
    const handleView = (university: University) => {
        setSelectedUniversity(university);
        setIsDetailsOpen(true);
    };
    const handleDelete = async (universityId: number) => {
        try {
            await deleteUniversity(universityId);
            await loadData();
        } catch (error) {
            console.error('❌ Erreur lors de la suppression:', error);
        }
    };
    const handleFormSuccess = async () => {
        await loadData();
        setSelectedUniversity(null);
    };
    const handleNewUniversity = () => {
        setSelectedUniversity(null);
        setIsFormOpen(true);
    };

    const handleExport = async (format: 'csv' | 'json') => {
        setIsExporting(true);
        try {
            const { exportAllUniversities } = await import('@/lib/services/universityAdminService');
            const exportData = await exportAllUniversities(format);
            
            // Créer et télécharger le fichier
            const blob = format === 'csv' 
                ? new Blob([exportData], { type: 'text/csv;charset=utf-8;' })
                : new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json;charset=utf-8;' });
            
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `universities_${new Date().toISOString().split('T')[0]}.${format}`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            console.log('✅ Export réussi:', format);
        } catch (error) {
            console.error('❌ Erreur lors de l\'export:', error);
        } finally {
            setIsExporting(false);
        }
    };

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
                            <Globe className="h-6 w-6 text-primary"/>
                        </div>
                        Gestion des Universités
                    </h1>
                    <p className="text-muted-foreground">
                        Gérez les universités et leurs formations proposées
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2" onClick={loadData} disabled={loading}>
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}/>
                        Actualiser
                    </Button>
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            {/* <Button variant="outline" size="sm" className="gap-2" disabled={isExporting}>
                                <Download className="h-4 w-4"/>
                                Exporter
                            </Button> */}
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
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleExport('json')}>
                                Exporter en JSON
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExport('csv')}>
                                Exporter en CSV
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <Button onClick={handleNewUniversity} className="gap-2">
                        <Plus className="h-4 w-4"/>
                        Nouvelle université
                    </Button>
                </div>
            </div>
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Universités</CardTitle>
                        <Globe className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.length}</div>
                        <p className="text-xs text-muted-foreground">universités enregistrées</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sponsors</CardTitle>
                        <Badge className="h-4 w-4 text-xs"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.filter(u => u.isSponsor).length}</div>
                        <p className="text-xs text-muted-foreground">universités sponsors</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Formations totales</CardTitle>
                        <Badge className="h-4 w-4 text-xs"/>
                    </CardHeader>
                    <CardContent>
                        <div
                            className="text-2xl font-bold">{data.reduce((acc, u) => acc + (u.degrees?.length || 0), 0)}</div>
                        <p className="text-xs text-muted-foreground">formations proposées</p>
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
                            <Button variant="ghost" size="sm" onClick={() => setSearchTerm('')}>
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
                                <Globe className="h-5 w-5"/>
                                Liste des Universités
                            </CardTitle>
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
            <UniversityFormDialog
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                university={selectedUniversity}
                onSuccess={handleFormSuccess}
            />
            {/* Sheet de détails */}
            <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <SheetContent className="sm:max-w-[600px]">
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Globe className="h-4 w-4 text-primary"/>
                            </div>
                            Détails de l&apos;université
                        </SheetTitle>
                        <SheetDescription>
                            Informations complètes sur l&apos;université sélectionnée
                        </SheetDescription>
                    </SheetHeader>
                    
                    {selectedUniversity && (
                        <ScrollArea className="h-[calc(100vh-200px)] mt-6">
                            <div className="space-y-6 pr-4">
                                {/* Header avec nom */}
                                <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 rounded-lg border">
                                    <div className="flex items-center justify-between mb-2">
                                        <Badge className="text-base font-semibold px-4 py-2">
                                            {selectedUniversity.name}
                                        </Badge>
                                        <Badge variant={selectedUniversity.isSponsor ? 'default' : 'secondary'}>
                                            {selectedUniversity.isSponsor ? '⭐ Sponsor' : 'Standard'}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {selectedUniversity.description}
                                    </p>
                                </div>

                                {/* Informations générales */}
                                <div className="grid gap-4">
                                    <div className="bg-card border rounded-lg p-4">
                                        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                            <Globe className="h-4 w-4"/>
                                            Site web
                                        </h4>
                                        {selectedUniversity.webSite ? (
                                            <a 
                                                href={selectedUniversity.webSite} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-primary hover:text-primary/80 text-sm font-medium hover:underline"
                                            >
                                                <Globe className="h-3 w-3"/>
                                                {selectedUniversity.webSite}
                                            </a>
                                        ) : (
                                            <span className="text-muted-foreground text-sm">Non renseigné</span>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Formations */}
                                <div className="bg-card border rounded-lg p-4">
                                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                        🎓 Formations proposées
                                        <Badge variant="secondary" className="ml-auto">
                                            {selectedUniversity.degrees?.length || 0} formation{(selectedUniversity.degrees?.length || 0) > 1 ? 's' : ''}
                                        </Badge>
                                    </h4>
                                    <div className="grid gap-2">
                                        {selectedUniversity.degrees && selectedUniversity.degrees.length > 0 ? (
                                            selectedUniversity.degrees.map((degree, index) => (
                                                <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                                                    <Badge variant="outline" className="text-xs">
                                                        {typeof degree === 'string' ? degree : degree.name}
                                                    </Badge>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-4 text-muted-foreground">
                                                <p className="text-sm">Aucune formation renseignée</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Métadonnées */}
                                <div className="bg-card border rounded-lg p-4">
                                    <h4 className="font-semibold text-sm mb-3">Métadonnées</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center py-2 border-b border-muted">
                                            <span className="text-sm font-medium text-muted-foreground">Date de création</span>
                                            <span className="text-sm">
                                                {selectedUniversity.createdAt 
                                                    ? new Date(selectedUniversity.createdAt).toLocaleDateString('fr-FR', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })
                                                    : 'Non renseignée'
                                                }
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-sm font-medium text-muted-foreground">Identifiant</span>
                                            <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                                                {selectedUniversity.id}
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
                                    if (selectedUniversity) handleEdit(selectedUniversity);
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