import { apiClient } from "./api";
import type { LoginRequest } from "@/types/auth";
import type { User } from "../../types/user";

export async function register(payload: LoginRequest): Promise<User> {
  const response = await apiClient.post<User>("/auth/register", payload);
  return response.data;
}

export async function login(payload: LoginRequest): Promise<User> {
  const response = await apiClient.post<User>("/auth/login", payload);
  return response.data;
}

export async function updateMe(payload: Pick<User, "username">): Promise<User> {
  const response = await apiClient.patch<User>("/users/me", payload);
  return response.data;
}
