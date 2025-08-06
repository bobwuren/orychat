export type Entity = 'auth' | 'subjects' | 'series' | 'recommendations' | 'universities' | 'degrees';

export type User = {
    id: number;
    role: string;
    email: string;
};

export type Subject = {
    id: number;
    name: string;
    seriesCoefficients: object;
};

export type Serie = {
  id: number;
  code: string;
  description: string;
  subjects: Array<{
    id: number;
    name: string;
    coefficient: number;
  }>;
};

export type University = {
    id: number;
    name: string;
    description: string;
    webSite: string;
    isSponsor: boolean;
    createdAt: string;
    degrees: Array<Degree>;
};

export type EnrichedSubject = Subject & {
    seriesCoefficientsArray: Array<{
        serieId: number;
        serieCode: string;
        serieDescription: string;
        coefficient: number;
    }>;
}

export type Degree = {
    id: number;
    name: string;
    description: string;
    universities?: Array<University>;
    associatedUniversities?: Array<University>;
}

export interface Recommendation {
    id: number;
    userId: number;
    serieId: number;
    orientations: Array<{
        name: string;
        why: string;
        degrees: Array<{
            name: string;
            articleLink: string;
        }>;
        universities: Array<{
            name: string;
            site: string;
        }>;
    }>;
    noteIds: Array<string | null>;
    createdAt: string;
    // Propriétés enrichies
    userEmail?: string;
    serieCode?: string;
}
