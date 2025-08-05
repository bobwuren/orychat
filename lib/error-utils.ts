import { AxiosError } from 'axios';
import { showError } from '@/components/ErrorToast';

/**
 * Fonction simple pour convertir les erreurs API en messages conviviaux
 */
export function getErrorMessage(error: any): string {
  // Erreurs Axios
  if (error instanceof AxiosError) {
    // Erreur réseau (pas de connexion internet ou serveur down)
    if (!error.response) {
      return 'Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet.';
    }
    
    // Si le serveur a renvoyé un message d'erreur formaté
    if (error.response.data?.message && typeof error.response.data.message === 'string') {
      return error.response.data.message;
    }
    
    // Messages par défaut selon le code HTTP
    const status = error.response.status;
    switch (status) {
      case 400:
        return 'Les données envoyées sont incorrectes.';
      case 401:
        return 'Vous devez vous connecter pour accéder à cette ressource.';
      case 403:
        return 'Vous n\'avez pas les droits nécessaires pour accéder à cette ressource.';
      case 404:
        return 'La ressource demandée n\'existe pas.';
      case 429:
        return 'Trop de requêtes. Veuillez réessayer plus tard.';
      case 500:
      case 502:
      case 503:
      case 504:
        return 'Le serveur a rencontré un problème. Veuillez réessayer plus tard.';
      default:
        return `Une erreur est survenue (${status}).`;
    }
  }
  
  // Si c'est une erreur standard avec un message
  if (error instanceof Error) {
    return error.message || 'Une erreur est survenue.';
  }
  
  // Pour tout autre type d'erreur
  if (typeof error === 'string') {
    return error;
  }
  
  return 'Une erreur inattendue est survenue.';
}

/**
 * Wrapper pour les appels API avec gestion d'erreur automatique
 * @example
 * const result = await safeApiCall(() => apiService.get('/endpoint'));
 * if (result.success) {
 *   // Traiter result.data
 * }
 */
export async function safeApiCall<T>(
  apiCall: () => Promise<T>,
  options?: { showErrorToast?: boolean; customErrorMessage?: string }
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const data = await apiCall();
    return { success: true, data };
  } catch (error) {
    const errorMessage = options?.customErrorMessage || getErrorMessage(error);
    console.error('API Error:', error);
    
    // Afficher une notification d'erreur
    if (options?.showErrorToast !== false && typeof window !== 'undefined') {
      showError(errorMessage);
    }
    
    return { success: false, error: errorMessage };
  }
}

/**
 * Configuration serveur pour empêcher les crashes en production
 * Cette fonction est appelée au démarrage de l'application
 */
export function setupServerErrorHandlers() {
  if (typeof window === 'undefined') {
    // Uniquement côté serveur
    process.on('uncaughtException', (error) => {
      console.error('[Server] Erreur non capturée:', error);
      // Ne pas arrêter le serveur
    });
    
    process.on('unhandledRejection', (reason) => {
      console.error('[Server] Promesse rejetée non gérée:', reason);
      // Ne pas arrêter le serveur
    });
  }
}
