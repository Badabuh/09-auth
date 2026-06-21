import { cookies } from "next/headers";
import { api } from "./api";
import type { User } from "@/types/user";

export async function getSession() {
  const cookieStore = await cookies();
  const response = await api.get("/auth/session", {
    headers: { Cookie: cookieStore.toString() },
  });
  return response;
}

export async function getMe(): Promise<User> {
  const cookieStore = await cookies();
  const response = await api.get<User>("/users/me", {
    headers: { Cookie: cookieStore.toString() },
  });
  return response.data;
}
