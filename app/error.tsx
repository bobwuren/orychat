'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Vous pouvez logger l'erreur côté client ici
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Oups! Une erreur est survenue</h2>
          <p className="text-gray-600 mb-6">
            {process.env.NODE_ENV === 'development' 
              ? error?.message || 'Une erreur inconnue s\'est produite.'
              : 'Désolé pour cette interruption. Notre équipe a été notifiée.'}
          </p>
          
          <div className="flex flex-col gap-4">
            <Button 
              onClick={() => reset()}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Réessayer
            </Button>
            
            <Button
              variant="outline"
              onClick={() => window.location.href = '/dashboard'}
              className="w-full"
            >
              Retour au tableau de bord
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
