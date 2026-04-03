import styled from '@emotion/styled'
import { useState } from 'react'

import { NavigationDrawer } from '../organisms/NavigationDrawer'
import { Hamburger } from '../atoms/Hamburger'
import { Title } from '../atoms/Title'
import { getURL } from '../atoms/getURL';

const MainContent = styled.div<{ isOpen: boolean }>`
    margin-left: ${({ isOpen }) => isOpen ? '24%' : '0'};
    transition: margin-left 0.3s ease;
    flex: 1;
`;

const HeaderDiv = styled.div`
    display: flex;
    gap: 3vw;
    align-items: center;
    padding-top: 2vh;
`;

const NavigationDrawerPlus = styled(NavigationDrawer) <{isOpen: boolean}>`
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
            <NavigationDrawerPlus isOpen = { isOpen }>
                <Hamburger isClicked = { isClicked } isOpen = { isOpen } />
            </NavigationDrawerPlus>
            <MainContent isOpen = { isOpen }>
                <HeaderDiv>
                    {!isOpen && <Hamburger isClicked = { isClicked } isOpen = { isOpen } />}
                    <Title title = { url } />
                </HeaderDiv>
            </MainContent>
        </>
    )
}