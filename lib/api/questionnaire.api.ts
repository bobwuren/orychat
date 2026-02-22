/**
 * =====================================================
 * API Client - Questionnaire - CORRIGÉ
 * =====================================================
 * Client pour les endpoints du questionnaire d'orientation
 *
 * @module lib/api/questionnaire.api
 * @version 1.1
 */

import { apiClient } from "./client";
import type {
  SubmitQuestionnaireRequest,
  SubmitQuestionnaireResponse,
  QuestionnairesListResponse,
  QuestionnaireResponse,
  DeleteQuestionnaireResponse,
} from "../types";

export class QuestionnaireApi {
  private client = apiClient;

  /**
   * Soumettre un questionnaire
   * POST /api/questionnaire/submit
   */
  async submit(
    data: SubmitQuestionnaireRequest,
  ): Promise<SubmitQuestionnaireResponse> {
    return this.client.post<
      SubmitQuestionnaireResponse,
      SubmitQuestionnaireRequest
    >("/questionnaire/submit", data);
  }

  /**
   * Récupérer les questionnaires d'un utilisateur
   * GET /api/questionnaire/user/:userId
   */
  async getUserQuestionnaires(
    userId: string,
  ): Promise<QuestionnairesListResponse> {
    return this.client.get<QuestionnairesListResponse>(
      `/questionnaire/user/${userId}`,
    );
  }

  /**
   * Récupérer le dernier questionnaire d'un utilisateur
   * GET /api/questionnaire/user/:userId/latest
   */
  async getLatestQuestionnaire(userId: string): Promise<QuestionnaireResponse> {
    return this.client.get<QuestionnaireResponse>(
      `/questionnaire/user/${userId}/latest`,
    );
  }

  /**
   * Récupérer un questionnaire par ID
   * GET /api/questionnaire/:id
   */
  async getById(questionnaireId: string): Promise<QuestionnaireResponse> {
    return this.client.get<QuestionnaireResponse>(
      `/questionnaire/${questionnaireId}`,
    );
  }

  /**
   * Récupérer tous les questionnaires (Admin uniquement)
   * GET /api/questionnaire/all
   */
  async getAll(params?: {
    page?: number;
    limit?: number;
  }): Promise<QuestionnairesListResponse> {
    return this.client.get<QuestionnairesListResponse>(
      "/questionnaire/all",
      params,
    );
  }

  /**
   * Supprimer un questionnaire (Admin uniquement)
   * DELETE /api/questionnaire/:id
   */
  async delete(questionnaireId: string): Promise<DeleteQuestionnaireResponse> {
    return this.client.delete<DeleteQuestionnaireResponse>(
      `/questionnaire/${questionnaireId}`,
    );
  }
}

// Instance singleton exportée
export const questionnaireApi = new QuestionnaireApi();
