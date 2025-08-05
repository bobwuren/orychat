"use client";

import React, {useEffect, useState} from "react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {AlertCircle, ArrowLeft, ArrowRight, GraduationCap, Loader2, Mail, Lock} from "lucide-react";

import { AuthStateNotifier, AuthState } from "./AuthStateNotifier";

export function RegisterForm({
    onRegister,
    isLoading,
    registerError,
    className,
    ...props
}: {
    onRegister: (email: string, password: string) => void,
    isLoading: boolean,
    registerError?: string
} & React.ComponentProps<"div">) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [authState, setAuthState] = useState<AuthState>("idle");
    const [stateMessage, setStateMessage] = useState<string>("");

    // Reset état quand les props changent
    useEffect(() => {
        if (isLoading) {
            setAuthState("loading");
            setStateMessage("");
        } else if (registerError) {
            setAuthState("error");
            setStateMessage(registerError);
        }
    }, [isLoading, registerError]);

    // Réinitialiser l'état d'authentification
    const clearAuthState = () => {
        setAuthState("idle");
        setStateMessage("");
    };

    const validate = () => {
        if (!email.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)) {
            setError("Veuillez saisir une adresse e-mail valide.");
            return false;
        }
        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)) {
            setError("Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.");
            return false;
        }
        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return false;
        }
        setError(null);
        return true;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setAuthState("loading");
        setStateMessage("");
        onRegister(email, password);
    };

    return (
        <div className="space-y-2">
            {/* Logo Section */}
            <div className="text-center">
                <div className="inline-flex items-center justify-center">
                    <div className="h-16 w-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-xl mb-2">
                        <GraduationCap className="h-8 w-8 text-primary-foreground"/>
                    </div>
                </div>
            </div>

            {/* Register Card */}
            <Card className="border-0 shadow-2xl bg-card/50 backdrop-blur-sm overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"/>
                <CardHeader className="relative text-center">
                    <CardTitle className="text-2xl font-bold text-foreground">Créer un compte</CardTitle>
                    <CardDescription className="text-base text-muted-foreground">
                        Saisissez vos informations pour créer un compte
                    </CardDescription>
                </CardHeader>
                <CardContent className="relative space-y-6">
                    {/* État d'authentification */}
                    <AuthStateNotifier 
                        state={authState} 
                        message={stateMessage}
                        action="register"
                        clearState={clearAuthState}
                    />
                    
                    {/* Erreurs de validation */}
                    {error && (
                        <Alert className="border-destructive/20 bg-destructive/5 backdrop-blur-sm">
                            <AlertCircle className="h-4 w-4 text-destructive"/>
                            <AlertDescription className="text-destructive font-medium">
                                {error}
                            </AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-foreground">
                                Adresse e-mail
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground"/>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="votre@email.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                    className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary/50 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium text-foreground">
                                Mot de passe
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground"/>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="new-password"
                                    className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary/50 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                                Confirmer le mot de passe
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground"/>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    autoComplete="new-password"
                                    className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary/50 transition-all"
                                />
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-200" 
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin"/>
                                    Création...
                                </>
                            ) : (
                                <>
                                    Créer un compte
                                    <ArrowRight className="ml-2 h-5 w-5"/>
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="text-center pt-0 border-t border-border/20">
                        <p className="text-sm text-muted-foreground">
                            Déjà un compte?{" "}
                            <Link 
                                href="/login" 
                                className="text-primary hover:text-primary/80 font-medium transition-colors inline-flex items-center gap-1"
                            >
                                Se connecter
                                <ArrowRight className="h-3 w-3"/>
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}