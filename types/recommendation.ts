export interface Orientation {
    name: string;
    why: string;
    degrees: Record<string, string>[];
    link: string;
    universities: Record<string, string>[];
}

export type Recommendation = {
    id: string;
    userId: string;
    serieId: string;
    serieCode?: string;
    orientations: Orientation[];
    noteIds: string[];
    createdAt: Date;
}