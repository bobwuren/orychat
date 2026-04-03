/**
 * Hook - Matières
 * @module lib/hooks/useSubjects
 */

"use client";

import { useState, useCallback } from "react";
import { subjectsApi } from "../api";
import type {
  SubjectWithCoefficients,
  CreateSubjectRequest,
  UpdateSubjectRequest,
} from "../types";

// ========== TYPES D'UNION POUR LES RÉPONSES API ==========

// Pour une réponse unique (getById, create, update)
type ApiSingleResponse<T> =
  | { subject: T; message?: string; success?: boolean }
  | { data: T; message?: string; success?: boolean }
  | T;

// Pour une réponse multiple (getAll, getBySerie)
type ApiListResponse<T> =
  | {
      subjects: T[];
      count?: number;
      totalPages?: number;
      currentPage?: number;
      message?: string;
      success?: boolean;
    }
  | {
      data: T[];
      count?: number;
      totalPages?: number;
      currentPage?: number;
      message?: string;
      success?: boolean;
    }
  | T[];

// ========== HOOK PRINCIPAL ==========

export function useSubjects() {
  const [subjects, setSubjects] = useState<SubjectWithCoefficients[]>([]);
  const [currentSubject, setCurrentSubject] =
    useState<SubjectWithCoefficients | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Extrait un sujet d'une réponse API (format unique).
   * On ne normalise pas seriesCoefficients ici : la page gère
   * les deux formats (tableau ou objet) via normalizeCoefficients.
   */
  const extractSingleSubject = (
    response: unknown,
  ): SubjectWithCoefficients | null => {
    if (!response || typeof response !== "object") return null;

    const resp = response as ApiSingleResponse<SubjectWithCoefficients>;

    if ("subject" in resp && resp.subject && typeof resp.subject === "object") {
      return resp.subject as SubjectWithCoefficients;
    }
    if ("data" in resp && resp.data && typeof resp.data === "object") {
      return resp.data as SubjectWithCoefficients;
    }
    if ("id" in (resp as object)) {
      return resp as SubjectWithCoefficients;
    }

    return null;
  };

  /**
   * Extrait une liste de sujets d'une réponse API (format multiple).
   */
  const extractListSubjects = (
    response: unknown,
  ): SubjectWithCoefficients[] => {
    if (!response) return [];

    if (Array.isArray(response)) return response as SubjectWithCoefficients[];

    if (typeof response === "object") {
      const resp = response as ApiListResponse<SubjectWithCoefficients>;

      if ("subjects" in resp && Array.isArray(resp.subjects)) {
        return resp.subjects;
      }
      if ("data" in resp && Array.isArray(resp.data)) {
        return resp.data;
      }
    }

    return [];
  };

  /**
   * Récupérer toutes les matières
   */
  const fetchSubjects = useCallback(
    async (params?: { page?: number; limit?: number; search?: string }) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await subjectsApi.getAll(params);
        setSubjects(extractListSubjects(response));
        return response;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  /**
   * Récupérer une matière par ID
   */
  const fetchSubjectById = useCallback(async (subjectId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await subjectsApi.getById(subjectId);
      const subjectData = extractSingleSubject(response);
      if (subjectData) setCurrentSubject(subjectData);
      return subjectData;
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
      setSubjects(extractListSubjects(response));
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
      const newSubject = extractSingleSubject(response);
      if (newSubject) setSubjects((prev) => [...prev, newSubject]);
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
        const updatedSubject = extractSingleSubject(response);
        if (updatedSubject) {
          setSubjects((prev) =>
            prev.map((s) => (s.id === subjectId ? updatedSubject : s)),
          );
          if (currentSubject?.id === subjectId)
            setCurrentSubject(updatedSubject);
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
    [currentSubject],
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
        setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
        if (currentSubject?.id === subjectId) setCurrentSubject(null);
        return response;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [currentSubject],
  );

  const exportSubjects = useCallback(
    async (params?: { format?: "csv" | "json" }) => {
      setIsLoading(true);
      setError(null);
      try {
        return await subjectsApi.export(params);
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [],
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
