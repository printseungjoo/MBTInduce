import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import { apiFetch } from '../api/client'
import type { Profile } from '../types/profile'

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type AuthContextValue = {
    status: AuthStatus;
    user: Profile | null;
    isAdmin: boolean;
    clearSession: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [status, setStatus] = useState<AuthStatus>('loading');
    const [user, setUser] = useState<Profile | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadSession() {
            try {
                const data = await apiFetch<{ data: Profile }>('/api/auth/me');
                if (cancelled) return;
                setUser(data.data);
                setStatus('authenticated');
            } catch {
                if (cancelled) return;
                setUser(null);
                setStatus('unauthenticated');
            }
        }

        loadSession();
        return () => {
            cancelled = true;
        };
    }, []);

    const clearSession = useCallback(() => {
        setUser(null);
        setStatus('unauthenticated');
    }, []);

    const value = useMemo(() => ({
        status,
        user,
        isAdmin: Boolean(user?.isAdmin),
        clearSession
    }), [status, user, clearSession]);

    return (
        <AuthContext.Provider value = { value }>
            { children }
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
