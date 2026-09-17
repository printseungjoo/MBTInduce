import styled from '@emotion/styled'

interface TwoMbtiProps {
    first: string;
    second: string;
    target: (t: boolean) => void;
    isFirstSelected: boolean;
    isSecondSelected: boolean;
}

const TwoMbtiStyled = styled.div`
    display: flex;
    border: 1px solid ${({ theme }) => theme.colors.mutedViolet};
    border-radius: 7px;
    background-color: ${({ theme }) => theme.colors.royalPurple};
    width: 50%;
`;

const FirstMbtiStyled = styled.button<{isFirstSelected: boolean}>`
    color: ${({ theme }) => theme.colors.lightWhite};
    font-weight: bolder;
    text-align: center;
    border: 1px solid transparent;
    background-color: ${({ theme, isFirstSelected }) => isFirstSelected ? theme.colors.mutedViolet : 'transparent'};
    width: 50%;
`;

const PurpleLine = styled.h3`
    color: ${({ theme }) => theme.colors.lightWhite};
    display: flex;
    align-items: center;
    font-weight: lighter;
`;

const SecondMbtiStyled = styled.button<{ isSecondSelected: boolean }>`
    color: ${({ theme }) => theme.colors.lightWhite};
    font-weight: bolder;
    text-align: center;
    border: 1px solid transparent;
    background-color: ${({ theme, isSecondSelected }) => isSecondSelected ? theme.colors.mutedViolet : 'transparent'};
    width: 50%;
`;

export default function TwoMbti({ first, second, target, isFirstSelected, isSecondSelected }: TwoMbtiProps) {
    return(
        <TwoMbtiStyled>
            <FirstMbtiStyled isFirstSelected = { isFirstSelected } onClick = {() => {
                target(true);
            }}>
                { first }
            </FirstMbtiStyled>
            <PurpleLine> | </PurpleLine>
            <SecondMbtiStyled isSecondSelected = { isSecondSelected } onClick = {() => {
                target(false);
            }}>
                { second }
            </SecondMbtiStyled>
        </TwoMbtiStyled>
    )
}