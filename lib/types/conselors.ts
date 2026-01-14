/* ======================== Types counselors - Orientys ======================== */

export interface Counselor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  photo?: string;
  bio?: string;
  specialties: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCounselorRequest {
  name: string;
  email: string;
  phone?: string;
  photo?: string;
  bio?: string;
  specialties?: string[];
  isActive?: boolean;
}

export interface UpdateCounselorRequest
  extends Partial<CreateCounselorRequest> {}
