import styled from '@emotion/styled'

const GoBacktoAdminStyled = styled.button`
    width: 100%;
    min-height: 4vh;
    height: auto;
    font-weight: bolder;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.coolGray};
    border-radius: 0;
`;

export default function GoBacktoAdminButton() {
    const clickGoBacktoAdmin = () => {
        window.location.reload();
    };

    return(
        <GoBacktoAdminStyled onClick = { clickGoBacktoAdmin }>
            Go back
        </GoBacktoAdminStyled>
    )
}