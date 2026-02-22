/**
 * =====================================================
 * Hook - Diplômes
 * =====================================================
 * Hook React pour la gestion des diplômes
 *
 * @module lib/hooks/useDegrees
 * @version 1.0
 */

"use client";

import { useState, useCallback } from "react";
import { degreesApi } from "../api";
import type {
  Degree,
  CreateDegreeRequest,
  UpdateDegreeRequest,
} from "../types";

// ========== TYPES D'UNION POUR LES RÉPONSES API ==========

// Pour une réponse unique (getById, create, update)
type ApiSingleResponse<T> =
  | { degree: T; message?: string; success?: boolean }
  | { data: T; message?: string; success?: boolean }
  | T;

// Pour une réponse multiple (getAll)
type ApiListResponse<T> =
  | { degrees: T[]; count?: number; message?: string; success?: boolean }
  | { data: T[]; count?: number; message?: string; success?: boolean }
  | T[];

// ========== HOOK PRINCIPAL ==========

export function useDegrees() {
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const [currentDegree, setCurrentDegree] = useState<Degree | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Normalise un diplôme
   */
  const normalizeDegree = (degree: Degree): Degree => {
    return {
      id: degree.id,
      name: degree.name || "",
      description: degree.description || undefined,
      level: degree.level || undefined,
      duration: degree.duration || undefined,
      createdAt: degree.createdAt || undefined,
      updatedAt: degree.updatedAt || undefined,
    };
  };

  /**
   * Normalise un tableau de diplômes
   */
  const normalizeDegrees = (items: Degree[]): Degree[] => {
    return items.map(normalizeDegree);
  };

  /**
   * Extrait un diplôme d'une réponse API (format unique)
   */
  const extractSingleDegree = (response: unknown): Degree | null => {
    if (!response || typeof response !== "object") return null;

    const resp = response as ApiSingleResponse<Degree>;

    // Cas 1: { degree: {...} }
    if ("degree" in resp && resp.degree && typeof resp.degree === "object") {
      return normalizeDegree(resp.degree);
    }

    // Cas 2: { data: {...} }
    if ("data" in resp && resp.data && typeof resp.data === "object") {
      return normalizeDegree(resp.data);
    }

    // Cas 3: direct {...}
    if (resp && typeof resp === "object" && "id" in resp && "name" in resp) {
      return normalizeDegree(resp as Degree);
    }

    return null;
  };

  /**
   * Extrait une liste de diplômes d'une réponse API (format multiple)
   */
  const extractListDegrees = (response: unknown): Degree[] => {
    if (!response) return [];

    // Cas 1: Tableau direct
    if (Array.isArray(response)) {
      return normalizeDegrees(response);
    }

    if (typeof response === "object") {
      const resp = response as ApiListResponse<Degree>;

      // Cas 2: { degrees: [...] }
      if ("degrees" in resp && Array.isArray(resp.degrees)) {
        return normalizeDegrees(resp.degrees);
      }

      // Cas 3: { data: [...] }
      if ("data" in resp && Array.isArray(resp.data)) {
        return normalizeDegrees(resp.data);
      }
    }

    return [];
  };

  /**
   * Récupérer tous les diplômes
   */
  const fetchDegrees = useCallback(
    async (params?: {
      page?: number;
      limit?: number;
      search?: string;
      universityId?: string;
    }) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await degreesApi.getAll(params);
        const degreesData = extractListDegrees(response);
        setDegrees(degreesData);
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
   * Récupérer un diplôme par ID
   */
  const fetchDegreeById = useCallback(async (degreeId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await degreesApi.getById(degreeId);
      const degreeData = extractSingleDegree(response);

      if (degreeData) {
        setCurrentDegree(degreeData);
      }

      return degreeData;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Créer un diplôme
   */
  const createDegree = useCallback(async (data: CreateDegreeRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await degreesApi.create(data);
      const newDegree = extractSingleDegree(response);

      if (newDegree) {
        setDegrees((prev) => [...prev, newDegree]);
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
   * Mettre à jour un diplôme
   */
  const updateDegree = useCallback(
    async (degreeId: string, data: UpdateDegreeRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await degreesApi.update(degreeId, data);
        const updatedDegree = extractSingleDegree(response);

        if (updatedDegree) {
          setDegrees((prev) =>
            prev.map((degree) =>
              degree.id === degreeId ? updatedDegree : degree,
            ),
          );

          if (currentDegree?.id === degreeId) {
            setCurrentDegree(updatedDegree);
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
    [currentDegree],
  );

  /**
   * Supprimer un diplôme
   */
  const deleteDegree = useCallback(
    async (degreeId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await degreesApi.delete(degreeId);
        setDegrees((prev) => prev.filter((degree) => degree.id !== degreeId));
        if (currentDegree?.id === degreeId) {
          setCurrentDegree(null);
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
    [currentDegree],
  );

  /**
   * Exporter les diplômes
   */
  const exportDegrees = useCallback(
    async (params?: { format?: "csv" | "json" }) => {
      setIsLoading(true);
      setError(null);

      try {
        const blob = await degreesApi.export(params);
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
    degrees: degrees || [],
    currentDegree,
    isLoading,
    error,
    fetchDegrees,
    fetchDegreeById,
    createDegree,
    updateDegree,
    deleteDegree,
    exportDegrees,
  };
}
