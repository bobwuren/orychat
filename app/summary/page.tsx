"use client"

import {useEffect, useState} from "react"
import {useRouter} from "next/navigation"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {Progress} from "@/components/ui/progress"
import {BarChart3, ArrowLeft, Edit3, CheckCircle, Calculator, Brain, FlaskConical, Globe, BookOpen, Target, TrendingUp, PieChart, Trophy, Star} from "lucide-react"
import {getAllSeries} from "@/lib/services/serieService"
import {Serie} from "@/types/serie"
import ModernNavigation from "@/components/navigation/ModernNavigation"
import useRouteProtection from "@/hooks/useRouteProtection"

// Fonction utilitaire pour choisir l'icône/couleur d'une matière selon son nom
function getSubjectIcon(name: string) {
    const key = (name || '').toLowerCase()
    if (key.includes('math')) return Calculator
    if (key.includes('philo')) return Brain
    if (key.includes('phys') || key.includes('chimie')) return FlaskConical
    if (key.includes('angl')) return Globe
    if (key.includes('fran')) return BookOpen
    if (key.includes('hist') || key.includes('geo')) return Target
    if (key.includes('svt') || key.includes('vie') || key.includes('terre')) return Brain
    if (key.includes('gestion')) return TrendingUp
    if (key.includes('compta')) return PieChart
    if (key.includes('market')) return Target
    if (key.includes('info')) return BarChart3
    return BookOpen
}

