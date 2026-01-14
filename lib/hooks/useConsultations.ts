/**
 * =====================================================
 * Hook - Consultations & Questionnaire
 * =====================================================
 * Hook React pour la gestion des consultations
 *
 * @module lib/hooks/useConsultations
 * @version 1.0
 */

"use client";

import { useState, useCallback } from "react";
import { consultationsApi, questionnaireApi } from "../api";
import type {
  Consultation,
  ConsultationFullDetails,
  Questionnaire,
  SubmitQuestionnaireRequest,
  RequestConsultationRequest,
  AssignCounselorRequest,
  UpdateConsultationStatusRequest,
  ConsultationStatus,
} from "../types";

export function useConsultations() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [currentConsultation, setCurrentConsultation] =
    useState<ConsultationFullDetails | null>(null);
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [currentQuestionnaire, setCurrentQuestionnaire] =
    useState<Questionnaire | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // ========== QUESTIONNAIRE ==========

  /**
   * Soumettre un questionnaire
   */
  const submitQuestionnaire = useCallback(
    async (data: SubmitQuestionnaireRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await questionnaireApi.submit(data);
        return response;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Récupérer les questionnaires d'un utilisateur
   */
  const fetchUserQuestionnaires = useCallback(async (userId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await questionnaireApi.getUserQuestionnaires(userId);
      setQuestionnaires(response.questionnaires);
      return response;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Récupérer le dernier questionnaire d'un utilisateur
   */
  const fetchLatestQuestionnaire = useCallback(async (userId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await questionnaireApi.getLatestQuestionnaire(userId);
      setCurrentQuestionnaire(response.questionnaire);
      return response.questionnaire;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ========== CONSULTATIONS ==========

  /**
   * Demander une consultation
   */
  const requestConsultation = useCallback(
    async (data: RequestConsultationRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await consultationsApi.request(data);
        return response;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Récupérer toutes les consultations (Admin)
   */
  const fetchAllConsultations = useCallback(
    async (params?: { status?: ConsultationStatus; counselorId?: string }) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await consultationsApi.getAll(params);
        setConsultations(response.consultations);
        return response;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Récupérer les statistiques (Admin)
   */
  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await consultationsApi.getStats();
      setStats(response.stats);
      return response;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Récupérer l'historique des consultations d'un utilisateur
   */
  const fetchUserConsultations = useCallback(async (userId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await consultationsApi.getUserConsultations(userId);
      setConsultations(response.consultations);
      return response;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Récupérer les détails d'une consultation
   */
  const fetchConsultationById = useCallback(async (consultationId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await consultationsApi.getById(consultationId);
      setCurrentConsultation(response.consultation);
      return response.consultation;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Assigner un conseiller
   */
  const assignCounselor = useCallback(
    async (consultationId: string, data: AssignCounselorRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await consultationsApi.assignCounselor(
          consultationId,
          data
        );
        // Mettre à jour dans la liste
        setConsultations((prev) =>
          prev.map((c) => (c.id === consultationId ? response.consultation : c))
        );
        return response;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Mettre à jour le statut
   */
  const updateStatus = useCallback(
    async (consultationId: string, data: UpdateConsultationStatusRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await consultationsApi.updateStatus(
          consultationId,
          data
        );
        // Mettre à jour dans la liste
        setConsultations((prev) =>
          prev.map((c) => (c.id === consultationId ? response.consultation : c))
        );
        return response;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    // State
    consultations,
    currentConsultation,
    questionnaires,
    currentQuestionnaire,
    stats,
    isLoading,
    error,

    // Questionnaire
    submitQuestionnaire,
    fetchUserQuestionnaires,
    fetchLatestQuestionnaire,

    // Consultations
    requestConsultation,
    fetchAllConsultations,
    fetchStats,
    fetchUserConsultations,
    fetchConsultationById,
    assignCounselor,
    updateStatus,
  };
}
