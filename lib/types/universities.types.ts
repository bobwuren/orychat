/**
 * =====================================================
 * Types - Universités & Diplômes
 * =====================================================
 * Définitions TypeScript pour universités et diplômes
 *
 * @module lib/types/universities.types
 * @version 1.0
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
export type SponsorshipLevel = "Bronze" | "Silver" | "Gold" | "Platinum";

export interface University {
  id: string;
  name: string;
  description?: string;
  location?: string;
  address?: string;
  website?: string;
  webSite?: string; // API uses both
  email?: string;
  phone?: string;
  isSponsor: boolean;
  sponsorshipLevel?: SponsorshipLevel;
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
  name: string;
  description?: string;
  location: string;
  address?: string;
  website?: string;
  webSite?: string;
  email?: string;
  phone?: string;
  isSponsor?: boolean;
  sponsorshipLevel?: SponsorshipLevel;
  logo?: string;
  ranking?: number;
  studentCount?: number;
  establishedYear?: number;
  degreeIds?: string[];
  degrees?: Array<{
    name: string;
    description?: string;
  }>;
}

export interface UpdateUniversityRequest {
  name?: string;
  description?: string;
  location?: string;
  address?: string;
  website?: string;
  webSite?: string;
  email?: string;
  phone?: string;
  isSponsor?: boolean;
  sponsorshipLevel?: SponsorshipLevel;
  logo?: string;
  ranking?: number;
  studentCount?: number;
  establishedYear?: number;
  degreeIds?: string[];
  degrees?: Array<{
    name: string;
    description?: string;
  }>;
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
    deletedAt: string;
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
