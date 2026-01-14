/**
 * =====================================================
 * Types API de base - Orientys Frontend
 * =====================================================
 * Types communs utilisés dans toute l'application
 */

export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  error?: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  count: number;
  totalPages?: number;
  currentPage?: number;
  metadata?: {
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
  };
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
  details?: any;
}

export type Permissions = "admin" | "client";

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

// Types pour les requêtes avec pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
}

// Types pour les requêtes avec recherche
export interface SearchParams extends PaginationParams {
  search?: string;
}

// Types pour les exports
export type ExportFormat = "csv" | "json";

export interface ExportParams {
  format?: ExportFormat;
}
