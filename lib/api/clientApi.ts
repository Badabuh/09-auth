import { LoginRequest, User } from "@/types/auth";
import type { CreateNotePayload, Note } from "../../types/note";
import type { NotesQueryParams, NotesResponse } from "../../types/noteApi";
import { api } from "./api";

export async function fetchNotes(
  searchParams: NotesQueryParams,
): Promise<NotesResponse> {
  const response = await api.get<NotesResponse>("/notes", {
    params: searchParams,
  });
  return response.data;
}

export async function createNote(note: CreateNotePayload): Promise<Note> {
  const response = await api.post<Note>("/notes", note);
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
}

export async function getNoteById(id: string): Promise<Note> {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
}

export async function login(request: LoginRequest): Promise<User> {
  const response = await api.post<User>("/auth/login", request);
  return response.data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function register(request: LoginRequest): Promise<User> {
  const response = await api.post<User>("/auth/register", request);
  return response.data;
}

export async function getSession(): Promise<boolean> {
  const response = await api.get<boolean>("/auth/session");
  return response.data;
}
export async function getMe(): Promise<User> {
  const response = await api.get<User>("/users/me");
  return response.data;
}

export const getUser = getMe;

export async function updateMe(user: Partial<User>): Promise<User> {
  const response = await api.patch<User>("/users/me", user);
  return response.data;
}
