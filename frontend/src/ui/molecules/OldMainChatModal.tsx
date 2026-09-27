import styled from '@emotion/styled'
import { useState, useEffect } from 'react'

import { apiFetch } from '../../api/client'
import type { ChatSession } from '../../types/chat'
import GoBackButton from '../atoms/GoBackButton'
import OldMainChatButton from '../atoms/OldMainChatButton'
import LoadingBlock from './LoadingBlock'
import StatusMessage from './StatusMessage'
import Modal from './Modal'

interface OldMainChatModalProps {
    onConfirm: () => void;
    onSelectHistory: (history: ChatSession) => void;
    onBack: () => void;
}

const NoChatText = styled.p`
    color: ${({ theme }) => theme.colors.deepPlum};
    font-weight: bold;
    text-align: center;
`;

export default function OldMainChatModal({ onConfirm, onSelectHistory, onBack }: OldMainChatModalProps) {
    const [remove, setRemove] = useState<boolean>(false);
    const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
    const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

    const removeModal = () => {
        setRemove(true);
        onConfirm();
    }

    const clickHistory = (selectedHistory: ChatSession) => {
        onSelectHistory(selectedHistory);
        removeModal();
    }

    useEffect(() => {
        getChatSessions();
    }, []);

    async function getChatSessions() {
        setStatus('loading');
        try {
            const data = await apiFetch<{ sessions: ChatSession[] }>('/api/chatMessage/sessions');
            const mainOnlySessions = data.sessions.filter((session: ChatSession) => !session.title?.startsWith('simulation:'));
            setChatSessions(mainOnlySessions);
            setStatus('ready');
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    }

    return (
        <>
            {!remove && (
                <Modal desktopWidth = '50vw' onClose = { onBack }>
                {status === 'loading' && <LoadingBlock message = 'Loading chats...' />}
                {status === 'error' && (
                    <StatusMessage message = 'Could not load chat rooms.' onRetry = { getChatSessions } />
                )}
                {status === 'ready' && chatSessions.length === 0 && (
                    <NoChatText> There is no chat room left </NoChatText>
                )}
                {status === 'ready' && chatSessions.map((c) => (
                    <div key = { c.id } onClick = {() => clickHistory(c)}>
                        <OldMainChatButton chatContent = { c.title } />
                    </div>
                ))}
                    <GoBackButton content = 'Go back' onClick = { onBack } />
                </Modal>
            )}
        </>
    )
}