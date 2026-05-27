import styled from '@emotion/styled'
import { useState } from 'react'

import CenterPurpleP from '../atoms/CenterPurpleP'
import Input from '../atoms/Input'
import GoBackButton from '../atoms/GoBackButton'

interface ScenarioRequest {
    content: string;
}

interface TargetInfoRequest {
    name: string;
    meOrNot: boolean;
    mbti: string;
}

interface MakeNewSimulationModalProps {
    onSubmitSuccess: () => void;
}

const InitialSimulationModalStyled = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 3;
`;

const CenterBox = styled.div`
    width: min(90vw, 36rem);
    max-height: 85vh;
    overflow-y: auto;
    background-color: ${({ theme }) => theme.colors.lightWhite};
    border-radius: 1rem;
    padding: 2vh 1rem;
    display: flex;
    flex-direction: column;
    gap: 1.5vh;
    box-sizing: border-box;

    @media screen and (min-width: 768px) {
        width: 40vw;
        padding: 2vh 1vw;
    }
`;

const ScenarioTextArea = styled.textarea`
    width: 98%;
    height: 20vh;
    resize: none;
    overflow-y: auto;
`;

const FlexDiv = styled.div`
    display: flex;
    gap: 5%;
`;

const SubmitButton = styled.button<{isValid: boolean}>`
    width: 100%;
    min-height: 4vh;
    height: auto;
    font-weight: bolder;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme, isValid }) => isValid ? theme.colors.paleLavender : theme.colors.coolGray};
    border-radius: 0;
`;

export default function MakeNewSimulationModal({ onSubmitSuccess }: MakeNewSimulationModalProps) {
    const [mbti, setMbti] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [scenario, setScenario] = useState<string>('');

    const mbtiRegex = /^[EIei][SNsn][FTft][JPjp]$/;
    const isMbtiValid = mbtiRegex.test(mbti);
    const isValid = isMbtiValid && name.trim() !== '' && scenario.trim() != '';

    const sendScenario = async() => {
        const simulationContent: ScenarioRequest = { content: scenario };
        try {
            const response = await fetch('http://localhost:4000/api/simulation/simulationTemplate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(simulationContent),
            })
            if (!response.ok) {
                throw new Error('Failed to send scenario')
            }
        } catch (error) {
            console.error('Error transmitting scenario:', error);
        }
    }

    const sendTargetInfo = async() => {
        const targetInfo: TargetInfoRequest = { name: name, meOrNot: false, mbti: mbti };
        try {
            const response = await fetch('http://localhost:4000/api/simulation/userProfiles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(targetInfo),
            })
            if (!response.ok) {
                throw new Error('Failed to send targetInfo')
            }
        } catch (error) {
            console.error('Error transmitting targetInfo:', error);
        }
    }

    const clickSubmitButton = async () => {
        try {
            await sendScenario();
            await sendTargetInfo();
            onSubmitSuccess();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <InitialSimulationModalStyled>
            <CenterBox>
                <CenterPurpleP content = 'Write down the situation where you want to turn simulation' />
                <ScenarioTextArea value = { scenario } onChange = {(e) => setScenario(e.target.value)}/>
                <CenterPurpleP content = 'Write down the name and MBTI of the person you want to turn simulation' />
                <FlexDiv>
                    <Input placeholder = 'Name' value = { name } onChange = {(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
                    <Input placeholder = 'MBTI' value = { mbti } onChange = {(e: React.ChangeEvent<HTMLInputElement>) => setMbti(e.target.value)} />
                </FlexDiv>
                <GoBackButton />
                <SubmitButton isValid = { isValid } disabled = { !isValid } onClick = { clickSubmitButton }> Submit </SubmitButton>
            </CenterBox>
        </InitialSimulationModalStyled>
    )
}