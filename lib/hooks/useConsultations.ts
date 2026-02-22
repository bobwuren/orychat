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
        return await questionnaireApi.submit(data);
      } catch (err: any) {
        setError(
          err.message || "Erreur lors de la soumission du questionnaire",
        );
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
      setError(err.message || "Erreur lors du chargement des questionnaires");
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
      setError(err.message || "Erreur lors du chargement du questionnaire");
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
        return await consultationsApi.request(data);
      } catch (err: any) {
        setError(err.message || "Erreur lors de la demande de consultation");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // Admin — filtrables par status et counselorId uniquement
  const fetchAllConsultations = useCallback(
    async (params?: { status?: ConsultationStatus; counselorId?: string }) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await consultationsApi.getAll(params);
        setConsultations(response.consultations || []);
        return response;
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement des consultations");
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
      setError(err.message || "Erreur lors du chargement des statistiques");
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
      setError(err.message || "Erreur lors du chargement de l'historique");
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
      setError(err.message || "Erreur lors du chargement de la consultation");
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
        setConsultations((prev) =>
          prev.map((c) =>
            c.id === consultationId ? response.consultation : c,
          ),
        );
        return response;
      } catch (err: any) {
        setError(err.message || "Erreur lors de l'assignation");
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
        setConsultations((prev) =>
          prev.map((c) =>
            c.id === consultationId ? response.consultation : c,
          ),
        );
        return response;
      } catch (err: any) {
        setError(err.message || "Erreur lors de la mise à jour du statut");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    consultations,
    currentConsultation,
    questionnaires,
    currentQuestionnaire,
    stats,
    isLoading,
    error,
    submitQuestionnaire,
    fetchUserQuestionnaires,
    fetchLatestQuestionnaire,
    requestConsultation,
    fetchAllConsultations,
    fetchStats,
    fetchUserConsultations,
    fetchConsultationById,
    assignCounselor,
    updateStatus,
  };
}
