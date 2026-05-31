import styled from '@emotion/styled'
import { useState } from 'react'

import CenterPurpleP from '../atoms/CenterPurpleP'
import GoBackButton from '../atoms/GoBackButton'

interface EditSimulationProps {
    content: string;
    target: string;
    id: string;
}

const EditSimulationModalStyled = styled.div`
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
        width: 30vw;
        padding: 2vh 1vw;
    }
`;

const SimulationTextArea = styled.textarea`
    width: 98%;
    height: 20vh;
    resize: none;
    overflow-y: auto;
    box-sizing: border-box;
    padding: 1.5vh 1vw;

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
    const [changedContent, setChangedContent] = useState<string>('');

    async function editUserName(userName: string) {
        try {
            const response = await fetch(`${import.meta.env.API_BASE_URL}/api/simulation/userProfiles/${id}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: userName
                })
            });
            if (!response.ok) {
                throw new Error('Failed to patch simulation user name');
            }
            const data = await response.json();
            return data.session;
        } catch (error) {
            console.error(error);
        }
    }

    async function editUserMbti(userMbti: string) {
        try {
            const response = await fetch(`${import.meta.env.API_BASE_URL}/api/simulation/userProfiles/${id}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mbti: userMbti
                })
            });
            if (!response.ok) {
                throw new Error('Failed to patch simulation user mbti');
            }
            const data = await response.json();
            return data.session;
        } catch (error) {
            console.error(error);
        }
    }

    async function editSimulationContent(simulationContent: string) {
        try {
            const response = await fetch(`${import.meta.env.API_BASE_URL}/api/simulation/simulationTemplate/${id}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: simulationContent
                })
            });
            if (!response.ok) {
                throw new Error('Failed to patch simulation content');
            }
            const data = await response.json();
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
        <EditSimulationModalStyled>
            <CenterBox>
                <CenterPurpleP content = 'If you want to modify what you selected, please write down the content here.' />
                <SimulationTextArea value = { changedContent } onChange = {(e) => setChangedContent(e.target.value)}/>
                <GoBackButton />
                <SubmitButton isValid = { isValid } disabled = { !isValid } onClick = { clickSubmitButton }> Submit </SubmitButton>
            </CenterBox>
        </EditSimulationModalStyled>
    )
}