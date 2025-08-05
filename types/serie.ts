import {Subject} from "@/types/subject";

export  interface Serie {
    id: number;
    code: string;
    description: string;
    subjects: Subject[];
}