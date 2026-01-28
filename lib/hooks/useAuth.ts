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
        setState({
          user: JSON.parse(user),
          loading: false,
          isAuthenticated: true,
        });
        return;
      }

      // Si access token absent mais refresh présent → tentative refresh
      if (!accessToken && refreshToken) {
        const res = await refreshTokenApi({ refreshToken });

        if (res.success) {
          localStorage.setItem(ACCESS_TOKEN_KEY, res.data.accessToken);
          localStorage.setItem(REFRESH_TOKEN_KEY, res.data.refreshToken);
          setAuthToken(res.data.accessToken);

          setState(prev => ({
            ...prev,
            loading: false,
            isAuthenticated: true,
          }));
        } else {
          clearStorage();
          setState({ user: null, loading: false, isAuthenticated: false });
        }
        return;
      }

      setState({ user: null, loading: false, isAuthenticated: false });
    };

    initAuth();
  }, []);

  /* ================= HELPERS ================= */

  const saveSession = (user: AuthUser, accessToken: string, refreshToken: string) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    setAuthToken(accessToken);

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
  };

  /* ================= ACTIONS ================= */

  const login = useCallback(async (data: LoginRequest) => {
    setState(prev => ({ ...prev, loading: true }));

    const res = await loginApi(data);

    if (res.success) {
      saveSession(res.data.user, res.data.accessToken, res.data.refreshToken);
    } else {
      setState(prev => ({ ...prev, loading: false }));
    }

    return res;
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    setState(prev => ({ ...prev, loading: true }));

    const res = await registerApi(data);

    if (res.success) {
      saveSession(res.data.user, res.data.accessToken, res.data.refreshToken);
    } else {
      setState(prev => ({ ...prev, loading: false }));
    }

    return res;
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (refreshToken) {
      await logoutApi({ refreshToken });
    }

    clearStorage();
    setState({ user: null, loading: false, isAuthenticated: false });

    // redirection safe côté client
    window.location.href = "/login";
  }, []);

  /* ================= RETURN ================= */

  return {
  ...state,
  role: state.user?.permissions ?? null,
  login,
  register,
  logout,
};

}
