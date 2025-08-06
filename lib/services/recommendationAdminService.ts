/* eslint-disable @typescript-eslint/no-explicit-any */
import apiServiceAdmin from '@/lib/services/apiServiceAdmin';
import { Recommendation } from '@/types/entities';
import { CacheService } from '@/lib/cache';

// Récupérer toutes les recommandations (admin)
export const getAllRecommendations = async (): Promise<Recommendation[]> => {
    console.log('📋 [recommendationAdminService][GET] /api/recommendations/all');
    try {
        const response = await apiServiceAdmin.get('/api/recommendations/all');
        console.log('✅ [recommendationAdminService][GET][SUCCESS]', response.data);
        if (response.status === 200 && response.data) {
            const recommendations = response.data.recommendations as Recommendation[];
            
            // Vérifier que recommendations est bien un array
            if (!Array.isArray(recommendations)) {
                console.warn('⚠️ La réponse ne contient pas un array de recommandations:', response.data);
                return [];
            }
            
            // Enrichir chaque recommandation avec les détails utilisateur et série
            const [users, series] = await Promise.all([
                CacheService.get('auth'),
                CacheService.get('series')
            ]);
            
            const enrichedRecommendations = recommendations.map((recommendation) => {
                // Trouver l'utilisateur dans le cache
                const user = users.find((u: any) => u.id === recommendation.userId);
                
                // Trouver la série dans le cache
                const serie = series.find((s: any) => s.id === recommendation.serieId);
                
                return {
                    ...recommendation,
                    userEmail: user?.email || 'Email non disponible',
                    serieCode: serie?.code || 'Inconnu'
                } as Recommendation;
            });
            
            return enrichedRecommendations;
        } else {
            throw new Error('Impossible de récupérer les recommandations');
        }
    } catch (err) {
        console.error('❌ [recommendationAdminService][GET][ERROR]', err);
        throw new Error('Erreur lors de la récupération des recommandations');
    }
};

// Exporter les recommandations (admin)
export const exportRecommendations = async (): Promise<any> => {
    console.log('📦 [recommendationAdminService][EXPORT]');
    try {
        const response = await apiServiceAdmin.get('/api/recommendations/export');
        console.log('✅ [recommendationAdminService][EXPORT][SUCCESS]', response.data);
        if (response.status === 200 && response.data) {
            return response.data;
        } else {
            throw new Error('Impossible d\'exporter les recommandations');
        }
    } catch (err) {
        console.error('❌ [recommendationAdminService][EXPORT][ERROR]', err);
        throw new Error('Erreur lors de l\'export des recommandations');
    }
};