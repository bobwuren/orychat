/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {AxiosError, AxiosResponse} from "axios";

// ⚙️ Création de l'instance axios pour l'admin
const _axiosAdmin = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
    timeout: 15000,
});

let accessToken: string | null = null;
let refreshToken: string | null = null;
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (error: any) => void;
}> = [];

// 🍪 Gestion des cookies
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

const processQueue = (error: any, token: string | null) => {
    failedQueue.forEach(({resolve, reject}) => {
        if (error) {
            reject(error);
        } else {
            resolve(token);
        }
    });
    failedQueue = [];
};

// ✅ Init session (login ou restore)
export const setSessionAdmin = (session: {
    accessToken: string;
    refreshToken: string;
    adminId?: number;
}) => {
    accessToken = session.accessToken;
    refreshToken = session.refreshToken;
    if (typeof window !== 'undefined') {
        localStorage.setItem("adminAccessToken", accessToken);
        localStorage.setItem("adminRefreshToken", refreshToken);
        if (session.adminId !== undefined) {
            localStorage.setItem("adminId", String(session.adminId));
        }
        setCookie('adminAccessToken', accessToken);
        setCookie('adminRefreshToken', refreshToken);
        if (session.adminId !== undefined) {
            setCookie('adminId', String(session.adminId));
        }
    }
};

export const restoreSessionAdmin = () => {
    if (typeof window !== 'undefined') {
        accessToken = localStorage.getItem("adminAccessToken") || getCookie("adminAccessToken");
        refreshToken = localStorage.getItem("adminRefreshToken") || getCookie("adminRefreshToken");
        if (accessToken && !localStorage.getItem("adminAccessToken")) {
            localStorage.setItem("adminAccessToken", accessToken);
        }
        if (refreshToken && !localStorage.getItem("adminRefreshToken")) {
            localStorage.setItem("adminRefreshToken", refreshToken);
        }
    }
    return accessToken !== null;
};

export const clearSessionAdmin = () => {
    accessToken = null;
    refreshToken = null;
    if (typeof window !== 'undefined') {
        localStorage.removeItem("adminAccessToken");
        localStorage.removeItem("adminRefreshToken");
        localStorage.removeItem("adminId");
        deleteCookie('adminAccessToken');
        deleteCookie('adminRefreshToken');
        deleteCookie('adminId');
    }
};

export const isAuthenticatedAdmin = (): boolean => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem("adminAccessToken") || getCookie("adminAccessToken");
        return token !== null;
    }
    return false;
};

const shouldAddToken = (url: string) => {
    return !(url.includes("/api/auth/login") || url.includes("/api/auth/refresh"));
};

// 🔐 Ajout automatique du token et rôle admin
_axiosAdmin.interceptors.request.use((config) => {
    // Si le token n'est pas en mémoire, essayer de le restaurer
    if (!accessToken && typeof window !== 'undefined') {
        accessToken = localStorage.getItem("adminAccessToken") || getCookie("adminAccessToken");
        refreshToken = localStorage.getItem("adminRefreshToken") || getCookie("adminRefreshToken");
    }
    
    if (accessToken && shouldAddToken(config.url ?? "")) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
        config.headers["role"] = "admin";
    }
    return config;
});

