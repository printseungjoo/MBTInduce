import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import styled from '@emotion/styled'

interface ErrorBoundaryProps {
    children: ReactNode;
    fullPage?: boolean;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

const Fallback = styled.div<{ fullPage: boolean }>`
    min-height: ${({ fullPage }) => fullPage ? '100vh' : '0'};
    flex: ${({ fullPage }) => fullPage ? 'none' : 1};
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1.5vh;
    padding: 2rem 1.5rem;
    box-sizing: border-box;
    background-color: ${({ theme }) => theme.colors.midnightPurple};
`;

const Title = styled.h1`
    color: ${({ theme }) => theme.colors.lightWhite};
    font-size: 1.6rem;
    text-align: center;
`;

const Message = styled.p`
    color: ${({ theme }) => theme.colors.paleLavender};
    text-align: center;
`;

const RetryButton = styled.button`
    min-height: 4vh;
    padding: 0 1.5vw;
    font-weight: bolder;
    background-color: ${({ theme }) => theme.colors.coolGray};
    border-radius: 0;
    color: ${({ theme }) => theme.colors.deepBlack};
`;

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = {
        hasError: false
    };

    static getDerivedStateFromError() {
        return {
            hasError: true
        };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error(error, info);
    }

    render() {
        if (this.state.hasError) {
            const fullPage = this.props.fullPage !== false;
            return (
                <Fallback fullPage = { fullPage }>
                    <Title> Something went wrong </Title>
                    <Message> Please try again. </Message>
                    <RetryButton type = "button" onClick = {() => window.location.reload()}> Try again </RetryButton>
                </Fallback>
            );
        }
        return this.props.children;
    }
}
