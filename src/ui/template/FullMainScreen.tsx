import styled from '@emotion/styled'
import { useState } from 'react'

import { NavigationDrawer } from '../organisms/NavigationDrawer'
import { Hamburger } from '../atoms/Hamburger';

const NavigationDrawerPlus = styled(NavigationDrawer)<{ isOpen: boolean }>`
    display: flex;
    position: fixed;
    height: 100vh;
`;

export function FullMainScreen() {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    function isClicked() {
        setIsOpen(!isOpen);
    }

    return (
        <>
            <Hamburger isClicked = { isClicked } />
            <NavigationDrawerPlus isOpen = { isOpen } />
        </>
    )
}