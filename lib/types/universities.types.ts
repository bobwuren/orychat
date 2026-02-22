/**
 * Types - Universités & Diplômes
 * @module lib/types/universities.types
 */

// ========== DEGREE ==========

export interface Degree {
  id: string;
  name: string;
  description?: string;
  level?: string;
  duration?: string;
  specializations?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface DegreeWithUniversities extends Degree {
  universities?: University[];
}

// ========== UNIVERSITY ==========


export interface University {
  id: string;
  name: string;
  description?: string;
  location?: string;
  address?: string;
  website?: string; // l'API utilise les deux noms de façon incohérente
  webSite?: string; // lire : university.website || university.webSite
  email?: string;
  phone?: string;
  isSponsor: boolean;
  logo?: string;
  ranking?: number;
  studentCount?: number;
  establishedYear?: number;
  degrees?: Degree[];
  createdAt?: string;
  updatedAt?: string;
}

// ========== REQUESTS ==========

export interface CreateDegreeRequest {
  name: string;
  description?: string;
  level?: string;
  duration?: string;
}

export interface UpdateDegreeRequest {
  name?: string;
  description?: string;
  level?: string;
  duration?: string;
}

export interface CreateUniversityRequest {
  name: string; // obligatoire, 2-200 chars, unique
  location: string; // obligatoire
  description?: string;
  address?: string;
  website?: string;
  email?: string;
  phone?: string;
  isSponsor?: boolean;
  logo?: string;
  ranking?: number;
  studentCount?: number;
  establishedYear?: number;
  degreeIds?: string[]; // IDs de diplômes existants à associer
}

export interface UpdateUniversityRequest {
  name?: string;
  description?: string;
  location?: string;
  address?: string;
  website?: string;
  email?: string;
  phone?: string;
  isSponsor?: boolean;
  logo?: string;
  ranking?: number;
  studentCount?: number;
  establishedYear?: number;
  degreeIds?: string[]; // remplace la liste existante
}

// ========== RESPONSES ==========

export interface DegreesListResponse {
  degrees: Degree[];
  count?: number;
  message?: string;
}

export interface DegreeResponse {
  degree: Degree;
  message?: string;
}

export interface CreateDegreeResponse {
  degree: Degree;
  message?: string;
}

export interface UpdateDegreeResponse {
  degree: Degree;
  message?: string;
}

export interface UniversitiesListResponse {
  success?: boolean;
  universities: University[];
  count?: number;
  totalPages?: number;
  currentPage?: number;
  message?: string;
}

export interface SponsorsListResponse {
  success?: boolean;
  sponsors: University[];
  count?: number;
  message?: string;
}

export interface UniversityResponse {
  success?: boolean;
  university: University;
  message?: string;
}

export interface CreateUniversityResponse {
  success?: boolean;
  message: string;
  university: University;
}

export interface UpdateUniversityResponse {
  success?: boolean;
  message: string;
  university: University;
}

export interface DeleteUniversityResponse {
  success?: boolean;
  message: string;
  deletedUniversity?: {
    id: string;
    name: string;
    deletedAt: string; // ISO 8601
  };
  cascadeInfo?: {
    degreeAssociations: number;
    recommendations: number;
    studentRecords: number;
  };
}

export interface UniversityDegreesResponse {
  success?: boolean;
  message?: string;
  university?: {
    id: string;
    name: string;
  };
  degrees: Degree[];
  count?: number;
}

export interface UniversitiesByDegreeResponse {
  success?: boolean;
  message?: string;
  degree?: Degree;
  universities: University[];
  statistics?: {
    total: number;
    sponsors: number;
    regular: number;
  };
}
