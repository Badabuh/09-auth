import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "../../api";
import { cookies } from "next/headers";
import { parse } from "cookie";

export async function POST(request: NextRequest) {
  const body = await request.json();
  try {
    const response = await apiClient.post("/auth/login", body);
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
      return NextResponse.json(response.data);
    }
    return NextResponse.json({ message: "Login failed" }, { status: 400 });
  } catch  {
    return NextResponse.json({ message: "Login failed" }, { status: 400 });
  }
}
