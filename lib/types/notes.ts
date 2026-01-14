/* =============== Types notes - Orientys =============== */

export interface Note {
  id: string;
  userId: string;
  subjectId: string;
  serieId: string;
  value: number;
  subjectName?: string;
  coefficient?: number;
  createdAt?: string;
}

export interface SaveNotesRequest {
  notes: Array<{
    userId: string;
    subjectId: string;
    serieId: string;
    value: number;
  }>;
}

export interface SaveNotesResponse {
  message: string;
  noteIds: string[];
}
