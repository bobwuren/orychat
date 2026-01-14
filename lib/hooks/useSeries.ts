/**
 * =====================================================
 * Hook - Séries
 * =====================================================
 * Hook React pour la gestion des séries
 *
 * @module lib/hooks/useSeries
 * @version 1.0
 */

"use client";

import { useState, useCallback } from "react";
import { seriesApi } from "../api";
import type { Serie, CreateSerieRequest, UpdateSerieRequest } from "../types";

export function useSeries() {
  const [series, setSeries] = useState<Serie[]>([]);
  const [currentSerie, setCurrentSerie] = useState<Serie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Récupérer toutes les séries
   */
  const fetchSeries = useCallback(
    async (params?: { page?: number; limit?: number; search?: string }) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await seriesApi.getAll(params);
        setSeries(response.series);
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
   * Récupérer une série par ID
   */
  const fetchSerieById = useCallback(
    async (serieId: string, params?: { includeStats?: boolean }) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await seriesApi.getById(serieId, params);
        setCurrentSerie(response.serie);
        return response.serie;
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
   * Créer une série
   */
  const createSerie = useCallback(async (data: CreateSerieRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await seriesApi.create(data);
      // Ajouter la nouvelle série à la liste
      setSeries((prev) => [...prev, response.serie]);
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
   * Mettre à jour une série
   */
  const updateSerie = useCallback(
    async (serieId: string, data: UpdateSerieRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await seriesApi.update(serieId, data);
        // Mettre à jour la série dans la liste
        setSeries((prev) =>
          prev.map((serie) => (serie.id === serieId ? response.serie : serie))
        );
        if (currentSerie?.id === serieId) {
          setCurrentSerie(response.serie);
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
    [currentSerie]
  );

  /**
   * Supprimer une série
   */
  const deleteSerie = useCallback(
    async (
      serieId: string,
      params?: { force?: boolean; cascade?: boolean }
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await seriesApi.delete(serieId, params);
        // Retirer la série de la liste
        setSeries((prev) => prev.filter((serie) => serie.id !== serieId));
        if (currentSerie?.id === serieId) {
          setCurrentSerie(null);
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
    [currentSerie]
  );

  /**
   * Exporter les séries
   */
  const exportSeries = useCallback(
    async (params: {
      format: "csv" | "json";
      includeSubjects?: boolean;
      dateRange?: string;
    }) => {
      setIsLoading(true);
      setError(null);

      try {
        const blob = await seriesApi.export(params);
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
    series,
    currentSerie,
    isLoading,
    error,
    fetchSeries,
    fetchSerieById,
    createSerie,
    updateSerie,
    deleteSerie,
    exportSeries,
  };
}
