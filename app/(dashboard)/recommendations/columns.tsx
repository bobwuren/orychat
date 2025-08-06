"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, ArrowUpDown, Eye, Copy } from "lucide-react"
import { Recommendation } from "@/types/entities"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export const columns = (
  onView: (recommendation: Recommendation) => void
): ColumnDef<Recommendation>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Sélectionner tout"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Sélectionner la ligne"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "userEmail",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-muted"
      >
        Utilisateur
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const userEmail = row.getValue("userEmail") as string

      return (
        <span className="font-medium truncate max-w-[200px]">
          <Badge variant="secondary" className="bg-primary/10 text-primary font-mono text-sm px-3 py-1 w-fit">
            {userEmail || 'Email non disponible'}
          </Badge>
        </span>
      );
    },
  },
  {
    accessorKey: "serieCode",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-muted"
      >
        Série
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const serieCode = row.getValue("serieCode") as string

      return (
        <Badge variant="outline"><span className="font-medium">{serieCode || 'Inconnu'}</span></Badge>
      )
    },
  },
  {
    accessorKey: "orientations",
    header: "Orientations",
    cell: ({ row }) => {
      const orientations = row.getValue("orientations") as Recommendation["orientations"]

      if (!orientations || orientations.length === 0) {
        return <span className="text-muted-foreground">Aucune orientation</span>
      }

      const topOrientation = orientations[0]
      const remainingCount = orientations.length - 1

      return (
        <div className="flex flex-col space-y-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help">
                  <Badge variant="secondary" className="text-xs max-w-[200px] truncate">
                    {topOrientation.name || 'Orientation sans nom'}
                  </Badge>
                  {remainingCount > 0 && (
                    <span className="text-xs text-muted-foreground ml-2">
                      +{remainingCount} autre{remainingCount > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" align="start" className="max-w-[500px] p-4 bg-popover border shadow-lg">
                <div className="space-y-3">
                  <p className="font-semibold text-base text-foreground border-b pb-2">
                    Orientations recommandées ({orientations.length})
                  </p>
                  {orientations.map((orientation, index) => (
                    <div key={index} className="border-l-4 border-primary pl-3 py-2 bg-muted/50 rounded-r">
                      <div className="space-y-2">
                        <p className="font-medium text-primary text-sm">
                          {orientation.name || `Orientation #${index + 1}`}
                        </p>
                        
                        {orientation.why && (
                          <div className="bg-primary/10 p-2 rounded text-xs border-l-2 border-primary/50">
                            <p className="font-medium text-primary mb-1">Pourquoi cette orientation ?</p>
                            <p className="text-muted-foreground leading-relaxed">{orientation.why}</p>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="bg-card p-2 rounded border">
                            <p className="font-medium text-foreground mb-1 flex items-center">
                              🏫 Universités :
                            </p>
                            {orientation.universities && orientation.universities.length > 0 ? (
                              <ul className="text-muted-foreground space-y-1">
                                {orientation.universities.map((uni, idx) => (
                                  <li key={idx} className="flex items-center justify-between">
                                    <span className="truncate">{uni.name}</span>
                                    {uni.site && (
                                      <a href={uni.site} target="_blank" rel="noopener noreferrer" 
                                         className="text-primary hover:underline ml-2 flex-shrink-0" title="Visiter le site">
                                        🔗
                                      </a>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-muted-foreground/70 italic">Aucune université spécifiée</p>
                            )}
                          </div>
                          
                          <div className="bg-card p-2 rounded border">
                            <p className="font-medium text-foreground mb-1 flex items-center">
                              🎓 Formations :
                            </p>
                            {orientation.degrees && orientation.degrees.length > 0 ? (
                              <ul className="text-muted-foreground space-y-1">
                                {orientation.degrees.map((degree, idx) => (
                                  <li key={idx} className="flex items-center justify-between">
                                    <span className="truncate">{degree.name}</span>
                                    {degree.articleLink && (
                                      <a href={degree.articleLink} target="_blank" rel="noopener noreferrer" 
                                         className="text-primary hover:underline ml-2 flex-shrink-0" title="En savoir plus">
                                        📖
                                      </a>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-muted-foreground/70 italic">Aucune formation spécifiée</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-muted"
      >
        Date de création
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return (
        <div className="flex flex-col">
          <span className="text-sm">
            {date.toLocaleDateString('fr-FR')}
          </span>
          <span className="text-xs text-muted-foreground">
            {date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const recommendation = row.original

      const handleCopyId = () => {
        navigator.clipboard.writeText(recommendation.id.toString())
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleCopyId}>
              <Copy className="mr-2 h-4 w-4" />
              Copier l&apos;ID
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onView(recommendation)}>
              <Eye className="mr-2 h-4 w-4" />
              Voir les détails
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]