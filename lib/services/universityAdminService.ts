/* eslint-disable @typescript-eslint/no-explicit-any */
import apiServiceAdmin from '@/lib/services/apiServiceAdmin';
import {Degree, University} from '@/types/entities';

// Récupérer toutes les universités
export const getAllUniversities = async (): Promise<University[]> => {
    // console.log('🏫 [universityAdminService][GET] /api/universities');
    try {
        const response = await apiServiceAdmin.get('/api/universities');
        // console.log('✅ [universityAdminService][GET][SUCCESS]', response.data);
        if (response.status === 200 && response.data) {
            return response.data;
        }
        throw new Error('Impossible de récupérer les universités');
    } catch (err) {
        console.error('❌ [universityAdminService][GET][ERROR]', err);
        throw new Error('Erreur lors de la récupération des universités');
    }
};

// Créer une université (au moins un degree obligatoire)
export const createUniversity = async (data: Partial<University> & { degrees: number[] }): Promise<University> => {
    if (!data.degrees || !Array.isArray(data.degrees) || data.degrees.length === 0) {
        throw new Error('Une université doit proposer au moins un diplôme.');
    }
    // console.log('🆕 [universityAdminService][CREATE]', data);
    try {
        const response = await apiServiceAdmin.post('/api/universities', data);
        // console.log('✅ [universityAdminService][CREATE][SUCCESS]', response.data);
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
export const updateUniversity = async (id: number, data: Partial<University>): Promise<University> => {
    // console.log('✏️ [universityAdminService][UPDATE]', id, data);
    try {
        const response = await apiServiceAdmin.put(`/api/universities/${id}`, data);
        // console.log('✅ [universityAdminService][UPDATE][SUCCESS]', response.data);
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
export const deleteUniversity = async (id: number): Promise<void> => {
    // console.log('🗑️ [universityAdminService][DELETE]', id);
    try {
        const response = await apiServiceAdmin.delete(`/api/universities/${id}`);
        // console.log('✅ [universityAdminService][DELETE][SUCCESS]', response.status);
        if (response.status !== 204) {
            throw new Error('Impossible de supprimer l\'université');
        }
    } catch (err) {
        console.error('❌ [universityAdminService][DELETE][ERROR]', err);
        throw new Error('Erreur lors de la suppression de l\'université');
    }
};

// Exporter toutes les universités (CSV ou JSON)
export const exportAllUniversities = async (format: 'csv' | 'json' = 'json'): Promise<any> => {
    // console.log('📦 [universityAdminService][EXPORT]', format);
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
                (uni.degrees || []).map(d => typeof d === 'number' ? d : d.name).join('; '),
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
