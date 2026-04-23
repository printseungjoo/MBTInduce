import styled from '@emotion/styled'

import Title from '../atoms/Title'
import WebsiteIntro from '../atoms/WebsiteIntro'
import TargetProfile from '../atoms/TargetProfile'

interface SimulationRightScreenProps {
    selectedScenario: string;
    selectedName: string;
    selectedMbti: string;
}

const SimulationRightScreenStyled = styled.div`
    height: 100vh;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 2vh 0;
`;

const FlexColumnDiv = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2vh;
`;

export default function SimulationRightScreen({ selectedScenario, selectedName, selectedMbti }: SimulationRightScreenProps) {
    return(
        <SimulationRightScreenStyled>
            <FlexColumnDiv>
                <Title title = 'Scenario' />
                <WebsiteIntro content = { selectedScenario } />
            </FlexColumnDiv>
            <FlexColumnDiv>
                <Title title = 'Conversation' />
                <TargetProfile meOrNot = '(me)' name = 'Seungjoo' mbti = 'ESFP' />
                <TargetProfile meOrNot = '' name = { selectedName } mbti = { selectedMbti } />
            </FlexColumnDiv>
        </SimulationRightScreenStyled>
    )
}