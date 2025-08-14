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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, User, Mail, Shield, Key } from 'lucide-react';
import { User as UserType } from '@/types/entities';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { updateUser } from '@/lib/services/usersAdminService';

const userUpdateSchema = z.object({
  email: z.string().email('Email invalide').min(1, 'Email requis'),
  password: z.string().min(8, 'Le mot de passe doit faire au moins 8 caractères').optional().or(z.literal('')),
  permissions: z.enum(['admin', 'client']),
});

type UserUpdateValues = z.infer<typeof userUpdateSchema>;

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: UserType | null;
  currentUserId?: number;
  onSuccess: () => void;
}

export function UserFormDialog({
  open,
  onOpenChange,
  user,
  currentUserId,
  onSuccess
}: UserFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const isCurrentUser = user?.id === currentUserId;

  const form = useForm<UserUpdateValues>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      email: '',
      password: '',
      permissions: 'client',
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        email: user.email,
        password: '',
        permissions: user.permissions as 'admin' | 'client',
      });
    } else {
      form.reset({
        email: '',
        password: '',
        permissions: 'client',
      });
    }
    setError('');
  }, [user, form]);

  const onSubmit = async (values: UserUpdateValues) => {
    setIsLoading(true);
    setError('');
    
    try {
      if (user) {
        const updatedUser = await updateUser(user.id, {
          email: values.email,
          permissions: values.permissions,
          ...(values.password ? { password: values.password } : {})
        });
        onSuccess();
        onOpenChange(false);
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Erreur lors de la sauvegarde. Veuillez réessayer.');
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
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <User className="h-4 w-4 text-primary"/>
            </div>
            Modifier l&apos;utilisateur
            {isCurrentUser && (
              <Badge variant="secondary" className="ml-2">
                <Shield className="h-3 w-3 mr-1"/>
                Vous
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            {isCurrentUser 
              ? 'Modifiez vos informations personnelles. Vous ne pouvez modifier que votre mot de passe.'
              : 'Modifiez les informations de cet utilisateur.'
            }
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="h-4 w-4"/>
                        Adresse email *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="utilisateur@exemple.com" 
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
                  name="password"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Key className="h-4 w-4"/>
                        Nouveau mot de passe (optionnel)
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="password"
                          placeholder="Laisser vide pour ne pas changer" 
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
                  name="permissions"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Shield className="h-4 w-4"/>
                        Rôle *
                      </FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={isLoading || isCurrentUser}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un rôle" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="client">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4"/>
                              Client
                            </div>
                          </SelectItem>
                          <SelectItem value="admin">
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4"/>
                              Administrateur
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage/>
                      {isCurrentUser && (
                        <p className="text-xs text-muted-foreground">
                          Vous ne pouvez pas modifier votre propre rôle
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
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
                  Mettre à jour
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
