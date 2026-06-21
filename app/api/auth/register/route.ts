import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "../../api";
import { cookies } from "next/headers";
import { parse } from "cookie";
import axios from "axios";

export async function POST(request: NextRequest) {
  const body = await request.json();
  try {
    const response = await apiClient.post("/auth/register", body);
    const cookieStore = await cookies();
    const responseHeaders = response.headers["set-cookie"];
    if (responseHeaders) {
      const cookieArray = Array.isArray(responseHeaders)
        ? responseHeaders
        : [responseHeaders];
      for (const cookie of cookieArray) {
        const parsed = parse(cookie);
        const options = {
          expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
          path: parsed.Path,
          maxAge: Number(parsed["Max-Age"]),
        };
        if (parsed.accessToken) {
          cookieStore.set("accessToken", parsed.accessToken, options);
        }
        if (parsed.refreshToken) {
          cookieStore.set("refreshToken", parsed.refreshToken, options);
        }
      }
    }

    return NextResponse.json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 400;
      const data = error.response?.data ?? { message: "Registration failed" };
      return NextResponse.json(data, { status });
    }

    return NextResponse.json(
      { message: "Registration failed" },
      { status: 400 },
    );
  }
}
