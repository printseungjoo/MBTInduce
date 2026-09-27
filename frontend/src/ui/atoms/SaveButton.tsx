import styled from '@emotion/styled'

interface SaveButtonProps {
    onClick?: () => void;
    className?: string;
}

const SaveButtonStyled = styled.button`
    background-color: ${({ theme }) => theme.colors.softLavender};
    border-radius: 7px;
    color: ${({ theme }) => theme.colors.lightWhite};
    font-weight: bolder;
    border: 0;
    height: 4.5vh;
    min-height: 4.5vh;
    width: 100%;
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

export default function SaveButton({ className, onClick }: SaveButtonProps) {
    return(
        <SaveButtonStyled className = { className } onClick = { onClick }>
            Save
        </SaveButtonStyled>
    )
}