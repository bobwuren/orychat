"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { History, Clock } from "lucide-react";

interface HistoryButtonProps {
    className?: string;
    children?: React.ReactNode;
    variant?: "default" | "ghost" | "outline";
    size?: "default" | "sm" | "lg" | "icon";
    showConfirmation?: boolean;
    onNavigate?: () => void; // Callback pour actions personnalisées avant navigation
}

export default function HistoryButton({ 
    className = "", 
    children, 
    variant = "ghost",
    size = "default",
    showConfirmation = false,
    onNavigate
}: HistoryButtonProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleNavigation = async () => {
        setLoading(true);
        try {
            // Exécuter le callback personnalisé si fourni
            if (onNavigate) {
                await onNavigate();
            }
            router.push("/recommendation-history");
        } catch (error) {
            console.error("Erreur lors de la navigation:", error);
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    const handleClick = () => {
        if (showConfirmation) {
            setOpen(true);
        } else {
            handleNavigation();
        }
    };

    if (showConfirmation) {
        return (
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                    <Button variant={variant} size={size} className={className} onClick={handleClick}>
                        <History className="w-4 h-4 mr-2"/>
                        {children || "Historique"}
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="border-0 shadow-2xl bg-card/95 backdrop-blur-md">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-lg"/>
                    <AlertDialogHeader className="relative">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-12 w-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
                                <Clock className="h-6 w-6 text-primary"/>
                            </div>
                            <AlertDialogTitle className="text-xl font-bold">Accéder à l'historique</AlertDialogTitle>
                        </div>
                        <AlertDialogDescription className="text-base leading-relaxed">
                            Vous allez consulter votre historique de recommandations. Vos données actuelles seront conservées.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="relative">
                        <AlertDialogCancel 
                            disabled={loading}
                            className="hover:bg-muted/80 transition-colors"
                        >
                            Annuler
                        </AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleNavigation} 
                            disabled={loading}
                            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
                        >
                            {loading ? "Navigation..." : "Voir l'historique"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    }

    return (
        <Button variant={variant} size={size} className={className} onClick={handleClick} disabled={loading}>
            <History className="w-4 h-4 mr-2"/>
            {children || "Historique"}
        </Button>
    );
}