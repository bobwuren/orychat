'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import { LoginForm } from '@/components/auth/login-form';
import apiService from '@/lib/services/apiService';
import {setSession, restoreSession} from '@/lib/services/apiService';

export default function HomePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        restoreSession();
        if (typeof window !== "undefined") {
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                router.replace('/dashboard');
            }
            setChecked(true);
        }
    }, [router]);

    const handleLogin = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const res = await apiService.post('/api/auth/login', {email, password});
            const {user, accessToken, refreshToken} = res.data;
            setSession({accessToken, refreshToken});
            console.log('✅ Connexion réussie :', user);
            router.push('/dashboard');
        } catch (err: any) {
            console.error('❌ Erreur de login:', err?.message || 'Erreur inconnue');
        } finally {
            setIsLoading(false);
        }
    };

    if (!checked) return null;

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <LoginForm onLogin={handleLogin} isLoading={isLoading}/>
            </div>
        </div>
    );
}
