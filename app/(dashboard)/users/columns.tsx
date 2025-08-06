import {ColumnDef} from '@tanstack/react-table';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {
    MoreHorizontal,
    Edit,
    Trash2,
    User as UserIcon,
    Mail,
    ArrowUpDown,
    Copy,
    Crown,
    UserCheck
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { User } from '@/types/entities';

// Fonction pour déterminer le rôle de l'utilisateur
const getUserRole = (user: User) => {
    if (user.role === 'admin') {
        return {role: 'admin', label: 'Administrateur', color: 'bg-red-500', icon: Crown};
    }
    return {role: 'client', label: 'Client', color: 'bg-green-500', icon: UserCheck};
};

// Fonction pour générer un avatar basé sur les initiales
const getInitials = (email: string) => {
    return email.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

// Interface pour les handlers d'actions
interface UserColumnActions {
    onEdit: (user: User) => void;
    onDelete: (userId: number) => void;
    currentUserId: number;
}

export const createUserColumns = (actions: UserColumnActions): ColumnDef<User>[] => [
    {
        accessorKey: 'email',
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                    <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4"/>
                        Utilisateur
                        <ArrowUpDown className="ml-2 h-3 w-3"/>
                    </div>
                </Button>
            );
        },
        cell: ({row}) => {
            const userRole = getUserRole(row.original);
            const initials = getInitials(row.original.email);

            return (
                <div className="flex items-center gap-3">
                    <div
                        className={`w-10 h-10 rounded-full ${userRole.color} flex items-center justify-center text-white font-semibold text-sm`}>
                        {initials}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium text-sm">{row.original.email}</span>
                        <span className="text-xs text-muted-foreground">
                            ID: {row.original.id}
                        </span>
                    </div>
                </div>
            );
        }
    },
    {
        accessorKey: 'role',
        header: 'Rôle',
        cell: ({row}) => {
            const userRole = getUserRole(row.original);
            const IconComponent = userRole.icon;
            return (
                <Badge
                    variant="secondary"
                    className={`${userRole.color} text-white gap-1`}
                >
                    <IconComponent className="h-3 w-3"/>
                    {userRole.label}
                </Badge>
            );
        }
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({row}) => {
            const user = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
                            <span className="sr-only">Ouvrir le menu d&apos;actions</span>
                            <MoreHorizontal className="h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel className="font-semibold place-self-center">
                            Actions
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator/>

                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(user.id.toString())}
                            className="gap-2 cursor-pointer"
                        >
                            <Copy className="h-4 w-4"/>
                            Copier l&apos;ID
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(user.email)}
                            className="gap-2 cursor-pointer"
                        >
                            <Mail className="h-4 w-4"/>
                            Copier l&apos;email
                        </DropdownMenuItem>

                        <DropdownMenuSeparator/>

                        <DropdownMenuItem
                            onClick={() => actions.onEdit(user)}
                            className="gap-2 cursor-pointer"
                        >
                            <Edit className="h-4 w-4"/>
                            Modifier l&apos;utilisateur
                        </DropdownMenuItem>

                        <DropdownMenuSeparator/>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                    className={`gap-2 cursor-pointer ${user.id === actions.currentUserId ? 'text-muted-foreground opacity-50' : 'text-red-600 focus:text-red-600 focus:bg-red-50'}`}
                                    disabled={user.id === actions.currentUserId}
                                >
                                    <Trash2 className="h-4 w-4"/>
                                    {user.id === actions.currentUserId ? 'Impossible (vous-même)' : 'Supprimer'}
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Êtes-vous sûr de vouloir supprimer l&apos;utilisateur &quot;{user.email}&quot; ?
                                        Cette action est irréversible et supprimera toutes les données associées
                                        (notes, recommandations, etc.).
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => actions.onDelete(user.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                        disabled={user.id === actions.currentUserId}
                                    >
                                        {user.id === actions.currentUserId ? 'Impossible (vous-même)' : 'Supprimer définitivement'}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    }
];