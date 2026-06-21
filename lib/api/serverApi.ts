import { cookies } from "next/headers";
import { api } from "./api";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";
import type { NotesQueryParams, NotesResponse } from "@/types/noteApi";

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

export async function getNoteById(id: string): Promise<Note> {
  const cookieStore = await cookies();
  const response = await api.get<Note>(`/notes/${id}`, {
    headers: { Cookie: cookieStore.toString() },
  });
  return response.data;
}

export async function fetchNotes(
  searchParams: NotesQueryParams,
): Promise<NotesResponse> {
  const cookieStore = await cookies();
  const response = await api.get<NotesResponse>("/notes", {
    params: searchParams,
    headers: { Cookie: cookieStore.toString() },
  });
  return response.data;
}
