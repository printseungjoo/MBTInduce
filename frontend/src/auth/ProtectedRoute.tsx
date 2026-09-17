import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'

import { useAuth } from './AuthProvider'
import AuthSkeleton from '../ui/template/AuthSkeleton'

export function ProtectedRoute({ children }: { children: ReactNode }) {
    const { status } = useAuth();
    if (status === 'loading') {
        return <AuthSkeleton />;
    }
    if (status === 'unauthenticated') {
        return <Navigate to = "/" replace />;
    }
    return children;
}

export function AdminRoute({ children }: { children: ReactNode }) {
    const { status, isAdmin } = useAuth();
    if (status === 'loading') {
        return <AuthSkeleton />;
    }
    if (status === 'unauthenticated' || !isAdmin) {
        return <Navigate to = "/" replace />;
    }
    return children;
}
