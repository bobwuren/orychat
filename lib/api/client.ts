/**
 * =====================================================
 * API Client Principal
 * =====================================================
 * Client HTTP de base pour toutes les requêtes API
 * Gère l'authentification, les headers et les erreurs
 *
 * @module lib/api/client
 * @version 1.0
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
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions<B = unknown> {
  body?: B;
  headers?: Record<string, string>;
  timeoutMs?: number;
}

export class ApiClient {
  private baseURL: string;
  private accessToken: string | null = null;

  private isDev = process.env.NODE_ENV !== "production";

  constructor(baseURL: string) {
    this.baseURL = baseURL.replace(/\/$/, ""); // enlève slash final
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  private async request<TResponse, TBody = unknown>(
    method: HttpMethod,
    endpoint: string,
    options: RequestOptions<TBody> = {}
  ): Promise<ApiResponse<TResponse>> {
    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      options.timeoutMs ?? 15000
    );

    const url = `${this.baseURL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

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
        console.log("📤 API REQUEST", {
          method,
          url,
          body: options.body,
        });
      }

      const response = await fetch(url, config);
      clearTimeout(timeout);

      const text = await response.text();
      const data = text ? safeJsonParse(text) : null;

      if (this.isDev) {
        console.log("📥 API RESPONSE", {
          url,
          status: response.status,
          data,
        });
      }

      if (!response.ok) {
        throw new ApiError(
          (data as any)?.message || "HTTP Error",
          response.status,
          (data as any)?.code,
          data
        );
      }

      return {
        success: true,
        data: data as TResponse,
      };
    } catch (error) {
      clearTimeout(timeout);

      if (this.isDev) {
        console.error("💥 API ERROR", error);
      }

      if (error instanceof ApiError) {
        return {
          success: false,
          error: error.message,
          code: error.code,
          status: error.status,
        };
      }

      if (error instanceof DOMException && error.name === "AbortError") {
        return {
          success: false,
          error: "Request timeout",
        };
      }

      return {
        success: false,
        error: "Network error",
      };
    }
  }

  // ========= HTTP METHODS =========

  get<T>(endpoint: string, headers?: Record<string, string>) {
    return this.request<T>("GET", endpoint, { headers });
  }

  post<T, B = unknown>(endpoint: string, body: B, headers?: Record<string, string>) {
    return this.request<T, B>("POST", endpoint, { body, headers });
  }

  put<T, B = unknown>(endpoint: string, body: B, headers?: Record<string, string>) {
    return this.request<T, B>("PUT", endpoint, { body, headers });
  }

  patch<T, B = unknown>(endpoint: string, body: B, headers?: Record<string, string>) {
    return this.request<T, B>("PATCH", endpoint, { body, headers });
  }

  delete<T>(endpoint: string, headers?: Record<string, string>) {
    return this.request<T>("DELETE", endpoint, { headers });
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
