import styled from '@emotion/styled'

interface NavigationDrawerProps {
    className?: string;
    isOpen: boolean;
}

const NavigationDrawerStyled = styled.div<{ isOpen: boolean }>`
    width: 20%;
    height: 100vh;
    background-color: ${({ theme }) => theme.colors.deepPlum};
    left: ${({ isOpen }) => isOpen ? '0' : '-100%'};
    transition: left 0.4s ease-in-out;
`

export function NavigationDrawer({ className, isOpen }: NavigationDrawerProps) {
    return(
        <NavigationDrawerStyled className = { className } isOpen = { isOpen }>
        </NavigationDrawerStyled>
    )
}