export default function SummaryPage() {
    const router = useRouter()
    const [series, setSeries] = useState<Serie[]>([])
    const [selectedSerie, setSelectedSerie] = useState<number | null>(null)
    const [notes, setNotes] = useState<Record<string, number>>({})
    const [loading, setLoading] = useState(true)

    // Protection de route : nécessite d'être connecté, d'avoir sélectionné une série et d'avoir des notes
    useRouteProtection({ 
        requireAuth: true, 
        requireSerieSelection: true,
        requireNotes: true 
    });

    useEffect(() => {
        const fetchData = async () => {
            const serieId = localStorage.getItem("selectedSerieId") || ""
            const notesStr = localStorage.getItem("notes")
            
            setSelectedSerie(serieId ? Number(serieId) : null)
            
            if (!serieId) {
                router.push("/dashboard")
                return
            }

            if (!notesStr) {
                router.push("/notes-entering")
                return
            }

            try {
                const parsedNotes = JSON.parse(notesStr)
                // Vérifier que les notes sont valides
                const hasValidNotes = Object.values(parsedNotes).some(note => typeof note === 'number' && note > 0)
                
                if (!hasValidNotes) {
                    router.push("/notes-entering")
                    return
                }
                
                setNotes(parsedNotes)

                // Gestion du cache avec expiration (24h)
                const cacheKey = "series"
                const cacheTimeKey = "series_cache_time"
                const now = Date.now()
                const cacheDuration = 24 * 60 * 60 * 1000 // 24h en ms
                const cachedSeries = localStorage.getItem(cacheKey)
                const cachedTime = localStorage.getItem(cacheTimeKey)
                if (cachedSeries && cachedTime && now - parseInt(cachedTime, 10) < cacheDuration) {
                    setSeries(JSON.parse(cachedSeries))
                } else {
                    const data = await getAllSeries()
                    setSeries(data)
                    localStorage.setItem(cacheKey, JSON.stringify(data))
                    localStorage.setItem(cacheTimeKey, now.toString())
                }
            } catch (err) {
                console.error("Erreur lors du chargement des données:", err)
                router.push("/dashboard")
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [router])

    const selectedSerieData = series.find(s => s.id === selectedSerie)
    const subjects = selectedSerieData?.subjects || []

    const calculateAverage = () => {
        let totalPoints = 0
        let totalCoeff = 0
        subjects.forEach(subject => {
            const note = notes[subject.id] || 0
            if (note > 0) {
                totalPoints += note * subject.coefficient
                totalCoeff += subject.coefficient
            }
        })
        return totalCoeff > 0 ? (totalPoints / totalCoeff).toFixed(2) : "0.00"
    }

    const getScoreBackground = (note: number) => {
        if (note >= 16) return 'bg-emerald-100 text-emerald-800 border-emerald-200' // Excellent
        if (note >= 14) return 'bg-green-100 text-green-700 border-green-200' // Bien
        if (note >= 12) return 'bg-yellow-100 text-yellow-800 border-yellow-200' // Moyen
        if (note >= 10) return 'bg-orange-100 text-orange-800 border-orange-200' // Passable
        if (note > 0) return 'bg-red-100 text-red-700 border-red-200' // Faible
        return 'bg-muted text-muted-foreground border-border' // Non saisi
    }

    const getGradeText = (note: number) => {
        if (note >= 16) return { text: 'Excellent', color: 'text-emerald-600' }
        if (note >= 14) return { text: 'Bien', color: 'text-green-600' }
        if (note >= 12) return { text: 'Assez bien', color: 'text-yellow-600' }
        if (note >= 10) return { text: 'Passable', color: 'text-orange-600' }
        return { text: 'Insuffisant', color: 'text-red-600' }
    }

    const handleBackToEdit = () => {
        router.push("/notes-entering")
    }

    const handleBackToSeries = () => {
        localStorage.removeItem("selectedSerieId")
        localStorage.removeItem("notes")
        router.push("/dashboard")
    }

    const handleConfirm = () => {
        // Vérifier une dernière fois que toutes les données sont présentes
        const serieId = localStorage.getItem("selectedSerieId")
        const notesStr = localStorage.getItem("notes")
        const userId = localStorage.getItem("userId")
        
        if (!serieId || !notesStr || !userId) {
            router.push("/dashboard")
            return
        }

        try {
            const parsedNotes = JSON.parse(notesStr)
            const hasValidNotes = Object.values(parsedNotes).some(note => typeof note === 'number' && note > 0)
            
            if (!hasValidNotes) {
                router.push("/notes-entering")
                return
            }
            
            router.push("/recommendation")
        } catch {
            router.push("/dashboard")
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Chargement...</p>
                </div>
            </div>
        )
    }

    const average = calculateAverage()
    const filledSubjects = subjects.filter(s => notes[s.id] > 0).length
    const avgNum = parseFloat(average)
    const gradeInfo = getGradeText(avgNum)

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
            <div className="container mx-auto px-2 py-4 max-w-4xl sm:px-4 sm:py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="h-10 w-10 sm:h-16 sm:w-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-xl">
                            <BarChart3 className="h-5 w-5 sm:h-8 sm:w-8 text-primary-foreground"/>
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-4xl font-bold text-primary">
                                Résumé des notes
                            </h1>
                            <p className="text-muted-foreground text-base sm:text-lg">Vérifiez vos notes avant de confirmer</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Button
                            variant="outline"
                            onClick={handleBackToSeries}
                            className="shadow-sm hover:shadow-md transition-all px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-base"
                        >
                            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2"/>
                            Séries
                        </Button>
                        <ModernNavigation variant="compact" className="flex-shrink-0" />
                    </div>
                </div>

                {/* Summary Card */}
                <Card className="mb-6 border-0 shadow-2xl bg-card/50 backdrop-blur-sm overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10"/>
                    <CardContent className="relative p-4 sm:p-8">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
                            <div className="flex items-center gap-3 sm:gap-6">
                                <div className="h-12 w-12 sm:h-20 sm:w-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-xl">
                                    <span className="text-lg sm:text-2xl font-bold text-primary-foreground">
                                        {selectedSerieData?.code}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-base sm:text-xl font-bold text-foreground mb-1">
                                        {selectedSerieData?.description}
                                    </h3>
                                    <p className="text-[10px] sm:text-base text-muted-foreground">
                                        {filledSubjects} matière{filledSubjects > 1 ? 's' : ''} • Série {selectedSerieData?.code}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2 sm:gap-4">
                                <div className="text-center">
                                    <div className="flex items-center gap-[2px] sm:gap-1 mb-[2px] sm:mb-1">
                                        <Trophy className="h-3 w-3 sm:h-4 sm:w-4 text-primary"/>
                                        <p className="text-[10px] sm:text-xs font-medium text-muted-foreground">Moyenne générale</p>
                                    </div>
                                    <div className={`text-base sm:text-xl font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-xl border-2 ${getScoreBackground(avgNum)}`}>
                                        {average}/20
                                    </div>
                                    <p className={`text-[10px] sm:text-xs font-semibold mt-1 ${gradeInfo.color}`}>
                                        {gradeInfo.text}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center gap-[2px] sm:gap-1 mb-[2px] sm:mb-1">
                                        <Star className="h-3 w-3 sm:h-4 sm:w-4 text-secondary"/>
                                        <p className="text-[10px] sm:text-xs font-medium text-muted-foreground">Progression</p>
                                    </div>
                                    <div className="text-base sm:text-xl font-bold text-primary bg-primary/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-xl border-2 border-primary/20">
                                        {Math.round((filledSubjects / subjects.length) * 100)}%
                                    </div>
                                    <p className="text-[10px] sm:text-xs font-semibold mt-1 text-primary">
                                        Complété
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-4 sm:mt-6">
                            <Progress 
                                value={(filledSubjects / subjects.length) * 100} 
                                className="h-1 sm:h-2 bg-muted/50"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Detail Section */}
                <Card className="mb-6 border-0 shadow-xl bg-card/50 backdrop-blur-sm">
                    <CardHeader className="pb-4 sm:pb-6">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="h-8 w-8 sm:h-12 sm:w-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                                <BarChart3 className="h-4 w-4 sm:h-6 sm:w-6 text-primary-foreground"/>
                            </div>
                            <CardTitle className="text-lg sm:text-2xl text-foreground">Détail des notes</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3 sm:space-y-4">
                        {subjects.map((subject, index) => {
                            const note = notes[subject.id] || 0
                            const Icon = getSubjectIcon(subject.name)
                            const hasNote = note > 0
                            
                            return (
                                <div 
                                    key={subject.name}
                                    className={`p-3 sm:p-6 rounded-2xl border-2 transition-all duration-300 ${
                                        hasNote 
                                            ? 'border-primary/30 bg-gradient-to-r from-primary/5 to-secondary/5 shadow-lg hover:shadow-xl' 
                                            : 'border-muted/50 bg-muted/10 opacity-60'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 sm:gap-4">
                                            <div className={`h-8 w-8 sm:h-14 sm:w-14 rounded-xl flex items-center justify-center shadow-lg ${
                                                hasNote ? 'bg-primary/20' : 'bg-muted/20'
                                            }`}>
                                                <Icon className={`h-4 w-4 sm:h-7 sm:w-7 ${
                                                    hasNote ? 'text-primary' : 'text-muted-foreground'
                                                }`}/>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-base sm:text-xl text-foreground">{subject.name}</h4>
                                                <div className="flex items-center gap-2 sm:gap-3 mt-1 sm:mt-2">
                                                    <Badge variant="secondary" className="shadow-sm text-xs sm:text-base px-2 py-0.5">
                                                        Coefficient {subject.coefficient}
                                                    </Badge>
                                                    {hasNote && (
                                                        <Badge variant="outline" className="border-primary/30 text-primary text-xs sm:text-base px-2 py-0.5">
                                                            {(note * subject.coefficient).toFixed(1)} points
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-sm sm:text-base font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-xl border-2 ${
                                                hasNote ? getScoreBackground(note) : 'bg-muted text-muted-foreground border-muted'
                                            }`}>
                                                {hasNote ? `${note.toFixed(1)}/20` : 'Non saisi'}
                                            </div>
                                            {hasNote && (
                                                <p className={`text-[10px] sm:text-xs font-medium mt-1 ${getGradeText(note).color}`}>
                                                    {getGradeText(note).text}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={handleBackToEdit}
                        className="px-4 py-2 sm:px-8 sm:py-6 text-base sm:text-lg shadow-lg hover:shadow-xl transition-all rounded-xl sm:rounded-2xl"
                    >
                        <Edit3 className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"/>
                        Modifier les notes
                    </Button>
                    <Button 
                        size="lg"
                        className="px-6 py-3 sm:px-12 sm:py-6 text-base sm:text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl hover:shadow-2xl transition-all duration-200 rounded-xl sm:rounded-2xl"
                        onClick={handleConfirm}
                    >
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"/>
                        Confirmer et continuer
                    </Button>
                </div>
            </div>
        </div>
    )
}