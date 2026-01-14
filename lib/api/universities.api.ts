/**
 * =====================================================
 * API Client - Universités
 * =====================================================
 * Client pour les endpoints des universités
 *
 * @module lib/api/universities.api
 * @version 1.0
 */

import { apiClient } from "./client";
import type {
  CreateUniversityRequest,
  UpdateUniversityRequest,
  UniversitiesListResponse,
  SponsorsListResponse,
  UniversityResponse,
  CreateUniversityResponse,
  UpdateUniversityResponse,
  DeleteUniversityResponse,
  UniversityDegreesResponse,
  UniversitiesByDegreeResponse,
} from "../types";

export class UniversitiesApi {
  private client = apiClient;

  /**
   * Récupérer toutes les universités
   * GET /api/universities
   * Requiert: Bearer token
   */
  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sponsorOnly?: boolean;
  }): Promise<UniversitiesListResponse> {
    return this.client.get<UniversitiesListResponse>(
      "/api/universities",
      params
    );
  }

  /**
   * Récupérer toutes les universités sponsors
   * GET /api/universities/sponsors
   * Requiert: Bearer token
   */
  async getSponsors(params?: {
    page?: number;
    limit?: number;
  }): Promise<SponsorsListResponse> {
    return this.client.get<SponsorsListResponse>(
      "/api/universities/sponsors",
      params
    );
  }

  /**
   * Récupérer une université par ID
   * GET /api/universities/:id
   * Requiert: Bearer token
   */
  async getById(universityId: string): Promise<UniversityResponse> {
    return this.client.get<UniversityResponse>(
      `/api/universities/${universityId}`
    );
  }

  /**
   * Récupérer les diplômes d'une université
   * GET /api/universities/:id/degrees
   */
  async getDegrees(universityId: string): Promise<UniversityDegreesResponse> {
    return this.client.get<UniversityDegreesResponse>(
      `/api/universities/${universityId}/degrees`
    );
  }

  /**
   * Récupérer les universités proposant un diplôme
   * GET /api/universities/degree/:degreeId
   */
  async getByDegree(degreeId: string): Promise<UniversitiesByDegreeResponse> {
    return this.client.get<UniversitiesByDegreeResponse>(
      `/api/universities/degree/${degreeId}`
    );
  }

  /**
   * Créer une université (Admin uniquement)
   * POST /api/universities
   * Requiert: Bearer token + admin
   */
  async create(
    data: CreateUniversityRequest
  ): Promise<CreateUniversityResponse> {
    return this.client.post<CreateUniversityResponse>(
      "/api/universities",
      data
    );
  }

  /**
   * Mettre à jour une université (Admin uniquement)
   * PUT /api/universities/:id
   * Requiert: Bearer token + admin
   */
  async update(
    universityId: string,
    data: UpdateUniversityRequest
  ): Promise<UpdateUniversityResponse> {
    return this.client.put<UpdateUniversityResponse>(
      `/api/universities/${universityId}`,
      data
    );
  }

  /**
   * Supprimer une université (Admin uniquement)
   * DELETE /api/universities/:id
   * Requiert: Bearer token + admin
   */
  async delete(universityId: string): Promise<DeleteUniversityResponse> {
    return this.client.delete<DeleteUniversityResponse>(
      `/api/universities/${universityId}`
    );
  }

  /**
   * Exporter toutes les universités (Admin uniquement)
   * GET /api/universities/export
   * Requiert: Bearer token + admin
   */
  async export(params?: { format?: "csv" | "json" }): Promise<Blob> {
    const format = params?.format || "csv";
    const filename = `universities_export_${
      new Date().toISOString().split("T")[0]
    }.${format}`;
    return this.client.download(
      "/api/universities/export",
      { format },
      filename
    );
  }
}

// Instance singleton exportée
export const universitiesApi = new UniversitiesApi();
