import { apiClient } from './client';
import type * as T from '../types/series';

// ============= SERIES API =============
export class SeriesApi {
  async getAll() {
    return apiClient.get<T.SeriesListResponse>('/series');
  }

  async getById(id: string) {
    return apiClient.get<T.SerieResponse>(`/series/${id}`);
  }

  async create(data: T.CreateSerieRequest) {
    return apiClient.post<T.CreateSerieResponse>('/series', data);
  }

  async update(id: string, data: T.UpdateSerieRequest) {
    return apiClient.put<T.UpdateSerieResponse>(`/series/${id}`, data);
  }

  async delete(id: string) {
    return apiClient.delete<T.DeleteSerieResponse>(`/series/${id}`);
  }

  async export(format: 'csv' | 'json' = 'json') {
    return apiClient.get(`/series/export?format=${format}`);
  }
}

export const seriesApi = new SeriesApi();