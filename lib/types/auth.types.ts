/* =========================================================
   AUTH TYPES — API Orientys
   ========================================================= */

export type UserRole = "admin" | "client";

export interface AuthUser {
  id: string;
  email: string;
  permissions: UserRole;
}

/* ===================== REQUESTS ===================== */

export interface RegisterRequest {
  email: string;
  password: string;
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
}

/* ===================== RESPONSES ===================== */

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthSuccessResponse {
  message: string;
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LogoutResponse {
  message: string;
}

export interface GetUserResponse {
  user: AuthUser;
}

export interface GetUsersResponse {
  users: AuthUser[];
}

export interface UpdateUserResponse {
  message: string;
  user: AuthUser;
}

export interface DeleteUserResponse {
  message: string;
}

/* ===================== ERRORS ===================== */

export interface ApiErrorResponse {
  error: string;
}

/* ===================== QUERY PARAMS ===================== */

export interface ListUsersQuery {
  page?: number;
  limit?: number;
  permissions?: UserRole;
}
