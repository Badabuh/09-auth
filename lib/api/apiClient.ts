import { LoginRequest, User } from "@/types/auth";
import type { CreateNotePayload, Note } from "../../types/note";
import type { NotesQueryParams, NotesResponse } from "../../types/noteApi";
import { apiClient } from "./api";

export async function fetchNotes(
  searchParams: NotesQueryParams,
): Promise<NotesResponse> {
  const response = await apiClient.get<NotesResponse>("/notes", {
    params: searchParams,
  });
  return response.data;
}

export async function createNote(note: CreateNotePayload): Promise<Note> {
  const response = await apiClient.post<Note>("/notes", note);
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await apiClient.delete<Note>(`/notes/${id}`);
  return response.data;
}

export async function getNoteById(id: string): Promise<Note> {
  const response = await apiClient.get<Note>(`/notes/${id}`);
  return response.data;
}

export async function login(request: LoginRequest): Promise<User> {
  const response = await apiClient.post<User>("/auth/login", request);
  return response.data;
}

export async function logout(): Promise<void> {
  await apiClient.post("/auth/logout");
}

export async function register(request: LoginRequest): Promise<User> {
  const response = await apiClient.post<User>("/auth/register", request);
  return response.data;
}

export async function getSession(): Promise<boolean> {
  const response = await apiClient.get<boolean>("/auth/session");
  return response.data;
}
export async function getUser(): Promise<User> {
  const response = await apiClient.get<User>("/users/me");
  return response.data;
}

export async function updateUser(user: Partial<LoginRequest>): Promise<User> {
  const response = await apiClient.patch<User>("/users/me", user);
  return response.data;
}
