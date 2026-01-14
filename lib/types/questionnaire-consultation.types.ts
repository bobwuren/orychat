/**
 * =====================================================
 * Types - Questionnaire & Consultations
 * =====================================================
 * Définitions TypeScript pour questionnaire et consultations
 *
 * @module lib/types/questionnaire-consultation.types
 * @version 1.0
 */

// ========== QUESTIONNAIRE ENUMS ==========
export type VisionProfessionnelle =
  | "Entrepreneur(e) / Créateur(trice) d'entreprise"
  | "Salarié(e) dans une grande entreprise"
  | "Freelance / Consultant(e) indépendant(e)"
  | "Chercheur(se) / Enseignant(e)"
  | "Je ne sais pas encore";

export type StyleApprentissage =
  | "La pratique (projets, stages, travaux pratiques)"
  | "La théorie (cours magistraux, lectures, recherche)"
  | "Un équilibre entre théorie et pratique";

export type DomaineNumerique =
  | "Créer des sites web et applications"
  | "Analyser des données et faire de l'IA"
  | "Gérer les réseaux sociaux et le marketing digital"
  | "Résoudre des problèmes techniques (cybersécurité, réseaux)"
  | "Design graphique et création de contenu"
  | "Autre / Je ne sais pas";

export type PrioriteFormation =
  | "Durée courte de formation"
  | "Coût accessible"
  | "Prestige et réputation de l'école"
  | "Garantie de débouchés professionnels"
  | "Flexibilité (cours en ligne, horaires adaptés)";

export type ModeTravail =
  | "Seul(e) sur tes projets"
  | "En équipe / collaboration"
  | "Ça dépend du contexte";

// ========== QUESTIONNAIRE ==========
export interface Questionnaire {
  id: string;
  userId: string;
  serieId: string;
  visionProfessionnelle?: VisionProfessionnelle;
  styleApprentissage?: StyleApprentissage;
  domaineNumerique?: DomaineNumerique;
  prioriteFormation?: PrioriteFormation;
  modeTravail?: ModeTravail;
  matieresPreferees?: string;
  passionsExtraScolaires?: string;
  messageLibre?: string;
  createdAt: string;
}

// ========== COUNSELOR ==========
export interface Counselor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  photo?: string;
  bio?: string;
  specialties?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ========== CONSULTATION ==========
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

export interface ConsultationFullDetails extends Consultation {
  student?: {
    id: string;
    name?: string;
    email: string;
  };
  counselor?: Counselor;
  questionnaire?: Questionnaire;
  recommendation?: {
    id: string;
    orientations: any[];
  };
  serie?: {
    id: string;
    code: string;
    description: string;
  };
  notes?: Array<{
    subjectName: string;
    value: number;
    coefficient: number;
  }>;
}

// ========== REQUESTS ==========
export interface SubmitQuestionnaireRequest {
  serieId: string;
  visionProfessionnelle?: VisionProfessionnelle;
  styleApprentissage?: StyleApprentissage;
  domaineNumerique?: DomaineNumerique;
  prioriteFormation?: PrioriteFormation;
  modeTravail?: ModeTravail;
  matieresPreferees?: string;
  passionsExtraScolaires?: string;
  messageLibre?: string;
}

export interface RequestConsultationRequest {
  questionnaireId: string;
  recommendationId: string;
  studentEmail?: string;
  studentPhone: string;
  additionalComment?: string;
}

export interface AssignCounselorRequest {
  counselorId: string;
}

export interface UpdateConsultationStatusRequest {
  status: ConsultationStatus;
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

export interface UpdateCounselorRequest {
  name?: string;
  email?: string;
  phone?: string;
  photo?: string;
  bio?: string;
  specialties?: string[];
  isActive?: boolean;
}

// ========== RESPONSES ==========
export interface SubmitQuestionnaireResponse {
  success: boolean;
  message: string;
  questionnaireId: string;
}

export interface QuestionnairesListResponse {
  success: boolean;
  questionnaires: Questionnaire[];
  count: number;
}

export interface QuestionnaireResponse {
  success: boolean;
  questionnaire: Questionnaire;
}

export interface DeleteQuestionnaireResponse {
  success: boolean;
  message: string;
}

export interface RequestConsultationResponse {
  success: boolean;
  message: string;
  consultation: Consultation;
  whatsappSent: boolean;
}

export interface ConsultationsListResponse {
  success: boolean;
  consultations: Consultation[];
  count: number;
}

export interface ConsultationDetailsResponse {
  success: boolean;
  consultation: ConsultationFullDetails;
}

export interface AssignCounselorResponse {
  success: boolean;
  message: string;
  consultation: Consultation;
  emailSent: boolean;
}

export interface UpdateConsultationStatusResponse {
  success: boolean;
  message: string;
  consultation: Consultation;
}

export interface ConsultationStatsResponse {
  success: boolean;
  stats: {
    pending: number;
    assigned: number;
    completed: number;
    cancelled: number;
    total: number;
  };
}

export interface CounselorsListResponse {
  success: boolean;
  counselors: Counselor[];
  count: number;
}

export interface CounselorResponse {
  success: boolean;
  counselor: Counselor;
}

export interface CreateCounselorResponse {
  success: boolean;
  message: string;
  counselor: Counselor;
}

export interface UpdateCounselorResponse {
  success: boolean;
  message: string;
  counselor: Counselor;
}

export interface DeleteCounselorResponse {
  success: boolean;
  message: string;
}
