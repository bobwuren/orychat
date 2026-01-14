/**
 * =====================================================
 * Hook - Recommandations
 * =====================================================
 * Hook React pour la gestion des recommandations
 *
 * @module lib/hooks/useRecommendations
 * @version 1.0
 */

"use client";

import { useState, useCallback } from "react";
import { recommendationsApi } from "../api";
import type {
  Recommendation,
  GenerateRecommendationRequest,
  SaveRecommendationRequest,
} from "../types";

export function useRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [currentRecommendation, setCurrentRecommendation] =
    useState<Recommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Générer une recommandation avec IA
   */
  const generateRecommendation = useCallback(
    async (data: GenerateRecommendationRequest) => {
      setIsGenerating(true);
      setError(null);

      try {
        const response = await recommendationsApi.generate(data);
        setCurrentRecommendation(response.recommendation);
        // Ajouter à la liste
        setRecommendations((prev) => [response.recommendation, ...prev]);
        return response;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  /**
   * Sauvegarder une recommandation manuelle
   */
  const saveRecommendation = useCallback(
    async (data: SaveRecommendationRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await recommendationsApi.save(data);
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
   * Récupérer l'historique des recommandations de l'utilisateur
   */
  const fetchUserRecommendations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await recommendationsApi.getUserRecommendations();
      setRecommendations(response.recommendations || []);
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
   * Récupérer toutes les recommandations (Admin)
   */
  const fetchAllRecommendations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await recommendationsApi.getAll();
      setRecommendations(response.recommendations || []);
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
   * Récupérer une recommandation par ID
   */
  const fetchRecommendationById = useCallback(
    async (recommendationId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await recommendationsApi.getById(recommendationId);
        setCurrentRecommendation(response.recommendation);
        return response.recommendation;
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
   * Exporter les recommandations
   */
  const exportRecommendations = useCallback(
    async (params?: { format?: "csv" | "json" }) => {
      setIsLoading(true);
      setError(null);

      try {
        const blob = await recommendationsApi.export(params);
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
    recommendations,
    currentRecommendation,
    isLoading,
    isGenerating,
    error,
    generateRecommendation,
    saveRecommendation,
    fetchUserRecommendations,
    fetchAllRecommendations,
    fetchRecommendationById,
    exportRecommendations,
  };
}
