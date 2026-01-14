/* ======================== Types degrees - Orientys ======================== */

export interface DegreeBase {
  id: string;
  name: string;
  description?: string;
}

export interface DegreeWithUniversities extends DegreeBase {
  universities: Array<{
    id: string;
    name: string;
    webSite?: string;
    description?: string;
    isSponsor: boolean;
  }>;
}

export interface CreateDegreeRequest {
  name: string;
  description?: string;
}
