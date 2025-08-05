'use client';

import { CacheService } from '@/lib/cache';
import { LogoutProvider } from '@/components/auth/logout-provider';
import { ErrorProvider } from '@/components/providers/error-provider';
import { isAuthenticatedAdmin } from '@/lib/services/apiServiceAdmin';
import React, { useEffect } from 'react';

export function DataProviders({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Ne pré-charger les données que si l'utilisateur est authentifié
        if (isAuthenticatedAdmin()) {
            Promise.all([
                CacheService.get('auth'),
                CacheService.get('series'),
                CacheService.get('subjects')
            ]).catch(console.error);
        }
    }, []);

    return (
        <ErrorProvider>
            <LogoutProvider>
                {children}
            </LogoutProvider>
        </ErrorProvider>
    );
}