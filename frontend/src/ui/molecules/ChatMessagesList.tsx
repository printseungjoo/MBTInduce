import styled from '@emotion/styled'
import { useEffect, useRef } from 'react'

import type { ChatMessage } from '../../types/chat'
import UserChat from '../atoms/UserChat'
import AiChat from '../atoms/AiChat'

interface ChatMessagesListProps {
    messages: ChatMessage[];
    onRate: (messageId: string, rate: number) => void;
}

const ChatMessagesDiv = styled.div`
    width: 100%;
    flex: 1;
    margin: 2vh 0;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    gap: 2vh;
    min-height: 0;
    box-sizing: border-box;

    &::-webkit-scrollbar {
        width: 0.4rem;
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 0.2rem;
    }
`;

const ChatRow = styled.div<{ role: 'user' | 'ai' }>`
    display: flex;
    width: 100%;
    justify-content: ${({ role }) => (role === 'user' ? 'flex-end' : 'flex-start')};
    padding-right: ${({ role }) => (role === 'user' ? '1vw' : '0')};
    padding-left: ${({ role }) => (role === 'ai' ? '1vw' : '0')};
    box-sizing: border-box;
    flex-shrink: 0;
`;

export default function ChatMessagesList({ messages, onRate }: ChatMessagesListProps) {
    const chatMessagesRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const chatMessagesElement = chatMessagesRef.current;
        if (!chatMessagesElement) return;
        chatMessagesElement.scrollTop = chatMessagesElement.scrollHeight;
    }, [messages]);

    return (
        <ChatMessagesDiv ref = { chatMessagesRef }>
            {messages.map((chatMessage) => (
                <ChatRow key = { chatMessage.id } role = { chatMessage.role }>
                    {chatMessage.role === 'user' ? (
                        <UserChat content = { chatMessage.content } />
                    ) : (
                        <AiChat messageId = { chatMessage.id } content = { chatMessage.content } selectedRating = { chatMessage.rate } isStreaming = { chatMessage.isStreaming } onRate = { onRate } />
                    )}
                </ChatRow>
            ))}
        </ChatMessagesDiv>
    );
}
