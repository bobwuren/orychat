"use client";

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
import { Checkbox } from '@/components/ui/checkbox';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createUniversity, updateUniversity } from '@/lib/services/universityAdminService';
import { getAllDegrees } from '@/lib/services/degreeAdminService';
import { Loader2, Globe, Plus, Trash2 } from 'lucide-react';
import { University, Degree } from '@/types/entities';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

const universityFormSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100),
  description: z.string().min(1, 'La description est requise').max(500),
  webSite: z.string().url('URL invalide').max(200),
  isSponsor: z.boolean(),
  degrees: z.array(z.string().min(1, 'Un diplôme est requis'))
    .min(1, 'Au moins un diplôme est requis'),
});

type UniversityFormValues = z.infer<typeof universityFormSchema>;

interface UniversityFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  university?: University | null;
  onSuccess: () => void;
}

export function UniversityFormDialog({
  open,
  onOpenChange,
  university,
  onSuccess
}: UniversityFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [availableDegrees, setAvailableDegrees] = useState<Degree[]>([]);
  const [error, setError] = useState('');
  const isEditing = !!university;

  const form = useForm<UniversityFormValues>({
    resolver: zodResolver(universityFormSchema),
    defaultValues: {
      name: '',
      description: '',
      webSite: '',
      isSponsor: false,
      degrees: [],
    },
  });

  // Surveiller les changements dans les degrees
  const watchedDegrees = useWatch({
    control: form.control,
    name: 'degrees',
    defaultValue: []
  });

  useEffect(() => {
    const loadDegrees = async () => {
      try {
        const degrees = await getAllDegrees();
        setAvailableDegrees(degrees);
        
        if (university) {
          form.reset({
            name: university.name || '',
            description: university.description || '',
            webSite: university.webSite || '',
            isSponsor: university.isSponsor || false,
            degrees: university.degrees?.map(d => typeof d === 'string' ? d : d.id) || [],
          });
        } else {
          // En mode création, réinitialiser le formulaire
          form.reset({
            name: '',
            description: '',
            webSite: '',
            isSponsor: false,
            degrees: [],
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement des diplômes:', error);
      }
    };

    if (open) loadDegrees();
  }, [open, university, form]);

  const onSubmit = async (values: UniversityFormValues) => {
    setIsLoading(true);
    setError('');
    
    console.log('🏫 [UniversityFormDialog] Submitting form:', {
      isEditing,
      universityId: university?.id,
      values
    });
    
    try {
      if (isEditing && university) {
        console.log('✏️ [UniversityFormDialog] Updating university:', university.id);
        await updateUniversity(university.id, values);
        console.log('✅ [UniversityFormDialog] University updated successfully');
      } else {
        console.log('🆕 [UniversityFormDialog] Creating new university');
        await createUniversity(values);
        console.log('✅ [UniversityFormDialog] University created successfully');
      }
      onSuccess();
      onOpenChange(false);
    } catch (error: unknown) {
      console.error('❌ [UniversityFormDialog] Error during submission:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors de la sauvegarde. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDegree = () => {
    const currentDegrees = form.getValues('degrees') || [];
    if (currentDegrees.length < availableDegrees.length) {
      // Trouver un diplôme non encore ajouté
      const nextDegree = availableDegrees.find(
        deg => !currentDegrees.includes(deg.id)
      );
      if (nextDegree) {
        const newDegrees = [...currentDegrees, nextDegree.id];
        form.setValue('degrees', newDegrees, { shouldValidate: true, shouldDirty: true });
        form.trigger('degrees');
      }
    }
  };

  const handleRemoveDegree = (index: number) => {
    const currentDegrees = form.getValues('degrees') || [];
    const newDegrees = currentDegrees.filter((_, i) => i !== index);
    form.setValue('degrees', newDegrees, { shouldValidate: true, shouldDirty: true });
    form.trigger('degrees');
  };

  const handleDegreeChange = (index: number, newDegreeId: string) => {
    const currentDegrees = form.getValues('degrees') || [];
    const newDegrees = [...currentDegrees];
    newDegrees[index] = newDegreeId;
    form.setValue('degrees', newDegrees, { shouldValidate: true, shouldDirty: true });
    form.trigger('degrees');
  };

  const getAvailableDegreesForSelect = (currentDegreeId: string) => {
    const usedDegreeIds = (watchedDegrees || [])
      .filter(id => id !== currentDegreeId); // Exclure le diplôme actuel pour permettre la modification
    
    return availableDegrees.filter(degree => 
      !usedDegreeIds.includes(degree.id)
    );
  };

  const canAddMoreDegrees = () => {
    return (watchedDegrees || []).length < availableDegrees.length;
  };

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false);
      form.reset();
      setError('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Globe className="h-4 w-4 text-primary"/>
            </div>
            {isEditing ? 'Modifier l\'université' : 'Nouvelle université'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Modifiez les informations de l\'université.'
              : 'Créez une nouvelle université. Au moins un diplôme est requis.'
            }
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Nom de l&#39;université *</FormLabel>
                      <FormControl>
                        <Input placeholder="Université de ..." {...field} disabled={isLoading}/>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="webSite"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Site web *</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} disabled={isLoading}/>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Décrivez l'université..." 
                          className="min-h-[100px] resize-none" 
                          {...field} 
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isSponsor"
                  render={({field}) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-medium">
                          Université sponsor
                        </FormLabel>
                        <p className="text-xs text-muted-foreground">
                          Cette université est-elle un sponsor du système ?
                        </p>
                      </div>
                      <FormMessage/>
                    </FormItem>
                  )}
                />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <FormLabel>Diplômes proposés *</FormLabel>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={handleAddDegree}
                      disabled={
                        isLoading || 
                        !canAddMoreDegrees()
                      }
                    >
                      <Plus className="h-4 w-4 mr-2"/>
                      Ajouter un diplôme
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {(watchedDegrees || []).map((degreeId, index) => (
                      <div key={`${degreeId}-${index}`} className="flex items-center gap-2">
                        <Select
                          value={degreeId}
                          onValueChange={(value) => handleDegreeChange(index, value)}
                          disabled={isLoading}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Sélectionnez un diplôme">
                              {availableDegrees.find(d => d.id === degreeId)?.name || 'Inconnu'}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailableDegreesForSelect(degreeId).map(degree => (
                              <SelectItem key={degree.id} value={degree.id}>
                                {degree.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveDegree(index)}
                          disabled={isLoading || (watchedDegrees || []).length <= 1}
                        >
                          <Trash2 className="h-4 w-4 text-destructive"/>
                        </Button>
                      </div>
                    ))}

                    {!(watchedDegrees || []).length && (
                      <div className="text-sm text-destructive py-2 border border-dashed rounded-lg p-4 text-center">
                        <p>Aucun diplôme sélectionné</p>
                        <p className="text-xs mt-1">
                          Une université doit proposer au moins un diplôme
                        </p>
                      </div>
                    )}

                    {!canAddMoreDegrees() && (watchedDegrees || []).length === availableDegrees.length && (
                      <p className="text-sm text-muted-foreground text-center py-2">
                        Tous les diplômes disponibles ont été ajoutés.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <DialogFooter className="gap-2 pt-4">
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
                  {isEditing ? 'Mettre à jour' : 'Créer'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}