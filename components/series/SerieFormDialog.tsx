/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createSerie, updateSerie, getSubjectsForSerie } from '@/lib/services/serieAdminService';
import { getAllSubjects } from '@/lib/services/subjectAdminService';
import { Loader2, GraduationCap, Plus, Trash2 } from 'lucide-react';
import { Serie, Subject } from '@/types/entities';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

const serieFormSchema = z.object({
  code: z.string()
    .min(1, 'Le code est requis')
    .max(10, 'Le code ne peut pas dépasser 10 caractères')
    .regex(/^[A-Z0-9]+$/, 'Le code doit contenir uniquement des lettres majuscules et des chiffres'),
  description: z.string()
    .min(1, 'La description est requise')
    .max(500, 'La description ne peut pas dépasser 500 caractères'),
  subjects: z.array(z.object({
    subjectId: z.number(),
    coefficient: z.number().min(1, 'Le coefficient doit être au moins 1'),
  })).min(1, 'Au moins une matière est requise'),
});

type SerieFormValues = z.infer<typeof serieFormSchema>;

interface SerieFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serie?: Serie | null;
  onSuccess: () => void;
}

export function SerieFormDialog({
  open,
  onOpenChange,
  serie,
  onSuccess
}: SerieFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);
  const [error, setError] = useState('');
  const isEditing = !!serie;

  const form = useForm<SerieFormValues>({
    resolver: zodResolver(serieFormSchema),
    defaultValues: {
      code: '',
      description: '',
      subjects: [],
    },
  });

  // Surveiller les changements dans les subjects
  const watchedSubjects = useWatch({
    control: form.control,
    name: 'subjects',
    defaultValue: []
  });

  // Charger les matières disponibles
  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const subjects = await getAllSubjects();
        setAvailableSubjects(subjects);
        
        if (serie && isEditing) {
          // Charger les matières associées seulement en mode édition
          const associatedSubjects = await getSubjectsForSerie(serie.id);
          form.reset({
            code: serie.code || '',
            description: serie.description || '',
            subjects: associatedSubjects.map(sub => ({
              subjectId: sub.id,
              coefficient: sub.coefficient || 1,
            })),
          });
        } else {
          // En mode création, réinitialiser le formulaire avec une matière vide
          const firstSubject = subjects.length > 0 ? subjects[0] : null;
          form.reset({
            code: '',
            description: '',
            subjects: firstSubject ? [{ subjectId: firstSubject.id, coefficient: 1 }] : [],
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement des matières:', error);
      }
    };

    if (open) {
      loadSubjects();
    }
  }, [open, serie, isEditing, form]);

  const onSubmit = async (values: SerieFormValues) => {
    setIsLoading(true);
    setError('');
    try {
      if (isEditing && serie) {
        await updateSerie(Number(serie.id), values);
      } else {
        await createSerie(values);
      }
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      setError(error.message || 'Erreur lors de la sauvegarde. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSubject = () => {
    const currentSubjects = form.getValues('subjects') || [];
    const usedSubjectIds = currentSubjects.map(s => s.subjectId);
    const availableSubject = availableSubjects.find(
      subject => !usedSubjectIds.includes(subject.id)
    );
    if (availableSubject) {
      const newSubjects = [
        ...currentSubjects,
        { subjectId: availableSubject.id, coefficient: 1 }
      ];
      form.setValue('subjects', newSubjects, { shouldValidate: true, shouldDirty: true });
      form.trigger('subjects');
    }
  };

  const handleRemoveSubject = (index: number) => {
    const currentSubjects = form.getValues('subjects') || [];
    const newSubjects = currentSubjects.filter((_, i) => i !== index);
    form.setValue('subjects', newSubjects, { shouldValidate: true, shouldDirty: true });
    form.trigger('subjects');
  };

  const handleCoefficientChange = (index: number, value: string) => {
    const numValue = parseInt(value) || 1;
    const currentSubjects = form.getValues('subjects') || [];
    const newSubjects = [...currentSubjects];
    newSubjects[index].coefficient = numValue;
    form.setValue('subjects', newSubjects, { shouldValidate: true, shouldDirty: true });
    form.trigger('subjects');
  };

  const handleSubjectChange = (index: number, newSubjectId: number) => {
    const currentSubjects = form.getValues('subjects') || [];
    const newSubjects = [...currentSubjects];
    newSubjects[index].subjectId = newSubjectId;
    form.setValue('subjects', newSubjects, { shouldValidate: true, shouldDirty: true });
    form.trigger('subjects');
  };

  const getAvailableSubjectsForSelect = (currentSubjectId: number) => {
    const usedSubjectIds = (watchedSubjects || [])
      .map(s => s.subjectId)
      .filter(id => id !== currentSubjectId);
    return availableSubjects.filter(subject => 
      !usedSubjectIds.includes(subject.id)
    );
  };

  const getSubjectName = (subjectId: number) => {
    return availableSubjects.find(s => s.id === subjectId)?.name || 'Inconnu';
  };

  const canAddMoreSubjects = () => {
    return (watchedSubjects || []).length < availableSubjects.length;
  };

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false);
      form.reset({
        code: '',
        description: '',
        subjects: [],
      });
      setError('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <GraduationCap className="h-4 w-4 text-primary"/>
            </div>
            {isEditing ? 'Modifier la série' : 'Nouvelle série'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Modifiez les informations de la série existante.'
              : 'Créez une nouvelle série d\'études.'
            }
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code de la série *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: A1, C, D, G2..."
                          {...field}
                          disabled={isLoading}
                          className="uppercase"
                          onChange={(e) => {
                            field.onChange(e.target.value.toUpperCase());
                          }}
                        />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Décrivez la série d'études"
                          className="min-h-[100px] resize-none"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <FormLabel>Matières associées</FormLabel>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={handleAddSubject}
                      disabled={isLoading || !canAddMoreSubjects()}
                    >
                      <Plus className="h-4 w-4 mr-2"/>
                      Ajouter une matière
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {(watchedSubjects || []).map((subject, index) => (
                      <div key={`${subject.subjectId}-${index}`} className="flex items-center gap-2">
                        <Select
                          value={subject.subjectId.toString()}
                          onValueChange={(value) => handleSubjectChange(index, parseInt(value))}
                          disabled={isLoading}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Sélectionnez une matière">
                              {getSubjectName(subject.subjectId)}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailableSubjectsForSelect(subject.subjectId).map(sub => (
                              <SelectItem key={sub.id} value={sub.id.toString()}>
                                {sub.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Input
                          type="number"
                          min="1"
                          step="1"
                          max='5'
                          value={subject.coefficient}
                          onChange={(e) => 
                            handleCoefficientChange(index, e.target.value)
                          }
                          className="w-20"
                          disabled={isLoading}
                        />

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveSubject(index)}
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4 text-destructive"/>
                        </Button>
                      </div>
                    ))}

                    {!(watchedSubjects || []).length && (
                      <p className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">
                        Aucune matière sélectionnée. Cliquez sur &quot;Ajouter une matière&quot; pour commencer.
                      </p>
                    )}

                    {!canAddMoreSubjects() && (watchedSubjects || []).length === availableSubjects.length && (
                      <p className="text-sm text-muted-foreground text-center py-2">
                        Toutes les matières disponibles ont été ajoutées.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                  {isEditing ? 'Mettre à jour' : 'Créer la série'}
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}