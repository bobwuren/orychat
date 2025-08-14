import axios, {AxiosError, AxiosResponse} from "axios";
import { getErrorMessage, safeApiCall } from "../error-utils";
import { showError } from "@/components/ErrorToast";
import { showSuccess, showLoading } from "@/components/ToastNotification";

// ⚙️ Création de l'instance axios
const _axios = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}`, // TODO: replace with your backend url
    timeout: 15000,
});

let accessToken: string | null = null;
let refreshToken: string | null = null;
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (error: any) => void;
}> = [];

// 🍪 Gestion des cookies pour le middleware
const setCookie = (name: string, value: string, days: number = 7) => {
    if (typeof document !== 'undefined') {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;samesite=strict`;
    }
};

const getCookie = (name: string): string | null => {
    if (typeof document !== 'undefined') {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
};

const deleteCookie = (name: string) => {
    if (typeof document !== 'undefined') {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    }
};

// Traitement de la queue des requêtes échouées
const processQueue = (error: any, token: string | null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(token);
        }
    });
    
    failedQueue = [];
};

// ✅ Init session (login ou restore) - Version améliorée
export const setSession = (session: {
    accessToken: string;
    refreshToken: string;
    userId?: number;
}) => {
    accessToken = session.accessToken;
    refreshToken = session.refreshToken;
    
    if (typeof window !== 'undefined') {
        // Stocker dans localStorage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        if (session.userId) {
            localStorage.setItem("userId", String(session.userId));
        }

        // Stocker dans les cookies pour le middleware
        setCookie('accessToken', accessToken);
        setCookie('refreshToken', refreshToken);
        if (session.userId) {
            setCookie('userId', String(session.userId));
        }
    }
};

// 🔁 Restore depuis localStorage - Version améliorée
export const restoreSession = () => {
    if (typeof window !== 'undefined') {
        accessToken = localStorage.getItem("accessToken") || getCookie("accessToken");
        refreshToken = localStorage.getItem("refreshToken") || getCookie("refreshToken");
        
        // Synchroniser localStorage et cookies si nécessaire
        if (accessToken && !localStorage.getItem("accessToken")) {
            localStorage.setItem("accessToken", accessToken);
        }
        if (refreshToken && !localStorage.getItem("refreshToken")) {
            localStorage.setItem("refreshToken", refreshToken);
        }
    }
    return accessToken !== null;
};

// 🚫 Clear session - Version améliorée
export const clearSession = () => {
    accessToken = null;
    refreshToken = null;
    
    if (typeof window !== 'undefined') {
        // Nettoyer localStorage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("selectedSerieId");
        localStorage.removeItem("notes");
        localStorage.removeItem("series");
        localStorage.removeItem("series_cache_time");
        localStorage.removeItem("lastRecommendation"); // Nettoyage explicite des recommandations en cache

        // Nettoyer cookies
        deleteCookie('accessToken');
        deleteCookie('refreshToken');
        deleteCookie('userId');
    }
};

// 🔍 Vérification d'authentification
export const isAuthenticated = (): boolean => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem("accessToken") || getCookie("accessToken");
        return token !== null;
    }
    return false;
};

// 👤 Récupération des informations de l'utilisateur connecté
export const getCurrentUser = async (): Promise<any> => {
    try {
        if (typeof window === 'undefined') {
            throw new Error('Cette fonction doit être appelée côté client');
        }

        // Récupérer l'ID utilisateur depuis localStorage ou cookies
        const userIdStr = localStorage.getItem('userId') || getCookie('userId');
        const userId = userIdStr ? Number(userIdStr) : null;

        if (!userId) {
            throw new Error('Aucun utilisateur connecté - ID utilisateur manquant');
        }

        // console.log('🔍 Récupération des informations utilisateur:', userId);

        const response = await _axios.get(`/api/auth/users/${userId}`);

        if (response.status === 200 && response.data?.user) {
            // console.log('✅ Informations utilisateur récupérées:', response.data.user);
            return response.data.user;
        } else {
            console.error('❌ Réponse inattendue:', response.data);
            throw new Error('Réponse invalide du serveur');
        }
    } catch (error: any) {
        console.error('❌ Erreur lors de la récupération des informations utilisateur:', error);
        
        // Gestion spécifique des erreurs
        if (error.response?.status === 401) {
            throw new Error('Session expirée - Veuillez vous reconnecter');
        } else if (error.response?.status === 403) {
            throw new Error('Accès refusé - Privilèges insuffisants');
        } else if (error.response?.status === 404) {
            throw new Error('Utilisateur non trouvé');
        } else if (error.response?.status === 400) {
            throw new Error('ID utilisateur invalide');
        } else {
            throw new Error(error.message || 'Erreur lors de la récupération des informations utilisateur');
        }
    }
};

// ❓ Vérifie si on doit ajouter le token
const shouldAddToken = (url: string) => {
    return !(
        url.includes("/api/auth/login") ||
        url.includes("/api/auth/register") ||
        url.includes("/api/auth/refresh")
    );
};

