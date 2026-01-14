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

export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  error?: string;
  data?: T;
}

export class ApiError extends Error {
  constructor(message: string, public status: number, public code?: string) {
    super(message);
    this.name = "ApiError";
  }
}

export class ApiClient {
  private baseURL: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor(baseURL?: string) {
    this.baseURL =
      baseURL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  }

  /**
   * Définit les tokens d'authentification
   */
  setTokens(accessToken: string, refreshToken?: string) {
    this.accessToken = accessToken;
    if (refreshToken) {
      this.refreshToken = refreshToken;
    }
  }

  /**
   * Récupère le token d'accès actuel
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Récupère le refresh token actuel
   */
  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  /**
   * Supprime les tokens (logout)
   */
  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
  }

  /**
   * Construit les headers pour les requêtes
   */
  private buildHeaders(customHeaders?: HeadersInit): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...customHeaders,
    };

    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    return headers;
  }

  /**
   * Gère les erreurs HTTP
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `HTTP Error: ${response.status}`;
      let errorCode: string | undefined;

      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
        errorCode = errorData.code;
      } catch {
        // Si parsing JSON échoue, on garde le message par défaut
      }

      throw new ApiError(errorMessage, response.status, errorCode);
    }

    // Gestion des réponses vides (204 No Content)
    if (response.status === 204) {
      return {} as T;
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }

    // Pour les réponses non-JSON (CSV, texte, etc.)
    return response.text() as unknown as T;
  }

  /**
   * Requête GET
   */
  async get<T = any>(
    endpoint: string,
    params?: Record<string, string | number | boolean>,
    customHeaders?: HeadersInit
  ): Promise<T> {
    const url = new URL(`${this.baseURL}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: this.buildHeaders(customHeaders),
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Requête POST
   */
  async post<T = any>(
    endpoint: string,
    body?: any,
    customHeaders?: HeadersInit
  ): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers: this.buildHeaders(customHeaders),
      body: JSON.stringify(body),
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Requête PUT
   */
  async put<T = any>(
    endpoint: string,
    body?: any,
    customHeaders?: HeadersInit
  ): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "PUT",
      headers: this.buildHeaders(customHeaders),
      body: JSON.stringify(body),
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Requête PATCH
   */
  async patch<T = any>(
    endpoint: string,
    body?: any,
    customHeaders?: HeadersInit
  ): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "PATCH",
      headers: this.buildHeaders(customHeaders),
      body: JSON.stringify(body),
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Requête DELETE
   */
  async delete<T = any>(
    endpoint: string,
    customHeaders?: HeadersInit
  ): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "DELETE",
      headers: this.buildHeaders(customHeaders),
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Téléchargement de fichier (export CSV, etc.)
   */
  async download(
    endpoint: string,
    params?: Record<string, string | number | boolean>,
    filename?: string
  ): Promise<Blob> {
    const url = new URL(`${this.baseURL}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: this.buildHeaders(),
    });

    if (!response.ok) {
      throw new ApiError(
        `Download failed: ${response.statusText}`,
        response.status
      );
    }

    const blob = await response.blob();

    // Téléchargement automatique si filename est fourni
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

// Instance singleton exportée
export const apiClient = new ApiClient();
