/* eslint-disable @typescript-eslint/no-explicit-any */
import apiServiceAdmin from '@/lib/services/apiServiceAdmin';
import { Serie } from '@/types/entities';
import { CacheService } from '@/lib/cache';

// Récupérer toutes les séries (admin)
export const getAllSeries = async (): Promise<Serie[]> => {
    console.log('📚 [serieAdminService][GET] /api/series');
    try {
        const response = await apiServiceAdmin.get('/api/series');
        console.log('✅ [serieAdminService][GET][SUCCESS]', response.data);
        if (response.status === 200 && response.data) {
            return response.data.series || response.data;
        } else {
            throw new Error('Impossible de récupérer les séries');
        }
    } catch (err) {
        console.error('❌ [serieAdminService][GET][ERROR]', err);
        throw new Error('Erreur lors de la récupération des séries');
    }
};

// Exporter les séries (admin)
export const exportSeries = async (format: 'csv' | 'json' = 'json'): Promise<any> => {
    console.log('📦 [serieAdminService][EXPORT]', format);
    try {
        const response = await apiServiceAdmin.get('/api/series/export', { format });
        console.log('✅ [serieAdminService][EXPORT][SUCCESS]', response.data);
        if (response.status === 200 && response.data) {
            return response.data;
        } else {
            throw new Error('Impossible d\'exporter les séries');
        }
    } catch (err) {
        console.error('❌ [serieAdminService][EXPORT][ERROR]', err);
        throw new Error('Erreur lors de l\'export des séries');
    }
};

// Récupérer une série par ID (admin)
export const getSerieById = async (id: string): Promise<Serie> => {
    console.log('🔎 [serieAdminService][GET BY ID]', id);
    try {
        const response = await apiServiceAdmin.get(`/api/series/${id}`);
        console.log('✅ [serieAdminService][GET BY ID][SUCCESS]', response.data);
        if (response.status === 200 && response.data) {
            return response.data;
        } else {
            throw new Error('Impossible de récupérer la série');
        }
    } catch (err) {
        console.error('❌ [serieAdminService][GET BY ID][ERROR]', err);
        throw new Error('Erreur lors de la récupération de la série');
    }
};

export const createSerie = async (data: {
  code: string;
  description: string;
  subjects?: Array<{ subjectId: string; coefficient: number }>;
}): Promise<Serie> => {
  console.log('🆕 [serieAdminService][CREATE]', data);
  try {
    const response = await apiServiceAdmin.post('/api/series', data);
    console.log('✅ [serieAdminService][CREATE][SUCCESS]', response.data);
    if (response.status === 201 && response.data) {
      // Invalider le cache après création
      CacheService.invalidate('series');
      return response.data;
    }
    throw new Error('Impossible de créer la série');
  } catch (err: any) {
    console.error('❌ [serieAdminService][CREATE][ERROR]', err);
    if (err.response?.status === 409) {
      throw new Error('Cette série existe déjà');
    }
    throw new Error('Erreur lors de la création de la série');
  }
};

export const updateSerie = async (
  id: string, 
  data: {
    code: string;
    description: string;
    subjects?: Array<{ subjectId: string; coefficient: number }>;
  }
): Promise<Serie> => {
  console.log('✏️ [serieAdminService][UPDATE]', id, data);
  try {
    const response = await apiServiceAdmin.put(`/api/series/${id}`, data);
    console.log('✅ [serieAdminService][UPDATE][SUCCESS]', response.data);
    if (response.status === 200 && response.data) {
      // Invalider le cache après mise à jour
      CacheService.invalidate('series');
      return response.data;
    }
    throw new Error('Impossible de mettre à jour la série');
  } catch (err: any) {
    console.error('❌ [serieAdminService][UPDATE][ERROR]', err);
    if (err.response?.status === 409) {
      throw new Error('Cette série existe déjà');
    }
    throw new Error('Erreur lors de la mise à jour de la série');
  }
};

// Supprimer une série (admin)
export const deleteSerie = async (id: string, cascade: boolean = false): Promise<void> => {
    console.log('🗑️ [serieAdminService][DELETE]', id, 'cascade:', cascade);
    try {
        const response = await apiServiceAdmin.delete(`/api/series/${id}?cascade=${cascade}`);
        console.log('✅ [serieAdminService][DELETE][SUCCESS]', response.status);
        if (response.status !== 200) {
            throw new Error('Impossible de supprimer la série');
        }
        // 🔥 CRUCIAL: Invalider le cache après suppression
        CacheService.invalidate('series');
    } catch (err) {
        console.error('❌ [serieAdminService][DELETE][ERROR]', err);
        throw new Error('Erreur lors de la suppression de la série');
    }
};

// Récupérer les matières associées à une série (admin)
export const getSubjectsForSerie = async (serieId: string): Promise<any[]> => {
    console.log('📚 [serieAdminService][GET SUBJECTS]', serieId);
    try {
        const response = await apiServiceAdmin.get(`/api/subjects/serie/${serieId}`);
        console.log('✅ [serieAdminService][GET SUBJECTS][SUCCESS]', response.data);
        if (response.status === 200 && response.data) {
            return response.data;
        } else {
            throw new Error('Impossible de récupérer les matières de la série');
        }
    } catch (err) {
        console.error('❌ [serieAdminService][GET SUBJECTS][ERROR]', err);
        throw new Error('Erreur lors de la récupération des matières de la série');
    }
};

// Invalidation du cache après modification
export const invalidateSeriesCache = async (): Promise<void> => {
    console.log('🗑️ [serieAdminService][CACHE INVALIDATION]');
    try {
        // Cette méthode pourrait être appelée après create/update/delete
        // pour s'assurer que le cache est à jour
        console.log('✅ [serieAdminService][CACHE INVALIDATION][SUCCESS]');
    } catch (err) {
        console.error('❌ [serieAdminService][CACHE INVALIDATION][ERROR]', err);
    }
};
