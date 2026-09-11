import styled from '@emotion/styled'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { apiFetch } from '../../api/client'
import CenterPurpleP from '../atoms/CenterPurpleP'
import GoBackButton from '../atoms/GoBackButton'
import Modal from './Modal'

interface EditSimulationProps {
    content: string;
    target: string;
    id: string;
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

    @media screen and (max-width: 767px) {
        padding: 0.8vh 2vw;
    }
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

export default function EditSimulation({ target, id }: EditSimulationProps) {
    const navigate = useNavigate();
    const [changedContent, setChangedContent] = useState<string>('');

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
        if (!isValid) return;
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
        }
    };

    return (
        <Modal onClose = {() => navigate('/Start')}>
            <CenterPurpleP content = 'If you want to modify what you selected, please write down the content here.' />
            <SimulationTextArea value = { changedContent } onChange = {(e) => setChangedContent(e.target.value)}/>
            <GoBackButton />
            <SubmitButton isValid = { isValid } disabled = { !isValid } onClick = { clickSubmitButton }> Submit </SubmitButton>
        </Modal>
    )
}