import {Serie} from "@/types/serie";
import apiService from "@/lib/services/apiService";
import {AxiosResponse} from "axios";

export const getAllSeries = async (): Promise<Serie[]> => {
    try {
        const response = await apiService.get("/api/series");

        console.log("📜 Réponse brute séries:\n", response.data);

        if (response.status === 200) {
            const seriesData = response.data.series ?? [];
            console.log('📜 Séries récupérées :', seriesData);
            return seriesData;
        } else {
            console.log('📜 Erreur lors de la récupération des séries :', response.statusText);
            throw new Error("Erreur lors de la récupération des séries");
        }
    } catch (error: any) {
        console.error("❌ Erreur série :", error);
        throw new Error("Impossible de charger les séries");
    }
};