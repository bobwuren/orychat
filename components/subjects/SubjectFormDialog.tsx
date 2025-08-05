"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, BookOpen, Plus, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CacheService } from '@/lib/cache';
import { createSubject, getSeriesCoefficientsForSubject, updateSubject } from '@/lib/services/subjectAdminService';
import { Serie, Subject } from '@/types/entities';

interface SubjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subject?: Subject | null;
  onSuccess: () => void;
}

interface SeriesCoefficient {
  serieId: string;
  coefficient: number;
}

export function SubjectFormDialog({
  open,
  onOpenChange,
  subject,
  onSuccess
}: SubjectFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSeries, setIsLoadingSeries] = useState(false);
  const [name, setName] = useState('');
  const [seriesList, setSeriesList] = useState<Serie[]>([]);
  const [seriesCoefficients, setSeriesCoefficients] = useState<SeriesCoefficient[]>([]);
  const [error, setError] = useState('');
  const isEditing = !!subject;

  useEffect(() => {
    const fetchSeries = async () => {
      setIsLoadingSeries(true);
      try {
        // Récupérer les séries depuis le cache
        // L'invalidation après suppression garantit des données fraîches
        const series = await CacheService.get('series');
        setSeriesList(series);
      } catch (error) {
        console.error('Failed to fetch series:', error);
      } finally {
        setIsLoadingSeries(false);
      }
    };

    if (open) {
      fetchSeries();
    }
  }, [open]);

  useEffect(() => {
    if (subject) {
      setName(subject.name);
      if (subject.seriesCoefficients) {
        const formattedCoefficients = Object.entries(subject.seriesCoefficients).map(([serieId, coefficient]) => ({
          serieId,
          coefficient
        }));
        setSeriesCoefficients(formattedCoefficients);
      } else if (subject.id) {
        // Si on est en mode édition mais sans coefficients, on les charge
        loadCoefficients(subject.id);
      }
    } else {
      setName('');
      setSeriesCoefficients([]);
    }
    setError('');
  }, [subject]);

  const loadCoefficients = async (subjectId: string) => {
    try {
      const coefficients = await getSeriesCoefficientsForSubject(subjectId);
      const formattedCoefficients = Object.entries(coefficients).map(([serieId, coefficient]) => ({
        serieId,
        coefficient
      }));
      setSeriesCoefficients(formattedCoefficients);
    } catch (error) {
      console.error('Failed to load coefficients:', error);
    }
  };

  const validateForm = () => {
    if (!name.trim()) {
      setError('Le nom de la matière est requis');
      return false;
    }
    if (name.length > 100) {
      setError('Le nom ne peut pas dépasser 100 caractères');
      return false;
    }
    // Les séries ne sont plus obligatoires - on peut créer une matière "de base"
    setError('');
    return true;
  };

  const handleAddSeries = () => {
    if (seriesList.length > 0) {
      const firstAvailableSeries = seriesList.find(
        serie => !seriesCoefficients.some(sc => sc.serieId === serie.id)
      );
      
      if (firstAvailableSeries) {
        setSeriesCoefficients([...seriesCoefficients, {
          serieId: firstAvailableSeries.id,
          coefficient: 1
        }]);
      }
    }
  };

  const handleRemoveSeries = (index: number) => {
    const newCoefficients = [...seriesCoefficients];
    newCoefficients.splice(index, 1);
    setSeriesCoefficients(newCoefficients);
  };

  const handleSeriesChange = (index: number, serieId: string) => {
    const newCoefficients = [...seriesCoefficients];
    newCoefficients[index].serieId = serieId;
    setSeriesCoefficients(newCoefficients);
  };

  const handleCoefficientChange = (index: number, coefficient: number) => {
    const newCoefficients = [...seriesCoefficients];
    newCoefficients[index].coefficient = coefficient;
    setSeriesCoefficients(newCoefficients);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const payload = {
        name: name.trim(),
        seriesCoefficients
      };

      if (isEditing && subject) {
        await updateSubject(subject.id, payload);
      } else {
        await createSubject(payload);
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: unknown) {
      console.error('Erreur lors de la sauvegarde:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors de la sauvegarde. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            {isEditing ? 'Modifier la matière' : 'Nouvelle matière'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Modifiez les informations de la matière existante.'
              : 'Créez une nouvelle matière avec les séries associées.'}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Nom de la matière *
              </Label>
              <Input
                placeholder="Ex: Mathématiques, Français, Histoire-Géographie..."
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                disabled={isLoading}
                className={error ? 'border-red-500' : ''}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium">
                  Séries associées
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddSeries}
                  disabled={isLoadingSeries || seriesList.length === 0 || seriesCoefficients.length >= seriesList.length}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une série
                </Button>
              </div>

              {seriesCoefficients.length === 0 ? (
                <div className="text-sm text-muted-foreground py-2 border border-dashed rounded-lg p-4 text-center">
                  <p>Aucune série sélectionnée</p>
                  <p className="text-xs mt-1 text-yellow-600">
                    ⚠️ Cette matière ne sera pas utilisable tant qu&apos;elle n&apos;est pas liée à une série
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {seriesCoefficients.map((sc, index) => {
                    const availableSeries = seriesList.filter(
                      serie => serie.id === sc.serieId || 
                              !seriesCoefficients.some(s => s.serieId === serie.id)
                    );

                    return (
                      <div key={index} className="flex gap-3 items-center">
                        <Select
                          value={sc.serieId}
                          onValueChange={(value) => handleSeriesChange(index, value)}
                          disabled={isLoading}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Sélectionner une série" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableSeries.map(serie => (
                              <SelectItem key={serie.id} value={serie.id}>
                                {serie.code}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Input
                          type="number"
                          min="1"
                          step="1"
                          max='5'
                          value={sc.coefficient}
                          onChange={(e) => handleCoefficientChange(index, parseInt(e.target.value) || 1)}
                          disabled={isLoading}
                          className="w-20"
                        />
                        
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveSeries(index)}
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}

              {!isLoadingSeries && seriesCoefficients.length === seriesList.length && seriesList.length > 0 && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  Toutes les séries disponibles ont été ajoutées.
                </p>
              )}
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Mettre à jour' : 'Créer la matière'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SubjectFormDialog;