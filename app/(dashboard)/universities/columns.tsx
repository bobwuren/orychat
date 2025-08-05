import {ColumnDef} from '@tanstack/react-table';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {University} from '@/types/entities';
import {
    MoreHorizontal,
    Edit,
    Trash2,
    ArrowUpDown,
    Copy,
    Eye,
    Globe
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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {useState} from 'react';

interface UniversityColumnsProps {
    onEdit: (university: University) => void;
    onDelete: (universityId: string) => Promise<void>;
    onView: (university: University) => void;
}

export const createColumns = ({onEdit, onDelete, onView}: UniversityColumnsProps): ColumnDef<University>[] => [
    {
        accessorKey: 'name',
        header: ({column}) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-auto p-0 font-semibold hover:bg-transparent">
                <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4"/>
                    Université
                    <ArrowUpDown className="ml-2 h-3 w-3"/>
                </div>
            </Button>
        ),
        cell: ({row}) => {
            const name = row.original.name;
            const truncatedName = name.length > 25 ? name.substring(0, 25) + '...' : name;
            const shouldTruncate = name.length > 25;

            return (
                <div className="flex flex-col">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span 
                                    className="font-medium text-sm leading-tight cursor-pointer"
                                    onClick={(e) => {
                                        // Pour mobile : ouvrir/fermer au clic
                                        e.stopPropagation();
                                    }}
                                >
                                    <Badge
                                        variant="secondary"
                                        className="bg-primary/10 text-primary font-mono text-sm px-3 py-1 w-fit hover:bg-primary/20 transition-colors"
                                    > 
                                        {shouldTruncate ? truncatedName : name}
                                    </Badge>
                                </span>
                            </TooltipTrigger>
                            {shouldTruncate && (
                                <TooltipContent 
                                    side="bottom"
                                    className="max-w-xs text-popover-foreground"
                                >
                                    <p>{name}</p>
                                </TooltipContent>
                            )}
                        </Tooltip>
                    </TooltipProvider>
                    <span className="text-xs text-muted-foreground">ID: {row.original.id.slice(0, 8)}...</span>
                </div>
            );
        }
    },
    {
        accessorKey: 'webSite',
        header: 'Site web',
        cell: ({row}) => {
            const website = row.original.webSite;
            if (!website) return <span className="text-muted-foreground text-sm">Non renseigné</span>;
            
            // Extraire le nom de domaine pour un affichage plus propre
            const displayName = website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
            
            return (
                <a 
                    href={website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline text-sm"
                >
                    <Globe className="h-3 w-3" />
                    {displayName.length > 25 ? displayName.substring(0, 25) + '...' : displayName}
                </a>
            );
        }
    },
    {
        accessorKey: 'description',
        header: 'Description',
        cell: ({row}) => {
            const description = row.original.description;
            const truncatedDesc = description.length > 50 ? description.substring(0, 50) + '...' : description;
            const shouldTruncate = description.length > 50;

            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span 
                                className="text-sm cursor-pointer hover:text-primary transition-colors"
                                onClick={(e) => {
                                    // Pour mobile : ouvrir/fermer au clic
                                    e.stopPropagation();
                                }}
                            >
                                {shouldTruncate ? truncatedDesc : description}
                            </span>
                        </TooltipTrigger>
                        {shouldTruncate && (
                            <TooltipContent 
                                side="bottom"
                                className="max-w-md text-popover-foreground"
                            >
                                <p className="whitespace-pre-wrap">{description}</p>
                            </TooltipContent>
                        )}
                    </Tooltip>
                </TooltipProvider>
            );
        }
    },
    {
        accessorKey: 'isSponsor',
        header: 'Sponsor',
        cell: ({row}) => (
            <Badge variant={row.original.isSponsor ? 'default' : 'secondary'}>
                {row.original.isSponsor ? 'Oui' : 'Non'}
            </Badge>
        )
    },
    {
        accessorKey: 'degrees',
        header: 'Formations',
        cell: ({row}) => {
            const degrees = row.original.degrees;
            const degreesCount = Array.isArray(degrees) ? degrees.length : 0;
            
            if (degreesCount === 0) {
                return <span className="text-xs text-muted-foreground">Aucune formation</span>;
            }

            const degreeNames = degrees?.map(degree => 
                typeof degree === 'string' ? degree : degree.name
            ) || [];

            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Badge 
                                variant="outline" 
                                className="cursor-pointer text-xs transition-colors"
                                onClick={(e) => {
                                    // Pour mobile : ouvrir/fermer au clic
                                    e.stopPropagation();
                                }}
                            >
                                {degreesCount} formation{degreesCount > 1 ? 's' : ''}
                            </Badge>
                        </TooltipTrigger>
                        <TooltipContent 
                            side="bottom"
                            className="text-popover-foreground"
                        >
                            <div className="max-w-md">
                                <p className="font-semibold mb-2">Formations proposées:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    {degreeNames.map((name, index) => (
                                        <li key={index} className="text-sm">{name}</li>
                                    ))}
                                </ul>
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        }
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({row}) => {
            const university = row.original;

            const handleDelete = async () => {
                try {
                    await onDelete(university.id);
                } catch (error) {
                    console.error('Erreur lors de la suppression:', error);
                }
            };

            const handleCopyId = () => {
                navigator.clipboard.writeText(university.id);
            };

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
                            <span className="sr-only">Ouvrir le menu d&apos;actions</span>
                            <MoreHorizontal className="h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel className="font-semibold">
                            Actions
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={handleCopyId} className="gap-2 cursor-pointer">
                            <Copy className="h-4 w-4"/> Copier l&apos;ID
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onView(university)} className="gap-2 cursor-pointer">
                            <Eye className="h-4 w-4"/> Voir les détails
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={() => onEdit(university)} className="gap-2 cursor-pointer">
                            <Edit className="h-4 w-4"/> Modifier
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                    onSelect={e => e.preventDefault()}
                                    className="gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                                >
                                    <Trash2 className="h-4 w-4"/>
                                    Supprimer
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Êtes-vous sûr de vouloir supprimer cette université ?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                                        Supprimer définitivement
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