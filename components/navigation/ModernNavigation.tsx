"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
    User, 
    Settings, 
    HelpCircle, 
    ChevronDown,
    Sparkles,
    Menu,
    X,
    Shield,
    ExternalLink
} from "lucide-react";
import LogoutButton from "@/components/auth/LogoutButton";
import HistoryButton from "@/components/custom-comps/HistoryButton";
import { getCurrentUser } from "@/lib/services/apiService";

interface ModernNavigationProps {
    variant?: "full" | "compact" | "mobile";
    className?: string;
    showHistoryConfirmation?: boolean;
    onHistoryNavigate?: () => void;
}

interface UserInfo {
    id: number;
    email: string;
    name?: string;
    role: string;
}

export default function ModernNavigation({ 
    variant = "full", 
    className = "",
    showHistoryConfirmation = false,
    onHistoryNavigate
}: ModernNavigationProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const router = useRouter();

    // Récupérer les informations de l'utilisateur au montage du composant
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                setIsLoadingUser(true);
                const user = await getCurrentUser();
                setUserInfo(user);
            } catch (error) {
                console.error('Erreur lors de la récupération des informations utilisateur:', error);
                setUserInfo(null);
            } finally {
                setIsLoadingUser(false);
            }
        };

        fetchUserInfo();
    }, []);

    const handleAdminRedirect = () => {
        const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL;
        if (adminUrl) {
            window.open(adminUrl, '_blank', 'noopener,noreferrer');
        }
    };

    const displayName = userInfo?.email || 'Utilisateur';
    const isAdmin = userInfo?.role === 'admin';

    // Version mobile avec menu burger
    if (variant === "mobile") {
        return (
            <div className={`relative ${className}`}>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="relative h-10 w-10 rounded-full border-2 border-primary/20 hover:border-primary/30 hover:bg-primary/5 transition-all"
                >
                    {isMobileMenuOpen ? (
                        <X className="h-5 w-5 text-primary" />
                    ) : (
                        <Menu className="h-5 w-5 text-primary" />
                    )}
                </Button>

                {isMobileMenuOpen && (
                    <>
                        {/* Overlay */}
                        <div 
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        
                        {/* Menu mobile */}
                        <div className="absolute right-0 top-12 w-72 bg-card/95 backdrop-blur-md border border-border/50 rounded-2xl shadow-2xl z-50 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
                            
                            {/* Header utilisateur */}
                            <div className="relative p-4 border-b border-border/30">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-bold">
                                            <User className="h-6 w-6" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold text-foreground">{isLoadingUser ? 'Chargement...' : displayName}</p>
                                        {isAdmin && (
                                            <Badge variant="secondary" className="text-xs mt-1">
                                                Admin
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Menu items */}
                            <div className="relative p-2">
                                <HistoryButton
                                    variant="ghost"
                                    className="w-full justify-start h-12 text-left font-medium hover:bg-primary/5 hover:text-primary transition-all rounded-xl"
                                    showConfirmation={showHistoryConfirmation}
                                    onNavigate={onHistoryNavigate}
                                >
                                    Historique des recommandations
                                </HistoryButton>

                                {isAdmin && (
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start h-12 text-left font-medium hover:bg-amber-50 hover:text-amber-700 transition-all rounded-xl"
                                        onClick={handleAdminRedirect}
                                    >
                                        <Shield className="w-4 h-4 mr-2" />
                                        Interface Admin
                                        <ExternalLink className="w-3 h-3 ml-auto" />
                                    </Button>
                                )}

                                <div className="border-t border-border/30 mt-2 pt-2">
                                    <LogoutButton className="w-full justify-start h-12 text-left font-medium hover:bg-destructive/5 hover:text-destructive transition-all rounded-xl">
                                        Déconnexion
                                    </LogoutButton>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    }

    // Version compacte
    if (variant === "compact") {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button 
                        variant="ghost" 
                        className={`relative h-10 w-10 rounded-full border-2 border-primary/20 hover:border-primary/30 hover:bg-primary/5 transition-all ${className}`}
                    >
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-bold text-sm">
                                <User className="h-4 w-4" />
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                    align="end" 
                    className="w-64 bg-card/95 backdrop-blur-md border-border/50 shadow-2xl rounded-xl overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
                    
                    <DropdownMenuLabel className="relative px-4 py-3 border-b border-border/30">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-primary/20">
                                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-bold">
                                    <User className="h-5 w-5" />
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{isLoadingUser ? 'Chargement...' : 'Mon compte'}</p>
                                <p className="text-sm text-muted-foreground">{isLoadingUser ? '' : displayName}</p>
                                {isAdmin && (
                                    <Badge variant="secondary" className="text-xs mt-1">
                                        Admin
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </DropdownMenuLabel>

                    <div className="relative p-1">
                        <DropdownMenuItem asChild>
                            <HistoryButton
                                variant="ghost"
                                className="w-full justify-start font-medium hover:bg-primary/5 hover:text-primary transition-all"
                                showConfirmation={showHistoryConfirmation}
                                onNavigate={onHistoryNavigate}
                            >
                                Historique
                            </HistoryButton>
                        </DropdownMenuItem>
                        
                        {isAdmin && (
                            <DropdownMenuItem asChild>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start font-medium hover:bg-amber-50 hover:text-amber-700 transition-all"
                                    onClick={handleAdminRedirect}
                                >
                                    <Shield className="w-4 h-4 mr-2" />
                                    Interface Admin
                                    <ExternalLink className="w-3 h-3 ml-auto" />
                                </Button>
                            </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuSeparator className="bg-border/30" />
                        
                        <DropdownMenuItem asChild>
                            <LogoutButton className="w-full justify-start font-medium hover:bg-destructive/5 hover:text-destructive transition-all">
                                Déconnexion
                            </LogoutButton>
                        </DropdownMenuItem>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    // Version complète (par défaut)
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button 
                        variant="outline" 
                        className="flex items-center gap-3 px-4 py-2 h-11 border-2 border-primary/20 hover:border-primary/30 hover:bg-primary/5 transition-all rounded-xl shadow-sm"
                    >
                        <Avatar className="h-8 w-8 border-2 border-primary/20">
                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-bold text-sm">
                                <User className="h-4 w-4" />
                            </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{isLoadingUser ? 'Chargement...' : 'Mon compte'}</span>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                    align="end" 
                    className="w-72 bg-card/95 backdrop-blur-md border-border/50 shadow-2xl rounded-xl overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
                    
                    <DropdownMenuLabel className="relative px-4 py-4 border-b border-border/30">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 border-2 border-primary/20">
                                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-bold">
                                    <User className="h-6 w-6" />
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold text-base">{isLoadingUser ? 'Chargement...' : displayName}</p>
                                {isAdmin && (
                                    <Badge variant="secondary" className="text-xs mt-1">
                                        <Shield className="w-3 h-3 mr-1" />
                                        Admin
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </DropdownMenuLabel>

                    <div className="relative p-2">
                        <DropdownMenuItem asChild>
                            <HistoryButton
                                variant="ghost"
                                className="w-full justify-start h-12 font-medium hover:bg-primary/5 hover:text-primary transition-all rounded-xl"
                                showConfirmation={showHistoryConfirmation}
                                onNavigate={onHistoryNavigate}
                            >
                                Historique des recommandations
                            </HistoryButton>
                        </DropdownMenuItem>
                        
                        {isAdmin && (
                            <DropdownMenuItem asChild>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start h-12 font-medium hover:bg-amber-50 hover:text-amber-700 transition-all rounded-xl"
                                    onClick={handleAdminRedirect}
                                >
                                    <Shield className="w-4 h-4 mr-2" />
                                    Interface Admin
                                    <ExternalLink className="w-3 h-3 ml-auto" />
                                </Button>
                            </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuSeparator className="bg-border/30 my-2" />
                        
                        <DropdownMenuItem asChild>
                            <LogoutButton className="w-full justify-start h-12 font-medium hover:bg-destructive/5 hover:text-destructive transition-all rounded-xl">
                                Déconnexion
                            </LogoutButton>
                        </DropdownMenuItem>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}