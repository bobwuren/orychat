"use client"

import React, {useEffect, useState} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Alert, AlertDescription} from "@/components/ui/alert"
import {ArrowRight, GraduationCap, Mail, Lock, AlertCircle, Loader2} from "lucide-react"
import Link from "next/link"
import { AuthStateNotifier, AuthState } from "./AuthStateNotifier"

export function LoginForm({onLogin, isLoading, loginError}: {
    onLogin: (email: string, password: string) => void,
    isLoading: boolean,
    loginError?: string
}) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [authState, setAuthState] = useState<AuthState>("idle")
    const [stateMessage, setStateMessage] = useState<string>("")

    // Reset état quand les props changent
    useEffect(() => {
        if (isLoading) {
            setAuthState("loading")
            setStateMessage("")
        } else if (loginError) {
            setAuthState("error")
            setStateMessage(loginError)
        }
    }, [isLoading, loginError])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setAuthState("loading")
        setStateMessage("")
        onLogin(email, password)
    }
    
    // Réinitialiser l'état d'authentification
    const clearAuthState = () => {
        setAuthState("idle")
        setStateMessage("")
    }

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

            {/* Login Card */}
            <Card className="border-0 shadow-2xl bg-card/50 backdrop-blur-sm overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"/>
                <CardHeader className="relative text-center">
                    <CardTitle className="text-2xl font-bold text-foreground">Connexion</CardTitle>
                    <CardDescription className="text-base text-muted-foreground">
                        Saisissez vos identifiants pour accéder à votre compte
                    </CardDescription>
                </CardHeader>
                <CardContent className="relative space-y-3">
                    {/* État d'authentification */}
                    <AuthStateNotifier 
                        state={authState} 
                        message={stateMessage}
                        action="login"
                        clearState={clearAuthState}
                    />

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
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                                    Mot de passe
                                </Label>
                                <Link 
                                    href="/register"
                                    className="text-sm text-primary hover:text-primary/80 transition-colors font-medium inline-flex items-center gap-1"
                                >
                                    Pas de compte?
                                    <ArrowRight className="h-4 w-4 ml-1" />
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground"/>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
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
                                    Connexion...
                                </>
                            ) : (
                                <>
                                    Se connecter
                                    <ArrowRight className="ml-2 h-5 w-5"/>
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}