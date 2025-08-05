import { toast as sonnerToast } from 'sonner';

export function toast(options: { title: string; description?: string; variant?: string }) {
  sonnerToast(options.title, {
    description: options.description,
    className: options.variant === 'destructive' ? 'toast-error' : undefined,
  });
}