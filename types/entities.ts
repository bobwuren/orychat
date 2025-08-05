export type Entity = 'auth' | 'subjects' | 'series' | 'recommendations' | 'universities' | 'degrees';

export type User = {
    id: string;
    role: string;
    email: string;
};

export type Subject = {
    id: string;
    name: string;
    seriesCoefficients: object;
};

export type Serie = {
  id: string;
  code: string;
  description: string;
  subjects: Array<{
    id: string;
    name: string;
    coefficient: number;
  }>;
};
export type University = {
    id: string;
    name: string;
    description: string;
    webSite: string;
    isSponsor: boolean;
    createdAt: string;
    degrees: Array<string | Degree>;
};

export type EnrichedSubject = Subject & {
    seriesCoefficientsArray: Array<{
        serieId: string;
        serieCode: string;
        serieDescription: string;
        coefficient: number;
    }>;
}

export type Degree = {
    id: string;
    name: string;
    description: string;
    universities?: Array<University>;
    associatedUniversities?: Array<University>;
}

export interface Recommendation {
    id: string;
    userId: string;
    serieId: string;
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
