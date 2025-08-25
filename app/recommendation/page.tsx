"use client";

import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Brain,
    GraduationCap,
    Sparkles,
    ExternalLink,
    Home,
    Loader2,
    AlertCircle,
    TrendingDown,
    BookOpen,
    Target,
    RefreshCw
} from 'lucide-react';
import {getARecommendation} from '@/lib/services/recommendationService';
import {Recommendation} from '@/types/recommendation';
import {useRouter} from 'next/navigation';
import ModernNavigation from "@/components/navigation/ModernNavigation";
import useRouteProtection from "@/hooks/useRouteProtection";

// Fonction utilitaire pour nettoyer et parser les noms
const cleanName = (name: string): string => {
    if (!name) return '';

    // Décoder les caractères URL encodés (comme %27 pour l'apostrophe)
    let cleaned = decodeURIComponent(name);

    // Nettoyer les caractères indésirables
    cleaned = cleaned
        .replace(/[%]/g, '') // Supprimer les % restants
        .replace(/\s+/g, ' ') // Normaliser les espaces multiples
        .trim(); // Supprimer les espaces en début/fin

    return cleaned;
};

// Fonction pour extraire le nom d'un objet diplôme/université
const extractName = (item: any): string => {
    const possibleNames = [
        item.name,
        item.nom,
        item.title,
        item.titre,
        ...Object.values(item || {})
    ].filter(Boolean);

    const rawName = possibleNames[0] as string;
    return cleanName(rawName || '');
};

// Fonction pour extraire l'URL d'un objet université
const extractUrl = (uni: any): string => {
    const possibleUrls = [
        uni.site,
        uni.url,
        uni.link,
        uni.website,
        uni.lien
    ].filter(Boolean);

    return possibleUrls[0] || '#';
};

// Interface pour l'erreur de moyenne insuffisante
interface InsufficientGradeError {
    error: string;
    moyenne: number;
}

