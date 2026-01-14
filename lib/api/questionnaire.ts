import { apiClient } from "./client";
import type * as T from "../types/questionnaire";

// ============= QUESTIONNAIRE API =============
export class QuestionnaireApi {
  async submit(data: T.SubmitQuestionnaireRequest) {
    return apiClient.post<T.SubmitQuestionnaireResponse>(
      "/questionnaire/submit",
      data
    );
  }

  async getById(id: string) {
    return apiClient.get<{
      success: boolean;
      questionnaire: T.QuestionnaireResponse;
    }>(`/questionnaire/${id}`);
  }

  async getUserQuestionnaires(userId: string) {
    return apiClient.get<{
      success: boolean;
      questionnaires: T.QuestionnaireResponse[];
      count: number;
    }>(`/questionnaire/user/${userId}`);
  }

  async getLatest(userId: string) {
    return apiClient.get<{
      success: boolean;
      questionnaire: T.QuestionnaireResponse;
    }>(`/questionnaire/user/${userId}/latest`);
  }

  async getAll() {
    return apiClient.get<{
      success: boolean;
      questionnaires: T.QuestionnaireResponse[];
      count: number;
    }>("/questionnaire/all");
  }

  async delete(id: string) {
    return apiClient.delete<{ success: boolean; message: string }>(
      `/questionnaire/${id}`
    );
  }
}

export const questionnaireApi = new QuestionnaireApi();
