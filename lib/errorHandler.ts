/**
 * Système de gestion d'erreurs unifié pour l'application
 * Ce fichier regroupe toutes les fonctions de gestion d'erreurs nécessaires
 */

// Pour le middleware (anciennement errorHandler.ts)
export function handleMiddlewareError(error: Error) {
  // Log l'erreur pour le debug (en prod, utilisez un service de logging comme Sentry)
  console.error('Server Error:', error);
  
  // Vous pourriez envoyer l'erreur à un service comme Sentry ici
  
  return {
    message: 'Une erreur est survenue, mais le serveur continue de fonctionner',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  };
}

// Pour les services API (anciennement errorHandling.ts)
/**
 * Gère les erreurs des services API de manière cohérente
 * @param error L'erreur capturée
 * @param context Information supplémentaire sur le contexte de l'erreur
 * @returns Un objet d'erreur formaté
 */
export function handleApiError(error: unknown, context: string = 'API'): { 
  message: string; 
  error: string | object;
  status: number;
} {
  // Log l'erreur pour le debug
  console.error(`[${context}] Error:`, error);
  
  // Détermine le message et le statut selon le type d'erreur
  let message = 'Une erreur est survenue lors de la communication avec le serveur';
  let errorDetails: string | object = 'Unknown error';
  let status = 500;
  
  // Gestion spécifique selon le type d'erreur
  if (error && typeof error === 'object') {
    if ('message' in error && typeof error.message === 'string') {
      errorDetails = error.message;
    }
    
    if ('response' in error && error.response && typeof error.response === 'object') {
      // Définition d'un type pour la réponse d'erreur
      interface ErrorResponse {
        status?: number;
        data?: unknown;
      }
      
      const response = error.response as ErrorResponse;
      
      // Récupère le statut HTTP si disponible
      if ('status' in response && typeof response.status === 'number') {
        status = response.status;
      }
      
      // Récupère le message d'erreur du serveur si disponible
      if ('data' in response && response.data) {
        if (typeof response.data === 'object' && 'message' in response.data) {
          message = String(response.data.message);
        } else if (typeof response.data === 'string') {
          message = response.data;
        }
        errorDetails = response.data;
      }
    }
  } else if (typeof error === 'string') {
    errorDetails = error;
  }
  
  // En production, on ne renvoie pas les détails techniques
  if (process.env.NODE_ENV !== 'development') {
    errorDetails = 'Internal Server Error';
  }
  
  return {
    message,
    error: errorDetails,
    status
  };
}

// Pour les API routes, au cas où vous en auriez besoin à l'avenir
type NextApiHandler = (req: Request, context: { params: Record<string, string> }) => Promise<Response>;

export function withErrorHandling(handler: NextApiHandler): NextApiHandler {
  return async (req: Request, context: { params: Record<string, string> }) => {
    try {
      return await handler(req, context);
    } catch (error: unknown) {
      console.error('API Route Error:', error);
      
      // Récupérer le message d'erreur de façon sécurisée
      const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
      
      // Renvoie une réponse d'erreur sans faire planter le serveur
      return Response.json(
        {
          success: false,
          message: 'Une erreur est survenue mais le serveur continue de fonctionner',
          error: process.env.NODE_ENV === 'development' ? errorMessage : 'Internal Server Error',
        },
        { status: 500 }
      );
    }
  };
}