const RecommendationPage = () => {
    const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [insufficientGrade, setInsufficientGrade] = useState<InsufficientGradeError | null>(null);
    const [showRetryDialog, setShowRetryDialog] = useState(false);
    const router = useRouter();

    useRouteProtection({
        requireAuth: true,
        requireSerieSelection: true,
        requireNotes: true
    });

    const fetchOrLoadRecommendation = async (showRetryPrompt: boolean = false) => {
        const userId = Number(localStorage.getItem('userId'));
        const serieId = Number(localStorage.getItem('selectedSerieId'));
        const notesStr = localStorage.getItem('notes');

        // Vérifier d'abord si les données requises sont disponibles
        if (!serieId || !notesStr || !userId) {
            setError('Données manquantes');
            setTimeout(() => router.push('/dashboard'), 2000);
            return;
        }

        // Vérifier si une recommandation existe en cache ET qu'elle appartient à l'utilisateur actuel
        const cached = localStorage.getItem('lastRecommendation');
        if (cached && !showRetryPrompt) {
            try {
                const cachedRec = JSON.parse(cached);
                // Vérifier que la recommandation en cache appartient bien à l'utilisateur actuel
                if (cachedRec.userId === userId && cachedRec.serieId === serieId) {
                    setRecommendation(cachedRec);
                    setLoading(false);
                    return;
                }
                // Sinon, ne pas utiliser le cache (mauvais utilisateur ou mauvaise série)
                localStorage.removeItem('lastRecommendation');
            } catch (e) {
                console.error("Erreur lors du parsing du cache:", e);
                localStorage.removeItem('lastRecommendation');
            }
        }

        try {
            const notesArr = Object.entries(JSON.parse(notesStr)).map(([subjectId, value]) => ({
                subjectId: Number(subjectId),
                value: Number(value),
                userId,
                serieId
            }));

            const rec = await getARecommendation(userId, serieId, notesArr);

            // Vérifier que la recommandation reçue contient bien un userId
            // et qu'il correspond à l'utilisateur actuel avant de la mettre en cache
            if (rec && rec.userId === userId) {
                setRecommendation(rec);
                localStorage.setItem('lastRecommendation', JSON.stringify(rec));
                // Réinitialiser les états d'erreur
                setInsufficientGrade(null);
                setError(null);
            } else {
                console.error("La recommandation reçue n'a pas le bon userId:", rec?.userId, "vs", userId);
                setRecommendation(rec); // On l'affiche quand même
            }
        } catch (err: any) {
            console.error("Erreur complète:", err);

            // Gestion spécifique de l'erreur 400 (moyenne insuffisante)
            if (err.response?.status === 400 && err.response?.data?.moyenne !== undefined) {
                setInsufficientGrade({
                    error: err.response.data.error || "Moyenne insuffisante pour générer une recommandation",
                    moyenne: err.response.data.moyenne
                });
                setError(null);
                setRecommendation(null);
            } else {
                setError(err.message || 'Erreur lors de la génération');
                setInsufficientGrade(null);
                setTimeout(() => router.push('/dashboard'), 3002);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrLoadRecommendation();
    }, [router]);

    const handleNewRecommendation = () => {
        localStorage.removeItem("selectedSerieId");
        localStorage.removeItem("notes");
        localStorage.removeItem("lastRecommendation");
        router.push('/dashboard');
    };

    const handleRetryRecommendation = () => {
        setShowRetryDialog(false);
        setLoading(true);
        fetchOrLoadRecommendation(true);
    };

    const handleUpdateGrades = () => {
        // Nettoyer seulement les notes pour permettre à l'utilisateur de les corriger
        localStorage.removeItem("notes");
        localStorage.removeItem("lastRecommendation");
        router.push('/dashboard');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 flex items-center justify-center p-3 sm:p-4 lg:p-6">
                <div className="text-center space-y-4 lg:space-y-6">
                    <div className="mx-auto bg-gradient-to-br from-primary to-primary/80 p-3 sm:p-4 lg:p-6 rounded-3xl w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 flex items-center justify-center shadow-2xl animate-pulse">
                        <Loader2 className="h-6 w-6 sm:h-7 sm:w-7 lg:h-10 lg:w-10 text-primary-foreground animate-spin" />
                    </div>
                    <div className="space-y-2 lg:space-y-3">
                        <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-foreground">Analyse en cours</h2>
                        <p className="text-xs sm:text-sm lg:text-base text-muted-foreground max-w-md mx-auto">Nous générons votre recommandation personnalisée</p>
                    </div>
                    <div className="flex justify-center space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                </div>
            </div>
        );
    }

    // Gestion de l'erreur de moyenne insuffisante
    if (insufficientGrade) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
                <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-3xl">
                    {/* Header */}
                    <header className="flex flex-col lg:flex-row items-start lg:items-center gap-3 sm:gap-4 lg:gap-6 mb-8 lg:mb-12">
                        <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 flex-1">
                            <div className="p-2 sm:p-3 lg:p-4 rounded-2xl bg-destructive/20 shadow-xl">
                                <TrendingDown className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:w-8 text-destructive"/>
                            </div>
                            <div className="space-y-1 flex-1">
                                <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black text-foreground">Moyenne insuffisante</h1>
                                <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">Vos notes actuelles ne permettent pas une recommandation</p>
                            </div>
                        </div>
                        <div className="flex-shrink-0 w-full lg:w-auto">
                            <ModernNavigation
                                variant="full"
                                showHistoryConfirmation={false}
                                onHistoryNavigate={() => {}}
                            />
                        </div>
                    </header>

                    {/* Alert principale */}
                    <Alert className="mb-6 sm:mb-8 border-destructive/50 bg-destructive/5">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle className="text-destructive">Moyenne trop faible pour le BAC</AlertTitle>
                        <AlertDescription className="text-destructive/80 mt-2">
                            Votre moyenne actuelle de <span className="font-bold">{insufficientGrade.moyenne.toFixed(1)}/20</span> est
                            inférieure au minimum requis de 10/20 pour obtenir le BAC et accéder aux études supérieures.
                        </AlertDescription>
                    </Alert>

                    {/* Card principale avec conseils */}
                    <Card className="mb-6 sm:mb-8 border-0 shadow-2xl bg-card/60 backdrop-blur-md overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/8 via-transparent to-red-500/8" />
                        <CardHeader className="relative">
                            <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
                                <div className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-xl">
                                    <Target className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white"/>
                                </div>
                                <div className="space-y-1">
                                    <CardTitle className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-foreground">
                                        Plan d'amélioration
                                    </CardTitle>
                                    <p className="text-xs sm:text-sm lg:text-base text-muted-foreground font-medium">Stratégies pour améliorer vos résultats</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="relative space-y-4 lg:space-y-6">
                            {/* Conseils d'amélioration */}
                            <div>
                                <h4 className="font-bold mb-2 sm:mb-3 lg:mb-4 text-sm sm:text-base lg:text-lg text-foreground flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                                    Conseils pour améliorer vos notes
                                </h4>
                                <div className="space-y-2 lg:space-y-3">
                                    <div className="flex items-start gap-2 sm:gap-3 p-3 lg:p-4 bg-background/50 rounded-xl border border-border/30">
                                        <div className="w-6 h-6 sm:w-7 sm:h-7 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-blue-600 font-bold text-xs sm:text-sm">1</span>
                                        </div>
                                        <div className="text-xs sm:text-sm lg:text-base text-foreground">
                                            <div className="font-semibold mb-1">Concentrez-vous sur vos matières les plus faibles</div>
                                            <div className="text-muted-foreground text-xs">Identifiez les matières où vous avez les plus mauvaises notes et consacrez-leur plus de temps d'étude.</div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2 sm:gap-3 p-3 lg:p-4 bg-background/50 rounded-xl border border-border/30">
                                        <div className="w-6 h-6 sm:w-7 sm:h-7 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-green-600 font-bold text-xs sm:text-sm">2</span>
                                        </div>
                                        <div className="text-xs sm:text-sm lg:text-base text-foreground">
                                            <div className="font-semibold mb-1">Demandez de l'aide</div>
                                            <div className="text-muted-foreground text-xs">N'hésitez pas à solliciter vos professeurs, des camarades ou un soutien scolaire.</div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2 sm:gap-3 p-3 lg:p-4 bg-background/50 rounded-xl border border-border/30">
                                        <div className="w-6 h-6 sm:w-7 sm:h-7 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-purple-600 font-bold text-xs sm:text-sm">3</span>
                                        </div>
                                        <div className="text-xs sm:text-sm lg:text-base text-foreground">
                                            <div className="font-semibold mb-1">Organisez-vous mieux</div>
                                            <div className="text-muted-foreground text-xs">Planifiez vos révisions et respectez un emploi du temps régulier d'étude.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Objectif à atteindre */}
                            <div className="p-4 lg:p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                        <Target className="w-4 h-4 text-primary-foreground"/>
                                    </div>
                                    <h5 className="font-bold text-sm sm:text-base lg:text-lg text-foreground">Objectif à atteindre</h5>
                                </div>
                                <p className="text-xs sm:text-sm lg:text-base text-muted-foreground mb-2">
                                    Vous devez obtenir une moyenne d'au moins <span className="font-bold text-primary">10/20</span> pour pouvoir accéder aux études supérieures.
                                </p>
                                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                                    <span>Points manquants :</span>
                                    <Badge variant="outline" className="font-bold text-destructive border-destructive/30">
                                        +{(10 - insufficientGrade.moyenne).toFixed(1)} points
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <Button
                            onClick={handleUpdateGrades}
                            size="lg"
                            className="flex-1 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                        >
                            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                            Corriger mes notes
                        </Button>

                        <Button
                            onClick={() => setShowRetryDialog(true)}
                            variant="outline"
                            size="lg"
                            className="flex-1 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                            Réessayer quand même
                        </Button>

                        <Button
                            onClick={handleNewRecommendation}
                            variant="ghost"
                            size="lg"
                            className="sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-bold"
                        >
                            <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                            Accueil
                        </Button>
                    </div>

                    {/* Dialog de confirmation pour réessayer */}
                    <AlertDialog open={showRetryDialog} onOpenChange={setShowRetryDialog}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-orange-500" />
                                    Confirmer la génération
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-sm text-muted-foreground">
                                    Vous êtes sur le point de générer une recommandation malgré votre moyenne de {insufficientGrade.moyenne.toFixed(1)}/20.
                                    <br/><br/>
                                    <span className="font-medium text-orange-600">
                                        Attention : Les recommandations générées pourraient ne pas être réalistes étant donné vos résultats actuels.
                                    </span>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowRetryDialog(false)}
                                >
                                    Annuler
                                </Button>
                                <AlertDialogAction onClick={handleRetryRecommendation}>
                                    Générer quand même
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </main>
        );
    }

    // Gestion des autres erreurs
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 flex items-center justify-center p-3 sm:p-4 lg:p-6">
                <Card className="w-full max-w-xs sm:max-w-sm lg:max-w-md border-0 shadow-2xl bg-card/60 backdrop-blur-md overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-destructive/8 via-transparent to-destructive/15" />
                    <CardHeader className="text-center space-y-3 lg:space-y-4">
                        <div className="mx-auto bg-destructive/15 p-2 sm:p-3 lg:p-4 rounded-full w-fit">
                            <AlertCircle className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-destructive" />
                        </div>
                        <div className="space-y-1 lg:space-y-2">
                            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-destructive">Erreur survenue</h2>
                            <p className="text-xs sm:text-sm lg:text-base text-destructive/80">{error}</p>
                        </div>
                    </CardHeader>
                    <CardContent className="text-center space-y-4 lg:space-y-6">
                        <Button
                            onClick={() => router.push('/dashboard')}
                            className="w-full"
                            size="lg"
                        >
                            <Home className="w-4 h-4 mr-2" />
                            Retour au dashboard
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Interface normale avec recommandations
    return (
        <main className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
            <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-5xl">
                {/* Header */}
                <header className="flex flex-col lg:flex-row items-start lg:items-center gap-3 sm:gap-4 lg:gap-6 mb-8 lg:mb-12">
                    <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 flex-1">
                        <div className="p-2 sm:p-3 lg:p-4 rounded-2xl bg-primary/20 shadow-xl">
                            <Brain className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-primary"/>
                        </div>
                        <div className="space-y-1 flex-1">
                            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black text-foreground">Recommandation</h1>
                            <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">Analyse personnalisée de votre orientation</p>
                        </div>
                    </div>
                    <div className="flex-shrink-0 w-full lg:w-auto">
                        <ModernNavigation
                            variant="full"
                            showHistoryConfirmation={false}
                            onHistoryNavigate={() => {}}
                        />
                    </div>
                </header>

                {/* Série Info Card */}
                <Card className="mb-6 sm:mb-8 lg:mb-12 border-0 shadow-2xl bg-card/60 backdrop-blur-md overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-secondary/8" />
                    <CardHeader className="relative">
                        <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
                            <div className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-xl">
                                <GraduationCap className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-primary-foreground"/>
                            </div>
                            <div className="space-y-1">
                                <CardTitle className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-foreground">
                                    Série {recommendation?.serieCode || ''}
                                </CardTitle>
                                <p className="text-xs sm:text-sm lg:text-base text-muted-foreground font-medium">Analyse de vos résultats scolaires</p>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Recommendations Section */}
                <div className="space-y-4 sm:space-y-6 lg:space-y-8 mb-8 lg:mb-12">
                    <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 bg-gradient-to-br from-accent to-accent/80 rounded-2xl flex items-center justify-center shadow-xl">
                            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-accent-foreground"/>
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-foreground">Vos recommandations</h2>
                            <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">Orientations suggérées selon votre profil</p>
                        </div>
                    </div>

                    {recommendation?.orientations.map((ori, index) => (
                        <Card key={ori.name} className="border-0 shadow-2xl bg-card/60 backdrop-blur-md overflow-hidden group hover:shadow-3xl hover:shadow-primary/10 transition-all duration-500">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-secondary/8 opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                            <CardHeader className="relative">
                                <div className="flex items-start gap-3 sm:gap-4 lg:gap-6">
                                    <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-2xl bg-primary text-primary-foreground font-black text-sm sm:text-base lg:text-lg flex-shrink-0 shadow-xl group-hover:scale-105 transition-transform duration-300">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 space-y-2 lg:space-y-3">
                                        <CardTitle className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-foreground">
                                            {ori.name}
                                        </CardTitle>
                                        <div className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed p-3 lg:p-4 bg-background/50 rounded-xl border border-border/30">
                                            {ori.why}
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="relative space-y-4 lg:space-y-6">
                                {/* Diplômes */}
                                <div>
                                    <h4 className="font-bold mb-2 sm:mb-3 lg:mb-4 text-sm sm:text-base lg:text-lg text-foreground flex items-center gap-2">
                                        <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
                                        Diplômes recommandés
                                    </h4>
                                    <div className="space-y-2 lg:space-y-3">
                                        {ori.degrees?.map((degree, idx) => {
                                            const degreeName = extractName(degree);
                                            const duration = cleanName(degree.duration || degree.duree || '');
                                            const level = cleanName(degree.level || degree.niveau || '');

                                            return (
                                                <div key={idx} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-background/30 rounded-lg border border-border/30 hover:bg-background/50 transition-all">
                                                    <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5"/>
                                                    <div className="text-xs sm:text-sm lg:text-base text-foreground flex-1">
                                                        <div className="font-semibold break-words" style={{wordBreak: "break-word"}}>
                                                            {degreeName || 'Diplôme non spécifié'}
                                                        </div>
                                                        {duration && level && (
                                                            <div className="text-muted-foreground text-xs mt-1">
                                                                Durée: {duration} • Niveau: {level}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Universités */}
                                {ori.universities && ori.universities.length > 0 && (
                                    <div>
                                        <h4 className="font-bold mb-2 sm:mb-3 lg:mb-4 text-sm sm:text-base lg:text-lg text-foreground flex items-center gap-2">
                                            <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                                            Établissements recommandés
                                        </h4>
                                        <div className="flex flex-wrap gap-2 lg:gap-3">
                                            {ori.universities?.map((uni, idx) => {
                                                const uniName = extractName(uni);
                                                const uniUrl = extractUrl(uni);

                                                return (
                                                    <Badge
                                                        key={idx}
                                                        variant="secondary"
                                                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-secondary/80 hover:bg-secondary cursor-pointer transition-all text-xs sm:text-sm hover:shadow-lg"
                                                        asChild
                                                    >
                                                        <a
                                                            href={uniUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1.5"
                                                            title={uniName}
                                                        >
                                                            <ExternalLink className="w-3 h-3"/>
                                                            {uniName || 'Établissement non spécifié'}
                                                        </a>
                                                    </Badge>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* New Analysis Button */}
                <div className="text-center">
                    <Button
                        onClick={handleNewRecommendation}
                        size="lg"
                        className="px-6 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-6 text-sm sm:text-base lg:text-lg font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-2xl hover:shadow-3xl hover:shadow-primary/20 transition-all duration-300 hover:scale-105"
                    >
                        <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Nouvelle analyse
                    </Button>
                </div>
            </div>
        </main>
    );
};

export default RecommendationPage;