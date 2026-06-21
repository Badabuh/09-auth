import { apiClient } from "../../api";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST() {
  const cookieStore = await cookies();
  try {
    await apiClient.post("/auth/logout", null, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Logout should be idempotent on the client side even if upstream fails.
    }
  }

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  return NextResponse.json({ success: true });
}
