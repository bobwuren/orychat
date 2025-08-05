import {Recommendation} from '@/types/recommendation';
import apiService from '@/lib/services/apiService';
import {Note} from '@/types/note';

export const getARecommendation = async (userId: number, serieId: number, notes: Note[]): Promise<Recommendation> => {
    try {
        console.log('🔍 Récupération de la recommandation pour l\'utilisateur:', userId, ' série:', serieId);

        const response = await apiService.post('/api/recommendations/generate', {serieId, notes});

        console.log('📜 Réponse brute recommandation:', response.data);

        if (response.status === 200 && response.data != null) {
            return response.data.recommendation as Recommendation;
        } else {
            console.log('❌ Erreur lors de la récupération de la recommandation:', response.data);
            throw new Error('Impossible de récupérer la recommandation');
        }
    } catch (err) {
        console.log('❌ Erreur lors de la génération de la recommandation:', err);
        throw new Error('Impossible de générer la recommandation');
    }
}

    export const getUserRecommendationsHistory = async (userId: number): Promise<Recommendation[]> => {
        try {
            console.log('🔍 Récupération de l\'historique des recommandations pour l\'utilisateur:', userId);

            const response = await apiService.get('/api/recommendations/');

            console.log('📜 Recommendations de l\'utilisateur:', response.data);

            if (response.status === 200 && response.data != null) {
                return response.data.recommendations as Recommendation[];
            } else {
                console.log('❌ Erreur lors de la récupération de l\'historique des recommandations:', response.data);
                throw new Error('Impossible de récupérer l\'historique des recommandations');
            }
        } catch (err) {
            console.log('❌ Erreur lors de la récupération de l\'historique des recommandations:', err);
            throw new Error('Impossible de récupérer l\'historique des recommandations');
        }
    }
