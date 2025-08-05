'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import ErrorDisplay from '@/components/ui/error-display';

// Types pour notre contexte d'erreur
interface ErrorContextType {
  showError: (message: string, title?: string) => void;
  clearError: () => void;
}

// Création du contexte
const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

// Props pour notre provider
interface ErrorProviderProps {
  children: ReactNode;
}

// Provider qui contient la logique d'affichage des erreurs
export function ErrorProvider({ children }: ErrorProviderProps) {
  const [error, setError] = useState<{ message: string; title?: string } | null>(null);

  // Fonction pour afficher une erreur
  const showError = (message: string, title?: string) => {
    setError({ message, title });
    // Log l'erreur en console pour le débogage
    console.error('Erreur affichée:', { message, title });
  };

  // Fonction pour effacer l'erreur
  const clearError = () => {
    setError(null);
  };

  return (
    <ErrorContext.Provider value={{ showError, clearError }}>
      {/* Affiche l'erreur si elle existe */}
      {error && (
        <div className="fixed top-5 right-5 z-50 w-full max-w-md animate-in fade-in slide-in-from-right">
          <ErrorDisplay 
            title={error.title} 
            message={error.message} 
            retry={clearError} 
          />
        </div>
      )}
      {children}
    </ErrorContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte d'erreur
export function useError() {
  const context = useContext(ErrorContext);
  
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  
  return context;
}
