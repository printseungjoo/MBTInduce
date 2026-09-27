import styled from '@emotion/styled'
import { useState } from 'react'

import { apiFetch } from '../../api/client'
import type { ChatSession } from '../../types/chat'
import CenterPurpleP from '../atoms/CenterPurpleP'
import GoBackButton from '../atoms/GoBackButton'
import LoadingBlock from './LoadingBlock'
import Modal from './Modal'

interface MakeNewMainChatModalProps {
    onSubmitSuccess: (session: ChatSession) => void;
    onBack: () => void;
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

export default function MakeNewMainChatModal({ onSubmitSuccess, onBack }: MakeNewMainChatModalProps) {
    const [briefChatInfo, setBriefChatInfo] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
        if (!isValid || isSubmitting) return;
        setIsSubmitting(true);
        try {
            const session = await createChatSession(briefChatInfo);
            if (!session) {
                setIsSubmitting(false);
                return;
            }
            onSubmitSuccess(session);
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
                    <CenterPurpleP content = 'Write down the brief information of chat you are going to talk about' />
                    <MainChatTextArea value = { briefChatInfo } onChange = {(e) => setBriefChatInfo(e.target.value)}/>
                    <GoBackButton content = 'Go back' onClick = { onBack } />
                    <SubmitButton isValid = { isValid } disabled = { !isValid } onClick = { clickSubmitButton }> Submit </SubmitButton>
                </>
            )}
        </Modal>
    )
}