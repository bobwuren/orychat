import {Note} from '@/types/note';
import apiService from '@/lib/services/apiService';

export const saveNotes = async (notes: Note[]) => {
    try {
        console.log('💾 Sauvegarde des notes:', notes);
        await apiService.post('/api/notes/save', notes);
    } catch (err) {
        console.error('❌ Erreur lors de la sauvegarde des notes: ', err);
        throw new Error('Impossible de sauvegarder les notes');
    }
}