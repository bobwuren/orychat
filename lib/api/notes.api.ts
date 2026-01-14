/**
 * =====================================================
 * API Client - Notes
 * =====================================================
 * Client pour les endpoints des notes
 *
 * @module lib/api/notes.api
 * @version 1.0
 */

import { apiClient } from "./client";
import type {
  SaveNotesRequest,
  CreateNoteRequest,
  SaveNotesResponse,
  NotesListResponse,
  NoteResponse,
  CreateNoteResponse,
} from "../types";

export class NotesApi {
  private client = apiClient;

  /**
   * Sauvegarder plusieurs notes (batch)
   * POST /api/notes/save
   * Requiert: Bearer token
   */
  async saveNotes(data: SaveNotesRequest): Promise<SaveNotesResponse> {
    return this.client.post<SaveNotesResponse>("/api/notes/save", data.notes);
  }

  /**
   * Récupérer toutes les notes (Admin uniquement)
   * GET /api/notes
   * Requiert: Bearer token + admin
   */
  async getAll(): Promise<NotesListResponse> {
    return this.client.get<NotesListResponse>("/api/notes");
  }

  /**
   * Récupérer une note par ID
   * GET /api/notes/:id
   * Requiert: Bearer token
   */
  async getById(noteId: string): Promise<NoteResponse> {
    return this.client.get<NoteResponse>(`/api/notes/${noteId}`);
  }

  /**
   * Créer une note (Admin uniquement)
   * POST /api/notes
   * Requiert: Bearer token + admin
   */
  async create(data: CreateNoteRequest): Promise<CreateNoteResponse> {
    return this.client.post<CreateNoteResponse>("/api/notes", data);
  }

  /**
   * Récupérer les notes d'un utilisateur (Admin uniquement)
   * GET /api/notes/user/:userId
   * Requiert: Bearer token + admin
   */
  async getByUserId(userId: string): Promise<NotesListResponse> {
    return this.client.get<NotesListResponse>(`/api/notes/user/${userId}`);
  }
}

// Instance singleton exportée
export const notesApi = new NotesApi();
