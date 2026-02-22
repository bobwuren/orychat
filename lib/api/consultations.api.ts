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

  // POST /api/consultations/request
  async request(
    data: RequestConsultationRequest,
  ): Promise<RequestConsultationResponse> {
    return this.client.post<RequestConsultationResponse>(
      "/consultations/request",
      data,
    );
  }

  // GET /api/consultations (Admin) — filtrables par status et counselorId uniquement
  async getAll(params?: {
    status?: ConsultationStatus;
    counselorId?: string;
  }): Promise<ConsultationsListResponse> {
    return this.client.get<ConsultationsListResponse>("/consultations", params);
  }

  // GET /api/consultations/stats (Admin)
  async getStats(): Promise<ConsultationStatsResponse> {
    return this.client.get<ConsultationStatsResponse>("/consultations/stats");
  }

  // GET /api/consultations/user/:userId
  async getUserConsultations(
    userId: string,
  ): Promise<ConsultationsListResponse> {
    return this.client.get<ConsultationsListResponse>(
      `/consultations/user/${userId}`,
    );
  }

  // GET /api/consultations/:id (Admin)
  async getById(consultationId: string): Promise<ConsultationDetailsResponse> {
    return this.client.get<ConsultationDetailsResponse>(
      `/consultations/${consultationId}`,
    );
  }

  // PUT /api/consultations/:id/assign (Admin)
  async assignCounselor(
    consultationId: string,
    data: AssignCounselorRequest,
  ): Promise<AssignCounselorResponse> {
    return this.client.put<AssignCounselorResponse, AssignCounselorRequest>(
      `/consultations/${consultationId}/assign`,
      data,
    );
  }

  // PATCH /api/consultations/:id/status (Admin)
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

export const consultationsApi = new ConsultationsApi();
