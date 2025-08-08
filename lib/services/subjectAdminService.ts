/* eslint-disable @typescript-eslint/no-explicit-any */
import apiServiceAdmin from '@/lib/services/apiServiceAdmin';
import {Subject} from '@/types/entities';
import { CacheService } from '@/lib/cache';

// Récupérer toutes les matières (admin)
export const getAllSubjects = async (): Promise<Subject[]> => {
    // console.log('📚 [subjectAdminService][GET] /api/subjects');
    try {
        const response = await apiServiceAdmin.get('/api/subjects');
        // console.log('✅ [subjectAdminService][GET][SUCCESS]', response.data);
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
    // console.log('📦 [subjectAdminService][EXPORT]', format);
    try {
        const response = await apiServiceAdmin.get('/api/subjects/export', {format});
        // console.log('✅ [subjectAdminService][EXPORT][SUCCESS]', response.data);
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

// Créer une matière (admin)
export const createSubject = async (data: {
  name: string;
  seriesCoefficients?: { serieId: number; coefficient: number }[];
}): Promise<Subject> => {
//   console.log('🆕 [subjectAdminService][CREATE]', data);
  try {
    const response = await apiServiceAdmin.post('/api/subjects', data);
    // console.log('✅ [subjectAdminService][CREATE][SUCCESS]', response.data);
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
export const updateSubject = async (
    id: number,
    data: Partial<Subject> & { seriesCoefficients?: { serieId: number; coefficient: number }[] }
): Promise<Subject> => {
    // console.log('✏️ [subjectAdminService][UPDATE]', id, data);
    try {
        const response = await apiServiceAdmin.put(`/api/subjects/${id}`, data);
        // console.log('✅ [subjectAdminService][UPDATE][SUCCESS]', response.data);
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
export const deleteSubject = async (id: number): Promise<void> => {
    // console.log('🗑️ [subjectAdminService][DELETE]', id);
    try {
        const response = await apiServiceAdmin.delete(`/api/subjects/${id}`);
        // console.log('✅ [subjectAdminService][DELETE][SUCCESS]', response.status);
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

// Récupérer les coefficients d'une matière pour chaque série (admin)
export const getSeriesCoefficientsForSubject = async (id: number): Promise<Record<string, number>> => {
    // console.log('📊 [subjectAdminService][GET COEFFICIENTS]', id);
    try {
        const response = await apiServiceAdmin.get(`/api/subjects/${id}/coefficients`);
        // console.log('✅ [subjectAdminService][GET COEFFICIENTS][SUCCESS]', response.data);
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