// 🔐 Ajout automatique du token et rôle
_axios.interceptors.request.use((config) => {
    if (accessToken && shouldAddToken(config.url ?? "")) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
        config.headers["permissions"] = "client";
    }
    return config;
});

// 🔁 Gestion automatique du refresh et des erreurs - Version simple
_axios.interceptors.response.use(
    (response) => {
        // console.log('✅ [API] Réponse reçue:', response.config.url, response.status);
        return response;
    },
    async (error: AxiosError<any>) => {
        const originalRequest: any = error.config;
        console.error('❌ [API] Erreur:', error.response?.status, error.config?.url);

        // Gestion des erreurs réseau (pas de connexion internet, serveur inaccessible)
        if (!error.response) {
            const errorMessage = getErrorMessage(error);
            console.error('[API] Erreur réseau:', errorMessage);
            
            // Afficher une notification d'erreur à l'utilisateur
            if (typeof window !== 'undefined') {
                showError(errorMessage);
            }
            
            return Promise.reject(error);
        }

        // Gestion du refresh token pour les erreurs d'authentification
        if (
            (error.response?.status === 401 || error.response?.status === 403) &&
            refreshToken &&
            !originalRequest._retry
        ) {
            // Si un refresh est déjà en cours, mettre en queue
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return _axios(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // console.log('🔁 [API] Tentative de refresh du token...');
                const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`, {
                    refreshToken,
                });

                const newAccess = res.data.accessToken;
                const newRefresh = res.data.refreshToken;
                const userIdStr = localStorage.getItem('userId') || getCookie('userId');
                const userId = userIdStr ? Number(userIdStr) : undefined;

                // console.log('🔓 [API] Token refresh réussi !');

                // Mettre à jour les tokens
                setSession({
                    accessToken: newAccess,
                    refreshToken: newRefresh,
                    userId: userId
                });

                // Traiter la queue des requêtes échouées
                processQueue(null, newAccess);

                // Retry la requête originale
                originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
                originalRequest.headers["permissions"] = "client";

                return _axios(originalRequest);
            } catch (refreshError) {
                console.error('❌ [API] Échec du refresh du token:', refreshError);
                
                // Traiter la queue avec l'erreur
                processQueue(refreshError, null);
                
                // Nettoyer la session
                clearSession();
                
                // Rediriger vers login si on est côté client
                if (typeof window !== 'undefined') {
                    // Eviter les boucles de redirection
                    const currentPath = window.location.pathname;
                    if (currentPath !== '/login' && currentPath !== '/register') {
                        window.location.href = '/login';
                    }
                }
                
                return Promise.reject({
                    ...error,
                    message: "Session expirée. Veuillez vous reconnecter.",
                });
            } finally {
                isRefreshing = false;
            }
        }

        // Afficher une notification pour toutes les erreurs
        const errorMessage = getErrorMessage(error);
        if (typeof window !== 'undefined') {
            showError(errorMessage);
        }
        
        return Promise.reject(error);
    }
);

// 📦 Export de l'API avec méthodes comme en Dart - Avec notifications d'état
const apiService = {
    get: <T = any>(
        path: string,
        query?: Record<string, any>,
        options?: { showLoadingToast?: boolean, loadingMessage?: string, successMessage?: string }
    ): Promise<AxiosResponse<T>> => {
        if (options?.showLoadingToast) {
            showLoading(options.loadingMessage || "Chargement en cours...");
        }
        
        return _axios.get(path, {params: query})
            .then(response => {
                if (options?.successMessage) {
                    showSuccess(options.successMessage);
                }
                return response;
            });
    },

    post: <T = any>(
        path: string,
        data?: any,
        options?: { showLoadingToast?: boolean, loadingMessage?: string, successMessage?: string }
    ): Promise<AxiosResponse<T>> => {
        if (options?.showLoadingToast) {
            showLoading(options.loadingMessage || "Traitement en cours...");
        }
        
        return _axios.post(path, data)
            .then(response => {
                if (options?.successMessage) {
                    showSuccess(options.successMessage);
                }
                return response;
            });
    },

    put: <T = any>(
        path: string,
        data?: any,
        options?: { showLoadingToast?: boolean, loadingMessage?: string, successMessage?: string }
    ): Promise<AxiosResponse<T>> => {
        if (options?.showLoadingToast) {
            showLoading(options.loadingMessage || "Mise à jour en cours...");
        }
        
        return _axios.put(path, data)
            .then(response => {
                if (options?.successMessage) {
                    showSuccess(options.successMessage);
                }
                return response;
            });
    },

    delete: <T = any>(
        path: string,
        options?: { showLoadingToast?: boolean, loadingMessage?: string, successMessage?: string }
    ): Promise<AxiosResponse<T>> => {
        if (options?.showLoadingToast) {
            showLoading(options.loadingMessage || "Suppression en cours...");
        }
        
        return _axios.delete(path)
            .then(response => {
                if (options?.successMessage) {
                    showSuccess(options.successMessage);
                }
                return response;
            });
    },
};

export default apiService;