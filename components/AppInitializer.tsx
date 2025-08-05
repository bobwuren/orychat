"use client";
import { useEffect } from "react";
import { restoreSession } from "@/lib/services/apiService";
import { setupServerErrorHandlers } from "@/lib/error-utils";

export default function AppInitializer() {
  useEffect(() => {
    // Restaurer la session utilisateur
    restoreSession();
    
    // Configurer les gestionnaires d'erreurs côté serveur
    setupServerErrorHandlers();
    
    console.log("Application initialisée avec protection contre les crashs");
  }, []);
  
  return null;
}

