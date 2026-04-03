import { apiClient } from "./client";
import type {
  RegisterRequest,
  LoginRequest,
  RefreshTokenRequest,
  LogoutRequest,
  AuthSuccessResponse,
  RefreshTokenResponse,
  LogoutResponse,
  GetUserResponse,
  GetUsersResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  DeleteUserResponse,
  ListUsersQuery,
} from "../types/auth.types";

/* =========================================================
   Helpers
   ========================================================= */

function buildQuery(params?: ListUsersQuery): Record<string, string | number> {
  if (!params) return {};

  const query: Record<string, string | number> = {};

  if (params.page) query.page = params.page;
  if (params.limit) query.limit = params.limit;
  if (params.permissions) query.permissions = params.permissions;

  return query;
}

/* =========================================================
   AUTH - PUBLIC
   ========================================================= */

export const register = async (data: RegisterRequest) => {
  return apiClient.post<AuthSuccessResponse>("/auth/register", data);
};

export const login = async (data: LoginRequest) => {
  return apiClient.post<AuthSuccessResponse>("/auth/login", data);
};

export const refreshToken = async (data: RefreshTokenRequest) => {
  return apiClient.post<RefreshTokenResponse>("/auth/refresh", data);
};

/* =========================================================
   AUTH - PROTECTED
   ========================================================= */

export const logout = async (data: LogoutRequest) => {
  return apiClient.post<LogoutResponse>("/auth/logout", data);
};

/* =========================================================
   USERS - ADMIN / SELF
   ========================================================= */

export const getUsers = async (query?: ListUsersQuery) => {
  return apiClient.get<GetUsersResponse>("/auth/users", buildQuery(query));
};

export const getUserById = async (userId: string) => {
  return apiClient.get<GetUserResponse>(`/auth/users/${userId}`);
};

export const updateUser = async (userId: string, data: UpdateUserRequest) => {
  return apiClient.put<UpdateUserResponse, UpdateUserRequest>(
    `/auth/users/${userId}`,
    data,
  );
};

export const deleteUser = async (userId: string) => {
  return apiClient.delete<DeleteUserResponse>(`/auth/users/${userId}`);
};

/* =========================================================
   TOKEN MANAGEMENT (OPTIONAL HELPERS)
   ========================================================= */

export const setAuthToken = (token: string | null) => {
  apiClient.setAccessToken(token);
};
