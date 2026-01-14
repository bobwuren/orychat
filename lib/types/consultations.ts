/* ======================== Types consultations - Orientys ======================== */

export type ConsultationStatus =
  | "pending"
  | "assigned"
  | "completed"
  | "cancelled";

export interface Consultation {
  id: string;
  studentId: string;
  counselorId?: string;
  questionnaireId: string;
  recommendationId: string;
  studentEmail?: string;
  studentPhone: string;
  additionalComment?: string;
  status: ConsultationStatus;
  whatsappSent: boolean;
  emailSentToCounselor: boolean;
  createdAt: string;
  assignedAt?: string;
}

export interface ConsultationDetails extends Consultation {
  studentName?: string;
  studentAccountEmail?: string;
  counselorName?: string;
  counselorEmail?: string;
}

export interface RequestConsultationRequest {
  questionnaireId: string;
  recommendationId: string;
  studentEmail?: string;
  studentPhone: string;
  additionalComment?: string;
}

export interface RequestConsultationResponse {
  success: boolean;
  message: string;
  consultation: Consultation;
  whatsappSent: boolean;
}

export interface AssignCounselorRequest {
  counselorId: string;
}

export interface AssignCounselorResponse {
  success: boolean;
  message: string;
  consultation: Consultation;
  emailSent: boolean;
}

export interface UpdateConsultationStatusRequest {
  status: ConsultationStatus;
}

export interface ConsultationStats {
  pending: number;
  assigned: number;
  completed: number;
  cancelled: number;
}
