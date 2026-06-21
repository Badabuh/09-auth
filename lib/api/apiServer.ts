import { cookies } from "next/headers";
import { apiClient } from "./api";

export async function getSession() {
  const cookieStore = await cookies();
  const response = await apiClient.get("/auth/session", {
    headers: { Cookie: cookieStore.toString() },
  });
  return response;
}
