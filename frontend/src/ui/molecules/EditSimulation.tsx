import styled from '@emotion/styled'
import { useState } from 'react'

import { apiFetch } from '../../api/client'
import CenterPurpleP from '../atoms/CenterPurpleP'
import GoBackButton from '../atoms/GoBackButton'
import LoadingBlock from './LoadingBlock'
import Modal from './Modal'

interface EditSimulationProps {
    content: string;
    target: string;
    id: string;
    onBack: () => void;
}

const SimulationTextArea = styled.textarea`
    width: 98%;
    height: 20vh;
    resize: none;
    overflow-y: auto;
    box-sizing: border-box;
    padding: 1.5vh 1vw;
    background-color: ${({ theme }) => theme.colors.brightWhite};
    color: ${({ theme }) => theme.colors.deepBlack};
    border: 1px solid ${({ theme }) => theme.colors.paleLavender};

    &:focus {
        border: 1px solid ${({ theme }) => theme.colors.transparent};
        outline: none;
        box-shadow: none;
    }

    @media screen and (max-width: 767px) {
        padding: 0.8vh 2vw;
    }
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

export default function EditSimulation({ target, id, onBack }: EditSimulationProps) {
    const [changedContent, setChangedContent] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    async function editUserName(userName: string) {
        try {
            const data = await apiFetch<{ session: unknown }>(`/api/simulation/userProfiles/${id}`, {
                method: 'PATCH',
                body: {
                    name: userName
                }
            });
            return data.session;
        } catch (error) {
            console.error(error);
        }
    }

    async function editUserMbti(userMbti: string) {
        try {
            const data = await apiFetch<{ session: unknown }>(`/api/simulation/userProfiles/${id}`, {
                method: 'PATCH',
                body: {
                    mbti: userMbti
                }
            });
            return data.session;
        } catch (error) {
            console.error(error);
        }
    }

    async function editSimulationContent(simulationContent: string) {
        try {
            const data = await apiFetch<{ session: unknown }>(`/api/simulation/simulationTemplate/${id}`, {
                method: 'PATCH',
                body: {
                    content: simulationContent
                }
            });
            return data.session;
        } catch (error) {
            console.error(error);
        }
    }

    let isValid: boolean;
    if (target === 'userMbti') {
        const mbtiRegex = /^[EIei][SNsn][FTft][JPjp]$/;
        const isMbtiValid = mbtiRegex.test(changedContent);
        isValid = isMbtiValid && changedContent.trim() !== '';
    } else {
        isValid = changedContent.trim() !== '';
    }

    const clickSubmitButton = async () => {
        if (!isValid || isSubmitting) return;
        setIsSubmitting(true);
        try {
            if (target === 'userName') {
                await editUserName(changedContent);
            } else if (target === 'userMbti') {
                await editUserMbti(changedContent);
            } else {
                await editSimulationContent(changedContent);
            }
            window.alert('It is successfully changed.')
            window.location.reload();
        } catch (error) {
            console.error(error);
            setIsSubmitting(false);
        }
    };

    return (
        <Modal onClose = { isSubmitting ? undefined : onBack }>
            {isSubmitting ? (
                <LoadingBlock message = 'Submitting...' />
            ) : (
                <>
                    <CenterPurpleP content = 'If you want to modify what you selected, please write down the content here.' />
                    <SimulationTextArea value = { changedContent } onChange = {(e) => setChangedContent(e.target.value)}/>
                    <GoBackButton content = 'Go back' onClick = { onBack } />
                    <SubmitButton isValid = { isValid } disabled = { !isValid } onClick = { clickSubmitButton }> Submit </SubmitButton>
                </>
            )}
        </Modal>
    )
}