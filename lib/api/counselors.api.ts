/**
 * =====================================================
 * API Client - Conseillers
 * =====================================================
 * Client pour les endpoints des conseillers d'orientation
 *
 * @module lib/api/counselors.api
 * @version 1.0
 */

import { apiClient } from "./client";
import type {
  CreateCounselorRequest,
  UpdateCounselorRequest,
  CounselorsListResponse,
  CounselorResponse,
  CreateCounselorResponse,
  UpdateCounselorResponse,
  DeleteCounselorResponse,
} from "../types";

export class CounselorsApi {
  private client = apiClient;

  /**
   * Récupérer tous les conseillers actifs
   * GET /api/counselors
   * Requiert: Bearer token
   */
  async getAll(params?: {
    specialty?: string;
  }): Promise<CounselorsListResponse> {
    return this.client.get<CounselorsListResponse>("/api/counselors", params);
  }

  /**
   * Récupérer tous les conseillers (actifs + inactifs) - Admin
   * GET /api/counselors/all
   * Requiert: Bearer token + admin
   */
  async getAllAdmin(): Promise<CounselorsListResponse> {
    return this.client.get<CounselorsListResponse>("/api/counselors/all");
  }

  /**
   * Récupérer un conseiller par ID
   * GET /api/counselors/:id
   * Requiert: Bearer token
   */
  async getById(counselorId: string): Promise<CounselorResponse> {
    return this.client.get<CounselorResponse>(`/api/counselors/${counselorId}`);
  }

  /**
   * Créer un conseiller (Admin uniquement)
   * POST /api/counselors
   * Requiert: Bearer token + admin
   */
  async create(data: CreateCounselorRequest): Promise<CreateCounselorResponse> {
    return this.client.post<CreateCounselorResponse>("/api/counselors", data);
  }

  /**
   * Mettre à jour un conseiller (Admin uniquement)
   * PUT /api/counselors/:id
   * Requiert: Bearer token + admin
   */
  async update(
    counselorId: string,
    data: UpdateCounselorRequest
  ): Promise<UpdateCounselorResponse> {
    return this.client.put<UpdateCounselorResponse>(
      `/api/counselors/${counselorId}`,
      data
    );
  }

  /**
   * Supprimer un conseiller (Admin uniquement)
   * DELETE /api/counselors/:id
   * Requiert: Bearer token + admin
   */
  async delete(counselorId: string): Promise<DeleteCounselorResponse> {
    return this.client.delete<DeleteCounselorResponse>(
      `/api/counselors/${counselorId}`
    );
  }

  /**
   * Désactiver un conseiller (Admin uniquement)
   * PATCH /api/counselors/:id/deactivate
   * Requiert: Bearer token + admin
   */
  async deactivate(counselorId: string): Promise<UpdateCounselorResponse> {
    return this.client.patch<UpdateCounselorResponse>(
      `/api/counselors/${counselorId}/deactivate`
    );
  }

  /**
   * Activer un conseiller (Admin uniquement)
   * PATCH /api/counselors/:id/activate
   * Requiert: Bearer token + admin
   */
  async activate(counselorId: string): Promise<UpdateCounselorResponse> {
    return this.client.patch<UpdateCounselorResponse>(
      `/api/counselors/${counselorId}/activate`
    );
  }
}

// Instance singleton exportée
export const counselorsApi = new CounselorsApi();
