/**
 * =====================================================
 * Hook - Matières
 * =====================================================
 * Hook React pour la gestion des matières
 *
 * @module lib/hooks/useSubjects
 * @version 1.0
 */

"use client";

import { useState, useCallback } from "react";
import { subjectsApi } from "../api";
import type {
  SubjectWithCoefficients,
  CreateSubjectRequest,
  UpdateSubjectRequest,
} from "../types";

export function useSubjects() {
  const [subjects, setSubjects] = useState<SubjectWithCoefficients[]>([]);
  const [currentSubject, setCurrentSubject] =
    useState<SubjectWithCoefficients | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Récupérer toutes les matières
   */
  const fetchSubjects = useCallback(
    async (params?: { page?: number; limit?: number; search?: string }) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await subjectsApi.getAll(params);
        setSubjects(response.subjects);
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
   * Récupérer une matière par ID
   */
  const fetchSubjectById = useCallback(async (subjectId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await subjectsApi.getById(subjectId);
      setCurrentSubject(response.subject);
      return response.subject;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Récupérer les matières d'une série
   */
  const fetchSubjectsBySerie = useCallback(async (serieId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await subjectsApi.getBySerie(serieId);
      setSubjects(response.subjects);
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
   * Créer une matière
   */
  const createSubject = useCallback(async (data: CreateSubjectRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await subjectsApi.create(data);
      setSubjects((prev) => [...prev, response.subject]);
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
   * Mettre à jour une matière
   */
  const updateSubject = useCallback(
    async (subjectId: string, data: UpdateSubjectRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await subjectsApi.update(subjectId, data);
        setSubjects((prev) =>
          prev.map((subject) =>
            subject.id === subjectId ? response.subject : subject
          )
        );
        if (currentSubject?.id === subjectId) {
          setCurrentSubject(response.subject);
        }
        return response;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [currentSubject]
  );

  /**
   * Supprimer une matière
   */
  const deleteSubject = useCallback(
    async (subjectId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await subjectsApi.delete(subjectId);
        setSubjects((prev) =>
          prev.filter((subject) => subject.id !== subjectId)
        );
        if (currentSubject?.id === subjectId) {
          setCurrentSubject(null);
        }
        return response;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [currentSubject]
  );

  /**
   * Exporter les matières
   */
  const exportSubjects = useCallback(
    async (params?: { format?: "csv" | "json" }) => {
      setIsLoading(true);
      setError(null);

      try {
        const blob = await subjectsApi.export(params);
        return blob;
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
    subjects,
    currentSubject,
    isLoading,
    error,
    fetchSubjects,
    fetchSubjectById,
    fetchSubjectsBySerie,
    createSubject,
    updateSubject,
    deleteSubject,
    exportSubjects,
  };
}
