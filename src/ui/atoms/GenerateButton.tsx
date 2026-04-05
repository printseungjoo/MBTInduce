import styled from '@emotion/styled'

interface GenerateButtonProps {
    className?: string;
}

const GenerateButtonStyled = styled.button`
    width: 100%;
    height: 4vh;
    font-weight: bolder;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.coolGray};
    border-radius: 0;
`;

export default function GenerateButton({ className }: GenerateButtonProps) {
    return(
        <GenerateButtonStyled className = { className }>
            Generate
        </GenerateButtonStyled>
    )
}