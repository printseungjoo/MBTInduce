import styled from '@emotion/styled'

const RightScreenStyled = styled.div`
    width: 20%;
    height: 100vh;
    background-color: ${({ theme }) => theme.colors.deepPlum};
    position: fixed;
    right: 0;
    top: 0;
`;

export function RightScreen() {
    return(
        <RightScreenStyled />
    )
}