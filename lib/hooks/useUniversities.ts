/**
 * =====================================================
 * Hook - Universités - CORRIGÉ
 * =====================================================
 * Hook React pour la gestion des universités
 *
 * @module lib/hooks/useUniversities
 * @version 1.2
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

// ========== TYPES D'UNION POUR LES RÉPONSES API ==========

// Pour une réponse unique (getById, create, update)
type ApiSingleResponse<T> =
  | { university: T; message?: string; success?: boolean }
  | { data: T; message?: string; success?: boolean }
  | T;

// Pour une réponse multiple (getAll, getSponsors, getByDegree)
type ApiListResponse<T> =
  | {
      universities: T[];
      count?: number;
      totalPages?: number;
      currentPage?: number;
      message?: string;
      success?: boolean;
    }
  | { sponsors: T[]; count?: number; message?: string; success?: boolean }
  | {
      data: T[];
      count?: number;
      totalPages?: number;
      currentPage?: number;
      message?: string;
      success?: boolean;
    }
  | T[];

// Pour les réponses de diplômes
type ApiDegreesResponse =
  | {
      degrees: Degree[];
      count?: number;
      message?: string;
      success?: boolean;
      university?: { id: string; name: string };
    }
  | { data: Degree[]; count?: number; message?: string; success?: boolean }
  | Degree[];

// ========== HOOK PRINCIPAL ==========

export function useUniversities() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [currentUniversity, setCurrentUniversity] = useState<University | null>(
    null,
  );
  const [universityDegrees, setUniversityDegrees] = useState<Degree[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Normalise une université pour s'assurer que degrees est un tableau
   */
  const normalizeUniversity = (university: University): University => {
    return {
      ...university,
      degrees: Array.isArray(university.degrees) ? university.degrees : [],
      // S'assurer que les propriétés optionnelles existent
      location: university.location || undefined,
      website: university.website || university.webSite || undefined,
      webSite: university.webSite || university.website || undefined,
      description: university.description || undefined,
      email: university.email || undefined,
      phone: university.phone || undefined,
      logo: university.logo || undefined,
      ranking: university.ranking || undefined,
      studentCount: university.studentCount || undefined,
      establishedYear: university.establishedYear || undefined,
    };
  };

  /**
   * Normalise un tableau d'universités
   */
  const normalizeUniversities = (items: University[]): University[] => {
    return items.map(normalizeUniversity);
  };

  /**
   * Extrait une université d'une réponse API (format unique)
   */
  const extractSingleUniversity = (response: unknown): University | null => {
    if (!response || typeof response !== "object") return null;

    const resp = response as ApiSingleResponse<University>;

    // Cas 1: { university: {...} }
    if (
      "university" in resp &&
      resp.university &&
      typeof resp.university === "object"
    ) {
      return normalizeUniversity(resp.university);
    }

    // Cas 2: { data: {...} }
    if ("data" in resp && resp.data && typeof resp.data === "object") {
      return normalizeUniversity(resp.data);
    }

    // Cas 3: direct {...}
    if (resp && typeof resp === "object" && "id" in resp) {
      return normalizeUniversity(resp as University);
    }

    return null;
  };

  /**
   * Extrait une liste d'universités d'une réponse API (format multiple)
   */
  const extractListUniversities = (response: unknown): University[] => {
    if (!response) return [];

    // Cas 1: Tableau direct
    if (Array.isArray(response)) {
      return normalizeUniversities(response);
    }

    if (typeof response === "object") {
      const resp = response as ApiListResponse<University>;

      // Cas 2: { universities: [...] }
      if ("universities" in resp && Array.isArray(resp.universities)) {
        return normalizeUniversities(resp.universities);
      }

      // Cas 3: { sponsors: [...] }
      if ("sponsors" in resp && Array.isArray(resp.sponsors)) {
        return normalizeUniversities(resp.sponsors);
      }

      // Cas 4: { data: [...] }
      if ("data" in resp && Array.isArray(resp.data)) {
        return normalizeUniversities(resp.data);
      }
    }

    return [];
  };

  /**
   * Extrait une liste de diplômes d'une réponse API
   */
  const extractDegrees = (response: unknown): Degree[] => {
    if (!response) return [];

    // Cas 1: Tableau direct
    if (Array.isArray(response)) {
      return response;
    }

    if (typeof response === "object") {
      const resp = response as ApiDegreesResponse;

      // Cas 2: { degrees: [...] }
      if ("degrees" in resp && Array.isArray(resp.degrees)) {
        return resp.degrees;
      }

      // Cas 3: { data: [...] }
      if ("data" in resp && Array.isArray(resp.data)) {
        return resp.data;
      }
    }

    return [];
  };

  /**
   * Récupérer toutes les universités
   */
  const fetchUniversities = useCallback(
    async (params?: {
      page?: number;
      limit?: number;
      search?: string;
      sponsorOnly?: boolean;
      isSponsor?: boolean;
    }) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await universitiesApi.getAll(params);
        const universitiesData = extractListUniversities(response);
        setUniversities(universitiesData);
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
   * Récupérer les universités sponsors
   */
  const fetchSponsors = useCallback(
    async (params?: { page?: number; limit?: number }) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await universitiesApi.getSponsors(params);
        const universitiesData = extractListUniversities(response);
        setUniversities(universitiesData);
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
   * Récupérer une université par ID
   */
  const fetchUniversityById = useCallback(async (universityId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await universitiesApi.getById(universityId);
      const universityData = extractSingleUniversity(response);

      if (universityData) {
        setCurrentUniversity(universityData);
      }

      return universityData;
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
      const degreesData = extractDegrees(response);
      setUniversityDegrees(degreesData);
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
      const universitiesData = extractListUniversities(response);
      setUniversities(universitiesData);
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
        const newUniversity = extractSingleUniversity(response);

        if (newUniversity) {
          setUniversities((prev) => [...prev, newUniversity]);
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
    [],
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
        const updatedUniversity = extractSingleUniversity(response);

        if (updatedUniversity) {
          setUniversities((prev) =>
            prev.map((univ) =>
              univ.id === universityId ? updatedUniversity : univ,
            ),
          );

          if (currentUniversity?.id === universityId) {
            setCurrentUniversity(updatedUniversity);
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
    [currentUniversity],
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
          prev.filter((univ) => univ.id !== universityId),
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
    [currentUniversity],
  );

  /**
   * Exporter les universités
   */
  const exportUniversities = useCallback(
    async (params?: { format?: "csv" | "json"; isSponsor?: boolean }) => {
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
    [],
  );

  return {
    universities: universities || [],
    currentUniversity,
    universityDegrees: universityDegrees || [],
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
