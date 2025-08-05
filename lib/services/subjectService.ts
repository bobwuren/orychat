import apiService from '@/lib/services/apiService';
import {Subject} from '@/types/subject';

export const getSubjectsySerie = async (serieId: number): Promise<Subject[]> => {
    try {
        const response = await apiService.get(`/api/subjects/serie/${serieId}`);
        console.log('📜 Réponse brute matières:\n', response.data);
        if (response.status === 200) {
            const subjectsData = response.data.subjects ?? [];
            return subjectsData.map((subject: Subject) => ({
                id: subject.id,
                name: subject.name,
                coefficient: subject.coefficient,
            }));
        } else {
            throw new Error('Erreur lors de la récupération des matières');
        }
    } catch (error: any) {
        console.error("❌ Erreur lors de la récupération des matières :", error);
        throw new Error('Impossible de charger les matières');
    }
}