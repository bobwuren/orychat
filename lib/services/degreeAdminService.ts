/* eslint-disable @typescript-eslint/no-explicit-any */
import apiServiceAdmin from '@/lib/services/apiServiceAdmin';
import { Degree } from '@/types/entities';

// Récupérer tous les diplômes (admin)
export const getAllDegrees = async (): Promise<Degree[]> => {
    console.log('📚 [degreeAdminService][GET] /api/degrees');
    try {
        const response = await apiServiceAdmin.get('/api/degrees');
        console.log('✅ [degreeAdminService][GET][SUCCESS] Format de la réponse:', 
            Array.isArray(response.data) ?
            `Array of ${response.data.length} items. First item keys: ${response.data[0] ? Object.keys(response.data[0]).join(', ') : 'empty'}` :
            typeof response.data);
            
        if (response.status === 200 && response.data) {
            // Afficher un échantillon pour déboguer
            if (Array.isArray(response.data) && response.data.length > 0) {
                console.log('📊 Exemple de diplôme reçu:', JSON.stringify(response.data[0], null, 2));
            }
            
            // Les données sont déjà enrichies avec les universités par le backend
            return response.data as Degree[];
        } else {
            throw new Error('Impossible de récupérer les diplômes');
        }
    } catch (err) {
        console.error('❌ [degreeAdminService][GET][ERROR]', err);
        throw new Error('Erreur lors de la récupération des diplômes');
    }
};

// Exporter tous les diplômes (admin)
export const exportDegrees = async (format: 'csv' | 'json' = 'json'): Promise<any> => {
    console.log('📦 [degreeAdminService][EXPORT]', format);
    try {
        const response = await apiServiceAdmin.get('/api/degrees/export', { format });
        console.log('✅ [degreeAdminService][EXPORT][SUCCESS]', response.data);
        if (response.status === 200 && response.data) {
            return response.data;
        } else {
            throw new Error('Impossible d\'exporter les diplômes');
        }
    } catch (err) {
        console.error('❌ [degreeAdminService][EXPORT][ERROR]', err);
        throw new Error('Erreur lors de l\'export des diplômes');
    }
};

// Récupérer un diplôme par ID (admin)
export const getDegreeById = async (id: string): Promise<Degree> => {
    console.log('🔎 [degreeAdminService][GET BY ID]', id);
    try {
        const response = await apiServiceAdmin.get(`/api/degrees/${id}`);
        console.log('✅ [degreeAdminService][GET BY ID][SUCCESS]', response.data);
        if (response.status === 200 && response.data) {
            return response.data as Degree;
        } else {
            throw new Error('Impossible de récupérer le diplôme');
        }
    } catch (err) {
        console.error('❌ [degreeAdminService][GET BY ID][ERROR]', err);
        throw new Error('Erreur lors de la récupération du diplôme');
    }
};

// Créer un diplôme (admin)
export const createDegree = async (data: Partial<Degree>): Promise<Degree> => {
    console.log('🆕 [degreeAdminService][CREATE]', data);
    try {
        const response = await apiServiceAdmin.post('/api/degrees', data);
        console.log('✅ [degreeAdminService][CREATE][SUCCESS]', response.data);
        if (response.status === 201 && response.data) {
            return response.data as Degree;
        } else {
            throw new Error('Impossible de créer le diplôme');
        }
    } catch (err: any) {
        console.error('❌ [degreeAdminService][CREATE][ERROR]', err);
        if (err.response?.status === 409) {
            throw new Error('Ce diplôme existe déjà');
        }
        throw new Error('Erreur lors de la création du diplôme');
    }
};

// Mettre à jour un diplôme (admin)
export const updateDegree = async (id: string, data: Partial<Degree>): Promise<Degree> => {
    console.log('✏️ [degreeAdminService][UPDATE]', id, data);
    try {
        const response = await apiServiceAdmin.put(`/api/degrees/${id}`, data);
        console.log('✅ [degreeAdminService][UPDATE][SUCCESS]', response.data);
        if (response.status === 200 && response.data) {
            return response.data as Degree;
        } else {
            throw new Error('Impossible de mettre à jour le diplôme');
        }
    } catch (err: any) {
        console.error('❌ [degreeAdminService][UPDATE][ERROR]', err);
        if (err.response?.status === 409) {
            throw new Error('Ce diplôme existe déjà');
        }
        throw new Error('Erreur lors de la mise à jour du diplôme');
    }
};

// Supprimer un diplôme (admin)
export const deleteDegree = async (id: string): Promise<void> => {
    console.log('🗑️ [degreeAdminService][DELETE]', id);
    try {
        const response = await apiServiceAdmin.delete(`/api/degrees/${id}`);
        console.log('✅ [degreeAdminService][DELETE][SUCCESS]', response.status);
        if (response.status !== 204) {
            throw new Error('Impossible de supprimer le diplôme');
        }
    } catch (err) {
        console.error('❌ [degreeAdminService][DELETE][ERROR]', err);
        throw new Error('Erreur lors de la suppression du diplôme');
    }
};

// Récupérer les diplômes d'une université (admin)
export const getDegreesByUniversity = async (universityId: string): Promise<Degree[]> => {
    console.log('🏫 [degreeAdminService][GET BY UNIVERSITY]', universityId);
    try {
        const response = await apiServiceAdmin.get(`/api/degrees/university/${universityId}`);
        console.log('✅ [degreeAdminService][GET BY UNIVERSITY][SUCCESS]', response.data);
        if (response.status === 200 && response.data) {
            return response.data as Degree[];
        } else {
            throw new Error('Impossible de récupérer les diplômes de l\'université');
        }
    } catch (err) {
        console.error('❌ [degreeAdminService][GET BY UNIVERSITY][ERROR]', err);
        throw new Error('Erreur lors de la récupération des diplômes de l\'université');
    }
};

// Récupérer toutes les universités qui proposent un diplôme (admin)
export const getUniversitiesByDegree = async (degreeId: string): Promise<any[]> => {
    console.log('🏫 [degreeAdminService][GET UNIVERSITIES BY DEGREE]', degreeId);
    try {
        const response = await apiServiceAdmin.get(`/api/degrees/${degreeId}/universities`);
        console.log('✅ [degreeAdminService][GET UNIVERSITIES BY DEGREE][SUCCESS]', response.data);
        if (response.status === 200 && response.data) {
            return response.data as any[];
        } else {
            throw new Error('Impossible de récupérer les universités pour ce diplôme');
        }
    } catch (err) {
        console.error('❌ [degreeAdminService][GET UNIVERSITIES BY DEGREE][ERROR]', err);
        throw new Error('Erreur lors de la récupération des universités pour ce diplôme');
    }
};
