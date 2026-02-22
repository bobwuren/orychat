/**
 * Types - Auth & Utilisateurs
 * @module lib/types/auth.types
 */

// ========== ENUMS ==========

export type UserRole = "admin" | "client";

// ========== ENTITÉS ==========

// Retourné par login, register, refresh, getUser, getUsers
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  permissions: UserRole;
  createdAt?: string; // ISO 8601
  updatedAt?: string; // ISO 8601
  lastLogin?: string; // ISO 8601 — présent dans getUsers/getUserById
  isActive?: boolean; // présent dans getUserById
}

// ========== REQUESTS ==========

export interface RegisterRequest {
  name: string; // obligatoire, 1-255 chars
  email: string;
  password: string; // min 8 chars, 1 maj, 1 min, 1 chiffre
  permissions?: UserRole; // défaut "client" côté serveur
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// refreshToken sera révoqué côté serveur
export interface LogoutRequest {
  refreshToken: string;
}

// Tous les champs sont optionnels — seuls les champs fournis sont mis à jour
export interface UpdateUserRequest {
  email?: string;
  password?: string;
  permissions?: UserRole;
}

// ========== RESPONSES ==========

export interface AuthTokens {
  accessToken: string; // validité 1h
  refreshToken: string; // validité 7 jours
}

// Réponse de POST /auth/login et POST /auth/register
export interface AuthSuccessResponse {
  message: string;
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

// Réponse de POST /auth/refresh
export interface RefreshTokenResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

// Réponse de POST /auth/logout
export interface LogoutResponse {
  message: string;
  timestamp: string; // ISO 8601
}

// Réponse de GET /auth/users/:id
export interface GetUserResponse {
  user: AuthUser;
}

// Réponse de GET /auth/users (Admin)
export interface GetUsersResponse {
  users: AuthUser[];
  metadata?: {
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
  };
}

// Réponse de PUT /auth/users/:id (Admin)
export interface UpdateUserResponse {
  message: string;
  user: AuthUser;
}

// Réponse de DELETE /auth/users/:id (Admin)
export interface DeleteUserResponse {
  message: string;
  deletedUser?: {
    id: string;
    name: string;
    email: string;
    permissions: UserRole;
  };
  deletedAt?: string; // ISO 8601
}

// ========== ERRORS ==========

export interface ApiErrorResponse {
  error: string;
}

// ========== QUERY PARAMS ==========

// Paramètres pour GET /auth/users
export interface ListUsersQuery {
  page?: number; // défaut: 1
  limit?: number; // défaut: 50, max: 100
  permissions?: UserRole;
}
