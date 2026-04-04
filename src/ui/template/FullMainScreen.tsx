import styled from '@emotion/styled'
import { useState } from 'react'

import { NavigationDrawer } from '../organisms/NavigationDrawer'
import { Hamburger } from '../atoms/Hamburger'
import { Title } from '../atoms/Title'
import { getURL } from '../atoms/GetURL';
import { RightScreen } from '../organisms/RightScreen'

const FullScreen = styled.div`
    width: 100vw;
    height: 100vh;
`;

const MainContent = styled.div<{ isOpen: boolean }>`
    margin-left: ${({ isOpen }) => isOpen ? '20%' : '0'};
    transition: margin-left 0.3s ease;
    width: 80%;
    height: 100vh;
    box-sizing: border-box;
    padding-left: 1%;
`;

const HeaderDiv = styled.div`
    display: flex;
    gap: 3vw;
    align-items: center;
    padding-top: 2vh;
`;

const NavigationDrawerPlus = styled(NavigationDrawer) <{ isOpen: boolean }>`
    display: flex;
    position: fixed;
    height: 100vh;
`;

export function FullMainScreen() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [url, setUrl] = useState(getURL);

    function isClicked() {
        setIsOpen(!isOpen);
    }

    return (
        <>
            <FullScreen>
                <NavigationDrawerPlus isOpen = { isOpen }>
                    <Hamburger isClicked = { isClicked } isOpen = { isOpen } />
                </NavigationDrawerPlus>
                <MainContent isOpen = { isOpen }>
                    <HeaderDiv>
                        {!isOpen && <Hamburger isClicked = { isClicked } isOpen = { isOpen } />}
                        <Title title = { url } />
                    </HeaderDiv>
                </MainContent>
                <RightScreen />
            </FullScreen>
        </>
    )
}