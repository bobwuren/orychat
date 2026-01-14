/* ======================== Types universities - Orientys ======================== */

export interface UniversityDegree {
  id: string;
  name: string;
  level?: string;
  duration?: string;
  description?: string;
  specializations?: string[];
}

export interface UniversityBase {
  id: string;
  name: string;
  description?: string;
  location?: string;
  address?: string;
  website?: string;
  email?: string;
  phone?: string;
  isSponsor: boolean;
  sponsorshipLevel?: string;
  logo?: string;
  ranking?: number;
  studentCount?: number;
  establishedYear?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface UniversityWithDegrees extends UniversityBase {
  degrees: UniversityDegree[];
}

export interface CreateUniversityRequest {
  name: string;
  description?: string;
  location: string;
  address?: string;
  website?: string;
  email?: string;
  phone?: string;
  isSponsor?: boolean;
  sponsorshipLevel?: string;
  logo?: string;
  ranking?: number;
  studentCount?: number;
  establishedYear?: number;
  degreeIds?: string[];
}
