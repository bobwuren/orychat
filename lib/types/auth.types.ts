/**
 * =====================================================
 * Types - Authentification & Utilisateurs
 * =====================================================
 * Définitions TypeScript pour l'auth et la gestion users
 *
 * @module lib/types/auth.types
 * @version 1.0
 */

// ========== PERMISSIONS ==========
export type UserPermission = "admin" | "client" | "counselor";

// ========== USER ==========
export interface User {
  id: string;
  permissions: UserPermission;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt?: string;
  lastLogin?: string;
  isActive?: boolean;
}

// ========== AUTH REQUESTS ==========
export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
  permissions?: UserPermission;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface UpdateUserRequest {
  email?: string;
  password?: string;
  name?: string;
}

export interface CreateAdminRequest {
  email: string;
}

// ========== AUTH RESPONSES ==========
export interface AuthResponse {
  message: string;
  user: User;
  refreshToken: string;
  accessToken: string;
}

export interface RefreshTokenResponse {
  refreshToken: string;
  accessToken: string;
  user?: User;
}

export interface LogoutResponse {
  message: string;
  timestamp?: string;
}

export interface CreateAdminResponse {
  message: string;
  user: User;
  credentials: {
    email: string;
    password: string;
  };
}

// ========== USER RESPONSES ==========
export interface UsersListResponse {
  users: User[];
  metadata?: {
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
  };
}

export interface UserResponse {
  user: User;
}

export interface UpdateUserResponse {
  message: string;
  user: User;
}

export interface DeleteUserResponse {
  message: string;
  deletedUser?: {
    id: string;
    name?: string;
    email: string;
    permissions: UserPermission;
  };
  deletedAt?: string;
}

// ========== AUTH STATE ==========
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
