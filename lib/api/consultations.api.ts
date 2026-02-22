/**
 * =====================================================
 * API Client - Consultations - CORRIGÉ
 * =====================================================
 * Client pour les endpoints des consultations
 *
 * @module lib/api/consultations.api
 * @version 1.1
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
   */
  async request(
    data: RequestConsultationRequest,
  ): Promise<RequestConsultationResponse> {
    return this.client.post<RequestConsultationResponse>(
      "/consultations/request",
      data,
    );
  }

  /**
   * Liste toutes les consultations (Admin uniquement)
   * GET /api/consultations
   */
  async getAll(params?: {
    status?: ConsultationStatus;
    counselorId?: string;
    page?: number;
    limit?: number;
  }): Promise<ConsultationsListResponse> {
    return this.client.get<ConsultationsListResponse>("/consultations", params);
  }

  /**
   * Récupérer les statistiques des consultations (Admin uniquement)
   * GET /api/consultations/stats
   */
  async getStats(): Promise<ConsultationStatsResponse> {
    return this.client.get<ConsultationStatsResponse>("/consultations/stats");
  }

  /**
   * Récupérer l'historique des consultations d'un utilisateur
   * GET /api/consultations/user/:userId
   */
  async getUserConsultations(
    userId: string,
  ): Promise<ConsultationsListResponse> {
    return this.client.get<ConsultationsListResponse>(
      `/consultations/user/${userId}`,
    );
  }

  /**
   * Récupérer les détails d'une consultation (Admin uniquement)
   * GET /api/consultations/:id
   */
  async getById(consultationId: string): Promise<ConsultationDetailsResponse> {
    return this.client.get<ConsultationDetailsResponse>(
      `/consultations/${consultationId}`,
    );
  }

  /**
   * Assigner un conseiller (Admin uniquement)
   * PUT /api/consultations/:id/assign
   */
  async assignCounselor(
    consultationId: string,
    data: AssignCounselorRequest,
  ): Promise<AssignCounselorResponse> {
    return this.client.put<AssignCounselorResponse, AssignCounselorRequest>(
      `/consultations/${consultationId}/assign`,
      data,
    );
  }

  /**
   * Mettre à jour le statut (Admin uniquement)
   * PATCH /api/consultations/:id/status
   */
  async updateStatus(
    consultationId: string,
    data: UpdateConsultationStatusRequest,
  ): Promise<UpdateConsultationStatusResponse> {
    return this.client.patch<
      UpdateConsultationStatusResponse,
      UpdateConsultationStatusRequest
    >(`/consultations/${consultationId}/status`, data);
  }
}

// Instance singleton exportée
export const consultationsApi = new ConsultationsApi();
