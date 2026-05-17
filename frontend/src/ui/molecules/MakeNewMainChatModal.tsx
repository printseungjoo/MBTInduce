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
    background: rgba(0, 0, 0, 0.4);
    z-index: 3;
`;

const CenterBox = styled.div`
    width: 40vw;
    background-color: ${({ theme }) => theme.colors.lightWhite};
    border-radius: 1rem;
    padding: 2vh 1vw;
    display: flex;
    flex-direction: column;
    gap: 1.5vh;
`;

const MainChatTextArea = styled.textarea`
    width: 98%;
    height: 20vh;
    resize: none;
    overflow-y: auto;
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
            const response = await fetch('http://localhost:4000/api/chatMessage/sessions', {
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