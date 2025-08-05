'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  retry?: () => void;
  className?: string;
}

/**
 * Composant élégant pour afficher les erreurs de façon consistante
 * Simplifié pour ne montrer que le nécessaire à l'utilisateur
 */
export default function ErrorDisplay({
  title = 'Une erreur est survenue',
  message = 'Nous n\'avons pas pu traiter votre demande. Veuillez réessayer ultérieurement.',
  retry,
  className = '',
}: ErrorDisplayProps) {
  return (
    <div className={`bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm my-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-500" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">{title}</h3>
          {message && (
            <div className="mt-2 text-sm text-red-700">
              <p>{message}</p>
            </div>
          )}
          {retry && (
            <div className="mt-4">
              <Button 
                onClick={retry}
                size="sm"
                variant="outline"
                className="bg-white hover:bg-red-50 text-red-700 border-red-300"
              >
                Réessayer
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