_axiosAdmin.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError<any>) => {
        const originalRequest: any = error.config;
        if (
            (error.response?.status === 401 || error.response?.status === 403) &&
            refreshToken &&
            !originalRequest._retry
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({resolve, reject});
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return _axiosAdmin(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }
            originalRequest._retry = true;
            isRefreshing = true;
            try {
                const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`, {
                    refreshToken,
                });
                const newAccess = res.data.accessToken;
                const newRefresh = res.data.refreshToken;
                const adminIdStr = localStorage.getItem("adminId") || getCookie("adminId");
                const adminId = adminIdStr !== null ? Number(adminIdStr) : undefined;
                setSessionAdmin({
                    accessToken: newAccess,
                    refreshToken: newRefresh,
                    adminId: adminId
                });
                processQueue(null, newAccess);
                originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
                originalRequest.headers["role"] = "admin";
                return _axiosAdmin(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                clearSessionAdmin();
                if (typeof window !== 'undefined') {
                    const currentPath = window.location.pathname;
                    if (currentPath !== '/auth/login') {
                        window.location.href = '/auth/login';
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
        return Promise.reject(error);
    }
);

// Import du gestionnaire d'erreurs global unifié
import { handleApiError } from "../errorHandler";

// 📦 Export de l'API admin
const apiServiceAdmin = {
    get: async <T = any>(
        path: string,
        query?: Record<string, any>
    ): Promise<AxiosResponse<T>> => {
        console.log('🟢 [apiServiceAdmin][GET]', path, query);
        try {
            const res = await _axiosAdmin.get(path, {params: query});
            console.log('✅ [apiServiceAdmin][GET][SUCCESS]', path, res.status, res.data);
            return res;
        } catch (err) {
            const errorDetails = handleApiError(err, `apiServiceAdmin GET ${path}`);
            console.error('❌ [apiServiceAdmin][GET][ERROR]', path, errorDetails);
            throw err; // On laisse remonter l'erreur pour la gestion au niveau du composant
        }
    },
    post: async <T = any>(
        path: string,
        data?: any
    ): Promise<AxiosResponse<T>> => {
        console.log('🟡 [apiServiceAdmin][POST]', path, data);
        try {
            const res = await _axiosAdmin.post(path, data);
            console.log('✅ [apiServiceAdmin][POST][SUCCESS]', path, res.status, res.data);
            return res;
        } catch (err) {
            const errorDetails = handleApiError(err, `apiServiceAdmin POST ${path}`);
            console.error('❌ [apiServiceAdmin][POST][ERROR]', path, errorDetails);
            throw err; // On laisse remonter l'erreur pour la gestion au niveau du composant
        }
    },
    put: async <T = any>(
        path: string,
        data?: any
    ): Promise<AxiosResponse<T>> => {
        console.log('🔵 [apiServiceAdmin][PUT]', path, data);
        try {
            const res = await _axiosAdmin.put(path, data);
            console.log('✅ [apiServiceAdmin][PUT][SUCCESS]', path, res.status, res.data);
            return res;
        } catch (err) {
            const errorDetails = handleApiError(err, `apiServiceAdmin PUT ${path}`);
            console.error('❌ [apiServiceAdmin][PUT][ERROR]', path, errorDetails);
            throw err; // On laisse remonter l'erreur pour la gestion au niveau du composant
        }
    },
    patch: async <T = any>(
        path: string,
        data?: any
    ): Promise<AxiosResponse<T>> => {
        console.log('🟣 [apiServiceAdmin][PATCH]', path, data);
        try {
            const res = await _axiosAdmin.patch(path, data);
            console.log('✅ [apiServiceAdmin][PATCH][SUCCESS]', path, res.status, res.data);
            return res;
        } catch (err) {
            const errorDetails = handleApiError(err, `apiServiceAdmin PATCH ${path}`);
            console.error('❌ [apiServiceAdmin][PATCH][ERROR]', path, errorDetails);
            throw err; // On laisse remonter l'erreur pour la gestion au niveau du composant
        }
    },
    delete: async <T = any>(path: string): Promise<AxiosResponse<T>> => {
        console.log('🔴 [apiServiceAdmin][DELETE]', path);
        try {
            const res = await _axiosAdmin.delete(path);
            console.log('✅ [apiServiceAdmin][DELETE][SUCCESS]', path, res.status, res.data);
            return res;
        } catch (err) {
            const errorDetails = handleApiError(err, `apiServiceAdmin DELETE ${path}`);
            console.error('❌ [apiServiceAdmin][DELETE][ERROR]', path, errorDetails);
            throw err; // On laisse remonter l'erreur pour la gestion au niveau du composant
        }
    },
};

export default apiServiceAdmin;

// 🚪 Fonction de logout admin
export const logoutAdmin = async (): Promise<void> => {
    console.log('🚪 [apiServiceAdmin][LOGOUT] /api/auth/logout');
    try {
        if (accessToken) {
              const refreshToken = localStorage.getItem('refreshToken');
            const res = await _axiosAdmin.post('/api/auth/logout', { refreshToken });
            console.log('✅ [apiServiceAdmin][LOGOUT][SUCCESS]', res.status);
        }
    } catch (err) {
        console.error('❌ [apiServiceAdmin][LOGOUT][ERROR]', err);
        // Ne pas throw l'erreur car on veut quand même nettoyer la session locale
    } finally {
        // Toujours nettoyer la session locale même si l'API échoue
        clearSessionAdmin();
    }
};
