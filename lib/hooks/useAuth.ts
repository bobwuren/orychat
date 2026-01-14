/**
 * =====================================================
 * Hook - Authentification
 * =====================================================
 * Hook React pour la gestion de l'authentification
 *
 * @module lib/hooks/useAuth
 * @version 1.0
 */

"use client";

import { useState, useCallback } from "react";
import { authApi, apiClient } from "../api";
import type { User, LoginRequest, RegisterRequest, AuthState } from "../types";

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
  });

  /**
   * Connexion
   */
  const login = useCallback(async (credentials: LoginRequest) => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await authApi.login(credentials);

      // Mettre à jour les tokens dans le client API
      apiClient.setTokens(response.accessToken, response.refreshToken);

      setState({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });

      // Stocker en localStorage (optionnel)
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  /**
   * Inscription
   */
  const register = useCallback(async (data: RegisterRequest) => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await authApi.register(data);

      // Mettre à jour les tokens dans le client API
      apiClient.setTokens(response.accessToken, response.refreshToken);

      setState({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });

      // Stocker en localStorage (optionnel)
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  /**
   * Déconnexion
   */
  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      if (state.refreshToken) {
        await authApi.logout({ refreshToken: state.refreshToken });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Nettoyer l'état et le localStorage
      apiClient.clearTokens();
      setState({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      });

      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      }
    }
  }, [state.refreshToken]);

  /**
   * Rafraîchir le token
   */
  const refreshToken = useCallback(async () => {
    if (!state.refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await authApi.refreshToken({
        refreshToken: state.refreshToken,
      });

      // Mettre à jour les tokens
      apiClient.setTokens(response.accessToken, response.refreshToken);

      setState((prev) => ({
        ...prev,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        user: response.user || prev.user,
      }));

      // Mettre à jour le localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);
        if (response.user) {
          localStorage.setItem("user", JSON.stringify(response.user));
        }
      }

      return response;
    } catch (error) {
      // En cas d'erreur, déconnecter l'utilisateur
      await logout();
      throw error;
    }
  }, [state.refreshToken, logout]);

  /**
   * Restaurer la session depuis le localStorage
   */
  const restoreSession = useCallback(() => {
    if (typeof window === "undefined") return;

    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const userStr = localStorage.getItem("user");

    if (accessToken && refreshToken && userStr) {
      try {
        const user: User = JSON.parse(userStr);
        apiClient.setTokens(accessToken, refreshToken);

        setState({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error("Failed to restore session:", error);
      }
    }
  }, []);

  return {
    ...state,
    login,
    register,
    logout,
    refreshToken,
    restoreSession,
  };
}
