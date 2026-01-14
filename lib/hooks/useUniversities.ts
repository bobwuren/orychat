/**
 * =====================================================
 * Hook - Universités
 * =====================================================
 * Hook React pour la gestion des universités
 *
 * @module lib/hooks/useUniversities
 * @version 1.0
 */

"use client";

import { useState, useCallback } from "react";
import { universitiesApi } from "../api";
import type {
  University,
  Degree,
  CreateUniversityRequest,
  UpdateUniversityRequest,
} from "../types";

export function useUniversities() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [currentUniversity, setCurrentUniversity] = useState<University | null>(
    null
  );
  const [universityDegrees, setUniversityDegrees] = useState<Degree[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Récupérer toutes les universités
   */
  const fetchUniversities = useCallback(
    async (params?: {
      page?: number;
      limit?: number;
      search?: string;
      sponsorOnly?: boolean;
    }) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await universitiesApi.getAll(params);
        setUniversities(response.universities);
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
   * Récupérer les universités sponsors
   */
  const fetchSponsors = useCallback(
    async (params?: { page?: number; limit?: number }) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await universitiesApi.getSponsors(params);
        setUniversities(response.sponsors);
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
   * Récupérer une université par ID
   */
  const fetchUniversityById = useCallback(async (universityId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await universitiesApi.getById(universityId);
      setCurrentUniversity(response.university);
      return response.university;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Récupérer les diplômes d'une université
   */
  const fetchUniversityDegrees = useCallback(async (universityId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await universitiesApi.getDegrees(universityId);
      setUniversityDegrees(response.degrees);
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
   * Récupérer les universités proposant un diplôme
   */
  const fetchUniversitiesByDegree = useCallback(async (degreeId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await universitiesApi.getByDegree(degreeId);
      setUniversities(response.universities);
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
   * Créer une université
   */
  const createUniversity = useCallback(
    async (data: CreateUniversityRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await universitiesApi.create(data);
        setUniversities((prev) => [...prev, response.university]);
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
   * Mettre à jour une université
   */
  const updateUniversity = useCallback(
    async (universityId: string, data: UpdateUniversityRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await universitiesApi.update(universityId, data);
        setUniversities((prev) =>
          prev.map((univ) =>
            univ.id === universityId ? response.university : univ
          )
        );
        if (currentUniversity?.id === universityId) {
          setCurrentUniversity(response.university);
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
    [currentUniversity]
  );

  /**
   * Supprimer une université
   */
  const deleteUniversity = useCallback(
    async (universityId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await universitiesApi.delete(universityId);
        setUniversities((prev) =>
          prev.filter((univ) => univ.id !== universityId)
        );
        if (currentUniversity?.id === universityId) {
          setCurrentUniversity(null);
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
    [currentUniversity]
  );

  /**
   * Exporter les universités
   */
  const exportUniversities = useCallback(
    async (params?: { format?: "csv" | "json" }) => {
      setIsLoading(true);
      setError(null);

      try {
        const blob = await universitiesApi.export(params);
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
    universities,
    currentUniversity,
    universityDegrees,
    isLoading,
    error,
    fetchUniversities,
    fetchSponsors,
    fetchUniversityById,
    fetchUniversityDegrees,
    fetchUniversitiesByDegree,
    createUniversity,
    updateUniversity,
    deleteUniversity,
    exportUniversities,
  };
}
