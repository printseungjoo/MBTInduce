import styled from '@emotion/styled'

import CenterPurpleP from './CenterPurpleP'

interface OldSimulationButtonProps {
    targetName: string;
    targetMbti: string;
    scenarioContent: string;
}

const OldSimulationButtonStyled = styled.button`
    background-color: transparent;
    width: 100%;
    border: 0.5px solid ${({theme}) => theme.colors.warmTaupe};
    display: flex;
    flex-direction: column;
    gap: 1vh;
`;

const FlexDiv = styled.div`
    display: flex;
    gap: 1vw;
`;

const TargetName = styled.div`
    border: 0.5px solid ${({ theme }) => theme.colors.midnightPurple};
    box-sizing: border-box;
    padding: 0.7vh 1vw;
`;

const TargetMbti = styled.div`
    border: 0;
    background-color: ${({ theme }) => theme.colors.softYellow};
    box-sizing: border-box;
    padding: 0.7vh 1vw;
`;

const CenterPurplePPlus = styled(CenterPurpleP)`
    text-align: left;
`;

export default function OldSimulationButton({ targetName, targetMbti, scenarioContent }: OldSimulationButtonProps) {
    return(
        <OldSimulationButtonStyled>
            <FlexDiv>
                <TargetName>
                    { targetName }
                </TargetName>
                <TargetMbti>
                    { targetMbti }
                </TargetMbti>
            </FlexDiv>
            <CenterPurplePPlus content = { scenarioContent }/>
        </OldSimulationButtonStyled>
    )
}