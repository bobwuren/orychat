"use client"

import {useEffect, useState} from "react"
import {restoreSession} from "@/lib/services/apiService"
import {useRouter} from "next/navigation"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Skeleton} from "@/components/ui/skeleton"
import {Alert, AlertDescription} from "@/components/ui/alert"
import {GraduationCap, ChevronRight, AlertCircle, BookOpen, FlaskConical, Brain, Wrench, TrendingUp, PieChart, Target} from "lucide-react"
import {getAllSeries} from "@/lib/services/serieService"
import {Serie} from "@/types/serie"
import ModernNavigation from "@/components/navigation/ModernNavigation"
import useRouteProtection from "@/hooks/useRouteProtection"

export default function DashboardPage() {
    const router = useRouter()
    const [series, setSeries] = useState<Serie[]>([])
    const [loadingSeries, setLoadingSeries] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Protection de route : nécessite d'être connecté
    useRouteProtection({ requireAuth: true });

    useEffect(() => {
        const initializePage = async () => {
            try {
                restoreSession()
                const accessToken = localStorage.getItem("accessToken")
                if (!accessToken) {
                    router.push("/login")
                    return
                }

                // Nettoyer les données de flow précédentes au chargement du dashboard
                localStorage.removeItem("selectedSerieId")
                localStorage.removeItem("notes")

                // Gestion du cache avec expiration (24h)
                const cacheKey = "series"
                const cacheTimeKey = "series_cache_time"
                const now = Date.now()
                const cacheDuration = 24 * 60 * 60 * 1000 // 24h en ms
                const cachedSeries = localStorage.getItem(cacheKey)
                const cachedTime = localStorage.getItem(cacheTimeKey)
                if (cachedSeries && cachedTime && now - parseInt(cachedTime, 10) < cacheDuration) {
                    setSeries(JSON.parse(cachedSeries))
                    setError(null)
                } else {
                    const data = await getAllSeries()
                    setSeries(data)
                    localStorage.setItem(cacheKey, JSON.stringify(data))
                    localStorage.setItem(cacheTimeKey, now.toString())
                    setError(null)
                }
            } catch (err) {
                console.error("Erreur lors du chargement des séries:", err)
                setError("Impossible de charger les séries. Veuillez réessayer.")
                setSeries([])
            } finally {
                setLoadingSeries(false)
            }
        }
        initializePage()
    }, [router])

    // Fonction utilitaire pour choisir l'icône d'une série selon son code
    function getSerieIcon(code: string) {
        if (!code) return GraduationCap
        const codeUpper = code.toUpperCase()
        if (codeUpper.startsWith('A')) return BookOpen
        if (codeUpper.startsWith('C')) return FlaskConical
        if (codeUpper.startsWith('D')) return Brain
        if (codeUpper.startsWith('F')) return Wrench
        if (codeUpper.startsWith('G1')) return TrendingUp
        if (codeUpper.startsWith('G2')) return PieChart
        if (codeUpper.startsWith('G3')) return Target
        return GraduationCap
    }

    const handleSerieSelect = (serieId: string) => {
        // Nettoyer les notes précédentes et définir la nouvelle série
        localStorage.removeItem("notes")
        localStorage.setItem("selectedSerieId", serieId)
        router.push("/notes-entering")
    }

    if (loadingSeries) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
                <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
                    {/* Header Skeleton */}
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6 mb-6 lg:mb-10">
                        <div className="flex items-center gap-3 lg:gap-5">
                            <Skeleton className="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 rounded-2xl"/>
                            <div className="space-y-2 lg:space-y-3">
                                <Skeleton className="h-6 w-24 sm:h-8 sm:w-32 lg:h-10 lg:w-40"/>
                                <Skeleton className="h-3 w-40 sm:h-4 sm:w-64 lg:h-5 lg:w-80"/>
                            </div>
                        </div>
                        <Skeleton className="h-8 w-20 sm:h-10 sm:w-24 lg:h-12 lg:w-28"/>
                    </div>

                    {/* Selection Card Skeleton */}
                    <Card className="mb-6 lg:mb-10 border-0 shadow-xl bg-card/50 backdrop-blur-sm">
                        <CardHeader className="pb-3 lg:pb-4">
                            <div className="flex items-center gap-3 lg:gap-4">
                                <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 rounded-xl"/>
                                <Skeleton className="h-5 w-32 sm:h-6 sm:w-48 lg:h-7 lg:w-56"/>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-12 sm:h-14 lg:h-16 w-full rounded-xl"/>
                        </CardContent>
                    </Card>

                    {/* Grid Skeletons */}
                    <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                        {[...Array(10)].map((_, i) => (
                            <Card key={i} className="border-0 shadow-lg bg-card/40 backdrop-blur-sm">
                                <CardContent className="p-3 sm:p-4 lg:p-5">
                                    <div className="flex items-center gap-3 lg:gap-4">
                                        <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 rounded-xl"/>
                                        <div className="flex-1 space-y-1.5 lg:space-y-2">
                                            <Skeleton className="h-4 w-12 sm:h-5 sm:w-16 lg:h-6 lg:w-20"/>
                                            <Skeleton className="h-3 w-20 sm:h-4 sm:w-32 lg:h-4 lg:w-36"/>
                                        </div>
                                        <Skeleton className="h-4 w-4 sm:h-5 sm:w-5"/>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
            <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
                {/* Header */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-8 mb-6 lg:mb-10">
                    <div className="flex items-center gap-3 lg:gap-5">
                        <div className="relative group">
                            <div className="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 bg-gradient-to-br from-primary via-primary to-primary/80 rounded-3xl flex items-center justify-center shadow-2xl group-hover:shadow-primary/25 transition-all duration-300">
                                <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-primary-foreground"/>
                            </div>
                            <div className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                                <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-white rounded-full animate-pulse"/>
                            </div>
                        </div>
                        <div className="space-y-1 lg:space-y-2">
                            <h1 className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-black bg-gradient-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent tracking-tight">
                                Orientys
                            </h1>
                            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-muted-foreground font-medium">
                                Découvrez le parcours fait pour vous
                            </p>
                        </div>
                    </div>
                    
                    {/* Navigation */}
                    <div className="w-full lg:w-auto">
                        <div className="lg:hidden">
                            <ModernNavigation variant="mobile" />
                        </div>
                        <div className="hidden lg:block">
                            <ModernNavigation variant="compact" className="flex-shrink-0" />
                        </div>
                    </div>
                </div>

                {/* Error Alert */}
                {error && (
                    <Alert className="mb-6 lg:mb-8 border-destructive/30 bg-destructive/10 backdrop-blur-sm rounded-2xl shadow-lg">
                        <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-destructive"/>
                        <AlertDescription className="text-destructive font-semibold text-sm sm:text-base">
                            {error}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Serie Selection Card */}
                <Card className="mb-6 lg:mb-10 border-0 shadow-2xl bg-card/60 backdrop-blur-md overflow-hidden group hover:shadow-3xl transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/15 via-primary/8 to-secondary/15 group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-500"/>
                    <CardHeader className="relative pb-3 lg:pb-4">
                        <div className="flex items-center gap-3 lg:gap-5">
                            <div className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-300">
                                <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-primary-foreground"/>
                            </div>
                            <div className="space-y-1">
                                <CardTitle className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-foreground">
                                    Sélectionnez votre série
                                </CardTitle>
                                <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">
                                    Choisissez votre filière pour commencer l'analyse
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="relative">
                        <Select onValueChange={handleSerieSelect}>
                            <SelectTrigger className="h-12 sm:h-14 lg:h-16 text-sm sm:text-base lg:text-lg border-2 border-border/50 hover:border-primary/50 focus:border-primary transition-all duration-200 bg-background/60 backdrop-blur-sm shadow-inner rounded-xl">
                                <SelectValue placeholder="Choisir une série..." className="text-muted-foreground font-medium"/>
                            </SelectTrigger>
                            <SelectContent className="bg-popover/95 backdrop-blur-md border-border/50 shadow-2xl rounded-xl">
                                {series.map((serie) => {
                                    const Icon = getSerieIcon(serie.code)
                                    return (
                                        <SelectItem key={serie.id} value={serie.id} className="py-3 sm:py-4 lg:py-5 rounded-lg hover:bg-primary/5 transition-colors">
                                            <div className="flex items-center gap-3 lg:gap-4 w-full">
                                                <div className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 bg-primary/15 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-primary"/>
                                                </div>
                                                <div className="flex-1 space-y-0.5">
                                                    <div className="font-bold text-sm sm:text-base lg:text-lg text-foreground">{serie.code}</div>
                                                    <div className="text-xs sm:text-sm lg:text-base text-muted-foreground line-clamp-2">{serie.description}</div>
                                                </div>
                                            </div>
                                        </SelectItem>
                                    )
                                })}
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>

                {/* Series Grid */}
                <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                    {series.map((serie) => {
                        const Icon = getSerieIcon(serie.code)
                        return (
                            <Card
                                key={serie.id}
                                className="group cursor-pointer hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:scale-[1.02] border-0 shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden active:scale-95"
                                onClick={() => handleSerieSelect(serie.id)}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-secondary/8 opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                                <CardContent className="p-3 sm:p-4 lg:p-5 relative">
                                    <div className="flex items-center gap-3 lg:gap-4">
                                        <div className="relative">
                                            <div className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 bg-gradient-to-br from-primary/15 to-secondary/15 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-primary/20">
                                                <Icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-primary group-hover:text-primary transition-colors"/>
                                            </div>
                                            <div className="absolute -top-0.5 -right-0.5 h-3 w-3 sm:h-4 sm:w-4 bg-secondary/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-secondary rounded-full m-0.5 sm:m-1"/>
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-sm sm:text-base lg:text-lg xl:text-xl group-hover:text-primary transition-colors text-foreground truncate">
                                                {serie.code}
                                            </h3>
                                            <p className="text-muted-foreground text-xs sm:text-sm lg:text-base line-clamp-2 group-hover:text-muted-foreground/80">
                                                {serie.description}
                                            </p>
                                        </div>
                                        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 flex-shrink-0"/>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                {/* Empty State */}
                {series.length === 0 && (
                    <div className="text-center py-12 lg:py-20">
                        <div className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6">
                            <GraduationCap className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-muted-foreground"/>
                        </div>
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-2 lg:mb-3">Aucune série disponible</h3>
                        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">Les séries seront bientôt disponibles.</p>
                    </div>
                )}
            </div>
        </div>
    )
}