import styled from '@emotion/styled'

interface TwoMBTIsButtonProps {
    leftMBTILetter: string;
    rightMBTILetter: string;
}

const TwoMMBTIsButtonStyled = styled.button`
    background-color: ${({ theme }) => theme.colors.mutedViolet};
    color: ${({ theme }) => theme.colors.lightWhite};
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    position: relative;
    width: 40vw;
`;

export default function TwoMBTIsButton({ leftMBTILetter, rightMBTILetter }: TwoMBTIsButtonProps) {
    return(
        <TwoMMBTIsButtonStyled>
            <span> { leftMBTILetter } </span>
            /
            <span> { rightMBTILetter } </span>
        </TwoMMBTIsButtonStyled>
    )
}