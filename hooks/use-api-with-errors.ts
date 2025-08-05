'use client';

import { useError } from '@/components/providers/error-provider';

/**
 * Hook qui combine l'appel API et la gestion des erreurs
 * Il affiche automatiquement les erreurs avec le ErrorProvider
 */
export function useApiWithErrorHandling() {
  const { showError } = useError();

  /**
   * Exécute une action API avec gestion d'erreurs automatique
   * @param apiCall La fonction d'appel API à exécuter
   * @param errorMessage Message d'erreur par défaut
   * @returns Le résultat de l'appel API ou null en cas d'erreur
   */
  const callApi = async <T,>(
    apiCall: () => Promise<T>,
    errorMessage = 'Une erreur est survenue lors de la communication avec le serveur'
  ): Promise<T | null> => {
    try {
      return await apiCall();
    } catch (err) {
      // Essaie d'extraire un message plus précis de l'erreur si possible
      let message = errorMessage;
      let title = 'Erreur';
      
      if (err && typeof err === 'object') {
        if ('response' in err && err.response && typeof err.response === 'object') {
          // Définir un type pour la réponse d'erreur
          interface ErrorResponse {
            status?: number;
            data?: {
              message?: string;
              [key: string]: unknown;
            } | string;
          }
          
          const response = err.response as ErrorResponse;
          
          // Récupère le message d'erreur du serveur si disponible
          if ('data' in response && response.data) {
            if (typeof response.data === 'object' && 'message' in response.data) {
              message = String(response.data.message);
            } else if (typeof response.data === 'string') {
              message = response.data;
            }
          }
          
          // Définit le titre en fonction du code d'erreur
          if ('status' in response && typeof response.status === 'number') {
            switch (response.status) {
              case 400:
                title = 'Requête incorrecte';
                break;
              case 401:
              case 403:
                title = 'Non autorisé';
                break;
              case 404:
                title = 'Non trouvé';
                break;
              case 500:
                title = 'Erreur serveur';
                break;
              default:
                title = `Erreur ${response.status}`;
            }
          }
        } else if ('message' in err && typeof err.message === 'string') {
          message = err.message;
        }
      }
      
      // Affiche l'erreur via le ErrorProvider
      showError(message, title);
      
      return null;
    }
  };
  
  return { callApi };
}
