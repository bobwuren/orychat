import apiServiceAdmin from '@/lib/services/apiServiceAdmin';
import {Degree, University} from '@/types/entities';

// Récupérer toutes les universités
export const getAllUniversities = async (): Promise<University[]> => {
    console.log('🏫 [universityAdminService][GET] /api/universities');
    try {
        const response = await apiServiceAdmin.get('/api/universities');
        console.log('✅ [universityAdminService][GET][SUCCESS]', response.data);
        if (response.status === 200 && response.data) {
            return response.data;
        }
        throw new Error('Impossible de récupérer les universités');
    } catch (err) {
        console.error('❌ [universityAdminService][GET][ERROR]', err);
        throw new Error('Erreur lors de la récupération des universités');
    }
};

// Récupérer toutes les universités sponsors
export const getAllSponsors = async (): Promise<University[]> => {
    console.log('⭐ [universityAdminService][GET SPONSORS] /api/universities/sponsors');
    try {
        const response = await apiServiceAdmin.get('/api/universities/sponsors');
        console.log('✅ [universityAdminService][GET SPONSORS][SUCCESS]', response.data);
        if (response.status === 200 && response.data) {
            return response.data;
        }
        throw new Error('Impossible de récupérer les universités sponsors');
    } catch (err) {
        console.error('❌ [universityAdminService][GET SPONSORS][ERROR]', err);
        throw new Error('Erreur lors de la récupération des universités sponsors');
    }
};

// Récupérer une université par ID
export const getUniversityById = async (id: string): Promise<University> => {
    console.log('🔎 [universityAdminService][GET BY ID]', id);
    try {
        const response = await apiServiceAdmin.get(`/api/universities/${id}`);
        console.log('✅ [universityAdminService][GET BY ID][SUCCESS]', response.data);
        if (response.status === 200 && response.data) {
            return response.data;
        }
        throw new Error('Impossible de récupérer l\'université');
    } catch (err) {
        console.error('❌ [universityAdminService][GET BY ID][ERROR]', err);
        throw new Error('Erreur lors de la récupération de l\'université');
    }
};

// Créer une université (au moins un degree obligatoire)
export const createUniversity = async (data: Partial<University> & { degrees: string[] }): Promise<University> => {
    if (!data.degrees || !Array.isArray(data.degrees) || data.degrees.length === 0) {
        throw new Error('Une université doit proposer au moins un diplôme.');
    }
    console.log('🆕 [universityAdminService][CREATE]', data);
    try {
        const response = await apiServiceAdmin.post('/api/universities', data);
        console.log('✅ [universityAdminService][CREATE][SUCCESS]', response.data);
        if (response.status === 201 && response.data) {
            return response.data.university || response.data;
        }
        throw new Error('Impossible de créer l\'université');
    } catch (err: any) {
        console.error('❌ [universityAdminService][CREATE][ERROR]', err);
        if (err.response?.status === 409) {
            throw new Error('Cette université existe déjà');
        }
        throw new Error('Erreur lors de la création de l\'université');
    }
};

// Mettre à jour une université
export const updateUniversity = async (id: string, data: Partial<University>): Promise<University> => {
    console.log('✏️ [universityAdminService][UPDATE]', id, data);
    try {
        const response = await apiServiceAdmin.put(`/api/universities/${id}`, data);
        console.log('✅ [universityAdminService][UPDATE][SUCCESS]', response.data);
        if (response.status === 200 && response.data) {
            return response.data.university || response.data;
        }
        throw new Error('Impossible de mettre à jour l\'université');
    } catch (err: any) {
        console.error('❌ [universityAdminService][UPDATE][ERROR]', err);
        if (err.response?.status === 409) {
            throw new Error('Cette université existe déjà');
        }
        throw new Error('Erreur lors de la mise à jour de l\'université');
    }
};

// Supprimer une université
export const deleteUniversity = async (id: string): Promise<void> => {
    console.log('🗑️ [universityAdminService][DELETE]', id);
    try {
        const response = await apiServiceAdmin.delete(`/api/universities/${id}`);
        console.log('✅ [universityAdminService][DELETE][SUCCESS]', response.status);
        if (response.status !== 204) {
            throw new Error('Impossible de supprimer l\'université');
        }
    } catch (err) {
        console.error('❌ [universityAdminService][DELETE][ERROR]', err);
        throw new Error('Erreur lors de la suppression de l\'université');
    }
};

// Associer un diplôme à une université
export const addDegreeToUniversity = async (universityId: string, degreeId: string): Promise<void> => {
    console.log('➕ [universityAdminService][ADD DEGREE]', universityId, degreeId);
    try {
        const response = await apiServiceAdmin.post(`/api/universities/${universityId}/degrees`, {degreeId});
        console.log('✅ [universityAdminService][ADD DEGREE][SUCCESS]', response.status);
        if (response.status !== 200) {
            throw new Error('Impossible d\'associer le diplôme à l\'université');
        }
    } catch (err) {
        console.error('❌ [universityAdminService][ADD DEGREE][ERROR]', err);
        throw new Error('Erreur lors de l\'association du diplôme à l\'université');
    }
};

