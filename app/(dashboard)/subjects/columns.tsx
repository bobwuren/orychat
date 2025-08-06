/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import {ColumnDef} from '@tanstack/react-table';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {
    MoreHorizontal,
    Edit,
    Trash2,
    BookOpen,
    ArrowUpDown,
    Copy,
    Eye
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
import {useState} from 'react';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip';

interface SubjectsColumnsProps {
    onEdit: (subject: any) => void;
    onDelete: (subjectId: number) => Promise<void>;
    onView: (subject: any) => void;
}

export const createColumns = ({onEdit, onDelete, onView}: SubjectsColumnsProps): ColumnDef<any>[] => [
    {
        accessorKey: "name",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4"/>
                        Matière
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
                            {row.getValue("name")}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                            ID: {row.original.id}
                        </span>
                    </div>
                </div>
            );
        }
    },
    {
        header: 'Séries & Coefficients',
        accessorKey: 'seriesCoefficients',
        cell: ({row}) => {
            const coefficients = row.original.seriesCoefficients;
            const allSeries = row.original.allSeries || [];
            if (!coefficients || Object.keys(coefficients).length === 0) {
                return (
                    <div className="text-sm text-muted-foreground">
                        Aucune série associée
                    </div>
                );
            }
            // Associer les IDs aux codes de série
            const entries = Object.entries(coefficients).map(([serieId, coef]) => {
                // Convertir les IDs pour la comparaison (string vs number)
                const serie = allSeries.find((s: any) => String(s.id) === String(serieId));
                return {
                    code: serie ? serie.code : `S${serieId.toString().slice(-2).padStart(2, '0')}`,
                    coef,
                    id: serieId
                };
            });
            const maxToShow = 3;
            const displayed = entries.slice(0, maxToShow);
            const hidden = entries.slice(maxToShow);
            return (
                <div className="flex flex-wrap gap-1 items-center min-w-0">
                    {displayed.map(({code, coef, id}) => (
                        <Badge key={id} variant="outline" className="text-xs px-1 py-0.5 whitespace-nowrap">
                            <span className="font-mono font-semibold">{code}</span>
                            <span className="mx-0.5">:</span>
                            <span className="font-bold text-primary">{String(coef)}</span>
                        </Badge>
                    ))}
                    {hidden.length > 0 && (
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Badge
                                        variant="secondary"
                                        className="cursor-pointer text-xs px-1 py-0.5 whitespace-nowrap"
                                        tabIndex={0} // accessibilité
                                        role="button"
                                        aria-label={hidden.map(h => h.code).join(', ')}
                                    >
                                        +{hidden.length} autres
                                    </Badge>
                                </TooltipTrigger>
                                <TooltipContent
                                    side="top"
                                    align="start"
                                    className="p-1 min-w-0 w-auto max-w-xs"
                                    // Ajout du support tactile : ouverture au clic
                                    onPointerDown={e => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        // Simule le hover sur mobile
                                        const tooltip = e.currentTarget;
                                        tooltip.setAttribute('data-state', 'open');
                                        setTimeout(() => tooltip.removeAttribute('data-state'), 2000);
                                    }}
                                >
                                    <div className="flex flex-col gap-0.5">
                                        {hidden.map(({code, coef, id}) => (
                                            <span key={id} className="flex items-center gap-1 text-xs whitespace-nowrap">
                                                <span className="font-mono font-semibold">{code}</span>
                                                <span className="mx-0.5">:</span>
                                                <span className="font-bold">{String(coef)}</span>
                                            </span>
                                        ))}
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
            );
        }
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({row}) => {
            const subject = row.original;

            const handleDelete = async () => {
                try {
                    await onDelete(subject.id);
                } catch (error) {
                    console.error('Erreur lors de la suppression:', error);
                }
            };

            const handleCopyId = () => {
                navigator.clipboard.writeText(subject.id);
            };

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
                            <span className="sr-only">Ouvrir le menu d&#39;actions</span>
                            <MoreHorizontal className="h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel className="font-semibold">
                            Actions pour {subject.name}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator/>

                        <DropdownMenuItem
                            onClick={handleCopyId}
                            className="gap-2 cursor-pointer"
                        >
                            <Copy className="h-4 w-4"/>
                            Copier l&#39;ID
                        </DropdownMenuItem>

                        <DropdownMenuSeparator/>

                        <DropdownMenuItem
                            onClick={() => onView(subject)}
                            className="gap-2 cursor-pointer"
                        >
                            <Eye className="h-4 w-4"/>
                            Voir les détails
                        </DropdownMenuItem>

                        <DropdownMenuSeparator/>

                        <DropdownMenuItem
                            onClick={() => onEdit(subject)}
                            className="gap-2 cursor-pointer"
                        >
                            <Edit className="h-4 w-4"/>
                            Modifier la matière
                        </DropdownMenuItem>

                        <DropdownMenuSeparator/>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
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
                                        Êtes-vous sûr de vouloir supprimer la matière &quot;{subject.name}&quot; ?
                                        Cette action est irréversible et peut affecter les notes associées.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Annuler
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
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