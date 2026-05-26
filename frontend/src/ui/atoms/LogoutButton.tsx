import styled from '@emotion/styled'

interface LogoutButtonProps {
    onClick: () => void;
}

const LogoutButtonStyled = styled.button`
    background-color: ${({ theme }) => theme.colors.mutedRose};
    color: ${({ theme }) => theme.colors.lightWhite};
    width: 8.5vw;
    height: 3.5vh;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 0.7vh;

    @media screen and (max-width: 767px) {
        width: 20vw;
        height: 3vh;
    }
`;

export default function LogoutButton({ onClick }: LogoutButtonProps) {
    return(
        <LogoutButtonStyled onClick = { onClick }>
            Logout
        </LogoutButtonStyled>
    )
}