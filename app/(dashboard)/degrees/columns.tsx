/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import {ColumnDef} from '@tanstack/react-table';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Degree} from '@/types/entities';
import {
    MoreHorizontal,
    Edit,
    Trash2,
    GraduationCap,
    ArrowUpDown,
    Copy,
    Eye,
    BookOpen,
    Building
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

interface DegreesColumnsProps {
    onEdit: (degree: Degree) => void;
    onDelete: (degreeId: number) => Promise<void>;
    onView: (degree: Degree) => void;
}

export const createColumns = ({onEdit, onDelete, onView}: DegreesColumnsProps): ColumnDef<Degree>[] => [
    {
        accessorKey: "name",
        header: ({column}) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="h-auto p-0 font-semibold hover:bg-transparent"
            >
                <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4"/>
                    Nom du Diplôme
                    <ArrowUpDown className="ml-2 h-3 w-3"/>
                </div>
            </Button>
        ),
        cell: ({row}) => {
            const fullName = (row.getValue("name") as string) || "";
            const displayName = fullName.length > 15 ? fullName.slice(0, 15) + "..." : fullName;
            const [isTooltipOpen, setIsTooltipOpen] = useState(false);
            
            return (
                <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                        <TooltipProvider delayDuration={100}>
                            <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
                                <TooltipTrigger asChild>
                                    <Badge
                                        variant="secondary"
                                        className="bg-primary/10 text-primary font-mono text-sm px-3 py-1 w-fit cursor-pointer hover:bg-primary/20 transition-colors"
                                        onClick={() => setIsTooltipOpen(!isTooltipOpen)}
                                        onMouseEnter={() => setIsTooltipOpen(true)}
                                        onMouseLeave={() => setIsTooltipOpen(false)}
                                        tabIndex={0}
                                        role="button"
                                        aria-label={`Nom complet: ${fullName}`}
                                    >
                                        {displayName || "Nom non défini"}
                                    </Badge>
                                </TooltipTrigger>
                                <TooltipContent
                                    side="top"
                                    align="start"
                                    className="p-3 max-w-md w-auto"
                                    onPointerEnter={() => setIsTooltipOpen(true)}
                                    onPointerLeave={() => setIsTooltipOpen(false)}
                                >
                                    <div className="space-y-1">
                                        <div className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">
                                            Nom complet du diplôme
                                        </div>
                                        <div className="font-medium text-sm">
                                            {fullName || "Nom non défini"}
                                        </div>
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <span className="text-xs text-muted-foreground">
                            ID: {row.original.id}...
                        </span>
                    </div>
                </div>
            );
        }
    },
    {
        accessorKey: "description",
        header: ({column}) => (
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
        ),
        cell: ({row}) => {
            const fullDescription = (row.getValue("description") as string) || "";
            const displayDescription = fullDescription.length > 50 ? fullDescription.slice(0, 50) + "..." : fullDescription;
            const [isTooltipOpen, setIsTooltipOpen] = useState(false);
            
            return (
                <div className="flex flex-col">
                    <TooltipProvider delayDuration={100}>
                        <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
                            <TooltipTrigger asChild>
                                <span 
                                    className="font-medium text-sm leading-tight cursor-pointer hover:text-primary transition-colors"
                                    onClick={() => setIsTooltipOpen(!isTooltipOpen)}
                                    onMouseEnter={() => setIsTooltipOpen(true)}
                                    onMouseLeave={() => setIsTooltipOpen(false)}
                                    tabIndex={0}
                                    role="button"
                                    aria-label={`Description complète: ${fullDescription}`}
                                >
                                    {displayDescription || "Description non définie"}
                                </span>
                            </TooltipTrigger>
                            <TooltipContent
                                side="top"
                                align="start"
                                className="p-3 max-w-lg w-auto"
                                onPointerEnter={() => setIsTooltipOpen(true)}
                                onPointerLeave={() => setIsTooltipOpen(false)}
                            >
                                <div className="space-y-2">
                                    <div className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">
                                        Description complète
                                    </div>
                                    <div className="font-medium text-sm leading-relaxed">
                                        {fullDescription || "Description non définie"}
                                    </div>
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <span className="text-xs text-muted-foreground">
                        Formation d'enseignement supérieur
                    </span>
                </div>
            );
        }
    },
    {
        header: 'Universités associées',
        accessorKey: 'associatedUniversities',
        cell: ({row}) => {
            // Supporte les deux formats : array d'objets ou array d'IDs
            const universities = (row.original as any).associatedUniversities ||
                                 (row.original as any).universities ||
                                 (row.original as any).universitiesByDegree ||
                                 [];
            
            const [isTooltipOpen, setIsTooltipOpen] = useState(false);

            if (!universities || universities.length === 0) {
                return (
                    <div className="text-sm text-muted-foreground">
                        Aucune université
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
                                    aria-label={`${universities.length} universités associées`}
                                >
                                    <Building className="h-3 w-3 mr-1" />
                                    {universities.length}
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
                                        Universités associées ({universities.length})
                                    </div>
                                    <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                                        {universities.map((university: any) => (
                                            <Badge 
                                                key={university.id || university}
                                                variant="secondary"
                                                className="text-xs px-2 py-0.5 whitespace-nowrap"
                                            >
                                                {typeof university === 'object' ? university.name : university}
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
            const degree = row.original;
            const [isDeleting, setIsDeleting] = useState<boolean>(false);

            const handleDelete = async () => {
                setIsDeleting(true);
                try {
                    await onDelete(degree.id);
                } catch (error) {
                    console.error('Erreur lors de la suppression:', error);
                } finally {
                    setIsDeleting(false);
                }
            };

            const handleCopyId = () => {
                navigator.clipboard.writeText(degree.id.toString());
            };

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
                            <span className="sr-only">Ouvrir le menu d'actions</span>
                            <MoreHorizontal className="h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel className="font-semibold text-center">
                            Actions pour {degree.name || "Diplôme"}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator/>

                        <DropdownMenuItem
                            onClick={handleCopyId}
                            className="gap-2 cursor-pointer"
                        >
                            <Copy className="h-4 w-4"/>
                            Copier l'ID
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => onView(degree)}
                            className="gap-2 cursor-pointer"
                        >
                            <Eye className="h-4 w-4"/>
                            Voir les détails
                        </DropdownMenuItem>

                        <DropdownMenuSeparator/>

                        <DropdownMenuItem
                            onClick={() => onEdit(degree)}
                            className="gap-2 cursor-pointer"
                        >
                            <Edit className="h-4 w-4"/>
                            Modifier le diplôme
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
                                        Êtes-vous sûr de vouloir supprimer le diplôme "{degree.name || 'Sans nom'}" ?
                                        Cette action est irréversible et peut affecter les recommandations associées.
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
