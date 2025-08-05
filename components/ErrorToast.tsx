'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

// Gestionnaire global d'erreurs
const globalErrorHandler = {
  listeners: new Set<(message: string) => void>(),
  
  // S'abonner pour recevoir les notifications d'erreur
  subscribe: (callback: (message: string) => void) => {
    globalErrorHandler.listeners.add(callback);
    return () => globalErrorHandler.listeners.delete(callback);
  },
  
  // Notifier une erreur à tous les abonnés
  notify: (message: string) => {
    globalErrorHandler.listeners.forEach(listener => listener(message));
  }
};

// Exposer la fonction de notification globalement
if (typeof window !== 'undefined') {
  (window as any).showError = globalErrorHandler.notify;
}

export function showError(message: string) {
  globalErrorHandler.notify(message);
}

export default function ErrorToast() {
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  // S'abonner aux notifications d'erreur et configurer les gestionnaires d'erreurs globaux
  useEffect(() => {
    // S'abonner aux notifications d'erreur
    const unsubscribe = globalErrorHandler.subscribe((message) => {
      setError(message);
      setVisible(true);
      
      // Auto-fermeture après 5 secondes
      setTimeout(() => {
        setVisible(false);
      }, 5000);
    });
    
    // Configurer les gestionnaires d'erreurs globaux
    const errorHandler = (event: ErrorEvent) => {
      globalErrorHandler.notify('Une erreur est survenue. Veuillez réessayer.');
      console.error('Erreur non capturée:', event.error);
    };
    
    const rejectionHandler = (event: PromiseRejectionEvent) => {
      globalErrorHandler.notify('Une erreur est survenue. Veuillez réessayer.');
      console.error('Promesse rejetée non gérée:', event.reason);
    };
    
    // Ajouter les écouteurs d'événements
    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', rejectionHandler);
    
    // Nettoyer les écouteurs à la destruction du composant
    return () => {
      unsubscribe();
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', rejectionHandler);
    };
  }, []);

  if (!visible || !error) return null;

  return (
    <div className="fixed top-4 right-4 left-4 md:left-auto md:w-96 z-50">
      <div className="relative rounded-md border border-red-200 bg-red-50 p-4 shadow-md animate-in fade-in slide-in-from-top-5 duration-500">
        <button
          onClick={() => setVisible(false)}
          className="absolute right-2 top-2 rounded-full p-1 hover:bg-red-100 text-red-500"
          aria-label="Fermer"
        >
          <X size={16} />
        </button>
        
        <div className="mb-1 font-medium text-red-800">Erreur</div>
        <div className="text-sm text-red-700">{error}</div>
      </div>
    </div>
  );
}
