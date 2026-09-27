import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import { apiFetch } from '../api/client'
import type { Profile } from '../types/profile'

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type AuthContextValue = {
    status: AuthStatus;
    user: Profile | null;
    isAdmin: boolean;
    needsOnboarding: boolean;
    applyUser: (next: Profile) => void;
    clearSession: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readProfile(data: { data?: Profile } | null | undefined) {
    const profile = data?.data;
    if (!profile || typeof profile.id !== 'string' || profile.id.length === 0) {
        return null;
    }
    return profile;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [status, setStatus] = useState<AuthStatus>('loading');
    const [user, setUser] = useState<Profile | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadSession() {
            try {
                const data = await apiFetch<{ data: Profile }>('/api/auth/me');
                if (cancelled) return;
                const profile = readProfile(data);
                if (!profile) {
                    setUser(null);
                    setStatus('unauthenticated');
                    return;
                }
                setUser(profile);
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

    const applyUser = useCallback((next: Profile) => {
        setUser(next);
        setStatus('authenticated');
    }, []);

    const clearSession = useCallback(() => {
        setUser(null);
        setStatus('unauthenticated');
    }, []);

    const isAdmin = Boolean(user?.isAdmin);
    const needsOnboarding = Boolean(user) && user?.onboardingCompleted === false && !isAdmin;

    const value = useMemo(() => ({
        status,
        user,
        isAdmin,
        needsOnboarding,
        applyUser,
        clearSession
    }), [status, user, isAdmin, needsOnboarding, applyUser, clearSession]);

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
