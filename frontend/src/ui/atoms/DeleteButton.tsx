import styled from '@emotion/styled'

interface DeleteButtonProps {
    onClick?: () => void;
}

const DeleteButtonStyled = styled.button`
    background-color: ${({ theme }) => theme.colors.mutedRose};
    border-radius: 7px;
    color: ${({ theme }) => theme.colors.royalPurple};
    border: 0;
    height: 3vh;
    display: flex;
    align-items: center;

    &:focus {
        outline: none;
        box-shadow: none;
    }

    &:focus-visible {
        outline: none;
        box-shadow: none;
    }
`;

export default function DeleteButton({ onClick }: DeleteButtonProps) {
    return(
        <DeleteButtonStyled onClick = { onClick }>
            Delete
        </DeleteButtonStyled>
    )
}