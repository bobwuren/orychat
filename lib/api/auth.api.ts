import { ApiClient } from "./client";
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

const api = new ApiClient(`${process.env.NEXT_PUBLIC_API_URL!}/auth`);

/* =========================================================
   Helpers
   ========================================================= */

function buildQuery(params?: ListUsersQuery): string {
  if (!params) return "";

  const searchParams = new URLSearchParams();

  if (params.page) searchParams.append("page", String(params.page));
  if (params.limit) searchParams.append("limit", String(params.limit));
  if (params.permissions) searchParams.append("permissions", params.permissions);

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

/* =========================================================
   AUTH — PUBLIC
   ========================================================= */

export const register = async (data: RegisterRequest) => {
  return api.post<AuthSuccessResponse, RegisterRequest>("/register", data);
};

export const login = async (data: LoginRequest) => {
  return api.post<AuthSuccessResponse, LoginRequest>("/login", data);
};

export const refreshToken = async (data: RefreshTokenRequest) => {
  return api.post<RefreshTokenResponse, RefreshTokenRequest>("/refresh", data);
};

/* =========================================================
   AUTH — PROTECTED
   ========================================================= */

export const logout = async (data: LogoutRequest) => {
  return api.post<LogoutResponse, LogoutRequest>("/logout", data);
};

/* =========================================================
   USERS — ADMIN / SELF
   ========================================================= */

export const getUsers = async (query?: ListUsersQuery) => {
  return api.get<GetUsersResponse>(`/users${buildQuery(query)}`);
};

export const getUserById = async (userId: string) => {
  return api.get<GetUserResponse>(`/users/${userId}`);
};

export const updateUser = async (userId: string, data: UpdateUserRequest) => {
  return api.put<UpdateUserResponse, UpdateUserRequest>(`/users/${userId}`, data);
};

export const deleteUser = async (userId: string) => {
  return api.delete<DeleteUserResponse>(`/users/${userId}`);
};

/* =========================================================
   TOKEN MANAGEMENT (OPTIONAL HELPERS)
   ========================================================= */

export const setAuthToken = (token: string | null) => {
  api.setAccessToken(token);
};
