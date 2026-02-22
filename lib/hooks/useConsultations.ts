/**
 * =====================================================
 * Hook - Consultations & Questionnaire - CORRIGÉ
 * =====================================================
 * Hook React pour la gestion des consultations
 *
 * @module lib/hooks/useConsultations
 * @version 1.1
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
  const [error, setError] = useState<string | null>(null);

  // ========== QUESTIONNAIRE ==========

  const submitQuestionnaire = useCallback(
    async (data: SubmitQuestionnaireRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await questionnaireApi.submit(data);
        return response;
      } catch (err: any) {
        const errorMessage =
          err.message || "Erreur lors de la soumission du questionnaire";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const fetchUserQuestionnaires = useCallback(async (userId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await questionnaireApi.getUserQuestionnaires(userId);
      setQuestionnaires(response.questionnaires || []);
      return response;
    } catch (err: any) {
      const errorMessage =
        err.message || "Erreur lors du chargement des questionnaires";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchLatestQuestionnaire = useCallback(async (userId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await questionnaireApi.getLatestQuestionnaire(userId);
      setCurrentQuestionnaire(response.questionnaire);
      return response.questionnaire;
    } catch (err: any) {
      const errorMessage =
        err.message || "Erreur lors du chargement du questionnaire";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ========== CONSULTATIONS ==========

  const requestConsultation = useCallback(
    async (data: RequestConsultationRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await consultationsApi.request(data);
        return response;
      } catch (err: any) {
        const errorMessage =
          err.message || "Erreur lors de la demande de consultation";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const fetchAllConsultations = useCallback(
    async (params?: {
      status?: ConsultationStatus;
      counselorId?: string;
      page?: number;
      limit?: number;
    }) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await consultationsApi.getAll(params);
        setConsultations(response.consultations || []);
        return response;
      } catch (err: any) {
        const errorMessage =
          err.message || "Erreur lors du chargement des consultations";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await consultationsApi.getStats();
      setStats(response.stats);
      return response;
    } catch (err: any) {
      const errorMessage =
        err.message || "Erreur lors du chargement des statistiques";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchUserConsultations = useCallback(async (userId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await consultationsApi.getUserConsultations(userId);
      setConsultations(response.consultations || []);
      return response;
    } catch (err: any) {
      const errorMessage =
        err.message || "Erreur lors du chargement de l'historique";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchConsultationById = useCallback(async (consultationId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await consultationsApi.getById(consultationId);
      setCurrentConsultation(response.consultation);
      return response.consultation;
    } catch (err: any) {
      const errorMessage =
        err.message || "Erreur lors du chargement de la consultation";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const assignCounselor = useCallback(
    async (consultationId: string, data: AssignCounselorRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await consultationsApi.assignCounselor(
          consultationId,
          data,
        );
        // Mettre à jour dans la liste
        setConsultations((prev) =>
          prev.map((c) =>
            c.id === consultationId ? response.consultation : c,
          ),
        );
        return response;
      } catch (err: any) {
        const errorMessage = err.message || "Erreur lors de l'assignation";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const updateStatus = useCallback(
    async (consultationId: string, data: UpdateConsultationStatusRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await consultationsApi.updateStatus(
          consultationId,
          data,
        );
        // Mettre à jour dans la liste
        setConsultations((prev) =>
          prev.map((c) =>
            c.id === consultationId ? response.consultation : c,
          ),
        );
        return response;
      } catch (err: any) {
        const errorMessage =
          err.message || "Erreur lors de la mise à jour du statut";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
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
