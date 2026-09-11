import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'

interface SkeletonProps {
    width?: string;
    height?: string;
    className?: string;
}

const pulse = keyframes`
    0%, 100% {
        opacity: 0.4;
    }
    50% {
        opacity: 0.85;
    }
`;

const SkeletonStyled = styled.div<{ width: string; height: string }>`
    width: ${({ width }) => width};
    height: ${({ height }) => height};
    background-color: ${({ theme }) => theme.colors.royalPurple};
    border-radius: 10px;
    animation: ${pulse} 1.2s ease-in-out infinite;
`;

export default function Skeleton({ width = '100%', height = '1.2rem', className }: SkeletonProps) {
    return (
        <SkeletonStyled width = { width } height = { height } className = { className } />
    );
}
