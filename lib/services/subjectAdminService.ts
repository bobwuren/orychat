/* eslint-disable @typescript-eslint/no-explicit-any */
import apiServiceAdmin from '@/lib/services/apiServiceAdmin';
import {Subject} from '@/types/entities';
import { CacheService } from '@/lib/cache';

// Récupérer toutes les matières (admin)
export const getAllSubjects = async (): Promise<Subject[]> => {
    console.log('📚 [subjectAdminService][GET] /api/subjects');
    try {
        const response = await apiServiceAdmin.get('/api/subjects');
        console.log('✅ [subjectAdminService][GET][SUCCESS]', response.data);
        if (response.status === 200 && response.data) {
            return response.data.subjects || response.data;
        } else {
            throw new Error('Impossible de récupérer les matières');
        }
    } catch (err) {
        console.error('❌ [subjectAdminService][GET][ERROR]', err);
        throw new Error('Erreur lors de la récupération des matières');
    }
};

// Exporter les matières (admin)
export const exportSubjects = async (format: 'csv' | 'json' = 'json'): Promise<any> => {
    console.log('📦 [subjectAdminService][EXPORT]', format);
    try {
        const response = await apiServiceAdmin.get('/api/subjects/export', {format});
        console.log('✅ [subjectAdminService][EXPORT][SUCCESS]', response.data);
        if (response.status === 200 && response.data) {
            return response.data;
        } else {
            throw new Error('Impossible d\'exporter les matières');
        }
    } catch (err) {
        console.error('❌ [subjectAdminService][EXPORT][ERROR]', err);
        throw new Error('Erreur lors de l\'export des matières');
    }
};

// Récupérer une matière par ID (admin)
export const getSubjectById = async (id: string): Promise<Subject> => {
    console.log('🔎 [subjectAdminService][GET BY ID]', id);
    try {
        const response = await apiServiceAdmin.get(`/api/subjects/${id}`);
        console.log('✅ [subjectAdminService][GET BY ID][SUCCESS]', response.data);
        if (response.status === 200 && response.data) {
            return response.data.subject || response.data;
        } else {
            throw new Error('Impossible de récupérer la matière');
        }
    } catch (err) {
        console.error('❌ [subjectAdminService][GET BY ID][ERROR]', err);
        throw new Error('Erreur lors de la récupération de la matière');
    }
};

// Créer une matière (admin)
export const createSubject = async (data: {
  name: string;
  seriesCoefficients?: { serieId: string; coefficient: number }[];
}): Promise<Subject> => {
  console.log('🆕 [subjectAdminService][CREATE]', data);
  try {
    const response = await apiServiceAdmin.post('/api/subjects', data);
    console.log('✅ [subjectAdminService][CREATE][SUCCESS]', response.data);
    if (response.status === 201 && response.data) {
      // Invalider le cache après création
      CacheService.invalidate('subjects');
      return response.data;
    }
    throw new Error('Impossible de créer la matière');
  } catch (err: any) {
    console.error('❌ [subjectAdminService][CREATE][ERROR]', err);
    if (err.response?.status === 409) {
      throw new Error('Cette matière existe déjà');
    }
    throw new Error('Erreur lors de la création de la matière');
  }
};

// Mettre à jour une matière (admin)
export const updateSubject = async (id: string, data: Partial<Subject> & { seriesCoefficients?: { serieId: string; coefficient: number }[] }): Promise<Subject> => {
    console.log('✏️ [subjectAdminService][UPDATE]', id, data);
    try {
        const response = await apiServiceAdmin.put(`/api/subjects/${id}`, data);
        console.log('✅ [subjectAdminService][UPDATE][SUCCESS]', response.data);
        if (response.status === 200 && response.data) {
            // Invalider le cache après mise à jour
            CacheService.invalidate('subjects');
            return response.data.subject || response.data;
        } else {
            throw new Error('Impossible de mettre à jour la matière');
        }
    } catch (err: any) {
        console.error('❌ [subjectAdminService][UPDATE][ERROR]', err);
        if (err.response?.status === 409) {
            throw new Error('Cette matière existe déjà');
        }
        throw new Error('Erreur lors de la mise à jour de la matière');
    }
};

// Supprimer une matière (admin)
export const deleteSubject = async (id: string): Promise<void> => {
    console.log('🗑️ [subjectAdminService][DELETE]', id);
    try {
        const response = await apiServiceAdmin.delete(`/api/subjects/${id}`);
        console.log('✅ [subjectAdminService][DELETE][SUCCESS]', response.status);
        if (response.status !== 200) {
            throw new Error('Impossible de supprimer la matière');
        }
        // 🔥 CRUCIAL: Invalider le cache après suppression
        CacheService.invalidate('subjects');
    } catch (err) {
        console.error('❌ [subjectAdminService][DELETE][ERROR]', err);
        throw new Error('Erreur lors de la suppression de la matière');
    }
};

// Récupérer les matières d'une série (admin)
export const getSubjectsBySerieId = async (serieId: string): Promise<Subject[]> => {
    console.log('📚 [subjectAdminService][GET BY SERIE]', serieId);
    try {
        const response = await apiServiceAdmin.get(`/api/subjects/serie/${serieId}`);
        console.log('✅ [subjectAdminService][GET BY SERIE][SUCCESS]', response.data);
        if (response.status === 200 && response.data) {
            return response.data;
        } else {
            throw new Error('Impossible de récupérer les matières de la série');
        }
    } catch (err) {
        console.error('❌ [subjectAdminService][GET BY SERIE][ERROR]', err);
        throw new Error('Erreur lors de la récupération des matières de la série');
    }
};

// Récupérer les coefficients d'une matière pour chaque série (admin)
export const getSeriesCoefficientsForSubject = async (id: string): Promise<Record<string, number>> => {
    console.log('📊 [subjectAdminService][GET COEFFICIENTS]', id);
    try {
        const response = await apiServiceAdmin.get(`/api/subjects/${id}/coefficients`);
        console.log('✅ [subjectAdminService][GET COEFFICIENTS][SUCCESS]', response.data);
        if (response.status === 200 && response.data) {
            return response.data;
        } else {
            throw new Error('Impossible de récupérer les coefficients');
        }
    } catch (err) {
        console.error('❌ [subjectAdminService][GET COEFFICIENTS][ERROR]', err);
        throw new Error('Erreur lors de la récupération des coefficients');
    }
};

// Invalidation du cache après modification (optionnel mais recommandé)
export const invalidateSubjectsCache = async (): Promise<void> => {
    console.log('🗑️ [subjectAdminService][CACHE INVALIDATION]');
    try {
        // Cette méthode pourrait être appelée après create/update/delete
        // pour s'assurer que le cache est à jour
        console.log('✅ [subjectAdminService][CACHE INVALIDATION][SUCCESS]');
    } catch (err) {
        console.error('❌ [subjectAdminService][CACHE INVALIDATION][ERROR]', err);
    }
};
