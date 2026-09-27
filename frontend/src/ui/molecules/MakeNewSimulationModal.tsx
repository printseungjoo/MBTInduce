import styled from '@emotion/styled'
import { useState } from 'react'

import { apiFetch } from '../../api/client'
import CenterPurpleP from '../atoms/CenterPurpleP'
import Input from '../atoms/Input'
import GoBackButton from '../atoms/GoBackButton'
import LoadingBlock from './LoadingBlock'
import Modal from './Modal'

interface ScenarioRequest {
    content: string;
}

interface TargetInfoRequest {
    name: string;
    meOrNot: boolean;
    mbti: string;
}

interface SimulationSelection {
    scenario: string;
    name: string;
    mbti: string;
}

interface MakeNewSimulationModalProps {
    onSubmitSuccess: (selection: SimulationSelection) => void;
    onBack: () => void;
}

const ScenarioTextArea = styled.textarea`
    width: 98%;
    height: 20vh;
    resize: none;
    overflow-y: auto;
    box-sizing: border-box;
    padding: 1.5vh 1vw;
    background-color: ${({ theme }) => theme.colors.lightWhite};
    color: ${({ theme }) => theme.colors.deepBlack};
    border: 1px solid ${({ theme }) => theme.colors.paleLavender};

    &:focus {
        border: 1px solid ${({ theme }) => theme.colors.softLavender};
        outline: none;
    }

    @media screen and (max-width: 767px) {
        padding: 0.8vh 2vw;
    }
`;

const FlexDiv = styled.div`
    display: flex;
    gap: 5%;
`;

const SubmitButton = styled.button<{isValid: boolean}>`
    width: 100%;
    min-height: 4.4vh;
    height: 4.4vh;
    padding: 0 1vw;
    font-weight: bolder;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme, isValid }) => isValid ? theme.colors.paleLavender : theme.colors.coolGray};
    border: 1px solid ${({ theme }) => theme.colors.paleLavender};
    border-radius: 8px;
    box-sizing: border-box;
`;

export default function MakeNewSimulationModal({ onSubmitSuccess, onBack }: MakeNewSimulationModalProps) {
    const [mbti, setMbti] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [scenario, setScenario] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const mbtiRegex = /^[EIei][SNsn][FTft][JPjp]$/;
    const isMbtiValid = mbtiRegex.test(mbti);
    const isValid = isMbtiValid && name.trim() !== '' && scenario.trim() != '';

    const sendScenario = async() => {
        const simulationContent: ScenarioRequest = { content: scenario };
        const data = await apiFetch<{ simulationTemplate?: { id?: string } }>('/api/simulation/simulationTemplate', {
            method: 'POST',
            body: simulationContent
        })
        const simulationTemplateId = data.simulationTemplate?.id;
        if (typeof simulationTemplateId !== 'string' || simulationTemplateId === '') {
            throw new Error('Failed to send scenario')
        }
        return simulationTemplateId;
    }

    const sendTargetInfo = async(simulationTemplateId: string) => {
        const targetInfo: TargetInfoRequest = { name: name, meOrNot: false, mbti: mbti };
        await apiFetch('/api/simulation/userProfiles', {
            method: 'POST',
            body: {
                ...targetInfo,
                simulationTemplateId
            }
        })
    }

    const clickSubmitButton = async () => {
        if (!isValid || isSubmitting) return;
        setIsSubmitting(true);
        try {
            const simulationTemplateId = await sendScenario();
            await sendTargetInfo(simulationTemplateId);
            onSubmitSuccess({
                scenario,
                name,
                mbti
            });
        } catch (error) {
            console.error(error);
            setIsSubmitting(false);
        }
    };

    return (
        <Modal desktopWidth = '40vw' onClose = { isSubmitting ? undefined : onBack }>
            {isSubmitting ? (
                <LoadingBlock message = 'Submitting...' />
            ) : (
                <>
                    <CenterPurpleP content = 'Write down the situation where you want to turn simulation' />
                    <ScenarioTextArea value = { scenario } onChange = {(e) => setScenario(e.target.value)}/>
                    <CenterPurpleP content = 'Write down the name and MBTI of the person you want to turn simulation' />
                    <FlexDiv>
                        <Input placeholder = 'Name' value = { name } onChange = {(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
                        <Input placeholder = 'MBTI' value = { mbti } onChange = {(e: React.ChangeEvent<HTMLInputElement>) => setMbti(e.target.value)} />
                    </FlexDiv>
                    <GoBackButton content = 'Go back' onClick = { onBack } />
                    <SubmitButton isValid = { isValid } disabled = { !isValid } onClick = { clickSubmitButton }> Submit </SubmitButton>
                </>
            )}
        </Modal>
    )
}