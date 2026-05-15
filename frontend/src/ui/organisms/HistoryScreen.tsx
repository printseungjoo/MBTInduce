import styled from '@emotion/styled'
import { useState, useEffect } from 'react'

import HistoryDiv from '../molecules/HistoryDiv'
import HistoryOptionButton from '../atoms/HistoryOptionButton'

interface SimulationTemplate {
    id: string;
    content: string;
    createdAt?: string;
}

interface UserProfile {
    id: string;
    name: string;
    meOrNot: boolean;
    mbti: string;
    createdAt?: string;
}

const Option = styled.div`
    width: 100%;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    border-bottom: 1px solid ${({ theme }) => theme.colors.royalPurple};
    margin-top: 1vh;
    padding-left: 2vw;
    margin-bottom: 1vh;
`;

export default function HistoryScreen() {
    const [optionSelected, setOptionSelected] = useState('Chat History');
    const [simulationTemplates, setSimulationTemplates] = useState<SimulationTemplate[]>([]);
    const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);

    async function getSimulationData() {
        try {
            const templateResponse = await fetch('http://localhost:4000/api/simulation/simulationTemplate', {
                method: 'GET',
                credentials: 'include',
            });
            const profileResponse = await fetch('http://localhost:4000/api/simulation/userProfiles', {
                method: 'GET',
                credentials: 'include',
            });
            if (!templateResponse.ok || !profileResponse.ok) {
                throw new Error('Failed to fetch simulation data');
            }
            const templateData = await templateResponse.json();
            const profileData = await profileResponse.json();
            setSimulationTemplates(templateData.simulationTemplate);
            setUserProfiles(profileData.userProfiles);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getSimulationData();
    }, [])

    return(
        <>
            <Option>
                <HistoryOptionButton name = 'Chat History' clicked = {() => setOptionSelected('Chat History')} selected = {optionSelected === 'Chat History'} />
                <HistoryOptionButton name = 'Simulation History' clicked = {() => setOptionSelected('Simulation History')} selected = {optionSelected === 'Simulation History'} />
                <HistoryOptionButton name = 'Schedule' clicked = {() => setOptionSelected('Schedule')} selected = {optionSelected === 'Schedule'} />
            </Option>
            {simulationTemplates.map((s, index) => {
                const user = userProfiles[index];
                return(
                    <HistoryDiv key = { s.id } title = { user?.name || '' } description = { s.content } date = { s.createdAt || '' } etc = { user?.mbti || '' }/>)
            })}
        </>
    )
}