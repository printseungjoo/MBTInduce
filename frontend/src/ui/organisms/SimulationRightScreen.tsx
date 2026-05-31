import styled from '@emotion/styled'
import { useState, useEffect } from 'react'

import Title from '../atoms/Title'
import WebsiteIntro from '../atoms/WebsiteIntro'
import TargetProfile from '../atoms/TargetProfile'

type profileInfo = {
    id: string,
    email: string,
    nickname: string | null,
    mbti: string | null
}

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
    const [profileInformation, setProfileInformation] = useState<profileInfo | null>(null);

    async function getProfile() {
        try {
            const response = await fetch(`${import.meta.env.API_BASE_URL}/api/profile`, {
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to get profile');
            }
            const data = await response.json();
            setProfileInformation(data.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getProfile();
    }, [])

    return(
        <SimulationRightScreenStyled>
            <FlexColumnDiv>
                <Title title = 'Scenario' />
                <WebsiteIntro content = { selectedScenario } />
            </FlexColumnDiv>
            <FlexColumnDiv>
                <Title title = 'Conversation' />
                <TargetProfile meOrNot = '(me)' name = { profileInformation?.nickname ?? undefined } mbti = { profileInformation?.mbti ?? undefined } />
                <TargetProfile meOrNot = '' name = { selectedName } mbti = { selectedMbti } />
            </FlexColumnDiv>
        </SimulationRightScreenStyled>
    )
}