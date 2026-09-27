import styled from '@emotion/styled'

interface DeleteButtonProps {
    onClick?: () => void;
}

const DeleteButtonStyled = styled.button`
    background-color: ${({ theme }) => theme.colors.mutedRose};
    border-radius: 0;
    color: ${({ theme }) => theme.colors.royalPurple};
    border: 1px solid ${({ theme }) => theme.colors.royalPurple};
    min-width: 5.5rem;
    min-height: 3.4vh;
    padding: 0.55vh 1.1vw;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;

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