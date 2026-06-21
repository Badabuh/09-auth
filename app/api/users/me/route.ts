import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "../../api";
import { cookies } from "next/headers";
import axios from "axios";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const response = await apiClient.get("/users/me", {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const data = error.response?.data ?? { message: "Failed to fetch user" };
      return NextResponse.json(data, { status });
    }
    return NextResponse.json(
      { message: "Failed to fetch user" },
      { status: 500 },
    );
  }
}
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const cookieStore = await cookies();
    const response = await apiClient.patch("/users/me", body, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return NextResponse.json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const data = error.response?.data ?? { message: "Failed to update user" };
      return NextResponse.json(data, { status });
    }
    return NextResponse.json(
      { message: "Failed to update user" },
      { status: 500 },
    );
  }
}
