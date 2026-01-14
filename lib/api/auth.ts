/**
 * =====================================================
 * API Authentification - Orientys
 * =====================================================
 */

import { apiClient } from "./client";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  LogoutRequest,
  LogoutResponse,
  UsersListResponse,
  UserResponse,
  CreateAdminRequest,
  CreateAdminResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  DeleteUserResponse,
} from "../types/auth";

export class AuthApi {
  /**
   * Connexion utilisateur
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>("/auth/login", data);

    // Sauvegarder les tokens
    if (response.accessToken && response.refreshToken) {
      apiClient.setTokens(response.accessToken, response.refreshToken);
    }

    return response;
  }

  /**
   * Inscription utilisateur
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>(
      "/auth/register",
      data
    );

    // Sauvegarder les tokens
    if (response.accessToken && response.refreshToken) {
      apiClient.setTokens(response.accessToken, response.refreshToken);
    }

    return response;
  }

  /**
   * Rafraîchir le token d'accès
   */
  async refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const response = await apiClient.post<RefreshTokenResponse>(
      "/auth/refresh",
      data
    );

    // Mettre à jour les tokens
    if (response.accessToken && response.refreshToken) {
      apiClient.setTokens(response.accessToken, response.refreshToken);
    }

    return response;
  }

  /**
   * Déconnexion utilisateur
   */
  async logout(data: LogoutRequest): Promise<LogoutResponse> {
    const response = await apiClient.post<LogoutResponse>("/auth/logout", data);

    // Supprimer les tokens
    apiClient.clearTokens();

    return response;
  }

  /**
   * Récupérer tous les utilisateurs (Admin uniquement)
   */
  async getAllUsers(): Promise<UsersListResponse> {
    return apiClient.get<UsersListResponse>("/auth/users");
  }

  /**
   * Récupérer un utilisateur par ID
   */
  async getUserById(userId: string): Promise<UserResponse> {
    return apiClient.get<UserResponse>(`/auth/users/${userId}`);
  }

  /**
   * Mettre à jour un utilisateur (Admin uniquement)
   */
  async updateUser(
    userId: string,
    data: UpdateUserRequest
  ): Promise<UpdateUserResponse> {
    return apiClient.put<UpdateUserResponse>(`/auth/users/${userId}`, data);
  }

  /**
   * Supprimer un utilisateur (Admin uniquement)
   */
  async deleteUser(userId: string): Promise<DeleteUserResponse> {
    return apiClient.delete<DeleteUserResponse>(`/auth/users/${userId}`);
  }

  /**
   * Créer un utilisateur admin (Admin uniquement)
   */
  async createAdmin(data: CreateAdminRequest): Promise<CreateAdminResponse> {
    return apiClient.post<CreateAdminResponse>("/auth/admin/create", data);
  }

  /**
   * Vérifier si l'utilisateur est authentifié
   */
  isAuthenticated(): boolean {
    return apiClient.isAuthenticated();
  }
}

export const authApi = new AuthApi();
