import styled from '@emotion/styled'

import Title from '../atoms/Title'
import WebsiteIntro from '../atoms/WebsiteIntro'
import TargetProfile from '../atoms/TargetProfile'

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

// They are dummy data. I will change and update them soon.
export default function SimulationRightScreen() {
    return(
        <SimulationRightScreenStyled>
            <FlexColumnDiv>
                <Title title = 'Scenario' />
                <WebsiteIntro content = "I'm working on a project with Mr.Ryu. I have to make a schedule and discuss the agenda at a meeting with him. I want to watch the simulation to see how he'll talk." />
            </FlexColumnDiv>
            <FlexColumnDiv>
                <Title title = 'Conversation' />
                <TargetProfile meOrNot = '(me)' name = 'Seungjoo' mbti = 'ESFP' />
                <TargetProfile meOrNot = '' name = 'Jibeom' mbti = 'ESTJ' />
            </FlexColumnDiv>
        </SimulationRightScreenStyled>
    )
}