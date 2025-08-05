'use client';

import { useState, useCallback } from 'react';

/**
 * Hook pour gérer facilement les erreurs dans les composants
 */
export function useErrorHandling() {
  const [error, setError] = useState<{ title?: string; message: string } | null>(null);
  
  // Fonction pour définir une erreur
  const handleError = useCallback((message: string, title?: string) => {
    setError({ message, title });
    // Log l'erreur côté client pour le débogage
    console.error('Erreur :', { message, title });
  }, []);
  
  // Fonction pour effacer l'erreur
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  // Fonction pour wrapper un appel API et gérer automatiquement les erreurs
  const withErrorHandling = useCallback(
    async <T,>(
      apiCall: () => Promise<T>,
      errorMessage = 'Une erreur est survenue lors de la communication avec le serveur'
    ): Promise<T | null> => {
      try {
        return await apiCall();
      } catch (err) {
        // Essaie d'extraire un message plus précis de l'erreur si possible
        let message = errorMessage;
        
        if (err && typeof err === 'object' && 'message' in err) {
          message = String(err.message);
        }
        
        handleError(message);
        return null;
      }
    },
    [handleError]
  );
  
  return { error, handleError, clearError, withErrorHandling };
}
