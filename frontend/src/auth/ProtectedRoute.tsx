import styled from '@emotion/styled'
import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'

import { useAuth } from './AuthProvider'

const LoadingScreen = styled.div`
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${({ theme }) => theme.colors.paleLavender};
    font-size: 1.2rem;
`;

function AuthLoading() {
    return (
        <LoadingScreen>
            Loading...
        </LoadingScreen>
    );
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
    const { status } = useAuth();
    if (status === 'loading') {
        return <AuthLoading />;
    }
    if (status === 'unauthenticated') {
        return <Navigate to = "/" replace />;
    }
    return children;
}

export function AdminRoute({ children }: { children: ReactNode }) {
    const { status, isAdmin } = useAuth();
    if (status === 'loading') {
        return <AuthLoading />;
    }
    if (status === 'unauthenticated' || !isAdmin) {
        return <Navigate to = "/" replace />;
    }
    return children;
}
