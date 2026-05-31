import styled from '@emotion/styled'
import { useState } from 'react'

import CenterPurpleP from '../atoms/CenterPurpleP'
import GoBackButton from '../atoms/GoBackButton'

interface ChatSession {
    id: string;
    userId: string;
    title: string | null;
    isArchived: boolean;
    createdAt: string;
    updatedAt: string;
    _count?: {
        messages: number;
    };
}

interface MakeNewMainChatModalProps {
    onSubmitSuccess: (session: ChatSession) => void;
}

const InitialMainChatModalStyled = styled.div`
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

const MainChatTextArea = styled.textarea`
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

export default function MakeNewMainChatModal({ onSubmitSuccess }: MakeNewMainChatModalProps) {
    const [briefChatInfo, setBriefChatInfo] = useState<string>('');

    async function createChatSession(title: string) {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chatMessage/sessions`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to create chat session');
            }
            const data = await response.json();
            return data.session;
        } catch (error) {
            console.error(error);
        }
    }

    const isValid = briefChatInfo.trim() !== '';

    const clickSubmitButton = async () => {
        if (!isValid) return;
        try {
            const session = await createChatSession(briefChatInfo);
            if (!session) return;
            onSubmitSuccess(session);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <InitialMainChatModalStyled>
            <CenterBox>
                <CenterPurpleP content = 'Write down the brief information of chat you are going to talk about' />
                <MainChatTextArea value = { briefChatInfo } onChange = {(e) => setBriefChatInfo(e.target.value)}/>
                <GoBackButton />
                <SubmitButton isValid = { isValid } disabled = { !isValid } onClick = { clickSubmitButton }> Submit </SubmitButton>
            </CenterBox>
        </InitialMainChatModalStyled>
    )
}