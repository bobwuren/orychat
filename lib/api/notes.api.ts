/**
 * =====================================================
 * API Client - Notes - CORRIGÉ
 * =====================================================
 * Client pour les endpoints des notes
 *
 * @module lib/api/notes.api
 * @version 1.1
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
   */
  async saveNotes(data: SaveNotesRequest): Promise<SaveNotesResponse> {
    return this.client.post<SaveNotesResponse, SaveNotesRequest>(
      "/notes/save",
      data,
    );
  }

  /**
   * Récupérer toutes les notes (Admin uniquement)
   * GET /api/notes
   */
  async getAll(params?: {
    userId?: string;
    serieId?: string;
    page?: number;
    limit?: number;
  }): Promise<NotesListResponse> {
    return this.client.get<NotesListResponse>("/notes", params);
  }

  /**
   * Récupérer une note par ID
   * GET /api/notes/:id
   */
  async getById(noteId: string): Promise<NoteResponse> {
    return this.client.get<NoteResponse>(`/notes/${noteId}`);
  }

  /**
   * Créer une note (Admin uniquement)
   * POST /api/notes
   */
  async create(data: CreateNoteRequest): Promise<CreateNoteResponse> {
    return this.client.post<CreateNoteResponse, CreateNoteRequest>(
      "/notes",
      data,
    );
  }

  /**
   * Récupérer les notes d'un utilisateur
   * GET /api/notes/user/:userId
   */
  async getByUserId(userId: string): Promise<NotesListResponse> {
    return this.client.get<NotesListResponse>(`/notes/user/${userId}`);
  }
}

// Instance singleton exportée
export const notesApi = new NotesApi();
