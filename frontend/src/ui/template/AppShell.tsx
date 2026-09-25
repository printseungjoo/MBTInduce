import styled from '@emotion/styled'
import { useEffect, useMemo, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'

import NavigationDrawer from '../organisms/NavigationDrawer'
import Hamburger from '../atoms/Hamburger'
import Title from '../atoms/Title'
import ErrorBoundary from './ErrorBoundary'

export type AppShellHandle = {
    title: string;
    hasRightScreen?: boolean;
    hasMobileRightPanel?: boolean;
}

export type AppShellOutletContext = {
    isMobileRightOpen: boolean;
    setIsMobileRightOpen: Dispatch<SetStateAction<boolean>>;
}

const FullScreen = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    overflow: hidden;
`;

const MainContent = styled.div<{ isOpen: boolean; hasRightScreen: boolean }>`
    margin-left: ${({ isOpen }) => isOpen ? '20%' : '0'};
    transition: margin-left 0.3s ease;
    width: ${({ isOpen, hasRightScreen }) => {
        if (isOpen && hasRightScreen) return '60%';
        if (isOpen && !hasRightScreen) return '80%';
        if (!isOpen && hasRightScreen) return '80%';
        return '100%';
    }};
    height: 100vh;
    box-sizing: border-box;
    padding: 1.5vh 1vw;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 0;
    overflow: hidden;

    @media screen and (max-width: 767px) {
        width: 100%;
        margin-left: 0;
        padding: 1rem 1rem 6.5rem;
    }
`;

const HeaderDiv = styled.div`
    display: flex;
    gap: 1vw;
    align-items: center;
    padding-top: 1vh;
    justify-content: space-between;
    width: 100%;
`;

const FlexColumnDiv = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-height: 0;
`;

const FlexDiv = styled.div`
    display: flex;
    align-items: center;
    gap: 2vw;
    padding-left: 1rem;
`;

const NavigationDrawerPlus = styled(NavigationDrawer)<{ isOpen: boolean }>`
    display: flex;
    position: fixed;
    height: 100vh;
`;

const DesktopOnlyHamburger = styled.div`
    display: block;

    @media screen and (max-width: 767px) {
        display: none;
    }
`;

const MobileRightHamburgerWrapper = styled.div`
    display: none;

    @media screen and (max-width: 767px) {
        display: block;
        flex-shrink: 0;
        z-index: 5;
    }
`;

const MobileBottomNav = styled.nav`
    display: none;

    @media screen and (max-width: 767px) {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        height: 4rem;
        display: flex;
        justify-content: space-around;
        align-items: center;
        background-color: ${({ theme }) => theme.colors.deepPlum};
        border-top: 1px solid ${({ theme }) => theme.colors.paleLavender};
        z-index: 30;
    }
`;

const MobileBottomNavItem = styled(NavLink)`
    width: 16.666%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    font-size: 1.55rem;
    color: ${({ theme }) => theme.colors.lightWhite};

    &.active {
        background-color: ${({ theme }) => theme.colors.midnightPurple};
    }
`;

const APP_SHELL_HANDLES: Record<string, AppShellHandle> = {
    '/Start': { title: 'Start' },
    '/MainChat': { title: 'Main Chat', hasRightScreen: true, hasMobileRightPanel: true },
    '/Simulation': { title: 'Simulation', hasRightScreen: true, hasMobileRightPanel: true },
    '/Calendar': { title: 'Calendar', hasRightScreen: true },
    '/History': { title: 'History' },
    '/Mypage': { title: 'Mypage' }
}

function useAppShellHandle() {
    const { pathname } = useLocation();
    return useMemo(() => APP_SHELL_HANDLES[pathname] ?? { title: '' }, [pathname]);
}

export default function AppShell() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isMobileRightOpen, setIsMobileRightOpen] = useState<boolean>(false);
    const location = useLocation();
    const navigate = useNavigate();
    const handle = useAppShellHandle();
    const hasRightScreen = Boolean(handle.hasRightScreen);
    const hasMobileRightPanel = Boolean(handle.hasMobileRightPanel);
    const outletContext: AppShellOutletContext = {
        isMobileRightOpen,
        setIsMobileRightOpen
    };

    function isClicked() {
        setIsOpen(!isOpen);
    }

    useEffect(() => {
        setIsMobileRightOpen(false);
    }, [location.pathname]);

    function handleSameTabClick(path: string) {
        if (location.pathname !== path) return;
        navigate(path, {
            replace: true,
            state: { reset: Date.now() }
        });
    }

    return (
        <FullScreen>
            <NavigationDrawerPlus isOpen = { isOpen } id = 'app-navigation-drawer'>
                <DesktopOnlyHamburger>
                    <Hamburger isClicked = { isClicked } isOpen = { isOpen } label = { isOpen ? 'Close navigation' : 'Open navigation' } controls = 'app-navigation-drawer' />
                </DesktopOnlyHamburger>
            </NavigationDrawerPlus>
            <MainContent isOpen = { isOpen } hasRightScreen = { hasRightScreen }>
                <FlexColumnDiv>
                    <HeaderDiv>
                        <FlexDiv>
                            {!isOpen && (
                                <DesktopOnlyHamburger>
                                    <Hamburger isClicked = { isClicked } isOpen = { isOpen } label = 'Open navigation' controls = 'app-navigation-drawer' />
                                </DesktopOnlyHamburger>
                            )}
                            <Title title = { handle.title } />
                        </FlexDiv>
                        {hasMobileRightPanel && (
                            <MobileRightHamburgerWrapper>
                                <Hamburger isClicked = {() => setIsMobileRightOpen((prev) => !prev)} isOpen = { isMobileRightOpen } label = { isMobileRightOpen ? 'Close side panel' : 'Open side panel' } controls = 'app-right-panel' />
                            </MobileRightHamburgerWrapper>
                        )}
                    </HeaderDiv>
                    <ErrorBoundary fullPage = { false }>
                        <Outlet context = { outletContext } />
                    </ErrorBoundary>
                </FlexColumnDiv>
            </MainContent>
            <MobileBottomNav aria-label = 'Main'>
                <MobileBottomNavItem to = "/Start" aria-label = 'Start'> 👋🏻 </MobileBottomNavItem>
                <MobileBottomNavItem to = "/MainChat" aria-label = 'Main Chat' onClick = {() => handleSameTabClick('/MainChat')}> 💬 </MobileBottomNavItem>
                <MobileBottomNavItem to = "/Simulation" aria-label = 'Simulation' onClick = {() => handleSameTabClick('/Simulation')}> 👥 </MobileBottomNavItem>
                <MobileBottomNavItem to = "/Calendar" aria-label = 'Calendar'> 📅 </MobileBottomNavItem>
                <MobileBottomNavItem to = "/History" aria-label = 'History'> 📄 </MobileBottomNavItem>
                <MobileBottomNavItem to = "/Mypage" aria-label = 'My Page'> 👤 </MobileBottomNavItem>
            </MobileBottomNav>
        </FullScreen>
    );
}
