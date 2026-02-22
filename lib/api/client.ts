/**
 * =====================================================
 * API Client Principal - CORRIGÉ
 * =====================================================
 * Client HTTP de base pour toutes les requêtes API
 * Gère l'authentification, les headers et les erreurs
 *
 * @module lib/api/client
 * @version 1.1
 */

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiFailure {
  success: false;
  error: string;
  code?: string;
  status?: number;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions<B = unknown> {
  body?: B;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
  timeoutMs?: number;
}

export class ApiClient {
  private baseURL: string;
  private accessToken: string | null = null;
  private isDev = process.env.NODE_ENV !== "production";

  constructor(baseURL: string) {
    this.baseURL = baseURL.replace(/\/$/, "");
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  private buildUrl(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>,
  ): string {
    const url = `${this.baseURL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

    if (!params) return url;

    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `${url}?${queryString}` : url;
  }

  private async request<TResponse, TBody = unknown>(
    method: HttpMethod,
    endpoint: string,
    options: RequestOptions<TBody> = {},
  ): Promise<TResponse> {
    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      options.timeoutMs ?? 15000,
    );

    const url = this.buildUrl(endpoint, options.params);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    const config: RequestInit = {
      method,
      headers,
      signal: controller.signal,
    };

    if (options.body !== undefined) {
      config.body = JSON.stringify(options.body);
    }

    try {
      if (this.isDev) {
        console.log(`📤 API ${method}`, { url, body: options.body });
      }

      const response = await fetch(url, config);
      clearTimeout(timeout);

      const text = await response.text();
      const data = text ? safeJsonParse(text) : null;

      if (this.isDev) {
        console.log("📥 API RESPONSE", { url, status: response.status, data });
      }

      if (!response.ok) {
        // Essayer de parser l'erreur
        const errorData = data as any;
        throw new ApiError(
          errorData?.message || errorData?.error || "HTTP Error",
          response.status,
          errorData?.code,
          data,
        );
      }

      // Si la réponse a déjà une structure { success, data }, extraire data
      if (
        data &&
        typeof data === "object" &&
        "success" in data &&
        "data" in data
      ) {
        return (data as ApiSuccess<TResponse>).data;
      }

      // Sinon, retourner directement les données
      return data as TResponse;
    } catch (error) {
      clearTimeout(timeout);

      if (this.isDev) {
        console.error("💥 API ERROR", error);
      }

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof DOMException && error.name === "AbortError") {
        throw new ApiError("Request timeout", 408, "TIMEOUT");
      }

      throw new ApiError("Network error", 0, "NETWORK_ERROR");
    }
  }

  // ========= HTTP METHODS =========

  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>,
    headers?: Record<string, string>,
  ): Promise<T> {
    return this.request<T>("GET", endpoint, { params, headers });
  }

  async post<T, B = unknown>(
    endpoint: string,
    body: B,
    headers?: Record<string, string>,
  ): Promise<T> {
    return this.request<T, B>("POST", endpoint, { body, headers });
  }

  async put<T, B = unknown>(
    endpoint: string,
    body: B,
    headers?: Record<string, string>,
  ): Promise<T> {
    return this.request<T, B>("PUT", endpoint, { body, headers });
  }

  async patch<T, B = unknown>(
    endpoint: string,
    body: B,
    headers?: Record<string, string>,
  ): Promise<T> {
    return this.request<T, B>("PATCH", endpoint, { body, headers });
  }

  async delete<T>(
    endpoint: string,
    headers?: Record<string, string>,
  ): Promise<T> {
    return this.request<T>("DELETE", endpoint, { headers });
  }

  async download(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>,
    filename?: string,
  ): Promise<Blob> {
    const url = this.buildUrl(endpoint, params);
    const headers: Record<string, string> = {};

    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new ApiError("Download failed", response.status);
    }

    const blob = await response.blob();

    if (filename && typeof window !== "undefined") {
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    }

    return blob;
  }
}

/* ================= Helpers ================= */

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// Instance singleton avec l'URL de base
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
export const apiClient = new ApiClient(API_BASE_URL);
