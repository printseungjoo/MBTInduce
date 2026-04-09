import styled from '@emotion/styled'

interface TwoMBTIsButtonProps {
    leftMBTILetter: string;
    rightMBTILetter: string;
    clicked: boolean;
    onClick?: () => void;
}

const TwoMBTIsButtonStyled = styled.button<{ clicked: boolean }>`
    background-color: ${({ theme, clicked }) => clicked ? theme.colors.softLavender : theme.colors.mutedViolet };
    color: ${({ theme }) => theme.colors.lightWhite};
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    position: relative;
    width: 40vw;
`;

export default function TwoMBTIsButton({ leftMBTILetter, rightMBTILetter, clicked, onClick }: TwoMBTIsButtonProps) {
    return(
        <TwoMBTIsButtonStyled clicked = { clicked } onClick = { onClick }>
            <span> { leftMBTILetter } </span>
            /
            <span> { rightMBTILetter } </span>
        </TwoMBTIsButtonStyled>
    )
}