/* ======================== Types questionnaires - Orientys ======================== */
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

export interface QuestionnaireResponse {
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

export interface SubmitQuestionnaireResponse {
  success: boolean;
  message: string;
  questionnaireId: string;
}
