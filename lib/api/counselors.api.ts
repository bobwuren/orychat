/**
 * =====================================================
 * API Client - Conseillers - CORRIGÉ
 * =====================================================
 * Client pour les endpoints des conseillers d'orientation
 *
 * @module lib/api/counselors.api
 * @version 1.1
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
   */
  async getAll(params?: {
    specialty?: string;
    page?: number;
    limit?: number;
  }): Promise<CounselorsListResponse> {
    return this.client.get<CounselorsListResponse>("/counselors", params);
  }

  /**
   * Récupérer tous les conseillers (actifs + inactifs) - Admin
   * GET /api/counselors/all
   */
  async getAllAdmin(params?: {
    includeInactive?: boolean;
    page?: number;
    limit?: number;
  }): Promise<CounselorsListResponse> {
    return this.client.get<CounselorsListResponse>("/counselors/all", params);
  }

  /**
   * Récupérer un conseiller par ID
   * GET /api/counselors/:id
   */
  async getById(counselorId: string): Promise<CounselorResponse> {
    return this.client.get<CounselorResponse>(`/counselors/${counselorId}`);
  }

  /**
   * Créer un conseiller (Admin uniquement)
   * POST /api/counselors
   */
  async create(data: CreateCounselorRequest): Promise<CreateCounselorResponse> {
    return this.client.post<CreateCounselorResponse, CreateCounselorRequest>(
      "/counselors",
      data,
    );
  }

  /**
   * Mettre à jour un conseiller (Admin uniquement)
   * PUT /api/counselors/:id
   */
  async update(
    counselorId: string,
    data: UpdateCounselorRequest,
  ): Promise<UpdateCounselorResponse> {
    return this.client.put<UpdateCounselorResponse, UpdateCounselorRequest>(
      `/counselors/${counselorId}`,
      data,
    );
  }

  /**
   * Supprimer un conseiller (Admin uniquement)
   * DELETE /api/counselors/:id
   */
  async delete(counselorId: string): Promise<DeleteCounselorResponse> {
    return this.client.delete<DeleteCounselorResponse>(
      `/counselors/${counselorId}`,
    );
  }

  /**
   * Désactiver un conseiller (Admin uniquement)
   * PATCH /api/counselors/:id/deactivate
   */
  async deactivate(counselorId: string): Promise<UpdateCounselorResponse> {
    return this.client.patch<UpdateCounselorResponse, undefined>(
      `/counselors/${counselorId}/deactivate`,
      undefined,
    );
  }

  /**
   * Activer un conseiller (Admin uniquement)
   * PATCH /api/counselors/:id/activate
   */
  async activate(counselorId: string): Promise<UpdateCounselorResponse> {
    return this.client.patch<UpdateCounselorResponse, undefined>(
      `/counselors/${counselorId}/activate`,
      undefined,
    );
  }
}

// Instance singleton exportée
export const counselorsApi = new CounselorsApi();
