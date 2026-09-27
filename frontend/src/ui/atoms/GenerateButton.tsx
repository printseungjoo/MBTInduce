import styled from '@emotion/styled'

interface GenerateButtonProps {
    className?: string;
    onClick?: () => Promise<void> | void;
    content: string;
}

const GenerateButtonStyled = styled.button`
    width: 100%;
    min-height: 4.4vh;
    height: auto;
    padding: 1.1vh 1vw;
    font-weight: bolder;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.coolGray};
    border: 1px solid ${({ theme }) => theme.colors.mutedViolet};
    border-radius: 8px;
    box-sizing: border-box;
    color: ${({ theme }) => theme.colors.deepBlack};
`;

export default function GenerateButton({ className, content, onClick }: GenerateButtonProps) {
    return(
        <GenerateButtonStyled className = { className } onClick = { onClick }>
            { content }
        </GenerateButtonStyled>
    )
}