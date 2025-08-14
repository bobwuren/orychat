/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from '@/types/entities';
import apiServiceAdmin from '@/lib/services/apiServiceAdmin';

// Récupérer tous les utilisateurs
export const getAllUsers = async (): Promise<User[]> => {
    // console.log('👥 [usersAdminService][GET] /api/auth/users');
    try {
        const response = await apiServiceAdmin.get('/api/auth/users');
        // console.log('✅ [usersAdminService][GET][SUCCESS]', response.data);
        if (response.status === 200 && response.data?.users) {
            return response.data.users;
        }
        throw new Error('Impossible de récupérer les utilisateurs');
    } catch (err) {
        console.error('❌ [usersAdminService][GET][ERROR]', err);
        throw new Error('Erreur lors de la récupération des utilisateurs');
    }
};

// Récupérer un utilisateur par ID
export const getUserById = async (id: number): Promise<User> => {
    // console.log('🔎 [usersAdminService][GET BY ID]', id);
    try {
        const response = await apiServiceAdmin.get(`/api/auth/users/${id}`);
        // console.log('✅ [usersAdminService][GET BY ID][SUCCESS]', response.data);
        if (response.status === 200 && response.data?.user) {
            return response.data.user;
        }
        throw new Error('Impossible de récupérer l\'utilisateur');
    } catch (err) {
        console.error('❌ [usersAdminService][GET BY ID][ERROR]', err);
        throw new Error('Erreur lors de la récupération de l\'utilisateur');
    }
};

// Créer un utilisateur
export const createUser = async (data: Partial<User> & { password: string }): Promise<User> => {
    // console.log('🆕 [usersAdminService][CREATE]', { ...data, password: '[HIDDEN]' });
    try {
        const response = await apiServiceAdmin.post('/api/auth/register', data);
        // console.log('✅ [usersAdminService][CREATE][SUCCESS]', response.data);
        if (response.status === 201 && response.data?.user) {
            return response.data.user;
        }
        throw new Error('Impossible de créer l\'utilisateur');
    } catch (err: any) {
        console.error('❌ [usersAdminService][CREATE][ERROR]', err);
        if (err.response?.status === 409) {
            throw new Error('Un utilisateur avec cet email existe déjà');
        }
        if (err.response?.data?.error) {
            throw new Error(err.response.data.error);
        }
        throw new Error('Erreur lors de la création de l\'utilisateur');
    }
};

// Mettre à jour un utilisateur
export const updateUser = async (id: number, data: Partial<User> & { password?: string }): Promise<User> => {
    // console.log('✏️ [usersAdminService][UPDATE]', id, { ...data, password: data.password ? '[HIDDEN]' : 'none' });
    try {
        const response = await apiServiceAdmin.put(`/api/auth/admin/users/${id}`, data);
        // console.log('✅ [usersAdminService][UPDATE][SUCCESS]', response.data);
        if (response.status === 200 && response.data?.user) {
            return response.data.user;
        }
        throw new Error('Impossible de mettre à jour l\'utilisateur');
    } catch (err: any) {
        console.error('❌ [usersAdminService][UPDATE][ERROR]', err);
        if (err.response?.status === 409) {
            throw new Error('Un utilisateur avec cet email existe déjà');
        }
        if (err.response?.data?.error) {
            throw new Error(err.response.data.error);
        }
        throw new Error('Erreur lors de la mise à jour de l\'utilisateur');
    }
};

// Supprimer un utilisateur
export const deleteUser = async (id: number): Promise<void> => {
    // console.log('🗑️ [usersAdminService][DELETE]', id);
    try {
        const response = await apiServiceAdmin.delete(`/api/auth/users/${id}`);
        // console.log('✅ [usersAdminService][DELETE][SUCCESS]', response.status);
        if (response.status !== 200) {
            throw new Error('Impossible de supprimer l\'utilisateur');
        }
    } catch (err: any) {
        console.error('❌ [usersAdminService][DELETE][ERROR]', err);
        if (err.response?.data?.error) {
            throw new Error(err.response.data.error);
        }
        throw new Error('Erreur lors de la suppression de l\'utilisateur');
    }
};

// Récupérer les informations de l'utilisateur connecté
export const getCurrentUser = async (id: number): Promise<User> => {
    // console.log('👤 [usersAdminService][GET CURRENT USER]', id);
    try {
        const response = await apiServiceAdmin.get(`/api/auth/users/${id}`);
        // console.log('✅ [usersAdminService][GET CURRENT USER][SUCCESS]', response.data);
        if (response.status === 200 && response.data?.user) {
            return response.data.user;
        }
        throw new Error('Impossible de récupérer les informations de l\'utilisateur');
    } catch (err: any) {
        console.error('❌ [usersAdminService][GET CURRENT USER][ERROR]', err);
        if (err.response?.status === 400) {
            throw new Error('ID utilisateur invalide');
        }
        if (err.response?.status === 401) {
            throw new Error('Token d\'authentification manquant ou invalide');
        }
        if (err.response?.status === 403) {
            throw new Error('Accès refusé - privilèges administrateur requis');
        }
        if (err.response?.status === 404) {
            throw new Error('Utilisateur non trouvé');
        }
        if (err.response?.data?.error) {
            throw new Error(err.response.data.error);
        }
        throw new Error('Erreur lors de la récupération de l\'utilisateur');
    }
};

// Mettre à jour le rôle d'un utilisateur
export const updateUserPermissions = async (id: number, permissions: string): Promise<void> => {
    // console.log('🛡️ [usersAdminService][UPDATE permissions]', id, permissions);
    try {
        const response = await apiServiceAdmin.put(`/api/auth/users/${id}/permissions`, { permissions });
        // console.log('✅ [usersAdminService][UPDATE permissions][SUCCESS]', response.status);
        if (response.status !== 200) {
            throw new Error('Impossible de mettre à jour le rôle');
        }
    } catch (err: any) {
        console.error('❌ [usersAdminService][UPDATE permissions][ERROR]', err);
        if (err.response?.data?.error) {
            throw new Error(err.response.data.error);
        }
        throw new Error('Erreur lors de la mise à jour du rôle');
    }
};