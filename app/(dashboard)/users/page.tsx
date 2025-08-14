'use client';

import {DataTable} from '@/components/ui/data-table';
import {createUserColumns} from './columns';
import {useEffect, useState} from 'react';
import {getAllUsers, deleteUser} from '@/lib/services/usersAdminService';
import {User} from '@/types/entities';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Badge} from '@/components/ui/badge';
import {Skeleton} from '@/components/ui/skeleton';
import {UserFormDialog} from '@/components/users/UserFormDialog';
import {
    Users,
    UserCheck,
    Search,
    Shield,
    Crown
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function UsersPage() {
    const [data, setData] = useState<User[]>([]);
    const [filteredData, setFilteredData] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPermissions, setFilterPermissions] = useState('all');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<number>();

    useEffect(() => {
        // Récupérer l'ID de l'utilisateur actuel depuis le localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            setCurrentUserId(user.id);
        }
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const usersData = await getAllUsers();
            setData(usersData);
            setFilteredData(usersData);
        } catch (error) {
            console.error('❌ Error loading users:', error);
            setData([]);
            setFilteredData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Filtrage et recherche
    useEffect(() => {
        let filtered = data;

        // Recherche par email
        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filtrage par rôle
        if (filterPermissions !== 'all') {
            filtered = filtered.filter(user => user.permissions === filterPermissions);
        }

        setFilteredData(filtered);
    }, [data, searchTerm, filterPermissions]);

    // Calculs des statistiques
    const totalUsers = data.length;
    const adminUsers = data.filter(u => u.permissions === 'admin').length;
    const clientUsers = data.filter(u => u.permissions === 'client').length;

    // Handlers pour les actions CRUD
    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setIsFormOpen(true);
    };

    const handleDeleteUser = async (userId: number) => {
        // Protection : empêcher l'admin de se supprimer lui-même
        if (userId === currentUserId) {
            alert('Vous ne pouvez pas supprimer votre propre compte !');
            return;
        }

        if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            try {
                await deleteUser(userId);
                await loadData(); // Recharger les données
            } catch (error) {
                console.error('❌ Error deleting user:', error);
                alert('Erreur lors de la suppression de l\'utilisateur');
            }
        }
    };

    const handleFormSuccess = async () => {
        setIsFormOpen(false);
        setSelectedUser(null);
        await loadData(); // Recharger les données après création/modification
    };

    // Créer les colonnes avec les handlers
    const columns = createUserColumns({
        onEdit: handleEditUser,
        onDelete: handleDeleteUser,
        currentUserId: currentUserId ?? 0
    });

    if (loading) {
        return (
            <div className="p-6 space-y-6">
                {/* En-tête avec titre et actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <Skeleton className="h-10 w-72 mb-2" />
                        <Skeleton className="h-4 w-96" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-10 w-28" />
                        <Skeleton className="h-10 w-28" />
                        <Skeleton className="h-10 w-40" />
                    </div>
                </div>

                {/* Cartes de statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader className="pb-2">
                                <Skeleton className="h-4 w-24" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-16 mb-1" />
                                <Skeleton className="h-3 w-32" />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Barre de recherche et filtres */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Skeleton className="h-10 w-full sm:w-72" />
                            <Skeleton className="h-10 w-full sm:w-48" />
                        </div>
                    </CardContent>
                </Card>

                {/* Tableau des données */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <Skeleton className="h-6 w-40 mb-2" />
                                <Skeleton className="h-4 w-64" />
                            </div>
                            <Skeleton className="h-6 w-16" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {/* Skeleton pour le tableau */}
                        <div className="space-y-2 p-4">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="flex gap-4">
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                    <Skeleton className="h-8 w-32" />
                                    <Skeleton className="h-8 w-32" />
                                    <Skeleton className="h-8 w-24" />
                                    <Skeleton className="h-8 w-16" />
                                    <Skeleton className="h-8 w-16" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* En-tête avec titre et actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Users className="h-6 w-6 text-primary"/>
                        </div>
                        Gestion des Utilisateurs
                    </h1>
                    <p className="text-muted-foreground">
                        Consultez et modifiez les comptes utilisateurs existants
                    </p>
                </div>
            </div>

            {/* Cartes de statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalUsers}</div>
                        <p className="text-xs text-muted-foreground">
                            utilisateurs enregistrés
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Admins</CardTitle>
                        <Crown className="h-4 w-4 text-red-500"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{adminUsers}</div>
                        <p className="text-xs text-muted-foreground">
                            administrateurs
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Clients</CardTitle>
                        <UserCheck className="h-4 w-4 text-green-500"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{clientUsers}</div>
                        <p className="text-xs text-muted-foreground">
                            clients
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Barre de recherche et filtres */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                            <Input
                                placeholder="Rechercher email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <Select value={filterPermissions} onValueChange={setFilterPermissions}>
                            <SelectTrigger className="w-full sm:w-48">
                                <Shield className="h-4 w-4 mr-2"/>
                                <SelectValue placeholder="Rôle"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les rôles</SelectItem>
                                <SelectItem value="admin">Administrateurs</SelectItem>
                                <SelectItem value="client">Clients</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {(searchTerm || filterPermissions !== 'all') && (
                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                            <p className="text-sm text-muted-foreground">
                                {filteredData.length} résultat{filteredData.length > 1 ? 's' : ''} trouvé{filteredData.length > 1 ? 's' : ''}
                            </p>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilterPermissions('all');
                                }}
                            >
                                Réinitialiser
                            </Button>
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
                                <Users className="h-5 w-5"/>
                                Liste des Utilisateurs
                            </CardTitle>
                            <CardDescription>
                                Consultez et modifiez les comptes utilisateurs
                            </CardDescription>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                            {filteredData.length} / {data.length} users
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

            {/* Dialog pour la création/modification d'utilisateurs */}
            <UserFormDialog
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                user={selectedUser}
                onSuccess={handleFormSuccess}
                currentUserId={currentUserId}
            />
        </div>
    );
}