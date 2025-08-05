'use client';

import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { X } from 'lucide-react';
import { Button } from './button';

interface ErrorNotificationProps {
  message: string;
  title?: string;
  autoClose?: boolean;
  duration?: number;
}

/**
 * Composant pour afficher des notifications d'erreur de manière conviviale
 */
export function ErrorNotification({
  message,
  title = 'Erreur',
  autoClose = true,
  duration = 5000
}: ErrorNotificationProps) {
  const [visible, setVisible] = useState(true);

  // Auto-fermeture après durée spécifiée
  useEffect(() => {
    if (autoClose && visible) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, visible]);

  if (!visible) return null;

  return (
    <Alert className="relative border-red-300 bg-red-50 text-red-800 mb-4 animate-in fade-in slide-in-from-top-5 duration-500">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-6 w-6 text-red-500 hover:bg-red-100 hover:text-red-600"
        onClick={() => setVisible(false)}
      >
        <X className="h-4 w-4" />
      </Button>
      
      <AlertTitle className="text-red-600">{title}</AlertTitle>
      <AlertDescription className="text-red-700">
        {message}
      </AlertDescription>
    </Alert>
  );
}
