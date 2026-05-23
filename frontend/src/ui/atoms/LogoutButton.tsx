import styled from '@emotion/styled'

const LogoutButtonStyled = styled.button`
    background-color: ${({ theme }) => theme.colors.mutedRose};
    color: ${({ theme }) => theme.colors.lightWhite};
    width: 8.5vw;
    height: 3.5vh;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 0.7vh;
`;

export default function LogoutButton() {
    return(
        <LogoutButtonStyled>
            Logout
        </LogoutButtonStyled>
    )
}