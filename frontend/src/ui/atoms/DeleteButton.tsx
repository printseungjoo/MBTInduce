import styled from '@emotion/styled'

const DeleteButtonStyled = styled.button`
    background-color: ${({ theme }) => theme.colors.mutedRose};
    border-radius: 7px;
    color: ${({ theme }) => theme.colors.royalPurple};
    border: 0;
    height: 3vh;
    display: flex;
    align-items: center;
`;

export default function DeleteButton() {
    return(
        <DeleteButtonStyled>
            Delete
        </DeleteButtonStyled>
    )
}