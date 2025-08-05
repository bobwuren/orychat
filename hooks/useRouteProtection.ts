import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { restoreSession } from '@/lib/services/apiService';

interface RouteProtectionOptions {
  requireAuth?: boolean;
  requireSerieSelection?: boolean;
  requireNotes?: boolean;
  redirectIfAuthenticated?: boolean;
}

export const useRouteProtection = (options: RouteProtectionOptions = {}) => {
  const router = useRouter();
  const {
    requireAuth = false,
    requireSerieSelection = false,
    requireNotes = false,
    redirectIfAuthenticated = false
  } = options;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Restaurer la session depuis localStorage/cookies
    restoreSession();
    
    const accessToken = localStorage.getItem('accessToken');
    const selectedSerieId = localStorage.getItem('selectedSerieId');
    const notesStr = localStorage.getItem('notes');
    const isAuthenticated = !!accessToken;

    // Rediriger les utilisateurs connectés vers le dashboard s'ils tentent d'accéder aux pages auth
    if (redirectIfAuthenticated && isAuthenticated) {
      router.replace('/dashboard');
      return;
    }

    // Vérifier l'authentification
    if (requireAuth && !isAuthenticated) {
      router.replace('/login');
      return;
    }

    // Vérifier la sélection de série
    if (requireSerieSelection && !selectedSerieId) {
      router.replace('/dashboard');
      return;
    }

    // Vérifier la présence des notes
    if (requireNotes) {
      if (!selectedSerieId || !notesStr) {
        router.replace('/dashboard');
        return;
      }

      try {
        const notes = JSON.parse(notesStr);
        const hasValidNotes = Object.values(notes).some(note => typeof note === 'number' && note > 0);
        
        if (!hasValidNotes) {
          router.replace('/notes-entering');
          return;
        }
      } catch {
        router.replace('/dashboard');
        return;
      }
    }
  }, [router, requireAuth, requireSerieSelection, requireNotes, redirectIfAuthenticated]);
};

export default useRouteProtection;