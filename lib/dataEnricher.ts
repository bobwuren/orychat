import {Subject, Serie, EnrichedSubject} from '@/types/entities';

/**
 * Enrichit les subjects avec les infos des séries (nom/code)
 */
export function enrichSubjects(subjects: Subject[], series: Serie[]): EnrichedSubject[] {
    return subjects.map(subject => {
        // Transforme le mapping {serieId: coeff} en tableau enrichi
        const seriesCoefficientsArray = Object.entries(subject.seriesCoefficients || {}).map(([serieIdStr, coeff]) => {
            const serieId = Number(serieIdStr);
            const serie = series.find(s => s.id === serieId);
            return {
                serieId,
                serieCode: serie?.code || '',
                serieDescription: serie?.description || '',
                coefficient: coeff as number
            };
        });
        return {
            ...subject,
            seriesCoefficientsArray
        };
    });
}