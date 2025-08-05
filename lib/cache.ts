import {Entity, User, Subject, Serie} from '@/types/entities';
import apiServiceAdmin from '@/lib/services/apiServiceAdmin';

type CacheData = {
    auth: User[];
    subjects: Subject[];
    series: Serie[];
    universities: any[];  // Gardons les universités, elles bougent peu
    degrees: any[];       // Gardons les diplômes, référentiel stable
};

const cache: CacheData = {
    auth: [],
    subjects: [],
    series: [],
    universities: [],
    degrees: []
};

// Cache avec TTL pour certaines données
const cacheTimestamps: { [key in Entity]?: number } = {};
const CACHE_TTL = {
    auth: 2 * 60 * 1000,        // 2 minutes pour les users (plus court)
    subjects: 30 * 60 * 1000,   // 30 minutes pour les matières
    series: 60 * 60 * 1000,     // 1 heure pour les séries
    universities: 60 * 60 * 1000, // 1 heure pour les universités  
    degrees: 60 * 60 * 1000,    // 1 heure pour les diplômes
    recommendations: 2 * 60 * 1000, // Pas de cache pour les recommandations
};

export const CacheService = {
    get: async (entity: Entity, forceRefresh = false): Promise<any[]> => {
        // Si c'est des recommendations, toujours fetch (pas de cache)
        if (entity === 'recommendations') {
            const endpoint = `/api/${entity}/all`;
            const response = await apiServiceAdmin.get(endpoint);
            return Array.isArray(response.data) ? response.data : response.data[entity] || [];
        }

        // Si force refresh demandé
        if (forceRefresh) {
            await CacheService.refresh(entity);
            return cache[entity as keyof CacheData];
        }

        // Vérifier si le cache est valide (TTL)
        const now = Date.now();
        const lastUpdate = cacheTimestamps[entity] || 0;
        const ttl = CACHE_TTL[entity] || 0;
        const isExpired = (now - lastUpdate) > ttl;

        // Si pas dans le cache ou expiré, refresh
        if (!(entity in cache) || cache[entity as keyof CacheData].length === 0 || isExpired) {
            await CacheService.refresh(entity);
        }

        return cache[entity as keyof CacheData];
    },

    refresh: async (entity: Entity): Promise<void> => {
        // Pas de cache pour les recommendations
        if (entity === 'recommendations') return;

        const endpoint = entity === 'auth' ? '/api/auth/users' : `/api/${entity}`;
        const response = await apiServiceAdmin.get(endpoint);
        const data = response.data;
        
        if (entity === 'subjects' && data.subjects) {
            cache.subjects = data.subjects;
        } else if (entity === 'series' && data.series) {
            cache.series = data.series;
        } else if (entity === 'auth' && data.users) {
            cache.auth = data.users;  // Correction: utiliser 'auth' au lieu de 'users'
        } else {
            // fallback si l'API retourne déjà un tableau
            const cacheKey = entity as keyof CacheData;
            if (cacheKey in cache) {
                cache[cacheKey] = Array.isArray(data) ? data : [];
            }
        }

        // Mettre à jour le timestamp
        cacheTimestamps[entity] = Date.now();
    },

    // Méthode pour forcer le refresh d'une entité
    invalidate: (entity: Entity): void => {
        if (entity !== 'recommendations' && entity in cache) {
            cache[entity as keyof CacheData] = [];
            delete cacheTimestamps[entity];
        }
    },

    // Méthode pour vider tout le cache
    clear: (): void => {
        Object.keys(cache).forEach(key => {
            cache[key as keyof CacheData] = [];
        });
        Object.keys(cacheTimestamps).forEach(key => {
            delete cacheTimestamps[key as Entity];
        });
    },

    // Méthodes spécialisées pour les cas critiques
    getUsersFresh: async (): Promise<any[]> => {
        return CacheService.get('auth', true); // Force refresh
    },

    // Ajouter un élément au cache (après création)
    addToCache: (entity: Entity, item: any): void => {
        if (entity !== 'recommendations' && entity in cache) {
            const cacheKey = entity as keyof CacheData;
            cache[cacheKey] = [...cache[cacheKey], item];
        }
    },

    // Mettre à jour un élément dans le cache
    updateInCache: (entity: Entity, itemId: string, updatedItem: any): void => {
        if (entity !== 'recommendations' && entity in cache) {
            const cacheKey = entity as keyof CacheData;
            const index = cache[cacheKey].findIndex((item: any) => item.id === itemId);
            if (index !== -1) {
                cache[cacheKey][index] = updatedItem;
            }
        }
    },

    // Supprimer un élément du cache
    removeFromCache: (entity: Entity, itemId: string): void => {
        if (entity !== 'recommendations' && entity in cache) {
            const cacheKey = entity as keyof CacheData;
            cache[cacheKey] = cache[cacheKey].filter((item: any) => item.id !== itemId);
        }
    }
};