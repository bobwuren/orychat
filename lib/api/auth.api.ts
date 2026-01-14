/**
 * =====================================================
 * API Client - Authentification
 * =====================================================
 * Client pour les endpoints d'authentification
 *
 * @module lib/api/auth.api
 * @version 1.0
 */

import { apiClient } from "./client";
import type {
  RegisterRequest,
  LoginRequest,
  RefreshTokenRequest,
  LogoutRequest,
  UpdateUserRequest,
  CreateAdminRequest,
  AuthResponse,
  RefreshTokenResponse,
  LogoutResponse,
  CreateAdminResponse,
  UsersListResponse,
  UserResponse,
  UpdateUserResponse,
  DeleteUserResponse,
} from "../types";

export class AuthApi {
  private client = apiClient;

  /**
   * Inscription d'un nouvel utilisateur
   * POST /api/auth/register
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.client.post<AuthResponse>("/api/auth/register", data);
  }

  /**
   * Connexion utilisateur
   * POST /api/auth/login
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.client.post<AuthResponse>("/api/auth/login", data);
  }

  /**
   * Rafraîchir le token d'accès
   * POST /api/auth/refresh
   */
  async refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    return this.client.post<RefreshTokenResponse>("/api/auth/refresh", data);
  }

  /**
   * Déconnexion utilisateur
   * POST /api/auth/logout
   * Requiert: Bearer token
   */
  async logout(data: LogoutRequest): Promise<LogoutResponse> {
    return this.client.post<LogoutResponse>("/api/auth/logout", data);
  }

  /**
   * Liste tous les utilisateurs (Admin uniquement)
   * GET /api/auth/users
   * Requiert: Bearer token + admin
   */
  async getAllUsers(params?: {
    page?: number;
    limit?: number;
    permissions?: string;
  }): Promise<UsersListResponse> {
    return this.client.get<UsersListResponse>("/api/auth/users", params);
  }

  /**
   * Récupérer un utilisateur par ID
   * GET /api/auth/users/:id
   * Requiert: Bearer token
   */
  async getUserById(userId: string): Promise<UserResponse> {
    return this.client.get<UserResponse>(`/api/auth/users/${userId}`);
  }

  /**
   * Mettre à jour un utilisateur (Admin uniquement)
   * PUT /api/auth/users/:id
   * Requiert: Bearer token + admin
   */
  async updateUser(
    userId: string,
    data: UpdateUserRequest
  ): Promise<UpdateUserResponse> {
    return this.client.put<UpdateUserResponse>(
      `/api/auth/users/${userId}`,
      data
    );
  }

  /**
   * Supprimer un utilisateur (Admin uniquement)
   * DELETE /api/auth/users/:id
   * Requiert: Bearer token + admin
   */
  async deleteUser(userId: string): Promise<DeleteUserResponse> {
    return this.client.delete<DeleteUserResponse>(`/api/auth/users/${userId}`);
  }

  /**
   * Créer un utilisateur admin (Admin uniquement)
   * POST /api/auth/admin/create
   * Requiert: Bearer token + admin
   */
  async createAdminUser(
    data: CreateAdminRequest
  ): Promise<CreateAdminResponse> {
    return this.client.post<CreateAdminResponse>(
      "/api/auth/admin/create",
      data
    );
  }
}

// Instance singleton exportée
export const authApi = new AuthApi();
