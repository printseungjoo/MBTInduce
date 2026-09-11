import styled from '@emotion/styled'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { apiFetch } from '../../api/client'
import type { ChatSession } from '../../types/chat'
import CenterPurpleP from '../atoms/CenterPurpleP'
import GoBackButton from '../atoms/GoBackButton'
import Modal from './Modal'

interface MakeNewMainChatModalProps {
    onSubmitSuccess: (session: ChatSession) => void;
}

const MainChatTextArea = styled.textarea`
    width: 98%;
    height: 20vh;
    resize: none;
    overflow-y: auto;
    box-sizing: border-box;
    padding: 1.5vh 1vw;
    background-color: ${({ theme }) => theme.colors.lightWhite};
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

export default function MakeNewMainChatModal({ onSubmitSuccess }: MakeNewMainChatModalProps) {
    const navigate = useNavigate();
    const [briefChatInfo, setBriefChatInfo] = useState<string>('');

    async function createChatSession(title: string) {
        try {
            const data = await apiFetch<{ session: ChatSession }>('/api/chatMessage/sessions', {
                method: 'POST',
                body: {
                    title
                }
            });
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
        <Modal desktopWidth = '40vw' onClose = {() => navigate('/Start')}>
            <CenterPurpleP content = 'Write down the brief information of chat you are going to talk about' />
            <MainChatTextArea value = { briefChatInfo } onChange = {(e) => setBriefChatInfo(e.target.value)}/>
            <GoBackButton />
            <SubmitButton isValid = { isValid } disabled = { !isValid } onClick = { clickSubmitButton }> Submit </SubmitButton>
        </Modal>
    )
}