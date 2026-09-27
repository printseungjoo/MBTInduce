import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'

import { useAuth } from './AuthProvider'
import AuthSkeleton from '../ui/template/AuthSkeleton'

function GuestHome() {
    return <Navigate to = "/" replace />;
}

function AppHome() {
    return <Navigate to = "/Start" replace />;
}

function AdminHome() {
    return <Navigate to = "/Admin" replace />;
}

function OnboardingHome() {
    return <Navigate to = "/SignUp" replace />;
}

export function GuestRoute({ children }: { children: ReactNode }) {
    const { status, isAdmin, needsOnboarding } = useAuth();
    if (status === 'loading') {
        return <AuthSkeleton />;
    }
    if (status === 'authenticated') {
        if (isAdmin) {
            return <AdminHome />;
        }
        if (needsOnboarding) {
            return <OnboardingHome />;
        }
        return <AppHome />;
    }
    return children;
}

export function OnboardingRoute({ children }: { children: ReactNode }) {
    const { status, isAdmin, needsOnboarding } = useAuth();
    if (status === 'loading') {
        return <AuthSkeleton />;
    }
    if (status === 'unauthenticated') {
        return <GuestHome />;
    }
    if (isAdmin) {
        return <AdminHome />;
    }
    if (!needsOnboarding) {
        return <AppHome />;
    }
    return children;
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
    const { status, isAdmin, needsOnboarding } = useAuth();
    if (status === 'loading') {
        return <AuthSkeleton />;
    }
    if (status === 'unauthenticated') {
        return <GuestHome />;
    }
    if (isAdmin) {
        return children;
    }
    if (needsOnboarding) {
        return <OnboardingHome />;
    }
    return children;
}

export function AdminRoute({ children }: { children: ReactNode }) {
    const { status, isAdmin } = useAuth();
    if (status === 'loading') {
        return <AuthSkeleton />;
    }
    if (status === 'unauthenticated' || !isAdmin) {
        return <GuestHome />;
    }
    return children;
}

export function AuthFallbackRoute() {
    const { status, isAdmin, needsOnboarding } = useAuth();
    if (status === 'loading') {
        return <AuthSkeleton />;
    }
    if (status === 'unauthenticated') {
        return <GuestHome />;
    }
    if (isAdmin) {
        return <AdminHome />;
    }
    if (needsOnboarding) {
        return <OnboardingHome />;
    }
    return <AppHome />;
}
