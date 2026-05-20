import styled from '@emotion/styled'

interface TwoMbtiProps {
    first: string;
    second: string;
}

const TwoMbtiStyled = styled.div`
    display: flex;
    border: 1px solid ${({ theme }) => theme.colors.mutedViolet};
    border-radius: 7px;
    background-color: ${({ theme }) => theme.colors.royalPurple};
    width: 50%;
`;

const OneMbtiStyled = styled.button`
    color: ${({ theme }) => theme.colors.lightWhite};
    font-weight: bolder;
    text-align: center;
    border: 1px solid transparent;
    background-color: transparent;
    width: 50%;
`;

const PurpleLine = styled.h3`
    color: ${({ theme }) => theme.colors.lightWhite};
    display: flex;
    align-items: center;
    font-weight: lighter;
`;

export default function TwoMbti({ first, second }: TwoMbtiProps) {
    return(
        <TwoMbtiStyled>
            <OneMbtiStyled>
                { first }
            </OneMbtiStyled>
            <PurpleLine> | </PurpleLine>
            <OneMbtiStyled>
                { second }
            </OneMbtiStyled>
        </TwoMbtiStyled>
    )
}