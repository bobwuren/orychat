/**
 * =====================================================
 * Hook - Matières - CORRIGÉ
 * =====================================================
 * Hook React pour la gestion des matières
 *
 * @module lib/hooks/useSubjects
 * @version 1.2
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
   * Normalise un objet SubjectWithCoefficients pour s'assurer que seriesCoefficients est un tableau
   */
  const normalizeSubject = (
    subject: SubjectWithCoefficients,
  ): SubjectWithCoefficients => {
    return {
      ...subject,
      seriesCoefficients: Array.isArray(subject.seriesCoefficients)
        ? subject.seriesCoefficients
        : subject.seriesCoefficients
          ? [subject.seriesCoefficients as any]
          : [],
    };
  };

  /**
   * Normalise un tableau de sujets
   */
  const normalizeSubjects = (
    items: SubjectWithCoefficients[],
  ): SubjectWithCoefficients[] => {
    return items.map(normalizeSubject);
  };

  /**
   * Extrait un sujet d'une réponse API (format unique)
   */
  const extractSingleSubject = (
    response: unknown,
  ): SubjectWithCoefficients | null => {
    if (!response || typeof response !== "object") return null;

    const resp = response as ApiSingleResponse<SubjectWithCoefficients>;

    // Cas 1: { subject: {...} }
    if ("subject" in resp && resp.subject && typeof resp.subject === "object") {
      return normalizeSubject(resp.subject);
    }

    // Cas 2: { data: {...} }
    if ("data" in resp && resp.data && typeof resp.data === "object") {
      return normalizeSubject(resp.data);
    }

    // Cas 3: direct {...}
    if (resp && typeof resp === "object" && "id" in resp) {
      return normalizeSubject(resp as SubjectWithCoefficients);
    }

    return null;
  };

  /**
   * Extrait une liste de sujets d'une réponse API (format multiple)
   */
  const extractListSubjects = (
    response: unknown,
  ): SubjectWithCoefficients[] => {
    if (!response) return [];

    // Cas 1: Tableau direct
    if (Array.isArray(response)) {
      return normalizeSubjects(response);
    }

    if (typeof response === "object") {
      const resp = response as ApiListResponse<SubjectWithCoefficients>;

      // Cas 2: { subjects: [...] }
      if ("subjects" in resp && Array.isArray(resp.subjects)) {
        return normalizeSubjects(resp.subjects);
      }

      // Cas 3: { data: [...] }
      if ("data" in resp && Array.isArray(resp.data)) {
        return normalizeSubjects(resp.data);
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
        const subjectsData = extractListSubjects(response);
        setSubjects(subjectsData);
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

      if (subjectData) {
        setCurrentSubject(subjectData);
      }

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
      const subjectsData = extractListSubjects(response);
      setSubjects(subjectsData);
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

      if (newSubject) {
        setSubjects((prev) => [...prev, newSubject]);
      }

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
            prev.map((subject) =>
              subject.id === subjectId ? updatedSubject : subject,
            ),
          );

          if (currentSubject?.id === subjectId) {
            setCurrentSubject(updatedSubject);
          }
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
        setSubjects((prev) =>
          prev.filter((subject) => subject.id !== subjectId),
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
    [currentSubject],
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
