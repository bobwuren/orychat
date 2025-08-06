/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {useState, useEffect} from 'react';
import {Button} from '@/components/ui/button';
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
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import {createDegree, updateDegree} from '@/lib/services/degreeAdminService';
import {Loader2, GraduationCap} from 'lucide-react';
import { Degree } from '@/types/entities';

const degreeFormSchema = z.object({
    name: z.string()
        .min(1, 'Le nom est requis')
        .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
    description: z.string()
        .min(1, 'La description est requise')
        .max(500, 'La description ne peut pas dépasser 500 caractères'),
});

type DegreeFormValues = z.infer<typeof degreeFormSchema>;

interface DegreeFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    degree?: Degree | null;
    onSuccess: () => void;
}

export function DegreeFormDialog({
    open,
    onOpenChange,
    degree,
    onSuccess
}: DegreeFormDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const isEditing = !!degree;

    const form = useForm<DegreeFormValues>({
        resolver: zodResolver(degreeFormSchema),
        defaultValues: {
            name: '',
            description: '',
        },
    });

    // Réinitialiser le formulaire quand le diplôme change
    useEffect(() => {
        if (degree) {
            form.reset({
                name: degree.name,
                description: degree.description,
            });
        } else {
            form.reset({
                name: '',
                description: '',
            });
        }
    }, [degree, form]);

    const onSubmit = async (values: DegreeFormValues) => {
        setIsLoading(true);
        setError('');
        try {
            if (isEditing && degree) {
                await updateDegree(degree.id, values);
            } else {
                await createDegree(values);
            }

            onSuccess();
            onOpenChange(false);
            form.reset();
        } catch (error: any) {
            console.error('Erreur lors de la sauvegarde:', error);
            setError(error.message || 'Erreur lors de la sauvegarde. Veuillez réessayer.');
        } finally {
            setIsLoading(false);
        }
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
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <GraduationCap className="h-4 w-4 text-primary"/>
                        </div>
                        {isEditing ? 'Modifier le diplôme' : 'Nouveau diplôme'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Modifiez les informations du diplôme existant.'
                            : 'Créez un nouveau diplôme. Tous les champs sont obligatoires.'
                        }
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({field}: { field: any }) => (
                                    <FormItem>
                                        <FormLabel>Nom du diplôme *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ex: Licence en Informatique, Master en Sciences..."
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
                                name="description"
                                render={({field}: { field: any }) => (
                                    <FormItem>
                                        <FormLabel>Description *</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Décrivez le diplôme, ses objectifs, débouchés..."
                                                className="min-h-[100px] resize-none"
                                                {...field}
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-500">{error}</p>
                        )}

                        <DialogFooter className="gap-2">
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
                                {isEditing ? 'Mettre à jour' : 'Créer le diplôme'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
