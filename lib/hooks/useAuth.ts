"use client";

import { useState, useEffect, useCallback } from "react";
import {
  login as loginApi,
  register as registerApi,
  logout as logoutApi,
  refreshToken as refreshTokenApi,
  setAuthToken,
} from "../api/auth.api";

import type {
  AuthUser,
  LoginRequest,
  RegisterRequest,
} from "../types/auth.types";

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
}

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "user";

/**
 * Pose un cookie de session lisible par le middleware Next.js.
 * Le middleware ne peut pas accéder à localStorage (côté serveur),
 * donc on synchronise l'état d'auth via ce cookie léger.
 *
 * SameSite=Strict + pas de HttpOnly (doit être lisible par le middleware Edge).
 */
function setSessionCookie(value: "1" | "0") {
  if (typeof document === "undefined") return;
  if (value === "1") {
    // Expire dans 7 jours (durée du refresh token)
    const expires = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    ).toUTCString();
    document.cookie = `session_exists=1; path=/; expires=${expires}; SameSite=Strict`;
  } else {
    // Suppression immédiate
    document.cookie = "session_exists=0; path=/; max-age=0; SameSite=Strict";
  }
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    isAuthenticated: false,
  });

  /* ================= INIT (au chargement) ================= */

  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      const user = localStorage.getItem(USER_KEY);

      if (accessToken && user) {
        setAuthToken(accessToken);
        setSessionCookie("1");
        setState({
          user: JSON.parse(user),
          loading: false,
          isAuthenticated: true,
        });
        return;
      }

      // Si access token absent mais refresh présent → tentative refresh
      if (!accessToken && refreshToken) {
        try {
          const data = await refreshTokenApi({ refreshToken });

          localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
          localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
          setAuthToken(data.accessToken);
          setSessionCookie("1");

          setState((prev) => ({
            ...prev,
            loading: false,
            isAuthenticated: true,
          }));
        } catch (error) {
          clearStorage();
          setState({ user: null, loading: false, isAuthenticated: false });
        }
        return;
      }

      setSessionCookie("0");
      setState({ user: null, loading: false, isAuthenticated: false });
    };

    initAuth();
  }, []);

  /* ================= HELPERS ================= */

  const saveSession = (
    user: AuthUser,
    accessToken: string,
    refreshToken: string,
  ) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    setAuthToken(accessToken);
    setSessionCookie("1");

    setState({
      user,
      loading: false,
      isAuthenticated: true,
    });
  };

  const clearStorage = () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setAuthToken(null);
    setSessionCookie("0");
  };

  /* ================= ACTIONS ================= */

  const login = useCallback(async (data: LoginRequest) => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const res = await loginApi(data);
      saveSession(res.user, res.accessToken, res.refreshToken);
      return { success: true, data: res };
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false }));
      return { success: false, error };
    }
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const res = await registerApi(data);
      saveSession(res.user, res.accessToken, res.refreshToken);
      return { success: true, data: res };
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false }));
      return { success: false, error };
    }
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (refreshToken) {
      try {
        await logoutApi({ refreshToken });
      } catch (error) {
        console.error("Logout API error:", error);
      }
    }

    clearStorage();
    setState({ user: null, loading: false, isAuthenticated: false });

    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }, []);

  /* ================= RETURN ================= */

  return {
    user: state.user,
    loading: state.loading,
    isAuthenticated: state.isAuthenticated,
    role: state.user?.permissions ?? null,
    login,
    register,
    logout,
  };
}
