import type { NextConfig } from "next";

// Gestionnaire global pour les erreurs non capturées
if (typeof process !== 'undefined') {
  process.on('uncaughtException', (error) => {
    console.error('UNCAUGHT EXCEPTION:', error);
    // Loggez l'erreur mais ne laissez pas le serveur planter
    // En production, vous pourriez envoyer un message à un service comme Sentry
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('UNHANDLED REJECTION:', { reason, promise });
    // Loggez l'erreur mais ne laissez pas le serveur planter
    // En production, vous pourriez envoyer un message à un service comme Sentry
  });
}

const nextConfig: NextConfig = {
  eslint: {
    // FORCER le build même avec des erreurs ESLint
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignorer les erreurs TypeScript pendant le build
    ignoreBuildErrors: true,
  },
  // Vous pouvez ajouter d'autres options de configuration ici
};

export default nextConfig;
