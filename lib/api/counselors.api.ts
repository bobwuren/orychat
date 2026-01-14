/**
 * =====================================================
 * API Client - Consultations
 * =====================================================
 * Client pour les endpoints des consultations
 *
 * @module lib/api/consultations.api
 * @version 1.0
 */

import { apiClient } from "./client";
import type {
  RequestConsultationRequest,
  AssignCounselorRequest,
  UpdateConsultationStatusRequest,
  RequestConsultationResponse,
  ConsultationsListResponse,
  ConsultationDetailsResponse,
  AssignCounselorResponse,
  UpdateConsultationStatusResponse,
  ConsultationStatsResponse,
  ConsultationStatus,
} from "../types";

export class ConsultationsApi {
  private client = apiClient;

  /**
   * Créer une demande de consultation
   * POST /api/consultations/request
   * Requiert: Bearer token
   */
  async request(
    data: RequestConsultationRequest
  ): Promise<RequestConsultationResponse> {
    return this.client.post<RequestConsultationResponse>(
      "/api/consultations/request",
      data
    );
  }

  /**
   * Liste toutes les consultations (Admin uniquement)
   * GET /api/consultations
   * Requiert: Bearer token + admin
   */
  async getAll(params?: {
    status?: ConsultationStatus;
    counselorId?: string;
  }): Promise<ConsultationsListResponse> {
    return this.client.get<ConsultationsListResponse>(
      "/api/consultations",
      params
    );
  }

  /**
   * Récupérer les statistiques des consultations (Admin uniquement)
   * GET /api/consultations/stats
   * Requiert: Bearer token + admin
   */
  async getStats(): Promise<ConsultationStatsResponse> {
    return this.client.get<ConsultationStatsResponse>(
      "/api/consultations/stats"
    );
  }

  /**
   * Récupérer l'historique des consultations d'un utilisateur
   * GET /api/consultations/user/:userId
   * Requiert: Bearer token (admin ou user lui-même)
   */
  async getUserConsultations(
    userId: string
  ): Promise<ConsultationsListResponse> {
    return this.client.get<ConsultationsListResponse>(
      `/api/consultations/user/${userId}`
    );
  }

  /**
   * Récupérer les détails d'une consultation (Admin uniquement)
   * GET /api/consultations/:id
   * Requiert: Bearer token + admin
   */
  async getById(consultationId: string): Promise<ConsultationDetailsResponse> {
    return this.client.get<ConsultationDetailsResponse>(
      `/api/consultations/${consultationId}`
    );
  }

  /**
   * Assigner un conseiller (Admin uniquement)
   * PUT /api/consultations/:id/assign
   * Requiert: Bearer token + admin
   */
  async assignCounselor(
    consultationId: string,
    data: AssignCounselorRequest
  ): Promise<AssignCounselorResponse> {
    return this.client.put<AssignCounselorResponse>(
      `/api/consultations/${consultationId}/assign`,
      data
    );
  }

  /**
   * Mettre à jour le statut (Admin uniquement)
   * PATCH /api/consultations/:id/status
   * Requiert: Bearer token + admin
   */
  async updateStatus(
    consultationId: string,
    data: UpdateConsultationStatusRequest
  ): Promise<UpdateConsultationStatusResponse> {
    return this.client.patch<UpdateConsultationStatusResponse>(
      `/api/consultations/${consultationId}/status`,
      data
    );
  }
}

// Instance singleton exportée
export const consultationsApi = new ConsultationsApi();
