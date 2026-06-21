import { apiClient } from "../api";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const cookieStore = await cookies();
    const response = await apiClient.get("/notes", {
      params: searchParams,
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return NextResponse.json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const data = error.response?.data ?? { message: "Failed to fetch notes" };
      return NextResponse.json(data, { status });
    }
    return NextResponse.json(
      { message: "Failed to fetch notes" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const note = await request.json();
    const cookieStore = await cookies();
    const response = await apiClient.post("/notes", note, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return NextResponse.json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const data = error.response?.data ?? { message: "Failed to create note" };
      return NextResponse.json(data, { status });
    }
    return NextResponse.json(
      { message: "Failed to create note" },
      { status: 500 },
    );
  }
}
