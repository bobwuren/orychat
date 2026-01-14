/**
 * =====================================================
 * API Client - Questionnaire
 * =====================================================
 * Client pour les endpoints du questionnaire d'orientation
 * 
 * @module lib/api/questionnaire.api
 * @version 1.0
 */

import { apiClient } from './client';
import type {
  SubmitQuestionnaireRequest,
  SubmitQuestionnaireResponse,
  QuestionnairesListResponse,
  QuestionnaireResponse,
  DeleteQuestionnaireResponse,
} from '../types';

export class QuestionnaireApi {
  private client = apiClient;

  /**
   * Soumettre un questionnaire
   * POST /api/questionnaire/submit
   * Requiert: Bearer token
   */
  async submit(
    data: SubmitQuestionnaireRequest
  ): Promise<SubmitQuestionnaireResponse> {
    return this.client.post<SubmitQuestionnaireResponse>(
      '/api/questionnaire/submit',
      data
    );
  }

  /**
   * Récupérer les questionnaires d'un utilisateur
   * GET /api/questionnaire/user/:userId
   * Requiert: Bearer token (admin ou user lui-même)
   */
  async getUserQuestionnaires(
    userId: string
  ): Promise<QuestionnairesListResponse> {
    return this.client.get<QuestionnairesListResponse>(
      `/api/questionnaire/user/${userId}`
    );
  }

  /**
   * Récupérer le dernier questionnaire d'un utilisateur
   * GET /api/questionnaire/user/:userId/latest
   * Requiert: Bearer token (admin ou user lui-même)
   */
  async getLatestQuestionnaire(userId: string): Promise<QuestionnaireResponse> {
    return this.client.get<QuestionnaireResponse>(
      `/api/questionnaire/user/${userId}/latest`
    );
  }

  /**
   * Récupérer un questionnaire par ID
   * GET /api/questionnaire/:id
   * Requiert: Bearer token (admin ou propriétaire)
   */
  async getById(questionnaireId: string): Promise<QuestionnaireResponse> {
    return this.client.get<QuestionnaireResponse>(
      `/api/questionnaire/${questionnaireId}`
    );
  }

  /**
   * Récupérer tous les questionnaires (Admin uniquement)
   * GET /api/questionnaire/all
   * Requiert: Bearer token + admin
   */
  async getAll(): Promise<QuestionnairesListResponse> {
    return this.client.get<QuestionnairesListResponse>(
      '/api/questionnaire/all'
    );
  }

  /**
   * Supprimer un questionnaire (Admin uniquement)
   * DELETE /api/questionnaire/:id
   * Requiert: Bearer token + admin
   */
  async delete(questionnaireId: string): Promise<DeleteQuestionnaireResponse> {
    return this.client.delete<DeleteQuestionnaireResponse>(
      `/api/questionnaire/${questionnaireId}`
    );
  }
}

// Instance singleton exportée
export const questionnaireApi = new QuestionnaireApi();