// Supprimer un diplôme d'une université
export const removeDegreeFromUniversity = async (universityId: string, degreeId: string): Promise<void> => {
    console.log('➖ [universityAdminService][REMOVE DEGREE]', universityId, degreeId);
    try {
        const response = await apiServiceAdmin.delete(`/api/universities/${universityId}/degrees/${degreeId}`);
        console.log('✅ [universityAdminService][REMOVE DEGREE][SUCCESS]', response.status);
        if (response.status !== 200) {
            throw new Error('Impossible de supprimer le diplôme de l\'université');
        }
    } catch (err) {
        console.error('❌ [universityAdminService][REMOVE DEGREE][ERROR]', err);
        throw new Error('Erreur lors de la suppression du diplôme de l\'université');
    }
};

// Récupérer les diplômes d'une université
export const getDegreesByUniversity = async (universityId: string): Promise<Degree[]> => {
    console.log('🎓 [universityAdminService][GET DEGREES BY UNIVERSITY]', universityId);
    try {
        const response = await apiServiceAdmin.get(`/api/universities/${universityId}/degrees`);
        console.log('✅ [universityAdminService][GET DEGREES BY UNIVERSITY][SUCCESS]', response.data);
        if (response.status === 200 && response.data) {
            return response.data;
        }
        throw new Error('Impossible de récupérer les diplômes de l\'université');
    } catch (err) {
        console.error('❌ [universityAdminService][GET DEGREES BY UNIVERSITY][ERROR]', err);
        throw new Error('Erreur lors de la récupération des diplômes de l\'université');
    }
};

// Récupérer toutes les universités qui proposent un diplôme donné
export const getUniversitiesByDegree = async (degreeId: string): Promise<University[]> => {
    console.log('🏫 [universityAdminService][GET UNIVERSITIES BY DEGREE]', degreeId);
    try {
        const response = await apiServiceAdmin.get(`/api/universities/degree/${degreeId}`);
        console.log('✅ [universityAdminService][GET UNIVERSITIES BY DEGREE][SUCCESS]', response.data);
        if (response.status === 200 && response.data) {
            return response.data;
        }
        throw new Error('Impossible de récupérer les universités pour ce diplôme');
    } catch (err) {
        console.error('❌ [universityAdminService][GET UNIVERSITIES BY DEGREE][ERROR]', err);
        throw new Error('Erreur lors de la récupération des universités pour ce diplôme');
    }
};

// Exporter toutes les universités (CSV ou JSON)
export const exportAllUniversities = async (format: 'csv' | 'json' = 'json'): Promise<any> => {
    console.log('📦 [universityAdminService][EXPORT]', format);
    try {
        // Utiliser les données déjà disponibles au lieu d'un endpoint spécialisé
        const universities = await getAllUniversities();
        
        if (format === 'csv') {
            // Convertir en CSV
            const headers = ['ID', 'Nom', 'Description', 'Site Web', 'Sponsor', 'Diplômes', 'Date Création'];
            const rows = universities.map(uni => [
                uni.id,
                uni.name,
                uni.description || '',
                uni.webSite || '',
                uni.isSponsor ? 'Oui' : 'Non',
                (uni.degrees || []).map(d => typeof d === 'string' ? d : d.name).join('; '),
                uni.createdAt ? new Date(uni.createdAt).toLocaleDateString('fr-FR') : ''
            ]);
            
            const csvContent = [headers, ...rows].map(row => 
                row.map(field => `"${field?.toString().replace(/"/g, '""') || ''}"`).join(',')
            ).join('\n');
            
            return csvContent;
        } else {
            // Retourner les données JSON
            return universities;
        }
    } catch (err) {
        console.error('❌ [universityAdminService][EXPORT][ERROR]', err);
        throw new Error('Erreur lors de l\'export des universités');
    }
};

// Récupérer les universités sponsors pour un diplôme donné
export const getSponsorsByDegree = async (degreeId: string): Promise<University[]> => {
    console.log('⭐ [universityAdminService][GET SPONSORS BY DEGREE]', degreeId);
    try {
        const response = await apiServiceAdmin.get('/api/universities/sponsors-by-degree', {degreeId});
        console.log('✅ [universityAdminService][GET SPONSORS BY DEGREE][SUCCESS]', response.data);
        if (response.status === 200 && response.data) {
            return response.data;
        }
        throw new Error('Impossible de récupérer les universités sponsors pour ce diplôme');
    } catch (err) {
        console.error('❌ [universityAdminService][GET SPONSORS BY DEGREE][ERROR]', err);
        throw new Error('Erreur lors de la récupération des universités sponsors pour ce diplôme');
    }
};
