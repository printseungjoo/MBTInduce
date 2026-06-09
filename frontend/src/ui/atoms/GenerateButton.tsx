import styled from '@emotion/styled'

interface GenerateButtonProps {
    className?: string;
    onClick?: () => Promise<void> | void;
    content: string;
}

const GenerateButtonStyled = styled.button`
    width: 100%;
    min-height: 4vh;
    height: auto;
    font-weight: bolder;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.coolGray};
    border-radius: 0;
    color: ${({ theme }) => theme.colors.deepBlack};
`;

export default function GenerateButton({ className, content, onClick }: GenerateButtonProps) {
    return(
        <GenerateButtonStyled className = { className } onClick = { onClick }>
            { content }
        </GenerateButtonStyled>
    )
}