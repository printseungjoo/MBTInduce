import styled from '@emotion/styled'
import type { ReactNode } from 'react'

import { AppShellPortal } from './AppShellPortal'

interface RightScreenProps {
    isMobileOpen: boolean;
    children: ReactNode;
}

const RightScreenStyled = styled.div<{ isMobileOpen: boolean }>`
    width: 20%;
    max-width: 20%;
    height: 100vh;
    background-color: ${({ theme }) => theme.colors.deepPlum};
    position: fixed;
    right: 0;
    top: 0;
    box-sizing: border-box;
    padding: 1.5vh 1vw;
    overflow-y: hidden;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;

    & > * {
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        flex-shrink: 0;
    }

    @media screen and (max-width: 767px) {
        width: min(86vw, 22rem);
        max-width: min(86vw, 22rem);
        right: ${({ isMobileOpen }) => isMobileOpen ? '0' : '-100%'};
        padding: 4.5rem 1rem 1rem;
        transition: right 0.3s ease;
        overflow-y: auto;
    }
`;

export default function RightScreen({ isMobileOpen, children }: RightScreenProps) {
    return (
        <AppShellPortal>
            <RightScreenStyled isMobileOpen = { isMobileOpen } id = 'app-right-panel'>
                { children }
            </RightScreenStyled>
        </AppShellPortal>
    );
}
