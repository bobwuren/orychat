export interface Orientation {
    name: string;
    why: string;
    degrees: Record<string, string>[];
    link: string;
    universities: Record<string, string>[];
}

export type Recommendation = {
    id: number;
    userId: number;
    serieId: number;
    serieCode?: string;
    orientations: Orientation[];
    noteIds: number[];
    createdAt: Date;
}