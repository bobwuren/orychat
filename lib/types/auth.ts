/**
 * =====================================================
 * Types Authentification - Orientys
 * =====================================================
 */

import { Permissions } from "./api";

export interface User {
  id: string;
  email: string;
  name?: string;
  permissions: Permissions;
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
  permissions?: Permissions;
}

export interface RegisterResponse {
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface LogoutResponse {
  message: string;
  timestamp: string;
}

export interface UsersListResponse {
  users: User[];
}

export interface UserResponse {
  user: User;
}

export interface CreateAdminRequest {
  email: string;
}

export interface CreateAdminResponse {
  message: string;
  user: User;
  credentials: {
    email: string;
    password: string;
  };
}

export interface UpdateUserRequest {
  email?: string;
  password?: string;
}

export interface UpdateUserResponse {
  message: string;
  user: User;
}

export interface DeleteUserResponse {
  message: string;
  deletedUser: {
    id: string;
    name: string;
    email: string;
    permissions: Permissions;
  };
  deletedAt: string;
}
