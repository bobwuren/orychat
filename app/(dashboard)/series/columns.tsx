/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import {ColumnDef} from '@tanstack/react-table';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Serie} from '@/types/entities';
import {
    MoreHorizontal,
    Edit,
    Trash2,
    GraduationCap,
    ArrowUpDown,
    Copy,
    Eye,
    BookOpen
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
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip';
import {useState} from 'react';

interface SeriesColumnsProps {
    onEdit: (serie: Serie) => void;
    onDelete: (serieId: number) => Promise<void>;
    onView: (serie: Serie) => void;
}

export const createColumns = ({onEdit, onDelete, onView}: SeriesColumnsProps): ColumnDef<Serie>[] => [
    {
        accessorKey: "code",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                    <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4"/>
                        Code Série
                        <ArrowUpDown className="ml-2 h-3 w-3"/>
                    </div>
                </Button>
            );
        },
        cell: ({row}) => {
            return (
                <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                        <Badge
                            variant="secondary"
                            className="bg-primary/10 text-primary font-mono text-sm px-3 py-1 w-fit"
                        >
                            {row.getValue("code")}
                        </Badge>
                        <span className="text-xs text-muted-foreground mt-1">
                            ID: {row.original.id}
                        </span>
                    </div>
                </div>
            );
        }
    },
    {
        accessorKey: "description",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4"/>
                        Description
                        <ArrowUpDown className="ml-2 h-3 w-3"/>
                    </div>
                </Button>
            );
        },
        cell: ({row}) => {
            const description = row.getValue("description") as string;
            return (
                <div className="flex flex-col">
                    <span className="font-medium text-sm leading-tight">
                        {description}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        Série d&#39;études secondaires
                    </span>
                </div>
            );
        }
    },
    {
        header: 'Matières associées',
        accessorKey: 'subjects',
        cell: ({row}) => {
            const subjects = row.original.subjects || [];
            const [isTooltipOpen, setIsTooltipOpen] = useState(false);
            
            if (subjects.length === 0) {
                return (
                    <div className="text-sm text-muted-foreground">
                        Aucune matière
                    </div>
                );
            }

            return (
                <div className="flex items-center gap-2">
                    <TooltipProvider delayDuration={100}>
                        <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
                            <TooltipTrigger asChild>
                                <Badge 
                                    variant="outline" 
                                    className="cursor-pointer text-xs px-2 py-1 hover:bg-primary/10 transition-colors"
                                    onClick={() => setIsTooltipOpen(!isTooltipOpen)}
                                    onMouseEnter={() => setIsTooltipOpen(true)}
                                    onMouseLeave={() => setIsTooltipOpen(false)}
                                    tabIndex={0}
                                    role="button"
                                    aria-label={`${subjects.length} matières associées`}
                                >
                                    <BookOpen className="h-3 w-3 mr-1" />
                                    {subjects.length}
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent
                                side="top"
                                align="start"
                                className="p-3 max-w-sm w-auto"
                                onPointerEnter={() => setIsTooltipOpen(true)}
                                onPointerLeave={() => setIsTooltipOpen(false)}
                            >
                                <div className="space-y-2">
                                    <div className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">
                                        Matières associées ({subjects.length})
                                    </div>
                                    <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                                        {subjects.map((subject: any) => (
                                            <Badge 
                                                key={subject.id} 
                                                variant="secondary" 
                                                className="text-xs px-2 py-0.5 whitespace-nowrap"
                                            >
                                                {subject.name}
                                                {subject.coefficient && (
                                                    <span className="ml-1 font-bold text-primary">
                                                        :{subject.coefficient}
                                                    </span>
                                                )}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            );
        }
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({row}) => {
            const serie = row.original;
            const [isDeleting, setIsDeleting] = useState<boolean>(false);

            const handleDelete = async () => {
                setIsDeleting(true);
                try {
                    await onDelete(serie.id);
                } catch (error) {
                    console.error('Erreur lors de la suppression:', error);
                } finally {
                    setIsDeleting(false);
                }
            };

            const handleCopyId = () => {
                navigator.clipboard.writeText(serie.id.toString());
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
                            Actions pour {serie.code}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator/>

                        <DropdownMenuItem
                            onClick={handleCopyId}
                            className="gap-2 cursor-pointer"
                        >
                            <Copy className="h-4 w-4"/>
                            Copier l&apos;ID
                        </DropdownMenuItem>

                        <DropdownMenuSeparator/>

                        <DropdownMenuItem
                            onClick={() => onView(serie)}
                            className="gap-2 cursor-pointer"
                        >
                            <Eye className="h-4 w-4"/>
                            Voir les détails
                        </DropdownMenuItem>

                        <DropdownMenuSeparator/>

                        <DropdownMenuItem
                            onClick={() => onEdit(serie)}
                            className="gap-2 cursor-pointer"
                        >
                            <Edit className="h-4 w-4"/>
                            Modifier la série
                        </DropdownMenuItem>

                        <DropdownMenuSeparator/>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                    className="gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                                    disabled={isDeleting}
                                >
                                    <Trash2 className="h-4 w-4"/>
                                    {isDeleting ? 'Suppression...' : 'Supprimer'}
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Êtes-vous sûr de vouloir supprimer la série &quot;{serie.code} - {serie.description}&quot; ?
                                        Cette action est irréversible et peut affecter les matières associées.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel disabled={isDeleting}>
                                        Annuler
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        {isDeleting ? 'Suppression...' : 'Supprimer définitivement'}
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