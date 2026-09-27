import styled from '@emotion/styled'

interface EditButtonProps {
    onClick?: () => void;
}

const EditButtonStyled = styled.button`
    background-color: ${({ theme }) => theme.colors.softLavender};
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

export default function EditButton({ onClick }: EditButtonProps) {
    return(
        <EditButtonStyled onClick = { onClick }>
            Edit
        </EditButtonStyled>
    )
}