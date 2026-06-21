import { cookies } from "next/headers";
import { apiClient } from "./api";
import type { User } from "@/types/user";

export async function getMe(): Promise<User> {
  const cookieStore = await cookies();
  const response = await apiClient.get<User>("/users/me", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
}
