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

  // GET /api/counselors — filtrables par specialty uniquement
  async getAll(params?: {
    specialty?: string;
  }): Promise<CounselorsListResponse> {
    return this.client.get<CounselorsListResponse>("/counselors", params);
  }

  // GET /api/counselors/all (Admin)
  async getAllAdmin(): Promise<CounselorsListResponse> {
    return this.client.get<CounselorsListResponse>("/counselors/all");
  }

  // GET /api/counselors/:id
  async getById(counselorId: string): Promise<CounselorResponse> {
    return this.client.get<CounselorResponse>(`/counselors/${counselorId}`);
  }

  // POST /api/counselors (Admin)
  async create(data: CreateCounselorRequest): Promise<CreateCounselorResponse> {
    return this.client.post<CreateCounselorResponse, CreateCounselorRequest>(
      "/counselors",
      data,
    );
  }

  // PUT /api/counselors/:id (Admin)
  async update(
    counselorId: string,
    data: UpdateCounselorRequest,
  ): Promise<UpdateCounselorResponse> {
    return this.client.put<UpdateCounselorResponse, UpdateCounselorRequest>(
      `/counselors/${counselorId}`,
      data,
    );
  }

  // DELETE /api/counselors/:id (Admin)
  async delete(counselorId: string): Promise<DeleteCounselorResponse> {
    return this.client.delete<DeleteCounselorResponse>(
      `/counselors/${counselorId}`,
    );
  }

  // PATCH /api/counselors/:id/deactivate (Admin)
  async deactivate(counselorId: string): Promise<UpdateCounselorResponse> {
    return this.client.patch<UpdateCounselorResponse, undefined>(
      `/counselors/${counselorId}/deactivate`,
      undefined,
    );
  }

  // PATCH /api/counselors/:id/activate (Admin)
  async activate(counselorId: string): Promise<UpdateCounselorResponse> {
    return this.client.patch<UpdateCounselorResponse, undefined>(
      `/counselors/${counselorId}/activate`,
      undefined,
    );
  }
}

export const counselorsApi = new CounselorsApi();
