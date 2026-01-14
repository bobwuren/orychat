import { apiClient } from "./client";
import type * as T from "../types/notes";

// ============= NOTES API =============
export class NotesApi {
  async getAll() {
    return apiClient.get<T.Note[]>("/notes");
  }

  async getById(id: string) {
    return apiClient.get<T.Note>(`/notes/${id}`);
  }

  async getByUser(userId: string) {
    return apiClient.get<T.Note[]>(`/notes/user/${userId}`);
  }

  async save(notes: T.SaveNotesRequest["notes"]) {
    return apiClient.post<T.SaveNotesResponse>("/notes/save", notes);
  }

  async create(note: Omit<T.Note, "id" | "createdAt">) {
    return apiClient.post<{ message: string; noteId: string }>("/notes", note);
  }
}

export const notesApi = new NotesApi();
