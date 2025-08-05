'use client';

import { useEffect, useState } from 'react';
import { X, CheckCircle, Info, AlertCircle, Loader2 } from 'lucide-react';

type ToastType = 'success' | 'info' | 'warning' | 'loading';

// Gestionnaire global de notifications
export const toastHandler = {
  listeners: new Set<(message: string, type: ToastType) => void>(),
  
  // S'abonner pour recevoir les notifications
  subscribe: (callback: (message: string, type: ToastType) => void) => {
    toastHandler.listeners.add(callback);
    return () => {
      toastHandler.listeners.delete(callback);
    };
  },
  
  // Notifier tous les abonnés
  notify: (message: string, type: ToastType) => {
    toastHandler.listeners.forEach(listener => listener(message, type));
  }
};

// Exposer les fonctions de notification globalement
if (typeof window !== 'undefined') {
  (window as any).showSuccess = (message: string) => toastHandler.notify(message, 'success');
  (window as any).showInfo = (message: string) => toastHandler.notify(message, 'info');
  (window as any).showWarning = (message: string) => toastHandler.notify(message, 'warning');
  (window as any).showLoading = (message: string) => toastHandler.notify(message, 'loading');
}

// Fonctions exportables
export function showSuccess(message: string) {
  toastHandler.notify(message, 'success');
}

export function showInfo(message: string) {
  toastHandler.notify(message, 'info');
}

export function showWarning(message: string) {
  toastHandler.notify(message, 'warning');
}

export function showLoading(message: string) {
  toastHandler.notify(message, 'loading');
}

export default function ToastNotification() {
  const [toast, setToast] = useState<{ message: string, type: ToastType } | null>(null);
  const [visible, setVisible] = useState(false);

  // S'abonner aux notifications
  useEffect(() => {
    const unsubscribe = toastHandler.subscribe((message, type) => {
      setToast({ message, type });
      setVisible(true);
      
      // Auto-fermeture après quelques secondes, sauf pour le type loading
      if (type !== 'loading') {
        setTimeout(() => {
          setVisible(false);
        }, 5000);
      }
    });
    
    return unsubscribe;
  }, []);

  if (!visible || !toast) return null;

  // Configurer l'apparence selon le type
  const typeConfig = {
    success: {
      icon: <CheckCircle size={20} className="text-green-600 dark:text-green-400" />,
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-900',
      titleColor: 'text-green-800 dark:text-green-300',
      textColor: 'text-green-700 dark:text-green-200'
    },
    info: {
      icon: <Info size={20} className="text-primary" />,
      bgColor: 'bg-primary/5',
      borderColor: 'border-primary/20',
      titleColor: 'text-primary-foreground',
      textColor: 'text-primary'
    },
    warning: {
      icon: <AlertCircle size={20} className="text-secondary" />,
      bgColor: 'bg-secondary/10',
      borderColor: 'border-secondary/20',
      titleColor: 'text-secondary-foreground',
      textColor: 'text-secondary'
    },
    loading: {
      icon: <Loader2 size={20} className="text-primary animate-spin" />,
      bgColor: 'bg-primary/5',
      borderColor: 'border-primary/20',
      titleColor: 'text-primary-foreground',
      textColor: 'text-primary'
    }
  };

  const { icon, bgColor, borderColor, titleColor, textColor } = typeConfig[toast.type];
  const title = toast.type === 'success' ? 'Succès' : 
                toast.type === 'info' ? 'Information' : 
                toast.type === 'warning' ? 'Attention' : 'Chargement';

  return (
    <div className="fixed top-4 right-4 left-4 md:left-auto md:w-96 z-50">
      <div className={`relative rounded-md border ${borderColor} ${bgColor} p-4 shadow-md animate-in fade-in slide-in-from-top-5 duration-500`}>
        {toast.type !== 'loading' && (
          <button
            onClick={() => setVisible(false)}
            className={`absolute right-2 top-2 rounded-full p-1 hover:bg-opacity-10 hover:bg-gray-600 ${textColor}`}
            aria-label="Fermer"
          >
            <X size={16} />
          </button>
        )}
        
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <div className={`font-medium ${titleColor}`}>{title}</div>
            <div className={`text-sm ${textColor}`}>{toast.message}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
