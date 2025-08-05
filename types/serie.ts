import {Subject} from "@/types/subject";

export  interface Serie {
    id: string;
    code: string;
    description: string;
    subjects: Subject[];
}