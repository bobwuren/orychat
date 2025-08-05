"use client";

import React, {useEffect, useState} from "react";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {GraduationCap, ExternalLink, Sparkles, History, ArrowLeft, Loader2, AlertCircle, Home, Calendar, BookOpen, School} from "lucide-react";
import {getUserRecommendationsHistory} from "@/lib/services/recommendationService";
import {Recommendation} from "@/types/recommendation";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {useRouter} from "next/navigation";
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

const RecommendationHistory = () => {
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Protection de route
    useRouteProtection({ requireAuth: true });

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const userId = Number(localStorage.getItem("userId"));
                if (!userId) {
                    setError("Utilisateur non connecté");
                    setTimeout(() => router.push("/login"), 2000);
                    return;
                }
                const recs = await getUserRecommendationsHistory(userId);
                setRecommendations(recs);
            } catch (e: any) {
                console.error("Erreur:", e);
                setError(e.message || "Erreur lors du chargement");
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 flex items-center justify-center p-3 sm:p-4 lg:p-6">
                <div className="text-center space-y-4 lg:space-y-6">
                    <div className="mx-auto bg-gradient-to-br from-primary to-primary/80 p-3 sm:p-4 lg:p-6 rounded-3xl w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 flex items-center justify-center shadow-2xl animate-pulse">
                        <Loader2 className="h-6 w-6 sm:h-7 sm:w-7 lg:h-10 lg:w-10 text-primary-foreground animate-spin" />
                    </div>
                    <div className="space-y-2 lg:space-y-3">
                        <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-foreground">Chargement en cours</h2>
                        <p className="text-xs sm:text-sm lg:text-base text-muted-foreground max-w-md mx-auto">Nous préparons votre historique de recommandations</p>
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

    if (!recommendations.length) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
                <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-5xl">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 lg:gap-6 mb-8 lg:mb-12">
                        <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/10 transition-all shadow-lg"
                                onClick={() => router.back()}
                                aria-label="Retour"
                            >
                                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-primary"/>
                            </Button>
                            <div className="p-2 sm:p-3 lg:p-4 rounded-2xl bg-primary/20 shadow-xl">
                                <History className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-primary"/>
                            </div>
                            <div className="space-y-1">
                                <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black text-foreground">Historique</h1>
                                <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">Vos recommandations passées</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Empty State */}
                    <div className="text-center py-12 lg:py-20">
                        <div className="mx-auto bg-muted/50 p-6 sm:p-8 lg:p-12 rounded-full w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 flex items-center justify-center mb-6 lg:mb-8 shadow-xl">
                            <History className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-muted-foreground" />
                        </div>
                        <div className="space-y-3 lg:space-y-4 mb-6 lg:mb-8">
                            <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-muted-foreground">Aucune recommandation trouvée</h2>
                            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-md mx-auto">Votre historique de recommandations est vide pour le moment.</p>
                        </div>
                        <Button 
                            onClick={() => router.push('/dashboard')}
                            size="lg"
                            className="px-6 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-6 text-sm sm:text-base lg:text-lg font-bold"
                        >
                            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                            Obtenir une recommandation
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
            <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-5xl">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 lg:gap-6 mb-8 lg:mb-12">
                    <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/10 transition-all shadow-lg hover:shadow-xl"
                            onClick={() => router.back()}
                            aria-label="Retour"
                        >
                            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-primary"/>
                        </Button>
                        <div className="p-2 sm:p-3 lg:p-4 rounded-2xl bg-primary/20 shadow-xl">
                            <History className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-primary"/>
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black text-foreground">Historique</h1>
                            <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">{recommendations.length} recommandation{recommendations.length > 1 ? 's' : ''}</p>
                        </div>
                    </div>
                </div>

                {/* Recommendations List */}
                <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                    {recommendations.map((rec) => (
                        <Card key={rec.id} className="border-0 shadow-2xl bg-card/60 backdrop-blur-md overflow-hidden group hover:shadow-3xl hover:shadow-primary/10 transition-all duration-500">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-secondary/8 opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                            <CardHeader className="relative">
                                <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
                                    <div className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 bg-primary rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-300">
                                        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-primary-foreground"/>
                                    </div>
                                    <div className="space-y-1">
                                        <CardTitle className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-foreground">
                                            Série {rec.serieCode || rec.serieId}
                                        </CardTitle>
                                        <p className="text-xs sm:text-sm lg:text-base text-muted-foreground font-medium">
                                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                                            {new Date(rec.createdAt).toLocaleString("fr-FR", {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="relative space-y-3 sm:space-y-4 lg:space-y-6">
                                <Accordion type="single" collapsible className="w-full">
                                    {rec.orientations.map((ori, idx) => (
                                        <AccordionItem 
                                            value={`item-${rec.id}-${idx}`} 
                                            key={`${rec.id}-${idx}`}
                                            className="border-b border-border/30 last:border-b-0"
                                        >
                                            <AccordionTrigger className="text-sm sm:text-base lg:text-lg font-bold hover:no-underline group/trigger py-3 lg:py-4">
                                                <div className="flex items-center gap-3 lg:gap-4 w-full">
                                                    <div className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-black text-xs sm:text-sm lg:text-base group-hover/trigger:scale-110 transition-transform duration-300 shadow-lg">
                                                        {idx + 1}
                                                    </div>
                                                    <span className="text-left font-bold text-sm sm:text-base lg:text-lg">{ori.name}</span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="pt-3 sm:pt-4 lg:pt-6 space-y-4 lg:space-y-6">
                                                <div className="text-muted-foreground whitespace-pre-line text-sm sm:text-base lg:text-lg leading-relaxed p-3 lg:p-4 bg-background/50 rounded-xl border border-border/30">
                                                    {ori.why}
                                                </div>

                                                {/* Diplômes */}
                                                <div>
                                                    <h4 className="font-bold mb-2 sm:mb-3 lg:mb-4 text-sm sm:text-base lg:text-lg text-foreground flex items-center gap-2">
                                                        <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                                                        Diplômes recommandés
                                                    </h4>
                                                    <ul className="space-y-2 lg:space-y-3">
                                                        {ori.degrees?.map((degree, degIdx) => {
                                                            const degreeName = extractName(degree);
                                                            const duration = cleanName(degree.duration || degree.duree || '');
                                                            const level = cleanName(degree.level || degree.niveau || '');
                                                            
                                                            return (
                                                                <li key={degIdx} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-background/30 rounded-lg border border-border/30 hover:bg-background/50 transition-all">
                                                                    <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                                                                    <div className="text-xs sm:text-sm lg:text-base text-foreground flex-1">
                                                                        <div className="font-semibold">
                                                                            {degreeName || 'Diplôme non spécifié'}
                                                                        </div>
                                                                        {duration && level && (
                                                                            <div className="text-muted-foreground text-xs mt-1">
                                                                                Durée: {duration} • Niveau: {level}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                </div>

                                                {/* Universités */}
                                                {ori.universities && ori.universities.length > 0 && (
                                                    <div>
                                                        <h4 className="font-bold mb-2 sm:mb-3 lg:mb-4 text-sm sm:text-base lg:text-lg text-foreground flex items-center gap-2">
                                                            <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                                                            Établissements recommandés
                                                        </h4>
                                                        <div className="grid gap-2 sm:gap-3">
                                                            {ori.universities.map((uni, uniIdx) => {
                                                                const uniName = extractName(uni);
                                                                const uniUrl = extractUrl(uni);
                                                                
                                                                return (
                                                                    <Badge
                                                                        key={uniIdx}
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
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default RecommendationHistory;
